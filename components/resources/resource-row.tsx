'use client';

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import type { Route } from 'next';
import { Badge } from '@/components/ui/badge';
import { ResourceStatusControl } from './resource-status-control';
import { resolveRelatedLinks } from '@/lib/resources/library';
import {
  LIBRARY_RESOURCE_TYPE_LABELS,
  RESOURCE_DIFFICULTY_LABELS,
  type LibraryResource,
} from '@/types/resources';

/**
 * One resource.
 *
 * The title is the external link and carries the whole safety contract:
 * `rel="noreferrer noopener"` so the target cannot reach back through
 * `window.opener` or read the referrer, plus a visible arrow and a
 * screen-reader note so nobody is surprised by a new tab.
 */
export function ResourceRow({ resource }: { readonly resource: LibraryResource }) {
  const related = resolveRelatedLinks(resource);

  return (
    <li className="border-b border-border py-5">
      <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
        <div className="min-w-0 flex-1">
          <h3 className="text-small font-medium text-text-primary">
            <a
              href={resource.url}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-baseline gap-1 underline decoration-border underline-offset-4 hover:decoration-text-muted"
            >
              {resource.title}
              <ArrowUpRight aria-hidden size={13} strokeWidth={2} className="shrink-0" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </h3>

          <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-caption uppercase text-text-muted">
            <span>{resource.author}</span>
            <span aria-hidden>·</span>
            <span>{LIBRARY_RESOURCE_TYPE_LABELS[resource.type]}</span>
            <span aria-hidden>·</span>
            <span>{RESOURCE_DIFFICULTY_LABELS[resource.difficulty]}</span>
            {resource.official && (
              <>
                <span aria-hidden>·</span>
                <Badge tone="accent">Official</Badge>
              </>
            )}
          </p>

          <p className="mt-2.5 max-w-measure text-small text-text-secondary">
            {resource.reason}
          </p>

          {(related.modules.length > 0 || related.lessons.length > 0) && (
            <p className="mt-2.5 flex flex-wrap items-baseline gap-x-2 gap-y-1 text-caption text-text-muted">
              <span className="uppercase">Supports</span>
              {related.modules.map((link) => (
                <RelatedChip key={link.href} href={link.href} label={link.label} />
              ))}
              {related.lessons.map((link) => (
                <RelatedChip key={link.href} href={link.href} label={link.label} />
              ))}
            </p>
          )}
        </div>

        <ResourceStatusControl resourceId={resource.id} title={resource.title} />
      </div>
    </li>
  );
}

function RelatedChip({ href, label }: { readonly href: string; readonly label: string }) {
  return (
    <Link
      href={href as Route}
      /* min-h-6 keeps the target at 24px so it meets WCAG 2.2 target size.
       * Without it these wrap to 19px rows only 23px apart, which fails both
       * the size minimum and the spacing exception that would excuse it. */
      className="inline-flex min-h-6 items-center rounded-small bg-surface-elevated px-1.5 py-0.5 text-text-secondary underline decoration-transparent underline-offset-4 hover:decoration-border"
    >
      {label}
    </Link>
  );
}
