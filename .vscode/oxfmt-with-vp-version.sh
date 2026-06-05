#!/usr/bin/env bash
# Set VP_VERSION so oxfmt 0.45+ recognizes vite.config.ts as a config
# source. The oxc.oxc-vscode extension can't pass env vars to the LSP
# server it spawns, and macOS GUI launches don't inherit shell rcfiles —
# wrapping the binary is the only reliable way to make editor
# format-on-save respect the `fmt:` block in vite.config.ts.
set -e
WORKSPACE="$(cd "$(dirname "$0")/.." && pwd)"
export VP_VERSION="$(node -p "require('${WORKSPACE}/node_modules/vite-plus/package.json').version")"
exec "${WORKSPACE}/node_modules/.bin/oxfmt" "$@"
