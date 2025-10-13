import { getQueryClient } from '@/lib/trpc/ssr';

export default async function Layout(props: React.PropsWithChildren) {
  return <>{props.children}</>;
}
