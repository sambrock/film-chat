import { useQuery } from '@tanstack/react-query';

import { trpc } from '../trpc';

export const useUserInfo = () => {
  return useQuery({
    queryKey: ['user'],
    queryFn: () => trpc.getUserInfo.query(),
  });
};
