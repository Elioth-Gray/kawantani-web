'use client';

import React from 'react';
import FacilitatorWorkshopsMain from './FacilitatorWorkshopsMain';
import { useAuthMiddleware } from '@/hooks/useAuthMiddleware';

const FacilitatorWorkshopsPage = () => {
  const isChecking = useAuthMiddleware(['facilitator']);

  if (isChecking) {
    return <div className='w-full h-screen bg-black'></div>;
  }

  return <FacilitatorWorkshopsMain></FacilitatorWorkshopsMain>;
};

export default FacilitatorWorkshopsPage;
