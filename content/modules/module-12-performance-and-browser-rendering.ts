/**
 * Module 12 — Performance and Browser Rendering.
 *
 * What the browser actually does between a change and a pixel, what each stage
 * costs, and how to measure it rather than guess.
 */

import type { CurriculumModule, Lesson, ModuleProject } from '@/types/curriculum';

const MODULE_ID = 'module-12';

/* -------------------------------------------------------------------------- */
/* Lesson 56                                                                   */
/* -------------------------------------------------------------------------- */

const LESSON_56: Lesson = {
  id: 'lesson-12-01',
  slug: 'rendering-pipeline',
  moduleId: MODULE_ID,
  lessonNumber: 1,
  title: 'Rendering Pipeline',
  summary:
    'The browser turns markup and styles into pixels through a fixed sequence of stages. Which stage your change enters at determines what it costs.',
  estimatedMinutes: 9,

  objectives: [
    'Name the pipeline stages in order and say what each produces.',
    'Predict which stages a given property change triggers.',
    'Inspect real rendering work in developer tools.',
    'Explain why some changes skip most of the pipeline.',
  ],

  prerequisiteConcepts: ['CSS layout', 'DOM manipulation'],
  prerequisiteLessonIds: ['lesson-04-01', 'lesson-05-04'],

  recap: [
    {
      kind: 'paragraph',
      text: 'Module 5 introduced layout thrashing as an ordering problem. This module explains the machine that makes ordering matter.',
    },
  ],

  coreConcept: [
    {
      kind: 'paragraph',
      text: 'Between your change and a visible pixel, the browser runs a fixed sequence. Each stage consumes the output of the last.',
    },
    {
      kind: 'list',
      items: [
        'DOM — the parsed document tree.',
        'CSSOM — the parsed style rules.',
        'Style — matching rules to elements, producing computed styles.',
        'Layout — computing the geometry of every box: position and size.',
        'Paint — filling in pixels: colours, text, shadows, borders.',
        'Composite — assembling painted layers into the final frame.',
      ],
    },
    {
      kind: 'paragraph',
      text: 'A change enters the pipeline at the earliest stage it affects and runs everything after it. Change a width and layout must run, which means paint and composite must run too. Change a background colour and layout is untouched, so the work starts at paint.',
    },
    {
      kind: 'callout',
      tone: 'insight',
      body: 'Transform and opacity affect only compositing. The browser can produce a new frame without recomputing geometry or repainting anything — which is why they are the only properties safe to animate.',
    },
  ],

  firstPrinciples: [
    {
      kind: 'paragraph',
      text: 'Layout is expensive because it is interdependent. One element\'s size can affect its siblings, its parent, and everything after it in flow, so the browser may have to recompute a large part of the tree for a single change.',
    },
    {
      kind: 'paragraph',
      text: 'Compositing is cheap because the work is already done. The layer exists as a painted bitmap; moving or fading it is a transformation applied when the frame is assembled, often on the GPU, with nothing recomputed.',
    },
  ],

  designPerspective: [
    {
      kind: 'paragraph',
      text: 'This is where a design decision has a mechanical cost that is invisible in a mockup. "The card grows on hover" and "the card lifts slightly on hover" look similar on a slide and differ by an entire pipeline stage.',
    },
    {
      kind: 'paragraph',
      text: 'A scale transform achieves the growth without layout. Animating width and height achieves it with layout on every frame, and on a mid-range phone that is the difference between smooth and visibly stepped.',
    },
  ],

  engineeringPerspective: [
    {
      kind: 'code',
      language: 'css',
      caption: 'The same visual effect, entering the pipeline at different stages.',
      code: `/* Layout -> paint -> composite, every frame. */
.card:hover { width: 320px; height: 220px; }

/* Composite only. Same apparent effect, a fraction of the work. */
.card { transition: transform 200ms ease-out; }
.card:hover { transform: scale(1.04); }

/* Paint -> composite. Cheaper than layout, not free. */
.card:hover { background-color: var(--color-surface-raised); }

/* Composite only. */
.overlay { transition: opacity 150ms linear; }`,
    },
    {
      kind: 'paragraph',
      text: 'In Chrome DevTools, the Performance panel shows this directly. Record an interaction and the flame chart colours the work: purple for layout and style, green for paint, and you can see which frames did which.',
    },
    {
      kind: 'paragraph',
      text: 'The Rendering panel has two switches worth knowing: paint flashing highlights repainted regions in green, and layer borders shows what has been promoted to its own composited layer.',
    },
  ],

  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'Understanding the pipeline turns "this feels janky" into a specific diagnosis. A designer can say the hover feels heavy; a design engineer can say it is animating width and propose a scale transform instead.',
    },
    {
      kind: 'paragraph',
      text: 'That is a more useful contribution than either "make it faster" or "that is just how it is".',
    },
  ],

  industryExamples: [
    {
      id: 'example-compositor-animations',
      source: 'Browser engine documentation',
      title: 'Two properties singled out',
      observation:
        'Every major engine documents transform and opacity as the properties that can be animated without layout or paint.',
      takeaway:
        'The guidance is identical across engines because it follows from the pipeline, not from implementation choices.',
    },
    {
      id: 'example-devtools-pipeline',
      source: 'Chrome DevTools Performance panel',
      title: 'The pipeline made visible',
      observation:
        'Recorded profiles label each piece of work by stage, so a frame that ran layout is distinguishable from one that only composited.',
      takeaway:
        'The cost is observable, which means it never has to be guessed at.',
    },
  ],

  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Inspecting rendering behaviour in DevTools.',
    },
    { kind: 'heading', text: '1. Record a real interaction' },
    {
      kind: 'paragraph',
      text: 'Open the Performance panel, record, perform one hover or transition, stop. Keep the recording short.',
    },
    { kind: 'heading', text: '2. Read the frames' },
    {
      kind: 'paragraph',
      text: 'Look for frames over 16ms. Expand one and read which stages ran.',
    },
    { kind: 'heading', text: '3. Compare two versions of the same effect' },
    {
      kind: 'paragraph',
      text: 'Animate width, then animate scale. Record both. The difference in the flame chart is the lesson.',
    },
    { kind: 'heading', text: '4. Turn on paint flashing' },
    {
      kind: 'paragraph',
      text: 'The Rendering panel. Interact and watch what repaints. Large green regions for a small change indicate a promotion or containment problem.',
    },
    { kind: 'heading', text: '5. Throttle the CPU' },
    {
      kind: 'paragraph',
      text: '4x or 6x slowdown. Work that is invisible on a development machine becomes obvious, and this is closer to what most users have.',
    },
  ],

  commonMistakes: [
    {
      id: 'mistake-animate-geometry',
      mistake: 'Animating width, height, top, or left.',
      why: 'Layout runs on every frame, and layout cost scales with how much of the tree is affected.',
      instead: 'Animate transform to achieve the same movement or scaling.',
    },
    {
      id: 'mistake-guess-cost',
      mistake: 'Reasoning about performance from how an effect looks.',
      why: 'Visual simplicity has no relationship to which pipeline stages run.',
      instead: 'Record it and read the stages.',
    },
    {
      id: 'mistake-fast-machine',
      mistake: 'Testing only on a development machine.',
      why: 'A fast CPU absorbs work that a mid-range phone cannot, so the problem is invisible where it is created.',
      instead: 'Throttle the CPU when profiling.',
    },
    {
      id: 'mistake-will-change-everywhere',
      mistake: 'Applying `will-change` broadly.',
      why: 'Each promoted layer consumes memory, and too many layers cost more than they save.',
      instead: 'Promote only what is actually about to animate, and remove it afterwards.',
    },
  ],

  eliteConsiderations: [
    {
      kind: 'list',
      items: [
        'Use `contain: layout` on independent regions so a change inside one cannot force layout elsewhere.',
        'Check layer borders before adding `will-change`; the browser may already have promoted the element.',
        'Profile with CPU throttling by default, not as a final check.',
        'Read the frame duration, not the total — a 200ms interaction made of smooth frames is fine.',
      ],
    },
  ],

  practicalExercise: {
    id: 'exercise-12-01',
    title: 'Inspect rendering behaviour in DevTools',
    prompt:
      'Profile real interactions and identify which pipeline stages each one triggers.',
    steps: [
      'Record a hover interaction in the Performance panel.',
      'Identify every frame over 16ms and list which stages ran.',
      'Build the same visual effect twice: once with geometry properties, once with transform.',
      'Record both and compare the stages and frame durations.',
      'Enable paint flashing and note what repaints during a small change.',
      'Enable layer borders and record what is already composited.',
      'Repeat the profile with 4x CPU throttling and compare.',
      'Write down which properties in your project trigger layout.',
    ],
    successCriteria: [
      'Two recordings of the same effect are compared with stage-level detail.',
      'The frame-time difference between the two versions is recorded.',
      'Paint flashing observations are written down.',
      'Profiles were taken with CPU throttling enabled.',
      'A list of layout-triggering properties in the project exists.',
    ],
    estimatedMinutes: 45,
    hint: 'Record the two versions back to back. The flame chart comparison is more convincing than any explanation.',
  },

  reflectionQuestion:
    'Why is changing `transform` often cheaper than changing layout properties?',
  reflectionHint: 'Some changes skip earlier pipeline stages.',

  resources: [
    {
      id: 'resource-rendering-performance',
      title: 'Rendering performance',
      url: 'https://web.dev/articles/rendering-performance',
      type: 'article',
      estimatedMinutes: 25,
      note: 'The pipeline, stage by stage, with the cost of each.',
    },
    {
      id: 'resource-csstriggers-mdn',
      title: 'MDN: will-change',
      url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/will-change',
      type: 'documentation',
      estimatedMinutes: 15,
      note: 'Layer promotion, and why it should be used sparingly.',
    },
  ],

  competencyTags: ['css', 'browser-apis', 'performance'],

  completionCriteria: [
    'Has profiled two versions of one effect and compared stages.',
    'Can predict which properties trigger layout.',
    'Profiles were taken under CPU throttling.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Lesson 57                                                                   */
/* -------------------------------------------------------------------------- */

const LESSON_57: Lesson = {
  id: 'lesson-12-02',
  slug: 'layout-and-paint-cost',
  moduleId: MODULE_ID,
  lessonNumber: 2,
  title: 'Layout and Paint Cost',
  summary:
    'Layout cost scales with how much of the tree is affected, not with how much changed. That is why one line can cost a frame.',
  estimatedMinutes: 9,

  objectives: [
    'Explain why layout is interdependent and therefore expensive.',
    'Recognise layout thrashing in a profile.',
    'Use containment to limit how far a change propagates.',
    'Identify paint-heavy properties and their cheaper alternatives.',
  ],

  prerequisiteConcepts: ['Rendering pipeline'],
  prerequisiteLessonIds: ['lesson-12-01'],

  recap: [
    {
      kind: 'paragraph',
      text: 'Layout computes geometry. This lesson is about why that computation is not local, and what to do about it.',
    },
  ],

  coreConcept: [
    {
      kind: 'paragraph',
      text: 'Reflow is the browser recomputing geometry. It is not local: changing one element can affect siblings that flow after it, ancestors that size to content, and descendants that size to their parent. A single change can invalidate a large subtree.',
    },
    {
      kind: 'paragraph',
      text: 'Paint fills pixels. Cost scales with area and with complexity — large blurred shadows, complex gradients, and filters are all more expensive per pixel than a flat fill, and a full-viewport repaint is expensive regardless of what caused it.',
    },
    {
      kind: 'callout',
      tone: 'warning',
      body: 'Layout thrashing is not a lot of layout work. It is one layout per loop iteration, caused by reading a geometry property after writing one.',
    },
  ],

  firstPrinciples: [
    {
      kind: 'paragraph',
      text: 'The browser batches style and layout work so it can do it once per frame. But reading `offsetHeight` or `getBoundingClientRect` requires an answer that reflects pending changes, so the browser must flush and compute immediately.',
    },
    {
      kind: 'paragraph',
      text: 'Alternate writes and reads in a loop over a hundred elements and you have forced a hundred synchronous layouts where one would have done. The total work is identical; the scheduling is what destroys the frame.',
    },
  ],

  designPerspective: [
    {
      kind: 'paragraph',
      text: 'Paint cost is where visual decisions become performance decisions. A large soft shadow on every card in a scrolling list repaints a substantial area on every frame.',
    },
    {
      kind: 'paragraph',
      text: 'Usually there is a cheaper equivalent: a smaller shadow with slightly more opacity reads similarly at normal viewing distance and costs a fraction of the blur. The design is not compromised; the implementation is chosen.',
    },
  ],

  engineeringPerspective: [
    {
      kind: 'code',
      language: 'ts',
      caption: 'A forced layout per iteration, and the same work batched.',
      code: `// One synchronous layout per row. 100 rows, 100 layouts.
rows.forEach((row) => {
  row.style.height = \`\${row.offsetHeight + 8}px\`;   // read after write
});

// Read everything, then write everything. One layout.
const heights = rows.map((row) => row.offsetHeight);
rows.forEach((row, i) => {
  row.style.height = \`\${heights[i]! + 8}px\`;
});`,
    },
    {
      kind: 'code',
      language: 'css',
      caption: 'Containment: a promise that limits how far work propagates.',
      code: `/* Nothing inside this card can affect layout outside it, so a change
   within it cannot invalidate the rest of the page. */
.card { contain: layout style; }

/* Off-screen list items skip layout and paint entirely until needed. */
.list-item { content-visibility: auto; contain-intrinsic-size: auto 72px; }`,
    },
    {
      kind: 'paragraph',
      text: '`contain-intrinsic-size` matters alongside `content-visibility`: without a size estimate, skipped elements contribute zero height and the scrollbar jumps as they render.',
    },
  ],

  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'Containment is a structural promise, and structure is a shared decision. Regions that are visually independent are usually independent in layout too, and marking them as such is free performance.',
    },
    {
      kind: 'paragraph',
      text: 'It is one of the few cases where good component boundaries have a direct, measurable rendering benefit.',
    },
  ],

  industryExamples: [
    {
      id: 'example-content-visibility',
      source: 'Long-list interfaces',
      title: 'Skipping work for off-screen content',
      observation:
        'Applications with long lists use content-visibility or virtualisation so off-screen items cost nothing until scrolled into view.',
      takeaway:
        'Rendering cost becomes proportional to what is visible rather than to what exists.',
    },
    {
      id: 'example-shadow-cost',
      source: 'Scrolling card interfaces',
      title: 'Blur radius as a scroll cost',
      observation:
        'Large blurred shadows on many simultaneously visible elements are a common cause of dropped frames during scroll.',
      takeaway:
        'A visual parameter with no obvious cost in a mockup is a per-frame cost in a product.',
    },
  ],

  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Profiling an animated interaction.',
    },
    { kind: 'heading', text: '1. Record the interaction under throttling' },
    {
      kind: 'paragraph',
      text: '4x CPU slowdown. Record the animation from start to finish.',
    },
    { kind: 'heading', text: '2. Find the long frames' },
    {
      kind: 'paragraph',
      text: 'Anything over 16ms. Expand and read what dominated: style, layout, paint, or script.',
    },
    { kind: 'heading', text: '3. Look for forced synchronous layout' },
    {
      kind: 'paragraph',
      text: 'DevTools flags it explicitly. Each occurrence is a read that followed a write.',
    },
    { kind: 'heading', text: '4. Batch reads before writes' },
    {
      kind: 'paragraph',
      text: 'Collect every measurement first, then apply every change. Re-record and compare.',
    },
    { kind: 'heading', text: '5. Reduce paint area' },
    {
      kind: 'paragraph',
      text: 'Paint flashing shows what repaints. Add containment to independent regions and re-check.',
    },
    { kind: 'heading', text: '6. Record the numbers' },
    {
      kind: 'paragraph',
      text: 'Worst frame before, worst frame after. Without figures there is no evidence anything improved.',
    },
  ],

  commonMistakes: [
    {
      id: 'mistake-read-after-write',
      mistake: 'Reading a geometry property after writing a style.',
      why: 'It forces a synchronous layout, and inside a loop that becomes one per iteration.',
      instead: 'Batch all reads, then all writes.',
    },
    {
      id: 'mistake-large-blur',
      mistake: 'Large blur radii on many simultaneously visible elements.',
      why: 'Blur cost scales with radius and area, and repaints on every scroll frame.',
      instead: 'Use a smaller radius with higher opacity; it reads similarly at normal distance.',
    },
    {
      id: 'mistake-no-containment',
      mistake: 'Leaving independent regions uncontained.',
      why: 'A change inside one region can invalidate layout across the whole page.',
      instead: 'Apply `contain: layout` where the region genuinely is independent.',
    },
    {
      id: 'mistake-content-visibility-no-size',
      mistake: 'Using content-visibility without an intrinsic size.',
      why: 'Skipped elements have zero height, so the scrollbar jumps as content renders.',
      instead: 'Provide `contain-intrinsic-size` with a realistic estimate.',
    },
  ],

  eliteConsiderations: [
    {
      kind: 'list',
      items: [
        'Coalesce scroll and resize work with requestAnimationFrame so at most one update happens per frame.',
        'Prefer class toggles over multiple inline style writes; one invalidation instead of several.',
        'Use `contain: layout style` on card and row components by default in long lists.',
        'Record worst-frame numbers before and after every change; impressions are unreliable at this scale.',
      ],
    },
  ],

  practicalExercise: {
    id: 'exercise-12-02',
    title: 'Profile an animated interaction',
    prompt:
      'Profile an animation, find its cost, reduce it, and record the measured difference.',
    steps: [
      'Record the interaction with 4x CPU throttling.',
      'Identify every frame over 16ms and what dominated it.',
      'Find any forced synchronous layout flagged by DevTools.',
      'Batch reads before writes and re-record.',
      'Use paint flashing to find oversized repaint regions.',
      'Apply containment to genuinely independent regions.',
      'Replace any layout-triggering animation with a transform equivalent.',
      'Record worst-frame duration before and after.',
    ],
    successCriteria: [
      'No forced synchronous layout remains in the profiled interaction.',
      'Worst-frame durations are recorded before and after.',
      'Repaint regions were inspected and reduced where oversized.',
      'Every animated property is transform or opacity.',
      'The measurement was taken under CPU throttling.',
    ],
    estimatedMinutes: 50,
    hint: 'Search the profile for "Forced reflow". DevTools names it, and each instance points at a read that followed a write.',
  },

  reflectionQuestion:
    'Why could a visually simple animation perform poorly?',
  reflectionHint: 'Appearance does not reveal computational cost.',

  resources: [
    {
      id: 'resource-avoid-thrashing-12',
      title: 'Avoid large, complex layouts and layout thrashing',
      url: 'https://web.dev/articles/avoid-large-complex-layouts-and-layout-thrashing',
      type: 'article',
      estimatedMinutes: 25,
      note: 'Forced synchronous layout explained with measurements.',
    },
    {
      id: 'resource-css-containment',
      title: 'MDN: CSS containment',
      url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment',
      type: 'documentation',
      estimatedMinutes: 25,
      note: 'What each containment value promises and what it buys.',
    },
    {
      id: 'resource-content-visibility',
      title: 'content-visibility: the new CSS property that boosts rendering performance',
      url: 'https://web.dev/articles/content-visibility',
      type: 'article',
      estimatedMinutes: 20,
      note: 'Skipping off-screen work, including the intrinsic-size caveat.',
    },
  ],

  competencyTags: ['css', 'browser-apis', 'performance'],

  completionCriteria: [
    'Has eliminated forced synchronous layout from a real interaction.',
    'Before and after frame durations are recorded.',
    'Containment applied where regions are independent.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Lesson 58                                                                   */
/* -------------------------------------------------------------------------- */

const LESSON_58: Lesson = {
  id: 'lesson-12-03',
  slug: 'javascript-cost',
  moduleId: MODULE_ID,
  lessonNumber: 3,
  title: 'JavaScript Cost',
  summary:
    'The main thread runs your code, handles input, and produces frames. Anything long blocks all three.',
  estimatedMinutes: 9,

  objectives: [
    'Explain why a single thread makes long tasks a responsiveness problem.',
    'Identify long tasks and what produced them.',
    'Break up or defer work so input stays responsive.',
    'Distinguish download cost from execution cost.',
  ],

  prerequisiteConcepts: ['Event loop', 'Events'],
  prerequisiteLessonIds: ['lesson-12-02', 'lesson-05-05'],

  recap: [
    {
      kind: 'paragraph',
      text: 'Rendering work competes with your code for the same thread. This lesson is about the code side of that competition.',
    },
  ],

  coreConcept: [
    {
      kind: 'paragraph',
      text: 'The main thread does everything: executes JavaScript, runs event handlers, computes style and layout, paints. It does one thing at a time, so any task that runs long delays everything queued behind it.',
    },
    {
      kind: 'paragraph',
      text: 'A long task is conventionally anything over 50ms. During one, a click is not handled, a keystroke does not appear, and no frame is produced. The interface is not slow — it is unresponsive, which users experience as broken rather than sluggish.',
    },
    {
      kind: 'list',
      items: [
        'Parse and compile — the cost of having script at all, before it does anything.',
        'Execution — the work itself.',
        'Handlers — work triggered by input, which is where blocking is most visible.',
        'Scheduling — deciding when work runs, which is often the only lever available.',
      ],
    },
    {
      kind: 'callout',
      tone: 'insight',
      body: 'A fast connection delivers a large bundle quickly and the device still has to parse, compile, and execute it. On a mid-range phone, execution routinely costs several times the download.',
    },
  ],

  firstPrinciples: [
    {
      kind: 'paragraph',
      text: 'Responsiveness is not about total work but about how long the thread is held without yielding. The same hundred milliseconds of computation feels entirely different as one block versus as ten chunks with yields between them.',
    },
    {
      kind: 'paragraph',
      text: 'Yielding lets the browser process pending input and produce a frame. The work finishes at the same time; the interface stays alive throughout.',
    },
  ],

  designPerspective: [
    {
      kind: 'paragraph',
      text: 'Unresponsiveness is read as unreliability. A button that does not visually respond for 300ms is pressed again, and the second press is either a duplicate action or ignored — both of which erode trust more than the delay itself.',
    },
    {
      kind: 'paragraph',
      text: 'The mitigation is to acknowledge immediately and do the work after. Change the button state in the handler, yield, then compute. The user sees the response in the frame they clicked.',
    },
  ],

  engineeringPerspective: [
    {
      kind: 'code',
      language: 'ts',
      caption: 'Acknowledge, yield, then work.',
      code: `button.addEventListener('click', async () => {
  setBusy(true);                    // visible in the next frame
  await new Promise((r) => requestAnimationFrame(() => r(null)));  // let it paint

  await processInChunks(items);
  setBusy(false);
});

// Yield between chunks so input and frames are not blocked.
async function processInChunks<T>(items: T[], size = 200) {
  for (let i = 0; i < items.length; i += size) {
    process(items.slice(i, i + size));
    if ('scheduler' in window) await scheduler.yield();
    else await new Promise((r) => setTimeout(r, 0));
  }
}`,
    },
    {
      kind: 'paragraph',
      text: 'For work with no DOM involvement — parsing a large file, heavy computation over a dataset — a Web Worker moves it off the main thread entirely, which is strictly better than chunking when it is available.',
    },
    {
      kind: 'paragraph',
      text: 'The Performance panel marks long tasks with a red triangle. Each one is a window during which the interface could not respond, and each has an identifiable cause in the flame chart beneath it.',
    },
  ],

  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'Feature decisions have thread costs that are invisible when specified. Rich text editing, live previews, client-side search over a large dataset — each is a choice to spend main-thread time.',
    },
    {
      kind: 'paragraph',
      text: 'Knowing that during the design conversation allows the trade to be made deliberately rather than discovered when the interface stops responding on a real device.',
    },
  ],

  industryExamples: [
    {
      id: 'example-inp-metric',
      source: 'Core Web Vitals',
      title: 'Responsiveness elevated to a ranked metric',
      observation:
        'Interaction to Next Paint measures the delay between input and visual response, and long tasks are its dominant cause.',
      takeaway:
        'Blocking the thread is measured as a user-facing defect, not as an implementation detail.',
    },
    {
      id: 'example-worker-offload',
      source: 'Applications with heavy client-side work',
      title: 'Computation moved off the main thread',
      observation:
        'Products doing substantial parsing or computation run it in workers so the interface stays responsive throughout.',
      takeaway:
        'The work costs the same; what changes is whether it competes with input.',
    },
  ],

  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Finding and reducing one expensive interaction.',
    },
    { kind: 'heading', text: '1. Record the interaction under throttling' },
    {
      kind: 'paragraph',
      text: '4x or 6x CPU slowdown. Record from just before the input to after the response.',
    },
    { kind: 'heading', text: '2. Find the long tasks' },
    {
      kind: 'paragraph',
      text: 'Red-flagged blocks over 50ms. Read the flame chart to find which function dominated.',
    },
    { kind: 'heading', text: '3. Measure the input delay' },
    {
      kind: 'paragraph',
      text: 'From the input event to the next paint. That is the number the user experiences.',
    },
    { kind: 'heading', text: '4. Acknowledge first' },
    {
      kind: 'paragraph',
      text: 'Set the busy state, yield for a frame, then do the work. Re-measure the delay.',
    },
    { kind: 'heading', text: '5. Chunk or offload' },
    {
      kind: 'paragraph',
      text: 'Chunk with yields if the DOM is involved; move it to a worker if not.',
    },
    { kind: 'heading', text: '6. Record both numbers' },
    {
      kind: 'paragraph',
      text: 'Longest task and input-to-paint delay, before and after.',
    },
  ],

  commonMistakes: [
    {
      id: 'mistake-work-before-feedback',
      mistake: 'Doing the work before updating the interface.',
      why: 'No frame is produced until the work finishes, so the press appears to have done nothing.',
      instead: 'Update state, yield for a frame, then work.',
    },
    {
      id: 'mistake-bundle-size-only',
      mistake: 'Treating bundle size as the whole performance story.',
      why: 'Parse, compile, and execution are separate costs, and on mid-range devices they dominate.',
      instead: 'Measure execution time, not only transfer size.',
    },
    {
      id: 'mistake-no-yielding',
      mistake: 'Processing a large collection in one pass.',
      why: 'The thread is held for the whole pass, so no input is handled and no frame is drawn.',
      instead: 'Chunk with yields, or move the work to a worker.',
    },
    {
      id: 'mistake-expensive-handlers',
      mistake: 'Heavy work directly inside scroll, resize, or input handlers.',
      why: 'They fire far more often than frames, so most of the work is discarded before it is seen.',
      instead: 'Coalesce with requestAnimationFrame or debounce.',
    },
  ],

  eliteConsiderations: [
    {
      kind: 'list',
      items: [
        'Use `scheduler.yield()` where available; it yields to input without going to the back of the task queue.',
        'Move non-DOM computation to a worker rather than chunking it.',
        'Defer anything not needed for the first interaction until after it.',
        'Budget execution time per interaction and measure against it, not against a feeling.',
      ],
    },
  ],

  practicalExercise: {
    id: 'exercise-12-03',
    title: 'Find and reduce one expensive interaction',
    prompt:
      'Profile an interaction, find what blocks the thread, and measure the improvement.',
    steps: [
      'Record an interaction with CPU throttling enabled.',
      'Identify every task over 50ms and the function responsible.',
      'Measure the delay from input to the next paint.',
      'Move the acknowledgement before the work and yield for a frame.',
      'Chunk the work with yields, or move it to a worker if no DOM is involved.',
      'Re-record and measure both numbers again.',
      'Record longest task and input-to-paint delay, before and after.',
    ],
    successCriteria: [
      'No task over 50ms remains in the profiled interaction.',
      'Input-to-paint delay is recorded before and after.',
      'The interface acknowledges input in the frame it occurred.',
      'Work is chunked or offloaded, not merely reordered.',
      'Measurements were taken under CPU throttling.',
    ],
    estimatedMinutes: 50,
    hint: 'Measure input-to-paint, not total duration. The user judges the first response, not the completion.',
  },

  reflectionQuestion:
    'Why does fast network delivery not guarantee a responsive interface?',
  reflectionHint: 'Downloading and executing are different work.',

  resources: [
    {
      id: 'resource-long-tasks',
      title: 'Optimize long tasks',
      url: 'https://web.dev/articles/optimize-long-tasks',
      type: 'article',
      estimatedMinutes: 25,
      note: 'Yielding strategies, including scheduler.yield.',
    },
    {
      id: 'resource-mdn-workers',
      title: 'MDN: using Web Workers',
      url: 'https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers',
      type: 'documentation',
      estimatedMinutes: 30,
      note: 'Moving computation off the main thread.',
    },
  ],

  competencyTags: ['javascript', 'browser-apis', 'performance', 'interaction-engineering'],

  completionCriteria: [
    'Has eliminated long tasks from one interaction.',
    'Input-to-paint delay improved and was measured.',
    'Work is chunked or offloaded.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Lesson 59                                                                   */
/* -------------------------------------------------------------------------- */

const LESSON_59: Lesson = {
  id: 'lesson-12-04',
  slug: 'network-and-assets',
  moduleId: MODULE_ID,
  lessonNumber: 4,
  title: 'Network and Assets',
  summary:
    'Images, fonts, and bundles are most of what a page weighs. What loads first, and what waits, is a design decision with a measurable cost.',
  estimatedMinutes: 9,

  objectives: [
    'Serve images at appropriate sizes and formats without layout shift.',
    'Load fonts without invisible or shifting text.',
    'Split bundles so the first interaction is not blocked.',
    'Use caching so repeat visits are substantially cheaper.',
  ],

  prerequisiteConcepts: ['JavaScript cost', 'Packages and builds'],
  prerequisiteLessonIds: ['lesson-12-03', 'lesson-06-05'],

  recap: [
    {
      kind: 'paragraph',
      text: 'Execution competes for the thread. Loading competes for bandwidth and for the user\'s patience before anything is on screen.',
    },
  ],

  coreConcept: [
    {
      kind: 'paragraph',
      text: 'Assets divide into those needed for the first meaningful view and everything else. The first group should be small, prioritised, and space-reserved. The second should not compete with it.',
    },
    {
      kind: 'list',
      items: [
        'Images — correctly sized, modern format, dimensions declared, lazy below the fold.',
        'Fonts — subset, preloaded, with a fallback that does not hide text.',
        'Bundles — split so a route loads what it needs and nothing more.',
        'Caching — long-lived immutable assets with hashed filenames.',
      ],
    },
    {
      kind: 'paragraph',
      text: 'The single highest-return image change is usually declared dimensions. Without width and height or an aspect ratio, the browser cannot reserve space, so content jumps when the image arrives — and someone reading or clicking at that moment is displaced.',
    },
    {
      kind: 'callout',
      tone: 'warning',
      body: 'Lazy-loading an above-the-fold image delays the very thing the user is waiting to see. The attribute is not universally beneficial.',
    },
  ],

  firstPrinciples: [
    {
      kind: 'paragraph',
      text: 'Fonts create a genuine dilemma. Hide text until the font loads and the page is blank for a period the user experiences as nothing happening. Show a fallback and the text reflows when the real font arrives.',
    },
    {
      kind: 'paragraph',
      text: '`font-display: swap` chooses the second, and the shift can be nearly eliminated by matching the fallback\'s metrics — `size-adjust` and the override descriptors make a system font occupy almost the same space as the web font.',
    },
  ],

  designPerspective: [
    {
      kind: 'paragraph',
      text: 'Asset decisions are design decisions with a delivery cost. A hero photograph, four font weights, and an icon library are each a choice about what the user waits for.',
    },
    {
      kind: 'paragraph',
      text: 'Two weights instead of four halves font payload and is rarely visible in the design. Knowing that during the visual decision is better than discovering it during a performance pass.',
    },
  ],

  engineeringPerspective: [
    {
      kind: 'code',
      language: 'html',
      caption: 'Above the fold and below it, treated differently.',
      code: `<!-- Above the fold: eager, high priority, space reserved. -->
<img src="/hero-800.webp"
     srcset="/hero-400.webp 400w, /hero-800.webp 800w, /hero-1600.webp 1600w"
     sizes="(max-width: 768px) 100vw, 800px"
     width="800" height="450"
     fetchpriority="high" alt="" />

<!-- Below the fold: lazy, still space-reserved so nothing jumps. -->
<img src="/detail-600.webp" width="600" height="400"
     loading="lazy" decoding="async" alt="Project detail" />`,
    },
    {
      kind: 'code',
      language: 'css',
      caption: 'A fallback sized to match, so swapping barely shifts anything.',
      code: `@font-face {
  font-family: 'Inter';
  src: url('/fonts/inter-subset.woff2') format('woff2');
  font-display: swap;          /* text is visible immediately */
  unicode-range: U+0000-00FF;  /* subset to the characters actually used */
}

@font-face {
  font-family: 'Inter fallback';
  src: local('Arial');
  size-adjust: 107%;           /* match the real font's metrics */
  ascent-override: 90%;
}

body { font-family: 'Inter', 'Inter fallback', sans-serif; }`,
    },
  ],

  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'Layout shift from an unsized image is simultaneously a performance metric and a usability failure — someone about to tap a link has it move out from under them.',
    },
    {
      kind: 'paragraph',
      text: 'Reserving space costs two attributes and eliminates an entire class of defect, which makes it one of the highest-return habits available.',
    },
  ],

  industryExamples: [
    {
      id: 'example-cls-images',
      source: 'Core Web Vitals field data',
      title: 'Unsized images as a leading cause of shift',
      observation:
        'Missing image dimensions remain one of the most common sources of Cumulative Layout Shift across the web.',
      takeaway:
        'The fix is two attributes, which is why its persistence is a habit problem rather than a technical one.',
    },
    {
      id: 'example-font-subsetting',
      source: 'Typography-heavy sites',
      title: 'Subsetting and metric matching',
      observation:
        'Sites that load custom fonts without visible reflow subset aggressively and size-adjust their fallbacks.',
      takeaway:
        'The swap becomes almost imperceptible without hiding text at any point.',
    },
  ],

  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Optimising a media-heavy page.',
    },
    { kind: 'heading', text: '1. Measure the baseline' },
    {
      kind: 'paragraph',
      text: 'Total transferred, largest contentful paint, layout shift. Numbers before any change.',
    },
    { kind: 'heading', text: '2. Find the largest assets' },
    {
      kind: 'paragraph',
      text: 'Sort the network panel by size. The top three usually account for most of the weight.',
    },
    { kind: 'heading', text: '3. Fix images first' },
    {
      kind: 'paragraph',
      text: 'Correct dimensions, modern format, srcset for real display sizes, width and height declared.',
    },
    { kind: 'heading', text: '4. Split above and below the fold' },
    {
      kind: 'paragraph',
      text: 'The hero eager and high priority. Everything below lazy, all with reserved space.',
    },
    { kind: 'heading', text: '5. Subset and match the fonts' },
    {
      kind: 'paragraph',
      text: 'Only the weights used, only the characters needed, swap with a metric-matched fallback.',
    },
    { kind: 'heading', text: '6. Split the bundle' },
    {
      kind: 'paragraph',
      text: 'Route-level splitting, and defer anything not needed for the first interaction.',
    },
    { kind: 'heading', text: '7. Re-measure' },
    {
      kind: 'paragraph',
      text: 'The same three numbers, under the same throttling. Record both sets.',
    },
  ],

  commonMistakes: [
    {
      id: 'mistake-no-dimensions',
      mistake: 'Omitting width and height on images.',
      why: 'The browser cannot reserve space, so content jumps when each image arrives.',
      instead: 'Always declare dimensions or an aspect ratio.',
    },
    {
      id: 'mistake-lazy-hero',
      mistake: 'Lazy-loading the hero image.',
      why: 'It delays the largest contentful element, which is the thing being measured and waited for.',
      instead: 'Load above-the-fold images eagerly with high priority.',
    },
    {
      id: 'mistake-oversized-images',
      mistake: 'Serving one large image to every viewport.',
      why: 'A phone downloads several times the pixels it can display.',
      instead: 'Use srcset and sizes with realistic breakpoints.',
    },
    {
      id: 'mistake-font-blocking',
      mistake: 'Loading fonts without a display strategy.',
      why: 'Text is invisible until the font arrives, which reads as a broken page on a slow connection.',
      instead: 'Use `font-display: swap` with a metric-matched fallback.',
    },
  ],

  eliteConsiderations: [
    {
      kind: 'list',
      items: [
        'Preload only the one or two assets genuinely needed for the first paint; preloading everything prioritises nothing.',
        'Use hashed filenames with long-lived immutable caching so repeat visits fetch almost nothing.',
        'Subset fonts to the characters actually used, and ship only the weights in the type scale.',
        'Set `fetchpriority="high"` on the LCP image, and leave everything else at default.',
      ],
    },
  ],

  practicalExercise: {
    id: 'exercise-12-04',
    title: 'Optimise one media-heavy page',
    prompt:
      'Take a page with substantial images and fonts and reduce its loading cost with measurements either side.',
    steps: [
      'Record baseline transferred bytes, largest contentful paint, and layout shift.',
      'Identify the three largest assets.',
      'Resize and reformat images, and add srcset with realistic sizes.',
      'Declare width and height on every image.',
      'Load above-the-fold images eagerly with high priority; lazy-load the rest.',
      'Subset fonts, ship only the weights used, and add a metric-matched fallback.',
      'Split the bundle by route and defer anything not needed for first interaction.',
      'Re-measure all three numbers under identical throttling and record both sets.',
    ],
    successCriteria: [
      'Layout shift from images is eliminated.',
      'Before and after figures are recorded for all three metrics.',
      'The hero image is not lazy-loaded.',
      'Fonts are subset and text is never invisible.',
      'Measurements were taken under identical throttling conditions.',
    ],
    estimatedMinutes: 55,
    hint: 'Start with image dimensions. It is two attributes and usually removes most of the layout shift immediately.',
  },

  reflectionQuestion: 'Should every image load immediately?',
  reflectionHint: 'Consider what the user sees first.',

  resources: [
    {
      id: 'resource-optimize-lcp',
      title: 'Optimize Largest Contentful Paint',
      url: 'https://web.dev/articles/optimize-lcp',
      type: 'article',
      estimatedMinutes: 30,
      note: 'Prioritising the one element that defines the metric.',
    },
    {
      id: 'resource-font-best-practices',
      title: 'Best practices for fonts',
      url: 'https://web.dev/articles/font-best-practices',
      type: 'article',
      estimatedMinutes: 25,
      note: 'Subsetting, display strategies, and fallback matching.',
    },
    {
      id: 'resource-mdn-responsive-images',
      title: 'MDN: responsive images',
      url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Responsive_images',
      type: 'documentation',
      estimatedMinutes: 25,
      note: 'srcset and sizes, with the reasoning behind each.',
    },
  ],

  competencyTags: ['typography', 'responsive-design', 'html', 'performance'],

  completionCriteria: [
    'Has optimised a media-heavy page with measurements either side.',
    'Image-caused layout shift is eliminated.',
    'Fonts load without invisible text.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Lesson 60                                                                   */
/* -------------------------------------------------------------------------- */

const LESSON_60: Lesson = {
  id: 'lesson-12-05',
  slug: 'measuring-responsiveness',
  moduleId: MODULE_ID,
  lessonNumber: 5,
  title: 'Measuring Responsiveness',
  summary:
    'Performance work without measurement is guessing. The metrics exist because human judgement of short delays is unreliable.',
  estimatedMinutes: 9,

  objectives: [
    'Define LCP, CLS, and INP and what each captures.',
    'Distinguish lab measurement from field data.',
    'Set a performance budget and check against it.',
    'Record evidence that survives someone else\'s scepticism.',
  ],

  prerequisiteConcepts: ['Profiling', 'Asset loading'],
  prerequisiteLessonIds: ['lesson-12-04'],

  recap: [
    {
      kind: 'paragraph',
      text: 'The previous four lessons found and fixed costs. This one is about proving the fix, and about knowing what to fix next.',
    },
  ],

  coreConcept: [
    {
      kind: 'paragraph',
      text: 'Three metrics capture the three things users notice, and each has a threshold below which the experience is considered good.',
    },
    {
      kind: 'list',
      items: [
        'LCP — when the largest content element appears. Good at or under 2.5 seconds.',
        'CLS — how much content moves unexpectedly. Good at or under 0.1.',
        'INP — the delay between an interaction and the resulting visual update. Good at or under 200ms.',
      ],
    },
    {
      kind: 'paragraph',
      text: 'Lab measurement is reproducible and controlled: same device, same network, same content. Field data is what real users experienced, on the devices and connections they actually have. Lab data tells you whether a change helped; field data tells you what to work on.',
    },
    {
      kind: 'callout',
      tone: 'insight',
      body: 'Report field data at the 75th percentile. An average hides the quarter of users having the worst time, who are the ones most likely to leave.',
    },
  ],

  firstPrinciples: [
    {
      kind: 'paragraph',
      text: 'Human perception of short delays is unreliable and biased. You know what is about to happen, you are on a fast machine on a fast network, and you have loaded the page a hundred times with a warm cache.',
    },
    {
      kind: 'paragraph',
      text: 'Every one of those makes the experience better than a user\'s. Measurement removes the bias; it does not replace judgement about what matters, but it does replace guessing about what is happening.',
    },
  ],

  designPerspective: [
    {
      kind: 'paragraph',
      text: 'A performance budget turns performance from an aspiration into a constraint, which is the only form in which it survives a deadline. "Under 2.5 seconds on a mid-range phone on 4G" is a constraint a feature has to fit inside.',
    },
    {
      kind: 'paragraph',
      text: 'It also changes the conversation. "This carousel costs 240KB and pushes LCP past budget" is a design discussion with a number in it, rather than a preference.',
    },
  ],

  engineeringPerspective: [
    {
      kind: 'code',
      language: 'ts',
      caption: 'Measuring the metrics in the field, not only in the lab.',
      code: `import { onLCP, onCLS, onINP } from 'web-vitals';

// Field measurement: what real users on real devices experienced.
const report = (metric: { name: string; value: number; rating: string }) => {
  // Send to wherever you collect; log locally while developing.
  console.log(\`\${metric.name}: \${Math.round(metric.value)} (\${metric.rating})\`);
};

onLCP(report);
onCLS(report);
onINP(report);`,
    },
    {
      kind: 'paragraph',
      text: 'For lab measurement, Lighthouse under consistent conditions — same throttling, same device emulation, several runs — is enough. A single run is noise; the median of five is a number.',
    },
    {
      kind: 'paragraph',
      text: 'INP in particular cannot be measured well in a lab, because it depends on which interactions real users perform. A page that profiles perfectly can still have a poor INP because of one interaction nobody tested.',
    },
  ],

  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'Measurement is what makes performance a shared conversation instead of an argument between preferences. Both disciplines can read the same number and agree about whether it moved.',
    },
    {
      kind: 'paragraph',
      text: 'It is also what makes the work defensible later. Before and after figures under stated conditions are evidence; "it feels faster" is not.',
    },
  ],

  industryExamples: [
    {
      id: 'example-p75-reporting',
      source: 'Core Web Vitals methodology',
      title: 'The 75th percentile as the standard',
      observation:
        'Web Vitals are assessed at the 75th percentile of real-user data rather than as an average.',
      takeaway:
        'It ensures the metric reflects the experience of users having a bad time, not just the typical one.',
    },
    {
      id: 'example-perf-budgets',
      source: 'Teams with performance budgets',
      title: 'Budgets enforced in the build',
      observation:
        'Teams that hold performance over time check bundle size and metric thresholds automatically, failing the build on regression.',
      takeaway:
        'Performance that is not enforced degrades, because every individual addition is small.',
    },
  ],

  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Measuring a project and recording baseline and improved results.',
    },
    { kind: 'heading', text: '1. Fix the conditions' },
    {
      kind: 'paragraph',
      text: 'Device emulation, network throttling, CPU throttling, cache state. Write them down — a measurement without conditions is not a measurement.',
    },
    { kind: 'heading', text: '2. Take the baseline' },
    {
      kind: 'paragraph',
      text: 'Five runs, record the median of each metric. One run is noise.',
    },
    { kind: 'heading', text: '3. Add field measurement' },
    {
      kind: 'paragraph',
      text: 'The web-vitals library, reporting locally at minimum. INP especially needs real interactions.',
    },
    { kind: 'heading', text: '4. Set a budget' },
    {
      kind: 'paragraph',
      text: 'A number per metric, plus a bundle size ceiling. Derived from the thresholds and from what your users have.',
    },
    { kind: 'heading', text: '5. Change one thing at a time' },
    {
      kind: 'paragraph',
      text: 'Measure after each. Batched changes make it impossible to know what helped, or what made something worse.',
    },
    { kind: 'heading', text: '6. Record the evidence' },
    {
      kind: 'paragraph',
      text: 'A table: metric, before, after, conditions, what changed. This is the artefact.',
    },
  ],

  commonMistakes: [
    {
      id: 'mistake-single-run',
      mistake: 'Drawing conclusions from one measurement.',
      why: 'Run-to-run variance is large enough to hide or fake an improvement.',
      instead: 'Take at least five runs and use the median.',
    },
    {
      id: 'mistake-unstated-conditions',
      mistake: 'Reporting numbers without the conditions.',
      why: 'The figures are unreproducible and unverifiable, which makes them useless as evidence.',
      instead: 'Record device, network, CPU throttling, and cache state with every number.',
    },
    {
      id: 'mistake-lab-only',
      mistake: 'Relying only on lab data.',
      why: 'It cannot reveal which interactions real users perform or what devices they have.',
      instead: 'Collect field data, especially for INP.',
    },
    {
      id: 'mistake-averages',
      mistake: 'Reporting averages of field data.',
      why: 'A long tail is invisible in an average, and the tail is where users abandon.',
      instead: 'Report the 75th percentile.',
    },
  ],

  eliteConsiderations: [
    {
      kind: 'list',
      items: [
        'Enforce the budget in the build so regressions fail rather than accumulate.',
        'Measure on a real mid-range device occasionally; emulation approximates but does not replicate.',
        'Change one variable per measurement, always.',
        'Keep the evidence table in the repository so the reasoning survives the person who did the work.',
      ],
    },
  ],

  practicalExercise: {
    id: 'exercise-12-05',
    title: 'Measure a project and record baseline and improved results',
    prompt:
      'Establish a measured baseline, improve it, and produce evidence that would survive scrutiny.',
    steps: [
      'Fix and write down the measurement conditions.',
      'Take five baseline runs and record the median of LCP, CLS, and INP.',
      'Add field measurement with the web-vitals library.',
      'Set a budget per metric and a bundle size ceiling.',
      'Make one change, measure, and record; repeat for at least three changes.',
      'Produce a table of metric, before, after, conditions, and change.',
      'Identify any metric still outside budget and state what would fix it.',
    ],
    successCriteria: [
      'Conditions are recorded alongside every measurement.',
      'Each figure is a median of at least five runs.',
      'Changes were measured individually, not in a batch.',
      'Field measurement is in place, including INP.',
      'An evidence table exists with before, after, and conditions.',
    ],
    estimatedMinutes: 50,
    hint: 'Change one thing, measure, record. Batched changes make it impossible to attribute any result.',
  },

  reflectionQuestion:
    'Why are measurements stronger than assumptions about performance?',
  reflectionHint: 'Humans miss short delays and device differences.',

  resources: [
    {
      id: 'resource-web-vitals',
      title: 'Web Vitals',
      url: 'https://web.dev/articles/vitals',
      type: 'article',
      estimatedMinutes: 25,
      note: 'The three metrics, their thresholds, and the reasoning behind each.',
    },
    {
      id: 'resource-web-vitals-lib',
      title: 'web-vitals library',
      url: 'https://github.com/GoogleChrome/web-vitals',
      type: 'repository',
      estimatedMinutes: 20,
      note: 'Field measurement in a few lines.',
    },
    {
      id: 'resource-performance-budgets',
      title: 'Performance budgets 101',
      url: 'https://web.dev/articles/performance-budgets-101',
      type: 'article',
      estimatedMinutes: 20,
      note: 'Turning performance into a constraint that survives deadlines.',
    },
  ],

  competencyTags: ['product-judgement', 'performance', 'testing'],

  completionCriteria: [
    'Has produced an evidence table with stated conditions.',
    'Each figure is a median of several runs.',
    'Field measurement is in place, including INP.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Project                                                                     */
/* -------------------------------------------------------------------------- */

const PROJECT: ModuleProject = {
  id: 'project-12',
  slug: 'performance-retrofit',
  moduleId: MODULE_ID,
  title: 'Performance Retrofit',
  brief:
    'Take an earlier project, measure it, identify the real bottlenecks, improve them, and document before-and-after evidence.',
  problem:
    'Retrofitting is harder than building fast from the start, and more representative of real work. The constraints already exist, the architecture is settled, and the temptation is to change what is easy rather than what is costly. This project forces the opposite order: measure first, and only then decide what to touch.',
  objectives: [
    'Measure a real project under stated, reproducible conditions.',
    'Identify bottlenecks from evidence rather than from intuition.',
    'Improve each one and verify the improvement individually.',
    'Produce documentation that would convince a sceptical reader.',
  ],
  requirements: [
    'A measured baseline: LCP, CLS, INP, bundle size, worst frame time.',
    'Field measurement in place, including INP.',
    'A written list of bottlenecks ranked by measured cost.',
    'At least four improvements, each measured individually.',
    'A performance budget with the project checked against it.',
    'Before-and-after evidence with conditions recorded.',
  ],
  constraints: [
    'No visual or functional regressions; the product must do the same things.',
    'Every change must be measured on its own.',
    'All measurements use identical, documented conditions.',
    'Improvements must be justified by measured cost, not by assumption.',
  ],
  suggestedScope:
    'One earlier project, one set of conditions, four to six improvements. Do not rewrite the project — the deliverable is measured improvement of what exists.',
  deliverables: [
    'The improved project.',
    'An evidence table: metric, before, after, conditions, change.',
    'A ranked bottleneck list with the measurement that identified each.',
    'A performance budget and the current status against it.',
    'A short note on anything you expected to matter that did not.',
  ],
  completionCriteria: [
    'Every improvement is supported by an individual measurement.',
    'Conditions are recorded and identical across all measurements.',
    'Each figure is a median of at least five runs.',
    'No functional or visual regression was introduced.',
    'At least one assumption was contradicted by measurement and is recorded.',
  ],
  portfolioEvidence: [
    'Performance measurement methodology',
    'Profiling and bottleneck identification',
    'Rendering and asset optimisation',
    'Performance budgeting',
    'Evidence-based documentation',
  ],
  reflectionQuestion:
    'What did you expect to be the bottleneck, and what actually was?',
  estimatedHours: 20,
  competencies: ['critique', 'css', 'javascript', 'browser-apis', 'performance'],
  stretchGoals: [
    'Add a build-time budget check that fails when bundle size or a metric regresses.',
    'Measure on a real mid-range device and compare against the emulated figures.',
  ],
};

/* -------------------------------------------------------------------------- */

export const MODULE_12: CurriculumModule = {
  id: MODULE_ID,
  slug: 'performance-and-browser-rendering',
  moduleNumber: 12,
  phase: 'interaction-and-motion',
  title: 'Performance and Browser Rendering',
  description:
    'The rendering pipeline, what layout and paint cost, how JavaScript blocks the main thread, what assets cost to deliver, and how to measure all of it.',
  outcome: 'Can diagnose and improve performance from evidence rather than intuition.',
  prerequisites: [
    'Modules 1 to 11, or equivalent',
    'An existing project to profile and improve',
  ],
  lessons: [LESSON_56, LESSON_57, LESSON_58, LESSON_59, LESSON_60],
  resources: [
    {
      id: 'resource-module-12-web-dev-performance',
      title: 'Performance',
      url: 'https://web.dev/explore/fast',
      type: 'documentation',
      estimatedMinutes: 180,
      note: 'The reference collection for everything in this module.',
    },
    {
      id: 'resource-module-12-devtools-performance',
      title: 'Chrome DevTools: performance features reference',
      url: 'https://developer.chrome.com/docs/devtools/performance/reference',
      type: 'documentation',
      estimatedMinutes: 45,
      note: 'Reading a profile properly, which is most of the skill.',
    },
    {
      id: 'resource-module-12-vitals',
      title: 'Web Vitals',
      url: 'https://web.dev/articles/vitals',
      type: 'article',
      estimatedMinutes: 25,
      note: 'The metrics and thresholds this module measures against.',
    },
  ],
  project: PROJECT,
  competencies: [
    'typography',
    'responsive-design',
    'critique',
    'product-judgement',
    'html',
    'css',
    'javascript',
    'browser-apis',
    'performance',
    'testing',
    'interaction-engineering',
  ],
  completionCriteria: [
    'All five lessons completed.',
    'Module project marked completed.',
    'Can produce measured evidence of a performance improvement.',
  ],
};
