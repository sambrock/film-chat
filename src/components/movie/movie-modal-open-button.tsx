// 'use client';

// export const MovieModalOpenButton = ({ messageId, movieId, library, className, ...props }: Props) => {
//   const { mutate } = useMutationUpdateLibrary(conversationId, messageId);

//   return (
//     <Button
//       className={cn(library?.watchlist)}
//       variant="outline"
//       size="sm"
//       onClick={() => {
//         mutate({ movieId, watchlist: !library?.watchlist });
//       }}
//       {...props}
//     >
//       <Plus className="mr-1 -ml-1 size-4 shrink-0" strokeWidth={2.5} />
//       Add to watchlist
//     </Button>
//   );
// };
