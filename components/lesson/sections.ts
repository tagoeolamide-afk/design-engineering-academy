import type { Lesson } from '@/types/curriculum';

/**
 * The fixed section order of every lesson.
 *
 * Declared once and shared by the body and the table of contents, so the two
 * can never disagree about what exists or what it is called. A section is only
 * listed when the lesson actually has content for it.
 */
export interface LessonSectionDefinition {
  readonly id: string;
  readonly label: string;
  /** Whether this lesson has anything to show in the section. */
  readonly has: (lesson: Lesson) => boolean;
}

export const LESSON_SECTIONS: readonly LessonSectionDefinition[] = [
  { id: 'objectives', label: 'Objectives', has: (l) => l.objectives.length > 0 },
  { id: 'recap', label: 'Recap', has: (l) => l.recap.length > 0 },
  {
    id: 'prior-knowledge',
    label: 'What you already know',
    has: (l) => (l.priorKnowledge?.length ?? 0) > 0,
  },
  { id: 'core-idea', label: "Today's idea", has: (l) => l.coreConcept.length > 0 },
  {
    id: 'why-designers-care',
    label: 'Why this matters to a designer',
    has: (l) => (l.whyDesignersCare?.length ?? 0) > 0,
  },
  {
    id: 'how-it-works',
    label: 'How it works',
    has: (l) => (l.howItWorks?.length ?? 0) > 0,
  },
  {
    id: 'first-principles',
    label: 'From first principles',
    has: (l) => l.firstPrinciples.length > 0,
  },
  {
    id: 'perspectives',
    label: 'Design and engineering',
    has: (l) => l.designPerspective.length > 0 || l.engineeringPerspective.length > 0,
  },
  {
    id: 'connection',
    label: 'The connection',
    has: (l) => l.connectionBetweenBoth.length > 0,
  },
  { id: 'industry', label: 'In industry', has: (l) => l.industryExamples.length > 0 },
  {
    id: 'walkthrough',
    label: 'Walkthrough',
    has: (l) => l.practicalWalkthrough.length > 0,
  },
  { id: 'mistakes', label: 'Common mistakes', has: (l) => l.commonMistakes.length > 0 },
  {
    id: 'professional',
    label: 'Professional consideration',
    has: (l) => l.professionalConsideration.length > 0,
  },
  {
    id: 'go-deeper',
    label: 'Go deeper',
    has: (l) => (l.goDeeper?.length ?? 0) > 0,
  },
  { id: 'exercise', label: 'Practical exercise', has: () => true },
  { id: 'reflection', label: 'Reflection', has: () => true },
  { id: 'resources', label: 'Resources', has: (l) => l.resources.length > 0 },
];

export function sectionsFor(lesson: Lesson): readonly LessonSectionDefinition[] {
  return LESSON_SECTIONS.filter((section) => section.has(lesson));
}
