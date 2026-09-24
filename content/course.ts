/**
 * The course root: the single object the application reads the syllabus from.
 */

import type { Course } from '@/types/curriculum';
import { MODULES } from './modules';
import { PHASE_LIST } from './phases';

export const COURSE: Course = {
  id: 'design-engineering-academy',
  title: 'Design Engineering Academy',
  description:
    'A staged path from product design fundamentals to elite design engineering: product thinking, visual and interaction design, interface and frontend engineering, systems, accessibility, motion, performance, and the judgement to use them well.',
  phases: PHASE_LIST,
  modules: MODULES,
};
