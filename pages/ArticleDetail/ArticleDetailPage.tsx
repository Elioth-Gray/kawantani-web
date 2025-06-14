'use client';

import React from 'react';
import ArticleDetailHeader from './ArticleDetailHeader';
import Footer from '@/components/footer/Footer';
import ArticleDetailMain from './ArticleDetailMain';
import { useAuthMiddleware } from '@/hooks/useAuthMiddleware';

const ArticleDetailPage = () => {
  const isChecking = useAuthMiddleware(['user']);

  if (isChecking) {
    return <div className='w-full h-screen bg-white'></div>;
  }

  return (
    <>
      <ArticleDetailHeader></ArticleDetailHeader>
      <ArticleDetailMain></ArticleDetailMain>
      <Footer></Footer>
    </>
  );
};

export default ArticleDetailPage;
