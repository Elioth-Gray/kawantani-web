'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getAllArticles } from '@/api/articleApi';
import { TArticle } from '@/types/articleTypes';
import Image from 'next/image';
import { Drop, Check, Square } from '@phosphor-icons/react/dist/ssr';
import Link from 'next/link';
import ArticleCard from '@/components/cards/ArticleCard';
import WorkshopCard from '@/components/cards/WorkshopCard';
import { getVerifiedWorkshops } from '@/api/workshopApi';
import { getUserPlants, getUserDailyTasks, updateTaskProgress } from '@/api/plantApi';
import { TUserPlant, TUserPlantDay} from '@/types/plantTypes';

const DashboardMain = () => {
  // Weather and location states
  const [weather, setWeather] = useState({
    temperature: 0,
    humidity: 0,
    location: 'Loading...',
    date: new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }),
  });

  const [articles, setArticles] = useState<TArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const pathname = usePathname();
  const router = useRouter();
  const [workshops, setWorkshops] = useState<any[]>([]);
  const [userPlants, setUserPlants] = useState<TUserPlant[]>([]);
  const [selectedPlant, setSelectedPlant] = useState<TUserPlant | null>(null);
  const [dailyTasks, setDailyTasks] = useState<TUserPlantDay[]>([]);
  const [selectedDay, setSelectedDay] = useState(0);

  // Fetch articles
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await getAllArticles();
        if (response.data) {
          setArticles(response.data);
        }
      } catch (error) {
        console.error('Error fetching articles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  // Fetch user plants
  useEffect(() => {
    const fetchUserPlants = async () => {
      try {
        const response = await getUserPlants();
        if (response.data) {
          setUserPlants(response.data.slice(0, 4));
          // Automatically select the first plant if available
          if (response.data.length > 0) {
            setSelectedPlant(response.data[0]);
            fetchDailyTasks(response.data[0].id_tanaman_pengguna);
          }
        }
      } catch (error) {
        console.error('Error fetching user plants:', error);
      }
    };

    fetchUserPlants();
  }, []);

  // Fetch daily tasks for selected plant
  const fetchDailyTasks = async (plantId: string) => {
    try {
      const tasksResponse = await getUserDailyTasks(plantId);
      if (tasksResponse.data) {
        const sortedTasks = tasksResponse.data.sort((a, b) => a.hari_ke - b.hari_ke);
        setDailyTasks(sortedTasks);
        setSelectedDay(0);
      }
    } catch (err) {
      console.error('Error fetching daily tasks:', err);
    }
  };

  // Fetch workshops
  useEffect(() => {
    const fetchWorkshops = async () => {
      try {
        const response = await getVerifiedWorkshops();
        if (response.data) {
          setWorkshops(response.data);
        } else {
          setError(response.message || 'Gagal memuat data workshop');
        }
      } catch (err) {
        setError('Terjadi kesalahan saat memuat data');
      } finally {
        setLoading(false);
      }
    };

    fetchWorkshops();
  }, []);

  // Fetch weather data
  useEffect(() => {
    const getLocationAndWeather = async () => {
      try {
        // Get current date
        const currentDate = new Date().toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        });

        // Get user's location
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords;

              try {
                const locationResponse = await fetch(
                  `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=id`,
                );
                const locationData = await locationResponse.json();

                const weatherResponse = await fetch(
                  `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=relativehumidity_2m&timezone=auto&forecast_days=1`,
                );
                const weatherData = await weatherResponse.json();

                const locationName = locationData.city
                  ? `${locationData.city}, ${locationData.principalSubdivision ||
                  locationData.countryName
                  }`
                  : `${locationData.locality || 'Unknown'}, ${locationData.countryName || 'Indonesia'
                  }`;

                const currentHour = new Date().getHours();
                const currentHumidity =
                  weatherData.hourly?.relativehumidity_2m?.[currentHour] || 70;

                setWeather({
                  temperature: Math.round(
                    weatherData.current_weather.temperature,
                  ),
                  humidity: Math.round(currentHumidity),
                  location: locationName,
                  date: currentDate,
                });
              } catch (apiError) {
                console.error('Weather API error:', apiError);
                await getDefaultWeather(currentDate);
              }

              setLoading(false);
            },
            async (error) => {
              console.error('Geolocation error:', error);
              await getDefaultWeather(currentDate);
              setLoading(false);
            },
          );
        } else {
          await getDefaultWeather(currentDate);
          setLoading(false);
        }
      } catch (err) {
        console.error('Error getting location and weather:', err);
        setError('Failed to load weather data');
        setLoading(false);
      }
    };

    // Fallback function for default location (Surabaya) using FREE APIs
    const getDefaultWeather = async (currentDate: string) => {
      try {
        const weatherResponse = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=-7.2575&longitude=112.7521&current_weather=true&hourly=relativehumidity_2m&timezone=auto&forecast_days=1`,
        );
        const weatherData = await weatherResponse.json();

        const currentHour = new Date().getHours();
        const currentHumidity =
          weatherData.hourly?.relativehumidity_2m?.[currentHour] || 70;

        setWeather({
          temperature: Math.round(weatherData.current_weather.temperature),
          humidity: Math.round(currentHumidity),
          location: 'Surabaya, Jawa Timur',
          date: currentDate,
        });
      } catch (error) {
        console.error('Default weather error:', error);
        setWeather({
          temperature: 30,
          humidity: 70,
          location: 'Surabaya, Jawa Timur',
          date: currentDate,
        });
      }
    };

    getLocationAndWeather();
  }, []);

  const selectDate = (day: number) => {
    setSelectedDay(day);
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid date';

      const options: Intl.DateTimeFormatOptions = {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      };
      return date.toLocaleDateString('id-ID', options);
    } catch {
      return 'Invalid date';
    }
  };

  const calculateDaysToHarvest = (userPlant: TUserPlant) => {
    if (!userPlant.tanaman?.durasi_penanaman) return 0;

    const totalDays = userPlant.tanaman.durasi_penanaman;
    const progressDays = Math.floor((userPlant.progress_persen / 100) * totalDays);
    const remainingDays = totalDays - progressDays;

    return Math.max(0, remainingDays);
  };

  const navigate = (id: string) => {
    router.push(`${pathname}/${id}/details`);
  };

  const toggleTaskCompletion = async (taskId: number, currentStatus: boolean) => {
    try {
      if (!selectedPlant) return;

      const response = await updateTaskProgress({
        userPlantId: selectedPlant.id_tanaman_pengguna,
        taskId: taskId,
        doneStatus: !currentStatus,
      });

      if (response.data) {
        // Update the tasks in state
        setDailyTasks(prevDays =>
          prevDays.map(day => ({
            ...day,
            tugas_penanaman: day.tugas_penanaman.map(task =>
              task.id_tugas_penanaman_pengguna === taskId
                ? {
                  ...task,
                  status_selesai: !currentStatus,
                  tanggal_selesai: !currentStatus ? new Date() : null,
                }
                : task
            )
          }))
        );
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handlePlantSelect = (plant: TUserPlant) => {
    setSelectedPlant(plant);
    fetchDailyTasks(plant.id_tanaman_pengguna);
  };

  const getCurrentDayTasks = () => {
    if (dailyTasks.length === 0) return [];
    return dailyTasks[selectedDay]?.tugas_penanaman || [];
  };

  // Separate tasks by type
  const getTasksByType = (type: string) => {
    return getCurrentDayTasks().filter(task =>
      type === 'main'
        ? task.jenis_tugas !== 'PENGECEKAN_HARIAN'
        : task.jenis_tugas === 'PENGECEKAN_HARIAN'
    );
  };

  if (loading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <p>Memuat data...</p>
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
    <>
      {/* Feature Section */}
      <section className='px-[9rem] py-[6.3rem] bg-[#FCF7F1]'>
        {/* Weather Section */}
        <div className='flex flex-col'>
          <h1 className='text-[#50B34B] text-[3rem] font-bold gap-[0.75rem]'>
            Pantau Cuaca
          </h1>
          <div className='flex flex-row justify-between'>
            <div className='flex flex-col justify-between items-start'>
              <h1 className='text-[1.5rem] font-semibold'>
                {loading ? 'Loading...' : weather.date}
              </h1>
              <h1 className='text-[1.5rem] font-semibold'>
                {loading ? 'Loading...' : weather.location}
              </h1>
              {error && <p className='text-red-500 text-sm mt-2'>{error}</p>}
            </div>
            <div className='flex flex-row justify-end items-center gap-[4rem]'>
              <div className='py-[3.3rem] px-[4rem] rounded-lg border border-black flex flex-col justify-center items-center w-[21.25rem]'>
                <div className='flex flex-row justify-center items-center gap-[1rem]'>
                  <Image
                    src='/images/weather.svg'
                    width={84}
                    height={68}
                    alt='humidity icon'
                    className='cursor-pointer'
                  />
                  <div className='flex flex-col justify-between items-start'>
                    <p className='text-[1rem] font-semibold'>Kelembapan</p>
                    <p className='text-[2.25rem] font-semibold'>
                      {loading ? '--' : `${weather.humidity}%`}
                    </p>
                  </div>
                </div>
              </div>
              <div className='py-[3.3rem] px-[4rem] rounded-lg border border-black flex flex-col justify-center items-center w-[21.25rem]'>
                <div className='flex flex-row justify-center items-center gap-[1rem]'>
                  <Image
                    src='/images/heat.svg'
                    width={60}
                    height={87}
                    alt='temperature icon'
                    className='cursor-pointer'
                  />
                  <div className='flex flex-col justify-between items-start'>
                    <p className='text-[1rem] font-semibold'>Suhu</p>
                    <p className='text-[2.25rem] font-semibold'>
                      {loading ? '--°C' : `${weather.temperature}°C`}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Plants Section */}
        <div className='flex flex-col mt-[6.3rem]'>
          <h1 className='text-[#50B34B] text-[3rem] font-bold gap-[0.75rem]'>
            Pantau Tanaman
          </h1>
          <div className='grid grid-cols-9 gap-x-[3.3rem]'>
            {/* Tracking Section */}
            <div className='col-span-6 w-full py-[2rem] border border-black rounded-lg px-[3rem] flex flex-col justify-start items-start gap-[2rem]'>
              {selectedPlant ? (
                <>
                  <div className='flex flex-row justify-center items-center gap-[1rem] h-fit'>
                    <div className='w-[4.9rem] h-[4.9rem]'>
                      <Image
                        src={
                          selectedPlant.tanaman?.gambar_tanaman
                            ? `http://localhost:2000/uploads/plants/${selectedPlant.tanaman.gambar_tanaman}`
                            : '/images/lemon.webp'
                        }
                        width={79}
                        height={79}
                        alt={selectedPlant.nama_custom}
                        className='cursor-pointer object-cover h-full rounded-full'
                      />
                    </div>
                    <div className='flex flex-col justify-start items-start'>
                      <p className='text-[1.6rem] font-semibold'>{selectedPlant.nama_custom}</p>
                      <p className='text-[0.8rem]'>
                        {selectedPlant.status_penanaman === 'SELESAI'
                          ? 'Tanaman sudah siap panen!'
                          : `${calculateDaysToHarvest(selectedPlant)} Hari menuju panen`
                        }
                      </p>
                    </div>
                  </div>
                  <div className='flex flex-col justify-start items-start gap-[0.75rem]'>
                    <p className='text-[1.25rem] font-semibold'>Hari</p>
                    <div className='flex flex-row justify-start items-center gap-[0.9rem]'>
                      {dailyTasks.slice(0, 12).map((day, index) => (
                        <button
                          onClick={() => selectDate(index)}
                          key={index}
                          className={`p-[0.8rem] ${selectedDay === index
                            ? 'bg-[#50B34B] text-white'
                            : 'bg-white text-black'
                            } border-[#CEDADE] rounded-full border-2 flex flex-col justify-center items-center w-[2rem] h-[2rem] cursor-pointer text-[1rem] font-semibold`}
                        >
                          {day.hari_ke}
                        </button>
                      ))}
                      <Link
                        href='/dashboard/plants'
                        className='text-[1rem] text-[#50B34B] font-semibold'
                      >
                        Lihat Semuanya
                      </Link>
                    </div>
                  </div>
                  <div className='grid grid-cols-2 w-full gap-x-[2.25rem]'>
                    {/* Main Tasks */}
                    <div className='col-span-1 flex flex-col justify-start items-start w-full gap-[0.6rem]'>
                      <p className='text-[1.25rem] font-semibold'>Tugas Harian</p>
                      <div className='flex flex-col justify-start items-start w-full gap-[1.2rem]'>
                        {getTasksByType('main').length > 0 ? (
                          getTasksByType('main').map((task) => (
                            <button
                              onClick={() => toggleTaskCompletion(task.id_tugas_penanaman_pengguna, task.status_selesai)}
                              className={`py-[0.8rem] px-[1rem] ${task.status_selesai
                                ? 'bg-[#50B34B] text-white'
                                : 'bg-none text-black'
                                } w-full rounded-lg border-[#CEDADE] border-2 flex flex-row justify-between items-center cursor-pointer`}
                              key={task.id_tugas_penanaman_pengguna}
                            >
                              <div className='flex flex-row justify-start items-center gap-[0.8rem]'>
                                <Drop size={21} color={task.status_selesai ? '#FFFFFF' : '#000000'} weight='fill' />
                                <p className={`font-medium text-[1rem] ${task.status_selesai ? 'text-white' : 'text-black'}`}>
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
                          <p className='text-gray-500'>Tidak ada tugas untuk hari ini</p>
                        )}
                      </div>
                    </div>

                    {/* Check Tasks */}
                    <div className='col-span-1 flex flex-col justify-start items-start w-full gap-[0.6rem]'>
                      <p className='text-[1.25rem] font-semibold'>
                        Pengecekan Harian
                      </p>
                      <div className='flex flex-col justify-start items-start w-full gap-[1.2rem]'>
                        {getTasksByType('check').length > 0 ? (
                          getTasksByType('check').map((task) => (
                            <button
                              onClick={() => toggleTaskCompletion(task.id_tugas_penanaman_pengguna, task.status_selesai)}
                              className={`py-[0.8rem] px-[1rem] ${task.status_selesai
                                ? 'bg-[#50B34B] text-white'
                                : 'bg-none text-black'
                                } w-full rounded-lg border-[#CEDADE] border-2 flex flex-row justify-between items-center cursor-pointer`}
                              key={task.id_tugas_penanaman_pengguna}
                            >
                              <div className='flex flex-row justify-start items-center gap-[0.8rem]'>
                                <Drop size={21} color={task.status_selesai ? '#FFFFFF' : '#000000'} weight='fill' />
                                <p className={`font-medium text-[1rem] ${task.status_selesai ? 'text-white' : 'text-black'}`}>
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
                          <p className='text-gray-500'>Tidak ada pengecekan untuk hari ini</p>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className='flex flex-col justify-center items-center py-8'>
                  <p className='text-gray-500 text-lg mb-4'>Belum ada tanaman yang ditanam</p>
                  <Link
                    href='/plants'
                    className='text-[#50B34B] font-semibold hover:underline'
                  >
                    Mulai Tanam Sekarang
                  </Link>
                </div>
              )}
            </div>

            {/* More Plants Section */}
            <div className='col-span-3 bg-[#153236] rounded-lg py-[1.4rem] flex flex-col justify-start items-start text-white gap-[2.1rem]'>
              <div className='w-full flex flex-row justify-between items-center px-[1.8rem]'>
                <h1 className='text-[1.25rem] font-semibold'>Tanamanmu</h1>
                <Link
                  className='text-[#50B34B] text-[0.8rem]'
                  href='/dashboard/plants'
                >
                  Lihat semuanya
                </Link>
              </div>
              <div className='flex flex-col justify-start items-start gap-[2rem] w-full px-[1rem]'>
                {userPlants.length > 0 ? (
                  userPlants.map((plant) => (
                    <div
                      key={plant.id_tanaman_pengguna}
                      className={`flex flex-row justify-start items-center gap-[1rem] h-fit w-full ${selectedPlant?.id_tanaman_pengguna === plant.id_tanaman_pengguna ? 'bg-white text-black' : 'hover:bg-white hover:text-black'} px-[1.8rem] py-[1rem] transition-all ease-in-out duration-150 rounded-lg cursor-pointer`}
                      onClick={() => handlePlantSelect(plant)}
                    >
                      <div className='w-[3.1rem] h-[3.1rem]'>
                        <Image
                          src={
                            plant.tanaman?.gambar_tanaman
                              ? `http://localhost:2000/uploads/plants/${plant.tanaman.gambar_tanaman}`
                              : '/images/lemon.webp'
                          }
                          width={79}
                          height={79}
                          alt={plant.nama_custom}
                          className='cursor-pointer object-cover h-full rounded-full'
                        />
                      </div>
                      <div className='flex flex-col justify-start items-start'>
                        <p className='text-[0.8rem] font-semibold'>{plant.nama_custom}</p>
                        <p className='text-[0.75rem]'>
                          {plant.status_penanaman === 'SELESAI'
                            ? 'Siap panen!'
                            : `${calculateDaysToHarvest(plant)} Hari menuju panen`
                          }
                        </p>
                        <div className='w-full bg-gray-600 rounded-full h-1 mt-1'>
                          <div
                            className='bg-[#50B34B] h-1 rounded-full transition-all duration-300'
                            style={{ width: `${Math.min(plant.progress_persen, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className='flex flex-col justify-center items-center py-4 px-[1.8rem] text-center'>
                    <p className='text-gray-300 text-sm mb-2'>Belum ada tanaman</p>
                    <Link
                      href='/plants'
                      className='text-[#50B34B] text-sm hover:underline'
                    >
                      Tambah Tanaman
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Articles and Workshops Sections */}
      <section className='px-[9rem] py-[6.3rem] bg-white'>
        <div className='w-full flex flex-col justify-start items-start gap-[2.4rem]'>
          <div className='w-full flex flex-col justify-start items-start'>
            <div className='flex flex-row justify-between items-end w-full'>
              <h1 className='text-black text-[3rem] font-bold gap-[0.75rem]'>
                Baca Artikel
              </h1>
              <Link
                href='/dashboard/articles'
                className='text-[1.2rem] text-[#50B34B]'
              >
                Lihat semuanya
              </Link>
            </div>
          </div>
          <div className='w-full grid grid-cols-4 h-full gap-x-[2.25rem] gap-y-[2.25rem]'>
            {loading ? (
              <div>
                <p>Memuat artikel...</p>
              </div>
            ) : !articles || articles.length === 0 ? (
              <div>
                <p>Tidak ada artikel yang tersedia</p>
              </div>
            ) : (
              <>
                {articles.map((article) => (
                  <ArticleCard
                    key={article.id_artikel}
                    imageURL={`http://localhost:2000/uploads/articles/${article.gambar_artikel}`}
                    title={article.judul_artikel}
                    date={formatDate(article.tanggal_artikel)}
                    href={`/articles/${article.id_artikel}/details`}
                  />
                ))}
              </>
            )}
          </div>
        </div>
        <div className='w-full flex flex-col justify-start items-start gap-[2.4rem] mt-[6.3rem]'>
          <div className='w-full flex flex-col justify-start items-start'>
            <div className='flex flex-row justify-between items-end w-full'>
              <h1 className='text-black text-[3rem] font-bold gap-[0.75rem]'>
                Ikuti Workshop
              </h1>
              <Link
                href='/dashboard/workshops'
                className='text-[1.2rem] text-[#50B34B]'
              >
                Lihat semuanya
              </Link>
            </div>
          </div>
          <div className='w-full grid grid-cols-2 h-full gap-x-[2.25rem] gap-y-[2.25rem]'>
            {workshops.length > 0 ? (
              workshops.map((workshop) => (
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
              <p className='col-span-2 text-center py-10'>
                Tidak ada workshop tersedia
              </p>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default DashboardMain;