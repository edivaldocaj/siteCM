# Cavalcante & Melo — Site Institucional

Site institucional da **Cavalcante & Melo Sociedade de Advogados** (Natal/RN).

**Stack:** Next.js 16 + Payload CMS 3.x + PostgreSQL 17 + Tailwind v4
**Deploy:** Docker via EasyPanel (repo: `github.com/edivaldocaj/siteCM.git`)

---

## Arquitetura de Dados

### Globals (editáveis no admin `/admin`)

| Global       | Slug          | O que controla                                                                 |
|--------------|---------------|--------------------------------------------------------------------------------|
| SiteConfig   | `site-config` | Títulos/subtítulos de TODAS as seções (Hero, Criminal, Campanhas, Depoimentos, Notícias, Blog, Sobre, Contato), TrustBar stats, timeline, valores |
| Homepage     | `homepage`    | Lista de sócios (nome, cargo, bio, foto, OAB)                                 |

### Collections

| Collection      | Slug              | Uso                                                           |
|-----------------|-------------------|---------------------------------------------------------------|
| Users           | `users`           | Usuários admin do Payload                                     |
| Media           | `media`           | Upload de imagens e vídeos                                    |
| Pages           | `pages`           | Páginas genéricas (uso futuro)                                |
| Posts           | `posts`           | Blog — artigos jurídicos                                      |
| Campaigns       | `campaigns`       | Campanhas jurídicas — landing pages + material para redes sociais |
| Testimonials    | `testimonials`    | Depoimentos de clientes                                       |
| PracticeAreas   | `practice-areas`  | Áreas de atuação                                              |
| NewsArticles    | `news-articles`   | Notícias jurídicas (importadas ou manuais)                    |
| Clients         | `clients`         | Portal do cliente (acesso via `/cliente`)                     |

### Fluxo de dados: Homepage

```
page.tsx (Server Component)
  │
  ├─ getPayload() → busca todos os dados
  │    ├─ findGlobal('site-config')  → títulos de todas as seções
  │    ├─ findGlobal('homepage')     → dados dos sócios
  │    ├─ find('campaigns')          → campanhas ativas
  │    ├─ find('testimonials')       → depoimentos
  │    ├─ find('posts')              → artigos recentes
  │    ├─ find('news-articles')      → notícias
  │    └─ find('practice-areas')     → áreas de atuação
  │
  └─ Renderiza componentes passando dados via props:
       HeroSection       ← siteConfig (heroTitle, heroSubtitle, heroButtonText)
       TrustBar           ← siteConfig.trustBarStats
       PracticeAreasGrid  ← practiceAreas[]
       CriminalUrgency    ← siteConfig (criminalTag, criminalTitle, etc.)
       AboutPartners      ← homepage.aboutPartners
       FeaturedCampaigns  ← campaigns[] + siteConfig (campaignsTitle, campaignsSubtitle)
       TestimonialsCarousel ← testimonials[] + siteConfig (testimonialsTitle)
       NewsSection        ← news[] + siteConfig (newsTitle, newsSubtitle)
       RecentPosts        ← posts[] + siteConfig (blogTitle, blogSubtitle)
       ContactCTA         ← siteConfig (contactTitle, contactSubtitle, contactEmail, etc.)
```

### Fluxo de dados: Página Sobre

```
sobre/page.tsx (Server Component)
  └─ AboutPageClient ← siteConfig + homepage
       ├─ Hero         ← siteConfig.aboutTitle, aboutSubtitle
       ├─ História     ← siteConfig.aboutHistory (texto livre)
       ├─ Timeline     ← siteConfig.aboutTimeline[] (array: year, title, description)
       ├─ Valores      ← siteConfig.aboutValues[] (array: icon, title, description)
       ├─ Sócios       ← homepage.aboutPartners.partnersList[]
       └─ Localização  ← siteConfig.contactAddress
```

### linkedCampaign (vinculação Notícia/Post → Campanha)

Os campos `linkedCampaign` em `Posts` e `NewsArticles` são **text** (slug da campanha).
O componente resolve tanto slug string quanto objeto populado pelo Payload:
```ts
const linkedCampaignSlug = typeof rawLinked === 'object' && rawLinked?.slug
  ? rawLinked.slug
  : typeof rawLinked === 'string' && rawLinked.length > 0
    ? rawLinked
    : null
```
Para funcionar, basta preencher o campo no admin com o slug exato da campanha (ex: `fraudes-bancarias`).

---

## Campanhas — Campos para Redes Sociais

Cada campanha agora tem uma aba **Redes Sociais** no admin com:

| Campo            | Tipo     | Descrição                                                |
|------------------|----------|----------------------------------------------------------|
| coverImage       | upload   | Imagem 1080×1080 para feed Instagram/Facebook            |
| storyImage       | upload   | Imagem 1080×1920 para Stories/Reels/TikTok               |
| videoUrl         | text     | URL de vídeo curto (YouTube/Vimeo embed)                 |
| videoFile        | upload   | Upload direto de vídeo MP4 (até 60s)                     |
| socialCaption    | textarea | Legenda pré-escrita para copiar nos posts                |
| socialHashtags   | text[]   | Hashtags sugeridas                                       |
| colorAccent      | select   | Cor de destaque dos cards (gold/red/blue/green)          |
| targetAudience   | textarea | Descrição do público-alvo para segmentação               |
| ogImage          | upload   | Imagem OpenGraph 1200×630 para previews de link          |

---

## Deploy (EasyPanel + Docker)

1. Push para `main` no GitHub
2. EasyPanel rebuilda automaticamente via Dockerfile
3. **Após cada deploy com mudanças no schema**, rodar no terminal Bash do EasyPanel:
   ```bash
   npx payload migrate:create <nome> && npx payload migrate
   ```
4. Variáveis de ambiente necessárias:
   - `DATABASE_URL` — connection string PostgreSQL
   - `PAYLOAD_SECRET` — secret do Payload
   - `NEXT_PUBLIC_WHATSAPP_NUMBER` — número WhatsApp (ex: `5584991243985`)

---

## Desenvolvimento Local

```bash
git clone https://github.com/edivaldocaj/siteCM.git
cd siteCM
npm install
cp test.env .env   # ajustar DATABASE_URL e PAYLOAD_SECRET
npm run dev
```

Admin: `http://localhost:3000/admin`
Site: `http://localhost:3000`

---

## Estrutura de Arquivos (principais)

```
src/
├── app/(frontend)/
│   ├── page.tsx                    # Homepage (Server Component)
│   ├── layout.tsx                  # Layout frontend
│   ├── sobre/
│   │   ├── page.tsx                # Sobre (Server Component)
│   │   └── AboutPageClient.tsx     # Sobre (Client Component)
│   ├── campanhas/
│   │   ├── page.tsx                # Lista de campanhas
│   │   └── [slug]/page.tsx         # Landing page individual
│   ├── blog/
│   ├── areas-de-atuacao/
│   ├── contato/
│   ├── cliente/                    # Portal do cliente (Datajud)
│   └── admin-tools/                # Ferramentas internas
├── components/
│   ├── sections/                   # Seções reutilizáveis
│   │   ├── HeroSection.tsx
│   │   ├── TrustBar.tsx
│   │   ├── PracticeAreasGrid.tsx
│   │   ├── CriminalUrgency.tsx     # ✅ Agora puxa do SiteConfig
│   │   ├── AboutPartners.tsx
│   │   ├── FeaturedCampaigns.tsx   # ✅ Agora puxa título do SiteConfig
│   │   ├── TestimonialsCarousel.tsx # ✅ Agora puxa título do SiteConfig
│   │   ├── NewsSection.tsx         # ✅ Agora puxa título do SiteConfig
│   │   ├── RecentPosts.tsx         # ✅ Agora puxa título do SiteConfig
│   │   └── ContactCTA.tsx          # ✅ Agora puxa dados de contato do SiteConfig
│   ├── layout/
│   └── ui/
├── collections/                    # Schemas Payload CMS
├── globals/                        # SiteConfig + Homepage
├── lib/                            # Utilitários (datajud, payload)
└── styles/
    └── globals.css                 # Tailwind v4 + variáveis da marca
```

---

## Paleta da Marca

| Token                    | Valor     | Uso                          |
|--------------------------|-----------|------------------------------|
| `--color-brand-navy`     | `#152138` | Fundo principal, textos      |
| `--color-brand-silver`   | `#b8bfc8` | Textos secundários           |
| `--color-brand-gold-dark`| `#c4a96a` | Destaques, CTAs, ícones      |
| `--color-brand-champagne`| `#f1eae2` | Headings sobre fundo escuro  |
| `--color-brand-cream`    | `#faf8f5` | Fundos claros de seção       |
