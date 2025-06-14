'use client';

import React from 'react';
import AdminUsersMain from './AdminUsersMain';
import { useAuthMiddleware } from '@/hooks/useAuthMiddleware';

const AdminUsersPage = () => {
  const isChecking = useAuthMiddleware(['admin']);

  if (isChecking) {
    return <div className='w-full h-screen bg-black'></div>;
  }
  return <AdminUsersMain></AdminUsersMain>;
};

export default AdminUsersPage;
