/**
 * The authored concept chains.
 *
 * The curriculum is taught in fifteen modules, which is a teaching order rather
 * than a description of how the subject fits together. A chain traces one idea
 * as it reappears at each level, so the learner can see that the modules are
 * views onto one discipline rather than fifteen separate topics.
 *
 * Each step's `contribution` says what that level adds — the point of a chain
 * is that the same idea acquires a new problem at each scale, not that the
 * words are related. Lesson ids are checked by the tests, so a renamed or
 * removed lesson fails the build rather than leaving a dead link.
 *
 * The five chains are the five threads the curriculum is built around:
 * interaction, layout, components, state and quality.
 *
 * Four of the five run strictly forwards through the course, which doubles as a
 * check on the teaching order — a chain that had to jump backwards would
 * usually mean a module was in the wrong place.
 *
 * Quality is the exception, deliberately. Its order is one of conceptual
 * dependency rather than teaching order: performance sits after design QA
 * because you cannot sensibly optimise an interface whose behaviour has not
 * been verified, yet module 13 teaches rendering cost before it teaches QA,
 * because QA needs the vocabulary that the rendering lessons establish. Both
 * orders are right for their own purpose, so the chain keeps the conceptual one
 * and this comment records why it disagrees with the syllabus.
 */

import type { ConceptChain } from '@/types/connections';

export const CONCEPT_CHAINS: readonly ConceptChain[] = [
  /* ------------------------------------------------------------------------ */
  /* Interaction                                                              */
  /* ------------------------------------------------------------------------ */
  {
    id: 'interaction',
    title: 'Interaction',
    subtitle:
      'One press, followed from the control that promised something to the architecture that has to honour it.',
    whyConnected:
      'These are the stages of a single interaction, in the order they happen. A control makes a promise before anything is pressed; an event is the user taking that promise up; feedback is the system saying it heard; state is what actually changed; React state is that change placed somewhere a tree can render from; async state is admitting the change may not have reached the server yet; architecture is making that decision once for every interaction in the product. Skipping a stage produces a specific, recognisable defect — a control that lies, a press that does nothing, a change nobody noticed, a save that silently failed.',
    links: [
      {
        id: 'controls',
        label: 'Controls',
        contribution:
          'The promise the interface makes before anything happens, and the native behaviour that promise arrives with.',
        lessonIds: [
          'lesson-buttons-links-inputs-and-controls',
          'lesson-what-makes-an-interface-interactive',
        ],
      },
      {
        id: 'events',
        label: 'Events',
        contribution:
          'The user acting on that promise, arriving as input the system can receive and respond to.',
        lessonIds: [
          'lesson-events-clicks-and-user-input',
          'lesson-what-happens-when-a-user-takes-an-action',
        ],
      },
      {
        id: 'feedback',
        label: 'Feedback',
        contribution:
          'Telling the user the system heard — and, with motion, explaining what changed rather than only announcing it.',
        lessonIds: [
          'lesson-feedback-loading-success-and-error',
          'lesson-why-interfaces-move',
          'lesson-timing-and-easing',
        ],
      },
      {
        id: 'state',
        label: 'State',
        contribution:
          'What actually changed, expressed as facts rather than as the screens those facts produce.',
        lessonIds: [
          'lesson-what-interface-state-means',
          'lesson-moving-from-one-state-to-another',
        ],
      },
      {
        id: 'react-state',
        label: 'React state',
        contribution:
          'Those facts held where a component tree can redraw from them, so the screen follows the state instead of being nudged towards it.',
        lessonIds: ['lesson-state-in-react', 'lesson-events-effects-and-synchronisation'],
      },
      {
        id: 'async-state',
        label: 'Async state',
        contribution:
          'Admitting the change may not have landed: in flight, stale, rolled back, or refused by a server that disagreed.',
        lessonIds: [
          'lesson-loading-empty-success-and-error-states',
          'lesson-optimistic-updates',
        ],
      },
      {
        id: 'product-architecture',
        label: 'Product architecture',
        contribution:
          'The same decision made once for every interaction in the product, including what happens when any of them fails.',
        lessonIds: [
          'lesson-errors-recovery-and-resilience',
          'lesson-thinking-about-product-architecture',
        ],
      },
    ],
  },

  /* ------------------------------------------------------------------------ */
  /* Layout                                                                   */
  /* ------------------------------------------------------------------------ */
  {
    id: 'layout',
    title: 'Layout',
    subtitle: 'A decision about emphasis, followed until it is a value the whole product shares.',
    whyConnected:
      'Every step here turns a judgement into something more durable than a judgement. Hierarchy decides what matters most; spacing expresses that decision as distance; CSS layout makes those distances real in a browser, where content has a size you did not choose; responsive design holds them at every width rather than the one the design was drawn at; a token gives a distance a name so it stops being retyped; a design system collects the names and adds rules for choosing between them. Nothing new is introduced along the way — the decision simply stops being something one person remembers and becomes something the product enforces.',
    links: [
      {
        id: 'hierarchy',
        label: 'Hierarchy',
        contribution:
          'Decides what the eye reaches first, and therefore what every later decision is arranging.',
        lessonIds: ['lesson-visual-hierarchy', 'lesson-typography-for-interfaces'],
      },
      {
        id: 'spacing',
        label: 'Spacing',
        contribution:
          'Expresses that hierarchy as distance, grouping things by proximity rather than by border.',
        lessonIds: ['lesson-spacing-and-rhythm'],
      },
      {
        id: 'css-layout',
        label: 'CSS layout',
        contribution:
          'Makes those distances real in a browser, where the content has a size you did not pick.',
        lessonIds: [
          'lesson-the-css-box-model',
          'lesson-building-layouts-with-flexbox',
          'lesson-building-responsive-layouts-with-grid',
        ],
      },
      {
        id: 'responsive-design',
        label: 'Responsive design',
        contribution:
          'Holds the hierarchy at every width, including the ones between the breakpoints nobody designed.',
        /* The thinking starts in module 2 lesson 10, but it is only *built* here,
         * which is what keeps this step after CSS layout rather than before it. */
        lessonIds: [
          'lesson-building-responsive-layouts-with-grid',
          'lesson-turning-a-figma-design-into-a-browser-interface',
        ],
      },
      {
        id: 'tokens',
        label: 'Tokens',
        contribution:
          'Gives each value a name, so an off-scale number becomes conspicuous instead of invisible.',
        lessonIds: ['lesson-design-tokens', 'lesson-system-foundations'],
      },
      {
        id: 'design-system',
        label: 'Design system',
        contribution:
          'Collects the names into one vocabulary with guidance, and keeps it true in both tools at once.',
        lessonIds: [
          'lesson-components-across-figma-and-code',
          'lesson-governance-and-maintaining-a-system',
        ],
      },
    ],
  },

  /* ------------------------------------------------------------------------ */
  /* Components                                                               */
  /* ------------------------------------------------------------------------ */
  {
    id: 'components',
    title: 'Components',
    subtitle:
      'A box drawn on a screenshot, followed until it is a contract other people depend on.',
    whyConnected:
      'This chain is one question asked with rising stakes: where does one part of an interface end? Drawing boxes on a screenshot costs nothing to get wrong. A React component makes the boundary real. An API turns it into something other code depends on, so a rename becomes a coordinated change. Composition decides what the caller may vary and what the component insists on. Accessibility puts the behaviour that must be correct inside the boundary, paid for once rather than at every call site. A design system makes the whole set a vocabulary with rules. The reasoning never changes; the cost of a wrong boundary rises at every step.',
    links: [
      {
        id: 'interface-parts',
        label: 'Interface parts',
        contribution:
          'Noticing that an interface is made of repeated parts, and that behaviour is a better boundary than appearance.',
        lessonIds: ['lesson-breaking-an-interface-into-parts'],
      },
      {
        id: 'react-components',
        label: 'React components',
        contribution:
          'Makes the boundary real: a function with typed inputs that returns what to show.',
        lessonIds: ['lesson-components-and-props', 'lesson-rendering-lists-and-conditional-ui'],
      },
      {
        id: 'component-apis',
        label: 'Component APIs',
        contribution:
          'Turns the props into a contract other code relies on — harder to change than the implementation behind it.',
        lessonIds: [
          'lesson-choosing-component-boundaries',
          'lesson-designing-component-apis',
          'lesson-variants-without-complexity',
        ],
      },
      {
        id: 'composition',
        label: 'Composition',
        contribution:
          'Decides what the caller assembles and what the component owns, so flexibility does not cost consistency.',
        lessonIds: ['lesson-composition'],
      },
      {
        id: 'accessible-components',
        label: 'Accessible components',
        contribution:
          'Puts the behaviour that must be correct — focus, keyboard, announcement — inside the boundary, once.',
        lessonIds: [
          'lesson-building-accessible-components',
          'lesson-keyboard-and-focus',
          'lesson-direct-manipulation-and-gestures',
        ],
      },
      {
        id: 'design-systems',
        label: 'Design systems',
        contribution:
          'Makes the set a vocabulary with patterns and governance, so it survives a growing product.',
        lessonIds: [
          'lesson-patterns-and-product-workflows',
          'lesson-governance-and-maintaining-a-system',
        ],
      },
    ],
  },

  /* ------------------------------------------------------------------------ */
  /* State                                                                    */
  /* ------------------------------------------------------------------------ */
  {
    id: 'state',
    title: 'State',
    subtitle: 'One fact, followed from a single screen to two devices that disagree about it.',
    whyConnected:
      'Every step asks the same question at a larger scale: what is true right now, and who is allowed to change it. A feedback state is a fact you can see. A condition uses that fact to make a decision. Interface state reduces the facts to a minimum and derives the rest. React state places one of them in a tree. Ownership decides where in the tree. URL state lifts it out of the application entirely, to somewhere the user can edit. Server state admits you only hold a copy, with an age. Synchronisation is what happens when two copies disagree. Nothing new is introduced along the way; the question just gets harder to answer as more things can change the answer.',
    links: [
      {
        id: 'feedback-states',
        label: 'Feedback states',
        contribution:
          'The first facts the learner can see: idle, loading, success, error — each needing its own screen.',
        lessonIds: [
          'lesson-feedback-loading-success-and-error',
          'lesson-what-makes-an-interface-interactive',
        ],
      },
      {
        id: 'javascript-conditions',
        label: 'JavaScript conditions',
        contribution:
          'Uses those facts to decide what the interface does, including which kind of empty this is.',
        lessonIds: ['lesson-conditions-and-interface-decisions', 'lesson-forms-and-validation'],
      },
      {
        id: 'interface-state',
        label: 'Interface state',
        contribution:
          'Reduces the facts to the minimum, derives everything else, and maps the moves between them.',
        lessonIds: [
          'lesson-what-interface-state-means',
          'lesson-derived-state-and-avoiding-duplicate-truth',
          'lesson-mapping-product-behaviour-before-coding',
        ],
      },
      {
        id: 'react-state',
        label: 'React state',
        contribution:
          'Holds a fact where a component can redraw from it, and makes a stored derivation visibly stale.',
        lessonIds: ['lesson-state-in-react'],
      },
      {
        id: 'state-ownership',
        label: 'State ownership',
        contribution:
          'Decides which component owns each fact: the closest common owner, and no higher.',
        lessonIds: ['lesson-where-state-should-live'],
      },
      {
        id: 'url-state',
        label: 'URL state',
        contribution:
          'Lifts a fact out of the application, to somewhere shareable and linkable — and user-editable, so untrusted.',
        lessonIds: ['lesson-url-state-and-persistence', 'lesson-search-filters-and-sorting'],
      },
      {
        id: 'server-state',
        label: 'Server state',
        contribution:
          'Admits you hold a copy with an age, which is why staleness and refetching are states in their own right.',
        lessonIds: ['lesson-local-global-url-and-server-state'],
      },
      {
        id: 'synchronisation',
        label: 'Synchronisation',
        contribution:
          'Handles two copies disagreeing: a conflict guard, a merge where the data allows one, a decision where it does not.',
        lessonIds: ['lesson-caching-and-synchronisation'],
      },
    ],
  },

  /* ------------------------------------------------------------------------ */
  /* Quality                                                                  */
  /* ------------------------------------------------------------------------ */
  {
    id: 'quality',
    title: 'Quality',
    subtitle:
      'A correctly chosen element, followed until it is a property the whole product can be measured against.',
    whyConnected:
      'Quality is not a polish pass; it either accumulates from the first decision or cannot be added later. Semantic HTML is the first checkpoint — get the element wrong and every later stage is rebuilt by hand. Accessibility is that structure verified rather than assumed. Component quality moves the verified behaviour inside a boundary, so every use inherits it. Testing makes a designed behaviour impossible to lose quietly. Design QA catches what tests cannot see. Performance asks whether any of it is usable on a real device. Architecture decides whether the next change can be made without undoing the rest. Each stage depends on the one before it being right.',
    links: [
      {
        id: 'semantic-html',
        label: 'Semantic HTML',
        contribution:
          'The first checkpoint: an element carries meaning and behaviour, and choosing wrong means rebuilding both.',
        lessonIds: [
          'lesson-html-gives-interfaces-structure-and-meaning',
          'lesson-semantic-interfaces',
        ],
      },
      {
        id: 'accessibility',
        label: 'Accessibility',
        contribution:
          'Verifies the structure rather than trusting it — role, name and state, read from the tree.',
        lessonIds: [
          'lesson-the-accessibility-tree-and-aria',
          'lesson-accessible-forms-and-errors',
          'lesson-reduced-motion-and-accessible-animation',
        ],
      },
      {
        id: 'component-quality',
        label: 'Component quality',
        contribution:
          'Moves the verified behaviour inside a component, so every use inherits it instead of re-earning it.',
        lessonIds: ['lesson-building-accessible-components'],
      },
      {
        id: 'testing',
        label: 'Testing',
        contribution:
          'Makes a designed behaviour impossible to lose quietly, by asserting what a user would notice.',
        lessonIds: ['lesson-testing-important-product-behaviour'],
      },
      {
        id: 'design-qa',
        label: 'Design QA',
        contribution:
          'Catches what tests cannot see: drift from the tokens, a state nobody built, a width nobody checked.',
        lessonIds: ['lesson-design-qa', 'lesson-debugging-with-browser-tools'],
      },
      {
        id: 'performance',
        label: 'Performance',
        contribution:
          'Asks whether any of it is usable on a real device, measured rather than assumed.',
        lessonIds: [
          'lesson-how-the-browser-renders-an-interface',
          'lesson-frontend-performance-fundamentals',
        ],
      },
      {
        id: 'product-architecture',
        label: 'Product architecture',
        contribution:
          'Decides whether the next change can be made without undoing the quality already paid for.',
        lessonIds: [
          'lesson-thinking-about-product-architecture',
          'lesson-systematic-product-critique',
        ],
      },
    ],
  },
];
