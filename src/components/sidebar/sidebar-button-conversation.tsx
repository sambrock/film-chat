'use client';

import { Conversation } from '@/lib/definitions';
import { SidebarButton } from './sidebar-button';

type Props = {
  conversation: Conversation;
};

export const SidebarButtonConversation = ({ conversation }: Props) => {
  return (
    <SidebarButton className="w-full gap-2" href={`/c/${conversation.conversationId}`} asChild>
      {conversation.title}
    </SidebarButton>
  );
};
