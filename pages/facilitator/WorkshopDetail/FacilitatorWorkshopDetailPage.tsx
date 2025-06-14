'use client';

import React from 'react';
import FacilitatorWorkshopDetailMain from './FacilitatorWorkshopDetailMain';
import { useAuthMiddleware } from '@/hooks/useAuthMiddleware';

const FacilitatorWorkshopDetailPage = () => {
  const isChecking = useAuthMiddleware(['facilitator']);

  if (isChecking) {
    return <div className='w-full h-screen bg-black'></div>;
  }

  return <FacilitatorWorkshopDetailMain></FacilitatorWorkshopDetailMain>;
};

export default FacilitatorWorkshopDetailPage;
