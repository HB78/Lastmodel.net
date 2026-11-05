'use server';

import { prisma } from '@/lib/prisma-setup/db';
import { deleteFileFromS3 } from '@/lib/s3-setup/aws-s3-config';
import { getSession } from '@/tools';

/**
 * 🗑️ Supprime un fichier fraîchement uploadé sur R2, depuis la Dropzone
 * (bouton 🗑️ dans /create et dans la zone d'ajout de /profile/photos)
 *
 * ⚠️ À ne pas confondre avec deletePhotoAction (deletePhoto.ts) qui supprime
 * une photo DÉJÀ ENREGISTRÉE en BDD (fichier R2 + ligne photo).
 * Ici on efface UNIQUEMENT le fichier sur R2, pas la ligne en BDD.
 *
 * 📍 D'où vient fileKey ?
 * 1. /api/s3-upload crée la clé et la renvoie au navigateur ({ id: fileKey })
 * 2. Le navigateur la garde dans son state (usePhotoUpload.ts)
 *    ou la recalcule depuis l'URL de la photo (MainPhotoZone.tsx → extractFileIdFromUrl)
 * 3. Au clic sur 🗑️, le navigateur l'envoie ici
 *
 * 🔒 Pourquoi tout revérifier ?
 * Une server action est un endpoint HTTP public : n'importe quel user connecté
 * peut l'appeler directement (onglet Réseau, F12) avec la clé de son choix.
 * Et les clés ne sont pas secrètes : elles sont dans l'URL de chaque photo
 * affichée sur le site. Sans vérification, un compte gratuit pourrait donc
 * effacer les photos de tous les autres users.
 *
 * - Authentification = "qui es-tu ?"        → la session
 * - Autorisation     = "est-ce à toi ?"     → la vérification du propriétaire
 * Il faut les DEUX.
 */
export async function deleteImagesAction(fileKey: string) {
  // ① AUTHENTIFICATION : l'user est-il connecté ?
  // session.user.id vient du cookie signé par Better Auth → fiable
  const session = await getSession();
  if (!session?.user.id) {
    return { success: false, message: 'Non authentifié' };
  }
  const findIfUserExist = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!findIfUserExist) {
    return { success: false, message: 'Utilisateur non trouvé' };
  }

  // ② VALIDATION DE LA CLÉ
  // fileKey vient du navigateur : on ne lui fait pas confiance
  // - clé obligatoire et de type texte
  // - pas de ".." ("remonter d'un dossier") : sans ça, une clé comme
  //   images/{monId}/../{autreId}/photo.jpg passerait le startsWith ci-dessous
  //   et pourrait viser le dossier d'un autre si le chemin est normalisé.
  //   Une clé légitime n'en contient jamais (sanitizeFileName les retire).
  if (!fileKey || typeof fileKey !== 'string' || fileKey.includes('..')) {
    return { success: false, message: 'Clé de fichier invalide' };
  }

  // ③ AUTORISATION : ce fichier appartient-il à l'user connecté ?

  // Cas A — nouveaux uploads : /api/s3-upload range chaque photo dans
  // images/{userId}/... donc le propriétaire est écrit DANS la clé.
  // Le "/" final est important : sans lui, l'user "clx1" passerait aussi
  // pour les fichiers de "clx123..." (même début).
  const isInUserFolder = fileKey.startsWith(`images/${session.user.id}/`);

  // Cas B — anciens uploads (avant le correctif, tout était dans images/
  // sans userId) : la clé ne dit pas à qui est le fichier, on vérifie en BDD
  // qu'une photo avec cette URL appartient bien à l'user connecté.
  // - On ne fait la requête que si le cas A a échoué (évite un appel BDD inutile)
  // - select: { id: true } → on veut juste savoir si la ligne EXISTE,
  //   inutile de ramener toutes les colonnes
  // - !! → transforme le résultat en booléen (objet → true, null → false)
  const isOwnedInDb =
    !isInUserFolder &&
    !!(await prisma.photo.findFirst({
      where: {
        userId: session.user.id,
        url: `${process.env.R2_URL}/${fileKey}`,
      },
      select: { id: true },
    }));

  // Ni dans son dossier, ni à son nom en BDD → ce n'est pas son fichier
  if (!isInUserFolder && !isOwnedInDb) {
    return {
      success: false,
      message: 'Vous ne pouvez pas supprimer ce fichier',
    };
  }

  // ④ SUPPRESSION : seulement maintenant qu'on est sûr que c'est son fichier
  try {
    await deleteFileFromS3(fileKey);

    return { success: true, message: 'File deleted successfully' };
  } catch (error) {
    console.error('Error deleting image:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to delete file',
    };
  }
}
