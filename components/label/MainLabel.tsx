import React from "react";
import { Leaf } from "@phosphor-icons/react/dist/ssr/Leaf";

const MainLabel = ({ title }: { title: String }) => {
  return (
    <div className="flex flex-row justify-center items-center gap-[0.8rem]">
      <Leaf size={37} color="#fcfcfc" />
      <p className="text-[1.5rem] font-bold">{title}</p>
    </div>
  );
};

export default MainLabel;
