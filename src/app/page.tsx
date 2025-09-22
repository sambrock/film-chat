import { generateUuid } from '@/lib/utils';
import { ChatPageComponent } from './chat/[thread_id]/page';

export default function NewChatPage() {
  const threadId = generateUuid();

  return <ChatPageComponent threadId={threadId} isPersisted={false} initialData={[]} />;
}
