import { streamText, TextStreamPart, ToolSet } from 'ai';
import { eq } from 'drizzle-orm';
import z from 'zod';

import { getStreamTextModel, SYSTEM_CONTEXT_MESSAGE } from '@/lib/ai/get-model';
import { auth } from '@/lib/auth/server';
import { Conversation, ConversationMessage } from '@/lib/definitions';
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

export type ConversationBody = z.infer<typeof BodySchema>;

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

  const modelStream = streamText({
    model: getStreamTextModel(parsed.data.model),
    messages: [
      { role: 'system', content: SYSTEM_CONTEXT_MESSAGE },
      ...conversationHistory.map((m) => ({ role: m.role, content: m.content })),
      { role: 'user', content: content },
    ],
  });

  if (!conversation) {
    [conversation] = await db
      .insert(conversations)
      .values({
        conversationId: randomUuid(),
        userId: session.user.id,
        title: 'New chat',
      })
      .returning();
  }

  const messageUser: ConversationMessage = {
    messageId: randomUuid(),
    conversationId: conversation.conversationId,
    content,
    model: parsed.data.model,
    role: 'user',
    status: 'done',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const messageAssistant: ConversationMessage = {
    messageId: randomUuid(),
    conversationId: conversation.conversationId,
    parentId: messageUser.messageId,
    content: '',
    model: parsed.data.model,
    role: 'assistant',
    status: 'processing',
    recommendations: [],
    movies: [],
    library: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  await db.insert(messages).values([messageUser, messageAssistant]);

  const transformStream = new TransformStream({
    start: async (controller) => {
      controller.enqueue(encodeSSE({ type: 'conversation', v: conversation }));
      controller.enqueue(encodeSSE({ type: 'message_done', v: messageUser }));
      controller.enqueue(encodeSSE({ type: 'message_processing', v: messageAssistant }));
    },
    transform: async (chunk: TextStreamPart<ToolSet>, controller) => {
      if (chunk.type === 'text-delta') {
        controller.enqueue(encodeSSE({ type: 'content', v: chunk.text }));
        messageAssistant.content += chunk.text;
        messageAssistant.recommendations = parseRecommendations(
          messageAssistant.content,
          messageAssistant.messageId
        );
      }
      if (chunk.type === 'finish') {
        messageAssistant.status = 'done';
        messageAssistant.recommendations = await Promise.all(
          messageAssistant.recommendations.map(async (recommendation, i) => {
            const found = await tmdbFindMovie(recommendation.title, recommendation.releaseYear.toString());
            if (!found) {
              return recommendation;
            }
            const source = await tmdbGetMovieById(found.id);
            if (!source) {
              return recommendation;
            }

            const movieId = uuidFromString(found.id.toString());
            await db
              .insert(movies)
              .values({ movieId, tmdbId: found.id, tmdb: source, createdAt: new Date() })
              .onConflictDoNothing();

            return {
              ...recommendation,
              movieId,
            };
          })
        );

        await db.insert(recommendations).values(messageAssistant.recommendations);
        await db
          .update(messages)
          .set(messageAssistant)
          .where(eq(messages.messageId, messageAssistant.messageId));

        controller.enqueue(encodeSSE({ type: 'message_done', v: messageAssistant }));
        controller.enqueue(encodeSSE('end'));
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
}

export type ChatSSEData =
  | { type: 'conversation'; v: Conversation }
  | { type: 'message_processing'; v: ConversationMessage }
  | { type: 'message_done'; v: ConversationMessage }
  | { type: 'content'; v: string }
  | { type: 'end' };

const encodeSSE = (data: ChatSSEData | 'end') => {
  if (data === 'end') {
    return new TextEncoder().encode(`event: end\ndata: \n\n`);
  }
  return new TextEncoder().encode(`event: delta\ndata: ${JSON.stringify(data)}\n\n`);
};
