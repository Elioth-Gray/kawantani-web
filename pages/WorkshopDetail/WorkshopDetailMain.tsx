"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  Calendar,
  Timer,
  MapPin,
  ArrowLeft,
} from "@phosphor-icons/react/dist/ssr";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import { useRouter, usePathname, useParams } from "next/navigation";
import { getWorkshopById } from "@/api/workshopApi";

const WorkshopDetailMain = () => {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const [workshop, setWorkshop] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  const regist = () => {
    router.push(`${pathname}/registration`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Memuat detail workshop...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!workshop) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Workshop tidak ditemukan</p>
      </div>
    );
  }

  return (
    <main className="px-[8.1rem] py-[5.3rem]">
      <section className="w-full">
        <div
          className="w-full flex flex-row justify-start items-center gap-[1rem] mb-[2.3rem] cursor-pointer"
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
      {/* Card Section */}
      <section>
        <div className="w-full h-full grid grid-cols-2 gap-x-[2.8rem]">
          <div className="w-full h-[19.8rem] object-cover overflow-hidden rounded-lg col-span-1">
            <Image
              className="object-cover w-full h-full"
              width={545}
              height={307}
              src={`http://localhost:2000/uploads/workshops/${workshop.gambar_workshop}`}
              alt={workshop.judul_workshop}
              quality={100}
              unoptimized
            />
          </div>
          <div className="flex flex-col justify-between items-start">
            <h1 className="text-[1.5rem] font-semibold w-[70%]">
              {workshop.judul_workshop}
            </h1>
            <div className="flex flex-col justify-start items-start gap-[0.9rem]">
              <div className="flex flex-row justify-start items-center gap-[0.75rem]">
                <Calendar size={26} color="#000000" />
                <p className="text-[0.75rem]">
                  {formatDate(workshop.tanggal_workshop)}
                </p>
              </div>
              <div className="flex flex-row justify-start items-center gap-[0.75rem]">
                <MapPin size={26} color="#000000" />
                <p className="text-[0.75rem]">
                  {workshop.alaamt_lengkap_workshop}, {workshop.kabupaten.nama_kabupaten}, {workshop.kabupaten.provinsi.nama_provinsi}
                </p>
              </div>
              <div className="flex flex-row justify-start items-center gap-[0.75rem]">
                <Timer size={26} color="#000000" />
                <p className="text-[0.75rem]">
                  {formatTime(workshop.waktu_mulai)} - {formatTime(workshop.waktu_berakhir)}
                </p>
              </div>
            </div>
            <PrimaryButton textColor="#ffffff" onClickHandler={regist}>
              Daftar Workshop
            </PrimaryButton>
          </div>
        </div>
      </section>
      {/* Description Section */}
      <section className="grid grid-cols-2 justify-between items-start gap-3 mt-[2.8rem]">
        <div className="flex flex-col justify-start items-start gap-[1.3rem] col-span-1 w-full h-full">
          <h1 className="text-[2rem] font-bold">Deskripsi</h1>
          <p className="text-[1.1rem]">
            {workshop.deskripsi_workshop}
          </p>
        </div>
        <div className="flex flex-col justify-start items-start gap-[1.3rem] col-span-1 w-full h-full">
          <h1 className="text-[2rem] font-bold">Lokasi</h1>
          <div className="w-full h-full">
            <iframe
              src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d0!2d${workshop.long_lokasi}!3d${workshop.lat_lokasi}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDQxJzQ1LjkiTiA2NcKwMDcnMzkuNiJF!5e0!3m2!1sen!2sid!4v1620000000000!5m2!1sen!2sid`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Google Maps"
              aria-label="Location map"
              className="w-full h-full"
            />
          </div>
        </div>
      </section>
    </main>
  );
};

export default WorkshopDetailMain;