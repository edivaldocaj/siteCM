const fs = require('fs')
const dotenv = require('dotenv')

if (fs.existsSync('.env')) {
  dotenv.config({ path: '.env' })
}

const required = ['DATABASE_URL', 'PAYLOAD_SECRET', 'NEXT_PUBLIC_SITE_URL']
const recommended = ['CRON_SECRET', 'REVALIDATE_SECRET', 'NEXT_PUBLIC_WHATSAPP_NUMBER']

function mask(value) {
  if (!value) return ''
  if (value.length <= 8) return '********'
  return `${value.slice(0, 4)}...${value.slice(-4)}`
}

let hasError = false

console.log('Preflight de producao')
console.log('---------------------')

for (const name of required) {
  const value = process.env[name]
  if (!value) {
    hasError = true
    console.log(`ERRO  ${name}: ausente`)
  } else {
    console.log(`OK    ${name}: ${mask(value)}`)
  }
}

for (const name of recommended) {
  const value = process.env[name]
  if (!value) {
    console.log(`AVISO ${name}: ausente`)
  } else {
    console.log(`OK    ${name}: ${mask(value)}`)
  }
}

if (process.env.PAYLOAD_SECRET && process.env.PAYLOAD_SECRET.length < 32) {
  hasError = true
  console.log('ERRO  PAYLOAD_SECRET deve ter pelo menos 32 caracteres')
}

if (process.env.NEXT_PUBLIC_SITE_URL && !/^https:\/\//.test(process.env.NEXT_PUBLIC_SITE_URL)) {
  hasError = true
  console.log('ERRO  NEXT_PUBLIC_SITE_URL deve usar https:// em producao')
}

console.log('')
if (hasError) {
  console.log('Resultado: existem erros que devem ser corrigidos antes do deploy.')
  process.exit(1)
}

console.log('Resultado: variaveis minimas parecem prontas.')
console.log('Proximos comandos recomendados:')
console.log('  npm run payload -- migrate')
console.log('  npm run bootstrap:new-db')
console.log('  npm run build')
console.log('  curl -fsS "$NEXT_PUBLIC_SITE_URL/api/health"')
