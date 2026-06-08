import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const getPrisma = () => {
  if (globalForPrisma.prisma) return globalForPrisma.prisma;

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    // If no DATABASE_URL is provided, we can't initialize Prisma.
    // In some cases we might want to throw or return a proxy.
    // For build compatibility, we might need a dummy one or just throw.
    throw new Error("DATABASE_URL is not defined");
  }

  const client = new PrismaClient();
  if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = client;
  return client;
};

// For backward compatibility if anything uses 'prisma' directly
export const prisma = {} as PrismaClient;
