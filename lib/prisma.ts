import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
    // If DATABASE_URL is missing, we don't initialize to avoid crash
    if (!process.env.DATABASE_URL) {
        console.warn("DATABASE_URL is missing. Running in frontend-only mock mode.");
        return null as any;
    }
    return new PrismaClient();
};

declare global {
    var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;
