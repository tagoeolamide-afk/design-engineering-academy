import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

export type IconButtonSize = 'small' | 'medium' | 'touch';

const SIZES: Record<IconButtonSize, string> = {
  small: 'size-6',
  medium: 'size-8',
  /* Meets the 44px minimum for primary controls on touch surfaces. */
  touch: 'size-11',
};

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Required: an icon button has no visible text, so without this it is
   * unlabelled for screen readers.
   */
  readonly label: string;
  readonly size?: IconButtonSize;
}

export function IconButton({
  label,
  size = 'medium',
  className,
  type,
  children,
  ...props
}: IconButtonProps) {
  return (
    <button
      type={type ?? 'button'}
      aria-label={label}
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-medium text-text-secondary transition-colors duration-100',
        'hover:bg-surface-hover hover:text-text-primary active:bg-surface-active',
        'disabled:pointer-events-none disabled:opacity-45',
        SIZES[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
