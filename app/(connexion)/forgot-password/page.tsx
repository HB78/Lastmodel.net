'use client';

import CardWrapper from '@/components/auth/CardWrapper';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { forgetPassword } from '@/lib/better-auth-setup/authClient';
import { ForgotPasswordFormData, ForgotPasswordSchema } from '@/zodSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle, Mail } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

const ForgotPasswordForm = () => {
  const [isPending, startTransition] = useTransition();
  const [isEmailSent, setIsEmailSent] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(ForgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    startTransition(async () => {
      try {
        await forgetPassword({
          email: data.email,
          redirectTo: '/reset-password',
          fetchOptions: {
            onRequest: () => {},
            onResponse: () => {},
            onError: (ctx) => {
              toast.error(ctx.error.message);
            },
            onSuccess: () => {
              toast.success('Email de réinitialisation envoyé avec succès !');
              setIsEmailSent(true);
              reset();
            },
          },
        });
      } catch (error) {
        console.error("Erreur lors de l'envoi de l'email:", error);
        toast.error("Erreur lors de l'envoi de l'email. Veuillez réessayer.");
      }
    });
  };

  if (isEmailSent) {
    return (
      <CardWrapper
        headerLabel="Mot de passe oublié"
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
              Email envoyé avec succès !
            </h3>
            <p className="text-sm text-gray-600">
              Vérifiez votre boîte de réception et suivez les instructions pour
              réinitialiser votre mot de passe.
            </p>
          </div>

          <Button
            onClick={() => setIsEmailSent(false)}
            variant="outline"
            className="w-full"
          >
            Envoyer un autre email
          </Button>
        </div>
      </CardWrapper>
    );
  }

  return (
    <CardWrapper
      headerLabel="Mot de passe oublié"
      backButtonLabel="Retour à la connexion"
      backButtonHref="/signin"
      showSocial={false}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div>
            <Input
              {...register('email')}
              type="email"
              placeholder="Entrez votre adresse email"
              disabled={isPending}
              className="h-10"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>
        </div>

        <Button type="submit" className="h-10 w-full" disabled={isPending}>
          {isPending ? (
            <>
              <Mail className="mr-2 h-4 w-4 animate-pulse" />
              Envoi en cours...
            </>
          ) : (
            <>
              <Mail className="mr-2 h-4 w-4" />
              Envoyer le lien de réinitialisation
            </>
          )}
        </Button>

        <p className="text-center text-xs text-gray-500">
          Un lien de réinitialisation sera envoyé à votre adresse email.
        </p>
      </form>
    </CardWrapper>
  );
};

export default ForgotPasswordForm;
