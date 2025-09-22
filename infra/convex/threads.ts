import { v } from 'convex/values';

import { decryptSession } from '@/lib/session';
import { mutation, query } from './_generated/server';
import { threadSchema } from './schema';

export const getBySession = query({
  args: {
    session: v.string(),
  },
  handler: async (ctx, args) => {
    const sessionPayload = await decryptSession(args.session);
    if (!sessionPayload) return;

    const data = await ctx.db
      .query('threads')
      .withIndex('by_user_id', (q) => q.eq('userId', sessionPayload.userId))
      .order('desc')
      .collect();

    return data.filter((thread) => !thread.isDeleted);
  },
});

export const getByThreadId = query({
  args: {
    threadId: v.string(),
  },
  handler: async (ctx, args) => {
    return ctx.db
      .query('threads')
      .withIndex('by_thread_id', (q) => q.eq('threadId', args.threadId))
      .first();
  },
});

export const create = mutation({
  args: {
    data: v.object(threadSchema),
    session: v.string(),
  },
  handler: async (ctx, args) => {
    const sessionPayload = await decryptSession(args.session);
    if (!sessionPayload) return null;

    const _id = await ctx.db.insert('threads', {
      ...args.data,
      userId: sessionPayload.userId,
    });
    return ctx.db.get(_id);
  },
});

export const update = mutation({
  args: {
    threadId: v.string(),
    data: v.object({
      title: v.string(),
    }),
  },
  handler: async (ctx, args) => {
    const thread = await ctx.db
      .query('threads')
      .withIndex('by_thread_id', (q) => q.eq('threadId', args.threadId))
      .first();
    if (!thread) return;
    await ctx.db.patch(thread._id, args.data);
    return ctx.db.get(thread._id);
  },
});

export const remove = mutation({
  args: {
    threadId: v.string(),
  },
  handler: async (ctx, args) => {
    const thread = await ctx.db
      .query('threads')
      .withIndex('by_thread_id', (q) => q.eq('threadId', args.threadId))
      .first();
    if (!thread) return;

    await ctx.db.patch(thread._id, { isDeleted: true });
  },
});
