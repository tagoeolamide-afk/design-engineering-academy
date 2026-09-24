/**
 * Module 04 — CSS Interface Engineering.
 *
 * Layout and styling as an engineering discipline: flow, the two layout
 * systems, intrinsic sizing, and an architecture that survives a second
 * developer.
 */

import type { CurriculumModule, Lesson, ModuleProject } from '@/types/curriculum';

const MODULE_ID = 'module-04';

/* -------------------------------------------------------------------------- */
/* Lesson 16                                                                   */
/* -------------------------------------------------------------------------- */

const LESSON_16: Lesson = {
  id: 'lesson-04-01',
  slug: 'box-model-and-flow',
  moduleId: MODULE_ID,
  lessonNumber: 1,
  title: 'Box Model and Flow',
  summary:
    'Normal flow already solves most layout problems. Understanding what it does for free is what stops you fighting it.',
  estimatedMinutes: 8,

  objectives: [
    'Describe the box model and the effect of box-sizing.',
    'Explain what normal flow provides without any layout code.',
    'Distinguish block and inline behaviour and their sizing rules.',
    'Recognise when absolute positioning is the wrong instinct.',
  ],

  prerequisiteConcepts: ['Semantic HTML', 'Spacing scales'],
  prerequisiteLessonIds: ['lesson-03-01', 'lesson-02-02'],

  recap: [
    {
      kind: 'paragraph',
      text: 'You have a document with honest structure and a visual system to apply to it. This module is about making the browser lay it out.',
    },
  ],

  coreConcept: [
    {
      kind: 'paragraph',
      text: 'Every element is a box with content, padding, border, and margin. The only part of this worth memorising is which of them the declared width includes.',
    },
    {
      kind: 'list',
      items: [
        'content-box, the default: width covers content only, so padding and border are added on top.',
        'border-box: width covers content, padding, and border, so the declared number is the visible size.',
      ],
    },
    {
      kind: 'paragraph',
      text: 'Normal flow is what happens before any layout property is set: block elements stack vertically and fill their container\'s width; inline elements sit in a line and wrap at the edge; the height of a container is the height of what it holds.',
    },
    {
      kind: 'callout',
      tone: 'insight',
      body: 'Flow already handles unknown content length, unknown viewport size, and text wrapping. Most layout bugs come from replacing that behaviour with fixed values.',
    },
  ],

  firstPrinciples: [
    {
      kind: 'paragraph',
      text: 'The web is a medium where the content length, the viewport, the font size, and the language are all unknown at design time. Normal flow is the browser\'s answer to that uncertainty: it sizes from content and reflows when anything changes.',
    },
    {
      kind: 'paragraph',
      text: 'Absolute positioning opts out. It removes the element from flow, so nothing else knows it exists — which means the container no longer grows to contain it, and overlaps become possible again. That is occasionally what you want and rarely what you need.',
    },
  ],

  designPerspective: [
    {
      kind: 'paragraph',
      text: 'Design tools place elements at coordinates, which quietly teaches the habit of thinking in positions rather than relationships. The browser thinks in relationships, and a design expressed as coordinates has to be translated before it can be built.',
    },
    {
      kind: 'paragraph',
      text: 'Fixed heights are the most common symptom. A card given a fixed height looks correct with the mockup\'s copy and clips the moment a title wraps to three lines — which it will, in the first language that is not English.',
    },
  ],

  engineeringPerspective: [
    {
      kind: 'code',
      language: 'css',
      caption: 'The two lines almost every project starts with, and why.',
      code: `/* Declared width means visible width. Without this, padding pushes
   elements past the size you set and layouts drift. */
*, *::before, *::after { box-sizing: border-box; }

/* Media are inline by default and do not shrink. These two lines prevent
   most "image overflows its container" bugs. */
img, svg, video { display: block; max-width: 100%; height: auto; }`,
    },
    {
      kind: 'paragraph',
      text: 'Margin collapsing is the other classic surprise: adjacent vertical margins combine into the larger of the two rather than adding. It only applies in normal flow, which is one reason gap-based layouts are easier to reason about.',
    },
  ],

  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'Designing with the browser\'s constraints rather than against them makes handover a translation instead of a negotiation. Auto layout in Figma exists precisely because the constraints turned out to be the useful ones.',
    },
    {
      kind: 'paragraph',
      text: 'A design engineer notices "this card has a fixed height" in a review and asks what happens with a longer title — before that question becomes a production bug in a language nobody tested.',
    },
  ],

  industryExamples: [
    {
      id: 'example-border-box-consensus',
      source: 'Every major CSS reset',
      title: 'An industry-wide correction to a default',
      observation:
        'Effectively every reset and framework sets box-sizing: border-box globally.',
      takeaway:
        'When the whole industry overrides a default, it is worth understanding what that default does before copying the fix.',
    },
    {
      id: 'example-fixed-height-bug',
      source: 'Localised interfaces',
      title: 'Fixed heights meeting German',
      observation:
        'Interfaces designed around English string lengths routinely clip when translated, because German and Finnish compounds are substantially longer.',
      takeaway:
        'Content-driven sizing is not a purist preference. It is what stops a layout breaking in markets nobody tested.',
    },
  ],

  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Rebuilding a card with flow only.',
    },
    { kind: 'heading', text: '1. Write the markup first' },
    {
      kind: 'paragraph',
      text: 'An article with a heading, a paragraph, and a link. In flow, these already stack correctly with no CSS at all.',
    },
    { kind: 'heading', text: '2. Add spacing, not positions' },
    {
      kind: 'paragraph',
      text: 'Padding on the card, margins or gap between children. Nothing is positioned; everything is related.',
    },
    { kind: 'heading', text: '3. Constrain width, never height' },
    {
      kind: 'paragraph',
      text: 'A max-width caps the measure. Height comes from content, which means it is correct for every content length automatically.',
    },
    { kind: 'heading', text: '4. Break it deliberately' },
    {
      kind: 'paragraph',
      text: 'Paste a title five times longer. Delete the paragraph entirely. If the card survives both, the layout is content-driven rather than mockup-driven.',
    },
  ],

  commonMistakes: [
    {
      id: 'mistake-fixed-height',
      mistake: 'Setting fixed heights on content containers.',
      why: 'Content length is unknown. Fixed heights clip or leave gaps as soon as reality differs from the mockup.',
      instead: 'Constrain width, set min-height if you need a floor, and let height follow content.',
    },
    {
      id: 'mistake-absolute-by-default',
      mistake: 'Reaching for absolute positioning to place things.',
      why: 'It removes the element from flow, so containers stop sizing correctly and overlaps return.',
      instead: 'Use flow, flex, or grid. Reserve absolute for genuine overlays and decorations.',
    },
    {
      id: 'mistake-content-box',
      mistake: 'Leaving box-sizing at its default.',
      why: 'Padding and borders push elements beyond the width you declared, producing drift that is hard to trace.',
      instead: 'Set border-box globally once.',
    },
    {
      id: 'mistake-margin-collapse-surprise',
      mistake: 'Fighting collapsed margins with extra wrappers.',
      why: 'The wrappers accumulate and the real rule is never learned.',
      instead: 'Use gap on a flex or grid container, which does not collapse.',
    },
  ],

  eliteConsiderations: [
    {
      kind: 'list',
      items: [
        'Test every layout with empty content and with content five times longer than designed.',
        'Prefer min-height over height when a floor is genuinely needed.',
        'Set images to display: block to remove the inline baseline gap that produces mysterious extra pixels.',
        'Reach for logical properties — margin-inline, padding-block — when a right-to-left language is plausible.',
      ],
    },
  ],

  practicalExercise: {
    id: 'exercise-04-01',
    title: 'Rebuild a card without absolute positioning',
    prompt:
      'Rebuild a card component using only normal flow. No absolute positioning, no fixed heights.',
    steps: [
      'Write the markup and confirm it reads correctly with no CSS.',
      'Set border-box globally.',
      'Add padding and spacing between children, using no positioning.',
      'Constrain width with max-width and leave height to content.',
      'Test with a title five times longer, and with the body text removed.',
      'Add an image and prevent it overflowing without fixing its height.',
    ],
    successCriteria: [
      'No absolute positioning anywhere in the component.',
      'No fixed heights on any content container.',
      'The card survives both an overlong title and missing content.',
      'The image scales without distortion or overflow.',
      'The unstyled markup is still readable.',
    ],
    estimatedMinutes: 30,
    hint: 'Before adding any CSS, look at the unstyled markup. Flow has already done most of the layout.',
  },

  reflectionQuestion: 'Why should normal flow remain your default?',
  reflectionHint:
    'Documents already know how to respond to content. What does flow handle that you would otherwise have to handle yourself, for every unknown?',

  resources: [
    {
      id: 'resource-mdn-box-model',
      title: 'MDN: the box model',
      url: 'https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/The_box_model',
      type: 'documentation',
      estimatedMinutes: 25,
      note: 'Box sizing and margin collapsing, explained with examples.',
    },
    {
      id: 'resource-mdn-flow',
      title: 'MDN: normal flow',
      url: 'https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Normal_Flow',
      type: 'documentation',
      estimatedMinutes: 15,
      note: 'What you get before writing any layout code.',
    },
  ],

  competencyTags: ['layout', 'html', 'css'],

  completionCriteria: [
    'Has built a component using only flow.',
    'Can explain box-sizing and margin collapsing.',
    'Component survives empty and overlong content.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Lesson 17                                                                   */
/* -------------------------------------------------------------------------- */

const LESSON_17: Lesson = {
  id: 'lesson-04-02',
  slug: 'flexbox',
  moduleId: MODULE_ID,
  lessonNumber: 2,
  title: 'Flexbox',
  summary:
    'Flexbox distributes space along one axis. Grow, shrink, and basis decide who absorbs the difference between available and needed space.',
  estimatedMinutes: 9,

  objectives: [
    'Reason about main and cross axis independently.',
    'Use grow, shrink, and basis deliberately rather than by trial.',
    'Prevent the flex-item overflow that causes most truncation bugs.',
    'Choose alignment appropriate to content that varies in size.',
  ],

  prerequisiteConcepts: ['Normal flow', 'Box model'],
  prerequisiteLessonIds: ['lesson-04-01'],

  recap: [
    {
      kind: 'paragraph',
      text: 'Flow stacks and wraps. Flexbox is the first tool for taking control of distribution along one axis.',
    },
  ],

  coreConcept: [
    {
      kind: 'paragraph',
      text: 'A flex container has a main axis, set by flex-direction, and a cross axis perpendicular to it. Every flex property acts on one or the other, and most confusion comes from forgetting which axis you are on — justify-content works on the main axis, align-items on the cross.',
    },
    {
      kind: 'paragraph',
      text: 'The interesting part is what happens when available space and required space differ. Three properties decide who absorbs the difference.',
    },
    {
      kind: 'list',
      items: [
        'flex-basis — the size an item wants before distribution.',
        'flex-grow — its share of any leftover space. Zero means "stay at basis".',
        'flex-shrink — its share of any deficit. Zero means "refuse to shrink".',
      ],
    },
    {
      kind: 'callout',
      tone: 'insight',
      body: 'justify-content distributes space the container has left over. flex-grow gives that space to the items instead. Those are different designs, and choosing between them is the real decision.',
    },
  ],

  firstPrinciples: [
    {
      kind: 'paragraph',
      text: 'Flex items have min-width: auto by default, which means they refuse to shrink below their content\'s intrinsic minimum. A long unbroken string therefore pushes the item wider than its container, and the overflow appears somewhere unrelated.',
    },
    {
      kind: 'paragraph',
      text: 'This single default explains most "why is my text not truncating" problems. Setting min-width: 0 on the item allows it to shrink so that overflow handling can apply.',
    },
  ],

  designPerspective: [
    {
      kind: 'paragraph',
      text: 'A toolbar makes the choices concrete. Which control keeps its size at all costs? Which absorbs extra room? What disappears first when space runs out?',
    },
    {
      kind: 'paragraph',
      text: 'Those are design decisions with direct property equivalents: shrink: 0 for controls that must stay legible, grow: 1 for the element that should take the slack, and an explicit plan for what collapses rather than an accident.',
    },
  ],

  engineeringPerspective: [
    {
      kind: 'code',
      language: 'css',
      caption: 'A toolbar where each item\'s behaviour is stated.',
      code: `.toolbar {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

/* Takes the slack. min-width lets it shrink so truncation can work. */
.toolbar__title { flex: 1 1 auto; min-width: 0; }

/* Never shrinks; icon buttons must stay tappable. */
.toolbar__actions { flex: 0 0 auto; }`,
    },
    {
      kind: 'paragraph',
      text: 'The shorthand order is grow, shrink, basis. flex: 1 means 1 1 0%, which makes items equal width regardless of content — frequently not what people expect when they type it.',
    },
  ],

  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'Flexbox is where "what happens when the title is long?" becomes a property value. The design answer and the CSS answer are the same sentence, which makes this an unusually direct translation.',
    },
    {
      kind: 'paragraph',
      text: 'It is also where responsive behaviour often emerges without breakpoints: flex-wrap lets a row become two rows when the content requires it, with no media query at all.',
    },
  ],

  industryExamples: [
    {
      id: 'example-toolbar-priority',
      source: 'Application toolbars generally',
      title: 'Explicit priority under pressure',
      observation:
        'Well-built toolbars decide in advance what truncates, what collapses into a menu, and what never moves.',
      takeaway:
        'Without those decisions the browser picks for you, usually by overflowing the most important element.',
    },
    {
      id: 'example-wrap-no-mediaquery',
      source: 'Modern component libraries',
      title: 'Wrapping instead of breakpoints',
      observation:
        'Button groups and tag lists commonly use flex-wrap with a gap, producing responsive behaviour with no media queries.',
      takeaway:
        'A layout that reflows by itself is correct at every width, including the ones nobody tested.',
    },
  ],

  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Building a navigation bar and a toolbar.',
    },
    { kind: 'heading', text: '1. Decide the axis' },
    {
      kind: 'paragraph',
      text: 'Row for a nav bar. Everything else follows from that: justify-content places along it, align-items across it.',
    },
    { kind: 'heading', text: '2. Assign behaviour per item' },
    {
      kind: 'paragraph',
      text: 'Write it in words first: logo fixed, links take the middle, actions fixed. Then translate to flex values.',
    },
    { kind: 'heading', text: '3. Fix the shrink problem before it appears' },
    {
      kind: 'paragraph',
      text: 'Any item that must truncate gets min-width: 0. Add it while writing the rule, not after finding the bug.',
    },
    { kind: 'heading', text: '4. Test at the extremes' },
    {
      kind: 'paragraph',
      text: 'One nav item and twelve. A very long title. A narrow viewport. Confirm the thing that gives way is the thing you chose.',
    },
  ],

  commonMistakes: [
    {
      id: 'mistake-missing-min-width',
      mistake: 'Forgetting min-width: 0 on a flex item that must truncate.',
      why: 'The default min-width: auto prevents shrinking below content size, so truncation silently does nothing.',
      instead: 'Add min-width: 0 to any flex item containing text that may need to truncate.',
    },
    {
      id: 'mistake-flex-1-everywhere',
      mistake: 'Applying flex: 1 to every item.',
      why: 'It sets basis to 0, so items become equal width regardless of content, which is rarely intended.',
      instead: 'Use flex: 1 1 auto to grow from content size, and reserve flex: 1 for genuinely equal columns.',
    },
    {
      id: 'mistake-flex-for-two-dimensions',
      mistake: 'Building a two-dimensional layout by nesting flex containers.',
      why: 'Alignment across both axes becomes impossible to maintain, because each nesting level only knows its own axis.',
      instead: 'Use Grid when you need rows and columns to align with each other.',
    },
    {
      id: 'mistake-margin-auto-confusion',
      mistake: 'Using justify-content when only one item should move.',
      why: 'It repositions every item, so a later addition changes the whole arrangement.',
      instead: 'Use margin-inline-start: auto on the single item that should be pushed away.',
    },
  ],

  eliteConsiderations: [
    {
      kind: 'list',
      items: [
        'Use gap rather than margins between flex children; it does not collapse and needs no last-child exception.',
        'Prefer flex-wrap with a sensible basis over media queries for anything that can simply reflow.',
        'Decide explicitly what happens at the smallest viewport, rather than letting whatever shrinks first decide.',
        'Remember align-items: stretch is the default — it is why sibling cards become equal height without effort.',
      ],
    },
  ],

  practicalExercise: {
    id: 'exercise-04-02',
    title: 'Build responsive navigation and toolbar layouts',
    prompt:
      'Build a navigation bar and a toolbar where every item\'s behaviour under pressure is deliberate.',
    steps: [
      'Write in words what each item should do when space is tight.',
      'Build the nav with a fixed logo, flexible links, and fixed actions.',
      'Build a toolbar with a truncating title and non-shrinking controls.',
      'Add min-width: 0 wherever truncation is required.',
      'Test with one item and with twelve, and with a very long title.',
      'Make one of the layouts respond by wrapping rather than by a media query.',
    ],
    successCriteria: [
      'Every item has an intentional grow and shrink value.',
      'Truncation works where intended.',
      'Nothing overflows its container at 320px.',
      'At least one responsive behaviour is achieved without a media query.',
      'gap is used rather than margins between children.',
    ],
    estimatedMinutes: 40,
    hint: 'When text refuses to truncate inside a flex item, the answer is almost always min-width: 0.',
  },

  reflectionQuestion:
    'When should an item grow rather than the container distribute empty space?',
  reflectionHint:
    'Think about ownership of available width. Does the extra space belong to one element, or to the gaps between all of them?',

  resources: [
    {
      id: 'resource-mdn-flexbox',
      title: 'MDN: basic concepts of flexbox',
      url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout/Basic_Concepts_of_Flexbox',
      type: 'documentation',
      estimatedMinutes: 30,
      note: 'Axes, and what each property acts on.',
    },
    {
      id: 'resource-flexbox-min-size',
      title: 'Controlling ratios of flex items',
      url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout/Controlling_Ratios_of_Flex_Items_Along_the_Main_Axis',
      type: 'documentation',
      estimatedMinutes: 20,
      note: 'Grow, shrink, and basis in detail, including the automatic minimum size.',
    },
  ],

  competencyTags: ['layout', 'responsive-design', 'css'],

  completionCriteria: [
    'Every flex item in the exercise has an intentional grow and shrink value.',
    'Can diagnose a truncation failure as a min-width problem.',
    'Has produced one responsive behaviour without a media query.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Lesson 18                                                                   */
/* -------------------------------------------------------------------------- */

const LESSON_18: Lesson = {
  id: 'lesson-04-03',
  slug: 'css-grid',
  moduleId: MODULE_ID,
  lessonNumber: 3,
  title: 'CSS Grid',
  summary:
    'Grid lays out in two dimensions at once, which is what makes alignment across both rows and columns possible.',
  estimatedMinutes: 9,

  objectives: [
    'Define tracks with fractions, minmax, and repeat.',
    'Build a responsive grid with no media queries.',
    'Use named areas where they make a layout legible.',
    'Choose between Grid and Flexbox by counting dimensions.',
  ],

  prerequisiteConcepts: ['Flexbox', 'Normal flow'],
  prerequisiteLessonIds: ['lesson-04-02'],

  recap: [
    {
      kind: 'paragraph',
      text: 'Flexbox distributes along one axis. When rows and columns both have to align, you need the other tool.',
    },
  ],

  coreConcept: [
    {
      kind: 'paragraph',
      text: 'Grid defines tracks — columns and rows — on the container, and places items into them. Because the tracks exist independently of the content, items in different rows can align with each other, which flex cannot do.',
    },
    {
      kind: 'list',
      items: [
        'fr — a fraction of the leftover space after fixed sizes are accounted for.',
        'minmax(min, max) — a track that is never smaller than min and never larger than max.',
        'repeat(count, track) — a repeated definition, with auto-fit and auto-fill as dynamic counts.',
        'Named areas — a visual map of the layout written directly in the stylesheet.',
      ],
    },
    {
      kind: 'callout',
      tone: 'insight',
      body: 'The deciding question is how many dimensions need to align. One, use flex. Two, use grid.',
    },
  ],

  firstPrinciples: [
    {
      kind: 'paragraph',
      text: 'auto-fit and auto-fill differ only when there are fewer items than fit. auto-fill keeps the empty tracks, so items stay at their natural size; auto-fit collapses them, so the remaining items stretch to fill the row.',
    },
    {
      kind: 'paragraph',
      text: 'Combined with minmax, either produces a fully responsive grid with no media queries: repeat(auto-fit, minmax(16rem, 1fr)) means "as many columns as fit at 16rem minimum, sharing the space equally".',
    },
  ],

  designPerspective: [
    {
      kind: 'paragraph',
      text: 'Grid is what makes a design system\'s column grid real in the browser rather than an overlay in the design file. When both use the same track definition, alignment stops being something to check by eye.',
    },
    {
      kind: 'paragraph',
      text: 'Named areas are worth using where the layout is the point — an application shell, a dashboard — because the stylesheet then contains a readable picture of the structure that survives being edited by someone else.',
    },
  ],

  engineeringPerspective: [
    {
      kind: 'code',
      language: 'css',
      caption: 'Two patterns that cover most real layouts.',
      code: `/* Responsive card grid. No media queries at all. */
.cards {
  display: grid;
  gap: var(--space-6);
  grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
}

/* Application shell, with the structure legible in the stylesheet. */
.shell {
  display: grid;
  min-height: 100vh;
  grid-template-columns: 15rem 1fr;
  grid-template-rows: auto 1fr;
  grid-template-areas:
    'sidebar header'
    'sidebar main';
}
.shell__sidebar { grid-area: sidebar; }
.shell__header  { grid-area: header; }
.shell__main    { grid-area: main; min-width: 0; }`,
    },
    {
      kind: 'paragraph',
      text: 'Grid items have the same automatic minimum size as flex items, so min-width: 0 is needed in the same places. A grid area containing a table or long text will otherwise push its track wider than the fraction allows.',
    },
  ],

  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'Grid closes the gap between a design file\'s layout grid and the implementation. It is also where reading order and visual order can diverge: grid can place an item anywhere, including somewhere that contradicts the DOM.',
    },
    {
      kind: 'paragraph',
      text: 'That power is worth using carefully. A visually reordered grid produces a tab order that does not match the screen, which is the accessibility problem from Module 3 reappearing in a new form.',
    },
  ],

  industryExamples: [
    {
      id: 'example-dashboard-grid',
      source: 'Analytics dashboards generally',
      title: 'Two-dimensional alignment doing real work',
      observation:
        'Dashboards align cards across both rows and columns so the eye can scan either direction. Nested flex containers cannot maintain that as content varies.',
      takeaway:
        'When alignment matters in both directions, grid is not a preference — it is the only tool that can express it.',
    },
    {
      id: 'example-auto-fit-cards',
      source: 'Documentation sites and marketing pages',
      title: 'Responsive without breakpoints',
      observation:
        'auto-fit with minmax has largely replaced three-breakpoint card grids in modern codebases.',
      takeaway:
        'One line replaces three media queries and behaves correctly at widths nobody anticipated.',
    },
  ],

  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Building a dashboard grid.',
    },
    { kind: 'heading', text: '1. Count dimensions' },
    {
      kind: 'paragraph',
      text: 'If cards must align across rows as well as within them, that is two dimensions and therefore grid.',
    },
    { kind: 'heading', text: '2. Define tracks from content' },
    {
      kind: 'paragraph',
      text: 'Decide the minimum readable card width, then use minmax with that minimum and 1fr as the maximum.',
    },
    { kind: 'heading', text: '3. Let the count be automatic' },
    {
      kind: 'paragraph',
      text: 'repeat(auto-fit, …) so the column count follows available space. Resize continuously and watch it reflow.',
    },
    { kind: 'heading', text: '4. Span deliberately' },
    {
      kind: 'paragraph',
      text: 'Where one card must be wider, use grid-column: span 2 — and check what happens when there is not room for two tracks.',
    },
    { kind: 'heading', text: '5. Verify the reading order' },
    {
      kind: 'paragraph',
      text: 'Tab through. If the order does not match the visual arrangement, fix the DOM rather than the placement.',
    },
  ],

  commonMistakes: [
    {
      id: 'mistake-grid-for-one-dimension',
      mistake: 'Using grid for a simple row of items.',
      why: 'It adds track definitions to maintain for something flex expresses in one line.',
      instead: 'Count dimensions first. One axis is flex.',
    },
    {
      id: 'mistake-fixed-columns',
      mistake: 'Defining fixed pixel columns and adding breakpoints to change them.',
      why: 'It reintroduces the breakpoint maintenance that auto-fit removes.',
      instead: 'Use minmax with a content-derived minimum and let the count adapt.',
    },
    {
      id: 'mistake-grid-min-width',
      mistake: 'Forgetting min-width: 0 on grid items with wide content.',
      why: 'Automatic minimum size applies to grid items too, so a table or long string expands its track.',
      instead: 'Add min-width: 0 to any item whose content may exceed its track.',
    },
    {
      id: 'mistake-visual-reorder-grid',
      mistake: 'Using grid placement to reorder content visually.',
      why: 'Tab order follows the DOM, so keyboard users traverse a different layout from the one they see.',
      instead: 'Change the DOM order, or accept the order the document implies.',
    },
  ],

  eliteConsiderations: [
    {
      kind: 'list',
      items: [
        'Use named areas for structural layouts; they make the stylesheet readable to whoever maintains it next.',
        'Prefer grid-template-columns over per-item placement — a layout defined once on the container is easier to change than one distributed across items.',
        'Check what happens with one item and with fifty; auto-fit behaves differently from auto-fill at the low end.',
        'Combine grid for structure with flex inside cells; they are complementary rather than alternatives.',
      ],
    },
  ],

  practicalExercise: {
    id: 'exercise-04-03',
    title: 'Build a responsive dashboard grid',
    prompt:
      'Build a dashboard grid that responds to available space with no media queries.',
    steps: [
      'Decide the minimum readable width of a card from its content.',
      'Define columns with repeat(auto-fit, minmax(…, 1fr)).',
      'Add a card that spans two tracks, and handle the case where two tracks do not fit.',
      'Add min-width: 0 wherever content could exceed its track.',
      'Build the page shell with named grid areas.',
      'Resize continuously from 320px and confirm nothing overflows.',
      'Tab through and confirm the reading order matches the visual order.',
    ],
    successCriteria: [
      'No media queries are used for the card grid.',
      'The spanning card behaves correctly at narrow widths.',
      'Nothing overflows at any width from 320px upwards.',
      'The shell uses named areas.',
      'Tab order matches visual order.',
    ],
    estimatedMinutes: 45,
    hint: 'Derive the minmax minimum from the content — the narrowest width at which the card is still readable — rather than picking a round number.',
  },

  reflectionQuestion: 'When is Grid better than Flexbox?',
  reflectionHint:
    'Count dimensions. Does anything need to align with an item in a different row?',

  resources: [
    {
      id: 'resource-mdn-grid-concepts',
      title: 'MDN: basic concepts of grid layout',
      url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout/Basic_Concepts_of_Grid_Layout',
      type: 'documentation',
      estimatedMinutes: 35,
      note: 'Tracks, lines, and areas from first principles.',
    },
    {
      id: 'resource-mdn-auto-placement',
      title: 'MDN: auto-placement in grid layout',
      url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout/Auto-placement_in_Grid_Layout',
      type: 'documentation',
      estimatedMinutes: 20,
      note: 'auto-fit and auto-fill, and how they differ when items are few.',
    },
  ],

  competencyTags: ['layout', 'responsive-design', 'css'],

  completionCriteria: [
    'Has built a responsive grid with no media queries.',
    'Can state the dimension test for choosing grid over flex.',
    'Tab order matches visual order in the result.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Lesson 19                                                                   */
/* -------------------------------------------------------------------------- */

const LESSON_19: Lesson = {
  id: 'lesson-04-04',
  slug: 'intrinsic-and-responsive-layout',
  moduleId: MODULE_ID,
  lessonNumber: 4,
  title: 'Intrinsic and Responsive Layout',
  summary:
    'Content has a natural size. Letting layout respond to that size rather than to viewport width produces systems with far fewer breakpoints.',
  estimatedMinutes: 9,

  objectives: [
    'Use min-content, max-content, and fit-content deliberately.',
    'Apply clamp to scale values without breakpoints.',
    'Build components that respond to their container rather than the viewport.',
    'Justify each breakpoint that remains.',
  ],

  prerequisiteConcepts: ['Flexbox', 'Grid', 'Measure'],
  prerequisiteLessonIds: ['lesson-04-03', 'lesson-02-03'],

  recap: [
    {
      kind: 'paragraph',
      text: 'You can define tracks and distribute space. This lesson is about letting content participate in that decision.',
    },
  ],

  coreConcept: [
    {
      kind: 'paragraph',
      text: 'Every piece of content has two natural sizes: min-content, the narrowest it can be without overflowing — usually the longest word — and max-content, the width it would take with no wrapping at all.',
    },
    {
      kind: 'list',
      items: [
        'min-content — as narrow as possible without overflow.',
        'max-content — as wide as the content wants, no wrapping.',
        'fit-content — max-content, capped at the available space.',
        'clamp(min, preferred, max) — a value that scales between two bounds.',
      ],
    },
    {
      kind: 'paragraph',
      text: 'The viewport is the wrong input for most component decisions. A card does not care how wide the window is; it cares how wide its container is. A component in a sidebar and the same component in a main column are in different situations at identical viewport widths.',
    },
    {
      kind: 'callout',
      tone: 'insight',
      body: 'Container queries let a component respond to its own context, which is the level at which almost every component decision actually lives.',
    },
  ],

  firstPrinciples: [
    {
      kind: 'paragraph',
      text: 'Media queries were a workaround for a missing capability. There was no way to ask "how much room do I have", so we asked "how big is the window" and inferred the rest — which only worked while layouts were simple and components appeared in one place.',
    },
    {
      kind: 'paragraph',
      text: 'Intrinsic sizing and container queries remove the inference. The component asks the real question, and its answer is correct wherever it is placed.',
    },
  ],

  designPerspective: [
    {
      kind: 'paragraph',
      text: 'Fewer breakpoints produce a stronger system because every breakpoint is a width at which the design was verified and, implicitly, widths at which it was not. A layout that flows continuously is correct everywhere rather than at three tested points.',
    },
    {
      kind: 'paragraph',
      text: 'clamp is the type-scale equivalent: a heading that scales smoothly between a floor and a ceiling never needs a breakpoint, and never appears at a size nobody chose.',
    },
  ],

  engineeringPerspective: [
    {
      kind: 'code',
      language: 'css',
      caption: 'Three tools that remove most breakpoints.',
      code: `/* Scales with the viewport, bounded at both ends. */
.page-title { font-size: clamp(1.5rem, 1rem + 2vw, 2.25rem); }

/* Wide enough for content, never wider than available space. */
.tag { width: fit-content; }

/* The component responds to its container, not the window. */
.card-host { container-type: inline-size; }

@container (min-width: 24rem) {
  .card { display: grid; grid-template-columns: 8rem 1fr; }
}`,
    },
    {
      kind: 'paragraph',
      text: 'The clamp middle value should include a relative unit, or the value never scales. A common mistake is clamp with three fixed lengths, which is just the middle value with extra steps.',
    },
  ],

  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'This changes how a design is specified. Instead of three fixed layouts, the specification becomes a set of rules: this text caps at 68 characters, this card switches to two columns when its container exceeds 24rem, this heading scales between these two sizes.',
    },
    {
      kind: 'paragraph',
      text: 'That is a harder specification to draw and a much more accurate one, because it describes what the design does at every width rather than at three.',
    },
  ],

  industryExamples: [
    {
      id: 'example-container-queries',
      source: 'Modern design systems',
      title: 'Components that adapt to placement',
      observation:
        'Card components increasingly switch between horizontal and stacked layouts based on container width, so the same component works in a sidebar and in a main column.',
      takeaway:
        'The component becomes genuinely reusable, because it no longer assumes where it will be placed.',
    },
    {
      id: 'example-fluid-type',
      source: 'Documentation sites',
      title: 'Type that scales without steps',
      observation:
        'Fluid type with clamp has largely replaced breakpoint-based font sizing, removing the jumps that used to occur at arbitrary widths.',
      takeaway:
        'Bounded scaling gives correct sizes at every width while keeping a floor and a ceiling you chose.',
    },
  ],

  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Building a card that works in an unknown container.',
    },
    { kind: 'heading', text: '1. Establish the container' },
    {
      kind: 'paragraph',
      text: 'Set container-type: inline-size on the wrapper so the card can query its own space.',
    },
    { kind: 'heading', text: '2. Design the narrow case first' },
    {
      kind: 'paragraph',
      text: 'Stacked, single column. This is the fallback and must be correct on its own.',
    },
    { kind: 'heading', text: '3. Add the wider arrangement at a content-derived threshold' },
    {
      kind: 'paragraph',
      text: 'The threshold is the width at which the two-column arrangement stops being cramped — found by resizing, not chosen in advance.',
    },
    { kind: 'heading', text: '4. Place it in three different contexts' },
    {
      kind: 'paragraph',
      text: 'A narrow sidebar, a wide main column, and a two-up grid. It should be correct in all three with no additional rules.',
    },
  ],

  commonMistakes: [
    {
      id: 'mistake-viewport-for-component',
      mistake: 'Using media queries to change a component\'s internal layout.',
      why: 'The component then assumes a placement. Put it in a sidebar and it is wrong at every viewport width.',
      instead: 'Use container queries so the component responds to its own space.',
    },
    {
      id: 'mistake-clamp-fixed',
      mistake: 'Writing clamp with three fixed lengths.',
      why: 'Without a relative unit in the middle value there is nothing to scale, so it never changes.',
      instead: 'Include a viewport or container relative unit in the preferred value.',
    },
    {
      id: 'mistake-breakpoint-by-device',
      mistake: 'Adding breakpoints at device widths.',
      why: 'It verifies the design at three arbitrary points and leaves everything between them untested.',
      instead: 'Add a breakpoint where the layout genuinely fails, and prefer intrinsic sizing first.',
    },
    {
      id: 'mistake-unbounded-fluid-type',
      mistake: 'Fluid type with no upper bound.',
      why: 'On a very wide display the heading becomes absurd, and on a very narrow one it becomes unreadable.',
      instead: 'Always clamp both ends.',
    },
  ],

  eliteConsiderations: [
    {
      kind: 'list',
      items: [
        'Test at 320px and at 2560px, not only in between. Both extremes reveal missing bounds.',
        'Use ch units for measure constraints; they track the font rather than assuming one.',
        'Check fluid type at 200% browser zoom — some viewport-based scaling interacts badly with zoom.',
        'Justify every remaining breakpoint in a comment. A breakpoint without a reason becomes permanent.',
      ],
    },
  ],

  practicalExercise: {
    id: 'exercise-04-04',
    title: 'Build cards that work in unknown containers',
    prompt:
      'Build a card component that is correct at any container size, without viewport media queries.',
    steps: [
      'Establish a container context on the card wrapper.',
      'Build the narrow, stacked arrangement first and verify it alone.',
      'Add a wider arrangement at a threshold found by resizing, not chosen up front.',
      'Use clamp for at least one value, with a relative unit in the middle.',
      'Place the card in a narrow sidebar, a wide column, and a two-up grid.',
      'Verify all three without adding any rules specific to a placement.',
      'Test at 320px and at 2560px.',
    ],
    successCriteria: [
      'No viewport media queries affect the card\'s internal layout.',
      'The card is correct in all three placements with no placement-specific rules.',
      'At least one clamp value scales, with both bounds set.',
      'Nothing overflows at 320px or looks absurd at 2560px.',
      'Any remaining breakpoint has a written justification.',
    ],
    estimatedMinutes: 45,
    hint: 'Find the threshold by dragging until the layout stops working, then set it just above that. Do not pick a round number first.',
  },

  reflectionQuestion:
    'Why could fewer breakpoints produce a stronger responsive system?',
  reflectionHint:
    'Let content do some of the work. What does a breakpoint actually verify, and what does it leave unverified?',

  resources: [
    {
      id: 'resource-mdn-container-queries',
      title: 'MDN: CSS container queries',
      url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_queries',
      type: 'documentation',
      estimatedMinutes: 25,
      note: 'Components responding to their own context.',
    },
    {
      id: 'resource-mdn-clamp',
      title: 'MDN: clamp()',
      url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/clamp',
      type: 'documentation',
      estimatedMinutes: 10,
      note: 'Bounded scaling, and why the middle value needs a relative unit.',
    },
    {
      id: 'resource-intrinsic-sizing',
      title: 'MDN: intrinsic sizing',
      url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_box_sizing/Intrinsic_sizing',
      type: 'documentation',
      estimatedMinutes: 15,
      note: 'min-content, max-content, and fit-content in practice.',
    },
  ],

  competencyTags: ['layout', 'responsive-design', 'css'],

  completionCriteria: [
    'Has built a component that adapts to its container rather than the viewport.',
    'Uses clamp correctly with both bounds.',
    'Every remaining breakpoint is justified in writing.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Lesson 20                                                                   */
/* -------------------------------------------------------------------------- */

const LESSON_20: Lesson = {
  id: 'lesson-04-05',
  slug: 'css-architecture',
  moduleId: MODULE_ID,
  lessonNumber: 5,
  title: 'CSS Architecture',
  summary:
    'CSS becomes unmaintainable through accumulated exceptions, not through volume. Architecture is the discipline of keeping decisions findable.',
  estimatedMinutes: 9,

  objectives: [
    'Separate tokens, utilities, and component styles by responsibility.',
    'Express variants and states as data rather than as class soup.',
    'Recognise when an abstraction has hidden necessary context.',
    'Judge when duplication is cheaper than reuse.',
  ],

  prerequisiteConcepts: ['Design tokens', 'Flexbox and Grid', 'Component thinking'],
  prerequisiteLessonIds: ['lesson-04-04', 'lesson-02-04'],

  recap: [
    {
      kind: 'paragraph',
      text: 'You can build any layout. This lesson is about building the fiftieth one without the previous forty-nine making it harder.',
    },
  ],

  coreConcept: [
    {
      kind: 'paragraph',
      text: 'Stylesheets rarely fail because of size. They fail because nobody can predict what changing a rule will affect, which makes every change a risk and pushes people to add rather than edit.',
    },
    {
      kind: 'list',
      items: [
        'Tokens — the vocabulary. Colours, spacing, type, radius, duration. Named by role.',
        'Primitives and utilities — single-purpose rules that apply a token consistently.',
        'Component styles — the appearance of one named thing, composed from tokens.',
        'Variants and states — declared options, expressed as data attributes or props rather than ad-hoc classes.',
      ],
    },
    {
      kind: 'callout',
      tone: 'insight',
      body: 'The test of an architecture is not how it reads today. It is whether someone else can change a component next year and predict what breaks.',
    },
  ],

  firstPrinciples: [
    {
      kind: 'paragraph',
      text: 'The cascade and specificity mean a style\'s effect depends on context. That is powerful and it is why unstructured CSS decays: each override raises the specificity floor, and the next change must beat it.',
    },
    {
      kind: 'paragraph',
      text: 'Keeping specificity flat — single classes, no ids, no deep descendant chains — means rules compose predictably. The goal is not purity; it is that a rule\'s effect can be reasoned about locally.',
    },
  ],

  designPerspective: [
    {
      kind: 'paragraph',
      text: 'A component with too many variants is usually a design problem wearing an engineering costume. Six button variants often means the visual language was never decided, so every new screen invented one.',
    },
    {
      kind: 'paragraph',
      text: 'Reducing variants is a design act with an immediate engineering payoff: fewer states to maintain, fewer combinations to test, and a more coherent product.',
    },
  ],

  engineeringPerspective: [
    {
      kind: 'code',
      language: 'css',
      caption: 'Variants and states as data, not as accumulated classes.',
      code: `.button {
  /* Component-local variables, defaulted then overridden by variant. */
  --button-bg: var(--color-surface);
  --button-fg: var(--color-text-primary);

  background: var(--button-bg);
  color: var(--button-fg);
  border-radius: var(--radius-medium);
  padding: var(--space-2) var(--space-3);
}

.button[data-variant='primary'] {
  --button-bg: var(--color-accent);
  --button-fg: var(--color-text-on-accent);
}

.button[data-variant='danger'] {
  --button-bg: transparent;
  --button-fg: var(--color-danger);
}

.button:disabled { opacity: 0.45; pointer-events: none; }`,
    },
    {
      kind: 'paragraph',
      text: 'Every rule here is a single class or attribute, so specificity stays flat and variants cannot accidentally beat each other. The variant changes variables rather than redeclaring properties, so a later change to padding happens in one place.',
    },
  ],

  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'Tokens are the shared contract: the designer decides what `--color-danger` means, the engineer uses it wherever danger is meant, and neither has to negotiate hex values in a review.',
    },
    {
      kind: 'paragraph',
      text: 'It also makes drift visible. A hard-coded value stands out in a diff in a way that "slightly the wrong red" never does in a screenshot.',
    },
  ],

  industryExamples: [
    {
      id: 'example-tailwind-constraint',
      source: 'Tailwind CSS',
      title: 'Utilities as enforced constraint',
      observation:
        'Tailwind exposes a fixed set of token-backed utilities, so most styling decisions are made from a short list rather than by typing arbitrary values.',
      takeaway:
        'The constraint is the feature. Arbitrary values remain possible, which makes them visible as exceptions.',
    },
    {
      id: 'example-primer-tokens',
      source: 'GitHub Primer',
      title: 'Components composed from functional tokens',
      observation:
        'Primer components reference functional tokens rather than raw colours, which is what lets GitHub ship several themes against one component layer.',
      takeaway:
        'The component layer never learns which theme it is in. That is the whole return on the token layer.',
    },
  ],

  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Refactoring an inconsistent interface into a system.',
    },
    { kind: 'heading', text: '1. Inventory before changing anything' },
    {
      kind: 'paragraph',
      text: 'List every distinct colour, spacing value, radius, and font size in use. The count is usually the argument for the refactor.',
    },
    { kind: 'heading', text: '2. Collapse to a scale' },
    {
      kind: 'paragraph',
      text: 'Map the eleven greys onto four tokens and the seventeen spacing values onto six. Record every mapping so the diff is reviewable.',
    },
    { kind: 'heading', text: '3. Find the real components' },
    {
      kind: 'paragraph',
      text: 'Group by behaviour, not appearance — the same test as reverse engineering in Module 1. Two things that merely look alike are not one component.',
    },
    { kind: 'heading', text: '4. Express variants as data' },
    {
      kind: 'paragraph',
      text: 'Replace accumulated modifier classes with a declared set of variants driven by an attribute.',
    },
    { kind: 'heading', text: '5. Leave the genuine exceptions alone' },
    {
      kind: 'paragraph',
      text: 'Some one-off styling is correct. Mark it as an exception with a comment rather than forcing it into the system.',
    },
  ],

  commonMistakes: [
    {
      id: 'mistake-premature-abstraction',
      mistake: 'Extracting a shared component after seeing two similar things.',
      why: 'The two may diverge for good reasons, and the abstraction then grows conditionals until it is harder than the duplication was.',
      instead: 'Wait for the third occurrence, and for the requirement to be stable.',
    },
    {
      id: 'mistake-specificity-war',
      mistake: 'Fixing an override with a more specific selector.',
      why: 'It raises the floor for every future change and ends in !important.',
      instead: 'Keep specificity flat and fix the ordering or the structure instead.',
    },
    {
      id: 'mistake-appearance-names',
      mistake: 'Naming classes after appearance.',
      why: '.blue-box becomes a lie the moment the design changes, and nobody dares rename it.',
      instead: 'Name by role or component, never by the current visual result.',
    },
    {
      id: 'mistake-variant-explosion',
      mistake: 'Adding a variant for every request.',
      why: 'Each one multiplies the states to maintain and test, and the system stops being a system.',
      instead: 'Push back to the design: is this a new variant, or an inconsistency?',
    },
  ],

  eliteConsiderations: [
    {
      kind: 'list',
      items: [
        'Use component-scoped custom properties so a variant changes one variable instead of redeclaring rules.',
        'Keep a documented list of allowed exceptions; an undocumented exception is indistinguishable from a mistake.',
        'Prefer duplication until the third use. Two similar things are a coincidence.',
        'Audit for hard-coded values periodically — a token system decays one convenient hex at a time.',
      ],
    },
  ],

  practicalExercise: {
    id: 'exercise-04-05',
    title: 'Refactor an inconsistent interface',
    prompt:
      'Take an interface with inconsistent styling and refactor it into a coherent system.',
    steps: [
      'Inventory every distinct colour, spacing value, radius, and font size, and record the counts.',
      'Define token scales and map every existing value onto them.',
      'Identify components by shared behaviour rather than appearance.',
      'Express variants and states as data attributes driven by declared options.',
      'Remove every hard-coded value that a token covers.',
      'Mark any remaining exception with a written reason.',
      'Confirm the interface is visually unchanged where it should be, and deliberately changed where it was inconsistent.',
    ],
    successCriteria: [
      'Before and after counts of distinct values are recorded.',
      'No hard-coded colour or spacing value remains without a documented reason.',
      'Variants are declared options, not accumulated modifier classes.',
      'Specificity is flat — no ids, no deep descendant selectors.',
      'At least one place where duplication was kept deliberately is identified.',
    ],
    estimatedMinutes: 50,
    hint: 'Start with the inventory. The count of distinct greys is usually the most persuasive thing in the whole exercise.',
  },

  reflectionQuestion: 'When does abstraction make CSS harder instead of easier?',
  reflectionHint:
    'Premature reuse hides context. What happens to a shared component when the two things it unified need to diverge?',

  resources: [
    {
      id: 'resource-cube-css',
      title: 'CUBE CSS',
      url: 'https://cube.fyi/',
      type: 'article',
      author: 'Andy Bell',
      estimatedMinutes: 25,
      note: 'A methodology that works with the cascade rather than against it.',
    },
    {
      id: 'resource-mdn-custom-properties',
      title: 'MDN: using CSS custom properties',
      url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties',
      type: 'documentation',
      estimatedMinutes: 20,
      note: 'Scoping and inheritance, which is what makes component-local variables work.',
    },
    {
      id: 'resource-primer-css',
      title: 'Primer design tokens',
      url: 'https://primer.style/foundations/primitives',
      type: 'documentation',
      estimatedMinutes: 20,
      note: 'A large system\'s token layer, published.',
    },
  ],

  competencyTags: ['css', 'architecture', 'design-systems-implementation'],

  completionCriteria: [
    'Has refactored a real interface onto token scales.',
    'Variants are expressed as declared data.',
    'Can name one place duplication was deliberately kept.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Project                                                                     */
/* -------------------------------------------------------------------------- */

const PROJECT: ModuleProject = {
  id: 'project-04',
  slug: 'responsive-application-shell',
  moduleId: MODULE_ID,
  title: 'Responsive Application Shell',
  brief:
    'Build a complete application shell — sidebar, header, cards, table, responsive navigation, and mobile states — using CSS layout only.',
  problem:
    'An application shell is the layout every other screen lives inside, which makes its failures systemic. It has to hold a fixed sidebar and a scrolling main region, a table that can be wider than its container, cards that reflow, and a navigation pattern that becomes something else entirely on a phone — all without the main content ever being pushed off screen.',
  objectives: [
    'Compose grid and flex appropriately for a two-dimensional shell.',
    'Handle content wider than its container without breaking the layout.',
    'Produce responsive navigation that changes pattern rather than merely shrinking.',
    'Keep the whole shell on declared token scales.',
  ],
  requirements: [
    'A persistent sidebar and a scrolling main region.',
    'A header that stays in place while content scrolls.',
    'A card grid that reflows without media queries.',
    'A data table that handles being wider than its container.',
    'Navigation that becomes a drawer or equivalent on small screens.',
    'Mobile states for every region of the shell.',
  ],
  constraints: [
    'No CSS framework and no component library.',
    'No JavaScript for layout — only for opening and closing the mobile navigation.',
    'Every spacing, colour, and type value must come from a declared token.',
    'No fixed heights on content regions.',
  ],
  suggestedScope:
    'One shell with one populated content page. Do not build routing, real data, or multiple screens — the deliverable is a layout that holds, not an application.',
  deliverables: [
    'A working shell with sidebar, header, card grid, and table.',
    'A responsive navigation pattern with its mobile states.',
    'A token file covering spacing, colour, type, and radius.',
    'A short note justifying every media query that remains.',
  ],
  completionCriteria: [
    'The shell holds at every width from 320px to 2560px with no overflow.',
    'The table is usable when wider than its container.',
    'Card reflow uses no media queries.',
    'Every remaining media query is justified in writing.',
    'Tab order matches visual order, and focus is visible throughout.',
  ],
  portfolioEvidence: [
    'CSS Grid and Flexbox',
    'Intrinsic and container-driven layout',
    'Responsive navigation patterns',
    'Token-based CSS architecture',
    'Overflow and table handling',
  ],
  reflectionQuestion:
    'Which part of the shell was hardest to keep from overflowing, and what does that say about where you place layout responsibility?',
  estimatedHours: 14,
  competencies: [
    'layout',
    'responsive-design',
    'accessibility',
    'css',
    'design-systems-implementation',
  ],
  stretchGoals: [
    'Make the sidebar collapsible with the main region reflowing via container queries.',
    'Add a sticky table header that survives horizontal scrolling.',
  ],
};

/* -------------------------------------------------------------------------- */

export const MODULE_04: CurriculumModule = {
  id: MODULE_ID,
  slug: 'css-interface-engineering',
  moduleNumber: 4,
  phase: 'interface-craft',
  title: 'CSS Interface Engineering',
  description:
    'Flow, Flexbox, Grid, intrinsic sizing, and an architecture that keeps a stylesheet predictable as it grows.',
  outcome: 'Develop deep layout and styling control.',
  prerequisites: [
    'Modules 1 to 3, or equivalent',
    'Comfort writing HTML and basic CSS',
  ],
  lessons: [LESSON_16, LESSON_17, LESSON_18, LESSON_19, LESSON_20],
  resources: [
    {
      id: 'resource-module-04-mdn-layout',
      title: 'MDN: CSS layout',
      url: 'https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout',
      type: 'documentation',
      estimatedMinutes: 120,
      note: 'Flow, flex, grid, and positioning from first principles.',
    },
    {
      id: 'resource-module-04-every-layout',
      title: 'Every Layout',
      url: 'https://every-layout.dev/',
      type: 'book',
      author: 'Heydon Pickering and Andy Bell',
      estimatedMinutes: 120,
      note: 'Intrinsic, content-driven layout primitives with the reasoning made explicit.',
    },
    {
      id: 'resource-module-04-cube',
      title: 'CUBE CSS',
      url: 'https://cube.fyi/',
      type: 'article',
      author: 'Andy Bell',
      estimatedMinutes: 25,
      note: 'An architecture that treats the cascade as a feature.',
    },
  ],
  project: PROJECT,
  competencies: [
    'layout',
    'responsive-design',
    'accessibility',
    'html',
    'css',
    'architecture',
    'design-systems-implementation',
  ],
  completionCriteria: [
    'All five lessons completed.',
    'Module project marked completed.',
    'Can build a responsive layout with justified breakpoints.',
  ],
};
