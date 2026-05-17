import { ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';

const Button = ({ className, type = 'button', ...rest }: ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    type={type}
    className={clsx(
      'rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:opacity-50 disabled:pointer-events-none',
      className,
    )}
    {...rest}
  />
);

export default Button;
