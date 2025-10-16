import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://lastmodel.net'; // URL de production

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/', // Routes API
          '/admin/', // Zone admin
          '/_next/', // Fichiers Next.js internes
          '/secret/', // Pages secrètes
          '/profile/*', // Profils utilisateurs (privé)
          '/favorites/*', // Favoris utilisateurs (privé)
          '/create/*', // Création de profil (privé)
          '/(connexion)/*', // Pages de connexion (privé)
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
