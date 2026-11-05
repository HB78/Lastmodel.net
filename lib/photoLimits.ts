// 📸 LIMITE DE PHOTOS PAR ABONNEMENT — source unique
//
// Avant, la limite était écrite en dur à plusieurs endroits (1, 2, 11…)
// et ces endroits n'étaient pas d'accord entre eux.
// Maintenant, tout le monde importe getMaxPhotos() d'ici :
//   - serveur  : app/api/s3-upload/route.ts, addPhotoAction, createUserProfilAction
//                → la VRAIE protection
//   - navigateur : Dropzone.tsx, photo-upload-zone.tsx
//                → juste du confort d'affichage (contournable, ne protège rien)
//
// ⚠️ Pas de 'server-only' ici : le navigateur en a besoin aussi.
// Ce n'est pas un problème, ce fichier ne contient aucun secret.

export const MAX_PHOTOS_FREE = 2;
export const MAX_PHOTOS_PAID = 11;

// subscriptionType vient de la session : 'FREE' | 'MONTHLY' | 'YEARLY'
// Tout ce qui n'est pas un abonnement payant (FREE, null, undefined…)
// → limite FREE. En cas de doute, on donne le MOINS de droits.
export function getMaxPhotos(subscriptionType?: string | null): number {
  return subscriptionType === 'MONTHLY' || subscriptionType === 'YEARLY'
    ? MAX_PHOTOS_PAID
    : MAX_PHOTOS_FREE;
}
