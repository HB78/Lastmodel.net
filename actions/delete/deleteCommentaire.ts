'use server';

import { auth } from '@/lib/better-auth-setup/auth';
import { prisma } from '@/lib/prisma-setup/db';
import { APIError } from 'better-auth/api';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';

// Type pour l'état retourné
type DeleteCommentaireState = {
  success: boolean;
  error: string | null;
  message: string | null;
};

export async function deleteCommentaireAction(
  prevState: DeleteCommentaireState, // État précédent (requis par useActionState)
  formData: FormData // Données du formulaire
): Promise<DeleteCommentaireState> {
  const headersList = await headers();

  try {
    // 1. Vérification de l'authentification
    const session = await auth.api.getSession({
      headers: headersList,
    });

    if (!session || !session.user.id) {
      return {
        success: false,
        error: 'Vous devez être connecté',
        message: null,
      };
    }

    // 2. Récupérer l'ID du commentaire depuis FormData
    const commentaireId = formData.get('commentaireId')?.toString();

    if (!commentaireId) {
      return {
        success: false,
        error: 'ID du commentaire manquant',
        message: null,
      };
    }

    // 3. Vérifier que le commentaire existe et récupérer ses infos
    const commentaire = await prisma.commentaire.findUnique({
      where: { id: commentaireId },
      include: {
        author: {
          select: { id: true },
        },
      },
    });

    if (!commentaire) {
      return {
        success: false,
        error: 'Commentaire introuvable',
        message: null,
      };
    }

    if (commentaire.author.id !== session.user.id) {
      return {
        success: false,
        error: "Vous n'avez pas l'autorisation de supprimer ce commentaire",
        message: null,
      };
    }

    // 5. Supprimer le commentaire
    await prisma.commentaire.delete({
      where: { id: commentaireId },
    });

    // 6. Revalider la page du profil pour mettre à jour l'affichage
    revalidatePath(`/produits/${commentaire.profileId}`);

    return {
      success: true,
      error: null,
      message: 'Commentaire supprimé avec succès',
    };
  } catch (err) {
    console.error('Erreur lors de la suppression du commentaire:', err);

    if (err instanceof APIError) {
      return {
        success: false,
        error: err.message,
        message: null,
      };
    }

    return {
      success: false,
      error: 'Erreur interne du serveur',
      message: null,
    };
  }
}
