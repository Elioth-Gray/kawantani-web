'use client';

import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { ArrowLeft, CheckCircle, Trash } from '@phosphor-icons/react/dist/ssr';
import Image from 'next/image';
import { deleteArticle, getArticleById, verifyArticle } from '@/api/articleApi';
import {
  deleteWorkshop,
  getWorkshopById,
  verifyWorkshop,
} from '@/api/workshopApi';

export type Provinsi = {
  id_provinsi: number;
  nama_provinsi: string;
};

export type Kabupaten = {
  id_kabupaten: number;
  nama_kabupaten: string;
  type: string;
  id_provinsi: number;
  provinsi: Provinsi;
};

export type Facilitator = {
  id_facilitator: string;
  nama_facilitator: string;
  email_facilitator: string;
  nomor_telepon_facilitator: string;
  password_facilitator: string;
  tanggal_pembuatan_akun: string;
  alamat_lengkap_facilitator: string;
  avatar: string;
  status_aktif: boolean;
  id_kabupaten: number;
  kabupaten: Kabupaten; // tambahkan ini agar lengkap
};

export type Workshop = {
  id_workshop: string;
  judul_workshop: string;
  tanggal_workshop: string;
  alaamt_lengkap_workshop: string;
  deskripsi_workshop: string;
  harga_workshop: string;
  kapasitas: number;
  status_verifikasi: boolean;
  lat_lokasi: number;
  long_lokasi: number;
  gambar_workshop: string;
  status_aktif: boolean;
  id_facilitator: string;
  id_kabupaten: number;
  facilitator: Facilitator;
  kabupaten: Kabupaten;
};

const AdminWorkshopDetailMain = () => {
  const [workshop, setWorkshop] = useState<Workshop>();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const router = useRouter();
  const params = useParams();
  const id = params?.id || '';

  useEffect(() => {
    const fetchArticle = async () => {
      setInitialLoading(true);
      try {
        const response = await getWorkshopById(id as string);
        console.log(response);
        if (response.data) {
          setWorkshop(response.data);
        } else {
          console.error('Failed to load workshop:', response.message);
          alert('Gagal memuat data artikel');
        }
      } catch (error) {
        console.error('Error loading workshop:', error);
        alert('Terjadi kesalahan saat memuat data');
      } finally {
        setInitialLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  const getStatusBadge = (status: string) => {
    const baseClass = 'px-2 py-1 rounded-full text-xs font-semibold';
    switch (status) {
      case 'PUBLISHED':
        return `${baseClass} bg-green-100 text-green-800`;
      case 'DRAFT':
        return `${baseClass} bg-yellow-100 text-yellow-800`;
      default:
        return `${baseClass} bg-gray-100 text-gray-800`;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  function formatToRupiah(value: number | string): string {
    const number = typeof value === 'string' ? parseInt(value) : value;
    if (isNaN(number)) return 'Rp0';

    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(number);
  }

  const onVerifyWorkshop = async (id_workshop: string) => {
    setLoading(true);
    const confirmed = window.confirm(
      'Apakah kamu ingin memverifkasi workshop ini?',
    );
    if (!confirmed) return;

    try {
      const result = await verifyWorkshop(id_workshop);
      if (result.data) {
        alert('Berhasil memverifikasi workshop.');
        router.push('/admin/dashboard/workshops');
      } else {
        alert(result.message || 'Ada kesalahan');
      }
    } catch (error) {
      console.error('Error verify workshop:', error);
      alert('Ada kesalahan saat veridfikasi workshop');
    } finally {
      setLoading(false);
    }
  };

  const onDeleteWorkshop = async (id_workshop: string) => {
    setLoading(true);
    const confirmed = window.confirm(
      'Apakah kamu ingin menghapus workshop ini?',
    );
    if (!confirmed) return;

    try {
      const result = await deleteWorkshop(id_workshop);
      if (result.data) {
        alert('Berhasil menghapus workshop.');
        router.push('/admin/dashboard/workshops');
      } else {
        alert(result.message || 'Ada kesalahan');
      }
    } catch (error) {
      console.error('Error deleting workshop:', error);
      alert('Ada kesalahan saat menghapus workshop');
    } finally {
      setLoading(false);
    }
  };

  const getGoogleMapsEmbedUrlWithoutKey = (lat: number, lng: number) => {
    return `https://maps.google.com/maps?q=${lat},${lng}&hl=en&z=15&output=embed`;
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
          <h1 className='text-[2.25rem] font-semibold'>Detail Workshop</h1>
          <p>Lihat detail workshop pada sistem</p>
        </div>

        <div className='w-full h-76 grid grid-cols-2 gap-x-10'>
          <div className='col-span-1 w-full h-full  rounded-xl overflow-hidden'>
            <img
              src={
                workshop?.gambar_workshop
                  ? `http://localhost:2000/uploads/workshops/${workshop.gambar_workshop}`
                  : undefined
              }
              width={0}
              height={0}
              alt='workshop'
              className='w-full h-full object-cover'
            />
          </div>

          <div className='col-span-1 w-full h-full flex flex-col justify-start items-start gap-3'>
            <div className='w-full flex flex-col justify-start items-start gap-1'>
              <h1 className='text-[1.5rem] font-semibold'>
                {workshop?.judul_workshop || '-'}
              </h1>
              <p className='text-gray-400 text-sm'>
                ID: {workshop?.id_workshop || '-'}
              </p>
            </div>
            <div className='w-full flex flex-col justify-start items-start gap-2'>
              <p>
                Alamat:{' '}
                <span className='font-semibold'>
                  {workshop
                    ? `${workshop.alaamt_lengkap_workshop}, Kabupaten ${workshop.kabupaten.nama_kabupaten}, Provinsi ${workshop.kabupaten.provinsi.nama_provinsi}`
                    : '-'}
                </span>
              </p>
              <p>
                Tanggal Pelaksanaan:{' '}
                <span className='font-semibold'>
                  {workshop ? formatDate(workshop.tanggal_workshop) : '-'}
                </span>
              </p>
              <p>
                Harga Tiket:{' '}
                <span className='font-semibold'>
                  {workshop
                    ? `${formatToRupiah(workshop.harga_workshop)}/pax`
                    : '-'}
                </span>
              </p>
              <p>
                Kapasitas:{' '}
                <span className='font-semibold'>
                  {workshop ? `${workshop.kapasitas} Peserta` : '-'}
                </span>
              </p>
              <p>
                Status Verifikasi:{' '}
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    workshop?.status_verifikasi
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {workshop?.status_verifikasi
                    ? 'Terverifikasi'
                    : 'Belum Verifikasi'}
                </span>
              </p>
            </div>
            <div className='flex gap-4 mt-6'>
              {!workshop?.status_verifikasi && (
                <button
                  onClick={() => {
                    onDeleteWorkshop(workshop?.id_workshop || '');
                  }}
                  disabled={loading}
                  className='flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer'
                >
                  <Trash size={20} weight='bold' />
                  Hapus Workshop
                </button>
              )}
            </div>
          </div>
        </div>

        <div className='w-full h-76 grid grid-cols-2 gap-x-10 mt-[3.1rem]'>
          <div className='w-full mb-[3.1rem] mt-[3.1rem]'>
            <h1 className='text-[2rem] font-semibold'>Deskripsi Workshop</h1>
            <p>{workshop?.deskripsi_workshop || '-'}</p>
          </div>
          <div className='w-full mb-[3.1rem] mt-[3.1rem]'>
            <h1 className='text-[2rem] font-semibold'>Lokasi Workshop</h1>
            {workshop?.lat_lokasi && workshop?.long_lokasi ? (
              <iframe
                src={getGoogleMapsEmbedUrlWithoutKey(
                  workshop.lat_lokasi,
                  workshop.long_lokasi,
                )}
                width='100%'
                height='100%'
                style={{ border: 0 }}
                allowFullScreen={true}
                loading='lazy'
                referrerPolicy='no-referrer-when-downgrade'
                title={`Lokasi Workshop: ${workshop?.judul_workshop}`}
                aria-label={`Peta lokasi workshop ${workshop?.judul_workshop}`}
                className='w-full h-full rounded-lg'
              />
            ) : (
              <p className='text-gray-400'>Lokasi tidak tersedia</p>
            )}
          </div>
        </div>

        <div className='w-full h-76 grid grid-cols-2 gap-x-10 mt-[3.1rem]'>
          <div className='w-full mb-[3.1rem] mt-[3.1rem] col-span-2'>
            <h1 className='text-[2rem] font-semibold mb-2'>
              Informasi Penyelenggara
            </h1>
            <div className='w-full flex flex-col justify-start items-start gap-3'>
              <p>
                Nama Penyelenggara:{' '}
                <span className='font-semibold'>
                  {workshop ? workshop.facilitator.nama_facilitator : '-'}
                </span>
              </p>
              <p>
                Email Penyelenggara:{' '}
                <span className='font-semibold'>
                  {workshop ? workshop.facilitator.email_facilitator : '-'}
                </span>
              </p>
              <p>
                Nomor Telepon Penyelenggara:{' '}
                <span className='font-semibold'>
                  {workshop
                    ? workshop.facilitator.nomor_telepon_facilitator
                    : '-'}
                </span>
              </p>
              <p>
                Alamat Penyelenggara:{' '}
                <span className='font-semibold'>
                  {workshop
                    ? `${workshop.facilitator.alamat_lengkap_facilitator}, Kabupaten ${workshop.facilitator.kabupaten.nama_kabupaten}, Provinsi ${workshop.facilitator.kabupaten.provinsi.nama_provinsi}`
                    : '-'}
                </span>
              </p>
            </div>
          </div>
          <div className='w-full mb-[3.1rem] mt-[3.1rem]'></div>
        </div>
      </section>
    </main>
  );
};

export default AdminWorkshopDetailMain;
