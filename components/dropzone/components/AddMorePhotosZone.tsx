'use client';

import { ImageIcon } from 'lucide-react';

/**
 * Props du composant AddMorePhotosZone
 *
 * @property getRootProps - Fonction de react-dropzone pour configurer la zone de drop
 * @property isDragActive - État indiquant si l'utilisateur est en train de faire glisser des fichiers
 * @property totalPhotos - Nombre total de photos actuellement uploadées
 */
interface AddMorePhotosZoneProps {
  getRootProps: any; // Props de react-dropzone
  isDragActive: boolean; // True si l'utilisateur fait glisser des fichiers
  totalPhotos: number; // Nombre total de photos uploadées
}

/**
 * Composant AddMorePhotosZone : Zone pour ajouter des photos supplémentaires
 *
 * Ce composant représente la zone de drop pour ajouter des photos
 * en plus de la photo principale. Il gère trois états visuels :
 *
 * 1. ÉTAT NORMAL : Instructions et informations sur les formats acceptés
 * 2. ÉTAT DRAG ACTIVE : Message d'encouragement pendant le glisser-déposer
 * 3. ÉTAT LIMITE ATTEINTE : Désactivé après 11 photos maximum
 *
 * Fonctionnalités :
 * - Zone de drop interactive avec react-dropzone
 * - Feedback visuel pendant le drag & drop
 * - Informations sur les formats de fichiers acceptés
 * - Désactivation automatique après 11 photos
 * - Design responsive avec hover effects
 */
export function AddMorePhotosZone({
  getRootProps,
  isDragActive,
  totalPhotos,
}: AddMorePhotosZoneProps) {
  // Constante pour la limite de photos
  const MAX_PHOTOS = 11;
  const canAddMore = totalPhotos < MAX_PHOTOS;

  // Si la limite est atteinte, afficher un message informatif
  if (!canAddMore) {
    return (
      <div className="w-full cursor-not-allowed rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 p-4">
        <div className="flex flex-col items-center gap-3 py-4">
          <div className="flex flex-col items-center gap-2">
            <ImageIcon className="h-8 w-8 text-gray-400" />
            <div className="text-center">
              <p className="mb-1 text-sm font-medium text-gray-500">
                Limite de photos atteinte
              </p>
              <p className="text-xs text-gray-400">
                Maximum {MAX_PHOTOS} photos autorisées
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      {...getRootProps({
        className:
          'w-full p-4 border-2 border-dashed border-violet-300 rounded-lg bg-white hover:border-violet-500 hover:bg-violet-50/30 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md',
      })}
    >
      {isDragActive ? (
        // ÉTAT 1 : L'utilisateur est en train de faire glisser des fichiers
        <div className="flex flex-col items-center gap-2 py-4">
          {/* Icône d'image avec couleur active */}
          <ImageIcon className="h-8 w-8 text-violet-500" />

          {/* Message d'encouragement pendant le drag */}
          <p className="text-center text-sm font-medium text-violet-600">
            Déposez vos photos ici...
          </p>
        </div>
      ) : (
        // ÉTAT 2 : Zone de drop normale (pas de drag en cours)
        <div className="flex flex-col items-center gap-3 py-4">
          <div className="flex flex-col items-center gap-2">
            {/* Icône d'image avec couleur normale */}
            <ImageIcon className="h-8 w-8 text-violet-400" />

            {/* Informations et instructions */}
            <div className="text-center">
              {/* Titre principal de la zone */}
              <p className="mb-1 text-sm font-medium text-gray-700">
                Ajouter plus de photos
              </p>

              {/* Spécifications techniques des fichiers acceptés */}
              <p className="text-xs text-gray-500">
                PNG, JPG, GIF jusqu'à 10MB
              </p>

              {/* Indicateur de photos restantes */}
              <p className="mt-1 text-xs text-violet-500">
                {totalPhotos}/{MAX_PHOTOS} photos utilisées
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
