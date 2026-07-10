---
name: reflex
description: Build, migrate, debug, and verify React or React Native applications that use @flexsurfer/reflex. Use for new Reflex apps, migration from React local state, Context, Redux, Zustand, MobX, or reducer stores, Reflex events/subscriptions/effects/coeffects, typed payload maps, and devtools MCP verification with minimal context usage.
---

# Reflex Agent Workflow

Use this workflow for Reflex state-management work. Optimize for small reads, explicit state contracts, and live verification.

## Choose The Path

- New app or site: read `references/new-project.md`.
- Existing app migration: read `references/migrate-existing-state.md`.
- Feature, bug, or refactor in a Reflex app: use the core workflow below and read `references/verification.md` when MCP/devtools are available.
- Setup or missing tooling: read `references/setup.md`.

## Core Workflow

1. Identify the app framework, package manager, test/typecheck commands, and current state-management files.
2. Prefer Reflex MCP/index tools before broad source reads: `get_handlers`, scoped `get_app_state`, `get_traces`, `get_trace`, and `dispatch_event`. Use `get_reflex_map`, `find_state_changes`, and `eval_sub` when available.
3. If MCP tools exist but report no connected Reflex app, start the app-side DevTools server from the project root with `npx reflex-devtools --mcp`, keep it running, reload the app if needed, and retry the MCP call.
4. If MCP is unavailable, read `APP_MAP.md` when present, then state IDs/contracts (`*-ids.ts`, `db.ts`, payload maps), then exact-match `rg` for the one event/subscription/call site.
5. Keep events pure. Put I/O, timers, localStorage, HTTP, navigation, and analytics into effects/coeffects.
6. Move view derivations into subscriptions. Components should dispatch intent and subscribe to view-ready data.
7. Keep `AppDb`, event payloads, subscription payloads, and effect payloads synchronized.
8. Verify with the smallest relevant typecheck/test command and, when connected, MCP dispatch/subscription checks.

## Context Rules

- Do not load full `llms.txt` unless the skill, references, and project indexes are insufficient.
- Do not read entire `events.ts`, `subs.ts`, or store files when an ID/index/exact search can isolate the target.
- Avoid full app-db dumps. Prefer shape, path, trace row, handler ID, or subscription ID.
- After every state-changing MCP call, use the returned patches/effects/errors before requesting more context.
