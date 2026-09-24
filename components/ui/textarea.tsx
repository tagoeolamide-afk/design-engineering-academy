import type { TextareaHTMLAttributes } from 'react';
import { useId } from 'react';
import { cn } from '@/lib/utils/cn';

export interface TextareaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'id' | 'className'> {
  readonly label: string;
  readonly hideLabel?: boolean;
  readonly description?: string;
  readonly error?: string;
  readonly className?: string;
}

export function Textarea({
  label,
  hideLabel = false,
  description,
  error,
  rows = 5,
  className,
  ...props
}: TextareaProps) {
  const id = useId();
  const descriptionId = `${id}-description`;
  const errorId = `${id}-error`;

  const describedBy =
    [description !== undefined ? descriptionId : null, error !== undefined ? errorId : null]
      .filter((value): value is string => value !== null)
      .join(' ') || undefined;

  return (
    <div className={cn('w-full', className)}>
      <label
        htmlFor={id}
        className={cn(
          'mb-1.5 block text-small font-medium text-text-primary',
          hideLabel && 'sr-only',
        )}
      >
        {label}
      </label>

      <textarea
        id={id}
        rows={rows}
        aria-describedby={describedBy}
        aria-invalid={error !== undefined}
        className={cn(
          'w-full resize-y rounded-medium border bg-surface-elevated px-2.5 py-2 text-small leading-relaxed text-text-primary transition-colors duration-100',
          'placeholder:text-text-muted',
          'hover:border-border-strong',
          'disabled:pointer-events-none disabled:opacity-45',
          error === undefined ? 'border-border' : 'border-danger',
        )}
        {...props}
      />

      {description !== undefined && error === undefined && (
        <p id={descriptionId} className="mt-1.5 text-small text-text-muted">
          {description}
        </p>
      )}
      {error !== undefined && (
        <p id={errorId} className="mt-1.5 text-small text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
