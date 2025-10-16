import { z } from 'zod';

// Schema pour toggle like/unlike
export const toggleLikeSchema = z.object({
  profileId: z.string().min(1, "L'ID du profil est requis"),
});

export type ToggleLikeFormData = z.infer<typeof toggleLikeSchema>;
