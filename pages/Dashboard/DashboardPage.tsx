'use client';

import React from 'react';
import DashboardHeader from './DashboardHeader';
import DashboardMain from './DashboardMain';
import Footer from '@/components/footer/Footer';
import { useAuthMiddleware } from '@/hooks/useAuthMiddleware';

const DashboardPage = () => {
  const isChecking = useAuthMiddleware(['user']);

  if (isChecking) {
    return <div className='w-full h-screen bg-white'></div>;
  }

  return (
    <>
      <DashboardHeader />
      <DashboardMain></DashboardMain>
      <Footer></Footer>
    </>
  );
};

export default DashboardPage;
