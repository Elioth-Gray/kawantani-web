'use client';

import React from 'react';
import ArticleDetailMain from './ArticleDetailMain';
import { useAuthMiddleware } from '@/hooks/useAuthMiddleware';

const ArticleDetailPage = () => {
  const isChecking = useAuthMiddleware(['admin']);

  if (isChecking) {
    return <div className='w-full h-screen bg-black'></div>;
  }
  return <ArticleDetailMain></ArticleDetailMain>;
};

export default ArticleDetailPage;
