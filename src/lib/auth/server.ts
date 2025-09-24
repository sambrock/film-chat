import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { nextCookies } from 'better-auth/next-js';
import { anonymous } from 'better-auth/plugins';

import { db } from '../drizzle/db';

export const auth = betterAuth({
  session: {
    expiresIn: undefined, // Sessions do not expire,
  },
  database: drizzleAdapter(db, {
    provider: 'pg',
    usePlural: true,
  }),
  plugins: [anonymous(), nextCookies()],
});
