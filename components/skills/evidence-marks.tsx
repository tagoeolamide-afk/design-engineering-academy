import { Check, CircleDashed, CircleDot, Minus } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { evidenceCount, evidenceTotal } from '@/lib/progress/derive';
import {
  EVIDENCE_LEVELS,
  EVIDENCE_LEVEL_LABELS,
  type EvidenceLevel,
} from '@/types/competency';
import type { CompetencyEvidence } from '@/types/progress';

/**
 * The three evidence records for one competency.
 *
 * Deliberately not a bar and not a score. Each mark is a count of completed
 * work over the work the curriculum actually tags with this competency, so both
 * numbers are real. A level with no tagged work at all says so rather than
 * rendering as zero, which would read as a measured absence of ability.
 *
 * Colour is never the only signal: every state carries its own glyph.
 */

const NOT_APPLICABLE_LABEL = 'Nothing tagged';

interface MarkState {
  readonly icon: typeof Check;
  readonly className: string;
  readonly srSuffix: string;
}

function markState(count: number | null, total: number): MarkState {
  if (total === 0) {
    return {
      icon: Minus,
      className: 'text-text-muted/60',
      srSuffix: `${NOT_APPLICABLE_LABEL.toLowerCase()} yet`,
    };
  }
  /* Not loaded is not the same as none, and the screen reader must not be
   * told otherwise. */
  if (count === null) {
    return { icon: CircleDashed, className: 'text-text-muted/60', srSuffix: 'not loaded yet' };
  }
  if (count === 0) {
    return { icon: CircleDashed, className: 'text-text-muted', srSuffix: 'none yet' };
  }
  if (count === total) {
    return { icon: Check, className: 'text-success', srSuffix: `all ${total}` };
  }
  return { icon: CircleDot, className: 'text-accent-text', srSuffix: `${count} of ${total}` };
}

export interface EvidenceMarksProps {
  readonly evidence: CompetencyEvidence;
  readonly competencyLabel: string;
  /** false while progress is still loading, so nothing claims a count it cannot know. */
  readonly hydrated: boolean;
  readonly className?: string;
}

/** Compact row of three marks, for scanning a list of competencies. */
export function EvidenceMarks({
  evidence,
  competencyLabel,
  hydrated,
  className,
}: EvidenceMarksProps) {
  return (
    <ul className={cn('flex items-center gap-3', className)}>
      {EVIDENCE_LEVELS.map((level) => {
        const total = evidenceTotal(evidence, level);
        const count = hydrated ? evidenceCount(evidence, level) : null;
        const state = markState(count, total);
        const Icon = state.icon;

        return (
          <li key={level} className="flex items-center gap-1">
            <Icon aria-hidden className={cn('size-3.5 shrink-0', state.className)} />
            <span className="sr-only">
              {`${EVIDENCE_LEVEL_LABELS[level]} for ${competencyLabel}: ${state.srSuffix}.`}
            </span>
            <span aria-hidden className="text-caption tabular-nums text-text-muted">
              {total === 0 ? '—' : `${count ?? '—'}/${total}`}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

export interface EvidenceSummaryProps {
  readonly evidence: CompetencyEvidence;
  readonly level: EvidenceLevel;
  readonly hydrated: boolean;
}

/** A single level stated in full, for the competency detail screen. */
export function EvidenceSummary({ evidence, level, hydrated }: EvidenceSummaryProps) {
  const total = evidenceTotal(evidence, level);
  const count = hydrated ? evidenceCount(evidence, level) : null;
  const state = markState(count, total);
  const Icon = state.icon;

  /* Each level counts a different thing, so each states its own noun. Saying
   * "lessons" under Practised would misdescribe what was actually finished. */
  const noun =
    level === 'demonstrated' ? 'project' : level === 'practised' ? 'exercise' : 'lesson';
  const source = level === 'demonstrated' ? 'project' : 'lesson';

  return (
    <p className="flex items-center gap-2 text-small text-text-secondary">
      <Icon aria-hidden className={cn('size-4 shrink-0', state.className)} />
      {total === 0 ? (
        <span>No {source} in the curriculum carries this competency.</span>
      ) : (
        <span>
          <span className="tabular-nums text-text-primary">{count ?? '—'}</span> of{' '}
          <span className="tabular-nums">{total}</span> tagged {noun}
          {total === 1 ? '' : 's'} completed.
        </span>
      )}
    </p>
  );
}

/** Legend explaining the marks, shown once per screen rather than per row. */
export function EvidenceLegend({ className }: { readonly className?: string }) {
  return (
    <ul className={cn('flex flex-wrap items-center gap-x-5 gap-y-1.5', className)}>
      <LegendItem icon={Check} tone="text-success" label="All tagged work complete" />
      <LegendItem icon={CircleDot} tone="text-accent-text" label="Some complete" />
      <LegendItem icon={CircleDashed} tone="text-text-muted" label="None yet" />
      <LegendItem icon={Minus} tone="text-text-muted/60" label={NOT_APPLICABLE_LABEL} />
    </ul>
  );
}

function LegendItem({
  icon: Icon,
  tone,
  label,
}: {
  icon: typeof Check;
  tone: string;
  label: string;
}) {
  return (
    <li className="flex items-center gap-1.5 text-caption uppercase text-text-muted">
      <Icon aria-hidden className={cn('size-3.5', tone)} />
      {label}
    </li>
  );
}
