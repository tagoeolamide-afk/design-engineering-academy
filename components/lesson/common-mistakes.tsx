import type { CommonMistake } from '@/types/curriculum';

/**
 * Common mistakes as a comparison table.
 *
 * Each mistake is three parallel facts — what goes wrong, why it happens, what
 * to do instead — and the value is in reading across them. Prose would hide
 * that structure; a table makes it scannable.
 *
 * On narrow viewports the same data is rendered as labelled stacks, because a
 * three-column table at phone width is unreadable.
 */
export function CommonMistakes({ mistakes }: { mistakes: readonly CommonMistake[] }) {
  if (mistakes.length === 0) return null;

  return (
    <>
      {/* Wide: a real table. */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-border">
              <th scope="col" className="py-2 pr-4 text-caption uppercase text-text-muted">
                The mistake
              </th>
              <th scope="col" className="py-2 pr-4 text-caption uppercase text-text-muted">
                Why it happens
              </th>
              <th scope="col" className="py-2 text-caption uppercase text-text-muted">
                Do this instead
              </th>
            </tr>
          </thead>
          <tbody>
            {mistakes.map((mistake) => (
              <tr key={mistake.id} className="border-b border-border align-top">
                <th
                  scope="row"
                  className="w-[28%] py-3 pr-4 text-small font-medium text-text-primary"
                >
                  {mistake.mistake}
                </th>
                <td className="w-[36%] py-3 pr-4 text-small text-text-muted">
                  {mistake.why}
                </td>
                <td className="py-3 text-small text-text-secondary">{mistake.instead}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Narrow: the same three facts, stacked and labelled. */}
      <ul className="space-y-5 md:hidden">
        {mistakes.map((mistake) => (
          <li key={mistake.id} className="border-b border-border pb-5">
            <p className="text-small font-medium text-text-primary">{mistake.mistake}</p>
            <p className="mt-2 text-caption uppercase text-text-muted">Why it happens</p>
            <p className="mt-1 text-small text-text-muted">{mistake.why}</p>
            <p className="mt-2 text-caption uppercase text-text-muted">Do this instead</p>
            <p className="mt-1 text-small text-text-secondary">{mistake.instead}</p>
          </li>
        ))}
      </ul>
    </>
  );
}
