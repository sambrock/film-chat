import z from 'zod';

import { db } from '../drizzle/db';
import { ConversationMessageSchema, MessageAssistantSchema, MessageUserSchema } from '../drizzle/zod';
import { publicProcedure, router } from './server';

export type AppRouter = typeof appRouter;

export const appRouter = router({
  // getUserThreads: publicProcedure.query(async ({ ctx }) => {
  //   if (!ctx.session) {
  //     return [];
  //   }

  //   const data = await db.query.threads.findMany({
  //     where: (threads, { eq }) => eq(threads.userId, ctx.session.user.id),
  //   });

  //   return data;
  // }),

  conversationHistory: publicProcedure
    .input(z.object({ conversationId: z.string() }))
    .output(z.array(ConversationMessageSchema))
    .query(async ({ ctx, input }) => {
      if (!ctx.session) {
        return [];
      }

      const data = await db.query.messages.findMany({
        where: (messages, { eq }) => eq(messages.conversationId, input.conversationId),
        with: {
          recommendations: {
            with: {
              movie: {
                with: {
                  libraries: { where: (library, { eq }) => eq(library.userId, ctx.session.user.id) },
                },
              },
            },
          },
        },
        orderBy: (messages, { desc }) => [desc(messages.serial)],
        limit: 20,
      });

      const conversationHistory = data.map((message) => {
        if (message.role === 'user') {
          return MessageUserSchema.parse(message);
        } else {
          return MessageAssistantSchema.parse({
            ...message,
            recommendations: message.recommendations,
            movies: message.recommendations.map((m) => m.movie).filter(Boolean),
            library: message.recommendations.flatMap((m) => m.movie?.libraries).filter(Boolean),
          });
        }
      });

      return conversationHistory;
    }),
});
