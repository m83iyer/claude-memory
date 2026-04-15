---
description: Wrap the current session — update project memory file and _index.md
---

Execute the session-end protocol NOW:

1. For each project touched this session, append a new dated entry to the TOP of the Session History section in `{{ICLOUD_PATH}}/Claude/claude-memory/projects/<project>.md`:

```markdown
## YYYY-MM-DD — <one-line headline>

**Duration:** <estimate>
**Tags:** <comma separated>

### What happened
<Full detail. Not a summary — include specifics. This is your audit trail.>

### Decisions made
- <decision + rationale>

### Open threads
- <unresolved items>

### Files touched
<list paths>
```

2. Update the Current State section ONLY if: architecture changed, canonical paths changed, status line is stale.

3. Update `{{ICLOUD_PATH}}/Claude/claude-memory/_index.md` — Last Touched date, any new decisions.

4. If a CHANGELOG.md exists in the project folder, prepend: `## YYYY-MM-DD — <headline>`

5. Confirm: "Session wrapped. Project file updated. _index.md refreshed."
