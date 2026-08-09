const fs = require('fs')
const { spawnSync } = require('child_process')

const forbiddenPatterns = [
  /LtH77MI/i,
  /Feli1008/i,
  /postgres:\/\/postgres:[^@\s]+@cavalcante_albuquerque_postgres_ca/i,
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
  const result = spawnSync(command, args, { stdio: 'inherit', shell: process.platform === 'win32' })
  if (result.status !== 0) {
    console.error(`\nFalhou: ${label}`)
    process.exit(result.status || 1)
  }
}

console.log('\nRelease check concluido.')
