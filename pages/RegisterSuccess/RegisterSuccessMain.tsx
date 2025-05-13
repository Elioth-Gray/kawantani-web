import React from 'react';
import Image from 'next/image';
import PrimaryLink from '@/components/links/PrimaryLink';
import ActionButton from '@/components/buttons/ActionButton';
import { useRouter } from 'next/navigation';

const RegisterSuccessMain = () => {
  const router = useRouter();

  const navigate = () => {
    router.push('/auth/activation');
  };

  return (
    <section className='grid grid-cols-2 w-full h-screen'>
      <div className='col-span-1 w-full h-screen overflow-y-auto flex flex-col justify-start items-center py-[6.3rem]'>
        {/* Register Form */}
        <div className='flex flex-col justify-center h-full items-start w-[23.25rem] gap-[2.8rem]'>
          <div className='w-full'>
            <h1 className='text-[2.25rem] font-semibold'>Selamat!</h1>
            <p className='mt-[0.5rem] text[1.25rem] font-light w-full'>
              Selamat akun anda berhasil dibuat, silahkan lakukan aktivasi akun
              untuk bisa memakai fitur kami!
            </p>
          </div>
          <div className='flex flex-col justify-start items-center gap-[1.6rem] w-full'>
            <ActionButton
              textColor='#ffff'
              height='3.75rem'
              size='1.2rem'
              width='100%'
              onClickHandler={navigate}
            >
              Lanjutkan
            </ActionButton>
          </div>
        </div>
      </div>
      <div className='login-image col-span-1 w-full h-[100%]'></div>
    </section>
  );
};

export default RegisterSuccessMain;
