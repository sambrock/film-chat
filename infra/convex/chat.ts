import { v } from 'convex/values';

import { decryptSession } from '@/lib/session';
import { mutation } from './_generated/server';
import { messageSchema } from './schema';

export const newChatMessage = mutation({
  args: {
    session: v.string(),
    threadId: v.string(),
    threadIsPersisted: v.boolean(),
    userMessage: v.object(messageSchema),
    assistantMessage: v.object(messageSchema),
  },
  handler: async (ctx, args) => {
    const sessionPayload = await decryptSession(args.session);
    if (!sessionPayload) return;

    if (!args.threadIsPersisted) {
      await ctx.db.insert('threads', {
        threadId: args.threadId,
        userId: sessionPayload.userId,
        title: '',
      });
    }

    await ctx.db.insert('messages', args.userMessage);
    await ctx.db.insert('messages', args.assistantMessage);
  },
});
