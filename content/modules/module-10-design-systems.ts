/**
 * Module 10 — Design Systems.
 *
 * Placed last in phase 3 deliberately. A design system is the visual work of
 * Module 2 expressed as tokens, the components of Module 8 given a shared
 * vocabulary, and the accessibility of Module 9 built in rather than audited.
 * Taught earlier it would be notation without anything to notate.
 */

import type { CurriculumModule, Lesson, ModuleProject } from '@/types/curriculum';

const MODULE_ID = 'module-10';

/* -------------------------------------------------------------------------- */
/* Lesson 46                                                                   */
/* -------------------------------------------------------------------------- */

const LESSON_1: Lesson = {
  id: 'lesson-design-tokens',
  slug: 'design-tokens',
  moduleId: MODULE_ID,
  lessonNumber: 1,
  title: 'Design Tokens',
  summary:
    'The named values a system is built from, in three layers — and the middle layer is the one that makes a theme possible.',
  estimatedMinutes: 10,
  objectives: [
    'Distinguish primitive, semantic and component tokens.',
    'Name tokens for meaning rather than appearance.',
    'Explain why components should consume semantic tokens.',
    'Build a token set that supports a second theme without renaming anything.',
  ],
  prerequisiteConcepts: [
    'Colour and contrast, Module 2 lesson 9',
    'Spacing systems, Module 2 lesson 7',
    'Variants as unions, Module 8 lesson 38',
  ],
  prerequisiteLessonIds: [
    'lesson-colour-contrast-and-meaning',
    'lesson-variants-without-complexity',
  ],
  recap: [
    {
      kind: 'paragraph',
      text: 'Module 2 gave you a spacing scale and a colour system with meaning attached. Module 8 gave you components with finite variants. Tokens are how those two become one thing.',
    },
  ],
  priorKnowledge: [
    {
      kind: 'paragraph',
      text: 'You have already written CSS custom properties — `--focus-ring` appeared in Module 9. A token is that, organised: a named value, defined once, referenced everywhere.',
    },
    {
      kind: 'paragraph',
      text: 'The organisation is the whole lesson. Custom properties without layers are just variables.',
    },
  ],
  coreConcept: [
    {
      kind: 'paragraph',
      text: 'Tokens come in three layers, and each answers a different question.',
    },
    {
      kind: 'code',
      language: 'css',
      code: ':root {\n  /* 1. Primitive — the raw palette. Names describe the value. */\n  --grey-50:  oklch(98% 0 0);\n  --grey-900: oklch(20% 0 0);\n  --blue-500: oklch(55% 0.18 255);\n  --red-500:  oklch(55% 0.19 25);\n\n  /* 2. Semantic — the role. Names describe the purpose. */\n  --surface:        var(--grey-50);\n  --text-primary:   var(--grey-900);\n  --accent:         var(--blue-500);\n  --danger:         var(--red-500);\n\n  /* 3. Component — one component’s use of a role. */\n  --button-primary-background: var(--accent);\n  --button-danger-background:  var(--danger);\n}',
    },
    {
      kind: 'paragraph',
      text: 'Primitive answers "what colours exist". Semantic answers "what is this colour for". Component answers "what does this component use".',
    },
    {
      kind: 'paragraph',
      text: 'The direction only ever flows one way: components reference semantic, semantic references primitive. A component reaching past the semantic layer to `--blue-500` has broken the system quietly.',
    },
  ],
  whyDesignersCare: [
    {
      kind: 'paragraph',
      text: 'Because the semantic layer is where design intent is recorded, and without it the intent lives only in people’s heads.',
    },
    {
      kind: 'paragraph',
      text: '`--blue-500` says what a colour looks like. `--accent` says what it is for. When the brand colour changes, the first requires finding every use and judging whether this particular blue meant "accent" or just happened to be blue. The second is one line.',
    },
    {
      kind: 'paragraph',
      text: 'The semantic layer is also what makes dark mode possible rather than a rebuild.',
    },
  ],
  howItWorks: [
    {
      kind: 'paragraph',
      text: 'A theme redefines the semantic layer and nothing else.',
    },
    {
      kind: 'code',
      language: 'css',
      code: '@media (prefers-color-scheme: dark) {\n  :root {\n    --surface:      var(--grey-900);\n    --text-primary: var(--grey-50);\n    --accent:       var(--blue-400);\n  }\n}',
    },
    {
      kind: 'paragraph',
      text: 'Three lines change and the whole interface follows, because every component references `--surface` rather than a grey. No component is touched and no component can opt out.',
    },
    {
      kind: 'paragraph',
      text: 'Note that the primitives did not change. Grey 900 is still grey 900; what changed is which role it fills. That is the separation earning its keep.',
    },
    {
      kind: 'paragraph',
      text: 'The component layer is optional, and worth being honest about. It is useful when a component needs a value that is genuinely its own — a button’s minimum height, say. For most colour use it adds a layer of indirection without adding information, and a system with a component token for every property of every component is harder to read than one without.',
    },
  ],
  firstPrinciples: [
    {
      kind: 'paragraph',
      text: 'Tokens apply to every visual dimension, not just colour.',
    },
    {
      kind: 'code',
      language: 'css',
      code: ':root {\n  /* Spacing — the Module 2 scale, named. */\n  --space-1: 0.25rem;\n  --space-2: 0.5rem;\n  --space-3: 0.75rem;\n  --space-4: 1rem;\n  --space-6: 1.5rem;\n  --space-8: 2rem;\n\n  /* Radius */\n  --radius-sm: 4px;\n  --radius-md: 6px;\n  --radius-full: 999px;\n\n  /* Type */\n  --text-body:  1rem;\n  --text-title: 1.5rem;\n  --weight-regular: 400;\n  --weight-medium:  500;\n}',
    },
    {
      kind: 'paragraph',
      text: 'The point of a scale as tokens is that off-scale values become visible. `padding: var(--space-3)` is a choice from the system; `padding: 13px` is a decision somebody made alone, and in a token-based codebase it stands out in review.',
    },
    {
      kind: 'callout',
      tone: 'insight',
      body: 'A token system’s real output is not consistency — it is that inconsistency becomes conspicuous. Nothing stops a hard-coded value; the system just makes it obvious.',
    },
  ],
  designPerspective: [
    {
      kind: 'paragraph',
      text: 'The design question is how many semantic roles the product actually has.',
    },
    {
      kind: 'paragraph',
      text: 'Surface, raised surface, border, text, muted text, accent, danger, success, warning — perhaps a dozen. Too few and the system cannot express the design; too many and nobody knows which to pick, so they pick by appearance and the meaning drains out. This is the Module 8 variant argument applied to colour.',
    },
  ],
  engineeringPerspective: [
    {
      kind: 'paragraph',
      text: 'The engineering question is where tokens are defined and how they reach both tools.',
    },
    {
      kind: 'paragraph',
      text: 'CSS custom properties are the simplest answer: one definition, cascading, themeable at runtime, inspectable in developer tools. Larger systems often keep tokens in a neutral format and generate CSS, Figma variables and native platform values from it. Either way the principle holds — one source, many outputs — and for a single product the simple answer is usually the right one.',
    },
  ],
  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'Figma variables and CSS custom properties are the same idea in two tools.',
    },
    {
      kind: 'paragraph',
      text: 'A Figma variable named `surface` and a CSS property named `--surface` holding the same value mean a design and its implementation can be compared directly. When the names diverge, every handoff includes a translation step, and translation steps are where drift begins.',
    },
  ],
  industryExamples: [
    {
      id: 'example-polaris-tokens',
      source: 'Shopify',
      title: 'Tokens published with their roles',
      observation:
        'Polaris publishes its tokens grouped by purpose — colour, spacing, typography, shadow — with the role each one fills.',
      takeaway:
        'The grouping is by meaning rather than by value, which is what makes the list usable when choosing one.',
    },
    {
      id: 'example-material-token-layers',
      source: 'Material Design',
      title: 'Layers named explicitly',
      observation:
        'Material Design 3 documents design tokens in reference, system and component layers.',
      takeaway:
        'The three-layer model is not a convention invented per team. It recurs because the problem it solves recurs.',
    },
  ],
  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Build a minimal token set and prove it by theming it.',
    },
    {
      kind: 'code',
      language: 'css',
      code: ':root {\n  /* Primitives */\n  --grey-0:   oklch(100% 0 0);\n  --grey-100: oklch(96% 0 0);\n  --grey-300: oklch(85% 0 0);\n  --grey-600: oklch(55% 0 0);\n  --grey-900: oklch(20% 0 0);\n  --blue-500: oklch(55% 0.18 255);\n  --red-500:  oklch(55% 0.19 25);\n\n  /* Semantic */\n  --surface:         var(--grey-0);\n  --surface-raised:  var(--grey-100);\n  --border:          var(--grey-300);\n  --text-primary:    var(--grey-900);\n  --text-muted:      var(--grey-600);\n  --accent:          var(--blue-500);\n  --danger:          var(--red-500);\n  --focus-ring:      var(--blue-500);\n}\n\n.card {\n  background: var(--surface-raised);\n  border: 1px solid var(--border);\n  border-radius: var(--radius-md);\n  padding: var(--space-4);\n  color: var(--text-primary);\n}',
    },
    {
      kind: 'paragraph',
      text: 'Eight semantic roles for a start. The card references only semantic tokens, so it has no opinion about which grey it is.',
    },
    {
      kind: 'paragraph',
      text: 'Now the test. Redefine the semantic layer for dark mode and check every component. Anything that does not follow is referencing a primitive directly, and that is the leak the test exists to find.',
    },
    {
      kind: 'code',
      language: 'javascript',
      code: '// Finds hard-coded colour in authored stylesheets — the leak this test looks for.\n// Only reads same-origin sheets; cross-origin ones throw and are skipped.\n[...document.styleSheets].flatMap((sheet) => {\n  try {\n    return [...sheet.cssRules]\n      .filter((rule) => /#[0-9a-f]{3,8}|rgba?\\(|oklch\\(/i.test(rule.cssText ?? ""))\n      .filter((rule) => /--[a-z]/.test(rule.cssText) === false)\n      .map((rule) => rule.cssText.slice(0, 100));\n  } catch {\n    return [];\n  }\n});',
    },
    {
      kind: 'paragraph',
      text: 'The honest limitation: this finds literal colours in rules that define no custom property, so it will flag some legitimate cases and miss colours set from JavaScript. It is a lead generator, not a verdict — the dark mode pass is the real test.',
    },
  ],
  commonMistakes: [
    {
      id: 'mistake-10-01-appearance-names',
      mistake: 'Naming semantic tokens after appearance: `--light-grey-background`.',
      why: 'In dark mode the name becomes a lie, and the token cannot be rethemed without renaming every use.',
      instead: 'Name the role: `--surface`, `--surface-raised`. The name stays true under every theme.',
    },
    {
      id: 'mistake-10-01-skipping-semantic-layer',
      mistake: 'Components referencing primitives directly.',
      why: 'Theming stops working for those components, and the reason a particular value was chosen is lost.',
      instead: 'Components consume semantic tokens only. If no role fits, the system is missing one — add it.',
    },
  ],
  professionalConsideration: [
    {
      kind: 'paragraph',
      text: 'Token naming is the most consequential and least glamorous decision in a design system.',
    },
    {
      kind: 'paragraph',
      text: 'Names are referenced from everywhere, so renaming one is a codebase-wide change plus a Figma library update plus a conversation with everybody who learned the old name. It is the Module 8 point about APIs being harder to change than implementations, at system scale — which is why a day spent on naming before anything is built is a day well spent.',
    },
  ],
  practicalExercise: {
    id: 'exercise-design-tokens',
    title: 'Create a token set',
    prompt:
      'Build a complete token set for a small product in three layers, and prove the semantic layer works by theming it.',
    steps: [
      'Define primitives: a grey ramp, an accent, and the status colours you need.',
      'Define semantic tokens for every role the product has. Name them for purpose.',
      'Add spacing, radius and type tokens from your Module 2 scales.',
      'Rebuild three components from Module 8 using only semantic tokens.',
      'Add a dark theme by redefining the semantic layer alone.',
      'Check every component follows, and fix any that reference primitives.',
      'Check contrast in both themes against the Module 2 requirements.',
      'Name one semantic role you were tempted to add and decided against.',
    ],
    successCriteria: [
      'Three distinct layers, with references flowing one way only.',
      'Semantic tokens named for role, not appearance.',
      'Three components using semantic tokens exclusively.',
      'The dark theme changes the semantic layer only.',
      'Contrast verified in both themes.',
      'One rejected role is documented with reasoning.',
    ],
    estimatedMinutes: 70,
    hint: 'Build the dark theme early rather than last. It finds every primitive leak immediately, and finding them while there are three components is far cheaper than at thirty.',
  },
  reflectionQuestion:
    'Why does the semantic layer exist, when a component could reference a primitive directly and look identical?',
  reflectionHint:
    'Ask what changes when the brand colour changes, or when the interface has to work in dark mode.',
  resources: [
    {
      id: 'resource-material-design-tokens',
      title: 'Design tokens — Material Design 3',
      url: 'https://m3.material.io/foundations/design-tokens/overview',
      type: 'documentation',
      author: 'Material Design',
      estimatedMinutes: 30,
      note: 'The layered model explained clearly, with the reasoning for each layer.',
    },
    {
      id: 'resource-polaris-tokens',
      title: 'Tokens — Polaris',
      url: 'https://polaris.shopify.com/tokens/color',
      type: 'documentation',
      author: 'Shopify',
      estimatedMinutes: 25,
      note: 'A real published token set. Note how the names describe roles rather than values.',
    },
  ],
  competencyTags: ['design-systems', 'design-systems-implementation', 'colour', 'css'],
  completionCriteria: [
    'Can distinguish the three token layers and explain each.',
    'Names semantic tokens for role rather than appearance.',
    'Can add a theme by changing the semantic layer only.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Lesson 47                                                                   */
/* -------------------------------------------------------------------------- */

const LESSON_2: Lesson = {
  id: 'lesson-system-foundations',
  slug: 'system-foundations',
  moduleId: MODULE_ID,
  lessonNumber: 2,
  title: 'Foundations',
  summary:
    'Typography, colour, spacing, radius, elevation and iconography — the decisions everything else is built on, documented so they can be followed.',
  estimatedMinutes: 10,
  objectives: [
    'Define each foundation as a finite, documented scale.',
    'Build a foundations page that is usable as a reference.',
    'Explain what elevation is for beyond decoration.',
    'Keep iconography consistent in weight, size and metaphor.',
  ],
  prerequisiteConcepts: [
    'Typography, Module 2 lesson 8',
    'Spacing and rhythm, Module 2 lesson 7',
    'Design tokens',
  ],
  prerequisiteLessonIds: ['lesson-design-tokens', 'lesson-typography-for-interfaces'],
  recap: [
    {
      kind: 'paragraph',
      text: 'Tokens gave you a way to name values. Foundations are the decision about which values exist.',
    },
  ],
  priorKnowledge: [
    {
      kind: 'paragraph',
      text: 'Module 2 argued for scales over arbitrary values: a spacing scale, a type scale, colour with meaning. This lesson turns those arguments into a reference other people can use without asking you.',
    },
  ],
  coreConcept: [
    {
      kind: 'paragraph',
      text: 'A foundation is a **finite set of allowed values** for one visual dimension. Six foundations cover most products.',
    },
    {
      kind: 'list',
      items: [
        '**Typography** — sizes, weights, line heights, and which combination each role uses.',
        '**Colour** — the palette and the semantic roles from the previous lesson.',
        '**Spacing** — one scale, used for padding, gaps and margins alike.',
        '**Radius** — three or four values, with a rule for which applies where.',
        '**Elevation** — a small set of shadows, each meaning a particular distance from the page.',
        '**Iconography** — one grid, one stroke weight, one visual style.',
      ],
    },
    {
      kind: 'paragraph',
      text: 'Finite is the operative word. A scale with eight spacing values is a system; one with "whatever the design needs" is a preference.',
    },
  ],
  whyDesignersCare: [
    {
      kind: 'paragraph',
      text: 'Because foundations are where a product gets its character, and they are set once.',
    },
    {
      kind: 'paragraph',
      text: 'Tight spacing, small radii and restrained shadows read as dense and technical. Generous spacing, large radii and soft shadows read as approachable. Neither is better — but the choice is made in these six scales, and every screen afterwards inherits it.',
    },
  ],
  howItWorks: [
    {
      kind: 'paragraph',
      text: '**Typography** is the foundation that benefits most from being expressed as roles rather than sizes.',
    },
    {
      kind: 'code',
      language: 'css',
      code: ':root {\n  --text-display:  2rem;\n  --text-title:    1.5rem;\n  --text-heading:  1.125rem;\n  --text-body:     1rem;\n  --text-small:    0.875rem;\n  --text-caption:  0.75rem;\n\n  --leading-tight: 1.2;\n  --leading-body:  1.5;\n}\n\n.title {\n  font-size: var(--text-title);\n  line-height: var(--leading-tight);\n  font-weight: var(--weight-medium);\n}',
    },
    {
      kind: 'paragraph',
      text: 'Six sizes with two line heights. The named role — `.title` — bundles size, line height and weight together, so a title is one decision rather than three that can be made inconsistently.',
    },
    {
      kind: 'paragraph',
      text: 'Tight line height for large text, looser for body: the Module 2 lesson 8 rule, now encoded rather than remembered.',
    },
    {
      kind: 'paragraph',
      text: '**Elevation** is the foundation most often treated as decoration. It is better understood as distance.',
    },
    {
      kind: 'code',
      language: 'css',
      code: ':root {\n  --elevation-0: none;                                      /* flush with the page */\n  --elevation-1: 0 1px 2px oklch(0% 0 0 / 0.08);            /* a card */\n  --elevation-2: 0 4px 12px oklch(0% 0 0 / 0.10);           /* a dropdown */\n  --elevation-3: 0 16px 32px oklch(0% 0 0 / 0.14);          /* a dialog */\n}',
    },
    {
      kind: 'paragraph',
      text: 'Four levels, each meaning something: on the page, slightly above it, floating, or modal. A dropdown at elevation 3 is not a styling error — it is a statement that the dropdown is as far forward as a dialog, which contradicts how it behaves.',
    },
  ],
  firstPrinciples: [
    {
      kind: 'paragraph',
      text: 'The principle: a foundation is useful in proportion to how **few** values it has.',
    },
    {
      kind: 'paragraph',
      text: 'Twenty spacing values is not a scale, because any gap can be justified by one of them. Six is a scale, because choosing means deciding, and a decision can be reviewed.',
    },
    {
      kind: 'paragraph',
      text: 'The same holds for radius, elevation and type. The constraint is the product — it is what stops every screen from solving the same problem slightly differently.',
    },
    {
      kind: 'callout',
      tone: 'insight',
      body: 'If a value is missing from a scale, that is information. Either the design needs it — so add it to the scale, once, for everyone — or the design should use the nearest value. Adding it locally is how a scale quietly stops being one.',
    },
  ],
  designPerspective: [
    {
      kind: 'paragraph',
      text: 'The design question is whether the foundations page shows what people need to make a decision.',
    },
    {
      kind: 'paragraph',
      text: 'A grid of colour swatches is pretty and nearly useless. A list showing each role, its value, where it is used and what it pairs with is a tool. The second takes longer and is the only one anyone will consult twice.',
    },
  ],
  engineeringPerspective: [
    {
      kind: 'paragraph',
      text: 'The engineering question is whether the foundations page is generated from the tokens.',
    },
    {
      kind: 'paragraph',
      text: 'A hand-written page drifts the first time a token changes, and then actively misinforms. Reading the values from the stylesheet — or from the same source the stylesheet is built from — means the documentation cannot be wrong, which is worth some setup cost.',
    },
  ],
  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'Foundations are the contract between designing and building.',
    },
    {
      kind: 'paragraph',
      text: 'When both tools hold the same six scales, a design using a value outside them is visibly off-system in Figma, and so is an implementation that invents one. The disagreement surfaces at the point it was made rather than in review.',
    },
  ],
  industryExamples: [
    {
      id: 'example-geist-foundations',
      source: 'Vercel',
      title: 'Foundations published as reference',
      observation:
        'Geist documents colour, typography and spacing as browsable reference pages with the values shown.',
      takeaway:
        'The documentation is the system’s interface. If it is not pleasant to consult, people will guess instead.',
    },
    {
      id: 'example-material-typography-roles',
      source: 'Material Design',
      title: 'Type as named roles',
      observation:
        'Material Design 3 defines typography as named roles — display, headline, title, body, label — each bundling size, weight and line height.',
      takeaway:
        'Roles rather than sizes. Choosing "title" is one decision; choosing 24px, medium, 1.2 is three.',
    },
  ],
  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Build a foundations page that is a tool rather than a gallery.',
    },
    {
      kind: 'paragraph',
      text: 'For each foundation, show four things: the value, its token name, where it should be used, and a realistic example.',
    },
    {
      kind: 'code',
      language: 'tsx',
      code: 'const SPACING = [\n  { token: "--space-1", value: "0.25rem", use: "Icon to adjacent text" },\n  { token: "--space-2", value: "0.5rem",  use: "Inside small controls" },\n  { token: "--space-3", value: "0.75rem", use: "Between related fields" },\n  { token: "--space-4", value: "1rem",    use: "Standard card padding" },\n  { token: "--space-6", value: "1.5rem",  use: "Between sections" },\n  { token: "--space-8", value: "2rem",    use: "Between major regions" },\n] as const;\n\nfunction SpacingScale() {\n  return (\n    <table>\n      <caption>Spacing</caption>\n      <thead>\n        <tr><th>Token</th><th>Value</th><th>Use</th><th>Example</th></tr>\n      </thead>\n      <tbody>\n        {SPACING.map(({ token, value, use }) => (\n          <tr key={token}>\n            <td><code>{token}</code></td>\n            <td>{value}</td>\n            <td>{use}</td>\n            <td><div style={{ width: `var(${token})`, height: "1rem", background: "var(--accent)" }} /></td>\n          </tr>\n        ))}\n      </tbody>\n    </table>\n  );\n}',
    },
    {
      kind: 'paragraph',
      text: 'The "Use" column is the part that makes this a tool. Without it the page says what exists; with it the page answers the question people actually have, which is which one to pick.',
    },
    {
      kind: 'paragraph',
      text: 'A real table element, with `caption` and `th`, because this is tabular data — the Module 9 semantics applied to your own documentation.',
    },
  ],
  commonMistakes: [
    {
      id: 'mistake-10-02-scale-without-guidance',
      mistake: 'Publishing scales without saying which value to use when.',
      why: 'People choose by eye, so the same gap gets three different values across the product and the scale buys nothing.',
      instead: 'Document the intended use of every value. The scale is the vocabulary; the guidance is the grammar.',
    },
    {
      id: 'mistake-10-02-elevation-as-decoration',
      mistake: 'Choosing shadows for appearance rather than for distance.',
      why: 'Elevation stops carrying information, so nothing on screen indicates what is layered above what.',
      instead: 'Give each level a meaning and assign components to levels by behaviour.',
    },
  ],
  professionalConsideration: [
    {
      kind: 'paragraph',
      text: 'Foundations are the hardest part of a system to change later, and the easiest to get approximately right now.',
    },
    {
      kind: 'paragraph',
      text: 'Changing the spacing scale after a hundred screens exist means rejudging a hundred screens. Nobody does it, so products live with their original scale for years. Spending real time here — and deliberately choosing fewer values than feel comfortable — is the highest-leverage design systems work available.',
    },
  ],
  practicalExercise: {
    id: 'exercise-system-foundations',
    title: 'Create a foundations page',
    prompt:
      'Build a foundations page documenting all six foundations with values, token names, intended use and examples.',
    steps: [
      'Define each of the six foundations as a finite scale.',
      'For every value, write its intended use in one line.',
      'Build the page with a section per foundation and a real example of each value.',
      'Assign every component from Module 8 to an elevation level and justify it.',
      'Document the icon rules: grid size, stroke weight, and when a filled icon is used.',
      'Read the values from the stylesheet rather than hard-coding them in the page.',
      'Give it to someone else and ask them to pick values for an unfamiliar screen.',
      'Record where they hesitated, and fix the guidance there.',
    ],
    successCriteria: [
      'All six foundations documented as finite scales.',
      'Every value has an intended use.',
      'Every component is assigned an elevation with reasoning.',
      'Icon rules are explicit.',
      'Values come from the tokens, not from hand-written copies.',
      'The hesitation points are recorded and addressed.',
    ],
    estimatedMinutes: 75,
    hint: 'The handover test is the valuable step. Where someone else hesitates is exactly where the documentation is a gallery rather than a tool.',
  },
  reflectionQuestion:
    'Why does a scale with six values serve a product better than one with twenty?',
  reflectionHint:
    'Ask what happens when any gap on screen can be justified by some value in the scale.',
  resources: [
    {
      id: 'resource-geist-colors',
      title: 'Colors — Geist Design System',
      url: 'https://vercel.com/geist/colors',
      type: 'documentation',
      author: 'Vercel',
      estimatedMinutes: 20,
      note: 'A foundations page done well. Note how much guidance sits beside each value.',
    },
    {
      id: 'resource-material-typography',
      title: 'Typography — Material Design 3',
      url: 'https://m3.material.io/styles/typography/overview',
      type: 'documentation',
      author: 'Material Design',
      estimatedMinutes: 25,
      note: 'Type as named roles rather than a list of sizes.',
    },
  ],
  competencyTags: ['design-systems', 'design-systems-implementation', 'typography', 'colour', 'visual-hierarchy'],
  completionCriteria: [
    'Defines each foundation as a finite scale with documented use.',
    'Can explain elevation as distance rather than decoration.',
    'Builds documentation that reads values from the tokens.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Lesson 48                                                                   */
/* -------------------------------------------------------------------------- */

const LESSON_3: Lesson = {
  id: 'lesson-components-across-figma-and-code',
  slug: 'components-across-figma-and-code',
  moduleId: MODULE_ID,
  lessonNumber: 3,
  title: 'Components Across Figma and Code',
  summary:
    'One component, two tools. Where the names must match, where the structures legitimately differ, and how to tell the difference.',
  estimatedMinutes: 10,
  objectives: [
    'Map a Figma component and its properties onto a React component and its props.',
    'Keep naming parity across both tools.',
    'Identify where design and code must differ, and why.',
    'Document the mapping so it can be checked.',
  ],
  prerequisiteConcepts: [
    'Component APIs, Module 8 lesson 37',
    'Variants, Module 8 lesson 38',
    'Design tokens',
  ],
  prerequisiteLessonIds: ['lesson-system-foundations', 'lesson-designing-component-apis'],
  recap: [
    {
      kind: 'paragraph',
      text: 'Module 8 lesson 38 noted that a Figma variant property and a union prop are the same decision. This lesson makes that correspondence a deliverable.',
    },
  ],
  priorKnowledge: [
    {
      kind: 'paragraph',
      text: 'You build Figma components with properties — variant, boolean, text, instance swap — and React components with typed props. The two models are close enough that the differences are the interesting part.',
    },
  ],
  coreConcept: [
    {
      kind: 'paragraph',
      text: 'Parity means the same component has the same name, the same properties, and the same allowed values in both tools.',
    },
    {
      kind: 'code',
      language: 'tsx',
      code: '/*\n *  Figma                        React\n *  ─────                        ─────\n *  Button                       <Button>\n *    Tone: Primary |            tone?: "primary" |\n *          Secondary |                "secondary" |\n *          Danger                     "danger"\n *    Size: Small | Medium       size?: "small" | "medium"\n *    Icon: Boolean              icon?: React.ReactNode\n *    Label: Text                children: React.ReactNode\n */',
    },
    {
      kind: 'paragraph',
      text: 'Same name, same properties, same values, differing only in case convention. "Primary, medium, with icon" now identifies one button in a design review and one call in a code review.',
    },
    {
      kind: 'paragraph',
      text: 'Note the two rows that are not identical. Figma’s `Icon: Boolean` toggles a layer; React takes the icon itself. And `Label: Text` becomes `children`. Both are real differences, covered below.',
    },
  ],
  whyDesignersCare: [
    {
      kind: 'paragraph',
      text: 'Because without parity every handoff includes a translation, and translations lose things.',
    },
    {
      kind: 'paragraph',
      text: 'A design specifying "Button / Type=Emphasis" against an implementation offering `tone="primary"` forces someone to decide whether those are the same thing. They usually are, the guess is usually right, and the one time it is not produces a destructive action styled as a primary one.',
    },
  ],
  howItWorks: [
    {
      kind: 'paragraph',
      text: 'The mapping is mechanical for most property types.',
    },
    {
      kind: 'list',
      items: [
        'Variant property → a union prop. Same values, same spelling.',
        'Boolean property → a boolean prop, or an optional prop whose presence is the condition.',
        'Text property → a string prop, or `children` for the main content.',
        'Instance swap → `children` or a named slot, from Module 8 lesson 39.',
      ],
    },
    {
      kind: 'paragraph',
      text: 'Instance swap to slot is the most useful correspondence. A Figma component with a swappable region and a React component with a named slot have drawn the same line between system and content.',
    },
    {
      kind: 'paragraph',
      text: 'Where the two legitimately differ, there are three recurring cases.',
    },
    {
      kind: 'list',
      ordered: true,
      items: [
        '**Interaction states.** Figma needs a variant for hover, focus and pressed, because it has to draw them. Code gets them from CSS pseudo-classes and must not have props for them.',
        '**Structural variants.** Figma sometimes needs separate variants for layouts that code produces from one component with different content.',
        '**Content.** Figma shows one plausible instance; code must handle the empty, long and awkward cases.',
      ],
    },
    {
      kind: 'paragraph',
      text: 'The first is the one that causes trouble. A `state` variant in Figma faithfully copied into code produces `state="hover"` — a prop that will be wrong, because the browser already knows and nothing updates the prop.',
    },
  ],
  firstPrinciples: [
    {
      kind: 'paragraph',
      text: 'The distinction that resolves all three: Figma documents **appearances**; code produces **behaviours**.',
    },
    {
      kind: 'paragraph',
      text: 'A Figma variant set is a catalogue of how the component can look. A React component is a machine that produces those looks from inputs and the browser’s own state.',
    },
    {
      kind: 'paragraph',
      text: 'So anything the browser determines — hover, focus, pressed, active — is drawn in Figma and derived in code. Anything a person chooses is a property in both. That single test sorts almost every case.',
    },
    {
      kind: 'callout',
      tone: 'insight',
      body: 'Parity is about the properties a person chooses. The states the browser supplies belong in Figma for documentation and in CSS for behaviour, never as props.',
    },
  ],
  designPerspective: [
    {
      kind: 'paragraph',
      text: 'The design question is whether the Figma component is honest about what the code can do.',
    },
    {
      kind: 'paragraph',
      text: 'A Figma Button with eleven variants against a code Button with six means five designs cannot be built. That gap is worth finding deliberately, and the usual resolution is not to add five variants — it is to agree that five were never wanted.',
    },
  ],
  engineeringPerspective: [
    {
      kind: 'paragraph',
      text: 'The engineering question is how the mapping stays true.',
    },
    {
      kind: 'paragraph',
      text: 'Nothing enforces it automatically in a small system, so the practical defence is a written mapping table kept with the component documentation, reviewed when either side changes. Tooling exists to connect design and code components more formally; for a product this size the table is enough and gets maintained, which matters more than being clever.',
    },
  ],
  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'The mapping table is where a design system stops being two systems.',
    },
    {
      kind: 'paragraph',
      text: 'Without it there is a Figma library and a component library that resemble each other. With it there is one system with two representations, and the question "does the code match the design?" has an answer that can be checked rather than argued.',
    },
  ],
  industryExamples: [
    {
      id: 'example-figma-component-properties',
      source: 'Figma',
      title: 'Properties as a component API',
      observation:
        'Figma’s guidance on components, styles and shared libraries treats component properties as the interface a library exposes to its users.',
      takeaway:
        'The same framing as Module 8: properties are an API, and an API is designed rather than accumulated.',
    },
    {
      id: 'example-polaris-two-representations',
      source: 'Shopify',
      title: 'One system, two representations',
      observation:
        'Polaris publishes code components and design resources under the same component names and structure.',
      takeaway:
        'Shared naming is what lets a single conversation cover both. It looks like a small decision and behaves like a large one.',
    },
  ],
  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Map one real component, both directions, and record the differences.',
    },
    {
      kind: 'paragraph',
      text: 'Take your Figma Input and your React Input.',
    },
    {
      kind: 'code',
      language: 'tsx',
      code: '/*\n *  Figma Input                  React Input                 Note\n *  ───────────                  ───────────                 ────\n *  Size: Small | Medium         size?: "small" | "medium"    parity\n *  State: Default | Hover |     —                            CSS pseudo-classes\n *         Focus | Disabled |    isDisabled?: boolean         except disabled, which is a prop\n *         Error                 error?: string               error carries its message\n *  Label: Text                  label: string                required in code\n *  Hint: Text                   hint?: string                parity\n *  Icon: Boolean                icon?: React.ReactNode       code takes the icon itself\n *  —                            id: string                   needed for label association\n */',
    },
    {
      kind: 'paragraph',
      text: 'Four rows match. Four do not, and each difference has a reason worth writing down.',
    },
    {
      kind: 'paragraph',
      text: 'Hover and focus are CSS. Disabled is a prop because the application decides it. Error is a string rather than a variant, because an error state needs its message — the Module 8 lesson 37 point. And `id` exists only in code, because label association needs it, which Figma has no equivalent for.',
    },
    {
      kind: 'paragraph',
      text: 'That last row is the one to notice: code sometimes needs a property purely to make the Module 9 accessibility work possible. It is not a parity failure; it is a thing Figma cannot represent.',
    },
  ],
  commonMistakes: [
    {
      id: 'mistake-10-03-state-as-prop',
      mistake: 'Copying a Figma `state` variant into a `state` prop.',
      why: 'Hover, focus and pressed are the browser’s to determine. A prop for them will be stale because nothing updates it.',
      instead: 'Use CSS pseudo-classes. Keep props only for states the application decides, such as disabled and loading.',
    },
    {
      id: 'mistake-10-03-divergent-names',
      mistake: 'Different names for the same property in each tool.',
      why: 'Every handoff needs translating, and the translation is where a destructive variant gets built as a primary one.',
      instead: 'Agree names once and change both together. Record them in the mapping table.',
    },
  ],
  professionalConsideration: [
    {
      kind: 'paragraph',
      text: 'Parity is maintained by a habit, not by tooling.',
    },
    {
      kind: 'paragraph',
      text: 'The habit is that a change to either representation includes a check on the other. It survives only if it is cheap, which is the argument for a short mapping table rather than an elaborate pipeline. The pipeline gets abandoned; the table gets updated, because updating it takes a minute.',
    },
  ],
  practicalExercise: {
    id: 'exercise-components-across-figma-and-code',
    title: 'Map one Figma component to React',
    prompt:
      'Take one component you have in both Figma and code, map every property in both directions, and resolve the mismatches.',
    steps: [
      'List every Figma property with its type and allowed values.',
      'List every React prop with its type.',
      'Build the mapping table, marking each row as parity or difference.',
      'For every difference, write why it exists and whether it is legitimate.',
      'Rename anything that differs only in naming.',
      'Find any Figma variant that the code cannot produce, and decide: build it or drop it.',
      'Find any prop with no Figma equivalent and say whether Figma needs one.',
      'Add the finished table to the component documentation.',
    ],
    successCriteria: [
      'Every property mapped in both directions.',
      'Each row marked parity or difference.',
      'Every difference justified.',
      'Naming mismatches resolved.',
      'Unbuildable variants explicitly built or dropped.',
      'The table lives with the component documentation.',
    ],
    estimatedMinutes: 65,
    hint: 'Do the differences column honestly. "Legitimate" and "drift" look identical in a table until you write the reason, and writing it is what tells them apart.',
  },
  reflectionQuestion:
    'Why should hover and focus be Figma variants but not React props?',
  reflectionHint:
    'Ask who decides each one, and who would have to keep a prop up to date.',
  resources: [
    {
      id: 'resource-figma-components-best-practices',
      title: 'Components, styles and shared libraries',
      url: 'https://www.figma.com/best-practices/components-styles-and-shared-libraries/',
      type: 'article',
      author: 'Figma',
      estimatedMinutes: 40,
      note: 'Structuring a Figma library as a system. The API framing maps directly onto Module 8.',
    },
    {
      id: 'resource-designsystems-com',
      title: 'Design Systems',
      url: 'https://www.designsystems.com/',
      type: 'article',
      author: 'Figma',
      estimatedMinutes: 45,
      note: 'Articles and interviews on running a system across design and engineering. Browse by topic.',
    },
  ],
  competencyTags: ['design-systems', 'design-systems-implementation', 'design-to-code-translation', 'component-api-design'],
  completionCriteria: [
    'Can map a Figma component to a React component in both directions.',
    'Keeps naming parity and records the mapping.',
    'Can distinguish a legitimate difference from drift.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Lesson 49                                                                   */
/* -------------------------------------------------------------------------- */

const LESSON_4: Lesson = {
  id: 'lesson-patterns-and-product-workflows',
  slug: 'patterns-and-product-workflows',
  moduleId: MODULE_ID,
  lessonNumber: 4,
  title: 'Patterns and Product Workflows',
  summary:
    'A component is a thing. A pattern is a way of using several things to solve a recurring problem — and patterns are where most product inconsistency actually lives.',
  estimatedMinutes: 10,
  objectives: [
    'Distinguish a component from a pattern.',
    'Document a pattern so it can be followed without you.',
    'Identify which product problems recur often enough to deserve one.',
    'Specify the states and edge cases a pattern must cover.',
  ],
  prerequisiteConcepts: [
    'Components across both tools',
    'Interface states, Module 1 lesson 4',
    'Behaviour mapping, Module 5 lesson 25',
  ],
  prerequisiteLessonIds: [
    'lesson-components-across-figma-and-code',
    'lesson-mapping-product-behaviour-before-coding',
  ],
  recap: [
    {
      kind: 'paragraph',
      text: 'You have components with parity across both tools. That still leaves every question about how to combine them, which is where products lose consistency.',
    },
  ],
  priorKnowledge: [
    {
      kind: 'paragraph',
      text: 'Module 5 lesson 25 had you write a behaviour specification before coding — states, triggers, transitions, edge cases. A documented pattern is that specification, written once for a problem that recurs.',
    },
  ],
  coreConcept: [
    {
      kind: 'paragraph',
      text: 'A **component** is a reusable thing. A **pattern** is a reusable *way of solving a problem*, usually combining several components with specified behaviour.',
    },
    {
      kind: 'list',
      items: [
        'Button, Input, Dialog, Table — components.',
        'Destructive action, form submission, empty state, navigation, data table — patterns.',
      ],
    },
    {
      kind: 'paragraph',
      text: 'The Dialog component is one thing. "How we confirm a destructive action" is a pattern that uses Dialog, specifies the wording, decides whether typing a name is required, places the danger button, and says where focus goes.',
    },
    {
      kind: 'paragraph',
      text: 'Give five engineers a Dialog and no pattern and you get five confirmation flows, all internally reasonable.',
    },
  ],
  whyDesignersCare: [
    {
      kind: 'paragraph',
      text: 'Because patterns are where inconsistency survives a successful component library.',
    },
    {
      kind: 'paragraph',
      text: 'A product can have one Button and one Dialog and still confirm deletion three different ways — one with a typed name, one with a checkbox, one with nothing. Every screen uses the system; the product is still inconsistent where it matters most.',
    },
  ],
  howItWorks: [
    {
      kind: 'paragraph',
      text: 'A documented pattern has six parts.',
    },
    {
      kind: 'list',
      ordered: true,
      items: [
        '**Problem** — what recurring situation this addresses.',
        '**Solution** — the components involved and how they are arranged.',
        '**States** — every state the flow can be in.',
        '**Behaviour** — triggers, transitions, and where focus goes.',
        '**Content** — the wording rules, with real examples.',
        '**Edge cases** — the awkward situations and what to do about each.',
      ],
    },
    {
      kind: 'paragraph',
      text: 'Worth writing out for the destructive action, because it is the pattern with the highest cost of inconsistency.',
    },
    {
      kind: 'code',
      language: 'markdown',
      code: '## Destructive action\n\n**Problem**\nA user is about to do something that cannot be undone.\n\n**Solution**\nDialog + danger Button. Cancel on the left, destructive on the right.\nFor irreversible loss of other people’s work, require the name to be typed.\n\n**States**\nidle → confirming → deleting → deleted | failed\n\n**Behaviour**\n- Focus the dialog title on open, never the destructive button.\n- Escape cancels. Cancel is always available.\n- While deleting, disable both buttons and show progress on the destructive one.\n- On success, close and announce in a live region.\n- On failure, stay open and show the reason in the dialog.\n- On close, return focus to the trigger.\n\n**Content**\n- Title names the object: "Delete Marketing Site?"\n- Body states the consequence: "This deletes 42 pages and cannot be undone."\n- Button says the verb: "Delete", never "OK" or "Yes".\n\n**Edge cases**\n- Object already deleted by someone else → close, explain, refresh the list.\n- Permission lost since the dialog opened → explain; do not retry.\n- Offline → keep the dialog open, say the action was not attempted.',
    },
    {
      kind: 'paragraph',
      text: 'That is a page. It removes an entire category of decision from every future feature, and it converts "does this feel right?" in review into "does this follow the pattern?"',
    },
  ],
  firstPrinciples: [
    {
      kind: 'paragraph',
      text: 'The edge cases are the part that makes a pattern worth more than a screenshot.',
    },
    {
      kind: 'paragraph',
      text: 'Everyone can produce the happy path. What varies between implementations — and what users encounter at the worst moment — is the already-deleted case, the permission case, the offline case. Those are decided once in a pattern or re-decided badly in every feature.',
    },
    {
      kind: 'callout',
      tone: 'insight',
      body: 'A pattern that documents only the happy path has documented the part nobody needed help with.',
    },
  ],
  designPerspective: [
    {
      kind: 'paragraph',
      text: 'The design question is which problems recur enough to deserve a pattern.',
    },
    {
      kind: 'paragraph',
      text: 'Three uses is a reasonable threshold, and the same signal as Module 8 lesson 36 used for components. A pattern written for one situation is just that situation’s design, with the overhead of pretending to be general.',
    },
  ],
  engineeringPerspective: [
    {
      kind: 'paragraph',
      text: 'The engineering question is whether a pattern should become code.',
    },
    {
      kind: 'paragraph',
      text: 'Sometimes it should: a `ConfirmDestructive` component makes the pattern the path of least resistance, which is the only reliable form of enforcement. Sometimes it should not, because the variation between uses is real and a component would need a prop per use — the configuration trap from Module 8 lesson 39. Documented patterns and coded patterns are both legitimate; the question is whether the variation is real.',
    },
  ],
  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'Patterns are where a design system reaches product decisions rather than visual ones.',
    },
    {
      kind: 'paragraph',
      text: 'Tokens and components make a product look coherent. Patterns make it *behave* coherently — and behavioural consistency is what people actually experience as a product being well made.',
    },
  ],
  industryExamples: [
    {
      id: 'example-polaris-patterns',
      source: 'Shopify',
      title: 'Patterns documented separately from components',
      observation:
        'Polaris documents patterns — including form layouts and app settings — as their own section alongside the component reference.',
      takeaway:
        'The separation is deliberate. Patterns answer different questions from components and are consulted at a different moment.',
    },
    {
      id: 'example-apple-hig-patterns',
      source: 'Apple',
      title: 'Guidance about situations, not controls',
      observation:
        'Apple’s Human Interface Guidelines organise much of their advice around situations — entering data, managing accounts, handling errors — rather than around individual controls.',
      takeaway:
        'The situation is the unit people need help with. A control reference does not tell you how to handle a destructive action.',
    },
  ],
  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Document the empty state pattern, which is short and immediately useful.',
    },
    {
      kind: 'code',
      language: 'markdown',
      code: '## Empty state\n\n**Problem**\nA region has nothing to show, and the reason changes what to offer.\n\n**Solution**\nThree distinct variants, never one:\n\n| Reason | Message | Action |\n| --- | --- | --- |\n| Nothing created yet | "No projects yet" | Create the first one |\n| Filters matched nothing | "No projects match these filters" | Clear filters |\n| Loading failed | "Could not load projects" | Retry |\n\n**States**\nThe first two are success states with zero results. The third is an error state.\nThey are never interchangeable.\n\n**Behaviour**\n- The action is the primary action of the region while empty.\n- Clearing filters returns to the unfiltered list, not to a reload.\n- Retry re-requests; it does not reload the page.\n\n**Content**\n- Say what is missing, not that something is missing.\n- One sentence. An empty state is not an opportunity for copy.\n\n**Edge cases**\n- Filtered to nothing *and* the unfiltered list is also empty → show the first variant.\n- Permission removed → say so; do not offer a create action that will fail.',
    },
    {
      kind: 'paragraph',
      text: 'The first edge case is the one worth having written down. Showing "no results match these filters" when there is nothing to match sends someone to adjust filters that were never the problem.',
    },
    {
      kind: 'paragraph',
      text: 'This is the Module 4 lesson 18 distinction and the Module 7 lesson 33 implementation, now stated once as a rule the whole product follows.',
    },
  ],
  commonMistakes: [
    {
      id: 'mistake-10-04-pattern-as-screenshot',
      mistake: 'Documenting a pattern as an image of the happy path.',
      why: 'The states, behaviour and edge cases are the content. An image conveys none of them.',
      instead: 'Write the six parts. The image is an illustration, not the documentation.',
    },
    {
      id: 'mistake-10-04-premature-pattern',
      mistake: 'Writing a pattern for something that has happened once.',
      why: 'It generalises from a single case, so it is usually wrong, and it is now the rule everybody has to follow.',
      instead: 'Wait for three uses. Until then it is one screen’s design, which is fine.',
    },
  ],
  professionalConsideration: [
    {
      kind: 'paragraph',
      text: 'Patterns are the part of a design system most often missing and most valuable per page written.',
    },
    {
      kind: 'paragraph',
      text: 'Components get built because they are needed to ship. Patterns only get written if somebody decides to, and they are what prevent a product that uses the system everywhere from still feeling assembled by different people. If you have an afternoon for design system work, a well-written destructive action pattern beats another component.',
    },
  ],
  practicalExercise: {
    id: 'exercise-patterns-and-product-workflows',
    title: 'Document one workflow pattern',
    prompt:
      'Choose a pattern your product needs and document it fully in the six parts, with the edge cases worked out.',
    steps: [
      'Choose from: form submission, destructive action, empty state, navigation, or data table.',
      'Write the problem in two sentences.',
      'Specify the solution: which components, arranged how.',
      'List every state the flow can be in.',
      'Specify behaviour, including where focus goes at each step.',
      'Write the content rules with real examples, not placeholders.',
      'Work out at least four edge cases and decide each.',
      'Implement one instance of the pattern and record where the documentation was unclear.',
    ],
    successCriteria: [
      'All six parts written.',
      'Every state listed, with error states distinguished from empty success states.',
      'Focus behaviour specified at each step.',
      'Content rules include real examples.',
      'Four or more edge cases decided.',
      'One implementation exists and its friction points are recorded.',
    ],
    estimatedMinutes: 75,
    hint: 'Implementing from your own documentation is the test. Every point where you had to decide something is a gap, and it is better found by you than by someone else.',
  },
  reflectionQuestion:
    'How can a product use one component library everywhere and still be inconsistent?',
  reflectionHint:
    'Components decide what things look like. Something else decides how they are combined.',
  resources: [
    {
      id: 'resource-polaris-patterns',
      title: 'Patterns — Polaris',
      url: 'https://polaris.shopify.com/patterns',
      type: 'documentation',
      author: 'Shopify',
      estimatedMinutes: 40,
      note: 'Patterns documented as a first-class part of a system. Note how much is behaviour rather than appearance.',
    },
    {
      id: 'resource-apple-hig',
      title: 'Human Interface Guidelines',
      url: 'https://developer.apple.com/design/human-interface-guidelines',
      type: 'documentation',
      author: 'Apple',
      estimatedMinutes: 60,
      note: 'Guidance organised around situations. Read the patterns section rather than the components one.',
    },
  ],
  competencyTags: ['design-systems', 'product-thinking', 'ux-reasoning', 'interface-state-modelling', 'product-judgement'],
  completionCriteria: [
    'Can distinguish a component from a pattern.',
    'Documents a pattern in six parts including edge cases.',
    'Can judge when a problem recurs enough to deserve one.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Lesson 50                                                                   */
/* -------------------------------------------------------------------------- */

const LESSON_5: Lesson = {
  id: 'lesson-governance-and-maintaining-a-system',
  slug: 'governance-and-maintaining-a-system',
  moduleId: MODULE_ID,
  lessonNumber: 5,
  title: 'Governance and Maintaining a System',
  summary:
    'A design system is a product with users. Contribution, review, adoption, versioning and deprecation are what keep it one, and most systems fail here rather than at the design.',
  estimatedMinutes: 10,
  objectives: [
    'Define how a change enters the system.',
    'Write a contribution checklist somebody can follow.',
    'Explain versioning and how a breaking change is communicated.',
    'Deprecate something without breaking what depends on it.',
  ],
  prerequisiteConcepts: [
    'Patterns and documentation',
    'Git branches and pull requests, Module 6 lesson 29',
    'Component APIs, Module 8 lesson 37',
  ],
  prerequisiteLessonIds: [
    'lesson-patterns-and-product-workflows',
    'lesson-branches-commits-and-pull-requests',
  ],
  recap: [
    {
      kind: 'paragraph',
      text: 'You have tokens, foundations, components with parity, and documented patterns. That is a design system on the day it is finished. This lesson is about the following year.',
    },
  ],
  priorKnowledge: [
    {
      kind: 'paragraph',
      text: 'Module 6 lesson 29 covered branches, pull requests and reading diffs. Governance is that machinery pointed at a shared system rather than at your own project.',
    },
  ],
  coreConcept: [
    {
      kind: 'paragraph',
      text: 'A design system has users, and like any product it needs a way for them to ask for things and a way to say no.',
    },
    {
      kind: 'paragraph',
      text: 'Four questions define a governance model:',
    },
    {
      kind: 'list',
      ordered: true,
      items: [
        '**Contribution** — how does someone propose a change?',
        '**Review** — who decides, and against what criteria?',
        '**Adoption** — how do consumers find out and move across?',
        '**Deprecation** — how does something leave without breaking what uses it?',
      ],
    },
    {
      kind: 'paragraph',
      text: 'Unanswered, each has a default. Contribution becomes a side conversation. Review becomes whoever is loudest. Adoption becomes nobody noticing. Deprecation becomes dead code nobody dares delete.',
    },
  ],
  whyDesignersCare: [
    {
      kind: 'paragraph',
      text: 'Because the usual failure of a design system is not that it was designed badly. It is that it stopped being used.',
    },
    {
      kind: 'paragraph',
      text: 'The sequence is predictable. Somebody needs a variation. The route to add it is unclear or slow. They build a local version. Six months later the product has three buttons, and the system is one of them.',
    },
    {
      kind: 'paragraph',
      text: 'That is a governance failure, not a design one. Making the system faster to extend than to bypass is the entire job.',
    },
  ],
  howItWorks: [
    {
      kind: 'paragraph',
      text: 'A contribution checklist is the cheapest governance that works, because it makes the criteria public.',
    },
    {
      kind: 'code',
      language: 'markdown',
      code: '## Contributing a component\n\n**Before building**\n- [ ] Does an existing component cover this? Say why it does not.\n- [ ] Has this been needed three times? List them.\n- [ ] Is there an ARIA Authoring Practices pattern? Link it.\n- [ ] Call-site examples written, simplest to most demanding.\n\n**The component**\n- [ ] Variants are unions; no boolean-per-variant.\n- [ ] States are separate props and work across every variant.\n- [ ] Only semantic tokens; no hard-coded values.\n- [ ] Accessible name is structurally required where possible.\n- [ ] Keyboard behaviour follows the pattern.\n- [ ] Focus is visible and managed.\n- [ ] Works from 320px.\n\n**Documentation**\n- [ ] Props table.\n- [ ] Every state shown.\n- [ ] Keyboard contract written.\n- [ ] Figma mapping table.\n- [ ] Examples, including one awkward case.\n\n**Review**\n- [ ] Design review: does it fit the system’s character?\n- [ ] Engineering review: is the API hard to misuse?\n- [ ] Accessibility review: keyboard and screen reader tested.',
    },
    {
      kind: 'paragraph',
      text: 'Every line is something from this course. The checklist is not bureaucracy — it is the standard, written down so it applies to everybody including its author.',
    },
  ],
  firstPrinciples: [
    {
      kind: 'paragraph',
      text: '**Versioning** communicates what a change will do to you.',
    },
    {
      kind: 'list',
      items: [
        'Patch — a fix. Nothing you wrote needs to change.',
        'Minor — an addition. Nothing you wrote needs to change.',
        'Major — a breaking change. Something you wrote must change.',
      ],
    },
    {
      kind: 'paragraph',
      text: 'The useful discipline is that the version number is a promise about upgrade effort. A renamed prop in a minor release breaks that promise once and costs you trust permanently.',
    },
    {
      kind: 'paragraph',
      text: '**Deprecation** is how something leaves gradually.',
    },
    {
      kind: 'code',
      language: 'tsx',
      code: 'type ButtonProps = {\n  tone?: "primary" | "secondary" | "danger";\n\n  /** @deprecated Use `tone` instead. Removed in v3. */\n  variant?: "primary" | "secondary" | "danger";\n};\n\nfunction Button({ tone, variant, ...rest }: ButtonProps) {\n  if (variant !== undefined && process.env.NODE_ENV !== "production") {\n    console.warn("Button: `variant` is deprecated. Use `tone`. Removed in v3.");\n  }\n\n  return <button className={toneClass[tone ?? variant ?? "secondary"]} {...rest} />;\n}',
    },
    {
      kind: 'paragraph',
      text: 'Three things at once. The old prop still works, so nothing breaks. The `@deprecated` tag shows a strikethrough in editors, so the next person sees it without reading a changelog. And the warning names the replacement and the removal version, so the message is actionable rather than merely annoying.',
    },
    {
      kind: 'callout',
      tone: 'insight',
      body: 'Deprecation without a removal date is not deprecation. It is a second supported way of doing something, permanently.',
    },
  ],
  designPerspective: [
    {
      kind: 'paragraph',
      text: 'The design question is what the system refuses, and whether that is written down.',
    },
    {
      kind: 'paragraph',
      text: 'A system that accepts every request becomes a collection. The criteria for saying no — this is one screen’s problem, this duplicates an existing component, this contradicts a foundation — are as much a part of the system as the components, and far more useful when written before they are needed.',
    },
  ],
  engineeringPerspective: [
    {
      kind: 'paragraph',
      text: 'The engineering question is how much of this a machine can do.',
    },
    {
      kind: 'paragraph',
      text: 'A fair amount. Lint rules can forbid hard-coded colours. Tests can assert every component has an accessible name. A type can make a contradictory prop combination impossible. Automated enforcement is better than review because it is applied uniformly and does not depend on anybody being conscientious on a Friday afternoon.',
    },
  ],
  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'Governance is what turns a design system from a deliverable into a practice.',
    },
    {
      kind: 'paragraph',
      text: 'The deliverable is finished and begins decaying. The practice is how it stays true to a product that keeps changing — which means governance is the only part of a design system that is never done.',
    },
  ],
  industryExamples: [
    {
      id: 'example-polaris-public-contribution',
      source: 'Shopify',
      title: 'A system developed in public',
      observation:
        'Polaris is maintained in a public repository with its issues, pull requests and release history visible.',
      takeaway:
        'Reading real pull requests on a mature system shows how a change is argued and reviewed, which no guide conveys.',
    },
    {
      id: 'example-material-versioned-releases',
      source: 'Material Design',
      title: 'Versions as named generations',
      observation:
        'Material Design publishes major versions as distinct generations, with the previous one remaining documented.',
      takeaway:
        'Keeping the old version documented is part of a migration. Removing the documentation strands everyone who has not moved yet.',
    },
  ],
  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Run one change through your own governance, end to end.',
    },
    {
      kind: 'paragraph',
      text: 'A plausible request: the Button needs a `loading` state that keeps its width.',
    },
    {
      kind: 'list',
      ordered: true,
      items: [
        'Contribution: write the request. What problem, how many places, why no existing component.',
        'Check: is this a variant or a state? A state — so a separate prop, applying across all tones.',
        'Design: what does loading look like, and how is the width preserved?',
        'Accessibility: is the button disabled while loading, and is the change announced?',
        'API: `isLoading?: boolean`. Does it interact with `isDisabled`? Decide and document.',
        'Implement, with the width preserved.',
        'Document: add to the props table and the state grid.',
        'Version: this is an addition, so a minor release.',
        'Adopt: note in the changelog where it should now be used instead of a local spinner.',
      ],
    },
    {
      kind: 'paragraph',
      text: 'Nine steps for one boolean. That is the correct amount of ceremony for a change everybody will inherit, and it is why a system needs the route to be clear — an unclear route makes the local spinner the rational choice.',
    },
    {
      kind: 'paragraph',
      text: 'Step five is the one people skip. `isLoading` with `isDisabled` has four combinations and only three are sensible; deciding what loading-and-enabled means is the whole question, and leaving it undecided means every call site decides differently.',
    },
  ],
  commonMistakes: [
    {
      id: 'mistake-10-05-no-contribution-route',
      mistake: 'No documented way to request a change.',
      why: 'People build local versions instead, and the system is bypassed by the people who most wanted to use it.',
      instead: 'Publish the route and the criteria. Make extending the system faster than working around it.',
    },
    {
      id: 'mistake-10-05-deprecation-without-removal',
      mistake: 'Marking something deprecated with no removal version.',
      why: 'It is supported indefinitely, so the system now has two ways to do one thing and both must be maintained.',
      instead: 'Name the version it goes in, and remove it then.',
    },
  ],
  professionalConsideration: [
    {
      kind: 'paragraph',
      text: 'Governance on a one-person project looks like overhead and is mostly a letter to yourself.',
    },
    {
      kind: 'paragraph',
      text: 'The checklist you write now is what stops you, in four months, from adding a variant you will regret — and the Module 6 argument for a README applies exactly: the person who most needs the documentation is you, having forgotten. It is also the artefact that demonstrates you can run a system rather than only build one, which is the difference the job title is pointing at.',
    },
  ],
  practicalExercise: {
    id: 'exercise-governance-and-maintaining-a-system',
    title: 'Write a contribution checklist',
    prompt:
      'Write the governance documentation for your own design system, then test it by running a real change through it.',
    steps: [
      'Write the contribution checklist: before building, the component, documentation, review.',
      'Write the criteria for declining a request. Be specific.',
      'Define your versioning: what counts as patch, minor and major.',
      'Write the deprecation process, including that a removal version is required.',
      'Take a real change you want and run it through every step.',
      'Record where your own process was unclear or too heavy, and fix it.',
      'Identify one check a machine could do instead of a person, and implement it.',
      'Deprecate one thing properly, with a tag, a warning and a removal version.',
    ],
    successCriteria: [
      'The checklist is specific enough to follow without you.',
      'Decline criteria are written.',
      'Versioning rules are defined with examples.',
      'The deprecation process requires a removal version.',
      'One real change has been through the process and the friction recorded.',
      'One check is automated.',
      'One deprecation is implemented properly.',
    ],
    estimatedMinutes: 70,
    hint: 'Run a change you actually want through it. A process tested only on a hypothetical change is a process that has not been tested.',
  },
  reflectionQuestion:
    'Why do most design systems fail at governance rather than at design?',
  reflectionHint:
    'Think about what happens the first time someone needs something the system does not have.',
  resources: [
    {
      id: 'resource-polaris-repository',
      title: 'Shopify Polaris repository',
      url: 'https://github.com/Shopify/polaris',
      type: 'tool',
      author: 'Shopify',
      estimatedMinutes: 45,
      note: 'A mature system developed in public. Read a few merged pull requests and the release notes.',
    },
    {
      id: 'resource-designsystems-com-governance',
      title: 'Design Systems — articles and interviews',
      url: 'https://www.designsystems.com/',
      type: 'article',
      author: 'Figma',
      estimatedMinutes: 45,
      note: 'Practitioners on running systems. The contribution and adoption pieces are the relevant ones here.',
    },
  ],
  competencyTags: ['design-systems', 'design-systems-implementation', 'git', 'architecture', 'product-judgement'],
  completionCriteria: [
    'Can define a contribution and review route.',
    'Can explain versioning as a promise about upgrade effort.',
    'Deprecates with a replacement and a removal version.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Project                                                                     */
/* -------------------------------------------------------------------------- */

const PROJECT: ModuleProject = {
  id: 'project-figma-and-react-mini-design-system',
  slug: 'figma-and-react-mini-design-system',
  moduleId: MODULE_ID,
  title: 'Figma + React Mini Design System',
  brief:
    'Deliver a complete small design system in both tools: tokens, foundations, components, documentation, a Figma-to-code mapping, and one real product screen built entirely from it.',
  learnerGoal:
    'Produce the portfolio piece that shows you can build a system across design and engineering, not just components in one of them.',
  problem:
    'A design system is only demonstrated by something built from it. The product screen is the proof: if it needed a value outside the tokens or a component outside the library, the system is incomplete and the screen will show exactly where.',
  prerequisiteLessonIds: [
    'lesson-design-tokens',
    'lesson-system-foundations',
    'lesson-components-across-figma-and-code',
    'lesson-patterns-and-product-workflows',
    'lesson-governance-and-maintaining-a-system',
  ],
  objectives: [
    'Build a layered token set that supports two themes.',
    'Document foundations as a usable reference.',
    'Keep naming parity between Figma and code.',
    'Prove the system by building a real screen from it alone.',
  ],
  requirements: [
    'Tokens in three layers, with a light and a dark theme.',
    'A foundations page covering all six foundations with intended use.',
    'The Module 8 components rebuilt on tokens, with accessibility from Module 9 intact.',
    'A Figma library with naming parity, and a mapping table per component.',
    'At least two documented patterns, including the destructive action.',
    'A contribution checklist and versioning rules.',
    'One realistic product screen built entirely from the system.',
  ],
  constraints: [
    'No hard-coded visual values in the product screen. Tokens only.',
    'No component in the screen that is not in the library.',
    'No Figma property without a code equivalent, or a written reason.',
    'No component shipped without its states documented.',
  ],
  suggestedScope:
    'A small but complete system, roughly forty to fifty hours. Finished when the product screen is built and you can state honestly that nothing in it came from outside the system.',
  deliverables: [
    'The token set, both themes.',
    'The foundations page.',
    'The component library with documentation and mapping tables.',
    'Two documented patterns.',
    'The governance documentation.',
    'The product screen, with a note on anything the system was missing.',
  ],
  completionCriteria: [
    'Tokens are layered and the dark theme changes only the semantic layer.',
    'All six foundations are documented with intended use.',
    'Every component has a props table, a state grid, a keyboard contract and a mapping table.',
    'Naming parity holds, with every difference justified.',
    'Two patterns are documented in full, including edge cases.',
    'The product screen uses only system tokens and components.',
    'The screen is accessible by keyboard and screen reader.',
  ],
  portfolioEvidence: [
    'Systems thinking — a layered, themeable token architecture.',
    'Cross-tool fluency — parity maintained and documented in both directions.',
    'Pattern judgement — behaviour documented, not only appearance.',
    'Proof of work — a real screen built from the system with its gaps declared.',
  ],
  reflectionQuestion:
    'What did the product screen need that your system did not have, and what does that tell you about how the system was designed?',
  estimatedHours: 45,
  competencies: [
    'design-systems',
    'design-systems-implementation',
    'design-to-code-translation',
    'component-api-design',
    'component-architecture',
    'typography',
    'colour',
    'accessibility',
    'css',
    'react',
    'product-judgement',
  ],
  stretchGoals: [
    'Generate the foundations page from the token source so it cannot drift.',
    'Add a lint rule rejecting hard-coded colours outside the token file.',
    'Build the same product screen twice — once from the system, once without — and compare the time and the result.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Module                                                                      */
/* -------------------------------------------------------------------------- */

export const MODULE_10: CurriculumModule = {
  id: MODULE_ID,
  slug: 'design-systems',
  moduleNumber: 10,
  phase: 'systems',
  title: 'Design Systems',
  description:
    'The visual work of Module 2 expressed as tokens, the components of Module 8 given one vocabulary, and the accessibility of Module 9 built in — plus the patterns and governance that decide whether any of it survives contact with a growing product.',
  outcome:
    'Can build and maintain a small design system across Figma and code, and prove it by building a product screen from nothing else.',
  prerequisites: [
    'Module 2 — visual systems, scales and the meaning of colour',
    'Module 8 — component architecture and API design',
    'Module 9 — accessibility built into components',
  ],
  lessons: [LESSON_1, LESSON_2, LESSON_3, LESSON_4, LESSON_5],
  resources: [
    {
      id: 'resource-module-10-polaris',
      title: 'Shopify Polaris',
      url: 'https://polaris.shopify.com/',
      type: 'documentation',
      author: 'Shopify',
      estimatedMinutes: 120,
      note: 'The most complete public system for study: tokens, foundations, components, patterns and contribution all in one place.',
    },
    {
      id: 'resource-module-10-geist',
      title: 'Geist Design System',
      url: 'https://vercel.com/geist/introduction',
      type: 'documentation',
      author: 'Vercel',
      estimatedMinutes: 60,
      note: 'A restrained system with excellent documentation. Useful as a counterpoint to Polaris’s breadth.',
    },
    {
      id: 'resource-module-10-material',
      title: 'Material Design 3',
      url: 'https://m3.material.io/',
      type: 'documentation',
      author: 'Material Design',
      estimatedMinutes: 90,
      note: 'The clearest published explanation of layered tokens and typography roles.',
    },
    {
      id: 'resource-module-10-figma-best-practices',
      title: 'Figma Best Practices',
      url: 'https://www.figma.com/best-practices/',
      type: 'article',
      author: 'Figma',
      estimatedMinutes: 60,
      note: 'Structuring components and libraries. Read the components and shared libraries guides.',
    },
    {
      id: 'resource-module-10-figma-talks',
      title: 'Figma on YouTube',
      url: 'https://www.youtube.com/@Figma',
      type: 'video',
      author: 'Figma',
      estimatedMinutes: 60,
      note: 'Search for design systems talks from Config. Several cover governance and adoption, which are rarely written about well.',
    },
  ],
  project: PROJECT,
  competencies: [
    'design-systems',
    'design-systems-implementation',
    'design-to-code-translation',
    'component-api-design',
    'component-architecture',
    'typography',
    'colour',
    'visual-hierarchy',
    'css',
    'react',
    'accessibility',
    'product-thinking',
    'ux-reasoning',
    'product-judgement',
    'interface-state-modelling',
    'git',
    'architecture',
  ],
  completionCriteria: [
    'All five lessons completed.',
    'Module project marked completed.',
    'Can build and govern a small system across both tools.',
  ],
};
