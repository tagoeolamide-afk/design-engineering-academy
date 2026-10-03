/**
 * Phase metadata: the five-part arc of the course.
 *
 * Phases are deliberately uneven — 3, 3, 4, 3, 2 modules. The arc is not evenly
 * divisible: splitting it evenly would either rush React and accessibility or
 * pad the capstone. The sizes live in types/curriculum.ts.
 *
 * The `id` values are internal keys that lesson content, progress derivation,
 * and tests are written against; `title` is what the learner reads. They are
 * deliberately allowed to diverge so a phase can be renamed without migrating
 * every module's `phase` field.
 */

import type { Phase, PhaseId } from '@/types/curriculum';
import { PHASE_IDS } from '@/types/curriculum';

export const PHASES: Readonly<Record<PhaseId, Phase>> = {
  foundations: {
    id: 'foundations',
    slug: 'from-designer-to-interface-builder',
    phaseNumber: 1,
    title: 'From Designer to Interface Builder',
    description:
      'How interfaces actually behave, the visual decisions behind them, and the HTML and CSS that put them in a browser. Everything here starts from something you can already see and click.',
    outcome:
      'Can take a design and build it as a real, responsive interface in the browser.',
  },
  'interface-craft': {
    id: 'interface-craft',
    slug: 'behaviour-and-logic',
    phaseNumber: 2,
    title: 'Behaviour and Logic',
    description:
      'Making interfaces respond: JavaScript, events, forms, waiting for data — and then the idea that ties it all together, which is what an interface is currently doing and why.',
    outcome: 'Can give an interface real behaviour, and describe that behaviour before writing it.',
  },
  systems: {
    id: 'systems',
    slug: 'modern-interface-engineering',
    phaseNumber: 3,
    title: 'Modern Interface Engineering',
    description:
      'React, component boundaries, accessibility and design systems — the structure that lets an interface scale past a single screen without collapsing into configuration.',
    outcome: 'Can design and implement an accessible component system others could build on.',
  },
  'interaction-and-motion': {
    id: 'interaction-and-motion',
    slug: 'real-product-complexity',
    phaseNumber: 4,
    title: 'Real Product Complexity',
    description:
      'What real products are actually made of: data that loads and fails, dense tables, motion that explains change, and the performance and testing work that keeps it honest.',
    outcome:
      'Can build and defend an interface that holds up under real data and real use.',
  },
  'product-judgement': {
    id: 'product-judgement',
    slug: 'advanced-design-engineering',
    phaseNumber: 5,
    title: 'Advanced Design Engineering',
    description:
      'Architecture, critique and the judgement to decide what should exist at all — plus working with AI as an implementation partner without surrendering the quality bar.',
    outcome: 'Can own an interface end to end and defend every decision in it.',
  },
};

/** Stable, ordered list for rendering. */
export const PHASE_LIST: readonly Phase[] = PHASE_IDS.map((id) => PHASES[id]);

export function getPhase(id: PhaseId): Phase {
  return PHASES[id];
}
