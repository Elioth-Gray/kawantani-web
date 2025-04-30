"use client";

import PrimaryButton from "@/components/buttons/PrimaryButton";
import React from "react";
import Image from "next/image";
import {
  Bookmark,
  Star,
  Share,
  Pencil,
  Trash,
  Dresser,
  ArrowLeft,
} from "@phosphor-icons/react/dist/ssr";
import { useRouter, usePathname } from "next/navigation";

const UserArticleDetailMain = () => {
  const router = useRouter();
  const pathname = usePathname();

  const navigate = () => {
    router.push(`${pathname}/edit`);
  };
  return (
    <main className="py-[6.4rem] px-[14rem]">
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
      <section className="w-full mb-[3.6rem]">
        <div className="w-full flex flex-row justify-center items-center gap-[3.8rem]">
          <div
            className="flex flex-row justify-center items-center gap-[1.1rem] cursor-pointer"
            onClick={() => navigate()}
          >
            <Pencil size={24} color="#0d0d0d" className="group-hover:hidden" />
            <p>Edit Artikel</p>
          </div>
          <div className="flex flex-row justify-center items-center gap-[1.1rem] cursor-pointer">
            <Trash size={24} color="#0d0d0d" className="group-hover:hidden" />
            <p>Hapus Artikel</p>
          </div>
          <div className="flex flex-row justify-center items-center gap-[1.1rem] cursor-pointer">
            <Dresser size={24} color="#0d0d0d" className="group-hover:hidden" />
            <p>Arsip Artikel</p>
          </div>
        </div>
      </section>
      {/* Header Section */}
      <section className="flex flex-col justify-center items-center gap-[0.9rem] mb-[3.75rem]">
        <div className="flex flex-row justify-center items-center gap-[1.8rem]">
          <p className="">Diterbitkan 25 Januari 2025</p>
          <div className="w-[1.1rem] h-[1.1rem] rounded-full bg-[#D9D9D9]"></div>
          <p>Oleh Pak Damairi</p>
        </div>
        <h1 className="text-center w-[50%] text-[2.5rem] font-semibold">
          Teknik Agar Bayam Tidak Rusak Saat Masa Tanam
        </h1>
        <p className="text-center w-[60%]">
          Untuk mencegah bayam rusak selama masa tanam, pastikan tanaman
          mendapatkan cahaya yang cukup, irigasi teratur, dan tanah yang subur
          serta drainase baik. Jaga kebersihan tanaman dan lakukan pemupukan
          serta pengendalian hama secara alami.
        </p>
        <PrimaryButton textColor="#ffffff">
          Teknik Pertanian dan Produksi
        </PrimaryButton>
      </section>
      <section className="w-full mb-[3.75rem]">
        <div className="flex flex-row justify-center items-center gap-[3.1rem]">
          <div className="w-[3rem] h-[3rem] rounded-full flex flex-col justify-center items-center border bg-white border-black cursor-pointer group hover:bg-[#78D14D] hover:border-[#78D14D] transition-all ease-in-out duration-200">
            <Bookmark
              size={24}
              color="#0d0d0d"
              className="group-hover:hidden"
            />
            <Bookmark
              size={24}
              color="#ffffff"
              className="hidden group-hover:block"
            />
          </div>
          <div className="w-[3rem] h-[3rem] rounded-full flex flex-col justify-center items-center border bg-white border-black cursor-pointer group hover:bg-[#78D14D] hover:border-[#78D14D] transition-all ease-in-out duration-200">
            <Star size={24} color="#0d0d0d" className="group-hover:hidden" />
            <Star
              size={24}
              color="#ffffff"
              className="hidden group-hover:block"
            />
          </div>
          <div className="w-[3rem] h-[3rem] rounded-full flex flex-col justify-center items-center border bg-white border-black cursor-pointer group hover:bg-[#78D14D] hover:border-[#78D14D] transition-all ease-in-out duration-200">
            <Share size={24} color="#0d0d0d" className="group-hover:hidden" />
            <Share
              size={24}
              color="#ffffff"
              className="hidden group-hover:block"
            />
          </div>
        </div>
      </section>
      {/* Image Section */}
      <section className="w-full flex flex-row justify-center items-center mb-[3.75rem]">
        <div className="w-full h-[29rem] overflow-clip object-cover rounded-xl">
          <Image
            src="/images/bayam.webp"
            width={100}
            height={0}
            alt="bayam"
            className="w-full h-[29rem] object-cover"
            unoptimized
          ></Image>
        </div>
      </section>
      {/* Text Section */}
      <section className="w-full mb-[3.75rem]">
        <div className="flex flex-col justify-start items-start text-[1.2rem] gap-[0.8rem]">
          <p>
            Panen jagung merupakan tahap akhir yang krusial dalam siklus
            pertanian, dan untuk menghasilkan jagung berkualitas tinggi,
            perhatian yang cermat pada beberapa aspek sangat penting. Salah satu
            hal pertama yang perlu diperhatikan adalah pemilihan waktu panen
            yang tepat. Jagung sebaiknya dipanen ketika bijinya sudah cukup
            keras dan matang, dengan ciri-ciri seperti sisik tongkol yang
            mengering dan biji yang berwarna kuning atau sesuai dengan
            varietasnya. Pemilihan waktu yang tepat akan menghindari kerugian
            akibat pemanenan terlalu dini atau terlambat, yang dapat
            mempengaruhi kualitas jagung secara signifikan.
          </p>
          <p>
            Jika dipanen terlalu dini, jagung mungkin masih mengandung kadar air
            yang tinggi, yang dapat mengurangi daya simpan dan kualitas bijinya.
            Sebaliknya, jika dipanen terlalu terlambat, biji jagung dapat
            menjadi keras, kering berlebihan, atau mudah rontok dari tongkolnya.
            Selain itu, waktu panen yang tepat juga berpengaruh pada kandungan
            nutrisi jagung, sehingga menghasilkan produk dengan kualitas terbaik
            untuk dikonsumsi atau diproses lebih lanjut. Oleh karena itu,
            penting bagi petani untuk memantau perkembangan tanaman jagung
            secara seksama, memperhatikan kondisi fisik tongkol, dan menggunakan
            pengalaman serta pengetahuan lokal untuk menentukan waktu panen yang
            paling optimal
          </p>
        </div>
      </section>
      {/* Comment Section */}
      <section className="w-full flex flex-col gap-[3.1rem] justify-start items-start">
        <div className="w-full h-[15rem] bg-[#F2F2F2] rounded-lg px-[3.3rem] py-[2.25rem] flex flex-col">
          <textarea
            placeholder="Tulis Komentar........"
            className="w-full outline-none text-gray-800 placeholder-gray-500 resize-none h-[60%]"
          ></textarea>
          <div className="flex flex-row justify-end items-center h-[20%] w-full">
            <PrimaryButton textColor="#ffffff">Kirim Komentar</PrimaryButton>
          </div>
        </div>
        <div className="bg-black h-[0.06rem] w-full"></div>
        <div className="flex flex-col justify-start items-start gap-[2.5rem] w-full">
          <div className="flex flex-row justify-start items-start gap-[1.7rem]">
            <p className="font-semibold text-[2rem]">Komentar</p>
            <div className="w-[5rem] h-[3rem] flex flex-col justify-center items-center text-white bg-[#78D14D] rounded-full">
              <p className="text-[1.25rem]">2</p>
            </div>
          </div>
          <div className="w-full flex flex-col justify-start items-start gap-[3.75rem]">
            <div className="flex flex-row justify-start items-start gap-[2rem]">
              <div className="object-cover size-[4rem] overflow-clip rounded-full flex-shrink-0">
                <Image
                  src="/images/bayam.webp"
                  width={89}
                  height={89}
                  alt="bayam"
                  className="object-cover w-full h-full"
                  unoptimized
                ></Image>
              </div>
              <div className="flex flex-col justify-start items-start gap-[0.5rem]">
                <div className="flex flex-row justify-start items-start gap-[1.1rem]">
                  <p className="font-semibold">Bu Susi Marsidah</p>
                  <p>29 April 2025</p>
                </div>
                <p>
                  Terima kasih artikelnya, Pak Damairi! Saya ingin bertanya,
                  Pak. Cabai yang saya tanam sudah melewati masa panen, tetapi
                  masih terlihat hijau. Apakah itu normal, Pak?
                </p>
                <p className="font-semibold cursor-pointer">Balas</p>
              </div>
            </div>
            <div className="flex flex-row justify-start items-start gap-[2rem]">
              <div className="object-cover size-[4rem] overflow-clip rounded-full flex-shrink-0">
                <Image
                  src="/images/bayam.webp"
                  width={89}
                  height={89}
                  alt="bayam"
                  className="object-cover w-full h-full"
                  unoptimized
                ></Image>
              </div>
              <div className="flex flex-col justify-start items-start gap-[0.5rem]">
                <div className="flex flex-row justify-start items-start gap-[1.1rem]">
                  <p className="font-semibold">Bu Hasni</p>
                  <p>29 April 2025</p>
                </div>
                <p>
                  Terima kasih atas artikel yang sangat informatif, Pak Damairi.
                  Saya jadi lebih memahami betapa pentingnya menentukan waktu
                  panen jagung dengan tepat. Namun saya penasaran, menurut
                  pengalaman Bapak atau petani di lapangan, bagaimana cara
                  terbaik untuk mengatasi tantangan jika kondisi cuaca tidak
                  mendukung saat jagung sudah waktunya panen?
                </p>
                <p className="font-semibold cursor-pointer">Balas</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default UserArticleDetailMain;
