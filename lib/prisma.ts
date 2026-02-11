import { PrismaClient } from '../generated/client'

const globalForPrisma = global as unknown as { prismaEx: PrismaClient }

export const prisma =
    globalForPrisma.prismaEx ||
    new PrismaClient({
        log: ['query'],
    })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prismaEx = prisma
