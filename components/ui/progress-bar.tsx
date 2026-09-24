import { clampRatio, formatRatio } from '@/lib/utils/format';
import { cn } from '@/lib/utils/cn';

export type ProgressBarSize = 'thin' | 'regular';

const SIZES: Record<ProgressBarSize, string> = {
  thin: 'h-0.5',
  regular: 'h-1',
};

export interface ProgressBarProps {
  /** 0..1. Values outside the range are clamped rather than overflowing. */
  readonly value: number;
  /** Required: a bare bar is meaningless to a screen reader without it. */
  readonly label: string;
  readonly size?: ProgressBarSize;
  /** Renders the fill in the success colour once the work is finished. */
  readonly complete?: boolean;
  readonly className?: string;
}

/**
 * Deliberately thin. A progress bar is a supporting readout next to a number,
 * not a chart, so it never becomes the loudest thing on the page.
 */
export function ProgressBar({
  value,
  label,
  size = 'regular',
  complete = false,
  className,
}: ProgressBarProps) {
  const ratio = clampRatio(value);

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(ratio * 100)}
      aria-valuetext={formatRatio(ratio)}
      className={cn(
        'w-full overflow-hidden rounded-full bg-surface-active',
        SIZES[size],
        className,
      )}
    >
      <div
        className={cn(
          'h-full rounded-full transition-[width] duration-300 ease-out',
          complete ? 'bg-success' : 'bg-accent',
        )}
        style={{ width: `${ratio * 100}%` }}
      />
    </div>
  );
}
