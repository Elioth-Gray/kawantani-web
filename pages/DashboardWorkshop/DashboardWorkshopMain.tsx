"use client";

import React, { useEffect, useState } from "react";
import WorkshopCard from "@/components/cards/WorkshopCard";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { getRegisteredWorkshops, getWorkshopById } from "@/api/workshopApi";
import { getAllProvinces, getAllKabupaten } from "@/api/locationApi";

interface Province {
  id_provinsi: number;
  nama_provinsi: string;
}

interface Regency {
  id_kabupaten: number;
  nama_kabupaten: string;
  type: string;
  id_provinsi: number;
}

interface RegisteredWorkshop {
  id_pendaftaran: number;
  nama_depan_peserta: string;
  nama_belakang_peserta: string;
  email_peserta: string;
  nomor_telepon_peserta: string;
  jenis_kelamin_peserta: number;
  tanggal_pendaftaran: string;
  status_pembayaran: boolean;
  nomor_tiket: string;
  id_pengguna: string;
  id_workshop: string;
  id_metode_pembayaran: number;
}

interface Workshop {
  id_workshop: string;
  judul_workshop: string;
  tanggal_workshop: string;
  gambar_workshop: string;
  alamat_lengkap_workshop: string;
  kabupaten: {
    nama_kabupaten: string;
    provinsi: {
      nama_provinsi: string;
    };
  };
  // Add registration info
  registrationInfo?: RegisteredWorkshop;
}

const DashboardWorkshopMain = () => {
  const pathname = usePathname();
  const router = useRouter();

  // Workshop states
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [filteredWorkshops, setFilteredWorkshops] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Location states
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [regencies, setRegencies] = useState<Regency[]>([]);
  const [filteredRegencies, setFilteredRegencies] = useState<Regency[]>([]);

  // Filter states
  const [selectedProvince, setSelectedProvince] = useState<string>("");
  const [selectedRegency, setSelectedRegency] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // First, get registered workshops
        const registeredResponse = await getRegisteredWorkshops();
        console.log("Registered workshops response:", registeredResponse);

        if (registeredResponse && registeredResponse.data && Array.isArray(registeredResponse.data)) {
          // Extract unique workshop IDs
          const uniqueWorkshopIds = [...new Set(
            registeredResponse.data.map((reg: RegisteredWorkshop) => reg.id_workshop)
          )];

          console.log("Unique workshop IDs:", uniqueWorkshopIds);

          // Fetch detailed workshop information for each registered workshop
          const workshopDetailsPromises = uniqueWorkshopIds.map(async (workshopId: string) => {
            try {
              const workshopDetail = await getWorkshopById(workshopId);
              if (workshopDetail && workshopDetail.data) {
                // Find the registration info for this workshop
                const registrationInfo = registeredResponse.data.find(
                  (reg: RegisteredWorkshop) => reg.id_workshop === workshopId
                );

                return {
                  ...workshopDetail.data,
                  registrationInfo
                };
              }
              return null;
            } catch (error) {
              console.error(`Error fetching workshop ${workshopId}:`, error);
              return null;
            }
          });

          const workshopDetails = await Promise.all(workshopDetailsPromises);
          const validWorkshops = workshopDetails.filter(workshop => workshop !== null);

          console.log("Workshop details:", validWorkshops);

          setWorkshops(validWorkshops);
          setFilteredWorkshops(validWorkshops);
        } else {
          // Handle case where user has no registered workshops
          if (registeredResponse && registeredResponse.message) {
            setError(registeredResponse.message);
          } else {
            setWorkshops([]);
            setFilteredWorkshops([]);
          }
        }

        // Fetch provinces
        const provinceResponse = await getAllProvinces();
        if (provinceResponse.success && provinceResponse.data?.provinces) {
          setProvinces(provinceResponse.data.provinces);
        }

        // Fetch all regencies
        const regencyResponse = await getAllKabupaten();
        if (regencyResponse.success && regencyResponse.data?.regencies) {
          setRegencies(regencyResponse.data.regencies);
          setFilteredRegencies(regencyResponse.data.regencies);
        }
      } catch (err) {
        console.error("Error fetching initial data:", err);
        setError("Terjadi kesalahan saat memuat data");
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Filter regencies based on selected province
  useEffect(() => {
    if (selectedProvince) {
      const filtered = regencies.filter(
        (regency) => regency.id_provinsi === parseInt(selectedProvince)
      );
      setFilteredRegencies(filtered);
      setSelectedRegency(""); // Reset kabupaten selection when province changes
    } else {
      setFilteredRegencies(regencies);
    }
  }, [selectedProvince, regencies]);

  // Apply filters to workshops
  useEffect(() => {
    let filtered = [...workshops];

    // Filter by province
    if (selectedProvince) {
      const selectedProvinceData = provinces.find(
        (p) => p.id_provinsi === parseInt(selectedProvince)
      );
      if (selectedProvinceData) {
        filtered = filtered.filter((workshop) =>
          workshop.kabupaten?.provinsi?.nama_provinsi === selectedProvinceData.nama_provinsi
        );
      }
    }

    // Filter by regency
    if (selectedRegency) {
      const selectedRegencyData = regencies.find(
        (r) => r.id_kabupaten === parseInt(selectedRegency)
      );
      if (selectedRegencyData) {
        filtered = filtered.filter((workshop) =>
          workshop.kabupaten?.nama_kabupaten === selectedRegencyData.nama_kabupaten
        );
      }
    }

    // Filter by date range
    if (startDate || endDate) {
      filtered = filtered.filter((workshop) => {
        const workshopDate = new Date(workshop.tanggal_workshop);
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;

        if (start && end) {
          return workshopDate >= start && workshopDate <= end;
        } else if (start) {
          return workshopDate >= start;
        } else if (end) {
          return workshopDate <= end;
        }
        return true;
      });
    }

    setFilteredWorkshops(filtered);
  }, [workshops, selectedProvince, selectedRegency, startDate, endDate, provinces, regencies]);

  const navigate = (id: string) => {
    router.push(`/workshops/${id}/details`);
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

  const clearFilters = () => {
    setSelectedProvince("");
    setSelectedRegency("");
    setStartDate("");
    setEndDate("");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#78D14D] mx-auto mb-4"></div>
          <p>Memuat data workshop...</p>
        </div>
      </div>
    );
  }

  if (error && workshops.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-[#78D14D] text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <main>
      <section className="w-full h-screen grid grid-cols-12 bg-[#FCF7F1]">
        {/* Filter Section */}
        <section className="w-[22.875rem] py-[1.9rem] col-span-3 flex flex-col justify-start items-start h-full border-r-2 gap-[3rem]">
          <div className="flex justify-between items-center w-full px-[2.313rem]">
            <h1 className="font-bold text-[2.5rem]">Filter</h1>
            <button
              onClick={clearFilters}
              className="text-sm text-[#78D14D] hover:text-green-700 underline"
            >
              Reset
            </button>
          </div>

          {/* Location Filter */}
          <div className="flex flex-col justify-start items-start gap-[0.75rem] w-full">
            <h1 className="px-[2.313rem] text-[1.5rem] font-bold">Lokasi</h1>
            <div className="px-[2.313rem] w-full grid grid-cols-2 gap-[0.8rem]">
              <div className="col-span-1 w-full">
                <select
                  value={selectedProvince}
                  onChange={(e) => setSelectedProvince(e.target.value)}
                  className="py-[0.8rem] bg-[#F2F2F2] w-full rounded-lg px-[0.8rem] border border-black text-sm"
                >
                  <option value="">Semua Provinsi</option>
                  {provinces.map((province) => (
                    <option key={province.id_provinsi} value={province.id_provinsi}>
                      {province.nama_provinsi}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-span-1 w-full">
                <select
                  value={selectedRegency}
                  onChange={(e) => setSelectedRegency(e.target.value)}
                  className="py-[0.8rem] bg-[#F2F2F2] w-full rounded-lg px-[0.8rem] border border-black text-sm"
                  disabled={!selectedProvince}
                >
                  <option value="">
                    {selectedProvince ? "Semua Kabupaten/Kota" : "Pilih Provinsi Dulu"}
                  </option>
                  {filteredRegencies.map((regency) => (
                    <option key={regency.id_kabupaten} value={regency.id_kabupaten}>
                      {regency.type} {regency.nama_kabupaten}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="w-full h-[0.063rem] bg-[#C3C6D4] mt-[1.25rem]"></div>
          </div>

          {/* Date Filter */}
          <div className="flex flex-col justify-start items-start gap-[0.75rem] w-full">
            <h1 className="px-[2.313rem] text-[1.5rem] font-bold">Tanggal</h1>
            <div className="px-[2.313rem] w-full grid grid-cols-1 gap-[0.8rem]">
              <div className="col-span-1 w-full">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="py-[0.8rem] bg-[#F2F2F2] w-full rounded-lg px-[0.8rem] border border-black"
                  placeholder="Tanggal Awal"
                />
              </div>
              <div className="col-span-1 w-full">
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate}
                  className="py-[0.8rem] bg-[#F2F2F2] w-full rounded-lg px-[0.8rem] border border-black"
                  placeholder="Tanggal Akhir"
                />
              </div>
            </div>
            <div className="w-full h-[0.063rem] bg-[#C3C6D4] mt-[1.25rem]"></div>
          </div>

          {/* Filter Summary */}
          <div className="px-[2.313rem] w-full">
            <p className="text-sm text-gray-600">
              Menampilkan {filteredWorkshops.length} dari {workshops.length} workshop
            </p>
          </div>
        </section>

        {/* Workshop List Section */}
        <section className="col-span-9 px-[4.8rem] py-[1.9rem] flex flex-col justify-start items-start gap-[2.3rem] overflow-y-scroll mb-[1.9rem]">
          <div className="flex flex-col justify-start items-start gap-[1rem]">
            <h1 className="text-[2.5rem] font-semibold">Daftar Workshop</h1>
            <div className="flex flex-row justify-start items-center gap-[2rem]">
              <button className="py-[0.9rem] px-[2.6rem] rounded-lg bg-[#78D14D] text-white cursor-pointer text-[1rem]">
                Workshop Diikuti
              </button>
              <Link
                href="/workshops"
                className="py-[0.9rem] rounded-lg text-[#78D14D] cursor-pointer text-[1rem] hover:text-black transition-all ease-in-out duration-200"
              >
                Ikuti Workshop
              </Link>
            </div>
          </div>

          {/* Workshop Grid */}
          <div className="w-full grid grid-cols-2 h-full gap-x-[2.25rem] gap-y-[2.25rem]">
            {filteredWorkshops.length > 0 ? (
              filteredWorkshops.map((workshop) => (
                <div key={workshop.id_workshop} className="relative">
                  <WorkshopCard
                    imageURL={`http://localhost:2000/uploads/workshops/${workshop.gambar_workshop}`}
                    title={workshop.judul_workshop}
                    date={formatDate(workshop.tanggal_workshop)}
                    location={`${workshop.alaamt_lengkap_workshop}, ${workshop.kabupaten.nama_kabupaten}, ${workshop.kabupaten.provinsi.nama_provinsi}`}
                    onClickHandler={() => navigate(workshop.id_workshop)}
                  />
                  {/* Registration Status Badge */}
                  {workshop.registrationInfo && (
                    <div className="absolute top-2 right-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${workshop.registrationInfo.status_pembayaran
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                        }`}>
                        {workshop.registrationInfo.status_pembayaran ? 'Terbayar' : 'Belum Bayar'}
                      </span>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="col-span-2 text-center py-10">
                <p className="text-lg text-gray-500">
                  {workshops.length === 0
                    ? "Anda belum mengikuti workshop apapun"
                    : "Tidak ada workshop yang sesuai dengan filter"
                  }
                </p>
                {workshops.length === 0 && (
                  <Link
                    href="/workshops"
                    className="mt-4 inline-block px-6 py-2 bg-[#78D14D] text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    Jelajahi Workshop
                  </Link>
                )}
                {filteredWorkshops.length === 0 && workshops.length > 0 && (
                  <button
                    onClick={clearFilters}
                    className="mt-2 text-[#78D14D] hover:text-green-700 underline"
                  >
                    Reset semua filter
                  </button>
                )}
              </div>
            )}
          </div>
        </section>
      </section>
    </main>
  );
};

export default DashboardWorkshopMain;