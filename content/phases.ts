/**
 * Phase metadata: the five-part arc of the course.
 *
 * Each phase holds three modules of five lessons, which is what produces the
 * seventy-five lesson total asserted in types/curriculum.ts.
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
    slug: 'build-the-mental-model',
    phaseNumber: 1,
    title: 'Build the Mental Model',
    description:
      'What an interface actually is underneath the picture of it: state, representation, transition, feedback, and constraints — plus the browser primitives everything else is built on.',
    outcome:
      'Can reason about an interface from first principles instead of copying patterns.',
  },
  'interface-craft': {
    id: 'interface-craft',
    slug: 'learn-to-build-interfaces',
    phaseNumber: 2,
    title: 'Learn to Build Interfaces',
    description:
      'Turning a design into precise, resilient markup, styling, and layout. The gap between a screen that looks right in a mockup and a build that stays right under real content.',
    outcome: 'Can build a screen that holds its quality under real, varied content.',
  },
  systems: {
    id: 'systems',
    slug: 'component-thinking',
    phaseNumber: 3,
    title: 'Component Thinking',
    description:
      'Component boundaries, props as an API, composition, and tokens — the structure that lets an interface scale past a single screen without collapsing into configuration.',
    outcome: 'Can design and implement a component system others could build on.',
  },
  'interaction-and-motion': {
    id: 'interaction-and-motion',
    slug: 'interaction-quality',
    phaseNumber: 4,
    title: 'Interaction Quality',
    description:
      'Behaviour over time: complex interaction patterns, accessible dynamic components, and motion that explains change rather than decorating it.',
    outcome:
      'Can build interactions that feel considered and remain operable by keyboard and assistive technology.',
  },
  'product-judgement': {
    id: 'product-judgement',
    slug: 'advanced-design-engineering',
    phaseNumber: 5,
    title: 'Advanced Design Engineering',
    description:
      'Performance, product architecture, and the judgement to decide what should exist at all — the work that separates competent practice from senior practice.',
    outcome: 'Can own an interface end to end and defend every decision in it.',
  },
};

/** Stable, ordered list for rendering. */
export const PHASE_LIST: readonly Phase[] = PHASE_IDS.map((id) => PHASES[id]);

export function getPhase(id: PhaseId): Phase {
  return PHASES[id];
}
