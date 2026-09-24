import { describe, expect, it } from 'vitest';
import { migrateProgress } from '@/lib/persistence/migrations';
import { deriveModuleProgress, getProjectRecord } from '@/lib/progress/derive';
import {
  PROJECT_STATUS_ORDER,
  presentProjectStatus,
  projectStatusProgress,
} from '@/lib/progress/project-status';
import {
  createProjectRecord,
  normalizeProjectRecord,
  withProjectLink,
  withProjectNotes,
  withProjectReflection,
  withProjectStatus,
} from '@/lib/progress/records';
import { isAcceptableLink, isValidHttpUrl } from '@/lib/utils/url';
import { PROJECT_STATUSES, type ProjectProgressRecord } from '@/types/progress';
import { LESSONS_PER_MODULE } from '@/types/curriculum';
import { makeFullCourseIndex } from './fixtures/curriculum';
import { completeModules, makeState } from './fixtures/progress';

const AT = '2026-01-01T00:00:00.000Z';
const LATER = '2026-02-01T00:00:00.000Z';

function fresh(): ProjectProgressRecord {
  return createProjectRecord('project-1', 'module-1');
}

describe('project statuses', () => {
  it('are the five the curriculum defines, in order', () => {
    expect(PROJECT_STATUSES).toEqual([
      'not-started',
      'planning',
      'building',
      'reviewing',
      'completed',
    ]);
    expect(PROJECT_STATUS_ORDER).toEqual(PROJECT_STATUSES);
  });

  it('all have a label, a glyph, and an explanation', () => {
    for (const status of PROJECT_STATUSES) {
      const presentation = presentProjectStatus(status);
      expect(presentation.label).not.toBe('');
      expect(presentation.description).not.toBe('');
      expect(presentation.indicator).toBeTruthy();
    }
  });

  it('report progress across the scale, ending at 1', () => {
    expect(projectStatusProgress('not-started')).toBe(0);
    expect(projectStatusProgress('completed')).toBe(1);
    expect(projectStatusProgress('building')).toBeCloseTo(0.5);
  });
});

describe('status transitions', () => {
  it('start the project on the first move away from not-started', () => {
    const planning = withProjectStatus(fresh(), 'planning', AT);

    expect(planning.startedAt).toBe(AT);
    expect(planning.statusUpdatedAt).toBe(AT);
    expect(planning.completedAt).toBeNull();
  });

  it('record completion only at completed', () => {
    const reviewing = withProjectStatus(fresh(), 'reviewing', AT);
    expect(reviewing.completedAt).toBeNull();

    const completed = withProjectStatus(reviewing, 'completed', LATER);
    expect(completed.completedAt).toBe(LATER);
  });

  it('clear completion when moving back out of completed', () => {
    /* A review that finds a problem must un-complete the module too, or the
     * course would claim work is finished that the learner has reopened. */
    const completed = withProjectStatus(fresh(), 'completed', AT);
    const reopened = withProjectStatus(completed, 'building', LATER);

    expect(reopened.completedAt).toBeNull();
    expect(reopened.startedAt).toBe(AT);
  });

  it('clear the dates when reset to not-started', () => {
    const completed = withProjectStatus(fresh(), 'completed', AT);
    const reset = withProjectStatus(completed, 'not-started', LATER);

    expect(reset.startedAt).toBeNull();
    expect(reset.completedAt).toBeNull();
  });

  it('are a no-op when the status does not change', () => {
    const planning = withProjectStatus(fresh(), 'planning', AT);
    expect(withProjectStatus(planning, 'planning', LATER)).toBe(planning);
  });

  it('only complete a module at completed', () => {
    const index = makeFullCourseIndex();
    const courseModule = index.getModuleById('module-1');
    if (courseModule === null) throw new Error('fixture missing');

    for (const status of PROJECT_STATUSES) {
      const state = makeState(completeModules([1], LESSONS_PER_MODULE), [
        withProjectStatus(fresh(), status, AT),
      ]);

      expect(deriveModuleProgress(state, courseModule).isComplete).toBe(
        status === 'completed',
      );
    }
  });
});

describe('links, notes and reflection', () => {
  it('store each link independently', () => {
    const withFigma = withProjectLink(fresh(), 'figma', 'https://figma.com/x', AT);
    const withBoth = withProjectLink(withFigma, 'github', 'https://github.com/y', AT);

    expect(withBoth.links.figma).toBe('https://figma.com/x');
    expect(withBoth.links.github).toBe('https://github.com/y');
    expect(withBoth.links.live).toBe('');
  });

  it('do not change the record when a value is unchanged', () => {
    const once = withProjectLink(fresh(), 'live', 'https://example.com', AT);
    expect(withProjectLink(once, 'live', 'https://example.com', LATER)).toBe(once);

    const noted = withProjectNotes(fresh(), 'Same', AT);
    expect(withProjectNotes(noted, 'Same', LATER)).toBe(noted);
  });

  it('treat whitespace as an unanswered reflection', () => {
    const blank = withProjectReflection(fresh(), '   \n ', AT);
    expect(blank.reflectionAnsweredAt).toBeNull();

    const answered = withProjectReflection(fresh(), 'Real answer.', AT);
    expect(answered.reflectionAnsweredAt).toBe(AT);
  });

  it('never let notes or links complete a project', () => {
    const busy = withProjectNotes(
      withProjectLink(fresh(), 'github', 'https://github.com/x', AT),
      'Lots of work.',
      AT,
    );

    expect(busy.status).toBe('not-started');
    expect(busy.completedAt).toBeNull();
  });
});

describe('link validation', () => {
  it('accepts http and https only', () => {
    expect(isValidHttpUrl('https://example.com')).toBe(true);
    expect(isValidHttpUrl('http://example.com/a/b?c=d')).toBe(true);
    expect(isValidHttpUrl('javascript:alert(1)')).toBe(false);
    expect(isValidHttpUrl('ftp://example.com')).toBe(false);
    expect(isValidHttpUrl('not a url')).toBe(false);
  });

  it('treats an empty field as acceptable, because clearing a link is normal', () => {
    expect(isAcceptableLink('')).toBe(true);
    expect(isAcceptableLink('   ')).toBe(true);
    expect(isAcceptableLink('nope')).toBe(false);
  });
});

describe('records that predate the new project shape', () => {
  it('gain the fields they are missing', () => {
    const legacy = { projectId: 'project-1', moduleId: 'module-1', status: 'planning' };
    const normalized = normalizeProjectRecord(legacy as unknown as ProjectProgressRecord);

    expect(normalized.links).toEqual({ figma: '', github: '', live: '', caseStudy: '' });
    expect(normalized.reflectionAnswer).toBe('');
    expect(normalized.status).toBe('planning');
  });

  it('keep a partially filled link map', () => {
    const partial = {
      ...createProjectRecord('project-1', 'module-1'),
      links: { github: 'https://github.com/x' },
    };

    const normalized = normalizeProjectRecord(partial as unknown as ProjectProgressRecord);
    expect(normalized.links.github).toBe('https://github.com/x');
    expect(normalized.links.figma).toBe('');
  });
});

describe('migration of retired project data', () => {
  it('maps the retired statuses onto their nearest meaning', () => {
    const migrated = migrateProgress(
      {
        lessons: {},
        projects: {
          a: { moduleId: 'm', status: 'started' },
          b: { moduleId: 'm', status: 'submitted' },
        },
      },
      1,
    );

    expect(migrated.projects.a?.status).toBe('building');
    expect(migrated.projects.b?.status).toBe('reviewing');
  });

  it('recognises a repository URL and files it as GitHub', () => {
    const migrated = migrateProgress(
      {
        lessons: {},
        projects: {
          a: { moduleId: 'm', submissionUrl: 'https://github.com/me/project' },
        },
      },
      1,
    );

    expect(migrated.projects.a?.links.github).toBe('https://github.com/me/project');
    expect(migrated.projects.a?.links.live).toBe('');
  });

  it('files anything else as the live build rather than discarding it', () => {
    const migrated = migrateProgress(
      { lessons: {}, projects: { a: { moduleId: 'm', submissionUrl: 'https://my.app' } } },
      1,
    );

    expect(migrated.projects.a?.links.live).toBe('https://my.app');
  });

  it('does not overwrite links that already exist', () => {
    const migrated = migrateProgress(
      {
        lessons: {},
        projects: {
          a: {
            moduleId: 'm',
            submissionUrl: 'https://old.example',
            links: { live: 'https://new.example' },
          },
        },
      },
      1,
    );

    expect(migrated.projects.a?.links.live).toBe('https://new.example');
  });

  it('reads back through the derivation path', () => {
    const state = migrateProgress(
      { lessons: {}, projects: { 'project-1': { moduleId: 'm', status: 'submitted' } } },
      1,
    );

    expect(getProjectRecord(state, 'project-1')?.status).toBe('reviewing');
  });
});
