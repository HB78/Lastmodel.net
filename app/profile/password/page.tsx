import ChangePasswordForm from '@/components/forms/ChangePasswordForm';
import { checkUserWithAccounts } from '@/tools';
import { Lock } from 'lucide-react';
import { redirect } from 'next/navigation';

export default async function PasswordPage() {
  const { session, provider, hasCredentials } = await checkUserWithAccounts();

  if (!session?.user?.id) {
    redirect('/signin');
  }

  return (
    <div className="mx-auto max-w-2xl text-black">
      {/* Header avec navigation */}
      <div className="mb-10">
        <div className="space-y-4 text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 shadow-lg">
            <Lock className="h-8 w-8 text-white" />
          </div>
          <h1 className="bg-gradient-to-r from-orange-600 via-red-600 to-rose-600 bg-clip-text text-4xl font-bold text-transparent">
            Modifier mon mot de passe
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-slate-600">
            Sécurisez votre compte avec un nouveau mot de passe
          </p>
        </div>
      </div>

      {/* Contenu conditionnel: si OAuth, on affiche une note; sinon le formulaire */}
      {hasCredentials ? (
        <ChangePasswordForm />
      ) : (
        <div className="rounded-xl border border-orange-200 bg-orange-50 p-4 text-orange-800">
          Vous vous êtes inscrit avec un compte {provider}. La modification du
          mot de passe n'est pas disponible pour les comptes OAuth.
        </div>
      )}
    </div>
  );
}
