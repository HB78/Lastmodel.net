'use client';

import { subscription, useSession } from '@/lib/better-auth-setup/authClient';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useTransition } from 'react';
import { toast } from 'sonner';
import { Button } from '../ui/button';

type SubscribeButtonProps = {
  buttonText: string;
  planName: 'MONTHLY' | 'YEARLY';
  isPopular?: boolean;
  successUrl?: string;
  cancelUrl?: string;
};

export function SubscribeButton({
  buttonText,
  planName,
  isPopular = false,
  successUrl,
  cancelUrl,
}: SubscribeButtonProps) {
  const { data: session } = useSession();
  const [isPending, startTransition] = useTransition();

  if (!session?.user?.id) {
    return (
      <Button
        asChild // ✅ Important pour que Link fonctionne dans Button
        variant="default"
        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg hover:from-purple-700 hover:to-pink-700"
      >
        <Link href="/signup">Inscrivez-vous</Link>
      </Button>
    );
  }

  const handleSubscribe = () => {
    // Si pas de session, rediriger vers la page de connexion
    if (!session?.user) {
      toast.error('Vous devez être connecté pour vous abonner');
      return;
    }

    startTransition(async () => {
      try {
        const { data, error } = await subscription.upgrade({
          plan: planName.toLowerCase(), // 'monthly' ou 'yearly'
          successUrl:
            successUrl ||
            `${window.location.origin}/pricing/success?plan=${planName}`,
          cancelUrl: cancelUrl || `${window.location.origin}/pricing`,
          disableRedirect: false,
        });

        if (error) {
          toast.error(error.message || 'Une erreur est survenue');
          return;
        }

        // La redirection vers Stripe se fait automatiquement
        toast.success('Redirection vers le paiement...');
      } catch (error) {
        console.error('Erreur lors de la souscription:', error);
        toast.error('Une erreur est survenue lors de la souscription');
      }
    });
  };

  return (
    <Button
      variant={isPopular ? 'default' : 'outline'}
      className={
        isPopular
          ? 'w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg hover:from-purple-700 hover:to-pink-700'
          : 'w-full'
      }
      onClick={handleSubscribe}
      disabled={isPending}
    >
      {isPending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Chargement...
        </>
      ) : (
        buttonText
      )}
    </Button>
  );
}
