// 'use client';

// import { Plus } from 'lucide-react';

// import type { Library } from '@/lib/definitions';
// import { cn } from '@/lib/utils';
// import { useConversationContext } from '@/providers/conversation-context-provider';
// import { useMutationUpdateLibrary } from '@/hooks/use-mutation-update-library';
// import { Button, ButtonProps } from '../common/button';

// type Props = { messageId: string; movieId: string; library?: Library } & ButtonProps;

// export const LibraryButtonWatchlist = ({ messageId, movieId, library, className, ...props }: Props) => {
//   const { conversationId } = useConversationContext();
//   const { mutate } = useMutationUpdateLibrary(conversationId, messageId);

//   return (
//     <Button
//       className={cn(library?.watchlist, className)}
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

// // export const LibraryButtonWatched = ({ messageId, movieId, library, className, ...props }: Props) => {
// //   const { conversationId } = useConversationContext();
// //   const { mutate } = useMutationUpdateLibrary(conversationId, messageId);

// //   return (
// //     <Button
// //       className={cn('!text-foreground-0/30', library?.watched && '!text-primary/50', className)}
// //       size="sm"
// //       onClick={() => {
// //         mutate({ movieId, watched: !library?.watched });
// //       }}
// //       {...props}
// //     >
// //       <Eye className="size-4.5 shrink-0" />
// //     </Button>
// //   );
// // };

// // export const LibraryButtonLike = ({ messageId, movieId, library, className, ...props }: Props) => {
// //   const { conversationId } = useConversationContext();
// //   const { mutate } = useMutationUpdateLibrary(conversationId, messageId);

// //   return (
// //     <Button
// //       className={cn('!text-foreground-0/30', library?.liked && '!text-primary/50', className)}
// //       size="sm"
// //       onClick={() => {
// //         mutate({ movieId, liked: !library?.liked });
// //       }}
// //       {...props}
// //     >
// //       <Heart className="size-4.5 shrink-0" />
// //     </Button>
// //   );
// // };
