import z from 'zod';

import {
  LibrarySchema,
  MessageAssistantSchema,
  MessageSchema,
  MessageResponseMovieSchema,
  MessageUserSchema,
  MovieSchema,
  ThreadSchema,
  UserSchema,
} from './drizzle/zod';
import { type operations } from './tmdb/schema-v3';
import { Prettify } from './utils';

export type TMDbSearchMovie = operations['search-movie']['responses']['200']['content']['application/json'];
export type TMDbMovieDetails = operations['movie-details']['responses']['200']['content']['application/json'];
export type TMDbMovieCredits = operations['movie-credits']['responses']['200']['content']['application/json'];
export type TMDbMovieDetailsWithCredits = Prettify<TMDbMovieDetails & { credits: TMDbMovieCredits }>;

export type Thread = z.infer<typeof ThreadSchema>;
export type Message = z.infer<typeof MessageSchema>;
export type Movie = z.infer<typeof MovieSchema>;
export type Library = z.infer<typeof LibrarySchema>;
export type User = z.infer<typeof UserSchema>;

export type MessageResponseMovie = z.infer<typeof MessageResponseMovieSchema>;

export type MessageUser = z.infer<typeof MessageUserSchema>;
export type MessageAssistant = Prettify<z.infer<typeof MessageAssistantSchema>>;
