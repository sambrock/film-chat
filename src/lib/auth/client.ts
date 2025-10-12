import { anonymousClient } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';

export const { signIn, signUp, useSession, getSession } = createAuthClient({
  plugins: [anonymousClient()],
});
