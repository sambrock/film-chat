import { TRPCError } from '@trpc/server';
import z from 'zod';

import { db } from '../drizzle/db';
import { MessageAssistantSchema, MessageUserSchema } from '../drizzle/zod';
import { tmdbGetMovieByIdWithCredits } from '../tmdb/client';
import { publicProcedure, router } from './server';

export type AppRouter = typeof appRouter;

export const appRouter = router({
  getChats: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.userId) {
      return [];
    }

    return db.query.conversations.findMany({
      where: (conversations, { eq }) => eq(conversations.userId, ctx.userId!),
      orderBy: (conversations, { desc }) => [desc(conversations.updatedAt)],
      limit: 20,
    });
  }),

  getChat: publicProcedure.input(z.string()).query(async ({ input, ctx }) => {
    const data = await db.query.conversations.findFirst({
      where: (conversations, { and, eq }) =>
        and(eq(conversations.conversationId, input), eq(conversations.userId, ctx.userId!)),
    });

    if (!data) {
      return null;
    }

    return data;
  }),

  getChatMessages: publicProcedure.input(z.string()).query(async ({ input, ctx }) => {
    const data = await db.query.messages.findMany({
      where: (messages, { and, eq }) =>
        and(eq(messages.conversationId, input), eq(messages.userId, ctx.userId!)),
      with: {
        recommendations: {
          with: {
            movie: {
              with: { libraries: true },
            },
          },
        },
      },
      orderBy: (messages, { desc }) => [desc(messages.serial)],
      limit: 20,
    });

    return data.map((message) => {
      if (message.role === 'user') return MessageUserSchema.parse(message);
      return MessageAssistantSchema.parse({
        ...message,
        recommendations: message.recommendations,
        movies: message.recommendations.map((r) => r.movie).filter(Boolean),
        libraries: [],
      });
    });
  }),


  getMovie: publicProcedure.input(z.string()).query(async ({ input }) => {
    const movie = await db.query.movies.findFirst({
      where: (movies, { eq }) => eq(movies.movieId, input),
    });
    if (!movie) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Movie not found' });
    }

    const details = await tmdbGetMovieByIdWithCredits(movie.tmdbId);

    return details;
  }),
});
