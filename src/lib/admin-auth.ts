import { hash, verify } from "@node-rs/argon2";
import { SignJWT, jwtVerify } from "jose";
import { cookies as getCookies } from "next/headers";
import { db } from "@/db/index";
import { adminCredentials, adminSessions, user } from "@/db/schema";
import { eq, and } from "drizzle-orm";

const JWT_SECRET = new TextEncoder().encode(process.env.ADMIN_JWT_SECRET!);
const COOKIE_NAME = "admin-session";

export async function createAdminCredentials(
  userId: string,
  username: string,
  password: string
) {
  const passwordHash = await hash(password, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });

  await db.insert(adminCredentials).values({
    userId,
    username,
    passwordHash,
  });
}

export async function verifyAdminLogin(username: string, password: string) {
  const admin = await db
    .select({
      id: adminCredentials.id,
      userId: adminCredentials.userId,
      username: adminCredentials.username,
      passwordHash: adminCredentials.passwordHash,
      userRole: user.role,
    })
    .from(adminCredentials)
    .innerJoin(user, eq(adminCredentials.userId, user.id))
    .where(eq(adminCredentials.username, username))
    .limit(1);

  if (!admin[0] || admin[0].userRole !== "admin") {
    return null;
  }

  const isValid = await verify(admin[0].passwordHash, password);
  if (!isValid) {
    return null;
  }

  return {
    id: admin[0].userId,
    username: admin[0].username,
  };
}

export async function createAdminSession(adminId: string) {
  const token = await new SignJWT({ adminId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(JWT_SECRET);

  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

  await db.insert(adminSessions).values({
    adminId,
    token,
    expiresAt,
  });

  const cookies = await getCookies();
  cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
  });

  return token;
}

export async function verifyAdminSession() {
  const cookies = await getCookies();
  const token = cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const adminId = payload.adminId as string;

    const session = await db
      .select({
        adminId: adminSessions.adminId,
        userRole: user.role,
      })
      .from(adminSessions)
      .innerJoin(user, eq(adminSessions.adminId, user.id))
      .where(
        and(eq(adminSessions.token, token), eq(adminSessions.adminId, adminId))
      )
      .limit(1);

    if (!session[0] || session[0].userRole !== "admin") {
      return null;
    }

    return { adminId: session[0].adminId };
  } catch {
    return null;
  }
}

export async function destroyAdminSession() {
  const cookies = await getCookies();
  const token = cookies.get(COOKIE_NAME)?.value;
  if (token) {
    await db.delete(adminSessions).where(eq(adminSessions.token, token));
  }
  cookies.delete(COOKIE_NAME);
}
