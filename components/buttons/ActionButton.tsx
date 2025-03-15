import React from "react";

const ActionButton = ({
  children,
  size = "1rem",
  textColor = "#000000",
  height = "",
  width = "",
  onClickHandler,
}: {
  children: React.ReactNode;
  size?: string;
  textColor?: string;
  height?: string;
  width?: string;
  onClickHandler?: (e: any) => void;
}) => {
  const buttonStyle = {
    fontSize: size,
    color: textColor,
    height: height,
    width: width,
  };

  return (
    <button
      style={buttonStyle}
      className="py-[0.6rem] bg-[#50B34B] rounded-lg font-semibold cursor-pointer w-fit text-center"
      onClick={onClickHandler}
    >
      {children}
    </button>
  );
};

export default ActionButton;
