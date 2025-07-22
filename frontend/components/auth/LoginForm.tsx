'use client';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { RootState, AppDispatch } from '@/store/index';
import { loginAsync } from '@/store/slices/authSlice';
import Button from '@/components/ui/Button';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { motion } from 'framer-motion';

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
    const result = await dispatch(loginAsync({ email, password }));
    // Save token to cookie if login successful
    if (result.type === 'auth/login/fulfilled' && result.payload) {
      document.cookie = `token=${result.payload}; path=/; secure; samesite=strict`;
    }
  };

  React.useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  return (
    <motion.form
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      onSubmit={handleSubmit}
      className="max-w-lg min-w-md mx-auto mt-10 p-8 rounded-3xl shadow-2xl bg-[var(--input-bg-light)]/80 dark:bg-[var(--input-bg-dark)]/80 text-[var(--text-color-light)] dark:text-[var(--text-color-dark)] relative backdrop-blur-md transition-all duration-300"
      style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)' }}
    >
      <div className="mb-6 text-center">
        <h1
          className="text-3xl font-extrabold mb-2 tracking-tight drop-shadow-md"
          style={{ color: 'var(--primary-color)' }}
        >
          {t('loginTitle', { defaultValue: 'Login to your account' })}
        </h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          {t('loginSubtitle', {
            defaultValue: 'Welcome back! Please enter your credentials.',
          })}
        </p>
      </div>
      <div className="mb-5">
        <label htmlFor="email" className="block mb-2 font-semibold">
          {t('email')}
        </label>
        <motion.input
          whileFocus={{
            scale: 1.03,
            boxShadow:
              '0 0 0 3px var(--primary-color), 0 4px 16px 0 rgba(0,112,243,0.10)',
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 rounded-2xl shadow-md focus:outline-none transition bg-white/70 dark:bg-white/10 text-[var(--text-color-light)] dark:text-[var(--text-color-dark)] placeholder:text-gray-400 dark:placeholder:text-gray-500 backdrop-blur-sm"
          placeholder={t('email')}
          required
        />
      </div>
      <div className="mb-5">
        <label htmlFor="password" className="block mb-2 font-semibold">
          {t('password')}
        </label>
        <motion.input
          whileFocus={{
            scale: 1.03,
            boxShadow:
              '0 0 0 3px var(--primary-color), 0 4px 16px 0 rgba(0,112,243,0.10)',
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 rounded-2xl shadow-md focus:outline-none transition bg-white/70 dark:bg-white/10 text-[var(--text-color-light)] dark:text-[var(--text-color-dark)] placeholder:text-gray-400 dark:placeholder:text-gray-500 backdrop-blur-sm"
          placeholder={t('password')}
          required
        />
      </div>
      {error && (
        <div className="text-error text-sm mb-2 animate-pulse text-center">
          {error}
        </div>
      )}
      <motion.div
        whileHover={{
          scale: 1.04,
          boxShadow: '0 6px 24px 0 rgba(0,112,243,0.18)',
        }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <Button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 rounded-2xl font-bold text-lg shadow-xl bg-[var(--primary-color)] text-white hover:brightness-110 hover:scale-[1.02] active:scale-95 transition-all duration-200 border-none drop-shadow-lg"
          style={{ boxShadow: '0 4px 16px 0 rgba(0,112,243,0.18)' }}
        >
          {loading ? t('loggingIn') : t('login')}
        </Button>
      </motion.div>
      <div className="mt-4 text-center">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {t('noAccount')}{' '}
        </span>
        <Link
          href="/auth/register"
          className="text-blue-600 hover:underline dark:text-blue-400"
        >
          {t('register')}
        </Link>
      </div>
    </motion.form>
  );
};

export default LoginForm;
