/**
 * Module 08 — Component Architecture.
 *
 * Boundaries, APIs, variants, composition, and state ownership: the decisions
 * that determine whether a component set stays usable past its first twenty
 * components.
 */

import type { CurriculumModule, Lesson, ModuleProject } from '@/types/curriculum';

const MODULE_ID = 'module-08';

/* -------------------------------------------------------------------------- */
/* Lesson 36                                                                   */
/* -------------------------------------------------------------------------- */

const LESSON_36: Lesson = {
  id: 'lesson-08-01',
  slug: 'component-boundaries',
  moduleId: MODULE_ID,
  lessonNumber: 1,
  title: 'Component Boundaries',
  summary:
    'The right boundary separates things that change for different reasons. Visual containers are a hint, not an answer.',
  estimatedMinutes: 9,

  objectives: [
    'Use change frequency and reason as the primary boundary test.',
    'Judge cohesion — whether everything inside a component belongs to one job.',
    'Separate components that fetch or own data from components that render it.',
    'Refactor a large component without inventing the wrong abstraction.',
  ],

  prerequisiteConcepts: ['Components', 'State placement'],
  prerequisiteLessonIds: ['lesson-07-01', 'lesson-07-04'],

  recap: [
    {
      kind: 'paragraph',
      text: 'Module 7 introduced boundaries. This module treats them as the central architectural decision, because everything else follows from where they are drawn.',
    },
  ],

  coreConcept: [
    {
      kind: 'paragraph',
      text: 'Cohesion is the measure of whether everything inside a component serves one job. A component with high cohesion can be described in a sentence with no "and"; one with low cohesion has several unrelated concerns sharing a file because they happened to appear on the same screen.',
    },
    {
      kind: 'paragraph',
      text: 'Change frequency is the most practical test available. Code that changes for the same reason belongs together; code that changes for different reasons belongs apart. A component containing both the filter logic and the row rendering will be edited for two unrelated reasons, and each edit risks the other.',
    },
    {
      kind: 'list',
      items: [
        'One job, describable without "and".',
        'One reason to change.',
        'A name that would make sense to someone who has not seen the screen.',
        'A prop list that stays short without effort.',
      ],
    },
    {
      kind: 'callout',
      tone: 'insight',
      body: 'A rectangle on screen is a hint about a boundary. It is not evidence.',
    },
  ],

  firstPrinciples: [
    {
      kind: 'paragraph',
      text: 'The cost of a wrong boundary is asymmetric. Splitting a component later is mechanical. Unwinding an abstraction that two callers have already bent to their needs means understanding both, separating them, and verifying neither regressed.',
    },
    {
      kind: 'paragraph',
      text: 'That asymmetry argues for waiting. Duplication is visible and cheap to fix; a wrong abstraction is invisible and expensive, because it looks like the thing you are supposed to have.',
    },
  ],

  designPerspective: [
    {
      kind: 'paragraph',
      text: 'Designers group by visual proximity, because that is how the eye works. Engineers group by reason to change. These agree often enough that the disagreements are informative: they usually mark a place where one visual group is doing two jobs.',
    },
    {
      kind: 'paragraph',
      text: 'A row containing content, a status, and a set of actions looks like one thing. It changes for three reasons, and once actions start varying by row type that becomes obvious in the code long before it becomes obvious in the file.',
    },
  ],

  engineeringPerspective: [
    {
      kind: 'code',
      language: 'tsx',
      caption: 'One component doing three jobs, and the split.',
      code: `// Changes when: the query API changes, filtering rules change,
// row layout changes, or empty-state copy changes. Four reasons, one file.
function ProjectsPage() { /* fetching + filtering + rows + empty state */ }

// Each changes for one reason.
function ProjectsPage() {              // composition only
  const { projects, status } = useProjects();
  return <ProjectsView projects={projects} status={status} />;
}

function ProjectsView({ projects, status }: ProjectsViewProps) {
  // owns filter state; changes when filtering rules change
}

function ProjectRow({ project }: { project: Project }) {
  // changes when row layout changes
}`,
    },
    {
      kind: 'paragraph',
      text: 'Separating data ownership from rendering is the single highest-return split. A presentational component that takes data as props can be rendered in any state — loading, empty, error — without a network, which makes every one of those states testable and reviewable.',
    },
  ],

  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'When boundaries follow responsibilities, a design change usually touches one component. When they follow rectangles, a design change touches whichever components happened to contain those pixels.',
    },
    {
      kind: 'paragraph',
      text: 'The symptom of bad boundaries is a small visual change requiring edits in five files. That is a structural cost being paid by the design process.',
    },
  ],

  industryExamples: [
    {
      id: 'example-container-presentational',
      source: 'React architecture practice',
      title: 'Separating data from presentation',
      observation:
        'The pattern of keeping data-owning components separate from rendering components has persisted through several generations of React idioms, in different forms.',
      takeaway:
        'The specific implementation changes; the reason — different rates of change — does not.',
    },
    {
      id: 'example-wrong-abstraction',
      source: 'Refactoring practice',
      title: 'Duplication cheaper than the wrong abstraction',
      observation:
        'Experienced teams routinely inline a shared component back into its callers when it has accumulated flags for divergent cases.',
      takeaway:
        'Un-abstracting is a legitimate refactor, and recognising when it is needed is a senior skill.',
    },
  ],

  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Refactoring a large page component.',
    },
    { kind: 'heading', text: '1. Annotate reasons to change' },
    {
      kind: 'paragraph',
      text: 'Read the component and write, beside each region, what would cause it to change. The clusters are the candidate boundaries.',
    },
    { kind: 'heading', text: '2. Extract data ownership first' },
    {
      kind: 'paragraph',
      text: 'Pull fetching and caching into a hook. The rest becomes renderable with any data you like, including none.',
    },
    { kind: 'heading', text: '3. Extract leaves before branches' },
    {
      kind: 'paragraph',
      text: 'Rows and cells before containers. Small, obvious extractions first make the larger structure visible.',
    },
    { kind: 'heading', text: '4. Check each prop list' },
    {
      kind: 'paragraph',
      text: 'A long list right after extraction means the cut went through a responsibility rather than between two.',
    },
    { kind: 'heading', text: '5. Leave the coincidences' },
    {
      kind: 'paragraph',
      text: 'Two regions that merely resemble each other stay separate. Note them and revisit when a third appears.',
    },
    { kind: 'heading', text: '6. Verify behaviour is unchanged' },
    {
      kind: 'paragraph',
      text: 'A refactor that changes behaviour is not a refactor. Check every state before and after.',
    },
  ],

  commonMistakes: [
    {
      id: 'mistake-boundaries-by-rectangle',
      mistake: 'Drawing boundaries around visual containers.',
      why: 'A container can hold several responsibilities, so it will be edited for unrelated reasons and each edit risks the others.',
      instead: 'Draw them around reasons to change.',
    },
    {
      id: 'mistake-data-and-render-together',
      mistake: 'Fetching data inside the component that renders it.',
      why: 'The component cannot be rendered in any state without a network, so loading, empty, and error become untestable.',
      instead: 'Own data in a hook or parent; render from props.',
    },
    {
      id: 'mistake-refactor-changes-behaviour',
      mistake: 'Improving behaviour during a structural refactor.',
      why: 'When something breaks, you cannot tell whether the structure or the improvement caused it.',
      instead: 'Refactor, verify, then change behaviour separately.',
    },
    {
      id: 'mistake-premature-shared-component',
      mistake: 'Extracting a shared component at the second occurrence.',
      why: 'Two occurrences might be a coincidence, and the abstraction will grow flags as they diverge.',
      instead: 'Wait for the third, and for the requirement to look stable.',
    },
  ],

  eliteConsiderations: [
    {
      kind: 'list',
      items: [
        'Write the one-sentence description of each component in a comment; if it needs "and", the boundary is wrong.',
        'Keep presentational components free of data fetching so every state can be rendered on demand.',
        'Treat "this change touched five files" as a signal to examine the boundaries, not the change.',
        'Be willing to inline a shared component back into its callers when it has accumulated divergence flags.',
      ],
    },
  ],

  practicalExercise: {
    id: 'exercise-08-01',
    title: 'Refactor a large page component',
    prompt:
      'Take a large component and split it along reasons to change, without altering behaviour.',
    steps: [
      'Record the current behaviour in every state before touching anything.',
      'Annotate each region with what would cause it to change.',
      'Extract data ownership into a hook first.',
      'Extract leaf components before container components.',
      'Write a one-sentence description for each new component.',
      'Revisit any boundary producing an unexplained long prop list.',
      'Identify one duplication you deliberately kept, and write down why.',
      'Verify every state behaves exactly as recorded at the start.',
    ],
    successCriteria: [
      'Each component has a one-sentence description with no "and".',
      'Data ownership is separated from rendering.',
      'Behaviour is identical in every state before and after.',
      'At least one deliberate duplication is documented.',
      'No component was extracted purely because two regions looked alike.',
    ],
    estimatedMinutes: 50,
    hint: 'Write down what would make each region change. Regions with different answers belong in different components.',
  },

  reflectionQuestion: 'Should boundaries follow visual boxes?',
  reflectionHint: 'Behaviour often matters more than rectangles.',

  resources: [
    {
      id: 'resource-react-extracting',
      title: 'React: extracting state logic into a reducer',
      url: 'https://react.dev/learn/extracting-state-logic-into-a-reducer',
      type: 'documentation',
      estimatedMinutes: 30,
      note: 'One concrete form of separating a responsibility from its rendering.',
    },
    {
      id: 'resource-wrong-abstraction',
      title: 'The wrong abstraction',
      url: 'https://sandimetz.com/blog/2016/1/20/the-wrong-abstraction',
      type: 'article',
      author: 'Sandi Metz',
      estimatedMinutes: 15,
      note: 'Why duplication is cheaper than a premature abstraction.',
    },
  ],

  competencyTags: ['critique', 'react', 'component-architecture', 'architecture'],

  completionCriteria: [
    'Has refactored a large component without changing behaviour.',
    'Every component has a one-sentence description.',
    'One deliberate duplication is documented.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Lesson 37                                                                   */
/* -------------------------------------------------------------------------- */

const LESSON_37: Lesson = {
  id: 'lesson-08-02',
  slug: 'component-apis',
  moduleId: MODULE_ID,
  lessonNumber: 2,
  title: 'Component APIs',
  summary:
    'An API is obvious when it can be used correctly without reading the implementation. Controlled versus uncontrolled is the decision people get wrong most often.',
  estimatedMinutes: 9,

  objectives: [
    'Design an API from its call sites before implementing it.',
    'Choose between controlled, uncontrolled, and both, and justify it.',
    'Set defaults that do not hide decisions.',
    'Keep implementation details out of the public surface.',
  ],

  prerequisiteConcepts: ['Props', 'Component boundaries'],
  prerequisiteLessonIds: ['lesson-08-01', 'lesson-07-02'],

  recap: [
    {
      kind: 'paragraph',
      text: 'The boundary decides what a component is. The API decides whether anyone can use it without reading it.',
    },
  ],

  coreConcept: [
    {
      kind: 'paragraph',
      text: 'An uncontrolled component owns its own state; you set an initial value and it manages the rest. A controlled component holds no state; the value comes in as a prop and every change is reported through a callback.',
    },
    {
      kind: 'list',
      items: [
        'Uncontrolled — simple call sites, no wiring, but the parent cannot influence the value.',
        'Controlled — the parent owns the value and can validate, transform, or synchronise it.',
        'Both — `value`/`onChange` when supplied, `defaultValue` otherwise. More implementation, easiest adoption.',
      ],
    },
    {
      kind: 'paragraph',
      text: 'The deciding question is whether anything outside the component ever needs to know or change the value. A dropdown whose selection filters a list is controlled. A disclosure that only expands itself is uncontrolled, and making it controlled adds wiring at every call site for no benefit.',
    },
    {
      kind: 'callout',
      tone: 'insight',
      body: 'An obvious API is one where the wrong usage is hard to express and the right usage needs no documentation.',
    },
  ],

  firstPrinciples: [
    {
      kind: 'paragraph',
      text: 'Every detail exposed in an API becomes a promise. A `wrapperClassName` prop freezes the existence of a wrapper element; removing it later breaks callers who styled through it, even though it was never part of what the component means.',
    },
    {
      kind: 'paragraph',
      text: 'So the surface should describe intent — variant, tone, density, state — and nothing about how the intent is achieved. Intent is stable; structure is not.',
    },
  ],

  designPerspective: [
    {
      kind: 'paragraph',
      text: 'Designing the API before implementing is the same discipline as defining a component in a design file before drawing screens with it. Both force the question of what varies and what is fixed.',
    },
    {
      kind: 'paragraph',
      text: 'An API that resists a requested screen is information: either the screen is inconsistent with the system, or the system missed a real case. Both are worth knowing before the code exists.',
    },
  ],

  engineeringPerspective: [
    {
      kind: 'code',
      language: 'tsx',
      caption: 'Supporting both modes without two components.',
      code: `interface SelectProps<T> {
  options: ReadonlyArray<{ value: T; label: string; disabled?: boolean }>;
  /** Controlled value. Supply with onChange, or use defaultValue instead. */
  value?: T;
  /** Uncontrolled initial value. Ignored when value is supplied. */
  defaultValue?: T;
  onChange?: (value: T) => void;
  /** Shown when nothing is selected. */
  placeholder?: string;
  disabled?: boolean;
  /** Associates the control with its label for assistive technology. */
  label: string;
}

function Select<T>({ value, defaultValue, onChange, ...rest }: SelectProps<T>) {
  const [internal, setInternal] = useState(defaultValue);
  const isControlled = value !== undefined;
  const current = isControlled ? value : internal;

  const select = (next: T) => {
    if (!isControlled) setInternal(next);
    onChange?.(next);   // reported in both modes
  };
  // ...
}`,
    },
    {
      kind: 'paragraph',
      text: 'Two details matter. The change is reported in both modes, because the parent may want to know even when it does not own the value. And `label` is required rather than optional — a control that can be built without an accessible name will be.',
    },
  ],

  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'Required props are where a system enforces its non-negotiables. Making `label` required means no consumer can ship an unlabelled control, which is a stronger guarantee than any guideline document.',
    },
    {
      kind: 'paragraph',
      text: 'The general form: anything the system considers mandatory should be a required prop, not advice in documentation nobody reads at the moment of use.',
    },
  ],

  industryExamples: [
    {
      id: 'example-controlled-uncontrolled-react',
      source: 'React form controls',
      title: 'Both modes, one component',
      observation:
        'Native inputs support both `value` and `defaultValue`, and well-built libraries follow that convention so adoption is incremental.',
      takeaway:
        'Supporting both costs implementation effort once and saves wiring at every call site.',
    },
    {
      id: 'example-required-accessible-name',
      source: 'Accessible component libraries',
      title: 'Accessibility enforced by the type',
      observation:
        'Libraries with strong accessibility records make the accessible name a required prop rather than a documented recommendation.',
      takeaway:
        'The compiler is a more reliable reviewer than a guideline.',
    },
  ],

  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Designing a Select API before implementing it.',
    },
    { kind: 'heading', text: '1. Write six call sites' },
    {
      kind: 'paragraph',
      text: 'Simple, controlled, disabled, with a placeholder, with disabled options, inside a form. Before any implementation.',
    },
    { kind: 'heading', text: '2. Decide the control mode' },
    {
      kind: 'paragraph',
      text: 'Does anything outside need the value? If sometimes, support both — and write down which mode each call site uses.',
    },
    { kind: 'heading', text: '3. Mark what is genuinely required' },
    {
      kind: 'paragraph',
      text: 'The accessible name is required. So are the options. Everything else earns optionality.',
    },
    { kind: 'heading', text: '4. Remove implementation leaks' },
    {
      kind: 'paragraph',
      text: 'No `menuClassName`, no `portalTarget`, no `innerRef` unless there is a specific documented need.',
    },
    { kind: 'heading', text: '5. Have the API read cold' },
    {
      kind: 'paragraph',
      text: 'Give someone the type and the call sites only. Every question they ask is a place the API is not obvious.',
    },
    { kind: 'heading', text: '6. Implement last' },
    {
      kind: 'paragraph',
      text: 'The API is the design work. The implementation serves it, not the reverse.',
    },
  ],

  commonMistakes: [
    {
      id: 'mistake-mode-switching',
      mistake: 'Allowing a component to switch between controlled and uncontrolled at runtime.',
      why: 'The value jumps when `value` becomes undefined, and React warns because the behaviour is genuinely ambiguous.',
      instead: 'Fix the mode on first render and document it.',
    },
    {
      id: 'mistake-defaults-hide-decisions',
      mistake: 'Giving every prop a default.',
      why: 'A default is a decision made on the consumer\'s behalf, and the ones that matter get made silently.',
      instead: 'Require what must be decided; default only what is genuinely incidental.',
    },
    {
      id: 'mistake-api-leaks-structure',
      mistake: 'Exposing class names or refs for internal elements.',
      why: 'The internal structure becomes part of the contract and can never be changed.',
      instead: 'Expose intent-level props and keep structure private.',
    },
    {
      id: 'mistake-implementation-first',
      mistake: 'Building the component first and extracting the API afterwards.',
      why: 'The API ends up shaped by the implementation rather than by how it will be used.',
      instead: 'Write the call sites first.',
    },
  ],

  eliteConsiderations: [
    {
      kind: 'list',
      items: [
        'Report changes through the callback in both modes; the parent may care without owning.',
        'Use generics so a Select over a typed union returns that union, not a string.',
        'Make accessibility-critical props required — a name, a label, an association.',
        'Keep naming identical across the library; a consumer should be able to guess the prop name correctly.',
      ],
    },
  ],

  practicalExercise: {
    id: 'exercise-08-02',
    title: 'Design a Select API before implementing it',
    prompt:
      'Design the complete API for a Select component, then implement it against that design.',
    steps: [
      'Write six realistic call sites before any implementation.',
      'Decide whether to support controlled, uncontrolled, or both, and write down why.',
      'Mark every prop as required or optional, justifying each required one.',
      'Remove anything that exposes internal structure.',
      'Type the options so the selected value carries the option type.',
      'Give the type and call sites to someone cold, and record their questions.',
      'Fix the API where questions arose, then implement it.',
    ],
    successCriteria: [
      'Six call sites were written before implementation.',
      'The control mode is a documented decision.',
      'The accessible name is required.',
      'No prop exposes internal class names, refs, or structure.',
      'A record of cold-read questions exists, and each was addressed.',
    ],
    estimatedMinutes: 50,
    hint: 'If explaining a prop requires explaining how the component works inside, that prop is in the wrong place.',
  },

  reflectionQuestion: 'What makes an API feel obvious?',
  reflectionHint: 'The implementation should not leak into usage.',

  resources: [
    {
      id: 'resource-react-controlled',
      title: 'React: sharing state between components',
      url: 'https://react.dev/learn/sharing-state-between-components#controlled-and-uncontrolled-components',
      type: 'documentation',
      estimatedMinutes: 15,
      note: 'The controlled and uncontrolled distinction, with the trade-off stated.',
    },
    {
      id: 'resource-apg-listbox',
      title: 'ARIA Authoring Practices: listbox',
      url: 'https://www.w3.org/WAI/ARIA/apg/patterns/listbox/',
      type: 'specification',
      estimatedMinutes: 30,
      note: 'The behaviour a Select owes its users, before any API decisions.',
    },
  ],

  competencyTags: ['accessibility', 'component-architecture', 'component-api-design'],

  completionCriteria: [
    'Has designed a complete API before implementing.',
    'The control mode decision is documented.',
    'Cold-read questions were collected and addressed.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Lesson 38                                                                   */
/* -------------------------------------------------------------------------- */

const LESSON_38: Lesson = {
  id: 'lesson-08-03',
  slug: 'variants',
  moduleId: MODULE_ID,
  lessonNumber: 3,
  title: 'Variants',
  summary:
    'Variants are the finite set of forms a component may take. Expressed as booleans they multiply; expressed as dimensions they stay countable.',
  estimatedMinutes: 9,

  objectives: [
    'Separate visual variants from behavioural ones.',
    'Model variants as independent dimensions rather than flags.',
    'Count the combination space and keep it small enough to design.',
    'Decide when a requested variant is actually an inconsistency.',
  ],

  prerequisiteConcepts: ['Component APIs', 'Literal unions'],
  prerequisiteLessonIds: ['lesson-08-02', 'lesson-06-02'],

  recap: [
    {
      kind: 'paragraph',
      text: 'The API says what a component accepts. Variants are where that surface either stays finite or quietly becomes exponential.',
    },
  ],

  coreConcept: [
    {
      kind: 'paragraph',
      text: 'A visual variant changes appearance while behaviour stays identical — a quiet button still activates on Enter. A behavioural variant changes what the component does, and is usually a different component wearing the same name.',
    },
    {
      kind: 'paragraph',
      text: 'The useful model is independent dimensions, each a closed set: tone, size, density, and state. The total number of forms is the product of the dimensions, which is a number you can write down and design.',
    },
    {
      kind: 'list',
      items: [
        'tone: primary | secondary | quiet | danger',
        'size: small | medium | large',
        'state: default | hover | focus | active | disabled | loading',
        'Everything else is a slot, not a variant.',
      ],
    },
    {
      kind: 'callout',
      tone: 'warning',
      body: 'Ten boolean props describe 1,024 combinations. No one has designed 1,024 buttons, but every one of them is reachable from a call site.',
    },
  ],

  firstPrinciples: [
    {
      kind: 'paragraph',
      text: 'Booleans are independent by construction, so `isPrimary` and `isDanger` can both be true and something must decide what that means. Usually the decision is accidental — whichever class the cascade applied last.',
    },
    {
      kind: 'paragraph',
      text: 'A union makes exclusivity structural. `tone: \'primary\' | \'danger\'` cannot be both, so the contradiction is unrepresentable rather than merely discouraged. This is the Module 6 argument applied to appearance.',
    },
  ],

  designPerspective: [
    {
      kind: 'paragraph',
      text: 'Variant sprawl is a design problem before it is an engineering one. Six button tones usually means six screens each invented one, and the code is just where the evidence accumulated.',
    },
    {
      kind: 'paragraph',
      text: 'The productive response to a new variant request is a question: is this a genuinely new meaning, or is this screen inconsistent with the others? Often the answer removes the request.',
    },
  ],

  engineeringPerspective: [
    {
      kind: 'code',
      language: 'tsx',
      caption: 'Flags multiply; dimensions stay countable.',
      code: `// 6 booleans = 64 combinations, most undesigned and all reachable.
interface BadButtonProps {
  isPrimary?: boolean; isSecondary?: boolean; isDanger?: boolean;
  isLarge?: boolean; isSmall?: boolean; isQuiet?: boolean;
}

// 4 tones x 3 sizes = 12 forms, plus states. A designable number.
interface ButtonProps {
  tone?: 'primary' | 'secondary' | 'quiet' | 'danger';
  size?: 'small' | 'medium' | 'large';
  /** Shows a spinner and blocks activation; still focusable, unlike disabled. */
  loading?: boolean;
  disabled?: boolean;
  /** Content before the label — an icon, not arbitrary layout. */
  leading?: React.ReactNode;
}`,
    },
    {
      kind: 'paragraph',
      text: '`loading` and `disabled` stay separate because they mean different things: loading is temporary and should keep focus so a screen reader user is not dropped, while disabled removes the control from the tab order entirely.',
    },
  ],

  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'Variant dimensions map directly onto Figma component properties. When the dimensions match, a designer selecting a variant and an engineer typing a prop are performing the same action in two tools.',
    },
    {
      kind: 'paragraph',
      text: 'When they diverge, someone is building variants that do not exist in the other environment — which is how a design system starts describing two different products.',
    },
  ],

  industryExamples: [
    {
      id: 'example-variant-dimensions',
      source: 'Established button APIs',
      title: 'Two or three dimensions, not ten flags',
      observation:
        'Long-lived component libraries converge on a small number of orthogonal variant dimensions rather than a growing list of booleans.',
      takeaway:
        'Convergence across independent teams is evidence the constraint is doing real work.',
    },
    {
      id: 'example-loading-vs-disabled',
      source: 'Accessible form controls',
      title: 'Loading kept distinct from disabled',
      observation:
        'Careful implementations keep a loading button focusable and announce the busy state, rather than disabling it and dropping focus.',
      takeaway:
        'Collapsing the two states into one flag loses a real accessibility distinction.',
    },
  ],

  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Building a scalable Button API.',
    },
    { kind: 'heading', text: '1. Inventory the buttons that exist' },
    {
      kind: 'paragraph',
      text: 'Every distinct button across the product. The count is the argument for what follows.',
    },
    { kind: 'heading', text: '2. Sort into dimensions' },
    {
      kind: 'paragraph',
      text: 'Tone, size, state. Anything that fits none of these is either a slot or a different component.',
    },
    { kind: 'heading', text: '3. Collapse the near-duplicates' },
    {
      kind: 'paragraph',
      text: 'Two tones differing only by a shade are one tone applied inconsistently. Decide which is correct.',
    },
    { kind: 'heading', text: '4. Multiply and check' },
    {
      kind: 'paragraph',
      text: 'Tones times sizes times states. If the number is unmanageable, a dimension is doing too much.',
    },
    { kind: 'heading', text: '5. Separate the states that mean different things' },
    {
      kind: 'paragraph',
      text: 'Loading is not disabled. Keep them as separate props with separate behaviour.',
    },
    { kind: 'heading', text: '6. Render the full matrix' },
    {
      kind: 'paragraph',
      text: 'Every combination on one page. This is where the undesigned ones become visible.',
    },
  ],

  commonMistakes: [
    {
      id: 'mistake-boolean-variants',
      mistake: 'One boolean prop per visual style.',
      why: 'Mutually exclusive options become independently settable, and the contradictions resolve by accident.',
      instead: 'One `tone` prop with a closed set of values.',
    },
    {
      id: 'mistake-variant-for-layout',
      mistake: 'Adding a variant to change layout or content structure.',
      why: 'Structure is unbounded, so the variant list becomes a list of every screen the component appears on.',
      instead: 'Use slots for structure and keep variants for appearance.',
    },
    {
      id: 'mistake-disabled-for-loading',
      mistake: 'Using `disabled` to express a pending action.',
      why: 'The control leaves the tab order, focus is lost, and nothing announces that work is in progress.',
      instead: 'Use a separate loading state that stays focusable and announces itself.',
    },
    {
      id: 'mistake-variant-per-request',
      mistake: 'Adding a variant whenever one is requested.',
      why: 'Each addition multiplies the matrix and usually encodes an inconsistency permanently.',
      instead: 'Ask whether the request is a new meaning or a screen that drifted.',
    },
  ],

  eliteConsiderations: [
    {
      kind: 'list',
      items: [
        'Maintain a page rendering every variant and state combination; it is the cheapest review tool a system has.',
        'Keep dimensions orthogonal — if size changes tone, they are not two dimensions.',
        'Express variants as data attributes so CSS can style them without prop-to-class mapping logic.',
        'Record the meaning of each tone in words; undocumented tones get chosen by appearance.',
      ],
    },
  ],

  practicalExercise: {
    id: 'exercise-08-03',
    title: 'Create a scalable Button API',
    prompt:
      'Design a Button API that covers the real range of buttons without a combinatorial explosion.',
    steps: [
      'Inventory every distinct button in an existing interface and count them.',
      'Sort them into independent dimensions.',
      'Collapse near-duplicates and record each decision.',
      'Multiply the dimensions and write down the total number of forms.',
      'Keep loading and disabled as separate props with different behaviour.',
      'Move anything structural into slots.',
      'Build a page rendering every combination, and review it.',
      'Write one line describing the meaning of each tone.',
    ],
    successCriteria: [
      'No two variant props are mutually exclusive booleans.',
      'The total number of forms is written down and manageable.',
      'Loading and disabled behave differently, with focus preserved when loading.',
      'Every combination is rendered on a review page.',
      'Each tone has a written meaning.',
    ],
    estimatedMinutes: 50,
    hint: 'Count the combinations before writing the props. The number usually settles the argument.',
  },

  reflectionQuestion: 'Why can ten boolean props become dangerous?',
  reflectionHint: 'Count possible combinations.',

  resources: [
    {
      id: 'resource-primer-button',
      title: 'Primer: button',
      url: 'https://primer.style/components/button',
      type: 'documentation',
      estimatedMinutes: 20,
      note: 'A large system\'s button variants, with the meaning of each stated.',
    },
    {
      id: 'resource-figma-variants',
      title: 'Figma: create and use variants',
      url: 'https://help.figma.com/hc/en-us/articles/360056440594-Create-and-use-variants',
      type: 'documentation',
      estimatedMinutes: 20,
      note: 'Variant properties, which are the same dimensions in the other tool.',
    },
  ],

  competencyTags: [
    'accessibility',
    'design-systems',
    'component-api-design',
    'design-systems-implementation',
  ],

  completionCriteria: [
    'Has designed a variant API with orthogonal dimensions.',
    'The combination count is written down.',
    'Every combination is rendered on a review page.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Lesson 39                                                                   */
/* -------------------------------------------------------------------------- */

const LESSON_39: Lesson = {
  id: 'lesson-08-04',
  slug: 'composition',
  moduleId: MODULE_ID,
  lessonNumber: 4,
  title: 'Composition',
  summary:
    'Some structures are easier to express than to describe. Composition lets the consumer express them instead of asking the component to anticipate them.',
  estimatedMinutes: 9,

  objectives: [
    'Use children and named slots to accept structure.',
    'Build a compound component whose parts share state implicitly.',
    'Judge when composition is better than configuration.',
    'Keep a composable API from becoming assembly-required.',
  ],

  prerequisiteConcepts: ['Component APIs', 'Variants'],
  prerequisiteLessonIds: ['lesson-08-03'],

  recap: [
    {
      kind: 'paragraph',
      text: 'Variants handle finite, enumerable differences. Composition handles the differences that are not finite.',
    },
  ],

  coreConcept: [
    {
      kind: 'paragraph',
      text: 'Configuration means describing what you want through props. Composition means expressing it directly as structure. Configuration works while the possibilities are few and known; composition is what remains when they are neither.',
    },
    {
      kind: 'paragraph',
      text: 'A compound component is a set of parts that belong together and share state through context. `Dialog`, `Dialog.Trigger`, `Dialog.Content`, `Dialog.Title` — the consumer arranges them, and the parts coordinate without being wired up manually.',
    },
    {
      kind: 'list',
      items: [
        'children — a single unnamed region.',
        'Named slots — several regions, each with a defined role.',
        'Compound components — parts sharing state via context.',
        'Render props — when the consumer needs the component\'s internal state to render.',
      ],
    },
    {
      kind: 'callout',
      tone: 'insight',
      body: 'If you find yourself adding a prop to describe an arrangement, the arrangement wants to be expressed rather than described.',
    },
  ],

  firstPrinciples: [
    {
      kind: 'paragraph',
      text: 'Configuration requires the component author to anticipate every arrangement. That is possible for a finite set and impossible for an open one, which is why configuration-based components accumulate props indefinitely.',
    },
    {
      kind: 'paragraph',
      text: 'Composition inverts the responsibility. The component supplies behaviour — focus trapping, escape handling, ARIA wiring — and the consumer supplies structure. Neither has to know the other\'s domain.',
    },
  ],

  designPerspective: [
    {
      kind: 'paragraph',
      text: 'Composition matches how designers think about slots in a design file: a card has a media area, a content area, an action area, and what goes in each varies by screen.',
    },
    {
      kind: 'paragraph',
      text: 'It has a cost, though. A fully composable API means every consumer assembles the parts, so the default arrangement must be either obvious or provided — otherwise the system has traded prop sprawl for inconsistent assembly.',
    },
  ],

  engineeringPerspective: [
    {
      kind: 'code',
      language: 'tsx',
      caption: 'A compound Dialog: behaviour from the component, structure from the consumer.',
      code: `<Dialog open={open} onOpenChange={setOpen}>
  <Dialog.Trigger asChild>
    <Button tone="danger">Delete project</Button>
  </Dialog.Trigger>

  <Dialog.Content>
    {/* Title is wired to aria-labelledby by the component, not by hand. */}
    <Dialog.Title>Delete this project?</Dialog.Title>
    <Dialog.Description>
      This removes the project and its 14 tasks. It cannot be undone.
    </Dialog.Description>

    <Dialog.Footer>
      <Dialog.Close asChild>
        <Button tone="secondary">Cancel</Button>
      </Dialog.Close>
      <Button tone="danger" onClick={destroy}>Delete project</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog>`,
    },
    {
      kind: 'paragraph',
      text: 'The consumer never writes `aria-labelledby`, never traps focus, never handles Escape. Those come from Dialog. What varies — the copy, the buttons, the arrangement — is expressed directly.',
    },
  ],

  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'This is where a design system provides its strongest guarantee: hard behaviour is supplied by the component and cannot be got wrong, while the flexible part stays flexible.',
    },
    {
      kind: 'paragraph',
      text: 'It is also why a composable dialog is more accessible in practice than a configurable one. The accessibility is not a prop anyone can forget.',
    },
  ],

  industryExamples: [
    {
      id: 'example-radix-composition',
      source: 'Radix UI',
      title: 'Behaviour supplied, structure delegated',
      observation:
        'Radix primitives expose Root, Trigger, and Content parts that handle focus, ARIA, and dismissal while leaving all markup and styling to the consumer.',
      takeaway:
        'The hard, easily-got-wrong part is centralised; the part that legitimately varies is not.',
    },
    {
      id: 'example-slot-composition',
      source: 'Component libraries with `asChild`',
      title: 'Composing with an existing element',
      observation:
        'Slot-style APIs let a trigger render as an existing button component rather than nesting two interactive elements.',
      takeaway:
        'It avoids a whole class of nested-interactive-element accessibility bugs.',
    },
  ],

  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Creating a flexible Dialog structure.',
    },
    { kind: 'heading', text: '1. Separate behaviour from structure' },
    {
      kind: 'paragraph',
      text: 'Behaviour: focus trap, Escape, restoration, ARIA, scroll lock. Structure: everything visible. The first list belongs to the component.',
    },
    { kind: 'heading', text: '2. Name the parts' },
    {
      kind: 'paragraph',
      text: 'Trigger, Content, Title, Description, Footer, Close. Each with one role.',
    },
    { kind: 'heading', text: '3. Share state through context' },
    {
      kind: 'paragraph',
      text: 'Open state and ids flow from Root to parts, so Title can register itself as the label without being told.',
    },
    { kind: 'heading', text: '4. Provide a default arrangement' },
    {
      kind: 'paragraph',
      text: 'A documented standard composition, so consistency is the easy path rather than a discipline.',
    },
    { kind: 'heading', text: '5. Fail loudly on misuse' },
    {
      kind: 'paragraph',
      text: 'A part rendered outside its Root should throw a clear error in development, not fail silently.',
    },
    { kind: 'heading', text: '6. Verify the behaviour survives every arrangement' },
    {
      kind: 'paragraph',
      text: 'Rearrange the parts, omit the description, add two footers. Focus and ARIA must still be correct.',
    },
  ],

  commonMistakes: [
    {
      id: 'mistake-config-for-structure',
      mistake: 'Adding props to describe arrangement.',
      why: 'Structure is open-ended, so the prop list grows for every new screen the component appears on.',
      instead: 'Accept slots or children and let the consumer express it.',
    },
    {
      id: 'mistake-composition-no-default',
      mistake: 'Making everything composable with no standard arrangement.',
      why: 'Every consumer assembles it differently, and the system loses the consistency it existed to provide.',
      instead: 'Provide a documented default composition.',
    },
    {
      id: 'mistake-parts-outside-root',
      mistake: 'Allowing parts to render outside their Root.',
      why: 'Context is missing, so behaviour silently degrades instead of failing.',
      instead: 'Throw a clear development-time error naming the missing Root.',
    },
    {
      id: 'mistake-composition-everywhere',
      mistake: 'Making simple components composable by default.',
      why: 'A Button split into parts is more work at every call site for no flexibility anyone needed.',
      instead: 'Compose where structure genuinely varies; configure where it does not.',
    },
  ],

  eliteConsiderations: [
    {
      kind: 'list',
      items: [
        'Keep behaviour in the parts, not in the consumer; anything a consumer must remember will eventually be forgotten.',
        'Use a slot mechanism so a trigger can render as an existing component rather than wrapping it.',
        'Document the standard composition prominently, and the flexible parts second.',
        'Generate ids inside the component so ARIA relationships cannot be wired incorrectly.',
      ],
    },
  ],

  practicalExercise: {
    id: 'exercise-08-04',
    title: 'Create a flexible Dialog structure',
    prompt:
      'Build a compound Dialog where behaviour is supplied by the component and structure by the consumer.',
    steps: [
      'List everything that is behaviour and everything that is structure.',
      'Define the parts, each with a single role.',
      'Share open state and generated ids through context.',
      'Wire ARIA relationships inside the component so consumers cannot get them wrong.',
      'Provide and document a default composition.',
      'Throw a clear development error when a part renders outside its Root.',
      'Build three different dialogs with the same parts in different arrangements.',
      'Verify focus trapping, Escape, and focus restoration in all three.',
    ],
    successCriteria: [
      'Consumers write no ARIA attributes.',
      'Focus is trapped while open and restored to the trigger on every close path.',
      'Three different arrangements all behave correctly.',
      'A default composition is documented.',
      'Misuse produces a clear error in development.',
    ],
    estimatedMinutes: 55,
    hint: 'Anything a consumer could forget belongs inside the component. That principle decides most of these APIs.',
  },

  reflectionQuestion: 'When is composition stronger than configuration?',
  reflectionHint: 'Some structures are easier to express than describe.',

  resources: [
    {
      id: 'resource-radix-composition',
      title: 'Radix Primitives: composition',
      url: 'https://www.radix-ui.com/primitives/docs/guides/composition',
      type: 'documentation',
      estimatedMinutes: 20,
      note: 'The slot mechanism and the reasoning behind it.',
    },
    {
      id: 'resource-apg-dialog',
      title: 'ARIA Authoring Practices: dialog',
      url: 'https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/',
      type: 'specification',
      estimatedMinutes: 30,
      note: 'The behaviour the component must supply, regardless of API shape.',
    },
    {
      id: 'resource-react-context',
      title: 'React: passing data deeply with context',
      url: 'https://react.dev/learn/passing-data-deeply-with-context',
      type: 'documentation',
      estimatedMinutes: 25,
      note: 'The mechanism compound components use to coordinate.',
    },
  ],

  competencyTags: [
    'accessibility',
    'react',
    'component-architecture',
    'component-api-design',
  ],

  completionCriteria: [
    'Has built a compound component with context-shared state.',
    'Consumers write no ARIA attributes.',
    'Behaviour is correct across three different arrangements.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Lesson 40                                                                   */
/* -------------------------------------------------------------------------- */

const LESSON_40: Lesson = {
  id: 'lesson-08-05',
  slug: 'state-ownership',
  moduleId: MODULE_ID,
  lessonNumber: 5,
  title: 'State Ownership',
  summary:
    'Ownership is the question of who is allowed to change a fact. Getting it wrong is how a multi-panel interface becomes unpredictable.',
  estimatedMinutes: 9,

  objectives: [
    'Distinguish local, lifted, shared, and controlled state by owner.',
    'Draw state boundaries across a multi-panel interface.',
    'Judge what belongs in global state and what does not.',
    'Recognise the maintenance cost of global reach.',
  ],

  prerequisiteConcepts: ['State', 'Composition', 'Component boundaries'],
  prerequisiteLessonIds: ['lesson-08-04', 'lesson-07-04'],

  recap: [
    {
      kind: 'paragraph',
      text: 'Module 7 asked where state should live. This lesson asks who owns it, which is the same question once more than one panel is involved.',
    },
  ],

  coreConcept: [
    {
      kind: 'paragraph',
      text: 'Ownership means the authority to change a value. Exactly one place should hold it; everything else reads, or requests a change through a callback. When two places both believe they own a value, they will disagree, and which one wins becomes a function of render order.',
    },
    {
      kind: 'list',
      items: [
        'Local — owned by one component, invisible outside it.',
        'Lifted — owned by the closest common ancestor of its readers.',
        'Shared — owned by a store or context, read across a subtree.',
        'Controlled — owned by a parent, delegated to a child for display and reporting.',
      ],
    },
    {
      kind: 'paragraph',
      text: 'Navigational state — what is selected, which tab is open, what is filtered — usually belongs in the URL. It is genuinely shared, it should survive a refresh, and it is what makes a view linkable.',
    },
    {
      kind: 'callout',
      tone: 'warning',
      body: 'Global state is not free storage. Every value there is reachable from everywhere, which means every value there can be changed from anywhere.',
    },
  ],

  firstPrinciples: [
    {
      kind: 'paragraph',
      text: 'The cost of global state is the size of the set of places that could have caused a change. Local state has one suspect. Global state has as many suspects as there are call sites, and debugging cost scales with that number.',
    },
    {
      kind: 'paragraph',
      text: 'It also destroys portability: a component reading a global store cannot be rendered anywhere the store does not exist, which means it cannot be tested or reviewed in isolation.',
    },
  ],

  designPerspective: [
    {
      kind: 'paragraph',
      text: 'Ownership is visible as scope. If closing a panel resets its filters, that state was local. If it does not, something above owns it. Users form expectations about this quickly and notice when it is inconsistent between panels.',
    },
    {
      kind: 'paragraph',
      text: 'It is worth specifying per panel: what resets on close, what persists within a session, what survives a refresh, what is shareable. Four different answers with four different implementations.',
    },
  ],

  engineeringPerspective: [
    {
      kind: 'code',
      language: 'tsx',
      caption: 'An ownership map, written down before implementing.',
      code: `// Selected project — shared by list and detail, survives refresh, shareable.
//   Owner: the URL.
const [selectedId, setSelectedId] = useSearchParam('project');

// Filters — shared by list and toolbar, shareable.
//   Owner: the URL.
const [filters, setFilters] = useSearchParams(FILTER_KEYS);

// Draft edits — only the detail panel, discarded on close.
//   Owner: DetailPanel, local.
const [draft, setDraft] = useState(project);

// Theme — every component, persists across sessions.
//   Owner: a store, with storage behind it.
const theme = useTheme();`,
    },
    {
      kind: 'paragraph',
      text: 'The comments are the deliverable. Writing the owner and the lifetime for each fact makes the inconsistencies visible before they are built, and gives a reviewer something to check against.',
    },
  ],

  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'An ownership map is a design document as much as an architectural one. It answers what happens on close, on refresh, on share, and on navigating away — all questions users experience directly.',
    },
    {
      kind: 'paragraph',
      text: 'Producing it before implementation converts a set of accidental behaviours into a set of decisions.',
    },
  ],

  industryExamples: [
    {
      id: 'example-url-as-owner',
      source: 'Applications with deep-linkable views',
      title: 'The URL as the owner of view state',
      observation:
        'Products where any view can be linked keep selection, filters, and panel state in the URL rather than in memory.',
      takeaway:
        'Shareability, refresh survival, and correct back-button behaviour all follow from one ownership decision.',
    },
    {
      id: 'example-store-scope',
      source: 'State-management practice',
      title: 'Global stores kept small on purpose',
      observation:
        'Teams that keep global stores limited to genuinely cross-cutting concerns — session, theme, feature flags — report fewer state bugs than those that centralise everything.',
      takeaway:
        'The store is not a convenience layer; every entry widens the set of possible causes for any bug.',
    },
  ],

  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Determining ownership across a multi-panel interface.',
    },
    { kind: 'heading', text: '1. List every fact' },
    {
      kind: 'paragraph',
      text: 'Everything the interface remembers, across every panel. Usually a longer list than expected.',
    },
    { kind: 'heading', text: '2. Mark readers and writers' },
    {
      kind: 'paragraph',
      text: 'For each fact, who reads it and who may change it. Two writers is a problem to resolve now.',
    },
    { kind: 'heading', text: '3. Decide lifetime' },
    {
      kind: 'paragraph',
      text: 'Until close, until navigation, until refresh, forever. The lifetime picks the storage.',
    },
    { kind: 'heading', text: '4. Assign exactly one owner' },
    {
      kind: 'paragraph',
      text: 'The closest place containing every reader. Everything else receives it and reports changes upward.',
    },
    { kind: 'heading', text: '5. Justify anything global' },
    {
      kind: 'paragraph',
      text: 'Each entry in a store needs a written reason. Most candidates fail this test.',
    },
    { kind: 'heading', text: '6. Test the lifetimes' },
    {
      kind: 'paragraph',
      text: 'Close each panel, navigate away and back, refresh, open a shared link. Behaviour should match the map.',
    },
  ],

  commonMistakes: [
    {
      id: 'mistake-two-owners',
      mistake: 'Letting two components both write the same fact.',
      why: 'They disagree, and which one wins depends on render order rather than intent.',
      instead: 'One owner; everything else reports changes upward.',
    },
    {
      id: 'mistake-global-by-default',
      mistake: 'Putting state in a global store for convenience.',
      why: 'Any component could have changed it, so debugging cost scales with the size of the codebase.',
      instead: 'Own it as locally as the readers allow.',
    },
    {
      id: 'mistake-navigational-in-memory',
      mistake: 'Keeping selection and filters in component state.',
      why: 'The view cannot be shared or restored, and the back button behaves unexpectedly.',
      instead: 'Put navigational state in the URL.',
    },
    {
      id: 'mistake-unspecified-lifetime',
      mistake: 'Not deciding what resets when a panel closes.',
      why: 'The behaviour ends up determined by where `useState` was typed, and differs between panels.',
      instead: 'Decide the lifetime explicitly for each fact.',
    },
  ],

  eliteConsiderations: [
    {
      kind: 'list',
      items: [
        'Write the ownership map before implementing; it is faster than discovering it through bugs.',
        'Keep draft edits local until committed, so cancelling is free and needs no rollback logic.',
        'Prefer the URL for anything a user might reasonably want to send to someone.',
        'Require a written justification for every entry in a global store, and review the list periodically.',
      ],
    },
  ],

  practicalExercise: {
    id: 'exercise-08-05',
    title: 'Determine state ownership across a multi-panel interface',
    prompt:
      'Produce and implement an ownership map for an interface with at least three panels.',
    steps: [
      'List every fact the interface remembers.',
      'For each, record its readers and its writers.',
      'Resolve every case where two components could write the same fact.',
      'Decide each fact\'s lifetime: panel close, navigation, refresh, or permanent.',
      'Assign exactly one owner, choosing the closest place containing all readers.',
      'Write a justification for every value you place in a global store.',
      'Implement the map.',
      'Test every lifetime: close each panel, navigate away and back, refresh, open a shared link.',
    ],
    successCriteria: [
      'A written ownership map exists, naming an owner and lifetime for every fact.',
      'No fact has two writers.',
      'Navigational state is in the URL and the view is shareable.',
      'Every global entry has a written justification.',
      'Observed behaviour matches the map for every lifetime tested.',
    ],
    estimatedMinutes: 55,
    hint: 'Write the map before the code. Two writers for one fact is the bug you are looking for, and it is easier to see on paper.',
  },

  reflectionQuestion:
    'Should global state contain every piece of interface state?',
  reflectionHint: 'Global reach has a maintenance cost.',

  resources: [
    {
      id: 'resource-react-preserving-state',
      title: 'React: preserving and resetting state',
      url: 'https://react.dev/learn/preserving-and-resetting-state',
      type: 'documentation',
      estimatedMinutes: 30,
      note: 'What determines whether state survives, which is what lifetime decisions rest on.',
    },
    {
      id: 'resource-react-scaling-reducer-context',
      title: 'React: scaling up with reducer and context',
      url: 'https://react.dev/learn/scaling-up-with-reducer-and-context',
      type: 'documentation',
      estimatedMinutes: 30,
      note: 'Sharing ownership across a subtree without going fully global.',
    },
  ],

  competencyTags: ['product-judgement', 'react', 'state-modelling', 'architecture'],

  completionCriteria: [
    'A written ownership map exists and was implemented.',
    'No fact has two writers.',
    'Every global entry is justified in writing.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Project                                                                     */
/* -------------------------------------------------------------------------- */

const PROJECT: ModuleProject = {
  id: 'project-08',
  slug: 'component-library',
  moduleId: MODULE_ID,
  title: 'Component Library',
  brief:
    'Build and document a component library: Button, Input, Checkbox, Tabs, Dialog, Dropdown, Tooltip, and Toast, each with its states, API, accessibility behaviour, and examples.',
  problem:
    'Eight components is enough to expose whether your API decisions are consistent. Naming that works for Button has to work for Input; the controlled-versus-uncontrolled decision has to be made the same way three times; the focus behaviour of Dialog, Dropdown, and Tooltip has to agree. A library is not eight components — it is the consistency between them, and that only becomes visible at this size.',
  objectives: [
    'Apply one set of API conventions across eight different components.',
    'Implement correct keyboard and focus behaviour for each interactive pattern.',
    'Document components well enough to be used without reading source.',
    'Keep variant dimensions orthogonal and countable across the set.',
  ],
  requirements: [
    'Button, Input, Checkbox, Tabs, Dialog, Dropdown, Tooltip, and Toast.',
    'Documented API for every component: props, types, defaults.',
    'Every state rendered and documented, including focus, disabled, loading, and error.',
    'Documented accessibility behaviour: roles, keyboard model, focus management.',
    'Usage examples for every component.',
    'A page rendering every variant and state combination.',
  ],
  constraints: [
    'No component library as a dependency; unstyled primitives are acceptable if documented.',
    'One naming convention across all eight components.',
    'No mutually exclusive boolean props anywhere in the library.',
    'Accessibility-critical props must be required, not optional.',
  ],
  suggestedScope:
    'Eight components, documented, with examples. Do not build a publishing pipeline, a theme editor, or a documentation site framework — the deliverable is the components and their documentation.',
  deliverables: [
    'The eight components, with types.',
    'API documentation for each, including defaults and the control mode.',
    'A keyboard and focus specification for every interactive component.',
    'A matrix page rendering every variant and state.',
    'A short note on the conventions you chose and where you were tempted to break them.',
  ],
  completionCriteria: [
    'Every component is fully operable by keyboard, verified with the mouse unplugged.',
    'Dialog, Dropdown, and Tooltip agree on focus and dismissal behaviour.',
    'No mutually exclusive boolean props exist anywhere.',
    'Every component has documented states, API, accessibility behaviour, and examples.',
    'The matrix page renders without any undesigned combinations.',
  ],
  portfolioEvidence: [
    'Component API design across a set',
    'Keyboard and focus management',
    'Variant modelling',
    'Compound component composition',
    'Component documentation',
  ],
  reflectionQuestion:
    'Where did a convention that worked for one component fight against another, and what did you change?',
  estimatedHours: 30,
  competencies: [
    'accessibility',
    'typescript',
    'react',
    'component-architecture',
    'component-api-design',
    'design-systems-implementation',
    'interaction-engineering',
  ],
  stretchGoals: [
    'Add a visual regression check that renders the matrix page and compares against a baseline.',
    'Add a second theme and confirm no component needed changing to support it.',
  ],
};

/* -------------------------------------------------------------------------- */

export const MODULE_08: CurriculumModule = {
  id: MODULE_ID,
  slug: 'component-architecture',
  moduleNumber: 8,
  phase: 'systems',
  title: 'Component Architecture',
  description:
    'Boundaries by reason to change, APIs designed from call sites, variants as orthogonal dimensions, composition for what cannot be anticipated, and ownership of every fact.',
  outcome: 'Can design and implement a component system others could build on.',
  prerequisites: [
    'Modules 1 to 7, or equivalent',
    'Comfortable building React components',
  ],
  lessons: [LESSON_36, LESSON_37, LESSON_38, LESSON_39, LESSON_40],
  resources: [
    {
      id: 'resource-module-08-radix',
      title: 'Radix Primitives',
      url: 'https://www.radix-ui.com/primitives',
      type: 'documentation',
      estimatedMinutes: 120,
      note: 'Composable, accessible primitives; read the APIs as design examples.',
    },
    {
      id: 'resource-module-08-apg',
      title: 'ARIA Authoring Practices Guide',
      url: 'https://www.w3.org/WAI/ARIA/apg/patterns/',
      type: 'specification',
      estimatedMinutes: 180,
      note: 'The keyboard and role model for every pattern in the module project.',
    },
    {
      id: 'resource-module-08-primer',
      title: 'Primer: component guidelines',
      url: 'https://primer.style/guides/introduction',
      type: 'documentation',
      estimatedMinutes: 60,
      note: 'A large system\'s conventions, published in full.',
    },
  ],
  project: PROJECT,
  competencies: [
    'accessibility',
    'design-systems',
    'critique',
    'product-judgement',
    'typescript',
    'react',
    'state-modelling',
    'component-architecture',
    'architecture',
    'component-api-design',
    'design-systems-implementation',
    'interaction-engineering',
  ],
  completionCriteria: [
    'All five lessons completed.',
    'Module project marked completed.',
    'Can design a consistent component API across a set of components.',
  ],
};
