/**
 * Module 15 — AI-Assisted Design Engineering and Capstone.
 *
 * Delegation with retained judgement, giving an agent the context it needs,
 * reviewing generated code, design-to-code workflows, and shipping work in a
 * form that proves ability.
 */

import type { CurriculumModule, Lesson, ModuleProject } from '@/types/curriculum';

const MODULE_ID = 'module-15';

/* -------------------------------------------------------------------------- */
/* Lesson 71                                                                   */
/* -------------------------------------------------------------------------- */

const LESSON_71: Lesson = {
  id: 'lesson-15-01',
  slug: 'ai-as-an-implementation-partner',
  moduleId: MODULE_ID,
  lessonNumber: 1,
  title: 'AI as an Implementation Partner',
  summary:
    'Delegation requires a specification and a verification step. Without both, you have transferred the work and kept the responsibility.',
  estimatedMinutes: 9,

  objectives: [
    'Decide what can be delegated and what cannot.',
    'Write a specification precise enough to be verifiable.',
    'State constraints that would otherwise be assumed.',
    'Verify output against the specification rather than against plausibility.',
  ],

  prerequisiteConcepts: ['Component APIs', 'Testing', 'Design QA'],
  prerequisiteLessonIds: ['lesson-08-02', 'lesson-13-05'],

  recap: [
    {
      kind: 'paragraph',
      text: 'Everything in this course has been about judgement: what to build, where state lives, what a boundary is for. This module is about keeping that judgement while delegating execution.',
    },
  ],

  coreConcept: [
    {
      kind: 'paragraph',
      text: 'Delegation has three parts and fails when any one is missing: a specification saying what is wanted, constraints saying what must hold, and verification confirming both.',
    },
    {
      kind: 'list',
      items: [
        'Specification — behaviour, API, states, and acceptance criteria.',
        'Constraints — the conventions, tokens, and patterns the codebase already uses.',
        'Verification — checking the output against the specification, not against how reasonable it looks.',
      ],
    },
    {
      kind: 'paragraph',
      text: 'Generated code is fluent by construction, which is exactly what makes verification hard. It reads well, uses plausible names, and follows recognisable patterns — and none of that is evidence that it does what was asked.',
    },
    {
      kind: 'callout',
      tone: 'warning',
      body: 'Output quality and judgement quality are different things. Code can be idiomatic, well-structured, and solve the wrong problem.',
    },
  ],

  firstPrinciples: [
    {
      kind: 'paragraph',
      text: 'What can be delegated is work where the correct answer is determined by the specification. Implementing a documented component, converting a working prototype to typed code, writing tests for a described behaviour — the specification contains the answer.',
    },
    {
      kind: 'paragraph',
      text: 'What cannot be delegated is work where the specification itself is the deliverable: what to build, which state model to use, what the accessibility requirements are, whether an interaction is worth its complexity. Delegating those means accepting a decision you did not make and cannot defend.',
    },
  ],

  designPerspective: [
    {
      kind: 'paragraph',
      text: 'The risk is subtle. Generated components tend toward the statistically common solution, which is usually the generic one — the default focus ring, the conventional layout, the standard interaction.',
    },
    {
      kind: 'paragraph',
      text: 'That is frequently acceptable and occasionally the entire problem. If a product\'s quality comes from its specific interaction decisions, accepting generic output erases exactly the part that mattered.',
    },
  ],

  engineeringPerspective: [
    {
      kind: 'code',
      language: 'md',
      caption: 'A specification that can be verified rather than admired.',
      code: `## Component: StatusBadge

**Purpose**
Communicate a project's status in a list row, scannable in a vertical scan.

**API**
- status: 'draft' | 'active' | 'blocked' | 'archived'  (required)
- size: 'small' | 'medium'                              (default 'medium')
No other props. No className or style overrides.

**Constraints**
- Semantic tokens only; no primitive or literal colour values
- Status must not be conveyed by colour alone — each has a distinct glyph
- Contrast >= 4.5:1 in both themes for every status
- No wrapper div; render a single <span>

**Acceptance criteria**
- [ ] All four statuses render with distinct glyph and colour
- [ ] Both sizes use token spacing and type values
- [ ] Contrast verified in light and dark themes
- [ ] Text is not truncated at any size
- [ ] No hard-coded values anywhere in the output`,
    },
    {
      kind: 'paragraph',
      text: 'The acceptance criteria are what make this delegable. Each one is checkable, which means the review has a defined end rather than being an open judgement about whether the code looks fine.',
    },
  ],

  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'Writing a specification precise enough to delegate is the same work as writing one precise enough to hand to another person. The exercise improves the specification regardless of who implements it.',
    },
    {
      kind: 'paragraph',
      text: 'It also reveals what you had not decided. Every question the specification cannot answer is a decision you were going to make implicitly during implementation.',
    },
  ],

  industryExamples: [
    {
      id: 'example-spec-driven',
      source: 'Teams using AI assistance effectively',
      title: 'The specification as the real work',
      observation:
        'Teams that get consistent value from generated code write detailed specifications and acceptance criteria first, treating generation as the cheap step.',
      takeaway:
        'The judgement moves to the specification; it does not disappear.',
    },
    {
      id: 'example-generic-defaults',
      source: 'Generated interface code',
      title: 'Convergence on the conventional',
      observation:
        'Generated components reliably produce the most common solution, which is conventional rather than considered.',
      takeaway:
        'For undifferentiated work that is ideal. For the part of a product that is its differentiator, it is not.',
    },
  ],

  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Delegating a small component and reviewing the result.',
    },
    { kind: 'heading', text: '1. Decide whether it is delegable' },
    {
      kind: 'paragraph',
      text: 'Can you write a specification that determines the answer? If not, the decision is still yours to make.',
    },
    { kind: 'heading', text: '2. Write the specification first' },
    {
      kind: 'paragraph',
      text: 'Purpose, API, constraints, acceptance criteria. Before any prompt.',
    },
    { kind: 'heading', text: '3. State the constraints explicitly' },
    {
      kind: 'paragraph',
      text: 'Tokens, conventions, what must not appear. Anything unstated will be filled with a plausible default.',
    },
    { kind: 'heading', text: '4. Review against the criteria, in order' },
    {
      kind: 'paragraph',
      text: 'One at a time. Reviewing by impression means approving code that reads well.',
    },
    { kind: 'heading', text: '5. Record what it got wrong' },
    {
      kind: 'paragraph',
      text: 'The failures cluster — usually accessibility, edge cases, and project conventions. Knowing the pattern speeds up every later review.',
    },
    { kind: 'heading', text: '6. Decide: iterate or write it yourself' },
    {
      kind: 'paragraph',
      text: 'If the specification was right and the output is structurally wrong, writing it is often faster than a third attempt.',
    },
  ],

  commonMistakes: [
    {
      id: 'mistake-delegate-decisions',
      mistake: 'Delegating the decision rather than the implementation.',
      why: 'You accept a choice you did not make, cannot defend, and may not have noticed being made.',
      instead: 'Decide first; delegate execution of the decision.',
    },
    {
      id: 'mistake-no-acceptance-criteria',
      mistake: 'Delegating without acceptance criteria.',
      why: 'Review becomes an impression, and fluent code reads as correct.',
      instead: 'Write checkable criteria before generating anything.',
    },
    {
      id: 'mistake-unstated-constraints',
      mistake: 'Assuming project conventions are obvious.',
      why: 'Anything unstated is filled with a statistically common default, which is rarely your convention.',
      instead: 'State tokens, patterns, and prohibitions explicitly.',
    },
    {
      id: 'mistake-reviewing-by-plausibility',
      mistake: 'Reviewing generated code for reasonableness.',
      why: 'Fluency is guaranteed; correctness is not, and the two are easily confused.',
      instead: 'Check each acceptance criterion individually.',
    },
  ],

  eliteConsiderations: [
    {
      kind: 'list',
      items: [
        'Write the specification even when you will implement it yourself; it exposes the undecided parts.',
        'Keep a record of what generated output reliably gets wrong in your codebase, and put those items in every specification.',
        'Never delegate accessibility requirements — specify them and verify them yourself.',
        'Treat a third failed iteration as a signal to write it, not to refine the prompt again.',
      ],
    },
  ],

  practicalExercise: {
    id: 'exercise-15-01',
    title: 'Specify a small component and review the output',
    prompt:
      'Write a component specification, delegate its implementation, and review the result against your criteria.',
    steps: [
      'Choose a small component whose correct answer a specification can determine.',
      'Write purpose, API, constraints, and acceptance criteria before any prompt.',
      'State project conventions and prohibitions explicitly.',
      'Generate an implementation.',
      'Review against each acceptance criterion individually, in order.',
      'Record every criterion that failed and what was wrong.',
      'Decide whether to iterate or implement it yourself, and record the reason.',
      'Verify accessibility yourself rather than accepting it as done.',
    ],
    successCriteria: [
      'A written specification with checkable acceptance criteria exists.',
      'Every criterion was reviewed individually.',
      'Failures are recorded specifically, not as a general impression.',
      'Accessibility was verified independently.',
      'The iterate-or-rewrite decision is recorded with a reason.',
    ],
    estimatedMinutes: 45,
    hint: 'Write the acceptance criteria before generating. Written afterwards, they describe what you got rather than what you wanted.',
  },

  reflectionQuestion:
    'Which decisions should you refuse to delegate blindly?',
  reflectionHint: 'AI output quality does not equal judgement quality.',

  resources: [
    {
      id: 'resource-wcag-quickref-15',
      title: 'How to meet WCAG (quick reference)',
      url: 'https://www.w3.org/WAI/WCAG22/quickref/',
      type: 'specification',
      estimatedMinutes: 45,
      note: 'The requirements to specify explicitly and verify yourself.',
    },
    {
      id: 'resource-apg-15',
      title: 'ARIA Authoring Practices Guide',
      url: 'https://www.w3.org/WAI/ARIA/apg/patterns/',
      type: 'specification',
      estimatedMinutes: 60,
      note: 'The behavioural specification for any pattern you delegate.',
    },
  ],

  competencyTags: ['product-judgement', 'component-api-design', 'ai-assisted-engineering'],

  completionCriteria: [
    'A specification with checkable acceptance criteria was written first.',
    'Output was reviewed criterion by criterion.',
    'Accessibility was verified independently.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Lesson 72                                                                   */
/* -------------------------------------------------------------------------- */

const LESSON_72: Lesson = {
  id: 'lesson-15-02',
  slug: 'giving-agents-system-context',
  moduleId: MODULE_ID,
  lessonNumber: 2,
  title: 'Giving Agents System Context',
  summary:
    'Context has to be structured to be usable. More text is not more context, and frequently produces worse results.',
  estimatedMinutes: 9,

  objectives: [
    'Supply architectural context relevant to a specific task.',
    'Communicate tokens and component contracts precisely.',
    'State constraints as prohibitions rather than preferences.',
    'Structure a prompt so the important parts are findable.',
  ],

  prerequisiteConcepts: ['Design tokens', 'Component contracts'],
  prerequisiteLessonIds: ['lesson-15-01', 'lesson-09-01'],

  recap: [
    {
      kind: 'paragraph',
      text: 'A specification says what to build. Context says what environment it has to fit into, and it is the part most often supplied badly.',
    },
  ],

  coreConcept: [
    {
      kind: 'paragraph',
      text: 'Useful context is selective and structured. It contains what is needed for this task, organised so the constraints are separable from the description.',
    },
    {
      kind: 'list',
      items: [
        'Architecture — where this fits, what owns state, what it may and may not import.',
        'Tokens — the actual names available, not a description of a token system.',
        'Contracts — the APIs of components it will use, exactly as they are.',
        'Constraints — prohibitions, stated as prohibitions.',
        'Acceptance criteria — how the result will be checked.',
      ],
    },
    {
      kind: 'paragraph',
      text: 'A long prompt can produce worse output than a short one because the important constraints become a small fraction of the text. Ten critical requirements buried in three pages of background compete with the background for attention.',
    },
    {
      kind: 'callout',
      tone: 'insight',
      body: 'Structure beats volume. Five specific constraints under a heading outperform three pages of prose containing the same information.',
    },
  ],

  firstPrinciples: [
    {
      kind: 'paragraph',
      text: 'The most reliable context is the actual artefact rather than a description of it. Paste the token file, not "we use a semantic token system". Paste the component\'s type, not "there is a Button component with variants".',
    },
    {
      kind: 'paragraph',
      text: 'A description requires interpretation and interpretation drifts. The artefact is unambiguous, and it is also already correct, which a paraphrase may not be.',
    },
  ],

  designPerspective: [
    {
      kind: 'paragraph',
      text: 'The context that is hardest to supply is intent. "Do not animate the list on filter change, because motion here competes with the content the user is scanning" is a decision with a reason, and reasons transfer to new cases that a bare rule does not cover.',
    },
    {
      kind: 'paragraph',
      text: 'Rules without reasons get applied literally and then abandoned at the first case they do not cover.',
    },
  ],

  engineeringPerspective: [
    {
      kind: 'code',
      language: 'md',
      caption: 'Structured, selective, with the artefacts pasted rather than described.',
      code: `## Task
Implement FilterBar for the projects list.

## Architecture
- Query state lives in the URL via useQueryState. FilterBar reads and writes it;
  it owns nothing.
- Presentational only: no data fetching, no imports from lib/api.

## Available tokens (use only these)
--space-1 --space-2 --space-3 --space-4 --space-6
--color-surface --color-surface-raised --color-border
--color-text-primary --color-text-secondary --color-action-primary

## Component contracts
interface ButtonProps { tone?: 'primary'|'secondary'|'quiet'|'danger';
  size?: 'small'|'medium'; onClick?: () => void; children: React.ReactNode }
interface SelectProps<T> { options: ReadonlyArray<{value:T;label:string}>;
  value?: T; onChange?: (v:T) => void; label: string }

## Constraints
- No new dependencies
- No hard-coded colour, spacing, or type values
- Active filters must be individually removable without opening the panel
- Changing any filter resets page to 1 (call updateQuery, do not set page)
- Keyboard operable end to end; Escape closes the panel and restores focus

## Acceptance criteria
- [ ] Every value traces to a listed token
- [ ] Active filters removable from outside the panel
- [ ] Page resets on filter change
- [ ] Full keyboard operation with focus restoration
- [ ] No imports outside the listed contracts`,
    },
    {
      kind: 'paragraph',
      text: 'Note that the token list is exhaustive and the contracts are pasted verbatim. Anything not listed is implicitly unavailable, which is a much stronger constraint than describing a convention.',
    },
  ],

  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'Writing this context is a test of whether the system is documented. If you cannot list the tokens or paste the contracts, they do not exist in a usable form — for an agent or for a new colleague.',
    },
    {
      kind: 'paragraph',
      text: 'The exercise frequently improves the system more than it improves the output.',
    },
  ],

  industryExamples: [
    {
      id: 'example-project-context-files',
      source: 'Teams using coding agents',
      title: 'Persistent project context',
      observation:
        'Teams maintain a project context file holding conventions, architecture, and prohibitions, supplied with every task rather than re-explained.',
      takeaway:
        'The context is a maintained artefact, which also makes it reviewable.',
    },
    {
      id: 'example-artifact-over-description',
      source: 'Prompting practice',
      title: 'Pasting the type beats describing it',
      observation:
        'Supplying actual type definitions and token files produces more accurate output than describing them in prose.',
      takeaway:
        'A description requires interpretation; an artefact does not.',
    },
  ],

  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Writing an implementation prompt for a complex component.',
    },
    { kind: 'heading', text: '1. Choose what is genuinely relevant' },
    {
      kind: 'paragraph',
      text: 'Only what this task needs. Background that does not constrain the result dilutes what does.',
    },
    { kind: 'heading', text: '2. Paste artefacts, do not describe them' },
    {
      kind: 'paragraph',
      text: 'The token list. The component types. The exact names.',
    },
    { kind: 'heading', text: '3. Separate constraints under a heading' },
    {
      kind: 'paragraph',
      text: 'So they are findable rather than distributed through prose.',
    },
    { kind: 'heading', text: '4. State prohibitions as prohibitions' },
    {
      kind: 'paragraph',
      text: '"No new dependencies" rather than "we prefer to keep dependencies minimal".',
    },
    { kind: 'heading', text: '5. Give reasons for non-obvious rules' },
    {
      kind: 'paragraph',
      text: 'A rule with a reason extends to cases the rule did not anticipate.',
    },
    { kind: 'heading', text: '6. End with acceptance criteria' },
    {
      kind: 'paragraph',
      text: 'The checklist the result will be reviewed against.',
    },
    { kind: 'heading', text: '7. Test it by removing things' },
    {
      kind: 'paragraph',
      text: 'Cut the prompt in half. If the output does not degrade, the removed half was not doing anything.',
    },
  ],

  commonMistakes: [
    {
      id: 'mistake-volume-over-structure',
      mistake: 'Supplying as much context as possible.',
      why: 'Critical constraints become a small fraction of the text and compete with background.',
      instead: 'Select what is relevant and structure it under headings.',
    },
    {
      id: 'mistake-describe-not-paste',
      mistake: 'Describing tokens and contracts in prose.',
      why: 'A description requires interpretation, and the interpretation drifts from the artefact.',
      instead: 'Paste the actual definitions.',
    },
    {
      id: 'mistake-preferences-not-prohibitions',
      mistake: 'Stating constraints as preferences.',
      why: '"We prefer" reads as optional, and optional constraints are traded away first.',
      instead: 'State prohibitions as prohibitions.',
    },
    {
      id: 'mistake-rules-without-reasons',
      mistake: 'Giving rules with no reasoning.',
      why: 'A rule without a reason is applied literally and abandoned at the first uncovered case.',
      instead: 'Include the reason for anything non-obvious.',
    },
  ],

  eliteConsiderations: [
    {
      kind: 'list',
      items: [
        'Maintain a project context file rather than reassembling context per task.',
        'Keep an exhaustive token list in it; "use only these" is a much stronger constraint than a convention.',
        'Test prompts by deleting sections — anything whose removal changes nothing was noise.',
        'Put acceptance criteria last so they are the final thing read and the first thing checked.',
      ],
    },
  ],

  practicalExercise: {
    id: 'exercise-15-02',
    title: 'Write an implementation prompt for a complex component',
    prompt:
      'Write a structured context and specification for a component with several states and real constraints.',
    steps: [
      'Choose a component with at least four states and real constraints.',
      'Write the architectural context: what it owns, what it may import.',
      'Paste the exhaustive token list and the actual component contracts.',
      'State constraints as prohibitions, under their own heading.',
      'Give reasons for every non-obvious rule.',
      'End with checkable acceptance criteria.',
      'Generate, and review against the criteria.',
      'Cut the prompt in half and generate again; compare the two results.',
      'Record which sections mattered and which did not.',
    ],
    successCriteria: [
      'Tokens and contracts are pasted, not described.',
      'Constraints appear under their own heading as prohibitions.',
      'Non-obvious rules carry reasons.',
      'Acceptance criteria are checkable and appear last.',
      'The halved-prompt comparison is recorded.',
    ],
    estimatedMinutes: 50,
    hint: 'Cut the prompt in half and compare. It is the fastest way to find out which context was actually doing work.',
  },

  reflectionQuestion:
    'Why does a longer prompt sometimes produce worse code?',
  reflectionHint: 'Structure matters more than volume.',

  resources: [
    {
      id: 'resource-ts-handbook-15',
      title: 'TypeScript Handbook',
      url: 'https://www.typescriptlang.org/docs/handbook/intro.html',
      type: 'documentation',
      estimatedMinutes: 60,
      note: 'Types as the precise contract worth pasting rather than describing.',
    },
    {
      id: 'resource-design-tokens-15',
      title: 'Design Tokens Format Module',
      url: 'https://tr.designtokens.org/format/',
      type: 'specification',
      estimatedMinutes: 25,
      note: 'Tokens in a form that can be supplied exactly.',
    },
  ],

  competencyTags: [
    'architecture',
    'design-systems-implementation',
    'ai-assisted-engineering',
  ],

  completionCriteria: [
    'A structured context with pasted artefacts was written.',
    'Constraints are stated as prohibitions with reasons.',
    'The halved-prompt comparison was run and recorded.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Lesson 73                                                                   */
/* -------------------------------------------------------------------------- */

const LESSON_73: Lesson = {
  id: 'lesson-15-03',
  slug: 'reviewing-generated-code',
  moduleId: MODULE_ID,
  lessonNumber: 3,
  title: 'Reviewing Generated Code',
  summary:
    'Review in a fixed order, because fluent code invites approval. Structural problems and cosmetic ones deserve different responses.',
  estimatedMinutes: 9,

  objectives: [
    'Review generated code in a defined order rather than by impression.',
    'Check the categories that generated output reliably gets wrong.',
    'Distinguish structural problems from cosmetic ones.',
    'Decide between patching and rewriting from evidence.',
  ],

  prerequisiteConcepts: ['Code review', 'Accessibility', 'Testing'],
  prerequisiteLessonIds: ['lesson-15-02', 'lesson-06-04'],

  recap: [
    {
      kind: 'paragraph',
      text: 'You supplied context and criteria. This lesson is the review, which is where the responsibility you kept gets exercised.',
    },
  ],

  coreConcept: [
    {
      kind: 'paragraph',
      text: 'Review in a fixed sequence, because reading generated code from the top produces approval. It is fluent, conventionally structured, and plausibly named, and all three suppress scepticism.',
    },
    {
      kind: 'list',
      ordered: true,
      items: [
        'Correctness — does it do what the specification said, including edge cases?',
        'Accessibility — roles, names, keyboard, focus, announcements.',
        'Architecture — does it fit the codebase, or import and invent things it should not?',
        'Security — any injected content, unsafe rendering, or exposed values?',
        'Performance — unnecessary work, layout-triggering animation, unbounded loops.',
        'Maintainability — naming, duplication, and whether it is comprehensible.',
      ],
    },
    {
      kind: 'paragraph',
      text: 'Accessibility comes second because it is the category most reliably missing. Visual output looks complete while lacking labels, focus management, and announcements — none of which are visible in a screenshot.',
    },
    {
      kind: 'callout',
      tone: 'warning',
      body: 'Approving code because it reads well is the specific failure mode here. Fluency is a property of the generation, not evidence about the behaviour.',
    },
  ],

  firstPrinciples: [
    {
      kind: 'paragraph',
      text: 'The patch-or-rewrite decision should be made by counting structural problems rather than total problems. A cosmetic issue — a name, a missing comment, an extra variable — is a local fix.',
    },
    {
      kind: 'paragraph',
      text: 'A structural problem is one where the shape is wrong: state in the wrong place, a boundary in the wrong position, an effect doing a derivation. Two or more of those and patching produces something worse than either the original or a rewrite, because the fixes accumulate around a shape that does not fit.',
    },
  ],

  designPerspective: [
    {
      kind: 'paragraph',
      text: 'Generated interfaces tend to be visually complete and behaviourally shallow. The states that exist are the ones commonly implemented; the ones that are usually skipped are usually skipped here too.',
    },
    {
      kind: 'paragraph',
      text: 'So the review should look for what is absent rather than judging what is present. Loading, empty, error, focus, and the long-content case are the reliable gaps.',
    },
  ],

  engineeringPerspective: [
    {
      kind: 'code',
      language: 'md',
      caption: 'The defects that recur, in review order.',
      code: `## Correctness
- Edge cases from the spec silently omitted (empty, single item, very long)
- Async ordering ignored: no cancellation, stale responses can win
- Error paths present but generic

## Accessibility  (the most reliable gap)
- Interactive divs instead of buttons
- Missing accessible names on icon-only controls
- No focus management on open/close; focus not restored
- Status conveyed by colour alone
- Dynamic changes not announced

## Architecture
- State placed in the component rather than where the spec said
- Effects used for derivations
- Imports outside the supplied contracts
- Invented utilities that duplicate existing ones

## Performance
- Animating width/height instead of transform
- Work in render that belongs in a handler
- Unmemoised expensive derivations in hot paths`,
    },
    {
      kind: 'paragraph',
      text: 'Keeping this list as a standing checklist makes the review faster and more consistent than reading carefully, because the failures recur across tasks and across projects.',
    },
  ],

  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'The review requires exactly the knowledge this course has been building. You cannot check focus management without knowing what correct focus management is, or spot a misplaced boundary without having formed a view about boundaries.',
    },
    {
      kind: 'paragraph',
      text: 'Delegation does not reduce the knowledge required; it changes where it is applied, from writing to verifying.',
    },
  ],

  industryExamples: [
    {
      id: 'example-a11y-gap-generated',
      source: 'Reviews of generated interface code',
      title: 'Accessibility as the consistent omission',
      observation:
        'Generated components commonly render interactive divs, omit accessible names, and skip focus management while looking complete.',
      takeaway:
        'It is the category least visible in output and most reliably missing.',
    },
    {
      id: 'example-rewrite-threshold',
      source: 'Engineering practice',
      title: 'Counting structural problems',
      observation:
        'Experienced reviewers rewrite once several structural problems are present, rather than patching around a shape that does not fit.',
      takeaway:
        'Patching a wrong structure produces something harder to maintain than either starting point.',
    },
  ],

  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Auditing generated code and recording defects.',
    },
    { kind: 'heading', text: '1. Re-read the specification first' },
    {
      kind: 'paragraph',
      text: 'Before the code. Reading the code first anchors you to what it does rather than what was asked.',
    },
    { kind: 'heading', text: '2. Work the six categories in order' },
    {
      kind: 'paragraph',
      text: 'One at a time. Reading straight through finds the most obvious issue and stops.',
    },
    { kind: 'heading', text: '3. Run it with the mouse unplugged' },
    {
      kind: 'paragraph',
      text: 'Accessibility defects are behavioural, and reading the code is a poor way to find them.',
    },
    { kind: 'heading', text: '4. Test the edge cases from the spec' },
    {
      kind: 'paragraph',
      text: 'Empty, single item, very long content, slow network, forced failure.',
    },
    { kind: 'heading', text: '5. Classify each defect' },
    {
      kind: 'paragraph',
      text: 'Structural or cosmetic. The counts decide the next step.',
    },
    { kind: 'heading', text: '6. Decide and record' },
    {
      kind: 'paragraph',
      text: 'Two or more structural defects: rewrite. Record the decision and the counts that produced it.',
    },
  ],

  commonMistakes: [
    {
      id: 'mistake-approve-fluent',
      mistake: 'Approving code because it reads well.',
      why: 'Fluency is guaranteed by the generation process and says nothing about behaviour.',
      instead: 'Review against the specification, category by category.',
    },
    {
      id: 'mistake-skip-a11y-review',
      mistake: 'Reviewing accessibility by reading the code.',
      why: 'Focus management and announcement defects are behavioural and invisible in source.',
      instead: 'Run it with the mouse unplugged and with a screen reader.',
    },
    {
      id: 'mistake-patch-structural',
      mistake: 'Patching around structural problems.',
      why: 'Fixes accumulate around a shape that does not fit, producing something worse than either option.',
      instead: 'Count structural defects; two or more means rewrite.',
    },
    {
      id: 'mistake-trusting-tests',
      mistake: 'Accepting generated tests as verification.',
      why: 'They frequently test the implementation as written, so they pass regardless of whether it is correct.',
      instead: 'Verify tests fail when the behaviour is broken.',
    },
  ],

  eliteConsiderations: [
    {
      kind: 'list',
      items: [
        'Keep a standing checklist of what generated output gets wrong in your codebase and review against it.',
        'Always verify generated tests can fail; a passing suite proves nothing on its own.',
        'Review accessibility by using the interface, never by reading the source.',
        'Record the patch-or-rewrite decision with its counts; the pattern informs future specifications.',
      ],
    },
  ],

  practicalExercise: {
    id: 'exercise-15-03',
    title: 'Audit generated code and record defects',
    prompt:
      'Review a generated component through six categories and decide between patching and rewriting from evidence.',
    steps: [
      'Re-read the specification before looking at the code.',
      'Review correctness against the specification, including every edge case.',
      'Run it with the mouse unplugged and with a screen reader.',
      'Check architecture: state placement, effects, imports, invented utilities.',
      'Check security, performance, and maintainability in turn.',
      'Test with empty, single, and very long content, and with a forced failure.',
      'Classify every defect as structural or cosmetic and count each.',
      'Decide patch or rewrite from the counts and record the reasoning.',
      'If tests were generated, break the behaviour and confirm they fail.',
    ],
    successCriteria: [
      'All six categories were reviewed in order.',
      'Accessibility was reviewed by using the interface, not by reading it.',
      'Every defect is classified as structural or cosmetic, with counts.',
      'The patch-or-rewrite decision cites the counts.',
      'Any generated tests were verified to fail when behaviour breaks.',
    ],
    estimatedMinutes: 50,
    hint: 'Count structural defects rather than total defects. Ten naming issues is a tidy-up; two misplaced boundaries is a rewrite.',
  },

  reflectionQuestion: 'When should you rewrite instead of patch?',
  reflectionHint: 'Count structural problems, not cosmetic ones.',

  resources: [
    {
      id: 'resource-apg-review',
      title: 'ARIA Authoring Practices Guide',
      url: 'https://www.w3.org/WAI/ARIA/apg/patterns/',
      type: 'specification',
      estimatedMinutes: 60,
      note: 'The standard to review keyboard and role behaviour against.',
    },
    {
      id: 'resource-axe-15',
      title: 'axe-core',
      url: 'https://github.com/dequelabs/axe-core',
      type: 'repository',
      estimatedMinutes: 20,
      note: 'Automated checks for the mechanical part of the accessibility review.',
    },
  ],

  competencyTags: ['accessibility', 'critique', 'architecture', 'ai-assisted-engineering'],

  completionCriteria: [
    'A six-category review was completed on generated code.',
    'Defects are classified structural or cosmetic with counts.',
    'The patch-or-rewrite decision cites evidence.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Lesson 74                                                                   */
/* -------------------------------------------------------------------------- */

const LESSON_74: Lesson = {
  id: 'lesson-15-04',
  slug: 'design-to-code-workflows',
  moduleId: MODULE_ID,
  lessonNumber: 4,
  title: 'Design-to-Code Workflows',
  summary:
    'A design file is a structure for editing visuals. A DOM is a structure for meaning and behaviour. Translating one to the other is interpretation, not transcription.',
  estimatedMinutes: 9,

  objectives: [
    'Structure a design file so it maps cleanly to implementation.',
    'Map design variables to code tokens without a translation layer.',
    'Translate design structure to semantic markup rather than reproducing layers.',
    'Preserve design intent that a file cannot express.',
  ],

  prerequisiteConcepts: ['Design parity', 'Semantic HTML', 'Tokens'],
  prerequisiteLessonIds: ['lesson-15-03', 'lesson-09-03'],

  recap: [
    {
      kind: 'paragraph',
      text: 'Module 9 established parity of names, variants, and states. This lesson is about the translation itself, and what should not carry across.',
    },
  ],

  coreConcept: [
    {
      kind: 'paragraph',
      text: 'The two structures exist for different purposes. A design file is organised for editing and reuse: groups, frames, auto layout, nested components. A DOM is organised for meaning and behaviour: headings, landmarks, lists, controls.',
    },
    {
      kind: 'list',
      items: [
        'Carries across — tokens, component identity, variant values, states, spacing decisions.',
        'Does not — layer names, group nesting, wrapper frames, absolute positions.',
        'Exists only in code — semantics, focus order, ARIA relationships, keyboard behaviour.',
        'Exists only in the file — construction aids, variants never used, editing scaffolding.',
      ],
    },
    {
      kind: 'paragraph',
      text: 'Tools that reproduce layer structure as markup produce nested divs with no semantics and an accidental reading order. The layers were a means of construction, not a description of the document.',
    },
    {
      kind: 'callout',
      tone: 'insight',
      body: 'The question is not "how do I recreate this structure?" but "what document does this design depict?"',
    },
  ],

  firstPrinciples: [
    {
      kind: 'paragraph',
      text: 'A design shows an arrangement; the implementation must express meaning. A bold 24px line at the top is a heading because of its role in the document, not because of its weight — and the markup has to say so.',
    },
    {
      kind: 'paragraph',
      text: 'This is why translation is interpretation. The file does not contain the information about what things are, so the implementer supplies it. Doing that well requires understanding the design rather than measuring it.',
    },
  ],

  designPerspective: [
    {
      kind: 'paragraph',
      text: 'A well-structured file makes the interpretation easier: components as components, auto layout expressing intended flow, variables for every value, and states as variants rather than as separate frames.',
    },
    {
      kind: 'paragraph',
      text: 'The most valuable additions are the ones a file cannot show. What happens with three lines of title. What loading looks like. Which element takes focus first. Those are usually written as annotations, and they are the difference between a specification and a picture.',
    },
  ],

  engineeringPerspective: [
    {
      kind: 'code',
      language: 'tsx',
      caption: 'Layers transcribed, and the document the design depicted.',
      code: `// Transcribed from layer structure: nested, meaningless, unreachable by keyboard.
<div className="card-frame">
  <div className="card-content">
    <div className="text-wrapper">
      <div className="title-text">Northern Territories</div>
      <div className="meta-text">Updated 2 days ago</div>
    </div>
    <div className="button-frame" onClick={open}>Open</div>
  </div>
</div>

// Interpreted: what this design actually depicts.
<article className="card">
  <h3 className="card__title">
    <a href={\`/projects/\${project.id}\`}>{project.name}</a>
  </h3>
  <p className="card__meta">
    Updated <time dateTime={project.updatedAt}>{formatRelative(project.updatedAt)}</time>
  </p>
</article>`,
    },
    {
      kind: 'paragraph',
      text: 'The second version has fewer elements, real semantics, a keyboard-reachable link, and a machine-readable time. None of that was in the file; all of it was implied by what the design depicted.',
    },
  ],

  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'This translation is the most concrete definition of design engineering available. It requires reading a design for its intent and expressing that intent in a medium with different primitives.',
    },
    {
      kind: 'paragraph',
      text: 'It is also why automated design-to-code produces markup that looks right and behaves badly: it translates structure, and structure was never the thing that needed translating.',
    },
  ],

  industryExamples: [
    {
      id: 'example-figma-variables',
      source: 'Figma variables and token pipelines',
      title: 'One token definition, two environments',
      observation:
        'Teams generate design variables and CSS custom properties from a single source so the two cannot drift.',
      takeaway:
        'Values transfer mechanically. Structure and semantics never do.',
    },
    {
      id: 'example-annotations',
      source: 'Teams with strong handoff',
      title: 'Annotating what the file cannot show',
      observation:
        'Effective handoff includes notes on focus order, empty states, long-content behaviour, and error cases.',
      takeaway:
        'These are decisions. Unannotated, they are made by whoever implements the screen.',
    },
  ],

  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Taking one Figma component through to production implementation.',
    },
    { kind: 'heading', text: '1. Read the design as a document' },
    {
      kind: 'paragraph',
      text: 'What is the heading, what is the list, what is the control? Write the outline before any markup.',
    },
    { kind: 'heading', text: '2. Write the markup from the outline' },
    {
      kind: 'paragraph',
      text: 'Semantic, unstyled, correct on its own. Layer structure is irrelevant at this stage.',
    },
    { kind: 'heading', text: '3. Map variables to tokens' },
    {
      kind: 'paragraph',
      text: 'One to one. Any value with no token is either a missing token or a design accident.',
    },
    { kind: 'heading', text: '4. Implement variants as the file declares them' },
    {
      kind: 'paragraph',
      text: 'Same names, same values. A mismatch here is drift on day one.',
    },
    { kind: 'heading', text: '5. Add what the file could not express' },
    {
      kind: 'paragraph',
      text: 'Focus order, keyboard behaviour, ARIA relationships, long-content handling, loading and error states.',
    },
    { kind: 'heading', text: '6. Take the questions back' },
    {
      kind: 'paragraph',
      text: 'Every ambiguity you resolved is a decision the design did not make. Confirm it rather than owning it silently.',
    },
  ],

  commonMistakes: [
    {
      id: 'mistake-transcribe-layers',
      mistake: 'Reproducing layer structure as markup.',
      why: 'It produces nested meaningless elements, no semantics, and an accidental reading order.',
      instead: 'Interpret the document the design depicts and write that.',
    },
    {
      id: 'mistake-absolute-from-file',
      mistake: 'Positioning elements from design coordinates.',
      why: 'It breaks with any content length or viewport the file did not contain.',
      instead: 'Express the relationships the layout implies, in flow.',
    },
    {
      id: 'mistake-no-token-mapping',
      mistake: 'Copying values instead of mapping to tokens.',
      why: 'The implementation encodes the current palette and cannot follow a system change.',
      instead: 'Map every value to a token; missing ones are gaps to raise.',
    },
    {
      id: 'mistake-silent-decisions',
      mistake: 'Resolving design ambiguities silently.',
      why: 'Decisions the designer never saw end up in the product, and drift starts immediately.',
      instead: 'Take every ambiguity back as a question.',
    },
  ],

  eliteConsiderations: [
    {
      kind: 'list',
      items: [
        'Write the document outline before any markup; it prevents layer structure leaking into the DOM.',
        'Generate design variables and CSS tokens from one source so values cannot drift.',
        'Keep a list of ambiguities per handoff; the pattern shows what the file should annotate next time.',
        'Treat any value with no token as a system gap to raise, not a number to copy.',
      ],
    },
  ],

  practicalExercise: {
    id: 'exercise-15-04',
    title: 'Take one Figma component through production implementation',
    prompt:
      'Implement a design-file component properly, interpreting rather than transcribing.',
    steps: [
      'Read the design and write the document outline: headings, lists, controls, landmarks.',
      'Write semantic markup from the outline, unstyled.',
      'Verify the unstyled markup is readable and correctly ordered.',
      'Map every design variable to a code token, one to one.',
      'Implement variants with the file\'s exact names and values.',
      'Add focus order, keyboard behaviour, and ARIA relationships.',
      'Add long-content, empty, loading, and error handling.',
      'List every ambiguity you resolved and take it back as a question.',
    ],
    successCriteria: [
      'The DOM reflects document meaning, not layer structure.',
      'Unstyled markup is readable and correctly ordered.',
      'Every value maps to a token, with gaps raised rather than copied.',
      'Variant names and values match the file exactly.',
      'A list of resolved ambiguities exists and was taken back.',
    ],
    estimatedMinutes: 55,
    hint: 'Write the outline before opening the file properly. It stops the layer panel deciding your DOM.',
  },

  reflectionQuestion:
    'Should generated code reproduce every layer from the design file?',
  reflectionHint:
    'Design structure and DOM structure serve different purposes.',

  resources: [
    {
      id: 'resource-figma-variables-15',
      title: 'Figma: variables',
      url: 'https://help.figma.com/hc/en-us/articles/15339657135383-Guide-to-variables-in-Figma',
      type: 'documentation',
      estimatedMinutes: 30,
      note: 'The design-side token layer that maps to code.',
    },
    {
      id: 'resource-mdn-html-semantics-15',
      title: 'MDN: HTML elements reference',
      url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element',
      type: 'documentation',
      estimatedMinutes: 40,
      note: 'The vocabulary a design has to be translated into.',
    },
  ],

  competencyTags: [
    'accessibility',
    'html',
    'design-to-code-translation',
    'design-systems-implementation',
  ],

  completionCriteria: [
    'A component was implemented from its document meaning, not its layers.',
    'Every value maps to a token.',
    'Resolved ambiguities were listed and taken back.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Lesson 75                                                                   */
/* -------------------------------------------------------------------------- */

const LESSON_75: Lesson = {
  id: 'lesson-15-05',
  slug: 'shipping-design-engineering-work',
  moduleId: MODULE_ID,
  lessonNumber: 5,
  title: 'Shipping Design Engineering Work',
  summary:
    'Screenshots show what you made. Decisions backed by working software show what you can do, which is the thing anyone is actually assessing.',
  estimatedMinutes: 9,

  objectives: [
    'Write a product narrative and a technical narrative that support each other.',
    'Present decisions with their alternatives and trade-offs.',
    'Assemble evidence that survives interaction.',
    'Document work so it can be evaluated without you present.',
  ],

  prerequisiteConcepts: ['Case study writing', 'Measurement', 'Critique'],
  prerequisiteLessonIds: ['lesson-15-04', 'lesson-14-05'],

  recap: [
    {
      kind: 'paragraph',
      text: 'You can build, verify, refine, and delegate. This lesson is about presenting the result in a form that demonstrates the ability rather than the artefact.',
    },
  ],

  coreConcept: [
    {
      kind: 'paragraph',
      text: 'Design engineering work needs two narratives, and each is incomplete alone. The product narrative says what problem this solves and for whom. The technical narrative says how it is built and why that way.',
    },
    {
      kind: 'list',
      items: [
        'Product — the problem, the user, the goal, the decisions that shaped the solution.',
        'Technical — architecture, state model, key trade-offs, what you would change.',
        'Decisions — what you chose, what you rejected, and why.',
        'Evidence — live implementation, repository, design file, measurements.',
      ],
    },
    {
      kind: 'paragraph',
      text: 'Evidence must survive interaction. A screenshot shows a chosen frame with chosen content. A live implementation can be used, broken, keyboard-navigated, and opened at 320px — which is what actually distinguishes finished work from a picture of it.',
    },
    {
      kind: 'callout',
      tone: 'insight',
      body: 'Anyone can produce a screenshot of a good screen. Far fewer can produce one that holds up when someone unplugs the mouse and resizes the window.',
    },
  ],

  firstPrinciples: [
    {
      kind: 'paragraph',
      text: 'The thing being assessed is judgement, because judgement is what predicts future work. An artefact shows what you produced once; a decision log shows how you decide, which is what will happen again.',
    },
    {
      kind: 'paragraph',
      text: 'This is why rejected alternatives matter so much. A decision presented without them looks arbitrary. With them, it shows the constraints you weighed — and that is the whole demonstration.',
    },
  ],

  designPerspective: [
    {
      kind: 'paragraph',
      text: 'The commonest failure in a case study is narrating activity: I researched, I wireframed, I iterated, I shipped. It is chronological, complete, and says nothing about quality.',
    },
    {
      kind: 'paragraph',
      text: 'What reads as senior is decisions with reasons and consequences. "Filters live in the URL, so a view can be shared; the cost is that the parameter names are now a public interface we cannot rename" — one sentence carrying a decision, a benefit, and an acknowledged cost.',
    },
  ],

  engineeringPerspective: [
    {
      kind: 'code',
      language: 'md',
      caption: 'A decision log entry: the smallest unit of demonstrated judgement.',
      code: `### Query state lives in the URL

**Context**
Support teams share filtered views constantly — currently as screenshots with
written instructions, which go stale within a day.

**Decision**
Search, filters, sort, and page are serialised into readable query parameters.
Only non-default values appear.

**Alternatives rejected**
- Component state: simplest, but nothing is shareable and refresh loses the view.
- Saved views in a store: shareable within the product, but not as a link, and
  needs a backend this project does not have.

**Trade-offs accepted**
Parameter names are now a public interface — renaming one breaks every saved
link. Malformed URLs must be parsed defensively, which is extra code.

**Evidence**
Shareable link in the live demo; malformed-URL handling covered by tests.`,
    },
    {
      kind: 'paragraph',
      text: 'The rejected alternatives and the accepted costs are what make this a demonstration of judgement. Without them it is a description of a feature.',
    },
  ],

  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'The distinctive claim of design engineering is that the two narratives are the same story. The product decision and the technical decision are one decision viewed from two sides.',
    },
    {
      kind: 'paragraph',
      text: 'Work presented in a way that shows that connection demonstrates something a design portfolio and an engineering portfolio do not, separately.',
    },
  ],

  industryExamples: [
    {
      id: 'example-decision-logs',
      source: 'Engineering teams with architecture decision records',
      title: 'Decisions recorded with alternatives',
      observation:
        'Teams keep short records of significant decisions, each naming the context, the choice, the alternatives, and the consequences.',
      takeaway:
        'The format exists because the reasoning is the part that becomes unrecoverable.',
    },
    {
      id: 'example-live-over-screenshot',
      source: 'Portfolio review practice',
      title: 'Live work assessed differently',
      observation:
        'Reviewers who can open and use a project evaluate it on behaviour, states, and keyboard support — none of which a screenshot conveys.',
      takeaway:
        'Live work is a stronger claim because it can be tested rather than presented.',
    },
  ],

  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Preparing one project for public presentation.',
    },
    { kind: 'heading', text: '1. State the problem before the solution' },
    {
      kind: 'paragraph',
      text: 'Who has it, what it costs them, and how you know. Without this, nothing that follows can be judged.',
    },
    { kind: 'heading', text: '2. Write the decision log' },
    {
      kind: 'paragraph',
      text: 'Five to eight significant decisions. Context, choice, alternatives rejected, costs accepted.',
    },
    { kind: 'heading', text: '3. Make the live version withstand inspection' },
    {
      kind: 'paragraph',
      text: 'Keyboard, 320px, empty states, forced errors. It will be tested, so test it first.',
    },
    { kind: 'heading', text: '4. Attach the measurements' },
    {
      kind: 'paragraph',
      text: 'Performance figures with conditions. Accessibility results with what was checked manually.',
    },
    { kind: 'heading', text: '5. Make the repository readable' },
    {
      kind: 'paragraph',
      text: 'A README that runs from a fresh clone, a coherent commit history, and documented components.',
    },
    { kind: 'heading', text: '6. State what you would change' },
    {
      kind: 'paragraph',
      text: 'Honestly, with reasons. It demonstrates continued judgement rather than defensiveness.',
    },
    { kind: 'heading', text: '7. Have someone else assess it' },
    {
      kind: 'paragraph',
      text: 'Without your commentary. Whatever they cannot find or understand is a gap in the presentation.',
    },
  ],

  commonMistakes: [
    {
      id: 'mistake-activity-narrative',
      mistake: 'Narrating the process chronologically.',
      why: 'It describes activity, not judgement, and every project\'s process looks the same.',
      instead: 'Present decisions with their alternatives and consequences.',
    },
    {
      id: 'mistake-screenshots-only',
      mistake: 'Presenting only screenshots.',
      why: 'They show chosen frames with chosen content and hide every state and behaviour.',
      instead: 'Ship a live implementation that can be used and tested.',
    },
    {
      id: 'mistake-no-alternatives',
      mistake: 'Presenting decisions without rejected alternatives.',
      why: 'The decision looks arbitrary, and the constraints you weighed are invisible.',
      instead: 'Name what you rejected and why.',
    },
    {
      id: 'mistake-no-costs',
      mistake: 'Presenting decisions with no acknowledged costs.',
      why: 'Every real decision has a cost, so claiming none reads as not having examined it.',
      instead: 'State the trade-off you accepted.',
    },
  ],

  eliteConsiderations: [
    {
      kind: 'list',
      items: [
        'Write the decision log during the work; reconstructed afterwards it becomes rationalisation.',
        'Include a failure and what you learned — it is more credible than an unbroken success.',
        'Make the live version keyboard-complete before publishing; it is the first thing a careful reviewer tests.',
        'Publish measurements with their conditions, or they cannot be trusted.',
      ],
    },
  ],

  practicalExercise: {
    id: 'exercise-15-05',
    title: 'Prepare one project for public presentation',
    prompt:
      'Prepare a project so that it demonstrates judgement and withstands inspection without you present.',
    steps: [
      'Write the problem statement: who has it, what it costs, how you know.',
      'Write a decision log of five to eight decisions with alternatives and accepted costs.',
      'Verify the live version by keyboard, at 320px, and in every state.',
      'Attach performance measurements with their conditions.',
      'Attach accessibility results, naming what was checked manually.',
      'Make the repository runnable from a fresh clone with a readable history.',
      'Write what you would change now, with reasons.',
      'Have someone assess it without your commentary and record what they could not find.',
    ],
    successCriteria: [
      'Every decision names alternatives rejected and costs accepted.',
      'The live version is keyboard-complete and holds at 320px.',
      'Measurements are published with their conditions.',
      'The repository runs from a fresh clone by following the README.',
      'An independent reviewer could assess it without commentary.',
    ],
    estimatedMinutes: 55,
    hint: 'Give it to someone with no explanation. What they cannot find is what the presentation is missing.',
  },

  reflectionQuestion:
    'What proves Design Engineering ability more strongly, screenshots or decisions backed by working software?',
  reflectionHint: 'Evidence should survive interaction.',

  resources: [
    {
      id: 'resource-adr',
      title: 'Architecture decision records',
      url: 'https://adr.github.io/',
      type: 'documentation',
      estimatedMinutes: 20,
      note: 'A durable format for recording a decision with its alternatives.',
    },
    {
      id: 'resource-case-study-writing',
      title: 'Writing effective UX case studies',
      url: 'https://www.nngroup.com/articles/ux-portfolio/',
      type: 'article',
      estimatedMinutes: 20,
      note: 'Decisions and outcomes rather than chronology.',
    },
  ],

  competencyTags: ['product-thinking', 'critique', 'product-judgement', 'architecture'],

  completionCriteria: [
    'A decision log with alternatives and costs exists.',
    'The live version withstands keyboard and narrow-width inspection.',
    'An independent reviewer could assess it without commentary.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Capstone                                                                    */
/* -------------------------------------------------------------------------- */

const PROJECT: ModuleProject = {
  id: 'project-15',
  slug: 'design-engineering-capstone',
  moduleId: MODULE_ID,
  title: 'Design Engineering Capstone',
  brief:
    'Build one production-quality product experience of your own choosing, demonstrating product thinking, design, engineering, system work, and quality together.',
  problem:
    'Every project so far has isolated a concern. The capstone removes that scaffolding: you choose the problem, decide what to build, and are responsible for every decision from the user goal down to the focus ring. It is the only project where nothing is specified for you, which is also the condition under which real design engineering happens.',
  objectives: [
    'Identify a real problem and a meaningful workflow that addresses it.',
    'Design and build it to a standard you would ship.',
    'Demonstrate system thinking through tokens, components, and documented states.',
    'Produce evidence of quality rather than claims about it.',
  ],
  requirements: [
    'Product: a clear problem, a specific user goal, and a meaningful workflow.',
    'Design: hierarchy, typography, spacing, interaction, responsive design, visual consistency.',
    'Engineering: TypeScript, React, reusable components, state architecture, data handling, error handling, accessibility, performance.',
    'System: tokens, documented components, behavioural states, edge cases.',
    'Quality: keyboard support, responsive behaviour, reduced motion, loading, empty, success, error, and a degraded state where relevant.',
    'Portfolio: live implementation, repository, design file, written case study, decision log, performance evidence, accessibility evidence.',
  ],
  constraints: [
    'No component library for anything the product is judged on.',
    'Every value must trace to a token or carry a written exception.',
    'Every state must be reachable on demand in development.',
    'Performance and accessibility claims must be supported by recorded evidence.',
  ],
  suggestedScope:
    'One workflow, done completely, in a product you would use. Depth over breadth: a single flow at shippable quality demonstrates more than five flows at prototype quality.',
  deliverables: [
    'A live implementation that can be used and tested.',
    'A repository that runs from a fresh clone, with a readable commit history.',
    'A design file with component and token parity.',
    'A written case study: problem, user, decisions, outcome.',
    'A decision log with alternatives rejected and costs accepted.',
    'Performance evidence with conditions recorded.',
    'Accessibility evidence naming what was checked manually.',
  ],
  completionCriteria: [
    'The entire workflow is completable by keyboard alone, with the mouse unplugged.',
    'Every state — loading, empty, success, error, and degraded where relevant — is designed and reachable.',
    'Reduced motion is supported as a designed mode, not as disabled animation.',
    'The layout holds from 320px to 2560px with no overflow.',
    'Performance and accessibility evidence is recorded with conditions.',
    'A decision log documents alternatives rejected and costs accepted.',
    'An independent reviewer can run it from the README and assess it without commentary.',
  ],
  portfolioEvidence: [
    'End-to-end product design and implementation',
    'State architecture and data handling',
    'Design system application',
    'Accessibility and keyboard support',
    'Performance measurement',
    'Decision documentation',
  ],
  reflectionQuestion:
    'Which decision in this project would you defend most strongly to someone who disagreed with it, and what would you say?',
  estimatedHours: 80,
  competencies: [
    'product-thinking',
    'ux-reasoning',
    'visual-hierarchy',
    'typography',
    'colour',
    'layout',
    'responsive-design',
    'interaction-design',
    'motion',
    'accessibility',
    'design-systems',
    'product-judgement',
    'html',
    'css',
    'javascript',
    'typescript',
    'react',
    'state-modelling',
    'component-architecture',
    'browser-apis',
    'async-systems',
    'performance',
    'architecture',
    'git',
    'design-to-code-translation',
    'interface-state-modelling',
    'component-api-design',
    'design-systems-implementation',
    'interaction-engineering',
    'design-qa',
  ],
  stretchGoals: [
    'Add an offline or degraded mode and document how it was tested.',
    'Publish the component documentation as a usable reference someone else could build against.',
  ],
};

/* -------------------------------------------------------------------------- */

export const MODULE_15: CurriculumModule = {
  id: MODULE_ID,
  slug: 'ai-assisted-design-engineering-and-capstone',
  moduleNumber: 15,
  phase: 'product-judgement',
  title: 'AI-Assisted Design Engineering and Capstone',
  description:
    'Delegation that keeps judgement, context an agent can use, reviewing generated code, translating design to code as interpretation, and shipping work that demonstrates ability.',
  outcome: 'Can direct implementation, verify quality, and ship work that proves judgement.',
  prerequisites: [
    'Modules 1 to 14, or equivalent',
    'Finished projects to present and build upon',
  ],
  lessons: [LESSON_71, LESSON_72, LESSON_73, LESSON_74, LESSON_75],
  resources: [
    {
      id: 'resource-module-15-apg',
      title: 'ARIA Authoring Practices Guide',
      url: 'https://www.w3.org/WAI/ARIA/apg/patterns/',
      type: 'specification',
      estimatedMinutes: 120,
      note: 'The behavioural standard to specify against and review against.',
    },
    {
      id: 'resource-module-15-adr',
      title: 'Architecture decision records',
      url: 'https://adr.github.io/',
      type: 'documentation',
      estimatedMinutes: 25,
      note: 'The format behind the capstone decision log.',
    },
    {
      id: 'resource-module-15-vitals',
      title: 'Web Vitals',
      url: 'https://web.dev/articles/vitals',
      type: 'article',
      estimatedMinutes: 25,
      note: 'The measurements the capstone must evidence.',
    },
  ],
  project: PROJECT,
  competencies: [
    'product-thinking',
    'ux-reasoning',
    'visual-hierarchy',
    'typography',
    'colour',
    'layout',
    'responsive-design',
    'interaction-design',
    'motion',
    'accessibility',
    'design-systems',
    'critique',
    'product-judgement',
    'html',
    'css',
    'javascript',
    'typescript',
    'react',
    'state-modelling',
    'component-architecture',
    'browser-apis',
    'async-systems',
    'performance',
    'architecture',
    'git',
    'design-to-code-translation',
    'interface-state-modelling',
    'component-api-design',
    'design-systems-implementation',
    'interaction-engineering',
    'design-qa',
    'ai-assisted-engineering',
  ],
  completionCriteria: [
    'All five lessons completed.',
    'Capstone marked completed.',
    'Can direct, verify, and present design engineering work end to end.',
  ],
};
