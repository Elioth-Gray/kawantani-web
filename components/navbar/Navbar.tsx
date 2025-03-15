import React from "react";
import Image from "next/image";
import Link from "next/link";
import ActionButton from "../buttons/ActionButton";

const Navbar = () => {
  return (
    <nav className="flex flex-row justify-between items-center text-white w-full">
      <Image src="/images/logo.png" width={181} height={58} alt="logo"></Image>
      <ul className="flex flex-row justify-center items-center gap-20 font-light text-[1rem]">
        <li className="hover:text-[#50B34B] transition-all duration-100 ease-in-out">
          <Link href="">Beranda</Link>
        </li>
        <li className="hover:text-[#50B34B] transition-all duration-100 ease-in-out">
          <Link href="">Tentang</Link>
        </li>
        <li className="hover:text-[#50B34B] transition-all duration-100 ease-in-out">
          <Link href="">Tracking</Link>
        </li>
        <li className="hover:text-[#50B34B] transition-all duration-100 ease-in-out">
          <Link href="">Artikel</Link>
        </li>
        <li className="hover:text-[#50B34B] transition-all duration-100 ease-in-out">
          <Link href="">Workshop</Link>
        </li>
      </ul>
      <ActionButton width="9rem" textColor="#ffff">
        Mulai
      </ActionButton>
    </nav>
  );
};

export default Navbar;
