import React from "react";
import Navbar from "@/components/navbar/Navbar";
import SecondaryLabel from "@/components/label/SecondaryLabel";

const ArticleHeader = () => {
  return (
    <header>
      <section className="article-header w-full flex flex-col justify-start items-start overflow-hidden h-screen">
        <div className="w-full h-full backdrop-blur-[0.3rem]">
          <section className="px-[9rem] py-[2rem] w-full h-full flex flex-col justify-start gap-[8rem]">
            <Navbar></Navbar>
            <div className="text-white w-full flex flex-col justify-center items-center text-center">
              <div className="w-[60%] flex flex-col justify-center items-center gap-[0.8rem]">
                <SecondaryLabel></SecondaryLabel>
                <h1 className="font-bold text-[3rem]">
                  Baca Apa <br />
                  <span className="text-[#50B34B]">Hari Ini?</span>
                </h1>
                <p className="text-[1.5rem] mt-1">
                Temukan artikel harian yang membantu meningkatkan keterampilan bertani, merawat tanaman, dan mengikuti perkembangan terbaru di sektor pertanian.
                </p>
              </div>
            </div>
          </section>
        </div>
      </section>
    </header>
  );
};

export default ArticleHeader;
