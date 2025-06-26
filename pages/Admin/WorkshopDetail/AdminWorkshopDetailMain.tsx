'use client';

import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  CheckCircle,
  Trash,
  XCircle,
} from '@phosphor-icons/react/dist/ssr';
import Image from 'next/image';
import { deleteArticle, getArticleById, verifyArticle } from '@/api/articleApi';
import {
  deleteWorkshop,
  getWorkshopById,
  verifyWorkshop,
} from '@/api/workshopApi';

// Enum untuk status verifikasi workshop
enum StatusVerifikasiWorkshop {
  MENUNGGU = 'MENUNGGU',
  DIVERIFIKASI = 'DIVERIFIKASI',
  DITOLAK = 'DITOLAK',
}

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
  kabupaten: Kabupaten;
};

export type Workshop = {
  id_workshop: string;
  judul_workshop: string;
  tanggal_workshop: string;
  alaamt_lengkap_workshop: string;
  deskripsi_workshop: string;
  harga_workshop: string;
  kapasitas: number;
  status_verifikasi: StatusVerifikasiWorkshop;
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
    const fetchWorkshop = async () => {
      setInitialLoading(true);
      try {
        const response = await getWorkshopById(id as string);
        if (response.data) {
          setWorkshop(response.data);
        } else {
          console.error('Failed to load workshop:', response.message);
          alert('Gagal memuat data workshop');
        }
      } catch (error) {
        console.error('Error loading workshop:', error);
        alert('Terjadi kesalahan saat memuat data');
      } finally {
        setInitialLoading(false);
      }
    };

    fetchWorkshop();
  }, [id]);

  const getStatusBadge = (status: StatusVerifikasiWorkshop) => {
    const baseClass = 'px-2 py-1 rounded-full text-xs font-semibold';

    switch (status) {
      case StatusVerifikasiWorkshop.DIVERIFIKASI:
        return `${baseClass} bg-green-100 text-green-800`;
      case StatusVerifikasiWorkshop.DITOLAK:
        return `${baseClass} bg-red-100 text-red-800`;
      case StatusVerifikasiWorkshop.MENUNGGU:
      default:
        return `${baseClass} bg-yellow-100 text-yellow-800`;
    }
  };

  const getStatusLabel = (status: StatusVerifikasiWorkshop) => {
    switch (status) {
      case StatusVerifikasiWorkshop.DIVERIFIKASI:
        return 'Diverifikasi';
      case StatusVerifikasiWorkshop.DITOLAK:
        return 'Ditolak';
      case StatusVerifikasiWorkshop.MENUNGGU:
      default:
        return 'Menunggu Verifikasi';
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
      'Apakah kamu ingin memverifikasi workshop ini?',
    );
    if (!confirmed) {
      setLoading(false);
      return;
    }

    try {
      const result = await verifyWorkshop(
        id_workshop,
        StatusVerifikasiWorkshop.DIVERIFIKASI,
      );
      if (result.data) {
        alert('Berhasil memverifikasi workshop.');
        // Update local state to reflect the change
        setWorkshop((prev) =>
          prev
            ? {
                ...prev,
                status_verifikasi: StatusVerifikasiWorkshop.DIVERIFIKASI,
              }
            : prev,
        );
      } else {
        alert(result.message || 'Ada kesalahan');
      }
    } catch (error) {
      console.error('Error verify workshop:', error);
      alert('Ada kesalahan saat verifikasi workshop');
    } finally {
      setLoading(false);
    }
  };

  const onRejectWorkshop = async (id_workshop: string) => {
    setLoading(true);
    const confirmed = window.confirm('Apakah kamu ingin menolak workshop ini?');
    if (!confirmed) {
      setLoading(false);
      return;
    }

    try {
      const result = await verifyWorkshop(
        id_workshop,
        StatusVerifikasiWorkshop.DITOLAK,
      );
      if (result.data) {
        alert('Berhasil menolak workshop.');
        // Update local state to reflect the change
        setWorkshop((prev) =>
          prev
            ? {
                ...prev,
                status_verifikasi: StatusVerifikasiWorkshop.DITOLAK,
              }
            : prev,
        );
      } else {
        alert(result.message || 'Ada kesalahan');
      }
    } catch (error) {
      console.error('Error reject workshop:', error);
      alert('Ada kesalahan saat menolak workshop');
    } finally {
      setLoading(false);
    }
  };

  const onDeleteWorkshop = async (id_workshop: string) => {
    setLoading(true);
    const confirmed = window.confirm(
      'Apakah kamu ingin menghapus workshop ini?',
    );
    if (!confirmed) {
      setLoading(false);
      return;
    }

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

  if (initialLoading) {
    return (
      <main className='w-full h-screen px-[5.1rem] bg-[#09090B] text-white overflow-auto'>
        <div className='flex items-center justify-center h-full'>
          <div className='text-center'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4'></div>
            <p>Memuat workshop...</p>
          </div>
        </div>
      </main>
    );
  }

  if (!workshop) {
    return (
      <main className='w-full h-screen px-[5.1rem] bg-[#09090B] text-white overflow-auto'>
        <div className='flex items-center justify-center h-full'>
          <div className='text-center'>
            <p className='text-red-400 mb-4'>Workshop tidak ditemukan</p>
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

  const baseURL =
    process.env.NEXT_PUBLIC_API_BASE_URL_FILE ||
    'http://localhost:2000/uploads';

  return (
    <main className='w-full h-screen px-[5.1rem] bg-[#09090B] text-white overflow-auto'>
      <section className='w-full h-fit my-[4.5rem] mb-[4.5rem]'>
        <div
          className='w-full flex flex-row justify-start items-center gap-[1rem] mb-[2.3rem] cursor-pointer hover:text-blue-400 transition-colors'
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
          <div className='col-span-1 w-full h-full rounded-xl overflow-hidden bg-zinc-900'>
            {workshop.gambar_workshop ? (
              <Image
                src={`${baseURL}/workshops/${workshop.gambar_workshop}`}
                alt={workshop.judul_workshop}
                width={800}
                height={600}
                className='w-full h-full object-cover'
              />
            ) : (
              <div className='w-full h-full flex items-center justify-center text-zinc-400'>
                <p>Tidak ada gambar</p>
              </div>
            )}
          </div>

          <div className='col-span-1 w-full h-full flex flex-col justify-start items-start gap-3'>
            <div className='w-full flex flex-col justify-start items-start gap-1'>
              <h1 className='text-[1.5rem] font-semibold'>
                {workshop.judul_workshop}
              </h1>
              <p className='text-gray-400 text-sm'>
                ID: {workshop.id_workshop}
              </p>
            </div>
            <div className='w-full flex flex-col justify-start items-start gap-2'>
              <p>
                Alamat:{' '}
                <span className='font-semibold'>
                  {`${workshop.alaamt_lengkap_workshop}, Kabupaten ${workshop.kabupaten.nama_kabupaten}, Provinsi ${workshop.kabupaten.provinsi.nama_provinsi}`}
                </span>
              </p>
              <p>
                Tanggal Pelaksanaan:{' '}
                <span className='font-semibold'>
                  {formatDate(workshop.tanggal_workshop)}
                </span>
              </p>
              <p>
                Harga Tiket:{' '}
                <span className='font-semibold'>
                  {`${formatToRupiah(workshop.harga_workshop)}/pax`}
                </span>
              </p>
              <p>
                Kapasitas:{' '}
                <span className='font-semibold'>
                  {`${workshop.kapasitas} Peserta`}
                </span>
              </p>
              <p>
                Status Verifikasi:{' '}
                <span className={getStatusBadge(workshop.status_verifikasi)}>
                  {getStatusLabel(workshop.status_verifikasi)}
                </span>
              </p>
            </div>
            <div className='flex gap-4 mt-6 flex-wrap'>
              {/* Tombol verifikasi dan tolak - hanya muncul saat status MENUNGGU */}
              {workshop.status_verifikasi ===
                StatusVerifikasiWorkshop.MENUNGGU && (
                <>
                  <button
                    onClick={() => onVerifyWorkshop(workshop.id_workshop)}
                    disabled={loading}
                    className='flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors'
                  >
                    <CheckCircle size={20} weight='bold' />
                    {loading ? 'Processing...' : 'Verifikasi Workshop'}
                  </button>
                  <button
                    onClick={() => onRejectWorkshop(workshop.id_workshop)}
                    disabled={loading}
                    className='flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors'
                  >
                    <XCircle size={20} weight='bold' />
                    {loading ? 'Processing...' : 'Tolak Workshop'}
                  </button>
                </>
              )}

              {/* Tombol hapus - hanya muncul saat status DIVERIFIKASI atau DITOLAK */}
              {(workshop.status_verifikasi ===
                StatusVerifikasiWorkshop.DIVERIFIKASI ||
                workshop.status_verifikasi ===
                  StatusVerifikasiWorkshop.DITOLAK) && (
                <button
                  onClick={() => onDeleteWorkshop(workshop.id_workshop)}
                  disabled={loading}
                  className='flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors'
                >
                  <Trash size={20} weight='bold' />
                  {loading ? 'Processing...' : 'Hapus Workshop'}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className='w-full h-76 grid grid-cols-2 gap-x-10 mt-[3.1rem]'>
          <div className='w-full mb-[3.1rem] mt-[3.1rem]'>
            <h1 className='text-[2rem] font-semibold mb-4'>
              Deskripsi Workshop
            </h1>
            <div className='bg-zinc-900 rounded-lg p-6 border border-zinc-800'>
              <p className='leading-relaxed'>
                {workshop.deskripsi_workshop || 'Tidak ada deskripsi workshop.'}
              </p>
            </div>
          </div>
          <div className='w-full mb-[3.1rem] mt-[3.1rem]'>
            <h1 className='text-[2rem] font-semibold mb-4'>Lokasi Workshop</h1>
            <div className='bg-zinc-900 rounded-lg p-6 border border-zinc-800 h-full'>
              {workshop.lat_lokasi && workshop.long_lokasi ? (
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
                  title={`Lokasi Workshop: ${workshop.judul_workshop}`}
                  aria-label={`Peta lokasi workshop ${workshop.judul_workshop}`}
                  className='w-full h-full rounded-lg'
                />
              ) : (
                <div className='w-full h-full flex items-center justify-center text-zinc-400'>
                  <p>Lokasi tidak tersedia</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className='w-full h-76 grid grid-cols-2 gap-x-10 mt-[3.1rem]'>
          <div className='w-full mb-[3.1rem] mt-[3.1rem] col-span-2'>
            <h1 className='text-[2rem] font-semibold mb-4'>
              Informasi Penyelenggara
            </h1>
            <div className='bg-zinc-900 rounded-lg p-6 border border-zinc-800'>
              <div className='w-full flex flex-col justify-start items-start gap-3'>
                <p>
                  Nama Penyelenggara:{' '}
                  <span className='font-semibold'>
                    {workshop.facilitator.nama_facilitator}
                  </span>
                </p>
                <p>
                  Email Penyelenggara:{' '}
                  <span className='font-semibold'>
                    {workshop.facilitator.email_facilitator}
                  </span>
                </p>
                <p>
                  Nomor Telepon Penyelenggara:{' '}
                  <span className='font-semibold'>
                    {workshop.facilitator.nomor_telepon_facilitator}
                  </span>
                </p>
                <p>
                  Alamat Penyelenggara:{' '}
                  <span className='font-semibold'>
                    {`${workshop.facilitator.alamat_lengkap_facilitator}, Kabupaten ${workshop.facilitator.kabupaten.nama_kabupaten}, Provinsi ${workshop.facilitator.kabupaten.provinsi.nama_provinsi}`}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AdminWorkshopDetailMain;
