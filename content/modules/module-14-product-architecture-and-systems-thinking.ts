/**
 * Module 14 — Product Architecture and Systems Thinking.
 *
 * The first module about decisions rather than techniques. Every lesson here is
 * a question with no single right answer, where the skill is holding the
 * trade-offs in view and being able to defend the choice. Lesson 67 uses this
 * application's own cloud progress system as the worked example, because a real
 * system with real constraints teaches more than a hypothetical one.
 */

import type { CurriculumModule, Lesson, ModuleProject } from '@/types/curriculum';

const MODULE_ID = 'module-14';

/* -------------------------------------------------------------------------- */
/* Lesson 66                                                                   */
/* -------------------------------------------------------------------------- */

const LESSON_1: Lesson = {
  id: 'lesson-local-global-url-and-server-state',
  slug: 'local-global-url-and-server-state',
  moduleId: MODULE_ID,
  lessonNumber: 1,
  title: 'Local, Global, URL and Server State',
  summary:
    'The whole state chain in one lesson: what you learned in Module 5, where Module 8 put it, what Module 11 moved to the URL, and the last category — state you do not own.',
  estimatedMinutes: 10,
  objectives: [
    'Place any piece of state in one of four homes and defend the choice.',
    'Explain why server state is categorically different from the other three.',
    'Recognise when global state is solving a boundary problem badly.',
    'Audit an application’s state and find what is in the wrong place.',
  ],
  prerequisiteConcepts: [
    'State as facts, Module 5 lesson 21',
    'Ownership, Module 8 lesson 40',
    'URL state, Module 11 lesson 54',
  ],
  prerequisiteLessonIds: [
    'lesson-debugging-with-browser-tools',
    'lesson-url-state-and-persistence',
  ],
  recap: [
    {
      kind: 'paragraph',
      text: 'Four modules have each added one rung to the same ladder. This lesson puts the whole thing in one place and adds the top rung.',
    },
  ],
  priorKnowledge: [
    {
      kind: 'paragraph',
      text: 'Module 5: state is the minimal set of facts, and everything else is derived. Module 7: a component can hold it. Module 8: it belongs with the closest common owner, and no higher. Module 11: the URL is a legitimate owner when the state should be shareable.',
    },
    {
      kind: 'paragraph',
      text: 'Each was correct and each was partial. The missing category is the one you have been quietly using since Module 11.',
    },
  ],
  coreConcept: [
    {
      kind: 'paragraph',
      text: 'Every piece of state in an application lives in one of four homes, and the choice is almost always decidable.',
    },
    {
      kind: 'list',
      ordered: true,
      items: [
        '**Local** — one component. A menu’s open state, a half-typed draft, which tab is showing inside a panel.',
        '**Lifted or global** — several components that must agree. The current theme, the signed-in user, a toast queue.',
        '**URL** — anything that should survive a reload, be shareable, or respond to back. Filters, the open record, the active tab when it is a destination.',
        '**Server** — anything the server is the authority on. The records themselves, permissions, anything another user can change.',
      ],
    },
    {
      kind: 'paragraph',
      text: 'The procedure from Module 8 still decides between the first two: find the closest common owner. Module 11 decides the third: would a shared link need to reproduce it?',
    },
    {
      kind: 'paragraph',
      text: 'The fourth is decided differently, and that difference is the lesson.',
    },
  ],
  whyDesignersCare: [
    {
      kind: 'paragraph',
      text: 'Because state in the wrong home produces a recognisable family of complaints, each traceable to one misplacement.',
    },
    {
      kind: 'list',
      items: [
        '"It forgets my filters when I refresh" — URL state kept locally.',
        '"I cannot send someone this view" — the same.',
        '"The badge count is wrong until I reload" — server state cached as client state.',
        '"Opening this panel closed the other one" — local state lifted too high.',
        '"Back went somewhere strange" — local state put in the URL.',
      ],
    },
    {
      kind: 'paragraph',
      text: 'None of those is reported as an architecture problem. All five are.',
    },
  ],
  howItWorks: [
    {
      kind: 'paragraph',
      text: 'Server state is categorically different because **you do not own it** — you hold a copy.',
    },
    {
      kind: 'paragraph',
      text: 'Local, global and URL state are all authoritative: what you have is what is true. Server state is a cached answer to a question somebody else can change at any moment, including while you are looking at it.',
    },
    {
      kind: 'code',
      language: 'ts',
      code: '/* Client-owned: this IS the truth. */\ntype ClientState = {\n  readonly theme: \'light\' | \'dark\';\n  readonly isSidebarCollapsed: boolean;\n};\n\n/* Server-owned: this is a copy, and it has an age. */\ntype ServerState<T> = {\n  readonly data: T | null;\n  readonly fetchedAt: number | null;\n  readonly isStale: boolean;\n  readonly isRefetching: boolean;\n  readonly error: AppError | null;\n};',
    },
    {
      kind: 'paragraph',
      text: 'The second type has four fields the first does not need, and all four exist because of the copy. How old is it? Should we re-ask? Are we re-asking now? Did the last attempt fail?',
    },
    {
      kind: 'paragraph',
      text: 'This is the Module 11 lesson 51 state model, and now you can see what it was really about. It was never about loading spinners; it was about the honest representation of borrowed data.',
    },
    {
      kind: 'callout',
      tone: 'insight',
      body: 'Treating server state like client state is the single most common frontend architecture mistake. It produces a store full of data with no notion of age, which is why so many applications show stale figures until a reload.',
    },
  ],
  firstPrinciples: [
    {
      kind: 'paragraph',
      text: 'Global state is where architecture problems go to hide.',
    },
    {
      kind: 'paragraph',
      text: 'A store holding the signed-in user and the theme is reasonable: genuinely application-wide, genuinely client-owned. A store that has accumulated the project list, the current filters, the open dialog and a draft is a store that has become a bypass for component boundaries.',
    },
    {
      kind: 'paragraph',
      text: 'The test from Module 8 lesson 40 still applies, and still works: if state had to be lifted four levels because the components needing it are scattered, the boundaries were wrong. Putting it in a store removes the symptom and keeps the cause — and now every component can change anything, so nothing can be reasoned about locally.',
    },
    {
      kind: 'paragraph',
      text: 'There are three legitimate reasons for global state: it is genuinely application-wide, it is expensive to recreate, or it must outlive the components reading it. "It was awkward to pass down" is not one of them, though it is the usual one.',
    },
  ],
  designPerspective: [
    {
      kind: 'paragraph',
      text: 'The design question is what must survive what.',
    },
    {
      kind: 'paragraph',
      text: 'Must it survive a reload? Then not local. Must it survive being sent to a colleague? Then the URL. Must it survive the user switching devices? Then the server. Must it be the same for two people at once? Then the server, with the consistency questions of the next lesson.',
    },
    {
      kind: 'paragraph',
      text: 'That sequence of four questions places almost every piece of state in a product, and it is answerable from the design alone — before any code exists.',
    },
  ],
  engineeringPerspective: [
    {
      kind: 'paragraph',
      text: 'The engineering question is how many homes a single fact has.',
    },
    {
      kind: 'paragraph',
      text: 'The answer must be one. A filter in both the URL and a store will diverge the first time one updates without the other — the two-owners problem from Module 8, which does not become acceptable at application scale.',
    },
    {
      kind: 'paragraph',
      text: 'The hard case is server state you also want in the URL: the open record’s **id** belongs in the URL, and the record itself belongs in the server cache. One fact each, and the id is what connects them.',
    },
  ],
  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'The four homes are the Module 5 principle applied at four scales.',
    },
    {
      kind: 'paragraph',
      text: 'One fact, one place, everything else derived — within a component, across a tree, across a session, and across devices. The principle did not change as the scope grew. Only the question of where "one place" is.',
    },
  ],
  industryExamples: [
    {
      id: 'example-react-managing-state',
      source: 'React',
      title: 'State placement documented as a sequence of decisions',
      observation:
        'React’s state management guidance progresses from local state through lifting to sharing, treating placement as the primary decision.',
      takeaway:
        'The official guidance never starts with a store. It arrives at one only when the earlier options have been ruled out.',
    },
    {
      id: 'example-query-libraries-separate-server-state',
      source: 'TanStack Query',
      title: 'Server state as its own category',
      observation:
        'Data-fetching libraries describe server state as a distinct concern from client state, with its own staleness and revalidation model.',
      takeaway:
        'The separation is the library’s central claim. Once you accept it, most of the apparent complexity of state management disappears.',
    },
  ],
  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Audit this application’s own state, which you can read.',
    },
    {
      kind: 'code',
      language: 'markdown',
      code: '| Fact | Home | Why |\n| --- | --- | --- |\n| Signed-in user | Global | Application-wide, client-held copy of a session |\n| Completed lesson ids | Server | Must follow the learner to another device |\n| Current lesson | URL | A lesson is a destination; must be linkable |\n| Lesson section scroll position | Local | Nobody else cares; should not survive a reload |\n| Notes draft, mid-typing | Local | Then debounced to the server once settled |\n| Sync status (idle/saving/error) | Global | The indicator is in the chrome, far from the editor |\n| Last synced timestamp | Server, mirrored | The server’s value is authoritative; the copy guards conflicts |\n| Progress percentages | Derived | Never stored — computed from completed ids |\n| Theme | Global + browser storage | Client-owned, must survive a reload |',
    },
    {
      kind: 'paragraph',
      text: 'Two rows are worth dwelling on. Progress percentages are **derived** — the Module 5 lesson 23 rule held all the way to a cloud-synced application, which is why a learner never sees a percentage that disagrees with their completed lessons.',
    },
  ],
  commonMistakes: [
    {
      id: 'mistake-14-01-server-state-as-client-state',
      mistake: 'Putting fetched records in a client store with no notion of age.',
      why: 'Nothing knows the data is a copy, so nothing can decide to re-ask, and the interface shows stale values until a reload.',
      instead: 'Treat server state as its own category, with fetch time, staleness and refetch state.',
    },
    {
      id: 'mistake-14-01-global-as-convenience',
      mistake: 'Moving state to a store because passing it down was awkward.',
      why: 'It hides a boundary problem and lets any component change anything, so nothing can be reasoned about in isolation.',
      instead:
        'Fix the boundaries. Use global state when it is application-wide, expensive to recreate, or must outlive its readers.',
    },
  ],
  professionalConsideration: [
    {
      kind: 'paragraph',
      text: '"How do you decide where state lives?" is one of the most reliable signals in a senior frontend interview.',
    },
    {
      kind: 'paragraph',
      text: 'Not because the answer is hard, but because it separates people who have a procedure from people who have a habit. Someone who says "local until two components need it, URL if it should be shareable, server if the server is the authority" has thought about it. Someone who says "we put it in the store" has a default. The four-question sequence in this lesson is worth being able to recite.',
    },
  ],
  goDeeper: [
    {
      kind: 'paragraph',
      text: 'Everything below was part of the walkthrough above. It is the detail that matters once the core idea has landed, and it is safe to skip on a first pass.',
    },
    {
      kind: 'paragraph',
      text: 'And the notes draft is local while being typed, then committed to the server when it settles. That is not indecision; it is the recognition that an in-progress draft and a saved note are different facts with different owners.',
    },
    {
      kind: 'paragraph',
      text: 'The sync status is global for a specific reason: the indicator lives in the application chrome and the thing being saved is deep in a lesson page. Their closest common owner is the layout, which is effectively global — the Module 8 procedure arriving at a store legitimately.',
    },
  ],
  practicalExercise: {
    id: 'exercise-local-global-url-and-server-state',
    title: 'Audit an application’s state',
    prompt:
      'Audit every piece of state in a real application — yours or this one — placing each in a home with a justification, and find what is misplaced.',
    steps: [
      'List every piece of state in the application. Be exhaustive.',
      'Mark anything that turns out to be derived, and remove it from the list.',
      'For each remaining fact, apply the four survival questions and assign a home.',
      'Flag anything with two homes, and decide which is authoritative.',
      'Flag any server state held without a notion of age.',
      'Flag any global state that is global for convenience, and say where it belongs.',
      'Fix the two worst misplacements.',
      'Write the four questions as a decision rule for your own future reference.',
    ],
    successCriteria: [
      'Every fact has one home and a stated reason.',
      'Derived values are excluded, not assigned a home.',
      'Any duplicate homes are resolved to one authority.',
      'Server state without an age is identified.',
      'Two misplacements are fixed and the effect described.',
      'The decision rule is written down.',
    ],
    estimatedMinutes: 85,
    hint: 'Do the derived pass first and ruthlessly. A surprising amount of what looks like state turns out to be a calculation somebody stored, and it does not need a home at all.',
  },
  reflectionQuestion:
    'Why does server state need fields that local, global and URL state do not?',
  reflectionHint:
    'Ask who can change each one, and whether you would find out.',
  resources: [
    {
      id: 'resource-react-managing-state-14',
      title: 'Managing State',
      url: 'https://react.dev/learn/managing-state',
      type: 'documentation',
      author: 'React',
      estimatedMinutes: 60,
      note: 'Placement treated as the primary decision, from local through lifting to context. The ordering is the argument.',
    },
    {
      id: 'resource-tanstack-caching-14',
      title: 'Caching — TanStack Query',
      url: 'https://tanstack.com/query/latest/docs/framework/react/guides/caching',
      type: 'documentation',
      author: 'TanStack',
      estimatedMinutes: 30,
      note: 'Server state as its own category with its own lifecycle. Read it for the model, which the next lesson builds on.',
    },
  ],
  competencyTags: ['architecture', 'state-modelling', 'interface-state-modelling', 'async-systems', 'product-judgement'],
  completionCriteria: [
    'Can place any piece of state in one of four homes with a reason.',
    'Treats server state as a copy with an age.',
    'Can identify global state that is hiding a boundary problem.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Lesson 67                                                                   */
/* -------------------------------------------------------------------------- */

const LESSON_2: Lesson = {
  id: 'lesson-caching-and-synchronisation',
  slug: 'caching-and-synchronisation',
  moduleId: MODULE_ID,
  lessonNumber: 2,
  title: 'Caching and Synchronisation',
  summary:
    'Once data is copied, it can be wrong. This lesson is about staleness, revalidation and what happens when two devices disagree — using this application’s own progress sync as the worked example.',
  estimatedMinutes: 10,
  objectives: [
    'Explain staleness and choose a revalidation strategy.',
    'Design a conflict guard that detects concurrent writes.',
    'Reason about two clients editing the same record.',
    'Decide what consistency a given feature actually needs.',
  ],
  prerequisiteConcepts: [
    'The four homes of state',
    'Optimistic updates, Module 11 lesson 55',
    'Async state with staleness, Module 11 lesson 51',
  ],
  prerequisiteLessonIds: ['lesson-local-global-url-and-server-state'],
  recap: [
    {
      kind: 'paragraph',
      text: 'The last lesson established that server state is a copy with an age. This lesson is about everything that follows from the word "copy".',
    },
  ],
  priorKnowledge: [
    {
      kind: 'paragraph',
      text: 'Module 11 lesson 55 had you send an `expectedUpdatedAt` so the server could detect a conflict rather than overwrite. That line was a conflict guard, introduced without explanation. Here is the explanation.',
    },
  ],
  coreConcept: [
    {
      kind: 'paragraph',
      text: 'A cache is a copy kept because asking again is expensive. Every cache therefore has one question: **when is the copy too old to use?**',
    },
    {
      kind: 'paragraph',
      text: 'Three strategies, in increasing cost and freshness.',
    },
    {
      kind: 'list',
      items: [
        '**Cache until told otherwise** — keep it, invalidate when you make a change that affects it. Cheapest; wrong if anybody else can change the data.',
        '**Stale-while-revalidate** — show the copy immediately, ask again in the background, update if different. The default for most product data.',
        '**Always fresh** — ask every time, show nothing until it answers. Necessary for balances, permissions, anything where a stale answer is harmful.',
      ],
    },
    {
      kind: 'paragraph',
      text: 'The choice is per piece of data, not per application. A project list is stale-while-revalidate; the permission check deciding whether to show the delete button is always fresh.',
    },
  ],
  whyDesignersCare: [
    {
      kind: 'paragraph',
      text: 'Because staleness is visible, and the user blames the product rather than the cache.',
    },
    {
      kind: 'paragraph',
      text: 'They archive a project on their laptop, open their phone, and it is still there. Nothing is broken — the phone has a cached list from this morning — but the product has lost their work as far as they can tell.',
    },
    {
      kind: 'paragraph',
      text: 'This is why revalidation triggers are a design decision: on focus, on reconnect, on an interval, or on an explicit refresh. Each produces a different answer to "when does my other device catch up?"',
    },
  ],
  howItWorks: [
    {
      kind: 'paragraph',
      text: 'The hard problem is two clients writing. Consider this application’s own progress sync, which has exactly that problem.',
    },
    {
      kind: 'paragraph',
      text: 'A learner has the Academy open on a laptop and a phone. Both hold a copy of their learning state. Both can mark a lesson complete. There is one row on the server.',
    },
    {
      kind: 'paragraph',
      text: 'The naive write loses data:',
    },
    {
      kind: 'code',
      language: 'sql',
      code: '-- Last write wins. The phone\'s completed lesson disappears.\nUPDATE user_learning_state\n   SET payload = $1, updated_at = now()\n WHERE user_id = $2;',
    },
    {
      kind: 'paragraph',
      text: 'The laptop loads at 10:00, the phone loads at 10:00, the phone completes a lesson at 10:05, the laptop completes a different one at 10:06 — and the laptop writes a payload built from the 10:00 copy, which does not contain the phone’s lesson. One lesson silently lost.',
    },
    {
      kind: 'paragraph',
      text: 'The guard is one extra condition:',
    },
    {
      kind: 'code',
      language: 'sql',
      code: '-- Only write if the row is still the version we read.\nUPDATE user_learning_state\n   SET payload = $1, updated_at = now()\n WHERE user_id = $2\n   AND updated_at = $3;   -- the timestamp we loaded\n-- Zero rows updated means somebody else wrote first.',
    },
    {
      kind: 'paragraph',
      text: 'This is **optimistic concurrency control**. No locks, no coordination — just a check that the world has not moved since you read it. A stale client matches zero rows and is told to reconcile rather than being allowed to overwrite.',
    },
    {
      kind: 'paragraph',
      text: 'Zero rows updated is the signal. It is the `conflict` outcome from Module 11 lesson 55, and this is where it comes from.',
    },
  ],
  firstPrinciples: [
    {
      kind: 'paragraph',
      text: 'What to do on a conflict depends on the **shape of the data**, and this is the part people get wrong.',
    },
    {
      kind: 'paragraph',
      text: 'A title is a single value. Two people editing it is a genuine conflict and somebody has to choose — which is why Module 11 showed a dialog.',
    },
    {
      kind: 'paragraph',
      text: 'A set of completed lesson ids is not. Two devices each completing a different lesson is not a disagreement at all; both are true. The correct resolution is the union, and it needs no dialog.',
    },
    {
      kind: 'code',
      language: 'ts',
      code: 'function mergeLearningState(mine: LearningState, theirs: LearningState): LearningState {\n  return {\n    /* Completion is monotonic — nothing is ever un-completed by a merge. */\n    completedLessonIds: [...new Set([...mine.completedLessonIds, ...theirs.completedLessonIds])],\n    completedProjectIds: [...new Set([...mine.completedProjectIds, ...theirs.completedProjectIds])],\n\n    /* Notes are per-lesson text: last edit per key, not per document. */\n    notes: mergeByMostRecent(mine.notes, theirs.notes),\n  };\n}',
    },
    {
      kind: 'paragraph',
      text: 'Completion merges by union because it only ever grows. Notes merge per key by recency, so editing two different lessons on two devices loses nothing — and only editing the *same* note on both is a real conflict.',
    },
    {
      kind: 'callout',
      tone: 'insight',
      body: 'Most apparent conflicts are an artefact of storing data too coarsely. A single blob conflicts constantly; the same information as independent keys barely conflicts at all. Choosing the granularity is the design decision that determines how often users see a conflict dialog.',
    },
  ],
  designPerspective: [
    {
      kind: 'paragraph',
      text: 'The design question is what consistency the feature actually needs.',
    },
    {
      kind: 'paragraph',
      text: 'Progress tracking needs **eventual** consistency: a lesson completed on a phone should appear on the laptop soon, and a few seconds of disagreement harms nobody. A shared document being edited by two people needs something much stronger, and the engineering cost is an order of magnitude higher.',
    },
    {
      kind: 'paragraph',
      text: 'Specifying the weakest consistency that serves the product is one of the highest-leverage decisions available, because it is what everything else is built on.',
    },
  ],
  engineeringPerspective: [
    {
      kind: 'paragraph',
      text: 'The engineering question is where the authority sits and what enforces it.',
    },
    {
      kind: 'paragraph',
      text: 'In this application, row-level security policies mean a learner can only read and write their own row — enforced by the database, not by the client. That matters because a client-side check is a suggestion: anyone can open the console and call the API directly.',
    },
    {
      kind: 'paragraph',
      text: 'The division is worth stating plainly: the client decides what to *show*, the server decides what is *allowed*. A product where the client decides what is allowed has no access control, however careful its interface.',
    },
  ],
  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'Caching is where the state model and the product promise meet.',
    },
    {
      kind: 'paragraph',
      text: '"Your progress follows you to any device" is a product promise. The conflict guard, the merge strategy and the revalidation triggers are what make it true. Get the merge wrong and the promise becomes "your progress follows you unless you use two devices", which is a different and much worse product.',
    },
  ],
  industryExamples: [
    {
      id: 'example-etag-conditional-requests',
      source: 'MDN',
      title: 'Conflict detection built into HTTP',
      observation:
        'HTTP provides ETags with `If-Match`, so a request can be rejected if the resource has changed since it was read.',
      takeaway:
        'The same optimistic concurrency pattern, at the protocol level. It recurs because it is the cheapest correct answer.',
    },
    {
      id: 'example-rls-server-authority',
      source: 'Supabase',
      title: 'Authorisation enforced by the database',
      observation:
        'Row-level security policies are evaluated by Postgres on every query, independent of the client making it.',
      takeaway:
        'Authority located where it cannot be bypassed. A client-side permission check is a user interface decision, not a security one.',
    },
  ],
  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Trace a real sync, end to end, for the two-device case.',
    },
    {
      kind: 'code',
      language: 'markdown',
      code: '1.  Laptop loads: payload P0, updated_at T0.\n2.  Phone loads:  payload P0, updated_at T0.\n3.  Phone marks lesson A complete → P1 = P0 + {A}.\n4.  Phone writes with expected T0 → matches → row becomes P1, T1.\n5.  Laptop marks lesson B complete → P2 = P0 + {B}.\n6.  Laptop writes with expected T0 → 0 rows → CONFLICT.\n7.  Laptop re-reads: P1, T1.\n8.  Laptop merges: union(P1, P2) = P0 + {A, B}.\n9.  Laptop writes with expected T1 → matches → row becomes P3, T2.\n10. Phone revalidates on focus → reads P3 → both lessons present.',
    },
    {
      kind: 'paragraph',
      text: 'Nothing is lost and the learner is never asked a question, because completion merges by union. Step 6 is the guard doing its job: the write that would have lost data was refused rather than applied.',
    },
  ],
  commonMistakes: [
    {
      id: 'mistake-14-02-last-write-wins',
      mistake: 'Writing the whole payload with no concurrency check.',
      why: 'A client working from a stale copy silently overwrites changes made elsewhere, and the loss is invisible.',
      instead:
        'Guard the write on the version you read. Zero rows affected means reconcile rather than retry blindly.',
    },
    {
      id: 'mistake-14-02-dialog-for-mergeable-data',
      mistake: 'Asking the user to resolve a conflict in data that could merge automatically.',
      why: 'Two devices completing different lessons is not a disagreement, and a dialog asks the user to solve a problem you created by storing it coarsely.',
      instead: 'Merge what can be merged. Reserve a dialog for a genuine conflict over a single value.',
    },
  ],
  professionalConsideration: [
    {
      kind: 'paragraph',
      text: 'Real-time collaborative editing is a different discipline, and knowing where the boundary is matters.',
    },
    {
      kind: 'paragraph',
      text: 'Optimistic concurrency with a merge handles sequential multi-device use well, which covers most products. Two people typing in the same paragraph simultaneously needs operational transforms or CRDTs — months of specialist work. The professional skill is recognising which problem you have, because building the first and claiming the second is how a product acquires a data-loss bug it cannot fix incrementally.',
    },
  ],
  goDeeper: [
    {
      kind: 'paragraph',
      text: 'Everything below was part of the walkthrough above. It is the detail that matters once the core idea has landed, and it is safe to skip on a first pass.',
    },
    {
      kind: 'paragraph',
      text: 'Step 9 re-reads and retries with the *new* timestamp. Retrying with the old one would conflict again forever — the same point Module 11 lesson 55 made about retrying against the server’s current record.',
    },
    {
      kind: 'paragraph',
      text: 'Two details this trace glosses over, both worth knowing. The retry needs a bound — three attempts, then surface an error — or a pathological case loops. And step 10 depends on a revalidation trigger existing; without one the phone shows a stale list until something prompts it.',
    },
  ],
  practicalExercise: {
    id: 'exercise-caching-and-synchronisation',
    title: 'Build sync that survives two devices',
    prompt:
      'Build a feature that syncs across two clients, with a conflict guard, a merge strategy chosen per field, and revalidation triggers.',
    steps: [
      'Choose data with at least one mergeable field and one genuinely conflicting field.',
      'Implement the write with a version or timestamp guard.',
      'Verify a stale write is refused rather than applied.',
      'Write a merge function, choosing the strategy per field and justifying each.',
      'Bound the retry and handle exhaustion with a real error.',
      'Add revalidation on focus and on reconnect.',
      'Open two browsers and interleave edits in the order from the walkthrough.',
      'Prove that no data is lost, and that the user is only asked about the genuinely conflicting field.',
    ],
    successCriteria: [
      'A stale write is refused, demonstrably.',
      'Merge strategy is chosen and justified per field.',
      'Mergeable data merges without asking the user.',
      'The conflicting field produces a user decision.',
      'Retries are bounded and exhaustion is handled.',
      'Revalidation triggers exist and work.',
      'The two-browser interleaving test loses nothing.',
    ],
    estimatedMinutes: 110,
    hint: 'Run the two-browser test with the steps in the walkthrough order rather than at random. A deliberate interleaving finds in two minutes what random clicking may not find at all.',
  },
  reflectionQuestion:
    'Why do completed lesson ids merge automatically while a project title cannot?',
  reflectionHint:
    'Ask whether two different answers can both be true.',
  resources: [
    {
      id: 'resource-mdn-etag-14',
      title: 'ETag',
      url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/ETag',
      type: 'documentation',
      author: 'MDN',
      estimatedMinutes: 20,
      note: 'The same conflict-guard pattern at the HTTP level, with conditional requests.',
    },
    {
      id: 'resource-supabase-rls-14',
      title: 'Row Level Security',
      url: 'https://supabase.com/docs/guides/database/postgres/row-level-security',
      type: 'documentation',
      author: 'Supabase',
      estimatedMinutes: 30,
      note: 'Authorisation enforced in the database. The mechanism behind this application’s own progress isolation.',
    },
  ],
  competencyTags: ['architecture', 'async-systems', 'state-modelling', 'product-judgement', 'typescript'],
  completionCriteria: [
    'Can choose a revalidation strategy per piece of data.',
    'Implements a conflict guard and handles zero-rows-affected.',
    'Chooses a merge strategy from the shape of the data.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Lesson 68                                                                   */
/* -------------------------------------------------------------------------- */

const LESSON_3: Lesson = {
  id: 'lesson-errors-recovery-and-resilience',
  slug: 'errors-recovery-and-resilience',
  moduleId: MODULE_ID,
  lessonNumber: 3,
  title: 'Errors, Recovery and Resilience',
  summary:
    'Prevention, detection, recovery and degradation — and the fact that how a product behaves when things go wrong is most of what people mean by trust.',
  estimatedMinutes: 10,
  objectives: [
    'Prevent errors structurally rather than reporting them.',
    'Classify a failure and choose the right recovery.',
    'Design degraded states that remain useful.',
    'Build an error boundary that does not discard the whole application.',
  ],
  prerequisiteConcepts: [
    'Caching and conflicts',
    'Async failure states, Module 11 lesson 51',
    'Validation timing, Module 9 lesson 43',
  ],
  prerequisiteLessonIds: ['lesson-caching-and-synchronisation'],
  recap: [
    {
      kind: 'paragraph',
      text: 'You have handled failures and conflicts case by case. This lesson is about having a policy, so each new failure does not need a fresh invention.',
    },
  ],
  priorKnowledge: [
    {
      kind: 'paragraph',
      text: 'Module 11 distinguished recoverable from terminal failures and conflicts from errors. Module 9 lesson 43 established that an error message is a piece of writing, a visual state and an announcement at once. Both scale up here.',
    },
  ],
  coreConcept: [
    {
      kind: 'paragraph',
      text: 'Resilience has four layers, and they are in order of value. The earlier ones are cheaper and better.',
    },
    {
      kind: 'list',
      ordered: true,
      items: [
        '**Prevention** — make the error impossible. The best error handling is the error that cannot occur.',
        '**Detection** — notice it precisely, including the ones the user does not see.',
        '**Recovery** — retry, roll back, reconcile, or let the user fix it.',
        '**Degradation** — when recovery fails, remain as useful as possible.',
      ],
    },
    {
      kind: 'paragraph',
      text: 'Most products start at layer three, which is why they have a lot of error messages. Layer one is where the leverage is, and you have been building it all course.',
    },
    {
      kind: 'list',
      items: [
        'Module 6: a discriminated union makes a contradictory state unwriteable.',
        'Module 8: a required `label` prop makes an unlabelled field a compile error.',
        'Module 11: validating URL parameters means malformed input never enters the application.',
        'Module 14: a conflict guard makes a lost write impossible rather than unlikely.',
      ],
    },
    {
      kind: 'paragraph',
      text: 'None of those is error handling. All four are prevention, and each removes a class of failure rather than reporting instances of it.',
    },
  ],
  whyDesignersCare: [
    {
      kind: 'paragraph',
      text: 'Because trust is built almost entirely in the failure cases.',
    },
    {
      kind: 'paragraph',
      text: 'A product that works when everything works is the baseline. What people remember is the time the connection dropped mid-form: did it keep their input, or did it lose twenty minutes of typing? One of those produces a user who trusts the product with important work. The other produces one who copies everything into a text file first.',
    },
    {
      kind: 'paragraph',
      text: 'The entire difference is a draft kept in local storage — an hour of work, and the most valuable hour in the product.',
    },
  ],
  howItWorks: [
    {
      kind: 'paragraph',
      text: 'Classifying a failure is what tells you the recovery, and a type is the right place to put the classification.',
    },
    {
      kind: 'code',
      language: 'ts',
      code: 'type AppError =\n  /* Transient: the request did not land. Retry, with backoff. */\n  | { kind: \'network\'; isRetryable: true }\n  | { kind: \'timeout\'; isRetryable: true }\n  | { kind: \'server\'; status: 500 | 502 | 503; isRetryable: true }\n\n  /* Terminal: retrying changes nothing. The user must act. */\n  | { kind: \'unauthenticated\'; isRetryable: false }\n  | { kind: \'forbidden\'; isRetryable: false }\n  | { kind: \'notFound\'; isRetryable: false }\n  | { kind: \'validation\'; fields: Record<string, string>; isRetryable: false }\n\n  /* Reconcilable: the world moved. Re-read and merge. */\n  | { kind: \'conflict\'; currentVersion: string; isRetryable: false }\n\n  /* Unknown: assume the worst and report it. */\n  | { kind: \'unknown\'; cause: unknown; isRetryable: false };',
    },
    {
      kind: 'paragraph',
      text: 'The `isRetryable` flag is derivable from `kind`, so it is strictly redundant — and it is worth keeping anyway, because it makes the retry decision impossible to get wrong at a call site and the compiler enforces that every new error kind declares one.',
    },
    {
      kind: 'paragraph',
      text: 'Retrying needs **backoff**, or a struggling server gets hit harder by every client at once.',
    },
    {
      kind: 'code',
      language: 'ts',
      code: 'async function withRetry<T>(\n  operation: () => Promise<T>,\n  attempts = 3,\n): Promise<T> {\n  let lastError: unknown;\n\n  for (let attempt = 0; attempt < attempts; attempt++) {\n    try {\n      return await operation();\n    } catch (error) {\n      lastError = error;\n      if (toAppError(error).isRetryable === false) throw error;\n\n      /* Exponential, with jitter so clients do not retry in lockstep. */\n      const base = 2 ** attempt * 250;\n      const delay = base + Math.random() * base * 0.3;\n      await new Promise((resolve) => setTimeout(resolve, delay));\n    }\n  }\n\n  throw lastError;\n}',
    },
    {
      kind: 'paragraph',
      text: 'Two details that matter. A non-retryable error throws immediately rather than being retried three times pointlessly. And the jitter prevents a thousand clients from retrying at the same instant, which is how a brief outage becomes a long one.',
    },
  ],
  firstPrinciples: [
    {
      kind: 'paragraph',
      text: '**Degradation** is the layer almost nobody designs, and the one that decides whether a failure is an inconvenience or a dead end.',
    },
    {
      kind: 'paragraph',
      text: 'The question is not "what do we show when this fails" but "what can the user still do". Those are different, and the second is the useful one.',
    },
  ],
  designPerspective: [
    {
      kind: 'paragraph',
      text: 'The design question is what the message asks the user to do.',
    },
    {
      kind: 'paragraph',
      text: 'Every error message should contain what happened, whether their work is safe, and the single most useful next action. "Something went wrong" has none of the three, which is why it is the canonical example of a bad error message.',
    },
    {
      kind: 'paragraph',
      text: '"Could not save your note. It is kept on this device and will be saved when you reconnect." has all three, and converts a failure into a status.',
    },
  ],
  engineeringPerspective: [
    {
      kind: 'paragraph',
      text: 'The engineering question is where the boundary sits.',
    },
    {
      kind: 'code',
      language: 'tsx',
      code: '/* Scoped: a crash in one card does not take the dashboard. */\n<ErrorBoundary fallback={<CardError onRetry={refetch} />}>\n  <RevenueCard />\n</ErrorBoundary>\n\n/* Not this: one broken card loses everything. */\n<ErrorBoundary fallback={<FullPageError />}>\n  <EntireDashboard />\n</ErrorBoundary>',
    },
    {
      kind: 'paragraph',
      text: 'An error boundary catches a rendering crash and shows a fallback instead of an empty page. Its placement decides how much is lost — and the instinct to wrap the application once is exactly wrong.',
    },
    {
      kind: 'paragraph',
      text: 'Two limits worth knowing: boundaries do not catch errors in event handlers or async code, so they are not a substitute for handling rejections. And a boundary with no reset leaves the user stuck with the fallback until a reload.',
    },
  ],
  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'The four layers run the whole length of this course.',
    },
    {
      kind: 'paragraph',
      text: 'Prevention is Module 6 types and Module 8 APIs. Detection is Module 11 state modelling and Module 13 measurement. Recovery is Module 11 rollback and this module’s conflict handling. Degradation is Module 1 lesson 4’s insistence that every state be designed, applied to the states nobody wants to think about.',
    },
  ],
  industryExamples: [
    {
      id: 'example-nng-error-messages',
      source: 'Nielsen Norman Group',
      title: 'Error messages with requirements',
      observation:
        'Nielsen Norman Group’s guidelines require error messages to be explicit, human-readable, polite, precise about the cause, and to suggest a way forward.',
      takeaway:
        'Those are checkable requirements, not stylistic advice. "Something went wrong" fails four of five.',
    },
    {
      id: 'example-react-error-boundaries',
      source: 'React',
      title: 'Crashes contained by placement',
      observation:
        'React error boundaries catch rendering errors in their subtree and render a fallback instead of unmounting the whole tree.',
      takeaway:
        'The containment is only as good as the placement. A single boundary at the root converts every component crash into a blank application.',
    },
  ],
  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Make a form survive a session expiring mid-submission.',
    },
    {
      kind: 'code',
      language: 'tsx',
      code: 'function useResilientDraft<T>(key: string, initial: T) {\n  const [draft, setDraft] = useState<T>(() => {\n    try {\n      const saved = localStorage.getItem(key);\n      return saved === null ? initial : (JSON.parse(saved) as T);\n    } catch {\n      return initial;\n    }\n  });\n\n  /* Prevention layer: the draft survives a crash, a reload or a redirect. */\n  useEffect(() => {\n    try {\n      localStorage.setItem(key, JSON.stringify(draft));\n    } catch {\n      /* Storage unavailable; the draft still works for this session. */\n    }\n  }, [key, draft]);\n\n  const clear = useCallback(() => {\n    try { localStorage.removeItem(key); } catch { /* nothing to do */ }\n  }, [key]);\n\n  return { draft, setDraft, clear };\n}',
    },
    {
      kind: 'code',
      language: 'tsx',
      code: 'async function submit() {\n  const outcome = await save(draft);\n\n  switch (outcome.kind) {\n    case \'ok\':\n      clear();                                  /* only now is it safe */\n      return;\n\n    case \'unauthenticated\':\n      /* Draft is already on disk. Sign in without leaving the page. */\n      setBanner({\n        message: \'Your session expired. Sign in to finish saving — your changes are kept.\',\n        action: { label: \'Sign in\', onAction: openInlineSignIn },\n      });\n      return;\n\n    case \'network\':\n      setBanner({\n        message: \'Could not save. Kept on this device; will retry when you reconnect.\',\n        action: { label: \'Retry now\', onAction: submit },\n      });\n      return;\n\n    case \'validation\':\n      setFieldErrors(outcome.fields);            /* Module 9 lesson 43 */\n      return;\n  }\n}',
    },
  ],
  commonMistakes: [
    {
      id: 'mistake-14-03-one-root-boundary',
      mistake: 'A single error boundary at the application root.',
      why: 'Any component crash blanks the entire product, when only one region was broken.',
      instead: 'Scope boundaries to regions that can fail independently, each with a reset.',
    },
    {
      id: 'mistake-14-03-retry-without-backoff',
      mistake: 'Retrying immediately, repeatedly, with no backoff or jitter.',
      why: 'Every client hammers a struggling server in lockstep, which extends the outage it was reacting to.',
      instead: 'Exponential backoff with jitter, a bounded attempt count, and no retry at all for terminal errors.',
    },
  ],
  professionalConsideration: [
    {
      kind: 'paragraph',
      text: 'Resilience work is invisible when it succeeds, which makes it chronically under-prioritised.',
    },
    {
      kind: 'paragraph',
      text: 'Nobody files a ticket saying "the form kept my draft when my session expired" — they simply do not lose work and never think about it. The argument that lands is the inverse: the support cost, the abandoned signups, and the fact that a user who loses twenty minutes of typing once will hedge against your product forever. That is worth quantifying before the conversation rather than during it.',
    },
  ],
  goDeeper: [
    {
      kind: 'paragraph',
      text: 'Everything below was part of the walkthrough above. It is the detail that matters once the core idea has landed, and it is safe to skip on a first pass.',
    },
    {
      kind: 'paragraph',
      text: 'Four outcomes, four treatments, and the draft is cleared only on confirmed success. The ordering matters: clearing optimistically would lose the work in exactly the cases this code exists for.',
    },
    {
      kind: 'paragraph',
      text: 'The unauthenticated case is the one worth copying. The conventional behaviour — redirect to sign-in — discards the form. Keeping the draft and signing in inline turns a data-loss event into a pause.',
    },
    {
      kind: 'paragraph',
      text: 'Every storage call is wrapped, because storage throws in a private window. An error handler that itself crashes is a particularly poor outcome.',
    },
    {
      kind: 'code',
      language: 'markdown',
      code: '| Failure | Dead end | Degraded but useful |\n| --- | --- | --- |\n| Offline | "No connection" page | Cached data, read-only, queued writes, clear banner |\n| Analytics endpoint down | Blank dashboard | Everything else loads; that card shows an error |\n| Avatar service down | Broken images | Initials in a coloured circle |\n| Search service down | "Search unavailable" | Browse and filter still work |\n| Session expired | Redirect, losing the form | Keep the draft, sign in inline, resume |',
    },
    {
      kind: 'paragraph',
      text: 'The last row is the one worth implementing first. A session expiring mid-form is common, and losing the user’s work for it is unnecessary — the draft is in memory and local storage exists.',
    },
    {
      kind: 'callout',
      tone: 'insight',
      body: 'Degradation requires the failure to be scoped. A page-level error state cannot degrade, because one failure has already taken everything with it. The per-region async state from Module 11 lesson 51 is what makes degradation possible at all.',
    },
  ],
  practicalExercise: {
    id: 'exercise-errors-recovery-and-resilience',
    title: 'Make one flow resilient',
    prompt:
      'Take a real flow and work through all four layers, then verify each by causing the failure deliberately.',
    steps: [
      'List every way the flow can fail, including the ones the user would not see.',
      'For each, ask whether it can be prevented structurally. Prevent at least two.',
      'Classify the rest with an error union, with retryability declared.',
      'Implement retry with exponential backoff and jitter, bounded and skipped for terminal errors.',
      'Add scoped error boundaries with resets, not one at the root.',
      'Design a degraded state for each failure: what can the user still do?',
      'Make the flow survive a session expiring mid-submission without losing input.',
      'Cause every failure deliberately — offline, 500, 403, conflict, expired session — and verify each.',
    ],
    successCriteria: [
      'Two or more failures are prevented structurally rather than handled.',
      'Errors are classified, with retryability in the type.',
      'Backoff has jitter, a bound, and skips terminal errors.',
      'Boundaries are scoped and resettable.',
      'Every failure has a degraded state where the user can still do something.',
      'A session expiring mid-form loses no input.',
      'Every failure has been caused deliberately and verified.',
    ],
    estimatedMinutes: 110,
    hint: 'Use the Network panel’s offline mode and request blocking to cause failures rather than editing code. Failures you can trigger from devtools are the ones you will actually test again later.',
  },
  reflectionQuestion:
    'Why is prevention worth more than recovery, when recovery is what users actually see?',
  reflectionHint:
    'Count how many instances each one deals with.',
  resources: [
    {
      id: 'resource-nng-error-messages-14',
      title: 'Error Message Guidelines',
      url: 'https://www.nngroup.com/articles/error-message-guidelines/',
      type: 'article',
      author: 'Nielsen Norman Group',
      estimatedMinutes: 20,
      note: 'Checkable requirements for an error message. Test your own messages against the list.',
    },
    {
      id: 'resource-react-error-boundaries-14',
      title: 'Catching rendering errors with an error boundary',
      url: 'https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary',
      type: 'documentation',
      author: 'React',
      estimatedMinutes: 20,
      note: 'What boundaries catch and, importantly, what they do not.',
    },
  ],
  competencyTags: ['architecture', 'async-systems', 'ux-reasoning', 'product-judgement', 'typescript', 'accessibility'],
  completionCriteria: [
    'Prevents failures structurally where possible.',
    'Classifies errors and retries only what is retryable, with backoff.',
    'Designs degraded states that leave the user able to act.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Lesson 69                                                                   */
/* -------------------------------------------------------------------------- */

const LESSON_4: Lesson = {
  id: 'lesson-thinking-about-product-architecture',
  slug: 'thinking-about-product-architecture',
  moduleId: MODULE_ID,
  lessonNumber: 4,
  title: 'Thinking About Product Architecture',
  summary:
    'Routes, features, data, components and state — five kinds of boundary, and the fact that a good architecture is one where the expected change is cheap.',
  estimatedMinutes: 10,
  objectives: [
    'Draw the five boundaries in an application and say where each sits.',
    'Organise code by feature rather than by file type, and explain when not to.',
    'Judge an architecture by the cost of an expected change.',
    'Record an architectural decision so it survives you.',
  ],
  prerequisiteConcepts: [
    'Component boundaries, Module 8 lesson 36',
    'The four homes of state',
    'Resilience boundaries',
  ],
  prerequisiteLessonIds: ['lesson-errors-recovery-and-resilience', 'lesson-choosing-component-boundaries'],
  recap: [
    {
      kind: 'paragraph',
      text: 'Module 8 taught component boundaries. An application has four more kinds, and they interact.',
    },
  ],
  priorKnowledge: [
    {
      kind: 'paragraph',
      text: 'You know a good component boundary has one responsibility and groups things that change together, and that the honest test is naming an expected change and counting the files it touches. Both scale up unchanged.',
    },
  ],
  coreConcept: [
    {
      kind: 'paragraph',
      text: 'An application has five kinds of boundary, and they should mostly agree with each other.',
    },
    {
      kind: 'list',
      ordered: true,
      items: [
        '**Route** — what has a URL. Decides what is linkable, what loads together, and what the back button does.',
        '**Feature** — what ships together and is owned together. Decides where code lives.',
        '**Data** — what is fetched together. Decides request count and what can fail independently.',
        '**Component** — what renders together. Module 8.',
        '**State** — what changes together. The four homes.',
      ],
    },
    {
      kind: 'paragraph',
      text: 'When they agree, a change is local: a new field in the settings feature touches the settings route, the settings data, the settings components and the settings state, all in one folder.',
    },
    {
      kind: 'paragraph',
      text: 'When they disagree, every change is a tour of the codebase — and that tour is the most reliable symptom of an architecture problem.',
    },
  ],
  whyDesignersCare: [
    {
      kind: 'paragraph',
      text: 'Because architecture decides which design changes are cheap, and therefore which ones happen.',
    },
    {
      kind: 'paragraph',
      text: 'If adding a field to a form means touching seven files across four folders, that change gets estimated at two days and deferred. If it is one file, it happens this afternoon. The architecture has quietly decided which design improvements are worth proposing.',
    },
    {
      kind: 'paragraph',
      text: 'This is the strongest argument for a designer understanding architecture: it is the thing that determines whether your design iteration is affordable.',
    },
  ],
  howItWorks: [
    {
      kind: 'paragraph',
      text: 'The organisation decision that matters most is **by feature rather than by type**.',
    },
    {
      kind: 'code',
      language: 'markdown',
      code: 'By type — every change touches every folder:\n\n  components/   ProjectCard, ProjectList, SettingsForm, InvoiceRow …\n  hooks/        useProjects, useSettings, useInvoices …\n  types/        project.ts, settings.ts, invoice.ts …\n  api/          projects.ts, settings.ts, invoices.ts …\n\nBy feature — a change stays in one folder:\n\n  features/\n    projects/   components/  hooks/  types.ts  api.ts  index.ts\n    settings/   components/  hooks/  types.ts  api.ts  index.ts\n    invoices/   components/  hooks/  types.ts  api.ts  index.ts\n  shared/\n    components/ Button, Input, Dialog …      ← the Module 8 library\n    lib/        formatting, dates, fetch …',
    },
    {
      kind: 'paragraph',
      text: 'By type is tidy and wrong: it groups files by what they are rather than by what they are about, so nothing that changes together lives together.',
    },
    {
      kind: 'paragraph',
      text: 'The `index.ts` per feature is doing real work — it is the feature’s public API. Everything else inside is private, which means a feature can be refactored without a codebase-wide search.',
    },
    {
      kind: 'code',
      language: 'ts',
      code: '// features/projects/index.ts — the only surface other features may use.\nexport { ProjectList } from \'./components/project-list\';\nexport { useProjects } from \'./hooks/use-projects\';\nexport type { Project, ProjectStatus } from \'./types\';\n\n// Deliberately not exported: ProjectRow, useProjectQuery, normaliseProject.',
    },
    {
      kind: 'paragraph',
      text: 'This is Module 8 lesson 37 at a larger scale. A component’s props are its API; a feature’s index is its API; and both are harder to change than what sits behind them.',
    },
  ],
  firstPrinciples: [
    {
      kind: 'paragraph',
      text: 'The principle: **a good architecture makes the expected change cheap, and nothing else**.',
    },
    {
      kind: 'paragraph',
      text: 'There is no architecture that makes every change cheap. Every structure makes some changes trivial and others expensive, so the only sensible question is which changes you expect.',
    },
    {
      kind: 'code',
      language: 'markdown',
      code: '| Expected change | Files touched | Verdict |\n| --- | --- | --- |\n| Add a field to a form | 1 | Good |\n| Add a filter to a list | 2 | Good |\n| Add a whole new feature | 1 new folder + 1 route | Good |\n| Change the primary colour | 1 token | Good |\n| Add a second workspace per user | 40+ | Expensive — but is it expected? |\n| Support offline for everything | everywhere | Expensive — and probably not expected |',
    },
    {
      kind: 'callout',
      tone: 'insight',
      body: 'The last two are only problems if those changes are coming. Architecting for a multi-workspace future that never arrives costs you every day until then — which is the whole case against speculative generality.',
    },
    {
      kind: 'paragraph',
      text: 'So the useful exercise is to write down the five changes you genuinely expect in the next six months and count the files for each. That list is your architecture brief, and it is specific to your product rather than borrowed from a diagram.',
    },
  ],
  designPerspective: [
    {
      kind: 'paragraph',
      text: 'The design question is whether the routes match how people think about the product.',
    },
    {
      kind: 'paragraph',
      text: 'Routes are the product’s visible structure. `/projects/123/settings` says a project has settings; `/settings?project=123` says settings is a place that can be about a project. Those are different mental models, and the URL teaches one of them whether or not anybody decided to.',
    },
    {
      kind: 'paragraph',
      text: 'Route structure is therefore information architecture, and it belongs in a design conversation rather than being inherited from the folder layout.',
    },
  ],
  engineeringPerspective: [
    {
      kind: 'paragraph',
      text: 'The engineering question is which boundaries are allowed to depend on which.',
    },
    {
      kind: 'paragraph',
      text: 'Features may depend on shared; shared may never depend on a feature. Features importing each other directly is how a codebase becomes a single tangled unit where nothing can be removed.',
    },
    {
      kind: 'paragraph',
      text: 'This is enforceable rather than aspirational — a lint rule forbidding the import, or a dependency check in CI. Module 10 lesson 50’s point about automated enforcement applies: a rule nobody checks is a preference.',
    },
  ],
  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'Architecture is the same judgement as component design, two levels up.',
    },
    {
      kind: 'paragraph',
      text: 'One responsibility, things that change together living together, a deliberate public surface, and dependencies that point one way. Module 8 applied that to a Button. This lesson applies it to a product. The scale changed; the reasoning did not — which is why the Module 8 exercises were worth doing properly.',
    },
  ],
  industryExamples: [
    {
      id: 'example-adr-decision-records',
      source: 'Architectural Decision Records',
      title: 'Decisions recorded with their context',
      observation:
        'The ADR convention records each significant decision as a short document stating the context, the options, the choice and its consequences.',
      takeaway:
        'The context is the valuable part. A decision whose reasoning is lost looks arbitrary in a year and gets reversed by someone solving a problem it was the answer to.',
    },
    {
      id: 'example-feature-colocation',
      source: 'Next.js',
      title: 'Routes colocated with their code',
      observation:
        'File-based routing places a route’s page, layout, loading and error states together in one folder.',
      takeaway:
        'The framework has an opinion: route and feature boundaries should coincide. Working with it is cheaper than organising by type alongside it.',
    },
  ],
  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Write an architecture decision record for a real choice — this application’s single-table progress store.',
    },
    {
      kind: 'code',
      language: 'markdown',
      code: '# ADR-003 · One row per user for learning state\n\n**Status** Accepted\n**Date** 2026-09-20\n\n## Context\nLearning progress is completed lessons, completed projects and per-lesson notes.\nIt must sync across devices and survive a reload. It is read on almost every\npage and written often while a learner works. There is one user per dataset, and\nno sharing between users.\n\n## Options\n\n1. **A row per event** — one row per completion. Natural history, precise\n   conflict resolution, many rows, a join or aggregate on every read.\n2. **One row per user, JSON payload** — one read, one write, trivially simple.\n   Coarse conflicts, no history, whole payload written each time.\n3. **Normalised tables** — a table per entity. Correct and conventional. More\n   schema, more queries, more migration work.\n\n## Decision\nOption 2. One row per user with a JSON payload and an `updated_at` conflict\nguard.\n\n## Consequences\n\n**Good**\n- One query reads everything needed to derive every status.\n- Row-level security is a single policy on one table.\n- Progress is derived, never stored, so it cannot disagree with itself.\n\n**Bad**\n- The whole payload is written on every change. Fine at this size; wrong at\n  thousands of items.\n- Conflicts are at payload granularity, so the merge is in application code\n  rather than the database.\n- No history. "When did I complete this?" cannot be answered later.\n\n**Revisit if**\n- Payload exceeds roughly 100KB.\n- Progress history becomes a product feature.\n- More than one person needs to write to the same dataset.',
    },
  ],
  commonMistakes: [
    {
      id: 'mistake-14-04-organise-by-type',
      mistake: 'Organising code by file type across the whole application.',
      why: 'Nothing that changes together lives together, so every change touches every folder.',
      instead: 'Organise by feature, with a genuinely shared layer for what is used everywhere.',
    },
    {
      id: 'mistake-14-04-speculative-architecture',
      mistake: 'Architecting for requirements nobody has asked for.',
      why: 'The abstraction costs every day, the requirement often never arrives, and when it does it is rarely the shape you guessed.',
      instead: 'Architect for the changes you expect in the next six months. Record what would make you revisit.',
    },
  ],
  professionalConsideration: [
    {
      kind: 'paragraph',
      text: 'The most valuable architectural skill is knowing which decisions are expensive to reverse.',
    },
    {
      kind: 'paragraph',
      text: 'Folder structure is cheap — reorganise it in an afternoon. A data model, a URL scheme, an authentication approach and a public API are expensive: each has dependents outside your control. Spend your thinking proportionally. A week on folder structure and an afternoon on the data model is the wrong way round, and it is the common way round.',
    },
  ],
  goDeeper: [
    {
      kind: 'paragraph',
      text: 'Everything below was part of the walkthrough above. It is the detail that matters once the core idea has landed, and it is safe to skip on a first pass.',
    },
    {
      kind: 'paragraph',
      text: 'The "revisit if" section is what makes this document useful rather than decorative. It names the conditions under which the decision stops being right, so a future reader can tell whether it still holds.',
    },
    {
      kind: 'paragraph',
      text: 'Note that the consequences are honest about the downsides. An ADR listing only benefits is advocacy, and advocacy is not reusable — the reader cannot tell what was traded away.',
    },
  ],
  practicalExercise: {
    id: 'exercise-thinking-about-product-architecture',
    title: 'Draw and judge an architecture',
    prompt:
      'Map the five boundaries in a real application, judge it against the changes you expect, and record one decision as an ADR.',
    steps: [
      'List the routes and say what each makes linkable.',
      'List the features and what ships together.',
      'List the data boundaries — what is fetched together, what can fail independently.',
      'Map component and state boundaries onto the features.',
      'Mark every place the five boundaries disagree.',
      'Write the five changes you expect in six months and count files for each.',
      'Reorganise one disagreement and measure the file count again.',
      'Write an ADR for one real decision, including honest downsides and a "revisit if".',
    ],
    successCriteria: [
      'All five boundaries mapped.',
      'Disagreements between them identified explicitly.',
      'Five expected changes listed with file counts.',
      'One reorganisation made and re-measured.',
      'An ADR exists with options, consequences and revisit conditions.',
      'The ADR’s downsides are stated as plainly as its benefits.',
    ],
    estimatedMinutes: 95,
    hint: 'Count the files for your expected changes before reorganising anything. Without the before figure you cannot tell whether the reorganisation helped or merely felt tidier.',
  },
  reflectionQuestion:
    'Why is "which changes do we expect?" a better architecture question than "what is the best structure?"',
  reflectionHint:
    'Ask whether any structure makes every change cheap.',
  resources: [
    {
      id: 'resource-adr-14',
      title: 'Architectural Decision Records',
      url: 'https://adr.github.io/',
      type: 'documentation',
      author: 'ADR',
      estimatedMinutes: 25,
      note: 'The convention and several templates. Start with the shortest one; a long template goes unwritten.',
    },
    {
      id: 'resource-nextjs-docs-14',
      title: 'Next.js documentation',
      url: 'https://nextjs.org/docs',
      type: 'documentation',
      author: 'Next.js',
      estimatedMinutes: 60,
      note: 'Read the routing and data-fetching sections as a worked example of route and feature boundaries coinciding.',
    },
  ],
  competencyTags: ['architecture', 'product-thinking', 'component-architecture', 'product-judgement', 'state-modelling'],
  completionCriteria: [
    'Can map the five boundaries and find where they disagree.',
    'Organises by feature with a one-way dependency rule.',
    'Judges architecture by the cost of expected change.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Lesson 70                                                                   */
/* -------------------------------------------------------------------------- */

const LESSON_5: Lesson = {
  id: 'lesson-systematic-product-critique',
  slug: 'systematic-product-critique',
  moduleId: MODULE_ID,
  lessonNumber: 5,
  title: 'Systematic Product Critique',
  summary:
    'Nine layers in a fixed order, so a critique finds causes rather than symptoms — and so "it feels wrong" becomes a list somebody can act on.',
  estimatedMinutes: 10,
  objectives: [
    'Critique a product through nine layers in order.',
    'Explain why the order prevents treating symptoms.',
    'Separate an observation from a judgement from a recommendation.',
    'Deliver a critique that is usable by the people who built the thing.',
  ],
  prerequisiteConcepts: [
    'Everything in the course so far',
    'Design QA, Module 13 lesson 64',
    'Architecture boundaries',
  ],
  prerequisiteLessonIds: ['lesson-thinking-about-product-architecture', 'lesson-design-qa'],
  recap: [
    {
      kind: 'paragraph',
      text: 'Module 13 lesson 64 gave you four QA passes for a product you are building. This lesson is the broader version, for a product you did not build and are being asked to assess.',
    },
  ],
  priorKnowledge: [
    {
      kind: 'paragraph',
      text: 'Design QA measured implementation against a known design. Critique has no design to compare against — only the product and the user’s goal. That makes the order of enquiry do the work the design used to do.',
    },
  ],
  coreConcept: [
    {
      kind: 'paragraph',
      text: 'Critique runs through nine layers, and the order is the method.',
    },
    {
      kind: 'list',
      ordered: true,
      items: [
        '**User goal** — what is the person trying to achieve? Everything else is judged against this.',
        '**Information** — is the right information present, and nothing more?',
        '**Hierarchy** — does what matters most look like it matters most?',
        '**Interaction** — are the actions obvious, reachable and forgiving?',
        '**State** — is every state designed, including the unwelcome ones?',
        '**Accessibility** — does all of the above work without sight, without a pointer, without movement?',
        '**Performance** — is it fast enough to use for the actual task?',
        '**Maintainability** — can this be changed safely, and is it on the system?',
        '**Polish** — the final layer, and only once the eight above are right.',
      ],
    },
    {
      kind: 'paragraph',
      text: 'Polish is last on purpose. A beautifully refined screen solving the wrong problem is worse than a plain one solving the right problem, and critiquing in the other order produces a product that is well made and useless.',
    },
  ],
  whyDesignersCare: [
    {
      kind: 'paragraph',
      text: 'Because the order is what stops a critique from treating symptoms.',
    },
    {
      kind: 'paragraph',
      text: 'A screen feels cluttered. Starting at hierarchy produces suggestions about weight, spacing and size — all plausible, none addressing the cause. Starting at information frequently reveals that four of the eleven elements serve no user goal, and removing them solves the clutter without a single typographic change.',
    },
    {
      kind: 'paragraph',
      text: 'Hierarchy fixes applied to an information problem are the most common wasted design effort there is.',
    },
  ],
  howItWorks: [
    {
      kind: 'paragraph',
      text: 'Each finding has three separable parts, and conflating them is what makes critique land badly.',
    },
    {
      kind: 'list',
      items: [
        '**Observation** — what is there. Verifiable, and not arguable.',
        '**Judgement** — why it is a problem, against the user goal. Arguable, and should be argued.',
        '**Recommendation** — what to do instead. One option among several.',
      ],
    },
    {
      kind: 'code',
      language: 'markdown',
      code: 'Weak:\n  "The dashboard is cluttered and the hierarchy needs work."\n\nSeparated:\n  OBSERVATION    Eleven elements above the fold. Six are metrics, three are\n                 navigation, two are promotional.\n  JUDGEMENT      The stated user goal is checking whether anything needs\n                 attention today. Four of the six metrics are historical and\n                 cannot need attention. The two promotional elements serve the\n                 business, not the goal.\n  RECOMMENDATION Lead with the two actionable metrics. Move the historical four\n                 to a second view. Remove the promotional elements or move them\n                 below the fold.',
    },
    {
      kind: 'paragraph',
      text: 'The separation matters because the three parts can be disagreed with independently. Someone can accept the observation, dispute the judgement — perhaps the promotional space is contractually required — and still use the recommendation for the metrics.',
    },
    {
      kind: 'paragraph',
      text: 'Conflated into "it is cluttered", there is nothing to agree or disagree with, so the conversation becomes about taste and whoever is more senior wins.',
    },
  ],
  firstPrinciples: [
    {
      kind: 'paragraph',
      text: 'The layers are ordered by **how expensive the fix is and how much depends on it**.',
    },
    {
      kind: 'paragraph',
      text: 'A user-goal problem invalidates everything built on it. An information problem changes the hierarchy. A hierarchy problem changes the interaction. Each layer constrains the ones below.',
    },
    {
      kind: 'paragraph',
      text: 'So a finding at layer two can eliminate twenty findings at layer three — which is why running the layers in order is faster as well as more accurate, despite feeling slower at the start.',
    },
    {
      kind: 'callout',
      tone: 'insight',
      body: 'If you find yourself making many small suggestions at one layer, look up a layer. A long list of hierarchy fixes usually means the information was never edited.',
    },
  ],
  designPerspective: [
    {
      kind: 'paragraph',
      text: 'The design question is what the user goal actually is, and it is worth real scepticism.',
    },
    {
      kind: 'paragraph',
      text: 'Teams routinely describe the goal as what the feature does: "the user wants to see their analytics." Almost nobody wants to see analytics. They want to know whether something has gone wrong, or whether a decision worked. Those produce completely different screens, and the second is what the critique should be measured against.',
    },
  ],
  engineeringPerspective: [
    {
      kind: 'paragraph',
      text: 'The engineering question is maintainability, and layer eight is the one design-only critiques omit entirely.',
    },
    {
      kind: 'paragraph',
      text: 'Is this built from the system or bespoke? Are the states handled or will they appear later as bugs? Is the state model coherent? Will the next change be cheap?',
    },
    {
      kind: 'paragraph',
      text: 'A product that is excellent on layers one to seven and bespoke throughout will decay, because every change is expensive and the shortcuts accumulate. Being able to critique that layer is a substantial part of what the hybrid role is for.',
    },
  ],
  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'The nine layers are this course, in order.',
    },
    {
      kind: 'paragraph',
      text: 'Goal and information are Modules 1 and 5. Hierarchy is Module 2. Interaction is Modules 4, 8 and 12. State is Modules 5 and 11. Accessibility is Module 9. Performance is Module 13. Maintainability is Modules 10 and 14. Polish is everything at once.',
    },
    {
      kind: 'paragraph',
      text: 'That is not a coincidence of ordering. The curriculum was sequenced by the same logic the critique uses, because both are ordered by what depends on what.',
    },
  ],
  industryExamples: [
    {
      id: 'example-nng-heuristic-evaluation',
      source: 'Nielsen Norman Group',
      title: 'Evaluation against a fixed list',
      observation:
        'Heuristic evaluation assesses an interface against an established set of usability principles rather than against the evaluator’s preferences.',
      takeaway:
        'A fixed list is what makes a critique reproducible. Two people using one find similar problems; two people using taste do not.',
    },
    {
      id: 'example-nng-design-critiques',
      source: 'Nielsen Norman Group',
      title: 'Critique as a structured activity',
      observation:
        'Guidance on design critiques emphasises stating the goal, separating description from judgement, and producing actionable outcomes.',
      takeaway:
        'The structure exists to keep the discussion about the work. Without it, critique drifts toward whoever speaks most confidently.',
    },
  ],
  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Critique one mature workflow — a signup, a checkout, an onboarding — layer by layer.',
    },
    {
      kind: 'code',
      language: 'markdown',
      code: '## Workflow: inviting a teammate\n\n**1 · User goal**\nGet a colleague into the workspace with the right access, and know it worked.\nNote: the product treats this as "send an invitation", which is the system\'s\ngoal, not the user\'s. The user is not finished until the colleague is in.\n\n**2 · Information**\nThe form asks for email, role, and an optional message. Role is five options\nwith no explanation of what each can do — the one piece of information the\ndecision requires is the one piece missing.\n\n**3 · Hierarchy**\nThe optional message is the largest field, and role is a small select. The\nemphasis is inverted relative to consequence.\n\n**4 · Interaction**\nNo way to invite several people at once, which is the common case for a new\nworkspace. No way to see pending invitations from this screen.\n\n**5 · State**\nSuccess says "Invitation sent" and nothing more. No pending state, no record,\nno indication of what happens if it is never accepted. The user\'s actual goal\nhas no state representing it at all.\n\n**6 · Accessibility**\nRole select is keyboard operable. The success toast is not announced — it has\nno live region, so a screen reader user receives no confirmation.\n\n**7 · Performance**\nFine. Submits in ~300ms.\n\n**8 · Maintainability**\nRole descriptions exist in the help documentation but not in the component, so\nthe two will drift. The form is bespoke rather than using the system Field.\n\n**9 · Polish**\nSpacing is consistent, focus states are present, copy is clean.\n\n## Findings, ranked\n1. Role descriptions absent (layer 2) — blocks the only real decision.\n2. No pending-invitation state (layer 5) — the user cannot reach their goal.\n3. Success not announced (layer 6) — accessibility failure.\n4. No bulk invite (layer 4) — the common case is unsupported.\n5. Hierarchy inverted (layer 3) — may resolve itself once 1 is fixed.',
    },
  ],
  commonMistakes: [
    {
      id: 'mistake-14-05-starting-at-polish',
      mistake: 'Critiquing visual details first.',
      why: 'The visual layer is the most visible and the least consequential, so the critique optimises something that may be removed once an earlier layer is fixed.',
      instead: 'Run the layers in order. Polish is layer nine because eight things constrain it.',
    },
    {
      id: 'mistake-14-05-conflating-the-three-parts',
      mistake: 'Delivering judgements without the observations behind them.',
      why: 'There is nothing checkable, so the discussion becomes a contest of confidence rather than of reasoning.',
      instead: 'Observation, judgement, recommendation — separately, so each can be accepted or disputed on its own.',
    },
  ],
  professionalConsideration: [
    {
      kind: 'paragraph',
      text: 'Critique is the most portable skill in this course, and the one that most changes how you are perceived.',
    },
    {
      kind: 'paragraph',
      text: 'Someone who can walk through a product and produce a ranked, evidenced, layered list of what is wrong and why is immediately useful in any team, on any product, in any stack. It is also the skill that most reliably reads as senior — not because it is the hardest, but because it demonstrates that you have a method rather than opinions.',
    },
  ],
  goDeeper: [
    {
      kind: 'paragraph',
      text: 'Everything below was part of the walkthrough above. It is the detail that matters once the core idea has landed, and it is safe to skip on a first pass.',
    },
    {
      kind: 'paragraph',
      text: 'Notice what the ordering did. The hierarchy finding is ranked last and flagged as possibly self-resolving, because adding role descriptions changes the layout anyway. A critique starting at hierarchy would have redesigned the emphasis and left the decision just as impossible to make.',
    },
    {
      kind: 'paragraph',
      text: 'And layer one did the most work: noticing that "send an invitation" is the system’s goal rather than the user’s is what makes finding two visible at all.',
    },
  ],
  practicalExercise: {
    id: 'exercise-systematic-product-critique',
    title: 'Critique a mature workflow professionally',
    prompt:
      'Critique one workflow in a mature product through all nine layers, producing a ranked, evidenced set of findings.',
    steps: [
      'Choose a real workflow in a product with a real team behind it.',
      'State the user goal in one sentence, and say whether the product agrees.',
      'Work through all nine layers in order, writing findings as you go.',
      'For each finding, separate observation, judgement and recommendation.',
      'Verify every observation — measure contrast, test the keyboard, record the timing.',
      'Rank findings by impact on the user goal, not by layer or by ease.',
      'Flag any finding that would resolve itself once an earlier one is fixed.',
      'Write one paragraph on what the team probably got right that is invisible.',
    ],
    successCriteria: [
      'All nine layers covered, in order.',
      'The user goal is stated and interrogated rather than accepted.',
      'Observation, judgement and recommendation separated throughout.',
      'Every observation is verified, not assumed.',
      'Findings ranked by impact on the goal.',
      'Self-resolving findings are identified.',
      'The invisible good work is acknowledged.',
    ],
    estimatedMinutes: 100,
    hint: 'The last step is not politeness. Identifying what a competent team did well — the thing you only notice because you now know it is hard — is the clearest evidence that your critique is informed rather than reflexive.',
  },
  reflectionQuestion:
    'Why does critiquing hierarchy before information often produce wasted work?',
  reflectionHint:
    'Ask what happens to a hierarchy when four of eleven elements are removed.',
  resources: [
    {
      id: 'resource-nng-heuristics-14',
      title: '10 Usability Heuristics for User Interface Design',
      url: 'https://www.nngroup.com/articles/ten-usability-heuristics/',
      type: 'article',
      author: 'Nielsen Norman Group',
      estimatedMinutes: 25,
      note: 'The standard fixed list. Useful as a second pass over layers one to five.',
    },
    {
      id: 'resource-nng-design-critiques-14',
      title: 'Design Critiques',
      url: 'https://www.nngroup.com/articles/design-critiques/',
      type: 'article',
      author: 'Nielsen Norman Group',
      estimatedMinutes: 20,
      note: 'How to run and receive one. The separation of description from judgement is the transferable part.',
    },
  ],
  competencyTags: ['critique', 'product-judgement', 'product-thinking', 'ux-reasoning', 'design-qa', 'architecture'],
  completionCriteria: [
    'Runs all nine layers in order.',
    'Separates observation, judgement and recommendation.',
    'Ranks findings by impact on the user goal.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Project                                                                     */
/* -------------------------------------------------------------------------- */

const PROJECT: ModuleProject = {
  id: 'project-production-saas-workflow',
  slug: 'production-saas-workflow',
  moduleId: MODULE_ID,
  title: 'Production SaaS Workflow',
  brief:
    'Build a multi-step product workflow to production standard: validation, persistence, async behaviour, error recovery, responsive design, tests, accessibility, and a documented architecture.',
  learnerGoal:
    'Build something you would be willing to put in front of real users, and be able to defend every architectural decision in it.',
  problem:
    'A multi-step workflow is where every decision in this course has to coexist. State spans steps, failures can happen at any of them, progress must survive a reload, and the whole thing has to be navigable by keyboard and comprehensible to someone who did not build it.',
  prerequisiteLessonIds: [
    'lesson-local-global-url-and-server-state',
    'lesson-caching-and-synchronisation',
    'lesson-errors-recovery-and-resilience',
    'lesson-thinking-about-product-architecture',
    'lesson-systematic-product-critique',
  ],
  objectives: [
    'Place every piece of state in a defensible home.',
    'Make the workflow survive interruption, failure and a second device.',
    'Document the architecture so somebody else could extend it.',
    'Critique your own result through the nine layers.',
  ],
  requirements: [
    'A workflow of at least four steps with real validation at each.',
    'Progress that survives a reload and a closed tab.',
    'Every piece of state placed in one of the four homes, with justification.',
    'Step position in the URL, so a step is linkable and back works.',
    'Server persistence with a conflict guard and a merge strategy.',
    'All four resilience layers, with degraded states that remain useful.',
    'Scoped error boundaries with resets.',
    'A test suite covering every promised behaviour, each seen to fail.',
    'Full keyboard and screen reader operability, to the Module 9 standard.',
    'Responsive from 320px, verified between breakpoints.',
    'Architecture documentation including at least two ADRs.',
  ],
  constraints: [
    'No state with two homes.',
    'No server state held without a notion of age.',
    'No global state that is global for convenience.',
    'No error message without what happened, whether work is safe, and a next action.',
    'No claim in the documentation that is not demonstrable.',
  ],
  suggestedScope:
    'One workflow, built properly, roughly forty-five to sixty hours. Finished when you can hand someone the documentation and they can extend it without asking you anything.',
  deliverables: [
    'The working workflow.',
    'A state table: every fact, its home, and why.',
    'Architecture documentation: the five boundaries, plus two or more ADRs with honest downsides.',
    'The test suite.',
    'A nine-layer critique of your own result, with findings you did not fix and why.',
  ],
  completionCriteria: [
    'Every piece of state has one home and a stated reason.',
    'Progress survives a reload, a closed tab and a second device.',
    'A stale write is refused and reconciled rather than applied.',
    'Every failure has a degraded state in which the user can still act.',
    'A session expiring mid-workflow loses no input.',
    'Every promised behaviour has a test that has been seen to fail.',
    'Fully operable by keyboard and screen reader.',
    'Two or more ADRs exist, each with downsides and revisit conditions.',
    'A self-critique exists covering all nine layers.',
  ],
  portfolioEvidence: [
    'Architectural judgement — decisions recorded with their trade-offs, not just their outcomes.',
    'Resilience — prevention and degradation, not only error messages.',
    'Synchronisation — a conflict guard and merge strategy that demonstrably lose nothing.',
    'Self-assessment — a critique of your own work that names what you did not fix.',
  ],
  reflectionQuestion:
    'Which architectural decision would you make differently, and what would you need to have known?',
  estimatedHours: 50,
  competencies: [
    'architecture',
    'state-modelling',
    'interface-state-modelling',
    'async-systems',
    'testing',
    'accessibility',
    'responsive-design',
    'critique',
    'product-judgement',
    'product-thinking',
    'react',
    'typescript',
    'design-qa',
  ],
  stretchGoals: [
    'Make the workflow fully usable offline, with writes queued and reconciled on reconnect.',
    'Add a dependency rule in CI so features cannot import each other.',
    'Have someone else extend the workflow using only your documentation, and record every question they had to ask.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Module                                                                      */
/* -------------------------------------------------------------------------- */

export const MODULE_14: CurriculumModule = {
  id: MODULE_ID,
  slug: 'product-architecture-and-systems-thinking',
  moduleNumber: 14,
  phase: 'product-judgement',
  title: 'Product Architecture and Systems Thinking',
  description:
    'The first module about decisions rather than techniques: the four homes of state, caching and conflict resolution worked through on this application’s own sync, resilience in four layers, the five boundaries of an application, and a nine-layer critique method.',
  outcome:
    'Can design, defend and critique the architecture of a product, and record the decisions so they survive the person who made them.',
  prerequisites: [
    'Module 11 — async state and optimistic updates',
    'Module 13 — measurement and design QA',
    'Module 8 — component boundaries, which this scales up',
  ],
  lessons: [LESSON_1, LESSON_2, LESSON_3, LESSON_4, LESSON_5],
  resources: [
    {
      id: 'resource-module-14-react-managing-state',
      title: 'Managing State',
      url: 'https://react.dev/learn/managing-state',
      type: 'documentation',
      author: 'React',
      estimatedMinutes: 90,
      note: 'State placement as a sequence of decisions. The ordering of the pages is itself the argument.',
    },
    {
      id: 'resource-module-14-nng-heuristics',
      title: '10 Usability Heuristics for User Interface Design',
      url: 'https://www.nngroup.com/articles/ten-usability-heuristics/',
      type: 'article',
      author: 'Nielsen Norman Group',
      estimatedMinutes: 25,
      note: 'The fixed list behind reproducible critique. Short, old, and still the most cited thing in the field.',
    },
    {
      id: 'resource-module-14-react-conf',
      title: 'React on YouTube',
      url: 'https://www.youtube.com/@reactjs',
      type: 'video',
      author: 'React',
      estimatedMinutes: 60,
      note: 'Search for talks on application architecture and server state. The trade-offs are argued more honestly in talks than in documentation.',
    },
    {
      id: 'resource-module-14-adr',
      title: 'Architectural Decision Records',
      url: 'https://adr.github.io/',
      type: 'tool',
      author: 'ADR',
      estimatedMinutes: 25,
      note: 'Templates for recording a decision. Pick the shortest; the elaborate ones do not get written.',
    },
  ],
  project: PROJECT,
  competencies: [
    'architecture',
    'state-modelling',
    'interface-state-modelling',
    'async-systems',
    'component-architecture',
    'testing',
    'accessibility',
    'responsive-design',
    'critique',
    'product-judgement',
    'product-thinking',
    'ux-reasoning',
    'react',
    'typescript',
    'design-qa',
  ],
  completionCriteria: [
    'All five lessons completed.',
    'Module project marked completed.',
    'Can design, defend and critique a product architecture.',
  ],
};
