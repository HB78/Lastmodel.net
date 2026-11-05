'use client';

import Link from 'next/link';
import { useEffect } from 'react';

// 🚨 PAGE D'ERREUR DE TOUT LE SITE
//
// Next.js affiche automatiquement cette page quand N'IMPORTE QUELLE page
// plante (base de données injoignable, bug…), à la place de l'écran blanc
// "Application error: a server-side exception has occurred".
// → pas besoin de try/catch dans chaque page.
//
// - error : l'erreur qui a fait planter la page (en prod, Next cache les
//           détails au visiteur ; on la note seulement dans la console)
// - reset : fonction fournie par Next qui ré-essaie d'afficher la page
//
// ⚠️ 'use client' obligatoire : Next l'exige pour les fichiers error.tsx
// (le bouton "Réessayer" a besoin de JavaScript dans le navigateur).
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-nuit-profonde px-4 text-center text-white supports-[height:100svh]:min-h-svh">
      <h1 className="mb-4 max-w-xl text-balance font-[family-name:var(--font-playfair)] text-4xl font-bold leading-tight md:text-5xl">
        Un problème est survenu
      </h1>
      <p className="mb-10 max-w-md text-white/75">
        La page n&apos;a pas pu s&apos;afficher. Réessayez dans quelques
        instants.
      </p>

      <div className="flex flex-col items-center gap-3 sm:flex-row">
        <button
          type="button"
          onClick={reset}
          className="rounded-full bg-white px-8 py-3 text-sm font-semibold text-black transition-opacity duration-200 hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        >
          Réessayer
        </button>
        <Link
          href="/"
          className="rounded-full border border-white/60 px-8 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        >
          Retour à l&apos;accueil
        </Link>
      </div>
    </main>
  );
}
