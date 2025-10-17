import { createServerFn } from '@tanstack/react-start';
import z from 'zod';

import { db } from '../db/client';
import { authMiddleware } from '../middleware/auth';

export const getChat = createServerFn()
  .middleware([authMiddleware])
  .inputValidator(
    z.object({
      conversationId: z.uuid(),
    })
  )
  .handler(async ({ data }) => {
    const result = await db.query.conversations.findFirst({
      where: (conversations, { eq }) => eq(conversations.conversationId, data.conversationId),
    });

    return result;
  });
