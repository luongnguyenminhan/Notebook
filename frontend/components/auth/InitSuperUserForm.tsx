'use client';
import React, { useState } from 'react';
import Button from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { initSuperUser } from '@/services/api/auth';
import { useTranslations } from 'next-intl';

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
    <form
      className="max-w-lg min-w-md mx-auto mt-10 p-8 rounded-2xl shadow-lg border border-[var(--input-border-light)] bg-[var(--input-bg-light)] text-[var(--text-color-light)] relative"
      onSubmit={handleSubmit}
    >
      <h2
        className="text-3xl font-extrabold mb-6 text-center tracking-tight"
        style={{ color: 'var(--primary-color)' }}
      >
        {t('title')}
      </h2>
      <div className="mb-5">
        <label className="block mb-2 font-semibold" htmlFor="username">
          {t('username', { defaultValue: 'Username' })}
        </label>
        <input
          type="text"
          name="username"
          id="username"
          value={form.username}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] transition"
          style={{
            background: 'var(--input-bg-light)',
            color: 'var(--text-color-light)',
            borderColor: 'var(--input-border-light)',
          }}
        />
      </div>
      <div className="mb-5">
        <label className="block mb-2 font-semibold" htmlFor="email">
          {t('email', { defaultValue: 'Email' })}
        </label>
        <input
          type="email"
          name="email"
          id="email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] transition"
          style={{
            background: 'var(--input-bg-light)',
            color: 'var(--text-color-light)',
            borderColor: 'var(--input-border-light)',
          }}
        />
      </div>
      <div className="mb-5">
        <label className="block mb-2 font-semibold" htmlFor="password">
          {t('password', { defaultValue: 'Password' })}
        </label>
        <input
          type="password"
          name="password"
          id="password"
          value={form.password}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] transition"
          style={{
            background: 'var(--input-bg-light)',
            color: 'var(--text-color-light)',
            borderColor: 'var(--input-border-light)',
          }}
        />
      </div>
      <div className="mb-6">
        <label className="block mb-2 font-semibold" htmlFor="confirmPassword">
          {t('confirmPassword', { defaultValue: 'Confirm Password' })}
        </label>
        <input
          type="password"
          name="confirmPassword"
          id="confirmPassword"
          value={form.confirmPassword}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] transition"
          style={{
            background: 'var(--input-bg-light)',
            color: 'var(--text-color-light)',
            borderColor: 'var(--input-border-light)',
          }}
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
      <Button
        type="submit"
        className="w-full py-3 px-4 rounded-xl font-bold text-lg shadow-md"
        disabled={loading}
      >
        {loading
          ? t('creating')
          : t('createAdmin', { defaultValue: 'Tạo Admin & Xác nhận' })}
      </Button>
      <footer
        className="w-full text-center mt-8 text-xs opacity-70 border-t border-[var(--input-border-light)] pt-4"
        style={{ background: 'transparent', color: 'var(--text-color-light)' }}
      >
        &copy; {new Date().getFullYear()} SercueScribe
      </footer>
    </form>
  );
};

export default InitSuperUserForm;
