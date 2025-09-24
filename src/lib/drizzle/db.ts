import { neon } from '@neondatabase/serverless';
import { drizzle as prod } from 'drizzle-orm/neon-http';
import { drizzle as dev } from 'drizzle-orm/node-postgres';

import { env } from '../utils/env';
import {
  accounts,
  library,
  libraryRelations,
  messageMovies,
  messageMoviesRelations,
  messageRelations,
  messages,
  movies,
  moviesRelations,
  sessions,
  threads,
  threadsRelations,
  userRelations,
  users,
  verifications,
} from './schema';

const schema = {
  accounts,
  library,
  libraryRelations,
  messageMovies,
  messageMoviesRelations,
  messageRelations,
  messages,
  movies,
  moviesRelations,
  sessions,
  threads,
  threadsRelations,
  userRelations,
  users,
  verifications,
};

export const db = dev(env.DATABASE_URL, { schema });

// export const db =
//   env.NODE_ENV === 'production'
//     ? prod({ client: neon(env.DATABASE_URL), schema })
//     : dev(env.DATABASE_URL, { schema });
