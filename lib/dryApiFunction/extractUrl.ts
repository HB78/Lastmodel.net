/**
 * Extrait la clé S3/R2 à partir d'une URL complète
 * @param url - L'URL complète du fichier (ex: "https://r2.example.com/images/monimage.jpg")
 * @returns La clé S3/R2 (ex: "images/monimage.jpg") ou null si l'URL est invalide
 */
export function extractFileIdFromUrl(url: string): string | null {
  try {
    if (!url) return null;

    // Parse l'URL pour extraire le pathname
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;

    // Supprime le premier slash s'il existe
    const fileKey = pathname.startsWith('/') ? pathname.slice(1) : pathname;

    return fileKey || null;
  } catch (error) {
    console.error('Error extracting file ID from URL:', error);
    return null;
  }
}
