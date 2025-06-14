'use client';

import React from 'react';
import Footer from '@/components/footer/Footer';
import DashboardProfilesHeader from './DashboardProfilesHeader';
import DashboardProfilesMain from './DashboardProfilesMain';
import { useAuthMiddleware } from '@/hooks/useAuthMiddleware';

const DashboardProfilesPage = () => {
  const isChecking = useAuthMiddleware(['user']);

  if (isChecking) {
    return <div className='w-full h-screen bg-white'></div>;
  }

  return (
    <>
      <DashboardProfilesHeader></DashboardProfilesHeader>
      <DashboardProfilesMain></DashboardProfilesMain>
      <Footer></Footer>
    </>
  );
};

export default DashboardProfilesPage;
