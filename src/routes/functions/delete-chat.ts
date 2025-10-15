import { createServerFn } from '@tanstack/react-start';
import { and, eq } from 'drizzle-orm';
import z from 'zod';

import { authMiddleware } from '~/server/middleware';
import { db } from '~/lib/drizzle/db';
import { conversations } from '~/lib/drizzle/schema';

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
