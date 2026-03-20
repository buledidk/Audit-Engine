-- Encryption Setup for Sensitive Data
-- Add encrypted columns for PII data protection

-- Add encryption flag columns to track which data is encrypted
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_encrypted BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone_encrypted BOOLEAN DEFAULT FALSE;

-- Create a table to track encryption keys (DO NOT STORE ACTUAL KEYS - for reference only)
CREATE TABLE IF NOT EXISTS encryption_metadata (
  id SERIAL PRIMARY KEY,
  data_type VARCHAR(100) NOT NULL UNIQUE,
  algorithm VARCHAR(50) DEFAULT 'aes-256-cbc',
  key_version INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  rotated_at TIMESTAMP,
  status VARCHAR(50) DEFAULT 'active'
);

INSERT INTO encryption_metadata (data_type, algorithm, key_version, status)
VALUES
  ('user_email', 'aes-256-cbc', 1, 'active'),
  ('user_phone', 'aes-256-cbc', 1, 'active'),
  ('ssn_data', 'aes-256-cbc', 1, 'active'),
  ('bank_details', 'aes-256-cbc', 1, 'active')
ON CONFLICT (data_type) DO NOTHING;

-- Create audit table for encryption/decryption access
CREATE TABLE IF NOT EXISTS encryption_access_log (
  id SERIAL PRIMARY KEY,
  user_id INTEGER,
  action VARCHAR(50) NOT NULL,
  data_type VARCHAR(100) NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_encryption_access_user ON encryption_access_log(user_id);
CREATE INDEX idx_encryption_access_timestamp ON encryption_access_log(timestamp);
