import React, { ReactNode } from 'react';

interface Props {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  children: ReactNode;
}

export default function Button({ onClick, children, ...props }: Props) {
  return (
    <button
      className="bg-dark-200 p-1 border rounded-md hover:bg-dark-300 hover:text-[#edeed1] hover:border-[#edeed1] inline-flex items-center gap-1"
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}
