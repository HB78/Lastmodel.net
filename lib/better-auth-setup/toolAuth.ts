import { Role } from '@/src/generated/prisma';
import { headers } from 'next/headers';
import { auth } from './auth';

export const getSession = async () => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    return session;
  } catch (error) {
    console.error('Session error:', error);
    return null;
  }
};

export const getUser = async () => {
  const session = await getSession();
  return session?.user;
};

export const isAdmin = async () => {
  const user = await getUser();
  return user?.role === Role.ADMIN;
};

// Nettoie le pseudo saisi à l'inscription
// \p{L} = n'importe quelle lettre, accents compris (é, è, ç, ï…)
// \p{N} = n'importe quel chiffre
// Le "u" à la fin des regex active ces raccourcis Unicode.
// (avant : [a-zA-Z] → "Hélène" devenait "Hlne", "Luna92" devenait "Luna")
export function normalizeName(name: string) {
  return (
    name
      .trim()
      .replace(/\s+/g, ' ')
      // garde lettres (avec accents), chiffres, espaces, ' - _
      .replace(/[^\p{L}\p{N}\s'_-]/gu, '')
      // majuscule au début de chaque mot (aussi après - et ') :
      // "jean-paul" → "Jean-Paul", "élodie" → "Élodie"
      .replace(/(^|[\s'-])(\p{L})/gu, (_match, before, letter) => {
        return before + letter.toUpperCase();
      })
  );
}

// export const VALID_DOMAINS = () => {
//   const domains = ["gmail.com", "yahoo.com", "outlook.com"];

//   if (process.env.NODE_ENV === "development") {
//     domains.push("example.com");
//   }

//   return domains;
// };
