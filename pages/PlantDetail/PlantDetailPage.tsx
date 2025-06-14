'use client';

import React from 'react';
import PlantDetailHeader from '@/pages/PlantDetail/PlantDetailHeader';
import PlantDetailMain from './PlantDetailMain';
import Footer from '@/components/footer/Footer';
import { useAuthMiddleware } from '@/hooks/useAuthMiddleware';

const PlantDetailPage = () => {
  const isChecking = useAuthMiddleware(['user']);

  if (isChecking) {
    return <div className='w-full h-screen bg-white'></div>;
  }

  return (
    <>
      <PlantDetailHeader></PlantDetailHeader>
      <PlantDetailMain></PlantDetailMain>
      <Footer></Footer>
    </>
  );
};

export default PlantDetailPage;
