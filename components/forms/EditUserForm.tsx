'use client';

import { updateUserProfileAction } from '@/actions/update/updateUserProfile';
import type { Session } from '@/lib/better-auth-setup/auth';
import {
  UpdateUserProfilFormData,
  UpdateUserProfilSchema,
} from '@/zodSchema/updateUserSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Textarea } from '../ui/textarea';

interface EditUserFormProps {
  session: Session;
  origins: Array<{ id: string; name: string }>;
}

const EditUserForm = ({ session, origins }: EditUserFormProps) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
  } = useForm<UpdateUserProfilFormData>({
    resolver: zodResolver(UpdateUserProfilSchema),
    mode: 'onChange',
    defaultValues: {
      name: session.user.name || '',
      sex: (session.user.sex as 'homme' | 'femme') || 'femme',
      age: session.user.age || 18,
      phone: session.user.phone || '',
      city: session.user.city || '',
      origin: '', // On va le remplir avec l'origine trouvée
      description: session.user.description || '',
      poids: session.user.poids || 0,
      taille: session.user.taille || 0,
    },
  });

  const onSubmit = async (data: UpdateUserProfilFormData) => {
    startTransition(async () => {
      try {
        // Créer FormData pour la Server Action
        // Utiliser les valeurs de la session comme fallback pour éviter les chaînes vides
        const formData = new FormData();
        formData.append('name', data.name || session.user.name || '');
        formData.append(
          'sex',
          data.sex || (session.user.sex as 'homme' | 'femme') || 'femme'
        );
        formData.append(
          'age',
          data.age?.toString() || session.user.age?.toString() || '18'
        );
        formData.append('phone', data.phone || session.user.phone || '');
        formData.append('city', data.city || session.user.city || '');
        formData.append('origin', data.origin || '');
        formData.append(
          'description',
          data.description || session.user.description || ''
        );
        formData.append(
          'poids',
          data.poids?.toString() || session.user.poids?.toString() || '0'
        );
        formData.append(
          'taille',
          data.taille?.toString() || session.user.taille?.toString() || '0'
        );

        // Appeler la Server Action
        const result = await updateUserProfileAction(formData);

        if (result.error) {
          toast.error(result.error);
          return;
        }

        toast.success(result.message || 'Profil mis à jour avec succès !');
        // Rediriger vers le profil pour forcer le refresh de la session
        router.refresh();
        router.push('/profile');
      } catch (error) {
        console.error('Erreur lors de la mise à jour du profil:', error);
        toast.error(
          'Erreur lors de la mise à jour du profil. Veuillez réessayer.'
        );
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Section 1: Informations de base */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Nom */}
        <div className="space-y-3">
          <Label
            htmlFor="name"
            className="text-sm font-semibold text-slate-700"
          >
            Nom complet
            <span className="ml-1 text-red-500">*</span>
          </Label>
          <Input
            id="name"
            {...register('name')}
            type="text"
            placeholder="Votre nom complet"
            disabled={isPending}
            className={`h-12 text-base ${
              errors.name
                ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                : 'border-slate-200 focus:border-blue-500 focus:ring-blue-200'
            }`}
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        {/* Sexe */}
        <div className="space-y-3">
          <Label htmlFor="sex" className="text-sm font-semibold text-slate-700">
            Sexe
            <span className="ml-1 text-red-500">*</span>
          </Label>
          <Controller
            name="sex"
            control={control}
            render={({ field }) => (
              <Select
                onValueChange={field.onChange}
                value={field.value}
                disabled={isPending}
              >
                <SelectTrigger
                  className={`h-12 text-base ${
                    errors.sex
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                      : 'border-slate-200 focus:border-blue-500 focus:ring-blue-200'
                  }`}
                >
                  <SelectValue placeholder="Sélectionnez votre sexe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="femme">Femme</SelectItem>
                  <SelectItem value="homme">Homme</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.sex && (
            <p className="text-sm text-red-500">{errors.sex.message}</p>
          )}
        </div>

        {/* Âge */}
        <div className="space-y-3">
          <Label htmlFor="age" className="text-sm font-semibold text-slate-700">
            Âge
            <span className="ml-1 text-red-500">*</span>
          </Label>
          <Input
            id="age"
            {...register('age', { valueAsNumber: true })}
            type="number"
            min="18"
            max="100"
            placeholder="25"
            disabled={isPending}
            className={`h-12 text-base ${
              errors.age
                ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                : 'border-slate-200 focus:border-blue-500 focus:ring-blue-200'
            }`}
          />
          {errors.age && (
            <p className="text-sm text-red-500">{errors.age.message}</p>
          )}
          <p className="text-xs text-slate-500">Âge minimum : 18 ans</p>
        </div>

        {/* Téléphone */}
        <div className="space-y-3">
          <Label
            htmlFor="phone"
            className="text-sm font-semibold text-slate-700"
          >
            Numéro de téléphone
          </Label>
          <Input
            id="phone"
            {...register('phone')}
            type="tel"
            placeholder="06 12 34 56 78"
            disabled={isPending}
            className={`h-12 text-base ${
              errors.phone
                ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                : 'border-slate-200 focus:border-blue-500 focus:ring-blue-200'
            }`}
          />
          {errors.phone && (
            <p className="text-sm text-red-500">{errors.phone.message}</p>
          )}
          <p className="text-xs text-slate-500">
            Format international recommandé
          </p>
        </div>

        {/* Poids */}
        <div className="space-y-3">
          <Label
            htmlFor="poids"
            className="text-sm font-semibold text-slate-700"
          >
            Poids (kg)
          </Label>
          <Input
            id="poids"
            {...register('poids', { valueAsNumber: true })}
            type="number"
            min="30"
            max="300"
            placeholder="75"
            disabled={isPending}
            className={`h-12 text-base ${
              errors.poids
                ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                : 'border-slate-200 focus:border-blue-500 focus:ring-blue-200'
            }`}
          />
          {errors.poids && (
            <p className="text-sm text-red-500">{errors.poids.message}</p>
          )}
          <p className="text-xs text-slate-500">Entre 30 et 300 kg</p>
        </div>

        {/* Taille */}
        <div className="space-y-3">
          <Label
            htmlFor="taille"
            className="text-sm font-semibold text-slate-700"
          >
            Taille (cm)
          </Label>
          <Input
            id="taille"
            {...register('taille', { valueAsNumber: true })}
            type="number"
            min="100"
            max="250"
            placeholder="175"
            disabled={isPending}
            className={`h-12 text-base ${
              errors.taille
                ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                : 'border-slate-200 focus:border-blue-500 focus:ring-blue-200'
            }`}
          />
          {errors.taille && (
            <p className="text-sm text-red-500">{errors.taille.message}</p>
          )}
          <p className="text-xs text-slate-500">Entre 100 et 250 cm</p>
        </div>
      </div>

      {/* Section 2: Localisation */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Ville */}
        <div className="space-y-3">
          <Label
            htmlFor="city"
            className="text-sm font-semibold text-slate-700"
          >
            Ville
            <span className="ml-1 text-red-500">*</span>
          </Label>
          <Input
            id="city"
            {...register('city')}
            type="text"
            placeholder="Paris, Lyon, Marseille..."
            disabled={isPending}
            className={`h-12 text-base ${
              errors.city
                ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                : 'border-slate-200 focus:border-blue-500 focus:ring-blue-200'
            }`}
          />
          {errors.city && (
            <p className="text-sm text-red-500">{errors.city.message}</p>
          )}
        </div>

        {/* Origine */}
        <div className="space-y-3">
          <Label
            htmlFor="origin"
            className="text-sm font-semibold text-slate-700"
          >
            Origine
            <span className="ml-1 text-red-500">*</span>
          </Label>
          <Controller
            name="origin"
            control={control}
            render={({ field }) => (
              <Select
                onValueChange={field.onChange}
                value={field.value}
                disabled={isPending}
              >
                <SelectTrigger
                  className={`h-12 text-base ${
                    errors.origin
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                      : 'border-slate-200 focus:border-blue-500 focus:ring-blue-200'
                  }`}
                >
                  <SelectValue placeholder="Sélectionnez votre origine" />
                </SelectTrigger>
                <SelectContent>
                  {origins.map((origin) => (
                    <SelectItem key={origin.id} value={origin.name}>
                      {origin.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.origin && (
            <p className="text-sm text-red-500">{errors.origin.message}</p>
          )}
        </div>
      </div>

      {/* Section 3: Description */}
      <div className="space-y-4">
        <Label
          htmlFor="description"
          className="text-lg font-semibold text-slate-700"
        >
          Description personnelle
          <span className="ml-1 text-red-500">*</span>
        </Label>
        <div className="relative">
          <Textarea
            id="description"
            {...register('description')}
            placeholder="Parlez-nous de vous, de vos centres d'intérêt, de votre personnalité, de ce qui vous rend unique..."
            rows={8}
            disabled={isPending}
            className={`min-h-[200px] resize-none border-2 p-4 text-base transition-all duration-200 ${
              errors.description
                ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                : 'border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100'
            }`}
          />
          <div className="absolute right-3 bottom-3 rounded-md border border-slate-200 bg-white/80 px-2 py-1 backdrop-blur-sm">
            <span className="text-xs font-medium text-slate-500">
              {watch('description')?.length || 0}/500
            </span>
          </div>
        </div>
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description.message}</p>
        )}
        <div className="flex items-center justify-between text-sm text-slate-500">
          <span className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-blue-500"></div>
            Minimum 10 caractères
          </span>
          <span className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-slate-400"></div>
            Maximum 500 caractères
          </span>
        </div>
      </div>

      {/* Boutons d'action */}
      <div className="flex items-center gap-4 pt-4">
        <Button
          variant="outline"
          asChild
          className="flex-1 bg-slate-300"
          disabled={isPending}
        >
          <Link href="/profile">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Annuler
          </Link>
        </Button>
        <Button
          type="submit"
          disabled={isPending}
          className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50"
        >
          {isPending ? (
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              <span>Mise à jour...</span>
            </div>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Sauvegarder les modifications
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default EditUserForm;
