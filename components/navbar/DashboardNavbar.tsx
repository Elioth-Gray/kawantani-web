"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User } from "@phosphor-icons/react/dist/ssr/User";
import { CaretDown } from "@phosphor-icons/react/dist/ssr";
import { Bell } from "@phosphor-icons/react/dist/ssr";

const DashboardNavbar = () => {
  const router = useRouter();

  return (
    <nav className="flex flex-row justify-between items-center text-black w-full bg-[#FCF7F1] py-[2.1rem] px-[9rem]">
      <div className="flex flex-row justify-start items-center gap-[4rem]">
        <Image
          src="/images/logo2.png"
          width={181}
          height={58}
          alt="logo"
          className="cursor-pointer"
          onClick={() => {
            router.push("/");
          }}
        ></Image>
        <ul className="flex flex-row justify-center items-center gap-[4.6rem] font-regular text-[1rem]">
          <li className="hover:text-[#50B34B] transition-all duration-100 ease-in-out">
            <Link href="/dashboard">Dashboard</Link>
          </li>
          <li className="hover:text-[#50B34B] transition-all duration-100 ease-in-out">
            <Link href="/dashboard/plants">Tracking</Link>
          </li>
          <li className="hover:text-[#50B34B] transition-all duration-100 ease-in-out">
            <Link href="/dashboard/articles">Artikel</Link>
          </li>
          <li className="hover:text-[#50B34B] transition-all duration-100 ease-in-out">
            <Link href="/dashboard/workshops">Workshop</Link>
          </li>
        </ul>
      </div>
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
    </nav>
  );
};

export default DashboardNavbar;
