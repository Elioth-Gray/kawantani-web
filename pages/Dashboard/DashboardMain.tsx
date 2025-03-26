"use client";

import React, { useState } from "react";
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

  const toggleTaskCompletions = (index: number) => {
    const updatedTasks = [...completedTasks];
    updatedTasks[index] = !updatedTasks[index];
    setCompletedTasks(updatedTasks);
  };

  const toggleMaintainCompletions = (index: number) => {
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
              <h1 className="text-[1.5rem] font-semibold">11 Februari 2025</h1>
              <h1 className="text-[1.5rem] font-semibold">
                Gubeng, Surabaya, Jawa Timur
              </h1>
            </div>
            <div className="flex flex-row justify-end items-center gap-[4rem]">
              <div className="py-[3.3rem] px-[4rem] rounded-lg border border-black flex flex-col justify-center items-center w-[21.25rem]">
                <div className="flex flex-row justify-center items-center gap-[1rem]">
                  <Image
                    src="/images/weather.svg"
                    width={84}
                    height={68}
                    alt="logo"
                    className="cursor-pointer"
                  ></Image>
                  <div className="flex flex-col justify-between items-start">
                    <p className="text-[1rem] font-semibold">Kelembapan</p>
                    <p className="text-[2.25rem] font-semibold">36°C</p>
                  </div>
                </div>
              </div>
              <div className="py-[3.3rem] px-[4rem] rounded-lg border border-black flex flex-col justify-center items-center w-[21.25rem]">
                <div className="flex flex-row justify-center items-center gap-[1rem]">
                  <Image
                    src="/images/heat.svg"
                    width={60}
                    height={87}
                    alt="logo"
                    className="cursor-pointer"
                  ></Image>
                  <div className="flex flex-col justify-between items-start">
                    <p className="text-[1rem] font-semibold">Suhu</p>
                    <p className="text-[2.25rem] font-semibold">36°C</p>
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
                    src="/images/lemon.jpg"
                    width={79}
                    height={79}
                    alt="logo"
                    className="cursor-pointer object-cover h-full rounded-full"
                  ></Image>
                </div>
                <div className="flex flex-col justify-start items-start">
                  <p className="text-[1.6rem] font-semibold">Lemon Malang</p>
                  <p className="text-[0.8rem">36 Hari menuju panen</p>
                </div>
              </div>
              <div className="flex flex-col justify-start items-start gap-[0.75rem]">
                <p className="text-[1.25rem] font-semibold">Hari</p>
                <div className="flex flex-row justify-start items-center gap-[0.9rem]">
                  <button className="p-[0.8rem] bg-white border-[#CEDADE] rounded-full border-2 flex flex-col justify-center items-center w-[2rem] h-[2rem] cursor-pointer text-[1rem] font-semibold">
                    1
                  </button>
                  <button className="p-[0.8rem] bg-[#50B34B] border-[#CEDADE] rounded-full border-2 flex flex-col justify-center items-center w-[2rem] h-[2rem] cursor-pointer text-[1rem] font-semibold text-white">
                    2
                  </button>
                  <button className="p-[0.8rem] bg-white border-[#CEDADE] rounded-full border-2 flex flex-col justify-center items-center w-[2rem] h-[2rem] cursor-pointer text-[1rem] font-semibold">
                    3
                  </button>
                  <button className="p-[0.8rem] bg-white border-[#CEDADE] rounded-full border-2 flex flex-col justify-center items-center w-[2rem] h-[2rem] cursor-pointer text-[1rem] font-semibold">
                    4
                  </button>
                  <button className="p-[0.8rem] bg-white border-[#CEDADE] rounded-full border-2 flex flex-col justify-center items-center w-[2rem] h-[2rem] cursor-pointer text-[1rem] font-semibold">
                    5
                  </button>
                  <button className="p-[0.8rem] bg-white border-[#CEDADE] rounded-full border-2 flex flex-col justify-center items-center w-[2rem] h-[2rem] cursor-pointer text-[1rem] font-semibold">
                    6
                  </button>
                  <button className="p-[0.8rem] bg-white border-[#CEDADE] rounded-full border-2 flex flex-col justify-center items-center w-[2rem] h-[2rem] cursor-pointer text-[1rem] font-semibold">
                    7
                  </button>
                  <button className="p-[0.8rem] bg-white border-[#CEDADE] rounded-full border-2 flex flex-col justify-center items-center w-[2rem] h-[2rem] cursor-pointer text-[1rem] font-semibold">
                    8
                  </button>
                  <button className="p-[0.8rem] bg-white border-[#CEDADE] rounded-full border-2 flex flex-col justify-center items-center w-[2rem] h-[2rem] cursor-pointer text-[1rem] font-semibold">
                    9
                  </button>
                  <button className="p-[0.8rem] bg-white border-[#CEDADE] rounded-full border-2 flex flex-col justify-center items-center w-[2rem] h-[2rem] cursor-pointer text-[1rem] font-semibold">
                    10
                  </button>
                  <button className="p-[0.8rem] bg-white border-[#CEDADE] rounded-full border-2 flex flex-col justify-center items-center w-[2rem] h-[2rem] cursor-pointer text-[1rem] font-semibold">
                    11
                  </button>
                  <button className="p-[0.8rem] bg-white border-[#CEDADE] rounded-full border-2 flex flex-col justify-center items-center w-[2rem] h-[2rem] cursor-pointer text-[1rem] font-semibold">
                    12
                  </button>
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
                        className={`py-[0.8rem] px-[1rem] ${
                          isCompleted
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
                            className={`font-medium text-[1rem] ${
                              isCompleted ? "text-white" : "text-black"
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
                        className={`py-[0.8rem] px-[1rem] ${
                          isCompleted
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
                            className={`font-medium text-[1rem] ${
                              isCompleted ? "text-white" : "text-black"
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
                <p className="text-[#50B34B] text-[0.8rem]">Lihat semuanya</p>
              </div>
              <div className="flex flex-col justify-start items-start gap-[2rem] w-full px-[1rem]">
                <div className="flex flex-row justify-start items-center gap-[1rem] h-fit w-full hover:bg-white hover:text-black px-[1.8rem] py-[1rem] text-white transition-all ease-in-out duration-150 rounded-lg cursor-pointer">
                  <div className="w-[3.1rem] h-[3.1rem]">
                    <Image
                      src="/images/lemon.jpg"
                      width={79}
                      height={79}
                      alt="logo"
                      className="cursor-pointer object-cover h-full rounded-full"
                    ></Image>
                  </div>
                  <div className="flex flex-col justify-start items-start">
                    <p className="text-[0.8rem] font-semibold">Lemon Malang</p>
                    <p className="text-[0.75rem]">36 Hari menuju panen</p>
                  </div>
                </div>
                <div className="flex flex-row justify-start items-center gap-[1rem] h-fit w-full hover:bg-white hover:text-black px-[1.8rem] py-[1rem] text-white transition-all ease-in-out duration-150 rounded-lg cursor-pointer">
                  <div className="w-[3.1rem] h-[3.1rem]">
                    <Image
                      src="/images/lemon.jpg"
                      width={79}
                      height={79}
                      alt="logo"
                      className="cursor-pointer object-cover h-full rounded-full"
                    ></Image>
                  </div>
                  <div className="flex flex-col justify-start items-start">
                    <p className="text-[0.8rem] font-semibold">Lemon Malang</p>
                    <p className="text-[0.75rem]">36 Hari menuju panen</p>
                  </div>
                </div>
                <div className="flex flex-row justify-start items-center gap-[1rem] h-fit w-full hover:bg-white hover:text-black px-[1.8rem] py-[1rem] text-white transition-all ease-in-out duration-150 rounded-lg cursor-pointer">
                  <div className="w-[3.1rem] h-[3.1rem]">
                    <Image
                      src="/images/lemon.jpg"
                      width={79}
                      height={79}
                      alt="logo"
                      className="cursor-pointer object-cover h-full rounded-full"
                    ></Image>
                  </div>
                  <div className="flex flex-col justify-start items-start">
                    <p className="text-[0.8rem] font-semibold">Lemon Malang</p>
                    <p className="text-[0.75rem]">36 Hari menuju panen</p>
                  </div>
                </div>
                <div className="flex flex-row justify-start items-center gap-[1rem] h-fit w-full hover:bg-white hover:text-black px-[1.8rem] py-[1rem] text-white transition-all ease-in-out duration-150 rounded-lg cursor-pointer">
                  <div className="w-[3.1rem] h-[3.1rem]">
                    <Image
                      src="/images/lemon.jpg"
                      width={79}
                      height={79}
                      alt="logo"
                      className="cursor-pointer object-cover h-full rounded-full"
                    ></Image>
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
            <div className="flex flex-row justify-between items-center w-full">
              <h1 className="text-black text-[3rem] font-bold gap-[0.75rem]">
                Baca Artikel
              </h1>
              <Link href="" className="text-[1.2rem] text-[#50B34B]">
                Lihat semuanya
              </Link>
            </div>
          </div>
          <div className="w-full grid grid-cols-4 h-full gap-x-[2.25rem] gap-y-[2.25rem]">
            <ArticleCard
              imageURL="/images/bayam.jpg"
              title="Teknik Agar Bayam Tidak Rusak Saat Masa Tanam"
              date="14 Februari 2025"
            ></ArticleCard>
            <ArticleCard
              imageURL="/images/bayam.jpg"
              title="Teknik Agar Bayam Tidak Rusak Saat Masa Tanam"
              date="14 Februari 2025"
            ></ArticleCard>
            <ArticleCard
              imageURL="/images/bayam.jpg"
              title="Teknik Agar Bayam Tidak Rusak Saat Masa Tanam"
              date="14 Februari 2025"
            ></ArticleCard>
            <ArticleCard
              imageURL="/images/bayam.jpg"
              title="Teknik Agar Bayam Tidak Rusak Saat Masa Tanam"
              date="14 Februari 2025"
            ></ArticleCard>
          </div>
        </div>
        <div className="w-full flex flex-col justify-start items-start gap-[2.4rem] mt-[6.3rem]">
          <div className="w-full flex flex-col justify-start items-start">
            <div className="flex flex-row justify-between items-center w-full">
              <h1 className="text-black text-[3rem] font-bold gap-[0.75rem]">
                Ikuti Workshop
              </h1>
              <Link href="" className="text-[1.2rem] text-[#50B34B]">
                Lihat semuanya
              </Link>
            </div>
          </div>
          <div className="w-full grid grid-cols-2 h-full gap-x-[2.25rem] gap-y-[2.25rem]">
            <WorkshopCard
              imageURL="/images/workshop-image.jpg"
              title="Teknik Genjot Padi Untuk Keberlanjutan Pangan Jawa Tengah"
              date="Jumat, 15 Februari 2025"
              location="Balai Kota Solo, Jawa Tengah"
            ></WorkshopCard>
            <WorkshopCard
              imageURL="/images/workshop-image.jpg"
              title="Teknik Genjot Padi Untuk Keberlanjutan Pangan Jawa Tengah"
              date="Jumat, 15 Februari 2025"
              location="Balai Kota Solo, Jawa Tengah"
            ></WorkshopCard>
          </div>
        </div>
      </section>
    </>
  );
};

export default DashboardMain;
