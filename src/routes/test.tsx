import { createFileRoute } from '@tanstack/react-router';

import { Button } from '~/components/ui/button';

export const Route = createFileRoute('/test')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="p-12 space-y-4">
      <Button>GPT-4</Button>
      <Button pill>GPT-4</Button>
    </div>
  );
}
