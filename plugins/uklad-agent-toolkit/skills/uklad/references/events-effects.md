# Uklad Events, Effects, And Coeffects

Read this only when changing an event turn, an environmental boundary, external ingress, or interceptors.

## Event Turn Contract

- Keep coeffects, interceptor hooks, the event handler, subscription dependency functions, and subscription computations synchronous. Never return a promise or thenable from them.
- Mutate application state only through the current handler's `draftState` and return declarative effect tuples for later work.
- Never call `dispatch`, `dispatchSync`, `debounceAndDispatch`, or `throttleAndDispatch` inside a coeffect, interceptor, or event handler. Return `dispatch`, `dispatch-later`, or a custom effect instead.
- Never schedule host work such as `setTimeout` from an event. Model it as an effect.
- Keep runtime-wide interceptors in runtime composition. They run in declared order before event-specific interceptors and unwind in reverse; feature modules must not register them.
- Express event intent with small scalar parameters or IDs where possible. Treat parameters and injected coeffect values as read-only.
- Never pass a live Immer draft to an effect. The runtime snapshots common top-level payload shapes; use `current()` from `@ukladjs/core/vanilla` for drafts nested inside collections or deep wrappers.
- Do not read storage, clock, random, network, browser, or native APIs from an event or subscription.
- Remember that effects run after state commits and cannot roll it back. State correctness must not depend on effect success.

## Registration Pattern

Declare the ID and type first, then register against the complete application contract:

```ts
export const registerTodosEvents: UkladModule<UkladRegistrar<AppContracts>> = (registrar) => {
  registrar.regEvent(
    appIds.events.todosAdd,
    ({ draftState, coeffects: { now } }, title) => {
      draftState.todosById[now] = { id: now, title, done: false };
      return [[appIds.effects.todosPersist, { todos: draftState.todosById }]];
    },
    { coeffects: { now: appIds.coeffects.systemNow } },
  );
};
```

Keep `event` and `draftState` reserved; do not use either as a coeffect ID or named binding.

## Platform Boundary

- Give an effect or coeffect one stable application ID and one shared contract across targets.
- Register web, native, headless, and test implementations in `src/platform/<target>/effects.ts` and `coeffects.ts`, not inside feature modules.
- Install exactly one matching platform set in each runtime's entry point. Do not branch on platform inside shared events or subscriptions.
- Make headless and test effects safe in-memory or recording implementations when real external work is undesirable.
- Make any platform no-op deliberate and documented. Do not treat a missing required handler as success.

```ts
export const registerWebEffects: UkladModule<UkladRegistrar<AppContracts>> = (registrar) => {
  registrar.regEffect(appIds.effects.todosPersist, ({ todos }) => {
    window.localStorage.setItem('todos', JSON.stringify(todos));
  });
};

export const registerWebCoeffects: UkladModule<UkladRegistrar<AppContracts>> = (registrar) => {
  registrar.regCoeffect(appIds.coeffects.systemNow, () => Date.now());
};
```

## Coeffect Rules

- Use a coeffect only for synchronous, already-prepared environmental input. Use an effect followed by a result event for asynchronous reads.
- Request every coeffect explicitly in event registration and bind it to a lower-camel local name.
- Treat a missing or throwing requested coeffect as an aborted transition before commit. Returning `undefined` deliberately is still a successful injection.
- Use the optional coeffect read context only for rare dependencies on the event or an earlier injection. It is frozen, ordered, state-free, and never exposes `draftState`.
- Name providers for the value, such as `system/now` or `storage/session-token`, not the read action.

## External Ingress

Validate, normalize, and detach complex mutable input at its adapter boundary. Build the final result event, dispatch it once, and neither retain nor mutate the accepted payload afterward.
