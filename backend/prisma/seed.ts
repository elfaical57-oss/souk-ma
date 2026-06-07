import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const phone = "+212701138978";
  const password = "Admin@2026";

  const hashed = await bcrypt.hash(password, 12);

  const admin = await prisma.user.upsert({
    where: { phone },
    update: { role: "ADMIN", password: hashed },
    create: {
      name: "Admin",
      phone,
      email: "admin@jemlamaroc.ma",
      password: hashed,
      role: "ADMIN",
    },
  });

  console.log("✅ Admin created:", admin.id, admin.phone);
  console.log("📱 Phone:    0701138978");
  console.log("🔑 Password: Admin@2026");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
