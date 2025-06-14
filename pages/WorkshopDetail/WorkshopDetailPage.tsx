'use client';

import React from 'react';
import WorkshopDetailHeader from './WorkshopDetailHeader';
import WorkshopDetailMain from './WorkshopDetailMain';
import Footer from '@/components/footer/Footer';
import { useAuthMiddleware } from '@/hooks/useAuthMiddleware';

const WorkshopDetailPage = () => {
  const isChecking = useAuthMiddleware(['user']);

  if (isChecking) {
    return <div className='w-full h-screen bg-white'></div>;
  }

  return (
    <>
      <WorkshopDetailHeader></WorkshopDetailHeader>
      <WorkshopDetailMain></WorkshopDetailMain>
      <Footer></Footer>
    </>
  );
};

export default WorkshopDetailPage;
