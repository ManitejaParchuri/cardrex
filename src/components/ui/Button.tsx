import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  fullWidth?: boolean;
  loading?: boolean;
  variant?: ButtonVariant;
}

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-gradient-to-r from-violet-600 to-violet-500 text-white shadow-[0_12px_35px_rgba(124,58,237,0.35)] hover:-translate-y-0.5 hover:brightness-110 hover:shadow-[0_16px_42px_rgba(124,58,237,0.45)] active:translate-y-0 active:scale-[0.98]',
  secondary:
    'border border-violet-300/25 bg-violet-300/10 text-violet-50 hover:-translate-y-0.5 hover:border-violet-200/40 hover:bg-violet-300/15 active:translate-y-0 active:scale-[0.98]',
  ghost: 'text-violet-200 hover:bg-white/5',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      children,
      className = '',
      disabled,
      fullWidth = false,
      loading = false,
      type = 'button',
      variant = 'primary',
      ...props
    },
    ref,
  ) {
    return (
      <button
        ref={ref}
        type={type}
        className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl px-5 text-sm font-bold transition focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-55 ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        {...props}
      >
        {loading ? (
          <span
            className="size-4 animate-spin rounded-full border-2 border-current border-r-transparent"
            aria-hidden="true"
          />
        ) : null}
        {children}
      </button>
    );
  },
);
