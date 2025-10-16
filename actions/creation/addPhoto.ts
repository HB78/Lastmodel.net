'use server';

import { prisma } from '@/lib/prisma-setup/db';
import { getSession } from '@/tools';
import { revalidatePath } from 'next/cache';

type ActionResult = {
  success: boolean;
  message: string;
  error?: string;
  photo?: {
    id: string;
    url: string;
    isMain: boolean;
    order: number;
  };
};

export async function addPhotoAction(photoUrl: string): Promise<ActionResult> {
  try {
    // Vérifier la session
    const session = await getSession();
    if (!session?.user.id) {
      return {
        success: false,
        message: 'Non authentifié',
        error: 'Vous devez être connecté pour ajouter une photo',
      };
    }

    // Vérifier la limite de photos (11 maximum)
    const existingPhotosCount = await prisma.photo.count({
      where: { userId: session.user.id },
    });

    if (existingPhotosCount >= 11) {
      return {
        success: false,
        message: 'Limite atteinte',
        error: 'Vous ne pouvez pas avoir plus de 11 photos',
      };
    }

    // Déterminer l'ordre de la nouvelle photo
    const lastPhoto = await prisma.photo.findFirst({
      where: { userId: session.user.id },
      orderBy: { order: 'desc' },
      select: { order: true, userId: true },
    });

    if (lastPhoto?.userId !== session.user.id) {
      return {
        success: false,
        message: 'Vous ne pouvez pas ajouter une photo à un autre utilisateur',
        error: 'Vous ne pouvez pas ajouter une photo à un autre utilisateur',
      };
    }

    const newOrder = lastPhoto ? lastPhoto.order + 1 : 0;

    // Créer la photo en base de données
    const newPhoto = await prisma.photo.create({
      data: {
        url: photoUrl,
        isMain: existingPhotosCount === 0, // Première photo = photo principale
        order: newOrder,
        userId: session.user.id,
      },
    });

    // Revalider les pages concernées
    revalidatePath('/profile/photos');
    revalidatePath('/profile');
    revalidatePath('/');

    return {
      success: true,
      message: 'Photo ajoutée avec succès',
      photo: {
        id: newPhoto.id,
        url: newPhoto.url,
        isMain: newPhoto.isMain,
        order: newPhoto.order,
      },
    };
  } catch (error) {
    console.error("Erreur lors de l'ajout de la photo:", error);
    return {
      success: false,
      message: "Erreur lors de l'ajout",
      error: "Une erreur est survenue lors de l'ajout de la photo",
    };
  }
}
