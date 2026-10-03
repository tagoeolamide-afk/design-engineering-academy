/**
 * Module registry.
 *
 * Each module is authored as its own file in this folder and added to the array
 * below. The array is the single place the application discovers curriculum
 * content, so adding a module is a one-line change and nothing else needs to
 * know how many modules exist.
 *
 * All fifteen modules are registered. One further module — Motion and
 * Interaction Quality — is written but parked in `./pending/`: curriculum v2
 * places it at module 12, and modules 11–15 have not yet been renumbered to
 * make room for it. It returns to the registry when that stage runs.
 *
 * The integrity check verifies the shape — fifteen modules, five lessons each,
 * seventy-five lessons, fifteen projects — and reports any shortfall as
 * information rather than as an error.
 */

import type { CurriculumModule } from '@/types/curriculum';
import { MODULE_01 } from './module-01-how-interfaces-work';
import { MODULE_02 } from './module-02-visual-foundations';
import { MODULE_03 } from './module-03-html-and-css-foundations';
import { MODULE_04 } from './module-04-javascript-for-interface-designers';
import { MODULE_05 } from './module-05-state-and-product-behaviour';
import { MODULE_06 } from './module-06-typescript-git-and-workflow';
import { MODULE_07 } from './module-07-react-foundations';
import { MODULE_08 } from './module-08-component-architecture';
import { MODULE_09 } from './module-09-accessibility-for-design-engineers';
import { MODULE_10 } from './module-10-design-systems';
import { MODULE_11 } from './module-11-data-and-async-interfaces';
import { MODULE_12 } from './module-12-motion-and-interaction-quality';
import { MODULE_13 } from './module-13-performance-testing-and-design-qa';
import { MODULE_14 } from './module-14-product-architecture-and-systems-thinking';
import { MODULE_15 } from './module-15-advanced-design-engineering-and-capstone';

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
