import React from "react";
import Link from "next/link";

const PrimaryLink = ({
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
    <Link style={linkStyle} className={`text-[#50B34B]`} href="">
      {children}
    </Link>
  );
};

export default PrimaryLink;
