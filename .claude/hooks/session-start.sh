#!/bin/bash
# Gives a brand-new remote session a summary of ScamShield National's history
# on startup. Each Claude Code on the web session runs in its own throwaway
# container with no memory of earlier sessions, so there is no transcript to
# read from here — the durable record of "everything that's happened" is the
# git history in this repo, which is what this script reconstructs from.
set -euo pipefail

# Local/desktop sessions keep their own working-directory continuity across
# runs and don't have the amnesia problem this exists to solve — only worth
# the startup cost on the web, where every session starts from zero.
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

REPO_ROOT="${CLAUDE_PROJECT_DIR:-$(pwd)}"
cd "$REPO_ROOT" 2>/dev/null || exit 0

PROJECT_DIR="scamshield-national"
if [ ! -d "$PROJECT_DIR" ]; then
  exit 0
fi

git fetch origin --quiet 2>/dev/null || true

# Remote sessions often check out a shallow clone (see create_session's
# clone_depth) — commit volume on this project is high enough that 90 days
# of history can easily exceed a shallow depth, which would silently
# truncate the summary instead of erroring. Deepen it first.
if [ -f "$(git rev-parse --git-dir 2>/dev/null)/shallow" ]; then
  git fetch --unshallow origin --quiet 2>/dev/null || git fetch --depth=2000 origin --quiet 2>/dev/null || true
fi

# --all, not just HEAD: this project's work happens across many short-lived
# claude/* branches before merging into the long-running phase1 integration
# branch, so history on the current branch alone misses most of it.
# Deduplicated by date+message (awk) since the same commit can legitimately
# appear on more than one still-open branch before it merges. git log is
# already newest-first; head keeps the most recent 150 rather than the
# oldest, which tail would.
#
# `set +o pipefail` inside this subshell only: head closing the pipe early
# sends SIGPIPE back up to awk/git log, which is not a real failure here —
# under the script's own pipefail (needed elsewhere) that would abort the
# whole command substitution via set -e and silently produce no summary.
LOG=$(
  set +o pipefail
  git log --all --since="90 days ago" --date=short --pretty=format:'%ad  %s' -- "$PROJECT_DIR" 2>/dev/null \
    | awk '!seen[$0]++' | head -n 150
)

if [ -z "$LOG" ]; then
  exit 0
fi

COMMIT_COUNT=$(echo "$LOG" | wc -l | tr -d ' ')

cat <<EOF
## ScamShield National — recent session history

This session starts with no memory of earlier ones (each remote session is a
fresh container), so here is the durable record instead: the $COMMIT_COUNT
most recent commits touching $PROJECT_DIR/ across every branch in the last
90 days, newest first, deduplicated by date+message. This is reconstructed
from git history, not chat transcripts, so it reflects what actually landed
rather than what was discussed.

$LOG
EOF
