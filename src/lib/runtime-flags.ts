export function shouldSkipPayloadDuringBuild() {
  return process.env.SKIP_DB_DURING_BUILD === 'true'
}
