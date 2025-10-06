'use client';

import { Fragment } from 'react';

import { useQueryConversations } from '@/hooks/use-query-conversations';
import { SidebarButtonChat } from './sidebar-button-chat';

export const SidebarChats = () => {
  const { data } = useQueryConversations();

  return (
    <Fragment>
      {data?.map((conversation) => (
        <SidebarButtonChat key={conversation.conversationId} conversation={conversation} />
      ))}
    </Fragment>
  );
};
