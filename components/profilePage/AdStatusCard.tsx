import { getMaxPhotos } from '@/lib/photoLimits';
import { prisma } from '@/lib/prisma-setup/db';
import { CheckCircle, Megaphone } from 'lucide-react';
import { Link } from 'next-view-transitions';

// 📣 ENCADRÉ "MON ANNONCE" DE /profile
// Dit à l'utilisateur où il en est et quelle est l'étape suivante.
//
//                    | pas d'annonce          | annonce remplie
// -------------------+------------------------+------------------------
// gratuit            | ① "Publier mon profil" | ② "Pas visible → formules"
// abonné             | ③ "Complétez l'annonce"| ④ "En ligne ✓"

export async function AdStatusCard({
  userId,
  isProfileComplete,
  subscriptionType,
}: {
  userId: string;
  isProfileComplete: boolean;
  subscriptionType?: string | null;
}) {
  // Même règle "payant" que lib/photoLimits.ts
  const isPaid =
    subscriptionType === 'MONTHLY' || subscriptionType === 'YEARLY';

  // ① VISITEUR : pas d'annonce, gratuit
  if (!isProfileComplete && !isPaid) {
    return (
      <AdShell>
        <p className="font-medium text-gray-900">
          Vous souhaitez être visible ?
        </p>
        <p className="mt-1 text-sm text-gray-600">
          Publiez votre profil sur Lastmodel. Il apparaîtra sur l&apos;accueil
          avec un abonnement Premium ou VIP.
        </p>
        <AdButton href="/create">Publier mon profil</AdButton>
      </AdShell>
    );
  }

  // ③ ABONNÉ sans annonce : il a payé, il reste à remplir le profil
  if (!isProfileComplete && isPaid) {
    return (
      <AdShell>
        <p className="font-medium text-gray-900">
          Dernière étape : complétez votre profil
        </p>
        <p className="mt-1 text-sm text-gray-600">
          Votre abonnement est actif. Remplissez votre profil pour apparaître
          sur l&apos;accueil.
        </p>
        <AdButton href="/create">Compléter mon profil</AdButton>
      </AdShell>
    );
  }

  // ② et ④ : l'annonce existe → on affiche le vrai nombre de photos
  // (remplace le "5/11" écrit en dur dans ImageGallerie)
  const photoCount = await prisma.photo.count({ where: { userId } });
  const maxPhotos = getMaxPhotos(subscriptionType);

  return (
    <AdShell>
      {isPaid ? (
        // ④ EN LIGNE
        <p className="flex items-center gap-2 font-medium text-gray-900">
          <CheckCircle className="h-5 w-5 text-green-600" aria-hidden="true" />
          Votre profil est en ligne
        </p>
      ) : (
        // ② ANNONCE REMPLIE MAIS GRATUIT (ou abonnement expiré)
        <>
          <p className="font-medium text-gray-900">
            Votre profil n&apos;est pas visible sur l&apos;accueil
          </p>
          <p className="mt-1 text-sm text-gray-600">
            Choisissez une formule pour le mettre en ligne.
          </p>
          <AdButton href="/pricing">Voir les formules</AdButton>
        </>
      )}

      <p className="mt-4 text-sm text-gray-600">
        Photos : {photoCount}/{maxPhotos}
      </p>

      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm">
        <Link
          href="/profile/edit"
          className="font-medium text-purple-700 hover:underline"
        >
          Modifier mes infos
        </Link>
        <Link
          href="/profile/photos"
          className="font-medium text-purple-700 hover:underline"
        >
          Gérer mes photos
        </Link>
        {isPaid && (
          <Link
            href={`/produits/${userId}`}
            className="font-medium text-purple-700 hover:underline"
          >
            Voir mon profil public
          </Link>
        )}
      </div>
    </AdShell>
  );
}

// Le cadre : même style que les autres cartes de /profile
function AdShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-white/50 bg-white/80 shadow-xl backdrop-blur-sm">
      <div className="border-b border-gray-100/50 p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-100 to-purple-200">
            <Megaphone className="h-5 w-5 text-purple-600" aria-hidden="true" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Mon annonce</h2>
        </div>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

// Le bouton d'action : pilule noire, comme sur les pages de connexion
function AdButton({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="mt-4 inline-flex h-11 items-center rounded-full bg-black px-6 font-semibold text-white hover:bg-black/80"
    >
      {children}
    </Link>
  );
}
