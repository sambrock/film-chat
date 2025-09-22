'use server';

import 'server-only';

import { cookies } from 'next/headers';
import { fetchMutation } from 'convex/nextjs';

import { api } from '@/infra/convex/_generated/api';
import { createSession } from '@/lib/session';

export async function authAction() {
  const cookieStore = await cookies();

  const session = cookieStore.get('session')?.value;
  if (session) {
    return session;
  }

  const anonUser = await fetchMutation(api.users.createAnonUser);
  if (!anonUser) {
    throw new Error('Failed to create anonymous user');
  }

  return createSession({ userId: anonUser.userId, anon: anonUser.anon });
}
