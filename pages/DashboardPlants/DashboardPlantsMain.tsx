"use client";

import React, { useState, useEffect, useMemo } from "react";
import PlantCard from "@/components/cards/PlantCard";
import Link from "next/link";
import { Check, MagnifyingGlass } from "@phosphor-icons/react/dist/ssr";
import InputField from "@/components/form/InputField";
import { useRouter } from "next/navigation";
import { getAllCategories, getUserPlants } from "@/api/plantApi";
import { TCategory, TUserPlant } from "@/types/plantTypes";

const DashboardPlantsMain = () => {
  const [selectedFilters, setSelectedFilters] = useState<number[]>([]);
  const [categories, setCategories] = useState<TCategory[]>([]);
  const [userPlants, setUserPlants] = useState<TUserPlant[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCompletedPlants, setIsCompletedPlants] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  // Fetch categories and user plants on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch categories for filter
        const categoriesResponse = await getAllCategories();
        if (categoriesResponse.success) {
          setCategories(categoriesResponse.data.categories);
        }

        // Fetch user plants
        const userPlantsResponse = await getUserPlants();
        setUserPlants(userPlantsResponse.data);

      } catch (err) {
        setError("Failed to fetch data");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter and search logic
  const filteredPlants = useMemo(() => {
    let filtered = userPlants;

    // Filter by completion status
    if (isCompletedPlants) {
      filtered = filtered.filter(plant => plant.status_penanaman === "SELESAI");
    } else {
      filtered = filtered.filter(plant => plant.status_penanaman !== "SELESAI");
    }

    // Filter by category
    if (selectedFilters.length > 0) {
      filtered = filtered.filter(plant =>
        plant.tanaman && selectedFilters.includes(plant.tanaman.id_kategori_tanaman)
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(plant =>
        plant.nama_custom.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (plant.tanaman?.nama_tanaman.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    return filtered;
  }, [userPlants, isCompletedPlants, selectedFilters, searchQuery]);

  const navigateToPlantDetail = (plantId: string) => {
    router.push(`/dashboard/plants/${plantId}/details`);
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

  const showCompletedPlants = () => {
    setIsCompletedPlants(true);
  };

  const showUncompletedPlants = () => {
    setIsCompletedPlants(false);
  };

  if (loading) {
    return (
      <main className="w-full h-screen flex items-center justify-center bg-[#FCF7F1]">
        <div className="text-xl">Loading...</div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="w-full h-screen flex items-center justify-center bg-[#FCF7F1]">
        <div className="text-xl text-red-500">{error}</div>
      </main>
    );
  }

  return (
    <main>
      <section className="w-full h-screen grid grid-cols-12 bg-[#FCF7F1]">
        {/* Filter Section */}
        <section className="w-[22.875rem] py-[1.9rem] col-span-3 flex flex-col justify-start items-start h-full border-r-2 gap-[3rem]">
          <h1 className="px-[2.313rem] font-bold text-[2.5rem]">Filter</h1>
          <div className="flex flex-col justify-start items-start gap-[0.75rem] w-full">
            <h1 className="px-[2.313rem] text-[1.5rem] font-bold">
              Kategori Tanaman
            </h1>
            <div className="px-[2.313rem] flex flex-col justify-start items-start gap-[1.6rem]">
              {categories.map((category) => (
                <div
                  key={category.id_kategori_tanaman}
                  className="flex flex-row justify-center items-center gap-[0.9rem]"
                >
                  <div
                    className={`w-[1.8rem] h-[1.8rem] border-[#78D14D] border-[0.1rem] rounded-md cursor-pointer flex flex-col justify-center items-center ${selectedFilters.includes(category.id_kategori_tanaman) ? "bg-[#78D14D]" : "bg-white"
                      }`}
                    onClick={() => toggleFilter(category.id_kategori_tanaman)}
                  >
                    {selectedFilters.includes(category.id_kategori_tanaman) ? (
                      <Check size={18} color="#ffffff" weight="bold" />
                    ) : null}
                  </div>
                  <p className="font-bold text-[0.875rem]">
                    {category.nama_kategori_tanaman}
                  </p>
                </div>
              ))}
            </div>
            <div className="w-full h-[0.063rem] bg-[#C3C6D4] mt-[1.25rem]"></div>
          </div>
        </section>

        <section className="col-span-9 px-[4.8rem] py-[1.9rem] flex flex-col justify-start items-start gap-[2.3rem] overflow-y-scroll mb-[1.9rem]">
          <div className="flex flex-col justify-start items-start gap-[1rem]">
            <h1 className="text-[2.5rem] font-semibold">Daftar Tanaman</h1>
            <div className="flex flex-row justify-start items-center gap-[2rem]">
              <button
                onClick={showUncompletedPlants}
                className={`py-[0.9rem] px-[2.6rem] rounded-lg ${isCompletedPlants
                  ? "bg-none text-[#78D14D]"
                  : "bg-[#78D14D] text-white"
                  } cursor-pointer text-[1rem]`}
              >
                Tanaman Dalam Proses
              </button>
              <button
                onClick={showCompletedPlants}
                className={`py-[0.9rem] px-[2.6rem] rounded-lg ${isCompletedPlants
                  ? "bg-[#78D14D] text-white"
                  : "bg-none text-[#78D14D]"
                  } cursor-pointer text-[1rem]`}
              >
                Tanaman Selesai Proses
              </button>
              <Link
                href="/plants"
                className="py-[0.9rem] rounded-lg text-[#78D14D] cursor-pointer text-[1rem] hover:text-black transition-all ease-in-out duration-200"
              >
                Tambah Tanaman
              </Link>
            </div>
          </div>

          <div className="w-[40%]">
            <InputField
              placeholder="Cari Tanaman....."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            >
              <MagnifyingGlass
                size={24}
                color="#ffffff"
                weight="bold"
                className="absolute left-[1.5rem]"
              />
            </InputField>
          </div>

          <div className="w-full grid grid-cols-3 h-full gap-x-[2.25rem] gap-y-[16.25rem]">
            {filteredPlants.length > 0 ? (
              filteredPlants.map((plant) => (
                <PlantCard
                  key={plant.id_tanaman_pengguna}
                  imageURL={`http://localhost:2000/uploads/plants/${plant.tanaman?.gambar_tanaman}`}
                  title={plant.nama_custom}
                  description={plant.tanaman?.deskripsi_tanaman || "Tidak ada deskripsi"}
                  onClickHandler={() => navigateToPlantDetail(plant.id_tanaman_pengguna)}
                  progress={plant.progress_persen}
                  status={plant.status_penanaman}
                />
              ))
            ) : (
              <div className="col-span-3 text-center py-8">
                <p className="text-gray-500 text-lg">
                  {isCompletedPlants
                    ? "Belum ada tanaman yang selesai"
                    : "Belum ada tanaman dalam proses"
                  }
                </p>
              </div>
            )}
          </div>
        </section>
      </section>
    </main>
  );
};

export default DashboardPlantsMain;