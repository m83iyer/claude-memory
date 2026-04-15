#!/bin/bash
# Pre-tool hook: validates bash commands before execution
# Note: this is a soft guard. Sufficiently creative commands can bypass these checks.
# Claude Code passes tool input as JSON on stdin.

INPUT=$(cat)
COMMAND=$(echo "$INPUT" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('tool_input',{}).get('command',''))" 2>/dev/null || echo "")

if [ -z "$COMMAND" ]; then
  exit 0
fi

# Block recursive deletes of root or home
if echo "$COMMAND" | grep -qE 'rm\s+-[a-zA-Z]*r[a-zA-Z]*f\s+(/|~/)'; then
  echo "BLOCKED: Recursive delete of root or home directory"
  exit 1
fi

# Block git force push to main/master
if echo "$COMMAND" | grep -qE 'git push.*(--force|-f).*(main|master)'; then
  echo "BLOCKED: Force push to main/master branch"
  exit 1
fi

exit 0
