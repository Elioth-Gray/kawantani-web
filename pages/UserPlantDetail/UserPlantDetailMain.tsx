"use client";

import React from "react";
import {
  Clock,
  ChartLineUp,
  Toolbox,
  Drop,
  Check,
  Square,
  ArrowLeft,
} from "@phosphor-icons/react/dist/ssr";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import ActionButton from "@/components/buttons/ActionButton";

const UserPlantDetailMain = () => {
  const [completedTasks, setCompletedTasks] = useState(
    new Array(3).fill(false)
  );

  const [completedMaintain, setCompletedMaintain] = useState(
    new Array(3).fill(false)
  );

  const [taskDate, setTaskDate] = useState(null);

  const selectDate = (day: any) => {
    setTaskDate(day);
  };

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
  const router = useRouter();
  const pathname = usePathname();

  const regist = () => {
    router.push(`${pathname}/registration`);
  };

  return (
    <main className="px-[8.1rem] py-[5.3rem]">
      <section className="w-full">
        <div
          className="w-full flex flex-row justify-start items-center gap-[1rem] mb-[2.3rem] cursor-pointers"
          onClick={() => {
            router.back();
          }}
        >
          <ArrowLeft
            size={24}
            color="#00000"
            weight="bold"
            className="cursor-pointer"
          />
          <p className="cursor-pointer">Kembali</p>
        </div>
      </section>
      {/* CCard Section */}
      <section>
        <div className="w-full h-full grid grid-cols-2 gap-x-[2.8rem]">
          <div className="w-full h-[19.8rem] object-cover overflow-hidden rounded-lg col-span-1">
            <Image
              className=" object-cover w-full h-full"
              width={545}
              height={307}
              src="/images/cabai.webp"
              alt="cabai"
              quality={100}
              unoptimized
            ></Image>
          </div>
          <div className="flex flex-col justify-between items-start">
            <h1 className="text-[2rem] font-semibold w-[70%]">Cabai Jawa</h1>
            <div className="flex flex-col justify-start items-start gap-[0.9rem]">
              <div className="flex flex-row justify-start items-center gap-[0.75rem]">
                <Clock size={26} color="#000000" />
                <p className="text-[0.75rem]">6 Bulan Hingga Panen</p>
              </div>
              <div className="flex flex-row justify-start items-center gap-[0.75rem]">
                <ChartLineUp size={26} color="#000000" />
                <p className="text-[0.75rem]">Permintaan Pasar: Tinggi</p>
              </div>
              <div className="flex flex-row justify-start items-center gap-[0.75rem]">
                <Toolbox size={26} color="#000000" />
                <p className="text-[0.75rem] w-[60%]">
                  Alat dan Bahan: Cangkul, Sekop, Pupuk, Penyiram tanaman, Alat
                  ukur tanaman
                </p>
              </div>
            </div>
            <div className="flex flex-col justify-start items-start gap-[0.5rem]">
              <p className="text-[1.5rem] font-semibold">Progress: 60%</p>
              <PrimaryButton textColor="#ffffff" onClickHandler={regist}>
                Beli Alat dan Bahan
              </PrimaryButton>
            </div>
          </div>
        </div>
      </section>
      {/* Description Section */}
      <section className="grid grid-cols-2 justify-between items-start gap-6 mt-[2.8rem]">
        <div className="flex flex-col justify-start items-start gap-[1.3rem] col-span-1  w-full h-full  ">
          <h1 className="text-[2rem] font-bold">Tugas Penanaman</h1>
          <div className="w-full flex flex-col justify-start items-start gap-[2rem]">
            <div className="flex flex-col justify-start items-start gap-[0.75rem]">
              <p className="text-[1.25rem] font-semibold">Hari</p>
              <div className="flex flex-row justify-start items-center gap-[0.9rem]">
                {[...Array(10)].map((_, index) => {
                  return (
                    <button
                      onClick={() => {
                        selectDate(index);
                      }}
                      key={index}
                      className={`p-[0.8rem] ${
                        taskDate == index
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
        </div>
        <div className="flex flex-col justify-start items-start gap-[1.3rem] col-span-1 w-full h-full">
          <h1 className="text-[2rem] font-bold">Tugas Penanaman</h1>
          <div className="w-full h-full flex flex-col justify-end items-start gap-[1.75rem]">
            <p className="text-[1.5rem] font-semibold">Catatan hari ini</p>
            <textarea className="w-[30rem] h-[10rem] bg-[#F2F2F2] rounded-lg px-[1rem] py-[0.5rem]"></textarea>
            <PrimaryButton textColor="#ffffff">Tambah Catatan</PrimaryButton>
          </div>
        </div>
      </section>
      <section className="flex flex-col justify-start items-start gap-3 mt-[1.3rem]">
        <h1 className="text-[2rem] font-bold">Instruksi</h1>
        <ol className="flex flex-col justify-start items-start gap-[0.5rem]">
          <li className="text-[1.1rem]">
            1. Cabai tumbuh optimal di daerah beriklim tropis dengan suhu
            24–28°C dan tidak tahan terhadap genangan air atau suhu dingin.
          </li>
          <li className="text-[1.1rem]">
            2. Tanaman cabai memerlukan cahaya matahari langsung minimal 6 jam
            per hari dan sebaiknya ditanam di tempat terbuka yang tidak terlalu
            teduh.
          </li>
          <li className="text-[1.1rem]">
            3. Jenis tanah yang cocok adalah tanah gembur, subur, kaya bahan
            organik, memiliki pH 5,5–6,8, dan drainase yang baik.
          </li>
          <li className="text-[1.1rem]">
            4. Penyiraman harus dilakukan secara teratur untuk menjaga
            kelembapan tanah, namun tidak berlebihan agar akar tidak busuk.
          </li>
          <li className="text-[1.1rem]">
            5. Pemupukan awal dapat menggunakan pupuk organik, lalu dilanjutkan
            dengan pupuk NPK setiap 2–3 minggu sekali untuk menunjang
            pertumbuhan dan pembuahan.
          </li>
          <li className="text-[1.1rem]">
            6. Tanaman harus dijaga dari hama seperti kutu daun, ulat, dan
            thrips dengan cara alami atau pestisida nabati.
          </li>
          <li className="text-[1.1rem]">
            7. Waktu tanam yang ideal adalah awal musim hujan atau saat cuaca
            stabil, dan di dataran rendah bisa ditanam sepanjang tahun dengan
            pengairan cukup
          </li>
        </ol>
      </section>
    </main>
  );
};

export default UserPlantDetailMain;
