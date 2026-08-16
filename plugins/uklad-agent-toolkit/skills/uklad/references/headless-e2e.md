# Hand-Written Headless E2E

Read this when writing browserless application-semantic E2E tests. Use this
instead of a DOM test when the goal is to exercise the real Uklad event,
effect, subscription, and view-lifecycle path. Keep a small browser smoke test
for DOM wiring, focus, layout, accessibility, and selectors.

## Build One Headless Application Owner

- Create an isolated runtime with the same feature modules as the browser app.
- Install headless or test coeffect/effect adapters instead of browser adapters.
- Use deterministic clocks, memory-backed storage, and fixture-backed reads.
- Do not import browser globals or perform real external I/O by default.
- Call `enableMapSet()` before creating a runtime whose state contains `Map` or
  `Set`.

Keep application construction separate from the test:

```ts
import { createUkladHeadlessScenario } from '@ukladjs/core/testing';

export function createHeadlessApp() {
  const runtime = createAppRuntime({ runtimeId: 'app.headless' });
  registerFeatureModules(runtime);
  runtime.registerModule(registerHeadlessCoeffects);
  runtime.registerModule(registerHeadlessEffects);
  return createUkladHeadlessScenario(runtime);
}
```

`createUkladHeadlessScenario` is available from `@ukladjs/core@0.2.2` onward.
For an older installed Core version, upgrade or use the lower-level
`watchSubscription` and `flush` test-harness primitives explicitly.

## Mount Subscription Views

Treat a headless view as a named collection of subscription watches, not as a
fake React component. Mount the same smallest view-ready queries that the real
screen observes. A mounted view captures each initial value and every published
change; unmount it when that screen or child view would leave the browser tree.

```ts
const app = createHeadlessApp();
const list = app.mountView('TaskList', {
  todos: [appIds.subscriptions.todosVisible],
  allComplete: [appIds.subscriptions.todosAllComplete],
});

await app.settle();
expect(list.current()).toEqual({ todos: [], allComplete: false });

app.dispatch([appIds.events.todosAdd, 'Buy milk']);
await app.settle();

expect(list.value('todos')).toEqual([
  expect.objectContaining({ title: 'Buy milk', done: false }),
]);

list.unmount();
await app.dispose();
```

- Dispatch only through `app.dispatch`; do not use `dispatchSync`, direct state
  reads, restoration, or handler lookup in the E2E scenario.
- Assert mounted subscription values, not full internal state or patch lists.
- Use `history(queryName)` only when the loading-to-ready or other transition
  itself is part of the behavior under test; do not treat notification count as
  React render count.
- Mount and unmount child views explicitly for route, modal, or conditional UI
  lifecycles. A headless test proves semantic behavior, not that React selected
  the correct component.

## Settle And Control Async Work

`await app.settle()` drains the accepted Uklad event queue and publishes
subscriptions. It does not make arbitrary promises, network requests, or host
timers deterministic.

- Make a fixture-backed adapter dispatch its result event, then call `settle()`
  again.
- Advance a virtual clock explicitly before settling delayed behavior.
- Report a pending fixture, missing adapter, detached effect, or real-I/O
  attempt instead of waiting with sleeps or quiet periods.
- Keep required effects deliberate: use a memory or fixture adapter when later
  application behavior depends on it; use a documented noop only when
  observation of the emitted intent is sufficient.

Dispose the scenario in test teardown. It releases any remaining mounted views
and its isolated runtime.
