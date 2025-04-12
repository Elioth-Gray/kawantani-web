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
import { useRouter } from "next/navigation";

const WorkshopRegistrationSuccessMain = () => {
  const router = useRouter();

  const navigate = () => {
    router.push("/dashboard");
  };

  return (
    <main className="px-[8.1rem] py-[5.3rem]">
      {/* Form Section */}
      <section className="mt-[5.3rem]">
        <div className="w-full grid grid-cols-2">
          <div className="col-span-1 flex flex-col justify-start items-start gap-[1.3rem]">
            <div className="flex flex-col justify-start items-start gap-[0.3rem] w-full">
              <h1 className="text-[1.5rem] font-semibold">Selamat!</h1>
              <p className="text-[0.8rem] w-[80%]">
                Anda telah terdaftar pada workshop ini, berikut adalah detail
                tiket anda
              </p>
            </div>
            <div className="flex flex-col justify-start items-start gap-[0.3rem] w-[60%]">
              <h1 className="text-[1.25rem] font-semibold">
                Informasi Peserta:
              </h1>
              <div className="flex flex-row justify-between items-center w-full">
                <p>Nama Peserta</p>
                <p>: Mas Azril</p>
              </div>
              <div className="flex flex-row justify-between items-center w-full">
                <p>Email</p>
                <p>: Azriel123@mail.com</p>
              </div>
              <div className="flex flex-row justify-between items-center w-full">
                <p>Nomor Telepon</p>
                <p>: 08123456789</p>
              </div>
              <div className="flex flex-row justify-between items-center w-full">
                <p>Tanggal Lahir</p>
                <p>: 19 April 2025</p>
              </div>
              <div className="flex flex-row justify-between items-center w-full">
                <p>Jenis Kelamin</p>
                <p>: Laki-Laki</p>
              </div>
            </div>
            <div className="flex flex-col justify-start items-start gap-[0.3rem] w-[60%]">
              <h1 className="text-[1.25rem] font-semibold">
                Informasi Pembayaran:
              </h1>
              <div className="flex flex-row justify-between items-center w-full">
                <p>Metode Pembayaran</p>
                <p>: Gopay</p>
              </div>
              <div className="flex flex-row justify-between items-center w-full">
                <p>Total Harga</p>
                <p>: Rp.100.000,00</p>
              </div>
              <div className="flex flex-row justify-between items-center w-full">
                <p>Status Pembayaran</p>
                <p>: Berhasil</p>
              </div>
            </div>
            <div className="w-full flex flex-col justify-start items-start gap-[1rem]">
              <ActionButton
                textColor="#ffffff"
                onClickHandler={navigate}
                width="16.25rem"
                height="3.5rem"
              >
                Kembali Ke Halaman Utama
              </ActionButton>
            </div>
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

export default WorkshopRegistrationSuccessMain;
