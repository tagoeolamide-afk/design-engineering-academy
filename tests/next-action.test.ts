import { describe, expect, it } from 'vitest';
import { getRecommendedAction } from '@/lib/progress/next-action';
import { LESSONS_PER_MODULE } from '@/types/curriculum';
import { makeFullCourseIndex, makeIndex, makeModule } from './fixtures/curriculum';
import {
  completeModules,
  completedLesson,
  lessonRecord,
  makeState,
  projectRecord,
} from './fixtures/progress';

describe('recommended next action', () => {
  const index = makeFullCourseIndex();

  it('recommends nothing when no content is authored', () => {
    expect(getRecommendedAction(makeState(), makeIndex([]))).toEqual({ kind: 'no-content' });
  });

  it('starts at the first lesson on a fresh state', () => {
    const action = getRecommendedAction(makeState(), index);

    expect(action.kind).toBe('start-lesson');
    if (action.kind !== 'start-lesson') throw new Error('unreachable');
    expect(action.lesson.id).toBe('lesson-1-1');
    expect(action.courseModule.id).toBe('module-1');
  });

  it('prefers finishing an open lesson over starting a new one', () => {
    const state = makeState([
      completedLesson('lesson-1-1'),
      lessonRecord('lesson-1-2', { visited: true, reachedEnd: true }),
    ]);
    const action = getRecommendedAction(state, index);

    expect(action.kind).toBe('resume-lesson');
    if (action.kind !== 'resume-lesson') throw new Error('unreachable');
    expect(action.lesson.id).toBe('lesson-1-2');
    expect(action.requirements).toEqual({
      reachedEnd: true,
      exerciseCompleted: false,
      reflectionAnswered: false,
    });
  });

  it('resumes the earliest open lesson, not the most recent', () => {
    const state = makeState([
      lessonRecord('lesson-3-1', { visited: true }),
      lessonRecord('lesson-1-2', { visited: true }),
    ]);
    const action = getRecommendedAction(state, index);

    if (action.kind !== 'resume-lesson') throw new Error('expected resume-lesson');
    expect(action.lesson.id).toBe('lesson-1-2');
  });

  it('advances to the next unopened lesson once the open one is finished', () => {
    const state = makeState([completedLesson('lesson-1-1')]);
    const action = getRecommendedAction(state, index);

    if (action.kind !== 'start-lesson') throw new Error('expected start-lesson');
    expect(action.lesson.id).toBe('lesson-1-2');
  });

  it('crosses into the next module when one is finished', () => {
    const state = makeState(completeModules([1], LESSONS_PER_MODULE));
    const action = getRecommendedAction(state, index);

    if (action.kind !== 'start-lesson') throw new Error('expected start-lesson');
    expect(action.lesson.id).toBe('lesson-2-1');
  });

  it('recommends the project only once every authored lesson is complete', () => {
    const oneModule = makeIndex([makeModule(1)]);
    const state = makeState(completeModules([1], LESSONS_PER_MODULE));
    const action = getRecommendedAction(state, oneModule);

    expect(action.kind).toBe('finish-project');
    if (action.kind !== 'finish-project') throw new Error('unreachable');
    expect(action.project.id).toBe('project-1');
  });

  it('reports the course complete when lessons and projects are all done', () => {
    const oneModule = makeIndex([makeModule(1)]);
    const state = makeState(completeModules([1], LESSONS_PER_MODULE), [
      projectRecord('project-1', 'module-1', 'completed'),
    ]);

    expect(getRecommendedAction(state, oneModule)).toEqual({ kind: 'course-complete' });
  });

  it('does not treat a project under review as finished', () => {
    const oneModule = makeIndex([makeModule(1)]);
    const state = makeState(completeModules([1], LESSONS_PER_MODULE), [
      projectRecord('project-1', 'module-1', 'reviewing'),
    ]);

    expect(getRecommendedAction(state, oneModule).kind).toBe('finish-project');
  });
});
