'use client';

import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMounted } from '@/lib/hooks/use-mounted';
import { useSyncStore } from '@/stores/sync-store';
import { resolvePersistenceAdapter } from '@/lib/persistence/adapter';
import {
  PROGRESS_SCHEMA_VERSION,
  NOTES_SCHEMA_VERSION,
  RESOURCES_SCHEMA_VERSION,
  RESETTABLE_NOTES_KEYS,
  RESETTABLE_PROGRESS_KEYS,
} from '@/lib/persistence/keys';
import {
  clearStorageKeys,
  getStorageRecoveries,
} from '@/lib/persistence/versioned-storage';
import { formatCountOf } from '@/lib/utils/format';
import { useNotesStore } from '@/stores/notes-store';
import { useProgressStore } from '@/stores/progress-store';
import { useResourceStore } from '@/stores/resource-store';
import { ResetDialog } from './reset-dialog';

/**
 * Stored data, and the two destructive actions over it.
 *
 * Progress and notes are reset separately and deliberately: they have different
 * lifecycles, and wanting to restart the course is not the same as wanting to
 * throw away everything you wrote while taking it.
 */
export function DataControls() {
  const resetAllProgress = useProgressStore((state) => state.resetAllProgress);
  const deleteAllNotes = useNotesStore((state) => state.deleteAllNotes);
  const clearAllResourceMarks = useResourceStore((state) => state.clearAllResourceMarks);

  /* Resolved in the browser only: the server has no localStorage, so naming the
   * adapter during server render would not match what hydrates. */
  const mounted = useMounted();
  const adapterName = mounted ? resolvePersistenceAdapter().name : 'checking…';
  const recovered = mounted ? getStorageRecoveries() : [];

  /* With an account, this browser holds a working copy and the account holds
   * the real one — saying "this device only" would be wrong. */
  const cloudActive = useSyncStore((state) => state.phase !== 'disabled');
  const locationLabel = !mounted
    ? 'checking…'
    : cloudActive
      ? 'Your account, cached here'
      : 'This device only';

  function resetProgress() {
    resetAllProgress();
    /* The marks live in their own store, so clearing the key alone would leave
     * them on screen until a reload — and re-persist them on the next toggle. */
    clearAllResourceMarks();
    /* Also clear keys written by earlier builds. Without this the next page
     * load would find the current key empty, adopt the legacy copy, and
     * silently undo the reset. */
    clearStorageKeys(RESETTABLE_PROGRESS_KEYS);
  }

  function resetNotes() {
    deleteAllNotes();
    clearStorageKeys(RESETTABLE_NOTES_KEYS);
  }

  return (
    <div className="space-y-6">
      <dl className="grid gap-x-8 gap-y-3 text-small sm:grid-cols-2">
        <Figure label="Storage" value={adapterName} mono />
        <Figure label="Location" value={locationLabel} />
        <Figure label="Progress format" value={`v${PROGRESS_SCHEMA_VERSION}`} mono />
        <Figure label="Notes format" value={`v${NOTES_SCHEMA_VERSION}`} mono />
        <Figure label="Resources format" value={`v${RESOURCES_SCHEMA_VERSION}`} mono />
      </dl>

      <p className="max-w-measure text-small text-text-muted">
        Progress and notes are stored under versioned keys. When the format
        changes, stored data is migrated forward rather than discarded, so an
        update never costs you your work.
      </p>

      {/* Recovering quietly would be worse than saying so: someone whose
          progress vanished deserves to know it was unreadable rather than
          assume the app lost it. */}
      {mounted && recovered.length > 0 && (
        <div
          role="status"
          className="max-w-measure rounded-medium border border-warning bg-warning-subtle p-4"
        >
          <p className="flex items-center gap-2 text-small font-medium text-warning">
            <AlertTriangle aria-hidden size={15} strokeWidth={2} />
            Some stored data could not be read
          </p>
          <p className="mt-1.5 text-small text-text-secondary">
            {formatCountOf(recovered.length, 'key')} on this device
            {recovered.length === 1 ? ' was' : ' were'} damaged and skipped, so that
            area started empty rather than blocking the app. It will be rewritten the
            next time you change something.
          </p>
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {recovered.map((key) => (
              <li
                key={key}
                className="rounded-small bg-surface px-1.5 py-0.5 font-mono text-code text-text-muted"
              >
                {key}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-wrap gap-2 border-t border-border pt-5">
        <ResetDialog
          trigger={<Button>Reset progress</Button>}
          title="Reset all progress?"
          description="Every lesson, exercise, reflection, and project status returns to its starting state."
          removes={[
            'Lesson completion, including which lessons you have read to the end',
            'Exercise checkboxes and the working notes saved with them',
            'Reflection answers',
            'Project status and submission links',
            'Saved, started, and completed marks on library resources',
            'Activity history, which is read from those timestamps',
          ]}
          keeps={[
            'All of your notes',
            'Your theme preference',
            'The curriculum itself — every lesson, module, and project stays exactly as it is',
          ]}
          confirmLabel="Reset progress"
          onConfirm={resetProgress}
        />

        <ResetDialog
          trigger={<Button>Delete all notes</Button>}
          title="Delete every note?"
          description="All notes are removed, whatever they are attached to."
          removes={['Every global, lesson, module, and project note']}
          keeps={[
            'All of your progress',
            'Reflection answers, which are stored with progress rather than as notes',
            'The curriculum itself',
          ]}
          confirmLabel="Delete all notes"
          onConfirm={resetNotes}
        />
      </div>
    </div>
  );
}

function Figure({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-border pb-2">
      <dt className="text-text-muted">{label}</dt>
      <dd className={mono ? 'font-mono text-code text-text-secondary' : 'text-text-secondary'}>
        {value}
      </dd>
    </div>
  );
}
