import { createFileRoute } from '@tanstack/react-router';

import { uuidV4 } from '~/lib/utils';
import { ChatPage } from '~/components/chat-page/chat-page';

export const Route = createFileRoute('/')({
  loader: () => {
    return {
      conversationId: uuidV4(),
    };
  },
  component: NewChatRoute,
});

const { useLoaderData } = Route;

function NewChatRoute() {
  const { conversationId } = useLoaderData();

  return <ChatPage conversationId={conversationId} />;
}
