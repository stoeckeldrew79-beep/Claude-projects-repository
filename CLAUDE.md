# Repository guide

This repo holds several **independent** projects. They share no code and
there is no root build.

```
scamshield-national/   ScamShield National — scam intelligence platform
pipertown-studios/     Pipertown Studios — marketing website (Next.js)
docs/                  repo-level tooling notes
.mcp.json              MCP servers available to every project
package.json           repo tooling only — never add project deps here
```

## Rules for working here

- **Every project gets its own top-level folder**, with its own
  `package.json`, lockfile, `.gitignore`, and README. Never place a
  project's files at the repo root — the root is shared config only.
- **Never run `npm install` or a build at the root.** `cd` into the
  project folder first.
- ScamShield National and Pipertown Studios are unrelated. Do not import
  across them, share components between them, or couple their configs.

## Finishing a session

Work happens on a branch, so `main` does not update on its own. When a
change is done: push the branch, open a pull request, and **tell the user
plainly that the PR must be merged before `git pull` on `main` will show
the work**. An unmerged PR is unfinished work, not delivered work.
