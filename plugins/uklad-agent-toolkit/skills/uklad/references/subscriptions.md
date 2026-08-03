# Uklad Subscriptions And Views

Read this only when changing reactive roots, computed data, subscription queries, equality, or view wiring.

## Root And Computed Subscriptions

- Use `regRootSub` for a direct top-level state read. Do not create a computed pass-through subscription.
- Use `regSub` only for derived values and declare every input through its dependency function.
- Read no runtime, state snapshot, or hidden subscription inside the compute function.
- Keep dependencies static for one serialized query. Query parameters may choose dependency queries; the compute result must not change graph shape.
- Return synchronously from both dependency and compute functions. Never cache a promise or thenable.

```ts
registrar.regRootSub(appIds.subscriptions.todosById, stateKeys.todosById);
registrar.regRootSub(appIds.subscriptions.todosFilter, stateKeys.todosFilter);

registrar.regSub(
  appIds.subscriptions.todosVisible,
  () => [
    [appIds.subscriptions.todosById],
    [appIds.subscriptions.todosFilter],
  ],
  ([todosById, filter]) => selectVisible(todosById, filter),
  { equalityCheck: shallowEqual },
);
```

## Bounded Query Parameters

- Declare a fixed-length parameter tuple in `AppContracts.subscriptions`; never use an unbounded array type.
- Use only `string`, finite `number`, `boolean`, or `null` parameters.
- Validate or test number finiteness at the query boundary because TypeScript cannot express it.
- Never use `undefined`, objects, arrays, functions, symbols, `bigint`, `Date`, `Map`, `Set`, or regular expressions.
- Pass IDs, flags, limits, or other small cache keys. Read application data from declared dependencies instead of transporting it in a query.
- Treat omitted subscription contracts or explicit `any` maps as migration compatibility, not new application style.

```ts
[appIds.subscriptions.todosByOwner]: {
  params: [ownerId: string, includeDone: boolean];
  result: Todo[];
};
```

## Equality Policy

- Choose the runtime default `equalityCheck` in `createUkladRuntime`; the framework default is deep equality.
- Let a computed subscription inherit that default or supply a pure, deterministic override.
- Use `Object.is` for meaningful reference identity, `shallowEqual` for fresh shallow collections whose members preserve identity, or a small documented domain comparator.
- Use `equalityCheck: () => false` at runtime composition only when the application deliberately wants every computed result treated as changed.
- Do not configure equality for root subscriptions. They expose their source root directly.

Equality stops downstream graph work and notification, not only React rendering. Choose it from result semantics, not by habit.

## Views

- Return view-ready application data from subscriptions. Put filtering, sorting, grouping, joins, and business shaping in the reactive graph.
- Keep presentation-only formatting in views when it has no application meaning.
- Subscribe to the smallest useful result, dispatch intent, and render. Do not mirror a subscription result in React state or send it back as an event payload.
- Reserve React local state for focus, animation, uncontrolled-input coordination, and other ephemeral UI mechanics.
