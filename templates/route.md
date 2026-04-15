---
description: Recommend the optimal Claude model for the current task
allowed-tools: [Read]
---

Assess the current task and recommend the optimal Claude model.

Route by MODE first:
- **Lookup** (check, what's, show me, list) → Haiku
- **Execution** (fix, update, edit, add, run) → Sonnet
- **Deliberation** (let's think, help me decide, which approach) → Opus
- **Design** (let's design, let's plan, build something new) → Opus

Output in this exact format:
```
Current model: [model]
Recommended: [model]
Why: [one sentence]
Switch: /model → select [recommended model]
```

If already on the right model: "You're on the right model. ([model] for [task type])"
