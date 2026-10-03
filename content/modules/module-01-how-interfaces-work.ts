/**
 * Module 01 — How Interfaces Work.
 *
 * The first technical mental model, built entirely out of things the learner
 * has already clicked. No state machines, no architecture, no code. Every idea
 * arrives attached to a button, a menu or a form the learner already knows.
 *
 * The word "state" is deliberately withheld until lesson 4, where it names
 * something the learner has spent three lessons experiencing.
 */

import type { CurriculumModule, Lesson, ModuleProject } from '@/types/curriculum';

const MODULE_ID = 'module-01';

/* -------------------------------------------------------------------------- */
/* Lesson 1                                                                    */
/* -------------------------------------------------------------------------- */

const LESSON_1: Lesson = {
  id: 'lesson-what-makes-an-interface-interactive',
  slug: 'what-makes-an-interface-interactive',
  moduleId: MODULE_ID,
  lessonNumber: 1,
  title: 'What Makes an Interface Interactive?',
  summary:
    'A design shows one moment. A product answers. This lesson is about the difference, and about the loop that runs every time someone touches an interface.',
  estimatedMinutes: 8,
  objectives: [
    'Describe the difference between a screen that is drawn and a screen that responds.',
    'Name the three parts of an interaction: the action, the response, and the acknowledgement.',
    'Spot the moment in any interaction where the product tells you it heard you.',
    'Explain why an interface has to change depending on what is happening.',
  ],
  prerequisiteConcepts: [
    'Designing screens in a tool such as Figma',
    'Using everyday software: menus, forms, buttons',
  ],
  recap: [
    {
      kind: 'paragraph',
      text: 'This is the first lesson, so there is nothing to recap yet. What follows assumes only that you have designed screens and used software — nothing about engineering.',
    },
  ],
  priorKnowledge: [
    {
      kind: 'paragraph',
      text: 'You already know how to make a screen look right. You have drawn buttons, chosen type sizes, decided what sits next to what. You have probably also drawn a hover state, a filled-in form, maybe an error message in red.',
    },
    {
      kind: 'paragraph',
      text: 'That last part matters more than it looks. The moment you drew a second version of the same screen, you were describing behaviour. You just described it as pictures. This module is about what sits underneath those pictures.',
    },
  ],
  coreConcept: [
    {
      kind: 'paragraph',
      text: 'A design shows one moment. An interface answers.',
    },
    {
      kind: 'paragraph',
      text: 'When you press a button in a real product, something happens between your finger and the result. The button darkens. Perhaps a spinner appears. Then the thing you asked for arrives, or an error explains why it did not. None of that is decoration — it is the product telling you where your request has got to.',
    },
    {
      kind: 'paragraph',
      text: 'That back-and-forth is the whole subject. You do something, the product does something, and you understand what happened. Everything in this course is a more precise version of that sentence.',
    },
  ],
  whyDesignersCare: [
    {
      kind: 'paragraph',
      text: 'Because the gap between your mockup and the shipped product is almost entirely made of the moments you did not draw.',
    },
    {
      kind: 'paragraph',
      text: 'You hand over three frames: empty, filled, done. The engineer has to answer a dozen questions you did not: what does the button look like while it is working? What if it takes four seconds? What if the server refuses? What if the user presses it twice?',
    },
    {
      kind: 'paragraph',
      text: 'Whoever answers those questions is designing the product. If it is not you, it is someone deciding under time pressure in a pull request. Learning to see the loop is how you get those decisions back.',
    },
  ],
  howItWorks: [
    {
      kind: 'paragraph',
      text: 'Every interaction runs the same three beats. Once you see them, you cannot stop seeing them.',
    },
    {
      kind: 'list',
      ordered: true,
      items: [
        'The user does something. A click, a keystroke, a scroll, a drag.',
        'The product responds. It changes something — opens a panel, saves a value, fetches data.',
        'The user understands. Something visible tells them which of those happened.',
      ],
    },
    {
      kind: 'paragraph',
      text: 'The third beat is the one products get wrong. Steps one and two can both succeed and the interaction can still fail, because the person never found out. A save that works silently feels identical to a save that did nothing.',
    },
    {
      kind: 'callout',
      tone: 'insight',
      body: 'An interaction is not finished when the system finishes. It is finished when the person knows.',
    },
  ],
  firstPrinciples: [
    {
      kind: 'paragraph',
      text: 'Underneath the loop is cause and effect. The product must decide what each cause leads to — and crucially, it must decide for causes you did not plan for.',
    },
    {
      kind: 'paragraph',
      text: 'A toggle looks like it has two outcomes: on and off. Press it on a slow connection and there are more. The moment after you press, it is neither reliably on nor reliably off — it is waiting. Press it twice quickly and the product has to decide whether the second press cancels the first or queues behind it.',
    },
    {
      kind: 'paragraph',
      text: 'None of this is advanced. It is just what happens when an instant action meets a world that is not instant.',
    },
  ],
  designPerspective: [
    {
      kind: 'paragraph',
      text: 'The design question is: how long can the product stay silent before the person starts to doubt it?',
    },
    {
      kind: 'paragraph',
      text: 'Below roughly a tenth of a second, a response feels instant and needs no explanation. Past about a second, attention starts to drift and the silence needs filling. The acknowledgement is not politeness — it is the thing that stops someone pressing the button again.',
    },
  ],
  engineeringPerspective: [
    {
      kind: 'paragraph',
      text: 'The engineering question is: what is the product allowed to assume?',
    },
    {
      kind: 'paragraph',
      text: 'Pressing Save sends a request across a network that can be slow, can fail, and can succeed in a way the user never sees because they closed the tab. The code has to hold a position on each of those. It cannot assume success, and it cannot wait forever.',
    },
  ],
  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'The two questions are the same question asked from opposite ends.',
    },
    {
      kind: 'paragraph',
      text: '"How long before the user doubts us" and "how long might this take" meet in the middle, and the answer is a specific piece of interface: a spinner, a disabled button, a skeleton, or deliberately nothing at all because it is fast enough not to need one.',
    },
    {
      kind: 'paragraph',
      text: 'A design engineer is someone who can hold both ends at once. That is the entire job description, and this is the smallest example of it.',
    },
  ],
  industryExamples: [
    {
      id: 'example-linear-instant',
      source: 'Linear',
      title: 'Acting before the server answers',
      observation:
        'Creating or updating an issue in Linear appears to take effect immediately, rather than showing a spinner while the change is sent.',
      takeaway:
        'When an action is very likely to succeed and easy to undo, showing the result first makes the product feel instant. You will meet the trade-off behind this properly in Module 5.',
    },
    {
      id: 'example-stripe-checkout-feedback',
      source: 'Stripe',
      title: 'A payment button that refuses to be ambiguous',
      observation:
        'Stripe Checkout disables its pay button while a payment is processing and replaces the label with a progress indicator.',
      takeaway:
        'The riskier and less reversible the action, the more explicitly the interface should refuse to look idle. Nobody should be able to pay twice by accident.',
    },
  ],
  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Take a single interaction and write the loop out. Here is a message being sent in a chat application.',
    },
    {
      kind: 'list',
      ordered: true,
      items: [
        'User does: types a message and presses Enter.',
        'Product responds: the input clears, the message appears in the thread, a request goes to the server.',
        'User understands: the message is visible, so it was sent.',
      ],
    },
    {
      kind: 'paragraph',
      text: 'Now ask the uncomfortable question: what if the request fails? The message is already on screen. The user already believes it was sent. The product now owes them a correction — usually a quiet marker on that message and a way to retry.',
    },
    {
      kind: 'paragraph',
      text: 'That single question turned one interaction into two outcomes. Doing this deliberately, for every interaction, is most of what this module teaches.',
    },
  ],
  commonMistakes: [
    {
      id: 'mistake-01-01-only-happy-path',
      mistake: 'Designing only the moment after everything worked.',
      why: 'It is the easiest frame to draw and the least common frame in real use. Slow networks and refused requests are ordinary, not edge cases.',
      instead:
        'For every action, draw at least the waiting state and the failure state before you consider the screen finished.',
    },
    {
      id: 'mistake-01-01-silent-success',
      mistake: 'Letting a successful action produce no visible change.',
      why: 'The user cannot tell the difference between "it worked" and "nothing happened", so they press again — and now you have two requests.',
      instead:
        'Make sure something observable changes. It can be small, but it has to exist.',
    },
  ],
  professionalConsideration: [
    {
      kind: 'paragraph',
      text: 'Experienced practitioners pay attention to who the acknowledgement is for.',
    },
    {
      kind: 'paragraph',
      text: 'A toast saying "Saved" is a message to someone who was watching. If the save happened because they navigated away, nobody is there to read it. The right acknowledgement depends on where the person\'s attention actually is at that moment — which is a design judgement, not a technical one.',
    },
  ],
  goDeeper: [
    {
      kind: 'paragraph',
      text: 'If you want the research behind the timing numbers, they are not arbitrary. Roughly: 0.1 seconds feels instantaneous, 1 second keeps a train of thought unbroken, and 10 seconds is about the limit of attention before people switch to something else.',
    },
    {
      kind: 'paragraph',
      text: 'These thresholds have held up since the 1960s because they describe people, not machines. The Nielsen Norman Group resource below covers them properly. You do not need them memorised yet.',
    },
  ],
  practicalExercise: {
    id: 'exercise-what-makes-an-interface-interactive',
    title: 'Document five interactions',
    prompt:
      'Pick one app you use often — your banking app, Figma, Spotify, anything. Document five different interactions in it using the three-beat loop.',
    steps: [
      'Choose five interactions that are genuinely different from each other: a navigation, a toggle, something that saves, something that loads, something that can fail.',
      'For each, write three lines: "User does…", "Interface responds…", "User understands…".',
      'For the responses, describe what you can actually observe. Avoid guessing at what the code does.',
      'Mark any interaction where the third line was hard to write. That is a gap in the product, not in your observation.',
      'For one of the five, write down what you think should happen if it failed.',
    ],
    successCriteria: [
      'Five interactions documented, each with all three lines filled in.',
      'The five are meaningfully different from one another, not five variations on a button.',
      'At least one interaction is identified where the acknowledgement is weak or missing.',
      'One failure case is described in plain language.',
    ],
    estimatedMinutes: 25,
    hint: 'If every one of your five is a click that opens something, widen the net. Typing, dragging and waiting are interactions too.',
  },
  reflectionQuestion:
    'What makes an interface feel responsive even before you understand its technical implementation?',
  reflectionHint:
    'Think about the gap between action and acknowledgement. What fills that gap in products that feel good, and what sits there in products that feel sluggish?',
  resources: [
    {
      id: 'resource-nng-response-times',
      title: 'Response Times: The 3 Important Limits',
      url: 'https://www.nngroup.com/articles/response-times-3-important-limits/',
      type: 'article',
      author: 'Nielsen Norman Group',
      estimatedMinutes: 8,
      note: 'Where the 0.1, 1 and 10 second thresholds come from, and what each one means for feedback.',
    },
    {
      id: 'resource-hig-feedback',
      title: 'Feedback — Apple Human Interface Guidelines',
      url: 'https://developer.apple.com/design/human-interface-guidelines/feedback',
      type: 'documentation',
      author: 'Apple',
      estimatedMinutes: 10,
      note: 'A platform vendor stating plainly what an interface owes the user after an action.',
    },
  ],
  competencyTags: ['product-thinking', 'ux-reasoning', 'interaction-design'],
  completionCriteria: [
    'Can describe any interaction as action, response and acknowledgement.',
    'Can name an interaction in a product you use where the acknowledgement is missing.',
    'Can explain why a successful action still needs to be visible.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Lesson 2                                                                    */
/* -------------------------------------------------------------------------- */

const LESSON_2: Lesson = {
  id: 'lesson-buttons-links-inputs-and-controls',
  slug: 'buttons-links-inputs-and-controls',
  moduleId: MODULE_ID,
  lessonNumber: 2,
  title: 'Buttons, Links, Inputs and Controls',
  summary:
    'The browser ships a small set of controls, each with a job and a set of behaviours attached. Knowing which is which is the first piece of real engineering knowledge.',
  estimatedMinutes: 9,
  objectives: [
    'Name the common browser controls and what each one is for.',
    'Tell the difference between a button and a link by what they do, not how they look.',
    'Explain what you get for free when you choose the right control.',
    'Recognise when a Figma component maps to a real control and when it does not.',
  ],
  prerequisiteConcepts: [
    'The interaction loop from lesson 1',
    'Building components in Figma',
  ],
  prerequisiteLessonIds: ['lesson-what-makes-an-interface-interactive'],
  recap: [
    {
      kind: 'paragraph',
      text: 'Last lesson you broke interactions into three beats: the user does something, the product responds, and the user understands. You documented five of them in an app you use.',
    },
  ],
  priorKnowledge: [
    {
      kind: 'paragraph',
      text: 'You know that the thing a user touches is where the loop starts. You also know, from Figma, that interfaces are built from a small set of repeated pieces — you have probably made a Button component with variants.',
    },
    {
      kind: 'paragraph',
      text: 'The browser has its own version of that component set. It is smaller than you would expect, and the pieces come with behaviour already attached.',
    },
  ],
  coreConcept: [
    {
      kind: 'paragraph',
      text: 'Controls are not shapes. They are jobs.',
    },
    {
      kind: 'paragraph',
      text: 'In Figma, a button and a link can be the same rectangle with different text colour. In a browser they are different things with different built-in behaviour, and choosing between them is a decision about what the thing does.',
    },
    {
      kind: 'list',
      items: [
        'Button — performs an action. Saves, submits, opens, deletes.',
        'Link — goes somewhere. A different page, a different part of this page, another site.',
        'Text input — collects a short piece of text.',
        'Textarea — collects a longer piece of text, across multiple lines.',
        'Checkbox — an independent yes or no. Several can be ticked at once.',
        'Radio — one choice from a set. Picking one unpicks the others.',
        'Select — one choice from a longer list, collapsed until opened.',
      ],
    },
  ],
  whyDesignersCare: [
    {
      kind: 'paragraph',
      text: 'Because picking the right one gives you behaviour you would otherwise have to design, specify and test.',
    },
    {
      kind: 'paragraph',
      text: 'A real link can be opened in a new tab, copied, bookmarked, and read aloud as "link" by a screen reader. A real checkbox can be reached by keyboard and toggled with Space. You get all of that by choosing correctly, and you lose all of it the moment someone builds a "button" out of a plain box.',
    },
    {
      kind: 'paragraph',
      text: 'That loss is invisible in a mockup. It shows up months later as an accessibility bug nobody can quite explain.',
    },
  ],
  howItWorks: [
    {
      kind: 'paragraph',
      text: 'Each control is a piece of HTML — the language that describes what is on a page. You will write it properly in Module 3. For now, just notice that the name of the thing is literally in the markup.',
    },
    {
      kind: 'code',
      language: 'html',
      code: '<button>Save changes</button>\n\n<a href="/settings">Settings</a>\n\n<input type="text">\n\n<input type="checkbox">',
    },
    {
      kind: 'paragraph',
      text: 'Reading that line by line: `<button>` wraps the text that appears on the button. `<a>` is a link, and `href` is where it goes. `<input>` collects something, and `type` says what kind. That is the whole of it for now.',
    },
    {
      kind: 'paragraph',
      text: 'The important part is not the syntax. It is that the browser reads these names and attaches behaviour accordingly — focus, keyboard handling, and what assistive technology announces.',
    },
  ],
  firstPrinciples: [
    {
      kind: 'paragraph',
      text: 'The rule underneath is **affordance**: the quality of a thing that tells you what you can do with it. A handle affords pulling. A flat plate affords pushing.',
    },
    {
      kind: 'paragraph',
      text: 'In software the affordance has two halves. There is what it looks like, which you control. And there is what it actually does, which comes from the control you chose. When those two halves disagree, the interface lies — and users are extremely good at noticing, even when they cannot say why something felt wrong.',
    },
  ],
  designPerspective: [
    {
      kind: 'paragraph',
      text: 'The design question is what the element promises. A thing styled as a button promises that pressing it will do something here and now. A thing styled as a link promises travel.',
    },
    {
      kind: 'paragraph',
      text: 'You are allowed to style a link to look like a button — "Get started" on a marketing page is a link wearing a button\'s clothes, and that is fine, because it does take you somewhere. What you should not do is make an action look like a destination, or the reverse.',
    },
  ],
  engineeringPerspective: [
    {
      kind: 'paragraph',
      text: 'The engineering question is what behaviour you inherit. Choosing a real control means the browser handles focus order, keyboard activation, and the name announced to assistive technology.',
    },
    {
      kind: 'paragraph',
      text: 'Build the same thing out of a generic box and all of that becomes yours to implement by hand, correctly, forever. Most teams do not, which is why so many custom dropdowns cannot be used with a keyboard.',
    },
  ],
  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'A design engineer picks the control by its job and then styles it freely.',
    },
    {
      kind: 'paragraph',
      text: 'The appearance is a design decision. The element is an engineering decision. They are genuinely separable, and keeping them separate is what lets you have an interface that looks exactly as drawn and still works by keyboard.',
    },
  ],
  industryExamples: [
    {
      id: 'example-github-actions-vs-links',
      source: 'GitHub',
      title: 'Actions and destinations side by side',
      observation:
        'On a pull request, "Merge pull request" is a button and the branch name beside it is a link. They sit inches apart and are styled differently.',
      takeaway:
        'The visual difference is doing real work: one changes the repository, the other moves you somewhere. Confusing them would be expensive.',
    },
    {
      id: 'example-shopify-polaris-controls',
      source: 'Shopify',
      title: 'A design system that documents the choice',
      observation:
        "Shopify's Polaris documents when to use a button versus a link, rather than leaving it to taste.",
      takeaway:
        'Mature design systems write this down because it is the kind of decision that silently drifts across a large product otherwise.',
    },
  ],
  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Take a notification settings row: a label, a short description, and a switch. Which controls is it made of?',
    },
    {
      kind: 'list',
      items: [
        'The switch is a checkbox. It is an independent yes or no, which is exactly what a checkbox is, however it is styled.',
        'The label is text attached to that checkbox, so that clicking the words toggles the switch — which users expect without ever being told.',
        'The description is ordinary text. It is not interactive and should not look it.',
      ],
    },
    {
      kind: 'paragraph',
      text: 'Now a trickier one: "Manage billing" at the bottom of that panel. If it opens a billing page, it is a link. If it opens a dialog on this page, it is a button. Same words, same styling, different element — because they do different things.',
    },
  ],
  commonMistakes: [
    {
      id: 'mistake-01-02-div-button',
      mistake: 'Making a button out of a plain box because it was easier to style.',
      why: 'It cannot be focused or activated by keyboard, and assistive technology announces it as nothing in particular. The interface looks finished and is not.',
      instead:
        'Use a real button and style it. Browsers let you remove every default style; there is nothing you gain by avoiding the element.',
    },
    {
      id: 'mistake-01-02-link-as-action',
      mistake: 'Using a link for something that performs an action.',
      why: 'Links can be opened in a new tab and middle-clicked. An action behind a link produces confusing results when the user does either.',
      instead: 'If it changes something rather than going somewhere, it is a button.',
    },
  ],
  professionalConsideration: [
    {
      kind: 'paragraph',
      text: 'A useful test when you cannot decide: could the user reasonably want to open this in a new tab?',
    },
    {
      kind: 'paragraph',
      text: 'If yes, it is a destination and should be a link. If opening it in a new tab would be nonsense — "Delete account" in a new tab — then it is an action and should be a button. The test is quick and it almost never gives the wrong answer.',
    },
  ],
  practicalExercise: {
    id: 'exercise-buttons-links-inputs-and-controls',
    title: 'Audit a settings screen',
    prompt:
      'Open the settings screen of a product you use and classify every interactive element on it.',
    steps: [
      'List every element you can click, type into, or toggle. Aim for at least ten.',
      'For each, write which control it should be: button, link, text input, textarea, checkbox, radio, or select.',
      'For each, write one short line saying why — what job it is doing.',
      'Mark any element where the styling suggests one thing and the behaviour does another.',
      'Find at least one case where you are genuinely unsure, and apply the new-tab test to it.',
    ],
    successCriteria: [
      'At least ten elements listed and classified.',
      'Every classification has a reason attached, not just a label.',
      'At least one mismatch or ambiguity identified and reasoned about.',
      'The radio-versus-checkbox distinction is applied correctly where both appear.',
    ],
    estimatedMinutes: 25,
    hint: 'Settings screens are full of switches. Ask yourself for each one whether turning it on has any effect on the others — that answer decides checkbox or radio.',
  },
  reflectionQuestion:
    'When should something look like a button but actually be a link?',
  reflectionHint:
    'Think destination versus action. What is the user actually about to do, and what would they expect if they middle-clicked it?',
  resources: [
    {
      id: 'resource-mdn-html-forms-intro',
      title: 'Your first form — MDN Learn',
      url: 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms/Your_first_form',
      type: 'documentation',
      author: 'MDN',
      estimatedMinutes: 20,
      note: 'The gentlest correct introduction to real form controls. Read it, do not memorise it.',
    },
    {
      id: 'resource-polaris-button',
      title: 'Button — Shopify Polaris',
      url: 'https://polaris.shopify.com/components/actions/button',
      type: 'documentation',
      author: 'Shopify',
      estimatedMinutes: 10,
      note: 'A production design system stating when a button is the right choice and when it is not.',
    },
  ],
  competencyTags: ['html', 'interaction-design', 'accessibility', 'ux-reasoning'],
  completionCriteria: [
    'Can name the seven common controls and the job of each.',
    'Can decide button or link using the new-tab test.',
    'Can explain what behaviour is lost when a control is faked with a plain box.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Lesson 3                                                                    */
/* -------------------------------------------------------------------------- */

const LESSON_3: Lesson = {
  id: 'lesson-what-happens-when-a-user-takes-an-action',
  slug: 'what-happens-when-a-user-takes-an-action',
  moduleId: MODULE_ID,
  lessonNumber: 3,
  title: 'What Happens When a User Takes an Action?',
  summary:
    'Between the click and the result there is a chain of handovers. Knowing the chain is what lets you reason about why an interface did something unexpected.',
  estimatedMinutes: 9,
  objectives: [
    'Trace the path from a physical action to a change on screen.',
    'Explain what an event is, in plain language.',
    'Describe what focus is and why it matters beyond accessibility.',
    'Explain why keyboard and pointer are two routes to the same action.',
  ],
  prerequisiteConcepts: [
    'The interaction loop from lesson 1',
    'Browser controls from lesson 2',
  ],
  prerequisiteLessonIds: [
    'lesson-what-makes-an-interface-interactive',
    'lesson-buttons-links-inputs-and-controls',
  ],
  recap: [
    {
      kind: 'paragraph',
      text: 'Last lesson you learned that controls are jobs rather than shapes, and that choosing the right one hands you behaviour for free. You audited a settings screen and classified what you found.',
    },
  ],
  priorKnowledge: [
    {
      kind: 'paragraph',
      text: 'You know the loop — action, response, acknowledgement — and you know which elements the action lands on. What you have not seen is the middle: what actually carries the action from the user to the product.',
    },
  ],
  coreConcept: [
    {
      kind: 'paragraph',
      text: 'When a user does something, the browser announces it. That announcement is called an **event**.',
    },
    {
      kind: 'paragraph',
      text: 'A click is an event. Typing a character is an event. Submitting a form, pressing a key, moving focus into a field — all events. The browser notices the thing happening and says so, and the application can choose to listen and react.',
    },
    {
      kind: 'paragraph',
      text: 'That is the whole mechanism. The user acts, the browser announces, the application responds, the screen changes.',
    },
  ],
  whyDesignersCare: [
    {
      kind: 'paragraph',
      text: 'Because this chain explains almost every "why did it do that?" moment you have ever had with a product.',
    },
    {
      kind: 'paragraph',
      text: 'Why did the dropdown close when I clicked inside it? Why did pressing Enter submit the form when I only wanted a new line? Why did the tooltip disappear before I could read it? Each of those is a question about which events the application chose to listen to, and what it decided to do about them.',
    },
    {
      kind: 'paragraph',
      text: 'Once you can ask the question in those terms, you can file a bug an engineer can act on — or spot the problem before it ships.',
    },
  ],
  howItWorks: [
    {
      kind: 'paragraph',
      text: 'The chain has four links. Pressing "Save" on a profile form runs all of them.',
    },
    {
      kind: 'list',
      ordered: true,
      items: [
        'The user acts. They click Save, or they focus it with the keyboard and press Enter.',
        'The browser raises an event. It notices and announces: a click happened, on this element.',
        'The application reacts. Code that was listening for that event runs. It reads the form, checks it, and sends it somewhere.',
        'The interface updates. Something visible changes, because of what the code found.',
      ],
    },
    {
      kind: 'paragraph',
      text: 'You do not need to write that code yet — that is Module 4. What matters now is that step three is a decision somebody made, not something that happens automatically. If the interface does something strange, a human chose it.',
    },
  ],
  firstPrinciples: [
    {
      kind: 'paragraph',
      text: 'There is a second idea hiding in step one: **focus**. At any moment, exactly one thing on the page is the thing keyboard input will go to. That is the focused element.',
    },
    {
      kind: 'paragraph',
      text: 'Focus is not an accessibility feature bolted on afterwards. It is the fundamental way the page knows where you are. A mouse lets you point at anything, so focus feels invisible. Take the mouse away and focus becomes the only means of navigation there is.',
    },
    {
      kind: 'callout',
      tone: 'note',
      body: 'Press Tab repeatedly on any page. The thing that moves is focus. If you lose track of where it is, so would anyone navigating that way permanently.',
    },
  ],
  designPerspective: [
    {
      kind: 'paragraph',
      text: 'The design question is whether the person can always tell where they are and what pressing a key would do.',
    },
    {
      kind: 'paragraph',
      text: 'That means a visible focus indicator that you designed on purpose rather than one the browser supplies by accident — and it means thinking about where focus should land after something changes. Open a dialog and focus should go into it. Close it and focus should return to whatever opened it.',
    },
  ],
  engineeringPerspective: [
    {
      kind: 'paragraph',
      text: 'The engineering question is which events to listen for, and what to do about ones you did not expect.',
    },
    {
      kind: 'paragraph',
      text: 'Listening only for clicks is the most common mistake in the entire discipline. It works perfectly with a mouse and excludes everyone else. A real button handles Enter and Space automatically — which is, again, why the element you choose matters.',
    },
  ],
  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'Pointer and keyboard are two routes to the same destination. Good interfaces treat them as equals.',
    },
    {
      kind: 'paragraph',
      text: 'The design side makes sure the route is visible. The engineering side makes sure it works. Neither is sufficient alone: a perfectly keyboard-operable interface with no focus indicator is unusable, and a beautifully designed focus ring on something you cannot reach by Tab is decoration.',
    },
  ],
  industryExamples: [
    {
      id: 'example-raycast-keyboard-first',
      source: 'Raycast',
      title: 'Keyboard as the primary route',
      observation:
        'Raycast is operated almost entirely from the keyboard, and shows the relevant shortcut next to actions as you move through them.',
      takeaway:
        'When keyboard is treated as a first-class route rather than a fallback, the interface has to make focus and available actions continuously visible.',
    },
    {
      id: 'example-figma-shortcuts',
      source: 'Figma',
      title: 'The same action from two routes',
      observation:
        'Most Figma actions are available from a menu and from a keyboard shortcut, and the menu displays the shortcut beside the item.',
      takeaway:
        'Showing both routes in one place teaches the faster one without forcing it, and confirms the two do the same thing.',
    },
  ],
  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Trace pressing Save on a profile form, all the way through.',
    },
    {
      kind: 'list',
      ordered: true,
      items: [
        'Focus is on the Save button, either because the user clicked it or tabbed to it.',
        'They press Enter, or click. Either way the browser raises an activation event on the button.',
        'Because the button is inside a form, the browser also raises a submit event on the form itself.',
        'Application code listening for submit runs. It reads the name and email fields.',
        'It checks them. If the email is missing an @, it stops here and shows an error — the loop ends in a correction.',
        'If the values are fine, it sends them to the server, and changes the button to show that something is happening.',
        'When the server answers, the interface updates again: saved, or failed with a reason.',
      ],
    },
    {
      kind: 'paragraph',
      text: 'Seven steps for one button press. You do not need to hold all seven in your head when designing — but when something misbehaves, the fault is in one of them, and knowing the list tells you where to look.',
    },
  ],
  commonMistakes: [
    {
      id: 'mistake-01-03-click-only',
      mistake: 'Assuming every action begins with a mouse click.',
      why: 'It excludes keyboard users, screen reader users, and anyone whose pointing device is temporarily unavailable. The interaction simply does not exist for them.',
      instead:
        'Check every interaction with the keyboard alone. If you cannot reach it with Tab and activate it with Enter or Space, it is unfinished.',
    },
    {
      id: 'mistake-01-03-focus-after-change',
      mistake: 'Not deciding where focus goes after the interface changes.',
      why: 'When a dialog closes or a section disappears, focus can be left pointing at nothing. Keyboard users get dropped back to the top of the page with no explanation.',
      instead:
        'Treat focus as something you place deliberately, the same way you place a cursor.',
    },
  ],
  professionalConsideration: [
    {
      kind: 'paragraph',
      text: 'Events travel. A click on a button inside a card also reaches the card, and then the section containing it, and so on outwards.',
    },
    {
      kind: 'paragraph',
      text: 'This is why clicking a delete icon inside a clickable row sometimes also opens the row — two things both heard the same click. You will handle this properly in Module 4. For now it is enough to know that overlapping interactive areas are a real source of bugs, and that nesting a control inside another control is worth avoiding in your designs.',
    },
  ],
  practicalExercise: {
    id: 'exercise-what-happens-when-a-user-takes-an-action',
    title: 'Map a Save action',
    prompt:
      'Take a profile form in any product you use — name, email, maybe a photo — and map what happens after Save is pressed.',
    steps: [
      'Write the steps from the physical action to the final visible change. Aim for five to eight.',
      'Mark which steps you can actually observe and which you are inferring.',
      'Do the whole thing again using only the keyboard: Tab to the field, type, Tab to Save, press Enter.',
      'Note any point where the keyboard route behaves differently or breaks.',
      'Write what you think happens if the network fails at the slowest step.',
    ],
    successCriteria: [
      'A step-by-step map from action to visible change.',
      'Observed steps distinguished from inferred ones.',
      'The keyboard route tested in a real product, with any differences noted.',
      'One failure point identified and described.',
    ],
    estimatedMinutes: 30,
    hint: 'Unplug or ignore your mouse entirely for the keyboard pass. Doing it properly is uncomfortable, which is the point.',
  },
  reflectionQuestion:
    'Why should designers care whether something works by keyboard as well as mouse?',
  reflectionHint:
    'Interaction is larger than pointer movement. Consider who is navigating this way, and also what keyboard operability says about how clearly the interface is structured.',
  resources: [
    {
      id: 'resource-mdn-events-intro',
      title: 'Introduction to events — MDN Learn',
      url: 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Events',
      type: 'documentation',
      author: 'MDN',
      estimatedMinutes: 25,
      note: 'What an event is and how listening works. Read the opening sections; the code will make more sense after Module 4.',
    },
    {
      id: 'resource-webaim-keyboard',
      title: 'Keyboard Accessibility',
      url: 'https://webaim.org/techniques/keyboard/',
      type: 'article',
      author: 'WebAIM',
      estimatedMinutes: 15,
      note: 'Focus, tab order and keyboard activation explained without requiring any code.',
    },
  ],
  competencyTags: ['interaction-design', 'accessibility', 'browser-apis', 'ux-reasoning'],
  completionCriteria: [
    'Can trace an action from physical input to visible change.',
    'Can explain what focus is and demonstrate it with the Tab key.',
    'Has operated a real product using only the keyboard and noted where it failed.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Lesson 4                                                                    */
/* -------------------------------------------------------------------------- */

const LESSON_4: Lesson = {
  id: 'lesson-feedback-loading-success-and-error',
  slug: 'feedback-loading-success-and-error',
  moduleId: MODULE_ID,
  lessonNumber: 4,
  title: 'Feedback, Loading, Success and Error',
  summary:
    'The waiting, the result and the failure are all interface you have to design. This is also where the word "state" finally earns its place.',
  estimatedMinutes: 9,
  objectives: [
    'Design the four moments of an action: idle, working, succeeded, failed.',
    'Use the word "state" accurately to describe what is currently true.',
    'Decide when feedback should persist and when it should disappear.',
    'Explain what a disabled control communicates, and when it is the wrong choice.',
  ],
  prerequisiteConcepts: [
    'The interaction loop from lesson 1',
    'The event chain from lesson 3',
  ],
  prerequisiteLessonIds: ['lesson-what-happens-when-a-user-takes-an-action'],
  recap: [
    {
      kind: 'paragraph',
      text: 'Last lesson you traced an action from the physical press through the browser event to the visible change, and found that one button press is really seven steps.',
    },
  ],
  priorKnowledge: [
    {
      kind: 'paragraph',
      text: 'You already noticed in lesson 1 that a product can be waiting — neither done nor not started. In lesson 3 you saw where the waiting comes from: the request has left and the answer has not arrived.',
    },
    {
      kind: 'paragraph',
      text: 'What you have been describing without a word for it, this lesson names.',
    },
  ],
  coreConcept: [
    {
      kind: 'paragraph',
      text: 'An action is not one moment. It is at least four, and each one is a different interface.',
    },
    {
      kind: 'list',
      items: [
        'Idle — nothing has happened yet. The button is ready.',
        'Working — the request is in flight. The user needs to know it was heard.',
        'Succeeded — it worked. The user needs to know, and may need to see the result.',
        'Failed — it did not work. The user needs to know why, and what to do next.',
      ],
    },
    {
      kind: 'paragraph',
      text: 'These four are examples of **state**: what is currently true about the interface. Not what it looks like — what is true. "The save is in progress" is a state. "The button is grey" is how you chose to show that state.',
    },
    {
      kind: 'callout',
      tone: 'insight',
      body: 'State is the fact. The visual is the representation of the fact. Keeping those two apart in your head is the single most useful habit in this course.',
    },
  ],
  whyDesignersCare: [
    {
      kind: 'paragraph',
      text: 'Because three of the four are usually missing from the handoff, and somebody has to invent them.',
    },
    {
      kind: 'paragraph',
      text: 'When the designer does not supply the failed state, the engineer writes whatever the error object happens to contain. That is how products end up showing "Error: 500" to a person who just wanted to change their email address.',
    },
    {
      kind: 'paragraph',
      text: 'Designing the failure is not pessimism. It is the part of the work most likely to be seen by someone already having a bad time.',
    },
  ],
  howItWorks: [
    {
      kind: 'paragraph',
      text: 'The four states map onto the chain from lesson 3.',
    },
    {
      kind: 'list',
      items: [
        'Idle is before the event. Nothing has been raised.',
        'Working begins the moment application code sends the request, and lasts until an answer comes back.',
        'Succeeded and failed are the two ways that answer can arrive.',
      ],
    },
    {
      kind: 'paragraph',
      text: 'Two more appear in practice. **Disabled** means the action is not available — the form is incomplete, or the user lacks permission. **Retry** is what failed turns into once you give the person a way forward.',
    },
    {
      kind: 'paragraph',
      text: 'Notice that disabled is a different kind of thing from working. Working is temporary and caused by the system. Disabled is a rule about whether the action is allowed at all.',
    },
  ],
  firstPrinciples: [
    {
      kind: 'paragraph',
      text: 'The underlying principle is that the interface must never be ambiguous about which of these is true.',
    },
    {
      kind: 'paragraph',
      text: 'A button that looks identical while idle and while working invites a second press. A success message that looks like an error costs the user a moment of panic. The states are genuinely different facts, and the interface owes the user a reliable way to tell them apart — which, as you will see throughout this course, should never be colour alone.',
    },
  ],
  designPerspective: [
    {
      kind: 'paragraph',
      text: 'The design question is how long each state should last and how loudly it should speak.',
    },
    {
      kind: 'paragraph',
      text: 'Success that requires no further action can fade away on its own — the user saw it, the job is done. Failure usually should not, because it asks the person to decide something. A message that vanishes before it can be read is worse than no message, because the person knows something happened and cannot find out what.',
    },
  ],
  engineeringPerspective: [
    {
      kind: 'paragraph',
      text: 'The engineering question is which state the interface is in and how it is allowed to change.',
    },
    {
      kind: 'paragraph',
      text: 'The code holds a value — roughly, "we are currently working" — and the interface is drawn from it. Getting this wrong produces the classic bug where a spinner never stops: the request finished, but nothing updated the value that the spinner was reading.',
    },
  ],
  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'The design and engineering halves are two readings of the same list.',
    },
    {
      kind: 'paragraph',
      text: 'When a designer enumerates idle, working, succeeded and failed, they have handed the engineer the exact set of cases the code has to cover. When an engineer asks "what should this look like while it is working?", they are asking the designer to finish a decision only the designer can make. The list is the shared artefact.',
    },
  ],
  industryExamples: [
    {
      id: 'example-vercel-deploy-states',
      source: 'Vercel',
      title: 'A long action with a visible middle',
      observation:
        'A Vercel deployment moves through queued, building, and ready or error, with the current stage shown throughout rather than only at the end.',
      takeaway:
        'When an action genuinely takes minutes, "working" is not one state but several, and showing which one is running makes a long wait tolerable.',
    },
    {
      id: 'example-notion-saving-indicator',
      source: 'Notion',
      title: 'Quiet, continuous acknowledgement',
      observation:
        'Notion saves continuously as you type and indicates saving status unobtrusively rather than interrupting with confirmations.',
      takeaway:
        'For frequent, low-risk, reversible actions, feedback should be ambient. A modal confirmation on every keystroke would be unusable.',
    },
  ],
  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Design a Save button properly. Four versions, stated as facts first and visuals second.',
    },
    {
      kind: 'list',
      items: [
        'Idle — nothing is in progress. Button reads "Save changes", fully interactive.',
        'Working — a request is in flight. Button reads "Saving…", not pressable, so a second press cannot send a second request.',
        'Succeeded — the server confirmed. A brief "Saved" appears, then fades. The button returns to idle.',
        'Failed — the server refused or could not be reached. The message says what happened and offers "Try again". Nothing fades; the person has to decide.',
      ],
    },
    {
      kind: 'paragraph',
      text: 'Now the detail that separates a considered design from a rushed one: what does the form look like during "working"? If the fields stay editable, the user can change the email that is currently being saved. Usually you want the fields to stay visible but not editable, so the person can still read what they submitted.',
    },
  ],
  commonMistakes: [
    {
      id: 'mistake-01-04-disabled-no-reason',
      mistake: 'Disabling a button without saying why it is disabled.',
      why: 'The user is left guessing which of several requirements they have not met. A greyed-out button is a refusal with no explanation.',
      instead:
        'Either explain what is missing, or leave the button active and explain on press. A disabled control should be a last resort, not a default.',
    },
    {
      id: 'mistake-01-04-error-with-no-exit',
      mistake: 'Showing an error with no way forward.',
      why: '"Something went wrong" tells the person their work is in jeopardy and offers nothing to do about it.',
      instead:
        'Every failure state should contain at least one action: retry, go back, or contact someone. Failure is a fork in the road, not a wall.',
    },
  ],
  professionalConsideration: [
    {
      kind: 'paragraph',
      text: 'Not every wait deserves a spinner. Showing one for an action that completes in 80 milliseconds produces a flash that reads as a glitch.',
    },
    {
      kind: 'paragraph',
      text: 'Mature products often wait a short interval before showing any loading indicator at all, so fast actions appear instant and only genuinely slow ones get explained. Deciding that threshold, and applying it consistently, is the kind of detail that makes an interface feel calm.',
    },
  ],
  practicalExercise: {
    id: 'exercise-feedback-loading-success-and-error',
    title: 'Four versions of Save',
    prompt:
      'Design the four states of a single Save action on a settings form: idle, loading, success and error.',
    steps: [
      'Before drawing anything, write the four states as sentences of fact — what is true in each.',
      'Design each of the four. They should be recognisably the same screen, not four different designs.',
      'For each, make sure the state is distinguishable without relying on colour alone.',
      'Decide for each whether it persists or disappears, and write down why.',
      'Add a fifth frame for disabled, and write the reason the action is unavailable.',
      'Note what happens to the form fields themselves during loading.',
    ],
    successCriteria: [
      'Four states designed, each described as a fact before being drawn.',
      'Each state distinguishable without colour alone.',
      'Persistence decided and justified for each.',
      'The error state contains at least one action the user can take.',
      'The behaviour of the form fields during loading is stated.',
    ],
    estimatedMinutes: 40,
    hint: 'Write the sentences before opening Figma. If you cannot say what is true in a state, you are not ready to draw it.',
  },
  reflectionQuestion: 'When should success feedback disappear automatically?',
  reflectionHint:
    'Ask whether the user needs to act on the message later. What is the cost if they miss it entirely?',
  resources: [
    {
      id: 'resource-nng-progress-indicators',
      title: 'Progress Indicators Make a Slow System Less Insufferable',
      url: 'https://www.nngroup.com/articles/progress-indicators/',
      type: 'article',
      author: 'Nielsen Norman Group',
      estimatedMinutes: 10,
      note: 'When to show progress, which kind, and why the wrong indicator makes waiting feel longer.',
    },
    {
      id: 'resource-hig-loading',
      title: 'Loading — Apple Human Interface Guidelines',
      url: 'https://developer.apple.com/design/human-interface-guidelines/loading',
      type: 'documentation',
      author: 'Apple',
      estimatedMinutes: 8,
      note: 'Practical guidance on communicating that something is happening without making it feel slower.',
    },
  ],
  competencyTags: [
    'interaction-design',
    'ux-reasoning',
    'interface-state-modelling',
    'product-thinking',
  ],
  completionCriteria: [
    'Can enumerate the four states of any action without prompting.',
    'Can state the difference between a state and its representation.',
    'Has designed a failure state that offers the user a way forward.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Lesson 5                                                                    */
/* -------------------------------------------------------------------------- */

const LESSON_5: Lesson = {
  id: 'lesson-breaking-an-interface-into-parts',
  slug: 'breaking-an-interface-into-parts',
  moduleId: MODULE_ID,
  lessonNumber: 5,
  title: 'Breaking an Interface Into Parts',
  summary:
    'Interfaces are built from repeated pieces. Which pieces, and where the lines between them fall, is a decision — and it is decided by behaviour more than by appearance.',
  estimatedMinutes: 8,
  objectives: [
    'Break a screen into pages, sections, and controls.',
    'Identify repeated patterns that are candidates for reuse.',
    'Judge whether two similar-looking elements are really the same thing.',
    'Explain why behaviour is a better boundary than appearance.',
  ],
  prerequisiteConcepts: [
    'Browser controls from lesson 2',
    'Interface states from lesson 4',
    'Components and instances in Figma',
  ],
  prerequisiteLessonIds: [
    'lesson-buttons-links-inputs-and-controls',
    'lesson-feedback-loading-success-and-error',
  ],
  recap: [
    {
      kind: 'paragraph',
      text: 'Last lesson you met the word "state" and designed four versions of a single Save action, each one a different fact about what was happening.',
    },
  ],
  priorKnowledge: [
    {
      kind: 'paragraph',
      text: 'You already build components in Figma, so the idea of a reusable piece is familiar. You also now know that a piece can have states — your Button component probably has variants for hover, pressed and disabled.',
    },
    {
      kind: 'paragraph',
      text: 'That is most of the concept already. What changes is the basis on which you decide where one piece ends and the next begins.',
    },
  ],
  coreConcept: [
    {
      kind: 'paragraph',
      text: 'Any screen can be read at three levels, from the outside in.',
    },
    {
      kind: 'list',
      items: [
        'The page — the whole thing the person navigated to.',
        'Sections — the major regions inside it. A sidebar, a header, a settings panel, a list.',
        'Controls — the individual things a person touches. A button, a field, a row.',
      ],
    },
    {
      kind: 'paragraph',
      text: 'Between sections and controls sit the repeated patterns: the bits that appear more than once. A row in a list. A card. A labelled field with its error message. These are the pieces worth naming, because naming them is what lets you build one and use it everywhere.',
    },
  ],
  whyDesignersCare: [
    {
      kind: 'paragraph',
      text: 'Because the parts you name are the parts that stay consistent, and the parts you do not are the parts that drift.',
    },
    {
      kind: 'paragraph',
      text: 'If "list row" is a named piece, every list row in the product changes together. If it is redrawn each time, you get eleven slightly different rows, three of which have the wrong spacing, and nobody can say when that happened.',
    },
    {
      kind: 'paragraph',
      text: 'You already know this from Figma. What this lesson adds is that the same decision gets made again in code, and the two can either agree or quietly diverge.',
    },
  ],
  howItWorks: [
    {
      kind: 'paragraph',
      text: 'A piece is worth separating when it has a job that can be described without mentioning where it sits.',
    },
    {
      kind: 'paragraph',
      text: '"Shows a person\'s name and avatar" is a job. "The thing at the top of the settings page" is a position. The first can be reused; the second cannot, because the description is tied to one location.',
    },
    {
      kind: 'paragraph',
      text: 'The second test is behaviour. A piece that handles its own states — a field that knows how to show its own error — has a clear boundary. A piece whose behaviour is managed entirely from outside is probably just a shape, and shapes are cheaper to repeat than to abstract.',
    },
  ],
  firstPrinciples: [
    {
      kind: 'paragraph',
      text: 'The trap is that visual similarity is extremely easy to see and almost never the right basis for a decision.',
    },
    {
      kind: 'paragraph',
      text: 'Two rectangles with identical padding and a 6px radius look like the same component. If one is a static summary and the other is a pressable row that navigates, they behave differently, change for different reasons, and will drift apart the first time either gets a new requirement. Merging them creates a component with a growing list of options to describe which of the two it currently is.',
    },
    {
      kind: 'callout',
      tone: 'pitfall',
      body: 'Two things that look alike today but change for different reasons are two things. Appearance is the weakest evidence of sameness.',
    },
  ],
  designPerspective: [
    {
      kind: 'paragraph',
      text: 'The design question is which pieces deserve a name, because a named piece is a commitment to keep it consistent.',
    },
    {
      kind: 'paragraph',
      text: 'Name too few and the product drifts. Name too many and you have a library nobody can navigate, where finding the right piece is slower than drawing a new one. The pieces that earn names are the ones that recur and matter.',
    },
  ],
  engineeringPerspective: [
    {
      kind: 'paragraph',
      text: 'The engineering question is where responsibility sits.',
    },
    {
      kind: 'paragraph',
      text: 'A well-drawn boundary means one piece of code owns one job, and you can change it without reading the rest. A badly drawn one means a change to a list row requires understanding the page it lives on. You will do this properly in Module 8; the intuition you build now is what that module formalises.',
    },
  ],
  connectionBetweenBoth: [
    {
      kind: 'paragraph',
      text: 'The same boundary question gets asked twice — once in the design file, once in the code — and the answers should match.',
    },
    {
      kind: 'paragraph',
      text: 'When they do, a change to a component in Figma has an obvious counterpart in code, and conversations are short. When they diverge, every handoff includes a translation step, and the translation is where consistency leaks out.',
    },
  ],
  industryExamples: [
    {
      id: 'example-figma-components',
      source: 'Figma',
      title: 'Components and instances as a working model',
      observation:
        'Figma distinguishes a component from its instances, so a change to the component propagates while each instance keeps its own content.',
      takeaway:
        'This is the same separation code makes: one definition of the piece, many uses of it with different content.',
    },
    {
      id: 'example-polaris-structure',
      source: 'Shopify',
      title: 'A documented hierarchy of parts',
      observation:
        'Polaris organises its library into layout, actions, forms and other groups, and documents what each component is for.',
      takeaway:
        'The grouping is itself a design decision — it tells you the basis on which the team decided two things were different.',
    },
  ],
  practicalWalkthrough: [
    {
      kind: 'paragraph',
      text: 'Break down a typical dashboard.',
    },
    {
      kind: 'list',
      ordered: true,
      items: [
        'Page: the dashboard.',
        'Sections: sidebar navigation, header, a row of summary figures, a chart, a table of recent activity.',
        'Repeated patterns: the navigation item (appears eight times), the summary figure (four times), the table row (many times).',
        'Controls: buttons, a date filter, a search field.',
      ],
    },
    {
      kind: 'paragraph',
      text: 'Now the interesting question. The summary figures and the table cells both show numbers in the same typeface at the same size. Same component?',
    },
    {
      kind: 'paragraph',
      text: 'No. The summary figure is a headline — it exists to be read from across the room, and if the design changed to make it larger, every summary would change and no table cell should. They look alike and answer to different requirements. Two things.',
    },
  ],
  commonMistakes: [
    {
      id: 'mistake-01-05-merge-by-appearance',
      mistake: 'Merging two pieces because they currently look the same.',
      why: 'The first divergent requirement adds an option to tell them apart, and the component slowly becomes a configuration file.',
      instead:
        'Ask whether they would change for the same reason. If not, keep them separate even if that means near-identical code today.',
    },
    {
      id: 'mistake-01-05-component-everything',
      mistake: 'Turning every arrangement of elements into a named component.',
      why: 'A library with hundreds of single-use pieces is harder to search than the thing it replaced, and nobody can tell which piece is canonical.',
      instead:
        'Wait for the second or third use before naming something. Repetition is evidence; prediction usually is not.',
    },
  ],
  professionalConsideration: [
    {
      kind: 'paragraph',
      text: 'The strongest signal that a boundary is wrong is a piece that keeps needing new options.',
    },
    {
      kind: 'paragraph',
      text: 'When a card component acquires a flag for "compact", then "no border", then "clickable", then "with a chart", it is not one component with four options — it is several components that were merged too early. The options are the seam showing. Noticing that early saves a lot of unpicking later.',
    },
  ],
  practicalExercise: {
    id: 'exercise-breaking-an-interface-into-parts',
    title: 'Break down a dashboard',
    prompt:
      'Take a dashboard from a product you use — analytics, a bank, a project tool — and identify its reusable parts.',
    steps: [
      'List the page, then its major sections.',
      'Within the sections, find every pattern that appears more than once. Count the appearances.',
      'For each repeated pattern, write a one-line description of its job that does not mention where it sits.',
      'Find two things that look similar and decide whether they are really the same piece. Write your reasoning.',
      'Identify one piece you would NOT make reusable, and say why.',
    ],
    successCriteria: [
      'Three levels identified: page, sections, controls.',
      'At least three repeated patterns found, with counts.',
      'Every pattern has a position-independent description of its job.',
      'One similar-looking pair examined, with a reasoned verdict.',
      'One deliberate non-component identified and justified.',
    ],
    estimatedMinutes: 30,
    hint: 'If your description of a piece contains the words "at the top" or "on the left", you have described where it is rather than what it does. Try again.',
  },
  reflectionQuestion:
    'Should two visually similar elements always become one component?',
  reflectionHint:
    'Appearance is only one kind of similarity. Think about what would have to happen for the two to need to differ — and how likely that is.',
  resources: [
    {
      id: 'resource-figma-components-guide',
      title: 'Guide to components in Figma',
      url: 'https://help.figma.com/hc/en-us/articles/360038662654-Guide-to-components-in-Figma',
      type: 'documentation',
      author: 'Figma',
      estimatedMinutes: 20,
      note: 'The model you already use, stated explicitly. Worth reading once with the code equivalent in mind.',
    },
    {
      id: 'resource-nng-ui-consistency',
      title: 'Maintain Consistency and Adhere to Standards',
      url: 'https://www.nngroup.com/articles/consistency-and-standards/',
      type: 'article',
      author: 'Nielsen Norman Group',
      estimatedMinutes: 10,
      note: 'Why repeated patterns matter to users, not just to the people maintaining them.',
    },
  ],
  competencyTags: ['design-systems', 'product-thinking', 'critique', 'ux-reasoning'],
  completionCriteria: [
    'Can break any screen into page, sections and controls.',
    'Can describe a repeated pattern by its job rather than its position.',
    'Can argue for keeping two similar-looking elements separate.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Project                                                                     */
/* -------------------------------------------------------------------------- */

const PROJECT: ModuleProject = {
  id: 'project-interactive-settings-panel',
  slug: 'interactive-settings-panel',
  moduleId: MODULE_ID,
  title: 'Interactive Settings Panel',
  brief:
    'Design and build a small settings panel with a name field, an email field, a toggle and a Save button — including what it looks like while saving, after saving, and when saving fails.',
  learnerGoal:
    'Produce your first interface that exists in more than one state, designed deliberately and then built in a browser.',
  problem:
    'Settings panels look trivial and are not. Every one contains an action that leaves the device, can be slow, and can fail — which makes the smallest realistic place to practise designing the moments nobody draws.',
  prerequisiteLessonIds: [
    'lesson-what-makes-an-interface-interactive',
    'lesson-buttons-links-inputs-and-controls',
    'lesson-what-happens-when-a-user-takes-an-action',
    'lesson-feedback-loading-success-and-error',
    'lesson-breaking-an-interface-into-parts',
  ],
  objectives: [
    'Design an interface in four states rather than one.',
    'Choose the correct control for each element and justify it.',
    'Turn a design into working HTML and CSS.',
    'Make every control reachable and operable by keyboard.',
  ],
  requirements: [
    'A name field and an email field, each with a visible label.',
    'A toggle for one notification preference.',
    'A Save button.',
    'Designed frames for all four states: idle, saving, saved, failed.',
    'A built version in HTML and CSS that renders the idle state accurately.',
    'Every control reachable by Tab, in a sensible order, with a visible focus indicator.',
  ],
  constraints: [
    'No JavaScript framework. Plain HTML and CSS only.',
    'JavaScript behaviour is optional — you have not been taught it yet. If you want to see the other states in the browser, it is acceptable to build them as separate static versions.',
    'No component library. Build the controls yourself from real HTML elements.',
    'States must be distinguishable without relying on colour alone.',
  ],
  suggestedScope:
    'One panel, roughly the size of a single settings card. Four designed states and one built page. Perhaps six to ten hours. Stop when the idle state in the browser matches your design and works by keyboard.',
  deliverables: [
    'A Figma file with the four states.',
    'An HTML file and a CSS file that render the panel.',
    'A short written note listing each control and why you chose it.',
    'A note describing what happens on failure and how the user recovers.',
  ],
  completionCriteria: [
    'All four states exist as designs.',
    'The built idle state is a recognisable match for the designed one.',
    'Every control is a real HTML control, not a styled box.',
    'The whole panel can be operated with the keyboard alone.',
    'The failure state offers the user a way forward.',
  ],
  portfolioEvidence: [
    'Interaction reasoning — the written justification for each control.',
    'Interface feedback — four states designed rather than one.',
    'Visual organisation — a panel that holds together at more than one width.',
    'Early design-to-code ability — a build that matches its design.',
  ],
  reflectionQuestion:
    'Which of the four states was hardest to design, and what made it hard?',
  estimatedHours: 8,
  competencies: [
    'product-thinking',
    'interaction-design',
    'html',
    'css',
    'accessibility',
    'design-to-code-translation',
  ],
  stretchGoals: [
    'Add a second toggle and decide whether the two are independent or mutually exclusive.',
    'Design what the panel looks like at 320px wide.',
    'Design the disabled state of Save, and write down exactly what makes it unavailable.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Module                                                                      */
/* -------------------------------------------------------------------------- */

export const MODULE_01: CurriculumModule = {
  id: MODULE_ID,
  slug: 'how-interfaces-work',
  moduleNumber: 1,
  phase: 'foundations',
  title: 'How Interfaces Work',
  description:
    'What separates a design from a product: the loop between what a person does and what the interface says back. Built entirely from things you have already clicked.',
  outcome:
    'Can describe any interface as a set of actions, responses and states, and design the moments that usually go undrawn.',
  prerequisites: [
    'Around a year of product design practice',
    'Comfortable building and using components in Figma',
    'No engineering experience required',
  ],
  lessons: [LESSON_1, LESSON_2, LESSON_3, LESSON_4, LESSON_5],
  resources: [
    {
      id: 'resource-module-01-mdn-learn',
      title: 'Getting started with the web — MDN Learn',
      url: 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started',
      type: 'documentation',
      author: 'MDN',
      estimatedMinutes: 60,
      note: 'The gentlest reliable starting point. Skim it now; you will build from it in Module 3.',
    },
    {
      id: 'resource-module-01-hig-inputs',
      title: 'Inputs — Apple Human Interface Guidelines',
      url: 'https://developer.apple.com/design/human-interface-guidelines/inputs',
      type: 'documentation',
      author: 'Apple',
      estimatedMinutes: 25,
      note: 'How a platform thinks about every route a person can use to act on an interface.',
    },
    {
      id: 'resource-module-01-nng-video',
      title: 'Nielsen Norman Group video library',
      url: 'https://www.nngroup.com/videos/',
      type: 'video',
      author: 'Nielsen Norman Group',
      estimatedMinutes: 30,
      note: 'Short, research-backed videos on feedback, affordance and error handling. Pick two that match this module.',
    },
    {
      id: 'resource-module-01-webaim-keyboard',
      title: 'WebAIM: Keyboard Accessibility',
      url: 'https://webaim.org/techniques/keyboard/',
      type: 'article',
      author: 'WebAIM',
      estimatedMinutes: 15,
      note: 'Keep this open while testing your project with the keyboard.',
    },
  ],
  project: PROJECT,
  competencies: [
    'product-thinking',
    'ux-reasoning',
    'interaction-design',
    'accessibility',
    'html',
    'interface-state-modelling',
    'design-systems',
    'critique',
    'browser-apis',
    'css',
    'design-to-code-translation',
  ],
  completionCriteria: [
    'All five lessons completed.',
    'Module project marked completed.',
    'Can describe an interaction as action, response and acknowledgement without notes.',
    'Can name the four states of an action and design all of them.',
  ],
};
