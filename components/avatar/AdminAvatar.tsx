'use client';

import React, { useEffect, useState } from 'react';
import { getToken, removeAccessToken } from '@/api/authApi';
import { jwtDecode } from 'jwt-decode';
import { DecodedToken } from '@/types/authTypes';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { SignOut } from '@phosphor-icons/react';

const AdminAvatar = () => {
  const [user, setUser] = useState<DecodedToken>({
    id: '',
    email: '',
    firstName: '',
    lastName: '',
    role: '',
    avatar: '',
    iat: 0,
    exp: 0,
  });

  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    if (token) {
      const decoded = jwtDecode<DecodedToken>(token);
      setUser(decoded);
    }
  }, []);

  const onLogout = () => {
    removeAccessToken();
    router.push('/auth/super');
  };

  return (
    <div className='w-full flex flex-col justify-start items-end'>
      <div
        className='w-full bg-[#1F1F22] rounded-xl p-4 shadow-md text-white cursor-pointer hover:bg-[#2C2C2F] transition-colors duration-200'
        onClick={() => {
          router.push('/admin/dashboard/profile');
        }}
      >
        <div className='flex items-center gap-4'>
          <div className='w-10 h-10 rounded-full border-2 border-blue-500 overflow-hidden bg-gray-200'>
            <Image
              src={`http://localhost:2000/uploads/admin/${user.avatar}`}
              alt='Admin Avatar'
              width={48}
              height={48}
              className='object-cover w-full h-full'
              unoptimized
            />
          </div>
          <div className='flex flex-col'>
            <span className='text-sm font-semibold leading-tight'>
              {user.firstName} {user.lastName}
            </span>
            <span className='text-xs text-gray-400 leading-tight'>
              {user.email}
            </span>
          </div>
        </div>
      </div>
      <button
        onClick={onLogout}
        className='mt-4 flex items-center gap-2 text-sm text-red-500 hover:text-red-600 font-semibold transition cursor-pointer'
      >
        <SignOut size={16} />
        Logout
      </button>
    </div>
  );
};

export default AdminAvatar;
