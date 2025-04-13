import PrimaryButton from "@/components/buttons/PrimaryButton";
import React from "react";
import Image from "next/image";

const ArticleDetailMain = () => {
  return (
    <main className="py-[6.4rem] px-[14rem]">
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
      {/* Image Section */}
      <section className="w-full flex flex-row justify-center items-center mb-[3.75rem]">
        <div className="w-full h-[29rem] overflow-clip object-cover rounded-xl">
          <Image
            src="/images/bayam.jpg"
            width={100}
            height={0}
            alt="bayam"
            className="w-full h-[29rem] object-cover"
            unoptimized
          ></Image>
        </div>
      </section>
      {/* Text Section */}
      <section className="w-full">
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
    </main>
  );
};

export default ArticleDetailMain;
