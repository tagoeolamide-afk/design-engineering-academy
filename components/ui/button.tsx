import { Slot } from '@radix-ui/react-slot';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'small' | 'medium';

const BASE =
  'inline-flex shrink-0 select-none items-center justify-center gap-2 whitespace-nowrap rounded-medium font-medium transition-colors duration-100 disabled:pointer-events-none disabled:opacity-45';

const VARIANTS: Record<ButtonVariant, string> = {
  primary: 'bg-accent text-text-on-accent hover:bg-accent-hover active:bg-accent-active',
  secondary:
    'border border-border bg-surface text-text-primary hover:border-border-strong hover:bg-surface-hover active:bg-surface-active',
  ghost: 'text-text-secondary hover:bg-surface-hover hover:text-text-primary active:bg-surface-active',
  danger: 'border border-border text-danger hover:border-danger hover:bg-danger-subtle active:bg-danger-active',
};

const SIZES: Record<ButtonSize, string> = {
  small: 'h-7 px-2.5 text-small',
  medium: 'h-8 px-3 text-small',
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  readonly variant?: ButtonVariant;
  readonly size?: ButtonSize;
  /** Render the child element instead of a button, e.g. to style a Link. */
  readonly asChild?: boolean;
  readonly children?: ReactNode;
}

export function Button({
  variant = 'secondary',
  size = 'medium',
  asChild = false,
  className,
  type,
  ...props
}: ButtonProps) {
  const Component = asChild ? Slot : 'button';

  return (
    <Component
      /* An unset type on a button inside a form defaults to submit, which is
       * almost never what a UI button means. */
      {...(asChild ? {} : { type: type ?? 'button' })}
      className={cn(BASE, VARIANTS[variant], SIZES[size], className)}
      {...props}
    />
  );
}
