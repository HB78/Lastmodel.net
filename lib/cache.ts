/**
 * 🚀 Système de cache centralisé pour Last
 *
 * Utilise unstable_cache de Next.js 15 pour mettre en cache les requêtes Prisma
 * qui ne changent pas fréquemment.
 *
 * Pour invalider le cache après une mutation :
 * - `revalidateTag('origins')` → Invalide getCachedOrigins
 * - `revalidateTag('profiles')` → Invalide getCachedProfiles
 * - `revalidateTag('profile')` → Invalide tous les profils individuels
 * - `revalidatePath('/')` → Invalide toute la page d'accueil
 */

import { prisma } from '@/lib/prisma-setup/db';
import { unstable_cache } from 'next/cache';

/**
 * Cache la liste des origines
 * Cache pendant 1h (les origines changent rarement)
 *
 * 📍 Utilisé dans :
 * - app/page.tsx (page d'accueil)
 *
 * Pour invalider : revalidateTag('origins')
 */
export const getCachedOrigins = unstable_cache(
  async () => {
    return prisma.origin.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
  },
  ['origins'], // Cache key
  {
    revalidate: 3600, // 1 heure
    tags: ['origins'], // Tag pour invalidation ciblée
  }
);

/**
 * Cache la liste des profils complets avec filtres dynamiques
 * Cache pendant 5min (les profils changent fréquemment)
 *
 * 📍 Utilisé dans :
 * - app/page.tsx (page d'accueil avec filtres)
 *
 * 🔄 Invalider dans :
 * - actions/createProfile.ts → revalidateTag('profiles')
 * - actions/updateProfile.ts → revalidateTag('profiles')
 * - actions/deleteProfile.ts → revalidateTag('profiles')
 * - Stripe webhook (changement de plan) → revalidateTag('profiles')
 *
 * Pour invalider : revalidateTag('profiles')
 */
export const getCachedProfiles = unstable_cache(
  async (filters?: {
    gender?: string;
    sex?: string;
    originId?: string;
    ageMin?: number;
    ageMax?: number;
  }) => {
    const where: any = {};

    // Applique les filtres si fournis
    if (filters?.gender) {
      where.sex = filters.gender;
    }

    if (filters?.sex) {
      where.sex = filters.sex;
    }

    if (filters?.originId) {
      where.originId = filters.originId;
    }

    if (filters?.ageMin || filters?.ageMax) {
      where.age = {};
      if (filters.ageMin) where.age.gte = filters.ageMin;
      if (filters.ageMax) where.age.lte = filters.ageMax;
    }

    return prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        sex: true,
        age: true,
        city: true,
        photos: {
          where: { isMain: true },
          take: 1,
          select: {
            id: true,
            url: true,
            isMain: true,
          },
        },
        origin: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  },
  ['profiles'], // Cache key
  {
    revalidate: 300, // 5 minutes
    tags: ['profiles'],
  }
);

/**
 * Cache un profil individuel par ID
 * Cache pendant 10min
 *
 * 📍 Utilisé dans :
 * - app/produits/[id]/page.tsx (page profil individuel)
 *
 * 🔄 Invalider dans :
 * - actions/updateProfile.ts → revalidateTag(['profile', userId])
 * - actions/uploadPhoto.ts → revalidateTag(['profile', userId])
 * - actions/deletePhoto.ts → revalidateTag(['profile', userId])
 * - actions/addComment.ts → revalidateTag(['profile', profileId])
 * - actions/deleteComment.ts → revalidateTag(['profile', profileId])
 * - actions/likeProfile.ts → revalidateTag(['profile', profileId])
 *
 * Pour invalider un profil spécifique : revalidateTag(['profile', id])
 * Pour invalider tous les profils : revalidateTag('profile')
 */
export const getCachedProfile = (id: string) =>
  unstable_cache(
    async () => {
      return prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          sex: true,
          age: true,
          city: true,
          description: true,
          phone: true,
          taille: true,
          poids: true,
          photos: {
            select: {
              url: true,
              isMain: true,
            },
          },
          origin: {
            select: {
              name: true,
            },
          },
        },
      });
    },
    ['profile', id], // Cache key unique par profil
    {
      revalidate: 600, // 10 minutes
      tags: ['profile', `profile-${id}`], // Tags pour invalidation ciblée
    }
  )();

/**
 * Cache les stats globales du site (pour la page d'accueil ou footer)
 * Cache pendant 1h
 *
 * 📍 Utilisé dans :
 * - app/page.tsx (optionnel, si tu veux afficher des stats)
 * - components/Footer.tsx (optionnel)
 *
 * 🔄 Invalider dans :
 * - actions/createProfile.ts → revalidateTag('stats')
 * - actions/deleteProfile.ts → revalidateTag('stats')
 * - actions/likeProfile.ts (si match) → revalidateTag('stats')
 *
 * Pour invalider : revalidateTag('stats')
 */
export const getCachedStats = unstable_cache(
  async () => {
    const [totalUsers, totalProfiles, totalMatches] = await Promise.all([
      prisma.user.count(),
      prisma.user.count(),
      prisma.like.count(),
    ]);

    return {
      totalUsers,
      totalProfiles,
      totalMatches,
    };
  },
  ['stats'],
  {
    revalidate: 3600, // 1 heure
    tags: ['stats'],
  }
);
