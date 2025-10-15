// 'use client';

// import { eq, useLiveQuery } from '@tanstack/react-db';

// import { backdropSrc, genreName, posterSrc, runtimeToHoursMins } from '~/lib/utils';
// import { useGlobalStore } from '~/providers/global-store-provider';
// import { Modal, ModalContentDrawer, ModalDescription, ModalTitle } from '../common/modal';
// import { MovieDetailsCast, MovieDetailsCrew } from './movie-details-credits';

// // import { MovieDetailsModalHeader } from './movie-details-modal-header';

// export const MovieDetailsModal = () => {
//   const modal = useGlobalStore((s) => s.movieModal);
//   const dispatch = useGlobalStore((s) => s.dispatch);

//   // const movieData = useLiveQuery(
//   //   (q) =>
//   //     q
//   //       .from({ movie: moviesCollection })
//   //       .where(({ movie }) => eq(movie.movieId, modal?.movieId))
//   //       .findOne(),
//   //   [modal?.movieId]
//   // );

//   if (!modal || !movieData.data) {
//     return null;
//   }
//   return (
//     <Modal
//       open={modal.isOpen}
//       onOpenChange={(open) => !open && dispatch({ type: 'CLOSE_MOVIE_MODAL', payload: undefined })}
//     >
//       <ModalContentDrawer shouldAnimate={modal.shouldAnimate}>
//         <ModalTitle className="sr-only">{movieData.data.tmdb.title}</ModalTitle>
//         <ModalDescription className="sr-only">{movieData.data.tmdb.overview}</ModalDescription>

//         {/* <MovieDetailsModalHeader movieId={modal.movieId} /> */}

//         <div className="-mt-12 mb-12 flex flex-col">
//           <div className="bg-background-1 relative h-[430px] overflow-clip">
//             <img className="" src={backdropSrc(movieData.data.tmdb.backdrop_path!, 'w1280')} />
//             <div className="to-background-0 absolute inset-0 z-10 bg-gradient-to-b from-transparent" />
//           </div>

//           <div className="relative z-10 -mt-58 grid grid-cols-[1fr_160px] gap-x-4 px-10">
//             <div className="flex flex-col gap-2">
//               <h1 className="mt-auto text-4xl font-black">
//                 {movieData.data.tmdb.title}{' '}
//                 <span className="text-foreground-1 ml-2 text-sm font-medium">
//                   {new Date(movieData.data.tmdb.release_date!).getFullYear()}
//                 </span>
//               </h1>
//               <div className="text-foreground-1 flex gap-3 text-xs font-medium">
//                 <span>{runtimeToHoursMins(movieData.data.tmdb.runtime)}</span>
//                 <span>{movieData.data.tmdb.genres?.map((genre) => genreName(genre.name!)).join(', ')}</span>
//               </div>
//             </div>
//             <div className="overflow-clip rounded-md">
//               <img src={posterSrc(movieData.data.tmdb.poster_path!, 'w185')} />
//             </div>

//             <div className="col-span-2 mt-6">
//               <div className="text-foreground-0/80 mr-8 text-sm leading-6">
//                 {movieData.data.tmdb.tagline && (
//                   <span className="text-foreground-0/80 mr-2 mb-2 text-sm leading-6 font-medium italic">
//                     {movieData.data.tmdb.tagline}
//                   </span>
//                 )}
//                 {movieData.data.tmdb.overview}
//               </div>

//               <h2 className="text-foreground-1 mt-12 mb-4 text-sm font-medium">Crew</h2>
//               <MovieDetailsCrew movieId={modal.movieId} />

//               <h2 className="text-foreground-1 mt-6 mb-4 text-sm font-medium">Cast</h2>
//               <MovieDetailsCast movieId={modal.movieId} />
//             </div>
//           </div>
//         </div>
//       </ModalContentDrawer>
//     </Modal>
//   );
// };
