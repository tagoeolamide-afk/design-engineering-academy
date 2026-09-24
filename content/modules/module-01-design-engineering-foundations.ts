/**
 * Module 01 — Design Engineering Foundations.
 *
 * Teaches the interface as a system: states, inputs, rules, transitions,
 * feedback, and constraints. Everything later in the course assumes this
 * vocabulary.
 */

import type { CurriculumModule, Lesson, ModuleProject } from '@/types/curriculum';

const MODULE_ID = 'module-01';

/* -------------------------------------------------------------------------- */
/* Lesson 1                                                                    */
/* -------------------------------------------------------------------------- */

const LESSON_1: Lesson = {
  id: 'lesson-01-01',
  slug: 'interfaces-are-stateful-systems',
  moduleId: MODULE_ID,
  lessonNumber: 1,
  title: 'Interfaces Are Stateful Systems',
  summary:
    'A screen is one frame of a system. The system holds state, renders a representation of it, moves between states, reports what happened, and refuses what is not allowed.',
  estimatedMinutes: 9,

  objectives: [
    'Distinguish a screen from the system that produces it.',
    'Describe an interface as state, representation, transition, feedback, and constraints.',
    'Use a state machine as a working mental model rather than a diagram exercise.',
    'Identify states a design has left undefined before building it.',
  ],

  prerequisiteConcepts: [
    'Basic familiarity with a design tool',
    'Having used a web application',
  ],

  recap: [
    {
      kind: 'paragraph',
      text: 'This is the first lesson, so there is nothing to recap. Each later lesson opens by connecting back to what you already built.',
    },
  ],

  coreConcept: [
    {
      kind: 'paragraph',
      text: 'A screen is what the system looks like at one instant. The system is what decides which instant you are looking at. Design tools show you screens, which makes it easy to believe the screens are the product. They are output.',
    },
    {
      kind: 'callout',
      tone: 'insight',
      title: 'The model this course is built on',
      body: 'Interface = State + Representation + Transition + Feedback + Constraints',
    },
    {
      kind: 'list',
      items: [
        'State — the facts the system currently holds. Not pixels: values. Which row is selected, whether a request is in flight, what has been typed, who is signed in.',
        'Representation — how those facts are rendered. One state can have many valid representations; choosing between them is most of visual and interaction design.',
        'Transition — how the system moves from one state to another, and what the user experiences during the move.',
        'Feedback — how the system reports what happened, what is happening, and what it did with the input.',
        'Constraints — what the system refuses. States it will not enter, input it will not accept, actions it disables and why.',
      ],
    },
    {
      kind: 'paragraph',
      text: 'When an interface feels broken, confusing, or cheap, one of those five was usually never decided. Undecided parts do not disappear. They get decided by accident, late, by whoever is closest to the code.',
    },
  ],

  firstPrinciples: [
    {
      kind: 'paragraph',
      text: 'Start with something that is not software. A light switch has two states, a representation (the toggle position), a transition (the flick), feedback (the click and the room changing), and a constraint (it cannot be half on).',
    },
    {
      kind: 'paragraph',
      text: 'Remove one part and watch what happens. A silent switch controlling a bulb in another room still works perfectly, and is genuinely hard to use. You flick it, learn nothing, and flick it again. Nothing about its appearance changed. The interface still failed.',
    },
    {
      kind: 'paragraph',
      text: 'That is the argument for the model. Quality is distributed across all five parts, and a failure in any one of them reaches the user as "this is bad" regardless of how the screen looks.',
    },
  ],

  designPerspective: [
    {
      kind: 'paragraph',
      text: 'Designers meet the system through representation, because that is what a canvas shows. The risk is mistaking the artefact for the system: a frame is one representation of one state, and a flow of six frames is six states out of a space that may hold forty.',
    },
    {
      kind: 'paragraph',
      text: 'The senior move is to design the state space before the screens. Ask what states are reachable — empty, loading, partial, stale, offline, denied, error, success — then decide which deserve their own representation and which can share one. The screens fall out of that decision instead of being invented one at a time.',
    },
    {
      kind: 'callout',
      tone: 'note',
      body: 'A design is finished when every state the system can reach has a defined representation. Not when the happy path looks good.',
    },
  ],

  engineeringPerspective: [
    {
      kind: 'paragraph',
      text: 'Engineers meet the same system from the other side. In a component, state is explicit — it is a value — and the rendered output is a function of it. That is what a modern UI framework actually provides.',
    },
    {
      kind: 'code',
      language: 'tsx',
      caption: 'Four states, declared. The type is a design decision written in code.',
      code: `type RenameState =
  | { status: 'idle' }
  | { status: 'editing'; draft: string }
  | { status: 'saving'; draft: string }
  | { status: 'failed'; draft: string; message: string };

// Because the states are a union, "saving and failed at once" cannot be
// represented. The compiler is enforcing a design rule.`,
    },
    {
      kind: 'paragraph',
      text: 'A state machine is the same idea with the legal moves written down: from idle you can begin editing; from editing you can save or cancel; from saving you can succeed or fail. Anything not listed is not a bug to be handled later, it is a move the system does not make.',
    },
  ],

  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'The designer enumerating states on a canvas and the engineer declaring a union type are doing the same work in different notations. When they disagree, it is usually because one of them enumerated states the other never saw.',
    },
    {
      kind: 'paragraph',
      text: 'This is the gap a design engineer closes, and it is why the role exists — not because someone should be able to both draw and code, but because the state space is a shared artefact currently owned by nobody. Handing over six frames and hoping the remaining thirty-four states get invented tastefully is how products end up inconsistent in exactly the places users notice.',
    },
    {
      kind: 'callout',
      tone: 'insight',
      body: 'A mockup specifies representation. It cannot specify state, transition, feedback, or constraints. Four fifths of the interface is decided somewhere else.',
    },
  ],

  industryExamples: [
    {
      id: 'example-react-snapshot',
      source: 'React',
      title: 'Render as a function of state',
      observation:
        'React renders a snapshot: given the state at a moment, produce the output for that moment. You do not write instructions to mutate the screen — you describe what each state looks like and let the framework reconcile.',
      takeaway:
        'The framework is built on the same model this lesson describes. Teams that enumerate state badly fight their framework constantly, because they are trying to express states the data cannot represent.',
    },
    {
      id: 'example-apple-feedback',
      source: 'Apple',
      title: 'Feedback as a design obligation',
      observation:
        "Apple's interface guidance treats feedback as a requirement rather than a nicety: every action acknowledges receipt, progress is shown for anything slow, and the result is reported whether it succeeded or not.",
      takeaway:
        'Feedback is a named part of the system with its own standards, not a decoration applied after the layout is agreed.',
    },
    {
      id: 'example-linear-optimistic',
      source: 'Linear',
      title: 'Optimistic state as a product decision',
      observation:
        'Changing an issue in Linear updates immediately, before the server confirms. The interface enters the new state on the assumption the write will succeed, and reconciles if it does not.',
      takeaway:
        'They chose which state to represent — the intended one, not the confirmed one — and accepted the cost of handling reconciliation. That choice is invisible in any static mockup and is most of why the product feels fast.',
    },
  ],

  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Take a rename control — the kind that turns a title into an editable field — and pull the five parts out of it.',
    },
    { kind: 'heading', text: '1. Name the state as values' },
    {
      kind: 'paragraph',
      text: 'Not "the input". The system holds: whether the field is open, what has been typed, whether a save is in flight, and whether the last attempt failed and why. Four facts.',
    },
    { kind: 'heading', text: '2. Enumerate what is reachable' },
    {
      kind: 'list',
      ordered: true,
      items: [
        'Idle — showing the current name.',
        'Editing — field open, draft differs or does not.',
        'Editing, invalid — draft is empty or too long.',
        'Saving — request in flight.',
        'Failed — rejected, with a reason, draft preserved.',
      ],
    },
    { kind: 'heading', text: '3. Decide representation per state' },
    {
      kind: 'paragraph',
      text: 'Does saving change the label, dim the field, or show nothing? Can two states share a representation? They can — but that is now a decision, not an omission.',
    },
    { kind: 'heading', text: '4. Decide transitions and feedback' },
    {
      kind: 'paragraph',
      text: 'What does the user see between editing and saved? If the save takes 80ms, a spinner makes the product feel slower. If it takes four seconds, showing nothing makes it feel broken. Duration is part of the design.',
    },
    { kind: 'heading', text: '5. Decide constraints' },
    {
      kind: 'paragraph',
      text: 'Can the name be empty? Can the dialog be closed mid-save? Can the same name be submitted twice? Every "no" is a constraint, and every constraint needs a representation — a disabled control that never explains itself is experienced as a broken product.',
    },
    {
      kind: 'callout',
      tone: 'pitfall',
      title: 'Where this usually goes wrong',
      body: 'Teams design state 2, build states 2 and 4, and meet states 3 and 5 in production. The states existed the whole time.',
    },
  ],

  commonMistakes: [
    {
      id: 'mistake-happy-path',
      mistake: 'Designing only the state where everything worked.',
      why: 'The happy path is the easiest state to imagine and the one a canvas invites you to draw. The other states are where users get stuck, and they get built last, under time pressure.',
      instead:
        'List reachable states before drawing anything. Empty, loading, partial, error, and denied are design work, not edge cases.',
    },
    {
      id: 'mistake-state-as-visual',
      mistake: 'Treating state as a visual style rather than a value.',
      why: '"The greyed-out version" describes a representation, not a state. It hides the real question — what fact is true that makes this unavailable? — and different facts deserve different treatment.',
      instead:
        'Write state as data first. "Saving" and "not permitted" both produce a disabled button and should not say the same thing.',
    },
    {
      id: 'mistake-boolean-soup',
      mistake: 'Modelling state as a bag of independent booleans.',
      why: 'Four booleans allow sixteen combinations, most of which are nonsense. You then spend months defending against combinations your design never intended.',
      instead:
        'Prefer a union of named states. Make the impossible combinations unrepresentable rather than merely unlikely.',
    },
    {
      id: 'mistake-silent-transition',
      mistake: 'Changing state without reporting it.',
      why: 'A system that acts silently forces the user to verify everything manually — the light switch with the bulb in another room.',
      instead:
        'Every state change the user caused needs feedback proportionate to its cost. Cheap and reversible can be quiet; expensive or irreversible cannot.',
    },
  ],

  eliteConsiderations: [
    {
      kind: 'paragraph',
      text: 'Competent practitioners enumerate states. Strong practitioners design the state space so bad states cannot be represented at all.',
    },
    {
      kind: 'list',
      items: [
        'Treat "loading" as a property of a specific piece of data, not of a whole screen — otherwise every partial load becomes a full-page spinner.',
        'Distinguish "empty because nothing exists yet" from "empty because the filter excluded everything". Identical emptiness, entirely different response.',
        'Decide the duration below which a transition should not be shown at all, and apply it everywhere. Inconsistent thresholds are why some products feel jittery.',
        'Ask who owns each piece of state — the component, the page, the server, or another user. Unclear ownership is where synchronisation bugs live.',
      ],
    },
  ],

  practicalExercise: {
    id: 'exercise-01-01',
    title: 'State map for a Rename Project dialog',
    prompt:
      'Produce a complete state map for a dialog that renames a project. Assume the new name is saved to a server that can be slow and can reject the request.',
    steps: [
      'Write the state as values. Aim for the shortest list that fully determines what the user sees.',
      'Enumerate every reachable state, including validation failure, request failure, and the state after a successful save.',
      'For each state, note its representation, and mark any two states that deliberately share one.',
      'List the legal transitions between states, and the trigger for each.',
      'Note the intended duration of any transition the user will perceive.',
      'List the constraints: what the dialog refuses, and whether each refusal is explained.',
      'Mark any state you suspect a real product would have left undesigned.',
    ],
    successCriteria: [
      'State is written as values, with no visual adjectives.',
      'At least two failure states are present and distinguished from each other.',
      'Every transition has a named trigger.',
      'Every constraint is paired with whether the user is told about it.',
      'The map shows what happens if the dialog is closed mid-save.',
    ],
    estimatedMinutes: 20,
    hint: 'If your state list exceeds about six entries for one dialog, you are probably listing representations rather than states. Ask what fact is true, not what it looks like.',
  },

  reflectionQuestion:
    'Should rename update optimistically, or wait for server confirmation?',
  reflectionHint:
    'Think about reversibility and the cost of being wrong. How visible is a rename, who else sees it, and what does recovery look like if the write fails after you have already shown the new name?',

  resources: [
    {
      id: 'resource-react-state-snapshot',
      title: 'State as a Snapshot',
      url: 'https://react.dev/learn/state-as-a-snapshot',
      type: 'documentation',
      estimatedMinutes: 20,
      note: 'The declarative framing: describe what each state looks like rather than the steps to mutate the screen.',
    },
    {
      id: 'resource-statecharts',
      title: 'Statecharts: a visual formalism for complex systems',
      url: 'https://www.sciencedirect.com/science/article/pii/0167642387900359',
      type: 'specification',
      author: 'David Harel',
      estimatedMinutes: 45,
      note: 'The origin of modelling interfaces as explicit state machines. Skim for the core idea.',
    },
    {
      id: 'resource-hig-feedback',
      title: 'Human Interface Guidelines: feedback',
      url: 'https://developer.apple.com/design/human-interface-guidelines/',
      type: 'documentation',
      estimatedMinutes: 15,
      note: 'Feedback treated as an obligation with standards, not a finishing touch.',
    },
  ],

  competencyTags: ['product-thinking', 'ux-reasoning', 'interface-state-modelling'],

  completionCriteria: [
    'Can state the five-part model from memory.',
    'Has produced a state map with at least two distinct failure states.',
    'Can explain what a mockup does and does not specify.',
    'Has taken a position on optimistic rename and can defend it.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Lesson 2                                                                    */
/* -------------------------------------------------------------------------- */

const LESSON_2: Lesson = {
  id: 'lesson-01-02',
  slug: 'inputs-outputs-constraints-and-feedback',
  moduleId: MODULE_ID,
  lessonNumber: 2,
  title: 'Inputs, Outputs, Constraints and Feedback',
  summary:
    'Every interface is fed by two kinds of input, governed by rules, and answerable through outputs. Where the rules run, and when they report, is a design decision.',
  estimatedMinutes: 9,

  objectives: [
    'Separate user input from system input.',
    'Express a rule independently of where it is enforced.',
    'Choose between immediate and delayed feedback deliberately.',
    'Identify which outputs an interface owes the user.',
  ],

  prerequisiteConcepts: [
    'Interfaces as state systems',
    'The difference between state and representation',
  ],

  prerequisiteLessonIds: ['lesson-01-01'],

  recap: [
    {
      kind: 'paragraph',
      text: 'Last lesson framed the interface as state, representation, transition, feedback, and constraints. This lesson opens up two of those parts: where state comes from, and how the system answers.',
    },
  ],

  coreConcept: [
    {
      kind: 'paragraph',
      text: 'State does not appear from nowhere. It is produced by input, filtered by rules, and reported through output. Splitting input into two kinds makes most confusing interfaces legible.',
    },
    {
      kind: 'list',
      items: [
        'User input — typing, pointing, dragging, pressing keys, submitting. Intentional, and under the user\'s control.',
        'System input — server responses, timers, network status, permissions, other users, the clock. Arrives unasked and often at the worst moment.',
      ],
    },
    {
      kind: 'paragraph',
      text: 'Most interface bugs that feel unfair are collisions between the two: the user was typing when a refresh replaced the data, or pressed submit at the moment the session expired. If you have only modelled user input, those collisions have no defined behaviour.',
    },
    {
      kind: 'paragraph',
      text: 'Outputs are what the system owes back: the rendered representation, validation messages, status announcements, persisted data, and requests sent onward. Each is a promise. Every input the user gives should produce at least one output they can perceive.',
    },
  ],

  firstPrinciples: [
    {
      kind: 'paragraph',
      text: 'A rule is a statement about which values are acceptable. It exists independently of where it runs. "A password must be at least twelve characters" is true in the browser, on the server, and in the database — the same rule, enforced in three places for three different reasons.',
    },
    {
      kind: 'paragraph',
      text: 'The browser enforces it for speed of feedback. The server enforces it because the browser cannot be trusted. The database enforces it because code has bugs. Confusing these is how teams end up with client validation that is stricter than the server, or a server that rejects something the interface said was fine.',
    },
    {
      kind: 'callout',
      tone: 'note',
      body: 'Client-side validation is a feedback feature. It is never a security feature. Anything that matters is re-checked where the user cannot reach it.',
    },
  ],

  designPerspective: [
    {
      kind: 'paragraph',
      text: 'The design question is not whether to validate but when to speak. Feedback has a schedule, and the schedule changes how the same rule feels.',
    },
    {
      kind: 'list',
      items: [
        'Immediate — as the user types. Useful when the answer is knowable mid-construction: a password strength meter, a character counter, an availability check.',
        'On exit — when the field loses focus. Useful when the value is only meaningful once complete: an email address, a date.',
        'On submit — when the whole form is offered. Useful for rules that span fields, like a confirmation matching.',
        'Deferred — after the server has spoken. Unavoidable for anything the client cannot know.',
      ],
    },
    {
      kind: 'paragraph',
      text: 'The failure mode of immediate feedback is scolding the user for an answer they have not finished writing. "a@" is not an invalid email address; it is an unfinished one. Reporting it as an error teaches the user to ignore errors.',
    },
  ],

  engineeringPerspective: [
    {
      kind: 'paragraph',
      text: 'Modelling rules as data rather than scattered conditionals lets the same definition drive the message, the field state, and the submit constraint.',
    },
    {
      kind: 'code',
      language: 'ts',
      caption: 'One rule, evaluated when the interface decides to ask.',
      code: `type Rule = {
  id: string;
  test: (value: string) => boolean;
  message: string;
  // When the user should first hear about a failure.
  announceAt: 'typing' | 'blur' | 'submit';
};

const passwordRules: Rule[] = [
  { id: 'length', test: (v) => v.length >= 12,
    message: 'At least 12 characters', announceAt: 'typing' },
  { id: 'number', test: (v) => /\\d/.test(v),
    message: 'At least one number', announceAt: 'typing' },
];

// Requirements can now be listed up front and re-used as live feedback,
// rather than existing once as prose and again as an if-statement.`,
    },
  ],

  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'A password field is where the two disciplines meet most visibly. The engineer sees a predicate; the designer sees a moment of judgement about the user\'s state of mind. Both are describing the same rule.',
    },
    {
      kind: 'paragraph',
      text: 'The strongest pattern — showing requirements as a checklist that fills in as you type — is simultaneously a data decision and an interaction decision. The rules had to be enumerable data for the checklist to exist, and the checklist only helps because it answers before the user is judged.',
    },
  ],

  industryExamples: [
    {
      id: 'example-stripe-card',
      source: 'Stripe',
      title: 'Validation timed to the moment the answer can be wrong',
      observation:
        'A Stripe card field does not report an invalid number while you are still typing it. The message appears when you leave the field, or as soon as the input can no longer become valid.',
      takeaway:
        'Same rule, same representation, different moment — and the difference between a form that helps and one that nags.',
    },
    {
      id: 'example-github-username',
      source: 'GitHub',
      title: 'System input as part of validation',
      observation:
        'Username availability cannot be known on the client. GitHub checks as you type, shows a pending state, and reports the answer when it arrives.',
      takeaway:
        'A rule that requires a round trip introduces a loading state into a text field. That state must be designed, or the field appears to do nothing.',
    },
  ],

  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Map a signup form completely before styling anything.',
    },
    { kind: 'heading', text: 'Inventory the inputs' },
    {
      kind: 'paragraph',
      text: 'User: email, password, accepting terms, submit. System: whether the email is already registered, whether the request succeeded, whether the session already exists, network availability.',
    },
    { kind: 'heading', text: 'Write the rules' },
    {
      kind: 'list',
      items: [
        'Email must be syntactically plausible — knowable on the client.',
        'Email must not already be registered — knowable only on the server.',
        'Password must meet length and character rules — client, re-checked server-side.',
        'Terms must be accepted — client.',
      ],
    },
    { kind: 'heading', text: 'Assign each rule a moment' },
    {
      kind: 'paragraph',
      text: 'Password rules announce while typing, because the user is constructing against them. Email syntax announces on blur, because a half-typed address is not wrong yet. Registration conflict announces when the server answers.',
    },
    { kind: 'heading', text: 'List the outputs' },
    {
      kind: 'paragraph',
      text: 'For each rule: the message, where it appears, and how it is announced to a screen reader. For the form: the pending state, the success destination, and the failure state that preserves what was typed.',
    },
  ],

  commonMistakes: [
    {
      id: 'mistake-validate-while-constructing',
      mistake: 'Marking a field invalid while the user is still typing it.',
      why: 'It treats an unfinished answer as a wrong one. Users learn that the red text is noise and stop reading it.',
      instead:
        'Announce on blur for values that are only meaningful complete. Announce while typing only when the feedback is a target to aim at, like a password requirement.',
    },
    {
      id: 'mistake-client-only-rules',
      mistake: 'Trusting client validation as enforcement.',
      why: 'Anything running in the browser can be bypassed. Client rules exist for feedback speed.',
      instead:
        'Enforce every rule that matters on the server, and treat the client copy as a user-experience optimisation that must agree with it.',
    },
    {
      id: 'mistake-unmodelled-system-input',
      mistake: 'Modelling only what the user does.',
      why: 'Sessions expire, sockets reconnect, and other people edit the same record. If those arrivals have no defined behaviour, they overwrite work or produce impossible screens.',
      instead:
        'List the system inputs alongside the user inputs, and decide what each one does to in-progress work.',
    },
    {
      id: 'mistake-error-without-recovery',
      mistake: 'Reporting a failure without preserving the input.',
      why: 'A failed submit that clears the form punishes the user for the system\'s problem.',
      instead:
        'Treat the failure state as a state with a representation: keep the draft, say what happened, and make retrying cheap.',
    },
  ],

  eliteConsiderations: [
    {
      kind: 'list',
      items: [
        'Write rules once, as data, and derive both the up-front requirement list and the live feedback from the same source.',
        'Decide what happens to a pending validation request when the value changes again — a slow answer about an old value is worse than no answer.',
        'Announce validation changes to assistive technology deliberately; a visual-only error is invisible to part of your audience.',
        'Distinguish "cannot submit yet" from "submitting is disabled" — the first is a state of the form, the second is a constraint you owe an explanation for.',
      ],
    },
  ],

  practicalExercise: {
    id: 'exercise-01-02',
    title: 'Map an account signup flow',
    prompt:
      'Take an account signup flow and map every input, rule, and output in it. Do not design any visuals.',
    steps: [
      'List the user inputs, including the ones that are not fields — submit, cancel, navigating away.',
      'List the system inputs: server responses, timeouts, existing sessions, network loss.',
      'Write each rule as a statement about acceptable values, independent of where it runs.',
      'For each rule, mark where it is enforced and when the user first hears about a failure.',
      'List the outputs the flow owes: messages, status announcements, the success destination, and what persists on failure.',
      'Identify one rule whose answer requires a round trip, and describe the state the field is in while waiting.',
    ],
    successCriteria: [
      'User and system inputs are listed separately.',
      'Every rule states where it is enforced and when it announces.',
      'At least one rule requires server knowledge, and its pending state is described.',
      'The failure output preserves what the user typed.',
      'Every input has at least one perceivable output.',
    ],
    estimatedMinutes: 25,
    hint: 'If a rule has no moment attached to it, it has not been designed yet — only written down.',
  },

  reflectionQuestion:
    'Should invalid input be blocked while typing, or evaluated after interaction?',
  reflectionHint:
    'Consider whether the user is still constructing the answer. A rule that is a target to aim at behaves differently from a rule that judges a finished value.',

  resources: [
    {
      id: 'resource-mdn-validation',
      title: 'Client-side form validation',
      url: 'https://developer.mozilla.org/en-US/docs/Learn/Forms/Form_validation',
      type: 'documentation',
      estimatedMinutes: 25,
      note: 'What the platform validates for free, and where the constraint API stops.',
    },
    {
      id: 'resource-nngroup-errors',
      title: 'Error message guidelines',
      url: 'https://www.nngroup.com/articles/error-message-guidelines/',
      type: 'article',
      author: 'Nielsen Norman Group',
      estimatedMinutes: 12,
      note: 'What a useful failure output contains, and what makes one useless.',
    },
  ],

  competencyTags: ['ux-reasoning', 'interaction-design', 'interface-state-modelling'],

  completionCriteria: [
    'Can separate user input from system input in a real flow.',
    'Can state a rule independently of where it is enforced.',
    'Has assigned an announcement moment to every rule in a mapped flow.',
    'Can explain why client validation is not enforcement.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Lesson 3                                                                    */
/* -------------------------------------------------------------------------- */

const LESSON_3: Lesson = {
  id: 'lesson-01-03',
  slug: 'affordance-expectation-and-mental-models',
  moduleId: MODULE_ID,
  lessonNumber: 3,
  title: 'Affordance, Expectation and Mental Models',
  summary:
    'Users arrive with a model of how things work. Interfaces either confirm it, correct it, or violate it — and only one of those is free.',
  estimatedMinutes: 8,

  objectives: [
    'Distinguish an affordance from a signifier.',
    'Explain why convention is cheaper than novelty.',
    'Identify what signals an element\'s behaviour before it is used.',
    'Judge when a new interaction is worth its cost.',
  ],

  prerequisiteConcepts: ['Interface state and representation', 'Feedback timing'],

  prerequisiteLessonIds: ['lesson-01-01'],

  recap: [
    {
      kind: 'paragraph',
      text: 'You have modelled what a system holds and how it answers. This lesson is about what the user believes before they touch anything — and why that belief is part of the design.',
    },
  ],

  coreConcept: [
    {
      kind: 'paragraph',
      text: 'An affordance is what an object makes possible. A signifier is what tells you it is possible. They are frequently confused, and separating them explains most "nobody found the feature" problems.',
    },
    {
      kind: 'list',
      items: [
        'A draggable card affords dragging whether or not anyone realises.',
        'The grip texture, the cursor change, and the slight lift on hover are signifiers.',
        'Remove the signifiers and the affordance still exists, undiscovered.',
      ],
    },
    {
      kind: 'paragraph',
      text: 'A conceptual model is the user\'s theory of how the system works — what a folder is, what happens when they hit back, whether their work is saved. It is built from every product they have used before yours. You do not get to install a new one cheaply.',
    },
    {
      kind: 'callout',
      tone: 'insight',
      body: 'Convention is borrowed understanding. Every time you follow one, you get a working mental model for free. Every time you break one, you pay for a replacement.',
    },
  ],

  firstPrinciples: [
    {
      kind: 'paragraph',
      text: 'Discoverability and learnability are not the same property. A thing is discoverable if a user can find it without being told. It is learnable if, once found, it stays found.',
    },
    {
      kind: 'paragraph',
      text: 'Keyboard shortcuts are learnable and undiscoverable. That is acceptable for an expert tool where the same users return daily; it is disastrous for something used twice a year. The judgement is about the audience and the frequency, not about the interaction.',
    },
  ],

  designPerspective: [
    {
      kind: 'paragraph',
      text: 'Consistency operates at three scales, and they can conflict. Internal consistency is matching yourself. External consistency is matching the platform. Domain consistency is matching what practitioners in that field already use.',
    },
    {
      kind: 'paragraph',
      text: 'When they disagree, you are choosing which audience gets the free mental model. A design tool that uses spreadsheet conventions for its number fields is externally inconsistent and domain-correct — and that may be the right trade.',
    },
    {
      kind: 'callout',
      tone: 'warning',
      body: 'The most expensive violation is a familiar appearance with unfamiliar behaviour. A control that looks like a checkbox and acts like a radio is worse than one that looks like neither.',
    },
  ],

  engineeringPerspective: [
    {
      kind: 'paragraph',
      text: 'Many conventions are enforced by the platform, and reimplementing an element throws away the behaviour that made it conventional. A native button is focusable, activates on Enter and Space, participates in forms, and announces itself as a button. A styled div affords clicking with a mouse and nothing else.',
    },
    {
      kind: 'code',
      language: 'html',
      caption: 'Same appearance, different inherited behaviour.',
      code: `<!-- Keyboard operable, announced, form-aware, free. -->
<button type="submit">Save</button>

<!-- Mouse only, silent to assistive technology, and now your problem. -->
<div class="button" onclick="save()">Save</div>`,
    },
    {
      kind: 'paragraph',
      text: 'When you replace a native control you inherit its entire specification as work. That is sometimes correct. It is never free, and the cost is mostly invisible until someone uses a keyboard.',
    },
  ],

  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'Convention is where design and engineering costs align most cleanly. Following a convention usually means using the platform element, which is simultaneously the familiar choice, the accessible choice, and the cheap choice.',
    },
    {
      kind: 'paragraph',
      text: 'When a designer proposes a novel interaction, the engineering question is not "can we build it" — almost anything can be built. It is "what does this cost to build correctly", where correctly includes keyboard, assistive technology, touch, and every state from the first lesson.',
    },
  ],

  industryExamples: [
    {
      id: 'example-figma-drag',
      source: 'Figma',
      title: 'Signifiers layered on a direct-manipulation canvas',
      observation:
        'Objects on a Figma canvas are draggable, resizable, and rotatable. Almost none of that is visible at rest — it appears as cursor changes, handles on selection, and snap guides during the drag.',
      takeaway:
        'Signifiers are revealed progressively as intent becomes clear. The canvas stays uncluttered without becoming undiscoverable.',
    },
    {
      id: 'example-browser-back',
      source: 'The browser',
      title: 'The convention you do not own',
      observation:
        'Back means "the previous thing I was looking at". Applications that hijack it — or that change the page without changing history — break a model the user brought with them and did not agree to renegotiate.',
      takeaway:
        'Some conventions belong to the platform. Violating those costs more than violating your own, because the user has no reason to suspect your app is where the rules changed.',
    },
    {
      id: 'example-select-behaviour',
      source: 'Native form controls',
      title: 'Familiar behaviour that is mostly invisible',
      observation:
        'A native select opens on click, supports type-ahead, closes on Escape, is operable with arrow keys, and renders as a platform picker on touch devices.',
      takeaway:
        'Most of what makes a dropdown feel familiar is behaviour nobody can see in a screenshot — which is exactly what a custom replacement forgets.',
    },
  ],

  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Auditing an interaction means separating what it does from what tells you it does it.',
    },
    { kind: 'heading', text: 'For each interaction, ask four questions' },
    {
      kind: 'list',
      ordered: true,
      items: [
        'What does it afford — what is actually possible here?',
        'What signifies it — what would tell a first-time user, before they act?',
        'What convention is it borrowing, if any?',
        'What happens if the user guesses wrong — is the mistake cheap?',
      ],
    },
    {
      kind: 'paragraph',
      text: 'The fourth question is the one people skip. An interaction that is hard to discover but trivially recoverable is fine. An interaction that is hard to discover and destructive when guessed wrong is a defect regardless of how elegant it looks.',
    },
  ],

  commonMistakes: [
    {
      id: 'mistake-invisible-affordance',
      mistake: 'Relying on hover to reveal that something is interactive.',
      why: 'Touch devices have no hover, and a user who never moves the pointer over an element never learns it does anything.',
      instead:
        'Keep at least one signifier present at rest for anything the user must find unaided.',
    },
    {
      id: 'mistake-familiar-shape-new-behaviour',
      mistake: 'Borrowing a control\'s appearance without its behaviour.',
      why: 'Appearance sets an expectation. Violating it after the user commits is worse than never setting it.',
      instead:
        'Either adopt the behaviour that goes with the shape, or make the control look like what it is.',
    },
    {
      id: 'mistake-novelty-without-payoff',
      mistake: 'Introducing a new interaction because the conventional one felt boring.',
      why: 'The user pays the learning cost, not the designer. Boring is frequently the correct answer for a control used once a month.',
      instead:
        'Require novelty to earn its place: it should be measurably faster, clearer, or capable of something the convention cannot express.',
    },
  ],

  eliteConsiderations: [
    {
      kind: 'list',
      items: [
        'Give novel interactions a conventional fallback. Drag-to-reorder with no keyboard alternative is not an interaction, it is an exclusion.',
        'Make destructive actions harder to reach than constructive ones, and make the mistake recoverable rather than merely confirmed.',
        'Match the platform for anything the user brought with them — scrolling, back, text selection, zoom — and reserve your novelty budget for the thing your product is actually about.',
        'Watch a first-time user in silence. Every place you want to explain something is a missing signifier.',
      ],
    },
  ],

  practicalExercise: {
    id: 'exercise-01-03',
    title: 'Audit five interactions',
    prompt:
      'Take an application you use regularly and audit five distinct interactions, identifying what signals their behaviour.',
    steps: [
      'Choose five interactions that are genuinely different, not five buttons.',
      'For each, write what it affords and what signifies it.',
      'Name the convention it borrows, or record that it invents one.',
      'Note whether the signifier is present at rest, on hover, or only after acting.',
      'Note what happens if a first-time user guesses wrong, and whether recovery is cheap.',
      'Mark the one interaction you think would fail a first-time user, and say what is missing.',
    ],
    successCriteria: [
      'Affordance and signifier are recorded separately for each interaction.',
      'At least one interaction is identified as inventing rather than borrowing.',
      'Each signifier is classified by when it appears.',
      'The cost of guessing wrong is recorded for each.',
      'One concrete missing signifier is named.',
    ],
    estimatedMinutes: 25,
    hint: 'If you cannot name the signifier, you may have found an affordance that only existing users know about.',
  },

  reflectionQuestion:
    'When should an interface introduce a new interaction instead of following convention?',
  reflectionHint:
    'Novelty needs to pay rent. What would the new interaction have to be measurably better at, and who pays the learning cost — you, or every user?',

  resources: [
    {
      id: 'resource-nngroup-affordance',
      title: 'Affordances and signifiers',
      url: 'https://www.nngroup.com/articles/affordances/',
      type: 'article',
      author: 'Nielsen Norman Group',
      estimatedMinutes: 10,
      note: 'The distinction, stated carefully, with examples of each failing independently.',
    },
    {
      id: 'resource-hig-conventions',
      title: 'Human Interface Guidelines',
      url: 'https://developer.apple.com/design/human-interface-guidelines/',
      type: 'documentation',
      estimatedMinutes: 30,
      note: 'A written record of one platform\'s conventions, and the reasoning behind them.',
    },
  ],

  competencyTags: ['product-thinking', 'ux-reasoning', 'interaction-design'],

  completionCriteria: [
    'Can state the difference between affordance and signifier with an example of each failing alone.',
    'Has audited five real interactions and classified their signifiers.',
    'Can articulate what a novel interaction must be better at to justify itself.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Lesson 4                                                                    */
/* -------------------------------------------------------------------------- */

const LESSON_4: Lesson = {
  id: 'lesson-01-04',
  slug: 'product-intent-into-system-behaviour',
  moduleId: MODULE_ID,
  lessonNumber: 4,
  title: 'Product Intent Into System Behaviour',
  summary:
    'A requirement is a sentence. A specification is every state, rule, and edge case that sentence implies. Turning one into the other is the work.',
  estimatedMinutes: 9,

  objectives: [
    'Expand a one-line requirement into behaviour, rules, and states.',
    'Find edge cases systematically rather than by intuition.',
    'Recognise where a product decision has engineering consequences.',
    'Write a specification another person could build from.',
  ],

  prerequisiteConcepts: [
    'State enumeration',
    'Inputs, rules, and outputs',
  ],

  prerequisiteLessonIds: ['lesson-01-01', 'lesson-01-02'],

  recap: [
    {
      kind: 'paragraph',
      text: 'You can now describe a system and the rules that govern it. This lesson works backwards from the sentence a product team actually hands you.',
    },
  ],

  coreConcept: [
    {
      kind: 'paragraph',
      text: '"Users should be able to archive projects" is not a specification. It is a direction. Everything that determines whether the feature is good lives in what the sentence did not say.',
    },
    {
      kind: 'paragraph',
      text: 'The expansion runs in one direction, and each layer constrains the next.',
    },
    {
      kind: 'list',
      ordered: true,
      items: [
        'Requirement — the sentence.',
        'User story — who wants it, and what they are trying to achieve.',
        'Behaviour — what the system does when they do it.',
        'Rules — what is permitted, by whom, and when.',
        'Edge cases — what happens at the boundaries.',
        'States — everything the interface must be able to represent as a result.',
        'Engineering implications — what this costs in data, requests, and complexity.',
      ],
    },
    {
      kind: 'paragraph',
      text: 'Skipping to visuals from step one is the most common failure in the whole discipline. The screen is a consequence of steps three to six.',
    },
  ],

  firstPrinciples: [
    {
      kind: 'paragraph',
      text: 'Edge cases are not exotic. They are the boundaries of ordinary things, and they can be found systematically by asking four questions of every noun and verb in the requirement.',
    },
    {
      kind: 'list',
      items: [
        'Zero — what if there are none? No projects, no permission, no network.',
        'One — what if there is exactly one, and it is the one being acted on?',
        'Many — what if there are ten thousand, or the action is applied in bulk?',
        'Again — what if the same action happens twice, concurrently, or in the opposite order?',
      ],
    },
    {
      kind: 'paragraph',
      text: 'Applied to archiving: what if the project is already archived, is the last project, is currently open in another tab, or is being archived by a collaborator at the same moment? None of those are unusual. All of them need an answer.',
    },
  ],

  designPerspective: [
    {
      kind: 'paragraph',
      text: 'The design decision hiding inside "archive" is what the word promises. Archive implies recoverable, out of the way, and still real. Delete implies gone. Users will assume whichever your word suggests, and be angry at whichever it does not deliver.',
    },
    {
      kind: 'paragraph',
      text: 'That promise then dictates the interface. Recoverable means there must be somewhere to recover from, and a path back. If you cannot show the user where the archived thing went, you have built a delete and named it something reassuring.',
    },
  ],

  engineeringPerspective: [
    {
      kind: 'paragraph',
      text: 'The same word decides the data model. Archiving as a status is a field on the record; the row survives, references stay intact, and every query that lists projects must now exclude archived ones — which means forgetting the filter is a bug that leaks archived data into unrelated screens.',
    },
    {
      kind: 'code',
      language: 'ts',
      caption: 'A product decision with a visible shape in the data.',
      code: `// Status: recoverable, references intact, every list query must filter.
type Project = {
  id: string;
  name: string;
  archivedAt: string | null;
};

// Deletion: nothing to filter, nothing to recover, dangling references
// become someone else's problem.`,
    },
    {
      kind: 'paragraph',
      text: 'Neither is right in the abstract. The point is that the product decision and the data decision are the same decision, and it is usually made by whoever writes the migration first.',
    },
  ],

  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'A specification is where the two disciplines agree in writing before either has done expensive work. It is cheap to argue about whether archive is reversible while it is a sentence, and expensive once it is a database column and eleven screens.',
    },
    {
      kind: 'paragraph',
      text: 'The design engineer is the person who notices that the interface question — "where do archived projects go?" — and the engineering question — "do we filter or delete?" — are the same question, and answers them together.',
    },
  ],

  industryExamples: [
    {
      id: 'example-gmail-archive',
      source: 'Gmail',
      title: 'A word that set a user expectation industry-wide',
      observation:
        'Gmail archive removes a message from the inbox while leaving it searchable and intact. Users learned that archive means out of sight, not gone.',
      takeaway:
        'You inherit this expectation whether or not you want it. Calling something archive and making it unrecoverable violates a model the user did not get from your product.',
    },
    {
      id: 'example-github-archive-repo',
      source: 'GitHub',
      title: 'Archive as an explicit, reversible state change',
      observation:
        'Archiving a repository makes it read-only, banners the state clearly on every page, excludes it from some listings, and can be undone from settings.',
      takeaway:
        'The state is visible wherever the object appears, not just where the action was taken. A state that is invisible outside its origin screen produces confusion elsewhere.',
    },
  ],

  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Expanding "Users should be able to archive projects", one layer at a time.',
    },
    { kind: 'heading', text: 'Behaviour' },
    {
      kind: 'paragraph',
      text: 'An archived project disappears from the main list, appears in an archived view, becomes read-only or stays editable (decide), and can be restored.',
    },
    { kind: 'heading', text: 'Rules' },
    {
      kind: 'list',
      items: [
        'Who may archive — any member, or only an owner?',
        'May an archived project be edited, or only read?',
        'Does archiving cascade to anything the project contains?',
        'Is there a limit, a retention period, or an eventual deletion?',
      ],
    },
    { kind: 'heading', text: 'Edge cases, by the four questions' },
    {
      kind: 'list',
      items: [
        'Zero — the user has one project and archives it: is the empty state different from a new account?',
        'One — the project is currently open: are they ejected, warned, or left in a read-only view?',
        'Many — bulk archive of two hundred: is it one request, and what does partial failure look like?',
        'Again — a collaborator restores it while you are looking at the archived list.',
      ],
    },
    { kind: 'heading', text: 'States that follow' },
    {
      kind: 'paragraph',
      text: 'Confirming, archiving in flight, archived, restore in flight, archive failed, restore failed, and the two empty states. Nine states from one sentence — and this is a small feature.',
    },
  ],

  commonMistakes: [
    {
      id: 'mistake-design-before-spec',
      mistake: 'Drawing the screen before expanding the requirement.',
      why: 'The screen then encodes assumptions nobody stated, and the assumptions surface as rework when the rules are finally discussed.',
      instead:
        'Expand to rules and states first. The layout is much faster once you know what it has to hold.',
    },
    {
      id: 'mistake-edge-cases-by-vibe',
      mistake: 'Looking for edge cases by intuition.',
      why: 'Intuition finds the cases you have personally hit before and misses categories entirely.',
      instead:
        'Run zero / one / many / again against every noun and verb. It is mechanical and it is thorough.',
    },
    {
      id: 'mistake-word-without-promise',
      mistake: 'Choosing a label before deciding what it promises.',
      why: 'Words carry expectations from other products. The label quietly commits you to behaviour you have not designed.',
      instead:
        'Decide reversibility and visibility first, then pick the word that honestly describes it.',
    },
    {
      id: 'mistake-state-only-at-origin',
      mistake: 'Showing a state only on the screen where it was changed.',
      why: 'The object appears in search, in links, in other people\'s views. A state visible in one place looks like a bug everywhere else.',
      instead:
        'Decide how the state renders everywhere the object can appear.',
    },
  ],

  eliteConsiderations: [
    {
      kind: 'list',
      items: [
        'Write the specification so that a competent stranger could build it without asking you a question. The questions they would have asked are the parts you have not decided.',
        'State explicitly what is out of scope. Unstated exclusions get built anyway.',
        'Note which decisions are reversible and which are not; spend argument on the second kind.',
        'Prefer an extra state over an ambiguous one. "Archiving failed, unchanged" is cheaper than a screen that silently lies.',
      ],
    },
  ],

  practicalExercise: {
    id: 'exercise-01-04',
    title: 'Specify "Users should be able to archive projects"',
    prompt:
      'Turn the requirement into a complete behavioural specification that another person could build from without asking you anything.',
    steps: [
      'Write the user story: who, and what they are trying to achieve.',
      'Describe the behaviour in plain sentences.',
      'List the rules, including permissions and any cascade.',
      'Run zero / one / many / again against the nouns and verbs, and record what you find.',
      'Enumerate every state the interface must represent as a result.',
      'Note the engineering implications: data shape, queries affected, requests, and failure handling.',
      'Mark every decision you made that the original sentence did not specify.',
    ],
    successCriteria: [
      'At least six edge cases are found by the four questions, not by intuition alone.',
      'Every rule names who it applies to.',
      'The state list includes failure states for both archive and restore.',
      'The data implication of the chosen approach is stated.',
      'Decisions not specified by the requirement are explicitly marked as decisions.',
    ],
    estimatedMinutes: 30,
    hint: 'When you finish, count the states. If one sentence produced fewer than six, you have not finished expanding it.',
  },

  reflectionQuestion:
    'Should archive behave more like delete, or more like moving a file?',
  reflectionHint:
    'Think about permanence. Which model does the word promise, what does each cost to build, and which one can the user recover from when they were wrong?',

  resources: [
    {
      id: 'resource-shape-up',
      title: 'Shape Up: setting boundaries',
      url: 'https://basecamp.com/shapeup/1.1-chapter-02',
      type: 'article',
      author: 'Ryan Singer',
      estimatedMinutes: 20,
      note: 'On defining a feature at the right altitude — specific enough to build, loose enough to solve.',
    },
    {
      id: 'resource-github-archive',
      title: 'Archiving a repository',
      url: 'https://docs.github.com/en/repositories/archiving-a-github-repository/archiving-repositories',
      type: 'documentation',
      estimatedMinutes: 8,
      note: 'A shipped archive feature with its rules written down. Read it as a specification.',
    },
  ],

  competencyTags: ['product-thinking', 'product-judgement', 'interface-state-modelling'],

  completionCriteria: [
    'Has expanded a one-line requirement into rules, edge cases, and states.',
    'Can apply zero / one / many / again as a repeatable technique.',
    'Can name the data consequence of a product wording decision.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Lesson 5                                                                    */
/* -------------------------------------------------------------------------- */

const LESSON_5: Lesson = {
  id: 'lesson-01-05',
  slug: 'reverse-engineering-interfaces',
  moduleId: MODULE_ID,
  lessonNumber: 5,
  title: 'Reverse Engineering Interfaces',
  summary:
    'Mature products are the best available documentation. Reading them deliberately — states, components, inferred behaviour — is how you acquire judgement faster than by building alone.',
  estimatedMinutes: 9,

  objectives: [
    'Take an interaction and state inventory of an unfamiliar product.',
    'Infer a component boundary from behaviour rather than appearance.',
    'Recognise a layout system from spacing and alignment evidence.',
    'Probe edge cases deliberately to reveal hidden decisions.',
  ],

  prerequisiteConcepts: [
    'State enumeration',
    'Affordances and conventions',
    'Behavioural specification',
  ],

  prerequisiteLessonIds: ['lesson-01-01', 'lesson-01-03', 'lesson-01-04'],

  recap: [
    {
      kind: 'paragraph',
      text: 'You have built the vocabulary: states, inputs, rules, signifiers, specifications. This lesson turns it outward, onto software other people shipped.',
    },
  ],

  coreConcept: [
    {
      kind: 'paragraph',
      text: 'Every mature product is a record of decisions made under real constraints, tested against real users. Most of those decisions are undocumented, but they are all observable if you look in an ordered way rather than browsing.',
    },
    {
      kind: 'list',
      ordered: true,
      items: [
        'Interaction inventory — every action available on the screen, including hidden ones.',
        'State inventory — every state you can reach, plus the ones you can only infer.',
        'Layout system — the spacing steps, alignment rules, and container widths in use.',
        'Component recognition — which things are the same component wearing different props.',
        'Inferred behaviour — what must be true underneath for the observable behaviour to work.',
        'Edge-case inspection — deliberately break it and record what it does.',
      ],
    },
    {
      kind: 'paragraph',
      text: 'The last step is where most of the learning is, because it reveals decisions the happy path hides.',
    },
  ],

  firstPrinciples: [
    {
      kind: 'paragraph',
      text: 'Appearance is weak evidence of structure. Two elements that look identical may be unrelated, and two that look different may be one component with different props. Behaviour is stronger evidence than styling.',
    },
    {
      kind: 'paragraph',
      text: 'Ask what varies together. If two things change appearance at the same breakpoint, share keyboard behaviour, animate identically, and fail the same way, they are almost certainly one component. If they merely share a border radius, that is a token, not a relationship.',
    },
    {
      kind: 'callout',
      tone: 'insight',
      body: 'Component boundaries are visible in behaviour, not in pixels. Change something and see what else changes with it.',
    },
  ],

  designPerspective: [
    {
      kind: 'paragraph',
      text: 'Reading a spacing system is a matter of measuring rather than guessing. Take ten measurements between related elements and the scale usually declares itself — a small set of repeated values, with a consistent relationship between tight and loose groupings.',
    },
    {
      kind: 'paragraph',
      text: 'The interesting finding is always the exception: the one place the product left its own scale. That is either a mistake or a deliberate correction, and working out which teaches you more than the ninety-nine conforming cases.',
    },
  ],

  engineeringPerspective: [
    {
      kind: 'paragraph',
      text: 'Behaviour lets you infer the shape of the data. If a list updates instantly and reorders half a second later, it is optimistic with server reconciliation. If a filter never shows a loading state, it is client-side over an already-loaded collection. If typing triggers a request per keystroke, there is a debounce — or there should be.',
    },
    {
      kind: 'paragraph',
      text: 'Browser tooling makes this concrete. The element inspector shows structure and computed layout, the accessibility tree shows what the interface claims to be, and the network panel shows exactly what it asks for and when.',
    },
    {
      kind: 'code',
      language: 'text',
      caption: 'A reading order that gets you to the interesting parts quickly.',
      code: `Elements    → what is this actually made of? which element, which role?
Accessibility → what does it claim to be, and does that match?
Network       → what does it fetch, when, and how often?
Slow 3G       → which states exist that you would never otherwise see.`,
    },
  ],

  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'This is the fastest way to close the gap between the two disciplines, because a shipped product forces you to read design and implementation as one artefact. You cannot separate the spacing decision from the CSS that expresses it, or the loading state from the request that caused it.',
    },
    {
      kind: 'paragraph',
      text: 'Do this regularly and you stop asking whether something is possible. You start asking what it cost, which is the question that actually informs your own work.',
    },
  ],

  industryExamples: [
    {
      id: 'example-linear-reverse',
      source: 'Linear',
      title: 'Keyboard-first structure visible from the outside',
      observation:
        'Nearly everything in Linear is reachable by keyboard, and the command palette exposes the action vocabulary directly. The available commands are effectively a published list of what the product thinks it does.',
      takeaway:
        'A command palette is an interaction inventory the product maintains for you. When one exists, start there.',
    },
    {
      id: 'example-stripe-dashboard',
      source: 'Stripe',
      title: 'Dense data with consistent component reuse',
      observation:
        'Stripe\'s dashboard reuses a small number of table, badge, and detail-row components across very different object types, varying content rather than structure.',
      takeaway:
        'When the same shapes recur across unrelated screens, you are looking at a design system being used properly — and you can learn its API by watching what varies.',
    },
    {
      id: 'example-throttled-network',
      source: 'Any product, throttled',
      title: 'States that only appear under stress',
      observation:
        'Throttling the network in devtools reveals skeletons, spinners, optimistic updates, and error handling that are invisible on a fast connection.',
      takeaway:
        'Half a mature product\'s state design is unreachable at normal speed. If you never throttle, you never see how the professionals handle waiting.',
    },
  ],

  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Reverse engineering one workflow — say, creating an issue in a project tool.',
    },
    { kind: 'heading', text: 'Inventory before inspecting' },
    {
      kind: 'paragraph',
      text: 'Walk the flow once and write every action you can take, including keyboard shortcuts and anything revealed on hover or focus. Do not open devtools yet; you are recording what a user can perceive.',
    },
    { kind: 'heading', text: 'Reach every state you can' },
    {
      kind: 'paragraph',
      text: 'Submit empty. Submit something too long. Start typing and navigate away. Disconnect the network mid-save. Record what each produces, including what it does not produce.',
    },
    { kind: 'heading', text: 'Then inspect' },
    {
      kind: 'paragraph',
      text: 'Now open the tools. Check whether the control is a native element, what the accessibility tree says it is, and what the network did while you were acting.',
    },
    { kind: 'heading', text: 'Write down the decisions' },
    {
      kind: 'paragraph',
      text: 'End with a list of decisions, not observations. "They chose optimistic update with reconciliation" is a decision. "It felt fast" is not.',
    },
  ],

  commonMistakes: [
    {
      id: 'mistake-copy-surface',
      mistake: 'Copying the appearance and calling it learning.',
      why: 'The appearance is the cheapest part and the least transferable. The decisions underneath are what generalise.',
      instead:
        'End every teardown with decisions and their trade-offs, not a screenshot.',
    },
    {
      id: 'mistake-happy-path-only',
      mistake: 'Only walking the path that works.',
      why: 'The happy path is where products are most similar to each other. Their differences are in failure and waiting.',
      instead:
        'Deliberately break it: empty input, network off, slow connection, permission denied.',
    },
    {
      id: 'mistake-appearance-as-component',
      mistake: 'Inferring component boundaries from styling.',
      why: 'Shared tokens make unrelated things look related, and variants make one component look like several.',
      instead:
        'Group by shared behaviour — same keyboard handling, same responsive change, same failure mode.',
    },
    {
      id: 'mistake-assuming-intent',
      mistake: 'Assuming every detail was deliberate.',
      why: 'Mature products contain compromises, legacy, and mistakes. Treating all of it as intentional teaches you the wrong lessons.',
      instead:
        'Note what is inconsistent as well as what is consistent. The inconsistencies are often the most informative part.',
    },
  ],

  eliteConsiderations: [
    {
      kind: 'list',
      items: [
        'Throttle the network before you begin. Waiting states are where most of the craft is.',
        'Check the accessibility tree early — it frequently reveals that a custom-looking control is a native one, or the reverse.',
        'Record what the product refuses to do. Absent features are decisions too, and usually cheaper to learn from than present ones.',
        'Keep a running file of decisions you disagree with, and why. Disagreement you can articulate is the beginning of judgement.',
      ],
    },
  ],

  practicalExercise: {
    id: 'exercise-01-05',
    title: 'Reverse engineer one workflow',
    prompt:
      'Choose one workflow from Linear, GitHub, Stripe, Figma, or another mature product, and reverse engineer it end to end.',
    steps: [
      'Pick one workflow, not a whole product. Creating something, editing something, or a search flow is the right size.',
      'Walk it once and write the interaction inventory, without devtools.',
      'Reach as many states as you can, including at least three failure or waiting states.',
      'Throttle the network and repeat the flow, recording what appears that did not before.',
      'Identify two elements you believe are the same component, and state the behavioural evidence.',
      'Measure enough spacing to describe the scale in use, and note one place it is violated.',
      'Finish with a list of decisions the team made, and one you would have made differently.',
    ],
    successCriteria: [
      'The interaction inventory includes at least one action not visible at rest.',
      'At least three waiting or failure states are documented.',
      'A component claim is supported by behavioural evidence, not appearance.',
      'The spacing scale is stated with actual measurements.',
      'The output is a list of decisions, not a description of screens.',
    ],
    estimatedMinutes: 40,
    hint: 'Throttle to slow 3G before you start. Most of what you are looking for is invisible at full speed.',
  },

  reflectionQuestion:
    'What tells you whether two visually similar elements belong to the same component?',
  reflectionHint:
    'Look beyond appearance. What would have to change together for them to be one thing — and what evidence could you gather in a browser without seeing the source?',

  resources: [
    {
      id: 'resource-chrome-devtools',
      title: 'Chrome DevTools: inspect accessibility',
      url: 'https://developer.chrome.com/docs/devtools/accessibility/reference',
      type: 'documentation',
      estimatedMinutes: 15,
      note: 'How to read the accessibility tree, which is the fastest way to tell what a control really is.',
    },
    {
      id: 'resource-vercel-guidelines',
      title: 'Web Interface Guidelines',
      url: 'https://vercel.com/design/guidelines',
      type: 'documentation',
      estimatedMinutes: 25,
      note: 'A published set of interface decisions. Useful both as guidance and as an example of a team writing its reasoning down.',
    },
  ],

  competencyTags: ['ux-reasoning', 'critique', 'product-judgement'],

  completionCriteria: [
    'Has completed a teardown of one real workflow with states, components, and decisions.',
    'Can justify a component boundary from behavioural evidence.',
    'Has documented at least three states only reachable under stress.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Project                                                                     */
/* -------------------------------------------------------------------------- */

const PROJECT: ModuleProject = {
  id: 'project-01',
  slug: 'account-settings-system',
  moduleId: MODULE_ID,
  title: 'Account Settings System',
  brief:
    'Design and build an account settings surface covering profile editing, email editing, save state, validation, success, failure, loading, and a destructive account action.',
  problem:
    'Settings screens look trivial and are not. They are dense with state: every field can be pristine, edited, saving, saved, or rejected; email changes usually require verification; and somewhere at the bottom sits an irreversible action that must be hard to trigger by accident and still possible to complete. Most settings pages are built field by field and end up inconsistent, with three different ways of saying "saved" and a delete button one click from disaster.',
  objectives: [
    'Produce a complete state map before building anything.',
    'Implement a consistent save and feedback model across multiple fields.',
    'Handle validation, failure, and loading as designed states rather than afterthoughts.',
    'Make a destructive action safe without making it tedious.',
  ],
  requirements: [
    'Profile editing: at least a display name and one other field.',
    'Email editing, including whatever verification step your design implies.',
    'An explicit save model — per field or per form — applied consistently.',
    'Validation with a stated announcement moment for each rule.',
    'Success, failure, and loading states for every save path.',
    'One destructive account action with an appropriate confirmation.',
    'Keyboard operable throughout, with visible focus.',
  ],
  constraints: [
    'No component library. Plain HTML and CSS, so the semantics and states are yours.',
    'Every state in your map must be reachable in the running build, including failures — fake the server if necessary.',
    'No state may be represented only by colour.',
  ],
  suggestedScope:
    'One page with three or four fields and one destructive action. Resist adding tabs, avatars, or billing. The value is in state coverage, not surface area — a small page where every state is built beats a large one where only the happy path is.',
  deliverables: [
    'A Figma state map covering every state in the settings surface.',
    'A written interaction specification: rules, announcement moments, and transitions.',
    'A working browser implementation where every mapped state can be reached.',
  ],
  completionCriteria: [
    'Every state in the map exists in the build and can be demonstrated.',
    'Validation announces at a moment you chose deliberately and can defend.',
    'Failure preserves the user\'s input.',
    'The destructive action cannot be triggered by a single unconsidered click, and does not require reading a paragraph either.',
    'The whole surface is operable by keyboard with a visible focus indicator.',
  ],
  portfolioEvidence: [
    'State thinking',
    'Product logic',
    'Interface feedback',
    'Form validation',
    'Destructive action design',
    'First frontend implementation',
  ],
  reflectionQuestion:
    'Which state was hardest to build, and what did that difficulty tell you about your original state map?',
  estimatedHours: 10,
  competencies: [
    'product-thinking',
    'ux-reasoning',
    'interaction-design',
    'interface-state-modelling',
  ],
  stretchGoals: [
    'Add an unsaved-changes guard when navigating away, and decide what it does to a save in flight.',
    'Make the email verification flow resumable after a page reload.',
  ],
};

/* -------------------------------------------------------------------------- */

export const MODULE_01: CurriculumModule = {
  id: MODULE_ID,
  slug: 'design-engineering-foundations',
  moduleNumber: 1,
  phase: 'foundations',
  title: 'Design Engineering Foundations',
  description:
    'What an interface actually is underneath the picture of it, and how a product requirement becomes system behaviour.',
  outcome:
    'Learn to view interfaces as systems of states, inputs, rules, transitions, feedback, and constraints.',
  prerequisites: [
    'Basic familiarity with a design tool',
    'No programming experience required',
  ],
  lessons: [LESSON_1, LESSON_2, LESSON_3, LESSON_4, LESSON_5],
  resources: [
    {
      id: 'resource-module-01-hig',
      title: 'Apple Human Interface Guidelines',
      url: 'https://developer.apple.com/design/human-interface-guidelines/',
      type: 'documentation',
      estimatedMinutes: 60,
      note: 'A platform\'s conventions and feedback standards, written down and reasoned about.',
    },
    {
      id: 'resource-module-01-react-state',
      title: 'React: State as a Snapshot',
      url: 'https://react.dev/learn/state-as-a-snapshot',
      type: 'documentation',
      estimatedMinutes: 20,
      note: 'Rendering as a function of state, which is this module\'s model expressed as a framework.',
    },
    {
      id: 'resource-module-01-vercel',
      title: 'Vercel Web Interface Guidelines',
      url: 'https://vercel.com/design/guidelines',
      type: 'documentation',
      estimatedMinutes: 25,
      note: 'Concrete interface decisions with their reasoning attached.',
    },
    {
      id: 'resource-module-01-nngroup',
      title: 'Nielsen Norman Group: interaction design principles',
      url: 'https://www.nngroup.com/topic/interaction-design/',
      type: 'article',
      estimatedMinutes: 40,
      note: 'Research-backed treatment of affordance, feedback, and error handling.',
    },
  ],
  project: PROJECT,
  competencies: [
    'product-thinking',
    'ux-reasoning',
    'interaction-design',
    'critique',
    'product-judgement',
    'interface-state-modelling',
  ],
  completionCriteria: [
    'All five lessons completed.',
    'Module project marked completed.',
    'Can describe any interface as a state system without notes.',
  ],
};
