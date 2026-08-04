#!/bin/sh

MSG_FILE=$1
MSG_CONTENT=$(cat $MSG_FILE)

# Very basic validation (ensure message is not empty and follows semantic format roughly)
if ! echo "$MSG_CONTENT" | grep -Eq '^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert)(\([a-zA-Z0-9_-]+\))?: .*'; then
  echo "Error: Commit message does not follow conventional commits format."
  echo "Format should be: type(scope): message"
  exit 1
fi
