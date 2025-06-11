'use client';

import React from 'react';
import {
  Clock,
  ChartLineUp,
  Toolbox,
  Drop,
  ArrowLeft,
} from '@phosphor-icons/react/dist/ssr';
import PrimaryButton from '@/components/buttons/PrimaryButton';
import { useRouter, usePathname, useParams } from 'next/navigation';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getPlantById } from '@/api/plantApi';
import { TPlant, TPlantDay, TPlantTask } from '@/types/plantTypes';

const PlantDetailMain = () => {
  const [plant, setPlant] = useState<TPlant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<number>(0);
  const [completedTasks, setCompletedTasks] = useState<boolean[]>([]);
  const [completedMaintain, setCompletedMaintain] = useState<boolean[]>([]);

  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const plantId = params?.id as string;

  // Fetch plant data on component mount
  useEffect(() => {
    const fetchPlantData = async () => {
      if (!plantId) return;

      try {
        setLoading(true);
        const response = await getPlantById(plantId);
        console.log('respon1: ', response);

        if (response) {
          setPlant(response.data.provinces);
          console.log('respon2: ', response.data.provinces);

          // Initialize completed tasks arrays based on actual data
          const dayTasks =
            response.data.provinces.hari_penanaman?.[0]?.tugas_penanaman || [];
          setCompletedTasks(new Array(dayTasks.length).fill(false));
          setCompletedMaintain(new Array(dayTasks.length).fill(false));
        } else {
          setError(response.message);
        }
      } catch (err) {
        setError('Failed to fetch plant data');
        console.error('Error fetching plant:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlantData();
  }, [plantId]);

  const selectDay = (dayIndex: number) => {
    setSelectedDay(dayIndex);

    // Reset completed tasks when switching days
    const selectedDayData = plant?.hari_penanaman?.[dayIndex];
    const dayTasks = selectedDayData?.tugas_penanaman || [];
    setCompletedTasks(new Array(dayTasks.length).fill(false));
    setCompletedMaintain(new Array(dayTasks.length).fill(false));
  };

  const toggleTaskCompletion = (index: number) => {
    const updatedTasks = [...completedTasks];
    updatedTasks[index] = !updatedTasks[index];
    setCompletedTasks(updatedTasks);
  };

  const toggleMaintainCompletion = (index: number) => {
    const updatedTasks = [...completedMaintain];
    updatedTasks[index] = !updatedTasks[index];
    setCompletedMaintain(updatedTasks);
  };

  const regist = () => {
    router.push(`${pathname}/registration`);
  };

  // Loading state
  if (loading) {
    return (
      <main className='px-[8.1rem] py-[5.3rem]'>
        <div className='flex justify-center items-center h-64'>
          <p className='text-lg'>Loading plant data...</p>
        </div>
      </main>
    );
  }

  // Error state
  if (error || !plant) {
    return (
      <main className='px-[8.1rem] py-[5.3rem]'>
        <div className='flex justify-center items-center h-64'>
          <p className='text-lg text-red-600'>
            Error: {error || 'Plant not found'}
          </p>
        </div>
      </main>
    );
  }

  // Get current selected day data
  const currentDayData = plant.hari_penanaman?.[selectedDay];
  const currentTasks = currentDayData?.tugas_penanaman || [];

  const dailyTasks = currentTasks.filter(
    (task) => task.jenis_tugas === 'TUGAS_BIASA' || !task.jenis_tugas,
  );
  console.log(dailyTasks);
  const maintenanceTasks = currentTasks.filter(
    (task) => task.jenis_tugas === 'PENGECEKAN_HARIAN',
  );
  console.log(maintenanceTasks);

  return (
    <main className='px-[8.1rem] py-[5.3rem]'>
      <section className='w-full'>
        <div
          className='w-full flex flex-row justify-start items-center gap-[1rem] mb-[2.3rem] cursor-pointer'
          onClick={() => {
            router.back();
          }}
        >
          <ArrowLeft
            size={24}
            color='#00000'
            weight='bold'
            className='cursor-pointer'
          />
          <p className='cursor-pointer'>Kembali</p>
        </div>
      </section>

      {/* Card Section */}
      <section>
        <div className='w-full h-full grid grid-cols-2 gap-x-[2.8rem]'>
          <div className='w-full h-[19.8rem] object-cover overflow-hidden rounded-lg col-span-1'>
            <Image
              className='object-cover w-full h-full'
              width={545}
              height={307}
              src={`http://localhost:2000/uploads/plants/${plant.gambar_tanaman}`}
              alt={plant.nama_tanaman}
              quality={100}
              unoptimized
            />
          </div>
          <div className='flex flex-col justify-between items-start'>
            <h1 className='text-[2rem] font-semibold w-[70%]'>
              {plant.nama_tanaman}
            </h1>
            <div className='flex flex-col justify-start items-start gap-[0.9rem]'>
              <div className='flex flex-row justify-start items-center gap-[0.75rem]'>
                <Clock size={26} color='#000000' />
                <p className='text-[0.75rem]'>
                  {plant.durasi_penanaman} Hari Hingga Panen
                </p>
              </div>
              <div className='flex flex-row justify-start items-center gap-[0.75rem]'>
                <ChartLineUp size={26} color='#000000' />
                <p className='text-[0.75rem]'>
                  Tingkat Kesulitan: {plant.tingkat_kesulitan}
                </p>
              </div>
              <div className='flex flex-row justify-start items-center gap-[0.75rem]'>
                <Toolbox size={26} color='#000000' />
                <p className='text-[0.75rem] w-[60%]'>
                  Kebutuhan Sinar: {plant.kebutuhan_sinar_matahari} | Air:{' '}
                  {plant.kebutuhan_air}
                </p>
              </div>
            </div>
            <div className='flex flex-col justify-start items-start gap-[0.5rem]'>
              <PrimaryButton textColor='#ffffff' onClickHandler={regist}>
                Beli Alat dan Bahan
              </PrimaryButton>
              <PrimaryButton textColor='#ffffff' onClickHandler={regist}>
                Mulai Menanam
              </PrimaryButton>
            </div>
          </div>
        </div>
      </section>

      {/* Description Section */}
      <section className='grid grid-cols-2 justify-between items-start gap-3 mt-[2.8rem]'>
        <div className='flex flex-col justify-start items-start gap-[1.3rem] col-span-1 w-full h-full'>
          <h1 className='text-[2rem] font-bold'>Deskripsi</h1>
          <p className='text-[1.1rem]'>
            {plant.deskripsi_tanaman || 'Deskripsi tanaman tidak tersedia.'}
          </p>
        </div>
        <div className='flex flex-col justify-start items-start gap-[1.3rem] col-span-1 w-full h-full'>
          <h1 className='text-[2rem] font-bold'>Tugas Penanaman</h1>
          <div className='w-full flex flex-col justify-start items-start gap-[2rem]'>
            <div className='flex flex-col justify-start items-start gap-[0.75rem]'>
              <p className='text-[1.25rem] font-semibold'>Hari</p>
              <div className='flex flex-row justify-start items-center gap-[0.9rem] flex-wrap'>
                {plant.hari_penanaman?.map((day, index) => (
                  <button
                    onClick={() => selectDay(index)}
                    key={day.id_hari_penanaman}
                    className={`p-[0.8rem] ${
                      selectedDay === index
                        ? 'bg-[#50B34B] text-white'
                        : 'bg-white text-black'
                    } border-[#CEDADE] rounded-full border-2 flex flex-col justify-center items-center w-[2rem] h-[2rem] cursor-pointer text-[1rem] font-semibold`}
                  >
                    {day.hari_ke}
                  </button>
                ))}

                <Link
                  href=''
                  className='text-[1rem] text-[#50B34B] font-semibold'
                >
                  Lihat Semuanya
                </Link>
              </div>
            </div>

            {currentDayData && (
              <div className='w-full'>
                <h3 className='text-[1.1rem] font-semibold mb-2'>
                  Fase: {currentDayData.nama_fase}
                </h3>
                <div className='grid grid-cols-2 w-full gap-x-[2.25rem]'>
                  <div className='col-span-1 flex flex-col justify-start items-start w-full gap-[0.6rem]'>
                    <p className='text-[1.25rem] font-semibold'>Tugas Harian</p>
                    <div className='flex flex-col justify-start items-start w-full gap-[1.2rem]'>
                      {dailyTasks.length > 0 ? (
                        dailyTasks.map((task, index) => (
                          <button
                            key={task.id_tugas_penanaman}
                            onClick={() => toggleTaskCompletion(index)}
                            className={`py-[0.8rem] px-[1rem] ${
                              completedTasks[index] ? 'bg-green-100' : 'bg-none'
                            } text-black w-full rounded-lg border-[#CEDADE] border-2 flex flex-row justify-between items-center cursor-pointer`}
                          >
                            <div className='flex flex-row justify-start items-center gap-[0.8rem]'>
                              <Drop size={21} color='#000000' weight='fill' />
                              <p className='font-medium text-[1rem] text-black'>
                                {task.nama_tugas}
                              </p>
                            </div>
                            {completedTasks[index] && (
                              <span className='text-green-600'>✓</span>
                            )}
                          </button>
                        ))
                      ) : (
                        <p className='text-gray-500'>Tidak ada tugas harian</p>
                      )}
                    </div>
                  </div>
                  <div className='col-span-1 flex flex-col justify-start items-start w-full gap-[0.6rem]'>
                    <p className='text-[1.25rem] font-semibold'>
                      Pengecekan Harian
                    </p>
                    <div className='flex flex-col justify-start items-start w-full gap-[1.2rem]'>
                      {maintenanceTasks.length > 0 ? (
                        maintenanceTasks.map((task, index) => (
                          <button
                            key={task.id_tugas_penanaman}
                            onClick={() => toggleMaintainCompletion(index)}
                            className={`py-[0.8rem] px-[1rem] ${
                              completedMaintain[index]
                                ? 'bg-green-100'
                                : 'bg-none'
                            } text-black w-full rounded-lg border-[#CEDADE] border-2 flex flex-row justify-between items-center cursor-pointer`}
                          >
                            <div className='flex flex-row justify-start items-center gap-[0.8rem]'>
                              <Drop size={21} color='#000000' weight='fill' />
                              <p className='font-medium text-[1rem] text-black'>
                                {task.nama_tugas}
                              </p>
                            </div>
                            {completedMaintain[index] && (
                              <span className='text-green-600'>✓</span>
                            )}
                          </button>
                        ))
                      ) : (
                        <p className='text-gray-500'>
                          Tidak ada pengecekan harian
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Instructions Section */}
      <section className='flex flex-col justify-start items-start gap-3 mt-[1.3rem]'>
        <h1 className='text-[2rem] font-bold'>Instruksi</h1>
        <ol className='flex flex-col justify-start items-start gap-[0.5rem]'>
          {plant.instruksi_tanaman && plant.instruksi_tanaman.length > 0 ? (
            plant.instruksi_tanaman
              .sort((a, b) => a.urutan - b.urutan)
              .map((instruction) => (
                <li key={instruction.id_instruksi} className='text-[1.1rem]'>
                  {instruction.urutan}. {instruction.instruksi}
                </li>
              ))
          ) : (
            <li className='text-[1.1rem]'>Instruksi tidak tersedia.</li>
          )}
        </ol>
      </section>
    </main>
  );
};

export default PlantDetailMain;
