import { createServerFn } from '@tanstack/react-start';
import z from 'zod';

import { db } from '~/lib/drizzle/db';
import { tmdbGetMovieByIdWithCredits } from '~/lib/tmdb/client';

export const getMovie = createServerFn()
  .inputValidator(
    z.object({
      movieId: z.uuid(),
    })
  )
  .handler(async ({ data }) => {
    const result = await db.query.movies.findFirst({
      where: (movies, { eq }) => eq(movies.movieId, data.movieId),
    });
    if (!result) {
      return null;
    }

    const source = await tmdbGetMovieByIdWithCredits(result.tmdbId);

    return source;
  });
