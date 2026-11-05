import { ErrorHandler } from '@/components/error-handler';
import { FilterDropdown } from '@/components/filterCards/filter-dropdown';
import { Footer } from '@/components/footer/Footer';
import { HeroSection } from '@/components/hero/HeroSection';
import { Navbar } from '@/components/navbar/navbar';
import {
  ProductGrid,
  ProductGridSkeleton,
} from '@/components/productsInMainPage/product-grid';
import { getCachedOrigins } from '@/lib/cache';
import Link from 'next/link';
import { Suspense } from 'react';

interface HomeProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;

  // Récupérer les origines depuis la base de données (avec cache 1h)
  const origins = await getCachedOrigins();

  // 🎭 "Nuit encadrée" (DESIGN.md) : la nuit ouvre (hero) et ferme
  // (bandeau + footer) la page ; entre les deux, fond ivoire neutre
  // pour que les photos des profils ressortent.
  return (
    <div className="min-h-screen bg-ivoire">
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
        <section className="mb-8" aria-label="Nouveaux profils">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              {/* Avant : "Profils recommandés" + un bloc "Triés par : Nouveaux
                  profils". Rien n'est recommandé (pas d'algorithme) : ce sont
                  simplement les plus récents → le titre dit maintenant ce que
                  la grille montre vraiment, et le bloc de tri faisait doublon. */}
              <h2 className="text-2xl font-bold text-gray-900">
                Nouveaux profils
              </h2>
              <p className="text-gray-700">
                Les derniers profils publiés, du plus récent au plus ancien.
              </p>
            </div>
          </div>

          {/* ✅ ProductGrid récupère les params depuis l'URL directement */}
          {/* ⏳ Suspense : la page (hero, filtres) s'affiche tout de suite,
              la grille arrive dès que la base a répondu (squelette en attendant).
              key = les filtres : à chaque changement de filtre, le squelette
              réapparaît au lieu de laisser les anciens résultats affichés. */}
          <Suspense
            key={JSON.stringify(params)}
            fallback={<ProductGridSkeleton />}
          >
            <ProductGrid filters={params} />
          </Suspense>
        </section>

        {/* Section CTA en bas : s'adresse aux ANNONCEURS
            (le visiteur vient de voir les profils juste au-dessus).
            Argument vrai : seuls les profils Premium/VIP apparaissent sur
            l'accueil (voir product-grid.tsx, subscriptionType: not 'FREE')
            et ils ont droit à 11 photos (lib/photoLimits.ts).
            ⚠️ Si ces règles changent, mettre ce texte à jour. */}
        <section
          className="mt-16 rounded-2xl bg-nuit p-8 text-center text-white sm:p-12"
          aria-labelledby="cta-annonceurs"
        >
          <h2 id="cta-annonceurs" className="mb-2 text-2xl font-bold">
            Créez votre profil sur Lastmodel
          </h2>
          <p className="mx-auto mb-6 max-w-xl text-white/80">
            L&apos;inscription est gratuite. Passez Premium ou VIP pour
            apparaître sur la page d&apos;accueil et publier jusqu&apos;à 11
            photos.
          </p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/signup"
              className="rounded-full bg-white px-8 py-3 text-sm font-semibold text-black transition-opacity duration-200 hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              Créer mon profil
            </Link>
            <Link
              href="/pricing"
              className="rounded-full border border-white/60 px-8 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              Voir les tarifs
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
