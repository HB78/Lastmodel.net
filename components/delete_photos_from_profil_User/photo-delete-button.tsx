'use client';

import { deletePhotoAction } from '@/actions/delete/deletePhoto';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { usePhotoManagement } from './photo-management';

interface PhotoDeleteButtonProps {
  photoId: string;
  isMain: boolean;
}

export function PhotoDeleteButton({ photoId, isMain }: PhotoDeleteButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [showConfirm, setShowConfirm] = useState(false);
  const { deletePhoto } = usePhotoManagement();

  const handleDelete = () => {
    if (isMain) {
      toast.error('Vous ne pouvez pas supprimer la photo principale');
      return;
    }

    if (!showConfirm) {
      setShowConfirm(true);
      return;
    }

    startTransition(async () => {
      // 1. Mise à jour optimiste immédiate
      deletePhoto(photoId);

      try {
        // 2. Suppression réelle
        const result = await deletePhotoAction(photoId);

        if (result.success) {
          toast.success(result.message);
          // L'UI est déjà mise à jour grâce à useOptimistic
        } else {
          toast.error(result.error || result.message);
          // En cas d'erreur, l'état reviendra automatiquement
        }
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        toast.error('Erreur lors de la suppression de la photo');
        // En cas d'erreur, l'état reviendra automatiquement
      } finally {
        setShowConfirm(false);
      }
    });
  };

  const handleCancel = () => {
    setShowConfirm(false);
  };

  if (isMain) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="h-8 w-8 cursor-not-allowed p-0 opacity-50"
        disabled
        title="Impossible de supprimer la photo principale"
      >
        <Trash2 className="h-3 w-3" />
      </Button>
    );
  }

  return (
    <div className="flex gap-1">
      {showConfirm ? (
        <>
          <Button
            variant="destructive"
            size="sm"
            className="h-8 px-2 text-xs"
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending ? '...' : 'Confirmer'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 px-2 text-xs"
            onClick={handleCancel}
            disabled={isPending}
          >
            Annuler
          </Button>
        </>
      ) : (
        <Button
          variant="outline"
          size="sm"
          className="h-8 w-8 p-0 hover:border-red-300 hover:bg-red-50 hover:text-red-600"
          onClick={handleDelete}
          disabled={isPending}
          title="Supprimer cette photo"
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
}
