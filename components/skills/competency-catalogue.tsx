'use client';

import Link from 'next/link';
import { PENDING_FIGURE } from '@/lib/utils/format';
import { ChevronRight } from 'lucide-react';
import { EvidenceLegend, EvidenceMarks } from '@/components/skills/evidence-marks';
import { COMPETENCIES_BY_CATEGORY } from '@/content/competencies';
import { useCompetencyEvidence, useProgressHydrated } from '@/lib/hooks/use-progress';
import { hasEvidence } from '@/lib/progress/derive';
import {
  COMPETENCY_CATEGORIES,
  COMPETENCY_CATEGORY_DESCRIPTIONS,
  COMPETENCY_CATEGORY_LABELS,
  EVIDENCE_LEVELS,
  EVIDENCE_LEVEL_DEFINITIONS,
  EVIDENCE_LEVEL_LABELS,
} from '@/types/competency';
import type { CompetencyEvidence } from '@/types/progress';
import type { Competency } from '@/types/competency';

/**
 * Every competency, grouped by category, with its three evidence records.
 *
 * There is no overall score and no per-competency percentage, because neither
 * would mean anything: a competency is not a quantity. What the platform can
 * honestly say is which specific pieces of work have been completed, so that is
 * what it says — and the detail screen names them.
 */
export function CompetencyCatalogue() {
  const evidence = useCompetencyEvidence();
  const hydrated = useProgressHydrated();

  return (
    <div className="space-y-12">
      <EvidenceKey evidence={evidence} hydrated={hydrated} />

      {COMPETENCY_CATEGORIES.map((category) => (
        <section key={category} aria-labelledby={`category-${category}`}>
          <div className="border-b border-border pb-3">
            <div className="flex items-baseline justify-between gap-4">
              <h2
                id={`category-${category}`}
                className="text-heading text-text-primary"
              >
                {COMPETENCY_CATEGORY_LABELS[category]}
              </h2>
              <span className="shrink-0 text-caption uppercase text-text-muted" data-numeric>
                {COMPETENCIES_BY_CATEGORY[category].length} competencies
              </span>
            </div>
            <p className="mt-1.5 max-w-measure text-small text-text-muted">
              {COMPETENCY_CATEGORY_DESCRIPTIONS[category]}
            </p>
          </div>

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
    </div>
  );
}

/**
 * The definitions, plus how many competencies currently carry each kind of
 * evidence. Counting competencies is honest — it is a count of records, not a
 * rating of the learner.
 */
function EvidenceKey({
  evidence,
  hydrated,
}: {
  evidence: Readonly<Record<string, CompetencyEvidence>>;
  hydrated: boolean;
}) {
  const all = Object.values(evidence);

  return (
    <section
      aria-labelledby="evidence-key"
      className="rounded-medium border border-border bg-surface-elevated p-5"
    >
      <h2 id="evidence-key" className="text-small font-medium text-text-primary">
        What counts as evidence
      </h2>

      <dl className="mt-4 grid gap-4 sm:grid-cols-3">
        {EVIDENCE_LEVELS.map((level) => {
          const covered = hydrated
            ? all.filter((entry) => hasEvidence(entry, level)).length
            : 0;

          return (
            <div key={level}>
              <dt className="flex items-baseline justify-between gap-2">
                <span className="text-caption uppercase text-text-secondary">
                  {EVIDENCE_LEVEL_LABELS[level]}
                </span>
                <span className="text-caption uppercase text-text-muted" data-numeric>
                  {hydrated ? covered : PENDING_FIGURE} / {all.length}
                </span>
              </dt>
              <dd className="mt-1 text-small text-text-muted">
                {EVIDENCE_LEVEL_DEFINITIONS[level]}
              </dd>
            </div>
          );
        })}
      </dl>

      <p className="mt-4 max-w-measure text-small text-text-muted">
        These are records of finished work, not a rating. Completing every lesson on a
        topic means the material has been worked through — it does not make anyone an
        expert in it, and this page will never say that it does.
      </p>

      <EvidenceLegend className="mt-4 border-t border-border pt-4" />
    </section>
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
        className="group grid grid-cols-[1fr_auto] items-start gap-x-4 gap-y-2 py-4 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:items-center"
      >
        <span className="min-w-0">
          <span className="block text-small font-medium text-text-primary group-hover:underline group-hover:decoration-border group-hover:underline-offset-4">
            {competency.label}
          </span>
          <span className="mt-1 block max-w-measure-narrow text-small text-text-muted">
            {competency.description}
          </span>
        </span>

        <EvidenceMarks
          evidence={evidence}
          competencyLabel={competency.label}
          hydrated={hydrated}
          className="col-span-2 sm:col-span-1 sm:justify-end"
        />

        <ChevronRight
          aria-hidden
          className="hidden size-4 shrink-0 text-text-muted group-hover:text-text-secondary sm:block"
        />
      </Link>
    </li>
  );
}
