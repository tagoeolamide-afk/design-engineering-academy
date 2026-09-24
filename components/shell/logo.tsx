import { cn } from '@/lib/utils/cn';

/**
 * The mark: a square split on the diagonal, one half solid, one half outlined.
 * Design and engineering as two halves of the same shape. Geometric on purpose
 * — no illustration, no gradient, and it reads at 16px.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden
      className={cn('size-4 shrink-0', className)}
      fill="none"
    >
      <path d="M1.5 14.5V1.5h13Z" className="fill-accent" />
      <rect
        x="1.5"
        y="1.5"
        width="13"
        height="13"
        rx="2.5"
        className="stroke-text-primary"
        strokeWidth="1.25"
      />
    </svg>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn('flex min-w-0 items-center gap-2', className)}>
      <LogoMark />
      <span className="min-w-0 truncate text-small font-medium tracking-tight text-text-primary">
        Design Engineering
        <span className="text-text-muted"> Academy</span>
      </span>
    </span>
  );
}
