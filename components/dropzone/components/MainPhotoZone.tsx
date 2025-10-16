'use client';

import { Button } from '@/components/ui/button';
import { extractFileIdFromUrl } from '@/lib/dryApiFunction/extractUrl';
import { ImageIcon, StarIcon, XIcon } from 'lucide-react';
import NextImage from 'next/image';
import { FileItem } from '../types';

/**
 * Props du composant MainPhotoZone
 *
 * @property mainPhoto - La photo principale actuelle (undefined si aucune)
 * @property onDelete - Fonction de suppression de la photo
 * @property isPending - État de chargement (pour désactiver les boutons)
 * @property getRootProps - Fonction de react-dropzone pour la zone de drop
 */
interface MainPhotoZoneProps {
  mainPhoto: FileItem | undefined;
  onDelete: (
    event: React.MouseEvent,
    fileId: string | null,
    fileName: string
  ) => void;
  isPending: boolean;
  getRootProps: any; // Props de react-dropzone
}

/**
 * Composant MainPhotoZone : Zone dédiée à la photo principale
 *
 * Ce composant affiche la photo principale du profil utilisateur.
 * Il gère deux états :
 * 1. AVEC photo : Affichage de la photo + boutons d'action
 * 2. SANS photo : Zone de drop pour ajouter la première photo
 *
 * Fonctionnalités :
 * - Affichage de la photo principale en grand format
 * - Bouton de suppression avec confirmation
 * - Badge "Principale" pour identifier la photo
 * - Bouton "Changer principale" (fonctionnalité future)
 * - Zone de drop si aucune photo principale
 */
export function MainPhotoZone({
  mainPhoto,
  onDelete,
  isPending,
  getRootProps,
}: MainPhotoZoneProps) {
  return (
    <div className="mb-6">
      {mainPhoto ? (
        // ÉTAT 1 : Photo principale existante
        <div className="relative">
          {/* Affichage de la photo principale */}
          <NextImage
            src={mainPhoto.url!}
            alt="Photo principale"
            width={400}
            height={400}
            className="h-80 w-full rounded-xl object-cover shadow-lg"
          />

          {/* Bouton de suppression de la photo principale */}
          <div className="absolute top-3 left-3">
            <Button
              type="button"
              onClick={(event) => {
                // Extraction de l'ID S3 depuis l'URL pour la suppression
                const fileKey = mainPhoto.url
                  ? extractFileIdFromUrl(mainPhoto.url)
                  : null;
                onDelete(event, fileKey, mainPhoto.file.name);
              }}
              variant="destructive"
              size="sm"
              className="h-6 w-6 cursor-pointer rounded-full p-0"
              disabled={isPending}
            >
              <XIcon className="h-3 w-3 cursor-pointer" />
            </Button>
          </div>

          {/* Badge "Principale" pour identifier la photo */}
          <div className="absolute top-3 right-3">
            <div className="flex items-center gap-1 rounded-full bg-violet-500 px-2 py-1 text-xs text-white">
              <StarIcon className="h-3 w-3" />
              Principale
            </div>
          </div>

          {/* Bouton pour changer la photo principale (fonctionnalité future) */}
          <div className="absolute bottom-3 left-3">
            <Button
              variant="outline"
              size="sm"
              className="bg-white/90 backdrop-blur-sm hover:bg-white"
            >
              Changer principale
            </Button>
          </div>
        </div>
      ) : (
        // ÉTAT 2 : Aucune photo principale - Zone de drop
        <div
          {...getRootProps()}
          className="flex h-80 w-full cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-violet-300 bg-violet-50 transition-all duration-200 hover:border-violet-500 hover:bg-violet-100/50"
        >
          <div className="text-center">
            {/* Icône d'image pour indiquer le type de fichier attendu */}
            <ImageIcon className="mx-auto mb-4 h-16 w-16 text-violet-400" />

            {/* Titre principal de la zone */}
            <p className="text-lg font-medium text-violet-600">
              Photo principale
            </p>

            {/* Instructions pour l'utilisateur */}
            <p className="text-sm text-violet-500">
              Cliquez ou glissez-déposez
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
