'use server';

import { prisma } from '@/lib/prisma-setup/db';
import { getSession } from '@/tools';
import { toggleLikeSchema } from '@/zodSchema/likes';
import { revalidatePath } from 'next/cache';
import { ZodError } from 'zod';

export async function toggleLikeAction(formData: FormData) {
  try {
    // 1. Vérification de l'authentification
    const session = await getSession();
    if (!session?.user.id) {
      return { error: 'Non authentifié', status: 401 };
    }

    // 2. Extraction et conversion des données FormData
    const rawData = {
      profileId: formData.get('profileId')?.toString() || '',
    };

    // 3. Validation avec Zod
    const validatedData = toggleLikeSchema.parse(rawData);

    // 4. Vérification que le profil à liker existe
    const targetProfile = await prisma.user.findUnique({
      where: { id: validatedData.profileId },
    });

    if (!targetProfile) {
      return { error: 'Profil non trouvé', status: 404 };
    }

    // 5. Vérification que l'utilisateur ne like pas son propre profil
    if (session.user.id === validatedData.profileId) {
      return {
        error: 'Vous ne pouvez pas liker votre propre profil',
        status: 400,
      };
    }

    // 6. Vérifier si un like existe déjà
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_profileId: {
          userId: session.user.id,
          profileId: validatedData.profileId,
        },
      },
    });

    let message: string;
    let isLiked: boolean;

    if (existingLike) {
      // 7a. Supprimer le like s'il existe (unlike)
      await prisma.like.delete({
        where: {
          id: existingLike.id,
        },
      });
      message = 'Like retiré avec succès';
      isLiked = false;
    } else {
      // 7b. Créer un nouveau like s'il n'existe pas
      await prisma.like.create({
        data: {
          userId: session.user.id,
          profileId: validatedData.profileId,
        },
      });
      message = 'Like ajouté avec succès';
      isLiked = true;
    }

    // 8. Revalider les pages pour mettre à jour l'affichage
    revalidatePath('/favorites');
    revalidatePath('/', 'layout');

    return {
      message,
      status: 200,
      isLiked,
    };
  } catch (error) {
    // Gestion des erreurs Zod
    if (error instanceof ZodError) {
      return {
        error: 'Données invalides',
        details: error.issues,
        status: 400,
      };
    }

    // Autres erreurs
    console.error('Erreur lors du toggle like:', error);
    return {
      error: 'Erreur serveur',
      status: 500,
    };
  }
}
