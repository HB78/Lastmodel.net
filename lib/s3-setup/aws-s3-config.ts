'use server';

import {
  sanitizeFileName,
  validateFileContent,
} from '@/tools/protectS3Storage';
import {
  DeleteObjectCommand,
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
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'] as const;
  type SupportedMimeType = typeof allowedTypes[number];

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
  const timestamp = Date.now();
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  const fileExtension = file.name.split('.').pop()?.toLowerCase();
  const baseFileName = fileName ?? file.name.replace(/\.[^/.]+$/, '');
  const safeBaseFileName = sanitizeFileName(baseFileName);
  const safeFileName = `${timestamp}-${randomSuffix}-${safeBaseFileName}.${fileExtension}`;
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
