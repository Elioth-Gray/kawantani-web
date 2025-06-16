'use client';

import React, { useState, useEffect, useMemo } from 'react';
import PlantCard from '@/components/cards/PlantCard';
import Link from 'next/link';
import { Check, MagnifyingGlass } from '@phosphor-icons/react/dist/ssr';
import InputField from '@/components/form/InputField';
import { useRouter } from 'next/navigation';
import { getAllCategories, getUserPlants } from '@/api/plantApi';
import { TCategory, TUserPlant } from '@/types/plantTypes';

const DashboardPlantsMain = () => {
  const [selectedFilters, setSelectedFilters] = useState<number[]>([]);
  const [categories, setCategories] = useState<TCategory[]>([]);
  const [userPlants, setUserPlants] = useState<TUserPlant[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCompletedPlants, setIsCompletedPlants] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const categoriesResponse = await getAllCategories();
        if (categoriesResponse) {
          setCategories(categoriesResponse.data.categories);
        }

        const userPlantsResponse = await getUserPlants();
        setUserPlants(userPlantsResponse.data);
      } catch (err) {
        setError('Failed to fetch data');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredPlants = useMemo(() => {
    let filtered = userPlants;

    if (isCompletedPlants) {
      filtered = filtered.filter(
        (plant) => plant.status_penanaman === 'SELESAI',
      );
    } else {
      filtered = filtered.filter(
        (plant) => plant.status_penanaman !== 'SELESAI',
      );
    }

    if (selectedFilters.length > 0) {
      filtered = filtered.filter(
        (plant) =>
          plant.tanaman &&
          selectedFilters.includes(plant.tanaman.id_kategori_tanaman),
      );
    }

    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (plant) =>
          plant.nama_custom.toLowerCase().includes(searchQuery.toLowerCase()) ||
          plant.tanaman?.nama_tanaman
            .toLowerCase()
            .includes(searchQuery.toLowerCase()),
      );
    }

    return filtered;
  }, [userPlants, isCompletedPlants, selectedFilters, searchQuery]);

  const navigateToPlantDetail = (plantId: string) => {
    router.push(`/dashboard/plants/${plantId}/details`);
  };

  const toggleFilter = (filterId: number) => {
    setSelectedFilters((prevFilters) =>
      prevFilters.includes(filterId)
        ? prevFilters.filter((id) => id !== filterId)
        : [...prevFilters, filterId],
    );
  };

  const clearFilters = () => {
    setSelectedFilters([]);
    setSearchQuery('');
  };

  const showCompletedPlants = () => {
    setIsCompletedPlants(true);
  };

  const showUncompletedPlants = () => {
    setIsCompletedPlants(false);
  };

  function limitWords(teks: any): string {
    const kata = teks.split(' ');
    return kata.length > 10 ? kata.slice(0, 10).join(' ') + '...' : teks;
  }

  if (loading) {
    return (
      <main className='w-full h-screen flex items-center justify-center bg-[#FCF7F1]'>
        <div className='text-xl'>Loading...</div>
      </main>
    );
  }

  if (error) {
    return (
      <main className='w-full h-screen flex items-center justify-center bg-[#FCF7F1]'>
        <div className='text-xl text-red-500'>{error}</div>
      </main>
    );
  }

  return (
    <main>
      <section className='w-full h-screen grid grid-cols-12 bg-[#FCF7F1]'>
        {/* Filter Section - Updated */}
        <section className='w-[22.875rem] py-[1.9rem] col-span-3 flex flex-col justify-start items-start h-full border-r-2 gap-[3rem]'>
          <div className='flex justify-between items-center w-full px-[2.313rem]'>
            <h1 className='font-bold text-[2.5rem]'>Filter</h1>
            {(selectedFilters.length > 0 || searchQuery !== '') && (
              <button
                onClick={clearFilters}
                className='text-[#78D14D] text-sm underline hover:text-green-600 transition-colors'
              >
                Clear All
              </button>
            )}
          </div>

          <div className='flex flex-col justify-start items-start gap-[0.75rem] w-full'>
            <h1 className='px-[2.313rem] text-[1.5rem] font-bold'>
              Kategori Tanaman
            </h1>
            <div className='px-[2.313rem] flex flex-col justify-start items-start gap-[1.6rem]'>
              {categories.map((category) => (
                <div
                  key={category.id_kategori_tanaman}
                  className='flex flex-row justify-center items-center gap-[0.9rem]'
                >
                  <div
                    className={`w-[1.8rem] h-[1.8rem] border-[#78D14D] border-[0.1rem] rounded-md cursor-pointer flex flex-col justify-center items-center ${
                      selectedFilters.includes(category.id_kategori_tanaman)
                        ? 'bg-[#78D14D]'
                        : 'bg-white'
                    }`}
                    onClick={() => toggleFilter(category.id_kategori_tanaman)}
                  >
                    {selectedFilters.includes(category.id_kategori_tanaman) && (
                      <Check size={18} color='#ffffff' weight='bold' />
                    )}
                  </div>
                  <p className='font-bold text-[0.875rem]'>
                    {category.nama_kategori_tanaman}
                  </p>
                </div>
              ))}
            </div>
            <div className='w-full h-[0.063rem] bg-[#C3C6D4] mt-[1.25rem]'></div>
          </div>
        </section>

        <section className='col-span-9 px-[4.8rem] py-[1.9rem] flex flex-col justify-start items-start gap-[2.3rem] overflow-y-scroll mb-[1.9rem]'>
          <div className='flex flex-col justify-start items-start gap-[1rem] w-full'>
            <div className='flex justify-between items-center w-full'>
              <h1 className='text-[2.5rem] font-semibold'>Daftar Tanaman</h1>
              <div className='text-gray-600'>
                {filteredPlants.length} tanaman ditemukan
              </div>
            </div>
            <div className='flex flex-row justify-start items-center gap-[2rem]'>
              <button
                onClick={showUncompletedPlants}
                className={`py-[0.9rem] px-[2.6rem] rounded-lg ${
                  !isCompletedPlants
                    ? 'bg-[#78D14D] text-white'
                    : 'bg-none text-[#78D14D]'
                } cursor-pointer text-[1rem]`}
              >
                Tanaman Dalam Proses
              </button>
              <button
                onClick={showCompletedPlants}
                className={`py-[0.9rem] px-[2.6rem] rounded-lg ${
                  isCompletedPlants
                    ? 'bg-[#78D14D] text-white'
                    : 'bg-none text-[#78D14D]'
                } cursor-pointer text-[1rem]`}
              >
                Tanaman Selesai Proses
              </button>
              <Link
                href='/plants'
                className='py-[0.9rem] rounded-lg text-[#78D14D] cursor-pointer text-[1rem] hover:text-black transition-all ease-in-out duration-200'
              >
                Tambah Tanaman
              </Link>
            </div>
          </div>

          <div className='w-[40%]'>
            <InputField
              placeholder='Cari Tanaman.....'
              type='text'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
          {selectedFilters.length > 0 && (
            <div className='flex flex-wrap gap-2'>
              <span className='text-sm text-gray-600'>Active filters:</span>
              {selectedFilters.map((filterId) => {
                const category = categories.find(
                  (cat) => cat.id_kategori_tanaman === filterId,
                );
                return (
                  <span
                    key={filterId}
                    className='px-3 py-1 bg-[#78D14D] text-white text-sm rounded-full flex items-center gap-2'
                  >
                    {category?.nama_kategori_tanaman}
                    <button
                      onClick={() => toggleFilter(filterId)}
                      className='hover:bg-green-600 rounded-full w-4 h-4 flex items-center justify-center text-xs'
                    >
                      ×
                    </button>
                  </span>
                );
              })}
            </div>
          )}

          <div className='w-full grid grid-cols-3 h-full gap-x-[2.25rem] gap-y-[16.25rem]'>
            {filteredPlants.length > 0 ? (
              filteredPlants.map((plant) => (
                <PlantCard
                  key={plant.id_tanaman_pengguna}
                  imageURL={`http://localhost:2000/uploads/plants/${plant.tanaman?.gambar_tanaman}`}
                  title={plant.nama_custom}
                  description={
                    limitWords(plant.tanaman?.deskripsi_tanaman) ||
                    'Tidak ada deskripsi tersedia'
                  }
                  onClickHandler={() =>
                    navigateToPlantDetail(plant.id_tanaman_pengguna)
                  }
                />
              ))
            ) : (
              <div className='col-span-3 text-center py-8'>
                <p className='text-gray-500 text-lg'>
                  {isCompletedPlants
                    ? 'Belum ada tanaman yang selesai'
                    : 'Belum ada tanaman dalam proses'}
                </p>
                {(selectedFilters.length > 0 || searchQuery !== '') && (
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

export default DashboardPlantsMain;
