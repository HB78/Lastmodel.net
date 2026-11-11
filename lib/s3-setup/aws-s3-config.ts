// 🔒 server-only : ce fichier est un utilitaire INTERNE au serveur.
//
// ⚠️ Ne PAS remettre 'use server' ici !
// 'use server' en haut d'un fichier transforme chaque fonction exportée en
// server action = un endpoint HTTP appelable depuis le navigateur avec
// n'importe quels arguments. Or deleteFileFromS3 supprime ce qu'on lui donne
// SANS AUCUNE vérification → elle deviendrait une porte ouverte qui
// contourne les contrôles de deleteImagesAction / deletePhotoAction.
//
// 'server-only' fait l'inverse : si un composant 'use client' importe ce
// fichier, le build plante avec une erreur claire. La fonction reste donc
// utilisable uniquement par du code serveur (route.ts, server actions…),
// qui doit faire ses propres vérifications AVANT de l'appeler.
import 'server-only';

import {
  sanitizeFileName,
  validateFileContent,
} from '@/tools/protectS3Storage';
import {
  DeleteObjectCommand,
  DeleteObjectsCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';

const s3 = new S3Client({
  region: 'auto',
  endpoint: process.env.AWS_S3_API_URL || '',
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY || '',
  },
});

export async function uploadFileToS3(
  file: File,
  fileName: string | undefined,
  prefix: string
) {
  // 📁 ÉTAPE 1: Convertir le fichier en Buffer
  // Le fichier arrive du navigateur, on le convertit en format binaire
  const fileBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(fileBuffer);

  // 🔒 ÉTAPE 2: VALIDATION DU TYPE MIME
  // D'abord vérifier que le type MIME est autorisé
  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/avif',
  ] as const;
  type SupportedMimeType = (typeof allowedTypes)[number];

  if (!allowedTypes.includes(file.type as SupportedMimeType)) {
    throw new Error(
      `Type de fichier invalide. Seules les images JPEG, PNG, WebP et AVIF sont autorisées.`
    );
  }

  // 🔒 ÉTAPE 3: VALIDATION DU CONTENU DU FICHIER
  // On vérifie que c'est vraiment une image (pas un virus déguisé)
  // Cette fonction lit les premiers bytes du fichier pour vérifier sa signature
  if (!validateFileContent(buffer, file.type as SupportedMimeType)) {
    throw new Error(
      `Contenu du fichier invalide. Le fichier ne correspond pas au type déclaré.`
    );
  }

  // 🔒 NOM ULTRA-SÉCURISÉ
  // timestamp + randomSuffix : rendent le nom unique (2 users peuvent
  // envoyer chacun un "selfie.jpg" sans s'écraser)
  const timestamp = Date.now();
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  // L'extension vient TOUJOURS du vrai fichier (selfie.jpg → "jpg")
  const fileExtension = file.name.split('.').pop()?.toLowerCase();
  // Nom de base : fileName s'il y en a un, sinon le nom d'origine sans extension
  // ⚠️ fileName est toujours undefined sur le site (option inutilisée, voir
  // s3-upload/route.ts) → on tombe toujours sur le nom d'origine : "selfie"
  const baseFileName = fileName ?? file.name.replace(/\.[^/.]+$/, '');
  // Retire les caractères dangereux (espaces, "/", "..") du nom
  const safeBaseFileName = sanitizeFileName(baseFileName);
  const safeFileName = `${timestamp}-${randomSuffix}-${safeBaseFileName}.${fileExtension}`;
  // 🔑 Clé finale du fichier dans le bucket (son "chemin")
  // prefix est imposé par /api/s3-upload = images/{userId}
  // → ex: images/clx123alice/1730000000-ab12cd-photo.jpg
  // C'est ce "images/{userId}/" qui permet à deleteImagesAction
  // de vérifier à qui appartient le fichier.
  const uniqueFileName = `${prefix}/${safeFileName}`;

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME ?? '',
    Key: uniqueFileName,
    Body: buffer,
    ContentType: file.type,
    // 🔒 HEADERS DE SÉCURITÉ
    ContentDisposition: 'inline',
    CacheControl: 'max-age=31536000',
    Metadata: {
      'uploaded-by': 'app',
      'original-name': file.name.substring(0, 50),
    },
  });

  try {
    await s3.send(command);
    return `${process.env.R2_URL}/${uniqueFileName}`;
  } catch (error) {
    console.error('error: dans la config s3', error);
    throw new Error("Erreur lors de l'upload S3 : " + (error as Error).message);
  }
}

export async function deleteFileFromS3(key: string) {
  const command = new DeleteObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME ?? '',
    Key: key,
  });

  try {
    await s3.send(command);
    return true;
  } catch (error) {
    console.error('Erreur lors de la suppression S3 :', error);
    throw new Error(
      'Erreur lors de la suppression S3 : ' + (error as Error).message
    );
  }
}

// Supprime TOUT le dossier d'un utilisateur sur R2 : images/{userId}/
// (photos enregistrées + photos uploadées mais jamais enregistrées)
//
// ⚠️ Comme deleteFileFromS3, cette fonction ne vérifie RIEN elle-même.
// L'appeler UNIQUEMENT avec session.user.id (ou depuis le cron protégé par
// CRON_SECRET), JAMAIS avec un id envoyé par le navigateur.
export async function deleteUserFolderFromS3(userId: string) {
  const bucket = process.env.AWS_S3_BUCKET_NAME ?? '';

  // 1. Lister les fichiers du dossier
  //    Le "/" final évite de toucher le dossier d'un autre user dont l'id
  //    commencerait pareil (clx1 / clx123…)
  const list = await s3.send(
    new ListObjectsV2Command({ Bucket: bucket, Prefix: `images/${userId}/` })
  );

  // Dossier vide ou inexistant → rien à faire
  if (!list.Contents || list.Contents.length === 0) return;

  // 2. Les supprimer tous en une seule requête
  await s3.send(
    new DeleteObjectsCommand({
      Bucket: bucket,
      Delete: { Objects: list.Contents.map((file) => ({ Key: file.Key })) },
    })
  );
}
