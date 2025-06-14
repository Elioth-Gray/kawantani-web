'use client';

import React from 'react';
import FacilitatorHomeMain from './FacilitatorHomeMain';
import { useAuthMiddleware } from '@/hooks/useAuthMiddleware';

const FacilitatorHomePage = () => {
  const isChecking = useAuthMiddleware(['facilitator']);

  if (isChecking) {
    return <div className='w-full h-screen bg-black'></div>;
  }

  return <FacilitatorHomeMain></FacilitatorHomeMain>;
};

export default FacilitatorHomePage;
