'use client';

import React from 'react';
import WorkshopRegistrationSuccessHeader from './WorkshopRegistrationSuccessHeader';
import WorkshopRegistrationSuccessMain from './WorkshopRegistrationSuccessMain';
import Footer from '@/components/footer/Footer';
import { useAuthMiddleware } from '@/hooks/useAuthMiddleware';

const WorkshopRegistrationSuccessPage = () => {
  const isChecking = useAuthMiddleware(['user']);

  if (isChecking) {
    return <div className='w-full h-screen bg-white'></div>;
  }

  return (
    <>
      <WorkshopRegistrationSuccessHeader></WorkshopRegistrationSuccessHeader>
      <WorkshopRegistrationSuccessMain></WorkshopRegistrationSuccessMain>
      <Footer></Footer>
    </>
  );
};

export default WorkshopRegistrationSuccessPage;
