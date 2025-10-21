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
      message: 'Le fichier ne peut pas dépasser 50MB',
    })
    .refine((file) => ALLOWED_MIME_TYPES.includes(file.type as any), {
      message:
        'Type de fichier non autorisé. Seules les images (JPEG, PNG, WebP, AVIF) sont acceptées',
    }),
  prefix: z.string().min(1).default('uploads'),
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

  //vu qu'on utilise count, on peut directement comparer avec 11 pas besoin de length
  // Calculer la limite selon le type d'abonnement
  const maxPhotos = session?.user?.subscriptionType === 'FREE' ? 1 : 11;

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
      prefix: data.get('prefix'),
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

    const { file, prefix, fileName } = validationResult.data;

    const url = await uploadFileToS3(file, fileName || undefined, prefix);

    // Extraire la clé S3 depuis l'URL pour la suppression
    const fileKey = url.replace(`${process.env.R2_URL}/`, '');

    return NextResponse.json(
      {
        url,
        id: fileKey, // Ajout de l'ID/clé S3 pour la suppression
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
