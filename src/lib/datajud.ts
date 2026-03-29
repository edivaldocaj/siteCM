const DATAJUD_BASE = 'https://api-publica.datajud.cnj.jus.br'
const API_KEY = process.env.DATAJUD_API_KEY || 'cDZHYzlZa0JadVREZDJCendQbXY6SkJlTzNjLV9TRENyQk1RdnFKZGRQdw=='

const TRIBUNAL_ENDPOINTS: Record<string, string> = {
  tjrn: 'api_publica_tjrn',
  trt21: 'api_publica_trt21',
  trf5: 'api_publica_trf5',
  stj: 'api_publica_stj',
  stf: 'api_publica_stf',
  // Adicione mais conforme necessário
}

export interface ProcessMovement {
  nome: string
  dataHora: string
  complemento?: string
}

export interface ProcessData {
  numeroProcesso: string
  classe: { nome: string; codigo: number }
  sistema: { nome: string }
  formato: { nome: string }
  tribunal: string
  dataAjuizamento: string
  grau: string
  nivelSigilo?: number
  orgaoJulgador: { nome: string; codigoMunicipioIBGE?: number }
  assuntos: Array<{ nome: string; codigo: number }>
  movimentos: ProcessMovement[]
  dataHoraUltimaAtualizacao?: string
}

export async function searchProcessByNumber(processNumber: string, tribunal?: string): Promise<ProcessData | null> {
  // Remove formatação: pontos, traços, espaços
  const cleanNumber = processNumber.replace(/[.\-\s]/g, '')

  // Se tribunal especificado, busca só nele. Senão, tenta TJRN, TRT21, TRF5
  const tribunals = tribunal && TRIBUNAL_ENDPOINTS[tribunal]
    ? [tribunal]
    : ['tjrn', 'trt21', 'trf5']

  for (const trib of tribunals) {
    const endpoint = TRIBUNAL_ENDPOINTS[trib]
    if (!endpoint) continue

    try {
      const res = await fetch(`${DATAJUD_BASE}/${endpoint}/_search`, {
        method: 'POST',
        headers: {
          'Authorization': `APIKey ${API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: {
            match: {
              numeroProcesso: cleanNumber,
            },
          },
          size: 1,
        }),
      })

      if (!res.ok) continue

      const data = await res.json()

      if (data.hits?.hits?.length > 0) {
        const source = data.hits.hits[0]._source
        return {
          ...source,
          tribunal: trib.toUpperCase(),
          movimentos: (source.movimentos || []).sort(
            (a: any, b: any) => new Date(b.dataHora).getTime() - new Date(a.dataHora).getTime()
          ),
        }
      }
    } catch (e) {
      console.error(`[Datajud] Error fetching from ${trib}:`, e)
    }
  }

  return null
}

export async function searchProcessesByCPF(cpf: string, tribunals?: string[]): Promise<ProcessData[]> {
  // A API pública do Datajud NÃO permite busca por CPF diretamente (dados de partes são protegidos)
  // Esta função retorna os processos cadastrados no CMS para o CPF informado
  // A busca real é feita pelo número do processo via searchProcessByNumber
  return []
}

export function formatProcessNumber(num: string): string {
  // Formato CNJ: NNNNNNN-DD.AAAA.J.TR.OOOO
  const clean = num.replace(/\D/g, '').padStart(20, '0')
  return `${clean.slice(0, 7)}-${clean.slice(7, 9)}.${clean.slice(9, 13)}.${clean.slice(13, 14)}.${clean.slice(14, 16)}.${clean.slice(16, 20)}`
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
