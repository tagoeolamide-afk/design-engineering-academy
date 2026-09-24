'use client';

import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { describeScope } from '@/lib/notes/scope';
import type { NoteScope } from '@/types/notes';

/**
 * "Open source lesson": a link back to whatever the note is attached to.
 *
 * Renders nothing when the note is global or when its target no longer
 * resolves, rather than a dead link that looks clickable.
 */
export function ScopeLink({ scope }: { scope: NoteScope }) {
  const described = describeScope(scope);
  if (described.target === null) return null;

  const className =
    'inline-flex items-center gap-1.5 text-small text-text-secondary underline decoration-border underline-offset-4 hover:text-text-primary hover:decoration-text-muted';

  const label =
    described.kind === 'lesson'
      ? 'Open lesson'
      : described.kind === 'project'
        ? 'Open project'
        : 'Open module';

  if (described.target.kind === 'lesson') {
    return (
      <Link
        href={`/curriculum/${described.target.moduleSlug}/${described.target.lessonSlug}`}
        className={className}
      >
        {label}
        <ArrowUpRight aria-hidden size={13} strokeWidth={2} />
      </Link>
    );
  }

  if (described.target.kind === 'project') {
    return (
      <Link href={`/projects/${described.target.moduleSlug}`} className={className}>
        {label}
        <ArrowUpRight aria-hidden size={13} strokeWidth={2} />
      </Link>
    );
  }

  return (
    <Link href={`/curriculum/${described.target.moduleSlug}`} className={className}>
      {label}
      <ArrowUpRight aria-hidden size={13} strokeWidth={2} />
    </Link>
  );
}
