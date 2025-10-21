import { Footer } from '@/components/footer/Footer';
import { PricingCard } from '@/components/pricing/PricingCard';
import { AUTH_PLANS } from '@/lib/stripe-setup/plan';
import { getSession } from '@/tools';
import { Sparkles, Star } from 'lucide-react';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Plans et Tarifs - Lastmodel',
  description:
    'Découvrez nos plans de tarification pour rejoindre notre communauté de rencontres authentiques. Plans gratuit, mensuel et annuel disponibles.',
  keywords: [
    'tarifs',
    'plans',
    'abonnement',
    'rencontres',
    'dating',
    'communauté',
  ],
  openGraph: {
    title: 'Plans et Tarifs - Lastmodel',
    description:
      'Choisissez le plan qui vous convient le mieux pour des rencontres authentiques',
    type: 'website',
  },
};

export default async function PricingPage() {
  const session = await getSession();
  const typeOfSubscription = session?.user?.subscriptionType;
  const isLoggedIn = !!session?.user;
  if (isLoggedIn && typeOfSubscription !== 'FREE') redirect('/profile/billing');

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      <main className="flex-1">
        <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
          {/* Header compact et moderne */}
          <header className="mb-6 text-center sm:mb-10">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-purple-200 bg-white/90 px-4 py-2 shadow-sm backdrop-blur-sm">
              <Sparkles className="h-4 w-4 text-purple-600" />
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-sm font-semibold text-transparent">
                {typeOfSubscription
                  ? 'Vous avez un plan gratuit actuellement'
                  : 'Inscrivez-vous avant de choisir un plan'}
              </span>
            </div>

            <h1 className="mb-2 text-3xl font-bold text-gray-900 sm:mb-3 sm:text-4xl lg:text-5xl">
              Choisissez votre{' '}
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                plan
              </span>
            </h1>

            <p className="mx-auto max-w-2xl px-4 text-sm text-gray-600 sm:text-base lg:text-lg">
              Rejoignez notre communauté de rencontres authentiques
            </p>
          </header>

          {/* Grille des plans - OPTIMISÉE POUR ÉVITER LE SCROLL */}
          <section className="mx-auto max-w-6xl">
            <div className="grid auto-rows-fr grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-8">
              {AUTH_PLANS.map((plan) => (
                <div
                  key={plan.name}
                  className="flex transition-transform duration-200 hover:-translate-y-1"
                >
                  <PricingCard plan={plan} isLoggedIn={isLoggedIn} />
                </div>
              ))}
            </div>

            {/* Section confiance compacte */}
            <div className="mt-8 text-center sm:mt-12">
              <div className="inline-flex items-center gap-2 text-xs text-gray-600 sm:text-sm">
                <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                <span>
                  Rejoignez plus de{' '}
                  <strong className="text-purple-600">10 000 membres</strong>{' '}
                  satisfaits
                </span>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
