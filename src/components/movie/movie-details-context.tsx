import type { Movie } from '@/lib/definitions';
import { createContextFactory } from '@/lib/utils/create-context-factory';

export const [MovieDetailsContext, useMovieDetailsContext] = createContextFactory<{
  movie: Movie;
}>('MovieDetailsContext');
