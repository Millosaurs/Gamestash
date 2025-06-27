import { db } from "./index";
import { admin } from "./schema";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

async function seedAdmin() {
  const username = "admin";
  const password = "admin123";
  const hashedPassword = await bcrypt.hash(password, 10);

  // Check if admin already exists
  const existing = await db
    .select()
    .from(admin)
    .where(eq(admin.username, username));
  if (existing.length === 0) {
    await db.insert(admin).values({
      username,
      password: hashedPassword,
    });
    console.log("Seeded admin user: username=admin, password=admin123");
  } else {
    console.log("Admin user already exists.");
  }
}

seedAdmin().then(() => process.exit(0));
