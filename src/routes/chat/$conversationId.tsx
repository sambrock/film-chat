import { createFileRoute } from '@tanstack/react-router';

import { ChatPage } from '~/components/chat-page/chat-page';

export const Route = createFileRoute('/chat/$conversationId')({
  component: ChatRoute,
});

const { useParams } = Route;

function ChatRoute() {
  const { conversationId } = useParams();

  return <ChatPage conversationId={conversationId} />;
}
