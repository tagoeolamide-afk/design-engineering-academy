'use client';

import { BookUp } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useNotesStore } from '@/stores/notes-store';
import { useProgressStore } from '@/stores/progress-store';
import { useProgressSnapshot } from '@/lib/hooks/use-progress';
import { planCurriculumMigration } from '@/lib/progress/curriculum-migration';

/**
 * Shown once, when stored progress refers to an older curriculum.
 *
 * The same quiet strip the cloud load error uses rather than a modal: nothing
 * here is urgent, and blocking the application to deliver news about lesson
 * numbering would be out of proportion.
 *
 * It appears only when there is something real to say — records that no longer
 * resolve, or notes attached to a module that now covers a different subject.
 * A learner with no pre-v2 data never sees it.
 *
 * Both actions apply the same migration. The difference is whether the learner
 * is shown what moved: "start" trusts the summary, "review" expands it. Neither
 * deletes anything — archived records stay in the stored document.
 */
export function CurriculumUpgradeNotice() {
  const progress = useProgressSnapshot();
  const notes = useNotesStore((state) => state.notes);
  const hasHydrated = useProgressStore((state) => state.hasHydrated);
  const upgradeCurriculum = useProgressStore((state) => state.upgradeCurriculum);

  const [isReviewing, setIsReviewing] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  /* Before hydration the store holds the empty default, which would read as
   * "already current" and hide a notice that should appear a moment later. */
  if (hasHydrated === false || isDismissed) return null;

  const plan = planCurriculumMigration(progress, { notes });
  if (plan.needsUpgrade === false) return null;

  const archivedLessons = plan.archivedLessonIds.length;
  const archivedProjects = plan.archivedProjectIds.length;
  const touchedNotes = plan.orphanedNoteIds.length + plan.reattributedNoteIds.length;

  const start = () => {
    upgradeCurriculum();
    setIsDismissed(true);
  };

  const review = () => {
    upgradeCurriculum();
    setIsReviewing(true);
  };

  return (
    <div role="status" className="border-b border-border bg-surface-elevated px-4 py-3 md:px-8">
      <div className="flex flex-wrap items-start gap-x-3 gap-y-2">
        <BookUp
          aria-hidden
          size={15}
          strokeWidth={1.75}
          className="mt-0.5 shrink-0 text-text-secondary"
        />

        <div className="min-w-0 flex-1">
          <p className="text-small font-medium text-text-primary">
            Your curriculum has been upgraded.
          </p>
          <p className="mt-1 text-small text-text-secondary">
            Lesson content and ordering changed, and every lesson has a new identifier, so
            completion recorded against the old curriculum no longer matches a lesson. It is
            kept, not deleted — but it is set aside rather than counted, because it would
            otherwise claim progress through material you have not seen.
          </p>

          {isReviewing && (
            <div className="mt-3 rounded-medium border border-border bg-surface/60 p-3">
              <p className="text-caption uppercase text-text-muted">What moved</p>
              <ul className="mt-2 space-y-1 text-small text-text-secondary">
                <li>
                  {archivedLessons} lesson {archivedLessons === 1 ? 'record' : 'records'} archived
                  {plan.archivedReflections > 0 && (
                    <>, including {plan.archivedReflections} reflection
                      {plan.archivedReflections === 1 ? '' : 's'} you wrote</>
                  )}
                  {plan.archivedExerciseNotes > 0 && (
                    <> and {plan.archivedExerciseNotes} set
                      {plan.archivedExerciseNotes === 1 ? '' : 's'} of exercise notes</>
                  )}
                  .
                </li>
                <li>
                  {archivedProjects} project {archivedProjects === 1 ? 'record' : 'records'} archived
                  {plan.archivedProjectLinks > 0 && (
                    <>, with {plan.archivedProjectLinks} link
                      {plan.archivedProjectLinks === 1 ? '' : 's'} to your work preserved</>
                  )}
                  .
                </li>
                {plan.keptLessonIds.length > 0 && (
                  <li>
                    {plan.keptLessonIds.length} lesson{' '}
                    {plan.keptLessonIds.length === 1 ? 'record' : 'records'} still match the new
                    curriculum and were left alone.
                  </li>
                )}
                {touchedNotes > 0 && (
                  <li>
                    {touchedNotes} {touchedNotes === 1 ? 'note was' : 'notes were'} unpinned from a
                    lesson or module that no longer means the same thing. The writing is intact;
                    only the attachment was removed, and each one records what it used to point at.
                  </li>
                )}
              </ul>
              <p className="mt-3 text-small text-text-muted">
                Nothing was deleted. Archived records remain in your saved document.
              </p>
            </div>
          )}
        </div>

        <div className="flex shrink-0 flex-wrap gap-2">
          {isReviewing ? (
            <Button variant="secondary" size="small" onClick={() => setIsDismissed(true)}>
              Done
            </Button>
          ) : (
            <>
              <Button variant="primary" size="small" onClick={start}>
                Start revised curriculum
              </Button>
              <Button variant="secondary" size="small" onClick={review}>
                Review migrated progress
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
