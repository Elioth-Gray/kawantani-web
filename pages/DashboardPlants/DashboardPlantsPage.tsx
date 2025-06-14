'use client';

import React from 'react';
import DashboardPlantsHeader from './DashboardPlantsHeader';
import DashboardPlantsMain from './DashboardPlantsMain';
import Footer from '@/components/footer/Footer';
import { useAuthMiddleware } from '@/hooks/useAuthMiddleware';

const DashboardPlantsPage = () => {
  const isChecking = useAuthMiddleware(['user']);

  if (isChecking) {
    return <div className='w-full h-screen bg-white'></div>;
  }

  return (
    <>
      <DashboardPlantsHeader></DashboardPlantsHeader>
      <DashboardPlantsMain></DashboardPlantsMain>
      <Footer></Footer>
    </>
  );
};

export default DashboardPlantsPage;
