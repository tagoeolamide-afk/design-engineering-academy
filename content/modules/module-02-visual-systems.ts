/**
 * Module 02 — Visual Systems.
 *
 * Visual design treated as a repeatable system: hierarchy, spacing, type,
 * colour, and grid as decisions that compose rather than as per-screen styling.
 */

import type { CurriculumModule, Lesson, ModuleProject } from '@/types/curriculum';

const MODULE_ID = 'module-02';

/* -------------------------------------------------------------------------- */
/* Lesson 6                                                                    */
/* -------------------------------------------------------------------------- */

const LESSON_6: Lesson = {
  id: 'lesson-02-01',
  slug: 'visual-hierarchy',
  moduleId: MODULE_ID,
  lessonNumber: 1,
  title: 'Visual Hierarchy',
  summary:
    'Hierarchy is the order in which an interface is read. It is produced by relative difference, not by making important things large.',
  estimatedMinutes: 8,

  objectives: [
    'Separate importance from attention.',
    'Produce hierarchy using weight, size, contrast, proximity, and placement.',
    'Establish three legible levels in a dense screen.',
    'Diagnose a flat interface by identifying what competes.',
  ],

  prerequisiteConcepts: ['Interfaces as state systems'],
  prerequisiteLessonIds: ['lesson-01-01'],

  recap: [
    {
      kind: 'paragraph',
      text: 'Module 1 established that a screen is a representation of state. This module is about making that representation legible, starting with the order in which it gets read.',
    },
  ],

  coreConcept: [
    {
      kind: 'paragraph',
      text: 'Hierarchy is not a property of an element. It is a relationship between elements. Nothing is prominent on its own; it is prominent relative to what surrounds it.',
    },
    {
      kind: 'paragraph',
      text: 'That is why "make the heading bigger" so often fails. If everything is already large, a larger heading changes nothing. Hierarchy improves when differences increase, which usually means making the unimportant things quieter rather than the important thing louder.',
    },
    {
      kind: 'list',
      items: [
        'Size — reliable, but expensive in space and quickly exhausted.',
        'Weight — cheaper than size and often more precise at small sizes.',
        'Contrast — a muted label next to full-strength text separates them without any size change.',
        'Proximity — things close together read as one unit before anything else is considered.',
        'Placement — position carries meaning: first, top-left, and alone all signal importance.',
        'Grouping — a shared container or rule creates a level without touching the type at all.',
      ],
    },
    {
      kind: 'callout',
      tone: 'insight',
      body: 'Most flat interfaces do not need a bigger headline. They need three quieter things.',
    },
  ],

  firstPrinciples: [
    {
      kind: 'paragraph',
      text: 'Reading is sequential, and the eye picks its next target by contrast against the surrounding field. An interface therefore has a reading order whether or not one was designed — the question is only whether it matches the order you intended.',
    },
    {
      kind: 'paragraph',
      text: 'Squinting works as a test for exactly this reason: it removes detail and leaves only the relative difference in value and mass, which is the signal the eye is using to choose where to go first.',
    },
  ],

  designPerspective: [
    {
      kind: 'paragraph',
      text: 'Three levels is a practical ceiling for most screens: primary (what this screen is about), secondary (supporting structure), and tertiary (metadata and labels). More levels rarely survive contact with real content, because each additional level needs its own reliable difference from the two nearest it.',
    },
    {
      kind: 'paragraph',
      text: 'The important distinction is between importance and attention. The most important element is not always the one that should shout. A destructive action is important and should not be the brightest thing on the page. A page title is the subject and often does not need to be the loudest element once the layout makes it obvious.',
    },
  ],

  engineeringPerspective: [
    {
      kind: 'paragraph',
      text: 'Visual hierarchy and document hierarchy are separate systems that must agree. Heading levels form an outline for assistive technology and are not a styling mechanism; choosing an h3 because it looks right is how a document ends up with an outline nobody can navigate.',
    },
    {
      kind: 'code',
      language: 'html',
      caption: 'Structure decided by meaning, appearance decided by class.',
      code: `<!-- Correct: level expresses position in the outline. -->
<h2 class="text-small font-medium">Recent activity</h2>

<!-- Wrong: level chosen because of how it looked. -->
<h4>Recent activity</h4>`,
    },
    {
      kind: 'paragraph',
      text: 'Expressing levels as a small set of named styles rather than ad-hoc values is what makes hierarchy repeatable. If a level is a decision recorded once, every screen inherits it; if it is a set of values retyped per component, it drifts within a week.',
    },
  ],

  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'Both disciplines are ordering the same content, one for the eye and one for the outline. When they disagree — a visually prominent element that is structurally a caption — a screen reader user and a sighted user are given different products.',
    },
    {
      kind: 'paragraph',
      text: 'The practical rule is to decide the outline from meaning first, then apply the visual level. Where they genuinely need to diverge, that is a decision to make consciously rather than a side effect of picking a style.',
    },
  ],

  industryExamples: [
    {
      id: 'example-linear-hierarchy',
      source: 'Linear',
      title: 'Hierarchy from restraint',
      observation:
        'Linear\'s issue list uses small type throughout. Hierarchy comes from weight and colour — title at full strength, metadata muted — rather than from size differences.',
      takeaway:
        'A dense product cannot spend space on size. Weight and contrast produce the same ordering at a fraction of the cost.',
    },
    {
      id: 'example-stripe-docs',
      source: 'Stripe documentation',
      title: 'Three levels held across long pages',
      observation:
        'Stripe\'s docs maintain a consistent three-level structure over very long documents, with a rule and a size change marking each section and a quieter treatment for inline labels.',
      takeaway:
        'Consistency across length matters more than sophistication within one screen. The reader learns the system once.',
    },
  ],

  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Establishing hierarchy in a cluttered dashboard, in the order that works.',
    },
    { kind: 'heading', text: '1. Decide the order in words' },
    {
      kind: 'paragraph',
      text: 'Before touching anything, write what should be read first, second, and third. If you cannot decide, the problem is product definition, not visual design, and no amount of styling will fix it.',
    },
    { kind: 'heading', text: '2. Flatten everything' },
    {
      kind: 'paragraph',
      text: 'Set the whole screen to one size and one weight. It will look wrong, and it establishes a baseline where every difference you add afterwards is deliberate.',
    },
    { kind: 'heading', text: '3. Demote before promoting' },
    {
      kind: 'paragraph',
      text: 'Mute the tertiary content first — labels, timestamps, counts. Hierarchy usually appears here, before you have touched the primary element at all.',
    },
    { kind: 'heading', text: '4. Group by proximity' },
    {
      kind: 'paragraph',
      text: 'Tighten related items and loosen the gaps between groups. Proximity is read before size, so this reorders the screen more than a type change would.',
    },
    { kind: 'heading', text: '5. Squint and check' },
    {
      kind: 'paragraph',
      text: 'Blur the screen. What you see first should match what you wrote in step one. If it does not, the difference is in the wrong place.',
    },
  ],

  commonMistakes: [
    {
      id: 'mistake-promote-everything',
      mistake: 'Creating hierarchy by making important things bigger.',
      why: 'Every promotion raises the floor. After three rounds everything is large and nothing is prominent.',
      instead:
        'Demote first. Quieting the supporting content produces the same contrast without consuming space.',
    },
    {
      id: 'mistake-too-many-levels',
      mistake: 'Designing five or six hierarchy levels.',
      why: 'Adjacent levels become indistinguishable under real content, and the system stops being learnable.',
      instead:
        'Hold three levels and use grouping or placement where you think you need a fourth.',
    },
    {
      id: 'mistake-heading-as-style',
      mistake: 'Choosing heading levels by appearance.',
      why: 'It corrupts the document outline that assistive technology depends on, and the damage is invisible on screen.',
      instead:
        'Pick the level from meaning, then style it however the visual system requires.',
    },
    {
      id: 'mistake-loud-destructive',
      mistake: 'Giving the most dangerous action the most visual weight.',
      why: 'Attention and importance are not the same. A prominent delete button gets pressed.',
      instead:
        'Weight actions by how often they should be taken, not by how significant they are.',
    },
  ],

  eliteConsiderations: [
    {
      kind: 'list',
      items: [
        'Test hierarchy with the worst content you have — longest title, empty state, largest number — not with the copy you wrote for the mockup.',
        'Check the hierarchy holds in dark mode; contrast relationships invert differently from what you expect.',
        'Keep one element per screen that is unambiguously first. A screen with two primary elements has none.',
        'Verify the visual order and the tab order agree. When they disagree, keyboard users are navigating a different design.',
      ],
    },
  ],

  practicalExercise: {
    id: 'exercise-02-01',
    title: 'Establish three hierarchy levels',
    prompt:
      'Take a cluttered dashboard — yours or one you find — and establish exactly three legible hierarchy levels.',
    steps: [
      'Write, in words, what should be read first, second, and third.',
      'Flatten the screen to one size and one weight.',
      'Demote the tertiary content using contrast and weight only.',
      'Regroup using proximity so related items read as units.',
      'Promote the primary element only if it is still not first after the previous steps.',
      'Squint-test and record whether the result matches step one.',
      'Repeat the squint test in dark mode, or with the longest content you can find.',
    ],
    successCriteria: [
      'Exactly three levels are used and each is distinguishable from the others.',
      'At least one level was created by demotion rather than promotion.',
      'Proximity is doing identifiable work in the result.',
      'The squint test matches the intended order.',
      'The heading structure is decided by meaning, not appearance.',
    ],
    estimatedMinutes: 35,
    hint: 'If the screen still looks flat after demoting, you have not demoted far enough. Muted text can go further than instinct suggests before it becomes unreadable.',
  },

  reflectionQuestion:
    'Should the visually largest element always represent the most important action?',
  reflectionHint:
    'Importance and attention are related, not identical. Consider a destructive action, and consider how often each element should actually be used.',

  resources: [
    {
      id: 'resource-refactoring-ui-hierarchy',
      title: 'Refactoring UI',
      url: 'https://www.refactoringui.com/',
      type: 'book',
      author: 'Adam Wathan and Steve Schoger',
      estimatedMinutes: 90,
      note: 'The chapters on hierarchy and de-emphasis are the most directly applicable material available.',
    },
    {
      id: 'resource-nngroup-scanning',
      title: 'How people read on the web',
      url: 'https://www.nngroup.com/articles/how-people-read-online/',
      type: 'article',
      author: 'Nielsen Norman Group',
      estimatedMinutes: 12,
      note: 'Evidence about scanning behaviour, which is what hierarchy is designed against.',
    },
  ],

  competencyTags: ['ux-reasoning', 'visual-hierarchy', 'layout'],

  completionCriteria: [
    'Can produce three legible levels in a dense screen.',
    'Has created hierarchy by demotion at least once.',
    'Can explain why visual level and heading level are separate decisions.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Lesson 7                                                                    */
/* -------------------------------------------------------------------------- */

const LESSON_7: Lesson = {
  id: 'lesson-02-02',
  slug: 'spacing-and-rhythm',
  moduleId: MODULE_ID,
  lessonNumber: 2,
  title: 'Spacing and Rhythm',
  summary:
    'Space is how an interface states relationships. A restricted scale makes those statements consistent and decisions fast.',
  estimatedMinutes: 8,

  objectives: [
    'Use spacing to express grouping rather than to fill area.',
    'Build and apply a restricted spacing scale.',
    'Control density deliberately for a given audience.',
    'Judge when leaving the scale is correct.',
  ],

  prerequisiteConcepts: ['Visual hierarchy', 'Proximity and grouping'],
  prerequisiteLessonIds: ['lesson-02-01'],

  recap: [
    {
      kind: 'paragraph',
      text: 'Proximity was one of the hierarchy tools in the last lesson. This lesson makes it systematic.',
    },
  ],

  coreConcept: [
    {
      kind: 'paragraph',
      text: 'Space is not emptiness. It is the primary way an interface says "these belong together and this one does not", and the eye reads it before it reads type or colour.',
    },
    {
      kind: 'paragraph',
      text: 'The single rule that fixes most spacing problems: the space inside a group must be smaller than the space around it. When a label sits closer to the field below it than the field above, the interface is asserting a relationship that is wrong, and no amount of styling corrects that.',
    },
    {
      kind: 'paragraph',
      text: 'A restricted scale exists to make these relationships consistent and the decisions fast. A base unit of four with steps at 4, 8, 12, 16, 24, 32, 48, and 64 covers almost everything. The value is not mathematical elegance — it is that there are only eight answers, so the same relationship gets the same value every time.',
    },
  ],

  firstPrinciples: [
    {
      kind: 'paragraph',
      text: 'Perception of grouping is relative, not absolute. Sixteen pixels is tight in a marketing page and loose in a data table. The scale works because it preserves ratios: adjacent steps are distinguishable, and the difference between "related" and "separate" stays legible at any density.',
    },
    {
      kind: 'paragraph',
      text: 'Vertical rhythm is the same idea applied down the page. When the vertical gaps between repeated structures come from a small set, the page acquires a pulse that makes scanning cheaper, even though no reader could name the interval.',
    },
  ],

  designPerspective: [
    {
      kind: 'paragraph',
      text: 'Density is a product decision, not a taste one. A tool someone lives in all day should show more per screen; a page someone visits once a quarter should be generous. Choosing density first makes every subsequent spacing decision easier, because the scale is then applied within a known range.',
    },
    {
      kind: 'callout',
      tone: 'note',
      body: 'Whitespace is not wasted space, and it is also not free. In a dense tool, every extra pixel of padding is a row the user cannot see.',
    },
  ],

  engineeringPerspective: [
    {
      kind: 'paragraph',
      text: 'Spacing belongs to the parent, not the child. A component that carries an external margin cannot be reused anywhere the spacing differs, and the bug surfaces as mysterious extra gaps when someone composes two of them.',
    },
    {
      kind: 'code',
      language: 'css',
      caption: 'Ownership of space decided in one place.',
      code: `/* Fragile: the card dictates spacing wherever it is used. */
.card { margin-bottom: 24px; }

/* Portable: the container owns the gaps between its children. */
.card-list { display: grid; gap: var(--space-6); }`,
    },
    {
      kind: 'paragraph',
      text: 'Gap-based layout removes the class of bugs caused by margin collapsing and last-child exceptions, and it makes the relationship explicit: the list decides how far apart its items sit.',
    },
  ],

  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'A spacing scale is where a visual decision becomes an engineering interface. Once the steps are tokens, the designer and the engineer are using the same eight values, and a design review can be about whether a relationship is right rather than whether a number is 22 or 24.',
    },
    {
      kind: 'paragraph',
      text: 'It also makes drift detectable. An off-scale value is visible in code review in a way that "slightly too much space" never is in a screenshot.',
    },
  ],

  industryExamples: [
    {
      id: 'example-figma-panels',
      source: 'Figma',
      title: 'Dense panels on a strict scale',
      observation:
        'Figma\'s property panels pack a large number of controls into a narrow column using tight, highly consistent spacing, with clear jumps between property groups.',
      takeaway:
        'Extreme density remains legible when the grouping signal is preserved. Tight is fine; ambiguous is not.',
    },
    {
      id: 'example-tailwind-scale',
      source: 'Tailwind CSS',
      title: 'A published spacing scale as a shared vocabulary',
      observation:
        'Tailwind exposes a fixed spacing scale in its class names, so spacing decisions are made from a short list rather than by typing arbitrary values.',
      takeaway:
        'Constraining the options is the mechanism. The specific numbers matter far less than there being few of them.',
    },
  ],

  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Rebuilding a settings panel on a restricted scale.',
    },
    { kind: 'heading', text: '1. Choose density first' },
    {
      kind: 'paragraph',
      text: 'Decide whether this is a daily tool or an occasional page, and pick the range of the scale you will mostly live in.',
    },
    { kind: 'heading', text: '2. Identify the groups' },
    {
      kind: 'paragraph',
      text: 'Mark which elements belong together: label with field, field with helper text, related fields into a section. Do this before assigning any values.',
    },
    { kind: 'heading', text: '3. Assign from the inside out' },
    {
      kind: 'paragraph',
      text: 'Give the tightest relationship the smallest step, then step up for each level of separation. Label to field 4, field to helper 4, field to field 16, section to section 40.',
    },
    { kind: 'heading', text: '4. Check every gap against the scale' },
    {
      kind: 'paragraph',
      text: 'Any value that is not on the scale is either a mistake or a deliberate exception. Mark which, in writing.',
    },
  ],

  commonMistakes: [
    {
      id: 'mistake-equal-spacing',
      mistake: 'Using the same gap everywhere.',
      why: 'Uniform spacing destroys grouping. The screen becomes an undifferentiated list of things.',
      instead:
        'Vary the step to express relationship. Inside a group tighter, between groups looser.',
    },
    {
      id: 'mistake-inside-outside-inverted',
      mistake: 'More space inside a group than around it.',
      why: 'It asserts the wrong relationship, and readers believe spacing over labels.',
      instead:
        'Check every group: internal gaps must be smaller than the surrounding gap.',
    },
    {
      id: 'mistake-child-margins',
      mistake: 'Putting external margins on reusable components.',
      why: 'The component can then only be used where that spacing is correct, and composition produces surprises.',
      instead:
        'Let containers own the space between children, using gap.',
    },
    {
      id: 'mistake-scale-as-law',
      mistake: 'Refusing to leave the scale when perception says otherwise.',
      why: 'The scale is a tool for consistency, not a rule to be obeyed. Optical adjustments around icons and mixed type sizes sometimes need an off-step value.',
      instead:
        'Leave the scale deliberately and rarely, and record why.',
    },
  ],

  eliteConsiderations: [
    {
      kind: 'list',
      items: [
        'Test spacing with real content lengths. A scale tuned on placeholder text collapses when a label wraps.',
        'Space around a visual element and space around its bounding box are different; icons and avatars often need optical correction.',
        'Decide how the scale behaves at small viewports before you need it — scaling everything down uniformly rarely reads correctly.',
        'Treat any off-scale value in the codebase as requiring a comment. Unexplained values are how a system dies.',
      ],
    },
  ],

  practicalExercise: {
    id: 'exercise-02-02',
    title: 'Rebuild a settings panel on a restricted scale',
    prompt:
      'Rebuild a settings panel using only a restricted spacing scale of at most six steps.',
    steps: [
      'Define your scale and write the six values down before starting.',
      'Choose and state the density you are designing for.',
      'Mark the groups in the content before assigning any spacing.',
      'Assign values from the tightest relationship outwards.',
      'Audit every gap and confirm it is on the scale.',
      'Find one place where the scale produces a perceptually wrong result, and record what you did about it.',
    ],
    successCriteria: [
      'No more than six distinct spacing values are used.',
      'Internal group spacing is smaller than surrounding spacing everywhere.',
      'The chosen density is stated and consistent.',
      'Any off-scale value is documented with a reason.',
      'Spacing between components is owned by containers, not by the components.',
    ],
    estimatedMinutes: 35,
    hint: 'Assign the tightest relationship first. Once label-to-field is decided, most other values follow from it.',
  },

  reflectionQuestion: 'When should you violate your spacing scale?',
  reflectionHint:
    'Systems serve perception. What is the scale for, and what happens when following it produces a result that reads incorrectly?',

  resources: [
    {
      id: 'resource-refactoring-ui-spacing',
      title: 'Refactoring UI: spacing and hierarchy',
      url: 'https://www.refactoringui.com/',
      type: 'book',
      author: 'Adam Wathan and Steve Schoger',
      estimatedMinutes: 45,
      note: 'The case for restricted scales, made concretely.',
    },
    {
      id: 'resource-mdn-gap',
      title: 'CSS gap',
      url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/gap',
      type: 'documentation',
      estimatedMinutes: 10,
      note: 'Container-owned spacing, which removes most margin bugs.',
    },
  ],

  competencyTags: ['visual-hierarchy', 'layout', 'design-systems'],

  completionCriteria: [
    'Has rebuilt a real panel on a scale of six steps or fewer.',
    'Can state the inside-smaller-than-outside rule and apply it.',
    'Can justify one deliberate departure from the scale.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Lesson 8                                                                    */
/* -------------------------------------------------------------------------- */

const LESSON_8: Lesson = {
  id: 'lesson-02-03',
  slug: 'typography-as-interface-structure',
  moduleId: MODULE_ID,
  lessonNumber: 3,
  title: 'Typography as Interface Structure',
  summary:
    'In an interface, type is structure. Scale, leading, measure, and weight determine what can be read and in what order.',
  estimatedMinutes: 9,

  objectives: [
    'Build a type scale with a defensible number of steps.',
    'Set line height and measure for readability at each size.',
    'Use weight rather than size for hierarchy in dense interfaces.',
    'Treat numeric and label typography as their own problems.',
  ],

  prerequisiteConcepts: ['Visual hierarchy', 'Spacing scales'],
  prerequisiteLessonIds: ['lesson-02-01', 'lesson-02-02'],

  recap: [
    {
      kind: 'paragraph',
      text: 'You have a spacing scale and three hierarchy levels. Type is the system that carries most of that hierarchy.',
    },
  ],

  coreConcept: [
    {
      kind: 'paragraph',
      text: 'Interface typography and editorial typography solve different problems. Editorial type optimises sustained reading of long text. Interface type optimises scanning, labelling, and dense information, where most strings are under ten words.',
    },
    {
      kind: 'list',
      items: [
        'Scale — a small set of sizes, typically five or six. Every additional size is another decision to make consistently forever.',
        'Line height — tighter as size increases. A 28px heading at 1.5 looks disconnected; 14px body at 1.2 is hard to read.',
        'Measure — line length. Roughly 45 to 75 characters for prose; interface labels are usually far shorter and constrained by layout instead.',
        'Weight — the cheapest hierarchy tool at small sizes, and the one dense products rely on.',
      ],
    },
    {
      kind: 'callout',
      tone: 'insight',
      body: 'Size and line height move in opposite directions. Large type needs tighter leading; small type needs looser.',
    },
  ],

  firstPrinciples: [
    {
      kind: 'paragraph',
      text: 'Line height exists to help the eye find the start of the next line. The longer the line, the more help it needs — which is why measure and leading must be decided together rather than separately.',
    },
    {
      kind: 'paragraph',
      text: 'A 90-character line at tight leading is genuinely difficult to read, and the reader experiences the difficulty as the content being boring. Neither the size nor the typeface is at fault.',
    },
  ],

  designPerspective: [
    {
      kind: 'paragraph',
      text: 'Numeric information is a separate typographic problem. Figures that change — counts, prices, timers, progress — need tabular figures, or the layout jitters as digits swap width. In a table, right-aligning numbers lets the eye compare magnitude by column position instead of reading each value.',
    },
    {
      kind: 'paragraph',
      text: 'Labels are the other special case. They are usually small, frequently uppercase, and always adjacent to the thing they describe. Uppercase at small sizes needs extra letter spacing to stay legible; the same tracking applied to body text makes it worse.',
    },
  ],

  engineeringPerspective: [
    {
      kind: 'paragraph',
      text: 'A type scale is most useful when each step carries its own line height, letter spacing, and weight as a unit. A size without its leading is an incomplete decision, and leaving it to the call site guarantees drift.',
    },
    {
      kind: 'code',
      language: 'css',
      caption: 'A step as a complete decision, not just a size.',
      code: `:root {
  --text-heading: 1.0625rem;
  --text-heading-leading: 1.35;
  --text-heading-tracking: -0.014em;
  --text-heading-weight: 600;

  --text-body: 0.875rem;
  --text-body-leading: 1.6;
  --text-body-tracking: -0.006em;
}

/* Numbers that change must not change width. */
[data-numeric] { font-variant-numeric: tabular-nums; }`,
    },
  ],

  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'Type is where a design system most obviously becomes an engineering artefact. Five named steps is a vocabulary both disciplines can use; a list of pixel values is a set of instructions that will be followed inconsistently.',
    },
    {
      kind: 'paragraph',
      text: 'It is also where accessibility and visual design meet directly: text that does not scale with user preferences, or that relies on weight alone at very small sizes, excludes people regardless of how considered it looks.',
    },
  ],

  industryExamples: [
    {
      id: 'example-geist',
      source: 'Vercel Geist',
      title: 'A tight scale for interface text',
      observation:
        'Geist defines a small number of sizes with matched line heights, intended for product interface rather than editorial layout.',
      takeaway:
        'Published systems keep interface scales short. The restraint is the design.',
    },
    {
      id: 'example-stripe-numbers',
      source: 'Stripe',
      title: 'Numeric typography treated separately',
      observation:
        'Stripe\'s dashboard uses tabular figures and right alignment for money, so columns of amounts can be compared by eye without reading each one.',
      takeaway:
        'Numbers are a different content type with different typographic needs. Treating them like prose makes dense data harder to use.',
    },
    {
      id: 'example-apple-type',
      source: 'Apple',
      title: 'Type that respects user settings',
      observation:
        'Apple\'s typography guidance is built around text that scales with the user\'s chosen size, with layouts expected to adapt rather than break.',
      takeaway:
        'A type system that assumes a fixed size is a system that fails the first user who needs larger text.',
    },
  ],

  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Building a type system for a SaaS dashboard.',
    },
    { kind: 'heading', text: '1. Inventory the roles' },
    {
      kind: 'paragraph',
      text: 'List what the product actually needs: page title, section heading, body, small, label, code. Six roles, not six sizes chosen first.',
    },
    { kind: 'heading', text: '2. Assign sizes to roles' },
    {
      kind: 'paragraph',
      text: 'Start from body — the size most text will be — and work outwards. In a dense product body is often 14px, and the page title may only be twice that.',
    },
    { kind: 'heading', text: '3. Set leading per step' },
    {
      kind: 'paragraph',
      text: 'Tighter as size grows. Roughly 1.5 to 1.6 for body, 1.15 to 1.35 for headings, and slightly looser for small text that wraps.',
    },
    { kind: 'heading', text: '4. Constrain measure' },
    {
      kind: 'paragraph',
      text: 'Cap prose containers around 65 to 75 characters. In an interface this usually means capping a description column, not the whole layout.',
    },
    { kind: 'heading', text: '5. Handle the special cases' },
    {
      kind: 'paragraph',
      text: 'Tabular figures for anything that changes. Extra tracking for uppercase labels. A mono step for code and identifiers.',
    },
  ],

  commonMistakes: [
    {
      id: 'mistake-too-many-sizes',
      mistake: 'Defining ten or more type sizes.',
      why: 'Adjacent sizes become indistinguishable, and nobody can remember which to use, so they get picked by eye per component.',
      instead:
        'Five or six steps. If you need another level, change weight or colour.',
    },
    {
      id: 'mistake-uniform-leading',
      mistake: 'Applying one line height across all sizes.',
      why: 'It makes headings loose and small text cramped, in the same system.',
      instead:
        'Bind leading to the step. Tighter as size increases.',
    },
    {
      id: 'mistake-unbounded-measure',
      mistake: 'Letting prose run the full width of a large display.',
      why: 'Long lines are hard to track back from. The reader blames the content.',
      instead:
        'Cap the measure of any container holding sentences.',
    },
    {
      id: 'mistake-proportional-numbers',
      mistake: 'Using proportional figures for changing values.',
      why: 'Digits have different widths, so counters and timers shift the layout as they update.',
      instead:
        'Use tabular figures wherever a number changes or is compared in a column.',
    },
  ],

  eliteConsiderations: [
    {
      kind: 'list',
      items: [
        'Check the scale at 200% browser zoom and with a user-set minimum font size. A system that only works at defaults is not a system.',
        'Decide how headings truncate or wrap before a real title breaks the layout for you.',
        'Test the scale in both themes: perceived weight changes between light and dark, and text that reads correctly on white can look heavy on black.',
        'Avoid weight as the only distinction between adjacent levels at small sizes, where the difference may be imperceptible.',
      ],
    },
  ],

  practicalExercise: {
    id: 'exercise-02-03',
    title: 'Build a typography system for a dashboard',
    prompt:
      'Create a complete typography system for a SaaS dashboard, expressed as named steps.',
    steps: [
      'List the roles the product needs before choosing any sizes.',
      'Set body first, then derive the others from it.',
      'Give every step a size, line height, letter spacing, and default weight.',
      'Define the treatment for numeric text and for uppercase labels.',
      'Apply the system to one dense screen containing a table.',
      'Verify it at 200% zoom and in both themes.',
    ],
    successCriteria: [
      'Six or fewer steps, each named by role rather than by size.',
      'Line height varies with size across the scale.',
      'Numeric text uses tabular figures.',
      'A measure constraint is stated for prose containers.',
      'The system holds at 200% zoom without overlap or clipping.',
    ],
    estimatedMinutes: 40,
    hint: 'Name the steps by role, not by size. "body" survives a redesign; "text-14" becomes a lie the moment the size changes.',
  },

  reflectionQuestion:
    'Would you use smaller type or tighter spacing when increasing information density?',
  reflectionHint:
    'One changes readability more directly. Which of the two has a floor you cannot go below, and which degrades gracefully?',

  resources: [
    {
      id: 'resource-apple-typography',
      title: 'Apple typography guidance',
      url: 'https://developer.apple.com/design/human-interface-guidelines/typography',
      type: 'documentation',
      estimatedMinutes: 20,
      note: 'Type treated as a system that must respond to user settings.',
    },
    {
      id: 'resource-material-typography',
      title: 'Material typography',
      url: 'https://m3.material.io/styles/typography/overview',
      type: 'documentation',
      estimatedMinutes: 20,
      note: 'A worked example of role-named type steps.',
    },
    {
      id: 'resource-practical-typography',
      title: 'Butterick\'s Practical Typography',
      url: 'https://practicaltypography.com/',
      type: 'book',
      author: 'Matthew Butterick',
      estimatedMinutes: 60,
      note: 'The sections on measure and line spacing explain the mechanics clearly.',
    },
  ],

  competencyTags: ['visual-hierarchy', 'typography', 'accessibility'],

  completionCriteria: [
    'Has produced a role-named type scale of six steps or fewer.',
    'Every step carries its own leading and tracking.',
    'Numeric and label typography are handled explicitly.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Lesson 9                                                                    */
/* -------------------------------------------------------------------------- */

const LESSON_9: Lesson = {
  id: 'lesson-02-04',
  slug: 'colour-and-semantic-colour',
  moduleId: MODULE_ID,
  lessonNumber: 4,
  title: 'Colour and Semantic Colour',
  summary:
    'Colour in an interface is a role system. Naming colours by meaning rather than appearance is what makes theming and status possible.',
  estimatedMinutes: 9,

  objectives: [
    'Name colours by role rather than by hue.',
    'Build a token set that supports light and dark themes.',
    'Use status colour without relying on colour alone.',
    'Reason about contrast as a requirement rather than a check at the end.',
  ],

  prerequisiteConcepts: ['Hierarchy', 'Type systems'],
  prerequisiteLessonIds: ['lesson-02-01'],

  recap: [
    {
      kind: 'paragraph',
      text: 'Hierarchy and type gave you structure. Colour adds meaning — and is the system most likely to collapse under a second theme.',
    },
  ],

  coreConcept: [
    {
      kind: 'paragraph',
      text: 'The decisive move is naming by role, not by appearance. A token called `--blue-500` describes a colour. A token called `--color-accent` describes a job. Only the second can survive a theme change, a rebrand, or a decision that the accent is now green.',
    },
    {
      kind: 'list',
      items: [
        'Surfaces — canvas, surface, elevated surface. The field everything sits on.',
        'Text — primary, secondary, muted, and text on an accent fill.',
        'Lines — border, and a stronger border for emphasis.',
        'Accent — one colour that means "this is the thing", used sparingly.',
        'Status — success, warning, danger, each with a subtle background variant.',
        'Focus — the keyboard indicator, which must be visible on every surface.',
      ],
    },
    {
      kind: 'paragraph',
      text: 'A theme is then a second set of values for the same names. Nothing in the components changes. If a component references a hue directly, it cannot be themed and it will be found the hard way.',
    },
  ],

  firstPrinciples: [
    {
      kind: 'paragraph',
      text: 'Contrast is a ratio between two colours, so it is a property of a pair rather than of a colour. This is why "is this grey accessible?" is an unanswerable question — it depends entirely on what it sits on.',
    },
    {
      kind: 'paragraph',
      text: 'WCAG AA requires 4.5:1 for normal text and 3:1 for large text and meaningful non-text elements. Treating those as design inputs, chosen when the palette is built, is far cheaper than treating them as an audit that arrives after the visual design is agreed.',
    },
    {
      kind: 'callout',
      tone: 'warning',
      body: 'Around eight per cent of men have some form of colour vision deficiency. Any information carried only by hue is unavailable to them.',
    },
  ],

  designPerspective: [
    {
      kind: 'paragraph',
      text: 'Accent works by scarcity. If four things on a screen are accent-coloured, none of them is emphasised. The discipline is to spend it on one thing per view and let hierarchy do the rest.',
    },
    {
      kind: 'paragraph',
      text: 'Status colour has a similar economy. If every destructive action is red at rest, red stops meaning danger and starts meaning "delete-shaped". Reserving the strongest signal for the moment of consequence — the confirmation, not the button — keeps the signal working.',
    },
  ],

  engineeringPerspective: [
    {
      kind: 'paragraph',
      text: 'Themes are implemented by redefining the same custom properties under a different selector. Components never know which theme is active, which is the entire point.',
    },
    {
      kind: 'code',
      language: 'css',
      caption: 'One vocabulary, two value sets.',
      code: `:root {
  --color-surface: oklch(0.973 0.003 265);
  --color-text-primary: oklch(0.205 0.012 265);
  --color-danger: oklch(0.5 0.19 27);
}

:root[data-theme='dark'] {
  --color-surface: oklch(0.184 0.007 265);
  --color-text-primary: oklch(0.973 0.003 265);
  --color-danger: oklch(0.68 0.19 25);
}

/* The component is theme-agnostic. */
.alert { background: var(--color-surface); color: var(--color-danger); }`,
    },
    {
      kind: 'paragraph',
      text: 'Perceptual colour spaces such as OKLCH make a palette easier to reason about, because equal lightness numbers look equally light across different hues. In hex or HSL, a yellow and a blue at the same nominal lightness are visibly different in weight.',
    },
  ],

  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'Semantic naming is a shared contract. The designer decides what "danger" looks like in each theme; the engineer uses "danger" wherever danger is meant. Neither has to coordinate on hex values, and a theme change is a data change rather than a search-and-replace.',
    },
    {
      kind: 'paragraph',
      text: 'It also makes an accessibility requirement checkable. Contrast can be asserted between named pairs once, rather than re-verified every time a component is built.',
    },
  ],

  industryExamples: [
    {
      id: 'example-github-primer',
      source: 'GitHub Primer',
      title: 'Functional colour naming across many themes',
      observation:
        'Primer names colours by function — foreground, background, border, danger — and ships multiple themes including high-contrast variants against the same names.',
      takeaway:
        'Functional naming is what makes several themes maintainable. The component layer never learns which theme it is in.',
    },
    {
      id: 'example-status-plus-icon',
      source: 'Common practice in mature products',
      title: 'Status carried by more than hue',
      observation:
        'Well-built status indicators pair colour with a distinct glyph and a text label, so the meaning survives greyscale and colour vision deficiency.',
      takeaway:
        'Colour should reinforce a signal that already exists, not be the signal.',
    },
  ],

  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Building a semantic token set for two themes.',
    },
    { kind: 'heading', text: '1. List the roles before choosing colours' },
    {
      kind: 'paragraph',
      text: 'Surfaces, text levels, borders, accent, status, focus. If you cannot name the role, you do not need the token yet.',
    },
    { kind: 'heading', text: '2. Build the neutral scale first' },
    {
      kind: 'paragraph',
      text: 'Most of an interface is neutral. Getting the surface and text relationships right is most of the work; the accent is a small decision by comparison.',
    },
    { kind: 'heading', text: '3. Check contrast as you assign' },
    {
      kind: 'paragraph',
      text: 'Verify text on surface, muted text on surface, and text on accent at the moment you choose the values — not afterwards.',
    },
    { kind: 'heading', text: '4. Define the second theme against the same names' },
    {
      kind: 'paragraph',
      text: 'Dark is not an inversion. Pure black backgrounds with pure white text are harsh; a very dark neutral with slightly softened text usually reads better, and status colours normally need to be lighter and less saturated.',
    },
    { kind: 'heading', text: '5. Pair every status colour with something non-colour' },
    {
      kind: 'paragraph',
      text: 'A glyph, a label, or a shape. Then check the interface in greyscale and confirm nothing became ambiguous.',
    },
  ],

  commonMistakes: [
    {
      id: 'mistake-appearance-names',
      mistake: 'Naming tokens after their colour.',
      why: 'The name becomes a lie the moment the value changes, and themes become impossible without renaming everything.',
      instead: 'Name by role: accent, danger, surface, border.',
    },
    {
      id: 'mistake-colour-only-status',
      mistake: 'Carrying status in colour alone.',
      why: 'It is unavailable to colour-blind users, invisible in greyscale, and ambiguous on a poor display.',
      instead: 'Pair colour with a glyph and a text label.',
    },
    {
      id: 'mistake-contrast-last',
      mistake: 'Treating contrast as a final audit.',
      why: 'By then the palette is agreed and fixing it means redesigning, so it gets waived instead.',
      instead: 'Check ratios while choosing values; it takes seconds and removes the argument.',
    },
    {
      id: 'mistake-dark-as-inversion',
      mistake: 'Producing dark mode by inverting light mode.',
      why: 'Perceived contrast and saturation behave differently on dark backgrounds; inverted palettes look harsh and vibrate.',
      instead: 'Design the dark theme as its own set of values against the same role names.',
    },
  ],

  eliteConsiderations: [
    {
      kind: 'list',
      items: [
        'Give the focus indicator its own token and verify it against every surface it can appear on, including inside a filled button.',
        'Use a perceptual colour space so lightness is comparable across hues.',
        'Keep the accent hue away from your status hues, so an accent element can never be mistaken for a warning.',
        'Check the interface in greyscale before shipping. Anything that becomes ambiguous was relying on hue alone.',
      ],
    },
  ],

  practicalExercise: {
    id: 'exercise-02-04',
    title: 'Semantic colour tokens for two themes',
    prompt:
      'Create a semantic colour token set that works in light and dark mode.',
    steps: [
      'List the roles your interface needs, before picking any colours.',
      'Build the neutral surface and text scale first.',
      'Choose one accent and check it against the surfaces it will sit on.',
      'Define success, warning, and danger, each with a subtle background variant.',
      'Produce the dark theme as its own values against the same names.',
      'Measure contrast for every text-on-surface pair and record the ratios.',
      'View the result in greyscale and fix anything that became ambiguous.',
    ],
    successCriteria: [
      'Every token is named by role, with no hue names anywhere.',
      'Both themes are defined against the same token names.',
      'Recorded contrast ratios meet at least 4.5:1 for normal text.',
      'No status is distinguishable by colour alone.',
      'A focus token exists and is visible on every surface.',
    ],
    estimatedMinutes: 40,
    hint: 'Build the neutrals first. The accent is a five-minute decision once the surfaces and text levels are right.',
  },

  reflectionQuestion:
    'Should destructive actions always appear red before interaction?',
  reflectionHint:
    'Consider signal strength and frequency. What happens to the meaning of red when it is used for every delete button on every row?',

  resources: [
    {
      id: 'resource-primer-color',
      title: 'Primer: colour system',
      url: 'https://primer.style/foundations/color',
      type: 'documentation',
      estimatedMinutes: 20,
      note: 'Functional naming applied across multiple themes in a real product.',
    },
    {
      id: 'resource-oklch',
      title: 'OKLCH in CSS',
      url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/oklch',
      type: 'documentation',
      estimatedMinutes: 12,
      note: 'A perceptual colour space, which makes palettes far easier to reason about.',
    },
    {
      id: 'resource-wcag-contrast',
      title: 'WCAG contrast minimum',
      url: 'https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html',
      type: 'specification',
      estimatedMinutes: 15,
      note: 'What the requirement actually says, including the large-text exception.',
    },
  ],

  competencyTags: ['colour', 'accessibility', 'design-systems'],

  completionCriteria: [
    'Has produced role-named tokens covering two themes.',
    'Contrast ratios are recorded and meet AA for text.',
    'No status in the system depends on colour alone.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Lesson 10                                                                   */
/* -------------------------------------------------------------------------- */

const LESSON_10: Lesson = {
  id: 'lesson-02-05',
  slug: 'grids-alignment-and-optical-correction',
  moduleId: MODULE_ID,
  lessonNumber: 5,
  title: 'Grids, Alignment and Optical Correction',
  summary:
    'Grids make layout decisions repeatable. Optical correction is where you overrule the grid because the eye measures differently from the machine.',
  estimatedMinutes: 9,

  objectives: [
    'Use a column grid without letting it dictate the design.',
    'Establish alignment relationships that survive responsive changes.',
    'Recognise where mathematical centring reads as wrong.',
    'Choose container widths from measure rather than from device sizes.',
  ],

  prerequisiteConcepts: ['Spacing scales', 'Type measure'],
  prerequisiteLessonIds: ['lesson-02-02', 'lesson-02-03'],

  recap: [
    {
      kind: 'paragraph',
      text: 'You have spacing, type, and colour as systems. Grid is the last one: where things sit relative to each other and to the viewport.',
    },
  ],

  coreConcept: [
    {
      kind: 'paragraph',
      text: 'A grid is a set of pre-made decisions about horizontal position. Its value is that it removes a class of arbitrary choices, so the remaining choices can get more attention.',
    },
    {
      kind: 'paragraph',
      text: 'Alignment is the more fundamental idea. Elements that share an edge read as related; elements that do not read as unrelated, regardless of what a label claims. Most amateur-looking layouts have too many distinct alignment edges rather than bad spacing.',
    },
    {
      kind: 'callout',
      tone: 'insight',
      body: 'Count the vertical edges in a layout. Fewer distinct edges almost always reads as more considered.',
    },
    {
      kind: 'paragraph',
      text: 'Container width should be decided by content, not by device. A prose column is capped by measure; a table is capped by the number of columns it needs; a dashboard is capped by where the eye stops tracking comfortably. "Desktop" is not a width.',
    },
  ],

  firstPrinciples: [
    {
      kind: 'paragraph',
      text: 'The eye judges balance by visual mass, not by bounding boxes. A triangle centred by its box looks left-heavy because its mass sits toward the base. An icon with more ink on one side looks off-centre even when its box is perfectly aligned.',
    },
    {
      kind: 'paragraph',
      text: 'This is why optical correction exists. It is not a departure from rigour — it is the recognition that the measurement that matters is perceptual, and the bounding box is only a convenient approximation of it.',
    },
  ],

  designPerspective: [
    {
      kind: 'paragraph',
      text: 'Typical places the box and the eye disagree: a play triangle in a circular button, a chevron in a small control, uppercase text inside a pill, and any glyph with asymmetric weight. In each case the correction is small — one or two pixels — and the difference is unmistakable once seen.',
    },
    {
      kind: 'paragraph',
      text: 'The same applies to text in a button. Cap height sits below the top of the em box, so a label centred by box often looks low. Many systems correct for this once, at the component level, rather than case by case.',
    },
  ],

  engineeringPerspective: [
    {
      kind: 'paragraph',
      text: 'Modern CSS makes responsive layout achievable with very few breakpoints, because the grid can respond to available space rather than to named device sizes.',
    },
    {
      kind: 'code',
      language: 'css',
      caption: 'A grid that responds to space, not to device categories.',
      code: `/* Columns are added when there is room, with no breakpoints at all. */
.cards {
  display: grid;
  gap: var(--space-6);
  grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
}

/* Measure is a content constraint, not a viewport one. */
.prose { max-width: 68ch; }`,
    },
    {
      kind: 'paragraph',
      text: 'Breakpoints are then reserved for genuine layout changes — a sidebar becoming a drawer — rather than for resizing things that could have resized themselves.',
    },
  ],

  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'Grids are where a design tool and a browser most often disagree. A canvas lets you place anything anywhere; a browser lays out in flow, and content determines size. A design produced by absolute placement usually cannot be built the way it was drawn.',
    },
    {
      kind: 'paragraph',
      text: 'Designing with the same constraints the browser has — auto layout, content-driven sizing, explicit alignment — makes handover a translation rather than a negotiation.',
    },
  ],

  industryExamples: [
    {
      id: 'example-figma-autolayout',
      source: 'Figma',
      title: 'Design tooling adopting layout semantics',
      observation:
        'Auto layout brings direction, gap, padding, and alignment into the design tool, matching how flex and grid actually behave.',
      takeaway:
        'The tools converged because the constraints were real. Designing outside them produces mockups that cannot be built as drawn.',
    },
    {
      id: 'example-pricing-alignment',
      source: 'Common pricing pages',
      title: 'Alignment carrying comparison',
      observation:
        'Well-built pricing tables align feature rows across all plans, so the eye can compare horizontally without reading labels twice.',
      takeaway:
        'Alignment is doing the comparison work. Break the alignment and the table stops being a table.',
    },
  ],

  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Building a pricing page across three sizes.',
    },
    { kind: 'heading', text: '1. Decide widths from content' },
    {
      kind: 'paragraph',
      text: 'How wide does a plan card need to be for its longest feature line? That, not a device width, sets the minimum.',
    },
    { kind: 'heading', text: '2. Let the grid reflow' },
    {
      kind: 'paragraph',
      text: 'Three columns, two, then one — driven by available space rather than named breakpoints, so unusual widths are handled too.',
    },
    { kind: 'heading', text: '3. Preserve comparison alignment' },
    {
      kind: 'paragraph',
      text: 'Feature rows must line up horizontally while cards are side by side. When they stack, the comparison is lost and each card has to become self-contained.',
    },
    { kind: 'heading', text: '4. Apply optical corrections last' },
    {
      kind: 'paragraph',
      text: 'Check icons in buttons, chevrons, and the featured-plan badge. Correct by eye at a realistic viewing distance, and record the corrections so they are not "fixed" later.',
    },
  ],

  commonMistakes: [
    {
      id: 'mistake-device-breakpoints',
      mistake: 'Choosing breakpoints from device names.',
      why: 'Devices change and sizes overlap. A layout tuned to an iPad width breaks in a split-screen window.',
      instead: 'Add a breakpoint where the layout genuinely stops working, and let content-driven sizing handle the rest.',
    },
    {
      id: 'mistake-too-many-edges',
      mistake: 'Introducing a new alignment edge for each element.',
      why: 'The eye reads every distinct edge as a relationship boundary, and too many make a layout feel unresolved.',
      instead: 'Reuse edges. Count them, and reduce.',
    },
    {
      id: 'mistake-box-centring',
      mistake: 'Trusting mathematical centring for asymmetric shapes.',
      why: 'Visual mass is not evenly distributed in a bounding box, so the result looks off even though it measures right.',
      instead: 'Correct optically, and apply the correction at the component level so it is consistent.',
    },
    {
      id: 'mistake-grid-as-law',
      mistake: 'Forcing every element onto the column grid.',
      why: 'A grid is a tool for repeatability, not a constraint on every decision. Full-bleed images and edge-anchored controls legitimately escape it.',
      instead: 'Use the grid for the repeating structure, and allow deliberate exceptions.',
    },
  ],

  eliteConsiderations: [
    {
      kind: 'list',
      items: [
        'Resize continuously rather than testing three fixed widths; the failures live between the breakpoints.',
        'Check the layout with the longest realistic content in every slot, including translated strings that run longer than English.',
        'Keep optical corrections in the component, documented, so a later tidy-up does not undo them.',
        'Verify that reflow does not change the reading order in a way that breaks the tab sequence.',
      ],
    },
  ],

  practicalExercise: {
    id: 'exercise-02-05',
    title: 'Recreate a pricing page across three sizes',
    prompt:
      'Recreate a polished pricing page at desktop, tablet, and mobile, with alignment and optical corrections deliberate.',
    steps: [
      'Derive the card minimum width from the longest feature line, not from a device size.',
      'Build the grid so columns reflow by available space.',
      'Keep feature rows aligned for comparison while cards sit side by side.',
      'Decide what happens to comparison when the cards stack.',
      'Count the distinct vertical alignment edges and reduce them where you can.',
      'Apply and record at least two optical corrections.',
      'Resize continuously from 320px upwards and fix what breaks between breakpoints.',
    ],
    successCriteria: [
      'No breakpoint is named after a device.',
      'Feature rows align across cards at wide sizes.',
      'The stacked layout remains usable for comparison, or states why it cannot.',
      'At least two optical corrections are applied and documented.',
      'The layout survives a continuous resize from 320px with no overlap or clipping.',
    ],
    estimatedMinutes: 45,
    hint: 'Drag the window slowly rather than jumping between three widths. Everything interesting happens in between.',
  },

  reflectionQuestion: 'When is mathematically centered visually wrong?',
  reflectionHint:
    'Your eyes weigh shapes unevenly. Think about a triangle in a circle, or uppercase text in a pill — where is the visual mass compared to the bounding box?',

  resources: [
    {
      id: 'resource-figma-grids',
      title: 'Figma layout grids',
      url: 'https://help.figma.com/hc/en-us/articles/360040450513-Create-layout-grids',
      type: 'documentation',
      estimatedMinutes: 15,
      note: 'Column grids in the tool, and how they relate to implementation.',
    },
    {
      id: 'resource-mdn-grid',
      title: 'CSS Grid layout',
      url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout',
      type: 'documentation',
      estimatedMinutes: 30,
      note: 'Including auto-fit and minmax, which remove most breakpoint work.',
    },
  ],

  competencyTags: ['visual-hierarchy', 'typography', 'layout'],

  completionCriteria: [
    'Has built a responsive layout with breakpoints justified by content.',
    'Comparison alignment is preserved where it carries meaning.',
    'At least two optical corrections are applied and documented.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Project                                                                     */
/* -------------------------------------------------------------------------- */

const PROJECT: ModuleProject = {
  id: 'project-02',
  slug: 'responsive-saas-pricing-experience',
  moduleId: MODULE_ID,
  title: 'Responsive SaaS Pricing Experience',
  brief:
    'Design and build a pricing experience across desktop, tablet, and mobile, including pricing states and a feature comparison, driven by semantic tokens.',
  problem:
    'A pricing page is where visual system failures become expensive. It compares several similar things, so alignment carries meaning; it holds numbers that change, so typography matters; it has states — billing period, currency, highlighted plan, sold out — that are usually bolted on late; and it must work at every width because it is frequently opened on a phone from a link. Most pricing pages are built as three fixed layouts and break in between.',
  objectives: [
    'Apply a spacing, type, and colour system rather than styling per element.',
    'Preserve comparison alignment across plans while the layout reflows.',
    'Represent pricing states without adding a second layout.',
    'Produce an implementation whose breakpoints are justified by content.',
  ],
  requirements: [
    'Desktop, tablet, and mobile layouts, with reflow handled continuously between them.',
    'At least three plans with a feature comparison that aligns while side by side.',
    'Pricing states: at minimum a billing-period toggle and one highlighted plan.',
    'Semantic colour tokens covering light and dark themes.',
    'A type scale of six steps or fewer, with tabular figures for prices.',
    'A spacing scale of six steps or fewer.',
  ],
  constraints: [
    'No CSS framework and no component library — the system is the deliverable.',
    'No breakpoint may be named after a device.',
    'Nothing may be distinguishable by colour alone, including the highlighted plan.',
  ],
  suggestedScope:
    'Three plans, one comparison table, one toggle. Do not build a checkout, an account system, or a marketing site around it. The work being assessed is whether the visual system holds, not how many sections exist.',
  deliverables: [
    'A token set for spacing, type, and colour, in both themes.',
    'A responsive implementation covering desktop, tablet, and mobile.',
    'A feature comparison that works at every width.',
    'A short note recording every optical correction and every departure from a scale.',
  ],
  completionCriteria: [
    'Resizing continuously from 320px upwards produces no overlap, clipping, or broken comparison.',
    'Every spacing and type value comes from the declared scales, or is documented as an exception.',
    'Contrast meets AA for all text in both themes, with ratios recorded.',
    'Prices use tabular figures and do not shift the layout when the toggle changes them.',
    'The highlighted plan is distinguishable without colour.',
  ],
  portfolioEvidence: [
    'Visual hierarchy',
    'Typographic systems',
    'Semantic colour tokens',
    'Responsive visual systems',
    'CSS layout',
    'Light and dark theming',
  ],
  reflectionQuestion:
    'Where did your system fail first as the viewport narrowed, and was that a spacing, type, or layout decision?',
  estimatedHours: 12,
  competencies: [
    'visual-hierarchy',
    'typography',
    'colour',
    'layout',
    'responsive-design',
    'design-systems',
  ],
  stretchGoals: [
    'Add a currency switcher and keep the price column from shifting width.',
    'Support a user-set minimum font size without the comparison breaking.',
  ],
};

/* -------------------------------------------------------------------------- */

export const MODULE_02: CurriculumModule = {
  id: MODULE_ID,
  slug: 'visual-systems',
  moduleNumber: 2,
  phase: 'foundations',
  title: 'Visual Systems',
  description:
    'Hierarchy, spacing, type, colour, and grid treated as one repeatable system rather than as per-screen styling.',
  outcome:
    'Understand visual design as a repeatable system rather than isolated styling.',
  prerequisites: [
    'Module 1, or equivalent comfort with interfaces as state systems',
    'Basic familiarity with a design tool',
  ],
  lessons: [LESSON_6, LESSON_7, LESSON_8, LESSON_9, LESSON_10],
  resources: [
    {
      id: 'resource-module-02-refactoring-ui',
      title: 'Refactoring UI',
      url: 'https://www.refactoringui.com/',
      type: 'book',
      author: 'Adam Wathan and Steve Schoger',
      estimatedMinutes: 180,
      note: 'The most directly applicable book for product visual design.',
    },
    {
      id: 'resource-module-02-apple-type',
      title: 'Apple typography guidance',
      url: 'https://developer.apple.com/design/human-interface-guidelines/typography',
      type: 'documentation',
      estimatedMinutes: 20,
      note: 'Type as a system that responds to user settings.',
    },
    {
      id: 'resource-module-02-material-type',
      title: 'Material typography principles',
      url: 'https://m3.material.io/styles/typography/overview',
      type: 'documentation',
      estimatedMinutes: 20,
      note: 'Role-named type steps, worked through.',
    },
    {
      id: 'resource-module-02-geist',
      title: 'Vercel Geist',
      url: 'https://vercel.com/geist/introduction',
      type: 'documentation',
      estimatedMinutes: 25,
      note: 'A shipped interface system with tight scales.',
    },
    {
      id: 'resource-module-02-figma-grids',
      title: 'Figma layout grid documentation',
      url: 'https://help.figma.com/hc/en-us/articles/360040450513-Create-layout-grids',
      type: 'documentation',
      estimatedMinutes: 15,
      note: 'Grids in the design tool, and how they map to CSS.',
    },
  ],
  project: PROJECT,
  competencies: [
    'ux-reasoning',
    'visual-hierarchy',
    'typography',
    'colour',
    'layout',
    'responsive-design',
    'accessibility',
    'design-systems',
  ],
  completionCriteria: [
    'All five lessons completed.',
    'Module project marked completed.',
    'Can build a screen from declared scales rather than per-element values.',
  ],
};
