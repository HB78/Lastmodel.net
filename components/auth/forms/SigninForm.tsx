'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { signIn } from '@/lib/better-auth-setup/authClient';
import { LoginFormData, LoginSchema } from '@/zodSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Lock, Mail } from 'lucide-react';
import Link from 'next/link';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import CardWrapper from '../CardWrapper';
import { UnverifiedEmailDialog } from '../dialogs/UnverifiedEmailDialog';
import MagiklinkForm from './MagiklinkForm';

const SigninForm = () => {
  const [isPending, startTransition] = useTransition();
  const [activeMethod, setActiveMethod] = useState<'password' | 'magic'>(
    'password'
  );
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    startTransition(async () => {
      try {
        const { data: authData, error } = await signIn.email(
          {
            email: data.email,
            password: data.password,
            callbackURL: '/',
            rememberMe: false,
          },
          {
            onSuccess: () => {},
            onError: (error: any) => {
              if (error.error.code === 'EMAIL_NOT_VERIFIED') {
                // Ouvrir la modale au lieu d'afficher un simple toast
                setUnverifiedEmail(data.email);
                return;
              }
              toast.error('Vérifiez vos identifiants');
            },
          }
        );

        if (error) {
          console.error('Erreur de connexion:', error);
        }
      } catch (error) {
        console.error('Erreur de connexion:', error);
      }
    });
  };

  return (
    <CardWrapper
      headerLabel="Bon retour!"
      backButtonLabel="Vous n'avez pas de compte?"
      backButtonHref="/signup"
      showSocial={true}
    >
      <div className="mx-auto w-full max-w-sm space-y-4">
        {/* Toggle entre les deux méthodes */}
        <div className="flex rounded-lg bg-gray-100 p-1">
          <button
            type="button"
            onClick={() => setActiveMethod('password')}
            className={`flex flex-1 items-center justify-center rounded-md px-3 py-2 text-sm font-medium transition-all duration-200 ${
              activeMethod === 'password'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Lock className="mr-2 h-4 w-4" />
            Mot de passe
          </button>
          <button
            type="button"
            onClick={() => setActiveMethod('magic')}
            className={`flex flex-1 items-center justify-center rounded-md px-3 py-2 text-sm font-medium transition-all duration-200 ${
              activeMethod === 'magic'
                ? 'bg-white text-green-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Mail className="mr-2 h-4 w-4" />
            Lien magique
          </button>
        </div>

        {/* Formulaire par mot de passe */}
        {activeMethod === 'password' && (
          <div className="animate-in slide-in-from-left-5 space-y-4 duration-300">
            <div className="pb-2 text-center">
              <p className="text-sm text-gray-600">
                Connectez-vous avec votre mot de passe
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Input
                  {...register('email')}
                  type="email"
                  placeholder="Email"
                  disabled={isPending}
                  className="h-11"
                />
                {errors.email && (
                  <p className="px-1 text-xs text-red-500">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Input
                  {...register('password')}
                  type="password"
                  placeholder="Mot de passe"
                  disabled={isPending}
                  className="h-11"
                />
                {errors.password && (
                  <p className="px-1 text-xs text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="h-11 w-full"
                disabled={isPending}
              >
                {isPending ? 'Connexion...' : 'Se connecter'}
              </Button>
            </form>

            <div className="pt-2 text-center">
              <Link
                href="/forgot-password"
                className="text-xs text-blue-600 hover:underline"
              >
                Mot de passe oublié ?
              </Link>
            </div>
          </div>
        )}

        {/* Formulaire par lien magique */}
        {activeMethod === 'magic' && (
          <div className="animate-in slide-in-from-right-5 space-y-4 duration-300">
            <div className="pb-2 text-center">
              <p className="text-sm text-gray-600">
                Connectez-vous sans mot de passe
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Nous vous enverrons un lien sécurisé
              </p>
            </div>

            <MagiklinkForm isPending={isPending} />
          </div>
        )}
      </div>

      {/* Modale Email non vérifié */}
      <UnverifiedEmailDialog
        email={unverifiedEmail}
        isOpen={unverifiedEmail !== null}
        onClose={() => setUnverifiedEmail(null)}
      />
    </CardWrapper>
  );
};

export default SigninForm;
