'use client';

import React, { useState, useEffect, useMemo } from 'react';
import PlantCard from '@/components/cards/PlantCard';
import { Check, MagnifyingGlass } from '@phosphor-icons/react/dist/ssr';
import InputField from '@/components/form/InputField';
import { useRouter } from 'next/navigation';
import { getAllPlants, getAllCategories } from '@/api/plantApi';
import { TPlant, TCategory } from '@/types/plantTypes';

const PlantMain = () => {
  const [selectedFilters, setSelectedFilters] = useState<number[]>([]);
  const [plants, setPlants] = useState<TPlant[]>([]);
  const [categories, setCategories] = useState<TCategory[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  // Fetch plants and categories on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch all plants
        const plantsResponse = await getAllPlants();

        if (plantsResponse && plantsResponse.data.categories) {
          setPlants(plantsResponse.data.categories);
        }

        // Fetch categories for filter
        const categoriesResponse = await getAllCategories();
        if (categoriesResponse) {
          setCategories(categoriesResponse.data.categories);
        }
      } catch (err) {
        setError('Failed to fetch plants data');
        console.error('Error fetching plants:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter and search logic
  const filteredPlants = useMemo(() => {
    let filtered = plants;

    // Filter by category
    if (selectedFilters.length > 0) {
      filtered = filtered.filter((plant) =>
        selectedFilters.includes(plant.id_kategori_tanaman),
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (plant) =>
          plant.nama_tanaman
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          plant.deskripsi_tanaman
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()),
      );
    }

    return filtered;
  }, [plants, selectedFilters, searchQuery]);

  const navigateToPlantDetail = (plantId: string) => {
    router.push(`/plants/${plantId}/details`);
  };

  // Toggle function to add/remove filters
  const toggleFilter = (filterId: number) => {
    setSelectedFilters((prevFilters) => {
      if (prevFilters.includes(filterId)) {
        return prevFilters.filter((id) => id !== filterId);
      } else {
        return [...prevFilters, filterId];
      }
    });
  };

  function limitWords(teks: any): string {
    const kata = teks.split(' ');
    return kata.length > 10 ? kata.slice(0, 10).join(' ') + '...' : teks;
  }

  if (loading) {
    return (
      <main className='w-full h-screen flex items-center justify-center'>
        <div className='text-xl'>Loading plants...</div>
      </main>
    );
  }

  if (error) {
    return (
      <main className='w-full h-screen flex items-center justify-center'>
        <div className='text-xl text-red-500'>{error}</div>
      </main>
    );
  }
  const baseURL =
    process.env.NEXT_PUBLIC_API_BASE_URL_FILE ||
    'http://localhost:2000/uploads';

  return (
    <main>
      <section className='w-full h-screen grid grid-cols-12'>
        {/* Filter Section */}
        <section className='w-[22.875rem] py-[1.9rem] col-span-3 flex flex-col justify-start items-start h-full border-r-2 gap-[3rem]'>
          <h1 className='px-[2.313rem] font-bold text-[2.5rem]'>Filter</h1>
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
                    {selectedFilters.includes(category.id_kategori_tanaman) ? (
                      <Check size={18} color='#ffffff' weight='bold' />
                    ) : null}
                  </div>
                  <p className='font-bold text-[0.875rem]'>
                    {category.nama_kategori_tanaman}
                  </p>
                </div>
              ))}

              {/* Clear filters button */}
              {selectedFilters.length > 0 && (
                <button
                  onClick={() => setSelectedFilters([])}
                  className='text-[#78D14D] text-sm underline hover:text-green-600 transition-colors'
                >
                  Clear All Filters
                </button>
              )}
            </div>
            <div className='w-full h-[0.063rem] bg-[#C3C6D4] mt-[1.25rem]'></div>
          </div>
        </section>

        <section className='col-span-9 px-[4.8rem] py-[1.9rem] flex flex-col justify-start items-start gap-[2.3rem] overflow-y-scroll mb-[1.9rem]'>
          <div className='flex justify-between items-center w-full'>
            <h1 className='text-[2.5rem] font-semibold'>Katalog Tanaman</h1>
            <div className='text-gray-600'>
              {filteredPlants.length} tanaman ditemukan
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
                color='#fffffff'
                weight='bold'
                className='absolute left-[1.5rem]'
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
                  key={plant.id_tanaman}
                  imageURL={`${baseURL}/plants/${plant.gambar_tanaman}`}
                  title={plant.nama_tanaman}
                  description={
                    limitWords(plant.deskripsi_tanaman) ||
                    'Tidak ada deskripsi tersedia'
                  }
                  onClickHandler={() => navigateToPlantDetail(plant.id_tanaman)}
                />
              ))
            ) : (
              <div className='col-span-3 text-center py-12'>
                <div className='text-gray-500'>
                  <h3 className='text-xl font-semibold mb-2'>
                    Tidak ada tanaman ditemukan
                  </h3>
                  <p className='text-gray-400'>
                    {searchQuery
                      ? `Tidak ada tanaman yang cocok dengan pencarian "${searchQuery}"`
                      : 'Coba ubah filter pencarian Anda'}
                  </p>
                  {(searchQuery || selectedFilters.length > 0) && (
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedFilters([]);
                      }}
                      className='mt-4 px-4 py-2 bg-[#78D14D] text-white rounded-lg hover:bg-green-600 transition-colors'
                    >
                      Reset Pencarian
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>
      </section>
    </main>
  );
};

export default PlantMain;
