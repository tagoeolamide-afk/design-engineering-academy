/**
 * Competencies are the skill axes the curriculum is measured against.
 *
 * A closed set of thirty-three, grouped into three categories. Every lesson
 * tags the competencies it teaches and every module project tags the ones a
 * finished build demonstrates, which is what lets the Skills section report
 * evidence from completed work rather than a score.
 *
 * Nothing in stored progress keys off these ids — progress records are keyed by
 * lesson and project id, and competency standing is derived on read. Adding or
 * removing an id therefore changes what is reported, not what is stored.
 *
 * Treat this list as fixed unless a change is explicitly agreed.
 */

/* -------------------------------------------------------------------------- */
/* Categories                                                                  */
/* -------------------------------------------------------------------------- */

export const COMPETENCY_CATEGORIES = ['design', 'engineering', 'hybrid'] as const;

export type CompetencyCategory = (typeof COMPETENCY_CATEGORIES)[number];

export const COMPETENCY_CATEGORY_LABELS: Readonly<Record<CompetencyCategory, string>> = {
  design: 'Design',
  engineering: 'Engineering',
  hybrid: 'Hybrid',
};

/**
 * What each category is for. Hybrid is not "a bit of both" — it names the work
 * that only exists where the two disciplines meet, and which neither a design
 * nor an engineering track would cover on its own.
 */
export const COMPETENCY_CATEGORY_DESCRIPTIONS: Readonly<
  Record<CompetencyCategory, string>
> = {
  design:
    'Deciding what to build and how it should look, read, and behave before any of it is code.',
  engineering:
    'Building it correctly: the languages, the platform, the structures, and the practices that keep it maintainable.',
  hybrid:
    'The work that exists only between the two — translation, contracts, and the judgement calls neither discipline owns alone.',
};

/* -------------------------------------------------------------------------- */
/* Identifiers                                                                 */
/* -------------------------------------------------------------------------- */

export const DESIGN_COMPETENCY_IDS = [
  'product-thinking',
  'ux-reasoning',
  'visual-hierarchy',
  'typography',
  'colour',
  'layout',
  'responsive-design',
  'interaction-design',
  'motion',
  'accessibility',
  'design-systems',
  'critique',
  'product-judgement',
] as const;

export const ENGINEERING_COMPETENCY_IDS = [
  'html',
  'css',
  'javascript',
  'typescript',
  'react',
  'state-modelling',
  'component-architecture',
  'browser-apis',
  'async-systems',
  'performance',
  'testing',
  'architecture',
  'git',
] as const;

export const HYBRID_COMPETENCY_IDS = [
  'design-to-code-translation',
  'interface-state-modelling',
  'component-api-design',
  'design-systems-implementation',
  'interaction-engineering',
  'design-qa',
  'ai-assisted-engineering',
] as const;

/** Canonical order: design, then engineering, then hybrid. */
export const COMPETENCY_IDS = [
  ...DESIGN_COMPETENCY_IDS,
  ...ENGINEERING_COMPETENCY_IDS,
  ...HYBRID_COMPETENCY_IDS,
] as const;

export type CompetencyId = (typeof COMPETENCY_IDS)[number];

export const COMPETENCY_IDS_BY_CATEGORY: Readonly<
  Record<CompetencyCategory, readonly CompetencyId[]>
> = {
  design: DESIGN_COMPETENCY_IDS,
  engineering: ENGINEERING_COMPETENCY_IDS,
  hybrid: HYBRID_COMPETENCY_IDS,
};

/* -------------------------------------------------------------------------- */
/* Evidence levels                                                             */
/* -------------------------------------------------------------------------- */

/**
 * The three kinds of evidence a competency can accumulate. They are separate
 * records of what was done, not a ladder of proficiency — the platform never
 * claims the learner is good at something, only that specific work was finished.
 *
 * Note that completing a lesson requires completing its exercise, so a lesson
 * counted as exposure is always also counted as practised. The reverse does not
 * hold: an exercise can be finished while the lesson is still outstanding.
 */
export const EVIDENCE_LEVELS = ['exposure', 'practised', 'demonstrated'] as const;

export type EvidenceLevel = (typeof EVIDENCE_LEVELS)[number];

export const EVIDENCE_LEVEL_LABELS: Readonly<Record<EvidenceLevel, string>> = {
  exposure: 'Exposure',
  practised: 'Practised',
  demonstrated: 'Demonstrated',
};

/** What each level means, stated as the thing that was actually completed. */
export const EVIDENCE_LEVEL_DEFINITIONS: Readonly<Record<EvidenceLevel, string>> = {
  exposure: 'A lesson teaching this competency was completed.',
  practised: 'The exercise in a lesson teaching this competency was completed.',
  demonstrated: 'A module project this competency contributes to was completed.',
};

/* -------------------------------------------------------------------------- */
/* Competency                                                                  */
/* -------------------------------------------------------------------------- */

export interface Competency {
  readonly id: CompetencyId;
  readonly label: string;
  readonly category: CompetencyCategory;
  /** What competence in this area actually looks like. */
  readonly description: string;
}

const COMPETENCY_ID_SET: ReadonlySet<string> = new Set<string>(COMPETENCY_IDS);

export function isCompetencyId(value: string): value is CompetencyId {
  return COMPETENCY_ID_SET.has(value);
}

const CATEGORY_SET: ReadonlySet<string> = new Set<string>(COMPETENCY_CATEGORIES);

export function isCompetencyCategory(value: string): value is CompetencyCategory {
  return CATEGORY_SET.has(value);
}
