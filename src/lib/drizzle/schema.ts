import { relations } from 'drizzle-orm';
import {
  boolean,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';

import type { TMDbMovieDetails } from '../definitions';

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').default(false).notNull(),
  image: text('image'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  isAnonymous: boolean('is_anonymous'),
});

export const sessions = pgTable('sessions', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expires_at').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .$onUpdate(() => new Date())
    .notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
});

export const accounts = pgTable('accounts', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .$onUpdate(() => new Date())
    .notNull(),
});

export const verifications = pgTable('verifications', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const conversations = pgTable('conversations', {
  conversationId: uuid('conversation_id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id),
  title: text('title').notNull().default(''),
  lastUpdateAt: timestamp('last_update_at').notNull().defaultNow(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const messages = pgTable('messages', {
  messageId: uuid('message_id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id),
  conversationId: uuid('conversation_id')
    .notNull()
    .references(() => conversations.conversationId, { onDelete: 'cascade' }),
  parentId: uuid('parent_id'),
  serial: serial('serial').notNull(),
  content: text('content').notNull(),
  model: text('model').notNull(),
  role: text({ enum: ['user', 'assistant'] }).notNull(),
  status: text({ enum: ['processing', 'done', 'error'] }).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const recommendations = pgTable('recommendations', {
  recommendationId: uuid('recommendation_id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id),
  messageId: uuid('message_id')
    .notNull()
    .references(() => messages.messageId, { onDelete: 'cascade' }),
  movieId: uuid('movie_id').references(() => movies.movieId),
  title: text('title').notNull().default(''),
  releaseYear: integer('release_year').notNull().default(0),
  why: text('why').notNull().default(''),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const movies = pgTable('movies', {
  movieId: uuid('movie_id').primaryKey(),
  tmdbId: integer('tmdb_id').unique().notNull(),
  tmdb: jsonb('tmdb').$type<TMDbMovieDetails>().notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const library = pgTable(
  'library',
  {
    userId: text('user_id')
      .notNull()
      .references(() => users.id),
    movieId: uuid('movie_id')
      .notNull()
      .references(() => movies.movieId),
    watched: boolean('watched').default(false),
    liked: boolean('liked').default(false),
    watchlist: boolean('watchlist').default(false),
    ignore: boolean('ignore').default(false),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at')
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [
    primaryKey({
      columns: [t.userId, t.movieId],
    }),
  ]
);

export const userRelations = relations(users, ({ many, one }) => ({
  conversations: many(conversations),
  library: one(library, {
    fields: [users.id],
    references: [library.userId],
  }),
}));

export const conversationsRelations = relations(conversations, ({ one, many }) => ({
  user: one(users, {
    fields: [conversations.userId],
    references: [users.id],
  }),
  messages: many(messages),
}));

export const messageRelations = relations(messages, ({ one, many }) => ({
  user: one(users, {
    fields: [messages.userId],
    references: [users.id],
  }),
  conversation: one(conversations, {
    fields: [messages.conversationId],
    references: [conversations.conversationId],
  }),
  parent: one(messages, {
    fields: [messages.parentId],
    references: [messages.messageId],
  }),
  recommendations: many(recommendations),
}));

export const recommendationsRelations = relations(recommendations, ({ one }) => ({
  user: one(users, {
    fields: [recommendations.userId],
    references: [users.id],
  }),
  message: one(messages, {
    fields: [recommendations.messageId],
    references: [messages.messageId],
  }),
  movie: one(movies, {
    fields: [recommendations.movieId],
    references: [movies.movieId],
  }),
}));

export const moviesRelations = relations(movies, ({ many }) => ({
  libraries: many(library),
  recommendations: many(recommendations),
}));

export const libraryRelations = relations(library, ({ one }) => ({
  user: one(users, {
    fields: [library.userId],
    references: [users.id],
  }),
  movie: one(movies, {
    fields: [library.movieId],
    references: [movies.movieId],
  }),
}));
