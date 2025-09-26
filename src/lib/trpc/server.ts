import 'server-only';

import { cache } from 'react';
import { headers } from 'next/headers';
import { initTRPC } from '@trpc/server';

import superjson from 'superjson';

import { auth } from '../auth/server';

export const createTRPCContext = cache(async () => {
  const session = await auth.api.getSession({ headers: await headers() });

  return { session };
});

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;
