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

// Enum untuk status verifikasi (sama dengan yang di halaman list)
enum StatusVerifikasiArtikel {
  MENUNGGU = 'MENUNGGU',
  DIVERIFIKASI = 'DIVERIFIKASI',
  DITOLAK = 'DITOLAK',
}

export type KategoriArtikel = {
  id_kategori_artikel: number;
  nama_kategori_artikel: string;
};

export type Pengguna = {
  id_pengguna: string;
  nama_depan_pengguna: string;
  nama_belakang_pengguna: string;
  tanggal_lahir_pengguna: string;
  email_pengguna: string;
  nomor_telepon_pengguna: string;
  jenisKelamin: number;
  password_pengguna: string;
  tanggal_pembuatan_akun: string;
  kode_verifikasi: string;
  status_verfikasi: boolean;
  avatar: string;
  status_aktif: boolean;
};

export type Artikel = {
  id_artikel: string;
  judul_artikel: string;
  tanggal_artikel: string;
  deskripsi_artikel: string;
  isi_artikel: string;
  status_artikel: 'PUBLISHED' | 'DRAFT' | string;
  status_verifikasi: StatusVerifikasiArtikel; // Ubah dari boolean ke enum
  gambar_artikel: string;
  status_aktif: boolean;
  id_kategori_artikel: number;
  id_pengguna: string;
  kategori: KategoriArtikel;
  komentar_artikel: any[];
  pengguna: Pengguna;
  artikel_disukai: any[];
};

const ArticleDetailMain = () => {
  const [article, setArticle] = useState<Artikel>();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const router = useRouter();
  const params = useParams();
  const id = params?.id || '';

  useEffect(() => {
    const fetchArticle = async () => {
      setInitialLoading(true);
      try {
        const response = await getArticleById(id as string);
        if (response.data) {
          setArticle(response.data);
        } else {
          console.error('Failed to load article:', response.message);
          alert('Gagal memuat data artikel');
        }
      } catch (error) {
        console.error('Error loading article:', error);
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

  // Fungsi untuk mendapatkan badge status verifikasi
  const getVerificationBadge = (status: StatusVerifikasiArtikel) => {
    const baseClass = 'px-2 py-1 rounded-full text-xs font-semibold';
    switch (status) {
      case StatusVerifikasiArtikel.DIVERIFIKASI:
        return `${baseClass} bg-green-100 text-green-800`;
      case StatusVerifikasiArtikel.MENUNGGU:
        return `${baseClass} bg-yellow-100 text-yellow-800`;
      case StatusVerifikasiArtikel.DITOLAK:
        return `${baseClass} bg-red-100 text-red-800`;
      default:
        return `${baseClass} bg-gray-100 text-gray-800`;
    }
  };

  // Fungsi untuk mendapatkan teks status verifikasi
  const getVerificationText = (status: StatusVerifikasiArtikel) => {
    switch (status) {
      case StatusVerifikasiArtikel.DIVERIFIKASI:
        return 'Diverifikasi';
      case StatusVerifikasiArtikel.MENUNGGU:
        return 'Menunggu Verifikasi';
      case StatusVerifikasiArtikel.DITOLAK:
        return 'Ditolak';
      default:
        return 'Status Tidak Diketahui';
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

  const onVerifyArticle = async (id_artikel: string) => {
    setLoading(true);
    const confirmed = window.confirm(
      'Apakah kamu ingin memverifikasi artikel ini?',
    );
    if (!confirmed) {
      setLoading(false);
      return;
    }

    try {
      const result = await verifyArticle(
        id_artikel,
        StatusVerifikasiArtikel.DIVERIFIKASI,
      );
      if (result.data) {
        alert('Berhasil memverifikasi artikel.');
        // Update local state untuk menghindari reload
        setArticle((prev) =>
          prev
            ? {
                ...prev,
                status_verifikasi: StatusVerifikasiArtikel.DIVERIFIKASI,
              }
            : prev,
        );
      } else {
        alert(result.message || 'Ada kesalahan');
      }
    } catch (error) {
      console.error('Error verify article:', error);
      alert('Ada kesalahan saat verifikasi artikel');
    } finally {
      setLoading(false);
    }
  };

  const onRejectArticle = async (id_artikel: string) => {
    setLoading(true);
    const confirmed = window.confirm('Apakah kamu ingin menolak artikel ini?');
    if (!confirmed) {
      setLoading(false);
      return;
    }

    try {
      const result = await verifyArticle(
        id_artikel,
        StatusVerifikasiArtikel.DITOLAK,
      );
      if (result.data) {
        alert('Berhasil menolak artikel.');
        // Update local state
        setArticle((prev) =>
          prev
            ? {
                ...prev,
                status_verifikasi: StatusVerifikasiArtikel.DITOLAK,
              }
            : prev,
        );
      } else {
        alert(result.message || 'Ada kesalahan');
      }
    } catch (error) {
      console.error('Error reject article:', error);
      alert('Ada kesalahan saat menolak artikel');
    } finally {
      setLoading(false);
    }
  };

  const onDeleteArticle = async (id_artikel: string) => {
    setLoading(true);
    const confirmed = window.confirm(
      'Apakah kamu ingin menghapus artikel ini?',
    );
    if (!confirmed) {
      setLoading(false);
      return;
    }

    try {
      const result = await deleteArticle(id_artikel);
      if (result.data) {
        alert('Berhasil menghapus artikel.');
        router.push('/admin/dashboard/articles');
      } else {
        alert(result.message || 'Ada kesalahan');
      }
    } catch (error) {
      console.error('Error deleting article:', error);
      alert('Ada kesalahan saat menghapus artikel');
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
            <p>Memuat artikel...</p>
          </div>
        </div>
      </main>
    );
  }

  if (!article) {
    return (
      <main className='w-full h-screen px-[5.1rem] bg-[#09090B] text-white overflow-auto'>
        <div className='flex items-center justify-center h-full'>
          <div className='text-center'>
            <p className='text-red-400 mb-4'>Artikel tidak ditemukan</p>
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
          <h1 className='text-[2.25rem] font-semibold'>Detail Artikel</h1>
          <p>Lihat detail artikel pada sistem</p>
        </div>

        <div className='w-full h-76 grid grid-cols-1 lg:grid-cols-2 gap-x-10 gap-y-6'>
          <div className='col-span-1 w-full h-full rounded-xl overflow-hidden bg-zinc-900'>
            {article.gambar_artikel ? (
              <Image
                src={`${baseURL}/articles/${article.gambar_artikel}`}
                alt={article.judul_artikel}
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
                {article.judul_artikel}
              </h1>
              <h1 className='text-[1rem] font-semibold text-blue-500'>
                {article.kategori?.nama_kategori_artikel}
              </h1>
            </div>

            <div className='w-full flex flex-col justify-start items-start gap-2'>
              <p>
                Penulis:{' '}
                <span className='font-semibold'>
                  {`${article.pengguna.nama_depan_pengguna} ${article.pengguna.nama_belakang_pengguna}`}
                </span>
              </p>
              <p>
                Tanggal ditulis:{' '}
                <span className='font-semibold'>
                  {formatDate(article.tanggal_artikel)}
                </span>
              </p>
              <p>
                Status artikel:{' '}
                <span className={getStatusBadge(article.status_artikel)}>
                  {article.status_artikel}
                </span>
              </p>
              <p>
                Status Verifikasi:{' '}
                <span
                  className={getVerificationBadge(article.status_verifikasi)}
                >
                  {getVerificationText(article.status_verifikasi)}
                </span>
              </p>
            </div>

            <div className='flex gap-4 mt-6 flex-wrap'>
              {/* Tombol verifikasi dan tolak - hanya muncul saat status MENUNGGU */}
              {article.status_verifikasi ===
                StatusVerifikasiArtikel.MENUNGGU && (
                <>
                  <button
                    onClick={() => onVerifyArticle(article.id_artikel)}
                    disabled={loading}
                    className='flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors'
                  >
                    <CheckCircle size={20} weight='bold' />
                    {loading ? 'Processing...' : 'Verifikasi Artikel'}
                  </button>
                  <button
                    onClick={() => onRejectArticle(article.id_artikel)}
                    disabled={loading}
                    className='flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors'
                  >
                    <XCircle size={20} weight='bold' />
                    {loading ? 'Processing...' : 'Tolak Artikel'}
                  </button>
                </>
              )}

              {/* Tombol hapus - hanya muncul saat status DIVERIFIKASI atau DITOLAK */}
              {(article.status_verifikasi ===
                StatusVerifikasiArtikel.DIVERIFIKASI ||
                article.status_verifikasi ===
                  StatusVerifikasiArtikel.DITOLAK) && (
                <button
                  onClick={() => onDeleteArticle(article.id_artikel)}
                  disabled={loading}
                  className='flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors'
                >
                  <Trash size={20} weight='bold' />
                  {loading ? 'Processing...' : 'Hapus Artikel'}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className='w-full mb-[3.1rem] mt-[3.1rem]'>
          <h1 className='text-[2rem] font-semibold mb-4'>Deskripsi Artikel</h1>
          <div className='bg-zinc-900 rounded-lg p-6 border border-zinc-800'>
            <p className='leading-relaxed'>
              {article.deskripsi_artikel || 'Tidak ada deskripsi artikel.'}
            </p>
          </div>
        </div>

        <div className='w-full mb-[3.1rem] mt-[3.1rem]'>
          <h1 className='text-[2rem] font-semibold mb-4'>Isi Artikel</h1>
          <div className='bg-zinc-900 rounded-lg p-6 border border-zinc-800'>
            <div className='prose prose-invert max-w-none'>
              <p className='leading-relaxed whitespace-pre-wrap'>
                {article.isi_artikel || 'Tidak ada isi artikel.'}
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ArticleDetailMain;
