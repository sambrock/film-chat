import 'server-only';

import { headers } from 'next/headers';
import { initTRPC } from '@trpc/server';
import type { CreateNextContextOptions } from '@trpc/server/adapters/next';
import superjson from 'superjson';

import { auth } from '../auth/server';

export const createTRPCContext = async (opts: CreateNextContextOptions) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  console.log('session', session);

  return {
    session,
  };
};

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;
