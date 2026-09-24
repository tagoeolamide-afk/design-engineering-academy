import type { InputHTMLAttributes, ReactNode } from 'react';
import { useId } from 'react';
import { cn } from '@/lib/utils/cn';

export interface TextFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id' | 'className'> {
  readonly label: string;
  /** Hides the label visually while keeping it for assistive technology. */
  readonly hideLabel?: boolean;
  readonly description?: string;
  readonly error?: string;
  /** A leading icon or affix rendered inside the field. */
  readonly leading?: ReactNode;
  readonly className?: string;
}

export function TextField({
  label,
  hideLabel = false,
  description,
  error,
  leading,
  className,
  ...props
}: TextFieldProps) {
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

      <div className="relative flex items-center">
        {leading !== undefined && (
          <span
            aria-hidden
            className="pointer-events-none absolute left-2.5 flex items-center text-text-muted"
          >
            {leading}
          </span>
        )}
        <input
          id={id}
          aria-describedby={describedBy}
          aria-invalid={error !== undefined}
          className={cn(
            'h-8 w-full rounded-medium border bg-surface-elevated px-2.5 text-small text-text-primary transition-colors duration-100',
            'placeholder:text-text-muted',
            'hover:border-border-strong',
            'disabled:pointer-events-none disabled:opacity-45',
            leading !== undefined && 'pl-8',
            /* The error state carries a message and aria-invalid as well as a
             * colour, so it is never signalled by the border alone. */
            error === undefined ? 'border-border' : 'border-danger',
          )}
          {...props}
        />
      </div>

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
