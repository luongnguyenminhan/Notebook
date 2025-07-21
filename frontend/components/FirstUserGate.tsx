'use client';
import React from 'react';
import { useFirstUserCheck } from '@/hooks/useFirstUserCheck';
import InitSuperUserForm from '@/components/auth/InitSuperUserForm';

export default function FirstUserGate({
  children,
}: {
  children: React.ReactNode;
  params: any;
}) {
  const { isFirstUser, loading, error } = useFirstUserCheck();
  if (loading) return null;
  if (error) return null;
  if (isFirstUser) {
    return <InitSuperUserForm onSuccess={() => window.location.reload()} />;
  }
  return <>{children}</>;
}
