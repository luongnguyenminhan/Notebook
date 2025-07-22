// hooks/useFirstUserCheck.ts
'use client';

import { useQuery } from '@tanstack/react-query';
import { checkIsFirstUser } from '@/services/api/auth';

export function useFirstUserCheck() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['isFirstUser'],
    queryFn: checkIsFirstUser,
    select: (data) => data.is_first_user,
    refetchOnWindowFocus: true,
  });

  return {
    isFirstUser: typeof data === 'boolean' ? data : null,
    loading: isLoading,
    error: error ? (error as Error).message : null,
  };
}
