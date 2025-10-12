import 'server-only';

import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { nextCookies } from 'better-auth/next-js';
import { anonymous } from 'better-auth/plugins';

import { db } from '../drizzle/db';

export const auth = betterAuth({
  session: {
    expiresIn: undefined,
  },
  database: drizzleAdapter(db, {
    provider: 'pg',
    usePlural: true,
  }),
  plugins: [anonymous(), nextCookies()],
});
