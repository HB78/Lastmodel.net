'use server';

import { auth } from '@/lib/better-auth-setup/auth';
import { getSession } from '@/tools';
import { headers } from 'next/headers';

export async function openBillingPortalAction() {
  const session = await getSession();

  if (!session?.user?.id) {
    throw new Error('Non autorisé');
  }

  if (session?.user?.subscriptionType === 'FREE') {
    throw new Error('Aucun abonnement actif');
  }

  // Utilise l'API serveur de Better Auth pour créer le portail Stripe
  const portal = await auth.api.createBillingPortal({
    headers: await headers(),
    body: {
      referenceId: session.user.id,
      returnUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/profile/billing`,
    },
  });

  if (!portal?.url) {
    throw new Error('URL du portail non reçue');
  }

  return { url: portal.url };
}
