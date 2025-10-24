'use server';

import { prisma } from '@/lib/prisma-setup/db';
import { getSession } from '@/tools';
import {
  CreateUserProfilFormData,
  CreateUserProfilSchema,
} from '@/zodSchema/updateUserSchema';
import { revalidatePath, revalidateTag } from 'next/cache';

export async function createUserProfilAction(formData: FormData) {
  // Extraire les données du FormData
  const images: string[] = [];
  let index = 0;
  while (formData.get(`image_${index}`)) {
    images.push(String(formData.get(`image_${index}`)));
    index++;
  }

  const rawData = {
    name: String(formData.get('name')),
    sex: String(formData.get('sex')) as 'homme' | 'femme',
    age: Number(formData.get('age')),
    phone: String(formData.get('phone')) || '',
    images: images,
    origin: String(formData.get('origin')),
    city: String(formData.get('city')),
    description: String(formData.get('description')),
    poids: Number(formData.get('poids')) || 0,
    taille: Number(formData.get('taille')) || 0,
  };

  const session = await getSession();
  const userId = session?.user.id;

  if (!session || !userId) {
    return { error: 'Session non trouvée', status: 401 };
  }

  try {
    const findUser = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        emailVerified: true,
        name: true,
        sex: true,
        age: true,
        phone: true,
        city: true,
        description: true,
        originId: true,
        poids: true,
        taille: true,
      },
    });

    if (!findUser) {
      return { error: 'Utilisateur non trouvé', status: 404 };
    }

    // Vérification de sécurité supplémentaire
    if (findUser.id !== userId) {
      return { error: 'Vous ne pouvez pas modifier ce profil', status: 404 };
    }

    if (!findUser.emailVerified) {
      return { error: 'Veuillez vérifier votre email', status: 401 };
    }

    // Validation avec le schéma Zod
    const validationResult = CreateUserProfilSchema.safeParse(rawData);

    if (!validationResult.success) {
      const firstError = validationResult.error.issues[0];
      return {
        error: firstError.message,
        field: firstError.path[0],
        status: 400,
      };
    }

    const validatedData: CreateUserProfilFormData = validationResult.data;

    // Trouver l'origine sélectionnée
    let originId: string | null = null;
    if (validatedData.origin) {
      const origin = await prisma.origin.findUnique({
        where: { name: validatedData.origin },
      });
      originId = origin?.id || null;
    }

    // Vérifier s'il y a déjà des photos
    const existingPhotos = await prisma.photo.findMany({
      where: { userId },
      select: { id: true },
    });

    // Supprimer les anciennes photos seulement s'il y en a
    if (existingPhotos.length > 0) {
      await prisma.photo.deleteMany({
        where: { userId },
      });
    }

    // Créer les nouvelles photos
    for (let i = 0; i < validatedData.images.length; i++) {
      await prisma.photo.create({
        data: {
          url: validatedData.images[i],
          isMain: i === 0, // Première image = principale
          order: i,
          userId,
        },
      });
    }

    // Mettre à jour le user existant
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        name: validatedData.name || findUser.name,
        sex: validatedData.sex || findUser.sex,
        age: validatedData.age || findUser.age,
        phone: validatedData.phone || findUser.phone || null,
        city: validatedData.city || findUser.city,
        description: validatedData.description || findUser.description,
        originId: originId,
        poids: validatedData.poids || findUser.poids || null,
        taille: validatedData.taille || findUser.taille || null,
        updatedAt: new Date(),
      },
    });

    // Forcer la revalidation des pages pour mettre à jour la session
    revalidatePath('/');
    revalidatePath('/profile');
    revalidatePath('/create');

    // Invalider le cache du profil individuel pour la page produit
    revalidateTag(`profile-${userId}`);
    revalidateTag('profiles'); // Pour la liste des profils sur la page d'accueil

    return { error: null, user, status: 200 };
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil:', error);
    return { error: 'Erreur interne du serveur', status: 500 };
  }
}
