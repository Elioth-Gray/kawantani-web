'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Image } from '@phosphor-icons/react/dist/ssr';
import { z } from 'zod';

import DashboardNavbar from '@/components/navbar/DashboardNavbar';
import MainLabel from '@/components/label/MainLabel';
import PrimaryButton from '@/components/buttons/PrimaryButton';

import { getOwnArticleById, updateArticle } from '@/api/articleApi';

const articleSchema = z.object({
  title: z
    .string()
    .min(1, 'Judul wajib diisi')
    .min(5, 'Judul minimal 5 karakter')
    .max(200, 'Judul maksimal 200 karakter'),
  description: z
    .string()
    .min(1, 'Deskripsi wajib diisi')
    .min(10, 'Deskripsi minimal 10 karakter')
    .max(500, 'Deskripsi maksimal 500 karakter'),
  content: z
    .string()
    .min(1, 'Isi artikel wajib diisi')
    .min(50, 'Isi artikel minimal 50 karakter'),
  category: z.string().min(1, 'Kategori wajib dipilih'),
  image: z
    .any()
    .refine(
      (val) => val === null || val instanceof File,
      'Foto harus berupa file gambar yang valid atau dikosongkan',
    )
    .optional(),
});

type ValidationErrors = {
  [key: string]: string;
};

type ArticleData = {
  id_artikel: string;
  judul_artikel: string;
  deskripsi_artikel: string;
  isi_artikel: string;
  status_artikel: 'DRAFT' | 'PUBLISHED';
  gambar_artikel: string;
  id_kategori_artikel: number;
  kategori: {
    id_kategori_artikel: number;
    nama_kategori_artikel: string;
  };
};

const ArticleEditMain = () => {
  const router = useRouter();
  const params = useParams();
  const articleId = params?.id as string;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    category: '1',
    articleStatus: 'DRAFT' as 'DRAFT' | 'PUBLISHED',
    image: null as File | null,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [errors, setErrors] = useState<
    Partial<Record<keyof typeof formData, string>>
  >({});
  const [generalError, setGeneralError] = useState('');
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);

  const baseURL =
    process.env.NEXT_PUBLIC_API_BASE_URL_FILE ||
    'http://localhost:2000/uploads';

  const loadArticleData = async () => {
    if (!articleId) return;

    try {
      setIsLoadingData(true);
      const response = await getOwnArticleById(articleId);

      if (response && response.data) {
        const articleData: ArticleData = response.data;

        setFormData({
          title: articleData.judul_artikel,
          description: articleData.deskripsi_artikel,
          content: articleData.isi_artikel,
          category: articleData.id_kategori_artikel.toString(),
          articleStatus: articleData.status_artikel,
          image: null,
        });

        if (articleData.gambar_artikel) {
          const imageUrl = `${baseURL}/articles/${articleData.gambar_artikel}`;
          setExistingImageUrl(imageUrl);
          setBannerPreview(imageUrl);
        }
      }
    } catch (error) {
      console.error('Error loading article data:', error);
      setGeneralError('Gagal memuat data artikel');
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    loadArticleData();
  }, [articleId]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));
      const previewUrl = URL.createObjectURL(file);
      setBannerPreview(previewUrl);
      setExistingImageUrl(null);

      if (errors.image) {
        setErrors((prev) => ({ ...prev, image: undefined }));
      }
    }
  };

  const handleSubmit = async (status: 'DRAFT' | 'PUBLISHED') => {
    setIsLoading(true);
    setGeneralError('');
    setErrors({});

    const result = articleSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: ValidationErrors = {};
      result.error.errors.forEach((err) => {
        const fieldName = err.path[0] as string;
        fieldErrors[fieldName] = err.message;
      });
      setErrors(fieldErrors);
      setIsLoading(false);
      return;
    }

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('content', formData.content);
    data.append('category', formData.category);
    data.append('articleStatus', status);

    if (formData.image) {
      data.append('image', formData.image);
    }

    try {
      const response = await updateArticle(articleId, data);
      if (response && response.data) {
        router.push(`/dashboard/articles/${articleId}/details`);
      } else {
        throw new Error('Gagal mengupdate artikel');
      }
    } catch (error: any) {
      setGeneralError(
        error?.response?.data?.message ||
          'Terjadi kesalahan saat mengupdate artikel',
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingData) {
    return (
      <main className='py-[5rem] px-[9.6rem]'>
        <div className='w-full flex justify-center items-center h-64'>
          <p className='text-lg'>Memuat data artikel...</p>
        </div>
      </main>
    );
  }

  return (
    <main className='py-[5rem] px-[9.6rem]'>
      <section className='w-full'>
        <div
          className='w-full flex flex-row justify-start items-center gap-[1rem] mb-[2.3rem] cursor-pointer'
          onClick={() => {
            router.back();
          }}
        >
          <ArrowLeft size={24} color='#000000' weight='bold' />
          <p>Kembali</p>
        </div>
      </section>

      <section className='w-full'>
        <div className='flex flex-col items-start'>
          <h1 className='text-[2.5rem] font-semibold mb-[2.5rem]'>
            Edit Artikel
          </h1>

          {generalError && (
            <div className='w-full mb-4 p-4 bg-red-100 text-red-700 rounded-lg'>
              {generalError}
            </div>
          )}

          <form className='flex flex-col gap-[4rem] w-full'>
            {/* Foto */}
            <div className='flex flex-col gap-[1rem]'>
              <p className='text-[1.5rem] font-semibold'>Foto Artikel</p>

              <div className='flex flex-col items-center gap-3'>
                {bannerPreview ? (
                  <div className='w-full max-w-md h-48 rounded-lg border overflow-hidden'>
                    <img
                      src={bannerPreview}
                      alt='Preview'
                      className='w-full h-full object-cover'
                    />
                  </div>
                ) : (
                  <div className='w-full max-w-md h-48 bg-gray-50 rounded-lg flex flex-col justify-center items-center border-2 border-dashed'>
                    <Image size={32} color='#09090B' />
                    <p className='text-gray-500 mt-2'>Belum ada foto dipilih</p>
                  </div>
                )}

                <label
                  htmlFor='avatar'
                  className='bg-[#F2F2F2] hover:bg-gray-200 rounded-lg py-3 px-6 text-gray-700 cursor-pointer'
                >
                  Unggah Foto
                </label>
                <input
                  id='avatar'
                  name='avatar'
                  type='file'
                  className='hidden'
                  onChange={handleFileChange}
                />
                {errors.image && (
                  <p className='text-red-500 text-sm'>{errors.image}</p>
                )}
              </div>
            </div>

            {/* Kategori */}
            <div className='flex flex-col gap-[0.5rem]'>
              <p className='text-[1.5rem] font-semibold'>Kategori Artikel*</p>
              <select
                name='category'
                value={formData.category}
                onChange={handleChange}
                className='w-[23.25rem] h-[3.7rem] px-4 py-2 bg-[#F2F2F2] border rounded-lg'
              >
                <option value='1'>Teknik Pertanian dan Produksi</option>
                <option value='2'>Pengendalian Hama dan Penyakit</option>
                <option value='3'>Peningkatan Kualitas Pertanian</option>
                <option value='4'>Teknologi Pertanian</option>
                <option value='5'>Manajemen dan Bisnis Pertanian</option>
              </select>
              {errors.category && (
                <p className='text-red-500 text-sm'>{errors.category}</p>
              )}
            </div>

            {/* Judul */}
            <div className='flex flex-col gap-[0.5rem]'>
              <p className='text-[1.5rem] font-semibold'>Judul*</p>
              <input
                name='title'
                value={formData.title}
                onChange={handleChange}
                className='w-[25.25rem] h-[3.7rem] px-4 py-2 bg-[#F2F2F2] border rounded-lg'
                placeholder='Masukkan judul artikel'
              />
              {errors.title && (
                <p className='text-red-500 text-sm'>{errors.title}</p>
              )}
            </div>

            {/* Deskripsi */}
            <div className='flex flex-col gap-[0.5rem]'>
              <p className='text-[1.5rem] font-semibold'>Deskripsi*</p>
              <textarea
                name='description'
                value={formData.description}
                onChange={handleChange}
                className='w-[50rem] h-[10rem] px-4 py-2 bg-[#F2F2F2] border rounded-lg resize-none'
                placeholder='Masukkan deskripsi artikel'
              />
              {errors.description && (
                <p className='text-red-500 text-sm'>{errors.description}</p>
              )}
            </div>

            {/* Konten */}
            <div className='flex flex-col gap-[0.5rem]'>
              <p className='text-[1.5rem] font-semibold'>Isi Artikel*</p>
              <textarea
                name='content'
                value={formData.content}
                onChange={handleChange}
                className='w-full h-[32.8rem] px-4 py-2 bg-[#F2F2F2] border rounded-lg resize-none'
                placeholder='Tulis isi artikel di sini...'
              />
              {errors.content && (
                <p className='text-red-500 text-sm'>{errors.content}</p>
              )}
            </div>

            {/* Tombol */}
            <div className='flex flex-row gap-4'>
              <PrimaryButton
                textColor='#ffffff'
                onClickHandler={(e) => {
                  e.preventDefault();
                  handleSubmit('DRAFT');
                }}
                disabled={isLoading}
              >
                {isLoading ? 'Menyimpan...' : 'Simpan Sebagai Draft'}
              </PrimaryButton>

              <PrimaryButton
                textColor='#ffffff'
                onClickHandler={(e) => {
                  e.preventDefault();
                  handleSubmit('PUBLISHED');
                }}
                disabled={isLoading}
              >
                {isLoading ? 'Mempublish...' : 'Publish Artikel'}
              </PrimaryButton>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
};

export default ArticleEditMain;
