/**
 * Module 10 — Interaction and Motion Engineering.
 *
 * Motion as a functional tool: what it is for, how long it should take, how it
 * preserves spatial relationships, how direct manipulation works, and what to
 * do for people who cannot tolerate it.
 */

import type { CurriculumModule, Lesson, ModuleProject } from '@/types/curriculum';

const MODULE_ID = 'module-10';

/* -------------------------------------------------------------------------- */
/* Lesson 46                                                                   */
/* -------------------------------------------------------------------------- */

const LESSON_46: Lesson = {
  id: 'lesson-10-01',
  slug: 'motion-has-a-job',
  moduleId: MODULE_ID,
  lessonNumber: 1,
  title: 'Motion Has a Job',
  summary:
    'Every animation either explains something or costs attention. There is no neutral animation.',
  estimatedMinutes: 8,

  objectives: [
    'Name the five jobs motion can legitimately do.',
    'Justify each animation by the job it performs.',
    'Recognise motion that costs attention without returning anything.',
    'Decide when stillness is the correct choice.',
  ],

  prerequisiteConcepts: ['Interaction states', 'Feedback'],
  prerequisiteLessonIds: ['lesson-01-02'],

  recap: [
    {
      kind: 'paragraph',
      text: 'Module 1 established feedback as one of the five things an interface owes its user. Motion is one way to deliver it, and the one most often used for something else.',
    },
  ],

  coreConcept: [
    {
      kind: 'paragraph',
      text: 'Motion in an interface has five legitimate jobs. Anything that does none of them is decoration, and decoration in a working interface is a cost.',
    },
    {
      kind: 'list',
      items: [
        'Continuity — this element is the same element, now somewhere else.',
        'Hierarchy — this is what changed; look here.',
        'Causality — that action produced this result.',
        'Feedback — the system received your input and is acting.',
        'Orientation — where you came from and how to get back.',
      ],
    },
    {
      kind: 'paragraph',
      text: 'The test is removal. Take the animation out. If nothing is harder to understand, it was not doing one of these jobs — it was consuming attention and returning nothing.',
    },
    {
      kind: 'callout',
      tone: 'insight',
      body: 'Attention is the scarcest resource in an interface. Motion takes it involuntarily, which is why it has to earn the taking.',
    },
  ],

  firstPrinciples: [
    {
      kind: 'paragraph',
      text: 'The visual system is built to detect movement, and that detection happens before conscious attention. You cannot choose to ignore an animation the way you can choose to ignore a colour; it pulls focus whether or not it is relevant.',
    },
    {
      kind: 'paragraph',
      text: 'That makes motion powerful for directing attention and destructive when applied to everything. If three things animate at once, none of them is emphasised — the mechanism only works against a background of stillness.',
    },
  ],

  designPerspective: [
    {
      kind: 'paragraph',
      text: 'Motion in a portfolio piece and motion in a daily tool are different crafts. A landing page is seen once, and expressive motion is part of its impression. A tool is used hundreds of times a day, and the same animation becomes a tax paid on every interaction.',
    },
    {
      kind: 'paragraph',
      text: 'This is why tools built for professional use tend to animate very little, and what they do animate is short, functional, and consistent.',
    },
  ],

  engineeringPerspective: [
    {
      kind: 'code',
      language: 'css',
      caption: 'One job, stated in a comment, so it can be reviewed.',
      code: `/* Feedback: confirms the press was received. Short enough to feel
   simultaneous with the click. */
.button { transition: background-color 120ms ease-out; }

/* Continuity: the panel comes from the edge it belongs to, so its origin
   is legible. */
.panel {
  transition: transform 200ms cubic-bezier(0.2, 0, 0, 1);
}

/* No job. Costs attention on every page load and explains nothing. */
.card { animation: float 3s ease-in-out infinite; }`,
    },
    {
      kind: 'paragraph',
      text: 'Writing the job in a comment is a small discipline with a real effect: an animation that cannot be given one in a sentence is usually one that should not exist.',
    },
  ],

  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'Motion is the clearest case where a design decision has an immediate engineering consequence. Animating the wrong property causes layout work on every frame; animating too many things at once causes dropped frames.',
    },
    {
      kind: 'paragraph',
      text: 'A design engineer can say "that animation will be expensive, and here is an equivalent that is not" — which is a more useful contribution than either discipline makes alone.',
    },
  ],

  industryExamples: [
    {
      id: 'example-tool-restraint',
      source: 'Professional tools',
      title: 'Restraint proportional to usage frequency',
      observation:
        'Applications designed for all-day use animate sparingly, with short durations, and reserve motion for state changes that need explaining.',
      takeaway:
        'An animation used a hundred times a day has to justify itself a hundred times.',
    },
    {
      id: 'example-attention-direction',
      source: 'Interfaces with a single animated element',
      title: 'Emphasis requires stillness elsewhere',
      observation:
        'Well-designed transitions animate one thing while everything else stays put, so the moving element is unambiguously the one that changed.',
      takeaway:
        'Emphasis is relative. Animating everything emphasises nothing.',
    },
  ],

  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Removing unnecessary animations from a flow.',
    },
    { kind: 'heading', text: '1. Inventory every animation' },
    {
      kind: 'paragraph',
      text: 'Across one complete flow. Transitions, hovers, loaders, page changes. The list is usually longer than expected.',
    },
    { kind: 'heading', text: '2. Assign a job, or none' },
    {
      kind: 'paragraph',
      text: 'Continuity, hierarchy, causality, feedback, orientation — or nothing. One sentence each.',
    },
    { kind: 'heading', text: '3. Remove everything with no job' },
    {
      kind: 'paragraph',
      text: 'Not shorten. Remove. Then use the flow and see whether anything became harder.',
    },
    { kind: 'heading', text: '4. Check for simultaneous motion' },
    {
      kind: 'paragraph',
      text: 'Anywhere two things animate at once, decide which one matters and still the other.',
    },
    { kind: 'heading', text: '5. Use the flow twenty times' },
    {
      kind: 'paragraph',
      text: 'Motion that is pleasant once can be tiring at repetition. Frequency is part of the judgement.',
    },
  ],

  commonMistakes: [
    {
      id: 'mistake-animate-everything',
      mistake: 'Adding transitions to every property that supports one.',
      why: 'Everything moves, so nothing is emphasised, and the interface feels slower than it is.',
      instead: 'Animate only what needs explaining.',
    },
    {
      id: 'mistake-decorative-loops',
      mistake: 'Continuous ambient animation in a working interface.',
      why: 'It pulls attention repeatedly and permanently, and returns nothing after the first second.',
      instead: 'Reserve looping motion for genuine ongoing processes.',
    },
    {
      id: 'mistake-motion-as-personality',
      mistake: 'Using motion to express brand in a daily tool.',
      why: 'The expression is experienced once and the cost is paid on every repetition.',
      instead: 'Express personality where frequency is low; keep tools functional.',
    },
    {
      id: 'mistake-no-justification',
      mistake: 'Adding animation because the interface feels flat without it.',
      why: 'Flatness is usually a hierarchy problem, and motion covers the symptom while the cause remains.',
      instead: 'Fix the hierarchy; add motion only for a job on the list.',
    },
  ],

  eliteConsiderations: [
    {
      kind: 'list',
      items: [
        'Write the job of every animation in a comment; the ones without a job become obvious.',
        'Judge motion at usage frequency, not on first view.',
        'Still everything that is not the subject of a transition.',
        'When in doubt, remove it and see whether anyone notices.',
      ],
    },
  ],

  practicalExercise: {
    id: 'exercise-10-01',
    title: 'Remove unnecessary animations from a flow',
    prompt:
      'Audit one complete flow and remove every animation that does not do a job.',
    steps: [
      'Inventory every animation in the flow.',
      'Assign each one a job from the five, or mark it as having none.',
      'Remove everything with no job.',
      'Use the flow and record anything that became harder to understand.',
      'Restore only what the record justifies, with the job written down.',
      'Find every place two things animate simultaneously and still the one that does not matter.',
      'Use the flow twenty times and note anything that became tiring.',
    ],
    successCriteria: [
      'Every remaining animation has a written job.',
      'At least one animation was removed and not restored.',
      'No two elements animate simultaneously without a stated reason.',
      'The flow was tested at repetition, not only once.',
      'Anything that became harder after removal was restored deliberately.',
    ],
    estimatedMinutes: 40,
    hint: 'Remove first, then see what breaks. Shortening a pointless animation leaves it pointless.',
  },

  reflectionQuestion: 'When should an interface remain still?',
  reflectionHint: 'Motion consumes attention.',

  resources: [
    {
      id: 'resource-material-motion',
      title: 'Material Design: motion',
      url: 'https://m3.material.io/styles/motion/overview',
      type: 'documentation',
      estimatedMinutes: 40,
      note: 'Motion categorised by what it is for.',
    },
    {
      id: 'resource-nngroup-animation',
      title: 'Animation for attention and comprehension',
      url: 'https://www.nngroup.com/articles/animation-usability/',
      type: 'article',
      estimatedMinutes: 15,
      note: 'Where motion helps comprehension and where it costs.',
    },
  ],

  competencyTags: ['interaction-design', 'motion', 'product-judgement'],

  completionCriteria: [
    'Has audited a flow and removed unjustified motion.',
    'Every remaining animation has a written job.',
    'The flow was evaluated at repetition.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Lesson 47                                                                   */
/* -------------------------------------------------------------------------- */

const LESSON_47: Lesson = {
  id: 'lesson-10-02',
  slug: 'timing-and-easing',
  moduleId: MODULE_ID,
  lessonNumber: 2,
  title: 'Timing and Easing',
  summary:
    'Duration and curve decide whether a transition reads as responsive or sluggish. Entering and leaving are different problems.',
  estimatedMinutes: 9,

  objectives: [
    'Choose durations appropriate to distance and importance.',
    'Select easing curves that match physical expectation.',
    'Explain why entering and exiting warrant different timing.',
    'Evaluate perceived speed rather than measured duration.',
  ],

  prerequisiteConcepts: ['Motion has a job'],
  prerequisiteLessonIds: ['lesson-10-01'],

  recap: [
    {
      kind: 'paragraph',
      text: 'An animation with a job still needs a duration and a curve, and both are where most motion goes wrong.',
    },
  ],

  coreConcept: [
    {
      kind: 'paragraph',
      text: 'Duration should follow distance and significance. A colour change on a button is a small event and should be near-instant. A panel crossing the screen is a larger one and needs enough time for the eye to follow it.',
    },
    {
      kind: 'list',
      items: [
        '100–150ms — immediate feedback: hover, press, focus.',
        '150–250ms — small transitions: a dropdown, a tooltip, a local state change.',
        '250–400ms — larger movements: a panel, a sheet, a page-level transition.',
        'Over 400ms — rarely justified outside onboarding or a deliberate showpiece.',
      ],
    },
    {
      kind: 'paragraph',
      text: 'Easing describes how the rate changes over the duration. Things in the physical world do not start and stop instantly, so linear motion reads as mechanical. Ease-out — fast start, slow finish — is the default for most interface motion because arrival is what the eye needs to track.',
    },
    {
      kind: 'callout',
      tone: 'insight',
      body: 'Entering should be visible enough to follow. Leaving should get out of the way. Symmetrical timing makes dismissal feel slow.',
    },
  ],

  firstPrinciples: [
    {
      kind: 'paragraph',
      text: 'Entry and exit answer different questions. On entry, the user needs to see what appeared and where it came from — so the motion should be traceable, ease-out, slightly longer. On exit, the user has already decided; they want the space back.',
    },
    {
      kind: 'paragraph',
      text: 'A practical ratio is exits at roughly two-thirds the entry duration, with ease-in so departure accelerates away. The asymmetry is what makes dismissal feel immediate while entry still feels explained.',
    },
  ],

  designPerspective: [
    {
      kind: 'paragraph',
      text: 'Perceived speed and measured speed diverge. An interface that responds within 100ms feels instantaneous regardless of when the work finishes, and an interface that waits 400ms before acknowledging a press feels broken even if it completes sooner.',
    },
    {
      kind: 'paragraph',
      text: 'The practical consequence: acknowledge immediately, complete at whatever pace the transition needs. The acknowledgement is what is being judged.',
    },
  ],

  engineeringPerspective: [
    {
      kind: 'code',
      language: 'css',
      caption: 'Asymmetric timing, and curves chosen for the direction.',
      code: `:root {
  --duration-instant: 120ms;   /* hover, press, focus */
  --duration-quick:   200ms;   /* dropdowns, tooltips */
  --duration-moderate: 280ms;  /* panels, sheets */

  /* Decelerates into place: the eye can follow the arrival. */
  --ease-out: cubic-bezier(0.2, 0, 0, 1);
  /* Accelerates away: departure gets out of the way. */
  --ease-in:  cubic-bezier(0.4, 0, 1, 1);
}

.panel[data-state='open'] {
  transition: transform var(--duration-moderate) var(--ease-out);
}

.panel[data-state='closed'] {
  /* Roughly two-thirds, accelerating out. Dismissal feels immediate. */
  transition: transform 180ms var(--ease-in);
}`,
    },
    {
      kind: 'paragraph',
      text: 'Durations belong in tokens for the same reason colours do. Ad-hoc values produce an interface where similar transitions take subtly different times, which reads as sloppiness without being identifiable.',
    },
  ],

  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'Timing is a design decision that only exists as numbers. A designer cannot fully specify it in a static file, and an engineer picking values alone will pick defaults.',
    },
    {
      kind: 'paragraph',
      text: 'It is best resolved in the browser, together, by comparing candidates — which is precisely the kind of decision design engineering exists to make.',
    },
  ],

  industryExamples: [
    {
      id: 'example-duration-tokens',
      source: 'Design systems with motion tokens',
      title: 'Durations as tokens',
      observation:
        'Systems that handle motion well publish a small set of durations and curves and require components to use them.',
      takeaway:
        'Consistency in timing is as visible as consistency in spacing, and equally invisible when absent.',
    },
    {
      id: 'example-asymmetric-timing',
      source: 'Mobile platform conventions',
      title: 'Exits faster than entrances',
      observation:
        'Platform sheet and modal transitions consistently dismiss faster than they present.',
      takeaway:
        'The convention exists because symmetrical timing makes dismissal feel like waiting.',
    },
  ],

  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Comparing transitions and documenting perception.',
    },
    { kind: 'heading', text: '1. Build one transition at several durations' },
    {
      kind: 'paragraph',
      text: '100, 200, 300, 500ms, side by side and switchable without a reload.',
    },
    { kind: 'heading', text: '2. Record what each feels like' },
    {
      kind: 'paragraph',
      text: 'In words: abrupt, responsive, deliberate, sluggish. The vocabulary matters more than the numbers.',
    },
    { kind: 'heading', text: '3. Vary the curve at a fixed duration' },
    {
      kind: 'paragraph',
      text: 'Linear, ease-out, ease-in, ease-in-out. The same 250ms reads very differently.',
    },
    { kind: 'heading', text: '4. Try asymmetry' },
    {
      kind: 'paragraph',
      text: 'Entry at 280 with ease-out, exit at 180 with ease-in. Compare against symmetrical timing directly.',
    },
    { kind: 'heading', text: '5. Test at repetition' },
    {
      kind: 'paragraph',
      text: 'Open and close twenty times. What felt elegant once often feels slow by the tenth.',
    },
    { kind: 'heading', text: '6. Write the tokens' },
    {
      kind: 'paragraph',
      text: 'Name the durations and curves you chose, with the reasoning, so they are reusable decisions rather than one-off values.',
    },
  ],

  commonMistakes: [
    {
      id: 'mistake-uniform-duration',
      mistake: 'Using one duration for everything.',
      why: 'Short distances feel sluggish and long ones feel abrupt, because duration should follow distance.',
      instead: 'Scale duration with distance and significance.',
    },
    {
      id: 'mistake-linear-easing',
      mistake: 'Using linear easing for interface motion.',
      why: 'Constant velocity does not occur physically, so it reads as mechanical.',
      instead: 'Use ease-out for entrances, ease-in for exits.',
    },
    {
      id: 'mistake-symmetric-timing',
      mistake: 'Using the same timing for enter and exit.',
      why: 'Dismissal feels like waiting, because the user has already decided.',
      instead: 'Make exits shorter and accelerating.',
    },
    {
      id: 'mistake-too-slow',
      mistake: 'Durations above 400ms for routine transitions.',
      why: 'The interface feels slow, and at repetition it feels obstructive.',
      instead: 'Keep routine motion under 300ms and judge at frequency.',
    },
  ],

  eliteConsiderations: [
    {
      kind: 'list',
      items: [
        'Tokenise durations and curves; ad-hoc timing is visible in aggregate.',
        'Acknowledge input within 100ms regardless of how long the transition takes.',
        'Scale duration with distance travelled rather than picking one value per component.',
        'Evaluate every timing decision at repetition, in the browser, against alternatives.',
      ],
    },
  ],

  practicalExercise: {
    id: 'exercise-10-02',
    title: 'Compare transitions and document perception',
    prompt:
      'Build a comparison harness and derive motion tokens from what you observe.',
    steps: [
      'Build one transition switchable between 100, 200, 300, and 500ms without reloading.',
      'Record in words what each duration feels like.',
      'Hold duration constant and vary the curve across four options.',
      'Compare asymmetric timing against symmetrical timing directly.',
      'Test each candidate at twenty repetitions.',
      'Choose durations and curves and write them as tokens.',
      'Document the reasoning for each token in one line.',
    ],
    successCriteria: [
      'A working comparison harness exists.',
      'Written observations exist for every duration and curve tested.',
      'Enter and exit timings differ, with the difference justified.',
      'Motion tokens are defined with written reasoning.',
      'Every candidate was judged at repetition.',
    ],
    estimatedMinutes: 45,
    hint: 'Switch between candidates without reloading. Comparison from memory is unreliable at this scale of difference.',
  },

  reflectionQuestion:
    'Should entering and leaving always use identical timing?',
  reflectionHint: 'Arrival and departure have different jobs.',

  resources: [
    {
      id: 'resource-material-easing',
      title: 'Material Design: easing and duration',
      url: 'https://m3.material.io/styles/motion/easing-and-duration/tokens-specs',
      type: 'documentation',
      estimatedMinutes: 25,
      note: 'Published duration and easing tokens with their intended uses.',
    },
    {
      id: 'resource-mdn-easing',
      title: 'MDN: easing-function',
      url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/easing-function',
      type: 'documentation',
      estimatedMinutes: 15,
      note: 'Curve syntax, including custom cubic-bezier values.',
    },
  ],

  competencyTags: ['interaction-design', 'motion', 'design-systems'],

  completionCriteria: [
    'Has compared durations and curves systematically.',
    'Motion tokens are defined with written reasoning.',
    'Enter and exit timings differ deliberately.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Lesson 48                                                                   */
/* -------------------------------------------------------------------------- */

const LESSON_48: Lesson = {
  id: 'lesson-10-03',
  slug: 'spatial-continuity',
  moduleId: MODULE_ID,
  lessonNumber: 3,
  title: 'Spatial Continuity',
  summary:
    'Movement between an origin and a destination tells the user the two are the same thing. A fade tells them only that something appeared.',
  estimatedMinutes: 9,

  objectives: [
    'Identify the origin and destination of a transition.',
    'Animate shared geometry so identity is preserved.',
    'Explain what a fade-only transition fails to communicate.',
    'Build a transition that survives interruption.',
  ],

  prerequisiteConcepts: ['Timing and easing', 'Layout'],
  prerequisiteLessonIds: ['lesson-10-02'],

  recap: [
    {
      kind: 'paragraph',
      text: 'Continuity was the first job on the list. This lesson is about actually delivering it.',
    },
  ],

  coreConcept: [
    {
      kind: 'paragraph',
      text: 'When something opens, it comes from somewhere. A dropdown originates at its trigger, a detail panel originates at the row that was clicked, a sheet originates at the edge it slides from. Animating that relationship makes the connection legible without explanation.',
    },
    {
      kind: 'paragraph',
      text: 'Opacity communicates existence: this is here now, that is gone. It says nothing about relationship. A card that fades out while a detail panel fades in leaves the user to infer that the two are connected, and the inference costs a moment every time.',
    },
    {
      kind: 'callout',
      tone: 'insight',
      body: 'A shared-element transition answers "where did this come from?" before the user has to ask it.',
    },
  ],

  firstPrinciples: [
    {
      kind: 'paragraph',
      text: 'Perception treats continuous movement as continuous identity. An object that moves across the visual field is understood to be the same object, without any conscious reasoning — which is why continuity is the cheapest form of explanation available.',
    },
    {
      kind: 'paragraph',
      text: 'Break the movement and the identity breaks with it. Disappear here, appear there, and the two are separate events that the user must connect themselves.',
    },
  ],

  designPerspective: [
    {
      kind: 'paragraph',
      text: 'Continuity also answers the return question. If a panel grows from a row, closing it back into the same row tells the user where they will land. A panel that fades away leaves them to re-find their place in the list.',
    },
    {
      kind: 'paragraph',
      text: 'On a list of two hundred rows, that difference is substantial and repeated on every interaction.',
    },
  ],

  engineeringPerspective: [
    {
      kind: 'code',
      language: 'ts',
      caption: 'Measuring the origin, then animating geometry rather than layout.',
      code: `// Measure first: reading layout after a write forces a synchronous layout.
const from = trigger.getBoundingClientRect();
const to = panel.getBoundingClientRect();

// Animate transform and opacity only — both run off the main thread.
panel.animate(
  [
    {
      transform: \`translate(\${from.left - to.left}px, \${from.top - to.top}px)
                  scale(\${from.width / to.width}, \${from.height / to.height})\`,
      opacity: 0.6,
    },
    { transform: 'none', opacity: 1 },
  ],
  { duration: 280, easing: 'cubic-bezier(0.2, 0, 0, 1)', fill: 'both' },
);`,
    },
    {
      kind: 'paragraph',
      text: 'Animate `transform` and `opacity` and nothing else. Width, height, top, and left trigger layout on every frame; transform and opacity are composited, which is the difference between a smooth transition and a stuttering one on a mid-range device.',
    },
    {
      kind: 'paragraph',
      text: 'The View Transitions API is beginning to make this pattern declarative for same-document and cross-document navigations, which removes most of the manual measurement.',
    },
  ],

  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'Spatial continuity requires design and implementation to agree on the origin. A design file showing a panel appearing does not say where it came from, so the engineer decides — usually by fading, because that is what is easiest.',
    },
    {
      kind: 'paragraph',
      text: 'Specifying the origin is a small addition to a specification and the difference between a connected transition and a disconnected one.',
    },
  ],

  industryExamples: [
    {
      id: 'example-shared-element',
      source: 'Mobile platform transitions',
      title: 'List to detail with shared geometry',
      observation:
        'Platform navigation commonly expands the tapped row into the detail view and collapses it back on return.',
      takeaway:
        'The user never loses their place, because the transition told them where they went and where they will land.',
    },
    {
      id: 'example-view-transitions',
      source: 'View Transitions API',
      title: 'Continuity becoming declarative',
      observation:
        'Browsers now support declaring that two elements across states are the same element, animating between them automatically.',
      takeaway:
        'The manual measurement disappears; the design decision about origin does not.',
    },
  ],

  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Animating a card into a detail panel.',
    },
    { kind: 'heading', text: '1. Name the origin and destination' },
    {
      kind: 'paragraph',
      text: 'The card is the origin, the panel the destination. Identify what they share — usually a title and an image.',
    },
    { kind: 'heading', text: '2. Measure both before animating' },
    {
      kind: 'paragraph',
      text: 'All reads first, then all writes. Interleaving forces a layout per frame.',
    },
    { kind: 'heading', text: '3. Animate transform and opacity only' },
    {
      kind: 'paragraph',
      text: 'Translate and scale from the origin\'s geometry to the destination\'s. No width, height, top, or left.',
    },
    { kind: 'heading', text: '4. Reverse it on close' },
    {
      kind: 'paragraph',
      text: 'Back into the same card. The return matters as much as the arrival, and is usually the part omitted.',
    },
    { kind: 'heading', text: '5. Handle interruption' },
    {
      kind: 'paragraph',
      text: 'Close mid-open. The transition should reverse from its current position, not jump and restart.',
    },
    { kind: 'heading', text: '6. Test on a slow device' },
    {
      kind: 'paragraph',
      text: 'Throttle the CPU. A transition that only works on a fast machine is not finished.',
    },
  ],

  commonMistakes: [
    {
      id: 'mistake-fade-only',
      mistake: 'Using a crossfade for a list-to-detail transition.',
      why: 'Opacity communicates existence, not relationship, so the user must infer the connection every time.',
      instead: 'Animate shared geometry from the origin.',
    },
    {
      id: 'mistake-animate-layout-props',
      mistake: 'Animating width, height, top, or left.',
      why: 'Each frame triggers layout, so the animation stutters on anything but a fast device.',
      instead: 'Animate transform and opacity only.',
    },
    {
      id: 'mistake-no-reverse',
      mistake: 'Animating the opening but not the closing.',
      why: 'The user is returned to the list with no indication of where they will land.',
      instead: 'Reverse the transition back into its origin.',
    },
    {
      id: 'mistake-interruption-jump',
      mistake: 'Restarting a transition when it is interrupted.',
      why: 'The element jumps, which is more disorienting than no animation at all.',
      instead: 'Reverse from the current position.',
    },
  ],

  eliteConsiderations: [
    {
      kind: 'list',
      items: [
        'Always design the return transition; it is the half most often skipped and the half that preserves orientation.',
        'Use the Web Animations API or View Transitions so interruption can be handled properly.',
        'Test with CPU throttling — compositor-only animation is what survives it.',
        'When a true shared element is impractical, a directional slide from the origin still beats a fade.',
      ],
    },
  ],

  practicalExercise: {
    id: 'exercise-10-03',
    title: 'Animate a card into a detail panel',
    prompt:
      'Build a list-to-detail transition that preserves identity in both directions.',
    steps: [
      'Identify the origin, the destination, and the geometry they share.',
      'Measure both before writing any animation.',
      'Animate transform and opacity only.',
      'Implement the reverse transition back into the originating card.',
      'Handle interruption by reversing from the current position.',
      'Compare directly against a crossfade version of the same transition.',
      'Test with CPU throttling enabled.',
      'Verify focus moves to the panel on open and returns to the card on close.',
    ],
    successCriteria: [
      'Only transform and opacity are animated.',
      'The reverse transition returns to the originating card.',
      'Interruption reverses smoothly rather than jumping.',
      'The transition holds up under CPU throttling.',
      'Focus moves to the panel and returns to the card.',
    ],
    estimatedMinutes: 55,
    hint: 'Build the reverse transition immediately after the forward one. Left until later, it does not get built.',
  },

  reflectionQuestion: 'Why can fade-only transitions feel disconnected?',
  reflectionHint:
    'Opacity explains visibility, not spatial relationship.',

  resources: [
    {
      id: 'resource-view-transitions',
      title: 'MDN: View Transitions API',
      url: 'https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API',
      type: 'documentation',
      estimatedMinutes: 30,
      note: 'Declarative shared-element transitions.',
    },
    {
      id: 'resource-waapi',
      title: 'MDN: Web Animations API',
      url: 'https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API',
      type: 'documentation',
      estimatedMinutes: 30,
      note: 'Playback control, which is what makes interruption handling possible.',
    },
    {
      id: 'resource-animations-performance',
      title: 'Animations and performance',
      url: 'https://web.dev/articles/animations-guide',
      type: 'article',
      estimatedMinutes: 20,
      note: 'Why transform and opacity are the only cheap properties.',
    },
  ],

  competencyTags: ['motion', 'browser-apis', 'performance', 'interaction-engineering'],

  completionCriteria: [
    'Has built a shared-element transition in both directions.',
    'Interruption reverses rather than jumping.',
    'The transition survives CPU throttling.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Lesson 49                                                                   */
/* -------------------------------------------------------------------------- */

const LESSON_49: Lesson = {
  id: 'lesson-10-04',
  slug: 'direct-manipulation',
  moduleId: MODULE_ID,
  lessonNumber: 4,
  title: 'Direct Manipulation',
  summary:
    'When the interface tracks the pointer exactly, the user is moving the object. Thresholds and constraints are what make that feel reliable rather than loose.',
  estimatedMinutes: 9,

  objectives: [
    'Track pointer input so the object follows exactly.',
    'Set thresholds that separate intent from accident.',
    'Use constraints and snapping to make outcomes predictable.',
    'Apply velocity so a gesture completes the way it was thrown.',
  ],

  prerequisiteConcepts: ['Events', 'Spatial continuity'],
  prerequisiteLessonIds: ['lesson-10-03', 'lesson-05-02'],

  recap: [
    {
      kind: 'paragraph',
      text: 'Transitions animate between states the system chose. Direct manipulation hands the timing to the user.',
    },
  ],

  coreConcept: [
    {
      kind: 'paragraph',
      text: 'Direct manipulation means the object tracks the input exactly — one to one, with no easing, no delay, no smoothing. Any lag breaks the illusion that you are touching the thing rather than instructing the system about it.',
    },
    {
      kind: 'list',
      items: [
        'Threshold — the movement required before a drag begins, so a click is not a drag.',
        'Constraint — the axes and bounds the object may move within.',
        'Snapping — discrete positions the object settles to, so outcomes are unambiguous.',
        'Velocity — the speed at release, which decides whether a gesture completes or returns.',
      ],
    },
    {
      kind: 'paragraph',
      text: 'The acceptance boundary is the core design decision: what counts as far enough, or fast enough, to mean yes. Get it wrong in one direction and accidental gestures commit; wrong in the other and deliberate ones bounce back.',
    },
    {
      kind: 'callout',
      tone: 'insight',
      body: 'Snap back when the system cannot be confident the user meant it. That confidence is a threshold you choose, and it should account for both distance and velocity.',
    },
  ],

  firstPrinciples: [
    {
      kind: 'paragraph',
      text: 'Distance alone is a poor test of intent. A short, fast flick is clearly deliberate; a long, slow drag that stops halfway is genuinely ambiguous. Combining distance with velocity captures both cases.',
    },
    {
      kind: 'paragraph',
      text: 'The rule that works well in practice: complete if the object passed a distance threshold, or if it was released above a velocity threshold moving in the completing direction. Otherwise return it.',
    },
  ],

  designPerspective: [
    {
      kind: 'paragraph',
      text: 'Direct manipulation needs continuous feedback about what will happen on release. A row dragged over a delete zone should show the zone activating; a sheet dragged past its dismiss threshold should indicate it will dismiss.',
    },
    {
      kind: 'paragraph',
      text: 'Without that, the gesture is a guess, and the user learns the thresholds by making mistakes rather than by reading the interface.',
    },
  ],

  engineeringPerspective: [
    {
      kind: 'code',
      language: 'ts',
      caption: 'A threshold to start, and a two-part test to complete.',
      code: `const DRAG_THRESHOLD = 8;      // px before a press becomes a drag
const COMMIT_DISTANCE = 120;   // px past which release commits
const COMMIT_VELOCITY = 0.5;   // px/ms — a flick commits from anywhere

element.addEventListener('pointerdown', (event) => {
  element.setPointerCapture(event.pointerId);  // keep events during the drag
  const startX = event.clientX;
  const startTime = performance.now();
  let dragging = false;
  let lastX = startX;

  const onMove = (move: PointerEvent) => {
    const dx = move.clientX - startX;
    if (!dragging && Math.abs(dx) < DRAG_THRESHOLD) return;  // still a click
    dragging = true;
    lastX = move.clientX;
    element.style.transform = \`translateX(\${dx}px)\`;  // exact, no easing
  };

  const onUp = () => {
    const dx = lastX - startX;
    const velocity = Math.abs(dx) / (performance.now() - startTime);
    const commit = Math.abs(dx) > COMMIT_DISTANCE || velocity > COMMIT_VELOCITY;
    commit ? complete(Math.sign(dx)) : snapBack();
    element.removeEventListener('pointermove', onMove);
  };

  element.addEventListener('pointermove', onMove);
  element.addEventListener('pointerup', onUp, { once: true });
});`,
    },
    {
      kind: 'paragraph',
      text: 'Pointer capture is what makes a drag survive the pointer leaving the element — without it, moving quickly drops the gesture. And the transform is written directly during the drag, with easing applied only to the settle animation afterwards.',
    },
  ],

  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'Thresholds are design decisions expressed as numbers, and they can only be judged by using them. A threshold that reads as reasonable on paper is frequently wrong in the hand.',
    },
    {
      kind: 'paragraph',
      text: 'They also need a keyboard equivalent. A reorder that exists only as a drag is unavailable to a substantial group of users, so every drag interaction needs a keyboard path to the same outcome.',
    },
  ],

  industryExamples: [
    {
      id: 'example-sheet-dismiss',
      source: 'Mobile sheets',
      title: 'Distance or velocity, either one',
      observation:
        'Sheets dismiss when dragged past a threshold or flicked quickly, so both a deliberate pull and a quick flick work.',
      takeaway:
        'One test alone fails a common gesture; combining them covers the real range of intent.',
    },
    {
      id: 'example-drag-keyboard',
      source: 'Accessible drag-and-drop implementations',
      title: 'A keyboard path to the same outcome',
      observation:
        'Well-built reordering offers a keyboard mode — pick up, move with arrows, drop — alongside pointer dragging.',
      takeaway:
        'A drag-only interaction excludes anyone who cannot perform a sustained pointer gesture.',
    },
  ],

  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Prototyping reorderable items.',
    },
    { kind: 'heading', text: '1. Track exactly, with no smoothing' },
    {
      kind: 'paragraph',
      text: 'The item follows the pointer one to one. Any easing during the drag breaks the connection.',
    },
    { kind: 'heading', text: '2. Add the start threshold' },
    {
      kind: 'paragraph',
      text: 'A few pixels before a press becomes a drag, so clicking still works.',
    },
    { kind: 'heading', text: '3. Constrain the axis' },
    {
      kind: 'paragraph',
      text: 'A vertical list drags vertically. Unconstrained movement suggests possibilities that do not exist.',
    },
    { kind: 'heading', text: '4. Show the destination continuously' },
    {
      kind: 'paragraph',
      text: 'A gap opening where the item would land. The user should never have to guess the outcome.',
    },
    { kind: 'heading', text: '5. Snap and settle' },
    {
      kind: 'paragraph',
      text: 'On release, animate to the final position with ease-out. This is the only part that is animated.',
    },
    { kind: 'heading', text: '6. Add the keyboard path' },
    {
      kind: 'paragraph',
      text: 'Space to pick up, arrows to move, Space to drop, Escape to cancel — with each move announced.',
    },
  ],

  commonMistakes: [
    {
      id: 'mistake-smoothed-drag',
      mistake: 'Easing the object during the drag.',
      why: 'It lags behind the pointer, which breaks the sense of touching the object directly.',
      instead: 'Track exactly while dragging; animate only the settle.',
    },
    {
      id: 'mistake-no-threshold',
      mistake: 'Starting a drag on the first pixel of movement.',
      why: 'Clicks become accidental drags, because no press is perfectly still.',
      instead: 'Require a few pixels before committing to a drag.',
    },
    {
      id: 'mistake-distance-only',
      mistake: 'Deciding completion on distance alone.',
      why: 'A deliberate fast flick covers little distance and gets rejected.',
      instead: 'Combine distance with release velocity.',
    },
    {
      id: 'mistake-drag-only',
      mistake: 'Offering reordering only as a pointer drag.',
      why: 'Anyone who cannot perform a sustained pointer gesture cannot reorder at all.',
      instead: 'Provide a keyboard path to the same outcome.',
    },
  ],

  eliteConsiderations: [
    {
      kind: 'list',
      items: [
        'Use pointer capture so a fast drag does not escape the element.',
        'Mark touch listeners passive except where you genuinely need to prevent scrolling.',
        'Announce keyboard drag steps in a live region — position changes are invisible otherwise.',
        'Tune thresholds by using them, not by reasoning about the numbers.',
      ],
    },
  ],

  practicalExercise: {
    id: 'exercise-10-04',
    title: 'Prototype reorderable items',
    prompt:
      'Build a reorderable list with exact tracking, sensible thresholds, and a keyboard path.',
    steps: [
      'Track the pointer exactly during the drag, with no easing.',
      'Add a start threshold so clicks still work.',
      'Constrain movement to the list axis.',
      'Show the destination continuously while dragging.',
      'Decide completion using distance or release velocity.',
      'Animate the settle with ease-out, and nothing else.',
      'Add a keyboard path: pick up, move, drop, cancel.',
      'Announce every keyboard move in a live region.',
      'Tune the thresholds by using the interaction, and record the final values.',
    ],
    successCriteria: [
      'The item tracks the pointer with no perceptible lag.',
      'A click does not start a drag.',
      'Both a slow drag past the threshold and a quick flick complete.',
      'Reordering is fully possible by keyboard, with moves announced.',
      'Threshold values are recorded with the reasoning behind them.',
    ],
    estimatedMinutes: 60,
    hint: 'Build the keyboard path first. Designed after the drag, it ends up as an afterthought that does not match.',
  },

  reflectionQuestion: 'When should movement snap back?',
  reflectionHint: 'The system needs a clear acceptance boundary.',

  resources: [
    {
      id: 'resource-mdn-pointer-events-10',
      title: 'MDN: pointer events',
      url: 'https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events',
      type: 'documentation',
      estimatedMinutes: 25,
      note: 'One model for mouse, touch, and pen, including pointer capture.',
    },
    {
      id: 'resource-apg-listbox-reorder',
      title: 'ARIA Authoring Practices: listbox with rearrangeable options',
      url: 'https://www.w3.org/WAI/ARIA/apg/patterns/listbox/examples/listbox-rearrangeable/',
      type: 'specification',
      estimatedMinutes: 25,
      note: 'The keyboard model for reordering, with announcements.',
    },
  ],

  competencyTags: [
    'interaction-design',
    'accessibility',
    'browser-apis',
    'interaction-engineering',
  ],

  completionCriteria: [
    'Has built reordering with exact tracking and tuned thresholds.',
    'A keyboard path exists with announced moves.',
    'Completion uses both distance and velocity.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Lesson 50                                                                   */
/* -------------------------------------------------------------------------- */

const LESSON_50: Lesson = {
  id: 'lesson-10-05',
  slug: 'reduced-motion',
  moduleId: MODULE_ID,
  lessonNumber: 5,
  title: 'Reduced Motion',
  summary:
    'Reduced motion is a medical accommodation, not a preference for less delight. It removes spatial movement while keeping the feedback intact.',
  estimatedMinutes: 9,

  objectives: [
    'Explain the vestibular effects that make this a medical setting.',
    'Respond to prefers-reduced-motion in CSS and in JavaScript.',
    'Design meaningful alternatives rather than removing feedback.',
    'Identify which movement is problematic and which is not.',
  ],

  prerequisiteConcepts: ['Motion jobs', 'Direct manipulation'],
  prerequisiteLessonIds: ['lesson-10-04'],

  recap: [
    {
      kind: 'paragraph',
      text: 'Motion does five jobs. For some users, the way those jobs are currently delivered causes physical symptoms.',
    },
  ],

  coreConcept: [
    {
      kind: 'paragraph',
      text: 'The vestibular system infers motion from visual input as well as from the inner ear. Large-scale movement on screen can register as self-motion, and for people with vestibular disorders the conflict produces nausea, dizziness, and headaches lasting well beyond the interaction.',
    },
    {
      kind: 'paragraph',
      text: 'Not all motion causes this. The problematic kinds are specific and identifiable.',
    },
    {
      kind: 'list',
      items: [
        'Large movements across a significant portion of the viewport.',
        'Parallax, where layers move at different rates.',
        'Zoom and scale changes, particularly large ones.',
        'Spinning or rotation.',
        'Anything long enough to be followed rather than glimpsed.',
      ],
    },
    {
      kind: 'callout',
      tone: 'warning',
      body: 'Removing all animation is the wrong response. It strips out the feedback that tells people the system responded, which makes the interface worse for everyone who set the preference.',
    },
  ],

  firstPrinciples: [
    {
      kind: 'paragraph',
      text: 'The jobs motion does — feedback, causality, hierarchy — still need doing for a user with reduced motion enabled. What has to change is the mechanism, not the communication.',
    },
    {
      kind: 'paragraph',
      text: 'A colour change, a very short fade, an immediate state change: all of these deliver feedback without spatial movement. The user still learns that the system responded; they simply do not experience the traversal.',
    },
  ],

  designPerspective: [
    {
      kind: 'paragraph',
      text: 'The reduced-motion version should be designed, not derived by deletion. Ask, for each animation: what is this communicating, and what is the smallest non-spatial way to communicate it?',
    },
    {
      kind: 'paragraph',
      text: 'A panel that normally slides in can appear with a 50ms opacity change. The continuity is weaker, but the state change is still clear, and nothing was silently removed.',
    },
  ],

  engineeringPerspective: [
    {
      kind: 'code',
      language: 'css',
      caption: 'Replacing spatial movement, not removing feedback.',
      code: `.panel {
  transition: transform 280ms var(--ease-out), opacity 280ms var(--ease-out);
}

@media (prefers-reduced-motion: reduce) {
  .panel {
    /* No traversal. Opacity still confirms the state change. */
    transition: opacity 80ms linear;
    transform: none;
  }

  /* Decorative and looping motion goes entirely. */
  .pulse, .float, .parallax-layer { animation: none; }
}

/* Feedback that was never spatial is unaffected either way. */
.button { transition: background-color 120ms ease-out; }`,
    },
    {
      kind: 'paragraph',
      text: 'JavaScript animations need the same treatment. `matchMedia(\'(prefers-reduced-motion: reduce)\')` gives the current value, and listening for changes means the interface responds when the user changes the setting without reloading.',
    },
  ],

  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'This is a place where an accessibility requirement improves the design process. Producing a reduced-motion version forces the question of what each animation actually communicates — and animations that cannot be answered are usually ones that should not exist.',
    },
    {
      kind: 'paragraph',
      text: 'The audit from Lesson 46 and this one converge: motion with a stated job has an obvious non-spatial alternative, and motion without one simply goes.',
    },
  ],

  industryExamples: [
    {
      id: 'example-os-level-setting',
      source: 'Operating system accessibility settings',
      title: 'A setting users have already made',
      observation:
        'Every major platform exposes a reduce-motion setting, and browsers surface it to CSS and JavaScript.',
      takeaway:
        'The user has already told you. Ignoring the signal is a choice, not an oversight.',
    },
    {
      id: 'example-reduced-not-removed',
      source: 'Products with designed reduced-motion modes',
      title: 'Alternatives rather than deletion',
      observation:
        'Careful implementations replace spatial transitions with short opacity changes rather than disabling all animation.',
      takeaway:
        'Feedback survives; only the traversal is removed.',
    },
  ],

  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Creating standard and reduced-motion versions of one interaction.',
    },
    { kind: 'heading', text: '1. State what the animation communicates' },
    {
      kind: 'paragraph',
      text: 'One sentence. This is what the alternative has to preserve.',
    },
    { kind: 'heading', text: '2. Classify the movement' },
    {
      kind: 'paragraph',
      text: 'Large traversal, scale, parallax, rotation — problematic. A colour change is not.',
    },
    { kind: 'heading', text: '3. Design the alternative' },
    {
      kind: 'paragraph',
      text: 'The smallest non-spatial thing that still communicates the same message. Usually a short opacity change.',
    },
    { kind: 'heading', text: '4. Implement in both CSS and JavaScript' },
    {
      kind: 'paragraph',
      text: 'A media query is not enough if any animation is driven from script.',
    },
    { kind: 'heading', text: '5. Respond to changes at runtime' },
    {
      kind: 'paragraph',
      text: 'Listen for the media query changing, so toggling the setting takes effect without a reload.',
    },
    { kind: 'heading', text: '6. Use the reduced version properly' },
    {
      kind: 'paragraph',
      text: 'Enable the setting and complete the whole flow. Anything that became unclear is feedback that was removed rather than replaced.',
    },
  ],

  commonMistakes: [
    {
      id: 'mistake-disable-all-motion',
      mistake: 'Setting all animation durations to zero.',
      why: 'It removes feedback along with movement, so users lose confirmation that anything happened.',
      instead: 'Replace spatial movement with non-spatial feedback.',
    },
    {
      id: 'mistake-css-only',
      mistake: 'Handling reduced motion only in CSS.',
      why: 'Script-driven animations keep running, which is usually where the largest movements are.',
      instead: 'Check the media query in JavaScript too.',
    },
    {
      id: 'mistake-ignore-runtime-change',
      mistake: 'Reading the preference once at load.',
      why: 'Changing the setting has no effect until reload, which makes the control appear broken.',
      instead: 'Listen for changes to the media query.',
    },
    {
      id: 'mistake-reduced-is-afterthought',
      mistake: 'Adding reduced motion at the end of a project.',
      why: 'The alternatives end up derived by deletion, because nobody recorded what each animation communicated.',
      instead: 'Design both versions together, from the stated job.',
    },
  ],

  eliteConsiderations: [
    {
      kind: 'list',
      items: [
        'Design the reduced version alongside the standard one, not afterwards.',
        'Keep non-spatial feedback — colour, opacity, immediate state — in both versions.',
        'Test the whole flow with the setting enabled, not just individual components.',
        'Treat reduced motion as a supported mode with its own review, not as a fallback.',
      ],
    },
  ],

  practicalExercise: {
    id: 'exercise-10-05',
    title: 'Create standard and reduced-motion versions',
    prompt:
      'Build both versions of one interaction, designing the alternative rather than deriving it by deletion.',
    steps: [
      'Choose an interaction with significant spatial movement.',
      'Write down what the animation communicates.',
      'Classify each movement as problematic or not.',
      'Design a non-spatial alternative preserving the same message.',
      'Implement it in CSS and in any JavaScript-driven animation.',
      'Listen for the media query changing at runtime.',
      'Enable the setting and complete the entire flow.',
      'Record anything that became unclear, and fix it by adding feedback rather than motion.',
    ],
    successCriteria: [
      'The reduced version preserves feedback rather than removing it.',
      'Both CSS and script-driven animation respect the preference.',
      'Changing the setting takes effect without a reload.',
      'The full flow was completed with the setting enabled.',
      'What each animation communicates is written down for both versions.',
    ],
    estimatedMinutes: 50,
    hint: 'Ask what the animation is telling the user. The alternative has to tell them the same thing without moving anything across the screen.',
  },

  reflectionQuestion: 'Does reduced motion always mean no animation?',
  reflectionHint: 'Movement and feedback are not identical.',

  resources: [
    {
      id: 'resource-mdn-prefers-reduced-motion',
      title: 'MDN: prefers-reduced-motion',
      url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion',
      type: 'documentation',
      estimatedMinutes: 10,
      note: 'The query, and how to read it from script.',
    },
    {
      id: 'resource-vestibular',
      title: 'Designing safer web animation for motion sensitivity',
      url: 'https://alistapart.com/article/designing-safer-web-animation-for-motion-sensitivity/',
      type: 'article',
      author: 'Val Head',
      estimatedMinutes: 20,
      note: 'Which specific kinds of movement cause symptoms, and why.',
    },
    {
      id: 'resource-wcag-animation',
      title: 'WCAG: animation from interactions',
      url: 'https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html',
      type: 'specification',
      estimatedMinutes: 15,
      note: 'The success criterion and what it actually requires.',
    },
  ],

  competencyTags: ['interaction-design', 'motion', 'accessibility'],

  completionCriteria: [
    'Has built both standard and reduced-motion versions.',
    'Feedback is preserved in the reduced version.',
    'The preference is respected in CSS and in script, at runtime.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Project                                                                     */
/* -------------------------------------------------------------------------- */

const PROJECT: ModuleProject = {
  id: 'project-10',
  slug: 'polished-command-menu-or-file-browser',
  moduleId: MODULE_ID,
  title: 'Polished Command Menu or File Browser',
  brief:
    'Build a command menu or file browser to a high standard of interaction quality: keyboard control, justified transitions, reduced motion, focus management, and complete loading and error states.',
  problem:
    'This is where everything in the course so far has to hold at once. The interaction has to be fast under the keyboard, legible in its transitions, correct for someone who cannot tolerate motion, and honest about loading and failure — and any one of those being slightly wrong is immediately noticeable in an interface people use repeatedly. Quality at this level is not a final polish pass; it is the accumulation of decisions made throughout.',
  objectives: [
    'Deliver complete keyboard control with correct focus management.',
    'Justify every transition by the job it does.',
    'Support reduced motion as a designed mode.',
    'Handle every asynchronous state without a flash or a stale result.',
  ],
  requirements: [
    'Full keyboard control, including navigation, activation, and dismissal.',
    'Transitions with a stated job for each.',
    'A designed reduced-motion mode, not a disabled one.',
    'Focus trapped while open and restored on every close path.',
    'Loading, empty, and error states, each visibly distinct.',
    'A level of interaction quality that holds up at repetition.',
  ],
  constraints: [
    'Only transform and opacity may be animated.',
    'Durations and easing must come from tokens.',
    'Every animation must carry a written job.',
    'The interface must be fully usable with the mouse unplugged.',
  ],
  suggestedScope:
    'One surface — a command menu or a file browser — built to a standard you would ship. Do not add a second surface; the deliverable is depth of quality, not breadth of features.',
  deliverables: [
    'The working interface with every requirement met.',
    'A motion specification: every animation, its job, its duration, and its curve.',
    'A keyboard specification covering every key and its behaviour.',
    'A reduced-motion specification stating the alternative for each animation.',
    'Evidence of testing under CPU throttling and network throttling.',
  ],
  completionCriteria: [
    'Every action is reachable and performable by keyboard alone, with the mouse unplugged.',
    'Focus is restored to the trigger on every close path, without exception.',
    'Every animation has a written job, a token duration, and a token curve.',
    'The reduced-motion mode preserves feedback and was tested across the whole flow.',
    'No stale result or loading flash occurs under network throttling.',
  ],
  portfolioEvidence: [
    'Keyboard interaction design',
    'Focus management',
    'Motion specification and implementation',
    'Reduced-motion support',
    'Async state handling under adverse conditions',
  ],
  reflectionQuestion:
    'Which detail would a user never consciously notice, but would feel the absence of?',
  estimatedHours: 26,
  competencies: [
    'interaction-design',
    'motion',
    'accessibility',
    'async-systems',
    'performance',
    'interaction-engineering',
  ],
  stretchGoals: [
    'Add a shared-element transition between the menu and a detail view, in both directions.',
    'Add drag-based reordering with a matching keyboard path and announced moves.',
  ],
};

/* -------------------------------------------------------------------------- */

export const MODULE_10: CurriculumModule = {
  id: MODULE_ID,
  slug: 'interaction-and-motion-engineering',
  moduleNumber: 10,
  phase: 'interaction-and-motion',
  title: 'Interaction and Motion Engineering',
  description:
    'What motion is for, how long it should take, how it preserves spatial relationships, how direct manipulation works, and what to build for people who cannot tolerate movement.',
  outcome: 'Can design and implement motion that does a job and excludes no one.',
  prerequisites: [
    'Modules 1 to 9, or equivalent',
    'Comfortable with CSS transitions and JavaScript events',
  ],
  lessons: [LESSON_46, LESSON_47, LESSON_48, LESSON_49, LESSON_50],
  resources: [
    {
      id: 'resource-module-10-material-motion',
      title: 'Material Design: motion',
      url: 'https://m3.material.io/styles/motion/overview',
      type: 'documentation',
      estimatedMinutes: 90,
      note: 'Motion categorised by purpose, with published duration and easing tokens.',
    },
    {
      id: 'resource-module-10-animations-guide',
      title: 'Animations guide',
      url: 'https://web.dev/articles/animations-guide',
      type: 'article',
      estimatedMinutes: 45,
      note: 'Which properties are cheap to animate, and why the rest are not.',
    },
    {
      id: 'resource-module-10-apple-motion',
      title: 'Apple Human Interface Guidelines: motion',
      url: 'https://developer.apple.com/design/human-interface-guidelines/motion',
      type: 'documentation',
      estimatedMinutes: 30,
      note: 'Restraint, continuity, and reduced motion treated as a supported mode.',
    },
  ],
  project: PROJECT,
  competencies: [
    'interaction-design',
    'motion',
    'accessibility',
    'design-systems',
    'product-judgement',
    'browser-apis',
    'async-systems',
    'performance',
    'interaction-engineering',
  ],
  completionCriteria: [
    'All five lessons completed.',
    'Module project marked completed.',
    'Can specify and implement motion that is justified, performant, and inclusive.',
  ],
};
