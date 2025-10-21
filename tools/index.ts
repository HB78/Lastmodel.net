import { auth } from '@/lib/better-auth-setup/auth';
import { prisma } from '@/lib/prisma-setup/db';
import { headers } from 'next/headers';

export const getSession = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return session;
};

export const getUser = async () => {
  const session = await getSession();

  if (!session) {
    return { message: 'Unauthorized', status: 401 };
  }

  try {
    // ✅ Vérification de cohérence
    const userExists = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true }, // On ne récupère que l'ID
    });

    if (!userExists) {
      return { message: 'User not found', status: 404 };
    }

    // ✅ Session validée, on peut faire confiance à session.user
    return { user: session.user };
  } catch (error) {
    return { message: 'Database error', status: 500 };
  }
};

// Fonction optimisée qui combine session et vérification de profil
export const getSessionWithProfileCheck = async () => {
  const session = await getSession();

  if (!session || !session?.user.id) {
    return { session: null, isProfileComplete: false };
  }

  try {
    // Une seule requête pour vérifier l'utilisateur ET son profil
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        age: true,
        description: true,
        city: true,
        photos: {
          where: { isMain: true },
          select: { id: true },
        },
      },
    });

    if (!user) {
      return { session: null, isProfileComplete: false };
    }

    // Vérifier que l'ID récupéré correspond bien à l'ID de la session
    if (user.id !== session.user.id) {
      return { session: null, isProfileComplete: false };
    }

    // Profil complet si tous les champs requis sont remplis
    const isProfileComplete = !!(
      user.age &&
      user.description &&
      user.city &&
      user.photos.length > 0
    );

    return {
      session,
      isProfileComplete,
    };
  } catch (error) {
    console.error('Session with profile check error:', error);
    return { session: null, isProfileComplete: false };
  }
};

// Dans la server action on fait gaffe a verifier si c'est du credential (donc à true)
// Dans cette fonction client on verifie si le user a un Oauth cad un provider google ou github etc
export const checkUserWithAccounts = async () => {
  const session = await getSession();

  if (!session || !session?.user.id) {
    return { session: null, provider: null as string | null, hasOAuth: false };
  }

  try {
    // RÉCUPÉRER LES COMPTES DE L'UTILISATEUR
    const userWithAccounts = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        account: {
          select: { providerId: true },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!userWithAccounts) {
      return {
        session: null,
        provider: null as string | null,
        hasCredentials: false,
      };
    }

    if (session?.user?.id !== userWithAccounts.id) {
      return {
        session: null,
        provider: null as string | null,
        hasCredentials: false,
      };
    }

    //on retourne le provider
    const isCredentialAccount = userWithAccounts.account?.some(
      (a) => a.providerId === 'credentials' || a.providerId === 'credential'
    );

    return {
      session,
      provider: userWithAccounts?.account?.[0]?.providerId ?? null,
      hasCredentials: isCredentialAccount, // ✅ CLAIR !
    };
  } catch (error) {
    console.error('error:', error);
    return {
      session: null,
      provider: null as string | null,
      hasCredentials: false,
    };
  }
};
