/**
 * Module 06 — TypeScript, Git and Engineering Workflow.
 *
 * The first module about working like an engineer rather than only writing
 * like one. Types are introduced as a way to describe the state models the
 * learner already builds; Git as a way to keep work explicable; packages as
 * the answer to "how do I run this?".
 *
 * Nothing here is new conceptual ground. It is the same ideas from Modules 4
 * and 5 with tooling attached.
 */

import type { CurriculumModule, Lesson, ModuleProject } from '@/types/curriculum';

const MODULE_ID = 'module-06';

/* -------------------------------------------------------------------------- */
/* Lesson 26                                                                   */
/* -------------------------------------------------------------------------- */

const LESSON_1: Lesson = {
  id: 'lesson-types-as-helpful-contracts',
  slug: 'types-as-helpful-contracts',
  moduleId: MODULE_ID,
  lessonNumber: 1,
  title: 'Types as Helpful Contracts',
  summary:
    'Most bugs are a value being something nobody expected. A type is a written promise about what a value will be, checked before the code ever runs.',
  estimatedMinutes: 9,
  objectives: [
    'Explain the class of bug that types prevent.',
    'Read a type annotation and say what it promises.',
    'Annotate the inputs and output of a function.',
    'Recognise when inference is enough and when to write a type.',
  ],
  prerequisiteConcepts: [
    'JavaScript values and shapes from Module 4',
    'State as facts from Module 5',
  ],
  prerequisiteLessonIds: ['lesson-mapping-product-behaviour-before-coding'],
  recap: [
    {
      kind: 'paragraph',
      text: 'Module 5 ended with a written behaviour specification: states as facts, transitions with triggers, constraints, errors and recovery. TypeScript is a way of making part of that specification checkable by a machine.',
    },
  ],
  priorKnowledge: [
    {
      kind: 'paragraph',
      text: 'You know the shapes from Module 4 — string, number, boolean, array, object. You have also spent Module 5 writing down exactly what values a feature can hold.',
    },
    {
      kind: 'paragraph',
      text: 'TypeScript is JavaScript plus a way of writing those two things down together.',
    },
  ],
  coreConcept: [
    {
      kind: 'paragraph',
      text: 'A type is a promise about what a value will be. Write the promise, and the editor checks every place the value is used.',
    },
    {
      kind: 'code',
      language: 'typescript',
      code: 'const productName: string = "Wireless Keyboard";\nconst price: number = 79;\nconst isSaved: boolean = false;',
    },
    {
      kind: 'paragraph',
      text: 'The `: string` after the name is the annotation. It says this will always hold text. Assign a number to it later and the editor underlines it immediately — before the page is opened, before anyone clicks anything.',
    },
  ],
  whyDesignersCare: [
    {
      kind: 'paragraph',
      text: 'Because the bugs types catch are overwhelmingly interface bugs.',
    },
    {
      kind: 'paragraph',
      text: 'A price arriving as text instead of a number so the total shows "7979". A name field that is sometimes missing entirely so the card renders "undefined". A status spelled "sucess" in one place and "success" in another so the success state never appears.',
    },
    {
      kind: 'paragraph',
      text: 'Each of those reaches a user as a visibly broken screen. Types turn all three into an error the moment they are typed.',
    },
  ],
  howItWorks: [
    {
      kind: 'paragraph',
      text: 'Most of the time you write nothing at all, because TypeScript works the type out for itself. This is called **inference**.',
    },
    {
      kind: 'code',
      language: 'typescript',
      code: 'const productName = "Wireless Keyboard";\n// TypeScript already knows this is a string.',
    },
    {
      kind: 'paragraph',
      text: 'The place annotations genuinely earn their keep is functions, because a function is a contract between the person who wrote it and everyone who calls it.',
    },
    {
      kind: 'code',
      language: 'typescript',
      code: 'function formatPrice(amount: number, currency: string): string {\n  return `${currency}${amount.toFixed(2)}`;\n}',
    },
    {
      kind: 'paragraph',
      text: 'Line by line. `amount: number` and `currency: string` annotate the inputs. The `: string` after the brackets annotates what comes back. `toFixed(2)` formats to two decimal places — and it only exists on numbers, which is exactly why annotating `amount` matters.',
    },
    {
      kind: 'paragraph',
      text: 'Call it with a string price and the error appears at the call, naming the problem. Without the annotation it would fail at runtime, in front of someone.',
    },
  ],
  firstPrinciples: [
    {
      kind: 'paragraph',
      text: 'The underlying idea: move the discovery of a mistake as close as possible to the moment it is made.',
    },
    {
      kind: 'paragraph',
      text: 'The same mistake costs very different amounts depending on when it is found — as you type, when the tests run, when a colleague reviews it, or when a user hits it. Types move a whole category of mistake to the cheapest end of that scale.',
    },
    {
      kind: 'callout',
      tone: 'insight',
      body: 'Types do not make code correct. They make one specific kind of wrongness impossible to write, which is a smaller claim and a genuinely useful one.',
    },
  ],
  designPerspective: [
    {
      kind: 'paragraph',
      text: 'The design question is which of your decisions deserve to be enforced.',
    },
    {
      kind: 'paragraph',
      text: 'If a badge may only be one of four tones, that is a design decision. Expressed as a type, a fifth tone becomes impossible to introduce by accident — which is the difference between a rule in a document and a rule in the product.',
    },
  ],
  engineeringPerspective: [
    {
      kind: 'paragraph',
      text: 'The engineering question is where values enter the system from outside.',
    },
    {
      kind: 'paragraph',
      text: 'TypeScript checks the code you write; it cannot check what a server sends back. A response you have annotated as a product is a claim, not a guarantee. The boundary between "data we received" and "data we have checked" is where the remaining bugs live, and naming that boundary is most of using types well.',
    },
  ],
  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'A type is a specification that cannot drift from the thing it specifies.',
    },
    {
      kind: 'paragraph',
      text: 'The behaviour document you wrote in Module 5 can go out of date silently. A type cannot: if the code stops matching it, the project stops building. For the parts of a specification that can be expressed this way, that is a strictly better place to keep them.',
    },
  ],
  industryExamples: [
    {
      id: 'example-stripe-typed-sdk',
      source: 'Stripe',
      title: 'Types as published documentation',
      observation:
        'Stripe ships TypeScript definitions describing every field of every object its API returns.',
      takeaway:
        'The types are the reference. Autocomplete in the editor replaces looking things up, and a misspelled field is caught as it is typed.',
    },
    {
      id: 'example-figma-plugin-types',
      source: 'Figma',
      title: 'A typed surface for an extensible product',
      observation:
        'Figma publishes typed definitions for its plugin API.',
      takeaway:
        'When third parties build on your product, types are how you communicate the shape of it without writing prose for every field.',
    },
  ],
  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Take the product object from Module 4 and give it a type.',
    },
    {
      kind: 'code',
      language: 'typescript',
      code: 'type Product = {\n  id: string;\n  name: string;\n  price: number;\n  currency: string;\n  imageUrl?: string;\n  tags: string[];\n  inStock: boolean;\n};',
    },
    {
      kind: 'paragraph',
      text: '`type Product = { ... }` names a shape so it can be reused. `string[]` means an array of strings.',
    },
    {
      kind: 'paragraph',
      text: 'The important character is the `?` on `imageUrl`. It means the field may be absent — which answers, in the type itself, the question Module 4 raised about missing images. Anywhere the code uses `product.imageUrl`, TypeScript will insist you handle the possibility that it is not there.',
    },
    {
      kind: 'code',
      language: 'typescript',
      code: 'function renderCard(product: Product): string {\n  const image = product.imageUrl ?? "/images/placeholder.png";\n  return `${product.name} — ${formatPrice(product.price, product.currency)}`;\n}',
    },
    {
      kind: 'paragraph',
      text: '`??` means "use the left side unless it is missing, otherwise the right". The optional field forced the placeholder decision to be made, which is precisely the value: the type turned an easily-forgotten case into one you cannot skip.',
    },
  ],
  commonMistakes: [
    {
      id: 'mistake-06-01-annotating-everything',
      mistake: 'Writing an annotation on every variable.',
      why: 'Inference already knows most of them, and the extra annotations are noise that can drift out of date.',
      instead: 'Annotate function inputs and outputs, and named shapes. Let inference handle the rest.',
    },
    {
      id: 'mistake-06-01-any-as-escape',
      mistake: 'Reaching for `any` when a type is awkward.',
      why: '`any` switches checking off for that value and everything derived from it, so the error simply moves somewhere less obvious.',
      instead:
        'Use `unknown` when a value genuinely is not known yet. It forces a check before use rather than skipping one.',
    },
  ],
  professionalConsideration: [
    {
      kind: 'paragraph',
      text: 'Types are at their most valuable when they make a wrong state unrepresentable.',
    },
    {
      kind: 'paragraph',
      text: 'A product with both `isLoading: boolean` and `error: string` allows loading and failed simultaneously — a state your design never drew. A single field that can only be one of several named situations removes the possibility entirely. That technique is the next lesson, and it is the main reason this module exists before React.',
    },
  ],
  practicalExercise: {
    id: 'exercise-types-as-helpful-contracts',
    title: 'Add types to interface data',
    prompt:
      'Take the JavaScript objects you wrote in Module 4 and convert the file to TypeScript, adding types.',
    steps: [
      'Rename the file from `.js` to `.ts`.',
      'Define a named type for each kind of thing your data describes.',
      'Mark optional fields with `?` and nothing else.',
      'Annotate the inputs and outputs of every function.',
      'Note every place the editor now reports a problem.',
      'For each, decide whether the type is wrong or the code is.',
      'Find one place where the optional marker forced you to handle a case you had not handled.',
    ],
    successCriteria: [
      'Every data shape has a named type.',
      'Optional fields are marked and the absence is handled where they are used.',
      'All functions annotate inputs and output.',
      'No `any` appears anywhere.',
      'At least one genuine bug or unhandled case is identified by the conversion.',
    ],
    estimatedMinutes: 50,
    hint: 'If a type is hard to write, that is usually the data shape telling you something. Resist `any` — the awkwardness is the finding.',
  },
  reflectionQuestion:
    'Why is a type more reliable than a written specification of the same rule?',
  reflectionHint:
    'Think about what happens to each when the code changes and nobody updates the document.',
  resources: [
    {
      id: 'resource-ts-handbook-basics',
      title: 'The Basics — TypeScript Handbook',
      url: 'https://www.typescriptlang.org/docs/handbook/2/basic-types.html',
      type: 'documentation',
      author: 'Microsoft',
      estimatedMinutes: 40,
      note: 'The official starting point. Read the first two chapters; the rest will wait.',
    },
    {
      id: 'resource-ts-for-js-programmers',
      title: 'TypeScript for JavaScript Programmers',
      url: 'https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html',
      type: 'documentation',
      author: 'Microsoft',
      estimatedMinutes: 15,
      note: 'Written for exactly where you are: you know the language, you want the type layer.',
    },
  ],
  competencyTags: ['typescript', 'javascript', 'state-modelling'],
  completionCriteria: [
    'Can annotate function inputs and outputs.',
    'Can define and reuse a named type.',
    'Uses optional markers rather than assuming fields exist.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Lesson 27                                                                   */
/* -------------------------------------------------------------------------- */

const LESSON_2: Lesson = {
  id: 'lesson-objects-unions-and-safer-interface-states',
  slug: 'objects-unions-and-safer-interface-states',
  moduleId: MODULE_ID,
  lessonNumber: 2,
  title: 'Objects, Unions and Safer Interface States',
  summary:
    'The technique that makes impossible states impossible to write — and it is a direct expression of the state models you built in Module 5.',
  estimatedMinutes: 10,
  objectives: [
    'Express "one of these specific values" as a type.',
    'Use a union to model a set of mutually exclusive situations.',
    'Narrow a union so the right fields are available in each branch.',
    'Convert a state model from Module 5 into a type that cannot hold a contradiction.',
  ],
  prerequisiteConcepts: [
    'Types and annotations',
    'State models and derived state from Module 5',
  ],
  prerequisiteLessonIds: [
    'lesson-types-as-helpful-contracts',
    'lesson-derived-state-and-avoiding-duplicate-truth',
  ],
  recap: [
    {
      kind: 'paragraph',
      text: 'Last lesson ended on a problem: a state object with both `isLoading` and `error` can be in a situation your design never drew. This lesson removes that possibility.',
    },
  ],
  priorKnowledge: [
    {
      kind: 'paragraph',
      text: 'In Module 5 you learned to strip derivable values and to list states as facts. You also found, in lesson 23, that separate booleans can contradict one another. This is the fix for that.',
    },
  ],
  coreConcept: [
    {
      kind: 'paragraph',
      text: 'A **union** type says a value is one of a specific set. Written with `|`, which reads as "or".',
    },
    {
      kind: 'code',
      language: 'typescript',
      code: 'type RequestStatus = "idle" | "loading" | "success" | "error";\n\nlet status: RequestStatus = "idle";',
    },
    {
      kind: 'paragraph',
      text: 'Those quoted values are **literal types** — not "any string", but exactly those four. Assign `"sucess"` and it is an error at the point of the typo, which is the misspelling bug from last lesson, eliminated.',
    },
    {
      kind: 'paragraph',
      text: 'Notice what this replaces: four separate booleans that could all be true at once. One value that must be exactly one of four.',
    },
  ],
  whyDesignersCare: [
    {
      kind: 'paragraph',
      text: 'Because the union is literally your list of designed states, written down where the code can be checked against it.',
    },
    {
      kind: 'paragraph',
      text: 'If the design has four states and the type has four members, adding a fifth state to the code without designing it becomes a deliberate act rather than an accident. The type is the shortest possible version of your Module 5 specification.',
    },
  ],
  howItWorks: [
    {
      kind: 'paragraph',
      text: 'The powerful version attaches different data to each situation. This is a **discriminated union**.',
    },
    {
      kind: 'code',
      language: 'typescript',
      code: 'type RequestState =\n  | { status: "idle" }\n  | { status: "loading" }\n  | { status: "success"; products: Product[] }\n  | { status: "error"; message: string };',
    },
    {
      kind: 'paragraph',
      text: 'Four shapes, each identified by its `status` field — the discriminant. Read it as four sentences: idle carries nothing, loading carries nothing, success carries products, error carries a message.',
    },
    {
      kind: 'paragraph',
      text: 'This makes several wrong things unwriteable. You cannot have products while loading. You cannot have an error message and products at once. You cannot have a success with no products, because the type requires them.',
    },
    {
      kind: 'callout',
      tone: 'insight',
      body: 'Every contradiction your design would never draw is now a contradiction the code cannot express. That is the whole technique.',
    },
  ],
  firstPrinciples: [
    {
      kind: 'paragraph',
      text: 'The second half is **narrowing**: once you check the discriminant, TypeScript knows which shape you have.',
    },
    {
      kind: 'code',
      language: 'typescript',
      code: 'function render(state: RequestState): string {\n  if (state.status === "loading") {\n    return "Loading…";\n  }\n\n  if (state.status === "error") {\n    return state.message;\n  }\n\n  if (state.status === "success") {\n    return `${state.products.length} products`;\n  }\n\n  return "Nothing yet.";\n}',
    },
    {
      kind: 'paragraph',
      text: 'Inside the error branch, `state.message` is available. Inside the success branch, `state.products` is. Try to read `state.message` in the success branch and it is an error — because in that branch there is no such field.',
    },
    {
      kind: 'paragraph',
      text: 'The checks you were already writing in Module 4 are now doing double duty: they control the behaviour and they tell the type system which fields exist.',
    },
  ],
  designPerspective: [
    {
      kind: 'paragraph',
      text: 'The design question is what each state genuinely needs in order to be drawn.',
    },
    {
      kind: 'paragraph',
      text: 'Writing the union forces that out. The error state needs a message — which means somebody has to decide what the messages say, which is the design work Module 5 identified as usually missing. The type will not let you defer it.',
    },
  ],
  engineeringPerspective: [
    {
      kind: 'paragraph',
      text: 'The engineering question is whether every member is handled.',
    },
    {
      kind: 'paragraph',
      text: 'With a `switch` over the discriminant, TypeScript can be made to insist that every case is covered — so adding a fifth state to the union produces an error in every place that handles it. That is the opposite of the usual experience, where a new state silently falls through and renders nothing.',
    },
  ],
  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'The discriminated union is the Module 5 state list and the Module 5 transition map, compressed into a type.',
    },
    {
      kind: 'paragraph',
      text: 'It is also the single most transferable idea in this module: it works in any language with a type system, and it is what separates state modelling that holds up from a collection of booleans that eventually contradict each other.',
    },
  ],
  industryExamples: [
    {
      id: 'example-stripe-status-union',
      source: 'Stripe',
      title: 'A defined set of statuses',
      observation:
        'A Stripe payment intent has a status from a fixed, documented set rather than an open-ended string.',
      takeaway:
        'The closed set is what lets every consumer handle every case. An open string would make exhaustive handling impossible.',
    },
    {
      id: 'example-ts-handbook-narrowing',
      source: 'Microsoft',
      title: 'Narrowing documented as a core technique',
      observation:
        'The TypeScript Handbook devotes a full chapter to narrowing and discriminated unions.',
      takeaway:
        'This is treated as fundamental rather than advanced, because modelling mutually exclusive situations is the common case in interfaces.',
    },
  ],
  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Convert the search state from Module 5 lesson 23.',
    },
    {
      kind: 'code',
      language: 'typescript',
      code: '// Module 5 version — four facts, two of which can contradict.\ntype SearchState = {\n  query: string;\n  results: Product[];\n  isLoading: boolean;\n  error: string | null;\n};',
    },
    {
      kind: 'code',
      language: 'typescript',
      code: '// Typed version — the request is one situation at a time.\ntype SearchState = {\n  query: string;\n  request:\n    | { status: "idle" }\n    | { status: "loading" }\n    | { status: "success"; results: Product[] }\n    | { status: "error"; message: string };\n};',
    },
    {
      kind: 'paragraph',
      text: 'The query stays separate, because it is genuinely independent — someone can be typing while a request is in flight. Everything about the request collapses into one field that holds exactly one situation.',
    },
    {
      kind: 'paragraph',
      text: 'Now `isLoading && error` cannot happen, and neither can "success with no results field". The bug class from Module 5 lesson 23 is gone, not by discipline but by construction.',
    },
  ],
  commonMistakes: [
    {
      id: 'mistake-06-02-booleans-instead-of-union',
      mistake: 'Modelling mutually exclusive situations as separate booleans.',
      why: 'Four booleans allow sixteen combinations when only four are valid. The other twelve are bugs waiting.',
      instead: 'If only one can be true at a time, it is one field with several possible values.',
    },
    {
      id: 'mistake-06-02-optional-everything',
      mistake: 'Making every field optional so one type covers every situation.',
      why: 'Every use then needs a check, and the type no longer says which combinations are real.',
      instead:
        'Several precise shapes in a union beats one loose shape full of question marks.',
    },
  ],
  professionalConsideration: [
    {
      kind: 'paragraph',
      text: 'A discriminated union is the place to put the thing your design review keeps rediscovering.',
    },
    {
      kind: 'paragraph',
      text: 'When someone asks "what does it look like while loading with an error still showing?", the correct answer is often "that cannot happen" — and a union is how you make that answer true rather than aspirational. Teams that model this way spend noticeably less time on states nobody intended.',
    },
  ],
  practicalExercise: {
    id: 'exercise-objects-unions-and-safer-interface-states',
    title: 'Type an async interface state',
    prompt:
      'Take the behaviour specification you wrote in Module 5 and express its state as types, including a discriminated union.',
    steps: [
      'Write out the state list from your specification.',
      'Identify which values are mutually exclusive.',
      'Express those as a discriminated union with a `status` field.',
      'Attach to each member only the data that situation actually has.',
      'Write a render function that narrows on the discriminant.',
      'Try to write a contradiction and confirm the editor refuses it.',
      'Add a fifth member and note every place that now fails to compile.',
    ],
    successCriteria: [
      'Mutually exclusive situations are one union, not several booleans.',
      'Each member carries only the data it needs.',
      'A render function narrows correctly on the discriminant.',
      'At least one contradiction is demonstrated to be unwriteable.',
      'Adding a member surfaces every place that must handle it.',
    ],
    estimatedMinutes: 55,
    hint: 'The giveaway for a union is a field that only makes sense when another field has a particular value. An error message only means anything when something failed.',
  },
  reflectionQuestion:
    'Why is a union of four shapes safer than one object with four optional fields?',
  reflectionHint:
    'Count the combinations each one permits, then count how many of those your design actually drew.',
  resources: [
    {
      id: 'resource-ts-narrowing',
      title: 'Narrowing — TypeScript Handbook',
      url: 'https://www.typescriptlang.org/docs/handbook/2/narrowing.html',
      type: 'documentation',
      author: 'Microsoft',
      estimatedMinutes: 35,
      note: 'Discriminated unions and how checks refine a type. The most useful chapter for interface work.',
    },
    {
      id: 'resource-ts-everyday-types',
      title: 'Everyday Types — TypeScript Handbook',
      url: 'https://www.typescriptlang.org/docs/handbook/2/everyday-types.html',
      type: 'documentation',
      author: 'Microsoft',
      estimatedMinutes: 30,
      note: 'Unions, literal types and object types, with examples.',
    },
  ],
  competencyTags: ['typescript', 'state-modelling', 'interface-state-modelling', 'architecture'],
  completionCriteria: [
    'Can express mutually exclusive states as a discriminated union.',
    'Can narrow a union and access the right fields in each branch.',
    'Can demonstrate a contradiction the type makes impossible.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Lesson 28                                                                   */
/* -------------------------------------------------------------------------- */

const LESSON_3: Lesson = {
  id: 'lesson-understanding-git',
  slug: 'understanding-git',
  moduleId: MODULE_ID,
  lessonNumber: 3,
  title: 'Understanding Git',
  summary:
    'Git records the history of a project as a series of deliberate snapshots. Understanding the three places your work can be is most of understanding Git.',
  estimatedMinutes: 9,
  objectives: [
    'Describe the three places a change can be: working tree, staging area, history.',
    'Make a commit that contains one coherent change.',
    'Read a history and understand what each entry claims.',
    'Explain why commit messages are written for other people.',
  ],
  prerequisiteConcepts: ['Having built a project worth keeping'],
  prerequisiteLessonIds: ['lesson-objects-unions-and-safer-interface-states'],
  recap: [
    {
      kind: 'paragraph',
      text: 'You have spent two lessons making your code describe itself more precisely. Git is about making your *work* describe itself — what changed, when, and why.',
    },
  ],
  priorKnowledge: [
    {
      kind: 'paragraph',
      text: 'You have version history in Figma, and you have probably named a file "final-v3-actually-final". Git is the disciplined version of both: history that is automatic, and labels that are deliberate.',
    },
  ],
  coreConcept: [
    {
      kind: 'paragraph',
      text: 'A **repository** is a folder whose history Git is tracking. Within it, any change lives in one of three places.',
    },
    {
      kind: 'list',
      ordered: true,
      items: [
        'The **working tree** — the files as they are right now. What your editor shows.',
        'The **staging area** — changes you have selected to go into the next snapshot.',
        'The **history** — the sequence of snapshots already recorded.',
      ],
    },
    {
      kind: 'paragraph',
      text: 'Work moves one way: you edit the working tree, stage the parts that belong together, and commit them into history. The staging step is what people find strange and it is the most valuable part — it is where you decide what counts as one change.',
    },
  ],
  whyDesignersCare: [
    {
      kind: 'paragraph',
      text: 'Because a readable history is how anyone — including you in three months — understands why a product is the way it is.',
    },
    {
      kind: 'paragraph',
      text: 'When a layout decision looks wrong, the history can tell you it was deliberate and what it was working around. A history of forty commits called "fix" tells you nothing, and the knowledge is simply gone.',
    },
  ],
  howItWorks: [
    {
      kind: 'paragraph',
      text: 'The daily cycle is four commands.',
    },
    {
      kind: 'code',
      language: 'bash',
      code: 'git status                 # what has changed, and what is staged\ngit add src/card.css       # stage one file\ngit commit -m "Message"    # record what is staged as a snapshot\ngit log --oneline          # read the history',
    },
    {
      kind: 'paragraph',
      text: '`git status` is the one to run constantly — it tells you which of the three places everything currently sits in.',
    },
    {
      kind: 'paragraph',
      text: '`git add` moves a change to staging. You can add one file, several, or everything with `git add .` — but adding selectively is what lets a commit be one idea rather than one afternoon.',
    },
    {
      kind: 'paragraph',
      text: '`git commit` records the staged changes permanently, with the message explaining them.',
    },
  ],
  firstPrinciples: [
    {
      kind: 'paragraph',
      text: 'A commit should be one coherent change: something you could describe in a sentence without using the word "and".',
    },
    {
      kind: 'paragraph',
      text: '"Add the loading state to the save button" is one commit. "Add the loading state and fix the header spacing and rename a variable" is three, which means the history cannot be used to undo one of them without the others.',
    },
    {
      kind: 'paragraph',
      text: 'That is the actual payoff. A history of coherent commits can be read, searched, and partially reversed. A history of large mixed commits can only be read as "things changed somewhere around here".',
    },
  ],
  designPerspective: [
    {
      kind: 'paragraph',
      text: 'The design question is what counts as one decision.',
    },
    {
      kind: 'paragraph',
      text: 'This is the same judgement as deciding what counts as one component. A commit, like a component, should have one reason to exist — and when you cannot name that reason, the commit is probably two.',
    },
  ],
  engineeringPerspective: [
    {
      kind: 'paragraph',
      text: 'The engineering question is whether the project still works at every point in the history.',
    },
    {
      kind: 'paragraph',
      text: 'A commit that leaves the project broken makes the history much less useful: you can no longer step back to any point and expect it to run. Committing work that builds is a small discipline with a large payoff when something needs tracking down later.',
    },
  ],
  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'The commit message is where the reasoning lives, and reasoning is what design engineers have that is hardest to replace.',
    },
    {
      kind: 'paragraph',
      text: 'The code says what the interface does. The message can say why it does it that way — which constraint forced it, what was tried first. That is the context nobody else can reconstruct.',
    },
  ],
  industryExamples: [
    {
      id: 'example-git-project-history',
      source: 'GitHub',
      title: 'History as a research tool',
      observation:
        'Mature open-source projects can be searched by commit message and by the history of a single line.',
      takeaway:
        'The investment in message quality pays off years later, in a use nobody anticipated at the time.',
    },
    {
      id: 'example-conventional-commits',
      source: 'GitHub',
      title: 'Messages with a shared structure',
      observation:
        'Many teams adopt a message convention so history can be filtered and release notes generated from it.',
      takeaway:
        'The structure is less important than the consistency. A readable history is one where every entry answers the same question.',
    },
  ],
  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Turn a finished page into a clean history.',
    },
    {
      kind: 'code',
      language: 'bash',
      code: 'git init\ngit add index.html\ngit commit -m "Add the page structure"\n\ngit add styles.css\ngit commit -m "Add layout and spacing"\n\ngit add script.js\ngit commit -m "Add form validation"',
    },
    {
      kind: 'paragraph',
      text: 'Three commits, three ideas. Each message says what the change achieves rather than what was typed — "Add form validation" rather than "update script.js", which the file list already shows.',
    },
    {
      kind: 'paragraph',
      text: 'The test of a good message: could someone decide whether this commit is the one they are looking for without opening it? "Fix stuff" fails. "Add form validation" passes.',
    },
  ],
  commonMistakes: [
    {
      id: 'mistake-06-03-one-giant-commit',
      mistake: 'Committing an entire day of work in one go.',
      why: 'The history records that something changed without recording what, and nothing in it can be undone individually.',
      instead: 'Commit each coherent change as you finish it. Staging exists to make this easy.',
    },
    {
      id: 'mistake-06-03-message-restates-file',
      mistake: 'Writing messages like "update styles.css".',
      why: 'Git already knows which file changed. The message is the only place the reason can live.',
      instead: 'Say what the change achieves, and if it is not obvious, why.',
    },
  ],
  professionalConsideration: [
    {
      kind: 'paragraph',
      text: 'Never commit secrets, and know that removing them later is harder than it looks.',
    },
    {
      kind: 'paragraph',
      text: 'A committed API key stays in the history even after the file is changed, because history is a record of what was. The remedy is prevention — a `.gitignore` listing `.env` files before the first commit — and, if it happens anyway, rotating the key rather than only deleting the line.',
    },
  ],
  practicalExercise: {
    id: 'exercise-understanding-git',
    title: 'Create a clean sequence of commits',
    prompt:
      'Put one of your existing projects under version control with a history that reads as a sequence of decisions.',
    steps: [
      'Initialise a repository in the project folder.',
      'Create a `.gitignore` before anything else, excluding `node_modules` and any `.env` file.',
      'Commit the work in at least five coherent commits rather than one.',
      'Write each message as what the change achieves.',
      'Run `git log --oneline` and read the result as a story.',
      'Make a further change, stage only part of it, and commit that part alone.',
      'Check with `git status` at each step and note which of the three places things are in.',
    ],
    successCriteria: [
      'A `.gitignore` exists and excludes environment files.',
      'At least five commits, each one coherent change.',
      'No message merely restates a filename.',
      'The log reads as a sequence of decisions.',
      'At least one commit demonstrates partial staging.',
    ],
    estimatedMinutes: 50,
    hint: 'If a message needs the word "and", you are describing two commits. Split them.',
  },
  reflectionQuestion:
    'Why is a commit message written for someone else rather than for yourself?',
  reflectionHint:
    'Consider who reads history, and when. How much will you remember of today in six months?',
  resources: [
    {
      id: 'resource-git-book-basics',
      title: 'Git Basics — Pro Git',
      url: 'https://git-scm.com/book/en/v2/Git-Basics-Recording-Changes-to-the-Repository',
      type: 'book',
      author: 'Scott Chacon and Ben Straub',
      estimatedMinutes: 45,
      note: 'The official book, free online. This chapter covers exactly the three-places model.',
    },
    {
      id: 'resource-github-skills-intro',
      title: 'Introduction to GitHub',
      url: 'https://github.com/skills/introduction-to-github',
      type: 'tool',
      author: 'GitHub',
      estimatedMinutes: 60,
      note: 'A hands-on course that walks you through the workflow in a real repository.',
    },
  ],
  competencyTags: ['git', 'architecture'],
  completionCriteria: [
    'Can describe the working tree, staging area and history.',
    'Can produce a history of coherent, individually described commits.',
    'Excludes environment files before the first commit.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Lesson 29                                                                   */
/* -------------------------------------------------------------------------- */

const LESSON_4: Lesson = {
  id: 'lesson-branches-commits-and-pull-requests',
  slug: 'branches-commits-and-pull-requests',
  moduleId: MODULE_ID,
  lessonNumber: 4,
  title: 'Branches, Commits and Pull Requests',
  summary:
    'A branch is a place to work without disturbing anything. A pull request is where the work is explained and examined — and reading diffs is a design skill as much as an engineering one.',
  estimatedMinutes: 9,
  objectives: [
    'Work on a branch and merge it back.',
    'Read a diff and say what changed.',
    'Open a pull request that explains itself.',
    'Explain why a designer should review diffs.',
  ],
  prerequisiteConcepts: ['Commits and history from the previous lesson'],
  prerequisiteLessonIds: ['lesson-understanding-git'],
  recap: [
    {
      kind: 'paragraph',
      text: 'You can record a history of coherent commits. This lesson is about doing that alongside other people without colliding.',
    },
  ],
  priorKnowledge: [
    {
      kind: 'paragraph',
      text: 'You know a commit is a snapshot. A branch is simply a line of snapshots with a name, which lets two lines exist at once.',
    },
  ],
  coreConcept: [
    {
      kind: 'paragraph',
      text: 'A **branch** is a separate line of work. You make one, do something on it, and merge it back when it is ready.',
    },
    {
      kind: 'code',
      language: 'bash',
      code: 'git switch -c add-loading-state   # create a branch and move onto it\n# ...edit, stage, commit as usual...\ngit switch main                  # go back\ngit merge add-loading-state      # bring the work in',
    },
    {
      kind: 'paragraph',
      text: 'While you are on the branch, `main` is untouched. Abandon the branch and nothing was lost from the main line; merge it and the work arrives as a unit.',
    },
  ],
  whyDesignersCare: [
    {
      kind: 'paragraph',
      text: 'Because the pull request is where interface decisions are visible before they ship, and it is a conversation designers are usually absent from.',
    },
    {
      kind: 'paragraph',
      text: 'The spacing that drifted, the state that was skipped, the focus that was not handled — all of it is in the diff, and all of it is far cheaper to raise there than after release.',
    },
  ],
  howItWorks: [
    {
      kind: 'paragraph',
      text: 'A **diff** shows what changed, line by line. Removed lines are marked with a minus, added lines with a plus.',
    },
    {
      kind: 'code',
      language: 'diff',
      code: ' .card {\n   padding: 16px;\n-  gap: 8px;\n+  gap: 12px;\n   border-radius: 8px;\n }',
    },
    {
      kind: 'paragraph',
      text: 'Unprefixed lines are context, unchanged. This diff shows one thing: the gap went from 8px to 12px.',
    },
    {
      kind: 'paragraph',
      text: 'And that is a change a designer should have an opinion about. If the spacing scale says 8, this is either a deliberate exception or a drift — and nobody but a designer is likely to notice which.',
    },
  ],
  firstPrinciples: [
    {
      kind: 'paragraph',
      text: 'A **pull request** proposes merging a branch, and exists to be examined before it lands.',
    },
    {
      kind: 'paragraph',
      text: 'It has a description, the diff, and a conversation. The description should answer three things: what changed, why, and how it was checked. A pull request that says only "fixes the thing" wastes the one moment when the change is cheap to question.',
    },
    {
      kind: 'callout',
      tone: 'note',
      body: 'You do not need to understand every line of a diff to review it usefully. Noticing that a state is missing or a value is off-scale requires design knowledge, not engineering knowledge.',
    },
  ],
  designPerspective: [
    {
      kind: 'paragraph',
      text: 'The design question is whether the built result matches the decision.',
    },
    {
      kind: 'paragraph',
      text: 'Reviewing diffs is design QA moved earlier. The things worth looking for are specific: values not on the scale, a state handled in one place but not another, a control that is the wrong element, copy that was invented during implementation.',
    },
  ],
  engineeringPerspective: [
    {
      kind: 'paragraph',
      text: 'The engineering question is what happens when two branches changed the same lines.',
    },
    {
      kind: 'paragraph',
      text: 'That is a **conflict**, and Git refuses to guess. It marks the competing versions in the file and waits for a human to choose. Conflicts feel alarming and are routine; the only real rule is to read both sides rather than keeping whichever is on top.',
    },
  ],
  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'A design engineer is unusually valuable in review because they can read both what the code does and what it should look like.',
    },
    {
      kind: 'paragraph',
      text: 'Most reviewers check one or the other. Being able to say "this is correct but the disabled state is missing, and that value is not on our scale" in the same comment is a genuinely rare contribution.',
    },
  ],
  industryExamples: [
    {
      id: 'example-github-pr-review',
      source: 'GitHub',
      title: 'Review as a structured conversation',
      observation:
        'GitHub attaches comments to specific lines of a diff and tracks whether each is resolved.',
      takeaway:
        'Anchoring feedback to a line removes ambiguity about what is being discussed — the same reason design feedback is pinned to a frame.',
    },
    {
      id: 'example-vercel-preview-deploys',
      source: 'Vercel',
      title: 'A running version of every proposal',
      observation:
        'Vercel builds a live preview deployment for each pull request.',
      takeaway:
        'This is what makes design review in a pull request practical: you can use the change, not only read it.',
    },
  ],
  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'One feature, start to finish.',
    },
    {
      kind: 'code',
      language: 'bash',
      code: 'git switch -c add-empty-state\n\n# Build the empty state. Commit in coherent pieces:\ngit commit -m "Add empty state markup"\ngit commit -m "Style the empty state"\ngit commit -m "Show empty state when the list has no items"\n\ngit push -u origin add-empty-state',
    },
    {
      kind: 'paragraph',
      text: '`git push` sends the branch to the remote repository; `-u` links the two so later pushes need no arguments. Then you open the pull request on GitHub, where the description does the work.',
    },
    {
      kind: 'code',
      language: 'text',
      code: 'Add empty state to the project list\n\nWhat: shows a dedicated empty state when a user has no projects,\nreplacing the blank list.\n\nWhy: the blank list looked like a loading failure. Distinguishes\n"nothing yet" from "no results" per the Module 4 lesson.\n\nChecked: both empty cases, keyboard navigation to the create button,\nand 320px width.',
    },
    {
      kind: 'paragraph',
      text: 'Three short paragraphs. A reviewer now knows what to look at and what was already verified, which is the difference between a five-minute review and a twenty-minute one.',
    },
  ],
  commonMistakes: [
    {
      id: 'mistake-06-04-working-on-main',
      mistake: 'Doing all work directly on the main branch.',
      why: 'There is no point at which the work can be examined before it becomes the official version, and abandoning it means undoing commits.',
      instead: 'Branch for anything you might not finish or might want reviewed. It costs one command.',
    },
    {
      id: 'mistake-06-04-huge-pull-requests',
      mistake: 'Opening a pull request containing a week of unrelated work.',
      why: 'Nobody can review it properly, so it gets approved without real examination — which defeats the purpose.',
      instead: 'One pull request per coherent change, the same rule as commits applied one level up.',
    },
  ],
  professionalConsideration: [
    {
      kind: 'paragraph',
      text: 'The most useful review comment a designer can leave is often a question rather than a correction.',
    },
    {
      kind: 'paragraph',
      text: '"What happens here if the name is very long?" is more productive than "this will break with long names" — it invites checking rather than defending, and it is right more often than an assertion would be, because the reviewer cannot see everything.',
    },
  ],
  practicalExercise: {
    id: 'exercise-branches-commits-and-pull-requests',
    title: 'Build one feature in a branch',
    prompt:
      'Add one feature to an existing project on a branch, and open a pull request for it with a proper description.',
    steps: [
      'Create a branch named after the feature.',
      'Build the feature in at least three coherent commits.',
      'Push the branch and open a pull request.',
      'Write a description covering what, why and how you checked it.',
      'Read your own diff from top to bottom before asking anyone else to.',
      'Leave at least one comment on your own diff about something you would question.',
      'Merge it, then confirm the history still reads clearly.',
    ],
    successCriteria: [
      'The work happened on a branch, not on main.',
      'At least three coherent commits.',
      'The description answers what, why and how it was checked.',
      'The diff was read in full before merging.',
      'At least one self-review comment identifying a real question.',
    ],
    estimatedMinutes: 60,
    hint: 'Reading your own diff before anyone else does catches a surprising amount — debug code, a value off the scale, a state you meant to come back to.',
  },
  reflectionQuestion:
    'What could a designer notice in a diff that an engineer reviewing the same change might not?',
  reflectionHint:
    'Think about what each person is checking against. One has the implementation in mind; the other has the intended design.',
  resources: [
    {
      id: 'resource-git-branching',
      title: 'Branching and Merging — Pro Git',
      url: 'https://git-scm.com/book/en/v2/Git-Branching-Basic-Branching-and-Merging',
      type: 'book',
      author: 'Scott Chacon and Ben Straub',
      estimatedMinutes: 40,
      note: 'Branches, merges and conflicts with clear diagrams.',
    },
    {
      id: 'resource-github-skills-review',
      title: 'Reviewing pull requests',
      url: 'https://github.com/skills/review-pull-requests',
      type: 'tool',
      author: 'GitHub',
      estimatedMinutes: 45,
      note: 'A hands-on walkthrough of reviewing, in a real repository.',
    },
  ],
  competencyTags: ['git', 'critique', 'design-qa'],
  completionCriteria: [
    'Can branch, commit, push and open a pull request.',
    'Can read a diff and identify a design problem in it.',
    'Writes descriptions that answer what, why and how it was checked.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Lesson 30                                                                   */
/* -------------------------------------------------------------------------- */

const LESSON_5: Lesson = {
  id: 'lesson-packages-environment-variables-and-project-setup',
  slug: 'packages-environment-variables-and-project-setup',
  moduleId: MODULE_ID,
  lessonNumber: 5,
  title: 'Packages, Environment Variables and Project Setup',
  summary:
    'How a project declares what it needs, how it is run, and how secrets stay out of the repository — the knowledge that makes a project someone else can start.',
  estimatedMinutes: 9,
  objectives: [
    'Read a package.json and say what the project needs and how to run it.',
    'Install a dependency and understand what the lockfile is for.',
    'Keep configuration and secrets out of version control.',
    'Explain the difference between development and a production build.',
  ],
  prerequisiteConcepts: ['Git and .gitignore from lesson 28'],
  prerequisiteLessonIds: ['lesson-branches-commits-and-pull-requests'],
  recap: [
    {
      kind: 'paragraph',
      text: 'You can version a project and propose changes to it. This lesson is about everything a project needs in order for someone else to run it at all.',
    },
  ],
  priorKnowledge: [
    {
      kind: 'paragraph',
      text: 'You created a `.gitignore` in lesson 28 and excluded `node_modules` without much explanation. This lesson explains what that folder is and why it is excluded.',
    },
  ],
  coreConcept: [
    {
      kind: 'paragraph',
      text: 'A **package** is code somebody else wrote that your project uses. **npm** is the tool that fetches them and the registry they come from.',
    },
    {
      kind: 'paragraph',
      text: 'Everything a project needs is declared in one file, `package.json`.',
    },
    {
      kind: 'code',
      language: 'json',
      code: '{\n  "name": "my-project",\n  "scripts": {\n    "dev": "next dev",\n    "build": "next build"\n  },\n  "dependencies": {\n    "react": "^19.0.0"\n  },\n  "devDependencies": {\n    "typescript": "^5.6.0"\n  }\n}',
    },
    {
      kind: 'paragraph',
      text: '`scripts` are named commands — `npm run dev` runs whatever `dev` maps to. `dependencies` are packages the running product needs. `devDependencies` are needed only while developing, like TypeScript, which has done its job before the product ships.',
    },
  ],
  whyDesignersCare: [
    {
      kind: 'paragraph',
      text: 'Because "it works on my machine" is the most common reason a designer cannot run the project they are designing for.',
    },
    {
      kind: 'paragraph',
      text: 'Being able to clone a repository, run two commands and see the real interface changes what you can do: check your design against the actual build, test states nobody sent you a screenshot of, and open a browser at 320px.',
    },
  ],
  howItWorks: [
    {
      kind: 'paragraph',
      text: 'Running a project is usually two commands.',
    },
    {
      kind: 'code',
      language: 'bash',
      code: 'npm install    # read package.json, download everything into node_modules\nnpm run dev    # start the development server',
    },
    {
      kind: 'paragraph',
      text: '`node_modules` is where the downloads land. It is excluded from Git because it is large, it is machine-specific, and it can be rebuilt exactly from the two files that *are* committed.',
    },
    {
      kind: 'paragraph',
      text: 'The second of those is the **lockfile** — `package-lock.json`. `package.json` says "React 19 or compatible"; the lockfile records the exact version that was installed. Committing it is what makes everyone\'s install identical, which is why "works on my machine" usually means somebody ignored it.',
    },
  ],
  firstPrinciples: [
    {
      kind: 'paragraph',
      text: '**Environment variables** are values that differ between where the project runs, and they are not committed.',
    },
    {
      kind: 'code',
      language: 'bash',
      code: '# .env.local — never committed\nAPI_URL=https://api.example.com\nAPI_KEY=secret-value-here',
    },
    {
      kind: 'paragraph',
      text: 'Your machine, a colleague\'s machine and the production server each have their own. The file is excluded by `.gitignore`, and a committed `.env.example` lists the *names* with no values, so a new person knows what they need to supply.',
    },
    {
      kind: 'callout',
      tone: 'warning',
      body: 'A key committed once stays in the history even after the file is changed. Prevention is the only cheap remedy; afterwards, the key must be rotated rather than merely deleted.',
    },
  ],
  designPerspective: [
    {
      kind: 'paragraph',
      text: 'The design question is what the setup experience is like, because a README is an interface.',
    },
    {
      kind: 'paragraph',
      text: 'It has a user with a goal — run this project — and it either works or it does not. Instructions that assume knowledge the reader lacks fail in exactly the way a confusing form fails, and the diagnosis is the same: the author knew too much.',
    },
  ],
  engineeringPerspective: [
    {
      kind: 'paragraph',
      text: 'The engineering question is the difference between development and a build.',
    },
    {
      kind: 'paragraph',
      text: 'Development optimises for feedback: the page reloads as you type, errors are verbose, nothing is compressed. A build optimises for the user: everything is minified, checks run once, and the output is static where it can be. They behave differently, which is why something can work in development and fail in a build.',
    },
  ],
  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'Everything in this lesson is in service of one thing: somebody else can run your work.',
    },
    {
      kind: 'paragraph',
      text: 'That is the difference between a project and a portfolio piece. A design engineer whose repository can be cloned and started in two minutes is immediately more useful than one whose work only exists as screenshots.',
    },
  ],
  industryExamples: [
    {
      id: 'example-vercel-env-config',
      source: 'Vercel',
      title: 'Configuration supplied per environment',
      observation:
        'Vercel holds environment variables per environment — production, preview and development — rather than in the repository.',
      takeaway:
        'The same code runs in three places with three configurations. Committing them would make that impossible.',
    },
    {
      id: 'example-good-readme',
      source: 'GitHub',
      title: 'The README as the entry point',
      observation:
        'Well-maintained projects open their README with what the project is and the exact commands to run it.',
      takeaway:
        'Those two things answer the reader’s actual questions. Everything else can come after.',
    },
  ],
  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Write setup instructions that work. The test is that somebody who has never seen the project can follow them.',
    },
    {
      kind: 'code',
      language: 'markdown',
      code: '## Running locally\n\nRequires Node 20 or later.\n\n```bash\nnpm install\n```\n\nCopy `.env.example` to `.env.local` and fill in the values.\n\n```bash\nnpm run dev\n```\n\nThen open http://localhost:3000\n\n## Environment variables\n\n| Name | What it is |\n| --- | --- |\n| `API_URL` | Base URL of the data API |\n| `API_KEY` | Your personal key, from the dashboard |',
    },
    {
      kind: 'paragraph',
      text: 'Notice what it does not assume. It states the Node version, because the wrong one fails confusingly. It names the file to copy. It says what each variable is for rather than only listing it. And it gives the URL, because "start the dev server" without a destination is incomplete.',
    },
  ],
  commonMistakes: [
    {
      id: 'mistake-06-05-committing-env',
      mistake: 'Committing a `.env` file.',
      why: 'The secret is now in the history permanently, and in every clone of the repository.',
      instead:
        'Exclude `.env*` before the first commit, and commit a `.env.example` with names only.',
    },
    {
      id: 'mistake-06-05-readme-assumes-context',
      mistake: 'Writing a README that assumes the reader already knows the project.',
      why: 'The only person it helps is someone who did not need it.',
      instead: 'Write for someone with a clean machine and no context. Test it by following it yourself.',
    },
  ],
  professionalConsideration: [
    {
      kind: 'paragraph',
      text: 'Every dependency is a long-term commitment, not a one-off decision.',
    },
    {
      kind: 'paragraph',
      text: 'A package brings its own dependencies, its own update cadence, and its own eventual abandonment. For interface work the question worth asking is whether the problem is genuinely hard — date handling and accessible dialogs usually are; a button component usually is not.',
    },
  ],
  practicalExercise: {
    id: 'exercise-packages-environment-variables-and-project-setup',
    title: 'Document how to run a project from scratch',
    prompt:
      'Write setup documentation for one of your projects, then prove it works by following it exactly.',
    steps: [
      'Write a README with what the project is and how to run it.',
      'State the Node version required.',
      'List every environment variable with what it is for and where to get it.',
      'Commit a `.env.example` with names and no values.',
      'Confirm `.gitignore` excludes `.env*` and `node_modules`.',
      'Delete `node_modules`, then follow your own instructions from the top.',
      'Note every point where you had to use knowledge not in the document.',
      'Fix those and repeat.',
    ],
    successCriteria: [
      'The README states what the project is in one or two sentences.',
      'Exact commands are given, in order.',
      'Every environment variable is documented with its purpose.',
      '`.env.example` is committed; no real values are.',
      'The instructions were followed from a clean state and worked.',
    ],
    estimatedMinutes: 45,
    hint: 'The gaps appear when you actually delete node_modules and follow along. Reading your own instructions never finds them.',
  },
  reflectionQuestion:
    'Why is the lockfile committed when the folder it describes is not?',
  reflectionHint:
    'One of them can be rebuilt exactly from what is committed. Consider what would differ between two machines without it.',
  resources: [
    {
      id: 'resource-npm-about-packages',
      title: 'About packages and modules',
      url: 'https://docs.npmjs.com/about-packages-and-modules',
      type: 'documentation',
      author: 'npm',
      estimatedMinutes: 25,
      note: 'What a package is, what package.json declares, and what the lockfile does.',
    },
    {
      id: 'resource-nextjs-env-vars',
      title: 'Environment Variables — Next.js',
      url: 'https://nextjs.org/docs/app/guides/environment-variables',
      type: 'documentation',
      author: 'Vercel',
      estimatedMinutes: 20,
      note: 'How environment variables are loaded, and which ones reach the browser. Directly relevant to the project.',
    },
  ],
  competencyTags: ['architecture', 'git', 'design-to-code-translation'],
  completionCriteria: [
    'Can read a package.json and run an unfamiliar project.',
    'Keeps secrets out of version control and documents them by name.',
    'Has written setup instructions verified from a clean state.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Project                                                                     */
/* -------------------------------------------------------------------------- */

const PROJECT: ModuleProject = {
  id: 'project-productionise-a-previous-project',
  slug: 'productionise-a-previous-project',
  moduleId: MODULE_ID,
  title: 'Productionise a Previous Project',
  brief:
    'Take your Module 4 or Module 5 project and bring it up to a standard someone else could pick up: TypeScript throughout, a readable Git history, and documentation that works from a clean machine.',
  learnerGoal:
    'Turn something you built into something another person could clone, understand and contribute to.',
  problem:
    'Working code and maintainable work are different things. This project is where a build becomes a repository — the step that separates a personal experiment from something you would put your name to.',
  prerequisiteLessonIds: [
    'lesson-types-as-helpful-contracts',
    'lesson-objects-unions-and-safer-interface-states',
    'lesson-understanding-git',
    'lesson-branches-commits-and-pull-requests',
    'lesson-packages-environment-variables-and-project-setup',
  ],
  objectives: [
    'Convert a working project to TypeScript without weakening the types.',
    'Express its interface state as a discriminated union.',
    'Produce a history of coherent commits on branches.',
    'Document setup so it can be verified from a clean state.',
  ],
  requirements: [
    'The Module 4 or Module 5 project, fully converted to TypeScript.',
    'A named type for every data shape.',
    'The async interface state expressed as a discriminated union.',
    'A Git repository with at least ten coherent commits.',
    'At least one feature built on a branch and merged via a pull request.',
    'A README with what, how to run, and environment documentation.',
    'A committed `.env.example` if the project uses any configuration.',
  ],
  constraints: [
    'No `any`. If a type is hard, solve it rather than switching checking off.',
    'No behaviour changes. This is a conversion, not a rewrite — the product should work exactly as before.',
    'Commits must be coherent; one commit containing the whole conversion does not qualify.',
    'The setup instructions must be verified by following them from a clean clone.',
  ],
  suggestedScope:
    'One existing project, properly converted. Roughly twelve to eighteen hours. It is finished when a stranger could clone it and run it without asking you anything.',
  deliverables: [
    'The converted repository.',
    'A readable `git log --oneline`.',
    'At least one merged pull request with a proper description.',
    'A README verified from a clean clone.',
    'A short note on anything the type conversion revealed.',
  ],
  completionCriteria: [
    'The project builds with no type errors and no `any`.',
    'Interface state is a discriminated union that cannot hold a contradiction.',
    'The history reads as a sequence of decisions.',
    'At least one pull request exists with a what/why/checked description.',
    'Setup instructions have been verified from a clean clone.',
    'No secret or `.env` file appears anywhere in the history.',
  ],
  portfolioEvidence: [
    'Type modelling — states made unrepresentable rather than merely avoided.',
    'Version control practice — a history that explains itself.',
    'Review practice — a pull request written to be reviewed.',
    'Documentation — setup that someone else can actually follow.',
  ],
  reflectionQuestion:
    'What did adding types reveal about code you believed was already correct?',
  estimatedHours: 15,
  competencies: [
    'typescript',
    'git',
    'state-modelling',
    'interface-state-modelling',
    'architecture',
    'critique',
  ],
  stretchGoals: [
    'Make the union exhaustive with a switch, so a new state breaks the build until handled.',
    'Add a type-checking script to package.json and run it before each commit.',
    'Write the pull request description before building the feature and see whether it survives.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Module                                                                      */
/* -------------------------------------------------------------------------- */

export const MODULE_06: CurriculumModule = {
  id: MODULE_ID,
  slug: 'typescript-git-and-workflow',
  moduleNumber: 6,
  phase: 'interface-craft',
  title: 'TypeScript, Git and Engineering Workflow',
  description:
    'Working like an engineer: types that make wrong states impossible, a history that explains itself, and a project someone else can run.',
  outcome:
    'Can take a working build and turn it into a typed, versioned, documented repository another person could contribute to.',
  prerequisites: [
    'Module 4 — JavaScript fundamentals',
    'Module 5 — state models and behaviour specifications',
  ],
  lessons: [LESSON_1, LESSON_2, LESSON_3, LESSON_4, LESSON_5],
  resources: [
    {
      id: 'resource-module-06-ts-handbook',
      title: 'The TypeScript Handbook',
      url: 'https://www.typescriptlang.org/docs/handbook/intro.html',
      type: 'documentation',
      author: 'Microsoft',
      estimatedMinutes: 240,
      note: 'The official reference. Read Everyday Types and Narrowing; leave the rest until you need it.',
    },
    {
      id: 'resource-module-06-pro-git',
      title: 'Pro Git',
      url: 'https://git-scm.com/book/en/v2',
      type: 'book',
      author: 'Scott Chacon and Ben Straub',
      estimatedMinutes: 300,
      note: 'Free and authoritative. Chapters 2 and 3 cover everything in this module.',
    },
    {
      id: 'resource-module-06-github-skills',
      title: 'GitHub Skills',
      url: 'https://skills.github.com/',
      type: 'tool',
      author: 'GitHub',
      estimatedMinutes: 120,
      note: 'Hands-on courses in real repositories. The fastest way to make the workflow stick.',
    },
    {
      id: 'resource-module-06-ts-video',
      title: 'TypeScript — Microsoft Developer on YouTube',
      url: 'https://www.youtube.com/@MicrosoftDeveloper',
      type: 'video',
      author: 'Microsoft',
      estimatedMinutes: 45,
      note: 'Talks from the TypeScript team. Search for sessions on narrowing and union types.',
    },
  ],
  project: PROJECT,
  competencies: [
    'typescript',
    'javascript',
    'git',
    'state-modelling',
    'interface-state-modelling',
    'architecture',
    'critique',
    'design-qa',
    'design-to-code-translation',
  ],
  completionCriteria: [
    'All five lessons completed.',
    'Module project marked completed.',
    'Can convert a project to TypeScript and version it properly.',
  ],
};
