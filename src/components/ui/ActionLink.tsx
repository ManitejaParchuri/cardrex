import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

type ActionLinkVariant = 'primary' | 'secondary' | 'quiet';

interface ActionLinkProps {
  children: ReactNode;
  className?: string;
  fullWidth?: boolean;
  to: string;
  variant?: ActionLinkVariant;
}

const variants: Record<ActionLinkVariant, string> = {
  primary: 'game-action game-action--primary',
  secondary: 'game-action game-action--secondary',
  quiet: 'game-action game-action--quiet',
};

export function ActionLink({
  children,
  className = '',
  fullWidth = false,
  to,
  variant = 'primary',
}: ActionLinkProps) {
  return (
    <Link
      to={to}
      className={`${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      <span className="relative z-10">{children}</span>
    </Link>
  );
}
