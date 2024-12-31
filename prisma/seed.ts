import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const password = 'SuperAdmin123';
  const salt = 10;
  const hash = await bcrypt.hash(password, salt);

  console.log('Password:', password);
  console.log('Hashed password:', hash);

  const superAdmin = await prisma.user.upsert({
    where: { username: 'superadmin' },
    update: {},
    create: {
      username: 'superadmin',
      password: hash,
      email: 'superadmin@example.com',
      fullName: 'Super Admin',
      role: 'superadmin',
    },
  });

  console.log('Super Admin created:', superAdmin);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
