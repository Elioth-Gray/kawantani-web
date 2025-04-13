"use client";

import React from "react";
import ArticleCard from "@/components/cards/ArticleCard";
import { Check, MagnifyingGlass } from "@phosphor-icons/react/dist/ssr";
import { useState } from "react";
import InputField from "@/components/form/InputField";

const ArticleMain = () => {
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

  return (
    <main>
      <section className="w-full h-screen grid grid-cols-12">
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
          <h1 className="text-[2.5rem] font-semibold">Daftar Artikel</h1>
          <div className="w-[40%]">
            <InputField placeholder="Cari Artikel....." type="text">
              <MagnifyingGlass
                size={24}
                color="#fffff"
                weight="bold"
                className="absolute left-[1.5rem]"
              ></MagnifyingGlass>
            </InputField>
          </div>
          <div className="w-full grid grid-cols-4 h-full gap-x-[2.25rem] gap-y-[2.25rem]">
            <ArticleCard
              imageURL="/images/bayam.jpg"
              title="Teknik Agar Bayam Tidak Rusak Saat Masa Tanam"
              date="14 Februari 2025"
            ></ArticleCard>
            <ArticleCard
              imageURL="/images/bayam.jpg"
              title="Teknik Agar Bayam Tidak Rusak Saat Masa Tanam"
              date="14 Februari 2025"
            ></ArticleCard>
            <ArticleCard
              imageURL="/images/bayam.jpg"
              title="Teknik Agar Bayam Tidak Rusak Saat Masa Tanam"
              date="14 Februari 2025"
            ></ArticleCard>
            <ArticleCard
              imageURL="/images/bayam.jpg"
              title="Teknik Agar Bayam Tidak Rusak Saat Masa Tanam"
              date="14 Februari 2025"
            ></ArticleCard>
            <ArticleCard
              imageURL="/images/bayam.jpg"
              title="Teknik Agar Bayam Tidak Rusak Saat Masa Tanam"
              date="14 Februari 2025"
            ></ArticleCard>
            <ArticleCard
              imageURL="/images/bayam.jpg"
              title="Teknik Agar Bayam Tidak Rusak Saat Masa Tanam"
              date="14 Februari 2025"
            ></ArticleCard>
            <ArticleCard
              imageURL="/images/bayam.jpg"
              title="Teknik Agar Bayam Tidak Rusak Saat Masa Tanam"
              date="14 Februari 2025"
            ></ArticleCard>
          </div>
        </section>
      </section>
    </main>
  );
};

export default ArticleMain;
