import { z } from 'zod';

//Schema pour la connexion
export const LoginSchema = z.object({
  email: z
    .email({
      message: 'Veuillez entrer une adresse email valide',
    })
    .min(6, { message: "L'email est requis" })
    .max(98, { message: "L'email est trop long" }),
  password: z.string().min(6, {
    message: 'Le mot de passe doit contenir au moins 6 caractères',
  }),
});

//Schema pour l'inscription
export const RegisterSchema = z
  .object({
    email: z
      .email({
        message: 'Veuillez entrer une adresse email valide',
      })
      .min(6, {
        message: "L'email est requis",
      }),
    password: z.string().min(6, {
      message: 'Le mot de passe doit contenir au moins 6 caractères',
    }),
    confirmPassword: z.string().min(6, {
      message: 'Veuillez confirmer votre mot de passe',
    }),
    name: z.string().min(2, {
      message: 'Le nom doit contenir au moins 2 caractères',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    // data contient les données du formulaire validés
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'], // Chemin où afficher l'erreur
  });

//Schema pour la création d'un user
export const CreateProductSchema = z.object({
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
  image: z.string().optional().or(z.literal('')),
  origin: z.string().min(1, "L'origine est requise"),
  city: z.string().min(2, 'La ville doit contenir au moins 2 caractères'),
  description: z
    .string()
    .min(10, 'La description doit contenir au moins 10 caractères')
    .max(500, 'La description ne peut pas dépasser 500 caractères'),
});

//Schema pour le mot de passe oublié
export const ForgotPasswordSchema = z.object({
  email: z
    .email({
      message: 'Veuillez entrer une adresse email valide',
    })
    .min(6, { message: "L'email est requis" })
    .max(98, { message: "L'email est trop long" }),
});

//Schema pour le reset du mot de passe
export const ResetPasswordSchema = z
  .object({
    password: z.string().min(6, {
      message: 'Le mot de passe doit contenir au moins 6 caractères',
    }),
    confirmPassword: z.string().min(6, {
      message: 'Veuillez confirmer votre mot de passe',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
  });

//Schema pour le magiklink
export const MagiklinkSchema = z.object({
  email: z
    .email({
      message: 'Veuillez entrer une adresse email valide',
    })
    .min(6, { message: "L'email est requis" })
    .max(98, { message: "L'email est trop long" }),
});

// Types inférés
export type LoginFormData = z.infer<typeof LoginSchema>;
export type RegisterFormData = z.infer<typeof RegisterSchema>;
export type CreateProductFormData = z.infer<typeof CreateProductSchema>;
export type ForgotPasswordFormData = z.infer<typeof ForgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof ResetPasswordSchema>;
export type MagiklinkFormData = z.infer<typeof MagiklinkSchema>;
