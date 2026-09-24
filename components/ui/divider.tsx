import { cn } from '@/lib/utils/cn';

export interface DividerProps {
  readonly orientation?: 'horizontal' | 'vertical';
  /** Decorative by default; a labelled divider is exposed as a separator. */
  readonly label?: string;
  readonly className?: string;
}

export function Divider({
  orientation = 'horizontal',
  label,
  className,
}: DividerProps) {
  return (
    <div
      role="separator"
      aria-orientation={orientation}
      aria-label={label}
      aria-hidden={label === undefined}
      className={cn(
        'shrink-0 bg-border',
        orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px',
        className,
      )}
    />
  );
}
