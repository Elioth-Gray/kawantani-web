'use client';

import React from 'react';
import CreateWorkshopsMain from './CreateWorkshopsMain';
import { useAuthMiddleware } from '@/hooks/useAuthMiddleware';

const CreateWorkshopsPage = () => {
  const isChecking = useAuthMiddleware(['facilitator']);

  if (isChecking) {
    return <div className='w-full h-screen bg-black'></div>;
  }

  return <CreateWorkshopsMain></CreateWorkshopsMain>;
};

export default CreateWorkshopsPage;
