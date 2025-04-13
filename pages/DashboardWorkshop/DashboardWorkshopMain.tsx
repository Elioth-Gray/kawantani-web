import React from "react";
import WorkshopCard from "@/components/cards/WorkshopCard";
import Link from "next/link";

const DashboardWorkshopMain = () => {
  return (
    <main>
      <section className="w-full h-screen grid grid-cols-12 bg-[#FCF7F1]">
        {/* Filter Section */}
        <section className="w-[22.875rem] py-[1.9rem] col-span-3 flex flex-col justify-start items-start h-full border-r-2 gap-[3rem]">
          <h1 className="px-[2.313rem] font-bold text-[2.5rem]">Filter</h1>
          <div className="flex flex-col justify-start items-start gap-[0.75rem] w-full">
            <h1 className="px-[2.313rem] text-[1.5rem] font-bold">Lokasi</h1>
            <div className="px-[2.313rem] w-full grid grid-cols-2 gap-[0.8rem]">
              <div className="col-span-1 w-full">
                <input
                  type="text"
                  className="py-[0.8rem] bg-[#F2F2F2] w-full rounded-lg px-[0.8rem] border border-black"
                  placeholder="Provinsi"
                />
              </div>
              <div className="col-span-1 w-full">
                <input
                  type="text"
                  className="py-[0.8rem] bg-[#F2F2F2] w-full rounded-lg px-[0.8rem] border border-black"
                  placeholder="Kabupaten"
                />
              </div>
            </div>
            <div className="px-[2.313rem] w-full grid grid-cols-2 gap-[0.8rem]">
              <div className="col-span-1 w-full">
                <input
                  type="text"
                  className="py-[0.8rem] bg-[#F2F2F2] w-full rounded-lg px-[0.8rem] border border-black"
                  placeholder="Kota"
                />
              </div>
              <div className="col-span-1 w-full">
                <input
                  type="text"
                  className="py-[0.8rem] bg-[#F2F2F2] w-full rounded-lg px-[0.8rem] border border-black"
                  placeholder="Desa"
                />
              </div>
            </div>
            <div className="w-full h-[0.063rem] bg-[#C3C6D4] mt-[1.25rem]"></div>
          </div>
          <div className="flex flex-col justify-start items-start gap-[0.75rem] w-full">
            <h1 className="px-[2.313rem] text-[1.5rem] font-bold">Tanggal</h1>
            <div className="px-[2.313rem] w-full grid grid-cols-1 gap-[0.8rem]">
              <div className="col-span-1 w-full">
                <input
                  type="date"
                  className="py-[0.8rem] bg-[#F2F2F2] w-full rounded-lg px-[0.8rem] border border-black"
                  placeholder="Tanggal Awal"
                />
              </div>
              <div className="col-span-1 w-full">
                <input
                  type="date"
                  className="py-[0.8rem] bg-[#F2F2F2] w-full rounded-lg px-[0.8rem] border border-black"
                  placeholder="Tanggal Akhir"
                />
              </div>
            </div>
            <div className="w-full h-[0.063rem] bg-[#C3C6D4] mt-[1.25rem]"></div>
          </div>
        </section>
        <section className="col-span-9 px-[4.8rem] py-[1.9rem] flex flex-col justify-start items-start gap-[2.3rem] overflow-y-scroll mb-[1.9rem]">
          <div className="flex flex-col justify-start items-start gap-[1rem]">
            <h1 className="text-[2.5rem] font-semibold">Daftar Workshop</h1>
            <div className="flex flex-row justify-start items-center gap-[2rem]">
              <button className="py-[0.9rem] px-[2.6rem] rounded-lg bg-[#78D14D] text-white cursor-pointer text-[1rem]">
                Workshop Diikuti
              </button>
              <Link
                href="/workshops"
                className="py-[0.9rem]  rounded-lg  text-[#78D14D] cursor-pointer text-[1rem]"
              >
                ikuti Workshop
              </Link>
            </div>
          </div>
          <div className="w-full grid grid-cols-2 h-full gap-x-[2.25rem] gap-y-[2.25rem]">
            {[...Array(6)].map((_, index) => {
              return (
                <WorkshopCard
                  key={index}
                  imageURL="/images/workshop-image.jpg"
                  title="Teknik Genjot Padi Untuk Keberlanjutan Pangan Jawa Tengah"
                  date="Jumat, 15 Februari 2025"
                  location="Balai Kota Solo, Jawa Tengah"
                ></WorkshopCard>
              );
            })}
          </div>
        </section>
      </section>
    </main>
  );
};

export default DashboardWorkshopMain;
