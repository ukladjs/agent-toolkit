# Reflex Verification

Use this when devtools MCP is connected or when deciding how to verify a Reflex change.

## MCP Order

1. If MCP tools report no connected Reflex app, start `npx reflex-devtools --mcp` from the project root, keep it running, reload the app if needed, and retry.
2. `get_handlers`: discover registered events/subscriptions/effects without reading source broadly.
3. Scoped `get_app_state`: read only the relevant path or shape.
4. `dispatch_event`: verify event behavior and inspect returned patches, effects, and errors.
5. `get_traces`: inspect compact recent activity rows.
6. `get_trace(id)`: open one trace only when the compact row is not enough.
7. `eval_sub`: verify subscription output when available.

## What To Check

- Event changed exactly the expected state path.
- Event returned expected effects and did not run I/O directly.
- Subscription returns view-ready data.
- Errors are surfaced and handled in state.
- Components no longer duplicate derived-state logic.

## Context Discipline

- Prefer patches/effects from `dispatch_event` over a follow-up full state read.
- Prefer one trace row over full trace history.
- Prefer subscription evaluation over reading all subscription code.
- If a tool response is too large, narrow by ID, path, trace ID, or cursor before continuing.
