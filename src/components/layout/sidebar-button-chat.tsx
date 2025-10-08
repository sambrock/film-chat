'use client';

import { Ellipsis, Pencil, Trash2 } from 'lucide-react';

import type { Conversation } from '@/lib/definitions';
import { cn, timeAgo } from '@/lib/utils';
import { useGlobalStore } from '@/providers/global-store-provider';
import { Button } from '../common/button';
import { DropdownContent, DropdownItem, DropdownRoot, DropdownTrigger } from '../common/dropdown';
import { Icon } from '../common/icon';
import { SpinnerEllipsis } from '../common/spinner';
import { SidebarButton } from './sidebar-button';

type Props = {
  conversation: Conversation;
};

export const SidebarButtonChat = ({ conversation }: Props) => {
  const isProcessing = useGlobalStore((s) => s.isProcessing.has(conversation.conversationId));

  return (
    <div className="group relative flex items-center">
      <SidebarButton
        className="group-hover:bg-foreground-0/5 group-focus-within:bg-foreground-0/5 w-full gap-2"
        href={`/c/${conversation.conversationId}`}
        asChild
      >
        {conversation.title}
      </SidebarButton>

      {isProcessing && <SpinnerEllipsis className="absolute right-4 size-5" />}

      <DropdownRoot>
        <DropdownTrigger asChild disabled={isProcessing}>
          <Button
            variant="transparent"
            className={cn(
              'absolute top-0 right-2 -mr-2 ml-auto text-sm opacity-0 transition group-focus-within:opacity-100 group-hover:opacity-100',
              isProcessing && 'hidden'
            )}
            size="icon"
          >
            <Icon icon={Ellipsis} />
          </Button>
        </DropdownTrigger>

        <DropdownContent className="min-w-60 origin-top-left" align="start" side="bottom" sideOffset={2}>
          <div className="text-foreground-1 my-1 px-2 text-xs font-medium select-none">Chat</div>

          <DropdownItem>
            <Icon icon={Pencil} size="xs" />
            <div className="text-sm font-medium">Rename</div>
          </DropdownItem>
          <DropdownItem
          // onClick={() => deleteConversationMutation.mutate({ conversationId: conversation.conversationId })}
          >
            <Icon icon={Trash2} className="text-red-400" size="xs" />
            <div className="text-sm font-medium text-red-400">Delete</div>
          </DropdownItem>

          <hr className="bg-foreground-0/5 border-foreground-0/5 mx-2 my-1 h-px"></hr>

          <div className="text-foreground-2 px-2 py-1 text-xs select-none">
            Created {conversation.createdAt && timeAgo(conversation.createdAt)}
          </div>
        </DropdownContent>
      </DropdownRoot>
    </div>
  );
};
