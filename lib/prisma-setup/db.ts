import 'server-only';

import { PrismaClient } from '../../src/generated/prisma/client';

const prismaClientSingleton = () => {
  return new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma;

// Fonction pour fermer proprement les connexions Prisma
export const closePrismaConnection = async () => {
  try {
    await prisma.$disconnect();
  } catch (error) {
    console.error('Error closing Prisma connection:', error);
  }
};

// Gérer la fermeture propre lors de l'arrêt de l'application
if (typeof process !== 'undefined') {
  process.on('beforeExit', async () => {
    await closePrismaConnection();
  });

  process.on('SIGINT', async () => {
    await closePrismaConnection();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    await closePrismaConnection();
    process.exit(0);
  });
}
