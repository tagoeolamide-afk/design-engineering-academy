'use client';

import { Bookmark, Check, CircleDot } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useResourceStatus, useResourcesHydrated } from '@/lib/hooks/use-resources';
import { useResourceStore } from '@/stores/resource-store';
import {
  RESOURCE_STATUSES,
  RESOURCE_STATUS_LABELS,
  type ResourceStatus,
} from '@/types/resources';

const ICONS: Readonly<Record<ResourceStatus, LucideIcon>> = {
  saved: Bookmark,
  started: CircleDot,
  completed: Check,
};

/**
 * Saved, started, completed — one status, not three checkboxes.
 *
 * Rendered as a group of toggle buttons rather than a radio group, because the
 * active one can be pressed again to clear it. Each button states its own label
 * to assistive technology and carries a distinct glyph, so the current status is
 * never signalled by colour alone.
 */
export function ResourceStatusControl({
  resourceId,
  title,
}: {
  readonly resourceId: string;
  readonly title: string;
}) {
  const status = useResourceStatus(resourceId);
  const hydrated = useResourcesHydrated();
  const toggle = useResourceStore((state) => state.toggleResourceStatus);

  return (
    <div
      role="group"
      aria-label={`Mark “${title}”`}
      className="flex shrink-0 items-center gap-1"
    >
      {RESOURCE_STATUSES.map((candidate) => {
        const Icon = ICONS[candidate];
        const active = hydrated && status === candidate;

        return (
          <button
            key={candidate}
            type="button"
            aria-pressed={active}
            disabled={!hydrated}
            onClick={() => toggle(resourceId, candidate)}
            title={
              active
                ? `${RESOURCE_STATUS_LABELS[candidate]} — press to clear`
                : RESOURCE_STATUS_LABELS[candidate]
            }
            className={cn(
              'inline-flex min-h-8 items-center gap-1.5 rounded-small border px-2 py-1 text-caption uppercase transition-colors',
              'disabled:pointer-events-none disabled:opacity-45',
              active
                ? 'border-transparent bg-accent-subtle text-accent-text'
                : 'border-border text-text-muted hover:text-text-secondary',
            )}
          >
            <Icon aria-hidden size={13} strokeWidth={2} />
            <span>{RESOURCE_STATUS_LABELS[candidate]}</span>
            <span className="sr-only">
              {active ? ` — currently ${RESOURCE_STATUS_LABELS[candidate].toLowerCase()}` : ''}
            </span>
          </button>
        );
      })}
    </div>
  );
}
