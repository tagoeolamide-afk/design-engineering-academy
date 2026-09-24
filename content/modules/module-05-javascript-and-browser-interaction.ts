/**
 * Module 05 — JavaScript and Browser Interaction.
 *
 * Where behaviour enters the interface: data shapes, the event system, state
 * as the source of truth, rendering from that state, and the fact that most
 * real work takes time.
 */

import type { CurriculumModule, Lesson, ModuleProject } from '@/types/curriculum';

const MODULE_ID = 'module-05';

/* -------------------------------------------------------------------------- */
/* Lesson 21                                                                   */
/* -------------------------------------------------------------------------- */

const LESSON_21: Lesson = {
  id: 'lesson-05-01',
  slug: 'values-functions-and-data',
  moduleId: MODULE_ID,
  lessonNumber: 1,
  title: 'Values, Functions and Data',
  summary:
    'The shape you choose for your data decides which interfaces are easy to build and which are quietly impossible.',
  estimatedMinutes: 8,

  objectives: [
    'Distinguish primitives from references and predict the consequences.',
    'Choose between arrays and keyed objects based on access patterns.',
    'Write transformations that do not mutate their input.',
    'Model data so that impossible interface states cannot be represented.',
  ],

  prerequisiteConcepts: ['Interfaces as systems of state', 'Basic programming syntax'],
  prerequisiteLessonIds: ['lesson-01-01'],

  recap: [
    {
      kind: 'paragraph',
      text: 'Module 1 established that an interface is a system of states. This module is about expressing those states in code, starting with the data they are made of.',
    },
  ],

  coreConcept: [
    {
      kind: 'paragraph',
      text: 'JavaScript values divide into primitives — strings, numbers, booleans, null, undefined — which are copied when assigned, and references — objects, arrays, functions — where the variable holds a pointer to shared data.',
    },
    {
      kind: 'paragraph',
      text: 'That distinction is the source of a whole category of interface bugs. Two components holding the same array are holding the same array: a change made by one is a change seen by the other, whether or not anyone intended it.',
    },
    {
      kind: 'list',
      items: [
        'Arrays preserve order and are natural to render.',
        'Keyed objects, or a Map, give constant-time lookup by id.',
        'A Set answers membership questions without scanning.',
        'Most real interfaces need order and lookup, which usually means both.',
      ],
    },
    {
      kind: 'callout',
      tone: 'insight',
      body: 'Choose the data shape from how the interface reads it, not from how the server happened to send it.',
    },
  ],

  firstPrinciples: [
    {
      kind: 'paragraph',
      text: 'A data model is a set of claims about what can be true at once. If your model allows `isLoading: true` alongside `data` and `error`, then that combination exists and something must decide what to render for it.',
    },
    {
      kind: 'paragraph',
      text: 'Making the impossible unrepresentable removes those decisions entirely. A single `status` field with four values has four cases; three independent booleans have eight, half of which are nonsense that still has to be handled.',
    },
  ],

  designPerspective: [
    {
      kind: 'paragraph',
      text: 'Data modelling is a design activity that happens to be expressed in code. The set of states a designer has to draw is exactly the set the model permits — so an overly loose model creates screens nobody designed.',
    },
    {
      kind: 'paragraph',
      text: 'This is also where the empty state gets decided. An interface built on a list that can be empty, filtered-to-empty, or failed-to-load has three visually distinct outcomes, and the model is where that becomes visible.',
    },
  ],

  engineeringPerspective: [
    {
      kind: 'code',
      language: 'ts',
      caption: 'A model that permits contradictions, and one that does not.',
      code: `// Eight combinations, five of them meaningless.
type Loose = {
  isLoading: boolean;
  hasError: boolean;
  items: Item[];
};

// Four states, each one renderable. Nothing else can exist.
type Result =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; items: Item[] };

// Transformations return new values rather than editing in place.
const withoutItem = (items: Item[], id: string) =>
  items.filter((item) => item.id !== id);`,
    },
    {
      kind: 'paragraph',
      text: 'Immutable updates are not a stylistic preference. Frameworks detect change by comparing references, so mutating an array in place produces the same reference and the interface does not update — a bug that looks like a rendering failure and is actually a data one.',
    },
  ],

  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'When a designer asks "what happens if there are no results?", they are asking a data-model question. When an engineer says "that state cannot occur", they are describing a design constraint. It is the same conversation from two sides.',
    },
    {
      kind: 'paragraph',
      text: 'A design engineer can hold both: sketch the four states, then write the type that permits exactly four.',
    },
  ],

  industryExamples: [
    {
      id: 'example-normalised-state',
      source: 'Large client applications',
      title: 'Normalising by id',
      observation:
        'Applications that display the same entity in several places commonly store entities keyed by id and keep separate arrays of ids for ordering.',
      takeaway:
        'One copy of each entity means an edit in one view cannot leave another view showing stale data.',
    },
    {
      id: 'example-discriminated-unions',
      source: 'TypeScript codebases generally',
      title: 'Status as a union rather than flags',
      observation:
        'Data-fetching libraries expose a single status field with discrete values instead of independent loading and error booleans.',
      takeaway:
        'The compiler can then prove every case is handled, and the contradictory combinations never need a design.',
    },
  ],

  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Modelling a task list.',
    },
    { kind: 'heading', text: '1. List what the interface must ask of the data' },
    {
      kind: 'paragraph',
      text: 'Render in order. Find one task by id. Filter by status. Count completed. Each question suggests a shape.',
    },
    { kind: 'heading', text: '2. Write the type for a single item' },
    {
      kind: 'paragraph',
      text: 'Include only what the interface uses. Fields added speculatively become fields nobody can safely delete.',
    },
    { kind: 'heading', text: '3. Choose the collection shape' },
    {
      kind: 'paragraph',
      text: 'If lookup by id happens often, store a keyed object plus an ordered array of ids. If not, an array is simpler and simpler wins.',
    },
    { kind: 'heading', text: '4. Write transformations that return new values' },
    {
      kind: 'paragraph',
      text: 'Add, remove, toggle, reorder. None of them mutate their input. Test each one by checking the original is unchanged.',
    },
    { kind: 'heading', text: '5. Try to represent something impossible' },
    {
      kind: 'paragraph',
      text: 'If you can construct a task that is both completed and in progress, the model is too loose.',
    },
  ],

  commonMistakes: [
    {
      id: 'mistake-mutation',
      mistake: 'Mutating arrays and objects in place.',
      why: 'Shared references mean unrelated parts of the interface change unexpectedly, and change detection based on identity stops working.',
      instead: 'Return new values from every transformation.',
    },
    {
      id: 'mistake-boolean-flags',
      mistake: 'Modelling status with several independent booleans.',
      why: 'The number of combinations grows exponentially and most of them are contradictions that still need handling.',
      instead: 'Use one field with a fixed set of values.',
    },
    {
      id: 'mistake-array-lookup',
      mistake: 'Scanning an array with find on every render.',
      why: 'It is linear in list length and repeats for every lookup, which becomes visible on large lists.',
      instead: 'Key by id when lookups are frequent.',
    },
    {
      id: 'mistake-server-shape',
      mistake: 'Storing the server response shape unchanged.',
      why: 'The API is designed for transport, not for the questions your interface asks, so every component pays the translation cost repeatedly.',
      instead: 'Transform once at the boundary into the shape the interface needs.',
    },
  ],

  eliteConsiderations: [
    {
      kind: 'list',
      items: [
        'Derive anything that can be derived rather than storing it; a stored count is a count that can be wrong.',
        'Keep ids opaque strings — the moment code parses meaning out of an id, changing id format becomes a migration.',
        'Prefer a union of statuses over optional fields; optionality spreads into every consumer.',
        'Model the loading and error states at the same time as the success state, not after the happy path is built.',
      ],
    },
  ],

  practicalExercise: {
    id: 'exercise-05-01',
    title: 'Model a task list',
    prompt:
      'Model the data for a task list so that impossible states cannot be represented.',
    steps: [
      'Write down every question the interface will ask of the data.',
      'Define the type for one task, including only fields the interface uses.',
      'Choose the collection shape from the access patterns you listed.',
      'Write add, remove, toggle, and reorder as pure transformations.',
      'Verify each transformation leaves its input unchanged.',
      'Attempt to construct a contradictory task, and tighten the type until you cannot.',
      'Derive the completed count rather than storing it.',
    ],
    successCriteria: [
      'No transformation mutates its input.',
      'Status is a single field, not a set of booleans.',
      'A contradictory state cannot be constructed.',
      'Every derived value is derived, not stored.',
      'The data shape is justified by a listed access pattern.',
    ],
    estimatedMinutes: 35,
    hint: 'Try to write down a state that should be impossible. If the type accepts it, the model is not finished.',
  },

  reflectionQuestion: 'How does data shape influence interface complexity?',
  reflectionHint:
    'Think about the number of states that must be designed. What does an extra optional field add to that count?',

  resources: [
    {
      id: 'resource-mdn-data-structures',
      title: 'MDN: JavaScript data types and data structures',
      url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures',
      type: 'documentation',
      estimatedMinutes: 25,
      note: 'Primitives, references, and what equality means for each.',
    },
    {
      id: 'resource-ts-narrowing',
      title: 'TypeScript: narrowing',
      url: 'https://www.typescriptlang.org/docs/handbook/2/narrowing.html',
      type: 'documentation',
      estimatedMinutes: 30,
      note: 'How discriminated unions let the compiler prove every case is handled.',
    },
  ],

  competencyTags: ['javascript', 'state-modelling', 'interface-state-modelling'],

  completionCriteria: [
    'Has modelled a task list with pure transformations.',
    'Impossible states cannot be constructed in the model.',
    'Can justify the collection shape from access patterns.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Lesson 22                                                                   */
/* -------------------------------------------------------------------------- */

const LESSON_22: Lesson = {
  id: 'lesson-05-02',
  slug: 'events',
  moduleId: MODULE_ID,
  lessonNumber: 2,
  title: 'Events',
  summary:
    'Events are how intent reaches your code. Understanding propagation is what lets you handle intent once instead of everywhere.',
  estimatedMinutes: 9,

  objectives: [
    'Describe capture, target, and bubble phases accurately.',
    'Use delegation for dynamic collections.',
    'Distinguish preventDefault from stopPropagation and use each correctly.',
    'Handle keyboard, pointer, and touch input without assuming a device.',
  ],

  prerequisiteConcepts: ['Native controls', 'Keyboard and focus'],
  prerequisiteLessonIds: ['lesson-05-01', 'lesson-03-03'],

  recap: [
    {
      kind: 'paragraph',
      text: 'Module 3 established that native controls already handle input correctly. This lesson is about what happens when the event reaches your code.',
    },
  ],

  coreConcept: [
    {
      kind: 'paragraph',
      text: 'A dispatched event travels down from the document to the target — the capture phase — fires on the target itself, then travels back up through every ancestor — the bubble phase. Listeners are on the bubble phase by default.',
    },
    {
      kind: 'paragraph',
      text: 'Bubbling is what makes delegation possible: one listener on a container handles clicks on any descendant, including ones that did not exist when the listener was attached.',
    },
    {
      kind: 'list',
      items: [
        'event.target — where the event originated.',
        'event.currentTarget — the element whose listener is running.',
        'preventDefault() — cancel the browser\'s default action; propagation continues.',
        'stopPropagation() — stop the event travelling further; the default action still happens.',
      ],
    },
    {
      kind: 'callout',
      tone: 'warning',
      body: 'These two are not interchangeable and are routinely confused. Cancelling a form submit needs preventDefault. Stopping a parent from also reacting needs stopPropagation. Reaching for the wrong one produces a bug that looks like it half works.',
    },
  ],

  firstPrinciples: [
    {
      kind: 'paragraph',
      text: 'The event system exists because the DOM is a tree and interaction happens at leaves. Propagation lets an ancestor take responsibility for behaviour that logically belongs to a region rather than to each individual node.',
    },
    {
      kind: 'paragraph',
      text: 'That is why delegation scales: one listener and a set of rules, rather than n listeners that must be attached and removed as items appear and disappear. Forgotten removal is one of the most common sources of leaked memory in long-lived interfaces.',
    },
  ],

  designPerspective: [
    {
      kind: 'paragraph',
      text: 'Every interaction has an input modality the design usually leaves implicit. "Click the row to open it" says nothing about the keyboard, and a row that only responds to a mouse excludes anyone who is not using one.',
    },
    {
      kind: 'paragraph',
      text: 'A useful discipline in design review: for each interaction, state the mouse behaviour, the keyboard behaviour, and the touch behaviour. Most designs are missing at least one.',
    },
  ],

  engineeringPerspective: [
    {
      kind: 'code',
      language: 'ts',
      caption: 'Delegation with an explicit closest() check.',
      code: `list.addEventListener('click', (event) => {
  // target may be a descendant — an icon inside the button, for example.
  const item = (event.target as HTMLElement).closest<HTMLElement>('[data-id]');
  if (!item || !list.contains(item)) return;

  select(item.dataset.id!);
});

// preventDefault cancels the default action. Propagation is unaffected.
form.addEventListener('submit', (event) => {
  event.preventDefault();
  submit(new FormData(form));
});`,
    },
    {
      kind: 'paragraph',
      text: 'Use pointer events rather than separate mouse and touch handlers — they unify mouse, touch, and pen, which removes the duplicated logic and the 300ms-style workarounds that used to accompany it.',
    },
    {
      kind: 'paragraph',
      text: 'Scroll, resize, and pointermove fire far more often than you can usefully render. Coalesce them with requestAnimationFrame so at most one update happens per frame.',
    },
  ],

  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'Delegation has a design consequence: behaviour attached to a region rather than to elements means new items work automatically. That is what makes a list feel consistent as it changes.',
    },
    {
      kind: 'paragraph',
      text: 'It also has an accessibility consequence. A delegated click handler on a div gives no keyboard access at all. If a row is activatable, something inside it must be a real button or link — the Module 3 rule, restated as an event problem.',
    },
  ],

  industryExamples: [
    {
      id: 'example-delegation-lists',
      source: 'Virtualised lists and data grids',
      title: 'One listener for thousands of rows',
      observation:
        'Grids that render rows dynamically attach a single delegated listener to the container rather than one per row.',
      takeaway:
        'Listener count stays constant as the list grows, and rows added later need no wiring.',
    },
    {
      id: 'example-shortcuts-scope',
      source: 'Linear and similar keyboard-driven tools',
      title: 'Shortcuts scoped by context',
      observation:
        'Keyboard-heavy applications scope shortcuts so that typing in an input does not trigger global commands.',
      takeaway:
        'A global key listener without a scope check will fire while someone is typing, which is worse than having no shortcut.',
    },
  ],

  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Building an interactive list with delegation.',
    },
    { kind: 'heading', text: '1. Make each item activatable natively' },
    {
      kind: 'paragraph',
      text: 'A button or link inside each row. Keyboard access then exists before any JavaScript is written.',
    },
    { kind: 'heading', text: '2. Attach one listener to the container' },
    {
      kind: 'paragraph',
      text: 'Use closest to find the item, and verify the container still holds it before acting.',
    },
    { kind: 'heading', text: '3. Add keyboard navigation' },
    {
      kind: 'paragraph',
      text: 'Arrow keys to move, Enter to activate, Escape to dismiss. Check the active element before handling, so typing in a field is unaffected.',
    },
    { kind: 'heading', text: '4. Coalesce anything high-frequency' },
    {
      kind: 'paragraph',
      text: 'If a hover or scroll handler updates the interface, wrap the update in requestAnimationFrame.',
    },
    { kind: 'heading', text: '5. Test with the mouse unplugged' },
    {
      kind: 'paragraph',
      text: 'Everything reachable, everything activatable, focus always visible. If any of that fails, the interaction is incomplete rather than merely imperfect.',
    },
  ],

  commonMistakes: [
    {
      id: 'mistake-stop-propagation-default',
      mistake: 'Calling stopPropagation routinely.',
      why: 'It silently breaks any ancestor behaviour, including click-outside dismissal and analytics, in ways that are very hard to trace later.',
      instead: 'Stop propagation only when a specific ancestor behaviour must not run, and comment why.',
    },
    {
      id: 'mistake-listener-per-item',
      mistake: 'Attaching a listener to every item in a list.',
      why: 'Listeners must be removed when items are removed, and forgotten removals leak memory and keep dead objects alive.',
      instead: 'Delegate to the container.',
    },
    {
      id: 'mistake-click-only',
      mistake: 'Handling click on a non-interactive element.',
      why: 'A div responds to the mouse only, so keyboard and assistive technology users cannot trigger it at all.',
      instead: 'Use a real button or link, and let click come from any modality.',
    },
    {
      id: 'mistake-unthrottled-handlers',
      mistake: 'Updating the interface directly from scroll or pointermove.',
      why: 'These fire many times per frame, so most of the work is discarded before it is ever painted.',
      instead: 'Coalesce with requestAnimationFrame.',
    },
  ],

  eliteConsiderations: [
    {
      kind: 'list',
      items: [
        'Use AbortController to remove groups of listeners cleanly with a single signal.',
        'Mark scroll and touch listeners passive unless you genuinely need preventDefault.',
        'Check event.isTrusted when a distinction between real and synthetic input matters.',
        'Scope keyboard shortcuts by checking the active element, so they never fire while someone is typing.',
      ],
    },
  ],

  practicalExercise: {
    id: 'exercise-05-02',
    title: 'Build an interactive list with delegation',
    prompt:
      'Build a list where every interaction works with mouse, keyboard, and touch, using a single delegated listener.',
    steps: [
      'Make every activatable item a native button or link.',
      'Attach one delegated listener to the container and resolve the item with closest.',
      'Add arrow-key navigation, Enter to activate, and Escape to dismiss.',
      'Scope the key handling so typing in an input is unaffected.',
      'Coalesce any high-frequency handler with requestAnimationFrame.',
      'Add and remove items dynamically and confirm no rewiring is needed.',
      'Test the whole list with the mouse unplugged.',
    ],
    successCriteria: [
      'Exactly one listener handles all item activation.',
      'Every interaction works by keyboard alone.',
      'Dynamically added items work with no additional wiring.',
      'No stopPropagation call exists without a comment explaining it.',
      'Shortcuts do not fire while typing in a field.',
    ],
    estimatedMinutes: 45,
    hint: 'event.target can be a descendant of the item you care about. closest() is what bridges that gap.',
  },

  reflectionQuestion: 'When is event delegation the better pattern?',
  reflectionHint:
    'Consider dynamic lists and memory. What has to happen to a per-item listener when the item is removed, and what happens if it does not?',

  resources: [
    {
      id: 'resource-mdn-event-bubbling',
      title: 'MDN: event bubbling and capture',
      url: 'https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Event_bubbling',
      type: 'documentation',
      estimatedMinutes: 25,
      note: 'The three phases, with delegation explained from them.',
    },
    {
      id: 'resource-mdn-pointer-events',
      title: 'MDN: pointer events',
      url: 'https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events',
      type: 'documentation',
      estimatedMinutes: 20,
      note: 'One model covering mouse, touch, and pen.',
    },
  ],

  competencyTags: [
    'accessibility',
    'javascript',
    'browser-apis',
    'interaction-engineering',
  ],

  completionCriteria: [
    'Has built a list using a single delegated listener.',
    'All interactions work by keyboard alone.',
    'Can state the difference between preventDefault and stopPropagation.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Lesson 23                                                                   */
/* -------------------------------------------------------------------------- */

const LESSON_23: Lesson = {
  id: 'lesson-05-03',
  slug: 'state-in-javascript',
  moduleId: MODULE_ID,
  lessonNumber: 3,
  title: 'State in JavaScript',
  summary:
    'State is the interface\'s memory. Most interface bugs are two copies of the same truth disagreeing.',
  estimatedMinutes: 9,

  objectives: [
    'Identify the single source of truth for any piece of interface state.',
    'Separate stored state from derived state rigorously.',
    'Choose where state should live and justify the choice.',
    'Recognise duplicated state as the cause of a class of bugs.',
  ],

  prerequisiteConcepts: ['Data modelling', 'Events'],
  prerequisiteLessonIds: ['lesson-05-02'],

  recap: [
    {
      kind: 'paragraph',
      text: 'Events deliver intent. State is what that intent changes, and what the next render reads.',
    },
  ],

  coreConcept: [
    {
      kind: 'paragraph',
      text: 'State is everything the interface remembers between interactions. The single most useful rule about it is that each fact should exist in exactly one place, and everything else should be computed from it.',
    },
    {
      kind: 'paragraph',
      text: 'When a fact is stored twice, the two copies can disagree, and every code path that changes one must remember the other. That is the mechanism behind a large share of interface bugs: a filter reading a stale list, a count that does not match the rows, a button disabled when it should not be.',
    },
    {
      kind: 'list',
      items: [
        'Stored — the user typed it, the server sent it, or nothing else can produce it.',
        'Derived — it can be computed from stored state, so it should be.',
        'Ephemeral — hover, focus, a transient animation; it can often live in the DOM.',
      ],
    },
    {
      kind: 'callout',
      tone: 'insight',
      body: 'The test is simple: can this be computed from something else I already have? If yes, computing it is always cheaper than keeping two things in sync.',
    },
  ],

  firstPrinciples: [
    {
      kind: 'paragraph',
      text: 'The URL is state, and it is the only state that survives a refresh, a share, and a bookmark. Filters, search terms, selected tabs, and pagination generally belong there — and putting them in a variable instead is a decision to break the back button.',
    },
    {
      kind: 'paragraph',
      text: 'Where state lives should follow from who needs it. State used by one component belongs in that component; state used by two siblings belongs in their nearest common ancestor; state used across the app belongs in a store. Lifting everything upward by default makes every component depend on the top of the tree.',
    },
  ],

  designPerspective: [
    {
      kind: 'paragraph',
      text: 'State decisions are visible to users even though users never see the code. Whether a filter survives a refresh, whether a draft survives a navigation, whether a sort order is remembered next visit — all of those are state-location decisions experienced as product quality.',
    },
    {
      kind: 'paragraph',
      text: 'Worth deciding deliberately per piece of state: does it survive a re-render, a navigation, a refresh, a new session? Four different answers, four different homes.',
    },
  ],

  engineeringPerspective: [
    {
      kind: 'code',
      language: 'ts',
      caption: 'Duplicated state, and the same thing derived.',
      code: `// Three facts that can disagree. Every mutation must update all three.
let items = [];
let completedCount = 0;
let hasItems = false;

// One fact. The rest follow and cannot be stale.
let allItems = [];
const completed = allItems.filter((item) => item.done);
const isEmpty = allItems.length === 0;`,
    },
    {
      kind: 'paragraph',
      text: 'The usual objection is performance. It is almost always wrong at interface scale: filtering a few hundred items takes microseconds, while a stale count is a bug that reaches users. Memoise when a measurement says to, not before.',
    },
  ],

  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'A design engineer reviewing a screen can ask where each visible fact comes from. If a number on screen is stored separately from the list it counts, that is a bug waiting for a code path that forgets to update it.',
    },
    {
      kind: 'paragraph',
      text: 'The same question applies to the URL. If the filtered view cannot be shared as a link, the state is in the wrong place — and that is a product decision as much as a technical one.',
    },
  ],

  industryExamples: [
    {
      id: 'example-url-state',
      source: 'GitHub search and issue filters',
      title: 'Filters that live in the URL',
      observation:
        'GitHub encodes issue filters and search queries in the URL, so any filtered view can be linked, bookmarked, and restored.',
      takeaway:
        'Putting this state in the URL turns a private view into something shareable, at no extra cost.',
    },
    {
      id: 'example-optimistic-source',
      source: 'Collaborative editors',
      title: 'One source of truth with a pending layer',
      observation:
        'Editors keep server state and unconfirmed local changes distinct rather than mutating a single shared copy.',
      takeaway:
        'Separating confirmed from pending makes rollback possible, which a single mutated copy cannot support.',
    },
  ],

  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Building a filterable list.',
    },
    { kind: 'heading', text: '1. Write down every fact on screen' },
    {
      kind: 'paragraph',
      text: 'The items, the filter, the search term, the result count, the empty message. Five things; far fewer than five are stored.',
    },
    { kind: 'heading', text: '2. Mark each as stored or derived' },
    {
      kind: 'paragraph',
      text: 'Items and filter are stored. Result count, visible rows, and which empty state to show are all derived.',
    },
    { kind: 'heading', text: '3. Decide where each stored fact lives' },
    {
      kind: 'paragraph',
      text: 'Filter and search in the URL, so the view is shareable. Items in a store or fetched. Nothing duplicated.',
    },
    { kind: 'heading', text: '4. Distinguish the two empty states' },
    {
      kind: 'paragraph',
      text: 'No items at all, and no items matching the filter, are different situations needing different messages. Both are derived, not stored.',
    },
    { kind: 'heading', text: '5. Refresh the page' },
    {
      kind: 'paragraph',
      text: 'The filtered view should return exactly as it was. If it does not, some state is in the wrong place.',
    },
  ],

  commonMistakes: [
    {
      id: 'mistake-duplicate-state',
      mistake: 'Storing a value that could be computed.',
      why: 'Two copies of a fact drift apart, and the drift shows up as a stale number long after the code path that caused it.',
      instead: 'Derive it, and memoise only if measurement demands it.',
    },
    {
      id: 'mistake-state-too-high',
      mistake: 'Lifting all state to the top of the tree.',
      why: 'Every component becomes coupled to global state and re-renders for changes it does not care about.',
      instead: 'Keep state as close to its users as possible; lift only when a second consumer appears.',
    },
    {
      id: 'mistake-url-ignored',
      mistake: 'Keeping filters and tabs in memory only.',
      why: 'Refresh loses them, the back button behaves unexpectedly, and the view cannot be shared.',
      instead: 'Put navigational state in the URL.',
    },
    {
      id: 'mistake-single-empty-state',
      mistake: 'Showing one empty state for both "nothing exists" and "nothing matches".',
      why: 'The two need different actions — create something, versus clear the filter — and one message cannot serve both.',
      instead: 'Derive which empty state applies and write both.',
    },
  ],

  eliteConsiderations: [
    {
      kind: 'list',
      items: [
        'Name state by what it is, not by what it controls — isModalOpen ties a fact to one presentation.',
        'Ask of each fact: survives a re-render, a navigation, a refresh, a new session? The answer picks the storage.',
        'Keep server state and local edits distinct so an unconfirmed change can be rolled back.',
        'Treat derived-state memoisation as an optimisation that needs evidence, not a default.',
      ],
    },
  ],

  practicalExercise: {
    id: 'exercise-05-03',
    title: 'Build a filterable list',
    prompt:
      'Build a filterable, searchable list where every fact exists in exactly one place.',
    steps: [
      'List every fact visible on screen.',
      'Mark each one stored or derived, and justify each stored one.',
      'Put the filter and search term in the URL.',
      'Derive the visible rows, the count, and the empty state.',
      'Write both empty states — nothing exists, and nothing matches.',
      'Refresh and confirm the view is restored exactly.',
      'Use the back button and confirm it moves between filter states.',
    ],
    successCriteria: [
      'No fact is stored in two places.',
      'Every derived value is computed rather than stored.',
      'The filtered view survives a refresh and can be shared as a link.',
      'The back button moves between filter states.',
      'Both empty states exist and are distinguishable.',
    ],
    estimatedMinutes: 45,
    hint: 'Write the list of visible facts before writing any code. The number you actually need to store is usually much smaller than it first appears.',
  },

  reflectionQuestion: 'Why do most interface bugs come from state?',
  reflectionHint:
    'Consider duplication. If the same truth is written down twice, what must every future code path remember to do?',

  resources: [
    {
      id: 'resource-react-state-structure',
      title: 'Choosing the state structure',
      url: 'https://react.dev/learn/choosing-the-state-structure',
      type: 'documentation',
      estimatedMinutes: 30,
      note: 'Framework-specific in places, but the principles apply anywhere.',
    },
    {
      id: 'resource-mdn-urlsearchparams',
      title: 'MDN: URLSearchParams',
      url: 'https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams',
      type: 'documentation',
      estimatedMinutes: 10,
      note: 'Reading and writing the state that lives in the URL.',
    },
  ],

  competencyTags: ['javascript', 'state-modelling', 'architecture'],

  completionCriteria: [
    'Has built a filterable list with no duplicated state.',
    'Filter state survives refresh via the URL.',
    'Both empty states are implemented.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Lesson 24                                                                   */
/* -------------------------------------------------------------------------- */

const LESSON_24: Lesson = {
  id: 'lesson-05-04',
  slug: 'dom-manipulation',
  moduleId: MODULE_ID,
  lessonNumber: 4,
  title: 'DOM Manipulation',
  summary:
    'Rendering from state, rather than editing the DOM in place, is the idea every framework is built on. It is worth learning without one.',
  estimatedMinutes: 9,

  objectives: [
    'Render an interface as a function of state.',
    'Update the DOM without destroying focus, selection, or scroll position.',
    'Explain layout thrashing and batch reads and writes to avoid it.',
    'Announce dynamic changes so they are perceivable without sight.',
  ],

  prerequisiteConcepts: ['State', 'Events', 'Accessibility tree'],
  prerequisiteLessonIds: ['lesson-05-03', 'lesson-03-04'],

  recap: [
    {
      kind: 'paragraph',
      text: 'You have state in one place and events that change it. This lesson closes the loop: turning state into what is on screen.',
    },
  ],

  coreConcept: [
    {
      kind: 'paragraph',
      text: 'There are two ways to update an interface. Imperative: find the element, change it, remember every other element this affects. Declarative: describe what the interface should look like for the current state, and let something reconcile the difference.',
    },
    {
      kind: 'paragraph',
      text: 'The declarative approach scales because the number of states is finite while the number of transitions between them is quadratic. Writing render(state) means writing a handful of cases; writing every transition means writing every pair.',
    },
    {
      kind: 'callout',
      tone: 'warning',
      body: 'Naively re-rendering by replacing innerHTML destroys focus, text selection, scroll position, and any in-flight interaction. It is the correct idea implemented in the one way that breaks the user.',
    },
  ],

  firstPrinciples: [
    {
      kind: 'paragraph',
      text: 'The browser batches style and layout work, but reading a layout property — offsetHeight, getBoundingClientRect — forces it to flush pending changes immediately so it can answer. Alternating writes and reads in a loop therefore forces a synchronous layout per iteration.',
    },
    {
      kind: 'paragraph',
      text: 'The fix is ordering, not cleverness: read everything you need first, then write. Same work, no forced layouts.',
    },
  ],

  designPerspective: [
    {
      kind: 'paragraph',
      text: 'Continuity is what makes an interface feel stable. If the list re-sorts and the row under the cursor changes identity, or the page jumps because an image loaded without reserved space, the interface feels unreliable even though nothing is technically wrong.',
    },
    {
      kind: 'paragraph',
      text: 'Preserving focus and scroll across updates is not a technical nicety. For someone navigating by keyboard, a lost focus point means starting the page again.',
    },
  ],

  engineeringPerspective: [
    {
      kind: 'code',
      language: 'ts',
      caption: 'Keyed reconciliation, and reads separated from writes.',
      code: `// Reuse nodes by key so focus, selection, and scroll survive an update.
function renderList(container: HTMLElement, items: Item[]) {
  const existing = new Map<string, HTMLElement>();
  for (const node of container.children) {
    const el = node as HTMLElement;
    if (el.dataset.key) existing.set(el.dataset.key, el);
  }

  for (const item of items) {
    const node = existing.get(item.id) ?? createRow(item);
    updateRow(node, item);
    container.append(node); // append moves an existing node; it does not clone.
    existing.delete(item.id);
  }

  for (const stale of existing.values()) stale.remove();
}

// Read first, then write. Interleaving forces a layout each iteration.
const heights = rows.map((row) => row.offsetHeight);
rows.forEach((row, i) => { row.style.height = heights[i] + 'px'; });`,
    },
    {
      kind: 'paragraph',
      text: 'An aria-live region announces changes that happen without a page navigation — a result count after filtering, a save confirmation. Without one, a sighted user sees the update and a screen reader user gets silence.',
    },
  ],

  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'This is the mechanism behind every framework in the next module. Understanding it without a framework means understanding what the framework does, which is what makes its escape hatches usable when you need them.',
    },
    {
      kind: 'paragraph',
      text: 'It also explains why keys matter in list rendering: they are how the reconciler decides whether an element is the same element, which is exactly the decision that preserves focus.',
    },
  ],

  industryExamples: [
    {
      id: 'example-virtual-dom',
      source: 'React, Vue, and similar libraries',
      title: 'Reconciliation as the core idea',
      observation:
        'These libraries take a description of the interface for the current state and compute the minimal DOM operations to reach it.',
      takeaway:
        'The mental model is render(state), and identity keys are what make the reconciliation correct.',
    },
    {
      id: 'example-cls',
      source: 'Core Web Vitals',
      title: 'Layout shift measured as a user-facing defect',
      observation:
        'Cumulative Layout Shift is a ranked metric precisely because content moving after load causes mistaken clicks and lost reading position.',
      takeaway:
        'Reserving space for dynamic content is a measurable quality property, not a detail.',
    },
  ],

  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Building a dynamic list with no framework.',
    },
    { kind: 'heading', text: '1. Write render(state)' },
    {
      kind: 'paragraph',
      text: 'One function that produces the correct interface for any state. Call it after every change and nowhere else.',
    },
    { kind: 'heading', text: '2. Give every row a stable key' },
    {
      kind: 'paragraph',
      text: 'The item id, never the array index. Index keys break the moment the list reorders.',
    },
    { kind: 'heading', text: '3. Reuse nodes rather than replacing them' },
    {
      kind: 'paragraph',
      text: 'Match by key, update in place, remove what is left. Focus and scroll survive because the node did.',
    },
    { kind: 'heading', text: '4. Announce the change' },
    {
      kind: 'paragraph',
      text: 'An aria-live="polite" region reporting the result count after a filter.',
    },
    { kind: 'heading', text: '5. Verify continuity' },
    {
      kind: 'paragraph',
      text: 'Focus a row, trigger an update, confirm focus is still there. Scroll down, update, confirm the position holds.',
    },
  ],

  commonMistakes: [
    {
      id: 'mistake-innerhtml-rerender',
      mistake: 'Re-rendering by reassigning innerHTML.',
      why: 'Every node is destroyed, so focus, selection, scroll, and in-progress input are lost.',
      instead: 'Reconcile by key and update nodes in place.',
    },
    {
      id: 'mistake-index-keys',
      mistake: 'Using array indices as keys.',
      why: 'Reordering changes which item an index refers to, so state and focus attach to the wrong row.',
      instead: 'Use a stable id belonging to the item.',
    },
    {
      id: 'mistake-layout-thrash',
      mistake: 'Reading a layout property inside a loop that also writes.',
      why: 'Each read forces a synchronous layout, turning one layout into one per iteration.',
      instead: 'Read everything first, then write.',
    },
    {
      id: 'mistake-silent-updates',
      mistake: 'Updating content with no announcement.',
      why: 'A change with no navigation and no live region is invisible to a screen reader.',
      instead: 'Announce meaningful changes in a live region.',
    },
  ],

  eliteConsiderations: [
    {
      kind: 'list',
      items: [
        'Reserve space for content that loads later — aspect-ratio and min-height prevent the shift.',
        'Batch DOM insertions with a DocumentFragment when adding many nodes at once.',
        'Restore focus deliberately when a focused element is removed, rather than letting it fall to the body.',
        'Prefer a class toggle over inline style writes; one change instead of several.',
      ],
    },
  ],

  practicalExercise: {
    id: 'exercise-05-04',
    title: 'Build a dynamic list without a framework',
    prompt:
      'Build a list that adds, removes, reorders, and filters, rendering from state and preserving continuity.',
    steps: [
      'Write a single render(state) function and call it after every change.',
      'Give each row a stable key from the item id.',
      'Reconcile by key: reuse matching nodes, update them, remove the rest.',
      'Add an aria-live region announcing the result count.',
      'Focus a row, trigger an update, and confirm focus survives.',
      'Scroll, update, and confirm the scroll position holds.',
      'Handle removal of the focused row by moving focus deliberately.',
    ],
    successCriteria: [
      'innerHTML is never used to re-render the list.',
      'Keys are item ids, not indices.',
      'Focus and scroll survive add, remove, and reorder.',
      'Changes are announced in a live region.',
      'Removing the focused row moves focus somewhere sensible.',
    ],
    estimatedMinutes: 50,
    hint: 'Append on an element already in the document moves it rather than copying it, which is what makes key-based reordering cheap.',
  },

  reflectionQuestion: 'Why do frameworks exist?',
  reflectionHint:
    'You just implemented the core idea by hand. Count the things you had to remember, and multiply by the number of components in a real application.',

  resources: [
    {
      id: 'resource-mdn-dom-intro',
      title: 'MDN: introduction to the DOM',
      url: 'https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction',
      type: 'documentation',
      estimatedMinutes: 20,
      note: 'The tree and the APIs that operate on it.',
    },
    {
      id: 'resource-avoid-layout-thrashing',
      title: 'Avoid large, complex layouts and layout thrashing',
      url: 'https://web.dev/articles/avoid-large-complex-layouts-and-layout-thrashing',
      type: 'article',
      estimatedMinutes: 20,
      note: 'Why interleaving reads and writes is expensive, with measurements.',
    },
    {
      id: 'resource-aria-live',
      title: 'MDN: ARIA live regions',
      url: 'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Live_Regions',
      type: 'documentation',
      estimatedMinutes: 15,
      note: 'Announcing changes that happen without a navigation.',
    },
  ],

  competencyTags: ['accessibility', 'javascript', 'browser-apis', 'performance'],

  completionCriteria: [
    'Has built a list rendered from state with keyed reconciliation.',
    'Focus and scroll survive updates.',
    'Changes are announced in a live region.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Lesson 25                                                                   */
/* -------------------------------------------------------------------------- */

const LESSON_25: Lesson = {
  id: 'lesson-05-05',
  slug: 'async-behaviour',
  moduleId: MODULE_ID,
  lessonNumber: 5,
  title: 'Async Behaviour',
  summary:
    'Real work takes time and can fail. How an interface behaves during that time is most of what users experience as quality.',
  estimatedMinutes: 9,

  objectives: [
    'Explain the event loop well enough to predict ordering.',
    'Handle loading, error, and empty states as first-class designs.',
    'Prevent race conditions from out-of-order responses.',
    'Choose between optimistic and confirmed updates deliberately.',
  ],

  prerequisiteConcepts: ['State', 'Rendering from state'],
  prerequisiteLessonIds: ['lesson-05-04'],

  recap: [
    {
      kind: 'paragraph',
      text: 'Everything so far has been instant. This lesson adds the delay and the failure that real work brings with it.',
    },
  ],

  coreConcept: [
    {
      kind: 'paragraph',
      text: 'JavaScript runs on a single thread with an event loop. Long synchronous work blocks everything — input, rendering, animation — which is why a busy main thread feels like a frozen interface rather than a slow one.',
    },
    {
      kind: 'paragraph',
      text: 'Any operation that takes time has at least four outcomes that a user can see, and all four need designing.',
    },
    {
      kind: 'list',
      items: [
        'Pending — it started and has not finished.',
        'Success with content.',
        'Success with nothing — the empty result, which is not an error.',
        'Failure — with a message that says what to do next.',
      ],
    },
    {
      kind: 'callout',
      tone: 'insight',
      body: 'A design that only specifies the success state is unfinished. The other three will be built by whoever implements it, at the end, under time pressure.',
    },
  ],

  firstPrinciples: [
    {
      kind: 'paragraph',
      text: 'Responses arrive in the order the network delivers them, not the order you requested them. Type "de", then "design": if the first response is slower, it arrives last and overwrites the correct results with stale ones.',
    },
    {
      kind: 'paragraph',
      text: 'The fix is to make staleness detectable. Either abort the previous request with an AbortController, or tag each request and discard any response that is not the latest. Both work; doing neither produces a bug that only appears on slow connections.',
    },
  ],

  designPerspective: [
    {
      kind: 'paragraph',
      text: 'Perceived performance is a design problem. A skeleton that matches the eventual layout feels faster than a spinner because nothing moves when the content arrives. A spinner that appears for 80ms is worse than no indicator at all, because the flash itself reads as instability.',
    },
    {
      kind: 'paragraph',
      text: 'Optimistic updates trade correctness for immediacy. They are right when failure is rare and reversal is cheap — a like button — and wrong when reversal is expensive or embarrassing, like a payment or a message that appears sent and was not.',
    },
  ],

  engineeringPerspective: [
    {
      kind: 'code',
      language: 'ts',
      caption: 'Cancelling the previous request so stale responses cannot win.',
      code: `let controller: AbortController | undefined;

async function search(query: string) {
  controller?.abort();          // discard whatever is still in flight
  controller = new AbortController();

  setState({ status: 'loading' });

  try {
    const response = await fetch(\`/api/search?q=\${encodeURIComponent(query)}\`, {
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(\`Search failed (\${response.status})\`);

    const items = await response.json();
    setState(items.length ? { status: 'ready', items } : { status: 'empty' });
  } catch (error) {
    if ((error as Error).name === 'AbortError') return; // superseded, not failed
    setState({ status: 'error', message: 'Search is unavailable. Try again.' });
  }
}`,
    },
    {
      kind: 'paragraph',
      text: 'Note that AbortError is deliberately not treated as a failure. A cancelled request was replaced, and showing an error for it would flash a message every time someone types.',
    },
    {
      kind: 'paragraph',
      text: 'Debounce the input as well, so a request is not sent per keystroke — roughly 150 to 250ms for search, measured against how fast your backend actually responds.',
    },
  ],

  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'This lesson is where the four-state discipline from Module 1 becomes concrete. Every asynchronous operation in a product is a place where a designer and an engineer must agree on what happens during, after, and instead.',
    },
    {
      kind: 'paragraph',
      text: 'The judgement call — optimistic or confirmed — is exactly the one from Lesson 1\'s reflection about renaming a project. What does it cost the user if we show success and it was not true?',
    },
  ],

  industryExamples: [
    {
      id: 'example-skeleton-screens',
      source: 'Content-heavy applications',
      title: 'Skeletons over spinners',
      observation:
        'Applications with predictable layouts show a structural placeholder while loading rather than a centred spinner.',
      takeaway:
        'The eventual content lands where the placeholder was, so nothing jumps and the wait feels shorter.',
    },
    {
      id: 'example-optimistic-messaging',
      source: 'Messaging applications',
      title: 'Pending states rather than premature success',
      observation:
        'Messages appear immediately in a pending state and are marked sent only on confirmation, with an explicit failure affordance.',
      takeaway:
        'Optimism about the placement, honesty about the status — which is how optimistic updates stay trustworthy.',
    },
  ],

  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Building search with proper async handling.',
    },
    { kind: 'heading', text: '1. Model the states before writing the fetch' },
    {
      kind: 'paragraph',
      text: 'idle, loading, ready, empty, error. A union, so the compiler enforces that all five are rendered.',
    },
    { kind: 'heading', text: '2. Debounce the input' },
    {
      kind: 'paragraph',
      text: 'One request per pause in typing, not one per keystroke.',
    },
    { kind: 'heading', text: '3. Abort the previous request' },
    {
      kind: 'paragraph',
      text: 'An AbortController per search, aborted when the next begins. Treat AbortError as cancellation, not failure.',
    },
    { kind: 'heading', text: '4. Distinguish empty from error' },
    {
      kind: 'paragraph',
      text: '"No results for design" and "Search is unavailable" require different words and different next actions.',
    },
    { kind: 'heading', text: '5. Test on a throttled connection' },
    {
      kind: 'paragraph',
      text: 'Set the network to slow 3G and type quickly. If stale results ever appear, the cancellation is not working.',
    },
  ],

  commonMistakes: [
    {
      id: 'mistake-race-condition',
      mistake: 'Ignoring the order responses arrive in.',
      why: 'A slow earlier request resolves last and overwrites newer, correct results.',
      instead: 'Abort superseded requests, or discard any response that is not the latest.',
    },
    {
      id: 'mistake-empty-as-error',
      mistake: 'Treating an empty result as a failure.',
      why: 'Nothing went wrong; the user searched for something that does not exist, and an error message misdescribes that.',
      instead: 'Design empty as its own state, with a useful next action.',
    },
    {
      id: 'mistake-spinner-flash',
      mistake: 'Showing a loading indicator immediately.',
      why: 'For fast responses it flashes, which reads as instability rather than progress.',
      instead: 'Delay the indicator by roughly 200ms, and show a skeleton matching the layout.',
    },
    {
      id: 'mistake-generic-errors',
      mistake: 'Showing "Something went wrong".',
      why: 'It tells the user nothing about whether to retry, wait, or change what they did.',
      instead: 'Say what failed and what to do next; log the detail separately.',
    },
  ],

  eliteConsiderations: [
    {
      kind: 'list',
      items: [
        'Keep previous results visible while loading new ones; blanking the list makes every search feel slower.',
        'Give retry an exponential backoff so a failing service is not hammered by every open tab.',
        'Announce result counts in a live region — an async update is silent otherwise.',
        'Break long synchronous work into chunks, or move it to a worker; the main thread belongs to input and painting.',
      ],
    },
  ],

  practicalExercise: {
    id: 'exercise-05-05',
    title: 'Build search with proper async handling',
    prompt:
      'Build a search interface that handles every asynchronous state correctly, including the ones that only appear on slow connections.',
    steps: [
      'Model the states as a union before writing any fetch code.',
      'Debounce the input so one request follows a pause in typing.',
      'Abort superseded requests and treat AbortError as cancellation.',
      'Write distinct empty and error states with distinct next actions.',
      'Delay the loading indicator so fast responses do not flash it.',
      'Keep previous results visible while loading new ones.',
      'Announce the result count in a live region.',
      'Test on a throttled connection while typing quickly.',
    ],
    successCriteria: [
      'Stale results never overwrite newer ones, even on slow 3G.',
      'Empty and error are visibly different states.',
      'No loading flash on fast responses.',
      'A cancelled request never shows an error.',
      'Result counts are announced to assistive technology.',
    ],
    estimatedMinutes: 55,
    hint: 'Throttle the network before you believe it works. Race conditions are invisible at local speeds.',
  },

  reflectionQuestion: 'How should interfaces behave while waiting?',
  reflectionHint:
    'Users judge waiting, not speed. What does the interface communicate during the wait, and what does it cost if it communicates the wrong thing?',

  resources: [
    {
      id: 'resource-mdn-event-loop',
      title: 'MDN: the event loop',
      url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Event_loop',
      type: 'documentation',
      estimatedMinutes: 25,
      note: 'Why one slow function freezes everything.',
    },
    {
      id: 'resource-mdn-abortcontroller',
      title: 'MDN: AbortController',
      url: 'https://developer.mozilla.org/en-US/docs/Web/API/AbortController',
      type: 'documentation',
      estimatedMinutes: 10,
      note: 'Cancelling in-flight work, and the AbortError that results.',
    },
    {
      id: 'resource-inp',
      title: 'Interaction to Next Paint',
      url: 'https://web.dev/articles/inp',
      type: 'article',
      estimatedMinutes: 20,
      note: 'Responsiveness measured as a user-facing metric.',
    },
  ],

  competencyTags: ['javascript', 'async-systems', 'interface-state-modelling'],

  completionCriteria: [
    'Has built search with cancellation and all async states.',
    'Verified behaviour on a throttled connection.',
    'Empty and error are distinct designs.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Project                                                                     */
/* -------------------------------------------------------------------------- */

const PROJECT: ModuleProject = {
  id: 'project-05',
  slug: 'command-palette',
  moduleId: MODULE_ID,
  title: 'Command Palette',
  brief:
    'Build a command palette with search, keyboard navigation, loading, empty state, selection, async behaviour, and correct focus management.',
  problem:
    'A command palette is small enough to finish and dense enough to be hard. It has to open from anywhere, take focus without losing the place it came from, search asynchronously without letting stale results win, be navigable entirely by keyboard, and return focus correctly when it closes. Every one of those is a place where a nearly-working implementation is obvious to the person using it.',
  objectives: [
    'Implement a modal overlay with correct focus management.',
    'Handle asynchronous search including cancellation and every result state.',
    'Build full keyboard navigation with correct ARIA relationships.',
    'Render from state rather than manipulating the DOM in place.',
  ],
  requirements: [
    'Opens with a keyboard shortcut from anywhere in the application.',
    'Asynchronous search with debouncing and cancellation.',
    'Loading, empty, error, and results states, each designed distinctly.',
    'Full keyboard navigation: arrows, Enter, Escape, Home and End.',
    'Focus trapped while open and restored to the trigger on close.',
    'The active option announced to assistive technology.',
  ],
  constraints: [
    'No component library for the palette itself.',
    'The command list must be data, so commands can be added without touching the palette.',
    'Search must not send a request per keystroke.',
    'Stale responses must never overwrite newer ones.',
  ],
  suggestedScope:
    'One palette over a small set of commands and a simulated async source with artificial latency. Do not build a real backend — the difficulty is in the interaction, not the data.',
  deliverables: [
    'A working palette meeting every requirement.',
    'A commands module defining the available commands as data.',
    'A short note recording the keyboard model and the ARIA pattern used.',
    'Evidence of testing on a throttled connection.',
  ],
  completionCriteria: [
    'Every action is reachable by keyboard alone, with the mouse unplugged.',
    'Focus returns to the triggering element on close, in every close path.',
    'Rapid typing on a throttled connection never shows stale results.',
    'Empty, error, and loading states are visibly distinct.',
    'The active option is announced when navigating with arrow keys.',
  ],
  portfolioEvidence: [
    'Async state handling and cancellation',
    'Keyboard interaction design',
    'Focus management and focus trapping',
    'Rendering from state',
    'Accessible combobox patterns',
  ],
  reflectionQuestion:
    'Which detail took longest to get right, and would a user have noticed if you had skipped it?',
  estimatedHours: 16,
  competencies: [
    'accessibility',
    'javascript',
    'state-modelling',
    'browser-apis',
    'async-systems',
    'interaction-engineering',
  ],
  stretchGoals: [
    'Add fuzzy matching with the matched characters highlighted in the results.',
    'Add nested command modes, where selecting a command opens a second step with its own state.',
  ],
};

/* -------------------------------------------------------------------------- */

export const MODULE_05: CurriculumModule = {
  id: MODULE_ID,
  slug: 'javascript-and-browser-interaction',
  moduleNumber: 5,
  phase: 'interface-craft',
  title: 'JavaScript and Browser Interaction',
  description:
    'Data shapes, the event system, state as a single source of truth, rendering from that state, and the reality that work takes time and can fail.',
  outcome: 'Understand how behaviour enters the interface.',
  prerequisites: [
    'Modules 1 to 4, or equivalent',
    'Comfort with HTML and CSS layout',
  ],
  lessons: [LESSON_21, LESSON_22, LESSON_23, LESSON_24, LESSON_25],
  resources: [
    {
      id: 'resource-module-05-mdn-js-guide',
      title: 'MDN: JavaScript guide',
      url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide',
      type: 'documentation',
      estimatedMinutes: 180,
      note: 'The reference to return to rather than read once.',
    },
    {
      id: 'resource-module-05-javascript-info',
      title: 'The Modern JavaScript Tutorial',
      url: 'https://javascript.info/',
      type: 'documentation',
      estimatedMinutes: 240,
      note: 'Thorough treatment of the event loop, events, and the DOM.',
    },
    {
      id: 'resource-module-05-apg',
      title: 'ARIA Authoring Practices: combobox',
      url: 'https://www.w3.org/WAI/ARIA/apg/patterns/combobox/',
      type: 'specification',
      estimatedMinutes: 40,
      note: 'The keyboard and ARIA model the command palette project follows.',
    },
  ],
  project: PROJECT,
  competencies: [
    'accessibility',
    'javascript',
    'state-modelling',
    'browser-apis',
    'async-systems',
    'performance',
    'architecture',
    'interface-state-modelling',
    'interaction-engineering',
  ],
  completionCriteria: [
    'All five lessons completed.',
    'Module project marked completed.',
    'Can build an interactive component without a framework.',
  ],
};
