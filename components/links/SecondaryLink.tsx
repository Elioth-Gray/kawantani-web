import React from "react";
import Link from "next/link";

const SecondaryLink = ({
  textSize = "1rem",
  children,
}: {
  textSize?: string;
  children: React.ReactNode;
}) => {
  const linkStyle = {
    fontSize: textSize,
  };
  return (
    <Link
      style={linkStyle}
      className="w-full text-[0.93rem] text-[#828282]"
      href=""
    >
      {children}
    </Link>
  );
};

export default SecondaryLink;
