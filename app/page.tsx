import { ErrorHandler } from '@/components/error-handler';
import { FilterDropdown } from '@/components/filterCards/filter-dropdown';
import { Footer } from '@/components/footer/Footer';
import { Navbar } from '@/components/navbar/navbar';
import { ProductGrid } from '@/components/productsInMainPage/product-grid';
import { getSession } from '@/lib/better-auth-setup/toolAuth';
import { getCachedOrigins } from '@/lib/cache';
import { Heart, Sparkles, Users } from 'lucide-react';
import { Link } from 'next-view-transitions';

interface HomeProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const session = await getSession();
  const params = await searchParams;

  // Récupérer les origines depuis la base de données (avec cache 1h)
  const origins = await getCachedOrigins();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* ✅ Gérer les erreurs depuis l'URL */}
        <ErrorHandler error={params.error} />

        {/* Header Hero Section */}
        <header className="mb-12 text-center">
          <div
            className="mb-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-2 text-sm font-medium text-purple-700"
            role="banner"
          >
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            <span>Trouvez votre âme sœur</span>
          </div>
          <h1 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">
            Découvrez des
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {' '}
              connexions{' '}
            </span>
            authentiques
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-700">
            Rencontrez des personnes qui partagent vos valeurs et aspirations.
            Chaque profil raconte une histoire unique.
          </p>

          {/* Stats rapides */}
          <div
            className="mb-8 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-8"
            role="complementary"
            aria-label="Statistiques de la communauté"
          >
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Users className="h-4 w-4 text-purple-600" aria-hidden="true" />
              <span>
                <strong>1000+</strong> membres actifs
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Heart className="h-4 w-4 text-pink-600" aria-hidden="true" />
              <span>
                <strong>200+</strong> connexions par mois
              </span>
            </div>
          </div>
        </header>

        {/* Section Filtres */}
        <section className="mb-8" aria-label="Filtres de recherche">
          <h2 className="sr-only">Filtres pour affiner votre recherche</h2>
          {/* ✅ Plus besoin de passer les filtres actuels ! */}
          <FilterDropdown origins={origins} />
        </section>

        {/* Section Profils */}
        <section className="mb-8" aria-label="Profils recommandés">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Profils recommandés
              </h2>
              <p className="text-gray-700">
                Découvrez des personnes qui pourraient vous intéresser
              </p>
            </div>

            {/* Bouton de tri */}
            <div
              className="flex items-center gap-2 text-sm text-gray-700"
              role="status"
              aria-label="Ordre de tri actuel"
            >
              <span>Triés par :</span>
              <span className="font-medium text-purple-600">
                Nouveaux profils
              </span>
            </div>
          </div>

          {/* ✅ ProductGrid récupère les params depuis l'URL directement */}
          <ProductGrid filters={params} />
        </section>

        {/* Section CTA en bas */}
        <section
          className="mt-16 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 p-8 text-center text-white"
          aria-label="Appel à l'action"
        >
          <h2 className="mb-2 text-2xl font-bold">
            Prêt à faire de belles rencontres ?
          </h2>
          <p className="mb-6 text-purple-100">
            Rejoignez notre communauté et commencez votre histoire dès
            aujourd'hui
          </p>
          {!session && (
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href={'/chat/conseils-rencontre'}
                className="rounded-full bg-white px-6 py-3 font-semibold text-purple-600 transition-colors hover:bg-gray-100 focus:bg-gray-100 focus:ring-4 focus:ring-white/50 focus:outline-none"
                aria-label="Créer un compte pour commencer à rencontrer des personnes"
              >
                Créer mon profil
              </Link>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
