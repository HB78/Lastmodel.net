'use client';

import { useSession } from '@/lib/better-auth-setup/authClient';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';
import { AddMorePhotosZone } from './components/AddMorePhotosZone';
import { MainPhotoZone } from './components/MainPhotoZone';
import { PhotoGallery } from './components/PhotoGallery';
import { UploadProgress } from './components/UploadProgress';
import { usePhotoUpload } from './hooks/usePhotoUpload';

/**
 * Composant DropZone : Composant principal orchestrant tout le système de photos
 *
 * Ce composant est le point d'entrée principal qui :
 * 1. Configure react-dropzone pour la gestion des fichiers
 * 2. Utilise le hook usePhotoUpload pour la logique métier
 * 3. Organise l'affichage en zones distinctes (principale, galerie, upload)
 * 4. Gère les erreurs de validation des fichiers
 *
 * Architecture modulaire :
 * - MainPhotoZone : Photo principale en grand format
 * - AddMorePhotosZone : Zone de drop pour photos supplémentaires
 * - PhotoGallery : Galerie des photos secondaires
 * - UploadProgress : Indicateur de progression des uploads
 *
 * @param getInfo - Callback appelé après chaque upload réussi pour synchroniser l'état
 */
export function DropZone({
  getInfo,
  onUploadStart,
  onUploadComplete,
}: {
  getInfo: (url: string) => Promise<void>;
  onUploadStart?: () => void;
  onUploadComplete?: () => void;
}) {
  // Hook personnalisé gérant toute la logique d'upload et de suppression
  const { data: session } = useSession();

  // Calculer la limite selon le type d'abonnement
  const maxPhotos = session?.user?.subscriptionType === 'FREE' ? 1 : 11;

  const { files, isPending, onDrop, handleDelete } = usePhotoUpload(
    getInfo,
    onUploadStart,
    onUploadComplete,
    maxPhotos
  );

  // Configuration de react-dropzone avec validation et gestion d'erreurs
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, // Fonction appelée quand des fichiers sont déposés
    maxSize: 1024 * 1024 * 10, // Taille maximale : 10MB
    accept: {
      // Types de fichiers acceptés : toutes les images
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
    },
    // Gestion des fichiers rejetés (trop gros, mauvais type, etc.)
    onDropRejected: (rejectedFiles) => {
      rejectedFiles.forEach(({ file, errors }) => {
        // Messages d'erreur spécifiques selon le type de problème
        if (errors[0]?.code === 'file-too-large') {
          toast.error(`${file.name} is too large (max 10MB)`);
        } else if (errors[0]?.code === 'file-invalid-type') {
          toast.error(`${file.name} is not an accepted image type`);
        } else {
          toast.error(`Error with file ${file.name}: ${errors[0]?.message}`);
        }
      });
    },
  });

  // Logique de séparation des photos :
  // - mainPhoto : première photo uploadée (devient la principale)
  // - otherPhotos : toutes les autres photos (galerie)
  const mainPhoto = files.find((file) => file.url);
  const otherPhotos = files.filter((file) => file.url && file !== mainPhoto);

  return (
    <>
      {/* Input caché nécessaire pour que react-dropzone fonctionne */}
      <input {...getInputProps()} />

      {/* Zone photo principale (grande) - Premier fichier uploadé */}
      <MainPhotoZone
        mainPhoto={mainPhoto}
        onDelete={handleDelete}
        isPending={isPending}
        getRootProps={getRootProps}
      />

      {/* Zone de drop pour ajouter plus de photos - Toujours visible */}
      <AddMorePhotosZone
        getRootProps={getRootProps}
        isDragActive={isDragActive}
        totalPhotos={files.length}
      />

      {/* Galerie des autres photos (petites) - Photos secondaires */}
      <PhotoGallery
        otherPhotos={otherPhotos}
        onDelete={handleDelete}
        isPending={isPending}
      />

      {/* Affichage des fichiers en cours d'upload - Indicateur de progression */}
      <UploadProgress files={files} />
    </>
  );
}
