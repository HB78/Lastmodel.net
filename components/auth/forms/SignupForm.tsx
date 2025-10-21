'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { signUp } from '@/lib/better-auth-setup/authClient';
import { RegisterFormData, RegisterSchema } from '@/zodSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import CardWrapper from '../CardWrapper';

const SignupForm = () => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(RegisterSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data: RegisterFormData) => {
    startTransition(async () => {
      try {
        const { error } = await signUp.email(
          {
            email: data.email,
            password: data.password,
            name: data.name,
          },
          {
            onSuccess: () => {
              toast.success(
                'Inscription réussie ! Veuillez vérifier votre email pour activer votre compte.'
              );
              router.push(
                `/signup/success?email=${encodeURIComponent(data.email)}`
              );
            },
          }
        );

        if (error && typeof error === 'object' && 'code' in error) {
          switch (error.code) {
            case 'USER_ALREADY_EXISTS':
              toast.error(
                'Cet email est déjà utilisé. Veuillez utiliser un autre email.'
              );
              break;
            default:
              toast.error(
                error.message || "Erreur d'inscription. Veuillez réessayer."
              );
              break;
          }
        }
      } catch (error) {
        console.error("Erreur d'inscription:", error);
      }
    });
  };

  return (
    <CardWrapper
      headerLabel="Créer un compte"
      backButtonLabel="Vous avez déjà un compte?"
      backButtonHref="/signin"
      showSocial={true}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div>
            <Input
              {...register('name')}
              placeholder="Nom complet"
              disabled={isPending}
              className="h-10"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div>
            <Input
              {...register('email')}
              type="email"
              placeholder="Email"
              disabled={isPending}
              className="h-10"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <Input
              {...register('password')}
              type="password"
              placeholder="Mot de passe (min. 6 caractères)"
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
          {isPending ? 'Inscription...' : "S'inscrire"}
        </Button>
      </form>
    </CardWrapper>
  );
};

export default SignupForm;
