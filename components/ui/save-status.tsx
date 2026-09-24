import type { SaveStatus } from '@/lib/hooks/use-autosave';

/**
 * The quiet "Saving… / Saved" line beside an autosaving field.
 *
 * Announced politely rather than assertively: saving is reassurance, not
 * something worth interrupting what the screen reader is already saying.
 */
export function SaveStatusLabel({
  status,
  className = 'text-caption text-text-muted',
}: {
  readonly status: SaveStatus;
  readonly className?: string;
}) {
  return (
    <span className={className} role="status" aria-live="polite">
      {status === 'pending' ? 'Saving…' : status === 'saved' ? 'Saved' : ''}
    </span>
  );
}
