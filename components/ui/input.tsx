'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps extends React.ComponentProps<'input'> {
  error?: string;
  showPasswordToggle?: boolean;
  length?: number;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className, type, error, showPasswordToggle = false, length, ...props },
    ref,
  ) => {
    const [showPassword, setShowPassword] = React.useState(false);

    const inputType = React.useMemo(() => {
      if (type === 'password' && showPassword && showPasswordToggle) {
        return 'text';
      }
      return type;
    }, [type, showPassword, showPasswordToggle]);

    return (
      <div className='w-full'>
        <div className='relative'>
          <input
            ref={ref}
            type={inputType}
            maxLength={length}
            data-slot='input'
            aria-invalid={!!error}
            className={cn(
              'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
              'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
              'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
              showPasswordToggle && type === 'password' ? 'pr-10' : '',
              className,
            )}
            {...props}
          />

          {showPasswordToggle && type === 'password' && (
            <button
              type='button'
              className='absolute right-0 top-0 h-full px-3 flex items-center justify-center text-muted-foreground hover:text-foreground'
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className='h-4 w-4 text-muted-foreground' />
              ) : (
                <Eye className='h-4 w-4 text-muted-foreground' />
              )}
            </button>
          )}
        </div>
        {error && <p className='text-destructive text-sm mt-1'>{error}</p>}
      </div>
    );
  },
);

Input.displayName = 'Input';
export { Input };
