import { TRPCError } from '@trpc/server';
import { and, eq, isNotNull, sql } from 'drizzle-orm';
import z from 'zod';

import { db } from '../drizzle/db';
import { conversations, messages, recommendations } from '../drizzle/schema';
import { ConversationMessageSchema, MessageAssistantSchema, MessageUserSchema } from '../drizzle/zod';
import { tmdbGetMovieByIdWithCredits } from '../tmdb/client';
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

  conversation: publicProcedure
    .input(
      z.object({
        conversationId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      if (!ctx.session) {
        return null;
      }

      const conversationWithCount = await db
        .select({
          conversation: conversations,
          moviesCount: sql`count(recommendations.movie_id)`.mapWith(Number),
        })
        .from(conversations)
        .leftJoin(messages, eq(messages.conversationId, conversations.conversationId))
        .leftJoin(recommendations, eq(messages.messageId, recommendations.messageId))
        .where(
          and(
            eq(conversations.conversationId, input.conversationId),
            eq(conversations.userId, ctx.session.user.id)
          )
        )
        .groupBy(conversations.conversationId)
        .limit(1);

      const conversation = conversationWithCount[0]?.conversation ?? null;
      const moviesCount = conversationWithCount[0]?.moviesCount ?? 0;

      return { ...conversation, moviesCount };
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

  movie: publicProcedure.input(z.object({ movieId: z.string() })).query(async ({ ctx, input }) => {
    const movie = await db.query.movies.findFirst({
      where: (movies, { and, eq, isNotNull }) => eq(movies.movieId, input.movieId),
      with: {
        libraries: { where: (library, { eq }) => eq(library.userId, ctx.session.user.id) },
      },
    });

    if (!movie) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Movie not found' });
    }

    const withCast = await tmdbGetMovieByIdWithCredits(movie.tmdbId);

    return { ...movie, credits: withCast?.credits };
  }),
});
