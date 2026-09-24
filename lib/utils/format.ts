/**
 * Stands in for a count that is not known yet.
 *
 * Never a zero. A zero is a statement about the learner's work — "you have
 * completed none" — and a figure that has not loaded is not the same claim.
 * With an account the gap is a network round trip, long enough to read.
 */
export const PENDING_FIGURE = '—';

/** Presentation helpers shared across routes. */

export function formatMinutes(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  return remainder === 0 ? `${hours} hr` : `${hours} hr ${remainder} min`;
}

/** Ratios are stored 0..1 and always displayed as whole percentages. */
export function formatRatio(ratio: number): string {
  return `${Math.round(clampRatio(ratio) * 100)}%`;
}

export function clampRatio(ratio: number): number {
  if (Number.isNaN(ratio)) return 0;
  return Math.min(1, Math.max(0, ratio));
}

export function formatCount(completed: number, total: number): string {
  return `${completed} of ${total}`;
}

/**
 * Counts rendered next to a noun need the noun to agree with them. Seeding one
 * module made "1 lessons" visible on the module page, which is the kind of
 * detail that reads as carelessness in an otherwise precise interface.
 */
export function pluralize(count: number, singular: string, plural?: string): string {
  return count === 1 ? singular : (plural ?? `${singular}s`);
}

export function formatCountOf(count: number, singular: string, plural?: string): string {
  return `${count} ${pluralize(count, singular, plural)}`;
}

/**
 * Relative time for the activity feed.
 *
 * Depends on the current clock, so it differs between a server render and the
 * browser. Every caller must gate it behind the mounted check, exactly as the
 * persisted-progress readouts do.
 */
export function formatRelativeTime(iso: string, now: Date = new Date()): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return '';

  const seconds = Math.round((now.getTime() - then) / 1000);
  if (seconds < 60) return 'just now';

  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.round(hours / 24);
  if (days < 7) return `${days}d ago`;

  const weeks = Math.round(days / 7);
  if (weeks < 5) return `${weeks}w ago`;

  return new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
}

/** Time-of-day greeting. Client-only for the same reason as the above. */
export function greetingFor(now: Date = new Date()): string {
  const hour = now.getHours();
  if (hour < 5) return 'Still going';
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}
