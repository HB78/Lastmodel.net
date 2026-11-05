//signatures des images autorisées pour le s3 storage
//chaque type d'images a une signature unique
const FILE_SIGNATURES = {
  // JPEG commence TOUJOURS par FF D8 (on vérifie que les 2 premiers bytes)
  'image/jpeg': [[0xff, 0xd8]],
  'image/png': [[0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]],
  'image/webp': [[0x52, 0x49, 0x46, 0x46]], // "RIFF" header
  'image/avif': [
    // AVIF est un conteneur ftyp, différentes tailles possibles
    [0x00, 0x00, 0x00, 0x20, 0x66, 0x74, 0x79, 0x70, 0x61, 0x76, 0x69, 0x66],
    [0x00, 0x00, 0x00, 0x18, 0x66, 0x74, 0x79, 0x70, 0x61, 0x76, 0x69, 0x66],
    [0x00, 0x00, 0x00, 0x1c, 0x66, 0x74, 0x79, 0x70, 0x61, 0x76, 0x69, 0x66],
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

// 🔒 L'URL pointe-t-elle vers une photo de CET utilisateur ?
//
// 🎯 À QUOI ÇA SERT (en une phrase) :
// Empêcher qu'un user enregistre en base une URL qui n'est PAS une photo
// qu'il a lui-même uploadée sur NOTRE R2 : la photo d'un autre user,
// une image d'un autre site, ou n'importe quel texte.
//
// ❓ POURQUOI C'EST NÉCESSAIRE ?
// Ajouter une photo = 2 requêtes séparées vers le serveur :
//   ① /api/s3-upload  → met le FICHIER sur R2 et renvoie son URL au navigateur
//   ② addPhotoAction / createUserProfilAction → reçoivent cette URL
//      DEPUIS LE NAVIGATEUR et l'écrivent en base (= ce qui s'affiche)
// Entre ① et ②, l'URL passe par le navigateur, donc elle a pu être modifiée.
// Un tricheur peut même sauter ① et appeler ② directement (F12 → Réseau)
// avec l'URL qu'il veut, par exemple :
//   - https://pub-xxx.r2.dev/images/{idDeBob}/bob.jpg → la photo de Bob
//     s'afficherait sur SON profil (usurpation d'identité)
//   - https://autre-site.com/image.jpg → image externe qu'on ne contrôle pas
//     (peut être choquante, ou changer après coup)
//
// ⚠️ Ce n'est PAS du "sanitize" : sanitize = NETTOYER une valeur pour la
// rendre sûre (comme sanitizeFileName au-dessus, qui remplace les caractères
// dangereux). Ici on VALIDE : on ne modifie rien, on dit juste oui ou non,
// et si c'est non, l'action REFUSE d'écrire en base.
// Résultat : la base ne contient que des URLs de photos uploadées par leur
// propriétaire.
//
// 🔍 COMMENT ÇA MARCHE ?
// Depuis le correctif de /api/s3-upload, chaque photo est rangée dans
// images/{userId}/... → l'URL d'une photo à toi commence forcément par
//   https://pub-xxx.r2.dev/images/{tonId}/
// - Le "/" final : sans lui, "clx1" passerait pour les photos de "clx123…"
// - Pas de ".." : une URL légitime n'en contient jamais (sanitizeFileName)
// - Pas de R2_URL configurée → on refuse tout (sinon on comparerait avec
//   "undefined/images/...")
// - url: unknown (et pas string) : l'URL vient du navigateur, TypeScript ne
//   vérifie rien à l'exécution → on teste nous-mêmes que c'est bien un texte
//
// 📌 LIMITES À CONNAÎTRE
// - Vérifie que l'URL est dans TON dossier, pas que le fichier EXISTE :
//   une URL inventée dans son propre dossier passe → au pire une image
//   cassée sur son propre profil (pas dangereux, la limite de photos
//   s'applique quand même).
// - Les anciennes photos (rangées dans images/ sans userId, avant le
//   correctif) ne passent PAS ce test. Pas de souci : on ne l'appelle que
//   sur des photos fraîchement uploadées, jamais sur celles déjà en base.
//
// 📍 Utilisée par : addPhotoAction, createUserProfilAction
// (toujours AVANT prisma.photo.create)
export function isOwnPhotoUrl(url: unknown, userId: string): boolean {
  const r2Url = process.env.R2_URL;
  if (!r2Url || typeof url !== 'string' || url.includes('..')) {
    return false;
  }

  return url.startsWith(`${r2Url}/images/${userId}/`);
}
