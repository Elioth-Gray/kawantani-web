import React from "react";

const InputField = ({
  children,
  placeholder,
  type,
}: {
  children: React.ReactNode;
  placeholder: string;
  type: string;
}) => {
  return (
    <div className="flex flex-row justify-start items-center relative w-full">
      {children}
      <input
        type={type}
        className="py-[1.125rem] bg-[#F2F2F2] w-full rounded-lg pl-[4.8rem] font-semibold"
        placeholder={placeholder}
      />
    </div>
  );
};

export default InputField;
