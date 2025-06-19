'use client';

import React, { useEffect, useState } from 'react';
import {
  Calendar,
  Timer,
  MapPin,
  ArrowLeft,
} from '@phosphor-icons/react/dist/ssr';
import Image from 'next/image';
import ActionButton from '@/components/buttons/ActionButton';
import { useRouter, useParams } from 'next/navigation';
import {
  getRegisteredWorkshopDetail,
  getWorkshopById,
} from '@/api/workshopApi';
import { TWorkshopDetailResponse } from '@/types/workshopTypes';

// Types untuk Provinsi
export interface TProvinsi {
  id: number;
  nama_provinsi: string;
}

// Types untuk Kabupaten
export interface TKabupaten {
  id: number;
  nama_kabupaten: string;
  provinsi: TProvinsi;
}

// Types untuk data workshop
export interface TWorkshopData {
  id: number;
  judul_workshop: string;
  deskripsi_workshop?: string;
  tanggal_workshop: string;
  waktu_mulai: string;
  waktu_berakhir: string;
  harga_workshop: number;
  kapasitas_peserta?: number;
  gambar_workshop?: string;
  alaamt_lengkap_workshop: string; // Note: typo di original code "alaamt"
  id_kabupaten: number;
  kabupaten: TKabupaten;
  created_at?: string;
  updated_at?: string;
}

// Types untuk response workshop
export interface TWorkshopResponse {
  success: boolean;
  message: string;
  data: TWorkshopData;
}

// Types untuk data registrasi
export interface TRegistrationData {
  id: number;
  nama_depan_peserta: string;
  nama_belakang_peserta: string;
  email_peserta: string;
  nomor_telepon_peserta?: string;
  jenis_kelamin_peserta: number;
  nomor_tiket: string;
  tanggal_pendaftaran: string;
  id_metode_pembayaran: number;
  status_pembayaran: boolean;
  id_workshop: number;
  created_at?: string;
  updated_at?: string;
}

// Types untuk response registrasi
export interface TRegistrationResponse {
  success: boolean;
  message: string;
  data: TRegistrationData[];
}

const UserWorkshopMain = () => {
  const router = useRouter();
  const params = useParams();
  const [workshop, setWorkshop] = useState<TWorkshopResponse>(
    {} as TWorkshopResponse,
  );
  const [registrationData, setRegistrationData] = useState<TRegistrationData>(
    {} as TRegistrationData,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'WIB' : 'WIB';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Fetch registered workshop details
        const registeredResponse = await getRegisteredWorkshopDetail(
          params?.id as string,
        );

        if (
          registeredResponse &&
          registeredResponse.data &&
          registeredResponse.data.length > 0
        ) {
          const registrationInfo = registeredResponse.data[0]; // Get first registration
          setRegistrationData(registrationInfo);

          // Fetch workshop details
          const workshopResponse = await getWorkshopById(params?.id as string);
          if (workshopResponse && workshopResponse.data) {
            setWorkshop(workshopResponse);
          }
        } else {
          setError('Data pendaftaran workshop tidak ditemukan');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Terjadi kesalahan saat memuat data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [params?.id]);

  useEffect(() => {
    const fetchWorkshop = async () => {
      try {
        const response = await getWorkshopById(params?.id as string);
        if (response.data) {
          setWorkshop(response.data);
        } else {
          setError(response.message || 'Gagal memuat detail workshop');
        }
      } catch (err) {
        setError('Terjadi kesalahan saat memuat data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkshop();
  }, [params?.id]);

  const getPaymentMethodName = (id: number) => {
    switch (id) {
      case 1:
        return 'Bank Transfer';
      case 2:
        return 'OVO';
      case 3:
        return 'Gopay';
      case 4:
        return 'Dana';
      default:
        return 'Tidak diketahui';
    }
  };

  const getGenderText = (gender: number) => {
    switch (gender) {
      case 1:
        return 'Laki-Laki';
      case 2:
        return 'Perempuan';
      default:
        return 'Tidak diketahui';
    }
  };

  const baseURL =
    process.env.NEXT_PUBLIC_API_BASE_URL_FILE ||
    'http://localhost:2000/uploads';

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4'></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <div className='text-center'>
          <p className='text-red-500 mb-4'>{error}</p>
          <button
            onClick={() => router.back()}
            className='px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600'
          >
            Kembali
          </button>
        </div>
      </div>
    );
  }

  if (!workshop || !workshop.data || !registrationData) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <div className='text-center'>
          <p>Data not found</p>
          <button
            onClick={() => router.back()}
            className='mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600'
          >
            Kembali
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className='px-[8.1rem] py-[5.3rem]'>
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
                  : {registrationData.nama_depan_peserta}{' '}
                  {registrationData.nama_belakang_peserta}
                </p>
              </div>
              <div className='flex flex-row justify-between items-center w-full'>
                <p>Email</p>
                <p>: {registrationData.email_peserta}</p>
              </div>
              <div className='flex flex-row justify-between items-center w-full'>
                <p>Nomor Telepon</p>
                <p>
                  : {registrationData.nomor_telepon_peserta || 'Belum diisi'}
                </p>
              </div>
              <div className='flex flex-row justify-between items-center w-full'>
                <p>Jenis Kelamin</p>
                <p>: {getGenderText(registrationData.jenis_kelamin_peserta)}</p>
              </div>
              <div className='flex flex-row justify-between items-center w-full'>
                <p>Nomor Tiket</p>
                <p>: {registrationData.nomor_tiket}</p>
              </div>
              <div className='flex flex-row justify-between items-center w-full'>
                <p>Tanggal Pendaftaran</p>
                <p>
                  :{' '}
                  {new Date(
                    registrationData.tanggal_pendaftaran,
                  ).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>

            <div className='flex flex-col justify-start items-start gap-[0.3rem] w-[60%]'>
              <h1 className='text-[1.25rem] font-semibold'>
                Informasi Pembayaran:
              </h1>
              <div className='flex flex-row justify-between items-center w-full'>
                <p>Metode Pembayaran</p>
                <p>
                  :{' '}
                  {getPaymentMethodName(registrationData.id_metode_pembayaran)}
                </p>
              </div>
              <div className='flex flex-row justify-between items-center w-full'>
                <p>Total Harga</p>
                <p>
                  : Rp.
                  {workshop.data.harga_workshop?.toLocaleString('id-ID') || '0'}
                  ,00
                </p>
              </div>
              <div className='flex flex-row justify-between items-center w-full'>
                <p>Status Pembayaran</p>
                <p
                  className={
                    registrationData.status_pembayaran
                      ? 'text-green-600'
                      : 'text-red-600'
                  }
                >
                  :{' '}
                  {registrationData.status_pembayaran
                    ? 'Berhasil'
                    : 'Belum Lunas'}
                </p>
              </div>
            </div>
          </div>

          <div className='col-span-1 flex flex-row justify-end items-start w-full'>
            <div className='w-[80%] flex flex-col justify-start items-start gap-[2.25rem]'>
              <Image
                className='object-cover w-full h-[16.8rem] rounded-lg'
                width={545}
                height={307}
                src={
                  workshop.data.gambar_workshop
                    ? `${baseURL}/workshops/${workshop.data.gambar_workshop}`
                    : '/images/workshop-image.webp'
                }
                alt={workshop.data.judul_workshop || 'workshop image'}
                quality={100}
                unoptimized
              />
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
                    {workshop.data.alaamt_lengkap_workshop},{' '}
                    {workshop.data.kabupaten.nama_kabupaten},{' '}
                    {workshop.data.kabupaten.provinsi.nama_provinsi}
                  </p>
                </div>
                <div className='flex flex-row justify-start items-center gap-[0.75rem]'>
                  <Timer size={26} color='#000000' />
                  <p className='text-[0.75rem]'>
                    {workshop.data.waktu_mulai} - {workshop.data.waktu_berakhir}{' '}
                    WIB
                  </p>
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
