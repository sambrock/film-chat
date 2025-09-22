import { v } from 'convex/values';

import { decryptSession } from '@/lib/session';
import { mutation, query } from './_generated/server';

export const getBySession = query({
  args: {
    session: v.string(),
  },
  handler: async (ctx, args) => {
    const sessionPayload = await decryptSession(args.session);
    if (!sessionPayload) return;

    return ctx.db
      .query('watchlist')
      .withIndex('by_user_id', (q) => q.eq('userId', sessionPayload.userId))
      .collect();
  },
});

export const updateWatchlist = mutation({
  args: {
    tmdbId: v.number(),
    data: v.object({
      watchlist: v.boolean(),
      title: v.string(),
      releaseDate: v.number(),
      posterPath: v.string(),
    }),
    session: v.string(),
  },
  handler: async (ctx, args) => {
    const sessionPayload = await decryptSession(args.session);
    if (!sessionPayload) return;

    const exists = await ctx.db
      .query('watchlist')
      .withIndex('by_user_tmdb_id', (q) => q.eq('userId', sessionPayload.userId).eq('tmdbId', args.tmdbId))
      .first();

    if (exists) {
      await ctx.db.delete(exists._id);
    } else {
      await ctx.db.insert('watchlist', {
        userId: sessionPayload.userId,
        tmdbId: args.tmdbId,
        title: args.data.title,
        releaseDate: args.data.releaseDate,
        posterPath: args.data.posterPath,
      });
    }
  },
});
