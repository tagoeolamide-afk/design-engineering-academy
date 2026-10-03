/**
 * Module 08 — Component Architecture.
 *
 * Module 7 taught the mechanics of components. This module is about the
 * decisions: where a boundary belongs, what a component should accept, how
 * variants stay finite, when composition beats configuration, and who owns a
 * piece of state. Every one of these is a design decision expressed in code.
 */

import type { CurriculumModule, Lesson, ModuleProject } from '@/types/curriculum';

const MODULE_ID = 'module-08';

/* -------------------------------------------------------------------------- */
/* Lesson 36                                                                   */
/* -------------------------------------------------------------------------- */

const LESSON_1: Lesson = {
  id: 'lesson-choosing-component-boundaries',
  slug: 'choosing-component-boundaries',
  moduleId: MODULE_ID,
  lessonNumber: 1,
  title: 'Choosing Component Boundaries',
  summary:
    'Where one component ends and the next begins. Module 1 asked this with sticky notes; now the answer has consequences you have to live with.',
  estimatedMinutes: 10,
  objectives: [
    'Break a large screen into components with defensible boundaries.',
    'Use responsibility and change frequency rather than appearance to decide.',
    'Recognise a component doing two jobs.',
    'Explain why a repeated visual pattern is not automatically a component.',
  ],
  prerequisiteConcepts: [
    'Breaking an interface into parts, Module 1 lesson 5',
    'Components and props, Module 7',
    'State in React, Module 7',
  ],
  prerequisiteLessonIds: [
    'lesson-breaking-an-interface-into-parts',
    'lesson-state-in-react',
  ],
  recap: [
    {
      kind: 'paragraph',
      text: 'You can build a React interface. Module 7’s project probably produced a few components that grew uncomfortably large, and one or two you were not sure should exist.',
    },
  ],
  priorKnowledge: [
    {
      kind: 'paragraph',
      text: 'Module 1 lesson 5 had you draw boxes on a screenshot and conclude that behaviour is a better boundary than appearance — two things that look alike but behave differently are not the same part.',
    },
    {
      kind: 'paragraph',
      text: 'That conclusion is now testable. A wrong boundary in Figma is a tidying job. A wrong boundary in code is a component everybody has to work around.',
    },
  ],
  coreConcept: [
    {
      kind: 'paragraph',
      text: 'A good boundary is one where a component has a **single responsibility** and the things inside it **change together**.',
    },
    {
      kind: 'paragraph',
      text: 'Three questions, applied to every candidate:',
    },
    {
      kind: 'list',
      ordered: true,
      items: [
        'Can you name what it is responsible for in one sentence, without "and"?',
        'Do the things inside it change for the same reasons?',
        'Could it be understood by someone who has not read its parent?',
      ],
    },
    {
      kind: 'paragraph',
      text: 'A `ProjectCard` responsible for displaying one project passes all three. A `ProjectCardWithFiltersAndModal` fails the first on the name alone.',
    },
  ],
  whyDesignersCare: [
    {
      kind: 'paragraph',
      text: 'Because boundaries decide what is easy to change later, and what is easy to change later decides what design work is cheap.',
    },
    {
      kind: 'paragraph',
      text: 'If every card in the product is one component, restyling all cards is one change. If the list, the detail panel and the search results each have their own near-identical card, it is three — and the three will drift, which is how a product ends up with four slightly different cards nobody chose.',
    },
  ],
  howItWorks: [
    {
      kind: 'paragraph',
      text: '**Change frequency** is the most useful signal and the least obvious one.',
    },
    {
      kind: 'paragraph',
      text: 'Parts that change on different schedules belong apart. A card’s visual shell is stable; the actions inside it change whenever the product gains a feature. Keeping them together means every feature change touches the shell, and every shell change risks the actions.',
    },
    {
      kind: 'code',
      language: 'tsx',
      code: '// One component, two rates of change.\nfunction ProjectCard({ project }: { project: Project }) {\n  return (\n    <article className="card">\n      <h3>{project.name}</h3>\n      <p>{project.description}</p>\n\n      <button onClick={() => archive(project.id)}>Archive</button>\n      <button onClick={() => duplicate(project.id)}>Duplicate</button>\n      <button onClick={() => share(project.id)}>Share</button>\n    </article>\n  );\n}',
    },
    {
      kind: 'code',
      language: 'tsx',
      code: '// Split: the shell is stable, the actions are passed in.\nfunction Card({ title, description, children }: CardProps) {\n  return (\n    <article className="card">\n      <h3>{title}</h3>\n      <p>{description}</p>\n      <div className="card-actions">{children}</div>\n    </article>\n  );\n}',
    },
    {
      kind: 'paragraph',
      text: 'The second `Card` knows nothing about projects. The same shell now serves projects, documents and invoices, and adding a fourth action touches only the caller.',
    },
  ],
  firstPrinciples: [
    {
      kind: 'paragraph',
      text: 'The underlying idea is **cohesion**: how much the parts of a thing belong together.',
    },
    {
      kind: 'paragraph',
      text: 'High cohesion means everything inside serves one purpose. Low cohesion means the component is a container of unrelated things that happen to be near each other on screen — which is proximity, not structure.',
    },
    {
      kind: 'callout',
      tone: 'insight',
      body: 'A component that is hard to name is almost always badly bounded. The naming difficulty is the symptom; the mixed responsibility is the cause.',
    },
  ],
  designPerspective: [
    {
      kind: 'paragraph',
      text: 'The design question is which parts of the product are genuinely the same thing.',
    },
    {
      kind: 'paragraph',
      text: 'Two buttons that look identical but mean different things — a primary action and a confirmation in a destructive flow — may deserve separate components, because their futures diverge. Two that look different today but mean the same thing probably deserve one, because the difference is likely an inconsistency rather than a decision.',
    },
  ],
  engineeringPerspective: [
    {
      kind: 'paragraph',
      text: 'The engineering question is what a change costs.',
    },
    {
      kind: 'paragraph',
      text: 'The honest test is a specific one: name a change you expect within six months, and count the files it touches. Boundaries that make the expected change a one-file edit are good; boundaries that scatter it are not, however tidy the diagram looks.',
    },
  ],
  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'Component boundaries are where the design system becomes real or stays aspirational.',
    },
    {
      kind: 'paragraph',
      text: 'A Figma library with one Card and a codebase with four is a system in name only. Boundaries that match between the two are what make "use the Card component" a meaningful instruction rather than a suggestion.',
    },
  ],
  industryExamples: [
    {
      id: 'example-polaris-card-boundary',
      source: 'Shopify',
      title: 'A shell that holds anything',
      observation:
        'Polaris’s Card provides structure and takes its content as children rather than configuring it with props.',
      takeaway:
        'The component owns the shell. What goes inside is the caller’s business, which is why one Card serves the whole product.',
    },
    {
      id: 'example-radix-behaviour-boundary',
      source: 'Radix',
      title: 'Behaviour separated from appearance',
      observation:
        'Radix primitives provide keyboard handling, focus management and accessibility semantics, and leave visual styling entirely to the consumer.',
      takeaway:
        'Behaviour and appearance change at different rates, so they are drawn as different boundaries.',
    },
  ],
  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Break down a settings screen, deciding by responsibility rather than by box.',
    },
    {
      kind: 'paragraph',
      text: 'The screen has a header, a sidebar of sections, a form, a danger zone with a destructive action, and a save bar that appears when there are unsaved changes.',
    },
    {
      kind: 'list',
      items: [
        '`SettingsLayout` — arranges the regions. Changes when the layout changes, which is rarely.',
        '`SettingsNav` — the section list and which is current. Changes when sections are added.',
        '`ProfileForm` — the fields and their validation. Changes whenever the product’s profile fields change, which is often.',
        '`DangerZone` — destructive actions and their confirmation. Changes rarely but carries the most risk.',
        '`SaveBar` — appears when dirty, reports saving. Changes with the save behaviour.',
      ],
    },
    {
      kind: 'paragraph',
      text: 'Five components, five different rates of change, five one-sentence responsibilities. Note what is *not* a component: the heading and the description under it. They are two elements inside `SettingsLayout` that have never varied independently, and a `SettingsHeading` would be a boundary with nothing behind it.',
    },
  ],
  commonMistakes: [
    {
      id: 'mistake-08-01-visual-boundaries',
      mistake: 'Splitting components wherever the design has a visible box.',
      why: 'Visual grouping and behavioural grouping often disagree, and a component built around a border has no responsibility to name.',
      instead: 'Split where responsibility changes. Sometimes that is the box; often it is not.',
    },
    {
      id: 'mistake-08-01-premature-extraction',
      mistake: 'Extracting a component the second time something looks similar.',
      why: 'Two similar things are not evidence of a shared concept. The extraction then has to be configured for both, and the props accumulate.',
      instead:
        'Wait for the third use, or for a reason beyond resemblance. Duplication is cheaper to fix than a wrong abstraction.',
    },
  ],
  professionalConsideration: [
    {
      kind: 'paragraph',
      text: 'The most expensive mistake in this lesson is the wrong abstraction, not the missing one.',
    },
    {
      kind: 'paragraph',
      text: 'Duplicated code is visible and mechanical to fix. A component that unified two things which were never the same is invisible — it looks like reuse — and unpicking it means touching every caller. This is why experienced engineers tolerate duplication longer than you would expect: they are waiting for evidence about what the shared concept actually is.',
    },
  ],
  practicalExercise: {
    id: 'exercise-choosing-component-boundaries',
    title: 'Break a large screen into components',
    prompt:
      'Take a complex screen — your Module 7 project, or a product you use — and decompose it into components, justifying each boundary.',
    steps: [
      'Choose a screen with at least four distinct regions.',
      'List every candidate component.',
      'Name each one’s responsibility in one sentence containing no "and".',
      'For each, note how often you expect it to change and why.',
      'Merge any two whose responsibilities turned out to be the same.',
      'Split any whose sentence needed an "and".',
      'Name one thing you deliberately did not make a component, and say why.',
      'Name one change you expect within six months and count the components it touches.',
    ],
    successCriteria: [
      'Every component has a one-sentence, "and"-free responsibility.',
      'Change frequency is recorded for each.',
      'At least one merge or split is made and explained.',
      'One deliberate non-component is justified.',
      'The expected change is traced through the structure.',
    ],
    estimatedMinutes: 60,
    hint: 'If the responsibility sentence needs "and", you have found two components. This is the fastest test in the lesson and it rarely misfires.',
  },
  reflectionQuestion:
    'Should every repeated visual pattern become a component?',
  reflectionHint:
    'Reuse is not the only reason for a boundary — and resemblance is not the same as being the same thing.',
  resources: [
    {
      id: 'resource-react-thinking-in-react-boundaries',
      title: 'Thinking in React',
      url: 'https://react.dev/learn/thinking-in-react',
      type: 'documentation',
      author: 'React',
      estimatedMinutes: 30,
      note: 'Step one is breaking the design into a component hierarchy. Short and directly on topic.',
    },
    {
      id: 'resource-polaris-card',
      title: 'Card — Polaris',
      url: 'https://polaris.shopify.com/components/layout-and-structure/card',
      type: 'documentation',
      author: 'Shopify',
      estimatedMinutes: 15,
      note: 'A well-bounded shell component. Read what it does and, more usefully, what it refuses to do.',
    },
  ],
  competencyTags: ['component-architecture', 'architecture', 'react', 'design-systems'],
  completionCriteria: [
    'Can decompose a screen using responsibility rather than appearance.',
    'Uses change frequency as a boundary signal.',
    'Can explain why resemblance alone is not a reason to extract.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Lesson 37                                                                   */
/* -------------------------------------------------------------------------- */

const LESSON_2: Lesson = {
  id: 'lesson-designing-component-apis',
  slug: 'designing-component-apis',
  moduleId: MODULE_ID,
  lessonNumber: 2,
  title: 'Designing Component APIs',
  summary:
    'Props are a public interface, and designing one before writing the implementation is the most reliable way to get it right.',
  estimatedMinutes: 10,
  objectives: [
    'Design a component API before implementing it.',
    'Name props so their meaning is unambiguous.',
    'Choose defaults that make the common case easy and the unusual case possible.',
    'Explain controlled and uncontrolled, and when each belongs.',
  ],
  prerequisiteConcepts: [
    'Props and types, Module 7 lesson 32',
    'Component boundaries',
    'Controlled inputs, Module 7 lesson 34',
  ],
  prerequisiteLessonIds: ['lesson-choosing-component-boundaries'],
  recap: [
    {
      kind: 'paragraph',
      text: 'You can decide where a component should begin and end. This lesson is about what it should accept once you have.',
    },
  ],
  priorKnowledge: [
    {
      kind: 'paragraph',
      text: 'Module 7 showed props as typed inputs and an input as controlled when its value comes from state. Both ideas are now the raw material for a decision rather than a mechanism to learn.',
    },
  ],
  coreConcept: [
    {
      kind: 'paragraph',
      text: 'A component’s props are its **API** — the only thing other code is allowed to rely on.',
    },
    {
      kind: 'paragraph',
      text: 'The most effective habit in this module is to write the usage first, before any implementation:',
    },
    {
      kind: 'code',
      language: 'tsx',
      code: '// Write this before building anything.\n<Select\n  label="Project status"\n  value={status}\n  onChange={setStatus}\n  options={statusOptions}\n  placeholder="Choose a status"\n/>',
    },
    {
      kind: 'paragraph',
      text: 'Reading that call tells you whether the API is good — before you have invested in making it work. If it reads awkwardly, the component is wrong, and changing it now costs nothing.',
    },
  ],
  whyDesignersCare: [
    {
      kind: 'paragraph',
      text: 'Because a component’s API decides whether the design system gets used correctly.',
    },
    {
      kind: 'paragraph',
      text: 'If using a component properly requires reading its source, people will guess, and guesses become inconsistency. An API that makes the correct use the obvious one does more for consistency than any amount of documentation.',
    },
  ],
  howItWorks: [
    {
      kind: 'paragraph',
      text: 'Four decisions make up an API. **Naming** first.',
    },
    {
      kind: 'list',
      items: [
        'Say what, not how: `tone` rather than `isRed`.',
        'Booleans read as a state: `isDisabled`, `hasError`, not `disabled_flag`.',
        'Handlers are `onSomething`: `onChange`, `onSelect`, `onDismiss`.',
        'Match the platform where one exists. If HTML calls it `disabled`, so should you.',
      ],
    },
    {
      kind: 'paragraph',
      text: 'Then **defaults**. A default should be the overwhelmingly common case, so the simple call is short:',
    },
    {
      kind: 'code',
      language: 'tsx',
      code: 'type ButtonProps = {\n  children: React.ReactNode;\n  tone?: "primary" | "secondary" | "danger";   // default "secondary"\n  size?: "small" | "medium";                   // default "medium"\n  isDisabled?: boolean;                        // default false\n  onClick?: () => void;\n};',
    },
    {
      kind: 'paragraph',
      text: '`<Button>Save</Button>` works. Every variation is still reachable. The defaults mean the common case carries no ceremony.',
    },
    {
      kind: 'paragraph',
      text: 'Then **predictability**: the same props produce the same behaviour, every time, with nothing hidden. A Button that sometimes submits a form because of where it sits is a component you cannot reason about from its call site.',
    },
  ],
  firstPrinciples: [
    {
      kind: 'paragraph',
      text: 'The fourth decision is **controlled or uncontrolled** — who owns the value.',
    },
    {
      kind: 'code',
      language: 'tsx',
      code: '// Controlled: the parent owns the value.\n<Select value={status} onChange={setStatus} />\n\n// Uncontrolled: the component owns it; the parent is told.\n<Select defaultValue="active" onChange={handleChange} />',
    },
    {
      kind: 'paragraph',
      text: 'Controlled is the right default for a product component. The parent can reset it, validate it, derive from it, or keep it in the URL — all of which the Module 5 state discipline will eventually want.',
    },
    {
      kind: 'paragraph',
      text: 'Uncontrolled is convenient when nothing outside cares until submission. The cost is that the value is hidden inside the component, so the moment something outside does care, the API has to change.',
    },
    {
      kind: 'callout',
      tone: 'insight',
      body: 'A component that accepts `value` and also keeps its own copy will eventually show one while reporting the other. Pick one owner.',
    },
  ],
  designPerspective: [
    {
      kind: 'paragraph',
      text: 'The design question is which variations the component should permit at all.',
    },
    {
      kind: 'paragraph',
      text: 'Every prop is a supported variation, and supported variations accumulate into the product’s visual range. An API is a statement about how much variety the design system allows — and that is a design decision being made in a type definition.',
    },
  ],
  engineeringPerspective: [
    {
      kind: 'paragraph',
      text: 'The engineering question is what the type makes impossible.',
    },
    {
      kind: 'paragraph',
      text: 'A Select with both `value` and `defaultValue` optional allows a caller to pass both, which is a contradiction. The Module 6 technique applies: a union of two prop shapes makes the contradiction unwriteable, and the compiler enforces the decision instead of a code reviewer.',
    },
  ],
  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'Writing the usage first is the code equivalent of designing the screen before building it.',
    },
    {
      kind: 'paragraph',
      text: 'You would not build a settings page without a design; the call-site-first habit is the same move applied to a component. It is also the cheapest possible moment to discover the API is wrong.',
    },
  ],
  industryExamples: [
    {
      id: 'example-radix-controlled-api',
      source: 'Radix',
      title: 'Both modes, deliberately separated',
      observation:
        'Radix components accept `value` with `onValueChange` for controlled use, or `defaultValue` for uncontrolled.',
      takeaway:
        'Supporting both is possible, but it is a documented pair of modes rather than an accident. The naming makes which mode you are in obvious.',
    },
    {
      id: 'example-polaris-prop-naming',
      source: 'Shopify',
      title: 'Naming conventions applied across a library',
      observation:
        'Polaris uses consistent prop names across components, so a prop learned on one component transfers to the next.',
      takeaway:
        'Consistency in naming is itself a feature. It is what lets a library be learned once rather than per component.',
    },
  ],
  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Design a Select API, usage first.',
    },
    {
      kind: 'code',
      language: 'tsx',
      code: '// 1. The simplest case that must work.\n<Select label="Status" value={status} onChange={setStatus} options={options} />\n\n// 2. The cases that must be reachable.\n<Select label="Status" value={status} onChange={setStatus} options={options} isDisabled />\n<Select label="Status" value={status} onChange={setStatus} options={options} error="Pick one" />\n<Select label="Status" value={status} onChange={setStatus} options={options} placeholder="Any" />',
    },
    {
      kind: 'code',
      language: 'tsx',
      code: '// 3. Only now, the type.\ntype SelectOption = { value: string; label: string; isDisabled?: boolean };\n\ntype SelectProps = {\n  label: string;\n  value: string;\n  onChange: (value: string) => void;\n  options: readonly SelectOption[];\n  placeholder?: string;\n  error?: string;\n  isDisabled?: boolean;\n};',
    },
    {
      kind: 'paragraph',
      text: 'Note what the API forces. `label` is required, so an unlabelled select cannot be built — an accessibility decision made structurally, which Module 9 returns to.',
    },
    {
      kind: 'paragraph',
      text: '`onChange` gives the value rather than the event, because every caller wants the value and would otherwise write `e.target.value` each time.',
    },
    {
      kind: 'paragraph',
      text: 'And `error` is a string rather than a boolean, because an error state always needs a message. A boolean would permit the state without the explanation.',
    },
  ],
  commonMistakes: [
    {
      id: 'mistake-08-02-implementation-first',
      mistake: 'Building the component and letting the props emerge from it.',
      why: 'The API ends up shaped by the implementation, so it exposes internals and reads badly at the call site.',
      instead: 'Write the call site first. It takes two minutes and it is the cheapest possible redesign.',
    },
    {
      id: 'mistake-08-02-boolean-for-stateful-detail',
      mistake: 'Using `hasError: boolean` instead of `error?: string`.',
      why: 'An error state with no message is a state you cannot usefully render, and callers will pass the message separately and forget to keep them in step.',
      instead: 'Let the presence of the message be the state. One prop, no contradiction possible.',
    },
  ],
  professionalConsideration: [
    {
      kind: 'paragraph',
      text: 'A component API is harder to change than the component behind it.',
    },
    {
      kind: 'paragraph',
      text: 'The implementation can be rewritten whenever you like; nobody outside depends on it. The props are depended on by every call site, so a rename is a coordinated change across the codebase. That asymmetry is why the API deserves more thought than the implementation, which is the opposite of where the time usually goes.',
    },
  ],
  practicalExercise: {
    id: 'exercise-designing-component-apis',
    title: 'Design a Select API before implementation',
    prompt:
      'Design the complete API for a Select component without writing any implementation, then build it and record where the design was wrong.',
    steps: [
      'Write five call-site examples, from the simplest to the most demanding.',
      'From those, write the props type. Use unions for anything constrained.',
      'Decide controlled or uncontrolled and justify it in a sentence.',
      'Choose a default for every optional prop and say why it is the common case.',
      'Identify one contradiction the type should make impossible, and make it impossible.',
      'Now implement it.',
      'Record every place the implementation made you want to change the API, and whether you did.',
    ],
    successCriteria: [
      'Five call-site examples written before any implementation.',
      'Props typed with unions where values are constrained.',
      'Controlled-or-uncontrolled decision stated and justified.',
      'Every optional prop has a justified default.',
      'One contradiction is structurally prevented.',
      'API changes forced by implementation are recorded.',
    ],
    estimatedMinutes: 70,
    hint: 'Keep the usage examples somewhere you can see them while implementing. They are the specification, and a change to them should feel like a decision.',
  },
  reflectionQuestion:
    'When does a component have too many props?',
  reflectionHint:
    'A confused API often signals more than one responsibility. Try naming what the component does, using only its props.',
  resources: [
    {
      id: 'resource-radix-select',
      title: 'Select — Radix Primitives',
      url: 'https://www.radix-ui.com/primitives/docs/components/select',
      type: 'documentation',
      author: 'Radix',
      estimatedMinutes: 25,
      note: 'Read the API reference specifically. A well-considered Select API, including both modes.',
    },
    {
      id: 'resource-polaris-select',
      title: 'Select — Polaris',
      url: 'https://polaris.shopify.com/components/selection-and-input/select',
      type: 'documentation',
      author: 'Shopify',
      estimatedMinutes: 15,
      note: 'The same component designed with different priorities. Comparing the two prop tables is the exercise.',
    },
  ],
  competencyTags: ['component-api-design', 'component-architecture', 'typescript', 'design-systems'],
  completionCriteria: [
    'Designs the call site before the implementation.',
    'Names props so their meaning is unambiguous.',
    'Can explain controlled versus uncontrolled and choose deliberately.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Lesson 38                                                                   */
/* -------------------------------------------------------------------------- */

const LESSON_3: Lesson = {
  id: 'lesson-variants-without-complexity',
  slug: 'variants-without-complexity',
  moduleId: MODULE_ID,
  lessonNumber: 3,
  title: 'Variants Without Complexity',
  summary:
    'Size, tone, intent and state — and how a handful of booleans quietly becomes thirty-two combinations nobody designed.',
  estimatedMinutes: 10,
  objectives: [
    'Model variants as named dimensions rather than booleans.',
    'Explain boolean explosion and calculate it for a real component.',
    'Separate variant from state.',
    'Keep a variant set finite and intentional.',
  ],
  prerequisiteConcepts: [
    'Component APIs',
    'Unions, Module 6 lesson 27',
    'Visual hierarchy and colour meaning, Module 2',
  ],
  prerequisiteLessonIds: ['lesson-designing-component-apis'],
  recap: [
    {
      kind: 'paragraph',
      text: 'You can design an API. The fastest way to ruin a good one is to add variants carelessly, which is this lesson.',
    },
  ],
  priorKnowledge: [
    {
      kind: 'paragraph',
      text: 'Module 2 lesson 9 argued that colour should carry meaning — that danger red means danger, consistently. A variant system is how that argument survives contact with a codebase.',
    },
  ],
  coreConcept: [
    {
      kind: 'paragraph',
      text: 'A variant is a **named dimension with a fixed set of values**. Most components need three or four at most.',
    },
    {
      kind: 'list',
      items: [
        '`size` — small, medium, large. How much space it occupies.',
        '`tone` or `intent` — primary, secondary, danger. What it means.',
        '`shape` or `fill` — solid, outline, ghost. How prominent it is.',
      ],
    },
    {
      kind: 'code',
      language: 'tsx',
      code: 'type ButtonProps = {\n  children: React.ReactNode;\n  size?: "small" | "medium" | "large";\n  tone?: "primary" | "secondary" | "danger";\n  fill?: "solid" | "outline" | "ghost";\n};',
    },
    {
      kind: 'paragraph',
      text: 'Three dimensions, each a union. Every combination is nameable, and the editor offers exactly the allowed values.',
    },
  ],
  whyDesignersCare: [
    {
      kind: 'paragraph',
      text: 'Because variants are the design system’s vocabulary, and an uncontrolled vocabulary stops being a system.',
    },
    {
      kind: 'paragraph',
      text: 'Three tones means three button meanings in the product, and a designer can hold three in their head. Eleven means nobody knows which to use, so they pick by appearance — and the meaning that colour was carrying is gone.',
    },
  ],
  howItWorks: [
    {
      kind: 'paragraph',
      text: '**Boolean explosion** is the failure this lesson exists to prevent.',
    },
    {
      kind: 'code',
      language: 'tsx',
      code: '// Five booleans. Looks harmless.\ntype ButtonProps = {\n  isPrimary?: boolean;\n  isSecondary?: boolean;\n  isDanger?: boolean;\n  isSmall?: boolean;\n  isLarge?: boolean;\n};',
    },
    {
      kind: 'paragraph',
      text: 'Five booleans is two to the power of five: thirty-two combinations. Somebody designed three or four of them.',
    },
    {
      kind: 'paragraph',
      text: 'And most are nonsense. `isPrimary` with `isDanger`. `isSmall` with `isLarge`. The type permits every one, so the component needs code to resolve conflicts, and that code encodes a priority nobody agreed.',
    },
    {
      kind: 'code',
      language: 'tsx',
      code: '// Two unions. Nine combinations, all of them meaningful.\ntype ButtonProps = {\n  tone?: "primary" | "secondary" | "danger";\n  size?: "small" | "medium" | "large";\n};',
    },
    {
      kind: 'paragraph',
      text: 'Nine instead of thirty-two, and nine that a designer can actually review. The contradictions are not resolved — they are unwriteable, which is the Module 6 argument again.',
    },
  ],
  firstPrinciples: [
    {
      kind: 'paragraph',
      text: 'The other half of this lesson: **variant is not state**.',
    },
    {
      kind: 'paragraph',
      text: 'A variant is chosen by whoever uses the component and does not change on its own. A state is what is currently true and changes as the interface runs.',
    },
    {
      kind: 'list',
      items: [
        'Variant: size, tone, fill. Set at the call site; fixed for that instance.',
        'State: hovered, focused, pressed, disabled, loading. Changes during use.',
      ],
    },
    {
      kind: 'paragraph',
      text: 'Hover and focus are handled in CSS, not props — the browser already knows. Disabled and loading come in as props because something outside decides them, but they are still states rather than variants, and they apply across every variant.',
    },
    {
      kind: 'callout',
      tone: 'pitfall',
      body: 'A `tone: "disabled"` value mixes the two axes: the button then has no tone while disabled, so re-enabling it needs the original remembered from somewhere. Disabled is a state that every tone must support.',
    },
  ],
  designPerspective: [
    {
      kind: 'paragraph',
      text: 'The design question is how many variants the product genuinely needs.',
    },
    {
      kind: 'paragraph',
      text: 'The useful discipline is to make the full matrix and look at it. Three tones times three sizes times three fills is twenty-seven buttons on one page, and seeing them together is how you discover that `ghost` and `outline` at small size are indistinguishable, which means one of them should not exist.',
    },
  ],
  engineeringPerspective: [
    {
      kind: 'paragraph',
      text: 'The engineering question is how variants reach the styling.',
    },
    {
      kind: 'code',
      language: 'tsx',
      code: 'const toneClass = {\n  primary: "btn-primary",\n  secondary: "btn-secondary",\n  danger: "btn-danger",\n} as const;\n\nfunction Button({ tone = "secondary", size = "medium", ...rest }: ButtonProps) {\n  return <button className={`btn ${toneClass[tone]} btn-${size}`} {...rest} />;\n}',
    },
    {
      kind: 'paragraph',
      text: 'A lookup object keyed by the union. Because the keys and the union match, adding a tone without adding its class is a compile error — the mapping cannot silently fall behind.',
    },
  ],
  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'A variant union and a Figma variant property should hold the same values, spelled the same way.',
    },
    {
      kind: 'paragraph',
      text: 'When they do, "primary, medium, solid" names one button in both tools and handoff needs no translation. When they drift — `tone` in code, `Type` in Figma, with different values — the system has two vocabularies and every conversation needs a glossary. Module 10 lesson 48 treats this parity as a deliverable.',
    },
  ],
  industryExamples: [
    {
      id: 'example-geist-button-variants',
      source: 'Vercel',
      title: 'A small, deliberate variant set',
      observation:
        'Vercel’s Geist Button exposes a short list of types and sizes rather than arbitrary styling.',
      takeaway:
        'The restraint is the design decision. A short list is reviewable; an open-ended one is not.',
    },
    {
      id: 'example-material-button-types',
      source: 'Material Design',
      title: 'Variants tied to emphasis',
      observation:
        'Material Design names its button types by emphasis — filled, outlined, text — and documents which to use when.',
      takeaway:
        'Naming variants after meaning rather than appearance makes the choice at a call site an obvious one.',
    },
  ],
  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Design the Button variant set, then prove it.',
    },
    {
      kind: 'code',
      language: 'tsx',
      code: 'type ButtonProps = {\n  children: React.ReactNode;\n\n  /* Variants: chosen at the call site. */\n  tone?: "primary" | "secondary" | "danger";\n  size?: "small" | "medium";\n\n  /* States: decided by the application, not by appearance. */\n  isDisabled?: boolean;\n  isLoading?: boolean;\n\n  onClick?: () => void;\n};',
    },
    {
      kind: 'paragraph',
      text: 'Two variant dimensions and two states, with a comment making the distinction explicit in the file where people will read it.',
    },
    {
      kind: 'paragraph',
      text: 'Six variant combinations. Each must then work in four conditions — resting, disabled, loading, and with focus visible — which is twenty-four renderings. That grid is what you review, and reviewing it is how the one that was never designed gets found.',
    },
    {
      kind: 'paragraph',
      text: 'One subtlety worth catching now: a loading button should stay the width it was. Replacing the label with a spinner shrinks it, the layout jumps, and a pointer that was over the button is suddenly not. Module 11 handles this class of problem properly.',
    },
  ],
  commonMistakes: [
    {
      id: 'mistake-08-03-boolean-explosion',
      mistake: 'One boolean per variant.',
      why: 'The combinations multiply, most are contradictory, and the component needs conflict-resolution code encoding a priority nobody agreed.',
      instead: 'One union per dimension. Contradictions become unwriteable instead of resolved.',
    },
    {
      id: 'mistake-08-03-variant-as-state',
      mistake: 'Adding `disabled` or `loading` as a value of the tone union.',
      why: 'A disabled button then has no tone, so re-enabling it needs the original remembered elsewhere.',
      instead: 'Keep states as separate props that apply across every variant.',
    },
  ],
  professionalConsideration: [
    {
      kind: 'paragraph',
      text: 'Variants are much easier to add than to remove.',
    },
    {
      kind: 'paragraph',
      text: 'Adding one takes a line. Removing one means finding every call site, deciding what each should become, and changing them — so in practice variants only ever accumulate. That is why the review that matters is the one before the variant exists, and why "we can always take it out later" is almost never true.',
    },
  ],
  practicalExercise: {
    id: 'exercise-variants-without-complexity',
    title: 'Design Button variants',
    prompt:
      'Design a complete Button variant set, build the full matrix, and review it as a designer would.',
    steps: [
      'Choose your variant dimensions and their values. Justify each dimension.',
      'List your states separately and say why each is a state rather than a variant.',
      'Calculate how many combinations a boolean-per-variant version would have produced.',
      'Implement the Button with union props and a lookup mapping.',
      'Build a page rendering every variant combination in every state.',
      'Review the matrix and find at least one combination that should not exist.',
      'Remove it, and say how you prevented it — a narrower union, or a documented restriction.',
    ],
    successCriteria: [
      'Variants are unions; no boolean-per-variant anywhere.',
      'States are separate and apply across all variants.',
      'The boolean-explosion count is calculated for comparison.',
      'The full matrix is rendered on one page.',
      'At least one unnecessary combination is identified and removed.',
    ],
    estimatedMinutes: 70,
    hint: 'The matrix page is the point of this exercise. Variants that seemed sensible individually look obviously redundant when they are side by side.',
  },
  reflectionQuestion:
    'Why does a union of three values beat three booleans, when both can express the same three things?',
  reflectionHint:
    'Count what each one allows, not what each one expresses.',
  resources: [
    {
      id: 'resource-geist-button',
      title: 'Button — Geist Design System',
      url: 'https://vercel.com/geist/button',
      type: 'documentation',
      author: 'Vercel',
      estimatedMinutes: 15,
      note: 'A restrained variant set with the states shown. Note how short the list is.',
    },
    {
      id: 'resource-material-buttons',
      title: 'Buttons — Material Design 3',
      url: 'https://m3.material.io/components/buttons/overview',
      type: 'documentation',
      author: 'Material Design',
      estimatedMinutes: 20,
      note: 'Variants named by emphasis, with guidance on choosing between them.',
    },
  ],
  competencyTags: ['component-api-design', 'design-systems', 'typescript', 'component-architecture'],
  completionCriteria: [
    'Models variants as unions, not booleans.',
    'Can calculate and explain boolean explosion.',
    'Keeps variant and state on separate axes.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Lesson 39                                                                   */
/* -------------------------------------------------------------------------- */

const LESSON_4: Lesson = {
  id: 'lesson-composition',
  slug: 'composition',
  moduleId: MODULE_ID,
  lessonNumber: 4,
  title: 'Composition',
  summary:
    'When a component has too many props, the answer is usually not better props — it is letting the caller assemble the pieces.',
  estimatedMinutes: 10,
  objectives: [
    'Use children and named slots instead of configuration props.',
    'Build a compound component with a shared internal state.',
    'Decide between configuration and composition.',
    'Explain what flexibility costs.',
  ],
  prerequisiteConcepts: [
    'children, Module 7 lesson 32',
    'Component APIs',
    'Variants',
  ],
  prerequisiteLessonIds: ['lesson-variants-without-complexity'],
  recap: [
    {
      kind: 'paragraph',
      text: 'The last lesson kept variants finite. This one handles the pressure that makes people add variants in the first place: a component asked to support situations nobody anticipated.',
    },
  ],
  priorKnowledge: [
    {
      kind: 'paragraph',
      text: 'Module 7 lesson 32 introduced `children` as a way of passing content rather than configuration. That is the whole mechanism here; this lesson is about using it deliberately.',
    },
  ],
  coreConcept: [
    {
      kind: 'paragraph',
      text: 'There are two ways to let a component vary. **Configuration** takes props and decides. **Composition** takes pieces and arranges them.',
    },
    {
      kind: 'code',
      language: 'tsx',
      code: '// Configuration: every possibility needs a prop.\n<Dialog\n  title="Delete project"\n  body="This cannot be undone."\n  primaryLabel="Delete"\n  secondaryLabel="Cancel"\n  onPrimary={handleDelete}\n  onSecondary={close}\n  hasIcon\n  iconTone="danger"\n/>',
    },
    {
      kind: 'code',
      language: 'tsx',
      code: '// Composition: the caller assembles it.\n<Dialog>\n  <Dialog.Title>Delete project</Dialog.Title>\n  <Dialog.Body>\n    <p>This cannot be undone.</p>\n  </Dialog.Body>\n  <Dialog.Footer>\n    <Button onClick={close}>Cancel</Button>\n    <Button tone="danger" onClick={handleDelete}>Delete</Button>\n  </Dialog.Footer>\n</Dialog>',
    },
    {
      kind: 'paragraph',
      text: 'The second needs no new prop for a form in the body, a third button, or a checkbox beside the cancel. The first needs one for each.',
    },
  ],
  whyDesignersCare: [
    {
      kind: 'paragraph',
      text: 'Because configuration-only components are where "the design system cannot do that" comes from.',
    },
    {
      kind: 'paragraph',
      text: 'A designer asks for a dialog with a form in it. If Dialog only accepts a `body` string, the answer is a new prop or a bespoke dialog — and the bespoke one will not match. Composition means the answer is yes, and the result still looks like the system.',
    },
  ],
  howItWorks: [
    {
      kind: 'paragraph',
      text: '**Named slots** are the simplest step beyond a single `children`.',
    },
    {
      kind: 'code',
      language: 'tsx',
      code: 'type PanelProps = {\n  header: React.ReactNode;\n  children: React.ReactNode;\n  footer?: React.ReactNode;\n};\n\nfunction Panel({ header, children, footer }: PanelProps) {\n  return (\n    <section className="panel">\n      <div className="panel-header">{header}</div>\n      <div className="panel-body">{children}</div>\n      {footer !== undefined && <div className="panel-footer">{footer}</div>}\n    </section>\n  );\n}',
    },
    {
      kind: 'paragraph',
      text: 'Each slot takes anything renderable. The component owns the structure and the spacing; the caller owns the content. The optional footer disappears entirely rather than leaving an empty region, which is the detail that keeps the spacing honest.',
    },
    {
      kind: 'paragraph',
      text: '**Compound components** go further: several components that share state through the parent.',
    },
    {
      kind: 'code',
      language: 'tsx',
      code: 'const TabsContext = createContext<TabsValue | null>(null);\n\nfunction Tabs({ value, onChange, children }: TabsProps) {\n  return (\n    <TabsContext.Provider value={{ value, onChange }}>\n      <div className="tabs">{children}</div>\n    </TabsContext.Provider>\n  );\n}\n\nfunction Tab({ id, children }: TabProps) {\n  const context = useContext(TabsContext);\n  if (context === null) throw new Error("Tab must be used inside Tabs");\n\n  return (\n    <button\n      role="tab"\n      aria-selected={context.value === id}\n      onClick={() => context.onChange(id)}\n    >\n      {children}\n    </button>\n  );\n}\n\nTabs.Tab = Tab;',
    },
    {
      kind: 'paragraph',
      text: 'Context is how a component passes something to descendants without every layer in between forwarding it. `Tabs` holds which tab is current; each `Tab` reads it. The caller writes the structure and never wires up the selection.',
    },
    {
      kind: 'paragraph',
      text: 'The thrown error matters. A `Tab` outside `Tabs` has no context, and failing loudly at that moment is far better than rendering something subtly broken.',
    },
  ],
  firstPrinciples: [
    {
      kind: 'paragraph',
      text: 'The principle: **the component owns what must be consistent; the caller owns what should vary**.',
    },
    {
      kind: 'paragraph',
      text: 'Dialog owns the overlay, the focus trap, the Escape handling, the padding and the radius — every one of which must be identical everywhere, and two of which are accessibility requirements the caller should not be able to get wrong.',
    },
    {
      kind: 'paragraph',
      text: 'The caller owns what is inside, because that is different every time. Getting this split right is what makes a component both consistent and useful.',
    },
  ],
  designPerspective: [
    {
      kind: 'paragraph',
      text: 'The design question is which parts of the pattern are the pattern.',
    },
    {
      kind: 'paragraph',
      text: 'For a dialog: the overlay, the position, the spacing, and where the actions sit. Those make it recognisable. The content does not, so constraining it buys consistency nowhere and costs flexibility everywhere.',
    },
  ],
  engineeringPerspective: [
    {
      kind: 'paragraph',
      text: 'The engineering cost of composition is that misuse becomes possible.',
    },
    {
      kind: 'paragraph',
      text: 'A `Dialog.Footer` can be left out, or filled with six buttons, or nested wrongly. Configuration prevents that by not offering the choice. Composition answers it differently — make correct use natural, fail loudly on structural mistakes, and accept that a determined caller can still produce something ugly.',
    },
  ],
  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'Composition in code is the slot in Figma.',
    },
    {
      kind: 'paragraph',
      text: 'A Figma component with an instance swap slot and a React component with a named slot are the same decision: this region is yours, the rest is the system’s. When both tools draw the line in the same place, a design and its implementation can actually correspond.',
    },
  ],
  industryExamples: [
    {
      id: 'example-radix-compound-dialog',
      source: 'Radix',
      title: 'Compound components with behaviour kept inside',
      observation:
        'Radix Dialog is composed from Root, Trigger, Portal, Overlay, Content, Title and Close, with focus management and Escape handling provided by the primitive.',
      takeaway:
        'The structure is open; the behaviour that is easy to get wrong is not. That is the split this lesson is describing.',
    },
    {
      id: 'example-polaris-composition',
      source: 'Shopify',
      title: 'Layout components that hold anything',
      observation:
        'Polaris provides layout and structure components that take arbitrary children rather than configuring their contents.',
      takeaway:
        'Structure is reusable across a whole product; content is not. Only one of the two belongs in the component.',
    },
  ],
  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Build a composable Dialog where the parts the caller must not get wrong are handled for them.',
    },
    {
      kind: 'code',
      language: 'tsx',
      code: 'type DialogProps = {\n  isOpen: boolean;\n  onClose: () => void;\n  children: React.ReactNode;\n};\n\nfunction Dialog({ isOpen, onClose, children }: DialogProps) {\n  if (isOpen === false) return null;\n\n  return (\n    <div className="dialog-overlay" onClick={onClose}>\n      <div\n        role="dialog"\n        aria-modal="true"\n        className="dialog"\n        onClick={(event) => event.stopPropagation()}\n      >\n        {children}\n      </div>\n    </div>\n  );\n}\n\nDialog.Title = function DialogTitle({ children }: { children: React.ReactNode }) {\n  return <h2 className="dialog-title">{children}</h2>;\n};\n\nDialog.Footer = function DialogFooter({ children }: { children: React.ReactNode }) {\n  return <div className="dialog-footer">{children}</div>;\n};',
    },
    {
      kind: 'paragraph',
      text: '`stopPropagation` on the inner div prevents a click inside the dialog from reaching the overlay and closing it — the event bubbling from Module 4 lesson 17, used deliberately.',
    },
    {
      kind: 'paragraph',
      text: '`role="dialog"` and `aria-modal` tell assistive technology what this is. Module 9 explains them, and adds the two things this version is still missing: keyboard focus trapped inside while open, and focus returned to the trigger on close.',
    },
    {
      kind: 'paragraph',
      text: 'Those belong in the component, not the caller — which is the principle of this lesson applied to the thing most often got wrong.',
    },
  ],
  commonMistakes: [
    {
      id: 'mistake-08-04-prop-for-every-case',
      mistake: 'Answering each new requirement with another prop.',
      why: 'The component becomes a configuration surface, the props start interacting, and the combinations stop being testable.',
      instead:
        'When props are accumulating around *content*, convert to composition. Keep props for what must stay consistent.',
    },
    {
      id: 'mistake-08-04-behaviour-left-to-caller',
      mistake: 'Composing so openly that focus management or Escape handling becomes the caller’s job.',
      why: 'Every caller then reimplements it, most will get it wrong, and the component has distributed a hard problem instead of solving it.',
      instead:
        'The component owns behaviour that must be correct. Composition is about content, not about offloading responsibility.',
    },
  ],
  professionalConsideration: [
    {
      kind: 'paragraph',
      text: 'The useful signal is *what* the props are about, not how many there are.',
    },
    {
      kind: 'paragraph',
      text: 'Six props describing behaviour and constraints is a well-specified component. Three props describing content — `title`, `body`, `footerText` — is a component that will be asked for a fourth next week. Props about what the component does are fine; props about what is inside it are a sign you should be composing.',
    },
  ],
  practicalExercise: {
    id: 'exercise-composition',
    title: 'Build a composable Dialog',
    prompt:
      'Build a Dialog using composition, with the behaviour that must be correct kept inside the component.',
    steps: [
      'Decide what the component owns and what the caller owns. Write the list before coding.',
      'Build Dialog with at least two named sub-components.',
      'Handle overlay click and Escape inside the component.',
      'Render three genuinely different dialogs: a confirmation, a form, and one with a list.',
      'Add a destructive confirmation using the danger Button from the previous lesson.',
      'Try building one of the three with a configuration-only API and record what it would have needed.',
      'Note the one behaviour you would move inside the component next, and why.',
    ],
    successCriteria: [
      'The ownership split is written down before implementation.',
      'Two or more named sub-components.',
      'Overlay click and Escape handled inside the component.',
      'Three structurally different dialogs built with no new props.',
      'The configuration-only comparison is recorded.',
    ],
    estimatedMinutes: 75,
    hint: 'The form dialog is the one that proves the point. A configuration API would need props for every field, which is the moment composition stops being a preference.',
  },
  reflectionQuestion:
    'What does a component gain by accepting children instead of content props, and what does it give up?',
  reflectionHint:
    'Flexibility and consistency pull against each other. Which parts of a pattern can afford to vary?',
  resources: [
    {
      id: 'resource-radix-dialog',
      title: 'Dialog — Radix Primitives',
      url: 'https://www.radix-ui.com/primitives/docs/components/dialog',
      type: 'documentation',
      author: 'Radix',
      estimatedMinutes: 30,
      note: 'A compound component done properly. Read the anatomy section and note which parts carry behaviour.',
    },
    {
      id: 'resource-react-passing-jsx-as-children',
      title: 'Passing JSX as children',
      url: 'https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children',
      type: 'documentation',
      author: 'React',
      estimatedMinutes: 15,
      note: 'The mechanism, briefly. The judgement is the hard part, not the syntax.',
    },
  ],
  competencyTags: ['component-architecture', 'component-api-design', 'react', 'design-systems', 'accessibility'],
  completionCriteria: [
    'Uses composition where props were accumulating around content.',
    'Builds a compound component with shared state via context.',
    'Keeps behaviour that must be correct inside the component.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Lesson 40                                                                   */
/* -------------------------------------------------------------------------- */

const LESSON_5: Lesson = {
  id: 'lesson-where-state-should-live',
  slug: 'where-state-should-live',
  moduleId: MODULE_ID,
  lessonNumber: 5,
  title: 'Where State Should Live',
  summary:
    'Module 5 asked what the state is. Module 7 held it. This lesson asks who owns it — the question that decides how a multi-panel interface holds together.',
  estimatedMinutes: 10,
  objectives: [
    'Decide where a piece of state belongs.',
    'Lift state to the closest common owner, and no higher.',
    'Explain controlled state as a question of ownership.',
    'Map state ownership across a multi-panel interface.',
  ],
  prerequisiteConcepts: [
    'State in React, Module 7 lesson 34',
    'Derived state, Module 5 lesson 23',
    'Composition and context',
  ],
  prerequisiteLessonIds: ['lesson-composition', 'lesson-derived-state-and-avoiding-duplicate-truth'],
  recap: [
    {
      kind: 'paragraph',
      text: 'You can hold state, keep it minimal, and share it through context. The remaining question is where each piece should sit.',
    },
  ],
  priorKnowledge: [
    {
      kind: 'paragraph',
      text: 'Module 5 lesson 23 established that a fact should exist in exactly one place. This lesson is that rule applied to a component tree: one place, and the right one.',
    },
  ],
  coreConcept: [
    {
      kind: 'paragraph',
      text: 'State belongs with the **closest common owner** of everything that needs it.',
    },
    {
      kind: 'paragraph',
      text: 'The procedure is mechanical:',
    },
    {
      kind: 'list',
      ordered: true,
      items: [
        'List every component that reads this state.',
        'List every component that changes it.',
        'Find the lowest component in the tree that contains all of them.',
        'Put the state there.',
      ],
    },
    {
      kind: 'paragraph',
      text: 'Only one component involved? Keep it local. Two siblings? It goes in their parent. Half the application? It is probably application state, and Module 14 deals with that.',
    },
  ],
  whyDesignersCare: [
    {
      kind: 'paragraph',
      text: 'Because ownership decides which parts of the interface can stay in step, and a surprising number of design intentions depend on that.',
    },
    {
      kind: 'paragraph',
      text: 'A list and a detail panel that must highlight the same selected item need one owner for the selection. Two owners means two answers, and the design intention — "the list shows what the panel is showing" — quietly stops being true.',
    },
  ],
  howItWorks: [
    {
      kind: 'paragraph',
      text: '**Lifting state** is moving it up until it reaches the common owner.',
    },
    {
      kind: 'code',
      language: 'tsx',
      code: '// Local: nothing outside cares whether this menu is open.\nfunction RowMenu() {\n  const [isOpen, setIsOpen] = useState(false);\n  /* … */\n}',
    },
    {
      kind: 'code',
      language: 'tsx',
      code: '// Lifted: the list highlights it, the panel renders it, the toolbar acts on it.\nfunction Workspace({ projects }: { projects: Project[] }) {\n  const [selectedId, setSelectedId] = useState<string | null>(null);\n\n  const selected = projects.find((p) => p.id === selectedId) ?? null;\n\n  return (\n    <>\n      <ProjectList\n        projects={projects}\n        selectedId={selectedId}\n        onSelect={setSelectedId}\n      />\n      <DetailPanel project={selected} onClose={() => setSelectedId(null)} />\n    </>\n  );\n}',
    },
    {
      kind: 'paragraph',
      text: 'Two important details. The state is the **id**, not the project — one fact, with the object derived by `find`. Storing the object would mean an edit elsewhere leaves a stale copy selected, which is the Module 5 duplicate-truth problem in a new disguise.',
    },
    {
      kind: 'paragraph',
      text: 'And `onSelect` is a function passed down. This is how one-way data flow and interactivity coexist: data flows down, requests to change it flow up.',
    },
  ],
  firstPrinciples: [
    {
      kind: 'paragraph',
      text: '"And no higher" is the half people skip.',
    },
    {
      kind: 'paragraph',
      text: 'State lifted above its common owner forces every layer in between to pass props it does not use, and it makes a local concern look global. The row menu’s open state in a top-level store is state nobody can reason about locally any more.',
    },
    {
      kind: 'callout',
      tone: 'insight',
      body: 'Lift when a second component genuinely needs it, not in anticipation. Lifting later is a contained change; a tree of needlessly global state is not.',
    },
  ],
  designPerspective: [
    {
      kind: 'paragraph',
      text: 'The design question is what must agree with what.',
    },
    {
      kind: 'paragraph',
      text: 'If the sidebar, the header and the panel must always show the same selection, they share an owner. If each panel scrolls independently, they do not. Working this out from the design is faster than discovering it from a bug, and the Module 5 behaviour map is where it is recorded.',
    },
  ],
  engineeringPerspective: [
    {
      kind: 'paragraph',
      text: 'The engineering question is what a change to the ownership costs.',
    },
    {
      kind: 'paragraph',
      text: 'Moving state down is usually easy. Moving it up means threading props through intermediate components — tedious, and the point at which context or a store starts to look attractive. Getting ownership roughly right early avoids that work, though "roughly right" is the honest standard; nobody gets it exactly right first time.',
    },
  ],
  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'Controlled versus uncontrolled, from lesson 37, is this question seen from inside a component.',
    },
    {
      kind: 'paragraph',
      text: 'A controlled component is one whose state has been lifted out of it. An uncontrolled one owns it. Choosing between them is choosing an owner — the same decision, one level down.',
    },
  ],
  industryExamples: [
    {
      id: 'example-react-sharing-state',
      source: 'React',
      title: 'Lifting documented as a procedure',
      observation:
        'React’s documentation describes sharing state between components as finding their closest common parent and moving the state there.',
      takeaway:
        'It is a procedure rather than a judgement call, which is unusual and worth exploiting.',
    },
    {
      id: 'example-url-as-owner',
      source: 'Common practice',
      title: 'The URL as an owner',
      observation:
        'Products commonly keep the current view, filter and selected item in the URL so a view can be linked and restored.',
      takeaway:
        'The URL is a legitimate owner, and the right one whenever the state should survive a reload or be shareable. Module 11 covers it.',
    },
  ],
  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Map ownership across a three-panel interface: a sidebar of lists, a list of items, a detail panel.',
    },
    {
      kind: 'list',
      items: [
        '`selectedListId` — read by the sidebar and the list. Owner: their common parent.',
        '`selectedItemId` — read by the list and the panel. Owner: their common parent.',
        '`searchQuery` — only the list uses it. Owner: the list. Local.',
        '`isSidebarCollapsed` — the sidebar renders it, the layout reacts to its width. Owner: the layout.',
        '`openRowMenuId` — only the list body uses it. Owner: the list body. Local.',
        '`draftTitle` while renaming — only the panel’s rename field. Owner: that field. Local.',
      ],
    },
    {
      kind: 'paragraph',
      text: 'Three lifted, three local. The lifted ones are exactly the ones two regions must agree about, and the local ones are exactly the ones nothing outside can observe.',
    },
    {
      kind: 'paragraph',
      text: 'Two things are deliberately absent. `selectedItem` as an object — derived from the id. And an `itemCount` — derived from the list. Both would be duplicate truth, which is the Module 5 rule holding up under a harder structure.',
    },
    {
      kind: 'paragraph',
      text: 'One honest caveat: `searchQuery` is local until somebody asks for a shareable filtered view, at which point it moves to the URL. That is not a mistake in the original decision — it is a requirement changing, and the lesson 37 point about APIs being harder to change than implementations is why it will cost something.',
    },
  ],
  commonMistakes: [
    {
      id: 'mistake-08-05-everything-global',
      mistake: 'Putting all state at the top of the tree, or in a store, by default.',
      why: 'Local concerns become global ones, every component can change anything, and no part of the interface can be reasoned about on its own.',
      instead: 'Start local. Lift only when a second component genuinely needs it.',
    },
    {
      id: 'mistake-08-05-duplicated-ownership',
      mistake: 'Keeping a copy of lifted state in the child for convenience.',
      why: 'Two owners means two answers, and they diverge the first time one updates without the other.',
      instead: 'One owner. The child receives the value and a function to request a change.',
    },
  ],
  professionalConsideration: [
    {
      kind: 'paragraph',
      text: 'Ownership questions are how component boundaries get judged after the fact.',
    },
    {
      kind: 'paragraph',
      text: 'If a state has to be lifted four levels because the components that need it are scattered, the boundaries from lesson 36 were probably wrong. The awkward lift is the symptom; the structure is the cause. It is worth treating repeated awkward lifting as information about the tree rather than as a state-management problem to be solved with a store.',
    },
  ],
  practicalExercise: {
    id: 'exercise-where-state-should-live',
    title: 'Map state ownership in a multi-panel interface',
    prompt:
      'Take a multi-panel interface and document where every piece of state lives, with a justification for each.',
    steps: [
      'Choose an interface with at least three regions that interact.',
      'List every piece of state it needs.',
      'For each, list which components read it and which change it.',
      'Identify the closest common owner and record it.',
      'Mark anything that turned out to be derived rather than state.',
      'Find one piece sitting higher than it needs to and move it down.',
      'Find one duplicated across two owners and consolidate it.',
      'Note one piece that would move to the URL if it had to be shareable.',
    ],
    successCriteria: [
      'Every piece has a named owner and a reason.',
      'Readers and writers are listed for each.',
      'Derived values are marked as derived, not owned.',
      'One piece is moved down and one duplication removed.',
      'The URL candidate is identified.',
    ],
    estimatedMinutes: 65,
    hint: 'Do the readers-and-writers list honestly before deciding the owner. The owner falls out of it, and guessing first is how state ends up too high.',
  },
  reflectionQuestion:
    'Where should state live?',
  reflectionHint:
    'Move truth to the closest common owner — and notice that "closest" is doing as much work as "common".',
  resources: [
    {
      id: 'resource-react-sharing-state',
      title: 'Sharing State Between Components',
      url: 'https://react.dev/learn/sharing-state-between-components',
      type: 'documentation',
      author: 'React',
      estimatedMinutes: 35,
      note: 'Lifting state, step by step, including the controlled-component connection.',
    },
    {
      id: 'resource-react-choosing-state-structure',
      title: 'Choosing the State Structure',
      url: 'https://react.dev/learn/choosing-the-state-structure',
      type: 'documentation',
      author: 'React',
      estimatedMinutes: 35,
      note: 'Avoiding redundant and contradictory state. The Module 5 principles, as React guidance.',
    },
  ],
  competencyTags: ['state-modelling', 'interface-state-modelling', 'component-architecture', 'architecture', 'react'],
  completionCriteria: [
    'Can locate the closest common owner for a piece of state.',
    'Keeps state local until a second component needs it.',
    'Can map ownership across a multi-panel interface.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Project                                                                     */
/* -------------------------------------------------------------------------- */

const PROJECT: ModuleProject = {
  id: 'project-reusable-component-library',
  slug: 'reusable-component-library',
  moduleId: MODULE_ID,
  title: 'Reusable Component Library',
  brief:
    'Build eight components as a coherent library — Button, Input, Checkbox, Tabs, Dialog, Dropdown, Tooltip and Toast — and document the states, props, accessibility behaviour and examples of each.',
  learnerGoal:
    'Produce the component library you will use for the rest of the course, and be able to defend every API decision in it.',
  problem:
    'Eight components is enough to force consistency decisions that one or two never would. The naming, the variant vocabulary and the state props have to agree across all of them, and that agreement is what makes a library rather than a folder.',
  prerequisiteLessonIds: [
    'lesson-choosing-component-boundaries',
    'lesson-designing-component-apis',
    'lesson-variants-without-complexity',
    'lesson-composition',
    'lesson-where-state-should-live',
  ],
  objectives: [
    'Design eight component APIs before implementing them.',
    'Keep naming and variant vocabulary consistent across the library.',
    'Use composition where configuration would not scale.',
    'Document every state each component can be in.',
  ],
  requirements: [
    'Eight components: Button, Input, Checkbox, Tabs, Dialog, Dropdown, Tooltip, Toast.',
    'Every API designed at the call site before implementation.',
    'Variants as unions; states as separate props.',
    'Tabs, Dialog and Dropdown built as compound components.',
    'Documentation per component: props table, every state, accessibility behaviour, and working examples.',
    'A matrix page rendering every variant in every state.',
    'Keyboard operation for all eight.',
  ],
  constraints: [
    'No component library or headless library. Build them.',
    'No boolean-per-variant anywhere.',
    'No prop whose purpose is to pass content that children could carry.',
    'Prop names must be consistent across the eight — one convention, applied everywhere.',
  ],
  suggestedScope:
    'Eight components properly, roughly thirty-five to forty-five hours. Finished when the documentation is complete and the matrix page shows no combination you did not intend.',
  deliverables: [
    'The eight components.',
    'A documentation page per component: props, states, accessibility, examples.',
    'The variant matrix page.',
    'A short note on the naming conventions you chose and where you had to break one.',
  ],
  completionCriteria: [
    'All eight components built and documented.',
    'Variants are unions throughout; no boolean explosion.',
    'Tabs, Dialog and Dropdown use composition rather than configuration.',
    'Prop naming is consistent across all eight.',
    'Every component is fully keyboard operable.',
    'The matrix page renders every variant in every state.',
  ],
  portfolioEvidence: [
    'API design — call sites designed before implementations.',
    'Systems consistency — one vocabulary across eight components.',
    'Composition judgement — configuration and composition used where each belongs.',
    'Documentation — states and accessibility recorded, not assumed.',
  ],
  reflectionQuestion:
    'Which component’s API did you change most during implementation, and what did designing the call site first fail to reveal?',
  estimatedHours: 40,
  competencies: [
    'component-architecture',
    'component-api-design',
    'design-systems',
    'design-systems-implementation',
    'react',
    'typescript',
    'accessibility',
    'interaction-engineering',
  ],
  stretchGoals: [
    'Add a focus-visible treatment that works on all eight and is defined once.',
    'Make Toast announce itself to assistive technology, then verify it with a screen reader in Module 9.',
    'Write the props tables from the types rather than by hand.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Module                                                                      */
/* -------------------------------------------------------------------------- */

export const MODULE_08: CurriculumModule = {
  id: MODULE_ID,
  slug: 'component-architecture',
  moduleNumber: 8,
  phase: 'systems',
  title: 'Component Architecture',
  description:
    'The decisions behind components rather than their mechanics: where a boundary belongs, what an API should accept, how variants stay finite, when to compose instead of configure, and who owns each piece of state.',
  outcome:
    'Can design component APIs that are consistent, hard to misuse, and still flexible enough to say yes to a new requirement.',
  prerequisites: [
    'Module 7 — React components, props and state',
    'Module 6 — TypeScript unions',
    'Module 2 — visual systems and the meaning of colour',
  ],
  lessons: [LESSON_1, LESSON_2, LESSON_3, LESSON_4, LESSON_5],
  resources: [
    {
      id: 'resource-module-08-radix-primitives',
      title: 'Radix Primitives',
      url: 'https://www.radix-ui.com/primitives',
      type: 'documentation',
      author: 'Radix',
      estimatedMinutes: 120,
      note: 'The best available reference for component APIs and compound composition. Read the anatomy and API sections of three or four components.',
    },
    {
      id: 'resource-module-08-polaris-components',
      title: 'Polaris Components',
      url: 'https://polaris.shopify.com/components',
      type: 'documentation',
      author: 'Shopify',
      estimatedMinutes: 90,
      note: 'A production library with its prop decisions and usage guidance documented in public.',
    },
    {
      id: 'resource-module-08-react-choosing-state-structure',
      title: 'Choosing the State Structure',
      url: 'https://react.dev/learn/choosing-the-state-structure',
      type: 'documentation',
      author: 'React',
      estimatedMinutes: 35,
      note: 'The reference for the ownership lesson. Short, and worth rereading during the project.',
    },
    {
      id: 'resource-module-08-react-conf-component-apis',
      title: 'React on YouTube',
      url: 'https://www.youtube.com/@reactjs',
      type: 'video',
      author: 'React',
      estimatedMinutes: 60,
      note: 'Search for talks on component APIs and design systems. Several cover the composition-versus-configuration trade-off directly.',
    },
  ],
  project: PROJECT,
  competencies: [
    'component-architecture',
    'component-api-design',
    'design-systems',
    'design-systems-implementation',
    'architecture',
    'react',
    'typescript',
    'state-modelling',
    'interface-state-modelling',
    'accessibility',
    'interaction-engineering',
  ],
  completionCriteria: [
    'All five lessons completed.',
    'Module project marked completed.',
    'Can design and defend a component API before building it.',
  ],
};
