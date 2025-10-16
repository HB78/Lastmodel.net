/**
 * Types et interfaces pour le système de dropzone
 *
 * Ce fichier centralise toutes les définitions de types utilisées
 * par les composants et hooks du système de gestion des photos.
 */

/**
 * Interface FileItem : Représente un fichier photo dans le système
 *
 * Cette interface décrit l'état d'un fichier à chaque étape de son cycle de vie :
 * - Lors du drop : file existe, id est vide, url est null
 * - Pendant l'upload : file existe, id peut être vide, url est null
 * - Après upload réussi : file existe, id contient l'ID S3, url contient l'URL S3
 *
 * @property file - L'objet File natif du navigateur
 * @property id - L'identifiant unique du fichier sur S3 (vide si pas encore uploadé)
 * @property url - L'URL publique du fichier sur S3 (null si pas encore uploadé)
 */
export interface FileItem {
  file: File; // Fichier natif du navigateur
  id: string; // ID unique sur S3 (vide si pas uploadé)
  url: string | null; // URL publique sur S3 (null si pas uploadé)
}

/**
 * Interface DropZoneProps : Props du composant Dropzone principal
 *
 * Cette interface définit les props nécessaires pour le composant Dropzone.
 * Le composant parent doit fournir une fonction getInfo qui sera appelée
 * après chaque upload réussi pour synchroniser l'état.
 *
 * @property getInfo - Fonction callback appelée après chaque upload réussi
 *                     avec l'URL de la photo uploadée
 */
export interface DropZoneProps {
  getInfo: (url: string) => Promise<void>;
}
