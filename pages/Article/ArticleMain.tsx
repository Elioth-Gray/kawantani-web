import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import ArticleCard from "@/components/cards/ArticleCard";

const ArticleMain = () => {
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
                <div className="w-[1.8rem] h-[1.8rem] border-[#78D14D] border-[0.1rem] rounded-md"></div>
                <p className="font-bold text-[0.6rem]">1</p>
              </div>
              <div className="flex flex-col justify-center items-center gap-[0.1rem]">
                <div className="w-[1.8rem] h-[1.8rem] border-[#78D14D] border-[0.1rem] rounded-md"></div>
                <p className="font-bold text-[0.6rem]">2</p>
              </div>
              <div className="flex flex-col justify-center items-center gap-[0.1rem]">
                <div className="w-[1.8rem] h-[1.8rem] border-[#78D14D] border-[0.1rem] rounded-md"></div>
                <p className="font-bold text-[0.6rem]">3</p>
              </div>
              <div className="flex flex-col justify-center items-center gap-[0.1rem]">
                <div className="w-[1.8rem] h-[1.8rem] border-[#78D14D] border-[0.1rem] rounded-md"></div>
                <p className="font-bold text-[0.6rem]">4</p>
              </div>
              <div className="flex flex-col justify-center items-center gap-[0.1rem]">
                <div className="w-[1.8rem] h-[1.8rem] border-[#78D14D] border-[0.1rem] rounded-md"></div>
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
              <div className="flex flex-row justify-start items-center gap-[0.9rem]">
                <div className="w-[1.8rem] h-[1.8rem] border-[#78D14D] border-[0.1rem] rounded-md"></div>
                <p className="font-bold text-[0.875rem]">
                  Teknik Pertanian dan Produksi
                </p>
              </div>
              <div className="flex flex-row justify-start items-center gap-[0.9rem]">
                <div className="w-[1.8rem] h-[1.8rem] border-[#78D14D] border-[0.1rem] rounded-md"></div>
                <p className="font-bold text-[0.875rem]">
                  Pengendalian Hama dan Penyakit
                </p>
              </div>
              <div className="flex flex-row justify-start items-center gap-[0.9rem]">
                <div className="w-[1.8rem] h-[1.8rem] border-[#78D14D] border-[0.1rem] rounded-md"></div>
                <p className="font-bold text-[0.875rem]">
                  Peningkatan Kualitas Pertanian
                </p>
              </div>
              <div className="flex flex-row justify-start items-center gap-[0.9rem]">
                <div className="w-[1.8rem] h-[1.8rem] border-[#78D14D] border-[0.1rem] rounded-md"></div>
                <p className="font-bold text-[0.875rem]">
                  Teknik Pertanian dan Produksi
                </p>
              </div>
              <div className="flex flex-row justify-start items-center gap-[0.9rem]">
                <div className="w-[1.8rem] h-[1.8rem] border-[#78D14D] border-[0.1rem] rounded-md"></div>
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
