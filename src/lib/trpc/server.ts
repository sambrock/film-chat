import 'server-only';

import { headers } from 'next/headers';
import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';

import { auth } from '../auth/server';

export const createTRPCContext = async () => {
  const session = await auth.api.getSession({ headers: await headers() });

  return { session };
};

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

const userMiddleware = t.middleware(({ ctx, next }) => {
  if (!ctx.session?.user) {
    return next({
      ctx: { ...ctx, userId: null },
    });
  }

  return next({
    ctx: { ...ctx, userId: ctx.session.user.id },
  });
});

const authMiddleware = t.middleware(({ ctx, next }) => {
  if (!ctx.session) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }

  return next();
});

export const router = t.router;
export const publicProcedure = t.procedure.use(userMiddleware);
export const protectedProcedure = t.procedure.use(userMiddleware).use(authMiddleware);
