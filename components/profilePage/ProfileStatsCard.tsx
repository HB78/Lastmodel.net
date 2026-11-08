import { prisma } from '@/lib/prisma-setup/db';
import { getProfileViewStats } from '@/lib/profileViews';
import { getSession } from '@/tools';
import { BarChart3, Eye, Heart, Lock } from 'lucide-react';
import { Link } from 'next-view-transitions';

// 📊 BLOC STATISTIQUES DE /profile — réservé aux abonnés
//
// - Pas de cache : les chiffres doivent être frais, et ce sont de simples
//   count() sur des colonnes indexées (quelques millisecondes)
// - Utilisé dans <Suspense> (app/profile/page.tsx) : la page s'affiche
//   tout de suite, le squelette attend les chiffres
// - try/catch comme ProductGrid : si la base ne répond pas, seul ce bloc
//   affiche un message, le reste de /profile fonctionne

// Les chiffres renvoyés par fetchStats
type ProfileStats = {
  last7: number; // visites ces 7 derniers jours
  previous7: number; // visites les 7 jours d'avant (pour la flèche ↑↓)
  last30: number; // visites ces 30 derniers jours
  likes: number; // likes reçus (total)
};

const fetchStats = async (userId: string): Promise<ProfileStats> => {
  const [views, likes] = await Promise.all([
    getProfileViewStats(userId),
    prisma.like.count({ where: { profileId: userId } }),
  ]);
  return { ...views, likes };
};

export async function ProfileStatsCard() {
  // Session récupérée ici (comme ShowCommentaire)
  // → l'id vient du cookie signé, impossible de lire les stats d'un autre
  const session = await getSession();
  if (!session?.user.id) return null;

  // Même règle "payant" que lib/photoLimits.ts
  const isPaid =
    session.user.subscriptionType === 'MONTHLY' ||
    session.user.subscriptionType === 'YEARLY';

  // Compte gratuit → on montre ce qu'il rate, sans aucune requête
  if (!isPaid) {
    return (
      <StatsShell>
        <div className="flex flex-col items-center gap-3 py-4 text-center">
          <Lock className="h-8 w-8 text-gray-400" aria-hidden="true" />
          <p className="font-medium text-gray-900">
            Découvrez combien de personnes visitent votre profil
          </p>
          <p className="text-sm text-gray-600">
            Les statistiques sont réservées aux abonnés Premium et VIP.
          </p>
          <Link
            href="/pricing"
            className="rounded-xl bg-purple-100 px-6 py-2 font-medium text-purple-700 transition-colors hover:bg-purple-200"
          >
            Voir les abonnements
          </Link>
        </div>
      </StatsShell>
    );
  }

  let stats: ProfileStats;
  try {
    stats = await fetchStats(session.user.id);
  } catch (error) {
    console.error('Erreur lors du chargement des statistiques:', error);
    return (
      <StatsShell>
        <p className="py-4 text-center text-sm text-gray-600">
          Statistiques indisponibles pour le moment. Réessayez dans quelques
          instants.
        </p>
      </StatsShell>
    );
  }

  // Cette semaine comparée à la semaine d'avant
  const diff = stats.last7 - stats.previous7;
  const trend =
    diff === 0
      ? 'Stable par rapport à la semaine dernière'
      : `${diff > 0 ? '↑' : '↓'} ${Math.abs(diff)} par rapport à la semaine dernière`;

  return (
    <StatsShell>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatTile
          icon={<Eye className="h-5 w-5 text-purple-600" aria-hidden="true" />}
          label="Visites ces 7 derniers jours"
          value={stats.last7}
          hint={trend}
        />
        <StatTile
          icon={<Eye className="h-5 w-5 text-purple-600" aria-hidden="true" />}
          label="Visites ces 30 derniers jours"
          value={stats.last30}
        />
        <StatTile
          icon={<Heart className="h-5 w-5 text-rose-600" aria-hidden="true" />}
          label="Likes reçus"
          value={stats.likes}
        />
      </div>
      <p className="mt-4 text-xs text-gray-500">
        Un visiteur est compté une fois par jour. Vos propres visites ne sont
        pas comptées.
      </p>
    </StatsShell>
  );
}

// Squelette affiché pendant le chargement (fallback du <Suspense>)
export function ProfileStatsSkeleton() {
  return (
    <StatsShell>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-24 animate-pulse rounded-2xl bg-gray-100" />
        ))}
      </div>
    </StatsShell>
  );
}

// En-tête de carte : même style que les autres cartes de /profile
function StatsShell({ children }: { children: React.ReactNode }) {
  return (
    <section
      aria-labelledby="stats-title"
      className="mb-8 overflow-hidden rounded-3xl border border-white/50 bg-white/80 shadow-xl backdrop-blur-sm"
    >
      <div className="border-b border-gray-100/50 p-6">
        <div className="mb-2 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-100 to-pink-100">
            <BarChart3 className="h-5 w-5 text-purple-600" aria-hidden="true" />
          </div>
          <h2 id="stats-title" className="text-xl font-bold text-gray-900">
            Statistiques
          </h2>
        </div>
        <p className="text-sm text-gray-600">
          Combien de personnes s&apos;intéressent à votre profil
        </p>
      </div>
      <div className="p-6">{children}</div>
    </section>
  );
}

// Une case avec un chiffre
function StatTile({
  icon,
  label,
  value,
  hint,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl bg-gray-50 p-4">
      <div className="mb-2 flex items-center gap-2">
        {icon}
        <p className="text-sm text-gray-600">{label}</p>
      </div>
      <p className="text-3xl font-bold text-gray-900 tabular-nums">{value}</p>
      {hint && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
    </div>
  );
}
