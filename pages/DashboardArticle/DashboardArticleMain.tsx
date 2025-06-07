"use client";

import React from "react";
import ArticleCard from "@/components/cards/ArticleCard";
import Link from "next/link";
import { Check } from "@phosphor-icons/react/dist/ssr";
import { useState, useEffect } from "react";
import InputField from "@/components/form/InputField";
import { MagnifyingGlass } from "@phosphor-icons/react/dist/ssr";
import { getSavedArticles, getYourArticles } from "@/api/articleApi";
import { TArticle } from '@/types/articleTypes';

const DashboardArticleMain = () => {
  // State for saved articles
  const [savedArticles, setSavedArticles] = useState<TArticle[]>([]);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [typeFilter, setType] = useState<number[]>([]);
  const [isYourArticle, setIsYourArticle] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>(""); // Added search state

  // State for user's own articles
  const [yourArticles, setYourArticles] = useState<TArticle[]>([]);
  const [statusFilter, setStatusFilter] = useState<'semua' | 'draft' | 'published'>('semua');

  // Fetch saved articles
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await getSavedArticles();
        console.log('Saved Articles Response:', response);

        if (response.data) {
          const articlesData = response.data.map((item: any) => ({
            ...item.artikel,
            id_penyimpanan: item.id_penyimpanan,
            status_artikel: item.artikel.status_artikel?.toLowerCase()
          }));
          setSavedArticles(articlesData);
        }
      } catch (error) {
        console.error('Error fetching saved articles:', error);
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
        console.log('Your Articles Response:', response);

        if (response.data) {
          const normalizedArticles = response.data.map((article: any) => ({
            ...article,
            status_artikel: article.status_artikel?.toLowerCase()
          }));
          setYourArticles(normalizedArticles);
        }
      } catch (error) {
        console.error('Error fetching your articles:', error);
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
        : [...prevFilters, filterId]
    );
  };

  const showYourArticle = () => {
    setIsYourArticle(true);
    setStatusFilter('semua');
    setType([]);
    setSearchQuery("");
  };

  const showNormalArticle = () => {
    setIsYourArticle(false);
    setType([]);
    setSearchQuery("");
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value as 'semua' | 'draft' | 'published');
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Filter function for saved articles
  const filteredSavedArticles = savedArticles.filter(article => {
    // Search filter
    const matchesSearch = searchQuery === "" ||
      article.judul_artikel?.toLowerCase().includes(searchQuery.toLowerCase());

    // Category filter - assuming article has kategori_id or similar field
    const matchesCategory = typeFilter.length === 0 ||
      typeFilter.includes(article.id_kategori_artikel);

    return matchesSearch && matchesCategory;
  });

  // Filter function for user's articles
  const filteredYourArticles = yourArticles.filter(article => {
    // Status filter
    const matchesStatus = statusFilter === 'semua' ||
      article.status_artikel === statusFilter;

    // Search filter
    const matchesSearch = searchQuery === "" ||
      article.judul_artikel?.toLowerCase().includes(searchQuery.toLowerCase());

    // Category filter
    const matchesCategory = typeFilter.length === 0 ||
      typeFilter.includes(article.id_kategori_artikel);

    return matchesStatus && matchesSearch && matchesCategory;
  });

  return (
    <main>
      <section className="w-full h-screen grid grid-cols-12 bg-[#FCF7F1]">
        {/* Filter Section */}
        <section className="w-[22.875rem] py-[1.9rem] col-span-3 flex flex-col justify-start items-start h-full border-r-2 gap-[3rem]">
          <h1 className="px-[2.313rem] font-bold text-[2.5rem]">Filter</h1>
          <div className="flex flex-col justify-start items-start gap-[0.75rem] w-full">
            <h1 className="px-[2.313rem] text-[1.5rem] font-bold">
              Kategori Artikel
            </h1>
            <div className="px-[2.313rem] flex flex-col justify-start items-start gap-[1.6rem]">
              <div className="flex flex-row justify-center items-center gap-[0.9rem]">
                <div
                  className={`w-[1.8rem] h-[1.8rem] border-[#78D14D] border-[0.1rem] rounded-md cursor-pointer flex flex-col justify-center items-center ${typeFilter.includes(1) ? "bg-[#78D14D]" : "bg-white"
                    }`}
                  onClick={() => toggleType(1)}
                >
                  {typeFilter.includes(1) ? (
                    <>
                      <Check size={18} color="#ffffff" weight="bold"></Check>
                    </>
                  ) : (
                    <></>
                  )}
                </div>
                <p className="font-bold text-[0.875rem]">
                  Teknik Pertanian dan Produksi
                </p>
              </div>
              <div className="flex flex-row justify-center items-center gap-[0.9rem]">
                <div
                  className={`w-[1.8rem] h-[1.8rem] border-[#78D14D] border-[0.1rem] rounded-md cursor-pointer flex flex-col justify-center items-center ${typeFilter.includes(2) ? "bg-[#78D14D]" : "bg-white"
                    }`}
                  onClick={() => toggleType(2)}
                >
                  {typeFilter.includes(2) ? (
                    <>
                      <Check size={18} color="#ffffff" weight="bold"></Check>
                    </>
                  ) : (
                    <></>
                  )}
                </div>
                <p className="font-bold text-[0.875rem]">
                  Pengendalian Hama dan Penyakit
                </p>
              </div>
              <div className="flex flex-row justify-center items-center gap-[0.9rem]">
                <div
                  className={`w-[1.8rem] h-[1.8rem] border-[#78D14D] border-[0.1rem] rounded-md cursor-pointer flex flex-col justify-center items-center ${typeFilter.includes(3) ? "bg-[#78D14D]" : "bg-white"
                    }`}
                  onClick={() => toggleType(3)}
                >
                  {typeFilter.includes(3) ? (
                    <>
                      <Check size={18} color="#ffffff" weight="bold"></Check>
                    </>
                  ) : (
                    <></>
                  )}
                </div>
                <p className="font-bold text-[0.875rem]">
                  Peningkatan Kualitas Pertanian
                </p>
              </div>
              <div className="flex flex-row justify-center items-center gap-[0.9rem]">
                <div
                  className={`w-[1.8rem] h-[1.8rem] border-[#78D14D] border-[0.1rem] rounded-md cursor-pointer flex flex-col justify-center items-center ${typeFilter.includes(4) ? "bg-[#78D14D]" : "bg-white"
                    }`}
                  onClick={() => toggleType(4)}
                >
                  {typeFilter.includes(4) ? (
                    <>
                      <Check size={18} color="#ffffff" weight="bold"></Check>
                    </>
                  ) : (
                    <></>
                  )}
                </div>
                <p className="font-bold text-[0.875rem]">Teknologi Pertanian</p>
              </div>
              <div className="flex flex-row justify-center items-center gap-[0.9rem]">
                <div
                  className={`w-[1.8rem] h-[1.8rem] border-[#78D14D] border-[0.1rem] rounded-md cursor-pointer flex flex-col justify-center items-center ${typeFilter.includes(5) ? "bg-[#78D14D]" : "bg-white"
                    }`}
                  onClick={() => toggleType(5)}
                >
                  {typeFilter.includes(5) ? (
                    <>
                      <Check size={18} color="#ffffff" weight="bold"></Check>
                    </>
                  ) : (
                    <></>
                  )}
                </div>
                <p className="font-bold text-[0.875rem]">
                  Manajemen dan Bisnis Pertanian
                </p>
              </div>
            </div>

            {/* Clear filters button */}
            {(typeFilter.length > 0 || searchQuery !== "") && (
              <div className="px-[2.313rem] w-full">
                <button
                  onClick={() => {
                    setType([]);
                    setSearchQuery("");
                  }}
                  className="text-sm text-gray-600 hover:text-[#78D14D] underline"
                >
                  Hapus semua filter
                </button>
              </div>
            )}

            <div className="w-full h-[0.063rem] bg-[#C3C6D4] mt-[1.25rem]"></div>
          </div>
        </section>

        {/* Main Content Section */}
        <section className="col-span-9 px-[4.8rem] py-[1.9rem] flex flex-col justify-start items-start gap-[2.3rem] overflow-y-scroll mb-[1.9rem]">
          <div className="flex flex-col justify-start items-start gap-[1rem]">
            <h1 className="text-[2.5rem] font-semibold">Daftar Artikel</h1>
            <div className="flex flex-row justify-start items-center gap-[2rem]">
              <button
                onClick={showNormalArticle}
                className={`py-[0.9rem] px-[2.6rem] rounded-lg ${!isYourArticle
                  ? "bg-[#78D14D] text-white"
                  : "bg-none text-[#78D14D]"
                  } cursor-pointer text-[1rem]`}
              >
                Artikel Disimpan
              </button>

              <button
                onClick={showYourArticle}
                className={`py-[0.9rem] px-[2.6rem] rounded-lg ${isYourArticle
                  ? "bg-[#78D14D] text-white"
                  : "bg-none text-[#78D14D]"
                  } cursor-pointer text-[1rem]`}
              >
                Artikel Milikmu
              </button>

              <Link
                href="/articles"
                className="py-[0.9rem] rounded-lg text-[#78D14D] cursor-pointer text-[1rem] hover:text-black transition-all ease-in-out duration-200"
              >
                Cari artikel
              </Link>
              <Link
                href="/dashboard/articles/create"
                className="py-[0.9rem] rounded-lg text-[#78D14D] cursor-pointer text-[1rem] hover:text-black transition-all ease-in-out duration-200"
              >
                Buat artikel
              </Link>
            </div>
          </div>

          <div className="w-[40%]">
            <div className="relative">
              <input
                type="text"
                placeholder="Cari Artikel..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#78D14D] focus:border-transparent"
              />
              <MagnifyingGlass
                size={24}
                color="#6B7280"
                weight="bold"
                className="absolute left-4 top-1/2 transform -translate-y-1/2"
              />
            </div>
          </div>

          {isYourArticle ? (
            <>
              <div className="w-[40%]">
                <select
                  id="status"
                  className="cursor-pointer p-2 border rounded-lg w-full"
                  value={statusFilter}
                  onChange={handleStatusChange}
                >
                  <option value="semua">Semua</option>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>

              {/* Show active filters info */}
              {(typeFilter.length > 0 || searchQuery !== "" || statusFilter !== "semua") && (
                <div className="text-sm text-gray-600">
                  Menampilkan {filteredYourArticles.length} dari {yourArticles.length} artikel
                  {typeFilter.length > 0 && ` • ${typeFilter.length} kategori dipilih`}
                  {searchQuery !== "" && ` • Pencarian: "${searchQuery}"`}
                  {statusFilter !== "semua" && ` • Status: ${statusFilter}`}
                </div>
              )}

              {isLoading ? (
                <div>Memuat artikel...</div>
              ) : filteredYourArticles.length > 0 ? (
                <div className="w-full grid grid-cols-4 h-full gap-x-[2.25rem] gap-y-[2.25rem]">
                  {filteredYourArticles.map((article) => (
                    <ArticleCard
                      key={article.id_artikel}
                      imageURL={`http://localhost:2000/uploads/articles/${article.gambar_artikel}`}
                      title={article.judul_artikel}
                      date={formatDate(article.tanggal_artikel)}
                      href={
                        article.status_artikel === 'draft'
                          ? `/dashboard/articles/${article.id_artikel}/details`
                          : `/articles/${article.id_artikel}/details`
                      }
                      status={article.status_artikel}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-gray-500">
                  {yourArticles.length === 0
                    ? 'Belum ada artikel yang dibuat'
                    : 'Tidak ada artikel yang sesuai dengan filter'}
                </div>
              )}
            </>
          ) : (
            <>
              {/* Show active filters info */}
              {(typeFilter.length > 0 || searchQuery !== "") && (
                <div className="text-sm text-gray-600">
                  Menampilkan {filteredSavedArticles.length} dari {savedArticles.length} artikel
                  {typeFilter.length > 0 && ` • ${typeFilter.length} kategori dipilih`}
                  {searchQuery !== "" && ` • Pencarian: "${searchQuery}"`}
                </div>
              )}

              {isLoading ? (
                <div>Memuat artikel...</div>
              ) : filteredSavedArticles.length > 0 ? (
                <div className="w-full grid grid-cols-4 h-full gap-x-[2.25rem] gap-y-[2.25rem]">
                  {filteredSavedArticles.map((article) => (
                    <ArticleCard
                      key={article.id_artikel}
                      imageURL={`http://localhost:2000/uploads/articles/${article.gambar_artikel}`}
                      title={article.judul_artikel}
                      date={formatDate(article.tanggal_artikel)}
                      href={`/articles/${article.id_artikel}/details`}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-gray-500">
                  {savedArticles.length === 0
                    ? 'Belum ada artikel yang disimpan'
                    : 'Tidak ada artikel yang sesuai dengan filter'}
                </div>
              )}
            </>
          )}
        </section>
      </section>
    </main>
  );
};

export default DashboardArticleMain;