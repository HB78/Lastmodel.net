'use server';

import { auth } from '@/lib/better-auth-setup/auth';
import { prisma } from '@/lib/prisma-setup/db';
import { getSession } from '@/tools';
import { ChangePasswordSchema } from '@/zodSchema/updateUserSchema';
import { APIError } from 'better-auth/api';
import { headers } from 'next/headers';

export async function changePasswordAction(formData: FormData) {
  const session = await getSession();
  if (!session?.user?.id) return { error: 'Non authentifié' };

  const accounts = await prisma.account.findMany({
    where: { userId: session.user.id },
    select: { providerId: true },
  });

  const hasCredentials = accounts.some(
    (a) => a.providerId === 'credentials' || a.providerId === 'credential'
  );

  if (!hasCredentials) {
    return { error: 'Mot de passe non modifiable pour un compte OAuth pur' };
  }
  // Extraire les données du FormData
  const rawData = {
    currentPassword: String(formData.get('currentPassword')),
    newPassword: String(formData.get('newPassword')),
    confirmPassword: String(formData.get('confirmPassword')),
  };

  // Valider avec Zod
  const validationResult = ChangePasswordSchema.safeParse(rawData);

  if (!validationResult.success) {
    const firstError = validationResult.error.issues[0];
    return {
      error: firstError.message,
      field: firstError.path[0],
    };
  }

  const { currentPassword, newPassword } = validationResult.data;

  try {
    // Better Auth gère déjà l'authentification et l'autorisation
    await auth.api.changePassword({
      headers: await headers(),
      body: {
        currentPassword,
        newPassword,
      },
    });

    return { error: null, success: 'mot de passe modifié' };
  } catch (err) {
    if (err instanceof APIError) {
      return { error: err.message };
    }

    return { error: 'Erreur interne du serveur' };
  }
}
