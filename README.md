# claude-memory

> Zero-infrastructure persistent memory for Claude Code. iCloud-synced, human-readable, no databases.

```bash
npx claude-memory install
```

---

## The problem

Every Claude Code session starts blank. No memory of what you worked on, what decisions were made, what to do next.

Most solutions require running databases and services. This is overkill — and adds infrastructure that breaks.

**claude-memory uses iCloud and markdown. That's it.**

---

## How it works

```
Open pinned project in Claude Code
          ↓
   New blank session starts
          ↓
  CLAUDE.md loads automatically
          ↓
Claude reads your memory file and greets you:

  "Project loaded. Last session Apr 14: fixed the auth bug.
   Next up: write tests, deploy to staging.
   What do you want to work on?"
          ↓
         Work
          ↓
      /wrap command
          ↓
  Memory file updated in iCloud
          ↓
  Next session picks up here
```

---

## Your memory lives here

```
iCloud Drive/
└── Claude/
    ├── claude-memory/
    │   ├── _index.md          ← all projects at a glance
    │   ├── projects/
    │   │   ├── my-app.md      ← session history, decisions, next steps
    │   │   └── side-project.md
    │   └── system/
    │       └── CLAUDE.md      ← global instructions (auto-symlinked)
    └── commands/
        ├── wrap.md            ← /wrap session command
        └── route.md           ← /route model advisor
```

Plain markdown files. You can read them, edit them, search them. They sync to every device via iCloud automatically.

---

## Install

```bash
# Set up everything on this machine
npx claude-memory install

# Wire any project folder
cd my-project
npx claude-memory add-project

# Full structure (rules, hooks, agents)
npx claude-memory add-project --full

# Check install health
npx claude-memory status
```

---

## What `add-project` creates

**Lean (default):**
```
my-project/
├── CLAUDE.md          ← session-start protocol (reads your memory file)
└── CLAUDE.local.md    ← machine-specific overrides (gitignored)
```

**Full (`--full`):**
```
my-project/
├── CLAUDE.md
├── CLAUDE.local.md
└── .claude/
    ├── rules/         ← conventions.md, style.md
    ├── commands/      ← project-specific slash commands
    ├── hooks/         ← pre/post tool validation scripts
    └── agents/        ← sub-agent definitions
```

---

## Why not claude-mem or mem0?

|  | claude-memory | claude-mem | mem0-mcp-selfhosted |
|--|--|--|--|
| Infrastructure | None | SQLite + ChromaDB + worker | Qdrant + Neo4j + Ollama |
| Cross-device | ✅ iCloud | ❌ Local only | ❌ Self-hosted |
| Human readable | ✅ Markdown | ❌ Database | ❌ Database |
| Memory quality | Curated (/wrap) | Auto (captures noise) | Auto |
| Setup | `npx claude-memory install` | `npx install` | Docker stack |

---

## Requirements

- macOS with iCloud Drive enabled
- Node.js 18+
- Claude Code

---

## License

MIT
