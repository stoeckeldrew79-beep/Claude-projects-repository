# Claude Projects Repository

A home for several independent projects. Each lives in its own folder with
its own dependencies and build — they do not share code and nothing here is
built at the repo root.

| Folder | Project |
| --- | --- |
| [`scamshield-national/`](scamshield-national/) | ScamShield National — national scam intelligence database and subscription platform (Postgres + backend/frontend/admin). |
| [`pipertown-studios/`](pipertown-studios/) | Pipertown Studios — marketing website for an Orlando, FL design & AI automation studio (Next.js, TypeScript, Tailwind). |

Shared at the root: `.mcp.json` (MCP servers available to every project) and
[`docs/`](docs/) (repo-level tooling notes).

## Working on a project

Install and run inside the project folder, never at the root:

```bash
cd scamshield-national && npm install && npm run dev
```

```bash
cd pipertown-studios && npm install && npm run dev
```

## Getting the latest changes

Everything lands on `main`, so this is all it takes:

```bash
git checkout main
git pull origin main
```

If `git pull` reports "Already up to date" but you expected new work, the
work is probably sitting in an unmerged pull request. Check
[open pull requests](../../pulls) and merge it — code on a branch never
reaches `main` on its own.
