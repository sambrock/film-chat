import z from 'zod';

import {
  ChatMessageSchema,
  ConversationSchema,
  LibrarySchema,
  MessageAssistantSchema,
  MessageSchema,
  MessageUserSchema,
  MovieSchema,
  RecommendationSchema,
  UserSchema,
} from './drizzle/zod';
import { type operations } from './tmdb/schema-v3';
import { Prettify } from './utils';

export type TMDbSearchMovieResult = NonNullable<
  operations['search-movie']['responses']['200']['content']['application/json']['results']
>[number];
export type TMDbMovieDetails = operations['movie-details']['responses']['200']['content']['application/json'];
export type TMDbMovieCredits = operations['movie-credits']['responses']['200']['content']['application/json'];
export type TMDbMovieDetailsWithCredits = Prettify<TMDbMovieDetails & { credits: TMDbMovieCredits }>;

export type Conversation = z.infer<typeof ConversationSchema>;
export type Message = z.infer<typeof MessageSchema>;
export type Movie = z.infer<typeof MovieSchema>;
export type Library = z.infer<typeof LibrarySchema>;
export type User = z.infer<typeof UserSchema>;
export type Recommendation = z.infer<typeof RecommendationSchema>;

export type MessageUser = z.infer<typeof MessageUserSchema>;
export type MessageAssistant = Prettify<z.infer<typeof MessageAssistantSchema>>;
export type ChatMessage = z.infer<typeof ChatMessageSchema>;
