import React from 'react';
import { cn } from '@/lib/utils';

const ActionButton = ({
  children,
  size = '1rem',
  textColor = '#000000',
  height = '',
  width = '',
  disabled,
  onClickHandler,
  className,
}: {
  children: React.ReactNode;
  size?: string;
  textColor?: string;
  height?: string;
  width?: string;
  disabled?: boolean;
  onClickHandler?: (e: any) => void;
  className?: string;
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
      className={cn(
        `py-[0.6rem] bg-[#50B34B] rounded-lg ${
          disabled ? 'cursor-not-allowed' : 'cursor-pointer'
        } font-semibold cursor-  w-fit text-center`,
        className,
      )}
      disabled={disabled}
      onClick={onClickHandler}
    >
      {children}
    </button>
  );
};

export default ActionButton;
