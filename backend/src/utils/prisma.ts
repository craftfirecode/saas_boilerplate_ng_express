import { PrismaClient } from '@prisma/client';

// Prisma Client als Singleton exportieren, um zu viele Verbindungen zu vermeiden
const globalForPrisma = globalThis as typeof globalThis & { __prisma?: PrismaClient };

if (!globalForPrisma.__prisma) {
  globalForPrisma.__prisma = new PrismaClient();
}

export const prisma = globalForPrisma.__prisma;
export default prisma;
