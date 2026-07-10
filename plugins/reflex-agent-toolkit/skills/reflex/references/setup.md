# Reflex Agent Setup

Use this when Reflex packages, devtools, skill files, or MCP are missing.

## Dependencies

Install the runtime and development tooling with the detected package manager:

```bash
npm install @flexsurfer/reflex
npm install -D @flexsurfer/reflex-devtools
```

The MCP bridge is started by the host plugin through:

```bash
npx -y @flexsurfer/reflex-devtools-mcp
```

The application-side DevTools server must run while the app is open:

```bash
npx reflex-devtools --mcp
```

If MCP tools are present but report no connected Reflex app, start this command from the project root, keep the process running, reload the app if needed, and retry `get_handlers` or the narrowest relevant MCP call.

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

## If MCP Is Not Available

If the MCP bridge is configured but the app-side server is not running, start:

```bash
npx reflex-devtools --mcp
```

Then reload the app and retry the MCP call.

If MCP still is not available, continue with static navigation:

1. Read `APP_MAP.md` if present.
2. Read IDs and state contracts before implementations.
3. Use exact-match `rg` for one handler/subscription/call site.
4. Avoid full source sweeps until narrower paths fail.
