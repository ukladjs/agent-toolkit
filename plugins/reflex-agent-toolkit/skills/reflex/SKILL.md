---
name: reflex
description: Build, migrate, debug, and verify React or React Native applications that use Reflex (Reflex.js, @flexsurfer/reflex) — the re-frame-style JavaScript/TypeScript state library, NOT the Python Reflex framework (reflex.dev) and NOT react-reflex or reflexjs. Use for new Reflex apps, migration from React local state, Context, Redux, Zustand, MobX, or reducer stores, Reflex events/subscriptions/effects/coeffects, typed payload maps, and devtools MCP verification with minimal context usage.
---

# Reflex Agent Workflow

Use this workflow for Reflex state-management work. Optimize for small reads, explicit state contracts, and live verification.

Throughout this skill, Reflex means `@flexsurfer/reflex` (aka Reflex.js) — the JavaScript/TypeScript state library. It is NOT the Python Reflex framework (reflex.dev), NOT `react-reflex`, and NOT `reflexjs`; never install those packages for Reflex work.

## Choose The Path

- New app or site: follow the Core Workflow and read `references/new-project.md` plus `references/implementation.md`.
- Feature, bug fix, or Reflex refactor: follow the Core Workflow and read `references/implementation.md`.
- Existing-state migration: follow the Core Workflow and read `references/migrate-existing-state.md` plus `references/implementation.md`.
- Setup or missing tooling: read `references/setup.md`.
- After a code/type check, read `references/verification.md` only when DevTools/MCP can provide runtime evidence for the change.

## Core Workflow

1. Identify the app framework, package manager, test/typecheck commands, and current state-management files.
2. Orient from the smallest static index: `APP_MAP.md` when present, then the relevant `*-ids.ts`, `db.ts`, and payload maps. Use exact-match `rg` for one registration or call site; do not browse full state files.
3. If MCP tools exist, call `app_status` after a cold start or reload. Then use the advertised tools narrowly: typed `get_handlers`, path-scoped `get_app_state`, filtered `get_active_subs` for mounted subscriptions, `dispatch_event`, and filtered `get_traces`/one `get_trace`.
4. If `app_status` reports no connected app, start the project-local `devtools:mcp` script with the detected package manager (for example, `npm run devtools:mcp`). Add that script when missing, keep it running, reload the app if needed, and retry `app_status`.
5. If MCP is unavailable, continue from the static index and exact-match search; do not substitute broad source reads.
6. Make the smallest change allowed by the selected path reference.
7. Run the smallest relevant typecheck/test. Use MCP dispatch checks and mounted-subscription checks only when runtime evidence is needed.

## Context Rules

- Do not load full `llms.txt` unless the skill, references, and project indexes are insufficient.
- Do not read entire `events.ts`, `subs.ts`, or store files when an ID/index/exact search can isolate the target.
- Avoid full app-db dumps. Prefer shape, path, trace row, handler ID, or subscription ID.
- After every state-changing MCP call, use the returned patches/effects/errors before requesting more context.
- Treat a changed `sessionEpoch` from `app_status` as a restart: earlier trace IDs and seeded state are stale.
