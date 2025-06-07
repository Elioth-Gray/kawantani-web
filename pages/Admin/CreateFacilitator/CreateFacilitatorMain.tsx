'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
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
import { getAllProvinces, getProvinceRegency } from '@/api/locationApi';
import { createFacilitator } from '@/api/facilitatorApi';
import { User } from '@phosphor-icons/react/dist/ssr';

type Provinces = {
  id_provinsi: number;
  nama_provinsi: string;
};

type Regency = {
  id_kabupaten: number;
  nama_kabupaten: string;
};

const facilitatorSchema = z
  .object({
    name: z.string().min(1, 'Nama wajib diisi'),
    email: z.string().email('Email tidak valid').min(1, 'Email wajib diisi'),
    phoneNumber: z.string().min(1, 'Nomor telepon wajib diisi'),
    provinceId: z.number().min(2, { message: 'Provinsi wajib dipilih' }),
    regencyId: z.number().min(2, { message: 'Kabupaten wajib dipilih' }),
    fullAddress: z.string().min(1, 'Alamat wajib diisi'),
    password: z.string().min(6, 'Password minimal 6 karakter'),
    confirmPassword: z
      .string()
      .min(6, 'Konfirmasi password minimal 6 karakter'),
    // Buat file optional di Zod karena kita validasi manual
    file: z
      .instanceof(File)
      .refine(
        (file) => file.size <= 5 * 1024 * 1024, // 5MB
        'Ukuran file maksimal 5MB',
      )
      .refine(
        (file) => ['image/jpeg', 'image/png', 'image/jpg'].includes(file.type),
        'Format file harus JPG, JPEG, atau PNG',
      )
      .optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Password dan konfirmasi tidak sama',
    path: ['confirmPassword'],
  });

const CreateFacilitatorsMain = () => {
  const [provinces, setProvinces] = useState<Provinces[]>([]);
  const [regencies, setRegencies] = useState<Regency[]>([]);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [selectedProvince, setSelectedProvince] = useState<number | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);

  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    phoneNumber: string;
    provinceId: number;
    regencyId: number;
    fullAddress: string;
    password: string;
    confirmPassword: string;
    file?: File | null;
  }>({
    name: '',
    email: '',
    phoneNumber: '',
    provinceId: 0,
    regencyId: 0,
    fullAddress: '',
    password: '',
    confirmPassword: '',
    file: null,
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof typeof formData, string>>
  >({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [phoneNumber, setPhoneNumber] = useState(formData.phoneNumber);

  useEffect(() => {
    const fetchProvinces = async () => {
      setInitialLoading(true);
      try {
        const response = await getAllProvinces();
        setProvinces(response.data.provinces);
      } catch (error) {
        console.error('Failed to fetch provinces:', error);
      } finally {
        setInitialLoading(false);
      }
    };
    fetchProvinces();
  }, []);

  useEffect(() => {
    const fetchRegencies = async () => {
      if (selectedProvince === null) return;
      try {
        const response = await getProvinceRegency(selectedProvince);
        setRegencies(response.data.regencies);
      } catch (error) {
        console.error('Failed to fetch regencies:', error);
      }
    };
    fetchRegencies();
  }, [selectedProvince]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= 13) {
      setPhoneNumber(value);
      setFormData((prev) => ({ ...prev, phoneNumber: value }));
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

      // Clear file error ketika user memilih file
      if (errors.file) {
        setErrors((prev) => ({ ...prev, file: undefined }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Manual validation untuk file sebelum Zod validation
    if (!formData.file) {
      setErrors((prev) => ({ ...prev, file: 'Foto profil wajib diunggah' }));
      return;
    }

    const parsed = facilitatorSchema.safeParse(formData);

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
    form.append('name', formData.name);
    form.append('email', formData.email);
    form.append('phoneNumber', formData.phoneNumber);
    form.append('regencyId', formData.regencyId?.toString() || '');
    form.append('password', formData.password);
    form.append('confirmPassword', formData.confirmPassword);
    form.append('fullAddress', formData.fullAddress);
    if (formData.file) {
      form.append('avatar', formData.file);
    }
    try {
      const result = await createFacilitator(form);
      if (result.success == false) {
        alert(result.message);
        setLoading(false);
      } else {
        alert(result.message);
        router.push('/admin/dashboard/facilitators');
      }
    } catch (err) {
      alert('Terjadi kesalahan');
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
            <p>Memuat halaman...</p>
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
          <h1 className='text-[2.25rem] font-semibold'>Tambah Facilitator</h1>
          <p>Masukkan data facilitator baru ke sistem</p>
        </div>

        <form className='w-full' onSubmit={handleSubmit}>
          <div className='flex flex-col justify-center items-center w-full mb-10'>
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
            {/* Input Avatar */}
            <div className='w-full max-w-sm'>
              <Input
                type='file'
                accept='image/*'
                onChange={handleAvatarChange}
                className='text-white w-full'
              />
              {errors.file && (
                <p className='text-red-500 text-sm mt-1'>{errors.file}</p>
              )}
            </div>
          </div>
          <div className='flex flex-col gap-[2.1rem] w-full'>
            <div className='flex flex-row gap-[3.5rem]'>
              <div className='flex flex-col gap-[0.6rem]'>
                <Label className='text-[1.25rem]'>Nama</Label>
                <Input
                  name='name'
                  value={formData.name}
                  onChange={handleChange}
                  placeholder='Nama Facilitator'
                  className='w-[19rem] h-[2.5rem]'
                />
                {errors.name && (
                  <p className='text-red-500 text-sm'>{errors.name}</p>
                )}
              </div>
              <div className='flex flex-col gap-[0.6rem]'>
                <Label className='text-[1.25rem]'>Email</Label>
                <Input
                  name='email'
                  value={formData.email}
                  onChange={handleChange}
                  placeholder='Email Facilitator'
                  className='w-[19rem] h-[2.5rem]'
                />
                {errors.email && (
                  <p className='text-red-500 text-sm'>{errors.email}</p>
                )}
              </div>
              <div className='flex flex-col gap-[0.6rem]'>
                <Label className='text-[1.25rem]'>Nomor Telepon</Label>
                <Input
                  name='phoneNumber'
                  value={phoneNumber}
                  onChange={handlePhoneNumberChange}
                  placeholder='Nomor Telepon Facilitator'
                  className='w-[19rem] h-[2.5rem]'
                />
                {errors.phoneNumber && (
                  <p className='text-red-500 text-sm'>{errors.phoneNumber}</p>
                )}
              </div>
            </div>

            <div className='flex flex-row gap-[3.5rem]'>
              <div className='flex flex-col gap-[0.6rem]'>
                <Label className='text-[1.25rem]'>Provinsi</Label>
                <Select
                  onValueChange={(value) => {
                    setSelectedProvince(parseInt(value, 10));
                    setFormData((prev) => ({
                      ...prev,
                      provinceId: parseInt(value, 10),
                    }));
                  }}
                >
                  <SelectTrigger className='w-[19rem] h-[2.5rem]'>
                    <SelectValue placeholder='Pilih Provinsi' />
                  </SelectTrigger>
                  <SelectContent>
                    {provinces.map((provinsi) => (
                      <SelectItem
                        key={provinsi.id_provinsi}
                        value={provinsi.id_provinsi.toString()}
                      >
                        {provinsi.nama_provinsi}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.provinceId && (
                  <p className='text-red-500 text-sm'>{errors.provinceId}</p>
                )}
              </div>
              <div className='flex flex-col gap-[0.6rem]'>
                <Label className='text-[1.25rem]'>Kabupaten</Label>
                <Select
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      regencyId: parseInt(value, 10),
                    }))
                  }
                >
                  <SelectTrigger className='w-[19rem] h-[2.5rem]'>
                    <SelectValue placeholder='Pilih Kabupaten' />
                  </SelectTrigger>
                  <SelectContent>
                    {regencies.map((kabupaten) => (
                      <SelectItem
                        key={kabupaten.id_kabupaten}
                        value={kabupaten.id_kabupaten.toString()}
                      >
                        {kabupaten.nama_kabupaten}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.regencyId && (
                  <p className='text-red-500 text-sm'>{errors.regencyId}</p>
                )}
              </div>
              <div className='flex flex-col gap-[0.6rem]'>
                <Label className='text-[1.25rem]'>Alamat Lengkap</Label>
                <Input
                  name='fullAddress'
                  value={formData.fullAddress}
                  onChange={handleChange}
                  placeholder='Alamat Lengkap'
                  className='w-[19rem] h-[2.5rem]'
                />
                {errors.fullAddress && (
                  <p className='text-red-500 text-sm'>{errors.fullAddress}</p>
                )}
              </div>
            </div>

            <div className='flex flex-row gap-[3.5rem]'>
              <div className='flex flex-col gap-[0.6rem]'>
                <Label className='text-[1.25rem]'>Password</Label>
                <Input
                  name='password'
                  value={formData.password}
                  onChange={handleChange}
                  type='password'
                  placeholder='Password'
                  className='w-[19rem] h-[2.5rem]'
                />
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
                  placeholder='Konfirmasi Password'
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
              {loading ? 'Menambah facilitator...' : 'Tambah Fasilitator'}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
};

export default CreateFacilitatorsMain;
