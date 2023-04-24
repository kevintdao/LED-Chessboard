import React, { ReactNode } from 'react';
import { classNames } from '../lib/utils';

interface Props {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  children: ReactNode;
  disabled?: boolean;
}

export default function Button({
  onClick,
  children,
  disabled,
  ...props
}: Props) {
  return (
    <button
      className={classNames(
        'bg-dark-200 p-1 border rounded-md hover:bg-dark-300 hover:text-[#edeed1] hover:border-[#edeed1] inline-flex items-center gap-1 disabled:bg-gray-600 disabled:border-gray-600 disabled:text-gray-400',
        disabled ? 'cursor-not-allowed' : 'cursor-pointer'
      )}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}
