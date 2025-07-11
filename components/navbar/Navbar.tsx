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
import { getToken } from '@/api/authApi';
import { removeAccessToken } from '@/api/authApi';
import { getUserProfile } from '@/api/authApi';

const Navbar = () => {
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [userData, setUserData] = useState({
    id: '',
    firstName: '',
    lastName: '',
    avatar: '',
    role: '',
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const result = await getUserProfile();
      if (result.success && result.data?.user) {
        const u = result.data.user;
        setUserData({
          id: u.id_pengguna,
          firstName: u.nama_depan_pengguna,
          lastName: u.nama_belakang_pengguna,
          avatar: u.avatar,
          role: 'user',
        });
        setIsLogin(true);
      }
    };

    getUser();
  }, []);

  const onLogout = () => {
    removeAccessToken();
    router.push('/auth/login');
  };

  const navigateToProfile = () => {
    router.push('/dashboard/profiles');
  };

  const navigateToDashboard = () => {
    router.push('/dashboard');
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const baseURL =
    process.env.NEXT_PUBLIC_API_BASE_URL_FILE ||
    'http://localhost:2000/uploads';

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
      {isLogin && userData.role === 'user' ? (
        <div className='flex flex-row justify-end items-center gap-[1.25rem] relative'>
          <div className='w-full flex flex-col justify-start items-between'>
            <p className='font-bold'>
              {userData.firstName + ' ' + userData.lastName}
            </p>
          </div>
          <div className='relative'>
            <div
              className='flex flex-row justify-center items-center gap-[0.3rem] cursor-pointer'
              onClick={toggleDropdown}
            >
              <div className='relative rounded-full border border-[#50B34B] p-[0.1rem] flex justify-center items-center size-10 overflow-hidden'>
                <Image
                  src={`${baseURL}/users/${userData.avatar}`}
                  alt='Admin Avatar'
                  fill
                  className='object-cover'
                  unoptimized
                />
              </div>

              <CaretDown
                size={18}
                color='#ffffff'
                className={`transition-transform duration-200 ${
                  isDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </div>

            {isDropdownOpen && (
              <div className='absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50'>
                <button
                  onClick={() => {
                    navigateToProfile();
                    setIsDropdownOpen(false);
                  }}
                  className='block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-[#50B34B] hover:text-white transition-colors'
                >
                  Profile
                </button>
                <button
                  onClick={() => {
                    navigateToDashboard();
                    setIsDropdownOpen(false);
                  }}
                  className='block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-[#50B34B] hover:text-white transition-colors'
                >
                  Dashboard
                </button>
                <button
                  onClick={() => {
                    onLogout();
                    setIsDropdownOpen(false);
                  }}
                  className='block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-500 hover:text-white transition-colors'
                >
                  Logout
                </button>
              </div>
            )}
          </div>
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
