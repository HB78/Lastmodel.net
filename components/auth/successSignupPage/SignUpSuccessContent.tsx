import { Button } from '@/components/ui/button';
import { sendVerificationEmail } from '@/lib/better-auth-setup/authClient';
import { CheckCircle2, Mail, RefreshCw } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import { toast } from 'sonner';
import CardWrapper from '../CardWrapper';

export default function SignUpSuccessContent() {
  // Hooks pour la navigation et les paramètres URL
  const router = useRouter();
  const searchParams = useSearchParams();

  // États pour gérer le renvoi d'email
  const [isResending, startTransition] = useTransition(); // État de chargement du renvoi
  const [resendCount, setResendCount] = useState(0); // Compteur de tentatives de renvoi
  const [lastResendTime, setLastResendTime] = useState<number>(0); // Timestamp du dernier renvoi
  const [isMounted, setIsMounted] = useState(false); // État pour éviter l'erreur d'hydratation

  // Récupérer l'email depuis les paramètres URL (passé lors de la redirection)
  const userEmail = searchParams.get('email');

  // Éviter l'erreur d'hydratation en attendant que le composant soit monté
  useEffect(() => {
    setIsMounted(true);
  }, []);

  /**
   * Gère le renvoi de l'email de vérification
   * Inclut un système de rate limiting et de comptage des tentatives
   */
  const handleResendEmail = () => {
    // Vérifier que l'email existe
    if (!userEmail) {
      toast.error('Veuillez vous inscrire ou vous réinscrire.');
      return;
    }

    startTransition(async () => {
      try {
        // Rate limiting côté client : 60 secondes entre les envois
        const now = Date.now();
        const MIN_DELAY = 60 * 1000; // 60 secondes

        if (lastResendTime && now - lastResendTime < MIN_DELAY) {
          const remainingSeconds = Math.ceil((MIN_DELAY - (now - lastResendTime)) / 1000);
          toast.error(
            `Veuillez attendre ${remainingSeconds} secondes avant de renvoyer l'email.`
          );
          return;
        }

        // Appel à l'API Better Auth pour renvoyer l'email
        const { error } = await sendVerificationEmail({
          email: userEmail,
        });

        // Gestion des erreurs
        if (error) {
          console.error('Erreur renvoi email:', error);
          toast.error(error.message || "Erreur lors du renvoi de l'email");
          return;
        }

        // Mise à jour des états en cas de succès
        setResendCount((prev) => prev + 1); // Incrémenter le compteur
        setLastResendTime(now); // Enregistrer le timestamp
        toast.success('Email de vérification renvoyé !');
      } catch (error) {
        console.error('Erreur renvoi email:', error);
        toast.error("Erreur lors du renvoi de l'email");
      }
    });
  };

  // Afficher un état de chargement pendant l'hydratation
  if (!isMounted) {
    return (
      <CardWrapper
        headerLabel="🎉 Inscription réussie !"
        backButtonLabel="Retour à l'accueil"
        backButtonHref="/"
        showSocial={false}
      >
        <div className="text-center">
          <div className="animate-pulse">
            <div className="mx-auto mb-4 h-20 w-20 rounded-full bg-gray-200"></div>
            <div className="mx-auto mb-2 h-4 w-3/4 rounded bg-gray-200"></div>
            <div className="mx-auto h-4 w-1/2 rounded bg-gray-200"></div>
          </div>
        </div>
      </CardWrapper>
    );
  }

  return (
    <CardWrapper
      headerLabel="🎉 Inscription réussie !"
      backButtonLabel="Retour à l'accueil"
      backButtonHref="/"
      showSocial={false}
    >
      <div className="space-y-6">
        {/* Icône de succès avec animation */}
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
            <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Votre compte a été créé avec succès !
          </p>
        </div>

        {/* Section d'information sur la vérification email */}
        <div className="rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-5 dark:border-blue-800 dark:from-blue-900/20 dark:to-indigo-900/20">
          <div className="flex items-start space-x-4">
            {/* Icône email */}
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/40">
              <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <h3 className="mb-2 text-lg font-semibold text-blue-900 dark:text-blue-100">
                Vérifiez votre email
              </h3>
              <p className="text-sm leading-relaxed text-blue-700 dark:text-blue-300">
                Un email de confirmation a été envoyé à{' '}
                <strong>{userEmail || 'votre email'}</strong>. Cliquez sur le
                lien pour activer votre compte et commencer à l'utiliser.
              </p>
            </div>
          </div>
        </div>

        {/* Bouton d'action */}
        <div className="pt-2">
          {/* Bouton pour renvoyer l'email avec gestion des états */}
          <Button
            onClick={handleResendEmail}
            disabled={isResending || resendCount >= 3} // Désactivé si en cours ou limite atteinte
            variant="outline"
            className="h-11 w-full transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            {isResending ? (
              // État de chargement
              <div className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Renvoi en cours...</span>
              </div>
            ) : (
              // État normal
              <div className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4" />
                <span>Renvoyer l'email</span>
              </div>
            )}
          </Button>
        </div>

        {/* Information supplémentaire */}
      </div>
    </CardWrapper>
  );
}
