import { ChevronDown } from 'lucide-react';
import type { SelectHTMLAttributes } from 'react';
import { useId } from 'react';
import { cn } from '@/lib/utils/cn';

export interface SelectFieldProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'id' | 'className'> {
  readonly label: string;
  readonly hideLabel?: boolean;
  readonly description?: string;
  readonly className?: string;
}

/**
 * A native select.
 *
 * Deliberately not a custom listbox: the native control brings keyboard
 * behaviour, type-ahead, and the platform's own picker on touch devices for
 * free, and a filter control is not the place to spend a bespoke widget's worth
 * of accessibility risk.
 */
export function SelectField({
  label,
  hideLabel = false,
  description,
  className,
  children,
  ...props
}: SelectFieldProps) {
  const id = useId();
  const descriptionId = `${id}-description`;

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
        <select
          id={id}
          aria-describedby={description === undefined ? undefined : descriptionId}
          className={cn(
            'h-8 w-full appearance-none rounded-medium border border-border bg-surface-elevated pl-2.5 pr-8 text-small text-text-primary transition-colors duration-100',
            'hover:border-border-strong',
            'disabled:pointer-events-none disabled:opacity-45',
          )}
          {...props}
        >
          {children}
        </select>
        <ChevronDown
          aria-hidden
          size={15}
          strokeWidth={1.75}
          className="pointer-events-none absolute right-2.5 text-text-muted"
        />
      </div>

      {description !== undefined && (
        <p id={descriptionId} className="mt-1.5 text-small text-text-muted">
          {description}
        </p>
      )}
    </div>
  );
}
