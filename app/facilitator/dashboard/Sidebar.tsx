'use client';

import {
  DotsThreeVertical,
  Folders,
  House,
  Person,
  OfficeChair,
  BookOpenText,
  Ticket,
} from '@phosphor-icons/react/dist/ssr';
import Link from 'next/link';
import React from 'react';
import { usePathname } from 'next/navigation';
import FacilitatorAvatar from '@/components/avatar/FacilitatorAvatar';

export default function Sidebar() {
  const pathname = usePathname();

  const navItemClass = (path: string) => {
    const isActive = pathname?.startsWith(path);
    return `
      flex flex-row items-center gap-2 px-3 py-2 rounded-lg w-full transition-all
      ${
        isActive
          ? 'bg-[#27272A] text-blue-500 font-semibold'
          : 'text-white hover:bg-[#2e2e2e] hover:text-blue-400'
      }
    `;
  };

  return (
    <nav className='h-full w-[20rem] bg-[#18181B] max-w-[20rem] border-r-[0.3rem] border-[#27272A] flex-shrink-0'>
      <div className='flex flex-col py-[2.1rem] px-[2.3rem] w-full justify-between items-start text-white h-full'>
        <div className='flex flex-col justify-start items-start gap-[1.1rem] w-full'>
          {/* Header */}
          <div className='flex flex-row justify-between items-center w-full'>
            <div className='flex flex-row gap-2 items-center'>
              <div className='size-[2.3rem] bg-[#1C4ED8] rounded-lg flex justify-center items-center'>
                <Folders size={24} color='#ffffff' />
              </div>
              <div className='flex flex-col'>
                <p className='font-semibold text-sm'>KawanTani.co</p>
                <p className='text-xs text-gray-400'>Facilitator</p>
              </div>
            </div>
            <DotsThreeVertical size={24} color='#ffffff' />
          </div>

          {/* Navigation */}
          <div className='flex flex-col gap-2 w-full'>
            <p className='text-[#B6B6B7] text-sm'>Dashboard</p>
            <div className='flex flex-col gap-1 w-full'>
              <Link
                href='/facilitator/dashboard/home'
                className={navItemClass('/facilitator/dashboard/home')}
              >
                <House size={16} />
                Home
              </Link>
              <Link
                href='/facilitator/dashboard/sales'
                className={navItemClass('/facilitator/dashboard/sales')}
              >
                <Person size={16} />
                Penjualan
              </Link>
              <Link
                href='/facilitator/dashboard/participants'
                className={navItemClass('/facilitator/dashboard/participants')}
              >
                <OfficeChair size={16} />
                Peserta
              </Link>
              <Link
                href='/facilitator/dashboard/workshops'
                className={navItemClass('/facilitator/dashboard/workshops')}
              >
                <Ticket size={16} />
                workshop
              </Link>
            </div>
          </div>
        </div>

        {/* Admin Avatar */}
        <FacilitatorAvatar />
      </div>
    </nav>
  );
}
