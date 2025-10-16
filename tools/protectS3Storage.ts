//signatures des images autorisées pour le s3 storage
//chaque type d'images a une signature unique
const FILE_SIGNATURES = {
  'image/jpeg': [[0xff, 0xd8, 0xff]],
  'image/png': [[0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]],
  'image/webp': [[0x52, 0x49, 0x46, 0x46]], // + "WEBP" après
  'image/avif': [
    [0x00, 0x00, 0x00, 0x20, 0x66, 0x74, 0x79, 0x70, 0x61, 0x76, 0x69, 0x66],
  ],
} as const;

//avec typeof on recupere le type cad dire le contenu
//avec keyof on recupere les clefs de l'objet
//on obtient un union
//keyof marche que sur les objet pour extraire les clefs
//Array → Utilise typeof ARRAY[number] pour extraire les valeurs
type SupportedMimeType = keyof typeof FILE_SIGNATURES;

//valide le contenu du fichier en fonction du type d'image
//si le contenu du fichier correspond à la signature de l'image, alors la fonction retourne true
//sinon la fonction retourne false
export function validateFileContent(
  buffer: Buffer,
  expectedMimeType: SupportedMimeType
): boolean {
  const signatures = FILE_SIGNATURES[expectedMimeType];
  if (!signatures) return false;

  return signatures.some((signature) => {
    return signature.every((byte, index) => buffer[index] === byte);
  });
}

//sanitise le nom du fichier pour eviter les attaques de type path traversal
//on remplace les caractères dangereux par des underscores
//on evite les ../../../
//on limite la longueur du nom du fichier à 100 caractères
export function sanitizeFileName(fileName: string): string {
  return fileName
    .replace(/[^a-zA-Z0-9.-]/g, '_') // Remplace caractères dangereux
    .replace(/\.+/g, '.') // Évite ../../../
    .substring(0, 100); // Limite la longueur
}

//limite le nombre d'uploads par heure pour eviter les attaques de type brute force
//pour eviter qu'un user upload fasse 1000 uploads en 1 heure par exemple
//le map est un dictionnaire qui permet de stocker des paires clé-valeur
//quand on l'ecrit comme cela on l'instancie cad on le cree
const uploadAttempts = new Map<string, number>();

export function checkUploadRate(userId: string): boolean {
  // ÉTAPE 1 : Regarder combien l'user a déjà uploadé
  // Si c'est la première fois : get() retourne undefined → || 0 donne 0
  // Si l'user existe déjà : get() retourne son nombre actuel (ex: 5)
  const current = uploadAttempts.get(userId) || 0;

  // ÉTAPE 2 : Vérifier si il a dépassé la limite de 10 uploads
  if (current >= 20) {
    return false; // BLOQUÉ ! Trop d'uploads dans l'heure
  }

  // ÉTAPE 3 : Ajouter +1 à son compteur dans la Map
  // Première fois : set("alice", 0 + 1) = set("alice", 1)
  // Fois suivantes : set("alice", 5 + 1) = set("alice", 6)
  uploadAttempts.set(userId, current + 1);

  // ÉTAPE 4 : Programmer l'effacement automatique dans 1 heure (3600000ms)
  // Après 1h, l'user est supprimé de la Map → son compteur repart à 0
  setTimeout(() => uploadAttempts.delete(userId), 3600000);

  // ÉTAPE 5 : Autoriser cet upload
  return true;
}
