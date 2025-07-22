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
import { motion } from 'framer-motion';

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
          {t('registerTitle')}
        </h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          {t('registerSubtitle', { defaultValue: 'Sign up to get started.' })}
        </p>
      </div>
      <div className="mb-5">
        <label htmlFor="username" className="block mb-2 font-semibold">
          {t('username')}
        </label>
        <motion.input
          whileFocus={{
            scale: 1.03,
            boxShadow:
              '0 0 0 3px var(--primary-color), 0 4px 16px 0 rgba(0,112,243,0.10)',
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-4 py-3 rounded-2xl shadow-md focus:outline-none transition bg-white/70 dark:bg-white/10 text-[var(--text-color-light)] dark:text-[var(--text-color-dark)] placeholder:text-gray-400 dark:placeholder:text-gray-500 backdrop-blur-sm"
          placeholder={t('username')}
          required
        />
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
      <div className="mb-5">
        <label htmlFor="confirmPassword" className="block mb-2 font-semibold">
          {t('confirmPassword', { defaultValue: 'Confirm Password' })}
        </label>
        <motion.input
          whileFocus={{
            scale: 1.03,
            boxShadow:
              '0 0 0 3px var(--primary-color), 0 4px 16px 0 rgba(0,112,243,0.10)',
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full px-4 py-3 rounded-2xl shadow-md focus:outline-none transition bg-white/70 dark:bg-white/10 text-[var(--text-color-light)] dark:text-[var(--text-color-dark)] placeholder:text-gray-400 dark:placeholder:text-gray-500 backdrop-blur-sm"
          placeholder={t('confirmPassword', {
            defaultValue: 'Confirm Password',
          })}
          required
        />
      </div>
      {(localError || error) && (
        <div className="text-error text-sm mb-2 animate-pulse text-center">
          {localError || error}
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
          {loading
            ? t('registering', { defaultValue: 'Registering...' })
            : t('register', { defaultValue: 'Register' })}
        </Button>
      </motion.div>
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
    </motion.form>
  );
};

export default RegisterForm;
