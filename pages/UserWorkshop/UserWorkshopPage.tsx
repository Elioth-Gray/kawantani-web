'use client';

import React from 'react';
import UserWorkshopHeader from './UserWorkshopHeader';
import UserWorkshopMain from './UserWorkshopMain';
import Footer from '@/components/footer/Footer';
import { useAuthMiddleware } from '@/hooks/useAuthMiddleware';

const UserWorkshopPage = () => {
  const isChecking = useAuthMiddleware(['user']);

  if (isChecking) {
    return <div className='w-full h-screen bg-white'></div>;
  }

  return (
    <>
      <UserWorkshopHeader></UserWorkshopHeader>
      <UserWorkshopMain></UserWorkshopMain>
      <Footer></Footer>
    </>
  );
};

export default UserWorkshopPage;
