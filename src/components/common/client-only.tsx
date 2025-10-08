'use client';

import { useIsClient } from 'usehooks-ts';

export const ClientOnly = ({ children }: { children: React.ReactNode }) => {
  const isClient = useIsClient();

  if (!isClient) {
    return null;
  }
  return <>{children}</>;
};
