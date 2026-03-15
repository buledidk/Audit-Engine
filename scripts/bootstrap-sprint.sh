#!/bin/bash
# =====================================================
# 7-DAY SPRINT BOOTSTRAP SCRIPT
# Complete setup for portal + database integration
# =====================================================

set -e  # Exit on error

echo "🚀 AUDIT ENGINE 7-DAY SPRINT BOOTSTRAP"
echo "========================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# =====================================================
# STEP 1: ENVIRONMENT SETUP
# =====================================================
echo -e "${BLUE}STEP 1: Environment Setup${NC}"
echo "Checking dependencies..."

# Check Node.js
if ! command -v node &> /dev/null; then
  echo -e "${RED}Node.js not found. Installing...${NC}"
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  sudo apt-get install -y nodejs
fi

# Check PostgreSQL
if ! command -v psql &> /dev/null; then
  echo -e "${YELLOW}PostgreSQL not found. Installing...${NC}"
  sudo apt-get update
  sudo apt-get install -y postgresql postgresql-contrib
  sudo systemctl start postgresql
fi

# Check Docker
if ! command -v docker &> /dev/null; then
  echo -e "${YELLOW}Docker not found. Installing...${NC}"
  curl -fsSL https://get.docker.com -o get-docker.sh
  sudo sh get-docker.sh
  sudo usermod -aG docker $USER
fi

echo -e "${GREEN}✓ Dependencies verified${NC}"
echo ""

# =====================================================
# STEP 2: PROJECT SETUP
# =====================================================
echo -e "${BLUE}STEP 2: Project Setup${NC}"

cd /home/user/Audit-Automation-Engine

# Create necessary directories
mkdir -p src/components
mkdir -p src/db
mkdir -p src/services
mkdir -p src/hooks
mkdir -p scripts/sql
mkdir -p scripts/docker
mkdir -p .github/workflows

echo -e "${GREEN}✓ Directories created${NC}"
echo ""

# =====================================================
# STEP 3: NPM DEPENDENCIES
# =====================================================
echo -e "${BLUE}STEP 3: Installing NPM Dependencies${NC}"

npm install

# Additional packages for portal + database
npm install --save axios react-icons react-table recharts react-query
npm install --save-dev jest @testing-library/react @testing-library/jest-dom

echo -e "${GREEN}✓ Dependencies installed${NC}"
echo ""

# =====================================================
# STEP 4: DATABASE INITIALIZATION
# =====================================================
echo -e "${BLUE}STEP 4: Database Initialization${NC}"

# Create PostgreSQL user and database
sudo -u postgres psql <<EOF || true
CREATE USER audit_user WITH PASSWORD 'AuditEngine2026!' CREATEDB;
CREATE DATABASE audit_engine OWNER audit_user;
\connect audit_engine
CREATE EXTENSION IF NOT EXISTS uuid-ossp;
CREATE EXTENSION IF NOT EXISTS pg_trgm;
EOF

echo -e "${GREEN}✓ PostgreSQL user and database created${NC}"
echo ""

# =====================================================
# STEP 5: ENVIRONMENT CONFIGURATION
# =====================================================
echo -e "${BLUE}STEP 5: Environment Configuration${NC}"

cat > .env.local <<EOF
# Database
POSTGRES_USER=audit_user
POSTGRES_PASSWORD=AuditEngine2026!
POSTGRES_DB=audit_engine
POSTGRES_HOST=localhost
POSTGRES_PORT=5432

# API
API_PORT=3000
API_URL=http://localhost:3000

# Claude AI
CLAUDE_API_KEY=${CLAUDE_API_KEY:-your-api-key-here}
CLAUDE_MODEL=claude-haiku-4-5-20251001

# Environment
NODE_ENV=development
DEBUG=audit:*

# Subscriptions
STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY:-sk_test_placeholder}
STRIPE_PUBLIC_KEY=${STRIPE_PUBLIC_KEY:-pk_test_placeholder}
EOF

echo -e "${GREEN}✓ Environment file created (.env.local)${NC}"
echo ""

# =====================================================
# STEP 6: BUILD SCRIPTS CREATION
# =====================================================
echo -e "${BLUE}STEP 6: Creating Build Scripts${NC}"

# Day 1-2 components script
cat > scripts/build-day1-2.sh <<'ENDSCRIPT'
#!/bin/bash
echo "Building Day 1-2 Components..."

# Create ClientOnboarding component
npm run generate:component -- \
  --name ClientOnboarding \
  --type portal \
  --features "auth,company-info,audit-scope"

# Create AuditWorkflow component
npm run generate:component -- \
  --name AuditWorkflow \
  --type portal \
  --features "phase-tracking,procedure-list,evidence-gallery"

# Create WorkflowTracker component
npm run generate:component -- \
  --name WorkflowTracker \
  --type portal \
  --features "timeline,milestone,progress-bar"

echo "Day 1-2 components generated!"
ENDSCRIPT

# Day 3-4 components script
cat > scripts/build-day3-4.sh <<'ENDSCRIPT'
#!/bin/bash
echo "Building Day 3-4 Components..."

# Create ReportGenerator component
npm run generate:component -- \
  --name ReportGenerator \
  --type portal \
  --features "report-builder,export,template"

# Create ComplianceDashboard component
npm run generate:component -- \
  --name ComplianceDashboard \
  --type portal \
  --features "compliance-status,issue-tracking,remediation"

# Create EvidenceGallery component
npm run generate:component -- \
  --name EvidenceGallery \
  --type portal \
  --features "document-grid,filtering,quality-scoring"

echo "Day 3-4 components generated!"
ENDSCRIPT

# Day 5-6 API integration script
cat > scripts/build-day5-6.sh <<'ENDSCRIPT'
#!/bin/bash
echo "Building Day 5-6 API Integrations..."

# Run comprehensive API tests
npm run test:api

# Build API documentation
npm run generate:api-docs

# Run integration tests
npm run test:integration

echo "Day 5-6 API integrations complete!"
ENDSCRIPT

# Day 7 deployment script
cat > scripts/build-day7-deploy.sh <<'ENDSCRIPT'
#!/bin/bash
echo "Building Day 7 Deployment..."

# Build production bundle
npm run build

# Create Docker image
docker build -f scripts/docker/Dockerfile -t audit-engine:latest .

# Deploy to staging
docker-compose -f scripts/docker/docker-compose.staging.yml up -d

echo "Day 7 deployment complete!"
ENDSCRIPT

chmod +x scripts/build-*.sh

echo -e "${GREEN}✓ Build scripts created${NC}"
echo ""

# =====================================================
# STEP 7: DATABASE SCHEMA
# =====================================================
echo -e "${BLUE}STEP 7: Creating Database Schema${NC}"

# Create SQL migration file
cat > scripts/sql/001-init-schema.sql <<'ENDSQL'
-- =====================================================
-- AUDIT ENGINE - POSTGRESQL SCHEMA
-- =====================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS uuid-ossp;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- =====================================================
-- ENGAGEMENT MANAGEMENT
-- =====================================================

CREATE TABLE engagements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL,
  engagement_name VARCHAR(255) NOT NULL,
  engagement_type VARCHAR(50) DEFAULT 'FINANCIAL',
  status VARCHAR(50) DEFAULT 'PLANNING',
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_engagements_client_id ON engagements(client_id);
CREATE INDEX idx_engagements_status ON engagements(status);

-- =====================================================
-- AUDIT TRAIL DOCUMENTATION (ISA 230 COMPLIANT)
-- =====================================================

CREATE TABLE audit_trail (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  engagement_id UUID NOT NULL REFERENCES engagements(id),
  procedure_id VARCHAR(50) NOT NULL,
  procedure_name VARCHAR(255) NOT NULL,
  assertion VARCHAR(100),
  risk_level VARCHAR(20),
  materiality_level DECIMAL(15, 2),
  procedure_start_date TIMESTAMP,
  procedure_end_date TIMESTAMP,

  -- ISA 230: Nature, Timing, Extent
  procedure_nature TEXT,
  procedure_timing VARCHAR(50),
  procedure_extent INTEGER,

  -- Professional Judgment
  professional_judgment TEXT,
  skepticism_assessment TEXT,
  confidence_level DECIMAL(3, 2),

  -- Evidence
  evidence_count INTEGER,
  evidence_quality VARCHAR(50),

  -- Results
  exceptions_found INTEGER,
  findings_documented TEXT,
  conclusion VARCHAR(255),

  -- ISA 200 Compliance
  documented_by VARCHAR(255),
  reviewed_by VARCHAR(255),
  review_date TIMESTAMP,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_audit_trail_engagement ON audit_trail(engagement_id);
CREATE INDEX idx_audit_trail_procedure ON audit_trail(procedure_id);
CREATE INDEX idx_audit_trail_risk_level ON audit_trail(risk_level);

-- =====================================================
-- EVIDENCE MANAGEMENT
-- =====================================================

CREATE TABLE evidence (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  audit_trail_id UUID NOT NULL REFERENCES audit_trail(id),
  engagement_id UUID NOT NULL REFERENCES engagements(id),
  evidence_type VARCHAR(50),
  source VARCHAR(100),
  reliability VARCHAR(20),
  relevance_score DECIMAL(3, 2),
  quality_score DECIMAL(3, 2),

  document_url VARCHAR(500),
  document_hash VARCHAR(64),
  file_size_bytes BIGINT,

  description TEXT,
  conclusion TEXT,

  dlp_scan_status VARCHAR(50) DEFAULT 'PENDING',
  dlp_issues TEXT,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_evidence_audit_trail ON evidence(audit_trail_id);
CREATE INDEX idx_evidence_engagement ON evidence(engagement_id);
CREATE INDEX idx_evidence_quality ON evidence(quality_score);

-- =====================================================
-- PROFESSIONAL SKEPTICISM
-- =====================================================

CREATE TABLE skepticism_assessments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  audit_trail_id UUID NOT NULL REFERENCES audit_trail(id),
  engagement_id UUID NOT NULL REFERENCES engagements(id),

  assertion VARCHAR(100),
  management_position TEXT,
  auditor_position TEXT,

  alternative_explanation_1 TEXT,
  alternative_explanation_2 TEXT,
  alternative_explanation_3 TEXT,

  challenge_areas TEXT,
  suggested_procedures TEXT,

  resolution_approach VARCHAR(50),
  final_conclusion TEXT,

  skepticism_confidence DECIMAL(3, 2),
  documented_by VARCHAR(255),

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_skepticism_audit_trail ON skepticism_assessments(audit_trail_id);

-- =====================================================
-- RISK ASSESSMENT (ISA 315)
-- =====================================================

CREATE TABLE risk_assessments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  engagement_id UUID NOT NULL REFERENCES engagements(id),
  assessment_date DATE,

  financial_statement_risk VARCHAR(50),
  inherent_risk DECIMAL(3, 2),
  control_risk DECIMAL(3, 2),
  detection_risk DECIMAL(3, 2),
  overall_audit_risk DECIMAL(3, 2),

  significant_risks TEXT,
  fraud_risk_factors TEXT,
  going_concern_indicators TEXT,

  planned_procedures_count INTEGER,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_risk_assessments_engagement ON risk_assessments(engagement_id);

-- =====================================================
-- CLIENT MANAGEMENT (CRM)
-- =====================================================

CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_name VARCHAR(255) NOT NULL,
  industry VARCHAR(100),
  country_code VARCHAR(2),
  jurisdiction VARCHAR(50),

  contact_name VARCHAR(255),
  contact_email VARCHAR(255),
  contact_phone VARCHAR(20),

  subscription_tier VARCHAR(50) DEFAULT 'STARTER',
  subscription_active BOOLEAN DEFAULT true,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_clients_jurisdiction ON clients(jurisdiction);
CREATE INDEX idx_clients_subscription ON clients(subscription_tier);

-- =====================================================
-- MATERIALITY TRACKING
-- =====================================================

CREATE TABLE materiality (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  engagement_id UUID NOT NULL REFERENCES engagements(id),

  performance_materiality DECIMAL(15, 2),
  overall_materiality DECIMAL(15, 2),
  specific_materiality DECIMAL(15, 2),

  basis_amount DECIMAL(15, 2),
  basis_description VARCHAR(100),

  materiality_percentage DECIMAL(5, 2),

  approved_by VARCHAR(255),
  approval_date DATE,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_materiality_engagement ON materiality(engagement_id);

-- =====================================================
-- DOCUMENTATION (ISA 230)
-- =====================================================

CREATE TABLE documentation (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  engagement_id UUID NOT NULL REFERENCES engagements(id),

  doc_type VARCHAR(50),
  doc_category VARCHAR(100),
  doc_name VARCHAR(255) NOT NULL,

  content TEXT,
  file_path VARCHAR(500),
  file_size_bytes BIGINT,

  version INTEGER DEFAULT 1,
  author VARCHAR(255),

  retention_until DATE,
  is_archived BOOLEAN DEFAULT false,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_documentation_engagement ON documentation(engagement_id);
CREATE INDEX idx_documentation_type ON documentation(doc_type);

-- =====================================================
-- AUDIT STANDARDS COMPLIANCE
-- =====================================================

CREATE TABLE isa_compliance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  engagement_id UUID NOT NULL REFERENCES engagements(id),

  isa_standard VARCHAR(20) NOT NULL,
  standard_name VARCHAR(255),
  jurisdiction VARCHAR(50),

  requirement_met BOOLEAN DEFAULT false,
  evidence_count INTEGER,
  last_verified_date TIMESTAMP,

  compliance_notes TEXT,
  verified_by VARCHAR(255),

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_isa_compliance_engagement ON isa_compliance(engagement_id);
CREATE INDEX idx_isa_compliance_standard ON isa_compliance(isa_standard);

-- =====================================================
-- SUBSCRIPTIONS & BILLING
-- =====================================================

CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES clients(id),

  tier VARCHAR(50) NOT NULL,
  price_monthly DECIMAL(10, 2),
  price_annual DECIMAL(10, 2),

  token_limit INTEGER DEFAULT 100000,
  tokens_used INTEGER DEFAULT 0,
  overage_tokens INTEGER DEFAULT 0,

  active BOOLEAN DEFAULT true,
  start_date DATE,
  end_date DATE,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_subscriptions_client ON subscriptions(client_id);
CREATE INDEX idx_subscriptions_active ON subscriptions(active);

-- =====================================================
-- VIEWS FOR REPORTING
-- =====================================================

CREATE VIEW v_engagement_status AS
SELECT
  e.id,
  e.engagement_name,
  e.status,
  COUNT(DISTINCT at.id) as procedure_count,
  COUNT(DISTINCT ev.id) as evidence_count,
  MAX(at.updated_at) as last_update
FROM engagements e
LEFT JOIN audit_trail at ON e.id = at.engagement_id
LEFT JOIN evidence ev ON e.id = ev.engagement_id
GROUP BY e.id;

CREATE VIEW v_isa_compliance_status AS
SELECT
  engagement_id,
  isa_standard,
  COUNT(*) as requirement_count,
  SUM(CASE WHEN requirement_met THEN 1 ELSE 0 END) as requirements_met,
  ROUND(100.0 * SUM(CASE WHEN requirement_met THEN 1 ELSE 0 END) / COUNT(*), 2) as compliance_percentage
FROM isa_compliance
GROUP BY engagement_id, isa_standard;

-- =====================================================
-- AUDIT TRAIL FUNCTION
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to all tables
DO $$
DECLARE
  t text;
BEGIN
  FOR t IN
    SELECT tablename FROM pg_tables
    WHERE schemaname = 'public'
  LOOP
    EXECUTE 'CREATE TRIGGER update_' || t || '_updated_at BEFORE UPDATE ON ' || t || '
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();';
  END LOOP;
END $$;

ENDSQL

echo -e "${GREEN}✓ Database schema created${NC}"
echo ""

# =====================================================
# STEP 8: DOCKER CONFIGURATION
# =====================================================
echo -e "${BLUE}STEP 8: Docker Configuration${NC}"

cat > scripts/docker/Dockerfile <<'ENDDOCKER'
FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy application
COPY . .

# Build application
RUN npm run build

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node healthcheck.js || exit 1

# Start application
CMD ["npm", "start"]
ENDDOCKER

cat > scripts/docker/docker-compose.staging.yml <<'ENDCOMPOSE'
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: audit_user
      POSTGRES_PASSWORD: AuditEngine2026!
      POSTGRES_DB: audit_engine
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./scripts/sql:/docker-entrypoint-initdb.d
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U audit_user"]
      interval: 10s
      timeout: 5s
      retries: 5

  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      POSTGRES_HOST: postgres
      POSTGRES_USER: audit_user
      POSTGRES_PASSWORD: AuditEngine2026!
      POSTGRES_DB: audit_engine
      NODE_ENV: staging
    depends_on:
      postgres:
        condition: service_healthy
    volumes:
      - ./src:/app/src
      - ./public:/app/public

volumes:
  postgres_data:
ENDCOMPOSE

echo -e "${GREEN}✓ Docker configuration created${NC}"
echo ""

# =====================================================
# STEP 9: GITHUB WORKFLOWS
# =====================================================
echo -e "${BLUE}STEP 9: GitHub Workflows${NC}"

cat > .github/workflows/test.yml <<'ENDWORKFLOW'
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:15-alpine
        env:
          POSTGRES_USER: audit_user
          POSTGRES_PASSWORD: AuditEngine2026!
          POSTGRES_DB: audit_engine
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

    steps:
      - uses: actions/checkout@v3

      - uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'

      - run: npm ci

      - run: npm run test

      - run: npm run lint

      - run: npm run build

ENDWORKFLOW

echo -e "${GREEN}✓ GitHub workflows created${NC}"
echo ""

# =====================================================
# STEP 10: COMPONENT GENERATION HELPER
# =====================================================
echo -e "${BLUE}STEP 10: Component Generation Helper${NC}"

cat > scripts/generate-component.js <<'ENDJS'
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const componentName = process.argv[2];
const features = process.argv.slice(3);

if (!componentName) {
  console.error('Usage: node generate-component.js <ComponentName> [feature1] [feature2]...');
  process.exit(1);
}

const componentPath = path.join(__dirname, '../src/components', `${componentName}.jsx`);

const template = `import React, { useState, useCallback } from 'react';
import { useAuditContext } from '../context/AuditContext';
import { AIProvider } from '../context/AIContext';

/**
 * ${componentName} Component
 *
 * Features:
${features.map(f => `* - ${f}`).join('\n')}
 *
 * ISA Compliance: ISA 230 Audit Documentation
 */
export const ${componentName} = ({ engagementId }) => {
  const { state, dispatch } = useAuditContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAction = useCallback(async (action) => {
    setLoading(true);
    setError(null);
    try {
      // Implementation here
      console.log('Action:', action);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div className="${componentName.toLowerCase()} p-6">
      <h2 className="text-2xl font-bold mb-4">${componentName}</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading && (
        <div className="text-center py-4">Loading...</div>
      )}

      {/* Component implementation */}
    </div>
  );
};

export default ${componentName};
`;

fs.mkdirSync(path.dirname(componentPath), { recursive: true });
fs.writeFileSync(componentPath, template);

console.log(`✓ Generated ${componentName}.jsx`);
ENDJS

chmod +x scripts/generate-component.js

echo -e "${GREEN}✓ Component generator created${NC}"
echo ""

# =====================================================
# COMPLETION
# =====================================================
echo -e "${GREEN}========================================"
echo "✅ BOOTSTRAP COMPLETE!"
echo "========================================${NC}"
echo ""
echo "🚀 NEXT STEPS:"
echo ""
echo "1. Apply database schema:"
echo "   psql -U audit_user -d audit_engine -f scripts/sql/001-init-schema.sql"
echo ""
echo "2. Start the 7-day sprint:"
echo "   bash scripts/build-day1-2.sh"
echo ""
echo "3. Build portal components in parallel:"
echo "   npm run build:components"
echo ""
echo "4. Run tests continuously:"
echo "   npm run test:watch"
echo ""
echo "5. Deploy to staging:"
echo "   bash scripts/build-day7-deploy.sh"
echo ""
echo "📋 Configuration file: .env.local"
echo "🐳 Docker compose: scripts/docker/docker-compose.staging.yml"
echo "📚 Database schema: scripts/sql/001-init-schema.sql"
echo ""
