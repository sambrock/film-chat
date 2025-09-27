import { neon } from '@neondatabase/serverless';
import { drizzle as prod } from 'drizzle-orm/neon-http';
import { drizzle as dev } from 'drizzle-orm/node-postgres';

import { env } from '../env';
import {
  accounts,
  conversations,
  conversationsRelations,
  library,
  libraryRelations,
  messageRelations,
  messages,
  movies,
  moviesRelations,
  recommendations,
  recommendationsRelations,
  sessions,
  userRelations,
  users,
  verifications,
} from './schema';

const schema = {
  accounts,
  conversations,
  conversationsRelations,
  library,
  libraryRelations,
  messageRelations,
  messages,
  movies,
  moviesRelations,
  recommendations,
  recommendationsRelations,
  sessions,
  userRelations,
  users,
  verifications,
};

export const db = dev(env.DATABASE_URL, { schema });

// export const db =
//   env.NODE_ENV === 'production'
//     ? prod({ client: neon(env.DATABASE_URL), schema })
//     : dev(env.DATABASE_URL, { schema });
