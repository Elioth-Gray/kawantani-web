import React from "react";
import { Leaf } from "@phosphor-icons/react/dist/ssr/Leaf";

const SecondaryLabel = () => {
  return (
    <div className="flex flex-row justify-start items-center gap-[0.8rem]">
      <Leaf size={27} color="#50B34B" />
      <p className="text-[1.5rem] font-bold text-[#50B34B]">KawanTani</p>
    </div>
  );
};

export default SecondaryLabel;
