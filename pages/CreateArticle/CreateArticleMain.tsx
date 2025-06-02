"use client";

import React, { useState } from "react";
import DashboardNavbar from "@/components/navbar/DashboardNavbar";
import MainLabel from "@/components/label/MainLabel";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "@phosphor-icons/react";
import { createArticle } from "@/api/articleApi";
import { getToken } from "@/api/authApi";

const CreateArticleMain = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    category: "1",
    articleStatus: "DRAFT",
    image: null as File | null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({
        ...prev,
        image: e.target.files![0]
      }));
    }
  };

  const handleSubmit = async (status: "DRAFT" | "PUBLISHED") => {
    setIsLoading(true);
    setError("");

    try {
      // Validasi manual
      if (!formData.title || !formData.description || !formData.content || !formData.image) {
        throw new Error("Semua field wajib diisi!");
      }

      const token = getToken();
      if (!token) {
        throw new Error("Token tidak ditemukan. Silakan login ulang.");
      }

      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("content", formData.content);
      data.append("category", formData.category);
      data.append("articleStatus", status);
      data.append("image", formData.image as File);

      console.log("Sending data:");
      for (let [key, value] of data.entries()) {
        console.log(key, value);
      }

      const response = await createArticle(data);
      console.log("Response:", response);

      // FIX: Perbaiki validasi response
      // Backend mengembalikan response dengan struktur { message, data }
      // Jika sukses, response akan ada, jika error akan di-catch
      if (response && response.data) {
        console.log("Article created successfully:", response.data);
        router.push("/dashboard/articles");
      } else {
        throw new Error(response?.message || "Gagal membuat artikel");
      }

    } catch (err: any) {
      console.error("Error saat submit:", err);

      // Handle error dari backend
      if (err.response && err.response.data) {
        setError(err.response.data.message || "Terjadi kesalahan saat membuat artikel");
      } else {
        setError(err.message || "Terjadi kesalahan saat membuat artikel");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="py-[5rem] px-[9.6rem]">
      <section className="w-full">
        <div
          className="w-full flex flex-row justify-start items-center gap-[1rem] mb-[2.3rem] cursor-pointer"
          onClick={() => {
            router.back();
          }}
        >
          <ArrowLeft
            size={24}
            color="#000000"
            weight="bold"
            className="cursor-pointer"
          />
          <p className="cursor-pointer">Kembali</p>
        </div>
      </section>

      {/* Section Form */}
      <section className="w-full">
        <div className="w-full flex flex-col justify-start items-start">
          <h1 className="text-[2.5rem] font-semibold mb-[2.5rem]">
            Tulis Artikel
          </h1>

          {error && (
            <div className="w-full mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <form className="w-full flex flex-col justify-start items-start gap-[4rem]">
            <div className="flex flex-row justify-start items-center gap-[1.6rem]">
              <h1 className="text-[1.5rem] font-semibold">Kategori Artikel*</h1>
              <div className="w-[23.25rem] h-[3.7rem] py-[0.8rem] bg-[#F2F2F2] rounded-lg px-[0.8rem] border border-black text-black flex flex-col justify-center items-center">
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full bg-transparent"
                >
                  <option value="1">Teknik Pertanian dan Produksi</option>
                  <option value="2">Pengendalian Hama dan Penyakit</option>
                  <option value="3">Peningkatan Kualitas Pertanian</option>
                  <option value="4">Teknologi Pertanian</option>
                  <option value="5">Manajemen dan Bisnis Pertanian</option>
                </select>
              </div>
            </div>

            {/* Judul */}
            <div className="flex flex-row justify-start items-center gap-[1.6rem]">
              <h1 className="text-[1.5rem] font-semibold">Judul*</h1>
              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-[25.25rem] h-[3.7rem] py-[0.8rem] bg-[#F2F2F2] rounded-lg px-[0.8rem] border border-black text-black"
                type="text"
                placeholder="Masukkan judul artikel"
              />
            </div>

            {/* Deskripsi */}
            <div className="flex flex-row justify-start items-start gap-[1.6rem]">
              <h1 className="text-[1.5rem] font-semibold">Deskripsi*</h1>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-[50rem] h-[10rem] py-[0.8rem] bg-[#F2F2F2] rounded-lg px-[0.8rem] border border-black text-black resize-none"
                placeholder="Masukkan deskripsi artikel"
              />
            </div>

            {/* Isi Artikel */}
            <div className="flex flex-col justify-start items-start gap-[1.6rem] w-full">
              <h1 className="text-[1.5rem] font-semibold">Isi Artikel*</h1>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                className="w-full h-[32.8rem] py-[0.8rem] bg-[#F2F2F2] rounded-lg px-[0.8rem] border border-black text-black resize-none"
                placeholder="Tulis isi artikel di sini..."
              />
            </div>

            {/* Foto Artikel */}
            <div className="flex flex-row justify-start items-start w-full gap-[1rem]">
              <p className="text-[1.5rem] font-semibold">Foto Artikel*</p>
              <div className="flex flex-col justify-start items-start">
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="w-full bg-[#F2F2F2] rounded-lg py-[1.1rem] px-[1.1rem] border border-black"
                  accept="image/*"
                />
                <p className="text-gray-600 text-sm mt-1">
                  SVG, PNG, JPG or GIF (MAX. 800x400px).
                </p>
                {formData.image && (
                  <p className="text-green-600 text-sm mt-1">
                    File dipilih: {formData.image.name}
                  </p>
                )}
              </div>
            </div>

            {/* Tombol Aksi */}
            <div className="flex flex-row justify-start items-start gap-[2rem]">
              <PrimaryButton
                textColor="#ffffff"
                onClickHandler={(e: any) => {
                  e.preventDefault();
                  handleSubmit("DRAFT");
                }}
                disabled={isLoading}
              >
                {isLoading ? "Menyimpan..." : "Simpan Sebagai Draft"}
              </PrimaryButton>
              <PrimaryButton
                textColor="#ffffff"
                onClickHandler={(e: any) => {
                  e.preventDefault();
                  handleSubmit("PUBLISHED");
                }}
                disabled={isLoading}
              >
                {isLoading ? "Mempublish..." : "Publish Artikel"}
              </PrimaryButton>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
};

export default CreateArticleMain;