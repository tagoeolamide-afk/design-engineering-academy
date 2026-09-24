/**
 * Reading the concept chains.
 *
 * Resolution happens here rather than in the component so the lesson lookups
 * are testable, and so a chain that references a lesson which no longer exists
 * is reported by a test rather than rendered as a dead link.
 */

import { CONCEPT_CHAINS } from '@/content/connections';
import { getLessonById } from '@/lib/curriculum/queries';
import type { ConceptChain, ConceptLink } from '@/types/connections';

export interface ResolvedLessonRef {
  readonly lessonId: string;
  readonly title: string;
  readonly moduleNumber: number;
  readonly href: string;
}

export interface ResolvedConceptLink extends ConceptLink {
  readonly lessons: readonly ResolvedLessonRef[];
}

export interface ResolvedConceptChain extends Omit<ConceptChain, 'links'> {
  readonly links: readonly ResolvedConceptLink[];
  /** Distinct lessons across the whole chain, for the chain's own count. */
  readonly lessonCount: number;
}

export function getConceptChains(): readonly ConceptChain[] {
  return CONCEPT_CHAINS;
}

export function getConceptChainById(id: string): ConceptChain | null {
  return CONCEPT_CHAINS.find((chain) => chain.id === id) ?? null;
}

function resolveLesson(lessonId: string): ResolvedLessonRef | null {
  const location = getLessonById(lessonId);
  if (location === null) return null;

  return {
    lessonId,
    title: location.lesson.title,
    moduleNumber: location.courseModule.moduleNumber,
    href: `/curriculum/${location.courseModule.slug}/${location.lesson.slug}`,
  };
}

export function resolveConceptChain(chain: ConceptChain): ResolvedConceptChain {
  const links = chain.links.map((link) => ({
    ...link,
    lessons: link.lessonIds
      .map(resolveLesson)
      .filter((lesson): lesson is ResolvedLessonRef => lesson !== null),
  }));

  const distinct = new Set(links.flatMap((link) => link.lessons.map((l) => l.lessonId)));

  return { ...chain, links, lessonCount: distinct.size };
}

export function resolveAllConceptChains(): readonly ResolvedConceptChain[] {
  return CONCEPT_CHAINS.map(resolveConceptChain);
}

/** Every lesson id referenced anywhere in the chains, deduped. */
export function getChainLessonIds(): readonly string[] {
  return [
    ...new Set(
      CONCEPT_CHAINS.flatMap((chain) => chain.links.flatMap((link) => link.lessonIds)),
    ),
  ];
}

/** The chains that reference a given lesson, so a lesson can point back. */
export function getChainsForLesson(lessonId: string): readonly ConceptChain[] {
  return CONCEPT_CHAINS.filter((chain) =>
    chain.links.some((link) => link.lessonIds.includes(lessonId)),
  );
}
