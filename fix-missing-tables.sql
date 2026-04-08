-- ============================================================
-- Payload 3.80 + @payloadcms/db-postgres (Drizzle ORM)
-- Cria tabelas para as novas collections
-- Executar via pgAdmin → Query Tool ou terminal psql
-- ============================================================

-- ============================================================
-- 1. LEADS (slug: 'leads')
-- ============================================================
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
  case_description VARCHAR,
  estimated_value NUMERIC,
  urgency VARCHAR DEFAULT 'medium',
  status VARCHAR DEFAULT 'new' NOT NULL,
  score NUMERIC DEFAULT 0,
  assigned_to VARCHAR,
  lost_reason VARCHAR,
  next_follow_up TIMESTAMPTZ,
  converted_to_client_id INTEGER,
  conversion_date TIMESTAMPTZ,
  contract_value NUMERIC,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Array field: qualificationAnswers
CREATE TABLE IF NOT EXISTS leads_qualification_answers (
  _order INTEGER NOT NULL,
  _parent_id INTEGER NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  id SERIAL PRIMARY KEY,
  question VARCHAR,
  answer VARCHAR
);

-- Array field: notes
CREATE TABLE IF NOT EXISTS leads_notes (
  _order INTEGER NOT NULL,
  _parent_id INTEGER NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  id SERIAL PRIMARY KEY,
  text VARCHAR,
  author VARCHAR,
  date TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS leads_qualification_answers_order_parent_idx ON leads_qualification_answers (_order, _parent_id);
CREATE INDEX IF NOT EXISTS leads_notes_order_parent_idx ON leads_notes (_order, _parent_id);
CREATE INDEX IF NOT EXISTS leads_created_at_idx ON leads (created_at);
CREATE INDEX IF NOT EXISTS leads_campaign_slug_idx ON leads (campaign_slug);

-- ============================================================
-- 2. CAMPAIGN_EVENTS (slug: 'campaign-events')
-- ============================================================
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

CREATE INDEX IF NOT EXISTS campaign_events_campaign_slug_idx ON campaign_events (campaign_slug);
CREATE INDEX IF NOT EXISTS campaign_events_created_at_idx ON campaign_events (created_at);

-- ============================================================
-- 3. CLIENT_DOCUMENTS (slug: 'client-documents')
-- ============================================================
CREATE TABLE IF NOT EXISTS client_documents (
  id SERIAL PRIMARY KEY,
  title VARCHAR NOT NULL,
  document_type VARCHAR DEFAULT 'other',
  client_id INTEGER,
  client_name VARCHAR,
  process_number VARCHAR,
  file_id INTEGER,
  uploaded_by VARCHAR DEFAULT 'attorney',
  visibility VARCHAR DEFAULT 'client-visible',
  notes VARCHAR,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS client_documents_created_at_idx ON client_documents (created_at);

-- ============================================================
-- 4. NPS_RESPONSES (slug: 'nps-responses')
-- ============================================================
CREATE TABLE IF NOT EXISTS nps_responses (
  id SERIAL PRIMARY KEY,
  client_id INTEGER,
  client_name VARCHAR,
  score NUMERIC NOT NULL,
  feedback VARCHAR,
  process_number VARCHAR,
  attorney VARCHAR,
  status VARCHAR DEFAULT 'pending',
  testimonial_text VARCHAR,
  testimonial_approved BOOLEAN DEFAULT false,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS nps_responses_created_at_idx ON nps_responses (created_at);

-- ============================================================
-- 5. DEADLINES (slug: 'deadlines')
-- ============================================================
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
  notes VARCHAR,
  alert_sent_7d BOOLEAN DEFAULT false,
  alert_sent_3d BOOLEAN DEFAULT false,
  alert_sent_1d BOOLEAN DEFAULT false,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS deadlines_deadline_date_idx ON deadlines (deadline_date);
CREATE INDEX IF NOT EXISTS deadlines_created_at_idx ON deadlines (created_at);

-- ============================================================
-- 6. JURISPRUDENCE (slug: 'jurisprudence')
-- ============================================================
CREATE TABLE IF NOT EXISTS jurisprudence (
  id SERIAL PRIMARY KEY,
  title VARCHAR NOT NULL,
  court VARCHAR NOT NULL,
  case_number VARCHAR,
  category VARCHAR,
  summary VARCHAR,
  full_text VARCHAR,
  decision_date TIMESTAMPTZ,
  relevance VARCHAR DEFAULT 'medium',
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- hasMany text field: tags → gera tabela separada
CREATE TABLE IF NOT EXISTS jurisprudence_tags (
  _order INTEGER NOT NULL,
  _parent_id INTEGER NOT NULL REFERENCES jurisprudence(id) ON DELETE CASCADE,
  id SERIAL PRIMARY KEY,
  value VARCHAR
);

CREATE INDEX IF NOT EXISTS jurisprudence_tags_order_parent_idx ON jurisprudence_tags (_order, _parent_id);
CREATE INDEX IF NOT EXISTS jurisprudence_created_at_idx ON jurisprudence (created_at);

-- ============================================================
-- 7. Registrar na payload_migrations para evitar conflitos
-- ============================================================
INSERT INTO payload_migrations (name, batch, updated_at, created_at)
SELECT 'manual_create_new_collections', -1, NOW(), NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM payload_migrations WHERE name = 'manual_create_new_collections'
);

-- ============================================================
-- VERIFICAÇÃO
-- ============================================================
DO $$
BEGIN
  RAISE NOTICE '=== TABELAS CRIADAS ===';
END $$;

SELECT tablename FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN (
  'leads', 'leads_qualification_answers', 'leads_notes',
  'campaign_events', 'client_documents', 'nps_responses',
  'deadlines', 'jurisprudence', 'jurisprudence_tags'
)
ORDER BY tablename;
