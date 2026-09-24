/**
 * Module 06 — TypeScript, Git and Engineering Workflow.
 *
 * The practices that make code safe to change: types as stated contracts,
 * history as a record of intent, and an environment someone else can reproduce.
 */

import type { CurriculumModule, Lesson, ModuleProject } from '@/types/curriculum';

const MODULE_ID = 'module-06';

/* -------------------------------------------------------------------------- */
/* Lesson 26                                                                   */
/* -------------------------------------------------------------------------- */

const LESSON_26: Lesson = {
  id: 'lesson-06-01',
  slug: 'types-as-contracts',
  moduleId: MODULE_ID,
  lessonNumber: 1,
  title: 'Types as Contracts',
  summary:
    'A type is a promise checked before the code runs. Knowing which promises to state, and which to let the compiler work out, is the whole skill.',
  estimatedMinutes: 8,

  objectives: [
    'Explain what inference already knows and when to override it.',
    'Write function signatures that describe a contract rather than a shape.',
    'Distinguish compile-time guarantees from runtime guarantees.',
    'Decide when an explicit annotation adds information and when it adds noise.',
  ],

  prerequisiteConcepts: ['Data modelling', 'Functions and values'],
  prerequisiteLessonIds: ['lesson-05-01'],

  recap: [
    {
      kind: 'paragraph',
      text: 'Module 5 argued that a data model is a set of claims about what can be true at once. TypeScript is the tool that checks those claims before anyone runs the code.',
    },
  ],

  coreConcept: [
    {
      kind: 'paragraph',
      text: 'A type is a contract: a statement about what a value will be, checked at compile time. It says nothing at runtime — the types are erased before the browser sees the file — which means a type is a guarantee about your own code, not about data arriving from outside it.',
    },
    {
      kind: 'paragraph',
      text: 'Inference does most of the work already. Assign a string and the variable is a string; return an object and the return type is that object. Annotations are for the places where you want to state something the compiler could not know, or could know but should be prevented from widening.',
    },
    {
      kind: 'list',
      items: [
        'Annotate function parameters — nothing can infer what a caller will pass.',
        'Annotate exported boundaries, so a change to the body cannot silently change the contract.',
        'Let local variables infer; re-stating the obvious is a second thing to keep in sync.',
        'Annotate a return type when you want the compiler to check the body against your intent rather than describe it.',
      ],
    },
    {
      kind: 'callout',
      tone: 'insight',
      body: 'The useful question is not "is this typed?" but "what does this type promise, and to whom?"',
    },
  ],

  firstPrinciples: [
    {
      kind: 'paragraph',
      text: 'Types are a proof system operating on the parts of a program you control. Anything crossing the boundary — a fetch response, localStorage, a URL parameter, a third-party callback — is unverified until something at runtime checks it. Declaring the response `User` does not make it a user; it only stops the compiler asking.',
    },
    {
      kind: 'paragraph',
      text: 'That is why `any` is corrosive rather than merely lazy. It does not fail locally; it propagates, and every value derived from it silently loses its checking too. `unknown` is the honest version: it says the shape is not yet established and forces a check before use.',
    },
  ],

  designPerspective: [
    {
      kind: 'paragraph',
      text: 'Types are where the shapes a designer drew become enforceable. If a card is specified as having an optional description, `description?: string` means every consumer must handle its absence — which is the compiler insisting that the empty variant actually gets designed.',
    },
    {
      kind: 'paragraph',
      text: 'It works in the other direction too. A component whose props are a loose bag of strings is a component whose design was never settled, and the type is the first place that shows.',
    },
  ],

  engineeringPerspective: [
    {
      kind: 'code',
      language: 'ts',
      caption: 'Where an annotation carries information, and where it does not.',
      code: `// Noise: the annotation restates what the value already says.
const title: string = 'Command palette';

// Information: nothing can infer what callers will pass.
function formatDuration(ms: number, precision: 'seconds' | 'minutes'): string {
  // The return annotation makes the compiler check the body against intent,
  // rather than reporting whatever the body happens to produce.
  return precision === 'seconds'
    ? \`\${Math.round(ms / 1000)}s\`
    : \`\${Math.round(ms / 60000)}m\`;
}

// Honest about a boundary: the shape is not established until it is checked.
async function loadUser(id: string): Promise<User> {
  const data: unknown = await fetch(\`/api/users/\${id}\`).then((r) => r.json());
  return parseUser(data); // throws if the server sent something else
}`,
    },
    {
      kind: 'paragraph',
      text: 'Two compiler settings do more for correctness than most annotations. `strictNullChecks` makes null and undefined visible in the type, so the compiler can insist you handle absence. `noUncheckedIndexedAccess` makes `items[0]` possibly undefined, which is true — an array index is a guess, not a guarantee.',
    },
  ],

  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'A type signature is design documentation that cannot go stale, because the compiler rejects the code when the documentation stops matching. A comment describing a prop drifts; a type describing it cannot.',
    },
    {
      kind: 'paragraph',
      text: 'This is why component props are worth designing carefully before implementing. The props are the API, and the type is where that API is written down for everyone who will use it.',
    },
  ],

  industryExamples: [
    {
      id: 'example-ts-adoption',
      source: 'Large front-end codebases',
      title: 'Types as the refactoring tool',
      observation:
        'Teams migrating large JavaScript applications to TypeScript consistently report that the value arrives during refactoring rather than during initial authoring.',
      takeaway:
        'The return is the ability to change code confidently, which is a property of the second year, not the first week.',
    },
    {
      id: 'example-runtime-validation',
      source: 'Schema validation libraries',
      title: 'Checking the boundary at runtime',
      observation:
        'Production applications commonly validate API responses at runtime and derive the static type from that schema, so one declaration covers both.',
      takeaway:
        'It closes the gap between what the type claims and what actually arrived over the network.',
    },
  ],

  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Typing the command palette from the previous module.',
    },
    { kind: 'heading', text: '1. Start with the data, not the components' },
    {
      kind: 'paragraph',
      text: 'What is a command? An id, a label, maybe a group, and something to run. Write that type first — everything else depends on it.',
    },
    { kind: 'heading', text: '2. Type the boundaries next' },
    {
      kind: 'paragraph',
      text: 'The search function, the result states, the props of the palette. These are the contracts other code relies on.',
    },
    { kind: 'heading', text: '3. Delete annotations that repeat inference' },
    {
      kind: 'paragraph',
      text: 'Local variables holding obvious values do not need to be told what they are. If removing the annotation changes nothing, it was not carrying information.',
    },
    { kind: 'heading', text: '4. Find the lies' },
    {
      kind: 'paragraph',
      text: 'Search for `any` and for casts. Each one is a place where the compiler was told to stop checking. Replace with `unknown` plus a real check, or with an honest type.',
    },
    { kind: 'heading', text: '5. Turn on the strict flags' },
    {
      kind: 'paragraph',
      text: 'The errors that appear are not new bugs. They are existing bugs becoming visible.',
    },
  ],

  commonMistakes: [
    {
      id: 'mistake-any-escape',
      mistake: 'Reaching for `any` when a type is inconvenient.',
      why: 'It disables checking for that value and everything derived from it, silently and without a warning.',
      instead: 'Use `unknown` and narrow, which forces the check the situation actually needs.',
    },
    {
      id: 'mistake-annotate-everything',
      mistake: 'Annotating every local variable.',
      why: 'The annotation duplicates what inference already knows, and becomes a second thing to update when the value changes.',
      instead: 'Annotate boundaries — parameters, exports, returns you want checked — and let the rest infer.',
    },
    {
      id: 'mistake-trusting-boundaries',
      mistake: 'Typing a fetch response directly as its expected shape.',
      why: 'The type is erased at runtime, so nothing actually verified that the server sent it.',
      instead: 'Validate at the boundary and derive the type from the validator.',
    },
    {
      id: 'mistake-as-casting',
      mistake: 'Using `as` to silence an error.',
      why: 'It asserts a fact the compiler could not verify. If you are wrong, the failure surfaces far from the cast.',
      instead: 'Narrow with a real check, or fix the type that was wrong.',
    },
  ],

  eliteConsiderations: [
    {
      kind: 'list',
      items: [
        'Enable `noUncheckedIndexedAccess`; array access really is a guess and the type should say so.',
        'Prefer a type error at the boundary over a runtime check scattered through every consumer.',
        'Use `satisfies` when you want a value checked against a type without widening it.',
        'Treat every cast as a comment-worthy exception — if it needs no explanation, it probably needs no cast.',
      ],
    },
  ],

  practicalExercise: {
    id: 'exercise-06-01',
    title: 'Type the command palette data',
    prompt:
      'Take the command palette from the previous module and type its data and boundaries properly.',
    steps: [
      'Write the type for a single command before touching any component.',
      'Type the search function, its arguments, and every result state.',
      'Type the palette props as the contract its callers must satisfy.',
      'Remove every annotation that only restates what inference already knew.',
      'Replace each `any` and each cast with a real check or an honest type.',
      'Enable strict mode and `noUncheckedIndexedAccess`, and fix what surfaces.',
      'Validate any external data at the boundary rather than asserting its shape.',
    ],
    successCriteria: [
      'No `any` remains, and every cast has a written justification.',
      'Every exported function has explicit parameter types.',
      'Strict mode and `noUncheckedIndexedAccess` are on and the project compiles.',
      'External data is checked at runtime, not merely declared.',
      'At least three annotations were removed as redundant.',
    ],
    estimatedMinutes: 40,
    hint: 'Delete an annotation and see whether anything changes. If nothing does, it was describing rather than deciding.',
  },

  reflectionQuestion: 'Should everything receive an explicit type annotation?',
  reflectionHint: 'Inference is also information.',

  resources: [
    {
      id: 'resource-ts-everyday',
      title: 'TypeScript: everyday types',
      url: 'https://www.typescriptlang.org/docs/handbook/2/everyday-types.html',
      type: 'documentation',
      estimatedMinutes: 30,
      note: 'The working vocabulary, with inference explained alongside annotation.',
    },
    {
      id: 'resource-ts-tsconfig-strict',
      title: 'TSConfig reference: strict',
      url: 'https://www.typescriptlang.org/tsconfig/#strict',
      type: 'documentation',
      estimatedMinutes: 15,
      note: 'What each strictness flag actually turns on.',
    },
  ],

  competencyTags: ['typescript', 'architecture'],

  completionCriteria: [
    'Has typed a real project\'s data and boundaries.',
    'No `any` remains without a written justification.',
    'Can explain what a type does and does not guarantee at runtime.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Lesson 27                                                                   */
/* -------------------------------------------------------------------------- */

const LESSON_27: Lesson = {
  id: 'lesson-06-02',
  slug: 'objects-unions-and-interfaces',
  moduleId: MODULE_ID,
  lessonNumber: 2,
  title: 'Objects, Unions and Interfaces',
  summary:
    'A union of states with a shared tag lets the compiler prove that every case has been handled — including the ones a designer forgot.',
  estimatedMinutes: 9,

  objectives: [
    'Compose object types and choose between interface and type alias.',
    'Use literal types to constrain a value to a known set.',
    'Narrow a union safely and let the compiler check exhaustiveness.',
    'Model asynchronous states as a discriminated union.',
  ],

  prerequisiteConcepts: ['Types as contracts', 'Async states'],
  prerequisiteLessonIds: ['lesson-06-01', 'lesson-05-05'],

  recap: [
    {
      kind: 'paragraph',
      text: 'You can state a contract. This lesson is about stating one precise enough that the contradictory cases stop existing.',
    },
  ],

  coreConcept: [
    {
      kind: 'paragraph',
      text: 'A union type says a value is one of several things. A literal type narrows a primitive to specific values, so `\'loading\'` is a type with exactly one member. Combine them and a status becomes a closed set rather than an open string.',
    },
    {
      kind: 'paragraph',
      text: 'A discriminated union adds a shared field whose literal value identifies the variant. Checking that field narrows the type, so the compiler knows which other fields exist — and refuses access to the ones that do not.',
    },
    {
      kind: 'list',
      items: [
        '`interface` — extendable, mergeable, conventional for object contracts and component props.',
        '`type` — required for unions, intersections, mapped and conditional types.',
        'Literal types — `\'primary\' | \'danger\'` instead of `string`.',
        'The discriminant — one shared field, a literal in every member, that identifies which case you are in.',
      ],
    },
    {
      kind: 'callout',
      tone: 'insight',
      body: 'Three independent booleans describe eight states. A four-member union describes four. The difference is the five contradictions that no longer need a design.',
    },
  ],

  firstPrinciples: [
    {
      kind: 'paragraph',
      text: 'Narrowing works because control flow carries type information. Inside `if (result.status === \'error\')`, the compiler knows the value is the error member and that `result.message` exists — not because you asserted it, but because it followed the same reasoning a reader does.',
    },
    {
      kind: 'paragraph',
      text: 'Exhaustiveness follows from that. Assign the narrowed value to `never` in a default branch and adding a sixth state becomes a compile error at every switch that handles five. The compiler becomes the thing that remembers where the new state needs designing.',
    },
  ],

  designPerspective: [
    {
      kind: 'paragraph',
      text: 'The union is the list of screens. Every member is a thing a user can see, and a member with no design is a gap that will be filled by whoever implements it last.',
    },
    {
      kind: 'paragraph',
      text: 'It also disciplines the request for a new state. "Can we add a partially-saved state?" becomes visible as a sixth member with concrete consequences, rather than a flag someone adds quietly.',
    },
  ],

  engineeringPerspective: [
    {
      kind: 'code',
      language: 'ts',
      caption: 'A discriminated union, narrowed exhaustively.',
      code: `type RequestState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'empty' }
  | { status: 'error'; message: string; retryable: boolean }
  | { status: 'ready'; data: T };

function render(state: RequestState<Command[]>) {
  switch (state.status) {
    case 'idle':    return placeholder();
    case 'loading': return skeleton();
    case 'empty':   return emptyState();
    // state.message exists here; it does not exist in the branches above.
    case 'error':   return errorState(state.message, state.retryable);
    case 'ready':   return results(state.data);
    default: {
      // Adding a sixth member makes this line a compile error.
      const unhandled: never = state;
      return unhandled;
    }
  }
}`,
    },
    {
      kind: 'paragraph',
      text: 'Note what the type prevents: there is no way to hold `data` and `message` at once, no way to be loading and ready, and no way to read `message` without first proving you are in the error case.',
    },
  ],

  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'This is the clearest place where a type is a design artefact. The union is a specification of every state the interface can be in, written somewhere both disciplines can read, and enforced.',
    },
    {
      kind: 'paragraph',
      text: 'A design review that walks the union member by member finds the missing empty state before it becomes a bug report, because the list is right there and cannot be incomplete without the compiler saying so.',
    },
  ],

  industryExamples: [
    {
      id: 'example-query-status',
      source: 'Data-fetching libraries',
      title: 'One status field, narrowed',
      observation:
        'Modern query libraries expose a single discriminated status so that data is only accessible once the success case is proven.',
      takeaway:
        'Reading data in the loading branch stops being a bug you catch in review and becomes one the compiler catches.',
    },
    {
      id: 'example-variant-literals',
      source: 'Component libraries',
      title: 'Variants as literal unions',
      observation:
        'Well-built component APIs type variants as `\'primary\' | \'secondary\' | \'danger\'` rather than as `string`, so editors autocomplete and typos fail to compile.',
      takeaway:
        'The design system becomes discoverable from inside the editor, which is where adoption actually happens.',
    },
  ],

  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Modelling request states.',
    },
    { kind: 'heading', text: '1. Enumerate the states before typing them' },
    {
      kind: 'paragraph',
      text: 'Idle, loading, empty, error, ready. Write them as words, because this is the design conversation.',
    },
    { kind: 'heading', text: '2. Give each member only the data it truly has' },
    {
      kind: 'paragraph',
      text: 'Loading has nothing. Error has a message. Ready has data. Resist adding fields "just in case" — that is how the contradictions creep back in.',
    },
    { kind: 'heading', text: '3. Narrow, never assert' },
    {
      kind: 'paragraph',
      text: 'Switch on the discriminant. If you find yourself casting to reach a field, the check is in the wrong place.',
    },
    { kind: 'heading', text: '4. Add the never guard' },
    {
      kind: 'paragraph',
      text: 'The default branch assigns to `never`. This is what makes adding a state a compile error rather than a silent omission.',
    },
    { kind: 'heading', text: '5. Add a sixth state and watch it fail' },
    {
      kind: 'paragraph',
      text: 'Add `{ status: \'stale\' }` temporarily. Every place needing an update should now refuse to compile. That list is the real value.',
    },
  ],

  commonMistakes: [
    {
      id: 'mistake-optional-fields-union',
      mistake: 'Using one object with optional fields instead of a union.',
      why: '`{ data?: T; error?: string; loading?: boolean }` permits every contradictory combination and forces every consumer to guess.',
      instead: 'Use a union where each member carries exactly its own data.',
    },
    {
      id: 'mistake-string-status',
      mistake: 'Typing a status as `string`.',
      why: 'Typos compile, the set of states is undiscoverable, and narrowing cannot work.',
      instead: 'Use a literal union.',
    },
    {
      id: 'mistake-no-exhaustive-check',
      mistake: 'Omitting the `never` guard in a switch.',
      why: 'Adding a state compiles fine and silently renders nothing, which is the hardest class of bug to notice.',
      instead: 'Assign the narrowed value to `never` in the default branch.',
    },
    {
      id: 'mistake-enum-reflex',
      mistake: 'Reaching for `enum` by habit.',
      why: 'TypeScript enums emit runtime code and interoperate awkwardly with plain data and JSON.',
      instead: 'Use a literal union, or a const object with a derived type.',
    },
  ],

  eliteConsiderations: [
    {
      kind: 'list',
      items: [
        'Name the discriminant consistently across the codebase — `status`, `kind`, or `type`, but one of them.',
        'Keep union members shallow; a member that itself needs a union is usually two states wearing one name.',
        'Derive prop types from the union so a component cannot accept an impossible combination.',
        'Prefer `interface` for object contracts others extend, `type` for everything algebraic.',
      ],
    },
  ],

  practicalExercise: {
    id: 'exercise-06-02',
    title: 'Model request states as a discriminated union',
    prompt:
      'Replace a boolean-flag request model with a discriminated union and prove exhaustiveness.',
    steps: [
      'Write the states as words before writing any type.',
      'Define the union with one shared discriminant field.',
      'Give each member only the data that state actually has.',
      'Render with a switch that narrows on the discriminant.',
      'Add a `never` guard in the default branch.',
      'Temporarily add a sixth state and record every location that fails to compile.',
      'Remove the sixth state and confirm the project compiles again.',
    ],
    successCriteria: [
      'No optional fields are used to represent state.',
      'Every field access is reached through narrowing, with no casts.',
      'A `never` guard makes an added state a compile error.',
      'The list of locations that failed to compile is recorded.',
      'Status is a literal union, never `string`.',
    ],
    estimatedMinutes: 40,
    hint: 'If you need a cast to reach a field, the narrowing is missing rather than the type being wrong.',
  },

  reflectionQuestion:
    'Why is `status: "loading" | "success" | "error"` stronger than several booleans?',
  reflectionHint: 'Impossible combinations disappear.',

  resources: [
    {
      id: 'resource-ts-narrowing-06',
      title: 'TypeScript: narrowing',
      url: 'https://www.typescriptlang.org/docs/handbook/2/narrowing.html',
      type: 'documentation',
      estimatedMinutes: 35,
      note: 'Control-flow analysis, discriminated unions, and exhaustiveness with `never`.',
    },
    {
      id: 'resource-ts-objects',
      title: 'TypeScript: object types',
      url: 'https://www.typescriptlang.org/docs/handbook/2/objects.html',
      type: 'documentation',
      estimatedMinutes: 25,
      note: 'Interfaces, intersections, and when each is the right tool.',
    },
  ],

  competencyTags: ['typescript', 'state-modelling', 'interface-state-modelling'],

  completionCriteria: [
    'Has replaced a boolean-flag model with a discriminated union.',
    'Exhaustiveness is enforced with a `never` guard.',
    'Can explain why the union removes states rather than renaming them.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Lesson 28                                                                   */
/* -------------------------------------------------------------------------- */

const LESSON_28: Lesson = {
  id: 'lesson-06-03',
  slug: 'git-mental-model',
  moduleId: MODULE_ID,
  lessonNumber: 3,
  title: 'Git Mental Model',
  summary:
    'Git stores snapshots, not changes. Once that is clear, staging and commits stop being ceremony and become a way to record intent.',
  estimatedMinutes: 9,

  objectives: [
    'Describe the repository, working tree, staging area, and commit as four distinct places.',
    'Use staging deliberately to shape what a commit contains.',
    'Read a diff and say what changed and why.',
    'Choose commit boundaries that describe one understandable change.',
  ],

  prerequisiteConcepts: ['Working on a real project'],

  recap: [
    {
      kind: 'paragraph',
      text: 'Types make a single version of the code safer. History makes the sequence of versions legible.',
    },
  ],

  coreConcept: [
    {
      kind: 'paragraph',
      text: 'Git has four places a file can exist, and almost every confusing moment comes from not knowing which one you are talking about.',
    },
    {
      kind: 'list',
      items: [
        'The working tree — the files on disk as you edit them.',
        'The staging area — what you have chosen to include in the next commit.',
        'The repository — the committed history, stored as complete snapshots.',
        'The remote — someone else\'s copy of that history.',
      ],
    },
    {
      kind: 'paragraph',
      text: 'A commit is a full snapshot of the tracked tree plus a pointer to its parent. Diffs are computed between snapshots when you ask for them; they are not what is stored. This is why moving between commits is fast and why history is stable rather than reconstructed.',
    },
    {
      kind: 'callout',
      tone: 'insight',
      body: 'Staging exists so the commit is a decision rather than a byproduct of when you happened to save.',
    },
  ],

  firstPrinciples: [
    {
      kind: 'paragraph',
      text: 'History is written to be read later, usually by someone trying to answer a question under pressure: why is this line here, when did this break, what else changed with it. A commit answers those questions or it does not.',
    },
    {
      kind: 'paragraph',
      text: 'That gives a concrete test for a boundary. A commit is well-scoped if it can be described in one sentence without "and", if it could be reverted on its own, and if the project still works with it applied. Time is not a boundary; a coherent change is.',
    },
  ],

  designPerspective: [
    {
      kind: 'paragraph',
      text: 'Git history is the record of how a product actually evolved — not the tidy version told afterwards, but the sequence of decisions. For a designer working in code it is the most honest changelog available.',
    },
    {
      kind: 'paragraph',
      text: 'It also carries design rationale. A commit that says "Increase dialog padding so the destructive action is not adjacent to Cancel" preserves a reason that would otherwise survive only in someone\'s memory.',
    },
  ],

  engineeringPerspective: [
    {
      kind: 'code',
      language: 'bash',
      caption: 'Shaping a commit rather than accepting one.',
      code: `git status            # which of the four places is each change in
git diff              # working tree vs staged: what I have not yet chosen
git diff --staged     # staged vs last commit: what this commit will contain

git add -p            # stage by hunk, so unrelated changes can be split apart
git commit            # write the message in an editor, not with -m

git log --oneline     # the shape of the history
git log -p path/to/file   # every change to one file, with reasons`,
    },
    {
      kind: 'paragraph',
      text: 'A message has two jobs. The subject line says what changed, in the imperative and under about fifty characters. The body says why — the constraint, the bug, the decision — because the what is already visible in the diff and the why is not recoverable from it.',
    },
  ],

  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'Commits are how design intent survives contact with maintenance. Six months later, the only trace of why a threshold is 250ms rather than 400ms may be the commit that set it.',
    },
    {
      kind: 'paragraph',
      text: 'This is also the point at which a designer who codes stops being a guest in the repository. Reading history is how you learn what a codebase has already tried.',
    },
  ],

  industryExamples: [
    {
      id: 'example-git-bisect',
      source: 'Debugging practice',
      title: 'History as a search space',
      observation:
        '`git bisect` finds the commit that introduced a bug by binary search, which only works when each commit is individually coherent and leaves the project working.',
      takeaway:
        'Commit hygiene is not tidiness. It is what makes an entire debugging technique available.',
    },
    {
      id: 'example-commit-conventions',
      source: 'Open-source projects',
      title: 'Messages written for strangers',
      observation:
        'Long-lived projects require a subject and a body explaining motivation, because most readers of a commit will be people with no context.',
      takeaway:
        'In a personal project the stranger is you, next year, with the reasoning gone.',
    },
  ],

  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Committing one iteration of a project properly.',
    },
    { kind: 'heading', text: '1. Look before staging' },
    {
      kind: 'paragraph',
      text: '`git status` then `git diff`. Know what you actually changed before deciding how to group it.',
    },
    { kind: 'heading', text: '2. Group by change, not by file' },
    {
      kind: 'paragraph',
      text: 'One fix touching four files is one commit. Four unrelated fixes in one file are four.',
    },
    { kind: 'heading', text: '3. Stage in pieces' },
    {
      kind: 'paragraph',
      text: '`git add -p` to take only the hunks belonging to this change. This is where the boundary is actually drawn.',
    },
    { kind: 'heading', text: '4. Review what you are about to commit' },
    {
      kind: 'paragraph',
      text: '`git diff --staged`. Stray debug lines and commented-out code surface here, before they are permanent.',
    },
    { kind: 'heading', text: '5. Write the why in the body' },
    {
      kind: 'paragraph',
      text: 'Subject in the imperative. Body explaining the reason and anything you considered and rejected.',
    },
    { kind: 'heading', text: '6. Read your own log' },
    {
      kind: 'paragraph',
      text: '`git log --oneline`. If the sequence does not tell the story of the iteration, the boundaries were wrong.',
    },
  ],

  commonMistakes: [
    {
      id: 'mistake-commit-everything',
      mistake: 'Running `git add .` and committing whatever is there.',
      why: 'The commit becomes whatever you happened to touch, which cannot be reverted or reviewed as one idea.',
      instead: 'Stage deliberately, by hunk when necessary.',
    },
    {
      id: 'mistake-what-not-why',
      mistake: 'Writing messages that restate the diff.',
      why: '"Update styles" adds nothing the diff does not already show, and the reason is lost permanently.',
      instead: 'Say why in the body; the what is already visible.',
    },
    {
      id: 'mistake-wip-commits',
      mistake: 'Committing broken intermediate states on a shared branch.',
      why: 'Bisecting stops working and reverting becomes unsafe, because no single commit is a valid version.',
      instead: 'Keep each commit working; clean up locally before sharing.',
    },
    {
      id: 'mistake-huge-commits',
      mistake: 'One enormous commit at the end of a session.',
      why: 'Nothing in it can be reviewed, reverted, or understood independently.',
      instead: 'Commit at each coherent step, while the reasoning is still fresh.',
    },
  ],

  eliteConsiderations: [
    {
      kind: 'list',
      items: [
        'Write the message before staging; if it needs "and", the commit needs splitting.',
        'Keep formatting-only changes in their own commit so they never hide a behaviour change.',
        'Use `git add -p` routinely — it is the fastest review of your own work you will ever do.',
        'Treat `.gitignore` as part of the design: generated files in history make every future diff noisier.',
      ],
    },
  ],

  practicalExercise: {
    id: 'exercise-06-03',
    title: 'Create meaningful commits for one project iteration',
    prompt:
      'Take one iteration of a project and commit it as a readable sequence of coherent changes.',
    steps: [
      'Review the full diff before staging anything.',
      'Write down the list of distinct changes you made.',
      'Stage and commit each one separately, using `git add -p` where files contain more than one change.',
      'Review `git diff --staged` before each commit.',
      'Write a subject in the imperative and a body explaining why.',
      'Confirm the project works at every commit.',
      'Read `git log --oneline` and check it tells the story of the iteration.',
    ],
    successCriteria: [
      'Every commit describes one change, with no "and" in the subject.',
      'Every message body explains a reason, not a restatement of the diff.',
      'The project builds and runs at each commit.',
      'At least one commit was split with `git add -p`.',
      'No debug code or commented-out blocks are present in any commit.',
    ],
    estimatedMinutes: 40,
    hint: 'Write the commit message first. If you cannot write it without "and", you have two commits.',
  },

  reflectionQuestion: 'What makes a strong commit boundary?',
  reflectionHint: 'Think one understandable change.',

  resources: [
    {
      id: 'resource-pro-git-basics',
      title: 'Pro Git: Git basics',
      url: 'https://git-scm.com/book/en/v2/Getting-Started-What-is-Git%3F',
      type: 'book',
      author: 'Scott Chacon and Ben Straub',
      estimatedMinutes: 45,
      note: 'The snapshot model explained properly, which is what makes everything else make sense.',
    },
    {
      id: 'resource-commit-messages',
      title: 'How to write a Git commit message',
      url: 'https://cbea.ms/git-commit/',
      type: 'article',
      author: 'Chris Beams',
      estimatedMinutes: 15,
      note: 'The conventions, with the reasoning behind each one.',
    },
  ],

  competencyTags: ['architecture', 'git'],

  completionCriteria: [
    'Has committed one iteration as a readable sequence.',
    'Every message explains why, not just what.',
    'The project works at every commit.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Lesson 29                                                                   */
/* -------------------------------------------------------------------------- */

const LESSON_29: Lesson = {
  id: 'lesson-06-04',
  slug: 'branches-and-pull-requests',
  moduleId: MODULE_ID,
  lessonNumber: 4,
  title: 'Branches and Pull Requests',
  summary:
    'A branch isolates work in progress. A pull request is where a change is explained, examined, and agreed before it becomes shared history.',
  estimatedMinutes: 9,

  objectives: [
    'Explain what a branch is in terms of commits and pointers.',
    'Merge and resolve a conflict without guessing.',
    'Read a diff critically, including your own.',
    'Write a pull request that gives a reviewer what they need.',
  ],

  prerequisiteConcepts: ['Commits and diffs'],
  prerequisiteLessonIds: ['lesson-06-03'],

  recap: [
    {
      kind: 'paragraph',
      text: 'A commit is a snapshot with a parent. A branch is just a movable name pointing at one of those snapshots — which is why creating one is instant.',
    },
  ],

  coreConcept: [
    {
      kind: 'paragraph',
      text: 'Because commits link to their parents, history is a graph. A branch is a label on a node in that graph, and committing moves the label forward. Nothing is copied, which is why branching is cheap and why merging is a graph operation rather than a file operation.',
    },
    {
      kind: 'paragraph',
      text: 'A merge finds the common ancestor of two branches and combines the changes each made since then. A conflict is not an error — it is Git declining to guess when both sides changed the same lines.',
    },
    {
      kind: 'list',
      items: [
        'Branch — a moving pointer to a commit.',
        'Merge — combine two lines of history, creating a commit with two parents.',
        'Conflict — both sides changed the same region; a human decides.',
        'Pull request — the place a change is explained and reviewed before it lands.',
      ],
    },
    {
      kind: 'callout',
      tone: 'warning',
      body: 'Resolving a conflict by taking one side wholesale is how work silently disappears. Read both sides and decide what the combined result should be.',
    },
  ],

  firstPrinciples: [
    {
      kind: 'paragraph',
      text: 'Review exists because the author is the worst possible reader of their own change: they know what they meant, so they see intent rather than text. Distance — a day, a different view, a checklist — restores some of what a second reader would have.',
    },
    {
      kind: 'paragraph',
      text: 'The diff is what actually ships, not the plan. Reading it as a stranger is the only reliable way to catch the debug line, the stale comment, the accidental removal, and the thing that works but contradicts how the rest of the codebase does it.',
    },
  ],

  designPerspective: [
    {
      kind: 'paragraph',
      text: 'Design intent changes through code. A spacing value adjusted during implementation, a state quietly dropped because it was awkward, an error message rewritten to fit — none of these appear in the design file, and all of them appear in the diff.',
    },
    {
      kind: 'paragraph',
      text: 'A designer who can read a diff can review the product as built rather than as drawn, which is the version users get. It also changes the conversation: a specific line is a much more productive object of discussion than a general impression.',
    },
  ],

  engineeringPerspective: [
    {
      kind: 'code',
      language: 'bash',
      caption: 'A feature branch, reviewed before merging.',
      code: `git switch -c palette-keyboard-nav    # branch from the current commit

# ... commits ...

git fetch origin
git rebase origin/main    # replay my commits on top of current main

# Read the whole change as one diff, as a reviewer would see it.
git diff origin/main...HEAD

git switch main
git merge --no-ff palette-keyboard-nav   # keep the branch visible in history`,
    },
    {
      kind: 'paragraph',
      text: 'Rebase before merging so conflicts are resolved in your branch rather than in the shared one, and so the final diff is against current main. Rebase only what you have not shared — rewriting published history creates a second, conflicting version for everyone else.',
    },
  ],

  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'A pull request is a design artefact as much as an engineering one. It states what changed, why, what was considered and rejected, and what a reviewer should look at closely.',
    },
    {
      kind: 'paragraph',
      text: 'Screenshots of before and after belong in it. So does a note about which states you checked, because a reviewer cannot tell from a diff whether the empty state was tested.',
    },
  ],

  industryExamples: [
    {
      id: 'example-pr-description',
      source: 'GitHub pull request conventions',
      title: 'Context supplied with the change',
      observation:
        'Effective pull requests state the problem, the approach, what was rejected, and how the change was verified — the diff shows only the result.',
      takeaway:
        'The description is where the reasoning lives, and it is the part that survives into the merge commit.',
    },
    {
      id: 'example-small-prs',
      source: 'Code review research and practice',
      title: 'Review quality falls with size',
      observation:
        'Teams consistently find that defect detection drops sharply once a change exceeds a few hundred lines, because reviewers begin skimming.',
      takeaway:
        'A large pull request is not reviewed more thoroughly. It is reviewed less thoroughly, with more confidence.',
    },
  ],

  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Reviewing your own change before merging it.',
    },
    { kind: 'heading', text: '1. Branch for the change, not for the day' },
    {
      kind: 'paragraph',
      text: 'One branch, one purpose, named after what it does.',
    },
    { kind: 'heading', text: '2. Rebase onto current main' },
    {
      kind: 'paragraph',
      text: 'Resolve conflicts here, in your branch, where you understand both sides.',
    },
    { kind: 'heading', text: '3. Read the whole diff as a stranger' },
    {
      kind: 'paragraph',
      text: '`git diff main...HEAD`. Look for debug code, unrelated changes, stale comments, and anything you would question in someone else\'s work.',
    },
    { kind: 'heading', text: '4. Write the description before merging' },
    {
      kind: 'paragraph',
      text: 'Problem, approach, alternatives rejected, how you verified it, what a reviewer should look at.',
    },
    { kind: 'heading', text: '5. Check the states, not just the code' },
    {
      kind: 'paragraph',
      text: 'Empty, error, loading, keyboard-only. Note which ones you actually exercised.',
    },
    { kind: 'heading', text: '6. Merge with a merge commit' },
    {
      kind: 'paragraph',
      text: '`--no-ff` keeps the branch visible, so the grouping of commits survives in the history.',
    },
  ],

  commonMistakes: [
    {
      id: 'mistake-long-branch',
      mistake: 'Keeping a branch alive for weeks.',
      why: 'It diverges from main until merging becomes a large, risky conflict resolution nobody wants to do.',
      instead: 'Keep branches short; integrate frequently.',
    },
    {
      id: 'mistake-conflict-pick-side',
      mistake: 'Resolving conflicts by accepting one side entirely.',
      why: 'The other side\'s work disappears silently and the tests may still pass.',
      instead: 'Read both, decide what the combined result should be, and verify it.',
    },
    {
      id: 'mistake-no-self-review',
      mistake: 'Merging without reading your own diff.',
      why: 'Debug statements, commented code, and accidental changes ship because nobody ever looked at the final text.',
      instead: 'Read the full diff before every merge, without exception.',
    },
    {
      id: 'mistake-rebase-shared',
      mistake: 'Rebasing a branch others have pulled.',
      why: 'It rewrites commits that already exist elsewhere, creating divergent copies of the same work.',
      instead: 'Rebase only unshared history; merge otherwise.',
    },
  ],

  eliteConsiderations: [
    {
      kind: 'list',
      items: [
        'Open the pull request early as a draft, so the approach can be questioned before the work is finished.',
        'Include before and after screenshots for anything visual — a diff cannot show a layout.',
        'List what you did not test, explicitly. Silence reads as coverage.',
        'Review your own diff after a break; same-session review sees intent instead of text.',
      ],
    },
  ],

  practicalExercise: {
    id: 'exercise-06-04',
    title: 'Review your own diff before merging',
    prompt:
      'Take a feature branch through rebase, self-review, description, and merge.',
    steps: [
      'Create a feature branch named after the change it makes.',
      'Make the change across several coherent commits.',
      'Rebase onto current main and resolve any conflict by reading both sides.',
      'Read the full branch diff as though someone else wrote it, and list what you would question.',
      'Fix everything on that list.',
      'Write a description: problem, approach, alternatives rejected, verification.',
      'Record which interface states you actually exercised, and which you did not.',
      'Merge with `--no-ff`.',
    ],
    successCriteria: [
      'The branch has a single clear purpose.',
      'A written self-review list exists, and every item was addressed.',
      'The description states the problem, the approach, and what was rejected.',
      'Untested states are named explicitly rather than omitted.',
      'No debug code or unrelated changes are in the final diff.',
    ],
    estimatedMinutes: 45,
    hint: 'Read the diff after a break. Reviewing immediately after writing, you see what you meant rather than what is there.',
  },

  reflectionQuestion: 'Why should designers who code learn to read diffs?',
  reflectionHint: 'Design intent also changes through code.',

  resources: [
    {
      id: 'resource-pro-git-branching',
      title: 'Pro Git: branching',
      url: 'https://git-scm.com/book/en/v2/Git-Branching-Branches-in-a-Nutshell',
      type: 'book',
      author: 'Scott Chacon and Ben Straub',
      estimatedMinutes: 40,
      note: 'Branches as pointers, with the graph drawn out.',
    },
    {
      id: 'resource-github-prs',
      title: 'GitHub: about pull requests',
      url: 'https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests',
      type: 'documentation',
      estimatedMinutes: 20,
      note: 'The mechanics, and the review affordances built around them.',
    },
  ],

  competencyTags: ['critique', 'git'],

  completionCriteria: [
    'Has taken a branch through rebase, self-review, and merge.',
    'A written self-review list exists and was acted on.',
    'Can read a diff and identify what to question.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Lesson 30                                                                   */
/* -------------------------------------------------------------------------- */

const LESSON_30: Lesson = {
  id: 'lesson-06-05',
  slug: 'packages-and-development-environments',
  moduleId: MODULE_ID,
  lessonNumber: 5,
  title: 'Packages and Development Environments',
  summary:
    'A project someone else cannot run is a project that only exists on your machine. Reproducibility is a deliverable, not an afterthought.',
  estimatedMinutes: 9,

  objectives: [
    'Explain what a package manager and a lockfile actually guarantee.',
    'Distinguish runtime dependencies from development dependencies.',
    'Describe the path from source to built output.',
    'Judge the real cost of adding a dependency.',
  ],

  prerequisiteConcepts: ['Running a project locally', 'Version control'],
  prerequisiteLessonIds: ['lesson-06-04'],

  recap: [
    {
      kind: 'paragraph',
      text: 'History records how the code changed. The environment is what turns that code into something that runs — and it has to be reproducible for the history to be worth anything.',
    },
  ],

  coreConcept: [
    {
      kind: 'paragraph',
      text: 'A package manager resolves a graph of declared dependencies into a concrete tree of installed versions. `package.json` states what you want, usually as a range. The lockfile records exactly what was resolved, including every transitive dependency you never chose.',
    },
    {
      kind: 'list',
      items: [
        'dependencies — needed at runtime, shipped to users.',
        'devDependencies — needed to build, test, or lint; never shipped.',
        'The lockfile — the exact resolved tree, committed so everyone installs the same thing.',
        'Scripts — the documented entry points: dev, build, test, lint.',
      ],
    },
    {
      kind: 'paragraph',
      text: 'The build turns source into artefacts the browser can use: TypeScript compiled away, modules bundled, CSS processed, assets hashed. Development and production builds differ substantially, which is why "it works in dev" is not evidence.',
    },
    {
      kind: 'callout',
      tone: 'warning',
      body: 'A lockfile that is not committed means every machine may resolve a different tree. Most "works on my machine" bugs are exactly this.',
    },
  ],

  firstPrinciples: [
    {
      kind: 'paragraph',
      text: 'Every dependency is code you did not write, running inside your product, that you are nonetheless responsible for. It carries its own dependencies, its own release schedule, its own bugs, and its own eventual abandonment.',
    },
    {
      kind: 'paragraph',
      text: 'So the real cost is not install size. It is the maintenance surface: the upgrades you will have to do, the breaking changes you will have to absorb, the security advisories you will have to answer, and the day the package stops being maintained and the choice becomes fork or rewrite.',
    },
  ],

  designPerspective: [
    {
      kind: 'paragraph',
      text: 'Dependencies show up in the product. A date picker chosen for convenience brings its own interaction model, its own focus behaviour, and its own visual language — and overriding all three is usually more work than building the thing.',
    },
    {
      kind: 'paragraph',
      text: 'They also show up as weight. A heavy component library on a marketing page is a slower first load for every visitor, which is a design outcome that was decided during installation.',
    },
  ],

  engineeringPerspective: [
    {
      kind: 'code',
      language: 'json',
      caption: 'Scripts are the documented interface to a project.',
      code: `{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit",
    "test": "vitest run"
  }
}`,
    },
    {
      kind: 'paragraph',
      text: 'Use `npm ci` rather than `npm install` when you want exactly what the lockfile says: it installs the locked tree and fails if `package.json` and the lockfile disagree, instead of quietly reconciling them.',
    },
    {
      kind: 'paragraph',
      text: 'A README that lists prerequisites with versions, the install command, the run command, and the check commands is the difference between a project someone can pick up and one they abandon after twenty minutes.',
    },
  ],

  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'Reproducibility is what lets a designer actually run the product and evaluate it in motion, at real speed, with real states — rather than judging screenshots.',
    },
    {
      kind: 'paragraph',
      text: 'Lowering that barrier changes who can participate in reviewing the built thing, which changes what gets caught before release.',
    },
  ],

  industryExamples: [
    {
      id: 'example-lockfile-ci',
      source: 'Continuous integration practice',
      title: 'Installing from the lock, not the range',
      observation:
        'CI pipelines use lockfile-exact installs so the tested tree is the tree that was committed.',
      takeaway:
        'Without it, a passing build proves only that some resolution worked once.',
    },
    {
      id: 'example-dependency-cost',
      source: 'JavaScript ecosystem incidents',
      title: 'Transitive dependencies as real risk',
      observation:
        'Well-known breakages have originated in tiny transitive packages that no application author chose or had heard of.',
      takeaway:
        'You adopt an entire subtree, not a single package, and you own its failures.',
    },
  ],

  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Documenting a project so it runs from a fresh clone.',
    },
    { kind: 'heading', text: '1. Actually clone it fresh' },
    {
      kind: 'paragraph',
      text: 'Into a new directory, with no node_modules and no local config. Assumptions surface immediately.',
    },
    { kind: 'heading', text: '2. Write down every step as you take it' },
    {
      kind: 'paragraph',
      text: 'Including the ones you do without thinking — the Node version, the environment file, the one command that must run first.',
    },
    { kind: 'heading', text: '3. Name versions, not just tools' },
    {
      kind: 'paragraph',
      text: '"Node 20 or later" is a prerequisite; "Node" is a guess.',
    },
    { kind: 'heading', text: '4. Expose the checks as scripts' },
    {
      kind: 'paragraph',
      text: 'lint, typecheck, test, build. Someone should be able to verify the project without knowing your tooling.',
    },
    { kind: 'heading', text: '5. Audit the dependency list' },
    {
      kind: 'paragraph',
      text: 'For each one: what it does, why it was chosen, what replacing it would cost. Anything you cannot answer is a candidate for removal.',
    },
    { kind: 'heading', text: '6. Have the README tested' },
    {
      kind: 'paragraph',
      text: 'Follow it yourself on a clean machine, or give it to someone else. Every gap they hit is a defect in the document.',
    },
  ],

  commonMistakes: [
    {
      id: 'mistake-uncommitted-lockfile',
      mistake: 'Leaving the lockfile out of version control.',
      why: 'Different machines resolve different versions, producing bugs that reproduce nowhere consistently.',
      instead: 'Commit the lockfile and install from it in CI.',
    },
    {
      id: 'mistake-dependency-reflex',
      mistake: 'Installing a package for something small.',
      why: 'You adopt its whole dependency subtree, its release cadence, and its eventual abandonment for a few lines of behaviour.',
      instead: 'Write the few lines, and reserve dependencies for genuinely hard problems.',
    },
    {
      id: 'mistake-dep-classification',
      mistake: 'Putting build tools in `dependencies`.',
      why: 'It inflates production installs and obscures what the running application actually needs.',
      instead: 'Classify accurately; the distinction is the documentation.',
    },
    {
      id: 'mistake-undocumented-setup',
      mistake: 'Assuming setup is obvious.',
      why: 'The required Node version, the environment file, and the ordering are invisible to everyone but you.',
      instead: 'Verify from a fresh clone and write down every step.',
    },
  ],

  eliteConsiderations: [
    {
      kind: 'list',
      items: [
        'Pin the Node version in the repository so the environment is declared rather than assumed.',
        'Before adding a dependency, check its last release, its open issue count, and how many packages it pulls in.',
        'Prefer platform APIs over packages; the platform does not need upgrading.',
        'Keep the README\'s command list identical to the scripts, so the two cannot drift.',
      ],
    },
  ],

  practicalExercise: {
    id: 'exercise-06-05',
    title: 'Document running your project from a fresh clone',
    prompt:
      'Make your project reproducible from nothing, and verify the documentation by following it.',
    steps: [
      'Clone the project into a new directory with no existing state.',
      'Record every step required to get it running, including the ones you do automatically.',
      'Write a README with prerequisites and versions, install, run, and check commands.',
      'Expose lint, typecheck, test, and build as scripts.',
      'Confirm the lockfile is committed and that a lockfile-exact install works.',
      'Audit every dependency: what it does, why it is there, what removing it would cost.',
      'Remove at least one dependency you cannot justify, or record why each one stays.',
      'Follow your own README from scratch and fix every gap you hit.',
    ],
    successCriteria: [
      'A fresh clone runs by following the README alone.',
      'Prerequisites name versions, not just tools.',
      'Every check is available as a script.',
      'The lockfile is committed and a lockfile-exact install succeeds.',
      'Every dependency has a written justification.',
    ],
    estimatedMinutes: 45,
    hint: 'The steps you do without thinking are exactly the ones missing from the README.',
  },

  reflectionQuestion: 'Why should dependency count matter?',
  reflectionHint:
    'Every dependency becomes someone else\'s code inside your product.',

  resources: [
    {
      id: 'resource-npm-package-json',
      title: 'npm: package.json',
      url: 'https://docs.npmjs.com/cli/v10/configuring-npm/package-json',
      type: 'documentation',
      estimatedMinutes: 30,
      note: 'Fields, dependency classes, and version ranges.',
    },
    {
      id: 'resource-npm-ci',
      title: 'npm ci',
      url: 'https://docs.npmjs.com/cli/v10/commands/npm-ci',
      type: 'documentation',
      estimatedMinutes: 10,
      note: 'Installing exactly what the lockfile says, and failing when it disagrees.',
    },
    {
      id: 'resource-semver',
      title: 'Semantic versioning',
      url: 'https://semver.org/',
      type: 'specification',
      estimatedMinutes: 15,
      note: 'What a version range is actually promising you.',
    },
  ],

  competencyTags: ['product-judgement', 'performance', 'architecture'],

  completionCriteria: [
    'A fresh clone runs from the README alone.',
    'Every dependency has a written justification.',
    'All checks are exposed as scripts.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Project                                                                     */
/* -------------------------------------------------------------------------- */

const PROJECT: ModuleProject = {
  id: 'project-06',
  slug: 'productionise-the-command-palette',
  moduleId: MODULE_ID,
  title: 'Productionise the Command Palette',
  brief:
    'Take the command palette from Module 5 and bring it to a standard someone else could adopt: typed, documented, reproducible, and with a history that explains itself.',
  problem:
    'The difference between something that works and something that can be maintained is almost entirely invisible from the running interface. This project makes that difference the deliverable: the same behaviour, plus the types that prevent a class of bugs, the history that explains the decisions, and the documentation that lets someone else run and extend it without asking you anything.',
  objectives: [
    'Convert a working prototype into typed, contract-bearing code.',
    'Produce a history that reads as a sequence of understandable changes.',
    'Document component behaviour precisely enough to be used without reading the source.',
    'Make the project reproducible from a fresh clone.',
  ],
  requirements: [
    'Full TypeScript with strict mode, and no `any`.',
    'A Git history of coherent commits, each explaining why.',
    'A README with prerequisites, setup, run, and check instructions.',
    'Documented component behaviour: props, states, keyboard model.',
    'Accessible interaction preserved and verified, not assumed.',
    'Request states modelled as a discriminated union.',
  ],
  constraints: [
    'No behavioural regressions from the Module 5 version.',
    'No new dependencies without a written justification in the README.',
    'Every commit must leave the project working.',
    'Casts and exceptions must each carry a comment explaining why.',
  ],
  suggestedScope:
    'Improve what exists. Do not add features — the point of this project is that the visible result barely changes while the code becomes something another person could take over.',
  deliverables: [
    'The typed command palette, building cleanly under strict mode.',
    'A README covering setup, scripts, dependency justifications, and the keyboard model.',
    'Component documentation: props, states, and accessibility behaviour.',
    'A Git history whose log reads as a description of the work.',
    'A short note on what the types caught during conversion.',
  ],
  completionCriteria: [
    'Typecheck, lint, and build all pass with strict settings.',
    'No `any` remains; every cast is justified in a comment.',
    'A fresh clone runs by following the README alone.',
    'Every commit builds and describes one change.',
    'Keyboard operation and focus restoration verified with the mouse unplugged.',
  ],
  portfolioEvidence: [
    'TypeScript contracts and discriminated unions',
    'Readable Git history',
    'Project documentation and reproducible setup',
    'Component behaviour documentation',
    'Accessible keyboard interaction',
  ],
  reflectionQuestion:
    'What did the type system catch that testing had not, and what did testing catch that the types could not?',
  estimatedHours: 14,
  competencies: [
    'accessibility',
    'typescript',
    'architecture',
    'git',
    'component-api-design',
  ],
  stretchGoals: [
    'Add runtime validation at the command-source boundary and derive the static type from it.',
    'Add a continuous integration workflow running lint, typecheck, and build on every push.',
  ],
};

/* -------------------------------------------------------------------------- */

export const MODULE_06: CurriculumModule = {
  id: MODULE_ID,
  slug: 'typescript-git-and-engineering-workflow',
  moduleNumber: 6,
  phase: 'interface-craft',
  title: 'TypeScript, Git and Engineering Workflow',
  description:
    'Types as stated contracts, unions that remove impossible states, history that records intent, and an environment someone else can reproduce.',
  outcome: 'Develop engineering discipline and safer code.',
  prerequisites: [
    'Modules 1 to 5, or equivalent',
    'A working JavaScript project to convert',
  ],
  lessons: [LESSON_26, LESSON_27, LESSON_28, LESSON_29, LESSON_30],
  resources: [
    {
      id: 'resource-module-06-ts-handbook',
      title: 'The TypeScript Handbook',
      url: 'https://www.typescriptlang.org/docs/handbook/intro.html',
      type: 'documentation',
      estimatedMinutes: 180,
      note: 'The reference for everything in the first two lessons.',
    },
    {
      id: 'resource-module-06-pro-git',
      title: 'Pro Git',
      url: 'https://git-scm.com/book/en/v2',
      type: 'book',
      author: 'Scott Chacon and Ben Straub',
      estimatedMinutes: 240,
      note: 'The snapshot model first; the commands make sense afterwards.',
    },
    {
      id: 'resource-module-06-total-typescript',
      title: 'TypeScript: type manipulation',
      url: 'https://www.typescriptlang.org/docs/handbook/2/types-from-types.html',
      type: 'documentation',
      estimatedMinutes: 60,
      note: 'Deriving types from types, which is where duplication in type code disappears.',
    },
  ],
  project: PROJECT,
  competencies: [
    'accessibility',
    'critique',
    'product-judgement',
    'typescript',
    'state-modelling',
    'performance',
    'architecture',
    'git',
    'interface-state-modelling',
    'component-api-design',
  ],
  completionCriteria: [
    'All five lessons completed.',
    'Module project marked completed.',
    'Can convert a working prototype into maintainable, documented code.',
  ],
};
