import { createFileRoute } from '@tanstack/react-router';

import { LibraryPage } from '~/components/library-page/library-page';

export const Route = createFileRoute('/library')({
  component: LibraryRoute,
});

function LibraryRoute() {
  return <LibraryPage />;
}
