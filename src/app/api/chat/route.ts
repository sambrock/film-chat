import { openai } from '@ai-sdk/openai';
import { generateText, streamText, TextStreamPart, ToolSet } from 'ai';
import { eq } from 'drizzle-orm';
import { BatchItem } from 'drizzle-orm/batch';
import superjson from 'superjson';
import z from 'zod';

import { streamTextModel, SYSTEM_CONTEXT_MESSAGE } from '@/lib/ai/get-model';
import { auth } from '@/lib/auth/server';
import { Conversation, MessageAssistant, MessageUser, Movie, Recommendation } from '@/lib/definitions';
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
  const session = (await auth.api.getSession(req)) ?? (await auth.api.signInAnonymous());
  if (!session?.user) {
    return new Response('Unauthorized', { status: 401 });
  }

  const body = await req.json();
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
      userId: session.user.id,
      title: 'New chat',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    batch.push(db.insert(conversations).values(conversation));
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
    messageId: randomUuid(),
    userId: session.user.id,
    conversationId,
    content,
    model: parsed.data.model,
    role: 'user',
    status: 'done',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const messageAssistant: MessageAssistant = {
    messageId: randomUuid(),
    userId: session.user.id,
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
      controller.enqueue(encodeSSE({ type: 'message', v: messageUser, id: messageUser.messageId }));
      controller.enqueue(encodeSSE({ type: 'message', v: messageAssistant, id: messageAssistant.messageId }));
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
        controller.enqueue(
          encodeSSE({ type: 'message', v: messageAssistant, id: messageAssistant.messageId })
        );

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
            controller.enqueue(encodeSSE({ type: 'movie', v: movie, id: messageAssistant.messageId }));

            return recommendation;
          })
        );

        if (parsedRecommendations.length > 0) {
          batch.push(db.insert(recommendations).values(parsedRecommendations));
          controller.enqueue(
            encodeSSE({ type: 'recommendations', v: parsedRecommendations, id: messageAssistant.messageId })
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
  | { type: 'chat'; v: Conversation }
  | { type: 'message'; v: MessageUser | MessageAssistant; id: string }
  | { type: 'recommendations'; v: Recommendation[]; id: string }
  | { type: 'movie'; v: Movie; id: string }
  | { type: 'content'; v: string; id: string }
  | { type: 'end' };

const encodeSSE = (data: ChatSSEData | 'end') => {
  if (data === 'end') {
    return new TextEncoder().encode(`event: end\ndata: \n\n`);
  }
  return new TextEncoder().encode(`event: delta\ndata: ${superjson.stringify(data)}\n\n`);
};
