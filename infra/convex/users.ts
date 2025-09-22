import { v4 } from 'uuid';

import { generateUuid } from '@/lib/utils';
import { mutation } from './_generated/server';

export const createAnonUser = mutation({
  args: {},
  handler: async (ctx) => {
    const _id = await ctx.db.insert('users', {
      userId: generateUuid(),
      anon: true,
    });
    return ctx.db.get(_id);
  },
});
