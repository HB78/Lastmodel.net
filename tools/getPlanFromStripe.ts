import { auth } from '@/lib/better-auth-setup/auth';
import { getSession } from '@/tools';
import { headers } from 'next/headers';

// Fonction utilitaire pour récupérer l'abonnement actif d'un utilisateur
// Utilise auth.api.listActiveSubscriptions (API serveur de Better Auth)
// À utiliser UNIQUEMENT dans les Server Components
// Pour les Client Components, utiliser subscription.list() depuis authClient
export async function getActiveSubscription() {
  const session = await getSession();

  if (!session?.user?.id) {
    return null;
  }

  try {
    const subscriptions = await auth.api.listActiveSubscriptions({
      headers: await headers(),
      query: {
        referenceId: session.user.id,
      },
    });

    // Retourner le premier abonnement actif ou en période d'essai
    const activeSubscription = subscriptions?.find(
      (sub: any) => sub.status === 'active' || sub.status === 'trialing'
    );

    return activeSubscription || null;
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'abonnement:', error);
    return null;
  }
}
