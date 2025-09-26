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

import type { MessageResponseMovie, TMDbMovieDetails, TMDbSearchMovieResult } from '../definitions';

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').default(false).notNull(),
  image: text('image'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  isAnonymous: boolean('is_anonymous'),
});

export const sessions = pgTable('sessions', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expires_at').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .$onUpdate(() => /* @__PURE__ */ new Date())
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
    .$onUpdate(() => /* @__PURE__ */ new Date())
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
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const threads = pgTable('threads', {
  threadId: uuid('thread_id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id),
  title: text('title').notNull().default(''),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const messages = pgTable('messages', {
  messageId: uuid('message_id').primaryKey(),
  threadId: uuid('thread_id')
    .notNull()
    .references(() => threads.threadId),
  parentId: uuid('parent_id'),
  serial: serial('serial').notNull(),
  content: text('content').notNull(),
  responseMovies: jsonb('response_movies').$type<MessageResponseMovie[]>(),
  model: text('model').notNull(),
  role: text({ enum: ['user', 'assistant'] }).notNull(),
  status: text({ enum: ['in_progress', 'done'] }).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const movies = pgTable('movies', {
  movieId: integer('movie_id').primaryKey(), // same as tmdbId
  tmdbId: integer('tmdb_id').unique().notNull(),
  source: jsonb('source').$type<TMDbMovieDetails>().notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const library = pgTable(
  'library',
  {
    userId: text('user_id')
      .notNull()
      .references(() => users.id),
    movieId: integer('movie_id')
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

export const messageMovies = pgTable(
  'message_movies',
  {
    messageId: uuid('message_id')
      .notNull()
      .references(() => messages.messageId),
    movieId: integer('movie_id')
      .notNull()
      .references(() => movies.movieId),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (t) => [
    primaryKey({
      columns: [t.messageId, t.movieId],
    }),
  ]
);

export const userRelations = relations(users, ({ many, one }) => ({
  threads: many(threads),
  library: one(library, {
    fields: [users.id],
    references: [library.userId],
  }),
}));

export const threadsRelations = relations(threads, ({ one, many }) => ({
  user: one(users, {
    fields: [threads.userId],
    references: [users.id],
  }),
  messages: many(messages),
}));

export const messageRelations = relations(messages, ({ one, many }) => ({
  thread: one(threads, {
    fields: [messages.threadId],
    references: [threads.threadId],
  }),
  parent: one(messages, {
    fields: [messages.parentId],
    references: [messages.messageId],
  }),
  movies: many(messageMovies),
}));

export const moviesRelations = relations(movies, ({ many }) => ({
  libraries: many(library),
  messages: many(messageMovies),
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

export const messageMoviesRelations = relations(messageMovies, ({ one }) => ({
  message: one(messages, {
    fields: [messageMovies.messageId],
    references: [messages.messageId],
  }),
  movie: one(movies, {
    fields: [messageMovies.movieId],
    references: [movies.movieId],
  }),
}));
