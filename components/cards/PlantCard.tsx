import React from "react";
import Image from "next/image";
import SecondaryButton from "../buttons/SecondaryButton";

const PlantCard = ({
  imageURL,
  title,
  description,
}: {
  imageURL: string;
  title: string;
  description: string;
}) => {
  return (
    <div className="col-span-1 w-full bg-[#FCF7F1] border border-black rounded-lg overflow-hidden flex flex-col justify-start items-start gap- gap-[1rem] h-fit">
      <Image
        width={100}
        height={15}
        src={imageURL}
        alt="cabai"
        className="w-full"
        unoptimized
      ></Image>
      <div className="flex flex-col justify-start items-start px-[1.1rem] w-full mb-[1.3rem] gap-[0.6rem]">
        <div className="w-full">
          <h1 className="text-[1.2rem] font-semibold">{title}</h1>
          <p>{description}</p>
        </div>
        <div className="w-full flex flex-row justify-end items-center">
          <SecondaryButton>Lihat Detail</SecondaryButton>
        </div>
      </div>
    </div>
  );
};

export default PlantCard;
