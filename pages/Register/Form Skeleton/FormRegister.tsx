"use client";

import React, { useState, useEffect } from "react";
import ActionButton from "@/components/buttons/ActionButton";
import {
  Envelope,
  User,
  Phone,
  GenderMale,
  GenderFemale,
  Lock,
} from "@phosphor-icons/react/dist/ssr";
import InputField from "@/components/form/InputField";
import PrimaryLink from "@/components/links/PrimaryLink";
import SecondaryButton from "@/components/buttons/SecondaryButton";

const FormRegister = () => {
  const [currentSection, setSection] = useState(0);

  const nextSection = (e: any) => {
    e.preventDefault();
    setSection((prevSection) => prevSection + 1);
  };

  const backSection = (e: any) => {
    e.preventDefault();
    setSection((prevSection) => prevSection - 1);
  };

  useEffect(() => {
    console.log(currentSection);
  }, [currentSection]);

  return (
    <div className="w-full">
      <form
        action=""
        className="w-full flex flex-col justify-center items-start gap-[1.5rem]"
      >
        {currentSection === 0 ? (
          <>
            <InputField placeholder="Nama Depan" type="text">
              <User
                size={26}
                color="#727272"
                weight="bold"
                className="absolute left-[1.5rem]"
              />
            </InputField>
            <InputField placeholder="Nama Belakang" type="text">
              <User
                size={26}
                color="#727272"
                weight="bold"
                className="absolute left-[1.5rem]"
              />
            </InputField>
            <InputField placeholder="Email" type="email">
              <Envelope
                size={26}
                color="#727272"
                weight="bold"
                className="absolute left-[1.5rem]"
              />
            </InputField>
            <InputField placeholder="Nomor Telepon" type="text">
              <Phone
                size={26}
                color="#727272"
                weight="bold"
                className="absolute left-[1.5rem]"
              />
            </InputField>
            <div className="grid grid-cols-2 items-center w-full gap-[0.75rem]">
              <button
                type="button"
                className="col-span-1 py-[0.75rem] rounded-lg flex flex-row justify-center items-center gap-[1.3rem] bg-[#F2F2F2] cursor-pointer text-[1rem] text-[#4993FA]"
              >
                <GenderMale
                  size={20}
                  color="#4993FA"
                  weight="bold"
                  className=""
                />
                Laki-Laki
              </button>
              <button
                type="button"
                className="col-span-1 py-[0.75rem] rounded-lg flex flex-row justify-center items-center gap-[1.3rem] bg-[#F2F2F2] cursor-pointer text-[1rem] text-[#FF7C7C]"
              >
                <GenderFemale
                  size={20}
                  color="#FF7C7C"
                  weight="bold"
                  className=""
                />
                Perempuan
              </button>
            </div>
          </>
        ) : currentSection === 1 ? (
          <div className="flex flex-col justify-start items-start w-full gap-[1rem]">
            <p>Upload Foto</p>
            <input
              type="file"
              className="w-full bg-[#F2F2F2] rounded-lg py-[1.1rem] px-[1.1rem]"
            />
            <p className="text-black">SVG, PNG, JPG or GIF (MAX. 800x400px).</p>
          </div>
        ) : (
          <>
            <InputField placeholder="Password" type="password">
              <Lock
                size={26}
                color="#727272"
                weight="bold"
                className="absolute left-[1.5rem]"
              />
            </InputField>
            <InputField placeholder="Konfirmasi Password" type="password">
              <Lock
                size={26}
                color="#727272"
                weight="bold"
                className="absolute left-[1.5rem]"
              />
            </InputField>
          </>
        )}
        <div className="w-full flex flex-col justify-center items-center gap-[1rem]">
          <ActionButton
            textColor="#ffff"
            height="3.75rem"
            size="1.2rem"
            width="100%"
            onClickHandler={nextSection}
          >
            Selanjutnya
          </ActionButton>
          {currentSection > 0 ? (
            <SecondaryButton
              variant="black"
              width="100%"
              height="3.75rem"
              onClickHandler={backSection}
            >
              Kembali
            </SecondaryButton>
          ) : (
            <></>
          )}
        </div>
      </form>
    </div>
  );
};

export default FormRegister;
