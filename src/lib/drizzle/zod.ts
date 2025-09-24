import { createSelectSchema } from 'drizzle-zod';
import z from 'zod';

import * as schema from './schema';

export const UserSchema = createSelectSchema(schema.users);
export const ThreadSchema = createSelectSchema(schema.threads);
export const MessageSchema = createSelectSchema(schema.messages);
export const MovieSchema = createSelectSchema(schema.movies);
export const LibrarySchema = createSelectSchema(schema.library);

export const MessageResponseMovieSchema = z.discriminatedUnion('found', [
  z.object({
    found: z.literal(true),
    tmdbId: z.number(),
    title: z.string(),
    releaseYear: z.number(),
    why: z.string(),
  }),
  z.object({
    found: z.literal(false),
    tmdbId: z.null(),
    title: z.string(),
    releaseYear: z.number(),
    why: z.string(),
  }),
]);

export const MessageUserSchema = MessageSchema.omit({
  serial: true,
  parentId: true,
  structured: true,
  model: true,
}).extend({
  role: z.literal('user'),
});

export const MessageAssistantSchema = MessageSchema.omit({ serial: true }).extend({
  role: z.literal('assistant'),
  responseMovies: z.array(MessageResponseMovieSchema),
  movies: z.array(MovieSchema),
  library: z.array(LibrarySchema),
});
