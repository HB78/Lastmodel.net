'use server';

import { prisma } from '@/lib/prisma-setup/db';
import { getSession } from '@/tools';
import { createCommentaireSchema } from '@/zodSchema/commentaires';
import { revalidatePath } from 'next/cache';
import { ZodError } from 'zod';

export async function createCommentaireAction(formData: FormData) {
  try {
    // 1. Vérification de l'authentification
    const session = await getSession();
    if (!session?.user.id) {
      return { error: 'Non authentifié', status: 401 };
    }

    // 2. Extraction et conversion des données FormData
    const rawData = {
      commentaire: formData.get('commentaire')?.toString() || '',
      profileId: formData.get('profileId')?.toString() || '', // NOUVEAU
    };

    // 3. Validation avec Zod
    const validatedData = createCommentaireSchema.parse(rawData);

    // 4. Vérification que le profil à commenter existe
    const targetProfile = await prisma.user.findUnique({
      where: { id: validatedData.profileId },
    });

    if (!targetProfile) {
      return { error: 'Profil non trouvé', status: 404 };
    }

    // 5. Vérification que l'utilisateur ne commente pas son propre profil (optionnel)
    if (session.user.id === validatedData.profileId) {
      return {
        error: 'Vous ne pouvez pas commenter votre propre profil',
        status: 400,
      };
    }

    // 6. Création du commentaire avec la nouvelle structure
    const newCommentaire = await prisma.commentaire.create({
      data: {
        content: validatedData.commentaire,
        profileId: validatedData.profileId, // SUR QUEL profil
        authorId: session.user.id, // QUI écrit le commentaire
      },
    });

    // 7. Revalider la page du profil pour afficher le nouveau commentaire
    revalidatePath(`/profile/${validatedData.profileId}`);

    return {
      message: 'Commentaire créé avec succès',
      status: 200,
      // commentaire: newCommentaire,
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
    console.error('Erreur lors de la création du commentaire:', error);
    return {
      error: 'Erreur serveur',
      status: 500,
    };
  }
}
