'use client';

import { useQueryClient } from '@tanstack/react-query';
import { PanelRight, Plus } from 'lucide-react';

import { useTRPC } from '@/lib/trpc/client';
import { cn } from '@/lib/utils';
import { useGlobalStore } from '@/providers/global-store-provider';
import { Button, ButtonProps } from '../common/button';
import { Icon } from '../common/icon';
import { useChatContext, useChatMessageContext, useChatRecommendationContext } from './chat-context';

type Props = ButtonProps;

export const ChatMovieActionButtonAddToWatchlist = ({ className, ...props }: Props) => {
  const { conversationId } = useChatContext();
  const { message } = useChatMessageContext();
  const { movie, library } = useChatRecommendationContext();

  const trpc = useTRPC();
  const queryClient = useQueryClient();

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

export const ChatMovieActionButtonOpen = ({ className, ...props }: Props) => {
  const dispatch = useGlobalStore((s) => s.dispatch);
  const { recommendation, movie } = useChatRecommendationContext();

  const handleClick = () => {
    if (!movie) return;
    dispatch({
      type: 'OPEN_RECOMMENDATION_MOVIE_MODAL',
      payload: { recommendationId: recommendation.recommendationId },
    });
  };

  return (
    <Button className={cn(className, '!rounded-full')} size="sm" onClick={handleClick} {...props}>
      <Icon icon={PanelRight} size="xs" className="mr-1 -ml-1" />
      Open
    </Button>
  );
};
