'use client';

import { Ellipsis, Pencil, Trash2 } from 'lucide-react';

import { cn, timeAgo } from '@/lib/utils';
import { useConversationContext } from '@/providers/conversation-context-provider';
import { useGlobalStore } from '@/providers/global-store-provider';
import { useMutationDeleteConversation } from '@/hooks/use-mutation-delete-conversation';
import { useQueryConversation } from '@/hooks/use-query-conversation';
import { Button } from '../common/button';
import { DropdownContent, DropdownItem, DropdownRoot, DropdownTrigger } from '../common/dropdown';
import { Header } from './header';

export const HeaderChat = () => {
  const { conversationId } = useConversationContext();

  const { data } = useQueryConversation(conversationId);
  const deleteConversationMutation = useMutationDeleteConversation();

  const isProcessing = useGlobalStore((s) => s.isProcessing.has(conversationId));

  return (
    <Header className="group">
      <div className="text-foreground-0/70 text-sm font-medium">{data?.title}</div>
      <div className="text-foreground-1 text-xs font-medium">{data?.moviesCount} films</div>

      <div className="text-foreground-2 ml-auto text-xs font-medium">
        Updated {data?.updatedAt && timeAgo(data.updatedAt)}
      </div>

      <DropdownRoot>
        <DropdownTrigger asChild disabled={isProcessing}>
          <Button className={cn('text-sm', isProcessing && 'hidden')} size="icon">
            <Ellipsis className="size-5" />
          </Button>
        </DropdownTrigger>

        <DropdownContent className="min-w-60 origin-top-left" align="end" side="bottom" sideOffset={2}>
          <div className="text-foreground-1 my-1 px-2 text-xs font-medium select-none">Chat</div>

          <DropdownItem>
            <Pencil className="size-4" strokeWidth={2} />
            <div className="text-sm font-medium">Rename</div>
          </DropdownItem>
          <DropdownItem onClick={() => deleteConversationMutation.mutate({ conversationId })}>
            <Trash2 className="size-4 text-red-400" strokeWidth={2} />
            <div className="text-sm font-medium text-red-400">Delete</div>
          </DropdownItem>

          <hr className="bg-foreground-0/5 border-foreground-0/5 mx-2 my-1 h-px"></hr>

          <div className="text-foreground-2 px-2 py-1 text-xs select-none">
            Created {data?.createdAt && timeAgo(data.createdAt)}
          </div>
        </DropdownContent>
      </DropdownRoot>
    </Header>
  );
};
