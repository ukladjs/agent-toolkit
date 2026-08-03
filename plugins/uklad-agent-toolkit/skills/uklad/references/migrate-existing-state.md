# Migrate Existing State To Uklad

Read [architecture.md](architecture.md) first. Migrate one complete vertical workflow at a time rather than translating a store file mechanically.

## Focused Audit

1. Detect state libraries and entry points from `package.json` and exact imports.
2. Search mutation and read APIs for one workflow:
   - React: `useState`, `useReducer`, `createContext`, `useContext`
   - Redux: `createSlice`, `configureStore`, selectors, dispatch
   - Zustand: store creators, hooks, setter callbacks
   - MobX: observables, actions, and computed values
3. Read one store, slice, context, or service at a time. Record its ownership, writes, derived reads, I/O, callers, and tests.
4. Map the workflow to canonical surfaces:
   - independently reactive values -> flat, feature-prefixed `stateKeys`
   - action/reducer/setter -> `appIds.events`, `AppContracts.events`, feature event registration
   - selector/computed value -> root or computed subscription
   - thunk/middleware/service I/O -> platform effect plus result event
   - synchronous environment read -> platform coeffect plus named event binding
   - UI store access -> contract-bound `useSubscription`, `useRuntime`, and intent dispatch

## Incremental Cutover

1. Introduce `src/app/uklad/catalog.ts`, `contracts.ts`, runtime composition, and bindings if missing.
2. Split a broad nested feature store into roots only where values change or are observed independently.
3. Add one feature module, its initial roots, events, subscriptions, and required platform adapters.
4. Switch one UI/ingress path and its tests to Uklad.
5. Verify behavior, ownership, and derived results before moving the next workflow.
6. Remove the old branch only after no reader or writer remains.

## Migration Guardrails

- Preserve behavior first, then improve derived data or root granularity with focused tests.
- Never leave two writable sources of truth for one migrated value.
- Never introduce feature-local ID files or partial contracts as a temporary target.
- Normalize mutable external data before dispatch, then stop mutating or retaining the accepted payload.
- Translate asynchronous work into request/result events and effects; do not make event or subscription functions async.
- Move application-level filtering, sorting, grouping, and joins from components into subscriptions.
- Keep a legacy compatibility surface only where an incremental boundary requires it, and make the next removal point explicit in code or task notes.
