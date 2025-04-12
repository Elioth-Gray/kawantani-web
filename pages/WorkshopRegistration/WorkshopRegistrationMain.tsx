"use client";

import React from "react";
import {
  CaretRight,
  Calendar,
  Timer,
  MapPin,
} from "@phosphor-icons/react/dist/ssr";
import InputField from "@/components/form/InputField";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import Image from "next/image";
import { useState } from "react";
import ActionButton from "@/components/buttons/ActionButton";
import SecondaryButton from "@/components/buttons/SecondaryButton";

const WorkshopRegistrationMain = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextIndex = (e: any) => {
    e.preventDefault();
    setCurrentIndex((prevIndex) => prevIndex + 1);
  };

  const prevIndex = (e: any) => {
    e.preventDefault();
    setCurrentIndex((prevIndex) => prevIndex - 1);
  };

  return (
    <main className="px-[8.1rem] py-[5.3rem]">
      {/* Step Sections */}
      <section>
        <div className="w-full flex flex-row justify-center items-center gap-[2.3rem]">
          <div className="flex flex-row justify-start items-center gap-[1.3rem]">
            <div className="rounded-full border-[0.2rem] border-[#78D14D] w-[3.6rem] h-[3.6rem] flex flex-col justify-center items-center">
              <p className="font-semibold text-[0.8rem]">1</p>
            </div>
            <p className="font-semibold text-[0.8rem]">Pengisian Detail</p>
          </div>
          <CaretRight size={26} color="#000000" />
          <div className="flex flex-row justify-start items-center gap-[1.3rem]">
            <div className="rounded-full border-[0.2rem] border-[#78D14D] w-[3.6rem] h-[3.6rem] flex flex-col justify-center items-center">
              <p className="font-semibold text-[0.8rem]">2</p>
            </div>
            <p className="font-semibold text-[0.8rem]">Pembayaran</p>
          </div>
          <CaretRight size={26} color="#000000" />
          <div className="flex flex-row justify-start items-center gap-[1.3rem]">
            <div className="rounded-full border-[0.2rem] border-[#78D14D] w-[3.6rem] h-[3.6rem] flex flex-col justify-center items-center">
              <p className="font-semibold text-[0.8rem]">3</p>
            </div>
            <p className="font-semibold text-[0.8rem]">Konfirmasi</p>
          </div>
        </div>
      </section>
      {/* Form Section */}
      <section className="mt-[5.3rem]">
        <div className="w-full grid grid-cols-2">
          <div className="col-span-1 flex flex-col justify-start items-start gap-[1.3rem]">
            <form
              action=""
              className="flex flex-col justify-start items-start gap-[1.7rem] w-full"
            >
              {currentIndex === 0 ? (
                <>
                  <div className="flex flex-col justify-start items-start gap-[0.3rem]">
                    <h1 className="text-[1.5rem] font-semibold">
                      Detail Pendaftaran
                    </h1>
                    <p className="text-[0.8rem] w-[80%]">
                      Detail kontak ini akan digunakan untuk pengisian data diri
                      dan pengiriman e-tiket workshop
                    </p>
                  </div>
                  <div className="flex flex-col justify-start items-start gap-[0.1rem] w-[60%]">
                    <p className="text-[0.8rem]">Nama Depan*</p>
                    <InputField type="text"></InputField>
                  </div>
                  <div className="flex flex-col justify-start items-start w-[60%] gap-[0.1rem]">
                    <p className="text-[0.8rem]">Nama Belakang*</p>
                    <InputField type="text"></InputField>
                  </div>
                  <div className="flex flex-col justify-start items-start w-[60%] gap-[0.1rem]">
                    <p className="text-[0.8rem]">Email*</p>
                    <InputField type="text"></InputField>
                  </div>
                  <div className="flex flex-col justify-start items-start w-[60%] gap-[0.1rem]">
                    <p className="text-[0.8rem]">Nomor Telepon*</p>
                    <InputField type="text"></InputField>
                  </div>
                  <div className="flex flex-col justify-start items-start w-[60%] gap-[0.1rem]">
                    <p className="text-[0.8rem]">Tanggal Lahir*</p>
                    <div className="flex flex-row w-full justify-between items-center gap-[1.8rem]">
                      <InputField type="text"></InputField>
                      <InputField type="text"></InputField>
                      <InputField type="text"></InputField>
                    </div>
                  </div>
                  <div className="flex flex-col justify-start items-start w-[60%] gap-[0.1rem]">
                    <p className="text-[0.8rem]">Jenis Kelamin*</p>
                    <div className="flex flex-row w-full justify-between items-center gap-[1.8rem]">
                      <button
                        className="py-[1.125rem] bg-[#F2F2F2] w-full rounded-lg text-[1rem] text-[#4993FA] font-semibold cursor-pointer"
                        type="button"
                      >
                        Laki-Laki
                      </button>
                      <button
                        className="py-[1.125rem] bg-[#F2F2F2] w-full rounded-lg text-[1rem] text-[#FF7C7C] font-semibold cursor-pointer"
                        type="button"
                      >
                        Perempuan
                      </button>
                    </div>
                  </div>
                  <ActionButton
                    textColor="#ffffff"
                    onClickHandler={nextIndex}
                    width="16.25rem"
                    height="3.5rem"
                  >
                    Lanjutkan
                  </ActionButton>
                </>
              ) : (
                <>
                  <div className="flex flex-col justify-start items-start gap-[0.3rem]">
                    <h1 className="text-[1.5rem] font-semibold">
                      Pilih Metode Pembayaran
                    </h1>
                    <p className="text-[0.8rem] w-[80%]">
                      Pilih metode untuk melakukan pembayaran workshop
                    </p>
                  </div>
                  <div className="flex flex-col justify-start items-start gap-[0.1rem] w-[60%]">
                    <p className="text-[0.8rem]">Nama Depan*</p>
                    <InputField type="text"></InputField>
                  </div>
                  <div className="flex flex-col justify-start items-start w-[60%] gap-[0.1rem]">
                    <p className="text-[0.8rem]">Nama Belakang*</p>
                    <InputField type="text"></InputField>
                  </div>
                  <div className="flex flex-col justify-start items-start w-[60%] gap-[0.1rem]">
                    <p className="text-[0.8rem]">Email*</p>
                    <InputField type="text"></InputField>
                  </div>
                  <div className="flex flex-col justify-start items-start w-[60%] gap-[0.1rem]">
                    <p className="text-[0.8rem]">Nomor Telepon*</p>
                    <InputField type="text"></InputField>
                  </div>
                  <div className="flex flex-col justify-start items-start w-[60%] gap-[0.1rem]">
                    <p className="text-[0.8rem]">Tanggal Lahir*</p>
                    <div className="flex flex-row w-full justify-between items-center gap-[1.8rem]">
                      <InputField type="text"></InputField>
                      <InputField type="text"></InputField>
                      <InputField type="text"></InputField>
                    </div>
                  </div>
                  <div className="flex flex-col justify-start items-start w-[60%] gap-[0.1rem]">
                    <p className="text-[0.8rem]">Jenis Kelamin*</p>
                    <div className="flex flex-row w-full justify-between items-center gap-[1.8rem]">
                      <button
                        className="py-[1.125rem] bg-[#F2F2F2] w-full rounded-lg text-[1rem] text-[#4993FA] font-semibold cursor-pointer"
                        type="button"
                      >
                        Laki-Laki
                      </button>
                      <button
                        className="py-[1.125rem] bg-[#F2F2F2] w-full rounded-lg text-[1rem] text-[#FF7C7C] font-semibold cursor-pointer"
                        type="button"
                      >
                        Perempuan
                      </button>
                    </div>
                  </div>
                  <div className="w-full flex flex-col justify-start items-start gap-[1rem]">
                    <ActionButton
                      textColor="#ffffff"
                      onClickHandler={nextIndex}
                      width="16.25rem"
                      height="3.5rem"
                    >
                      Lanjutkan
                    </ActionButton>
                    <SecondaryButton
                      onClickHandler={prevIndex}
                      width="16.25rem"
                      height="3.5rem"
                      hover={false}
                    >
                      Kembali
                    </SecondaryButton>
                  </div>
                </>
              )}
            </form>
          </div>
          <div className="col-span-1 flex flex-row justify-end items-start w-full">
            <div className="w-[80%] flex flex-col justify-start items-start gap-[2.25rem]">
              <Image
                className=" object-cover w-full h-[16.8rem] rounded-lg"
                width={545}
                height={307}
                src="/images/workshop-image.jpg"
                alt="cabai"
                quality={100}
                unoptimized
              ></Image>
              <h1 className="text-[1.5rem] font-semibold w-[70%]">
                Teknik Genjot Padi Untuk Keberlanjutan Pangan Jawa Tengah
              </h1>
              <div className="flex flex-col justify-start items-start gap-[0.9rem]">
                <div className="flex flex-row justify-start items-center gap-[0.75rem]">
                  <Calendar size={26} color="#000000" />
                  <p className="text-[0.75rem]">Jumat, 15 Februari 2025</p>
                </div>
                <div className="flex flex-row justify-start items-center gap-[0.75rem]">
                  <MapPin size={26} color="#000000" />
                  <p className="text-[0.75rem]">Mojokerto, Jawa Timur</p>
                </div>
                <div className="flex flex-row justify-start items-center gap-[0.75rem]">
                  <Timer size={26} color="#000000" />
                  <p className="text-[0.75rem]">07.00 - 15.00 WIB</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default WorkshopRegistrationMain;
