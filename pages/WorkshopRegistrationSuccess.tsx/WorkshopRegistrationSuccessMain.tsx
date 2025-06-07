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
import { useState, useEffect } from "react";
import ActionButton from "@/components/buttons/ActionButton";
import SecondaryButton from "@/components/buttons/SecondaryButton";
import { useRouter } from "next/navigation";
import { getWorkshopById } from "@/api/workshopApi";

const WorkshopRegistrationSuccessMain = () => {
  const router = useRouter();
  const [workshop, setWorkshop] = useState<any>(null);
  const [ticketData, setTicketData] = useState<any>(null);

  useEffect(() => {
    const fetchWorkshop = async () => {
      try {
        const response = await getWorkshopById(params.id as string);
        if (response.data) {
          setWorkshop(response.data);
        } else {
          setError(response.message || "Gagal memuat detail workshop");
        }
      } catch (err) {
        setError("Terjadi kesalahan saat memuat data");
      } finally {
        setLoading(false);
      }
    };

    fetchWorkshop();
  }, [params.id]);

  useEffect(() => {
    // Get the registration data from localStorage
    const storedTicketData = localStorage.getItem('workshopTicket');
    if (storedTicketData) {
      setTicketData(JSON.parse(storedTicketData));
    }
  }, []);

  const navigate = () => {
    // Clear the stored data when navigating away
    localStorage.removeItem('workshopTicket');
    router.push("/dashboard");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    };
    return date.toLocaleDateString('id-ID', options);
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'WIB' : 'WIB';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const getPaymentMethodName = (methodId: number) => {
    switch (methodId) {
      case 1: return 'Gopay';
      case 2: return 'DANA';
      case 3: return 'OVO';
      case 4: return 'QRIS';
      default: return 'Unknown';
    }
  };

  const getGenderName = (genderId: number) => {
    return genderId === 1 ? 'Laki-Laki' : 'Perempuan';
  };

  // Show loading or fallback if no data
  if (!ticketData) {
    return (
      <main className="px-[8.1rem] py-[5.3rem]">
        <div className="w-full flex justify-center items-center h-[50vh]">
          <p>Memuat data tiket...</p>
        </div>
      </main>
    );
  }

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
                <p>Nomor Tiket</p>
                <p>: {ticketData.ticketNumber}</p>
              </div>
              <div className="flex flex-row justify-between items-center w-full">
                <p>Nama Peserta</p>
                <p>: {ticketData.firstName} {ticketData.lastName}</p>
              </div>
              <div className="flex flex-row justify-between items-center w-full">
                <p>Email</p>
                <p>: {ticketData.email}</p>
              </div>
              <div className="flex flex-row justify-between items-center w-full">
                <p>Nomor Telepon</p>
                <p>: {ticketData.phoneNumber}</p>
              </div>
              <div className="flex flex-row justify-between items-center w-full">
                <p>Jenis Kelamin</p>
                <p>: {getGenderName(ticketData.gender)}</p>
              </div>
            </div>
            <div className="flex flex-col justify-start items-start gap-[0.3rem] w-[60%]">
              <h1 className="text-[1.25rem] font-semibold">
                Informasi Pembayaran:
              </h1>
              <div className="flex flex-row justify-between items-center w-full">
                <p>Metode Pembayaran</p>
                <p>: {getPaymentMethodName(ticketData.paymentMethod)}</p>
              </div>
              <div className="flex flex-row justify-between items-center w-full">
                <p>Total Harga</p>
                <p>: Rp. {ticketData.workshopPrice}</p>
              </div>
              <div className="flex flex-row justify-between items-center w-full">
                <p>Status Pembayaran</p>
                <p>: {ticketData.paymentStatus}</p>
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
                src={`http://localhost:2000/uploads/workshops/${workshop.gambar_workshop}`}
                alt="gambar-workshop"
                quality={100}
                unoptimized
              ></Image>
              <h1 className="text-[1.5rem] font-semibold w-[70%]">
                {workshop.judul_workshop}
              </h1>
              <div className="flex flex-col justify-start items-start gap-[0.9rem]">
                <div className="flex flex-row justify-start items-center gap-[0.75rem]">
                  <Calendar size={26} color="#000000" />
                  <p className="text-[0.75rem]">{formatDate(workshop.tanggal_workshop)}</p>
                </div>
                <div className="flex flex-row justify-start items-center gap-[0.75rem]">
                  <MapPin size={26} color="#000000" />
                  <p className="text-[0.75rem]">{workshop.alaamt_lengkap_workshop}, {workshop.kabupaten.nama_kabupaten}, {workshop.kabupaten.provinsi.nama_provinsi}</p>
                </div>
                <div className="flex flex-row justify-start items-center gap-[0.75rem]">
                  <Timer size={26} color="#000000" />
                  <p className="text-[0.75rem]">{formatTime(workshop.waktu_mulai)} - {formatTime(workshop.waktu_berakhir)}</p>
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
