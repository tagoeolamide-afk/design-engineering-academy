import { describe, expect, it } from 'vitest';
import {
  assertCurriculumIntegrity,
  checkCurriculumIntegrity,
} from '@/lib/curriculum/integrity';
import { CURRICULUM } from '@/lib/curriculum/queries';
import { makeFullCourseIndex, makeIndex, makeLesson, makeModule } from './fixtures/curriculum';

function errorsOf(index: Parameters<typeof checkCurriculumIntegrity>[0]) {
  return checkCurriculumIntegrity(index)
    .issues.filter((issue) => issue.severity === 'error')
    .map((issue) => issue.message);
}

describe('a well-formed curriculum', () => {
  it('passes with no errors', () => {
    const report = checkCurriculumIntegrity(makeFullCourseIndex());

    expect(report.errorCount).toBe(0);
    expect(report.isValid).toBe(true);
    expect(report.moduleCount).toBe(15);
    expect(report.lessonCount).toBe(75);
  });

  it('treats unwritten content as information, not failure', () => {
    /* One module of one lesson is the current real state of the project. It
     * must run cleanly, or development is blocked by its own validator. */
    const report = checkCurriculumIntegrity(makeIndex([makeModule(1, { lessonCount: 1 })]));

    expect(report.isValid).toBe(true);
    expect(report.errorCount).toBe(0);
    expect(report.infoCount).toBeGreaterThan(0);
    expect(report.issues.some((i) => i.message.includes('of 5 lessons authored'))).toBe(
      true,
    );
  });

  it('accepts the real seeded curriculum', () => {
    const report = checkCurriculumIntegrity(CURRICULUM);

    expect(report.errorCount).toBe(0);
    expect(report.warningCount).toBe(0);
    expect(() => assertCurriculumIntegrity(CURRICULUM)).not.toThrow();
  });
});

describe('malformed curriculum fails clearly', () => {
  it('rejects a lesson whose moduleId does not match its module', () => {
    const index = makeIndex([
      makeModule(1, { lessons: [makeLesson(1, 1, { moduleId: 'module-9' })] }),
    ]);

    expect(errorsOf(index).some((m) => m.includes('does not match owning module'))).toBe(
      true,
    );
  });

  it('rejects duplicate lesson ids', () => {
    const index = makeIndex([
      makeModule(1, {
        lessons: [makeLesson(1, 1), makeLesson(1, 2, { id: 'lesson-1-1' })],
      }),
    ]);

    expect(errorsOf(index).some((m) => m.includes('Duplicate lesson id'))).toBe(true);
  });

  it('rejects duplicate module numbers and slugs', () => {
    const index = makeIndex([makeModule(1), { ...makeModule(2), moduleNumber: 1 }]);
    const errors = errorsOf(index);

    expect(errors.some((m) => m.includes('Duplicate moduleNumber'))).toBe(true);
  });

  it('rejects a duplicate lesson slug inside one module', () => {
    const index = makeIndex([
      makeModule(1, {
        lessons: [makeLesson(1, 1), makeLesson(1, 2, { slug: 'lesson-1' })],
      }),
    ]);

    expect(errorsOf(index).some((m) => m.includes('Duplicate lesson slug'))).toBe(true);
  });

  it('rejects a sixth lesson but not a fourth', () => {
    const tooMany = makeIndex([makeModule(1, { lessonCount: 6 })]);
    expect(errorsOf(tooMany).some((m) => m.includes('more than the 5'))).toBe(true);

    const tooFew = makeIndex([makeModule(1, { lessonCount: 4 })]);
    expect(errorsOf(tooFew)).toEqual([]);
  });

  it('rejects an out-of-range lesson number', () => {
    const index = makeIndex([
      makeModule(1, { lessons: [makeLesson(1, 1, { lessonNumber: 7 })] }),
    ]);

    expect(errorsOf(index).some((m) => m.includes('outside 1..5'))).toBe(true);
  });

  it('rejects an unknown competency tag', () => {
    const index = makeIndex([
      makeModule(1, {
        lessons: [
          /* Cast is the point of the test: content is hand-authored and a typo
           * can reach runtime through a JSON import or a loosened type. */
          makeLesson(1, 1, {
            competencyTags: ['not-a-competency' as never],
          }),
        ],
      }),
    ]);

    expect(errorsOf(index).some((m) => m.includes('Unknown competency tag'))).toBe(true);
  });

  it('rejects a lesson that can never be completed', () => {
    const index = makeIndex([
      makeModule(1, { lessons: [makeLesson(1, 1, { reflectionQuestion: '  ' })] }),
    ]);

    expect(errorsOf(index).some((m) => m.includes('can never be completed'))).toBe(true);
  });

  it('rejects a non-positive duration', () => {
    const index = makeIndex([
      makeModule(1, { lessons: [makeLesson(1, 1, { estimatedMinutes: 0 })] }),
    ]);

    expect(errorsOf(index).some((m) => m.includes('greater than zero'))).toBe(true);
  });

  it('throws with every error listed', () => {
    const index = makeIndex([
      makeModule(1, {
        lessons: [makeLesson(1, 1, { moduleId: 'wrong', estimatedMinutes: -1 })],
      }),
    ]);

    expect(() => assertCurriculumIntegrity(index)).toThrow(
      /Curriculum integrity check failed with 2 error\(s\)/,
    );
    expect(() => assertCurriculumIntegrity(index)).toThrow(/greater than zero/);
  });
});

describe('prerequisite validation', () => {
  it('accepts a prerequisite pointing backwards', () => {
    const index = makeIndex([
      makeModule(1, {
        lessons: [makeLesson(1, 1), makeLesson(1, 2, { prerequisiteLessonIds: ['lesson-1-1'] })],
      }),
    ]);

    expect(errorsOf(index)).toEqual([]);
  });

  it('rejects a prerequisite that does not resolve', () => {
    const index = makeIndex([
      makeModule(1, { lessons: [makeLesson(1, 1, { prerequisiteLessonIds: ['ghost'] })] }),
    ]);

    expect(errorsOf(index).some((m) => m.includes('does not resolve'))).toBe(true);
  });

  it('rejects a self-reference', () => {
    const index = makeIndex([
      makeModule(1, {
        lessons: [makeLesson(1, 1, { prerequisiteLessonIds: ['lesson-1-1'] })],
      }),
    ]);

    expect(errorsOf(index).some((m) => m.includes('itself as a prerequisite'))).toBe(true);
  });

  it('rejects a forward reference, which is also what rules out cycles', () => {
    const index = makeIndex([
      makeModule(1, {
        lessons: [
          makeLesson(1, 1, { prerequisiteLessonIds: ['lesson-1-2'] }),
          makeLesson(1, 2),
        ],
      }),
    ]);

    expect(errorsOf(index).some((m) => m.includes('comes later in the course'))).toBe(true);
  });

  it('rejects a two-lesson cycle by way of the forward-reference rule', () => {
    const index = makeIndex([
      makeModule(1, {
        lessons: [
          makeLesson(1, 1, { prerequisiteLessonIds: ['lesson-1-2'] }),
          makeLesson(1, 2, { prerequisiteLessonIds: ['lesson-1-1'] }),
        ],
      }),
    ]);

    /* Only the forward edge is reported; that is enough to break the cycle. */
    expect(errorsOf(index).some((m) => m.includes('comes later in the course'))).toBe(true);
    expect(checkCurriculumIntegrity(index).isValid).toBe(false);
  });
});

describe('warnings', () => {
  it('flags a lesson that contributes to no competency', () => {
    const index = makeIndex([
      makeModule(1, { lessons: [makeLesson(1, 1, { competencyTags: [] })] }),
    ]);
    const report = checkCurriculumIntegrity(index);

    expect(report.isValid).toBe(true);
    expect(report.warningCount).toBeGreaterThan(0);
    expect(report.issues.some((i) => i.message.includes('no skill axis'))).toBe(true);
  });

  it('flags a module that under-declares what its lessons teach', () => {
    const index = makeIndex([
      makeModule(1, {
        competencies: ['product-thinking'],
        lessons: [makeLesson(1, 1, { competencyTags: ['performance'] })],
      }),
    ]);

    expect(
      checkCurriculumIntegrity(index).issues.some((i) =>
        i.message.includes('does not declare it'),
      ),
    ).toBe(true);
  });
});
