// components/auth/LoginForm.tsx
'use client';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { RootState, AppDispatch } from '@/store/index';
import { loginAsync } from '@/store/slices/authSlice';
import Button from '@/components/ui/Button';
import { useTranslations } from 'next-intl';

const LoginForm = () => {
  const t = useTranslations('Auth');
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { loading, error, isAuthenticated } = useSelector(
    (state: RootState) => state.auth,
  );

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await dispatch(loginAsync({ email, password }));
  };

  React.useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-sm mx-auto">
      <div className='bg-red'>
        <h1>LOGIN</h1>
      </div>
      <div>
        <label htmlFor="email" className="block mb-1 font-medium">
          {t('email')}
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          style={{
            color: 'var(--text-color-light)',
            background: 'var(--input-bg-light)',
            borderColor: 'var(--input-border-light)',
          }}
          required
        />
      </div>
      <div>
        <label htmlFor="password" className="block mb-1 font-medium">
          {t('password')}
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          style={{
            color: 'var(--text-color-light)',
            background: 'var(--input-bg-light)',
            borderColor: 'var(--input-border-light)',
          }}
          required
        />
      </div>
      {error && <div className="text-error text-sm">{error}</div>}
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? t('loggingIn') : t('login')}
      </Button>
    </form>
  );
};

export default LoginForm;
