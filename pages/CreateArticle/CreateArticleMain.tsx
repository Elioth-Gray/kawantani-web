'use client';

import React, { useState } from 'react';
import DashboardNavbar from '@/components/navbar/DashboardNavbar';
import MainLabel from '@/components/label/MainLabel';
import PrimaryButton from '@/components/buttons/PrimaryButton';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from '@phosphor-icons/react';
import { createArticle } from '@/api/articleApi';
import { getToken } from '@/api/authApi';
import { z } from 'zod';
import { Image } from '@phosphor-icons/react/dist/ssr';

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
    .instanceof(File, { message: 'Foto artikel wajib dipilih' })
    .refine(
      (file) => file.size <= 5 * 1024 * 1024, // 5MB
      'Ukuran file maksimal 5MB',
    )
    .refine(
      (file) =>
        [
          'image/jpeg',
          'image/png',
          'image/jpg',
          'image/gif',
          'image/svg+xml',
        ].includes(file.type),
      'Format file harus PNG, JPG, JPEG, GIF, atau SVG',
    ),
});

// Type untuk error validation
type ValidationErrors = {
  [key: string]: string;
};

const CreateArticleMain = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    category: '1',
    articleStatus: 'DRAFT',
    image: null as File | null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<keyof typeof formData, string>>
  >({});
  const [generalError, setGeneralError] = useState('');
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);

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
      setBannerFile(file);
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));
      const previewUrl = URL.createObjectURL(file);
      setBannerPreview(previewUrl);

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

    // Clear errors if validation passes
    setErrors({});

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('content', formData.content);
    data.append('category', formData.category);
    data.append('articleStatus', status);
    data.append('image', formData.image as File);

    try {
      const response = await createArticle(data);

      if (response && response.data) {
        router.push('/dashboard/articles');
      } else {
        throw new Error(response?.message || 'Gagal membuat artikel');
      }
    } catch (error: any) {
      console.error('Error saat submit:', error);

      // Handle error dari backend
      if (error.response && error.response.data) {
        setGeneralError(
          error.response.data.message ||
            'Terjadi kesalahan saat membuat artikel',
        );
      } else {
        setGeneralError(
          error.message || 'Terjadi kesalahan saat membuat artikel',
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className='py-[5rem] px-[9.6rem]'>
      <section className='w-full'>
        <div
          className='w-full flex flex-row justify-start items-center gap-[1rem] mb-[2.3rem] cursor-pointer'
          onClick={() => {
            router.back();
          }}
        >
          <ArrowLeft
            size={24}
            color='#000000'
            weight='bold'
            className='cursor-pointer'
          />
          <p className='cursor-pointer'>Kembali</p>
        </div>
      </section>

      {/* Section Form */}
      <section className='w-full'>
        <div className='w-full flex flex-col justify-start items-start'>
          <h1 className='text-[2.5rem] font-semibold mb-[2.5rem]'>
            Tulis Artikel
          </h1>

          {generalError && (
            <div className='w-full mb-4 p-4 bg-red-100 text-red-700 rounded-lg'>
              {generalError}
            </div>
          )}

          <form className='w-full flex flex-col justify-start items-start gap-[4rem]'>
            {/* Kategori Artikel */}
            <div className='flex flex-col justify-start items-start gap-[0.5rem]'>
              <div className='flex flex-row justify-start items-center gap-[1.6rem]'>
                <h1 className='text-[1.5rem] font-semibold'>
                  Kategori Artikel*
                </h1>
                <div className='w-[23.25rem] h-[3.7rem] py-[0.8rem] bg-[#F2F2F2] rounded-lg px-[0.8rem] border border-black text-black flex flex-col justify-center items-center'>
                  <select
                    name='category'
                    value={formData.category}
                    onChange={handleChange}
                    className='w-full bg-transparent'
                  >
                    <option value='1'>Teknik Pertanian dan Produksi</option>
                    <option value='2'>Pengendalian Hama dan Penyakit</option>
                    <option value='3'>Peningkatan Kualitas Pertanian</option>
                    <option value='4'>Teknologi Pertanian</option>
                    <option value='5'>Manajemen dan Bisnis Pertanian</option>
                  </select>
                </div>
              </div>
              {errors.category && (
                <p className='text-red-500 text-sm ml-[9.1rem]'>
                  {errors.category}
                </p>
              )}
            </div>

            {/* Judul */}
            <div className='flex flex-col justify-start items-start gap-[0.5rem]'>
              <div className='flex flex-row justify-start items-center gap-[1.6rem]'>
                <h1 className='text-[1.5rem] font-semibold'>Judul*</h1>
                <input
                  name='title'
                  value={formData.title}
                  onChange={handleChange}
                  className='w-[25.25rem] h-[3.7rem] py-[0.8rem] bg-[#F2F2F2] rounded-lg px-[0.8rem] border text-black'
                  type='text'
                  placeholder='Masukkan judul artikel'
                />
              </div>
              {errors.title && (
                <p className='text-red-500 text-sm ml-[6.1rem]'>
                  {errors.title}
                </p>
              )}
            </div>

            {/* Deskripsi */}
            <div className='flex flex-col justify-start items-start gap-[0.5rem]'>
              <div className='flex flex-row justify-start items-start gap-[1.6rem]'>
                <h1 className='text-[1.5rem] font-semibold'>Deskripsi*</h1>
                <textarea
                  name='description'
                  value={formData.description}
                  onChange={handleChange}
                  className='w-[50rem] h-[10rem] py-[0.8rem] bg-[#F2F2F2] rounded-lg px-[0.8rem] border text-black resize-none'
                  placeholder='Masukkan deskripsi artikel'
                />
              </div>
              {errors.description && (
                <p className='text-red-500 text-sm ml-[8.1rem]'>
                  {errors.description}
                </p>
              )}
            </div>

            {/* Isi Artikel */}
            <div className='flex flex-col justify-start items-start gap-[1.6rem] w-full'>
              <h1 className='text-[1.5rem] font-semibold'>Isi Artikel*</h1>
              <textarea
                name='content'
                value={formData.content}
                onChange={handleChange}
                className='w-full h-[32.8rem] py-[0.8rem] bg-[#F2F2F2] rounded-lg px-[0.8rem] border text-black resize-none'
                placeholder='Tulis isi artikel di sini...'
              />
              {errors.content && (
                <p className='text-red-500 text-sm'>{errors.content}</p>
              )}
            </div>

            {/* Foto Artikel */}
            <div className='flex flex-row justify-start items-start w-full gap-[1rem]'>
              <p className='text-[1.5rem] font-semibold'>Foto Artikel*</p>
              <div className='flex flex-col justify-start items-start'>
                {bannerPreview ? (
                  <div className='flex flex-col justify-start items-center gap-3 mb-4 w-full'>
                    <div className='w-2/3 max-w-md h-48 rounded-lg object-cover border-2 border-white overflow-hidden'>
                      <img
                        src={bannerPreview}
                        alt='Banner Workshop'
                        className='w-full h-full object-cover'
                      />
                    </div>
                    <p>
                      Foto Artikel <span className='text-red-500'>*</span>
                    </p>
                  </div>
                ) : (
                  <div className='flex flex-col justify-start items-center gap-3 mb-4 w-full'>
                    <div className='w-2/3 max-w-md h-48 bg-white rounded-lg flex flex-col justify-center items-center'>
                      <Image size={32} color='#09090B'></Image>
                    </div>
                    <p>
                      Foto Artikel <span className='text-red-500'>*</span>
                    </p>
                  </div>
                )}
                <input
                  type='file'
                  onChange={handleFileChange}
                  className='w-full bg-[#F2F2F2] rounded-lg py-[1.1rem] px-[1.1rem] border'
                  accept='image/*'
                />
                <p className='text-gray-600 text-sm mt-1'>
                  SVG, PNG, JPG or GIF (MAX. 800x400px).
                </p>
                {formData.image && (
                  <p className='text-green-600 text-sm mt-1'>
                    File dipilih: {formData.image.name}
                  </p>
                )}
                {errors.image && (
                  <p className='text-red-500 text-sm mt-1'>{errors.image}</p>
                )}
              </div>
            </div>

            {/* Tombol Aksi */}
            <div className='flex flex-row justify-start items-start gap-[2rem]'>
              <PrimaryButton
                textColor='#ffffff'
                onClickHandler={(e: any) => {
                  e.preventDefault();
                  handleSubmit('DRAFT');
                }}
                disabled={isLoading}
              >
                {isLoading ? 'Menyimpan...' : 'Simpan Sebagai Draft'}
              </PrimaryButton>
              <PrimaryButton
                textColor='#ffffff'
                onClickHandler={(e: any) => {
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

export default CreateArticleMain;
