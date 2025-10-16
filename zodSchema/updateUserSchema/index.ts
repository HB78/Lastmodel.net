import { z } from 'zod';

//Schema pour le update de mot de passe
export const ChangePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Le mot de passe actuel est requis'),
    newPassword: z
      .string()
      .min(6, 'Le nouveau mot de passe doit contenir au moins 6 caractères')
      .max(128, 'Le nouveau mot de passe ne peut pas dépasser 128 caractères'),
    confirmPassword: z
      .string()
      .min(6, 'Veuillez confirmer votre nouveau mot de passe'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Les nouveaux mots de passe ne correspondent pas',
    path: ['confirmPassword'],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "Le nouveau mot de passe doit être différent de l'actuel",
    path: ['newPassword'],
  });

//Schema pour la création d'un user
export const CreateUserProfilSchema = z.object({
  name: z
    .string()
    .min(3, 'Le nom doit contenir au moins 3 caractères')
    .max(100, 'Le nom ne peut pas dépasser 100 caractères'),
  sex: z.enum(['homme', 'femme']),
  age: z
    .number()
    .min(18, "L'âge minimum est de 18 ans")
    .max(100, "L'âge maximum est de 100 ans"),
  phone: z
    .string()
    .min(10, 'Le numéro de téléphone doit contenir au moins 10 caractères')
    .max(20, 'Le numéro de téléphone ne peut pas dépasser 20 caractères')
    .optional()
    .or(z.literal('')),
  images: z.array(z.string()).default([]),
  origin: z.string().min(1, "L'origine est requise"),
  city: z.string().min(2, 'La ville doit contenir au moins 2 caractères'),
  description: z
    .string()
    .min(10, 'La description doit contenir au moins 10 caractères')
    .max(500, 'La description ne peut pas dépasser 500 caractères'),
  poids: z
    .number()
    .int()
    .positive()
    .min(30, 'Le poids minimum est de 30 kg')
    .max(300, 'Le poids maximum est de 300 kg')
    .optional()
    .or(z.literal(0)),
  taille: z
    .number()
    .int()
    .positive()
    .min(100, 'La taille minimum est de 100 cm')
    .max(250, 'La taille maximum est de 250 cm')
    .optional()
    .or(z.literal(0)),
});

export const UpdateUserProfilSchema = z.object({
  name: z
    .string()
    .min(3, 'Le nom doit contenir au moins 3 caractères')
    .max(100, 'Le nom ne peut pas dépasser 100 caractères'),
  sex: z.enum(['homme', 'femme']),
  age: z
    .number()
    .min(18, "L'âge minimum est de 18 ans")
    .max(100, "L'âge maximum est de 100 ans"),
  phone: z
    .string()
    .min(10, 'Le numéro de téléphone doit contenir au moins 10 caractères')
    .max(20, 'Le numéro de téléphone ne peut pas dépasser 20 caractères')
    .optional()
    .or(z.literal('')),
  origin: z
    .string()
    .min(1, "L'origine est requise")
    .optional()
    .or(z.literal('')),
  city: z
    .string()
    .min(2, 'La ville doit contenir au moins 2 caractères')
    .optional()
    .or(z.literal('')),
  description: z
    .string()
    .min(10, 'La description doit contenir au moins 10 caractères')
    .max(500, 'La description ne peut pas dépasser 500 caractères')
    .optional()
    .or(z.literal('')),
  poids: z
    .number()
    .int()
    .positive()
    .min(30, 'Le poids minimum est de 30 kg')
    .max(300, 'Le poids maximum est de 300 kg')
    .optional()
    .or(z.literal(0)),
  taille: z
    .number()
    .int()
    .positive()
    .min(100, 'La taille minimum est de 100 cm')
    .max(250, 'La taille maximum est de 250 cm')
    .optional()
    .or(z.literal(0)),
});

export type UpdateUserProfilFormData = z.infer<typeof UpdateUserProfilSchema>;
export type CreateUserProfilFormData = z.infer<typeof CreateUserProfilSchema>;
export type ChangePasswordFormData = z.infer<typeof ChangePasswordSchema>;
