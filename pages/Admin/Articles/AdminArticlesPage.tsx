'use client';

import React from 'react';
import AdminArticlesMain from './AdminArticlesMain';
import { useAuthMiddleware } from '@/hooks/useAuthMiddleware';

const AdminArticlesPage = () => {
  const isChecking = useAuthMiddleware(['admin']);

  if (isChecking) {
    return <div className='w-full h-screen bg-black'></div>;
  }
  return <AdminArticlesMain></AdminArticlesMain>;
};

export default AdminArticlesPage;
