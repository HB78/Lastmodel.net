import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().min(1, "L'ID du profil est requis").max(100),
  email: z.email(),
  subject: z.string().min(5).max(100),
  message: z.string().min(5).max(100),
});

export type ContactFormData = z.infer<typeof contactSchema>;
