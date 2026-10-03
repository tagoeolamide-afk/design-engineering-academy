/**
 * Module 07 — React Foundations.
 *
 * Every lesson here is explicitly a continuation of something the learner
 * already did by hand in Module 4 or modelled in Module 5. React is introduced
 * as the answer to a problem they have personally experienced — keeping the
 * screen in step with the data — rather than as a tool to be adopted.
 */

import type { CurriculumModule, Lesson, ModuleProject } from '@/types/curriculum';

const MODULE_ID = 'module-07';

/* -------------------------------------------------------------------------- */
/* Lesson 31                                                                   */
/* -------------------------------------------------------------------------- */

const LESSON_1: Lesson = {
  id: 'lesson-why-react-exists',
  slug: 'why-react-exists',
  moduleId: MODULE_ID,
  lessonNumber: 1,
  title: 'Why React Exists',
  summary:
    'In Module 4 you updated the page by hand, step by step. React exists because that approach stops working — and the alternative is describing the result instead of the steps.',
  estimatedMinutes: 9,
  objectives: [
    'Describe the problem that manual DOM updating creates as an interface grows.',
    'Explain the difference between describing steps and describing a result.',
    'Read a simple React component and say what it renders.',
    'Explain what "the interface is a function of the data" means.',
  ],
  prerequisiteConcepts: [
    'Changing the page from JavaScript, Module 4',
    'State as facts, Module 5',
    'Types and unions, Module 6',
  ],
  prerequisiteLessonIds: [
    'lesson-events-clicks-and-user-input',
    'lesson-objects-unions-and-safer-interface-states',
  ],
  recap: [
    {
      kind: 'paragraph',
      text: 'Module 6 gave you types that make impossible states unwriteable. Before that, Module 4 had you updating the page by hand: find the element, change its text, toggle an attribute, keep the label in step.',
    },
  ],
  priorKnowledge: [
    {
      kind: 'paragraph',
      text: 'You wrote this in Module 4 lesson 17, and it worked:',
    },
    {
      kind: 'code',
      language: 'javascript',
      code: 'details.hidden = isOpen;\ntoggle.textContent = isOpen ? "Show details" : "Hide details";\ntoggle.setAttribute("aria-expanded", String(!isOpen));',
    },
    {
      kind: 'paragraph',
      text: 'Three lines to keep three things in step for one disclosure. Hold that example; this lesson is about what happens to it at scale.',
    },
  ],
  coreConcept: [
    {
      kind: 'paragraph',
      text: 'The problem is not any single update. It is that every piece of state has to be manually connected to every part of the screen it affects, and the number of those connections grows much faster than the interface does.',
    },
    {
      kind: 'paragraph',
      text: 'A project list with a filter, a selection, a loading state and an inline editor has perhaps six pieces of state and twenty places on screen that depend on them. By hand, that is twenty connections to write and keep correct — and every new feature multiplies rather than adds.',
    },
    {
      kind: 'paragraph',
      text: 'React removes the connections. You describe what the screen should look like for a given state, and it works out what to change.',
    },
  ],
  whyDesignersCare: [
    {
      kind: 'paragraph',
      text: 'Because almost every "it only happens sometimes" interface bug is a missed connection.',
    },
    {
      kind: 'paragraph',
      text: 'The badge that did not update. The button that stayed disabled after the error cleared. The panel showing old data for a moment. Each is a place where the state changed and one of the things depending on it was not told.',
    },
    {
      kind: 'paragraph',
      text: 'React does not make interfaces faster to build, particularly. It makes this specific class of bug mostly stop happening, which is a bigger deal.',
    },
  ],
  howItWorks: [
    {
      kind: 'paragraph',
      text: 'The shift is from **imperative** — a list of steps — to **declarative** — a description of the result.',
    },
    {
      kind: 'code',
      language: 'javascript',
      code: '// Module 4: the steps.\nif (isOpen) {\n  details.hidden = false;\n  toggle.textContent = "Hide details";\n} else {\n  details.hidden = true;\n  toggle.textContent = "Show details";\n}',
    },
    {
      kind: 'code',
      language: 'tsx',
      code: '// React: the result.\nfunction Disclosure({ isOpen }: { isOpen: boolean }) {\n  return (\n    <>\n      <button>{isOpen ? "Hide details" : "Show details"}</button>\n      {isOpen && <div>Here are the details.</div>}\n    </>\n  );\n}',
    },
    {
      kind: 'paragraph',
      text: 'Line by line. `function Disclosure(...)` is a **component** — a function that returns what to show. Its input is an object of values, typed exactly as in Module 6.',
    },
    {
      kind: 'paragraph',
      text: 'The markup inside is **JSX**: HTML written in JavaScript. The braces drop a JavaScript value in, so `{isOpen ? ... : ...}` is the conditional from Module 4 lesson 18, used to choose text.',
    },
    {
      kind: 'paragraph',
      text: '`{isOpen && <div>…</div>}` renders the div only when `isOpen` is true — the `&&` from Module 4 again. `<>` and `</>` are an empty wrapper, needed only because a function must return one thing.',
    },
    {
      kind: 'paragraph',
      text: 'There is no instruction to change anything. The component says what the interface *is* for a given `isOpen`, and React makes the screen match.',
    },
  ],
  firstPrinciples: [
    {
      kind: 'paragraph',
      text: 'The idea underneath: **the interface is a function of the data**.',
    },
    {
      kind: 'paragraph',
      text: 'Given the same state, you get the same screen, every time. There is no accumulated history of changes that might have gone wrong — the screen is recomputed from the facts.',
    },
    {
      kind: 'callout',
      tone: 'insight',
      body: 'This is the same discipline as Module 5, enforced by the tool. Nothing derived is stored, and the screen is derived from state rather than nudged towards it.',
    },
  ],
  designPerspective: [
    {
      kind: 'paragraph',
      text: 'The design question barely changes, and that is the point.',
    },
    {
      kind: 'paragraph',
      text: 'You still enumerate states and design each one. What changes is that the enumeration now maps directly onto code: a designed state becomes a value, and a designed screen becomes what the component returns for it. The gap between the design artefact and the implementation narrows considerably.',
    },
  ],
  engineeringPerspective: [
    {
      kind: 'paragraph',
      text: 'The engineering question is what it costs.',
    },
    {
      kind: 'paragraph',
      text: 'React re-runs components when state changes and compares the result with what is on screen, updating only the differences. That comparison is not free, but it is predictable — and predictable beats the alternative, where correctness depends on nobody forgetting a connection.',
    },
  ],
  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'React makes the design artefact and the implementation the same shape.',
    },
    {
      kind: 'paragraph',
      text: 'A designer who lists four states and a component that handles four states are now describing the same thing in two notations. That is why React is worth learning for someone whose background is design: it rewards exactly the thinking you already do.',
    },
  ],
  industryExamples: [
    {
      id: 'example-react-docs-ui-as-tree',
      source: 'React',
      title: 'Described as a tree of components',
      observation:
        'The React documentation presents an interface as a tree of components, each rendering from its inputs.',
      takeaway:
        'The mental model is the same one you used in Module 1 lesson 5: page, sections, repeated parts, controls.',
    },
    {
      id: 'example-figma-canvas-react',
      source: 'Figma',
      title: 'Products built this way at scale',
      observation:
        'Figma, Linear, GitHub and Vercel all build their interfaces from component-based frameworks.',
      takeaway:
        'Not a fashion. At the scale these products operate, hand-wiring every connection stops being possible.',
    },
  ],
  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Take the Module 4 disclosure and compare the two versions honestly.',
    },
    {
      kind: 'paragraph',
      text: 'By hand, adding one requirement — the panel also shows a count — means finding every place the panel is updated and adding the count there too. Miss one and the count is stale in that path only, which is the bug that only happens sometimes.',
    },
    {
      kind: 'code',
      language: 'tsx',
      code: 'function Disclosure({ isOpen, items }: { isOpen: boolean; items: string[] }) {\n  return (\n    <>\n      <button aria-expanded={isOpen}>\n        {isOpen ? "Hide" : "Show"} details ({items.length})\n      </button>\n\n      {isOpen && (\n        <ul>\n          {items.map((item) => (\n            <li key={item}>{item}</li>\n          ))}\n        </ul>\n      )}\n    </>\n  );\n}',
    },
    {
      kind: 'paragraph',
      text: 'In React, the count appears in one place and is correct everywhere, because there is only one description of the button. `items.length` is the derived value from Module 5 lesson 23 — not stored, asked.',
    },
    {
      kind: 'paragraph',
      text: '`items.map(...)` is the array method from JavaScript, producing one `<li>` per item. The `key` is explained properly in lesson 33.',
    },
  ],
  commonMistakes: [
    {
      id: 'mistake-07-01-manual-dom-in-react',
      mistake: 'Reaching for `document.querySelector` inside a React component.',
      why: 'Two things are now changing the page and they will disagree. React will overwrite the manual change on the next render.',
      instead:
        'Change the state and let the component describe the result. If you are querying the DOM, you are still writing Module 4 code.',
    },
    {
      id: 'mistake-07-01-framework-as-default',
      mistake: 'Assuming every interface needs React.',
      why: 'A static page with one disclosure does not benefit, and gains a build step and a download.',
      instead:
        'React earns its place when the number of state-to-screen connections is large. For a page with three, plain JavaScript is lighter and clearer.',
    },
  ],
  professionalConsideration: [
    {
      kind: 'paragraph',
      text: 'The declarative shift is why React is often said to be easy to learn and hard to master.',
    },
    {
      kind: 'paragraph',
      text: 'The syntax takes an afternoon. The difficulty is giving up the instinct to reach in and change something, and instead asking "what state would produce the screen I want?" That reframing is the whole skill, and the Module 5 habit of listing facts is the best possible preparation for it.',
    },
  ],
  practicalExercise: {
    id: 'exercise-why-react-exists',
    title: 'Compare one interaction in both approaches',
    prompt:
      'Take one interaction you built by hand in Module 4 and rebuild it in React, then compare the two directly.',
    steps: [
      'Pick an interaction with at least two things that change together.',
      'Count the places your Module 4 version updates the page.',
      'Rebuild it as a React component.',
      'Count the places the React version describes the result.',
      'Add one new requirement to both — a count, an extra label, a disabled condition.',
      'Record how many lines each change touched.',
      'Write a paragraph on what the difference means as an interface grows.',
    ],
    successCriteria: [
      'Both versions exist and work.',
      'Update sites counted in both.',
      'The same new requirement added to both, with lines touched recorded.',
      'A written comparison that addresses growth rather than only line count.',
    ],
    estimatedMinutes: 55,
    hint: 'Pick something with at least three dependent pieces. With one, the hand-written version looks perfectly reasonable — which is honest, and not the case this lesson is about.',
  },
  reflectionQuestion:
    'What kind of interface bug does the declarative approach make structurally unlikely?',
  reflectionHint:
    'Think about what has to be remembered in each approach, and what happens when it is not.',
  resources: [
    {
      id: 'resource-react-quick-start',
      title: 'Quick Start — React',
      url: 'https://react.dev/learn',
      type: 'documentation',
      author: 'React',
      estimatedMinutes: 60,
      note: 'The official introduction. Genuinely good, and written for people who know JavaScript.',
    },
    {
      id: 'resource-react-thinking-in-react',
      title: 'Thinking in React',
      url: 'https://react.dev/learn/thinking-in-react',
      type: 'documentation',
      author: 'React',
      estimatedMinutes: 30,
      note: 'How to go from a design to a component tree. Essentially Module 1 lesson 5 in React terms.',
    },
  ],
  competencyTags: ['react', 'javascript', 'component-architecture'],
  completionCriteria: [
    'Can explain why manual DOM updating fails as an interface grows.',
    'Can read a component and say what it renders for given inputs.',
    'Can state what "the interface is a function of the data" means.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Lesson 32                                                                   */
/* -------------------------------------------------------------------------- */

const LESSON_2: Lesson = {
  id: 'lesson-components-and-props',
  slug: 'components-and-props',
  moduleId: MODULE_ID,
  lessonNumber: 2,
  title: 'Components and Props',
  summary:
    'A component is a reusable piece of interface; props are what you pass into it. This is the Figma component model, in code.',
  estimatedMinutes: 9,
  objectives: [
    'Write a component that takes typed props.',
    'Use children to pass content rather than configuration.',
    'Decide what should be a prop and what should not.',
    'Map a Figma component and its properties onto a React component.',
  ],
  prerequisiteConcepts: [
    'Components intuition from Module 1 lesson 5',
    'Types from Module 6',
    'JSX from the previous lesson',
  ],
  prerequisiteLessonIds: [
    'lesson-why-react-exists',
    'lesson-breaking-an-interface-into-parts',
  ],
  recap: [
    {
      kind: 'paragraph',
      text: 'Last lesson you saw a component as a function that returns markup. This lesson is about its inputs.',
    },
  ],
  priorKnowledge: [
    {
      kind: 'paragraph',
      text: 'In Module 1 lesson 5 you decided which parts of an interface deserve a name, and concluded that behaviour is a better boundary than appearance. In Figma you build components with properties — text, boolean, variant.',
    },
    {
      kind: 'paragraph',
      text: 'Props are those properties. The notation is different; the model is identical.',
    },
  ],
  coreConcept: [
    {
      kind: 'paragraph',
      text: 'A component takes an object of values and returns markup. Those values are **props**.',
    },
    {
      kind: 'code',
      language: 'tsx',
      code: 'type BadgeProps = {\n  label: string;\n  tone: "neutral" | "success" | "warning" | "danger";\n};\n\nfunction Badge({ label, tone }: BadgeProps) {\n  return <span className={`badge badge-${tone}`}>{label}</span>;\n}',
    },
    {
      kind: 'paragraph',
      text: 'Line by line. `BadgeProps` is a type from Module 6 — and `tone` is a union, so only those four values are possible. A fifth tone is a compile error, not a broken badge.',
    },
    {
      kind: 'paragraph',
      text: '`{ label, tone }` pulls the two values out of the props object. `className` is JSX’s name for the HTML `class` attribute, because `class` is a reserved word in JavaScript.',
    },
    {
      kind: 'paragraph',
      text: 'Used like an HTML element: `<Badge label="Draft" tone="neutral" />`.',
    },
  ],
  whyDesignersCare: [
    {
      kind: 'paragraph',
      text: 'Because the props are the component’s public interface, and designing it is design work.',
    },
    {
      kind: 'paragraph',
      text: 'A Badge with a `tone` union can only be one of four designed things. A Badge with `color` and `backgroundColor` as free strings can be anything, which means the design system is advisory rather than real.',
    },
    {
      kind: 'paragraph',
      text: 'Which of those you build is a decision about how much the component is allowed to be misused — and that is a design decision expressed in a type.',
    },
  ],
  howItWorks: [
    {
      kind: 'paragraph',
      text: 'The second mechanism is **children**: content passed between the tags rather than as a named value.',
    },
    {
      kind: 'code',
      language: 'tsx',
      code: 'type CardProps = {\n  title: string;\n  children: React.ReactNode;\n};\n\nfunction Card({ title, children }: CardProps) {\n  return (\n    <section className="card">\n      <h3>{title}</h3>\n      {children}\n    </section>\n  );\n}',
    },
    {
      kind: 'code',
      language: 'tsx',
      code: '<Card title="Profile">\n  <p>Manage how you appear to other people.</p>\n  <Button>Edit</Button>\n</Card>',
    },
    {
      kind: 'paragraph',
      text: '`React.ReactNode` is the type for "anything renderable". Everything between the tags arrives as `children` and is rendered where the component places it.',
    },
    {
      kind: 'paragraph',
      text: 'This is the difference between a component that configures its contents and one that holds whatever you put in it. The second is far more flexible, and lesson 39 builds on it.',
    },
  ],
  firstPrinciples: [
    {
      kind: 'paragraph',
      text: 'Props flow one way: from parent to child. A child cannot change what it was given.',
    },
    {
      kind: 'paragraph',
      text: 'That restriction is what makes a component predictable. Given the same props, the same output — so when something is wrong, the cause is in the props or in the component, and nowhere else.',
    },
    {
      kind: 'paragraph',
      text: 'When a child needs to cause a change, the parent passes down a function for it to call. That is covered in lesson 34, and it is how one-way flow and interactivity coexist.',
    },
  ],
  designPerspective: [
    {
      kind: 'paragraph',
      text: 'The design question is what varies between uses and what does not.',
    },
    {
      kind: 'paragraph',
      text: 'The label of a badge varies — it is a prop. The 6px radius does not — it belongs in the component. Every prop is a promise to support that variation forever, so a prop added casually is a maintenance commitment made casually.',
    },
  ],
  engineeringPerspective: [
    {
      kind: 'paragraph',
      text: 'The engineering question is how narrow the types can be.',
    },
    {
      kind: 'paragraph',
      text: 'A union beats a string. A required prop beats an optional one with a default nobody intended. The narrower the type, the more misuse is caught as it is written rather than discovered in review — which is the Module 6 argument applied to components.',
    },
  ],
  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'A Figma component with a variant property and a React component with a union prop are the same object described twice.',
    },
    {
      kind: 'paragraph',
      text: 'When the names match — same component name, same property names, same allowed values — handoff becomes checking rather than translating. Module 10 makes this parity a deliberate practice.',
    },
  ],
  industryExamples: [
    {
      id: 'example-polaris-props',
      source: 'Shopify',
      title: 'Props documented as the component contract',
      observation:
        'Polaris documents every prop with its type and allowed values alongside the visual examples.',
      takeaway:
        'The prop table is the real specification. The screenshots show what it produces.',
    },
    {
      id: 'example-figma-variant-parity',
      source: 'Figma',
      title: 'Variants as a closed set',
      observation:
        'A Figma variant property offers a fixed list of values rather than free input.',
      takeaway:
        'Exactly the constraint a union gives in code. The two tools agree about what a component should allow.',
    },
  ],
  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Build a reusable card from a design.',
    },
    {
      kind: 'code',
      language: 'tsx',
      code: 'type ProductCardProps = {\n  name: string;\n  price: number;\n  currency: string;\n  imageUrl?: string;\n  inStock: boolean;\n};\n\nfunction ProductCard({ name, price, currency, imageUrl, inStock }: ProductCardProps) {\n  return (\n    <article className="product-card">\n      <img src={imageUrl ?? "/images/placeholder.png"} alt="" />\n      <h3>{name}</h3>\n      <p>{formatPrice(price, currency)}</p>\n      {inStock === false && <Badge label="Out of stock" tone="warning" />}\n    </article>\n  );\n}',
    },
    {
      kind: 'paragraph',
      text: 'This is the `Product` type from Module 6, used as props. The optional `imageUrl` still forces the placeholder decision, exactly as it did there.',
    },
    {
      kind: 'paragraph',
      text: '`alt=""` on the image is deliberate: the product name is already the heading beside it, so announcing the image as well would repeat. An empty alt marks it as decorative — a decision Module 9 returns to.',
    },
    {
      kind: 'paragraph',
      text: 'And `Badge` is used inside `ProductCard`. Components compose, which is how a page is built from a handful of small pieces rather than one large one.',
    },
  ],
  commonMistakes: [
    {
      id: 'mistake-07-02-too-many-props',
      mistake: 'Adding a prop for every variation that comes up.',
      why: 'The component becomes a configuration file, and the props start contradicting each other.',
      instead:
        'When props accumulate, the boundary is usually wrong. Lesson 38 covers this directly.',
    },
    {
      id: 'mistake-07-02-string-instead-of-union',
      mistake: 'Typing a constrained prop as `string`.',
      why: 'Any value is then accepted, including typos, and the design system constraint exists only in documentation.',
      instead: 'Use a union of the allowed values. The editor then offers them and refuses the rest.',
    },
  ],
  professionalConsideration: [
    {
      kind: 'paragraph',
      text: 'A useful test for whether something should be a prop: would two uses on the same screen reasonably differ?',
    },
    {
      kind: 'paragraph',
      text: 'Two badges with different labels, certainly. Two badges with different corner radii, almost never — and if they do, that is a design inconsistency being encoded rather than a variation being supported. Props make inconsistency easy, which is why each one deserves a moment of resistance.',
    },
  ],
  practicalExercise: {
    id: 'exercise-components-and-props',
    title: 'Build reusable cards',
    prompt:
      'Take a card you designed in Figma and build it as a React component with typed props, then use it several times with different data.',
    steps: [
      'List the Figma component’s properties.',
      'Write the props type, using unions for anything with a fixed set of values.',
      'Build the component.',
      'Render at least four instances with genuinely different data.',
      'Include one awkward case: a long name, a missing image, an unusual value.',
      'Identify one thing you were tempted to make a prop and decided against, and say why.',
      'Use `children` for at least one part rather than a named prop.',
    ],
    successCriteria: [
      'Props are typed, with unions for constrained values.',
      'Four or more instances with different data.',
      'At least one awkward case renders correctly.',
      'One rejected prop is documented with reasoning.',
      '`children` is used where content rather than configuration is being passed.',
    ],
    estimatedMinutes: 60,
    hint: 'Start from the Figma properties panel. If a property is a variant there, it is a union here — the mapping is usually that direct.',
  },
  reflectionQuestion:
    'Why is a union type a better prop than a string, even though both work?',
  reflectionHint:
    'Think about what each one allows a future developer — including you — to pass in without anybody noticing.',
  resources: [
    {
      id: 'resource-react-passing-props',
      title: 'Passing Props to a Component',
      url: 'https://react.dev/learn/passing-props-to-a-component',
      type: 'documentation',
      author: 'React',
      estimatedMinutes: 25,
      note: 'Props, children, and defaults, with interactive examples.',
    },
    {
      id: 'resource-react-your-first-component',
      title: 'Your First Component',
      url: 'https://react.dev/learn/your-first-component',
      type: 'documentation',
      author: 'React',
      estimatedMinutes: 20,
      note: 'Defining and composing components. Short, and the right place to start.',
    },
  ],
  competencyTags: ['react', 'component-api-design', 'typescript', 'design-systems'],
  completionCriteria: [
    'Can write a component with typed props.',
    'Uses unions for constrained values rather than strings.',
    'Can explain when to use children instead of a prop.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Lesson 33                                                                   */
/* -------------------------------------------------------------------------- */

const LESSON_3: Lesson = {
  id: 'lesson-rendering-lists-and-conditional-ui',
  slug: 'rendering-lists-and-conditional-ui',
  moduleId: MODULE_ID,
  lessonNumber: 3,
  title: 'Rendering Lists and Conditional UI',
  summary:
    'Turning an array into interface, and choosing between variations — the JavaScript you already know, applied inside JSX.',
  estimatedMinutes: 9,
  objectives: [
    'Render a list from an array.',
    'Explain what a key is for and choose a correct one.',
    'Render different output for different conditions.',
    'Handle the empty case as a designed state rather than an absence.',
  ],
  prerequisiteConcepts: [
    'Arrays and conditions from Module 4',
    'Empty states from Module 4 lesson 18',
    'Components and props',
  ],
  prerequisiteLessonIds: [
    'lesson-components-and-props',
    'lesson-conditions-and-interface-decisions',
  ],
  recap: [
    {
      kind: 'paragraph',
      text: 'You can write a component that takes typed props. Most real interfaces render many of them from data, which is this lesson.',
    },
  ],
  priorKnowledge: [
    {
      kind: 'paragraph',
      text: 'In Module 4 lesson 18 you wrote a function distinguishing "no results match your filters" from "nothing here yet". That distinction returns here as two different pieces of interface.',
    },
  ],
  coreConcept: [
    {
      kind: 'paragraph',
      text: 'A list is an array turned into elements with `map`.',
    },
    {
      kind: 'code',
      language: 'tsx',
      code: 'function ProductList({ products }: { products: Product[] }) {\n  return (\n    <ul>\n      {products.map((product) => (\n        <ProductCard key={product.id} {...product} />\n      ))}\n    </ul>\n  );\n}',
    },
    {
      kind: 'paragraph',
      text: '`products.map(...)` produces one element per item — the same array method from Module 4, now returning markup instead of values.',
    },
    {
      kind: 'paragraph',
      text: '`{...product}` spreads the object’s fields as individual props, so a product with `name` and `price` passes both. Convenient, and worth using carefully: it passes everything, including fields the component does not expect.',
    },
  ],
  whyDesignersCare: [
    {
      kind: 'paragraph',
      text: 'Because this is where designs meet real data, and real data is never the length the design showed.',
    },
    {
      kind: 'paragraph',
      text: 'Zero items. One item. Four hundred. A name that is forty characters. The design showed six tidy cards; the list has to work for all of it, and those cases are decided here.',
    },
  ],
  howItWorks: [
    {
      kind: 'paragraph',
      text: 'Every item in a list needs a **key** — a value that identifies it across renders.',
    },
    {
      kind: 'paragraph',
      text: 'React uses it to tell which item is which when the list changes. Without it, React compares by position, which goes wrong the moment items are inserted, removed or reordered.',
    },
    {
      kind: 'code',
      language: 'tsx',
      code: '// Good: a stable id that belongs to the item.\n{products.map((p) => <ProductCard key={p.id} {...p} />)}\n\n// Bad: position, which changes when the list does.\n{products.map((p, index) => <ProductCard key={index} {...p} />)}',
    },
    {
      kind: 'paragraph',
      text: 'The failure with index keys is specific and nasty: delete the first item and every subsequent item shifts up a position, so React believes each one *became* its neighbour. Any state inside them — a focused field, a half-typed value, an open menu — stays attached to the wrong row.',
    },
    {
      kind: 'callout',
      tone: 'pitfall',
      body: 'Index keys are safe only for a list that never reorders, never filters and never has items inserted or removed. If any of those are possible, use a real id.',
    },
  ],
  firstPrinciples: [
    {
      kind: 'paragraph',
      text: 'Conditional rendering is the Module 4 conditions, written inside JSX.',
    },
    {
      kind: 'code',
      language: 'tsx',
      code: '{isLoading && <Spinner />}\n\n{error !== null ? <ErrorMessage text={error} /> : <ProductList products={products} />}',
    },
    {
      kind: 'paragraph',
      text: '`&&` renders the right side when the left is true. `? :` chooses between two. Nothing new — the same two tools from Module 4 lesson 18.',
    },
    {
      kind: 'paragraph',
      text: 'One trap worth knowing: `{items.length && <List />}` renders the number `0` when the array is empty, because `0` is falsy but still a renderable value. Write `{items.length > 0 && <List />}` and the problem disappears.',
    },
  ],
  designPerspective: [
    {
      kind: 'paragraph',
      text: 'The design question is the one from Module 4: which kind of empty is this?',
    },
    {
      kind: 'paragraph',
      text: 'Nothing exists yet invites creating something. Nothing matched the filter invites clearing it. They are different screens, and rendering the same component for both is the most common version of getting this wrong.',
    },
  ],
  engineeringPerspective: [
    {
      kind: 'paragraph',
      text: 'The engineering question is where the branching lives.',
    },
    {
      kind: 'paragraph',
      text: 'Deeply nested ternaries inside JSX become unreadable fast. The usual remedy is to decide early and return — the same early-exit shape you used for validation in Module 4 — so each case is a short, separate block rather than one tangled expression.',
    },
  ],
  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'The discriminated union from Module 6 makes this tidy.',
    },
    {
      kind: 'paragraph',
      text: 'With `request.status` as a union, the rendering becomes one branch per designed state — and the type system insists every one is handled. The design enumeration, the type, and the rendering end up as three views of one list.',
    },
  ],
  industryExamples: [
    {
      id: 'example-react-keys-docs',
      source: 'React',
      title: 'Keys documented as identity',
      observation:
        'React’s documentation frames keys as telling React which item is which, not as a uniqueness requirement.',
      takeaway:
        'The framing matters. A key is identity across time, which is why a position cannot serve as one.',
    },
    {
      id: 'example-linear-list-states',
      source: 'Linear',
      title: 'Distinct empty states',
      observation:
        'Linear distinguishes a view with no issues from a filter that matched nothing, with different wording and different actions.',
      takeaway:
        'The distinction is visible in the product because it was made in the code. Collapsing it would be invisible to the developer and confusing to the user.',
    },
  ],
  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Render a list that handles every case from Module 4 lesson 20.',
    },
    {
      kind: 'code',
      language: 'tsx',
      code: 'function Projects({ state }: { state: RequestState }) {\n  if (state.status === "loading") return <Skeleton />;\n\n  if (state.status === "error") {\n    return <ErrorMessage text={state.message} onRetry={retry} />;\n  }\n\n  if (state.status === "success" && state.results.length === 0) {\n    return <EmptyState title="No projects yet" action="Create your first" />;\n  }\n\n  if (state.status === "success") {\n    return (\n      <ul>\n        {state.results.map((project) => (\n          <ProjectCard key={project.id} {...project} />\n        ))}\n      </ul>\n    );\n  }\n\n  return null;\n}',
    },
    {
      kind: 'paragraph',
      text: 'Each case returns early, so there is no nesting. Reading top to bottom gives the designed states in order.',
    },
    {
      kind: 'paragraph',
      text: 'The narrowing from Module 6 is doing real work: `state.message` is available only in the error branch and `state.results` only in the success branches, because the union says so.',
    },
  ],
  commonMistakes: [
    {
      id: 'mistake-07-03-index-keys',
      mistake: 'Using the array index as a key.',
      why: 'When the list changes, state stays attached to the wrong item — a focused input, a typed value, an open menu.',
      instead: 'Use an id from the data. If the data has none, that is worth fixing at the source.',
    },
    {
      id: 'mistake-07-03-zero-renders',
      mistake: 'Writing `{items.length && <List />}`.',
      why: 'An empty array renders a literal `0` on the page, because zero is falsy but still renderable.',
      instead: 'Compare explicitly: `{items.length > 0 && <List />}`.',
    },
  ],
  professionalConsideration: [
    {
      kind: 'paragraph',
      text: 'A key is identity, and identity is a product question before it is a technical one.',
    },
    {
      kind: 'paragraph',
      text: 'If a list has no stable ids, the deeper issue is usually that the data model does not distinguish its items — which will cause trouble well beyond rendering. Generating ids in the component hides the problem; fixing it at the source solves it.',
    },
  ],
  practicalExercise: {
    id: 'exercise-rendering-lists-and-conditional-ui',
    title: 'Render project cards from data',
    prompt:
      'Build a list that renders from an array and handles loading, error, empty-because-nothing, empty-because-filtered, and content.',
    steps: [
      'Define a typed array of at least six items with real ids.',
      'Render the list with a stable key.',
      'Add the two empty cases as separate components with different wording and actions.',
      'Add loading and error states.',
      'Use a discriminated union for the request, and narrow on it.',
      'Delete an item from the middle and confirm the others keep their identity.',
      'Switch to index keys temporarily, repeat that test, and record what breaks.',
    ],
    successCriteria: [
      'Keys come from stable ids.',
      'The two empty cases are genuinely different.',
      'All five states render correctly.',
      'Branching uses early returns rather than nested ternaries.',
      'The index-key failure is reproduced and described.',
    ],
    estimatedMinutes: 65,
    hint: 'For the index-key test, put a text input in each row and type into one before deleting a row above it. The value follows the position, not the item.',
  },
  reflectionQuestion:
    'Why does using an array index as a key cause state to attach to the wrong item?',
  reflectionHint:
    'Ask what changes when an item is removed from the middle: the item’s identity, or its position?',
  resources: [
    {
      id: 'resource-react-rendering-lists',
      title: 'Rendering Lists',
      url: 'https://react.dev/learn/rendering-lists',
      type: 'documentation',
      author: 'React',
      estimatedMinutes: 30,
      note: 'Lists and keys, including why index keys fail.',
    },
    {
      id: 'resource-react-conditional-rendering',
      title: 'Conditional Rendering',
      url: 'https://react.dev/learn/conditional-rendering',
      type: 'documentation',
      author: 'React',
      estimatedMinutes: 20,
      note: 'The patterns for choosing what to render, including the falsy-zero trap.',
    },
  ],
  competencyTags: ['react', 'javascript', 'interface-state-modelling', 'ux-reasoning'],
  completionCriteria: [
    'Can render a list with correct, stable keys.',
    'Can explain and demonstrate the index-key failure.',
    'Handles both kinds of emptiness distinctly.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Lesson 34                                                                   */
/* -------------------------------------------------------------------------- */

const LESSON_4: Lesson = {
  id: 'lesson-state-in-react',
  slug: 'state-in-react',
  moduleId: MODULE_ID,
  lessonNumber: 4,
  title: 'State in React',
  summary:
    'The state you modelled in Module 5, held by React so that changing it redraws the screen. The third and final appearance of the same idea.',
  estimatedMinutes: 10,
  objectives: [
    'Hold state in a component and update it.',
    'Explain why state must be replaced rather than modified.',
    'Keep derived values out of state, as in Module 5.',
    'Trace the path from an event to a redrawn screen.',
  ],
  prerequisiteConcepts: [
    'State as facts, Module 5',
    'Derived state, Module 5 lesson 23',
    'Components and rendering',
  ],
  prerequisiteLessonIds: [
    'lesson-rendering-lists-and-conditional-ui',
    'lesson-what-interface-state-means',
  ],
  recap: [
    {
      kind: 'paragraph',
      text: 'You can render from props, but props come from a parent and cannot be changed. For an interface to respond to its own user, something has to be able to change — that is state.',
    },
  ],
  priorKnowledge: [
    {
      kind: 'paragraph',
      text: 'This is the third time you have met state. Module 5 lesson 21 defined it as what is currently true. Module 6 lesson 27 typed it as a union. Now React holds it.',
    },
    {
      kind: 'paragraph',
      text: 'The definition has not changed at all. Only the custody has.',
    },
  ],
  coreConcept: [
    {
      kind: 'paragraph',
      text: '`useState` gives a component a value it can change, and tells React to redraw when it does.',
    },
    {
      kind: 'code',
      language: 'tsx',
      code: 'function Counter() {\n  const [count, setCount] = useState(0);\n\n  return (\n    <button onClick={() => setCount(count + 1)}>\n      Pressed {count} times\n    </button>\n  );\n}',
    },
    {
      kind: 'paragraph',
      text: 'Line by line. `useState(0)` creates a piece of state starting at `0`. It returns two things: the current value and a function to change it, which the square brackets pull apart in that order.',
    },
    {
      kind: 'paragraph',
      text: '`onClick` is React’s version of the listener from Module 4 lesson 17 — same event, attached as a prop rather than with `addEventListener`.',
    },
    {
      kind: 'paragraph',
      text: '`setCount(count + 1)` sets the new value. React then re-runs the component, `count` is now one higher, and the button text is redrawn. You never touched the button.',
    },
  ],
  whyDesignersCare: [
    {
      kind: 'paragraph',
      text: 'Because this is where your enumerated states stop being a document and start being the product.',
    },
    {
      kind: 'paragraph',
      text: 'A state you listed in Module 5 becomes a `useState` here, and the screens you designed for it become what the component returns. If a state you designed has no corresponding value in the code, it does not exist — and that mismatch is now checkable.',
    },
  ],
  howItWorks: [
    {
      kind: 'paragraph',
      text: 'The rule that surprises people: you replace state, you do not modify it.',
    },
    {
      kind: 'code',
      language: 'tsx',
      code: '// Wrong — changes the existing array. React sees no new value.\nitems.push(newItem);\nsetItems(items);\n\n// Right — a new array containing the old items and the new one.\nsetItems([...items, newItem]);',
    },
    {
      kind: 'paragraph',
      text: '`[...items, newItem]` builds a new array by spreading the old one and adding to it. The same applies to objects: `{ ...user, name: "Ada" }` is a new object with one field changed.',
    },
    {
      kind: 'paragraph',
      text: 'The reason is how React decides whether anything changed. It compares the old value with the new one; modifying in place leaves them the same thing, so nothing appears to have changed and the screen does not update.',
    },
  ],
  firstPrinciples: [
    {
      kind: 'paragraph',
      text: 'State is a **snapshot**. Within one run of a component, the value does not change — even after you call the setter.',
    },
    {
      kind: 'code',
      language: 'tsx',
      code: 'function handleClick() {\n  setCount(count + 1);\n  console.log(count); // still the old value\n}',
    },
    {
      kind: 'paragraph',
      text: 'The log shows the old number, because `count` in this run is fixed. The new value exists in the *next* run.',
    },
    {
      kind: 'paragraph',
      text: 'This matters when updating twice. `setCount(count + 1)` twice adds one, not two, because both read the same snapshot. To build on the previous value, pass a function: `setCount((current) => current + 1)`.',
    },
  ],
  designPerspective: [
    {
      kind: 'paragraph',
      text: 'The design question is unchanged from Module 5: what is the minimal set of facts?',
    },
    {
      kind: 'paragraph',
      text: 'The discipline matters more here, because React makes it easy to add another `useState` whenever something needs to vary. A component with seven pieces of state is usually storing several things it could calculate — the Module 5 lesson 23 problem, in a new setting.',
    },
  ],
  engineeringPerspective: [
    {
      kind: 'paragraph',
      text: 'The engineering question is what should be state at all.',
    },
    {
      kind: 'code',
      language: 'tsx',
      code: 'const [query, setQuery] = useState("");\nconst [items] = useState(allItems);\n\n// Derived, not state. Recalculated each render.\nconst visible = items.filter((item) => item.name.includes(query));\nconst isEmpty = visible.length === 0;',
    },
    {
      kind: 'paragraph',
      text: 'Two facts and two derivations. Had `visible` been state, it would need updating every time either the query or the items changed — and the first time somebody forgot, the list would show results for a query the user had already cleared.',
    },
  ],
  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'Module 5 argued for minimal state on principle. React punishes you concretely for ignoring it.',
    },
    {
      kind: 'paragraph',
      text: 'Stored derivations in React produce stale screens: the visible symptom of duplicated truth. The principle and the practical consequence line up exactly, which is unusual and worth noticing.',
    },
  ],
  industryExamples: [
    {
      id: 'example-react-state-snapshot',
      source: 'React',
      title: 'Snapshots documented explicitly',
      observation:
        'The React documentation has a dedicated page explaining that state behaves as a snapshot within a render.',
      takeaway:
        'It gets its own page because it is the most common source of confusion for people arriving from imperative code.',
    },
    {
      id: 'example-react-dev-tools',
      source: 'React',
      title: 'State as an inspectable thing',
      observation:
        'React DevTools shows the current state of any component in the tree.',
      takeaway:
        'Being able to read the actual state while using the interface is the fastest way to diagnose a screen that looks wrong.',
    },
  ],
  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Build a filter — two facts, everything else derived.',
    },
    {
      kind: 'code',
      language: 'tsx',
      code: 'function ProjectFilter({ projects }: { projects: Project[] }) {\n  const [query, setQuery] = useState("");\n  const [status, setStatus] = useState<Status | "all">("all");\n\n  const visible = projects.filter((project) => {\n    const matchesQuery = project.name.toLowerCase().includes(query.toLowerCase());\n    const matchesStatus = status === "all" || project.status === status;\n    return matchesQuery && matchesStatus;\n  });\n\n  return (\n    <>\n      <input value={query} onChange={(e) => setQuery(e.target.value)} />\n\n      {visible.length === 0 ? (\n        <EmptyState title="No projects match these filters" action="Clear filters" />\n      ) : (\n        <ProjectList projects={visible} />\n      )}\n    </>\n  );\n}',
    },
    {
      kind: 'paragraph',
      text: 'Two pieces of state. `visible` is recalculated every render and therefore cannot be stale. The empty state is the filtered variety, correctly — because this branch only runs when a filter is active.',
    },
    {
      kind: 'paragraph',
      text: 'The input is **controlled**: its `value` comes from state and its `onChange` updates it. The state is the single source of truth and the field displays it, which is the Module 5 principle made visible.',
    },
  ],
  commonMistakes: [
    {
      id: 'mistake-07-04-mutating-state',
      mistake: 'Changing an array or object in place and passing it back.',
      why: 'React compares old and new; an in-place change leaves them identical, so nothing re-renders.',
      instead: 'Build a new value. Spread the old one and change what you need.',
    },
    {
      id: 'mistake-07-04-derived-in-state',
      mistake: 'Putting filtered results or counts into state.',
      why: 'They now need updating whenever their source changes, and the first missed update produces a stale screen.',
      instead: 'Calculate during render. It is cheap and it cannot go out of date.',
    },
  ],
  professionalConsideration: [
    {
      kind: 'paragraph',
      text: 'When several pieces of state always change together, they are probably one piece.',
    },
    {
      kind: 'paragraph',
      text: 'Three `useState` calls for `isLoading`, `data` and `error` can hold combinations that should be impossible — the Module 6 lesson 27 problem. One state holding a discriminated union cannot. If you find yourself updating three setters in the same handler every time, that is the signal.',
    },
  ],
  practicalExercise: {
    id: 'exercise-state-in-react',
    title: 'Build interactive filters or tabs',
    prompt:
      'Build a filterable list or a tabbed panel where every displayed value is either state or derived from it — with nothing duplicated.',
    steps: [
      'List the facts the interface needs. Keep it minimal.',
      'Create a `useState` for each fact and nothing else.',
      'Derive everything else during render.',
      'Make every input controlled.',
      'Add an empty state for when filters match nothing.',
      'Try moving one derived value into state, observe what breaks, then revert it.',
      'Check with React DevTools that your state is what you intended.',
    ],
    successCriteria: [
      'Only facts are in state; derivations are calculated during render.',
      'All inputs are controlled.',
      'State is updated by replacement, never in place.',
      'The filtered empty state is distinct from a genuinely empty list.',
      'The stale-state experiment is performed and described.',
    ],
    estimatedMinutes: 70,
    hint: 'For the experiment, store the filtered list in state and update it only in the input handler. Then change the filter by another route and watch it go stale.',
  },
  reflectionQuestion:
    'Why does React require you to replace state rather than modify it?',
  reflectionHint:
    'Think about how React could tell that something changed. What would it compare?',
  resources: [
    {
      id: 'resource-react-state',
      title: 'State: A Component’s Memory',
      url: 'https://react.dev/learn/state-a-components-memory',
      type: 'documentation',
      author: 'React',
      estimatedMinutes: 35,
      note: 'What state is and how `useState` works, with interactive examples.',
    },
    {
      id: 'resource-react-state-snapshot-docs',
      title: 'State as a Snapshot',
      url: 'https://react.dev/learn/state-as-a-snapshot',
      type: 'documentation',
      author: 'React',
      estimatedMinutes: 25,
      note: 'The snapshot behaviour explained properly. Read it when an update seems one step behind.',
    },
  ],
  competencyTags: ['react', 'state-modelling', 'interface-state-modelling', 'javascript'],
  completionCriteria: [
    'Can hold and update state in a component.',
    'Updates by replacement rather than in place.',
    'Keeps derived values out of state.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Lesson 35                                                                   */
/* -------------------------------------------------------------------------- */

const LESSON_5: Lesson = {
  id: 'lesson-events-effects-and-synchronisation',
  slug: 'events-effects-and-synchronisation',
  moduleId: MODULE_ID,
  lessonNumber: 5,
  title: 'Events, Effects and Synchronisation',
  summary:
    'Most things belong in an event handler. Effects are for keeping React in step with something outside it — and knowing when not to reach for one is the whole lesson.',
  estimatedMinutes: 10,
  objectives: [
    'Handle events in React.',
    'Explain what an effect is for.',
    'Recognise the cases where an effect is the wrong tool.',
    'Synchronise state with something outside React, and clean up afterwards.',
  ],
  prerequisiteConcepts: [
    'Events from Module 4',
    'State in React',
    'Async handling from Module 4 lesson 20',
  ],
  prerequisiteLessonIds: ['lesson-state-in-react'],
  recap: [
    {
      kind: 'paragraph',
      text: 'You can hold state and redraw from it. This lesson covers what happens at the edges — user actions coming in, and the world outside React that has to be kept in step.',
    },
  ],
  priorKnowledge: [
    {
      kind: 'paragraph',
      text: 'You know events from Module 4: the browser announces, your code responds. React keeps that model and changes only the attachment.',
    },
  ],
  coreConcept: [
    {
      kind: 'paragraph',
      text: 'Events are attached as props and named in camel case.',
    },
    {
      kind: 'code',
      language: 'tsx',
      code: '<button onClick={handleSave}>Save</button>\n<input onChange={handleChange} />\n<form onSubmit={handleSubmit}>',
    },
    {
      kind: 'paragraph',
      text: 'Same events as Module 4 — click, change, submit — attached declaratively rather than with `addEventListener`. React also calls `preventDefault` conventions the same way, so form submission still needs it.',
    },
    {
      kind: 'paragraph',
      text: 'The overwhelming majority of what an interface does belongs in a handler like these: something happened, so change some state.',
    },
  ],
  whyDesignersCare: [
    {
      kind: 'paragraph',
      text: 'Because the misuse of effects is responsible for a recognisable family of interface defects.',
    },
    {
      kind: 'paragraph',
      text: 'The screen that flickers because it renders once and then corrects itself. The request that fires twice. The filter that resets when it should not. Each is usually an effect doing something that belonged in a handler.',
    },
  ],
  howItWorks: [
    {
      kind: 'paragraph',
      text: 'An **effect** runs after render, and exists to synchronise React with something outside it.',
    },
    {
      kind: 'code',
      language: 'tsx',
      code: 'useEffect(() => {\n  document.title = `${count} unread`;\n}, [count]);',
    },
    {
      kind: 'paragraph',
      text: 'Line by line. The function is what to do. The array at the end lists what it depends on — this runs after the first render and again whenever `count` changes.',
    },
    {
      kind: 'paragraph',
      text: 'The document title is outside React. React does not manage it, so keeping it in step is exactly what an effect is for.',
    },
    {
      kind: 'paragraph',
      text: 'When an effect sets something up that must be taken down, it returns a cleanup function — which you have already written, in the autosave work of Module 4:',
    },
    {
      kind: 'code',
      language: 'tsx',
      code: 'useEffect(() => {\n  const timer = setTimeout(save, 600);\n  return () => clearTimeout(timer);\n}, [draft]);',
    },
    {
      kind: 'paragraph',
      text: 'The returned function runs before the next effect and when the component is removed. Without it, every keystroke would leave a timer running.',
    },
  ],
  firstPrinciples: [
    {
      kind: 'paragraph',
      text: 'The important half of this lesson is when **not** to use an effect.',
    },
    {
      kind: 'list',
      items: [
        'To calculate something from state — derive it during render instead. This is Module 5 lesson 23 again.',
        'To respond to a user action — put it in the handler, where the cause is obvious.',
        'To reset state when a prop changes — give the component a `key` instead, so React replaces it.',
      ],
    },
    {
      kind: 'code',
      language: 'tsx',
      code: '// Wrong: renders once with the old value, then corrects itself.\nuseEffect(() => {\n  setFullName(firstName + " " + lastName);\n}, [firstName, lastName]);\n\n// Right: no extra state, no extra render.\nconst fullName = firstName + " " + lastName;',
    },
    {
      kind: 'callout',
      tone: 'insight',
      body: 'An effect is for reaching outside React. If both the cause and the result are inside React, there is almost always a better tool.',
    },
  ],
  designPerspective: [
    {
      kind: 'paragraph',
      text: 'The design question is whether the user should ever see an intermediate state.',
    },
    {
      kind: 'paragraph',
      text: 'An effect that corrects the screen after rendering produces a visible flicker — briefly showing something wrong. That is a defect a designer will notice long before an engineer does, and the cause is architectural rather than visual.',
    },
  ],
  engineeringPerspective: [
    {
      kind: 'paragraph',
      text: 'The engineering question is what the effect depends on and what it leaves behind.',
    },
    {
      kind: 'paragraph',
      text: 'A missing dependency means the effect uses stale values. An unnecessary one means it runs too often. A missing cleanup means timers, listeners and requests accumulate. These three account for most effect bugs, and all three are visible in the few lines around the dependency array.',
    },
  ],
  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'The rule — handlers for actions, effects for the outside world — maps onto Module 5’s trigger categories.',
    },
    {
      kind: 'paragraph',
      text: 'User triggers become handlers. System and outside-world triggers become effects. The transition map you learned to write is, in React terms, a plan for which mechanism each arrow uses.',
    },
  ],
  industryExamples: [
    {
      id: 'example-react-you-might-not-need-effect',
      source: 'React',
      title: 'An entire page on not using them',
      observation:
        'The React documentation has a page called "You Might Not Need an Effect", listing common misuses and their replacements.',
      takeaway:
        'The team wrote a page about avoiding their own API because overuse is the dominant failure mode.',
    },
    {
      id: 'example-persisted-preferences',
      source: 'Common practice',
      title: 'Preferences that survive a reload',
      observation:
        'Products commonly remember a chosen view or theme between sessions by writing it to browser storage.',
      takeaway:
        'Storage is outside React, so keeping it in step is a legitimate effect — one of the clearest valid uses.',
    },
  ],
  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Persist a preference — a proper use of an effect.',
    },
    {
      kind: 'code',
      language: 'tsx',
      code: 'function useStoredTheme() {\n  const [theme, setTheme] = useState<"light" | "dark">(() => {\n    try {\n      const stored = localStorage.getItem("theme");\n      return stored === "dark" ? "dark" : "light";\n    } catch {\n      return "light";\n    }\n  });\n\n  useEffect(() => {\n    try {\n      localStorage.setItem("theme", theme);\n    } catch {\n      /* Storage blocked; the theme still applies for this session. */\n    }\n  }, [theme]);\n\n  return [theme, setTheme] as const;\n}',
    },
    {
      kind: 'paragraph',
      text: 'Three things worth noticing. `useState` is given a function rather than a value, so the stored value is read once on first render rather than on every render.',
    },
    {
      kind: 'paragraph',
      text: 'The effect writes to storage whenever the theme changes — React to outside world, which is the legitimate case. And both storage calls are wrapped, because storage can be unavailable in a private window.',
    },
    {
      kind: 'paragraph',
      text: 'What is *not* here: an effect that reads storage into state after render. That would render once with the wrong theme and then correct itself, which is the flicker.',
    },
  ],
  commonMistakes: [
    {
      id: 'mistake-07-05-effect-for-derived',
      mistake: 'Using an effect to calculate state from other state.',
      why: 'It renders with the old value, then re-renders with the new one — a visible flicker and a wasted pass.',
      instead: 'Calculate during render. No effect, no extra state, no flicker.',
    },
    {
      id: 'mistake-07-05-missing-cleanup',
      mistake: 'Setting up a timer, listener or request without a cleanup.',
      why: 'They accumulate as the component re-renders or is removed, and a response can arrive for something no longer on screen.',
      instead: 'If an effect sets something up, it returns the function that tears it down.',
    },
  ],
  professionalConsideration: [
    {
      kind: 'paragraph',
      text: 'Fetching data in an effect is the common case and the one with the most traps.',
    },
    {
      kind: 'paragraph',
      text: 'Responses can arrive out of order, the component may be gone by the time one lands, and the request may need cancelling — the problems Module 4 lesson 20 flagged. Real applications usually reach for a data library that handles these rather than writing them each time. Module 11 covers that properly; for now, knowing the traps exist is what matters.',
    },
  ],
  practicalExercise: {
    id: 'exercise-events-effects-and-synchronisation',
    title: 'Persist one simple preference',
    prompt:
      'Build a preference — theme, a chosen view, a collapsed sidebar — that survives a reload, using exactly one effect.',
    steps: [
      'Hold the preference in state, reading the stored value as the initial value.',
      'Write one effect that saves it when it changes.',
      'Wrap every storage call so a private window cannot break the page.',
      'Confirm the preference survives a reload.',
      'Confirm there is no flicker of the wrong value on load.',
      'Find one place in your component where you were tempted to add a second effect, and solve it another way.',
      'Write down what that alternative was.',
    ],
    successCriteria: [
      'Exactly one effect, and it synchronises with something outside React.',
      'The initial value is read during initialisation, not in an effect.',
      'No flicker of the wrong value on load.',
      'Storage access cannot break the page.',
      'One avoided effect is documented with its replacement.',
    ],
    estimatedMinutes: 60,
    hint: 'If your effect calls a state setter, stop and look again. That is the signature of an effect doing a handler’s job or a derivation’s job.',
  },
  reflectionQuestion:
    'Why does calculating a value in an effect produce a visible flicker, when calculating it during render does not?',
  reflectionHint:
    'Count the renders in each case, and ask what is on screen during the first one.',
  resources: [
    {
      id: 'resource-react-you-might-not-need-an-effect',
      title: 'You Might Not Need an Effect',
      url: 'https://react.dev/learn/you-might-not-need-an-effect',
      type: 'documentation',
      author: 'React',
      estimatedMinutes: 40,
      note: 'The most useful page in the React documentation. Read it twice.',
    },
    {
      id: 'resource-react-synchronizing-with-effects',
      title: 'Synchronizing with Effects',
      url: 'https://react.dev/learn/synchronizing-with-effects',
      type: 'documentation',
      author: 'React',
      estimatedMinutes: 35,
      note: 'What effects are for, dependencies, and cleanup.',
    },
  ],
  competencyTags: ['react', 'browser-apis', 'interaction-engineering', 'architecture'],
  completionCriteria: [
    'Can handle events in React.',
    'Can state what an effect is for and name three cases where it is wrong.',
    'Writes cleanup for anything an effect sets up.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Project                                                                     */
/* -------------------------------------------------------------------------- */

const PROJECT: ModuleProject = {
  id: 'project-project-management-interface',
  slug: 'project-management-interface',
  moduleId: MODULE_ID,
  title: 'Project Management Interface',
  brief:
    'Build a project management interface in React: a list of projects rendered from data, with filtering, inline editing, and every state from your earlier modules.',
  learnerGoal:
    'Build your first real React application, with a state model you can defend and no duplicated truth in it.',
  problem:
    'A project list is the archetypal product interface: many items, several filters, editing in place, and a full set of loading and empty states. It is small enough to finish and large enough that hand-wiring it would hurt.',
  prerequisiteLessonIds: [
    'lesson-why-react-exists',
    'lesson-components-and-props',
    'lesson-rendering-lists-and-conditional-ui',
    'lesson-state-in-react',
    'lesson-events-effects-and-synchronisation',
  ],
  objectives: [
    'Build an interface from composed components with typed props.',
    'Render lists with correct keys and handle every state.',
    'Hold a minimal state model with everything else derived.',
    'Use effects only where React must reach outside itself.',
  ],
  requirements: [
    'React with TypeScript.',
    'A list of projects rendered from typed data, with stable keys.',
    'Filtering by at least two criteria, with both derived rather than stored.',
    'Inline editing of at least one field.',
    'Loading, error, empty-because-nothing and empty-because-filtered states.',
    'Responsive layout, using the Module 2 and 3 skills.',
    'At most one effect, and it must synchronise with something outside React.',
  ],
  constraints: [
    'No component library. Build the components yourself.',
    'No state that could be derived from other state.',
    'No `any`, and no index keys.',
    'No direct DOM manipulation — if you are reaching for `querySelector`, reconsider.',
  ],
  suggestedScope:
    'One screen, done properly. Roughly twenty to thirty hours. It is finished when every state can be demonstrated and the state model contains only facts.',
  deliverables: [
    'The working application.',
    'A written list of your state, with derivations noted separately.',
    'A note justifying each effect, or stating that there are none.',
    'A demonstration of all four list states.',
  ],
  completionCriteria: [
    'Every state in the model is a fact; nothing derivable is stored.',
    'Keys come from stable ids, demonstrated by deleting from the middle of the list.',
    'All four list states render correctly.',
    'Any effect present synchronises with something outside React and has cleanup.',
    'The layout works from 320px upwards.',
    'Everything is operable by keyboard.',
  ],
  portfolioEvidence: [
    'React fluency — composed components with typed interfaces.',
    'State discipline — a minimal model carried through from Module 5.',
    'State coverage — every designed state built.',
    'Judgement — effects used sparingly and justified.',
  ],
  reflectionQuestion:
    'Which piece of state did you most want to add that turned out to be derivable?',
  estimatedHours: 25,
  competencies: [
    'react',
    'typescript',
    'component-architecture',
    'state-modelling',
    'interface-state-modelling',
    'responsive-design',
    'accessibility',
  ],
  stretchGoals: [
    'Persist the active filter in the URL so a filtered view can be shared.',
    'Add optimistic editing with the correction designed, per Module 5 lesson 24.',
    'Make the empty state offer to clear exactly the filter that excluded everything.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Module                                                                      */
/* -------------------------------------------------------------------------- */

export const MODULE_07: CurriculumModule = {
  id: MODULE_ID,
  slug: 'react-foundations',
  moduleNumber: 7,
  phase: 'systems',
  title: 'React Foundations',
  description:
    'Describing an interface instead of updating it. Every idea here continues something you did by hand in Module 4 or modelled in Module 5 — components, props, lists, state and the small number of cases that need an effect.',
  outcome:
    'Can build a real React interface whose state model holds only facts and whose every designed state exists in code.',
  prerequisites: [
    'Module 4 — JavaScript, events, conditions, async',
    'Module 5 — state models and behaviour specifications',
    'Module 6 — TypeScript, especially discriminated unions',
  ],
  lessons: [LESSON_1, LESSON_2, LESSON_3, LESSON_4, LESSON_5],
  resources: [
    {
      id: 'resource-module-07-react-learn',
      title: 'Learn React',
      url: 'https://react.dev/learn',
      type: 'documentation',
      author: 'React',
      estimatedMinutes: 300,
      note: 'The official course. Unusually good, and the primary reference for this module.',
    },
    {
      id: 'resource-module-07-thinking-in-react',
      title: 'Thinking in React',
      url: 'https://react.dev/learn/thinking-in-react',
      type: 'documentation',
      author: 'React',
      estimatedMinutes: 30,
      note: 'Going from a design to a component tree, which is the designer’s entry point.',
    },
    {
      id: 'resource-module-07-react-conf',
      title: 'React on YouTube',
      url: 'https://www.youtube.com/@reactjs',
      type: 'video',
      author: 'React',
      estimatedMinutes: 60,
      note: 'Talks from the team. Search for sessions on state and on effects.',
    },
    {
      id: 'resource-module-07-devtools',
      title: 'React Developer Tools',
      url: 'https://react.dev/learn/react-developer-tools',
      type: 'tool',
      author: 'React',
      estimatedMinutes: 20,
      note: 'Install it before starting the project. Reading real state is how you debug a wrong screen.',
    },
  ],
  project: PROJECT,
  competencies: [
    'react',
    'javascript',
    'typescript',
    'component-architecture',
    'component-api-design',
    'state-modelling',
    'interface-state-modelling',
    'browser-apis',
    'interaction-engineering',
    'architecture',
    'design-systems',
    'responsive-design',
    'accessibility',
    'ux-reasoning',
  ],
  completionCriteria: [
    'All five lessons completed.',
    'Module project marked completed.',
    'Can build a React interface with a minimal, defensible state model.',
  ],
};
