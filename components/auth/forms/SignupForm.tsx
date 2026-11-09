'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import PasswordInput from '@/components/ui/password-input';
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
    // Même message et même page, que l'email soit nouveau ou déjà inscrit
    const goToSuccessPage = () => {
      toast.success(
        'Vérifiez votre boîte mail pour activer votre compte.'
      );
      router.push(`/signup/success?email=${encodeURIComponent(data.email)}`);
    };

    startTransition(async () => {
      try {
        const { error } = await signUp.email(
          {
            email: data.email,
            password: data.password,
            name: data.name,
          },
          {
            onSuccess: goToSuccessPage,
          }
        );

        if (error && typeof error === 'object' && 'code' in error) {
          switch (error.code) {
            // 🔒 Email déjà inscrit : on fait EXACTEMENT comme un succès.
            // Avant : "Cet email est déjà utilisé" → n'importe qui pouvait
            // taper l'email de quelqu'un pour savoir s'il est inscrit ici.
            // La vraie personne, elle, sait qu'elle a déjà un compte.
            case 'USER_ALREADY_EXISTS':
            case 'USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL':
              goToSuccessPage();
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
          <div className="space-y-2">
            <Label htmlFor="signup-name">Pseudo</Label>
            <Input
              id="signup-name"
              {...register('name')}
              autoComplete="nickname"
              placeholder="ex : Luna"
              disabled={isPending}
              className="h-11"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="signup-email">Email</Label>
            <Input
              id="signup-email"
              {...register('email')}
              type="email"
              autoComplete="email"
              placeholder="vous@exemple.com"
              disabled={isPending}
              className="h-11"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="signup-password">Mot de passe</Label>
            {/* PasswordInput : le même champ, avec le bouton 👁️ pour afficher le mot de passe */}
            <PasswordInput
              id="signup-password"
              {...register('password')}
              autoComplete="new-password"
              placeholder="6 caractères minimum"
              disabled={isPending}
              className="h-11 pr-11"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="signup-confirm-password">
              Confirmer le mot de passe
            </Label>
            <PasswordInput
              id="signup-confirm-password"
              {...register('confirmPassword')}
              autoComplete="new-password"
              disabled={isPending}
              className="h-11 pr-11"
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-500">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        </div>

        {/* Pilule noire : l'action principale */}
        <Button
          type="submit"
          className="h-11 w-full rounded-full bg-black font-semibold text-white hover:bg-black/80"
          disabled={isPending}
        >
          {isPending ? 'Inscription...' : "S'inscrire"}
        </Button>
      </form>
    </CardWrapper>
  );
};

export default SignupForm;
