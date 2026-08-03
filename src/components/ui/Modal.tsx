import { useEffect, useId, useRef, type ReactNode } from 'react';

import { Button } from './Button';

interface ModalProps {
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  title: string;
}

export function Modal({ children, isOpen, onClose, title }: ModalProps) {
  const titleId = useId();
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    closeButtonRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-end bg-black/70 p-3 backdrop-blur-sm sm:place-items-center"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="w-full max-w-md rounded-3xl border border-violet-300/20 bg-[#151026] p-6 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4">
          <h2 id={titleId} className="text-xl font-bold text-white">
            {title}
          </h2>
          <Button
            ref={closeButtonRef}
            variant="ghost"
            className="-mt-2 -mr-2 min-h-11 px-3 text-xl"
            onClick={onClose}
            aria-label="Close dialog"
          >
            ×
          </Button>
        </div>
        <div className="mt-4 text-sm leading-6 text-violet-100/70">
          {children}
        </div>
      </section>
    </div>
  );
}
