'use server';

import { prisma } from '@/lib/prisma-setup/db';
import { deleteFileFromS3 } from '@/lib/s3-setup/aws-s3-config';
import { getSession } from '@/tools';
import { revalidatePath, revalidateTag } from 'next/cache';

type ActionResult = {
  success: boolean;
  message: string;
  error?: string;
};

export async function deletePhotoAction(
  photoId: string
): Promise<ActionResult> {
  try {
    // Vérifier la session
    const session = await getSession();
    if (!session?.user.id) {
      return {
        success: false,
        message: 'Non authentifié',
        error: 'Vous devez être connecté pour supprimer une photo',
      };
    }

    // Vérifier que la photo appartient à l'utilisateur
    const photo = await prisma.photo.findUnique({
      where: { id: photoId },
      select: { id: true, userId: true, isMain: true, url: true },
    });

    if (!photo) {
      return {
        success: false,
        message: 'Photo non trouvée',
        error: "Cette photo n'existe pas",
      };
    }

    if (photo.userId !== session.user.id) {
      return {
        success: false,
        message: 'Accès refusé',
        error: 'Vous ne pouvez pas supprimer cette photo',
      };
    }

    // 🔒 ÉTAPE 1: Supprimer le fichier de Cloudflare R2
    try {
      // 📍 EXTRACTION DE LA CLÉ DU FICHIER
      // On transforme l'URL complète en objet URL pour extraire le chemin
      // Exemple: "https://bucket.r2.dev/images/photo.jpg" → objet URL
      // on peut maintenant utiliser url.pathname ou url.hostname pour eviter le slice sur photo.url
      const url = new URL(photo.url);

      // On extrait le chemin du fichier et on enlève le "/" du début
      // url.pathname = "/images/photo.jpg"
      // substring(1) = "images/photo.jpg" (sans le "/")
      const fileKey = url.pathname.substring(1);

      // 🗑️ SUPPRESSION DU FICHIER SUR CLOUDFLARE R2
      // On utilise la clé extraite pour supprimer le fichier physique
      await deleteFileFromS3(fileKey);
      console.log(`✅ Fichier S3 supprimé: ${fileKey}`);
    } catch (s3Error) {
      // ⚠️ GESTION D'ERREUR S3
      // Si la suppression S3 échoue (fichier déjà supprimé, erreur réseau, etc.)
      // On log l'erreur mais on continue quand même
      console.warn(`⚠️ Erreur lors de la suppression S3: ${s3Error}`);
      // On continue même si la suppression S3 échoue
    }

    // 🗃️ ÉTAPE 2: Supprimer la photo de la base de données
    // On supprime l'entrée de la table "photos" en utilisant l'ID
    await prisma.photo.delete({
      where: { id: photoId },
    });

    // 🔄 ÉTAPE 3: Revalider les pages concernées
    // On force Next.js à recharger les pages pour afficher les changements
    revalidatePath('/profile/photos'); // Page de gestion des photos
    revalidatePath('/profile'); // Page de profil principal
    revalidatePath('/'); // Page d'accueil (liste des profils)

    // Invalider le cache du profil individuel pour la page produit
    revalidateTag(`profile-${session.user.id}`);
    revalidateTag('profiles'); // Pour la liste des profils sur la page d'accueil

    return {
      success: true,
      message: 'Photo supprimée avec succès',
    };
  } catch (error) {
    console.error('Erreur lors de la suppression de la photo:', error);
    return {
      success: false,
      message: 'Erreur lors de la suppression',
      error: 'Une erreur est survenue lors de la suppression de la photo',
    };
  }
}
