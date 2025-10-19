import { createFileRoute } from '@tanstack/react-router';
import { openai } from '@ai-sdk/openai';
import { generateText, streamText, TextStreamPart, ToolSet } from 'ai';
import { eq } from 'drizzle-orm';
import { BatchItem } from 'drizzle-orm/batch';
import z from 'zod';

import { db } from '~/server/db/client';
import { conversations, messages, movies, recommendations } from '~/server/db/schema';
import { authOrAnonSignInMiddleware } from '~/server/middleware/auth-or-anon-sign-in';
import { streamTextModel, SYSTEM_CONTEXT_MESSAGE } from '~/lib/ai/get-model';
import { parseRecommendations } from '~/lib/ai/utils';
import { Conversation, MessageAssistant, MessageUser, Movie, Recommendation } from '~/lib/definitions';
import { tmdbFindMovie, tmdbGetMovieById } from '~/lib/tmdb/client';
import { serialize, uuidV4, uuidV5 } from '~/lib/utils';

export const Route = createFileRoute('/api/chat')({
  server: {
    middleware: [authOrAnonSignInMiddleware],
    handlers: {
      POST: async ({ context, request }) => {
        const body = await request.json();
        const parsed = BodySchema.safeParse(body);
        if (parsed.success === false) {
          return new Response(parsed.error.message, { status: 400 });
        }

        const { conversationId, content } = parsed.data;

        const batch: BatchItem<'pg'>[] = [];

        const conversationExists = await db.query.conversations.findFirst({
          where: (conversations, { eq }) => eq(conversations.conversationId, conversationId),
        });

        let conversation = conversationExists;
        if (!conversationExists) {
          conversation = {
            conversationId,
            userId: context.user.id,
            title: '',
            lastUpdateAt: new Date(),
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          batch.push(db.insert(conversations).values(conversation));
        } else {
          batch.push(
            db
              .update(conversations)
              .set({ lastUpdateAt: new Date() })
              .where(eq(conversations.conversationId, conversationId))
          );
        }

        const conversationHistory = conversationExists
          ? await db.query.messages.findMany({
              where: (messages, { eq }) => eq(messages.conversationId, conversationId),
              orderBy: (messages, { asc }) => [asc(messages.serial)],
              limit: 10,
            })
          : [];

        const modelStream = streamText({
          model: streamTextModel(parsed.data.model),
          messages: [
            { role: 'system', content: SYSTEM_CONTEXT_MESSAGE },
            ...conversationHistory.map((m) => ({ role: m.role, content: m.content })),
            { role: 'user', content: content },
          ],
        });

        const messageUser: MessageUser = {
          messageId: uuidV4(),
          userId: context.user.id,
          conversationId,
          content,
          model: parsed.data.model,
          role: 'user',
          status: 'done',
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        const messageAssistant: MessageAssistant = {
          messageId: uuidV4(),
          userId: context.user.id,
          conversationId,
          parentId: messageUser.messageId,
          content: '',
          model: parsed.data.model,
          role: 'assistant',
          status: 'processing',
          createdAt: new Date(),
          updatedAt: new Date(),
          recommendations: [],
          movies: [],
          libraries: [],
        };

        batch.push(db.insert(messages).values([messageUser, messageAssistant]));

        const transformStream = new TransformStream({
          start: async (controller) => {
            if (!conversationExists) {
              controller.enqueue(encodeSSE({ type: 'chat', v: conversation! }));
            }
            controller.enqueue(encodeSSE({ type: 'message', v: messageUser }));
            controller.enqueue(encodeSSE({ type: 'message', v: messageAssistant }));
          },
          transform: async (chunk: TextStreamPart<ToolSet>, controller) => {
            if (chunk.type === 'text-delta') {
              controller.enqueue(encodeSSE({ type: 'content', v: chunk.text }));
              messageAssistant.content += chunk.text;
            }
            if (chunk.type === 'finish') {
              messageAssistant.status = 'done';
              batch.push(
                db
                  .update(messages)
                  .set(messageAssistant)
                  .where(eq(messages.messageId, messageAssistant.messageId))
              );
              controller.enqueue(encodeSSE({ type: 'message', v: messageAssistant }));

              const parsedRecommendations = await Promise.all(
                parseRecommendations(messageAssistant.content).map(async (parsed) => {
                  const recommendation: Recommendation = {
                    recommendationId: uuidV4(),
                    userId: context.user.id,
                    messageId: messageAssistant.messageId,
                    movieId: null,
                    title: parsed.title,
                    releaseYear: parsed.releaseYear,
                    why: parsed.why,
                    createdAt: new Date(),
                  };

                  const found = await tmdbFindMovie(
                    recommendation.title,
                    recommendation.releaseYear.toString()
                  );
                  if (!found) {
                    return recommendation;
                  }
                  const source = await tmdbGetMovieById(found.id);
                  if (!source) {
                    return recommendation;
                  }

                  const movie: Movie = {
                    movieId: uuidV5(found.id.toString()),
                    tmdbId: found.id,
                    tmdb: source,
                    createdAt: new Date(),
                  };
                  recommendation.movieId = movie.movieId;

                  batch.push(db.insert(movies).values(movie).onConflictDoNothing());
                  controller.enqueue(encodeSSE({ type: 'movie', v: movie }));

                  return recommendation;
                })
              );

              if (parsedRecommendations.length > 0) {
                batch.push(db.insert(recommendations).values(parsedRecommendations));
                controller.enqueue(
                  encodeSSE({
                    type: 'recommendations',
                    v: parsedRecommendations,
                  })
                );
              }

              if (!conversationExists) {
                const generatedTitle = await generateText({
                  model: openai('gpt-4.1-nano'),
                  prompt: `Generate a short title for this prompt in 3 words or less (don't use the word "movie"): "Movie picks for prompt: ${content}"`,
                });

                batch.push(
                  db
                    .update(conversations)
                    .set({ title: generatedTitle.text })
                    .where(eq(conversations.conversationId, conversation!.conversationId))
                );

                controller.enqueue(
                  encodeSSE({ type: 'chat', v: { ...conversation!, title: generatedTitle.text } })
                );
              }

              controller.enqueue(encodeSSE('end'));

              await db.batch(batch as [BatchItem<'pg'>]);

              controller.terminate();
            }
          },
        });

        modelStream.fullStream.pipeThrough(transformStream);

        return new Response(transformStream.readable, {
          headers: {
            'Content-Type': 'text/event-stream',
          },
        });
      },
    },
  },
});

const BodySchema = z.object({
  conversationId: z.uuid(),
  content: z.string(),
  model: z.string(),
});

export type ChatBody = z.infer<typeof BodySchema>;

export type ChatSSEData =
  | { type: 'chat'; v: Conversation }
  | { type: 'message'; v: MessageUser | MessageAssistant }
  | { type: 'recommendations'; v: Recommendation[] }
  | { type: 'movie'; v: Movie }
  | { type: 'content'; v: string }
  | { type: 'end' };

const encodeSSE = (data: ChatSSEData | 'end') => {
  if (data === 'end') {
    return new TextEncoder().encode(`event: end\ndata: \n\n`);
  }
  return new TextEncoder().encode(`event: delta\ndata: ${serialize(data)}\n\n`);
};
