import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

export const SESSION_COOKIE = 'khilafat_admin_session';

function getSecretKey() {
  const secret = process.env.JWT_SECRET || 'dev-only-insecure-secret-change-me';
  return new TextEncoder().encode(secret);
}

export async function hashPassword(plain) {
  return bcrypt.hash(plain, 10);
}

export async function verifyPassword(plain, hash) {
  return bcrypt.compare(plain, hash);
}

export async function signSession(payload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(getSecretKey());
}

export async function verifySession(token) {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    return payload;
  } catch {
    return null;
  }
}

/**
 * Server-side helper (route handlers, server components) to read the
 * current admin session from cookies. Returns null if not logged in.
 */
export async function getAdminSession() {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySession(token);
}
