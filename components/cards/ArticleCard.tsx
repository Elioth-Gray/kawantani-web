import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";

const ArticleCard = ({
  imageURL,
  date,
  title,
  href = "",
}: {
  imageURL: string;
  date: string;
  title: string;
  href?: string;
}) => {
  return (
    <div className="col-span-1 h-fit bg-[#FCF7F1] py-[1rem] px-[1.25rem] rounded-xl">
      <div className="w-full flex flex-col justify-start items-start gap-[0.5rem]">
        <Image
          src={imageURL}
          width={100}
          height={169}
          alt="bayam"
          className="w-full rounded-xl"
          unoptimized
        ></Image>
        <div className="flex flex-col justify-start items-start w-full gap-[0.1rem]">
          <p className="text-[0.75rem] font-light">{date}</p>
          <p className="font-semibold text-[0.9rem]">{title}</p>
          <div className="w-full bg-black h-[0.06rem] mt-[0.3rem]"></div>
        </div>
        <div className="w-full flex flex-row justify-between items-center">
          <Link href={href} className="text-[0.75rem] underline">
            Baca lebih lanjut
          </Link>
          <ArrowRight size={17} />
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;
