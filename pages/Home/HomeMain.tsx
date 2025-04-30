"use client";

import React from "react";
import { Brain } from "@phosphor-icons/react/dist/ssr";
import { Plant } from "@phosphor-icons/react/dist/ssr";
import { DropHalf } from "@phosphor-icons/react/dist/ssr";
import { Minus } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import SecondaryLabel from "@/components/label/SecondaryLabel";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import { useRouter } from "next/navigation";

const HomeMain = () => {
  const router = useRouter();

  return (
    <main>
      {/* About Section */}
      <section className="w-full h-[42.87rem] bg-[#FCF7F1]" id="about">
        <div className="px-[8.9rem] grid grid-cols-4 w-full h-full gap-[3.2rem]">
          <div className="col-span-2 h-full flex flex-col items-start justify-end">
            <Image
              src="/images/about-image.webp"
              width={602}
              height={541}
              alt="about"
              className=""
            ></Image>
          </div>
          <div className="flex flex-col justify-center items-start h-full col-span-2">
            <div className="flex flex-col justify-center items-start gap-[1.1rem]">
              <div className="flex flex-col justify-center items-start">
                <SecondaryLabel></SecondaryLabel>
                <p className="text-[3rem] text-black font-bold leading-[4.5rem]">
                  Inovasi Cerdas untuk Pertanian{" "}
                  <span className="text-[#50B34B]">Berkelanjutan</span>
                </p>
                <p className="text-[1.25rem] tracking-wide leading-[1.8rem]">
                  KawanTani adalah aplikasi yang membantu petani memantau dan
                  mengelola tanaman secara real-time, meningkatkan efisiensi,
                  dan memastikan hasil panen yang optimal setiap musim
                </p>
              </div>
              <PrimaryButton
                textColor="#ffffff"
                onClickHandler={() => {
                  router.push("/#feature");
                }}
              >
                Lihat Fitur
              </PrimaryButton>
            </div>
          </div>
        </div>
      </section>
      {/* Tracking Section */}
      <section className="w-full h-[42.87rem] bg-white" id="feature">
        <div className="px-[8.9rem] grid grid-cols-4 w-full h-full gap-[3.2rem]">
          <div className="flex flex-col justify-center items-start h-full col-span-2">
            <div className="flex flex-col justify-center items-start gap-[1.1rem]">
              <div className="flex flex-col justify-center items-start">
                <SecondaryLabel></SecondaryLabel>
                <p className="text-[3rem] text-black font-bold leading-[4.5rem]">
                  Pantau Pertumbuhan{" "}
                  <span className="text-[#50B34B]">Tanaman</span> Secara Berkala
                </p>
                <p className="text-[1.25rem] tracking-wide leading-[1.8rem]">
                  Pantau tanamanmu dalam{" "}
                  <span className="text-[#50B34B]">tiga</span> tahapan:
                </p>
              </div>
              <div className="flex flex-col justify-start items-start gap-[1.9rem]">
                <div className="flex flex-row justify-start items-start gap-[0.75rem]">
                  <Brain size={50} color="#50B34B" />
                  <p className="text-[1.25rem]">
                    <span className="text-[#50B34B]">Tentukan tanaman</span>,
                    Pahami kebutuhan tanaman, seperti cahaya dan suhu yang
                    sesuai.
                  </p>
                </div>
                <div className="flex flex-row justify-start items-start gap-[0.75rem]">
                  <Plant size={50} color="#50B34B" />
                  <p className="text-[1.25rem]">
                    <span className="text-[#50B34B]">Pilih Tanaman</span>, Pilih
                    tanaman yang cocok dengan lingkungan dan beli dari sumber
                    terpercaya.
                  </p>
                </div>
                <div className="flex flex-row justify-start items-start gap-[0.75rem]">
                  <DropHalf size={50} color="#50B34B" />
                  <p className="text-[1.25rem]">
                    <span className="text-[#50B34B]">Rawat Secara Berkala</span>
                    , Siram, pupuk, pangkas, dan cek hama secara rutin.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-2 h-full flex flex-col items-start justify-end">
            <Image
              src="/images/tracking-image.webp"
              width={870}
              height={870}
              alt="about"
              className=""
            ></Image>
          </div>
        </div>
      </section>
      {/* Article */}
      <section className="w-full h-[42.87rem] bg-[#FCF7F1]">
        <div className="px-[8.9rem] grid grid-cols-4 w-full h-full gap-[3.2rem]">
          <div className="col-span-2 h-full flex flex-col items-start justify-end">
            <Image
              src="/images/article-image.webp"
              width={770}
              height={770}
              alt="about"
              className=""
            ></Image>
          </div>
          <div className="flex flex-col justify-center items-start h-full col-span-2">
            <div className="flex flex-col justify-center items-start gap-[1.1rem]">
              <div className="flex flex-col justify-center items-start">
                <SecondaryLabel></SecondaryLabel>
                <p className="text-[3rem] text-black font-bold leading-[4.5rem]">
                  Untuk Pertanianmu, Dapatkan{" "}
                  <span className="text-[#50B34B]">Tips</span> Berkualitas!
                </p>
                <p className="text-[1.25rem] tracking-wide leading-[1.8rem]">
                  Fitur <span className="text-[#50B34B]">artikel</span> kami
                  menyajikan tips praktis, teknik perawatan tanaman, dan
                  informasi terbaru seputar dunia pertanian untuk membantu Anda
                  meraih hasil terbaik.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Workshop Section */}
      <section className="w-full h-[42.87rem] bg-white">
        <div className="grid grid-cols-13 w-full h-full gap-[3.2rem]">
          <div className="col-span-4 flex flex-col justify-end items-end h-full">
            <Image
              src="/images/workshop-image-1.webp"
              width={793}
              height={602}
              alt="workshop"
            ></Image>
          </div>
          <div className="col-span-5">
            <div className="flex flex-col justify-center items-center text-center h-full">
              <SecondaryLabel></SecondaryLabel>
              <p className="text-[3rem] text-black font-bold leading-[4.5rem]">
                Belajar Langsung Tingkatkan{" "}
                <span className="text-[#50B34B]">Keahlian</span> Pertanianmu!
              </p>
              <p className="text-[1.25rem] tracking-wide leading-[1.8rem]">
                Fitur <span className="text-[#50B34B]">workshop</span> kami
                menawarkan kesempatan untuk belajar langsung dari ahli pertanian
                melalui sesi praktis, pelatihan, dan diskusi yang dirancang
                untuk meningkatkan keterampilan dan pengetahuan Anda dalam dunia
                pertanian.
              </p>
            </div>
          </div>
          <div className="col-span-4 flex flex-col justify-end items-end h-full">
            <Image
              src="/images/workshop-image-2.webp"
              width={500}
              height={500}
              alt="workshop"
            ></Image>
          </div>
        </div>
      </section>
      {/* FAQ Section */}
      <section className="w-full h-[48rem] bg-[#FCF7F1] py-[4.5rem] px-[11.8rem] ">
        <div className="flex flex-col justify-center items-center h-full gap-[3.6rem]">
          <div className="w-full flex flex-col justify-center items-center">
            <SecondaryLabel></SecondaryLabel>
            <p className="text-[3rem] text-black font-bold leading-[4.5rem] text-center">
              Frequently Asked <br />
              <span className="text-[#50B34B]">Questions</span>
            </p>
          </div>
          <div className="h-full grid grid-cols-2 w-full gap-[11rem]">
            <div className="col-span-1 flex flex-col justify-between items-start w-full gap-[2rem]">
              <div className="flex flex-col justify-start items-start gap-[1.0rem]">
                <div className="flex flex-row justify-start items-start gap-[1.3rem]">
                  <Minus size={32} color="#50B34B" weight="bold" />
                  <h1 className="font-bold text-[1.1rem]">
                    Apa yang harus dilakukan jika saya lupa kata sandi akun
                    saya?
                  </h1>
                </div>
                <p className="text-[1.25rem] font-light">
                  Jika Anda lupa kata sandi, klik "Lupa kata sandi" pada halaman
                  login dan ikuti instruksi untuk mereset kata sandi melalui
                  email yang terdaftar.
                </p>
              </div>
              <div className="flex flex-col justify-start items-start gap-[1.0rem]">
                <div className="flex flex-row justify-start items-start gap-[1.3rem]">
                  <Minus size={32} color="#50B34B" weight="bold" />
                  <h1 className="font-bold text-[1.1rem]">
                    Dapatkah saya menggunakan aplikasi ini untuk pertanian skala
                    besar?
                  </h1>
                </div>
                <p className="text-[1.25rem] font-light">
                  Aplikasi ini dirancang untuk membantu pertanian baik di skala
                  kecil maupun besar, memberikan tips dan solusi yang dapat
                  disesuaikan dengan kebutuhan berbagai jenis petani.
                </p>
              </div>
            </div>
            <div className="col-span-1 flex flex-col justify-between items-end w-full gap-[2rem]">
              <div className="flex flex-col justify-start items-start gap-[1.0rem]">
                <div className="flex flex-row justify-start items-start gap-[1.3rem]">
                  <Minus size={32} color="#50B34B" weight="bold" />
                  <h1 className="font-bold text-[1.1rem]">
                    Apa yang harus dilakukan jika saya lupa kata sandi akun
                    saya?
                  </h1>
                </div>
                <p className="text-[1.25rem] font-light">
                  Jika Anda lupa kata sandi, klik "Lupa kata sandi" pada halaman
                  login dan ikuti instruksi untuk mereset kata sandi melalui
                  email yang terdaftar.
                </p>
              </div>
              <div className="flex flex-col justify-start items-start gap-[1.0rem]">
                <div className="flex flex-row justify-start items-start gap-[1.3rem]">
                  <Minus size={32} color="#50B34B" weight="bold" />
                  <h1 className="font-bold text-[1.1rem]">
                    Dapatkah saya menggunakan aplikasi ini untuk pertanian skala
                    besar?
                  </h1>
                </div>
                <p className="text-[1.25rem] font-light">
                  Aplikasi ini dirancang untuk membantu pertanian baik di skala
                  kecil maupun besar, memberikan tips dan solusi yang dapat
                  disesuaikan dengan kebutuhan berbagai jenis petani.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default HomeMain;
