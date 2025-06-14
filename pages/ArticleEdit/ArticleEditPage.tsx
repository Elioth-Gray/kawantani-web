'use client';

import React from 'react';
import ArticleEditHeader from './ArticleEditHeader';
import ArticleEditMain from './ArticleEditMain';
import Footer from '@/components/footer/Footer';
import { useAuthMiddleware } from '@/hooks/useAuthMiddleware';

const ArticleEditPage = () => {
  const isChecking = useAuthMiddleware(['user']);

  if (isChecking) {
    return <div className='w-full h-screen bg-white'></div>;
  }

  return (
    <>
      <ArticleEditHeader></ArticleEditHeader>
      <ArticleEditMain></ArticleEditMain>
      <Footer></Footer>
    </>
  );
};

export default ArticleEditPage;
