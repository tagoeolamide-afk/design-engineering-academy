/**
 * Module 05 — State and Product Behaviour.
 *
 * The module where the vocabulary introduced informally in Module 1 becomes a
 * working method. The learner has now met state four separate ways — button
 * feedback, conditions, form validity, async responses — so naming it properly
 * explains something they already have rather than introducing something new.
 *
 * This module closes Phase 2 and is the bridge into React: everything taught
 * here is framework-independent and is what React assumes you already know.
 */

import type { CurriculumModule, Lesson, ModuleProject } from '@/types/curriculum';

const MODULE_ID = 'module-05';

/* -------------------------------------------------------------------------- */
/* Lesson 21                                                                   */
/* -------------------------------------------------------------------------- */

const LESSON_1: Lesson = {
  id: 'lesson-what-interface-state-means',
  slug: 'what-interface-state-means',
  moduleId: MODULE_ID,
  lessonNumber: 1,
  title: 'What Interface State Means',
  summary:
    'State is simply what is currently true. You have been working with it since Module 1 — this lesson gives it a definition precise enough to build on.',
  estimatedMinutes: 8,
  objectives: [
    'Define state as a set of facts rather than a set of appearances.',
    'Separate what is true from how it is shown.',
    'List the state of a real interface in as few values as possible.',
    'Recognise the four places you have already met state.',
  ],
  prerequisiteConcepts: [
    'Interface states from Module 1 lesson 4',
    'Conditions and async handling from Module 4',
  ],
  prerequisiteLessonIds: ['lesson-getting-data-and-waiting-for-responses'],
  recap: [
    {
      kind: 'paragraph',
      text: 'Module 4 ended with a function that could be loading, successful, empty or failed, and an interface that branched on which. That branching value was state, used before it was defined.',
    },
  ],
  priorKnowledge: [
    {
      kind: 'paragraph',
      text: 'You have met this idea four times already: as button feedback in Module 1, as component variants in your design work, as conditions in Module 4 lesson 18, and as the outcome of a request in lesson 20.',
    },
    {
      kind: 'paragraph',
      text: 'Nothing here is new. What changes is that it gets a name and a method.',
    },
  ],
  coreConcept: [
    {
      kind: 'paragraph',
      text: 'State is what is currently true about an interface.',
    },
    {
      kind: 'list',
      items: [
        'The menu is open.',
        'The form has not been submitted.',
        'The request is in progress.',
        'The user is signed in.',
        'Three items are selected.',
      ],
    },
    {
      kind: 'paragraph',
      text: 'Each is a fact, and each could be written down as a value. Together they determine everything the person sees — which is the definition worth keeping: **state is the smallest set of facts from which the whole interface can be drawn.**',
    },
  ],
  whyDesignersCare: [
    {
      kind: 'paragraph',
      text: 'Because listing the state is the fastest way to discover which screens you have not designed.',
    },
    {
      kind: 'paragraph',
      text: 'Three true-or-false facts produce eight combinations. A design with four frames has left four undesigned, and those four will exist anyway. Enumerating state converts "did we think of everything?" from a worry into a checkable list.',
    },
  ],
  howItWorks: [
    {
      kind: 'paragraph',
      text: 'The discipline is separating the fact from its appearance.',
    },
    {
      kind: 'list',
      items: [
        'Fact: the request is in progress. Appearance: the button says "Saving…" and cannot be pressed.',
        'Fact: the form has three errors. Appearance: three fields are outlined, with messages beneath.',
        'Fact: no results matched. Appearance: an illustration and a suggestion to clear the filter.',
      ],
    },
    {
      kind: 'paragraph',
      text: 'The left column is state. The right column is a decision about how to show it, and can change entirely without the state changing at all. Keeping the two apart is what allows a redesign that touches no logic.',
    },
    {
      kind: 'callout',
      tone: 'insight',
      body: 'If a value in your state list is a visual adjective — "button is grey" — it is a representation, not a state. Ask what fact the grey is reporting.',
    },
  ],
  firstPrinciples: [
    {
      kind: 'paragraph',
      text: 'The second discipline is minimality: hold the fewest values that determine everything else.',
    },
    {
      kind: 'paragraph',
      text: 'A search interface might seem to need: the query, the results, whether it is loading, whether it is empty, whether there is an error, and how many results there are. That is six.',
    },
    {
      kind: 'paragraph',
      text: 'But emptiness is just the results being zero-length, and the count is the results length. Those two are not facts to store — they are questions you can ask of a fact you already have. The real state is four: the query, the results, the loading flag and the error.',
    },
    {
      kind: 'paragraph',
      text: 'Lesson 23 pursues this properly. It is the most common source of interface bugs there is.',
    },
  ],
  designPerspective: [
    {
      kind: 'paragraph',
      text: 'The design question is which facts the user needs to be able to perceive.',
    },
    {
      kind: 'paragraph',
      text: 'Not every piece of state deserves a visible representation. Whether a request has been retried twice is true and usually not worth showing. Whether it is currently retrying is true and definitely worth showing. Deciding which facts surface is design work that state enumeration makes possible.',
    },
  ],
  engineeringPerspective: [
    {
      kind: 'paragraph',
      text: 'The engineering question is where each fact lives and who is allowed to change it.',
    },
    {
      kind: 'paragraph',
      text: 'A fact with two owners will eventually have two different values. You have seen this already in a small way: in Module 4 the "has this field failed before?" flag had to live somewhere reliable, or the validation timing fell apart. Module 8 formalises ownership.',
    },
  ],
  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'The state list is the most useful shared artefact in this entire course.',
    },
    {
      kind: 'paragraph',
      text: 'A designer reads it as the set of screens to design. An engineer reads it as the set of values to hold. It is one document doing both jobs, and when it is written first, both sides stop discovering missing cases late.',
    },
  ],
  industryExamples: [
    {
      id: 'example-figma-selection-state',
      source: 'Figma',
      title: 'One fact, many representations',
      observation:
        'What is selected in Figma drives the properties panel, the canvas handles, and which menu items are available.',
      takeaway:
        'A single fact can determine several very different parts of an interface. Storing it once is what keeps them in agreement.',
    },
    {
      id: 'example-linear-issue-state',
      source: 'Linear',
      title: 'Status as an explicit value',
      observation:
        'A Linear issue has a status from a defined set, and the interface derives filtering, grouping and colour from it.',
      takeaway:
        'Naming the allowed values is what makes the rest derivable. An open-ended status field could not drive any of it.',
    },
  ],
  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'List the state of a dropdown menu with a search field inside it.',
    },
    {
      kind: 'code',
      language: 'javascript',
      code: 'const state = {\n  isOpen: false,\n  query: "",\n  options: ["Profile", "Settings", "Sign out"],\n  highlightedIndex: 0,\n};',
    },
    {
      kind: 'paragraph',
      text: 'Four facts. From them everything is drawable: whether the panel shows, what is in the field, which options to list after filtering by the query, and which one is highlighted.',
    },
    {
      kind: 'paragraph',
      text: 'What is deliberately absent: the filtered list. That is `options` filtered by `query` — a question, not a fact. Storing it would mean two things could disagree about what is visible.',
    },
    {
      kind: 'paragraph',
      text: 'Also absent: whether the menu is empty. That is the filtered list having no entries, which is again derivable.',
    },
  ],
  commonMistakes: [
    {
      id: 'mistake-05-01-state-as-appearance',
      mistake: 'Listing state in visual terms — "button is disabled", "panel is grey".',
      why: 'The list becomes a description of one design, so changing the design means changing the state model.',
      instead:
        'Write the fact the appearance reports. "Submission in progress" survives a redesign; "button is grey" does not.',
    },
    {
      id: 'mistake-05-01-storing-the-derivable',
      mistake: 'Storing values that can be calculated from other values.',
      why: 'Two sources of the same truth can disagree, and eventually will.',
      instead: 'If you can compute it, compute it. Lesson 23 covers this in full.',
    },
  ],
  professionalConsideration: [
    {
      kind: 'paragraph',
      text: 'A long state list is usually a signal rather than a fact about complexity.',
    },
    {
      kind: 'paragraph',
      text: 'Fifteen values for one component generally means either that several derivable things are being stored, or that the component is doing more than one job. Both are worth investigating before accepting the length — a shorter list is almost always available, and finding it usually improves the design too.',
    },
  ],
  practicalExercise: {
    id: 'exercise-what-interface-state-means',
    title: 'Identify the state in a product flow',
    prompt:
      'Take a flow you know well — checkout, onboarding, a settings panel — and write out its complete state.',
    steps: [
      'Walk the flow and note every point where the interface differs.',
      'For each difference, write the fact that causes it, in plain language.',
      'Convert each fact into a named value with a type.',
      'Go through your list and mark anything derivable from something else.',
      'Remove the derivable entries and confirm the interface can still be drawn.',
      'Count the combinations your remaining values produce.',
      'Note how many of those combinations you have actually seen designed.',
    ],
    successCriteria: [
      'Every entry is a fact, not an appearance.',
      'Every entry has a name and a type.',
      'Derivable values are identified and removed.',
      'The combination count is calculated.',
      'At least one undesigned combination is identified.',
    ],
    estimatedMinutes: 40,
    hint: 'When you catch yourself writing "and then it shows…", stop. You have slipped into representation. Write what became true instead.',
  },
  reflectionQuestion:
    'Why is "the save button is grey" a worse way to describe state than "the save is in progress"?',
  reflectionHint:
    'Imagine the design changes so that saving is shown with a spinner instead. Which of the two descriptions survives?',
  resources: [
    {
      id: 'resource-react-thinking-in-state',
      title: 'Choosing the State Structure',
      url: 'https://react.dev/learn/choosing-the-state-structure',
      type: 'documentation',
      author: 'React',
      estimatedMinutes: 25,
      note: 'Written for React but the principles are framework-independent. Read it for the reasoning, not the syntax.',
    },
    {
      id: 'resource-nng-state-visibility',
      title: 'Visibility of System Status',
      url: 'https://www.nngroup.com/articles/visibility-system-status/',
      type: 'article',
      author: 'Nielsen Norman Group',
      estimatedMinutes: 10,
      note: 'The usability principle behind making state perceptible. Short and foundational.',
    },
  ],
  competencyTags: ['interface-state-modelling', 'state-modelling', 'product-thinking', 'ux-reasoning'],
  completionCriteria: [
    'Can define state as facts rather than appearances.',
    'Can list the state of a real interface minimally.',
    'Can identify derivable values and exclude them.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Lesson 22                                                                   */
/* -------------------------------------------------------------------------- */

const LESSON_2: Lesson = {
  id: 'lesson-moving-from-one-state-to-another',
  slug: 'moving-from-one-state-to-another',
  moduleId: MODULE_ID,
  lessonNumber: 2,
  title: 'Moving From One State to Another',
  summary:
    'States do not change on their own. Something causes each move, and writing those causes down is how you find the transitions nobody designed.',
  estimatedMinutes: 9,
  objectives: [
    'Identify what triggers each change of state.',
    'Draw a simple state diagram for a real interaction.',
    'Find transitions that are possible but undesigned.',
    'Decide which transitions should be forbidden.',
  ],
  prerequisiteConcepts: ['State as facts', 'Events from Module 4'],
  prerequisiteLessonIds: ['lesson-what-interface-state-means'],
  recap: [
    {
      kind: 'paragraph',
      text: 'Last lesson you listed what is true at a moment. This lesson is about the moments in between.',
    },
  ],
  priorKnowledge: [
    {
      kind: 'paragraph',
      text: 'You know from Module 4 that events are what carry user actions into code. A transition is what an event does to state — so you already have both halves.',
    },
  ],
  coreConcept: [
    {
      kind: 'paragraph',
      text: 'A **transition** is a move from one state to another, and every transition has a **trigger** — the thing that caused it.',
    },
    {
      kind: 'paragraph',
      text: 'Triggers come from three places only:',
    },
    {
      kind: 'list',
      items: [
        'The user — a click, a keystroke, a drag.',
        'The system — a response arriving, a timer expiring.',
        'The outside world — another user changing something, a connection dropping.',
      ],
    },
    {
      kind: 'paragraph',
      text: 'If a state changes and you cannot name which of these caused it, there is something in the interface you do not understand yet — and it is usually where the bugs are.',
    },
  ],
  whyDesignersCare: [
    {
      kind: 'paragraph',
      text: 'Because the transitions are where interfaces actually fail, and they are almost never in a design file.',
    },
    {
      kind: 'paragraph',
      text: 'A design shows states as frames. It rarely says what happens if someone presses Save twice, or closes the dialog while it is saving, or loses connection mid-request. Each of those is a transition, and each needs a decision.',
    },
  ],
  howItWorks: [
    {
      kind: 'paragraph',
      text: 'A state diagram is a list of states with arrows between them, each arrow labelled with its trigger. It can be a sketch; it does not need a tool.',
    },
    {
      kind: 'code',
      language: 'text',
      code: 'idle      --[press Save]-->      saving\nsaving    --[server says yes]-->  saved\nsaving    --[server says no]-->   failed\nfailed    --[press Retry]-->      saving\nsaved     --[after 3 seconds]-->  idle',
    },
    {
      kind: 'paragraph',
      text: 'Five transitions. Reading them aloud is the point: "from saving, when the server says no, go to failed". Each sentence is either obviously right or obviously missing something.',
    },
    {
      kind: 'paragraph',
      text: 'Now the useful part — the transitions that are *absent*. There is no arrow from `saving` back to `idle`, which means pressing Save again while saving does nothing. Is that right? Probably. But it is now a decision rather than an accident.',
    },
  ],
  firstPrinciples: [
    {
      kind: 'paragraph',
      text: 'The principle: an interface is defined as much by the transitions it refuses as by the ones it allows.',
    },
    {
      kind: 'paragraph',
      text: 'Forbidding `saving → saving` is what prevents a double submission. Forbidding `idle → saved` is what stops the interface claiming success for something that never happened. These refusals are the guarantees the interface makes.',
    },
    {
      kind: 'paragraph',
      text: 'Interfaces where anything can lead to anything are exactly the interfaces that end up in impossible states — showing a success message and a spinner at once, because two transitions both fired.',
    },
  ],
  designPerspective: [
    {
      kind: 'paragraph',
      text: 'The design question is what the user sees during a transition, not only at the ends of it.',
    },
    {
      kind: 'paragraph',
      text: 'Does the change happen instantly, or does something animate? Does the old content stay in place while the new loads, or vanish first? Module 12 covers motion properly; the decision to make is which transitions deserve to be perceptible at all.',
    },
  ],
  engineeringPerspective: [
    {
      kind: 'paragraph',
      text: 'The engineering question is which transitions are reachable from where.',
    },
    {
      kind: 'paragraph',
      text: 'A common bug: a response arrives after the user has already closed the dialog, and the code moves to `saved` on a component nobody is looking at — or worse, that no longer exists. The transition was valid in the abstract and invalid in the situation. Listing transitions per state is what makes that visible.',
    },
  ],
  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'The diagram is the specification. It is small enough to agree on in a meeting and precise enough to implement from.',
    },
    {
      kind: 'paragraph',
      text: 'It is also the most efficient review artefact available: reading five arrows aloud takes a minute and reliably finds the case nobody considered.',
    },
  ],
  industryExamples: [
    {
      id: 'example-stripe-payment-states',
      source: 'Stripe',
      title: 'A documented set of statuses and moves',
      observation:
        'Stripe documents payment intents as a defined set of statuses with specified transitions between them.',
      takeaway:
        'When money is involved, nobody relies on an implied state model. The explicit version is what makes the system auditable.',
    },
    {
      id: 'example-github-pr-states',
      source: 'GitHub',
      title: 'Transitions constrained by rules',
      observation:
        'A pull request moves between open, draft, merged and closed, and merging is blocked until its conditions are met.',
      takeaway:
        'The blocked transition is a feature. Preventing an invalid move is more valuable than handling it afterwards.',
    },
  ],
  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Map a confirmation dialog that deletes something, including the awkward cases.',
    },
    {
      kind: 'code',
      language: 'text',
      code: 'closed     --[press Delete]-->        confirming\nconfirming --[press Cancel]-->        closed\nconfirming --[press Escape]-->        closed\nconfirming --[press Confirm]-->       deleting\ndeleting   --[server says yes]-->     closed + item removed\ndeleting   --[server says no]-->      error\nerror      --[press Retry]-->         deleting\nerror      --[press Cancel]-->        closed',
    },
    {
      kind: 'paragraph',
      text: 'Eight transitions, and three decisions fall out immediately.',
    },
    {
      kind: 'paragraph',
      text: 'Escape closes from `confirming` but has no arrow from `deleting` — so once confirmed, the dialog cannot be dismissed. That is deliberate: a half-finished delete should not be abandoned silently.',
    },
    {
      kind: 'paragraph',
      text: 'There is no arrow from `deleting` to `deleting`, so pressing Confirm twice is impossible. And `error` keeps the dialog open, because a failure the user never sees is a failure they will repeat.',
    },
  ],
  commonMistakes: [
    {
      id: 'mistake-05-02-untriggered-transitions',
      mistake: 'Drawing states without naming what moves between them.',
      why: 'An unnamed transition is not implementable, and is usually where two people have assumed different behaviour.',
      instead: 'Label every arrow. If you cannot name the trigger, the transition is not understood yet.',
    },
    {
      id: 'mistake-05-02-ignoring-interruptions',
      mistake: 'Only mapping the path where the user cooperates.',
      why: 'People close dialogs, navigate away and lose connection mid-request constantly. Those are ordinary.',
      instead:
        'For every waiting state, ask what happens if the user leaves and if the connection drops.',
    },
  ],
  professionalConsideration: [
    {
      kind: 'paragraph',
      text: 'Transitions that cross a boundary — a dialog closing while a request is in flight — are where the hardest bugs live.',
    },
    {
      kind: 'paragraph',
      text: 'The response still arrives, and something has to decide it is no longer wanted. Modern code usually handles this by cancelling the request or by checking relevance before applying the result. Knowing the category exists is enough for now; Module 14 addresses it directly.',
    },
  ],
  practicalExercise: {
    id: 'exercise-moving-from-one-state-to-another',
    title: 'Map a dialog from closed to success or error',
    prompt:
      'Produce a complete transition map for a dialog that performs an action which can fail.',
    steps: [
      'List every state the dialog can be in.',
      'For each state, list every transition out of it with its trigger.',
      'Include Escape, clicking outside, and navigating away.',
      'For every waiting state, decide what happens if the request fails and if the user leaves.',
      'Mark every transition you have deliberately forbidden, and say why.',
      'Read the whole map aloud as sentences.',
      'Note any transition the real product you based this on gets wrong.',
    ],
    successCriteria: [
      'Every arrow has a named trigger.',
      'Escape and outside-click are both covered.',
      'Every waiting state has a failure path.',
      'Forbidden transitions are listed with reasons.',
      'Leaving mid-request is explicitly decided.',
    ],
    estimatedMinutes: 45,
    hint: 'The transitions you forgot are nearly always the ones where the user does something impatient. Assume they will close the dialog at the worst moment.',
  },
  reflectionQuestion:
    'Why is deliberately forbidding a transition more valuable than handling it after it happens?',
  reflectionHint:
    'Think about what has to be true for the handling to be correct, versus what has to be true for the move to be impossible.',
  resources: [
    {
      id: 'resource-statecharts-intro',
      title: 'Introduction to state machines and statecharts',
      url: 'https://stately.ai/docs/state-machines-and-statecharts',
      type: 'documentation',
      author: 'Stately',
      estimatedMinutes: 25,
      note: 'States, transitions and triggers explained clearly. Read the concepts; the library is optional.',
    },
    {
      id: 'resource-nng-error-recovery',
      title: 'Error Message Guidelines',
      url: 'https://www.nngroup.com/articles/error-message-guidelines/',
      type: 'article',
      author: 'Nielsen Norman Group',
      estimatedMinutes: 12,
      note: 'What the failure transitions should actually say when they arrive.',
    },
  ],
  competencyTags: ['interface-state-modelling', 'state-modelling', 'interaction-design', 'product-thinking'],
  completionCriteria: [
    'Can produce a transition map with named triggers.',
    'Covers interruption and failure paths, not only cooperation.',
    'Can justify a forbidden transition.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Lesson 23                                                                   */
/* -------------------------------------------------------------------------- */

const LESSON_3: Lesson = {
  id: 'lesson-derived-state-and-avoiding-duplicate-truth',
  slug: 'derived-state-and-avoiding-duplicate-truth',
  moduleId: MODULE_ID,
  lessonNumber: 3,
  title: 'Derived State and Avoiding Duplicate Truth',
  summary:
    'If a value can be calculated from another, calculating it is better than storing it. Two copies of one truth will disagree eventually.',
  estimatedMinutes: 8,
  objectives: [
    'Tell stored facts apart from values that can be computed.',
    'Remove duplicated truth from a state model.',
    'Explain why duplication produces bugs rather than merely redundancy.',
    'Recognise the rare cases where storing a derived value is justified.',
  ],
  prerequisiteConcepts: ['State as facts', 'Transitions'],
  prerequisiteLessonIds: ['lesson-moving-from-one-state-to-another'],
  recap: [
    {
      kind: 'paragraph',
      text: 'In lesson 21 you removed derivable values from a state list without much explanation. This lesson is the explanation, and the technique.',
    },
  ],
  priorKnowledge: [
    {
      kind: 'paragraph',
      text: 'You already met this idea in Module 4 lesson 16, where storing a price as "£79.00" destroyed the ability to sort or convert it. Same principle, applied to state instead of data.',
    },
  ],
  coreConcept: [
    {
      kind: 'paragraph',
      text: 'A fact is something only the outside world can tell you. A derived value is something you can work out from facts you already hold.',
    },
    {
      kind: 'code',
      language: 'javascript',
      code: '// Facts — nothing else can tell you these.\nconst items = [];\nconst isLoading = false;\n\n// Derived — questions about the facts above.\nconst isEmpty = items.length === 0;\nconst count = items.length;\nconst canCheckout = items.length > 0 && isLoading === false;',
    },
    {
      kind: 'paragraph',
      text: 'The bottom three are not stored. They are calculated at the moment they are needed, which means they cannot be out of date.',
    },
  ],
  whyDesignersCare: [
    {
      kind: 'paragraph',
      text: 'Because duplicated truth is the cause of a specific, recognisable class of bug you have certainly seen.',
    },
    {
      kind: 'paragraph',
      text: 'A basket icon showing 3 when the basket contains 2. A list saying "no results" above a list of results. An empty state showing beneath content. In every case two values described the same fact and one was updated.',
    },
    {
      kind: 'paragraph',
      text: 'Spotting these in a design review is possible once you know the shape: any time a design shows a count or a status alongside the thing it describes, ask where each comes from.',
    },
  ],
  howItWorks: [
    {
      kind: 'paragraph',
      text: 'The test is a question: if this value were wrong, could I work out the right answer from something else I have?',
    },
    {
      kind: 'paragraph',
      text: 'If yes, do not store it. Here is the same model, badly and then well.',
    },
    {
      kind: 'code',
      language: 'javascript',
      code: '// Bad — four values, three of which restate the first.\nconst state = {\n  items: [],\n  itemCount: 0,\n  isEmpty: true,\n  hasItems: false,\n};',
    },
    {
      kind: 'code',
      language: 'javascript',
      code: '// Good — one fact. Everything else is asked when needed.\nconst state = {\n  items: [],\n};\n\nconst itemCount = state.items.length;\nconst isEmpty = state.items.length === 0;',
    },
    {
      kind: 'paragraph',
      text: 'In the bad version, adding an item requires updating four values and every one is an opportunity to forget. In the good version there is nothing to forget.',
    },
    {
      kind: 'callout',
      tone: 'pitfall',
      body: 'Every duplicated value is a future bug with a date on it. The question is not whether they will disagree, but when.',
    },
  ],
  firstPrinciples: [
    {
      kind: 'paragraph',
      text: 'The underlying principle is single source of truth: each fact is recorded in exactly one place.',
    },
    {
      kind: 'paragraph',
      text: 'This is the same reason Module 2 argued for a spacing scale and Module 10 will argue for design tokens. The pattern recurs because it is the same problem: when one idea is written down twice, the copies drift, and nothing warns you.',
    },
  ],
  designPerspective: [
    {
      kind: 'paragraph',
      text: 'The design question is whether two things on screen are showing the same fact.',
    },
    {
      kind: 'paragraph',
      text: 'If a page has a badge saying "3 unread" and a list of three highlighted rows, those should come from the same place. When a design shows a summary and its detail together, it is specifying a derivation — and saying so prevents it being implemented as two independent values.',
    },
  ],
  engineeringPerspective: [
    {
      kind: 'paragraph',
      text: 'The engineering question is cost, and it is usually smaller than people assume.',
    },
    {
      kind: 'paragraph',
      text: 'Counting an array of fifty items is free. Deriving on demand is the correct default, and the exceptions are genuinely rare: a calculation over a very large collection, repeated many times a second. When that happens the answer is to cache the derivation explicitly, not to store a second copy of the fact.',
    },
  ],
  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'Both disciplines are asking the same question: where does this come from?',
    },
    {
      kind: 'paragraph',
      text: 'A designer asking it about two numbers on a screen and an engineer asking it about two values in a state object are doing the same work. When the answer is "two places", both have found the same bug.',
    },
  ],
  industryExamples: [
    {
      id: 'example-react-derived-guidance',
      source: 'React',
      title: 'Documented as a rule',
      observation:
        'The React documentation advises against putting into state anything that can be calculated from existing state or props.',
      takeaway:
        'This is prominent in the official guidance because it is the most common mistake people make with state.',
    },
    {
      id: 'example-notion-count-consistency',
      source: 'Notion',
      title: 'Counts that track their contents',
      observation:
        'Counts beside collapsed sections in Notion match what is inside when expanded.',
      takeaway:
        'The count is read from the contents rather than maintained separately, which is why they cannot disagree.',
    },
  ],
  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Clean up a realistic state model for a search interface.',
    },
    {
      kind: 'code',
      language: 'javascript',
      code: '// Before — eight values.\nconst state = {\n  query: "",\n  results: [],\n  resultCount: 0,\n  isLoading: false,\n  hasSearched: false,\n  isEmpty: false,\n  showEmptyState: false,\n  error: null,\n};',
    },
    {
      kind: 'paragraph',
      text: 'Work through it. `resultCount` is `results.length`. `isEmpty` is `results.length === 0`. `showEmptyState` is emptiness plus having searched plus not loading — a derivation of three other values.',
    },
    {
      kind: 'code',
      language: 'javascript',
      code: '// After — four facts.\nconst state = {\n  query: "",\n  results: [],\n  isLoading: false,\n  error: null,\n};\n\nconst hasSearched = state.query !== "";\nconst showEmptyState =\n  hasSearched && state.isLoading === false && state.results.length === 0;',
    },
    {
      kind: 'paragraph',
      text: 'Eight to four. And `hasSearched` turned out to be derivable too — a non-empty query means a search happened.',
    },
    {
      kind: 'paragraph',
      text: 'The payoff: adding a result now requires updating one value. In the eight-value version it required updating four, and the empty state appearing over a full list was always one forgotten line away.',
    },
  ],
  commonMistakes: [
    {
      id: 'mistake-05-03-boolean-per-screen',
      mistake: 'Adding a boolean for each visual variation.',
      why: 'The booleans can contradict each other — both `isEmpty` and `isLoading` true — producing states that should be impossible.',
      instead:
        'Derive the variation from the underlying facts. Contradiction then cannot be expressed.',
    },
    {
      id: 'mistake-05-03-caching-too-early',
      mistake: 'Storing a derived value because deriving it "might be slow".',
      why: 'It almost never is, and the duplication cost is certain while the performance cost is hypothetical.',
      instead: 'Derive first. Measure before caching anything.',
    },
  ],
  professionalConsideration: [
    {
      kind: 'paragraph',
      text: 'There is one case where storing a derived value is correct: when it is a snapshot of something that was true at a moment.',
    },
    {
      kind: 'paragraph',
      text: 'An invoice records the price at the time of purchase, not a reference to the current price. That looks like duplication and is not — it is a different fact, because the current price is allowed to change afterwards and the invoice is not. The test: would recalculating give you a different, wrong answer later? If so, it was never derived.',
    },
  ],
  practicalExercise: {
    id: 'exercise-derived-state-and-avoiding-duplicate-truth',
    title: 'Find duplicated truth in an interface',
    prompt:
      'Take a state model — yours, or one reconstructed from a product you use — and remove everything derivable.',
    steps: [
      'Write out the full state model as you believe it exists.',
      'For each value, ask whether it could be worked out from the others.',
      'Mark every derivable value.',
      'Rewrite the model with only facts.',
      'Write the derivations separately, as calculations.',
      'For each removed value, name a bug its removal makes impossible.',
      'Check whether any remaining pair could contradict each other, and resolve it.',
    ],
    successCriteria: [
      'A before and after model, with the count reduced.',
      'Every derived value expressed as a calculation.',
      'Each removal paired with the bug it prevents.',
      'No two remaining values can contradict one another.',
      'Any genuine snapshot value is identified and justified.',
    ],
    estimatedMinutes: 40,
    hint: 'Look hardest at the booleans. Values beginning `is`, `has` or `show` are derivable far more often than not.',
  },
  reflectionQuestion:
    'Why does storing both a list and its length eventually produce a bug rather than just wasting space?',
  reflectionHint:
    'Think about every place in the code that adds or removes an item. What must each of them remember to do?',
  resources: [
    {
      id: 'resource-react-avoid-redundant-state',
      title: 'Avoid redundant state',
      url: 'https://react.dev/learn/choosing-the-state-structure#avoid-redundant-state',
      type: 'documentation',
      author: 'React',
      estimatedMinutes: 15,
      note: 'The canonical statement of this principle, with worked examples.',
    },
    {
      id: 'resource-kent-derived-state',
      title: 'Don’t Sync State. Derive It!',
      url: 'https://kentcdodds.com/blog/dont-sync-state-derive-it',
      type: 'article',
      author: 'Kent C. Dodds',
      estimatedMinutes: 12,
      note: 'A short argument for deriving, with before-and-after examples.',
    },
  ],
  competencyTags: ['state-modelling', 'interface-state-modelling', 'architecture', 'critique'],
  completionCriteria: [
    'Can distinguish a stored fact from a derivable value.',
    'Can reduce a state model to facts only.',
    'Can name the bug that each removal prevents.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Lesson 24                                                                   */
/* -------------------------------------------------------------------------- */

const LESSON_4: Lesson = {
  id: 'lesson-optimistic-vs-confirmed-actions',
  slug: 'optimistic-vs-confirmed-actions',
  moduleId: MODULE_ID,
  lessonNumber: 4,
  title: 'Optimistic vs Confirmed Actions',
  summary:
    'You can show the result before the server confirms it, or wait. The choice is about reversibility and the cost of being wrong.',
  estimatedMinutes: 9,
  objectives: [
    'Explain what an optimistic update is and what it risks.',
    'Judge an action by its reversibility and its visibility.',
    'Design the correction when an optimistic update turns out to be wrong.',
    'Decide which approach suits a given action and defend it.',
  ],
  prerequisiteConcepts: ['Transitions', 'Async handling from Module 4'],
  prerequisiteLessonIds: [
    'lesson-moving-from-one-state-to-another',
    'lesson-getting-data-and-waiting-for-responses',
  ],
  recap: [
    {
      kind: 'paragraph',
      text: 'You have mapped transitions with triggers, including the ones that go to a waiting state. This lesson is about whether the interface should wait there at all.',
    },
  ],
  priorKnowledge: [
    {
      kind: 'paragraph',
      text: 'In Module 1 you saw that Linear appears to apply changes immediately while Stripe makes you wait for a payment. Those are the two approaches this lesson names.',
    },
  ],
  coreConcept: [
    {
      kind: 'paragraph',
      text: 'When an action goes to a server, the interface has two choices.',
    },
    {
      kind: 'list',
      items: [
        '**Confirmed** — show a waiting state, then show the result. Honest, and slower.',
        '**Optimistic** — show the result immediately, assuming it will work. Fast, and occasionally wrong.',
      ],
    },
    {
      kind: 'paragraph',
      text: 'Optimistic updates are not a trick for making things feel fast. They are a bet that the action will succeed, and like any bet they need a plan for losing.',
    },
  ],
  whyDesignersCare: [
    {
      kind: 'paragraph',
      text: 'Because the choice determines how the product feels, and the failure path is design work nobody else will do.',
    },
    {
      kind: 'paragraph',
      text: 'An optimistic update that fails has to take something back from the user — something they have already seen happen. Doing that well is genuinely hard and almost always undesigned.',
    },
  ],
  howItWorks: [
    {
      kind: 'paragraph',
      text: 'Two factors decide it: how reversible the action is, and how visible the consequence of being wrong would be.',
    },
    {
      kind: 'list',
      items: [
        'Liking a post — trivially reversible, private, very likely to succeed. Optimistic.',
        'Renaming a project — reversible, visible to collaborators, likely to succeed. Optimistic is defensible, with a clear correction.',
        'Deleting an account — irreversible. Confirmed, always.',
        'Taking a payment — irreversible and consequential. Confirmed, with the button disabled while in flight.',
      ],
    },
    {
      kind: 'paragraph',
      text: 'The pattern: optimistic as the action becomes cheaper to undo and less visible to others. The moment either rises, wait.',
    },
  ],
  firstPrinciples: [
    {
      kind: 'paragraph',
      text: 'The hard part is the correction, and it has to be designed before the optimistic update is built.',
    },
    {
      kind: 'paragraph',
      text: 'If a rename fails, the name has to revert. The question is what the user sees: does it silently snap back? Does a message explain? Does their typed value survive so they can retry without losing work?',
    },
    {
      kind: 'paragraph',
      text: 'A silent revert is the worst option, because the user may have moved on and will later find a change they believe they made has vanished.',
    },
    {
      kind: 'callout',
      tone: 'warning',
      body: 'An optimistic update without a designed correction is not optimism. It is a product that occasionally lies to the person using it.',
    },
  ],
  designPerspective: [
    {
      kind: 'paragraph',
      text: 'The design question is what the user is told when the bet loses.',
    },
    {
      kind: 'paragraph',
      text: 'The correction should be proportionate. A failed like can revert quietly — the stake is low and the user may not care. A failed rename deserves a message naming what failed and offering a retry, because the user made a decision and should know it did not take effect.',
    },
  ],
  engineeringPerspective: [
    {
      kind: 'paragraph',
      text: 'The engineering question is how to get back.',
    },
    {
      kind: 'paragraph',
      text: 'You need the previous value to revert to, which means keeping it until confirmation arrives. And if two optimistic updates overlap, reverting the first must not undo the second — which is why this gets genuinely complicated and why Module 11 revisits it with better tools.',
    },
  ],
  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'This is a decision neither discipline can make alone.',
    },
    {
      kind: 'paragraph',
      text: 'A designer who does not know the failure rate cannot judge the bet. An engineer who does not know the user consequence cannot judge the stakes. The conversation is short and has to happen before either builds anything.',
    },
  ],
  industryExamples: [
    {
      id: 'example-linear-optimistic-edits',
      source: 'Linear',
      title: 'Optimism as a product characteristic',
      observation:
        'Linear applies most edits immediately rather than showing a spinner, which is a large part of why it feels fast.',
      takeaway:
        'Sustained optimism requires reliable correction behind it. The speed is visible; the recovery machinery is not.',
    },
    {
      id: 'example-stripe-confirmed-payment',
      source: 'Stripe',
      title: 'Waiting where it matters',
      observation:
        'Stripe Checkout waits for confirmation before showing success, and prevents the button being pressed again meanwhile.',
      takeaway:
        'The same company that optimises for speed elsewhere refuses to here. Irreversibility is the deciding factor.',
    },
  ],
  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Compare four actions on the two factors.',
    },
    {
      kind: 'code',
      language: 'text',
      code: 'Action    Reversible?  Visible to others?  Choice\n--------  -----------  ------------------  ---------------------------\nLike      yes, easily  no                  optimistic, silent revert\nRename    yes          yes                 optimistic, explain failure\nDelete    no           yes                 confirmed, with confirmation\nPayment   no           no                  confirmed, button locked',
    },
    {
      kind: 'paragraph',
      text: 'Rename is the interesting row. Reversible, so optimism is tempting; visible to others, so a failure is embarrassing rather than merely annoying — a collaborator may have already seen the new name.',
    },
    {
      kind: 'paragraph',
      text: 'The usual resolution: update optimistically, and on failure revert *and* say so explicitly, keeping the typed value available. The user gets the speed and is never misled for long.',
    },
  ],
  commonMistakes: [
    {
      id: 'mistake-05-04-optimistic-irreversible',
      mistake: 'Updating optimistically for an action that cannot be undone.',
      why: 'If the action fails after the interface showed success, the user believes something happened that did not — and for a payment or deletion that is serious.',
      instead: 'Reserve optimism for actions you could reverse without consequence.',
    },
    {
      id: 'mistake-05-04-silent-revert',
      mistake: 'Reverting a failed optimistic update without telling anyone.',
      why: 'The user saw it work. Silently undoing it means they discover later that their change vanished, with no explanation available.',
      instead:
        'Revert and explain. The message can be quiet, but the change must not be invisible.',
    },
  ],
  professionalConsideration: [
    {
      kind: 'paragraph',
      text: 'Optimism changes what "saved" means, and the interface should not overstate it.',
    },
    {
      kind: 'paragraph',
      text: 'With an optimistic update, the moment the user sees the result is before the system has agreed. Products that handle this well show a quiet secondary indicator — a small pending marker that clears on confirmation — so the display is honest without being intrusive. Messaging apps do this with the single tick before the double.',
    },
  ],
  practicalExercise: {
    id: 'exercise-optimistic-vs-confirmed-actions',
    title: 'Compare four actions',
    prompt:
      'Take Like, Rename, Delete and a payment, and decide for each whether it should be optimistic or confirmed — then design the failure.',
    steps: [
      'For each action, record reversibility and visibility to others.',
      'Decide optimistic or confirmed, and write one sentence of justification.',
      'For each optimistic choice, design the failure: what reverts, what is said, what the user can do next.',
      'For each confirmed choice, design the waiting state and what prevents a second submission.',
      'Find one action in a product you use that you believe made the wrong choice, and say why.',
      'Sketch the pending indicator for one optimistic action.',
    ],
    successCriteria: [
      'All four assessed on both factors.',
      'Every choice justified in a sentence.',
      'Every optimistic choice has a designed, non-silent failure.',
      'Every confirmed choice prevents double submission.',
      'One real product decision critiqued with reasoning.',
    ],
    estimatedMinutes: 45,
    hint: 'The deciding question is usually: if this silently failed, how long before the user noticed, and what would it cost them by then?',
  },
  reflectionQuestion:
    'When is it acceptable to show a result before the server has confirmed it?',
  reflectionHint:
    'Weigh how likely failure is against what it costs. Note that the second matters far more than the first.',
  resources: [
    {
      id: 'resource-nng-response-feedback',
      title: 'Response Time Limits',
      url: 'https://www.nngroup.com/articles/response-times-3-important-limits/',
      type: 'article',
      author: 'Nielsen Norman Group',
      estimatedMinutes: 8,
      note: 'The timing thresholds that make optimism worth the complexity in the first place.',
    },
    {
      id: 'resource-mdn-abort-controller',
      title: 'AbortController',
      url: 'https://developer.mozilla.org/en-US/docs/Web/API/AbortController',
      type: 'documentation',
      author: 'MDN',
      estimatedMinutes: 15,
      note: 'How a request in flight is cancelled — useful once you start reverting things properly.',
    },
  ],
  competencyTags: ['interface-state-modelling', 'async-systems', 'product-judgement', 'interaction-design'],
  completionCriteria: [
    'Can judge an action on reversibility and visibility.',
    'Can design the correction for a failed optimistic update.',
    'Can defend the choice for a given action.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Lesson 25                                                                   */
/* -------------------------------------------------------------------------- */

const LESSON_5: Lesson = {
  id: 'lesson-mapping-product-behaviour-before-coding',
  slug: 'mapping-product-behaviour-before-coding',
  moduleId: MODULE_ID,
  lessonNumber: 5,
  title: 'Mapping Product Behaviour Before Coding',
  summary:
    'Everything from Module 1 to here, assembled into one artefact: a behaviour specification that is precise enough to build from and short enough to read.',
  estimatedMinutes: 10,
  objectives: [
    'Write a complete behaviour specification for a feature.',
    'Combine states, transitions, constraints and errors into one document.',
    'Identify undesigned behaviour before implementation starts.',
    'Use the specification as a shared artefact between design and engineering.',
  ],
  prerequisiteConcepts: [
    'Everything in Modules 1 to 5',
  ],
  prerequisiteLessonIds: [
    'lesson-what-interface-state-means',
    'lesson-moving-from-one-state-to-another',
    'lesson-derived-state-and-avoiding-duplicate-truth',
    'lesson-optimistic-vs-confirmed-actions',
  ],
  recap: [
    {
      kind: 'paragraph',
      text: 'You can list state as facts, map transitions with triggers, strip out derived values, and decide whether an action waits for confirmation. This lesson puts all four into one document.',
    },
  ],
  priorKnowledge: [
    {
      kind: 'paragraph',
      text: 'You have every component of this. What you have not done is write them together, which is where the gaps become visible — a state with no way out, a trigger with no defined result, a failure with no recovery.',
    },
  ],
  coreConcept: [
    {
      kind: 'paragraph',
      text: 'A behaviour specification answers five questions about a feature.',
    },
    {
      kind: 'list',
      ordered: true,
      items: [
        'What is the state? The minimal facts.',
        'What are the transitions? Every move and its trigger.',
        'What are the constraints? What is refused, and whether the user is told.',
        'What are the errors? Every failure and what it says.',
        'What is the recovery? What the user can do after each failure.',
      ],
    },
    {
      kind: 'paragraph',
      text: 'Five headings. It fits on a page, and it is more useful to an engineer than a set of mockups because it covers what the mockups do not.',
    },
  ],
  whyDesignersCare: [
    {
      kind: 'paragraph',
      text: 'Because this document is how a designer keeps authorship of the behaviour.',
    },
    {
      kind: 'paragraph',
      text: 'Without it, the behavioural decisions get made during implementation, by whoever hits the question first, under deadline. Those decisions are design decisions — what happens on failure, what is refused, what the user is told — and this is how you make them deliberately.',
    },
    {
      kind: 'paragraph',
      text: 'It is also the fastest route to being taken seriously by engineers, because it answers the questions they were about to ask.',
    },
  ],
  howItWorks: [
    {
      kind: 'paragraph',
      text: 'Here is the shape, for renaming a project.',
    },
    {
      kind: 'code',
      language: 'text',
      code: 'FEATURE: Rename project\n\nSTATE\n  name          the committed name\n  draft         what is currently typed\n  status        idle | saving | error\n  errorMessage  text, when status is error\n\n  Derived: isDirty = draft !== name\n          canSave = isDirty && draft is valid && status !== saving\n\nTRANSITIONS\n  idle    --[type]-->              idle, draft updated\n  idle    --[press Save]-->        saving          (only if canSave)\n  saving  --[server accepts]-->    idle, name = draft\n  saving  --[server refuses]-->    error\n  error   --[press Retry]-->       saving\n  error   --[type]-->              idle, error cleared\n\nCONSTRAINTS\n  Name must not be empty          — Save disabled, requirement shown\n  Name must be under 60 chars     — counter appears past 50\n  Cannot save while saving        — no transition exists\n\nERRORS\n  Network unreachable   "Could not reach the server. Your change is kept."\n  Name already taken    "A project with that name already exists."\n  Not permitted         "You do not have permission to rename this project."\n\nRECOVERY\n  All errors keep the draft. Retry available. Closing discards with a warning.',
    },
    {
      kind: 'paragraph',
      text: 'Notice what this forces into the open. Three distinct errors, each with its own message — a design that showed one error state has just been found incomplete. And the recovery line settles what happens on close, which no mockup would have shown.',
    },
  ],
  firstPrinciples: [
    {
      kind: 'paragraph',
      text: 'The specification is valuable because of what writing it makes impossible to avoid.',
    },
    {
      kind: 'paragraph',
      text: 'You cannot write the transitions without deciding what happens when the user types during an error. You cannot write the errors without deciding whether "name taken" and "no permission" read the same. You cannot write recovery without deciding whether the draft survives.',
    },
    {
      kind: 'paragraph',
      text: 'Every one of those is a decision somebody makes. The specification only determines whether it is made deliberately or discovered later in a bug report.',
    },
  ],
  designPerspective: [
    {
      kind: 'paragraph',
      text: 'The design question is which of these the user ever perceives.',
    },
    {
      kind: 'paragraph',
      text: 'Not every state needs a distinct visual. `canSave` being false might just be a dimmed button. But each must be considered, because the alternative is an interface that has a state with no representation at all — which is how users end up unable to tell what is happening.',
    },
  ],
  engineeringPerspective: [
    {
      kind: 'paragraph',
      text: 'The engineering question is whether the specification is implementable as written.',
    },
    {
      kind: 'paragraph',
      text: 'Sometimes it is not: the server may not distinguish "name taken" from a general failure, so the three errors cannot be told apart. That is exactly the conversation worth having before building, because the alternative is discovering it half-implemented and quietly collapsing them.',
    },
  ],
  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'This document is the clearest expression of what a design engineer is for.',
    },
    {
      kind: 'paragraph',
      text: 'It takes design judgement to write — the messages, the constraints, what the user should be told. It takes engineering understanding to write — what the server can distinguish, what transitions are reachable. One person holding both produces it in an afternoon. Two people without it produce it over three weeks of bug reports.',
    },
  ],
  industryExamples: [
    {
      id: 'example-stripe-documented-behaviour',
      source: 'Stripe',
      title: 'Behaviour published as a contract',
      observation:
        'Stripe documents the states of a payment, the transitions between them, and the errors each can produce.',
      takeaway:
        'Written as a public contract, this becomes something both sides can check an implementation against.',
    },
    {
      id: 'example-govuk-service-patterns',
      source: 'GOV.UK',
      title: 'Specified error and recovery behaviour',
      observation:
        'GOV.UK service patterns specify error wording and recovery routes as part of the pattern, not as an afterthought.',
      takeaway:
        'Treating error text as part of the designed artefact is what stops it being written by whoever implements it.',
    },
  ],
  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'The practical method, in order:',
    },
    {
      kind: 'list',
      ordered: true,
      items: [
        'Name the feature in one sentence.',
        'List the state as facts. Strip anything derivable into a separate derived section.',
        'List transitions per state, with triggers, including interruption and failure.',
        'List constraints, each paired with whether the user is told.',
        'List every error you can think of, with its message.',
        'For each error, write the recovery.',
        'Read it aloud and mark every sentence you are not certain about.',
      ],
    },
    {
      kind: 'paragraph',
      text: 'That last step is the most valuable. The sentences you hesitate over are the real output — they are the decisions nobody has made, and they are now visible before anything has been built on top of them.',
    },
  ],
  commonMistakes: [
    {
      id: 'mistake-05-05-spec-as-happy-path',
      mistake: 'Writing a specification that only describes success.',
      why: 'It documents the part everyone already agreed on and omits the part they would have disagreed about.',
      instead:
        'Budget most of the document for constraints, errors and recovery. Success takes two lines.',
    },
    {
      id: 'mistake-05-05-spec-too-long',
      mistake: 'Producing a specification nobody reads.',
      why: 'A twelve-page document is not a shared artefact. Its value comes entirely from being read before building.',
      instead: 'Keep it to a page per feature. If it will not fit, the feature is probably two features.',
    },
  ],
  professionalConsideration: [
    {
      kind: 'paragraph',
      text: 'The specification is also the test plan.',
    },
    {
      kind: 'paragraph',
      text: 'Each transition is a case to verify; each error is a case to trigger deliberately. Teams that write behaviour specifications tend to end up with better test coverage without planning it, because the list of things to check was produced as a side effect. Module 13 returns to this.',
    },
  ],
  practicalExercise: {
    id: 'exercise-mapping-product-behaviour-before-coding',
    title: 'Write a complete behaviour map for Rename Project',
    prompt:
      'Produce a full behaviour specification for renaming a project, using all five sections.',
    steps: [
      'Name the feature in one sentence.',
      'List the state as minimal facts, with derived values separated.',
      'Write every transition with its trigger, including typing during an error and closing mid-save.',
      'List the constraints and whether each is explained to the user.',
      'List at least three distinct errors with their exact messages.',
      'Write the recovery for each error, including what happens to the typed value.',
      'Decide whether the rename is optimistic or confirmed, and justify it.',
      'Mark every sentence you were unsure about.',
    ],
    successCriteria: [
      'All five sections present.',
      'State is minimal, with derived values listed separately.',
      'Every transition has a trigger, including interruptions.',
      'At least three distinct errors with distinct messages.',
      'Every error has a stated recovery and a decision about the draft.',
      'The optimistic-versus-confirmed choice is justified.',
      'Uncertain sentences are marked.',
    ],
    estimatedMinutes: 60,
    hint: 'Write the errors before the transitions. Enumerating what can go wrong tends to reveal transitions you would otherwise have missed.',
  },
  reflectionQuestion:
    'Which part of your specification were you least certain about, and who would normally have decided it?',
  reflectionHint:
    'Trace the decision to its usual owner. If the honest answer is "whoever implemented it", you have found why this document is worth writing.',
  resources: [
    {
      id: 'resource-statecharts-practical',
      title: 'State machines and statecharts',
      url: 'https://stately.ai/docs/state-machines-and-statecharts',
      type: 'documentation',
      author: 'Stately',
      estimatedMinutes: 30,
      note: 'A formal version of what this lesson does informally. Worth reading once the informal version feels natural.',
    },
    {
      id: 'resource-govuk-error-patterns',
      title: 'Error messages — GOV.UK Design System',
      url: 'https://design-system.service.gov.uk/components/error-message/',
      type: 'documentation',
      author: 'GOV.UK',
      estimatedMinutes: 15,
      note: 'Error wording treated as a designed component, with specific guidance on phrasing.',
    },
  ],
  competencyTags: [
    'interface-state-modelling',
    'state-modelling',
    'product-thinking',
    'product-judgement',
    'critique',
  ],
  completionCriteria: [
    'Can write a one-page behaviour specification covering all five sections.',
    'Specification includes interruption and failure paths.',
    'Can identify which decisions in it are undecided.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Project                                                                     */
/* -------------------------------------------------------------------------- */

const PROJECT: ModuleProject = {
  id: 'project-account-settings-and-rename',
  slug: 'account-settings-and-rename-flow',
  moduleId: MODULE_ID,
  title: 'Account Settings and Rename Flow',
  brief:
    'Specify and then build an account settings panel with a rename flow — written as a behaviour specification first, implemented second, and verified against the specification.',
  learnerGoal:
    'Prove you can decide behaviour deliberately before writing it, and build something that matches what you decided.',
  problem:
    'This is the Module 1 project revisited with everything you now know. The same panel, built properly: real validation, real async, every state specified in advance rather than discovered during implementation.',
  prerequisiteLessonIds: [
    'lesson-what-interface-state-means',
    'lesson-moving-from-one-state-to-another',
    'lesson-derived-state-and-avoiding-duplicate-truth',
    'lesson-optimistic-vs-confirmed-actions',
    'lesson-mapping-product-behaviour-before-coding',
  ],
  objectives: [
    'Write a behaviour specification before implementing anything.',
    'Build an interface whose state model contains no derivable values.',
    'Implement validation, loading, success, error and retry.',
    'Verify the built result against the written specification.',
  ],
  requirements: [
    'A behaviour specification, written and dated before implementation begins.',
    'An account settings panel with a name field, an email field and a save action.',
    'A rename flow with at least three distinguishable errors.',
    'Validation timed as decided in Module 4.',
    'A loading state, a success state, an error state and a working retry.',
    'A state model containing only facts, with derivations written separately.',
    'A stated and justified decision on optimistic versus confirmed.',
  ],
  constraints: [
    'No framework. Plain HTML, CSS and JavaScript.',
    'The specification must be written first. If implementation changes it, amend the document and note why.',
    'No value in the state model may be derivable from another.',
    'Every error must be triggerable on demand for demonstration.',
  ],
  suggestedScope:
    'One panel, fully specified and fully built. Roughly twenty to thirty hours, with the specification taking the first two or three. It is finished when every line of the specification can be demonstrated.',
  deliverables: [
    'The behaviour specification, as written before building.',
    'An amendment log of anything implementation forced you to change.',
    'The working build: HTML, CSS and JavaScript.',
    'A demonstration of every state and every error.',
    'A short note on the optimistic-versus-confirmed decision.',
  ],
  completionCriteria: [
    'The specification predates the implementation and covers all five sections.',
    'Every transition in the specification works in the build.',
    'All three errors are distinguishable and individually triggerable.',
    'The state model contains no derivable values.',
    'Closing mid-save behaves as specified.',
    'The whole flow is operable by keyboard.',
    'Every amendment to the specification is logged with a reason.',
  ],
  portfolioEvidence: [
    'Behavioural specification — evidence you decide behaviour rather than discover it.',
    'State modelling — a minimal model with derivations separated.',
    'Error handling — three distinct failures, each with recovery.',
    'Design-engineering judgement — a reasoned optimistic-versus-confirmed decision.',
    'Verification — a build checked against its own specification.',
  ],
  reflectionQuestion:
    'What did implementation force you to change in your specification, and could you have anticipated it?',
  estimatedHours: 25,
  competencies: [
    'interface-state-modelling',
    'state-modelling',
    'javascript',
    'async-systems',
    'accessibility',
    'product-judgement',
    'interaction-engineering',
  ],
  stretchGoals: [
    'Add a pending indicator for the optimistic path that clears on confirmation.',
    'Handle a second save started before the first has returned.',
    'Make the panel warn before discarding unsaved changes on close.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Module                                                                      */
/* -------------------------------------------------------------------------- */

export const MODULE_05: CurriculumModule = {
  id: MODULE_ID,
  slug: 'state-and-product-behaviour',
  moduleNumber: 5,
  phase: 'interface-craft',
  title: 'State and Product Behaviour',
  description:
    'The vocabulary you have been using since Module 1, made precise: what is currently true, what moves between those truths, what can be calculated rather than stored, and how to decide all of it before writing code.',
  outcome:
    'Can specify the complete behaviour of a feature — states, transitions, constraints, errors and recovery — before implementing it, and build to that specification.',
  prerequisites: [
    'Module 4 — JavaScript, events, conditions and async',
    'Module 1 — interface states and the interaction loop',
  ],
  lessons: [LESSON_1, LESSON_2, LESSON_3, LESSON_4, LESSON_5],
  resources: [
    {
      id: 'resource-module-05-react-state-structure',
      title: 'Choosing the State Structure',
      url: 'https://react.dev/learn/choosing-the-state-structure',
      type: 'documentation',
      author: 'React',
      estimatedMinutes: 30,
      note: 'Framework-independent principles, and direct preparation for Module 7.',
    },
    {
      id: 'resource-module-05-statecharts',
      title: 'State machines and statecharts',
      url: 'https://stately.ai/docs/state-machines-and-statecharts',
      type: 'documentation',
      author: 'Stately',
      estimatedMinutes: 45,
      note: 'The formal treatment of states and transitions. Read for the concepts.',
    },
    {
      id: 'resource-module-05-nng-status-video',
      title: 'Nielsen Norman Group video library',
      url: 'https://www.nngroup.com/videos/',
      type: 'video',
      author: 'Nielsen Norman Group',
      estimatedMinutes: 30,
      note: 'Search for system status and error recovery. Short videos that pair well with this module.',
    },
    {
      id: 'resource-module-05-govuk-errors',
      title: 'Error message — GOV.UK Design System',
      url: 'https://design-system.service.gov.uk/components/error-message/',
      type: 'documentation',
      author: 'GOV.UK',
      estimatedMinutes: 15,
      note: 'A practical reference for writing the error messages your specification will need.',
    },
  ],
  project: PROJECT,
  competencies: [
    'interface-state-modelling',
    'state-modelling',
    'product-thinking',
    'product-judgement',
    'async-systems',
    'javascript',
    'interaction-design',
    'critique',
    'ux-reasoning',
    'architecture',
    'accessibility',
    'interaction-engineering',
  ],
  completionCriteria: [
    'All five lessons completed.',
    'Module project marked completed.',
    'Can write and build to a complete behaviour specification.',
  ],
};
