import { ErrorHandler } from '@/components/error-handler';
import { FilterDropdown } from '@/components/filterCards/filter-dropdown';
import { Footer } from '@/components/footer/Footer';
import { HeroSection } from '@/components/hero/HeroSection';
import { Navbar } from '@/components/navbar/navbar';
import { ProductGrid } from '@/components/productsInMainPage/product-grid';
import { getCachedOrigins } from '@/lib/cache';

interface HomeProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;

  // Récupérer les origines depuis la base de données (avec cache 1h)
  const origins = await getCachedOrigins();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      {/* Navbar transparente superposée à la vidéo de la hero */}
      <div className="relative">
        <Navbar transparent />
        <HeroSection />
      </div>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* ✅ Gérer les erreurs depuis l'URL */}
        <ErrorHandler error={params.error} />

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
        </section>
      </main>
      <Footer />
    </div>
  );
}
