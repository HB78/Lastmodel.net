import { AlertTriangle, XCircle } from 'lucide-react';

// 🎯 DICTIONNAIRE DES MESSAGES D'ERREUR
// Cette approche évite la duplication de code et facilite la maintenance
export const ERROR_MESSAGES: Record<string, string> = {
  TOKEN_EXPIRED:
    'Le lien de vérification a expiré. Veuillez demander un nouveau lien.',
  INVALID_TOKEN:
    'Le lien de vérification est invalide. Veuillez vérifier votre email.',
  NO_TOKEN: 'Aucun token de vérification fourni.',
  DEFAULT: "Une erreur s'est produite lors de la vérification de votre email.",
};

// 🎨 FONCTION POUR CHOISIR L'ICÔNE SELON LE TYPE D'ERREUR
export const getErrorIcon = (errorCode: string) => {
  switch (errorCode) {
    case 'TOKEN_EXPIRED':
      // ⚠️ Icône orange pour les tokens expirés (moins grave)
      return (
        <AlertTriangle className="h-10 w-10 text-orange-600 dark:text-orange-400" />
      );
    default:
      // 🔴 Icône rouge pour les autres erreurs (plus graves)
      return <XCircle className="h-10 w-10 text-red-600 dark:text-red-400" />;
  }
};

// 🎨 FONCTION POUR CHOISIR LES COULEURS SELON LE TYPE D'ERREUR
export const getErrorColors = (errorCode: string) => {
  return errorCode === 'TOKEN_EXPIRED'
    ? // 🟠 Couleurs orange pour les tokens expirés
      'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-300'
    : // 🔴 Couleurs rouges pour les autres erreurs
      'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300';
};
