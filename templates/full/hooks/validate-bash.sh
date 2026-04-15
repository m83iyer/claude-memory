#!/bin/bash
# Pre-tool hook: validates bash commands before execution
# Blocks dangerous operations

COMMAND="$1"

# Block recursive deletes of root or home
if echo "$COMMAND" | grep -qE "rm -rf /|rm -rf ~"; then
  echo "BLOCKED: Recursive delete of root or home directory"
  exit 1
fi

# Block git force push to main
if echo "$COMMAND" | grep -qE "git push.*--force.*main|git push.*-f.*main"; then
  echo "BLOCKED: Force push to main branch"
  exit 1
fi

exit 0
