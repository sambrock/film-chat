import { createMiddleware } from '@tanstack/react-start';
import { setResponseHeader } from '@tanstack/react-start/server';

import { auth } from '~/lib/auth/server';

export const authOrAnonSignInMiddleware = createMiddleware().server(async ({ next, request }) => {
  const session = await auth.api.getSession(request);
  if (session && session.user) {
    return next({ context: { user: session.user } });
  }

  const anon = await auth.api.signInAnonymous({ returnHeaders: true });
  if (!anon || !anon.response) {
    throw new Error('Failed to sign in anonymously');
  }

  setResponseHeader('Set-Cookie', anon.headers.get('Set-Cookie')!);

  return next({ context: { user: anon.response.user } });
});
