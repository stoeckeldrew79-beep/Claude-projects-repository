// Victim-targeting labels. Stored as slugs so the content routines can set
// them mechanically; shown to readers as plain English.
const LABELS: Record<string, string> = {
  'elder-targeted': 'Targets older adults',
  'veteran-targeted': 'Targets veterans',
  'child-teen-targeted': 'Targets children & teens',
  'small-business-targeted': 'Targets small businesses',
  'student-targeted': 'Targets students',
  'immigrant-targeted': 'Targets immigrants',
};

export function tagLabel(tag: string): string {
  return LABELS[tag] ?? tag.replace(/-targeted$/, '').replace(/-/g, ' ');
}

// The short form used on cards, where space is tight.
export function tagShortLabel(tag: string): string {
  return tagLabel(tag).replace(/^Targets /, '');
}
