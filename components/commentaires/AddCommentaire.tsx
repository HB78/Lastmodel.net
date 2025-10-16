'use client';

import { createCommentaireAction } from '@/actions/creation/createCommentaire';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  CreateCommentaireFormData,
  createCommentaireSchema,
} from '@/zodSchema/commentaires';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, Send } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface AddCommentaireProps {
  id: string; // id du profil (profileId)
}

const AddCommentaireForm = ({ id }: AddCommentaireProps) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<CreateCommentaireFormData>({
    resolver: zodResolver(createCommentaireSchema),
    mode: 'onChange',
    defaultValues: {
      commentaire: '',
      profileId: id, // Ajouter l'ID du profil
    },
  });

  const onSubmit = (data: CreateCommentaireFormData) => {
    if (!id) {
      toast.error('Profil invalide.');
      return;
    }
    startTransition(async () => {
      try {
        // Préparer le FormData pour la server action
        console.log("debut de l'envoi du commentaire");
        const formData = new FormData();
        formData.append('commentaire', data.commentaire);
        formData.append('profileId', id);

        const result = await createCommentaireAction(formData);

        if (result.error) {
          toast.error(result.error);
          return;
        }
        // router.refresh();
        toast.success('Commentaire publié avec succès !');
        reset();
      } catch (error) {
        console.error("Erreur lors de l'ajout du commentaire:", error);
        toast.error('Une erreur est survenue. Veuillez réessayer.');
      }
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 rounded-xl border bg-white p-4 shadow-md"
      aria-labelledby="comment-form-title"
      noValidate
    >
      <fieldset
        className="space-y-2"
        disabled={isPending}
        aria-describedby={errors.commentaire ? 'comment-error' : undefined}
      >
        <legend className="sr-only" id="comment-form-title">
          Ajouter un commentaire
        </legend>

        <Label
          htmlFor="commentaire"
          className="flex items-center gap-2 text-sm font-semibold text-slate-700"
        >
          Votre commentaire
          <span className="text-red-500" aria-label="champ obligatoire">
            *
          </span>
        </Label>

        <Textarea
          id="commentaire"
          placeholder="Écrivez votre commentaire..."
          {...register('commentaire')}
          className={`min-h-[100px] resize-none transition-all duration-200 ${
            errors.commentaire
              ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
              : 'border-slate-200 focus:border-blue-500 focus:ring-blue-200'
          }`}
          disabled={isPending}
          aria-required="true"
          aria-invalid={errors.commentaire ? 'true' : 'false'}
          aria-describedby={
            errors.commentaire ? 'comment-error comment-help' : 'comment-help'
          }
          rows={4}
        />

        <div id="comment-help" className="text-xs text-gray-500">
          Partagez votre avis de manière respectueuse
        </div>

        {errors.commentaire && (
          <div
            id="comment-error"
            className="flex items-center gap-2 text-sm text-red-500"
            role="alert"
            aria-live="polite"
          >
            <AlertCircle className="h-4 w-4" aria-hidden="true" />
            <span>{errors.commentaire.message}</span>
          </div>
        )}
      </fieldset>

      <div className="flex items-center justify-between pt-2">
        <div className="text-xs text-gray-500" role="status" aria-live="polite">
          {isPending ? 'Publication en cours...' : 'Prêt à publier'}
        </div>

        <Button
          type="submit"
          className="flex items-center gap-2 bg-blue-600 font-medium text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          disabled={isPending || !isValid}
          aria-describedby={isPending ? 'submit-status' : undefined}
        >
          {isPending ? (
            <div className="flex items-center gap-3">
              <div
                className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
                aria-hidden="true"
              />
              <span id="submit-status">Publication...</span>
            </div>
          ) : (
            <>
              <Send className="h-4 w-4" aria-hidden="true" />
              Publier le commentaire
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default AddCommentaireForm;
