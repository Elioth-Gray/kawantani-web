'use client';

import React, { useState, useEffect } from 'react';
import ActionButton from '@/components/buttons/ActionButton';
import {
  Envelope,
  User,
  Phone,
  Lock,
  CalendarDot,
  GenderIntersex,
} from '@phosphor-icons/react/dist/ssr';
import InputField from '@/components/form/InputField';
import SecondaryButton from '@/components/buttons/SecondaryButton';
import { z } from 'zod';
import { registerAccount } from '@/api/authApi';
import { useRouter, usePathname } from 'next/navigation';

const FormRegister = () => {
  const router = useRouter();

  const pathname = usePathname();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [currentSection, setSection] = useState(0);

  const [errors, setErrors] = useState<
    Partial<Record<keyof typeof formData, string>>
  >({});
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const [warning, setWarning] = useState('');
  const [loading, setLoading] = useState(false);

  const registerSchemas = [
    z.object({
      firstName: z.string().min(1, 'Nama depan wajib diisi!'),
      lastName: z.string().min(1, 'Nama belakang wajib diisi!'),
      email: z
        .string()
        .email('Email tidak valid!')
        .min(1, 'Email wajib diisi!'),
      phoneNumber: z
        .string()
        .min(10, 'Nomor telepon tidak valid!')
        .min(1, 'Nomor telepon wajib diisi!'),
      dateOfBirth: z.string().min(1, 'Tanggal lahir wajib diisi!'),
      gender: z.number({
        required_error: 'Jenis kelamin wajib diisi!',
        invalid_type_error: 'Jenis kelamin wajib diisi!',
      }),
    }),
    z.object({
      file: z
        .instanceof(File, { message: 'Foto profil harus diisi!' })
        .refine(
          (file) => file.size <= 5 * 1024 * 1024,
          'Ukuran file maksimal 5MB',
        )
        .refine(
          (file) =>
            ['image/jpeg', 'image/png', 'image/jpg'].includes(file.type),
          'Format file harus JPG, JPEG, atau PNG',
        ),
    }),
    z.any(),
    z
      .object({
        password: z.string().min(6, 'Password minimal 6 karakter'),
        confirmPassword: z
          .string()
          .min(6, 'Konfirmasi password minimal 6 karakter'),
      })
      .refine((data) => data.password === data.confirmPassword, {
        path: ['confirmPassword'],
        message: 'Konfirmasi password tidak cocok',
      }),
  ];

  const [formData, setFormData] = useState<{
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    dateOfBirth: string;
    gender: 0 | 1 | null;
    password: string;
    confirmPassword: string;
    file?: File | null;
  }>({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    dateOfBirth: '',
    gender: null,
    password: '',
    confirmPassword: '',
    file: null,
  });

  const handleChange = (e: any) => {
    const { name, value } = e?.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setFormData((prev) => ({
        ...prev,
        file,
      }));
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);

      // Clear file error ketika user memilih file
      if (errors.file) {
        setErrors((prev) => ({ ...prev, file: undefined }));
      }
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const schema = registerSchemas[currentSection];

    const result = schema.safeParse(formData);

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

      const form = new FormData();

      // Convert gender to string if backend expects string
      form.append('firstName', formData.firstName);
      form.append('lastName', formData.lastName);
      form.append('email', formData.email);
      form.append('phoneNumber', formData.phoneNumber);
      form.append('dateOfBirth', formData.dateOfBirth);
      form.append('gender', formData.gender?.toString() || '');
      form.append('password', formData.password);
      form.append('confirmPassword', formData.confirmPassword);

      if (formData.file) {
        form.append('avatar', formData.file);
      }

      try {
        const result = await registerAccount(form);
        console.log(result);

        if (result.success === false) {
          setWarning(result.message);
        } else {
          router.push(`${pathname}/success`);
        }
      } catch (error) {
        setWarning('Terjadi kesalahan saat mendaftar');
      } finally {
        setLoading(false);
      }
    }
  };

  const selectGender = (gender: 0 | 1) => {
    setFormData((prev) => ({ ...prev, gender }));
  };

  const nextSection = (e: any) => {
    e.preventDefault();
    const schema = registerSchemas[currentSection];

    const result = schema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: any = {};
      result.error.errors.forEach((err) => {
        const fieldName = err.path[0] as keyof typeof formData;
        fieldErrors[fieldName] = err.message;
      });
      setErrors(fieldErrors);
    } else {
      setErrors({});
      setSection((prevSection) => prevSection + 1);
    }
  };

  const backSection = (e: any) => {
    e.preventDefault();
    setSection((prevSection) => prevSection - 1);
  };

  useEffect(() => {
    console.log(currentSection);
  }, [currentSection]);

  return (
    <div className='w-full'>
      <form
        action=''
        className='w-full flex flex-col justify-center items-start gap-[1.5rem]'
      >
        {currentSection === 0 ? (
          <>
            <div className='w-full flex flex-col justify-start items-start gap-[0.5rem]'>
              <h1 className='text-[1.2rem] font-semibold'>Nama Depan</h1>
              <InputField
                placeholder='John'
                type='text'
                value={formData.firstName}
                name='firstName'
                onChange={handleChange}
                error={errors.firstName}
              >
                <User
                  size={26}
                  color='#727272'
                  weight='bold'
                  className='absolute left-[1.5rem]'
                />
              </InputField>
            </div>
            <div className='w-full flex flex-col justify-start items-start gap-[0.5rem]'>
              <h1 className='text-[1.2rem] font-semibold'>Nama Belakang</h1>
              <InputField
                placeholder='Doe'
                type='text'
                value={formData.lastName}
                name='lastName'
                onChange={handleChange}
                error={errors.lastName}
              >
                <User
                  size={26}
                  color='#727272'
                  weight='bold'
                  className='absolute left-[1.5rem]'
                />
              </InputField>
            </div>
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
              <h1 className='text-[1.2rem] font-semibold'>Nomor Telepon</h1>
              <InputField
                placeholder='0812345678'
                type='text'
                value={formData.phoneNumber}
                name='phoneNumber'
                onChange={handleChange}
                error={errors.phoneNumber}
                maxLength={13}
              >
                <Phone
                  size={26}
                  color='#727272'
                  weight='bold'
                  className='absolute left-[1.5rem]'
                />
              </InputField>
            </div>
            <div className='w-full flex flex-col justify-start items-start gap-[0.5rem]'>
              <h1 className='text-[1.2rem] font-semibold'>Tanggal Lahir</h1>
              <InputField
                placeholder='11-04-2005'
                type='date'
                value={formData.dateOfBirth}
                name='dateOfBirth'
                onChange={handleChange}
                error={errors.dateOfBirth}
              >
                <CalendarDot
                  size={26}
                  color='#727272'
                  weight='bold'
                  className='absolute left-[1.5rem]'
                />
              </InputField>
            </div>
            <div className='w-full flex flex-col justify-start items-start gap-[0.5rem]'>
              <h1 className='text-[1.2rem] font-semibold'>Jenis Kelamin</h1>
              <div className='grid grid-cols-2 items-center w-full gap-[0.75rem]'>
                <button
                  type='button'
                  onClick={() => selectGender(0)}
                  className={`flex items-center justify-center gap-2 py-4 px-4 rounded-lg border ${
                    formData.gender === 0
                      ? 'border-2 border-blue-500 bg-blue-50 text-blue-700'
                      : 'border border-gray-300 hover:border-gray-400'
                  } transition-all duration-200 font-medium cursor-pointer`}
                >
                  Laki-Laki
                </button>
                <button
                  type='button'
                  onClick={() => selectGender(1)}
                  className={`flex items-center justify-center gap-2 py-4 px-4 rounded-lg border ${
                    formData.gender === 1
                      ? 'border-2 border-pink-500 bg-pink-50 text-pink-700'
                      : 'border border-gray-300 hover:border-gray-400'
                  } transition-all duration-200 font-medium cursor-pointer`}
                >
                  Perempuan
                </button>
              </div>
              {errors.gender ? (
                <p className='text-red-500 text-sm mt-1'>{errors.gender}</p>
              ) : (
                <></>
              )}
            </div>
          </>
        ) : currentSection === 1 ? (
          <div className='flex flex-col justify-start items-start w-full gap-[1rem]'>
            <h1 className='text-[1.2rem] font-semibold'>Upload Foto</h1>
            {avatarPreview ? (
              <div className='flex flex-col justify-start items-center gap-3 mb-4'>
                <img
                  src={avatarPreview}
                  alt='Avatar Pengguna'
                  className='w-32 h-32 rounded-full object-cover border-2 border-white'
                />
                <p>
                  Foto Profil <span className='text-red-500'>*</span>
                </p>
              </div>
            ) : (
              <div className='flex flex-col justify-start items-center gap-3 mb-4'>
                <div className='size-32 bg-white rounded-full flex flex-col justify-center items-center'>
                  <User size={32} color='#09090B'></User>
                </div>
                <p>
                  Foto Profil <span className='text-red-500'>*</span>
                </p>
              </div>
            )}
            <input
              type='file'
              onChange={handleFileChange}
              className='w-full bg-[#F2F2F2] rounded-lg py-[1.1rem] px-[1.1rem]'
            />
            <p className='text-black'>SVG, PNG, JPG or GIF (MAX. 800x400px).</p>
            {errors.file && (
              <p className='text-red-500 text-sm mt-1'>{errors.file}</p>
            )}
          </div>
        ) : currentSection == 2 ? (
          <>
            <h1 className='font-semibold text-[1.3rem]'>
              Konfirmasi Data Diri
            </h1>
            <div className='w-full flex flex-col justify-start items-start gap-[0.5rem]'>
              <h1 className='text-[1.2rem] font-semibold'>Nama Depan</h1>
              <div className='flex flex-row justify-start items-center relative w-full border border-black rounded-lg bg-white'>
                <User
                  size={26}
                  color='#00000'
                  weight='bold'
                  className='absolute left-[1.5rem]'
                />
                <h1
                  className={`py-[1.125rem] w-full rounded-lg pl-[4.8rem]
                  pr-[2rem] font-semibold text-black`}
                >
                  {formData.firstName}
                </h1>
              </div>
            </div>
            <div className='w-full flex flex-col justify-start items-start gap-[0.5rem]'>
              <h1 className='text-[1.2rem] font-semibold'>Nama Depan</h1>
              <div className='flex flex-row justify-start items-center relative w-full border border-black rounded-lg bg-white'>
                <User
                  size={26}
                  color='#00000'
                  weight='bold'
                  className='absolute left-[1.5rem]'
                />
                <h1
                  className={`py-[1.125rem] w-full rounded-lg pl-[4.8rem]
                  pr-[2rem] font-semibold text-black`}
                >
                  {formData.lastName}
                </h1>
              </div>
            </div>
            <div className='w-full flex flex-col justify-start items-start gap-[0.5rem]'>
              <h1 className='text-[1.2rem] font-semibold'>Email</h1>
              <div className='flex flex-row justify-start items-center relative w-full border border-black rounded-lg bg-white'>
                <Envelope
                  size={26}
                  color='#00000'
                  weight='bold'
                  className='absolute left-[1.5rem]'
                />
                <h1
                  className={`py-[1.125rem] w-full rounded-lg pl-[4.8rem]
                  pr-[2rem] font-semibold text-black`}
                >
                  {formData.email}
                </h1>
              </div>
            </div>
            <div className='w-full flex flex-col justify-start items-start gap-[0.5rem]'>
              <h1 className='text-[1.2rem] font-semibold'>Nomor Telepon</h1>
              <div className='flex flex-row justify-start items-center relative w-full border border-black rounded-lg bg-white'>
                <Phone
                  size={26}
                  color='#00000'
                  weight='bold'
                  className='absolute left-[1.5rem]'
                />
                <h1
                  className={`py-[1.125rem] w-full rounded-lg pl-[4.8rem]
                  pr-[2rem] font-semibold text-black`}
                >
                  {formData.phoneNumber}
                </h1>
              </div>
            </div>
            <div className='w-full flex flex-col justify-start items-start gap-[0.5rem]'>
              <h1 className='text-[1.2rem] font-semibold'>Tanggal Lahir</h1>
              <div className='flex flex-row justify-start items-center relative w-full border border-black rounded-lg bg-white'>
                <CalendarDot
                  size={26}
                  color='#00000'
                  weight='bold'
                  className='absolute left-[1.5rem]'
                />
                <h1
                  className={`py-[1.125rem] w-full rounded-lg pl-[4.8rem]
                  pr-[2rem] font-semibold text-black`}
                >
                  {formData.dateOfBirth}
                </h1>
              </div>
            </div>
            <div className='w-full flex flex-col justify-start items-start gap-[0.5rem]'>
              <h1 className='text-[1.2rem] font-semibold'>Jenis Kelamin</h1>
              <div className='flex flex-row justify-start items-center relative w-full border border-black rounded-lg bg-white'>
                <GenderIntersex
                  size={26}
                  color='#00000'
                  weight='bold'
                  className='absolute left-[1.5rem]'
                />
                <h1
                  className={`py-[1.125rem] w-full rounded-lg pl-[4.8rem]
                  pr-[2rem] font-semibold text-black`}
                >
                  {formData.gender === 0 ? 'Laki-Laki' : 'Perempuan'}
                </h1>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className='w-full flex flex-col justify-start items-start gap-[0.5rem]'>
              <h1 className='text-[1.2rem] font-semibold'>Password</h1>
              <InputField
                placeholder='Password'
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
            <div className='w-full flex flex-col justify-start items-start gap-[0.5rem]'>
              <h1 className='text-[1.2rem] font-semibold'>
                Konfirmasi Password
              </h1>
              <InputField
                placeholder='Password'
                type='password'
                value={formData.confirmPassword}
                name='confirmPassword'
                onChange={handleChange}
                error={errors.confirmPassword}
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
          </>
        )}
        <div className='w-full flex flex-col justify-center items-center gap-[1rem]'>
          {currentSection < 3 ? (
            <ActionButton
              textColor='#ffff'
              height='3.75rem'
              size='1.2rem'
              width='100%'
              onClickHandler={nextSection}
            >
              Selanjutnya
            </ActionButton>
          ) : (
            <ActionButton
              textColor='#ffff'
              height='3.75rem'
              size='1.2rem'
              width='100%'
              disabled={loading}
              onClickHandler={handleSubmit}
            >
              {loading ? 'Loading...' : 'Daftar Akun'}
            </ActionButton>
          )}
          {currentSection > 0 ? (
            <SecondaryButton
              variant='black'
              width='100%'
              height='3.75rem'
              onClickHandler={backSection}
            >
              Kembali
            </SecondaryButton>
          ) : (
            <></>
          )}
        </div>
      </form>
    </div>
  );
};

export default FormRegister;
