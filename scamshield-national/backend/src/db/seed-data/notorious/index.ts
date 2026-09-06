// Sharded by slug initial so no single file approaches the context window,
// and so each entry has one deterministic home that does not change as the
// collection grows. To add an entry, edit the shard its slug falls in.
import { SeedArticle } from '../types';
import { NotoriousAF } from './a-f';
import { NotoriousGM } from './g-m';
import { NotoriousNS } from './n-s';
import { NotoriousTZ } from './t-z';

export const NOTORIOUS_ARTICLES: SeedArticle[] = [
  ...NotoriousAF,
  ...NotoriousGM,
  ...NotoriousNS,
  ...NotoriousTZ,
];
