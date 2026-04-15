---
description: Project-specific session wrap (extends the global /wrap protocol)
---

First, run the full session-end protocol from the global /wrap command:
1. Append a new dated session entry to the TOP of `{{ICLOUD_PATH}}/Claude/claude-memory/projects/<project>.md`
2. Update Current State section if architecture/status changed
3. Update `{{ICLOUD_PATH}}/Claude/claude-memory/_index.md` — Last Touched date
4. Prepend one-liner to `CHANGELOG.md` if it exists

Then, run these project-specific steps:
- [Add project-specific wrap steps here]
