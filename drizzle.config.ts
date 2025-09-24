import { config } from '@dotenvx/dotenvx';
import { defineConfig } from 'drizzle-kit';

config({ path: [`.env.${process.env.NODE_ENV}`] });

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/lib/drizzle/schema.ts',
  out: './drizzle',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
