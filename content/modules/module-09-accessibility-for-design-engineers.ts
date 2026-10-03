/**
 * Module 09 — Accessibility for Design Engineers.
 *
 * This is the second pass over HTML, taken deliberately after components exist.
 * Module 3 taught semantics as structure; this module treats them as behaviour,
 * because a learner who has just built a Dialog and a Dropdown has somewhere to
 * apply it. Accessibility here is a property of components, not a checklist run
 * over a finished page.
 */

import type { CurriculumModule, Lesson, ModuleProject } from '@/types/curriculum';

const MODULE_ID = 'module-09';

/* -------------------------------------------------------------------------- */
/* Lesson 41                                                                   */
/* -------------------------------------------------------------------------- */

const LESSON_1: Lesson = {
  id: 'lesson-semantic-interfaces',
  slug: 'semantic-interfaces',
  moduleId: MODULE_ID,
  lessonNumber: 1,
  title: 'Semantic Interfaces',
  summary:
    'HTML again, at depth. Module 3 used elements for structure; this lesson is about the behaviour and meaning they carry, and what you take on when you discard it.',
  estimatedMinutes: 10,
  objectives: [
    'Choose elements for the behaviour they carry, not only their appearance.',
    'Structure a page with headings and landmarks that describe it.',
    'Explain where an accessible name comes from.',
    'Audit a real page and record what its structure claims.',
  ],
  prerequisiteConcepts: [
    'HTML structure and meaning, Module 3 lesson 11',
    'Native controls, Module 1 lesson 2',
    'Components, Module 8',
  ],
  prerequisiteLessonIds: [
    'lesson-html-gives-interfaces-structure-and-meaning',
    'lesson-where-state-should-live',
  ],
  recap: [
    {
      kind: 'paragraph',
      text: 'You have built eight components. Several of them replaced something the browser provides — a dropdown instead of a `select`, a dialog instead of nothing at all — which means several of them took on work the browser was doing.',
    },
  ],
  priorKnowledge: [
    {
      kind: 'paragraph',
      text: 'Module 3 lesson 11 established that `<button>` is a button and a styled `<div>` is not. Module 1 lesson 2 showed what a native control does for free: keyboard operation, focus, announcement, and the platform conventions users already know.',
    },
    {
      kind: 'paragraph',
      text: 'This lesson is the same material with the consequences made explicit, now that you have components that depend on them.',
    },
  ],
  coreConcept: [
    {
      kind: 'paragraph',
      text: 'An element is a **contract**. It commits to a meaning, a set of behaviours, and an announcement to assistive technology.',
    },
    {
      kind: 'paragraph',
      text: '`<button>` promises: focusable by keyboard, activated by Enter and Space, announced as a button, and participating in form submission where relevant. Four promises in seven characters.',
    },
    {
      kind: 'code',
      language: 'html',
      code: '<!-- Four behaviours, free. -->\n<button type="button">Delete</button>\n\n<!-- No behaviours. Every one must now be rebuilt. -->\n<div class="button" onclick="remove()">Delete</div>',
    },
    {
      kind: 'paragraph',
      text: 'The div can be made equivalent — `role`, `tabindex`, key handlers for Enter and Space, a focus style. Four or five additions to reach where the button started, each a chance to get it wrong.',
    },
  ],
  whyDesignersCare: [
    {
      kind: 'paragraph',
      text: 'Because the pressure to abandon a native element is almost always a visual one, and the cost is paid somewhere a designer never looks.',
    },
    {
      kind: 'paragraph',
      text: '"The select looks wrong on Windows" is a real problem with a real solution, and the solution — a custom dropdown — carries a bill: keyboard navigation, type-ahead, announcement of the open state, and focus returning to the trigger. Knowing that bill exists is what lets a designer decide whether the appearance is worth it.',
    },
    {
      kind: 'paragraph',
      text: 'Often it is. The point is to choose, not to discover afterwards.',
    },
  ],
  howItWorks: [
    {
      kind: 'paragraph',
      text: '**Headings** form the document’s outline, and many people navigate by them directly.',
    },
    {
      kind: 'code',
      language: 'html',
      code: '<h1>Account settings</h1>\n  <h2>Profile</h2>\n  <h2>Notifications</h2>\n    <h3>Email</h3>\n    <h3>Push</h3>\n  <h2>Danger zone</h2>',
    },
    {
      kind: 'paragraph',
      text: 'One `h1` per page, and no skipped levels — an `h4` directly under an `h2` describes a structure that is not there. Heading level is structure; size is styling, and the two are set independently.',
    },
    {
      kind: 'paragraph',
      text: '**Landmarks** name the regions of a page, letting someone jump to navigation or main content without passing through everything else.',
    },
    {
      kind: 'code',
      language: 'html',
      code: '<header>…</header>\n<nav aria-label="Primary">…</nav>\n<main>\n  <h1>Account settings</h1>\n  …\n</main>\n<aside aria-label="Related">…</aside>\n<footer>…</footer>',
    },
    {
      kind: 'paragraph',
      text: 'One `main` per page. Where a landmark type appears twice — two `nav` elements — each needs a label, or they are two identically named regions and the choice between them is a guess.',
    },
  ],
  firstPrinciples: [
    {
      kind: 'paragraph',
      text: 'Every control has an **accessible name**: the text assistive technology announces for it.',
    },
    {
      kind: 'paragraph',
      text: 'It comes from one of several sources, in a defined order of preference:',
    },
    {
      kind: 'list',
      ordered: true,
      items: [
        '`aria-labelledby`, pointing at the element that holds the text.',
        '`aria-label`, a string on the element itself.',
        'The element’s own content — the text inside a button.',
        'An associated `<label>`, for a form control.',
        'A `title` attribute, as a last resort.',
      ],
    },
    {
      kind: 'paragraph',
      text: 'An icon-only button has no content, so without a label it has no name. It is announced as "button" — which, for a row of six icon buttons, means six indistinguishable buttons.',
    },
    {
      kind: 'code',
      language: 'html',
      code: '<!-- Announced as "button". Useless. -->\n<button><TrashIcon /></button>\n\n<!-- Announced as "Delete project, button". -->\n<button aria-label="Delete project"><TrashIcon aria-hidden="true" /></button>',
    },
    {
      kind: 'paragraph',
      text: '`aria-hidden` on the icon removes it from the **accessibility tree** — the parallel tree a screen reader reads, which lesson 44 covers properly. For now it is enough to know that hiding the icon there stops it contributing a stray name of its own alongside the label.',
    },
  ],
  designPerspective: [
    {
      kind: 'paragraph',
      text: 'The design question is whether the visual hierarchy and the heading structure agree.',
    },
    {
      kind: 'paragraph',
      text: 'Reading only the headings should give a usable summary of the page. If it does not — because a section title was styled as body text, or a visually prominent label is not a heading at all — then the structure and the design are telling different stories, and the Module 2 hierarchy work exists only for sighted users.',
    },
  ],
  engineeringPerspective: [
    {
      kind: 'paragraph',
      text: 'The engineering question is where heading levels are decided.',
    },
    {
      kind: 'paragraph',
      text: 'A component that hard-codes `<h3>` is correct in one position and wrong everywhere else. The usual remedies are to accept the level as a prop, or to let the component render a heading element chosen by its caller — either way, the level belongs to the page, not to the component.',
    },
  ],
  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'Semantics are the part of a design that survives not being seen.',
    },
    {
      kind: 'paragraph',
      text: 'Hierarchy, grouping and emphasis are all design decisions. Expressed only in CSS they reach people who look at the screen; expressed in elements as well they reach everyone. The same decision, recorded in two places, for two audiences.',
    },
  ],
  industryExamples: [
    {
      id: 'example-wai-page-structure',
      source: 'W3C WAI',
      title: 'Structure documented as a tutorial',
      observation:
        'The WAI page structure tutorial covers headings, landmarks and regions as the foundation of an accessible page.',
      takeaway:
        'It is treated as foundational rather than advanced, and it is the shortest high-value accessibility reading available.',
    },
    {
      id: 'example-webaim-million-findings',
      source: 'WebAIM',
      title: 'The same failures, at scale',
      observation:
        'WebAIM’s annual analysis of a million home pages consistently finds missing alternative text, low contrast, unlabelled form fields and empty links among the most common failures.',
      takeaway:
        'The commonest problems are basic ones. Most accessibility work is doing the simple things reliably rather than handling exotic cases.',
    },
  ],
  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Audit the structure of your Module 8 documentation page.',
    },
    {
      kind: 'paragraph',
      text: 'In the browser, run through four questions in order.',
    },
    {
      kind: 'list',
      ordered: true,
      items: [
        'List the headings in order. Does reading them alone describe the page?',
        'Is there exactly one `h1`, and are any levels skipped?',
        'Are `main`, `nav` and `header` present, and does every repeated landmark have a label?',
        'Does every control have a name — text content, or a label for icon-only ones?',
      ],
    },
    {
      kind: 'code',
      language: 'javascript',
      code: '// Paste into the console: the heading outline, as the page actually declares it.\n[...document.querySelectorAll("h1, h2, h3, h4, h5, h6")]\n  .map((h) => `${h.tagName} ${h.textContent.trim()}`)\n  .join("\\n");',
    },
    {
      kind: 'paragraph',
      text: 'The output is the outline. A page where it reads as a sensible table of contents has its structure right; a page where it reads as fragments does not, however clear it looks.',
    },
    {
      kind: 'paragraph',
      text: 'One caveat about that snippet: it finds heading *elements*, so a section title styled as a heading but marked up as a `div` will be missing — which is exactly the kind of gap this audit is for.',
    },
  ],
  commonMistakes: [
    {
      id: 'mistake-09-01-heading-for-size',
      mistake: 'Choosing a heading level for how large it renders.',
      why: 'Level is structure. Choosing `h4` because it is the right size produces an outline that misdescribes the page.',
      instead: 'Choose the level for the structure and set the size in CSS. They are independent.',
    },
    {
      id: 'mistake-09-01-icon-only-unlabelled',
      mistake: 'Icon-only buttons with no accessible name.',
      why: 'They are announced as "button", so a toolbar of six becomes six identical controls.',
      instead: 'Add `aria-label` and hide the icon from the accessibility tree with `aria-hidden="true"`.',
    },
  ],
  professionalConsideration: [
    {
      kind: 'paragraph',
      text: 'Semantics are the cheapest accessibility work and the most frequently skipped.',
    },
    {
      kind: 'paragraph',
      text: 'A correct heading outline and real landmarks cost almost nothing at build time and are expensive to retrofit, because by then the structure is load-bearing for the CSS. Getting them right while writing the component is close to free; fixing them after a design review is a restructuring job.',
    },
  ],
  practicalExercise: {
    id: 'exercise-semantic-interfaces',
    title: 'Audit a page',
    prompt:
      'Audit the structure of a real page — yours or a product you use — and record every semantic problem with its fix.',
    steps: [
      'Extract the heading outline and judge whether it describes the page.',
      'Check for one `h1` and for skipped levels.',
      'List the landmarks and check that repeated ones are labelled.',
      'Find every control and confirm it has an accessible name.',
      'Find any element doing a native element’s job and list what it had to rebuild.',
      'Write each finding with the element, the problem, and the fix.',
      'Fix the three with the largest effect and note what changed.',
    ],
    successCriteria: [
      'The heading outline is recorded and assessed.',
      'Landmarks are listed, with labelling checked.',
      'Every unnamed control is found.',
      'At least one non-semantic control is identified with its rebuild cost.',
      'Three fixes are applied and their effect described.',
    ],
    estimatedMinutes: 55,
    hint: 'Audit something you did not build as well as something you did. The problems are easier to see in someone else’s markup, and you then recognise them in your own.',
  },
  reflectionQuestion:
    'What exactly do you take on when you build a control out of a `div` instead of a native element?',
  reflectionHint:
    'List the behaviours the native element provided. Each one is now yours to implement and maintain.',
  resources: [
    {
      id: 'resource-wai-page-structure',
      title: 'Page Structure Tutorial',
      url: 'https://www.w3.org/WAI/tutorials/page-structure/',
      type: 'documentation',
      author: 'W3C WAI',
      estimatedMinutes: 40,
      note: 'Headings, landmarks and regions. The highest-value forty minutes in accessibility reading.',
    },
    {
      id: 'resource-mdn-accessibility',
      title: 'Accessibility — MDN',
      url: 'https://developer.mozilla.org/en-US/docs/Web/Accessibility',
      type: 'documentation',
      author: 'MDN',
      estimatedMinutes: 30,
      note: 'The reference hub. Use it to look things up rather than to read end to end.',
    },
  ],
  competencyTags: ['accessibility', 'html', 'ux-reasoning', 'component-architecture'],
  completionCriteria: [
    'Chooses elements for the behaviour they carry.',
    'Can produce a heading outline that describes the page.',
    'Can say where any control’s accessible name comes from.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Lesson 42                                                                   */
/* -------------------------------------------------------------------------- */

const LESSON_2: Lesson = {
  id: 'lesson-keyboard-and-focus',
  slug: 'keyboard-and-focus',
  moduleId: MODULE_ID,
  lessonNumber: 2,
  title: 'Keyboard and Focus',
  summary:
    'Focus is a cursor you did not design. This lesson is about where it goes, how it looks, and what your Dialog from Module 8 is still getting wrong.',
  estimatedMinutes: 10,
  objectives: [
    'Reason about tab order and the effect of DOM order on it.',
    'Make focus visible without compromising the design.',
    'Move focus deliberately when the interface changes.',
    'Implement a focus trap and restore focus on close.',
  ],
  prerequisiteConcepts: [
    'Semantic interfaces',
    'Dialog built in Module 8 lesson 39',
    'Events, Module 4 lesson 17',
  ],
  prerequisiteLessonIds: ['lesson-semantic-interfaces', 'lesson-composition'],
  recap: [
    {
      kind: 'paragraph',
      text: 'The Dialog from Module 8 handles the overlay and Escape. It does not trap focus or restore it, which this lesson fixes.',
    },
  ],
  priorKnowledge: [
    {
      kind: 'paragraph',
      text: 'You know that native controls are focusable and that a `div` is not. You have also, by now, built at least one thing that opens — which is where focus questions begin.',
    },
  ],
  coreConcept: [
    {
      kind: 'paragraph',
      text: 'Focus is where keyboard input goes. Exactly one thing has it, and for anyone not using a pointer it is the only indication of where they are.',
    },
    {
      kind: 'paragraph',
      text: 'Tab order follows **DOM order**, not visual order. Reorder with CSS — `order` in flexbox, placement in grid — and the two disagree, so tabbing jumps around the screen.',
    },
    {
      kind: 'code',
      language: 'css',
      code: '/* Visually first, still last in the tab order. */\n.sidebar { order: -1; }',
    },
    {
      kind: 'paragraph',
      text: 'The fix is to put the DOM in the order people should move through it, then lay it out. Not the other way round.',
    },
  ],
  whyDesignersCare: [
    {
      kind: 'paragraph',
      text: 'Because the focus ring is a design element, and removing it is the most damaging one-line change available in CSS.',
    },
    {
      kind: 'code',
      language: 'css',
      code: '/* Never. The interface is now unusable without a pointer. */\n*:focus { outline: none; }',
    },
    {
      kind: 'paragraph',
      text: 'The honest objection is that the default ring is ugly, and often it is. The answer is to design a better one — not to remove the only cursor some people have.',
    },
    {
      kind: 'code',
      language: 'css',
      code: '/* Designed, and only for keyboard users. */\n:focus-visible {\n  outline: 2px solid var(--focus-ring);\n  outline-offset: 2px;\n  border-radius: 4px;\n}',
    },
    {
      kind: 'paragraph',
      text: '`:focus-visible` applies when the browser judges a focus indicator useful — keyboard navigation, yes; a mouse click on a button, no. It is the selector that resolves the old argument between designers and accessibility entirely.',
    },
  ],
  howItWorks: [
    {
      kind: 'paragraph',
      text: '`tabindex` changes what is focusable, and has exactly three sensible uses.',
    },
    {
      kind: 'list',
      items: [
        '`tabindex="0"` — include a non-interactive element in the tab order. Needed when you have built a control from a `div`, which lesson 41 argued against.',
        '`tabindex="-1"` — focusable by script but not by Tab. This is how you move focus to a region without adding a tab stop.',
        'A positive value — never. It jumps the element ahead of everything in the natural order and the result is unpredictable as the page grows.',
      ],
    },
    {
      kind: 'paragraph',
      text: 'When the interface changes substantially, focus must move deliberately.',
    },
    {
      kind: 'code',
      language: 'tsx',
      code: 'const headingRef = useRef<HTMLHeadingElement>(null);\n\nuseEffect(() => {\n  if (isOpen) headingRef.current?.focus();\n}, [isOpen]);\n\nreturn (\n  <h2 ref={headingRef} tabIndex={-1}>\n    Delete project\n  </h2>\n);',
    },
    {
      kind: 'paragraph',
      text: '`useRef` gives a handle on a rendered element — the one legitimate reason to hold a DOM node in React, and a case where an effect is correct because focus lives outside React.',
    },
    {
      kind: 'paragraph',
      text: '`tabIndex={-1}` makes the heading focusable by script without adding a tab stop. Focusing the title rather than the first button announces what the dialog is before offering what to do about it.',
    },
  ],
  firstPrinciples: [
    {
      kind: 'paragraph',
      text: 'A **focus trap** keeps focus inside a modal while it is open.',
    },
    {
      kind: 'paragraph',
      text: 'Without one, Tab walks out of the dialog and into the page behind it — which is inert to a pointer but perfectly reachable by keyboard. The user is then operating controls they cannot see, underneath an overlay.',
    },
    {
      kind: 'code',
      language: 'tsx',
      code: 'useEffect(() => {\n  if (isOpen === false) return;\n\n  const previous = document.activeElement as HTMLElement | null;\n\n  function onKeyDown(event: KeyboardEvent) {\n    if (event.key === "Escape") { onClose(); return; }\n    if (event.key !== "Tab") return;\n\n    const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(\n      \'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])\',\n    );\n    if (focusable === undefined || focusable.length === 0) return;\n\n    const first = focusable[0];\n    const last = focusable[focusable.length - 1];\n\n    if (event.shiftKey && document.activeElement === first) {\n      event.preventDefault();\n      last?.focus();\n    } else if (event.shiftKey === false && document.activeElement === last) {\n      event.preventDefault();\n      first?.focus();\n    }\n  }\n\n  document.addEventListener("keydown", onKeyDown);\n\n  return () => {\n    document.removeEventListener("keydown", onKeyDown);\n    previous?.focus();            // restoration\n  };\n}, [isOpen, onClose]);',
    },
    {
      kind: 'paragraph',
      text: 'Three things happen here. Escape closes. Tab from the last element wraps to the first, and Shift+Tab from the first wraps to the last. And the cleanup returns focus to whatever had it before — the trigger button, so the user is back where they were.',
    },
    {
      kind: 'callout',
      tone: 'insight',
      body: 'Restoration is the step most often missed. Without it, closing a dialog drops focus to the top of the document, and a keyboard user has to tab back to where they were.',
    },
  ],
  designPerspective: [
    {
      kind: 'paragraph',
      text: 'The design question is what should receive focus when something opens.',
    },
    {
      kind: 'paragraph',
      text: 'The dialog title announces what has happened. The first field is faster for a form. The primary action is dangerous for a destructive confirmation, because Enter is then one keystroke from deletion. These are decisions to design, not defaults to accept.',
    },
  ],
  engineeringPerspective: [
    {
      kind: 'paragraph',
      text: 'The engineering question is where this code lives.',
    },
    {
      kind: 'paragraph',
      text: 'It belongs inside the Dialog component — once, correct, shared. The Module 8 lesson 39 principle in its most concrete form: behaviour that must be right is the component’s job. A focus trap reimplemented at eight call sites will be wrong at six of them.',
    },
  ],
  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'Keyboard quality is a product quality, not a compliance item.',
    },
    {
      kind: 'paragraph',
      text: 'The products with reputations for feeling fast — the ones with command palettes and shortcuts for everything — are keyboard-first products. Focus management is what makes that possible, so this work serves power users and assistive technology users with the same implementation.',
    },
  ],
  industryExamples: [
    {
      id: 'example-apg-dialog-pattern',
      source: 'W3C WAI',
      title: 'The dialog pattern, specified',
      observation:
        'The ARIA Authoring Practices Guide specifies the modal dialog pattern including focus placement on open, trapping while open, and restoration on close.',
      takeaway:
        'This is a solved problem with a written answer. Reading it is faster than deriving it, and considerably more reliable.',
    },
    {
      id: 'example-keyboard-first-products',
      source: 'Common practice',
      title: 'Keyboard as the primary input',
      observation:
        'Keyboard-first products are navigable entirely without a pointer, with the current item always visibly indicated.',
      takeaway:
        'A visible focus indicator is not a concession in these products. It is the interface.',
    },
  ],
  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Fix the Module 8 Dialog, then test it with the keyboard only.',
    },
    {
      kind: 'list',
      ordered: true,
      items: [
        'Open the dialog with Enter on its trigger. Focus should land on the title or the first field.',
        'Tab through every control. Focus should be visible at every stop.',
        'Tab past the last control. It should wrap to the first, not leave the dialog.',
        'Shift+Tab from the first. It should wrap to the last.',
        'Press Escape. The dialog should close.',
        'Check where focus is. It should be back on the trigger.',
      ],
    },
    {
      kind: 'paragraph',
      text: 'Do this with your hands off the mouse. The temptation to click is strong and clicking hides exactly the problems you are looking for.',
    },
    {
      kind: 'paragraph',
      text: 'One detail worth adding while you are here: the content behind the dialog should not scroll. Setting `overflow: hidden` on the body while open prevents the page sliding underneath, which otherwise happens the moment someone presses Page Down.',
    },
  ],
  commonMistakes: [
    {
      id: 'mistake-09-02-outline-none',
      mistake: 'Removing focus outlines because they look wrong.',
      why: 'It removes the only position indicator keyboard users have. The interface becomes unusable rather than tidier.',
      instead: 'Design a focus style and apply it with `:focus-visible`, which keeps it off mouse clicks.',
    },
    {
      id: 'mistake-09-02-no-focus-restoration',
      mistake: 'Closing a dialog without restoring focus.',
      why: 'Focus falls to the start of the document, so the user has to tab back through the whole page to where they were.',
      instead: 'Record `document.activeElement` on open and focus it again on close.',
    },
  ],
  professionalConsideration: [
    {
      kind: 'paragraph',
      text: 'The focus trap above is correct for the common case and incomplete for the uncommon ones.',
    },
    {
      kind: 'paragraph',
      text: 'It does not account for elements that become disabled while open, for nested dialogs, or for content inside an iframe. Production code usually uses a well-tested primitive for this reason. Writing it once yourself is still worth it — you need to know what the primitive is doing before you can judge whether it is doing it.',
    },
  ],
  practicalExercise: {
    id: 'exercise-keyboard-and-focus',
    title: 'Build an accessible dialog interaction',
    prompt:
      'Take your Module 8 Dialog and make its keyboard behaviour correct: focus placement, trapping, Escape and restoration.',
    steps: [
      'Decide what receives focus on open, and justify it for your dialog’s purpose.',
      'Implement the focus trap inside the component.',
      'Handle Escape.',
      'Restore focus to the trigger on close.',
      'Prevent the page behind from scrolling while open.',
      'Design a `:focus-visible` style and apply it throughout.',
      'Run the six-step keyboard test with your hands off the mouse.',
      'Repeat for a dialog containing a form, where focus placement should differ.',
    ],
    successCriteria: [
      'Focus placement on open is deliberate and justified.',
      'Focus cannot leave the dialog by Tab or Shift+Tab.',
      'Escape closes it.',
      'Focus returns to the trigger on close.',
      'A designed focus style is visible at every stop.',
      'The six-step test passes using only the keyboard.',
    ],
    estimatedMinutes: 70,
    hint: 'Test on the form dialog too. A trap that works with three buttons can still fail where a field swallows Tab or a disabled control sits at the boundary.',
  },
  reflectionQuestion:
    'Why does a dialog need to trap focus, when the overlay already prevents clicking the page behind it?',
  reflectionHint:
    'An overlay stops a pointer. Ask what it does to Tab.',
  resources: [
    {
      id: 'resource-apg-keyboard-interface',
      title: 'Developing a Keyboard Interface',
      url: 'https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/',
      type: 'documentation',
      author: 'W3C WAI',
      estimatedMinutes: 40,
      note: 'Tab order, focus management and the conventions each pattern expects.',
    },
    {
      id: 'resource-webaim-keyboard',
      title: 'Keyboard Accessibility',
      url: 'https://webaim.org/techniques/keyboard/',
      type: 'article',
      author: 'WebAIM',
      estimatedMinutes: 25,
      note: 'Practical and short, including tabindex and the focus-visibility problem.',
    },
  ],
  competencyTags: ['accessibility', 'interaction-engineering', 'browser-apis', 'css'],
  completionCriteria: [
    'Designs a visible focus style using `:focus-visible`.',
    'Implements focus trapping and restoration.',
    'Can operate their own interface using only the keyboard.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Lesson 43                                                                   */
/* -------------------------------------------------------------------------- */

const LESSON_3: Lesson = {
  id: 'lesson-accessible-forms-and-errors',
  slug: 'accessible-forms-and-errors',
  moduleId: MODULE_ID,
  lessonNumber: 3,
  title: 'Accessible Forms and Errors',
  summary:
    'Labels that are actually associated, errors that are actually announced, and validation that arrives when it helps rather than while you are still typing.',
  estimatedMinutes: 10,
  objectives: [
    'Associate every label, instruction and error with its field.',
    'Choose validation timing that helps rather than interrupts.',
    'Announce errors and status changes to assistive technology.',
    'Express relationships between fields in markup.',
  ],
  prerequisiteConcepts: [
    'Forms and validation, Module 4 lesson 19',
    'Semantic interfaces',
    'Keyboard and focus',
  ],
  prerequisiteLessonIds: ['lesson-keyboard-and-focus', 'lesson-forms-and-validation'],
  recap: [
    {
      kind: 'paragraph',
      text: 'Module 4 lesson 19 built validation that ran at the right moment and wrote useful messages. This lesson makes sure those messages reach everybody.',
    },
  ],
  priorKnowledge: [
    {
      kind: 'paragraph',
      text: 'You already know that validating on every keystroke tells someone their email is invalid while they are typing it, and that validating on blur is usually better. That decision was about courtesy; here it is also about whether the message is announced at all.',
    },
  ],
  coreConcept: [
    {
      kind: 'paragraph',
      text: 'A field needs its label **programmatically associated**, not merely adjacent.',
    },
    {
      kind: 'code',
      language: 'html',
      code: '<!-- Adjacent only. Announced as "edit, blank". -->\n<div>Email address</div>\n<input type="email" />\n\n<!-- Associated. Announced as "Email address, edit". -->\n<label for="email">Email address</label>\n<input id="email" type="email" />',
    },
    {
      kind: 'paragraph',
      text: 'Association also makes the label a click target that focuses the field — a usability improvement for everyone, from the same two attributes.',
    },
    {
      kind: 'paragraph',
      text: 'Wrapping works too: `<label>Email <input type="email" /></label>` needs no ids. Explicit `for` is usually easier in components, where the label and input may be rendered separately.',
    },
  ],
  whyDesignersCare: [
    {
      kind: 'paragraph',
      text: 'Because placeholder-as-label is a design pattern that fails as soon as anyone types.',
    },
    {
      kind: 'paragraph',
      text: 'A placeholder disappears on input, so the person who most needs to check what the field was — someone interrupted, or reviewing before submitting — is exactly the person who cannot. It is also typically low contrast, and it is not reliably announced as a name.',
    },
    {
      kind: 'paragraph',
      text: 'It is a real space saving with a real cost. Floating labels are the usual answer: the space of a placeholder, the persistence of a label.',
    },
  ],
  howItWorks: [
    {
      kind: 'paragraph',
      text: 'Instructions and errors attach with `aria-describedby`.',
    },
    {
      kind: 'code',
      language: 'tsx',
      code: '<label htmlFor="password">Password</label>\n\n<input\n  id="password"\n  type="password"\n  aria-describedby="password-hint password-error"\n  aria-invalid={error !== undefined}\n/>\n\n<p id="password-hint">At least 12 characters.</p>\n\n{error !== undefined && (\n  <p id="password-error" className="field-error">{error}</p>\n)}',
    },
    {
      kind: 'paragraph',
      text: 'Line by line. `aria-describedby` takes a space-separated list of ids, so hint and error are both announced after the label. `aria-invalid` marks the field as failing, which is announced alongside it.',
    },
    {
      kind: 'paragraph',
      text: 'Referencing an id that is not currently rendered is harmless — it is simply skipped — so the attribute can list both without conditional logic.',
    },
    {
      kind: 'paragraph',
      text: 'Note what this gives for free: the error message is now connected to the field rather than floating near it, so it is announced when the field is reached rather than needing to be hunted for.',
    },
  ],
  firstPrinciples: [
    {
      kind: 'paragraph',
      text: 'A change that happens away from focus must be **announced**, or it is invisible to anyone not watching that part of the screen.',
    },
    {
      kind: 'code',
      language: 'tsx',
      code: '{/* Announced when its content changes, without taking focus. */}\n<div role="status" aria-live="polite">\n  {isSaving ? "Saving…" : savedAt !== null ? "All changes saved" : ""}\n</div>',
    },
    {
      kind: 'paragraph',
      text: '`aria-live="polite"` waits for a pause before announcing. `assertive` interrupts immediately and should be reserved for genuinely urgent messages — an assertive region that fires on every keystroke is unusable.',
    },
    {
      kind: 'paragraph',
      text: 'One implementation detail that catches everybody: the region must be in the DOM *before* its content changes. Rendering the element and its message at the same moment often announces nothing, because there was no region to observe.',
    },
    {
      kind: 'callout',
      tone: 'pitfall',
      body: 'A live region added and filled in one render is the commonest reason a status message never gets announced. Render the empty container, then change its text.',
    },
  ],
  designPerspective: [
    {
      kind: 'paragraph',
      text: 'The design question is when validation should speak.',
    },
    {
      kind: 'list',
      items: [
        'On submit — for anything requiring the whole form to make sense.',
        'On blur — for a single field, once the person has finished with it.',
        'On input — only to clear an error already shown, never to raise a new one.',
      ],
    },
    {
      kind: 'paragraph',
      text: 'That third rule is the one that makes a form feel considerate. Correcting a mistake should remove the complaint immediately; it should not generate a new complaint halfway through the correction.',
    },
  ],
  engineeringPerspective: [
    {
      kind: 'paragraph',
      text: 'The engineering question is where focus goes on a failed submit.',
    },
    {
      kind: 'paragraph',
      text: 'A summary at the top of the form, focused on failure, lets someone hear how many problems there are and jump to each. The alternative — focusing the first invalid field — is faster for one error and disorienting for five, because the shape of the problem is never conveyed.',
    },
  ],
  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'An error message is a piece of writing, a visual state and an announcement, and it has to work as all three.',
    },
    {
      kind: 'paragraph',
      text: '"Invalid input" fails as all three. "Password must be at least 12 characters" works as all three, which is why the Module 4 point about message quality was never only an editorial one.',
    },
  ],
  industryExamples: [
    {
      id: 'example-wai-forms-tutorial',
      source: 'W3C WAI',
      title: 'Forms, covered end to end',
      observation:
        'The WAI forms tutorial covers labels, instructions, grouping, validation and error handling as one connected topic.',
      takeaway:
        'The topics are connected because the failures are. A labelled field with an unannounced error is still a field people cannot complete.',
    },
    {
      id: 'example-field-level-form-errors',
      source: 'Common practice',
      title: 'Errors placed with the field',
      observation:
        'Payment forms commonly show each error adjacent to the field it concerns, with specific wording about what to correct.',
      takeaway:
        'Specific and adjacent serves everyone. The programmatic association is what extends it to people who cannot see the adjacency.',
    },
  ],
  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Build an accessible field component, so the details are handled once.',
    },
    {
      kind: 'code',
      language: 'tsx',
      code: 'type FieldProps = {\n  id: string;\n  label: string;\n  hint?: string;\n  error?: string;\n  children: (props: FieldChildProps) => React.ReactNode;\n};\n\nfunction Field({ id, label, hint, error, children }: FieldProps) {\n  const hintId = `${id}-hint`;\n  const errorId = `${id}-error`;\n\n  const describedBy = [hint !== undefined ? hintId : null, error !== undefined ? errorId : null]\n    .filter((value) => value !== null)\n    .join(" ");\n\n  return (\n    <div className="field">\n      <label htmlFor={id}>{label}</label>\n\n      {children({\n        id,\n        "aria-invalid": error !== undefined,\n        ...(describedBy !== "" ? { "aria-describedby": describedBy } : {}),\n      })}\n\n      {hint !== undefined && <p id={hintId} className="field-hint">{hint}</p>}\n      {error !== undefined && <p id={errorId} className="field-error">{error}</p>}\n    </div>\n  );\n}',
    },
    {
      kind: 'paragraph',
      text: 'The component passes the right attributes to whatever control the caller renders, which is why `children` is a function here rather than plain content — the caller needs the computed ids.',
    },
    {
      kind: 'paragraph',
      text: '`describedBy` is built from what is actually present and omitted entirely when empty, so no field carries an attribute pointing at nothing.',
    },
    {
      kind: 'paragraph',
      text: 'Now a label is structurally required and the error wiring cannot be forgotten — the Module 8 argument about putting the easy-to-get-wrong parts inside the component, applied to the thing most often got wrong.',
    },
  ],
  commonMistakes: [
    {
      id: 'mistake-09-03-placeholder-as-label',
      mistake: 'Using a placeholder instead of a label.',
      why: 'It vanishes on input, is usually low contrast, and is not a reliable accessible name.',
      instead: 'Use a real label. A floating label keeps the space saving without the cost.',
    },
    {
      id: 'mistake-09-03-unassociated-error',
      mistake: 'Rendering an error near the field without `aria-describedby`.',
      why: 'Visually it is obvious; programmatically it is unrelated text somewhere on the page.',
      instead: 'Point `aria-describedby` at the message and set `aria-invalid` on the field.',
    },
  ],
  professionalConsideration: [
    {
      kind: 'paragraph',
      text: 'Forms are where accessibility failures cost the most, because a form is usually the point of the product.',
    },
    {
      kind: 'paragraph',
      text: 'An inaccessible decorative animation is an annoyance. An inaccessible signup form means the person cannot become a customer. If accessibility effort has to be prioritised — and in practice it does — forms and the flows around them come first.',
    },
  ],
  practicalExercise: {
    id: 'exercise-accessible-forms-and-errors',
    title: 'Improve an existing form',
    prompt:
      'Take the form from your Module 4 project and make it fully accessible, then test it without a mouse.',
    steps: [
      'Associate every label with its field.',
      'Replace any placeholder-as-label.',
      'Attach hints and errors with `aria-describedby`, and set `aria-invalid`.',
      'Apply the three validation-timing rules, including clearing errors on input.',
      'Add a live region for save or submit status, rendered before it has content.',
      'Add an error summary focused on failed submit.',
      'Group related fields with `fieldset` and `legend`.',
      'Complete the form using only the keyboard, then with a screen reader.',
    ],
    successCriteria: [
      'Every field has an associated label.',
      'No placeholder is doing a label’s job.',
      'Errors are associated and the field is marked invalid.',
      'Errors clear on input and are never raised on input.',
      'A live region announces status and is present before it changes.',
      'The form is completable by keyboard alone.',
    ],
    estimatedMinutes: 75,
    hint: 'Turn on your operating system’s built-in screen reader — VoiceOver on macOS, Narrator on Windows — and tab through once. The first attempt is disorienting; do it anyway.',
  },
  reflectionQuestion:
    'Why is an error message placed next to a field not the same as an error message associated with it?',
  reflectionHint:
    'Visual proximity is a relationship only if you can see it.',
  resources: [
    {
      id: 'resource-wai-forms-tutorial',
      title: 'Forms Tutorial',
      url: 'https://www.w3.org/WAI/tutorials/forms/',
      type: 'documentation',
      author: 'W3C WAI',
      estimatedMinutes: 50,
      note: 'Labels, instructions, grouping, validation and errors. The reference for this lesson.',
    },
    {
      id: 'resource-webaim-forms',
      title: 'Creating Accessible Forms',
      url: 'https://webaim.org/techniques/forms/',
      type: 'article',
      author: 'WebAIM',
      estimatedMinutes: 30,
      note: 'Shorter and more practical. Good for the association mechanics specifically.',
    },
  ],
  competencyTags: ['accessibility', 'html', 'ux-reasoning', 'interface-state-modelling'],
  completionCriteria: [
    'Associates labels, hints and errors programmatically.',
    'Applies the three validation-timing rules.',
    'Announces status changes with a correctly rendered live region.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Lesson 44                                                                   */
/* -------------------------------------------------------------------------- */

const LESSON_4: Lesson = {
  id: 'lesson-the-accessibility-tree-and-aria',
  slug: 'the-accessibility-tree-and-aria',
  moduleId: MODULE_ID,
  lessonNumber: 4,
  title: 'The Accessibility Tree and ARIA',
  summary:
    'There are two trees. You have been styling one of them. This lesson is about the other, and about the attributes that edit it.',
  estimatedMinutes: 10,
  objectives: [
    'Explain the difference between the DOM and the accessibility tree.',
    'Inspect the accessibility tree in browser tools.',
    'Use role, name and state correctly.',
    'Explain why native HTML is preferable to ARIA.',
  ],
  prerequisiteConcepts: [
    'Semantic interfaces',
    'Accessible names',
    'Keyboard and focus',
  ],
  prerequisiteLessonIds: ['lesson-accessible-forms-and-errors'],
  recap: [
    {
      kind: 'paragraph',
      text: 'You have used `aria-label`, `aria-describedby`, `aria-invalid` and `aria-live` without a model of what they do. This lesson supplies it.',
    },
  ],
  priorKnowledge: [
    {
      kind: 'paragraph',
      text: 'You know the DOM: the tree of elements the browser builds from your HTML, which CSS styles and JavaScript reads. The browser builds a second tree alongside it.',
    },
  ],
  coreConcept: [
    {
      kind: 'paragraph',
      text: 'The **accessibility tree** is what assistive technology reads. It is derived from the DOM, but it is not the same shape.',
    },
    {
      kind: 'paragraph',
      text: 'Purely presentational wrappers collapse out of it. Hidden content is absent. Every node that survives carries three things:',
    },
    {
      kind: 'list',
      items: [
        '**Role** — what kind of thing it is. Button, link, heading, checkbox.',
        '**Name** — what it is called. The accessible name from lesson 41.',
        '**State** — what is currently true of it. Checked, expanded, disabled, invalid.',
      ],
    },
    {
      kind: 'paragraph',
      text: 'Role, name, state. A screen reader announcing "Delete project, button" is reading a name and a role; "Notifications, checkbox, checked" is reading all three.',
    },
  ],
  whyDesignersCare: [
    {
      kind: 'paragraph',
      text: 'Because the accessibility tree is the design, as heard.',
    },
    {
      kind: 'paragraph',
      text: 'Everything a sighted user gets from position, size, colour and iconography has to arrive through role, name and state for someone using a screen reader. A design that reads as a clear hierarchy visually and as a list of unnamed buttons in the tree has been built for one audience.',
    },
    {
      kind: 'paragraph',
      text: 'Reading your own interface in the accessibility tree is the most direct way to find out which one you built.',
    },
  ],
  howItWorks: [
    {
      kind: 'paragraph',
      text: 'The tree is inspectable, which makes this checkable rather than theoretical.',
    },
    {
      kind: 'list',
      ordered: true,
      items: [
        'Open browser developer tools and select an element.',
        'Find the Accessibility panel — in Chrome it sits beside Styles and Computed.',
        'Read the computed role, the computed name, and how the name was derived.',
        'Switch to the full accessibility tree view to see the page as assistive technology does.',
      ],
    },
    {
      kind: 'paragraph',
      text: 'The name derivation is the most useful part. It shows which source won — `aria-labelledby`, `aria-label`, content, label — which is how you discover that an `aria-label` you added is being overridden, or that a button’s name is coming from an icon’s filename.',
    },
    {
      kind: 'paragraph',
      text: 'ARIA attributes are edits to this tree. They change nothing else — not appearance, not behaviour, not keyboard operation.',
    },
    {
      kind: 'code',
      language: 'html',
      code: '<!-- Announced as a button. Still not focusable, still no key handling. -->\n<div role="button">Delete</div>',
    },
    {
      kind: 'paragraph',
      text: 'This is the single most important fact about ARIA. It makes a promise to the user, and leaves you to keep it.',
    },
  ],
  firstPrinciples: [
    {
      kind: 'paragraph',
      text: 'Hence the rule: **use native HTML first, and ARIA only where HTML has nothing**.',
    },
    {
      kind: 'paragraph',
      text: '`<button>` already has the role, the focusability and the key handling. `role="button"` has one of the three. Native elements come with their behaviour; ARIA is annotation.',
    },
    {
      kind: 'paragraph',
      text: 'What ARIA is genuinely for is the things HTML has no element for: `aria-expanded` on a disclosure trigger, `aria-live` on a status region, `role="tablist"` for a tab set, `aria-current` for the page you are on.',
    },
    {
      kind: 'code',
      language: 'tsx',
      code: '<button aria-expanded={isOpen} aria-controls="panel">\n  Details\n</button>\n\n<div id="panel" hidden={isOpen === false}>…</div>',
    },
    {
      kind: 'paragraph',
      text: '`aria-expanded` is real information with no HTML equivalent: the trigger announces whether the panel is open, so the state is available without exploring to find out. `aria-controls` says what it controls.',
    },
    {
      kind: 'callout',
      tone: 'insight',
      body: 'Incorrect ARIA is worse than none. A `role="checkbox"` that never updates `aria-checked` announces a state that is wrong — and a confident wrong answer is harder to work around than silence.',
    },
  ],
  designPerspective: [
    {
      kind: 'paragraph',
      text: 'The design question is which visual states have an announced equivalent.',
    },
    {
      kind: 'paragraph',
      text: 'Go through the states you designed in Module 1 lesson 4 and Module 8 lesson 38 and ask, for each, what the tree says. Selected should be `aria-selected` or `aria-current`. Expanded should be `aria-expanded`. Loading should be a live region. A state visible only in CSS is a state half the audience does not get.',
    },
  ],
  engineeringPerspective: [
    {
      kind: 'paragraph',
      text: 'The engineering question is whether the ARIA state tracks the real state.',
    },
    {
      kind: 'paragraph',
      text: 'The failure mode is divergence: `aria-expanded="false"` left behind on a panel that is open. The defence is to derive the attribute from the same state that drives the rendering — `aria-expanded={isOpen}` cannot drift, whereas setting it in a handler can.',
    },
  ],
  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'Role, name and state are a specification format, and a rather good one.',
    },
    {
      kind: 'paragraph',
      text: 'For any component you design, three questions: what kind of thing is it, what is it called, and what states can it be in? That is a complete behavioural spec, it is exactly what Module 5 lesson 25 asked you to write, and it is what the tree will be checked against.',
    },
  ],
  industryExamples: [
    {
      id: 'example-apg-patterns',
      source: 'W3C WAI',
      title: 'Patterns with their roles and states listed',
      observation:
        'The ARIA Authoring Practices Guide documents each pattern with its required roles, states, properties and keyboard behaviour.',
      takeaway:
        'For any component you are about to build, somebody has already written down what it must announce. Start there.',
    },
    {
      id: 'example-mdn-aria-reference',
      source: 'MDN',
      title: 'Attributes documented individually',
      observation:
        'MDN documents each ARIA role and attribute with its purpose, allowed values and the elements it applies to.',
      takeaway:
        'ARIA is a vocabulary to look up rather than memorise. Knowing the three categories — role, name, state — is enough to search effectively.',
    },
  ],
  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Inspect your Module 8 Dropdown in the accessibility tree.',
    },
    {
      kind: 'paragraph',
      text: 'Open the Accessibility panel and check four things in order.',
    },
    {
      kind: 'list',
      ordered: true,
      items: [
        'The trigger: does it have a role of button and a name describing what it opens?',
        'Is `aria-expanded` present, and does it change when the menu opens?',
        'The menu: does it have a role, and do its items have roles and names?',
        'The current selection: is it announced, or only shown with a tick?',
      ],
    },
    {
      kind: 'code',
      language: 'javascript',
      code: '// A quick console check for the commonest gap: controls with no name.\n[...document.querySelectorAll("button, a, input, select, textarea")]\n  .filter((el) => {\n    const label = el.getAttribute("aria-label") ?? el.textContent?.trim() ?? "";\n    return label === "" && el.getAttribute("aria-labelledby") === null;\n  })\n  .map((el) => el.outerHTML.slice(0, 120));',
    },
    {
      kind: 'paragraph',
      text: 'That finds unnamed controls quickly, but be clear about what it does not do: it is a text check, not the real name computation. A field named by a `<label for>` has no inline text and will appear here as a false positive. The Accessibility panel gives the authoritative answer; the snippet gives you a list to check.',
    },
  ],
  commonMistakes: [
    {
      id: 'mistake-09-04-aria-instead-of-html',
      mistake: 'Adding `role` to a `div` instead of using the element that has that role.',
      why: 'The role is announced but the behaviour is absent, so the element claims to be a button and does not act like one.',
      instead: 'Use the native element. Reach for a role only where HTML offers nothing.',
    },
    {
      id: 'mistake-09-04-stale-aria-state',
      mistake: 'Setting an ARIA state once and not keeping it current.',
      why: 'An announced state that disagrees with reality is actively misleading — worse than an unannounced one.',
      instead: 'Derive the attribute from the same state that drives the render, so they cannot diverge.',
    },
  ],
  professionalConsideration: [
    {
      kind: 'paragraph',
      text: 'Automated tools find roughly a third of accessibility problems, and that third is the easy third.',
    },
    {
      kind: 'paragraph',
      text: 'A missing alt attribute or a contrast failure is machine-detectable. Whether the focus order makes sense, whether an error message is comprehensible, whether a custom widget behaves as its role implies — none of these are. Run the tools, because the easy third is genuinely worth catching, and then use the keyboard and a screen reader for the rest.',
    },
  ],
  practicalExercise: {
    id: 'exercise-the-accessibility-tree-and-aria',
    title: 'Inspect the accessibility tree in browser tools',
    prompt:
      'Inspect the accessibility tree for three of your own components and record the role, name and state of every interactive element.',
    steps: [
      'Pick three components, at least one of them custom rather than native.',
      'For each interactive element, record its computed role and name, and how the name was derived.',
      'List every visual state and say what the tree reports for it.',
      'Find one state with no announced equivalent and add one.',
      'Find any ARIA attribute that does not track the real state, and derive it instead.',
      'Compare one custom component against its ARIA Authoring Practices pattern and list the gaps.',
      'Run the unnamed-control snippet and verify each hit in the Accessibility panel.',
    ],
    successCriteria: [
      'Role, name and state recorded for every interactive element.',
      'Name derivation noted, not guessed.',
      'One unannounced state is found and fixed.',
      'Any stale ARIA is derived from real state.',
      'The APG pattern comparison lists concrete gaps.',
    ],
    estimatedMinutes: 65,
    hint: 'The name derivation row is where the surprises are. More than one icon button turns out to be named after its SVG’s title.',
  },
  reflectionQuestion:
    'Why is incorrect ARIA worse than no ARIA at all?',
  reflectionHint:
    'Think about what the user does with the information in each case.',
  resources: [
    {
      id: 'resource-apg-patterns-reference',
      title: 'ARIA Authoring Practices Guide',
      url: 'https://www.w3.org/WAI/ARIA/apg/',
      type: 'documentation',
      author: 'W3C WAI',
      estimatedMinutes: 60,
      note: 'Patterns with required roles, states and keyboard behaviour. Check it before building any custom widget.',
    },
    {
      id: 'resource-mdn-accessibility-tree',
      title: 'Accessibility tree — MDN',
      url: 'https://developer.mozilla.org/en-US/docs/Glossary/Accessibility_tree',
      type: 'documentation',
      author: 'MDN',
      estimatedMinutes: 15,
      note: 'What the tree is and how it relates to the DOM. Short, and the right starting point.',
    },
  ],
  competencyTags: ['accessibility', 'browser-apis', 'html', 'design-qa'],
  completionCriteria: [
    'Can inspect and read the accessibility tree.',
    'Can state the role, name and state of any control they build.',
    'Prefers native HTML and can explain why.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Lesson 45                                                                   */
/* -------------------------------------------------------------------------- */

const LESSON_5: Lesson = {
  id: 'lesson-building-accessible-components',
  slug: 'building-accessible-components',
  moduleId: MODULE_ID,
  lessonNumber: 5,
  title: 'Building Accessible Components',
  summary:
    'Everything in this module at once, applied to one custom component — because accessibility is a property of a component, not a pass over a finished page.',
  estimatedMinutes: 10,
  objectives: [
    'Specify a component’s accessibility before building it.',
    'Combine semantics, keyboard, focus, state and announcement in one component.',
    'Audit a custom component against its published pattern.',
    'Repair a component without redesigning it.',
  ],
  prerequisiteConcepts: [
    'Everything in this module',
    'Composition, Module 8 lesson 39',
    'Component APIs, Module 8 lesson 37',
  ],
  prerequisiteLessonIds: ['lesson-the-accessibility-tree-and-aria'],
  recap: [
    {
      kind: 'paragraph',
      text: 'Four lessons of separate concerns: semantics, keyboard and focus, forms, and the tree. A real component needs all four at once.',
    },
  ],
  priorKnowledge: [
    {
      kind: 'paragraph',
      text: 'You have eight components from Module 8. Several of them replace native controls, and lesson 41 named the bill that comes with that. This lesson is where it gets paid.',
    },
  ],
  coreConcept: [
    {
      kind: 'paragraph',
      text: 'An accessible component has five properties, and they are easier to specify than to retrofit.',
    },
    {
      kind: 'list',
      ordered: true,
      items: [
        '**Semantics** — the right role, from a native element where one exists.',
        '**Name** — a reliable accessible name, structurally required where possible.',
        '**Keyboard** — every action reachable, following the pattern’s conventions.',
        '**Focus** — visible at all times, moved deliberately, restored after.',
        '**State** — every visual state with an announced equivalent that tracks it.',
      ],
    },
    {
      kind: 'paragraph',
      text: 'Written before implementation, this is a five-line specification. Discovered afterwards, it is a rewrite.',
    },
  ],
  whyDesignersCare: [
    {
      kind: 'paragraph',
      text: 'Because accessibility built into a component is paid for once and inherited everywhere.',
    },
    {
      kind: 'paragraph',
      text: 'If Dialog manages focus correctly, every dialog in the product does. If it does not, every one is wrong and the fix is a hundred call sites. This is the same leverage the Module 8 library gave for consistency, pointed at a different problem.',
    },
  ],
  howItWorks: [
    {
      kind: 'paragraph',
      text: 'The procedure for a custom component, in order.',
    },
    {
      kind: 'list',
      ordered: true,
      items: [
        'Find the pattern in the ARIA Authoring Practices Guide. Almost everything is there.',
        'Note the required roles, states and properties.',
        'Note the expected keyboard behaviour, which is the part most often invented.',
        'Build it, with the keyboard handling in the component.',
        'Inspect the tree and confirm role, name and state.',
        'Test with the keyboard only, then with a screen reader.',
      ],
    },
    {
      kind: 'paragraph',
      text: 'Step three is where most custom widgets fail. A dropdown is expected to respond to Arrow keys for navigation, Home and End for the ends, Enter to select, Escape to dismiss, and type-ahead to jump. Most hand-built dropdowns handle Enter and Escape and stop.',
    },
    {
      kind: 'code',
      language: 'tsx',
      code: 'function onKeyDown(event: React.KeyboardEvent) {\n  switch (event.key) {\n    case "ArrowDown":\n      event.preventDefault();\n      setActiveIndex((index) => Math.min(index + 1, options.length - 1));\n      break;\n    case "ArrowUp":\n      event.preventDefault();\n      setActiveIndex((index) => Math.max(index - 1, 0));\n      break;\n    case "Home":\n      event.preventDefault();\n      setActiveIndex(0);\n      break;\n    case "End":\n      event.preventDefault();\n      setActiveIndex(options.length - 1);\n      break;\n    case "Enter":\n    case " ":\n      event.preventDefault();\n      select(activeIndex);\n      break;\n    case "Escape":\n      close();\n      break;\n  }\n}',
    },
    {
      kind: 'paragraph',
      text: '`preventDefault` stops the browser’s own behaviour — Arrow keys scrolling the page, Space scrolling or submitting. Omit it and the menu navigates while the page moves underneath.',
    },
    {
      kind: 'paragraph',
      text: 'Note `setActiveIndex((index) => …)` rather than `setActiveIndex(activeIndex + 1)`. Held keys fire rapidly, and the snapshot rule from Module 7 lesson 34 means the direct form would read a stale index.',
    },
  ],
  firstPrinciples: [
    {
      kind: 'paragraph',
      text: 'Repair is a different skill from building, and more often what the job requires.',
    },
    {
      kind: 'paragraph',
      text: 'The constraint is that you may not change the design. Someone approved how it looks, people use it, and "make it accessible" does not authorise a redesign.',
    },
    {
      kind: 'list',
      items: [
        'Add semantics without changing the markup’s visual effect.',
        'Add names where there are none.',
        'Add keyboard handling for actions that are pointer-only.',
        'Add the focus style the design never specified.',
        'Add announced equivalents for the states that already exist visually.',
      ],
    },
    {
      kind: 'paragraph',
      text: 'The one case where repair legitimately requires a visual change is contrast. A 2:1 label cannot be fixed with an attribute, and that goes back to design — which is a conversation, not a patch.',
    },
  ],
  designPerspective: [
    {
      kind: 'paragraph',
      text: 'The design question is whether the accessible version is the same component.',
    },
    {
      kind: 'paragraph',
      text: 'A focus ring that was never designed will be added by someone, and if that is not you it will be the browser default, placed badly. Designing the focus state alongside hover and pressed is the difference between accessibility that looks intentional and accessibility that looks bolted on.',
    },
  ],
  engineeringPerspective: [
    {
      kind: 'paragraph',
      text: 'The engineering question is how this stays fixed.',
    },
    {
      kind: 'paragraph',
      text: 'A component repaired today regresses in three months when somebody adds a variant. The defences are tests that assert role and name, a documented keyboard contract, and a required `label` prop so the failure is a compile error rather than a silent omission. Module 13 covers testing properly; the point here is that the structural defences matter more than the one-off fix.',
    },
  ],
  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'The five properties are a component contract, and contracts are design artefacts.',
    },
    {
      kind: 'paragraph',
      text: 'Role, name, keyboard, focus, state — written into the Module 8 documentation page alongside the props table, they become something a reviewer can check. Accessibility recorded in a contract gets maintained; accessibility that exists only in an implementation gets lost in the next refactor.',
    },
  ],
  industryExamples: [
    {
      id: 'example-inclusive-components-patterns',
      source: 'Inclusive Components',
      title: 'Components rebuilt from first principles',
      observation:
        'Inclusive Components works through common interface components, examining the accessibility consequences of each design decision.',
      takeaway:
        'The reasoning is the value. Each article shows a decision being made rather than a rule being applied.',
    },
    {
      id: 'example-radix-accessibility-as-feature',
      source: 'Radix',
      title: 'Accessibility as the product',
      observation:
        'Radix primitives are offered specifically for their keyboard handling, focus management and ARIA semantics, with styling left out.',
      takeaway:
        'An entire library exists because this part is hard and worth getting right once. Using one is a reasonable professional choice — after you understand what it is doing.',
    },
  ],
  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Audit the Module 8 Tooltip, which is the one most likely to be wrong.',
    },
    {
      kind: 'paragraph',
      text: 'Tooltips fail in a characteristic way: they appear on hover, which keyboard users cannot do, and they are rendered as unrelated text, which screen readers do not connect to the control.',
    },
    {
      kind: 'list',
      ordered: true,
      items: [
        'Does it appear on focus as well as hover? If not, it is pointer-only.',
        'Is its content associated with the trigger by `aria-describedby`?',
        'Does Escape dismiss it while leaving focus where it was?',
        'Does it stay visible long enough to read, and while the pointer is over it?',
        'Does it contain anything interactive? If so, it is not a tooltip, and the pattern is wrong.',
      ],
    },
    {
      kind: 'code',
      language: 'tsx',
      code: 'function Tooltip({ id, content, children }: TooltipProps) {\n  const [isVisible, setIsVisible] = useState(false);\n\n  return (\n    <span className="tooltip-wrapper">\n      {cloneElement(children, {\n        "aria-describedby": isVisible ? id : undefined,\n        onMouseEnter: () => setIsVisible(true),\n        onMouseLeave: () => setIsVisible(false),\n        onFocus: () => setIsVisible(true),\n        onBlur: () => setIsVisible(false),\n      })}\n\n      {isVisible && (\n        <span role="tooltip" id={id} className="tooltip">\n          {content}\n        </span>\n      )}\n    </span>\n  );\n}',
    },
    {
      kind: 'paragraph',
      text: '`onFocus` and `onBlur` alongside the mouse handlers is the whole fix for keyboard reachability — two lines, routinely missing.',
    },
    {
      kind: 'paragraph',
      text: 'The honest caveat: this version still has no Escape handling and no delay before hiding, so a pointer travelling to the tooltip dismisses it. Both are worth adding, and both are the kind of detail that is invisible until someone tries to use it.',
    },
  ],
  commonMistakes: [
    {
      id: 'mistake-09-05-hover-only',
      mistake: 'Revealing content on hover with no focus equivalent.',
      why: 'Keyboard users cannot hover, and touch users have no hover either. The content is unreachable for both.',
      instead: 'Every hover reveal needs a focus equivalent. Two handlers, added at the same time.',
    },
    {
      id: 'mistake-09-05-accessibility-at-the-end',
      mistake: 'Treating accessibility as a pass over finished components.',
      why: 'By then the markup structure and the interaction model are settled, and fixing them means rebuilding rather than adjusting.',
      instead:
        'Write the five-property specification before building. It takes two minutes and prevents the rewrite.',
    },
  ],
  professionalConsideration: [
    {
      kind: 'paragraph',
      text: 'Using a well-tested primitive for complex widgets is usually the right professional call.',
    },
    {
      kind: 'paragraph',
      text: 'A combobox with type-ahead, virtual focus and correct announcement is weeks of work and is already solved. Building a few by hand, as this module asks, is how you learn to judge whether a library is doing it correctly — which you then need, because choosing a library is itself a decision with accessibility consequences.',
    },
  ],
  practicalExercise: {
    id: 'exercise-building-accessible-components',
    title: 'Audit and repair one custom component',
    prompt:
      'Take the least accessible component from your Module 8 library and repair it, without changing its design.',
    steps: [
      'Choose a custom component replacing something native — Dropdown or Tooltip are good candidates.',
      'Find its ARIA Authoring Practices pattern and list the required roles, states and keyboard behaviour.',
      'Audit the current version against that list and record every gap.',
      'Write the five-property specification for what it should be.',
      'Repair it, changing no visual design except contrast failures.',
      'Verify role, name and state in the accessibility tree.',
      'Test with the keyboard only, then with a screen reader.',
      'Write the keyboard contract into your documentation page.',
    ],
    successCriteria: [
      'The APG pattern is identified and its requirements listed.',
      'Every gap is recorded before repair.',
      'The five-property specification is written.',
      'The design is unchanged except for justified contrast fixes.',
      'Every action is reachable by keyboard following the pattern’s conventions.',
      'The keyboard contract is documented.',
    ],
    estimatedMinutes: 85,
    hint: 'Doing the audit before any repair matters. Fixing as you go means you never find out how many problems there were, and the list is the part worth keeping.',
  },
  reflectionQuestion:
    'Why is accessibility cheaper to build into a component than to add to a page?',
  reflectionHint:
    'Count how many places each is paid for, and what has already been built on top by the time you get there.',
  resources: [
    {
      id: 'resource-inclusive-components',
      title: 'Inclusive Components',
      url: 'https://inclusive-components.design/',
      type: 'article',
      author: 'Heydon Pickering',
      estimatedMinutes: 90,
      note: 'Components rebuilt with the accessibility reasoning shown. Read the ones matching your library.',
    },
    {
      id: 'resource-webaim-screenreader',
      title: 'Using Screen Readers to Evaluate Accessibility',
      url: 'https://webaim.org/techniques/screenreader/',
      type: 'article',
      author: 'WebAIM',
      estimatedMinutes: 30,
      note: 'How to actually test. Read it before your first attempt, which will otherwise be bewildering.',
    },
  ],
  competencyTags: ['accessibility', 'component-architecture', 'interaction-engineering', 'design-qa', 'react'],
  completionCriteria: [
    'Specifies a component’s accessibility before building it.',
    'Can audit a custom component against its published pattern.',
    'Can repair a component without redesigning it.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Project                                                                     */
/* -------------------------------------------------------------------------- */

const PROJECT: ModuleProject = {
  id: 'project-accessible-signup-and-account-experience',
  slug: 'accessible-signup-and-account-experience',
  moduleId: MODULE_ID,
  title: 'Accessible Signup and Account Experience',
  brief:
    'Build a complete signup and account flow that is fully usable by keyboard and screen reader: semantic structure, managed focus, associated validation, announced results, and responsive from 320px.',
  learnerGoal:
    'Ship a real flow you have verified with a screen reader, and know from experience what that verification finds.',
  problem:
    'Signup is where accessibility failures cost most, because it is the gate to the product. It also contains every hard case in one flow: a multi-field form, validation, a dialog, an async submission, and a success state that happens away from focus.',
  prerequisiteLessonIds: [
    'lesson-semantic-interfaces',
    'lesson-keyboard-and-focus',
    'lesson-accessible-forms-and-errors',
    'lesson-the-accessibility-tree-and-aria',
    'lesson-building-accessible-components',
  ],
  objectives: [
    'Build a flow that is completable without a pointer.',
    'Manage focus across navigation, dialogs and submission.',
    'Associate every label, hint and error with its field.',
    'Announce every state change that happens away from focus.',
  ],
  requirements: [
    'A signup form and an account settings screen.',
    'Semantic structure: one `h1` per page, no skipped levels, labelled landmarks.',
    'Every field with an associated label, and no placeholder doing a label’s job.',
    'Validation following the three timing rules, with errors associated and fields marked invalid.',
    'An error summary focused on failed submit.',
    'A confirmation dialog for one destructive action, with focus trapped and restored.',
    'Live regions for submitting, saved and failed, rendered before their content changes.',
    'Responsive from 320px upwards, with the keyboard order unaffected by layout.',
    'A written accessibility test report.',
  ],
  constraints: [
    'No accessibility library. The point is to build and verify it yourself.',
    'No `outline: none` without a designed replacement.',
    'No state visible only in CSS.',
    'No visual redesign used to avoid an accessibility problem — fix the implementation.',
  ],
  suggestedScope:
    'Two screens and one dialog, done thoroughly. Roughly twenty-five to thirty-five hours, of which several are testing rather than building. Finished when you have completed the whole flow with a screen reader and fixed what that found.',
  deliverables: [
    'The working flow.',
    'A test report: keyboard pass, screen reader pass, automated tool output, and what each found.',
    'The five-property specification for every custom component used.',
    'A note on anything you could not fix and why.',
  ],
  completionCriteria: [
    'The entire flow is completable using only the keyboard.',
    'The entire flow is completable using a screen reader.',
    'Focus is visible at every stop and never lost after an action.',
    'Every field has an associated label; every error is associated and announced.',
    'The heading outline describes each page.',
    'The layout works from 320px with the keyboard order intact.',
    'The test report records what each method found.',
  ],
  portfolioEvidence: [
    'Accessibility competence — verified by testing, not asserted.',
    'Focus management — correct across a form, a dialog and an async submission.',
    'Form craft — association, timing and announcement all handled.',
    'Professional practice — a test report, with unfixed items declared.',
  ],
  reflectionQuestion:
    'What did the screen reader find that the keyboard test and the automated tools both missed?',
  estimatedHours: 30,
  competencies: [
    'accessibility',
    'html',
    'css',
    'react',
    'component-architecture',
    'interaction-engineering',
    'design-qa',
    'responsive-design',
    'ux-reasoning',
  ],
  stretchGoals: [
    'Add a skip link to main content and verify it works from a cold page load.',
    'Test with a second screen reader and record where the two disagree.',
    'Add tests asserting the role and accessible name of every control in the flow.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Module                                                                      */
/* -------------------------------------------------------------------------- */

export const MODULE_09: CurriculumModule = {
  id: MODULE_ID,
  slug: 'accessibility-for-design-engineers',
  moduleNumber: 9,
  phase: 'systems',
  title: 'Accessibility for Design Engineers',
  description:
    'HTML revisited at depth, now that you have components to apply it to. Semantics, keyboard and focus, forms and errors, the accessibility tree, and building the whole thing into a component rather than auditing it afterwards.',
  outcome:
    'Can build and verify components that are usable by keyboard and screen reader, and can repair an inaccessible one without redesigning it.',
  prerequisites: [
    'Module 3 — HTML structure and semantics',
    'Module 4 — events and form validation',
    'Module 8 — component architecture and composition',
  ],
  lessons: [LESSON_1, LESSON_2, LESSON_3, LESSON_4, LESSON_5],
  resources: [
    {
      id: 'resource-module-09-apg',
      title: 'ARIA Authoring Practices Guide',
      url: 'https://www.w3.org/WAI/ARIA/apg/',
      type: 'documentation',
      author: 'W3C WAI',
      estimatedMinutes: 150,
      note: 'The primary reference for this module. Patterns with roles, states and keyboard behaviour specified.',
    },
    {
      id: 'resource-module-09-wcag-quickref',
      title: 'How to Meet WCAG (Quick Reference)',
      url: 'https://www.w3.org/WAI/WCAG22/quickref/',
      type: 'documentation',
      author: 'W3C WAI',
      estimatedMinutes: 60,
      note: 'The success criteria, filterable. Use it to check a specific question rather than to read through.',
    },
    {
      id: 'resource-module-09-webaim',
      title: 'WebAIM Articles and Techniques',
      url: 'https://webaim.org/techniques/',
      type: 'article',
      author: 'WebAIM',
      estimatedMinutes: 90,
      note: 'Practical, short and reliable. The keyboard, forms and screen reader pages are the ones to read first.',
    },
    {
      id: 'resource-module-09-wai-perspective-videos',
      title: 'Web Accessibility Perspectives',
      url: 'https://www.w3.org/WAI/perspective-videos/',
      type: 'video',
      author: 'W3C WAI',
      estimatedMinutes: 30,
      note: 'Short videos showing who each requirement is for. Worth watching before the module rather than after.',
    },
    {
      id: 'resource-module-09-webaim-million',
      title: 'The WebAIM Million',
      url: 'https://webaim.org/projects/million/',
      type: 'article',
      author: 'WebAIM',
      estimatedMinutes: 30,
      note: 'An annual survey of the most common failures across a million pages. Sobering, and useful for prioritising.',
    },
  ],
  project: PROJECT,
  competencies: [
    'accessibility',
    'html',
    'css',
    'ux-reasoning',
    'component-architecture',
    'interaction-engineering',
    'browser-apis',
    'design-qa',
    'interface-state-modelling',
    'react',
    'responsive-design',
  ],
  completionCriteria: [
    'All five lessons completed.',
    'Module project marked completed.',
    'Can build and verify an accessible component rather than assuming one.',
  ],
};
