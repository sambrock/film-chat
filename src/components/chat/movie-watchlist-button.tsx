'use client';

import { useRef } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { produce } from 'immer';
import { Check, Plus } from 'lucide-react';

import { api } from '@/infra/convex/_generated/api';
import { Id } from '@/infra/convex/_generated/dataModel';
import { cn } from '@/lib/utils';
import { useSessionContext } from '@/app/session-init';
import { Button } from '../common/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../common/tooltip';

type Props = {
  tmdbId: number;
  title: string;
  releaseDate: number;
  posterPath: string;
} & React.ComponentProps<'button'>;

export const MovieWatchlistButton = ({
  tmdbId,
  title,
  releaseDate,
  posterPath,
  className,
  ...props
}: Props) => {
  const { session } = useSessionContext();

  const watchlist = useQuery(api.watchlist.getBySession, { session });
  const updateWatchlist = useUpdateWatchlistMutation();

  const isInWatchlist = Boolean(watchlist?.find((item) => item.tmdbId === tmdbId));

  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipContent>
          {isInWatchlist && 'Remove from watchlist'}
          {!isInWatchlist && 'Add to watchlist'}
        </TooltipContent>
        <TooltipTrigger asChild>
          <Button
            ref={buttonRef}
            variant={'ghost-2'}
            size="icon"
            className={cn('', className)}
            onClick={(e) => {
              e.stopPropagation();
              updateWatchlist({
                session,
                tmdbId,
                data: { watchlist: !isInWatchlist, title, releaseDate, posterPath },
              });
            }}
            {...props}
          >
            {isInWatchlist ? (
              <Check className="text-primary size-6" strokeWidth={2.5} />
            ) : (
              <Plus className="size-6" strokeWidth={2.5} />
            )}
          </Button>
        </TooltipTrigger>
      </Tooltip>
    </TooltipProvider>
  );
};

const useUpdateWatchlistMutation = () => {
  return useMutation(api.watchlist.updateWatchlist).withOptimisticUpdate((localState, args) => {
    const localStateWatchlist = localState.getQuery(api.watchlist.getBySession, { session: args.session });

    if (localStateWatchlist && Array.isArray(localStateWatchlist)) {
      const exists = localStateWatchlist.find((item) => item.tmdbId === args.tmdbId);
      localState.setQuery(
        api.watchlist.getBySession,
        { session: args.session },
        produce(localStateWatchlist, (draft) => {
          if (exists) {
            const index = draft.indexOf(exists);
            if (args.data.watchlist) {
              draft[index] = { ...exists, ...args.data };
            } else {
              draft.splice(index, 1);
            }
          } else {
            draft.push({
              _id: 'temp-id' as Id<'watchlist'>,
              _creationTime: Date.now(),
              userId: '',
              tmdbId: args.tmdbId,
              title: args.data.title,
              releaseDate: args.data.releaseDate,
              posterPath: args.data.posterPath,
            });
          }
        })
      );
    }
  });
};
