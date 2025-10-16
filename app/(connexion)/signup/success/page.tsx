'use client';

import CardWrapper from '@/components/auth/CardWrapper';
import SignUpSuccessContent from '@/components/auth/successSignupPage/SignUpSuccessContent';
import { Suspense } from 'react';

/**
 * Page de succès après inscription avec Suspense
 * Gère useSearchParams de manière sécurisée
 */
export default function SignUpSuccessPage() {
  return (
    <Suspense
      fallback={
        <CardWrapper
          headerLabel="🎉 Inscription réussie !"
          backButtonLabel="Retour à l'accueil"
          backButtonHref="/"
          showSocial={false}
        >
          <div className="text-center">
            <div className="animate-pulse">
              <div className="mx-auto mb-4 h-20 w-20 rounded-full bg-gray-200"></div>
              <div className="mx-auto mb-2 h-4 w-3/4 rounded bg-gray-200"></div>
              <div className="mx-auto h-4 w-1/2 rounded bg-gray-200"></div>
            </div>
          </div>
        </CardWrapper>
      }
    >
      <SignUpSuccessContent />
    </Suspense>
  );
}
