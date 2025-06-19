'use client';

import React, { useEffect, useState } from 'react';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { z } from 'zod';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft } from '@phosphor-icons/react/dist/ssr';
import { getUserById, updateUser } from '@/api/userApi';

const baseURL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:2000/api';

const userSchema = z
  .object({
    firstName: z.string().min(1, 'Nama depan wajib diisi'),
    lastName: z.string().min(1, 'Nama belakang wajib diisi'),
    email: z.string().email('Email tidak valid').min(1, 'Email wajib diisi'),
    phoneNumber: z.string().min(1, 'Nomor telepon wajib diisi'),
    dateOfBirth: z.string().min(1, 'Tanggal Lahir Harus diisi!'),
    gender: z.number().min(0, { message: 'Jenis kelamin harus diisi!' }),
    password: z.string(),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Password dan konfirmasi tidak sama',
    path: ['confirmPassword'],
  });

const EditUserMain = () => {
  const baseURL =
    process.env.NEXT_PUBLIC_API_BASE_URL_FILE ||
    'http://localhost:2000/uploads';

  const params = useParams();
  const id = params?.id || '';
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const [formData, setFormData] = useState<{
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    dateOfBirth: string;
    gender: number;
    password: string;
    confirmPassword: string;
    file?: File | null;
  }>({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    dateOfBirth: '',
    password: '',
    confirmPassword: '',
    gender: 0,
    file: null,
  });
  const [user, setUser] = useState<[{}]>([{}]);

  const [errors, setErrors] = useState<
    Partial<Record<keyof typeof formData, string>>
  >({});

  useEffect(() => {
    const loadUserData = async () => {
      setInitialLoading(true);
      try {
        const response = await getUserById(id as string);
        const user = response.data;
        if (response.data) {
          setFormData({
            firstName: user.nama_depan_pengguna || '',
            lastName: user.nama_belakang_pengguna || '',
            email: user.email_pengguna || '',
            phoneNumber: user.nomor_telepon_pengguna || '',
            dateOfBirth: user.tanggal_lahir_pengguna
              ? new Date(user.tanggal_lahir_pengguna)
                  .toISOString()
                  .split('T')[0]
              : '',
            password: '',
            confirmPassword: '',
            gender: user.jenisKelamin ?? 0,
          });
          setAvatarPreview(`${baseURL}/users/${user.avatar}`);
        } else {
          console.error('Failed to load user:', response.message);
          alert('Gagal memuat data pengguna');
        }
        setUser(user);
      } catch (error) {
        console.error('Error loading user:', error);
        alert('Terjadi kesalahan saat memuat data');
      } finally {
        setInitialLoading(false);
      }
    };

    if (id) {
      loadUserData();
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'phoneNumber' && value.length > 13) {
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof typeof formData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setFormData((prev) => ({
        ...prev,
        file,
      }));
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const parsed = userSchema.safeParse(formData);

    if (!parsed.success) {
      const fieldErrors: any = {};
      parsed.error.errors.forEach((err) => {
        const fieldName = err.path[0] as keyof typeof formData;
        fieldErrors[fieldName] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

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
      const result = await updateUser(form, id as string);
      if (!result.data) {
        alert(result.message);
      } else {
        alert(result.message);
        router.push('/admin/dashboard/users');
      }
    } catch (error) {
      alert('Terjadi kesalahan');
      console.error('Error updating facilitator:', error);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <main className='w-full h-screen px-[5.1rem] bg-[#09090B] text-white overflow-auto'>
        <div className='flex items-center justify-center h-full'>
          <div className='text-center'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4'></div>
            <p>Memuat data pengguna...</p>
          </div>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className='w-full h-screen px-[5.1rem] bg-[#09090B] text-white overflow-auto'>
        <div className='flex items-center justify-center h-full'>
          <div className='text-center'>
            <p className='text-red-400 mb-4'>Pengguna tidak ditemukan</p>
            <button
              onClick={() => router.back()}
              className='px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg'
            >
              Kembali
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className='w-full h-screen px-[5.1rem] bg-[#09090B] text-white overflow-auto'>
      <section className='w-full h-fit my-[4.5rem] mb-[4.5rem]'>
        <div
          className='w-full flex flex-row justify-start items-center gap-[1rem] mb-[2.3rem] cursor-pointer'
          onClick={() => router.back()}
        >
          <ArrowLeft size={24} color='#fff' weight='bold' />
          <p>Kembali</p>
        </div>

        <div className='w-full mb-[3.1rem]'>
          <h1 className='text-[2.25rem] font-semibold'>Edit Pengguna</h1>
          <p>Perbarui data pengguna di sistem</p>
        </div>

        {initialLoading ? (
          <div className='flex justify-center items-center py-10'>
            <p>Memuat data pengguna...</p>
          </div>
        ) : (
          <form className='w-full' onSubmit={handleSubmit}>
            <div className='flex flex-col justify-center items-center w-full mb-10'>
              {avatarPreview && (
                <div className='flex flex-col justify-start items-center gap-3 mb-4'>
                  <img
                    src={avatarPreview}
                    alt='Avatar Pengguna'
                    className='w-32 h-32 rounded-full object-cover border-2 border-white'
                  />
                  <p>Foto Profil</p>
                </div>
              )}
              {/* Input Avatar */}
              <div>
                <Input
                  type='file'
                  accept='image/*'
                  onChange={handleAvatarChange}
                  className='text-white w-full'
                />
              </div>
            </div>
            <div className='flex flex-col gap-[2.1rem] w-full'>
              {/* Baris Nama dan Email */}
              <div className='flex flex-row gap-[3.5rem]'>
                <div className='flex flex-col gap-[0.6rem]'>
                  <Label className='text-[1.25rem]'>Nama Depan</Label>
                  <Input
                    name='firstName'
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder='Nama Depan'
                    className='w-[19rem] h-[2.5rem]'
                  />
                  {errors.firstName && (
                    <p className='text-red-500 text-sm'>{errors.firstName}</p>
                  )}
                </div>

                <div className='flex flex-col gap-[0.6rem]'>
                  <Label className='text-[1.25rem]'>Nama Belakang</Label>
                  <Input
                    name='lastName'
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder='Nama Belakang'
                    className='w-[19rem] h-[2.5rem]'
                  />
                  {errors.lastName && (
                    <p className='text-red-500 text-sm'>{errors.lastName}</p>
                  )}
                </div>

                <div className='flex flex-col gap-[0.6rem]'>
                  <Label className='text-[1.25rem]'>Email</Label>
                  <Input
                    name='email'
                    type='email'
                    value={formData.email}
                    onChange={handleChange}
                    placeholder='Email Pengguna'
                    className='w-[19rem] h-[2.5rem]'
                  />
                  {errors.email && (
                    <p className='text-red-500 text-sm'>{errors.email}</p>
                  )}
                </div>
              </div>

              {/* Telepon dan Tanggal Lahir */}
              <div className='flex flex-row gap-[3.5rem]'>
                <div className='flex flex-col gap-[0.6rem]'>
                  <Label className='text-[1.25rem]'>Nomor Telepon</Label>
                  <Input
                    name='phoneNumber'
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder='Nomor Telepon'
                    className='w-[19rem] h-[2.5rem]'
                    maxLength={13}
                  />
                  <p className='text-xs text-gray-400'>
                    Maksimal 13 digit ({formData.phoneNumber.length}/13)
                  </p>
                  {errors.phoneNumber && (
                    <p className='text-red-500 text-sm'>{errors.phoneNumber}</p>
                  )}
                </div>
                <div className='flex flex-col gap-[0.6rem]'>
                  <Label className='text-[1.25rem]'>Jenis Kelamin</Label>
                  <Select
                    value={formData.gender.toString()}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        gender: parseInt(value, 10),
                      }))
                    }
                    disabled={loading || initialLoading}
                  >
                    <SelectTrigger className='w-[19rem] h-[2.5rem]'>
                      <SelectValue placeholder='Pilih Jenis Kelamin' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='0'>Pria</SelectItem>
                      <SelectItem value='1'>Wanita</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.gender && (
                    <p className='text-red-500 text-sm'>{errors.gender}</p>
                  )}
                </div>

                <div className='flex flex-col gap-[0.6rem]'>
                  <Label className='text-[1.25rem]'>Tanggal Lahir</Label>
                  <Input
                    name='dateOfBirth'
                    type='date'
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className='w-[19rem] h-[2.5rem]'
                  />
                  {errors.dateOfBirth && (
                    <p className='text-red-500 text-sm'>{errors.dateOfBirth}</p>
                  )}
                </div>
              </div>

              {/* Password */}
              <div className='flex flex-row gap-[3.5rem]'>
                <div className='flex flex-col gap-[0.6rem]'>
                  <Label className='text-[1.25rem]'>Password Baru</Label>
                  <Input
                    name='password'
                    value={formData.password}
                    onChange={handleChange}
                    type='password'
                    placeholder='Password Baru (opsional)'
                    className='w-[19rem] h-[2.5rem]'
                  />
                  <p className='text-xs text-gray-400'>
                    Kosongkan jika tidak ingin mengubah password
                  </p>
                  {errors.password && (
                    <p className='text-red-500 text-sm'>{errors.password}</p>
                  )}
                </div>

                <div className='flex flex-col gap-[0.6rem]'>
                  <Label className='text-[1.25rem]'>Konfirmasi Password</Label>
                  <Input
                    name='confirmPassword'
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    type='password'
                    placeholder='Konfirmasi Password Baru'
                    className='w-[19rem] h-[2.5rem]'
                  />
                  {errors.confirmPassword && (
                    <p className='text-red-500 text-sm'>
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>

              <button
                type='submit'
                className='py-[0.8rem] px-[1.2rem] bg-white text-black rounded-lg font-semibold w-full hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer'
                disabled={loading}
              >
                {loading ? 'Memperbarui...' : 'Perbarui Pengguna'}
              </button>
            </div>
          </form>
        )}
      </section>
    </main>
  );
};

export default EditUserMain;
