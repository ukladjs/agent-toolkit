import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'

const root = process.cwd()
const pluginRoot = path.join(root, 'plugins', 'reflex-agent-toolkit')
const requiredFiles = [
  '.agents/plugins/marketplace.json',
  '.claude-plugin/marketplace.json',
  'plugins/reflex-agent-toolkit/.codex-plugin/plugin.json',
  'plugins/reflex-agent-toolkit/.claude-plugin/plugin.json',
  'plugins/reflex-agent-toolkit/.mcp.json',
  'plugins/reflex-agent-toolkit/skills/reflex/SKILL.md',
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

const claudeManifest = readJson('plugins/reflex-agent-toolkit/.claude-plugin/plugin.json')
assert(claudeManifest.name === 'reflex-agent-toolkit', 'Claude manifest name mismatch')
assert(claudeManifest.skills === './skills/', 'Claude manifest must expose ./skills/')
assert(claudeManifest.mcpServers === './.mcp.json', 'Claude manifest must point at ./.mcp.json')

const mcpConfig = readJson('plugins/reflex-agent-toolkit/.mcp.json')
const mcpServer = mcpConfig.mcpServers?.['reflex-devtools']
assert(mcpServer?.command === 'npx', 'MCP server must start with npx')
assert(
  Array.isArray(mcpServer.args) && mcpServer.args.includes('@flexsurfer/reflex-devtools-mcp'),
  'MCP server args must include @flexsurfer/reflex-devtools-mcp'
)

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
assert(skill.startsWith('---\n'), 'Skill frontmatter is missing')
assert(/\n---\n/.test(skill.slice(4)), 'Skill frontmatter is not closed')
assert(/^name: reflex$/m.test(skill), 'Skill frontmatter name must be reflex')
assert(/^description: .+/m.test(skill), 'Skill frontmatter description is missing')
assert(skill.includes('npx reflex-devtools --mcp'), 'Skill must tell agents how to start the app-side DevTools server')

console.log('reflex-agent-toolkit validation ok')
