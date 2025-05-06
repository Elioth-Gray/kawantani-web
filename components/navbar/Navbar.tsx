"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import ActionButton from "../buttons/ActionButton";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useEffect } from "react";
import { User } from "@phosphor-icons/react/dist/ssr/User";
import { CaretDown } from "@phosphor-icons/react/dist/ssr";
import { Bell } from "@phosphor-icons/react/dist/ssr";

const Navbar = () => {
  const [isLogin, setIsLogin] = useState<string>("");

  useEffect(() => {
    setIsLogin(String(localStorage.getItem("token")));
  }, []);

  const router = useRouter();

  return (
    <nav className="flex flex-row justify-between items-center text-white w-full">
      <Image
        src="/images/logo.webp"
        width={181}
        height={58}
        alt="logo"
        className="cursor-pointer"
        onClick={() => {
          router.push("/");
        }}
      ></Image>
      <ul className="flex flex-row justify-center items-center gap-20 font-light text-[1rem]">
        <li className="hover:text-[#50B34B] transition-all duration-100 ease-in-out">
          <Link href="/">Beranda</Link>
        </li>
        <li className="hover:text-[#50B34B] transition-all duration-100 ease-in-out">
          <Link href="/#about">Tentang</Link>
        </li>
        <li className="hover:text-[#50B34B] transition-all duration-100 ease-in-out">
          <Link href="/plants">Tracking</Link>
        </li>
        <li className="hover:text-[#50B34B] transition-all duration-100 ease-in-out">
          <Link href="/articles">Artikel</Link>
        </li>
        <li className="hover:text-[#50B34B] transition-all duration-100 ease-in-out">
          <Link href="/workshops">Workshop</Link>
        </li>
      </ul>
      {isLogin ? (
        <div className="flex flex-row justify-end items-center gap-[1.25rem]">
          <div className="flex flex-row justify-center items-center gap-[0.3rem] cursor-pointer">
            <div className="rounded-full border border-[#50B34B] p-[0.1rem] flex flex-col justify-center items-center">
              <div className="p-[0.548rem] bg-white rounded-full flex flex-col justify-center items-center">
                <User size={15} color="#fffffff" />
              </div>
            </div>
            <CaretDown size={18} color="#fffff"></CaretDown>
          </div>
          <Bell size={21} color="#fffff"></Bell>
        </div>
      ) : (
        <ActionButton
          width="9rem"
          textColor="#ffff"
          onClickHandler={() => {
            router.push("/auth/login");
          }}
        >
          Mulai
        </ActionButton>
      )}
    </nav>
  );
};

export default Navbar;
