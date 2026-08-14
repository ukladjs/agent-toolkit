# Uklad Server State

Read this only for TanStack Query, `regSubExt`, another external subscription lifecycle, or remote-data ownership. Read [architecture.md](architecture.md) and [subscriptions.md](subscriptions.md) first when changing application structure or query declarations.

## Ownership Boundary

- Keep one Uklad runtime, application state, reactive graph, and framework provider. An external cache does not create a second application store.
- Let the server-state client own request deduplication, retries, invalidation, cache lifetime, and garbage collection.
- Expose a small, read-only domain result through an explicitly named Uklad root and ordinary subscriptions. Views use the application's bound `useSubscription`; do not add a server-state provider or special query hook.
- Keep query clients, keys, request functions, observer options, and mapping in `src/platform/<target>/queries.ts` or another platform-local adapter.
- Keep commands and mutations in Uklad effects. On success, invalidate the relevant external query key; do not pass the client into event handlers.

## TanStack Query

Use the current adapter and its required Query Core peer:

```bash
npm install @ukladjs/tanstack-query @tanstack/query-core
```

- Create one `QueryClient`, call `attachQueryClient(runtime, queryClient)`, and release it with the runtime lifecycle.
- Register the feature's root/derived subscription first; then call `regQuerySub` from the selected platform query adapter.
- Name the backing `stateKey` explicitly and map the frozen `QuerySnapshot` to the domain value that Uklad owns. Never store the mutable observer result.
- Treat signals as passive sampled inputs, not hidden graph dependencies. Each parameterized lifecycle query owns one observer and merges into the latest backing root through its updater.
- Observe only the fields the mapper exposes. Prefer the default `data` and `error`; use `observe: 'all'` only when the domain result intentionally represents the full lifecycle.

## Generic Extensions

`regSubExt` is a narrow lifecycle hook attached to an already-registered subscription. It may observe passive external signals and use its protected update capability to map a read-only external value into an explicit root. It must not hide application-state reads, mutate state directly, publish into the graph, or run application commands.

The first live subscription consumer starts the external lifecycle and the final consumer releases it. Test activation, signal switching, mapped results, and final disposal with an isolated runtime.
