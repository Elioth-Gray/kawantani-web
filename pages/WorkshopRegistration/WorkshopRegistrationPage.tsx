'use client';

import React from 'react';
import WorkshopRegistrarionHeader from './WorkshopRegistrarionHeader';
import WorkshopRegistrationMain from './WorkshopRegistrationMain';
import Footer from '@/components/footer/Footer';
import { useAuthMiddleware } from '@/hooks/useAuthMiddleware';

const WorkshopRegistrationPage = () => {
  const isChecking = useAuthMiddleware(['user']);

  if (isChecking) {
    return <div className='w-full h-screen bg-white'></div>;
  }

  return (
    <>
      <WorkshopRegistrarionHeader></WorkshopRegistrarionHeader>
      <WorkshopRegistrationMain></WorkshopRegistrationMain>
      <Footer></Footer>
    </>
  );
};

export default WorkshopRegistrationPage;
