"use client";

import PrimaryButton from "@/components/buttons/PrimaryButton";
import React, { useState, useEffect } from "react";
import { unsaveArticle, saveArticle, getArticleById, checkArticleSaved } from "@/api/articleApi";
import Image from "next/image";
import {
  Bookmark,
  Star,
  Share,
  ArrowLeft,
} from "@phosphor-icons/react/dist/ssr";
import { useRouter, usePathname } from "next/navigation";

const ArticleDetailMain = () => {
  const [article, setArticle] = useState<any>(null);
  const [isLoading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  // Fungsi untuk mengecek status saved artikel
  const checkSavedStatus = async (articleId: string) => {
    try {
      const response = await checkArticleSaved({ id: articleId });
      setIsSaved(response?.data?.isSaved || false);
    } catch (error) {
      console.error("Error checking saved status:", error);
      setMessage("Gagal memeriksa status penyimpanan artikel");
    }
  };

  // Fungsi untuk handle save/unsave
  const toggleSave = async () => {
    if (!article) return;

    try {
      let response;
      if (isSaved) {
        response = await unsaveArticle({ id: article.id_artikel });
      } else {
        response = await saveArticle({ id: article.id_artikel });
      }

      if (response.success) {
        setIsSaved(!isSaved);
        setMessage(
          isSaved
            ? "Artikel dihapus dari simpan"
            : "Artikel disimpan"
        );
      } else {
        setMessage(response.message || "Gagal memproses permintaan");
        // If the error is about already being saved, update the state
        if (response.message.includes('sudah disimpan')) {
          setIsSaved(true);
        }
      }
    } catch (error) {
      console.error("Error toggling save:", error);
      setMessage("Terjadi kesalahan");
    } finally {
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    return new Date(dateString).toLocaleDateString("id-ID", options);
  };

  useEffect(() => {
    const fetchArticle = async () => {
      const segments = pathname.split("/");
      const articleId = segments[2];

      try {
        const response = await getArticleById(articleId);
        if (response && response.data) {
          setArticle(response.data);
          // Cek status saved setelah data artikel didapatkan
          await checkSavedStatus(articleId);
        }
      } catch (error) {
        console.error("Error fetching article:", error);
        setMessage("Gagal memuat artikel");
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [pathname]);

  if (isLoading) return <div className="text-center py-8">Memuat artikel...</div>;
  if (!article) return <div className="text-center py-8">Artikel tidak ditemukan.</div>;

  return (
    <main className="py-[6.4rem] px-[14rem]">
      {/* Message display */}
      {message && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-[#78D14D] text-white px-4 py-2 rounded-md shadow-lg z-50">
          {message}
        </div>
      )}

      {/* Tombol Kembali */}
      <section className="w-full">
        <div
          className="flex flex-row items-center gap-4 mb-8 cursor-pointer hover:text-[#78D14D] transition"
          onClick={() => router.back()}
        >
          <ArrowLeft size={24} weight="bold" />
          <p>Kembali</p>
        </div>
      </section>

      {/* Header */}
      <section className="flex flex-col items-center gap-4 mb-12 text-center">
        <div className="flex flex-row gap-4 items-center text-gray-600">
          <p>Diterbitkan {formatDate(article.tanggal_artikel)}</p>
          <div className="w-[1rem] h-[1rem] rounded-full bg-[#D9D9D9]"></div>
          <p>
            Oleh {article.pengguna?.nama_depan_pengguna}{" "}
            {article.pengguna?.nama_belakang_pengguna}
          </p>
        </div>
        <h1 className="text-3xl font-semibold">{article.judul_artikel}</h1>
        <p className="max-w-2xl text-gray-700">{article.deskripsi_artikel}</p>
        <PrimaryButton textColor="#ffffff" className="mt-4">
          {article.kategori?.nama_kategori_artikel || "Tanpa Kategori"}
        </PrimaryButton>
      </section>

      {/* Tombol Aksi */}
      <section className="mb-12 flex justify-center gap-6">
        <button
          onClick={toggleSave}
          aria-label={isSaved ? "Hapus dari simpan" : "Simpan artikel"}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition cursor-pointer ${isSaved
              ? "bg-[#78D14D] border-[#78D14D] text-white"
              : "border border-black hover:bg-[#78D14D] hover:border-[#78D14D]"
            }`}
        >
          <Bookmark size={24} weight={isSaved ? "fill" : "regular"} />
        </button>
        <button className="w-12 h-12 rounded-full border border-black flex items-center justify-center hover:bg-[#78D14D] hover:border-[#78D14D] transition">
          <Star size={24} />
        </button>
        <button className="w-12 h-12 rounded-full border border-black flex items-center justify-center hover:bg-[#78D14D] hover:border-[#78D14D] transition">
          <Share size={24} />
        </button>
      </section>

      {/* Gambar Artikel */}
      <section className="mb-12 flex justify-center">
        <div className="w-full h-[29rem] overflow-hidden rounded-xl shadow-lg">
          <Image
            src={`http://localhost:2000/uploads/articles/${article.gambar_artikel}`}
            alt={article.judul_artikel}
            width={1000}
            height={464}
            className="w-full h-full object-cover"
            priority
          />
        </div>
      </section>

      {/* Isi Artikel */}
      <section className="mb-12 text-lg leading-8 prose max-w-none">
        <div dangerouslySetInnerHTML={{ __html: article.isi_artikel }} />
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

export default ArticleDetailMain;