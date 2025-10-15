import { createFileRoute } from '@tanstack/react-router';

import { getChatMessages } from '~/server/functions/get-chat-messages';
import { ChatView } from '~/components/views/chat-view';

export const Route = createFileRoute('/c/$conversationId')({
  component: ChatPage,
  // loader: ({ context, params }) => {
  //   const { conversationId } = params;
  //   return getChatMessages({ data: { conversationId } });
  // },
});

function ChatPage() {
  const { conversationId } = Route.useParams();

  return <ChatView conversationId={conversationId} />;
}
