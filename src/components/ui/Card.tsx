import type { HTMLAttributes, ReactNode } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function Card({ children, className = '', ...props }: CardProps) {
  return (
    <div
      className={`cosmic-card rounded-[1.75rem] p-5 sm:p-7 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
