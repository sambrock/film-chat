import { TRPCError } from '@trpc/server';
import { and, eq } from 'drizzle-orm';
import z from 'zod';

import { db } from '../drizzle/db';
import { library } from '../drizzle/schema';
import { LibrarySchema } from '../drizzle/zod';
import { tmdbGetMovieByIdWithCredits } from '../tmdb/client';
import { protectedProcedure, publicProcedure, router } from './server';

export type AppRouter = typeof appRouter;

export const appRouter = router({
  syncChats: protectedProcedure.query(async ({ ctx }) => {
    const data = await db.query.conversations.findMany({
      where: (conversations, { eq }) => eq(conversations.userId, ctx.session.user.id),
      orderBy: (conversations, { desc }) => [desc(conversations.updatedAt)],
    });

    return data;
  }),

  syncMessages: protectedProcedure.query(async ({ ctx }) => {
    const data = await db.query.messages.findMany({
      where: (messages, { eq }) => eq(messages.userId, ctx.session.user.id),
      orderBy: (messages, { desc }) => [desc(messages.serial)],
    });

    return data;
  }),

  syncRecommendations: protectedProcedure.query(async ({ ctx }) => {
    const data = await db.query.recommendations.findMany({
      where: (messages, { eq }) => eq(messages.userId, ctx.session.user.id),
    });

    return data;
  }),

  syncMovies: protectedProcedure.query(async ({ ctx }) => {
    const recommendations = await db.query.recommendations.findMany({
      where: (messages, { and, eq, isNotNull }) =>
        and(eq(messages.userId, ctx.session.user.id), isNotNull(messages.movieId)),
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

  syncLibrary: protectedProcedure.query(async ({ ctx }) => {
    const data = await db.query.library.findMany({
      where: (library, { eq }) => eq(library.userId, ctx.session.user.id),
    });

    return data;
  }),

  saveTransaction: protectedProcedure
    .input(
      z
        .discriminatedUnion('type', [
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
        // TODO: transactions not supported with neon-http
        if (op.type === 'insert' && op.schema === 'library') {
          await db
            .insert(library)
            .values({
              ...op.data,
              userId: ctx.session.user.id,
              createdAt: new Date(),
              updatedAt: new Date(),
            })
            .onConflictDoNothing()
            .execute();
        }
        if (op.type === 'update' && op.schema === 'library') {
          await db
            .update(library)
            .set({ ...op.data, updatedAt: new Date() })
            .where(and(eq(library.userId, ctx.session.user.id), eq(library.movieId, op.key)))
            .execute();
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
