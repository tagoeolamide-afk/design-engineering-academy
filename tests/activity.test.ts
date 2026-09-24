import { describe, expect, it } from 'vitest';
import { deriveActivity, deriveRecentActivity } from '@/lib/progress/activity';
import { makeIndex, makeModule } from './fixtures/curriculum';
import { completedLesson, lessonRecord, makeState, projectRecord } from './fixtures/progress';

const index = makeIndex([makeModule(1)]);

describe('activity derivation', () => {
  it('reports nothing on a fresh state', () => {
    expect(deriveActivity(makeState(), index)).toEqual([]);
  });

  it('ignores lessons with no record at all', () => {
    const state = makeState([lessonRecord('lesson-1-1', { visited: true })]);

    expect(deriveActivity(state, index)).toHaveLength(1);
  });

  it('records each completion step separately', () => {
    const state = makeState([completedLesson('lesson-1-1')]);
    const kinds = deriveActivity(state, index).map((event) => event.kind);

    expect(kinds).toContain('lesson-started');
    expect(kinds).toContain('exercise-completed');
    expect(kinds).toContain('reflection-saved');
    expect(kinds).toContain('lesson-completed');
  });

  it('does not report a completion that has not happened', () => {
    const state = makeState([
      lessonRecord('lesson-1-1', { reachedEnd: true, exerciseCompleted: true }),
    ]);
    const kinds = deriveActivity(state, index).map((event) => event.kind);

    expect(kinds).toContain('exercise-completed');
    expect(kinds).not.toContain('reflection-saved');
    expect(kinds).not.toContain('lesson-completed');
  });

  it('carries the lesson and its module, and a target that resolves', () => {
    const state = makeState([lessonRecord('lesson-1-2', { visited: true })]);
    const event = deriveActivity(state, index)[0];

    expect(event?.subject).toBe('Module 1 Lesson 2');
    expect(event?.context).toBe('Module 1');
    expect(event?.target).toEqual({
      kind: 'lesson',
      moduleSlug: 'module-1',
      lessonSlug: 'lesson-2',
    });
  });

  it('records the start and the finish of a project', () => {
    const state = makeState([], [projectRecord('project-1', 'module-1', 'completed')]);
    const kinds = deriveActivity(state, index).map((event) => event.kind);

    expect(kinds).toEqual(
      expect.arrayContaining(['project-started', 'project-completed']),
    );
    expect(deriveActivity(state, index)[0]?.target).toEqual({
      kind: 'project',
      moduleSlug: 'module-1',
    });
  });

  it('does not report the same moment twice', () => {
    /* A project taken straight to completed has one timestamp on all three
     * fields. Reporting a status move as well would show the learner the same
     * instant three times. */
    const state = makeState([], [projectRecord('project-1', 'module-1', 'completed')]);
    const kinds = deriveActivity(state, index).map((event) => event.kind);

    expect(kinds).not.toContain('project-advanced');
  });

  it('reports a genuine intermediate move', () => {
    const state = makeState(
      [],
      [
        {
          ...projectRecord('project-1', 'module-1', 'building'),
          startedAt: '2026-01-01T00:00:00.000Z',
          statusUpdatedAt: '2026-02-01T00:00:00.000Z',
        },
      ],
    );
    const kinds = deriveActivity(state, index).map((event) => event.kind);

    expect(kinds).toContain('project-started');
    expect(kinds).toContain('project-advanced');
    expect(kinds).not.toContain('project-completed');
  });

  it('orders newest first', () => {
    const state = makeState([
      { ...lessonRecord('lesson-1-1', { visited: true }), startedAt: '2026-01-01T00:00:00.000Z' },
      { ...lessonRecord('lesson-1-2', { visited: true }), startedAt: '2026-03-01T00:00:00.000Z' },
      { ...lessonRecord('lesson-1-3', { visited: true }), startedAt: '2026-02-01T00:00:00.000Z' },
    ]);

    expect(deriveActivity(state, index).map((event) => event.at)).toEqual([
      '2026-03-01T00:00:00.000Z',
      '2026-02-01T00:00:00.000Z',
      '2026-01-01T00:00:00.000Z',
    ]);
  });

  it('orders deterministically when timestamps tie', () => {
    const state = makeState([completedLesson('lesson-1-1')]);

    /* All four events share a timestamp in the fixture; the order must not
     * depend on iteration chance. */
    const first = deriveActivity(state, index).map((e) => e.id);
    const second = deriveActivity(state, index).map((e) => e.id);
    expect(first).toEqual(second);
  });

  it('caps the recent feed at the requested limit', () => {
    const state = makeState([
      completedLesson('lesson-1-1'),
      completedLesson('lesson-1-2'),
      completedLesson('lesson-1-3'),
    ]);

    expect(deriveActivity(state, index).length).toBeGreaterThan(5);
    expect(deriveRecentActivity(state, 5, index)).toHaveLength(5);
  });
});
