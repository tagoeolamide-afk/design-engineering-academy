/**
 * The resource library.
 *
 * Distinct from the `Resource` attached to a lesson in types/curriculum.ts.
 * Those are contextual — "read this for this lesson". A library resource is a
 * catalogued recommendation: categorised, rated for difficulty, carrying a
 * stated reason, and linked back to the modules and lessons it supports.
 *
 * Every URL in the seed was checked before it was written down. A resource with
 * a URL nobody verified is worse than no resource at all, because it sends the
 * learner somewhere and wastes the trust the list depends on.
 */

/* -------------------------------------------------------------------------- */
/* Categories                                                                  */
/* -------------------------------------------------------------------------- */

export const RESOURCE_CATEGORIES = [
  'design',
  'interaction',
  'accessibility',
  'html-css',
  'javascript',
  'typescript',
  'react',
  'design-systems',
  'performance',
  'architecture',
  'git',
  'design-engineering',
  'ai-workflows',
] as const;

export type ResourceCategory = (typeof RESOURCE_CATEGORIES)[number];

export const RESOURCE_CATEGORY_LABELS: Readonly<Record<ResourceCategory, string>> = {
  design: 'Design',
  interaction: 'Interaction',
  accessibility: 'Accessibility',
  'html-css': 'HTML/CSS',
  javascript: 'JavaScript',
  typescript: 'TypeScript',
  react: 'React',
  'design-systems': 'Design systems',
  performance: 'Performance',
  architecture: 'Architecture',
  git: 'Git',
  'design-engineering': 'Design Engineering',
  'ai-workflows': 'AI workflows',
};

export const RESOURCE_CATEGORY_DESCRIPTIONS: Readonly<Record<ResourceCategory, string>> = {
  design: 'Deciding what to build and how it should look and read.',
  interaction: 'What controls promise, how systems answer, and how motion explains.',
  accessibility: 'Standards, techniques, and tools for building so nobody is excluded.',
  'html-css': 'The document and the styling layer, from the specifications outward.',
  javascript: 'The language and the browser platform it drives.',
  typescript: 'Types as contracts, and the compiler settings that enforce them.',
  react: 'The component model, rendering, and state.',
  'design-systems': 'Published systems worth reading, and the token formats behind them.',
  performance: 'Measuring what is slow and knowing which stage is responsible.',
  architecture: 'State boundaries, data ownership, testing, and recorded decisions.',
  git: 'History as a record of intent, and the workflow around it.',
  'design-engineering': 'The discipline itself: the seam between design and implementation.',
  'ai-workflows': 'Delegating implementation without delegating judgement.',
};

/* -------------------------------------------------------------------------- */
/* Types and difficulty                                                        */
/* -------------------------------------------------------------------------- */

export const LIBRARY_RESOURCE_TYPES = [
  'documentation',
  'article',
  'book',
  'video',
  'talk',
  'course',
  'tool',
  'repository',
] as const;

export type LibraryResourceType = (typeof LIBRARY_RESOURCE_TYPES)[number];

export const LIBRARY_RESOURCE_TYPE_LABELS: Readonly<
  Record<LibraryResourceType, string>
> = {
  documentation: 'Documentation',
  article: 'Article',
  book: 'Book',
  video: 'Video',
  talk: 'Talk',
  course: 'Course',
  tool: 'Tool',
  repository: 'Repository',
};

export const RESOURCE_DIFFICULTIES = ['foundational', 'intermediate', 'advanced'] as const;

export type ResourceDifficulty = (typeof RESOURCE_DIFFICULTIES)[number];

export const RESOURCE_DIFFICULTY_LABELS: Readonly<Record<ResourceDifficulty, string>> = {
  foundational: 'Foundational',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
};

/* -------------------------------------------------------------------------- */
/* Resource                                                                    */
/* -------------------------------------------------------------------------- */

export interface LibraryResource {
  readonly id: string;
  readonly title: string;
  /** A person, or the organisation that publishes it. */
  readonly author: string;
  readonly type: LibraryResourceType;
  readonly url: string;
  readonly category: ResourceCategory;
  /** Module ids this supports. Empty when it is generally useful. */
  readonly relatedModuleIds: readonly string[];
  /** Lesson ids this supports directly. */
  readonly relatedLessonIds: readonly string[];
  readonly difficulty: ResourceDifficulty;
  /** One sentence: why this, rather than something else on the same topic. */
  readonly reason: string;
  /** Published by the people who make the thing it documents. */
  readonly official: boolean;
}

/* -------------------------------------------------------------------------- */
/* Learner marks                                                               */
/* -------------------------------------------------------------------------- */

/**
 * One status per resource, not three independent flags.
 *
 * Saved, started, and completed are stages of the same journey — a thing is
 * saved to read, then begun, then finished. Independent checkboxes would allow
 * "completed but not started", which means nothing.
 */
export const RESOURCE_STATUSES = ['saved', 'started', 'completed'] as const;

export type ResourceStatus = (typeof RESOURCE_STATUSES)[number];

export const RESOURCE_STATUS_LABELS: Readonly<Record<ResourceStatus, string>> = {
  saved: 'Saved',
  started: 'Started',
  completed: 'Completed',
};

export interface ResourceMark {
  readonly resourceId: string;
  readonly status: ResourceStatus;
  readonly markedAt: string;
}

export interface ResourceLibraryState {
  readonly marks: Readonly<Record<string, ResourceMark>>;
}

/* -------------------------------------------------------------------------- */
/* Guards                                                                      */
/* -------------------------------------------------------------------------- */

const CATEGORY_SET: ReadonlySet<string> = new Set<string>(RESOURCE_CATEGORIES);
const TYPE_SET: ReadonlySet<string> = new Set<string>(LIBRARY_RESOURCE_TYPES);
const DIFFICULTY_SET: ReadonlySet<string> = new Set<string>(RESOURCE_DIFFICULTIES);
const STATUS_SET: ReadonlySet<string> = new Set<string>(RESOURCE_STATUSES);

export function isResourceCategory(value: string): value is ResourceCategory {
  return CATEGORY_SET.has(value);
}

export function isLibraryResourceType(value: string): value is LibraryResourceType {
  return TYPE_SET.has(value);
}

export function isResourceDifficulty(value: string): value is ResourceDifficulty {
  return DIFFICULTY_SET.has(value);
}

export function isResourceStatus(value: string): value is ResourceStatus {
  return STATUS_SET.has(value);
}
