import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  fullWidth?: boolean;
  loading?: boolean;
  variant?: ButtonVariant;
}

const variants: Record<ButtonVariant, string> = {
  primary: 'game-button game-button--primary',
  secondary: 'game-button game-button--secondary',
  ghost: 'game-button game-button--ghost',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
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
      className={`relative inline-flex min-h-13 items-center justify-center gap-2 overflow-hidden rounded-2xl px-5 text-sm font-bold tracking-wide transition focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-55 ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
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
});
