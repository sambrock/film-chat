import { openai } from '@ai-sdk/openai';
import { generateText, streamText, TextStreamPart, ToolSet } from 'ai';
import { eq } from 'drizzle-orm';
import { BatchItem } from 'drizzle-orm/batch';
import superjson from 'superjson';
import z from 'zod';

import { streamTextModel, SYSTEM_CONTEXT_MESSAGE } from '@/lib/ai/get-model';
import { auth } from '@/lib/auth/server';
import { Conversation, Message, Movie, Recommendation } from '@/lib/definitions';
import { db } from '@/lib/drizzle/db';
import { conversations, messages, movies, recommendations } from '@/lib/drizzle/schema';
import { tmdbFindMovie, tmdbGetMovieById } from '@/lib/tmdb/client';
import { parseRecommendations } from '@/lib/utils';
import { randomUuid, uuidFromString } from '@/lib/utils/uuid';

const BodySchema = z.object({
  conversationId: z.uuid(),
  content: z.string(),
  model: z.string(),
});

export type ChatBody = z.infer<typeof BodySchema>;

export async function POST(req: Request) {
  const session = await auth.api.getSession(req);
  if (!session) {
    return new Response('Unauthorized', { status: 401 });
  }

  const body = await req.json();
  const parsed = BodySchema.safeParse(body);
  if (parsed.success === false) {
    return new Response(parsed.error.message, { status: 400 });
  }

  const { conversationId, content } = parsed.data;

  let conversation = await db.query.conversations.findFirst({
    where: (conversations, { eq }) => eq(conversations.conversationId, conversationId),
  });

  const conversationHistory = conversation
    ? await db.query.messages.findMany({
        where: (messages, { eq }) => eq(messages.conversationId, conversationId),
        orderBy: (messages, { asc }) => [asc(messages.serial)],
        limit: 10,
      })
    : [];

  const batch: BatchItem<'pg'>[] = [];

  const modelStream = streamText({
    model: streamTextModel(parsed.data.model),
    messages: [
      { role: 'system', content: SYSTEM_CONTEXT_MESSAGE },
      ...conversationHistory.map((m) => ({ role: m.role, content: m.content })),
      { role: 'user', content: content },
    ],
  });

  let shouldGenerateConversationTitle = false;
  if (!conversation) {
    shouldGenerateConversationTitle = true;
    [conversation] = await db
      .insert(conversations)
      .values({
        conversationId,
        userId: session.user.id,
        title: 'New chat',
      })
      .returning();
  }

  const messageUser: Message = {
    messageId: randomUuid(),
    userId: session.user.id,
    conversationId: conversation.conversationId,
    parentId: null,
    serial: undefined!,
    content,
    model: parsed.data.model,
    role: 'user',
    status: 'done',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const messageAssistant: Message = {
    messageId: randomUuid(),
    userId: session.user.id,
    conversationId: conversation.conversationId,
    parentId: messageUser.messageId,
    serial: undefined!,
    content: '',
    model: parsed.data.model,
    role: 'assistant',
    status: 'processing',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  batch.push(db.insert(messages).values([messageUser, messageAssistant]));

  const transformStream = new TransformStream({
    start: async (controller) => {
      controller.enqueue(encodeSSE({ type: 'conversation', v: conversation }));
      controller.enqueue(encodeSSE({ type: 'message', v: messageUser }));
      controller.enqueue(encodeSSE({ type: 'message', v: messageAssistant }));
    },
    transform: async (chunk: TextStreamPart<ToolSet>, controller) => {
      if (chunk.type === 'text-delta') {
        controller.enqueue(encodeSSE({ type: 'content', v: chunk.text, id: messageAssistant.messageId }));
        messageAssistant.content += chunk.text;
      }
      if (chunk.type === 'finish') {
        messageAssistant.status = 'done';
        batch.push(
          db.update(messages).set(messageAssistant).where(eq(messages.messageId, messageAssistant.messageId))
        );
        controller.enqueue(encodeSSE({ type: 'message', v: messageAssistant }));

        const parsedRecommendations = await Promise.all(
          parseRecommendations(messageAssistant.content).map(async (parsed) => {
            const recommendation: Recommendation = {
              recommendationId: randomUuid(),
              userId: session.user.id,
              messageId: messageAssistant.messageId,
              movieId: null,
              title: parsed.title,
              releaseYear: parsed.releaseYear,
              why: parsed.why,
              createdAt: new Date(),
            };

            const found = await tmdbFindMovie(recommendation.title, recommendation.releaseYear.toString());
            if (!found) {
              return recommendation;
            }
            const source = await tmdbGetMovieById(found.id);
            if (!source) {
              return recommendation;
            }

            const movie: Movie = {
              movieId: uuidFromString(found.id.toString()),
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
          controller.enqueue(encodeSSE({ type: 'recommendations', v: parsedRecommendations }));
        }

        if (shouldGenerateConversationTitle) {
          const generatedTitle = await generateText({
            model: openai('gpt-4.1-nano'),
            prompt: `Generate a concise title for in 3 words or less: "Movies for this prompt: ${messageAssistant.content}"`,
          });

          batch.push(
            db
              .update(conversations)
              .set({ title: generatedTitle.text })
              .where(eq(conversations.conversationId, conversation!.conversationId))
          );

          controller.enqueue(
            encodeSSE({ type: 'conversation', v: { ...conversation, title: generatedTitle.text } })
          );
        }

        controller.enqueue(encodeSSE('end'));
        controller.terminate();

        await db.batch(batch as [BatchItem<'pg'>]);
      }
    },
  });

  modelStream.fullStream.pipeThrough(transformStream);

  return new Response(transformStream.readable, {
    headers: {
      'Content-Type': 'text/event-stream',
    },
  });
}

export type ChatSSEData =
  | { type: 'conversation'; v: Conversation }
  | { type: 'message'; v: Message }
  | { type: 'recommendations'; v: Recommendation[] }
  | { type: 'movie'; v: Movie }
  | { type: 'content'; v: string; id: string }
  | { type: 'end' };

const encodeSSE = (data: ChatSSEData | 'end') => {
  if (data === 'end') {
    return new TextEncoder().encode(`event: end\ndata: \n\n`);
  }
  return new TextEncoder().encode(`event: delta\ndata: ${superjson.stringify(data)}\n\n`);
};
