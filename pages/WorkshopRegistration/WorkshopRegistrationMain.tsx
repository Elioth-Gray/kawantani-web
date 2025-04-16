"use client";

import React from "react";
import {
  CaretRight,
  Calendar,
  Timer,
  MapPin,
  ArrowLeft,
} from "@phosphor-icons/react/dist/ssr";
import InputField from "@/components/form/InputField";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import Image from "next/image";
import { useState } from "react";
import ActionButton from "@/components/buttons/ActionButton";
import SecondaryButton from "@/components/buttons/SecondaryButton";
import { useRouter, usePathname } from "next/navigation";

const WorkshopRegistrationMain = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [genderSelected, setGenderSelected] = useState<number>();
  const [paymentSelected, setPaymentSelected] = useState<number>();

  const setGender = (newGender: number) => {
    setGenderSelected(newGender);
  };

  const setPayment = (newPayment: number) => {
    setPaymentSelected(newPayment);
    console.log(newPayment);
  };

  const router = useRouter();

  const pathname = usePathname();

  const navigate = (e: any) => {
    e.preventDefault();
    router.push(`${pathname}/success`);
  };

  const nextIndex = (e: any) => {
    e.preventDefault();
    if (currentIndex < 2) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  };

  const prevIndex = (e: any) => {
    e.preventDefault();
    setCurrentIndex((prevIndex) => prevIndex - 1);
  };

  return (
    <main className="px-[8.1rem] py-[5.3rem]">
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
      {/* Step Sections */}
      <section>
        <div className="w-full flex flex-row justify-center items-center gap-[2.3rem]">
          <div className="flex flex-row justify-start items-center gap-[1.3rem]">
            <div
              className={`rounded-full border-[0.2rem] ${
                currentIndex == 0
                  ? "bg-[#78D14D] text-white"
                  : "bg-white text-black"
              } border-[#78D14D] w-[3.6rem] h-[3.6rem] flex flex-col justify-center items-center`}
            >
              <p className="font-semibold text-[0.8rem]">1</p>
            </div>
            <p className="font-semibold text-[0.8rem]">Pengisian Detail</p>
          </div>
          <CaretRight size={26} color="#000000" />
          <div className="flex flex-row justify-start items-center gap-[1.3rem]">
            <div
              className={`rounded-full border-[0.2rem] ${
                currentIndex == 1
                  ? "bg-[#78D14D] text-white"
                  : "bg-white text-black"
              } border-[#78D14D] w-[3.6rem] h-[3.6rem] flex flex-col justify-center items-center`}
            >
              <p className="font-semibold text-[0.8rem]">2</p>
            </div>
            <p className="font-semibold text-[0.8rem]">Pembayaran</p>
          </div>
          <CaretRight size={26} color="#000000" />
          <div className="flex flex-row justify-start items-center gap-[1.3rem]">
            <div
              className={`rounded-full border-[0.2rem] ${
                currentIndex == 2
                  ? "bg-[#78D14D] text-white"
                  : "bg-white text-black"
              } border-[#78D14D] w-[3.6rem] h-[3.6rem] flex flex-col justify-center items-center`}
            >
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
                        className={`py-[1.125rem]  w-full rounded-lg text-[1rem]  font-semibold cursor-pointer ${
                          genderSelected == 1
                            ? "bg-[#78D14D] text-white"
                            : "bg-[#F2F2F2] text-[#4993FA]"
                        }`}
                        type="button"
                        onClick={() => setGender(1)}
                      >
                        Laki-Laki
                      </button>
                      <button
                        className={`py-[1.125rem]  w-full rounded-lg text-[1rem]  font-semibold cursor-pointer ${
                          genderSelected == 2
                            ? "bg-[#78D14D] text-white"
                            : "bg-[#F2F2F2] text-[#FF7C7C]"
                        }`}
                        type="button"
                        onClick={() => setGender(2)}
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
              ) : currentIndex === 1 ? (
                <>
                  <div className="flex flex-col justify-start items-start gap-[0.3rem]">
                    <h1 className="text-[1.5rem] font-semibold">
                      Pilih Metode Pembayaran
                    </h1>
                    <p className="text-[0.8rem] w-[80%]">
                      Pilih metode untuk melakukan pembayaran workshop
                    </p>
                  </div>
                  <button
                    className={`px-[2.3rem] ${
                      paymentSelected == 1
                        ? " bg-[#78D14D] text-white"
                        : "bg-[#F2F2F2] text-black"
                    } w-[80%] h-[6.3rem] rounded-lg text-[1.5rem] font-semibold cursor-pointer flex flex-row justify-between items-center`}
                    type="button"
                    onClick={() => setPayment(1)}
                  >
                    <Image
                      className=" object-cover rounded-lg"
                      width={142}
                      height={54}
                      src="/images/gopay.png"
                      alt="cabai"
                      quality={100}
                      unoptimized
                    ></Image>
                    <p>Rp. 100.000,00</p>
                  </button>
                  <button
                    className={`px-[2.3rem] ${
                      paymentSelected == 2
                        ? " bg-[#78D14D] text-white"
                        : "bg-[#F2F2F2] text-black"
                    } w-[80%] h-[6.3rem] rounded-lg text-[1.5rem] font-semibold cursor-pointer flex flex-row justify-between items-center`}
                    type="button"
                    onClick={() => setPayment(2)}
                  >
                    <Image
                      className=" object-cover rounded-lg"
                      width={122.74}
                      height={35}
                      src="/images/dana.png"
                      alt="cabai"
                      quality={100}
                      unoptimized
                    ></Image>
                    <p>Rp. 100.000,00</p>
                  </button>
                  <button
                    className={`px-[2.3rem] ${
                      paymentSelected == 3
                        ? " bg-[#78D14D] text-white"
                        : "bg-[#F2F2F2] text-black"
                    } w-[80%] h-[6.3rem] rounded-lg text-[1.5rem] font-semibold cursor-pointer flex flex-row justify-between items-center`}
                    type="button"
                    onClick={() => setPayment(3)}
                  >
                    <Image
                      className=" object-cover rounded-lg"
                      width={82}
                      height={26}
                      src="/images/ovo.png"
                      alt="cabai"
                      quality={100}
                      unoptimized
                    ></Image>
                    <p>Rp. 100.000,00</p>
                  </button>
                  <button
                    className={`px-[2.3rem] ${
                      paymentSelected == 4
                        ? " bg-[#78D14D] text-white"
                        : "bg-[#F2F2F2] text-black"
                    } w-[80%] h-[6.3rem] rounded-lg text-[1.5rem] font-semibold cursor-pointer flex flex-row justify-between items-center`}
                    type="button"
                    onClick={() => setPayment(4)}
                  >
                    <Image
                      className=" object-cover rounded-lg"
                      width={109.77}
                      height={41}
                      src="/images/qris.png"
                      alt="cabai"
                      quality={100}
                      unoptimized
                    ></Image>
                    <p>Rp. 100.000,00</p>
                  </button>
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
              ) : (
                <>
                  <div className="flex flex-col justify-start items-start gap-[0.3rem] w-full">
                    <h1 className="text-[1.5rem] font-semibold">
                      Konfirmasi Pendaftaran
                    </h1>
                    <p className="text-[0.8rem] w-[80%]">
                      Konfirmasi pendaftaran untuk workshop ini
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
                      <p>: Menunggu</p>
                    </div>
                  </div>
                  <div className="w-full flex flex-col justify-start items-start gap-[1rem]">
                    <ActionButton
                      textColor="#ffffff"
                      onClickHandler={navigate}
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
                Teknik Tanam Padi Untuk Keberlanjutan Pangan Jawa Tengah
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
