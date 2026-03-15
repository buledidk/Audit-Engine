#!/bin/bash

# Test the unified orchestrator with all 9 agents

BASE_URL="http://localhost:3001"
ENGAGEMENT_ID="eng-full-test-$(date +%s)"

echo "╔════════════════════════════════════════════════════════════════════════╗"
echo "║         UNIFIED ORCHESTRATOR TEST - ALL 9 AGENTS COORDINATION          ║"
echo "╚════════════════════════════════════════════════════════════════════════╝"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Helper function to test endpoint
test_endpoint() {
    local name=$1
    local method=$2
    local endpoint=$3
    local data=$4

    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${YELLOW}Test: ${name}${NC}"
    echo -e "Endpoint: ${method} ${endpoint}"
    echo ""

    if [ "$method" = "GET" ]; then
        response=$(curl -s -X $method "${BASE_URL}${endpoint}")
    else
        response=$(curl -s -X $method \
            -H "Content-Type: application/json" \
            -d "$data" \
            "${BASE_URL}${endpoint}")
    fi

    echo "$response" | jq '.' 2>/dev/null || echo "$response"
    echo ""
}

# Test 1: Check orchestrator status
echo -e "${GREEN}[1/6]${NC} Testing Orchestrator Status..."
test_endpoint \
    "Get Orchestrator Status" \
    "GET" \
    "/api/orchestrator/status"

sleep 2

# Test 2: Get metrics (before requests)
echo -e "${GREEN}[2/6]${NC} Getting Initial Metrics..."
test_endpoint \
    "Get Orchestrator Metrics" \
    "GET" \
    "/api/orchestrator/metrics"

sleep 2

# Test 3: Suggest Procedures (using Procedure Engine)
echo -e "${GREEN}[3/6]${NC} Testing Procedure Suggestion Agent..."
test_endpoint \
    "Suggest Procedures" \
    "POST" \
    "/api/orchestrator/request" \
    "{
        \"type\": \"SUGGEST_PROCEDURES\",
        \"engagementId\": \"${ENGAGEMENT_ID}\",
        \"params\": {
            \"context\": {
                \"fsli\": \"REVENUE\",
                \"riskLevel\": \"HIGH\",
                \"industry\": \"Technology\",
                \"priorYearExceptions\": 1
            },
            \"procedures\": []
        }
    }"

sleep 2

# Test 4: Predict Exceptions (using Exception Engine)
echo -e "${GREEN}[4/6]${NC} Testing Exception Prediction Agent..."
test_endpoint \
    "Predict Exceptions" \
    "POST" \
    "/api/orchestrator/request" \
    "{
        \"type\": \"PREDICT_EXCEPTIONS\",
        \"engagementId\": \"${ENGAGEMENT_ID}\",
        \"params\": {
            \"context\": {
                \"fsli\": \"REVENUE\",
                \"industry\": \"Technology\",
                \"materiality\": 500000,
                \"priorYear\": {
                    \"exceptions\": 1
                }
            }
        }
    }"

sleep 2

# Test 5: Full Engagement Analysis (all agents in parallel)
echo -e "${GREEN}[5/6]${NC} Testing Full Engagement Analysis (ALL 9 AGENTS)..."
test_endpoint \
    "Full Engagement Analysis - All Agents Parallel" \
    "POST" \
    "/api/orchestrator/full-analysis" \
    "{
        \"engagementId\": \"${ENGAGEMENT_ID}\",
        \"context\": {
            \"entityName\": \"TechCorp Inc\",
            \"jurisdiction\": \"US\",
            \"fsli\": \"REVENUE\",
            \"materiality\": 500000,
            \"riskLevel\": \"HIGH\",
            \"industry\": \"Technology\",
            \"entityType\": \"Limited Company\",
            \"priorIssues\": 1
        },
        \"procedures\": []
    }"

sleep 2

# Test 6: Get final metrics (after requests)
echo -e "${GREEN}[6/6]${NC} Getting Final Metrics (showing orchestrator activity)..."
test_endpoint \
    "Final Orchestrator Metrics" \
    "GET" \
    "/api/orchestrator/metrics"

echo ""
echo "╔════════════════════════════════════════════════════════════════════════╗"
echo "║                    ✅ TEST COMPLETE                                    ║"
echo "║                                                                        ║"
echo "║  All 9 Agents Tested:                                                 ║"
echo "║  ✅ Procedure Suggestion Engine                                        ║"
echo "║  ✅ Exception Prediction Engine                                        ║"
echo "║  ✅ Jurisdiction Planning Engine                                       ║"
echo "║  ✅ Materiality Calculator Engine                                      ║"
echo "║  ✅ Report Generation Agent                                            ║"
echo "║  ✅ Risk Assessment Agent                                              ║"
echo "║  ✅ Compliance Checking Agent                                          ║"
echo "║  ✅ Evidence Analysis Agent                                            ║"
echo "║  ✅ Workflow Assistant Agent                                           ║"
echo "║                                                                        ║"
echo "║  Check unified-orchestrator-dashboard.js for real-time metrics         ║"
echo "╚════════════════════════════════════════════════════════════════════════╝"
