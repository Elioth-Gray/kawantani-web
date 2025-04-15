import React from "react";

import { CalendarDots, DownloadSimple } from "@phosphor-icons/react/dist/ssr";

const FacilitatorHomeMain = () => {
  return (
    <main className="w-full h-screen bg-[#09090B] py-[4.5rem] px-[5.1rem] text-white overflow-auto">
      <section className="w-full h-full">
        <div className="w-full flex flex-row justify-between items-center mb-[3.1rem]">
          <h1 className="text-[2.25rem] font-semibold">Dashboard</h1>
          <div className="flex flex-row justify-end items-center gap-[0.4rem]">
            <div className="py-[0.5rem] px-[0.8rem] flex flex-row justify-center items-center border-[0.18rem] border-[#27272A] rounded-lg gap-[0.5rem]">
              <CalendarDots size={24} color="#ffff"></CalendarDots>
              <p className="font-semibold">12 April 2025</p>
            </div>
            <button className="py-[0.5rem] px-[0.8rem] flex flex-row justify-center items-center bg-white text-black rounded-lg gap-[0.5rem]">
              <DownloadSimple size={24} color="#fffff"></DownloadSimple>
              <p className="font-semibold">Download</p>
            </button>
          </div>
        </div>
        <div className="w-full h-full grid grid-cols-8">
          <div className="col-span-5 w-full h-full flex flex-col justify-start items-start gap-[2rem]">
            <div className="flex flex-row justify-between items-center w-full">
              <div className="flex flex-col justify-center items-start py-[1.5rem] px-[1.4rem] border-[0.3rem] border-[#27272A] rounded-xl w-[17rem] h-[9.4rem] gap-[0.5rem]">
                <p>Total Pendapatan</p>
                <p className="font-semibold text-[1.5rem]">Rp. 45.000.000</p>
                <p>Dari total workshop</p>
              </div>
              <div className="flex flex-col justify-center items-start py-[1.5rem] px-[1.4rem] border-[0.3rem] border-[#27272A] rounded-xl w-[17rem] h-[9.4rem] gap-[0.5rem]">
                <p>Tiket Terjual</p>
                <p className="font-semibold text-[1.5rem]">256</p>
                <p>Dari workshop</p>
              </div>
            </div>
            <div className="flex flex-col justify-start items-start py-[1.5rem] px-[1.4rem] border-[0.3rem] border-[#27272A] rounded-xl w-full h-[9.4rem] gap-[0.5rem]">
              <p className="font-semibold">Grafik Pendapatan</p>
            </div>
          </div>
          <div className="col-span-3 w-full h-full">
            <div className="flex flex-col justify-end items-end w-full">
              <div className="flex flex-col justify-center items-start py-[1.5rem] px-[1.4rem] border-[0.3rem] border-[#27272A] rounded-xl w-[17rem] h-[9.4rem] gap-[0.5rem]">
                <p>Pendaftar Aktif Saat Ini</p>
                <p className="font-semibold text-[1.5rem]">120</p>
                <p>Pada workshop</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default FacilitatorHomeMain;
