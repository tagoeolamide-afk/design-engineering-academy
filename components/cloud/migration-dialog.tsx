'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { CloudUpload } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { formatCountOf } from '@/lib/utils/format';
import { useSyncStore } from '@/stores/sync-store';
import { getActiveController } from '@/lib/cloud/sync-controller';

/**
 * The one-time offer to carry existing work into a new account.
 *
 * Shown only when the cloud record is empty *and* this device holds real work,
 * so it never appears for a learner who simply signed in on a clean machine.
 * Neither side is taken automatically: importing would overwrite the account,
 * discarding would throw away the only copy, and both are the learner's call.
 *
 * Not dismissible. Escaping it would leave the session in a state where it is
 * unclear which progress applies, so the two buttons are the only way out.
 */
export function CloudMigrationDialog() {
  const phase = useSyncStore((state) => state.phase);
  const summary = useSyncStore((state) => state.localSummary);
  const saveState = useSyncStore((state) => state.saveState);
  const saveError = useSyncStore((state) => state.saveError);
  const [pending, setPending] = useState<'import' | 'fresh' | null>(null);

  if (phase !== 'choosing' || summary === null) return null;

  const run = async (choice: 'import' | 'fresh') => {
    setPending(choice);
    const controller = getActiveController();
    if (controller === null) return;

    if (choice === 'import') await controller.importLocalProgress();
    else await controller.startFresh();

    setPending(null);
  };

  const items: readonly string[] = [
    summary.lessonsTouched > 0
      ? formatCountOf(summary.lessonsTouched, 'lesson started')
      : null,
    summary.reflections > 0 ? formatCountOf(summary.reflections, 'reflection') : null,
    summary.projects > 0 ? formatCountOf(summary.projects, 'project record') : null,
    summary.notes > 0 ? formatCountOf(summary.notes, 'note') : null,
    summary.resources > 0 ? formatCountOf(summary.resources, 'resource mark') : null,
  ].filter((entry): entry is string => entry !== null);

  return (
    <Dialog.Root open>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-canvas/70 backdrop-blur-[2px] data-[state=open]:animate-[overlay-in_120ms_ease-out]" />
        <Dialog.Content
          onEscapeKeyDown={(event) => event.preventDefault()}
          onPointerDownOutside={(event) => event.preventDefault()}
          onInteractOutside={(event) => event.preventDefault()}
          className="fixed left-1/2 top-1/2 z-50 w-[calc(100vw-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-large border border-border bg-surface-elevated p-5 shadow-overlay data-[state=open]:animate-[dialog-in_140ms_ease-out]"
        >
          <div className="flex gap-3">
            <CloudUpload
              aria-hidden
              size={15}
              strokeWidth={1.75}
              className="mt-0.5 shrink-0 text-accent-text"
            />
            <div className="min-w-0">
              <Dialog.Title className="text-small font-medium text-text-primary">
                Progress found on this device
              </Dialog.Title>
              <Dialog.Description className="mt-1.5 text-small text-text-secondary">
                This account has no saved progress yet, but this browser does. Bring it
                across, or start the account empty.
              </Dialog.Description>
            </div>
          </div>

          {items.length > 0 && (
            <ul className="mt-4 border-t border-border">
              {items.map((item) => (
                <li
                  key={item}
                  className="border-b border-border py-2 text-small text-text-secondary last:border-b-0"
                >
                  {item}
                </li>
              ))}
            </ul>
          )}

          {saveState === 'error' && saveError !== null && (
            <p role="alert" className="mt-4 text-small text-danger">
              {saveError}
            </p>
          )}

          <p className="mt-4 text-small text-text-muted">
            Starting fresh leaves this device&rsquo;s progress in place but stops using it.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <Button
              variant="primary"
              onClick={() => void run('import')}
              disabled={pending !== null}
            >
              {pending === 'import' ? 'Importing…' : 'Import progress'}
            </Button>
            <Button
              variant="secondary"
              onClick={() => void run('fresh')}
              disabled={pending !== null}
            >
              {pending === 'fresh' ? 'Starting…' : 'Start fresh'}
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
