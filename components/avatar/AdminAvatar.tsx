'use client';

import React, { useEffect, useState } from 'react';
import { getToken, removeAccessToken } from '@/api/authApi';
import { jwtDecode } from 'jwt-decode';
import { DecodedToken } from '@/types/authTypes';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

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
    <div className='flex flex-col justify-start items-start gap-5'>
      <div className='flex flex-row justify-between items-center w-full'>
        <div className='flex flex-row justify-start items-start gap-[1rem]'>
          <div className='size-[2.3rem] rounded-lg flex flex-col justify-center items-center object-center overflow-clip bg-white text-black'>
            <Image
              className=' object-cover w-full h-[16.8rem] rounded-lg'
              width={545}
              height={307}
              src={`http://localhost:2000/uploads/admin/${user.avatar}`}
              alt='Admin Avatar'
              quality={100}
              unoptimized
            ></Image>
          </div>
          <div className='flex flex-col justify-start items-start'>
            <p className='font-semibold text-[0.8rem]'>
              {user.firstName} {user.lastName}
            </p>
            <p className='text-[0.75rem]'>{user.email}</p>
          </div>
        </div>
      </div>
      <div className='w-full flex flex-row justify-end items-center'>
        <button
          className='text-red-500 cursor-pointer font-semibold hover:text-red-600 transition'
          onClick={onLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminAvatar;
