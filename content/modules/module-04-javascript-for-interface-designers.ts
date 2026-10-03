/**
 * Module 04 — JavaScript for Interface Designers.
 *
 * The learner's first programming language, taught entirely through interface
 * problems. Every example is a product thing — a name, a saved flag, a list of
 * menu items — rather than an abstract exercise.
 *
 * Code appears in small pieces and is explained line by line on first use.
 * Nothing here requires a framework or a build step.
 */

import type { CurriculumModule, Lesson, ModuleProject } from '@/types/curriculum';

const MODULE_ID = 'module-04';

/* -------------------------------------------------------------------------- */
/* Lesson 16                                                                   */
/* -------------------------------------------------------------------------- */

const LESSON_1: Lesson = {
  id: 'lesson-javascript-without-the-intimidation',
  slug: 'javascript-without-the-intimidation',
  moduleId: MODULE_ID,
  lessonNumber: 1,
  title: 'JavaScript Without the Intimidation',
  summary:
    'Programming starts with describing things. This lesson covers the handful of shapes you need to describe anything on a screen.',
  estimatedMinutes: 9,
  objectives: [
    'Store a value and give it a name.',
    'Choose the right shape for a piece of interface data.',
    'Represent a realistic product object in JavaScript.',
    'Read a short piece of code and say what it describes.',
  ],
  prerequisiteConcepts: [
    'HTML and CSS from Module 3',
    'Interface states from Module 1',
  ],
  prerequisiteLessonIds: ['lesson-turning-a-figma-design-into-a-browser-interface'],
  recap: [
    {
      kind: 'paragraph',
      text: 'Module 3 ended with you building one of your own designs: semantic structure, layout, styling, tested across widths. The page works and does nothing.',
    },
  ],
  priorKnowledge: [
    {
      kind: 'paragraph',
      text: 'You have written code already — HTML and CSS are both code, and you have used classes, properties and values. What you have not done is store information or make decisions.',
    },
    {
      kind: 'paragraph',
      text: 'You also already think in structured data. A Figma component with properties — size, variant, state — is an object with named fields. The idea transfers directly.',
    },
  ],
  coreConcept: [
    {
      kind: 'paragraph',
      text: 'JavaScript stores values and gives them names. That is the starting point, and most of what follows is combinations of it.',
    },
    {
      kind: 'code',
      language: 'javascript',
      code: 'const productName = "Wireless Keyboard";',
    },
    {
      kind: 'paragraph',
      text: 'Line by line. `const` means "create a name that will not be reassigned". `productName` is the name. `=` assigns. `"Wireless Keyboard"` is the value — a piece of text, which in programming is called a **string**, and strings go in quotes. The semicolon ends the statement.',
    },
    {
      kind: 'paragraph',
      text: 'That is a complete, working line of JavaScript. Everything else in this module is more of the same.',
    },
  ],
  whyDesignersCare: [
    {
      kind: 'paragraph',
      text: 'Because the shape you choose for data decides what the interface can do.',
    },
    {
      kind: 'paragraph',
      text: 'If a product’s tags are stored as one string, "wireless, compact, black", the interface cannot filter by tag without picking that string apart. Stored as a list of three separate values, filtering is trivial.',
    },
    {
      kind: 'paragraph',
      text: 'That decision is usually made early, often without discussion, and quietly determines which features are easy for the next two years. Being able to see it is worth a lot.',
    },
  ],
  howItWorks: [
    {
      kind: 'paragraph',
      text: 'There are a small number of shapes. These five cover almost everything in an interface.',
    },
    {
      kind: 'code',
      language: 'javascript',
      code: 'const productName = "Wireless Keyboard";   // string: text\nconst price = 79;                          // number\nconst isSaved = true;                      // boolean: true or false\nconst tags = ["wireless", "compact"];      // array: an ordered list\nconst user = { name: "Ada", plan: "pro" }; // object: named fields',
    },
    {
      kind: 'paragraph',
      text: 'The `//` marks a comment — a note for humans that the computer ignores.',
    },
    {
      kind: 'paragraph',
      text: 'A **boolean** is a yes-or-no fact, and the name usually says so: `isSaved`, `hasError`, `canEdit`. These are exactly the facts you were drawing as component variants in Figma.',
    },
    {
      kind: 'paragraph',
      text: 'An **array** is an ordered list, written in square brackets. Menu items, search results, selected filters — anything that is "several of the same kind of thing".',
    },
    {
      kind: 'paragraph',
      text: 'An **object** is a set of named fields, written in curly braces. It describes one thing with several properties, which is how you describe a user, a product, or a form.',
    },
  ],
  firstPrinciples: [
    {
      kind: 'paragraph',
      text: 'Objects and arrays combine, which is how real interface data is shaped.',
    },
    {
      kind: 'code',
      language: 'javascript',
      code: 'const product = {\n  name: "Wireless Keyboard",\n  price: 79,\n  isSaved: false,\n  tags: ["wireless", "compact"],\n};',
    },
    {
      kind: 'paragraph',
      text: 'One object with four fields, one of which is an array. You read a field with a dot: `product.name` gives `"Wireless Keyboard"`, and `product.tags` gives the list.',
    },
    {
      kind: 'paragraph',
      text: 'A list of products is then an array of objects — which is precisely what sits behind every card grid you have ever designed.',
    },
    {
      kind: 'callout',
      tone: 'insight',
      body: 'Designing a card is deciding which fields the object needs. The two activities are the same activity.',
    },
  ],
  designPerspective: [
    {
      kind: 'paragraph',
      text: 'The design question is what each item genuinely has, as opposed to what this particular design happens to show.',
    },
    {
      kind: 'paragraph',
      text: 'A card showing a name and a price does not mean the product only has a name and a price. Getting the full shape right matters because the next screen will want a field this one did not display — and if the shape is wrong, that becomes a backend change rather than a design change.',
    },
  ],
  engineeringPerspective: [
    {
      kind: 'paragraph',
      text: 'The engineering question is what happens when a field is missing.',
    },
    {
      kind: 'paragraph',
      text: 'A product with no image, a user with no display name, a list with no items. Real data has gaps, and an interface that assumes every field is present breaks on the first one that is not. You met the designed version of this in Module 1 as the empty state; this is where it becomes a data question.',
    },
  ],
  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'The object is the handover point between a design and a build.',
    },
    {
      kind: 'paragraph',
      text: 'When a designer can say "a product has a name, a price, an optional image, and zero or more tags", they have specified the component and the data in one sentence. That sentence is more useful than a mockup, because it covers the cases the mockup did not draw.',
    },
  ],
  industryExamples: [
    {
      id: 'example-figma-component-properties',
      source: 'Figma',
      title: 'Component properties as an object',
      observation:
        'A Figma component with text, boolean and variant properties is describing a set of named fields with types.',
      takeaway:
        'If you can define component properties, you can define an object. The notation differs; the thinking does not.',
    },
    {
      id: 'example-stripe-api-objects',
      source: 'Stripe',
      title: 'Objects as the public shape of a product',
      observation:
        'Stripe’s documentation describes its core concepts — customer, charge, subscription — as objects with named, typed fields.',
      takeaway:
        'The data shape is the product model. Reading an API reference is a fast way to understand how a company thinks about its own domain.',
    },
  ],
  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Represent a product card as data. Start with what the card shows.',
    },
    {
      kind: 'code',
      language: 'javascript',
      code: 'const product = {\n  id: "kb-001",\n  name: "Wireless Keyboard",\n  price: 79,\n  currency: "GBP",\n  imageUrl: "/images/keyboard.jpg",\n  tags: ["wireless", "compact"],\n  inStock: true,\n};',
    },
    {
      kind: 'paragraph',
      text: 'Two fields are there for reasons the design does not show. `id` uniquely identifies this product — needed the moment anything is clicked, saved or added to a basket. `currency` is separate from `price` because 79 is meaningless without it, and because the same number displays differently in different places.',
    },
    {
      kind: 'paragraph',
      text: 'Now the harder question: what if there is no image? Two options. `imageUrl` could be absent, and the interface shows a placeholder; or it could always be present and the backend supplies the placeholder. Both are defensible. What is not defensible is failing to decide — that produces a card that renders a broken image icon.',
    },
  ],
  commonMistakes: [
    {
      id: 'mistake-04-01-strings-for-everything',
      mistake: 'Storing structured information as one piece of text.',
      why: '"wireless, compact" has to be taken apart before it can be filtered or counted, and the splitting logic ends up copied everywhere.',
      instead: 'If it is several things, use an array. If it is a yes-or-no, use a boolean.',
    },
    {
      id: 'mistake-04-01-display-shaped-data',
      mistake: 'Shaping data around how one screen displays it.',
      why: '`priceLabel: "£79.00"` cannot be compared, sorted, converted or recalculated. The formatting has been baked into the fact.',
      instead:
        'Store the fact — a number and a currency — and format it where it is displayed.',
    },
  ],
  professionalConsideration: [
    {
      kind: 'paragraph',
      text: 'Names are worth caring about, because they are the documentation most likely to be read.',
    },
    {
      kind: 'paragraph',
      text: '`isSaved` is clearly a yes-or-no. `saved` might be a boolean, a date, or the person who saved it. `items` could be anything; `menuItems` could not. Naming conventions — `is`/`has` for booleans, plurals for arrays — let a reader know the shape without looking it up, and they cost nothing.',
    },
  ],
  practicalExercise: {
    id: 'exercise-javascript-without-the-intimidation',
    title: 'Represent a product card as data',
    prompt:
      'Take a card component you have designed and write the JavaScript object that describes one instance of it.',
    steps: [
      'List every piece of information the card shows.',
      'List everything the card needs but does not show — identifiers, raw values behind formatted ones.',
      'Choose a shape for each: string, number, boolean, array or object.',
      'Write the object with realistic values.',
      'Write a second object for an awkward case: a missing image, no tags, an unusually long name.',
      'Write an array containing both.',
      'For each field, note what the interface should do if it is missing.',
    ],
    successCriteria: [
      'Every displayed field is represented.',
      'At least two fields exist that the design does not show, each justified.',
      'Booleans are named with `is` or `has`.',
      'Arrays are used for anything that is several of one kind.',
      'No field stores a pre-formatted display string in place of the underlying value.',
      'A missing-field behaviour is stated for every optional field.',
    ],
    estimatedMinutes: 35,
    hint: 'If a field value contains a currency symbol, a date format or the word "and", you have probably stored a display string rather than a fact.',
  },
  reflectionQuestion:
    'Why is it a problem to store a price as the text "£79.00" rather than as a number?',
  reflectionHint:
    'Think of three things a product might need to do with a price other than print it on this one card.',
  resources: [
    {
      id: 'resource-javascript-info-basics',
      title: 'JavaScript Fundamentals',
      url: 'https://javascript.info/first-steps',
      type: 'documentation',
      author: 'javascript.info',
      estimatedMinutes: 90,
      note: 'The clearest beginner material available, with exercises. Read the first chapter; skip the rest for now.',
    },
    {
      id: 'resource-mdn-js-first-steps',
      title: 'What is JavaScript? — MDN Learn',
      url: 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/What_is_JavaScript',
      type: 'documentation',
      author: 'MDN',
      estimatedMinutes: 60,
      note: 'Variables and data types explained for people who have never programmed.',
    },
  ],
  competencyTags: ['javascript', 'product-thinking', 'state-modelling'],
  completionCriteria: [
    'Can store values with appropriate shapes.',
    'Can represent a realistic interface item as an object.',
    'Can explain why formatting should not be stored with the value.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Lesson 17                                                                   */
/* -------------------------------------------------------------------------- */

const LESSON_2: Lesson = {
  id: 'lesson-events-clicks-and-user-input',
  slug: 'events-clicks-and-user-input',
  moduleId: MODULE_ID,
  lessonNumber: 2,
  title: 'Events, Clicks and User Input',
  summary:
    'Module 1 described events in words. This lesson writes them — the point at which a page you built starts responding to the person using it.',
  estimatedMinutes: 9,
  objectives: [
    'Find an element on the page from JavaScript.',
    'Run code in response to a click or a keystroke.',
    'Change what is on screen as a result.',
    'Name the common events and when each fires.',
  ],
  prerequisiteConcepts: [
    'The event chain from Module 1 lesson 3',
    'Values and functions from the previous lesson',
    'HTML structure from Module 3',
  ],
  prerequisiteLessonIds: [
    'lesson-javascript-without-the-intimidation',
    'lesson-what-happens-when-a-user-takes-an-action',
  ],
  recap: [
    {
      kind: 'paragraph',
      text: 'Last lesson you described things as data. In Module 1 you learned that a user action makes the browser raise an event, which application code can listen for. This lesson joins those two.',
    },
  ],
  priorKnowledge: [
    {
      kind: 'paragraph',
      text: 'You already know what an event is conceptually, and you know that choosing a real `<button>` means Enter and Space work without extra effort. Now you write the listening part.',
    },
  ],
  coreConcept: [
    {
      kind: 'paragraph',
      text: 'Two steps: find the element, then say what should happen when something occurs to it.',
    },
    {
      kind: 'code',
      language: 'javascript',
      code: 'const saveButton = document.querySelector("#save");\n\nsaveButton.addEventListener("click", function () {\n  console.log("Save was pressed");\n});',
    },
    {
      kind: 'paragraph',
      text: 'Line by line. `document` is the page. `querySelector` finds the first element matching a CSS selector — `"#save"` means the element whose id is `save`, exactly like a CSS selector.',
    },
    {
      kind: 'paragraph',
      text: '`addEventListener` attaches a listener. Its first argument is which event to listen for; its second is the code to run.',
    },
    {
      kind: 'paragraph',
      text: '`function () { ... }` is a **function** — a block of code with a name or, as here, without one, saved to be run later rather than immediately. `console.log` writes a message to the browser’s console, which is the simplest way to check that something ran.',
    },
  ],
  whyDesignersCare: [
    {
      kind: 'paragraph',
      text: 'Because this is the first point where a static page you built becomes a product.',
    },
    {
      kind: 'paragraph',
      text: 'It is also where the interaction decisions from Module 1 become real: which event to listen for is the difference between an interface that works for everyone and one that works for mouse users.',
    },
  ],
  howItWorks: [
    {
      kind: 'paragraph',
      text: 'The events you will use most:',
    },
    {
      kind: 'list',
      items: [
        '`click` — a button or link was activated. Fires for Enter and Space on real buttons too.',
        '`input` — the value of a field changed. Fires on every keystroke.',
        '`change` — the value changed and the user finished. Fires on blur for text, immediately for checkboxes and selects.',
        '`submit` — a form was submitted. Fires on the form, not on the button.',
        '`keydown` — a key was pressed. Needed for shortcuts and for Escape.',
      ],
    },
    {
      kind: 'paragraph',
      text: 'The distinction between `input` and `change` matters more than it looks. Validating on `input` tells someone their email is invalid while they are still typing the first character. Validating on `change` waits until they have finished. The second is almost always kinder.',
    },
  ],
  firstPrinciples: [
    {
      kind: 'paragraph',
      text: 'The listener receives an **event object** describing what happened.',
    },
    {
      kind: 'code',
      language: 'javascript',
      code: 'const field = document.querySelector("#email");\n\nfield.addEventListener("input", function (event) {\n  console.log(event.target.value);\n});',
    },
    {
      kind: 'paragraph',
      text: '`event` is that object. `event.target` is the element the event happened to, and `.value` is what is currently typed in it. So this logs the field contents on every keystroke.',
    },
    {
      kind: 'paragraph',
      text: 'The event object also carries which key was pressed, whether Shift was held, and the method used to prevent the browser’s default behaviour — which is how you stop a form reloading the page when it submits.',
    },
  ],
  designPerspective: [
    {
      kind: 'paragraph',
      text: 'The design question is which moment the response belongs to.',
    },
    {
      kind: 'paragraph',
      text: 'Showing a search result on every keystroke feels immediate and can be overwhelming; waiting for Enter feels deliberate and can feel slow. Showing a validation error as someone types feels aggressive; showing it when they leave the field feels like help. These are design decisions expressed as a choice of event name.',
    },
  ],
  engineeringPerspective: [
    {
      kind: 'paragraph',
      text: 'The engineering question is where to attach the listener.',
    },
    {
      kind: 'paragraph',
      text: 'For a form, listen for `submit` on the form rather than `click` on the button. The form’s submit event fires however the submission happened — the button, Enter in a text field, or assistive technology — so one listener covers every route. Listening on the button covers one.',
    },
  ],
  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'The three-beat loop from Module 1 is now three pieces of code: the event is beat one, the listener body is beat two, and whatever it changes on screen is beat three.',
    },
    {
      kind: 'paragraph',
      text: 'If you write a listener that does something without changing anything visible, you have written an interaction with no acknowledgement — which Module 1 established is an unfinished interaction.',
    },
  ],
  industryExamples: [
    {
      id: 'example-github-search-input',
      source: 'GitHub',
      title: 'Two events, two behaviours',
      observation:
        'GitHub’s search suggests as you type and performs a full search on Enter.',
      takeaway:
        'The same field serves two interactions by listening for two events, each with a different cost and a different response.',
    },
    {
      id: 'example-linear-escape',
      source: 'Linear',
      title: 'Escape as a consistent exit',
      observation:
        'Escape closes the current dialog or menu throughout Linear, not only in some places.',
      takeaway:
        'Keyboard conventions are only useful when applied everywhere. A shortcut that works in four of five dialogs is worse than none.',
    },
  ],
  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Make a button reveal and hide a panel.',
    },
    {
      kind: 'code',
      language: 'html',
      code: '<button id="toggle" aria-expanded="false" aria-controls="details">\n  Show details\n</button>\n\n<div id="details" hidden>\n  <p>Here are the details.</p>\n</div>',
    },
    {
      kind: 'code',
      language: 'javascript',
      code: 'const toggle = document.querySelector("#toggle");\nconst details = document.querySelector("#details");\n\ntoggle.addEventListener("click", function () {\n  const isOpen = details.hidden === false;\n\n  details.hidden = isOpen;\n  toggle.textContent = isOpen ? "Show details" : "Hide details";\n  toggle.setAttribute("aria-expanded", String(!isOpen));\n});',
    },
    {
      kind: 'paragraph',
      text: 'Line by line through the listener. `isOpen` works out the current situation: the panel is open when `hidden` is false.',
    },
    {
      kind: 'paragraph',
      text: '`details.hidden = isOpen` flips it — if it was open, hide it. `textContent` replaces the button’s label. The `? :` is a shorthand for if/else, which the next lesson covers properly; read it as "if open, use the first, otherwise the second".',
    },
    {
      kind: 'paragraph',
      text: '`aria-expanded` is the part most tutorials omit. It tells assistive technology whether the thing this button controls is currently open. Without it the button announces as "Show details" forever, even after the panel opens.',
    },
  ],
  commonMistakes: [
    {
      id: 'mistake-04-02-click-on-non-button',
      mistake: 'Attaching a click listener to a `<div>`.',
      why: 'It cannot be focused or triggered by keyboard, so the interaction exists only for mouse users.',
      instead:
        'Attach listeners to real interactive elements. This is the Module 1 lesson, now with a concrete consequence.',
    },
    {
      id: 'mistake-04-02-forgetting-aria-state',
      mistake: 'Changing what is visible without updating the related attribute.',
      why: 'The visual state and the announced state diverge, so screen reader users are told the opposite of what is true.',
      instead:
        'When a listener changes something’s visibility, update `aria-expanded` or the equivalent in the same place.',
    },
  ],
  professionalConsideration: [
    {
      kind: 'paragraph',
      text: 'Events travel outward through ancestors — the behaviour mentioned at the end of Module 1 lesson 3.',
    },
    {
      kind: 'paragraph',
      text: 'A click on a delete icon inside a clickable row reaches both. `event.stopPropagation()` prevents the outward travel, and `event.preventDefault()` cancels the browser’s own response, such as a form reloading the page. They are different things and are often confused; the first concerns other listeners, the second concerns the browser.',
    },
  ],
  practicalExercise: {
    id: 'exercise-events-clicks-and-user-input',
    title: 'Make a button reveal and hide content',
    prompt:
      'Build a working disclosure: a button that shows and hides a panel, with correct labelling throughout.',
    steps: [
      'Write the HTML with a real button and a panel, using the `hidden` attribute.',
      'Attach a click listener and toggle the panel.',
      'Update the button label to describe what the next press will do.',
      'Keep `aria-expanded` in step with the visible state.',
      'Test with the mouse, then with Tab and Enter, then with Tab and Space.',
      'Add a second disclosure on the same page and make both work independently.',
      'Log the event object once and look at what it contains.',
    ],
    successCriteria: [
      'The disclosure works by mouse, Enter and Space.',
      'The button label changes to describe the next action.',
      '`aria-expanded` matches the visible state at all times.',
      'Two independent disclosures coexist without interfering.',
      'The listener is attached to a real button.',
    ],
    estimatedMinutes: 50,
    hint: 'Test with the keyboard before you consider it finished. If you used a real button it will already work, which is the point.',
  },
  reflectionQuestion:
    'Why is it usually better to listen for a form’s submit event than for a click on its button?',
  reflectionHint:
    'Count the ways a form can be submitted. How many does a click listener cover?',
  resources: [
    {
      id: 'resource-mdn-events-full',
      title: 'Introduction to events — MDN Learn',
      url: 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Events',
      type: 'documentation',
      author: 'MDN',
      estimatedMinutes: 40,
      note: 'Now read this properly — the code will make sense this time.',
    },
    {
      id: 'resource-javascript-info-events',
      title: 'Introduction to Browser Events',
      url: 'https://javascript.info/introduction-browser-events',
      type: 'documentation',
      author: 'javascript.info',
      estimatedMinutes: 30,
      note: 'Clear treatment of listeners, the event object, and how events travel.',
    },
  ],
  competencyTags: ['javascript', 'browser-apis', 'interaction-engineering', 'accessibility'],
  completionCriteria: [
    'Can attach a listener and change the page from it.',
    'Can choose the appropriate event for an interaction.',
    'Keeps accessible state attributes in step with visible state.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Lesson 18                                                                   */
/* -------------------------------------------------------------------------- */

const LESSON_3: Lesson = {
  id: 'lesson-conditions-and-interface-decisions',
  slug: 'conditions-and-interface-decisions',
  moduleId: MODULE_ID,
  lessonNumber: 3,
  title: 'Conditions and Interface Decisions',
  summary:
    'Every branch in an interface — signed in or out, valid or invalid, empty or full — is a condition. This is how you write one.',
  estimatedMinutes: 8,
  objectives: [
    'Write a decision with `if` and `else`.',
    'Combine conditions with and, or, and not.',
    'Map interface variations onto the conditions that produce them.',
    'Avoid the branches that produce an unhandled case.',
  ],
  prerequisiteConcepts: ['Values and booleans', 'Events and listeners'],
  prerequisiteLessonIds: ['lesson-events-clicks-and-user-input'],
  recap: [
    {
      kind: 'paragraph',
      text: 'Last lesson you made a page respond, and used `? :` without a full explanation. This lesson is that explanation, and considerably more.',
    },
  ],
  priorKnowledge: [
    {
      kind: 'paragraph',
      text: 'You met booleans in lesson 16 — `isSaved`, `inStock`. In Module 1 you designed interfaces that differ by state. Conditions are what connect the two: the boolean is the fact, the condition is what the interface does about it.',
    },
  ],
  coreConcept: [
    {
      kind: 'paragraph',
      text: 'An `if` runs code only when something is true.',
    },
    {
      kind: 'code',
      language: 'javascript',
      code: 'if (user.isSignedIn) {\n  showAccountMenu();\n} else {\n  showSignInButton();\n}',
    },
    {
      kind: 'paragraph',
      text: 'Line by line. `if` takes a condition in brackets. When it is true, the first block runs. `else` supplies what happens otherwise. Exactly one of the two blocks runs, always.',
    },
    {
      kind: 'paragraph',
      text: 'That last point is worth holding on to: an `if`/`else` is a complete decision. An `if` without an `else` leaves the other case doing nothing, which is sometimes right and often an oversight.',
    },
  ],
  whyDesignersCare: [
    {
      kind: 'paragraph',
      text: 'Because the set of conditions in the code is the set of variations the interface can have — and if you have not designed one of them, somebody has invented it.',
    },
    {
      kind: 'paragraph',
      text: 'A screen with "signed in or out" and "has items or empty" has four combinations. Most designs cover two. The remaining two will exist in production whether or not anyone drew them.',
    },
  ],
  howItWorks: [
    {
      kind: 'paragraph',
      text: 'Conditions compare things. The comparisons you need:',
    },
    {
      kind: 'code',
      language: 'javascript',
      code: 'items.length === 0        // exactly equal to\nitems.length > 0          // greater than\nname !== ""               // not equal to\nisSaved                   // a boolean on its own\n!isSaved                  // not — true when isSaved is false',
    },
    {
      kind: 'paragraph',
      text: 'Use `===` rather than `==`. The two-character version does surprising type conversions; the three-character version compares strictly, which is what you almost always want.',
    },
    {
      kind: 'paragraph',
      text: 'Conditions combine with `&&` meaning and, and `||` meaning or:',
    },
    {
      kind: 'code',
      language: 'javascript',
      code: 'if (user.isSignedIn && items.length > 0) {\n  showCheckoutButton();\n}',
    },
    {
      kind: 'paragraph',
      text: 'That reads as "signed in AND the basket has something in it". Both must be true.',
    },
  ],
  firstPrinciples: [
    {
      kind: 'paragraph',
      text: 'The useful discipline is enumerating the combinations rather than writing branches as you think of them.',
    },
    {
      kind: 'paragraph',
      text: 'Two booleans give four combinations. Three give eight. Writing them out as a short table is how you find the case nobody considered — usually something like "signed out with items in the basket", which is both common and awkward.',
    },
    {
      kind: 'callout',
      tone: 'pitfall',
      body: 'A branch you did not write is still a state the user can reach. The interface will do something; you just will not have chosen what.',
    },
  ],
  designPerspective: [
    {
      kind: 'paragraph',
      text: 'The design question is which combinations are real and which cannot happen.',
    },
    {
      kind: 'paragraph',
      text: 'Some are impossible by construction — you cannot have a validation error on a field that is not shown. Ruling those out deliberately is useful work, because it shortens the list of things that must be designed and tells the engineer which cases they can refuse outright.',
    },
  ],
  engineeringPerspective: [
    {
      kind: 'paragraph',
      text: 'The engineering question is whether every path produces a defined result.',
    },
    {
      kind: 'paragraph',
      text: 'An `if` chain with no final `else` silently does nothing for anything it did not anticipate — which is how a page ends up blank for a user in an unusual situation. Writing the final `else` even when you believe it unreachable is cheap and catches the belief being wrong.',
    },
  ],
  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'The combination table is a shared document: it is a list of frames to design and a list of branches to write.',
    },
    {
      kind: 'paragraph',
      text: 'Produced jointly, it ends the "what should happen if…" conversation before implementation rather than during code review.',
    },
  ],
  industryExamples: [
    {
      id: 'example-github-empty-repo',
      source: 'GitHub',
      title: 'A designed empty case',
      observation:
        'A new, empty repository shows setup instructions rather than an empty file list.',
      takeaway:
        'The empty branch was treated as a real screen with its own job, not as the normal screen with nothing in it.',
    },
    {
      id: 'example-notion-permission-states',
      source: 'Notion',
      title: 'Branching on permission as well as content',
      observation:
        'Notion shows different controls depending on whether you can edit, comment or only view a page.',
      takeaway:
        'Permission multiplies the combinations. Each one needs an interface, and omitting them produces controls that fail on use.',
    },
  ],
  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Show the right message for a list, covering every case.',
    },
    {
      kind: 'code',
      language: 'javascript',
      code: 'function describeList(items, hasFilter) {\n  if (items.length > 0) {\n    return `${items.length} results`;\n  }\n\n  if (hasFilter) {\n    return "No results match your filters.";\n  }\n\n  return "Nothing here yet.";\n}',
    },
    {
      kind: 'paragraph',
      text: '`function describeList(items, hasFilter)` defines a reusable piece of code taking two inputs. `return` sends a value back and stops the function there.',
    },
    {
      kind: 'paragraph',
      text: 'The backticks are a **template string**: `${items.length}` inserts a value into text. Useful whenever a message contains a number.',
    },
    {
      kind: 'paragraph',
      text: 'Three outcomes, and the distinction that matters is between the last two. "No results match your filters" invites clearing the filter; "Nothing here yet" invites creating something. Same emptiness, different advice — exactly the distinction Module 1 raised about failure states.',
    },
  ],
  commonMistakes: [
    {
      id: 'mistake-04-03-conflating-empty-states',
      mistake: 'Treating "no data yet" and "no results for this filter" as one case.',
      why: 'The two need opposite advice, and a combined message is wrong for both.',
      instead: 'Branch on whether a filter is active. It is one extra condition and a much better interface.',
    },
    {
      id: 'mistake-04-03-missing-final-else',
      mistake: 'Writing an `if` chain with no final fallback.',
      why: 'Anything unanticipated produces nothing at all, which looks like a broken page rather than an unusual case.',
      instead: 'Always provide a final branch, even if it only states that something unexpected happened.',
    },
  ],
  professionalConsideration: [
    {
      kind: 'paragraph',
      text: 'Deeply nested conditions are usually a sign that the data shape is wrong.',
    },
    {
      kind: 'paragraph',
      text: 'Three or four levels of nesting to decide what to show often means several booleans are tracking one underlying fact. Replacing them with a single value that names the situation — "loading", "empty", "ready", "error" — collapses the nesting entirely. Module 5 formalises this.',
    },
  ],
  practicalExercise: {
    id: 'exercise-conditions-and-interface-decisions',
    title: 'Show different messages under different conditions',
    prompt:
      'Write the branching for a list view that must handle every combination of empty, filtered, loading and signed-out.',
    steps: [
      'List the conditions involved and write out every combination.',
      'Mark which combinations are impossible, with a reason.',
      'For each possible combination, write what the user should see.',
      'Implement it as a function returning the right message.',
      'Make sure there is a final fallback.',
      'Test every branch by calling the function with values.',
      'Note any combination you had not designed before doing this.',
    ],
    successCriteria: [
      'Every combination enumerated, not only the ones that came to mind.',
      'Impossible combinations marked with reasons.',
      'Empty-because-nothing and empty-because-filtered are distinguished.',
      'A final fallback exists.',
      'Every branch verified by calling the function.',
    ],
    estimatedMinutes: 45,
    hint: 'Write the combinations as a table before writing any code. The table almost always contains a row you had not thought about.',
  },
  reflectionQuestion:
    'Why do "no items yet" and "no items match your search" need different messages?',
  reflectionHint:
    'Ask what you want the user to do next in each case. The two answers are not the same.',
  resources: [
    {
      id: 'resource-javascript-info-conditionals',
      title: 'Conditional branching',
      url: 'https://javascript.info/ifelse',
      type: 'documentation',
      author: 'javascript.info',
      estimatedMinutes: 20,
      note: '`if`, `else` and the conditional operator, with exercises.',
    },
    {
      id: 'resource-nng-empty-states',
      title: 'Empty States in Application Design',
      url: 'https://www.nngroup.com/articles/empty-state-interface-design/',
      type: 'article',
      author: 'Nielsen Norman Group',
      estimatedMinutes: 10,
      note: 'Why the empty branch deserves as much design attention as the full one.',
    },
  ],
  competencyTags: ['javascript', 'interface-state-modelling', 'ux-reasoning', 'product-thinking'],
  completionCriteria: [
    'Can write branching logic with a complete set of outcomes.',
    'Can enumerate combinations rather than writing branches ad hoc.',
    'Distinguishes different kinds of emptiness.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Lesson 19                                                                   */
/* -------------------------------------------------------------------------- */

const LESSON_4: Lesson = {
  id: 'lesson-forms-and-validation',
  slug: 'forms-and-validation',
  moduleId: MODULE_ID,
  lessonNumber: 4,
  title: 'Forms and Validation',
  summary:
    'Forms are where users do the most work and where interfaces most often let them down. Validation is a conversation, and timing is most of it.',
  estimatedMinutes: 9,
  objectives: [
    'Read values out of a form.',
    'Validate input and report problems usefully.',
    'Choose when to validate so that help does not become nagging.',
    'Attach error messages so assistive technology announces them.',
  ],
  prerequisiteConcepts: ['Events', 'Conditions', 'Form controls from Module 1'],
  prerequisiteLessonIds: [
    'lesson-conditions-and-interface-decisions',
    'lesson-buttons-links-inputs-and-controls',
  ],
  recap: [
    {
      kind: 'paragraph',
      text: 'You can read values, listen for events, and branch on conditions. A form uses all three at once.',
    },
  ],
  priorKnowledge: [
    {
      kind: 'paragraph',
      text: 'From Module 1 you know which control each field should be and that labels must be connected with `for` and `id`. From Module 3 you know how to mark a form up. This lesson adds the behaviour.',
    },
  ],
  coreConcept: [
    {
      kind: 'paragraph',
      text: 'Validation answers one question: can this be submitted, and if not, what exactly is wrong?',
    },
    {
      kind: 'paragraph',
      text: 'The second half is where most forms fail. "Invalid input" names no field and no rule. A good message says which field, what is wrong with it, and what would be acceptable.',
    },
  ],
  whyDesignersCare: [
    {
      kind: 'paragraph',
      text: 'Because form errors reach people who are already slightly frustrated, and the wording is usually written last by whoever is implementing.',
    },
    {
      kind: 'paragraph',
      text: 'Specifying the messages — and the moment each appears — is high-leverage design work that almost never arrives in a handoff.',
    },
  ],
  howItWorks: [
    {
      kind: 'paragraph',
      text: 'Browsers validate some things for free. `required` on a field, `type="email"` for an address format — real controls carry real behaviour, which is the Module 1 point again.',
    },
    {
      kind: 'paragraph',
      text: 'For anything beyond that, you read the value and check it yourself.',
    },
    {
      kind: 'code',
      language: 'javascript',
      code: 'const form = document.querySelector("#signup");\nconst email = document.querySelector("#email");\n\nform.addEventListener("submit", function (event) {\n  event.preventDefault();\n\n  if (email.value.includes("@") === false) {\n    showError(email, "Enter an email address, including the @.");\n    return;\n  }\n\n  submitSignup(email.value);\n});',
    },
    {
      kind: 'paragraph',
      text: 'Line by line. The listener is on the form, so it fires however the submission happened — the point from lesson 17.',
    },
    {
      kind: 'paragraph',
      text: '`event.preventDefault()` stops the browser’s default submission, which would reload the page. `email.value` is what is typed; `.includes("@")` asks whether the text contains that character.',
    },
    {
      kind: 'paragraph',
      text: '`return` leaves the function early, so the submission below never runs. That early exit is the usual shape for validation: check, report, stop.',
    },
  ],
  firstPrinciples: [
    {
      kind: 'paragraph',
      text: 'Timing is most of the design. There are three reasonable moments and one bad one.',
    },
    {
      kind: 'list',
      items: [
        'On submit — always correct. Nothing should be submittable while invalid.',
        'On blur, when the user leaves a field — good. They have finished, so the feedback is timely rather than interrupting.',
        'On input, after an error has already been shown — good. Once someone is fixing a problem, telling them the moment it is fixed is reassuring.',
        'On input, before any error has been shown — bad. It reports an incomplete email as invalid while it is being typed.',
      ],
    },
    {
      kind: 'paragraph',
      text: 'The pattern that follows: validate on blur and on submit, then switch that field to validating on input only after it has failed once.',
    },
  ],
  designPerspective: [
    {
      kind: 'paragraph',
      text: 'The design question is what the message says.',
    },
    {
      kind: 'paragraph',
      text: 'Name the field, state the rule, and if possible show an acceptable example. "Password must be at least 8 characters" beats "Invalid password", and showing the requirements before the user types beats both.',
    },
  ],
  engineeringPerspective: [
    {
      kind: 'paragraph',
      text: 'The engineering question is whether the message is attached to the field in a way assistive technology can follow.',
    },
    {
      kind: 'code',
      language: 'html',
      code: '<label for="email">Email</label>\n<input id="email" type="email" aria-describedby="email-error" aria-invalid="true">\n<p id="email-error">Enter an email address, including the @.</p>',
    },
    {
      kind: 'paragraph',
      text: '`aria-describedby` points at the id of the message, so a screen reader reads the error when the field is focused. `aria-invalid="true"` marks the field as failing. Without these, the error is visible text floating near a field with no stated relationship.',
    },
  ],
  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'An error message is simultaneously copy, a visual treatment, and a pair of attributes.',
    },
    {
      kind: 'paragraph',
      text: 'All three have to be specified or the error works for some users and not others. This is one of the clearest cases in the course where a design decision is incomplete until its markup is decided.',
    },
  ],
  industryExamples: [
    {
      id: 'example-stripe-card-validation',
      source: 'Stripe',
      title: 'Validation timed to the field',
      observation:
        'Stripe’s card fields validate as a complete value is reached rather than on every keystroke, and format the number as it is entered.',
      takeaway:
        'Validation timing can be per-field. A card number has a knowable completion point; a name does not.',
    },
    {
      id: 'example-govuk-error-summary',
      source: 'GOV.UK',
      title: 'An error summary at the top',
      observation:
        'GOV.UK forms list every error at the top of the page with links to the fields, as well as marking each field.',
      takeaway:
        'On a long form, a summary saves the user hunting. The links are what make it useful rather than decorative.',
    },
  ],
  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'A signup form with two fields, validated at sensible moments.',
    },
    {
      kind: 'code',
      language: 'javascript',
      code: 'function validateEmail(value) {\n  if (value === "") return "Enter your email address.";\n  if (value.includes("@") === false) return "Include an @ in the address.";\n  return null;\n}\n\nfunction validatePassword(value) {\n  if (value.length < 8) return "Use at least 8 characters.";\n  return null;\n}',
    },
    {
      kind: 'paragraph',
      text: 'Each function returns a message when something is wrong and `null` when it is fine. `null` means "no value" — here, "no problem". That shape makes the calling code simple: if you get a string back, show it.',
    },
    {
      kind: 'paragraph',
      text: 'Note the order inside `validateEmail`. Empty is checked before format, because telling someone their blank field is missing an @ is unhelpful. Checking the most basic failure first is a small thing that noticeably improves a form.',
    },
  ],
  commonMistakes: [
    {
      id: 'mistake-04-04-validate-while-typing',
      mistake: 'Showing an error on every keystroke from the first character.',
      why: 'An email is invalid for most of the time it takes to type one. The user is told they are wrong continuously while doing nothing wrong.',
      instead: 'Validate on blur and submit. Switch to live validation only after a field has failed.',
    },
    {
      id: 'mistake-04-04-unattached-errors',
      mistake: 'Putting an error message near a field without connecting them.',
      why: 'Screen reader users hear the field and not its error, so they are told nothing is wrong.',
      instead: 'Use `aria-describedby` and `aria-invalid`. Two attributes.',
    },
  ],
  professionalConsideration: [
    {
      kind: 'paragraph',
      text: 'Disabling the submit button until a form is valid seems helpful and usually is not.',
    },
    {
      kind: 'paragraph',
      text: 'A disabled button gives no explanation of what is missing, and on a long form the user is left hunting. Leaving it enabled and validating on press — then moving focus to the first problem — tells them exactly what to fix. This is the Module 1 point about disabled controls, arriving where it bites hardest.',
    },
  ],
  practicalExercise: {
    id: 'exercise-forms-and-validation',
    title: 'Build a validated signup form',
    prompt:
      'Build a signup form with email and password that validates at the right moments and reports problems accessibly.',
    steps: [
      'Write the markup with real controls and connected labels.',
      'Write a validation function per field, returning a message or null.',
      'Validate on submit, and prevent the default submission.',
      'Validate a field on blur as well.',
      'After a field has failed once, validate it on input so the error clears as it is fixed.',
      'Attach each message with `aria-describedby` and set `aria-invalid`.',
      'On a failed submit, move focus to the first field with a problem.',
      'Test the whole form using only the keyboard.',
    ],
    successCriteria: [
      'No error appears before a field has been left or submitted.',
      'Errors clear as they are corrected, once shown.',
      'Every message names the field and states the rule.',
      'Messages are connected with `aria-describedby`, and `aria-invalid` is set.',
      'A failed submit moves focus to the first problem.',
      'The form is completable by keyboard alone.',
    ],
    estimatedMinutes: 70,
    hint: 'Build the "has this field failed before?" tracking first. Everything about the timing follows from that one piece of information.',
  },
  reflectionQuestion:
    'Why is disabling the submit button until a form is valid often worse than leaving it enabled?',
  reflectionHint:
    'Picture a long form with one problem somewhere. What does a disabled button tell the person about where to look?',
  resources: [
    {
      id: 'resource-mdn-form-validation',
      title: 'Client-side form validation — MDN Learn',
      url: 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms/Form_validation',
      type: 'documentation',
      author: 'MDN',
      estimatedMinutes: 45,
      note: 'Built-in validation first, then custom. Covers the attributes used in this lesson.',
    },
    {
      id: 'resource-webaim-form-errors',
      title: 'Usable and Accessible Form Validation and Error Recovery',
      url: 'https://webaim.org/techniques/formvalidation/',
      type: 'article',
      author: 'WebAIM',
      estimatedMinutes: 20,
      note: 'How to attach errors so everyone receives them. Short and directly applicable.',
    },
  ],
  competencyTags: ['javascript', 'accessibility', 'interaction-engineering', 'ux-reasoning'],
  completionCriteria: [
    'Can read and validate form values.',
    'Can choose validation timing that helps rather than nags.',
    'Attaches error messages so assistive technology announces them.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Lesson 20                                                                   */
/* -------------------------------------------------------------------------- */

const LESSON_5: Lesson = {
  id: 'lesson-getting-data-and-waiting-for-responses',
  slug: 'getting-data-and-waiting-for-responses',
  moduleId: MODULE_ID,
  lessonNumber: 5,
  title: 'Getting Data and Waiting for Responses',
  summary:
    'Asking a server for something takes time, and can fail. This lesson is where the loading and error states you designed in Module 1 finally get written.',
  estimatedMinutes: 10,
  objectives: [
    'Explain what makes a request different from everything else you have written.',
    'Request data and use the result when it arrives.',
    'Handle a failed request as a designed outcome.',
    'Connect the four states from Module 1 to the code that produces them.',
  ],
  prerequisiteConcepts: [
    'The four states from Module 1 lesson 4',
    'Conditions',
    'Events and functions',
  ],
  prerequisiteLessonIds: [
    'lesson-forms-and-validation',
    'lesson-feedback-loading-success-and-error',
  ],
  recap: [
    {
      kind: 'paragraph',
      text: 'Last lesson you validated a form and stopped before submitting it anywhere. This lesson sends it — and deals with the fact that sending takes time.',
    },
  ],
  priorKnowledge: [
    {
      kind: 'paragraph',
      text: 'In Module 1 lesson 4 you designed four states: idle, working, succeeded, failed. You have been waiting since then for the thing that produces "working". This is it.',
    },
  ],
  coreConcept: [
    {
      kind: 'paragraph',
      text: 'Everything you have written so far happens immediately. A request does not. You ask, and the answer arrives later — possibly much later, possibly never.',
    },
    {
      kind: 'paragraph',
      text: 'The browser does not stop and wait, because that would freeze the page. Instead your code says what to do when the answer arrives, and carries on. That delay is the whole reason the "working" state exists.',
    },
  ],
  whyDesignersCare: [
    {
      kind: 'paragraph',
      text: 'Because this is where the gap between a mockup and a product is widest.',
    },
    {
      kind: 'paragraph',
      text: 'A design shows data present. The code has to handle data absent, data arriving, data refused and data arriving in a form nobody expected. Four interfaces for what the design treated as one screen — which is exactly what Module 1 told you, now with the mechanism attached.',
    },
  ],
  howItWorks: [
    {
      kind: 'paragraph',
      text: '`fetch` asks for something over the network. Because the answer is not immediate, the code is written with `async` and `await`.',
    },
    {
      kind: 'code',
      language: 'javascript',
      code: 'async function loadProducts() {\n  const response = await fetch("/api/products");\n  const products = await response.json();\n  return products;\n}',
    },
    {
      kind: 'paragraph',
      text: 'Line by line. `async` marks the function as one that waits for things. `await` means "pause here until this finishes, then carry on with the result" — and it is allowed only inside an `async` function.',
    },
    {
      kind: 'paragraph',
      text: '`fetch("/api/products")` sends the request. `response.json()` reads the body and converts it from text into usable objects and arrays — which itself takes a moment, hence the second `await`.',
    },
    {
      kind: 'paragraph',
      text: 'The important thing to notice: the code reads top to bottom like everything else. `await` is what lets waiting be written in a straight line.',
    },
  ],
  firstPrinciples: [
    {
      kind: 'paragraph',
      text: 'There are two distinct ways this can fail, and they need different handling.',
    },
    {
      kind: 'code',
      language: 'javascript',
      code: 'async function loadProducts() {\n  try {\n    const response = await fetch("/api/products");\n\n    if (response.ok === false) {\n      return { status: "error", message: "The server refused the request." };\n    }\n\n    const products = await response.json();\n    return { status: "success", products };\n  } catch (error) {\n    return { status: "error", message: "Could not reach the server." };\n  }\n}',
    },
    {
      kind: 'paragraph',
      text: '`try` and `catch`: run this, and if it throws an error, run the catch block instead. The catch handles the request never arriving — no network, server unreachable.',
    },
    {
      kind: 'paragraph',
      text: '`response.ok` handles the other case: the request arrived and the server said no. That is not an error in the thrown sense — the round trip worked — so it must be checked separately. Forgetting this is why some products show a page of nothing instead of an error.',
    },
    {
      kind: 'paragraph',
      text: 'The function returns an object naming what happened. The caller then has one value to branch on, rather than having to interpret several.',
    },
  ],
  designPerspective: [
    {
      kind: 'paragraph',
      text: 'The design question is what fills the time, and what the failure says.',
    },
    {
      kind: 'paragraph',
      text: 'For a short wait, perhaps nothing — the Module 1 point about not flashing a spinner for 80 milliseconds. For a longer one, something that indicates progress and does not shift the layout when the content replaces it.',
    },
    {
      kind: 'paragraph',
      text: 'And the two failures deserve different words: "check your connection" for an unreachable server, something else entirely for a refusal.',
    },
  ],
  engineeringPerspective: [
    {
      kind: 'paragraph',
      text: 'The engineering question is what happens to requests that are no longer wanted.',
    },
    {
      kind: 'paragraph',
      text: 'If someone types quickly in a search box, several requests may be in flight at once, and they can come back out of order — so an older response can overwrite a newer one. The result is a list that does not match the query. Module 11 handles this properly; for now, be aware that "it arrived" and "it is still relevant" are different questions.',
    },
  ],
  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'The four states from Module 1 are now literally four branches in code.',
    },
    {
      kind: 'paragraph',
      text: 'Idle before the call, working between the call and the answer, and two kinds of ending. The design you drew in lesson 4 of Module 1 is the specification for this function — which is the clearest demonstration in the course so far that designing the states first makes the code easier to write, not harder.',
    },
  ],
  industryExamples: [
    {
      id: 'example-github-skeletons',
      source: 'GitHub',
      title: 'Placeholders shaped like the content',
      observation:
        'GitHub shows grey placeholder blocks matching the shape of the content while a list loads.',
      takeaway:
        'A placeholder matching the final layout prevents the jump that happens when real content replaces a spinner.',
    },
    {
      id: 'example-vercel-retry',
      source: 'Vercel',
      title: 'Failure with a route forward',
      observation:
        'When a Vercel dashboard panel fails to load, it shows an error with a retry rather than disappearing.',
      takeaway:
        'A failed section should remain visible and recoverable. Hiding it leaves the user unsure whether there was anything there.',
    },
  ],
  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Wire the function to the interface so all four states are visible.',
    },
    {
      kind: 'code',
      language: 'javascript',
      code: 'async function showProducts() {\n  setState("loading");\n\n  const result = await loadProducts();\n\n  if (result.status === "error") {\n    setState("error", result.message);\n    return;\n  }\n\n  if (result.products.length === 0) {\n    setState("empty");\n    return;\n  }\n\n  setState("ready", result.products);\n}',
    },
    {
      kind: 'paragraph',
      text: 'Four outcomes, in the order they are decided: loading first, then failure, then emptiness, then content. Each exits early, so exactly one applies.',
    },
    {
      kind: 'paragraph',
      text: 'Note that empty is checked after success. An empty list is not a failure — the request worked and the answer was "none" — which is the distinction from lesson 18, now with a request behind it.',
    },
    {
      kind: 'paragraph',
      text: '`setState` is invented here to keep the example readable. Module 5 is about what it should actually do.',
    },
  ],
  commonMistakes: [
    {
      id: 'mistake-04-05-ignoring-response-ok',
      mistake: 'Assuming a completed request succeeded.',
      why: 'A server refusal arrives as a perfectly normal response. Without checking `response.ok`, the code treats a rejection as data.',
      instead: 'Check `response.ok` as well as catching thrown errors. They are different failures.',
    },
    {
      id: 'mistake-04-05-no-loading-state',
      mistake: 'Leaving the interface unchanged while a request is in flight.',
      why: 'The user cannot tell whether anything happened, so they press again — and now there are two requests.',
      instead: 'Set the loading state before the request, not after it returns.',
    },
  ],
  professionalConsideration: [
    {
      kind: 'paragraph',
      text: 'Loading is not always one thing. A page may have several independent pieces that arrive at different times.',
    },
    {
      kind: 'paragraph',
      text: 'Treating the whole page as loading until the slowest piece arrives makes the product feel much slower than it is. Letting each region show its own state is more work and markedly better — and it only becomes possible once you stop thinking of "loading" as a property of a screen. Module 11 pursues this.',
    },
  ],
  practicalExercise: {
    id: 'exercise-getting-data-and-waiting-for-responses',
    title: 'Fetch data and handle every outcome',
    prompt:
      'Build a small page that requests a list and handles loading, success, empty and both kinds of failure.',
    steps: [
      'Use a real public API, or simulate one with a function that waits and sometimes fails.',
      'Write the request function, returning an object that names what happened.',
      'Handle a thrown error and an unsuccessful response separately.',
      'Set the loading state before the request begins.',
      'Branch into loading, error, empty and ready.',
      'Give the error state a retry that actually retries.',
      'Force each outcome deliberately and confirm the interface is correct for all four.',
      'Add an artificial delay and check the loading state does not flash for a fast response.',
    ],
    successCriteria: [
      'All four outcomes implemented and individually demonstrated.',
      'Network failure and server refusal produce different messages.',
      'The loading state is set before the request, not after.',
      'Empty is distinguished from failure.',
      'Retry works from the error state.',
    ],
    estimatedMinutes: 80,
    hint: 'Write the simulated request first, with a switch to force each outcome. Testing the four states is far harder if you depend on a real server behaving badly on cue.',
  },
  reflectionQuestion:
    'Why does a successful request that returns an empty list need different handling from a failed request?',
  reflectionHint:
    'One of them means the system worked and the answer was "none". Consider what each should invite the user to do.',
  resources: [
    {
      id: 'resource-mdn-fetch-intro',
      title: 'Network requests — MDN Learn',
      url: 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Network_requests',
      type: 'documentation',
      author: 'MDN',
      estimatedMinutes: 40,
      note: 'Fetching data, written for people meeting it for the first time.',
    },
    {
      id: 'resource-javascript-info-async',
      title: 'Promises, async/await',
      url: 'https://javascript.info/async',
      type: 'documentation',
      author: 'javascript.info',
      estimatedMinutes: 60,
      note: 'The clearest explanation of what `await` actually does. Read it when the mechanism starts to matter.',
    },
  ],
  competencyTags: ['javascript', 'async-systems', 'interface-state-modelling', 'browser-apis'],
  completionCriteria: [
    'Can request data and use the result when it arrives.',
    'Handles both network failure and server refusal.',
    'Distinguishes empty from failed.',
    'Sets the loading state before the request begins.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Project                                                                     */
/* -------------------------------------------------------------------------- */

const PROJECT: ModuleProject = {
  id: 'project-interactive-signup-or-search',
  slug: 'interactive-signup-or-search',
  moduleId: MODULE_ID,
  title: 'Interactive Signup or Search Experience',
  brief:
    'Build a working interface with real behaviour: a validated signup form, or a search experience that fetches results — including every state from Module 1.',
  learnerGoal:
    'Ship the first thing you have built that genuinely responds to a person, with all four states working rather than drawn.',
  problem:
    'Signup and search are the two interactions every product has, and both contain the full set: input, validation, waiting, success, failure and emptiness. Building one properly exercises everything in this module.',
  prerequisiteLessonIds: [
    'lesson-javascript-without-the-intimidation',
    'lesson-events-clicks-and-user-input',
    'lesson-conditions-and-interface-decisions',
    'lesson-forms-and-validation',
    'lesson-getting-data-and-waiting-for-responses',
  ],
  objectives: [
    'Build an interface that responds to input with real behaviour.',
    'Implement every state from Module 1 as working code.',
    'Validate input at moments that help rather than nag.',
    'Keep the whole experience operable by keyboard.',
  ],
  requirements: [
    'Choose one: a signup form, or a search experience.',
    'Semantic HTML and your own CSS, continuing from Module 3.',
    'Validation with messages that name the field and state the rule.',
    'A request that can succeed, fail or return nothing — real or simulated.',
    'All four states implemented: idle, loading, success, error.',
    'An empty state distinct from the error state.',
    'Error messages attached with `aria-describedby` and `aria-invalid`.',
  ],
  constraints: [
    'No framework. Plain JavaScript only.',
    'No form or validation library. Write the validation yourself.',
    'Every state must be reachable and demonstrable on demand.',
    'Nothing may be operable by mouse alone.',
  ],
  suggestedScope:
    'One interaction, complete, rather than two half-built. Around fifteen to twenty-five hours. It is finished when you can demonstrate every state deliberately.',
  deliverables: [
    'The working build: HTML, CSS and JavaScript.',
    'The combination table of states you enumerated before building.',
    'A short note on validation timing and why you chose it.',
    'A recording or screenshots of every state, including both failure kinds.',
  ],
  completionCriteria: [
    'Every state can be triggered on demand and behaves correctly.',
    'Network failure and server refusal are distinguishable to the user.',
    'Empty results are distinguished from failure.',
    'No validation error appears before a field has been left or submitted.',
    'The entire flow is completable by keyboard alone.',
    'Error messages are programmatically associated with their fields.',
  ],
  portfolioEvidence: [
    'Behavioural implementation — an interface that genuinely responds.',
    'State coverage — every state built, not only the successful one.',
    'Accessible forms — errors that reach everyone.',
    'Async handling — two failure kinds handled distinctly.',
  ],
  reflectionQuestion:
    'Which state took the longest to get right, and was the difficulty in the logic or in deciding what should happen?',
  estimatedHours: 20,
  competencies: [
    'javascript',
    'interaction-engineering',
    'async-systems',
    'accessibility',
    'interface-state-modelling',
    'html',
    'css',
  ],
  stretchGoals: [
    'Add a short delay before the loading indicator appears, so fast responses do not flash.',
    'For search, prevent an older response from overwriting a newer one.',
    'Add an error summary at the top of the form with links to each failing field.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Module                                                                      */
/* -------------------------------------------------------------------------- */

export const MODULE_04: CurriculumModule = {
  id: MODULE_ID,
  slug: 'javascript-for-interface-designers',
  moduleNumber: 4,
  phase: 'interface-craft',
  title: 'JavaScript for Interface Designers',
  description:
    'Your first programming language, taught entirely through interface problems: describing things as data, responding to events, making decisions, validating input, and waiting for a server.',
  outcome:
    'Can build an interface that responds to a person, handles every outcome, and remains operable by keyboard.',
  prerequisites: [
    'Module 3 — you can build a page in HTML and CSS',
    'Module 1 — you can enumerate the states of an action',
    'No prior programming experience required',
  ],
  lessons: [LESSON_1, LESSON_2, LESSON_3, LESSON_4, LESSON_5],
  resources: [
    {
      id: 'resource-module-04-javascript-info',
      title: 'The Modern JavaScript Tutorial',
      url: 'https://javascript.info/',
      type: 'documentation',
      author: 'javascript.info',
      estimatedMinutes: 300,
      note: 'The best free JavaScript material there is. Work through part one alongside this module.',
    },
    {
      id: 'resource-module-04-mdn-scripting',
      title: 'Dynamic scripting with JavaScript — MDN Learn',
      url: 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting',
      type: 'documentation',
      author: 'MDN',
      estimatedMinutes: 240,
      note: 'A second route through the same ground, with more browser focus.',
    },
    {
      id: 'resource-module-04-chrome-devtools',
      title: 'Debug JavaScript — Chrome for Developers',
      url: 'https://developer.chrome.com/docs/devtools/javascript',
      type: 'video',
      author: 'Google',
      estimatedMinutes: 30,
      note: 'How to pause code and look at what it is doing. The single most useful skill when something does not work.',
    },
    {
      id: 'resource-module-04-webaim-forms',
      title: 'Creating Accessible Forms',
      url: 'https://webaim.org/techniques/forms/',
      type: 'article',
      author: 'WebAIM',
      estimatedMinutes: 25,
      note: 'Keep this open while building the project.',
    },
  ],
  project: PROJECT,
  competencies: [
    'javascript',
    'browser-apis',
    'interaction-engineering',
    'async-systems',
    'accessibility',
    'interface-state-modelling',
    'state-modelling',
    'product-thinking',
    'ux-reasoning',
    'html',
    'css',
  ],
  completionCriteria: [
    'All five lessons completed.',
    'Module project marked completed.',
    'Can build an interface that responds to input and handles every outcome.',
  ],
};
