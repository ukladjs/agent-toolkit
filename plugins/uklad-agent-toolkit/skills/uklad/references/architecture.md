# Canonical Reflex Application Architecture

Read this for application-authored Reflex code. Do not impose it on the implementation of the `@flexsurfer/reflex` package itself.

## Bounded Discovery

Navigate one application through this fixed path:

```text
catalog.ts -> contracts.ts -> owning feature or selected platform -> implementation
```

Read `catalog.ts` for names, `contracts.ts` for shapes, and only then the file that owns behavior. Use a direct string literal or exported symbol with exact-match `rg`; do not scan every feature.

## Required Shape

```text
src/
  app/reflex/{catalog,contracts,initial-state,runtime,bindings,register}.ts
  features/<feature>/{state,events,subscriptions,module}.ts
  features/<feature>/ui/
  platform/<web|native|headless|test>/{effects,coeffects}.ts
```

Omit empty files and unsupported targets. Keep application code feature-based even when small; do not replace features with one global directory organized only by implementation kind.

## One Catalog And One Contract

Declare direct string literals once:

```ts
export const stateKeys = {
  todosById: 'todosById',
  todosFilter: 'todosFilter',
} as const;

export const appIds = {
  events: { todosAdd: 'todos/add' },
  subscriptions: {
    todosById: 'todos/by-id',
    todosVisible: 'todos/visible',
  },
  effects: { todosPersist: 'todos/persist' },
  coeffects: { systemNow: 'system/now' },
} as const;
```

- Put every top-level state property under `stateKeys` using a lower-camel, owning-feature prefix.
- Put every application event, subscription, custom effect, and coeffect under `appIds` using `<owner>/<semantic-name>` values.
- Keep names only in the catalog. Put state, parameter, payload, and result types in one complete `AppContracts` beside it, using catalog values as computed keys.
- Do not create feature-local contracts, `ids.ts` files, duplicate raw IDs, constructed ID strings, or catalog metadata.
- Keep runtime-owned `dispatch` and `dispatch-later` outside `appIds`.

```ts
export interface AppContracts extends ReflexContracts {
  state: { [stateKeys.todosById]: Record<TodoId, Todo> };
  events: { [appIds.events.todosAdd]: [title: string] };
  subscriptions: {
    [appIds.subscriptions.todosById]: { params: []; result: Record<TodoId, Todo> };
  };
  effects: { [appIds.effects.todosPersist]: { todos: Record<TodoId, Todo> } };
  coeffects: { [appIds.coeffects.systemNow]: { arg: void; value: number } };
}
```

## Runtime And Module Ownership

- Create one runtime for one application root, SSR request, isolated test fixture, or independent headless execution.
- Give that runtime one application state object, one complete `AppContracts`, and one reactive graph.
- Use feature modules only to group application-wide registrations and their lifecycle. Never create a child runtime, private feature graph, contract scope, or access boundary for a feature.
- Allow cross-feature dispatch and subscription dependencies. A prefix communicates ownership, not permission.
- Configure default equality and ordered runtime-wide interceptors only when composing the runtime. Feature modules must not alter this immutable runtime policy.

## Flat Reactive Roots

- Give values that change or are observed independently separate top-level roots: `todosById`, `todosOrder`, `todosFilter`, not one broad `todos` object.
- Keep nested data when it is one cohesive reactive value; do not create a root for every field.
- Access state with dot notation such as `draftState.todosById`.
- Map a queryable root explicitly: `registrar.regRootSub(appIds.subscriptions.todosById, stateKeys.todosById)`.

## Runtime-Owned Data

- Treat initial, restored, or hydrated state and everything reachable from it as transferred to the runtime. Never mutate it after handoff.
- Treat state snapshots and subscription results as read-only. Change state only through an event handler's Immer `draftState`.
- Do not rely on recursive copying or freezing at handoff or commit; enforce ownership in adapters and focused tests.
- After `runtime.dispatch(event)`, never mutate the event vector, its parameters, or reachable values. Validate and normalize mutable external data before dispatch.
- Keep component-local state for ephemeral UI mechanics only. Put shared, durable, or independently observed data in runtime state.

## Change Surfaces

- State root: update `stateKeys`, `AppContracts.state`, feature initial values, application initial-state composition, and a root subscription when queried.
- Event: update `appIds.events`, `AppContracts.events`, and the owning feature registration.
- Derived subscription: update `appIds.subscriptions`, `AppContracts.subscriptions`, dependencies, equality policy, and the owning feature registration.
- Environment write: update `appIds.effects`, `AppContracts.effects`, and every supported platform adapter.
- Environmental input: update `appIds.coeffects`, `AppContracts.coeffects`, every supported platform adapter, and the event's named binding.
- Feature: add its feature directory/module and install it in shared application composition without creating another runtime.
