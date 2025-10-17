import { useIsClient } from 'usehooks-ts';

export const ClientOnly = ({
  fallback = null,
  children,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) => {
  const isClient = useIsClient();

  if (!isClient) {
    return <>{fallback}</>;
  }
  return <>{children}</>;
};
