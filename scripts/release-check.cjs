const fs = require('fs')
const { spawnSync } = require('child_process')

const forbiddenPatterns = [
  new RegExp(['LtH', '77MI'].join(''), 'i'),
  new RegExp(['Feli', '1008'].join(''), 'i'),
  new RegExp(`postgres:\/\/postgres:[^@\s]+@${['cavalcante', 'albuquerque', 'postgres', 'ca'].join('_')}`, 'i'),
]

function scanTrackedTextFiles() {
  const result = spawnSync('git', ['ls-files'], { encoding: 'utf8', shell: process.platform === 'win32' })
  if (result.status !== 0) return

  const files = result.stdout.split(/\r?\n/).filter(Boolean)
  for (const file of files) {
    if (/\.(png|jpg|jpeg|ico|webp|zip|dump|pdf)$/i.test(file)) continue
    if (!fs.existsSync(file)) continue
    const text = fs.readFileSync(file, 'utf8')
    for (const pattern of forbiddenPatterns) {
      if (pattern.test(text)) {
        console.error(`Possivel segredo encontrado em arquivo versionado: ${file}`)
        process.exit(1)
      }
    }
  }
}

console.log('\n== Secret scan ==')
scanTrackedTextFiles()

const steps = [
  ['Preflight', 'npm', ['run', 'preflight:production']],
  ['TypeScript', 'npx', ['tsc', '--noEmit']],
  ['Check wait-for-db', 'node', ['--check', 'scripts/wait-for-db.cjs']],
  ['Check build-preserve-seed', 'node', ['--check', 'scripts/build-preserve-seed.cjs']],
  ['Check production-preflight', 'node', ['--check', 'scripts/production-preflight.cjs']],
  ['Build', 'npm', ['run', 'build']],
]

for (const [label, command, args] of steps) {
  console.log(`\n== ${label} ==`)
  const env = label === 'Build' ? { ...process.env, SKIP_DB_DURING_BUILD: 'true' } : process.env
  const result = spawnSync(command, args, { stdio: 'inherit', shell: process.platform === 'win32', env })
  if (result.status !== 0) {
    console.error(`\nFalhou: ${label}`)
    process.exit(result.status || 1)
  }
}

console.log('\nRelease check concluido.')
