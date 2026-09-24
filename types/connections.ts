/**
 * Concept chains.
 *
 * The curriculum is taught in fifteen modules, which is a teaching order rather
 * than a description of how the subject fits together. A chain traces one idea
 * as it reappears at each level — interface state becoming JavaScript state
 * becoming application architecture — so the learner can see that the modules
 * are views onto one discipline rather than fifteen separate topics.
 *
 * Deliberately a sequence, not a graph. A node-and-edge diagram of seventy-five
 * lessons would be impressive and unreadable; a short ordered chain can actually
 * be followed, and each step can say what it adds.
 *
 * Every chain is authored. Nothing here is generated at runtime — the links and
 * the reasoning are written down and reviewed like any other curriculum content.
 */

export interface ConceptLink {
  readonly id: string;
  /** The concept at this step, as the learner would name it. */
  readonly label: string;
  /** What this step makes possible that the previous one could not. */
  readonly contribution: string;
  /** Lessons that teach it. Validated to resolve against the curriculum. */
  readonly lessonIds: readonly string[];
}

export interface ConceptChain {
  readonly id: string;
  /** Short, uppercase in the interface: STATE, SYSTEMS, INTERACTION. */
  readonly title: string;
  /** One line naming the thread being followed. */
  readonly subtitle: string;
  /**
   * The answer to "why are these ideas connected?".
   *
   * Names the actual mechanism rather than asserting that everything relates to
   * everything — the claim has to be falsifiable to be worth reading.
   */
  readonly whyConnected: string;
  readonly links: readonly ConceptLink[];
}
