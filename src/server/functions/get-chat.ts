import { createServerFn } from '@tanstack/react-start';
import z from 'zod';

import { db } from '~/lib/drizzle/db';

export const getChat = createServerFn()
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
