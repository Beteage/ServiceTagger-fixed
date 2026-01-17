import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log("Applying schema fix manually...");

    try {
        await prisma.$executeRawUnsafe(`ALTER TABLE "Customer" ADD COLUMN "lat" DOUBLE PRECISION;`);
        console.log("Added lat column.");
    } catch (e: any) {
        console.log("lat column might already exist or error:", e.message);
    }

    try {
        await prisma.$executeRawUnsafe(`ALTER TABLE "Customer" ADD COLUMN "lng" DOUBLE PRECISION;`);
        console.log("Added lng column.");
    } catch (e: any) {
        console.log("lng column might already exist or error:", e.message);
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
