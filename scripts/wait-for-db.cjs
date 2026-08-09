const net = require('net')

const timeoutSeconds = Number(process.env.DB_WAIT_SECONDS || 60)
const intervalMs = 1000
const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  console.error('DATABASE_URL nao configurado; nao e possivel aguardar banco.')
  process.exit(1)
}

let parsed
try {
  parsed = new URL(databaseUrl)
} catch (error) {
  console.error('DATABASE_URL invalido.')
  process.exit(1)
}

const host = parsed.hostname
const port = Number(parsed.port || 5432)
const deadline = Date.now() + timeoutSeconds * 1000

function probe() {
  return new Promise((resolve) => {
    const socket = net.createConnection({ host, port })
    const done = (ok) => {
      socket.removeAllListeners()
      socket.destroy()
      resolve(ok)
    }
    socket.setTimeout(3000)
    socket.once('connect', () => done(true))
    socket.once('timeout', () => done(false))
    socket.once('error', () => done(false))
  })
}

async function main() {
  while (Date.now() < deadline) {
    if (await probe()) {
      console.log(`Banco acessivel em ${host}:${port}`)
      return
    }
    console.log(`Aguardando banco em ${host}:${port}...`)
    await new Promise((resolve) => setTimeout(resolve, intervalMs))
  }

  console.error(`Banco indisponivel apos ${timeoutSeconds}s em ${host}:${port}`)
  process.exit(1)
}

main()
