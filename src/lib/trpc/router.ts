import { TRPCError } from '@trpc/server';
import { and, eq } from 'drizzle-orm';
import z from 'zod';

import { db } from '../drizzle/db';
import { conversations, library } from '../drizzle/schema';
import { LibrarySchema } from '../drizzle/zod';
import { tmdbGetMovieByIdWithCredits } from '../tmdb/client';
import { protectedProcedure, publicProcedure, router } from './server';

export type AppRouter = typeof appRouter;

export const appRouter = router({
  syncChats: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.userId) {
      return [];
    }

    const data = await db.query.conversations.findMany({
      where: (conversations, { eq }) => eq(conversations.userId, ctx.userId!),
      orderBy: (conversations, { desc }) => [desc(conversations.updatedAt)],
    });

    return data;
  }),

  syncMessages: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.userId) {
      return [];
    }

    const data = await db.query.messages.findMany({
      where: (messages, { eq }) => eq(messages.userId, ctx.userId!),
      orderBy: (messages, { desc }) => [desc(messages.serial)],
    });

    return data;
  }),

  syncRecommendations: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.userId) {
      return [];
    }

    const data = await db.query.recommendations.findMany({
      where: (messages, { eq }) => eq(messages.userId, ctx.userId!),
    });

    return data;
  }),

  syncMovies: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.userId) {
      return [];
    }

    const recommendations = await db.query.recommendations.findMany({
      where: (messages, { and, eq, isNotNull }) =>
        and(eq(messages.userId, ctx.userId!), isNotNull(messages.movieId)),
    });

    const data = await db.query.movies.findMany({
      where: (movies, { and, isNotNull, inArray }) =>
        and(
          isNotNull(movies.movieId),
          inArray(movies.movieId, recommendations.map((r) => r.movieId) as string[])
        ),
    });

    return data;
  }),

  syncLibrary: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.userId) {
      return [];
    }

    const data = await db.query.library.findMany({
      where: (library, { eq }) => eq(library.userId, ctx.userId!),
    });

    return data;
  }),

  saveTransaction: protectedProcedure
    .input(
      z
        .discriminatedUnion('type', [
          z.object({
            type: z.literal('delete'),
            schema: z.literal('chat'),
            key: z.string(),
          }),
          z.object({
            type: z.literal('insert'),
            schema: z.literal('library'),
            data: LibrarySchema,
          }),
          z.object({
            type: z.literal('update'),
            schema: z.literal('library'),
            key: z.string(),
            data: LibrarySchema.partial(),
          }),
        ])
        .array()
    )
    .mutation(async ({ input, ctx }) => {
      for (const op of input) {
        if (op.type === 'delete' && op.schema === 'chat') {
          await db.delete(conversations).where(eq(conversations.conversationId, op.key));
        }
        // TODO: transactions not supported with neon-http
        if (op.type === 'insert' && op.schema === 'library') {
          await db
            .insert(library)
            .values({
              ...op.data,
              userId: ctx.userId!,
              createdAt: new Date(),
              updatedAt: new Date(),
            })
            .onConflictDoNothing();
        }
        if (op.type === 'update' && op.schema === 'library') {
          await db
            .update(library)
            .set({ ...op.data, updatedAt: new Date() })
            .where(and(eq(library.userId, ctx.userId!), eq(library.movieId, op.key)));
        }
      }
    }),

  movieDetails: publicProcedure.input(z.string()).query(async ({ input }) => {
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
