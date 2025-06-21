'use client';

import React from 'react';
import ArticleCard from '@/components/cards/ArticleCard';
import Link from 'next/link';
import { Check } from '@phosphor-icons/react/dist/ssr';
import { useState, useEffect } from 'react';
import InputField from '@/components/form/InputField';
import { MagnifyingGlass } from '@phosphor-icons/react/dist/ssr';
import { getSavedArticles, getYourArticles } from '@/api/articleApi';
import { TArticle } from '@/types/articleTypes';

const DashboardArticleMain = () => {
  // State for saved articles
  const [savedArticles, setSavedArticles] = useState<TArticle[]>([]);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [typeFilter, setType] = useState<number[]>([]);
  const [isYourArticle, setIsYourArticle] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  // State for user's own articles
  const [yourArticles, setYourArticles] = useState<TArticle[]>([]);
  const [statusFilter, setStatusFilter] = useState<
    'semua' | 'DRAFT' | 'PUBLISHED'
  >('semua');

  // Fetch saved articles
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const response = await getSavedArticles();

        if (response.data) {
          const articlesData = response.data.map((item: any) => ({
            ...item.artikel,
            id_penyimpanan: item.id_penyimpanan,
            status_artikel: item.artikel.status_artikel?.toLowerCase(),
          }));
          setSavedArticles(articlesData);
        }
      } catch (error) {
        console.error('Error fetching saved articles:', error);
        setError('Failed to fetch saved articles');
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  useEffect(() => {
    const fetchYourArticles = async () => {
      try {
        setLoading(true);
        const response = await getYourArticles();

        if (response.data) {
          const normalizedArticles = response.data.map((article: any) => ({
            ...article,
            status_artikel: article.status_artikel?.toLowerCase(),
          }));
          setYourArticles(normalizedArticles);
        }
      } catch (error) {
        console.error('Error fetching your articles:', error);
        setError('Failed to fetch your articles');
      } finally {
        setLoading(false);
      }
    };

    if (isYourArticle) {
      fetchYourArticles();
    }
  }, [isYourArticle]);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid date';

      const options: Intl.DateTimeFormatOptions = {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      };
      return date.toLocaleDateString('id-ID', options);
    } catch {
      return 'Invalid date';
    }
  };

  const toggleType = (filterId: number) => {
    setType((prevFilters) =>
      prevFilters.includes(filterId)
        ? prevFilters.filter((id) => id !== filterId)
        : [...prevFilters, filterId],
    );
  };

  const clearFilters = () => {
    setType([]);
    setSearchQuery('');
    if (isYourArticle) {
      setStatusFilter('semua');
    }
  };

  const showYourArticle = () => {
    setIsYourArticle(true);
    setStatusFilter('semua');
    setType([]);
    setSearchQuery('');
  };

  const showNormalArticle = () => {
    setIsYourArticle(false);
    setType([]);
    setSearchQuery('');
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value as 'semua' | 'DRAFT' | 'PUBLISHED');
  };

  // Filter function for saved articles
  const filteredSavedArticles = savedArticles.filter((article) => {
    // Search filter
    const matchesSearch =
      searchQuery === '' ||
      article.judul_artikel?.toLowerCase().includes(searchQuery.toLowerCase());

    // Category filter
    const matchesCategory =
      typeFilter.length === 0 ||
      typeFilter.includes(article.id_kategori_artikel || 0);

    return matchesSearch && matchesCategory;
  });

  // Filter function for user's articles
  const filteredYourArticles = yourArticles.filter((article) => {
    // Status filter - perbaiki perbandingan
    const matchesStatus =
      statusFilter === 'semua' ||
      article.status_artikel?.toUpperCase() === statusFilter;

    // Search filter
    const matchesSearch =
      searchQuery === '' ||
      article.judul_artikel?.toLowerCase().includes(searchQuery.toLowerCase());

    // Category filter
    const matchesCategory =
      typeFilter.length === 0 ||
      typeFilter.includes(article.id_kategori_artikel || 0);

    return matchesStatus && matchesSearch && matchesCategory;
  });

  if (isLoading) {
    return (
      <main className='w-full h-screen flex items-center justify-center bg-[#FCF7F1]'>
        <div className='text-xl'>Loading...</div>
      </main>
    );
  }

  if (error) {
    return (
      <main className='w-full h-screen flex items-center justify-center bg-[#FCF7F1]'>
        <div className='text-xl text-red-500'>{error}</div>
      </main>
    );
  }

  const baseURL =
    process.env.NEXT_PUBLIC_API_BASE_URL_FILE ||
    'http://localhost:2000/uploads';

  return (
    <main>
      <section className='w-full h-screen grid grid-cols-12 bg-[#FCF7F1]'>
        {/* Filter Section - Updated */}
        <section className='w-[22.875rem] py-[1.9rem] col-span-3 flex flex-col justify-start items-start h-full border-r-2 gap-[3rem]'>
          <div className='flex justify-between items-center w-full px-[2.313rem]'>
            <h1 className='font-bold text-[2.5rem]'>Filter</h1>
            {(typeFilter.length > 0 ||
              searchQuery !== '' ||
              (isYourArticle && statusFilter !== 'semua')) && (
              <button
                onClick={clearFilters}
                className='text-[#78D14D] text-sm underline hover:text-green-600 transition-colors'
              >
                Clear All
              </button>
            )}
          </div>

          <div className='flex flex-col justify-start items-start gap-[0.75rem] w-full'>
            <h1 className='px-[2.313rem] text-[1.5rem] font-bold'>
              Kategori Artikel
            </h1>
            <div className='px-[2.313rem] flex flex-col justify-start items-start gap-[1.6rem]'>
              <div className='flex flex-row justify-center items-center gap-[0.9rem]'>
                <div
                  className={`w-[1.8rem] h-[1.8rem] border-[#78D14D] border-[0.1rem] rounded-md cursor-pointer flex flex-col justify-center items-center ${
                    typeFilter.includes(1) ? 'bg-[#78D14D]' : 'bg-white'
                  }`}
                  onClick={() => toggleType(1)}
                >
                  {typeFilter.includes(1) && (
                    <Check size={18} color='#ffffff' weight='bold' />
                  )}
                </div>
                <p className='font-bold text-[0.875rem]'>
                  Teknik Pertanian dan Produksi
                </p>
              </div>
              <div className='flex flex-row justify-center items-center gap-[0.9rem]'>
                <div
                  className={`w-[1.8rem] h-[1.8rem] border-[#78D14D] border-[0.1rem] rounded-md cursor-pointer flex flex-col justify-center items-center ${
                    typeFilter.includes(2) ? 'bg-[#78D14D]' : 'bg-white'
                  }`}
                  onClick={() => toggleType(2)}
                >
                  {typeFilter.includes(2) && (
                    <Check size={18} color='#ffffff' weight='bold' />
                  )}
                </div>
                <p className='font-bold text-[0.875rem]'>
                  Pengendalian Hama dan Penyakit
                </p>
              </div>
              <div className='flex flex-row justify-center items-center gap-[0.9rem]'>
                <div
                  className={`w-[1.8rem] h-[1.8rem] border-[#78D14D] border-[0.1rem] rounded-md cursor-pointer flex flex-col justify-center items-center ${
                    typeFilter.includes(3) ? 'bg-[#78D14D]' : 'bg-white'
                  }`}
                  onClick={() => toggleType(3)}
                >
                  {typeFilter.includes(3) && (
                    <Check size={18} color='#ffffff' weight='bold' />
                  )}
                </div>
                <p className='font-bold text-[0.875rem]'>
                  Peningkatan Kualitas Pertanian
                </p>
              </div>
              <div className='flex flex-row justify-center items-center gap-[0.9rem]'>
                <div
                  className={`w-[1.8rem] h-[1.8rem] border-[#78D14D] border-[0.1rem] rounded-md cursor-pointer flex flex-col justify-center items-center ${
                    typeFilter.includes(4) ? 'bg-[#78D14D]' : 'bg-white'
                  }`}
                  onClick={() => toggleType(4)}
                >
                  {typeFilter.includes(4) && (
                    <Check size={18} color='#ffffff' weight='bold' />
                  )}
                </div>
                <p className='font-bold text-[0.875rem]'>Teknologi Pertanian</p>
              </div>
              <div className='flex flex-row justify-center items-center gap-[0.9rem]'>
                <div
                  className={`w-[1.8rem] h-[1.8rem] border-[#78D14D] border-[0.1rem] rounded-md cursor-pointer flex flex-col justify-center items-center ${
                    typeFilter.includes(5) ? 'bg-[#78D14D]' : 'bg-white'
                  }`}
                  onClick={() => toggleType(5)}
                >
                  {typeFilter.includes(5) && (
                    <Check size={18} color='#ffffff' weight='bold' />
                  )}
                </div>
                <p className='font-bold text-[0.875rem]'>
                  Manajemen dan Bisnis Pertanian
                </p>
              </div>
            </div>

            {isYourArticle && (
              <div className='w-full px-[2.313rem] mt-5'>
                <h1 className='text-[1.5rem] font-bold mb-2'>Status Artikel</h1>
                <select
                  id='status'
                  className='cursor-pointer p-2 border rounded-lg w-full'
                  value={statusFilter}
                  onChange={handleStatusChange}
                >
                  <option value='semua'>Semua</option>
                  <option value='DRAFT'>Draft</option>
                  <option value='PUBLISHED'>Published</option>
                </select>
              </div>
            )}

            <div className='w-full h-[0.063rem] bg-[#C3C6D4] mt-[1.25rem]'></div>
          </div>
        </section>

        {/* Main Content Section */}
        <section className='col-span-9 px-[4.8rem] py-[1.9rem] flex flex-col justify-start items-start gap-[2.3rem] overflow-y-scroll mb-[1.9rem]'>
          <div className='flex flex-col justify-start items-start gap-[1rem] w-full'>
            <div className='flex justify-between items-center w-full'>
              <h1 className='text-[2.5rem] font-semibold'>Daftar Artikel</h1>
              <div className='text-gray-600'>
                {isYourArticle
                  ? `${filteredYourArticles.length} artikel ditemukan`
                  : `${filteredSavedArticles.length} artikel ditemukan`}
              </div>
            </div>
            <div className='flex flex-row justify-start items-center gap-[2rem]'>
              <button
                onClick={showNormalArticle}
                className={`py-[0.9rem] px-[2.6rem] rounded-lg ${
                  !isYourArticle
                    ? 'bg-[#78D14D] text-white'
                    : 'bg-none text-[#78D14D]'
                } cursor-pointer text-[1rem]`}
              >
                Artikel Disimpan
              </button>

              <button
                onClick={showYourArticle}
                className={`py-[0.9rem] px-[2.6rem] rounded-lg ${
                  isYourArticle
                    ? 'bg-[#78D14D] text-white'
                    : 'bg-none text-[#78D14D]'
                } cursor-pointer text-[1rem]`}
              >
                Artikel Milikmu
              </button>

              <Link
                href='/articles'
                className='py-[0.9rem] rounded-lg text-[#78D14D] cursor-pointer text-[1rem] hover:text-black transition-all ease-in-out duration-200'
              >
                Cari artikel
              </Link>
              <Link
                href='/dashboard/articles/create'
                className='py-[0.9rem] rounded-lg text-[#78D14D] cursor-pointer text-[1rem] hover:text-black transition-all ease-in-out duration-200'
              >
                Buat artikel
              </Link>
            </div>
          </div>

          <div className='w-[40%]'>
            <InputField
              placeholder='Cari Artikel.....'
              type='text'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            >
              <MagnifyingGlass
                size={24}
                color='#6B7280'
                weight='bold'
                className='absolute left-4 top-1/2 transform -translate-y-1/2'
              />
            </InputField>
          </div>

          {/* Active filters display */}
          {(typeFilter.length > 0 ||
            searchQuery !== '' ||
            (isYourArticle && statusFilter !== 'semua')) && (
            <div className='flex flex-wrap gap-2'>
              <span className='text-sm text-gray-600'>Active filters:</span>
              {typeFilter.map((filterId) => {
                const categoryNames = {
                  1: 'Teknik Pertanian',
                  2: 'Pengendalian Hama',
                  3: 'Kualitas Pertanian',
                  4: 'Teknologi Pertanian',
                  5: 'Bisnis Pertanian',
                };
                return (
                  <span
                    key={filterId}
                    className='px-3 py-1 bg-[#78D14D] text-white text-sm rounded-full flex items-center gap-2'
                  >
                    {categoryNames[filterId as keyof typeof categoryNames]}
                    <button
                      onClick={() => toggleType(filterId)}
                      className='hover:bg-green-600 rounded-full w-4 h-4 flex items-center justify-center text-xs'
                    >
                      ×
                    </button>
                  </span>
                );
              })}
              {searchQuery !== '' && (
                <span className='px-3 py-1 bg-[#78D14D] text-white text-sm rounded-full flex items-center gap-2'>
                  Search: "{searchQuery}"
                  <button
                    onClick={() => setSearchQuery('')}
                    className='hover:bg-green-600 rounded-full w-4 h-4 flex items-center justify-center text-xs'
                  >
                    ×
                  </button>
                </span>
              )}
              {isYourArticle && statusFilter !== 'semua' && (
                <span className='px-3 py-1 bg-[#78D14D] text-white text-sm rounded-full flex items-center gap-2'>
                  Status: {statusFilter === 'PUBLISHED' ? 'Published' : 'Draft'}
                  <button
                    onClick={() => setStatusFilter('semua')}
                    className='hover:bg-green-600 rounded-full w-4 h-4 flex items-center justify-center text-xs'
                  >
                    ×
                  </button>
                </span>
              )}
            </div>
          )}

          {isYourArticle ? (
            filteredYourArticles.length > 0 ? (
              <div className='w-full grid grid-cols-4 h-full gap-x-[2.25rem] gap-y-[2.25rem]'>
                {filteredYourArticles.map((article) => (
                  <ArticleCard
                    key={article.id_artikel}
                    imageURL={`${baseURL}/articles/${article.gambar_artikel}`}
                    title={article.judul_artikel}
                    date={formatDate(article.tanggal_artikel)}
                    href={`/dashboard/articles/${article.id_artikel}/details`}
                    status={article.status_artikel}
                    verification={article.status_verifikasi}
                  />
                ))}
              </div>
            ) : (
              <div className='col-span-3 text-center py-8 w-full'>
                <p className='text-gray-500 text-lg'>
                  {yourArticles.length === 0
                    ? 'Belum ada artikel yang dibuat'
                    : 'Tidak ada artikel yang sesuai dengan filter'}
                </p>
                {(typeFilter.length > 0 ||
                  searchQuery !== '' ||
                  statusFilter !== 'semua') && (
                  <button
                    onClick={clearFilters}
                    className='mt-4 px-4 py-2 bg-[#78D14D] text-white rounded-lg hover:bg-green-600 transition-colors'
                  >
                    Reset Pencarian
                  </button>
                )}
              </div>
            )
          ) : filteredSavedArticles.length > 0 ? (
            <div className='w-full grid grid-cols-4 h-full gap-x-[2.25rem] gap-y-[2.25rem]'>
              {filteredSavedArticles.map((article) => (
                <ArticleCard
                  key={article.id_artikel}
                  imageURL={`${baseURL}/articles/${article.gambar_artikel}`}
                  title={article.judul_artikel}
                  date={formatDate(article.tanggal_artikel)}
                  href={`/articles/${article.id_artikel}/details`}
                />
              ))}
            </div>
          ) : (
            <div className='col-span-3 text-center py-8 w-full'>
              <p className='text-gray-500 text-lg'>
                {savedArticles.length === 0
                  ? 'Belum ada artikel yang disimpan'
                  : 'Tidak ada artikel yang sesuai dengan filter'}
              </p>
              {(typeFilter.length > 0 || searchQuery !== '') && (
                <button
                  onClick={clearFilters}
                  className='mt-4 px-4 py-2 bg-[#78D14D] text-white rounded-lg hover:bg-green-600 transition-colors'
                >
                  Reset Pencarian
                </button>
              )}
            </div>
          )}
        </section>
      </section>
    </main>
  );
};

export default DashboardArticleMain;
