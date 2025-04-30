import React from "react";
import Image from "next/image";
import PrimaryLink from "@/components/links/PrimaryLink";
import FormRegister from "@/pages/Register/Form Skeleton/FormRegister";

const RegisterMain = () => {
  return (
    <section className="grid grid-cols-2 w-full h-screen">
      <div className="col-span-1 w-full h-full flex flex-col justify-center items-center py-[6.3rem]">
        {/* Register Form */}
        <div className="flex flex-col justify-center items-start w-[23.25rem] gap-[2.8rem]">
          <div className="flex flex-col justify-start items-center gap-[1.6rem] w-full">
            <div className="w-full">
              <h1 className="text-[2.25rem] font-semibold">Daftar</h1>
              <p className="mt-[0.5rem] text[1.25rem] font-light w-full">
                Selamat datang, daftar akun untuk melanjutkan
              </p>
            </div>
            <FormRegister></FormRegister>
            <div className="grid grid-cols-3 gap-[0.6rem] justify-center items-center w-full">
              <div className="col-span-1 h-[0.1rem] w-full bg-black"></div>
              <div className="col-span-1 ">
                <p className="text-[0.9rem] font-semibold w-full">
                  Coba cara lain
                </p>
              </div>
              <div className="col-span-1 h-[0.1rem] w-full bg-black"></div>
            </div>
          </div>
          <p className="w-full text-center text-[#828282]">
            Sudah punya akun?{" "}
            <PrimaryLink href="/login">Masuk akun</PrimaryLink>
          </p>
        </div>
      </div>
      <div className="login-image col-span-1 w-full h-[100%]"></div>
    </section>
  );
};

export default RegisterMain;
