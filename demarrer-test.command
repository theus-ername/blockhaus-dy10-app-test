#!/bin/zsh
cd "${0:A:h}" || exit 1
NODE_BLOCKHAUS="/Users/remy/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node"
if [[ ! -x "$NODE_BLOCKHAUS" ]]; then
  echo "Node.js est introuvable. Ouvre cette tâche Codex puis relance le test."
  read -r
  exit 1
fi
"$NODE_BLOCKHAUS" test-server.mjs
