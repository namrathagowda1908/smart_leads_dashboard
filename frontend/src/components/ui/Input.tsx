import { forwardRef, InputHTMLAttributes } from 'react';
import clsx from 'clsx';

const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={clsx(
      'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200',
      className,
    )}
    {...props}
  />
));

Input.displayName = 'Input';

export default Input;
