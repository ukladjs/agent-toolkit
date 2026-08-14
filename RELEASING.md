# Releasing the Uklad Agent Toolkit

1. Update `versions.json` first. Keep the plugin version aligned across `package.json`, the Codex and Claude manifests, and the Claude marketplace entry.
2. Keep only the MCP bridge exact-pinned; application package install examples should use the current package-manager-resolved releases.
3. Run `npm run validate`, the Codex skill quick validator, and the Codex plugin validator.
4. Confirm the pinned MCP package version is published before tagging the plugin.
5. Tag the repository with the plugin version and create the matching GitHub release.

The repository marketplace is the distribution artifact; this private root package is not published to npm.
