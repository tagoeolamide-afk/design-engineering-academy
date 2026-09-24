'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { TriangleAlert } from 'lucide-react';
import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';

interface ResetDialogProps {
  readonly trigger: ReactNode;
  readonly title: string;
  readonly description: string;
  /** Exactly what disappears. Stated in full before anything is destroyed. */
  readonly removes: readonly string[];
  /** Exactly what survives, which is usually the more reassuring half. */
  readonly keeps: readonly string[];
  readonly confirmLabel: string;
  readonly onConfirm: () => void;
}

/**
 * Explicit confirmation for a destructive, irreversible action.
 *
 * A modal rather than an inline second click: this data is not recoverable, it
 * is stored only on this device, and the learner should have to read what
 * happens before it happens. The dialog names both halves — what goes and what
 * stays — because "reset progress" alone does not tell anyone whether their
 * notes are about to be deleted.
 */
export function ResetDialog({
  trigger,
  title,
  description,
  removes,
  keeps,
  confirmLabel,
  onConfirm,
}: ResetDialogProps) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-canvas/70 backdrop-blur-[2px] data-[state=open]:animate-[overlay-in_120ms_ease-out]" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100vw-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-large border border-border bg-surface-elevated p-5 shadow-overlay data-[state=open]:animate-[dialog-in_140ms_ease-out]">
          <div className="flex gap-3">
            <TriangleAlert
              aria-hidden
              size={15}
              strokeWidth={1.75}
              className="mt-0.5 shrink-0 text-danger"
            />
            <div className="min-w-0">
              <Dialog.Title className="text-heading text-text-primary">
                {title}
              </Dialog.Title>
              <Dialog.Description className="mt-2 text-small text-text-secondary">
                {description}
              </Dialog.Description>
            </div>
          </div>

          <div className="mt-5 space-y-4 border-t border-border pt-4">
            <div>
              <h3 className="mb-2 text-caption uppercase text-text-muted">
                This removes
              </h3>
              <ul className="space-y-1.5 text-small text-text-secondary">
                {removes.map((item) => (
                  <li key={item} className="grid grid-cols-[0.75rem_1fr] gap-x-2">
                    <span aria-hidden className="mt-2.5 h-px w-2 bg-danger" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="mb-2 text-caption uppercase text-text-muted">This keeps</h3>
              <ul className="space-y-1.5 text-small text-text-secondary">
                {keeps.map((item) => (
                  <li key={item} className="grid grid-cols-[0.75rem_1fr] gap-x-2">
                    <span aria-hidden className="mt-2.5 h-px w-2 bg-success" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <p className="mt-4 text-small text-text-muted">
            This cannot be undone. Nothing is stored anywhere but this device.
          </p>

          <div className="mt-5 flex justify-end gap-2">
            <Dialog.Close asChild>
              <Button variant="ghost">Cancel</Button>
            </Dialog.Close>
            <Dialog.Close asChild>
              <Button variant="danger" onClick={onConfirm}>
                {confirmLabel}
              </Button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
