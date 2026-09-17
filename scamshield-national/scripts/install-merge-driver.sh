#!/bin/sh
# Register the seed-data merge driver for this clone.
#
# .gitattributes marks the shard files `merge=scamseed`, but git only knows
# what that means once the driver is configured, and merge drivers are
# per-clone config by design (a repo cannot make your git run a command
# without you asking). Run this once per clone.
set -e
root=$(git rev-parse --show-toplevel)
git -C "$root" config merge.scamseed.name "ScamShield seed-data shard merge"
git -C "$root" config merge.scamseed.driver \
  "node scamshield-national/scripts/merge-seed-shard.js %O %A %B %P"
echo "Registered the scamseed merge driver for $root"
