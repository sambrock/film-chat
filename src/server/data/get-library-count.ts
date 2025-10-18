import { createServerFn } from '@tanstack/react-start';
import { count, eq } from 'drizzle-orm';

import { db } from '../db/client';
import { library } from '../db/schema';
import { authMiddleware } from '../middleware/auth';

export const getLibraryCount = createServerFn()
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    if (!context.user) {
      return 0;
    }

    const data = await db
      .select({
        count: count(),
      })
      .from(library)
      .where(eq(library.userId, context.user.id));

    return data[0].count;
  });
