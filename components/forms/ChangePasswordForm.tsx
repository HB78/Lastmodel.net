'use client';

import { changePasswordAction } from '@/actions/update/updateUserPassword';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import PasswordInput from '@/components/ui/password-input';
import { ChangePasswordSchema } from '@/zodSchema/updateUserSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Lock, Shield } from 'lucide-react';
import Link from 'next/link';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

type ChangePasswordFormData = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export default function ChangePasswordForm() {
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(ChangePasswordSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data: ChangePasswordFormData) => {
    startTransition(async () => {
      // Convertir les données en FormData pour la server action
      const formData = new FormData();
      formData.append('currentPassword', data.currentPassword);
      formData.append('newPassword', data.newPassword);
      formData.append('confirmPassword', data.confirmPassword);

      const result = await changePasswordAction(formData);

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success('Mot de passe mis à jour avec succès !');
        reset();
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Mot de passe actuel */}
      <div className="space-y-3">
        <Label
          htmlFor="currentPassword"
          className="text-sm font-semibold text-slate-700"
        >
          Mot de passe actuel
          <span className="ml-1 text-red-500">*</span>
        </Label>
        <PasswordInput
          id="currentPassword"
          placeholder="Votre mot de passe actuel"
          {...register('currentPassword')}
          className={`h-12 border-slate-200 text-base focus:border-orange-500 focus:ring-orange-200 ${
            errors.currentPassword ? 'border-red-500' : ''
          }`}
        />
        {errors.currentPassword && (
          <p className="text-xs text-red-600">
            {errors.currentPassword.message}
          </p>
        )}
        <p className="text-xs text-slate-500">
          Pour confirmer que c'est bien vous
        </p>
      </div>

      {/* Nouveau mot de passe */}
      <div className="space-y-3">
        <Label
          htmlFor="newPassword"
          className="text-sm font-semibold text-slate-700"
        >
          Nouveau mot de passe
          <span className="ml-1 text-red-500">*</span>
        </Label>
        <PasswordInput
          id="newPassword"
          placeholder="Nouveau mot de passe"
          {...register('newPassword')}
          className={`h-12 border-slate-200 text-base focus:border-orange-500 focus:ring-orange-200 ${
            errors.newPassword ? 'border-red-500' : ''
          }`}
        />
        {errors.newPassword && (
          <p className="text-xs text-red-600">{errors.newPassword.message}</p>
        )}
        <div className="space-y-1 text-xs text-slate-500">
          <p>Le mot de passe doit contenir au moins :</p>
          <ul className="ml-4 space-y-1">
            <li>• 6 caractères minimum</li>
            <li>• Maximum 128 caractères</li>
          </ul>
        </div>
      </div>

      {/* Confirmation du nouveau mot de passe */}
      <div className="space-y-3">
        <Label
          htmlFor="confirmPassword"
          className="text-sm font-semibold text-slate-700"
        >
          Confirmer le nouveau mot de passe
          <span className="ml-1 text-red-500">*</span>
        </Label>
        <PasswordInput
          id="confirmPassword"
          placeholder="Confirmer le nouveau mot de passe"
          {...register('confirmPassword')}
          className={`h-12 border-slate-200 text-base focus:border-orange-500 focus:ring-orange-200 ${
            errors.confirmPassword ? 'border-red-500' : ''
          }`}
        />
        {errors.confirmPassword && (
          <p className="text-xs text-red-600">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {/* Informations de sécurité */}
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
        <div className="flex items-start gap-3">
          <Shield className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />
          <div className="text-sm text-blue-800">
            <p className="mb-1 font-medium">Conseils de sécurité :</p>
            <ul className="space-y-1 text-xs">
              <li>• Utilisez un mot de passe unique pour ce compte</li>
              <li>• Évitez les informations personnelles</li>
              <li>• Changez régulièrement votre mot de passe</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Boutons d'action */}
      <div className="flex items-center gap-4 pt-4">
        <Button variant="outline" asChild className="flex-1 bg-orange-300">
          <Link href="/profile">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Annuler
          </Link>
        </Button>
        <Button
          type="submit"
          disabled={isPending}
          className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
        >
          <Lock className="mr-2 h-4 w-4" />
          {isPending ? 'Mise à jour...' : 'Mettre à jour le mot de passe'}
        </Button>
      </div>
    </form>
  );
}
