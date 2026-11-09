'use server';

import { getMaxPhotos } from '@/lib/photoLimits';
import { prisma } from '@/lib/prisma-setup/db';
import { getSession } from '@/tools';
import { isOwnPhotoUrl } from '@/tools/protectS3Storage';
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
        subscriptionType: true,
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

    // 🔒 VÉRIFICATION DES PHOTOS
    // validatedData.images = liste d'URLs envoyée par le navigateur
    // (CreateProductForm → image_0, image_1…). Zod vérifie seulement que ce
    // sont des textes → on vérifie nous-mêmes le NOMBRE et le CONTENU.
    // ⚠️ AVANT le deleteMany plus bas : si c'est refusé, on ne touche à rien.

    // ① Nombre : pas plus que ce que l'abonnement autorise
    // On compare images.length directement (et pas existantes + nouvelles)
    // car plus bas, les anciennes photos sont SUPPRIMÉES puis remplacées
    // par cette liste → c'est elle qui deviendra le total.
    const maxPhotos = getMaxPhotos(findUser.subscriptionType);
    if (validatedData.images.length > maxPhotos) {
      return {
        error: `Vous ne pouvez pas avoir plus de ${maxPhotos} photos`,
        field: 'images',
        status: 400,
      };
    }

    // ② Contenu : chaque URL doit être une photo uploadée par CET user
    // (voir isOwnPhotoUrl) → bloque la photo d'un autre user ou d'un autre site
    // .every() = true seulement si TOUTES les URLs passent le test
    if (!validatedData.images.every((url) => isOwnPhotoUrl(url, userId))) {
      return {
        error: "Une des photos n'a pas été uploadée depuis votre compte",
        field: 'images',
        status: 400,
      };
    }

    // Trouver l'origine sélectionnée
    let originId: string | null = null;
    if (validatedData.origin) {
      const origin = await prisma.origin.findUnique({
        where: { name: validatedData.origin },
      });
      originId = origin?.id || null;
    }

    // Supprimer les anciennes photos de l'user (s'il y en a)
    // Normalement il n'y en a pas à ce stade, sauf si :
    // - un envoi précédent a échoué à mi-chemin (photos écrites, mais
    //   user.update plus bas a planté, ex: téléphone déjà utilisé)
    //   → sans ça, les photos seraient en DOUBLE au 2ᵉ envoi
    // - l'action est appelée directement (elle ne vérifie pas que le profil
    //   est incomplet) → on REMPLACE les photos au lieu d'en empiler
    // Pas besoin de vérifier avant s'il y en a : deleteMany sur 0 ligne
    // ne fait rien et ne plante pas.
    // ⚠️ Seules les lignes en BASE sont supprimées, les fichiers restent
    // sur R2 (point 8 de l'audit).
    await prisma.photo.deleteMany({
      where: { userId },
    });

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

    // isPaid : le formulaire s'en sert pour choisir la page suivante
    // (gratuit → /pricing pour l'étape 2/2, abonné → /profile)
    const isPaid =
      findUser.subscriptionType === 'MONTHLY' ||
      findUser.subscriptionType === 'YEARLY';

    return { error: null, user, isPaid, status: 200 };
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil:', error);
    return { error: 'Erreur interne du serveur', status: 500 };
  }
}
