/**
 * Module registry.
 *
 * Each module is authored as its own file in this folder and added to the array
 * below. The array is the single place the application discovers curriculum
 * content, so adding a module is a one-line change and nothing else needs to
 * know how many modules exist.
 *
 * All fifteen modules are written. The integrity check verifies the shape —
 * fifteen modules, five lessons each, seventy-five lessons, fifteen projects —
 * and reports any shortfall as information rather than as an error.
 */

import type { CurriculumModule } from '@/types/curriculum';
import { MODULE_01 } from './module-01-design-engineering-foundations';
import { MODULE_02 } from './module-02-visual-systems';
import { MODULE_03 } from './module-03-html-semantics-and-accessibility';
import { MODULE_04 } from './module-04-css-interface-engineering';
import { MODULE_05 } from './module-05-javascript-and-browser-interaction';
import { MODULE_06 } from './module-06-typescript-git-and-engineering-workflow';
import { MODULE_07 } from './module-07-react-foundations';
import { MODULE_08 } from './module-08-component-architecture';
import { MODULE_09 } from './module-09-design-systems';
import { MODULE_10 } from './module-10-interaction-and-motion-engineering';
import { MODULE_11 } from './module-11-async-product-states-and-data-interfaces';
import { MODULE_12 } from './module-12-performance-and-browser-rendering';
import { MODULE_13 } from './module-13-product-architecture-and-quality';
import { MODULE_14 } from './module-14-taste-critique-and-interface-refinement';
import { MODULE_15 } from './module-15-ai-assisted-design-engineering-and-capstone';

export const MODULES: readonly CurriculumModule[] = [
  MODULE_01,
  MODULE_02,
  MODULE_03,
  MODULE_04,
  MODULE_05,
  MODULE_06,
  MODULE_07,
  MODULE_08,
  MODULE_09,
  MODULE_10,
  MODULE_11,
  MODULE_12,
  MODULE_13,
  MODULE_14,
  MODULE_15,
];
