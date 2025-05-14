import React from 'react';
import Link from 'next/link';

const SecondaryLink = ({
  textSize = '1rem',
  children,
  href = '',
}: {
  textSize?: string;
  children: React.ReactNode;
  href?: string;
}) => {
  const linkStyle = {
    fontSize: textSize,
  };
  return (
    <Link
      style={linkStyle}
      className='w-full text-[0.93rem] text-[#828282] text-center'
      href={href}
    >
      {children}
    </Link>
  );
};

export default SecondaryLink;
