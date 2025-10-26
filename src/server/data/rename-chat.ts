import { createServerFn } from '@tanstack/react-start';
import { and, eq } from 'drizzle-orm';
import z from 'zod';

import { db } from '../db/client';
import { conversations } from '../db/schema';
import { authMiddleware } from '../middleware/auth';

const RenameChatSchema = z.object({
  conversationId: z.string(),
  title: z.string().min(1).max(30),
});

export type RenameChatData = z.infer<typeof RenameChatSchema>;

export const renameChat = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .inputValidator(RenameChatSchema)
  .handler(async ({ context, data }) => {
    if (!context.user) {
      return;
    }

    await db
      .update(conversations)
      .set({ title: data.title })
      .where(
        and(eq(conversations.userId, context.user.id), eq(conversations.conversationId, data.conversationId))
      );
  });
