import { Suspense } from 'react';

export default function Layout(props: React.PropsWithChildren) {
  return (
    <Suspense>
      {props.children}
    </Suspense>
  )
}