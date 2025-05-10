'use client';

import React from 'react';
import Navbar from '@/components/navbar/Navbar';
import PrimaryButton from '@/components/buttons/PrimaryButton';
import SecondaryButton from '@/components/buttons/SecondaryButton';
import MainLabel from '@/components/label/MainLabel';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const HomeHeader = () => {
  const router = useRouter();

  return (
    <header>
      <section className='header-image w-full flex flex-col justify-start items-start overflow-hidden h-screen'>
        <div className='w-full h-full backdrop-blur-[0.3rem]'>
          <section className='px-[9rem] py-[2rem] w-full h-full flex flex-col justify-start gap-[8rem]'>
            <Navbar></Navbar>
            <div className='text-white w-full flex flex-row justify-between items-start'>
              <div className='flex flex-col justify-start items-start w-[35%] gap-[1.5rem]'>
                <div className='w-full'>
                  <h1 className='font-bold text-[3rem]'>
                    Pertanian Lebih <br /> Mudah Dengan <br />
                    <span className='text-[#50B34B]'>KawanTani</span>
                  </h1>
                  <p className='text-[1rem] mt-1'>
                    Tingkatkan hasil panen dengan KawanTani! Pantau kesehatan
                    tanaman secara real-time untuk hasil yang optimal setiap
                    musim.
                  </p>
                </div>
                <div className='w-full flex flex-row justify-start items-center text-[0.8rem] gap-[0.8rem]'>
                  <PrimaryButton
                    textColor='#fffff'
                    onClickHandler={() => {
                      router.push('/auth/login');
                    }}
                  >
                    Mulai Bertanam
                  </PrimaryButton>
                  <SecondaryButton
                    onClickHandler={() => {
                      router.push('/#about');
                    }}
                  >
                    Baca Selengkapnya
                  </SecondaryButton>
                </div>
              </div>
              <Image
                src='/images/header-plant.png'
                className=''
                width={600}
                height={600}
                alt='Gambar'
              ></Image>
            </div>
          </section>
        </div>
      </section>
      <section className='bg-[#50B34B] h-[3.8rem] flex flex-row justify-between items-center text-white py-[2.4rem] px-[9.25rem] gap-[2rem]'>
        <MainLabel title='Pantau Tanaman'></MainLabel>
        <MainLabel title='Bersama Petani'></MainLabel>
        <MainLabel title='Panen Maksimal'></MainLabel>
        <MainLabel title='Pertanian Cerdas'></MainLabel>
      </section>
    </header>
  );
};

export default HomeHeader;
