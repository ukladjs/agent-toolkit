import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'

const root = process.cwd()
const pluginRoot = path.join(root, 'plugins', 'reflex-agent-toolkit')
const mcpBridgePackage = '--package=@flexsurfer/reflex-devtools-mcp@0.1.12'
const requiredFiles = [
  '.agents/plugins/marketplace.json',
  '.claude-plugin/marketplace.json',
  'plugins/reflex-agent-toolkit/.codex-plugin/plugin.json',
  'plugins/reflex-agent-toolkit/.claude-plugin/plugin.json',
  'plugins/reflex-agent-toolkit/.mcp.json',
  'plugins/reflex-agent-toolkit/skills/reflex/SKILL.md',
  'plugins/reflex-agent-toolkit/skills/reflex/agents/openai.yaml',
  'plugins/reflex-agent-toolkit/skills/reflex/references/implementation.md',
  'plugins/reflex-agent-toolkit/skills/reflex/references/new-project.md',
  'plugins/reflex-agent-toolkit/skills/reflex/references/migrate-existing-state.md',
  'plugins/reflex-agent-toolkit/skills/reflex/references/setup.md',
  'plugins/reflex-agent-toolkit/skills/reflex/references/verification.md'
]

function readJson(relativePath) {
  const absolutePath = path.join(root, relativePath)
  return JSON.parse(fs.readFileSync(absolutePath, 'utf8'))
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message)
  }
}

for (const relativePath of requiredFiles) {
  assert(fs.existsSync(path.join(root, relativePath)), `Missing ${relativePath}`)
}

const codexManifest = readJson('plugins/reflex-agent-toolkit/.codex-plugin/plugin.json')
assert(codexManifest.name === 'reflex-agent-toolkit', 'Codex manifest name mismatch')
assert(codexManifest.skills === './skills/', 'Codex manifest must expose ./skills/')
assert(codexManifest.mcpServers === './.mcp.json', 'Codex manifest must point at ./.mcp.json')
assert(codexManifest.repository === 'https://github.com/flexsurfer/reflex-agent-toolkit', 'Codex manifest repository mismatch')

const claudeManifest = readJson('plugins/reflex-agent-toolkit/.claude-plugin/plugin.json')
assert(claudeManifest.name === 'reflex-agent-toolkit', 'Claude manifest name mismatch')
assert(claudeManifest.skills === './skills/', 'Claude manifest must expose ./skills/')
assert(claudeManifest.mcpServers === './.mcp.json', 'Claude manifest must point at ./.mcp.json')
assert(claudeManifest.repository === 'https://github.com/flexsurfer/reflex-agent-toolkit', 'Claude manifest repository mismatch')

const mcpConfig = readJson('plugins/reflex-agent-toolkit/.mcp.json')
const mcpServer = mcpConfig.mcpServers?.['reflex-devtools']
assert(mcpServer?.command === 'npx', 'MCP server must start with npx')
assert(
  Array.isArray(mcpServer.args) && mcpServer.args.includes(mcpBridgePackage),
  `MCP server args must pin ${mcpBridgePackage}`
)
assert(mcpServer.args.includes('reflex-devtools-mcp'), 'MCP server args must run the Reflex DevTools MCP binary')

const codexMarketplace = readJson('.agents/plugins/marketplace.json')
const codexEntry = codexMarketplace.plugins?.find((plugin) => plugin.name === 'reflex-agent-toolkit')
assert(codexEntry, 'Codex marketplace entry missing')
assert(codexEntry.source?.path === './plugins/reflex-agent-toolkit', 'Codex marketplace source path mismatch')
assert(fs.existsSync(path.join(root, codexEntry.source.path)), 'Codex marketplace source path does not exist')

const claudeMarketplace = readJson('.claude-plugin/marketplace.json')
const claudeEntry = claudeMarketplace.plugins?.find((plugin) => plugin.name === 'reflex-agent-toolkit')
assert(claudeEntry, 'Claude marketplace entry missing')
assert(claudeEntry.source === './plugins/reflex-agent-toolkit', 'Claude marketplace source path mismatch')
assert(fs.existsSync(path.join(root, claudeEntry.source)), 'Claude marketplace source path does not exist')

const skill = fs.readFileSync(path.join(pluginRoot, 'skills/reflex/SKILL.md'), 'utf8')
const skillInterface = fs.readFileSync(path.join(pluginRoot, 'skills/reflex/agents/openai.yaml'), 'utf8')
assert(skill.startsWith('---\n'), 'Skill frontmatter is missing')
assert(/\n---\n/.test(skill.slice(4)), 'Skill frontmatter is not closed')
assert(/^name: reflex$/m.test(skill), 'Skill frontmatter name must be reflex')
assert(/^description: .+/m.test(skill), 'Skill frontmatter description is missing')
assert(skill.includes('devtools:mcp'), 'Skill must tell agents how to start the project-local DevTools server')
assert(skill.includes('app_status'), 'Skill must start live verification with app_status')
assert(skill.includes('After a code/type check'), 'Skill must make MCP verification a conditional later stage')
for (const unavailableTool of ['get_reflex_map', 'find_state_changes', 'eval_sub']) {
  assert(!skill.includes(`\`${unavailableTool}\``), `Skill must not advertise unavailable MCP tool ${unavailableTool}`)
}
assert(/^interface:/m.test(skillInterface), 'Skill OpenAI interface metadata is missing')
assert(/^  display_name: "Reflex"$/m.test(skillInterface), 'Skill display name must be Reflex')
assert(/^  default_prompt: "Use \$reflex /m.test(skillInterface), 'Skill default prompt must invoke $reflex')

console.log('reflex-agent-toolkit validation ok')
