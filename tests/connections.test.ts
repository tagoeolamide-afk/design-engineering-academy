import { describe, expect, it } from 'vitest';
import { CONCEPT_CHAINS } from '@/content/connections';
import {
  getChainLessonIds,
  getChainsForLesson,
  getConceptChainById,
  getConceptChains,
  resolveAllConceptChains,
  resolveConceptChain,
} from '@/lib/connections/chains';
import { getLessonById } from '@/lib/curriculum/queries';

describe('the authored chains', () => {
  it('includes the five named chains', () => {
    expect(CONCEPT_CHAINS.map((chain) => chain.id)).toEqual([
      'interaction',
      'layout',
      'components',
      'state',
      'quality',
    ]);
  });

  it('gives every chain a unique id, a subtitle, and a reason', () => {
    const ids = new Set(CONCEPT_CHAINS.map((chain) => chain.id));
    expect(ids.size).toBe(CONCEPT_CHAINS.length);

    for (const chain of CONCEPT_CHAINS) {
      expect(chain.title.trim(), chain.id).not.toBe('');
      expect(chain.subtitle.trim(), chain.id).not.toBe('');
      /* The explanation is the point of the section, so it has to say
       * something — a one-line placeholder would defeat it. */
      expect(chain.whyConnected.length, chain.id).toBeGreaterThan(200);
    }
  });

  it('gives every step a label, a contribution, and at least one lesson', () => {
    for (const chain of CONCEPT_CHAINS) {
      expect(chain.links.length, chain.id).toBeGreaterThanOrEqual(5);

      for (const link of chain.links) {
        expect(link.label.trim(), `${chain.id}/${link.id}`).not.toBe('');
        expect(link.contribution.trim(), `${chain.id}/${link.id}`).not.toBe('');
        expect(link.lessonIds.length, `${chain.id}/${link.id}`).toBeGreaterThan(0);
      }
    }
  });

  it('uses unique step ids within each chain', () => {
    for (const chain of CONCEPT_CHAINS) {
      const ids = new Set(chain.links.map((link) => link.id));
      expect(ids.size, chain.id).toBe(chain.links.length);
    }
  });

  /* The guard that matters: a renamed or removed lesson must fail here rather
   * than render as a dead link in the interface. */
  it('only references lessons that exist in the curriculum', () => {
    for (const chain of CONCEPT_CHAINS) {
      for (const link of chain.links) {
        for (const lessonId of link.lessonIds) {
          expect(
            getLessonById(lessonId),
            `${chain.id}/${link.id} -> ${lessonId}`,
          ).not.toBeNull();
        }
      }
    }
  });

  it('does not repeat a lesson within a single step', () => {
    for (const chain of CONCEPT_CHAINS) {
      for (const link of chain.links) {
        expect(new Set(link.lessonIds).size, `${chain.id}/${link.id}`).toBe(
          link.lessonIds.length,
        );
      }
    }
  });

  it('draws on lessons from across the course, not one corner of it', () => {
    const modules = new Set(
      getChainLessonIds().map((id) => getLessonById(id)?.courseModule.moduleNumber),
    );
    expect(modules.size).toBeGreaterThanOrEqual(10);
  });
});

describe('resolution', () => {
  it('resolves every step to real lesson titles and hrefs', () => {
    for (const chain of resolveAllConceptChains()) {
      for (const link of chain.links) {
        expect(link.lessons.length, `${chain.id}/${link.id}`).toBe(link.lessonIds.length);

        for (const lesson of link.lessons) {
          expect(lesson.title.trim()).not.toBe('');
          expect(lesson.href.startsWith('/curriculum/')).toBe(true);
          expect(lesson.moduleNumber).toBeGreaterThan(0);
        }
      }
    }
  });

  it('counts distinct lessons per chain rather than references', () => {
    const state = getConceptChainById('state');
    expect(state).not.toBeNull();

    const resolved = resolveConceptChain(state!);
    const references = state!.links.reduce((sum, link) => sum + link.lessonIds.length, 0);

    expect(resolved.lessonCount).toBeLessThanOrEqual(references);
    expect(resolved.lessonCount).toBeGreaterThan(0);
  });

  it('exposes the chains in authored order', () => {
    expect(getConceptChains()).toBe(CONCEPT_CHAINS);
  });

  it('returns null for an unknown chain id', () => {
    expect(getConceptChainById('nope')).toBeNull();
  });
});

describe('reverse lookup', () => {
  it('finds the chains a lesson appears in', () => {
    /* The opening lesson is deliberately in two chains: it is where both the
     * state thread and the interaction thread begin. */
    const chains = getChainsForLesson('lesson-what-makes-an-interface-interactive');
    expect(chains.map((chain) => chain.id)).toEqual(['interaction', 'state']);
  });

  it('returns nothing for a lesson no chain references', () => {
    const referenced = new Set(getChainLessonIds());
    const unreferenced = ['lesson-06-05', 'lesson-15-05', 'lesson-not-in-any-chain'].find(
      (id) => !referenced.has(id),
    );

    if (unreferenced !== undefined) {
      expect(getChainsForLesson(unreferenced)).toEqual([]);
    }
  });
});
