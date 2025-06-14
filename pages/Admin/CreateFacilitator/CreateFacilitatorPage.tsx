'use client';

import React from 'react';
import CreateFacilitatorsMain from './CreateFacilitatorMain';
import { useAuthMiddleware } from '@/hooks/useAuthMiddleware';

const CreateFacilitatorPage = () => {
  const isChecking = useAuthMiddleware(['admin']);

  if (isChecking) {
    return <div className='w-full h-screen bg-black'></div>;
  }

  return <CreateFacilitatorsMain></CreateFacilitatorsMain>;
};

export default CreateFacilitatorPage;
