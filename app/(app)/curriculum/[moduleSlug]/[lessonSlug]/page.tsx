import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CommonMistakes } from '@/components/lesson/common-mistakes';
import { IndustryExamples } from '@/components/lesson/industry-examples';
import { LessonCompletionPanel } from '@/components/lesson/lesson-completion-panel';
import { LessonHeader } from '@/components/lesson/lesson-header';
import { LessonLayout } from '@/components/lesson/lesson-layout';
import { LessonModuleNav } from '@/components/lesson/lesson-module-nav';
import { LessonNavigation } from '@/components/lesson/lesson-navigation';
import { LessonResources } from '@/components/lesson/lesson-resources';
import { LessonSection } from '@/components/lesson/lesson-section';
import { LessonStatusPanel } from '@/components/lesson/lesson-status-panel';
import { LessonToc } from '@/components/lesson/lesson-toc';
import { Perspectives } from '@/components/lesson/perspectives';
import { PracticalExercise } from '@/components/lesson/practical-exercise';
import { Prose } from '@/components/lesson/prose';
import { LessonEndMarker, LessonVisitTracker } from '@/components/lesson/reading-tracker';
import { Reflection } from '@/components/lesson/reflection';
import { sectionsFor } from '@/components/lesson/sections';
import { Badge } from '@/components/ui/badge';
import { getLessonNextStep } from '@/lib/curriculum/next-step';
import {
  getAllLessons,
  getLessonByPath,
  getLessonNavigation,
  getPhaseById,
  getPrerequisiteLessons,
  getRelatedCompetencies,
} from '@/lib/curriculum/queries';
import { TOTAL_LESSONS } from '@/types/curriculum';

interface LessonPageProps {
  readonly params: Promise<{
    readonly moduleSlug: string;
    readonly lessonSlug: string;
  }>;
}

export function generateStaticParams(): { moduleSlug: string; lessonSlug: string }[] {
  return getAllLessons().map(({ courseModule, lesson }) => ({
    moduleSlug: courseModule.slug,
    lessonSlug: lesson.slug,
  }));
}

export async function generateMetadata({ params }: LessonPageProps): Promise<Metadata> {
  const { moduleSlug, lessonSlug } = await params;
  const location = getLessonByPath(moduleSlug, lessonSlug);
  if (location === null) return { title: 'Lesson not found' };
  return { title: location.lesson.title, description: location.lesson.summary };
}

/**
 * The lesson.
 *
 * Every section is rendered from the schema in a fixed order, so lessons are
 * structurally identical and the learner never has to re-learn the page. The
 * body is a sequence of clearly ruled sections rather than one continuous run
 * of text, and the reading column stays at a fixed measure at every width.
 *
 * Only the three interactive parts — exercise, reflection, and the progress
 * trackers — are client components. The lesson text itself is static.
 */
export default async function LessonPage({ params }: LessonPageProps) {
  const { moduleSlug, lessonSlug } = await params;
  const location = getLessonByPath(moduleSlug, lessonSlug);
  if (location === null) notFound();

  const { lesson, courseModule } = location;
  const phase = getPhaseById(courseModule.phase);
  const navigation = getLessonNavigation(lesson.id);
  const competencies = getRelatedCompetencies(lesson.id);
  const sections = sectionsFor(lesson);

  /* The panel's data is assembled here so the client component receives plain
   * values and every curriculum lookup stays on the server. */
  const nextStep = getLessonNextStep(lesson.id);

  const connectedLessons = getPrerequisiteLessons(lesson.id).map((prerequisite) => ({
    lessonId: prerequisite.lesson.id,
    title: prerequisite.lesson.title,
    moduleTitle: prerequisite.courseModule.title,
    moduleSlug: prerequisite.courseModule.slug,
    lessonSlug: prerequisite.lesson.slug,
  }));

  const has = (id: string) => sections.some((section) => section.id === id);
  const labelOf = (id: string) =>
    sections.find((section) => section.id === id)?.label ?? '';

  return (
    <LessonLayout
      nav={<LessonModuleNav courseModule={courseModule} currentLessonId={lesson.id} />}
      aside={
        <>
          <LessonToc entries={sections.map(({ id, label }) => ({ id, label }))} />
          <LessonStatusPanel lessonId={lesson.id} />

          {lesson.completionCriteria.length > 0 && (
            <div>
              <h2 className="mb-2.5 text-caption uppercase text-text-muted">
                You have this when
              </h2>
              <ul className="space-y-2 text-small text-text-muted">
                {lesson.completionCriteria.map((criterion) => (
                  <li key={criterion}>{criterion}</li>
                ))}
              </ul>
            </div>
          )}

          {competencies.length > 0 && (
            <div>
              <h2 className="mb-2.5 text-caption uppercase text-text-muted">Develops</h2>
              <ul className="flex flex-wrap gap-1.5">
                {competencies.map((competency) => (
                  <li key={competency.id}>
                    <Badge>{competency.label}</Badge>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      }
    >
      <LessonVisitTracker lessonId={lesson.id} />

      <LessonHeader
        lesson={lesson}
        courseModule={courseModule}
        phase={phase}
        courseIndex={navigation?.courseIndex ?? null}
        totalLessons={TOTAL_LESSONS}
      />

      <div className="space-y-10">
        {has('objectives') && (
          <LessonSection id="objectives" title={labelOf('objectives')}>
            <ul className="space-y-2.5">
              {lesson.objectives.map((objective) => (
                <li key={objective} className="grid grid-cols-[1.25rem_1fr] gap-x-2">
                  <span aria-hidden className="mt-2.5 h-px w-3 bg-accent" />
                  <span className="text-body text-text-secondary">{objective}</span>
                </li>
              ))}
            </ul>

            {lesson.prerequisiteConcepts.length > 0 && (
              <p className="mt-5 text-small text-text-muted">
                <span className="text-text-secondary">Assumes: </span>
                {lesson.prerequisiteConcepts.join(' · ')}
              </p>
            )}
          </LessonSection>
        )}

        {has('recap') && (
          <LessonSection id="recap" title={labelOf('recap')}>
            <Prose blocks={lesson.recap} />
          </LessonSection>
        )}

        {has('core-idea') && (
          <LessonSection id="core-idea" title={labelOf('core-idea')}>
            <Prose blocks={lesson.coreConcept} />
          </LessonSection>
        )}

        {has('first-principles') && (
          <LessonSection id="first-principles" title={labelOf('first-principles')}>
            <Prose blocks={lesson.firstPrinciples} />
          </LessonSection>
        )}

        {has('perspectives') && (
          <LessonSection id="perspectives" title={labelOf('perspectives')}>
            <Perspectives
              design={lesson.designPerspective}
              engineering={lesson.engineeringPerspective}
            />
          </LessonSection>
        )}

        {has('connection') && (
          <LessonSection id="connection" title={labelOf('connection')}>
            <Prose blocks={lesson.connectionBetweenBoth} />
          </LessonSection>
        )}

        {has('industry') && (
          <LessonSection id="industry" title={labelOf('industry')}>
            <IndustryExamples examples={lesson.industryExamples} />
          </LessonSection>
        )}

        {has('walkthrough') && (
          <LessonSection id="walkthrough" title={labelOf('walkthrough')}>
            <Prose blocks={lesson.practicalWalkthrough} />
          </LessonSection>
        )}

        {has('mistakes') && (
          <LessonSection id="mistakes" title={labelOf('mistakes')}>
            <CommonMistakes mistakes={lesson.commonMistakes} />
          </LessonSection>
        )}

        {has('elite') && (
          <LessonSection id="elite" title={labelOf('elite')}>
            <Prose blocks={lesson.eliteConsiderations} />
          </LessonSection>
        )}

        {/* End of the material. Everything below is work, not reading, so this
            is where "read to the end" is satisfied. */}
        <LessonEndMarker lessonId={lesson.id} />

        <LessonSection id="exercise" title={labelOf('exercise')}>
          <PracticalExercise lessonId={lesson.id} exercise={lesson.practicalExercise} />
        </LessonSection>

        <LessonSection id="reflection" title={labelOf('reflection')}>
          <Reflection
            lessonId={lesson.id}
            question={lesson.reflectionQuestion}
            hint={lesson.reflectionHint}
          />
        </LessonSection>

        {has('resources') && (
          <LessonSection id="resources" title={labelOf('resources')}>
            <LessonResources resources={lesson.resources} />
          </LessonSection>
        )}
      </div>

      <LessonCompletionPanel
        lessonId={lesson.id}
        objectives={lesson.objectives}
        exerciseTitle={lesson.practicalExercise.title}
        exerciseMinutes={lesson.practicalExercise.estimatedMinutes}
        connected={connectedLessons}
        competencies={competencies.map(({ id, label }) => ({ id, label }))}
        next={nextStep}
      />

      <LessonNavigation
        lessonId={lesson.id}
        previous={
          navigation?.previous === undefined || navigation?.previous === null
            ? null
            : {
                title: navigation.previous.lesson.title,
                moduleSlug: navigation.previous.courseModule.slug,
                lessonSlug: navigation.previous.lesson.slug,
                moduleTitle: navigation.previous.courseModule.title,
              }
        }
        next={
          navigation?.next === undefined || navigation?.next === null
            ? null
            : {
                title: navigation.next.lesson.title,
                moduleSlug: navigation.next.courseModule.slug,
                lessonSlug: navigation.next.lesson.slug,
                moduleTitle: navigation.next.courseModule.title,
              }
        }
      />
    </LessonLayout>
  );
}
