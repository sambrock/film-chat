import { createFileRoute } from '@tanstack/react-router';

import { randomUuid } from '~/lib/utils/uuid';
import { ChatView } from '~/components/views/chat-view';

export const Route = createFileRoute('/')({
  loader: () => {
    return {
      conversationId: randomUuid(),
    };
  },
  component: NewChatPage,
});

function NewChatPage() {
  const { conversationId } = Route.useLoaderData();

  return <ChatView conversationId={conversationId} />;
}
