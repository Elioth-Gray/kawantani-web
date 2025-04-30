"use client";

import React from "react";
import ArticleCard from "@/components/cards/ArticleCard";
import Link from "next/link";
import { Check } from "@phosphor-icons/react/dist/ssr";
import { useState } from "react";
import InputField from "@/components/form/InputField";
import { MagnifyingGlass } from "@phosphor-icons/react/dist/ssr";

const DashboardArticleMain = () => {
  const [ratingFilter, setRating] = useState<number>(0);
  const [typeFilter, setType] = useState<number[]>([]);

  const toggleRating = (newRating: number) => {
    setRating((prevRating) => (prevRating === newRating ? 0 : newRating));
  };

  const toggleType = (filterId: number) => {
    setType((prevFilters) => {
      if (prevFilters.includes(filterId)) {
        return prevFilters.filter((id) => id !== filterId);
      } else {
        return [...prevFilters, filterId];
      }
    });
  };

  const [isYourArticle, setIsYourArticle] = useState(false);

  const showYourArticle = () => {
    setIsYourArticle(true);
  };

  const showNormalArticle = () => {
    setIsYourArticle(false);
  };

  return (
    <main>
      <section className="w-full h-screen grid grid-cols-12 bg-[#FCF7F1]">
        {/* Filter Section */}
        <section className="w-[22.875rem] py-[1.9rem] col-span-3 flex flex-col justify-start items-start h-full border-r-2 gap-[3rem]">
          <h1 className="px-[2.313rem] font-bold text-[2.5rem]">Filter</h1>
          <div className="flex flex-col justify-start items-start gap-[0.75rem] w-full">
            <h1 className="px-[2.313rem] text-[1.5rem] font-bold">Rating</h1>
            <div className="px-[2.313rem] flex flex-row justify-start items-center gap-[1.6rem]">
              <div className="flex flex-col justify-center items-center gap-[0.1rem]">
                <div
                  className={`w-[1.8rem] h-[1.8rem] border-[#78D14D] border-[0.1rem] rounded-md cursor-pointer flex flex-col justify-center items-center ${
                    ratingFilter >= 1 ? "bg-[#78D14D]" : "bg-white"
                  }`}
                  onClick={() => toggleRating(1)}
                >
                  {ratingFilter >= 1 ? (
                    <>
                      <Check size={18} color="#ffffff" weight="bold"></Check>
                    </>
                  ) : (
                    <></>
                  )}
                </div>
                <p className="font-bold text-[0.6rem]">1</p>
              </div>
              <div className="flex flex-col justify-center items-center gap-[0.1rem]">
                <div
                  className={`w-[1.8rem] h-[1.8rem] border-[#78D14D] border-[0.1rem] rounded-md cursor-pointer flex flex-col justify-center items-center ${
                    ratingFilter >= 2 ? "bg-[#78D14D]" : "bg-white"
                  }`}
                  onClick={() => toggleRating(2)}
                >
                  {ratingFilter >= 2 ? (
                    <>
                      <Check size={18} color="#ffffff" weight="bold"></Check>
                    </>
                  ) : (
                    <></>
                  )}
                </div>
                <p className="font-bold text-[0.6rem]">2</p>
              </div>
              <div className="flex flex-col justify-center items-center gap-[0.1rem]">
                <div
                  className={`w-[1.8rem] h-[1.8rem] border-[#78D14D] border-[0.1rem] rounded-md cursor-pointer flex flex-col justify-center items-center ${
                    ratingFilter >= 3 ? "bg-[#78D14D]" : "bg-white"
                  }`}
                  onClick={() => toggleRating(3)}
                >
                  {ratingFilter >= 3 ? (
                    <>
                      <Check size={18} color="#ffffff" weight="bold"></Check>
                    </>
                  ) : (
                    <></>
                  )}
                </div>
                <p className="font-bold text-[0.6rem]">3</p>
              </div>
              <div className="flex flex-col justify-center items-center gap-[0.1rem]">
                <div
                  className={`w-[1.8rem] h-[1.8rem] border-[#78D14D] border-[0.1rem] rounded-md cursor-pointer flex flex-col justify-center items-center ${
                    ratingFilter >= 4 ? "bg-[#78D14D]" : "bg-white"
                  }`}
                  onClick={() => toggleRating(4)}
                >
                  {ratingFilter >= 4 ? (
                    <>
                      <Check size={18} color="#ffffff" weight="bold"></Check>
                    </>
                  ) : (
                    <></>
                  )}
                </div>
                <p className="font-bold text-[0.6rem]">4</p>
              </div>
              <div className="flex flex-col justify-center items-center gap-[0.1rem]">
                <div
                  className={`w-[1.8rem] h-[1.8rem] border-[#78D14D] border-[0.1rem] rounded-md cursor-pointer flex flex-col justify-center items-center ${
                    ratingFilter >= 5 ? "bg-[#78D14D]" : "bg-white"
                  }`}
                  onClick={() => toggleRating(5)}
                >
                  {ratingFilter >= 5 ? (
                    <>
                      <Check size={18} color="#ffffff" weight="bold"></Check>
                    </>
                  ) : (
                    <></>
                  )}
                </div>
                <p className="font-bold text-[0.6rem]">5</p>
              </div>
            </div>
            <div className="w-full h-[0.063rem] bg-[#C3C6D4] mt-[1.25rem]"></div>
          </div>
          <div className="flex flex-col justify-start items-start gap-[0.75rem] w-full">
            <h1 className="px-[2.313rem] text-[1.5rem] font-bold">
              Kategori Artikel
            </h1>
            <div className="px-[2.313rem] flex flex-col justify-start items-start gap-[1.6rem]">
              <div className="flex flex-row justify-center items-center gap-[0.9rem]">
                <div
                  className={`w-[1.8rem] h-[1.8rem] border-[#78D14D] border-[0.1rem] rounded-md cursor-pointer flex flex-col justify-center items-center ${
                    typeFilter.includes(1) ? "bg-[#78D14D]" : "bg-white"
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
                  className={`w-[1.8rem] h-[1.8rem] border-[#78D14D] border-[0.1rem] rounded-md cursor-pointer flex flex-col justify-center items-center ${
                    typeFilter.includes(2) ? "bg-[#78D14D]" : "bg-white"
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
                  className={`w-[1.8rem] h-[1.8rem] border-[#78D14D] border-[0.1rem] rounded-md cursor-pointer flex flex-col justify-center items-center ${
                    typeFilter.includes(3) ? "bg-[#78D14D]" : "bg-white"
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
                  className={`w-[1.8rem] h-[1.8rem] border-[#78D14D] border-[0.1rem] rounded-md cursor-pointer flex flex-col justify-center items-center ${
                    typeFilter.includes(4) ? "bg-[#78D14D]" : "bg-white"
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
                  className={`w-[1.8rem] h-[1.8rem] border-[#78D14D] border-[0.1rem] rounded-md cursor-pointer flex flex-col justify-center items-center ${
                    typeFilter.includes(5) ? "bg-[#78D14D]" : "bg-white"
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
            <div className="w-full h-[0.063rem] bg-[#C3C6D4] mt-[1.25rem]"></div>
          </div>
        </section>
        <section className="col-span-9 px-[4.8rem] py-[1.9rem] flex flex-col justify-start items-start gap-[2.3rem] overflow-y-scroll mb-[1.9rem]">
          <div className="flex flex-col justify-start items-start gap-[1rem]">
            <h1 className="text-[2.5rem] font-semibold">Daftar Artikel</h1>
            <div className="flex flex-row justify-start items-center gap-[2rem]">
              <button
                onClick={() => {
                  showNormalArticle();
                }}
                className={`py-[0.9rem] px-[2.6rem] rounded-lg ${
                  isYourArticle
                    ? "bg-none text-[#78D14D]"
                    : "bg-[#78D14D] text-white"
                } cursor-pointer text-[1rem]`}
              >
                Artikel Disimpan
              </button>
              <button
                onClick={() => {
                  showYourArticle();
                }}
                className={`py-[0.9rem] px-[2.6rem] rounded-lg ${
                  isYourArticle
                    ? "bg-[#78D14D] text-white"
                    : "bg-none text-[#78D14D]"
                } cursor-pointer text-[1rem]`}
              >
                Artikel Milikmu
              </button>
              <Link
                href="/articles"
                className="py-[0.9rem]  rounded-lg  text-[#78D14D] cursor-pointer text-[1rem] hover:text-black transition-all ease-in-out duration-200"
              >
                Cari artikel
              </Link>
              <Link
                href="/dashboard/articles/create"
                className="py-[0.9rem]  rounded-lg  text-[#78D14D] cursor-pointer text-[1rem] hover:text-black transition-all ease-in-out duration-200"
              >
                Buat artikel
              </Link>
            </div>
          </div>
          <div className="w-[40%]">
            <InputField placeholder="Cari Tanaman....." type="text">
              <MagnifyingGlass
                size={24}
                color="#fffff"
                weight="bold"
                className="absolute left-[1.5rem]"
              ></MagnifyingGlass>
            </InputField>
          </div>
          {isYourArticle ? (
            <>
              <div className="w-[40%]">
                <select id="status" className="cursor-pointer">
                  <option value="semua">Semua</option>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </>
          ) : (
            <></>
          )}
          <div className="w-full grid grid-cols-4 h-full gap-x-[2.25rem] gap-y-[2.25rem]">
            {isYourArticle ? (
              <>
                {[...Array(5)].map((_, index) => {
                  return (
                    <ArticleCard
                      key={index}
                      imageURL="/images/bayam.webp"
                      title="Teknik Agar Bayam Tidak Rusak Saat Masa Tanam"
                      date="14 Februari 2025"
                      href="/dashboard/articles/221982981/details"
                      status="(Draft)"
                      linkLabel="Lihat detail"
                    ></ArticleCard>
                  );
                })}
              </>
            ) : (
              <>
                {[...Array(3)].map((_, index) => {
                  return (
                    <ArticleCard
                      key={index}
                      imageURL="/images/bayam.webp"
                      title="Teknik Agar Bayam Tidak Rusak Saat Masa Tanam"
                      date="14 Februari 2025"
                      href="/articles/221982981/details"
                    ></ArticleCard>
                  );
                })}
              </>
            )}
          </div>
        </section>
      </section>
    </main>
  );
};

export default DashboardArticleMain;
