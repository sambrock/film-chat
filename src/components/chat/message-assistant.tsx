'use client';

import { useCallback, useLayoutEffect } from 'react';

import { Model, models } from '@/lib/ai/models';
import type { MessageAssistant as MessageAssistantType } from '@/lib/definitions';
import { cn, modelResponseTextToMovies } from '@/lib/utils';
import { SpinnerEllipsis } from '../common/spinner';
import { MessageMovie } from './message-movie';

type Props = { message: MessageAssistantType; scrollToEnd: () => void } & React.ComponentProps<'div'>;

export const MessageAssistant = ({ message, className, scrollToEnd, ...props }: Props) => {
  const getResponseMovies = useCallback(() => {
    if (message.responseMovies && message.responseMovies.length > 0) {
      return message.responseMovies;
    }
    // Pending messages do not have movies yet,
    // but we can derive them partially from the pending content
    if (message.status === 'in_progress') {
      return modelResponseTextToMovies(message.content);
    }
    return [];
  }, [message.movies, message.status, message.content]);

  useLayoutEffect(() => {
    if (message.content && message.status === 'in_progress') {
      scrollToEnd();
    }
  }, [message.content, message.status]);

  return (
    <div className={cn('mb-10', className)} {...props} data-message-id={message.messageId}>
      {message.status === 'in_progress' && getResponseMovies().length === 0 && (
        <SpinnerEllipsis className="text-foreground-1 size-10" />
      )}

      {getResponseMovies().length > 0 && (
        <div className="bg-background-0 overflow-clip rounded-xl">
          {getResponseMovies().map((responseMovie, index) => (
            <MessageMovie
              key={index}
              responseMovie={responseMovie}
              movie={message.movies.find((movie) => movie.tmdbId === responseMovie.tmdbId)}
            />
          ))}
        </div>
      )}

      <div
        className={cn(
          'text-foreground-1 mt-4 flex px-2 text-xs',
          message.status === 'done' ? 'visible' : 'invisible'
        )}
        {...props}
      >
        <span className="font-medium">{models.get(message.model as Model)?.name}</span>
      </div>
    </div>
  );
};
