import React from "react";
import Image from "next/image";
import { Calendar, Timer, MapPin } from "@phosphor-icons/react/dist/ssr";
import PrimaryButton from "@/components/buttons/PrimaryButton";

const WorkshopDetailMain = () => {
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
              Teknik Genjot Padi Untuk Keberlanjutan Pangan Jawa Tengah
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
            <PrimaryButton textColor="#ffffff">Daftar Workshop</PrimaryButton>
          </div>
        </div>
      </section>
      {/* Description Section */}
      <section className="flex flex-row justify-between items-start gap-3">
        <section className="mt-[2.8rem]">
          <div className="flex flex-col justify-start items-start gap-[1.3rem]">
            <h1 className="text-[2rem] font-bold">Deskripsi</h1>
            <p className="text-[1.1rem]">
              Workshop "Teknik Genjot Padi" adalah sebuah acara yang dirancang
              untuk memberikan pelatihan dan pengetahuan kepada para petani atau
              praktisi pertanian tentang teknik-teknik terbaru dalam
              meningkatkan hasil produksi padi. Dalam workshop ini, peserta akan
              mempelajari berbagai metode inovatif untuk meningkatkan efisiensi
              dan produktivitas lahan pertanian padi, termasuk teknik
              pengelolaan air yang tepat, pemilihan varietas padi unggul,
              penggunaan pupuk yang efektif, serta pengendalian hama dan
              penyakit secara ramah lingkungan.
            </p>
          </div>
        </section>
        <section className="mt-[2.8rem]">
          <div className="flex flex-col justify-start items-start gap-[1.3rem]">
            <h1 className="text-[2rem] font-bold">Lokasi</h1>
            <p className="text-[1.1rem]">
              Workshop "Teknik Genjot Padi" adalah sebuah acara yang dirancang
              untuk memberikan pelatihan dan pengetahuan kepada para petani atau
              praktisi pertanian tentang teknik-teknik terbaru dalam
              meningkatkan hasil produksi padi. Dalam workshop ini, peserta akan
              mempelajari berbagai metode inovatif untuk meningkatkan efisiensi
              dan produktivitas lahan pertanian padi, termasuk teknik
              pengelolaan air yang tepat, pemilihan varietas padi unggul,
              penggunaan pupuk yang efektif, serta pengendalian hama dan
              penyakit secara ramah lingkungan.
            </p>
          </div>
        </section>
      </section>
    </main>
  );
};

export default WorkshopDetailMain;
