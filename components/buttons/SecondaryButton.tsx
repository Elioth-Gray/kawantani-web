import React from "react";

const SecondaryButton = ({
  children,
  variant = "whites",
  height = "",
  width = "",
  onClickHandler,
}: {
  children: React.ReactNode;
  variant?: string;
  height?: string;
  width?: string;
  onClickHandler?: (e: any) => void;
}) => {
  const buttonStyle = {
    width: width,
    height: height,
  };

  return (
    <button
      style={buttonStyle}
      className={`px-[1.6rem] py-[0.8rem] border border-${variant} rounded-md font-semibold cursor-pointer text-center w-fit`}
      onClick={onClickHandler}
    >
      {children}
    </button>
  );
};

export default SecondaryButton;
