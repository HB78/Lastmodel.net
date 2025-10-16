'use server';

import { auth } from '@/lib/better-auth-setup/auth';
import { prisma } from '@/lib/prisma-setup/db';
import { APIError } from 'better-auth/api';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

// Type pour l'état retourné
type DeleteUserState = {
  success: boolean;
  error: string | null;
  message: string | null;
};

export async function deleteUserAction(
  prevState: DeleteUserState, // État précédent (requis par useActionState)
  formData: FormData // Données du formulaire (non utilisé ici)
): Promise<DeleteUserState> {
  const headersList = await headers();

  try {
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

    // Récupérer l'userId depuis la session (plus sécurisé)
    const userId = session.user.id;
    const isAdmin = session.user.role === 'ADMIN';

    // Seul l'utilisateur peut supprimer son propre compte (pas les admins)
    // Si tu veux permettre aux admins de supprimer d'autres comptes,
    // il faudrait une autre action avec un userId en paramètre

    const findIfUserExist = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!findIfUserExist) {
      return {
        success: false,
        error: 'Utilisateur introuvable',
        message: null,
      };
    }

    const isSelf = findIfUserExist?.id === userId;

    // Empêcher un admin de se supprimer (sécurité/UX)
    if (isAdmin && isSelf) {
      return {
        success: false,
        error:
          'Les administrateurs ne peuvent pas supprimer leur propre compte',
        message: null,
      };
    }

    if (isSelf) {
      await prisma.user.delete({ where: { id: userId } });
      await auth.api.signOut({ headers: headersList });
      redirect('/signin');
    }

    if (isAdmin && !isSelf) {
      await prisma.user.delete({ where: { id: userId } });
      revalidatePath('/profile');
      revalidatePath('/');
      return {
        success: true,
        error: null,
        message: 'Compte supprimé avec succès',
      };
    }

    return {
      success: true,
      error: null,
      message: 'Compte supprimé avec succès',
    };
  } catch (err) {
    console.error('Erreur lors de la suppression:', err);

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
