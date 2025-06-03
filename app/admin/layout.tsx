import type { Metadata } from 'next';
import {
  DotsThreeVertical,
  Folders,
  House,
  Person,
  OfficeChair,
  BookOpenText,
} from '@phosphor-icons/react/dist/ssr';
import './super.css';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import AdminAvatar from '@/components/avatar/AdminAvatar';

export const metadata: Metadata = {
  title: 'Facilitator',
  description: 'Admin dashboard for managing the site',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className='w-full h-screen flex flex-row'>
      <nav className='h-full w-[20rem] bg-[#18181B] max-w-[20rem] border-r-[0.3rem] border-[#27272A] flex-shrink-0'>
        <div className='flex flex-col py-[2.1rem] px-[2.3rem] w-full justify-between items-start text-white h-full'>
          <div className='flex flex-col justify-start items-start gap-[1.1rem] w-full'>
            <div className='flex flex-row justify-between items-center w-full'>
              <div className='flex flex-row justify-start items-start gap-[0.5rem]'>
                <div className='size-[2.3rem] bg-[#1C4ED8] rounded-lg flex flex-col justify-center items-center'>
                  <Folders size={24} color='#ffff'></Folders>
                </div>
                <div className='flex flex-col justify-start items-start'>
                  <p className='font-semibold text-[0.8rem]'>KawanTani.co</p>
                  <p className='text-[0.75rem]'>Admin</p>
                </div>
              </div>
              <DotsThreeVertical size={24} color='#ffff'></DotsThreeVertical>
            </div>
            <div className='flex flex-col justify-start items-start w-full gap-[0.5rem]'>
              <p className='text-[#B6B6B7] text-[0.8rem]'>Dashboard</p>
              <div className='flex flex-col justify-start items-start gap-[0.6rem] w-full'>
                <div className='flex flex-row justify-start items-center gap-[0.5rem] '>
                  <House size={16} color='#ffff'></House>
                  <Link href='/admin/dashboard/home'>Home</Link>
                </div>
                <div className='flex flex-row justify-start items-center gap-[0.5rem]'>
                  <Person size={16} color='#ffff'></Person>
                  <Link href='/admin/dashboard/users'>Pengguna</Link>
                </div>
                <div className='flex flex-row justify-start items-center gap-[0.5rem]'>
                  <OfficeChair size={16} color='#ffff'></OfficeChair>
                  <Link href='/admin/dashboard/facilitators'>Facilitator</Link>
                </div>
                <div className='flex flex-row justify-start items-center gap-[0.5rem]'>
                  <BookOpenText size={16} color='#ffff'></BookOpenText>
                  <Link href='/admin/dashboard/articles'>Artikel</Link>
                </div>
              </div>
            </div>
          </div>
          <AdminAvatar></AdminAvatar>
        </div>
      </nav>
      {children}
    </div>
  );
}
