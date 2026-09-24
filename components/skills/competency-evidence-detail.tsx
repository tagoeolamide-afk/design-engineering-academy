'use client';

import Link from 'next/link';
import { Check, CircleDashed, CircleDot } from 'lucide-react';
import { EvidenceSummary } from '@/components/skills/evidence-marks';
import { cn } from '@/lib/utils/cn';
import { formatCountOf } from '@/lib/utils/format';
import {
  useCompetencyEvidence,
  useProgressHydrated,
  useProgressSnapshot,
} from '@/lib/hooks/use-progress';
import { getLessonRecord, getProjectStatus, isLessonComplete } from '@/lib/progress/derive';
import {
  EVIDENCE_LEVEL_DEFINITIONS,
  EVIDENCE_LEVEL_LABELS,
  type Competency,
} from '@/types/competency';
import type { LessonLocation, ProjectLocation } from '@/types/curriculum';

/**
 * Which specific work produced the evidence for one competency.
 *
 * The point of this screen is attribution. A count on the overview says "three
 * lessons"; this says which three, and shows the rest so the learner can see
 * exactly what would add to the record rather than guessing at a target.
 */
export interface CompetencyEvidenceDetailProps {
  readonly competency: Competency;
  readonly lessons: readonly LessonLocation[];
  readonly projects: readonly ProjectLocation[];
}

export function CompetencyEvidenceDetail({
  competency,
  lessons,
  projects,
}: CompetencyEvidenceDetailProps) {
  const snapshot = useProgressSnapshot();
  const evidence = useCompetencyEvidence()[competency.id];
  const hydrated = useProgressHydrated();

  const lessonRows = lessons.map((location) => {
    const record = getLessonRecord(snapshot, location.lesson.id);
    return {
      location,
      lessonComplete: hydrated && isLessonComplete(record),
      exerciseComplete: hydrated && record.exerciseCompletedAt !== null,
    };
  });

  const projectRows = projects.map((location) => ({
    location,
    complete: hydrated && getProjectStatus(snapshot, location.project.id) === 'completed',
  }));

  return (
    <div className="space-y-10">
      <EvidenceSection
        level="exposure"
        heading="Exposure"
        total={lessons.length}
        summary={<EvidenceSummary evidence={evidence} level="exposure" hydrated={hydrated} />}
      >
        <LessonEvidenceList
          rows={lessonRows}
          isEvidence={(row) => row.lessonComplete}
          emptyLabel="No lesson teaches this competency."
          outstandingLabel="Lessons that would add to this record"
        />
      </EvidenceSection>

      <EvidenceSection
        level="practised"
        heading="Practised"
        total={lessons.length}
        summary={<EvidenceSummary evidence={evidence} level="practised" hydrated={hydrated} />}
      >
        <LessonEvidenceList
          rows={lessonRows}
          isEvidence={(row) => row.exerciseComplete}
          emptyLabel="No exercise develops this competency."
          outstandingLabel="Exercises that would add to this record"
        />
      </EvidenceSection>

      <EvidenceSection
        level="demonstrated"
        heading="Demonstrated"
        total={projects.length}
        summary={
          <EvidenceSummary evidence={evidence} level="demonstrated" hydrated={hydrated} />
        }
      >
        {projects.length === 0 ? (
          <p className="max-w-measure text-small text-text-muted">
            No module project is tagged with this competency, so there is nothing here to
            demonstrate it. That is a gap in the curriculum rather than a gap in the work —
            the lessons above are the evidence available for it.
          </p>
        ) : (
          <ProjectEvidenceList rows={projectRows} />
        )}
      </EvidenceSection>
    </div>
  );
}

function EvidenceSection({
  level,
  heading,
  total,
  summary,
  children,
}: {
  level: keyof typeof EVIDENCE_LEVEL_DEFINITIONS;
  heading: string;
  total: number;
  summary: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section aria-labelledby={`evidence-${level}`}>
      <div className="border-b border-border pb-3">
        <div className="flex items-baseline justify-between gap-4">
          <h2 id={`evidence-${level}`} className="text-subheading text-text-primary">
            {heading}
          </h2>
          <span className="shrink-0 text-caption uppercase text-text-muted">
            {EVIDENCE_LEVEL_LABELS[level]}
          </span>
        </div>
        <p className="mt-1 text-small text-text-muted">
          {EVIDENCE_LEVEL_DEFINITIONS[level]}
        </p>
        <div className="mt-2">{summary}</div>
      </div>

      {total > 0 || level === 'demonstrated' ? (
        <div className="mt-4">{children}</div>
      ) : (
        <p className="mt-4 text-small text-text-muted">
          Nothing in the curriculum is tagged for this yet.
        </p>
      )}
    </section>
  );
}

interface LessonRow {
  readonly location: LessonLocation;
  readonly lessonComplete: boolean;
  readonly exerciseComplete: boolean;
}

function LessonEvidenceList({
  rows,
  isEvidence,
  emptyLabel,
  outstandingLabel,
}: {
  rows: readonly LessonRow[];
  isEvidence: (row: LessonRow) => boolean;
  emptyLabel: string;
  outstandingLabel: string;
}) {
  if (rows.length === 0) {
    return <p className="text-small text-text-muted">{emptyLabel}</p>;
  }

  const evidence = rows.filter(isEvidence);
  const outstanding = rows.filter((row) => !isEvidence(row));

  return (
    <div className="space-y-5">
      {evidence.length > 0 && (
        <div>
          <p className="mb-2 text-caption uppercase text-text-muted">
            {formatCountOf(evidence.length, 'completed', 'completed')} · this is the evidence
          </p>
          <ul>
            {evidence.map((row) => (
              <LessonLine key={row.location.lesson.id} location={row.location} complete />
            ))}
          </ul>
        </div>
      )}

      {outstanding.length > 0 && (
        <div>
          <p className="mb-2 text-caption uppercase text-text-muted">{outstandingLabel}</p>
          <ul>
            {outstanding.map((row) => (
              <LessonLine
                key={row.location.lesson.id}
                location={row.location}
                complete={false}
              />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function LessonLine({
  location,
  complete,
}: {
  location: LessonLocation;
  complete: boolean;
}) {
  const { lesson, courseModule } = location;
  const Icon = complete ? Check : CircleDashed;

  return (
    <li className="border-b border-border last:border-b-0">
      <Link
        href={`/curriculum/${courseModule.slug}/${lesson.slug}`}
        className="group flex items-baseline gap-3 py-2.5"
      >
        <Icon
          aria-hidden
          className={cn(
            'size-3.5 shrink-0 translate-y-0.5',
            complete ? 'text-success' : 'text-text-muted',
          )}
        />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-small text-text-primary group-hover:underline group-hover:decoration-border group-hover:underline-offset-4">
            {lesson.title}
          </span>
          <span className="mt-0.5 block text-caption uppercase text-text-muted">
            Module {courseModule.moduleNumber} · {courseModule.title}
          </span>
        </span>
        <span className="sr-only">{complete ? 'Completed' : 'Not completed'}</span>
      </Link>
    </li>
  );
}

function ProjectEvidenceList({
  rows,
}: {
  rows: readonly { readonly location: ProjectLocation; readonly complete: boolean }[];
}) {
  const evidence = rows.filter((row) => row.complete);
  const outstanding = rows.filter((row) => !row.complete);

  return (
    <div className="space-y-5">
      {evidence.length > 0 && (
        <div>
          <p className="mb-2 text-caption uppercase text-text-muted">
            {formatCountOf(evidence.length, 'completed', 'completed')} · this is the evidence
          </p>
          <ul>
            {evidence.map((row) => (
              <ProjectLine key={row.location.project.id} location={row.location} complete />
            ))}
          </ul>
        </div>
      )}

      {outstanding.length > 0 && (
        <div>
          <p className="mb-2 text-caption uppercase text-text-muted">
            Projects that would demonstrate this
          </p>
          <ul>
            {outstanding.map((row) => (
              <ProjectLine
                key={row.location.project.id}
                location={row.location}
                complete={false}
              />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function ProjectLine({
  location,
  complete,
}: {
  location: ProjectLocation;
  complete: boolean;
}) {
  const { project, courseModule } = location;
  const Icon = complete ? Check : CircleDot;

  return (
    <li className="border-b border-border last:border-b-0">
      <Link
        href={`/projects/${courseModule.slug}`}
        className="group flex items-baseline gap-3 py-2.5"
      >
        <Icon
          aria-hidden
          className={cn(
            'size-3.5 shrink-0 translate-y-0.5',
            complete ? 'text-success' : 'text-text-muted',
          )}
        />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-small text-text-primary group-hover:underline group-hover:decoration-border group-hover:underline-offset-4">
            {project.title}
          </span>
          <span className="mt-0.5 block text-caption uppercase text-text-muted">
            Module {courseModule.moduleNumber} · {project.estimatedHours} hours
          </span>
        </span>
        <span className="sr-only">{complete ? 'Completed' : 'Not completed'}</span>
      </Link>
    </li>
  );
}
