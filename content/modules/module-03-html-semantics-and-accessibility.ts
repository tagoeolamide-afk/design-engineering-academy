/**
 * Module 03 — HTML, Semantics and Accessibility.
 *
 * The browser is already an interaction and accessibility platform. This module
 * is about using what it provides before building over it.
 */

import type { CurriculumModule, Lesson, ModuleProject } from '@/types/curriculum';

const MODULE_ID = 'module-03';

/* -------------------------------------------------------------------------- */
/* Lesson 11                                                                   */
/* -------------------------------------------------------------------------- */

const LESSON_11: Lesson = {
  id: 'lesson-03-01',
  slug: 'html-represents-meaning',
  moduleId: MODULE_ID,
  lessonNumber: 1,
  title: 'HTML Represents Meaning',
  summary:
    'HTML describes what something is, not what it looks like. Choosing elements by meaning is what makes a document navigable by anything other than eyes.',
  estimatedMinutes: 8,

  objectives: [
    'Choose elements by meaning rather than by default appearance.',
    'Structure a document with headings and landmark regions.',
    'Distinguish links from buttons by what they do.',
    'Recognise what structure a div discards.',
  ],

  prerequisiteConcepts: ['Visual hierarchy', 'Interfaces as state systems'],
  prerequisiteLessonIds: ['lesson-02-01'],

  recap: [
    {
      kind: 'paragraph',
      text: 'Module 2 built the visual system. This module goes underneath it, to the structure the browser actually receives.',
    },
  ],

  coreConcept: [
    {
      kind: 'paragraph',
      text: 'Every HTML element carries a meaning, and that meaning is consumed by software that never sees your design: screen readers, search indexes, reader modes, translation tools, and the browser\'s own behaviour.',
    },
    {
      kind: 'paragraph',
      text: 'A div means nothing. That is not a criticism — it is its purpose. It is a grouping box with no semantics, which makes it correct for layout and wrong for anything a user needs to understand.',
    },
    {
      kind: 'list',
      items: [
        'Headings form an outline. A screen reader user can jump between them, which is how they skim.',
        'Landmarks — header, nav, main, aside, footer — let the same user skip directly to a region.',
        'Lists announce their length. "List, seven items" is information a sighted user gets from the shape.',
        'Buttons and links behave differently, and both are keyboard operable without any work from you.',
      ],
    },
    {
      kind: 'callout',
      tone: 'insight',
      body: 'Semantic HTML is not an accessibility add-on. It is the structure; accessibility is what you get when the structure is honest.',
    },
  ],

  firstPrinciples: [
    {
      kind: 'paragraph',
      text: 'A visual interface communicates structure through position, size, and proximity. None of that survives being read aloud, flattened into a reading order, or rendered by a tool you did not anticipate.',
    },
    {
      kind: 'paragraph',
      text: 'Markup is the only channel where structure is stated rather than implied. If a heading is a styled div, the outline does not exist — not because assistive technology is limited, but because nothing in the document said it was a heading.',
    },
  ],

  designPerspective: [
    {
      kind: 'paragraph',
      text: 'The design decision that matters most here is link versus button, and it is a product question before it is a technical one. A link changes where you are. A button changes something. "Download invoice" navigates; "Archive project" acts.',
    },
    {
      kind: 'paragraph',
      text: 'The user-visible consequences are real: links can be opened in a new tab, copied, and bookmarked; buttons cannot. Styling a link to look like a button is fine. Making a button do navigation is not, because you have removed capabilities the user expects.',
    },
  ],

  engineeringPerspective: [
    {
      kind: 'paragraph',
      text: 'Heading level expresses position in the outline, not size. A page has one h1 — what the page is about — and levels nest without skipping.',
    },
    {
      kind: 'code',
      language: 'html',
      caption: 'Structure first; appearance is a separate decision.',
      code: `<main>
  <h1>Billing</h1>

  <section aria-labelledby="plan-heading">
    <h2 id="plan-heading">Current plan</h2>
    <p>You are on the Team plan.</p>
  </section>

  <section aria-labelledby="invoices-heading">
    <h2 id="invoices-heading">Invoices</h2>
    <ul>
      <li><a href="/invoices/1024">Invoice 1024</a></li>
    </ul>
  </section>
</main>`,
    },
    {
      kind: 'paragraph',
      text: 'Writing the document before any styling is a useful discipline: if the unstyled page is comprehensible top to bottom, the structure is sound. If it is not, no amount of CSS will fix what is missing.',
    },
  ],

  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'Visual hierarchy and document outline are two renderings of one decision about importance. When they agree, the product is the same product for everyone. When they diverge, sighted and non-sighted users receive different information architectures.',
    },
    {
      kind: 'paragraph',
      text: 'This is why a design engineer decides heading levels alongside type styles rather than after them. The level comes from meaning; the style comes from the scale; they are chosen at the same moment and can differ.',
    },
  ],

  industryExamples: [
    {
      id: 'example-mdn-structure',
      source: 'MDN',
      title: 'Documentation built on a real outline',
      observation:
        'MDN pages use a strict heading hierarchy and landmark regions, which is why in-page navigation, reader modes, and assistive technology all work without special handling.',
      takeaway:
        'A correct outline gives several features for free that would each be expensive to build over a div-based document.',
    },
    {
      id: 'example-reader-mode',
      source: 'Browser reader modes',
      title: 'Structure consumed by software you did not plan for',
      observation:
        'Reader mode extracts main content by reading semantics. Pages built from generic containers either fail to trigger it or produce garbage.',
      takeaway:
        'Semantics are consumed by more tools than you will ever test against. Honest markup is the only way to serve them.',
    },
  ],

  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Rebuilding a marketing page as a document, before any CSS.',
    },
    { kind: 'heading', text: '1. Write the outline in headings' },
    {
      kind: 'paragraph',
      text: 'One h1 naming the page. h2 for each major section. Nest only where the content genuinely nests.',
    },
    { kind: 'heading', text: '2. Add the landmarks' },
    {
      kind: 'paragraph',
      text: 'header, nav, main, footer. One main per page. Label a landmark when more than one of a kind exists.',
    },
    { kind: 'heading', text: '3. Use the right element for each thing' },
    {
      kind: 'paragraph',
      text: 'Lists for lists, including navigation. Links for navigation. Buttons for actions. figure and figcaption for an image with a caption.',
    },
    { kind: 'heading', text: '4. Read it with styles off' },
    {
      kind: 'paragraph',
      text: 'Disable CSS and read top to bottom. Anything that becomes confusing was being explained by the visual design alone.',
    },
  ],

  commonMistakes: [
    {
      id: 'mistake-div-everything',
      mistake: 'Building the page from divs and adding roles later.',
      why: 'ARIA roles re-declare what a correct element already provides, and they do not bring the behaviour with them.',
      instead: 'Pick the element that already means what you need. Reach for ARIA only when nothing does.',
    },
    {
      id: 'mistake-heading-by-size',
      mistake: 'Choosing heading level by how large it should look.',
      why: 'It produces an outline with skipped or repeated levels, which breaks skimming for anyone navigating by structure.',
      instead: 'Level from meaning, size from the type scale.',
    },
    {
      id: 'mistake-button-navigation',
      mistake: 'Using a button to navigate.',
      why: 'The user loses open-in-new-tab, copy link, and bookmarking, and the browser loses history semantics.',
      instead: 'If it changes location, it is a link — style it however you like.',
    },
    {
      id: 'mistake-multiple-main',
      mistake: 'More than one main landmark, or none.',
      why: 'Skip-to-content depends on there being exactly one primary region.',
      instead: 'One main per page, wrapping the content that is unique to it.',
    },
  ],

  eliteConsiderations: [
    {
      kind: 'list',
      items: [
        'Label repeated landmarks — two navs need distinguishing names, or "navigation" appears twice with no way to tell them apart.',
        'Use ordered lists where order carries meaning, and unordered where it does not; the distinction is announced.',
        'Prefer a real element over a role in every case where one exists. The element brings behaviour; the role only brings a label.',
        'Check the outline with a heading-map tool rather than assuming it is right.',
      ],
    },
  ],

  practicalExercise: {
    id: 'exercise-03-01',
    title: 'Rebuild a marketing page semantically',
    prompt:
      'Rebuild a marketing page using semantic HTML, writing the entire document before applying any styling.',
    steps: [
      'Write the heading outline first, as text, before any markup.',
      'Build the document with landmarks, headings, lists, links, and buttons.',
      'Do not add a single line of CSS until the document is complete.',
      'Read the unstyled page top to bottom and note anything unclear.',
      'Inspect the heading outline with a browser tool and fix any skipped levels.',
      'Identify every interactive element and state whether it navigates or acts.',
    ],
    successCriteria: [
      'Exactly one h1 and no skipped heading levels.',
      'header, nav, main, and footer are present, with repeated landmarks labelled.',
      'Every navigational element is a link and every action is a button.',
      'The unstyled document is comprehensible without explanation.',
      'No ARIA role duplicates something a native element already provides.',
    ],
    estimatedMinutes: 35,
    hint: 'Do not write any CSS until the document reads correctly with styles disabled. That constraint is the whole exercise.',
  },

  reflectionQuestion: 'When should something be a link instead of a button?',
  reflectionHint:
    'Ask whether the action changes location. Then ask what capabilities the user loses if you get it wrong.',

  resources: [
    {
      id: 'resource-mdn-html',
      title: 'MDN: HTML elements reference',
      url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element',
      type: 'documentation',
      estimatedMinutes: 45,
      note: 'What each element means, and what behaviour it carries.',
    },
    {
      id: 'resource-html-sections',
      title: 'MDN: document and website structure',
      url: 'https://developer.mozilla.org/en-US/docs/Learn/HTML/Introduction_to_HTML/Document_and_website_structure',
      type: 'documentation',
      estimatedMinutes: 25,
      note: 'Landmarks and outlines explained with worked examples.',
    },
  ],

  competencyTags: ['accessibility', 'html', 'design-to-code-translation'],

  completionCriteria: [
    'Has produced a page that is comprehensible with CSS disabled.',
    'Heading outline has one h1 and no skipped levels.',
    'Can state the link/button rule and its consequences.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Lesson 12                                                                   */
/* -------------------------------------------------------------------------- */

const LESSON_12: Lesson = {
  id: 'lesson-03-02',
  slug: 'native-controls',
  moduleId: MODULE_ID,
  lessonNumber: 2,
  title: 'Native Controls',
  summary:
    'Native form controls carry a large amount of behaviour you would otherwise have to write, test, and maintain. Replacing one means adopting its whole specification.',
  estimatedMinutes: 8,

  objectives: [
    'Enumerate the behaviour a native control provides.',
    'Build a form that works before any JavaScript runs.',
    'Judge the real cost of replacing a native control.',
    'Recognise where native controls genuinely fall short.',
  ],

  prerequisiteConcepts: ['Semantic HTML', 'Affordances and conventions'],
  prerequisiteLessonIds: ['lesson-03-01', 'lesson-01-03'],

  recap: [
    {
      kind: 'paragraph',
      text: 'You chose elements by meaning. Form controls are where that choice also buys a large amount of behaviour.',
    },
  ],

  coreConcept: [
    {
      kind: 'paragraph',
      text: 'A native control is not a styled box. It is a bundle of behaviour that has been specified, implemented by several browser vendors, and tested against assistive technology for decades.',
    },
    {
      kind: 'paragraph',
      text: 'A single select element brings: keyboard opening, arrow navigation, type-ahead matching, Escape to close, form participation, a correct accessible name and role, a platform picker on touch devices, and integration with autofill. None of that is visible in a screenshot.',
    },
    {
      kind: 'callout',
      tone: 'warning',
      body: 'When you replace a native control you inherit its entire specification as work. That is sometimes correct. It is never free.',
    },
  ],

  firstPrinciples: [
    {
      kind: 'paragraph',
      text: 'The browser is a runtime with an accessibility platform built in. Every native control is an agreement between the page and that platform about what this thing is and how it behaves.',
    },
    {
      kind: 'paragraph',
      text: 'A custom control breaks that agreement and then has to re-establish it by hand, through roles, states, and keyboard handling. The re-established version is almost always less complete, because the original was specified rather than improvised.',
    },
  ],

  designPerspective: [
    {
      kind: 'paragraph',
      text: 'The usual reason for replacing a native control is appearance, and much of that is now unnecessary. Checkboxes, radios, and range inputs accept accent-color; most controls can be styled substantially without being rebuilt.',
    },
    {
      kind: 'paragraph',
      text: 'Where native genuinely falls short is in richer requirements: multi-select with search, options that need icons or two lines of text, or a combobox that filters as you type. Those are legitimate cases — and they come with a specification to implement, not just a stylesheet.',
    },
  ],

  engineeringPerspective: [
    {
      kind: 'paragraph',
      text: 'A form should work before your JavaScript does. That is not nostalgia: script fails, loads late, and errors, and a form that submits without it is one that still works when something goes wrong.',
    },
    {
      kind: 'code',
      language: 'html',
      caption: 'Labels bound, types meaningful, submission native.',
      code: `<form method="post" action="/signup">
  <label for="email">Email</label>
  <input id="email" name="email" type="email" required
         autocomplete="email" />

  <label for="plan">Plan</label>
  <select id="plan" name="plan">
    <option value="team">Team</option>
    <option value="pro">Pro</option>
  </select>

  <button type="submit">Create account</button>
</form>`,
    },
    {
      kind: 'paragraph',
      text: 'Binding a label by id is not decoration: it gives the control an accessible name and makes the label a hit target. Input type carries a keyboard on mobile and validation semantics. Autocomplete lets the browser fill it correctly.',
    },
  ],

  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'This is the clearest case in the course where the accessible choice, the cheap choice, and the familiar choice are the same choice. Using the platform control satisfies all three simultaneously.',
    },
    {
      kind: 'paragraph',
      text: 'When a design does require a custom control, the honest conversation is about cost: the keyboard model, the roles and states, the focus behaviour, and the testing. That conversation is much easier when both people know what is being given up.',
    },
  ],

  industryExamples: [
    {
      id: 'example-mobile-select',
      source: 'Mobile browsers',
      title: 'One element, several platform-appropriate renderings',
      observation:
        'A native select renders as a wheel, a sheet, or a dropdown depending on platform, all from the same markup.',
      takeaway:
        'The platform adapts for you. A custom dropdown renders the same everywhere, which is usually worse.',
    },
    {
      id: 'example-aria-apg-combobox',
      source: 'WAI-ARIA Authoring Practices',
      title: 'The size of a custom control specification',
      observation:
        'The APG combobox pattern runs to a detailed keyboard model, a set of roles and states, and several behavioural requirements.',
      takeaway:
        'That document is the true cost of a custom dropdown. Read it before deciding.',
    },
  ],

  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Building a form with native controls and auditing what you got.',
    },
    { kind: 'heading', text: '1. Build it without script' },
    {
      kind: 'paragraph',
      text: 'Labels bound by id, meaningful input types, autocomplete attributes, a real submit button, and a form that posts.',
    },
    { kind: 'heading', text: '2. Operate it entirely by keyboard' },
    {
      kind: 'paragraph',
      text: 'Tab through every field. Open the select with the keyboard and type the first letters of an option. Submit with Enter from inside a text field. Record what worked without you writing anything.',
    },
    { kind: 'heading', text: '3. Check the accessibility tree' },
    {
      kind: 'paragraph',
      text: 'Every control should have a name, a role, and a value. If a name is missing, the label binding is wrong.',
    },
    { kind: 'heading', text: '4. Then style' },
    {
      kind: 'paragraph',
      text: 'Style what you can with CSS. Only where styling genuinely cannot reach should replacement be considered, and then the APG pattern is the specification.',
    },
  ],

  commonMistakes: [
    {
      id: 'mistake-placeholder-as-label',
      mistake: 'Using a placeholder instead of a label.',
      why: 'It disappears on focus, fails contrast requirements, and leaves the field unnamed for assistive technology.',
      instead: 'Always provide a real label. Hide it visually if the design demands it.',
    },
    {
      id: 'mistake-div-controls',
      mistake: 'Rebuilding a control as divs for styling reasons.',
      why: 'You lose keyboard operation, form participation, and the accessible name, and must rebuild all of it.',
      instead: 'Style the native control first; replace only when the requirement is genuinely beyond it.',
    },
    {
      id: 'mistake-no-form-element',
      mistake: 'Handling submission entirely in script with no form element.',
      why: 'Enter-to-submit stops working, autofill degrades, and nothing works if the script fails.',
      instead: 'Use a form with a submit button, and enhance it.',
    },
    {
      id: 'mistake-missing-autocomplete',
      mistake: 'Omitting autocomplete attributes.',
      why: 'Users retype information the browser already holds, which is slow and error-prone — particularly for anyone with a motor impairment.',
      instead: 'Add the correct autocomplete token to every field that holds known personal data.',
    },
  ],

  eliteConsiderations: [
    {
      kind: 'list',
      items: [
        'Test with autofill actually enabled; it exposes naming mistakes immediately.',
        'Check input type on a real phone — type="email" and type="tel" change the keyboard, which is a significant usability difference.',
        'If you must build a custom control, implement the APG keyboard model completely before styling anything.',
        'Keep native validation attributes even when you add your own messaging; they are a free second layer.',
      ],
    },
  ],

  practicalExercise: {
    id: 'exercise-03-02',
    title: 'Build a native form and audit its behaviour',
    prompt:
      'Build a form using only native controls, then inspect exactly what behaviour you received for free.',
    steps: [
      'Build a form with a text input, an email input, a select, a checkbox, a radio group, and a textarea.',
      'Bind every label by id and add appropriate autocomplete attributes.',
      'Write no JavaScript at all.',
      'Operate the entire form by keyboard and record every behaviour you did not implement.',
      'Open the accessibility tree and confirm every control has a name, role, and value.',
      'Pick one control and list what you would have to build to replace it.',
    ],
    successCriteria: [
      'The form is fully operable by keyboard with no script.',
      'Every control has an accessible name from a real label.',
      'A written list of inherited behaviours contains at least eight items.',
      'The replacement cost of one control is enumerated concretely.',
      'Autocomplete attributes are present and correct.',
    ],
    estimatedMinutes: 30,
    hint: 'Try type-ahead in the select — start typing an option name while it is focused. That single behaviour is one people forget when rebuilding it.',
  },

  reflectionQuestion: 'When is replacing a native control worth the cost?',
  reflectionHint:
    'Count the behaviours you inherit for free, then count what the design actually requires that native cannot do. Compare the two lists.',

  resources: [
    {
      id: 'resource-mdn-forms',
      title: 'MDN: HTML forms guide',
      url: 'https://developer.mozilla.org/en-US/docs/Learn/Forms',
      type: 'documentation',
      estimatedMinutes: 50,
      note: 'What each control does, and how far styling can go before replacement.',
    },
    {
      id: 'resource-apg-combobox',
      title: 'ARIA Authoring Practices: combobox',
      url: 'https://www.w3.org/WAI/ARIA/apg/patterns/combobox/',
      type: 'specification',
      estimatedMinutes: 30,
      note: 'The true specification of a custom dropdown. Read before committing to one.',
    },
  ],

  competencyTags: ['interaction-design', 'accessibility', 'html', 'browser-apis'],

  completionCriteria: [
    'Has built a working form with no JavaScript.',
    'Can enumerate at least eight behaviours inherited from native controls.',
    'Can state the replacement cost of a specific control.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Lesson 13                                                                   */
/* -------------------------------------------------------------------------- */

const LESSON_13: Lesson = {
  id: 'lesson-03-03',
  slug: 'keyboard-and-focus',
  moduleId: MODULE_ID,
  lessonNumber: 3,
  title: 'Keyboard and Focus',
  summary:
    'Focus is the keyboard user\'s cursor. Where it is, where it goes, and where it returns to are design decisions with correct answers.',
  estimatedMinutes: 9,

  objectives: [
    'Reason about tab order as a consequence of document order.',
    'Manage focus deliberately when the interface changes.',
    'Implement a focus trap correctly and know when one is required.',
    'Decide where focus returns after a transient region closes.',
  ],

  prerequisiteConcepts: ['Semantic HTML', 'Native control behaviour'],
  prerequisiteLessonIds: ['lesson-03-01', 'lesson-03-02'],

  recap: [
    {
      kind: 'paragraph',
      text: 'Native controls gave you keyboard operation for free. This lesson is about what happens when the interface changes underneath the keyboard.',
    },
  ],

  coreConcept: [
    {
      kind: 'paragraph',
      text: 'Exactly one element has focus at a time, and for a keyboard user it is the equivalent of the mouse pointer: the thing their next keystroke will act on. If it is invisible, they are working blind. If it moves unexpectedly, they are lost.',
    },
    {
      kind: 'list',
      items: [
        'Tab order follows document order for focusable elements. It is not a separate system you configure; it is a consequence of your markup.',
        'Focus visibility is non-negotiable. Removing the outline without replacing it is the single most damaging line of CSS in common use.',
        'Focus management means moving focus deliberately when the interface changes — opening a dialog, revealing a panel, removing the focused element.',
        'Focus trapping keeps focus inside a modal region, and is required only when the rest of the page is genuinely inert.',
        'Restoration returns focus to where the user was when a transient region closes.',
      ],
    },
    {
      kind: 'callout',
      tone: 'pitfall',
      title: 'The most common accessibility defect on the web',
      body: 'outline: none, with nothing put in its place.',
    },
  ],

  firstPrinciples: [
    {
      kind: 'paragraph',
      text: 'A mouse user re-establishes context by looking. A keyboard user cannot: their only indication of position is the focus ring, and their only way to move is sequential. Every decision follows from that asymmetry.',
    },
    {
      kind: 'paragraph',
      text: 'When something is removed — a row deleted, a dialog closed — focus must go somewhere deliberate. If it does not, it falls to the body and the user is returned to the top of the document, losing their place entirely.',
    },
  ],

  designPerspective: [
    {
      kind: 'paragraph',
      text: 'Because tab order follows document order, a layout that visually reorders content creates a mismatch between what a sighted keyboard user sees and the order they traverse. CSS ordering properties make this easy to do accidentally.',
    },
    {
      kind: 'paragraph',
      text: 'Skip links exist because sequential navigation is expensive. A page with forty navigation links makes the main content forty keystrokes away on every page load; a skip link makes it one.',
    },
  ],

  engineeringPerspective: [
    {
      kind: 'code',
      language: 'ts',
      caption: 'The dialog contract: remember, move, trap, restore.',
      code: `function openDialog(dialog: HTMLElement) {
  const returnTo = document.activeElement as HTMLElement | null;

  dialog.hidden = false;
  // Move focus in: the dialog itself, or its first meaningful control.
  dialog.querySelector<HTMLElement>('[autofocus]')?.focus() ?? dialog.focus();

  return function close() {
    dialog.hidden = true;
    // Restore to where the user was, not to the top of the page.
    returnTo?.focus();
  };
}`,
    },
    {
      kind: 'paragraph',
      text: 'Escape must close any transient region. :focus-visible gives a ring for keyboard interaction without showing one on mouse click, which removes the usual excuse for deleting outlines.',
    },
  ],

  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'Focus is simultaneously a visual design problem — the ring must be visible on every surface, including inside a filled button — and an engineering problem, because the ring only helps if focus is somewhere sensible.',
    },
    {
      kind: 'paragraph',
      text: 'Designing the focus state alongside hover and active, rather than leaving it to a default, is one of the clearest markers of a considered interface.',
    },
  ],

  industryExamples: [
    {
      id: 'example-apg-dialog',
      source: 'WAI-ARIA Authoring Practices',
      title: 'The dialog pattern as a contract',
      observation:
        'The APG modal dialog pattern specifies moving focus in, trapping it, closing on Escape, and restoring focus to the trigger.',
      takeaway:
        'These four behaviours are what make a dialog a dialog. A styled overlay without them is a visual effect.',
    },
    {
      id: 'example-linear-keyboard',
      source: 'Linear',
      title: 'Keyboard operation as a product position',
      observation:
        'Linear is navigable almost entirely by keyboard, with visible focus and a command palette that reaches most actions.',
      takeaway:
        'Keyboard-first design benefits everyone — it forces a clear action vocabulary and a coherent focus model.',
    },
  ],

  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Building an accessible dialog, in the order that keeps it correct.',
    },
    { kind: 'heading', text: '1. Remember where focus was' },
    {
      kind: 'paragraph',
      text: 'Capture the active element before opening. This is what restoration needs, and capturing it later is too late.',
    },
    { kind: 'heading', text: '2. Move focus in' },
    {
      kind: 'paragraph',
      text: 'To the first meaningful control, or to the dialog container if there is none. Do not leave focus behind the overlay.',
    },
    { kind: 'heading', text: '3. Constrain focus' },
    {
      kind: 'paragraph',
      text: 'Tab from the last element wraps to the first, and Shift+Tab from the first wraps to the last. Content behind the dialog should be inert.',
    },
    { kind: 'heading', text: '4. Close on Escape, and restore' },
    {
      kind: 'paragraph',
      text: 'Escape always closes. On close, focus returns to the remembered element — unless it no longer exists, in which case choose the nearest sensible ancestor.',
    },
    { kind: 'heading', text: '5. Announce it correctly' },
    {
      kind: 'paragraph',
      text: 'role="dialog", aria-modal, and an accessible name from its heading so it is announced as a dialog with a title rather than as an anonymous region.',
    },
  ],

  commonMistakes: [
    {
      id: 'mistake-outline-none',
      mistake: 'Removing focus outlines.',
      why: 'It makes the interface unusable by keyboard while looking fine to the person who removed it.',
      instead: 'Design a focus style and apply it with :focus-visible. Never remove without replacing.',
    },
    {
      id: 'mistake-focus-to-body',
      mistake: 'Letting focus fall to the body after closing something.',
      why: 'The user is returned to the top of the document and must navigate back.',
      instead: 'Restore to the trigger, or to the nearest surviving element if the trigger is gone.',
    },
    {
      id: 'mistake-visual-reorder',
      mistake: 'Reordering content visually with CSS.',
      why: 'Tab order still follows the DOM, so the keyboard traversal no longer matches what is on screen.',
      instead: 'Change the document order, or accept the visual order the document implies.',
    },
    {
      id: 'mistake-positive-tabindex',
      mistake: 'Using positive tabindex values to force an order.',
      why: 'They jump ahead of every natural element on the page and are almost impossible to maintain.',
      instead: 'Use only 0 and -1, and fix the order in the DOM.',
    },
  ],

  eliteConsiderations: [
    {
      kind: 'list',
      items: [
        'Verify the focus ring against every surface it can land on, including on an accent-filled button and against a dark overlay.',
        'When the focused element is removed, decide in advance where focus goes — usually the next sibling, or the container.',
        'Do not trap focus in anything non-modal; a trapped dropdown is worse than an untrapped one.',
        'Make skip links visible when focused. An invisible skip link that moves focus silently is confusing rather than helpful.',
      ],
    },
  ],

  practicalExercise: {
    id: 'exercise-03-03',
    title: 'Build an accessible dialog',
    prompt:
      'Build a modal dialog that satisfies the full focus contract, without a component library.',
    steps: [
      'Capture the previously focused element before opening.',
      'Move focus into the dialog on open.',
      'Trap Tab and Shift+Tab within the dialog.',
      'Close on Escape and on the close button.',
      'Restore focus to the trigger on close.',
      'Give the dialog a role, aria-modal, and an accessible name from its heading.',
      'Test the whole flow using only the keyboard, and then with a screen reader if you can.',
    ],
    successCriteria: [
      'Focus moves into the dialog on open and is visible at all times.',
      'Tab and Shift+Tab both wrap within the dialog.',
      'Escape closes it.',
      'Focus returns to the triggering element on close.',
      'The dialog is announced with its name and as a dialog.',
    ],
    estimatedMinutes: 45,
    hint: 'Test Shift+Tab from the first element specifically — that is the direction people forget to wrap.',
  },

  reflectionQuestion: 'Where should focus go after a modal closes?',
  reflectionHint:
    'Return the user to their previous context. Then consider what to do when that element no longer exists, because it sometimes will not.',

  resources: [
    {
      id: 'resource-apg-dialog',
      title: 'ARIA Authoring Practices: modal dialog',
      url: 'https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/',
      type: 'specification',
      estimatedMinutes: 25,
      note: 'The keyboard and focus contract, stated precisely.',
    },
    {
      id: 'resource-focus-visible',
      title: 'MDN: :focus-visible',
      url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/:focus-visible',
      type: 'documentation',
      estimatedMinutes: 10,
      note: 'Keyboard-only focus styling, which removes the usual reason for deleting outlines.',
    },
    {
      id: 'resource-webaim-keyboard',
      title: 'WebAIM: keyboard accessibility',
      url: 'https://webaim.org/techniques/keyboard/',
      type: 'article',
      estimatedMinutes: 20,
      note: 'Practical guidance on order, visibility, and traps.',
    },
  ],

  competencyTags: [
    'interaction-design',
    'accessibility',
    'browser-apis',
    'interaction-engineering',
  ],

  completionCriteria: [
    'Has built a dialog satisfying move, trap, escape, and restore.',
    'Focus is visible on every surface in the build.',
    'Can explain why positive tabindex is a mistake.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Lesson 14                                                                   */
/* -------------------------------------------------------------------------- */

const LESSON_14: Lesson = {
  id: 'lesson-03-04',
  slug: 'accessibility-tree',
  moduleId: MODULE_ID,
  lessonNumber: 4,
  title: 'Accessibility Tree',
  summary:
    'The browser builds a second representation of your page describing what everything is. Reading it tells you what your interface actually claims to be.',
  estimatedMinutes: 8,

  objectives: [
    'Explain the relationship between the DOM and the accessibility tree.',
    'Determine how an element gets its accessible name.',
    'Inspect roles and states in browser tooling.',
    'Judge when visually hidden text is the right answer.',
  ],

  prerequisiteConcepts: ['Semantic HTML', 'Native controls', 'Focus management'],
  prerequisiteLessonIds: ['lesson-03-01', 'lesson-03-03'],

  recap: [
    {
      kind: 'paragraph',
      text: 'You have been choosing elements for meaning. This lesson shows you where that meaning ends up, and how to check it.',
    },
  ],

  coreConcept: [
    {
      kind: 'paragraph',
      text: 'From the DOM, the browser derives a second structure: the accessibility tree. It contains only what is relevant to understanding and operating the page, and each node carries a role, a name, a value, and a set of states.',
    },
    {
      kind: 'list',
      items: [
        'Role — what this is. button, link, heading, checkbox, dialog.',
        'Name — what it is called. Usually from content, a label, or an aria-label.',
        'Value — what it currently holds, for controls that hold something.',
        'State — checked, expanded, disabled, invalid, busy.',
      ],
    },
    {
      kind: 'paragraph',
      text: 'This tree is what a screen reader reads. It is also the fastest debugging tool available: if a control announces as "button, blank", the name is missing, and you can see that in seconds without installing anything.',
    },
  ],

  firstPrinciples: [
    {
      kind: 'paragraph',
      text: 'Accessible names are computed by a specified algorithm with a defined precedence: aria-labelledby, then aria-label, then the element\'s own content or associated label, then certain attributes such as title.',
    },
    {
      kind: 'paragraph',
      text: 'Knowing the order explains most naming bugs. An aria-label on a button containing text silently replaces the visible text — so the interface says one thing on screen and another aloud, which is worse than either alone.',
    },
    {
      kind: 'callout',
      tone: 'warning',
      body: 'If a control has visible text, that text should be its name. Overriding it means a user saying "click Save" and the software hearing something else.',
    },
  ],

  designPerspective: [
    {
      kind: 'paragraph',
      text: 'Icon-only controls are the common case where design and naming collide. A trash icon is unambiguous visually and silent otherwise. It needs a name, and the name should say what it does — "Delete invoice", not "trash".',
    },
    {
      kind: 'paragraph',
      text: 'Visually hidden text is the mechanism for anything the visual design communicates by position, colour, or shape. A status dot needs its meaning in text; a table of icon buttons needs each row\'s subject in its name, because "Delete" repeated fourteen times is useless out of context.',
    },
  ],

  engineeringPerspective: [
    {
      kind: 'code',
      language: 'html',
      caption: 'Naming, and the class that makes hidden text work.',
      code: `<!-- Icon only: the name says what it does. -->
<button aria-label="Delete invoice 1024">
  <svg aria-hidden="true">…</svg>
</button>

<!-- Visible text plus context only available visually. -->
<button>
  Delete
  <span class="sr-only">invoice 1024</span>
</button>`,
    },
    {
      kind: 'code',
      language: 'css',
      caption: 'Hidden from sight, present in the tree. display:none would remove it entirely.',
      code: `.sr-only {
  position: absolute;
  width: 1px; height: 1px;
  padding: 0; margin: -1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}`,
    },
    {
      kind: 'paragraph',
      text: 'Decorative images take aria-hidden or an empty alt. An icon inside a labelled button is decorative — the button already has a name, and announcing the icon as well produces noise.',
    },
  ],

  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'The accessibility tree is where design intent is checkable. A designer says "this dot means the service is degraded"; the tree shows whether anything in the page says that, or whether the meaning exists only as a colour.',
    },
    {
      kind: 'paragraph',
      text: 'Reading the tree during design review, rather than during an audit months later, turns accessibility from a retrofit into a property of the build.',
    },
  ],

  industryExamples: [
    {
      id: 'example-devtools-a11y',
      source: 'Browser devtools',
      title: 'The tree as a first-class inspector',
      observation:
        'Chrome and Firefox both expose the accessibility tree alongside the DOM, with the computed name and its source shown for each node.',
      takeaway:
        'The name source is the important part: it tells you which rule in the algorithm won, and therefore what to change.',
    },
    {
      id: 'example-icon-buttons',
      source: 'Data-dense products generally',
      title: 'Row-level context in repeated controls',
      observation:
        'Well-built tables give each row action a name including its subject, so a list of actions is distinguishable when read out of visual context.',
      takeaway:
        'Visual context — being in a row — does not exist in a linear reading. It has to be stated.',
    },
  ],

  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Auditing an interface through the tree.',
    },
    { kind: 'heading', text: '1. Open the accessibility panel' },
    {
      kind: 'paragraph',
      text: 'Inspect an element and switch to the accessibility view. You will see role, computed name, and the source of that name.',
    },
    { kind: 'heading', text: '2. Check every interactive element has a name' },
    {
      kind: 'paragraph',
      text: 'Anything unnamed is unusable by voice control and ambiguous to a screen reader. Icon-only buttons are the usual offenders.',
    },
    { kind: 'heading', text: '3. Check roles match reality' },
    {
      kind: 'paragraph',
      text: 'A div with a click handler appears as generic. That is the tree telling you it is not a button, regardless of how it looks.',
    },
    { kind: 'heading', text: '4. Check states update' },
    {
      kind: 'paragraph',
      text: 'Expand a disclosure and confirm aria-expanded changed. A state that never updates is worse than none, because it actively misinforms.',
    },
  ],

  commonMistakes: [
    {
      id: 'mistake-aria-label-override',
      mistake: 'Adding aria-label to an element that already has visible text.',
      why: 'It silently replaces the visible name, so speech input and screen readers disagree with the screen.',
      instead: 'Let visible text be the name. Add hidden text for extra context rather than replacing.',
    },
    {
      id: 'mistake-unnamed-icon-button',
      mistake: 'Shipping icon-only buttons with no accessible name.',
      why: 'They announce as "button" with no indication of purpose.',
      instead: 'Give every icon-only control a name describing its action.',
    },
    {
      id: 'mistake-display-none-sr-text',
      mistake: 'Hiding screen-reader text with display:none.',
      why: 'It removes the element from the accessibility tree entirely, so the text does not exist for anyone.',
      instead: 'Use a clip-based visually-hidden utility.',
    },
    {
      id: 'mistake-announced-icons',
      mistake: 'Leaving decorative icons exposed to assistive technology.',
      why: 'They add noise to every announcement without adding information.',
      instead: 'Mark decorative graphics aria-hidden, or give images an empty alt.',
    },
  ],

  eliteConsiderations: [
    {
      kind: 'list',
      items: [
        'Check the name source, not just the name — an unexpected source usually means a rule you did not intend is winning.',
        'Keep visible text at the start of an accessible name so speech-control users can say what they see.',
        'Audit repeated controls in context: fourteen identical names is a defect even though each one is individually correct.',
        'Verify states change as the interface changes; a stale aria-expanded is a lie told confidently.',
      ],
    },
  ],

  practicalExercise: {
    id: 'exercise-03-04',
    title: 'Inspect an interface through the accessibility tree',
    prompt:
      'Audit a real interface — ideally one you built — using browser accessibility tooling.',
    steps: [
      'Open the accessibility panel and walk the tree from the top.',
      'Record the role and computed name of every interactive element.',
      'Find at least one element whose name is missing, wrong, or duplicated across rows.',
      'Identify the source of one computed name and explain which rule produced it.',
      'Toggle a stateful control and confirm the state updates in the tree.',
      'Fix one naming defect and verify the change in the tree.',
    ],
    successCriteria: [
      'Roles and names are recorded for every interactive element.',
      'At least one naming defect is found and described.',
      'The name source is identified for at least one element.',
      'A state change is observed updating in the tree.',
      'One fix is made and verified.',
    ],
    estimatedMinutes: 35,
    hint: 'Start with icon-only buttons and anything in a repeated row. That is where naming defects cluster.',
  },

  reflectionQuestion: 'Why could visually hidden text still matter?',
  reflectionHint:
    'Not every interface is visual. What does a linear reading lose that a two-dimensional layout provides for free?',

  resources: [
    {
      id: 'resource-accname',
      title: 'Accessible Name and Description Computation',
      url: 'https://www.w3.org/TR/accname/',
      type: 'specification',
      estimatedMinutes: 25,
      note: 'The precedence order that explains almost every naming bug.',
    },
    {
      id: 'resource-devtools-accessibility',
      title: 'Chrome DevTools: accessibility reference',
      url: 'https://developer.chrome.com/docs/devtools/accessibility/reference',
      type: 'documentation',
      estimatedMinutes: 15,
      note: 'How to read the tree and the computed name source.',
    },
    {
      id: 'resource-inclusive-components',
      title: 'Inclusive Components',
      url: 'https://inclusive-components.design/',
      type: 'article',
      author: 'Heydon Pickering',
      estimatedMinutes: 60,
      note: 'Component-by-component treatment of naming, roles, and states.',
    },
  ],

  competencyTags: ['accessibility', 'html', 'browser-apis'],

  completionCriteria: [
    'Can read role, name, value, and state in browser tooling.',
    'Has found and fixed at least one naming defect.',
    'Can explain the accessible name precedence order.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Lesson 15                                                                   */
/* -------------------------------------------------------------------------- */

const LESSON_15: Lesson = {
  id: 'lesson-03-05',
  slug: 'accessible-product-states',
  moduleId: MODULE_ID,
  lessonNumber: 5,
  title: 'Accessible Product States',
  summary:
    'The states from Module 1 — loading, error, success, disabled — have to be perceivable by everyone, which means announcing them rather than only rendering them.',
  estimatedMinutes: 9,

  objectives: [
    'Associate validation messages with their fields programmatically.',
    'Announce asynchronous state changes without stealing focus.',
    'Choose between disabling a control and allowing a failed attempt.',
    'Communicate loading and busy states to assistive technology.',
  ],

  prerequisiteConcepts: [
    'State enumeration',
    'Accessible names and states',
    'Validation timing',
  ],
  prerequisiteLessonIds: ['lesson-01-02', 'lesson-03-04'],

  recap: [
    {
      kind: 'paragraph',
      text: 'Module 1 enumerated states; this module has been making structure honest. This lesson joins them: every state you designed has to be perceivable by every user.',
    },
  ],

  coreConcept: [
    {
      kind: 'paragraph',
      text: 'A visual state change is an event a sighted user notices peripherally. For a screen reader user, nothing happens unless the page says something happened — and where it says it determines whether the message is heard.',
    },
    {
      kind: 'list',
      items: [
        'Validation — the message must be associated with its field via aria-describedby, and the field marked aria-invalid.',
        'Live regions — aria-live="polite" announces without interrupting; assertive interrupts and should be rare.',
        'Busy states — aria-busy, or a status region announcing that something is loading.',
        'Disabled — removes the control from the tab order, which means the explanation must be elsewhere.',
      ],
    },
    {
      kind: 'callout',
      tone: 'note',
      body: 'A live region must exist in the DOM before the message is put into it. Inserting a region that already contains text usually announces nothing.',
    },
  ],

  firstPrinciples: [
    {
      kind: 'paragraph',
      text: 'Disabling a control removes it from the keyboard path entirely. A keyboard user tabbing through the form never encounters it, so any explanation attached to it is unreachable.',
    },
    {
      kind: 'paragraph',
      text: 'That is why a disabled submit button is frequently the wrong pattern: the user is prevented from acting and simultaneously prevented from discovering why. Allowing the attempt and responding with a precise error is often more usable, because the feedback arrives where the attempt was made.',
    },
  ],

  designPerspective: [
    {
      kind: 'paragraph',
      text: 'Error messages should say what is wrong and what would be right. "Invalid input" describes the system\'s opinion; "Password needs at least 12 characters" describes the next action.',
    },
    {
      kind: 'paragraph',
      text: 'Placement matters as much as wording. A message next to the field is found; a summary at the top of a long form is found only if the user scrolls back. Long forms usually need both — a summary that links to each field, and the message in place.',
    },
  ],

  engineeringPerspective: [
    {
      kind: 'code',
      language: 'html',
      caption: 'Field, state, and message wired together.',
      code: `<label for="password">Password</label>
<input
  id="password"
  type="password"
  aria-describedby="password-help password-error"
  aria-invalid="true"
/>
<p id="password-help">At least 12 characters.</p>
<p id="password-error" role="alert">
  Password needs at least 12 characters.
</p>`,
    },
    {
      kind: 'code',
      language: 'html',
      caption: 'A status region that exists before it has anything to say.',
      code: `<!-- Rendered empty on load; filled when state changes. -->
<p role="status" aria-live="polite" class="sr-only" id="save-status"></p>`,
    },
  ],

  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'This is where the state map from Module 1 becomes an accessibility specification. Every state in that map needs an answer to one extra question: how is this perceived by someone who cannot see it?',
    },
    {
      kind: 'paragraph',
      text: 'Adding that column to a state map is a small change that catches most of these defects before any code exists.',
    },
  ],

  industryExamples: [
    {
      id: 'example-gov-uk-errors',
      source: 'GOV.UK Design System',
      title: 'Error summaries that are tested rather than assumed',
      observation:
        'GOV.UK pairs an error summary at the top of the form, which receives focus on submit, with individual messages at each field, and the summary entries link to their fields.',
      takeaway:
        'It is a researched pattern rather than an improvised one, and it solves both discovery and correction.',
    },
    {
      id: 'example-status-region',
      source: 'Common practice',
      title: 'Save status announced without interruption',
      observation:
        'Autosaving interfaces typically put "Saving…" and "Saved" into a polite live region, so the state is available without stealing focus mid-typing.',
      takeaway:
        'Polite is almost always correct. Assertive interrupts whatever the user is doing and should be reserved for genuine urgency.',
    },
  ],

  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Making a signup flow accessible, state by state.',
    },
    { kind: 'heading', text: '1. List the states, then add a perception column' },
    {
      kind: 'paragraph',
      text: 'Idle, validating, invalid, submitting, failed, succeeded. For each, write how it is announced as well as how it looks.',
    },
    { kind: 'heading', text: '2. Wire validation to fields' },
    {
      kind: 'paragraph',
      text: 'aria-describedby pointing at both help text and error text, plus aria-invalid when the field is in error.',
    },
    { kind: 'heading', text: '3. Add a status region for async state' },
    {
      kind: 'paragraph',
      text: 'Present from first render, empty. Fill it on transition: "Creating account", "Account created", "Could not create account".',
    },
    { kind: 'heading', text: '4. Decide the submit behaviour' },
    {
      kind: 'paragraph',
      text: 'Either allow submission and report precisely, or disable and make the reason visible outside the disabled control. Pick one deliberately.',
    },
    { kind: 'heading', text: '5. Test with a screen reader' },
    {
      kind: 'paragraph',
      text: 'VoiceOver, NVDA, or Narrator. Submit an invalid form with your eyes closed and see whether you can tell what happened.',
    },
  ],

  commonMistakes: [
    {
      id: 'mistake-colour-only-error',
      mistake: 'Indicating errors with a red border alone.',
      why: 'It is invisible to colour-blind users, unavailable to screen readers, and does not say what is wrong.',
      instead: 'Pair colour with text, aria-invalid, and a described-by association.',
    },
    {
      id: 'mistake-late-live-region',
      mistake: 'Inserting a live region at the moment it has content.',
      why: 'Assistive technology observes changes to existing regions; a region that arrives with text is often not announced.',
      instead: 'Render the region empty on load and put text into it later.',
    },
    {
      id: 'mistake-disabled-submit',
      mistake: 'Disabling submit until the form is valid.',
      why: 'The control leaves the tab order, so the user cannot reach it to find out why nothing happens.',
      instead: 'Allow the attempt and respond precisely, or keep it enabled and explain on activation.',
    },
    {
      id: 'mistake-assertive-everything',
      mistake: 'Using assertive live regions for routine updates.',
      why: 'It interrupts the user mid-sentence, repeatedly.',
      instead: 'Use polite for everything except genuine urgency.',
    },
  ],

  eliteConsiderations: [
    {
      kind: 'list',
      items: [
        'Move focus to an error summary on failed submit, and make each entry a link to its field.',
        'Announce the result of an async action, not only its start — "Saving…" with no follow-up leaves the user waiting indefinitely.',
        'Keep messages stable: a message that changes wording on every keystroke is announced on every keystroke.',
        'Add a perception column to every state map you produce. It is the cheapest accessibility practice available.',
      ],
    },
  ],

  practicalExercise: {
    id: 'exercise-03-05',
    title: 'Build an accessible signup flow',
    prompt:
      'Build a signup flow where every state is perceivable without sight.',
    steps: [
      'List the states and write how each is announced as well as rendered.',
      'Build the form with native controls and bound labels.',
      'Associate every validation message with its field, and set aria-invalid appropriately.',
      'Add a polite status region, present from first render.',
      'Decide and implement your submit behaviour, and write down why you chose it.',
      'On failed submit, move focus to an error summary that links to each field.',
      'Test the whole flow with a screen reader and your eyes closed.',
    ],
    successCriteria: [
      'Every field error is programmatically associated with its field.',
      'Async state changes are announced politely and include the result.',
      'No state is communicated by colour alone.',
      'The submit decision is deliberate and documented.',
      'The flow can be completed successfully without looking at the screen.',
    ],
    estimatedMinutes: 50,
    hint: 'Close your eyes and submit the form empty. If you cannot tell what went wrong or where to go, the announcement is missing.',
  },

  reflectionQuestion:
    'Should a submit button become disabled whenever a form contains errors?',
  reflectionHint:
    'Blocking actions can hide useful feedback. Where does the explanation live if the control cannot be reached?',

  resources: [
    {
      id: 'resource-aria-live',
      title: 'MDN: ARIA live regions',
      url: 'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Live_Regions',
      type: 'documentation',
      estimatedMinutes: 20,
      note: 'Politeness levels and the timing rules that decide whether anything is announced.',
    },
    {
      id: 'resource-govuk-errors',
      title: 'GOV.UK Design System: error summary',
      url: 'https://design-system.service.gov.uk/components/error-summary/',
      type: 'documentation',
      estimatedMinutes: 15,
      note: 'A researched, tested error pattern with its reasoning published.',
    },
    {
      id: 'resource-webaim-forms',
      title: 'WebAIM: creating accessible forms',
      url: 'https://webaim.org/techniques/forms/',
      type: 'article',
      estimatedMinutes: 25,
      note: 'Labels, errors, and grouping, with the common failures called out.',
    },
  ],

  competencyTags: ['interaction-design', 'accessibility', 'interface-state-modelling'],

  completionCriteria: [
    'Every state in a built flow is perceivable without sight.',
    'Validation is programmatically associated, not only visual.',
    'Has taken and defended a position on disabling submit.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Project                                                                     */
/* -------------------------------------------------------------------------- */

const PROJECT: ModuleProject = {
  id: 'project-03',
  slug: 'accessible-signup-and-account-creation',
  moduleId: MODULE_ID,
  title: 'Accessible Signup and Account Creation',
  brief:
    'Build a complete signup and account creation flow with correct semantics, full keyboard support, validation, errors, success, focus management, and responsive layout.',
  problem:
    'Signup is the first thing a product asks of someone and the place accessibility failures are most expensive: a user who cannot complete it never becomes a user at all. It combines almost every hard case — labelled controls, rules with different announcement moments, asynchronous checks, failure that must preserve input, and a success transition that has to move focus somewhere sensible.',
  objectives: [
    'Build a flow that works before JavaScript and improves with it.',
    'Make every state perceivable without sight.',
    'Manage focus across validation failure and successful submission.',
    'Keep the whole flow operable by keyboard at every width.',
  ],
  requirements: [
    'Semantic document structure with correct landmarks and heading outline.',
    'Native form controls with labels bound by id and appropriate autocomplete.',
    'Validation with a deliberate announcement moment per rule.',
    'Errors associated programmatically with their fields, plus an error summary on submit.',
    'A success state with focus moved somewhere sensible.',
    'Focus management across every transition, including any dialog.',
    'Responsive layout that stays operable at 320px and at 200% zoom.',
  ],
  constraints: [
    'No component library and no form library.',
    'The form must submit and validate natively with JavaScript disabled.',
    'No state may be conveyed by colour alone.',
    'No positive tabindex values anywhere.',
  ],
  suggestedScope:
    'One signup form with four or five fields, one asynchronous check, and a success view. Do not build authentication, sessions, or a backend — a fake delay and a scripted failure are enough to produce the states that matter.',
  deliverables: [
    'A working implementation of the flow.',
    'A state map with a perception column for every state.',
    'A short note on the submit-button decision and why it was made.',
  ],
  completionCriteria: [
    'The flow can be completed with a screen reader without looking at the screen.',
    'Every field error is programmatically associated with its field.',
    'Focus is visible everywhere and lands deliberately after every transition.',
    'The form still submits with JavaScript disabled.',
    'The layout is usable at 320px wide and at 200% zoom.',
  ],
  portfolioEvidence: [
    'Semantic HTML',
    'Form accessibility',
    'Keyboard behaviour',
    'Validation states',
    'Focus management',
    'Status announcement for assistive technology',
    'Responsive implementation',
  ],
  reflectionQuestion:
    'Which part of the flow was hardest to make perceivable without sight, and what does that suggest about how you normally design states?',
  estimatedHours: 12,
  competencies: [
    'responsive-design',
    'interaction-design',
    'accessibility',
    'html',
    'interface-state-modelling',
    'interaction-engineering',
  ],
  stretchGoals: [
    'Add an asynchronous email availability check with a correctly announced pending state.',
    'Test with two different screen readers and record where they disagree.',
  ],
};

/* -------------------------------------------------------------------------- */

export const MODULE_03: CurriculumModule = {
  id: MODULE_ID,
  slug: 'html-semantics-and-accessibility',
  moduleNumber: 3,
  phase: 'foundations',
  title: 'HTML, Semantics and Accessibility',
  description:
    'The browser as an interaction and accessibility platform: meaning, native behaviour, focus, and the tree that assistive technology actually reads.',
  outcome:
    'Understand that the browser already contains a powerful interaction and accessibility platform.',
  prerequisites: [
    'Modules 1 and 2, or equivalent',
    'Comfort reading and writing basic HTML',
  ],
  lessons: [LESSON_11, LESSON_12, LESSON_13, LESSON_14, LESSON_15],
  resources: [
    {
      id: 'resource-module-03-mdn',
      title: 'MDN HTML',
      url: 'https://developer.mozilla.org/en-US/docs/Web/HTML',
      type: 'documentation',
      estimatedMinutes: 90,
      note: 'The reference for what elements mean and what behaviour they carry.',
    },
    {
      id: 'resource-module-03-apg',
      title: 'WAI-ARIA Authoring Practices',
      url: 'https://www.w3.org/WAI/ARIA/apg/',
      type: 'specification',
      estimatedMinutes: 90,
      note: 'Keyboard and state contracts for every common pattern.',
    },
    {
      id: 'resource-module-03-webaim',
      title: 'WebAIM',
      url: 'https://webaim.org/',
      type: 'article',
      estimatedMinutes: 60,
      note: 'Practical technique guides with the common failures named.',
    },
    {
      id: 'resource-module-03-inclusive',
      title: 'Inclusive Components',
      url: 'https://inclusive-components.design/',
      type: 'article',
      author: 'Heydon Pickering',
      estimatedMinutes: 90,
      note: 'Component-level reasoning about semantics and behaviour.',
    },
    {
      id: 'resource-module-03-insights',
      title: 'Accessibility Insights',
      url: 'https://accessibilityinsights.io/',
      type: 'tool',
      estimatedMinutes: 20,
      note: 'Guided assessment tooling for finding defects systematically.',
    },
  ],
  project: PROJECT,
  competencies: [
    'responsive-design',
    'interaction-design',
    'accessibility',
    'html',
    'browser-apis',
    'design-to-code-translation',
    'interface-state-modelling',
    'interaction-engineering',
  ],
  completionCriteria: [
    'All five lessons completed.',
    'Module project marked completed.',
    'Can operate and verify an interface without a mouse or a screen.',
  ],
};
