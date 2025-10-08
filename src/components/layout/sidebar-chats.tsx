'use client';

import { Fragment } from 'react';
import { useLiveQuery } from '@tanstack/react-db';

import { chatsCollection } from '@/lib/collections';
import { SidebarButtonChat } from './sidebar-button-chat';

export const SidebarChats = () => {
  const { data } = useLiveQuery((q) => q.from({ chat: chatsCollection }));

  return (
    <Fragment>
      {data
        ?.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
        .map((chat) => (
          <SidebarButtonChat key={chat.conversationId} conversation={chat} />
        ))}
    </Fragment>
  );
};
