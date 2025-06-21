'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { getUserProfile, getToken } from '@/api/authApi';
import { ArrowLeft } from '@phosphor-icons/react/dist/ssr';
import InputField from '@/components/form/InputField';
import ActionButton from '@/components/buttons/ActionButton';
import { z } from 'zod';
import { updateProfile } from '@/api/userApi';

const schema = z
  .object({
    nama_depan_pengguna: z.string().min(1, 'Nama depan wajib diisi'),
    nama_belakang_pengguna: z.string().min(1, 'Nama belakang wajib diisi'),
    tanggal_lahir_pengguna: z.string().min(1, 'Tanggal lahir wajib diisi'),
    nomor_telepon_pengguna: z
      .string()
      .min(10, 'Minimal 10 digit')
      .max(13, 'Maksimal 13 digit'),

    // password dan konfirmasi boleh kosong
    password: z.string().optional(),
    konfirmasi_password: z.string().optional(),

    // file juga optional, tapi jika ada, harus tipe File
    file: z
      .any()
      .optional()
      .refine(
        (val) => val === undefined || val instanceof File,
        'File harus bertipe File',
      ),
  })
  .refine(
    (data) =>
      (!data.password && !data.konfirmasi_password) ||
      (data.password && data.konfirmasi_password), // jika salah satu diisi, dua-duanya harus diisi
    {
      message: 'Password dan konfirmasi harus diisi bersama',
      path: ['konfirmasi_password'],
    },
  )
  .refine(
    (data) =>
      !data.password ||
      (data.password.length >= 6 && data.password.length <= 20), // validasi panjang jika diisi
    {
      message: 'Password minimal 6 karakter dan maksimal 20 karakter',
      path: ['password'],
    },
  )
  .refine((data) => data.password === data.konfirmasi_password, {
    message: 'Konfirmasi password tidak cocok',
    path: ['konfirmasi_password'],
  });

const DashboardProfilesMain = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState<
    Partial<Record<keyof typeof userData, string>>
  >({});
  const [warning, setWarning] = useState('');
  const [userData, setUserData] = useState({
    id_pengguna: '',
    nama_depan_pengguna: '',
    nama_belakang_pengguna: '',
    email_pengguna: '',
    nomor_telepon_pengguna: '',
    jenisKelamin: 0,
    avatar: '',
    tanggal_lahir_pengguna: '',
    password: '',
    konfirmasi_password: '',
    file: null as File | null,
  });
  const [loading, setLoading] = useState(false);
  const [displayedData, setDisplayedData] = useState({
    id_pengguna: '',
    nama_depan_pengguna: '',
    nama_belakang_pengguna: '',
    email_pengguna: '',
    nomor_telepon_pengguna: '',
    jenisKelamin: null,
    avatar: '',
    tanggal_lahir_pengguna: '',
  });
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const router = useRouter();

  const handleChange = (e: any) => {
    const { name, value } = e?.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const baseURL =
    process.env.NEXT_PUBLIC_API_BASE_URL_FILE ||
    'http://localhost:2000/uploads';

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getUserProfile();
        if (response.success && response.data?.user) {
          setUserData(response.data.user);
          setDisplayedData(response.data.user);
          setAvatarPreview(`${baseURL}/users/${response.data.user.avatar}`);
        } else {
          throw new Error('Failed to fetch profile');
        }
      } catch (error) {
        console.error('Profile fetch error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const selectGender = (jenisKelamin: 0 | 1) => {
    setUserData((prev) => ({ ...prev, jenisKelamin }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setUserData((prev) => ({
        ...prev,
        file,
      }));
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const result = schema.safeParse(userData);

    if (!result.success) {
      const fieldErrors: any = {};
      result.error.errors.forEach((err) => {
        const fieldName = err.path[0] as keyof typeof userData;
        fieldErrors[fieldName] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    const form = new FormData();

    form.append('firstName', userData.nama_depan_pengguna);
    form.append('lastName', userData.nama_belakang_pengguna);
    form.append('email', userData.email_pengguna);
    form.append('phoneNumber', userData.nomor_telepon_pengguna);
    form.append('dateOfBirth', userData.tanggal_lahir_pengguna);
    form.append('gender', userData.jenisKelamin?.toString() || '');

    if (userData.password) {
      form.append('password', userData.password);
      form.append('confirmPassword', userData.konfirmasi_password);
    }

    if (userData.file) {
      form.append('avatar', userData.file);
    }

    console.log(userData);

    try {
      const result = await updateProfile(form);
      if (result.success === false) {
        setWarning(result.message);
      } else {
        console.log(result.data.pengguna);
        setUserData((prev) => ({
          ...prev,
          nama_depan_pengguna: result.data.pengguna.firstName,
          nama_belakang_pengguna: result.data.pengguna.lastName,
          email_pengguna: result.data.pengguna.email,
          nomor_telepon_pengguna: result.data.pengguna.phoneNumber,
          tanggal_lahir_pengguna:
            result.data.pengguna.dateOfBirth ?? prev.tanggal_lahir_pengguna,
          jenisKelamin: result.data.pengguna.gender,
          avatar: result.data.pengguna.avatar,
          password: '',
          konfirmasi_password: '',
          file: null,
        }));
        setMessage('Berhasil update profil');
      }
    } catch (error) {
      console.error('Submit error:', error);
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

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

  return (
    <main className='p-10 bg-white min-h-scree mx-12'>
      {message && (
        <div className='fixed top-4 left-1/2 transform -translate-x-1/2 bg-[#78D14D] text-white px-4 py-2 rounded-md shadow-lg z-50'>
          {message}
        </div>
      )}
      <section className='w-full'>
        <div
          className='w-full flex flex-row justify-start items-center gap-[1rem] mb-[2.3rem] cursor-pointer'
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

      <h1 className='text-3xl font-semibold text-[#50B34B] mb-6'>
        Profil Anda
      </h1>

      <div className='bg-white rounded-2xl p-6 py-16 flex flex-col md:flex-row gap-8 border border-black'>
        <div className='flex flex-col items-center md:w-1/3 text-center gap-2'>
          <div className='w-32 h-32 relative mb-4 rounded-xl overflow-hidden'>
            {avatarPreview ? (
              <Image
                src={avatarPreview}
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
          <h2 className='text-xl font-semibold'>Foto Profil</h2>
          <label
            htmlFor='avatar'
            className='block w-1/2 bg-[#F2F2F2] rounded-lg py-[1.1rem] px-[1.1rem] text-gray-500 cursor-pointer text-center'
          >
            {'Upload Foto Profil'}
          </label>
          <input
            id='avatar'
            name='avatar'
            type='file'
            className='hidden'
            onChange={handleAvatarChange}
          />
        </div>

        <div className='flex-1'>
          <form action=''>
            <div className='space-y-6'>
              <div className='space-y-4'>
                <h3 className='text-lg font-semibold text-gray-800 border-b pb-2'>
                  Informasi Pribadi
                </h3>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div className='flex items-center space-x-3'>
                    <div className='flex flex-col justify-start items-start gap-2'>
                      <p className='text-sm text-gray-500'>Nama Depan</p>
                      <InputField
                        type='text'
                        value={userData.nama_depan_pengguna}
                        className='py-2'
                        name='nama_depan_pengguna'
                        onChange={handleChange}
                      ></InputField>
                    </div>
                  </div>

                  <div className='flex items-center space-x-3'>
                    <div className='flex flex-col justify-start items-start gap-2'>
                      <p className='text-sm text-gray-500'>Nama Belakang</p>
                      <InputField
                        type='text'
                        value={userData.nama_belakang_pengguna}
                        className='py-2'
                        name='nama_belakang_pengguna'
                        onChange={handleChange}
                      ></InputField>
                    </div>
                  </div>

                  <div className='flex items-center space-x-3'>
                    <div className='flex flex-col justify-start items-start gap-2'>
                      <p className='text-sm text-gray-500'>Jenis Kelamin</p>
                      <div className='grid grid-cols-2 items-center w-full gap-[0.75rem]'>
                        <button
                          type='button'
                          onClick={() => selectGender(0)}
                          className={`flex items-center justify-center gap-2 py-2 px-2 rounded-lg border ${
                            userData.jenisKelamin === 0
                              ? 'border-2 border-blue-500 bg-blue-50 text-blue-700'
                              : 'border border-gray-300 hover:border-gray-400'
                          } transition-all duration-200 font-medium cursor-pointer`}
                        >
                          Laki-Laki
                        </button>
                        <button
                          type='button'
                          onClick={() => selectGender(1)}
                          className={`flex items-center justify-center gap-2 py-2 px-2 rounded-lg border ${
                            userData.jenisKelamin === 1
                              ? 'border-2 border-pink-500 bg-pink-50 text-pink-700'
                              : 'border border-gray-300 hover:border-gray-400'
                          } transition-all duration-200 font-medium cursor-pointer`}
                        >
                          Perempuan
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className='flex items-center space-x-3'>
                    <div className='flex flex-col justify-start items-start gap-2'>
                      <p className='text-sm text-gray-500'>Tanggal Lahir</p>
                      <InputField
                        type='date'
                        value={
                          userData.tanggal_lahir_pengguna?.substring(0, 10) ??
                          ''
                        }
                        className='py-2'
                        name='tanggal_lahir_pengguna'
                        onChange={handleChange}
                      ></InputField>
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
                    <div className='flex flex-col justify-start items-start gap-2'>
                      <p className='text-sm text-gray-500'>Email</p>
                      <p className='font-medium'>{userData.email_pengguna}</p>
                    </div>
                  </div>

                  <div className='flex items-center space-x-3'>
                    <div className='flex flex-col justify-start items-start gap-2'>
                      <p className='text-sm text-gray-500'>Nomor Telepon</p>
                      <InputField
                        type='text'
                        value={userData.nomor_telepon_pengguna}
                        className='py-2'
                        name='nomor_telepon_pengguna'
                        onChange={handleChange}
                        maxLength={13}
                      ></InputField>
                    </div>
                  </div>
                </div>
              </div>

              <div className='space-y-4'>
                <h3 className='text-lg font-semibold text-gray-800 border-b pb-2'>
                  Credentials
                </h3>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div className='flex items-center space-x-3'>
                    <div className='flex flex-col justify-start items-start gap-2'>
                      <p className='text-sm text-gray-500'>Password</p>
                      <InputField
                        type='password'
                        value={userData.password}
                        placeholder='*******'
                        className='py-2'
                        name='password'
                        onChange={handleChange}
                        maxLength={13}
                      ></InputField>
                      <p className='text-sm text-gray-500'>
                        Kosongkan jika tidak ingin mengganti*
                      </p>
                    </div>
                  </div>

                  <div className='flex items-center space-x-3'>
                    <div className='flex flex-col justify-start items-start gap-2'>
                      <p className='text-sm text-gray-500'>
                        Konfirmasi Password
                      </p>
                      <InputField
                        type='password'
                        value={userData.konfirmasi_password}
                        placeholder='*******'
                        className='py-2'
                        name='konfirmasi_password'
                        onChange={handleChange}
                        maxLength={13}
                      ></InputField>
                      <p className='text-sm text-gray-500'>
                        Kosongkan jika tidak ingin mengganti*
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className='space-y-4'>
                <div className='text-lg font-semibold text-gray-800 border-b pb-2'></div>
                {warning && (
                  <div className='w-1/4 h-[3.5rem] bg-red-300 rounded-md flex flex-row justify-center items-center'>
                    <h1 className='text-white font-bold'>{warning}</h1>
                  </div>
                )}
                <ActionButton
                  textColor='#ffff'
                  disabled={loading}
                  onClickHandler={handleSubmit}
                  className='w-1/4 py-4 text-sm'
                >
                  {loading ? 'Loading...' : 'Simpan Perubahan'}
                </ActionButton>
              </div>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default DashboardProfilesMain;
