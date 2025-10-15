import { createSelectSchema } from 'drizzle-zod';
import z from 'zod';

import * as schema from './schema';

export const UserSchema = createSelectSchema(schema.users);
export const ConversationSchema = createSelectSchema(schema.conversations);
export const MessageSchema = createSelectSchema(schema.messages);
export const MovieSchema = createSelectSchema(schema.movies);
export const LibrarySchema = createSelectSchema(schema.library);
export const RecommendationSchema = createSelectSchema(schema.recommendations);

export const TMDbMovie = z.object({
  title: z.string(),
  poster_path: z.string(),
  runtime: z.number().nullable(),
  release_date: z.string().nullable(),
});

export const MessageUserSchema = MessageSchema.omit({
  serial: true,
  parentId: true,
}).extend({
  role: z.literal('user'),
});

export const MessageAssistantSchema = MessageSchema.omit({ serial: true }).extend({
  role: z.literal('assistant'),
  recommendations: RecommendationSchema.array(),
  movies: MovieSchema.extend({ tmdb: TMDbMovie }).array(),
  libraries: LibrarySchema.array(),
});

export const ChatMessageSchema = MessageUserSchema.or(MessageAssistantSchema);
