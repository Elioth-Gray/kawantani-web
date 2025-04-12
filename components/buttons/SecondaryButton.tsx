import React from "react";

const SecondaryButton = ({
  children,
  variant = "whites",
  height = "",
  width = "",
  hover = true,
  onClickHandler,
}: {
  children: React.ReactNode;
  variant?: string;
  height?: string;
  width?: string;
  hover?: boolean;
  onClickHandler?: (e: any) => void;
}) => {
  const buttonStyle = {
    width: width,
    height: height,
  };

  return (
    <button
      style={buttonStyle}
      className={`px-[1.6rem] py-[0.8rem] border border-${variant} rounded-md font-semibold cursor-pointer text-center w-fit transition-all ease-in-out duration-100 ${
        hover ? "hover:bg-black hover:text-white" : ""
      }`}
      onClick={onClickHandler}
    >
      {children}
    </button>
  );
};

export default SecondaryButton;
