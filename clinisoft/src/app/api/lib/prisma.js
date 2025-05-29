
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis


const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    /* log: ['query'], // Opcional: muestra queries en consola */
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma;
