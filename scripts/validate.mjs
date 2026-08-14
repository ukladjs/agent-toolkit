import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'

const root = process.cwd()
const pluginRoot = path.join(root, 'plugins', 'uklad-agent-toolkit')
const skillRoot = path.join(pluginRoot, 'skills', 'uklad')
const versions = readJson('versions.json')
const mcpBridgePackage = `--package=@ukladjs/devtools-mcp@${versions.packages['@ukladjs/devtools-mcp']}`
const referenceFiles = [
  'architecture.md',
  'events-effects.md',
  'migrate-existing-state.md',
  'new-project.md',
  'server-state.md',
  'setup.md',
  'subscriptions.md',
  'verification.md'
]
const requiredFiles = [
  '.agents/plugins/marketplace.json',
  '.claude-plugin/marketplace.json',
  'versions.json',
  'plugins/uklad-agent-toolkit/.codex-plugin/plugin.json',
  'plugins/uklad-agent-toolkit/.claude-plugin/plugin.json',
  'plugins/uklad-agent-toolkit/.mcp.json',
  'plugins/uklad-agent-toolkit/skills/uklad/SKILL.md',
  'plugins/uklad-agent-toolkit/skills/uklad/agents/openai.yaml',
  ...referenceFiles.map((file) => `plugins/uklad-agent-toolkit/skills/uklad/references/${file}`)
]

function readJson(relativePath) {
  return JSON.parse(readText(relativePath))
}

function readText(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8')
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message)
  }
}

function lineCount(text) {
  return text.split('\n').length
}

for (const relativePath of requiredFiles) {
  assert(fs.existsSync(path.join(root, relativePath)), `Missing ${relativePath}`)
}

const discoveredReferenceFiles = fs
  .readdirSync(path.join(skillRoot, 'references'))
  .filter((file) => file.endsWith('.md'))
  .sort()
assert(
  JSON.stringify(discoveredReferenceFiles) === JSON.stringify([...referenceFiles].sort()),
  'Skill references must contain only the routed progressive-disclosure files'
)

const codexManifest = readJson('plugins/uklad-agent-toolkit/.codex-plugin/plugin.json')
assert(codexManifest.name === 'uklad-agent-toolkit', 'Codex manifest name mismatch')
assert(codexManifest.skills === './skills/', 'Codex manifest must expose ./skills/')
assert(codexManifest.mcpServers === './.mcp.json', 'Codex manifest must point at ./.mcp.json')
assert(codexManifest.repository === 'https://github.com/ukladjs/agent-toolkit', 'Codex manifest repository mismatch')
assert(codexManifest.version === versions.plugin, 'Codex manifest version mismatch')

const claudeManifest = readJson('plugins/uklad-agent-toolkit/.claude-plugin/plugin.json')
assert(claudeManifest.name === 'uklad-agent-toolkit', 'Claude manifest name mismatch')
assert(claudeManifest.skills === './skills/', 'Claude manifest must expose ./skills/')
assert(claudeManifest.mcpServers === './.mcp.json', 'Claude manifest must point at ./.mcp.json')
assert(claudeManifest.repository === 'https://github.com/ukladjs/agent-toolkit', 'Claude manifest repository mismatch')
assert(claudeManifest.version === versions.plugin, 'Claude manifest version mismatch')

const rootPackage = readJson('package.json')
assert(rootPackage.version === versions.plugin, 'Root package version mismatch')

const mcpConfig = readJson('plugins/uklad-agent-toolkit/.mcp.json')
const mcpServer = mcpConfig.mcpServers?.['uklad-devtools']
assert(mcpServer?.command === 'npx', 'MCP server must start with npx')
assert(
  Array.isArray(mcpServer.args) && mcpServer.args.includes(mcpBridgePackage),
  `MCP server args must pin published ${mcpBridgePackage}`
)
assert(mcpServer.args.includes('uklad-devtools-mcp'), 'MCP server args must run the Uklad DevTools MCP binary')

const codexMarketplace = readJson('.agents/plugins/marketplace.json')
const codexEntry = codexMarketplace.plugins?.find((plugin) => plugin.name === 'uklad-agent-toolkit')
assert(codexEntry, 'Codex marketplace entry missing')
assert(codexEntry.source?.path === './plugins/uklad-agent-toolkit', 'Codex marketplace source path mismatch')
assert(fs.existsSync(path.join(root, codexEntry.source.path)), 'Codex marketplace source path does not exist')

const claudeMarketplace = readJson('.claude-plugin/marketplace.json')
const claudeEntry = claudeMarketplace.plugins?.find((plugin) => plugin.name === 'uklad-agent-toolkit')
assert(claudeEntry, 'Claude marketplace entry missing')
assert(claudeEntry.source === './plugins/uklad-agent-toolkit', 'Claude marketplace source path mismatch')
assert(fs.existsSync(path.join(root, claudeEntry.source)), 'Claude marketplace source path does not exist')
assert(claudeEntry.version === versions.plugin, 'Claude marketplace version mismatch')

const skillRelativePath = 'plugins/uklad-agent-toolkit/skills/uklad/SKILL.md'
const skill = readText(skillRelativePath)
const frontmatter = skill.match(/^---\n([\s\S]*?)\n---\n/)
assert(frontmatter, 'Skill frontmatter is missing or malformed')
const frontmatterKeys = [...frontmatter[1].matchAll(/^([a-z_]+):/gm)].map((match) => match[1])
assert(
  JSON.stringify(frontmatterKeys) === JSON.stringify(['name', 'description']),
  'Skill frontmatter must contain only name and description'
)
assert(/^name: uklad$/m.test(frontmatter[1]), 'Skill frontmatter name must be uklad')
assert(/^description: .+/m.test(frontmatter[1]), 'Skill frontmatter description is missing')
assert(lineCount(skill) <= 80, 'SKILL.md must remain a compact router (80 lines or fewer)')

const referenceTexts = new Map(
  referenceFiles.map((file) => [
    file,
    readText(`plugins/uklad-agent-toolkit/skills/uklad/references/${file}`)
  ])
)
for (const [file, contents] of referenceTexts) {
  assert(lineCount(contents) <= 100, `${file} exceeds the 100-line progressive-disclosure budget`)
}

const skillReferenceLinks = [...skill.matchAll(/\]\(references\/([^#)]+\.md)(?:#[^)]+)?\)/g)].map(
  (match) => match[1]
)
assert(
  JSON.stringify(skillReferenceLinks.sort()) === JSON.stringify([...referenceFiles].sort()),
  'SKILL.md must link each reference exactly once'
)

const skillDocuments = [
  [skillRelativePath, skill],
  ...referenceFiles.map((file) => [
    `plugins/uklad-agent-toolkit/skills/uklad/references/${file}`,
    referenceTexts.get(file)
  ])
]
for (const [relativePath, contents] of skillDocuments) {
  for (const match of contents.matchAll(/\]\(([^)]+\.md)(?:#[^)]+)?\)/g)) {
    if (/^https?:\/\//.test(match[1])) continue
    const target = path.resolve(path.dirname(path.join(root, relativePath)), match[1])
    assert(fs.existsSync(target), `Broken Markdown link in ${relativePath}: ${match[1]}`)
  }
}

const allSkillText = skillDocuments.map(([, contents]) => contents).join('\n')
for (const legacyPattern of [
  'src/state/',
  'event-ids.ts',
  'effect-ids.ts',
  'sub-ids.ts',
  'payload-maps',
  'AppDb',
  'draftDb',
  'enableTracing'
]) {
  assert(!allSkillText.includes(legacyPattern), `Skill must not teach legacy pattern ${legacyPattern}`)
}

const architecture = referenceTexts.get('architecture.md')
for (const requiredTerm of [
  'catalog.ts -> contracts.ts',
  'stateKeys',
  'appIds',
  'AppContracts',
  'regRootSub',
  'one reactive graph',
  'Flat Reactive Roots',
  'Runtime-Owned Data'
]) {
  assert(architecture.includes(requiredTerm), `Architecture reference is missing ${requiredTerm}`)
}

const events = referenceTexts.get('events-effects.md')
for (const requiredTerm of [
  'Never call `dispatch`',
  'promise or thenable',
  'platform/<target>',
  'regEffect',
  'regCoeffect',
  'current()',
  'External Ingress'
]) {
  assert(events.includes(requiredTerm), `Events/effects reference is missing ${requiredTerm}`)
}

const subscriptions = referenceTexts.get('subscriptions.md')
for (const requiredTerm of [
  'fixed-length parameter tuple',
  'finite `number`',
  'equalityCheck',
  'shallowEqual',
  'view-ready'
]) {
  assert(subscriptions.includes(requiredTerm), `Subscriptions reference is missing ${requiredTerm}`)
}

const serverState = referenceTexts.get('server-state.md')
for (const requiredTerm of [
  'npm install @ukladjs/tanstack-query @tanstack/query-core',
  'attachQueryClient',
  'regQuerySub',
  'regSubExt',
  'passive',
  'QuerySnapshot',
  'platform/<target>/queries.ts'
]) {
  assert(serverState.includes(requiredTerm), `Server-state reference is missing ${requiredTerm}`)
}

const setup = referenceTexts.get('setup.md')
for (const requiredTerm of [
  `@ukladjs/devtools-mcp@${versions.packages['@ukladjs/devtools-mcp']}`,
  'npm install @ukladjs/core',
  'npm install -D @ukladjs/devtools',
  'npm install @ukladjs/persist',
  'npm install @ukladjs/tanstack-query @tanstack/query-core',
  'devtools:mcp',
  'createUkladInspector',
  "operations: { evidence: { stateChanges: 'patches' } }",
  '--allow-origin',
  '--allow-dispatch',
  'inspection-only',
  'Node.js 22'
]) {
  assert(setup.includes(requiredTerm), `Setup reference is missing ${requiredTerm}`)
}

const verification = referenceTexts.get('verification.md')
for (const requiredTerm of [
  'app_status',
  'get_state',
  'eval_sub',
  'dispatch_and_wait',
  'dispatch_event',
  'CAPABILITY_DENIED',
  'sessionEpoch'
]) {
  assert(verification.includes(requiredTerm), `Verification reference is missing ${requiredTerm}`)
}
assert(skill.includes('Use only tools and capabilities advertised'), 'Skill must make DevTools use capability-driven')
assert(
  referenceTexts.get('new-project.md').includes('npm install @ukladjs/core'),
  'New-project setup must install the current core package'
)

const skillInterface = readText('plugins/uklad-agent-toolkit/skills/uklad/agents/openai.yaml')
assert(/^interface:/m.test(skillInterface), 'Skill OpenAI interface metadata is missing')
assert(/^  display_name: "Uklad"$/m.test(skillInterface), 'Skill display name must be Uklad')
assert(
  /^  short_description: "Build canonical Uklad apps with focused context\."$/m.test(skillInterface),
  'Skill short description is stale'
)
assert(/^  default_prompt: "Use \$uklad /m.test(skillInterface), 'Skill default prompt must invoke $uklad')

console.log('uklad-agent-toolkit validation ok')
