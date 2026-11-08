import 'server-only';

import { prisma } from '@/lib/prisma-setup/db';
import { createHash } from 'crypto';
import { format, subDays } from 'date-fns';

// 📊 STATS DE VISITES DES PROFILS
//
// - recordProfileView   : appelée par app/produits/[id]/page.tsx à chaque visite
// - getProfileViewStats : appelée par /profile pour afficher les chiffres
//
// ⚠️ C'est une ESTIMATION, pas un comptage parfait :
// plusieurs personnes sur le même wifi + même téléphone = 1 visite,
// quelqu'un qui passe du wifi à la 4G = 2 visites. Suffisant pour
// "143 visites cette semaine".

// Robots (Google, aperçus de liens WhatsApp/Facebook…) : on ne les compte pas
const BOT_REGEX = /bot|crawler|spider|preview|facebookexternalhit/i;

// Le jour d'aujourd'hui à minuit, au format attendu par la colonne @db.Date
function getToday() {
  const today = format(new Date(), 'yyyy-MM-dd'); // "2026-11-08"
  return { today, todayDate: new Date(today) };
}

// Enregistre 1 visite. Ignore : le propriétaire, les robots, les doublons du jour.
export async function recordProfileView({
  profileId,
  viewerId,
  ip,
  userAgent,
}: {
  profileId: string;
  viewerId?: string; // userId si le visiteur est connecté
  ip: string;
  userAgent: string;
}) {
  if (viewerId === profileId) return; // le propriétaire se regarde lui-même
  if (BOT_REGEX.test(userAgent)) return;

  const { today, todayDate } = getToday();

  // 🔒 EMPREINTE ANONYME DU VISITEUR
  // - connecté     → son userId
  // - pas connecté → son IP + son navigateur
  // Le tout passé dans un hash (irréversible) avec un "sel" qui change
  // chaque jour (secret + date) :
  // - l'IP n'est jamais stockée en clair (RGPD)
  // - demain, le même visiteur aura une autre empreinte → impossible
  //   de le suivre d'un jour à l'autre
  const viewerKey = createHash('sha256')
    .update(
      `${process.env.BETTER_AUTH_SECRET}-${today}-${viewerId ?? `${ip}-${userAgent}`}`
    )
    .digest('hex');

  // skipDuplicates : si ce visiteur a déjà vu ce profil aujourd'hui,
  // la base ignore la ligne grâce au @@unique([profileId, viewerKey, day])
  await prisma.profileView.createMany({
    data: [{ profileId, viewerKey, day: todayDate }],
    skipDuplicates: true,
  });
}

// Les chiffres affichés dans /profile
// ⚠️ profileId doit venir de la SESSION, jamais du navigateur
// (sinon n'importe qui pourrait lire les stats d'un autre)
export async function getProfileViewStats(profileId: string) {
  const { todayDate } = getToday();

  const [last7, previous7, last30] = await Promise.all([
    // 7 derniers jours (aujourd'hui compris)
    prisma.profileView.count({
      where: { profileId, day: { gt: subDays(todayDate, 7) } },
    }),
    // les 7 jours d'avant → pour la flèche ↑↓
    prisma.profileView.count({
      where: {
        profileId,
        day: { gt: subDays(todayDate, 14), lte: subDays(todayDate, 7) },
      },
    }),
    // 30 derniers jours (aujourd'hui compris)
    prisma.profileView.count({
      where: { profileId, day: { gt: subDays(todayDate, 30) } },
    }),
  ]);

  return { last7, previous7, last30 };
}
