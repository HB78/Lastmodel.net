import { prisma } from '@/lib/prisma-setup/db';
import type { MetadataRoute } from 'next';
import { unstable_cache } from 'next/cache';
import 'server-only';

/**
 * Récupère les profils actifs pour le sitemap avec cache de 1 heure
 * Cache invalidé automatiquement avec revalidateTag('profiles')
 */
const getProfilesForSitemap = unstable_cache(
  async () => {
    return await prisma.user.findMany({
      where: {
        emailVerified: true, // Seulement les profils avec email vérifié
      },
      select: {
        id: true,
        updatedAt: true,
      },
      orderBy: { updatedAt: 'desc' },
    });
  },
  ['sitemap-profiles'], // Cache key unique
  {
    revalidate: 3600, // Cache pendant 1 heure (3600 secondes)
    tags: ['profiles'], // Tag pour invalidation manuelle avec revalidateTag('profiles')
  }
);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = (
    process.env.NEXT_PUBLIC_APP_URL || 'https://lastmodel.com'
  ).replace(/\/$/, '');

  // Récupère les profils depuis le cache (ou BDD si cache expiré)
  const profiles = await getProfilesForSitemap();

  return [
    // Page d'accueil
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    // Pages principales
    {
      url: `${baseUrl}/pricing`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    // Pages légales
    {
      url: `${baseUrl}/legal/mentions-legales`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/legal/politique-confidentialite`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/legal/conditions-utilisation`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    // Contact
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.4,
    },
    // Pages guides et aide
    {
      url: `${baseUrl}/chat/faq`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/chat/guide-profil`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/chat/conseils-rencontre`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/chat/securite`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },

    // Profils dynamiques (ajoutés automatiquement)
    ...profiles.map(
      (profile) =>
        ({
          url: `${baseUrl}/produits/${profile.id}`,
          lastModified: new Date(profile.updatedAt),
          changeFrequency: 'weekly',
          priority: 0.6,
        }) as const
    ),
  ];
}
