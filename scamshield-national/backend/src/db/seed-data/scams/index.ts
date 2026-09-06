// scams.ts reached 2.5MB — large enough that adding one field per entry
// pushed the TypeScript checker past its union-complexity limit (TS2590),
// and it grows about 250KB a day. Entries are sharded so no single file
// approaches that ceiling again.
//
// International entries sit together; US entries shard by the first letter
// of their slug, so an entry's home is deterministic and never changes as
// the corpus grows. To add an entry, edit the shard its slug falls in.
import { SeedScam } from '../types';
import { International } from './international';
import { UsAF } from './us-a-f';
import { UsGM } from './us-g-m';
import { UsNS } from './us-n-s';
import { UsTZ } from './us-t-z';

export const SEED_SCAMS: SeedScam[] = [
  ...International,
  ...UsAF,
  ...UsGM,
  ...UsNS,
  ...UsTZ,
];
