# Reflex Implementation Contract

Read this after the Core Workflow when changing `AppDb`, events, subscriptions, effects, payload maps, or a component's Reflex subscription/dispatch wiring. Do not read it for visual-only React changes.

## State Boundary And Index

- Keep the state boundary explicit: `db.ts`, `event-ids.ts`, `effect-ids.ts`, `sub-ids.ts`, `events.ts`, `effects.ts`, and `subs.ts`. Add `payload-maps.d.ts` when typed maps are adopted.
- Initialize app-db once. Import registration modules from one bootstrap entry before dispatching events.
- Keep ID constant keys in `UPPER_SNAKE_CASE` and values namespaced as `feature/action`.
- Add a one-line JSDoc signature to public event and subscription IDs. Treat ID files and payload maps as the narrow API index for later agents.
- Grow `AppDb` by feature-level keys. Keep shared/business state out of component-local React state. Call `enableMapSet()` before `initAppDb` when the db uses `Map` or `Set`.

## Events, Effects, And Coeffects

- Keep an event synchronous and focused on a state transition. Validate inputs and guard early; mutate only the needed draft fields and do not rebuild unchanged objects or arrays.
- Dispatch only user intent from a view. Read existing or derived state in the handler from `draftDb` or injected coeffects; do not send subscription output back through dispatch.
- Put time, IDs, random values, environment access, and other nondeterminism in coeffects when they affect behavior or tests.
- Return effect tuples for I/O. When an effect payload comes from an Immer draft, pass `current(draftValue)`, never the draft proxy.
- Do not call `dispatch` or `dispatchSync` inside an event handler. Return the built-in `['dispatch', eventVector]` effect for follow-up work. Use `dispatchSync` only when synchronous notification is load-bearing, such as a controlled input backed directly by app-db.
- Keep effect handlers small and defensive. Let state changes commit independently of failures in side effects.

## Subscriptions And Views

- Define root subscriptions for db keys, then build computed subscriptions only from declared subscriptions.
- Pass only JSON-serializable subscription parameters. Subscription cache keys use `JSON.stringify(subVector)`; functions, `Map`, `Set`, `undefined`, non-finite numbers, `BigInt`, and circular data can collide, stale, or throw.
- Return render-ready values from subscriptions. Move filtering, sorting, formatting, joins, and hot derivations out of components; precompute expensive repeated work in events when appropriate.
- For large derived collections, consider a suitable cheaper equality check such as `shallowEqual` only when structural sharing makes that contract correct.
- Keep components thin: subscribe to the smallest value, dispatch intent, and render. Pass a stable component name to `useSubscription` for tracing. Use React local hooks only for ephemeral UI concerns; do not mirror app-db.

## Typed Contracts And Tests

- When using typed payload maps, augment `AppDb`, `EventPayloads`, `SubPayloads`, and `EffectPayloads` together. Use labeled tuples for event/sub params, `[]` for no params, and `void` for an effect with no payload.
- Prefer module augmentation of `AppDb` over an explicit database generic on `regEvent`; the explicit generic can suppress event-payload inference.
- Keep every map entry aligned with its ID file. Once a map is declared, make it complete so `tsc` catches wrong IDs, payloads, effect tuples, and subscription results.
- Add focused event tests for draft mutation and returned effects. Add subscription tests from fixed state fixtures. Use `getHandler('event', id)` or `getHandler('sub', id)` to test pure handlers directly when a live mounted subscription is unavailable.
