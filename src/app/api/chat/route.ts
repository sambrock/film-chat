import { generateText, streamText, TextStreamPart, ToolSet } from 'ai';
import { eq } from 'drizzle-orm';
import { produce } from 'immer';
import z from 'zod';

import { getGenerateThreadTitleModel, getStreamTextModel, SYSTEM_CONTEXT_MESSAGE } from '@/lib/ai/get-model';
import { auth } from '@/lib/auth/server';
import { MessageAssistant, MessageUser, Movie } from '@/lib/definitions';
import { db } from '@/lib/drizzle/db';
import { messageMovies, messages, movies, threads } from '@/lib/drizzle/schema';
import { tmdbFindMovie, tmdbGetMovieById } from '@/lib/tmdb/client';
import { generateUuid, modelResponseTextToMovies } from '@/lib/utils';

const BodySchema = z.object({
  threadId: z.string(),
  content: z.string(),
  model: z.string(),
});

export type ChatBodySchema = z.infer<typeof BodySchema>;

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

  const { content } = parsed.data;
  let { threadId } = parsed.data;

  const batch: any[] = [];

  const threadExists = !!threadId; // If empty, create new thread

  if (!threadExists) {
    threadId = generateUuid();
    await db.insert(threads).values({
      threadId,
      userId: session.user.id,
      title: '',
    });
  }

  const messageUser: MessageUser = {
    messageId: generateUuid(),
    threadId,
    content,
    model: parsed.data.model,
    status: 'done',
    role: 'user',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const messageAssistant: MessageAssistant = {
    messageId: generateUuid(),
    threadId,
    parentId: messageUser.messageId,
    content: '',
    model: parsed.data.model,
    role: 'assistant',
    status: 'in_progress',
    movies: [],
    responseMovies: [],
    library: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  batch.push(db.insert(messages).values([messageUser, messageAssistant]));

  const threadMessages = threadExists
    ? await db.query.messages.findMany({
        where: (messages, { eq }) => eq(messages.threadId, threadId!),
        orderBy: (messages, { asc }) => [asc(messages.serial)],
      })
    : [];

  const modelStream = streamText({
    model: getStreamTextModel(parsed.data.model),
    messages: [
      { role: 'system', content: SYSTEM_CONTEXT_MESSAGE },
      ...threadMessages.map((m) => ({ role: m.role, content: m.content })),
      { role: 'user', content: content },
    ],
  });

  const transformStream = new TransformStream({
    start(controller) {
      controller.enqueue(encodeSSE({ type: 'thread', threadId }));
      controller.enqueue(encodeSSE({ type: 'message', message: messageUser, threadId }));
      controller.enqueue(encodeSSE({ type: 'message', message: messageAssistant, threadId }));
    },
    async transform(chunk: TextStreamPart<ToolSet>, controller) {
      switch (chunk.type) {
        case 'text-delta': {
          controller.enqueue(
            encodeSSE({ type: 'content', v: chunk.text, threadId, messageId: messageAssistant.messageId })
          );
          messageAssistant.content += chunk.text;
          messageAssistant.responseMovies = modelResponseTextToMovies(messageAssistant.content);
          break;
        }
        case 'finish': {
          await Promise.all(
            messageAssistant.responseMovies.map(async (responseMovie, i) => {
              const found = await tmdbFindMovie(responseMovie.title, responseMovie.releaseYear.toString());
              if (!found) {
                messageAssistant.responseMovies = produce(messageAssistant.responseMovies, (draft) => {
                  draft[i].found = false;
                });
                return;
              }

              const source = await tmdbGetMovieById(found.id);
              if (!source) {
                messageAssistant.responseMovies = produce(messageAssistant.responseMovies, (draft) => {
                  draft[i].found = false;
                });
                return;
              }

              messageAssistant.responseMovies = produce(messageAssistant.responseMovies, (draft) => {
                draft[i].found = true;
                draft[i].tmdbId = found.id;
              });

              const movie: Movie = {
                movieId: found.id,
                tmdbId: found.id,
                source: source,
                createdAt: new Date(),
              };

              batch.push(
                db.insert(movies).values(movie).onConflictDoNothing(),
                db
                  .insert(messageMovies)
                  .values({ messageId: messageAssistant.messageId, movieId: found.id })
                  .onConflictDoNothing()
              );

              controller.enqueue(encodeSSE({ type: 'movie', movie, threadId }));
            })
          );

          console.log('updated final', messageAssistant.responseMovies);

          batch.push(
            db
              .update(messages)
              .set({
                content: messageAssistant.content,
                responseMovies: messageAssistant.responseMovies,
                status: 'done',
              })
              .where(eq(messages.messageId, messageAssistant.messageId))
          );

          if (!threadExists) {
            const result = await generateText({
              model: getGenerateThreadTitleModel(),
              prompt: `Generate a short title for this prompt in 3 words or less (don't use the word "movie"): "Movie picks for prompt: ${content}"`,
            });

            const textContent = result.content.find((c) => c.type === 'text');
            if (!textContent) return;

            batch.push(
              db.update(threads).set({ title: textContent.text }).where(eq(threads.threadId, threadId))
            );
          }

          for (const op of batch) {
            await op;
          }
        }
        default: {
          break;
        }
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

export type ChatSSE =
  | { type: 'content'; v: string; threadId: string; messageId: string }
  | { type: 'thread'; threadId: string }
  | { type: 'message'; message: MessageUser | MessageAssistant; threadId: string }
  | { type: 'movie'; movie: Movie; threadId: string }
  | { type: 'end' };

const encodeSSE = (data: ChatSSE | 'end') => {
  if (data === 'end') {
    return new TextEncoder().encode(`event: end\ndata: \n\n`);
  }
  return new TextEncoder().encode(`event: delta\ndata: ${JSON.stringify(data)}\n\n`);
};
