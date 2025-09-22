// TODO: This causes an issue when imported into convex as it thinks it's a client component
// import 'server-only';

import { cookies } from 'next/headers';
import { jwtVerify, SignJWT } from 'jose';
import { JwtPayload } from 'jsonwebtoken';

export type SessionPayload = {
  userId: string;
  anon: boolean;
};

const encodedKey = new TextEncoder().encode(process.env.SESSION_SECRET);

export async function encryptSession(payload: SessionPayload) {
  return new SignJWT(payload).setProtectedHeader({ alg: 'HS256' }).setIssuedAt().sign(encodedKey);
}

export async function decryptSession(session: string | undefined = '') {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ['HS256'],
    });
    return payload as JwtPayload & SessionPayload;
  } catch (error) {
    console.log('Failed to verify session');
  }
}

export async function createSession(payload: SessionPayload) {
  const session = await encryptSession(payload);
  const cookieStore = await cookies();

  cookieStore.set('session', session, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
  });

  return session;
}

export async function readSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get('session')?.value;

  if (!session) {
    return null;
  }

  const payload = await decryptSession(session);
  return payload as SessionPayload | null;
}
