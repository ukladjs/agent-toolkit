# Migrate Existing State To Reflex

Use this when the user asks to move an existing app from React local state, Context, Redux, Zustand, MobX, reducer stores, or ad hoc service state to Reflex.

## Audit Without Bloating Context

1. Detect the current state libraries from `package.json`.
2. Search for state entry points and mutation APIs:
   - React: `useState`, `useReducer`, `createContext`, `useContext`
   - Redux: `createSlice`, `configureStore`, `useSelector`, `useDispatch`
   - Zustand: `create(`, store hooks, setter callbacks
   - MobX: `observable`, `makeAutoObservable`, actions, computed values
3. Read one store/slice/context at a time. Do not read every state file up front.
4. Make a migration map:
   - state shape -> `AppDb`
   - actions/reducers/setters -> Reflex events
   - selectors/computed values -> Reflex subscriptions
   - thunks/middleware/services -> effects/coeffects
   - component store calls -> `dispatch` and `useSubscription`

## Incremental Migration

1. Add Reflex dependencies and devtools tracing.
2. Create the Reflex state boundary next to the old state layer.
3. Migrate one vertical workflow first: one state branch, its updates, its derived reads, and one UI path.
4. Verify behavior before migrating the next branch.
5. Remove old store code only after the equivalent Reflex workflow is wired and tested.

## Rules

- Preserve behavior first; improve structure after tests pass.
- Keep event IDs and subscription IDs stable and centralized.
- Do not mix two sources of truth for the same state branch after a workflow is migrated.
- Keep side effects out of events. Translate async logic into request/success/failure events plus effects.
- Move selector logic out of components as subscriptions.

## Verification

For each migrated workflow, run the smallest existing tests. If no tests exist, add focused tests around event transitions and subscriptions. When MCP is connected, verify the migrated event with `dispatch_event` and inspect patches/effects/errors.
