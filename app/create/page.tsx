import CreateProductForm from '@/components/forms/CreateProductForm';
import { Navbar } from '@/components/navbar/navbar';
import { prisma } from '@/lib/prisma-setup/db';
import { getSessionWithProfileCheck } from '@/tools';
import { Sparkles } from 'lucide-react';
import { redirect } from 'next/navigation';

export default async function CreateProductPage() {
  const { session, isProfileComplete } = await getSessionWithProfileCheck();

  if (!session?.user?.id) redirect('/signin');
  if (isProfileComplete) redirect('/profile');

  // Même règle "payant" que lib/photoLimits.ts
  const isPaid =
    session.user.subscriptionType === 'MONTHLY' ||
    session.user.subscriptionType === 'YEARLY';

  // Récupérer les origines depuis la DB
  const origins = await prisma.origin.findMany({
    orderBy: { name: 'asc' },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Navbar : sans elle, on ne pouvait pas quitter /create
          (pas de lien vers l'accueil, les favoris ou le compte) */}
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header avec navigation */}
        <div className="mb-10">
          <div className="space-y-4 text-center">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <h1 className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-4xl font-bold text-transparent">
              Créez votre annonce
            </h1>
            {/* Avant : "Vous devez remplir tous les champs pour apparaitre en
                ligne" → FAUX pour un compte gratuit : l'accueil n'affiche que
                les abonnés (product-grid.tsx). On annonce les vraies étapes. */}
            {isPaid ? (
              <p className="mx-auto max-w-2xl text-lg text-slate-700">
                <span className="font-semibold">Dernière étape :</span>{' '}
                remplissez votre profil pour apparaître sur l&apos;accueil.
              </p>
            ) : (
              <div className="mx-auto max-w-2xl space-y-2">
                <span className="inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold tracking-wide text-amber-800 uppercase">
                  Étape 1 sur 2
                </span>
                <p className="text-lg text-slate-700">
                  Remplissez votre profil. Ensuite, choisissez votre abonnement
                  pour apparaître sur l&apos;accueil.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {/* Formulaire principal */}
          <div className="space-y-8 xl:col-span-3">
            <CreateProductForm origins={origins} />
          </div>
        </div>
      </div>
    </div>
  );
}
