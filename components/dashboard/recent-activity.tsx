'use client';

import { Activity } from 'lucide-react';
import Link from 'next/link';
import { EmptyState } from '@/components/ui/empty-state';
import { useMounted } from '@/lib/hooks/use-mounted';
import { useProgressHydrated, useRecentActivity } from '@/lib/hooks/use-progress';
import { activityLabel, type ActivityEvent } from '@/lib/progress/activity';
import { formatRelativeTime } from '@/lib/utils/format';

/**
 * A log of what has actually been done, read from the timestamps on stored
 * progress. Nothing here is inferred or embellished — if it is listed, the
 * learner did it and the record says when.
 */
export function RecentActivity() {
  const events = useRecentActivity(8);
  const hydrated = useProgressHydrated();

  if (!hydrated) {
    return (
      <p className="text-small text-text-muted" role="status">
        Loading activity…
      </p>
    );
  }

  if (events.length === 0) {
    return (
      <EmptyState
        icon={Activity}
        title="No activity yet"
        description="Opening a lesson, ticking its exercise, saving a reflection, or completing a project will be recorded here."
      />
    );
  }

  return (
    <ol className="border-t border-border">
      {events.map((event) => (
        <ActivityRow key={event.id} event={event} />
      ))}
    </ol>
  );
}

function ActivityRow({ event }: { event: ActivityEvent }) {
  /* Relative time is computed from the current clock, so it is rendered only
   * after mount to keep the server and client markup identical. */
  const mounted = useMounted();

  return (
    <li className="flex items-baseline justify-between gap-4 border-b border-border py-2.5">
      <div className="min-w-0">
        <p className="text-small text-text-primary">
          {activityLabel(event.kind)}
          <span className="text-text-muted"> · </span>
          <ActivityLink event={event} />
        </p>
        <p className="mt-0.5 truncate text-caption uppercase text-text-muted">
          {event.context}
        </p>
      </div>

      <time
        dateTime={event.at}
        className="shrink-0 text-caption text-text-muted"
        data-numeric
      >
        {mounted ? formatRelativeTime(event.at) : ''}
      </time>
    </li>
  );
}

/**
 * The route is built here rather than in the derivation, so typed routes can
 * verify the literal against the real route tree.
 */
function ActivityLink({ event }: { event: ActivityEvent }) {
  const className =
    'text-text-secondary underline decoration-border underline-offset-4 hover:decoration-text-muted';

  if (event.target.kind === 'project') {
    return (
      <Link href={`/projects/${event.target.moduleSlug}`} className={className}>
        {event.subject}
      </Link>
    );
  }

  return (
    <Link
      href={`/curriculum/${event.target.moduleSlug}/${event.target.lessonSlug}`}
      className={className}
    >
      {event.subject}
    </Link>
  );
}
