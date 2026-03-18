-- GDPR Audit Trail Table
-- Tracks all user actions for compliance audit purposes
CREATE TABLE IF NOT EXISTS audit_trail (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  action VARCHAR(255) NOT NULL,
  resource_type VARCHAR(100),
  resource_id INTEGER,
  data_accessed TEXT,
  ip_address VARCHAR(45),
  user_agent TEXT,
  status_code INTEGER,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create index for fast audit lookups
CREATE INDEX idx_audit_trail_user_id ON audit_trail(user_id);
CREATE INDEX idx_audit_trail_timestamp ON audit_trail(timestamp);
CREATE INDEX idx_audit_trail_resource ON audit_trail(resource_type, resource_id);

-- Data retention policy for audit logs (GDPR Art. 5.1.e)
CREATE TABLE IF NOT EXISTS data_retention_policies (
  id SERIAL PRIMARY KEY,
  data_category VARCHAR(255) NOT NULL UNIQUE,
  retention_days INTEGER NOT NULL,
  gdpr_justification VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO data_retention_policies (data_category, retention_days, gdpr_justification)
VALUES
  ('audit_logs', 2555, 'Legal obligation - 7 years for financial records'),
  ('user_activity', 365, 'Legitimate business interest - 1 year'),
  ('user_data', 90, 'User right to erasure - 90 days after last access'),
  ('session_data', 30, 'Security purpose - 30 days for session auditing')
ON CONFLICT (data_category) DO NOTHING;

-- User consent tracking (GDPR Art. 7)
CREATE TABLE IF NOT EXISTS user_consents (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  consent_type VARCHAR(100) NOT NULL,
  consent_given BOOLEAN DEFAULT FALSE,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ip_address VARCHAR(45),
  user_agent TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(user_id, consent_type)
);

-- Add columns to users table for GDPR compliance
ALTER TABLE users ADD COLUMN IF NOT EXISTS data_processing_consent BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS marketing_consent BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_data_access TIMESTAMP;
ALTER TABLE users ADD COLUMN IF NOT EXISTS data_export_requested_at TIMESTAMP;
ALTER TABLE users ADD COLUMN IF NOT EXISTS data_deletion_requested_at TIMESTAMP;
