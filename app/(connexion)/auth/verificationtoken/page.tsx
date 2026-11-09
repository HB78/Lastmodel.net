import CardWrapper from '@/components/auth/CardWrapper';
import { Button } from '@/components/ui/button';
import { getPlanByName } from '@/lib/stripe-setup/plan';
import { ArrowLeft, CheckCircle2, Eye, Sparkles } from 'lucide-react';
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

  // Prix de l'abonnement mensuel, affiché dans le choix "Publier mon annonce"
  const monthlyPrice = getPlanByName('MONTHLY').price;

  // ✅ CAS DE SUCCÈS : PAS DE TOKEN ET PAS D'ERREUR
  // Avec autoSignInAfterVerification: true, Better Auth redirige ici sans token quand c'est un succès
  if (!token && !error) {
    return (
      <CardWrapper
        headerLabel="Email vérifié !"
        headerLabelColor="text-green-600"
        // L'utilisateur est DÉJÀ connecté (autoSignInAfterVerification)
        // → "Retour à la connexion" n'avait pas de sens
        backButtonLabel="Aller à mon compte"
        backButtonHref="/profile"
        showSocial={false}
      >
        {/* 🔀 DEUX CHOIX après la vérification :
            1. publier une annonce (mis en avant : c'est ce qui fait vivre le site)
            2. juste regarder les profils (gratuit) */}
        <div className="space-y-4">
          {/* ① MODE ANNONCEUR : doré (fond doré très clair + bordure dorée)
              = le choix mis en avant (c'est ce qui fait vivre le site).
              Toute la carte est cliquable (c'est un lien) : comme elle
              grossit au survol, on s'attend à pouvoir cliquer partout.
              motion-safe : pas d'animation si l'utilisateur a demandé
              à réduire les animations sur son appareil. */}
          <Link
            href="/create"
            className="block rounded-2xl border-2 border-amber-500 bg-amber-50 p-5 text-gray-900 transition duration-200 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-600 motion-safe:hover:scale-[1.02]"
          >
            <ModeBadge className="bg-amber-100 text-amber-800">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              Mode annonceur
            </ModeBadge>

            <h2 className="mt-3 text-lg font-semibold">Publier mon annonce</h2>
            <p className="mt-1 text-sm text-gray-600">
              Apparaissez sur l&apos;accueil de Lastmodel.
            </p>

            {/* Les 2 étapes annoncées dès maintenant : pas de surprise
                quand on arrivera sur la page des abonnements */}
            <ol className="mt-4 space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-3">
                <StepNumber>1</StepNumber>
                Créez votre profil (photos, description…)
              </li>
              <li className="flex items-start gap-3">
                <StepNumber>2</StepNumber>
                {/* Prix lu dans lib/stripe-setup/plan.ts : suit tout seul
                    si le prix change */}
                Choisissez votre abonnement : {monthlyPrice} €/mois
              </li>
            </ol>

            {/* Pilule dorée pleine : l'action mise en avant.
                Texte foncé (et pas blanc) : le blanc sur doré se lit mal.
                C'est un <span> et pas un <button> : la carte entière est
                déjà le lien, on ne met pas un lien dans un lien */}
            <span className="mt-5 flex h-11 w-full items-center justify-center rounded-full bg-amber-500 font-semibold text-gray-900">
              Créer mon annonce
            </span>
          </Link>

          {/* ② MODE VISITEUR : fond blanc, bordure grise = plus discret */}
          <Link
            href="/"
            className="block rounded-2xl border border-gray-200 bg-white p-5 transition duration-200 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-purple-600 motion-safe:hover:scale-[1.02]"
          >
            <ModeBadge className="bg-gray-100 text-gray-700">
              <Eye className="h-3.5 w-3.5" aria-hidden="true" />
              Mode visiteur
            </ModeBadge>

            <h2 className="mt-3 text-lg font-semibold text-gray-900">
              Découvrir les profils
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Parcourez les profils, likez, commentez et gardez vos favoris.
              Gratuit.
            </p>

            {/* Pilule contour gris */}
            <span className="mt-5 flex h-11 w-full items-center justify-center rounded-full border border-gray-300 font-semibold text-gray-900">
              Voir les profils
            </span>
          </Link>
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

// Pastille numérotée (① ②) des étapes "Publier mon annonce"
function StepNumber({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-500 text-xs font-semibold text-gray-900"
      aria-hidden="true"
    >
      {children}
    </span>
  );
}

// Badge "Mode annonceur" / "Mode visiteur" en haut de chaque carte
function ModeBadge({
  className,
  children,
}: {
  className: string; // couleurs du badge (différentes selon la carte)
  children: React.ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold tracking-wide uppercase ${className}`}
    >
      {children}
    </span>
  );
}
