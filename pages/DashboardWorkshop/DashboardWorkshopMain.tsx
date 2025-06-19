'use client';

import React, { useEffect, useState } from 'react';
import WorkshopCard from '@/components/cards/WorkshopCard';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { getRegisteredWorkshops, getWorkshopById } from '@/api/workshopApi';
import { getAllProvinces, getAllKabupaten } from '@/api/locationApi';
import { Check } from '@phosphor-icons/react/dist/ssr';

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
  alaamt_lengkap_workshop: string;
  kabupaten: {
    nama_kabupaten: string;
    provinsi: {
      nama_provinsi: string;
    };
  };
  registrationInfo?: RegisteredWorkshop;
}

const DashboardWorkshopMain = () => {
  const pathname = usePathname();
  const router = useRouter();

  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [filteredWorkshops, setFilteredWorkshops] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [provinces, setProvinces] = useState<Province[]>([]);
  const [regencies, setRegencies] = useState<Regency[]>([]);
  const [filteredRegencies, setFilteredRegencies] = useState<Regency[]>([]);

  const [selectedProvince, setSelectedProvince] = useState<string>('');
  const [selectedRegency, setSelectedRegency] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const registeredResponse = await getRegisteredWorkshops();

        if (
          registeredResponse?.data &&
          Array.isArray(registeredResponse.data)
        ) {
          const uniqueWorkshopIds = [
            ...new Set(
              registeredResponse.data.map(
                (reg: RegisteredWorkshop) => reg.id_workshop,
              ),
            ),
          ];

          const workshopDetailsPromises = uniqueWorkshopIds.map(
            async (workshopId: any) => {
              try {
                const workshopDetail = await getWorkshopById(workshopId);
                if (workshopDetail?.data) {
                  const registrationInfo = registeredResponse.data.find(
                    (reg: RegisteredWorkshop) => reg.id_workshop === workshopId,
                  );
                  return {
                    ...workshopDetail.data,
                    registrationInfo,
                  };
                }
                return null;
              } catch (error) {
                console.error(`Error fetching workshop ${workshopId}:`, error);
                return null;
              }
            },
          );

          const workshopDetails = await Promise.all(workshopDetailsPromises);
          const validWorkshops = workshopDetails.filter(
            (workshop) => workshop !== null,
          );

          setWorkshops(validWorkshops);
          setFilteredWorkshops(validWorkshops);
        } else {
          if (registeredResponse?.message) {
            setError(registeredResponse.message);
          } else {
            setWorkshops([]);
            setFilteredWorkshops([]);
          }
        }

        const provinceResponse = await getAllProvinces();
        if (provinceResponse.success && provinceResponse.data?.provinces) {
          setProvinces(provinceResponse.data.provinces);
        }

        const regencyResponse = await getAllKabupaten();
        if (regencyResponse.success && regencyResponse.data?.regencies) {
          setRegencies(regencyResponse.data.regencies);
          setFilteredRegencies(regencyResponse.data.regencies);
        }
      } catch (err) {
        console.error('Error fetching initial data:', err);
        setError('Terjadi kesalahan saat memuat data');
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    if (selectedProvince) {
      const filtered = regencies.filter(
        (regency) => regency.id_provinsi === parseInt(selectedProvince),
      );
      setFilteredRegencies(filtered);
      setSelectedRegency('');
    } else {
      setFilteredRegencies(regencies);
    }
  }, [selectedProvince, regencies]);

  useEffect(() => {
    let filtered = [...workshops];

    if (selectedProvince) {
      const selectedProvinceData = provinces.find(
        (p) => p.id_provinsi === parseInt(selectedProvince),
      );
      if (selectedProvinceData) {
        filtered = filtered.filter(
          (workshop) =>
            workshop.kabupaten?.provinsi?.nama_provinsi ===
            selectedProvinceData.nama_provinsi,
        );
      }
    }

    if (selectedRegency) {
      const selectedRegencyData = regencies.find(
        (r) => r.id_kabupaten === parseInt(selectedRegency),
      );
      if (selectedRegencyData) {
        filtered = filtered.filter(
          (workshop) =>
            workshop.kabupaten?.nama_kabupaten ===
            selectedRegencyData.nama_kabupaten,
        );
      }
    }

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
  }, [
    workshops,
    selectedProvince,
    selectedRegency,
    startDate,
    endDate,
    provinces,
    regencies,
  ]);

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

  const clearFilters = () => {
    setSelectedProvince('');
    setSelectedRegency('');
    setStartDate('');
    setEndDate('');
  };

  const baseURL =
    process.env.NEXT_PUBLIC_API_BASE_URL_FILE ||
    'http://localhost:2000/uploads';

  if (loading) {
    return (
      <div className='flex justify-center items-center h-screen bg-[#FCF7F1]'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-[#78D14D] mx-auto mb-4'></div>
          <p>Memuat data workshop...</p>
        </div>
      </div>
    );
  }

  if (error && workshops.length === 0) {
    return (
      <div className='flex justify-center items-center h-screen bg-[#FCF7F1]'>
        <div className='text-center'>
          <p className='text-red-500 mb-4'>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className='px-4 py-2 bg-[#78D14D] text-white rounded-lg hover:bg-green-600 transition-colors'
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <main>
      <section className='w-full h-screen grid grid-cols-12 bg-[#FCF7F1]'>
        {/* Filter Section - Updated */}
        <section className='w-[22.875rem] py-[1.9rem] col-span-3 flex flex-col justify-start items-start h-full border-r-2 gap-[3rem]'>
          <div className='flex justify-between items-center w-full px-[2.313rem]'>
            <h1 className='font-bold text-[2.5rem]'>Filter</h1>
            {(selectedProvince || selectedRegency || startDate || endDate) && (
              <button
                onClick={clearFilters}
                className='text-[#78D14D] text-sm underline hover:text-green-600 transition-colors'
              >
                Clear All
              </button>
            )}
          </div>

          {/* Location Filter */}
          <div className='flex flex-col justify-start items-start gap-[0.75rem] w-full'>
            <h1 className='px-[2.313rem] text-[1.5rem] font-bold'>Lokasi</h1>
            <div className='px-[2.313rem] w-full flex flex-col gap-[1.6rem]'>
              <div className='w-full'>
                <select
                  value={selectedProvince}
                  onChange={(e) => setSelectedProvince(e.target.value)}
                  className='py-[0.8rem] bg-[#F2F2F2] w-full rounded-lg px-[0.8rem] border border-gray-300 text-sm'
                >
                  <option value=''>Semua Provinsi</option>
                  {provinces.map((province) => (
                    <option
                      key={province.id_provinsi}
                      value={province.id_provinsi}
                    >
                      {province.nama_provinsi}
                    </option>
                  ))}
                </select>
              </div>
              <div className='w-full'>
                <select
                  value={selectedRegency}
                  onChange={(e) => setSelectedRegency(e.target.value)}
                  className='py-[0.8rem] bg-[#F2F2F2] w-full rounded-lg px-[0.8rem] border border-gray-300 text-sm'
                  disabled={!selectedProvince}
                >
                  <option value=''>
                    {selectedProvince
                      ? 'Semua Kabupaten/Kota'
                      : 'Pilih Provinsi Dulu'}
                  </option>
                  {filteredRegencies.map((regency) => (
                    <option
                      key={regency.id_kabupaten}
                      value={regency.id_kabupaten}
                    >
                      {regency.type} {regency.nama_kabupaten}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className='w-full h-[0.063rem] bg-[#C3C6D4] mt-[1.25rem]'></div>
          </div>

          {/* Date Filter */}
          <div className='flex flex-col justify-start items-start gap-[0.75rem] w-full'>
            <h1 className='px-[2.313rem] text-[1.5rem] font-bold'>Tanggal</h1>
            <div className='px-[2.313rem] w-full flex flex-col gap-[1.6rem]'>
              <div className='w-full'>
                <input
                  type='date'
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className='py-[0.8rem] bg-[#F2F2F2] w-full rounded-lg px-[0.8rem] border border-gray-300 text-sm'
                  placeholder='Tanggal Awal'
                />
              </div>
              <div className='w-full'>
                <input
                  type='date'
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate}
                  className='py-[0.8rem] bg-[#F2F2F2] w-full rounded-lg px-[0.8rem] border border-gray-300 text-sm'
                  placeholder='Tanggal Akhir'
                />
              </div>
            </div>
            <div className='w-full h-[0.063rem] bg-[#C3C6D4] mt-[1.25rem]'></div>
          </div>

          {/* Filter Summary */}
          <div className='px-[2.313rem] w-full'>
            <p className='text-sm text-gray-600'>
              Menampilkan {filteredWorkshops.length} dari {workshops.length}{' '}
              workshop
            </p>
          </div>
        </section>

        {/* Workshop List Section */}
        <section className='col-span-9 px-[4.8rem] py-[1.9rem] flex flex-col justify-start items-start gap-[2.3rem] overflow-y-scroll mb-[1.9rem] w-full'>
          <div className='flex flex-col justify-start items-start gap-[1rem] w-full'>
            <div className='flex justify-between items-center w-full'>
              <h1 className='text-[2.5rem] font-semibold'>Daftar Workshop</h1>
              <div className='text-gray-600'>
                {filteredWorkshops.length} workshop ditemukan
              </div>
            </div>
            <div className='flex flex-row justify-start items-center gap-[2rem]'>
              <button className='py-[0.9rem] px-[2.6rem] rounded-lg bg-[#78D14D] text-white cursor-pointer text-[1rem]'>
                Workshop Diikuti
              </button>
              <Link
                href='/workshops'
                className='py-[0.9rem] rounded-lg text-[#78D14D] cursor-pointer text-[1rem] hover:text-black transition-all ease-in-out duration-200'
              >
                Ikuti Workshop
              </Link>
            </div>
          </div>

          {/* Active filters display */}
          {(selectedProvince || selectedRegency || startDate || endDate) && (
            <div className='flex flex-wrap gap-2'>
              <span className='text-sm text-gray-600'>Active filters:</span>
              {selectedProvince && (
                <span className='px-3 py-1 bg-[#78D14D] text-white text-sm rounded-full flex items-center gap-2'>
                  {
                    provinces.find(
                      (p) => p.id_provinsi === parseInt(selectedProvince),
                    )?.nama_provinsi
                  }
                  <button
                    onClick={() => setSelectedProvince('')}
                    className='hover:bg-green-600 rounded-full w-4 h-4 flex items-center justify-center text-xs'
                  >
                    ×
                  </button>
                </span>
              )}
              {selectedRegency && (
                <span className='px-3 py-1 bg-[#78D14D] text-white text-sm rounded-full flex items-center gap-2'>
                  {
                    regencies.find(
                      (r) => r.id_kabupaten === parseInt(selectedRegency),
                    )?.nama_kabupaten
                  }
                  <button
                    onClick={() => setSelectedRegency('')}
                    className='hover:bg-green-600 rounded-full w-4 h-4 flex items-center justify-center text-xs'
                  >
                    ×
                  </button>
                </span>
              )}
              {startDate && (
                <span className='px-3 py-1 bg-[#78D14D] text-white text-sm rounded-full flex items-center gap-2'>
                  Mulai: {new Date(startDate).toLocaleDateString('id-ID')}
                  <button
                    onClick={() => setStartDate('')}
                    className='hover:bg-green-600 rounded-full w-4 h-4 flex items-center justify-center text-xs'
                  >
                    ×
                  </button>
                </span>
              )}
              {endDate && (
                <span className='px-3 py-1 bg-[#78D14D] text-white text-sm rounded-full flex items-center gap-2'>
                  Selesai: {new Date(endDate).toLocaleDateString('id-ID')}
                  <button
                    onClick={() => setEndDate('')}
                    className='hover:bg-green-600 rounded-full w-4 h-4 flex items-center justify-center text-xs'
                  >
                    ×
                  </button>
                </span>
              )}
            </div>
          )}

          <div className='w-full grid grid-cols-2 h-full gap-x-[2.25rem] gap-y-[2.25rem]'>
            {filteredWorkshops.length > 0 ? (
              filteredWorkshops.map((workshop) => (
                <div key={workshop.id_workshop} className='relative'>
                  <WorkshopCard
                    imageURL={`${baseURL}/workshops/${workshop.gambar_workshop}`}
                    title={workshop.judul_workshop}
                    date={formatDate(workshop.tanggal_workshop)}
                    location={`${workshop.alaamt_lengkap_workshop}, ${workshop.kabupaten.nama_kabupaten}, ${workshop.kabupaten.provinsi.nama_provinsi}`}
                    onClickHandler={() => navigate(workshop.id_workshop)}
                  />
                  {workshop.registrationInfo && (
                    <div className='absolute top-2 right-2'>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          workshop.registrationInfo.status_pembayaran
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {workshop.registrationInfo.status_pembayaran
                          ? 'Terbayar'
                          : 'Belum Bayar'}
                      </span>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className='col-span-2 text-center py-10'>
                <p className='text-lg text-gray-500'>
                  {workshops.length === 0
                    ? 'Anda belum mengikuti workshop apapun'
                    : 'Tidak ada workshop yang sesuai dengan filter'}
                </p>
                {workshops.length === 0 && (
                  <Link
                    href='/workshops'
                    className='mt-4 inline-block px-6 py-2 bg-[#78D14D] text-white rounded-lg hover:bg-green-600 transition-colors'
                  >
                    Jelajahi Workshop
                  </Link>
                )}
                {filteredWorkshops.length === 0 && workshops.length > 0 && (
                  <button
                    onClick={clearFilters}
                    className='mt-4 px-4 py-2 bg-[#78D14D] text-white rounded-lg hover:bg-green-600 transition-colors'
                  >
                    Reset Pencarian
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
