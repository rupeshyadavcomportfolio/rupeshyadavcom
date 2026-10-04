import { cookies } from 'next/headers';

const ADMIN_COOKIE_NAME = 'rupesh_admin_token';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@rupeshyadav.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'rupesh@2026';

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME);
  return token?.value === 'authenticated_rupesh_admin_session';
}

export async function setAdminSession() {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE_NAME, 'authenticated_rupesh_admin_session', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
}

export function verifyCredentials(email: string, pass: string): boolean {
  return email === ADMIN_EMAIL && pass === ADMIN_PASSWORD;
}
