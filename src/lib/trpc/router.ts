
import { db } from '../drizzle/db';
import { protectedProcedure, router } from './server';

export type AppRouter = typeof appRouter;

export const appRouter = router({
  syncChats: protectedProcedure.query(async ({ ctx }) => {
    const data = await db.query.conversations.findMany({
      where: (conversations, { eq }) => eq(conversations.userId, ctx.session.user.id),
      orderBy: (conversations, { desc }) => [desc(conversations.updatedAt)],
    });

    return data;
  }),

  syncMessages: protectedProcedure.query(async ({ ctx }) => {
    const data = await db.query.messages.findMany({
      where: (messages, { eq }) => eq(messages.userId, ctx.session.user.id),
      orderBy: (messages, { asc }) => [asc(messages.serial)],
    });

    return data;
  }),

  syncRecommendations: protectedProcedure.query(async ({ ctx }) => {
    const data = await db.query.recommendations.findMany({
      where: (messages, { eq }) => eq(messages.userId, ctx.session.user.id),
    });

    return data;
  }),

  syncMovies: protectedProcedure.query(async ({ ctx }) => {
    const recommendations = await db.query.recommendations.findMany({
      where: (messages, { and, eq, isNotNull }) =>
        and(eq(messages.userId, ctx.session.user.id), isNotNull(messages.movieId)),
    });

    const data = await db.query.movies.findMany({
      where: (library, { and, isNotNull, inArray }) =>
        and(
          isNotNull(library.movieId),
          inArray(library.movieId, recommendations.map((r) => r.movieId) as string[])
        ),
    });

    return data;
  }),

  // sync: protectedProcedure.mutation(async ({ ctx }) => {
  //   const [chats, messages, recommendationsWithMovies] = await db.batch([
  //     db.query.conversations.findMany({
  //       where: (conversations, { eq }) => eq(conversations.userId, ctx.session.user.id),
  //       orderBy: (conversations, { desc }) => [desc(conversations.updatedAt)],
  //     }),
  //     db.query.messages.findMany({
  //       where: (messages, { eq }) => eq(messages.userId, ctx.session.user.id),
  //       orderBy: (messages, { asc }) => [asc(messages.serial)],
  //     }),
  //     db.query.recommendations.findMany({
  //       where: (recommendations, { eq }) => eq(recommendations.userId, ctx.session.user.id),
  //       with: { movie: true },
  //     }),
  //   ]);

  //   return {
  //     chats,
  //     messages,
  //     recommendations: recommendationsWithMovies.map(({ movie, ...rest }) => rest),
  //     movies: recommendationsWithMovies.map(({ movie }) => movie).filter(Boolean) as Movie[],
  //   };
  // }),

  // conversations: publicProcedure.query(async ({ ctx }) => {
  //   if (!ctx.session) {
  //     return [];
  //   }

  //   const data = await db.query.conversations.findMany({
  //     where: (conversations, { eq }) => eq(conversations.userId, ctx.session.user.id),
  //     orderBy: (conversations, { desc }) => [desc(conversations.updatedAt)],
  //   });

  //   return data;
  // }),

  // conversation: publicProcedure
  //   .input(
  //     z.object({
  //       conversationId: z.string(),
  //     })
  //   )
  //   .query(async ({ ctx, input }) => {
  //     if (!ctx.session) {
  //       return null;
  //     }

  //     const conversationWithCount = await db
  //       .select({
  //         conversation: conversations,
  //         moviesCount: sql`count(recommendations.movie_id)`.mapWith(Number),
  //       })
  //       .from(conversations)
  //       .leftJoin(messages, eq(messages.conversationId, conversations.conversationId))
  //       .leftJoin(recommendations, eq(messages.messageId, recommendations.messageId))
  //       .where(
  //         and(
  //           eq(conversations.conversationId, input.conversationId),
  //           eq(conversations.userId, ctx.session.user.id)
  //         )
  //       )
  //       .groupBy(conversations.conversationId)
  //       .limit(1);

  //     const conversation = conversationWithCount[0]?.conversation ?? null;
  //     const moviesCount = conversationWithCount[0]?.moviesCount ?? 0;

  //     return { ...conversation, moviesCount };
  //   }),

  // conversationHistory: publicProcedure
  //   .input(z.object({ conversationId: z.string() }))
  //   .output(z.array(ConversationMessageSchema))
  //   .query(async ({ ctx, input }) => {
  //     if (!ctx.session) {
  //       return [];
  //     }

  //     const data = await db.query.messages.findMany({
  //       where: (messages, { eq }) => eq(messages.conversationId, input.conversationId),
  //       with: {
  //         recommendations: {
  //           with: {
  //             movie: {
  //               with: {
  //                 libraries: { where: (library, { eq }) => eq(library.userId, ctx.session.user.id) },
  //               },
  //             },
  //           },
  //         },
  //       },
  //       orderBy: (messages, { desc }) => [desc(messages.serial)],
  //       limit: 20,
  //     });

  //     const conversationHistory = data.map((message) => {
  //       if (message.role === 'user') {
  //         return MessageUserSchema.parse(message);
  //       } else {
  //         return MessageAssistantSchema.parse({
  //           ...message,
  //           recommendations: message.recommendations,
  //           movies: message.recommendations.map((m) => m.movie).filter(Boolean),
  //           library: message.recommendations.flatMap((m) => m.movie?.libraries).filter(Boolean),
  //         });
  //       }
  //     });

  //     return conversationHistory;
  //   }),

  // deleteConversation: publicProcedure
  //   .input(z.object({ conversationId: z.string() }))
  //   .mutation(async ({ ctx, input }) => {
  //     if (!ctx.session) {
  //       throw new TRPCError({ code: 'UNAUTHORIZED' });
  //     }

  //     await db
  //       .delete(conversations)
  //       .where(
  //         and(
  //           eq(conversations.conversationId, input.conversationId),
  //           eq(conversations.userId, ctx.session.user.id)
  //         )
  //       );
  //   }),

  // movie: publicProcedure.input(z.object({ movieId: z.uuid() })).query(async ({ ctx, input }) => {
  //   const movie = await db.query.movies.findFirst({
  //     where: (movies, { and, eq, isNotNull }) => eq(movies.movieId, input.movieId),
  //     with: {
  //       libraries: { where: (library, { eq }) => eq(library.userId, ctx.session.user.id) },
  //     },
  //   });

  //   if (!movie) {
  //     throw new TRPCError({ code: 'NOT_FOUND', message: 'Movie not found' });
  //   }

  //   const withCast = await tmdbGetMovieByIdWithCredits(movie.tmdbId);

  //   return { ...movie, credits: withCast?.credits };
  // }),

  // library: publicProcedure.query(async ({ ctx }) => {
  //   if (!ctx.session) {
  //     return [];
  //   }

  //   const data = await db.query.library.findMany({
  //     where: (library, { eq, isNotNull }) =>
  //       and(eq(library.userId, ctx.session.user.id), isNotNull(library.movieId)),
  //     with: { movie: true },
  //     orderBy: (library, { desc }) => [desc(library.updatedAt)],
  //     limit: 100,
  //   });

  //   return data;
  // }),

  // libraryCount: publicProcedure.query(async ({ ctx }) => {
  //   if (!ctx.session) {
  //     return 0;
  //   }

  //   const [{ count }] = await db
  //     .select({
  //       count: sql`count(*)`.mapWith(Number),
  //     })
  //     .from(library)
  //     .where(and(eq(library.userId, ctx.session.user.id), isNotNull(library.movieId)));

  //   return count;
  // }),

  // updateLibrary: publicProcedure
  //   .input(
  //     z.object({
  //       movieId: z.uuid(),
  //       liked: z.boolean().optional(),
  //       watched: z.boolean().optional(),
  //       watchlist: z.boolean().optional(),
  //     })
  //   )
  //   .mutation(async ({ ctx, input }) => {
  //     if (!ctx.session) {
  //       throw new TRPCError({ code: 'UNAUTHORIZED' });
  //     }

  //     const [data] = await db
  //       .insert(library)
  //       .values({
  //         movieId: input.movieId,
  //         userId: ctx.session.user.id,
  //         liked: input.liked ?? false,
  //         watched: input.watched ?? false,
  //         watchlist: input.watchlist ?? false,
  //       })
  //       .onConflictDoUpdate({
  //         target: [library.movieId, library.userId],
  //         set: {
  //           liked: input.liked ?? library.liked,
  //           watched: input.watched ?? library.watched,
  //           watchlist: input.watchlist ?? library.watchlist,
  //           updatedAt: new Date(),
  //         },
  //       })
  //       .returning();

  //     return data;
  //   }),
});
