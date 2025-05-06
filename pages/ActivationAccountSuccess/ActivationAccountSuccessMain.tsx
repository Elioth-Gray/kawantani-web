"use client";

import React from "react";
import ActionButton from "@/components/buttons/ActionButton";
import { useRouter } from "next/navigation";

const ActivationAccountSuccessMain = () => {
  const router = useRouter();

  const navigate = () => {
    router.push("/auth/login");
  };

  return (
    <section className="grid grid-cols-2 w-full h-screen">
      <div className="col-span-1 w-full h-screen overflow-y-auto flex flex-col justify-start items-center py-[6.3rem]">
        {/* Register Form */}
        <div className="flex flex-col justify-center h-full items-start w-[23.25rem] gap-[2.8rem]">
          <div className="w-full">
            <h1 className="text-[2.25rem] font-semibold">Aktivasi Berhasil!</h1>
            <p className="mt-[0.5rem] text[1.25rem] font-light w-full">
              Selamat akun anda berhasil diaktivasi, anda sekarang dapat memakai
              fitur kami dengan measuk ke akun yang telah anda daftarkan!
            </p>
          </div>
          <div className="flex flex-col justify-start items-center gap-[1.6rem] w-full">
            <ActionButton
              textColor="#ffff"
              height="3.75rem"
              size="1.2rem"
              width="100%"
              onClickHandler={navigate}
            >
              Masuk Akun
            </ActionButton>
          </div>
        </div>
      </div>
      <div className="login-image col-span-1 w-full h-[100%]"></div>
    </section>
  );
};

export default ActivationAccountSuccessMain;
