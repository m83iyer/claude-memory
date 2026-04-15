# {{PROJECT_NAME}} — Claude Code Project

## Session Start Protocol

On the FIRST message of every session, before anything else:

1. Read the project memory file:
   `{{ICLOUD_PATH}}/Claude/claude-memory/projects/{{PROJECT_SLUG}}.md`
   Use `offset: 0, limit: 80` (Current State only).

2. Greet with:
   > **{{PROJECT_NAME}} — session loaded.**
   > Last session ([date]): [1-line summary]
   > Next up: [top 2-3 next actions]
   > Open threads: [unresolved items]
   > What do you want to work on?

3. If the first message already contains a task, greet first, then act on it.

## Session End (/wrap)

1. Update `claude-memory/projects/{{PROJECT_SLUG}}.md` — new session entry at top of History, update Current State if anything changed.
2. Prepend one-liner to `CHANGELOG.md` in this folder: `## YYYY-MM-DD — <headline>`
3. Update `claude-memory/_index.md` — Last Touched date for this project.
