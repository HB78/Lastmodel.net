'use server';

import { prisma } from '@/lib/prisma-setup/db';
import { deleteFileFromS3 } from '@/lib/s3-setup/aws-s3-config';
import { getSession } from '@/tools';

export async function deleteImagesAction(fileKey: string) {
  const session = await getSession();
  if (!session?.user.id) {
    return { success: false, message: 'Non authentifié' };
  }
  const findIfUserExist = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!findIfUserExist) {
    return { success: false, message: 'Utilisateur non trouvé' };
  }

  try {
    if (!fileKey) {
      return { success: false, message: 'File key is required' };
    }

    await deleteFileFromS3(fileKey);

    return { success: true, message: 'File deleted successfully' };
  } catch (error) {
    console.error('Error deleting image:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to delete file',
    };
  }
}
