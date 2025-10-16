'use client';

import { Button } from '@/components/ui/button';
import { XIcon } from 'lucide-react';
import NextImage from 'next/image';
import { FileItem } from '../types';

/**
 * Props du composant PhotoCard
 *
 * @property photo - L'objet FileItem contenant les informations de la photo
 * @property index - Index de la photo dans la galerie (pour la clé React)
 * @property onDelete - Fonction de suppression de la photo
 * @property isPending - État de chargement (pour désactiver le bouton de suppression)
 */
interface PhotoCardProps {
  photo: FileItem;
  index: number;
  onDelete: (
    event: React.MouseEvent,
    fileId: string | null,
    fileName: string
  ) => void;
  isPending: boolean;
}

/**
 * Composant PhotoCard : Affichage d'une photo individuelle dans la galerie
 *
 * Ce composant représente une photo secondaire dans la galerie.
 * Il affiche la photo en petit format avec :
 * - L'image elle-même (80x80px)
 * - Un indicateur de statut "✓ Ajoutée"
 * - Le nom du fichier
 * - Un bouton de suppression
 *
 * Le bouton de suppression utilise directement photo.id qui contient la clé S3
 * pour la suppression (plus fiable que d'extraire depuis l'URL).
 */
export function PhotoCard({
  photo,
  index,
  onDelete,
  isPending,
}: PhotoCardProps) {
  // Utilisation directe de photo.id qui contient la clé S3
  // Plus fiable que d'extraire depuis l'URL
  const fileKey = photo.id || null;

  return (
    <div key={`${photo.file.name}-${index}`} className="group relative w-full">
      {/* Zone de l'image */}
      <div className="relative">
        {/* Affichage de la photo en petit format */}
        <NextImage
          src={photo.url!}
          alt={photo.file.name}
          width={80}
          height={80}
          className="h-20 w-20 rounded-lg object-cover shadow-sm"
        />

        {/* Indicateur de statut : photo ajoutée avec succès */}
        <div className="mt-1 text-center text-xs text-green-600">✓ Ajoutée</div>
      </div>

      {/* Nom du fichier (tronqué si trop long) */}
      <div className="mt-1 max-w-[80px] truncate text-center text-xs text-gray-400">
        {photo.file.name}
      </div>

      {/* Bouton de suppression de la photo */}
      <div className="absolute -top-2 -right-2 rounded-full bg-red-500 opacity-100 transition-opacity duration-300">
        <Button
          type="button"
          onClick={(event) => onDelete(event, fileKey, photo.file.name)}
          variant="destructive"
          size="sm"
          className="h-6 w-6 cursor-pointer rounded-full p-0"
          disabled={isPending}
        >
          <XIcon className="h-3 w-3 cursor-pointer" />
        </Button>
      </div>
    </div>
  );
}
