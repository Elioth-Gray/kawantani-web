'use client';

import React from 'react';
import {
  Clock,
  ChartLineUp,
  Toolbox,
  Drop,
  ArrowLeft,
  X,
  Calendar,
  CheckCircle,
} from '@phosphor-icons/react/dist/ssr';
import PrimaryButton from '@/components/buttons/PrimaryButton';
import { useRouter, usePathname, useParams } from 'next/navigation';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getPlantById, createUserPlant } from '@/api/plantApi';
import {
  TPlant,
  TPlantDay,
  TPlantTask,
  TCreateUserPlant,
} from '@/types/plantTypes';

const PlantDetailMain = () => {
  const [plant, setPlant] = useState<TPlant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<number>(0);
  const [completedTasks, setCompletedTasks] = useState<boolean[]>([]);
  const [completedMaintain, setCompletedMaintain] = useState<boolean[]>([]);
  const [showAllDays, setShowAllDays] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [showStartPlantingModal, setShowStartPlantingModal] = useState(false);
  const [customPlantName, setCustomPlantName] = useState('');
  const [isCreatingPlant, setIsCreatingPlant] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  // State baru untuk track range yang ditampilkan
  const [displayStartIndex, setDisplayStartIndex] = useState(0);

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
          console.log('respon2: ', response?.data.provinces);
          const dayTasks =
            response.data.provinces.hari_penanaman?.[0]?.tugas_penanaman || [];
          setCompletedTasks(new Array(dayTasks.length).fill(false));
          setCompletedMaintain(new Array(dayTasks.length).fill(false));
        } else {
          setError('Failed to fetch plant data');
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

  const handleShowAllDays = () => {
    setShowCalendarModal(true);
  };

  const handleSelectDayFromCalendar = (dayIndex: number) => {
    selectDay(dayIndex);

    // Update display range jika selected day di luar range yang sedang ditampilkan
    const allDays = plant?.hari_penanaman || [];
    const currentEndIndex = displayStartIndex + 5; // 6 items (0-5)

    if (dayIndex < displayStartIndex || dayIndex > currentEndIndex) {
      // Kalau selected day di luar range, update display range
      // Usahakan selected day berada di tengah range baru
      const newStartIndex = Math.max(0, dayIndex - 3);
      const maxStartIndex = Math.max(0, allDays.length - 6);
      setDisplayStartIndex(Math.min(newStartIndex, maxStartIndex));
    }

    setShowCalendarModal(false);
  };

  const handleStartPlanting = () => {
    setShowStartPlantingModal(true);
    setCustomPlantName(plant?.nama_tanaman || '');
  };

  const handleCreateUserPlant = async () => {
    if (!plant || !customPlantName.trim()) {
      alert('Nama tanaman tidak boleh kosong');
      return;
    }

    setIsCreatingPlant(true);

    try {
      const createData: TCreateUserPlant = {
        plantId: plantId,
        customName: customPlantName.trim(),
      };

      const response = await createUserPlant(createData);

      if (response) {
        setShowStartPlantingModal(false);
        setShowSuccessMessage(true);

        // Auto redirect after 2 seconds
        setTimeout(() => {
          router.push('/dashboard/plants');
        }, 2000);
      } else {
        alert(response.message || 'Gagal memulai menanam');
      }
    } catch (error) {
      console.error('Error creating user plant:', error);
      alert('Terjadi kesalahan saat memulai menanam');
    } finally {
      setIsCreatingPlant(false);
    }
  };

  // Function untuk geser display range
  const shiftDisplayRange = (direction: 'prev' | 'next') => {
    const allDays = plant?.hari_penanaman || [];
    const maxStartIndex = Math.max(0, allDays.length - 6);

    if (direction === 'prev') {
      setDisplayStartIndex(Math.max(0, displayStartIndex - 1));
    } else {
      setDisplayStartIndex(Math.min(maxStartIndex, displayStartIndex + 1));
    }
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

  const allDays = plant.hari_penanaman || [];
  // Ubah logika displayedDays - sekarang slice berdasarkan displayStartIndex, bukan selectedDay
  const displayedDays = allDays.slice(displayStartIndex, displayStartIndex + 6);

  return (
    <main className='px-[8.1rem] py-[5.3rem] relative'>
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
                  Kebutuhan Sinar: {plant.kebutuhan_sinar_matahari} & Air:{' '}
                  {plant.kebutuhan_air}
                </p>
              </div>
            </div>
            <div className='flex flex-col justify-start items-start gap-[0.5rem]'>
              <PrimaryButton textColor='#ffffff' onClickHandler={regist}>
                Beli Alat dan Bahan
              </PrimaryButton>
              <PrimaryButton
                textColor='#ffffff'
                onClickHandler={handleStartPlanting}
              >
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
                {/* Tombol Previous - hanya tampil kalau bisa geser ke kiri */}
                {displayStartIndex > 0 && (
                  <button
                    onClick={() => shiftDisplayRange('prev')}
                    className='p-[0.8rem] bg-gray-100 text-gray-600 border-[#CEDADE] rounded-full border-2 flex flex-col justify-center items-center w-[2rem] h-[2rem] cursor-pointer text-[1rem] font-semibold hover:bg-gray-200'
                  >
                    ‹
                  </button>
                )}

                {displayedDays.map((day, displayIndex) => {
                  const actualIndex = displayStartIndex + displayIndex;
                  return (
                    <button
                      onClick={() => selectDay(actualIndex)}
                      key={day.id_hari_penanaman}
                      className={`p-[0.8rem] ${selectedDay === actualIndex
                        ? 'bg-[#50B34B] text-white'
                        : 'bg-white text-black'
                        } border-[#CEDADE] rounded-full border-2 flex flex-col justify-center items-center w-[2rem] h-[2rem] cursor-pointer text-[1rem] font-semibold`}
                    >
                      {day.hari_ke}
                    </button>
                  );
                })}

                {/* Tombol Next - hanya tampil kalau bisa geser ke kanan */}
                {displayStartIndex + 6 < allDays.length && (
                  <button
                    onClick={() => shiftDisplayRange('next')}
                    className='p-[0.8rem] bg-gray-100 text-gray-600 border-[#CEDADE] rounded-full border-2 flex flex-col justify-center items-center w-[2rem] h-[2rem] cursor-pointer text-[1rem] font-semibold hover:bg-gray-200'
                  >
                    ›
                  </button>
                )}

                <button
                  onClick={handleShowAllDays}
                  className='text-[1rem] text-[#50B34B] font-semibold hover:underline cursor-pointer'
                >
                  Lihat Semuanya
                </button>
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
                            className={`py-[0.8rem] px-[1rem] ${completedTasks[index] ? 'bg-green-100' : 'bg-none'
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
                            className={`py-[0.8rem] px-[1rem] ${completedMaintain[index]
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
          {plant.instruksi_tanaman ? (
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

      {/* Calendar Modal */}
      {showCalendarModal && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'>
          <div className='bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto'>
            <div className='flex justify-between items-center mb-6'>
              <div className='flex items-center gap-3'>
                <Calendar size={24} color='#50B34B' />
                <h2 className='text-[1.5rem] font-bold'>
                  Kalender Penanaman - {plant.nama_tanaman}
                </h2>
              </div>
              <button
                onClick={() => setShowCalendarModal(false)}
                className='p-2 hover:bg-gray-100 rounded-full'
              >
                <X size={24} color='#000000' />
              </button>
            </div>

            <div className='grid grid-cols-7 gap-2 mb-4'>
              {/* Calendar Grid */}
              {allDays.map((day, index) => {
                const isSelected = selectedDay === index;
                const hasTasksToday =
                  day.tugas_penanaman && day.tugas_penanaman.length > 0;

                return (
                  <div
                    key={day.id_hari_penanaman}
                    onClick={() => handleSelectDayFromCalendar(index)}
                    className={`
                      p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md
                      ${isSelected
                        ? 'bg-[#50B34B] text-white border-[#50B34B]'
                        : hasTasksToday
                          ? 'bg-green-50 border-green-200 hover:bg-green-100'
                          : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                      }
                    `}
                  >
                    <div className='text-center'>
                      <div className='font-bold text-lg mb-1'>
                        Hari {day.hari_ke}
                      </div>
                      <div className='text-xs mb-2'>{day.nama_fase}</div>
                      {/* {hasTasksToday && (
                        <div className='text-xs'>
                          {day.tugas_penanaman.length} tugas
                        </div>
                      )} */}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Selected Day Details */}
            {currentDayData && (
              <div className='border-t pt-4'>
                <h3 className='text-[1.2rem] font-bold mb-3'>
                  Detail Hari {currentDayData.hari_ke} -{' '}
                  {currentDayData.nama_fase}
                </h3>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div>
                    <h4 className='font-semibold mb-2 text-[#50B34B]'>
                      Tugas Harian
                    </h4>
                    {dailyTasks.length > 0 ? (
                      <ul className='space-y-2'>
                        {dailyTasks.map((task) => (
                          <li
                            key={task.id_tugas_penanaman}
                            className='flex items-center gap-2'
                          >
                            <Drop size={16} color='#50B34B' weight='fill' />
                            <span className='text-sm'>{task.nama_tugas}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className='text-gray-500 text-sm'>
                        Tidak ada tugas harian
                      </p>
                    )}
                  </div>

                  <div>
                    <h4 className='font-semibold mb-2 text-[#50B34B]'>
                      Pengecekan Harian
                    </h4>
                    {maintenanceTasks.length > 0 ? (
                      <ul className='space-y-2'>
                        {maintenanceTasks.map((task) => (
                          <li
                            key={task.id_tugas_penanaman}
                            className='flex items-center gap-2'
                          >
                            <Drop size={16} color='#50B34B' weight='fill' />
                            <span className='text-sm'>{task.nama_tugas}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className='text-gray-500 text-sm'>
                        Tidak ada pengecekan harian
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Start Planting Modal */}
      {showStartPlantingModal && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'>
          <div className='bg-white rounded-lg p-6 max-w-md w-full mx-4'>
            <div className='flex justify-between items-center mb-6'>
              <h2 className='text-[1.5rem] font-bold'>Mulai Menanam</h2>
              <button
                onClick={() => setShowStartPlantingModal(false)}
                className='p-2 hover:bg-gray-100 rounded-full'
                disabled={isCreatingPlant}
              >
                <X size={24} color='#000000' />
              </button>
            </div>

            <div className='mb-6'>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Nama Custom Tanaman
              </label>
              <input
                type='text'
                value={customPlantName}
                onChange={(e) => setCustomPlantName(e.target.value)}
                placeholder='Masukkan nama untuk tanaman Anda'
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#50B34B] focus:border-transparent'
                disabled={isCreatingPlant}
              />
              <p className='text-xs text-gray-500 mt-1'>
                Contoh: "Bayam Gweh", "Tomat Halaman Belakang"
              </p>
            </div>

            <div className='flex gap-3'>
              <button
                onClick={() => setShowStartPlantingModal(false)}
                className='flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors'
                disabled={isCreatingPlant}
              >
                Batal
              </button>
              <button
                onClick={handleCreateUserPlant}
                disabled={isCreatingPlant || !customPlantName.trim()}
                className='flex-1 px-4 py-2 bg-[#50B34B] text-white rounded-lg hover:bg-[#45a340] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors'
              >
                {isCreatingPlant ? 'Memulai...' : 'Mulai Menanam'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Message */}
      {showSuccessMessage && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'>
          <div className='bg-white rounded-lg p-8 max-w-md w-full mx-4 text-center'>
            <div className='mb-4'>
              <CheckCircle size={64} color='#50B34B' weight='fill' className='mx-auto' />
            </div>
            <h2 className='text-[1.5rem] font-bold text-[#50B34B] mb-2'>
              Berhasil Memulai Menanam!
            </h2>
            <p className='text-gray-600 mb-4'>
              Tanaman "{customPlantName}" telah berhasil ditambahkan ke daftar tanaman Anda.
            </p>
            <p className='text-sm text-gray-500'>
              Anda akan diarahkan ke halaman tanaman dalam beberapa detik...
            </p>
          </div>
        </div>
      )}
    </main>
  );
};

export default PlantDetailMain;