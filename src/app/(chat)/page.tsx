import { randomUuid } from '@/lib/utils/uuid';
import { ChatView } from '@/components/views/chat-view';

export default function NewChatPage() {
  return <ChatView conversationId={randomUuid()} isNewChat={true} />;
}
