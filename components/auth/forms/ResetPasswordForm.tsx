'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { resetPassword } from '@/lib/better-auth-setup/authClient';
import { ResetPasswordFormData, ResetPasswordSchema } from '@/zodSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle, KeyRound } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import CardWrapper from '../CardWrapper';

interface ResetPasswordFormProps {
  token: string;
}

const ResetPasswordForm = ({ token }: ResetPasswordFormProps) => {
  const [isPending, startTransition] = useTransition();
  const [isPasswordReset, setIsPasswordReset] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(ResetPasswordSchema),
  });

  const password = watch('password');

  const onSubmit = async (data: ResetPasswordFormData) => {
    startTransition(async () => {
      try {
        await resetPassword({
          newPassword: data.password,
          token,
          fetchOptions: {
            onRequest: () => {},
            onResponse: () => {},
            onError: (ctx) => {
              toast.error(ctx.error.message);
            },
            onSuccess: () => {
              toast.success('Mot de passe réinitialisé avec succès !');
              setIsPasswordReset(true);
              setTimeout(() => {
                router.push('/signin');
              }, 2000);
            },
          },
        });
      } catch (error) {
        console.error('Erreur lors de la réinitialisation:', error);
        toast.error('Erreur lors de la réinitialisation. Veuillez réessayer.');
      }
    });
  };

  if (isPasswordReset) {
    return (
      <CardWrapper
        headerLabel="Réinitialisation du mot de passe"
        backButtonLabel="Retour à la connexion"
        backButtonHref="/signin"
        showSocial={false}
      >
        <div className="space-y-6">
          <div className="space-y-4 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Mot de passe réinitialisé !
            </h3>
            <p className="text-sm text-gray-600">
              Votre mot de passe a été mis à jour avec succès. Vous allez être
              redirigé vers la page de connexion.
            </p>
          </div>
        </div>
      </CardWrapper>
    );
  }

  return (
    <CardWrapper
      headerLabel="Réinitialisation du mot de passe"
      backButtonLabel="Retour à la connexion"
      backButtonHref="/signin"
      showSocial={false}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div>
            <Input
              {...register('password')}
              type="password"
              placeholder="Nouveau mot de passe"
              disabled={isPending}
              className="h-10"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <Input
              {...register('confirmPassword')}
              type="password"
              placeholder="Confirmer le mot de passe"
              disabled={isPending}
              className="h-10"
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-500">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        </div>

        <Button type="submit" className="h-10 w-full" disabled={isPending}>
          {isPending ? (
            <>
              <KeyRound className="mr-2 h-4 w-4 animate-pulse" />
              Réinitialisation...
            </>
          ) : (
            <>
              <KeyRound className="mr-2 h-4 w-4" />
              Réinitialiser le mot de passe
            </>
          )}
        </Button>

        <p className="text-center text-xs text-gray-500">
          Votre nouveau mot de passe doit contenir au moins 6 caractères.
        </p>
      </form>
    </CardWrapper>
  );
};

export default ResetPasswordForm;
