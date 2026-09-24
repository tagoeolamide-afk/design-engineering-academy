/**
 * Module 13 — Product Architecture and Quality.
 *
 * Where state lives across a whole application, who owns remote data, what
 * happens when things fail, and the two forms of verification — automated
 * tests and design QA — that catch different classes of defect.
 */

import type { CurriculumModule, Lesson, ModuleProject } from '@/types/curriculum';

const MODULE_ID = 'module-13';

/* -------------------------------------------------------------------------- */
/* Lesson 61                                                                   */
/* -------------------------------------------------------------------------- */

const LESSON_61: Lesson = {
  id: 'lesson-13-01',
  slug: 'application-state-boundaries',
  moduleId: MODULE_ID,
  lessonNumber: 1,
  title: 'Application State Boundaries',
  summary:
    'Four kinds of state with four different lifetimes. Treating them as one thing is what makes a global store unmanageable.',
  estimatedMinutes: 9,

  objectives: [
    'Classify every piece of state as local, global, URL, or server.',
    'Match each kind to its correct lifetime and storage.',
    'Explain the specific costs of a single global store.',
    'Audit an existing application and correct misplacements.',
  ],

  prerequisiteConcepts: ['State ownership', 'URL state'],
  prerequisiteLessonIds: ['lesson-08-05', 'lesson-11-05'],

  recap: [
    {
      kind: 'paragraph',
      text: 'Module 8 asked who owns a fact within a component tree. This lesson asks the same question across an entire application, where the answers are more varied.',
    },
  ],

  coreConcept: [
    {
      kind: 'paragraph',
      text: 'Application state divides into four kinds, distinguished by who is authoritative and how long the value should live.',
    },
    {
      kind: 'list',
      items: [
        'Local — owned by one component, dies with it. Draft text, hover, whether a disclosure is open.',
        'Global — genuinely cross-cutting, lives for the session. Theme, current user, feature flags.',
        'URL — navigational and shareable, survives refresh. Selection, filters, search, page, tab.',
        'Server — owned elsewhere; the client holds a cache with a staleness problem.',
      ],
    },
    {
      kind: 'paragraph',
      text: 'Most confusion comes from treating server state as global state. It is not: a global value is authoritative in the browser, while server state is a copy of something that can change without the browser knowing.',
    },
    {
      kind: 'callout',
      tone: 'insight',
      body: 'Different truths have different lifetimes. A single store forces one lifetime on all of them, which is why it cannot work.',
    },
  ],

  firstPrinciples: [
    {
      kind: 'paragraph',
      text: 'The cost of global state is the size of the set of possible causes. A local value has one suspect when it is wrong. A global value has as many suspects as there are places that can write it, and debugging time scales with that number.',
    },
    {
      kind: 'paragraph',
      text: 'It also destroys portability. A component reading a global store cannot be rendered where the store does not exist, so it cannot be tested, reviewed, or reused in isolation — three capabilities lost for one convenience gained.',
    },
  ],

  designPerspective: [
    {
      kind: 'paragraph',
      text: 'State classification is felt directly as product behaviour. Whether a filter survives a refresh, whether a draft survives navigation, whether a view can be sent to a colleague — each is a classification decision experienced as quality.',
    },
    {
      kind: 'paragraph',
      text: 'Inconsistency is what users notice most. If one panel remembers its filters and another does not, the product feels arbitrary even though each individual behaviour is defensible.',
    },
  ],

  engineeringPerspective: [
    {
      kind: 'code',
      language: 'ts',
      caption: 'An inventory: kind, owner, and lifetime for each fact.',
      code: `// LOCAL — dies with the component. No one else can observe it.
const [draft, setDraft] = useState(project.description);

// URL — shareable, survives refresh, participates in history.
const [filters, setFilters] = useQueryState(FILTER_SCHEMA);

// GLOBAL — cross-cutting, session-lived, authoritative in the browser.
const theme = useTheme();

// SERVER — a cache of something owned elsewhere. Note the staleness fields.
const { data, isStale, refetch } = useQuery({
  queryKey: ['project', id],
  queryFn: () => api.getProject(id),
  staleTime: 30_000,
});`,
    },
    {
      kind: 'paragraph',
      text: 'The comments are the deliverable. An inventory naming the kind, owner, and lifetime of every fact makes misplacement visible before it is built, and gives a reviewer something concrete to check.',
    },
  ],

  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'The classification is a product specification: what persists, what resets, what is shareable, what refreshes. Those are all questions a designer should answer and an engineer should implement, in that order.',
    },
    {
      kind: 'paragraph',
      text: 'Done in the other order, the answers are determined by whichever hook was reached for first.',
    },
  ],

  industryExamples: [
    {
      id: 'example-server-state-libraries',
      source: 'Data-fetching libraries',
      title: 'Server state treated as its own category',
      observation:
        'Libraries built for remote data expose staleness, background refetching, and cache invalidation — concepts that do not apply to client state at all.',
      takeaway:
        'The separate tooling exists because the two genuinely are different problems.',
    },
    {
      id: 'example-global-store-shrink',
      source: 'Teams migrating away from monolithic stores',
      title: 'Stores shrinking as classification improves',
      observation:
        'Applications that adopt URL state and server-state caching typically reduce their global store to a handful of genuinely cross-cutting values.',
      takeaway:
        'Most of what was in the store was misclassified rather than genuinely global.',
    },
  ],

  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Classifying all state in an existing application.',
    },
    { kind: 'heading', text: '1. List every fact' },
    {
      kind: 'paragraph',
      text: 'Everything the application remembers, across every screen. The list is always longer than expected.',
    },
    { kind: 'heading', text: '2. Ask who is authoritative' },
    {
      kind: 'paragraph',
      text: 'If a server can change it without the browser acting, it is server state regardless of where it currently lives.',
    },
    { kind: 'heading', text: '3. Ask what should survive' },
    {
      kind: 'paragraph',
      text: 'A re-render, a navigation, a refresh, a new session. Four answers, four homes.',
    },
    { kind: 'heading', text: '4. Ask whether it should be shareable' },
    {
      kind: 'paragraph',
      text: 'If another person opening the same thing would benefit, it belongs in the URL.',
    },
    { kind: 'heading', text: '5. Justify every global entry' },
    {
      kind: 'paragraph',
      text: 'In writing. Most candidates fail, and the ones that fail are usually server state or URL state in disguise.',
    },
    { kind: 'heading', text: '6. Move the misplaced ones' },
    {
      kind: 'paragraph',
      text: 'And verify the lifetimes behave as the inventory says they should.',
    },
  ],

  commonMistakes: [
    {
      id: 'mistake-server-in-global',
      mistake: 'Storing fetched data in a global client store.',
      why: 'There is no staleness model, so the copy silently diverges from the source with nothing to detect it.',
      instead: 'Treat server data as a cache with explicit staleness.',
    },
    {
      id: 'mistake-global-convenience',
      mistake: 'Adding to the global store because it is convenient.',
      why: 'The set of possible writers grows, and debugging cost grows with it.',
      instead: 'Require a written justification for every global entry.',
    },
    {
      id: 'mistake-inconsistent-lifetimes',
      mistake: 'Different lifetimes for equivalent state in different screens.',
      why: 'The product feels arbitrary, because similar things behave differently for no visible reason.',
      instead: 'Classify by kind and apply the same rule everywhere.',
    },
    {
      id: 'mistake-no-inventory',
      mistake: 'Never writing the classification down.',
      why: 'Nobody can review a decision that exists only as a pattern of hook calls.',
      instead: 'Keep an inventory of kind, owner, and lifetime.',
    },
  ],

  eliteConsiderations: [
    {
      kind: 'list',
      items: [
        'Keep the global store small enough to list from memory; if you cannot, it holds something misclassified.',
        'Prefer the URL over a store for anything a user might want to send someone.',
        'Review the inventory when adding a feature, not after the bug report.',
        'Name state by the fact it holds, not by the component or modal it controls.',
      ],
    },
  ],

  practicalExercise: {
    id: 'exercise-13-01',
    title: 'Classify all state in an existing application',
    prompt:
      'Produce a complete state inventory for an application and correct every misplacement.',
    steps: [
      'List every fact the application remembers.',
      'For each, record who is authoritative.',
      'For each, record what it should survive: re-render, navigation, refresh, session.',
      'Classify each as local, global, URL, or server.',
      'Write a justification for every global entry.',
      'Identify every misplacement and move it.',
      'Verify each lifetime behaves as the inventory states.',
      'Record how many entries left the global store.',
    ],
    successCriteria: [
      'A written inventory exists with kind, owner, and lifetime for every fact.',
      'No fetched data sits in the global client store.',
      'Every global entry has a written justification.',
      'Equivalent state behaves consistently across screens.',
      'Observed lifetimes match the inventory.',
    ],
    estimatedMinutes: 50,
    hint: 'Ask who can change it without the browser doing anything. That single question separates server state from everything else.',
  },

  reflectionQuestion:
    'Why does placing everything in one global store create problems?',
  reflectionHint: 'Different truths have different lifetimes.',

  resources: [
    {
      id: 'resource-react-state-management',
      title: 'React: managing state',
      url: 'https://react.dev/learn/managing-state',
      type: 'documentation',
      estimatedMinutes: 45,
      note: 'Structure, lifting, and when to reach for a store.',
    },
    {
      id: 'resource-tanstack-query-overview',
      title: 'TanStack Query: overview',
      url: 'https://tanstack.com/query/latest/docs/framework/react/overview',
      type: 'documentation',
      estimatedMinutes: 20,
      note: 'The argument for treating server state as its own category.',
    },
  ],

  competencyTags: ['product-thinking', 'state-modelling', 'architecture'],

  completionCriteria: [
    'A written state inventory exists and misplacements were corrected.',
    'No server data lives in the global client store.',
    'Every global entry is justified.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Lesson 62                                                                   */
/* -------------------------------------------------------------------------- */

const LESSON_62: Lesson = {
  id: 'lesson-13-02',
  slug: 'server-state-vs-client-state',
  moduleId: MODULE_ID,
  lessonNumber: 2,
  title: 'Server State vs Client State',
  summary:
    'The browser holds a copy of something it does not own. Every design decision about remote data follows from that.',
  estimatedMinutes: 9,

  objectives: [
    'Explain why a fetched value is a cache rather than a fact.',
    'Choose staleness behaviour appropriate to the data.',
    'Invalidate and refetch without blanking the interface.',
    'Handle the case where the local copy has diverged.',
  ],

  prerequisiteConcepts: ['State boundaries', 'Optimistic updates'],
  prerequisiteLessonIds: ['lesson-13-01', 'lesson-11-02'],

  recap: [
    {
      kind: 'paragraph',
      text: 'Server state was one of the four kinds. It is the one with a problem the others do not have: the source can change without telling you.',
    },
  ],

  coreConcept: [
    {
      kind: 'paragraph',
      text: 'When the browser fetches data, it receives a copy of a value as it was at a moment in the past. The server remains authoritative. The copy begins ageing immediately, and nothing notifies the browser when it stops being accurate.',
    },
    {
      kind: 'list',
      items: [
        'Fresh — recently fetched; use it without question.',
        'Stale — old enough to doubt; show it, but refetch.',
        'Invalidated — known to be wrong, usually because of a mutation.',
        'Diverged — the local copy was edited and the server version also changed.',
      ],
    },
    {
      kind: 'paragraph',
      text: 'Staleness is a per-data decision, not a global setting. A list of countries can be cached for hours. An order status must be near-real-time. Using one staleness policy for both means either wasted requests or wrong information.',
    },
    {
      kind: 'callout',
      tone: 'warning',
      body: 'A copy is not authority. Any write based on a stale copy can overwrite a change made elsewhere, and the user will never know it happened.',
    },
  ],

  firstPrinciples: [
    {
      kind: 'paragraph',
      text: 'Two people editing the same record is not an edge case; it is the normal condition of any multi-user product. The question is only whether the application notices.',
    },
    {
      kind: 'paragraph',
      text: 'Last-write-wins is a decision, and usually an unexamined one: the second save silently discards the first person\'s work. Detecting the conflict — through a version field or an updated timestamp — turns silent data loss into a resolvable situation.',
    },
  ],

  designPerspective: [
    {
      kind: 'paragraph',
      text: 'Staleness is visible to users and should sometimes be stated. A dashboard figure that is two minutes old is fine if it says so, and misleading if it presents itself as current.',
    },
    {
      kind: 'paragraph',
      text: 'The pattern that works: show the cached value immediately, indicate it is being refreshed, and update in place. The user gets something instantly and is not deceived about its age.',
    },
  ],

  engineeringPerspective: [
    {
      kind: 'code',
      language: 'ts',
      caption: 'Staleness per data type, and conflict detection on write.',
      code: `// Reference data changes rarely. Volatile data does not.
const countries = useQuery({
  queryKey: ['countries'],
  queryFn: api.getCountries,
  staleTime: 24 * 60 * 60 * 1000,
});

const orderStatus = useQuery({
  queryKey: ['order', id, 'status'],
  queryFn: () => api.getOrderStatus(id),
  staleTime: 5_000,
  refetchInterval: 15_000,
});

// Send the version we read. The server rejects a write based on a stale copy
// instead of silently discarding whatever changed in between.
async function save(project: Project) {
  try {
    return await api.updateProject(project.id, {
      ...changes,
      expectedVersion: project.version,
    });
  } catch (error) {
    if (isConflict(error)) {
      // Do not overwrite. Show both and let the user decide.
      return showConflictResolution(await api.getProject(project.id), changes);
    }
    throw error;
  }
}`,
    },
    {
      kind: 'paragraph',
      text: 'After a successful mutation, invalidate the queries the change affects rather than manually patching the cache. Patching duplicates server logic in the client and drifts from it the moment either side changes.',
    },
  ],

  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'Conflict resolution is a design surface that usually does not exist because the conflict was never detected. Once it is detected, someone has to design what the user sees and what choices they have.',
    },
    {
      kind: 'paragraph',
      text: 'The minimum honest version: show both values, name who changed the other one and when, and let the user pick. It is far better than silence.',
    },
  ],

  industryExamples: [
    {
      id: 'example-stale-while-revalidate',
      source: 'Caching strategies',
      title: 'Show the cached copy, refresh behind it',
      observation:
        'Stale-while-revalidate serves the cached value immediately and updates it in the background.',
      takeaway:
        'Instant response and eventual accuracy, without a blank screen in between.',
    },
    {
      id: 'example-conflict-detection',
      source: 'Collaborative products',
      title: 'Conflicts surfaced rather than resolved silently',
      observation:
        'Products where several people edit the same record detect concurrent edits and present both versions instead of taking the last write.',
      takeaway:
        'Silent last-write-wins is data loss that neither party is told about.',
    },
  ],

  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Modelling a user profile backed by remote data.',
    },
    { kind: 'heading', text: '1. Name the authority' },
    {
      kind: 'paragraph',
      text: 'The server owns the profile. Everything in the browser is a copy with an age.',
    },
    { kind: 'heading', text: '2. Set staleness from volatility' },
    {
      kind: 'paragraph',
      text: 'Display name changes rarely; a subscription status may change without the user acting. Different policies.',
    },
    { kind: 'heading', text: '3. Keep the draft separate' },
    {
      kind: 'paragraph',
      text: 'Edits live in local state until saved. The cached server copy is never mutated by an in-progress edit.',
    },
    { kind: 'heading', text: '4. Send the version on write' },
    {
      kind: 'paragraph',
      text: 'So the server can reject a write based on a stale copy rather than applying it.',
    },
    { kind: 'heading', text: '5. Design the conflict case' },
    {
      kind: 'paragraph',
      text: 'Both values shown, with who changed the other and when, and a choice.',
    },
    { kind: 'heading', text: '6. Invalidate, do not patch' },
    {
      kind: 'paragraph',
      text: 'After a successful save, invalidate affected queries and let the server\'s version arrive.',
    },
    { kind: 'heading', text: '7. Test with two tabs' },
    {
      kind: 'paragraph',
      text: 'Edit in both, save in both. That is the conflict, and it takes thirty seconds to produce.',
    },
  ],

  commonMistakes: [
    {
      id: 'mistake-cache-as-truth',
      mistake: 'Treating fetched data as authoritative.',
      why: 'Writes based on a stale copy overwrite changes made elsewhere, silently.',
      instead: 'Treat it as a cache and send a version with every write.',
    },
    {
      id: 'mistake-uniform-staleness',
      mistake: 'One staleness policy for all data.',
      why: 'Either reference data is refetched constantly, or volatile data is shown long after it stopped being true.',
      instead: 'Set staleness per data type from its volatility.',
    },
    {
      id: 'mistake-manual-cache-patch',
      mistake: 'Hand-patching the cache after a mutation.',
      why: 'It reimplements server logic in the client and drifts from it as either side changes.',
      instead: 'Invalidate and let the server\'s response be the source.',
    },
    {
      id: 'mistake-blank-on-refetch',
      mistake: 'Clearing the interface while refetching.',
      why: 'The user loses their place and every background refresh feels like a full reload.',
      instead: 'Show the cached value with a refreshing indicator.',
    },
  ],

  eliteConsiderations: [
    {
      kind: 'list',
      items: [
        'State the age of data where age matters — a timestamp costs little and prevents a false impression.',
        'Keep drafts entirely separate from the cache so cancelling needs no rollback.',
        'Refetch on window focus for volatile data; the user has been away and expects current information.',
        'Test with two tabs before shipping anything editable; the conflict is thirty seconds away.',
      ],
    },
  ],

  practicalExercise: {
    id: 'exercise-13-02',
    title: 'Model a user profile backed by remote data',
    prompt:
      'Build a profile where the server is authoritative, staleness is explicit, and conflicts are detected.',
    steps: [
      'Identify every field and how volatile each one is.',
      'Set staleness per field group based on volatility.',
      'Keep in-progress edits in local state, separate from the cache.',
      'Send a version or timestamp with every write.',
      'Design and build the conflict screen: both values, attribution, and a choice.',
      'Invalidate affected queries after a successful save rather than patching.',
      'Show the cached value during refetch with a refreshing indicator.',
      'Open two tabs, edit in both, save in both, and verify the conflict is caught.',
    ],
    successCriteria: [
      'Staleness differs by field group, with a written reason.',
      'Drafts never mutate the cached server copy.',
      'A concurrent edit produces a conflict screen rather than silent overwrite.',
      'Refetching never blanks the interface.',
      'The cache is invalidated rather than hand-patched.',
    ],
    estimatedMinutes: 55,
    hint: 'Two tabs, edit both, save both. If the second save wins silently, the write is missing a version.',
  },

  reflectionQuestion:
    'Who owns server data after the browser receives a copy?',
  reflectionHint: 'A copy is not authority.',

  resources: [
    {
      id: 'resource-tanstack-caching',
      title: 'TanStack Query: caching',
      url: 'https://tanstack.com/query/latest/docs/framework/react/guides/caching',
      type: 'documentation',
      estimatedMinutes: 25,
      note: 'Staleness, invalidation, and background refetching.',
    },
    {
      id: 'resource-mdn-etag',
      title: 'MDN: ETag',
      url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/ETag',
      type: 'documentation',
      estimatedMinutes: 15,
      note: 'Conditional requests, which are conflict detection at the HTTP level.',
    },
  ],

  competencyTags: [
    'product-judgement',
    'state-modelling',
    'async-systems',
    'architecture',
  ],

  completionCriteria: [
    'Staleness is set per data type with written reasons.',
    'Concurrent edits produce a conflict rather than silent overwrite.',
    'Refetching preserves visible content.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Lesson 63                                                                   */
/* -------------------------------------------------------------------------- */

const LESSON_63: Lesson = {
  id: 'lesson-13-03',
  slug: 'error-handling-and-recovery',
  moduleId: MODULE_ID,
  lessonNumber: 3,
  title: 'Error Handling and Recovery',
  summary:
    'Failures are normal operating conditions. What separates products is whether the user is left with a next move.',
  estimatedMinutes: 9,

  objectives: [
    'Prevent the failures that can be prevented, at the right moment.',
    'Detect and contain failures so one does not take the page with it.',
    'Write messages that state the problem and the next action.',
    'Design recovery: retry, rollback, and graceful degradation.',
  ],

  prerequisiteConcepts: ['Async states', 'Server state'],
  prerequisiteLessonIds: ['lesson-13-02', 'lesson-11-01'],

  recap: [
    {
      kind: 'paragraph',
      text: 'You have modelled failure as a state. This lesson is about what the product does once it is in that state.',
    },
  ],

  coreConcept: [
    {
      kind: 'paragraph',
      text: 'Error handling has five parts, and most products implement only the third.',
    },
    {
      kind: 'list',
      items: [
        'Prevention — constraints that stop the error being possible.',
        'Detection — noticing, including the silent failures.',
        'Communication — saying what happened in terms the user can act on.',
        'Recovery — retry, rollback, or an alternative route.',
        'Degradation — the product still doing something useful when part of it is unavailable.',
      ],
    },
    {
      kind: 'paragraph',
      text: 'Prevention is the cheapest and the most commonly skipped. A date picker that cannot select an invalid date removes a whole class of validation error, and removes the need to explain it.',
    },
    {
      kind: 'callout',
      tone: 'insight',
      body: 'A useful message names the problem and the next move. "Something went wrong" does neither, which makes it functionally identical to silence.',
    },
  ],

  firstPrinciples: [
    {
      kind: 'paragraph',
      text: 'Errors divide by who can act. A user error is something the person can fix — a wrong value, a missing field. A system error is not, and telling someone to fix something they cannot is worse than admitting the system failed.',
    },
    {
      kind: 'paragraph',
      text: 'The division determines the message. User errors say what to change. System errors say what happened, whether it is worth retrying, and what else is available in the meantime.',
    },
  ],

  designPerspective: [
    {
      kind: 'paragraph',
      text: 'Partial failure is the case designs almost never cover. If four panels load and one fails, the page should show three panels and one error — not a full-page error that discards working content.',
    },
    {
      kind: 'paragraph',
      text: 'That requires error boundaries around each independent region, which is a structural decision that has to be made before it is needed.',
    },
  ],

  engineeringPerspective: [
    {
      kind: 'code',
      language: 'tsx',
      caption: 'Failure contained per region, so one panel cannot take the page.',
      code: `<Dashboard>
  <ErrorBoundary fallback={<PanelError region="Revenue" onRetry={refetchRevenue} />}>
    <RevenuePanel />
  </ErrorBoundary>

  <ErrorBoundary fallback={<PanelError region="Activity" onRetry={refetchActivity} />}>
    <ActivityPanel />
  </ErrorBoundary>
</Dashboard>`,
    },
    {
      kind: 'code',
      language: 'ts',
      caption: 'Classify first; the classification decides the message and the route.',
      code: `function describe(error: unknown): UserFacingError {
  if (error instanceof NetworkError)
    return { message: 'Could not reach the server.', retryable: true };

  if (error instanceof AuthError)
    return { message: 'Your session expired.', action: 'sign-in', retryable: false };

  if (error instanceof PermissionError)
    return { message: 'You do not have access to this project.',
             action: 'request-access', retryable: false };

  if (error instanceof ValidationError)
    return { message: error.fieldMessage, field: error.field, retryable: false };

  // Unknown: say so honestly, give a reference, do not invent a cause.
  return { message: 'Something failed on our side.', reference: logError(error),
           retryable: true };
}`,
    },
    {
      kind: 'paragraph',
      text: 'The unknown case still carries a reference identifier. It does not explain anything to the user, but it gives them something to quote and gives you something to search.',
    },
  ],

  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'Error copy is design work performed under the worst conditions: the user is already frustrated and reading carefully for the first time.',
    },
    {
      kind: 'paragraph',
      text: 'It is also where the tone of a product is most exposed. Blaming the user, hiding the failure, or pretending nothing happened are all decisions the copy makes visible.',
    },
  ],

  industryExamples: [
    {
      id: 'example-inline-validation',
      source: 'Well-built forms',
      title: 'Validation timed to be helpful',
      observation:
        'Careful forms validate on blur after first interaction, not on every keystroke, and keep the message beside the field.',
      takeaway:
        'Telling someone they are wrong before they have finished being right is a design failure, not a validation feature.',
    },
    {
      id: 'example-partial-degradation',
      source: 'Dashboard products',
      title: 'One failed panel, not one failed page',
      observation:
        'Products with independent data sources contain failure per region and keep the rest of the page working.',
      takeaway:
        'Most of the value is usually still available; discarding it is a choice.',
    },
  ],

  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Designing recovery for five failure cases.',
    },
    { kind: 'heading', text: '1. Enumerate the failures' },
    {
      kind: 'paragraph',
      text: 'Network unavailable, session expired, permission denied, validation rejected, server error. Five distinct situations.',
    },
    { kind: 'heading', text: '2. Classify each by who can act' },
    {
      kind: 'paragraph',
      text: 'The user can fix validation. They cannot fix a server error. The message follows from this.',
    },
    { kind: 'heading', text: '3. Write the copy' },
    {
      kind: 'paragraph',
      text: 'What happened, in their terms, and what to do next. No technical detail, no blame, no invented cause.',
    },
    { kind: 'heading', text: '4. Decide the recovery route' },
    {
      kind: 'paragraph',
      text: 'Retry, sign in again, request access, correct the field, or wait. Each failure gets exactly one primary route.',
    },
    { kind: 'heading', text: '5. Contain the blast radius' },
    {
      kind: 'paragraph',
      text: 'Error boundaries per independent region, so a failure is local.',
    },
    { kind: 'heading', text: '6. Design the degraded state' },
    {
      kind: 'paragraph',
      text: 'What still works when this fails? Say so, rather than presenting the whole product as broken.',
    },
    { kind: 'heading', text: '7. Force each failure' },
    {
      kind: 'paragraph',
      text: 'A development switch per case. Untriggerable errors are untested errors.',
    },
  ],

  commonMistakes: [
    {
      id: 'mistake-generic-error',
      mistake: 'One generic message for every failure.',
      why: 'It tells the user nothing about whether to retry, wait, or change something.',
      instead: 'Classify and write a specific message with a specific next action.',
    },
    {
      id: 'mistake-full-page-error',
      mistake: 'Replacing the whole page when one region fails.',
      why: 'Working content is discarded, so the user loses access to value that was available.',
      instead: 'Contain failures with error boundaries per region.',
    },
    {
      id: 'mistake-technical-messages',
      mistake: 'Showing raw technical errors to users.',
      why: 'They are unactionable and sometimes leak internal detail.',
      instead: 'Show a human message with a reference; log the detail.',
    },
    {
      id: 'mistake-untestable-errors',
      mistake: 'No way to trigger each failure in development.',
      why: 'The error paths are never exercised, so they are discovered by users.',
      instead: 'Build a switch that forces each failure on demand.',
    },
  ],

  eliteConsiderations: [
    {
      kind: 'list',
      items: [
        'Prevent first — a constraint that makes an error impossible is better than any message.',
        'Retry transient failures automatically once, with backoff, before surfacing anything.',
        'Announce errors in a live region; a visual-only error is invisible to a screen reader.',
        'Include a reference identifier on unknown errors so a report is traceable.',
      ],
    },
  ],

  practicalExercise: {
    id: 'exercise-13-03',
    title: 'Design recovery for five failure cases',
    prompt:
      'Design and implement prevention, detection, communication, recovery, and degradation for five distinct failures.',
    steps: [
      'Enumerate five failures: network, session, permission, validation, server error.',
      'For each, identify whether the user can act.',
      'Write the message: what happened and what to do next.',
      'Define one primary recovery route per failure.',
      'Add error boundaries so failure is contained per region.',
      'Design the degraded state for each: what still works.',
      'Add a development switch that forces each failure.',
      'Announce each error in a live region and verify with the mouse unplugged.',
    ],
    successCriteria: [
      'Five distinct messages exist, each with a specific next action.',
      'No failure replaces the whole page unnecessarily.',
      'Each failure can be forced on demand in development.',
      'Unknown errors carry a reference identifier.',
      'Errors are announced to assistive technology.',
    ],
    estimatedMinutes: 55,
    hint: 'Write the recovery route before the message. The message exists to get the user to that route.',
  },

  reflectionQuestion: 'What makes an error message useful?',
  reflectionHint: 'Describe both the problem and the next move.',

  resources: [
    {
      id: 'resource-nngroup-error-messages',
      title: 'Error message guidelines',
      url: 'https://www.nngroup.com/articles/error-message-guidelines/',
      type: 'article',
      estimatedMinutes: 15,
      note: 'What separates an actionable message from a dismissible one.',
    },
    {
      id: 'resource-react-error-boundaries',
      title: 'React: error boundaries',
      url: 'https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary',
      type: 'documentation',
      estimatedMinutes: 20,
      note: 'Containing failure to a region.',
    },
  ],

  competencyTags: [
    'product-thinking',
    'accessibility',
    'architecture',
    'interface-state-modelling',
  ],

  completionCriteria: [
    'Five failure cases have distinct messages and recovery routes.',
    'Failures are contained per region.',
    'Each failure can be forced on demand.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Lesson 64                                                                   */
/* -------------------------------------------------------------------------- */

const LESSON_64: Lesson = {
  id: 'lesson-13-04',
  slug: 'testing-interfaces',
  moduleId: MODULE_ID,
  lessonNumber: 4,
  title: 'Testing Interfaces',
  summary:
    'Test what it would cost to get wrong. The strength of a test should match the consequence of the failure it prevents.',
  estimatedMinutes: 9,

  objectives: [
    'Choose a test level appropriate to what is being verified.',
    'Test behaviour through the interface rather than through implementation.',
    'Cover interaction and accessibility, not only rendering.',
    'Prioritise coverage by consequence of failure.',
  ],

  prerequisiteConcepts: ['Error handling', 'Component architecture'],
  prerequisiteLessonIds: ['lesson-13-03', 'lesson-08-01'],

  recap: [
    {
      kind: 'paragraph',
      text: 'You have designed the failure paths. Tests are how they stay working after the next change.',
    },
  ],

  coreConcept: [
    {
      kind: 'paragraph',
      text: 'Test levels differ in what they exercise and what they cost to maintain.',
    },
    {
      kind: 'list',
      items: [
        'Unit — one function or module. Fast, precise, blind to integration.',
        'Integration — several components together. Where most interface confidence comes from.',
        'End-to-end — the real application in a browser. Slowest, highest fidelity.',
        'Interaction — keyboard, focus, and pointer behaviour, usually within integration tests.',
        'Accessibility — roles, names, and structure, checked automatically and manually.',
      ],
    },
    {
      kind: 'paragraph',
      text: 'The rule that keeps tests useful: query the way a user finds things. By role, by label, by visible text — never by class name or test id where a real affordance exists. A test that finds a button by its role also verifies the button has that role.',
    },
    {
      kind: 'callout',
      tone: 'insight',
      body: 'A test coupled to implementation fails when you refactor and passes when you break behaviour. That is worse than no test, because it is trusted.',
    },
  ],

  firstPrinciples: [
    {
      kind: 'paragraph',
      text: 'Coverage percentage measures which lines ran, not whether behaviour is correct. A suite at ninety percent coverage can miss every failure path if it only ever exercises the happy one.',
    },
    {
      kind: 'paragraph',
      text: 'The better allocation is by consequence. What is the worst thing this application could do wrong? Deleting the wrong record, losing unsaved work, charging twice, showing one user another\'s data. Those deserve end-to-end tests. A tooltip\'s hover delay does not.',
    },
  ],

  designPerspective: [
    {
      kind: 'paragraph',
      text: 'Tests written against roles and labels are an accessibility check in disguise. If a test cannot find the submit button by its role and name, neither can a screen reader.',
    },
    {
      kind: 'paragraph',
      text: 'That makes the testing style a quality mechanism rather than only a regression net — the constraint improves the thing being tested.',
    },
  ],

  engineeringPerspective: [
    {
      kind: 'code',
      language: 'ts',
      caption: 'Queried as a user would, including the failure path.',
      code: `test('shows a field error and keeps the draft when saving fails', async () => {
  const user = userEvent.setup();
  server.use(failOnce('/api/projects/1', 422, { field: 'name', message: 'Name taken' }));

  render(<ProjectForm projectId="1" />);

  // Found by role and accessible name — the same way a screen reader finds it.
  await user.clear(screen.getByRole('textbox', { name: /project name/i }));
  await user.type(screen.getByRole('textbox', { name: /project name/i }), 'Atlas');
  await user.click(screen.getByRole('button', { name: /save/i }));

  // The error is announced, not merely coloured.
  expect(await screen.findByRole('alert')).toHaveTextContent(/name taken/i);

  // The user's work survived the failure.
  expect(screen.getByRole('textbox', { name: /project name/i })).toHaveValue('Atlas');
});`,
    },
    {
      kind: 'paragraph',
      text: 'Automated accessibility checks catch a genuine but limited set of problems — missing names, contrast failures, invalid ARIA. They cannot tell whether focus order makes sense or whether an announcement is useful, so they supplement manual checks rather than replacing them.',
    },
  ],

  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'A test suite is executable documentation of intended behaviour. "Saving with a duplicate name shows an error and keeps the draft" is a product decision written in a form that cannot go stale.',
    },
    {
      kind: 'paragraph',
      text: 'It is also the only design specification that fails loudly when the product stops matching it.',
    },
  ],

  industryExamples: [
    {
      id: 'example-testing-library-philosophy',
      source: 'Testing Library',
      title: 'Query as the user would',
      observation:
        'The library deliberately makes implementation-based queries awkward and role-based queries easy.',
      takeaway:
        'The constraint pushes tests toward resilience and pushes markup toward accessibility.',
    },
    {
      id: 'example-critical-path-e2e',
      source: 'Teams with proportionate suites',
      title: 'End-to-end reserved for consequence',
      observation:
        'Effective suites run a small number of end-to-end tests over irreversible flows and use integration tests for everything else.',
      takeaway:
        'Slow, brittle tests are worth it exactly where failure is expensive, and nowhere else.',
    },
  ],

  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Testing the critical path of one project.',
    },
    { kind: 'heading', text: '1. Name the critical path' },
    {
      kind: 'paragraph',
      text: 'The sequence that, if broken, makes the product useless. Usually one flow.',
    },
    { kind: 'heading', text: '2. Rank by consequence' },
    {
      kind: 'paragraph',
      text: 'What is the worst outcome of each step failing? That ranking decides where the strongest tests go.',
    },
    { kind: 'heading', text: '3. Write the end-to-end test first' },
    {
      kind: 'paragraph',
      text: 'One test through the whole path. It catches integration failures nothing else will.',
    },
    { kind: 'heading', text: '4. Add integration tests for the branches' },
    {
      kind: 'paragraph',
      text: 'Validation failures, network errors, empty results. The paths users hit and development does not.',
    },
    { kind: 'heading', text: '5. Query by role and name throughout' },
    {
      kind: 'paragraph',
      text: 'If a query is awkward, the markup is probably missing an accessible name.',
    },
    { kind: 'heading', text: '6. Add keyboard and accessibility assertions' },
    {
      kind: 'paragraph',
      text: 'Tab order, focus after submit, errors announced. Then an automated accessibility check per view.',
    },
    { kind: 'heading', text: '7. Verify the tests can fail' },
    {
      kind: 'paragraph',
      text: 'Break the behaviour deliberately. A test that cannot fail is not testing anything.',
    },
  ],

  commonMistakes: [
    {
      id: 'mistake-test-implementation',
      mistake: 'Querying by class name or internal structure.',
      why: 'Refactors break the test and behavioural regressions slip through it.',
      instead: 'Query by role, label, and visible text.',
    },
    {
      id: 'mistake-coverage-target',
      mistake: 'Treating a coverage percentage as the goal.',
      why: 'It measures execution, not correctness, and rewards testing trivial code.',
      instead: 'Allocate testing effort by consequence of failure.',
    },
    {
      id: 'mistake-happy-path-only',
      mistake: 'Testing only the successful path.',
      why: 'The failure paths are the ones least exercised in development and most encountered by users.',
      instead: 'Test validation failures, network errors, and empty states explicitly.',
    },
    {
      id: 'mistake-never-verified-failing',
      mistake: 'Never checking that a test can fail.',
      why: 'A misconfigured assertion passes permanently and provides false confidence.',
      instead: 'Break the behaviour deliberately and confirm the test catches it.',
    },
  ],

  eliteConsiderations: [
    {
      kind: 'list',
      items: [
        'Mock at the network boundary rather than mocking your own modules; the test then exercises real integration.',
        'Include an automated accessibility check in every component test — it costs one line.',
        'Test keyboard paths explicitly; pointer-only tests miss a whole class of defect.',
        'Delete tests that have never failed for a real reason; they are maintenance with no return.',
      ],
    },
  ],

  practicalExercise: {
    id: 'exercise-13-04',
    title: 'Test the critical path of one project',
    prompt:
      'Build a proportionate test suite for one project\'s most consequential flow.',
    steps: [
      'Identify the critical path and rank each step by consequence of failure.',
      'Write one end-to-end test covering the whole path.',
      'Add integration tests for validation failure, network error, and empty results.',
      'Query exclusively by role, label, and visible text.',
      'Assert keyboard behaviour: tab order and focus after submission.',
      'Assert that errors are announced to assistive technology.',
      'Add an automated accessibility check per view.',
      'Break each tested behaviour deliberately and confirm the suite catches it.',
    ],
    successCriteria: [
      'No test queries by class name or internal structure.',
      'Failure paths are tested, not only the happy path.',
      'Keyboard and announcement behaviour are asserted.',
      'Every test was verified to fail when the behaviour is broken.',
      'Testing effort is allocated by a written consequence ranking.',
    ],
    estimatedMinutes: 55,
    hint: 'Break the code on purpose. A suite that stays green while the feature is broken is worse than having none.',
  },

  reflectionQuestion: 'Which behaviour deserves the strongest testing?',
  reflectionHint: 'Think consequences of failure.',

  resources: [
    {
      id: 'resource-testing-library',
      title: 'Testing Library: guiding principles',
      url: 'https://testing-library.com/docs/guiding-principles/',
      type: 'documentation',
      estimatedMinutes: 15,
      note: 'Why queries mirror how users find things.',
    },
    {
      id: 'resource-testing-library-queries',
      title: 'Testing Library: about queries',
      url: 'https://testing-library.com/docs/queries/about/',
      type: 'documentation',
      estimatedMinutes: 20,
      note: 'The priority order, from accessible to last resort.',
    },
    {
      id: 'resource-axe-core',
      title: 'axe-core',
      url: 'https://github.com/dequelabs/axe-core',
      type: 'repository',
      estimatedMinutes: 20,
      note: 'Automated accessibility checks, and an honest account of their limits.',
    },
  ],

  competencyTags: ['accessibility', 'testing', 'architecture'],

  completionCriteria: [
    'A proportionate suite covers the critical path and its failure branches.',
    'No test is coupled to implementation detail.',
    'Every test was verified to fail when behaviour breaks.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Lesson 65                                                                   */
/* -------------------------------------------------------------------------- */

const LESSON_65: Lesson = {
  id: 'lesson-13-05',
  slug: 'design-qa',
  moduleId: MODULE_ID,
  lessonNumber: 5,
  title: 'Design QA',
  summary:
    'Comparing an implementation to a design file checks one frozen frame. Products exist under interaction, real content, and real conditions.',
  estimatedMinutes: 9,

  objectives: [
    'Run visual, interaction, responsive, and accessibility QA as distinct passes.',
    'Compare implementation to intent rather than to pixels.',
    'Record defects so they can be triaged rather than argued about.',
    'Find the defects a static comparison cannot reveal.',
  ],

  prerequisiteConcepts: ['Testing', 'Design parity', 'Accessibility'],
  prerequisiteLessonIds: ['lesson-13-04', 'lesson-09-03'],

  recap: [
    {
      kind: 'paragraph',
      text: 'Automated tests verify behaviour you thought to specify. Design QA finds what nobody specified.',
    },
  ],

  coreConcept: [
    {
      kind: 'paragraph',
      text: 'Design QA is four separate passes, because looking for everything at once means finding the most obvious thing and stopping.',
    },
    {
      kind: 'list',
      items: [
        'Visual — spacing, alignment, type, colour, density against the system.',
        'Interaction — states, feedback, timing, focus, dead ends.',
        'Responsive — every breakpoint, plus the widths between them.',
        'Accessibility — keyboard, screen reader, contrast, zoom, reduced motion.',
      ],
    },
    {
      kind: 'paragraph',
      text: 'A design file shows a frozen frame with chosen content. The product has hover and focus and loading and error states, content of unpredictable length, and users at 200% zoom on a slow connection. Almost none of that is in the file.',
    },
    {
      kind: 'callout',
      tone: 'insight',
      body: 'Matching the mockup exactly and still being wrong is entirely possible, because the mockup only specified one state with one set of content.',
    },
  ],

  firstPrinciples: [
    {
      kind: 'paragraph',
      text: 'The right comparison is against intent, not against pixels. If the design used 24px because it is the system\'s large spacing step, then 24px is right. If it used 23px because of a nudge, matching 23px propagates an accident.',
    },
    {
      kind: 'paragraph',
      text: 'This reframes QA from "does it match" to "does it express the decision". The second question catches errors in both directions, including errors in the design file.',
    },
  ],

  designPerspective: [
    {
      kind: 'paragraph',
      text: 'The most valuable QA uses real content: the longest name in the database, the account with no activity, the user with one item and the one with four hundred.',
    },
    {
      kind: 'paragraph',
      text: 'Placeholder content hides exactly the defects that matter, because it was chosen to fit. Real content was not.',
    },
  ],

  engineeringPerspective: [
    {
      kind: 'code',
      language: 'md',
      caption: 'A defect record that can be triaged instead of debated.',
      code: `## DEF-014 — Project name truncates at 320px with no tooltip

**Pass:** Responsive
**Severity:** Medium — name is unreadable, no way to see the full value
**Where:** Project list, row title
**Conditions:** 320px viewport, Chrome, name longer than 28 characters
**Expected:** Truncation with the full name available on focus and hover
**Actual:** Truncated with no affordance; full value unavailable
**Decision it violates:** Token scale is not the issue — the system's
truncation pattern requires a title affordance (Patterns §3.2)
**Repro:** /projects at 320px with the seeded "Northern Territories" project`,
    },
    {
      kind: 'paragraph',
      text: 'Severity, conditions, and reproduction steps are what turn a defect list into something actionable. Without them a list becomes a discussion, and the discussion is usually about whether the item is real rather than about fixing it.',
    },
  ],

  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'Design QA is where design engineering is most obviously one discipline. It requires knowing what the design intended, what the code does, and what the browser will do under conditions neither anticipated.',
    },
    {
      kind: 'paragraph',
      text: 'It is also the most reliable way to catch the defects that survive both a design review and a code review, because each of those looks at only one half.',
    },
  ],

  industryExamples: [
    {
      id: 'example-design-qa-stage',
      source: 'Teams with a design QA stage',
      title: 'QA as a named step before release',
      observation:
        'Products with consistent quality run an explicit design QA pass, with defects logged and triaged like any other.',
      takeaway:
        'Without a named stage it is done when there is time, which means it is not done.',
    },
    {
      id: 'example-real-content-testing',
      source: 'Content-driven products',
      title: 'Reviewing with production content',
      observation:
        'Teams that review with real data find truncation, wrapping, and density defects that placeholder content conceals entirely.',
      takeaway:
        'Lorem ipsum was chosen to fit. Real content was not.',
    },
  ],

  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Auditing a finished project.',
    },
    { kind: 'heading', text: '1. Visual pass, against the system' },
    {
      kind: 'paragraph',
      text: 'Every spacing, colour, and type value traced to a token. Anything off-scale is a defect or a documented exception.',
    },
    { kind: 'heading', text: '2. Interaction pass, with the mouse unplugged' },
    {
      kind: 'paragraph',
      text: 'Every state, every transition, every focus move. Dead ends and missing feedback surface immediately.',
    },
    { kind: 'heading', text: '3. Responsive pass, continuously' },
    {
      kind: 'paragraph',
      text: 'Drag from 320px to 2560px. Defects live between breakpoints, not at them.',
    },
    { kind: 'heading', text: '4. Accessibility pass' },
    {
      kind: 'paragraph',
      text: 'Keyboard only, then a screen reader, then 200% zoom, then reduced motion. Four separate checks.',
    },
    { kind: 'heading', text: '5. Real content pass' },
    {
      kind: 'paragraph',
      text: 'Longest values, empty accounts, four hundred items, a translated string. This is where the truncation defects are.',
    },
    { kind: 'heading', text: '6. Record and triage' },
    {
      kind: 'paragraph',
      text: 'Each defect with severity, conditions, expected, actual, and the decision it violates.',
    },
  ],

  commonMistakes: [
    {
      id: 'mistake-pixel-comparison',
      mistake: 'QA as a pixel comparison against the design file.',
      why: 'It checks one state with one set of content and propagates any accident in the file.',
      instead: 'Compare against the system decision the design expresses.',
    },
    {
      id: 'mistake-qa-one-pass',
      mistake: 'Doing all four passes at once.',
      why: 'Attention goes to the most obvious defect and the others are not looked for.',
      instead: 'Run each pass separately with a single focus.',
    },
    {
      id: 'mistake-breakpoints-only',
      mistake: 'Checking only at defined breakpoints.',
      why: 'Layouts break between breakpoints, where nothing was verified.',
      instead: 'Resize continuously across the whole range.',
    },
    {
      id: 'mistake-defects-without-conditions',
      mistake: 'Logging defects without conditions or severity.',
      why: 'They cannot be reproduced or prioritised, so the list becomes an argument.',
      instead: 'Record conditions, severity, expected, actual, and reproduction steps.',
    },
  ],

  eliteConsiderations: [
    {
      kind: 'list',
      items: [
        'QA with production-shaped content, including the longest and emptiest cases.',
        'Run the interaction pass with the mouse physically unplugged; it removes the temptation to reach for it.',
        'Note the decision each defect violates — it distinguishes a defect from a preference.',
        'Keep the defect list in the repository so it survives the person who wrote it.',
      ],
    },
  ],

  practicalExercise: {
    id: 'exercise-13-05',
    title: 'Audit one finished project and record defects',
    prompt:
      'Run a four-pass design QA on a finished project and produce a triageable defect list.',
    steps: [
      'Run a visual pass, tracing every value to a token.',
      'Run an interaction pass with the mouse unplugged.',
      'Run a responsive pass, resizing continuously from 320px to 2560px.',
      'Run an accessibility pass: keyboard, screen reader, 200% zoom, reduced motion.',
      'Repeat every pass with real content, including the longest and emptiest cases.',
      'Record each defect with severity, conditions, expected, actual, and reproduction.',
      'Note the system decision each defect violates.',
      'Rank by severity and fix the top five.',
    ],
    successCriteria: [
      'Four passes were run separately, each with a single focus.',
      'Every defect has severity, conditions, and reproduction steps.',
      'Real content was used, not placeholder text.',
      'The responsive pass covered widths between breakpoints.',
      'Each defect names the decision it violates.',
    ],
    estimatedMinutes: 60,
    hint: 'Unplug the mouse for the interaction pass. Knowing you cannot reach for it changes what you notice.',
  },

  reflectionQuestion:
    'Why is matching Figma pixels insufficient for successful implementation?',
  reflectionHint: 'Products change under interaction and content.',

  resources: [
    {
      id: 'resource-wcag-quickref-13',
      title: 'How to meet WCAG (quick reference)',
      url: 'https://www.w3.org/WAI/WCAG22/quickref/',
      type: 'specification',
      estimatedMinutes: 45,
      note: 'A checklist for the accessibility pass.',
    },
    {
      id: 'resource-accessibility-insights-13',
      title: 'Accessibility Insights',
      url: 'https://accessibilityinsights.io/',
      type: 'tool',
      estimatedMinutes: 20,
      note: 'Guided manual checks alongside automated ones.',
    },
  ],

  competencyTags: ['responsive-design', 'accessibility', 'critique', 'design-qa'],

  completionCriteria: [
    'Four separate QA passes were run on a real project.',
    'Every defect is recorded with conditions and severity.',
    'Real content was used throughout.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Project                                                                     */
/* -------------------------------------------------------------------------- */

const PROJECT: ModuleProject = {
  id: 'project-13',
  slug: 'production-saas-workflow',
  moduleId: MODULE_ID,
  title: 'Production SaaS Workflow',
  brief:
    'Build a multi-step workflow with persistence, validation, async state, error recovery, responsive behaviour, and automated testing.',
  problem:
    'A multi-step flow is where partial progress becomes a real problem. Someone gets to step three, their session expires, their connection drops, or they close the tab — and what happens next is the difference between a product people trust with real work and one they do not. Every concern in this module converges here: where state lives, who owns it, what happens when it fails, and how you know it still works after the next change.',
  objectives: [
    'Classify and place every piece of state across a multi-step flow.',
    'Persist partial progress so work is never silently lost.',
    'Recover from every failure with a specific route.',
    'Verify the critical path automatically and by hand.',
  ],
  requirements: [
    'A workflow of at least three steps with a review before commit.',
    'Persistence of partial progress across refresh and navigation.',
    'Validation timed to help rather than to interrupt.',
    'Complete async state coverage, including saving and save failure.',
    'Error recovery with a specific route for each failure class.',
    'Responsive behaviour across the full width range.',
    'Automated tests covering the critical path and its failure branches.',
  ],
  constraints: [
    'No work may be lost by a refresh, a navigation, or a session expiry.',
    'Every piece of state must appear in a written inventory with its kind and lifetime.',
    'No test may query by class name or internal structure.',
    'Every failure must be triggerable on demand in development.',
  ],
  suggestedScope:
    'One workflow, three or four steps, local persistence with simulated latency and failures. No backend, no authentication system, no billing — the deliverable is the robustness of one flow.',
  deliverables: [
    'The working workflow.',
    'A state inventory: every fact, its kind, owner, and lifetime.',
    'A failure matrix: each failure, its message, and its recovery route.',
    'A test suite covering the critical path and its failure branches.',
    'A design QA report from four separate passes.',
  ],
  completionCriteria: [
    'Partial progress survives refresh, navigation, and session expiry.',
    'Every failure has a distinct message and a specific recovery route.',
    'The critical path and its failure branches are covered by tests that were verified to fail.',
    'The whole flow is completable by keyboard alone.',
    'A design QA report exists with defects recorded and the top ones fixed.',
  ],
  portfolioEvidence: [
    'Multi-step workflow architecture',
    'State classification and persistence',
    'Error recovery design',
    'Interface testing',
    'Design QA methodology',
  ],
  reflectionQuestion:
    'Which failure did you not think to handle until you tried to break it deliberately?',
  estimatedHours: 34,
  competencies: [
    'accessibility',
    'state-modelling',
    'async-systems',
    'testing',
    'architecture',
    'interface-state-modelling',
    'design-qa',
  ],
  stretchGoals: [
    'Add conflict detection so a flow resumed in a second tab does not silently overwrite the first.',
    'Add a degraded offline mode where progress is stored locally and synced when connectivity returns.',
  ],
};

/* -------------------------------------------------------------------------- */

export const MODULE_13: CurriculumModule = {
  id: MODULE_ID,
  slug: 'product-architecture-and-quality',
  moduleNumber: 13,
  phase: 'product-judgement',
  title: 'Product Architecture and Quality',
  description:
    'State boundaries across a whole application, server data as a cache rather than a fact, failure as a normal condition, and the two forms of verification that catch different defects.',
  outcome: 'Can architect and verify a product that holds up in real use.',
  prerequisites: [
    'Modules 1 to 12, or equivalent',
    'Experience building multi-screen applications',
  ],
  lessons: [LESSON_61, LESSON_62, LESSON_63, LESSON_64, LESSON_65],
  resources: [
    {
      id: 'resource-module-13-react-state',
      title: 'React: managing state',
      url: 'https://react.dev/learn/managing-state',
      type: 'documentation',
      estimatedMinutes: 60,
      note: 'Structure, lifting, and the boundaries this module formalises.',
    },
    {
      id: 'resource-module-13-testing-library',
      title: 'Testing Library',
      url: 'https://testing-library.com/',
      type: 'documentation',
      estimatedMinutes: 60,
      note: 'Querying as a user does, which is the whole methodology.',
    },
    {
      id: 'resource-module-13-wcag',
      title: 'How to meet WCAG (quick reference)',
      url: 'https://www.w3.org/WAI/WCAG22/quickref/',
      type: 'specification',
      estimatedMinutes: 60,
      note: 'The checklist behind the accessibility QA pass.',
    },
  ],
  project: PROJECT,
  competencies: [
    'product-thinking',
    'responsive-design',
    'accessibility',
    'critique',
    'product-judgement',
    'state-modelling',
    'async-systems',
    'testing',
    'architecture',
    'interface-state-modelling',
    'design-qa',
  ],
  completionCriteria: [
    'All five lessons completed.',
    'Module project marked completed.',
    'Can architect, verify, and QA a product-grade workflow.',
  ],
};
