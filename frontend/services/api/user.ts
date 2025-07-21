// services/api/user.ts

import axiosInstance from '@/lib/utils/axiosInstance';

function getToken() {
  if (typeof document === 'undefined') return '';
  const value = `; ${document.cookie}`;
  const parts = value.split(`; token=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || '';
  return '';
}

export const getAllUsers = async () => {
  const token = getToken();
  console.log('[API] getAllUsers token:', token);
  const res = await axiosInstance.get('/admin/users', {
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log('[API] getAllUsers result:', res.data);
  return res.data;
};

export const createUser = async (data: {
  username: string;
  email: string;
  password: string;
}) => {
  const token = getToken();
  console.log('[API] createUser', data, token);
  const res = await axiosInstance.post('/admin/users', data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log('[API] createUser result:', res.data);
  return res.data;
};

export const updateUser = async (id: number, data: any) => {
  const token = getToken();
  console.log('[API] updateUser', id, data, token);
  const res = await axiosInstance.put(`/admin/users/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log('[API] updateUser result:', res.data);
  return res.data;
};

export const deleteUser = async (id: number) => {
  const token = getToken();
  console.log('[API] deleteUser', id, token);
  const res = await axiosInstance.delete(`/admin/users/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log('[API] deleteUser result:', res.data);
  return res.data;
};

export const toggleAdmin = async (id: number) => {
  const token = getToken();
  console.log('[API] toggleAdmin', id, token);
  const res = await axiosInstance.post(
    `/admin/users/${id}/toggle-admin`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  console.log('[API] toggleAdmin result:', res.data);
  return res.data;
};

export const getAdminStats = async () => {
  const token = getToken();
  console.log('[API] getAdminStats token:', token);
  const res = await axiosInstance.get('/admin/stats', {
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log('[API] getAdminStats result:', res.data);
  return res.data;
};
