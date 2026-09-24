/**
 * The authored concept chains.
 *
 * Each step's `contribution` says what that level adds — the point of a chain
 * is that the same idea acquires a new problem at each scale, not that the
 * words are related. Lesson ids are checked by the tests, so a renamed or
 * removed lesson fails the build rather than leaving a dead link.
 */

import type { ConceptChain } from '@/types/connections';

export const CONCEPT_CHAINS: readonly ConceptChain[] = [
  {
    id: 'state',
    title: 'State',
    subtitle: 'One fact, followed from a single screen to a whole application.',
    whyConnected:
      'Every one of these is the same question asked at a larger scale: what is true right now, and who is allowed to change it. An interface state is a fact you can see; a JavaScript variable is that fact written down; React state is that variable placed somewhere in a tree; ownership is deciding where; async state is admitting the fact may be out of date; architecture is that decision made for every fact at once. Nothing new is introduced along the way — the question just gets harder to answer as more things can change it.',
    links: [
      {
        id: 'interface-state',
        label: 'Interface state',
        contribution:
          'Names what an interface is underneath the picture of it: a set of states, and rules for moving between them.',
        lessonIds: ['lesson-01-01', 'lesson-01-02'],
      },
      {
        id: 'javascript-state',
        label: 'JavaScript state',
        contribution:
          'Puts those states into values and transformations, where the shape you choose decides which screens are easy to build.',
        lessonIds: ['lesson-05-01', 'lesson-05-03'],
      },
      {
        id: 'react-state',
        label: 'React state',
        contribution:
          'Ties the value to what is rendered, so the screen becomes a function of the state rather than something kept in sync with it.',
        lessonIds: ['lesson-07-04', 'lesson-07-03'],
      },
      {
        id: 'state-ownership',
        label: 'Component state ownership',
        contribution:
          'Adds the question a single component never has to ask: which component is allowed to change this, and who merely reads it.',
        lessonIds: ['lesson-08-05', 'lesson-08-01'],
      },
      {
        id: 'async-state',
        label: 'Async state',
        contribution:
          'Admits that a fact takes time to establish and can fail, which turns one value into loading, empty, error, and stale.',
        lessonIds: ['lesson-05-05', 'lesson-11-01', 'lesson-11-02'],
      },
      {
        id: 'application-architecture',
        label: 'Application architecture',
        contribution:
          'Answers the ownership and staleness questions once, for every fact in the product, by giving each kind of state a defined home.',
        lessonIds: ['lesson-13-01', 'lesson-13-02'],
      },
    ],
  },

  {
    id: 'systems',
    title: 'Systems',
    subtitle: 'A single spacing decision, compounded until it becomes an architecture.',
    whyConnected:
      'This chain is one idea repeated: a decision made once and reused is worth more than the same decision made well a hundred times. A spacing scale is the smallest version of that. A token gives the decision a name, a component gives it behaviour, a pattern gives it judgement, a design system gives it governance, and product architecture applies it to the structure of the application itself. Each step widens what can be decided once — and each inherits the same failure mode, which is an exception nobody wrote down.',
    links: [
      {
        id: 'spacing',
        label: 'Spacing',
        contribution:
          'The first constrained scale: a short set of values that makes the consistent choice the easy one.',
        lessonIds: ['lesson-02-02', 'lesson-02-05'],
      },
      {
        id: 'tokens',
        label: 'Tokens',
        contribution:
          'Gives the decision a name, so meaning survives when the value behind it changes.',
        lessonIds: ['lesson-09-01', 'lesson-04-05'],
      },
      {
        id: 'components',
        label: 'Components',
        contribution:
          'Attaches behaviour to the named decision, and turns the boundary into an API other people use.',
        lessonIds: ['lesson-07-01', 'lesson-08-01', 'lesson-08-02'],
      },
      {
        id: 'patterns',
        label: 'Patterns',
        contribution:
          'Captures the judgement a component API cannot hold: how several of them combine to solve a recurring problem.',
        lessonIds: ['lesson-09-04'],
      },
      {
        id: 'design-system',
        label: 'Design system',
        contribution:
          'Adds parity and governance, so the decisions hold across two environments and survive contact with a deadline.',
        lessonIds: ['lesson-09-02', 'lesson-09-03', 'lesson-09-05'],
      },
      {
        id: 'product-architecture',
        label: 'Product architecture',
        contribution:
          'Applies the same discipline to structure rather than appearance: where state lives, what owns data, how failure is contained.',
        lessonIds: ['lesson-13-01', 'lesson-13-03'],
      },
    ],
  },

  {
    id: 'interaction',
    title: 'Interaction',
    subtitle: 'One press, traced from the promise it makes to the people it must not exclude.',
    whyConnected:
      'These are the stages of a single interaction, in the order they happen. An affordance promises something; an event is the user taking the promise up; a transition is the system changing because of it; feedback is the system saying so; motion is how that change is explained; accessibility is making sure the whole sequence works for someone who cannot see it, cannot use a mouse, or cannot tolerate movement. Skipping any stage produces a specific, recognisable defect — a control that lies, a press that does nothing, a change nobody noticed.',
    links: [
      {
        id: 'affordance',
        label: 'Affordance',
        contribution:
          'The promise the control makes before anything is pressed, and the expectation it sets.',
        lessonIds: ['lesson-01-03'],
      },
      {
        id: 'event',
        label: 'Event',
        contribution:
          'The user acting on that promise, arriving as input the system can actually receive.',
        lessonIds: ['lesson-05-02', 'lesson-03-02'],
      },
      {
        id: 'state-transition',
        label: 'State transition',
        contribution:
          'The system moving from one state to another, which is the only thing that makes the press meaningful.',
        lessonIds: ['lesson-01-01', 'lesson-01-04'],
      },
      {
        id: 'feedback',
        label: 'Feedback',
        contribution:
          'Telling the user the transition happened — without it, a working system is indistinguishable from a broken one.',
        lessonIds: ['lesson-01-02', 'lesson-11-01'],
      },
      {
        id: 'motion',
        label: 'Motion',
        contribution:
          'Explaining the change rather than only announcing it: where the thing came from, and what is now different.',
        lessonIds: ['lesson-10-01', 'lesson-10-02', 'lesson-10-03'],
      },
      {
        id: 'accessibility',
        label: 'Accessibility',
        contribution:
          'Making every earlier stage work without sight, without a pointer, and without movement.',
        lessonIds: ['lesson-03-03', 'lesson-03-05', 'lesson-10-05'],
      },
    ],
  },

  {
    id: 'quality',
    title: 'Quality',
    subtitle: 'What a correct document becomes once you keep asking whether it still holds.',
    whyConnected:
      'Quality is not a final polish pass; it is a property that either accumulates from the first decision or cannot be added later. Semantic HTML is the first checkpoint — get the element wrong and accessibility must be rebuilt by hand. Correct semantics make interaction behaviour mostly free. Behaviour that is defined can be tested. Tests catch what you thought to specify, and design QA catches what nobody specified. Product quality is what is left when all five have been applied, which is why it cannot be bolted on at the end.',
    links: [
      {
        id: 'semantic-html',
        label: 'Semantic HTML',
        contribution:
          'Chooses elements for meaning, so structure and relationships exist before any script runs.',
        lessonIds: ['lesson-03-01'],
      },
      {
        id: 'accessibility-tree',
        label: 'Accessibility',
        contribution:
          'Turns that meaning into what assistive technology actually reads, and into a working keyboard path.',
        lessonIds: ['lesson-03-04', 'lesson-03-03'],
      },
      {
        id: 'interaction-behaviour',
        label: 'Interaction behaviour',
        contribution:
          'Makes every control do what its appearance promises, under every input, including interruption.',
        lessonIds: ['lesson-03-02', 'lesson-10-04', 'lesson-14-03'],
      },
      {
        id: 'testing',
        label: 'Testing',
        contribution:
          'Holds that behaviour in place through the next change, with effort weighted by what failure would cost.',
        lessonIds: ['lesson-13-04'],
      },
      {
        id: 'design-qa',
        label: 'Design QA',
        contribution:
          'Finds what tests cannot: the defects nobody specified, under real content and real conditions.',
        lessonIds: ['lesson-13-05', 'lesson-14-02'],
      },
      {
        id: 'product-quality',
        label: 'Product quality',
        contribution:
          'The result — perceived at the weakest point, which is why raising the floor matters more than raising the ceiling.',
        lessonIds: ['lesson-14-01', 'lesson-14-05'],
      },
    ],
  },

  {
    id: 'performance',
    title: 'Performance',
    subtitle: 'A layout choice, followed until it becomes something the user feels.',
    whyConnected:
      'Each step here is a cost the previous one commits you to. A layout decision determines what the browser must recompute; what it recomputes determines which animations are cheap; expensive animation and long scripts compete for the same single thread; and what that thread is doing when someone clicks is exactly what they experience as responsiveness. This is why performance cannot be a separate phase — by the time it is measurable, the decisions that caused it were made in the layout and the animation.',
    links: [
      {
        id: 'layout',
        label: 'Layout',
        contribution:
          'Decides the geometry the browser has to compute, and how far a single change propagates.',
        lessonIds: ['lesson-04-01', 'lesson-04-03'],
      },
      {
        id: 'browser-rendering',
        label: 'Browser rendering',
        contribution:
          'Turns that geometry into pixels through fixed stages, where the stage a change enters at is its cost.',
        lessonIds: ['lesson-12-01', 'lesson-12-02'],
      },
      {
        id: 'animation-choices',
        label: 'Animation choices',
        contribution:
          'Pays that cost on every frame — which is why transform and opacity are safe and width and height are not.',
        lessonIds: ['lesson-10-02', 'lesson-10-03'],
      },
      {
        id: 'javascript-execution',
        label: 'JavaScript execution',
        contribution:
          'Competes for the same thread as rendering, so a long task blocks input and frames alike.',
        lessonIds: ['lesson-12-03', 'lesson-05-05'],
      },
      {
        id: 'interaction-responsiveness',
        label: 'Interaction responsiveness',
        contribution:
          'What the user actually feels, and the only figure worth optimising against — measured, not assumed.',
        lessonIds: ['lesson-12-05', 'lesson-14-03'],
      },
    ],
  },
];
