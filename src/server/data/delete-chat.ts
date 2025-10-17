import { createServerFn } from '@tanstack/react-start';
import { and, eq } from 'drizzle-orm';
import z from 'zod';

import { db } from '../db/client';
import { conversations } from '../db/schema';
import { authMiddleware } from '../middleware/auth';

export const deleteChat = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .inputValidator(
    z.object({
      conversationId: z.uuid(),
    })
  )
  .handler(async ({ context, data }) => {
    await db
      .delete(conversations)
      .where(
        and(eq(conversations.conversationId, data.conversationId), eq(conversations.userId, context.user.id))
      );
  });
