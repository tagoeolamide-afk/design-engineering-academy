# Curriculum v2 — architecture

Status: **design only.** No lesson content has been rewritten. This document is
the contract the rewrite stages work from.

## Why v2 exists

v1 reaches the right advanced material but opens abstractly — lesson 1 is
"Interfaces Are Stateful Systems", which names a model before the learner has
anything concrete to attach it to. v2 keeps the destination and rebuilds the
on-ramp: every concept travels **concrete → intuition → mechanism →
implementation → system → architecture**.

Scope is unchanged: 5 phases, 15 modules, 5 lessons per module, 75 lessons,
15 module projects.

---

## 1. Structural changes

### Phases are no longer evenly sized

v1 hard-codes `MODULES_PER_PHASE = 3` and derives phase membership
arithmetically. v2 phases are **3, 3, 4, 3, 2**.

| Phase | Title | Modules |
| --- | --- | --- |
| 1 | From Designer to Interface Builder | 1–3 |
| 2 | Behaviour and Logic | 4–6 |
| 3 | Modern Interface Engineering | 7–10 |
| 4 | Real Product Complexity | 11–13 |
| 5 | Advanced Design Engineering | 14–15 |

This is the one invariant v2 genuinely breaks. `moduleNumbersForPhase()` must
stop deriving membership arithmetically and read it from each module's own
`phase` field, and the integrity rule "a phase has exactly 3 modules" must go.

### Identifiers move from positional to semantic

v1 ids encode position: `lesson-09-01` is module 9, lesson 1. v2 reorders
heavily — Design Systems moves from module 9 to module 10, Motion from 10 to 12
— so positional ids would either lie about position or be reassigned to
different content.

Reassignment is the dangerous one. Progress is keyed by lesson id, so a
`lesson-09-01` completed in v1 would silently mark whatever v2 puts at that id
as complete.

**v2 uses content-derived ids**: `lesson-design-tokens`, `lesson-flexbox`,
`module-design-systems`, `project-component-library`. They survive reordering,
which this redesign proves is not a hypothetical risk.

---

## 2. Old → new mapping

`=` survives with light edits · `~` substantially reworked · `+` new · `–` retired

### Phase 1 — From Designer to Interface Builder

| New | Title | From v1 | |
| --- | --- | --- | --- |
| **M1 How Interfaces Work** | | | |
| L1 | What Makes an Interface Interactive? | `lesson-01-01` | ~ reframed concrete-first |
| L2 | Buttons, Links, Inputs and Controls | `lesson-03-02` native-controls | ~ moved much earlier |
| L3 | What Happens When a User Takes an Action? | `lesson-01-02` | ~ |
| L4 | Feedback, Loading, Success and Error | `lesson-11-01` | ~ simplified from module 11 |
| L5 | Breaking an Interface Into Parts | `lesson-01-05` + `lesson-08-01` | ~ |
| P1 | Interactive Settings Panel | `project-01` | ~ scope cut |
| **M2 Visual Foundations** | | | |
| L6 | Visual Hierarchy | `lesson-02-01` | = |
| L7 | Spacing and Rhythm | `lesson-02-02` | = |
| L8 | Typography for Interfaces | `lesson-02-03` | = |
| L9 | Colour, Contrast and Meaning | `lesson-02-04` | = |
| L10 | Responsive Layout Thinking | `lesson-02-05` grids/optical | ~ topic shifts |
| P2 | Responsive SaaS Pricing Page | `project-02` | = |
| **M3 HTML and CSS Foundations** | | | |
| L11 | HTML Gives Structure and Meaning | `lesson-03-01` | = |
| L12 | The CSS Box Model | `lesson-04-01` | = |
| L13 | Building Layouts With Flexbox | `lesson-04-02` | = |
| L14 | Responsive Layouts With Grid | `lesson-04-03` | = |
| L15 | Turning a Figma Design Into a Browser Interface | — | + |
| P3 | Responsive Product Page | `project-04` | ~ |

### Phase 2 — Behaviour and Logic

| New | Title | From v1 | |
| --- | --- | --- | --- |
| **M4 JavaScript for Interface Designers** | | | |
| L16 | JavaScript Without the Intimidation | `lesson-05-01` | ~ |
| L17 | Events, Clicks and User Input | `lesson-05-02` | = |
| L18 | Conditions and Interface Decisions | — | + |
| L19 | Forms and Validation | `lesson-03-05` | ~ |
| L20 | Getting Data and Waiting for Responses | `lesson-05-05` | = |
| P4 | Interactive Signup or Search | `project-05` | ~ |
| **M5 State and Product Behaviour** | | | |
| L21 | What Interface State Means | `lesson-05-03` | ~ |
| L22 | Moving From One State to Another | — | + |
| L23 | Derived State and Avoiding Duplicate Truth | — | + |
| L24 | Optimistic vs Confirmed Actions | `lesson-11-02` | ~ first pass |
| L25 | Mapping Product Behaviour Before Coding | `lesson-01-04` | ~ |
| P5 | Account Settings and Rename Flow | `project-01` | ~ |
| **M6 TypeScript, Git and Engineering Workflow** | | | |
| L26–30 | order unchanged | `lesson-06-01`…`06-05` | = |
| P6 | Productionise a Previous Project | `project-06` | = |

### Phase 3 — Modern Interface Engineering

| New | Title | From v1 | |
| --- | --- | --- | --- |
| **M7 React Foundations** | | | |
| L31 | Why React Exists | `lesson-07-01` | ~ |
| L32–35 | Props · Rendering · State · Effects | `lesson-07-02`…`07-05` | = |
| P7 | Project Management Interface | `project-07` | = |
| **M8 Component Architecture** | | | |
| L36–40 | order unchanged | `lesson-08-01`…`08-05` | = |
| P8 | Reusable Component Library | `project-08` | = |
| **M9 Accessibility for Design Engineers** | | | |
| L41 | Semantic Interfaces | `lesson-03-01` | ~ deeper second pass |
| L42 | Keyboard and Focus | `lesson-03-03` | = |
| L43 | Accessible Forms and Errors | `lesson-03-05` | = |
| L44 | The Accessibility Tree and ARIA | `lesson-03-04` | = |
| L45 | Building Accessible Components | — | + |
| P9 | Accessible Signup and Account | `project-03` | = |
| **M10 Design Systems** | | | |
| L46–50 | order unchanged | `lesson-09-01`…`09-05` | = |
| P10 | Figma + React Mini Design System | `project-09` | = |

### Phase 4 — Real Product Complexity

| New | Title | From v1 | |
| --- | --- | --- | --- |
| **M11 Data and Async Interfaces** | | | |
| L51 | Loading, Empty, Success and Error | `lesson-11-01` | = deeper than L4 |
| L52 | Search, Filters and Sorting | `lesson-11-04` | = |
| L53 | Tables and Dense Information | `lesson-11-03` | = |
| L54 | URL State and Persistence | `lesson-11-05` | = |
| L55 | Optimistic Updates | `lesson-11-02` | = deeper than L24 |
| P11 | Analytics Dashboard | `project-11` | = |
| **M12 Motion and Interaction Quality** | | | |
| L56–60 | order unchanged | `lesson-10-01`…`10-05` | = |
| P12 | Polished Command Menu / File Browser | `project-10` | = |
| **M13 Performance, Testing and Design QA** | | | |
| L61 | How the Browser Renders an Interface | `lesson-12-01` | = |
| L62 | Frontend Performance Fundamentals | `lesson-12-02/03/04` | ~ three condensed into one |
| L63 | Testing Important Product Behaviour | `lesson-13-04` | = |
| L64 | Design QA | `lesson-13-05` | = |
| L65 | Debugging With Browser Tools | `lesson-12-05` | ~ |
| P13 | Performance and Quality Retrofit | `project-12` | = |

### Phase 5 — Advanced Design Engineering

| New | Title | From v1 | |
| --- | --- | --- | --- |
| **M14 Product Architecture and Systems Thinking** | | | |
| L66 | Local, Global, URL and Server State | `lesson-13-01` + `13-02` | ~ merged |
| L67 | Caching and Synchronisation | — | + |
| L68 | Errors, Recovery and Resilience | `lesson-13-03` | = |
| L69 | Thinking About Product Architecture | — | + |
| L70 | Systematic Product Critique | `lesson-14-05` | = |
| P14 | Production SaaS Workflow | `project-13` | = |
| **M15 Advanced Design Engineering and Capstone** | | | |
| L71 | AI as an Implementation Partner | `lesson-15-01` | = |
| L72 | Design-to-Code Workflows | `lesson-15-04` | = |
| L73 | Reviewing Generated Code and Design | `lesson-15-03` | = |
| L74 | Presenting Design Engineering Work | `lesson-15-05` | ~ |
| L75 | Planning and Shipping the Capstone | — | + |
| P15 | Capstone | `project-15` | = |

### Retired from v1

| Retired | Why |
| --- | --- |
| `lesson-01-03` affordance-expectation-and-mental-models | folded into new L1 and L2 |
| `lesson-04-04` intrinsic-and-responsive-layout | folded into new L10 and L14 |
| `lesson-04-05` css-architecture | superseded by design tokens in M10 |
| `lesson-05-04` dom-manipulation | React replaces the technique; no longer earns a lesson |
| `lesson-14-01`…`14-04` polish, visual defects, interaction defects, simplifying | see the open question below |
| `lesson-15-02` giving-agents-system-context | folded into new L71 |
| `project-14` product-workflow-redesign | module 14 now carries `project-13` |

**Open question — the critique module.** v1 module 14 spent five lessons on
taste, finding visual and interaction defects, and simplifying without losing
capability. v2 keeps only *Systematic Product Critique* as L70. For a learner
whose existing strength is design judgement, that material is arguably the
highest-leverage differentiator in the course. Flagged rather than decided: it
can be restored by splitting L70, or by trading one of the new M14 lessons.

### Counts

49 lessons carry over with light edits, 19 are substantially reworked, 7 are
new, 8 retire. 12 of 15 projects survive.

---

## 3. Schema changes required

### `types/curriculum.ts`

| Change | Reason |
| --- | --- |
| Remove `MODULES_PER_PHASE`; `moduleNumbersForPhase()` reads each module's `phase` | phases are 3/3/4/3/2 |
| `Lesson.priorKnowledge: Prose` **(new)** | format §2 "What you already know" |
| `Lesson.whyDesignersCare: Prose` **(new)** | format §4 |
| `Lesson.howItWorks: Prose` **(new)** | format §5 — the mechanism step, currently conflated with `firstPrinciples` |
| `Lesson.goDeeper?: Prose` **(new, optional)** | optional depth that must not block a beginner |
| `eliteConsiderations` → `professionalConsideration` | same slot, beginner-appropriate framing |
| `ModuleProject.learnerGoal: string` **(new)** | project spec |
| `ModuleProject.prerequisites: readonly string[]` **(new)** | "do not require skills not yet studied" |
| `ModuleProject.stretchGoals` optional → required | project spec |

`LESSONS_PER_MODULE = 5`, `TOTAL_MODULES = 15` and `TOTAL_LESSONS = 75` all
stand. `commonMistakes` keeps its shape and is reframed as *beginner* mistakes.

Unchanged: `recap`, `coreConcept`, `designPerspective`, `engineeringPerspective`,
`connectionBetweenBoth`, `industryExamples`, `practicalWalkthrough`,
`practicalExercise`, `reflectionQuestion`, `reflectionHint`, `resources`,
`competencyTags`, `completionCriteria`, `objectives`, `prerequisiteLessonIds`.

### `lib/curriculum/integrity.ts`

- Drop the "exactly 3 modules per phase" rule.
- Add: each module carries at least 2 reading/documentation resources, 1 video
  or talk, and 1 practical/reference resource.
- Add: every `prerequisiteLessonIds` entry points backwards in **v2** order.
- Add: a project's `prerequisites` never name a lesson later than its own module.
- Add: the new required lesson fields are non-empty.

### Files touched

`types/curriculum.ts` · `lib/curriculum/integrity.ts` ·
`components/curriculum/phase-section.tsx` · `content/phases.ts` ·
all 15 `content/modules/*` · `content/connections.ts` (49 lesson references) ·
`content/resources.ts` (56 lesson, 15 module references) ·
`components/lesson/sections.ts` and the lesson page, for the new sections.

**Untouched:** every Supabase file, the proxy, auth, the sync engine, the
repository, RLS and the stores.

---

## 4. Progress migration

### Recommendation: version the curriculum, and do not carry completion

Add `curriculumVersion: 2` to the learning-state payload, raising
`LEARNING_STATE_SCHEMA_VERSION` to 2.

**Completion does not transfer.** All 75 lessons are rebuilt to the new
16-section format with a concrete-first opening, and 26 change topic or depth
outright. Carrying a completion flag would assert the learner finished material
they have never seen — exactly the claim this product refuses to make
everywhere else. Statuses are derived from recorded facts, and "read this
lesson" stops being a fact about the new lesson.

**The learner's own writing does transfer.** Reflections, exercise notes and
notes are the learner's words, not the curriculum's:

- `=` and `~` lessons — remap to the new id, keep the text, clear the
  completion timestamps.
- Retired lessons — keep the note, re-scope it to the module, label it as
  written against the previous curriculum. Never delete it.

**Project records transfer** where the project survives (12 of 15), including
status, links and reflections. Project work is a real artefact the learner
built; it did not stop existing.

**Resource marks transfer unchanged** — they key off the library, not the
curriculum.

### Timing

Do this before accumulating real progress. The cost today is close to zero, and
every lesson completed between now and the rewrite is progress that will be
reset.

### Mechanism

A pure `migrateLearningState(v1) → v2` in `lib/persistence/migrations.ts`,
driven by an explicit `CURRICULUM_V1_TO_V2` id map in
`lib/curriculum/migration.ts`, unit-tested against a fixture of real v1 state.
The existing versioned-envelope machinery already handles "read old, write new"
safely in both localStorage and Supabase, so nothing new is needed to carry it.

---

## 5. Resource strategy

Difficulty tracks the curriculum rather than sitting flat.

| Phase | Character | Typical sources |
| --- | --- | --- |
| 1–2 | visual, short, interactive | MDN Learn, web.dev Learn, Figma docs, Refactoring UI |
| 3 | reference-grade documentation | React docs, TypeScript Handbook, WAI-ARIA Authoring Practices, Inclusive Components, Polaris / Material / Apple HIG |
| 4 | measurement and craft talks | Chrome for Developers, web.dev performance, conference talks |
| 5 | specifications, architecture, source | WHATWG and W3C specs, architecture writing, real repositories |

Per-module minimum, enforced by the integrity check: **2 reading/documentation,
1 video or talk, 1 practical/reference**.

The existing 75-entry library is reusable as-is: it already carries
`difficulty`, `type`, `official` and related-module links. Migration is a
re-tagging job — `relatedModules` and `relatedLessons` move to v2 ids — plus
filling gaps where the early modules need gentler entries than v1 required.
**No URL is invented.** Where a v1 URL is valid and still relevant it is reused
unchanged.

Module-level `Resource` gains an optional `difficulty` so the per-module mix can
be checked mechanically.

---

## 6. Project progression

| Band | Modules | What the learner supplies |
| --- | --- | --- |
| Guided | 1–3 | follows a specified build; decisions are made for them |
| Semi-guided | 4–6 | chooses implementation, requirements fixed |
| Independent | 7–10 | designs the component and state model |
| Judgement | 11–13 | makes tradeoffs and defends them |
| Architectural | 14–15 | owns the architecture and the quality bar |

Every project states: problem · learner goal · prerequisites · requirements ·
constraints · suggested scope · deliverables · completion criteria · portfolio
evidence · stretch goals.

`prerequisites` is the load-bearing new field. It names the lessons a project
depends on, and the integrity check verifies none of them sit later than the
project's own module — which is what mechanically enforces "do not require
advanced skills before the learner has studied them".

---

## 7. What does not change

- **Frontend** — no screen redesigned, no component replaced, no route changed.
  Lesson pages gain sections, rendered through the existing `sections.ts`
  mechanism.
- **Auth** — unchanged.
- **Supabase** — same single `user_learning_state` table, same RLS policies,
  same repository, same conflict guard. The JSON payload gains one field.
- **Sync** — unchanged; the engine is curriculum-agnostic.
- **Derivation** — unchanged. Statuses, competency evidence and activity are
  still computed from recorded facts, and nothing derived is stored.

The curriculum is data. v2 rewrites the data and the schema describing it, and
leaves the machinery that reads it in place.

---

## 8. Build log — Modules 6–10

Modules 1–5 were rewritten first; this section records the second content
stage, because it changed the registry rather than only the lesson text.

### Files

| Module | File | Status |
| --- | --- | --- |
| M6 TypeScript, Git and Workflow | `module-06-typescript-git-and-workflow.ts` | replaced `module-06-typescript-git-and-engineering-workflow.ts` |
| M7 React Foundations | `module-07-react-foundations.ts` | rewritten in place |
| M8 Component Architecture | `module-08-component-architecture.ts` | rewritten in place |
| M9 Accessibility for Design Engineers | `module-09-accessibility-for-design-engineers.ts` | new; replaced `module-09-design-systems.ts` |
| M10 Design Systems | `module-10-design-systems.ts` | new; carries the former M9 subject |
| — Motion and Interaction Quality | `pending/module-motion-and-interaction-quality.ts` | parked |

### The parked module

v2 places Motion and Interaction Quality at module 12, but modules 11–15 are
still the v1 set and occupy 11, 12 and 13. Design Systems needed slot 10, which
Motion held, so the Motion file was moved to `content/modules/pending/` and
removed from the registry rather than overwritten.

Nothing was lost. The registry still holds fifteen modules and seventy-five
lessons, and the integrity report is clean: 0 errors, 0 warnings, 0 info.

Three consequences to undo when modules 11–15 are rewritten:

1. Re-register the file as module 12 and renumber the modules after it.
2. The `apple-hig-motion` and `material-motion` library resources were detagged
   (`relatedModuleIds: []`); point them back at the motion module.
3. `content/connections.ts` lost the `motion` step from the interaction chain,
   and the `animation-choices` step in the performance chain now points at
   `lesson-12-02` rather than a motion lesson. Both should be restored.

### Positional ids retired in this stage

Modules 11–15, `connections.ts` and `resources.ts` referenced the old ids; 62
references were renamed and 14 motion references removed.

| v1 | v2 |
| --- | --- |
| `lesson-06-01` … `06-05` | `lesson-types-as-helpful-contracts`, `lesson-objects-unions-and-safer-interface-states`, `lesson-understanding-git`, `lesson-branches-commits-and-pull-requests`, `lesson-packages-environment-variables-and-project-setup` |
| `lesson-07-01` … `07-05` | `lesson-why-react-exists`, `lesson-components-and-props`, `lesson-rendering-lists-and-conditional-ui`, `lesson-state-in-react`, `lesson-events-effects-and-synchronisation` |
| `lesson-08-01` … `08-05` | `lesson-choosing-component-boundaries`, `lesson-designing-component-apis`, `lesson-variants-without-complexity`, `lesson-composition`, `lesson-where-state-should-live` |
| `lesson-09-01` … `09-05` | `lesson-design-tokens`, `lesson-system-foundations`, `lesson-components-across-figma-and-code`, `lesson-patterns-and-product-workflows`, `lesson-governance-and-maintaining-a-system` |
| `lesson-10-01` … `10-05` | parked; no v2 id yet |

Module 9's lessons are new ids with no v1 predecessor, since its material was
previously spread across module 3.

### Progress keyed to retired ids

Any progress recorded against a retired id is ignored rather than migrated, as
section 4 specifies: `deriveActivity` iterates curriculum lessons and skips
records it cannot match. A lesson completed as `lesson-08-01` therefore shows as
incomplete under its new id, and no unrelated lesson is wrongly marked done.

---

## 9. Complete — Modules 11–15

Curriculum v2 is fully authored. Fifteen modules, seventy-five lessons, fifteen
projects, all on semantic identifiers, integrity clean.

### Final structure

| Phase | Title | Modules |
| --- | --- | --- |
| 1 | From Designer to Interface Builder | 1 How Interfaces Work · 2 Visual Foundations · 3 HTML and CSS Foundations |
| 2 | Behaviour and Logic | 4 JavaScript for Interface Designers · 5 State and Product Behaviour · 6 TypeScript, Git and Workflow |
| 3 | Modern Interface Engineering | 7 React Foundations · 8 Component Architecture · 9 Accessibility for Design Engineers · 10 Design Systems |
| 4 | Real Product Complexity | 11 Data and Async Interfaces · 12 Motion and Interaction Quality · 13 Performance, Testing and Design QA |
| 5 | Advanced Design Engineering | 14 Product Architecture and Systems Thinking · 15 Advanced Design Engineering and Capstone |

### The parked module is no longer parked

Section 8 recorded Motion and Interaction Quality as parked in
`content/modules/pending/`. It has been rewritten as module 12 and the folder
is gone. The three things section 8 said to undo were all undone:

- Registered as module 12; `content/modules/pending/` removed.
- `apple-hig-motion` and `material-motion` remain detagged
  (`relatedModuleIds: []`). **Still outstanding** — they could now point at
  `module-12`, and the motion lessons.
- `content/connections.ts` still lacks the `motion` step in the interaction
  chain, and `animation-choices` in the performance chain still points at the
  performance lesson rather than a motion lesson. **Still outstanding** —
  both could now be restored against the new module 12 lesson ids.

Neither blocks anything; both are soft reference lists, and the test suite and
integrity check pass without them.

### Positional ids retired in this stage

44 references remapped across `connections.ts` and `resources.ts`, plus 7 for
module 11 in its own earlier swap.

| v1 | v2 |
| --- | --- |
| `lesson-11-01` … `11-05` | `lesson-loading-empty-success-and-error-states`, `lesson-optimistic-updates`, `lesson-tables-and-dense-information`, `lesson-search-filters-and-sorting`, `lesson-url-state-and-persistence` |
| `lesson-12-01`, `12-02` | `lesson-how-the-browser-renders-an-interface` (merged) |
| `lesson-12-03`, `12-04` | `lesson-frontend-performance-fundamentals` (merged) |
| `lesson-12-05` | `lesson-debugging-with-browser-tools` |
| `lesson-13-01`, `13-02` | `lesson-local-global-url-and-server-state` (merged) |
| `lesson-13-03` | `lesson-errors-recovery-and-resilience` |
| `lesson-13-04` | `lesson-testing-important-product-behaviour` |
| `lesson-13-05` | `lesson-design-qa` |
| `lesson-14-01`, `14-04`, `14-05` | `lesson-systematic-product-critique` |
| `lesson-14-02`, `14-03` | `lesson-design-qa` |
| `lesson-15-01`, `15-02` | `lesson-ai-as-an-implementation-partner` (merged) |
| `lesson-15-03` | `lesson-reviewing-generated-code-and-design` |
| `lesson-15-04` | `lesson-design-to-code-workflows` |
| `lesson-15-05` | `lesson-presenting-design-engineering-work` |
| `project-11` … `project-15` | `project-analytics-dashboard`, `project-performance-and-quality-retrofit`, `project-production-saas-workflow`, `project-capstone` (note: four, not five) |

`project-14` is retired; module 14 now carries the former `project-13`
(Production SaaS Workflow), as section 2 specified.

### One modelling decision worth recording

The capstone was initially tagged with all 33 competencies, which failed a real
invariant: a project cannot demonstrate a competency its module does not teach.
Tagging it with `visual-hierarchy` would have credited that axis through module
15, which does not teach it.

The capstone's `competencies` are now the subset module 15 teaches and the
capstone genuinely proves — thirteen axes. Its `requirements` and
`completionCriteria` still demand the whole course; the narrower tagging only
changes which skill axes are credited through this module, and the earlier
modules already credit the rest.

### Progress keyed to retired ids

Unchanged from section 8: progress recorded against a retired id is ignored
rather than migrated. Any progress from before the v2 rewrite is effectively
reset.

### Two dead links found and fixed

All 57 URLs across modules 11–15 were checked with a request, not by eye. Two
failed:

- `https://www.youtube.com/@ReactConf` — 404. A handle I had assumed rather
  than verified, used in modules 7, 8, 11 and 14. Replaced with
  `https://www.youtube.com/@reactjs`, and the title changed to match.
- `https://www.nngroup.com/articles/ux-portfolio/` — 404. Inherited from the
  v1 module 15 file, so it had been in the repository through several stages.
  Replaced with `https://www.nngroup.com/articles/ux-design-portfolios/`.

Worth repeating for later stages: checking a URL costs a second and assuming
one costs a learner a dead link.

---

## 10. Quality audit

A full audit across structure, progression, connections, exercises, projects,
resources, examples, length, competencies, migration and navigation. Every
finding below came from a probe over the real content rather than from reading.

### Passed with no changes needed

| Check | Result |
| --- | --- |
| Structure | 15 modules, 75 lessons, 15 projects, exactly 5 lessons each |
| Lesson elements | all 19 present on all 75 lessons; 0 missing |
| Exercises | 0 vague prompts, 0 thin exercises; all have ≥3 steps, ≥3 criteria, a hint and a scope |
| Projects | all 15 carry all 8 required parts, and all 15 take their own module's 5 lessons as prerequisites |
| Competencies | all 33 axes have lesson coverage and project coverage; no fake percentages anywhere |
| Prerequisites | integrity 0 errors — every declared prerequisite resolves and points backwards |
| References | 0 broken chain, resource, module, lesson or project references |

### Fixed

**Resource module tags — 41 of 75 were wrong.** `relatedModuleIds` still pointed
at v1 module *numbers*, whose meaning changed: v1 M3 was HTML/accessibility, M4
was CSS, M5 was JavaScript, M9 was Design Systems, M12 was Performance. So the
Figma guide sat under Accessibility and web.dev sat under Motion. Fixed by
deriving each resource's module tags from its lesson tags, which were already
remapped semantically.

**Two more dead links.** 211 unique URLs checked with a request:
`css-tricks.com/snippets/a-guide-to-grid/` and an MDN Learn scripting path, both
404. Replaced and re-verified. Course-wide, 211/211 now resolve.

**Ten prestige attributions.** Examples where the observation had been hedged to
"products commonly…" but still carried a company name. A generic observation
with a company attached is prestige, not evidence, so those now read `Common
practice` or `Platform convention`. One Module 1 example that genuinely names
Raycast observably kept its attribution.

**Lesson length.** Modules 11–15 ran 11–13 minutes and 7,000–9,300 characters
against 8–10 minutes elsewhere. The trailing caveats of each walkthrough — the
most advanced, least necessary part — moved into `goDeeper` across 25 lessons,
with a second pass on the three longest. All 75 lessons are now 8–10 minutes and
main reads are 4,200–8,000 characters (median 5,500). 26 lessons have a
`goDeeper` section; nothing was deleted.

**One oversized early exercise.** Module 3 lesson 15 asked for a whole screen at
120 minutes, in a module averaging 65. Narrowed to one section at 75 minutes —
the full page is the module project.

**Module 2's title** was "Visual Foundations for Building Interfaces" against the
v2 name "Visual Foundations".

**"Accessibility tree" was used in M9 lesson 41**, three lessons before lesson 44
defines it. Now glossed in place with a forward pointer.

### The Connections section was rebuilt

Five chains replacing the previous five, matching the five threads the
curriculum is built around: Interaction, Layout, Components, State, Quality —
34 steps in total. Four run strictly forwards through the course. Quality
deliberately does not: its order is conceptual dependency, and module 13 teaches
rendering cost before design QA for reasons recorded in the file.

This also restored the motion references stripped in section 8, in the
Interaction chain's feedback step.

### Difficulty progression, measured

Exercise minutes by module average: 30, 42, 65, 56, 46, 52, 62, 68, 70, 71, 95,
79, 94, 100, 92. Project hours: 8, 10, 16, 20, 25, 15, 25, 40, 30, 45, 35, 35,
30, 50, 120. Both rise overall. The dips at modules 6 and 13 are the two
retrofit projects, which are deliberately shorter to build and harder to judge.

A vocabulary probe checked 25 technical terms against the lesson meant to
introduce each. Ten had earlier uses; every one turned out to be a deliberate
forward signpost ("you will build this in Module 3 with Flexbox and Grid"), an
explanation in place (ARIA attributes are glossed where first used in Module 4),
or a false positive. No concept is assumed without introduction.

### Curriculum version migration

`CURRICULUM_VERSION = 2` in `lib/curriculum/version.ts`. `ProgressState` gained
`curriculumVersion` and `legacy`.

The honest position: no v2 lesson or project id equals a v1 one, so there is no
pair whose learning objective is "the same lesson, renamed". Completion resets;
it is not remapped. Records are archived rather than deleted, with their
reflections, exercise notes and project links intact.

The subtler case is notes. Module ids did **not** change, so a note scoped to
`module-09` still resolves — to Accessibility, when it was written about Design
Systems. Those notes are unpinned to free scope, keeping title and body, with a
line recording what they used to point at.

`components/curriculum/curriculum-upgrade-notice.tsx` shows "Your curriculum has
been upgraded." with **Start revised curriculum** and **Review migrated
progress**, as a quiet strip rather than a modal. It appears only when there is
something real to say, and `tests/curriculum-migration.test.ts` covers it with
20 tests — mutation-tested by breaking the archive and the module-reassignment
detection, which failed 3 and 2 tests respectively.

No Supabase change was needed: the payload is JSONB and the new fields are read
by the existing tolerant normaliser.

### Known limitations

- The `goDeeper` extraction moved the *trailing* blocks of each walkthrough.
  That is the right material in every case I checked, but it was applied by
  table rather than re-reading all 25 lessons end to end.
- Project hours are an estimate of scope, not a measurement. The progression is
  defensible but the absolute numbers are guesses.
- Chain membership is authored. A lesson can teach a chain concept without being
  listed in it, and nothing detects that.
- The migration notice is dismissed in component state, so it reappears on
  reload until one of its buttons is pressed. That is deliberate — it should not
  be dismissable by accident — but it is not a persisted dismissal.
