import type { Metadata } from 'next';

// 🏗️ FACTORY POUR GÉNÉRER LES METADATA DE PROFILS
// Centralise toute la logique SEO pour éviter la duplication

// Type pour les données produit nécessaires au SEO
interface ProductForSEO {
  id: string;
  name: string;
  age: number | null;
  city: string | null;
  description: string | null;
  photos: Array<{
    url: string;
    isMain: boolean;
  }>;
  origin?: {
    name: string;
  } | null;
}

// Configuration SEO centralisée
const SEO_CONFIG = {
  siteName: 'Lastmodel - Site de Rencontre',
  defaultImage: '/placeholder-avatar.jpg',
  maxDescriptionLength: 155, // Limite Google
  keywords: {
    base: ['rencontre', 'site de rencontre', 'célibataires', 'amour', 'dating'],
  },
} as const;

/**
 * Génère un titre optimisé pour le SEO
 * Format: "Nom, âge à ville - Lastmodel"
 */
function generateTitle(product: ProductForSEO): string {
  const parts = [product.name];

  if (product.age) {
    parts.push(`${product.age} ans`);
  }

  if (product.city) {
    parts.push(`à ${product.city}`);
  }

  return `${parts.join(', ')} - Lastmodel`;
}

/**
 * Génère une description riche pour les moteurs de recherche
 * Inclut: nom, âge, ville, origine, début de description
 */
function generateDescription(product: ProductForSEO): string {
  const parts = [`Découvrez le profil de ${product.name}`];

  if (product.age) {
    parts.push(`${product.age} ans`);
  }

  if (product.city) {
    parts.push(`à ${product.city}`);
  }

  if (product.origin?.name) {
    parts.push(`d'origine ${product.origin.name}`);
  }

  let description = parts.join(', ') + '.';

  // Ajouter le début de la description personnelle si disponible
  if (product.description) {
    const remainingLength =
      SEO_CONFIG.maxDescriptionLength - description.length - 4; // -4 pour " ..."
    if (remainingLength > 20) {
      const truncatedDesc = product.description.substring(0, remainingLength);
      description += ` ${truncatedDesc}...`;
    }
  } else {
    description += ' Rencontrez des personnes authentiques sur Lastmodel.';
  }

  return description;
}

/**
 * Génère les mots-clés SEO dynamiques
 */
function generateKeywords(product: ProductForSEO): string[] {
  const keywords: string[] = [...SEO_CONFIG.keywords.base];

  // Ajouter le nom (filtré pour éviter les caractères spéciaux)
  const safeName = product.name.replace(/[^a-zA-Z0-9\s]/g, '').trim();
  if (safeName) keywords.push(safeName);

  // Ajouter la ville
  if (product.city) keywords.push(product.city);

  // Ajouter l'origine
  if (product.origin?.name) keywords.push(product.origin.name);

  return keywords.filter(Boolean);
}

/**
 * Récupère l'URL de l'image principale
 */
function getMainImageUrl(product: ProductForSEO): string {
  const mainPhoto =
    product.photos.find((photo) => photo.isMain) || product.photos[0];
  return mainPhoto?.url || SEO_CONFIG.defaultImage;
}

/**
 * 🚀 FONCTION PRINCIPALE : Crée les metadata complètes pour un profil
 *
 * @param product - Données du produit/profil
 * @returns Metadata optimisées pour Next.js
 */
export function createProfileMetadata(product: ProductForSEO): Metadata {
  const title = generateTitle(product);
  const description = generateDescription(product);
  const imageUrl = getMainImageUrl(product);
  const keywords = generateKeywords(product);

  return {
    // 📝 SEO de base
    title,
    description,
    keywords,

    // 📱 OPEN GRAPH (Facebook, WhatsApp, Discord, LinkedIn)
    openGraph: {
      title,
      description,
      images: [
        {
          url: imageUrl,
          width: 600,
          height: 600,
          alt: `Photo de profil de ${product.name}`,
        },
      ],
      type: 'profile',
      siteName: SEO_CONFIG.siteName,
    },

    // 🐦 TWITTER CARD
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },

    // 🤖 ROBOTS & INDEXATION
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },

    // 🌐 DONNÉES SUPPLÉMENTAIRES
    alternates: {
      canonical: `/produits/${product.id}`,
    },
  };
}

/**
 * 🚨 FONCTION D'ERREUR : Metadata pour les profils non trouvés
 */
export function createNotFoundMetadata(): Metadata {
  return {
    title: 'Profil non trouvé - Lastmodel',
    description:
      "Ce profil n'existe pas ou a été supprimé. Découvrez d'autres profils sur Lastmodel.",
    robots: {
      index: false,
      follow: false,
    },
  };
}

/**
 * 💥 FONCTION D'ERREUR : Metadata pour les erreurs serveur
 */
export function createErrorMetadata(): Metadata {
  return {
    title: 'Erreur - Lastmodel',
    description:
      'Une erreur est survenue lors du chargement du profil. Veuillez réessayer.',
    robots: {
      index: false,
      follow: false,
    },
  };
}
