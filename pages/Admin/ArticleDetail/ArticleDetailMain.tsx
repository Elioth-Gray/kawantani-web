'use client';

import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { ArrowLeft, CheckCircle, Trash } from '@phosphor-icons/react/dist/ssr';
import Image from 'next/image';
import { deleteArticle, getArticleById, verifyArticle } from '@/api/articleApi';

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
  status_verifikasi: boolean;
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
      'Apakah kamu ingin memverifkasi artikel ini?',
    );
    if (!confirmed) return;

    try {
      const result = await verifyArticle(id_artikel);
      if (result.data) {
        alert('Berhasil memverifikasi artikel.');
        router.push('/admin/dashboard/articles');
      } else {
        alert(result.message || 'Ada kesalahan');
      }
    } catch (error) {
      console.error('Error verify article:', error);
      alert('Ada kesalahan saat veridikasi artikel');
    } finally {
      setLoading(false);
    }
  };

  const onDeleteArticle = async (id_artikel: string) => {
    setLoading(true);
    const confirmed = window.confirm(
      'Apakah kamu ingin menghapus artikel ini?',
    );
    if (!confirmed) return;

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
          <h1 className='text-[2.25rem] font-semibold'>Detail Artikel</h1>
          <p>Lihat detail artikel pada sistem</p>
        </div>

        <div className='w-full h-76 grid grid-cols-2 gap-x-10'>
          <div className='col-span-1 w-full h-full  rounded-xl overflow-hidden'>
            <img
              src={
                article?.gambar_artikel
                  ? `http://localhost:2000/uploads/articles/${article.gambar_artikel}`
                  : undefined
              }
              width={0}
              height={0}
              alt='article'
              className='w-full h-full object-cover'
            />
          </div>

          <div className='col-span-1 w-full h-full flex flex-col justify-start items-start gap-3'>
            <div className='w-full flex flex-col justify-start items-start gap-1'>
              <h1 className='text-[1.5rem] font-semibold'>
                {article?.judul_artikel || '-'}
              </h1>
              <h1 className='text-[1rem] font-semibold text-blue-500'>
                {article?.kategori?.nama_kategori_artikel || '-'}
              </h1>
            </div>

            <div className='w-full flex flex-col justify-start items-start gap-2'>
              <p>
                Penulis:{' '}
                <span className='font-semibold'>
                  {article
                    ? `${article.pengguna.nama_depan_pengguna} ${article.pengguna.nama_belakang_pengguna}`
                    : '-'}
                </span>
              </p>
              <p>
                Tanggal ditulis:{' '}
                <span className='font-semibold'>
                  {article ? formatDate(article.tanggal_artikel) : '-'}
                </span>
              </p>
              <p>
                Status artikel:{' '}
                <span className={getStatusBadge(article?.status_artikel || '')}>
                  {article?.status_artikel}
                </span>
              </p>
              <p>
                Status Verifikasi:{' '}
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    article?.status_verifikasi
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {article?.status_verifikasi
                    ? 'Terverifikasi'
                    : 'Belum Verifikasi'}
                </span>
              </p>
            </div>

            <div className='flex gap-4 mt-6'>
              {!article?.status_verifikasi && (
                <button
                  onClick={() => {
                    onVerifyArticle(article?.id_artikel || '');
                  }}
                  disabled={loading}
                  className='flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer'
                >
                  <CheckCircle size={20} weight='bold' />
                  Verifikasi Artikel
                </button>
              )}
              <button
                onClick={() => {
                  onDeleteArticle(article?.id_artikel || '');
                }}
                disabled={loading}
                className='flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer'
              >
                <Trash size={20} weight='bold' />
                Hapus Artikel
              </button>
            </div>
          </div>
        </div>

        <div className='w-full mb-[3.1rem] mt-[3.1rem]'>
          <h1 className='text-[2rem] font-semibold'>Deskripsi Artikel</h1>
          <p>{article?.deskripsi_artikel || '-'}</p>
        </div>

        <div className='w-full mb-[3.1rem] mt-[3.1rem]'>
          <h1 className='text-[2rem] font-semibold'>Isi Artikel</h1>
          <p>{article?.isi_artikel || '-'}</p>
        </div>
      </section>
    </main>
  );
};

export default ArticleDetailMain;
