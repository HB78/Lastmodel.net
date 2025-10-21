import { prisma } from '@/lib/prisma-setup/db';
import { ProductCard } from './product-card';

// 🎯 Interface pour typer les filtres reçus de la page
interface Filters {
  age?: string; // Format: "18-23" ou "24-27"
  origin?: string; // ID de l'origine
  city?: string; // Nom de la ville
  sex?: string; // "homme" ou "femme"
}

// 🔍 Fonction pour construire la clause WHERE Prisma à partir des filtres URL
const buildWhereClause = (filters: Filters) => {
  const whereClause: any = {
    // 📸 Filtrer seulement les utilisateurs qui ont au moins une photo principale
    photos: {
      some: {
        isMain: true,
      },
    },
    // 💰 Afficher seulement les profils payants (pas FREE)
    subscriptionType: {
      not: 'FREE', // Exclut les utilisateurs FREE
    },
  };

  // 🎂 Filtre par âge : "18-23" → age >= 18 AND age <= 23
  if (filters.age) {
    const [minAge, maxAge] = filters.age.split('-').map(Number);
    whereClause.age = {
      gte: minAge, // gte = Greater Than or Equal (>=)
      lte: maxAge, // lte = Less Than or Equal (<=)
    };
  }

  // 🌍 Filtre par origine : utilise l'ID de l'origine
  if (filters.origin) {
    whereClause.originId = filters.origin;
  }

  // 🏙️ Filtre par ville : recherche qui contient le texte (insensible à la casse)
  if (filters.city) {
    whereClause.city = {
      contains: filters.city,
      mode: 'insensitive', // Ignore majuscules/minuscules
    };
  }

  // 👤 Filtre par sexe : correspondance exacte
  if (filters.sex) {
    whereClause.sex = filters.sex;
  }

  return whereClause;
};

const fetchProducts = async (filters: Filters = {}) => {
  // 🏗️ Construire la clause WHERE à partir des filtres
  const whereClause = buildWhereClause(filters);

  const products = await prisma.user.findMany({
    where: whereClause,
    select: {
      id: true,
      name: true,
      sex: true,
      age: true,
      city: true,
      photos: {
        select: {
          url: true,
          isMain: true,
        },
        // WHERE = FILTRE : "garde seulement les photos où isMain est true"
        // Évite de récupérer les 8+ photos pour ne garder que la principale
        where: { isMain: true },
        // TAKE = LIMITE : au cas où plusieurs photos seraient marquées principales
        take: 1,
      },
    },
  });
  return products;
};

// 📊 Props pour recevoir les filtres de la page parent
interface ProductGridProps {
  filters?: { [key: string]: string | string[] | undefined };
}

export async function ProductGrid({ filters = {} }: ProductGridProps) {
  // 🧹 Nettoyer les filtres : convertir les arrays en strings et supprimer les undefined
  const cleanFilters: Filters = {
    age: typeof filters.age === 'string' ? filters.age : undefined,
    origin: typeof filters.origin === 'string' ? filters.origin : undefined,
    city: typeof filters.city === 'string' ? filters.city : undefined,
    sex: typeof filters.sex === 'string' ? filters.sex : undefined,
  };

  // 🎯 Fetch les produits avec les filtres appliqués
  const products = await fetchProducts(cleanFilters);

  return (
    <section
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      role="region"
      aria-label="Liste des produits"
    >
      {products.map((product) => (
        <ProductCard key={product.id} {...product} />
      ))}
    </section>
  );
}
