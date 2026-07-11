# Reflex Verification

Read this after code/type checks only when DevTools/MCP can provide runtime evidence for a Reflex change.

## MCP Order

1. `app_status`: call after every cold start or reload. If it reports no app, start the project-local `devtools:mcp` script (for example, `npm run devtools:mcp`), reload the app if needed, and retry. A changed `sessionEpoch` invalidates earlier traces and seeded state.
2. Typed `get_handlers`: discover only the registered event, effect, coeffect, or subscription IDs needed for the task.
3. Scoped `get_app_state`: read one relevant path. Do not omit `path` on an unfamiliar or large app.
4. `dispatch_event`: verify an event from its returned outcome, patches, effects, and errors; do not re-read state merely to confirm that dispatch.
5. Filtered `get_active_subs`: inspect only a mounted subscription value when a view already uses it. It is observational, not an evaluator for arbitrary or unmounted subscriptions.
6. Filtered `get_traces` with a small `limit`, `eventFilter`, or `opType`: inspect activity the agent did not initiate. Open exactly one `get_trace(id)` only when its compact row is insufficient.

Use only tools advertised by the connected MCP server. For an unmounted subscription, prefer its focused pure-handler test over a browser-driven workaround.

## What To Check

- Event changed exactly the expected state path.
- Event returned expected effects and did not run I/O directly.
- Subscription returns view-ready data.
- Errors are surfaced and handled in state.
- Components no longer duplicate derived-state logic.

## Context Discipline

- Prefer patches/effects from `dispatch_event` over a follow-up full state read.
- Prefer one trace row over full trace history.
- Prefer a filtered mounted-subscription check or focused pure-handler test over reading all subscription code.
- If a tool response is too large, narrow by ID, path, trace ID, or cursor before continuing.
- Prefer `get_active_subs({ filter })` over all mounted subscriptions and `get_traces({ limit: 10 })` or less over the default history.
