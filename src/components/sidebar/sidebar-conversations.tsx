'use client';

import { Fragment } from 'react';

import { useQueryConversations } from '@/hooks/use-query-conversations';
import { SidebarButtonConversation } from './sidebar-button-conversation';

export const SidebarConversations = () => {
  const { data } = useQueryConversations();

  return (
    <Fragment>
      {data?.map((conversation) => (
        <SidebarButtonConversation key={conversation.conversationId} conversation={conversation} />
      ))}
    </Fragment>
  );
};
