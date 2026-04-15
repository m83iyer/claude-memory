# Claude Code — Global Instructions

## Session Start Protocol

On the FIRST message of every session, before anything else:

1. Read the memory index:
   `{{ICLOUD_PATH}}/Claude/claude-memory/_index.md`

2. Greet with:
   - Top 3 active projects (name, priority, last touched)
   - Any pending decisions or deadlines
   - "What do you want to work on?"

3. When a project is named, read its memory file:
   `{{ICLOUD_PATH}}/Claude/claude-memory/projects/<project>.md`
   Use `offset: 0, limit: 80` to read Current State only.

## Session End — /wrap

When the session ends or /wrap is called:
1. Update `claude-memory/projects/<project>.md` — new session entry at top of History
2. If `CHANGELOG.md` exists in the project folder, prepend: `## YYYY-MM-DD — <headline>`. Create it if you want a running log.
3. Update `claude-memory/_index.md` — Last Touched date

## Rules
- Never fabricate project details. If uncertain, say "I don't have that logged."
- Quote sources: "Per projects/example.md..."
- Curated memory only — /wrap saves what matters, not everything
