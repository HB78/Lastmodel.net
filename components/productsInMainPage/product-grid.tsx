import { prisma } from '@/lib/prisma-setup/db';
import Link from 'next/link';
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
    // 🆕 Les plus récents d'abord : la page affiche "Triés par : Nouveaux
    // profils". Sans orderBy, l'ordre était celui que la base voulait bien
    // renvoyer (arbitraire) → le libellé mentait.
    orderBy: { createdAt: 'desc' },
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

  // Un filtre est-il actif ? (sert à choisir le bon message si la liste est vide)
  const hasActiveFilters = Object.values(cleanFilters).some(Boolean);

  // 🎯 Fetch les produits avec les filtres appliqués
  // 🛡️ Si la base ne répond pas (coupure Neon, timeout…), on affiche un
  // message dans la grille au lieu de faire planter TOUTE la page d'accueil
  // (la hero, les filtres et le footer restent utilisables).
  let products: Awaited<ReturnType<typeof fetchProducts>>;
  try {
    products = await fetchProducts(cleanFilters);
  } catch (error) {
    console.error('Erreur lors du chargement des profils:', error);
    return (
      <GridMessage
        title="Les profils n'ont pas pu être chargés"
        text="Un problème temporaire nous empêche d'afficher les profils. Réessayez dans quelques instants."
        actionHref="/"
        actionLabel="Réessayer"
      />
    );
  }

  // 📭 ÉTAT VIDE : avant, la grille restait simplement blanche
  if (products.length === 0) {
    return hasActiveFilters ? (
      <GridMessage
        title="Aucun profil ne correspond à ces filtres"
        text="Élargissez votre recherche : une autre ville, une autre tranche d'âge…"
        actionHref="/"
        actionLabel="Voir tous les profils"
      />
    ) : (
      <GridMessage
        title="Aucun profil pour le moment"
        text="Créez le vôtre : il apparaîtra ici dès que vous passerez Premium ou VIP."
        actionHref="/signup"
        actionLabel="Créer mon profil"
      />
    );
  }

  // <ul> + <li> (dans ProductCard) : une vraie liste, que les lecteurs
  // d'écran annoncent avec son nombre d'éléments ("liste, 12 éléments")
  // 📱 1 colonne sur téléphone (choix voulu : chaque photo en grand),
  // 2 dès 640px, 3 dès 1024px. Le squelette ProductGridSkeleton plus bas
  // doit garder la même grille (sinon saut de mise en page au chargement).
  return (
    <ul
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      aria-label="Profils"
    >
      {products.map((product) => (
        <ProductCard key={product.id} {...product} />
      ))}
    </ul>
  );
}

// 💬 Message affiché à la place de la grille (liste vide ou erreur)
// "/" = retour à l'accueil SANS paramètres d'URL → efface tous les filtres
function GridMessage({
  title,
  text,
  actionHref,
  actionLabel,
}: {
  title: string;
  text: string;
  actionHref: string;
  actionLabel: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-6 py-12 text-center">
      <p className="text-lg font-semibold text-gray-900">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-gray-700">{text}</p>
      <Link
        href={actionHref}
        className="mt-6 inline-flex rounded-full bg-nuit px-6 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-nuit-profonde focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nuit"
      >
        {actionLabel}
      </Link>
    </div>
  );
}

// ⏳ SQUELETTE affiché pendant le chargement des profils (voir app/page.tsx,
// <Suspense fallback={<ProductGridSkeleton />}>). La hero et les filtres
// s'affichent tout de suite, sans attendre la base de données.
// Même grille et même forme que les vraies cartes → pas de saut de mise en page.
export function ProductGridSkeleton() {
  return (
    <div
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      role="status"
      aria-label="Chargement des profils"
    >
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-xl border-2 border-gray-100 bg-white"
          aria-hidden="true"
        >
          <div className="aspect-square w-full animate-pulse bg-gray-100 motion-reduce:animate-none" />
          <div className="space-y-3 p-4">
            <div className="h-5 w-2/3 animate-pulse rounded bg-gray-100 motion-reduce:animate-none" />
            <div className="h-5 w-full animate-pulse rounded bg-gray-100 motion-reduce:animate-none" />
          </div>
        </div>
      ))}
    </div>
  );
}
