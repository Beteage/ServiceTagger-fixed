import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'hi@hi.com';
  const rawPassword = 'hihihi';
  const hashedPassword = await bcrypt.hash(rawPassword, 10);

  // Ensure at least one tenant exists
  let tenant = await prisma.tenant.findFirst();
  if (!tenant) {
    console.log('No tenant found. Creating default tenant...');
    tenant = await prisma.tenant.create({
      data: {
        name: 'Default Tenant',
        tier: 'basic',
      },
    });
    console.log(`Created tenant: ${tenant.name} (${tenant.id})`);
  } else {
    console.log(`Using existing tenant: ${tenant.name} (${tenant.id})`);
  }

  // Upsert user
  const user = await prisma.user.upsert({
    where: { email },
    update: {
      password: hashedPassword,
      tenantId: tenant.id,
    },
    create: {
      email,
      password: hashedPassword,
      role: 'admin', // Defaulting to admin for test user availability
      tenantId: tenant.id,
      skills: 'HVAC,Plumbing',
    },
  });

  console.log(`User ensured: ${user.email} (ID: ${user.id})`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
