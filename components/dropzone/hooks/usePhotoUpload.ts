import { deleteImagesAction } from '@/actions/delete/deleteImagefromS3';
import { useCallback, useState, useTransition } from 'react';
import { toast } from 'sonner';
import { FileItem } from '../types';

/**
 * Hook usePhotoUpload : Gère tout le cycle de vie des photos
 *
 * Ce hook centralise toute la logique d'upload, suppression et gestion d'état
 * des photos. Il utilise React.useTransition pour une meilleure UX.
 *
 * Fonctionnalités :
 * - Upload de fichiers vers S3/R2
 * - Gestion de l'état des fichiers (uploading, completed, error)
 * - Suppression de photos (S3 + UI)
 * - Gestion des erreurs avec toast notifications
 *
 * @param getInfo - Fonction callback appelée après chaque upload réussi
 * @returns Objet avec l'état et les fonctions de gestion
 */
export function usePhotoUpload(
  getInfo: (url: string) => Promise<void>,
  onUploadStart?: () => void,
  onUploadComplete?: () => void,
  maxPhotos: number = 11
) {
  // État local des fichiers uploadés/en cours d'upload
  const [files, setFiles] = useState<FileItem[]>([]);

  // État de transition pour gérer les opérations asynchrones
  const [isPending, startTransition] = useTransition();

  /**
   * Upload d'un fichier vers S3/R2
   *
   * @param file - Le fichier à uploader
   *
   * Processus :
   * 1. Création d'un FormData avec le fichier
   * 2. Envoi vers l'API /api/s3-upload
   * 3. Mise à jour de l'état local avec l'URL reçue
   * 4. Appel du callback getInfo pour informer le parent
   * 5. Gestion des erreurs avec toast
   */
  const uploadToS3 = async (file: File) => {
    try {
      // Préparation des données pour l'upload
      const data = new FormData();
      data.set('file', file);
      data.set('prefix', 'images'); // Dossier de destination sur S3

      // Envoi du fichier vers notre API d'upload
      const res = await fetch('/api/s3-upload', {
        method: 'POST',
        body: data,
      });

      const result = await res.json();

      if (res.ok) {
        // Upload réussi : informer le composant parent
        await getInfo(result.url);

        // Mettre à jour l'état local avec l'URL et l'ID reçus
        setFiles((prevFiles) =>
          prevFiles.map((item) =>
            item.file.name === file.name
              ? { ...item, url: result.url, id: result.id || '' }
              : item
          )
        );

        toast.success(`File ${file.name} uploaded successfully!`);
      } else {
        // Erreur lors de l'upload
        toast.error(`Upload failed: ${result.error || 'Unknown error'}`);
        console.error('Upload error:', result);
      }
    } catch (error) {
      // Erreur réseau ou autre
      console.error('Upload error:', error);
      toast.error(`Network error uploading ${file.name}`);
    }
  };

  /**
   * Suppression d'une photo
   *
   * @param event - Événement de clic (prévenu pour éviter le scroll)
   * @param fileId - ID du fichier sur S3 (null si pas encore uploadé)
   * @param fileName - Nom du fichier pour l'identification
   *
   * Processus :
   * 1. Prévention du comportement par défaut
   * 2. Si fileId existe : suppression sur S3 + UI
   * 3. Si pas de fileId : suppression uniquement de l'UI (encore en cours d'upload)
   * 4. Gestion des erreurs avec toast
   */
  const handleDelete = async (
    event: React.MouseEvent,
    fileId: string | null,
    fileName: string
  ) => {
    // ✅ FIX: Empêcher le scroll vers le haut lors de la suppression
    event.preventDefault();
    event.stopPropagation();

    startTransition(async () => {
      try {
        if (fileId) {
          // Fichier déjà uploadé : suppression sur S3
          const result = await deleteImagesAction(fileId);
          if (result?.success) {
            // Suppression réussie : retirer de l'état local
            setFiles((prevFiles) =>
              prevFiles.filter((item) => item.file.name !== fileName)
            );
            toast.success(`File ${fileName} deleted successfully!`);
          } else {
            toast.error(result?.message || 'Failed to delete file');
          }
        } else {
          // Fichier encore en cours d'upload : suppression uniquement de l'UI
          setFiles((prevFiles) =>
            prevFiles.filter((item) => item.file.name !== fileName)
          );
          toast.success(`Removed ${fileName} from queue`);
        }
      } catch (error) {
        console.error('Delete error:', error);
        toast.error(
          `Error deleting ${fileName}: ${
            error instanceof Error ? error.message : 'Unknown error'
          }`
        );
      }
    });
  };

  /**
   * Gestion du drop de fichiers
   *
   * @param acceptedFiles - Liste des fichiers acceptés par react-dropzone
   *
   * Processus :
   * 1. Vérification de la limite de photos (11 maximum)
   * 2. Ajout des fichiers à l'état local avec état initial (url: null)
   * 3. Démarrage de l'upload de chaque fichier en parallèle
   * 4. Utilisation de startTransition pour une UX fluide
   */
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      // Constante pour la limite de photos

      if (acceptedFiles.length > 0) {
        // Vérification de la limite de photos
        const currentPhotoCount = files.length;
        const newPhotoCount = currentPhotoCount + acceptedFiles.length;

        if (newPhotoCount > maxPhotos) {
          const remainingSlots = maxPhotos - currentPhotoCount;
          if (remainingSlots <= 0) {
            toast.error(
              `Limite de ${maxPhotos} photos atteinte. Supprimez des photos avant d'en ajouter de nouvelles.`
            );
            return;
          } else {
            toast.warning(
              `Vous ne pouvez ajouter que ${remainingSlots} photo(s) de plus. Limite de ${maxPhotos} photos.`
            );
            // Limiter le nombre de fichiers acceptés
            acceptedFiles = acceptedFiles.slice(0, remainingSlots);
          }
        }

        // Notifier le début des uploads
        onUploadStart?.();

        // ✅ Add files with initial state (url: null = en cours d'upload)
        setFiles((prevFiles) => [
          ...prevFiles,
          ...acceptedFiles.map((file) => ({
            file,
            id: '',
            url: null, // Pas d'URL = pas encore uploadé
          })),
        ]);

        // Démarrage de l'upload de chaque fichier en parallèle
        let completedUploads = 0;
        const totalUploads = acceptedFiles.length;

        acceptedFiles.forEach((file) => {
          startTransition(async () => {
            await uploadToS3(file); // ← Appel direct de uploadToS3

            // Vérifier si tous les uploads sont terminés
            completedUploads++;
            if (completedUploads === totalUploads) {
              onUploadComplete?.();
            }
          });
        });
      }
    },
    [files.length, onUploadStart, onUploadComplete]
  );

  // Retour des valeurs et fonctions pour le composant parent
  return {
    files, // État actuel des fichiers
    isPending, // Indicateur de chargement
    onDrop, // Fonction de gestion du drop
    handleDelete, // Fonction de suppression
  };
}

// je fais la fonction uploadToS3
// je fais la fonction handleDelete
// je fais la fonction onDrop qui gere tout
//    -> reception des photos et mise dans le state mais sans url
//    -> démarrage de l'upload de chaque fichier en parallèle
//    -> si upload réussi, on met l'url dans le state grace a uploadToS3
