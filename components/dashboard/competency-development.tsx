'use client';

import Link from 'next/link';
import { PENDING_FIGURE } from '@/lib/utils/format';
import { EvidenceLegend, EvidenceMarks } from '@/components/skills/evidence-marks';
import { COMPETENCIES_BY_CATEGORY } from '@/content/competencies';
import { useCompetencyEvidence, useProgressHydrated } from '@/lib/hooks/use-progress';
import { hasEvidence } from '@/lib/progress/derive';
import {
  COMPETENCY_CATEGORIES,
  COMPETENCY_CATEGORY_LABELS,
  EVIDENCE_LEVELS,
  EVIDENCE_LEVEL_LABELS,
} from '@/types/competency';
import type { Competency } from '@/types/competency';
import type { CompetencyEvidence } from '@/types/progress';

/**
 * Answers "which skills am I developing?".
 *
 * Each competency carries three records of completed work — a lesson finished,
 * an exercise finished, a project finished — and nothing else. No bar sums them
 * into a score, because a competency is not a quantity and summing them would
 * invent one.
 */
export function CompetencyDevelopment() {
  const evidence = useCompetencyEvidence();
  const hydrated = useProgressHydrated();
  const all = Object.values(evidence);

  return (
    <div className="space-y-6">
      <dl className="grid gap-3 sm:grid-cols-3">
        {EVIDENCE_LEVELS.map((level) => (
          <div
            key={level}
            className="rounded-medium border border-border bg-surface-elevated px-3 py-2.5"
          >
            <dt className="text-caption uppercase text-text-muted">
              {EVIDENCE_LEVEL_LABELS[level]}
            </dt>
            <dd className="mt-0.5 text-small text-text-primary" data-numeric>
              {hydrated ? all.filter((entry) => hasEvidence(entry, level)).length : PENDING_FIGURE} of{' '}
              {all.length}
            </dd>
          </div>
        ))}
      </dl>

      {COMPETENCY_CATEGORIES.map((category) => (
        <section key={category} aria-labelledby={`dashboard-competency-${category}`}>
          <h3
            id={`dashboard-competency-${category}`}
            className="mb-2 text-caption uppercase text-text-muted"
          >
            {COMPETENCY_CATEGORY_LABELS[category]}
          </h3>

          <ul>
            {COMPETENCIES_BY_CATEGORY[category].map((competency) => (
              <CompetencyRow
                key={competency.id}
                competency={competency}
                evidence={evidence[competency.id]}
                hydrated={hydrated}
              />
            ))}
          </ul>
        </section>
      ))}

      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t border-border pt-4">
        <EvidenceLegend />
        <Link
          href="/skills"
          className="text-small text-text-secondary underline decoration-border underline-offset-4 hover:text-text-primary"
        >
          See what produced each record
        </Link>
      </div>
    </div>
  );
}

function CompetencyRow({
  competency,
  evidence,
  hydrated,
}: {
  competency: Competency;
  evidence: CompetencyEvidence;
  hydrated: boolean;
}) {
  /* Widened to string so the interpolated href matches the generated route
   * pattern, rather than resolving to a union of thirty-three literal routes
   * that typedRoutes will not accept. */
  const competencyId: string = competency.id;

  return (
    <li className="border-b border-border">
      <Link
        href={`/skills/${competencyId}`}
        className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 py-2"
      >
        <span
          className="truncate text-small text-text-primary hover:underline hover:decoration-border hover:underline-offset-4"
          title={competency.description}
        >
          {competency.label}
        </span>
        <EvidenceMarks
          evidence={evidence}
          competencyLabel={competency.label}
          hydrated={hydrated}
          className="justify-end"
        />
      </Link>
    </li>
  );
}
