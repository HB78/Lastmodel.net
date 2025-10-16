'use client';

import { deleteUserAction } from '@/actions/delete/deleteUser';
import { Button } from '@/components/ui/button';
import { useActionState, useState } from 'react';

// UI de suppression de compte côté client avec useActionState
// L'userId est récupéré depuis la session côté serveur (plus sécurisé)
export default function DeleteUser() {
  // Ouvre/ferme le panneau de confirmation
  const [open, setOpen] = useState(false);

  // useActionState gère automatiquement l'état de soumission et les erreurs
  const [state, formAction, isPending] = useActionState(deleteUserAction, {
    success: false,
    error: null,
    message: null,
  });

  return (
    <div className="space-y-3">
      {!open ? (
        // Bouton d'entrée
        <Button
          variant="destructive"
          onClick={() => setOpen(true)}
          className="bg-red-600 hover:bg-red-700"
        >
          Supprimer mon compte
        </Button>
      ) : (
        // Panneau de confirmation minimal
        <div className="space-y-3 rounded-lg border p-4">
          <p className="text-sm text-red-700">
            Cette action est irréversible. Toutes vos données (profil, photos,
            etc.) seront définitivement supprimées.
          </p>

          {/* Affichage des erreurs */}
          {state?.error && (
            <div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {state.error}
            </div>
          )}

          {/* Le <form> appelle directement la Server Action */}
          <form action={formAction} className="space-y-3">
            <div className="flex items-center gap-2">
              <Button
                type="submit"
                disabled={isPending}
                className="bg-red-600 hover:bg-red-700 disabled:opacity-60"
              >
                {isPending ? 'Suppression...' : 'Confirmer la suppression'}
              </Button>

              <Button
                type="button"
                variant="outline"
                disabled={isPending}
                onClick={() => {
                  setOpen(false);
                }}
              >
                Annuler
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
