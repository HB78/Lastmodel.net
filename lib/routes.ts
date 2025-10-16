/**
 * ROUTES PUBLIQUES
 * Ces routes sont accessibles à tout le monde, même sans être connecté
 * Aucune authentification requise
 */
export const publicRoutes: string[] = [
  '/', // Page d'accueil
  '/signin', // Page de connexion
  '/signup', // Page d'inscription
  '/signup/success', // Page de succès après inscription
  '/forgot-password', // Page mot de passe oublié
  '/forgot-password/success', // Page de succès après demande de reset
  '/reset-password', // Page de réinitialisation du mot de passe
  '/auth/verificationtoken', // Page de vérification d'email
  '/contact', // Page de contact
  '/produits/**', // Liste des produits et détails (visible par tous)
  '/pricing',
];

/**
 * ROUTES D'AUTHENTIFICATION
 * Si l'utilisateur est déjà connecté et essaie d'aller sur ces pages,
 * il sera automatiquement redirigé vers la page d'accueil
 * Car pas besoin de se connecter si on est déjà connecté !
 */
export const authRoutes: string[] = [
  '/signin', // Page de connexion
  '/signup', // Page d'inscription
  '/forgot-password', // Page mot de passe oublié
  '/reset-password', // Page de réinitialisation
];

/**
 * ROUTES PROTÉGÉES
 * Ces routes nécessitent d'être connecté
 * Si pas connecté → redirection vers /signin
 */
export const protectedRoutes: string[] = [
  '/produits/create', // Créer un produit (il faut être connecté)
];

/**
 * ROUTES ADMIN
 * Ces routes nécessitent d'être connecté ET d'avoir le rôle "ADMIN"
 * Si pas admin → redirection vers page d'accueil
 */
export const adminRoutes: string[] = [
  '/admin', // Panel d'administration
  '/admin/dashboard', // Dashboard admin avec messages
];

/**
 * PRÉFIXE API D'AUTHENTIFICATION
 * Toutes les routes qui commencent par "/api/auth" sont gérées par Better Auth
 * Le middleware les laisse passer sans vérification
 */
export const apiAuthPrefix: string = '/api/auth';

/**
 * REDIRECTION PAR DÉFAUT
 * Où rediriger l'utilisateur après une connexion réussie
 */
export const DEFAULT_LOGIN_REDIRECT: string = '/';

/**
 * ORIGINES AUTORISÉES POUR CORS
 * Liste des domaines autorisés à faire des requêtes à votre API
 * Protection contre les attaques cross-origin
 */
export const allowedOrigins: string[] = [
  'http://localhost:3000', // Développement local
  'https://lastmodel.net', // Production
  'https://www.lastmodel.net', // Production avec www
];
