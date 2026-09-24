'use client';

import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check } from 'lucide-react';
import { useId } from 'react';
import { cn } from '@/lib/utils/cn';

export interface CheckboxProps {
  readonly checked: boolean;
  readonly onCheckedChange: (checked: boolean) => void;
  readonly label: string;
  readonly description?: string;
  readonly disabled?: boolean;
  readonly className?: string;
}

/**
 * Label and control are bound by id rather than nesting, so the whole label is
 * a hit target and the accessible name is unambiguous. The row is at least
 * 44px tall, which is the touch minimum for a primary control.
 */
export function Checkbox({
  checked,
  onCheckedChange,
  label,
  description,
  disabled = false,
  className,
}: CheckboxProps) {
  const id = useId();
  const descriptionId = `${id}-description`;

  return (
    <div className={cn('flex min-h-11 items-start gap-3 py-1.5', className)}>
      <CheckboxPrimitive.Root
        id={id}
        checked={checked}
        onCheckedChange={(value) => onCheckedChange(value === true)}
        disabled={disabled}
        aria-describedby={description === undefined ? undefined : descriptionId}
        className={cn(
          'mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-small border border-border-strong bg-surface-elevated transition-colors duration-100',
          'hover:border-accent',
          'data-[state=checked]:border-accent data-[state=checked]:bg-accent data-[state=checked]:text-text-on-accent',
          'disabled:pointer-events-none disabled:opacity-45',
        )}
      >
        <CheckboxPrimitive.Indicator>
          <Check aria-hidden size={13} strokeWidth={3} />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>

      <div className="min-w-0">
        <label htmlFor={id} className="cursor-pointer text-small text-text-primary">
          {label}
        </label>
        {description !== undefined && (
          <p id={descriptionId} className="mt-0.5 text-small text-text-muted">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
