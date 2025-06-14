'use client';

import React from 'react';
import CreateArticleHeader from './CreateArticleHeader';
import CreateArticleMain from './CreateArticleMain';
import { useAuthMiddleware } from '@/hooks/useAuthMiddleware';

const CreateArtilclePage = () => {
  const isChecking = useAuthMiddleware(['user']);

  if (isChecking) {
    return <div className='w-full h-screen bg-white'></div>;
  }

  return (
    <>
      <CreateArticleHeader></CreateArticleHeader>
      <CreateArticleMain></CreateArticleMain>
      {/* <Footer></Footer> */}
    </>
  );
};

export default CreateArtilclePage;
