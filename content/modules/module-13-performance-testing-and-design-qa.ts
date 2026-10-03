/**
 * Module 13 — Performance, Testing and Design QA.
 *
 * Three subjects that look unrelated and are one skill: knowing whether what
 * you built actually works. Each is a form of measurement, and each replaces a
 * belief with evidence. Placed after motion because the rendering pipeline is
 * what explains why transform is cheap and width is not.
 */

import type { CurriculumModule, Lesson, ModuleProject } from '@/types/curriculum';

const MODULE_ID = 'module-13';

/* -------------------------------------------------------------------------- */
/* Lesson 61                                                                   */
/* -------------------------------------------------------------------------- */

const LESSON_1: Lesson = {
  id: 'lesson-how-the-browser-renders-an-interface',
  slug: 'how-the-browser-renders-an-interface',
  moduleId: MODULE_ID,
  lessonNumber: 1,
  title: 'How the Browser Renders an Interface',
  summary:
    'DOM, CSSOM, style, layout, paint, composite. Six stages, and which one your change enters at is the whole of frontend performance.',
  estimatedMinutes: 10,
  objectives: [
    'Name the six stages and what each produces.',
    'Predict which stages a given CSS change will trigger.',
    'Explain layout thrashing in terms of the pipeline.',
    'Use the pipeline to explain why transform and opacity are cheap.',
  ],
  prerequisiteConcepts: [
    'The box model and CSS, Module 3',
    'Transforms and FLIP, Module 12 lesson 58',
    'The DOM, Module 4',
  ],
  prerequisiteLessonIds: [
    'lesson-spatial-continuity',
    'lesson-the-css-box-model',
  ],
  recap: [
    {
      kind: 'paragraph',
      text: 'Module 12 told you to animate `transform` and `opacity` and not `width` or `top`, and promised an explanation. This is it.',
    },
  ],
  priorKnowledge: [
    {
      kind: 'paragraph',
      text: 'You know the browser parses HTML into a DOM and applies CSS to it. You have also measured element positions with `getBoundingClientRect` and been warned that reading after writing is expensive. Those two facts are about to connect.',
    },
  ],
  coreConcept: [
    {
      kind: 'paragraph',
      text: 'The browser turns your code into pixels through six stages, in order.',
    },
    {
      kind: 'list',
      ordered: true,
      items: [
        '**DOM** — HTML parsed into a tree of nodes.',
        '**CSSOM** — stylesheets parsed into a tree of rules.',
        '**Style** — the two combined, producing the computed style of every element.',
        '**Layout** — geometry: the exact size and position of every box. Also called reflow.',
        '**Paint** — each element drawn into layers as pixels.',
        '**Composite** — layers combined and put on screen, often on the GPU.',
      ],
    },
    {
      kind: 'paragraph',
      text: 'The critical property: the stages run in order, and **entering at a stage means every later stage runs too**.',
    },
    {
      kind: 'paragraph',
      text: 'Change something that affects geometry and you pay layout, paint and composite. Change something that only affects appearance and you pay paint and composite. Change something that affects neither and you pay composite alone.',
    },
  ],
  whyDesignersCare: [
    {
      kind: 'paragraph',
      text: 'Because this is the model that lets you predict the cost of a design decision before building it.',
    },
    {
      kind: 'paragraph',
      text: 'A hover that changes `background-color` is cheap. A hover that changes `padding` reflows the element and possibly everything after it. Visually they can look almost identical; in cost they are not comparable.',
    },
    {
      kind: 'paragraph',
      text: 'Knowing which is which means you can get the effect you want at the price you want to pay, rather than discovering the price afterwards from a janky animation.',
    },
  ],
  howItWorks: [
    {
      kind: 'paragraph',
      text: 'Properties sort into three tiers by where they enter the pipeline.',
    },
    {
      kind: 'code',
      language: 'css',
      code: '/* Layout → paint → composite. The expensive tier. */\n/* width, height, padding, margin, border-width,\n   top, left, right, bottom, font-size, line-height,\n   display, position, float, flex-basis, grid-template-* */\n\n/* Paint → composite. Middle tier. */\n/* color, background-color, background-image, border-color,\n   box-shadow, border-radius, outline, visibility */\n\n/* Composite only. The cheap tier. */\n/* transform, opacity, filter (mostly) */',
    },
    {
      kind: 'paragraph',
      text: 'This is why `transform: translateY(8px)` and `top: 8px` look the same and cost differently. The transform happens after layout and paint are already done — the browser moves an existing layer rather than recomputing where everything is.',
    },
    {
      kind: 'paragraph',
      text: 'The layout tier has a second cost that is easy to miss: layout is not local. Changing one element’s width can change the position of every element after it in the flow, so the work scales with the document rather than with your change.',
    },
    {
      kind: 'code',
      language: 'css',
      code: '/* Limits layout and paint to inside this element. */\n.card {\n  contain: layout paint;\n}',
    },
    {
      kind: 'paragraph',
      text: '`contain` tells the browser that nothing inside affects anything outside, so a change within one card cannot force the rest of the page to re-layout. It is one of the few genuinely free performance wins — though only where the containment claim is actually true.',
    },
  ],
  firstPrinciples: [
    {
      kind: 'paragraph',
      text: '**Layout thrashing** is the pipeline run repeatedly in one frame, and it is the most common self-inflicted performance bug.',
    },
    {
      kind: 'paragraph',
      text: 'The browser batches your style changes and performs layout once, at the end of the frame — unless you ask it for a measurement, which forces layout immediately so the answer is correct.',
    },
    {
      kind: 'code',
      language: 'ts',
      code: '/* Thrashing: forces a layout per iteration. */\nfor (const row of rows) {\n  const height = row.offsetHeight;        // READ — forces layout\n  row.style.height = `${height * 2}px`;   // WRITE — invalidates it again\n}\n\n/* Batched: one layout for all the reads, one for all the writes. */\nconst heights = rows.map((row) => row.offsetHeight);   // all READs\nrows.forEach((row, index) => {\n  row.style.height = `${(heights[index] ?? 0) * 2}px`;  // all WRITEs\n});',
    },
    {
      kind: 'paragraph',
      text: 'Forty rows: forty layouts in the first version, two in the second. Identical output. This is exactly the rule Module 12 lesson 58 gave for FLIP — read everything, then write everything — and now you know why it exists.',
    },
    {
      kind: 'callout',
      tone: 'insight',
      body: 'The properties that force layout when read are worth memorising: `offsetTop`, `offsetHeight`, `scrollTop`, `clientWidth`, `getBoundingClientRect`, `getComputedStyle`. Any of them after a write starts the pipeline again.',
    },
  ],
  designPerspective: [
    {
      kind: 'paragraph',
      text: 'The design question is whether a cheaper property gets the same effect.',
    },
    {
      kind: 'paragraph',
      text: 'A card that grows on hover can animate `height` or `transform: scale()`. A button that lifts can animate `top` or `translateY`. A panel that opens can animate `height` or a transform with `overflow: hidden`. In each pair the second is in a cheaper tier and the difference is usually imperceptible.',
    },
    {
      kind: 'paragraph',
      text: 'Occasionally it is not — scaling text makes it blurry mid-animation, and scaling a border makes it thicken. Those are real reasons to pay for layout. "I did not know there was a choice" is not.',
    },
  ],
  engineeringPerspective: [
    {
      kind: 'paragraph',
      text: 'The engineering question is the frame budget.',
    },
    {
      kind: 'paragraph',
      text: 'At 60fps a frame is 16.7ms, and the browser needs part of that for itself — so roughly 10ms of your own work per frame. Style, layout, paint and composite all have to fit, along with any JavaScript.',
    },
    {
      kind: 'paragraph',
      text: 'That is why a single expensive layout during an animation is visible: it does not slow things down slightly, it misses a frame, and a missed frame is perceived as a stutter rather than as slowness.',
    },
  ],
  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'The pipeline is the shared vocabulary for a conversation design and engineering otherwise cannot have.',
    },
    {
      kind: 'paragraph',
      text: '"The animation feels janky" and "that animates a layout property on forty elements" are the same observation in two languages. Once both parties have the pipeline, the discussion becomes which stage the effect needs to enter at — which has answers.',
    },
  ],
  industryExamples: [
    {
      id: 'example-web-dev-rendering-performance',
      source: 'web.dev',
      title: 'The pipeline documented as a performance model',
      observation:
        'web.dev presents rendering performance in terms of the pipeline stages, with guidance on which properties trigger which stage.',
      takeaway:
        'The stage-based model is the standard way the platform itself explains cost. Learning it once transfers to every performance question.',
    },
    {
      id: 'example-devtools-performance-panel',
      source: 'Chrome for Developers',
      title: 'The stages visible in a recording',
      observation:
        'The Chrome Performance panel colour-codes activity by stage — scripting, rendering, painting — in its flame chart.',
      takeaway:
        'The pipeline is not an abstraction. It is the actual structure of what the tool shows you, which makes recordings readable.',
    },
  ],
  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Prove the tiers rather than take them on trust.',
    },
    {
      kind: 'paragraph',
      text: 'Build a page with two hundred cards and animate them three ways, recording each in the Performance panel.',
    },
    {
      kind: 'code',
      language: 'css',
      code: '/* 1. Layout tier. */\n.card.grow-layout {\n  transition: width 300ms ease-out, height 300ms ease-out;\n}\n.card.grow-layout.active { width: 320px; height: 220px; }\n\n/* 2. Paint tier. */\n.card.grow-paint {\n  transition: box-shadow 300ms ease-out, background-color 300ms ease-out;\n}\n.card.grow-paint.active { box-shadow: 0 8px 24px rgb(0 0 0 / 0.2); }\n\n/* 3. Composite tier. */\n.card.grow-composite {\n  transition: transform 300ms ease-out;\n}\n.card.grow-composite.active { transform: scale(1.06); }',
    },
    {
      kind: 'paragraph',
      text: 'Record each. In the flame chart the first shows substantial purple rendering work per frame, the second green painting work, and the third almost nothing — the compositor handles it off the main thread.',
    },
  ],
  commonMistakes: [
    {
      id: 'mistake-13-01-animating-layout',
      mistake: 'Animating width, height, top or left.',
      why: 'Every frame runs layout, paint and composite, and layout can affect elements far beyond the one you changed.',
      instead: 'Animate `transform` and `opacity`. Pay for layout only when the cheaper version is visibly wrong.',
    },
    {
      id: 'mistake-13-01-will-change-everywhere',
      mistake: 'Adding `will-change` to many elements to make things faster.',
      why: 'It promotes each to its own compositor layer, which consumes memory and can make performance worse overall.',
      instead:
        'Use it sparingly, shortly before the animation, and remove it afterwards. Measure rather than assume it helped.',
    },
  ],
  professionalConsideration: [
    {
      kind: 'paragraph',
      text: 'This model is a tool for prediction, not a licence to optimise.',
    },
    {
      kind: 'paragraph',
      text: 'Knowing `height` is expensive does not mean a `height` transition on one accordion is a problem — it almost certainly is not. The value is in predicting where cost will appear so you can design around it cheaply, and in reading a profile when something genuinely stutters. Rewriting working code because a property is in the wrong tier, with no measurement, is the thing the next lesson exists to prevent.',
    },
  ],
  goDeeper: [
    {
      kind: 'paragraph',
      text: 'Everything below was part of the walkthrough above. It is the detail that matters once the core idea has landed, and it is safe to skip on a first pass.',
    },
    {
      kind: 'paragraph',
      text: 'Then do the thrashing experiment: run both loops from the first-principles section over the two hundred cards and compare. The difference is usually an order of magnitude, and it is the same code producing the same result.',
    },
    {
      kind: 'paragraph',
      text: 'Record all three on a cold load and keep the figures. Without a baseline, every later measurement is a number rather than a comparison.',
    },
  ],
  practicalExercise: {
    id: 'exercise-how-the-browser-renders-an-interface',
    title: 'Measure the three tiers',
    prompt:
      'Build a page that demonstrates the cost difference between the three property tiers, with measurements rather than assertions.',
    steps: [
      'Build a page with at least two hundred elements.',
      'Animate them three ways: layout, paint and composite tier.',
      'Record each in the Performance panel and note the time per frame.',
      'Identify which stages appear in each recording.',
      'Run the thrashing and batched loops and compare total time.',
      'Add `contain: layout paint` to the elements and re-measure the layout-tier case.',
      'Add `will-change: transform` to all two hundred and record what happens.',
      'Write a short note on which property you would use for a hover lift, and why.',
    ],
    successCriteria: [
      'Three recordings exist with per-frame figures.',
      'The stages present in each are correctly identified.',
      'The thrashing comparison is measured, with both figures recorded.',
      'The effect of `contain` is measured.',
      'The `will-change` experiment shows its cost, not just its benefit.',
      'The hover-lift conclusion is justified by the measurements.',
    ],
    estimatedMinutes: 85,
    hint: 'Throttle the CPU to 4× slower in the Performance panel before recording. On a fast machine all three tiers fit in budget and the differences are invisible — which is also why performance bugs reach production.',
  },
  reflectionQuestion:
    'Why does changing one element’s width cost more than changing its colour, even though both are one property on one element?',
  reflectionHint:
    'Ask which other elements each change could possibly affect.',
  resources: [
    {
      id: 'resource-web-dev-rendering-performance-13',
      title: 'Rendering performance',
      url: 'https://web.dev/articles/rendering-performance',
      type: 'article',
      author: 'web.dev',
      estimatedMinutes: 35,
      note: 'The pipeline and which properties trigger which stage. The core reading for this lesson.',
    },
    {
      id: 'resource-web-dev-layout-thrashing-13',
      title: 'Avoid large, complex layouts and layout thrashing',
      url: 'https://web.dev/articles/avoid-large-complex-layouts-and-layout-thrashing',
      type: 'article',
      author: 'web.dev',
      estimatedMinutes: 25,
      note: 'The read-write problem in detail, with the list of properties that force layout.',
    },
  ],
  competencyTags: ['performance', 'browser-apis', 'css', 'motion', 'architecture'],
  completionCriteria: [
    'Can name the six stages and what each produces.',
    'Can predict which stages a property change triggers.',
    'Can explain layout thrashing and avoid it.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Lesson 62                                                                   */
/* -------------------------------------------------------------------------- */

const LESSON_2: Lesson = {
  id: 'lesson-frontend-performance-fundamentals',
  slug: 'frontend-performance-fundamentals',
  moduleId: MODULE_ID,
  lessonNumber: 2,
  title: 'Frontend Performance Fundamentals',
  summary:
    'The main thread, what competes for it, and the three numbers that describe whether a page is actually usable — measured on a slow device, not yours.',
  estimatedMinutes: 10,
  objectives: [
    'Explain the main thread and what blocks it.',
    'Account for the real cost of JavaScript, images and fonts.',
    'Interpret the Core Web Vitals and say what each one measures.',
    'Set a performance budget and measure against it.',
  ],
  prerequisiteConcepts: [
    'The rendering pipeline',
    'Async and the event loop, Module 4 lesson 20',
    'Async states, Module 11 lesson 51',
  ],
  prerequisiteLessonIds: ['lesson-how-the-browser-renders-an-interface'],
  recap: [
    {
      kind: 'paragraph',
      text: 'The last lesson covered the cost of changing one element. This one covers the cost of the whole page, and of the JavaScript competing with it.',
    },
  ],
  priorKnowledge: [
    {
      kind: 'paragraph',
      text: 'You know JavaScript is single-threaded and that `await` lets other work proceed while a request is in flight. The consequence you may not have drawn: rendering runs on the same thread as your code, so a long function and a smooth animation are mutually exclusive.',
    },
  ],
  coreConcept: [
    {
      kind: 'paragraph',
      text: 'The **main thread** runs your JavaScript, style, layout and paint. One thread, one thing at a time.',
    },
    {
      kind: 'paragraph',
      text: 'So a 200ms function does not just take 200ms. It blocks every frame, every click and every keystroke for 200ms — twelve dropped frames, and input that arrives late.',
    },
    {
      kind: 'paragraph',
      text: 'A task over 50ms is conventionally a **long task**, and long tasks are what make an interface feel unresponsive regardless of how fast it loaded.',
    },
    {
      kind: 'code',
      language: 'ts',
      code: '/* Blocks everything until done. */\nfunction scoreAll(items: Item[]): Scored[] {\n  return items.map(expensiveScore);\n}\n\n/* Yields between chunks so input and frames get through. */\nasync function scoreAllYielding(items: Item[]): Promise<Scored[]> {\n  const out: Scored[] = [];\n\n  for (let i = 0; i < items.length; i += 50) {\n    for (const item of items.slice(i, i + 50)) out.push(expensiveScore(item));\n    /* Hand the thread back. */\n    await new Promise((resolve) => setTimeout(resolve, 0));\n  }\n\n  return out;\n}',
    },
    {
      kind: 'paragraph',
      text: 'The second takes slightly longer in total and keeps the interface responsive throughout. For anything genuinely heavy a Web Worker is better — it runs on its own thread entirely — at the cost of not being able to touch the DOM.',
    },
  ],
  whyDesignersCare: [
    {
      kind: 'paragraph',
      text: 'Because the cost of a design decision is usually paid in assets, and assets are chosen by designers.',
    },
    {
      kind: 'list',
      items: [
        'A hero image at 3000px wide where 800px is displayed: several hundred kilobytes for nothing.',
        'Four font weights where two would do: two extra requests, and text that cannot render until they arrive.',
        'An icon library imported whole for six icons.',
        'An animation library for one fade.',
      ],
    },
    {
      kind: 'paragraph',
      text: 'None of those is a coding mistake. Each is a design or dependency decision with a weight, and the weight is paid by every visitor on every visit.',
    },
  ],
  howItWorks: [
    {
      kind: 'paragraph',
      text: 'JavaScript is the most expensive thing you ship, because it costs three times.',
    },
    {
      kind: 'list',
      ordered: true,
      items: [
        '**Download** — bytes over the network, which is the part people measure.',
        '**Parse and compile** — turning the text into something executable, on the main thread.',
        '**Execute** — actually running it, also on the main thread.',
      ],
    },
    {
      kind: 'paragraph',
      text: 'An image of 300KB is decoded off the main thread and often lazily. 300KB of JavaScript must be parsed and executed before anything it controls works. They are not comparable despite the equal size, which is why bundle size is the number worth watching.',
    },
    {
      kind: 'paragraph',
      text: 'Images and fonts have cheaper fixes, and they are mostly markup.',
    },
    {
      kind: 'code',
      language: 'html',
      code: '<!-- Let the browser pick a size for the actual slot and device. -->\n<img\n  src="/hero-800.webp"\n  srcset="/hero-400.webp 400w, /hero-800.webp 800w, /hero-1600.webp 1600w"\n  sizes="(max-width: 600px) 100vw, 800px"\n  width="800"\n  height="450"\n  alt="" />\n\n<!-- Below the fold: do not fetch until it is needed. -->\n<img src="/chart.webp" loading="lazy" decoding="async" width="600" height="400" alt="Revenue by quarter" />',
    },
    {
      kind: 'paragraph',
      text: '`width` and `height` are the important attributes and the most often omitted. Without them the browser does not know the image’s aspect ratio, so the page re-layouts when it loads — which is content shifting under the reader, and a Core Web Vitals failure.',
    },
    {
      kind: 'code',
      language: 'css',
      code: '@font-face {\n  font-family: \'Inter\';\n  src: url(\'/fonts/inter-var.woff2\') format(\'woff2-variations\');\n  /* Show fallback text immediately, swap when the font arrives. */\n  font-display: swap;\n  font-weight: 100 900;\n}',
    },
    {
      kind: 'paragraph',
      text: 'Without `font-display`, text is invisible while the font loads — content the user has waited for, deliberately hidden. A variable font covering the whole weight range in one file removes the rest of the problem.',
    },
  ],
  firstPrinciples: [
    {
      kind: 'paragraph',
      text: 'The **Core Web Vitals** are three numbers, each answering a different question a user would actually ask.',
    },
    {
      kind: 'list',
      items: [
        '**LCP** — Largest Contentful Paint. When did the main content appear? "Has it loaded?" Good is under 2.5s.',
        '**INP** — Interaction to Next Paint. How long between a tap and a visible response? "Is it responding?" Good is under 200ms.',
        '**CLS** — Cumulative Layout Shift. How much did things move after appearing? "Did it move while I was reading?" Good is under 0.1.',
      ],
    },
    {
      kind: 'paragraph',
      text: 'Each maps onto something in this course. LCP is affected by asset weight. INP is the long-task problem from this lesson. CLS is the missing image dimensions, and the layout-tier animations from lesson 61.',
    },
    {
      kind: 'callout',
      tone: 'pitfall',
      body: 'All three must be measured on a slow device over a slow network. Your laptop on office wifi reports numbers no user will experience, and a page that is fine there can be unusable on a mid-range phone.',
    },
  ],
  designPerspective: [
    {
      kind: 'paragraph',
      text: 'The design question is what has to be visible first.',
    },
    {
      kind: 'paragraph',
      text: 'LCP is about the largest contentful element, so the design decides what that is. A page whose hero is a 2MB image has chosen a slow LCP; a page whose first content is text has chosen a fast one. That is a composition decision with a performance consequence, made before any code exists.',
    },
  ],
  engineeringPerspective: [
    {
      kind: 'paragraph',
      text: 'The engineering question is what the budget is.',
    },
    {
      kind: 'code',
      language: 'json',
      code: '{\n  "budgets": {\n    "javascript": "170KB compressed",\n    "css": "60KB compressed",\n    "images-per-page": "500KB",\n    "fonts": "100KB",\n    "lcp": "2.5s on a mid-range phone over 4G",\n    "inp": "200ms",\n    "cls": "0.1"\n  }\n}',
    },
    {
      kind: 'paragraph',
      text: 'A budget turns performance from an opinion into a check. "Is this library worth it?" is unanswerable; "this library is 40KB and we have 20KB left" has an answer, and sometimes the answer is to remove something else.',
    },
    {
      kind: 'paragraph',
      text: 'Without a budget, every individual addition is defensible and the total is not.',
    },
  ],
  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'Performance is a design constraint that happens to be measurable.',
    },
    {
      kind: 'paragraph',
      text: 'Nobody argues about whether the contrast ratio is high enough once it has been measured. A budget does the same for weight: it converts "this feels heavy" into a number both parties can check, which is the only version of the conversation that converges.',
    },
  ],
  industryExamples: [
    {
      id: 'example-web-vitals-thresholds',
      source: 'web.dev',
      title: 'Three metrics with published thresholds',
      observation:
        'web.dev defines Core Web Vitals with explicit good and poor thresholds, assessed at the 75th percentile of real users.',
      takeaway:
        'The 75th percentile is the important detail. Optimising the median leaves a quarter of users with an experience nobody measured.',
    },
    {
      id: 'example-performance-budgets',
      source: 'web.dev',
      title: 'Budgets as a team mechanism',
      observation:
        'Performance budgets are presented as agreed limits checked automatically, rather than as targets to aim at.',
      takeaway:
        'The automation is the point. A budget nobody checks is a preference, and preferences lose to features.',
    },
  ],
  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Measure your Module 11 dashboard honestly, then fix the largest thing.',
    },
    {
      kind: 'list',
      ordered: true,
      items: [
        'Run Lighthouse on a production build, with mobile emulation and throttling on.',
        'Record the three vitals and the total bundle size.',
        'Open the Performance panel, throttle the CPU 4×, and reload. Find every long task.',
        'In the Network panel, sort by size and list the five largest resources.',
        'Interact with the page while recording and check INP against the 200ms threshold.',
        'Pick the single largest problem and fix only that.',
        'Re-measure and record the change.',
      ],
    },
    {
      kind: 'paragraph',
      text: 'Step six is the discipline. The temptation is to fix everything at once, after which you cannot attribute the improvement to anything and have no idea which changes were worth keeping.',
    },
  ],
  commonMistakes: [
    {
      id: 'mistake-13-02-measuring-on-your-machine',
      mistake: 'Measuring performance on a development machine without throttling.',
      why: 'A fast laptop hides every problem users have, so the page is declared fine and is not.',
      instead: 'Throttle CPU and network, or measure on a real mid-range phone. Treat unthrottled numbers as meaningless.',
    },
    {
      id: 'mistake-13-02-no-image-dimensions',
      mistake: 'Omitting `width` and `height` on images.',
      why: 'The browser cannot reserve space, so the page re-layouts on load and content moves under the reader.',
      instead: 'Always set both. It costs nothing and removes a whole category of layout shift.',
    },
  ],
  professionalConsideration: [
    {
      kind: 'paragraph',
      text: 'Performance work is where "do not optimise without evidence" matters most, because the intuitions are reliably wrong.',
    },
    {
      kind: 'paragraph',
      text: 'The slow thing is rarely the clever algorithm; it is usually a 2MB image, a library imported whole, or a font blocking text. Those are found by measuring and fixed in an afternoon, while a week of micro-optimising a render function moves nothing. Measure first, fix the largest item, measure again — and stop when you are inside budget rather than when you run out of ideas.',
    },
  ],
  goDeeper: [
    {
      kind: 'paragraph',
      text: 'Everything below was part of the walkthrough above. It is the detail that matters once the core idea has landed, and it is safe to skip on a first pass.',
    },
    {
      kind: 'code',
      language: 'ts',
      code: '/* Report the real figures from real sessions, not just lab numbers. */\nimport { onCLS, onINP, onLCP } from \'web-vitals\';\n\nfunction report(metric: { name: string; value: number; rating: string }) {\n  /* In development, read them; in production, send them somewhere. */\n  console.info(`${metric.name} ${Math.round(metric.value)} (${metric.rating})`);\n}\n\nonLCP(report);\nonINP(report);\nonCLS(report);',
    },
    {
      kind: 'paragraph',
      text: 'Lab measurements tell you whether a change helped. Field measurements tell you whether users are having a good time, and the two frequently disagree — usually because real devices are slower and real networks are worse than anything you emulated.',
    },
  ],
  practicalExercise: {
    id: 'exercise-frontend-performance-fundamentals',
    title: 'Measure and improve one real page',
    prompt:
      'Measure a page you built under realistic conditions, set a budget, and fix problems one at a time with evidence for each.',
    steps: [
      'Write a performance budget before measuring anything.',
      'Run Lighthouse on a production build with mobile throttling, and record all three vitals.',
      'Find every long task with the CPU throttled 4×.',
      'List the five largest resources.',
      'Fix the single largest problem and re-measure.',
      'Repeat for the next two, recording each figure before and after.',
      'Add image dimensions and `font-display` wherever they are missing.',
      'Add field measurement with the web-vitals library and compare to your lab numbers.',
    ],
    successCriteria: [
      'A budget exists and was written before measuring.',
      'All three vitals recorded under throttled conditions.',
      'Three fixes made, each with before and after figures.',
      'No image lacks explicit dimensions.',
      'Field and lab measurements are compared, and the difference explained.',
      'The page is inside budget, or the gap is documented with a reason.',
    ],
    estimatedMinutes: 95,
    hint: 'Borrow a cheap Android phone if you can. The gap between a throttled laptop and a real mid-range device is still large, and it is where the uncomfortable findings are.',
  },
  reflectionQuestion:
    'Why is 300KB of JavaScript more expensive than 300KB of images?',
  reflectionHint:
    'Count how many times each one is paid for, and on which thread.',
  resources: [
    {
      id: 'resource-web-dev-vitals-13',
      title: 'Web Vitals',
      url: 'https://web.dev/articles/vitals',
      type: 'article',
      author: 'web.dev',
      estimatedMinutes: 30,
      note: 'The three metrics, their thresholds, and what each one represents to a user.',
    },
    {
      id: 'resource-web-dev-long-tasks-13',
      title: 'Optimize long tasks',
      url: 'https://web.dev/articles/optimize-long-tasks',
      type: 'article',
      author: 'web.dev',
      estimatedMinutes: 30,
      note: 'Breaking up main-thread work, including yielding strategies. The INP half of this lesson.',
    },
  ],
  competencyTags: ['performance', 'browser-apis', 'architecture', 'design-qa', 'product-judgement'],
  completionCriteria: [
    'Measures under throttled, realistic conditions.',
    'Can explain the three vitals and what affects each.',
    'Fixes one thing at a time with evidence.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Lesson 63                                                                   */
/* -------------------------------------------------------------------------- */

const LESSON_3: Lesson = {
  id: 'lesson-testing-important-product-behaviour',
  slug: 'testing-important-product-behaviour',
  moduleId: MODULE_ID,
  lessonNumber: 3,
  title: 'Testing Important Product Behaviour',
  summary:
    'Not how to write tests — how to decide which tests are worth having. Most test suites are large, slow and test the wrong things.',
  estimatedMinutes: 10,
  objectives: [
    'Decide what deserves a test and what does not.',
    'Choose the right level: unit, integration or end-to-end.',
    'Write interaction tests that survive a refactor.',
    'Add accessibility assertions that catch real regressions.',
  ],
  prerequisiteConcepts: [
    'Component architecture, Module 8',
    'Accessibility roles and names, Module 9 lesson 44',
    'Async states, Module 11',
  ],
  prerequisiteLessonIds: [
    'lesson-frontend-performance-fundamentals',
    'lesson-the-accessibility-tree-and-aria',
  ],
  recap: [
    {
      kind: 'paragraph',
      text: 'You have built components with documented states and behaviour specifications. Those specifications are what a test suite should be asserting, and mostly is not.',
    },
  ],
  priorKnowledge: [
    {
      kind: 'paragraph',
      text: 'Module 5 lesson 25 had you write a behaviour specification before coding — states, triggers, transitions, edge cases. Module 9 gave you role, name and state for every control. Both are test plans that were not called test plans.',
    },
  ],
  coreConcept: [
    {
      kind: 'paragraph',
      text: 'A test is worth having when it would **fail if something important broke** and **pass through a refactor that changed nothing important**.',
    },
    {
      kind: 'paragraph',
      text: 'Both halves are required. A test that never fails is dead weight; a test that fails whenever you rename a variable is worse than nothing, because people learn to ignore the suite.',
    },
    {
      kind: 'list',
      items: [
        '**Test** — the behaviour the product promises. Submitting a valid form saves. An invalid field reports why. A failed save does not lose the draft.',
        '**Do not test** — that a button has class `btn-primary`. That a component calls a particular internal function. That a snapshot matches last week’s markup.',
      ],
    },
    {
      kind: 'paragraph',
      text: 'The dividing line is whether a user would notice. If the test asserts something no user could observe, it is testing your implementation rather than your product.',
    },
  ],
  whyDesignersCare: [
    {
      kind: 'paragraph',
      text: 'Because tests are the only mechanism that stops designed behaviour from quietly disappearing.',
    },
    {
      kind: 'paragraph',
      text: 'You spent Module 11 designing seven async states. Six months later someone refactors the list and the stale-data case silently stops working. Nobody notices, because nobody tests the unhappy paths by hand.',
    },
    {
      kind: 'paragraph',
      text: 'A test that asserts "a failed refetch keeps the previous rows visible" is a design decision made permanent. Without it the decision lasts as long as the person who remembers it.',
    },
  ],
  howItWorks: [
    {
      kind: 'paragraph',
      text: 'Three levels, each right for a different kind of claim.',
    },
    {
      kind: 'list',
      items: [
        '**Unit** — one function, no DOM. Right for logic with many cases: validation, formatting, the `setFilter` rules from Module 11.',
        '**Integration** — a component tree with real DOM, in a test renderer. Right for behaviour: a user types, something happens. This is where most of the value is.',
        '**End-to-end** — a real browser, a real server. Right for a handful of critical journeys. Slow and flaky, so keep the count small.',
      ],
    },
    {
      kind: 'paragraph',
      text: 'The usual mistake is too many unit tests on trivial functions and no integration tests on the flows that matter.',
    },
    {
      kind: 'code',
      language: 'ts',
      code: '/* Unit: pure logic, many cases, fast. */\ndescribe(\'setFilter\', () => {\n  it(\'returns to the first page when the text changes\', () => {\n    const query = { ...base, page: 4 };\n    expect(setFilter(query, { text: \'design\' }).page).toBe(1);\n  });\n\n  it(\'keeps the page when only the page changes\', () => {\n    const query = { ...base, page: 4 };\n    expect(setFilter(query, { page: 5 }).page).toBe(5);\n  });\n});',
    },
    {
      kind: 'code',
      language: 'tsx',
      code: '/* Integration: the behaviour a user would notice. */\nit(\'keeps the previous rows visible when a refetch fails\', async () => {\n  const user = userEvent.setup();\n  server.use(successOnce(projects), failAfterwards());\n\n  render(<ProjectList />);\n  expect(await screen.findByText(\'Marketing site\')).toBeVisible();\n\n  await user.click(screen.getByRole(\'button\', { name: /refresh/i }));\n\n  /* The warning appears … */\n  expect(await screen.findByText(/could not refresh/i)).toBeVisible();\n  /* … and the data the user was reading is still there. */\n  expect(screen.getByText(\'Marketing site\')).toBeVisible();\n});',
    },
    {
      kind: 'paragraph',
      text: 'Note how the second test is written. It finds elements by **role and visible text**, never by class or test id, so it would survive the component being rewritten and would fail if the behaviour changed.',
    },
    {
      kind: 'paragraph',
      text: 'It also reads as the designed requirement. Someone who has never seen the code can tell what the product is supposed to do.',
    },
  ],
  firstPrinciples: [
    {
      kind: 'paragraph',
      text: 'Querying by role is the technique that makes tests double as accessibility checks.',
    },
    {
      kind: 'code',
      language: 'tsx',
      code: '/* Fails if the button loses its accessible name — which is a real bug. */\nscreen.getByRole(\'button\', { name: /delete project/i });\n\n/* Passes even if the control is announced as nothing at all. */\nscreen.getByTestId(\'delete-btn\');',
    },
    {
      kind: 'paragraph',
      text: 'The first can only find the element if it has the right role and an accessible name — exactly the Module 9 lesson 44 requirement. So a suite written this way asserts accessibility throughout without a single dedicated accessibility test.',
    },
    {
      kind: 'callout',
      tone: 'insight',
      body: 'This is the strongest argument for role-based queries, and it is not primarily about testing. It means an icon button that loses its label breaks the build rather than reaching a user.',
    },
  ],
  designPerspective: [
    {
      kind: 'paragraph',
      text: 'The design question is which behaviour is worth protecting.',
    },
    {
      kind: 'paragraph',
      text: 'Go through the Module 5 behaviour maps and the Module 10 patterns and mark every edge case somebody thought about. Those are the tests. The destructive-action pattern alone yields four — already deleted, permission lost, offline, and the ordinary confirm — and all four are cases a careless refactor would break silently.',
    },
  ],
  engineeringPerspective: [
    {
      kind: 'paragraph',
      text: 'The engineering question is whether the test can fail for the wrong reason.',
    },
    {
      kind: 'paragraph',
      text: 'A flaky test is worse than a missing one: it trains the team to re-run the suite instead of reading it. The usual causes are real timers, fixed waits, and shared state between tests. Waiting for a condition rather than a duration fixes most of it.',
    },
    {
      kind: 'paragraph',
      text: 'And a test is only meaningful if you have seen it fail. Breaking the behaviour on purpose and confirming the test catches it takes ten seconds and is the only proof the assertion works.',
    },
  ],
  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'A good test file reads as a specification, which closes the loop this course opened in Module 5.',
    },
    {
      kind: 'paragraph',
      text: '"Keeps the previous rows visible when a refetch fails" is a design decision, a test name and a product requirement in one sentence. Written that way, the suite becomes the document of what the product promises — and unlike a document, it cannot go out of date without failing.',
    },
  ],
  industryExamples: [
    {
      id: 'example-testing-library-principles',
      source: 'Testing Library',
      title: 'Resemble the way users interact',
      observation:
        'Testing Library’s guiding principle is that tests should resemble how software is used, and it ranks queries with role-based ones first and test ids last.',
      takeaway:
        'The query priority is the whole philosophy encoded as an API. Following it produces accessible markup as a side effect.',
    },
    {
      id: 'example-axe-core-automated',
      source: 'Deque',
      title: 'Automated checks as a floor, not a ceiling',
      observation:
        'axe-core detects a substantial set of accessibility violations automatically and documents what it cannot detect.',
      takeaway:
        'Honest tooling states its limits. Passing an automated audit means the mechanical problems are gone, not that the interface is usable.',
    },
  ],
  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Write the four tests that matter for the destructive-action pattern.',
    },
    {
      kind: 'code',
      language: 'tsx',
      code: 'describe(\'deleting a project\', () => {\n  it(\'requires confirmation and names what will be deleted\', async () => {\n    const user = userEvent.setup();\n    render(<ProjectRow project={marketingSite} />);\n\n    await user.click(screen.getByRole(\'button\', { name: /delete/i }));\n\n    const dialog = screen.getByRole(\'dialog\', { name: /delete marketing site/i });\n    expect(dialog).toBeVisible();\n    expect(within(dialog).getByText(/cannot be undone/i)).toBeVisible();\n  });\n\n  it(\'returns focus to the trigger when cancelled\', async () => {\n    const user = userEvent.setup();\n    render(<ProjectRow project={marketingSite} />);\n\n    const trigger = screen.getByRole(\'button\', { name: /delete/i });\n    await user.click(trigger);\n    await user.keyboard(\'{Escape}\');\n\n    expect(trigger).toHaveFocus();\n  });\n\n  it(\'explains and refreshes when the project is already gone\', async () => {\n    const user = userEvent.setup();\n    server.use(respondWith(404));\n    render(<ProjectRow project={marketingSite} />);\n\n    await user.click(screen.getByRole(\'button\', { name: /delete/i }));\n    await user.click(screen.getByRole(\'button\', { name: /^delete$/i }));\n\n    expect(await screen.findByText(/already been deleted/i)).toBeVisible();\n    expect(screen.queryByRole(\'dialog\')).not.toBeInTheDocument();\n  });\n\n  it(\'keeps the dialog open and says nothing was attempted when offline\', async () => {\n    const user = userEvent.setup();\n    server.use(networkError());\n    render(<ProjectRow project={marketingSite} />);\n\n    await user.click(screen.getByRole(\'button\', { name: /delete/i }));\n    await user.click(screen.getByRole(\'button\', { name: /^delete$/i }));\n\n    expect(await screen.findByText(/not attempted/i)).toBeVisible();\n    expect(screen.getByRole(\'dialog\')).toBeVisible();\n  });\n});',
    },
    {
      kind: 'paragraph',
      text: 'Four tests, each naming a decision from the Module 10 pattern. Every query is by role and accessible name, so each one also asserts the dialog is announced correctly and the buttons are labelled.',
    },
  ],
  commonMistakes: [
    {
      id: 'mistake-13-03-testing-implementation',
      mistake: 'Asserting on class names, internal calls or snapshots.',
      why: 'The tests fail on every refactor and pass when behaviour breaks, so the suite becomes noise people route around.',
      instead: 'Assert what a user would observe, queried by role and visible text.',
    },
    {
      id: 'mistake-13-03-never-seen-it-fail',
      mistake: 'Writing a test and never checking that it can fail.',
      why: 'A test asserting nothing passes forever and provides false confidence, which is worse than no confidence.',
      instead: 'Break the behaviour deliberately, watch the test fail, then fix it. Ten seconds, every time.',
    },
  ],
  professionalConsideration: [
    {
      kind: 'paragraph',
      text: 'Coverage percentage is the most misleading number in software quality.',
    },
    {
      kind: 'paragraph',
      text: '90% coverage from tests that assert nothing meaningful is worse than 40% from tests covering the flows that would cost you if they broke. The useful question is not "what percentage is covered" but "which failures would reach a user", and that list comes from the behaviour maps and patterns you already wrote — not from a coverage report.',
    },
  ],
  goDeeper: [
    {
      kind: 'paragraph',
      text: 'Everything below was part of the walkthrough above. It is the detail that matters once the core idea has landed, and it is safe to skip on a first pass.',
    },
    {
      kind: 'paragraph',
      text: 'The second test is the one most suites lack: focus restoration from Module 9 lesson 42, now protected. It is also the one most likely to break in a refactor, which is precisely why it is worth having.',
    },
    {
      kind: 'paragraph',
      text: 'Note `/^delete$/i` for the confirm button. Without the anchors it would also match "Delete project", and the test would click the wrong control — a real hazard of text-based queries worth knowing early.',
    },
    {
      kind: 'paragraph',
      text: 'Add an automated audit on top for the machine-detectable third from Module 9 lesson 44.',
    },
    {
      kind: 'code',
      language: 'tsx',
      code: 'it(\'has no automatically detectable accessibility violations\', async () => {\n  const { container } = render(<SignupForm />);\n  expect(await axe(container)).toHaveNoViolations();\n});',
    },
  ],
  practicalExercise: {
    id: 'exercise-testing-important-product-behaviour',
    title: 'Test what deserves testing',
    prompt:
      'Write a small, high-value test suite for one real flow, chosen from your own behaviour specifications rather than from a coverage report.',
    steps: [
      'List every behaviour the flow promises, including edge cases, from your Module 5 and 10 documents.',
      'Mark each as unit, integration or end-to-end, and justify the level.',
      'Write unit tests for the logic with many cases.',
      'Write integration tests for every promised behaviour, querying by role and visible text.',
      'Write at most two end-to-end tests for the critical journey.',
      'Add an automated accessibility assertion to each rendered component.',
      'Break each behaviour deliberately and confirm the matching test fails.',
      'Delete any test that did not fail when you broke something.',
    ],
    successCriteria: [
      'Every test traces to a documented behaviour.',
      'No assertion on class names, internals or snapshots.',
      'All queries are by role or visible text.',
      'Each test has been seen to fail for the right reason.',
      'Automated accessibility checks are included.',
      'At least one test was deleted for being unable to fail.',
    ],
    estimatedMinutes: 100,
    hint: 'The deliberate-breakage pass usually finds one or two tests that pass no matter what you do. Those are the most valuable findings in the exercise.',
  },
  reflectionQuestion:
    'Why does querying by role make a test suite assert accessibility without any accessibility tests?',
  reflectionHint:
    'Ask what has to be true of the markup for the query to find anything at all.',
  resources: [
    {
      id: 'resource-testing-library-principles-13',
      title: 'Guiding Principles — Testing Library',
      url: 'https://testing-library.com/docs/guiding-principles/',
      type: 'documentation',
      author: 'Testing Library',
      estimatedMinutes: 15,
      note: 'Short, and it is the idea the whole library follows. Read the query priority page beside it.',
    },
    {
      id: 'resource-testing-library-queries-13',
      title: 'About Queries — Testing Library',
      url: 'https://testing-library.com/docs/queries/about/',
      type: 'documentation',
      author: 'Testing Library',
      estimatedMinutes: 25,
      note: 'The query priority list, from role down to test id. Treat the order as guidance rather than preference.',
    },
  ],
  competencyTags: ['testing', 'accessibility', 'architecture', 'design-qa', 'product-judgement'],
  completionCriteria: [
    'Can decide what deserves a test and at which level.',
    'Queries by role and visible text rather than implementation.',
    'Has seen every test fail for the right reason.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Lesson 64                                                                   */
/* -------------------------------------------------------------------------- */

const LESSON_4: Lesson = {
  id: 'lesson-design-qa',
  slug: 'design-qa',
  moduleId: MODULE_ID,
  lessonNumber: 4,
  title: 'Design QA',
  summary:
    'The review that catches what tests cannot: spacing that drifted, a state nobody built, a breakpoint nobody checked, and the gap between what was designed and what shipped.',
  estimatedMinutes: 10,
  objectives: [
    'Run a structured visual, responsive, interaction and accessibility review.',
    'Measure implementation drift against the design rather than describing it.',
    'Write findings a developer can act on without a conversation.',
    'Decide which drift matters and which does not.',
  ],
  prerequisiteConcepts: [
    'Tokens and foundations, Module 10',
    'Component states, Module 8 lesson 38',
    'Accessibility verification, Module 9',
  ],
  prerequisiteLessonIds: [
    'lesson-testing-important-product-behaviour',
    'lesson-components-across-figma-and-code',
  ],
  recap: [
    {
      kind: 'paragraph',
      text: 'Tests protect behaviour. They say nothing about whether the spacing is right, whether the empty state was built, or whether it works at 320px.',
    },
  ],
  priorKnowledge: [
    {
      kind: 'paragraph',
      text: 'Module 10 lesson 48 had you build a mapping table between Figma and code, and noted that parity is maintained by a habit. Design QA is that habit, done as a structured pass rather than a glance.',
    },
  ],
  coreConcept: [
    {
      kind: 'paragraph',
      text: 'Design QA has four passes, run in order, each producing written findings.',
    },
    {
      kind: 'list',
      ordered: true,
      items: [
        '**Visual** — spacing, type, colour, alignment, radius, elevation, against the tokens.',
        '**Responsive** — every breakpoint, plus the awkward widths between them.',
        '**Interaction** — every state of every control: rest, hover, focus, active, disabled, loading, error.',
        '**Accessibility** — keyboard, screen reader, contrast, reduced motion.',
      ],
    },
    {
      kind: 'paragraph',
      text: 'In order, because a visual problem found at 320px might be a responsive problem, and a missing focus style is both an interaction and an accessibility finding. Running them separately keeps each finding attributable.',
    },
    {
      kind: 'paragraph',
      text: 'The output is a list, not an impression. "The spacing feels off" cannot be acted on; "card padding is 20px, token is 16px (`--space-4`)" can be fixed in thirty seconds.',
    },
  ],
  whyDesignersCare: [
    {
      kind: 'paragraph',
      text: 'Because this is the pass that decides whether the design you made is the product people use.',
    },
    {
      kind: 'paragraph',
      text: 'Implementation drift is never one large error. It is 20px where the token says 16px, a slightly different grey, a missing hover, a loading state that was skipped because it was in a separate frame. Individually trivial, collectively the reason a shipped product looks less considered than its design.',
    },
    {
      kind: 'paragraph',
      text: 'Nobody is at fault for any single instance, which is exactly why it needs a scheduled pass rather than good intentions.',
    },
  ],
  howItWorks: [
    {
      kind: 'paragraph',
      text: 'The visual pass is measurement, not judgement, and the browser will tell you the numbers.',
    },
    {
      kind: 'code',
      language: 'javascript',
      code: '// Paste into the console: every spacing value in use that is not a token.\nconst scale = new Set([\'0px\', \'4px\', \'8px\', \'12px\', \'16px\', \'24px\', \'32px\', \'48px\']);\n\nconst offScale = [...document.querySelectorAll(\'*\')]\n  .flatMap((element) => {\n    const style = getComputedStyle(element);\n    return [\'paddingTop\', \'paddingLeft\', \'marginTop\', \'gap\']\n      .map((property) => ({ element, property, value: style[property] }))\n      .filter(({ value }) => value !== \'\' && value !== \'normal\' && scale.has(value) === false);\n  })\n  .slice(0, 50);\n\nconsole.table(offScale.map(({ element, property, value }) => ({\n  selector: element.className || element.tagName,\n  property,\n  value,\n})));',
    },
    {
      kind: 'paragraph',
      text: 'Run it on a page you believe is clean. The output is usually longer than expected, and most of the length is legitimate — which is itself worth knowing before you trust the tool.',
    },
    {
      kind: 'paragraph',
      text: 'Two honest limitations. It reports computed values, so a percentage or a `clamp()` resolves to a pixel figure that was never meant to be on the scale — expect false positives. And browser defaults on unstyled elements will appear. It is a list to review, not a defect report.',
    },
    {
      kind: 'paragraph',
      text: 'The responsive pass needs the widths between breakpoints, not just the breakpoints.',
    },
    {
      kind: 'list',
      items: [
        '320px — the narrowest you should support. Everything must work.',
        '375px and 390px — common phone widths.',
        '640px, 768px, 1024px — around your breakpoints.',
        'One pixel either side of every breakpoint — where layouts actually break.',
        '1440px and wider — where a max-width is either present or conspicuously absent.',
      ],
    },
    {
      kind: 'paragraph',
      text: 'Also test at 200% browser zoom, which reflows like a narrow viewport and is a WCAG requirement rather than an edge case.',
    },
  ],
  firstPrinciples: [
    {
      kind: 'paragraph',
      text: 'The interaction pass is a matrix, and building it is what makes it exhaustive.',
    },
    {
      kind: 'code',
      language: 'markdown',
      code: '| Control | Rest | Hover | Focus | Active | Disabled | Loading | Error |\n| --- | --- | --- | --- | --- | --- | --- | --- |\n| Button primary | ✓ | ✓ | ✓ | ✗ no pressed state | ✓ | ✓ | n/a |\n| Button danger | ✓ | ✓ | ✓ | ✗ | ✓ | ✗ not built | n/a |\n| Input | ✓ | ✓ | ✓ | n/a | ✓ | n/a | ✓ |\n| Select | ✓ | ✓ | ✗ ring clipped | n/a | ✓ | ✗ | ✓ |\n| Checkbox | ✓ | ✓ | ✓ | ✗ | ✓ | n/a | ✗ no error style |\n| Row menu | ✓ | ✓ | ✗ pointer only | n/a | n/a | n/a | n/a |',
    },
    {
      kind: 'paragraph',
      text: 'Six controls, and the grid immediately shows the pattern: pressed states are missing almost everywhere, and two focus states are broken. Neither would be found by clicking around.',
    },
    {
      kind: 'callout',
      tone: 'insight',
      body: 'The matrix is the deliverable. A product with every cell filled is finished in a way that a product reviewed by using it never is, because using it exercises only the states you happen to hit.',
    },
  ],
  designPerspective: [
    {
      kind: 'paragraph',
      text: 'The design question is which drift matters.',
    },
    {
      kind: 'paragraph',
      text: 'A 2px padding difference on one card: probably not. A 2px difference on a component used four hundred times: yes, because it accumulates into visibly uneven rhythm. A slightly wrong grey on a border: no. A slightly wrong grey that drops contrast below 4.5:1: absolutely, and it is now an accessibility defect rather than a visual one.',
    },
    {
      kind: 'paragraph',
      text: 'Reporting everything with equal weight is how a QA list gets ignored. Severity has to be part of the finding.',
    },
  ],
  engineeringPerspective: [
    {
      kind: 'paragraph',
      text: 'The engineering question is how a finding stops recurring.',
    },
    {
      kind: 'paragraph',
      text: 'A one-off fix returns. The durable versions are structural: a lint rule rejecting hard-coded colours, a token so the value cannot be typed by hand, a test asserting the focus style exists, or a line in the Module 10 contribution checklist. Each found defect should raise the question of which of those would have prevented it.',
    },
  ],
  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'Design QA is where the Module 10 system proves whether it works.',
    },
    {
      kind: 'paragraph',
      text: 'A product built from tokens has almost no visual drift to find, because there was nothing to drift from — the value came from one place. A product with a token file that components ignore produces a long QA list every release. The length of the list is a measurement of the system, not of the developers.',
    },
  ],
  industryExamples: [
    {
      id: 'example-wcag-quickref-qa',
      source: 'W3C WAI',
      title: 'A filterable list of checkable criteria',
      observation:
        'The WCAG quick reference lists success criteria filterable by level, each with techniques for meeting it.',
      takeaway:
        'Accessibility QA has a published checklist, so there is no need to invent one. Filter to the criteria your product can actually violate.',
    },
    {
      id: 'example-devtools-css-overview',
      source: 'Chrome for Developers',
      title: 'Every colour and font in use, listed',
      observation:
        'The CSS Overview panel reports all colours, fonts and contrast issues found across a page.',
      takeaway:
        'A fast way to find drift: a product with a token system should show a short, closed list of colours. A long one is the finding.',
    },
  ],
  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Run all four passes on your Module 11 dashboard and write findings in one format.',
    },
    {
      kind: 'code',
      language: 'markdown',
      code: '### DQA-01 · Card padding off-scale · Visual · Low\n**Where** `ProjectCard`, all instances\n**Found** `padding: 20px`\n**Expected** `var(--space-4)` (16px)\n**Why it matters** 20px is not on the scale; the card sits unevenly beside components that are.\n**Prevent** Lint rule rejecting literal px padding outside the token file.\n\n### DQA-02 · Select focus ring clipped · Interaction + Accessibility · High\n**Where** `Select`, inside `.table-scroll`\n**Found** Focus ring cut off on the right by `overflow: hidden` on the ancestor.\n**Expected** Full 2px ring with 2px offset, visible on all sides.\n**Why it matters** Keyboard users cannot see which control has focus — WCAG 2.4.7.\n**Prevent** Test asserting the focus style; avoid `overflow: hidden` on focus-containing ancestors.\n\n### DQA-03 · Danger button has no loading state · Interaction · Medium\n**Where** `Button tone="danger"`\n**Found** Nothing renders during an in-flight destructive action; the button stays active.\n**Expected** Loading state per the destructive-action pattern, width preserved.\n**Why it matters** Double submission is possible, and the user has no feedback.\n**Prevent** State matrix in the component documentation, required before merge.',
    },
  ],
  commonMistakes: [
    {
      id: 'mistake-13-04-qa-by-impression',
      mistake: 'Reporting findings as impressions — "the spacing feels off".',
      why: 'There is nothing to fix. The developer either guesses or asks, and either way the finding costs more than it saves.',
      instead: 'Measure. Report the found value, the expected value, and where.',
    },
    {
      id: 'mistake-13-04-breakpoints-only',
      mistake: 'Testing responsive behaviour only at the named breakpoints.',
      why: 'Layouts break between breakpoints, where nothing was designed and nothing was checked.',
      instead: 'Drag the viewport continuously from 320px upwards, and check either side of every breakpoint.',
    },
  ],
  professionalConsideration: [
    {
      kind: 'paragraph',
      text: 'Design QA is the single most valuable thing a design engineer does that neither pure designers nor pure engineers tend to do.',
    },
    {
      kind: 'paragraph',
      text: 'A designer can see the drift but often cannot name the cause or the fix. An engineer can fix it but often cannot see it. Someone who does both produces findings that get resolved in an afternoon rather than discussed for a sprint — and that is the clearest demonstration of the role existing for a reason.',
    },
  ],
  goDeeper: [
    {
      kind: 'paragraph',
      text: 'Everything below was part of the walkthrough above. It is the detail that matters once the core idea has landed, and it is safe to skip on a first pass.',
    },
    {
      kind: 'paragraph',
      text: 'One format: where, found, expected, why it matters, how to prevent it. The last line is what distinguishes QA from a bug list — each finding also proposes the structural fix.',
    },
    {
      kind: 'paragraph',
      text: 'Severity on every finding, so the list can be triaged rather than read in order. DQA-02 is high because it is an accessibility failure; DQA-01 is low because nobody will notice one card.',
    },
  ],
  practicalExercise: {
    id: 'exercise-design-qa',
    title: 'Run a full design QA pass',
    prompt:
      'Run all four QA passes on something you built, producing a written, severity-ranked report with a prevention proposal per finding.',
    steps: [
      'Visual pass: measure spacing, type, colour, radius and elevation against your tokens.',
      'Run the off-scale console check and the CSS Overview panel, and review the output critically.',
      'Responsive pass: every width from 320px up, including either side of each breakpoint and 200% zoom.',
      'Interaction pass: build the full state matrix and fill every cell.',
      'Accessibility pass: keyboard, screen reader, contrast, reduced motion.',
      'Write every finding in one format with a severity.',
      'For each, propose the structural change that would have prevented it.',
      'Fix the high-severity findings and implement one prevention mechanism.',
    ],
    successCriteria: [
      'All four passes run and documented separately.',
      'Every finding has a measured found value and expected value.',
      'The state matrix is complete, with gaps marked.',
      'Severity assigned to every finding.',
      'A prevention mechanism proposed for each.',
      'High-severity findings fixed and one prevention implemented.',
    ],
    estimatedMinutes: 100,
    hint: 'Build the state matrix before anything else. It usually produces more findings than the other three passes together, because it is the only pass that is exhaustive by construction.',
  },
  reflectionQuestion:
    'Why does a product built from tokens produce a shorter design QA list than one with a token file its components ignore?',
  reflectionHint:
    'Ask where a value comes from in each case, and how many places it could be wrong.',
  resources: [
    {
      id: 'resource-wcag-quickref-13',
      title: 'How to Meet WCAG (Quick Reference)',
      url: 'https://www.w3.org/WAI/WCAG22/quickref/',
      type: 'documentation',
      author: 'W3C WAI',
      estimatedMinutes: 40,
      note: 'The accessibility pass as a filterable checklist. Filter to level AA and work through it.',
    },
    {
      id: 'resource-devtools-css-overview-13',
      title: 'CSS Overview — Chrome DevTools',
      url: 'https://developer.chrome.com/docs/devtools/css-overview',
      type: 'documentation',
      author: 'Chrome for Developers',
      estimatedMinutes: 15,
      note: 'Every colour and font in use, plus contrast problems. The fastest drift check available.',
    },
  ],
  competencyTags: ['design-qa', 'critique', 'accessibility', 'responsive-design', 'design-systems', 'visual-hierarchy'],
  completionCriteria: [
    'Runs four structured passes rather than reviewing by impression.',
    'Reports measured values with severity.',
    'Proposes a prevention mechanism per finding.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Lesson 65                                                                   */
/* -------------------------------------------------------------------------- */

const LESSON_5: Lesson = {
  id: 'lesson-debugging-with-browser-tools',
  slug: 'debugging-with-browser-tools',
  moduleId: MODULE_ID,
  lessonNumber: 5,
  title: 'Debugging With Browser Tools',
  summary:
    'Diagnosis, not instructions. Given a defect you have never seen, which panel tells you what — and how to form a hypothesis before touching the code.',
  estimatedMinutes: 10,
  objectives: [
    'Choose the right panel from the symptom.',
    'Form and test a hypothesis rather than changing things hopefully.',
    'Diagnose a layout, a network and a performance defect.',
    'Use React DevTools to find the state behind a wrong screen.',
  ],
  prerequisiteConcepts: [
    'The rendering pipeline',
    'Performance measurement',
    'The accessibility tree, Module 9 lesson 44',
  ],
  prerequisiteLessonIds: ['lesson-design-qa'],
  recap: [
    {
      kind: 'paragraph',
      text: 'The last four lessons were about finding problems systematically. This one is about what to do with a problem you did not expect and cannot reproduce on demand.',
    },
  ],
  priorKnowledge: [
    {
      kind: 'paragraph',
      text: 'You have used the Elements panel for markup, the Accessibility panel for role and name, the Network panel for requests, and the Performance panel for frames. This lesson is about choosing between them deliberately.',
    },
  ],
  coreConcept: [
    {
      kind: 'paragraph',
      text: 'Debugging is a loop, and the order matters more than the tooling.',
    },
    {
      kind: 'list',
      ordered: true,
      items: [
        '**Observe** — what exactly happens? Not "it is broken" but "the count shows 0 after saving, and is right after a reload".',
        '**Hypothesise** — what could produce exactly that? Usually two or three candidates.',
        '**Choose the cheapest test** — which panel would eliminate the most candidates fastest?',
        '**Test** — and let it eliminate, not confirm.',
        '**Repeat** until one candidate is left.',
      ],
    },
    {
      kind: 'paragraph',
      text: 'The failure mode is skipping to changing code. Commenting things out until the symptom disappears sometimes works and teaches you nothing, so the same bug returns in a different form.',
    },
    {
      kind: 'paragraph',
      text: 'The detail in step one does most of the work. "Right after a reload" eliminates the server as a cause and points at client state — one observation, half the candidates gone.',
    },
  ],
  whyDesignersCare: [
    {
      kind: 'paragraph',
      text: 'Because the ability to diagnose is what turns a design observation into a fixable report.',
    },
    {
      kind: 'paragraph',
      text: '"The dropdown is cut off sometimes" is a complaint. "The dropdown is clipped when its parent has `overflow: hidden`, which happens inside the table scroll container" is a diagnosis, and it comes with a fix. Both start from the same observation; the second spent five minutes in the Elements panel.',
    },
  ],
  howItWorks: [
    {
      kind: 'paragraph',
      text: 'Symptoms map to panels fairly reliably.',
    },
    {
      kind: 'list',
      items: [
        '**Wrong position, size or clipping** → Elements. Computed styles, the box model diagram, and which rule won.',
        '**Wrong or missing data** → Network. Did the request go? What came back? What status?',
        '**Nothing happens on click** → Console for errors, then Elements for an overlay intercepting the pointer.',
        '**Stutter or jank** → Performance. Record the interaction and find the long task or the layout.',
        '**Announced wrongly** → Accessibility. Computed role, name and how the name was derived.',
        '**Screen disagrees with the data** → React DevTools. Read the actual state and props.',
      ],
    },
    {
      kind: 'paragraph',
      text: 'Two techniques are worth more than they look. For "nothing happens on click", the Elements panel’s hover highlight shows what is actually under the pointer — frequently a transparent overlay from a dialog that never unmounted.',
    },
    {
      kind: 'code',
      language: 'javascript',
      code: '// What is really at that point? Not what you think is.\ndocument.elementFromPoint(x, y);\n\n// Everything stacked there, topmost first.\ndocument.elementsFromPoint(x, y).map((element) => element.className || element.tagName);',
    },
    {
      kind: 'paragraph',
      text: 'And for CSS that will not apply, the Computed tab shows the winning value and lets you trace it to the rule that set it. Guessing at specificity is slower and less reliable than reading the answer.',
    },
  ],
  firstPrinciples: [
    {
      kind: 'paragraph',
      text: 'The most useful habit: **look for ground truth, not for a representation of it**.',
    },
    {
      kind: 'paragraph',
      text: 'Your mental model of the CSS is not the CSS; the Computed tab is. Your idea of what the component holds is not its state; React DevTools is. What the server sent is in the Network response, not in the variable you logged three functions later.',
    },
    {
      kind: 'callout',
      tone: 'insight',
      body: 'When a tool and your expectation disagree, the tool is usually right — and the gap between them is the bug. That gap is more informative than either one alone.',
    },
    {
      kind: 'paragraph',
      text: 'This applies to your own instrumentation too. A console log can be stale, logged from a closure, or printing an object the devtools then show expanded to its *current* value rather than its value at log time. Reading the authoritative panel avoids a class of confusion that logs create.',
    },
  ],
  designPerspective: [
    {
      kind: 'paragraph',
      text: 'The design question is what the user experienced, precisely.',
    },
    {
      kind: 'paragraph',
      text: 'A good bug report is mostly careful observation: what they did, what they expected, what happened, and under what conditions it does and does not happen. That last part — the conditions — is what makes a bug reproducible, and it is usually the part missing.',
    },
  ],
  engineeringPerspective: [
    {
      kind: 'paragraph',
      text: 'The engineering question is whether you can reproduce it reliably.',
    },
    {
      kind: 'paragraph',
      text: 'A bug you can reproduce is nearly solved; one you cannot is a research project. So the first real work is often finding the conditions — throttle the network, throttle the CPU, narrow the viewport, use the keyboard only, try a slow connection. Many "intermittent" bugs are perfectly deterministic under conditions nobody tried.',
    },
  ],
  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'Diagnosis is the skill that makes the rest of this module usable.',
    },
    {
      kind: 'paragraph',
      text: 'A design QA finding without a diagnosis is a complaint. A performance number without a diagnosis is a figure. A failing test without a diagnosis is a blocked merge. Every measurement in this module produces a symptom, and the value comes from turning symptoms into causes.',
    },
  ],
  industryExamples: [
    {
      id: 'example-devtools-performance-reference',
      source: 'Chrome for Developers',
      title: 'The Performance panel documented in full',
      observation:
        'The Performance panel reference explains the flame chart, the main-thread track, and how to read activity by stage.',
      takeaway:
        'The panel is only useful once you can read it. An hour with the reference pays for itself the first time something stutters.',
    },
    {
      id: 'example-react-devtools-state',
      source: 'React',
      title: 'State and props readable at runtime',
      observation:
        'React DevTools shows the current props and state of any component in the tree, and can highlight what re-rendered.',
      takeaway:
        'Most "the screen is wrong" bugs are state bugs. Reading the state directly is faster than inferring it from the screen.',
    },
  ],
  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Three diagnoses, each following the loop rather than guessing.',
    },
    {
      kind: 'paragraph',
      text: '**Defect one: the dropdown is cut off inside the table.** Observe: only inside the table; the menu renders but is clipped on the right. Hypotheses: an ancestor has `overflow: hidden`; the menu is positioned wrongly; a z-index problem. Cheapest test: Elements, inspect the menu, check ancestors’ computed overflow. Finding: `.table-scroll` has `overflow: auto`, which clips descendants. Fix: render the menu in a portal, outside that subtree. A z-index change would have done nothing, which is why the hypothesis was worth eliminating rather than acting on.',
    },
    {
      kind: 'paragraph',
      text: '**Defect two: the list sometimes shows stale results.** Observe: only when typing quickly; the results match an earlier query. Hypotheses: a race condition; a cache; a debounce bug. Cheapest test: Network, throttle to Slow 3G, type quickly, read the response order. Finding: responses arrive out of order and the later-arriving earlier request wins — exactly Module 11 lesson 51. Fix: `AbortController`. Throttling is what made an intermittent bug deterministic.',
    },
  ],
  commonMistakes: [
    {
      id: 'mistake-13-05-changing-before-diagnosing',
      mistake: 'Changing code to see whether the symptom goes away.',
      why: 'It occasionally works, teaches you nothing about the cause, and leaves changes nobody can justify later.',
      instead: 'Observe precisely, hypothesise, then run the cheapest test that eliminates candidates.',
    },
    {
      id: 'mistake-13-05-debugging-unthrottled',
      mistake: 'Trying to reproduce a timing or performance bug on a fast machine with a fast network.',
      why: 'The conditions that cause it are absent, so it looks intermittent or unreproducible.',
      instead: 'Throttle CPU and network deliberately. Most intermittent bugs become deterministic.',
    },
  ],
  professionalConsideration: [
    {
      kind: 'paragraph',
      text: 'Diagnostic skill is the least teachable and most valuable thing in this module, and it compounds.',
    },
    {
      kind: 'paragraph',
      text: 'Every bug you diagnose properly adds a pattern you recognise next time: clipped thing, suspect an ancestor’s overflow; stale data, suspect response ordering; stutter, suspect a read in a loop. Someone who fixes bugs by changing things until they work accumulates nothing, and is still guessing after five years. The difference is entirely in whether you insisted on knowing the cause.',
    },
  ],
  goDeeper: [
    {
      kind: 'paragraph',
      text: 'Everything below was part of the walkthrough above. It is the detail that matters once the core idea has landed, and it is safe to skip on a first pass.',
    },
    {
      kind: 'paragraph',
      text: '**Defect three: scrolling the table stutters.** Observe: only with more than about fifty rows; only while scrolling. Hypotheses: too many DOM nodes; an expensive scroll handler; a layout-tier animation. Cheapest test: Performance, 4× CPU throttle, record a scroll. Finding: a `scroll` listener reading `getBoundingClientRect` per row — layout thrashing from lesson 61. Fix: an `IntersectionObserver`, which reports visibility without forcing layout.',
    },
    {
      kind: 'paragraph',
      text: 'In all three, the throttling or the panel made the invisible visible. None was solved by reading code first, and all three causes were in earlier lessons of this module.',
    },
  ],
  practicalExercise: {
    id: 'exercise-debugging-with-browser-tools',
    title: 'Diagnose defects rather than following instructions',
    prompt:
      'Deliberately introduce defects into your own work, have someone else introduce some, then diagnose each one by the loop — recording your hypotheses before testing them.',
    steps: [
      'Introduce five defects of different kinds: layout, data, interaction, performance, accessibility.',
      'Leave them for a day so you no longer remember what you changed.',
      'For each, write the precise observation before opening any panel.',
      'Write two or three hypotheses, then the cheapest test for each.',
      'Diagnose, recording which panel gave the answer.',
      'Fix, and note which earlier lesson the cause came from.',
      'Have someone else introduce two defects you know nothing about, and diagnose those.',
      'Write down the three symptom-to-cause patterns you would now recognise instantly.',
    ],
    successCriteria: [
      'Observation written before any tool is opened, for every defect.',
      'Hypotheses recorded before testing, not after.',
      'The panel that produced each answer is identified.',
      'All five self-introduced defects diagnosed by cause, not by reverting.',
      'At least one externally introduced defect diagnosed.',
      'Three reusable symptom-to-cause patterns written down.',
    ],
    estimatedMinutes: 90,
    hint: 'The day’s delay is not optional. Diagnosing a bug you remember introducing teaches you nothing, because you are recalling rather than reasoning.',
  },
  reflectionQuestion:
    'Why is a bug you can reproduce reliably nearly solved?',
  reflectionHint:
    'Ask what you can do with a reproducible case that you cannot do with an intermittent one.',
  resources: [
    {
      id: 'resource-devtools-performance-reference-13',
      title: 'Performance panel reference — Chrome DevTools',
      url: 'https://developer.chrome.com/docs/devtools/performance/reference',
      type: 'documentation',
      author: 'Chrome for Developers',
      estimatedMinutes: 40,
      note: 'How to read a recording. Dense, and the single highest-return hour of tooling documentation available.',
    },
    {
      id: 'resource-react-devtools-13',
      title: 'React Developer Tools',
      url: 'https://react.dev/learn/react-developer-tools',
      type: 'documentation',
      author: 'React',
      estimatedMinutes: 20,
      note: 'Reading state and props at runtime, and finding what re-rendered.',
    },
  ],
  competencyTags: ['browser-apis', 'performance', 'design-qa', 'testing', 'architecture'],
  completionCriteria: [
    'Observes precisely and hypothesises before testing.',
    'Chooses the panel that eliminates the most candidates.',
    'Reproduces timing bugs by throttling deliberately.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Project                                                                     */
/* -------------------------------------------------------------------------- */

const PROJECT: ModuleProject = {
  id: 'project-performance-and-quality-retrofit',
  slug: 'performance-and-quality-retrofit',
  moduleId: MODULE_ID,
  title: 'Performance and Quality Retrofit',
  brief:
    'Take an earlier project, measure it properly across performance, accessibility, behaviour and visual fidelity, improve it, and document before-and-after evidence for every change.',
  learnerGoal:
    'Practise the part of the job that is measuring rather than building, and produce the evidence that makes quality claims credible.',
  problem:
    'Everything you have built was declared finished without being measured. This project finds out what that was worth. Retrofitting is also the common case professionally — most work is on a product that already exists.',
  prerequisiteLessonIds: [
    'lesson-how-the-browser-renders-an-interface',
    'lesson-frontend-performance-fundamentals',
    'lesson-testing-important-product-behaviour',
    'lesson-design-qa',
    'lesson-debugging-with-browser-tools',
  ],
  objectives: [
    'Measure before changing anything.',
    'Fix one thing at a time with attributable evidence.',
    'Add a small, high-value test suite to existing code.',
    'Produce a before-and-after report that would survive scrutiny.',
  ],
  requirements: [
    'An earlier project of yours — Module 11 or 12 is the best candidate.',
    'A baseline: all three vitals under throttled conditions, bundle size, and the five largest resources.',
    'A full design QA report with severities and a complete state matrix.',
    'An accessibility baseline: automated audit, keyboard pass, screen reader pass.',
    'A behaviour baseline: list every promised behaviour and which are currently broken.',
    'At least six improvements, each measured before and after.',
    'A test suite covering the behaviour you fixed, so it cannot regress.',
    'A written report with evidence for every claim.',
  ],
  constraints: [
    'No change without a measurement before and after.',
    'No redesign. This is a quality pass, not a second attempt.',
    'No fixing several things at once.',
    'No claim in the report that is not backed by a figure, a recording or a test.',
  ],
  suggestedScope:
    'One existing project, roughly twenty-five to thirty-five hours, most of it measuring and documenting rather than coding. Finished when every claim in the report has evidence attached.',
  deliverables: [
    'The improved project.',
    'The baseline report: performance, accessibility, behaviour, visual.',
    'A change log: each improvement with its before and after figures.',
    'The test suite protecting what you fixed.',
    'A short note on which measurement surprised you most.',
  ],
  completionCriteria: [
    'A baseline exists for all four dimensions, taken before any change.',
    'Six or more improvements, each with attributable before-and-after evidence.',
    'The state matrix is complete and its gaps are either filled or recorded.',
    'Automated accessibility violations are zero, and the keyboard and screen reader passes are documented.',
    'Every behaviour fixed has a test that has been seen to fail.',
    'Performance figures are from throttled or real-device measurement.',
    'No claim in the report lacks evidence.',
  ],
  portfolioEvidence: [
    'Measurement discipline — baselines before changes, one variable at a time.',
    'Breadth — performance, accessibility, behaviour and visual quality in one pass.',
    'Evidence — every claim backed by a figure rather than an assertion.',
    'Professional judgement — improvements prioritised by impact, not by ease.',
  ],
  reflectionQuestion:
    'Which measurement most contradicted what you believed about your own work?',
  estimatedHours: 30,
  competencies: [
    'performance',
    'testing',
    'design-qa',
    'accessibility',
    'browser-apis',
    'architecture',
    'critique',
    'product-judgement',
    'responsive-design',
    'css',
  ],
  stretchGoals: [
    'Add the measurements to CI so the budget is enforced rather than remembered.',
    'Measure on a real mid-range phone and compare with your throttled laptop figures.',
    'Add field measurement and compare real user data with your lab numbers after a week.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Module                                                                      */
/* -------------------------------------------------------------------------- */

export const MODULE_13: CurriculumModule = {
  id: MODULE_ID,
  slug: 'performance-testing-and-design-qa',
  moduleNumber: 13,
  phase: 'interaction-and-motion',
  title: 'Performance, Testing and Design QA',
  description:
    'Three forms of measurement that are really one skill: knowing whether what you built works. The rendering pipeline, the main thread and the vitals; which tests are worth having; the four-pass design review; and diagnosing a defect you have never seen before.',
  outcome:
    'Can measure a product across performance, behaviour, accessibility and visual fidelity, and improve it with evidence rather than belief.',
  prerequisites: [
    'Module 11 — async behaviour worth testing',
    'Module 12 — motion, whose cost this module explains',
    'Module 10 — the tokens design QA measures against',
  ],
  lessons: [LESSON_1, LESSON_2, LESSON_3, LESSON_4, LESSON_5],
  resources: [
    {
      id: 'resource-module-13-web-dev-fast',
      title: 'Fast load times',
      url: 'https://web.dev/explore/fast',
      type: 'article',
      author: 'web.dev',
      estimatedMinutes: 120,
      note: 'The collected performance guidance. Use it as a reference for whichever problem your measurements actually found.',
    },
    {
      id: 'resource-module-13-testing-library',
      title: 'Testing Library',
      url: 'https://testing-library.com/',
      type: 'documentation',
      author: 'Testing Library',
      estimatedMinutes: 60,
      note: 'The library and its philosophy. The query priority list is the part that changes how you write tests.',
    },
    {
      id: 'resource-module-13-chrome-devs',
      title: 'Chrome for Developers',
      url: 'https://www.youtube.com/@ChromeDevs',
      type: 'video',
      author: 'Chrome for Developers',
      estimatedMinutes: 60,
      note: 'Search for Performance panel walkthroughs and Core Web Vitals deep dives. Profiling is far clearer demonstrated than described.',
    },
    {
      id: 'resource-module-13-axe-core',
      title: 'axe-core',
      url: 'https://github.com/dequelabs/axe-core',
      type: 'tool',
      author: 'Deque',
      estimatedMinutes: 30,
      note: 'The automated accessibility engine, including documentation of what it cannot detect. Read that part.',
    },
  ],
  project: PROJECT,
  competencies: [
    'performance',
    'testing',
    'design-qa',
    'accessibility',
    'browser-apis',
    'architecture',
    'critique',
    'product-judgement',
    'css',
    'motion',
    'responsive-design',
    'design-systems',
    'visual-hierarchy',
  ],
  completionCriteria: [
    'All five lessons completed.',
    'Module project marked completed.',
    'Can measure quality across four dimensions and improve with evidence.',
  ],
};
