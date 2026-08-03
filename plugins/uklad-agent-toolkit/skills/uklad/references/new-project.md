# Create A Canonical Reflex Project

Read [architecture.md](architecture.md) first. Use this sequence for a new app or when introducing the canonical boundary to an existing app.

## Bootstrap

1. Detect the existing scaffold, framework, package manager, supported targets, and test/typecheck conventions.
2. If the workspace is empty, create the smallest scaffold matching the request and local conventions.
3. Install the runtime with the detected package manager:

```bash
npm install @flexsurfer/reflex
```

Install `@flexsurfer/reflex-devtools` as a development dependency only when live inspection is needed; then read [setup.md](setup.md).

## Build In Discovery Order

1. Create `src/app/reflex/catalog.ts` with direct-literal `stateKeys` and `appIds`.
2. Create feature `state.ts` files with domain types and fresh initial values for independently reactive roots.
3. Create one complete `AppContracts` in `contracts.ts`, keyed by catalog values.
4. Compose fresh feature roots in `initial-state.ts`; do not share a mutable module-level initial object between runtimes.
5. Create a runtime factory in `runtime.ts` and contract-bound framework hooks in `bindings.ts`.
6. Register each feature's events and subscriptions through its `module.ts`; install those modules from `register.ts`.
7. Add only the required `platform/<target>` effect and coeffect adapters.
8. Let each entry point create its runtime, install shared features plus exactly one target adapter set, and mount or execute it.

```ts
// app/reflex/runtime.ts
export function createAppRuntime() {
  return createReflexRuntime<AppContracts>({
    initialState: createAppState(),
    runtimeId: 'app',
    name: 'App',
  });
}

// app/reflex/bindings.ts
export const { ReflexProvider, useRuntime, useSubscription } =
  createReflexHooks<AppContracts>();
```

Import runtime APIs from `@flexsurfer/reflex/vanilla` and React bindings from `@flexsurfer/reflex/react`.

## Composition Rules

- Create one runtime for one execution owner. Use a factory so SSR requests, tests, and headless runs receive isolated state.
- Install feature modules independently for lifecycle/disposal without implying state or graph isolation.
- Set default equality and ordered global interceptors only in the runtime factory.
- Call `enableMapSet()` before runtime creation when state uses `Map` or `Set`.
- Bind React or React Native once against the complete `AppContracts`; avoid inline per-component generics.
- Do not create empty platform files. Add only targets and handlers the app supports.

## Target Ownership

- Browser: create one client runtime and install web adapters.
- React Native: reuse feature modules and install native adapters.
- SSR: create one runtime per request with server-safe adapters; create a separate client runtime from serialized initial state.
- Integration test: create one runtime per fixture and install test adapters. Unit tests for pure state logic may omit platform handlers.
- Headless: create an explicit vanilla runtime, install headless adapters, and import no React layer.

## Finish

Read [events-effects.md](events-effects.md) and [subscriptions.md](subscriptions.md) only for the capabilities the app needs. Then run the narrowest formatter, typecheck, and focused tests before optional live verification.
