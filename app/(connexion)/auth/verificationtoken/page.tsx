import CardWrapper from '@/components/auth/CardWrapper';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import {
  ERROR_MESSAGES,
  getErrorColors,
  getErrorIcon,
} from './_component/getErrorTools';

// Interface pour les paramètres de la page (reçus via l'URL)
interface PageProps {
  searchParams: Promise<{ error?: string; token?: string }>;
}

export default async function VerificationTokenPage({
  searchParams,
}: PageProps) {
  // 🔍 RÉCUPÉRATION DES PARAMÈTRES DE L'URL
  // Exemple d'URL : /auth/verificationtoken?error=TOKEN_EXPIRED&token=abc123
  const { error, token } = await searchParams;

  // ✅ CAS DE SUCCÈS : PAS DE TOKEN ET PAS D'ERREUR
  // Avec autoSignInAfterVerification: true, Better Auth redirige ici sans token quand c'est un succès
  if (!token && !error) {
    return (
      <CardWrapper
        headerLabel="✅ Email vérifié !"
        backButtonLabel="Retour à la connexion"
        backButtonHref="/signin"
        showSocial={false}
      >
        <div className="space-y-6">
          {/* 🎉 ICÔNE DE SUCCÈS */}
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
              <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Votre email a été vérifié avec succès !
            </p>
          </div>

          {/* 📝 MESSAGE DE SUCCÈS */}
          <div className="rounded-xl border border-green-200 bg-green-50 p-5 dark:border-green-800 dark:bg-green-900/20">
            <div className="text-center">
              <h3 className="mb-2 text-lg font-semibold text-green-900 dark:text-green-100">
                Compte activé !
              </h3>
              <p className="text-sm leading-relaxed text-green-700 dark:text-green-300">
                Votre compte est maintenant actif. Vous pouvez vous connecter et
                commencer à utiliser l'application.
              </p>
            </div>
          </div>

          {/* 🔗 BOUTON D'ACTION */}
          <div className="pt-2">
            <Button
              asChild
              className="bg-primary hover:bg-primary/90 group h-11 w-full transition-all duration-200"
            >
              <Link href="/create">
                <ArrowLeft className="mr-2 h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
                Créer votre profil
              </Link>
            </Button>
          </div>
        </div>
      </CardWrapper>
    );
  }

  // 🚫 CAS D'ERREUR : PAS DE TOKEN MAIS AVEC ERREUR = PROBLÈME
  // Si pas de token mais une erreur, rediriger vers signup
  if (!token && error) {
    redirect('/signup?error=NO_TOKEN');
  }

  // ✅ CAS DE SUCCÈS AVEC TOKEN : VÉRIFICATION RÉUSSIE
  // Si on a un token mais pas d'erreur, la vérification a réussi
  if (token && !error) {
    return (
      <CardWrapper
        headerLabel="✅ Email vérifié !"
        backButtonLabel="Retour à la connexion"
        backButtonHref="/signin"
        showSocial={false}
      >
        <div className="space-y-6">
          {/* 🎉 ICÔNE DE SUCCÈS */}
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
              <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Votre email a été vérifié avec succès !
            </p>
          </div>

          {/* 📝 MESSAGE DE SUCCÈS */}
          <div className="rounded-xl border border-green-200 bg-green-50 p-5 dark:border-green-800 dark:bg-green-900/20">
            <div className="text-center">
              <h3 className="mb-2 text-lg font-semibold text-green-900 dark:text-green-100">
                Compte activé !
              </h3>
              <p className="text-sm leading-relaxed text-green-700 dark:text-green-300">
                Votre compte est maintenant actif. Vous pouvez vous connecter et
                commencer à utiliser l'application.
              </p>
            </div>
          </div>

          {/* 🔗 BOUTON D'ACTION */}
          <div className="pt-2">
            <Button
              asChild
              className="bg-primary hover:bg-primary/90 group h-11 w-full transition-all duration-200"
            >
              <Link href="/signin">
                <ArrowLeft className="mr-2 h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
                Se connecter maintenant
              </Link>
            </Button>
          </div>
        </div>
      </CardWrapper>
    );
  }

  // ❌ CAS D'ERREUR : GESTION DES ERREURS
  // Si on a un token mais aussi une erreur, quelque chose s'est mal passé

  // 🔧 PRÉPARATION DES DONNÉES POUR L'AFFICHAGE
  // Récupère le message d'erreur depuis notre dictionnaire
  const errorMessage =
    ERROR_MESSAGES[error || 'DEFAULT'] || ERROR_MESSAGES.DEFAULT;
  // Récupère l'icône appropriée
  const errorIcon = getErrorIcon(error || 'DEFAULT');
  // Récupère les couleurs appropriées
  const errorColors = getErrorColors(error || 'DEFAULT');

  // 🖥️ RENDU DE LA PAGE D'ERREUR
  return (
    <CardWrapper
      headerLabel="❌ Erreur de vérification"
      backButtonLabel="Retour à l'inscription"
      backButtonHref="/signup"
      showSocial={false}
    >
      <div className="space-y-6">
        {/* ❌ ICÔNE D'ERREUR */}
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
            {errorIcon}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Problème lors de la vérification
          </p>
        </div>

        {/* 📝 MESSAGE D'ERREUR */}
        <div className={`${errorColors} rounded-xl border p-5`}>
          <div className="text-center">
            <h3 className="mb-2 text-lg font-semibold">
              Erreur de vérification
            </h3>
            <p className="text-sm leading-relaxed">{errorMessage}</p>
          </div>
        </div>

        {/* 🔗 BOUTONS D'ACTION */}
        <div className="space-y-3 pt-2">
          {/* 🚀 BOUTON PRINCIPAL : RÉESSAYER L'INSCRIPTION */}
          <Button
            asChild
            className="bg-primary hover:bg-primary/90 group h-11 w-full transition-all duration-200"
          >
            <Link href="/signup">
              <ArrowLeft className="mr-2 h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
              Réessayer l'inscription
            </Link>
          </Button>

          {/* 🔄 BOUTON SECONDAIRE : ALLER À LA CONNEXION */}
          <Button
            variant="outline"
            asChild
            className="h-11 w-full transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <Link href="/signin">Aller à la connexion</Link>
          </Button>
        </div>
      </div>
    </CardWrapper>
  );
}
