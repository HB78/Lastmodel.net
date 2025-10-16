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

export function normalizeName(name: string) {
  return name
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/[^a-zA-Z\s'-]/g, '')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

// export const VALID_DOMAINS = () => {
//   const domains = ["gmail.com", "yahoo.com", "outlook.com"];

//   if (process.env.NODE_ENV === "development") {
//     domains.push("example.com");
//   }

//   return domains;
// };
