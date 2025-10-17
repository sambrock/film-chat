import { createServerFn } from '@tanstack/react-start';
import z from 'zod';

import { db } from '../db/client';
import { MessageAssistantSchema, MessageUserSchema } from '../db/zod';
import { authMiddleware } from '../middleware/auth';

export const getChatMessages = createServerFn()
  .middleware([authMiddleware])
  .inputValidator(
    z.object({
      conversationId: z.string(),
    })
  )
  .handler(async ({ context, data }) => {
    const results = await db.query.messages.findMany({
      where: (messages, { eq }) => eq(messages.conversationId, data.conversationId),
      with: {
        recommendations: {
          with: {
            movie: {
              with: {
                libraries: {
                  where: (libraries, { eq }) => eq(libraries.userId, context.user?.id || ''),
                },
              },
            },
          },
        },
      },
      orderBy: (messages, { desc }) => [desc(messages.serial)],
      limit: 20,
    });

    return results.map((message) => {
      if (message.role === 'user') return MessageUserSchema.parse(message);
      return MessageAssistantSchema.parse({
        ...message,
        recommendations: message.recommendations,
        movies: message.recommendations.map((r) => r.movie).filter(Boolean),
        libraries: message.recommendations.flatMap((r) => r.movie?.libraries).filter(Boolean),
      });
    });
  });
