/**
 * Link validation.
 *
 * Deliberately shallow: the only question is whether a string is a usable
 * http(s) address. Whether the page exists, who owns it, or what is on it is
 * none of this application's business — these are the learner's own links to
 * their own work.
 */
export function isValidHttpUrl(value: string): boolean {
  const trimmed = value.trim();
  if (trimmed === '') return false;

  try {
    const url = new URL(trimmed);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

/** Empty means "no link", which is always acceptable. */
export function isAcceptableLink(value: string): boolean {
  return value.trim() === '' || isValidHttpUrl(value);
}
