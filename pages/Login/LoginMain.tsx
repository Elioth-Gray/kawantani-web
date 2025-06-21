'use client';

import React from 'react';
import ActionButton from '@/components/buttons/ActionButton';
import { Envelope, Lock } from '@phosphor-icons/react/dist/ssr';
import InputField from '@/components/form/InputField';
import PrimaryLink from '@/components/links/PrimaryLink';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { z } from 'zod';
import { getUserProfile, loginAccount } from '@/api/authApi';

const LoginMain = () => {
  const [formData, setFormData] = useState<{
    email: string;
    password: string;
  }>({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof typeof formData, string>>
  >({});

  const [warning, setWarning] = useState('');

  const [loading, setLoading] = useState(false);

  const loginSchema = z.object({
    email: z.string().email('Email tidak valid!').min(1, 'Email wajib diisi!'),
    password: z.string().min(6, 'Password minimal 6 karakter'),
  });

  const router = useRouter();

  const handleChange = (e: any) => {
    const { name, value } = e?.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const result = loginSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: any = {};
      result.error.errors.forEach((err) => {
        const fieldName = err.path[0] as keyof typeof formData;
        fieldErrors[fieldName] = err.message;
      });
      setErrors(fieldErrors);
    } else {
      setErrors({});
      setLoading(true);
      const result = await loginAccount(formData);
      if (result.success == false) {
        setWarning(result.message);
        setLoading(false);
      } else {
        setWarning('');
        const profile = await getUserProfile();
        const verified = profile.data.user.status_verfikasi;
        console.log(profile);
        console.log(verified);
        if (verified === true) {
          router.push('/dashboard');
        } else if (verified === false) {
          router.push('/auth/activation');
        }
        setLoading(false);
      }
    }
  };

  return (
    <section className='grid grid-cols-2 w-full h-screen'>
      <div className='col-span-1 w-full h-full flex flex-col justify-center items-center'>
        {/* Login Form */}
        <div className='flex flex-col justify-center items-start w-[23.25rem] gap-[2.8rem]'>
          <div className='flex flex-col justify-start items-center gap-[1.6rem] w-full'>
            <div className='w-full'>
              <h1 className='text-[2.25rem] font-semibold'>Masuk</h1>
              <p className='mt-[0.5rem] text[1.25rem] font-light'>
                Selamat datang kembali
              </p>
            </div>
            <div className='w-full'>
              <form
                action=''
                className='w-full flex flex-col justify-center items-start gap-[1.5rem]'
              >
                <div className='w-full flex flex-col justify-start items-start gap-[0.5rem]'>
                  <h1 className='text-[1.2rem] font-semibold'>Email</h1>
                  <InputField
                    placeholder='johndoe@mail.com'
                    type='text'
                    value={formData.email}
                    name='email'
                    onChange={handleChange}
                    error={errors.email}
                  >
                    <Envelope
                      size={26}
                      color='#727272'
                      weight='bold'
                      className='absolute left-[1.5rem]'
                    />
                  </InputField>
                </div>
                <div className='w-full flex flex-col justify-start items-start gap-[0.5rem]'>
                  <h1 className='text-[1.2rem] font-semibold'>Password</h1>
                  <InputField
                    placeholder='*********'
                    type='password'
                    value={formData.password}
                    name='password'
                    onChange={handleChange}
                    error={errors.password}
                  >
                    <Lock
                      size={26}
                      color='#727272'
                      weight='bold'
                      className='absolute left-[1.5rem]'
                    />
                  </InputField>
                </div>
                {warning && (
                  <div className='w-full h-[3.5rem] bg-red-300 rounded-md flex flex-row justify-center items-center'>
                    <h1 className='text-white font-bold'>{warning}</h1>
                  </div>
                )}
                <ActionButton
                  textColor='#ffff'
                  height='3.75rem'
                  size='1.2rem'
                  width='100%'
                  onClickHandler={handleSubmit}
                  disabled={loading}
                >
                  {loading ? 'Loading....' : 'Masuk'}
                </ActionButton>
              </form>
            </div>
            <div className='grid grid-cols-3 gap-[0.6rem] justify-center items-center w-full'>
              <div className='col-span-1 h-[0.1rem] w-full bg-black'></div>
              <div className='col-span-1 '>
                <p className='text-[0.9rem] font-semibold w-full'>
                  Coba cara lain
                </p>
              </div>
              <div className='col-span-1 h-[0.1rem] w-full bg-black'></div>
            </div>
          </div>
          <div className='w-full justify-center flex flex-col items-start gap-3'>
            <p className='w-full text-center text-[#828282]'>
              Belum punya akun?{' '}
              <PrimaryLink href='/auth/register'>Buat akun</PrimaryLink>
            </p>
            <p className='w-full text-center text-[#828282]'>
              Super User? <PrimaryLink href='/auth/super'>Masuk</PrimaryLink>
            </p>
          </div>
        </div>
      </div>
      <div className='login-image col-span-1 w-full h-full'></div>
    </section>
  );
};

export default LoginMain;
