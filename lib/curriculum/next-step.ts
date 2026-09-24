import { getLessonById, getLessonNavigation } from './queries';

/**
 * What follows a finished lesson.
 *
 * Usually the next lesson. At the end of a module it is the module project,
 * because that is genuinely what comes next: the module does not count as
 * finished until the project is built, so pointing straight at the first
 * lesson of the following module would walk the learner past the one piece of
 * work that demonstrates any of it.
 */
export interface LessonNextStep {
  readonly kind: 'lesson' | 'project';
  readonly title: string;
  /** Built from curriculum slugs, so it always matches a real route. */
  readonly href: string;
  /** Where that step sits, for the line beneath the link. */
  readonly context: string;
}

export function getLessonNextStep(lessonId: string): LessonNextStep | null {
  const location = getLessonById(lessonId);
  if (location === null) return null;

  const { courseModule } = location;
  const next = getLessonNavigation(lessonId)?.next ?? null;

  if (next !== null && next.courseModule.id === courseModule.id) {
    return {
      kind: 'lesson',
      title: next.lesson.title,
      href: `/curriculum/${next.courseModule.slug}/${next.lesson.slug}`,
      context: `Lesson ${next.lesson.lessonNumber} · ${next.courseModule.title}`,
    };
  }

  return {
    kind: 'project',
    title: courseModule.project.title,
    href: `/projects/${courseModule.slug}`,
    context: `Module ${courseModule.moduleNumber} project · the last lesson of this module is done`,
  };
}
