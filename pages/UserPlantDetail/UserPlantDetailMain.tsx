'use client';

import React, { useState, useEffect } from 'react';
import {
  Clock,
  ChartLineUp,
  Toolbox,
  Drop,
  Check,
  Square,
  ArrowLeft,
  CheckCircle,
  X,
} from '@phosphor-icons/react/dist/ssr';
import PrimaryButton from '@/components/buttons/PrimaryButton';
import { useRouter, usePathname, useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  getUserPlantDetail,
  getUserDailyTasks,
  updateTaskProgress,
  finishPlant,
  addDailyNote,
} from '@/api/plantApi';
import { TUserPlant, TUserPlantDay } from '@/types/plantTypes';

// Toast Notification Component
const Toast = ({
  message,
  type = 'success',
  isVisible,
  onClose,
}: {
  message: string;
  type?: 'success' | 'error';
  isVisible: boolean;
  onClose: () => void;
}) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg animate-slide-in ${
        type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
      }`}
    >
      {type === 'success' ? (
        <CheckCircle size={20} weight='fill' />
      ) : (
        <X size={20} weight='bold' />
      )}
      <span className='font-medium'>{message}</span>
      <button onClick={onClose} className='ml-2 hover:opacity-70'>
        <X size={16} weight='bold' />
      </button>
    </div>
  );
};

const UserPlantDetailMain = () => {
  // State management
  const [userPlant, setUserPlant] = useState<TUserPlant | null>(null);
  const [dailyTasks, setDailyTasks] = useState<TUserPlantDay[]>([]);
  const [selectedDay, setSelectedDay] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);

  // Toast notification state
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error';
    isVisible: boolean;
  }>({
    message: '',
    type: 'success',
    isVisible: false,
  });

  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const plantId = params?.id as string;

  // Toast helper functions
  const showToast = (
    message: string,
    type: 'success' | 'error' = 'success',
  ) => {
    setToast({
      message,
      type,
      isVisible: true,
    });
  };

  const hideToast = () => {
    setToast((prev) => ({
      ...prev,
      isVisible: false,
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const plantResponse = await getUserPlantDetail(plantId);
        if (plantResponse.data) {
          setUserPlant(plantResponse.data);
        }

        const tasksResponse = await getUserDailyTasks(plantId);
        console.log(tasksResponse);
        if (tasksResponse.data) {
          // Sort daily tasks by day order (hari_ke) to ensure proper sequence
          const sortedTasks = tasksResponse.data.sort(
            (a, b) => a.hari_ke - b.hari_ke,
          );
          setDailyTasks(sortedTasks);
        }
      } catch (err) {
        setError('Failed to fetch plant data');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (plantId) {
      fetchData();
    }
  }, [plantId]);

  // Update note state when selected day changes
  useEffect(() => {
    const currentDayTasks = getCurrentDayTasks();
    if (currentDayTasks) {
      setNote(currentDayTasks.catatan_harian || '');
    }
  }, [selectedDay, dailyTasks]);

  const getCurrentDayTasks = () => {
    if (dailyTasks.length === 0) return null;
    return dailyTasks[selectedDay] || dailyTasks[0];
  };

  // Universal handler untuk semua jenis tugas
  const handleTaskToggle = async (
    taskId: number,
    currentStatus: boolean,
    taskType: string,
  ) => {
    try {
      console.log(
        `Toggling ${taskType} task:`,
        taskId,
        'from',
        currentStatus,
        'to',
        !currentStatus,
      );

      const response = await updateTaskProgress({
        userPlantId: plantId,
        taskId: taskId,
        doneStatus: !currentStatus,
      });

      if (response.data) {
        setDailyTasks((prevDays) =>
          prevDays.map((day) => ({
            ...day,
            tugas_penanaman: day.tugas_penanaman.map((task) =>
              task.id_tugas_penanaman_pengguna === taskId
                ? {
                    ...task,
                    status_selesai: !currentStatus,
                    tanggal_selesai: !currentStatus ? new Date() : null,
                  }
                : task,
            ),
          })),
        );

        // Refresh plant data to update progress untuk tugas utama
        if (taskType === 'main') {
          const plantResponse = await getUserPlantDetail(plantId);
          if (plantResponse.data) {
            setUserPlant(plantResponse.data);
          }
        }

        showToast(
          `Tugas "${currentStatus ? 'dibatalkan' : 'diselesaikan'}" berhasil!`,
          'success',
        );
      }
    } catch (error) {
      console.error(`Error updating ${taskType} task:`, error);
      showToast('Gagal memperbarui tugas. Silakan coba lagi.', 'error');
    }
  };

  const handleFinishPlant = async () => {
    try {
      const response = await finishPlant(plantId);
      if (response.data) {
        setUserPlant(response.data);
        showToast('Tanaman berhasil diselesaikan!', 'success');
        router.push('/dashboard/plants');
      }
    } catch (error) {
      console.error('Error finishing plant:', error);
      showToast('Gagal menyelesaikan tanaman. Silakan coba lagi.', 'error');
    }
  };

  const handleAddNote = async () => {
    const currentDayTasks = getCurrentDayTasks();
    if (!currentDayTasks) return;

    try {
      setIsSubmittingNote(true);

      const response = await addDailyNote(
        plantId,
        currentDayTasks.id_hari_tanaman_pengguna,
        note.trim(),
      );

      if (response.data) {
        // Update the daily tasks state with the new note
        setDailyTasks((prevDays) =>
          prevDays.map((day) =>
            day.id_hari_tanaman_pengguna ===
            currentDayTasks.id_hari_tanaman_pengguna
              ? {
                  ...day,
                  catatan_harian: note.trim(),
                }
              : day,
          ),
        );

        showToast('Catatan berhasil disimpan!', 'success');
      } else {
        throw new Error('Failed to save note');
      }
    } catch (error) {
      console.error('Error adding note:', error);
      showToast('Gagal menyimpan catatan. Silakan coba lagi.', 'error');
    } finally {
      setIsSubmittingNote(false);
    }
  };

  const selectDate = (day: number) => {
    setSelectedDay(day);
  };

  const regist = () => {
    router.push(`${pathname}/registration`);
  };

  // Helper function to format progress percentage
  const formatProgress = (progress: number) => {
    return Number(progress).toFixed(2);
  };

  // Helper function to format date
  // const formatDate = (date: Date) => {
  //   return new Date(date).toLocaleDateString('id-ID', {
  //     day: 'numeric',
  //     month: 'long',
  //     year: 'numeric'
  //   });
  // };

  // Loading state
  if (loading) {
    return (
      <main className='px-[8.1rem] py-[5.3rem] flex justify-center items-center'>
        <div className='text-xl'>Loading...</div>
      </main>
    );
  }

  // Error state
  if (error || !userPlant) {
    return (
      <main className='px-[8.1rem] py-[5.3rem] flex justify-center items-center'>
        <div className='text-xl text-red-500'>{error || 'Plant not found'}</div>
      </main>
    );
  }

  const currentDayTasks = getCurrentDayTasks();
  const dailyTasks_filtered = currentDayTasks?.tugas_penanaman || [];

  // Separate tasks by type
  const mainTasks = dailyTasks_filtered.filter(
    (task) => task.jenis_tugas !== 'PENGECEKAN_HARIAN',
  );
  const checkTasks = dailyTasks_filtered.filter(
    (task) => task.jenis_tugas === 'PENGECEKAN_HARIAN',
  );

  return (
    <>
      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />

      <main className='px-[8.1rem] py-[5.3rem]'>
        <section className='w-full'>
          <div
            className='w-full flex flex-row justify-start items-center gap-[1rem] mb-[2.3rem] cursor-pointer'
            onClick={() => router.back()}
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
                src={
                  userPlant.tanaman?.gambar_tanaman
                    ? `http://localhost:2000/uploads/plants/${userPlant.tanaman.gambar_tanaman}`
                    : '/images/cabai.webp'
                }
                alt={userPlant.nama_custom}
                quality={100}
                unoptimized
              />
            </div>
            <div className='flex flex-col justify-between items-start'>
              <h1 className='text-[2rem] font-semibold w-[70%]'>
                {userPlant.nama_custom}
              </h1>
              <div className='flex flex-col justify-start items-start gap-[0.9rem]'>
                <div className='flex flex-row justify-start items-center gap-[0.75rem]'>
                  <Clock size={26} color='#000000' />
                  <p className='text-[0.75rem]'>
                    {userPlant.tanaman?.durasi_penanaman} Hari Hingga Panen
                  </p>
                </div>
                <div className='flex flex-row justify-start items-center gap-[0.75rem]'>
                  <ChartLineUp size={26} color='#000000' />
                  <p className='text-[0.75rem]'>
                    Tingkat Kesulitan:{' '}
                    {userPlant.tanaman?.tingkat_kesulitan || 'Tinggi'}
                  </p>
                </div>
                <div className='flex flex-row justify-start items-center gap-[0.75rem]'>
                  <Toolbox size={26} color='#000000' />
                  <p className='text-[0.75rem] w-[60%]'>
                    Kebutuhan Sinar:{' '}
                    {userPlant.tanaman?.kebutuhan_sinar_matahari} & Air:{' '}
                    {userPlant.tanaman?.kebutuhan_air}
                  </p>
                </div>
              </div>
              <div className='flex flex-col justify-start items-start gap-[0.5rem]'>
                <p className='text-[1.5rem] font-semibold'>
                  Progress: {formatProgress(userPlant.progress_persen)}%
                </p>
                <div className='flex gap-2'>
                  <PrimaryButton textColor='#ffffff' onClickHandler={regist}>
                    Beli Alat dan Bahan
                  </PrimaryButton>
                  {userPlant.status_penanaman !== 'SELESAI' && (
                    <PrimaryButton
                      textColor='#ffffff'
                      onClickHandler={handleFinishPlant}
                    >
                      Selesaikan Tanaman
                    </PrimaryButton>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tasks Section */}
        <section className='grid grid-cols-2 justify-between items-start gap-6 mt-[2.8rem]'>
          <div className='flex flex-col justify-start items-start gap-[1.3rem] col-span-1 w-full h-full'>
            <h1 className='text-[2rem] font-bold'>Tugas Penanaman</h1>
            <div className='w-full flex flex-col justify-start items-start gap-[2rem]'>
              <div className='flex flex-col justify-start items-start gap-[0.75rem]'>
                <p className='text-[1.25rem] font-semibold'>Hari</p>
                <div className='flex flex-row justify-start items-center gap-[0.9rem]'>
                  {dailyTasks.slice(0, 10).map((day, index) => (
                    <button
                      onClick={() => selectDate(index)}
                      key={index}
                      className={`p-[0.8rem] ${
                        selectedDay === index
                          ? 'bg-[#50B34B] text-white'
                          : 'bg-white text-black'
                      } border-[#CEDADE] rounded-full border-2 flex flex-col justify-center items-center w-[2rem] h-[2rem] cursor-pointer text-[1rem] font-semibold`}
                    >
                      {day.hari_ke}
                    </button>
                  ))}
                  {dailyTasks.length > 10 && (
                    <Link
                      href=''
                      className='text-[1rem] text-[#50B34B] font-semibold'
                    >
                      Lihat Semuanya
                    </Link>
                  )}
                </div>
              </div>

              <div className='grid grid-cols-2 w-full gap-x-[2.25rem]'>
                {/* Main Tasks */}
                <div className='col-span-1 flex flex-col justify-start items-start w-full gap-[0.6rem]'>
                  <p className='text-[1.25rem] font-semibold'>Tugas Harian</p>
                  <div className='flex flex-col justify-start items-start w-full gap-[1.2rem]'>
                    {mainTasks.length > 0 ? (
                      mainTasks.map((task) => (
                        <button
                          key={task.id_tugas_penanaman_pengguna}
                          onClick={() =>
                            handleTaskToggle(
                              task.id_tugas_penanaman_pengguna,
                              task.status_selesai,
                              'main',
                            )
                          }
                          className={`py-[0.8rem] px-[1rem] ${
                            task.status_selesai
                              ? 'bg-[#50B34B] text-white'
                              : 'bg-none text-black'
                          } w-full rounded-lg border-[#CEDADE] border-2 flex flex-row justify-between items-center cursor-pointer`}
                        >
                          <div className='flex flex-row justify-start items-center gap-[0.8rem]'>
                            <Drop
                              size={21}
                              color={
                                task.status_selesai ? '#FFFFFF' : '#000000'
                              }
                              weight='fill'
                            />
                            <p
                              className={`font-medium text-[1rem] ${
                                task.status_selesai
                                  ? 'text-white'
                                  : 'text-black'
                              }`}
                            >
                              {task.nama_tugas}
                            </p>
                          </div>
                          {task.status_selesai ? (
                            <Check size={21} color='#FFFFFF' weight='fill' />
                          ) : (
                            <Square size={21} color='#000000' />
                          )}
                        </button>
                      ))
                    ) : (
                      <p className='text-gray-500'>
                        Tidak ada tugas untuk hari ini
                      </p>
                    )}
                  </div>
                </div>

                {/* Check Tasks */}
                <div className='col-span-1 flex flex-col justify-start items-start w-full gap-[0.6rem]'>
                  <p className='text-[1.25rem] font-semibold'>
                    Pengecekan Harian
                  </p>
                  <div className='flex flex-col justify-start items-start w-full gap-[1.2rem]'>
                    {checkTasks.length > 0 ? (
                      checkTasks.map((task) => (
                        <button
                          key={task.id_tugas_penanaman_pengguna}
                          onClick={() =>
                            handleTaskToggle(
                              task.id_tugas_penanaman_pengguna,
                              task.status_selesai,
                              'check',
                            )
                          }
                          className={`py-[0.8rem] px-[1rem] ${
                            task.status_selesai
                              ? 'bg-[#50B34B] text-white'
                              : 'bg-none text-black'
                          } w-full rounded-lg border-[#CEDADE] border-2 flex flex-row justify-between items-center cursor-pointer`}
                        >
                          <div className='flex flex-row justify-start items-center gap-[0.8rem]'>
                            <Drop
                              size={21}
                              color={
                                task.status_selesai ? '#FFFFFF' : '#000000'
                              }
                              weight='fill'
                            />
                            <p
                              className={`font-medium text-[1rem] ${
                                task.status_selesai
                                  ? 'text-white'
                                  : 'text-black'
                              }`}
                            >
                              {task.nama_tugas}
                            </p>
                          </div>
                          {task.status_selesai ? (
                            <Check size={21} color='#FFFFFF' weight='fill' />
                          ) : (
                            <Square size={21} color='#000000' />
                          )}
                        </button>
                      ))
                    ) : (
                      <p className='text-gray-500'>
                        Tidak ada pengecekan untuk hari ini
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Notes Section */}
          <div className='flex flex-col justify-start items-start gap-[1.3rem] col-span-1 w-full h-full'>
            <h1 className='text-[2rem] font-bold'>Catatan</h1>

            {/* Add Note Form */}
            <div className='w-full flex flex-col justify-start items-start gap-[1.75rem]'>
              <p className='text-[1.5rem] font-semibold'>
                Catatan hari ke-{currentDayTasks?.hari_ke || 1}
              </p>
              <textarea
                className='w-[30rem] h-[10rem] bg-[#F2F2F2] rounded-lg px-[1rem] py-[0.5rem] resize-none focus:outline-none focus:ring-2 focus:ring-[#50B34B]'
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder='Tulis catatan Anda di sini...'
                disabled={isSubmittingNote}
              />
              <PrimaryButton
                textColor='#ffffff'
                onClickHandler={handleAddNote}
                disabled={isSubmittingNote}
              >
                {isSubmittingNote ? 'Menyimpan...' : 'Simpan Catatan'}
              </PrimaryButton>
            </div>
          </div>
        </section>

        {/* Instructions Section */}
        <section className='flex flex-col justify-start items-start gap-3 mt-[1.3rem]'>
          <h1 className='text-[2rem] font-bold'>Instruksi</h1>
          <div className='flex flex-col justify-start items-start gap-[0.5rem]'>
            {userPlant.tanaman?.instruksi_tanaman ? (
              userPlant.tanaman.instruksi_tanaman
                .sort((a, b) => a.urutan - b.urutan)
                .map((instruction) => (
                  <p key={instruction.id_instruksi} className='text-[1.1rem]'>
                    {instruction.urutan}. {instruction.instruksi}
                  </p>
                ))
            ) : (
              <li className='text-[1.1rem]'>Instruksi tidak tersedia.</li>
            )}
          </div>
        </section>
      </main>

      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default UserPlantDetailMain;
