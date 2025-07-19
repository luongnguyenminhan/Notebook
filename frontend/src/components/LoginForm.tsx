import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { login, LoginPayload } from '@/api/authApi';
import { useTranslations } from 'next-intl';

interface Props {
  onSuccess?: () => void;
  onSwap?: () => void;
}

export default function LoginForm({ onSuccess, onSwap }: Props) {
  const t = useTranslations('LoginForm');
  const [form, setForm] = useState({
    username: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const payload: LoginPayload = {
        username: form.username,
        password: form.password,
      };
      await login(payload);
      if (onSuccess) onSuccess();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err?.response?.data?.detail || t('loginFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-lg min-w-md p-8 shadow-lg border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-bold mb-6 text-primary">{t('title')}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-foreground mb-1">
              {t('username')}
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              value={form.username}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              autoComplete="username"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1">
              {t('password')}
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={form.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              autoComplete="current-password"
            />
          </div>
          {error && <div className="text-destructive text-sm">{error}</div>}
          <Button type="submit" className="w-full mt-2" disabled={loading}>
            {loading ? t('loggingIn') : t('loginButton')}
          </Button>
        </form>
        <div className="mt-4 text-center">
          <button
            type="button"
            className="text-sm text-primary underline hover:text-primary/80"
            onClick={onSwap}
          >
            {t('noAccount')}
          </button>
        </div>
      </Card>
    </div>
  );
}
