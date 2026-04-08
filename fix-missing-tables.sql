-- ============================================================
-- FIX: Tabelas que faltam no PostgreSQL
-- Executar via pgAdmin ou psql ANTES do deploy
-- Resolve: /admin não carrega após login
-- ============================================================

-- Leads
CREATE TABLE IF NOT EXISTS leads (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL,
  phone VARCHAR NOT NULL,
  email VARCHAR,
  cpf VARCHAR,
  source VARCHAR DEFAULT 'contact-form',
  campaign_slug VARCHAR,
  utm_source VARCHAR,
  utm_medium VARCHAR,
  utm_campaign VARCHAR,
  utm_content VARCHAR,
  referrer_url VARCHAR,
  case_description TEXT,
  estimated_value NUMERIC,
  urgency VARCHAR DEFAULT 'medium',
  qualification_answers JSONB DEFAULT '[]'::jsonb,
  status VARCHAR DEFAULT 'new' NOT NULL,
  score NUMERIC DEFAULT 0,
  assigned_to VARCHAR,
  lost_reason VARCHAR,
  notes JSONB DEFAULT '[]'::jsonb,
  next_follow_up TIMESTAMPTZ,
  converted_to_client_id INTEGER,
  conversion_date TIMESTAMPTZ,
  contract_value NUMERIC,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Campaign Events
CREATE TABLE IF NOT EXISTS campaign_events (
  id SERIAL PRIMARY KEY,
  campaign_slug VARCHAR NOT NULL,
  event_type VARCHAR NOT NULL,
  utm_source VARCHAR,
  utm_medium VARCHAR,
  utm_campaign VARCHAR,
  referrer VARCHAR,
  user_agent VARCHAR,
  metadata JSONB,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Client Documents
CREATE TABLE IF NOT EXISTS client_documents (
  id SERIAL PRIMARY KEY,
  title VARCHAR NOT NULL,
  client_id INTEGER,
  client_name VARCHAR,
  process_number VARCHAR,
  document_type VARCHAR DEFAULT 'other',
  file_id INTEGER,
  uploaded_by VARCHAR DEFAULT 'attorney',
  visibility VARCHAR DEFAULT 'client-visible',
  notes TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- NPS Responses
CREATE TABLE IF NOT EXISTS nps_responses (
  id SERIAL PRIMARY KEY,
  client_id INTEGER,
  client_name VARCHAR,
  score INTEGER NOT NULL,
  feedback TEXT,
  process_number VARCHAR,
  attorney VARCHAR,
  status VARCHAR DEFAULT 'pending',
  testimonial_text TEXT,
  testimonial_approved BOOLEAN DEFAULT false,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Deadlines
CREATE TABLE IF NOT EXISTS deadlines (
  id SERIAL PRIMARY KEY,
  title VARCHAR NOT NULL,
  client_id INTEGER,
  client_name VARCHAR,
  process_number VARCHAR,
  deadline_date TIMESTAMPTZ NOT NULL,
  deadline_type VARCHAR DEFAULT 'other',
  attorney VARCHAR,
  status VARCHAR DEFAULT 'pending',
  priority VARCHAR DEFAULT 'normal',
  notes TEXT,
  alert_sent_7d BOOLEAN DEFAULT false,
  alert_sent_3d BOOLEAN DEFAULT false,
  alert_sent_1d BOOLEAN DEFAULT false,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Jurisprudence
CREATE TABLE IF NOT EXISTS jurisprudence (
  id SERIAL PRIMARY KEY,
  title VARCHAR NOT NULL,
  court VARCHAR NOT NULL,
  case_number VARCHAR,
  category VARCHAR,
  summary TEXT,
  full_text TEXT,
  decision_date TIMESTAMPTZ,
  relevance VARCHAR DEFAULT 'medium',
  tags JSONB DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_campaign ON leads(campaign_slug);
CREATE INDEX IF NOT EXISTS idx_campaign_events_slug ON campaign_events(campaign_slug);
CREATE INDEX IF NOT EXISTS idx_deadlines_date ON deadlines(deadline_date);
CREATE INDEX IF NOT EXISTS idx_deadlines_status ON deadlines(status);

-- Verificação
SELECT 'leads' as tabela, COUNT(*) FROM leads
UNION ALL SELECT 'campaign_events', COUNT(*) FROM campaign_events
UNION ALL SELECT 'client_documents', COUNT(*) FROM client_documents
UNION ALL SELECT 'nps_responses', COUNT(*) FROM nps_responses
UNION ALL SELECT 'deadlines', COUNT(*) FROM deadlines
UNION ALL SELECT 'jurisprudence', COUNT(*) FROM jurisprudence;
