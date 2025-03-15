import React from "react";
import Image from "next/image";
import ActionButton from "@/components/buttons/ActionButton";
import { Envelope, Lock } from "@phosphor-icons/react/dist/ssr";
import InputField from "@/components/form/InputField";
import PrimaryLink from "@/components/links/PrimaryLink";
import SecondaryLink from "@/components/links/SecondaryLink";

const LoginMain = () => {
  return (
    <section className="grid grid-cols-2 w-full h-screen">
      <div className="col-span-1 w-full h-full flex flex-col justify-center items-center">
        {/* Login Form */}
        <div className="flex flex-col justify-center items-start w-[23.25rem] gap-[2.8rem]">
          <Image
            src="/images/logo-dark.png"
            width={318}
            height={97}
            alt="logo"
          ></Image>
          <div className="flex flex-col justify-start items-center gap-[1.6rem] w-full">
            <div className="w-full">
              <h1 className="text-[2.25rem] font-semibold">Masuk</h1>
              <p className="mt-[0.5rem] text[1.25rem] font-light">
                Selamat datang kembali
              </p>
            </div>
            <div className="w-full">
              <form
                action=""
                className="w-full flex flex-col justify-center items-start gap-[1.5rem]"
              >
                <InputField placeholder="Email" type="email">
                  <Envelope
                    size={26}
                    color="#727272"
                    weight="bold"
                    className="absolute left-[1.5rem]"
                  />
                </InputField>
                <InputField placeholder="password" type="password">
                  {" "}
                  <Lock
                    size={26}
                    color="#727272"
                    weight="bold"
                    className="absolute left-[1.5rem]"
                  />
                </InputField>
                <div className="flex flex-row justify-end items-center w-full text-end">
                  <SecondaryLink>Lupa Password</SecondaryLink>
                </div>
                <ActionButton
                  textColor="#ffff"
                  height="3.75rem"
                  size="1.2rem"
                  width="100%"
                >
                  Masuk
                </ActionButton>
              </form>
            </div>
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
            Belum punya akun?{" "}
            <PrimaryLink href="/register">Buat akun</PrimaryLink>
          </p>
        </div>
      </div>
      <div className="login-image col-span-1 w-full h-full"></div>
    </section>
  );
};

export default LoginMain;
