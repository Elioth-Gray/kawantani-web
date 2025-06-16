'use client';

import React, { useEffect, useState } from 'react';
import WorkshopCard from '@/components/cards/WorkshopCard';
import { useRouter, usePathname } from 'next/navigation';
import InputField from '@/components/form/InputField';
import { MagnifyingGlass, Check } from '@phosphor-icons/react/dist/ssr';
import { getVerifiedWorkshops } from '@/api/workshopApi';
import { getAllProvinces, getAllKabupaten } from '@/api/locationApi';

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
}

const WorkshopMain = () => {
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
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const workshopResponse = await getVerifiedWorkshops();
        if (workshopResponse.data) {
          setWorkshops(workshopResponse.data);
          setFilteredWorkshops(workshopResponse.data);
        } else {
          setError(workshopResponse.message || 'Gagal memuat data workshop');
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

    if (searchTerm.trim()) {
      filtered = filtered.filter((workshop) =>
        workshop.judul_workshop
          .toLowerCase()
          .includes(searchTerm.toLowerCase()),
      );
    }

    if (selectedProvince) {
      const selectedProvinceData = provinces.find(
        (p) => p.id_provinsi === parseInt(selectedProvince),
      );
      if (selectedProvinceData) {
        filtered = filtered.filter(
          (workshop) =>
            workshop.kabupaten.provinsi.nama_provinsi ===
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
            workshop.kabupaten.nama_kabupaten ===
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
    searchTerm,
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
    setSearchTerm('');
  };

  if (loading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <p>Memuat data workshop...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <p className='text-red-500'>{error}</p>
      </div>
    );
  }

  return (
    <main>
      <section className='w-full h-screen grid grid-cols-12'>
        {/* Filter Section - Updated to match Plant style */}
        <section className='w-[22.875rem] py-[1.9rem] col-span-3 flex flex-col justify-start items-start h-full border-r-2 gap-[3rem]'>
          <div className='flex justify-between items-center w-full px-[2.313rem]'>
            <h1 className='font-bold text-[2.5rem]'>Filter</h1>
            {(selectedProvince ||
              selectedRegency ||
              startDate ||
              endDate ||
              searchTerm) && (
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
        <section className='col-span-9 px-[4.8rem] py-[1.9rem] flex flex-col justify-start items-start gap-[2.3rem] overflow-y-scroll mb-[1.9rem]'>
          <div className='flex justify-between items-center w-full'>
            <h1 className='text-[2.5rem] font-semibold'>Daftar Workshop</h1>
            <div className='text-gray-600'>
              {filteredWorkshops.length} workshop ditemukan
            </div>
          </div>

          <div className='w-[40%]'>
            <InputField
              placeholder='Cari Workshop.....'
              type='text'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            >
              <MagnifyingGlass
                size={24}
                color='#6B7280'
                weight='bold'
                className='absolute left-4 top-1/2 transform -translate-y-1/2'
              />
            </InputField>
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
                <WorkshopCard
                  key={workshop.id_workshop}
                  imageURL={`http://localhost:2000/uploads/workshops/${workshop.gambar_workshop}`}
                  title={workshop.judul_workshop}
                  date={formatDate(workshop.tanggal_workshop)}
                  location={`${workshop.alaamt_lengkap_workshop}, ${workshop.kabupaten.nama_kabupaten}, ${workshop.kabupaten.provinsi.nama_provinsi}`}
                  onClickHandler={() => navigate(workshop.id_workshop)}
                />
              ))
            ) : (
              <div className='col-span-2 text-center py-10'>
                <p className='text-lg text-gray-500'>
                  {workshops.length === 0
                    ? 'Tidak ada workshop tersedia'
                    : 'Tidak ada workshop yang sesuai dengan filter'}
                </p>
                {(searchTerm ||
                  selectedProvince ||
                  selectedRegency ||
                  startDate ||
                  endDate) && (
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

export default WorkshopMain;
