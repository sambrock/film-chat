import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: NewChatPage,
});

function NewChatPage() {
  return <div>New Page</div>;
}
