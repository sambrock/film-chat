import z from 'zod';

import { db } from '../drizzle/db';
import { MessageAssistantSchema, MessageUserSchema } from '../drizzle/zod';
import { publicProcedure, router } from './server';

export type AppRouter = typeof appRouter;

export const appRouter = router({
  getUserThreads: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.session) {
      return [];
    }

    const data = await db.query.threads.findMany({
      where: (threads, { eq }) => eq(threads.userId, ctx.session.user.id),
    });

    return data;
  }),

  getThreadMessages: publicProcedure
    .input(z.object({ threadId: z.string() }))
    .output(z.array(MessageUserSchema.or(MessageAssistantSchema)))
    .query(async ({ input }) => {
      const data = await db.query.messages.findMany({
        where: (messages, { eq }) => eq(messages.threadId, input.threadId),
        orderBy: (messages, { desc }) => [desc(messages.serial)],
        limit: 20,
      });

      const messages = data.map((message) => {
        if (message.role === 'user') {
          return MessageUserSchema.parse(message);
        } else {
          return MessageAssistantSchema.parse(message);
        }
      });

      return messages;
    }),
});
