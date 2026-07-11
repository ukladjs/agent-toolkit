# Reflex Agent Setup

Use this when Reflex packages, devtools, skill files, or MCP are missing.

## Dependencies

Install the runtime and development tooling with the detected package manager:

```bash
npm install @flexsurfer/reflex
npm install -D @flexsurfer/reflex-devtools
```

Add a project-local server script. It uses the DevTools package already installed above, so no absolute `node_modules` path is needed:

```json
{
  "scripts": {
    "devtools:mcp": "reflex-devtools --mcp --host 127.0.0.1 --port 4000"
  }
}
```

The plugin starts the version-pinned MCP bridge automatically through `npx`; do not add the MCP bridge package or a client configuration to the project. The application-side DevTools server must run while the app is open:

```bash
npm run devtools:mcp
```

Use the detected package manager's equivalent command when the project does not use npm. If MCP tools are present but report no connected Reflex app, start this script from the project root, keep the process running, reload the app if needed, and retry `get_handlers` or the narrowest relevant MCP call.

## Runtime Hook

Add development-only tracing/devtools wiring near app startup:

```ts
import { enableTracing } from '@flexsurfer/reflex'
import { enableDevtools } from '@flexsurfer/reflex-devtools'

if (import.meta.env.DEV) {
  enableTracing()
  enableDevtools()
}
```

Adjust the environment guard for non-Vite apps.

## Browserless Verification

For a repeated autonomous loop without a browser, prefer an existing project `dev:headless` script or `src/headless.ts` entry. It must load the same db/events/subs registrations as the app, use Node-safe effect/coeffect adapters, and enable tracing/devtools. Headless DevTools requires Node.js 22+; use it for state-layer verification and keep a browser/DOM smoke test for visual wiring.

## If MCP Is Not Available

If the MCP bridge is configured but the app-side server is not running, start:

```bash
npm run devtools:mcp
```

Then reload the app and retry the MCP call.

If MCP still is not available, continue with static navigation:

1. Read `APP_MAP.md` if present.
2. Read IDs and state contracts before implementations.
3. Use exact-match `rg` for one handler/subscription/call site.
4. Avoid full source sweeps until narrower paths fail.
