import { Slot } from '@radix-ui/react-slot';
import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

export type CardPadding = 'none' | 'compact' | 'comfortable';

const PADDING: Record<CardPadding, string> = {
  none: '',
  compact: 'p-4',
  comfortable: 'p-5',
};

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  readonly padding?: CardPadding;
  /** Adds hover feedback. Only for cards that are themselves a link or button. */
  readonly interactive?: boolean;
  /**
   * Applies the card treatment to the child element instead of wrapping it, so
   * a card that is semantically a section stays a single element.
   */
  readonly asChild?: boolean;
}

/**
 * A single hairline and a surface tint. No shadow, no gradient — depth comes
 * from the surface scale, so cards can nest without compounding into noise.
 */
export function Card({
  padding = 'comfortable',
  interactive = false,
  asChild = false,
  className,
  ...props
}: CardProps) {
  const Component = asChild ? Slot : 'div';

  return (
    <Component
      className={cn(
        'rounded-large border border-border bg-surface',
        interactive &&
          'transition-colors duration-100 hover:border-border-strong hover:bg-surface-hover active:bg-surface-active',
        PADDING[padding],
        className,
      )}
      {...props}
    />
  );
}
