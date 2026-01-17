import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL + "?pgbouncer=true"
        }
    }
});

async function main() {
    try {
        console.log('Enabling RLS on "User" table...');
        await prisma.$executeRawUnsafe(`ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;`);
        console.log('RLS enabled.');

        // Drop existing policies if they exist to avoid errors on re-run
        try {
            await prisma.$executeRawUnsafe(`DROP POLICY IF EXISTS "Users can read own data" ON "User";`);
            await prisma.$executeRawUnsafe(`DROP POLICY IF EXISTS "Users can update own data" ON "User";`);
        } catch (e) {
            console.log('Note: Could not drop existing policies (might not exist).');
        }

        console.log('Creating Read Policy...');
        // Policy for SELECT
        await prisma.$executeRawUnsafe(`
            CREATE POLICY "Users can read own data" ON "User"
            FOR SELECT
            TO authenticated
            USING ((select auth.uid())::text = id);
        `);

        console.log('Creating Update Policy...');
        // Policy for UPDATE
        await prisma.$executeRawUnsafe(`
            CREATE POLICY "Users can update own data" ON "User"
            FOR UPDATE
            TO authenticated
            USING ((select auth.uid())::text = id)
            WITH CHECK ((select auth.uid())::text = id);
        `);

        console.log('RLS Policies applied successfully.');

    } catch (error) {
        console.error('Error applying RLS:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
