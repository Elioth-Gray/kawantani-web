"use client";

import React from "react";
import DashboardNavbar from "@/components/navbar/DashboardNavbar";
import MainLabel from "@/components/label/MainLabel";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "@phosphor-icons/react";

const CreateArticleMain = () => {
  const router = useRouter();

  return (
    <main className="py-[5rem] px-[9.6rem]">
      <section className="w-full">
        <div
          className="w-full flex flex-row justify-start items-center gap-[1rem] mb-[2.3rem] cursor-pointers"
          onClick={() => {
            router.back();
          }}
        >
          <ArrowLeft
            size={24}
            color="#00000"
            weight="bold"
            className="cursor-pointer"
          />
          <p className="cursor-pointer">Kembali</p>
        </div>
      </section>
      {/* Section Form */}
      <section className="w-full">
        <div className="w-full flex flex-col justify-start items-start">
          <h1 className="text-[2.5rem] font-semibold mb-[2.5rem]">
            Tulis Artikel
          </h1>
          <form
            action=""
            className="w-full flex flex-col justify-start items-start gap-[4rem]"
          >
            <div className="flex flex-row justify-start items-center gap-[1.6rem]">
              <h1 className="text-[1.5rem] font-semibold">Kategori Artikel*</h1>
              <div className="w-[23.25rem] h-[3.7rem] py-[0.8rem] bg-[#F2F2F2] rounded-lg px-[0.8rem] border border-black text-black flex flex-col justify-center items-center">
                <select className="w-full">
                  <option value="kota1">Teknik Pertanian dan Produksi</option>
                  <option value="kota2">Pengendalian Hama dan Penyakit</option>
                  <option value="kota3">Peningkatan Kualitas Pertanian</option>
                  <option value="kota3">Teknologi Pertanian</option>
                  <option value="kota3">Manajemen dan Bisnis Pertanian</option>
                </select>
              </div>
            </div>
            <div className="flex flex-row justify-start items-center gap-[1.6rem]">
              <h1 className="text-[1.5rem] font-semibold">Judul*</h1>
              <input
                className="w-[25.25rem] h-[3.7rem] py-[0.8rem] bg-[#F2F2F2] rounded-lg px-[0.8rem] border border-black text-black flex flex-col justify-center items-center"
                type="text"
              ></input>
            </div>
            <div className="flex flex-row justify-start items-start gap-[1.6rem]">
              <h1 className="text-[1.5rem] font-semibold">Deskripsi*</h1>
              <textarea className="w-[50rem] h-[10rem] py-[0.8rem] bg-[#F2F2F2] rounded-lg px-[0.8rem] border border-black text-black flex flex-col justify-center items-center"></textarea>
            </div>
            <div className="flex flex-col justify-start items-start gap-[1.6rem] w-full">
              <h1 className="text-[1.5rem] font-semibold">Isi Artikel*</h1>
              <textarea className="w-full h-[32.8rem] py-[0.8rem] bg-[#F2F2F2] rounded-lg px-[0.8rem] border border-black text-black flex flex-col justify-center items-center"></textarea>
            </div>
            <div className="flex flex-row justify-start items-startr w-full gap-[1rem]">
              <p className="text-[1.5rem] font-semibold">Foto Artikel*</p>
              <div className="flex flex-col justify-start items-start">
                <input
                  type="file"
                  className="w-full bg-[#F2F2F2] rounded-lg py-[1.1rem] px-[1.1rem] border border-black"
                />
                <p className="text-black">
                  SVG, PNG, JPG or GIF (MAX. 800x400px).
                </p>
              </div>
            </div>
            <div className="flex flex-row justify-start items-start gap-[2rem]">
              <PrimaryButton textColor="#ffffff">
                Simpan Sebagai Draft
              </PrimaryButton>
              <PrimaryButton textColor="#ffffff">Publish Artikel</PrimaryButton>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
};

export default CreateArticleMain;