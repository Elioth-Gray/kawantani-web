'use client';

import React from 'react';
import EditUserMain from './EditUserMain';
import { useAuthMiddleware } from '@/hooks/useAuthMiddleware';

const EditUserPage = () => {
  const isChecking = useAuthMiddleware(['admin']);

  if (isChecking) {
    return <div className='w-full h-screen bg-black'></div>;
  }

  return <EditUserMain></EditUserMain>;
};

export default EditUserPage;
