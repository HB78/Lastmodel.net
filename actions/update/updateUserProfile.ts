'use server';

import { prisma } from '@/lib/prisma-setup/db';
import { getSession } from '@/tools';
import { UpdateUserProfilSchema } from '@/zodSchema/updateUserSchema';
import { revalidatePath, revalidateTag } from 'next/cache';

type ActionResult = {
  error: string | null;
  status: number;
  message?: string;
  user?: any;
  field?: string;
};

export async function updateUserProfileAction(
  formData: FormData
): Promise<ActionResult> {
  const session = await getSession();

  if (!session?.user.id) {
    return { error: 'Non authentifié', status: 401 };
  }

  const findUser = await prisma.user.findUnique({
    where: { id: session.user.id },
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

  if (!findUser || findUser.id !== session.user.id) {
    return {
      error: 'Utilisateur non trouvé ou vous ne pouvez pas modifier ce profil',
      status: 404,
    };
  }
  if (!findUser.emailVerified) {
    return { error: 'Veuillez vérifier votre email', status: 401 };
  }

  const rawData = {
    name: String(formData.get('name')),
    sex: String(formData.get('sex')) as 'homme' | 'femme',
    age: Number(formData.get('age')),
    phone: String(formData.get('phone')) || '',
    city: String(formData.get('city')),
    origin: String(formData.get('origin')),
    description: String(formData.get('description')),
    poids: Number(formData.get('poids')) || 0,
    taille: Number(formData.get('taille')) || 0,
  };

  // Validation Zod
  const validationResult = UpdateUserProfilSchema.safeParse(rawData);

  if (!validationResult.success) {
    const firstError = validationResult.error.issues[0];
    return {
      error: firstError.message,
      field: String(firstError.path[0]),
      status: 400,
    };
  }

  const validatedData = validationResult.data;

  try {
    // Trouver l'ID de l'origine - On garde Prisma pour cette partie
    // car c'est une table personnalisée non gérée par Better Auth
    let originId: string | undefined = undefined;
    if (validatedData.origin) {
      const origin = await prisma.origin.findUnique({
        where: { name: validatedData.origin },
      });

      if (!origin) {
        return {
          error: `L'origine "${validatedData.origin}" n'existe pas`,
          status: 400,
        };
      }

      originId = origin.id;
    }

    // Mettre à jour directement avec Prisma pour les champs personnalisés
    // Utiliser les valeurs existantes comme fallback pour éviter de perdre des données
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: validatedData.name || findUser.name,
        sex: validatedData.sex || findUser.sex,
        age: validatedData.age || findUser.age,
        phone: validatedData.phone?.trim() || findUser.phone || null,
        city: validatedData.city || findUser.city,
        originId: originId || findUser.originId,
        description: validatedData.description || findUser.description,
        poids: validatedData.poids || findUser.poids || null,
        taille: validatedData.taille || findUser.taille || null,
        updatedAt: new Date(),
      },
    });

    // Revalider les pages pour mettre à jour l'UI
    revalidatePath('/', 'layout');

    // Invalider le cache du profil individuel pour la page produit
    revalidateTag(`profile-${session.user.id}`);
    revalidateTag('profiles'); // Pour la liste des profils sur la page d'accueil

    return {
      error: null,
      status: 200,
      message: 'Profil mis à jour avec succès !',
    };
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil:', error);
    return {
      error: 'Erreur interne du serveur',
      status: 500,
    };
  }
}
