import { useQueryGetChats } from '~/hooks/use-query-get-chats';
import { SidebarButtonChat } from './sidebar-button-chat';

export const SidebarChats = () => {
  const { data } = useQueryGetChats();

  return (
    <>
      {data
        ?.sort((a, b) => b.lastUpdateAt.getTime() - a.lastUpdateAt.getTime())
        .map((chat) => (
          <SidebarButtonChat key={chat.conversationId} conversation={chat} />
        ))}
    </>
  );
};
