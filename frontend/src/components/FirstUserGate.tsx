'use client';
import dynamic from 'next/dynamic';
import { useFirstUserCheck } from '@/lib/useFirstUserCheck';
import HomeIndex from './pages/HomeIndex';

const InitSuperUserForm = dynamic(() => import('./InitSuperUserForm'));

export default function FirstUserGate() {
  const { isFirstUser, loading, error } = useFirstUserCheck();
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen"><span>Loading...</span></div>;
  }
  if (error) {
    return <div className="flex items-center justify-center min-h-screen text-destructive">{error}</div>;
  }
  if (isFirstUser) {
    return <InitSuperUserForm />;
  }
  return <HomeIndex />;
} 