'use client';

import React from 'react';
import EditWorkshopsMain from './EditWorkshopsMain';
import { useAuthMiddleware } from '@/hooks/useAuthMiddleware';

const EditWorkshopsPage = () => {
  const isChecking = useAuthMiddleware(['facilitator']);

  if (isChecking) {
    return <div className='w-full h-screen bg-black'></div>;
  }

  return <EditWorkshopsMain></EditWorkshopsMain>;
};

export default EditWorkshopsPage;
