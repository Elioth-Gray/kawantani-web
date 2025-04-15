"use client";

import React from "react";
import Image from "next/image";
import { Calendar, Timer, MapPin } from "@phosphor-icons/react/dist/ssr";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import { useRouter, usePathname } from "next/navigation";

const WorkshopDetailMain = () => {
  const router = useRouter();
  const pathname = usePathname();

  const regist = () => {
    router.push(`${pathname}/registration`);
  };

  return (
    <main className="px-[8.1rem] py-[5.3rem]">
      {/* CCard Section */}
      <section>
        <div className="w-full h-full grid grid-cols-2 gap-x-[2.8rem]">
          <div className="w-full h-[19.8rem] object-cover overflow-hidden rounded-lg col-span-1">
            <Image
              className=" object-cover w-full h-full"
              width={545}
              height={307}
              src="/images/workshop-image.jpg"
              alt="cabai"
              quality={100}
              unoptimized
            ></Image>
          </div>
          <div className="flex flex-col justify-between items-start">
            <h1 className="text-[1.5rem] font-semibold w-[70%]">
              Teknik Tanam Padi Untuk Keberlanjutan Pangan Jawa Tengah
            </h1>
            <div className="flex flex-col justify-start items-start gap-[0.9rem]">
              <div className="flex flex-row justify-start items-center gap-[0.75rem]">
                <Calendar size={26} color="#000000" />
                <p className="text-[0.75rem]">Jumat, 15 Februari 2025</p>
              </div>
              <div className="flex flex-row justify-start items-center gap-[0.75rem]">
                <MapPin size={26} color="#000000" />
                <p className="text-[0.75rem]">Mojokerto, Jawa Timur</p>
              </div>
              <div className="flex flex-row justify-start items-center gap-[0.75rem]">
                <Timer size={26} color="#000000" />
                <p className="text-[0.75rem]">07.00 - 15.00 WIB</p>
              </div>
            </div>
            <PrimaryButton textColor="#ffffff" onClickHandler={regist}>
              Daftar Workshop
            </PrimaryButton>
          </div>
        </div>
      </section>
      {/* Description Section */}
      <section className="grid grid-cols-2 justify-between items-start gap-3 mt-[2.8rem]">
        <div className="flex flex-col justify-start items-start gap-[1.3rem] col-span-1  w-full h-full  ">
          <h1 className="text-[2rem] font-bold">Deskripsi</h1>
          <p className="text-[1.1rem]">
            Workshop "Teknik Tanam Padi" adalah sebuah acara yang dirancang
            untuk memberikan pelatihan dan pengetahuan kepada para petani atau
            praktisi pertanian tentang teknik-teknik terbaru dalam meningkatkan
            hasil produksi padi. Dalam workshop ini, peserta akan mempelajari
            berbagai metode inovatif untuk meningkatkan efisiensi dan
            produktivitas lahan pertanian padi, termasuk teknik pengelolaan air
            yang tepat, pemilihan varietas padi unggul, penggunaan pupuk yang
            efektif, serta pengendalian hama dan penyakit secara ramah
            lingkungan.
          </p>
        </div>
        <div className="flex flex-col justify-start items-start gap-[1.3rem] col-span-1 w-full h-full">
          <h1 className="text-[2rem] font-bold">Lokasi</h1>
          <div className="w-full h-full">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.2219901290355!2d-74.00369368400567!3d40.71277447933185!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25a47df06b185%3A0xc80f9cfce5383d5d!2sBrooklyn%20Bridge!5e0!3m2!1sen!2sus!4v1586548183327!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Google Maps"
              aria-label="Location map"
              className="w-full h-full"
            />
          </div>
        </div>
      </section>
    </main>
  );
};

export default WorkshopDetailMain;
