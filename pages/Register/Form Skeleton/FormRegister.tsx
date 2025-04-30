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
  const [formData, setFormData] = useState<{
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    dateOfBirth: string;
    gender: 0 | 1 | null;
    password: string;
    confirmPassword: string;
  }>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    dateOfBirth: "",
    gender: null,
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: any) => {
    const { name, value } = e?.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const selectGender = (gender: 0 | 1) => {
    setFormData((prev) => ({ ...prev, gender }));
  };

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
            <div className="w-full flex flex-col justify-start items-start gap-[0.5rem]">
              <h1 className="text-[1.2rem] font-semibold">Nama Depan</h1>
              <InputField
                placeholder="John"
                type="text"
                value={formData.firstName}
                name="firstName"
                onChange={handleChange}
              >
                <User
                  size={26}
                  color="#727272"
                  weight="bold"
                  className="absolute left-[1.5rem]"
                />
              </InputField>
            </div>
            <div className="w-full flex flex-col justify-start items-start gap-[0.5rem]">
              <h1 className="text-[1.2rem] font-semibold">Nama Belakang</h1>
              <InputField
                placeholder="Doe"
                type="text"
                value={formData.lastName}
                name="lastName"
                onChange={handleChange}
              >
                <User
                  size={26}
                  color="#727272"
                  weight="bold"
                  className="absolute left-[1.5rem]"
                />
              </InputField>
            </div>
            <div className="w-full flex flex-col justify-start items-start gap-[0.5rem]">
              <h1 className="text-[1.2rem] font-semibold">Email</h1>
              <InputField
                placeholder="johndoe@mail.com"
                type="text"
                value={formData.email}
                name="email"
                onChange={handleChange}
              >
                <Envelope
                  size={26}
                  color="#727272"
                  weight="bold"
                  className="absolute left-[1.5rem]"
                />
              </InputField>
            </div>
            <div className="w-full flex flex-col justify-start items-start gap-[0.5rem]">
              <h1 className="text-[1.2rem] font-semibold">Nomor Telepon</h1>
              <InputField
                placeholder="+61812345678"
                type="text"
                value={formData.phoneNumber}
                name="phoneNumber"
                onChange={handleChange}
              >
                <Phone
                  size={26}
                  color="#727272"
                  weight="bold"
                  className="absolute left-[1.5rem]"
                />
              </InputField>
            </div>
            <div className="w-full flex flex-col justify-start items-start gap-[0.5rem]">
              <h1 className="text-[1.2rem] font-semibold">Tanggal Lahir</h1>
              <InputField
                placeholder="11-04-2005"
                type="date"
                value={formData.dateOfBirth}
                name="dateOfBirth"
                onChange={handleChange}
              >
                <Phone
                  size={26}
                  color="#727272"
                  weight="bold"
                  className="absolute left-[1.5rem]"
                />
              </InputField>
            </div>
            <div className="w-full flex flex-col justify-start items-start gap-[0.5rem]">
              <h1 className="text-[1.2rem] font-semibold">Jenis Kelamin</h1>
              <div className="grid grid-cols-2 items-center w-full gap-[0.75rem]">
                <button
                  type="button"
                  onClick={() => selectGender(0)}
                  className={`flex items-center justify-center gap-2 py-4 px-4 rounded-lg border ${
                    formData.gender === 0
                      ? "border-2 border-blue-500 bg-blue-50 text-blue-700"
                      : "border border-gray-300 hover:border-gray-400"
                  } transition-all duration-200 font-medium cursor-pointer`}
                >
                  Laki-Laki
                </button>
                <button
                  type="button"
                  onClick={() => selectGender(1)}
                  className={`flex items-center justify-center gap-2 py-4 px-4 rounded-lg border ${
                    formData.gender === 1
                      ? "border-2 border-pink-500 bg-pink-50 text-pink-700"
                      : "border border-gray-300 hover:border-gray-400"
                  } transition-all duration-200 font-medium cursor-pointer`}
                >
                  Perempuan
                </button>
              </div>
            </div>
          </>
        ) : currentSection === 1 ? (
          <div className="flex flex-col justify-start items-start w-full gap-[1rem]">
            <h1 className="text-[1.2rem] font-semibold">Upload Foto</h1>
            <input
              type="file"
              className="w-full bg-[#F2F2F2] rounded-lg py-[1.1rem] px-[1.1rem]"
            />
            <p className="text-black">SVG, PNG, JPG or GIF (MAX. 800x400px).</p>
          </div>
        ) : (
          <>
            <div className="w-full flex flex-col justify-start items-start gap-[0.5rem]">
              <h1 className="text-[1.2rem] font-semibold">Password</h1>
              <InputField
                placeholder="Password"
                type="password"
                value={formData.password}
                name="password"
                onChange={handleChange}
              >
                <Lock
                  size={26}
                  color="#727272"
                  weight="bold"
                  className="absolute left-[1.5rem]"
                />
              </InputField>
            </div>
            <div className="w-full flex flex-col justify-start items-start gap-[0.5rem]">
              <h1 className="text-[1.2rem] font-semibold">
                Konfirmasi Password
              </h1>
              <InputField
                placeholder="Password"
                type="password"
                value={formData.confirmPassword}
                name="confirmPassword"
                onChange={handleChange}
              >
                <Lock
                  size={26}
                  color="#727272"
                  weight="bold"
                  className="absolute left-[1.5rem]"
                />
              </InputField>
            </div>
          </>
        )}
        <div className="w-full flex flex-col justify-center items-center gap-[1rem]">
          {currentSection < 2 ? (
            <ActionButton
              textColor="#ffff"
              height="3.75rem"
              size="1.2rem"
              width="100%"
              onClickHandler={nextSection}
            >
              Selanjutnya
            </ActionButton>
          ) : (
            <ActionButton
              textColor="#ffff"
              height="3.75rem"
              size="1.2rem"
              width="100%"
              onClickHandler={(e: any) => {
                e.preventDefault();
                console.log(formData);
              }}
            >
              Daftar Akun
            </ActionButton>
          )}
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
