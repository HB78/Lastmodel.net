import { getMaxPhotos } from '@/lib/photoLimits';
import { prisma } from '@/lib/prisma-setup/db';
import { uploadFileToS3 } from '@/lib/s3-setup/aws-s3-config';
import { getSession } from '@/tools';
import { checkUploadRate } from '@/tools/protectS3Storage';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Types MIME autorisés pour les images
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/avif',
] as const;

// Taille maximale : 10MB
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB en octets

// Schéma de validation
const uploadSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.size > 0, {
      message: 'Le fichier ne peut pas être vide',
    })
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: 'Le fichier ne peut pas dépasser 10MB',
    })
    .refine((file) => ALLOWED_MIME_TYPES.includes(file.type as any), {
      message:
        'Type de fichier non autorisé. Seules les images (JPEG, PNG, WebP, AVIF) sont acceptées',
    }),
  fileName: z.string().optional().nullable(),
});

export async function POST(req: NextRequest) {
  // Vérification de l'authentification utilisateur
  const session = await getSession();

  if (!session?.user.id) {
    return NextResponse.json(
      { error: 'Authentification requise' },
      { status: 401 }
    );
  }
  // 🔒 VÉRIFIER LE RATE LIMIT
  if (!checkUploadRate(session.user.id)) {
    return NextResponse.json(
      { error: "Trop d'uploads, réessayez dans 1 heure" },
      { status: 429 }
    );
  }
  //verifier le nombre de photos deja uploadées, chaque user a droit a 11 photos
  const photos = await prisma.photo.count({
    where: {
      userId: session?.user.id,
    },
  });

  //vu qu'on utilise count, on peut directement comparer avec maxPhotos pas besoin de length
  // Limite selon l'abonnement → source unique : lib/photoLimits.ts
  // ⚠️ Ici on évite seulement de remplir R2 pour rien. La vraie protection
  // est dans addPhotoAction / createUserProfilAction (écriture en base).
  const maxPhotos = getMaxPhotos(session.user.subscriptionType);

  if (photos >= maxPhotos) {
    return NextResponse.json(
      {
        error: `Vous avez atteint la limite de ${maxPhotos} photo(s) pour votre
 abonnement ${session.user.subscriptionType}`,
      },
      { status: 400 }
    );
  }

  try {
    const data = await req.formData();

    // Validation avec Zod
    const validationResult = uploadSchema.safeParse({
      file: data.get('file'),
      fileName: data.get('fileName'),
    });

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validationResult.error.issues,
        },
        { status: 400 }
      );
    }

    const { file, fileName } = validationResult.data;

    // 🔒 LE DOSSIER EST IMPOSÉ PAR LE SERVEUR : images/{userId}/...
    // Avant, c'était le navigateur qui envoyait le dossier (prefix: 'images'),
    // donc toutes les photos étaient mélangées dans images/ et un user
    // pouvait même choisir d'écrire n'importe où dans le bucket.
    // Maintenant :
    // - session.user.id vient du cookie de session signé par Better Auth
    //   → impossible à falsifier, contrairement à ce qu'envoie le navigateur
    // - l'id du propriétaire est écrit DANS la clé du fichier
    //   → deleteImagesAction peut vérifier "ce fichier est-il à toi ?"
    //     avec un simple fileKey.startsWith(`images/${userId}/`)
    // Si le navigateur envoie encore un "prefix", il est simplement ignoré.
    const prefix = `images/${session.user.id}`;

    // 📤 ENVOI DU FICHIER SUR CLOUDFLARE R2
    // En français : "Range la photo (file), sans nom spécial (undefined),
    //               dans le dossier de l'utilisateur (prefix)."
    //
    // - file     : LA PHOTO elle-même (ex: selfie.jpg), déjà validée par Zod
    //              (taille, type). C'est le seul ingrédient vraiment important.
    // - fileName : option pour RENOMMER la photo. ⚠️ Inutilisée sur le site :
    //              le front ne l'envoie jamais, donc elle vaut toujours null.
    //   `|| undefined` : transforme ce null (ou un texte vide "") en undefined
    //              (= "rien"), car uploadFileToS3 n'accepte pas null.
    //              Résultat : pas de nom spécial → la photo garde son nom
    //              d'origine (selfie.jpg → ...-selfie.jpg).
    // - prefix   : le dossier imposé ci-dessus (images/{userId})
    //
    // uploadFileToS3 construit la clé finale :
    //   images/{userId}/{timestamp}-{random}-{nomNettoyé}.{ext}
    // et renvoie l'URL publique complète :
    //   https://pub-xxx.r2.dev/images/{userId}/1730000000-ab12cd-photo.jpg
    const url = await uploadFileToS3(file, fileName || undefined, prefix);

    // 🔑 LA CLÉ (fileKey) = le "chemin" du fichier dans le bucket
    // = l'URL sans le domaine R2 au début
    //   "https://pub-xxx.r2.dev/images/{userId}/...jpg" → "images/{userId}/...jpg"
    // ⚠️ Cette clé n'est PAS un secret : elle est visible dans l'URL de chaque
    // photo affichée sur le site. Ne jamais s'en servir comme preuve de propriété.
    const fileKey = url.replace(`${process.env.R2_URL}/`, '');

    return NextResponse.json(
      {
        url,
        // Le navigateur garde cette clé dans son state (usePhotoUpload.ts)
        // et la renverra à deleteImagesAction si l'user clique sur 🗑️.
        // Comme elle revient du navigateur, elle peut avoir été modifiée
        // → deleteImagesAction la revérifie systématiquement.
        id: fileKey,
        message: 'File uploaded successfully',
        filename: file.name,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: (error as Error).message || 'Upload failed',
      },
      { status: 500 }
    );
  }
}
