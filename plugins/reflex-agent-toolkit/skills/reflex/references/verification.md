# Verify Reflex Changes

Run the smallest relevant formatter, typecheck, and focused test first. Use DevTools only when live state, graph, or event-cascade evidence adds value.

## Focused Tests

Create an isolated runtime or use the application's runtime factory. Use `createReflexTestHarness` from `@flexsurfer/reflex/testing` for explicit test-only access:

- `dispatchSync` for a deterministic event transition;
- `getState` for a narrow assertion after that transition;
- `getSubscriptionValue` for any registered root or computed query;
- `getEventHandler`, `getEffectHandler`, `getCoeffectHandler`, or `getSubscriptionHandler` only for a focused pure-handler test; and
- `flush` when ordinary queued dispatch or follow-up effects must settle.

Install test platform adapters for integration tests. Pure event/subscription unit tests may omit unused environmental handlers.

## Capability-Driven MCP Order

1. Call `app_status` after each cold start or reload. Select a listed runtime and pass its `runtimeId` to later calls when multiple runtimes exist.
2. Use typed `get_handlers` for only the event, effect, coeffect, or subscription IDs needed.
3. Use the advertised path-scoped state tool (`get_state`; older bridges may expose `get_app_state`). Omit the path only for an intentionally tiny state object.
4. Use `eval_sub` when advertised to evaluate any registered subscription. Otherwise use filtered `get_active_subs` only for already-mounted queries or a focused harness test.
5. When dispatch is explicitly granted, prefer `dispatch_and_wait` when advertised so a whole joined event cascade settles. Otherwise use `dispatch_event` and its returned patches, effects, errors, or trace identity. Do not re-read state merely to confirm the same dispatch.
6. Use filtered `get_traces` with a small limit for activity not initiated by the agent. Open one `get_trace` only when its compact row is insufficient, passing the row's `runtimeId` and `sessionEpoch` when supported.

Use only advertised tools. If mutation returns `CAPABILITY_DENIED`, continue read-only or ask the user to restart the DevTools server with `--allow-dispatch` when live mutation is genuinely required.

## Evidence Checklist

- The event changed only expected roots and emitted expected platform-neutral effects.
- A result event or error state handles effect failure where the product requires it.
- Root subscriptions map the intended `stateKeys`; computed subscriptions return view-ready values from complete dependencies.
- Parameterized queries use bounded scalar tuples and the intended equality policy.
- Components do not duplicate application derivation or mirror runtime-owned values.
- The running target installed the expected platform adapter modes.

## Context Discipline

- Prefer a dispatch outcome over a follow-up state dump.
- Prefer one scoped path, evaluated query, trace row, or trace detail over full state, all subscriptions, or trace history.
- Treat `[REDACTED]` values as security behavior, not an application failure.
- Treat a changed `sessionEpoch` as a new DevTools session. Discard old trace IDs and refresh status.
