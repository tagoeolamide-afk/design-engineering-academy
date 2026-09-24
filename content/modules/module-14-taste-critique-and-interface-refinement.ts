/**
 * Module 14 — Taste, Critique and Interface Refinement.
 *
 * What polish actually is, how to find visual and interaction defects
 * systematically, how to simplify without removing capability, and a critique
 * sequence that starts from purpose rather than appearance.
 */

import type { CurriculumModule, Lesson, ModuleProject } from '@/types/curriculum';

const MODULE_ID = 'module-14';

/* -------------------------------------------------------------------------- */
/* Lesson 66                                                                   */
/* -------------------------------------------------------------------------- */

const LESSON_66: Lesson = {
  id: 'lesson-14-01',
  slug: 'what-polish-means',
  moduleId: MODULE_ID,
  lessonNumber: 1,
  title: 'What Polish Means',
  summary:
    'Polish is mostly what happens between the screenshots: the states, the transitions, and the cases nobody drew.',
  estimatedMinutes: 8,

  objectives: [
    'Define polish as coverage and consistency rather than as decoration.',
    'Identify what a static review cannot see.',
    'Run a polish pass with a defined scope.',
    'Judge which details change the experience and which do not.',
  ],

  prerequisiteConcepts: ['Design QA', 'Interaction states'],
  prerequisiteLessonIds: ['lesson-13-05'],

  recap: [
    {
      kind: 'paragraph',
      text: 'Design QA finds defects against a standard. This module is about developing the standard itself.',
    },
  ],

  coreConcept: [
    {
      kind: 'paragraph',
      text: 'Polish is usually described as visual refinement, which is the smallest part of it. Most of what people perceive as polish is coverage: the states that exist, the transitions that connect them, and the edge cases that behave sensibly.',
    },
    {
      kind: 'list',
      items: [
        'Consistency — the same decision applied the same way everywhere.',
        'Hierarchy — importance legible without reading.',
        'Behaviour — every control doing what its appearance promises.',
        'Transitions — connections between states that are explained rather than abrupt.',
        'Edge cases — long content, no content, failure, slow connections.',
        'Details — focus rings, hit areas, truncation, pluralisation, timing.',
      ],
    },
    {
      kind: 'callout',
      tone: 'insight',
      body: 'A product can be beautiful in every screenshot and feel unfinished in use, because the screenshots never showed the transitions between them.',
    },
  ],

  firstPrinciples: [
    {
      kind: 'paragraph',
      text: 'Quality is perceived at the weakest point, not the average. One control with no focus state, one list that says "1 items", one transition that jumps — each of these is noticed more than five well-made things are appreciated.',
    },
    {
      kind: 'paragraph',
      text: 'That asymmetry is why polish is coverage work. Raising the floor changes the perception of the whole product; raising the ceiling on something already good changes very little.',
    },
  ],

  designPerspective: [
    {
      kind: 'paragraph',
      text: 'The gap between a design file and a product is the gap between frames and film. The file has the composition; the product has arrival, hesitation, failure, and return.',
    },
    {
      kind: 'paragraph',
      text: 'This is why reviewing screenshots systematically misses most polish defects. They live in the moments between the states that were drawn.',
    },
  ],

  engineeringPerspective: [
    {
      kind: 'code',
      language: 'md',
      caption: 'A polish checklist per interactive element.',
      code: `For every interactive element:
- [ ] Hover, focus-visible, active, disabled, and loading states exist
- [ ] Focus ring visible against every background it appears on
- [ ] Hit area at least 44x44px, independent of visual size
- [ ] Transitions use token durations and curves
- [ ] Pluralisation correct at 0, 1, and many
- [ ] Truncation has an affordance for the full value
- [ ] Behaves correctly with the longest realistic content
- [ ] Reachable and operable by keyboard alone`,
    },
    {
      kind: 'paragraph',
      text: 'A checklist beats judgement for this work. Polish defects are individually small and numerous, and the failure mode is not noticing rather than not caring.',
    },
  ],

  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'Most polish work is engineering that only a designer\'s eye identifies, or design decisions only visible once implemented. Neither discipline finds it alone.',
    },
    {
      kind: 'paragraph',
      text: 'That makes it one of the clearest places where a design engineer produces something neither role would have produced separately.',
    },
  ],

  industryExamples: [
    {
      id: 'example-focus-states-polish',
      source: 'Tools known for feeling refined',
      title: 'Complete state coverage as the common factor',
      observation:
        'Interfaces that feel polished have every state present on every control, applied consistently rather than per component.',
      takeaway:
        'The perception comes from the absence of gaps, not from any individual flourish.',
    },
    {
      id: 'example-pluralisation',
      source: 'Interfaces with counted content',
      title: 'Small correctness read as care',
      observation:
        '"1 item" rather than "1 items" is trivially small and consistently noticed when wrong.',
      takeaway:
        'Visible sloppiness in a small thing implies invisible sloppiness in large ones.',
    },
  ],

  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'A polish pass on an old project.',
    },
    { kind: 'heading', text: '1. Scope it' },
    {
      kind: 'paragraph',
      text: 'One flow. A polish pass over a whole product becomes a redesign and is never finished.',
    },
    { kind: 'heading', text: '2. Use it, do not look at it' },
    {
      kind: 'paragraph',
      text: 'Complete the flow at normal speed. Note every moment of hesitation, surprise, or uncertainty.',
    },
    { kind: 'heading', text: '3. Check states, element by element' },
    {
      kind: 'paragraph',
      text: 'The checklist, applied per control. This is where most defects are.',
    },
    { kind: 'heading', text: '4. Check the transitions' },
    {
      kind: 'paragraph',
      text: 'Every state change. Anything abrupt, anything that jumps, anything animated for no reason.',
    },
    { kind: 'heading', text: '5. Break the content' },
    {
      kind: 'paragraph',
      text: 'Longest realistic value, empty, one item, four hundred. Each reveals different defects.',
    },
    { kind: 'heading', text: '6. Fix by effect on comprehension' },
    {
      kind: 'paragraph',
      text: 'Anything that makes the product harder to understand first. Aesthetic refinements last.',
    },
  ],

  commonMistakes: [
    {
      id: 'mistake-polish-as-decoration',
      mistake: 'Treating polish as visual refinement.',
      why: 'The defects people actually notice are missing states and abrupt transitions, not insufficiently refined shadows.',
      instead: 'Treat polish as coverage and consistency first.',
    },
    {
      id: 'mistake-unscoped-polish',
      mistake: 'A polish pass with no scope.',
      why: 'It expands into a redesign and never reaches a finished state.',
      instead: 'Scope to one flow and finish it.',
    },
    {
      id: 'mistake-reviewing-screenshots',
      mistake: 'Reviewing polish from static screens.',
      why: 'Transitions, timing, and failure cases are invisible in a frame.',
      instead: 'Use the product at normal speed.',
    },
    {
      id: 'mistake-ceiling-not-floor',
      mistake: 'Refining what is already good.',
      why: 'Quality is perceived at the weakest point, so the return is near zero.',
      instead: 'Raise the floor: find what is missing or broken.',
    },
  ],

  eliteConsiderations: [
    {
      kind: 'list',
      items: [
        'Keep a standing polish checklist and apply it per component rather than relying on noticing.',
        'Review at normal speed, not in slow deliberate inspection; users are not inspecting.',
        'Fix the weakest element before improving the strongest.',
        'Note anything that made you hesitate; hesitation is a defect even when you cannot name it yet.',
      ],
    },
  ],

  practicalExercise: {
    id: 'exercise-14-01',
    title: 'Perform a polish pass on an old project',
    prompt:
      'Take an earlier project and run a scoped polish pass focused on coverage rather than decoration.',
    steps: [
      'Choose one flow and scope the pass to it.',
      'Complete the flow at normal speed, noting every hesitation or surprise.',
      'Apply a state checklist to every interactive element.',
      'Check every transition for abruptness, jumps, or unjustified motion.',
      'Test with the longest realistic content, with none, with one item, and with many.',
      'Record every defect found.',
      'Rank by effect on comprehension and fix in that order.',
      'Re-run the flow and confirm the hesitation points are gone.',
    ],
    successCriteria: [
      'Every interactive element has complete state coverage.',
      'Defects are ranked by effect on comprehension, not by ease of fixing.',
      'The flow was tested with content of varying length and quantity.',
      'Hesitation points from the first pass are resolved.',
      'The pass was scoped and completed rather than left open.',
    ],
    estimatedMinutes: 50,
    hint: 'Use it before you inspect it. The first run at normal speed produces the most honest list.',
  },

  reflectionQuestion: 'Is polish primarily visual?',
  reflectionHint: 'Notice what happens between screenshots.',

  resources: [
    {
      id: 'resource-nngroup-heuristics',
      title: '10 usability heuristics for user interface design',
      url: 'https://www.nngroup.com/articles/ten-usability-heuristics/',
      type: 'article',
      estimatedMinutes: 20,
      note: 'A durable checklist for what an interface owes its user.',
    },
    {
      id: 'resource-apple-hig-polish',
      title: 'Apple HIG: inclusion and feedback',
      url: 'https://developer.apple.com/design/human-interface-guidelines/feedback',
      type: 'documentation',
      estimatedMinutes: 20,
      note: 'Feedback and state coverage treated as fundamentals.',
    },
  ],

  competencyTags: ['interaction-design', 'critique', 'product-judgement', 'design-qa'],

  completionCriteria: [
    'A scoped polish pass was completed on a real project.',
    'Defects were ranked by effect on comprehension.',
    'State coverage is complete for every interactive element.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Lesson 67                                                                   */
/* -------------------------------------------------------------------------- */

const LESSON_67: Lesson = {
  id: 'lesson-14-02',
  slug: 'finding-visual-defects',
  moduleId: MODULE_ID,
  lessonNumber: 2,
  title: 'Finding Visual Defects',
  summary:
    'Visual defects are found by systematic comparison, not by looking harder. The eye adapts to what it sees repeatedly.',
  estimatedMinutes: 9,

  objectives: [
    'Detect spacing and alignment defects with repeatable techniques.',
    'Identify contrast and typographic failures against a standard.',
    'Judge density against the task the surface supports.',
    'Prioritise visual defects by effect on comprehension.',
  ],

  prerequisiteConcepts: ['Visual systems', 'Design tokens'],
  prerequisiteLessonIds: ['lesson-14-01', 'lesson-09-01'],

  recap: [
    {
      kind: 'paragraph',
      text: 'Polish is coverage. This lesson is the visual half of finding what is missing or wrong.',
    },
  ],

  coreConcept: [
    {
      kind: 'paragraph',
      text: 'The eye adapts. After twenty minutes with an interface, inconsistencies stop registering — which means finding visual defects requires technique rather than attention.',
    },
    {
      kind: 'list',
      items: [
        'Spacing — every value on the scale; near-identical gaps that differ by a few pixels.',
        'Alignment — elements that should share an edge and do not.',
        'Contrast — every text and interactive element against its actual background.',
        'Rhythm — consistent vertical spacing between comparable sections.',
        'Typography — sizes from the scale, line heights appropriate, measure constrained.',
        'Density — appropriate to the task, consistent between comparable surfaces.',
      ],
    },
    {
      kind: 'paragraph',
      text: 'The most productive technique is comparison rather than inspection. Two cards side by side reveal a spacing difference that neither reveals alone, and squinting removes detail so that grouping and hierarchy become visible.',
    },
    {
      kind: 'callout',
      tone: 'insight',
      body: 'A defect you cannot state as a rule violation is a preference. "This gap is 18px, and the scale has 16 and 24" is a defect.',
    },
  ],

  firstPrinciples: [
    {
      kind: 'paragraph',
      text: 'Most spacing defects are off-scale values. Someone needed a gap slightly larger than the step below, typed a number, and it persisted. The defect is not the number but the departure from the system, which compounds as others copy it.',
    },
    {
      kind: 'paragraph',
      text: 'This gives an objective test that does not depend on taste: trace every value to a token. Anything untraceable is a defect or a documented exception, and both are actionable.',
    },
  ],

  designPerspective: [
    {
      kind: 'paragraph',
      text: 'Not all visual defects matter equally. A misaligned icon is noticed; insufficient contrast on body text prevents reading. One is untidy and one is exclusionary.',
    },
    {
      kind: 'paragraph',
      text: 'The ranking should follow effect on comprehension: anything that stops someone understanding or reading first, hierarchy failures second, consistency third, refinement last.',
    },
  ],

  engineeringPerspective: [
    {
      kind: 'code',
      language: 'ts',
      caption: 'Finding off-scale values by inspection rather than by eye.',
      code: `// Every spacing value in use, with a count. Off-scale values stand out.
const SCALE = new Set(['0px','4px','8px','12px','16px','24px','32px','48px']);
const offScale = new Map<string, number>();

document.querySelectorAll<HTMLElement>('*').forEach((element) => {
  const style = getComputedStyle(element);
  for (const property of ['marginTop','marginBottom','paddingTop','paddingBottom','gap']) {
    const value = style[property as keyof CSSStyleDeclaration] as string;
    if (value && value !== '0px' && !SCALE.has(value)) {
      offScale.set(value, (offScale.get(value) ?? 0) + 1);
    }
  }
});

console.table([...offScale].sort((a, b) => b[1] - a[1]));`,
    },
    {
      kind: 'paragraph',
      text: 'Browser tooling covers the rest. DevTools shows computed contrast for any text node, the accessibility panel flags failures, and a ruler overlay makes alignment differences measurable instead of debatable.',
    },
  ],

  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'Tracing values to tokens converts a subjective review into an objective one. "That spacing looks wrong" becomes "that spacing is not on the scale", which is checkable and not arguable.',
    },
    {
      kind: 'paragraph',
      text: 'It also finds drift that no individual reviewer would notice, because the defect is the pattern across many places rather than any single instance.',
    },
  ],

  industryExamples: [
    {
      id: 'example-token-audits',
      source: 'Design system teams',
      title: 'Auditing for off-scale values',
      observation:
        'Teams maintaining systems periodically scan production for values outside the token scales and treat each as drift.',
      takeaway:
        'Systems decay one convenient value at a time, and only measurement catches it.',
    },
    {
      id: 'example-contrast-failures',
      source: 'Accessibility audits',
      title: 'Placeholder and secondary text as repeat offenders',
      observation:
        'Contrast failures cluster in low-emphasis text — placeholders, captions, disabled states — because that text was designed to recede.',
      takeaway:
        'Receding and unreadable are different, and the boundary is a measurable number.',
    },
  ],

  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Creating a twenty-item visual defect audit.',
    },
    { kind: 'heading', text: '1. Scan for off-scale values' },
    {
      kind: 'paragraph',
      text: 'Programmatically, not by eye. The list of untraceable values is your starting set.',
    },
    { kind: 'heading', text: '2. Check alignment with an overlay' },
    {
      kind: 'paragraph',
      text: 'A ruler or grid overlay over every screen. Elements that should share an edge and do not.',
    },
    { kind: 'heading', text: '3. Measure contrast everywhere' },
    {
      kind: 'paragraph',
      text: 'Every text colour against its real background, in both themes. Placeholders and captions especially.',
    },
    { kind: 'heading', text: '4. Compare comparable surfaces' },
    {
      kind: 'paragraph',
      text: 'Two cards, two forms, two lists side by side. Differences that do not reflect a decision are defects.',
    },
    { kind: 'heading', text: '5. Squint' },
    {
      kind: 'paragraph',
      text: 'Blur the screen. If the most important element is not the most prominent, hierarchy has failed.',
    },
    { kind: 'heading', text: '6. Rank by comprehension' },
    {
      kind: 'paragraph',
      text: 'Readability first, hierarchy second, consistency third, refinement last.',
    },
  ],

  commonMistakes: [
    {
      id: 'mistake-inspection-not-comparison',
      mistake: 'Looking harder instead of comparing.',
      why: 'The eye adapts to what it sees repeatedly, so inconsistency stops registering.',
      instead: 'Compare surfaces side by side and measure against the scale.',
    },
    {
      id: 'mistake-preference-as-defect',
      mistake: 'Recording preferences as defects.',
      why: 'The list becomes contestable and gets dismissed wholesale.',
      instead: 'State each defect as a rule or token violation.',
    },
    {
      id: 'mistake-contrast-by-eye',
      mistake: 'Judging contrast visually.',
      why: 'A developer display at full brightness passes almost anything; a phone in daylight does not.',
      instead: 'Measure every pairing against the ratio.',
    },
    {
      id: 'mistake-refinement-first',
      mistake: 'Fixing refinement before readability.',
      why: 'The high-impact defects stay while effort goes to things nobody was struggling with.',
      instead: 'Rank by effect on comprehension.',
    },
  ],

  eliteConsiderations: [
    {
      kind: 'list',
      items: [
        'Audit programmatically; a script finds drift no reviewer would.',
        'Review at a different zoom level — it resets the adaptation that hides inconsistency.',
        'Check both themes; contrast failures frequently exist in only one.',
        'Record the token that should have been used, so the fix is unambiguous.',
      ],
    },
  ],

  practicalExercise: {
    id: 'exercise-14-02',
    title: 'Create a 20-item visual defect audit',
    prompt:
      'Produce a defect list of twenty items, each stated as a rule violation with a specific fix.',
    steps: [
      'Scan the interface programmatically for off-scale spacing values.',
      'Overlay a grid and record alignment failures.',
      'Measure contrast for every text and interactive element in both themes.',
      'Compare comparable surfaces side by side and record unexplained differences.',
      'Squint at each screen and record hierarchy failures.',
      'Record twenty defects, each as a rule or token violation.',
      'Name the token or value that should have been used for each.',
      'Rank by effect on comprehension and fix the top five.',
    ],
    successCriteria: [
      'Twenty defects are recorded, each stated as a rule violation.',
      'Each names the token or value that should have been used.',
      'Contrast was measured, not judged by eye, in both themes.',
      'The list is ranked by effect on comprehension.',
      'At least one defect was found programmatically rather than visually.',
    ],
    estimatedMinutes: 55,
    hint: 'If you cannot name the rule a defect violates, it is a preference. Leave it out and keep the list credible.',
  },

  reflectionQuestion: 'Which defect should you fix first?',
  reflectionHint: 'Prioritise effect on comprehension.',

  resources: [
    {
      id: 'resource-wcag-contrast-14',
      title: 'WCAG: contrast (minimum)',
      url: 'https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html',
      type: 'specification',
      estimatedMinutes: 15,
      note: 'The ratios, and what they are derived from.',
    },
    {
      id: 'resource-devtools-css-overview',
      title: 'Chrome DevTools: CSS overview',
      url: 'https://developer.chrome.com/docs/devtools/css-overview',
      type: 'documentation',
      estimatedMinutes: 15,
      note: 'Every colour and font in use on a page, listed.',
    },
  ],

  competencyTags: [
    'visual-hierarchy',
    'typography',
    'colour',
    'layout',
    'critique',
    'design-qa',
  ],

  completionCriteria: [
    'A twenty-item audit exists with each defect stated as a rule violation.',
    'Contrast was measured in both themes.',
    'The list is ranked by effect on comprehension.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Lesson 68                                                                   */
/* -------------------------------------------------------------------------- */

const LESSON_68: Lesson = {
  id: 'lesson-14-03',
  slug: 'finding-interaction-defects',
  moduleId: MODULE_ID,
  lessonNumber: 3,
  title: 'Finding Interaction Defects',
  summary:
    'Interaction defects are felt before they are seen. Unreliability comes from unpredictability, not from ugliness.',
  estimatedMinutes: 9,

  objectives: [
    'Audit a workflow for feedback, latency, and ambiguity.',
    'Find keyboard and focus failures systematically.',
    'Identify dead ends where the user has no next move.',
    'Separate interaction defects from visual ones during review.',
  ],

  prerequisiteConcepts: ['Interaction states', 'Focus management'],
  prerequisiteLessonIds: ['lesson-14-02', 'lesson-03-03'],

  recap: [
    {
      kind: 'paragraph',
      text: 'The visual pass found what looks wrong. This pass ignores appearance entirely.',
    },
  ],

  coreConcept: [
    {
      kind: 'paragraph',
      text: 'Interaction defects fall into categories that are easier to find when looked for one at a time.',
    },
    {
      kind: 'list',
      items: [
        'Feedback — an action with no acknowledgement.',
        'Latency — acknowledgement that arrives too late to feel connected.',
        'Keyboard — anything reachable by mouse and not by keyboard.',
        'Focus — focus lost, invisible, or landing somewhere unhelpful.',
        'Ambiguity — a control whose result cannot be predicted before using it.',
        'Dead ends — a state with no way forward and no way back.',
      ],
    },
    {
      kind: 'paragraph',
      text: 'Reliability is predictability. An interface that behaves identically every time feels trustworthy even if it is slow; one that behaves differently depending on timing feels broken even when it is fast.',
    },
    {
      kind: 'callout',
      tone: 'warning',
      body: 'Dead ends are the most severe and the least noticed, because the person who built the flow always knows the way out.',
    },
  ],

  firstPrinciples: [
    {
      kind: 'paragraph',
      text: 'Trust is built by confirmed prediction. Each time a control does what the user expected, confidence rises; each surprise costs more than a success gains, because it introduces doubt about everything else.',
    },
    {
      kind: 'paragraph',
      text: 'This is why inconsistency is worse than uniform mediocrity. A button that usually responds instantly and occasionally takes two seconds is more damaging than one that always takes one.',
    },
  ],

  designPerspective: [
    {
      kind: 'paragraph',
      text: 'Auditing interaction requires deliberately ignoring aesthetics, which is difficult because visual defects are more immediately visible.',
    },
    {
      kind: 'paragraph',
      text: 'A technique that works: reduce the interface. Remove colour, or work at very low brightness, or navigate with a screen reader. With appearance suppressed, the behavioural defects become the only thing left to notice.',
    },
  ],

  engineeringPerspective: [
    {
      kind: 'code',
      language: 'md',
      caption: 'An interaction audit run one category at a time.',
      code: `## Pass 1 — Feedback
- Every action acknowledged within 100ms
- Long operations show progress, not just a spinner
- Success and failure both produce a visible, announced result

## Pass 2 — Keyboard
- Every interactive element reachable by Tab
- Tab order matches visual order
- Focus ring visible on every background
- Escape dismisses every dismissible surface
- Focus restored to the trigger after every close

## Pass 3 — Ambiguity
- Every control's result predictable before activating it
- Destructive actions named, never "OK"
- Disabled controls explain why they are disabled

## Pass 4 — Dead ends
- Every error state offers a route forward
- Every empty state offers an action
- Back always works, from every state`,
    },
    {
      kind: 'paragraph',
      text: 'The disabled-control item is worth singling out. A disabled button with no explanation is a dead end that looks like a normal state: the user cannot proceed and cannot discover why.',
    },
  ],

  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'Interaction defects are where design intent and implementation reality diverge most. A design says "saves automatically"; the implementation debounces at 2000ms, and the user navigates away believing their work is saved.',
    },
    {
      kind: 'paragraph',
      text: 'Neither a design review nor a code review finds that. Using the product does.',
    },
  ],

  industryExamples: [
    {
      id: 'example-focus-restoration',
      source: 'Accessible dialogs',
      title: 'Focus returning to the trigger',
      observation:
        'Well-built overlays restore focus to the element that opened them on every close path, including Escape and click-outside.',
      takeaway:
        'Without it, a keyboard user is returned to the top of the document and has to navigate back.',
    },
    {
      id: 'example-autosave-ambiguity',
      source: 'Editors with automatic saving',
      title: 'Save state made explicit',
      observation:
        'Products that save automatically show an explicit saved or saving indicator rather than leaving it implied.',
      takeaway:
        'Silent saving is indistinguishable from not saving, and users compensate by pressing Ctrl+S anyway.',
    },
  ],

  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Auditing a workflow without looking at aesthetics.',
    },
    { kind: 'heading', text: '1. Suppress the visuals' },
    {
      kind: 'paragraph',
      text: 'Greyscale, low brightness, or a screen reader. Remove the temptation to review appearance.',
    },
    { kind: 'heading', text: '2. One category per pass' },
    {
      kind: 'paragraph',
      text: 'Feedback, then keyboard, then ambiguity, then dead ends. Combining them means finding only the first.',
    },
    { kind: 'heading', text: '3. Time the feedback' },
    {
      kind: 'paragraph',
      text: 'Anything over 100ms without acknowledgement is a defect regardless of total duration.',
    },
    { kind: 'heading', text: '4. Unplug the mouse' },
    {
      kind: 'paragraph',
      text: 'Complete the entire workflow. Every failure is a defect, not an inconvenience.',
    },
    { kind: 'heading', text: '5. Predict before clicking' },
    {
      kind: 'paragraph',
      text: 'For each control, state what will happen, then do it. Wrong predictions are ambiguity defects.',
    },
    { kind: 'heading', text: '6. Hunt dead ends deliberately' },
    {
      kind: 'paragraph',
      text: 'Force every error and every empty state. Each must offer a route forward.',
    },
  ],

  commonMistakes: [
    {
      id: 'mistake-audit-everything-at-once',
      mistake: 'Auditing interaction and visuals together.',
      why: 'Visual defects are more immediately visible, so behavioural ones are never looked for.',
      instead: 'Run separate passes with appearance suppressed.',
    },
    {
      id: 'mistake-mouse-only-audit',
      mistake: 'Auditing with the mouse available.',
      why: 'Keyboard failures are invisible when you never rely on the keyboard.',
      instead: 'Unplug the mouse for the keyboard pass.',
    },
    {
      id: 'mistake-disabled-no-reason',
      mistake: 'Disabled controls with no explanation.',
      why: 'The user cannot proceed and cannot discover why, which is a dead end that looks normal.',
      instead: 'Explain the condition, or keep the control enabled and explain on attempt.',
    },
    {
      id: 'mistake-untested-error-paths',
      mistake: 'Not forcing error and empty states during the audit.',
      why: 'Dead ends live almost exclusively in states that are hard to reach.',
      instead: 'Force every state deliberately and check each offers a route forward.',
    },
  ],

  eliteConsiderations: [
    {
      kind: 'list',
      items: [
        'Predict the outcome before every click; a wrong prediction is a defect even when the behaviour is defensible.',
        'Check focus after every state change, not only after opening overlays.',
        'Audit on a throttled connection; latency defects are invisible at local speed.',
        'Treat any hesitation of your own as a defect worth recording, even before you can name it.',
      ],
    },
  ],

  practicalExercise: {
    id: 'exercise-14-03',
    title: 'Audit one workflow without looking at visual aesthetics',
    prompt:
      'Run a four-pass interaction audit on one workflow with appearance deliberately suppressed.',
    steps: [
      'Suppress visuals: greyscale, low brightness, or screen reader navigation.',
      'Pass one: check every action is acknowledged within 100ms.',
      'Pass two: complete the workflow with the mouse unplugged.',
      'Pass three: predict each control\'s result before activating it and record wrong predictions.',
      'Pass four: force every error and empty state and check each offers a route forward.',
      'Repeat the feedback pass on a throttled connection.',
      'Record every defect with its category and severity.',
      'Fix every dead end before anything else.',
    ],
    successCriteria: [
      'Four passes were run separately with appearance suppressed.',
      'The workflow is completable with the mouse unplugged.',
      'Every wrong prediction is recorded as an ambiguity defect.',
      'No state lacks a route forward.',
      'The feedback pass was repeated under throttling.',
    ],
    estimatedMinutes: 55,
    hint: 'Predicting before clicking feels artificial and finds ambiguity defects nothing else does.',
  },

  reflectionQuestion: 'What makes an interaction feel unreliable?',
  reflectionHint: 'Predictability builds trust.',

  resources: [
    {
      id: 'resource-nngroup-response-14',
      title: 'Response times: the three important limits',
      url: 'https://www.nngroup.com/articles/response-times-3-important-limits/',
      type: 'article',
      estimatedMinutes: 10,
      note: 'The thresholds behind the feedback pass.',
    },
    {
      id: 'resource-wcag-focus-visible',
      title: 'WCAG: focus visible',
      url: 'https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html',
      type: 'specification',
      estimatedMinutes: 15,
      note: 'The requirement behind the keyboard pass.',
    },
  ],

  competencyTags: ['interaction-design', 'accessibility', 'critique', 'design-qa'],

  completionCriteria: [
    'A four-pass interaction audit was completed with visuals suppressed.',
    'The workflow is completable by keyboard alone.',
    'Every dead end was found and fixed.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Lesson 69                                                                   */
/* -------------------------------------------------------------------------- */

const LESSON_69: Lesson = {
  id: 'lesson-14-04',
  slug: 'simplifying-without-removing-capability',
  moduleId: MODULE_ID,
  lessonNumber: 4,
  title: 'Simplifying Without Removing Capability',
  summary:
    'Hiding a control does not simplify anything; it relocates the difficulty. Real simplification changes what the user has to decide.',
  estimatedMinutes: 9,

  objectives: [
    'Distinguish reduced complexity from relocated complexity.',
    'Use progressive disclosure where it genuinely helps.',
    'Choose defaults that remove decisions rather than deferring them.',
    'Place actions in the context where they are needed.',
  ],

  prerequisiteConcepts: ['Hierarchy', 'Interaction defects'],
  prerequisiteLessonIds: ['lesson-14-03'],

  recap: [
    {
      kind: 'paragraph',
      text: 'The previous two lessons found defects. This one is about a change that is frequently requested and frequently done badly.',
    },
  ],

  coreConcept: [
    {
      kind: 'paragraph',
      text: 'There are two very different operations that both get called simplification. One reduces the number of decisions a user must make. The other keeps every decision and hides some of them behind a disclosure.',
    },
    {
      kind: 'list',
      items: [
        'Better defaults — the decision is made correctly so most users never face it.',
        'Hierarchy — common things prominent, rare things present but quiet.',
        'Progressive disclosure — advanced options behind a labelled boundary.',
        'Contextual actions — controls placed where the relevant object is.',
      ],
    },
    {
      kind: 'paragraph',
      text: 'Only the first genuinely reduces complexity. The other three manage it, which is valuable — but managing complexity and removing it produce different results when someone actually needs the hidden thing.',
    },
    {
      kind: 'callout',
      tone: 'insight',
      body: 'Hidden complexity still has a cost: the search for where it went, plus the doubt about whether it exists at all.',
    },
  ],

  firstPrinciples: [
    {
      kind: 'paragraph',
      text: 'A good default is a decision made by someone with more information than the user has: aggregate behaviour, domain knowledge, an understanding of consequences. It removes the decision for everyone it suits.',
    },
    {
      kind: 'paragraph',
      text: 'A disclosure moves a decision without removing it. For the user who needs that option, the interface is now harder — they must find it, and first believe it exists. Disclosure is right when the option is genuinely rare and wrong when it is merely less common.',
    },
  ],

  designPerspective: [
    {
      kind: 'paragraph',
      text: 'Settings pages are where this is most visible. A long flat list of toggles is genuinely hard to use, but so is a page where everything is collapsed and nothing is findable.',
    },
    {
      kind: 'paragraph',
      text: 'What works is grouping by the user\'s concern rather than by the system\'s structure, with the most-changed settings visible and the rest grouped under headings that say what they contain. Search over settings is often worth more than any amount of reorganisation.',
    },
  ],

  engineeringPerspective: [
    {
      kind: 'code',
      language: 'md',
      caption: 'Deciding between a default, disclosure, and a contextual action.',
      code: `For each control, ask in order:

1. Can this be decided correctly for almost everyone?
   -> Make it a default and remove the control.
      (Genuine simplification.)

2. Is it needed rarely, by a minority, and is its absence discoverable?
   -> Progressive disclosure behind a specific label.
      (Managed complexity. Label must say what is inside.)

3. Is it only meaningful in the context of a specific object?
   -> Move it to that object.
      (Relocation that reduces search, not a hiding place.)

4. None of the above?
   -> It stays visible. Hiding it makes the interface worse.`,
    },
    {
      kind: 'paragraph',
      text: 'Disclosure labels carry most of the weight. "Advanced" tells the user nothing and forces them to open it to find out; "Notification frequency and quiet hours" lets them decide from outside.',
    },
  ],

  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'Choosing good defaults requires knowing what most users actually do, which requires either data or genuine domain understanding. It is the hardest and most valuable part of this work.',
    },
    {
      kind: 'paragraph',
      text: 'Hiding things is easy, looks like progress, and tends to move the difficulty to whoever needed the hidden option — usually the most engaged users.',
    },
  ],

  industryExamples: [
    {
      id: 'example-settings-search',
      source: 'Products with large settings surfaces',
      title: 'Search instead of hierarchy',
      observation:
        'Applications with many settings provide search over them, accepting that no hierarchy will match every user\'s mental model.',
      takeaway:
        'When organisation cannot solve findability, retrieval can.',
    },
    {
      id: 'example-sensible-defaults',
      source: 'Products with short setup flows',
      title: 'Defaults that remove setup entirely',
      observation:
        'Tools that feel simple frequently have as many options as competitors, with better defaults so most users never open them.',
      takeaway:
        'The perceived simplicity comes from decisions removed, not from features removed.',
    },
  ],

  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Simplifying a complex settings page.',
    },
    { kind: 'heading', text: '1. Inventory every setting' },
    {
      kind: 'paragraph',
      text: 'What it does, who changes it, and how often. The third column decides most of the work.',
    },
    { kind: 'heading', text: '2. Find the defaults' },
    {
      kind: 'paragraph',
      text: 'Anything almost everyone leaves alone or sets the same way is a default candidate. Removing the control is the only true simplification available.',
    },
    { kind: 'heading', text: '3. Group by the user\'s concern' },
    {
      kind: 'paragraph',
      text: 'Not by the system\'s architecture. "Notifications" is a concern; "Service integration settings" is an implementation detail.',
    },
    { kind: 'heading', text: '4. Disclose only the genuinely rare' },
    {
      kind: 'paragraph',
      text: 'With a label describing the contents specifically enough to decide from outside.',
    },
    { kind: 'heading', text: '5. Move the contextual ones' },
    {
      kind: 'paragraph',
      text: 'A per-project setting belongs on the project, not in a global list.',
    },
    { kind: 'heading', text: '6. Add search' },
    {
      kind: 'paragraph',
      text: 'Over labels and descriptions. It makes every organisational decision less costly when wrong.',
    },
    { kind: 'heading', text: '7. Count what was removed' },
    {
      kind: 'paragraph',
      text: 'Controls removed versus controls hidden. The first number is the real result.',
    },
  ],

  commonMistakes: [
    {
      id: 'mistake-hiding-as-simplifying',
      mistake: 'Collapsing controls and calling it simplification.',
      why: 'Every decision still exists, and the user who needs one now has to search for it.',
      instead: 'Remove decisions with defaults; disclose only what is genuinely rare.',
    },
    {
      id: 'mistake-advanced-label',
      mistake: 'Labelling a disclosure "Advanced".',
      why: 'It describes nothing, so users must open it to find out what is inside.',
      instead: 'Name the contents specifically.',
    },
    {
      id: 'mistake-system-grouping',
      mistake: 'Grouping settings by system architecture.',
      why: 'Users search by concern, not by which service implements the feature.',
      instead: 'Group by what the user is trying to achieve.',
    },
    {
      id: 'mistake-removing-capability',
      mistake: 'Removing an option rather than defaulting it.',
      why: 'The users who needed it lose the capability entirely, usually the most engaged ones.',
      instead: 'Default it well and keep it reachable.',
    },
  ],

  eliteConsiderations: [
    {
      kind: 'list',
      items: [
        'Count controls removed versus controls hidden; only the first is simplification.',
        'Add search over settings before reorganising them — it is usually cheaper and more effective.',
        'Make disclosure labels specific enough to decide from outside.',
        'Check that every hidden option is still discoverable by someone who does not know it exists.',
      ],
    },
  ],

  practicalExercise: {
    id: 'exercise-14-04',
    title: 'Simplify a complex settings page',
    prompt:
      'Simplify a settings surface by removing decisions rather than hiding controls.',
    steps: [
      'Inventory every setting with what it does, who changes it, and how often.',
      'Identify defaults that would let you remove a control entirely.',
      'Group the remainder by user concern rather than system structure.',
      'Disclose only genuinely rare options, with specific labels.',
      'Move contextual settings onto the objects they affect.',
      'Add search over labels and descriptions.',
      'Count controls removed versus controls hidden.',
      'Verify every remaining option is discoverable by someone who does not know it exists.',
    ],
    successCriteria: [
      'At least one control was removed via a default, not hidden.',
      'The removed-versus-hidden count is recorded.',
      'No disclosure is labelled generically.',
      'Grouping follows user concerns, not system structure.',
      'Every hidden option is discoverable without prior knowledge.',
    ],
    estimatedMinutes: 50,
    hint: 'Count removed versus hidden at the end. If hidden is much larger, nothing was simplified.',
  },

  reflectionQuestion:
    'What is the difference between simplicity and hiding complexity?',
  reflectionHint: 'Hidden complexity still has a cost.',

  resources: [
    {
      id: 'resource-progressive-disclosure',
      title: 'Progressive disclosure',
      url: 'https://www.nngroup.com/articles/progressive-disclosure/',
      type: 'article',
      estimatedMinutes: 15,
      note: 'When disclosure helps and when it relocates difficulty.',
    },
    {
      id: 'resource-defaults',
      title: 'The power of defaults',
      url: 'https://www.nngroup.com/articles/the-power-of-defaults/',
      type: 'article',
      estimatedMinutes: 10,
      note: 'Why a default is the strongest design decision available.',
    },
  ],

  competencyTags: [
    'product-thinking',
    'ux-reasoning',
    'interaction-design',
    'product-judgement',
  ],

  completionCriteria: [
    'At least one decision was removed via a default.',
    'Removed-versus-hidden counts are recorded.',
    'Every hidden option remains discoverable.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Lesson 70                                                                   */
/* -------------------------------------------------------------------------- */

const LESSON_70: Lesson = {
  id: 'lesson-14-05',
  slug: 'systematic-critique',
  moduleId: MODULE_ID,
  lessonNumber: 5,
  title: 'Systematic Critique',
  summary:
    'A fixed sequence produces better critique than expertise applied freely, because it stops you settling on the first thing you noticed.',
  estimatedMinutes: 9,

  objectives: [
    'Apply an eight-step critique sequence in order.',
    'Start from user intent rather than appearance.',
    'Separate observation from judgement from recommendation.',
    'Write critique that is actionable by someone who did not attend it.',
  ],

  prerequisiteConcepts: ['Visual and interaction audits', 'Simplification'],
  prerequisiteLessonIds: ['lesson-14-04'],

  recap: [
    {
      kind: 'paragraph',
      text: 'You can find visual and interaction defects. Critique is the discipline of evaluating a whole workflow without being captured by whichever defect you noticed first.',
    },
  ],

  coreConcept: [
    {
      kind: 'paragraph',
      text: 'Critique in a fixed order, because attention is drawn to the most visible problem and stops there. The sequence forces the fundamental questions before the surface ones.',
    },
    {
      kind: 'list',
      ordered: true,
      items: [
        'User goal — what is someone trying to achieve, and does this support it?',
        'Information — is what they need present, and is anything unnecessary?',
        'Hierarchy — does prominence match importance?',
        'Behaviour — do controls do what they appear to do?',
        'States — are loading, empty, error, and edge cases handled?',
        'Accessibility — keyboard, screen reader, contrast, zoom, motion.',
        'Performance — is it responsive under real conditions?',
        'Polish — consistency, transitions, details.',
      ],
    },
    {
      kind: 'paragraph',
      text: 'The order matters because a failure at step one invalidates everything after it. A beautifully polished screen that does not support the user\'s goal is not eighty percent right; the polish is effort spent on the wrong thing.',
    },
    {
      kind: 'callout',
      tone: 'insight',
      body: 'Starting with aesthetics means critiquing execution before establishing whether the thing being executed is right.',
    },
  ],

  firstPrinciples: [
    {
      kind: 'paragraph',
      text: 'Quality is only definable relative to purpose. A dense table is excellent for comparison and poor for a first-time user; the same surface is good or bad depending on what it is for.',
    },
    {
      kind: 'paragraph',
      text: 'Without establishing the goal first, critique degenerates into preference, and preference is not actionable because there is no shared standard to appeal to.',
    },
  ],

  designPerspective: [
    {
      kind: 'paragraph',
      text: 'Useful critique separates three things that are usually merged: what you observed, what you judge about it, and what you recommend. Merging them makes the observation arguable and the recommendation unmoored.',
    },
    {
      kind: 'paragraph',
      text: 'Separated, each can be evaluated on its own: the observation can be verified, the judgement can be discussed, and the recommendation can be accepted or replaced with a better one.',
    },
  ],

  engineeringPerspective: [
    {
      kind: 'code',
      language: 'md',
      caption: 'One critique entry, with the three parts kept apart.',
      code: `### 3. Hierarchy — Invoice list

**Observation**
Invoice number, amount, status, and date use the same size and weight.
Status is the only element with colour, and its swatch is 12px.

**Judgement**
The goal established in step 1 is "find overdue invoices quickly". Status is
the primary scanning target and is currently the least prominent element,
while invoice number — which is not scanned — takes equal visual weight.

**Recommendation**
Give status a text label at body weight with its indicator, reduce invoice
number to secondary emphasis, and right-align amounts with tabular figures
so magnitude is scannable. Status becomes the strongest element in the row.

**Confidence**
High — this follows from the stated goal, not from preference.`,
    },
    {
      kind: 'paragraph',
      text: 'The confidence line is worth including. It tells the reader which points to argue with and which to act on, and it forces the critic to be honest about which is which.',
    },
  ],

  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'A design engineer can critique across all eight steps, which is unusual. Most reviews cover appearance and behaviour or architecture and performance, but rarely all of it against one stated goal.',
    },
    {
      kind: 'paragraph',
      text: 'That breadth is the distinctive contribution: connecting a hierarchy problem to a scanning task to a rendering cost, in one document.',
    },
  ],

  industryExamples: [
    {
      id: 'example-structured-critique',
      source: 'Design teams with critique practices',
      title: 'Structure over free discussion',
      observation:
        'Teams that run structured critique — a stated goal, a fixed sequence, separated observation and recommendation — report more actionable outcomes than open review.',
      takeaway:
        'Without structure, the loudest observation dominates and the fundamentals go unexamined.',
    },
    {
      id: 'example-goal-first',
      source: 'Usability practice',
      title: 'Evaluation against a stated task',
      observation:
        'Usability evaluation always begins by defining the task, because a screen cannot be assessed without knowing what it is for.',
      takeaway:
        'The same requirement applies to critique, and is the step most often skipped.',
    },
  ],

  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Writing a professional critique of a mature product workflow.',
    },
    { kind: 'heading', text: '1. State the goal first' },
    {
      kind: 'paragraph',
      text: 'What is the user trying to achieve, in one sentence. Everything after this is measured against it.',
    },
    { kind: 'heading', text: '2. Use the product properly first' },
    {
      kind: 'paragraph',
      text: 'Complete the workflow several times before critiquing anything. First impressions are about novelty, not quality.',
    },
    { kind: 'heading', text: '3. Work the sequence in order' },
    {
      kind: 'paragraph',
      text: 'All eight steps, even where a step seems fine. Confirming a step is a finding.',
    },
    { kind: 'heading', text: '4. Separate the three parts' },
    {
      kind: 'paragraph',
      text: 'Observation, judgement, recommendation. Every entry, without exception.',
    },
    { kind: 'heading', text: '5. Tie every judgement to the goal' },
    {
      kind: 'paragraph',
      text: 'A judgement that cannot be traced back to step one is a preference. Mark it as such or remove it.',
    },
    { kind: 'heading', text: '6. State confidence' },
    {
      kind: 'paragraph',
      text: 'So the reader knows what to act on and what to discuss.',
    },
    { kind: 'heading', text: '7. Note what works' },
    {
      kind: 'paragraph',
      text: 'And why. A critique listing only problems teaches nothing about what to preserve.',
    },
  ],

  commonMistakes: [
    {
      id: 'mistake-aesthetics-first',
      mistake: 'Beginning with visual impressions.',
      why: 'Execution gets critiqued before establishing whether the thing executed is right.',
      instead: 'Start with the user goal and work the sequence in order.',
    },
    {
      id: 'mistake-merged-critique',
      mistake: 'Merging observation, judgement, and recommendation.',
      why: 'The observation becomes arguable and the recommendation loses its grounding.',
      instead: 'Separate all three in every entry.',
    },
    {
      id: 'mistake-preference-as-critique',
      mistake: 'Presenting preference as a finding.',
      why: 'It is not actionable and undermines the credibility of the well-grounded points.',
      instead: 'Tie every judgement to the stated goal, or mark it as preference.',
    },
    {
      id: 'mistake-problems-only',
      mistake: 'Listing only problems.',
      why: 'The reader cannot tell what to preserve, and may remove something that was working.',
      instead: 'Note what works and why it works.',
    },
  ],

  eliteConsiderations: [
    {
      kind: 'list',
      items: [
        'Use the product repeatedly before critiquing; first impressions measure novelty.',
        'State confidence per point so the reader knows what to act on.',
        'Critique the most-used flow rather than the most visible one.',
        'Write for someone who was not present — critique that needs you to explain it does not travel.',
      ],
    },
  ],

  practicalExercise: {
    id: 'exercise-14-05',
    title: 'Write a professional critique of one mature product workflow',
    prompt:
      'Critique a real workflow in a mature product using the eight-step sequence.',
    steps: [
      'Choose a real workflow in a product you did not build.',
      'Complete it several times before writing anything.',
      'State the user goal in one sentence.',
      'Work all eight steps in order, recording findings at each.',
      'Separate observation, judgement, and recommendation in every entry.',
      'Tie each judgement to the stated goal, or mark it as preference.',
      'State confidence for each point.',
      'Note at least three things that work well and why.',
      'Give it to someone who has not used the product and check it is actionable.',
    ],
    successCriteria: [
      'All eight steps are covered in order.',
      'Every entry separates observation, judgement, and recommendation.',
      'Every judgement traces to the stated goal or is marked as preference.',
      'Confidence is stated per point.',
      'Someone unfamiliar with the product found it actionable.',
    ],
    estimatedMinutes: 60,
    hint: 'Write the user goal before opening the product. It is the standard everything else is measured against.',
  },

  reflectionQuestion:
    'Why should critique begin with user intent rather than aesthetics?',
  reflectionHint: 'Quality depends on purpose.',

  resources: [
    {
      id: 'resource-nngroup-heuristic-eval',
      title: 'How to conduct a heuristic evaluation',
      url: 'https://www.nngroup.com/articles/how-to-conduct-a-heuristic-evaluation/',
      type: 'article',
      estimatedMinutes: 20,
      note: 'Structured evaluation against stated criteria.',
    },
    {
      id: 'resource-design-critique',
      title: 'Discussing design: the art of critique',
      url: 'https://www.nngroup.com/articles/design-critiques/',
      type: 'article',
      estimatedMinutes: 15,
      note: 'Separating observation from judgement in practice.',
    },
  ],

  competencyTags: ['ux-reasoning', 'critique', 'product-judgement'],

  completionCriteria: [
    'A full eight-step critique was written on a real workflow.',
    'Observation, judgement, and recommendation are separated throughout.',
    'It was validated as actionable by someone unfamiliar with the product.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Project                                                                     */
/* -------------------------------------------------------------------------- */

const PROJECT: ModuleProject = {
  id: 'project-14',
  slug: 'product-workflow-redesign',
  moduleId: MODULE_ID,
  title: 'Product Workflow Redesign',
  brief:
    'Select a real product workflow, document its existing behaviour and problems, design and implement a better version, and justify every change.',
  problem:
    'Redesign is the easiest work to do badly, because a new visual treatment always looks like progress. This project requires the opposite discipline: understand the existing design well enough to explain why each decision was made, identify problems that are demonstrable rather than aesthetic, and change only what the evidence supports. The hardest part is deciding what to leave alone.',
  objectives: [
    'Document an existing workflow accurately, including its constraints.',
    'Identify demonstrable problems rather than stylistic disagreements.',
    'Design and implement a version that measurably improves the stated goal.',
    'Justify every change, including the decision not to change things.',
  ],
  requirements: [
    'Documentation of existing behaviour, including every state.',
    'A problem list, each item grounded in the workflow\'s stated goal.',
    'Design rationale connecting each change to a problem.',
    'A working implementation of the new interaction.',
    'Before-and-after reasoning that a sceptical reader would accept.',
    'An explicit list of what you deliberately did not change, and why.',
  ],
  constraints: [
    'No change may be justified by aesthetics alone.',
    'The redesign must support the same capabilities; nothing may be quietly dropped.',
    'Every problem must be demonstrable, not asserted.',
    'The new version must pass a full four-pass design QA.',
  ],
  suggestedScope:
    'One workflow, three to five screens. Do not redesign a whole product — the deliverable is depth of reasoning about one flow.',
  deliverables: [
    'Documentation of the existing workflow and all its states.',
    'A problem list with evidence for each item.',
    'Design rationale mapping each change to a problem.',
    'The implemented workflow.',
    'Before-and-after reasoning with the goal stated up front.',
    'A list of deliberate non-changes with reasons.',
  ],
  completionCriteria: [
    'Every problem is demonstrable, not asserted as preference.',
    'Every change maps to a problem on the list.',
    'No capability present in the original is missing from the redesign.',
    'At least three deliberate non-changes are documented with reasons.',
    'The new version passes visual, interaction, responsive, and accessibility QA.',
  ],
  portfolioEvidence: [
    'Workflow analysis and documentation',
    'Evidence-based problem identification',
    'Design rationale',
    'Implementation of a redesigned interaction',
    'Restraint in scope',
  ],
  reflectionQuestion:
    'What did you want to change for aesthetic reasons, and what happened when you required evidence for it?',
  estimatedHours: 30,
  competencies: [
    'ux-reasoning',
    'visual-hierarchy',
    'interaction-design',
    'critique',
    'product-judgement',
    'design-qa',
  ],
  stretchGoals: [
    'Test both versions with someone unfamiliar and record where each caused hesitation.',
    'Measure task completion time for both and report it alongside the reasoning.',
  ],
};

/* -------------------------------------------------------------------------- */

export const MODULE_14: CurriculumModule = {
  id: MODULE_ID,
  slug: 'taste-critique-and-interface-refinement',
  moduleNumber: 14,
  phase: 'product-judgement',
  title: 'Taste, Critique and Interface Refinement',
  description:
    'What polish actually consists of, systematic methods for finding visual and interaction defects, simplification that removes decisions rather than hiding them, and a critique sequence that begins with purpose.',
  outcome: 'Can evaluate and refine interface quality systematically.',
  prerequisites: [
    'Modules 1 to 13, or equivalent',
    'Finished projects to audit and refine',
  ],
  lessons: [LESSON_66, LESSON_67, LESSON_68, LESSON_69, LESSON_70],
  resources: [
    {
      id: 'resource-module-14-nngroup-heuristics',
      title: '10 usability heuristics',
      url: 'https://www.nngroup.com/articles/ten-usability-heuristics/',
      type: 'article',
      estimatedMinutes: 25,
      note: 'The durable checklist behind most structured critique.',
    },
    {
      id: 'resource-module-14-refactoring-ui',
      title: 'Refactoring UI',
      url: 'https://www.refactoringui.com/',
      type: 'book',
      author: 'Adam Wathan and Steve Schoger',
      estimatedMinutes: 240,
      note: 'Specific, mechanical techniques for finding and fixing visual defects.',
    },
    {
      id: 'resource-module-14-wcag-quickref',
      title: 'How to meet WCAG (quick reference)',
      url: 'https://www.w3.org/WAI/WCAG22/quickref/',
      type: 'specification',
      estimatedMinutes: 60,
      note: 'The accessibility step of the critique sequence.',
    },
  ],
  project: PROJECT,
  competencies: [
    'product-thinking',
    'ux-reasoning',
    'visual-hierarchy',
    'typography',
    'colour',
    'layout',
    'interaction-design',
    'accessibility',
    'critique',
    'product-judgement',
    'design-qa',
  ],
  completionCriteria: [
    'All five lessons completed.',
    'Module project marked completed.',
    'Can critique and refine a workflow from evidence rather than preference.',
  ],
};
