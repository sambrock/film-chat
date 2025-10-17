import { env as cf_env } from 'cloudflare:workers';
import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string(),
  BETTER_AUTH_SECRET: z.string(),
  BETTER_AUTH_URL: z.string(),
  TMDB_API_KEY: z.string(),
  OPENAI_API_KEY: z.string(),
  GOOGLE_GENERATIVE_AI_API_KEY: z.string(),
});

export const env = envSchema.parse(cf_env || process.env);
