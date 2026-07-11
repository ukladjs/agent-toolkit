# New Reflex Project

Use this when the user asks to create a new site, app, prototype, dashboard, or UI with Reflex.

## First Moves

1. Detect whether the workspace is empty or already has a package/app scaffold.
2. If empty, create the smallest app scaffold that matches the user request and local conventions.
3. Install:

```bash
npm install @flexsurfer/reflex
npm install -D @flexsurfer/reflex-devtools
```

Adapt the commands to the detected package manager.

## App Shape

Create a compact Reflex layer before UI complexity:

- `src/state/db.ts`: `AppDb` shape and initial value.
- `src/state/event-ids.ts`: event IDs and dispatch signatures.
- `src/state/effect-ids.ts`: effect IDs and payload signatures.
- `src/state/sub-ids.ts`: subscription IDs and result signatures.
- `src/state/payload-maps.d.ts`: `AppDb` and typed payload maps.
- `src/state/events.ts`: pure events.
- `src/state/subs.ts`: view-ready subscriptions.
- `src/state/effects.ts`: I/O effects when needed.
- `src/state/index.ts`: state initialization exports.

Initialize app-db once near the app entry point. Import the state registration entry before the first dispatch. Enable tracing/devtools only in development:

```ts
import { enableTracing } from '@flexsurfer/reflex'
import { enableDevtools } from '@flexsurfer/reflex-devtools'

if (import.meta.env.DEV) {
  enableTracing()
  enableDevtools()
}
```

## Implementation Rules

- Model domain state in `AppDb` before component state.
- Use events for user intent and async lifecycle outcomes.
- Use effects for localStorage, HTTP, timers, navigation, and analytics.
- Use subscriptions for filtering, sorting, formatting, counts, joins, and screen-ready view models.
- Components should stay thin: `useSubscription(...)` and `dispatch(...)`.

## Finish

Run the app, typecheck/test it, and verify one representative interaction. If Reflex MCP is connected, use `dispatch_event` and inspect patches/effects instead of manually reading the whole app state.
