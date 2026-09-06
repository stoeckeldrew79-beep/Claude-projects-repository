// Sharded by slug initial so no single file approaches the context window,
// and so each entry has one deterministic home that does not change as the
// collection grows. To add an entry, edit the shard its slug falls in.
//
// recent.ts is an exception: it holds a couple of entries added when the
// authoring environment's local disk was full and the normal a-f/g-m
// shards couldn't be safely rewritten in full. Fold its entries into the
// matching lettered shard whenever convenient.
import { SeedArticle } from '../types';
import { GuidesAF } from './a-f';
import { GuidesGM } from './g-m';
import { GuidesNS } from './n-s';
import { GuidesTZ } from './t-z';
import { GuidesRecent } from './recent';

export const GUIDE_ARTICLES: SeedArticle[] = [
  ...GuidesAF,
  ...GuidesGM,
  ...GuidesNS,
  ...GuidesTZ,
  ...GuidesRecent,
];
