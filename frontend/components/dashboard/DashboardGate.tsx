/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import React from 'react';
import AdminDashboard from './AdminDashboard';
import UserDashboard from './UserDashboard';
import UnAuthenticatedDashboard from './UnAuthenticatedDashboard';
import { Spinner } from '@chakra-ui/react';
import { getMe } from '@/services/api/auth';
import Header from '@/components/layout/Header';
import { DashboardRefreshContext } from '@/context/DashboardRefreshContext';

const DashboardGate = () => {
  const [user, setUser] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [dashboardKey, setDashboardKey] = React.useState(0);

  const refreshDashboard = React.useCallback(() => {
    setUser(null);
    setLoading(true);
    setDashboardKey((k) => k + 1);
  }, []);

  React.useEffect(() => {
    function getCookie(name: string) {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift();
      return null;
    }
    const token = getCookie('token');
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    getMe(token)
      .then((resp) => {
        if (resp && resp.username) {
          setUser(resp);
        } else {
          setUser(null);
        }
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, [dashboardKey]);

  return (
    <DashboardRefreshContext.Provider value={{ refreshDashboard }}>
      <Header />
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <Spinner size="xl" />
        </div>
      ) : !user ? (
        <UnAuthenticatedDashboard />
      ) : user.is_admin ? (
        <AdminDashboard />
      ) : (
        <UserDashboard />
      )}
    </DashboardRefreshContext.Provider>
  );
};

export default DashboardGate;
