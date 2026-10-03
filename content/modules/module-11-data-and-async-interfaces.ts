/**
 * Module 11 — Data and Async Interfaces.
 *
 * The second pass over async. Module 1 lesson 4 introduced the four states as
 * something to notice, Module 4 lesson 20 made a request, and Module 5 lesson
 * 24 sketched optimistic updates. This module treats all of it at the depth a
 * real product needs: partial data, race conditions, shareable state, and
 * rollback that a user can trust.
 */

import type { CurriculumModule, Lesson, ModuleProject } from '@/types/curriculum';

const MODULE_ID = 'module-11';

/* -------------------------------------------------------------------------- */
/* Lesson 51                                                                   */
/* -------------------------------------------------------------------------- */

const LESSON_1: Lesson = {
  id: 'lesson-loading-empty-success-and-error-states',
  slug: 'loading-empty-success-and-error-states',
  moduleId: MODULE_ID,
  lessonNumber: 1,
  title: 'Loading, Empty, Success and Error States',
  summary:
    'Four states was the beginner’s model. A real data interface has partial data, stale data, retrying, and an error that arrives after something already rendered.',
  estimatedMinutes: 10,
  objectives: [
    'Model async state as a union that admits partial and stale data.',
    'Choose between a skeleton, a spinner and nothing at all, with a reason.',
    'Design retry so the user knows what is being retried.',
    'Handle an error that arrives after content is already on screen.',
  ],
  prerequisiteConcepts: [
    'Getting data and waiting for responses, Module 4 lesson 20',
    'Discriminated unions, Module 6 lesson 27',
    'Rendering by state, Module 7 lesson 33',
  ],
  prerequisiteLessonIds: [
    'lesson-getting-data-and-waiting-for-responses',
    'lesson-rendering-lists-and-conditional-ui',
  ],
  recap: [
    {
      kind: 'paragraph',
      text: 'You can model a request as `idle | loading | success | error` and render a branch for each. That model is correct and it is not sufficient.',
    },
  ],
  priorKnowledge: [
    {
      kind: 'paragraph',
      text: 'Module 1 lesson 4 had you notice that every action has a waiting state. Module 4 lesson 20 had you build one. Module 6 lesson 27 made the impossible combinations unwriteable.',
    },
    {
      kind: 'paragraph',
      text: 'What none of them covered: what the screen shows when you have last week’s data and this week’s request is in flight.',
    },
  ],
  coreConcept: [
    {
      kind: 'paragraph',
      text: 'The four-state model assumes data arrives once. Real interfaces refetch, and the moment they do, **loading and success overlap**.',
    },
    {
      kind: 'code',
      language: 'ts',
      code: 'type AsyncState<T> =\n  | { status: \'idle\' }\n  | { status: \'loading\' }\n  | { status: \'success\'; data: T; isStale: boolean; isRefetching: boolean }\n  | { status: \'error\'; error: AppError; lastKnown: T | null };',
    },
    {
      kind: 'paragraph',
      text: 'Two additions carry the weight. `isRefetching` on success means "you have data and more is coming" — a different screen from an empty loading state.',
    },
    {
      kind: 'paragraph',
      text: '`lastKnown` on error means "the request failed but we still have something to show". Without it, a failed refresh throws away a perfectly readable table and replaces it with an error page, which is a worse outcome than the failure.',
    },
  ],
  whyDesignersCare: [
    {
      kind: 'paragraph',
      text: 'Because the single most common async design failure is destroying content the user was reading.',
    },
    {
      kind: 'paragraph',
      text: 'They change a filter, the list blanks to skeletons, the new data arrives, and the layout jumps. Nothing was broken and the experience was bad. Keeping the old rows visible at reduced emphasis while the new ones load costs one boolean and changes how the product feels.',
    },
    {
      kind: 'paragraph',
      text: 'The same applies to the failure case. A toast saying "Could not refresh" above the data you already had respects the work; a full-page error does not.',
    },
  ],
  howItWorks: [
    {
      kind: 'paragraph',
      text: 'Choosing a loading treatment is a decision with three real options, and the rule is about what you know.',
    },
    {
      kind: 'list',
      items: [
        '**Skeleton** — you know the shape of what is coming. A list of rows, a card grid. It holds the layout, so nothing jumps.',
        '**Spinner** — you do not know the shape, or the region is too small for a skeleton. A button, an inline action.',
        '**Nothing** — the response is expected in under about 200ms. An indicator that flashes for 80ms is noise, and reads as a glitch rather than as progress.',
      ],
    },
    {
      kind: 'paragraph',
      text: 'That third option is the one people skip. A spinner shown for 100ms is worse than no spinner, because the user perceives a flicker rather than a wait.',
    },
    {
      kind: 'code',
      language: 'tsx',
      code: 'function useDelayedFlag(isActive: boolean, delayMs = 200) {\n  const [isVisible, setIsVisible] = useState(false);\n\n  useEffect(() => {\n    if (isActive === false) { setIsVisible(false); return; }\n\n    const timer = setTimeout(() => setIsVisible(true), delayMs);\n    return () => clearTimeout(timer);\n  }, [isActive, delayMs]);\n\n  return isVisible;\n}',
    },
    {
      kind: 'paragraph',
      text: 'The indicator appears only if the wait outlasts the delay. The cleanup from Module 7 lesson 35 is what stops a fast response from showing one at all.',
    },
    {
      kind: 'paragraph',
      text: 'There is a matching trap at the other end: an indicator that appears at 200ms and vanishes at 240ms still flickers. Production implementations usually add a minimum visible duration once shown — roughly 300–500ms — so the indicator is never briefer than the eye can settle on.',
    },
  ],
  firstPrinciples: [
    {
      kind: 'paragraph',
      text: '**Partial data** is the state the four-state model cannot express at all.',
    },
    {
      kind: 'paragraph',
      text: 'A dashboard requests six figures from four endpoints. Two arrive, one is slow, one fails. There is no single status for that screen — each region has its own.',
    },
    {
      kind: 'callout',
      tone: 'insight',
      body: 'Async state belongs to a region, not to a page. A page-level status forces every region to wait for the slowest one, which is why dashboards built that way feel slow even when most of the data was ready immediately.',
    },
    {
      kind: 'paragraph',
      text: 'So the unit of async state is whatever the user can usefully read on its own. Six independent regions mean six states, which sounds like more work and is less: each one is simple, and none of them blocks another.',
    },
  ],
  designPerspective: [
    {
      kind: 'paragraph',
      text: 'The design question is what the user should do about each failure.',
    },
    {
      kind: 'paragraph',
      text: 'A retry button is only honest if retrying might work. A network blip, yes. A 403 because their session expired, no — retrying will fail identically and the user has learned nothing. That needs "Your session expired. Sign in again."',
    },
    {
      kind: 'paragraph',
      text: 'Distinguishing recoverable from terminal failures is a design decision expressed in the error type, and Module 14 lesson 68 takes it further.',
    },
  ],
  engineeringPerspective: [
    {
      kind: 'paragraph',
      text: 'The engineering question is which response is allowed to win.',
    },
    {
      kind: 'code',
      language: 'tsx',
      code: 'useEffect(() => {\n  const controller = new AbortController();\n\n  async function load() {\n    try {\n      const response = await fetch(`/api/projects?q=${query}`, {\n        signal: controller.signal,\n      });\n      if (response.ok === false) throw new Error(String(response.status));\n      setState({ status: \'success\', data: await response.json(), isStale: false, isRefetching: false });\n    } catch (error) {\n      if (error instanceof DOMException && error.name === \'AbortError\') return;\n      setState({ status: \'error\', error: toAppError(error), lastKnown: null });\n    }\n  }\n\n  void load();\n  return () => controller.abort();\n}, [query]);',
    },
    {
      kind: 'paragraph',
      text: '`AbortController` cancels the previous request when `query` changes. Without it, a slow response for "des" can arrive after a fast one for "design" and overwrite it — the user sees results for something they have already finished typing.',
    },
    {
      kind: 'paragraph',
      text: 'The `AbortError` check matters: an aborted request rejects, and treating that rejection as a failure shows an error for a request you cancelled on purpose.',
    },
  ],
  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'This is the Module 5 discipline under pressure.',
    },
    {
      kind: 'paragraph',
      text: 'Every one of these refinements — stale, refetching, last known, per-region — is a fact about what is currently true. None of them is a status being stored. The model grew because the product got harder, not because the principle changed.',
    },
  ],
  industryExamples: [
    {
      id: 'example-nng-response-times',
      source: 'Nielsen Norman Group',
      title: 'Thresholds that decide the treatment',
      observation:
        'Nielsen Norman Group describes response-time limits of roughly 0.1s for feeling instantaneous, 1s for uninterrupted flow, and 10s for keeping attention.',
      takeaway:
        'These numbers are why the delayed indicator exists. Under 0.1s nothing should be shown; past 1s something must be.',
    },
    {
      id: 'example-tanstack-query-stale',
      source: 'TanStack Query',
      title: 'Stale-while-revalidate as a default',
      observation:
        'TanStack Query keeps previously fetched data visible while a refetch runs, exposing both the data and a refetching flag.',
      takeaway:
        'An entire library is built around the state the four-state model omits. That is a reasonable signal it matters.',
    },
  ],
  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Build a list that handles all seven renderings, not four.',
    },
    {
      kind: 'code',
      language: 'tsx',
      code: 'function ProjectList({ state, onRetry }: ProjectListProps) {\n  /* 1. First load, nothing to show yet. */\n  if (state.status === \'loading\') return <ProjectSkeleton rows={6} />;\n\n  /* 2. Failed with nothing to fall back on. */\n  if (state.status === \'error\' && state.lastKnown === null) {\n    return <ErrorState error={state.error} onRetry={onRetry} />;\n  }\n\n  /* 3. Failed but we still have readable data — keep it. */\n  if (state.status === \'error\') {\n    return (\n      <>\n        <InlineWarning message="Could not refresh. Showing the last version." onRetry={onRetry} />\n        <Rows projects={state.lastKnown} isDimmed />\n      </>\n    );\n  }\n\n  if (state.status !== \'success\') return null;\n\n  /* 4 and 5. The two kinds of empty, as in Module 7 lesson 33. */\n  if (state.data.length === 0) {\n    return state.data.isFiltered\n      ? <EmptyState title="No projects match these filters" action="Clear filters" />\n      : <EmptyState title="No projects yet" action="Create your first" />;\n  }\n\n  /* 6 and 7. Content, possibly with a refresh in flight. */\n  return (\n    <>\n      {state.isRefetching && <RefreshBar />}\n      <Rows projects={state.data} isDimmed={state.isStale} />\n    </>\n  );\n}',
    },
    {
      kind: 'paragraph',
      text: 'Read the early returns top to bottom and they are the designed states in order of severity. Nothing is nested, and the narrowing from Module 6 means `state.lastKnown` and `state.data` are each only reachable where they exist.',
    },
  ],
  commonMistakes: [
    {
      id: 'mistake-11-01-discarding-content',
      mistake: 'Replacing visible content with skeletons on every refetch.',
      why: 'The user loses what they were reading, the layout jumps, and the interface feels slower than it is.',
      instead: 'Keep the old data at reduced emphasis and signal that a refresh is in flight.',
    },
    {
      id: 'mistake-11-01-no-cancellation',
      mistake: 'Firing a request per keystroke with no cancellation.',
      why: 'Responses can arrive out of order, so the results shown may belong to a query the user has already changed.',
      instead: 'Abort the previous request, and ignore `AbortError` rather than reporting it.',
    },
  ],
  professionalConsideration: [
    {
      kind: 'paragraph',
      text: 'Everything in this lesson is why teams reach for a data library rather than writing it per screen.',
    },
    {
      kind: 'paragraph',
      text: 'Stale-while-revalidate, deduplication, cancellation, retry with backoff, cache invalidation — each is a few lines and all of them together are a system. Writing it once by hand, as this lesson does, is how you learn what the library is doing; shipping a product on hand-rolled versions at thirty call sites is how you get thirty subtly different behaviours. Module 14 lesson 67 returns to this as a caching question.',
    },
  ],
  goDeeper: [
    {
      kind: 'paragraph',
      text: 'Everything below was part of the walkthrough above. It is the detail that matters once the core idea has landed, and it is safe to skip on a first pass.',
    },
    {
      kind: 'paragraph',
      text: 'Case 3 is the one that distinguishes a professional implementation. Most interfaces throw the table away; this one keeps it and says so.',
    },
    {
      kind: 'paragraph',
      text: 'One correction to the snippet as written: `state.data.isFiltered` is wrong — an array has no such field. Whether the emptiness is filtered is a property of the *query*, not the result, so it has to be passed in alongside. Finding that is a reasonable use of your time before you copy this.',
    },
  ],
  practicalExercise: {
    id: 'exercise-loading-empty-success-and-error-states',
    title: 'Design and implement all states of a data list',
    prompt:
      'Build one data list that correctly renders every async state it can be in, including the ones the four-state model cannot express.',
    steps: [
      'Model the state as a union with stale, refetching and last-known.',
      'Enumerate every rendering the list can produce. Expect seven or more.',
      'Design each one, including which keeps the previous content.',
      'Implement the delayed indicator so fast responses show nothing.',
      'Add a minimum visible duration so the indicator never flickers.',
      'Cancel superseded requests and verify out-of-order responses cannot win.',
      'Make a failed refetch keep the previous data visible.',
      'Distinguish one recoverable failure from one terminal failure, with different wording and actions.',
    ],
    successCriteria: [
      'Seven or more renderings enumerated, designed and implemented.',
      'A fast response produces no loading indicator at all.',
      'An indicator, once shown, is never briefer than its minimum duration.',
      'Out-of-order responses are demonstrably impossible.',
      'A failed refetch preserves the previous data.',
      'Recoverable and terminal failures read differently and offer different actions.',
    ],
    estimatedMinutes: 90,
    hint: 'To test out-of-order responses, add an artificial delay proportional to how short the query is. Typing "design" then fires a slow "d" and a fast "design", which is exactly the race you need to lose before you believe it.',
  },
  reflectionQuestion:
    'Why is a page-level loading status the wrong unit for a dashboard?',
  reflectionHint:
    'Ask what happens to five fast regions when the sixth is slow.',
  resources: [
    {
      id: 'resource-nng-response-times-11',
      title: 'Response Times: The 3 Important Limits',
      url: 'https://www.nngroup.com/articles/response-times-3-important-limits/',
      type: 'article',
      author: 'Nielsen Norman Group',
      estimatedMinutes: 15,
      note: 'The thresholds that decide whether to show an indicator at all. Short and worth knowing by heart.',
    },
    {
      id: 'resource-nng-progress-indicators-11',
      title: 'Progress Indicators Make a Slow System Less Insufferable',
      url: 'https://www.nngroup.com/articles/progress-indicators/',
      type: 'article',
      author: 'Nielsen Norman Group',
      estimatedMinutes: 20,
      note: 'When each kind of indicator helps, and when one makes things worse.',
    },
  ],
  competencyTags: ['async-systems', 'interface-state-modelling', 'ux-reasoning', 'react', 'typescript'],
  completionCriteria: [
    'Models async state with stale, refetching and last-known data.',
    'Chooses a loading treatment from what is known about the response.',
    'Prevents out-of-order responses from winning.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Lesson 52                                                                   */
/* -------------------------------------------------------------------------- */

const LESSON_2: Lesson = {
  id: 'lesson-search-filters-and-sorting',
  slug: 'search-filters-and-sorting',
  moduleId: MODULE_ID,
  lessonNumber: 2,
  title: 'Search, Filters and Sorting',
  summary:
    'Query state is the first genuinely composite state model you will build, and the interaction cost of getting it wrong is paid on every keystroke.',
  estimatedMinutes: 10,
  objectives: [
    'Model query state as one object rather than several independent values.',
    'Choose debouncing, throttling or neither from the cost of the operation.',
    'Report result counts so a filter’s effect is legible.',
    'Design reset so the user can always get back.',
  ],
  prerequisiteConcepts: [
    'Derived state, Module 5 lesson 23',
    'Async states, previous lesson',
    'Controlled inputs, Module 7 lesson 34',
  ],
  prerequisiteLessonIds: ['lesson-loading-empty-success-and-error-states'],
  recap: [
    {
      kind: 'paragraph',
      text: 'You can render every state of one request. This lesson is about the input to that request, which turns out to be where most of the complexity lives.',
    },
  ],
  priorKnowledge: [
    {
      kind: 'paragraph',
      text: 'Module 7 lesson 34 had you build a filter with two pieces of state and everything else derived. That version filtered an array already in memory. This one asks the server, which changes the problem.',
    },
  ],
  coreConcept: [
    {
      kind: 'paragraph',
      text: 'Search, filters, sort and page are not four pieces of state. They are **one query**, and treating them separately is the source of most of the bugs.',
    },
    {
      kind: 'code',
      language: 'ts',
      code: 'type Query = {\n  readonly text: string;\n  readonly status: readonly Status[];\n  readonly owner: string | null;\n  readonly sort: { by: \'name\' | \'updated\' | \'amount\'; direction: \'asc\' | \'desc\' };\n  readonly page: number;\n};',
    },
    {
      kind: 'paragraph',
      text: 'One object. Changing a filter is one update, the request depends on one value, and there is one place to serialise for the URL in lesson 54.',
    },
    {
      kind: 'paragraph',
      text: 'The reason this matters is `page`. Held separately, changing a filter leaves the page where it was — so the user filters to three results while sitting on page four and sees nothing. Held together, resetting the page is part of the same update, and cannot be forgotten.',
    },
    {
      kind: 'code',
      language: 'ts',
      code: 'function setFilter(query: Query, patch: Partial<Query>): Query {\n  /* Any change to what is being matched returns to the first page. */\n  const resetsPage = \'text\' in patch || \'status\' in patch || \'owner\' in patch;\n  return { ...query, ...patch, page: resetsPage ? 1 : (patch.page ?? query.page) };\n}',
    },
    {
      kind: 'paragraph',
      text: 'One function, one rule, enforced everywhere. `Partial<Query>` is the TypeScript utility type for "some fields of" — the Module 6 toolkit doing real work.',
    },
  ],
  whyDesignersCare: [
    {
      kind: 'paragraph',
      text: 'Because a filter the user cannot undo is a trap, and most filter interfaces are traps.',
    },
    {
      kind: 'paragraph',
      text: 'Four filters are applied across three collapsed panels, the list is empty, and there is no indication which filter excluded everything. The user’s only move is to open each panel and guess. A visible count of active filters and a single clear action turn that into one click.',
    },
  ],
  howItWorks: [
    {
      kind: 'paragraph',
      text: '**Interaction cost** is what the user pays per keystroke, and the right technique depends on what the operation costs you.',
    },
    {
      kind: 'list',
      items: [
        '**Nothing** — filtering an in-memory array of a few hundred items. Instant, so delay only makes it feel broken.',
        '**Debounce** — wait until typing pauses, then act once. Right for a network request, because you only want the final query.',
        '**Throttle** — act at most every N milliseconds during a continuous stream. Right for scroll and resize, where you want updates throughout, not just at the end.',
      ],
    },
    {
      kind: 'paragraph',
      text: 'Debouncing a local array filter is a common and avoidable mistake: it adds latency to an operation that had none, and the interface feels worse for no benefit.',
    },
    {
      kind: 'code',
      language: 'tsx',
      code: 'function useDebounced<T>(value: T, delayMs = 300): T {\n  const [settled, setSettled] = useState(value);\n\n  useEffect(() => {\n    const timer = setTimeout(() => setSettled(value), delayMs);\n    return () => clearTimeout(timer);\n  }, [value, delayMs]);\n\n  return settled;\n}',
    },
    {
      kind: 'paragraph',
      text: 'The input stays controlled by the immediate value, so typing never feels laggy. Only the *request* uses the debounced value. Debouncing the input itself is the version that feels broken.',
    },
  ],
  firstPrinciples: [
    {
      kind: 'paragraph',
      text: 'Counts are what make filtering legible, and there are three different ones.',
    },
    {
      kind: 'list',
      items: [
        '**Result count** — "28 projects". What matched.',
        '**Total count** — "28 of 340". What the filter excluded, which is the figure that explains the result.',
        '**Facet counts** — "Active (12)" beside each option. What each choice would do before it is made.',
      ],
    },
    {
      kind: 'paragraph',
      text: 'Facet counts are the expensive one and the most valuable. They prevent the dead end entirely, because an option that would return nothing is visibly zero before the user picks it.',
    },
    {
      kind: 'paragraph',
      text: 'They also cost a second query shape on the server and go stale as other filters change, which is why plenty of good products show the first two and stop. That is a legitimate decision; making it deliberately is the point.',
    },
  ],
  designPerspective: [
    {
      kind: 'paragraph',
      text: 'The design question is whether filters and search do the same job.',
    },
    {
      kind: 'paragraph',
      text: 'Search is for when the user knows roughly what they want. Filters are for narrowing a space they are browsing. A product that offers both without deciding which is primary tends to hide the one people actually use — and which that is depends entirely on the data.',
    },
  ],
  engineeringPerspective: [
    {
      kind: 'paragraph',
      text: 'The engineering question is where sorting happens.',
    },
    {
      kind: 'paragraph',
      text: 'Client-side sorting is instant and only sorts the page you have, so "sort by amount descending" on page one of forty is sorting forty rows out of eight hundred — confidently wrong. Server-side sorting is correct and costs a round trip. Mixing them silently is the failure; choosing one per column, and saying so, is the job.',
    },
  ],
  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'One query object is the Module 5 single-source rule and the Module 8 ownership rule arriving at the same answer.',
    },
    {
      kind: 'paragraph',
      text: 'Everything that reads the query needs the whole query, so the whole query has one owner. Split across four `useState` calls it has four, and the page-reset bug is what four owners produce.',
    },
  ],
  industryExamples: [
    {
      id: 'example-nng-filters-vs-facets',
      source: 'Nielsen Norman Group',
      title: 'Filters and facets distinguished',
      observation:
        'Nielsen Norman Group separates filters from facets, noting that facets describe the data and show how many items each option holds.',
      takeaway:
        'The distinction is practical: facets need counts to be useful, and counts are what prevent the empty-result dead end.',
    },
    {
      id: 'example-removable-filter-chips',
      source: 'Common practice',
      title: 'Active filters shown as removable chips',
      observation:
        'Products with dense filtering commonly surface each active filter as an individually removable chip above the results.',
      takeaway:
        'Every active constraint is visible and separately undoable, which is what makes a four-filter state recoverable.',
    },
  ],
  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Build the query layer, with every derived value derived.',
    },
    {
      kind: 'code',
      language: 'tsx',
      code: 'function useProjectQuery(initial: Query) {\n  const [query, setQuery] = useState(initial);\n  const debouncedText = useDebounced(query.text, 300);\n\n  /* The request depends on the settled text, not on every keystroke. */\n  const effective = useMemo(\n    () => ({ ...query, text: debouncedText }),\n    [query, debouncedText],\n  );\n\n  const state = useProjects(effective);\n\n  /* Derived, never stored — Module 5 lesson 23. */\n  const activeFilters = [\n    query.text !== \'\' && { key: \'text\', label: `"${query.text}"` },\n    ...query.status.map((s) => ({ key: `status:${s}`, label: s })),\n    query.owner !== null && { key: \'owner\', label: query.owner },\n  ].filter((f): f is ActiveFilter => f !== false);\n\n  const isFiltered = activeFilters.length > 0;\n  const isTyping = query.text !== debouncedText;\n\n  return {\n    query,\n    state,\n    activeFilters,\n    isFiltered,\n    isTyping,\n    update: (patch: Partial<Query>) => setQuery((q) => setFilter(q, patch)),\n    clear: () => setQuery({ ...initial, text: \'\', status: [], owner: null, page: 1 }),\n  };\n}',
    },
    {
      kind: 'paragraph',
      text: 'One piece of state. `activeFilters`, `isFiltered` and `isTyping` are all computed, so none of them can disagree with the query.',
    },
  ],
  commonMistakes: [
    {
      id: 'mistake-11-02-split-query-state',
      mistake: 'Holding text, filters, sort and page as separate state.',
      why: 'Nothing enforces their relationships, so changing a filter leaves the user on a page that no longer exists.',
      instead: 'One query object, with one update function that owns the rules between fields.',
    },
    {
      id: 'mistake-11-02-debouncing-the-input',
      mistake: 'Debouncing the input value rather than the request.',
      why: 'Typing lags behind the keyboard, which reads as a broken field rather than as a considered delay.',
      instead: 'Keep the input controlled by the immediate value; debounce only what triggers the request.',
    },
  ],
  professionalConsideration: [
    {
      kind: 'paragraph',
      text: 'The pagination choice is the one with the longest tail.',
    },
    {
      kind: 'paragraph',
      text: 'Offset pagination is trivial and breaks under live data: an item inserted above page two pushes a row from page two to page three, so the user sees it twice while scrolling. Cursor pagination is stable and cannot jump to page seven. Infinite scroll removes the choice and takes the footer with it. None is correct in general, and switching later means changing the API, which is why this decision outlives the interface that prompted it.',
    },
  ],
  goDeeper: [
    {
      kind: 'paragraph',
      text: 'Everything below was part of the walkthrough above. It is the detail that matters once the core idea has landed, and it is safe to skip on a first pass.',
    },
    {
      kind: 'paragraph',
      text: '`isTyping` earns its place: it is how the interface distinguishes "waiting for you to finish" from "waiting for the server", which are different messages. `useMemo` caches the derived object so the request does not re-fire on unrelated renders.',
    },
    {
      kind: 'paragraph',
      text: 'And `clear` resets to the initial query rather than to empty, which preserves anything the initial state legitimately set — a default sort, say.',
    },
  ],
  practicalExercise: {
    id: 'exercise-search-filters-and-sorting',
    title: 'Build searchable, filterable data',
    prompt:
      'Build a list with search, at least three filters, sorting and pagination, all held as one query with everything else derived.',
    steps: [
      'Model the query as one object, with a single update function holding the inter-field rules.',
      'Prove the page resets when a filter changes.',
      'Debounce the request, not the input, and verify typing never lags.',
      'Show result count and total count.',
      'Surface every active filter as individually removable, plus one clear-all.',
      'Make sorting server-side and say in a comment why.',
      'Distinguish "waiting for you to finish typing" from "waiting for the server".',
      'Add facet counts to one filter, then write down what they cost.',
    ],
    successCriteria: [
      'One query object; no separate filter state anywhere.',
      'Changing a filter demonstrably resets the page.',
      'Typing is never delayed; only the request is.',
      'Result and total counts both shown.',
      'Every active filter is individually removable and there is a clear-all.',
      'The two kinds of waiting read differently.',
      'The facet-count cost is documented.',
    ],
    estimatedMinutes: 100,
    hint: 'Build the page-reset test first and watch it fail with separate state. Experiencing the bug is what makes the single-object argument persuasive rather than stylistic.',
  },
  reflectionQuestion:
    'Why does holding `page` separately from the filters produce a bug that holding them together cannot?',
  reflectionHint:
    'Ask what has to be remembered in each case, and by whom.',
  resources: [
    {
      id: 'resource-nng-filters-vs-facets-11',
      title: 'Filters vs. Facets: Definitions',
      url: 'https://www.nngroup.com/articles/filters-vs-facets/',
      type: 'article',
      author: 'Nielsen Norman Group',
      estimatedMinutes: 15,
      note: 'The distinction, and why facet counts change the interaction.',
    },
    {
      id: 'resource-nng-infinite-scrolling-11',
      title: 'Infinite Scrolling Is Not for Every Website',
      url: 'https://www.nngroup.com/articles/infinite-scrolling-tips/',
      type: 'article',
      author: 'Nielsen Norman Group',
      estimatedMinutes: 15,
      note: 'The pagination trade-off, including what infinite scroll costs you.',
    },
  ],
  competencyTags: ['async-systems', 'interface-state-modelling', 'ux-reasoning', 'typescript', 'product-thinking'],
  completionCriteria: [
    'Models query state as one object with its rules in one place.',
    'Chooses debounce, throttle or neither from the operation’s cost.',
    'Makes every active filter visible and individually removable.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Lesson 53                                                                   */
/* -------------------------------------------------------------------------- */

const LESSON_3: Lesson = {
  id: 'lesson-tables-and-dense-information',
  slug: 'tables-and-dense-information',
  moduleId: MODULE_ID,
  lessonNumber: 3,
  title: 'Tables and Dense Information',
  summary:
    'A table is the hardest common interface to get right: scanability, numeric alignment, row actions, and a responsive strategy that is not "hide the columns".',
  estimatedMinutes: 10,
  objectives: [
    'Align and format columns so a table can be scanned rather than read.',
    'Design row actions that work by pointer and keyboard.',
    'Choose a responsive strategy with its trade-off stated.',
    'Set density deliberately rather than by default.',
  ],
  prerequisiteConcepts: [
    'Typography and alignment, Module 2',
    'Semantic tables, Module 9 lesson 41',
    'Query state, previous lesson',
  ],
  prerequisiteLessonIds: ['lesson-search-filters-and-sorting', 'lesson-semantic-interfaces'],
  recap: [
    {
      kind: 'paragraph',
      text: 'You can query data. This lesson is about presenting a lot of it at once, which is where the Module 2 visual work meets its hardest case.',
    },
  ],
  priorKnowledge: [
    {
      kind: 'paragraph',
      text: 'Module 2 lesson 7 established that alignment creates relationships. Module 9 lesson 41 established that a table of data is a `<table>`. Both are about to be load-bearing.',
    },
  ],
  coreConcept: [
    {
      kind: 'paragraph',
      text: 'A table is for **scanning**, not reading. Every decision follows from that.',
    },
    {
      kind: 'paragraph',
      text: 'Scanning means the eye moves down a column comparing values. Anything that breaks the vertical rhythm — a ragged numeric edge, a wrapping cell, an inconsistent format — forces reading instead, and reading a hundred rows is not a thing anyone does.',
    },
    {
      kind: 'list',
      items: [
        'Numbers right-aligned, so digits line up by place value.',
        'Text left-aligned, so the first letter is where the eye expects it.',
        'Dates in one format throughout, and not relative ("2 days ago") in a column being compared.',
        'Tabular figures, so a 1 occupies the same width as an 8.',
      ],
    },
    {
      kind: 'code',
      language: 'css',
      code: '.amount {\n  text-align: right;\n  font-variant-numeric: tabular-nums;\n  font-feature-settings: \'tnum\';\n}',
    },
    {
      kind: 'paragraph',
      text: '`tabular-nums` is the single highest-value line of CSS in this lesson. Proportional figures make a column of numbers visibly ragged even when right-aligned, because the glyph widths differ.',
    },
  ],
  whyDesignersCare: [
    {
      kind: 'paragraph',
      text: 'Because a table is where a product either respects expertise or does not.',
    },
    {
      kind: 'paragraph',
      text: 'Someone reconciling two hundred transactions is doing skilled work at speed. Generous padding, decorative row borders and a relative-time column are each individually pleasant and collectively make that work slower. Density is not visual preference here; it is throughput.',
    },
  ],
  howItWorks: [
    {
      kind: 'paragraph',
      text: '**Row actions** have three common patterns, with a clear order of preference.',
    },
    {
      kind: 'list',
      ordered: true,
      items: [
        '**Always visible** — honest, discoverable, and costs a column of width. Right when there are one or two actions.',
        '**Revealed on hover and focus** — saves space, and must appear on focus too or it is pointer-only, which Module 9 lesson 45 named as a defect.',
        '**A menu per row** — scales to many actions, costs a click, and needs the Module 8 Dropdown with its keyboard behaviour intact.',
      ],
    },
    {
      kind: 'paragraph',
      text: 'The hover pattern has a specific accessibility failure worth naming: actions that appear only on `:hover` are unreachable by keyboard, and a keyboard user tabbing through a hundred rows of hidden actions has a worse time still.',
    },
    {
      kind: 'code',
      language: 'css',
      code: '.row-actions {\n  opacity: 0;\n}\n\n/* Both triggers, and :focus-within so a focused button inside counts. */\n.row:hover .row-actions,\n.row:focus-within .row-actions {\n  opacity: 1;\n}\n\n@media (hover: none) {\n  /* No hover on touch, so never hide them. */\n  .row-actions { opacity: 1; }\n}',
    },
    {
      kind: 'paragraph',
      text: '`:focus-within` matches when any descendant has focus, which is what makes the keyboard path work. The `hover: none` query covers touch, where hiding an action hides it permanently.',
    },
    {
      kind: 'paragraph',
      text: 'Note that `opacity: 0` keeps the actions focusable and announced, which is usually what you want — the control exists, it is just visually quiet. `display: none` would remove them from the tab order entirely, which is a different and sometimes correct decision.',
    },
  ],
  firstPrinciples: [
    {
      kind: 'paragraph',
      text: 'Responsive tables have four real strategies, and "hide columns" is the one people reach for and should not.',
    },
    {
      kind: 'list',
      items: [
        '**Horizontal scroll** — keeps every column, costs discoverability. Needs a visible affordance and a sticky first column to stay usable.',
        '**Priority columns** — show the most important, hide the rest behind a disclosure. Honest if the hidden ones are reachable.',
        '**Cards below a breakpoint** — each row becomes a stacked card. Readable, and abandons comparison entirely.',
        '**Column chooser** — the user decides. Right for a tool used daily; overkill for anything else.',
      ],
    },
    {
      kind: 'callout',
      tone: 'insight',
      body: 'Silently dropping columns is the only wrong answer, because the data is gone with no indication it existed. The user cannot ask for what they cannot see is missing.',
    },
    {
      kind: 'paragraph',
      text: 'Which strategy fits depends on whether the user is comparing rows or inspecting one. Comparison needs the grid, so scroll. Inspection does not, so cards are fine.',
    },
  ],
  designPerspective: [
    {
      kind: 'paragraph',
      text: 'The design question is which columns are actually load-bearing.',
    },
    {
      kind: 'paragraph',
      text: 'Most tables have two or three columns people use and several that are there because the data existed. Working out which is which — by watching someone use it, not by guessing — is what makes every other decision in this lesson easy.',
    },
  ],
  engineeringPerspective: [
    {
      kind: 'paragraph',
      text: 'The engineering question is what to do at a thousand rows.',
    },
    {
      kind: 'paragraph',
      text: 'Rendering ten thousand rows produces tens of thousands of DOM nodes and a page that cannot scroll smoothly. Virtualisation — rendering only the visible window — fixes it and breaks find-in-page, Ctrl+A, and naive screen reader traversal. The right first move is almost always to reduce the rows through better filtering, because a table nobody can read is not improved by rendering it faster. Module 13 covers the measurement that tells you whether you have the problem at all.',
    },
  ],
  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'A table is the clearest case where visual craft and semantics are the same work.',
    },
    {
      kind: 'paragraph',
      text: 'A real `<table>` with `<th scope="col">` gives a screen reader user the column name with every cell — which is exactly what alignment and a header row give a sighted user. Built from divs, the visual version still works and the announced version says nothing but values.',
    },
  ],
  industryExamples: [
    {
      id: 'example-apg-table-pattern',
      source: 'W3C WAI',
      title: 'Table and grid specified separately',
      observation:
        'The ARIA Authoring Practices Guide documents a static Table pattern and an interactive Grid pattern with different keyboard expectations.',
      takeaway:
        'A table you can only read and a table you can navigate cell by cell are different components. Picking the wrong one produces either missing keyboard support or unexpected key capture.',
    },
    {
      id: 'example-dense-financial-tables',
      source: 'Common practice',
      title: 'Density as a product decision',
      observation:
        'Financial dashboards commonly use tight rows, right-aligned tabular figures and a single consistent date format.',
      takeaway:
        'The conventions are not aesthetic. They exist because the work is comparison at speed.',
    },
  ],
  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Build a transaction table, semantics first.',
    },
    {
      kind: 'code',
      language: 'tsx',
      code: 'function TransactionTable({ rows, sort, onSort }: TransactionTableProps) {\n  return (\n    <div className="table-scroll" tabIndex={0} role="region" aria-label="Transactions">\n      <table>\n        <caption className="visually-hidden">\n          Transactions, sorted by {sort.by}, {sort.direction === \'asc\' ? \'ascending\' : \'descending\'}\n        </caption>\n\n        <thead>\n          <tr>\n            <th scope="col">\n              <SortButton column="date" sort={sort} onSort={onSort}>Date</SortButton>\n            </th>\n            <th scope="col">Description</th>\n            <th scope="col" className="numeric">\n              <SortButton column="amount" sort={sort} onSort={onSort}>Amount</SortButton>\n            </th>\n            <th scope="col"><span className="visually-hidden">Actions</span></th>\n          </tr>\n        </thead>\n\n        <tbody>\n          {rows.map((row) => (\n            <tr key={row.id} className="row">\n              <td>{formatDate(row.date)}</td>\n              <th scope="row">{row.description}</th>\n              <td className="numeric">{formatAmount(row.amount, row.currency)}</td>\n              <td className="row-actions">\n                <RowMenu transaction={row} />\n              </td>\n            </tr>\n          ))}\n        </tbody>\n      </table>\n    </div>\n  );\n}',
    },
    {
      kind: 'paragraph',
      text: 'Four details doing real work. The scroll container is a focusable labelled region, so a keyboard user can scroll it — a `div` with `overflow: auto` and no `tabIndex` cannot be scrolled by keyboard at all.',
    },
    {
      kind: 'paragraph',
      text: 'The description is a `<th scope="row">`, which makes it the row’s name: a screen reader then announces "Coffee, Amount, 4.20" rather than "4.20".',
    },
  ],
  commonMistakes: [
    {
      id: 'mistake-11-03-divs-for-tables',
      mistake: 'Building a table from divs for styling control.',
      why: 'Row and column relationships disappear, so every cell is announced as a bare value with no context.',
      instead: 'Use a real table. Modern CSS can style one however you like, including grid layout on the rows.',
    },
    {
      id: 'mistake-11-03-proportional-numbers',
      mistake: 'Right-aligning a numeric column without tabular figures.',
      why: 'Glyph widths differ, so the column still looks ragged and digits do not line up by place value.',
      instead: 'Add `font-variant-numeric: tabular-nums`. One line, and the column becomes scannable.',
    },
  ],
  professionalConsideration: [
    {
      kind: 'paragraph',
      text: 'Tables are where product teams most often conclude they need a library, and most often for the wrong reason.',
    },
    {
      kind: 'paragraph',
      text: 'Sorting, filtering and pagination are not hard; you have now built all three. What is genuinely hard is virtualisation with accessible traversal, column resizing with persistence, and keyboard grid navigation. If you need those, a library is sensible. If you need sortable columns, a library is thirty kilobytes replacing forty lines, and it will fight your design system over markup.',
    },
  ],
  goDeeper: [
    {
      kind: 'paragraph',
      text: 'Everything below was part of the walkthrough above. It is the detail that matters once the core idea has landed, and it is safe to skip on a first pass.',
    },
    {
      kind: 'paragraph',
      text: 'The caption announces the current sort, so the ordering is not visible only as an arrow icon. And the empty header cell has a visually hidden label, because a header with no name is announced as nothing.',
    },
    {
      kind: 'paragraph',
      text: 'The sort buttons need `aria-sort` on their `<th>` to announce state — omitted here for length, and exactly the sort of omission the Module 9 audit is for.',
    },
  ],
  practicalExercise: {
    id: 'exercise-tables-and-dense-information',
    title: 'Build a transaction table',
    prompt:
      'Build a dense, sortable transaction table that is scannable, fully keyboard operable and responsive without losing data.',
    steps: [
      'Use a real `<table>` with `scope` on every header and a row header per row.',
      'Right-align numerics with tabular figures; left-align text.',
      'Use one absolute date format, and justify it against relative time.',
      'Add sortable columns with `aria-sort` reflecting the current state.',
      'Add row actions reachable by hover, focus and touch.',
      'Choose a responsive strategy and write down what it costs.',
      'Offer two densities and state which is the default and why.',
      'Test with the keyboard only, then with a screen reader.',
    ],
    successCriteria: [
      'A real table with correct header scoping.',
      'Numeric columns use tabular figures and right alignment.',
      'Sort state is announced, not only shown.',
      'Row actions work by pointer, keyboard and touch.',
      'The responsive strategy loses no data, and its cost is documented.',
      'The scroll container is keyboard scrollable.',
      'Screen reader announces each cell with its column and row context.',
    ],
    estimatedMinutes: 100,
    hint: 'Do the screen reader pass before the visual polish. Table semantics are hard to retrofit once the CSS depends on the markup structure.',
  },
  reflectionQuestion:
    'Why is silently hiding columns on small screens worse than horizontal scrolling, even though scrolling is less tidy?',
  reflectionHint:
    'Ask what the user can tell is missing in each case.',
  resources: [
    {
      id: 'resource-apg-table-11',
      title: 'Table Pattern — ARIA Authoring Practices',
      url: 'https://www.w3.org/WAI/ARIA/apg/patterns/table/',
      type: 'documentation',
      author: 'W3C WAI',
      estimatedMinutes: 20,
      note: 'The static table pattern. Read the Grid pattern beside it to see where the two diverge.',
    },
    {
      id: 'resource-mdn-font-variant-numeric-11',
      title: 'font-variant-numeric',
      url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/font-variant-numeric',
      type: 'documentation',
      author: 'MDN',
      estimatedMinutes: 10,
      note: 'Tabular figures and the other numeric features. Short, and immediately useful.',
    },
  ],
  competencyTags: ['layout', 'typography', 'accessibility', 'ux-reasoning', 'css', 'design-qa'],
  completionCriteria: [
    'Builds tables with correct semantics and header scoping.',
    'Aligns and formats numerics for scanning.',
    'Chooses a responsive strategy that loses no data.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Lesson 54                                                                   */
/* -------------------------------------------------------------------------- */

const LESSON_4: Lesson = {
  id: 'lesson-url-state-and-persistence',
  slug: 'url-state-and-persistence',
  moduleId: MODULE_ID,
  lessonNumber: 4,
  title: 'URL State and Persistence',
  summary:
    'The URL is a piece of state with a text field attached to it. Putting the right things there makes a view shareable, linkable and survivable.',
  estimatedMinutes: 10,
  objectives: [
    'Decide which state belongs in the URL.',
    'Serialise and parse query state safely, including invalid input.',
    'Make browser back and forward behave as the user expects.',
    'Explain what deep linking commits you to.',
  ],
  prerequisiteConcepts: [
    'Query state, lesson 52',
    'State ownership, Module 8 lesson 40',
    'Types and parsing, Module 6',
  ],
  prerequisiteLessonIds: ['lesson-tables-and-dense-information', 'lesson-where-state-should-live'],
  recap: [
    {
      kind: 'paragraph',
      text: 'Module 8 lesson 40 said the URL is a legitimate owner of state and deferred the details. This lesson is the details.',
    },
  ],
  priorKnowledge: [
    {
      kind: 'paragraph',
      text: 'You decide ownership by finding the closest common owner of everything that reads a piece of state. The URL is what you reach for when that set includes a future visit, another tab, or a colleague you sent a link to.',
    },
  ],
  coreConcept: [
    {
      kind: 'paragraph',
      text: 'State belongs in the URL when it should survive a reload, be shareable, or be navigable with back and forward.',
    },
    {
      kind: 'list',
      items: [
        '**In the URL** — which record is open, active filters, search text, sort order, page, selected tab.',
        '**Not in the URL** — whether a menu is open, a half-typed draft, hover state, scroll position within a list.',
      ],
    },
    {
      kind: 'paragraph',
      text: 'The test is whether sending someone the link should reproduce what you are looking at. "The invoices filtered to overdue, sorted by amount" — yes. "The row menu I happened to have open" — no.',
    },
    {
      kind: 'paragraph',
      text: 'A useful second test: would the user be annoyed if back undid it? Back closing a dropdown is wrong. Back undoing a filter is right.',
    },
  ],
  whyDesignersCare: [
    {
      kind: 'paragraph',
      text: 'Because a URL that does not describe the view breaks the two things every user already knows how to do.',
    },
    {
      kind: 'paragraph',
      text: 'They refresh and lose fifteen minutes of filtering. They paste a link into a message and the recipient sees an unfiltered list, so the conversation becomes a set of instructions. Neither is reported as a bug and both are experienced as the product being flimsy.',
    },
  ],
  howItWorks: [
    {
      kind: 'paragraph',
      text: 'Serialising the query object from lesson 52 is one function, and parsing it back is the one that needs care.',
    },
    {
      kind: 'code',
      language: 'ts',
      code: 'function toSearchParams(query: Query): URLSearchParams {\n  const params = new URLSearchParams();\n\n  /* Only non-default values, so a clean view has a clean URL. */\n  if (query.text !== \'\') params.set(\'q\', query.text);\n  for (const status of query.status) params.append(\'status\', status);\n  if (query.owner !== null) params.set(\'owner\', query.owner);\n  if (query.sort.by !== \'updated\') params.set(\'sort\', query.sort.by);\n  if (query.sort.direction !== \'desc\') params.set(\'dir\', query.sort.direction);\n  if (query.page !== 1) params.set(\'page\', String(query.page));\n\n  return params;\n}',
    },
    {
      kind: 'paragraph',
      text: 'Omitting defaults matters more than it looks. A URL carrying every parameter at its default value is unreadable, un-sharable in a sentence, and changes whenever a default changes.',
    },
    {
      kind: 'code',
      language: 'ts',
      code: 'const STATUSES = [\'active\', \'archived\', \'draft\'] as const;\nconst SORTS = [\'name\', \'updated\', \'amount\'] as const;\n\nfunction fromSearchParams(params: URLSearchParams): Query {\n  const status = params\n    .getAll(\'status\')\n    .filter((value): value is Status => (STATUSES as readonly string[]).includes(value));\n\n  const by = SORTS.find((candidate) => candidate === params.get(\'sort\')) ?? \'updated\';\n  const page = Number.parseInt(params.get(\'page\') ?? \'1\', 10);\n\n  return {\n    text: params.get(\'q\') ?? \'\',\n    status,\n    owner: params.get(\'owner\'),\n    sort: { by, direction: params.get(\'dir\') === \'asc\' ? \'asc\' : \'desc\' },\n    page: Number.isNaN(page) || page < 1 ? 1 : page,\n  };\n}',
    },
    {
      kind: 'paragraph',
      text: 'Every field is validated against what the type allows, and anything unrecognised falls back to a default rather than entering the application. This is the Module 6 argument at the system boundary: a URL is **untrusted input**, and anyone can type anything into it.',
    },
    {
      kind: 'paragraph',
      text: '`?page=-5&sort=; DROP TABLE` has to produce a working page, not a crash and not a query built from it.',
    },
  ],
  firstPrinciples: [
    {
      kind: 'paragraph',
      text: 'The subtlety is **push versus replace**, and it decides whether back works or becomes unusable.',
    },
    {
      kind: 'list',
      items: [
        '**Push** adds a history entry. Back returns to the previous state. Right for a deliberate change: applying a filter, opening a record.',
        '**Replace** rewrites the current entry. Back skips past it. Right for a continuous change: each keystroke in a search field.',
      ],
    },
    {
      kind: 'paragraph',
      text: 'Pushing per keystroke means typing "design" creates six history entries, and the user presses back six times to escape one search. This is the single most common URL state bug, and it is invisible until somebody presses back.',
    },
    {
      kind: 'callout',
      tone: 'pitfall',
      body: 'Debouncing does not fix it. A debounced push still creates an entry per settled query, so typing, pausing and correcting still stacks entries. Search text wants replace, full stop.',
    },
  ],
  designPerspective: [
    {
      kind: 'paragraph',
      text: 'The design question is what a shared link should show.',
    },
    {
      kind: 'paragraph',
      text: 'Not always the same thing as what the sender sees. A link to a filtered list is useful; a link carrying a half-typed search is noise. Deciding what is worth putting in the URL is deciding what one person can usefully hand another, which is a product question before it is a technical one.',
    },
  ],
  engineeringPerspective: [
    {
      kind: 'paragraph',
      text: 'The engineering question is who owns the value once the URL holds it.',
    },
    {
      kind: 'paragraph',
      text: 'The URL does — and keeping a copy in component state reintroduces the two-owners problem from Module 8 lesson 40, with the same symptom: back changes the URL, the copy does not notice, and the screen shows a view the address bar disagrees with. The URL is read as the source and written as the only update.',
    },
  ],
  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'This completes the ownership ladder.',
    },
    {
      kind: 'paragraph',
      text: 'Module 7 put state in a component. Module 8 lifted it to a common owner. This lesson lifts it out of the application entirely, to a place the browser owns and the user can edit. Module 14 lesson 66 adds the last rung — state the server owns — and then the ladder is complete.',
    },
  ],
  industryExamples: [
    {
      id: 'example-mdn-history-api',
      source: 'MDN',
      title: 'Push and replace as distinct operations',
      observation:
        'The History API exposes `pushState` and `replaceState` as separate methods with different effects on the back button.',
      takeaway:
        'The platform makes the distinction explicit because it matters. A framework router wrapping both still asks you to choose.',
    },
    {
      id: 'example-github-url-state',
      source: 'GitHub',
      title: 'Views described entirely by their URL',
      observation:
        'A filtered issue list on GitHub carries its query in the URL, so the view can be bookmarked, shared and reconstructed.',
      takeaway:
        'The URL being a complete description of the view is what makes the search shareable at all. The feature and the implementation are the same decision.',
    },
  ],
  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Wire the lesson 52 query to the URL as its single owner.',
    },
    {
      kind: 'code',
      language: 'tsx',
      code: 'function useUrlQuery() {\n  const searchParams = useSearchParams();\n  const router = useRouter();\n  const pathname = usePathname();\n\n  /* The URL is the source. No copy in state. */\n  const query = useMemo(\n    () => fromSearchParams(new URLSearchParams(searchParams.toString())),\n    [searchParams],\n  );\n\n  const commit = useCallback(\n    (next: Query, mode: \'push\' | \'replace\') => {\n      const params = toSearchParams(next);\n      const url = params.size > 0 ? `${pathname}?${params}` : pathname;\n      if (mode === \'push\') router.push(url);\n      else router.replace(url);\n    },\n    [pathname, router],\n  );\n\n  return {\n    query,\n    /* Deliberate changes are navigations. */\n    setFilters: (patch: Partial<Query>) => commit(setFilter(query, patch), \'push\'),\n    /* Continuous changes are not. */\n    setText: (text: string) => commit(setFilter(query, { text }), \'replace\'),\n  };\n}',
    },
    {
      kind: 'paragraph',
      text: 'One owner, two update modes, and the push-versus-replace decision made once in the hook rather than at each call site.',
    },
    {
      kind: 'paragraph',
      text: 'The empty-params case drops the `?` entirely, so clearing every filter returns to a clean path rather than leaving a bare question mark.',
    },
  ],
  commonMistakes: [
    {
      id: 'mistake-11-04-push-per-keystroke',
      mistake: 'Pushing a history entry for every search keystroke.',
      why: 'One search creates a dozen entries, so the back button becomes unusable for escaping it.',
      instead: 'Replace for continuous changes; push only for deliberate ones.',
    },
    {
      id: 'mistake-11-04-trusting-url-input',
      mistake: 'Parsing URL parameters without validating them.',
      why: 'The URL is user-editable, so an unexpected value reaches the application and the request built from it.',
      instead: 'Validate every parameter against the allowed values and fall back to a default.',
    },
  ],
  professionalConsideration: [
    {
      kind: 'paragraph',
      text: 'URL parameters are a public API the moment anybody bookmarks one.',
    },
    {
      kind: 'paragraph',
      text: 'Renaming `?q=` to `?search=` breaks every saved link and every link already sent. The usual remedy is to keep accepting the old name indefinitely — which is Module 10 lesson 50 deprecation, applied somewhere most teams never think to apply it. It is worth choosing short, durable parameter names on the first day for exactly this reason.',
    },
  ],
  goDeeper: [
    {
      kind: 'paragraph',
      text: 'Everything below was part of the walkthrough above. It is the detail that matters once the core idea has landed, and it is safe to skip on a first pass.',
    },
    {
      kind: 'paragraph',
      text: 'Two caveats worth knowing. A controlled text input reading from the URL will feel laggy if every keystroke round-trips through the router, so in practice the input keeps a local value and the URL is updated on the debounced value — which is the one place a second copy is justified, and it needs resyncing when the URL changes from outside.',
    },
    {
      kind: 'paragraph',
      text: 'And `params.size` is relatively recent; `[...params].length` is the portable equivalent if you need it.',
    },
  ],
  practicalExercise: {
    id: 'exercise-url-state-and-persistence',
    title: 'Persist filters in the URL',
    prompt:
      'Make the URL the single owner of your query state, with correct history behaviour and safe parsing.',
    steps: [
      'Decide which state belongs in the URL and write down the reasoning for each.',
      'Write the serialiser, omitting default values.',
      'Write the parser, validating every parameter against its allowed values.',
      'Make the URL the only owner — no duplicate copy in state.',
      'Use push for deliberate changes and replace for continuous ones.',
      'Verify back and forward both reproduce the right view.',
      'Hand-edit the URL with invalid values and confirm the page still works.',
      'Share a link to another browser and confirm the view is reproduced.',
    ],
    successCriteria: [
      'The in-URL and not-in-URL decisions are documented with reasons.',
      'Default values are absent from the URL.',
      'Invalid parameters fall back to defaults without crashing.',
      'One search produces one history entry, not one per keystroke.',
      'Back and forward both work correctly.',
      'A pasted link reproduces the view in another browser.',
    ],
    estimatedMinutes: 85,
    hint: 'Test the invalid-input case properly: `?page=abc`, `?page=-1`, `?status=nonsense`, `?sort=<script>`. Each should produce a working page, and at least one probably will not on your first attempt.',
  },
  reflectionQuestion:
    'Why must every URL parameter be validated, when your own code is the only thing that writes them?',
  reflectionHint:
    'Your code is not the only thing that writes them. Who else can?',
  resources: [
    {
      id: 'resource-mdn-history-api-11',
      title: 'History API',
      url: 'https://developer.mozilla.org/en-US/docs/Web/API/History_API',
      type: 'documentation',
      author: 'MDN',
      estimatedMinutes: 25,
      note: 'Push versus replace, and what each does to the back button.',
    },
    {
      id: 'resource-mdn-urlsearchparams-11',
      title: 'URLSearchParams',
      url: 'https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams',
      type: 'documentation',
      author: 'MDN',
      estimatedMinutes: 15,
      note: 'The parsing and serialising API, including repeated keys for multi-value filters.',
    },
  ],
  competencyTags: ['browser-apis', 'interface-state-modelling', 'state-modelling', 'architecture', 'typescript'],
  completionCriteria: [
    'Can decide what belongs in the URL and justify it.',
    'Validates URL input rather than trusting it.',
    'Uses push and replace correctly so back behaves.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Lesson 55                                                                   */
/* -------------------------------------------------------------------------- */

const LESSON_5: Lesson = {
  id: 'lesson-optimistic-updates',
  slug: 'optimistic-updates',
  moduleId: MODULE_ID,
  lessonNumber: 5,
  title: 'Optimistic Updates',
  summary:
    'Module 5 introduced the idea. This lesson is the hard part: rollback the user can follow, conflicts you did not cause, and knowing which actions must never be optimistic.',
  estimatedMinutes: 10,
  objectives: [
    'Implement an optimistic update with a correct rollback.',
    'Decide which actions may be optimistic and which may not.',
    'Handle a conflict where the server disagrees for a legitimate reason.',
    'Design the correction so the user is not misled.',
  ],
  prerequisiteConcepts: [
    'Optimistic vs confirmed actions, Module 5 lesson 24',
    'Async state, lesson 51',
    'State ownership, Module 8 lesson 40',
  ],
  prerequisiteLessonIds: ['lesson-url-state-and-persistence', 'lesson-optimistic-vs-confirmed-actions'],
  recap: [
    {
      kind: 'paragraph',
      text: 'Module 5 lesson 24 established the shape: show the result immediately, correct it if the server disagrees. It also said the correction is the hard part and deferred it. This is that lesson.',
    },
  ],
  priorKnowledge: [
    {
      kind: 'paragraph',
      text: 'You know an optimistic update is a lie told in good faith, and that the design work is in how the lie is retracted. You have also now built per-region async state, which is what makes a targeted rollback possible at all.',
    },
  ],
  coreConcept: [
    {
      kind: 'paragraph',
      text: 'An optimistic update needs three things, and the third is the one usually missing: the **previous value**, kept until the server confirms.',
    },
    {
      kind: 'code',
      language: 'tsx',
      code: 'async function toggleFavourite(project: Project) {\n  const previous = project.isFavourite;        // 1. remember\n  setFavourite(project.id, previous === false); // 2. assume\n\n  try {\n    const confirmed = await api.setFavourite(project.id, previous === false);\n    /* 3a. Server is authoritative — adopt its answer, not ours. */\n    setFavourite(project.id, confirmed.isFavourite);\n  } catch (error) {\n    /* 3b. Put it back exactly as it was. */\n    setFavourite(project.id, previous);\n    showError(\'Could not update favourite\', { retry: () => toggleFavourite(project) });\n  }\n}',
    },
    {
      kind: 'paragraph',
      text: 'Note step 3a. Even on success the server’s value is adopted rather than the assumed one. If another device already favourited it, the server’s answer differs from the guess, and trusting the guess leaves two devices disagreeing.',
    },
    {
      kind: 'paragraph',
      text: 'This is **server authority**: the client’s optimistic value is a prediction, and a prediction is replaced by the real answer whether or not it was right.',
    },
  ],
  whyDesignersCare: [
    {
      kind: 'paragraph',
      text: 'Because a silent rollback is worse than a slow interface.',
    },
    {
      kind: 'paragraph',
      text: 'The user clicks a star, it fills, they move on. Two seconds later it empties with no explanation. They did not see it happen, so as far as they know they favourited it. Later the item is missing from their favourites and the product simply loses things.',
    },
    {
      kind: 'paragraph',
      text: 'The rollback has to be as visible as the original change, which usually means an explicit message and a retry. That is the cost of optimism, and it is the reason not to be optimistic about everything.',
    },
  ],
  howItWorks: [
    {
      kind: 'paragraph',
      text: 'Whether an action may be optimistic depends on **what it costs to be wrong**.',
    },
    {
      kind: 'list',
      items: [
        '**Optimistic** — toggling a favourite, marking read, reordering a list, renaming. Cheap, reversible, low-stakes if wrong.',
        '**Never optimistic** — payments, deletions, sending a message, publishing, anything with a legal or financial effect.',
        '**Depends** — status changes in a shared workflow. Optimistic for one person’s private board; confirmed where a colleague acts on it.',
      ],
    },
    {
      kind: 'paragraph',
      text: 'The test: if the server rejects this, can the user comfortably be told "that did not happen"? "Your favourite did not save" is fine. "Your payment did not go through, though we showed you a receipt" is not.',
    },
    {
      kind: 'callout',
      tone: 'pitfall',
      body: 'Sending a message is the one people get wrong. An optimistically rendered message that failed to send looks sent, and the user acts as though it was. Pending states exist precisely for this case.',
    },
    {
      kind: 'paragraph',
      text: 'React 19 offers `useOptimistic`, which holds the optimistic value for the duration of a transition and discards it automatically when the real value arrives.',
    },
    {
      kind: 'code',
      language: 'tsx',
      code: 'const [optimisticItems, addOptimistic] = useOptimistic(\n  items,\n  (current: Item[], newItem: Item) => [...current, { ...newItem, isPending: true }],\n);',
    },
    {
      kind: 'paragraph',
      text: 'The hook removes the bookkeeping, not the design problem. You still decide what happens when the server disagrees, and you still have to tell the user.',
    },
  ],
  firstPrinciples: [
    {
      kind: 'paragraph',
      text: 'A **conflict** is different from a failure, and the difference is who is right.',
    },
    {
      kind: 'paragraph',
      text: 'A failure means the request did not land — network, timeout, server error. Retrying is reasonable, and rolling back is correct.',
    },
    {
      kind: 'paragraph',
      text: 'A conflict means the request landed and was refused because the world changed: the record was edited by someone else, the status moved on, the item was deleted. Retrying identically will be refused identically.',
    },
    {
      kind: 'code',
      language: 'ts',
      code: 'type MutationOutcome<T> =\n  | { kind: \'confirmed\'; value: T }\n  | { kind: \'failed\'; error: AppError; isRetryable: boolean }\n  | { kind: \'conflict\'; current: T; attempted: T };',
    },
    {
      kind: 'paragraph',
      text: 'A conflict carries the server’s current value, which is what lets the interface say something useful: "Ada changed this to Archived while you were editing. Keep yours, or take theirs?"',
    },
    {
      kind: 'paragraph',
      text: 'You have already met this mechanism. The Academy’s own progress sync guards writes with the last known timestamp, so a client working from stale data matches no rows and is told to reconcile rather than silently overwriting. Module 14 lesson 67 examines that design directly.',
    },
  ],
  designPerspective: [
    {
      kind: 'paragraph',
      text: 'The design question is what the correction looks like.',
    },
    {
      kind: 'paragraph',
      text: 'Three options, in increasing cost. A toast with a retry, for low-stakes rollbacks. An inline marker on the affected row, for when the user needs to see which item failed. A blocking dialog, for a conflict needing a decision.',
    },
    {
      kind: 'paragraph',
      text: 'Choosing by stakes rather than by convenience is the whole discipline. Everything-as-a-toast means conflicts get dismissed unread.',
    },
  ],
  engineeringPerspective: [
    {
      kind: 'paragraph',
      text: 'The engineering question is what happens when optimistic updates overlap.',
    },
    {
      kind: 'paragraph',
      text: 'A user toggles the same star three times quickly. Three requests are in flight, they can complete out of order, and the last response wins — which may be the first request. Remembering "the previous value" is ambiguous when there are three previous values.',
    },
    {
      kind: 'paragraph',
      text: 'The usual remedies are to serialise mutations per entity, or to cancel the in-flight one when a new one supersedes it. Both are more work than the single-mutation case suggests, and neither is optional in a product people use quickly.',
    },
  ],
  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'Optimistic updates are where the Module 5 state model has to be exactly right.',
    },
    {
      kind: 'paragraph',
      text: 'You need the current value, the assumed value, the previous value and the server’s value, and you need to know which is which at every moment. A model holding statuses rather than facts cannot express that, which is why this lesson comes fifty lessons after the principle rather than beside it.',
    },
  ],
  industryExamples: [
    {
      id: 'example-react-use-optimistic',
      source: 'React',
      title: 'Optimistic state as a primitive',
      observation:
        'React provides `useOptimistic`, which shows an optimistic value during a transition and reverts to the real value when it settles.',
      takeaway:
        'The bookkeeping is now a framework concern. The decision about which actions deserve it is not.',
    },
    {
      id: 'example-messaging-pending-states',
      source: 'Platform convention',
      title: 'Pending rather than optimistic',
      observation:
        'Messaging interfaces conventionally show a sent message in a pending state until delivery is confirmed, and mark it failed if it is not.',
      takeaway:
        'The message appears immediately, but never claims to have been sent. That is the honest middle between optimistic and confirmed.',
    },
  ],
  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Implement an optimistic status change that handles all three outcomes.',
    },
    {
      kind: 'code',
      language: 'tsx',
      code: 'async function changeStatus(project: Project, next: Status) {\n  const previous = project.status;\n\n  setStatus(project.id, next, { isPending: true });\n\n  const outcome = await api.changeStatus(project.id, next, {\n    /* Sent so the server can detect a conflict rather than overwrite. */\n    expectedUpdatedAt: project.updatedAt,\n  });\n\n  switch (outcome.kind) {\n    case \'confirmed\':\n      setStatus(project.id, outcome.value.status, { isPending: false });\n      return;\n\n    case \'failed\':\n      setStatus(project.id, previous, { isPending: false });\n      showToast({\n        message: `Could not set ${project.name} to ${next}.`,\n        action: outcome.isRetryable\n          ? { label: \'Try again\', onAction: () => changeStatus(project, next) }\n          : undefined,\n      });\n      return;\n\n    case \'conflict\':\n      /* Adopt the server’s value — the screen must not show a stale one. */\n      setStatus(project.id, outcome.current.status, { isPending: false });\n      openConflictDialog({\n        theirs: outcome.current,\n        yours: outcome.attempted,\n        onKeepMine: () => changeStatus(outcome.current, next),\n      });\n      return;\n  }\n}',
    },
    {
      kind: 'paragraph',
      text: 'Three outcomes, three different treatments, and the switch is exhaustive — the Module 6 union means a fourth outcome added later is a compile error here rather than a silently unhandled case.',
    },
    {
      kind: 'paragraph',
      text: '`expectedUpdatedAt` is the conflict guard. Without it the server cannot tell a deliberate change from one made against stale data, so the last write always wins and somebody’s edit disappears.',
    },
  ],
  commonMistakes: [
    {
      id: 'mistake-11-05-silent-rollback',
      mistake: 'Reverting an optimistic change without telling the user.',
      why: 'They saw it succeed and did not see it undone, so they believe something happened that did not.',
      instead: 'Make the rollback at least as visible as the change, with a retry where retrying could work.',
    },
    {
      id: 'mistake-11-05-optimistic-destructive',
      mistake: 'Optimistically rendering a payment, a send or a delete as complete.',
      why: 'The user acts on a result that may not exist, and the consequences are not recoverable by a toast.',
      instead: 'Use a pending state that never claims completion, and confirm before showing success.',
    },
  ],
  professionalConsideration: [
    {
      kind: 'paragraph',
      text: 'Optimistic updates are a latency treatment, not a performance fix, and that distinction gets lost.',
    },
    {
      kind: 'paragraph',
      text: 'They make a 300ms round trip feel instant, which is a real improvement. They do nothing for a 3-second one — the user has moved on and the rollback arrives as a surprise. If the server is slow, make the server faster; optimism applied to genuine slowness produces an interface that regularly lies and then corrects itself, which erodes trust faster than waiting ever did.',
    },
  ],
  goDeeper: [
    {
      kind: 'paragraph',
      text: 'Everything below was part of the walkthrough above. It is the detail that matters once the core idea has landed, and it is safe to skip on a first pass.',
    },
    {
      kind: 'paragraph',
      text: 'And `onKeepMine` retries against the server’s current record rather than the stale one, so the retry carries a fresh `expectedUpdatedAt` and will not conflict for the same reason twice.',
    },
    {
      kind: 'paragraph',
      text: 'The `isPending` flag is what distinguishes this from a bare optimistic update: the row shows the new value *and* that it is not yet confirmed, so a rollback contradicts nothing the interface promised.',
    },
  ],
  practicalExercise: {
    id: 'exercise-optimistic-updates',
    title: 'Implement an optimistic status update',
    prompt:
      'Implement one optimistic mutation handling confirmation, failure and conflict, with a correction the user can follow.',
    steps: [
      'Pick an action and justify why it may be optimistic.',
      'Implement it, keeping the previous value until the server answers.',
      'Adopt the server’s value on success rather than your assumed one.',
      'Add a pending indicator so the change never claims to be confirmed.',
      'Simulate a failure and make the rollback visible, with a retry.',
      'Send a conflict guard and simulate a conflict; offer theirs or yours.',
      'Fire the same mutation three times quickly and make the final state correct.',
      'Name one action in the same product that must not be optimistic, and say why.',
    ],
    successCriteria: [
      'The previous value is preserved and restored exactly on failure.',
      'The server’s value is adopted on success.',
      'Pending state is visible until confirmation.',
      'Rollback is visible and offers a retry where retrying could work.',
      'Conflicts are distinguished from failures and resolved by a user decision.',
      'Rapid repeated mutations settle on the correct final state.',
      'One non-optimistic action is identified with reasoning.',
    ],
    estimatedMinutes: 100,
    hint: 'The triple-click test is the one that finds the real bugs. Add a random delay to each request so they genuinely complete out of order, then watch the final state disagree with the last click.',
  },
  reflectionQuestion:
    'Why adopt the server’s value even when the optimistic guess turns out to be correct?',
  reflectionHint:
    'Ask what else might have changed the record between your guess and the server’s answer.',
  resources: [
    {
      id: 'resource-react-use-optimistic-11',
      title: 'useOptimistic',
      url: 'https://react.dev/reference/react/useOptimistic',
      type: 'documentation',
      author: 'React',
      estimatedMinutes: 25,
      note: 'The primitive, with examples. Read it after writing one by hand, not before.',
    },
    {
      id: 'resource-nng-empty-state-11',
      title: 'Empty State Interface Design',
      url: 'https://www.nngroup.com/articles/empty-state-interface-design/',
      type: 'article',
      author: 'Nielsen Norman Group',
      estimatedMinutes: 15,
      note: 'Useful here because an optimistic create is what turns an empty state into a populated one.',
    },
  ],
  competencyTags: ['async-systems', 'interface-state-modelling', 'state-modelling', 'ux-reasoning', 'react', 'product-judgement'],
  completionCriteria: [
    'Implements an optimistic update with a correct, visible rollback.',
    'Can decide which actions may be optimistic and defend it.',
    'Distinguishes a conflict from a failure and resolves each differently.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Project                                                                     */
/* -------------------------------------------------------------------------- */

const PROJECT: ModuleProject = {
  id: 'project-analytics-dashboard',
  slug: 'analytics-dashboard',
  moduleId: MODULE_ID,
  title: 'Analytics Dashboard',
  brief:
    'Build a dashboard over real or simulated data: independent async regions, search, filters, sorting, a responsive table, URL-owned query state, and one optimistic interaction.',
  learnerGoal:
    'Build the kind of data interface most product work actually consists of, and have the async behaviour stand up to being used quickly.',
  problem:
    'A dashboard is where every lesson in this module collides. Several regions load independently, the query belongs in the URL, the table has to stay scannable, and the whole thing has to behave when somebody filters while a request is in flight.',
  prerequisiteLessonIds: [
    'lesson-loading-empty-success-and-error-states',
    'lesson-search-filters-and-sorting',
    'lesson-tables-and-dense-information',
    'lesson-url-state-and-persistence',
    'lesson-optimistic-updates',
  ],
  objectives: [
    'Model async state per region rather than per page.',
    'Own query state in the URL and validate it on the way in.',
    'Build a dense table that is scannable and fully keyboard operable.',
    'Implement one optimistic interaction with a visible correction.',
  ],
  requirements: [
    'Real or simulated data with deliberately variable latency.',
    'At least three regions that load independently.',
    'Every async state per region: loading, refetching, stale, both empties, recoverable error, terminal error.',
    'Search, at least three filters and sorting, held as one query.',
    'Query state owned by the URL, validated on parse.',
    'A responsive table that loses no data, with tabular figures and announced sort.',
    'One optimistic mutation handling confirmation, failure and conflict.',
    'Keyboard operable throughout, with the Module 9 standard maintained.',
  ],
  constraints: [
    'No data-fetching library. Write the cancellation, staleness and rollback yourself.',
    'No table library.',
    'No state duplicated between the URL and a component.',
    'No loading indicator for a response under 200ms.',
  ],
  suggestedScope:
    'One dashboard with three or four regions and one table, roughly thirty to forty hours. Finished when it behaves correctly under fast, repeated interaction, not just under careful use.',
  deliverables: [
    'The working dashboard.',
    'A written state model: what is a fact, what is derived, what the URL owns.',
    'A list of every async rendering, with the design decision for each.',
    'A record of the out-of-order, rapid-mutation and invalid-URL tests, and what each found.',
  ],
  completionCriteria: [
    'Regions load and fail independently; one slow region blocks nothing.',
    'A failed refetch preserves the previous data.',
    'Out-of-order responses cannot win.',
    'The URL reproduces the view in another browser, and invalid parameters degrade safely.',
    'One search produces one history entry.',
    'The table is scannable, keyboard operable and loses no data when narrow.',
    'The optimistic mutation rolls back visibly and distinguishes conflicts from failures.',
    'Rapid repeated mutations settle on the correct final state.',
  ],
  portfolioEvidence: [
    'Async competence — states a four-state model cannot express, handled correctly.',
    'State architecture — one query, one owner, everything else derived.',
    'Information design — density that serves the work rather than decorating it.',
    'Rigour — race conditions found by testing for them rather than by a user reporting them.',
  ],
  reflectionQuestion:
    'Which race condition did you only find because you deliberately went looking for it?',
  estimatedHours: 35,
  competencies: [
    'async-systems',
    'interface-state-modelling',
    'state-modelling',
    'architecture',
    'browser-apis',
    'react',
    'typescript',
    'layout',
    'typography',
    'accessibility',
    'responsive-design',
    'ux-reasoning',
    'product-judgement',
  ],
  stretchGoals: [
    'Add facet counts to one filter and measure what the extra query costs.',
    'Add cursor pagination and demonstrate the duplicate-row problem offset pagination has under live data.',
    'Replace your hand-written fetching with a data library and write down what it did better and what it took away.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Module                                                                      */
/* -------------------------------------------------------------------------- */

export const MODULE_11: CurriculumModule = {
  id: MODULE_ID,
  slug: 'data-and-async-interfaces',
  moduleNumber: 11,
  phase: 'interaction-and-motion',
  title: 'Data and Async Interfaces',
  description:
    'The second pass over async, at the depth a real product needs: partial and stale data, query state as one object, dense tables, the URL as an owner of state, and optimistic updates with rollback a user can follow.',
  outcome:
    'Can build a data interface that stays correct under fast, repeated, out-of-order interaction — and can prove it does.',
  prerequisites: [
    'Module 4 — requests and waiting',
    'Module 5 — state as facts, and the first look at optimism',
    'Module 9 — accessibility, which dense data makes harder',
  ],
  lessons: [LESSON_1, LESSON_2, LESSON_3, LESSON_4, LESSON_5],
  resources: [
    {
      id: 'resource-module-11-tanstack-query',
      title: 'TanStack Query',
      url: 'https://tanstack.com/query/latest/docs/framework/react/overview',
      type: 'documentation',
      author: 'TanStack',
      estimatedMinutes: 90,
      note: 'Read it as a specification for the problems in this module — staleness, deduplication, cancellation, invalidation — rather than as something to adopt immediately.',
    },
    {
      id: 'resource-module-11-nng-response-times',
      title: 'Response Times: The 3 Important Limits',
      url: 'https://www.nngroup.com/articles/response-times-3-important-limits/',
      type: 'article',
      author: 'Nielsen Norman Group',
      estimatedMinutes: 15,
      note: 'The thresholds behind every loading decision in this module.',
    },
    {
      id: 'resource-module-11-react-conf',
      title: 'React on YouTube',
      url: 'https://www.youtube.com/@reactjs',
      type: 'video',
      author: 'React',
      estimatedMinutes: 60,
      note: 'Search for talks on transitions, Suspense and optimistic state. The async primitives are better explained in talks than in reference pages.',
    },
    {
      id: 'resource-module-11-apg-grid',
      title: 'Grid Pattern — ARIA Authoring Practices',
      url: 'https://www.w3.org/WAI/ARIA/apg/patterns/grid/',
      type: 'tool',
      author: 'W3C WAI',
      estimatedMinutes: 30,
      note: 'The reference to build against if your table becomes navigable cell by cell. Check it before inventing key handling.',
    },
  ],
  project: PROJECT,
  competencies: [
    'async-systems',
    'interface-state-modelling',
    'state-modelling',
    'architecture',
    'browser-apis',
    'react',
    'typescript',
    'layout',
    'typography',
    'css',
    'accessibility',
    'responsive-design',
    'ux-reasoning',
    'product-thinking',
    'product-judgement',
    'design-qa',
  ],
  completionCriteria: [
    'All five lessons completed.',
    'Module project marked completed.',
    'Can build an async data interface that survives fast, repeated use.',
  ],
};
