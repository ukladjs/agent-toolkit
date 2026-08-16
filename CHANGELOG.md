# Changelog

## 0.2.2 — Hand-written headless E2E

- Add a focused, progressive-disclosure workflow for browserless application-semantic E2E tests using Core's `createUkladHeadlessScenario` API, mounted subscription views, standard dispatch, deterministic adapters, and explicit async settlement.
- Update Codex and Claude marketplace metadata to advertise headless E2E guidance.

## 0.2.1 — Project agent router

- Teach the setup skill to run the project-local `uklad-agent init` command shipped by `@ukladjs/core@0.2.1` and preserve existing `AGENTS.md` guidance through managed markers.
- Require npm's `--no-install` mode so projects on older core versions cannot accidentally fetch an unrelated registry package.

## 0.2.0 — Plugin release

- Bump the Codex and Claude plugin release to 0.2.0.

## 0.1.0 — Initial release

- Add the context-routed Uklad skill for canonical application architecture, events and effects, subscriptions, migration, setup, verification, and server-state integrations.
- Add Codex and Claude Code plugin manifests and marketplace catalogs.
- Pin the compatible `@ukladjs/devtools-mcp` bridge and the package release set in `versions.json`.
- Enable operation snapshots with bounded state-patch evidence in the recommended DevTools setup.
