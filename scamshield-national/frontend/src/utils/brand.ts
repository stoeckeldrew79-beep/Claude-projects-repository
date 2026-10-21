// The site's name, in one place. Stored content predates the rename to
// ScamTitan International, so bylines are mapped at display time rather
// than rewriting thousands of seeded articles (and the routines that keep
// adding more with the old byline).
export const BRAND = 'ScamTitan';
export const BRAND_FULL = 'ScamTitan International';

export function displayAuthor(author: string): string {
  return author.replace(/^ScamShield(?: National)?\b/, BRAND);
}
