"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Drop } from "@phosphor-icons/react/dist/ssr";
import { Check } from "@phosphor-icons/react/dist/ssr";
import { Square } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import ArticleCard from "@/components/cards/ArticleCard";
import WorkshopCard from "@/components/cards/WorkshopCard";

const DashboardMain = () => {
  const [completedTasks, setCompletedTasks] = useState(
    new Array(3).fill(false)
  );

  const [completedMaintain, setCompletedMaintain] = useState(
    new Array(3).fill(false)
  );

  const [taskDate, setTaskDate] = useState(null);

  // Weather and location states
  const [weather, setWeather] = useState({
    temperature: 0,
    humidity: 0,
    location: "Loading...",
    date: new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get user location and weather data using FREE Open-Meteo API
  useEffect(() => {
    const getLocationAndWeather = async () => {
      try {
        // Get current date
        const currentDate = new Date().toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        });

        // Get user's location
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords;

              try {
                // Get location name using free reverse geocoding
                const locationResponse = await fetch(
                  `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=id`
                );
                const locationData = await locationResponse.json();

                // Get weather data using FREE Open-Meteo API (no API key needed!)
                const weatherResponse = await fetch(
                  `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=relativehumidity_2m&timezone=auto&forecast_days=1`
                );
                const weatherData = await weatherResponse.json();

                const locationName = locationData.city
                  ? `${locationData.city}, ${locationData.principalSubdivision || locationData.countryName}`
                  : `${locationData.locality || 'Unknown'}, ${locationData.countryName || 'Indonesia'}`;

                // Get current humidity from hourly data (current hour)
                const currentHour = new Date().getHours();
                const currentHumidity = weatherData.hourly?.relativehumidity_2m?.[currentHour] || 70;

                setWeather({
                  temperature: Math.round(weatherData.current_weather.temperature),
                  humidity: Math.round(currentHumidity),
                  location: locationName,
                  date: currentDate
                });

              } catch (apiError) {
                console.error('Weather API error:', apiError);
                // Fallback to default location (Surabaya)
                await getDefaultWeather(currentDate);
              }

              setLoading(false);
            },
            async (error) => {
              console.error('Geolocation error:', error);
              // Fallback to default location (Surabaya)
              await getDefaultWeather(currentDate);
              setLoading(false);
            }
          );
        } else {
          // Geolocation not supported, use default
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
    const getDefaultWeather = async (currentDate) => {
      try {
        // Surabaya coordinates: -7.2575, 112.7521
        const weatherResponse = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=-7.2575&longitude=112.7521&current_weather=true&hourly=relativehumidity_2m&timezone=auto&forecast_days=1`
        );
        const weatherData = await weatherResponse.json();

        // Get current humidity from hourly data
        const currentHour = new Date().getHours();
        const currentHumidity = weatherData.hourly?.relativehumidity_2m?.[currentHour] || 70;

        setWeather({
          temperature: Math.round(weatherData.current_weather.temperature),
          humidity: Math.round(currentHumidity),
          location: 'Surabaya, Jawa Timur',
          date: currentDate
        });
      } catch (error) {
        console.error('Default weather error:', error);
        setWeather({
          temperature: 30,
          humidity: 70,
          location: 'Surabaya, Jawa Timur',
          date: currentDate
        });
      }
    };

    getLocationAndWeather();
  }, []);

  const selectDate = (day) => {
    setTaskDate(day);
  };

  const toggleTaskCompletions = (index) => {
    const updatedTasks = [...completedTasks];
    updatedTasks[index] = !updatedTasks[index];
    setCompletedTasks(updatedTasks);
  };

  const toggleMaintainCompletions = (index) => {
    const updatedTasks = [...completedMaintain];
    updatedTasks[index] = !updatedTasks[index];
    setCompletedMaintain(updatedTasks);
  };

  return (
    <>
      {/* Feature Section */}
      <section className="px-[9rem] py-[6.3rem] bg-[#FCF7F1]">
        {/* Weather Section */}
        <div className="flex flex-col">
          <h1 className="text-[#50B34B] text-[3rem] font-bold gap-[0.75rem]">
            Pantau Cuaca
          </h1>
          <div className="flex flex-row justify-between">
            <div className="flex flex-col justify-between items-start">
              <h1 className="text-[1.5rem] font-semibold">
                {loading ? 'Loading...' : weather.date}
              </h1>
              <h1 className="text-[1.5rem] font-semibold">
                {loading ? 'Loading...' : weather.location}
              </h1>
              {error && (
                <p className="text-red-500 text-sm mt-2">{error}</p>
              )}
            </div>
            <div className="flex flex-row justify-end items-center gap-[4rem]">
              <div className="py-[3.3rem] px-[4rem] rounded-lg border border-black flex flex-col justify-center items-center w-[21.25rem]">
                <div className="flex flex-row justify-center items-center gap-[1rem]">
                  <Image
                    src="/images/weather.svg"
                    width={84}
                    height={68}
                    alt="humidity icon"
                    className="cursor-pointer"
                  />
                  <div className="flex flex-col justify-between items-start">
                    <p className="text-[1rem] font-semibold">Kelembapan</p>
                    <p className="text-[2.25rem] font-semibold">
                      {loading ? '--' : `${weather.humidity}%`}
                    </p>
                  </div>
                </div>
              </div>
              <div className="py-[3.3rem] px-[4rem] rounded-lg border border-black flex flex-col justify-center items-center w-[21.25rem]">
                <div className="flex flex-row justify-center items-center gap-[1rem]">
                  <Image
                    src="/images/heat.svg"
                    width={60}
                    height={87}
                    alt="temperature icon"
                    className="cursor-pointer"
                  />
                  <div className="flex flex-col justify-between items-start">
                    <p className="text-[1rem] font-semibold">Suhu</p>
                    <p className="text-[2.25rem] font-semibold">
                      {loading ? '--°C' : `${weather.temperature}°C`}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Plants Section */}
        <div className="flex flex-col mt-[6.3rem]">
          <h1 className="text-[#50B34B] text-[3rem] font-bold gap-[0.75rem]">
            Pantau Tanaman
          </h1>
          <div className="grid grid-cols-9 gap-x-[3.3rem]">
            {/* Tracking Section */}
            <div className="col-span-6 w-full py-[2rem] border border-black rounded-lg px-[3rem] flex flex-col justify-start items-start gap-[2rem]">
              <div className="flex flex-row justify-center items-center gap-[1rem] h-fit">
                <div className="w-[4.9rem] h-[4.9rem]">
                  <Image
                    src="/images/lemon.webp"
                    width={79}
                    height={79}
                    alt="logo"
                    className="cursor-pointer object-cover h-full rounded-full"
                  />
                </div>
                <div className="flex flex-col justify-start items-start">
                  <p className="text-[1.6rem] font-semibold">Lemon Malang</p>
                  <p className="text-[0.8rem]">36 Hari menuju panen</p>
                </div>
              </div>
              <div className="flex flex-col justify-start items-start gap-[0.75rem]">
                <p className="text-[1.25rem] font-semibold">Hari</p>
                <div className="flex flex-row justify-start items-center gap-[0.9rem]">
                  {[...Array(12)].map((_, index) => {
                    return (
                      <button
                        onClick={() => {
                          selectDate(index);
                        }}
                        key={index}
                        className={`p-[0.8rem] ${taskDate == index
                            ? "bg-[#50B34B] text-white"
                            : "bg-white text-black"
                          } border-[#CEDADE] rounded-full border-2 flex flex-col justify-center items-center w-[2rem] h-[2rem] cursor-pointer text-[1rem] font-semibold`}
                      >
                        {index + 1}
                      </button>
                    );
                  })}

                  <Link
                    href=""
                    className="text-[1rem] text-[#50B34B] font-semibold"
                  >
                    Lihat Semuanya
                  </Link>
                </div>
              </div>
              <div className="grid grid-cols-2 w-full gap-x-[2.25rem]">
                <div className="col-span-1 flex flex-col justify-start items-start w-full gap-[0.6rem]">
                  <p className="text-[1.25rem] font-semibold">Tugas Harian</p>
                  <div className="flex flex-col justify-start items-start w-full gap-[1.2rem]">
                    {completedTasks.map((isCompleted, index) => (
                      <button
                        onClick={() => toggleTaskCompletions(index)}
                        className={`py-[0.8rem] px-[1rem] ${isCompleted
                            ? "bg-[#50B34B] text-white"
                            : "bg-none text-black"
                          } w-full rounded-lg border-[#CEDADE] border-2 flex flex-row justify-between items-center cursor-pointer`}
                        key={index}
                      >
                        <div className="flex flex-row justify-start items-center gap-[0.8rem]">
                          {isCompleted ? (
                            <Drop size={21} color="#FFFFFF" weight="fill" />
                          ) : (
                            <Drop size={21} color="#000000" weight="fill" />
                          )}

                          <p
                            className={`font-medium text-[1rem] ${isCompleted ? "text-white" : "text-black"
                              }`}
                          >
                            Siram Tanaman
                          </p>
                        </div>
                        {isCompleted ? (
                          <Check size={21} color="#FFFFFF" weight="fill" />
                        ) : (
                          <Square size={21} color="#000000" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="col-span-1 flex flex-col justify-start items-start w-full gap-[0.6rem]">
                  <p className="text-[1.25rem] font-semibold">
                    Pengecekan Harian
                  </p>
                  <div className="flex flex-col justify-start items-start w-full gap-[1.2rem]">
                    {completedMaintain.map((isCompleted, index) => (
                      <button
                        onClick={() => toggleMaintainCompletions(index)}
                        className={`py-[0.8rem] px-[1rem] ${isCompleted
                            ? "bg-[#50B34B] text-white"
                            : "bg-none text-black"
                          } w-full rounded-lg border-[#CEDADE] border-2 flex flex-row justify-between items-center cursor-pointer`}
                        key={index}
                      >
                        <div className="flex flex-row justify-start items-center gap-[0.8rem]">
                          {isCompleted ? (
                            <Drop size={21} color="#FFFFFF" weight="fill" />
                          ) : (
                            <Drop size={21} color="#000000" weight="fill" />
                          )}

                          <p
                            className={`font-medium text-[1rem] ${isCompleted ? "text-white" : "text-black"
                              }`}
                          >
                            Siram Tanaman
                          </p>
                        </div>
                        {isCompleted ? (
                          <Check size={21} color="#FFFFFF" weight="fill" />
                        ) : (
                          <Square size={21} color="#000000" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            {/* More Plants Section */}
            <div className="col-span-3 bg-[#153236] rounded-lg py-[1.4rem] flex flex-col justify-start items-start  text-white gap-[2.1rem]">
              <div className="w-full flex flex-row justify-between items-center px-[1.8rem]">
                <h1 className="text-[1.25rem] font-semibold">Tanamanmu</h1>
                <Link
                  className="text-[#50B34B] text-[0.8rem]"
                  href="/dashboard/plants"
                >
                  Lihat semuanya
                </Link>
              </div>
              <div className="flex flex-col justify-start items-start gap-[2rem] w-full px-[1rem]">
                <div className="flex flex-row justify-start items-center gap-[1rem] h-fit w-full hover:bg-white hover:text-black px-[1.8rem] py-[1rem] text-white transition-all ease-in-out duration-150 rounded-lg cursor-pointer">
                  <div className="w-[3.1rem] h-[3.1rem]">
                    <Image
                      src="/images/lemon.webp"
                      width={79}
                      height={79}
                      alt="logo"
                      className="cursor-pointer object-cover h-full rounded-full"
                    />
                  </div>
                  <div className="flex flex-col justify-start items-start">
                    <p className="text-[0.8rem] font-semibold">Lemon Malang</p>
                    <p className="text-[0.75rem]">36 Hari menuju panen</p>
                  </div>
                </div>
                <div className="flex flex-row justify-start items-center gap-[1rem] h-fit w-full hover:bg-white hover:text-black px-[1.8rem] py-[1rem] text-white transition-all ease-in-out duration-150 rounded-lg cursor-pointer">
                  <div className="w-[3.1rem] h-[3.1rem]">
                    <Image
                      src="/images/lemon.webp"
                      width={79}
                      height={79}
                      alt="logo"
                      className="cursor-pointer object-cover h-full rounded-full"
                    />
                  </div>
                  <div className="flex flex-col justify-start items-start">
                    <p className="text-[0.8rem] font-semibold">Lemon Malang</p>
                    <p className="text-[0.75rem]">36 Hari menuju panen</p>
                  </div>
                </div>
                <div className="flex flex-row justify-start items-center gap-[1rem] h-fit w-full hover:bg-white hover:text-black px-[1.8rem] py-[1rem] text-white transition-all ease-in-out duration-150 rounded-lg cursor-pointer">
                  <div className="w-[3.1rem] h-[3.1rem]">
                    <Image
                      src="/images/lemon.webp"
                      width={79}
                      height={79}
                      alt="logo"
                      className="cursor-pointer object-cover h-full rounded-full"
                    />
                  </div>
                  <div className="flex flex-col justify-start items-start">
                    <p className="text-[0.8rem] font-semibold">Lemon Malang</p>
                    <p className="text-[0.75rem]">36 Hari menuju panen</p>
                  </div>
                </div>
                <div className="flex flex-row justify-start items-center gap-[1rem] h-fit w-full hover:bg-white hover:text-black px-[1.8rem] py-[1rem] text-white transition-all ease-in-out duration-150 rounded-lg cursor-pointer">
                  <div className="w-[3.1rem] h-[3.1rem]">
                    <Image
                      src="/images/lemon.webp"
                      width={79}
                      height={79}
                      alt="logo"
                      className="cursor-pointer object-cover h-full rounded-full"
                    />
                  </div>
                  <div className="flex flex-col justify-start items-start">
                    <p className="text-[0.8rem] font-semibold">Lemon Malang</p>
                    <p className="text-[0.75rem]">36 Hari menuju panen</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="px-[9rem] py-[6.3rem] bg-white">
        <div className="w-full flex flex-col justify-start items-start gap-[2.4rem]">
          <div className="w-full flex flex-col justify-start items-start">
            <div className="flex flex-row justify-between items-end w-full">
              <h1 className="text-black text-[3rem] font-bold gap-[0.75rem]">
                Baca Artikel
              </h1>
              <Link
                href="/dashboard/articles"
                className="text-[1.2rem] text-[#50B34B]"
              >
                Lihat semuanya
              </Link>
            </div>
          </div>
          <div className="w-full grid grid-cols-4 h-full gap-x-[2.25rem] gap-y-[2.25rem]">
            <ArticleCard
              imageURL="/images/bayam.webp"
              title="Teknik Agar Bayam Tidak Rusak Saat Masa Tanam"
              date="14 Februari 2025"
              href="/articles/1/details"
            />
            <ArticleCard
              imageURL="/images/bayam.webp"
              title="Teknik Agar Bayam Tidak Rusak Saat Masa Tanam"
              date="14 Februari 2025"
              href="/articles/1/details"
            />
            <ArticleCard
              imageURL="/images/bayam.webp"
              title="Teknik Agar Bayam Tidak Rusak Saat Masa Tanam"
              date="14 Februari 2025"
              href="/articles/1/details"
            />
            <ArticleCard
              imageURL="/images/bayam.webp"
              title="Teknik Agar Bayam Tidak Rusak Saat Masa Tanam"
              date="14 Februari 2025"
              href="/articles/1/details"
            />
          </div>
        </div>
        <div className="w-full flex flex-col justify-start items-start gap-[2.4rem] mt-[6.3rem]">
          <div className="w-full flex flex-col justify-start items-start">
            <div className="flex flex-row justify-between items-end w-full">
              <h1 className="text-black text-[3rem] font-bold gap-[0.75rem]">
                Ikuti Workshop
              </h1>
              <Link
                href="/dashboard/workshops"
                className="text-[1.2rem] text-[#50B34B]"
              >
                Lihat semuanya
              </Link>
            </div>
          </div>
          <div className="w-full grid grid-cols-2 h-full gap-x-[2.25rem] gap-y-[2.25rem]">
            <WorkshopCard
              imageURL="/images/workshop-image.webp"
              title="Teknik Genjot Padi Untuk Keberlanjutan Pangan Jawa Tengah"
              date="Jumat, 15 Februari 2025"
              location="Balai Kota Solo, Jawa Tengah"
            />
            <WorkshopCard
              imageURL="/images/workshop-image.webp"
              title="Teknik Genjot Padi Untuk Keberlanjutan Pangan Jawa Tengah"
              date="Jumat, 15 Februari 2025"
              location="Balai Kota Solo, Jawa Tengah"
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default DashboardMain;