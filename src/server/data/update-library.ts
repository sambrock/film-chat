import { createServerFn } from '@tanstack/react-start';
import { and, eq } from 'drizzle-orm';
import z from 'zod';

import { db } from '../db/client';
import { library } from '../db/schema';
import { authMiddleware } from '../middleware/auth';

const UpdateLibrarySchema = z.object({
  movieId: z.uuid(),
  watched: z.boolean().optional(),
  watchlist: z.boolean().optional(),
  liked: z.boolean().optional(),
});

export type UpdateLibraryData = z.infer<typeof UpdateLibrarySchema>;

export const updateLibrary = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .inputValidator(UpdateLibrarySchema)
  .handler(async ({ context, data }) => {
    if (!context.user) {
      return;
    }

    const exists = await db.query.library.findFirst({
      where: (library, { and, eq }) =>
        and(eq(library.userId, context.user.id), eq(library.movieId, data.movieId)),
    });

    if (exists) {
      await db
        .update(library)
        .set({
          watched: data.watched ?? exists.watched,
          watchlist: data.watchlist ?? exists.watchlist,
          liked: data.liked ?? exists.liked,
        })
        .where(and(eq(library.userId, context.user.id), eq(library.movieId, data.movieId)));
    } else {
      await db.insert(library).values({
        userId: context.user.id,
        movieId: data.movieId,
        watched: data.watched ?? false,
        watchlist: data.watchlist ?? false,
        liked: data.liked ?? false,
      });
    }
  });
