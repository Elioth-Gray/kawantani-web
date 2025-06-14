'use client';

import React from 'react';
import FacilitatorSalesMain from './FacilitatorSalesMain';
import { useAuthMiddleware } from '@/hooks/useAuthMiddleware';

const FacilitatorSalesPage = () => {
  const isChecking = useAuthMiddleware(['facilitator']);

  if (isChecking) {
    return <div className='w-full h-screen bg-black'></div>;
  }

  return <FacilitatorSalesMain></FacilitatorSalesMain>;
};

export default FacilitatorSalesPage;
