"use client";

import React from "react";
import PlantCard from "@/components/cards/PlantCard";
import { useState } from "react";

const DashboardPlantsMain = () => {
  const [isCompletedPlants, setIsCompletedPlants] = useState(false);

  const showCompletedPlants = () => {
    setIsCompletedPlants(true);
  };

  const showUncompletedPlants = () => {
    setIsCompletedPlants(false);
  };

  return (
    <main>
      <section className="w-full h-screen grid grid-cols-12 bg-[#FCF7F1]">
        {/* Filter Section */}
        <section className="w-[22.875rem] py-[1.9rem] col-span-3 flex flex-col justify-start items-start h-full border-r-2 gap-[3rem] bg-white">
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
          <div className="flex flex-col justify-start items-start gap-[1rem]">
            <h1 className="text-[2.5rem] font-semibold">Daftar Tanaman</h1>
            <div className="flex flex-row justify-start items-center gap-[2rem]">
              <button
                onClick={() => {
                  showUncompletedPlants();
                }}
                className={`py-[0.9rem] px-[2.6rem] rounded-lg ${
                  isCompletedPlants
                    ? "bg-none text-[#78D14D]"
                    : "bg-[#78D14D] text-white"
                } cursor-pointer text-[1rem]`}
              >
                Tanaman Dalam Proses
              </button>
              <button
                onClick={() => {
                  showCompletedPlants();
                }}
                className={`py-[0.9rem] px-[2.6rem] rounded-lg ${
                  isCompletedPlants
                    ? "bg-[#78D14D] text-white"
                    : "bg-none text-[#78D14D]"
                } cursor-pointer text-[1rem]`}
              >
                Tanaman Selesai Proses
              </button>
              <button className="py-[0.9rem]  rounded-lg  text-[#78D14D] cursor-pointer text-[1rem]">
                Tambah Tanaman
              </button>
            </div>
          </div>
          <div className="w-full grid grid-cols-3 h-full gap-x-[2.25rem] gap-y-[16.25rem]">
            {isCompletedPlants
              ? [...Array(4)].map((_, index) => (
                  <PlantCard
                    key={index}
                    imageURL="/images/cabai.jpg"
                    title="Cabai"
                    description="Cabai populer karena permintaan pasar yang tinggi dan manfaatnya dalam masakan."
                  />
                ))
              : [...Array(6)].map((_, index) => (
                  <PlantCard
                    key={index}
                    imageURL="/images/lemon.jpg"
                    title="Lemon Malang"
                    description="Cabai populer karena permintaan pasar yang tinggi dan manfaatnya dalam masakan."
                  />
                ))}
          </div>
        </section>
      </section>
    </main>
  );
};

export default DashboardPlantsMain;
