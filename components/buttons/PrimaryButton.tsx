import React from 'react';

const PrimaryButton = ({
  children,
  textColor = '#000000',
  onClickHandler,
  disabled,
}: {
  children: React.ReactNode;
  textColor?: string;
  onClickHandler?: (e?: any) => void;
  disabled?: boolean;
}) => {
  const buttonStyle = {
    color: textColor,
  };

  return (
    <button
      style={buttonStyle}
      className='px-[1.6rem] py-[0.8rem] bg-[#50B34B] rounded-md font-semibold cursor-pointer w-fit'
      onClick={onClickHandler}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default PrimaryButton;
