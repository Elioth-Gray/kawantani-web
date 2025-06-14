'use client';

import React from 'react';
import AdminHomeMain from './AdminHomeMain';
import { useAuthMiddleware } from '@/hooks/useAuthMiddleware';

const AdminHomePage = () => {
  const isChecking = useAuthMiddleware(['admin']);

  if (isChecking) {
    return <div className='w-full h-screen bg-black'></div>;
  }

  return <AdminHomeMain></AdminHomeMain>;
};

export default AdminHomePage;
