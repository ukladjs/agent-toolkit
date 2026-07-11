# Reflex Agent Toolkit

Standalone marketplace repository for the Reflex agent plugin. It contains the distributable skill and MCP configuration; the Reflex runtime library remains in its own repository.

## What It Contains

- `plugins/reflex-agent-toolkit/.codex-plugin/plugin.json`: Codex plugin manifest.
- `plugins/reflex-agent-toolkit/.claude-plugin/plugin.json`: Claude Code plugin manifest.
- `plugins/reflex-agent-toolkit/.mcp.json`: shared Reflex DevTools MCP server config.
- `plugins/reflex-agent-toolkit/skills/reflex/SKILL.md`: compact Reflex workflow skill.
- `plugins/reflex-agent-toolkit/skills/reflex/agents/openai.yaml`: Codex skill UI metadata.
- `plugins/reflex-agent-toolkit/skills/reflex/references/`: progressive-disclosure implementation, project, migration, setup, and verification workflows.
- `.agents/plugins/marketplace.json`: Codex local marketplace catalog.
- `.claude-plugin/marketplace.json`: Claude Code local marketplace catalog.

## Local Codex Install

From this repository root:

```bash
codex plugin marketplace add .
```

Then inside Codex, run `/plugins` and install "Reflex Agent Toolkit" from the browser.

After publishing as `flexsurfer/reflex-agent-toolkit`:

```bash
codex plugin marketplace add flexsurfer/reflex-agent-toolkit
```

Then `/plugins` → install "Reflex Agent Toolkit".

## Local Claude Code Install

From Claude Code, add the local marketplace and install the plugin:

```text
/plugin marketplace add .
/plugin install reflex-agent-toolkit@reflex-agent-toolkit
/reload-plugins
```

After publishing as `flexsurfer/reflex-agent-toolkit`:

```text
/plugin marketplace add flexsurfer/reflex-agent-toolkit
/plugin install reflex-agent-toolkit@reflex-agent-toolkit
/reload-plugins
```

For development without marketplace installation:

```bash
claude --plugin-dir ./plugins/reflex-agent-toolkit
```

## User Prompts

New project:

```text
Create a React/Vite site using Reflex (@flexsurfer/reflex).
```

Existing project:

```text
Migrate this app's state management to Reflex (@flexsurfer/reflex).
```

The plugin should steer the agent toward the Reflex skill, small source reads, MCP/index tools, and `dispatch_event` verification when DevTools is connected.

## Runtime Requirement

The plugin starts a version-pinned MCP bridge through `npx` for each Codex or Claude Code session. It is independent of the active project's `node_modules`, so one plugin installation works across projects.

For live app verification, each project still needs its own DevTools server. The setup skill adds this script when it is missing:

```json
{
  "scripts": {
    "devtools:mcp": "reflex-devtools --mcp --host 127.0.0.1 --port 4000"
  }
}
```

```bash
npm run devtools:mcp
```

The Reflex skill tells the agent to start this script from the project root when MCP tools are present but report no connected Reflex app. Codex/Claude may ask for approval because this is a long-running local process.

## Validate

This repository includes a dependency-free structure check:

```bash
npm run validate
```
