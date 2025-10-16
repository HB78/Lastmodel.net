'use client';

import { createUserProfilAction } from '@/actions/creation/createUserProfil';
import { DropZone } from '@/components/dropzone/Dropzone';
import CityInput from '@/components/filterCards/CityInput';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  CreateUserProfilFormData,
  CreateUserProfilSchema,
} from '@/zodSchema/updateUserSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  AlertCircle,
  FileText,
  MapPin,
  Phone,
  Save,
  Upload,
  User,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMemo, useState, useTransition } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface CreateProductFormProps {
  origins: Array<{ id: string; name: string }>;
}

const CreateProductForm = ({ origins }: CreateProductFormProps) => {
  const [isPending, startTransition] = useTransition();

  const [productImages, setProductImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(CreateUserProfilSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      sex: 'femme',
      age: 18,
      phone: '',
      images: [],
      origin: '',
      city: '',
      description: '',
      poids: 0,
      taille: 0,
    },
  });

  const onSubmit = async (data: CreateUserProfilFormData) => {
    startTransition(async () => {
      try {
        // Créer FormData pour la Server Action
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('sex', data.sex);
        formData.append('age', data.age.toString());
        formData.append('phone', data.phone || '');
        // Ajouter toutes les images
        data.images?.forEach((imageUrl, index) => {
          formData.append(`image_${index}`, imageUrl);
        });
        formData.append('origin', data.origin);
        formData.append('city', data.city);
        formData.append('description', data.description);
        formData.append('poids', data.poids?.toString() || '0');
        formData.append('taille', data.taille?.toString() || '0');

        // Appeler la Server Action
        const result = await createUserProfilAction(formData);

        if (result.error) {
          toast.error(result.error);
          return;
        }

        toast.success('Profil mis à jour avec succès !');
        router.push('/profile');
      } catch (error) {
        console.error('Erreur lors de la mise à jour du profil:', error);
        toast.error(
          'Erreur lors de la mise à jour du profil. Veuillez réessayer.'
        );
      }
    });
  };

  const watchedAge = watch('age');

  // Optimisation performance : mémoriser le compteur de caractères
  const descriptionLength = useMemo(
    () => watch('description')?.length || 0,
    [watch('description')]
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Sections 1 et 2 côte à côte en lg et xl */}
      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2">
        {/* Section 1: Informations de base */}
        <Card className="border-0 bg-white/90 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl">
          <CardHeader className="border-b border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 p-2">
                <User className="h-5 w-5 text-white" />
              </div>
              <div className="flex items-center">
                <CardTitle className="text-xl text-slate-800">
                  Informations de base
                </CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <div className="space-y-6">
              <div className="space-y-3">
                <Label
                  htmlFor="name"
                  className="flex items-center gap-2 text-sm font-semibold text-slate-700"
                >
                  Nom complet
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  {...register('name')}
                  placeholder="ex: Jean Dupont"
                  disabled={isPending}
                  className={`h-12 text-base transition-all duration-200 ${
                    errors.name
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                      : 'border-slate-200 focus:border-blue-500 focus:ring-blue-200'
                  }`}
                />
                {errors.name && (
                  <div className="flex items-center gap-2 text-sm text-red-500">
                    <AlertCircle className="h-4 w-4" />
                    {errors.name.message}
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <Label
                  htmlFor="age"
                  className="flex items-center gap-2 text-sm font-semibold text-slate-700"
                >
                  Âge
                  <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="age"
                    {...register('age', { valueAsNumber: true })}
                    type="number"
                    min="18"
                    max="100"
                    placeholder="25"
                    disabled={isPending}
                    className={`h-12 pr-12 text-base transition-all duration-200 ${
                      errors.age
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                        : 'border-slate-200 focus:border-blue-500'
                    }`}
                  />
                  <div className="absolute top-1/2 right-3 flex -translate-y-1/2 items-center gap-1 text-slate-400">
                    <User className="h-4 w-4" />
                  </div>
                </div>
                {errors.age && (
                  <div className="flex items-center gap-2 text-sm text-red-500">
                    <AlertCircle className="h-4 w-4" />
                    {errors.age.message}
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <Label
                  htmlFor="phone"
                  className="flex items-center gap-2 text-sm font-semibold text-slate-700"
                >
                  Numéro de téléphone
                  <span className="text-xs font-normal text-slate-500">
                    (optionnel)
                  </span>
                </Label>
                <div className="relative">
                  <Input
                    id="phone"
                    {...register('phone')}
                    type="tel"
                    placeholder="+33 6 12 34 56 78"
                    disabled={isPending}
                    className={`h-12 pl-12 text-base transition-all duration-200 ${
                      errors.phone
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                        : 'border-slate-200 focus:border-blue-500 focus:ring-blue-200'
                    }`}
                  />
                  <div className="absolute top-1/2 left-3 flex -translate-y-1/2 items-center gap-1 text-slate-400">
                    <Phone className="h-4 w-4" />
                  </div>
                </div>
                {errors.phone && (
                  <div className="flex items-center gap-2 text-sm text-red-500">
                    <AlertCircle className="h-4 w-4" />
                    {errors.phone.message}
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <Label
                  htmlFor="poids"
                  className="flex items-center gap-2 text-sm font-semibold text-slate-700"
                >
                  Poids (kg)
                  <span className="text-xs font-normal text-slate-500">
                    (optionnel)
                  </span>
                </Label>
                <Input
                  id="poids"
                  {...register('poids', { valueAsNumber: true })}
                  type="number"
                  min="30"
                  max="300"
                  placeholder="75"
                  disabled={isPending}
                  className={`h-12 text-base transition-all duration-200 ${
                    errors.poids
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                      : 'border-slate-200 focus:border-blue-500 focus:ring-blue-200'
                  }`}
                />
                {errors.poids && (
                  <div className="flex items-center gap-2 text-sm text-red-500">
                    <AlertCircle className="h-4 w-4" />
                    {errors.poids.message}
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <Label
                  htmlFor="taille"
                  className="flex items-center gap-2 text-sm font-semibold text-slate-700"
                >
                  Taille (cm)
                  <span className="text-xs font-normal text-slate-500">
                    (optionnel)
                  </span>
                </Label>
                <Input
                  id="taille"
                  {...register('taille', { valueAsNumber: true })}
                  type="number"
                  min="100"
                  max="250"
                  placeholder="175"
                  disabled={isPending}
                  className={`h-12 text-base transition-all duration-200 ${
                    errors.taille
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                      : 'border-slate-200 focus:border-blue-500 focus:ring-blue-200'
                  }`}
                />
                {errors.taille && (
                  <div className="flex items-center gap-2 text-sm text-red-500">
                    <AlertCircle className="h-4 w-4" />
                    {errors.taille.message}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 2: Localisation */}
        <Card className="border-0 bg-white/90 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl">
          <CardHeader className="border-b border-purple-100 bg-gradient-to-r from-purple-50 to-pink-50">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 p-2">
                <MapPin className="h-5 w-5 text-white" />
              </div>
              <div className="flex items-center">
                <CardTitle className="text-xl text-slate-800">
                  Localisation et détails
                </CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <div className="space-y-6">
              <div className="space-y-3">
                <Label
                  htmlFor="city"
                  className="flex items-center gap-2 text-sm font-semibold text-slate-700"
                >
                  Ville
                  <span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="city"
                  control={control}
                  render={({ field }) => (
                    <div
                      className={`transition-all duration-200 ${
                        errors.city
                          ? 'border-red-300 focus-within:border-red-500'
                          : 'border-slate-200 focus-within:border-purple-500'
                      } rounded-md`}
                    >
                      <CityInput
                        value={field.value}
                        onCitySelect={field.onChange}
                        placeholder="Rechercher une ville..."
                      />
                    </div>
                  )}
                />
                {errors.city && (
                  <div className="flex items-center gap-2 text-sm text-red-500">
                    <AlertCircle className="h-4 w-4" />
                    {errors.city.message}
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <Label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  Origine
                  <span className="text-red-500">*</span>
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
                        className={`h-12 w-full text-base transition-all duration-200 ${
                          errors.origin
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                            : 'border-slate-200 focus:border-purple-500 focus:ring-purple-200'
                        }`}
                      >
                        <SelectValue placeholder="Sélectionner..." />
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
                  <div className="flex items-center gap-2 text-sm text-red-500">
                    <AlertCircle className="h-4 w-4" />
                    {errors.origin.message}
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <Label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  Sexe
                  <span className="text-red-500">*</span>
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
                        className={`h-12 w-full text-base transition-all duration-200 ${
                          errors.sex
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                            : 'border-slate-200 focus:border-purple-500 focus:ring-purple-200'
                        }`}
                      >
                        <SelectValue placeholder="Sélectionner..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="homme">👨 Homme</SelectItem>
                        <SelectItem value="femme">👩 Femme</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.sex && (
                  <div className="flex items-center gap-2 text-sm text-red-500">
                    <AlertCircle className="h-4 w-4" />
                    {errors.sex.message}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sections 3 et 4 côte à côte en lg et xl */}
      <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-2">
        {/* Section 3: Description */}
        <Card className="h-full border-0 bg-white/90 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl">
          <CardHeader className="border-b border-emerald-100 bg-gradient-to-r from-emerald-50 to-teal-50">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 p-2">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <div className="flex items-center">
                <CardTitle className="text-xl text-slate-800">
                  Description détaillée
                </CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex h-full flex-col p-8">
            <div className="flex h-full flex-col space-y-6">
              <div className="flex-shrink-0 space-y-3">
                <Label
                  htmlFor="description"
                  className="flex items-center gap-2 text-sm font-semibold text-slate-700"
                >
                  <FileText className="h-4 w-4" />
                  Description de votre profil
                  <span className="text-xs font-normal text-slate-500">
                    (optionnel mais recommandé)
                  </span>
                </Label>
              </div>

              <div className="relative min-h-0 flex-1">
                <Textarea
                  id="description"
                  {...register('description')}
                  placeholder="Décrivez-vous en quelques mots... (ex: vos passions, ce que vous recherchez, etc.)"
                  disabled={isPending}
                  className={`text-md h-full resize-none p-4 leading-relaxed transition-all duration-300 min-lg:text-lg ${
                    errors.description
                      ? 'border-red-300 bg-red-50/30 focus:border-red-500 focus:ring-red-200'
                      : 'border-slate-200 bg-white hover:border-emerald-300 focus:border-emerald-500 focus:ring-emerald-200'
                  }`}
                />
                {/* Indicateur de caractères */}
                <div className="absolute right-3 bottom-3 rounded-md bg-white/80 px-2 py-1 text-xs text-slate-400">
                  {descriptionLength} caractères
                </div>
              </div>

              {errors.description && (
                <div className="flex flex-shrink-0 items-center gap-2 text-sm text-red-500">
                  <AlertCircle className="h-4 w-4" />
                  {errors.description.message}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Section 4: Images uploadées */}
        <Card className="h-full border-0 bg-white/90 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl">
          <CardHeader className="border-b border-orange-100 bg-gradient-to-r from-orange-50 to-amber-50">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 p-2">
                <Upload className="h-5 w-5 text-white" />
              </div>
              <div className="flex items-center">
                <CardTitle className="text-xl text-slate-800">
                  Images du produit
                </CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex h-full flex-col p-8">
            <div className="flex h-full flex-col space-y-6">
              <div className="flex-shrink-0 space-y-3">
                <Label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Upload className="h-4 w-4" />
                  Photos de profil
                  <span className="text-xs font-normal text-slate-500">
                    (glissez-déposez ou cliquez)
                  </span>
                </Label>
              </div>

              <div className="min-h-0 flex-1 overflow-hidden">
                <DropZone
                  getInfo={async (url) => {
                    // Ajouter l'image à la liste des images du produit
                    const newImages = [...productImages, url];
                    setProductImages(newImages);
                    // Mettre à jour le champ images avec toutes les images
                    setValue('images', newImages);
                    toast.success('Image uploadée avec succès !');
                  }}
                  onUploadStart={() => setIsUploading(true)}
                  onUploadComplete={() => setIsUploading(false)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Boutons d'action */}
      <div className="flex flex-col gap-4 pt-8 sm:flex-row">
        <Button
          type="submit"
          className="h-14 flex-1 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 font-semibold text-white shadow-xl transition-all duration-300 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 hover:shadow-2xl"
          disabled={isPending || !isValid || isUploading}
        >
          {isPending ? (
            <div className="flex items-center gap-3">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              <span>Mise à jour en cours...</span>
            </div>
          ) : isUploading ? (
            <div className="flex items-center gap-3">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              <span>Upload des photos en cours...</span>
            </div>
          ) : (
            <>
              <Save className="mr-2 h-5 w-5" />
              Mettre à jour le profil
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default CreateProductForm;
