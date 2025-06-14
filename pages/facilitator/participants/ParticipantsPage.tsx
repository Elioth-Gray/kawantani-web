'use client';

import React from 'react';
import ParticipantsMain from './ParticipantsMain';
import { useAuthMiddleware } from '@/hooks/useAuthMiddleware';

const ParticipantsPage = () => {
  const isChecking = useAuthMiddleware(['facilitator']);

  if (isChecking) {
    return <div className='w-full h-screen bg-black'></div>;
  }

  return <ParticipantsMain></ParticipantsMain>;
};

export default ParticipantsPage;
