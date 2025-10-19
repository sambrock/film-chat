import { createServerFn } from '@tanstack/react-start';
import z from 'zod';

import { db } from '../db/client';
import { authMiddleware } from '../middleware/auth';

export const getLibrary = createServerFn()
  .middleware([authMiddleware])
  .inputValidator(
    z.object({
      cursor: z.number().optional(),
    })
  )
  .handler(async ({ data, context }) => {
    if (!context.user) {
      return {
        results: [],
        nextCursor: undefined,
      };
    }

    const cursor = data.cursor ? new Date(data.cursor) : new Date();

    const results = await db.query.library.findMany({
      where: (library, { and, or, eq, lt }) =>
        and(
          eq(library.userId, context.user.id),
          lt(library.createdAt, cursor),
          or(library.watched, library.watchlist, library.liked)
        ),
      orderBy: (library, { desc }) => [desc(library.createdAt)],
      with: {
        movie: true,
      },
      limit: 18,
    });

    const nextCursor = results.length > 0 ? results[results.length - 1].createdAt.getTime() : undefined;

    return { results, nextCursor };
  });
