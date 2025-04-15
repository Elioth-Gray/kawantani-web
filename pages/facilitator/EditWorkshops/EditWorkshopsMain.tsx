"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";

import { useRouter } from "next/navigation";

const EditWorkshopsMain = () => {
  const router = useRouter();
  return (
    <main className="w-full h-screen px-[5.1rem] bg-[#09090B] text-white overflow-auto">
      <section className="w-full h-fit my-[4.5rem] mb-[4.5rem]">
        <section className="w-full">
          <div
            className="w-full flex flex-row justify-start items-center gap-[1rem] mb-[2.3rem] cursor-pointers"
            onClick={() => {
              router.back();
            }}
          >
            <ArrowLeft
              size={24}
              color="#fff"
              weight="bold"
              className="cursor-pointer"
            />
            <p className="cursor-pointer">Kembali</p>
          </div>
        </section>
        <div className="w-full mb-[3.1rem]">
          <h1 className="text-[2.25rem] font-semibold">Buat Workshop</h1>
          <p>Mulai buat workshop untuk memberi pengetahuan kepada orang lain</p>
        </div>
        <div className="w-full">
          <form action="" className="w-full">
            <div className="w-full flex flex-col justify-start items-start gap-[2.1rem]">
              <div className="flex flex-row justify-start items-start gap-[3.5rem]">
                <div className="flex flex-col justify-start items-start gap-[0.6rem]">
                  <Label className="text-[1.25rem]">Judul Workshop</Label>
                  <Input
                    defaultValue="Teknik Tanam Padi Untuk Keberlanjutan Pangan Jawa Tengah"
                    placeholder="Judul Workshop"
                    className="w-[20rem] h-[2.5rem]"
                  ></Input>
                </div>
                <div className="flex flex-col justify-start items-start gap-[0.6rem]">
                  <Label className="text-[1.25rem]">
                    Rangkaian Kegiatan (SpreadSheet)
                  </Label>
                  <Input
                    placeholder="Tanggal Workshop"
                    className="w-[20rem] h-[2.5rem] text-white"
                    type="file"
                  ></Input>
                </div>
              </div>
              <div className="flex flex-row justify-start items-start gap-[3.5rem]">
                <div className="flex flex-col justify-start items-start gap-[0.6rem]">
                  <Label className="text-[1.25rem]">Tanggal Workshop</Label>
                  <Input
                    placeholder="Tanggal Workshop"
                    className="w-[20rem] h-[2.5rem]"
                    defaultValue="Jumat, 15 Februari 2025"
                  ></Input>
                </div>
                <div className="flex flex-col justify-start items-start gap-[0.6rem]">
                  <Label className="text-[1.25rem]">Poster Workshop</Label>
                  <Input
                    className="w-[20rem] h-[2.5rem] text-white"
                    type="file"
                  ></Input>
                </div>
              </div>
              <div className="flex flex-row justify-start items-start gap-[3.5rem]">
                <div className="flex flex-col justify-start items-start gap-[0.6rem]">
                  <Label className="text-[1.25rem]">Waktu Workshop</Label>
                  <Input
                    placeholder="Waktu Workshop"
                    className="w-[20rem] h-[2.5rem]"
                    defaultValue="07.00 - 15.00 WIB"
                  ></Input>
                </div>
              </div>
              <div className="flex flex-row justify-start items-start gap-[3.5rem]">
                <div className="flex flex-col justify-start items-start gap-[0.6rem]">
                  <Label className="text-[1.25rem]">Deskripsi Workshop</Label>
                  <Textarea
                    placeholder="Deskripsi Workshop"
                    className="w-[44.5rem] h-[10rem]"
                    defaultValue="Workshop Teknik Genjot Padi adalah sebuah acara yang dirancang untuk memberikan pelatihan dan pengetahuan kepada para petani atau praktisi pertanian tentang teknik-teknik terbaru dalam meningkatkan hasil produksi padi. Dalam workshop ini, peserta akan mempelajari berbagai metode inovatif untuk meningkatkan efisiensi dan produktivitas lahan pertanian padi, termasuk teknik pengelolaan air yang tepat, pemilihan varietas padi unggul, penggunaan pupuk yang efektif, serta pengendalian hama dan penyakit secara ramah lingkungan."
                  ></Textarea>
                </div>
              </div>
              <div className="flex flex-row justify-start items-start gap-[0.5rem] w-[44.5rem]">
                <Checkbox id="terms" />
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Dengan ini saya menyatakan bahwa data workshop yang saya isi
                  merupakan benar apa adanya dan siap menerima sanksi jika
                  terdapat kesalahan dan ketidaksesuaian dalam pengisisan data
                </label>
              </div>
              <button className="py-[0.5rem] px-[0.8rem] flex flex-row justify-center items-center bg-white text-black rounded-lg gap-[0.5rem] cursor-pointer">
                <p className="font-semibold">Simpan Perubahan dan Ajukan</p>
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
};

export default EditWorkshopsMain;
