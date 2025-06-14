'use client';

import React from 'react';
import DashboardArticleHeader from './DashboardArticleHeader';
import DashboardArticleMain from './DashboardArticleMain';
import Footer from '@/components/footer/Footer';
import { useAuthMiddleware } from '@/hooks/useAuthMiddleware';

const DashboardArticlePage = () => {
  const isChecking = useAuthMiddleware(['user']);

  if (isChecking) {
    return <div className='w-full h-screen bg-white'></div>;
  }

  return (
    <>
      <DashboardArticleHeader></DashboardArticleHeader>
      <DashboardArticleMain></DashboardArticleMain>
      <Footer></Footer>
    </>
  );
};

export default DashboardArticlePage;
