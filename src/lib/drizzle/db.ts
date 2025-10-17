import { neon } from '@neondatabase/serverless';
import { env } from 'cloudflare:workers';
import { drizzle } from 'drizzle-orm/neon-http';

// import { env } from '../utils/env';
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

export const db = drizzle({ client: neon(env.DATABASE_URL), schema });
