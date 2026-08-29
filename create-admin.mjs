import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.error("Missing ADMIN_EMAIL or ADMIN_PASSWORD");
    return;
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log("Admin user already exists");
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  await prisma.user.create({
    data: {
      email,
      passwordHash: hashedPassword,
      name: 'Admin',
      role: 'ADMIN'
    }
  });
  console.log("Admin user created successfully!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
