'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ActionButton from '../buttons/ActionButton';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useEffect } from 'react';
import { User } from '@phosphor-icons/react/dist/ssr/User';
import { CaretDown } from '@phosphor-icons/react/dist/ssr';
import { Bell } from '@phosphor-icons/react/dist/ssr';
import { jwtDecode } from 'jwt-decode';
import { DecodedToken } from '@/types/authTypes';

const Navbar = () => {
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [userData, setUserData] = useState({
    id: '',
    email: '',
    firstName: '',
    lastName: '',
    iat: 0,
    exp: 0,
  });

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      try {
        const decoded = jwtDecode<DecodedToken>(storedToken);
        setUserData(decoded);
        setIsLogin(true);
      } catch (err) {
        console.error('Invalid token:', err);
        setIsLogin(false);
      }
    }
  }, []);

  const router = useRouter();

  return (
    <nav className='flex flex-row justify-between items-center text-white w-full'>
      <Image
        src='/images/logo.webp'
        width={181}
        height={58}
        alt='logo'
        className='cursor-pointer'
        onClick={() => {
          router.push('/');
        }}
      ></Image>
      <ul className='flex flex-row justify-center items-center gap-20 font-light text-[1rem]'>
        <li className='hover:text-[#50B34B] transition-all duration-100 ease-in-out'>
          <Link href='/'>Beranda</Link>
        </li>
        <li className='hover:text-[#50B34B] transition-all duration-100 ease-in-out'>
          <Link href='/#about'>Tentang</Link>
        </li>
        <li className='hover:text-[#50B34B] transition-all duration-100 ease-in-out'>
          <Link href='/plants'>Tracking</Link>
        </li>
        <li className='hover:text-[#50B34B] transition-all duration-100 ease-in-out'>
          <Link href='/articles'>Artikel</Link>
        </li>
        <li className='hover:text-[#50B34B] transition-all duration-100 ease-in-out'>
          <Link href='/workshops'>Workshop</Link>
        </li>
      </ul>
      {isLogin ? (
        <div className='flex flex-row justify-end items-center gap-[1.25rem]'>
          <div className='w-full flex flex-col justify-start items-between'>
            <p>{userData.firstName + ' ' + userData.lastName}</p>
          </div>
          <div className='flex flex-row justify-center items-center gap-[0.3rem] cursor-pointer'>
            <div className='rounded-full border border-[#50B34B] p-[0.1rem] flex flex-col justify-center items-center'>
              <div className='p-[0.548rem] bg-white rounded-full flex flex-col justify-center items-center'>
                <User size={15} color='#fffffff' />
              </div>
            </div>
            <CaretDown size={18} color='#ffff'></CaretDown>
          </div>
          <Bell size={21} color='#ffff'></Bell>
        </div>
      ) : (
        <ActionButton
          width='9rem'
          textColor='#ffff'
          onClickHandler={() => {
            router.push('/auth/login');
          }}
        >
          Mulai
        </ActionButton>
      )}
    </nav>
  );
};

export default Navbar;
