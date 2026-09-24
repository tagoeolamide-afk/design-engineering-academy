/**
 * Module 07 — React Foundations.
 *
 * The component model itself: boundaries, props as an API, rendering as a
 * function of state, and the narrow set of cases that genuinely need an effect.
 */

import type { CurriculumModule, Lesson, ModuleProject } from '@/types/curriculum';

const MODULE_ID = 'module-07';

/* -------------------------------------------------------------------------- */
/* Lesson 31                                                                   */
/* -------------------------------------------------------------------------- */

const LESSON_31: Lesson = {
  id: 'lesson-07-01',
  slug: 'components',
  moduleId: MODULE_ID,
  lessonNumber: 1,
  title: 'Components',
  summary:
    'A component is a boundary. Drawing it around a repeated shape is easy and often wrong; drawing it around a responsibility is the actual skill.',
  estimatedMinutes: 8,

  objectives: [
    'Describe a component as a function from props to described output.',
    'Compose components rather than configuring one large component.',
    'Choose boundaries from responsibility and change frequency.',
    'Recognise a boundary drawn around appearance rather than behaviour.',
  ],

  prerequisiteConcepts: ['Rendering from state', 'Types as contracts'],
  prerequisiteLessonIds: ['lesson-05-04', 'lesson-06-01'],

  recap: [
    {
      kind: 'paragraph',
      text: 'In Module 5 you built reconciliation by hand and counted what had to be remembered. React is that loop, generalised.',
    },
  ],

  coreConcept: [
    {
      kind: 'paragraph',
      text: 'A component is a function that takes props and returns a description of what the interface should look like. It does not touch the DOM. React compares descriptions and applies the difference, which is why you write the destination rather than the journey.',
    },
    {
      kind: 'paragraph',
      text: 'Composition means building larger things by placing components inside one another, rather than adding options to one component. A page composed of six components is easier to change than one component with twenty props — and the props version is what happens when boundaries are avoided.',
    },
    {
      kind: 'callout',
      tone: 'insight',
      body: 'A boundary should separate things that change for different reasons. Two things that always change together are one thing.',
    },
  ],

  firstPrinciples: [
    {
      kind: 'paragraph',
      text: 'Every boundary has a cost: a file, a name, an API, an indirection a reader must follow. It pays for itself when it isolates a reason to change, gives a concept a name worth having, or lets something be tested or reused independently.',
    },
    {
      kind: 'paragraph',
      text: 'Repetition alone does not pay for it. Two blocks that look alike but serve different purposes will diverge, and a component extracted from that coincidence grows conditionals until it is harder to read than the duplication was.',
    },
  ],

  designPerspective: [
    {
      kind: 'paragraph',
      text: 'Designers draw boundaries constantly — a card, a modal, a toolbar — but those boundaries are visual containers, and visual containers do not always correspond to responsibilities.',
    },
    {
      kind: 'paragraph',
      text: 'A useful reframing: a component is a thing you could describe to someone without pointing at the screen. If the only description available is "the box in the top right", the boundary is positional rather than conceptual.',
    },
  ],

  engineeringPerspective: [
    {
      kind: 'code',
      language: 'tsx',
      caption: 'Composition instead of configuration.',
      code: `// Configuration: one component that must know every case.
<Panel
  title="Filters"
  showFooter
  footerAction="Clear"
  collapsible
  variant="sidebar"
/>

// Composition: the structure is expressed rather than described.
<Panel>
  <Panel.Header>Filters</Panel.Header>
  <Panel.Body>
    <FilterList filters={filters} onChange={setFilters} />
  </Panel.Body>
  <Panel.Footer>
    <Button onClick={clear}>Clear</Button>
  </Panel.Footer>
</Panel>`,
    },
    {
      kind: 'paragraph',
      text: 'The second version has no opinion about what a footer contains, so the next requirement — two buttons, a count, nothing at all — needs no change to Panel. The first version needs a new prop for each of those.',
    },
  ],

  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'Component boundaries in code and component boundaries in a design file should mostly agree, and where they disagree it is worth asking which one is wrong. Usually the disagreement reveals that a visual grouping is hiding two responsibilities.',
    },
    {
      kind: 'paragraph',
      text: 'Shared names matter more than shared structure. If a designer says "the row actions" and an engineer says "the ListItemToolbar", every conversation costs a translation.',
    },
  ],

  industryExamples: [
    {
      id: 'example-compound-components',
      source: 'Radix UI and similar primitives',
      title: 'Structure expressed, not configured',
      observation:
        'Primitive libraries expose composable parts — Root, Trigger, Content — rather than a single component with a prop for every arrangement.',
      takeaway:
        'The library never has to anticipate layouts, because the consumer expresses them directly.',
    },
    {
      id: 'example-design-system-parity',
      source: 'Mature design systems',
      title: 'One vocabulary across both tools',
      observation:
        'Systems that hold up over time use the same component names and part names in the design file and the codebase.',
      takeaway:
        'Shared vocabulary removes a translation step from every single conversation about the product.',
    },
  ],

  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Breaking an interface into components.',
    },
    { kind: 'heading', text: '1. Build it as one component first' },
    {
      kind: 'paragraph',
      text: 'Boundaries are easier to see in working code than to predict. Extracting later is cheap; unwinding a wrong abstraction is not.',
    },
    { kind: 'heading', text: '2. Mark what changes for different reasons' },
    {
      kind: 'paragraph',
      text: 'The filter bar changes when filtering changes. The row changes when the data shape changes. Different reasons, different components.',
    },
    { kind: 'heading', text: '3. Name each candidate' },
    {
      kind: 'paragraph',
      text: 'If the honest name is "the middle bit", it is not a component yet.',
    },
    { kind: 'heading', text: '4. Extract, and check the props' },
    {
      kind: 'paragraph',
      text: 'A long prop list immediately after extraction usually means the boundary cut through a responsibility rather than between two.',
    },
    { kind: 'heading', text: '5. Leave the coincidences alone' },
    {
      kind: 'paragraph',
      text: 'Two similar-looking sections with different purposes stay separate until a third appears and the shared concept is real.',
    },
  ],

  commonMistakes: [
    {
      id: 'mistake-extract-by-appearance',
      mistake: 'Extracting a component because two things look alike.',
      why: 'Appearance is a weak signal. They will diverge, and the shared component will accumulate conditionals for each divergence.',
      instead: 'Extract when the responsibility is shared, not when the pixels are.',
    },
    {
      id: 'mistake-too-granular',
      mistake: 'Splitting everything into tiny components.',
      why: 'Following a simple interface across fifteen files is harder than reading one file, and each boundary is an API to maintain.',
      instead: 'Split when there is a reason to change independently.',
    },
    {
      id: 'mistake-god-component',
      mistake: 'One component that renders an entire page.',
      why: 'Nothing can be tested, reused, or understood in isolation, and every change risks everything on the screen.',
      instead: 'Split along responsibilities as they become visible.',
    },
    {
      id: 'mistake-config-over-composition',
      mistake: 'Adding a prop instead of allowing children.',
      why: 'Each new arrangement needs a new prop, and the component slowly acquires knowledge of every context it appears in.',
      instead: 'Accept children or slots and let the consumer express structure.',
    },
  ],

  eliteConsiderations: [
    {
      kind: 'list',
      items: [
        'Write the usage you want before writing the component; the call site reveals the right API faster than the implementation does.',
        'Keep components that fetch data separate from components that render it — the reasons to change are different.',
        'Name by role in the product, not by position on screen.',
        'When a component gains its fourth boolean prop, look for the second responsibility hiding inside it.',
      ],
    },
  ],

  practicalExercise: {
    id: 'exercise-07-01',
    title: 'Break an interface into sensible components',
    prompt:
      'Take an existing single-file interface and decompose it along responsibilities.',
    steps: [
      'Start from a working interface written as one component.',
      'Annotate each region with the reason it would change.',
      'Group regions that share a reason; those are candidate components.',
      'Name each candidate; discard any you cannot name meaningfully.',
      'Extract them and review the resulting prop lists.',
      'Revisit any boundary that produced more than about five props.',
      'Identify at least one repeated pattern you deliberately did not extract, and write down why.',
    ],
    successCriteria: [
      'Every component has a name describing its role, not its position.',
      'Each boundary separates a distinct reason to change.',
      'No component has an unexplained prop list longer than about five.',
      'At least one deliberate non-extraction is documented.',
      'The interface behaves identically to before the refactor.',
    ],
    estimatedMinutes: 45,
    hint: 'Ask what would make each region change. Regions with different answers belong to different components.',
  },

  reflectionQuestion: 'Should every repeated visual pattern become a component?',
  reflectionHint: 'Reuse is not the only reason for a boundary.',

  resources: [
    {
      id: 'resource-react-your-first-component',
      title: 'React: your first component',
      url: 'https://react.dev/learn/your-first-component',
      type: 'documentation',
      estimatedMinutes: 20,
      note: 'The component model, stated plainly.',
    },
    {
      id: 'resource-react-thinking-in-react',
      title: 'Thinking in React',
      url: 'https://react.dev/learn/thinking-in-react',
      type: 'documentation',
      estimatedMinutes: 30,
      note: 'Decomposition worked through on a real example.',
    },
  ],

  competencyTags: ['react', 'component-architecture', 'architecture'],

  completionCriteria: [
    'Has decomposed a real interface along responsibilities.',
    'Every component has a meaningful name.',
    'At least one deliberate non-extraction is documented.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Lesson 32                                                                   */
/* -------------------------------------------------------------------------- */

const LESSON_32: Lesson = {
  id: 'lesson-07-02',
  slug: 'props',
  moduleId: MODULE_ID,
  lessonNumber: 2,
  title: 'Props',
  summary:
    'Props are a component\'s public API. They are read far more often than they are written, and designing them is design work.',
  estimatedMinutes: 9,

  objectives: [
    'Treat props as an interface others must understand without reading the source.',
    'Use children and slots instead of configuration where structure varies.',
    'Name props so their meaning is obvious at the call site.',
    'Recognise a prop list that signals more than one responsibility.',
  ],

  prerequisiteConcepts: ['Components', 'Literal union types'],
  prerequisiteLessonIds: ['lesson-07-01', 'lesson-06-02'],

  recap: [
    {
      kind: 'paragraph',
      text: 'You can draw a boundary. Props are what crosses it, which makes them the part everyone else has to live with.',
    },
  ],

  coreConcept: [
    {
      kind: 'paragraph',
      text: 'Props are inputs, and they come in a few distinct kinds worth keeping separate: data to display, configuration of appearance or behaviour, callbacks reporting what happened, and content passed as children.',
    },
    {
      kind: 'list',
      items: [
        'Data — what the component shows.',
        'Configuration — variant, size, tone; a closed set, not an open string.',
        'Callbacks — named for the event, `onSelect`, not for the reaction, `doSearch`.',
        'Children and slots — structure the component should not need to anticipate.',
      ],
    },
    {
      kind: 'paragraph',
      text: 'The test of a prop API is the call site. Read it aloud without looking at the implementation: if you cannot predict what the component will do, the API is wrong regardless of how clean the implementation is.',
    },
    {
      kind: 'callout',
      tone: 'insight',
      body: 'Props are read at every call site and written once. Optimise for reading.',
    },
  ],

  firstPrinciples: [
    {
      kind: 'paragraph',
      text: 'Each boolean prop doubles the number of possible configurations. Four booleans is sixteen combinations, most of which nobody has designed, tested, or even considered — and all of which are reachable.',
    },
    {
      kind: 'paragraph',
      text: 'A closed union collapses that space. `variant: \'primary\' | \'secondary\' | \'danger\'` is three states rather than eight, and it makes the mutually exclusive cases actually exclusive.',
    },
  ],

  designPerspective: [
    {
      kind: 'paragraph',
      text: 'Props and Figma component properties describe the same thing, and where they disagree someone is going to build the wrong variant. Deciding them together is cheaper than reconciling them afterwards.',
    },
    {
      kind: 'paragraph',
      text: 'It is also where a design system reveals whether it has decided anything. Six variants of a card usually means six screens each invented their own, and the props are simply the record of that.',
    },
  ],

  engineeringPerspective: [
    {
      kind: 'code',
      language: 'tsx',
      caption: 'A prop API you can read at the call site.',
      code: `interface CardProps {
  /** Displayed as the card's heading. */
  title: string;
  /** Optional supporting text. Omit for a title-only card. */
  description?: string;
  /** Visual weight. Mutually exclusive by construction. */
  emphasis?: 'default' | 'raised' | 'quiet';
  /** Fired when the whole card is activated. Omit to make it non-interactive. */
  onActivate?: () => void;
  /** Arbitrary content in the card's action area. */
  actions?: React.ReactNode;
}

// The call site says what it does without opening the file.
<Card
  title="Command palette"
  description="Search and run any command."
  emphasis="raised"
  actions={<Button variant="quiet">Open</Button>}
/>`,
    },
    {
      kind: 'paragraph',
      text: 'Note that interactivity is implied by the presence of `onActivate` rather than by a separate `isInteractive` flag. A prop that only exists to describe another prop is usually one prop too many.',
    },
  ],

  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'Designing the API before implementing forces the design questions early: is this one component or two, what varies, what is fixed, what does the consumer control.',
    },
    {
      kind: 'paragraph',
      text: 'Those are the same questions a designer answers when defining a component in a design file, which is why doing them once, together, is strictly cheaper than doing them twice.',
    },
  ],

  industryExamples: [
    {
      id: 'example-variant-not-booleans',
      source: 'Established component libraries',
      title: 'Variants as a closed set',
      observation:
        'Mature libraries expose `variant` and `size` as unions rather than `isPrimary`, `isLarge`, `isDanger` booleans.',
      takeaway:
        'Mutually exclusive things should be mutually exclusive in the type, not by convention.',
    },
    {
      id: 'example-slots-api',
      source: 'Design-system components with slots',
      title: 'Slots for what cannot be anticipated',
      observation:
        'Components commonly accept `leading`, `trailing`, or `actions` nodes rather than props for every possible ornament.',
      takeaway:
        'The component stops needing to know about contexts it has never seen.',
    },
  ],

  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Designing a configurable card.',
    },
    { kind: 'heading', text: '1. Write the call sites first' },
    {
      kind: 'paragraph',
      text: 'Four or five realistic usages, before any implementation. This is the API design; the rest is execution.',
    },
    { kind: 'heading', text: '2. Find what actually varies' },
    {
      kind: 'paragraph',
      text: 'Anything identical across all the call sites is not a prop. Anything varying is a candidate.',
    },
    { kind: 'heading', text: '3. Collapse booleans into unions' },
    {
      kind: 'paragraph',
      text: 'Wherever two flags cannot both be true, they are one prop with two values.',
    },
    { kind: 'heading', text: '4. Replace configuration with slots' },
    {
      kind: 'paragraph',
      text: 'Anything structural — actions, media, badges — becomes a node the consumer supplies.',
    },
    { kind: 'heading', text: '5. Document each prop in one line' },
    {
      kind: 'paragraph',
      text: 'If a prop needs a paragraph to explain, it is doing more than one thing.',
    },
    { kind: 'heading', text: '6. Test the API on someone else' },
    {
      kind: 'paragraph',
      text: 'Show only the type and the call sites. If they can predict the rendering, the API is readable.',
    },
  ],

  commonMistakes: [
    {
      id: 'mistake-boolean-explosion-props',
      mistake: 'Adding a boolean prop for every new case.',
      why: 'The combination space doubles each time, and most combinations are never designed or tested.',
      instead: 'Use a union for mutually exclusive options.',
    },
    {
      id: 'mistake-prop-drilling',
      mistake: 'Threading a prop through several layers that do not use it.',
      why: 'Every intermediate component becomes coupled to data it has no interest in.',
      instead: 'Pass the rendered node down as children, or use context for genuinely ambient values.',
    },
    {
      id: 'mistake-callback-naming',
      mistake: 'Naming a callback after what the parent will do.',
      why: '`onSave` presumes the reaction; the component only knows that something was submitted.',
      instead: 'Name callbacks after the event: `onSubmit`, `onSelect`, `onDismiss`.',
    },
    {
      id: 'mistake-leaking-implementation',
      mistake: 'Exposing props that describe the implementation.',
      why: '`wrapperClassName` and `innerStyle` freeze the internal structure into the public API.',
      instead: 'Expose intent — variant, tone, density — and keep structure private.',
    },
  ],

  eliteConsiderations: [
    {
      kind: 'list',
      items: [
        'Design the API against the hardest call site you can imagine, not the easiest.',
        'Prefer required props over optional ones with defaults that hide a decision.',
        'Keep prop names consistent across the whole library; `variant` should never be `kind` elsewhere.',
        'A prop that only makes sense when another prop has a specific value belongs in the type, expressed as a union of allowed shapes.',
      ],
    },
  ],

  practicalExercise: {
    id: 'exercise-07-02',
    title: 'Create a configurable card component',
    prompt:
      'Design and build a card whose API can be understood entirely from its call sites.',
    steps: [
      'Write five realistic call sites before any implementation.',
      'Derive the prop list from what varies across them.',
      'Collapse every set of mutually exclusive booleans into a union.',
      'Use slots for anything structural the card should not anticipate.',
      'Document each prop in a single line.',
      'Implement the component against the call sites you wrote.',
      'Show the type and call sites to someone and check they can predict the result.',
    ],
    successCriteria: [
      'No two boolean props are mutually exclusive.',
      'Every prop has a one-line description.',
      'Structural content is supplied as slots, not configured.',
      'Callbacks are named after events, not reactions.',
      'No prop exposes internal structure such as class names for inner elements.',
    ],
    estimatedMinutes: 45,
    hint: 'Write the usage you wish existed, then make it real. Designing from the implementation outwards produces APIs that fit the implementation rather than the user.',
  },

  reflectionQuestion: 'When does a component have too many props?',
  reflectionHint: 'A confused API often signals multiple responsibilities.',

  resources: [
    {
      id: 'resource-react-passing-props',
      title: 'React: passing props to a component',
      url: 'https://react.dev/learn/passing-props-to-a-component',
      type: 'documentation',
      estimatedMinutes: 25,
      note: 'Props, children, and the mechanics of both.',
    },
    {
      id: 'resource-react-children',
      title: 'React: passing JSX as children',
      url: 'https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children',
      type: 'documentation',
      estimatedMinutes: 10,
      note: 'The mechanism behind slot-style APIs.',
    },
  ],

  competencyTags: ['typescript', 'react', 'component-api-design'],

  completionCriteria: [
    'Has designed a prop API from call sites rather than implementation.',
    'No mutually exclusive booleans remain.',
    'Every prop is documented in one line.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Lesson 33                                                                   */
/* -------------------------------------------------------------------------- */

const LESSON_33: Lesson = {
  id: 'lesson-07-03',
  slug: 'rendering',
  moduleId: MODULE_ID,
  lessonNumber: 3,
  title: 'Rendering',
  summary:
    'Rendering describes what should exist for the current state. Keys are how React decides whether two descriptions refer to the same thing.',
  estimatedMinutes: 9,

  objectives: [
    'Describe render, commit, and what triggers each.',
    'Render conditionally without producing accidental output.',
    'Render lists with keys that express identity.',
    'Predict what a wrong key will break.',
  ],

  prerequisiteConcepts: ['Props', 'Keyed reconciliation'],
  prerequisiteLessonIds: ['lesson-07-02', 'lesson-05-04'],

  recap: [
    {
      kind: 'paragraph',
      text: 'You implemented keyed reconciliation by hand in Module 5. This is the same mechanism with the bookkeeping removed.',
    },
  ],

  coreConcept: [
    {
      kind: 'paragraph',
      text: 'Rendering is React calling your components to get a description of the interface for the current state. Committing is React applying the differences to the DOM. Render is frequent and should be pure; commit is where the visible change happens.',
    },
    {
      kind: 'paragraph',
      text: 'Because render is called repeatedly, a component must be a pure function of its props and state. Mutating something outside, or reading something that changes between calls, produces results that depend on how often React happened to render — which is not a contract you can rely on.',
    },
    {
      kind: 'callout',
      tone: 'warning',
      body: 'A key is an identity claim, not a loop counter. It tells React "this is the same item as before", and React acts on that claim — preserving state and focus, or discarding them.',
    },
  ],

  firstPrinciples: [
    {
      kind: 'paragraph',
      text: 'With an index as key, position becomes identity. Remove the first item of a list and every remaining item shifts by one, so React concludes each one became a different item — component state stays with the position rather than the data.',
    },
    {
      kind: 'paragraph',
      text: 'The visible result is text typed into one row appearing in another, a checked box moving, or focus landing on the wrong element. Nothing in the code looks wrong; the identity claim was simply false.',
    },
  ],

  designPerspective: [
    {
      kind: 'paragraph',
      text: 'Conditional rendering is where empty states either exist or do not. `{items.length > 0 && <List …/>}` renders nothing when there are no items — a blank region, which is a design decision nobody made.',
    },
    {
      kind: 'paragraph',
      text: 'Writing the else branch every time turns "what does this look like with no data?" into a question the code forces you to answer.',
    },
  ],

  engineeringPerspective: [
    {
      kind: 'code',
      language: 'tsx',
      caption: 'Identity, and the empty case handled rather than omitted.',
      code: `// Index as key: state follows position, not data.
{projects.map((project, i) => <Row key={i} project={project} />)}

// Stable id: state follows the item through sorting and removal.
{projects.map((project) => <Row key={project.id} project={project} />)}

// && renders nothing when the list is empty — a blank region nobody designed.
{projects.length > 0 && <ProjectList projects={projects} />}

// The empty case is a state with its own design.
{projects.length > 0
  ? <ProjectList projects={projects} />
  : <EmptyState
      title="No projects yet"
      action={<Button onClick={create}>New project</Button>}
    />}`,
    },
    {
      kind: 'paragraph',
      text: 'One more trap: `{count && <Badge …/>}` renders the number zero when count is zero, because zero is falsy but still renders. Compare explicitly — `count > 0 &&` — or use a ternary.',
    },
  ],

  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'Declarative rendering makes the set of visual states enumerable: the states are the branches. A design review can walk those branches, and a missing branch is a missing design.',
    },
    {
      kind: 'paragraph',
      text: 'This is the clearest payoff of the union types from Module 6 — a switch over a five-member union is a list of five screens that must exist.',
    },
  ],

  industryExamples: [
    {
      id: 'example-key-bugs',
      source: 'React issue trackers and post-mortems',
      title: 'Index keys as a recurring defect class',
      observation:
        'Bugs where input values or checked states attach to the wrong row after sorting or deletion trace back to index keys with striking regularity.',
      takeaway:
        'It is not a style rule. It is an identity claim that is false as soon as the list reorders.',
    },
    {
      id: 'example-empty-states-designed',
      source: 'Products with strong empty states',
      title: 'The empty case treated as a screen',
      observation:
        'Well-designed products treat "no data yet" as an opportunity to explain and offer the first action, rather than rendering nothing.',
      takeaway:
        'The empty state is frequently a new user\'s first screen, which makes it the least appropriate place for a blank region.',
    },
  ],

  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Rendering project cards from structured data.',
    },
    { kind: 'heading', text: '1. Type the data first' },
    {
      kind: 'paragraph',
      text: 'The card renders what the type says exists. Optional fields become branches you must write.',
    },
    { kind: 'heading', text: '2. Key by a stable id' },
    {
      kind: 'paragraph',
      text: 'From the data, never the index. If the data has no id, that is a data-modelling problem to fix before rendering.',
    },
    { kind: 'heading', text: '3. Write every branch explicitly' },
    {
      kind: 'paragraph',
      text: 'Loading, empty, error, populated. Use ternaries or early returns rather than `&&`, so nothing can render as nothing by accident.',
    },
    { kind: 'heading', text: '4. Prove the keys are right' },
    {
      kind: 'paragraph',
      text: 'Add an input to each card, type into the third one, delete the first. The text must stay with its card.',
    },
    { kind: 'heading', text: '5. Check the falsy trap' },
    {
      kind: 'paragraph',
      text: 'Any numeric condition compared explicitly. Set every count to zero and confirm no stray zeroes appear.',
    },
  ],

  commonMistakes: [
    {
      id: 'mistake-index-key-react',
      mistake: 'Using the array index as a key.',
      why: 'State and focus attach to position, so reordering or removal moves them to the wrong item.',
      instead: 'Key by a stable id belonging to the data.',
    },
    {
      id: 'mistake-and-renders-zero',
      mistake: 'Using `&&` with a numeric condition.',
      why: 'Zero is falsy but still renders, producing a stray "0" in the interface.',
      instead: 'Compare explicitly, or use a ternary.',
    },
    {
      id: 'mistake-missing-empty-branch',
      mistake: 'Rendering a list with `&&` and no else branch.',
      why: 'The empty case becomes a blank region instead of a designed state.',
      instead: 'Write the empty branch every time.',
    },
    {
      id: 'mistake-impure-render',
      mistake: 'Mutating or performing side effects during render.',
      why: 'Render can be called more than once per commit, so the behaviour depends on internals you do not control.',
      instead: 'Keep render pure; side effects belong in event handlers or effects.',
    },
  ],

  eliteConsiderations: [
    {
      kind: 'list',
      items: [
        'Generate ids when creating items locally, so keys exist before the server assigns them.',
        'Change a component\'s `key` deliberately when you want its state reset — it is the documented way to do that.',
        'Prefer early returns for loading and error states; nesting ternaries three deep is unreadable.',
        'Treat a stray "0" or "false" in the interface as a falsy-rendering bug, not a data bug.',
      ],
    },
  ],

  practicalExercise: {
    id: 'exercise-07-03',
    title: 'Render project cards from structured data',
    prompt:
      'Render a list of project cards with correct identity and every branch written explicitly.',
    steps: [
      'Define the project type, including its optional fields.',
      'Render the list keyed by a stable id from the data.',
      'Write loading, empty, error, and populated branches explicitly.',
      'Replace every `&&` used with a numeric condition.',
      'Add an input to each card, type into one, then delete an earlier card.',
      'Confirm the typed text stayed with its own card.',
      'Sort the list and confirm state follows the data, not the position.',
    ],
    successCriteria: [
      'No array indices are used as keys.',
      'All four branches render something designed.',
      'No `&&` remains with a numeric left-hand side.',
      'Per-card state survives deletion and sorting.',
      'Render contains no mutation or side effects.',
    ],
    estimatedMinutes: 40,
    hint: 'The input test is the proof. If the text moves when you delete a different row, the keys are lying.',
  },

  reflectionQuestion: 'Why should array index rarely become a persistent key?',
  reflectionHint: 'Identity survives reordering.',

  resources: [
    {
      id: 'resource-react-lists',
      title: 'React: rendering lists',
      url: 'https://react.dev/learn/rendering-lists',
      type: 'documentation',
      estimatedMinutes: 25,
      note: 'Keys, and exactly what goes wrong without them.',
    },
    {
      id: 'resource-react-conditional',
      title: 'React: conditional rendering',
      url: 'https://react.dev/learn/conditional-rendering',
      type: 'documentation',
      estimatedMinutes: 20,
      note: 'Including the falsy-value traps.',
    },
    {
      id: 'resource-react-keeping-pure',
      title: 'React: keeping components pure',
      url: 'https://react.dev/learn/keeping-components-pure',
      type: 'documentation',
      estimatedMinutes: 20,
      note: 'Why render must be repeatable without consequence.',
    },
  ],

  competencyTags: ['javascript', 'react', 'component-architecture'],

  completionCriteria: [
    'Has rendered a list with correct identity keys.',
    'All four render branches are written explicitly.',
    'Per-card state survives reordering and deletion.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Lesson 34                                                                   */
/* -------------------------------------------------------------------------- */

const LESSON_34: Lesson = {
  id: 'lesson-07-04',
  slug: 'state',
  moduleId: MODULE_ID,
  lessonNumber: 4,
  title: 'State',
  summary:
    'State in React is a snapshot per render. Where it lives decides which components are coupled to it, which is an architectural choice.',
  estimatedMinutes: 9,

  objectives: [
    'Explain why state within one render is a fixed snapshot.',
    'Update state from the previous value when the update depends on it.',
    'Derive during render rather than storing a second copy.',
    'Place state at the closest common owner of everything that needs it.',
  ],

  prerequisiteConcepts: ['State as single source of truth', 'Rendering'],
  prerequisiteLessonIds: ['lesson-07-03', 'lesson-05-03'],

  recap: [
    {
      kind: 'paragraph',
      text: 'Module 5 argued that each fact should exist in one place and everything else should be derived. React gives that rule a mechanism and a question: which component holds the fact.',
    },
  ],

  coreConcept: [
    {
      kind: 'paragraph',
      text: 'A state variable is a value React remembers between renders. Setting it schedules a re-render; it does not change the current one. Within a single render, the value is a fixed snapshot — which is why reading it immediately after setting it gives the old value.',
    },
    {
      kind: 'paragraph',
      text: 'When the next value depends on the previous one, pass a function. `setCount(c => c + 1)` is computed at update time and composes correctly with other pending updates; `setCount(count + 1)` uses the snapshot and loses intermediate updates.',
    },
    {
      kind: 'list',
      items: [
        'Used by one component — keep it local.',
        'Used by two siblings — lift to their closest common parent.',
        'Used across the application — a store, or the URL if it is navigational.',
        'Computable from existing state — do not store it at all.',
      ],
    },
    {
      kind: 'callout',
      tone: 'insight',
      body: 'Lifting state is not free. Every level it rises couples more of the tree to it, so lift to the closest common owner and no further.',
    },
  ],

  firstPrinciples: [
    {
      kind: 'paragraph',
      text: 'Derived values calculated during render cannot go stale, because they are recomputed from the source every time. A derived value stored in its own state can go stale, and will, the first time a code path updates the source and forgets the copy.',
    },
    {
      kind: 'paragraph',
      text: 'The performance objection is usually unfounded at interface scale. Filtering a few hundred items costs microseconds; a stale count costs a bug report. Memoise when a measurement says to.',
    },
  ],

  designPerspective: [
    {
      kind: 'paragraph',
      text: 'State location is felt by users as scope. A filter held inside a panel resets when the panel closes. The same filter held in the URL survives a refresh and can be shared. Neither is wrong, but only one matches any given intent.',
    },
    {
      kind: 'paragraph',
      text: 'Worth deciding explicitly for each piece of state: does it survive a re-render, a navigation, a refresh, a new session? Four answers, four different homes.',
    },
  ],

  engineeringPerspective: [
    {
      kind: 'code',
      language: 'tsx',
      caption: 'Derived during render; updated from the previous value.',
      code: `function ProjectList({ projects }: { projects: Project[] }) {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<Status | 'all'>('all');

  // Derived. Cannot be stale, because it is recomputed from the source.
  const visible = projects.filter(
    (p) =>
      (status === 'all' || p.status === status) &&
      p.name.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <>
      <Filters query={query} onQueryChange={setQuery} status={status} onStatusChange={setStatus} />
      <Count value={visible.length} />
      {visible.length > 0 ? <List items={visible} /> : <NoMatches onClear={() => setQuery('')} />}
    </>
  );
}`,
    },
    {
      kind: 'paragraph',
      text: 'The count and the visible list come from the same expression, so they cannot disagree. Storing `visibleCount` in its own state would introduce exactly that possibility.',
    },
  ],

  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'State placement decides what "closing this panel" means. A designer specifying that filters persist across panel visits is specifying that the state lives above the panel — a design decision with a structural consequence.',
    },
    {
      kind: 'paragraph',
      text: 'Making that explicit during design avoids the common outcome where persistence is decided by wherever `useState` happened to be typed.',
    },
  ],

  industryExamples: [
    {
      id: 'example-url-filters-react',
      source: 'Applications with shareable views',
      title: 'Filters lifted all the way to the URL',
      observation:
        'Products whose filtered views can be linked keep that state in the URL rather than in component state.',
      takeaway:
        'The same interaction becomes shareable or private depending only on where the state was put.',
    },
    {
      id: 'example-derived-not-stored',
      source: 'State-management guidance across libraries',
      title: 'Store the minimum, derive the rest',
      observation:
        'Library documentation converges on storing the smallest possible set of facts and computing everything else at read time.',
      takeaway:
        'Every stored derivative is a synchronisation obligation you have taken on voluntarily.',
    },
  ],

  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Building interactive tabs and filters.',
    },
    { kind: 'heading', text: '1. List the facts' },
    {
      kind: 'paragraph',
      text: 'Active tab, query, status filter. Three facts. Everything on screen follows from them.',
    },
    { kind: 'heading', text: '2. Find the closest common owner' },
    {
      kind: 'paragraph',
      text: 'For each fact, the lowest component containing everything that reads it. That is where it goes.',
    },
    { kind: 'heading', text: '3. Derive everything else during render' },
    {
      kind: 'paragraph',
      text: 'Visible items, counts, whether the clear button is enabled, which empty state applies.',
    },
    { kind: 'heading', text: '4. Use updater functions where order matters' },
    {
      kind: 'paragraph',
      text: 'Any update reading the previous value takes a function, not the snapshot.',
    },
    { kind: 'heading', text: '5. Decide persistence deliberately' },
    {
      kind: 'paragraph',
      text: 'Tab in the URL, or not? Answer it on purpose, then implement that answer.',
    },
  ],

  commonMistakes: [
    {
      id: 'mistake-derived-in-state',
      mistake: 'Storing a value that can be computed from other state.',
      why: 'The copy drifts as soon as one code path updates the source without it.',
      instead: 'Compute during render; memoise only if profiling requires it.',
    },
    {
      id: 'mistake-stale-closure-state',
      mistake: 'Setting state from the current snapshot when the update depends on it.',
      why: 'The snapshot is fixed for that render, so batched updates overwrite each other.',
      instead: 'Use the updater form.',
    },
    {
      id: 'mistake-state-too-high-react',
      mistake: 'Lifting state higher than necessary.',
      why: 'Everything below re-renders and becomes coupled to a fact it does not use.',
      instead: 'Place it at the closest common owner.',
    },
    {
      id: 'mistake-props-to-state',
      mistake: 'Copying a prop into state to "initialise" it.',
      why: 'The state ignores later prop changes, producing a component displaying outdated data.',
      instead: 'Use the prop directly, or reset with a `key` when a genuine reset is intended.',
    },
  ],

  eliteConsiderations: [
    {
      kind: 'list',
      items: [
        'Name state by the fact it holds, not by the component it happens to control.',
        'Group state that always changes together into one object or a reducer.',
        'Use `useReducer` once transitions between states have rules, rather than several `useState` calls that must be kept consistent.',
        'Ask of every piece of state what should happen on refresh; the answer often moves it to the URL.',
      ],
    },
  ],

  practicalExercise: {
    id: 'exercise-07-04',
    title: 'Create interactive tabs and filters',
    prompt:
      'Build tabs and filters where every fact has one home and everything else is derived.',
    steps: [
      'List every fact the interface needs to remember.',
      'For each, identify the closest common owner and place it there.',
      'Derive counts, visible items, and empty-state selection during render.',
      'Use updater functions wherever an update reads the previous value.',
      'Decide deliberately which state belongs in the URL, and implement it.',
      'Confirm no fact is stored twice.',
      'Refresh the page and verify the result matches the decision you made.',
    ],
    successCriteria: [
      'No derived value is held in state.',
      'Each piece of state sits at its closest common owner.',
      'Updates depending on previous values use the updater form.',
      'Persistence behaviour matches a written decision.',
      'No prop is copied into state.',
    ],
    estimatedMinutes: 45,
    hint: 'If two pieces of state could ever contradict each other, one of them should not exist.',
  },

  reflectionQuestion: 'Where should state live?',
  reflectionHint: 'Move truth to the closest common owner.',

  resources: [
    {
      id: 'resource-react-state-snapshot',
      title: 'React: state as a snapshot',
      url: 'https://react.dev/learn/state-as-a-snapshot',
      type: 'documentation',
      estimatedMinutes: 20,
      note: 'Why reading state after setting it gives the old value.',
    },
    {
      id: 'resource-react-sharing-state',
      title: 'React: sharing state between components',
      url: 'https://react.dev/learn/sharing-state-between-components',
      type: 'documentation',
      estimatedMinutes: 25,
      note: 'Lifting, and what it costs.',
    },
    {
      id: 'resource-react-state-structure-07',
      title: 'React: choosing the state structure',
      url: 'https://react.dev/learn/choosing-the-state-structure',
      type: 'documentation',
      estimatedMinutes: 30,
      note: 'Avoiding duplication and contradiction in state.',
    },
  ],

  competencyTags: ['react', 'state-modelling', 'architecture'],

  completionCriteria: [
    'Has built a filterable interface with no duplicated state.',
    'Every piece of state sits at its closest common owner.',
    'Persistence behaviour matches a written decision.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Lesson 35                                                                   */
/* -------------------------------------------------------------------------- */

const LESSON_35: Lesson = {
  id: 'lesson-07-05',
  slug: 'effects-and-events',
  moduleId: MODULE_ID,
  lessonNumber: 5,
  title: 'Effects and Events',
  summary:
    'Most things that look like effects are not. An effect is for synchronising with something outside React, and very little else qualifies.',
  estimatedMinutes: 9,

  objectives: [
    'Distinguish code that belongs in an event handler from code that belongs in an effect.',
    'Recognise the derivations and cascades that should never be effects.',
    'Write an effect with correct dependencies and cleanup.',
    'Synchronise with an external system without creating a render loop.',
  ],

  prerequisiteConcepts: ['State', 'Events'],
  prerequisiteLessonIds: ['lesson-07-04', 'lesson-05-02'],

  recap: [
    {
      kind: 'paragraph',
      text: 'Rendering already reacts to state. That fact eliminates most of the reasons people reach for an effect.',
    },
  ],

  coreConcept: [
    {
      kind: 'paragraph',
      text: 'An event handler runs because a user did something specific. An effect runs because the component rendered and something it depends on changed. The distinction is causal: a handler knows what happened, an effect only knows that the world is now different.',
    },
    {
      kind: 'paragraph',
      text: 'Effects exist to synchronise with systems outside React — the DOM directly, a subscription, a timer, browser storage, a third-party widget. If nothing outside React is involved, an effect is almost certainly the wrong tool.',
    },
    {
      kind: 'list',
      items: [
        'Caused by an interaction — event handler.',
        'Computable from props or state — derive during render.',
        'Synchronising with something outside React — effect, with cleanup.',
        'Reacting to your own state change to set more state — a cascade; restructure instead.',
      ],
    },
    {
      kind: 'callout',
      tone: 'pitfall',
      body: 'An effect that sets state, triggering a render, triggering the effect, is the classic loop. If an effect ends in a setter, look for the derivation you skipped.',
    },
  ],

  firstPrinciples: [
    {
      kind: 'paragraph',
      text: 'Every effect is a second source of truth about when something happens, running after paint. Chain two of them and the interface passes through intermediate states that nobody designed — visible as a flash of the wrong content.',
    },
    {
      kind: 'paragraph',
      text: 'Deriving during render avoids that entirely: the value is correct in the same render that produced the state, so there is no intermediate frame to be seen.',
    },
  ],

  designPerspective: [
    {
      kind: 'paragraph',
      text: 'Effect-driven cascades are visible. A filter changes, an effect recalculates a count, another effect updates a summary — and for one frame the interface shows a count from the previous filter.',
    },
    {
      kind: 'paragraph',
      text: 'Users read that as the product being unsure of itself. It is not a performance problem; it is a structural one made visible.',
    },
  ],

  engineeringPerspective: [
    {
      kind: 'code',
      language: 'tsx',
      caption: 'The unnecessary effect, and the effect that is genuinely necessary.',
      code: `// Unnecessary: this is a derivation wearing an effect's clothes.
const [fullName, setFullName] = useState('');
useEffect(() => {
  setFullName(\`\${first} \${last}\`);
}, [first, last]);

// Correct: no state, no effect, no intermediate frame.
const fullName = \`\${first} \${last}\`;

// Necessary: synchronising with something outside React, with cleanup.
useEffect(() => {
  const media = window.matchMedia('(prefers-reduced-motion: reduce)');
  const onChange = () => setReducedMotion(media.matches);

  onChange();
  media.addEventListener('change', onChange);
  return () => media.removeEventListener('change', onChange);
}, []);`,
    },
    {
      kind: 'paragraph',
      text: 'Cleanup is not optional. Effects re-run when dependencies change and run again after a remount, so a subscription without cleanup accumulates listeners for the lifetime of the page.',
    },
    {
      kind: 'paragraph',
      text: 'Writing a preference to storage is a good example of the boundary: the write belongs in the event handler that changed the preference, because it was caused by an interaction. Only reading the initial value and reacting to outside changes needs an effect.',
    },
  ],

  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'Getting this boundary right is what makes an interface feel decisive. Changes appear in the frame they were caused in, rather than a frame later after a cascade settles.',
    },
    {
      kind: 'paragraph',
      text: 'It is the same quality question as the loading-flash from Module 5: perceived stability comes from not showing intermediate states nobody intended.',
    },
  ],

  industryExamples: [
    {
      id: 'example-you-might-not-need-effect',
      source: 'React documentation',
      title: 'An official page about not using the feature',
      observation:
        'The React team publishes a dedicated guide enumerating the common cases where an effect is the wrong tool.',
      takeaway:
        'Its existence is evidence of how routinely effects are used for derivations that render already handles.',
    },
    {
      id: 'example-effect-cascade-flash',
      source: 'Dashboard interfaces',
      title: 'Cascades visible as a flash',
      observation:
        'Dashboards that recompute summaries in chained effects briefly display figures from the previous filter before settling.',
      takeaway:
        'The user sees hesitation. The cause is structural, and no amount of optimisation removes it.',
    },
  ],

  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Persisting one preference without turning calculations into effects.',
    },
    { kind: 'heading', text: '1. Identify what is outside React' },
    {
      kind: 'paragraph',
      text: 'Storage is. The preference value itself is not.',
    },
    { kind: 'heading', text: '2. Write on interaction' },
    {
      kind: 'paragraph',
      text: 'The handler that changes the preference also writes it. The cause is the interaction, so the handler is the right place.',
    },
    { kind: 'heading', text: '3. Read once, at initialisation' },
    {
      kind: 'paragraph',
      text: 'Lazy initial state reads storage once, rather than an effect that runs after the first paint and causes a flash.',
    },
    { kind: 'heading', text: '4. Use an effect only for outside changes' },
    {
      kind: 'paragraph',
      text: 'Another tab changing the value, or the system preference changing, is a genuine synchronisation. With cleanup.',
    },
    { kind: 'heading', text: '5. Audit every remaining effect' },
    {
      kind: 'paragraph',
      text: 'For each, name the external system it synchronises with. If you cannot, it is a derivation or a handler in disguise.',
    },
  ],

  commonMistakes: [
    {
      id: 'mistake-effect-for-derived',
      mistake: 'Using an effect to compute a value from props or state.',
      why: 'It adds a render, an intermediate frame, and a second copy that can be stale.',
      instead: 'Compute during render.',
    },
    {
      id: 'mistake-effect-for-events',
      mistake: 'Using an effect to respond to a user action.',
      why: 'The effect cannot know which interaction caused it, so it fires in cases you did not intend.',
      instead: 'Put the logic in the event handler, where the cause is known.',
    },
    {
      id: 'mistake-missing-cleanup',
      mistake: 'Subscribing without returning a cleanup function.',
      why: 'Subscriptions accumulate across re-runs and remounts, leaking memory and firing repeatedly.',
      instead: 'Return a cleanup from every effect that subscribes, times, or observes.',
    },
    {
      id: 'mistake-lying-dependencies',
      mistake: 'Removing a dependency to stop an effect re-running.',
      why: 'The effect then reads stale values and produces bugs that only appear after a specific sequence of changes.',
      instead: 'Fix the structure — move the value, use an updater, or extract a stable function.',
    },
  ],

  eliteConsiderations: [
    {
      kind: 'list',
      items: [
        'Give every effect a one-line comment naming the external system it synchronises with; effects that cannot be described this way should be removed.',
        'Prefer lazy initial state over an effect that reads storage after the first paint.',
        'Extract genuine synchronisations into named custom hooks so the intent survives.',
        'Treat any effect whose body ends in a state setter as a code smell requiring justification.',
      ],
    },
  ],

  practicalExercise: {
    id: 'exercise-07-05',
    title: 'Persist one preference without misusing effects',
    prompt:
      'Persist a user preference, keeping every derivation out of effects.',
    steps: [
      'Choose a preference — theme, density, or default filter.',
      'Read the stored value with lazy initial state, not an effect.',
      'Write the value in the event handler that changes it.',
      'Add an effect only for genuine outside changes, with cleanup.',
      'Audit every other effect in the component and name its external system.',
      'Remove or restructure every effect that fails that test.',
      'Verify no visible flash occurs on first paint or when the preference changes.',
    ],
    successCriteria: [
      'No effect computes a value derivable during render.',
      'The write happens in the handler, not in an effect.',
      'Every remaining effect names its external system and has cleanup where needed.',
      'No flash of the wrong value on load or on change.',
      'No effect body ends in a state setter without a written justification.',
    ],
    estimatedMinutes: 45,
    hint: 'Ask what caused the change. If the answer is a user action, the code belongs in the handler.',
  },

  reflectionQuestion: 'Does every reaction to state require `useEffect`?',
  reflectionHint: 'Rendering already reacts.',

  resources: [
    {
      id: 'resource-react-you-might-not-need',
      title: 'You might not need an effect',
      url: 'https://react.dev/learn/you-might-not-need-an-effect',
      type: 'documentation',
      estimatedMinutes: 35,
      note: 'The definitive list of cases where an effect is the wrong tool.',
    },
    {
      id: 'resource-react-synchronizing',
      title: 'React: synchronizing with effects',
      url: 'https://react.dev/learn/synchronizing-with-effects',
      type: 'documentation',
      estimatedMinutes: 30,
      note: 'What effects are actually for, including cleanup.',
    },
    {
      id: 'resource-react-separating-events',
      title: 'React: separating events from effects',
      url: 'https://react.dev/learn/separating-events-from-effects',
      type: 'documentation',
      estimatedMinutes: 30,
      note: 'The causal distinction, worked through carefully.',
    },
  ],

  competencyTags: ['javascript', 'react', 'state-modelling', 'performance'],

  completionCriteria: [
    'Has persisted a preference without using an effect for derivation.',
    'Every remaining effect names an external system.',
    'No visible flash on load or change.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Project                                                                     */
/* -------------------------------------------------------------------------- */

const PROJECT: ModuleProject = {
  id: 'project-07',
  slug: 'project-management-interface',
  moduleId: MODULE_ID,
  title: 'Project Management Interface',
  brief:
    'Build a project management interface with a list, filters, a detail panel, editable states, responsive layout, and reusable components.',
  problem:
    'A list-plus-detail interface is where state placement stops being theoretical. The list and the detail panel must agree about what is selected, filters must survive interaction with the detail, edits must be reflected in the list without a second copy of the data, and the whole thing has to collapse to a single column on a phone without losing its place. Every one of those is a decision about where a fact lives.',
  objectives: [
    'Place every piece of state at its correct owner.',
    'Build components whose APIs are readable from their call sites.',
    'Render every state — loading, empty, no-matches, error, populated.',
    'Handle editing without duplicating the source of truth.',
  ],
  requirements: [
    'A project list rendered from structured data with stable identity keys.',
    'Filters and search that affect the list and its counts consistently.',
    'A detail panel showing the selected project.',
    'Editable fields with saving, saved, and failed states.',
    'Responsive layout: two panes on desktop, one at a time on mobile.',
    'Reusable components with documented props.',
  ],
  constraints: [
    'No component library; build the components you need.',
    'No derived value may be stored in state.',
    'Every effect must name the external system it synchronises with.',
    'Selection and filters must survive a page refresh.',
  ],
  suggestedScope:
    'Local data only, with simulated latency for saves. No backend, no authentication, no real persistence layer beyond browser storage and the URL.',
  deliverables: [
    'The working interface across desktop and mobile widths.',
    'A short document recording where each piece of state lives and why.',
    'Component documentation: props, states, and usage examples.',
    'A list of every effect with the external system it synchronises with.',
  ],
  completionCriteria: [
    'Selection and filters survive a refresh and can be shared as a link.',
    'No fact is stored in two places, and no derived value sits in state.',
    'Every render branch — loading, empty, no-matches, error, populated — is designed.',
    'Per-item state survives sorting and deletion, proving identity keys are correct.',
    'The mobile layout is navigable without losing the selected project.',
  ],
  portfolioEvidence: [
    'React component decomposition',
    'State ownership decisions',
    'Prop API design',
    'Responsive list and detail layout',
    'Complete state coverage including edit failures',
  ],
  reflectionQuestion:
    'Which piece of state was hardest to place, and what did the difficulty tell you about the component boundaries?',
  estimatedHours: 18,
  competencies: [
    'responsive-design',
    'react',
    'state-modelling',
    'component-architecture',
    'interface-state-modelling',
  ],
  stretchGoals: [
    'Add optimistic editing with rollback on failure, and decide which fields deserve it.',
    'Add keyboard navigation through the list with the detail panel following selection.',
  ],
};

/* -------------------------------------------------------------------------- */

export const MODULE_07: CurriculumModule = {
  id: MODULE_ID,
  slug: 'react-foundations',
  moduleNumber: 7,
  phase: 'systems',
  title: 'React Foundations',
  description:
    'Components as boundaries, props as an API, rendering as a function of state, and the narrow set of cases that genuinely need an effect.',
  outcome: 'Can build interfaces from composable, well-bounded components.',
  prerequisites: [
    'Modules 1 to 6, or equivalent',
    'Comfortable with JavaScript and TypeScript fundamentals',
  ],
  lessons: [LESSON_31, LESSON_32, LESSON_33, LESSON_34, LESSON_35],
  resources: [
    {
      id: 'resource-module-07-react-learn',
      title: 'React: learn',
      url: 'https://react.dev/learn',
      type: 'documentation',
      estimatedMinutes: 300,
      note: 'The official guide; this module follows its ordering closely.',
    },
    {
      id: 'resource-module-07-thinking-in-react',
      title: 'Thinking in React',
      url: 'https://react.dev/learn/thinking-in-react',
      type: 'documentation',
      estimatedMinutes: 30,
      note: 'Decomposition and state placement on one worked example.',
    },
    {
      id: 'resource-module-07-escape-hatches',
      title: 'React: escape hatches',
      url: 'https://react.dev/learn/escape-hatches',
      type: 'documentation',
      estimatedMinutes: 90,
      note: 'Refs and effects, and the care each requires.',
    },
  ],
  project: PROJECT,
  competencies: [
    'responsive-design',
    'javascript',
    'typescript',
    'react',
    'state-modelling',
    'component-architecture',
    'performance',
    'architecture',
    'interface-state-modelling',
    'component-api-design',
  ],
  completionCriteria: [
    'All five lessons completed.',
    'Module project marked completed.',
    'Can build a multi-state interface from composed components.',
  ],
};
