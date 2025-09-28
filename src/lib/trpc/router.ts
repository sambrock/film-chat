import { TRPCError } from '@trpc/server';
import { and, eq } from 'drizzle-orm';
import z from 'zod';

import { db } from '../drizzle/db';
import { conversations } from '../drizzle/schema';
import { ConversationMessageSchema, MessageAssistantSchema, MessageUserSchema } from '../drizzle/zod';
import { publicProcedure, router } from './server';

export type AppRouter = typeof appRouter;

export const appRouter = router({
  conversations: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.session) {
      return [];
    }

    const data = await db.query.conversations.findMany({
      where: (conversations, { eq }) => eq(conversations.userId, ctx.session.user.id),
      orderBy: (conversations, { desc }) => [desc(conversations.updatedAt)],
    });

    return data;
  }),

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

  deleteConversation: publicProcedure
    .input(z.object({ conversationId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }

      await db
        .delete(conversations)
        .where(
          and(
            eq(conversations.conversationId, input.conversationId),
            eq(conversations.userId, ctx.session.user.id)
          )
        );
    }),
});
