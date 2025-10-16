'use client';

import { deleteCommentaireAction } from '@/actions/delete/deleteCommentaire';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { useActionState } from 'react';
import { toast } from 'sonner';

interface DeleteCommentaireProps {
  commentaireId: string;
  authorId: string; // ID de l'auteur du commentaire
  currentUserId?: string; // ID de l'utilisateur connecté
}

const DeleteCommentaire = ({
  commentaireId,
  authorId,
  currentUserId,
}: DeleteCommentaireProps) => {
  // Calculer les permissions
  const isAuthor = currentUserId === authorId;
  // État initial pour useActionState
  const initialState = {
    success: false,
    error: null,
    message: null,
  };

  const [state, formAction, isPending] = useActionState(
    deleteCommentaireAction,
    initialState
  );

  // Gérer les résultats de l'action
  if (state.success && state.message) {
    toast.success(state.message);
  } else if (state.error) {
    toast.error(state.error);
  }

  // Seuls l'auteur du commentaire ou un admin peuvent voir le bouton
  if (currentUserId !== authorId) {
    return null;
  }

  return (
    <form action={formAction}>
      <input type="hidden" name="commentaireId" value={commentaireId} />
      <Button
        type="submit"
        variant="ghost"
        size="sm"
        disabled={isPending}
        className="h-auto p-1 text-red-500 hover:bg-red-50 hover:text-red-700"
        title={
          isAuthor
            ? 'Supprimer mon commentaire'
            : 'Supprimer ce commentaire (Admin)'
        }
      >
        {isPending ? (
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
        ) : (
          <Trash2 className="h-4 w-4" />
        )}
      </Button>
    </form>
  );
};

export default DeleteCommentaire;
