/**
 * Module 15 — Advanced Design Engineering and Capstone.
 *
 * The last module is about leverage and evidence: delegating implementation
 * without delegating judgement, moving between design and code without losing
 * fidelity, reviewing work you did not write, explaining decisions to people
 * who were not there, and shipping something finished.
 */

import type { CurriculumModule, Lesson, ModuleProject } from '@/types/curriculum';

const MODULE_ID = 'module-15';

/* -------------------------------------------------------------------------- */
/* Lesson 71                                                                   */
/* -------------------------------------------------------------------------- */

const LESSON_1: Lesson = {
  id: 'lesson-ai-as-an-implementation-partner',
  slug: 'ai-as-an-implementation-partner',
  moduleId: MODULE_ID,
  lessonNumber: 1,
  title: 'AI as an Implementation Partner',
  summary:
    'Specification, delegation, constraints, verification. The work moves from typing to deciding — and deciding is the part that cannot be delegated.',
  estimatedMinutes: 10,
  objectives: [
    'Write a specification complete enough to delegate.',
    'Supply the constraints that make generated work usable.',
    'Verify output against the specification rather than reading it for plausibility.',
    'Decide what must not be delegated, and why.',
  ],
  prerequisiteConcepts: [
    'Behaviour specifications, Module 5 lesson 25',
    'Component contracts, Module 8 lesson 37',
    'Architecture decisions, Module 14 lesson 69',
  ],
  prerequisiteLessonIds: [
    'lesson-systematic-product-critique',
    'lesson-designing-component-apis',
  ],
  recap: [
    {
      kind: 'paragraph',
      text: 'Fourteen modules have taught you to specify before building: states before screens, call sites before components, decisions with their trade-offs recorded. All of that turns out to be the skill this lesson needs.',
    },
  ],
  priorKnowledge: [
    {
      kind: 'paragraph',
      text: 'Module 5 lesson 25 had you write states, triggers, transitions and edge cases before coding. Module 8 lesson 37 had you write the call site before the implementation. Module 10 lesson 50 had you write a contribution checklist.',
    },
    {
      kind: 'paragraph',
      text: 'Those three artefacts are, between them, a brief that can be handed to someone else. That is the whole premise here.',
    },
  ],
  coreConcept: [
    {
      kind: 'paragraph',
      text: 'Delegation works in proportion to the quality of the specification. This is not specific to AI — it is true of any capable collaborator — but AI makes it unusually visible, because it will produce something plausible from a vague brief rather than asking.',
    },
    {
      kind: 'paragraph',
      text: 'A weak brief produces working code that solves a slightly different problem, and the gap is hard to see because the code looks competent.',
    },
    {
      kind: 'code',
      language: 'markdown',
      code: 'Weak:\n  "Build a data table with sorting and filtering."\n\nComplete:\n  COMPONENT  TransactionTable\n  PURPOSE    Scanning and comparing transactions at speed.\n\n  DATA       Transaction { id, date (ISO), description, amount (minor units),\n             currency (ISO 4217), status: posted | pending | failed }\n\n  API        rows, sort: { by, direction }, onSort, onRowAction\n             Controlled. No internal sort state.\n\n  STATES     loading (skeleton, 6 rows) · refetching (previous rows dimmed)\n             error with last-known (inline warning, previous rows kept)\n             error without (error state, retry) · empty-unfiltered\n             empty-filtered (distinct wording, clear-filters action) · content\n\n  SEMANTICS  Real <table>. scope="col" on headers, <th scope="row"> on the\n             description cell. aria-sort on the active column. Caption\n             announcing current sort, visually hidden.\n\n  VISUAL     Numerics right-aligned, font-variant-numeric: tabular-nums.\n             Absolute dates, one format. Spacing from --space-* only.\n\n  KEYBOARD   Scroll container focusable and labelled. Row actions reachable\n             by Tab, visible on :focus-within as well as :hover.\n\n  CONSTRAINTS  TypeScript strict, no any. No table library. No index keys.\n             Tokens only, no literal colours or spacing.\n\n  OUT OF SCOPE  Virtualisation. Column resizing. Row selection.',
    },
    {
      kind: 'paragraph',
      text: 'The second brief is not longer because of thoroughness for its own sake. Every line removes a decision that would otherwise be guessed — and a guessed decision is one you have to find later in review.',
    },
  ],
  whyDesignersCare: [
    {
      kind: 'paragraph',
      text: 'Because the scarce skill shifts from producing code to knowing what good looks like.',
    },
    {
      kind: 'paragraph',
      text: 'Generated code is usually syntactically fine and frequently wrong in the ways this course has spent fourteen modules on: index keys, divs with click handlers, state that should be derived, no empty-state distinction, placeholder instead of label, animation at 400ms.',
    },
    {
      kind: 'paragraph',
      text: 'Someone who cannot see those ships them. Someone who can, now ships good work considerably faster than before. The leverage goes to judgement, which is precisely what a design engineer has.',
    },
  ],
  howItWorks: [
    {
      kind: 'paragraph',
      text: 'The loop has four steps, and the third is the one people skip.',
    },
    {
      kind: 'list',
      ordered: true,
      items: [
        '**Specify** — states, API, semantics, constraints, out of scope.',
        '**Delegate** — hand over the brief, not a conversation.',
        '**Verify** — check against the specification, line by line, not by reading for plausibility.',
        '**Iterate** — correct the specification, not just the code, so the next pass does not regress.',
      ],
    },
    {
      kind: 'paragraph',
      text: 'Step four matters more than it looks. Fixing the output leaves the brief wrong; fixing the brief means the next generation starts from a better place. Treating the specification as the artefact and the code as its product is the habit that compounds.',
    },
    {
      kind: 'paragraph',
      text: 'Verification needs to be mechanical, because plausible-looking code defeats casual reading.',
    },
  ],
  firstPrinciples: [
    {
      kind: 'paragraph',
      text: 'What not to delegate falls into three categories, and the boundary is reasonably sharp.',
    },
    {
      kind: 'list',
      items: [
        '**Problem definition** — what are we building, for whom, to solve what. Delegate this and you may build the wrong thing beautifully.',
        '**Trade-off decisions** — architecture, data model, what consistency the product needs, which variants exist. These require context about the product and the team that no brief fully contains.',
        '**Acceptance** — whether the result is good enough. This is the one that must never move, because it is the only check on everything above.',
      ],
    },
    {
      kind: 'paragraph',
      text: 'What delegates well is the opposite: bounded, specifiable work where you can state the acceptance criteria in advance. A component against a complete brief. A migration across many files. Tests for behaviour you have already described. Boilerplate of any kind.',
    },
    {
      kind: 'callout',
      tone: 'insight',
      body: 'The test is whether you can write the acceptance criteria before the work starts. If you can, it is delegable. If you cannot, you do not yet understand the problem well enough to hand it over — and that is the actual work.',
    },
  ],
  designPerspective: [
    {
      kind: 'paragraph',
      text: 'The design question is whether the brief contains the design.',
    },
    {
      kind: 'paragraph',
      text: 'Hierarchy, density, which states exist, what the empty state offers, how long the animation runs — none of that is inferable. A brief without them gets defaults, and defaults are the absence of design.',
    },
    {
      kind: 'paragraph',
      text: 'This is why the Module 10 token system matters so much here. "Spacing from `--space-*` only" is one line that carries the whole visual system into the generated output.',
    },
  ],
  engineeringPerspective: [
    {
      kind: 'paragraph',
      text: 'The engineering question is what enforces the constraints rather than requesting them.',
    },
    {
      kind: 'paragraph',
      text: 'A brief asking for no `any` is a request. A strict TypeScript configuration is enforcement. A brief asking for tokens is a request; a lint rule rejecting literal colours is enforcement. A brief asking for accessible names is a request; a test querying by role is enforcement.',
    },
    {
      kind: 'paragraph',
      text: 'Everything you built in Modules 10 and 13 — the checklist, the lint rules, the role-based tests — turns out to be the verification layer for delegated work. That was not their original purpose and it is now their most valuable one.',
    },
  ],
  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'The specification is the design artefact and the engineering brief at once.',
    },
    {
      kind: 'paragraph',
      text: 'States, API, semantics, visual rules, constraints, out of scope. A designer can read it and check the design is represented; an engineer can read it and check it is buildable. Writing one well is the clearest demonstration of the hybrid role there is — and it is the same document this course has been teaching you to write since Module 5.',
    },
  ],
  industryExamples: [
    {
      id: 'example-spec-first-practice',
      source: 'Anthropic',
      title: 'Specification before generation',
      observation:
        'Engineering guidance on working with coding models consistently emphasises providing explicit context, constraints and verification criteria rather than open-ended requests.',
      takeaway:
        'The advice is about the brief, not the prompt wording. A complete specification is the mechanism; phrasing is a detail.',
    },
    {
      id: 'example-review-as-the-bottleneck',
      source: 'GitHub',
      title: 'Review becomes the constraint',
      observation:
        'When implementation speed increases, review capacity rather than writing capacity becomes the limit on how much can ship safely.',
      takeaway:
        'Which is why the next two lessons are about reviewing. Generating faster than you can verify is not an improvement.',
    },
  ],
  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Run one full loop and record where the brief was incomplete.',
    },
    {
      kind: 'paragraph',
      text: 'Take a component from your Module 8 library. Write the complete brief. Delegate it. Then verify mechanically rather than by reading.',
    },
    {
      kind: 'code',
      language: 'markdown',
      code: 'ROUND 1 — brief omitted the loading state and the focus style.\n  Result: both missing. Not a failure of the generation; a gap in the brief.\n  Action: add them to the brief, not just to the code.\n\nROUND 2 — brief said "accessible". Result: aria-label on the wrapper div,\n  no label association on the input.\n  Action: replace "accessible" with the specific requirements —\n  label element with htmlFor, aria-describedby for hint and error,\n  aria-invalid on failure.\n\nROUND 3 — brief said "use design tokens". Result: tokens for colour,\n  literal px for spacing.\n  Action: "all spacing from --space-* ; no literal px except border widths".\n\nROUND 4 — specification complete. Output passes the checklist with two\n  minor corrections. The brief is now reusable for the next component.',
    },
  ],
  commonMistakes: [
    {
      id: 'mistake-15-01-vague-brief',
      mistake: 'Using words like "accessible", "responsive" or "clean" as requirements.',
      why: 'They are judgements, not specifications, so they are satisfied by whatever the generator considers reasonable.',
      instead: 'State the specific requirement. "Label element with htmlFor" rather than "accessible".',
    },
    {
      id: 'mistake-15-01-reading-for-plausibility',
      mistake: 'Reviewing generated code by reading it to see whether it looks right.',
      why: 'It almost always looks right. The defects are omissions and subtle wrong choices, which reading does not surface.',
      instead: 'Verify against the specification, item by item, and run the typecheck, tests and audits.',
    },
  ],
  professionalConsideration: [
    {
      kind: 'paragraph',
      text: 'The risk is not bad code. It is good-looking code that embeds decisions nobody made.',
    },
    {
      kind: 'paragraph',
      text: 'A component with a reasonable-seeming API that nobody designed, a state model that happens to work, an error treatment chosen by default. Each is individually fine and collectively a product with no coherent point of view — which is the thing a design engineer is employed to prevent. Delegating the typing is fine. Delegating the decisions produces work that is competent and characterless, and the difference is not visible in a diff.',
    },
  ],
  goDeeper: [
    {
      kind: 'paragraph',
      text: 'Everything below was part of the walkthrough above. It is the detail that matters once the core idea has landed, and it is safe to skip on a first pass.',
    },
    {
      kind: 'paragraph',
      text: 'The pattern across all four rounds: every vague word in the brief became a defect. "Accessible", "use tokens", "handle errors" are all words that feel like requirements and specify nothing.',
    },
    {
      kind: 'paragraph',
      text: 'The output of the exercise is not the component — you already had one. It is the brief, which now encodes your standards in a form you can reuse. That artefact is worth considerably more than the code it produced.',
    },
    {
      kind: 'code',
      language: 'markdown',
      code: 'VERIFY\n  [ ] Every state in the brief renders. Check each one, do not assume.\n  [ ] Both empty states exist and differ in wording and action.\n  [ ] Real <table>; scope on headers; th scope="row" present.\n  [ ] aria-sort reflects state and changes when sorting.\n  [ ] tabular-nums on numeric columns.\n  [ ] Keys from row ids. Search the diff for "index".\n  [ ] No literal colour or spacing values. Search for "#", "px".\n  [ ] No any. Typecheck passes.\n  [ ] Keyboard: Tab reaches every row action; focus visible throughout.\n  [ ] Nothing from "out of scope" was built anyway.',
    },
    {
      kind: 'paragraph',
      text: 'That last line catches a characteristic failure: unrequested extras. Virtualisation added unasked is not a bonus — it is untested complexity you now own, and it was excluded for a reason.',
    },
  ],
  practicalExercise: {
    id: 'exercise-ai-as-an-implementation-partner',
    title: 'Specify, delegate, verify, iterate',
    prompt:
      'Run the full loop on one real component, iterating the specification rather than the output until it passes mechanically.',
    steps: [
      'Choose a component you have already built, so you can compare.',
      'Write the complete brief: purpose, data, API, states, semantics, visual rules, keyboard, constraints, out of scope.',
      'Write the verification checklist before delegating anything.',
      'Delegate, then verify item by item. Do not read for plausibility.',
      'For every defect, decide whether the brief was wrong, and fix the brief.',
      'Repeat until the output passes the checklist with only trivial corrections.',
      'Record every vague word that produced a defect.',
      'List three things you deliberately did not delegate, and why.',
    ],
    successCriteria: [
      'A complete brief exists, including out-of-scope items.',
      'The checklist was written before delegation.',
      'Verification was mechanical, with each item checked.',
      'Defects were traced back to the brief where the brief was at fault.',
      'The final output passes with only trivial corrections.',
      'Vague words that caused defects are recorded.',
      'Three non-delegated decisions are named with reasoning.',
    ],
    estimatedMinutes: 90,
    hint: 'Write the checklist before you delegate, without exception. Written afterwards it will unconsciously describe what you received rather than what you wanted.',
  },
  reflectionQuestion:
    'Why is "can you write the acceptance criteria in advance?" a good test of whether work can be delegated?',
  reflectionHint:
    'Ask what it means about your own understanding if you cannot.',
  resources: [
    {
      id: 'resource-anthropic-engineering-15',
      title: 'Anthropic Engineering',
      url: 'https://www.anthropic.com/engineering',
      type: 'article',
      author: 'Anthropic',
      estimatedMinutes: 45,
      note: 'Practical writing on working with coding models. Read for the emphasis on context and verification rather than for prompt wording.',
    },
    {
      id: 'resource-adr-15',
      title: 'Architectural Decision Records',
      url: 'https://adr.github.io/',
      type: 'documentation',
      author: 'ADR',
      estimatedMinutes: 20,
      note: 'Relevant here because a recorded decision is context a collaborator can use. Undocumented decisions get re-decided.',
    },
  ],
  competencyTags: ['ai-assisted-engineering', 'product-judgement', 'architecture', 'component-api-design', 'critique'],
  completionCriteria: [
    'Writes a specification complete enough to delegate.',
    'Verifies mechanically against a checklist written in advance.',
    'Can name what must not be delegated and why.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Lesson 72                                                                   */
/* -------------------------------------------------------------------------- */

const LESSON_2: Lesson = {
  id: 'lesson-design-to-code-workflows',
  slug: 'design-to-code-workflows',
  moduleId: MODULE_ID,
  lessonNumber: 2,
  title: 'Design-to-Code Workflows',
  summary:
    'Making the handoff a check rather than a translation: structured files, shared tokens, mapped components, and an honest assessment of what generated code from a design is worth.',
  estimatedMinutes: 10,
  objectives: [
    'Structure a design file so it can be implemented without interpretation.',
    'Share tokens between design and code from one source.',
    'Verify implementation parity systematically.',
    'Evaluate code generated from a design against a real standard.',
  ],
  prerequisiteConcepts: [
    'Tokens, Module 10 lesson 46',
    'Figma and code parity, Module 10 lesson 48',
    'Specification and verification, previous lesson',
  ],
  prerequisiteLessonIds: ['lesson-ai-as-an-implementation-partner'],
  recap: [
    {
      kind: 'paragraph',
      text: 'Module 10 lesson 48 established parity as a mapping table maintained by habit. This lesson is about making the habit mostly unnecessary.',
    },
  ],
  priorKnowledge: [
    {
      kind: 'paragraph',
      text: 'You have a token system with three layers, a Figma library with matching names, and a mapping table per component. The remaining gap is everything in a design file that is not a component.',
    },
  ],
  coreConcept: [
    {
      kind: 'paragraph',
      text: 'The handoff fails for a predictable reason: the design file contains information in a form the implementer has to interpret.',
    },
    {
      kind: 'paragraph',
      text: 'A 20px gap that should have been 16px. A one-off grey. A frame showing the success state and no frame showing the error. Each forces a decision the designer already made, or thought they had.',
    },
    {
      kind: 'paragraph',
      text: 'A file structured for implementation removes the interpretation.',
    },
    {
      kind: 'list',
      items: [
        '**Variables for everything** — no raw hex, no typed-in spacing. If it is not a variable, it is not a decision.',
        '**Components, not copies** — a detached instance is an implementation question with no answer.',
        '**Auto layout** — expresses the intended responsive behaviour rather than leaving it to be guessed from one width.',
        '**Every state as a frame** — including loading, empty, error, and the long-content case.',
        '**Named to match code** — the Module 10 parity table, applied to layers rather than only components.',
      ],
    },
    {
      kind: 'paragraph',
      text: 'The fourth is the one most often missing and the most expensive. A design showing only the success state has specified roughly a third of the work.',
    },
  ],
  whyDesignersCare: [
    {
      kind: 'paragraph',
      text: 'Because this is the difference between a design that ships as designed and one that ships as interpreted.',
    },
    {
      kind: 'paragraph',
      text: 'Every ambiguity in the file is resolved by somebody — usually quickly, usually reasonably, and usually not the way you would have. The accumulated result is the drift Module 13 lesson 64 spends an afternoon measuring.',
    },
    {
      kind: 'paragraph',
      text: 'Removing the ambiguity is cheaper than finding it in QA, and it is work only the designer can do.',
    },
  ],
  howItWorks: [
    {
      kind: 'paragraph',
      text: 'The strongest version shares tokens from **one source** rather than keeping two in step.',
    },
    {
      kind: 'code',
      language: 'json',
      code: '{\n  "color": {\n    "grey": { "900": { "$value": "oklch(20% 0 0)", "$type": "color" } },\n    "blue": { "500": { "$value": "oklch(55% 0.18 255)", "$type": "color" } }\n  },\n  "semantic": {\n    "surface":      { "$value": "{color.grey.0}",   "$type": "color" },\n    "text-primary": { "$value": "{color.grey.900}", "$type": "color" },\n    "accent":       { "$value": "{color.blue.500}", "$type": "color" }\n  },\n  "space": {\n    "4": { "$value": "16px", "$type": "dimension" }\n  }\n}',
    },
    {
      kind: 'paragraph',
      text: 'One file in a neutral format, from which CSS custom properties and design-tool variables are both generated. The three-layer structure from Module 10 lesson 46 is visible in it — primitives, then semantic references.',
    },
    {
      kind: 'paragraph',
      text: 'The practical effect: a colour change is one commit that reaches both tools, and the two cannot disagree because neither is the source. That removes an entire category of drift rather than detecting it.',
    },
    {
      kind: 'paragraph',
      text: 'Parity verification then becomes a short, repeatable check.',
    },
    {
      kind: 'code',
      language: 'markdown',
      code: 'PARITY CHECK — per component\n  [ ] Component name identical in both.\n  [ ] Every design property has a code prop, or a written reason.\n  [ ] Every code prop has a design property, or a written reason.\n  [ ] Allowed values identical, spelled identically.\n  [ ] Interaction states are variants in design, pseudo-classes in code.\n  [ ] Every designed state exists in code.\n  [ ] Every code state appears somewhere in the design.\n  [ ] Spacing, radius and type resolve to the same tokens in both.',
    },
    {
      kind: 'paragraph',
      text: 'Both directions, deliberately. A code prop with no design equivalent is as much a parity failure as the reverse, and it is the direction nobody checks.',
    },
  ],
  firstPrinciples: [
    {
      kind: 'paragraph',
      text: 'On code generated from a design, the honest position is: useful for structure, unreliable for everything else.',
    },
    {
      kind: 'paragraph',
      text: 'It is working from a picture. A picture contains no information about several things that matter, and cannot.',
    },
    {
      kind: 'list',
      items: [
        '**Semantics** — a heading and large bold text look identical. So do a button and a styled div.',
        '**Responsive intent** — one width shows one layout. What should happen between breakpoints is not in the image.',
        '**State** — which parts change, when, and in response to what.',
        '**Reuse** — whether this card is the Card component or a new thing.',
        '**Behaviour** — validation timing, focus movement, optimism, error recovery.',
      ],
    },
    {
      kind: 'callout',
      tone: 'insight',
      body: 'Generated markup is a starting point for layout, at best. Accepting it as a component is how a codebase acquires forty bespoke cards that look identical and share nothing.',
    },
    {
      kind: 'paragraph',
      text: 'Used well, it saves the tedious part: the rough structure and the approximate spacing. The semantics, the component mapping, the states and the behaviour remain yours, and they are the parts that take the time.',
    },
  ],
  designPerspective: [
    {
      kind: 'paragraph',
      text: 'The design question is what the file communicates beyond appearance.',
    },
    {
      kind: 'paragraph',
      text: 'Annotation carries what the pixels cannot: which element is a heading, what the tab order should be, what the accessible name of the icon button is, when validation fires, what the empty state offers. A file with those noted is a specification; a file without them is a picture that will be interpreted.',
    },
  ],
  engineeringPerspective: [
    {
      kind: 'paragraph',
      text: 'The engineering question is whether the implementation uses the system.',
    },
    {
      kind: 'paragraph',
      text: 'The first question of any implementation review: which existing components does this use? A screen built from the library inherits every accessibility and state decision already made. A screen built from scratch that happens to look like the library has inherited none of them, and will diverge on the first change.',
    },
  ],
  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'Shared tokens are the only mechanism in this course that makes drift structurally impossible rather than detectable.',
    },
    {
      kind: 'paragraph',
      text: 'Everything else in Module 13 lesson 64 finds drift after it happens. One token source prevents it: there is no second value to diverge from. That is the difference between a process and an architecture, and it is worth the setup cost.',
    },
  ],
  industryExamples: [
    {
      id: 'example-figma-variables-15',
      source: 'Figma',
      title: 'Variables as the design-side token',
      observation:
        'Figma variables hold colour, number, string and boolean values that can be referenced across a file and aliased to one another.',
      takeaway:
        'Aliasing is what makes the three-layer token model expressible in the design tool as well as in CSS.',
    },
    {
      id: 'example-design-tokens-format',
      source: 'Design Tokens Community Group',
      title: 'A neutral interchange format',
      observation:
        'The Design Tokens format specification defines a tool-independent way to express tokens, including references between them.',
      takeaway:
        'A neutral format is what allows one source and many outputs. Without it, one tool is the source and the others are copies.',
    },
  ],
  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Take one screen from design to implementation, measuring the gap.',
    },
    {
      kind: 'list',
      ordered: true,
      items: [
        'Audit the design file: every colour a variable, every component an instance, auto layout throughout, every state present.',
        'Annotate what the pixels cannot carry: heading levels, tab order, accessible names, validation timing.',
        'List which library components the screen should use, before writing anything.',
        'Implement, using only system components and tokens.',
        'Run the parity check in both directions.',
        'Run the Module 13 lesson 64 visual pass and record the drift.',
        'For every drift finding, decide whether the design file or the implementation was at fault.',
      ],
    },
  ],
  commonMistakes: [
    {
      id: 'mistake-15-02-design-shows-one-state',
      mistake: 'Handing over a design showing only the success state.',
      why: 'Loading, empty, error and long-content cases are then invented during implementation, inconsistently.',
      instead: 'Every state is a frame. The states are the design, not an appendix to it.',
    },
    {
      id: 'mistake-15-02-generated-markup-as-component',
      mistake: 'Accepting generated markup as a component.',
      why: 'It carries no semantics, no reuse, no state model and no behaviour, and it looks finished.',
      instead: 'Treat it as a layout sketch. Map it onto system components and add everything a picture cannot contain.',
    },
  ],
  professionalConsideration: [
    {
      kind: 'paragraph',
      text: 'The best design-to-code workflow is one where handoff barely exists as an event.',
    },
    {
      kind: 'paragraph',
      text: 'If the design is built from components that map to real ones, using variables that generate the real CSS, with every state present and the behaviour annotated, then implementation is assembly plus the genuinely new parts. The elaborate handoff ritual — the walkthrough, the spec document, the round of questions — is mostly a symptom of a design file that was not built to be implemented. That is fixable, and fixing it is design engineering work.',
    },
  ],
  goDeeper: [
    {
      kind: 'paragraph',
      text: 'Everything below was part of the walkthrough above. It is the detail that matters once the core idea has landed, and it is safe to skip on a first pass.',
    },
    {
      kind: 'paragraph',
      text: 'Step seven is the valuable one, and the answer is usually the file. A 20px gap in the implementation is often a 20px gap in the design that was never on the scale — in which case the fix is upstream, and fixing only the code leaves the next implementer with the same ambiguity.',
    },
    {
      kind: 'paragraph',
      text: 'If you also generate code from the design as a comparison, review it against this lesson’s list: check what it did to semantics, to component reuse and to responsive behaviour. Those three are where the limits show, and seeing them concretely is more useful than being told.',
    },
  ],
  practicalExercise: {
    id: 'exercise-design-to-code-workflows',
    title: 'Take one screen through a parity workflow',
    prompt:
      'Structure a design file for implementation, build the screen from your system, and measure the remaining gap in both directions.',
    steps: [
      'Audit and restructure the design file: variables, instances, auto layout, all states.',
      'Annotate heading levels, tab order, accessible names and validation timing.',
      'Export tokens to a neutral format and generate the CSS from it.',
      'List the library components to use before implementing.',
      'Implement using only system components and tokens.',
      'Run the parity check in both directions for every component used.',
      'Run a visual drift pass and attribute each finding to the file or the code.',
      'Fix the upstream causes, not just the implementation.',
    ],
    successCriteria: [
      'No raw values in the design file; every state present as a frame.',
      'Annotations cover what the pixels cannot carry.',
      'Tokens come from one source and generate both outputs.',
      'Parity checked in both directions, with reasons for every difference.',
      'Drift findings attributed to a cause.',
      'At least one upstream fix made in the design file.',
    ],
    estimatedMinutes: 100,
    hint: 'Do the state frames before anything else. A design file with loading, empty, error and long-content frames eliminates more implementation ambiguity than every other item on the list combined.',
  },
  reflectionQuestion:
    'Why can generated code not determine whether an element is a heading or a button?',
  reflectionHint:
    'Ask what information is present in a picture, and what is not.',
  resources: [
    {
      id: 'resource-figma-variables-15',
      title: 'Guide to variables in Figma',
      url: 'https://help.figma.com/hc/en-us/articles/15339657135383-Guide-to-variables-in-Figma',
      type: 'documentation',
      author: 'Figma',
      estimatedMinutes: 35,
      note: 'Variables, aliasing and modes. The design-side half of a shared token system.',
    },
    {
      id: 'resource-design-tokens-format-15',
      title: 'Design Tokens Format Module',
      url: 'https://tr.designtokens.org/format/',
      type: 'documentation',
      author: 'Design Tokens Community Group',
      estimatedMinutes: 35,
      note: 'The neutral format. Read the references section, which is what makes the semantic layer expressible.',
    },
  ],
  competencyTags: ['design-to-code-translation', 'design-systems-implementation', 'design-systems', 'ai-assisted-engineering', 'design-qa'],
  completionCriteria: [
    'Structures a design file so implementation needs no interpretation.',
    'Shares tokens from one source to both tools.',
    'Can state what generated code from a design cannot know.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Lesson 73                                                                   */
/* -------------------------------------------------------------------------- */

const LESSON_3: Lesson = {
  id: 'lesson-reviewing-generated-code-and-design',
  slug: 'reviewing-generated-code-and-design',
  moduleId: MODULE_ID,
  lessonNumber: 3,
  title: 'Reviewing Generated Code and Design',
  summary:
    'Seven dimensions, in order, because when producing work gets cheap, reviewing it becomes the thing that decides quality.',
  estimatedMinutes: 10,
  objectives: [
    'Review work across seven dimensions in a fixed order.',
    'Recognise the defects generated code produces characteristically.',
    'Distinguish a correctness problem from a maintainability one.',
    'Write review feedback that is specific and actionable.',
  ],
  prerequisiteConcepts: [
    'Specification and verification, lesson 71',
    'Design QA, Module 13 lesson 64',
    'Nine-layer critique, Module 14 lesson 70',
  ],
  prerequisiteLessonIds: ['lesson-design-to-code-workflows'],
  recap: [
    {
      kind: 'paragraph',
      text: 'Lesson 71 ended on the observation that review capacity, not production, becomes the limit. This lesson is the review method.',
    },
  ],
  priorKnowledge: [
    {
      kind: 'paragraph',
      text: 'You have two review methods already. Module 13 lesson 64 reviews implementation against a design. Module 14 lesson 70 critiques a product against a user goal. This one reviews a change against a standard, which is the third and most frequent case.',
    },
  ],
  coreConcept: [
    {
      kind: 'paragraph',
      text: 'Seven dimensions, ordered so that an early finding can make later ones irrelevant.',
    },
    {
      kind: 'list',
      ordered: true,
      items: [
        '**Correctness** — does it do what was specified, including the edge cases?',
        '**Architecture** — does it fit the existing structure, or work around it?',
        '**Accessibility** — semantics, keyboard, focus, announcement.',
        '**Performance** — any obvious cost: unnecessary work, layout-tier animation, unbounded rendering.',
        '**Maintainability** — would the next person understand it, and is it on the system?',
        '**Visual fidelity** — does it match the design, measured rather than eyeballed?',
        '**Interaction quality** — states, timing, feedback, the details from Module 12.',
      ],
    },
    {
      kind: 'paragraph',
      text: 'Correctness first because a component that solves the wrong problem does not need its spacing checked. Architecture second because a change that bypasses the system may be deleted rather than refined.',
    },
    {
      kind: 'paragraph',
      text: 'The last two are last for the same reason polish was last in Module 14: they are the most visible and the most dependent on everything above.',
    },
  ],
  whyDesignersCare: [
    {
      kind: 'paragraph',
      text: 'Because review is where a product’s standards are either applied or quietly abandoned.',
    },
    {
      kind: 'paragraph',
      text: 'Every decision this course taught — derived state, both empty states, labels not placeholders, exits faster than entrances, variants as unions — holds only if somebody checks. Without review, the standard is whatever shipped most recently.',
    },
    {
      kind: 'paragraph',
      text: 'Being the person who checks is not pedantry. It is the only mechanism by which a design system remains a system.',
    },
  ],
  howItWorks: [
    {
      kind: 'paragraph',
      text: 'Generated code fails in characteristic ways, and knowing them makes review fast.',
    },
    {
      kind: 'code',
      language: 'markdown',
      code: 'CHARACTERISTIC DEFECTS\n\nCorrectness\n  - Edge cases from the brief silently absent.\n  - Happy path handled; both empty states collapsed into one.\n  - Out-of-scope features built anyway.\n\nArchitecture\n  - A new component that duplicates an existing one.\n  - State held locally that should be lifted, or lifted that should be local.\n  - Derived values stored in state.\n\nAccessibility\n  - div with onClick instead of button.\n  - Icon-only buttons with no accessible name.\n  - Placeholder used as a label.\n  - Focus outline removed with no replacement.\n  - aria-label on a wrapper rather than the control.\n\nPerformance\n  - Animating width or height rather than transform.\n  - Reading layout inside a loop.\n  - Rendering an unbounded list with no discussion of size.\n\nMaintainability\n  - Literal colours and spacing beside an existing token system.\n  - any, or a type assertion hiding a real mismatch.\n  - A comment restating the code rather than the reason.\n\nVisual\n  - Spacing near the scale but not on it.\n  - Font weight or line height not from the type tokens.\n\nInteraction\n  - Enter and exit at the same duration.\n  - Durations of 300ms and above by default.\n  - No pressed state; no reduced-motion alternative.',
    },
    {
      kind: 'paragraph',
      text: 'That list is a review checklist derived entirely from this course. Every item is something you now recognise on sight, which is what makes a fast review possible at all.',
    },
    {
      kind: 'paragraph',
      text: 'Several items are also machine-checkable — `any`, literal colours, missing accessible names — and anything machine-checkable should not be occupying a human reviewer. Module 10 lesson 50’s argument for automation is the same argument here.',
    },
  ],
  firstPrinciples: [
    {
      kind: 'paragraph',
      text: 'Feedback has to be specific, located and reasoned, or it does not get acted on.',
    },
    {
      kind: 'code',
      language: 'markdown',
      code: 'Unusable:\n  "This needs accessibility work."\n\nUsable:\n  TransactionTable.tsx:48 — the row action is a div with onClick.\n  It is not focusable and not announced as a control, so the action is\n  unreachable by keyboard (Module 9 lesson 41).\n  Change to <button type="button">. The styling can stay the same.\n\nUnusable:\n  "The animation feels slow."\n\nUsable:\n  Dialog.tsx:22 — enter and exit both 300ms ease-in-out. Exit should be\n  roughly half the entrance with ease-in, since dismissing has nothing to\n  communicate. Suggest --duration-slow in, --duration-fast out.',
    },
    {
      kind: 'paragraph',
      text: 'Location, observation, consequence, suggested fix. The consequence is the part that persuades — "unreachable by keyboard" is a reason, where "needs accessibility work" is an instruction.',
    },
    {
      kind: 'callout',
      tone: 'insight',
      body: 'Review feedback that explains why teaches the standard. Feedback that only corrects produces someone who makes the same class of mistake in a different place next week.',
    },
  ],
  designPerspective: [
    {
      kind: 'paragraph',
      text: 'The design question is whether the result has a point of view.',
    },
    {
      kind: 'paragraph',
      text: 'This is the hardest dimension to review and the one that matters most over time. Work can pass all seven dimensions and still be characterless — defaults everywhere, no decision that anyone would defend. A product assembled from reasonable defaults is exactly as good as every other product assembled from the same defaults.',
    },
  ],
  engineeringPerspective: [
    {
      kind: 'paragraph',
      text: 'The engineering question is whether the review itself can be automated away.',
    },
    {
      kind: 'paragraph',
      text: 'For each finding, ask: could a type have prevented this? A lint rule? A test? A required prop? Over time the human review should narrow to the things only judgement can catch — architecture fit, design coherence, whether the thing is worth building — because everything mechanical has been pushed into the toolchain.',
    },
  ],
  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'The seven dimensions are the course compressed into a review.',
    },
    {
      kind: 'paragraph',
      text: 'Correctness is Modules 5 and 11. Architecture is 8 and 14. Accessibility is 9. Performance is 13. Maintainability is 10. Visual is 2 and 3. Interaction is 12. Being able to review across all seven is what the whole sequence was for — and reviewing is the activity where the breadth pays most, because no specialist can cover it alone.',
    },
  ],
  industryExamples: [
    {
      id: 'example-axe-automated-floor-15',
      source: 'Deque',
      title: 'Machine-checkable items removed from human review',
      observation:
        'Automated accessibility engines detect a defined subset of violations and publish what falls outside their reach.',
      takeaway:
        'The subset belongs in CI. Human review is too expensive to spend on anything a tool can assert.',
    },
    {
      id: 'example-review-standards-public',
      source: 'Shopify',
      title: 'Standards visible in review',
      observation:
        'Public design system repositories show review comments referencing documented guidelines rather than individual preference.',
      takeaway:
        'Citing the standard rather than your opinion is what makes review feel like quality control instead of taste enforcement.',
    },
  ],
  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Review one generated component through all seven dimensions.',
    },
    {
      kind: 'code',
      language: 'markdown',
      code: 'REVIEW — generated TransactionTable against the lesson 71 brief\n\n1 CORRECTNESS\n  ✗ Both empty states collapsed into one. Brief specified two with\n    different wording and actions.\n  ✗ error-with-last-known not implemented; any failure clears the rows.\n  ✓ Sorting, loading, content all correct.\n\n2 ARCHITECTURE\n  ✗ Holds its own sort state despite the brief specifying controlled.\n    Means the URL cannot own the sort (Module 11 lesson 54).\n  ✓ No duplication of existing components.\n\n3 ACCESSIBILITY\n  ✓ Real table, scope on headers.\n  ✗ No th scope="row" — rows announce values with no row context.\n  ✗ aria-sort absent; sort is visible only as an icon.\n  ✗ Scroll container not focusable; cannot be scrolled by keyboard.\n\n4 PERFORMANCE\n  ✓ No layout-tier animation. No reads in loops.\n  ⚠ Renders all rows. Acceptable at the specified scale; note the limit.\n\n5 MAINTAINABILITY\n  ✗ Three literal hex colours beside the token system.\n  ✗ One `as any` around the sort comparator.\n  ✓ Otherwise readable; names match the brief.\n\n6 VISUAL FIDELITY\n  ✗ Row padding 14px; nearest token is 12px (--space-3).\n  ✗ tabular-nums absent, so the amount column is ragged.\n\n7 INTERACTION QUALITY\n  ✗ Row actions on :hover only — unreachable by keyboard.\n  ✗ No pressed state on the sort buttons.\n\nBLOCKING: 1.1, 1.2, 2.1, 3.2, 3.3, 3.4, 5.2, 7.1\nNON-BLOCKING: 4.1 (note the limit), 5.1, 6.1, 6.2, 7.2',
    },
    {
      kind: 'paragraph',
      text: 'Thirteen findings, of which eight block. Note that the code almost certainly ran correctly and looked reasonable — none of these would have been caught by reading it for plausibility.',
    },
  ],
  commonMistakes: [
    {
      id: 'mistake-15-03-reviewing-only-visuals',
      mistake: 'Reviewing only what is visible.',
      why: 'The expensive problems are architectural and accessibility-related, and neither is visible in a screenshot.',
      instead: 'Run all seven dimensions in order. Correctness and architecture first.',
    },
    {
      id: 'mistake-15-03-everything-blocking',
      mistake: 'Marking every finding as blocking.',
      why: 'The reviewer loses credibility and the real blockers lose their weight, so everything is negotiated equally.',
      instead: 'Block on correctness, accessibility and architecture. Note the rest as follow-up.',
    },
  ],
  professionalConsideration: [
    {
      kind: 'paragraph',
      text: 'Review is the most senior activity in this course, and the least glamorous.',
    },
    {
      kind: 'paragraph',
      text: 'Nothing visible is produced. The output is work that is better than it would have been, and nobody can see the counterfactual. But when production is cheap and verification is the constraint, the person who can review across all seven dimensions is the person whose judgement sets the product’s quality — and that is a considerably more durable position than being the fastest at writing components.',
    },
  ],
  goDeeper: [
    {
      kind: 'paragraph',
      text: 'Everything below was part of the walkthrough above. It is the detail that matters once the core idea has landed, and it is safe to skip on a first pass.',
    },
    {
      kind: 'paragraph',
      text: 'The blocking split matters. A review marking everything blocking is as unhelpful as one marking nothing blocking: the first stalls work, the second ships defects. Accessibility failures and specification gaps block; a 2px padding difference does not.',
    },
    {
      kind: 'paragraph',
      text: 'Finding 2.1 is the most interesting one. Internal sort state is not a bug — it works — but it quietly forecloses URL-owned sort, which the product will want. Catching consequences rather than only errors is what distinguishes a senior review.',
    },
  ],
  practicalExercise: {
    id: 'exercise-reviewing-generated-code-and-design',
    title: 'Review across seven dimensions',
    prompt:
      'Review two pieces of work — one generated, one written by someone else — through all seven dimensions, with blocking clearly separated.',
    steps: [
      'Generate a component from a brief, then review it against all seven dimensions in order.',
      'Write each finding with location, observation, consequence and suggested fix.',
      'Separate blocking from non-blocking, and justify the split.',
      'For each finding, say whether a type, lint rule or test could have prevented it.',
      'Implement two of those prevention mechanisms.',
      'Review something written by another person with the same method.',
      'Note where reviewing a person’s work differed from reviewing generated work.',
      'Assess one piece of work for whether it has a point of view, and defend the assessment.',
    ],
    successCriteria: [
      'All seven dimensions covered in order for both reviews.',
      'Every finding has location, observation, consequence and fix.',
      'Blocking and non-blocking separated with reasoning.',
      'Prevention mechanism considered per finding; two implemented.',
      'The difference between the two reviews is articulated.',
      'The point-of-view assessment is argued, not asserted.',
    ],
    estimatedMinutes: 95,
    hint: 'Reviewing a person’s work is a different job: the same findings, delivered differently, because the person will read them. Noticing that difference is most of step seven.',
  },
  reflectionQuestion:
    'Why review correctness and architecture before accessibility and visual fidelity?',
  reflectionHint:
    'Ask what happens to the later findings if an early one requires the work to be restructured.',
  resources: [
    {
      id: 'resource-apg-patterns-15',
      title: 'ARIA Authoring Practices — Patterns',
      url: 'https://www.w3.org/WAI/ARIA/apg/patterns/',
      type: 'documentation',
      author: 'W3C WAI',
      estimatedMinutes: 40,
      note: 'The reference for the accessibility dimension. Check any generated widget against its pattern before accepting it.',
    },
    {
      id: 'resource-axe-core-15',
      title: 'axe-core',
      url: 'https://github.com/dequelabs/axe-core',
      type: 'tool',
      author: 'Deque',
      estimatedMinutes: 25,
      note: 'What to automate so human review does not spend time on it. The limitations documentation is the important part.',
    },
  ],
  competencyTags: ['critique', 'ai-assisted-engineering', 'design-qa', 'accessibility', 'architecture', 'product-judgement'],
  completionCriteria: [
    'Reviews across seven dimensions in order.',
    'Writes findings with location, consequence and fix.',
    'Separates blocking from non-blocking defensibly.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Lesson 74                                                                   */
/* -------------------------------------------------------------------------- */

const LESSON_4: Lesson = {
  id: 'lesson-presenting-design-engineering-work',
  slug: 'presenting-design-engineering-work',
  moduleId: MODULE_ID,
  lessonNumber: 4,
  title: 'Presenting Design Engineering Work',
  summary:
    'The work does not speak for itself. Case studies built around decisions, trade-offs stated honestly, and evidence instead of adjectives.',
  estimatedMinutes: 10,
  objectives: [
    'Structure a case study around decisions rather than process.',
    'Keep a decision log that makes a case study writable afterwards.',
    'State trade-offs honestly without undermining the work.',
    'Explain a technical decision to a non-technical audience.',
  ],
  prerequisiteConcepts: [
    'ADRs, Module 14 lesson 69',
    'Measurement, Module 13',
    'Critique, Module 14 lesson 70',
  ],
  prerequisiteLessonIds: ['lesson-reviewing-generated-code-and-design'],
  recap: [
    {
      kind: 'paragraph',
      text: 'You can now build, measure, review and critique. The remaining gap is that none of it is visible to anybody who was not there.',
    },
  ],
  priorKnowledge: [
    {
      kind: 'paragraph',
      text: 'Module 14 lesson 69 had you write ADRs with context, options, decision and consequences. That structure is also the structure of a good case study section, which is not a coincidence — both exist to make reasoning legible after the fact.',
    },
  ],
  coreConcept: [
    {
      kind: 'paragraph',
      text: 'A design engineering case study is about **decisions**, not process. Nobody needs the chronology; they need to know what was hard and how you thought about it.',
    },
    {
      kind: 'code',
      language: 'markdown',
      code: 'WEAK — process narrative\n  Research → wireframes → hi-fi → build → ship.\n  Reads identically for every project and demonstrates nothing.\n\nSTRONG — decision narrative\n  1. Problem        What was wrong, for whom, with evidence.\n  2. Constraints    What you could not change. Often the most revealing part.\n  3. Decisions      Three to five, each with options and the reason.\n  4. Trade-offs     What you gave up, and what you would revisit.\n  5. Evidence       Measurements, before and after.\n  6. Result         What changed for the user, in their terms.',
    },
    {
      kind: 'paragraph',
      text: 'Section three is the case study. Everything else is context for it.',
    },
    {
      kind: 'paragraph',
      text: 'And a decision is only interesting if there was a real alternative. "I used React" is not a decision; "I kept the sort in the URL rather than component state, which cost a controlled-component indirection and bought shareable views" is.',
    },
  ],
  whyDesignersCare: [
    {
      kind: 'paragraph',
      text: 'Because for a hybrid role, the artefact alone is ambiguous.',
    },
    {
      kind: 'paragraph',
      text: 'A screenshot of a dashboard could be a designer who handed off a mockup or an engineer who implemented someone else’s. It cannot show that you chose the state model, decided the token scale, measured the INP, or designed the reduced-motion alternative.',
    },
    {
      kind: 'paragraph',
      text: 'The decisions are the evidence of the role. Without them, a portfolio of beautiful screens is indistinguishable from a portfolio of beautiful screens somebody else built.',
    },
  ],
  howItWorks: [
    {
      kind: 'paragraph',
      text: 'A **decision log** kept during the work is what makes the case study writable at all.',
    },
    {
      kind: 'code',
      language: 'markdown',
      code: '## 2026-09-18 · Sort state in the URL\nOptions: component state (simple) · URL (shareable) · server preference\n  (persistent, needs a round trip).\nChose: URL. Sorted views get shared in support conversations; that is the\n  actual use. Costs a controlled-component indirection.\nRevisit if: per-user default sort becomes a request.\n\n## 2026-09-21 · Keep rows on failed refetch\nOptions: clear to error state (simpler) · keep rows dimmed with a warning.\nChose: keep. The data is still readable and a transient failure should not\n  destroy what someone is reading.\nCost: an extra field in the async state union; two more renderings to design.\n\n## 2026-09-24 · Hand-rolled fetching rather than a library\nOptions: TanStack Query · hand-rolled.\nChose: hand-rolled, deliberately, to learn cancellation and staleness.\nHonest assessment: a production team should use the library. Would switch.',
    },
    {
      kind: 'paragraph',
      text: 'Three entries, written in two minutes each, at the moment the reasoning was fresh. Reconstructed six weeks later they would be either vague or invented.',
    },
    {
      kind: 'paragraph',
      text: 'The third entry does something a portfolio rarely does: it states that the choice was pedagogical and would be different in production. That reads as judgement rather than as weakness, because it shows you know what the professional answer is.',
    },
  ],
  firstPrinciples: [
    {
      kind: 'paragraph',
      text: 'Evidence replaces adjectives, and the substitution is always an improvement.',
    },
    {
      kind: 'code',
      language: 'markdown',
      code: 'Adjective → Evidence\n\n"Fast"           → LCP 1.4s, INP 90ms, CLS 0.02 on a mid-range Android\n                   over throttled 4G. Baseline was 3.1s / 240ms / 0.18.\n"Accessible"     → Completable by keyboard and with VoiceOver; zero axe\n                   violations; focus restored at every dialog boundary.\n                   Test report attached.\n"Well-architected" → Two ADRs. Adding a filter touches 2 files; adding a\n                   feature touches 1 folder and 1 route.\n"Reusable"       → Eight components, 40 usages, one token source, zero\n                   literal colours outside the token file.\n"Robust"         → Tests for all seven async states; conflict guard\n                   demonstrated with two browsers; session expiry mid-form\n                   loses no input.',
    },
    {
      kind: 'paragraph',
      text: 'Each right-hand entry is checkable, which is what makes it persuasive. Each left-hand entry appears in every portfolio and therefore carries no information.',
    },
    {
      kind: 'callout',
      tone: 'insight',
      body: 'Everything in the right-hand column is something this course had you measure. The measurement was never only for the engineering — it is also what makes the work presentable.',
    },
  ],
  designPerspective: [
    {
      kind: 'paragraph',
      text: 'The design question is who is reading, and what decision they are making.',
    },
    {
      kind: 'paragraph',
      text: 'A hiring manager is deciding whether to interview you and will give it two minutes. An interviewer is deciding whether you can reason and will go deep on one section. A teammate is deciding how to extend your work and needs the ADRs.',
    },
    {
      kind: 'paragraph',
      text: 'Those want different documents. The common structure is a short summary that works alone, with depth available behind it for whoever wants it.',
    },
  ],
  engineeringPerspective: [
    {
      kind: 'paragraph',
      text: 'The engineering question is whether a technical decision can be explained without jargon.',
    },
    {
      kind: 'paragraph',
      text: 'Not simplified — explained. "The filters live in the URL, so you can send someone a link to exactly what you are looking at, and the back button works" is complete, accurate and requires no vocabulary.',
    },
    {
      kind: 'paragraph',
      text: 'The ability to do that reliably is itself a strong signal. A decision you cannot explain in plain terms is one you may not fully understand.',
    },
  ],
  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'Presenting the work is the last place design and engineering have to be one thing.',
    },
    {
      kind: 'paragraph',
      text: 'A case study that is only visual reads as a designer’s. One that is only technical reads as an engineer’s. One that moves between "the empty state needed to distinguish two cases" and "which meant the query had to carry whether a filter was active" demonstrates something neither alone can — and that is the thing you are actually selling.',
    },
  ],
  industryExamples: [
    {
      id: 'example-nng-ux-portfolio',
      source: 'Nielsen Norman Group',
      title: 'Portfolios judged on reasoning',
      observation:
        'Guidance on UX portfolios emphasises showing the thinking, the constraints and the rationale rather than only final visuals.',
      takeaway:
        'The advice predates design engineering and applies more strongly to it, because the engineering decisions are invisible in any screenshot.',
    },
    {
      id: 'example-adr-as-portfolio-15',
      source: 'Architectural Decision Records',
      title: 'Decisions as a durable artefact',
      observation:
        'An ADR records context, options, decision and consequences in a form that remains readable long after the work.',
      takeaway:
        'A repository with ADRs is a portfolio of reasoning. It is also the easiest kind to write, because it was written as you went.',
    },
  ],
  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Write one case study section properly, at three depths.',
    },
    {
      kind: 'code',
      language: 'markdown',
      code: 'ONE LINE (portfolio index)\n  Analytics dashboard where every view is a shareable link — and a failed\n  refresh never loses the data you were reading.\n\nONE PARAGRAPH (project page)\n  The existing dashboard lost its filters on reload and could not be shared,\n  so support conversations were conducted in screenshots. I moved the whole\n  query — search, filters, sort, page — into the URL as a single validated\n  object, which made every view linkable and made the back button behave.\n  The harder problem was failure: a transient refresh error used to clear the\n  table. I modelled the async state to carry the last known data, so a failed\n  refresh now shows a warning above the rows you were already reading.\n  INP went from 240ms to 90ms on a mid-range Android, mostly by removing a\n  layout read from a scroll handler.\n\nONE PAGE (interview depth)\n  Problem, constraints, four decisions with options and trade-offs,\n  the measurements with method stated, and two things I would do differently.',
    },
    {
      kind: 'paragraph',
      text: 'The one-liner leads with the user-facing outcome, not the technique. "Query state in the URL" means nothing to most readers; "every view is a shareable link" means something to everyone.',
    },
  ],
  commonMistakes: [
    {
      id: 'mistake-15-04-process-narrative',
      mistake: 'Structuring a case study as a chronology of phases.',
      why: 'It reads the same for every project and demonstrates no judgement, because no decision is visible in it.',
      instead: 'Structure around three to five decisions, each with its options and reason.',
    },
    {
      id: 'mistake-15-04-adjectives-without-evidence',
      mistake: 'Describing work as fast, accessible or well-architected.',
      why: 'Every portfolio makes those claims, so an unevidenced one carries no information and may invite doubt.',
      instead: 'Give the figure and the method. "INP 90ms on a mid-range Android over throttled 4G."',
    },
  ],
  professionalConsideration: [
    {
      kind: 'paragraph',
      text: 'The decision log is the single highest-return habit in this lesson, and it costs almost nothing.',
    },
    {
      kind: 'paragraph',
      text: 'Two minutes at the moment of the decision produces something you cannot reconstruct afterwards at any cost — the options you were actually weighing and why you discounted one. Six weeks later you remember the outcome and not the reasoning, which is why most case studies are written about what was built rather than about what was decided.',
    },
  ],
  goDeeper: [
    {
      kind: 'paragraph',
      text: 'Everything below was part of the walkthrough above. It is the detail that matters once the core idea has landed, and it is safe to skip on a first pass.',
    },
    {
      kind: 'paragraph',
      text: 'The paragraph does the real work, and notice its shape: a problem with evidence, a decision, a harder second problem, a decision, a measurement with the device named. No adjectives at all.',
    },
    {
      kind: 'paragraph',
      text: 'And the page ends on two things you would do differently. Counter-intuitively that strengthens it — it is the clearest available evidence that you can assess your own work, which is the thing a reviewer is actually trying to establish.',
    },
  ],
  practicalExercise: {
    id: 'exercise-presenting-design-engineering-work',
    title: 'Write one case study from a decision log',
    prompt:
      'Keep a decision log for a piece of work, then write a case study at three depths, with evidence replacing every adjective.',
    steps: [
      'Start a decision log and keep it for at least a week of real work.',
      'Record options, choice, reason and revisit conditions for each decision.',
      'Choose the three to five most interesting decisions.',
      'Write the one-line, one-paragraph and one-page versions.',
      'Replace every adjective with a measurement or a demonstration.',
      'State the method for every figure — device, network, tool.',
      'Include two things you would do differently and why.',
      'Give the one-paragraph version to someone non-technical and ask them to explain it back.',
    ],
    successCriteria: [
      'A real decision log exists, written during the work.',
      'The case study is organised around decisions, not phases.',
      'All three depths exist and each works alone.',
      'No unevidenced adjective remains.',
      'Measurement method stated for every figure.',
      'Two honest revisions are included.',
      'The non-technical reader could explain it back accurately.',
    ],
    estimatedMinutes: 90,
    hint: 'The explain-it-back test is the most informative step. Anything they cannot repeat is either jargon or something you have not understood as well as you think.',
  },
  reflectionQuestion:
    'Why does including what you would do differently strengthen a case study rather than weaken it?',
  reflectionHint:
    'Ask what a reviewer is trying to find out about you, beyond what you built.',
  resources: [
    {
      id: 'resource-nng-ux-portfolio-15',
      title: '5 Steps to Creating a UX-Design Portfolio',
      url: 'https://www.nngroup.com/articles/ux-design-portfolios/',
      type: 'article',
      author: 'Nielsen Norman Group',
      estimatedMinutes: 25,
      note: 'What reviewers look for. Read it as a brief rather than as advice.',
    },
    {
      id: 'resource-web-dev-vitals-15',
      title: 'Web Vitals',
      url: 'https://web.dev/articles/vitals',
      type: 'article',
      author: 'web.dev',
      estimatedMinutes: 25,
      note: 'The figures to quote and the thresholds that make them meaningful. Quote the method alongside the number.',
    },
  ],
  competencyTags: ['critique', 'product-thinking', 'product-judgement', 'design-to-code-translation', 'architecture'],
  completionCriteria: [
    'Structures a case study around decisions with options and trade-offs.',
    'Keeps a decision log during the work.',
    'Replaces adjectives with evidence and states the method.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Lesson 75                                                                   */
/* -------------------------------------------------------------------------- */

const LESSON_5: Lesson = {
  id: 'lesson-planning-and-shipping-the-capstone',
  slug: 'planning-and-shipping-the-capstone',
  moduleId: MODULE_ID,
  lessonNumber: 5,
  title: 'Planning and Shipping the Capstone',
  summary:
    'Scope, plan, milestones, QA, ship, retrospective — and the fact that shipping something small and finished beats something ambitious and abandoned.',
  estimatedMinutes: 10,
  objectives: [
    'Scope a project you will actually finish.',
    'Write a technical and design plan with milestones that are demonstrable.',
    'Run a release checklist rather than deciding by feel.',
    'Run a retrospective that produces something you will use.',
  ],
  prerequisiteConcepts: [
    'Everything in the course',
    'Architecture decisions, Module 14 lesson 69',
    'Presentation, previous lesson',
  ],
  prerequisiteLessonIds: ['lesson-presenting-design-engineering-work'],
  recap: [
    {
      kind: 'paragraph',
      text: 'Seventy-four lessons of technique and judgement. This one is about the discipline that turns them into something finished rather than something in progress.',
    },
  ],
  priorKnowledge: [
    {
      kind: 'paragraph',
      text: 'Every project in this course came with a suggested scope and completion criteria, written for you. This is the first time you write them, which turns out to be the harder half.',
    },
  ],
  coreConcept: [
    {
      kind: 'paragraph',
      text: 'The failure mode of a capstone is scope, and it is almost universal. Ambition is cheap at the planning stage and expensive in week six.',
    },
    {
      kind: 'paragraph',
      text: 'The question is not "what is the most impressive thing I could build" but "what is the smallest thing that demonstrates everything, and can I finish it".',
    },
    {
      kind: 'list',
      items: [
        '**One clear user** — a named kind of person with a real problem, not "users".',
        '**One meaningful workflow** — something they complete, start to finish.',
        '**Two or three screens** — enough for structure, few enough to finish.',
        '**Every state, properly** — this is where the breadth shows, not in feature count.',
      ],
    },
    {
      kind: 'callout',
      tone: 'insight',
      body: 'A two-screen product with every state designed, measured, tested and accessible demonstrates more than a ten-screen product with only happy paths — and the second is what most capstones become.',
    },
  ],
  whyDesignersCare: [
    {
      kind: 'paragraph',
      text: 'Because finished work and unfinished work are not on the same scale.',
    },
    {
      kind: 'paragraph',
      text: 'An unfinished project cannot be shown, cannot be measured, and cannot be written up — so it produces none of the evidence from the previous lesson. The last 20% is where the loading states, the keyboard pass, the error recovery and the measurements live, which is precisely the part that distinguishes the work.',
    },
    {
      kind: 'paragraph',
      text: 'Cutting scope early is therefore not a compromise. It is what makes the valuable part reachable.',
    },
  ],
  howItWorks: [
    {
      kind: 'paragraph',
      text: 'A plan has three parts, and each milestone must be demonstrable.',
    },
    {
      kind: 'code',
      language: 'markdown',
      code: 'SCOPE\n  User     A freelance designer tracking unpaid invoices.\n  Problem  They lose track of what is overdue and chase late.\n  Workflow Add an invoice → see what is overdue → mark it paid.\n  In       List with filters, add/edit, overdue states, totals.\n  Out      Multi-currency. Clients as entities. Reminders. Export. Teams.\n\nDESIGN PLAN\n  M1  Tokens and foundations from Module 10.\n  M2  Components needed, from the Module 8 library.\n  M3  Every screen in every state — including empty, error, long content.\n  M4  Responsive at 320 / 768 / 1280, designed not inferred.\n\nTECHNICAL PLAN\n  M1  Routes and the four state homes decided. ADR for the data model.\n  M2  Data layer: fetching, cancellation, staleness, optimistic mark-as-paid.\n  M3  Screens built from system components only.\n  M4  Resilience: four layers, scoped boundaries, degraded states.\n  M5  Tests for every promised behaviour.\n  M6  Measure and fix: vitals, keyboard, screen reader, design QA.\n\nMILESTONES — each one demonstrable\n  W1  Tokens, foundations, state homes decided, ADR written.\n  W2  All states designed. Components inventoried.\n  W3  List screen works end to end with every async state.\n  W4  Add and edit work. Optimistic mark-as-paid with rollback.\n  W5  Resilience and tests.\n  W6  Measure, fix, write up, ship.',
    },
    {
      kind: 'paragraph',
      text: 'The "Out" list is the most important four words in the plan. Written down, it is a decision; left unwritten, every one of those features will seem reasonable in week three.',
    },
    {
      kind: 'paragraph',
      text: 'And each milestone is something you can show to someone. "Data layer in progress" is not a milestone; "the list screen works end to end with every async state" is, because it can be demonstrated or it cannot.',
    },
  ],
  firstPrinciples: [
    {
      kind: 'paragraph',
      text: 'Shipping needs a checklist, because by the end you are too close to the work to judge it.',
    },
    {
      kind: 'code',
      language: 'markdown',
      code: 'RELEASE CHECKLIST\n\nProduct\n  [ ] The workflow can be completed start to finish by someone new.\n  [ ] Every screen has a purpose a user would recognise.\n\nDesign\n  [ ] Spacing, type and colour from tokens; no literals.\n  [ ] Responsive 320px upwards, checked between breakpoints and at 200% zoom.\n  [ ] Every state designed, including long content and awkward data.\n\nEngineering\n  [ ] Typecheck, lint and tests pass. Production build passes.\n  [ ] No any. No console errors or warnings in production.\n  [ ] Secrets in environment variables; none committed; none in the client bundle.\n\nQuality\n  [ ] Loading, empty, error and success for every async region.\n  [ ] Completable by keyboard alone.\n  [ ] Completable with a screen reader.\n  [ ] Reduced motion honoured throughout.\n  [ ] Zero automated accessibility violations.\n  [ ] Vitals measured on a throttled or real device, inside budget.\n\nPortfolio\n  [ ] Deployed and reachable.\n  [ ] Repository public and its README explains how to run it.\n  [ ] Design file shareable.\n  [ ] Case study at three depths.\n  [ ] Decision log, including at least two ADRs.\n  [ ] Performance and accessibility evidence attached.',
    },
    {
      kind: 'paragraph',
      text: 'The secrets line is not decoration. A committed API key is the single most common and most consequential mistake in a portfolio project, and it is permanent once pushed.',
    },
    {
      kind: 'paragraph',
      text: 'Everything else on that list is something this course taught, which is why the checklist is also a reasonable summary of what the course was for.',
    },
  ],
  designPerspective: [
    {
      kind: 'paragraph',
      text: 'The design question is whether someone new can complete the workflow.',
    },
    {
      kind: 'paragraph',
      text: 'The only way to find out is to watch one person try, without helping. Ten minutes of that is worth more than any amount of self-review, because you cannot un-know your own interface. Note every hesitation; the hesitations are the findings.',
    },
  ],
  engineeringPerspective: [
    {
      kind: 'paragraph',
      text: 'The engineering question is whether it runs anywhere but your machine.',
    },
    {
      kind: 'paragraph',
      text: 'Clone it into a fresh folder, follow your own README exactly, and see whether it starts. Missing environment variables, an undocumented setup step, a dependency you installed globally and forgot — all of it surfaces in five minutes and none of it surfaces any other way. This is Module 6 lesson 30, and it is the step most often skipped at the end.',
    },
  ],
  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'The retrospective is what converts a finished project into improvement.',
    },
    {
      kind: 'code',
      language: 'markdown',
      code: 'RETROSPECTIVE\n\n1. What took longer than expected, and what was the real cause?\n2. Which decision would you make differently, and what would you have\n   needed to know?\n3. Which part are you least confident about, and what would raise it?\n4. Which course module did you reach for most, and which least?\n5. What is the next thing to learn, chosen from an actual gap this\n   project revealed rather than from a list?',
    },
    {
      kind: 'paragraph',
      text: 'Question four is unusually informative. The module you reached for least is either a strength you no longer think about or a gap you have been routing around, and distinguishing those two is worth the time.',
    },
    {
      kind: 'paragraph',
      text: 'Question five is the point of the whole exercise. A gap your own project revealed is a far better guide to what to learn next than any curriculum, including this one.',
    },
  ],
  industryExamples: [
    {
      id: 'example-scope-cutting-practice',
      source: 'Common practice',
      title: 'Narrow scope, finished properly',
      observation:
        'Products admired for their quality tend to launch with a deliberately narrow feature set and unusually complete handling of what they do include.',
      takeaway:
        'The restraint is a strategy, not a limitation. Completeness within a small scope is a stronger signal than breadth.',
    },
    {
      id: 'example-readme-reproducibility',
      source: 'GitHub',
      title: 'A README as the first interface',
      observation:
        'A repository’s README is what any reviewer reads first, and whether the project runs from a fresh clone is the first thing it has to establish.',
      takeaway:
        'A project nobody else can start is, for a reviewer, a project that does not work.',
    },
  ],
  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'The last two weeks are where a capstone is won or lost, and they need planning like the rest.',
    },
    {
      kind: 'code',
      language: 'markdown',
      code: 'WEEK 5 — quality\n  Mon  Resilience: four layers, scoped boundaries, degraded states.\n  Tue  Tests for every promised behaviour; each seen to fail.\n  Wed  Keyboard pass, end to end, hands off the mouse.\n  Thu  Screen reader pass, end to end. Fix what it finds.\n  Fri  Design QA: four passes, full state matrix, severities.\n\nWEEK 6 — ship\n  Mon  Measure: vitals throttled, bundle, long tasks. Fix the largest.\n  Tue  Fresh-clone test. Fix the README until it works untouched.\n  Wed  Deploy. Verify in production, not locally.\n  Thu  Write up: case study at three depths, evidence attached.\n  Fri  Watch one person use it. Fix what makes them hesitate.\n       Retrospective.',
    },
    {
      kind: 'paragraph',
      text: 'Two weeks of the six spent on quality and shipping rather than building. That ratio feels wrong and is correct: it is the two weeks that produce every piece of evidence in your write-up.',
    },
  ],
  commonMistakes: [
    {
      id: 'mistake-15-05-scope-too-large',
      mistake: 'Scoping a capstone by how impressive it would be.',
      why: 'It does not get finished, so none of the evidence that distinguishes the work ever gets produced.',
      instead:
        'Scope by what you can finish, with an explicit out-of-scope list. Depth within a small scope demonstrates more.',
    },
    {
      id: 'mistake-15-05-quality-at-the-end',
      mistake: 'Leaving accessibility, testing and measurement to the final days.',
      why: 'Each one finds problems that take time to fix, and by then there is none. They get dropped rather than done.',
      instead: 'Budget two of six weeks for quality and shipping, and treat that time as unavailable for features.',
    },
  ],
  professionalConsideration: [
    {
      kind: 'paragraph',
      text: 'Finishing is a skill, and it is scarcer than building.',
    },
    {
      kind: 'paragraph',
      text: 'Most people can build most of something. Far fewer will do the keyboard pass, write the README until a stranger can run it, measure on a slow device, and watch someone struggle without jumping in to help. That final stretch is unglamorous and it is the entire difference between a project and a portfolio piece — which is also, not coincidentally, the difference between a competent engineer and one people want on their team.',
    },
  ],
  goDeeper: [
    {
      kind: 'paragraph',
      text: 'Everything below was part of the walkthrough above. It is the detail that matters once the core idea has landed, and it is safe to skip on a first pass.',
    },
    {
      kind: 'paragraph',
      text: 'Note that deployment is Wednesday of the last week, not Friday. Something always goes wrong in production — an environment variable missing from the build, a configuration difference, an asset path — and discovering it with two days left is survivable.',
    },
    {
      kind: 'paragraph',
      text: 'And the user test is last, deliberately, because it tests the thing you are shipping rather than an earlier version of it.',
    },
  ],
  practicalExercise: {
    id: 'exercise-planning-and-shipping-the-capstone',
    title: 'Plan the capstone',
    prompt:
      'Write the complete plan for your capstone before building anything: scope, out-of-scope, design plan, technical plan, demonstrable milestones, and the release checklist.',
    steps: [
      'Name one user and one problem, specifically.',
      'Define one workflow they complete start to finish.',
      'Write the in-scope list, then the out-of-scope list. Make the second longer.',
      'Write the design plan and the technical plan as milestones.',
      'Make every milestone demonstrable — something you could show someone.',
      'Reserve a third of the time for quality and shipping, and mark it unavailable.',
      'Write the release checklist now, while you are not under pressure.',
      'Show the plan to someone and ask them where it is too ambitious.',
    ],
    successCriteria: [
      'One named user, one problem, one complete workflow.',
      'An out-of-scope list that is longer than the in-scope list.',
      'Both plans expressed as demonstrable milestones.',
      'A third of the schedule reserved for quality and shipping.',
      'The release checklist exists before building starts.',
      'External feedback on scope has been sought and acted on.',
    ],
    estimatedMinutes: 85,
    hint: 'When someone tells you the plan is too ambitious, believe them. Every capstone is too ambitious, and the ones that ship are the ones cut in week one rather than week five.',
  },
  reflectionQuestion:
    'Why does a two-screen product with every state handled demonstrate more than a ten-screen product with only happy paths?',
  reflectionHint:
    'Ask which of the two requires the things that are hard.',
  resources: [
    {
      id: 'resource-wcag-quickref-15',
      title: 'How to Meet WCAG (Quick Reference)',
      url: 'https://www.w3.org/WAI/WCAG22/quickref/',
      type: 'documentation',
      author: 'W3C WAI',
      estimatedMinutes: 40,
      note: 'The accessibility half of the release checklist. Filter to level AA and work through it before shipping.',
    },
    {
      id: 'resource-typescript-handbook-15',
      title: 'TypeScript Handbook',
      url: 'https://www.typescriptlang.org/docs/handbook/intro.html',
      type: 'documentation',
      author: 'TypeScript',
      estimatedMinutes: 60,
      note: 'Worth a second pass before the capstone. The utility types and narrowing chapters repay rereading with experience.',
    },
  ],
  competencyTags: ['product-thinking', 'product-judgement', 'architecture', 'design-qa', 'testing', 'accessibility'],
  completionCriteria: [
    'Scopes a project with an explicit out-of-scope list.',
    'Writes demonstrable milestones with time reserved for quality.',
    'Has a release checklist written before building begins.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Capstone                                                                    */
/* -------------------------------------------------------------------------- */

const PROJECT: ModuleProject = {
  id: 'project-capstone',
  slug: 'capstone',
  moduleId: MODULE_ID,
  title: 'Production-Quality Design Engineering Product',
  brief:
    'Design, build, measure and ship one complete product that demonstrates the whole course: a real workflow, a coherent design system, sound architecture, verified accessibility, measured performance, and a written case study with evidence.',
  learnerGoal:
    'Ship one piece of work that makes the case for you without needing to be explained — and be able to explain every decision in it anyway.',
  problem:
    'Everything before this was scoped by someone else. The capstone is the first time you decide what to build, how much of it, and when it is finished — which is the actual job, and the part no exercise can teach.',
  prerequisiteLessonIds: [
    'lesson-ai-as-an-implementation-partner',
    'lesson-design-to-code-workflows',
    'lesson-reviewing-generated-code-and-design',
    'lesson-presenting-design-engineering-work',
    'lesson-planning-and-shipping-the-capstone',
  ],
  objectives: [
    'Ship a complete, finished product rather than an impressive unfinished one.',
    'Demonstrate design, engineering, systems and quality in one artefact.',
    'Produce evidence for every quality claim.',
    'Explain every significant decision with its trade-offs.',
  ],
  requirements: [
    'PRODUCT — a clear problem, one named user, and one meaningful workflow they complete.',
    'DESIGN — hierarchy, typography, spacing, responsive behaviour, interaction and every state, all designed rather than inferred.',
    'ENGINEERING — TypeScript strict, React, reusable components, real data handling, a defensible architecture, error handling, verified accessibility and measured performance.',
    'SYSTEMS — a token set, documented component relationships, design-to-code parity, and a written state model.',
    'QUALITY — loading, empty, error and success states; full keyboard operability; reduced motion; responsive from 320px; and tests covering the critical path.',
    'PORTFOLIO — a live deployment, a public repository, a shareable design file, a case study, a decision log, a technical explanation, and performance and accessibility evidence.',
  ],
  constraints: [
    'No feature outside the scope you wrote in advance.',
    'No quality claim without attached evidence.',
    'No secrets committed, and none reachable in the client bundle.',
    'No component outside the system without a written reason.',
    'No skipping the fresh-clone test, the keyboard pass or the screen reader pass.',
  ],
  suggestedScope:
    'One workflow across two or three screens, built to a standard you would defend in an interview. Roughly six weeks at a realistic pace, with two of them reserved for quality and shipping. Narrow and finished beats broad and partial.',
  deliverables: [
    'The deployed product, reachable by a link.',
    'The public repository, with a README that works from a fresh clone.',
    'The design file, shareable, with every state present.',
    'The case study at three depths, with evidence instead of adjectives.',
    'The decision log, including at least two ADRs with honest downsides.',
    'Performance evidence: vitals with the method stated.',
    'Accessibility evidence: automated audit, keyboard pass, screen reader pass.',
    'A retrospective, including what you would do differently.',
  ],
  completionCriteria: [
    'The workflow can be completed start to finish by someone who has never seen it.',
    'Every state is designed and built, including empty, error and long-content cases.',
    'Fully operable by keyboard alone, and completable with a screen reader.',
    'Zero automated accessibility violations; reduced motion honoured throughout.',
    'Responsive from 320px, verified between breakpoints and at 200% zoom.',
    'All visual values come from tokens; no literals outside the token file.',
    'Typecheck, lint, tests and the production build all pass.',
    'Vitals measured on a throttled or real device and inside a stated budget.',
    'The project runs from a fresh clone following only the README.',
    'No secret is committed or present in the client bundle.',
    'Every quality claim in the case study has evidence attached.',
    'At least two ADRs exist, each stating its downsides.',
  ],
  portfolioEvidence: [
    'The whole role in one artefact — design decisions and engineering decisions made by the same person, visibly.',
    'Completeness — the states, the keyboard, the measurements: the parts most projects omit.',
    'Evidence — figures with methods, not adjectives.',
    'Judgement — scope cut deliberately, decisions recorded with their trade-offs, and an honest retrospective.',
  ],
  reflectionQuestion:
    'What does this project demonstrate that none of the previous fourteen did?',
  estimatedHours: 120,
  /* The capstone exercises the whole course — see requirements above — but the
   * competencies it *demonstrates* are those this module teaches. Visual
   * hierarchy, typography and the rest are credited through the modules that
   * taught them and the projects that proved them, not a second time here. */
  competencies: [
    'ai-assisted-engineering',
    'design-to-code-translation',
    'design-systems-implementation',
    'architecture',
    'design-qa',
    'accessibility',
    'testing',
    'performance',
    'product-thinking',
    'product-judgement',
    'ux-reasoning',
    'react',
    'typescript',
  ],
  stretchGoals: [
    'Have someone extend the product using only your documentation, and record every question they had to ask.',
    'Run the nine-layer critique on your own finished product and publish the findings you chose not to fix.',
    'Measure it on a real low-end device and publish those figures rather than the throttled ones.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Module                                                                      */
/* -------------------------------------------------------------------------- */

export const MODULE_15: CurriculumModule = {
  id: MODULE_ID,
  slug: 'advanced-design-engineering-and-capstone',
  moduleNumber: 15,
  phase: 'product-judgement',
  title: 'Advanced Design Engineering and Capstone',
  description:
    'Leverage and evidence: delegating implementation without delegating judgement, moving between design and code without losing fidelity, reviewing work across seven dimensions, presenting decisions rather than process, and shipping one finished product.',
  outcome:
    'Can specify, delegate, review, explain and ship design engineering work to a standard that stands up to scrutiny.',
  prerequisites: [
    'Module 10 — the token system and parity this module depends on',
    'Module 13 — the measurement that becomes the evidence',
    'Module 14 — architecture decisions and the critique method',
  ],
  lessons: [LESSON_1, LESSON_2, LESSON_3, LESSON_4, LESSON_5],
  resources: [
    {
      id: 'resource-module-15-anthropic-engineering',
      title: 'Anthropic Engineering',
      url: 'https://www.anthropic.com/engineering',
      type: 'article',
      author: 'Anthropic',
      estimatedMinutes: 60,
      note: 'Working with coding models in practice. Read for the emphasis on context, constraints and verification.',
    },
    {
      id: 'resource-module-15-nng-portfolio',
      title: '5 Steps to Creating a UX-Design Portfolio',
      url: 'https://www.nngroup.com/articles/ux-design-portfolios/',
      type: 'article',
      author: 'Nielsen Norman Group',
      estimatedMinutes: 25,
      note: 'What reviewers actually look for. Treat it as the brief for your case study.',
    },
    {
      id: 'resource-module-15-figma-talks',
      title: 'Figma on YouTube',
      url: 'https://www.youtube.com/@Figma',
      type: 'video',
      author: 'Figma',
      estimatedMinutes: 60,
      note: 'Search for design engineering and design systems talks from Config. Several cover presenting hybrid work specifically.',
    },
    {
      id: 'resource-module-15-design-tokens-format',
      title: 'Design Tokens Format Module',
      url: 'https://tr.designtokens.org/format/',
      type: 'tool',
      author: 'Design Tokens Community Group',
      estimatedMinutes: 35,
      note: 'The neutral token format for a single source feeding both tools. Use it for the capstone’s token layer.',
    },
  ],
  project: PROJECT,
  competencies: [
    'ai-assisted-engineering',
    'design-to-code-translation',
    'design-systems-implementation',
    'design-systems',
    'critique',
    'product-judgement',
    'product-thinking',
    'architecture',
    'component-api-design',
    'design-qa',
    'accessibility',
    'testing',
    'performance',
    'ux-reasoning',
    'react',
    'typescript',
  ],
  completionCriteria: [
    'All five lessons completed.',
    'Capstone marked completed.',
    'Can specify, review, explain and ship work to a professional standard.',
  ],
};
