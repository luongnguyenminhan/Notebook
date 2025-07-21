// components/auth/RegisterForm.tsx
'use client';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { RootState } from '@/store/index';
import { register } from '@/services/api/auth';
import Button from '@/components/ui/Button';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

const RegisterForm = () => {
  const t = useTranslations('Auth');
  const router = useRouter();
  const { loading, error, isAuthenticated } = useSelector(
    (state: RootState) => state.auth,
  );

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    if (password !== confirmPassword) {
      setLocalError(t('passwordMismatch'));
      return;
    }
    try {
      await register({ username, email, password });
      router.push('/');
    } catch (err: any) {
      setLocalError(err?.response?.data?.detail || 'Registration failed');
    }
  };

  React.useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-sm mx-auto">
      <div className="mb-6 text-center">
        <h1
          className="text-2xl font-bold"
          style={{ color: 'var(--text-color-light)' }}
        >
          {t('registerTitle')}
        </h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          {t('registerSubtitle', { defaultValue: 'Sign up to get started.' })}
        </p>
      </div>
      <div>
        <label htmlFor="username" className="block mb-1 font-medium">
          {t('username')}
        </label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
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
      <div>
        <label htmlFor="confirmPassword" className="block mb-1 font-medium">
          {t('confirmPassword', { defaultValue: 'Confirm Password' })}
        </label>
        <input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          style={{
            color: 'var(--text-color-light)',
            background: 'var(--input-bg-light)',
            borderColor: 'var(--input-border-light)',
          }}
          required
        />
      </div>
      {(localError || error) && (
        <div className="text-error text-sm">{localError || error}</div>
      )}
      <Button type="submit" disabled={loading} className="w-full">
        {loading
          ? t('registering', { defaultValue: 'Registering...' })
          : t('register', { defaultValue: 'Register' })}
      </Button>
      <div className="mt-4 text-center">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {t('haveAccount', { defaultValue: 'Already have an account?' })}{' '}
        </span>
        <Link
          href="/auth"
          className="text-blue-600 hover:underline dark:text-blue-400"
        >
          {t('login', { defaultValue: 'Login' })}
        </Link>
      </div>
    </form>
  );
};

export default RegisterForm;
