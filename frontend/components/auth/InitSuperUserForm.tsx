'use client';
import React, { useState } from 'react';
import Button from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { initSuperUser } from '@/services/api/auth';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

interface InitSuperUserFormProps {
  onSuccess?: () => void;
}

const InitSuperUserForm: React.FC<InitSuperUserFormProps> = ({ onSuccess }) => {
  const t = useTranslations('InitSuperUser');
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    if (form.password !== form.confirmPassword) {
      setError(
        t('passwordsNoMatch', { defaultValue: 'Passwords do not match' }),
      );
      return;
    }
    setLoading(true);
    try {
      await initSuperUser({
        username: form.username,
        email: form.email,
        password: form.password,
      });
      setSuccess(true);
      setTimeout(() => {
        window.location.reload();
      }, 1200); // Đợi 1 chút cho user thấy success
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          t('createFailed', { defaultValue: 'Failed to create superuser' }),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="max-w-lg min-w-md mx-auto mt-10 p-8 rounded-3xl shadow-2xl bg-[var(--input-bg-light)]/80 dark:bg-[var(--input-bg-dark)]/80 text-[var(--text-color-light)] dark:text-[var(--text-color-dark)] relative backdrop-blur-md transition-all duration-300"
      style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)' }}
      onSubmit={handleSubmit}
    >
      <h2
        className="text-3xl font-extrabold mb-6 text-center tracking-tight drop-shadow-md"
        style={{ color: 'var(--primary-color)' }}
      >
        {t('title')}
      </h2>
      <div className="mb-5">
        <label className="block mb-2 font-semibold" htmlFor="username">
          {t('username', { defaultValue: 'Username' })}
        </label>
        <motion.input
          whileFocus={{
            scale: 1.03,
            boxShadow:
              '0 0 0 3px var(--primary-color), 0 4px 16px 0 rgba(0,112,243,0.10)',
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          type="text"
          name="username"
          id="username"
          value={form.username}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 rounded-2xl shadow-md focus:outline-none transition bg-white/70 dark:bg-white/10 text-[var(--text-color-light)] dark:text-[var(--text-color-dark)] placeholder:text-gray-400 dark:placeholder:text-gray-500 backdrop-blur-sm"
          placeholder={t('username', { defaultValue: 'Username' })}
        />
      </div>
      <div className="mb-5">
        <label className="block mb-2 font-semibold" htmlFor="email">
          {t('email', { defaultValue: 'Email' })}
        </label>
        <motion.input
          whileFocus={{
            scale: 1.03,
            boxShadow:
              '0 0 0 3px var(--primary-color), 0 4px 16px 0 rgba(0,112,243,0.10)',
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          type="email"
          name="email"
          id="email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 rounded-2xl shadow-md focus:outline-none transition bg-white/70 dark:bg-white/10 text-[var(--text-color-light)] dark:text-[var(--text-color-dark)] placeholder:text-gray-400 dark:placeholder:text-gray-500 backdrop-blur-sm"
          placeholder={t('email', { defaultValue: 'Email' })}
        />
      </div>
      <div className="mb-5">
        <label className="block mb-2 font-semibold" htmlFor="password">
          {t('password', { defaultValue: 'Password' })}
        </label>
        <motion.input
          whileFocus={{
            scale: 1.03,
            boxShadow:
              '0 0 0 3px var(--primary-color), 0 4px 16px 0 rgba(0,112,243,0.10)',
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          type="password"
          name="password"
          id="password"
          value={form.password}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 rounded-2xl shadow-md focus:outline-none transition bg-white/70 dark:bg-white/10 text-[var(--text-color-light)] dark:text-[var(--text-color-dark)] placeholder:text-gray-400 dark:placeholder:text-gray-500 backdrop-blur-sm"
          placeholder={t('password', { defaultValue: 'Password' })}
        />
      </div>
      <div className="mb-6">
        <label className="block mb-2 font-semibold" htmlFor="confirmPassword">
          {t('confirmPassword', { defaultValue: 'Confirm Password' })}
        </label>
        <motion.input
          whileFocus={{
            scale: 1.03,
            boxShadow:
              '0 0 0 3px var(--primary-color), 0 4px 16px 0 rgba(0,112,243,0.10)',
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          type="password"
          name="confirmPassword"
          id="confirmPassword"
          value={form.confirmPassword}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 rounded-2xl shadow-md focus:outline-none transition bg-white/70 dark:bg-white/10 text-[var(--text-color-light)] dark:text-[var(--text-color-dark)] placeholder:text-gray-400 dark:placeholder:text-gray-500 backdrop-blur-sm"
          placeholder={t('confirmPassword', {
            defaultValue: 'Confirm Password',
          })}
        />
      </div>
      {error && (
        <div className="mb-4 animate-pulse text-center">
          <Alert status="error" title={error} />
        </div>
      )}
      {success && (
        <div className="mb-4 animate-bounce text-center">
          <Alert status="success" title={t('success')} />
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
          className="w-full py-3 px-4 rounded-2xl font-bold text-lg shadow-xl bg-[var(--primary-color)] text-white hover:brightness-110 hover:scale-[1.02] active:scale-95 transition-all duration-200 border-none drop-shadow-lg"
          disabled={loading}
          style={{ boxShadow: '0 4px 16px 0 rgba(0,112,243,0.18)' }}
        >
          {loading
            ? t('creating')
            : t('createAdmin', { defaultValue: 'Tạo Admin & Xác nhận' })}
        </Button>
      </motion.div>
      <footer
        className="w-full text-center mt-8 text-xs opacity-70 border-t-0 pt-4"
        style={{ background: 'transparent', color: 'var(--text-color-light)' }}
      >
        &copy; {new Date().getFullYear()} SercueScribe
      </footer>
    </motion.form>
  );
};

export default InitSuperUserForm;
