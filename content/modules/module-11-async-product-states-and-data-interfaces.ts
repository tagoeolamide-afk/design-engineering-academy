/**
 * Module 11 — Async Product States and Data Interfaces.
 *
 * The states every data-backed interface owes its users, and the four surfaces
 * — optimistic updates, tables, query controls, and the URL — where those
 * states are either handled well or handled badly.
 */

import type { CurriculumModule, Lesson, ModuleProject } from '@/types/curriculum';

const MODULE_ID = 'module-11';

/* -------------------------------------------------------------------------- */
/* Lesson 51                                                                   */
/* -------------------------------------------------------------------------- */

const LESSON_51: Lesson = {
  id: 'lesson-11-01',
  slug: 'loading-success-error-and-empty',
  moduleId: MODULE_ID,
  lessonNumber: 1,
  title: 'Loading, Success, Error and Empty',
  summary:
    'Four states, each needing its own design. The three that are not success are the ones that decide whether the product feels finished.',
  estimatedMinutes: 9,

  objectives: [
    'Enumerate every state a data-backed surface can occupy.',
    'Choose between a skeleton, a spinner, and nothing at all.',
    'Write empty states that offer a next action.',
    'Build errors that distinguish retryable from terminal.',
  ],

  prerequisiteConcepts: ['Async behaviour', 'Discriminated unions'],
  prerequisiteLessonIds: ['lesson-05-05', 'lesson-06-02'],

  recap: [
    {
      kind: 'paragraph',
      text: 'Module 5 introduced the four outcomes of any operation that takes time. This module treats them as designable surfaces rather than as branches in a switch.',
    },
  ],

  coreConcept: [
    {
      kind: 'paragraph',
      text: 'A data-backed surface has more states than most designs account for, and each one is something a user will actually see.',
    },
    {
      kind: 'list',
      items: [
        'Idle — nothing has been requested yet.',
        'Loading first time — no previous content to show.',
        'Loading again — previous content exists and should usually stay.',
        'Success with content.',
        'Success with nothing — empty, which is not an error.',
        'Empty because of a filter — different from empty because nothing exists.',
        'Error, retryable — network, timeout, rate limit.',
        'Error, terminal — permission, not found, malformed.',
      ],
    },
    {
      kind: 'paragraph',
      text: 'A skeleton is a structural placeholder shaped like the content that is coming. A spinner is an undifferentiated indicator. The choice between them is not stylistic: a skeleton makes a claim about layout, and a wrong claim is worse than no claim.',
    },
    {
      kind: 'callout',
      tone: 'insight',
      body: 'A skeleton that does not match the arriving content produces a visible jump — the layout shift the skeleton was supposed to prevent.',
    },
  ],

  firstPrinciples: [
    {
      kind: 'paragraph',
      text: 'Perceived duration is shaped by whether waiting is explained. A wait with a shape — this is where the content will be, this is roughly how much there is — reads as shorter than an identical wait with an undifferentiated indicator.',
    },
    {
      kind: 'paragraph',
      text: 'But that only holds when the shape is honest. If the skeleton shows five rows and two arrive, or shows a card layout and a table arrives, the user has been told something false and the correction is visible. A spinner promises nothing and therefore cannot be wrong.',
    },
  ],

  designPerspective: [
    {
      kind: 'paragraph',
      text: 'The empty state is frequently a new user\'s first screen, which makes it the least appropriate place for a blank region. It has a job: explain what would appear here, and offer the action that would make it appear.',
    },
    {
      kind: 'paragraph',
      text: 'Empty-because-of-a-filter is a different screen with a different action. "No projects yet — create one" and "No projects match \'archived\' — clear the filter" are not interchangeable, and collapsing them tells someone to create a project they already have.',
    },
  ],

  engineeringPerspective: [
    {
      kind: 'code',
      language: 'tsx',
      caption: 'Every state named, with the distinctions that matter preserved.',
      code: `type ListState<T> =
  | { status: 'idle' }
  | { status: 'loading' }                                  // nothing to show yet
  | { status: 'refreshing'; items: T[] }                   // keep showing these
  | { status: 'ready'; items: T[] }
  | { status: 'empty'; reason: 'no-data' | 'no-matches' }  // different screens
  | { status: 'error'; message: string; retryable: boolean };

function List({ state, onRetry, onClearFilters }: ListProps) {
  switch (state.status) {
    case 'idle':
    case 'loading':
      // Skeleton only because this list's row height is fixed and known.
      return <RowSkeleton count={5} />;

    case 'refreshing':
      // Previous results stay visible; blanking makes every refresh feel slower.
      return <Rows items={state.items} busy />;

    case 'ready':
      return <Rows items={state.items} />;

    case 'empty':
      return state.reason === 'no-matches'
        ? <EmptyState title="No projects match these filters"
                      action={<Button onClick={onClearFilters}>Clear filters</Button>} />
        : <EmptyState title="No projects yet"
                      action={<Button onClick={create}>New project</Button>} />;

    case 'error':
      return <ErrorState message={state.message}
                         action={state.retryable
                           ? <Button onClick={onRetry}>Try again</Button>
                           : undefined} />;
  }
}`,
    },
    {
      kind: 'paragraph',
      text: 'Two details carry most of the quality here. `refreshing` keeps previous results visible, so a re-fetch does not blank the screen. And `retryable` decides whether a retry button appears at all — offering retry on a permission error invites someone to repeat a failure indefinitely.',
    },
    {
      kind: 'paragraph',
      text: 'Delay the loading indicator by roughly 200ms. For fast responses it never appears, which removes the flash that reads as instability.',
    },
  ],

  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'The union from Module 6 is the specification of screens. Eight members means eight designs, and a member with no design is a gap the compiler can point at.',
    },
    {
      kind: 'paragraph',
      text: 'This is the most direct payoff of typing state properly: a design review can walk the union and find the missing screen before a user does.',
    },
  ],

  industryExamples: [
    {
      id: 'example-skeleton-fit',
      source: 'Content-heavy applications',
      title: 'Skeletons only where layout is predictable',
      observation:
        'Products use skeletons for lists and cards of known shape, and plain indicators for content whose structure varies.',
      takeaway:
        'The skeleton is a promise about layout. Only make it where the promise can be kept.',
    },
    {
      id: 'example-empty-state-onboarding',
      source: 'Products with strong first-run experiences',
      title: 'The empty state as the first screen',
      observation:
        'Well-designed applications treat the empty list as an onboarding surface, explaining the feature and offering the first action.',
      takeaway:
        'It is the screen a new user is guaranteed to see, and the one most often left blank.',
    },
  ],

  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Designing every state of a data list.',
    },
    { kind: 'heading', text: '1. Enumerate before designing' },
    {
      kind: 'paragraph',
      text: 'Write the union first. Eight members is normal for a filterable list; fewer usually means something was forgotten.',
    },
    { kind: 'heading', text: '2. Decide skeleton or spinner per surface' },
    {
      kind: 'paragraph',
      text: 'Fixed row height and predictable count, skeleton. Variable structure, a delayed indicator instead.',
    },
    { kind: 'heading', text: '3. Split the two empties' },
    {
      kind: 'paragraph',
      text: 'Nothing exists, and nothing matches. Different copy, different action, both written.',
    },
    { kind: 'heading', text: '4. Split the two errors' },
    {
      kind: 'paragraph',
      text: 'Retryable gets a retry. Terminal gets an explanation and a different route — go back, request access, contact someone.',
    },
    { kind: 'heading', text: '5. Keep content during refresh' },
    {
      kind: 'paragraph',
      text: 'A busy indicator over existing results, not a blank screen. Re-fetching should not feel like starting over.',
    },
    { kind: 'heading', text: '6. Build a state switcher' },
    {
      kind: 'paragraph',
      text: 'A development control that forces each state. Without one, most of them are only seen by accident.',
    },
  ],

  commonMistakes: [
    {
      id: 'mistake-one-empty-state',
      mistake: 'One empty state for both no-data and no-matches.',
      why: 'The actions are opposite — create something versus clear a filter — and one message cannot offer both.',
      instead: 'Design both, and derive which applies.',
    },
    {
      id: 'mistake-skeleton-mismatch',
      mistake: 'A skeleton that does not match the arriving content.',
      why: 'It creates the layout shift it was meant to prevent, and the false promise is visible.',
      instead: 'Use skeletons only where layout is genuinely predictable.',
    },
    {
      id: 'mistake-blank-on-refresh',
      mistake: 'Clearing results while re-fetching.',
      why: 'Every refresh feels like a full load, and the user loses their place in content they were reading.',
      instead: 'Keep previous results visible with a busy indicator.',
    },
    {
      id: 'mistake-retry-terminal',
      mistake: 'Offering retry on every error.',
      why: 'A permission or not-found error will never succeed, so retry invites repeated failure with no explanation.',
      instead: 'Distinguish retryable from terminal and offer a different route for each.',
    },
  ],

  eliteConsiderations: [
    {
      kind: 'list',
      items: [
        'Build a state switcher into development builds; states you cannot trigger on demand are states nobody reviews.',
        'Delay loading indicators by about 200ms so fast responses never flash one.',
        'Announce state changes in a live region — an async transition is silent to a screen reader otherwise.',
        'Write error copy that names the next action, and log the technical detail separately.',
      ],
    },
  ],

  practicalExercise: {
    id: 'exercise-11-01',
    title: 'Design every state of a data list',
    prompt:
      'Design and build every state a filterable data list can occupy.',
    steps: [
      'Write the state union before designing anything.',
      'Decide skeleton, delayed indicator, or nothing for each loading case, and justify it.',
      'Design both empty states with distinct copy and distinct actions.',
      'Design both error states, with retry only where retry can succeed.',
      'Keep previous results visible during a refresh.',
      'Delay the loading indicator so fast responses do not flash it.',
      'Build a development control that forces each state.',
      'Announce every state change in a live region.',
    ],
    successCriteria: [
      'Every union member has a designed screen.',
      'The two empty states have different copy and different actions.',
      'Retry appears only on retryable errors.',
      'Refreshing keeps previous content visible.',
      'Each state can be triggered on demand in development.',
    ],
    estimatedMinutes: 50,
    hint: 'Count your states before you design. If the list has fewer than seven members, something was left out.',
  },

  reflectionQuestion: 'When is a skeleton worse than a spinner?',
  reflectionHint: 'Skeletons imply layout knowledge.',

  resources: [
    {
      id: 'resource-nngroup-progress',
      title: 'Progress indicators make a wait less painful',
      url: 'https://www.nngroup.com/articles/progress-indicators/',
      type: 'article',
      estimatedMinutes: 15,
      note: 'Which indicator is appropriate at which duration.',
    },
    {
      id: 'resource-empty-states',
      title: 'Empty states',
      url: 'https://www.nngroup.com/articles/empty-state-interface-design/',
      type: 'article',
      estimatedMinutes: 15,
      note: 'The empty screen treated as a designed surface.',
    },
  ],

  competencyTags: [
    'product-thinking',
    'accessibility',
    'async-systems',
    'interface-state-modelling',
  ],

  completionCriteria: [
    'Every state of a data list is designed and buildable on demand.',
    'Both empty states and both error states are distinct.',
    'Refresh preserves previous content.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Lesson 52                                                                   */
/* -------------------------------------------------------------------------- */

const LESSON_52: Lesson = {
  id: 'lesson-11-02',
  slug: 'optimistic-updates',
  moduleId: MODULE_ID,
  lessonNumber: 2,
  title: 'Optimistic Updates',
  summary:
    'Showing success before it is confirmed trades correctness for immediacy. That trade is right for some actions and dishonest for others.',
  estimatedMinutes: 9,

  objectives: [
    'Apply a predicted result and reconcile it with the confirmed one.',
    'Roll back cleanly, including when several updates overlap.',
    'Judge an action by consequence and reversibility.',
    'Communicate a pending state without claiming completion.',
  ],

  prerequisiteConcepts: ['Async states', 'State ownership'],
  prerequisiteLessonIds: ['lesson-11-01', 'lesson-08-05'],

  recap: [
    {
      kind: 'paragraph',
      text: 'Every state so far has been honest about what the system knows. An optimistic update deliberately shows something the system has not yet confirmed.',
    },
  ],

  coreConcept: [
    {
      kind: 'paragraph',
      text: 'An optimistic update applies the expected result immediately, sends the request, and either keeps the change on success or reverses it on failure. The interface responds in the frame the user acted, rather than after a round trip.',
    },
    {
      kind: 'list',
      items: [
        'Predict — apply the expected result and record what it replaced.',
        'Send — issue the request with the change already visible.',
        'Confirm — replace the prediction with the server\'s version.',
        'Roll back — restore the recorded previous value and explain what happened.',
      ],
    },
    {
      kind: 'paragraph',
      text: 'The prediction must be stored separately from confirmed data. Mutating the confirmed copy leaves nothing to restore, and rollback becomes a second guess about what the value used to be.',
    },
    {
      kind: 'callout',
      tone: 'warning',
      body: 'Optimism is a claim about the world. If the claim is wrong and the user has already acted on it, the interface has misled them.',
    },
  ],

  firstPrinciples: [
    {
      kind: 'paragraph',
      text: 'The decision rests on two things: how bad it is if the claim turns out false, and how easy it is to undo. A failed like is noticed and forgotten. A message shown as sent but never delivered can cost someone a relationship, and no rollback recovers that.',
    },
    {
      kind: 'paragraph',
      text: 'So the test is not "how often does this fail" but "what happens the time it does". Rare failures with severe consequences are exactly the case where optimism is wrong.',
    },
  ],

  designPerspective: [
    {
      kind: 'paragraph',
      text: 'There is a middle position that is often the right one: optimistic about placement, honest about status. A message appears immediately in the thread, marked pending, and becomes confirmed when the server agrees.',
    },
    {
      kind: 'paragraph',
      text: 'The user gets immediacy and the interface never claims something it does not know. When it fails, the failure attaches to the specific item rather than arriving as a disconnected toast.',
    },
  ],

  engineeringPerspective: [
    {
      kind: 'code',
      language: 'ts',
      caption: 'Prediction kept separate, so rollback is exact.',
      code: `async function toggleFavourite(id: string) {
  const previous = confirmed.get(id);          // record what we are replacing
  pending.set(id, { favourite: !previous?.favourite });
  render();

  try {
    const result = await api.setFavourite(id, !previous?.favourite);
    confirmed.set(id, result);                 // server's version wins
  } catch (error) {
    // Restore exactly what was there, not a guess at what it should be.
    if (previous) confirmed.set(id, previous);
    notify('Could not update favourite. Your change was undone.');
  } finally {
    pending.delete(id);
    render();
  }
}`,
    },
    {
      kind: 'paragraph',
      text: 'Overlapping updates to the same item are the subtle failure. If a user toggles three times quickly, three requests are in flight and their responses may arrive out of order. Either serialise per item, or tag each request and ignore responses that are not the latest.',
    },
  ],

  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'This is Lesson 1\'s reflection question again — should renaming update optimistically or wait for confirmation — now with a mechanism attached.',
    },
    {
      kind: 'paragraph',
      text: 'The answer is the same both times, and it is a product decision rather than a technical one: what does it cost the user if we show success and it was not true?',
    },
  ],

  industryExamples: [
    {
      id: 'example-pending-messages',
      source: 'Messaging applications',
      title: 'Immediate placement, honest status',
      observation:
        'Messages appear instantly in a pending state and are marked sent only on confirmation, with a visible failure affordance on the message itself.',
      takeaway:
        'Optimism about position and honesty about status gives immediacy without a false claim.',
    },
    {
      id: 'example-no-optimism-payments',
      source: 'Payment and irreversible flows',
      title: 'Confirmation required before success is shown',
      observation:
        'Financial and destructive operations wait for server confirmation and show explicit progress rather than predicting the outcome.',
      takeaway:
        'Where rollback cannot restore the real-world consequence, optimism is not available.',
    },
  ],

  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Implementing optimistic favouriting.',
    },
    { kind: 'heading', text: '1. Grade the action' },
    {
      kind: 'paragraph',
      text: 'Favouriting is low consequence and fully reversible. This is the clearest case for optimism.',
    },
    { kind: 'heading', text: '2. Separate confirmed from pending' },
    {
      kind: 'paragraph',
      text: 'Two structures. The predicted value never overwrites the confirmed one.',
    },
    { kind: 'heading', text: '3. Record the previous value' },
    {
      kind: 'paragraph',
      text: 'Rollback restores exactly what was there, not a recomputed guess.',
    },
    { kind: 'heading', text: '4. Handle overlap' },
    {
      kind: 'paragraph',
      text: 'Toggle rapidly. Serialise per item or discard stale responses. Verify the final state matches the final intent.',
    },
    { kind: 'heading', text: '5. Attach failure to the item' },
    {
      kind: 'paragraph',
      text: 'The affected row shows the reversal. A disconnected toast leaves the user hunting for what changed back.',
    },
    { kind: 'heading', text: '6. Test on a failing network' },
    {
      kind: 'paragraph',
      text: 'Force failures and throttle. Rollback paths are the ones never exercised in normal development.',
    },
  ],

  commonMistakes: [
    {
      id: 'mistake-mutate-confirmed',
      mistake: 'Applying the prediction to the confirmed data.',
      why: 'The previous value is gone, so rollback has to guess what to restore.',
      instead: 'Keep prediction and confirmation separate.',
    },
    {
      id: 'mistake-optimistic-irreversible',
      mistake: 'Predicting success for an irreversible action.',
      why: 'Rollback restores the interface but not the consequence the user already acted on.',
      instead: 'Wait for confirmation where reversal cannot restore the real outcome.',
    },
    {
      id: 'mistake-overlapping-updates',
      mistake: 'Ignoring overlapping updates to the same item.',
      why: 'Out-of-order responses leave the item in a state that matches neither intent.',
      instead: 'Serialise per item, or discard responses that are not the latest.',
    },
    {
      id: 'mistake-disconnected-failure',
      mistake: 'Reporting a rollback with a generic toast.',
      why: 'The user cannot tell which item reverted or what to do about it.',
      instead: 'Attach the failure to the affected item.',
    },
  ],

  eliteConsiderations: [
    {
      kind: 'list',
      items: [
        'Prefer pending states over predicted success wherever the action has any weight.',
        'Retry automatically once before surfacing a failure for genuinely transient errors.',
        'Announce rollbacks in a live region; a silent reversal is invisible to a screen reader.',
        'Test the failure path deliberately — it is the path development never exercises.',
      ],
    },
  ],

  practicalExercise: {
    id: 'exercise-11-02',
    title: 'Implement optimistic favouriting',
    prompt:
      'Build optimistic favouriting with exact rollback and correct handling of overlapping updates.',
    steps: [
      'Justify in writing why this action is suitable for optimism.',
      'Keep confirmed and pending state in separate structures.',
      'Record the previous value before applying the prediction.',
      'Replace the prediction with the server\'s version on success.',
      'Restore the recorded value exactly on failure.',
      'Toggle rapidly and confirm the final state matches the final intent.',
      'Attach failure messaging to the affected item.',
      'Announce rollbacks in a live region and test with forced failures.',
    ],
    successCriteria: [
      'Confirmed data is never mutated by a prediction.',
      'Rollback restores the exact previous value.',
      'Rapid toggling ends in the state the user last intended.',
      'Failures are shown on the affected item, not as a generic toast.',
      'The failure path was tested deliberately.',
    ],
    estimatedMinutes: 45,
    hint: 'Toggle five times fast on a throttled connection. That is where the ordering bug lives.',
  },

  reflectionQuestion: 'Which actions should avoid optimistic UI?',
  reflectionHint: 'Consider consequence and reversibility.',

  resources: [
    {
      id: 'resource-optimistic-ui',
      title: 'React: optimistic updates',
      url: 'https://react.dev/reference/react/useOptimistic',
      type: 'documentation',
      estimatedMinutes: 15,
      note: 'The mechanism, including how the confirmed value replaces the prediction.',
    },
    {
      id: 'resource-response-times',
      title: 'Response times: the three important limits',
      url: 'https://www.nngroup.com/articles/response-times-3-important-limits/',
      type: 'article',
      estimatedMinutes: 10,
      note: 'Why immediacy matters enough to consider this trade at all.',
    },
  ],

  competencyTags: ['product-judgement', 'async-systems', 'interface-state-modelling'],

  completionCriteria: [
    'Has implemented optimistic updates with exact rollback.',
    'Overlapping updates resolve to the final intent.',
    'The failure path was tested deliberately.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Lesson 53                                                                   */
/* -------------------------------------------------------------------------- */

const LESSON_53: Lesson = {
  id: 'lesson-11-03',
  slug: 'tables-and-dense-information',
  moduleId: MODULE_ID,
  lessonNumber: 3,
  title: 'Tables and Dense Information',
  summary:
    'A table is a comparison instrument. Everything in its design either helps the eye run down a column or gets in the way.',
  estimatedMinutes: 9,

  objectives: [
    'Align columns by the comparison each supports.',
    'Format numeric data so magnitudes are comparable at a glance.',
    'Place row actions without destroying density.',
    'Make a table usable on a narrow screen without losing its purpose.',
  ],

  prerequisiteConcepts: ['Typography', 'Layout', 'Semantic HTML'],
  prerequisiteLessonIds: ['lesson-02-03', 'lesson-03-01'],

  recap: [
    {
      kind: 'paragraph',
      text: 'Module 3 established that a table must be a real table for assistive technology. This lesson is about what makes one readable.',
    },
  ],

  coreConcept: [
    {
      kind: 'paragraph',
      text: 'People do not read tables; they scan columns. Every design decision should be judged by whether it helps a vertical scan.',
    },
    {
      kind: 'list',
      items: [
        'Numbers right-aligned, tabular figures, consistent decimal places — magnitudes line up.',
        'Text left-aligned, with a consistent start position so the eye has a rail.',
        'Dates in one format, aligned consistently, never a mix of relative and absolute.',
        'Headers aligned with their column, not independently.',
      ],
    },
    {
      kind: 'paragraph',
      text: 'Right-aligning numbers with tabular figures means the hundreds column sits above the hundreds column. The relative size of two values becomes visible as a shape rather than something to read digit by digit.',
    },
    {
      kind: 'callout',
      tone: 'insight',
      body: 'Density is the point of a table. Anything that adds height per row reduces how much can be compared without scrolling.',
    },
  ],

  firstPrinciples: [
    {
      kind: 'paragraph',
      text: 'Row actions create a direct conflict. Always-visible buttons cost horizontal space and add visual noise to every row, while hover-revealed actions cost nothing until needed but are invisible on touch and unreachable without a pointer.',
    },
    {
      kind: 'paragraph',
      text: 'The workable resolution: the primary action is always visible, secondary actions live behind a menu that is always present, and everything is reachable by keyboard whether or not it is currently visible.',
    },
  ],

  designPerspective: [
    {
      kind: 'paragraph',
      text: 'Responsive behaviour is where most tables fail. Making a table scroll horizontally on a phone is the honest option; collapsing each row into a stacked card destroys the column relationship that made it a table.',
    },
    {
      kind: 'paragraph',
      text: 'If comparison is the purpose, horizontal scroll with a pinned identifying column preserves it. If comparison is not the purpose, the data was probably a list.',
    },
  ],

  engineeringPerspective: [
    {
      kind: 'code',
      language: 'css',
      caption: 'The three rules that do most of the work.',
      code: `/* Digits of equal width, so columns of numbers align vertically. */
.table { font-variant-numeric: tabular-nums; }

/* Numeric columns right-aligned; the decimal point becomes the rail. */
.table td[data-type='number'],
.table th[data-type='number'] { text-align: right; }

/* The identifying column stays visible during horizontal scroll. */
.table__scroll { overflow-x: auto; }
.table th[scope='row'] {
  position: sticky;
  inset-inline-start: 0;
  background: var(--color-surface);
}`,
    },
    {
      kind: 'paragraph',
      text: 'The scroll container needs `tabindex="0"` and an accessible name so keyboard users can scroll it. A scrollable region that cannot be focused is unreachable without a pointer, which is a common and invisible failure.',
    },
  ],

  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'Tabular figures are a typographic feature with a functional consequence. A designer specifying a typeface without them has decided that numeric columns will not align, usually without realising it.',
    },
    {
      kind: 'paragraph',
      text: 'This is a good example of a decision that is invisible in a mockup with placeholder numbers and obvious with real data.',
    },
  ],

  industryExamples: [
    {
      id: 'example-financial-tables',
      source: 'Financial interfaces',
      title: 'Alignment as the primary tool',
      observation:
        'Financial tables right-align every numeric column, use tabular figures, and fix decimal places per column.',
      takeaway:
        'The conventions exist because comparison accuracy is the entire purpose of the surface.',
    },
    {
      id: 'example-sticky-identifier',
      source: 'Data-heavy products',
      title: 'The identifying column pinned',
      observation:
        'Wide tables keep the name or identifier column fixed while the rest scrolls horizontally.',
      takeaway:
        'Without it, a user scrolled three columns right has no idea which row they are reading.',
    },
  ],

  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Building a transaction table.',
    },
    { kind: 'heading', text: '1. Identify the comparison' },
    {
      kind: 'paragraph',
      text: 'What will someone scan for? Largest amount, most recent, failed transactions. That determines column order and alignment.',
    },
    { kind: 'heading', text: '2. Set alignment by type' },
    {
      kind: 'paragraph',
      text: 'Amounts right with tabular figures and fixed decimals. Descriptions left. Dates in one format.',
    },
    { kind: 'heading', text: '3. Establish row rhythm' },
    {
      kind: 'paragraph',
      text: 'Consistent height, enough padding to separate, not so much that comparison requires scrolling.',
    },
    { kind: 'heading', text: '4. Resolve the actions conflict' },
    {
      kind: 'paragraph',
      text: 'Primary action visible, secondary behind a persistent menu, everything keyboard-reachable.',
    },
    { kind: 'heading', text: '5. Handle overflow honestly' },
    {
      kind: 'paragraph',
      text: 'Horizontal scroll with the identifier pinned, the container focusable and named.',
    },
    { kind: 'heading', text: '6. Test with real data' },
    {
      kind: 'paragraph',
      text: 'Very long descriptions, negative amounts, zero, missing values, a thousand rows. Placeholder data proves nothing.',
    },
  ],

  commonMistakes: [
    {
      id: 'mistake-centered-numbers',
      mistake: 'Centring numeric columns.',
      why: 'Digits no longer align, so relative magnitude has to be read rather than seen.',
      instead: 'Right-align numbers and use tabular figures.',
    },
    {
      id: 'mistake-hover-only-actions',
      mistake: 'Revealing row actions only on hover.',
      why: 'They are invisible on touch and unreachable without a pointer.',
      instead: 'Keep a persistent affordance and ensure keyboard access regardless of visibility.',
    },
    {
      id: 'mistake-card-collapse',
      mistake: 'Collapsing table rows into stacked cards on mobile.',
      why: 'The column relationship disappears, which is the thing that made it a table.',
      instead: 'Scroll horizontally with the identifying column pinned.',
    },
    {
      id: 'mistake-unfocusable-scroll',
      mistake: 'A horizontally scrollable region with no focusability.',
      why: 'Keyboard users cannot scroll it, so the hidden columns are unreachable.',
      instead: 'Give the container `tabindex="0"` and an accessible name.',
    },
  ],

  eliteConsiderations: [
    {
      kind: 'list',
      items: [
        'Fix decimal places per column; ragged precision defeats vertical alignment.',
        'Use zebra striping only on wide tables where the eye can lose the row; on narrow ones it is noise.',
        'Right-align the header of a right-aligned column — a mismatch is immediately visible.',
        'Test with one row, zero rows, and a thousand; each reveals a different defect.',
      ],
    },
  ],

  practicalExercise: {
    id: 'exercise-11-03',
    title: 'Build a transaction table',
    prompt:
      'Build a dense, scannable transaction table that works with real data and on a narrow screen.',
    steps: [
      'Identify the comparison the table exists to support.',
      'Set alignment by data type, with tabular figures on numeric columns.',
      'Fix decimal places per column.',
      'Establish consistent row height and rhythm.',
      'Make the primary action visible and secondary actions persistent behind a menu.',
      'Implement horizontal scroll with the identifying column pinned and the container focusable.',
      'Test with long text, negative values, zero, missing data, and a thousand rows.',
      'Verify every action is reachable by keyboard alone.',
    ],
    successCriteria: [
      'Numeric columns are right-aligned with tabular figures and fixed decimals.',
      'Row actions are reachable by keyboard and visible on touch.',
      'The narrow-screen version preserves column comparison.',
      'The scroll container is focusable and named.',
      'The table holds with a thousand rows and with none.',
    ],
    estimatedMinutes: 55,
    hint: 'Turn on tabular figures and look at a numeric column before and after. The difference is the lesson.',
  },

  reflectionQuestion: 'Should every row action remain visible?',
  reflectionHint: 'Visibility competes with density.',

  resources: [
    {
      id: 'resource-mdn-font-variant-numeric',
      title: 'MDN: font-variant-numeric',
      url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/font-variant-numeric',
      type: 'documentation',
      estimatedMinutes: 10,
      note: 'Tabular figures and the other numeric variants.',
    },
    {
      id: 'resource-apg-table',
      title: 'ARIA Authoring Practices: table',
      url: 'https://www.w3.org/WAI/ARIA/apg/patterns/table/',
      type: 'specification',
      estimatedMinutes: 20,
      note: 'Structure and navigation expectations for tabular data.',
    },
  ],

  competencyTags: ['visual-hierarchy', 'typography', 'layout', 'accessibility'],

  completionCriteria: [
    'Has built a dense table with type-appropriate alignment.',
    'Row actions are keyboard-reachable and touch-visible.',
    'The narrow-screen version preserves comparison.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Lesson 54                                                                   */
/* -------------------------------------------------------------------------- */

const LESSON_54: Lesson = {
  id: 'lesson-11-04',
  slug: 'search-filters-sorting-and-pagination',
  moduleId: MODULE_ID,
  lessonNumber: 4,
  title: 'Search, Filters, Sorting and Pagination',
  summary:
    'Query controls are a system. Whether a filter applies instantly or on submit is decided by what each query costs.',
  estimatedMinutes: 9,

  objectives: [
    'Model query state as one object rather than several independent controls.',
    'Choose between instant and applied filtering from query cost.',
    'Report result counts honestly, including during loading.',
    'Select a pagination strategy that matches how the data is used.',
  ],

  prerequisiteConcepts: ['State ownership', 'Async states'],
  prerequisiteLessonIds: ['lesson-11-03', 'lesson-08-05'],

  recap: [
    {
      kind: 'paragraph',
      text: 'The table displays results. This lesson is about the controls that decide which results exist.',
    },
  ],

  coreConcept: [
    {
      kind: 'paragraph',
      text: 'Search, filters, sort, and page are not four independent controls. They form one query, and treating them separately produces the classic bug where changing a filter leaves you on page seven of a three-page result.',
    },
    {
      kind: 'list',
      items: [
        'Query — search text, active filters, sort field and direction, page.',
        'Changing anything except page resets the page to one.',
        'Result count reflects the current query, and says so while loading.',
        'Reset returns to a defined default, not to nothing.',
      ],
    },
    {
      kind: 'paragraph',
      text: 'Instant versus applied is the central decision. Instant feedback is better when the query is cheap and the result is legible immediately. An Apply button is better when the query is expensive, when several filters are usually changed together, or when partial states would produce confusing intermediate results.',
    },
    {
      kind: 'callout',
      tone: 'insight',
      body: 'Instant filtering on an expensive query means every intermediate selection costs a request the user never wanted.',
    },
  ],

  firstPrinciples: [
    {
      kind: 'paragraph',
      text: 'Setting five filters with instant application issues five queries, of which four are discarded. On a cheap local filter that is free; on a server query over a large dataset it is four times the load and four intermediate result sets the user watches flicker past.',
    },
    {
      kind: 'paragraph',
      text: 'Debouncing helps text input, where the user is producing a continuous stream. It does not help discrete selections, because each click is a complete intent and delaying it just makes the interface feel slow.',
    },
  ],

  designPerspective: [
    {
      kind: 'paragraph',
      text: 'Active filters must be visible and individually removable. A filter panel that is closed while three filters are applied produces the most common support question in data products: why can I not find my record.',
    },
    {
      kind: 'paragraph',
      text: 'Filter chips solve it — each active constraint shown, each removable, with a clear-all alongside. The state is legible without opening anything.',
    },
  ],

  engineeringPerspective: [
    {
      kind: 'code',
      language: 'ts',
      caption: 'One query object, with page reset made structural.',
      code: `interface Query {
  search: string;
  filters: { status?: Status[]; owner?: string; range?: DateRange };
  sort: { field: SortField; direction: 'asc' | 'desc' };
  page: number;
}

const DEFAULT_QUERY: Query = {
  search: '',
  filters: {},
  sort: { field: 'updatedAt', direction: 'desc' },
  page: 1,
};

// Every change except paging resets the page. Enforced here, so no caller
// can forget it — which is where the "page 7 of 3 pages" bug comes from.
function updateQuery(current: Query, change: Partial<Query>): Query {
  const next = { ...current, ...change };
  return 'page' in change ? next : { ...next, page: 1 };
}`,
    },
    {
      kind: 'paragraph',
      text: 'Pagination strategy follows use. Numbered pages suit data people navigate deliberately and return to. Infinite scroll suits browsing but makes a specific item unreachable by address and breaks the browser\'s back behaviour. Load-more sits between them and keeps position stable.',
    },
  ],

  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'The instant-versus-apply decision cannot be made from a design file, because it depends on query cost, which is an implementation fact. It also cannot be made from the implementation alone, because it depends on how people use the filters.',
    },
    {
      kind: 'paragraph',
      text: 'It is exactly the kind of decision that needs both perspectives in the same head, which is what this course is for.',
    },
  ],

  industryExamples: [
    {
      id: 'example-filter-chips',
      source: 'Data-heavy products',
      title: 'Active filters shown as removable chips',
      observation:
        'Products with complex filtering display each active constraint as a chip outside the filter panel, individually removable.',
      takeaway:
        'The current query is legible without opening anything, which prevents the commonest confusion in these interfaces.',
    },
    {
      id: 'example-apply-expensive',
      source: 'Analytics and reporting tools',
      title: 'Apply where queries are expensive',
      observation:
        'Tools running costly aggregations batch filter changes behind an explicit Apply, often with a count of pending changes.',
      takeaway:
        'The user selects a complete intent rather than paying for every intermediate state.',
    },
  ],

  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Creating a filterable dataset.',
    },
    { kind: 'heading', text: '1. Model the query as one object' },
    {
      kind: 'paragraph',
      text: 'Search, filters, sort, page. One shape, one update function.',
    },
    { kind: 'heading', text: '2. Make page reset structural' },
    {
      kind: 'paragraph',
      text: 'Enforced in the update function so no caller can forget it.',
    },
    { kind: 'heading', text: '3. Decide instant or applied, with a reason' },
    {
      kind: 'paragraph',
      text: 'Measure the query. Cheap and local, instant. Expensive or multi-filter, Apply with a pending count.',
    },
    { kind: 'heading', text: '4. Debounce text, not selections' },
    {
      kind: 'paragraph',
      text: 'Around 200ms for search input. Discrete selections apply on click.',
    },
    { kind: 'heading', text: '5. Show active filters as chips' },
    {
      kind: 'paragraph',
      text: 'Each removable, with clear-all. Visible whether or not the panel is open.',
    },
    { kind: 'heading', text: '6. Report counts honestly' },
    {
      kind: 'paragraph',
      text: '"14 of 230 projects", and during loading say so rather than showing a stale number as if it were current.',
    },
  ],

  commonMistakes: [
    {
      id: 'mistake-page-not-reset',
      mistake: 'Not resetting the page when filters change.',
      why: 'The user lands on a page beyond the new result set and sees nothing.',
      instead: 'Reset the page in the update function so it cannot be forgotten.',
    },
    {
      id: 'mistake-hidden-filters',
      mistake: 'Active filters visible only inside a closed panel.',
      why: 'The user cannot tell why results are missing and assumes the data is gone.',
      instead: 'Show active filters as removable chips outside the panel.',
    },
    {
      id: 'mistake-instant-expensive',
      mistake: 'Applying expensive queries instantly.',
      why: 'Every intermediate selection costs a request, and results flicker through states nobody wanted.',
      instead: 'Batch behind Apply when the query is costly.',
    },
    {
      id: 'mistake-stale-count',
      mistake: 'Showing the previous result count while loading.',
      why: 'The number appears to describe the current query and does not.',
      instead: 'Indicate that the count is being recalculated.',
    },
  ],

  eliteConsiderations: [
    {
      kind: 'list',
      items: [
        'Keep previous results visible while the new query runs; blanking makes every filter change feel slow.',
        'Announce result counts in a live region — the change is silent otherwise.',
        'Make Reset return to a defined default rather than clearing everything to nothing.',
        'Prefer load-more over infinite scroll where position and addressability matter.',
      ],
    },
  ],

  practicalExercise: {
    id: 'exercise-11-04',
    title: 'Create a filterable dataset',
    prompt:
      'Build search, filters, sorting, and pagination as one coherent query system.',
    steps: [
      'Model the query as a single object with one update function.',
      'Enforce page reset inside that function.',
      'Measure your query cost and decide instant or applied, recording the reason.',
      'Debounce text input; apply discrete selections immediately.',
      'Show active filters as individually removable chips.',
      'Report result counts, and indicate when a count is being recalculated.',
      'Keep previous results visible while a new query runs.',
      'Implement Reset returning to a defined default.',
      'Announce count changes in a live region.',
    ],
    successCriteria: [
      'Changing a filter never leaves the user on an out-of-range page.',
      'Active filters are visible and removable without opening a panel.',
      'The instant-versus-apply decision is written down with its reason.',
      'Counts are never stale-but-presented-as-current.',
      'Reset returns to a defined default state.',
    ],
    estimatedMinutes: 55,
    hint: 'Put the page reset inside the update function. Relying on every caller to remember it is how the bug returns.',
  },

  reflectionQuestion:
    'When should filters update instantly versus require Apply?',
  reflectionHint: 'Consider cost and complexity of each query.',

  resources: [
    {
      id: 'resource-nngroup-filters',
      title: 'Filters vs. facets',
      url: 'https://www.nngroup.com/articles/filters-vs-facets/',
      type: 'article',
      estimatedMinutes: 15,
      note: 'Filter behaviour, visibility, and the expectations users bring.',
    },
    {
      id: 'resource-pagination-patterns',
      title: 'Infinite scrolling, pagination or load more',
      url: 'https://www.nngroup.com/articles/infinite-scrolling-tips/',
      type: 'article',
      estimatedMinutes: 15,
      note: 'Trade-offs between the three strategies.',
    },
  ],

  competencyTags: ['interaction-design', 'product-judgement', 'state-modelling'],

  completionCriteria: [
    'Query state is modelled as one object with structural page reset.',
    'Active filters are visible and removable.',
    'The instant-versus-apply decision is justified in writing.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Lesson 55                                                                   */
/* -------------------------------------------------------------------------- */

const LESSON_55: Lesson = {
  id: 'lesson-11-05',
  slug: 'url-state-and-persistence',
  moduleId: MODULE_ID,
  lessonNumber: 5,
  title: 'URL State and Persistence',
  summary:
    'The URL is the only state a user can send to someone else. What you put there decides what can be shared, bookmarked, and returned to.',
  estimatedMinutes: 9,

  objectives: [
    'Decide which state belongs in the URL and which does not.',
    'Serialise query state into parameters that stay readable.',
    'Make browser navigation behave the way users expect.',
    'Handle malformed and outdated URLs without breaking.',
  ],

  prerequisiteConcepts: ['Query state', 'State ownership'],
  prerequisiteLessonIds: ['lesson-11-04'],

  recap: [
    {
      kind: 'paragraph',
      text: 'You have a query object. This lesson is about where it lives, and what changes when it lives in the address bar.',
    },
  ],

  coreConcept: [
    {
      kind: 'paragraph',
      text: 'State in the URL survives a refresh, can be bookmarked, can be sent to a colleague, and participates in browser history. State in memory does none of these. That difference is the entire decision.',
    },
    {
      kind: 'list',
      items: [
        'Belongs in the URL — what is selected, filtered, searched, sorted, which page, which tab.',
        'Does not — draft text, hover state, scroll position, whether a panel is expanded.',
        'Never — anything sensitive. URLs are logged by servers, proxies, and analytics.',
      ],
    },
    {
      kind: 'paragraph',
      text: 'The test is whether another person opening the same URL would benefit from seeing the same thing. A filtered view of failed transactions in March, yes. A half-typed comment, no.',
    },
    {
      kind: 'callout',
      tone: 'warning',
      body: 'A URL received from someone else is untrusted input. Parse it defensively — an unknown filter value should be ignored, not crash the page.',
    },
  ],

  firstPrinciples: [
    {
      kind: 'paragraph',
      text: 'History entries carry a meaning: back should undo something the user considers a step. Pushing an entry for every keystroke of a search makes back require twenty presses to leave the page.',
    },
    {
      kind: 'paragraph',
      text: 'The distinction is push versus replace. Committed changes — applying a filter, changing page, selecting an item — push. Continuous changes — typing — replace, so only the final query is in history.',
    },
  ],

  designPerspective: [
    {
      kind: 'paragraph',
      text: 'A shareable URL changes what the product is for. "Look at these failed transactions" becomes a link instead of a screenshot with instructions, and the recipient sees live data rather than a moment in time.',
    },
    {
      kind: 'paragraph',
      text: 'It also makes URLs readable artefacts. `?status=failed&range=30d` is a sentence someone can understand and edit; `?q=eyJzdGF0dXMiOiJmYWls` is opaque and cannot be adjusted by hand.',
    },
  ],

  engineeringPerspective: [
    {
      kind: 'code',
      language: 'ts',
      caption: 'Readable parameters, defensive parsing, deliberate history.',
      code: `// Only non-default values appear, so the URL stays short and legible.
function toParams(query: Query): URLSearchParams {
  const params = new URLSearchParams();
  if (query.search) params.set('q', query.search);
  if (query.filters.status?.length) params.set('status', query.filters.status.join(','));
  if (query.sort.field !== DEFAULT_QUERY.sort.field) params.set('sort', query.sort.field);
  if (query.page > 1) params.set('page', String(query.page));
  return params;
}

// A URL from elsewhere is untrusted. Unknown values are dropped, not fatal.
function fromParams(params: URLSearchParams): Query {
  const status = (params.get('status') ?? '')
    .split(',')
    .filter((value): value is Status => STATUSES.includes(value as Status));

  return {
    ...DEFAULT_QUERY,
    search: params.get('q') ?? '',
    filters: status.length ? { status } : {},
    page: Math.max(1, Number(params.get('page')) || 1),
  };
}

// Typing replaces; committed changes push.
const commit = (query: Query, kind: 'typing' | 'committed') =>
  router[kind === 'typing' ? 'replace' : 'push'](\`?\${toParams(query)}\`);`,
    },
    {
      kind: 'paragraph',
      text: 'Omitting defaults matters more than it appears. A URL carrying every parameter at its default value is long, hard to read, and impossible to edit by hand — and it makes genuinely non-default values hard to spot.',
    },
  ],

  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'Deciding what deserves a URL is a product decision with an architectural consequence. It determines what can be shared, what survives a refresh, and what the back button does.',
    },
    {
      kind: 'paragraph',
      text: 'It is worth making deliberately per piece of state rather than discovering it later, because retrofitting URL state into an interface built around component state is substantial work.',
    },
  ],

  industryExamples: [
    {
      id: 'example-readable-urls',
      source: 'Products with linkable views',
      title: 'Query parameters that read as sentences',
      observation:
        'Applications with strong sharing keep parameters human-readable, so a URL can be understood and edited without the interface.',
      takeaway:
        'Readability turns the URL into a control surface rather than an opaque token.',
    },
    {
      id: 'example-replace-vs-push',
      source: 'Search interfaces',
      title: 'Typing replaces, submitting pushes',
      observation:
        'Search interfaces replace history while a query is being typed and push only when a result is opened or a filter applied.',
      takeaway:
        'Back then moves between meaningful states rather than through every keystroke.',
    },
  ],

  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Persisting search and filters into URL state.',
    },
    { kind: 'heading', text: '1. Classify every piece of state' },
    {
      kind: 'paragraph',
      text: 'Would another person benefit from opening the same thing? That sorts the list.',
    },
    { kind: 'heading', text: '2. Design the parameter names' },
    {
      kind: 'paragraph',
      text: 'Short, readable, stable. They are a public interface once anyone has bookmarked one.',
    },
    { kind: 'heading', text: '3. Omit defaults' },
    {
      kind: 'paragraph',
      text: 'Only non-default values appear. The clean URL is the default state.',
    },
    { kind: 'heading', text: '4. Parse defensively' },
    {
      kind: 'paragraph',
      text: 'Unknown values dropped, numbers clamped, missing parameters filled from defaults. A hand-edited URL should never crash the page.',
    },
    { kind: 'heading', text: '5. Choose push or replace per change' },
    {
      kind: 'paragraph',
      text: 'Typing replaces. Applying, paging, and selecting push.',
    },
    { kind: 'heading', text: '6. Test the whole navigation surface' },
    {
      kind: 'paragraph',
      text: 'Refresh, back, forward, bookmark, open in a new tab, paste a hand-edited URL. All six should behave sensibly.',
    },
  ],

  commonMistakes: [
    {
      id: 'mistake-push-every-keystroke',
      mistake: 'Pushing a history entry for every keystroke.',
      why: 'Back requires one press per character, so leaving the page becomes impossible in practice.',
      instead: 'Replace while typing; push on committed changes.',
    },
    {
      id: 'mistake-opaque-urls',
      mistake: 'Encoding state as an opaque blob.',
      why: 'The URL cannot be read or edited, and any change to the encoding breaks every saved link.',
      instead: 'Use readable named parameters.',
    },
    {
      id: 'mistake-trusting-url',
      mistake: 'Parsing URL parameters without validation.',
      why: 'A hand-edited or outdated URL can crash the page or produce a nonsensical query.',
      instead: 'Validate, drop unknown values, and fall back to defaults.',
    },
    {
      id: 'mistake-sensitive-in-url',
      mistake: 'Putting personal or sensitive data in the URL.',
      why: 'URLs are logged by servers, proxies, browser history, and analytics, and are shared without thought.',
      instead: 'Keep sensitive values out of the address entirely.',
    },
  ],

  eliteConsiderations: [
    {
      kind: 'list',
      items: [
        'Treat parameter names as a public API; renaming one breaks every bookmark that exists.',
        'Omit defaults so the clean URL means the default view.',
        'Restore scroll position on back, but keep the position itself out of the URL.',
        'Test with a deliberately malformed URL; it is the case nobody writes and users produce constantly.',
      ],
    },
  ],

  practicalExercise: {
    id: 'exercise-11-05',
    title: 'Persist search and filters into URL state',
    prompt:
      'Move query state into the URL so views are shareable, and make browser navigation behave correctly.',
    steps: [
      'Classify every piece of state by whether another person would benefit from it.',
      'Design short, readable, stable parameter names.',
      'Serialise only non-default values.',
      'Parse defensively: drop unknown values, clamp numbers, fall back to defaults.',
      'Use replace while typing and push on committed changes.',
      'Verify refresh, back, forward, bookmark, and new tab all behave sensibly.',
      'Paste a hand-edited and a deliberately malformed URL and confirm neither breaks the page.',
      'Confirm no sensitive value appears in the URL.',
    ],
    successCriteria: [
      'A filtered view can be shared as a link and opens identically.',
      'Back moves between meaningful states, not keystrokes.',
      'A malformed URL degrades to a sensible default without error.',
      'Default values do not appear in the URL.',
      'No sensitive data is present in any parameter.',
    ],
    estimatedMinutes: 50,
    hint: 'Hand-edit the URL to something invalid before you consider this done. That is the input real users produce.',
  },

  reflectionQuestion: 'Which interface states deserve a URL?',
  reflectionHint:
    'Would another person benefit from opening the same state?',

  resources: [
    {
      id: 'resource-mdn-urlsearchparams-11',
      title: 'MDN: URLSearchParams',
      url: 'https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams',
      type: 'documentation',
      estimatedMinutes: 10,
      note: 'Reading and writing query parameters.',
    },
    {
      id: 'resource-mdn-history-api',
      title: 'MDN: History API',
      url: 'https://developer.mozilla.org/en-US/docs/Web/API/History_API',
      type: 'documentation',
      estimatedMinutes: 20,
      note: 'push versus replace, and what each does to the back button.',
    },
  ],

  competencyTags: ['product-thinking', 'state-modelling', 'browser-apis', 'architecture'],

  completionCriteria: [
    'Query state lives in readable URL parameters.',
    'Browser navigation moves between meaningful states.',
    'Malformed URLs degrade without error.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Project                                                                     */
/* -------------------------------------------------------------------------- */

const PROJECT: ModuleProject = {
  id: 'project-11',
  slug: 'analytics-dashboard',
  moduleId: MODULE_ID,
  title: 'Analytics Dashboard',
  brief:
    'Build an analytics dashboard with a data table, filters, search, complete async states, URL-backed query state, and responsive behaviour.',
  problem:
    'A dashboard is where every weakness in async handling becomes visible at once. Several requests are in flight, filters change while results are loading, the table has to stay scannable as numbers change, and a colleague needs to be sent a link to exactly what you are looking at. Building one that is correct under a slow connection is a different exercise from building one that looks right with fixture data.',
  objectives: [
    'Handle every async state across several concurrent data sources.',
    'Build a dense table that stays scannable with real data.',
    'Make every view addressable through the URL.',
    'Keep the dashboard usable on a narrow screen without losing comparison.',
  ],
  requirements: [
    'A data table with sorting and row actions.',
    'Filters and search forming one coherent query.',
    'Loading, empty, no-matches, and both error states.',
    'Query state persisted in the URL and shareable.',
    'Responsive behaviour that preserves column comparison.',
    'Result counts that are never stale-but-presented-as-current.',
  ],
  constraints: [
    'No data-table library; build the table.',
    'Every async state must be reachable on demand in development.',
    'Previous results must stay visible while a new query runs.',
    'No sensitive value may appear in the URL.',
  ],
  suggestedScope:
    'One dashboard with one table and three or four summary figures, backed by local data with simulated latency and failure. No real backend, no authentication, no charting library.',
  deliverables: [
    'The working dashboard across desktop and narrow widths.',
    'A state inventory listing every async state and how to trigger it.',
    'A note recording the instant-versus-apply decision and its reason.',
    'Evidence of testing under network throttling and forced failures.',
  ],
  completionCriteria: [
    'Every async state is designed and reachable on demand.',
    'A filtered view can be shared as a link and opens identically.',
    'Changing a filter never leaves the user on an out-of-range page.',
    'The table stays scannable with a thousand rows and with none.',
    'No stale result or loading flash occurs under network throttling.',
  ],
  portfolioEvidence: [
    'Complete async state coverage',
    'Dense table design',
    'Query state architecture',
    'URL state and shareability',
    'Behaviour under adverse network conditions',
  ],
  reflectionQuestion:
    'Which state was hardest to reach deliberately, and what does that say about how often users encounter it unprepared?',
  estimatedHours: 24,
  competencies: [
    'layout',
    'responsive-design',
    'accessibility',
    'state-modelling',
    'async-systems',
    'interface-state-modelling',
  ],
  stretchGoals: [
    'Add optimistic row actions with exact rollback and per-row failure messaging.',
    'Add saved views: named queries stored locally and restorable as URLs.',
  ],
};

/* -------------------------------------------------------------------------- */

export const MODULE_11: CurriculumModule = {
  id: MODULE_ID,
  slug: 'async-product-states-and-data-interfaces',
  moduleNumber: 11,
  phase: 'interaction-and-motion',
  title: 'Async Product States and Data Interfaces',
  description:
    'The full set of states a data-backed surface can occupy, optimistic updates and their limits, dense tables, query controls, and the URL as shareable state.',
  outcome: 'Can build data interfaces that stay honest under real conditions.',
  prerequisites: [
    'Modules 1 to 10, or equivalent',
    'Comfortable with React state and async JavaScript',
  ],
  lessons: [LESSON_51, LESSON_52, LESSON_53, LESSON_54, LESSON_55],
  resources: [
    {
      id: 'resource-module-11-nngroup-response',
      title: 'Response times: the three important limits',
      url: 'https://www.nngroup.com/articles/response-times-3-important-limits/',
      type: 'article',
      estimatedMinutes: 15,
      note: 'The thresholds that make waiting states necessary at all.',
    },
    {
      id: 'resource-module-11-apg-table',
      title: 'ARIA Authoring Practices: table and grid',
      url: 'https://www.w3.org/WAI/ARIA/apg/patterns/grid/',
      type: 'specification',
      estimatedMinutes: 40,
      note: 'Structure and keyboard navigation for interactive tabular data.',
    },
    {
      id: 'resource-module-11-history',
      title: 'MDN: History API',
      url: 'https://developer.mozilla.org/en-US/docs/Web/API/History_API',
      type: 'documentation',
      estimatedMinutes: 25,
      note: 'The mechanics behind shareable, navigable view state.',
    },
  ],
  project: PROJECT,
  competencies: [
    'product-thinking',
    'visual-hierarchy',
    'typography',
    'layout',
    'responsive-design',
    'interaction-design',
    'accessibility',
    'product-judgement',
    'state-modelling',
    'browser-apis',
    'async-systems',
    'architecture',
    'interface-state-modelling',
  ],
  completionCriteria: [
    'All five lessons completed.',
    'Module project marked completed.',
    'Can build a data interface that holds up under adverse conditions.',
  ],
};
