'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { getUserProfile, getToken } from '@/api/authApi';

const DashboardProfilesMain = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState({
    id_pengguna: '',
    nama_depan_pengguna: '',
    nama_belakang_pengguna: '',
    email_pengguna: '',
    nomor_telepon_pengguna: '',
    jenisKelamin: 0,
    avatar: '',
    tanggal_lahir_pengguna: '',
    alamat: '',
  });

  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = getToken();
        if (!token) {
          router.push('/login');
          return;
        }

        const response = await getUserProfile();
        if (response.success && response.data?.user) {
          setUserData(response.data.user);
        } else {
          throw new Error('Failed to fetch profile');
        }
      } catch (error) {
        console.error('Profile fetch error:', error);
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  if (isLoading) {
    return (
      <main className='p-10 bg-white min-h-screen flex items-center justify-center'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#84BD00]'></div>
      </main>
    );
  }

  const formattedDateOfBirth = userData.tanggal_lahir_pengguna
    ? new Date(userData.tanggal_lahir_pengguna).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : '-';

  const baseURL =
    process.env.NEXT_PUBLIC_API_BASE_URL_FILE ||
    'http://localhost:2000/uploads';

  return (
    <main className='p-10 bg-white min-h-screen'>
      <h1 className='text-xl font-semibold text-[#84BD00] mb-6'>Profil</h1>

      <div className='bg-white rounded-2xl shadow-md p-6 flex flex-col md:flex-row gap-8'>
        <div className='flex flex-col items-center md:w-1/3 text-center'>
          <div className='w-32 h-32 relative mb-4 rounded-xl overflow-hidden'>
            {userData.avatar ? (
              <Image
                src={`${baseURL}/users/${userData.avatar}`}
                alt='Foto Profil'
                fill
                className='object-cover'
                unoptimized={process.env.NODE_ENV === 'development'}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = '/images/default-profile.png';
                }}
              />
            ) : (
              <Image
                src='/images/default-profile.png'
                alt='Default Profil'
                fill
                className='object-cover'
              />
            )}
          </div>
          <h2 className='text-xl font-semibold'>
            {`${userData.nama_depan_pengguna} ${userData.nama_belakang_pengguna}`}
          </h2>
          <p className='text-gray-500'>{userData.email_pengguna}</p>
        </div>

        <div className='flex-1'>
          <div className='space-y-6'>
            <div className='space-y-4'>
              <h3 className='text-lg font-semibold text-gray-800 border-b pb-2'>
                Informasi Pribadi
              </h3>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='flex items-center space-x-3'>
                  <div>
                    <p className='text-sm text-gray-500'>Nama Lengkap</p>
                    <p className='font-medium'>
                      {`${userData.nama_depan_pengguna} ${userData.nama_belakang_pengguna}`}
                    </p>
                  </div>
                </div>

                <div className='flex items-center space-x-3'>
                  <div>
                    <p className='text-sm text-gray-500'>Jenis Kelamin</p>
                    <p className='font-medium'>
                      {userData.jenisKelamin === 0 ? 'Laki-laki' : 'Perempuan'}
                    </p>
                  </div>
                </div>

                <div className='flex items-center space-x-3'>
                  <div>
                    <p className='text-sm text-gray-500'>Tanggal Lahir</p>
                    <p className='font-medium'>{formattedDateOfBirth}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className='space-y-4'>
              <h3 className='text-lg font-semibold text-gray-800 border-b pb-2'>
                Informasi Kontak
              </h3>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='flex items-center space-x-3'>
                  <div>
                    <p className='text-sm text-gray-500'>Email</p>
                    <p className='font-medium'>{userData.email_pengguna}</p>
                  </div>
                </div>

                <div className='flex items-center space-x-3'>
                  <div>
                    <p className='text-sm text-gray-500'>Nomor Telepon</p>
                    <p className='font-medium'>
                      {userData.nomor_telepon_pengguna || '-'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {userData.alamat && (
              <div className='space-y-4'>
                <h3 className='text-lg font-semibold text-gray-800 border-b pb-2'>
                  Alamat
                </h3>
                <p className='text-gray-700'>{userData.alamat}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default DashboardProfilesMain;
