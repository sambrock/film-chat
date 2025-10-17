import { createServerFn } from '@tanstack/react-start';

import { db } from '../db/client';
import { authMiddleware } from '../middleware/auth';

export const getChats = createServerFn()
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    if (!context.user) {
      return [];
    }

    const data = await db.query.conversations.findMany({
      where: (conversations, { eq }) => eq(conversations.userId, context.user.id),
      orderBy: (conversations, { desc }) => [desc(conversations.lastUpdateAt)],
      limit: 20,
    });

    return data;
  });
