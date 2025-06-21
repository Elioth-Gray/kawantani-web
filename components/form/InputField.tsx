import { cn } from '@/lib/utils';

const InputField = ({
  children,
  placeholder,
  type,
  name,
  value,
  onChange,
  error,
  maxLength,
  className,
}: {
  children?: React.ReactNode;
  placeholder?: string;
  type: string;
  name?: string;
  value?: string;
  onChange?: (e: any) => void;
  error?: string;
  maxLength?: number;
  className?: string;
}) => {
  return (
    <div className='w-full'>
      <div className='flex flex-row justify-start items-center relative w-full border border-black rounded-lg'>
        {children}
        <input
          type={type}
          value={value ?? ''} // ✅ fallback jika undefined
          name={name}
          onChange={onChange}
          maxLength={maxLength}
          className={cn(
            'py-[1.125rem] bg-[#F2F2F2] w-full rounded-lg',
            children ? 'pl-[4.8rem]' : 'px-[1rem]',
            'pr-[2rem] font-semibold text-[#727272]',
            className,
          )}
          placeholder={placeholder}
        />
      </div>
      {error && <p className='text-red-500 text-sm mt-1'>{error}</p>}
    </div>
  );
};

export default InputField;
