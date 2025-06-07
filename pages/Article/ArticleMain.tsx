'use client';

import React from 'react';
import ArticleCard from '@/components/cards/ArticleCard';
import { Check, MagnifyingGlass } from '@phosphor-icons/react/dist/ssr';
import { useState, useEffect } from 'react';
import { getAllArticles } from '@/api/articleApi';
import { TArticle } from '@/types/articleTypes';

const ArticleMain = () => {
  const [typeFilter, setType] = useState<number[]>([]);
  const [articles, setArticles] = useState<TArticle[]>([]);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>(''); // Added search state

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await getAllArticles();
        if (response.data) {
          setArticles(response.data);
        }
      } catch (error) {
        console.error('Error fetching articles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const toggleType = (filterId: number) => {
    setType((prevFilters) => {
      if (prevFilters.includes(filterId)) {
        return prevFilters.filter((id) => id !== filterId);
      } else {
        return [...prevFilters, filterId];
      }
    });
  };

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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Filter articles based on search and category
  const filteredArticles = articles.filter(article => {
    // Search filter
    const matchesSearch = searchQuery === '' ||
      article.judul_artikel?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = typeFilter.length === 0 ||
      typeFilter.includes(article.kategori?.id_kategori_artikel);

    return matchesSearch && matchesCategory;
  });

  return (
    <main>
      <section className='w-full h-screen grid grid-cols-12'>
        {/* Filter Section */}
        <section className='w-[22.875rem] py-[1.9rem] col-span-3 flex flex-col justify-start items-start h-full border-r-2 gap-[3rem]'>
          <h1 className='px-[2.313rem] font-bold text-[2.5rem]'>Filter</h1>
          <div className='flex flex-col justify-start items-start gap-[0.75rem] w-full'>
            <h1 className='px-[2.313rem] text-[1.5rem] font-bold'>
              Kategori Artikel
            </h1>
            <div className='px-[2.313rem] flex flex-col justify-start items-start gap-[1.6rem]'>
              <div className='flex flex-row justify-center items-center gap-[0.9rem]'>
                <div
                  className={`w-[1.8rem] h-[1.8rem] border-[#78D14D] border-[0.1rem] rounded-md cursor-pointer flex flex-col justify-center items-center ${typeFilter.includes(1) ? 'bg-[#78D14D]' : 'bg-white'
                    }`}
                  onClick={() => toggleType(1)}
                >
                  {typeFilter.includes(1) ? (
                    <>
                      <Check size={18} color='#ffffff' weight='bold'></Check>
                    </>
                  ) : (
                    <></>
                  )}
                </div>
                <p className='font-bold text-[0.875rem]'>
                  Teknik Pertanian dan Produksi
                </p>
              </div>
              <div className='flex flex-row justify-center items-center gap-[0.9rem]'>
                <div
                  className={`w-[1.8rem] h-[1.8rem] border-[#78D14D] border-[0.1rem] rounded-md cursor-pointer flex flex-col justify-center items-center ${typeFilter.includes(2) ? 'bg-[#78D14D]' : 'bg-white'
                    }`}
                  onClick={() => toggleType(2)}
                >
                  {typeFilter.includes(2) ? (
                    <>
                      <Check size={18} color='#ffffff' weight='bold'></Check>
                    </>
                  ) : (
                    <></>
                  )}
                </div>
                <p className='font-bold text-[0.875rem]'>
                  Pengendalian Hama dan Penyakit
                </p>
              </div>
              <div className='flex flex-row justify-center items-center gap-[0.9rem]'>
                <div
                  className={`w-[1.8rem] h-[1.8rem] border-[#78D14D] border-[0.1rem] rounded-md cursor-pointer flex flex-col justify-center items-center ${typeFilter.includes(3) ? 'bg-[#78D14D]' : 'bg-white'
                    }`}
                  onClick={() => toggleType(3)}
                >
                  {typeFilter.includes(3) ? (
                    <>
                      <Check size={18} color='#ffffff' weight='bold'></Check>
                    </>
                  ) : (
                    <></>
                  )}
                </div>
                <p className='font-bold text-[0.875rem]'>
                  Peningkatan Kualitas Pertanian
                </p>
              </div>
              <div className='flex flex-row justify-center items-center gap-[0.9rem]'>
                <div
                  className={`w-[1.8rem] h-[1.8rem] border-[#78D14D] border-[0.1rem] rounded-md cursor-pointer flex flex-col justify-center items-center ${typeFilter.includes(4) ? 'bg-[#78D14D]' : 'bg-white'
                    }`}
                  onClick={() => toggleType(4)}
                >
                  {typeFilter.includes(4) ? (
                    <>
                      <Check size={18} color='#ffffff' weight='bold'></Check>
                    </>
                  ) : (
                    <></>
                  )}
                </div>
                <p className='font-bold text-[0.875rem]'>Teknologi Pertanian</p>
              </div>
              <div className='flex flex-row justify-center items-center gap-[0.9rem]'>
                <div
                  className={`w-[1.8rem] h-[1.8rem] border-[#78D14D] border-[0.1rem] rounded-md cursor-pointer flex flex-col justify-center items-center ${typeFilter.includes(5) ? 'bg-[#78D14D]' : 'bg-white'
                    }`}
                  onClick={() => toggleType(5)}
                >
                  {typeFilter.includes(5) ? (
                    <>
                      <Check size={18} color='#ffffff' weight='bold'></Check>
                    </>
                  ) : (
                    <></>
                  )}
                </div>
                <p className='font-bold text-[0.875rem]'>
                  Manajemen dan Bisnis Pertanian
                </p>
              </div>
            </div>

            {/* Clear filters button */}
            {(typeFilter.length > 0 || searchQuery !== '') && (
              <div className='px-[2.313rem] w-full'>
                <button
                  onClick={() => {
                    setType([]);
                    setSearchQuery('');
                  }}
                  className='text-sm text-gray-600 hover:text-[#78D14D] underline'
                >
                  Hapus semua filter
                </button>
              </div>
            )}

            <div className='w-full h-[0.063rem] bg-[#C3C6D4] mt-[1.25rem]'></div>
          </div>
        </section>

        <section className='col-span-9 px-[4.8rem] py-[1.9rem] flex flex-col justify-start items-start gap-[2.3rem] overflow-y-scroll mb-[1.9rem]'>
          <h1 className='text-[2.5rem] font-semibold'>Daftar Artikel</h1>

          <div className='w-[40%]'>
            <div className='relative'>
              <input
                type='text'
                placeholder='Cari Artikel.....'
                value={searchQuery}
                onChange={handleSearchChange}
                className='w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#78D14D] focus:border-transparent'
              />
              <MagnifyingGlass
                size={24}
                color='#6B7280'
                weight='bold'
                className='absolute left-4 top-1/2 transform -translate-y-1/2'
              />
            </div>
          </div>

          {/* Show active filters info */}
          {(typeFilter.length > 0 || searchQuery !== '') && (
            <div className='text-sm text-gray-600'>
              Menampilkan {filteredArticles.length} dari {articles.length} artikel
              {typeFilter.length > 0 && ` • ${typeFilter.length} kategori dipilih`}
              {searchQuery !== '' && ` • Pencarian: "${searchQuery}"`}
            </div>
          )}

          {isLoading ? (
            <div className='w-full flex justify-center items-center'>
              <p>Memuat artikel...</p>
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className='w-full flex justify-center items-center'>
              <p className='text-gray-500'>
                {articles.length === 0
                  ? 'Tidak ada artikel yang tersedia'
                  : 'Tidak ada artikel yang sesuai dengan filter'}
              </p>
            </div>
          ) : (
            <div className='w-full grid grid-cols-4 h-full gap-x-[2.25rem] gap-y-[2.25rem]'>
              {filteredArticles.map((article) => (
                <ArticleCard
                  key={article.id_artikel}
                  imageURL={`http://localhost:2000/uploads/articles/${article.gambar_artikel}`}
                  title={article.judul_artikel}
                  date={formatDate(article.tanggal_artikel)}
                  href={`/articles/${article.id_artikel}/details`}
                />
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  );
};

export default ArticleMain;