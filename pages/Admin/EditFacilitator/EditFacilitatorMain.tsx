'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
import { getFacilitatorById, updateFacilitator } from '@/api/facilitatorApi';

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
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Password dan konfirmasi tidak sama',
    path: ['confirmPassword'],
  });

const EditFacilitatorMain = () => {
  const params = useParams();
  const id = params?.id || '';
  const router = useRouter();

  const [provinces, setProvinces] = useState<Provinces[]>([]);
  const [regencies, setRegencies] = useState<Regency[]>([]);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingRegencies, setLoadingRegencies] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    provinceId: 0,
    regencyId: 0,
    fullAddress: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof typeof formData, string>>
  >({});

  useEffect(() => {
    const loadProvinces = async () => {
      try {
        const response = await getAllProvinces();
        if (response.success) {
          setProvinces(response.data.provinces);
        } else {
          console.error('Failed to load provinces:', response.message);
        }
      } catch (error) {
        console.error('Error loading provinces:', error);
      }
    };

    loadProvinces();
  }, []);

  useEffect(() => {
    const loadFacilitatorData = async () => {
      setInitialLoading(true);
      try {
        const response = await getFacilitatorById(id as string);

        if (response.success) {
          const facilitator = response.data.facilitator;

          setPhoneNumber(facilitator.nomor_telepon_facilitator);

          const provinceId = facilitator.kabupaten.provinsi.id_provinsi;
          const regencyId = facilitator.kabupaten.id_kabupaten;

          console.log('Loaded facilitator data:', facilitator);
          console.log('Province ID:', provinceId, 'Regency ID:', regencyId);

          await loadRegencies(provinceId);

          setFormData({
            name: facilitator.nama_facilitator,
            email: facilitator.email_facilitator,
            phoneNumber: facilitator.nomor_telepon_facilitator,
            provinceId: provinceId,
            regencyId: regencyId,
            fullAddress: facilitator.alamat_lengkap_facilitator,
            password: facilitator.password_facilitator,
            confirmPassword: facilitator.password_facilitator,
          });
        } else {
          console.error('Failed to load facilitator:', response.message);
        }
      } catch (error) {
        console.error('Error loading facilitator:', error);
      } finally {
        setInitialLoading(false);
      }
    };

    if (id) {
      loadFacilitatorData();
    }
  }, [id]);

  const loadRegencies = async (provinceId: number) => {
    if (!provinceId) return;

    setLoadingRegencies(true);
    try {
      const response = await getProvinceRegency(provinceId);

      if (response.success) {
        console.log('Loaded regencies:', response.data.regencies);
        setRegencies(response.data.regencies);
      } else {
        console.error('Failed to load regencies:', response.message);
        setRegencies([]);
      }
    } catch (error) {
      console.error('Error loading regencies:', error);
      setRegencies([]);
    } finally {
      setLoadingRegencies(false);
    }
  };

  const handleProvinceChange = async (value: string) => {
    const provinceId = parseInt(value, 10);

    setFormData((prev) => ({
      ...prev,
      provinceId,
      regencyId: 0,
    }));

    await loadRegencies(provinceId);
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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

    try {
      const payload = {
        id: id as string,
        name: formData.name,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        fullAddress: formData.fullAddress,
        regencyId: formData.regencyId,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      };

      if (typeof id !== 'string') {
        console.error('Invalid ID');
        return;
      }

      const result = await updateFacilitator(id, payload);

      if (!result.success) {
        alert(result.message);
      } else {
        alert(result.message);
        router.push('/admin/dashboard/facilitators');
      }
    } catch (err) {
      alert('Terjadi kesalahan');
      console.error('Error updating facilitator:', err);
    } finally {
      setLoading(false);
    }
  };

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
          <h1 className='text-[2.25rem] font-semibold'>Edit Facilitator</h1>
          <p>Perbarui data facilitator di sistem</p>
        </div>

        {initialLoading ? (
          <div className='flex justify-center items-center py-10'>
            <p>Menunggu data...</p>
          </div>
        ) : (
          <form className='w-full' onSubmit={handleSubmit}>
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
                  {/* Force re-render with key */}
                  <Select
                    key={`province-select-${formData.provinceId}`}
                    value={
                      formData.provinceId
                        ? formData.provinceId.toString()
                        : undefined
                    }
                    onValueChange={handleProvinceChange}
                    disabled={loading || initialLoading}
                  >
                    <SelectTrigger className='w-[19rem] h-[2.5rem]'>
                      <SelectValue placeholder='Pilih Provinsi' />
                    </SelectTrigger>
                    <SelectContent>
                      {provinces.map((province) => (
                        <SelectItem
                          key={province.id_provinsi}
                          value={province.id_provinsi.toString()}
                        >
                          {province.nama_provinsi}
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
                  {/* Force re-render with key */}
                  <Select
                    key={`regency-select-${formData.provinceId}-${formData.regencyId}-${regencies.length}`}
                    value={
                      formData.regencyId
                        ? formData.regencyId.toString()
                        : undefined
                    }
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        regencyId: parseInt(value, 10),
                      }))
                    }
                    disabled={
                      loading ||
                      !formData.provinceId ||
                      loadingRegencies ||
                      initialLoading
                    }
                  >
                    <SelectTrigger className='w-[19rem] h-[2.5rem]'>
                      <SelectValue
                        placeholder={
                          loadingRegencies ? 'Loading...' : 'Pilih Kabupaten'
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {regencies.map((regency) => (
                        <SelectItem
                          key={regency.id_kabupaten}
                          value={regency.id_kabupaten.toString()}
                        >
                          {regency.nama_kabupaten}
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
                className='py-[0.5rem] px-[0.8rem] bg-white text-black rounded-lg font-semibold w-fit cursor-pointer w-full'
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Perbarui Fasilitator'}
              </button>
            </div>
          </form>
        )}
      </section>
    </main>
  );
};

export default EditFacilitatorMain;
