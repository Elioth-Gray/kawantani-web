import React from "react";
import Image from "next/image";
import SecondaryButton from "@/components/buttons/SecondaryButton";
import { Calendar } from "@phosphor-icons/react/dist/ssr";
import { MapPin } from "@phosphor-icons/react/dist/ssr";

const WorkshopCard = ({
  imageURL,
  title,
  date,
  location,
}: {
  imageURL: string;
  title: string;
  date: string;
  location: string;
}) => {
  return (
    <div>
      <div className="col-span-1 w-full bg-[#FCF7F1] border border-black rounded-lg overflow-hidden flex flex-col justify-start items-start gap- gap-[1rem] h-fit">
        <Image
          width={100}
          height={15}
          src={imageURL}
          alt="cabai"
          className="w-full h-[11rem] object-cover"
          quality={100}
          unoptimized
        ></Image>
        <div className="flex flex-col justify-start items-start px-[1.1rem] w-full mb-[1.3rem] gap-[0.6rem]">
          <div className="w-full flex flex-col justify-start items-start gap-[0.75rem]">
            <h1 className="text-[1.2rem] font-semibold">{title}</h1>
            <div className="flex flex-col justify-start items-start w-full gap-[1rem]">
              <div className="flex flex-row justify-start items-center gap-[0.5rem]">
                <Calendar size={18} color="#000000" />
                <p className="text-[0.75rem]">{date}</p>
              </div>
              <div className="flex flex-row justify-start items-center gap-[0.5rem]">
                <MapPin size={18} color="#000000" />
                <p className="text-[0.75rem]">{location}</p>
              </div>
            </div>
          </div>
          <div className="w-full flex flex-row justify-end items-center">
            <SecondaryButton>Lihat Detail</SecondaryButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkshopCard;
