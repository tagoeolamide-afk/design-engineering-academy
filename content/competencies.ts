/**
 * Competency data: the thirty-three axes this platform develops.
 *
 * The identifiers and categories are fixed in types/competency.ts; the labels
 * and descriptions live here because they are editable content, not structure.
 *
 * Each description says what competence in that area actually looks like, so
 * the Skills section reads as a definition of the target rather than a label on
 * a bar. None of them describes a level of ability — that is deliberate.
 */

import type { Competency, CompetencyCategory, CompetencyId } from '@/types/competency';
import { COMPETENCY_IDS, COMPETENCY_IDS_BY_CATEGORY } from '@/types/competency';

export const COMPETENCIES: Readonly<Record<CompetencyId, Competency>> = {
  /* ---------------------------------------------------------------- design */

  'product-thinking': {
    id: 'product-thinking',
    label: 'Product thinking',
    category: 'design',
    description:
      'Framing the real problem, choosing what to build, and shaping a flow that serves an intent rather than a feature list.',
  },
  'ux-reasoning': {
    id: 'ux-reasoning',
    label: 'UX reasoning',
    category: 'design',
    description:
      'Reasoning about what a person expects, what the interface promises, and where the two diverge.',
  },
  'visual-hierarchy': {
    id: 'visual-hierarchy',
    label: 'Visual hierarchy',
    category: 'design',
    description:
      'Making importance legible before anything is read, using size, weight, contrast, and position deliberately.',
  },
  typography: {
    id: 'typography',
    label: 'Typography',
    category: 'design',
    description:
      'Type as interface structure: scale, weight, measure, and rhythm chosen so text is scannable and readable at any size.',
  },
  colour: {
    id: 'colour',
    label: 'Colour',
    category: 'design',
    description:
      'Colour used semantically and accessibly, where meaning survives a palette change and nothing depends on hue alone.',
  },
  layout: {
    id: 'layout',
    label: 'Layout',
    category: 'design',
    description:
      'Arranging content so relationships are visible, using alignment, grouping, and space as structure rather than decoration.',
  },
  'responsive-design': {
    id: 'responsive-design',
    label: 'Responsive design',
    category: 'design',
    description:
      'Designs that hold at every width and content length, with each breakpoint justified rather than inherited.',
  },
  'interaction-design': {
    id: 'interaction-design',
    label: 'Interaction design',
    category: 'design',
    description:
      'Defining what every control does, what it promises, and how the system answers — across pointer, keyboard, and touch.',
  },
  motion: {
    id: 'motion',
    label: 'Motion',
    category: 'design',
    description:
      'Movement that explains continuity, causality, or hierarchy, and stillness everywhere it would only cost attention.',
  },
  accessibility: {
    id: 'accessibility',
    label: 'Accessibility',
    category: 'design',
    description:
      'Building so the interface works without a mouse, without sight, at any zoom, and without movement.',
  },
  'design-systems': {
    id: 'design-systems',
    label: 'Design systems',
    category: 'design',
    description:
      'Tokens, foundations, components, and patterns treated as named decisions others can adopt and extend.',
  },
  critique: {
    id: 'critique',
    label: 'Critique',
    category: 'design',
    description:
      'Evaluating work against a stated purpose, separating observation from judgement from recommendation.',
  },
  'product-judgement': {
    id: 'product-judgement',
    label: 'Product judgement',
    category: 'design',
    description:
      'Deciding what deserves to exist, what friction is warranted, and what to leave alone — with reasons.',
  },

  /* ----------------------------------------------------------- engineering */

  html: {
    id: 'html',
    label: 'HTML',
    category: 'engineering',
    description:
      'Choosing elements for meaning, so structure, landmarks, and relationships survive without being rebuilt in script.',
  },
  css: {
    id: 'css',
    label: 'CSS',
    category: 'engineering',
    description:
      'Flow, flexbox, grid, intrinsic sizing, and an architecture that keeps a stylesheet predictable as it grows.',
  },
  javascript: {
    id: 'javascript',
    label: 'JavaScript',
    category: 'engineering',
    description:
      'Values, functions, events, and the event loop, used with a clear account of what runs when.',
  },
  typescript: {
    id: 'typescript',
    label: 'TypeScript',
    category: 'engineering',
    description:
      'Types as stated contracts, and unions precise enough that contradictory states cannot be represented.',
  },
  react: {
    id: 'react',
    label: 'React',
    category: 'engineering',
    description:
      'Components as boundaries, rendering as a function of state, and effects used only for genuine synchronisation.',
  },
  'state-modelling': {
    id: 'state-modelling',
    label: 'State modelling',
    category: 'engineering',
    description:
      'One source of truth per fact, everything else derived, and each piece of state placed by who needs it.',
  },
  'component-architecture': {
    id: 'component-architecture',
    label: 'Component architecture',
    category: 'engineering',
    description:
      'Boundaries drawn by reason to change, with composition preferred over configuration as variation grows.',
  },
  'browser-apis': {
    id: 'browser-apis',
    label: 'Browser APIs',
    category: 'engineering',
    description:
      'The platform itself: the DOM, events, storage, observers, history, and the animation and media APIs.',
  },
  'async-systems': {
    id: 'async-systems',
    label: 'Async systems',
    category: 'engineering',
    description:
      'Work that takes time and can fail: cancellation, ordering, caching, staleness, and recovery.',
  },
  performance: {
    id: 'performance',
    label: 'Performance',
    category: 'engineering',
    description:
      'Diagnosing cost through the rendering pipeline and the main thread, and improving it against measurements.',
  },
  testing: {
    id: 'testing',
    label: 'Testing',
    category: 'engineering',
    description:
      'Verifying behaviour through the interface, with effort allocated by the consequence of failure.',
  },
  architecture: {
    id: 'architecture',
    label: 'Architecture',
    category: 'engineering',
    description:
      'Structuring an application so state, data, and failure have defined homes and changes stay local.',
  },
  git: {
    id: 'git',
    label: 'Git',
    category: 'engineering',
    description:
      'History as a record of intent: coherent commits, readable diffs, and changes that can be reviewed and reverted.',
  },

  /* ---------------------------------------------------------------- hybrid */

  'design-to-code-translation': {
    id: 'design-to-code-translation',
    label: 'Design-to-code translation',
    category: 'hybrid',
    description:
      'Reading a design for the document it depicts and expressing that in markup, rather than transcribing its layers.',
  },
  'interface-state-modelling': {
    id: 'interface-state-modelling',
    label: 'Interface state modelling',
    category: 'hybrid',
    description:
      'Enumerating every state a surface can occupy — including the ones nobody drew — and making the impossible ones unrepresentable.',
  },
  'component-api-design': {
    id: 'component-api-design',
    label: 'Component API design',
    category: 'hybrid',
    description:
      'Props as a public interface, designed from call sites, with variants as dimensions rather than accumulating flags.',
  },
  'design-systems-implementation': {
    id: 'design-systems-implementation',
    label: 'Design systems implementation',
    category: 'hybrid',
    description:
      'Turning tokens, foundations, and components into working code that keeps parity with the design file.',
  },
  'interaction-engineering': {
    id: 'interaction-engineering',
    label: 'Interaction engineering',
    category: 'hybrid',
    description:
      'Building interactions that hold under real input: focus, keyboard, pointer, timing, and interruption.',
  },
  'design-qa': {
    id: 'design-qa',
    label: 'Design QA',
    category: 'hybrid',
    description:
      'Verifying an implementation against intent under real content, real widths, and real assistive technology.',
  },
  'ai-assisted-engineering': {
    id: 'ai-assisted-engineering',
    label: 'AI-assisted engineering',
    category: 'hybrid',
    description:
      'Specifying work precisely enough to delegate, and reviewing what comes back against criteria rather than impressions.',
  },
};

/** Every competency in canonical order: design, engineering, then hybrid. */
export const COMPETENCY_LIST: readonly Competency[] = COMPETENCY_IDS.map(
  (id) => COMPETENCIES[id],
);

/** Competencies grouped for the Skills section's three sections. */
export const COMPETENCIES_BY_CATEGORY: Readonly<
  Record<CompetencyCategory, readonly Competency[]>
> = {
  design: COMPETENCY_IDS_BY_CATEGORY.design.map((id) => COMPETENCIES[id]),
  engineering: COMPETENCY_IDS_BY_CATEGORY.engineering.map((id) => COMPETENCIES[id]),
  hybrid: COMPETENCY_IDS_BY_CATEGORY.hybrid.map((id) => COMPETENCIES[id]),
};

export function getCompetency(id: CompetencyId): Competency {
  return COMPETENCIES[id];
}
