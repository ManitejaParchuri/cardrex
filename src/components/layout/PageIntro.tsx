import type { ReactNode } from 'react';

interface PageIntroProps {
  eyebrow: string;
  title: string;
  description: ReactNode;
}

export function PageIntro({ description, eyebrow, title }: PageIntroProps) {
  return (
    <header>
      <p className="text-xs font-bold tracking-[0.22em] text-violet-300 uppercase">
        {eyebrow}
      </p>
      <h1 className="mt-3 text-4xl leading-[1.05] font-black tracking-tight text-white sm:text-5xl">
        {title}
      </h1>
      <p className="mt-4 max-w-xl text-base leading-7 text-violet-100/65">
        {description}
      </p>
    </header>
  );
}
