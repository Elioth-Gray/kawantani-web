"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import ActionButton from "../buttons/ActionButton";
import { useRouter } from "next/navigation";

const Navbar = () => {
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
      <ActionButton
        width="9rem"
        textColor="#ffff"
        onClickHandler={() => {
          router.push("/auth/login");
        }}
      >
        Mulai
      </ActionButton>
    </nav>
  );
};

export default Navbar;
