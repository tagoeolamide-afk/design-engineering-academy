/**
 * Module 09 — Design Systems.
 *
 * Tokens, foundations, parity between design and code, patterns above
 * components, and the governance without which the rest decays.
 */

import type { CurriculumModule, Lesson, ModuleProject } from '@/types/curriculum';

const MODULE_ID = 'module-09';

/* -------------------------------------------------------------------------- */
/* Lesson 41                                                                   */
/* -------------------------------------------------------------------------- */

const LESSON_41: Lesson = {
  id: 'lesson-09-01',
  slug: 'design-tokens',
  moduleId: MODULE_ID,
  lessonNumber: 1,
  title: 'Design Tokens',
  summary:
    'Tokens are named decisions. The value of the naming layer is that meaning survives when the values change.',
  estimatedMinutes: 9,

  objectives: [
    'Separate primitive, semantic, and component tokens by responsibility.',
    'Name tokens by role rather than by appearance.',
    'Build a token layer that supports more than one theme without component changes.',
    'Decide when a component-level token is justified.',
  ],

  prerequisiteConcepts: ['CSS architecture', 'Colour and semantic colour'],
  prerequisiteLessonIds: ['lesson-04-05', 'lesson-02-04'],

  recap: [
    {
      kind: 'paragraph',
      text: 'Module 4 established tokens as the vocabulary a stylesheet is written in. This module makes that vocabulary a system with layers and rules.',
    },
  ],

  coreConcept: [
    {
      kind: 'paragraph',
      text: 'Tokens come in three layers, and the distinction between them is the whole idea.',
    },
    {
      kind: 'list',
      items: [
        'Primitive — the raw palette. `blue-500`, `space-4`, `radius-8`. No meaning, just values.',
        'Semantic — decisions expressed as roles. `color-action-primary`, `color-text-muted`, `color-border-danger`. These reference primitives.',
        'Component — a component\'s own hooks, where it genuinely needs one. `button-padding-inline`. These reference semantic tokens.',
      ],
    },
    {
      kind: 'paragraph',
      text: 'Components should consume semantic tokens almost exclusively. A component referencing `blue-500` has hard-coded a palette choice; a component referencing `color-action-primary` has expressed an intent that survives the palette being replaced.',
    },
    {
      kind: 'callout',
      tone: 'insight',
      body: 'Theming works because the component layer never learns which theme it is in. That is the entire return on the semantic layer.',
    },
  ],

  firstPrinciples: [
    {
      kind: 'paragraph',
      text: 'A name that describes appearance becomes false the first time appearance changes. `blue-500` used for the primary action is correct until the brand colour becomes green, at which point every usage is either wrong or renamed — and renaming across a codebase is exactly the work the token layer existed to avoid.',
    },
    {
      kind: 'paragraph',
      text: 'A name that describes role stays true. `color-action-primary` means the same thing whatever it resolves to, and a theme is nothing more than a different resolution of the same names.',
    },
  ],

  designPerspective: [
    {
      kind: 'paragraph',
      text: 'Semantic tokens are where design decisions become reviewable. "Which token should this use?" is a better question than "which blue is this?" because it asks what the element means rather than what it looks like.',
    },
    {
      kind: 'paragraph',
      text: 'It also surfaces gaps. If a designer cannot name the token for an element, either the system is missing a role or the element is doing something the system has not accounted for. Both are worth knowing.',
    },
  ],

  engineeringPerspective: [
    {
      kind: 'code',
      language: 'css',
      caption: 'Three layers, with each referencing only the one below.',
      code: `:root {
  /* Primitive: values, no meaning. */
  --blue-500: oklch(0.55 0.19 258);
  --gray-100: oklch(0.96 0.003 250);
  --gray-900: oklch(0.21 0.01 250);

  /* Semantic: decisions. Components use only these. */
  --color-action-primary: var(--blue-500);
  --color-surface: var(--gray-100);
  --color-text-primary: var(--gray-900);
}

:root[data-theme='dark'] {
  /* The same names, resolved differently. No component changes. */
  --color-surface: var(--gray-900);
  --color-text-primary: var(--gray-100);
}

/* Component: only where the component genuinely owns a decision. */
.button {
  --button-padding-inline: var(--space-3);
  padding-inline: var(--button-padding-inline);
  background: var(--color-action-primary);
}`,
    },
    {
      kind: 'paragraph',
      text: 'Component tokens are the layer most often overused. One is justified when a component has a decision of its own that consumers may need to override — its padding, its minimum height. It is not justified as a per-component alias for a semantic token.',
    },
  ],

  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'Tokens are the shared contract between the design file and the codebase. Figma variables and CSS custom properties can hold the same names, which means a change made once propagates to both.',
    },
    {
      kind: 'paragraph',
      text: 'When the names diverge, every conversation needs a translation, and the translation is where the drift enters.',
    },
  ],

  industryExamples: [
    {
      id: 'example-primer-tokens-09',
      source: 'GitHub Primer',
      title: 'A published three-layer token system',
      observation:
        'Primer publishes primitives separately from functional tokens, and components reference only the functional layer.',
      takeaway:
        'It is what allows several themes, including high contrast, against one component implementation.',
    },
    {
      id: 'example-token-format',
      source: 'Design token tooling',
      title: 'Tokens as a source of truth for both tools',
      observation:
        'Teams increasingly keep tokens in a format that generates both CSS custom properties and design-tool variables from one definition.',
      takeaway:
        'One definition means the two environments cannot drift, which is the failure the tooling exists to prevent.',
    },
  ],

  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Building colour, spacing, and typography tokens.',
    },
    { kind: 'heading', text: '1. Build the primitive scales' },
    {
      kind: 'paragraph',
      text: 'A colour ramp with enough steps to express hierarchy, a spacing scale, a type scale. Values only, no meaning.',
    },
    { kind: 'heading', text: '2. List the roles the interface needs' },
    {
      kind: 'paragraph',
      text: 'Surfaces, text levels, borders, actions, statuses. Write them as roles before assigning any values.',
    },
    { kind: 'heading', text: '3. Map roles to primitives' },
    {
      kind: 'paragraph',
      text: 'Each semantic token points at exactly one primitive. A role with no primitive means a gap in the scale.',
    },
    { kind: 'heading', text: '4. Build a second theme' },
    {
      kind: 'paragraph',
      text: 'Redefine the semantic layer only. If any component needs changing, something is referencing a primitive directly.',
    },
    { kind: 'heading', text: '5. Check contrast on every pairing' },
    {
      kind: 'paragraph',
      text: 'Every text-on-surface pair in both themes. A token system that produces failing contrast is a system that encodes a defect.',
    },
    { kind: 'heading', text: '6. Audit for direct primitive usage' },
    {
      kind: 'paragraph',
      text: 'Search components for primitive names. Every hit is a component that will break when the palette changes.',
    },
  ],

  commonMistakes: [
    {
      id: 'mistake-appearance-token-names',
      mistake: 'Naming semantic tokens after appearance.',
      why: '`color-blue-button` becomes false when the button is no longer blue, and nobody renames it.',
      instead: 'Name by role: `color-action-primary`.',
    },
    {
      id: 'mistake-components-use-primitives',
      mistake: 'Referencing primitives from component styles.',
      why: 'The component has hard-coded a palette decision, so theming requires touching every component.',
      instead: 'Components reference semantic tokens only.',
    },
    {
      id: 'mistake-token-per-usage',
      mistake: 'Creating a semantic token for every place a colour appears.',
      why: 'The semantic layer becomes as large as the interface and stops being a set of decisions.',
      instead: 'Keep semantic tokens to genuine roles; reuse them widely.',
    },
    {
      id: 'mistake-tokens-without-contrast',
      mistake: 'Defining colour tokens without checking pairings.',
      why: 'The system then guarantees a contrast failure everywhere the pairing is used.',
      instead: 'Verify every text-on-surface pairing in every theme.',
    },
  ],

  eliteConsiderations: [
    {
      kind: 'list',
      items: [
        'Keep the semantic layer small enough to memorise; a system nobody can hold in mind gets bypassed.',
        'Document what each semantic token means, not just what it resolves to.',
        'Generate both CSS and design-tool variables from one source so drift is structurally impossible.',
        'Treat a new primitive as a bigger decision than a new semantic token — primitives are the vocabulary itself.',
      ],
    },
  ],

  practicalExercise: {
    id: 'exercise-09-01',
    title: 'Build colour, spacing and typography tokens',
    prompt:
      'Build a three-layer token system and prove it supports a second theme with no component changes.',
    steps: [
      'Build primitive scales for colour, spacing, and type.',
      'List the semantic roles the interface actually needs.',
      'Map each role to exactly one primitive.',
      'Write one line describing the meaning of each semantic token.',
      'Build a second theme by redefining only the semantic layer.',
      'Verify contrast for every text-on-surface pairing in both themes.',
      'Search the components for primitive references and eliminate them.',
      'Add a component token only where a component owns a genuine decision, and justify it.',
    ],
    successCriteria: [
      'Components reference semantic tokens only.',
      'The second theme required no component changes.',
      'Every semantic token has a written meaning.',
      'All text-on-surface pairings pass contrast in both themes.',
      'Every component token has a written justification.',
    ],
    estimatedMinutes: 50,
    hint: 'Build the second theme early. It is the fastest way to find every place a component reached past the semantic layer.',
  },

  reflectionQuestion:
    'Why should `blue-500` rarely be the final semantic interface decision?',
  reflectionHint: 'Meaning survives palette changes.',

  resources: [
    {
      id: 'resource-primer-primitives',
      title: 'Primer: primitives',
      url: 'https://primer.style/foundations/primitives',
      type: 'documentation',
      estimatedMinutes: 30,
      note: 'A published three-layer token system with its naming rules.',
    },
    {
      id: 'resource-design-tokens-format',
      title: 'Design Tokens Format Module',
      url: 'https://tr.designtokens.org/format/',
      type: 'specification',
      estimatedMinutes: 25,
      note: 'The interchange format tooling is converging on.',
    },
  ],

  competencyTags: ['colour', 'design-systems', 'css', 'design-systems-implementation'],

  completionCriteria: [
    'Has built a three-layer token system.',
    'A second theme works with no component changes.',
    'All pairings pass contrast in both themes.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Lesson 42                                                                   */
/* -------------------------------------------------------------------------- */

const LESSON_42: Lesson = {
  id: 'lesson-09-02',
  slug: 'foundations',
  moduleId: MODULE_ID,
  lessonNumber: 2,
  title: 'Foundations',
  summary:
    'Foundations are the constrained scales everything else is built from. Some should be rigid; at least one has to stay flexible.',
  estimatedMinutes: 9,

  objectives: [
    'Define the six foundations and the decisions each one encodes.',
    'Set constraints tight enough to produce consistency.',
    'Identify which foundation must remain flexible and why.',
    'Document foundations so they can be used without asking.',
  ],

  prerequisiteConcepts: ['Design tokens', 'Visual systems'],
  prerequisiteLessonIds: ['lesson-09-01'],

  recap: [
    {
      kind: 'paragraph',
      text: 'Tokens are the mechanism. Foundations are the decisions the tokens encode, and the scales they are drawn from.',
    },
  ],

  coreConcept: [
    {
      kind: 'paragraph',
      text: 'Six foundations carry almost all of a system\'s visual identity and most of its consistency.',
    },
    {
      kind: 'list',
      items: [
        'Colour — a ramp plus semantic roles, verified for contrast.',
        'Typography — families, a size scale, weights, line heights, measure.',
        'Spacing — one scale, used for every gap and every padding.',
        'Elevation — a small set of levels, each meaning a specific relationship to the page.',
        'Radius — a short scale, applied consistently by component size.',
        'Iconography — one family, one grid, one stroke weight, one optical size.',
      ],
    },
    {
      kind: 'paragraph',
      text: 'The power is in the constraint. A spacing scale with six values produces consistent rhythm because there is nothing else to choose. A scale with twenty values is a palette, and a palette produces variation.',
    },
    {
      kind: 'callout',
      tone: 'insight',
      body: 'A foundation is doing its job when the correct choice is the easy one and an incorrect choice requires deliberate effort.',
    },
  ],

  firstPrinciples: [
    {
      kind: 'paragraph',
      text: 'Not every foundation can be equally rigid, because they do not all face the same variability. Spacing, radius, and elevation apply to containers, and containers are yours. Typography applies to content, and content is not.',
    },
    {
      kind: 'paragraph',
      text: 'A type scale rigid enough to look tidy in a mockup will fail the first time a real title runs to three lines, a translation arrives, or a user sets a larger default font size. Type needs bounded flexibility — clamps, measure limits, a scale that bends rather than breaks.',
    },
  ],

  designPerspective: [
    {
      kind: 'paragraph',
      text: 'Elevation is the most frequently misused foundation. Shadows are applied for decoration rather than to express a relationship, and once several levels exist without meanings, nobody can say which is correct for a new surface.',
    },
    {
      kind: 'paragraph',
      text: 'The fix is to define levels by meaning: resting, raised on hover, floating above the page, overlaying it. Four meanings, four levels, and a new surface picks the one matching its relationship rather than the one that looks nice.',
    },
  ],

  engineeringPerspective: [
    {
      kind: 'code',
      language: 'css',
      caption: 'Rigid where the system owns the variable; bounded where content does not.',
      code: `:root {
  /* Spacing: six values. Nothing between them is available. */
  --space-1: 0.25rem; --space-2: 0.5rem; --space-3: 0.75rem;
  --space-4: 1rem;    --space-6: 1.5rem; --space-8: 2rem;

  /* Elevation: levels with meanings, not decorations. */
  --elevation-resting: none;
  --elevation-raised: 0 1px 2px oklch(0 0 0 / 0.08);
  --elevation-floating: 0 8px 24px oklch(0 0 0 / 0.12);
  --elevation-overlay: 0 16px 48px oklch(0 0 0 / 0.18);

  /* Type: bounded rather than fixed, because content is not ours. */
  --text-title: clamp(1.5rem, 1rem + 2vw, 2.25rem);
  --measure-comfortable: 68ch;
}`,
    },
    {
      kind: 'paragraph',
      text: 'Using `rem` throughout matters: it respects the user\'s browser font size. A system built in pixels silently overrides an accessibility setting the user deliberately changed.',
    },
  ],

  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'A foundations page — every scale rendered, every level shown, every icon in its grid — is the single most useful artefact a system can publish. It is where designers and engineers look at the same thing and find out whether they agree.',
    },
    {
      kind: 'paragraph',
      text: 'It also catches drift early. A shadow in the product that does not appear on the page is a shadow that was invented, and that is much easier to see side by side than in a screenshot.',
    },
  ],

  industryExamples: [
    {
      id: 'example-foundations-pages',
      source: 'Published design systems',
      title: 'Foundations documented before components',
      observation:
        'Mature systems publish colour, type, spacing, elevation, and iconography pages ahead of any component documentation.',
      takeaway:
        'Components are assembled from foundations, so a component page is unreadable without them.',
    },
    {
      id: 'example-icon-grid',
      source: 'Icon systems',
      title: 'One grid, one stroke weight',
      observation:
        'Consistent icon sets are drawn on a shared grid with a fixed stroke weight and optical sizing rules.',
      takeaway:
        'Mixing families produces icons of different visual weight sitting next to each other, which reads as carelessness.',
    },
  ],

  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Creating a foundations page.',
    },
    { kind: 'heading', text: '1. Render every scale in full' },
    {
      kind: 'paragraph',
      text: 'Every colour with its name and value, every spacing step at real size, every type size with real text.',
    },
    { kind: 'heading', text: '2. Give every elevation level a meaning' },
    {
      kind: 'paragraph',
      text: 'Written next to it. A level without a stated meaning will be chosen by appearance.',
    },
    { kind: 'heading', text: '3. Show the type scale under stress' },
    {
      kind: 'paragraph',
      text: 'Long headings, short ones, three lines, a translated string. A scale that only works with placeholder copy is not finished.',
    },
    { kind: 'heading', text: '4. Show icons at every size' },
    {
      kind: 'paragraph',
      text: 'On the grid, at the sizes actually used, beside text at matching optical weight.',
    },
    { kind: 'heading', text: '5. Mark what is rigid and what is flexible' },
    {
      kind: 'paragraph',
      text: 'Explicitly. "Spacing is fixed; type scales between these bounds" is a rule people can follow.',
    },
    { kind: 'heading', text: '6. Test it at 200% zoom' },
    {
      kind: 'paragraph',
      text: 'And with a larger browser font size. Both are real user settings, and both break pixel-based systems.',
    },
  ],

  commonMistakes: [
    {
      id: 'mistake-too-many-steps',
      mistake: 'Building scales with too many values.',
      why: 'A twenty-step spacing scale is a palette, and a palette produces the variation the scale existed to prevent.',
      instead: 'Keep scales short enough that the right choice is obvious.',
    },
    {
      id: 'mistake-elevation-decorative',
      mistake: 'Using shadows decoratively.',
      why: 'Elevation stops meaning anything, so nobody can say which level a new surface should use.',
      instead: 'Define levels by relationship and apply them by meaning.',
    },
    {
      id: 'mistake-rigid-type',
      mistake: 'Fixing type sizes with no flexibility.',
      why: 'Real content, translations, and user font settings all break a scale designed around one set of strings.',
      instead: 'Bound the scale with clamps and constrain measure instead.',
    },
    {
      id: 'mistake-pixel-foundations',
      mistake: 'Defining type and spacing in pixels.',
      why: 'It overrides the user\'s browser font size, which is an accessibility setting they chose deliberately.',
      instead: 'Use rem so the system scales with the user\'s preference.',
    },
  ],

  eliteConsiderations: [
    {
      kind: 'list',
      items: [
        'Publish the foundations page before any component documentation; components are meaningless without it.',
        'State which foundations are rigid and which are bounded, so the rule is followed rather than guessed.',
        'Test every foundation at 200% zoom and at a larger default font size.',
        'Keep one icon family; a second family is visible immediately, whatever the drawing quality.',
      ],
    },
  ],

  practicalExercise: {
    id: 'exercise-09-02',
    title: 'Create a design-system foundations page',
    prompt:
      'Build a foundations page covering all six foundations, tested under real conditions.',
    steps: [
      'Render every colour, spacing, type, elevation, radius, and icon value.',
      'Write the meaning of each elevation level beside it.',
      'Show the type scale with realistic content, including long and translated strings.',
      'Show icons on their grid, at every size used, beside text.',
      'Mark explicitly which foundations are rigid and which are bounded.',
      'Verify every colour pairing for contrast.',
      'Test the page at 200% zoom and with a larger browser font size.',
      'Remove any value you cannot justify against a real usage.',
    ],
    successCriteria: [
      'All six foundations are rendered with names and values.',
      'Every elevation level has a written meaning.',
      'The type scale holds with long and translated content.',
      'The page is usable at 200% zoom and with a larger default font size.',
      'Rigid and flexible foundations are explicitly marked.',
    ],
    estimatedMinutes: 55,
    hint: 'Use real content. A foundations page built with placeholder text proves only that placeholder text fits.',
  },

  reflectionQuestion:
    'Which foundation should remain flexible rather than rigid?',
  reflectionHint: 'Content changes context.',

  resources: [
    {
      id: 'resource-material-foundations',
      title: 'Material Design: foundations',
      url: 'https://m3.material.io/foundations',
      type: 'documentation',
      estimatedMinutes: 45,
      note: 'A thorough foundations layer; read it for structure rather than for aesthetics.',
    },
    {
      id: 'resource-apple-hig-foundations',
      title: 'Apple Human Interface Guidelines: foundations',
      url: 'https://developer.apple.com/design/human-interface-guidelines/foundations',
      type: 'documentation',
      estimatedMinutes: 45,
      note: 'Particularly strong on typography that adapts to user settings.',
    },
  ],

  competencyTags: ['typography', 'colour', 'layout', 'accessibility', 'design-systems'],

  completionCriteria: [
    'Has built a foundations page covering all six foundations.',
    'Every elevation level has a written meaning.',
    'The page holds at 200% zoom and with a larger default font size.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Lesson 43                                                                   */
/* -------------------------------------------------------------------------- */

const LESSON_43: Lesson = {
  id: 'lesson-09-03',
  slug: 'components-across-design-and-code',
  moduleId: MODULE_ID,
  lessonNumber: 3,
  title: 'Components Across Design and Code',
  summary:
    'Parity is about names, variants, and states matching — not about every implementation detail appearing in the design file.',
  estimatedMinutes: 9,

  objectives: [
    'Establish shared naming across the design file and the codebase.',
    'Map design variant properties onto component props.',
    'Decide which implementation details should not be exposed in design.',
    'Detect and correct parity drift.',
  ],

  prerequisiteConcepts: ['Variants', 'Foundations', 'Component APIs'],
  prerequisiteLessonIds: ['lesson-09-02', 'lesson-08-03'],

  recap: [
    {
      kind: 'paragraph',
      text: 'You have tokens, foundations, and a component API. Parity is whether the two environments describe the same product.',
    },
  ],

  coreConcept: [
    {
      kind: 'paragraph',
      text: 'Parity means the same component has the same name, the same variant dimensions, the same values, and the same states in both environments. It does not mean the same structure — a design file has no concept of a callback, and a component has no concept of a layer.',
    },
    {
      kind: 'list',
      items: [
        'Names — identical for components and for their parts.',
        'Variant dimensions — the same axes with the same values.',
        'States — every interactive state present in both.',
        'Tokens — the same names resolving to the same values.',
      ],
    },
    {
      kind: 'paragraph',
      text: 'Some things belong only in code: event callbacks, refs, generic type parameters, controlled versus uncontrolled. Exposing those in a design file adds properties nobody can use and obscures the ones that matter.',
    },
    {
      kind: 'callout',
      tone: 'insight',
      body: 'Parity is about the decisions, not the mechanisms. If a property changes what the component looks like or what it means, it belongs in both. If it changes how it is wired, it belongs in code.',
    },
  ],

  firstPrinciples: [
    {
      kind: 'paragraph',
      text: 'The two environments have different jobs. A design file is for exploring and specifying appearance and arrangement; a codebase is for producing behaviour. Forcing them to mirror each other exactly makes both worse.',
    },
    {
      kind: 'paragraph',
      text: 'What must match is the vocabulary. When a designer says "Button, tone danger, size small, loading" and an engineer can write exactly that, the specification transfers with no translation and no ambiguity.',
    },
  ],

  designPerspective: [
    {
      kind: 'paragraph',
      text: 'Drift is inevitable and usually starts small: a variant added in code to unblock a release, a state adjusted in the file during a redesign. Neither is a failure of discipline; both are normal.',
    },
    {
      kind: 'paragraph',
      text: 'What matters is whether drift is detected. A periodic side-by-side comparison — every variant, every state, both environments — catches it while it is still one component rather than twenty.',
    },
  ],

  engineeringPerspective: [
    {
      kind: 'code',
      language: 'tsx',
      caption: 'Shared vocabulary above the line; implementation below it.',
      code: `interface ButtonProps {
  // Shared with the design file. Same names, same values.
  tone?: 'primary' | 'secondary' | 'quiet' | 'danger';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  leading?: React.ReactNode;   // "leading icon" slot in the design file

  // Code only. No meaningful representation in a design file.
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  ref?: React.Ref<HTMLButtonElement>;
  'aria-describedby'?: string;
}`,
    },
    {
      kind: 'paragraph',
      text: 'The split is worth writing into the component file as a comment. It tells the next person which props are part of the shared vocabulary and which are implementation, which is exactly the information a parity check needs.',
    },
  ],

  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'This is the most concrete place where design engineering exists as a discipline: maintaining one vocabulary across two tools, and knowing which differences are legitimate.',
    },
    {
      kind: 'paragraph',
      text: 'It also changes handoff. With true parity, a specification is a sentence rather than a redline, because both sides already share the terms.',
    },
  ],

  industryExamples: [
    {
      id: 'example-code-connect',
      source: 'Figma and code linking tools',
      title: 'Design components linked to their implementations',
      observation:
        'Teams increasingly connect design components to their real code counterparts so the design file can show the actual usage snippet.',
      takeaway:
        'Linking makes drift visible at the point of use rather than during a periodic audit.',
    },
    {
      id: 'example-shared-variant-names',
      source: 'Design systems with strong parity',
      title: 'Variant names identical in both tools',
      observation:
        'Systems that hold up use the same variant axis names and values in the design file and in the props.',
      takeaway:
        'The specification then needs no translation, which is where most handoff errors originate.',
    },
  ],

  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Matching one Figma component to one React component.',
    },
    { kind: 'heading', text: '1. Pick a component that exists in both' },
    {
      kind: 'paragraph',
      text: 'Button or Input is ideal: small enough to finish, complex enough to expose real mismatches.',
    },
    { kind: 'heading', text: '2. List the variant axes in each' },
    {
      kind: 'paragraph',
      text: 'Two columns. Names and values. The differences are visible immediately.',
    },
    { kind: 'heading', text: '3. Classify every difference' },
    {
      kind: 'paragraph',
      text: 'Drift to be fixed, or a legitimate environment difference. A callback is legitimate; a missing tone is drift.',
    },
    { kind: 'heading', text: '4. Reconcile the names' },
    {
      kind: 'paragraph',
      text: 'Pick one vocabulary and change both sides to match it. Half-renaming is worse than either original.',
    },
    { kind: 'heading', text: '5. Check every state exists in both' },
    {
      kind: 'paragraph',
      text: 'Default, hover, focus, active, disabled, loading, error. Focus is the one most often missing from design files.',
    },
    { kind: 'heading', text: '6. Write the parity table' },
    {
      kind: 'paragraph',
      text: 'Shared properties, code-only properties, and design-only properties. This is the artefact future checks run against.',
    },
  ],

  commonMistakes: [
    {
      id: 'mistake-expose-everything',
      mistake: 'Exposing every prop as a design property.',
      why: 'Callbacks and refs have no meaning in a design file and bury the properties that do.',
      instead: 'Share the decisions; keep the mechanisms in code.',
    },
    {
      id: 'mistake-divergent-names',
      mistake: 'Different names for the same thing in each tool.',
      why: 'Every conversation and every specification needs a translation, and translation is where errors enter.',
      instead: 'Agree one vocabulary and change both sides to it.',
    },
    {
      id: 'mistake-missing-focus-state',
      mistake: 'Omitting the focus state from the design file.',
      why: 'It gets implemented by whoever writes the CSS, inconsistently, and often as the browser default.',
      instead: 'Design every interactive state, focus included.',
    },
    {
      id: 'mistake-no-drift-check',
      mistake: 'Never comparing the two environments.',
      why: 'Drift accumulates silently until the design file and the product are describing different things.',
      instead: 'Run a periodic side-by-side comparison and record the result.',
    },
  ],

  eliteConsiderations: [
    {
      kind: 'list',
      items: [
        'Keep a parity table per component listing shared, code-only, and design-only properties.',
        'Link design components to their implementations so the real usage is visible in the file.',
        'Include focus and loading states in the design file; they are the two most often invented in code.',
        'When the two disagree, decide which is correct rather than making the other match automatically.',
      ],
    },
  ],

  practicalExercise: {
    id: 'exercise-09-03',
    title: 'Match one Figma component to one React component',
    prompt:
      'Achieve full parity for one component and document what legitimately differs.',
    steps: [
      'Choose a component that exists in both environments.',
      'List the variant axes and values in each, side by side.',
      'Classify every difference as drift or as a legitimate environment difference.',
      'Reconcile names to one vocabulary, changing both sides as needed.',
      'Verify every interactive state exists in both, focus included.',
      'Confirm both use the same token names for the same decisions.',
      'Write a parity table: shared, code-only, design-only.',
      'Record how long the reconciliation took, as an estimate of current drift.',
    ],
    successCriteria: [
      'Variant axis names and values match exactly.',
      'Every interactive state exists in both environments.',
      'A parity table documents all three categories.',
      'Both environments reference the same token names.',
      'Every remaining difference is classified as legitimate, in writing.',
    ],
    estimatedMinutes: 50,
    hint: 'The variant axes are where drift shows first. Compare those before anything visual.',
  },

  reflectionQuestion: 'Should Figma expose every implementation prop?',
  reflectionHint:
    'Design and code overlap, but they are not identical environments.',

  resources: [
    {
      id: 'resource-figma-code-connect',
      title: 'Figma: Code Connect',
      url: 'https://www.figma.com/code-connect-docs/',
      type: 'documentation',
      estimatedMinutes: 30,
      note: 'Linking design components to their real implementations.',
    },
    {
      id: 'resource-figma-properties',
      title: 'Figma: component properties',
      url: 'https://help.figma.com/hc/en-us/articles/5579474826519-Explore-component-properties',
      type: 'documentation',
      estimatedMinutes: 25,
      note: 'The design-side equivalent of props, and its limits.',
    },
  ],

  competencyTags: ['design-systems', 'design-to-code-translation', 'component-api-design'],

  completionCriteria: [
    'Has achieved variant and state parity for one component.',
    'A parity table documents shared and environment-specific properties.',
    'Both environments use the same token names.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Lesson 44                                                                   */
/* -------------------------------------------------------------------------- */

const LESSON_44: Lesson = {
  id: 'lesson-09-04',
  slug: 'patterns',
  moduleId: MODULE_ID,
  lessonNumber: 4,
  title: 'Patterns',
  summary:
    'A component is a thing. A pattern is a decision about how to use several of them together, and it is where most product inconsistency actually lives.',
  estimatedMinutes: 9,

  objectives: [
    'Distinguish a component from a pattern.',
    'Recognise when repeated composition deserves documentation.',
    'Document a pattern so it can be applied without a conversation.',
    'Identify the decision a pattern encodes.',
  ],

  prerequisiteConcepts: ['Composition', 'Component parity'],
  prerequisiteLessonIds: ['lesson-09-03', 'lesson-08-04'],

  recap: [
    {
      kind: 'paragraph',
      text: 'A system of well-built components still produces inconsistent products, because the components do not decide how they are combined.',
    },
  ],

  coreConcept: [
    {
      kind: 'paragraph',
      text: 'A component is a unit with an API. A pattern is a documented way of combining units to solve a recurring problem — a form layout, a destructive confirmation, a table with filters, a multi-step workflow.',
    },
    {
      kind: 'paragraph',
      text: 'The distinction matters because they fail differently. A component fails by being hard to use. A pattern fails by being ignored, and the result is five screens that solve the same problem five ways.',
    },
    {
      kind: 'list',
      items: [
        'Forms — label placement, error placement, validation timing, submit behaviour.',
        'Navigation — hierarchy, current-state indication, responsive collapse.',
        'Tables — sorting, filtering, selection, pagination, empty and loading states.',
        'Dialogs — when modal is warranted, what confirmation requires, where focus goes.',
        'Workflows — multi-step progress, saving, and abandonment.',
      ],
    },
    {
      kind: 'callout',
      tone: 'insight',
      body: 'Repetition alone does not justify documentation. Repetition plus a decision people keep making differently does.',
    },
  ],

  firstPrinciples: [
    {
      kind: 'paragraph',
      text: 'Patterns encode judgement that a component API cannot. Whether a destructive action needs typed confirmation, whether validation fires on blur or on submit, whether a long operation blocks the interface — these are product decisions, and a Button cannot hold them.',
    },
    {
      kind: 'paragraph',
      text: 'Undocumented, each is re-decided per screen by whoever is building it, under whatever time pressure they are under. The inconsistency users notice is almost always at this level rather than at the component level.',
    },
  ],

  designPerspective: [
    {
      kind: 'paragraph',
      text: 'The destructive-action pattern is a good example of a decision with real weight. Not every deletion deserves the same friction: removing a filter should be instant and undoable, deleting a project with fourteen tasks should state the consequence, and deleting an account should require typing its name.',
    },
    {
      kind: 'paragraph',
      text: 'The pattern encodes that calibration — friction proportional to consequence and to reversibility — so it is applied consistently rather than decided by whoever builds each screen.',
    },
  ],

  engineeringPerspective: [
    {
      kind: 'code',
      language: 'tsx',
      caption: 'The pattern applied: consequence stated, friction matched to it.',
      code: `// Reversible and low-consequence: act immediately, offer undo.
<Button tone="quiet" onClick={() => { removeFilter(id); toast.undo(restore); }}>
  Clear filter
</Button>

// Irreversible and significant: state the consequence, name the action.
<ConfirmDialog
  title="Delete this project?"
  consequence="This removes the project and its 14 tasks. It cannot be undone."
  confirmLabel="Delete project"   // never "OK" — the label states the action
  tone="danger"
  onConfirm={destroy}
/>

// Irreversible and severe: require deliberate input, not just a click.
<ConfirmDialog
  title="Delete your account?"
  consequence="All projects, tasks, and history are permanently removed."
  requireTyped="my-workspace"
  confirmLabel="Delete account"
  tone="danger"
  onConfirm={destroy}
/>`,
    },
    {
      kind: 'paragraph',
      text: 'Note what the pattern fixes beyond the friction level: the confirm button always names the action rather than saying OK, and the consequence is always stated in terms of what is lost. Those are decisions that would otherwise vary per dialog.',
    },
  ],

  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'Patterns are where a design system stops being a component library and becomes a description of how the product behaves. They are also the part most often missing, because they require judgement rather than assets.',
    },
    {
      kind: 'paragraph',
      text: 'A design engineer is well placed to write them, having seen both the design intent and what implementation actually does to it.',
    },
  ],

  industryExamples: [
    {
      id: 'example-destructive-patterns',
      source: 'Products with graded destructive actions',
      title: 'Friction proportional to consequence',
      observation:
        'Applications that handle deletion well use undo for the reversible, confirmation for the significant, and typed confirmation for the irreversible and severe.',
      takeaway:
        'One confirmation dialog for everything trains people to dismiss it, which removes the protection entirely.',
    },
    {
      id: 'example-form-patterns',
      source: 'Published form guidance',
      title: 'Validation timing documented as a decision',
      observation:
        'Systems with strong form patterns specify when validation runs — on blur after first interaction, on submit — rather than leaving it per form.',
      takeaway:
        'Validating on every keystroke tells someone they are wrong before they have finished being right.',
    },
  ],

  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Documenting a destructive-action pattern.',
    },
    { kind: 'heading', text: '1. Inventory the destructive actions' },
    {
      kind: 'paragraph',
      text: 'Every one in the product, with what it destroys and whether it can be undone.',
    },
    { kind: 'heading', text: '2. Grade them' },
    {
      kind: 'paragraph',
      text: 'Reversible, significant, severe. The grade comes from consequence and reversibility, not from how it feels.',
    },
    { kind: 'heading', text: '3. Assign friction to each grade' },
    {
      kind: 'paragraph',
      text: 'Undo, confirmation, typed confirmation. One rule per grade, applied everywhere.',
    },
    { kind: 'heading', text: '4. Fix the language rules' },
    {
      kind: 'paragraph',
      text: 'The confirm button names the action. The consequence states what is lost, with numbers where they exist.',
    },
    { kind: 'heading', text: '5. Specify focus and dismissal' },
    {
      kind: 'paragraph',
      text: 'Where focus lands, what Escape does, whether the destructive action is ever the default. It should not be.',
    },
    { kind: 'heading', text: '6. Show three worked examples' },
    {
      kind: 'paragraph',
      text: 'One per grade, with the real copy. Abstract patterns are applied inconsistently; concrete ones are copied.',
    },
  ],

  commonMistakes: [
    {
      id: 'mistake-pattern-per-repetition',
      mistake: 'Documenting a pattern for every repeated composition.',
      why: 'The library fills with patterns nobody needs, and the ones encoding real decisions get lost among them.',
      instead: 'Document where repetition meets a decision people keep making differently.',
    },
    {
      id: 'mistake-uniform-friction',
      mistake: 'Using one confirmation dialog for every destructive action.',
      why: 'People learn to dismiss it without reading, so it stops protecting anything.',
      instead: 'Grade by consequence and reversibility.',
    },
    {
      id: 'mistake-ok-cancel',
      mistake: 'Labelling the confirm button "OK".',
      why: 'It does not say what will happen, so the dialog can be confirmed without understanding it.',
      instead: 'Name the action: "Delete project".',
    },
    {
      id: 'mistake-abstract-patterns',
      mistake: 'Documenting a pattern without worked examples.',
      why: 'Abstract guidance is interpreted differently by everyone who reads it.',
      instead: 'Include concrete examples with real copy.',
    },
  ],

  eliteConsiderations: [
    {
      kind: 'list',
      items: [
        'State the decision the pattern encodes, not only the arrangement — the reasoning is what makes it applicable to new cases.',
        'Prefer undo over confirmation wherever the action can genuinely be reversed.',
        'Never make the destructive action the default focus target.',
        'Review patterns when the product changes; a pattern that encodes an outdated decision is worse than none.',
      ],
    },
  ],

  practicalExercise: {
    id: 'exercise-09-04',
    title: 'Document a destructive-action pattern',
    prompt:
      'Write a destructive-action pattern with graded friction and three worked examples.',
    steps: [
      'Inventory every destructive action in an interface, with its consequence and reversibility.',
      'Grade each as reversible, significant, or severe.',
      'Define the friction for each grade.',
      'Write the language rules for button labels and consequence statements.',
      'Specify focus placement, Escape behaviour, and what must never be the default.',
      'Produce three worked examples with real copy, one per grade.',
      'State the decision the pattern encodes, in one paragraph.',
      'Apply it to an existing screen and record what changed.',
    ],
    successCriteria: [
      'Three grades are defined with distinct friction.',
      'Button labels name the action in every example.',
      'Consequences are stated concretely, with numbers where available.',
      'Focus and dismissal behaviour are specified.',
      'The pattern states the decision it encodes, not only the arrangement.',
    ],
    estimatedMinutes: 50,
    hint: 'Grade by what happens if someone confirms by accident. That single question produces the grades.',
  },

  reflectionQuestion:
    'When does repeated composition deserve system documentation?',
  reflectionHint: 'Repetition plus decision-making.',

  resources: [
    {
      id: 'resource-nngroup-confirmation',
      title: 'Confirmation dialogs can prevent user errors',
      url: 'https://www.nngroup.com/articles/confirmation-dialog/',
      type: 'article',
      estimatedMinutes: 15,
      note: 'When confirmation helps and when it trains dismissal.',
    },
    {
      id: 'resource-gov-uk-patterns',
      title: 'GOV.UK Design System: patterns',
      url: 'https://design-system.service.gov.uk/patterns/',
      type: 'documentation',
      estimatedMinutes: 60,
      note: 'Patterns documented with their research and reasoning attached.',
    },
  ],

  competencyTags: ['interaction-design', 'design-systems', 'product-judgement'],

  completionCriteria: [
    'Has documented a pattern with graded friction.',
    'Three worked examples with real copy exist.',
    'The encoded decision is stated explicitly.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Lesson 45                                                                   */
/* -------------------------------------------------------------------------- */

const LESSON_45: Lesson = {
  id: 'lesson-09-05',
  slug: 'governance',
  moduleId: MODULE_ID,
  lessonNumber: 5,
  title: 'Governance',
  summary:
    'Design systems fail for process reasons far more often than for design reasons. Governance is the part that decides whether anyone uses it.',
  estimatedMinutes: 9,

  objectives: [
    'Define a contribution process that is genuinely usable.',
    'Version a system so consumers can upgrade at their own pace.',
    'Measure adoption rather than assuming it.',
    'Deprecate without stranding the people who depend on you.',
  ],

  prerequisiteConcepts: ['Patterns', 'Component APIs', 'Semantic versioning'],
  prerequisiteLessonIds: ['lesson-09-04', 'lesson-06-05'],

  recap: [
    {
      kind: 'paragraph',
      text: 'Tokens, foundations, components, parity, and patterns. All of it is optional to a product team under a deadline, which is what governance is about.',
    },
  ],

  coreConcept: [
    {
      kind: 'paragraph',
      text: 'Governance is the set of processes that keep a system alive: how something gets in, how it gets reviewed, how changes are released, how adoption is measured, and how things get removed.',
    },
    {
      kind: 'list',
      items: [
        'Contribution — how someone proposes a component or a change, and what is required of them.',
        'Review — who decides, against what criteria, in what timeframe.',
        'Versioning — how consumers learn what changed and when they must act.',
        'Adoption — how much of the product actually uses the system.',
        'Deprecation — how something is removed without breaking its dependents.',
      ],
    },
    {
      kind: 'paragraph',
      text: 'The failure is almost always the same shape. The components are good, the documentation is thorough, and product teams build their own anyway — because contributing was slower than copying, or because a needed variant was refused with no alternative offered.',
    },
    {
      kind: 'callout',
      tone: 'warning',
      body: 'A system nobody adopts is worse than no system. It costs maintenance and provides nothing, while the product fragments anyway.',
    },
  ],

  firstPrinciples: [
    {
      kind: 'paragraph',
      text: 'A design system competes with copy-and-paste, which has zero process cost and works immediately. Every hour of contribution friction is an hour arguing for the alternative.',
    },
    {
      kind: 'paragraph',
      text: 'So the process has to be fast enough to be the easy path. A two-week review for a variant guarantees the variant gets built locally instead, and the divergence it was meant to prevent happens anyway — just invisibly.',
    },
  ],

  designPerspective: [
    {
      kind: 'paragraph',
      text: 'The most common governance mistake is refusing requests without offering anything. "That is not in the system" leaves the requester with a deadline and no route, so they build it themselves and the system never learns the need existed.',
    },
    {
      kind: 'paragraph',
      text: 'A better response has three parts: the closest existing thing, an assessment of whether this is a real gap, and a route if it is. That keeps the conversation inside the system rather than pushing it out.',
    },
  ],

  engineeringPerspective: [
    {
      kind: 'code',
      language: 'md',
      caption: 'A contribution checklist that can actually be completed.',
      code: `## Before proposing

- [ ] Three real usages exist, from at least two screens
- [ ] No existing component covers it, and the closest one is named
- [ ] The variant dimensions are orthogonal, and the combination count is stated

## The proposal

- [ ] API drafted as call sites, not as implementation
- [ ] Every state defined: default, hover, focus, active, disabled, loading, error
- [ ] Keyboard model specified
- [ ] Only semantic tokens referenced
- [ ] Contrast verified in every theme

## Before merging

- [ ] Documented: props, states, accessibility, examples
- [ ] Rendered on the variant matrix page
- [ ] Design-file counterpart exists with matching names
- [ ] Operable by keyboard alone, verified`,
    },
    {
      kind: 'paragraph',
      text: 'The checklist is deliberately front-loaded with evidence rather than implementation. Three real usages from two screens is the test that distinguishes a system component from one team\'s requirement.',
    },
  ],

  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'Governance is where design and engineering decisions get made together or not at all. A contribution reviewed only by designers ships with no keyboard model; one reviewed only by engineers ships with a variant nobody needed.',
    },
    {
      kind: 'paragraph',
      text: 'The checklist is the mechanism that makes both reviews happen without requiring both people in the room.',
    },
  ],

  industryExamples: [
    {
      id: 'example-adoption-metrics',
      source: 'Design system teams',
      title: 'Adoption measured, not assumed',
      observation:
        'Teams that sustain systems track what proportion of the product uses system components, and investigate where it does not.',
      takeaway:
        'Low adoption in one area is information about the system, not about the team avoiding it.',
    },
    {
      id: 'example-deprecation-path',
      source: 'Versioned component libraries',
      title: 'Deprecation with a migration path',
      observation:
        'Well-run libraries mark components deprecated with a documented replacement and often a codemod, and remove them a full version later.',
      takeaway:
        'Removing something without a route is how a system loses the trust it depends on.',
    },
  ],

  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Writing a contribution checklist.',
    },
    { kind: 'heading', text: '1. Decide what evidence is required' },
    {
      kind: 'paragraph',
      text: 'Real usages, from more than one screen. This is the filter between a system need and one team\'s need.',
    },
    { kind: 'heading', text: '2. Require the API before the implementation' },
    {
      kind: 'paragraph',
      text: 'Call sites, variant dimensions, the combination count. Review the design, not the code.',
    },
    { kind: 'heading', text: '3. Make accessibility non-optional' },
    {
      kind: 'paragraph',
      text: 'Keyboard model, focus, contrast. Items on the checklist, not aspirations in a guideline.',
    },
    { kind: 'heading', text: '4. State the review timeframe' },
    {
      kind: 'paragraph',
      text: 'A commitment, not an intention. Without one, the fallback is copy-and-paste.',
    },
    { kind: 'heading', text: '5. Define what happens on rejection' },
    {
      kind: 'paragraph',
      text: 'The closest existing component, or a route to try again. Never a refusal with no alternative.',
    },
    { kind: 'heading', text: '6. Test it on a real contribution' },
    {
      kind: 'paragraph',
      text: 'Take a component through the whole checklist. Every step that is unclear or slow is a step people will skip.',
    },
  ],

  commonMistakes: [
    {
      id: 'mistake-slow-contribution',
      mistake: 'A contribution process slower than building it locally.',
      why: 'Teams under deadline take the faster path, and the divergence happens invisibly.',
      instead: 'Commit to a review timeframe fast enough to be the easy option.',
    },
    {
      id: 'mistake-refuse-no-alternative',
      mistake: 'Rejecting a request without offering a route.',
      why: 'The requester still has a deadline, so they build it themselves and the need never reaches the system.',
      instead: 'Always name the closest existing thing or a path forward.',
    },
    {
      id: 'mistake-breaking-changes',
      mistake: 'Changing a component API without a version or a migration path.',
      why: 'Consumers break on upgrade, so they stop upgrading, and the system fragments by version.',
      instead: 'Version semantically, deprecate first, and document the migration.',
    },
    {
      id: 'mistake-adoption-assumed',
      mistake: 'Assuming adoption because the system exists.',
      why: 'You cannot tell where it is being bypassed, so you cannot tell what is missing.',
      instead: 'Measure usage and investigate the gaps.',
    },
  ],

  eliteConsiderations: [
    {
      kind: 'list',
      items: [
        'Treat every local reimplementation as a bug report about the system, not about the team.',
        'Ship a codemod with any breaking change; it converts a migration from work into a command.',
        'Publish the contribution queue and its status, so the process is visibly alive.',
        'Deprecate loudly and remove quietly, a full version later.',
      ],
    },
  ],

  practicalExercise: {
    id: 'exercise-09-05',
    title: 'Write a component contribution checklist',
    prompt:
      'Write a contribution checklist and validate it by taking a real component through it.',
    steps: [
      'Define what evidence a proposal must carry, including how many real usages.',
      'Require the API as call sites before any implementation.',
      'Make keyboard model, focus behaviour, and contrast explicit checklist items.',
      'State a review timeframe you would commit to.',
      'Define what a rejection must include.',
      'Define the versioning and deprecation rules.',
      'Take a real component through the entire checklist.',
      'Record every step that was unclear or slow, and revise it.',
    ],
    successCriteria: [
      'Evidence requirements are concrete and countable.',
      'The API is reviewed before implementation.',
      'Accessibility items are checklist entries, not recommendations.',
      'A review timeframe is stated.',
      'A rejection route is defined, and the checklist was validated on a real component.',
    ],
    estimatedMinutes: 50,
    hint: 'Time yourself going through it. If contributing takes longer than copying the component, the checklist has already lost.',
  },

  reflectionQuestion:
    'Why do design systems fail even when components are well designed?',
  reflectionHint: 'Systems depend on people and process.',

  resources: [
    {
      id: 'resource-design-systems-handbook',
      title: 'Design Systems Handbook',
      url: 'https://www.designbetter.co/design-systems-handbook',
      type: 'book',
      estimatedMinutes: 120,
      note: 'Particularly the chapters on adoption and process.',
    },
    {
      id: 'resource-semver-09',
      title: 'Semantic versioning',
      url: 'https://semver.org/',
      type: 'specification',
      estimatedMinutes: 15,
      note: 'What a version number promises consumers.',
    },
    {
      id: 'resource-primer-contributing',
      title: 'Primer: contributing',
      url: 'https://primer.style/guides/contribute',
      type: 'documentation',
      estimatedMinutes: 25,
      note: 'A published contribution process for a large system.',
    },
  ],

  competencyTags: ['design-systems', 'critique', 'product-judgement'],

  completionCriteria: [
    'Has written a contribution checklist with concrete evidence requirements.',
    'The checklist was validated on a real component.',
    'Versioning and deprecation rules are defined.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Project                                                                     */
/* -------------------------------------------------------------------------- */

const PROJECT: ModuleProject = {
  id: 'project-09',
  slug: 'figma-react-mini-design-system',
  moduleId: MODULE_ID,
  title: 'Figma + React Mini Design System',
  brief:
    'Deliver a small but complete design system: tokens, foundations, components, documentation, Figma parity, and coded examples.',
  problem:
    'A design system is only real when the same decisions hold in both environments. This project is small enough to finish and complete enough to expose the hard part: keeping one vocabulary across a design file and a codebase, and proving it by building something with it rather than by describing it.',
  objectives: [
    'Build a three-layer token system supporting more than one theme.',
    'Document foundations with real content and real user settings.',
    'Achieve name, variant, and state parity between design and code.',
    'Prove the system works by building an interface entirely from it.',
  ],
  requirements: [
    'Tokens: primitive, semantic, and component layers.',
    'A foundations page covering colour, typography, spacing, elevation, radius, and iconography.',
    'At least six components, documented with API, states, and accessibility behaviour.',
    'A Figma library with matching names, variants, and states.',
    'Coded examples showing each component in real use.',
    'A parity table per component.',
  ],
  constraints: [
    'Components may reference semantic tokens only, never primitives.',
    'Every variant dimension must be orthogonal, with the combination count recorded.',
    'Accessibility-critical props must be required.',
    'The system must support a second theme with no component changes.',
  ],
  suggestedScope:
    'Six to eight components and one screen built entirely from them. Do not build a documentation site framework, a token pipeline, or a publishing setup — the deliverable is the system and the proof that it works.',
  deliverables: [
    'The token layer, with each semantic token\'s meaning documented.',
    'A foundations page tested at 200% zoom and with a larger default font size.',
    'Components with API, state, and accessibility documentation.',
    'A Figma library with a parity table per component.',
    'One complete screen built entirely from the system.',
    'A short note on where the system resisted the screen, and what you changed.',
  ],
  completionCriteria: [
    'The screen is built without a single hard-coded colour, spacing, or type value.',
    'A second theme works with no component changes.',
    'Variant names and values match exactly between Figma and code.',
    'Every component is operable by keyboard, verified with the mouse unplugged.',
    'Every semantic token and every component has written documentation.',
  ],
  portfolioEvidence: [
    'Three-layer token architecture',
    'Design-system foundations',
    'Figma and code parity',
    'Component documentation',
    'Multi-theme support',
  ],
  reflectionQuestion:
    'Where did the system resist the screen you built, and was the system wrong or was the screen inconsistent?',
  estimatedHours: 32,
  competencies: [
    'typography',
    'colour',
    'accessibility',
    'design-systems',
    'css',
    'design-to-code-translation',
    'design-systems-implementation',
  ],
  stretchGoals: [
    'Generate CSS custom properties and Figma variables from one token source.',
    'Add a high-contrast theme and record what the token layer had to change to support it.',
  ],
};

/* -------------------------------------------------------------------------- */

export const MODULE_09: CurriculumModule = {
  id: MODULE_ID,
  slug: 'design-systems',
  moduleNumber: 9,
  phase: 'systems',
  title: 'Design Systems',
  description:
    'Tokens as named decisions, foundations as constrained scales, parity between design and code, patterns above components, and the governance that decides whether any of it is used.',
  outcome: 'Can build and sustain a design system across design and code.',
  prerequisites: [
    'Modules 1 to 8, or equivalent',
    'Experience building components and working in a design tool',
  ],
  lessons: [LESSON_41, LESSON_42, LESSON_43, LESSON_44, LESSON_45],
  resources: [
    {
      id: 'resource-module-09-primer',
      title: 'GitHub Primer',
      url: 'https://primer.style/',
      type: 'documentation',
      estimatedMinutes: 120,
      note: 'Tokens, foundations, components, and contribution process, all published.',
    },
    {
      id: 'resource-module-09-gov-uk',
      title: 'GOV.UK Design System',
      url: 'https://design-system.service.gov.uk/',
      type: 'documentation',
      estimatedMinutes: 120,
      note: 'Unusually strong on patterns and on publishing the research behind them.',
    },
    {
      id: 'resource-module-09-handbook',
      title: 'Design Systems Handbook',
      url: 'https://www.designbetter.co/design-systems-handbook',
      type: 'book',
      estimatedMinutes: 180,
      note: 'The process and organisational side, which is where systems usually fail.',
    },
  ],
  project: PROJECT,
  competencies: [
    'typography',
    'colour',
    'layout',
    'interaction-design',
    'accessibility',
    'design-systems',
    'critique',
    'product-judgement',
    'css',
    'design-to-code-translation',
    'component-api-design',
    'design-systems-implementation',
  ],
  completionCriteria: [
    'All five lessons completed.',
    'Module project marked completed.',
    'Can build a token system and maintain parity across design and code.',
  ],
};
