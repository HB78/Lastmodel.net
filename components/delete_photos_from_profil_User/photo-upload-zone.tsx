'use client';

import { addPhotoAction } from '@/actions/creation/addPhoto';
import { DropZone } from '@/components/dropzone/Dropzone';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, Upload } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { usePhotoManagement } from './photo-management';

export function PhotoUploadZone() {
  const [isUploading, setIsUploading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { optimisticPhotos, addPhoto } = usePhotoManagement();
  const router = useRouter();

  const handlePhotoUploaded = async (url: string) => {
    startTransition(async () => {
      try {
        const result = await addPhotoAction(url);

        if (result.success && result.photo) {
          // Ajouter optimistiquement la vraie photo retournée par le serveur
          addPhoto(result.photo);
          toast.success(result.message);
        } else {
          toast.error(result.error || result.message);
        }
      } catch (error) {
        console.error("Erreur lors de l'ajout de la photo:", error);
        toast.error("Erreur lors de l'ajout de la photo");
      }
    });
  };

  const maxPhotos = 11;
  const canUploadMore = optimisticPhotos.length < maxPhotos;

  if (!canUploadMore) {
    return (
      <Card className="mb-8 border-0 bg-white/90 shadow-lg backdrop-blur-sm">
        <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-slate-50">
          <CardTitle className="flex items-center gap-3 text-xl text-slate-800">
            <Upload className="h-5 w-5 text-gray-600" />
            Limite atteinte
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4 text-center">
            <div className="rounded-lg border-2 border-dashed border-gray-300 p-8">
              <Camera className="mx-auto mb-4 h-12 w-12 text-gray-400" />
              <p className="mb-2 text-lg font-medium text-slate-700">
                Limite de {maxPhotos} photos atteinte
              </p>
              <p className="text-sm text-slate-500">
                Supprimez des photos pour en ajouter de nouvelles
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-8 border-0 bg-white/90 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl">
      <CardHeader className="border-b border-green-100 bg-gradient-to-r from-green-50 to-emerald-50">
        <CardTitle className="flex items-center gap-3 text-xl text-slate-800">
          <Upload className="h-5 w-5 text-green-600" />
          Ajouter des photos
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4 text-center">
          <div className="rounded-lg border-2 border-dashed border-green-300 p-8 transition-colors hover:border-green-400">
            <Camera className="mx-auto mb-4 h-12 w-12 text-green-400" />
            <p className="mb-2 text-lg font-medium text-slate-700">
              Glissez-déposez vos photos ici
            </p>
            <p className="mb-4 text-sm text-slate-500">
              ou cliquez pour sélectionner des fichiers
            </p>
            <DropZone
              getInfo={handlePhotoUploaded}
              onUploadStart={() => setIsUploading(true)}
              onUploadComplete={() => setIsUploading(false)}
            />
            {isPending && (
              <div className="mt-4 flex items-center justify-center gap-2 text-sm text-slate-600">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600"></div>
                <span>Sauvegarde en cours...</span>
              </div>
            )}
          </div>
          <p className="text-xs text-slate-500">
            Formats acceptés : JPG, PNG, WEBP • Maximum 5MB par photo
          </p>
          <p className="text-xs text-slate-500">
            {optimisticPhotos.length}/{maxPhotos} photos utilisées
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
