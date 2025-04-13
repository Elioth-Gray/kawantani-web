import React from "react";
import DashboardNavbar from "@/components/navbar/DashboardNavbar";
import MainLabel from "@/components/label/MainLabel";

const CreateArticleHeader = () => {
  return (
    <>
      <DashboardNavbar></DashboardNavbar>{" "}
      <section className="header-image w-full flex flex-col justify-start items-start overflow-hidden">
        <div className="w-full h-full backdrop-blur-[0.3rem]">
          <section className="px-[9rem] py-[6.4rem] w-full flex flex-col justify-start gap-[8rem]">
            <div className="text-white w-full flex flex-row justify-between items-start">
              <div className="flex flex-col justify-start items-start w-[40%] gap-[1.5rem]">
                <div className="w-full">
                  <h1 className="font-bold text-[3rem]">
                    Tulis Aritkelmu! <br />
                    <span className="text-[#50B34B]">Pilemon Barimbing</span>
                  </h1>
                  <p className="text-[1rem] mt-1">
                    Setiap langkah kecil di dunia pertanian dapat membawa
                    perubahan besar. Dengan dukungan dari kami, mari
                    bersama-sama menciptakan masa depan pertanian yang lebih
                    berkelanjutan dan menguntungkan!
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </section>
      <section className="bg-[#50B34B] h-[3.8rem] flex flex-row justify-between items-center text-white py-[2.4rem] px-[9.25rem] gap-[2rem]">
        <MainLabel title="Pantau Tanaman"></MainLabel>
        <MainLabel title="Bersama Petani"></MainLabel>
        <MainLabel title="Panen Maksimal"></MainLabel>
        <MainLabel title="Pertanian Cerdas"></MainLabel>
      </section>
    </>
  );
};

export default CreateArticleHeader;
