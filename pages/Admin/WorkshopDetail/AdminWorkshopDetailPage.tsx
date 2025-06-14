'use client';

import React from 'react';
import AdminWorkshopDetailMain from './AdminWorkshopDetailMain';
import { useAuthMiddleware } from '@/hooks/useAuthMiddleware';

const AdminWorkshopDetailPage = () => {
  const isChecking = useAuthMiddleware(['admin']);

  if (isChecking) {
    return <div className='w-full h-screen bg-black'></div>;
  }

  return <AdminWorkshopDetailMain></AdminWorkshopDetailMain>;
};

export default AdminWorkshopDetailPage;
