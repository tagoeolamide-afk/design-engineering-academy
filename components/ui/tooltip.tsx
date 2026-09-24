'use client';

import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

export const TooltipProvider = TooltipPrimitive.Provider;

export interface TooltipProps {
  readonly content: ReactNode;
  readonly children: ReactNode;
  readonly side?: 'top' | 'right' | 'bottom' | 'left';
  /** Keyboard hint rendered after the label, e.g. a shortcut. */
  readonly shortcut?: string;
}

/**
 * Radix is warranted here: correct tooltip behaviour means pointer and focus
 * triggers, a shared open delay across the app, escape-to-close, and portalled
 * positioning that stays inside the viewport. Writing that by hand is how
 * tooltips end up keyboard-inaccessible.
 *
 * A tooltip only ever supplements a visible or accessible name — it is never
 * the only place information appears.
 */
export function Tooltip({ content, children, side = 'top', shortcut }: TooltipProps) {
  return (
    <TooltipPrimitive.Root>
      <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content
          side={side}
          sideOffset={6}
          className={cn(
            'z-50 flex items-center gap-2 rounded-medium border border-border bg-surface-elevated px-2 py-1 text-small text-text-primary shadow-overlay',
            'select-none data-[state=delayed-open]:animate-[dialog-in_120ms_ease-out]',
          )}
        >
          {content}
          {shortcut !== undefined && (
            <kbd className="rounded-small bg-surface-active px-1 font-mono text-caption text-text-muted">
              {shortcut}
            </kbd>
          )}
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  );
}
