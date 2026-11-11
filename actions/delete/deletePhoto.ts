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

    // Interdire la suppression de la dernière photo :
    // sans photo, le profil disparaîtrait de l'accueil (qui filtre sur isMain).
    // Le bouton est grisé côté navigateur, mais c'est ici que la règle compte.
    const photoCount = await prisma.photo.count({
      where: { userId: session.user.id },
    });

    if (photoCount <= 1) {
      return {
        success: false,
        message: 'Action impossible',
        error: 'Ajoutez une autre photo avant de supprimer celle-ci',
      };
    }

    // 🗃️ ÉTAPE 1: Supprimer la photo de la base de données
    // Dans une transaction : si la photo supprimée était la principale,
    // la suivante (plus petit order) prend sa place. Les deux opérations
    // réussissent ensemble ou sont annulées ensemble.
    await prisma.$transaction(async (tx) => {
      await tx.photo.delete({
        where: { id: photoId },
      });

      if (photo.isMain) {
        const next = await tx.photo.findFirst({
          where: { userId: session.user.id },
          orderBy: { order: 'asc' },
          select: { id: true },
        });

        if (next) {
          await tx.photo.update({
            where: { id: next.id },
            data: { isMain: true },
          });
        }
      }
    });

    // 🔒 ÉTAPE 2: Supprimer le fichier de Cloudflare R2
    // Fait APRÈS la base : si R2 échoue, on garde au pire un fichier orphelin
    // invisible, au lieu d'une photo en base qui pointe vers un fichier effacé.
    try {
      // 📍 EXTRACTION DE LA CLÉ DU FICHIER
      // On transforme l'URL complète en objet URL pour extraire le chemin
      // Exemple: "https://bucket.r2.dev/images/photo.jpg" → objet URL
      const url = new URL(photo.url);

      // url.pathname = "/images/photo.jpg"
      // substring(1) = "images/photo.jpg" (sans le "/")
      const fileKey = url.pathname.substring(1);

      await deleteFileFromS3(fileKey);
      console.log(`✅ Fichier S3 supprimé: ${fileKey}`);
    } catch (s3Error) {
      // Si la suppression R2 échoue, la photo est déjà retirée de la base :
      // on log et on continue
      console.warn(`⚠️ Erreur lors de la suppression S3: ${s3Error}`);
    }

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
      // Le bouton affiche ce message en toast : on prévient du changement
      // de photo principale
      message: photo.isMain
        ? 'Photo supprimée, la suivante devient votre photo principale'
        : 'Photo supprimée avec succès',
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
