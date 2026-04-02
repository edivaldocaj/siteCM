# Cavalcante & Melo — Site Institucional

Site institucional do escritório **Cavalcante & Melo Sociedade de Advogados** (Natal/RN), construído com **Next.js 16** + **Payload CMS 3.80** + **PostgreSQL 17**.

## Stack Técnica

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 16.2.1 (App Router) |
| CMS | Payload CMS 3.80 (headless, integrado) |
| Banco de Dados | PostgreSQL 17 |
| Estilo | Tailwind CSS v4 (inline `@theme`) |
| Animações | CSS nativo |
| Ícones | Lucide React |
| Hospedagem | EasyPanel (Docker) |
| Tipografia | Playfair Display + Source Sans 3 |

## Paleta de Cores

| Token | Hex | Uso |
|---|---|---|
| `brand-navy` | `#152138` | Fundo principal, header, cards escuros |
| `brand-navy-light` | `#1c2d4a` | Gradientes |
| `brand-silver` | `#b8bfc8` | Texto secundário |
| `brand-champagne` | `#f1eae2` | Texto claro sobre navy, TrustBar bg |
| `brand-gold` | `#ede1c3` | Acentos suaves |
| `brand-gold-dark` | `#c4a96a` | CTAs, destaques, ícones |
| `brand-cream` | `#faf8f5` | Fundo seções claras |
| `brand-urgency` | `#7a1b1b` | Badge criminal 24h |

## Estrutura do Projeto

```
src/
├── app/
│   ├── (frontend)/          # Rotas públicas do site
│   │   ├── page.tsx          # Homepage (Server Component com dados CMS)
│   │   ├── layout.tsx        # Layout frontend (Header, Footer, fonts)
│   │   ├── sobre/            # Página institucional
│   │   ├── areas-de-atuacao/ # Áreas de atuação (listagem + [slug])
│   │   ├── campanhas/        # Campanhas jurídicas (listagem + [slug])
│   │   ├── blog/             # Blog jurídico (listagem + [slug])
│   │   ├── contato/          # Formulário de contato
│   │   ├── cliente/          # Portal do cliente (Datajud)
│   │   └── admin-tools/      # Ferramentas administrativas
│   ├── (payload)/            # Admin Payload CMS (/admin)
│   └── api/                  # API Routes (contato, datajud, revalidate)
├── collections/              # Coleções Payload CMS
│   ├── Users.ts
│   ├── Media.ts
│   ├── Pages.ts
│   ├── Posts.ts
│   ├── Campaigns.ts
│   ├── Testimonials.ts
│   ├── PracticeAreas.ts
│   ├── NewsArticles.ts
│   └── Clients.ts
├── globals/                  # Globals Payload CMS
│   ├── Homepage.ts           # Gestão dos sócios (foto, bio, OAB)
│   └── SiteConfig.ts         # Textos do hero, TrustBar, contato, SEO
├── components/
│   ├── sections/             # Seções da homepage
│   │   ├── HeroSection.tsx
│   │   ├── TrustBar.tsx
│   │   ├── PracticeAreasGrid.tsx
│   │   ├── CriminalUrgency.tsx
│   │   ├── AboutPartners.tsx
│   │   ├── FeaturedCampaigns.tsx
│   │   ├── TestimonialsCarousel.tsx
│   │   ├── NewsSection.tsx
│   │   ├── RecentPosts.tsx
│   │   └── ContactCTA.tsx
│   ├── layout/
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   └── ui/
│       ├── WhatsAppButton.tsx
│       └── CookieConsent.tsx
├── lib/
│   ├── datajud.ts            # Integração CNJ Datajud API
│   └── payload.ts
├── styles/
│   └── globals.css           # Tailwind v4 + classes utilitárias
└── payload.config.ts         # Configuração central Payload CMS
```

## Seções da Homepage

Todas as seções da homepage são dinâmicas — puxam dados do Payload CMS quando disponíveis e usam dados estáticos como fallback:

1. **HeroSection** — Título, subtítulo e CTA editáveis via `SiteConfig` global. Design com pattern geométrico SVG, gradiente navy e dois botões (WhatsApp + Agendar Consulta).

2. **TrustBar** — Contadores animados (Anos de Experiência, Clientes Atendidos, Áreas de Atuação, Satisfação). Editável via `SiteConfig > Números em Destaque`. Fundo champagne com animação de contagem ao scroll.

3. **PracticeAreasGrid** — Grid de áreas de atuação da collection `PracticeAreas`. O card de Direito Penal aparece em fundo navy (destaque) com badge "24h".

4. **CriminalUrgency** — Seção de defesa criminal urgente em duas colunas (navy-dark). Glass-cards com features (Atendimento 24h, Habeas Corpus, Acolhimento). Barra superior com gradiente urgency/gold.

5. **AboutPartners** — Sócios fundadores com círculo de iniciais (gradient-navy + text-silver-gradient), pills de áreas de atuação, biografia. Editável via `Homepage > Sobre os Sócios`. Suporta foto CMS se cadastrada.

6. **FeaturedCampaigns** — Campanhas jurídicas ativas da collection `Campaigns` (filtro `status: active` + `featuredOnHomepage: true`). Cards com ícone, categoria, subtítulo e CTA.

7. **TestimonialsCarousel** — Carrossel de depoimentos da collection `Testimonials`. Glass-card com stars, ícone Quote decorativo, dots de navegação.

8. **NewsSection** — Notícias jurídicas da collection `NewsArticles`. Suporta links externos (com ícone ExternalLink).

9. **RecentPosts** — Posts recentes do blog da collection `Posts`. Cards com imagem placeholder CM, categoria, tempo de leitura, autor.

10. **ContactCTA** — Formulário completo (nome, telefone, assunto, mensagem) + informações de contato + WhatsApp CTA. Duas colunas em desktop.

## Padrão de Acesso ao Payload CMS

**Importante:** Todo acesso ao Payload DEVE ser feito diretamente em Server Components:

```tsx
import { getPayload } from 'payload'
import configPromise from '@payload-config'

const payload = await getPayload({ config: configPromise })
const result = await payload.find({ collection: 'posts', limit: 10 })
```

**NÃO** usar `src/lib/payload.ts` como helper — importar `getPayload` e `@payload-config` diretamente.

## Variáveis de Ambiente

```env
# Banco de dados
DATABASE_URL=postgresql://postgres:SENHA@HOST:5432/cavalcantemelo

# Payload CMS
PAYLOAD_SECRET=sua-chave-secreta-aqui

# Site
NEXT_PUBLIC_SITE_URL=https://cavalcantemelo.adv.br
NEXT_PUBLIC_WHATSAPP_NUMBER=5584991243985
NEXT_PUBLIC_WHATSAPP_MESSAGE=Olá! Gostaria de falar com um advogado.

# Google Analytics (opcional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Datajud API (Portal do Cliente)
DATAJUD_API_KEY=sua-chave-datajud
```

## Desenvolvimento Local

```bash
# Instalar dependências
pnpm install

# Rodar em modo dev
pnpm dev

# Build de produção
pnpm build

# Gerar tipos TypeScript do Payload
pnpm generate:types
```

## Deploy (EasyPanel / Docker)

O projeto roda em EasyPanel com Docker. O build inclui:

```bash
pnpm build   # Gera importMap + build Next.js
pnpm start   # Inicia o servidor de produção
```

Migrations do Payload rodam manualmente via console Bash do EasyPanel.

## Collections do CMS

| Collection | Slug | Uso |
|---|---|---|
| Users | `users` | Administradores do CMS |
| Media | `media` | Uploads (fotos, documentos) |
| Pages | `pages` | Páginas genéricas |
| Posts | `posts` | Blog jurídico |
| Campaigns | `campaigns` | Campanhas jurídicas |
| Testimonials | `testimonials` | Depoimentos de clientes |
| PracticeAreas | `practice-areas` | Áreas de atuação |
| NewsArticles | `news-articles` | Notícias jurídicas |
| Clients | `clients` | Clientes (portal) |

## Globals do CMS

| Global | Slug | Uso |
|---|---|---|
| Homepage | `homepage` | Gestão dos sócios (foto, bio, áreas) |
| SiteConfig | `site-config` | Textos do hero, TrustBar, contato, about, áreas |

## Licença

Projeto privado — © 2025 Cavalcante & Melo Sociedade de Advogados. Todos os direitos reservados.
