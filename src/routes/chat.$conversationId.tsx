import { createFileRoute } from '@tanstack/react-router';

import { ChatView } from '~/components/views/chat-view';

export const Route = createFileRoute('/chat/$conversationId')({
  component: ChatPage,
});

function ChatPage() {
  const { conversationId } = Route.useParams();

  return <ChatView conversationId={conversationId} />;
}
