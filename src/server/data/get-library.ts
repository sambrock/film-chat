import { createServerFn } from '@tanstack/react-start';

import { db } from '../db/client';
import { authMiddleware } from '../middleware/auth';

export const getLibrary = createServerFn()
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    if (!context.user) {
      return [];
    }

    const data = await db.query.library.findMany({
      where: (library, { eq }) => eq(library.userId, context.user.id),
      orderBy: (library, { desc }) => [desc(library.createdAt)],
      with: {
        movie: true,
      },
      limit: 20,
    });

    return data;
  });
