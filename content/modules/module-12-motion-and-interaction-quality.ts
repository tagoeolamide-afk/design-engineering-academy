/**
 * Module 12 — Motion and Interaction Quality.
 *
 * Motion is placed after components, accessibility and data interfaces on
 * purpose. Animating a static page is decoration; animating a real interface
 * with loading states, focus management and async corrections is interaction
 * engineering, and only the second one is worth teaching.
 */

import type { CurriculumModule, Lesson, ModuleProject } from '@/types/curriculum';

const MODULE_ID = 'module-12';

/* -------------------------------------------------------------------------- */
/* Lesson 56                                                                   */
/* -------------------------------------------------------------------------- */

const LESSON_1: Lesson = {
  id: 'lesson-why-interfaces-move',
  slug: 'why-interfaces-move',
  moduleId: MODULE_ID,
  lessonNumber: 1,
  title: 'Why Interfaces Move',
  summary:
    'Motion has five jobs. Anything that does none of them is decoration, and decoration in an interface is a cost paid on every single use.',
  estimatedMinutes: 9,
  objectives: [
    'Name the job a given animation is doing.',
    'Distinguish motion that explains a change from motion that announces one.',
    'Identify animation that serves no purpose and remove it.',
    'Decide which changes in an interface deserve motion at all.',
  ],
  prerequisiteConcepts: [
    'Feedback and state change, Module 1 lesson 4',
    'Async states, Module 11 lesson 51',
    'Focus management, Module 9 lesson 42',
  ],
  prerequisiteLessonIds: [
    'lesson-optimistic-updates',
    'lesson-keyboard-and-focus',
  ],
  recap: [
    {
      kind: 'paragraph',
      text: 'Module 11 left you with an interface full of things appearing and disappearing — skeletons, refresh bars, rollback toasts, conflict dialogs. Every one of those is a change the user has to notice and understand.',
    },
  ],
  priorKnowledge: [
    {
      kind: 'paragraph',
      text: 'Module 1 lesson 4 established that feedback is what separates a working system from a broken-looking one. Module 11 lesson 55 added a harder case: a value that changes, then changes back.',
    },
    {
      kind: 'paragraph',
      text: 'Motion is how a user tells those two apart without reading anything.',
    },
  ],
  coreConcept: [
    {
      kind: 'paragraph',
      text: 'Motion in an interface does one of five jobs. If you cannot name which, the animation should not exist.',
    },
    {
      kind: 'list',
      ordered: true,
      items: [
        '**Feedback** — confirming the system received an action. A button depressing, a row flashing on save.',
        '**Causality** — showing that this change was caused by that action. The panel grows out of the button that opened it.',
        '**Orientation** — showing where you are and where you came from. A drawer sliding from the left stays conceptually on the left.',
        '**Continuity** — keeping an object the same object across a change, rather than destroying and recreating it.',
        '**Hierarchy** — ordering attention, so the important thing arrives first and the supporting detail follows.',
      ],
    },
    {
      kind: 'paragraph',
      text: 'Note what is absent: delight, personality, brand. Those can be consequences of motion done well. They are not jobs, because they give you no way to decide duration, easing, or whether to animate at all.',
    },
  ],
  whyDesignersCare: [
    {
      kind: 'paragraph',
      text: 'Because motion is the only design decision whose cost scales with how much people use the product.',
    },
    {
      kind: 'paragraph',
      text: 'A 400ms modal animation is charming the first time, acceptable the twentieth, and infuriating the two-hundredth. The user who loves your product most pays the most for it, which inverts the usual relationship between polish and appreciation.',
    },
    {
      kind: 'paragraph',
      text: 'This is why professional products tend to animate less than portfolio work, and faster. Restraint reads as confidence partly because it is also correct.',
    },
  ],
  howItWorks: [
    {
      kind: 'paragraph',
      text: 'The distinction that does the most work: motion can **announce** a change or **explain** it.',
    },
    {
      kind: 'paragraph',
      text: 'A toast fading in announces that something happened. A row animating from the list into the archive panel explains what happened, where the thing went, and that it still exists.',
    },
    {
      kind: 'code',
      language: 'css',
      code: '/* Announces: something arrived. Where from? Unclear. */\n.toast {\n  animation: fade-in 150ms ease-out;\n}\n\n/* Explains: this panel came from the button you pressed. */\n.panel {\n  transform-origin: var(--origin);\n  animation: grow-from-origin 180ms cubic-bezier(0.2, 0, 0, 1);\n}',
    },
    {
      kind: 'paragraph',
      text: '`transform-origin` set from the trigger’s position is the whole difference. The same duration and easing either explain the relationship or do not, depending on one property.',
    },
    {
      kind: 'paragraph',
      text: 'Explaining is more valuable and more expensive — it needs to know where the change came from, which means the animation depends on application state rather than only on CSS. Lesson 58 is about paying that cost well.',
    },
  ],
  firstPrinciples: [
    {
      kind: 'paragraph',
      text: 'Motion is how the eye tracks object identity, and that is not a metaphor.',
    },
    {
      kind: 'paragraph',
      text: 'When something moves continuously, perception treats it as one thing that moved. When it disappears here and appears there, perception treats it as two things. The interface can therefore tell the user "this is the same item, relocated" or "that is gone and this is new" — and get it wrong.',
    },
    {
      kind: 'callout',
      tone: 'insight',
      body: 'A list item that fades out and a replacement that fades in reads as deletion followed by creation. If the item was only reordered, the animation has said something false about the data.',
    },
    {
      kind: 'paragraph',
      text: 'This is why the Module 7 lesson 33 argument about keys and identity resurfaces here. A correct key is what lets the framework animate a move rather than an unmount and a mount — the data model and the motion are the same question.',
    },
  ],
  designPerspective: [
    {
      kind: 'paragraph',
      text: 'The design question is which changes are worth explaining.',
    },
    {
      kind: 'paragraph',
      text: 'Most are not. A value updating in a table does not need motion; the new number is the whole message. A row leaving the table does, because otherwise the user is left wondering whether they misread it.',
    },
    {
      kind: 'paragraph',
      text: 'A useful filter: would the user be momentarily confused without the animation? If yes, animate. If no, you are adding duration to something that was already clear.',
    },
  ],
  engineeringPerspective: [
    {
      kind: 'paragraph',
      text: 'The engineering question is what the animation costs per frame.',
    },
    {
      kind: 'paragraph',
      text: '`transform` and `opacity` can be handled by the compositor without recalculating layout. Animating `width`, `height`, `top` or `margin` forces layout on every frame, and layout is the expensive stage. Module 13 lesson 61 explains why; for now the rule is enough: animate transform and opacity, and reach for anything else only deliberately.',
    },
  ],
  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'The five jobs map onto states you have already enumerated.',
    },
    {
      kind: 'paragraph',
      text: 'Every transition in a Module 5 behaviour map is a candidate for motion, and the job tells you whether it deserves any. Idle to loading: feedback. Loading to success: hierarchy, so the content arrives before the chrome. Optimistic to rolled back: causality, because the user must understand that their change was undone rather than that the data was always this way.',
    },
  ],
  industryExamples: [
    {
      id: 'example-apple-hig-motion-purpose',
      source: 'Apple',
      title: 'Motion justified by communication',
      observation:
        'Apple’s Human Interface Guidelines frame motion as communicating status, relationships and action outcomes, and caution against animation that competes with content.',
      takeaway:
        'The guidance is written as constraints rather than encouragement, which tells you which direction most teams err in.',
    },
    {
      id: 'example-nng-animation-usability',
      source: 'Nielsen Norman Group',
      title: 'Animation measured against the task',
      observation:
        'Nielsen Norman Group finds animation useful for showing relationships and transitions, and harmful when it delays access to content or repeats on frequent actions.',
      takeaway:
        'The harm is specific and predictable: frequency and delay. Both are design decisions, not implementation details.',
    },
  ],
  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Audit the motion in something you have built, naming the job for each.',
    },
    {
      kind: 'paragraph',
      text: 'Take your Module 11 dashboard and list every animated change. For each, write the job and the frequency.',
    },
    {
      kind: 'code',
      language: 'markdown',
      code: '| Change | Job | Times per session | Verdict |\n| --- | --- | --- | --- |\n| Dialog opens | Causality | ~5 | Keep, 180ms |\n| Toast appears | Feedback | ~10 | Keep, 150ms |\n| Skeleton shimmer | Feedback | ~30 | Keep, but it must not pulse faster than the eye settles |\n| Row hover lift | None | ~400 | Remove — hover already changes the background |\n| Table re-sorts | Continuity | ~3 | Add — rows currently jump, which reads as new data |\n| Filter chip removed | Feedback | ~8 | Keep, 120ms |\n| Page transition fade | None | ~15 | Remove — it delays content and explains nothing |',
    },
  ],
  commonMistakes: [
    {
      id: 'mistake-12-01-animation-without-a-job',
      mistake: 'Animating a change because the change exists.',
      why: 'Every animation adds duration before the user can act, and a frequent one adds it repeatedly.',
      instead: 'Name the job first. No nameable job means no animation.',
    },
    {
      id: 'mistake-12-01-page-transitions',
      mistake: 'Adding a fade between pages or views.',
      why: 'It delays content on the single most frequent interaction in the product and explains no relationship.',
      instead:
        'Animate within a view, where there is a spatial relationship to show. Between views, get out of the way.',
    },
  ],
  professionalConsideration: [
    {
      kind: 'paragraph',
      text: 'The best motion work in a product is usually invisible, and that makes it hard to argue for.',
    },
    {
      kind: 'paragraph',
      text: 'Nobody notices that a dropdown grows from its trigger; they notice when it does not. This means motion is systematically under-credited in review and over-credited in portfolios, where showy animation photographs well. Being able to name the job for every animation is what lets you defend the quiet version against someone who wants it to be more impressive.',
    },
  ],
  goDeeper: [
    {
      kind: 'paragraph',
      text: 'Everything below was part of the walkthrough above. It is the detail that matters once the core idea has landed, and it is safe to skip on a first pass.',
    },
    {
      kind: 'paragraph',
      text: 'Two patterns usually fall out of this table. The highest-frequency animations are the ones most worth removing, and the missing animations are on the changes that genuinely confuse people.',
    },
    {
      kind: 'paragraph',
      text: 'The row hover lift is the characteristic case: it fires hundreds of times, does a job the background colour already does, and costs a repaint each time.',
    },
  ],
  practicalExercise: {
    id: 'exercise-why-interfaces-move',
    title: 'Audit the motion in a real interface',
    prompt:
      'Audit every animation in something you built and in a product you use, assigning each a job and a frequency, then act on the findings.',
    steps: [
      'List every animated change in your Module 11 dashboard.',
      'For each, name the job from the five, or write "none".',
      'Estimate how many times per session it fires.',
      'Remove every animation with no job, starting with the most frequent.',
      'Find at least two changes that confuse users without motion, and specify what should animate.',
      'Repeat the audit on a mature product you use daily.',
      'Write down one thing that product animates that you would not, and one it does not that you would.',
    ],
    successCriteria: [
      'Every animation has a named job or is marked as having none.',
      'Frequency is estimated for each.',
      'At least one jobless animation is removed.',
      'At least two missing animations are identified with their job.',
      'The external audit produces one disagreement in each direction, with reasoning.',
    ],
    estimatedMinutes: 60,
    hint: 'Sort your table by frequency before deciding anything. The animation you see four hundred times a session deserves far more scrutiny than the one you see twice.',
  },
  reflectionQuestion:
    'Why do the most-used products tend to animate less, and faster, than portfolio work?',
  reflectionHint:
    'Ask who pays the duration, and how often.',
  resources: [
    {
      id: 'resource-apple-hig-motion-12',
      title: 'Motion — Human Interface Guidelines',
      url: 'https://developer.apple.com/design/human-interface-guidelines/motion',
      type: 'documentation',
      author: 'Apple',
      estimatedMinutes: 25,
      note: 'Motion framed as communication, with explicit cautions. Read the cautions twice.',
    },
    {
      id: 'resource-nng-animation-usability-12',
      title: 'Animation for Attention and Comprehension',
      url: 'https://www.nngroup.com/articles/animation-usability/',
      type: 'article',
      author: 'Nielsen Norman Group',
      estimatedMinutes: 20,
      note: 'Where animation helps comprehension and where it costs time. Evidence rather than taste.',
    },
  ],
  competencyTags: ['motion', 'interaction-design', 'ux-reasoning', 'product-judgement'],
  completionCriteria: [
    'Can name the job any animation is doing.',
    'Removes animation that does no job.',
    'Distinguishes announcing a change from explaining one.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Lesson 57                                                                   */
/* -------------------------------------------------------------------------- */

const LESSON_2: Lesson = {
  id: 'lesson-timing-and-easing',
  slug: 'timing-and-easing',
  moduleId: MODULE_ID,
  lessonNumber: 2,
  title: 'Timing and Easing',
  summary:
    'Duration and easing are the two numbers that decide whether motion feels crisp or sluggish — and enter and exit should almost never use the same ones.',
  estimatedMinutes: 9,
  objectives: [
    'Choose a duration from the distance and the size of the moving element.',
    'Choose an easing curve from whether the motion is entering, exiting or both.',
    'Explain why exits are usually faster than entrances.',
    'Build a duration and easing scale as tokens.',
  ],
  prerequisiteConcepts: [
    'The five jobs of motion',
    'Design tokens, Module 10 lesson 46',
    'Transitions in CSS, Module 3',
  ],
  prerequisiteLessonIds: ['lesson-why-interfaces-move', 'lesson-design-tokens'],
  recap: [
    {
      kind: 'paragraph',
      text: 'You can decide whether a change deserves motion. This lesson is about the two values that decide how it feels once you have.',
    },
  ],
  priorKnowledge: [
    {
      kind: 'paragraph',
      text: 'Module 10 lesson 46 had you build finite scales as tokens because a finite set makes off-system values conspicuous. Duration and easing are scales like any other, and they are the ones most often left to whatever each developer typed.',
    },
  ],
  coreConcept: [
    {
      kind: 'paragraph',
      text: 'Duration follows **distance and size**. A small thing moving a short way should be fast; a large thing moving across the screen needs longer or it appears to teleport.',
    },
    {
      kind: 'code',
      language: 'css',
      code: ':root {\n  --duration-instant: 80ms;   /* colour, opacity on a small control */\n  --duration-fast:    120ms;  /* a chip appearing, a checkbox */\n  --duration-base:    180ms;  /* a dropdown, a tooltip */\n  --duration-slow:    240ms;  /* a dialog, a drawer */\n  --duration-slower:  320ms;  /* a full-width panel, a page-level sheet */\n}',
    },
    {
      kind: 'paragraph',
      text: 'Five values, with their intended use written beside them — the Module 10 lesson 47 standard for a foundation. Nothing in a product interface should need more than about 320ms, and most things want less than 200ms.',
    },
    {
      kind: 'paragraph',
      text: 'The reason the ceiling is that low: past roughly 300ms the user has finished deciding what to do next and is waiting for the interface to catch up. The animation stops being communication and becomes latency.',
    },
  ],
  whyDesignersCare: [
    {
      kind: 'paragraph',
      text: 'Because duration is the single biggest lever on whether a product feels fast, and it is free.',
    },
    {
      kind: 'paragraph',
      text: 'An interface with every animation at 300ms and one with every animation at 150ms are the same code doing the same work. One feels responsive and one feels heavy. No performance optimisation available to you has that effect for that little effort.',
    },
    {
      kind: 'paragraph',
      text: 'The common instinct, having built something, is to slow it down so the animation can be appreciated. That instinct is reliably wrong.',
    },
  ],
  howItWorks: [
    {
      kind: 'paragraph',
      text: 'Easing describes how speed changes over the duration, and three curves cover almost everything.',
    },
    {
      kind: 'list',
      items: [
        '**Ease-out** — fast at the start, slow at the end. For things **entering**. The element arrives immediately and settles, so the user perceives the beginning rather than the delay.',
        '**Ease-in** — slow at the start, fast at the end. For things **leaving**. The element departs and accelerates away.',
        '**Ease-in-out** — slow at both ends. For things **moving** from one place to another while remaining on screen.',
      ],
    },
    {
      kind: 'code',
      language: 'css',
      code: ':root {\n  /* Decelerate: enters. */\n  --ease-out: cubic-bezier(0.2, 0, 0, 1);\n  /* Accelerate: exits. */\n  --ease-in: cubic-bezier(0.4, 0, 1, 1);\n  /* Both: moves. */\n  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);\n}',
    },
    {
      kind: 'paragraph',
      text: 'Linear is absent on purpose. Nothing physical moves at a constant speed, so linear motion reads as mechanical — the one exception being a continuous indeterminate indicator like a spinner, which should be linear precisely because it is not meant to look like an object.',
    },
    {
      kind: 'paragraph',
      text: 'The pairing with duration is what people miss: **exits should be faster than entrances**.',
    },
    {
      kind: 'code',
      language: 'css',
      code: '.dialog {\n  transition:\n    opacity var(--duration-slow) var(--ease-out),\n    transform var(--duration-slow) var(--ease-out);\n}\n\n.dialog[data-state=\'closing\'] {\n  transition:\n    opacity var(--duration-fast) var(--ease-in),\n    transform var(--duration-fast) var(--ease-in);\n}',
    },
    {
      kind: 'paragraph',
      text: '240ms in, 120ms out. The entrance has something to communicate — where this came from, what it is. The exit has nothing to say; the user has already decided to dismiss it, and anything that delays getting back to work is in the way.',
    },
  ],
  firstPrinciples: [
    {
      kind: 'paragraph',
      text: '**Perceived speed** is not duration. It is when the user first sees evidence of progress.',
    },
    {
      kind: 'paragraph',
      text: 'An ease-out over 240ms covers more than half its distance in the first 80ms. An ease-in-out over the same 240ms barely moves in the first 80ms. Same duration, and the first feels roughly twice as fast.',
    },
    {
      kind: 'callout',
      tone: 'insight',
      body: 'This is why ease-out is the default for entrances rather than a stylistic preference. Front-loading the movement buys apparent speed without shortening the animation.',
    },
    {
      kind: 'paragraph',
      text: 'The same principle explains why a long animation with a slow start is the worst combination available, and why `ease-in` on an entrance — slow, then fast — feels broken even though it is a perfectly ordinary curve.',
    },
  ],
  designPerspective: [
    {
      kind: 'paragraph',
      text: 'The design question is whether the scale covers the product.',
    },
    {
      kind: 'paragraph',
      text: 'Build the scale, then go through every animated element and assign one value. Anything that does not fit is information: either the scale is missing a step, or that element is doing something unusual that deserves a second look. Both outcomes are useful, which is the argument for a finite scale in the first place.',
    },
  ],
  engineeringPerspective: [
    {
      kind: 'paragraph',
      text: 'The engineering question is where the duration lives.',
    },
    {
      kind: 'paragraph',
      text: 'In a token, referenced from CSS — and read from the same token by JavaScript if a timeout must match an animation. Hard-coding 240 in a `setTimeout` beside a 180ms CSS transition is how an element gets removed before it has finished animating, and the two values drift the moment either is tuned.',
    },
    {
      kind: 'code',
      language: 'ts',
      code: 'function durationToken(name: string): number {\n  const value = getComputedStyle(document.documentElement)\n    .getPropertyValue(name)\n    .trim();\n  return Number.parseFloat(value) || 0;   /* "180ms" → 180 */\n}',
    },
    {
      kind: 'paragraph',
      text: 'One source of truth. In practice, waiting for the `transitionend` event is better still, because it cannot disagree with the animation at all.',
    },
  ],
  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'Duration and easing are foundations in the Module 10 sense, and they are the ones most often missing from a design system.',
    },
    {
      kind: 'paragraph',
      text: 'A system with colour, spacing and type tokens but no motion tokens has left one visual dimension entirely ungoverned — and it is the dimension where inconsistency is most noticeable, because two dropdowns opening at different speeds in the same product is obvious in a way that two slightly different greys is not.',
    },
  ],
  industryExamples: [
    {
      id: 'example-material-motion-tokens',
      source: 'Material Design',
      title: 'Durations and easings published as tokens',
      observation:
        'Material Design 3 publishes named duration and easing tokens with specifications for which to use when, including separate emphasised and standard sets.',
      takeaway:
        'A production system treats motion exactly like colour: a finite named scale with usage guidance, not a value per component.',
    },
    {
      id: 'example-short-durations-feel-fast',
      source: 'Common practice',
      title: 'Short durations as a product characteristic',
      observation:
        'Products with reputations for feeling fast tend to use animations well under 200ms, with exits shorter than entrances.',
      takeaway:
        'The feeling of speed is largely a motion decision rather than a performance one. The code is not faster; the waiting is shorter.',
    },
  ],
  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Tune one component properly, then generalise.',
    },
    {
      kind: 'paragraph',
      text: 'Take the Module 8 Dialog. Start it at 400ms ease-in-out both ways — deliberately wrong — then fix it in four steps and watch each one.',
    },
    {
      kind: 'list',
      ordered: true,
      items: [
        '400ms ease-in-out both ways. Sluggish; the dialog seems reluctant.',
        'Change the entrance to ease-out. Noticeably faster at the same duration, because the movement is front-loaded.',
        'Cut the entrance to 240ms. Crisp, and nothing is lost.',
        'Cut the exit to 120ms with ease-in. Dismissing now feels immediate.',
      ],
    },
    {
      kind: 'code',
      language: 'css',
      code: '.dialog-overlay {\n  transition: opacity var(--duration-base) var(--ease-out);\n}\n\n.dialog {\n  transition:\n    opacity var(--duration-base) var(--ease-out),\n    transform var(--duration-slow) var(--ease-out);\n  transform: translateY(0) scale(1);\n}\n\n.dialog[data-state=\'closed\'] {\n  opacity: 0;\n  transform: translateY(8px) scale(0.98);\n}',
    },
    {
      kind: 'paragraph',
      text: 'Three details worth noticing. The overlay fades faster than the dialog moves, so the backdrop is established before the content arrives — that is hierarchy, the fifth job.',
    },
  ],
  commonMistakes: [
    {
      id: 'mistake-12-02-same-timing-both-ways',
      mistake: 'Using one duration and one easing for both enter and exit.',
      why: 'The exit then delays the user after they have already decided to dismiss, which is the most annoying place to spend time.',
      instead: 'Exits roughly half the duration of entrances, with ease-in rather than ease-out.',
    },
    {
      id: 'mistake-12-02-durations-too-long',
      mistake: 'Animations in the 300–500ms range for ordinary interface changes.',
      why: 'Past about 300ms the user is waiting rather than reading, so the animation has become latency.',
      instead: 'Start at 180ms and justify anything longer by distance or size.',
    },
  ],
  professionalConsideration: [
    {
      kind: 'paragraph',
      text: 'Motion is the one visual dimension where your own judgement is systematically miscalibrated.',
    },
    {
      kind: 'paragraph',
      text: 'You have seen your animation hundreds of times while building it, so it feels fast to you and slow to everyone else — and because you built it, you want it to be visible. The correction is mechanical rather than aesthetic: pick the duration from the scale by distance, not by how it feels on the fiftieth viewing, and have someone who has not seen it tell you whether it is too slow.',
    },
  ],
  goDeeper: [
    {
      kind: 'paragraph',
      text: 'Everything below was part of the walkthrough above. It is the detail that matters once the core idea has landed, and it is safe to skip on a first pass.',
    },
    {
      kind: 'paragraph',
      text: 'The transform is 8px and 2%, not 40px and 20%. A small offset reads as settling into place; a large one reads as flying in, which is a different and usually unwanted statement.',
    },
    {
      kind: 'paragraph',
      text: 'And the closed state is the one that is offset, so the open state is the resting position with no transform — which keeps the element unmoved and crisp when it is not animating.',
    },
  ],
  practicalExercise: {
    id: 'exercise-timing-and-easing',
    title: 'Build a motion scale and apply it',
    prompt:
      'Build duration and easing tokens, then apply them across every animated element you have, with enter and exit distinguished.',
    steps: [
      'Define a duration scale of about five values with the intended use for each.',
      'Define three easing curves and state which direction each is for.',
      'Apply them to every animated element in your Module 8 library and Module 11 dashboard.',
      'Make every exit faster than its entrance, and use ease-in for exits.',
      'Find anything that does not fit the scale and resolve it — new step, or reconsider the element.',
      'Build a page showing each duration side by side on the same distance.',
      'Do the four-step dialog exercise and record what each change did.',
      'Have someone who has not seen it tell you which animations are too slow.',
    ],
    successCriteria: [
      'Duration and easing exist as tokens with documented use.',
      'No hard-coded duration or easing anywhere.',
      'Every exit is faster than its entrance and uses ease-in.',
      'Nothing is above about 320ms without a stated reason.',
      'Any value outside the scale is resolved rather than added locally.',
      'External feedback is collected and acted on.',
    ],
    estimatedMinutes: 70,
    hint: 'The comparison page is worth building properly. Durations are almost impossible to judge in isolation and obvious side by side on the same distance.',
  },
  reflectionQuestion:
    'Why does ease-out at 240ms feel faster than ease-in-out at 240ms, when both take exactly the same time?',
  reflectionHint:
    'Ask when the user first sees evidence that something is happening.',
  resources: [
    {
      id: 'resource-material-motion-tokens-12',
      title: 'Easing and duration tokens — Material Design 3',
      url: 'https://m3.material.io/styles/motion/easing-and-duration/tokens-specs',
      type: 'documentation',
      author: 'Material Design',
      estimatedMinutes: 25,
      note: 'Published motion tokens with usage specifications. The closest thing to a reference scale.',
    },
    {
      id: 'resource-mdn-easing-function-12',
      title: 'easing-function',
      url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/easing-function',
      type: 'documentation',
      author: 'MDN',
      estimatedMinutes: 20,
      note: 'Every curve available, including steps. Use the interactive examples to feel the difference.',
    },
  ],
  competencyTags: ['motion', 'interaction-engineering', 'design-systems', 'css', 'interaction-design'],
  completionCriteria: [
    'Chooses duration from distance and size.',
    'Uses ease-out for entrances and ease-in for exits.',
    'Holds duration and easing as tokens, not literals.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Lesson 58                                                                   */
/* -------------------------------------------------------------------------- */

const LESSON_3: Lesson = {
  id: 'lesson-spatial-continuity',
  slug: 'spatial-continuity',
  moduleId: MODULE_ID,
  lessonNumber: 3,
  title: 'Spatial Continuity',
  summary:
    'Motion that explains rather than announces: the panel grows from the button, the thumbnail becomes the full image, and the list reorders without the user losing their place.',
  estimatedMinutes: 10,
  objectives: [
    'Animate from an origin so the cause of a change is visible.',
    'Build a shared-element transition between two states.',
    'Use transform rather than layout properties to move things.',
    'Keep object identity across a reorder.',
  ],
  prerequisiteConcepts: [
    'Timing and easing',
    'Keys and identity, Module 7 lesson 33',
    'Transform and the box model, Module 3',
  ],
  prerequisiteLessonIds: ['lesson-timing-and-easing'],
  recap: [
    {
      kind: 'paragraph',
      text: 'Lesson 56 distinguished announcing a change from explaining one, and said explaining costs more because it needs to know where the change came from. This lesson pays that cost.',
    },
  ],
  priorKnowledge: [
    {
      kind: 'paragraph',
      text: 'You know `transform` moves an element without affecting layout, and that a correct `key` tells React an item is the same item. Both are about to do more work than they have so far.',
    },
  ],
  coreConcept: [
    {
      kind: 'paragraph',
      text: 'Spatial continuity means an element has an **origin** and a **destination** the user can perceive, so the change is understood rather than merely noticed.',
    },
    {
      kind: 'paragraph',
      text: 'The simplest version costs one CSS property. A dropdown that grows from its trigger rather than fading in place has explained its own existence.',
    },
    {
      kind: 'code',
      language: 'tsx',
      code: 'function Dropdown({ triggerRef, isOpen, children }: DropdownProps) {\n  /* Where the menu should appear to come from. */\n  const origin = useMemo(() => {\n    const rect = triggerRef.current?.getBoundingClientRect();\n    if (rect === undefined) return \'top left\';\n    return `${rect.width / 2}px 0px`;\n  }, [triggerRef, isOpen]);\n\n  return (\n    <div\n      className="menu"\n      data-state={isOpen ? \'open\' : \'closed\'}\n      style={{ transformOrigin: origin }}\n    >\n      {children}\n    </div>\n  );\n}',
    },
    {
      kind: 'code',
      language: 'css',
      code: '.menu {\n  transition:\n    opacity var(--duration-fast) var(--ease-out),\n    transform var(--duration-base) var(--ease-out);\n}\n\n.menu[data-state=\'closed\'] {\n  opacity: 0;\n  transform: scale(0.96) translateY(-4px);\n}',
    },
    {
      kind: 'paragraph',
      text: 'A 4% scale and 4px offset, anchored at the trigger. Barely visible frame by frame, and the difference between a menu that belongs to a button and one that happens to be near it.',
    },
  ],
  whyDesignersCare: [
    {
      kind: 'paragraph',
      text: 'Because losing your place is the most disorienting thing an interface can do, and reordering does it constantly.',
    },
    {
      kind: 'paragraph',
      text: 'A user sorts a table. Every row is now somewhere else, instantly. They were looking at a particular row and it is gone — not removed, relocated, but perception cannot tell which. They have to re-find it by reading.',
    },
    {
      kind: 'paragraph',
      text: 'Animate the rows to their new positions and the eye follows the one it was watching. Same data, same sort, and the user never lost the thread.',
    },
  ],
  howItWorks: [
    {
      kind: 'paragraph',
      text: 'A **shared element transition** is the strongest version: the same object appears to persist across two different states.',
    },
    {
      kind: 'paragraph',
      text: 'A thumbnail in a grid becomes the header image of a detail view. The classic technique is to measure both positions and animate the difference.',
    },
    {
      kind: 'code',
      language: 'ts',
      code: 'function animateBetween(from: DOMRect, element: HTMLElement, durationMs: number) {\n  const to = element.getBoundingClientRect();\n\n  /* Invert: place the element where it used to be … */\n  const deltaX = from.left - to.left;\n  const deltaY = from.top - to.top;\n  const scaleX = from.width / to.width;\n  const scaleY = from.height / to.height;\n\n  /* … then play it back to its real position. */\n  element.animate(\n    [\n      { transform: `translate(${deltaX}px, ${deltaY}px) scale(${scaleX}, ${scaleY})` },\n      { transform: \'none\' },\n    ],\n    { duration: durationMs, easing: \'cubic-bezier(0.2, 0, 0, 1)\' },\n  );\n}',
    },
    {
      kind: 'paragraph',
      text: 'This is the FLIP approach — First, Last, Invert, Play. You let the browser lay the element out in its final position, work out the transform that would put it back where it started, and animate that transform away.',
    },
    {
      kind: 'paragraph',
      text: 'The reason for the inversion is the whole point: the only thing animating is `transform`, so no layout is recalculated per frame. Animating `left`, `top`, `width` and `height` directly would produce the same visual result at several times the cost.',
    },
    {
      kind: 'paragraph',
      text: 'The View Transitions API now does much of this natively, and is worth knowing about — though support and framework integration are still uneven enough that the manual technique remains the reliable one.',
    },
  ],
  firstPrinciples: [
    {
      kind: 'paragraph',
      text: 'The principle: **the browser should lay out once and animate transforms**.',
    },
    {
      kind: 'paragraph',
      text: 'Every spatial animation worth building reduces to measuring positions, computing a transform, and animating that. The measurement happens once; the animation touches no layout at all.',
    },
    {
      kind: 'callout',
      tone: 'pitfall',
      body: 'Measuring forces a synchronous layout, so measuring inside a loop — read, write, read, write — makes the browser recalculate repeatedly. Read every position first, then write every transform. Module 13 lesson 61 names this layout thrashing.',
    },
    {
      kind: 'paragraph',
      text: 'That read-then-write ordering is the difference between a reorder animation that runs at 60fps and one that stutters on a list of forty rows.',
    },
  ],
  designPerspective: [
    {
      kind: 'paragraph',
      text: 'The design question is where things should come from.',
    },
    {
      kind: 'paragraph',
      text: 'A drawer triggered by a left-hand nav item should come from the left. A sheet triggered by a bottom action should rise. A dialog with no spatial source should scale from the centre, because inventing an origin it does not have is worse than having none.',
    },
    {
      kind: 'paragraph',
      text: 'Consistency matters more than correctness here: a product where panels always come from where you pressed is learnable, even if a given choice is arguable.',
    },
  ],
  engineeringPerspective: [
    {
      kind: 'paragraph',
      text: 'The engineering question is what happens when the animation is interrupted.',
    },
    {
      kind: 'paragraph',
      text: 'A user opens a menu and closes it 60ms later. A naive implementation starts the close animation from the fully open position, so the menu appears to jump open before closing. CSS transitions handle this correctly by interpolating from the current computed value; hand-rolled keyframe animations generally do not, unless you read the current transform and start from there.',
    },
    {
      kind: 'paragraph',
      text: 'This is the main practical argument for CSS transitions over imperative animation for simple state changes: interruption is handled for you.',
    },
  ],
  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'Spatial continuity is where the data model becomes visible.',
    },
    {
      kind: 'paragraph',
      text: 'A reorder can only be animated if the framework knows the rows are the same rows, which requires the stable keys from Module 7 lesson 33. With index keys, React believes every row became a different row, and no animation can repair a model that has already decided the items are new.',
    },
  ],
  industryExamples: [
    {
      id: 'example-view-transitions-api',
      source: 'MDN',
      title: 'Shared elements as a platform feature',
      observation:
        'The View Transitions API lets the browser animate between two states, matching elements by a shared name across the change.',
      takeaway:
        'The pattern was common enough to become a platform primitive. Reading its model is a good way to understand what the manual technique is approximating.',
    },
    {
      id: 'example-platform-shared-geometry',
      source: 'Platform convention',
      title: 'Hierarchy expressed through space',
      observation:
        'Platform navigation conventionally pushes a detail view in from the side it will return to, so forward and back are spatially opposite.',
      takeaway:
        'The spatial model teaches the hierarchy. Users learn where "back" is without being told, because the motion has been consistent.',
    },
  ],
  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Animate a table reorder with FLIP, reading before writing.',
    },
    {
      kind: 'code',
      language: 'ts',
      code: 'function animateReorder(container: HTMLElement, applySort: () => void) {\n  const rows = [...container.querySelectorAll<HTMLElement>(\'[data-row-id]\')];\n\n  /* 1. READ every position first. One layout. */\n  const before = new Map<string, DOMRect>();\n  for (const row of rows) {\n    const id = row.dataset.rowId;\n    if (id !== undefined) before.set(id, row.getBoundingClientRect());\n  }\n\n  /* 2. Change the order. */\n  applySort();\n\n  /* 3. READ the new positions. One more layout. */\n  const after = new Map<string, DOMRect>();\n  const current = [...container.querySelectorAll<HTMLElement>(\'[data-row-id]\')];\n  for (const row of current) {\n    const id = row.dataset.rowId;\n    if (id !== undefined) after.set(id, row.getBoundingClientRect());\n  }\n\n  /* 4. WRITE every animation. No further layout. */\n  for (const row of current) {\n    const id = row.dataset.rowId;\n    if (id === undefined) continue;\n\n    const from = before.get(id);\n    const to = after.get(id);\n    if (from === undefined || to === undefined) continue;\n\n    const deltaY = from.top - to.top;\n    if (Math.abs(deltaY) < 1) continue;   /* did not really move */\n\n    row.animate(\n      [{ transform: `translateY(${deltaY}px)` }, { transform: \'none\' }],\n      { duration: 240, easing: \'cubic-bezier(0.4, 0, 0.2, 1)\' },\n    );\n  }\n}',
    },
    {
      kind: 'paragraph',
      text: 'Reads are batched, then writes are batched. Two layouts total rather than one per row, which is what keeps a forty-row reorder smooth.',
    },
    {
      kind: 'paragraph',
      text: 'Rows matched by id, so a row that moved animates and a row that did not is skipped — the `Math.abs(deltaY) < 1` guard. Animating zero-distance moves wastes work and can produce a visible flicker.',
    },
  ],
  commonMistakes: [
    {
      id: 'mistake-12-03-animating-layout-properties',
      mistake: 'Animating `top`, `left`, `width` or `height` to move something.',
      why: 'Each frame forces a layout recalculation, so the animation stutters on anything but a trivial page.',
      instead: 'Measure, then animate `transform`. Same visual result, a fraction of the cost.',
    },
    {
      id: 'mistake-12-03-read-write-interleaved',
      mistake: 'Measuring and animating each element inside one loop.',
      why: 'Every read after a write forces a synchronous layout, so the cost grows with the number of elements.',
      instead: 'Read all positions, then write all animations. Two layouts regardless of row count.',
    },
  ],
  professionalConsideration: [
    {
      kind: 'paragraph',
      text: 'Shared element transitions are the highest-effort, highest-risk motion work in a product.',
    },
    {
      kind: 'paragraph',
      text: 'They need two components to agree about geometry, they break when either layout changes, and they are the first thing to look wrong on an unexpected screen size. Done well they are the most impressive motion in an interface; done at 80% they are conspicuously broken. The reorder animation in this lesson delivers most of the perceptual benefit for a fraction of the fragility, which is usually the better trade.',
    },
  ],
  goDeeper: [
    {
      kind: 'paragraph',
      text: 'Everything below was part of the walkthrough above. It is the detail that matters once the core idea has landed, and it is safe to skip on a first pass.',
    },
    {
      kind: 'paragraph',
      text: 'Ease-in-out here, not ease-out, because the rows are *moving* rather than entering: they exist before and after, and acceleration at both ends reads as a journey rather than an arrival.',
    },
    {
      kind: 'paragraph',
      text: 'One honest limitation: rows entering or leaving the sort are not handled — `before.get(id)` is undefined for a new row and it simply appears. Handling enter and exit alongside the move is the harder half, and a good extension.',
    },
  ],
  practicalExercise: {
    id: 'exercise-spatial-continuity',
    title: 'Build origin-aware and reorder motion',
    prompt:
      'Make three changes in your interface spatially continuous: a panel from its trigger, a table reorder, and one shared element.',
    steps: [
      'Make your Dropdown and Dialog animate from the control that opened them.',
      'Animate a table reorder with FLIP, batching all reads before all writes.',
      'Verify the reorder stays smooth at forty rows or more.',
      'Add the enter and exit cases for rows that join or leave the sort.',
      'Build one shared element transition between two views.',
      'Interrupt each animation halfway and confirm nothing jumps.',
      'Replace one transform animation with a layout-property version and compare in the Performance panel.',
      'Write down where the shared element breaks, and at what size.',
    ],
    successCriteria: [
      'Panels animate from their trigger, not from nowhere.',
      'The reorder batches reads before writes and stays smooth at scale.',
      'Rows entering and leaving the sort are handled.',
      'One shared element transition works.',
      'Interrupting any animation produces no jump.',
      'The transform-versus-layout comparison is measured, not assumed.',
      'The shared element’s failure cases are documented.',
    ],
    estimatedMinutes: 95,
    hint: 'Build the interruption test before the shared element. Half-finished animations are where most motion bugs live, and they are invisible if you only ever click once and wait.',
  },
  reflectionQuestion:
    'Why does animating `transform` cost so much less than animating `top` for the same visual movement?',
  reflectionHint:
    'Ask which rendering stages each one forces the browser to redo on every frame.',
  resources: [
    {
      id: 'resource-mdn-view-transitions-12',
      title: 'View Transitions API',
      url: 'https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API',
      type: 'documentation',
      author: 'MDN',
      estimatedMinutes: 35,
      note: 'The platform approach to shared elements. Read it for the model even if you implement manually.',
    },
    {
      id: 'resource-mdn-web-animations-12',
      title: 'Web Animations API',
      url: 'https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API',
      type: 'documentation',
      author: 'MDN',
      estimatedMinutes: 35,
      note: 'The `element.animate()` interface used throughout this lesson, including cancelling and inspecting running animations.',
    },
  ],
  competencyTags: ['motion', 'interaction-engineering', 'browser-apis', 'performance', 'css'],
  completionCriteria: [
    'Animates from a real origin rather than from nowhere.',
    'Uses FLIP with reads batched before writes.',
    'Can explain why transform is cheap and layout properties are not.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Lesson 59                                                                   */
/* -------------------------------------------------------------------------- */

const LESSON_4: Lesson = {
  id: 'lesson-direct-manipulation-and-gestures',
  slug: 'direct-manipulation-and-gestures',
  moduleId: MODULE_ID,
  lessonNumber: 4,
  title: 'Direct Manipulation and Gestures',
  summary:
    'When the user moves something with their finger or pointer, the interface stops animating and starts following — and everything about thresholds, velocity and snap-back follows from that.',
  estimatedMinutes: 10,
  objectives: [
    'Build a drag interaction that follows the pointer one-to-one.',
    'Choose thresholds that distinguish a gesture from an accident.',
    'Use velocity so a flick and a slow drag behave differently.',
    'Provide a keyboard equivalent for every gesture.',
  ],
  prerequisiteConcepts: [
    'Spatial continuity',
    'Pointer and keyboard events, Module 4 lesson 17',
    'Keyboard operability, Module 9 lesson 42',
  ],
  prerequisiteLessonIds: ['lesson-spatial-continuity'],
  recap: [
    {
      kind: 'paragraph',
      text: 'Everything so far has been motion the system plays. This lesson is motion the user drives, which inverts who is in control.',
    },
  ],
  priorKnowledge: [
    {
      kind: 'paragraph',
      text: 'Module 4 lesson 17 covered events. Module 9 lesson 45 established that anything reachable only by pointer is a defect. Both constrain this lesson heavily: a gesture is a pointer-only interaction unless you do something about it.',
    },
  ],
  coreConcept: [
    {
      kind: 'paragraph',
      text: 'Direct manipulation means the element tracks the input **exactly**, with no easing, no duration and no delay.',
    },
    {
      kind: 'paragraph',
      text: 'While a finger is down, the thing under it moves with it. Any smoothing at all reads as lag, because the user has a physical reference — their own hand — for where it should be.',
    },
    {
      kind: 'code',
      language: 'ts',
      code: 'function onPointerDown(event: PointerEvent) {\n  const element = event.currentTarget as HTMLElement;\n\n  /* All later events for this pointer come to us, even outside the element. */\n  element.setPointerCapture(event.pointerId);\n\n  const startX = event.clientX;\n  /* No transition while dragging — the element must not lag the finger. */\n  element.style.transition = \'none\';\n\n  function onMove(moveEvent: PointerEvent) {\n    const deltaX = moveEvent.clientX - startX;\n    element.style.transform = `translateX(${deltaX}px)`;\n  }\n\n  function onUp(upEvent: PointerEvent) {\n    element.removeEventListener(\'pointermove\', onMove);\n    element.removeEventListener(\'pointerup\', onUp);\n    element.style.transition = \'\';           /* restore, so release animates */\n    settle(element, upEvent.clientX - startX);\n  }\n\n  element.addEventListener(\'pointermove\', onMove);\n  element.addEventListener(\'pointerup\', onUp);\n}',
    },
    {
      kind: 'paragraph',
      text: 'Three things matter here. `setPointerCapture` means the drag continues when the finger leaves the element — without it, a fast drag silently stops.',
    },
    {
      kind: 'paragraph',
      text: '`transition: none` during the drag and restored on release: following is instant, settling is animated. And pointer events cover mouse, touch and pen in one code path, which is why they are preferable to separate mouse and touch handlers.',
    },
  ],
  whyDesignersCare: [
    {
      kind: 'paragraph',
      text: 'Because a gesture that triggers accidentally is worse than no gesture.',
    },
    {
      kind: 'paragraph',
      text: 'Swipe-to-delete with a 20px threshold means scrolling a list occasionally deletes something. The user learns to be careful, which means they have learned to distrust the list.',
    },
    {
      kind: 'paragraph',
      text: 'Thresholds are therefore a design decision about how confident the interface must be before it acts — and a destructive gesture needs to be much more certain than a reversible one.',
    },
  ],
  howItWorks: [
    {
      kind: 'paragraph',
      text: 'Three thresholds decide whether a gesture happened.',
    },
    {
      kind: 'list',
      items: [
        '**Activation** — how far before this counts as a drag rather than a tap. Around 8–10px; below that, finger tremor triggers it.',
        '**Direction lock** — once movement is clearly horizontal, ignore vertical, and vice versa. Without this, a swipe fights the scroll.',
        '**Commit** — how far, or how fast, before releasing performs the action rather than snapping back. Often around 40% of the width, lowered by velocity.',
      ],
    },
    {
      kind: 'code',
      language: 'ts',
      code: 'const ACTIVATE_PX = 8;\nconst COMMIT_FRACTION = 0.4;\nconst FLICK_VELOCITY = 0.5;   /* px per ms */\n\nfunction settle(element: HTMLElement, deltaX: number, velocityX: number) {\n  const width = element.offsetWidth;\n\n  /* A fast flick commits from a shorter distance than a slow drag. */\n  const isFlick = Math.abs(velocityX) > FLICK_VELOCITY;\n  const threshold = isFlick ? width * 0.15 : width * COMMIT_FRACTION;\n\n  if (Math.abs(deltaX) > threshold) {\n    commit(element, Math.sign(deltaX));\n  } else {\n    snapBack(element);\n  }\n}',
    },
    {
      kind: 'paragraph',
      text: 'Velocity is what makes a gesture feel physical. A short fast flick should commit; a long slow drag that stops short should not. Distance alone fails both: the flick snaps back when the user clearly meant it, and the hesitant drag commits when they were still deciding.',
    },
    {
      kind: 'paragraph',
      text: 'Velocity needs to be measured over the last few events rather than the whole gesture, or a drag that paused and then flicked reports an average that reflects neither.',
    },
  ],
  firstPrinciples: [
    {
      kind: 'paragraph',
      text: '**Snap-back is feedback**, not a failure state.',
    },
    {
      kind: 'paragraph',
      text: 'When a gesture does not commit, the element returning to rest tells the user the system saw the gesture and judged it incomplete. A silent return to position, or worse an instant jump, reads as the gesture not registering at all.',
    },
    {
      kind: 'paragraph',
      text: 'So the snap-back is animated — ease-out, short, roughly 180ms — and the commit is also animated, continuing in the direction of travel. Both are motion explaining a decision.',
    },
    {
      kind: 'callout',
      tone: 'insight',
      body: 'Constraints are feedback too. An element that resists past its limit — moving less than the finger does — tells the user they have reached the end without an error message. Letting it follow freely and then jump back says nothing until it is over.',
    },
  ],
  designPerspective: [
    {
      kind: 'paragraph',
      text: 'The design question is whether the gesture is discoverable.',
    },
    {
      kind: 'paragraph',
      text: 'Gestures are invisible. Nobody swipes a list item speculatively, so a swipe-only action is an action most users never find. The usual answer is that a gesture is an accelerator for something also available as a visible control — never the only route.',
    },
    {
      kind: 'paragraph',
      text: 'This is also the accessibility answer, which is a useful coincidence rather than a trade-off.',
    },
  ],
  engineeringPerspective: [
    {
      kind: 'paragraph',
      text: 'The engineering question is the keyboard equivalent.',
    },
    {
      kind: 'paragraph',
      text: 'A drag-to-reorder list needs a keyboard path: focus a row, enter a reorder mode, move it with arrow keys, confirm with Enter, cancel with Escape — and the position must be announced as it changes, or a screen reader user has moved something to a place they cannot perceive.',
    },
    {
      kind: 'paragraph',
      text: 'The ARIA Authoring Practices Guide has a rearrangeable listbox example that specifies exactly this. Building reorder without it produces a feature half your users cannot operate.',
    },
  ],
  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'Gestures are where motion and accessibility are most obviously the same problem.',
    },
    {
      kind: 'paragraph',
      text: 'The visible element following a finger and the announced position following an arrow key are two expressions of one state: where the item currently is. Build that state properly and both fall out. Build the drag against the DOM directly and the keyboard path has nothing to hook into.',
    },
  ],
  industryExamples: [
    {
      id: 'example-apg-rearrangeable-listbox',
      source: 'W3C WAI',
      title: 'Reordering specified for the keyboard',
      observation:
        'The ARIA Authoring Practices Guide provides a rearrangeable listbox example with keyboard-driven move operations and announced positions.',
      takeaway:
        'The keyboard equivalent of drag-and-drop is a solved problem with a published specification. There is no need to invent it.',
    },
    {
      id: 'example-pointer-events-unified',
      source: 'MDN',
      title: 'One event model for every input',
      observation:
        'Pointer events cover mouse, touch and pen with a single API, including pointer capture for drags that leave the element.',
      takeaway:
        'Separate mouse and touch handlers are the older approach and diverge in behaviour. One code path is both less work and more consistent.',
    },
  ],
  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Build swipe-to-archive with a constraint, a velocity-aware commit and a keyboard path.',
    },
    {
      kind: 'code',
      language: 'ts',
      code: 'function trackVelocity() {\n  const samples: { x: number; t: number }[] = [];\n\n  return {\n    add(x: number) {\n      samples.push({ x, t: performance.now() });\n      /* Only the recent past matters — a pause then a flick is a flick. */\n      if (samples.length > 5) samples.shift();\n    },\n    get(): number {\n      if (samples.length < 2) return 0;\n      const first = samples[0];\n      const last = samples[samples.length - 1];\n      if (first === undefined || last === undefined) return 0;\n      const elapsed = last.t - first.t;\n      return elapsed > 0 ? (last.x - first.x) / elapsed : 0;\n    },\n  };\n}\n\n/* Resistance past the limit: the finger moves further than the element. */\nfunction withResistance(deltaX: number, limit: number): number {\n  if (Math.abs(deltaX) <= limit) return deltaX;\n  const excess = Math.abs(deltaX) - limit;\n  return Math.sign(deltaX) * (limit + excess * 0.2);\n}',
    },
    {
      kind: 'paragraph',
      text: 'The five-sample window is what makes a pause-then-flick read as a flick. A velocity averaged over the whole gesture would report something close to zero.',
    },
    {
      kind: 'paragraph',
      text: '`withResistance` is the constraint made tangible: past the limit the element moves at a fifth of the finger’s speed, so the user feels the boundary rather than discovering it on release.',
    },
    {
      kind: 'paragraph',
      text: 'The keyboard path is a separate, simpler thing — and it must exist.',
    },
  ],
  commonMistakes: [
    {
      id: 'mistake-12-04-gesture-only-action',
      mistake: 'Making a gesture the only way to perform an action.',
      why: 'Gestures are undiscoverable and unavailable to keyboard users, so the action is unreachable for a large share of people.',
      instead: 'Every gesture is an accelerator for a visible control that does the same thing.',
    },
    {
      id: 'mistake-12-04-distance-only-commit',
      mistake: 'Deciding commit from distance alone, ignoring velocity.',
      why: 'A deliberate fast flick snaps back and a hesitant slow drag commits — both the opposite of what the user meant.',
      instead: 'Lower the threshold when velocity is high, measured over the last few samples.',
    },
  ],
  professionalConsideration: [
    {
      kind: 'paragraph',
      text: 'Gestures are the most expensive interaction work per unit of value in product engineering.',
    },
    {
      kind: 'paragraph',
      text: 'Pointer capture, direction locking, velocity, resistance, interruption, the keyboard equivalent, and the announcement — a swipe-to-archive done properly is a week, and most users will never use it. That can still be the right call for a mobile-first product where it is the primary interaction. It is rarely the right call for a desktop tool, and "we should add swipe gestures" deserves the question of who is asking.',
    },
  ],
  goDeeper: [
    {
      kind: 'paragraph',
      text: 'Everything below was part of the walkthrough above. It is the detail that matters once the core idea has landed, and it is safe to skip on a first pass.',
    },
    {
      kind: 'code',
      language: 'tsx',
      code: '<li>\n  <span id={`row-${row.id}-name`}>{row.name}</span>\n\n  {/* The gesture is an accelerator. This is the real control. */}\n  <button\n    aria-describedby={`row-${row.id}-name`}\n    onClick={() => archive(row.id)}\n  >\n    Archive\n  </button>\n</li>',
    },
    {
      kind: 'paragraph',
      text: 'A real button, labelled by the row it acts on, doing the same thing the swipe does. If the swipe were removed the feature would still work — which is the test for whether a gesture is an accelerator or a trap.',
    },
  ],
  practicalExercise: {
    id: 'exercise-direct-manipulation-and-gestures',
    title: 'Build one gesture properly',
    prompt:
      'Build a single drag or swipe interaction to a professional standard, including the keyboard equivalent.',
    steps: [
      'Use pointer events with pointer capture, and no transition while dragging.',
      'Set an activation threshold and verify a tap is never read as a drag.',
      'Add direction locking so the gesture does not fight scrolling.',
      'Measure velocity over a short recent window.',
      'Lower the commit threshold for a flick.',
      'Add resistance past the limit so the constraint is felt.',
      'Animate both snap-back and commit.',
      'Build the keyboard equivalent, with the result announced, and verify the feature works with the gesture removed.',
    ],
    successCriteria: [
      'The element tracks the pointer one-to-one with no lag.',
      'A tap never activates the gesture; a fast drag never escapes capture.',
      'The gesture does not interfere with scrolling.',
      'A flick commits from a shorter distance than a slow drag.',
      'Constraints are felt as resistance, not discovered on release.',
      'Snap-back and commit are both animated.',
      'The action is fully usable by keyboard with the outcome announced.',
    ],
    estimatedMinutes: 100,
    hint: 'Test on a real touch device, not with mouse emulation. Finger tremor, thumb reach and the conflict with scroll are invisible with a mouse and are most of the difficulty.',
  },
  reflectionQuestion:
    'Why is a gesture-only action worse than having no gesture at all?',
  reflectionHint:
    'Count who can discover it, and who can perform it.',
  resources: [
    {
      id: 'resource-mdn-pointer-events-12',
      title: 'Pointer events',
      url: 'https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events',
      type: 'documentation',
      author: 'MDN',
      estimatedMinutes: 35,
      note: 'One model for mouse, touch and pen, including pointer capture. The capture section is the one to read carefully.',
    },
    {
      id: 'resource-apg-rearrangeable-listbox-12',
      title: 'Rearrangeable Listbox Example',
      url: 'https://www.w3.org/WAI/ARIA/apg/patterns/listbox/examples/listbox-rearrangeable/',
      type: 'documentation',
      author: 'W3C WAI',
      estimatedMinutes: 25,
      note: 'The keyboard specification for reordering. Build against this rather than inventing key handling.',
    },
  ],
  competencyTags: ['interaction-engineering', 'motion', 'browser-apis', 'accessibility', 'interaction-design'],
  completionCriteria: [
    'Builds a drag that follows the pointer exactly and survives leaving the element.',
    'Uses velocity and thresholds so intent is read correctly.',
    'Provides an announced keyboard equivalent for every gesture.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Lesson 60                                                                   */
/* -------------------------------------------------------------------------- */

const LESSON_5: Lesson = {
  id: 'lesson-reduced-motion-and-accessible-animation',
  slug: 'reduced-motion-and-accessible-animation',
  moduleId: MODULE_ID,
  lessonNumber: 5,
  title: 'Reduced Motion and Accessible Animation',
  summary:
    'For some people motion causes nausea and dizziness. Honouring that preference properly means replacing the animation, not deleting it.',
  estimatedMinutes: 9,
  objectives: [
    'Honour `prefers-reduced-motion` across every animation in a product.',
    'Explain which motion causes vestibular symptoms and why.',
    'Design a meaningful alternative rather than removing feedback.',
    'Handle motion that cannot simply be switched off.',
  ],
  prerequisiteConcepts: [
    'All four previous lessons',
    'Accessibility as a component property, Module 9 lesson 45',
    'Motion tokens, lesson 57',
  ],
  prerequisiteLessonIds: [
    'lesson-direct-manipulation-and-gestures',
    'lesson-building-accessible-components',
  ],
  recap: [
    {
      kind: 'paragraph',
      text: 'You can now build motion that explains changes, follows a finger and commits on a flick. This lesson is about the people for whom some of that is physically unpleasant.',
    },
  ],
  priorKnowledge: [
    {
      kind: 'paragraph',
      text: 'Module 9 established accessibility as a property built into a component rather than audited afterwards. Motion is the clearest case: a reduced-motion alternative designed alongside the animation costs almost nothing, and retrofitted across forty components costs a week.',
    },
  ],
  coreConcept: [
    {
      kind: 'paragraph',
      text: 'Some people experience **vestibular disorders**, where certain motion causes genuine nausea, dizziness and headache. Operating systems let them say so, and the browser passes it on.',
    },
    {
      kind: 'code',
      language: 'css',
      code: '@media (prefers-reduced-motion: reduce) {\n  /* … */\n}',
    },
    {
      kind: 'paragraph',
      text: 'This is a real, user-set preference, not a hypothetical. It is also not a request for a static interface — it is a request not to be made unwell, which is a narrower thing.',
    },
    {
      kind: 'paragraph',
      text: 'The crude response is to disable everything:',
    },
    {
      kind: 'code',
      language: 'css',
      code: '/* Blunt. Better than ignoring the preference, and it removes feedback too. */\n@media (prefers-reduced-motion: reduce) {\n  *, *::before, *::after {\n    animation-duration: 0.01ms !important;\n    animation-iteration-count: 1 !important;\n    transition-duration: 0.01ms !important;\n  }\n}',
    },
    {
      kind: 'paragraph',
      text: 'Worth having as a safety net, because it guarantees nothing is missed. But it also removes the feedback, causality and hierarchy that motion was providing, so these users get a less communicative interface rather than an equally good one.',
    },
  ],
  whyDesignersCare: [
    {
      kind: 'paragraph',
      text: 'Because not all motion is equally troublesome, and knowing which is which lets you keep most of it.',
    },
    {
      kind: 'list',
      items: [
        '**Problematic** — large movements across the screen, parallax, scaling and zooming, spinning, and anything that fills much of the viewport.',
        '**Usually fine** — opacity changes, colour changes, and small movements of a few pixels.',
      ],
    },
    {
      kind: 'paragraph',
      text: 'The pattern is that symptoms are triggered by motion implying the *viewer* is moving. A large panel sweeping across the screen reads as self-motion; a button fading reads as a change in the thing being looked at.',
    },
    {
      kind: 'paragraph',
      text: 'So the right response is usually to replace movement with a fade rather than to remove the transition entirely.',
    },
  ],
  howItWorks: [
    {
      kind: 'paragraph',
      text: 'A **meaningful alternative** keeps the job and changes the mechanism.',
    },
    {
      kind: 'code',
      language: 'css',
      code: '.dialog {\n  transition:\n    opacity var(--duration-base) var(--ease-out),\n    transform var(--duration-slow) var(--ease-out);\n}\n\n.dialog[data-state=\'closed\'] {\n  opacity: 0;\n  transform: translateY(8px) scale(0.98);\n}\n\n@media (prefers-reduced-motion: reduce) {\n  .dialog {\n    /* Keep the fade — it still signals arrival. Drop the movement. */\n    transition: opacity var(--duration-fast) var(--ease-out);\n  }\n\n  .dialog[data-state=\'closed\'] {\n    opacity: 0;\n    transform: none;\n  }\n}',
    },
    {
      kind: 'paragraph',
      text: 'The dialog still appears rather than snapping into existence, so the feedback survives. What is removed is the spatial movement, which is the part that causes symptoms.',
    },
    {
      kind: 'paragraph',
      text: 'The same logic applies to the Module 11 skeleton shimmer: a continuously sweeping gradient is motion across an area, so under reduced motion it becomes a static placeholder or a slow opacity pulse.',
    },
    {
      kind: 'paragraph',
      text: 'The preference also has to reach JavaScript, because a FLIP animation is not a CSS transition and the media query will not touch it.',
    },
    {
      kind: 'code',
      language: 'ts',
      code: 'const reducedMotion = window.matchMedia(\'(prefers-reduced-motion: reduce)\');\n\nfunction animateReorder(rows: HTMLElement[], deltas: Map<string, number>) {\n  /* Reordering has no spatial story worth telling if we cannot move things. */\n  if (reducedMotion.matches) return;\n  /* … FLIP as in lesson 58 … */\n}\n\n/* The preference can change while the page is open. */\nreducedMotion.addEventListener(\'change\', (event) => {\n  document.documentElement.dataset.reducedMotion = String(event.matches);\n});',
    },
    {
      kind: 'paragraph',
      text: 'The `change` listener matters more than it looks. Someone turning the preference on mid-session expects it to take effect, not at the next reload.',
    },
  ],
  firstPrinciples: [
    {
      kind: 'paragraph',
      text: 'The hard case is motion that cannot be removed, because it *is* the interaction.',
    },
    {
      kind: 'paragraph',
      text: 'A drag follows the finger. There is no reduced-motion version of that — the element must track the pointer or the gesture is broken.',
    },
    {
      kind: 'paragraph',
      text: 'The answer is the keyboard equivalent from lesson 59. Under reduced motion the gesture still works for those who want it, and the alternative route exists for those who do not. The accelerator-plus-control structure turns out to solve this too.',
    },
    {
      kind: 'callout',
      tone: 'insight',
      body: 'Motion that is continuous, automatic and unavoidable is the genuine problem — autoplaying video, carousels, parallax on scroll. Motion the user initiates and controls is much less troublesome, because they chose it and can stop.',
    },
    {
      kind: 'paragraph',
      text: 'WCAG makes a related distinction: animation triggered by interaction must be disableable unless it is essential. "Essential" is a high bar, and almost no decorative transition meets it.',
    },
  ],
  designPerspective: [
    {
      kind: 'paragraph',
      text: 'The design question is what each animation is communicating, and how else to say it.',
    },
    {
      kind: 'paragraph',
      text: 'Go through the audit table from lesson 56 and add a column: the reduced-motion alternative. A fade. A colour change. An instant state change with an announcement. Occasionally nothing, where the animation was pure decoration — in which case it probably should not have existed for anyone.',
    },
  ],
  engineeringPerspective: [
    {
      kind: 'paragraph',
      text: 'The engineering question is how this stops regressing.',
    },
    {
      kind: 'paragraph',
      text: 'The blanket override as a safety net, plus per-component alternatives where the blanket version loses something, plus the preference available to JavaScript. And a line in the Module 10 lesson 50 contribution checklist, so the next animated component has to answer the question before it ships.',
    },
  ],
  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'Reduced motion is the clearest demonstration that accessibility is a design brief rather than a constraint.',
    },
    {
      kind: 'paragraph',
      text: '"Keep the feedback, remove the movement" is a design problem with an interesting answer. "Turn the animations off" is a compliance checkbox that makes the product worse for the people it was meant to help. Same requirement, and the difference is entirely in whether anybody designed a response.',
    },
  ],
  industryExamples: [
    {
      id: 'example-wcag-animation-from-interactions',
      source: 'W3C WAI',
      title: 'Interaction animation required to be disableable',
      observation:
        'WCAG success criterion 2.3.3 requires that motion animation triggered by interaction can be disabled, unless the animation is essential to the functionality.',
      takeaway:
        'The exemption is narrow. A transition that looks nice is not essential, and the criterion assumes you will provide the switch.',
    },
    {
      id: 'example-safer-web-animation',
      source: 'A List Apart',
      title: 'Which motion causes symptoms',
      observation:
        'Writing on motion sensitivity distinguishes large-scale, parallax and zooming motion from small opacity and colour changes in terms of the symptoms they provoke.',
      takeaway:
        'The distinction is what makes a designed alternative possible. Without it, the only available response is to remove everything.',
    },
  ],
  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Extend the lesson 56 audit with alternatives, then verify it.',
    },
    {
      kind: 'code',
      language: 'markdown',
      code: '| Change | Job | Standard | Reduced motion | Why |\n| --- | --- | --- | --- | --- |\n| Dialog opens | Causality | Fade + 8px rise | Fade only | Movement removed, arrival kept |\n| Drawer slides in | Orientation | 320px slide | Fade only | Large traversal is the worst case |\n| Toast appears | Feedback | Fade + 4px rise | Fade only | 4px is small, but costs nothing to drop |\n| Skeleton shimmer | Feedback | Sweeping gradient | Static placeholder | Continuous motion over an area |\n| Table reorders | Continuity | FLIP | Instant, with a live-region count | No spatial story without movement |\n| Row drag | Manipulation | Follows pointer | Unchanged; keyboard path provided | User-initiated and controlled |\n| Spinner | Feedback | Rotation | Fading dots | Rotation is a known trigger |',
    },
    {
      kind: 'paragraph',
      text: 'Every row keeps its job. Only the mechanism changes, and in one case — the reorder — the alternative is an announcement rather than a visual, which is a legitimate substitution.',
    },
  ],
  commonMistakes: [
    {
      id: 'mistake-12-05-ignoring-the-preference',
      mistake: 'Not implementing `prefers-reduced-motion` at all.',
      why: 'The user has explicitly asked their system not to show them this, and the product overrides a medical accommodation.',
      instead: 'At minimum the blanket override. Better, a designed alternative per animation.',
    },
    {
      id: 'mistake-12-05-removing-rather-than-replacing',
      mistake: 'Disabling all motion and calling it done.',
      why: 'Feedback, causality and hierarchy disappear, so these users get a less communicative interface rather than an equally good one.',
      instead: 'Keep the job, change the mechanism. Usually that means a fade where there was movement.',
    },
  ],
  professionalConsideration: [
    {
      kind: 'paragraph',
      text: 'Reduced motion is the cheapest high-impact accessibility work available, and the most often skipped.',
    },
    {
      kind: 'paragraph',
      text: 'Six lines of CSS gets you most of the way, and nobody on the team will notice it is missing because nobody on the team has the preference set. That is exactly why it needs to be a checklist item rather than a thing somebody remembers — and why switching the preference on and using your own product for an hour is worth doing once, properly.',
    },
  ],
  goDeeper: [
    {
      kind: 'paragraph',
      text: 'Everything below was part of the walkthrough above. It is the detail that matters once the core idea has landed, and it is safe to skip on a first pass.',
    },
    {
      kind: 'paragraph',
      text: 'To verify, set the preference at the operating system level rather than in developer tools: macOS Accessibility, Windows under visual effects, and the emulation in Chrome’s Rendering panel for quick checks. Then use the whole product, not just the animated components in isolation.',
    },
    {
      kind: 'paragraph',
      text: 'The things that break are rarely the components you classified as animated. They are the shimmer, the spinner, and the one scroll-triggered reveal somebody added to the empty state.',
    },
  ],
  practicalExercise: {
    id: 'exercise-reduced-motion-and-accessible-animation',
    title: 'Design reduced-motion alternatives',
    prompt:
      'Give every animation in your product a designed reduced-motion alternative, then use the whole product with the preference on.',
    steps: [
      'Add the blanket override as a safety net.',
      'Extend your lesson 56 audit with a reduced-motion column and a reason per row.',
      'Implement a designed alternative wherever the blanket version loses the job.',
      'Make the preference available to JavaScript, including the `change` listener.',
      'Handle the Module 11 skeleton shimmer and any spinner.',
      'Confirm gestures still work, with the keyboard path intact.',
      'Set the preference at the OS level and use the whole product for twenty minutes.',
      'Add a reduced-motion line to your Module 10 contribution checklist.',
    ],
    successCriteria: [
      'A blanket override exists as a safety net.',
      'Every animation has a documented alternative and reason.',
      'Feedback and causality survive under reduced motion.',
      'The preference reaches JavaScript and responds to mid-session changes.',
      'Continuous motion — shimmer, spinners — is addressed specifically.',
      'The product was used end to end with the preference set, and findings recorded.',
      'The checklist has been updated.',
    ],
    estimatedMinutes: 70,
    hint: 'Use the product for twenty real minutes rather than clicking through components. The things that break are usually the ones nobody classified as animation — a shimmer, an autoscroll, a spinner.',
  },
  reflectionQuestion:
    'Why is replacing an animation with a fade better than removing the transition entirely?',
  reflectionHint:
    'Ask what the animation was communicating, and whether that still needs saying.',
  resources: [
    {
      id: 'resource-mdn-prefers-reduced-motion-12',
      title: 'prefers-reduced-motion',
      url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion',
      type: 'documentation',
      author: 'MDN',
      estimatedMinutes: 15,
      note: 'The query itself, with examples. Short, and there is no excuse for not having read it.',
    },
    {
      id: 'resource-alistapart-safer-animation-12',
      title: 'Designing Safer Web Animation For Motion Sensitivity',
      url: 'https://alistapart.com/article/designing-safer-web-animation-for-motion-sensitivity/',
      type: 'article',
      author: 'A List Apart',
      estimatedMinutes: 30,
      note: 'Which motion causes symptoms and why. The article that makes designed alternatives possible rather than guesswork.',
    },
  ],
  competencyTags: ['accessibility', 'motion', 'interaction-engineering', 'css', 'design-qa'],
  completionCriteria: [
    'Honours the preference across CSS and JavaScript animation.',
    'Replaces movement with an alternative rather than removing feedback.',
    'Can explain which motion provokes vestibular symptoms.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Project                                                                     */
/* -------------------------------------------------------------------------- */

const PROJECT: ModuleProject = {
  id: 'project-polished-command-menu',
  slug: 'polished-command-menu',
  moduleId: MODULE_ID,
  title: 'Polished Command Menu or File Browser',
  brief:
    'Build a command menu or file browser where every interaction is finished: keyboard-first navigation, managed focus, motion with a named job, real loading and error states, and a reduced-motion path.',
  learnerGoal:
    'Build the one thing in your portfolio that demonstrates interaction quality rather than describing it.',
  problem:
    'A command menu is small enough to finish and unforgiving enough to be a real test. It is used fast and repeatedly, so every millisecond of animation is felt, focus must never be lost, and results arrive asynchronously while the user is still typing.',
  prerequisiteLessonIds: [
    'lesson-why-interfaces-move',
    'lesson-timing-and-easing',
    'lesson-spatial-continuity',
    'lesson-direct-manipulation-and-gestures',
    'lesson-reduced-motion-and-accessible-animation',
  ],
  objectives: [
    'Build a keyboard-first interface where the pointer is optional.',
    'Apply motion tokens with a named job for every animation.',
    'Handle async results arriving while the user is still typing.',
    'Provide a full reduced-motion path.',
  ],
  requirements: [
    'Opens and closes by keyboard shortcut, with focus moved and restored.',
    'Full keyboard navigation following the relevant ARIA pattern.',
    'Motion from tokens, with a documented job per animation and exits faster than entrances.',
    'At least one origin-aware or shared-element transition.',
    'Async search with cancellation, so out-of-order results cannot win.',
    'Loading, both empties and error states, per Module 11 lesson 51.',
    'A complete reduced-motion alternative.',
    'One direct-manipulation interaction with a keyboard equivalent.',
  ],
  constraints: [
    'No animation library. Use CSS transitions and the Web Animations API.',
    'No command-menu or combobox library.',
    'No hard-coded duration or easing.',
    'Nothing above 320ms without a written reason.',
    'No action reachable only by pointer.',
  ],
  suggestedScope:
    'One component, finished to a standard you would defend in an interview. Roughly thirty to forty hours, much of it on details nobody will consciously notice.',
  deliverables: [
    'The working component.',
    'The motion table: every animation with its job, duration, easing and reduced-motion alternative.',
    'The keyboard contract.',
    'A short recording at standard and reduced motion.',
  ],
  completionCriteria: [
    'Fully operable without a pointer, from opening to acting on a result.',
    'Focus is visible throughout and restored on close.',
    'Every animation has a named job; none is decoration.',
    'Exits are faster than entrances, and nothing exceeds 320ms unjustified.',
    'Results arriving out of order cannot overwrite newer ones.',
    'All async states render correctly.',
    'Reduced motion keeps every animation’s job via an alternative.',
    'The direct-manipulation interaction has an announced keyboard equivalent.',
  ],
  portfolioEvidence: [
    'Interaction quality — the kind that is only visible when it is missing.',
    'Keyboard-first engineering — not keyboard support added afterwards.',
    'Motion judgement — every animation justified, nothing decorative.',
    'Accessibility depth — reduced motion designed rather than disabled.',
  ],
  reflectionQuestion:
    'Which detail took the longest and will be noticed by nobody — and was it worth it?',
  estimatedHours: 35,
  competencies: [
    'motion',
    'interaction-engineering',
    'interaction-design',
    'accessibility',
    'browser-apis',
    'react',
    'async-systems',
    'design-systems',
    'css',
    'performance',
    'design-qa',
  ],
  stretchGoals: [
    'Add a shared-element transition from a result to its detail view.',
    'Add fuzzy matching with the matched characters highlighted in each result.',
    'Measure the interaction in the Performance panel and show every frame inside budget.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Module                                                                      */
/* -------------------------------------------------------------------------- */

export const MODULE_12: CurriculumModule = {
  id: MODULE_ID,
  slug: 'motion-and-interaction-quality',
  moduleNumber: 12,
  phase: 'interaction-and-motion',
  title: 'Motion and Interaction Quality',
  description:
    'Motion as engineering rather than decoration: the five jobs it can do, duration and easing as tokens, spatial continuity through transforms, direct manipulation with velocity and thresholds, and reduced motion designed rather than switched off.',
  outcome:
    'Can justify every animation in a product, implement it without costing frames, and provide an alternative for people who cannot tolerate movement.',
  prerequisites: [
    'Module 9 — focus management and keyboard operability',
    'Module 10 — tokens and foundations',
    'Module 11 — async states worth animating',
  ],
  lessons: [LESSON_1, LESSON_2, LESSON_3, LESSON_4, LESSON_5],
  resources: [
    {
      id: 'resource-module-12-material-motion',
      title: 'Motion — Material Design 3',
      url: 'https://m3.material.io/styles/motion/overview',
      type: 'documentation',
      author: 'Material Design',
      estimatedMinutes: 60,
      note: 'The most complete published motion system, including tokens and the reasoning behind each duration.',
    },
    {
      id: 'resource-module-12-web-dev-animations',
      title: 'Animations guide',
      url: 'https://web.dev/articles/animations-guide',
      type: 'article',
      author: 'web.dev',
      estimatedMinutes: 40,
      note: 'Which properties are cheap to animate and why. The performance half of this module.',
    },
    {
      id: 'resource-module-12-chrome-devs',
      title: 'Chrome for Developers',
      url: 'https://www.youtube.com/@ChromeDevs',
      type: 'video',
      author: 'Chrome for Developers',
      estimatedMinutes: 60,
      note: 'Search for View Transitions and rendering performance. The animation internals are much clearer demonstrated than written.',
    },
    {
      id: 'resource-module-12-wcag-animation',
      title: 'Understanding SC 2.3.3: Animation from Interactions',
      url: 'https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html',
      type: 'tool',
      author: 'W3C WAI',
      estimatedMinutes: 20,
      note: 'The requirement itself, with its narrow exemption. Check any animation you think is essential against it.',
    },
  ],
  project: PROJECT,
  competencies: [
    'motion',
    'interaction-engineering',
    'interaction-design',
    'accessibility',
    'browser-apis',
    'css',
    'react',
    'design-systems',
    'performance',
    'async-systems',
    'design-qa',
    'ux-reasoning',
    'product-judgement',
  ],
  completionCriteria: [
    'All five lessons completed.',
    'Module project marked completed.',
    'Can justify, implement and provide alternatives for every animation.',
  ],
};
