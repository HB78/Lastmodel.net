import { z } from 'zod';

// Schema pour la création d'un commentaire
export const createCommentaireSchema = z.object({
  commentaire: z
    .string()
    .min(3, 'Le commentaire doit contenir au moins 3 caractères')
    .max(250, 'Le commentaire ne peut pas dépasser 250 caractères'),

  // NOUVEAU : ID du profil sur lequel on commente
  profileId: z.string().min(1, "L'ID du profil est requis"),
});

export type CreateCommentaireFormData = z.infer<typeof createCommentaireSchema>;
