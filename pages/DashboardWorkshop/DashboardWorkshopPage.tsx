'use client';

import React from 'react';
import DashboardWorkshopHeader from './DashboardWorkshopHeader';
import DashboardWorkshopMain from './DashboardWorkshopMain';
import Footer from '@/components/footer/Footer';
import { useAuthMiddleware } from '@/hooks/useAuthMiddleware';

const DashboardWorkshopPage = () => {
  const isChecking = useAuthMiddleware(['user']);

  if (isChecking) {
    return <div className='w-full h-screen bg-white'></div>;
  }

  return (
    <>
      <DashboardWorkshopHeader></DashboardWorkshopHeader>
      <DashboardWorkshopMain></DashboardWorkshopMain>
      <Footer></Footer>
    </>
  );
};

export default DashboardWorkshopPage;
