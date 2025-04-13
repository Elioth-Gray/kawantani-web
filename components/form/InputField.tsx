import React from "react";

const InputField = ({
  children,
  placeholder,
  type,
}: {
  children?: React.ReactNode;
  placeholder?: string;
  type: string;
}) => {
  return (
    <div className="flex flex-row justify-start items-center relative w-full border border-black rounded-lg">
      {children}
      <input
        type={type}
        className={`py-[1.125rem] bg-[#F2F2F2] w-full rounded-lg ${
          children ? "pl-[4.8rem]" : "px-[1rem]"
        } font-semibold`}
        placeholder={placeholder}
      />
    </div>
  );
};

export default InputField;
