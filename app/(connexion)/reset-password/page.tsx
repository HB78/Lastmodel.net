'use client';

import CardWrapper from '@/components/auth/CardWrapper';
import ResetPasswordForm from '@/components/auth/forms/ResetPasswordForm';
import { AlertCircle } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

// Composant principal qui extrait le token de l'URL
function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  if (!token) {
    return (
      <CardWrapper
        headerLabel="Lien invalide"
        backButtonLabel="Demander un nouveau lien"
        backButtonHref="/forgot-password"
        showSocial={false}
      >
        <div className="space-y-6">
          <div className="space-y-4 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Lien de réinitialisation invalide
            </h3>
            <p className="text-sm text-gray-600">
              Le lien de réinitialisation est manquant ou invalide. Veuillez
              demander un nouveau lien.
            </p>
          </div>
        </div>
      </CardWrapper>
    );
  }

  return <ResetPasswordForm token={token} />;
}

// Page principale avec Suspense pour gérer useSearchParams
export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <CardWrapper
          headerLabel="Réinitialisation du mot de passe"
          backButtonLabel="Retour"
          backButtonHref="/forgot-password"
          showSocial={false}
        >
          <div className="text-center">
            <div className="animate-pulse">
              <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-gray-200"></div>
              <div className="mx-auto mb-2 h-4 w-3/4 rounded bg-gray-200"></div>
              <div className="mx-auto h-4 w-1/2 rounded bg-gray-200"></div>
            </div>
          </div>
        </CardWrapper>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
