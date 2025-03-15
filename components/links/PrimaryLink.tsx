import React from "react";
import Link from "next/link";

const PrimaryLink = ({
  textSize = "1rem",
  children,
  href,
}: {
  textSize?: string;
  children: React.ReactNode;
  href: string;
}) => {
  const linkStyle = {
    fontSize: textSize,
  };

  return (
    <Link style={linkStyle} className={`text-[#50B34B]`} href={href}>
      {children}
    </Link>
  );
};

export default PrimaryLink;
