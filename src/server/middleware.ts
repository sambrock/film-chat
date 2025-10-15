import { createMiddleware } from '@tanstack/react-start';

import { auth } from '~/lib/auth/server';

export const authMiddleware = createMiddleware().server(async ({ next, context, request }) => {
  const session = await auth.api.getSession(request);
  if (session) {
    if (session.user) {
      return next({ context: { user: session.user } });
    }
  }

  return next({ context: { user: null! } });
});
