CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT users_email_unique UNIQUE (email)
);

CREATE INDEX IF NOT EXISTS users_email_idx ON users (email);

-- Stores Business Object → Field Name → AI rules only (no Excel payload)
CREATE TABLE IF NOT EXISTS validation_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_object TEXT NOT NULL,
  rules JSONB NOT NULL,
  created_by UUID REFERENCES users (id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT validation_rules_business_object_check
    CHECK (business_object IN ('MM', 'PO', 'GL Account', 'BP'))
);

CREATE INDEX IF NOT EXISTS validation_rules_business_object_idx
  ON validation_rules (business_object);

CREATE INDEX IF NOT EXISTS validation_rules_created_at_idx
  ON validation_rules (created_at DESC);

-- Upgrade path for existing databases that still have source_fields
ALTER TABLE validation_rules DROP COLUMN IF EXISTS source_fields;
