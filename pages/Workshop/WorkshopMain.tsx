"use client";

import React, { useEffect, useState } from "react";
import WorkshopCard from "@/components/cards/WorkshopCard";
import { useRouter, usePathname } from "next/navigation";
import InputField from "@/components/form/InputField";
import { MagnifyingGlass } from "@phosphor-icons/react/dist/ssr";
import { getVerifiedWorkshops } from "@/api/workshopApi";

const WorkshopMain = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [workshops, setWorkshops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchWorkshops = async () => {
      try {
        const response = await getVerifiedWorkshops();
        if (response.data) {
          setWorkshops(response.data);
        } else {
          setError(response.message || "Gagal memuat data workshop");
        }
      } catch (err) {
        setError("Terjadi kesalahan saat memuat data");
      } finally {
        setLoading(false);
      }
    };

    fetchWorkshops();
  }, []);

  const navigate = (id: string) => {
    router.push(`${pathname}/${id}/details`);
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Memuat data workshop...</p>
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

  return (
    <main>
      <section className="w-full h-screen grid grid-cols-12">
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
          <h1 className="text-[2.5rem] font-semibold">Daftar Workshop</h1>
          <div className="w-[40%]">
            <InputField placeholder="Cari Workshop....." type="text">
              <MagnifyingGlass
                size={24}
                color="#fffff"
                weight="bold"
                className="absolute left-[1.5rem]"
              ></MagnifyingGlass>
            </InputField>
          </div>
          <div className="w-full grid grid-cols-2 h-full gap-x-[2.25rem] gap-y-[2.25rem]">
            {workshops.length > 0 ? (
              workshops.map((workshop) => (
                <WorkshopCard
                  key={workshop.id_workshop}
                  imageURL={`http://localhost:2000/uploads/workshops/${workshop.gambar_workshop}`}
                  title={workshop.judul_workshop}
                  date={formatDate(workshop.tanggal_workshop)}
                  location={`${workshop.alaamt_lengkap_workshop}, ${workshop.kabupaten.nama_kabupaten}, ${workshop.kabupaten.provinsi.nama_provinsi}`}
                  // price={workshop.harga_workshop}
                  onClickHandler={() => navigate(workshop.id_workshop)}
                />
              ))
            ) : (
              <p className="col-span-2 text-center py-10">
                Tidak ada workshop tersedia
              </p>
            )}
          </div>
        </section>
      </section>
    </main>
  );
};

export default WorkshopMain;