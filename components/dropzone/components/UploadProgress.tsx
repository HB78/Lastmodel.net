'use client';

import { ImageIcon } from 'lucide-react';
import { FileItem } from '../types';

// Props du composant : reçoit la liste des fichiers
interface UploadProgressProps {
  files: FileItem[];
}

/**
 * Composant UploadProgress : Affiche les photos qui sont en cours d'upload
 *
 * Ce composant montre visuellement à l'utilisateur quelles photos sont
 * en train d'être uploadées vers S3, avec un spinner de chargement
 */
export function UploadProgress({ files }: UploadProgressProps) {
  // Filtrer les fichiers qui n'ont pas encore d'URL (donc pas encore uploadés)
  // Si file.url est null → photo en cours d'upload
  // Si file.url existe → photo déjà uploadée
  const uploadingFiles = files.filter((f) => !f.url);

  // Si aucune photo n'est en cours d'upload, ne rien afficher
  if (uploadingFiles.length === 0) return null;

  return (
    <div className="mt-6">
      {/* Titre de la section */}
      <h3 className="mb-3 text-sm font-medium text-gray-700">
        En cours d'upload
      </h3>

      {/* Grille des photos en cours d'upload */}
      <div className="grid grid-cols-4 gap-3 sm:grid-cols-5 md:grid-cols-6">
        {uploadingFiles.map(({ file }, index) => (
          <div key={`${file.name}-${index}`} className="relative w-full">
            <div className="flex flex-col items-center">
              {/* Zone de la photo avec spinner de chargement */}
              <div className="relative flex h-20 w-20 animate-pulse items-center justify-center rounded-lg bg-violet-100">
                {/* Icône d'image en arrière-plan */}
                <ImageIcon className="h-8 w-8 text-violet-500" />

                {/* Spinner de chargement qui tourne */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-violet-500 border-t-transparent"></div>
                </div>
              </div>

              {/* Texte indiquant que l'upload est en cours */}
              <div className="mt-1 text-center text-xs text-violet-500">
                Upload...
              </div>
            </div>

            {/* Nom du fichier en cours d'upload */}
            <div className="mt-1 max-w-[80px] truncate text-center text-xs text-gray-400">
              {file.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
