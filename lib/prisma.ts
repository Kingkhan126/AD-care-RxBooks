import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient | undefined };

function getPrisma(): PrismaClient {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set');
  }
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });
  }
  return globalForPrisma.prisma;
}

export const prisma = new Proxy({} as PrismaClient, {
  get(_, prop) {
    const client = getPrisma();
    const value = (client as any)[prop];
    if (typeof value === 'function') {
      return value.bind(client);
    }
    return value;
  },
});

export default prisma;
