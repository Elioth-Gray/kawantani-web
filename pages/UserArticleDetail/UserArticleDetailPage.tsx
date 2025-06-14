'use client';

import React from 'react';
import UserArticleDetailHeader from './UserArticleDetailHeader';
import UserArticleDetailMain from './UserArticleDetailMain';
import Footer from '@/components/footer/Footer';
import { useAuthMiddleware } from '@/hooks/useAuthMiddleware';

const UserArticleDetailPage = () => {
  const isChecking = useAuthMiddleware(['user']);

  if (isChecking) {
    return <div className='w-full h-screen bg-white'></div>;
  }

  return (
    <>
      <UserArticleDetailHeader></UserArticleDetailHeader>
      <UserArticleDetailMain></UserArticleDetailMain>
      <Footer></Footer>
    </>
  );
};

export default UserArticleDetailPage;
