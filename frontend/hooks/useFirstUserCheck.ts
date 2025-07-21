// hooks/useFirstUserCheck.ts
'use client';
import { useEffect, useState } from 'react';
import { checkIsFirstUser } from '@/services/api/auth';

export function useFirstUserCheck() {
  const [isFirstUser, setIsFirstUser] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFirstUser() {
      setLoading(true);
      try {
        const result = await checkIsFirstUser();
        setIsFirstUser(result.is_first_user);
        setError(null);
      } catch (err: any) {
        setError(err?.message || 'Failed to check first user');
        setIsFirstUser(false);
      } finally {
        setLoading(false);
      }
    }
    fetchFirstUser();
  }, []);

  return { isFirstUser, loading, error };
}
