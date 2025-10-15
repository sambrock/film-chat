import { ChatView } from '@/components/views/chat-view';

type Props = {
  params: Promise<{ conversationId: string }>;
};

export default async function ChatPage({ params }: Props) {
  const { conversationId } = await params;

  return <ChatView conversationId={conversationId} isNewChat={false} />;
}
