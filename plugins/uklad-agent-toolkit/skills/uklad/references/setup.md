# Uklad Setup And DevTools

Read this only when runtime packages, framework bindings, DevTools, MCP connectivity, or a headless entry are missing.

## Dependencies

Use the detected package manager:

```bash
npm install @ukladjs/core
npm install -D @ukladjs/devtools
```

The plugin starts its version-pinned MCP bridge. Do not add the bridge package or a separate MCP client configuration to the application.

## Runtime Inspector

Connect each development runtime explicitly:

```ts
import { createUkladInspector } from '@ukladjs/core/devtools';
import { enableDevtools } from '@ukladjs/devtools';

if (import.meta.env.DEV) {
  enableDevtools(createUkladInspector(appRuntime));
}
```

Adjust the environment guard for the build system. Keep DevTools out of production execution.

## Project-Local Server

Add a read-only inspection script using the browser app's exact development origin:

```json
{
  "scripts": {
    "devtools:mcp": "uklad-devtools --mcp --host 127.0.0.1 --port 4000 --allow-origin http://localhost:5173"
  }
}
```

- Repeat `--allow-origin` for additional browser origins; omit it for a headless-only runtime.
- Keep the loopback host unless the user explicitly requests and secures remote access.
- Treat `--mcp` as inspection-only. Add `--allow-dispatch` only when the user explicitly authorizes live runtime mutation; never work around `CAPABILITY_DENIED`.
- Never disable DevTools redaction. Add an application allowlist only for a known non-sensitive key that is incorrectly masked.

Start the script from the project root with the detected package manager and keep it running while the app is open. If `app_status` still reports no app, reload or start the application and retry.

## Headless Verification Runtime

Use an existing headless entry when available. Otherwise create `src/headless.ts` only when repeated browserless verification is valuable:

- create its own runtime with a stable `runtimeId`;
- install the same feature modules as the app;
- install headless effect/coeffect adapters instead of browser adapters;
- connect `createUkladInspector(runtime)`; and
- run it under a watcher such as `tsx watch` or `vite-node --watch`.

Headless DevTools requires Node.js 22 or newer. Keep a browser or native smoke test for visual wiring.
