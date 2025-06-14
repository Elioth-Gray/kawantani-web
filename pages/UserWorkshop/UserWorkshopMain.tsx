'use client';

import React, { useEffect, useState } from 'react'; // Added useState and useEffect
import {
  Calendar,
  Timer,
  MapPin,
  ArrowLeft,
} from '@phosphor-icons/react/dist/ssr';
import Image from 'next/image';
import ActionButton from '@/components/buttons/ActionButton';
import { useRouter } from 'next/navigation';
import { getWorkshopById } from '@/api/workshopApi'; // Added workshop API import
import { getUserProfile } from '@/api/authApi'; // Added user profile API import
import { TWorkshopDetailResponse } from '@/types/workshopTypes'; // Added type import
import { DecodedToken } from '@/types/authTypes'; // Added type import

const UserWorkshopMain = () => {
  const router = useRouter();
  const [workshop, setWorkshop] = useState<TWorkshopDetailResponse | null>(
    null,
  ); // Added state for workshop data
  const [userData, setUserData] = useState<any>([{}]); // Added state for user data
  const [isLoading, setIsLoading] = useState(true); // Added loading state

  // Added useEffect for fetching data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const workshopId = window.location.pathname.split('/').pop();
        if (!workshopId) {
          throw new Error('Workshop ID not found');
        }

        // Fetch workshop data
        const workshopResponse = await getWorkshopById(workshopId);
        if (workshopResponse.success && workshopResponse.data) {
          setWorkshop(workshopResponse);
        }

        // Fetch user profile data
        const userResponse = await getUserProfile();
        if (userResponse.success && userResponse.data) {
          setUserData(userResponse.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!workshop || !workshop.data || !userData) {
    return <div>Data not found</div>;
  }

  return (
    <main className='px-[8.1rem] py-[5.3rem]'>
      <section className='w-full'>
        <div
          className='w-full flex flex-row justify-start items-center gap-[1rem] mb-[2.3rem] cursor-pointers'
          onClick={() => {
            router.back();
          }}
        >
          <ArrowLeft
            size={24}
            color='#00000'
            weight='bold'
            className='cursor-pointer'
          />
          <p className='cursor-pointer'>Kembali</p>
        </div>
      </section>
      {/* Form Section */}
      <section className='mt-[5.3rem]'>
        <div className='w-full grid grid-cols-2'>
          <div className='col-span-1 flex flex-col justify-start items-start gap-[1.3rem]'>
            <div className='flex flex-col justify-start items-start gap-[0.3rem] w-full'>
              <h1 className='text-[1.5rem] font-semibold'>Selamat!</h1>
              <p className='text-[0.8rem] w-[80%]'>
                Anda telah terdaftar pada workshop ini, berikut adalah detail
                tiket anda
              </p>
            </div>
            <div className='flex flex-col justify-start items-start gap-[0.3rem] w-[60%]'>
              <h1 className='text-[1.25rem] font-semibold'>
                Informasi Peserta:
              </h1>
              <div className='flex flex-row justify-between items-center w-full'>
                <p>Nama Peserta</p>
                <p>
                  : {userData.firstName} {userData.lastName}
                </p>
              </div>
              <div className='flex flex-row justify-between items-center w-full'>
                <p>Email</p>
                <p>: {userData.email}</p>
              </div>
              <div className='flex flex-row justify-between items-center w-full'>
                <p>Nomor Telepon</p>
                <p>: {userData.phoneNumber || 'Belum diisi'}</p>
              </div>
              <div className='flex flex-row justify-between items-center w-full'>
                <p>Tanggal Lahir</p>
                <p>: {userData.dateOfBirth || 'Belum diisi'}</p>
              </div>
              <div className='flex flex-row justify-between items-center w-full'>
                <p>Jenis Kelamin</p>
                <p>
                  :{' '}
                  {userData.gender === 1
                    ? 'Laki-Laki'
                    : userData.gender === 2
                    ? 'Perempuan'
                    : 'Belum diisi'}
                </p>
              </div>
            </div>
            <div className='flex flex-col justify-start items-start gap-[0.3rem] w-[60%]'>
              <h1 className='text-[1.25rem] font-semibold'>
                Informasi Pembayaran:
              </h1>
              <div className='flex flex-row justify-between items-center w-full'>
                <p>Metode Pembayaran</p>
                <p>: Gopay</p>
              </div>
              <div className='flex flex-row justify-between items-center w-full'>
                <p>Total Harga</p>
                <p>: Rp.{workshop.data.harga_workshop},00</p>
              </div>
              <div className='flex flex-row justify-between items-center w-full'>
                <p>Status Pembayaran</p>
                <p>: Berhasil</p>
              </div>
            </div>
            <div className='w-full flex flex-col justify-start items-start gap-[1rem]'>
              <ActionButton
                textColor='#ffffff'
                width='16.25rem'
                height='3.5rem'
              >
                Download Tiket
              </ActionButton>
            </div>
          </div>
          <div className='col-span-1 flex flex-row justify-end items-start w-full'>
            <div className='w-[80%] flex flex-col justify-start items-start gap-[2.25rem]'>
              <Image
                className=' object-cover w-full h-[16.8rem] rounded-lg'
                width={545}
                height={307}
                src={
                  workshop.data.gambar_workshop || '/images/workshop-image.webp'
                }
                alt={workshop.data.judul_workshop || 'workshop image'}
                quality={100}
                unoptimized
              ></Image>
              <h1 className='text-[1.5rem] font-semibold w-[70%]'>
                {workshop.data.judul_workshop}
              </h1>
              <div className='flex flex-col justify-start items-start gap-[0.9rem]'>
                <div className='flex flex-row justify-start items-center gap-[0.75rem]'>
                  <Calendar size={26} color='#000000' />
                  <p className='text-[0.75rem]'>
                    {new Date(
                      workshop.data.tanggal_workshop,
                    ).toLocaleDateString('id-ID', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <div className='flex flex-row justify-start items-center gap-[0.75rem]'>
                  <MapPin size={26} color='#000000' />
                  <p className='text-[0.75rem]'>
                    {workshop.data.alaamt_lengkap_workshop}
                  </p>
                </div>
                <div className='flex flex-row justify-start items-center gap-[0.75rem]'>
                  <Timer size={26} color='#000000' />
                  <p className='text-[0.75rem]'>07.00 - 15.00 WIB</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default UserWorkshopMain;
