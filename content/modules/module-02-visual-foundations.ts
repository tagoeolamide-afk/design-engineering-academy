/**
 * Module 02 — Visual Foundations.
 *
 * The learner's home ground, re-approached from the build side. Everything
 * here is something they already do in Figma; what is new is that each
 * decision has a counterpart in code, and that the counterpart is usually a
 * number in a system rather than a value typed into one layer.
 *
 * No CSS is taught here. The point is to make the decisions systematic so that
 * Module 3 has something to implement.
 */

import type { CurriculumModule, Lesson, ModuleProject } from '@/types/curriculum';

const MODULE_ID = 'module-02';

/* -------------------------------------------------------------------------- */
/* Lesson 6                                                                    */
/* -------------------------------------------------------------------------- */

const LESSON_1: Lesson = {
  id: 'lesson-visual-hierarchy',
  slug: 'visual-hierarchy',
  moduleId: MODULE_ID,
  lessonNumber: 1,
  title: 'Visual Hierarchy',
  summary:
    'Hierarchy is a claim about importance, made visible. This lesson is about making that claim deliberately, and about the handful of tools that actually carry it.',
  estimatedMinutes: 8,
  objectives: [
    'State the intended reading order of a screen before designing it.',
    'Name the tools that create hierarchy and rank them by strength.',
    'Diagnose a cluttered screen by finding competing claims to importance.',
    'Explain why hierarchy is implemented as structure, not only as styling.',
  ],
  prerequisiteConcepts: [
    'Breaking an interface into parts, from Module 1',
    'Everyday visual design practice',
  ],
  prerequisiteLessonIds: ['lesson-breaking-an-interface-into-parts'],
  recap: [
    {
      kind: 'paragraph',
      text: 'Module 1 ended with breaking a screen into pages, sections, controls and repeated patterns, and with the idea that behaviour is a better boundary than appearance.',
    },
  ],
  priorKnowledge: [
    {
      kind: 'paragraph',
      text: 'This module is your territory. You already make these decisions daily — what should be biggest, what should be grouped, where the eye should land first.',
    },
    {
      kind: 'paragraph',
      text: 'What changes here is that you will make them as *rules* rather than as judgements on individual layers, because a rule is something an interface can be built from and a judgement is not.',
    },
  ],
  coreConcept: [
    {
      kind: 'paragraph',
      text: 'Hierarchy is the answer to one question: in what order should this be read?',
    },
    {
      kind: 'paragraph',
      text: 'Every screen has an intended order. The user scans, lands somewhere, and moves on. If you have not decided that order, the screen still has one — it is just the order your incidental styling happened to produce.',
    },
    {
      kind: 'paragraph',
      text: 'A cluttered interface is almost never cluttered because it contains too much. It is cluttered because too many things claim to be first.',
    },
  ],
  whyDesignersCare: [
    {
      kind: 'paragraph',
      text: 'You know this already. The reason it is worth restating is that hierarchy is the first thing lost in implementation.',
    },
    {
      kind: 'paragraph',
      text: 'A design arrives with a clear first, second and third. Then a feature is added, and the new element is styled to match whatever was nearest. Three releases later there are four things at the same visual weight and nobody decided that.',
    },
    {
      kind: 'paragraph',
      text: 'Stating the order explicitly — writing it down, not only drawing it — is what lets the next person preserve it.',
    },
  ],
  howItWorks: [
    {
      kind: 'paragraph',
      text: 'Hierarchy is carried by a small set of tools, and they are not equally strong. Roughly in order of force:',
    },
    {
      kind: 'list',
      ordered: true,
      items: [
        'Position — what is at the top, or where the eye enters, wins before anything else is read.',
        'Size — larger reads as more important, and the effect is immediate.',
        'Weight — heavier text separates without consuming space.',
        'Contrast — higher contrast against the background advances; lower recedes.',
        'Space — isolation makes a thing important, and proximity makes things belong together.',
        'Colour — strong, but the weakest of these to rely on alone, because it fails for some readers.',
      ],
    },
    {
      kind: 'paragraph',
      text: 'Using several at once on the same element is how a design becomes shouty. A heading that is larger, bolder, higher contrast *and* coloured is making one claim four times.',
    },
  ],
  firstPrinciples: [
    {
      kind: 'paragraph',
      text: 'Underneath all six is a single mechanism: difference. An element reads as important because it differs from its surroundings, not because of any absolute value.',
    },
    {
      kind: 'paragraph',
      text: 'This is why a 24px heading is prominent on a page of 14px text and invisible on a page of 22px text. Hierarchy is relational. It is also why adding emphasis to everything removes it from everything.',
    },
    {
      kind: 'callout',
      tone: 'insight',
      body: 'If everything is emphasised, nothing is. Emphasis is a finite budget, and spending it is a zero-sum decision.',
    },
  ],
  designPerspective: [
    {
      kind: 'paragraph',
      text: 'The design question is what the person is here to do, because that decides what goes first.',
    },
    {
      kind: 'paragraph',
      text: 'A dashboard a person checks twice a day should lead with the number that tells them whether to worry. The same dashboard used once a quarter for reporting leads with something else entirely. Hierarchy is not a property of the content; it is a property of the task.',
    },
  ],
  engineeringPerspective: [
    {
      kind: 'paragraph',
      text: 'The engineering question is whether hierarchy exists in the structure or only in the appearance.',
    },
    {
      kind: 'paragraph',
      text: 'HTML has real headings, with levels. A screen reader can list them and jump between them, which is how a non-visual user perceives hierarchy at all. If your most important text is a styled paragraph, that user gets a flat document — the hierarchy you designed is invisible to them.',
    },
    {
      kind: 'paragraph',
      text: 'You will write this markup in Module 3. The decision you are making now is what the levels *are*.',
    },
  ],
  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'There are two hierarchies and they must agree: the one the eye sees and the one the document declares.',
    },
    {
      kind: 'paragraph',
      text: 'When they agree, the screen works for everyone and the code is self-describing. When they diverge — a heading styled small because it looked better, a caption styled large because it was important — you get an interface that reads correctly and navigates wrongly.',
    },
  ],
  industryExamples: [
    {
      id: 'example-stripe-docs-hierarchy',
      source: 'Stripe',
      title: 'Hierarchy that survives dense content',
      observation:
        "Stripe's documentation keeps a strict, shallow heading structure on pages carrying a great deal of technical detail.",
      takeaway:
        'Dense content needs *more* hierarchy discipline, not less. The constraint is what makes the density navigable.',
    },
    {
      id: 'example-linear-dashboard-emphasis',
      source: 'Linear',
      title: 'Spending the emphasis budget narrowly',
      observation:
        'Linear keeps most interface text at a similar quiet weight, reserving stronger treatment for a small number of elements per view.',
      takeaway:
        'A restrained baseline is what makes the few emphasised elements legible as emphasis at all.',
    },
  ],
  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Take a cluttered settings page and fix it without removing anything.',
    },
    {
      kind: 'list',
      ordered: true,
      items: [
        'Write the intended reading order as a numbered list, in words. "Section name, then the setting I came to change, then its explanation, then Save."',
        'Look at the current design and write the *actual* order — what your eye really does.',
        'Find every element making a claim it should not. Usually these are mid-level things styled like headings.',
        'Reduce, do not add. Take emphasis away from the over-claiming elements rather than adding more to the important one.',
        'Check the result in greyscale. If the order survives, it was carried by size, weight and space rather than colour.',
      ],
    },
    {
      kind: 'paragraph',
      text: 'Step four is the one people skip. The instinct when something is not prominent enough is to make it bigger, which inflates the whole page over time. Removing emphasis elsewhere is almost always the better move.',
    },
  ],
  commonMistakes: [
    {
      id: 'mistake-02-01-emphasis-inflation',
      mistake: 'Making the important thing bigger instead of making everything else quieter.',
      why: 'Each round of this raises the baseline, so the next important thing has to be bigger still. The page inflates.',
      instead: 'Treat emphasis as a budget. To promote something, demote something else.',
    },
    {
      id: 'mistake-02-01-visual-only-hierarchy',
      mistake: 'Creating hierarchy purely with styling, with no heading structure underneath.',
      why: 'Anyone navigating by headings — screen reader users, and anyone using in-page navigation — gets a flat, unnavigable document.',
      instead:
        'Decide heading levels as part of the design, and keep them in order. Visual size and heading level are separate decisions that should agree.',
    },
  ],
  professionalConsideration: [
    {
      kind: 'paragraph',
      text: 'Hierarchy decays under maintenance in a specific, predictable way: additions are styled to match their neighbours rather than their importance.',
    },
    {
      kind: 'paragraph',
      text: 'The defence is a documented scale with named levels and a stated meaning for each — "page title", "section", "body", "supporting". When the next person adds an element they pick a level rather than matching a nearby size, and the structure survives.',
    },
  ],
  practicalExercise: {
    id: 'exercise-visual-hierarchy',
    title: 'Fix a cluttered dashboard',
    prompt:
      'Take a dashboard that feels busy — your own work or a product you use — and improve its hierarchy without removing any content.',
    steps: [
      'Write the intended reading order in words before touching the design.',
      'Record the actual order by watching where your eye goes first, second, third.',
      'List every element competing for the same level of attention.',
      'Redesign so the intended order is the actual order, working mainly by removing emphasis.',
      'Assign a heading level to each piece of text that is structurally a heading.',
      'View the result in greyscale and confirm the order still holds.',
    ],
    successCriteria: [
      'Intended order written before any design work.',
      'No content removed — the improvement comes from emphasis, not deletion.',
      'At least two elements demoted rather than one promoted.',
      'Heading levels assigned and in sequence, with none skipped.',
      'Hierarchy survives in greyscale.',
    ],
    estimatedMinutes: 40,
    hint: 'If your fix made the important thing larger, try the opposite version too and compare them side by side. One of the two will feel calmer.',
  },
  reflectionQuestion:
    'What makes a screen feel cluttered even when it contains very little?',
  reflectionHint:
    'Count the things claiming to be most important. Clutter is usually a competition, not a quantity.',
  resources: [
    {
      id: 'resource-refactoring-ui-hierarchy',
      title: 'Refactoring UI',
      url: 'https://www.refactoringui.com/',
      type: 'book',
      author: 'Adam Wathan and Steve Schoger',
      estimatedMinutes: 120,
      note: 'The hierarchy and emphasis chapters are the most directly useful thing a designer can read before building.',
    },
    {
      id: 'resource-nng-visual-hierarchy',
      title: 'Visual Hierarchy in UX',
      url: 'https://www.nngroup.com/articles/visual-hierarchy-ux-definition/',
      type: 'article',
      author: 'Nielsen Norman Group',
      estimatedMinutes: 10,
      note: 'A short, research-grounded definition with examples of hierarchy failing.',
    },
  ],
  competencyTags: ['visual-hierarchy', 'ux-reasoning', 'accessibility', 'critique'],
  completionCriteria: [
    'Can state a screen’s intended reading order before designing it.',
    'Can improve hierarchy by removing emphasis rather than adding it.',
    'Can explain why heading structure matters independently of visual size.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Lesson 7                                                                    */
/* -------------------------------------------------------------------------- */

const LESSON_2: Lesson = {
  id: 'lesson-spacing-and-rhythm',
  slug: 'spacing-and-rhythm',
  moduleId: MODULE_ID,
  lessonNumber: 2,
  title: 'Spacing and Rhythm',
  summary:
    'Space is how an interface says what belongs together. A restricted scale turns that from a per-screen judgement into a rule you can build with.',
  estimatedMinutes: 8,
  objectives: [
    'Use proximity to express grouping rather than relying on borders.',
    'Work from a fixed spacing scale instead of arbitrary values.',
    'Explain why a restricted set of values produces a calmer interface.',
    'Choose a density appropriate to how often a screen is used.',
  ],
  prerequisiteConcepts: ['Visual hierarchy from the previous lesson'],
  prerequisiteLessonIds: ['lesson-visual-hierarchy'],
  recap: [
    {
      kind: 'paragraph',
      text: 'Last lesson you established that hierarchy is a claim about reading order, carried by position, size, weight, contrast, space and colour — and that space was one of the six.',
    },
  ],
  priorKnowledge: [
    {
      kind: 'paragraph',
      text: 'You already use space to group things; it is one of the oldest tools in visual design. You may also already use an 8px grid in Figma.',
    },
    {
      kind: 'paragraph',
      text: 'What follows makes that habit explicit and explains why the restriction is the valuable part.',
    },
  ],
  coreConcept: [
    {
      kind: 'paragraph',
      text: 'Space states relationships. Things close together are read as belonging together; things far apart are read as separate. The eye does this before reading a word.',
    },
    {
      kind: 'paragraph',
      text: 'Which means the gap between a label and its field must be smaller than the gap between one field and the next. If those two gaps are equal, the form becomes a list of unrelated items and the user has to work out the pairings by reading.',
    },
  ],
  whyDesignersCare: [
    {
      kind: 'paragraph',
      text: 'Because spacing is the single most common source of drift between a design and a build.',
    },
    {
      kind: 'paragraph',
      text: 'Nobody argues about a heading being the wrong size — it is obvious. A 14px gap where the design said 16px is invisible individually and, repeated forty times across a product, is the difference between an interface that feels made and one that feels assembled.',
    },
    {
      kind: 'paragraph',
      text: 'A scale fixes this because there is no 14. The implementer picks from the same short list you did.',
    },
  ],
  howItWorks: [
    {
      kind: 'paragraph',
      text: 'A spacing scale is a small, fixed set of values, usually built on a base unit of 4 or 8.',
    },
    {
      kind: 'list',
      items: [
        '4 — the gap inside a tight pairing, such as a label and its field.',
        '8 — between closely related elements.',
        '12 — between elements in a group.',
        '16 — between groups.',
        '24 — between sections.',
        '32 and above — between major regions.',
      ],
    },
    {
      kind: 'paragraph',
      text: 'The values matter less than the restriction. Six options force every gap to mean something, because choosing 16 over 12 is now a statement about relationship rather than a nudge.',
    },
    {
      kind: 'paragraph',
      text: 'In Module 10 these become named design tokens, shared between Figma and code. For now the scale on its own is enough.',
    },
  ],
  firstPrinciples: [
    {
      kind: 'paragraph',
      text: 'The principle is proximity: the visual system groups by distance automatically and involuntarily.',
    },
    {
      kind: 'paragraph',
      text: 'This is why space outperforms borders. A border draws a group by adding a line — more ink, more visual noise. Space draws the same group by adding nothing. When a dense interface feels calm, it is usually because its grouping is done with space and its borders were deleted.',
    },
  ],
  designPerspective: [
    {
      kind: 'paragraph',
      text: 'The design question is density: how much does this screen need to show at once?',
    },
    {
      kind: 'paragraph',
      text: 'A tool someone lives in all day benefits from density — more visible at once means less navigation. A screen visited once a month benefits from air, because the user has no practised familiarity to fall back on. The same spacing scale serves both; you simply select from a different part of it.',
    },
  ],
  engineeringPerspective: [
    {
      kind: 'paragraph',
      text: 'The engineering question is where the space lives.',
    },
    {
      kind: 'paragraph',
      text: 'A gap can be pushed out by the element above, pulled in by the element below, or owned by the container holding both. The third is almost always correct: the container knows how its children relate, so it sets the gap once, and the children stay reusable because they carry no opinion about their neighbours.',
    },
    {
      kind: 'paragraph',
      text: 'An element that sets its own outer spacing has baked in an assumption about where it will be placed — and will be wrong the first time it is placed somewhere else.',
    },
  ],
  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'A scale is where the two sides meet without negotiation.',
    },
    {
      kind: 'paragraph',
      text: 'When the design uses six values and the code offers the same six by name, "the spacing is wrong" stops being a matter of opinion and becomes a checkable fact. That is the real benefit — not the pixel values, but the end of the argument.',
    },
  ],
  industryExamples: [
    {
      id: 'example-figma-autolayout-spacing',
      source: 'Figma',
      title: 'Spacing owned by the container',
      observation:
        'Auto layout puts the gap on the parent frame rather than on each child, so the children carry no spacing of their own.',
      takeaway:
        'This is exactly the model good CSS uses. If you already think in auto layout, you already think the way the code wants you to.',
    },
    {
      id: 'example-polaris-spacing-scale',
      source: 'Shopify',
      title: 'A published, named scale',
      observation:
        'Polaris defines space as named tokens on a fixed scale rather than as free-form values.',
      takeaway:
        'Naming the steps is what makes them survive handoff. "space-400" cannot drift into 14px.',
    },
  ],
  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Space a settings panel using one scale. Work outside in.',
    },
    {
      kind: 'list',
      ordered: true,
      items: [
        'Between the panel and the page around it: 32.',
        'Between the panel heading and its first group: 24.',
        'Between one setting group and the next: 24.',
        'Between the rows inside a group: 16.',
        'Between a label and its field: 4.',
        'Between a field and its helper text: 4.',
      ],
    },
    {
      kind: 'paragraph',
      text: 'Read the numbers back as a sentence: label and field are the closest things on the screen, rows are related, groups are separate, the panel stands apart from the page. The spacing *is* the structure, written in numbers.',
    },
    {
      kind: 'paragraph',
      text: 'If any gap needed a value not on the list, that is the signal to examine the relationship rather than to add a value.',
    },
  ],
  commonMistakes: [
    {
      id: 'mistake-02-02-equal-gaps',
      mistake: 'Using the same gap between a label and its field as between separate fields.',
      why: 'Equal distance means equal relationship, so the pairing is destroyed and the form reads as a flat list.',
      instead:
        'The gap within a pair must be visibly smaller than the gap between pairs. This single rule fixes most forms.',
    },
    {
      id: 'mistake-02-02-nudging',
      mistake: 'Adjusting a gap by a pixel or two until it looks right.',
      why: 'It produces values nobody can justify or reproduce, and guarantees the build will not match.',
      instead:
        'Move to the next step on the scale. If no step works, the problem is usually the size or weight of something nearby, not the gap.',
    },
  ],
  professionalConsideration: [
    {
      kind: 'paragraph',
      text: 'Scales usually need two directions, not one.',
    },
    {
      kind: 'paragraph',
      text: 'Vertical rhythm interacts with line height, which already adds space above and below text. Applying the same value horizontally and vertically often produces gaps that look correct on one axis and loose on the other. Mature systems acknowledge this rather than pretending space is isotropic.',
    },
  ],
  practicalExercise: {
    id: 'exercise-spacing-and-rhythm',
    title: 'Rebuild a settings panel on one scale',
    prompt:
      'Take a settings panel and rebuild its spacing using a single scale of 4, 8, 12, 16, 24 and 32. No other values.',
    steps: [
      'Write the scale down and commit to it before you start.',
      'List every gap in the current panel and measure it.',
      'Map each to the nearest step, and note any that do not map cleanly.',
      'For each awkward one, decide what relationship it should express, then pick the step that says that.',
      'Remove every border that space now makes unnecessary.',
      'Compare before and after side by side.',
    ],
    successCriteria: [
      'Every gap in the result is one of the six values.',
      'Label-to-field gaps are visibly smaller than field-to-field gaps.',
      'At least one border removed because spacing replaced it.',
      'Each awkward gap has a written note about the relationship it expresses.',
    ],
    estimatedMinutes: 35,
    hint: 'Start from the largest gaps and work inwards. Getting the outer structure right first makes the inner decisions nearly automatic.',
  },
  reflectionQuestion:
    'Why does restricting yourself to six spacing values produce a better result than having every value available?',
  reflectionHint:
    'Think about what a limited set forces you to do when a gap feels wrong, and what an unlimited set lets you avoid.',
  resources: [
    {
      id: 'resource-mdn-box-model-intro',
      title: 'The box model — MDN Learn',
      url: 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Box_model',
      type: 'documentation',
      author: 'MDN',
      estimatedMinutes: 25,
      note: 'Where spacing actually lives in a browser. You will implement this in Module 3; skim it now.',
    },
    {
      id: 'resource-polaris-space',
      title: 'Space — Shopify Polaris',
      url: 'https://polaris.shopify.com/design/space',
      type: 'documentation',
      author: 'Shopify',
      estimatedMinutes: 10,
      note: 'A production spacing scale with the reasoning for each step written down.',
    },
  ],
  competencyTags: ['layout', 'visual-hierarchy', 'design-systems', 'ux-reasoning'],
  completionCriteria: [
    'Can space a panel using only a fixed scale.',
    'Can explain grouping by proximity without reaching for borders.',
    'Can say where spacing should live and why the container usually owns it.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Lesson 8                                                                    */
/* -------------------------------------------------------------------------- */

const LESSON_3: Lesson = {
  id: 'lesson-typography-for-interfaces',
  slug: 'typography-for-interfaces',
  moduleId: MODULE_ID,
  lessonNumber: 3,
  title: 'Typography for Interfaces',
  summary:
    'Interface type is not editorial type. It is mostly small, mostly functional, and has to stay legible at the size where everything actually lives.',
  estimatedMinutes: 8,
  objectives: [
    'Build a type scale with a defensible number of steps.',
    'Set line height and line length for reading rather than for appearance.',
    'Use weight instead of size to separate dense interface text.',
    'Treat numeric and label typography as distinct problems.',
  ],
  prerequisiteConcepts: [
    'Visual hierarchy',
    'Spacing scales from the previous lesson',
  ],
  prerequisiteLessonIds: ['lesson-spacing-and-rhythm'],
  recap: [
    {
      kind: 'paragraph',
      text: 'Last lesson you rebuilt a panel on a fixed spacing scale and saw that restriction makes each value meaningful. Type works the same way.',
    },
  ],
  priorKnowledge: [
    {
      kind: 'paragraph',
      text: 'You know type. What may be new is how little of it an interface actually uses: most product screens live in two or three sizes, and the large sizes in your scale appear once per page if at all.',
    },
  ],
  coreConcept: [
    {
      kind: 'paragraph',
      text: 'Interface typography is a working tool, not a voice. Its job is to be read quickly at small sizes, over and over, by someone trying to do something else.',
    },
    {
      kind: 'paragraph',
      text: 'That reverses the usual emphasis. The interesting decisions are not about the display size; they are about the 13 or 14 pixel text that carries almost everything.',
    },
  ],
  whyDesignersCare: [
    {
      kind: 'paragraph',
      text: 'Because type is the one part of a build that is almost never adjusted after handoff, and therefore the one where your decisions survive most intact.',
    },
    {
      kind: 'paragraph',
      text: 'It is also the part most likely to be specified loosely. "14px, medium" leaves line height and letter spacing to whoever implements it, and those two carry more of the feel than the size does.',
    },
  ],
  howItWorks: [
    {
      kind: 'paragraph',
      text: 'A type scale is a fixed set of sizes, each with a line height and weight attached. Four or five steps is usually enough for a product interface.',
    },
    {
      kind: 'list',
      items: [
        'Display — one per page at most. The page title.',
        'Heading — section titles.',
        'Body — the default. Most text on the screen is this.',
        'Small — supporting text, helper copy, metadata.',
        'Caption — labels and the smallest legible text.',
      ],
    },
    {
      kind: 'paragraph',
      text: 'Each step needs three numbers, not one: size, line height, and weight. A size without a line height is an incomplete instruction, and line height is where most of the perceived quality sits.',
    },
    {
      kind: 'paragraph',
      text: 'The rule of thumb: tighter line height as text gets larger, looser as it gets smaller. A heading at 1.2 and body text at 1.5 is a reasonable starting point.',
    },
  ],
  firstPrinciples: [
    {
      kind: 'paragraph',
      text: 'Two mechanics do most of the work: measure and contrast.',
    },
    {
      kind: 'paragraph',
      text: '**Measure** is the number of characters per line. Somewhere around 45 to 75 is comfortable; past that the eye struggles to find the start of the next line, which is why full-width paragraphs on a wide monitor are tiring to read. The fix is a maximum width on the text, not on the container.',
    },
    {
      kind: 'paragraph',
      text: '**Contrast** between steps has to be large enough to perceive. 14 and 15 are not two steps — they are one step and a mistake. If two sizes are not obviously different, delete one.',
    },
  ],
  designPerspective: [
    {
      kind: 'paragraph',
      text: 'The design question is how few steps you can get away with.',
    },
    {
      kind: 'paragraph',
      text: 'Every additional size is another decision for everyone who touches the product afterwards, and another opportunity for drift. A scale of four used precisely will beat a scale of nine used approximately.',
    },
  ],
  engineeringPerspective: [
    {
      kind: 'paragraph',
      text: 'The engineering question is whether the type respects the user.',
    },
    {
      kind: 'paragraph',
      text: 'People can set a larger default text size in their browser or operating system. Type sized in fixed pixels ignores that entirely. Type sized in relative units scales with it. This is one of the quieter accessibility decisions, and it is made in the stylesheet, not the mockup.',
    },
  ],
  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'A type scale is the most portable artefact in this module: the same five steps can exist as Figma styles and as code, with identical names.',
    },
    {
      kind: 'paragraph',
      text: 'When they match, a conversation about type becomes a conversation about which step, rather than about which pixel value. That is a much shorter conversation.',
    },
  ],
  industryExamples: [
    {
      id: 'example-github-primer-type',
      source: 'GitHub',
      title: 'A small scale carrying a large product',
      observation:
        "GitHub's Primer defines a compact set of type sizes used across an extremely large interface.",
      takeaway:
        'Product scale does not require type scale. A short list applied consistently is what holds a big product together.',
    },
    {
      id: 'example-apple-hig-typography',
      source: 'Apple',
      title: 'Type that responds to the reader',
      observation:
        'Apple platforms provide text styles that automatically respect the reader’s chosen text size.',
      takeaway:
        'Treating the user’s size preference as an input rather than an inconvenience is a platform-level decision worth copying.',
    },
  ],
  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Define a scale for a dashboard. Five steps, each complete.',
    },
    {
      kind: 'list',
      items: [
        'Display — 28px, line height 1.2, semibold. Page title only.',
        'Heading — 17px, line height 1.3, medium. Section titles.',
        'Body — 14px, line height 1.5, regular. Default text.',
        'Small — 13px, line height 1.45, regular. Helper and metadata.',
        'Caption — 11px, line height 1.4, medium, uppercase. Labels.',
      ],
    },
    {
      kind: 'paragraph',
      text: 'Note what the caption does: it goes *down* in size but *up* in weight, because small text at a light weight disappears. Weight is compensating for size, which is the move that makes dense interfaces readable.',
    },
    {
      kind: 'paragraph',
      text: 'Note also that body and small are only 1px apart but differ in role. That is a case where you should ask whether both are earning their place.',
    },
  ],
  commonMistakes: [
    {
      id: 'mistake-02-03-too-many-sizes',
      mistake: 'Shipping nine type sizes because each screen wanted something slightly different.',
      why: 'Nobody can tell them apart, so nobody applies them correctly, and the scale stops being a scale.',
      instead:
        'Cut to five. If a screen needs something between two steps, the problem is usually hierarchy, not type.',
    },
    {
      id: 'mistake-02-03-ignoring-measure',
      mistake: 'Letting paragraphs run the full width of a wide container.',
      why: 'Past about 75 characters the eye loses the line. The text is legible and still tiring.',
      instead:
        'Constrain the reading column itself. The container can be wide; the text should not be.',
    },
  ],
  professionalConsideration: [
    {
      kind: 'paragraph',
      text: 'Numbers are a separate typographic problem and most scales ignore them.',
    },
    {
      kind: 'paragraph',
      text: 'In a table of figures, proportional digits make columns fail to align, because a 1 is narrower than a 0. Most quality typefaces offer tabular figures that fix this. It is a small switch that makes dense numeric interfaces look considered — and its absence is one of the first things an experienced eye notices.',
    },
  ],
  practicalExercise: {
    id: 'exercise-typography-for-interfaces',
    title: 'Define a type scale for a SaaS dashboard',
    prompt:
      'Produce a complete, documented type scale for a dashboard, and apply it to one real screen.',
    steps: [
      'Decide how many steps you need. Justify the number in a sentence.',
      'For each step: size, line height, weight, and what it is for.',
      'Name each step by role rather than by size.',
      'Apply the scale to one dashboard screen, using only your steps.',
      'Set a maximum width for any paragraph text and state the measure you aimed for.',
      'Check the smallest step at arm’s length and adjust its weight if it disappears.',
    ],
    successCriteria: [
      'Five or fewer steps, with the count justified.',
      'Every step has size, line height, weight and purpose.',
      'Steps are named by role, not by pixel value.',
      'The applied screen uses no size outside the scale.',
      'A reading measure is stated for paragraph text.',
    ],
    estimatedMinutes: 40,
    hint: 'If two of your steps feel interchangeable when you squint, they are one step. Removing one is a better outcome than keeping both.',
  },
  reflectionQuestion:
    'Why does weight often work better than size for separating dense interface text?',
  reflectionHint:
    'Consider what increasing size costs you on a screen that has to fit a lot, and what weight changes without taking anything.',
  resources: [
    {
      id: 'resource-mdn-text-styling',
      title: 'Fundamental text and font styling — MDN Learn',
      url: 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Text_styling/Fundamentals',
      type: 'documentation',
      author: 'MDN',
      estimatedMinutes: 30,
      note: 'How size, weight and line height are actually expressed in a browser.',
    },
    {
      id: 'resource-practical-typography',
      title: 'Butterick’s Practical Typography',
      url: 'https://practicaltypography.com/',
      type: 'book',
      author: 'Matthew Butterick',
      estimatedMinutes: 90,
      note: 'Opinionated and correct. The sections on measure and line spacing are the relevant ones here.',
    },
  ],
  competencyTags: ['typography', 'visual-hierarchy', 'accessibility', 'design-systems'],
  completionCriteria: [
    'Can define a type scale of five or fewer complete steps.',
    'Can state a target measure and constrain text to it.',
    'Can explain when to reach for weight instead of size.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Lesson 9                                                                    */
/* -------------------------------------------------------------------------- */

const LESSON_4: Lesson = {
  id: 'lesson-colour-contrast-and-meaning',
  slug: 'colour-contrast-and-meaning',
  moduleId: MODULE_ID,
  lessonNumber: 4,
  title: 'Colour, Contrast and Meaning',
  summary:
    'In a product interface, colour mostly carries meaning rather than mood — and meaning that only colour carries is meaning some users never receive.',
  estimatedMinutes: 9,
  objectives: [
    'Separate colour that means something from colour that decorates.',
    'Name colours by role rather than by hue.',
    'Check contrast against a standard rather than by eye.',
    'Explain why colour must never be the only signal.',
  ],
  prerequisiteConcepts: ['Visual hierarchy', 'Interface states from Module 1'],
  prerequisiteLessonIds: [
    'lesson-visual-hierarchy',
    'lesson-feedback-loading-success-and-error',
  ],
  recap: [
    {
      kind: 'paragraph',
      text: 'You have built a spacing scale and a type scale, and in Module 1 you designed four states of an action — idle, working, succeeded, failed. Those states are about to need colours.',
    },
  ],
  priorKnowledge: [
    {
      kind: 'paragraph',
      text: 'You know colour theory. The shift here is from palette as expression to palette as vocabulary: in a product, red usually means something specific and is not available for decoration.',
    },
  ],
  coreConcept: [
    {
      kind: 'paragraph',
      text: 'Interface colour divides into two jobs, and confusing them is the root of most palette problems.',
    },
    {
      kind: 'list',
      items: [
        'Semantic colour — carries meaning. Success, warning, error, informational, destructive. The user is expected to decode it.',
        'Structural colour — carries no meaning. Surfaces, borders, text. It organises without saying anything.',
      ],
    },
    {
      kind: 'paragraph',
      text: 'Once a hue is semantic it is spent. If red means destructive, red cannot also be your brand accent on a primary button, because the same colour would mean both "proceed" and "danger".',
    },
  ],
  whyDesignersCare: [
    {
      kind: 'paragraph',
      text: 'Because this is where a palette that looked coherent in Figma falls apart in a product.',
    },
    {
      kind: 'paragraph',
      text: 'A palette built as a set of pleasing swatches has no answer to "what colour is a warning on a dark surface?" A palette built as named roles does, and the answer is the same everywhere.',
    },
  ],
  howItWorks: [
    {
      kind: 'paragraph',
      text: 'Name by role, not by appearance. `danger` rather than `red-600`.',
    },
    {
      kind: 'paragraph',
      text: 'A hue name locks you in: when the theme changes, every `red-600` either stays wrong or has to be found and replaced. A role name describes the job, so the value behind it can change — including between light and dark themes — without a single usage needing to move.',
    },
    {
      kind: 'paragraph',
      text: 'A small working set is usually: a canvas, one or two surfaces above it, a border, three levels of text, an accent, and four status colours each with a subtle variant for backgrounds. That is around a dozen roles and covers most products.',
    },
  ],
  firstPrinciples: [
    {
      kind: 'paragraph',
      text: 'Contrast is the measurable part, and it is not a matter of taste.',
    },
    {
      kind: 'paragraph',
      text: 'The ratio between text and its background can be calculated. WCAG sets 4.5:1 for normal text and 3:1 for large text as the usual target. Below that, text becomes unreadable for a substantial number of people — including anyone on a phone in sunlight.',
    },
    {
      kind: 'paragraph',
      text: 'The second principle: around 1 in 12 men has some form of colour vision deficiency. Red and green are the common confusion. An interface where success and error differ only in hue is an interface that fails silently for those users.',
    },
    {
      kind: 'callout',
      tone: 'warning',
      body: 'Colour may reinforce a signal. It must never be the only one. Pair it with an icon, a label, or a shape — something that survives greyscale.',
    },
  ],
  designPerspective: [
    {
      kind: 'paragraph',
      text: 'The design question is what each colour is allowed to mean, and the discipline is refusing to spend a semantic colour on decoration.',
    },
    {
      kind: 'paragraph',
      text: 'This is harder than it sounds, because semantic colours are usually the most attractive ones in the palette. The green that means "succeeded" is exactly the green you want for a nice empty state illustration — and using it there weakens it everywhere.',
    },
  ],
  engineeringPerspective: [
    {
      kind: 'paragraph',
      text: 'The engineering question is whether a colour can change in one place.',
    },
    {
      kind: 'paragraph',
      text: 'A role name maps to a value. Supporting a dark theme then means supplying a second value for each role, not rewriting every screen. If colours were written as literal values throughout, a dark theme is a search-and-replace across the entire product — which is why so many products added one badly.',
    },
  ],
  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'The named role is the shared object. It is simultaneously a design decision ("destructive actions are this colour") and an implementation detail ("this token resolves to this value in this theme").',
    },
    {
      kind: 'paragraph',
      text: 'You will build this properly as design tokens in Module 10. Everything you decide here is what those tokens will contain.',
    },
  ],
  industryExamples: [
    {
      id: 'example-stripe-destructive',
      source: 'Stripe',
      title: 'Reserving a colour for consequence',
      observation:
        'Stripe’s dashboard keeps strong red for destructive and failure states rather than using it decoratively.',
      takeaway:
        'The restraint is what gives the colour its force. A product that uses red freely has no way to signal real danger.',
    },
    {
      id: 'example-material-colour-roles',
      source: 'Google',
      title: 'Colour defined as roles',
      observation:
        'Material Design defines colour as a set of named roles — surface, on-surface, error, on-error — rather than as a palette of hues.',
      takeaway:
        'The "on-" naming encodes the contrast pairing directly, so the correct text colour for any surface is already decided.',
    },
  ],
  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Build a minimal semantic set for the four states from Module 1.',
    },
    {
      kind: 'list',
      items: [
        'success — the action completed. Paired with a check glyph.',
        'warning — something needs attention but nothing is broken. Paired with a triangle.',
        'danger — the action failed, or will destroy something. Paired with an exclamation or a cross.',
        'info — neutral explanation. Paired with an "i".',
      ],
    },
    {
      kind: 'paragraph',
      text: 'Each needs two values: a strong one for text and icons, and a subtle one for backgrounds. Check both against the surfaces they will sit on — the subtle background must still give its text 4.5:1.',
    },
    {
      kind: 'paragraph',
      text: 'Then the test that matters: screenshot all four, convert to greyscale, and confirm you can still tell them apart. If you cannot, the glyphs are not doing enough work.',
    },
  ],
  commonMistakes: [
    {
      id: 'mistake-02-04-colour-only-status',
      mistake: 'Distinguishing statuses by colour alone.',
      why: 'It fails for colour-blind users, in greyscale, in bright sunlight, and on poorly calibrated screens.',
      instead: 'Give every status a distinct glyph or label as well. Colour reinforces; it does not carry.',
    },
    {
      id: 'mistake-02-04-hue-names',
      mistake: 'Naming colours after what they look like.',
      why: '`blue-500` cannot change. The first theme change leaves you with a token called blue that is no longer blue.',
      instead: 'Name by role. The value is then free to differ per theme.',
    },
  ],
  professionalConsideration: [
    {
      kind: 'paragraph',
      text: 'Dark themes are not inversions.',
    },
    {
      kind: 'paragraph',
      text: 'Inverting a light palette produces harsh, over-saturated results, because perceived contrast behaves differently on dark backgrounds — light text on dark appears heavier than the reverse. Serious dark themes reduce saturation, lift dark surfaces off pure black, and sometimes lighten rather than darken an accent. Designing the roles first is what makes a second theme tractable at all.',
    },
  ],
  practicalExercise: {
    id: 'exercise-colour-contrast-and-meaning',
    title: 'Build semantic colour roles',
    prompt:
      'Define a semantic colour set for a product interface, with verified contrast, and prove it survives greyscale.',
    steps: [
      'List the roles you need. Separate semantic from structural.',
      'Assign a value to each, naming by role.',
      'For every text-on-background pairing, check the contrast ratio with a real checker and record the number.',
      'Give each status a glyph as well as a colour.',
      'Produce a greyscale version and confirm every status remains distinguishable.',
      'Write one sentence per semantic colour stating what it is allowed to mean, and what it must not be used for.',
    ],
    successCriteria: [
      'Roles named by job, with no hue names.',
      'Every text pairing has a measured ratio recorded, meeting 4.5:1 or 3:1 as appropriate.',
      'Every status has a non-colour signal.',
      'The greyscale test passes.',
      'Each semantic colour has a written rule including a prohibition.',
    ],
    estimatedMinutes: 45,
    hint: 'Do the greyscale test early rather than at the end. It usually sends you back to the glyphs, and it is cheaper to find that out before you have tuned the hues.',
  },
  reflectionQuestion:
    'Why should a colour that means "destructive" never also be used decoratively?',
  reflectionHint:
    'Think about what happens to a signal that appears in situations where it does not apply. How does the user learn to read it?',
  resources: [
    {
      id: 'resource-webaim-contrast',
      title: 'WebAIM Contrast Checker',
      url: 'https://webaim.org/resources/contrastchecker/',
      type: 'tool',
      author: 'WebAIM',
      estimatedMinutes: 5,
      note: 'Keep this open while choosing values. Checking takes seconds; guessing is unreliable.',
    },
    {
      id: 'resource-material-colour-roles',
      title: 'Color roles — Material Design 3',
      url: 'https://m3.material.io/styles/color/roles',
      type: 'documentation',
      author: 'Google',
      estimatedMinutes: 20,
      note: 'A thorough, production-tested model for naming colour by role rather than by hue.',
    },
  ],
  competencyTags: ['colour', 'accessibility', 'design-systems', 'ux-reasoning'],
  completionCriteria: [
    'Can separate semantic from structural colour.',
    'Can name colours by role and explain why hue names fail.',
    'Has verified contrast with a checker rather than by eye.',
    'Can demonstrate a status set that survives greyscale.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Lesson 10                                                                   */
/* -------------------------------------------------------------------------- */

const LESSON_5: Lesson = {
  id: 'lesson-responsive-layout-thinking',
  slug: 'responsive-layout-thinking',
  moduleId: MODULE_ID,
  lessonNumber: 5,
  title: 'Responsive Layout Thinking',
  summary:
    'Responsive design is not three fixed widths. It is deciding what the content needs and letting the layout follow — which is a decision about priority, made before any CSS.',
  estimatedMinutes: 9,
  objectives: [
    'Decide content priority independently of screen size.',
    'Explain why a layout should change when the content needs it to, not at a device width.',
    'Describe what reflow does to a design and plan for it.',
    'Identify what must never be lost at the narrowest width.',
  ],
  prerequisiteConcepts: [
    'Spacing scales',
    'Type scales and measure',
    'Visual hierarchy',
  ],
  prerequisiteLessonIds: [
    'lesson-typography-for-interfaces',
    'lesson-visual-hierarchy',
  ],
  recap: [
    {
      kind: 'paragraph',
      text: 'You now have three systems: spacing, type, and colour roles. Each is a short list applied consistently. This lesson is about what happens to them when the window changes size.',
    },
  ],
  priorKnowledge: [
    {
      kind: 'paragraph',
      text: 'You have almost certainly designed desktop, tablet and mobile frames. You also met measure last lesson — the idea that text has a comfortable line length regardless of how wide its container is.',
    },
    {
      kind: 'paragraph',
      text: 'That second idea is the seed of this whole lesson.',
    },
  ],
  coreConcept: [
    {
      kind: 'paragraph',
      text: 'A web layout is not placed. It flows.',
    },
    {
      kind: 'paragraph',
      text: 'In Figma you position elements on a frame of a chosen size. In a browser, content fills the space available and wraps when it runs out. The browser is doing continuous layout at every width, not three layouts at three widths.',
    },
    {
      kind: 'paragraph',
      text: 'Which means your three frames are samples of a continuum, not the thing itself. Between 768 and 1024 there are 256 widths you did not draw, and users will see all of them.',
    },
  ],
  whyDesignersCare: [
    {
      kind: 'paragraph',
      text: 'Because designing three frames and assuming the gaps take care of themselves is how layouts break in the middle.',
    },
    {
      kind: 'paragraph',
      text: 'The classic failure: a card grid designed at 1440 and 375 looks correct at both, and at 900 the third column is 180px wide with headings wrapping onto four lines. Nobody drew that frame, so nobody noticed.',
    },
    {
      kind: 'paragraph',
      text: 'Thinking in terms of what the content needs — rather than which device is being used — closes those gaps before they open.',
    },
  ],
  howItWorks: [
    {
      kind: 'paragraph',
      text: 'A **breakpoint** is a width at which the layout rules change. The useful question is what decides where they go.',
    },
    {
      kind: 'paragraph',
      text: 'The weak answer is device sizes: phone, tablet, laptop. Devices change constantly and windows get resized to arbitrary widths, so these are guesses that age badly.',
    },
    {
      kind: 'paragraph',
      text: 'The strong answer is the content. Put a breakpoint where the design stops working — where the measure gets too long, the columns get too narrow, the navigation no longer fits. You find those points by resizing until something breaks, then changing the rules just before it does.',
    },
  ],
  firstPrinciples: [
    {
      kind: 'paragraph',
      text: 'The underlying principle is priority. Narrow screens cannot show everything at once, so something must go first, something later, and something must become optional.',
    },
    {
      kind: 'paragraph',
      text: 'This forces a decision many desktop designs avoid: what is this screen actually *for*? A dashboard with twelve equally prominent panels has no answer, and so it has no sensible mobile layout. Designing narrow first tends to produce better wide layouts for exactly this reason — it makes you rank things.',
    },
  ],
  designPerspective: [
    {
      kind: 'paragraph',
      text: 'The design question is what must survive at the narrowest width.',
    },
    {
      kind: 'paragraph',
      text: 'Not what fits — what *must* be there. The primary action, the critical number, the way out. Everything else can be collapsed, moved below, or put behind a disclosure. Deciding this explicitly stops it being decided accidentally by whatever happened to wrap first.',
    },
  ],
  engineeringPerspective: [
    {
      kind: 'paragraph',
      text: 'The engineering question is how much the layout can do without being told.',
    },
    {
      kind: 'paragraph',
      text: 'Modern CSS can wrap a row into a column when space runs out, or fit as many columns as will comfortably fit, with no breakpoint at all. The less you hard-code, the fewer widths you have to anticipate. You will build exactly this in Module 3 with Flexbox and Grid.',
    },
  ],
  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'The design side supplies the priority order; the engineering side supplies rules that respect it at any width.',
    },
    {
      kind: 'paragraph',
      text: 'Give an engineer three frames and they must infer the rules, usually wrongly in the gaps. Give them a priority order and the constraints — "this never drops below 280px", "these two always stay together" — and they can build something that works at widths none of you drew.',
    },
  ],
  industryExamples: [
    {
      id: 'example-github-responsive-nav',
      source: 'GitHub',
      title: 'Navigation that reorders by priority',
      observation:
        'GitHub’s repository navigation collapses less-used items into a menu as width decreases, keeping the most-used tabs visible longest.',
      takeaway:
        'The order in which things disappear is itself a design decision, and it should reflect use rather than source order.',
    },
    {
      id: 'example-shopify-admin-mobile',
      source: 'Shopify',
      title: 'The same task, a different shape',
      observation:
        'Shopify’s admin presents the same operations on mobile with a reorganised layout rather than a scaled-down desktop one.',
      takeaway:
        'Responsive is not shrinking. It is re-expressing the same priorities in a different amount of space.',
    },
  ],
  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Convert a desktop pricing page to mobile without scaling it down.',
    },
    {
      kind: 'list',
      ordered: true,
      items: [
        'Write the priority order: the recommended plan, its price, what it includes, the call to action, then the comparison, then the FAQ.',
        'At the narrowest width, stack. Three columns become one, in priority order — so the recommended plan comes first rather than staying in the middle.',
        'Check the measure. Text that was comfortable in a 380px column may now span the full width; constrain it.',
        'Check touch targets. Anything tappable needs around 44px of height, which may be larger than the desktop treatment.',
        'Decide what collapses. A full comparison table rarely works narrow — it may become a per-plan list.',
        'Now resize continuously from 320 up to 1440 and find where it breaks. Put your breakpoints there, not at device widths.',
      ],
    },
    {
      kind: 'paragraph',
      text: 'Step two contains the real decision: on desktop the recommended plan is centre, which reads as "most prominent". Stacked, centre becomes second, which reads as "middling". Preserving the intent requires reordering, not just stacking.',
    },
  ],
  commonMistakes: [
    {
      id: 'mistake-02-05-device-breakpoints',
      mistake: 'Choosing breakpoints by device: 375, 768, 1024.',
      why: 'The layout then breaks at every width those numbers do not describe, which is most of them.',
      instead: 'Resize until the design fails, and put the breakpoint there.',
    },
    {
      id: 'mistake-02-05-stacking-preserves-meaning',
      mistake: 'Assuming that stacking columns preserves their meaning.',
      why: 'Horizontal prominence — centre, or rightmost — does not survive the move to a vertical sequence.',
      instead:
        'Decide the vertical order from the priority list, not from the left-to-right order of the desktop design.',
    },
  ],
  professionalConsideration: [
    {
      kind: 'paragraph',
      text: 'Width is not the only thing that varies. Height matters too, and so does input.',
    },
    {
      kind: 'paragraph',
      text: 'A short landscape window puts a sticky header and footer in competition for the content. A touch device has no hover, so anything revealed on hover is unreachable. A design that handles width perfectly can still be unusable on a phone held sideways with an on-screen keyboard open — a case worth checking because forms are where it bites.',
    },
  ],
  practicalExercise: {
    id: 'exercise-responsive-layout-thinking',
    title: 'Take a pricing page to mobile',
    prompt:
      'Convert a three-column desktop pricing page into a working narrow layout, driven by priority rather than by scaling.',
    steps: [
      'Write the content priority order before designing anything.',
      'Design the narrowest version first, at 320px.',
      'Design the widest version second, and note what you added rather than what you removed.',
      'Identify the width at which the wide layout stops working, by reasoning about measure and column width.',
      'Design that middle state.',
      'List every element that changes position, and confirm each move preserves its priority.',
      'Mark anything that is hidden at narrow widths and justify each.',
    ],
    successCriteria: [
      'Priority order written before any layout work.',
      'Narrow designed first, wide designed second.',
      'A middle state designed, with the breakpoint justified by content rather than device.',
      'Vertical order at narrow width matches the priority order, not the desktop left-to-right order.',
      'Every hidden element has a stated justification.',
    ],
    estimatedMinutes: 50,
    hint: 'Designing narrow first feels backwards and is worth doing anyway. It forces the priority decision immediately instead of letting you defer it.',
  },
  reflectionQuestion:
    'Why is it a mistake to choose breakpoints based on popular device sizes?',
  reflectionHint:
    'Think about how many widths exist between any two devices, and who decides how wide a browser window is.',
  resources: [
    {
      id: 'resource-webdev-responsive',
      title: 'Responsive design — Learn CSS',
      url: 'https://web.dev/learn/design',
      type: 'documentation',
      author: 'web.dev',
      estimatedMinutes: 60,
      note: 'A full course on responsive thinking. Read the early sections now and return to it during Module 3.',
    },
    {
      id: 'resource-mdn-responsive-basics',
      title: 'Responsive design — MDN',
      url: 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Responsive_Design',
      type: 'documentation',
      author: 'MDN',
      estimatedMinutes: 30,
      note: 'What breakpoints are and how layouts actually reflow, with the mechanics kept simple.',
    },
  ],
  competencyTags: ['responsive-design', 'layout', 'ux-reasoning', 'product-thinking'],
  completionCriteria: [
    'Can write a content priority order before laying anything out.',
    'Can justify a breakpoint by content rather than by device.',
    'Can explain why stacking columns does not preserve prominence.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Project                                                                     */
/* -------------------------------------------------------------------------- */

const PROJECT: ModuleProject = {
  id: 'project-responsive-pricing-page',
  slug: 'responsive-saas-pricing-page',
  moduleId: MODULE_ID,
  title: 'Responsive SaaS Pricing Page',
  brief:
    'Design a pricing page for a SaaS product at three widths, built from an explicit spacing scale, type scale and colour roles rather than from per-element decisions.',
  learnerGoal:
    'Produce a design whose every value comes from a system you can hand to someone else, and which holds together at widths you did not draw.',
  problem:
    'Pricing pages carry dense comparative information, a clear primary action, and content that changes shape completely between wide and narrow. They expose hierarchy and spacing problems that a simpler page would hide.',
  prerequisiteLessonIds: [
    'lesson-visual-hierarchy',
    'lesson-spacing-and-rhythm',
    'lesson-typography-for-interfaces',
    'lesson-colour-contrast-and-meaning',
    'lesson-responsive-layout-thinking',
  ],
  objectives: [
    'Apply one spacing scale, one type scale and one colour role set across a whole page.',
    'Express a clear priority order at three widths.',
    'Verify contrast rather than assume it.',
    'Document the systems so another person could extend the page.',
  ],
  requirements: [
    'Three plans, one marked as recommended.',
    'A feature comparison.',
    'One clear primary action per plan.',
    'Designs at approximately 1440px, 768px and 375px.',
    'A documented spacing scale, type scale and colour role set.',
    'Measured contrast ratios for every text-on-background pairing.',
  ],
  constraints: [
    'No value outside your documented scales. If something needs a value you do not have, change the scale deliberately and say why.',
    'No status or meaning conveyed by colour alone.',
    'The recommended plan must read as recommended at all three widths.',
    'Paragraph text must stay within a stated measure at every width.',
  ],
  suggestedScope:
    'One page, three widths, three documented systems. Around eight to twelve hours. Implementation is not required — this module is about the decisions. You will build a page in Module 3.',
  deliverables: [
    'A Figma file with the three widths.',
    'A one-page specification of the spacing scale, type scale and colour roles.',
    'A contrast table listing each pairing and its measured ratio.',
    'A short written note on the priority order and what changes between widths.',
  ],
  completionCriteria: [
    'Every spacing value in the design is on the documented scale.',
    'Every type style in the design is on the documented scale.',
    'Every colour is a named role, not a one-off value.',
    'All contrast ratios meet 4.5:1, or 3:1 for large text.',
    'The design holds together at a width between the ones you drew.',
    'The recommended plan is identifiable without relying on colour.',
  ],
  portfolioEvidence: [
    'Systematic thinking — decisions expressed as scales rather than as individual values.',
    'Hierarchy under density — a comparison table that stays readable.',
    'Responsive judgement — priority preserved across three widths.',
    'Accessibility practice — contrast measured, not assumed.',
  ],
  reflectionQuestion:
    'Which of your three scales was hardest to keep to, and what did the pressure to break it tell you about the design?',
  estimatedHours: 10,
  competencies: [
    'visual-hierarchy',
    'typography',
    'colour',
    'layout',
    'responsive-design',
    'accessibility',
    'design-systems',
  ],
  stretchGoals: [
    'Produce a dark theme by supplying a second value for each colour role, changing nothing else.',
    'Design the page with a monthly/annual toggle and decide what the price does while switching.',
    'Design the comparison table at 320px without hiding any feature.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Module                                                                      */
/* -------------------------------------------------------------------------- */

export const MODULE_02: CurriculumModule = {
  id: MODULE_ID,
  slug: 'visual-foundations',
  moduleNumber: 2,
  phase: 'foundations',
  title: 'Visual Foundations',
  description:
    'The visual decisions you already make, restated as systems a build can be made from: a spacing scale, a type scale, colour roles, and a priority order that survives any width.',
  outcome:
    'Can express visual decisions as documented scales rather than per-element judgements, and defend each with a reason.',
  prerequisites: [
    'Module 1, especially breaking an interface into parts',
    'Working knowledge of visual design practice',
  ],
  lessons: [LESSON_1, LESSON_2, LESSON_3, LESSON_4, LESSON_5],
  resources: [
    {
      id: 'resource-module-02-refactoring-ui',
      title: 'Refactoring UI',
      url: 'https://www.refactoringui.com/',
      type: 'book',
      author: 'Adam Wathan and Steve Schoger',
      estimatedMinutes: 180,
      note: 'The closest thing to a direct translation of design instincts into buildable rules.',
    },
    {
      id: 'resource-module-02-webdev-design',
      title: 'Learn Design — web.dev',
      url: 'https://web.dev/learn/design',
      type: 'documentation',
      author: 'web.dev',
      estimatedMinutes: 120,
      note: 'Responsive design taught from content outwards rather than from devices inwards.',
    },
    {
      id: 'resource-module-02-kevin-powell',
      title: 'Kevin Powell — CSS and layout on YouTube',
      url: 'https://www.youtube.com/@KevinPowell',
      type: 'video',
      author: 'Kevin Powell',
      estimatedMinutes: 45,
      note: 'Clear, beginner-appropriate video explanations of layout behaviour. Useful now, essential in Module 3.',
    },
    {
      id: 'resource-module-02-contrast-checker',
      title: 'WebAIM Contrast Checker',
      url: 'https://webaim.org/resources/contrastchecker/',
      type: 'tool',
      author: 'WebAIM',
      estimatedMinutes: 5,
      note: 'Keep open while building the colour role set for the project.',
    },
  ],
  project: PROJECT,
  competencies: [
    'visual-hierarchy',
    'typography',
    'colour',
    'layout',
    'responsive-design',
    'accessibility',
    'design-systems',
    'ux-reasoning',
    'critique',
    'product-thinking',
  ],
  completionCriteria: [
    'All five lessons completed.',
    'Module project marked completed.',
    'Can produce a spacing, type and colour system and justify every step in it.',
  ],
};
