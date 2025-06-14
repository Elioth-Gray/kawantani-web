'use client';

import React from 'react';
import UserPlantDetailHeader from './UserPlantDetailHeader';
import UserPlantDetailMain from './UserPlantDetailMain';
import Footer from '@/components/footer/Footer';
import { useAuthMiddleware } from '@/hooks/useAuthMiddleware';

const UserPlantDetailPage = () => {
  const isChecking = useAuthMiddleware(['user']);

  if (isChecking) {
    return <div className='w-full h-screen bg-white'></div>;
  }

  return (
    <>
      <UserPlantDetailHeader></UserPlantDetailHeader>
      <UserPlantDetailMain></UserPlantDetailMain>
      <Footer></Footer>
    </>
  );
};

export default UserPlantDetailPage;
