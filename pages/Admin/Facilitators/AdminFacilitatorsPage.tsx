'use client';

import React from 'react';
import AdminFacilitatorsMain from './AdminFacilitatorsMain';
import { useAuthMiddleware } from '@/hooks/useAuthMiddleware';

const AdminFacilitatorsPage = () => {
  const isChecking = useAuthMiddleware(['admin']);

  if (isChecking) {
    return <div className='w-full h-screen bg-black'></div>;
  }

  return <AdminFacilitatorsMain></AdminFacilitatorsMain>;
};

export default AdminFacilitatorsPage;
