'use server';

import { getMaxPhotos } from '@/lib/photoLimits';
import { prisma } from '@/lib/prisma-setup/db';
import { getSession } from '@/tools';
import { isOwnPhotoUrl } from '@/tools/protectS3Storage';
import { revalidatePath, revalidateTag } from 'next/cache';

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

    // 🔒 L'URL vient du navigateur → on vérifie que c'est bien une photo
    // uploadée par CET user sur notre R2 (voir isOwnPhotoUrl)
    if (!isOwnPhotoUrl(photoUrl, session.user.id)) {
      return {
        success: false,
        message: 'Photo invalide',
        error: "Cette photo n'a pas été uploadée depuis votre compte",
      };
    }

    // 🔒 Limite selon l'abonnement (2 en FREE, 11 en payant)
    // C'est ICI que la limite compte vraiment : c'est la base qui décide de ce
    // qui s'affiche. Celle de /api/s3-upload évite seulement de remplir R2 pour rien.
    const maxPhotos = getMaxPhotos(session.user.subscriptionType);
    const existingPhotosCount = await prisma.photo.count({
      where: { userId: session.user.id },
    });

    if (existingPhotosCount >= maxPhotos) {
      return {
        success: false,
        message: 'Limite atteinte',
        error: `Vous ne pouvez pas avoir plus de ${maxPhotos} photos`,
      };
    }

    // Déterminer l'ordre de la nouvelle photo
    // (l'ancien test lastPhoto?.userId !== session.user.id a été supprimé :
    // il bloquait TOUJOURS la 1ʳᵉ photo, car lastPhoto = null → undefined !== id,
    // et ne protégeait rien puisque le findFirst cherche déjà les photos de CET
    // user. La vraie protection, c'est isOwnPhotoUrl ci-dessus.)
    const lastPhoto = await prisma.photo.findFirst({
      where: { userId: session.user.id },
      orderBy: { order: 'desc' },
      select: { order: true },
    });

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

    // Invalider le cache du profil individuel pour la page produit
    revalidateTag(`profile-${session.user.id}`);
    revalidateTag('profiles'); // Pour la liste des profils sur la page d'accueil

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
