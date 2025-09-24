'use client';

import { useEffect, useRef } from 'react';

import { signIn } from '@/lib/auth/client';

type Props = {
  shouldSignInAnonymously?: boolean;
};

export const SessionInit = ({ shouldSignInAnonymously }: Props) => {
  const signInCalledRef = useRef(false);

  useEffect(() => {
    if (!shouldSignInAnonymously) return;
    if (signInCalledRef.current) return;
    signInCalledRef.current = true;
    signIn.anonymous();
  }, []);

  return null;
};
