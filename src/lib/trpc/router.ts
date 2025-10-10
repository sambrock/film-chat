import z from 'zod';

import { db } from '../drizzle/db';
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

  movieDetails: publicProcedure.input(z.number()).query(async ({ input, ctx }) => {
    const details = await tmdbGetMovieByIdWithCredits(input);

    return details;
  }),
});
