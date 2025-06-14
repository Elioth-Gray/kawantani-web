'use client';

import React from 'react';
import AdminWorkshopsMain from './AdminWorkshopsMain';
import { useAuthMiddleware } from '@/hooks/useAuthMiddleware';

const AdminWorkshopsPage = () => {
  const isChecking = useAuthMiddleware(['admin']);

  if (isChecking) {
    return <div className='w-full h-screen bg-black'></div>;
  }

  return <AdminWorkshopsMain></AdminWorkshopsMain>;
};

export default AdminWorkshopsPage;
