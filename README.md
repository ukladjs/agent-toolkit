# Reflex Agent Toolkit

Standalone marketplace repository for the Reflex agent plugin. While this folder still lives inside the Reflex library repo, it is already structured so it can be copied to its own repository without changing paths.

## What It Contains

- `plugins/reflex-agent-toolkit/.codex-plugin/plugin.json`: Codex plugin manifest.
- `plugins/reflex-agent-toolkit/.claude-plugin/plugin.json`: Claude Code plugin manifest.
- `plugins/reflex-agent-toolkit/.mcp.json`: shared Reflex DevTools MCP server config.
- `plugins/reflex-agent-toolkit/skills/reflex/SKILL.md`: compact Reflex workflow skill.
- `plugins/reflex-agent-toolkit/skills/reflex/references/`: progressive-disclosure workflows for new projects, migrations, setup, and verification.
- `.agents/plugins/marketplace.json`: Codex local marketplace catalog.
- `.claude-plugin/marketplace.json`: Claude Code local marketplace catalog.

## Local Codex Install

From this repository root:

```bash
codex plugin marketplace add .
codex plugin add reflex-agent-toolkit@reflex-agent-toolkit
```

From the parent `reflex` repository before this folder is split out:

```bash
codex plugin marketplace add ./reflex-agent-toolkit
codex plugin add reflex-agent-toolkit@reflex-agent-toolkit
```

After publishing this folder as `flexsurfer/reflex-agent-toolkit`:

```bash
codex plugin marketplace add flexsurfer/reflex-agent-toolkit
codex plugin add reflex-agent-toolkit@reflex-agent-toolkit
```

## Local Claude Code Install

From Claude Code, add the local marketplace and install the plugin:

```text
/plugin marketplace add .
/plugin install reflex-agent-toolkit@reflex-agent-toolkit
/reload-plugins
```

From the parent `reflex` repository before this folder is split out:

```text
/plugin marketplace add ./reflex-agent-toolkit
/plugin install reflex-agent-toolkit@reflex-agent-toolkit
/reload-plugins
```

After publishing this folder as `flexsurfer/reflex-agent-toolkit`:

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
Create a React/Vite site using Reflex.
```

Existing project:

```text
Migrate this app's state management to Reflex.
```

The plugin should steer the agent toward the Reflex skill, small source reads, MCP/index tools, and `dispatch_event` verification when DevTools is connected.

## Runtime Requirement

The plugin configures the MCP client side. For live app verification, the project still needs Reflex DevTools running with MCP enabled:

```bash
npx reflex-devtools --mcp
```

The Reflex skill tells the agent to start this command from the project root when MCP tools are present but report no connected Reflex app. Codex/Claude may ask for approval because this is a long-running local process.

## Validate

This repository includes a dependency-free structure check:

```bash
npm run validate
```
