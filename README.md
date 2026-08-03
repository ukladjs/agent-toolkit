# Uklad Agent Toolkit

Standalone marketplace repository for the Uklad agent plugin. It contains the distributable skill and MCP configuration; the Uklad runtime library remains in its own repository.

## What It Contains

- `plugins/uklad-agent-toolkit/.codex-plugin/plugin.json`: Codex plugin manifest.
- `plugins/uklad-agent-toolkit/.claude-plugin/plugin.json`: Claude Code plugin manifest.
- `plugins/uklad-agent-toolkit/.mcp.json`: shared Uklad DevTools MCP server config.
- `plugins/uklad-agent-toolkit/skills/uklad/SKILL.md`: compact, task-routing Uklad workflow.
- `plugins/uklad-agent-toolkit/skills/uklad/agents/openai.yaml`: Codex skill UI metadata.
- `plugins/uklad-agent-toolkit/skills/uklad/references/`: one-level, progressive-disclosure guidance for canonical architecture, events/effects, subscriptions, project creation, migration, setup, and verification.
- `.agents/plugins/marketplace.json`: Codex local marketplace catalog.
- `.claude-plugin/marketplace.json`: Claude Code local marketplace catalog.

## Local Codex Install

From this repository root:

```bash
codex plugin marketplace add .
```

Then inside Codex, run `/plugins` and install "Uklad Agent Toolkit" from the browser.

After publishing as `ukladjs/agent-toolkit`:

```bash
codex plugin marketplace add ukladjs/agent-toolkit
```

Then `/plugins` → install "Uklad Agent Toolkit".

## Local Claude Code Install

From Claude Code, add the local marketplace and install the plugin:

```text
/plugin marketplace add .
/plugin install uklad-agent-toolkit@ukladjs
/reload-plugins
```

After publishing as `ukladjs/agent-toolkit`:

```text
/plugin marketplace add ukladjs/agent-toolkit
/plugin install uklad-agent-toolkit@ukladjs
/reload-plugins
```

For development without marketplace installation:

```bash
claude --plugin-dir ./plugins/uklad-agent-toolkit
```

## User Prompts

New project:

```text
Create a React/Vite site using Uklad (@ukladjs/core).
```

Existing project:

```text
Migrate this app's state management to Uklad (@ukladjs/core).
```

The plugin should steer the agent toward the Uklad skill, small source reads, catalog/contract indexes, and capability-driven runtime verification when DevTools is connected.

Application discovery follows one bounded path:

```text
src/app/uklad/catalog.ts -> contracts.ts -> owning feature or selected platform
```

The skill teaches one complete `AppContracts`, flat feature-prefixed reactive roots, a central `stateKeys`/`appIds` catalog, feature registration modules, and target-specific effect/coeffect adapters.

## Runtime Requirement

The plugin starts a version-pinned MCP bridge through `npx` for each Codex or Claude Code session. It is independent of the active project's `node_modules`, so one plugin installation works across projects.

For live app verification, each project still needs its own DevTools server. The setup skill adds a read-only script with the browser app's exact development origin:

```json
{
  "scripts": {
    "devtools:mcp": "uklad-devtools --mcp --host 127.0.0.1 --port 4000 --allow-origin http://localhost:5173"
  }
}
```

```bash
npm run devtools:mcp
```

Replace the origin with the actual browser dev-server origin, repeat it for additional origins, or omit it for headless-only use. Add `--allow-dispatch` only when live mutation is explicitly authorized; inspection remains read-only by default.

The Uklad skill tells the agent to start this script from the project root when MCP tools are present but report no connected Uklad app. Codex/Claude may ask for approval because this is a long-running local process.

## Validate

This repository includes a dependency-free structure and skill-contract check:

```bash
npm run validate
```
