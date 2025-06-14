'use client';

import React from 'react';
import EditFacilitatorMain from './EditFacilitatorMain';
import { useAuthMiddleware } from '@/hooks/useAuthMiddleware';

const EditFacilitatorPage = () => {
  const isChecking = useAuthMiddleware(['admin']);

  if (isChecking) {
    return <div className='w-full h-screen bg-black'></div>;
  }

  return <EditFacilitatorMain></EditFacilitatorMain>;
};

export default EditFacilitatorPage;
