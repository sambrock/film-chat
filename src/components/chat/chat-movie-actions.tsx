'use client';

import { PanelRight, Plus } from 'lucide-react';

import { Movie } from '@/lib/definitions';
import { cn } from '@/lib/utils';
import { useGlobalStore } from '@/providers/global-store-provider';
import { Button, ButtonProps } from '../common/button';
import { Icon } from '../common/icon';
import { useChatRecommendationContext } from './chat-context';

type Props = { movie: Movie } & ButtonProps;

export const ChatMovieActionButtonAddToWatchlist = ({ movie, className, ...props }: Props) => {
  if (!movie) return null;
  return (
    <Button className={cn(className, '!rounded-full')} size="sm" {...props}>
      <Icon icon={Plus} size="xs" className="mr-1 -ml-1" />
      Add to watchlist
    </Button>
  );
  // return (
  //   <LibraryButtonAddToWatchlist
  //     movieId={movie.movieId}
  //     watchlist={library?.watchlist ?? false}
  //     // onMutate={() => {
  //     //   queryClient.setQueryData(trpc.conversationHistory.queryKey({ conversationId }), (state) =>
  //     //     produce(state, (draft) => {
  //     //       const draftMessage = draft?.find((m) => m.messageId === message.messageId);
  //     //       if (draftMessage && draftMessage.role === 'assistant') {
  //     //         const library = draftMessage.library.find((l) => l.movieId === movie.movieId);
  //     //         if (library) {
  //     //           library.watchlist = !library.watchlist;
  //     //         } else {
  //     //           draftMessage.library.push({
  //     //             userId: '',
  //     //             movieId: movie.movieId,
  //     //             watchlist: true,
  //     //             liked: false,
  //     //             watched: false,
  //     //             ignore: false,
  //     //             createdAt: new Date(),
  //     //             updatedAt: new Date(),
  //     //           });
  //     //         }
  //     //       }
  //     //     })
  //     //   );
  //     // }}
  //     {...props}
  //   />
  // );
};

