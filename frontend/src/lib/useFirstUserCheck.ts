import { useEffect, useState } from 'react';
import { checkIsFirstUser } from '@/api/authApi';

export function useFirstUserCheck() {
  const [isFirstUser, setIsFirstUser] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    checkIsFirstUser()
      .then((res) => {
        if (mounted) setIsFirstUser(res.is_first_user);
      })
      .catch((err) => {
        console.log(err)
        if (mounted) setError('Failed to check user status');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  return { isFirstUser, loading, error };
} 