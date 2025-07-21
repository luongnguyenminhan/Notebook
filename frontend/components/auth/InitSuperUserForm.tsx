'use client';
import React, { useState } from 'react';
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
      className="max-w-md mx-auto mt-10 p-6 rounded shadow"
      style={{
        background: 'var(--input-bg-light)',
        color: 'var(--text-color-light)',
      }}
      onSubmit={handleSubmit}
    >
      <h2
        className="text-2xl font-bold mb-4 text-center"
        style={{ color: 'var(--primary-color)' }}
      >
        {t('title', { defaultValue: 'Initialize First Admin' })}
      </h2>
      <div className="mb-4">
        <label className="block mb-1 font-medium" htmlFor="username">
          {t('username', { defaultValue: 'Username' })}
        </label>
        <input
          type="text"
          name="username"
          id="username"
          value={form.username}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
          style={{
            background: 'var(--input-bg-light)',
            color: 'var(--text-color-light)',
            borderColor: 'var(--input-border-light)',
          }}
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-medium" htmlFor="email">
          {t('email', { defaultValue: 'Email' })}
        </label>
        <input
          type="email"
          name="email"
          id="email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
          style={{
            background: 'var(--input-bg-light)',
            color: 'var(--text-color-light)',
            borderColor: 'var(--input-border-light)',
          }}
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-medium" htmlFor="password">
          {t('password', { defaultValue: 'Password' })}
        </label>
        <input
          type="password"
          name="password"
          id="password"
          value={form.password}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
          style={{
            background: 'var(--input-bg-light)',
            color: 'var(--text-color-light)',
            borderColor: 'var(--input-border-light)',
          }}
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-medium" htmlFor="confirmPassword">
          {t('confirmPassword', { defaultValue: 'Confirm Password' })}
        </label>
        <input
          type="password"
          name="confirmPassword"
          id="confirmPassword"
          value={form.confirmPassword}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
          style={{
            background: 'var(--input-bg-light)',
            color: 'var(--text-color-light)',
            borderColor: 'var(--input-border-light)',
          }}
        />
      </div>
      {error && (
        <div
          className="text-error mb-2 text-center"
          style={{ color: 'var(--error-color)' }}
        >
          {error}
        </div>
      )}
      {success && (
        <div className="mb-2 text-center" style={{ color: 'green' }}>
          {t('success')}
        </div>
      )}
      <button
        type="submit"
        className="w-full py-2 px-4 rounded hover:bg-blue-700 transition disabled:opacity-50"
        style={{
          background: 'var(--primary-color)',
          color: '#fff',
        }}
        disabled={loading}
      >
        {loading ? t('creating') : t('createAdmin')}
      </button>
      <footer
        className="w-full text-center mt-6"
        style={{
          position: 'fixed',
          left: 0,
          bottom: 0,
          background: 'var(--input-bg-light)',
          color: 'var(--text-color-light)',
          borderTop: '1px solid var(--input-border-light)',
          padding: '1rem 0',
        }}
      >
        &copy; {new Date().getFullYear()} SercueScribe
      </footer>
    </form>
  );
};

export default InitSuperUserForm;
