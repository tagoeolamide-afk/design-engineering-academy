/**
 * Module 03 — HTML and CSS Foundations.
 *
 * The first module where the learner writes code. Every snippet is explained
 * line by line on first appearance, and nothing appears before the idea behind
 * it has been introduced in words.
 *
 * Deep accessibility — the accessibility tree, ARIA, accessible components —
 * is deliberately NOT here. It arrives in Module 9, once there are components
 * to make accessible. What is here is the semantic structure everything else
 * depends on.
 */

import type { CurriculumModule, Lesson, ModuleProject } from '@/types/curriculum';

const MODULE_ID = 'module-03';

/* -------------------------------------------------------------------------- */
/* Lesson 11                                                                   */
/* -------------------------------------------------------------------------- */

const LESSON_1: Lesson = {
  id: 'lesson-html-gives-interfaces-structure-and-meaning',
  slug: 'html-gives-interfaces-structure-and-meaning',
  moduleId: MODULE_ID,
  lessonNumber: 1,
  title: 'HTML Gives Interfaces Structure and Meaning',
  summary:
    'HTML is not how a page looks. It is what the page is — a description of meaning that browsers, search engines and screen readers all read.',
  estimatedMinutes: 9,
  objectives: [
    'Write a page outline in HTML before applying any styling.',
    'Choose elements by what the content means, not by how it should appear.',
    'Use headings to express the hierarchy you designed in Module 2.',
    'Explain what a browser does with semantic information.',
  ],
  prerequisiteConcepts: [
    'Browser controls from Module 1',
    'Visual hierarchy and heading levels from Module 2',
  ],
  prerequisiteLessonIds: [
    'lesson-buttons-links-inputs-and-controls',
    'lesson-visual-hierarchy',
  ],
  recap: [
    {
      kind: 'paragraph',
      text: 'Module 2 ended with responsive thinking, and before that you assigned heading levels as part of designing hierarchy. That assignment is about to become real markup.',
    },
  ],
  priorKnowledge: [
    {
      kind: 'paragraph',
      text: 'You saw a little HTML in Module 1, lesson 2 — a button, a link, an input. You know those elements have behaviour attached. You also decided heading levels in Module 2 without yet having anywhere to put them.',
    },
    {
      kind: 'paragraph',
      text: 'This lesson is where both arrive.',
    },
  ],
  coreConcept: [
    {
      kind: 'paragraph',
      text: 'HTML describes what things are. CSS describes how they look. Keeping those separate is the first real discipline of building interfaces.',
    },
    {
      kind: 'paragraph',
      text: 'A heading is a heading because it introduces a section, not because it is large. A list is a list because it contains several related items, not because the items have bullets. If you choose elements by appearance, you get a page that looks right and means nothing.',
    },
  ],
  whyDesignersCare: [
    {
      kind: 'paragraph',
      text: 'Because meaning is what everything non-visual depends on, and non-visual consumers of your interface are more common than designers expect.',
    },
    {
      kind: 'paragraph',
      text: 'A screen reader builds its navigation from headings and landmarks. A browser decides what Tab reaches from the elements present. Save-to-reading-list features, translation tools, and search engines all read structure. Every one of those gets a worse result from a page made of generic boxes.',
    },
    {
      kind: 'paragraph',
      text: 'Writing the structure also catches design problems early. If you cannot decide whether something is a heading or a label, the design has not decided what it is either.',
    },
  ],
  howItWorks: [
    {
      kind: 'paragraph',
      text: 'HTML is made of elements. An element is usually an opening tag, some content, and a closing tag.',
    },
    {
      kind: 'code',
      language: 'html',
      code: '<h1>Account settings</h1>\n<p>Manage how you appear to other people.</p>',
    },
    {
      kind: 'paragraph',
      text: 'Line by line. `<h1>` opens a top-level heading; `</h1>` closes it; the text between is the heading. `<p>` opens a paragraph and `</p>` closes it. The angle brackets and the closing slash are the whole syntax.',
    },
    {
      kind: 'paragraph',
      text: 'Elements nest. One element can contain others, which is how structure is expressed:',
    },
    {
      kind: 'code',
      language: 'html',
      code: '<section>\n  <h2>Notifications</h2>\n  <p>Choose what we email you about.</p>\n</section>',
    },
    {
      kind: 'paragraph',
      text: 'Here `<section>` contains a heading and a paragraph. The indentation is for humans only — the browser reads the nesting from the tags. What this says is "these two things belong together, and the heading names the group".',
    },
  ],
  firstPrinciples: [
    {
      kind: 'paragraph',
      text: 'The elements you will use most often are a short list:',
    },
    {
      kind: 'list',
      items: [
        '`<h1>` to `<h6>` — headings, in order of level. One `<h1>` per page.',
        '`<p>` — a paragraph of text.',
        '`<ul>` and `<li>` — a list and its items.',
        '`<section>` — a grouping of related content that has a heading.',
        '`<header>`, `<main>`, `<footer>`, `<nav>` — the major regions of a page.',
        '`<button>`, `<a>`, `<input>`, `<label>` — the controls from Module 1.',
        '`<div>` and `<span>` — generic containers that mean nothing at all.',
      ],
    },
    {
      kind: 'paragraph',
      text: 'That last line matters. `<div>` is not forbidden — it is the right choice when you need a box purely for layout and the content has no particular meaning. It is wrong when a meaningful element exists and you reached for `<div>` because it was familiar.',
    },
    {
      kind: 'callout',
      tone: 'insight',
      body: 'Heading levels must not skip. An h1 followed by an h3 tells a screen reader a level is missing. Levels express depth, not size — size is CSS.',
    },
  ],
  designPerspective: [
    {
      kind: 'paragraph',
      text: 'The design question is what this content *is*, which is a question you answer when you decide hierarchy.',
    },
    {
      kind: 'paragraph',
      text: 'Writing the outline before styling is genuinely useful design work. It is the fastest way to discover that a screen has two things both behaving like the page title, or a label that is really a heading.',
    },
  ],
  engineeringPerspective: [
    {
      kind: 'paragraph',
      text: 'The engineering question is how little markup you can get away with.',
    },
    {
      kind: 'paragraph',
      text: 'Every extra wrapper is something to maintain and something that can interfere with layout. Write the meaning first, then add containers only where the layout genuinely needs one. Markup written the other way round — boxes first, meaning retrofitted — tends never to get the meaning.',
    },
  ],
  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'The outline is the artefact both sides share. It is a design document and a code file at the same time.',
    },
    {
      kind: 'paragraph',
      text: 'A designer who can read it can verify that the structure matches the intent. An engineer reading it knows what the page means before deciding how it looks. Very few artefacts do both jobs.',
    },
  ],
  industryExamples: [
    {
      id: 'example-mdn-semantics',
      source: 'MDN',
      title: 'Documentation written as structure',
      observation:
        'MDN pages use a strict heading hierarchy, which is what makes their in-page navigation and search result snippets work.',
      takeaway:
        'The sidebar navigation is generated from the structure rather than maintained by hand. Good markup produces features for free.',
    },
    {
      id: 'example-gov-uk-semantics',
      source: 'GOV.UK',
      title: 'Semantics as a service requirement',
      observation:
        'GOV.UK services are built on plain semantic HTML with styling applied over the top, as a matter of published policy.',
      takeaway:
        'When a service must work for everyone, semantic structure stops being a nicety and becomes the baseline.',
    },
  ],
  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Turn the settings panel from Module 1 into an outline. No styling, no classes, no containers that are not needed.',
    },
    {
      kind: 'code',
      language: 'html',
      code: '<main>\n  <h1>Account settings</h1>\n\n  <section>\n    <h2>Profile</h2>\n\n    <label for="name">Name</label>\n    <input id="name" type="text">\n\n    <label for="email">Email</label>\n    <input id="email" type="email">\n  </section>\n\n  <button>Save changes</button>\n</main>',
    },
    {
      kind: 'paragraph',
      text: 'The new pieces here are `for` and `id`. `<label for="name">` points at the element whose `id` is `name` — that connection is what makes clicking the word "Name" focus the field. Without it the label is just nearby text.',
    },
    {
      kind: 'paragraph',
      text: '`type="email"` tells the browser what kind of value this is, which on a phone changes the keyboard that appears. `<main>` marks the primary content of the page, which is a landmark a screen reader can jump to.',
    },
    {
      kind: 'paragraph',
      text: 'Open that in a browser and it is unstyled and ugly, and it already works: every field is labelled, everything is reachable by keyboard, and the structure is navigable. Styling from here can only make it look better, not work better.',
    },
  ],
  commonMistakes: [
    {
      id: 'mistake-03-01-div-soup',
      mistake: 'Building everything from `<div>` because it is the easiest element to remember.',
      why: 'The page has no structure for anything non-visual to read, and keyboard behaviour has to be rebuilt by hand.',
      instead:
        'Ask what each piece of content is before choosing its element. Reach for `<div>` only when the honest answer is "a box".',
    },
    {
      id: 'mistake-03-01-headings-by-size',
      mistake: 'Choosing a heading level because of how large it should look.',
      why: 'It produces skipped levels and out-of-order structure, which makes heading navigation unreliable.',
      instead:
        'Choose the level from the document structure, then set the size in CSS. An h2 can be visually small.',
    },
  ],
  professionalConsideration: [
    {
      kind: 'paragraph',
      text: 'A quick test that catches most structural problems: read the page with styling disabled.',
    },
    {
      kind: 'paragraph',
      text: 'If the unstyled version still reads in a sensible order and you can tell what everything is, the structure is sound. If it becomes an unintelligible pile, the meaning was living in the CSS — which means it was not really there.',
    },
  ],
  practicalExercise: {
    id: 'exercise-html-gives-interfaces-structure-and-meaning',
    title: 'Outline a Figma page in HTML',
    prompt:
      'Take one screen you have designed and write its complete HTML outline, with no CSS at all.',
    steps: [
      'List the content in reading order before writing any markup.',
      'Decide the heading levels, checking that none are skipped.',
      'Write the markup using meaningful elements. Add a container only where you genuinely need one.',
      'Connect every form field to a label with `for` and `id`.',
      'Open it in a browser, unstyled, and read it top to bottom.',
      'Press Tab through it and confirm the order makes sense.',
      'Count your `<div>` elements and justify each one.',
    ],
    successCriteria: [
      'Exactly one `<h1>`, with no skipped levels below it.',
      'Every input has an associated label.',
      'The unstyled page reads in a sensible order.',
      'Tab order follows the visual order.',
      'Every `<div>` has a written justification.',
    ],
    estimatedMinutes: 45,
    hint: 'If you find yourself wanting a `<div>` to make something sit side by side, note it and move on — layout is the next two lessons. The outline should hold the meaning only.',
  },
  reflectionQuestion:
    'Why is it a problem to choose a heading level based on how large the text should be?',
  reflectionHint:
    'Think about who reads heading levels without seeing them, and what a skipped level tells them.',
  resources: [
    {
      id: 'resource-mdn-html-basics',
      title: 'Structuring content with HTML — MDN Learn',
      url: 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content',
      type: 'documentation',
      author: 'MDN',
      estimatedMinutes: 90,
      note: 'The core reference for this lesson. Work through the first few pages rather than reading it all.',
    },
    {
      id: 'resource-webaim-semantic-structure',
      title: 'Semantic Structure',
      url: 'https://webaim.org/techniques/semanticstructure/',
      type: 'article',
      author: 'WebAIM',
      estimatedMinutes: 12,
      note: 'Why headings and landmarks matter, written for people who are not yet engineers.',
    },
  ],
  competencyTags: ['html', 'accessibility', 'design-to-code-translation', 'visual-hierarchy'],
  completionCriteria: [
    'Can write a page outline in semantic HTML with no styling.',
    'Can connect labels to inputs correctly.',
    'Can justify every generic container in their markup.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Lesson 12                                                                   */
/* -------------------------------------------------------------------------- */

const LESSON_2: Lesson = {
  id: 'lesson-the-css-box-model',
  slug: 'the-css-box-model',
  moduleId: MODULE_ID,
  lessonNumber: 2,
  title: 'The CSS Box Model',
  summary:
    'Every element is a box with four layers. Understanding those layers is what turns "the spacing is wrong" into a specific, fixable problem.',
  estimatedMinutes: 9,
  objectives: [
    'Name the four layers of the box model and what each does.',
    'Write CSS that applies the spacing scale from Module 2.',
    'Explain the difference between padding and margin and choose correctly.',
    'Describe what `box-sizing` changes and why the standard choice exists.',
  ],
  prerequisiteConcepts: [
    'HTML elements and nesting from the previous lesson',
    'Spacing scales from Module 2',
  ],
  prerequisiteLessonIds: [
    'lesson-html-gives-interfaces-structure-and-meaning',
    'lesson-spacing-and-rhythm',
  ],
  recap: [
    {
      kind: 'paragraph',
      text: 'Last lesson you wrote an unstyled outline and confirmed it reads correctly. Now you give those elements size and space.',
    },
  ],
  priorKnowledge: [
    {
      kind: 'paragraph',
      text: 'You have a spacing scale from Module 2 and you know space expresses grouping. You also know, from Figma auto layout, that a frame has padding and that items within it have a gap.',
    },
    {
      kind: 'paragraph',
      text: 'The browser has the same ideas with different names, plus one more layer Figma does not separate.',
    },
  ],
  coreConcept: [
    {
      kind: 'paragraph',
      text: 'Every element on a page is a rectangle made of four nested layers, from the inside out:',
    },
    {
      kind: 'list',
      ordered: true,
      items: [
        'Content — the text or image itself.',
        'Padding — space inside the box, between the content and the edge. Backgrounds extend through it.',
        'Border — a line drawn at the edge.',
        'Margin — space outside the box, holding other elements away. Always transparent.',
      ],
    },
    {
      kind: 'paragraph',
      text: 'Padding is inside, margin is outside. That single distinction answers most spacing questions: if you want a background to extend behind the space, it is padding. If you want a gap between this element and the next, it is margin — or better, a gap set by the parent.',
    },
  ],
  whyDesignersCare: [
    {
      kind: 'paragraph',
      text: 'Because this is the vocabulary that makes spacing feedback actionable.',
    },
    {
      kind: 'paragraph',
      text: '"There is too much space around the button" could mean padding inside it, margin around it, or a gap set by its container — three different fixes with different consequences. Naming the layer turns a vague complaint into a one-line change.',
    },
  ],
  howItWorks: [
    {
      kind: 'paragraph',
      text: 'CSS is a list of rules. Each rule picks some elements and sets properties on them.',
    },
    {
      kind: 'code',
      language: 'css',
      code: '.card {\n  padding: 16px;\n  border: 1px solid #e5e5e5;\n  border-radius: 8px;\n}',
    },
    {
      kind: 'paragraph',
      text: 'Line by line. `.card` is a selector — it means "every element with the class `card`". The braces hold the properties. `padding: 16px` puts 16 pixels of space inside all four edges. `border: 1px solid #e5e5e5` draws a one-pixel solid line in that grey. `border-radius: 8px` rounds the corners.',
    },
    {
      kind: 'paragraph',
      text: 'A class is attached in the HTML like this:',
    },
    {
      kind: 'code',
      language: 'html',
      code: '<section class="card">\n  <h2>Profile</h2>\n</section>',
    },
    {
      kind: 'paragraph',
      text: 'That is the whole connection: `class="card"` in the HTML, `.card` in the CSS. The element keeps its meaning — it is still a `<section>` — and gains an appearance.',
    },
  ],
  firstPrinciples: [
    {
      kind: 'paragraph',
      text: 'One behaviour surprises everyone once. By default, setting a width sets the width of the *content*, and padding and border are added on top.',
    },
    {
      kind: 'paragraph',
      text: 'So a box with `width: 300px` and `padding: 16px` occupies 332 pixels, not 300. Almost nobody wants that, so essentially every project starts with one rule that changes it:',
    },
    {
      kind: 'code',
      language: 'css',
      code: '*,\n*::before,\n*::after {\n  box-sizing: border-box;\n}',
    },
    {
      kind: 'paragraph',
      text: '`*` means "every element". `box-sizing: border-box` tells the browser to include padding and border inside the stated width, so 300px means 300px. The two `::before` and `::after` lines cover generated content, which you will meet later — including them now simply means you never have to come back.',
    },
    {
      kind: 'callout',
      tone: 'note',
      body: 'Write this rule at the top of every stylesheet you create. It is the closest thing CSS has to a universally agreed default.',
    },
  ],
  designPerspective: [
    {
      kind: 'paragraph',
      text: 'The design question is where the space belongs conceptually.',
    },
    {
      kind: 'paragraph',
      text: 'Space inside a card is part of the card — it travels with it wherever the card goes, so it is padding. Space between two cards is a property of the arrangement, not of either card, so it should be set by whatever contains them. Getting this right is what makes a component reusable in a context you did not anticipate.',
    },
  ],
  engineeringPerspective: [
    {
      kind: 'paragraph',
      text: 'The engineering question is how to avoid margins fighting each other.',
    },
    {
      kind: 'paragraph',
      text: 'Vertical margins between adjacent elements collapse — two 16px margins produce a 16px gap, not 32. This is long-standing, correct behaviour and a reliable source of confusion. The modern practice is to avoid outer margins almost entirely and let containers set gaps instead, which you will do in the next lesson.',
    },
  ],
  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'Your Module 2 spacing scale becomes padding and gap values, directly and without translation.',
    },
    {
      kind: 'paragraph',
      text: 'A card with `padding: 16px` and rows with a `gap: 8px` is your scale, implemented. The design decision and the code are the same decision written twice, which is exactly what you want.',
    },
  ],
  industryExamples: [
    {
      id: 'example-figma-padding-parity',
      source: 'Figma',
      title: 'Padding that means the same thing in both tools',
      observation:
        'Auto layout padding and CSS padding describe the same thing: space inside a container, between its edge and its contents.',
      takeaway:
        'The vocabulary transfers almost exactly, which makes auto layout a genuinely good preparation for writing CSS.',
    },
    {
      id: 'example-primer-box-tokens',
      source: 'GitHub',
      title: 'Spacing as named values in code',
      observation:
        "GitHub's Primer exposes spacing as named tokens that are used wherever padding or gap is set.",
      takeaway:
        'The same restriction you applied in the design file applies in the stylesheet, which is what keeps the two in agreement.',
    },
  ],
  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Build a card that matches a simple design: 16px of internal padding, a one-pixel border, 8px rounded corners, and a heading sitting 8px above its description.',
    },
    {
      kind: 'code',
      language: 'html',
      code: '<section class="card">\n  <h2 class="card-title">Profile</h2>\n  <p class="card-text">Manage how you appear to other people.</p>\n</section>',
    },
    {
      kind: 'code',
      language: 'css',
      code: '*,\n*::before,\n*::after {\n  box-sizing: border-box;\n}\n\n.card {\n  padding: 16px;\n  border: 1px solid #e5e5e5;\n  border-radius: 8px;\n}\n\n.card-title {\n  margin: 0 0 8px 0;\n  font-size: 17px;\n}\n\n.card-text {\n  margin: 0;\n  font-size: 14px;\n}',
    },
    {
      kind: 'paragraph',
      text: 'Two new things. `margin: 0 0 8px 0` sets four margins in the order top, right, bottom, left — so this is 8px below and nothing elsewhere. Setting the others to zero matters because browsers apply default margins to headings and paragraphs, and those defaults will not match your scale.',
    },
    {
      kind: 'paragraph',
      text: 'Notice the title owns the gap below itself here. That works, and in the next lesson you will see the better version where the card owns it instead — which means the title can move anywhere without carrying an assumption with it.',
    },
  ],
  commonMistakes: [
    {
      id: 'mistake-03-02-forgetting-box-sizing',
      mistake: 'Not setting `box-sizing: border-box` and then fighting unexplained widths.',
      why: 'Padding silently adds to every width, so nothing lines up and the cause is invisible.',
      instead: 'Put the universal rule at the top of every stylesheet, once, and forget about it.',
    },
    {
      id: 'mistake-03-02-margin-for-internal-space',
      mistake: 'Using margin where padding is meant.',
      why: 'Margin sits outside the background, so the space does not get the card colour — and it collapses unpredictably against neighbours.',
      instead:
        'If the space should be inside the element, including behind its background, it is padding.',
    },
  ],
  professionalConsideration: [
    {
      kind: 'paragraph',
      text: 'Browsers apply their own default styles before yours — margins on headings, padding on lists, borders on form fields.',
    },
    {
      kind: 'paragraph',
      text: 'Most projects normalise a small set of these deliberately rather than resetting everything to zero. A full reset removes useful defaults too, including the ones that make an unstyled page readable. Removing exactly what you intend to replace is the more maintainable position.',
    },
  ],
  practicalExercise: {
    id: 'exercise-the-css-box-model',
    title: 'Build a card from a design',
    prompt:
      'Take a simple card from one of your designs and build it in HTML and CSS so the measurements match.',
    steps: [
      'Start a stylesheet with the universal `box-sizing` rule.',
      'Write the card markup using meaningful elements.',
      'Measure the design: internal padding, border, radius, and the gap between the pieces inside.',
      'Write CSS using only values from your Module 2 spacing scale.',
      'Zero out the browser default margins that interfere.',
      'Open the browser inspector, select the card, and compare the computed box to your design.',
      'For each space, write down whether it is padding or margin, and why.',
    ],
    successCriteria: [
      'The universal box-sizing rule is present.',
      'Every spacing value comes from the Module 2 scale.',
      'The rendered measurements match the design.',
      'Each space is classified as padding or margin with a reason.',
      'Default margins that interfered are explicitly reset.',
    ],
    estimatedMinutes: 50,
    hint: 'Open the browser inspector and hover the element. It draws the four layers in different colours — that picture is the fastest way to see which layer a space is actually in.',
  },
  reflectionQuestion:
    'When should space belong to an element itself, and when should it belong to whatever contains it?',
  reflectionHint:
    'Think about moving the element somewhere else. Which spaces should travel with it, and which were really about its neighbours?',
  resources: [
    {
      id: 'resource-mdn-box-model-full',
      title: 'The box model — MDN Learn',
      url: 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Box_model',
      type: 'documentation',
      author: 'MDN',
      estimatedMinutes: 30,
      note: 'The authoritative explanation, with interactive examples you can modify in place.',
    },
    {
      id: 'resource-webdev-box-model',
      title: 'Box Model — Learn CSS',
      url: 'https://web.dev/learn/css/box-model',
      type: 'documentation',
      author: 'web.dev',
      estimatedMinutes: 20,
      note: 'A shorter treatment with good diagrams of the four layers.',
    },
  ],
  competencyTags: ['css', 'layout', 'design-to-code-translation'],
  completionCriteria: [
    'Can name the four layers and choose padding or margin correctly.',
    'Can apply a spacing scale in CSS.',
    'Can use the browser inspector to check a rendered box against a design.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Lesson 13                                                                   */
/* -------------------------------------------------------------------------- */

const LESSON_3: Lesson = {
  id: 'lesson-building-layouts-with-flexbox',
  slug: 'building-layouts-with-flexbox',
  moduleId: MODULE_ID,
  lessonNumber: 3,
  title: 'Building Layouts With Flexbox',
  summary:
    'Flexbox arranges things in a row or a column and decides how leftover space is shared. If you use auto layout, you already know how it thinks.',
  estimatedMinutes: 9,
  objectives: [
    'Arrange elements in a row or column with controlled spacing.',
    'Align and distribute items along both axes.',
    'Use grow and shrink to decide which element absorbs spare space.',
    'Recognise which layout problems Flexbox is the right tool for.',
  ],
  prerequisiteConcepts: ['The box model', 'Spacing scales', 'Auto layout in Figma'],
  prerequisiteLessonIds: ['lesson-the-css-box-model'],
  recap: [
    {
      kind: 'paragraph',
      text: 'Last lesson you built a single card and saw that space belongs either inside an element or between it and its neighbours. This lesson is about who sets the between.',
    },
  ],
  priorKnowledge: [
    {
      kind: 'paragraph',
      text: 'If you have used auto layout in Figma, you already know this model: a container with a direction, a gap, and alignment settings, holding children that may stretch or stay fixed.',
    },
    {
      kind: 'paragraph',
      text: 'Flexbox is the same idea. Auto layout was built to match it.',
    },
  ],
  coreConcept: [
    {
      kind: 'paragraph',
      text: 'Flexbox is a mode you switch on for a container. Once on, the container arranges its direct children along one axis and controls the space between and around them.',
    },
    {
      kind: 'code',
      language: 'css',
      code: '.toolbar {\n  display: flex;\n  gap: 8px;\n}',
    },
    {
      kind: 'paragraph',
      text: '`display: flex` turns the container into a flex container; its children now sit in a row. `gap: 8px` puts 8 pixels between each pair of children — set once, on the parent, applying to every gap.',
    },
    {
      kind: 'paragraph',
      text: 'That is the whole of the common case. Two lines replace a great deal of the margin juggling that used to be necessary.',
    },
  ],
  whyDesignersCare: [
    {
      kind: 'paragraph',
      text: 'Because `gap` is where your spacing scale finally pays off.',
    },
    {
      kind: 'paragraph',
      text: 'One value on the container produces every gap in the row. Change it once and the whole arrangement re-spaces. There is no opportunity for the fourth item to end up 2px out, because there is only one number.',
    },
  ],
  howItWorks: [
    {
      kind: 'paragraph',
      text: 'Four properties cover nearly everything.',
    },
    {
      kind: 'code',
      language: 'css',
      code: '.header {\n  display: flex;\n  flex-direction: row;\n  justify-content: space-between;\n  align-items: center;\n  gap: 16px;\n}',
    },
    {
      kind: 'paragraph',
      text: 'Line by line. `flex-direction: row` lays children out horizontally — this is the default, so it is often omitted; `column` stacks them vertically instead.',
    },
    {
      kind: 'paragraph',
      text: '`justify-content` controls distribution along the direction of the row. `space-between` pushes the first item to the start, the last to the end, and shares the remainder. Other common values are `flex-start`, `center` and `flex-end`.',
    },
    {
      kind: 'paragraph',
      text: '`align-items` controls the other axis — for a row, that is vertical. `center` vertically centres items of different heights, which is how a logo and a button end up aligned in a header. `stretch` is the default and makes them equal height.',
    },
    {
      kind: 'paragraph',
      text: 'The axis names swap when direction is `column`. That is the one genuinely confusing part, and the way to keep it straight is to remember that `justify-content` always works along the direction you chose.',
    },
  ],
  firstPrinciples: [
    {
      kind: 'paragraph',
      text: 'The second idea is flexibility: which child absorbs leftover space, and which gives way when there is not enough.',
    },
    {
      kind: 'code',
      language: 'css',
      code: '.search-field {\n  flex: 1;\n}',
    },
    {
      kind: 'paragraph',
      text: '`flex: 1` on a child means "take the available space". In a toolbar with a search field and two buttons, putting this on the search field makes it fill whatever the buttons leave. The buttons stay their natural size.',
    },
    {
      kind: 'paragraph',
      text: 'Without it, every child stays at its content size and the spare space collects at one end. Deciding which element grows is a design decision you are now able to express in one line.',
    },
  ],
  designPerspective: [
    {
      kind: 'paragraph',
      text: 'The design question is what should happen to this arrangement when there is more space, and when there is less.',
    },
    {
      kind: 'paragraph',
      text: 'In a mockup the width is fixed, so the question never arises. In a browser it always does. Answering it — "the field grows, the buttons do not; below 480px they wrap" — is the part of responsive design that Flexbox implements directly.',
    },
  ],
  engineeringPerspective: [
    {
      kind: 'paragraph',
      text: 'The engineering question is whether a layout needs a breakpoint at all.',
    },
    {
      kind: 'code',
      language: 'css',
      code: '.toolbar {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 8px;\n}',
    },
    {
      kind: 'paragraph',
      text: '`flex-wrap: wrap` lets children move onto a new line when they no longer fit. No width is mentioned, so it works at every width — including the ones nobody tested. This is the "let the layout do it without being told" idea from Module 2, made concrete.',
    },
  ],
  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'Flexbox is a near-direct translation of auto layout, which makes it the cheapest possible handoff.',
    },
    {
      kind: 'paragraph',
      text: 'Direction, gap, alignment and distribution exist in both tools under recognisably the same names. A design built with auto layout can be described to an engineer in words that map one-to-one onto the CSS — which is a rare luxury.',
    },
  ],
  industryExamples: [
    {
      id: 'example-figma-autolayout-flex',
      source: 'Figma',
      title: 'Auto layout as a flexbox editor',
      observation:
        'Auto layout offers direction, gap, padding, alignment and distribution — the same controls Flexbox exposes.',
      takeaway:
        'Designing in auto layout is effectively specifying the CSS. Designs built this way are markedly cheaper to implement.',
    },
    {
      id: 'example-linear-toolbar',
      source: 'Linear',
      title: 'One element absorbing the slack',
      observation:
        'Linear’s toolbars keep controls at their natural size and let a single element take the remaining width.',
      takeaway:
        'Deciding which element flexes is what stops a toolbar from redistributing awkwardly as the window changes.',
    },
  ],
  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Build a header: a product name on the left, navigation in the middle, a button on the right.',
    },
    {
      kind: 'code',
      language: 'html',
      code: '<header class="site-header">\n  <span class="brand">Acme</span>\n\n  <nav class="nav">\n    <a href="/pricing">Pricing</a>\n    <a href="/docs">Docs</a>\n  </nav>\n\n  <button>Sign in</button>\n</header>',
    },
    {
      kind: 'code',
      language: 'css',
      code: '.site-header {\n  display: flex;\n  align-items: center;\n  gap: 24px;\n  padding: 12px 16px;\n}\n\n.nav {\n  display: flex;\n  gap: 16px;\n  flex: 1;\n}',
    },
    {
      kind: 'paragraph',
      text: 'The header is a flex row with its items vertically centred and 24px between the three regions. `padding: 12px 16px` is the two-value form: 12 top and bottom, 16 left and right.',
    },
    {
      kind: 'paragraph',
      text: 'The nav is itself a flex row — containers nest freely — with 16px between its links. `flex: 1` makes it absorb the spare width, which pushes the button to the right edge without any alignment trickery.',
    },
    {
      kind: 'paragraph',
      text: 'Resize the window. The brand and button hold their size, the nav takes the difference. Nothing breaks, and no breakpoint was written.',
    },
  ],
  commonMistakes: [
    {
      id: 'mistake-03-03-margins-instead-of-gap',
      mistake: 'Spacing flex children with margins on each child.',
      why: 'Every child carries an assumption about its neighbours, and the last one usually needs an exception.',
      instead: 'Set `gap` once on the container. There are then no exceptions to maintain.',
    },
    {
      id: 'mistake-03-03-flex-for-grids',
      mistake: 'Using Flexbox to build a two-dimensional grid.',
      why: 'Flexbox works along one axis. Making rows and columns line up both ways requires fixed widths and fragile arithmetic.',
      instead: 'Use Grid, which is the next lesson and is built for exactly this.',
    },
  ],
  professionalConsideration: [
    {
      kind: 'paragraph',
      text: 'Flex children shrink below their content size by default, which is how long text in a flex row produces overflow instead of wrapping.',
    },
    {
      kind: 'paragraph',
      text: 'The usual remedy is `min-width: 0` on the child that holds the text. It looks arbitrary until you know the cause: the child has an automatic minimum size equal to its content, and setting it to zero allows it to shrink and wrap. This single line resolves a large share of mysterious overflow bugs.',
    },
  ],
  practicalExercise: {
    id: 'exercise-building-layouts-with-flexbox',
    title: 'Build a navigation bar and a toolbar',
    prompt:
      'Build two real arrangements with Flexbox: a site header and a toolbar containing a search field and actions.',
    steps: [
      'Write the markup for both using meaningful elements.',
      'Lay out the header: brand left, navigation, action right.',
      'Lay out the toolbar: a search field that grows, with fixed-size buttons beside it.',
      'Use `gap` for all spacing between children. No margins between siblings.',
      'Make the toolbar wrap rather than overflow when space runs out.',
      'Resize from 320px to 1440px and confirm neither breaks at any width.',
      'Add long text to one element and fix any overflow it causes.',
    ],
    successCriteria: [
      'All sibling spacing uses `gap`.',
      'Exactly one element in the toolbar grows; the rest keep their natural size.',
      'Both layouts survive the full range from 320px to 1440px.',
      'The toolbar wraps rather than overflowing.',
      'Long text wraps instead of pushing the layout wider.',
    ],
    estimatedMinutes: 55,
    hint: 'When something overflows instead of wrapping, suspect the automatic minimum size before anything else. `min-width: 0` on the growing child is the usual fix.',
  },
  reflectionQuestion:
    'Why is setting `gap` on a container better than setting margins on each child?',
  reflectionHint:
    'Consider what happens to the last child, and what happens when the order of children changes.',
  resources: [
    {
      id: 'resource-mdn-flexbox',
      title: 'Flexbox — MDN Learn',
      url: 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Flexbox',
      type: 'documentation',
      author: 'MDN',
      estimatedMinutes: 40,
      note: 'The reference for every property in this lesson, with live examples.',
    },
    {
      id: 'resource-css-tricks-flexbox',
      title: 'A Complete Guide to Flexbox',
      url: 'https://css-tricks.com/snippets/a-guide-to-flexbox/',
      type: 'article',
      author: 'CSS-Tricks',
      estimatedMinutes: 25,
      note: 'The diagram-led guide most practitioners keep bookmarked. Good for looking up a property quickly.',
    },
  ],
  competencyTags: ['css', 'layout', 'responsive-design', 'design-to-code-translation'],
  completionCriteria: [
    'Can build a row or column layout with controlled gaps.',
    'Can decide which child grows and express it in one line.',
    'Can make a layout wrap without writing a breakpoint.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Lesson 14                                                                   */
/* -------------------------------------------------------------------------- */

const LESSON_4: Lesson = {
  id: 'lesson-building-responsive-layouts-with-grid',
  slug: 'building-responsive-layouts-with-grid',
  moduleId: MODULE_ID,
  lessonNumber: 4,
  title: 'Building Responsive Layouts With Grid',
  summary:
    'Grid lays things out in two directions at once, and can decide how many columns fit without being told a single breakpoint.',
  estimatedMinutes: 9,
  objectives: [
    'Define columns and rows with explicit tracks.',
    'Use fractional units to divide available space.',
    'Build a card grid that reflows with no breakpoints.',
    'Choose correctly between Grid and Flexbox.',
  ],
  prerequisiteConcepts: ['Flexbox', 'The box model', 'Responsive thinking from Module 2'],
  prerequisiteLessonIds: [
    'lesson-building-layouts-with-flexbox',
    'lesson-responsive-layout-thinking',
  ],
  recap: [
    {
      kind: 'paragraph',
      text: 'Last lesson you arranged things along one axis with Flexbox, and ended on the point that two-dimensional alignment is not what it is for.',
    },
  ],
  priorKnowledge: [
    {
      kind: 'paragraph',
      text: 'You know containers can own spacing through `gap`, and you know from Module 2 that breakpoints should come from content rather than devices. Grid is the tool that lets you act on that.',
    },
  ],
  coreConcept: [
    {
      kind: 'paragraph',
      text: 'Grid lets a container define columns and rows, and places its children into them. Unlike Flexbox, items line up in both directions at once.',
    },
    {
      kind: 'code',
      language: 'css',
      code: '.cards {\n  display: grid;\n  grid-template-columns: 1fr 1fr 1fr;\n  gap: 16px;\n}',
    },
    {
      kind: 'paragraph',
      text: '`display: grid` switches the mode on. `grid-template-columns` defines the columns — here three of them. `1fr` means one fraction of the available space, so three equal columns. `gap` works exactly as it did in Flexbox, now in both directions.',
    },
    {
      kind: 'paragraph',
      text: '`fr` is the unit that makes this pleasant. It divides what is left after gaps and fixed-size items are accounted for, so you never do the arithmetic yourself.',
    },
  ],
  whyDesignersCare: [
    {
      kind: 'paragraph',
      text: 'Because Grid can express "as many columns as comfortably fit" — which is what you actually mean, and what three fixed breakpoints only approximate.',
    },
    {
      kind: 'paragraph',
      text: 'It also means a card grid behaves sensibly at the widths nobody drew, which was the exact failure described in Module 2.',
    },
  ],
  howItWorks: [
    {
      kind: 'paragraph',
      text: 'Here is the line that removes breakpoints from a card grid. It is dense, so take it one piece at a time.',
    },
    {
      kind: 'code',
      language: 'css',
      code: '.cards {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));\n  gap: 16px;\n}',
    },
    {
      kind: 'paragraph',
      text: '`repeat(...)` avoids writing the same column definition several times.',
    },
    {
      kind: 'paragraph',
      text: '`auto-fit` means "work out how many fit" rather than a fixed count.',
    },
    {
      kind: 'paragraph',
      text: '`minmax(240px, 1fr)` says each column is at least 240px and at most one fraction of the space. So the browser fits as many 240px columns as it can, then shares any remainder between them equally.',
    },
    {
      kind: 'paragraph',
      text: 'The result: four columns on a wide screen, two on a tablet, one on a phone — and correct at every width in between. No breakpoint is written, and none is needed.',
    },
    {
      kind: 'callout',
      tone: 'insight',
      body: 'This single declaration replaces the three media queries a card grid would otherwise need, and handles the widths those queries would have missed.',
    },
  ],
  firstPrinciples: [
    {
      kind: 'paragraph',
      text: 'The deeper idea is that you are describing constraints rather than positions.',
    },
    {
      kind: 'paragraph',
      text: '"Each card needs at least 240px" is a fact about the content — below that the title wraps badly. "Three columns at 1440px" is a consequence of that fact plus the available width. Stating the fact and letting the browser derive the consequence is more robust than stating the consequence directly.',
    },
    {
      kind: 'paragraph',
      text: 'This is the same shift as Module 2: decide what the content needs, and let the layout follow.',
    },
  ],
  designPerspective: [
    {
      kind: 'paragraph',
      text: 'The design question becomes "what is the minimum comfortable width for this card?" rather than "how many columns at each size?"',
    },
    {
      kind: 'paragraph',
      text: 'That is a better question because you can answer it by looking at one card, and the answer stays true regardless of what screens exist next year.',
    },
  ],
  engineeringPerspective: [
    {
      kind: 'paragraph',
      text: 'The engineering question is which of the two tools fits the problem.',
    },
    {
      kind: 'list',
      items: [
        'Flexbox — content in one direction, where the sizes come from the content. Toolbars, headers, button rows.',
        'Grid — a defined structure in two directions, where items should align across rows. Card grids, page layouts, forms with aligned labels.',
      ],
    },
    {
      kind: 'paragraph',
      text: 'They are not competitors, and real pages use both constantly: Grid for the page skeleton, Flexbox inside each region.',
    },
  ],
  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'Grid lets a designer specify intent instead of outcomes.',
    },
    {
      kind: 'paragraph',
      text: '"Cards are at least 240px and fill the row" is a complete, implementable specification that works everywhere. "Three columns on desktop, two on tablet" is a description of two screenshots which leaves every other width undefined.',
    },
  ],
  industryExamples: [
    {
      id: 'example-vercel-grid-dashboard',
      source: 'Vercel',
      title: 'Project grids that reflow continuously',
      observation:
        'Vercel’s dashboard shows project cards in a grid that changes column count smoothly as the window is resized.',
      takeaway:
        'The behaviour between the common sizes is as considered as the behaviour at them — which is what `auto-fit` gives you.',
    },
    {
      id: 'example-webdev-grid-guidance',
      source: 'Google',
      title: 'Guidance that leads with intrinsic sizing',
      observation:
        'web.dev’s layout material teaches content-driven sizing before media queries.',
      takeaway:
        'The modern default is to reach for a breakpoint only after the layout cannot solve the problem itself.',
    },
  ],
  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Build a responsive card grid, then place it inside a page skeleton.',
    },
    {
      kind: 'code',
      language: 'html',
      code: '<main class="page">\n  <aside class="sidebar">Filters</aside>\n\n  <div class="cards">\n    <article class="card">One</article>\n    <article class="card">Two</article>\n    <article class="card">Three</article>\n  </div>\n</main>',
    },
    {
      kind: 'code',
      language: 'css',
      code: '.page {\n  display: grid;\n  grid-template-columns: 240px 1fr;\n  gap: 24px;\n}\n\n.cards {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));\n  gap: 16px;\n}',
    },
    {
      kind: 'paragraph',
      text: 'The page is a two-column grid: a fixed 240px sidebar and a main area taking everything else. Mixing a fixed track with a fractional one is common and reads exactly as it looks.',
    },
    {
      kind: 'paragraph',
      text: 'Inside the main area, the cards are their own grid that fits as many columns as the remaining space allows. Two grids, nested, each solving one problem.',
    },
    {
      kind: 'paragraph',
      text: 'At narrow widths you would want the sidebar to stack above the content. That is one breakpoint — a genuine one, placed where the content stops working rather than at a device size.',
    },
  ],
  commonMistakes: [
    {
      id: 'mistake-03-04-fixed-column-counts',
      mistake: 'Writing a fixed number of columns and a media query for each width.',
      why: 'It only behaves correctly at the widths you tested, and needs revisiting whenever the card design changes.',
      instead:
        'Use `auto-fit` with `minmax`. State the card’s minimum width and let the count follow.',
    },
    {
      id: 'mistake-03-04-grid-for-everything',
      mistake: 'Using Grid for simple one-direction arrangements.',
      why: 'It works, but it is more declaration than the problem needs, and reads as though two-dimensional alignment mattered when it did not.',
      instead: 'Use Flexbox for a row of items. Reach for Grid when things must align both ways.',
    },
  ],
  professionalConsideration: [
    {
      kind: 'paragraph',
      text: '`auto-fit` and `auto-fill` look identical until a row is not full.',
    },
    {
      kind: 'paragraph',
      text: '`auto-fit` collapses the empty tracks, so two cards stretch to fill the row. `auto-fill` keeps them, so two cards stay at their minimum width with a gap to the right. Neither is correct in general — which you want depends on whether a half-empty row should look full or should preserve the grid. Knowing both exist is what lets you choose.',
    },
  ],
  practicalExercise: {
    id: 'exercise-building-responsive-layouts-with-grid',
    title: 'Build a responsive card grid',
    prompt:
      'Build a card grid that reflows from one to four columns without a single breakpoint, inside a page skeleton that uses one.',
    steps: [
      'Decide the minimum comfortable width of one card by designing or examining a card first.',
      'Build the grid with `auto-fit` and `minmax` using that width.',
      'Build a page skeleton with a sidebar and main area.',
      'Resize continuously from 320px to 1600px and watch the column count change.',
      'Find the width at which the sidebar layout stops working, and add one breakpoint there.',
      'Try `auto-fill` instead of `auto-fit` with three cards and note the difference.',
      'Confirm cards stay aligned across rows when their content length differs.',
    ],
    successCriteria: [
      'The card grid has no breakpoints.',
      'The minimum card width is justified by the card’s own content.',
      'Exactly one breakpoint exists, for the sidebar, placed by content.',
      'The difference between `auto-fit` and `auto-fill` is observed and described.',
      'Cards with differing content lengths still align across rows.',
    ],
    estimatedMinutes: 55,
    hint: 'Drag the window edge slowly rather than jumping between sizes. The moment a column is added or removed tells you whether your minimum width is right.',
  },
  reflectionQuestion:
    'Why is specifying a minimum card width more robust than specifying a column count per breakpoint?',
  reflectionHint:
    'One of those facts comes from the content and one comes from a list of devices. Ask which is more likely to still be true in two years.',
  resources: [
    {
      id: 'resource-mdn-grid',
      title: 'Grids — MDN Learn',
      url: 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Grids',
      type: 'documentation',
      author: 'MDN',
      estimatedMinutes: 45,
      note: 'Tracks, fractions and placement, with examples you can edit in the page.',
    },
    {
      id: 'resource-css-tricks-grid',
      title: 'A Complete Guide to CSS Grid',
      url: 'https://css-tricks.com/snippets/css/complete-guide-grid/',
      type: 'article',
      author: 'CSS-Tricks',
      estimatedMinutes: 30,
      note: 'The standard illustrated reference. Useful for looking up the properties you meet later.',
    },
  ],
  competencyTags: ['css', 'layout', 'responsive-design', 'design-to-code-translation'],
  completionCriteria: [
    'Can build a grid that reflows with no breakpoints.',
    'Can justify a minimum track size from the content.',
    'Can choose correctly between Grid and Flexbox and say why.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Lesson 15                                                                   */
/* -------------------------------------------------------------------------- */

const LESSON_5: Lesson = {
  id: 'lesson-turning-a-figma-design-into-a-browser-interface',
  slug: 'turning-a-figma-design-into-a-browser-interface',
  moduleId: MODULE_ID,
  lessonNumber: 5,
  title: 'Turning a Figma Design Into a Browser Interface',
  summary:
    'A repeatable order of operations for getting from a design file to a working page — and the habit of reading a design for structure before reading it for values.',
  estimatedMinutes: 9,
  objectives: [
    'Follow a reliable order of operations from design to built page.',
    'Extract reusable styles from a design before writing any CSS.',
    'Decide what in a design is a decision and what is an accident.',
    'Test a build against its design systematically.',
  ],
  prerequisiteConcepts: ['Semantic HTML', 'The box model', 'Flexbox', 'Grid'],
  prerequisiteLessonIds: [
    'lesson-building-responsive-layouts-with-grid',
    'lesson-html-gives-interfaces-structure-and-meaning',
  ],
  recap: [
    {
      kind: 'paragraph',
      text: 'You can now write semantic structure, control spacing, and build layouts in one and two directions. This lesson puts those in order.',
    },
  ],
  priorKnowledge: [
    {
      kind: 'paragraph',
      text: 'You have every individual skill this lesson uses. What is new is the sequence — and the fact that the sequence starts in the design file rather than in the editor.',
    },
  ],
  coreConcept: [
    {
      kind: 'paragraph',
      text: 'There is an order that works, and most of the difficulty people experience comes from doing it in a different one.',
    },
    {
      kind: 'list',
      ordered: true,
      items: [
        'Read the design for structure. What are the regions, and what is repeated?',
        'Extract the reusable values: spacing, type, colour.',
        'Write the semantic HTML outline, with no styling.',
        'Build the layout: Grid for the skeleton, Flexbox inside.',
        'Style: type, colour, borders, radius.',
        'Test across widths, and with the keyboard.',
      ],
    },
    {
      kind: 'paragraph',
      text: 'The common failure is starting at step five — opening the file and styling the first element you see. That produces a page that looks right in one state and has no structure underneath it.',
    },
  ],
  whyDesignersCare: [
    {
      kind: 'paragraph',
      text: 'Because this order is also how you should hand a design over, whether or not you are the one building it.',
    },
    {
      kind: 'paragraph',
      text: 'A handoff that leads with structure and shared values is far more likely to be implemented as intended than one that leads with a pixel inspection panel. You are, in effect, writing steps one and two for whoever builds it.',
    },
  ],
  howItWorks: [
    {
      kind: 'paragraph',
      text: 'Step one, reading for structure, is the step people skip. Do it in words, not in code.',
    },
    {
      kind: 'list',
      items: [
        'What are the major regions? Header, sidebar, main, footer.',
        'What repeats? Cards, rows, fields. Count the occurrences.',
        'What is the reading order, and what are the heading levels?',
        'Which elements are interactive, and which control is each one?',
      ],
    },
    {
      kind: 'paragraph',
      text: 'Step two is extraction. Go through the design and list every distinct spacing value, type style and colour. If your design was built on the systems from Module 2, this takes minutes and the list is short. If it was not, the list will be long — and that length is the finding.',
    },
    {
      kind: 'paragraph',
      text: 'A design with nineteen spacing values and eleven greys is telling you that decisions were made per-element. Resolving that before writing CSS is cheaper than encoding it and resolving it later.',
    },
  ],
  firstPrinciples: [
    {
      kind: 'paragraph',
      text: 'The judgement running through all of this is distinguishing a decision from an accident.',
    },
    {
      kind: 'paragraph',
      text: 'A 24px gap that appears eleven times is a decision. A 23px gap that appears once is almost certainly a nudge nobody meant. Implementing both faithfully encodes the accident permanently, and makes the resulting CSS impossible to systematise.',
    },
    {
      kind: 'paragraph',
      text: 'Reading a design for intent rather than for measurements is the difference between building the interface and transcribing the file.',
    },
  ],
  designPerspective: [
    {
      kind: 'paragraph',
      text: 'The design question is which parts of the design are load-bearing.',
    },
    {
      kind: 'paragraph',
      text: 'If this heading has to be exactly 28px and that card exactly 312px wide, say so. If what matters is that the heading dominates and the cards fit three across comfortably, say that instead — it is more useful and it is what you actually mean.',
    },
  ],
  engineeringPerspective: [
    {
      kind: 'paragraph',
      text: 'The engineering question is what the design does not specify, which is always a lot.',
    },
    {
      kind: 'paragraph',
      text: 'What happens at 900px? What if the product name is three times longer? What if there are no items yet? A design file shows a finite number of states with plausible content. A built page has to hold up for all content and all widths, so these questions have to be asked — ideally before building, not after.',
    },
  ],
  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'Doing this yourself, even once, permanently changes how you design.',
    },
    {
      kind: 'paragraph',
      text: 'After building one page you will start designing with structure in mind — grouping things because they belong together rather than because it looked balanced, and reusing values because you know what the alternative costs. That is the whole point of a designer learning to build.',
    },
  ],
  industryExamples: [
    {
      id: 'example-figma-dev-mode',
      source: 'Figma',
      title: 'Inspection as a starting point, not an answer',
      observation:
        'Figma can show CSS-like values for any selected layer.',
      takeaway:
        'Useful for checking a value, misleading as a way to build. It describes one layer in isolation and knows nothing about structure or reuse.',
    },
    {
      id: 'example-polaris-handoff',
      source: 'Shopify',
      title: 'Handing over tokens rather than measurements',
      observation:
        'Polaris documents named tokens, so a handoff can reference `space-400` instead of a pixel value.',
      takeaway:
        'When both sides share the vocabulary, the inspection panel stops being the interface between design and code.',
    },
  ],
  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Implement a product card from a design, following the order.',
    },
    {
      kind: 'list',
      ordered: true,
      items: [
        'Structure: an image, a title, a price, a description, a button. The title is a heading; the price is emphasised text, not a heading.',
        'Values: three spacing values (16 inside, 8 between pieces, 24 between cards), two type styles, three colours.',
        'HTML: an `<article>` containing `<img>`, `<h3>`, a price element, `<p>`, and `<button>`.',
        'Layout: the card is a flex column with `gap: 8px`. The grid of cards is the `auto-fit` grid from last lesson.',
        'Style: apply type, colour, border and radius.',
        'Test: resize 320 to 1440, Tab through the buttons, then triple the length of one title.',
      ],
    },
    {
      kind: 'paragraph',
      text: 'The last test is the one that finds real problems. A title three times longer than the design showed will reveal whether the card has a fixed height, whether the button stays aligned with its neighbours, and whether the text wraps or overflows.',
    },
    {
      kind: 'paragraph',
      text: 'None of that is visible in the design file. All of it is visible within seconds in a browser, which is the single best argument for a designer being able to open one.',
    },
  ],
  commonMistakes: [
    {
      id: 'mistake-03-05-styling-first',
      mistake: 'Opening the editor and styling the first element you see.',
      why: 'Structure gets retrofitted around the styling, which produces extra wrappers and markup that cannot be reused.',
      instead: 'Write the whole outline first. It takes ten minutes and saves the rewrite.',
    },
    {
      id: 'mistake-03-05-pixel-transcription',
      mistake: 'Copying every measurement out of the inspection panel.',
      why: 'It encodes accidents as faithfully as decisions, and produces CSS with no system in it.',
      instead:
        'Extract the repeated values first. Treat a one-off value as a question for the designer — even when the designer is you.',
    },
  ],
  professionalConsideration: [
    {
      kind: 'paragraph',
      text: 'Build with the most hostile content you can justify, not the content in the design.',
    },
    {
      kind: 'paragraph',
      text: 'Designs use names that fit and lists with exactly enough items. Real products have a user called Konstantinos Papadopoulos-Williamson and categories with one entry. Testing with awkward content during the build is how you find the layout’s assumptions while they are still cheap to change.',
    },
  ],
  practicalExercise: {
    id: 'exercise-turning-a-figma-design-into-a-browser-interface',
    title: 'Implement one section you designed',
    prompt:
      'Take one self-contained section from a screen in your own portfolio — a card grid, a pricing row, a settings panel — and implement it in HTML and CSS, following the six-step order exactly. One section, not the whole screen: the module project is where you build a full page, and the point here is to run the order once without the scope getting in the way.',
    steps: [
      'Write the structural reading: regions, repeated patterns, heading levels, interactive elements.',
      'Extract every distinct spacing value, type style and colour. Note anything that appears only once.',
      'Write the complete HTML outline with no CSS, and check it unstyled.',
      'Build the layout with Grid and Flexbox.',
      'Apply type, colour and borders.',
      'Test the section at 320, 768 and 1440, then at two widths in between.',
      'Tab through the section.',
      'Replace the content with the longest and shortest plausible text and fix what breaks.',
    ],
    successCriteria: [
      'The structural reading was written before any code.',
      'An extracted value list exists, with one-off values flagged.',
      'The unstyled outline reads correctly on its own.',
      'The section holds at five widths, including two not drawn.',
      'Every interactive element is keyboard reachable in a sensible order.',
      'The section survives content of unexpected length.',
    ],
    estimatedMinutes: 75,
    hint: 'When you hit something the design does not answer, write the question down rather than inventing an answer silently. That list is the most valuable output of the exercise.',
  },
  reflectionQuestion:
    'What did building one of your own designs tell you about how you design?',
  reflectionHint:
    'Look at your list of one-off values and unanswered questions. What pattern do they have in common?',
  resources: [
    {
      id: 'resource-figma-dev-mode-docs',
      title: 'Dev Mode — Figma',
      url: 'https://help.figma.com/hc/en-us/articles/15023124644247-Guide-to-Dev-Mode',
      type: 'documentation',
      author: 'Figma',
      estimatedMinutes: 20,
      note: 'What inspection can and cannot tell you. Useful once you know it is a reference, not a build plan.',
    },
    {
      id: 'resource-webdev-learn-css',
      title: 'Learn CSS',
      url: 'https://web.dev/learn/css',
      type: 'documentation',
      author: 'web.dev',
      estimatedMinutes: 240,
      note: 'The complete course behind this module. Return to it whenever a property is unfamiliar.',
    },
  ],
  competencyTags: [
    'design-to-code-translation',
    'css',
    'html',
    'layout',
    'responsive-design',
  ],
  completionCriteria: [
    'Can follow the six-step order from design to built page.',
    'Can distinguish a repeated decision from a one-off accident in a design.',
    'Has built one of their own designs and tested it with hostile content.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Project                                                                     */
/* -------------------------------------------------------------------------- */

const PROJECT: ModuleProject = {
  id: 'project-responsive-product-page',
  slug: 'responsive-product-page',
  moduleId: MODULE_ID,
  title: 'Responsive Product Page',
  brief:
    'Build a complete product page from scratch in semantic HTML and CSS — no framework, no component library — that works at every width from 320px upwards.',
  learnerGoal:
    'Produce the first thing you have both designed and built, and prove it holds up under content you did not plan for.',
  problem:
    'A product page has a page skeleton, a repeated card pattern, dense text, and a clear primary action. It exercises every layout tool in this module without needing any behaviour you have not been taught.',
  prerequisiteLessonIds: [
    'lesson-html-gives-interfaces-structure-and-meaning',
    'lesson-the-css-box-model',
    'lesson-building-layouts-with-flexbox',
    'lesson-building-responsive-layouts-with-grid',
    'lesson-turning-a-figma-design-into-a-browser-interface',
  ],
  objectives: [
    'Write semantic HTML that reads correctly unstyled.',
    'Build a page skeleton with Grid and regions with Flexbox.',
    'Apply the spacing, type and colour systems from Module 2 in CSS.',
    'Produce a layout that works at widths you never tested.',
  ],
  requirements: [
    'A header with navigation.',
    'A product area: image, title, price, description, primary action.',
    'A grid of related products that reflows by available space.',
    'A footer.',
    'Semantic HTML throughout, with one `<h1>` and no skipped heading levels.',
    'Grid for the page skeleton, Flexbox within regions.',
    'At most two breakpoints, each justified in writing by content.',
  ],
  constraints: [
    'No CSS framework and no component library. Write the CSS yourself.',
    'No JavaScript. Nothing in this project requires behaviour you have not been taught.',
    'Every spacing and type value must come from your Module 2 scales.',
    'The related-products grid must have no breakpoint at all.',
  ],
  suggestedScope:
    'One page, built properly, rather than three pages built hastily. Roughly twelve to twenty hours. Stop when it survives the content tests, not when it first looks right.',
  deliverables: [
    'An HTML file and a CSS file.',
    'The structural reading you wrote before coding.',
    'The extracted value list, with one-off values flagged.',
    'A short note justifying each breakpoint.',
    'Screenshots at 320, 768 and 1440, plus two intermediate widths.',
  ],
  completionCriteria: [
    'The page reads correctly with CSS disabled.',
    'Every interactive element is reachable by keyboard in a sensible order.',
    'The related-products grid reflows with no breakpoint.',
    'No spacing or type value sits outside the documented scales.',
    'The layout holds when the product title is tripled in length.',
    'The layout holds when the related-products list contains a single item.',
  ],
  portfolioEvidence: [
    'Semantic markup — structure that stands on its own.',
    'Layout fluency — Grid and Flexbox each used where appropriate.',
    'Responsive judgement — breakpoints justified by content, and a grid with none.',
    'Design-to-code translation — a build that matches a design without transcribing it.',
    'Robustness — a page tested against content it was not designed for.',
  ],
  reflectionQuestion:
    'Which part of your design turned out to be hardest to build, and was the difficulty in the design or in your CSS?',
  estimatedHours: 16,
  competencies: [
    'html',
    'css',
    'layout',
    'responsive-design',
    'design-to-code-translation',
    'accessibility',
    'visual-hierarchy',
  ],
  stretchGoals: [
    'Add a dark theme using CSS custom properties, changing no markup.',
    'Make the related-products grid keep its alignment when cards have very different text lengths.',
    'Build the page so it is fully usable at 280px wide.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Module                                                                      */
/* -------------------------------------------------------------------------- */

export const MODULE_03: CurriculumModule = {
  id: MODULE_ID,
  slug: 'html-and-css-foundations',
  moduleNumber: 3,
  phase: 'foundations',
  title: 'HTML and CSS Foundations',
  description:
    'The two languages that put a design in a browser: HTML for what things are, CSS for how they look and where they sit. Everything is explained line by line the first time it appears.',
  outcome:
    'Can take one of their own designs and build it as a semantic, responsive page without a framework.',
  prerequisites: [
    'Module 1, especially browser controls',
    'Module 2, especially the spacing and type scales',
    'No prior coding experience required',
  ],
  lessons: [LESSON_1, LESSON_2, LESSON_3, LESSON_4, LESSON_5],
  resources: [
    {
      id: 'resource-module-03-mdn-css',
      title: 'CSS styling basics — MDN Learn',
      url: 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics',
      type: 'documentation',
      author: 'MDN',
      estimatedMinutes: 180,
      note: 'The main reference for this module. Work through it alongside the lessons rather than in advance.',
    },
    {
      id: 'resource-module-03-webdev-learn-css',
      title: 'Learn CSS',
      url: 'https://web.dev/learn/css',
      type: 'documentation',
      author: 'web.dev',
      estimatedMinutes: 240,
      note: 'A second explanation of the same material. Useful when one description does not land.',
    },
    {
      id: 'resource-module-03-kevin-powell-layout',
      title: 'Kevin Powell — Flexbox and Grid on YouTube',
      url: 'https://www.youtube.com/@KevinPowell',
      type: 'video',
      author: 'Kevin Powell',
      estimatedMinutes: 90,
      note: 'Watching someone resize a browser while explaining the layout is worth a great deal here.',
    },
    {
      id: 'resource-module-03-flexbox-froggy',
      title: 'Flexbox Froggy',
      url: 'https://flexboxfroggy.com/',
      type: 'tool',
      estimatedMinutes: 30,
      note: 'A short interactive game that drills the Flexbox properties. Genuinely effective for building recall.',
    },
  ],
  project: PROJECT,
  competencies: [
    'html',
    'css',
    'layout',
    'responsive-design',
    'design-to-code-translation',
    'accessibility',
    'visual-hierarchy',
    'typography',
  ],
  completionCriteria: [
    'All five lessons completed.',
    'Module project marked completed.',
    'Can build a semantic, responsive page from a design without a framework.',
  ],
};
