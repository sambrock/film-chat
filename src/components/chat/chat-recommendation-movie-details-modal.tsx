'use client';

import { useQueryClient } from '@tanstack/react-query';

import { useTRPC } from '@/lib/trpc/client';
import { useGlobalStore } from '@/providers/global-store-provider';
import { MovieDetailsModal } from '../movie/movie-details-modal';
import { MovieDetailsModalHeader } from '../movie/movie-details-modal-header';
import { useChatContext, useChatRecommendationContext } from './chat-context';
import { ChatMovieActionButtonAddToWatchlist } from './chat-movie-actions';

export const ChatRecommendationMovieDetailsModal = () => {
  const { conversationId } = useChatContext();
  const { recommendation, movie } = useChatRecommendationContext();
  const isOpen = useGlobalStore((s) => s.modalOpenRecommendationId === recommendation.recommendationId);
  const dispatch = useGlobalStore((s) => s.dispatch);

  const trpc = useTRPC();
  const queryClient = useQueryClient();

  // const nextPrevMovie = (direction: 'next' | 'prev') => {
  //   const recommendations = queryClient
  //     .getQueryData(trpc.conversationHistory.queryKey({ conversationId }))
  //     ?.filter((m) => m.role === 'assistant')
  //     .map((m) => m.recommendations)
  //     .reverse()
  //     .flat();

  //   if (recommendations) {
  //     const currentIndex = recommendations.findIndex(
  //       (r) => r.recommendationId === recommendation.recommendationId
  //     );

  //     const nextRecommendation = recommendations[currentIndex + 1];
  //     if (nextRecommendation && direction === 'next') {
  //       dispatch({
  //         type: 'OPEN_RECOMMENDATION_MOVIE_MODAL',
  //         payload: { recommendationId: nextRecommendation.recommendationId },
  //       });
  //     }

  //     const prevRecommendation = recommendations[currentIndex - 1];
  //     if (prevRecommendation && direction === 'prev') {
  //       dispatch({
  //         type: 'OPEN_RECOMMENDATION_MOVIE_MODAL',
  //         payload: { recommendationId: prevRecommendation.recommendationId },
  //       });
  //     }
  //   }
  // };

  if (!movie) {
    return null;
  }
  // return (
  //   <MovieDetailsModal
  //     isOpen={isOpen}
  //     movieId={movie.movieId}
  //     initialData={movie}
  //     headerComponent={
  //       <MovieDetailsModalHeader
  //         addToWatchlistButton={<ChatMovieActionButtonAddToWatchlist />}
  //         nextMovie={() => nextPrevMovie('next')}
  //         previousMovie={() => nextPrevMovie('prev')}
  //       />
  //     }
  //   />
  // );
};
