'use client';

import { FileItem } from '../types';
import { PhotoCard } from './PhotoCard';

// Props du composant : reçoit les photos secondaires (pas la principale)
interface PhotoGalleryProps {
  otherPhotos: FileItem[]; // Liste des photos qui ne sont PAS la photo principale
  onDelete: (
    // Fonction pour supprimer une photo
    event: React.MouseEvent,
    fileId: string | null,
    fileName: string
  ) => void;
  isPending: boolean; // État de chargement (pour désactiver les boutons)
}

/**
 * Composant PhotoGallery : Affiche la galerie des photos secondaires
 *
 * Ce composant affiche toutes les photos uploadées SAUF la photo principale.
 * Il utilise le composant PhotoCard pour afficher chaque photo individuellement.
 *
 * Structure :
 * - Titre "Galerie photos"
 * - Grille responsive de photos (4-6 colonnes selon l'écran)
 * - Chaque photo est affichée via PhotoCard
 */
export function PhotoGallery({
  otherPhotos,
  onDelete,
  isPending,
}: PhotoGalleryProps) {
  // Si aucune photo secondaire, ne rien afficher
  if (otherPhotos.length === 0) return null;

  return (
    <div className="mt-6">
      {/* Titre de la section galerie */}
      <h3 className="mb-3 text-sm font-medium text-gray-700">Galerie photos</h3>

      {/* Grille responsive des photos secondaires */}
      {/* 
        - grid-cols-4 : 4 colonnes sur mobile
        - sm:grid-cols-5 : 5 colonnes sur petit écran
        - md:grid-cols-6 : 6 colonnes sur écran moyen+
      */}
      <div className="grid grid-cols-4 gap-3 sm:grid-cols-5 md:grid-cols-6">
        {otherPhotos.map((photo, index) => (
          <PhotoCard
            key={`${photo.file.name}-${index}`}
            photo={photo}
            index={index}
            onDelete={onDelete}
            isPending={isPending}
          />
        ))}
      </div>
    </div>
  );
}
