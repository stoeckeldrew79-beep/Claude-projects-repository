// Sharded by slug initial so no single file approaches the context window,
// and so each entry has one deterministic home that does not change as the
// collection grows. To add an entry, edit the shard its slug falls in.
import { SeedArticle } from '../types';
import { GuidesAF } from './a-f';
import { GuidesGM } from './g-m';
import { GuidesNS } from './n-s';
import { GuidesTZ } from './t-z';

export const GUIDE_ARTICLES: SeedArticle[] = [
  ...GuidesAF,
  ...GuidesGM,
  ...GuidesNS,
  ...GuidesTZ,
];
