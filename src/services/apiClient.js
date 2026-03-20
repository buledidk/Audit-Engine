/**
 * UNIFIED API CLIENT SERVICE
 * Centralized API communication for all frontend components
 * Handles authentication, error handling, and data transformation
 */

import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json"
  }
});

// Add JWT token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    throw error.response?.data || { error: "Network error" };
  }
);

// ============================================================================
// AUTHENTICATION
// ============================================================================
export const auth = {
  login: (email, password) =>
    api.post("/api/auth/login", { email, password }),
  logout: () => {
    localStorage.removeItem("token");
  },
  getCurrentUser: () =>
    api.get("/api/users/me")
};

// ============================================================================
// ENGAGEMENTS
// ============================================================================
export const engagements = {
  create: (data) =>
    api.post("/api/engagements", data),
  getById: (id) =>
    api.get(`/api/engagements/${id}`),
  list: (params = {}) =>
    api.get("/api/engagements", { params }),
  updateStatus: (id, status) =>
    api.patch(`/api/engagements/${id}/status`, { status })
};

// ============================================================================
// MATERIALITY
// ============================================================================
export const materiality = {
  calculate: (engagementId) =>
    api.get(`/api/engagements/${engagementId}/materiality`)
};

// ============================================================================
// PROCEDURES
// ============================================================================
export const procedures = {
  list: (engagementId) =>
    api.get(`/api/engagements/${engagementId}/procedures`),
  update: (id, data) =>
    api.patch(`/api/procedures/${id}`, data)
};

// ============================================================================
// EVIDENCE
// ============================================================================
export const evidence = {
  list: (engagementId) =>
    api.get(`/api/engagements/${engagementId}/evidence`),
  upload: (engagementId, formData) =>
    api.post(`/api/engagements/${engagementId}/evidence`, formData, {
      headers: { "Content-Type": "multipart/form-data" }
    }),
  review: (id, data) =>
    api.patch(`/api/evidence/${id}/review`, data)
};

// ============================================================================
// FINDINGS
// ============================================================================
export const findings = {
  list: (engagementId) =>
    api.get(`/api/engagements/${engagementId}/findings`),
  create: (engagementId, data) =>
    api.post(`/api/engagements/${engagementId}/findings`, data)
};

// ============================================================================
// RISK ASSESSMENTS
// ============================================================================
export const riskAssessments = {
  list: (engagementId) =>
    api.get(`/api/engagements/${engagementId}/risk-assessments`),
  create: (engagementId, data) =>
    api.post(`/api/engagements/${engagementId}/risk-assessments`, data)
};

// ============================================================================
// ORCHESTRATOR - AI AGENTS
// ============================================================================
export const orchestrator = {
  request: (data) =>
    api.post("/api/orchestrator/request", data),
  fullAnalysis: (data) =>
    api.post("/api/orchestrator/full-analysis", data),
  exceptionHandling: (data) =>
    api.post("/api/orchestrator/exception-handling", data),
  riskAssessmentSuite: (data) =>
    api.post("/api/orchestrator/risk-assessment", data),
  getStatus: () =>
    api.get("/api/orchestrator/status"),
  getMetrics: () =>
    api.get("/api/orchestrator/metrics")
};

// ============================================================================
// JURISDICTIONS
// ============================================================================
export const jurisdictions = {
  list: () =>
    api.get("/api/jurisdictions"),
  getByCode: (code) =>
    api.get(`/api/jurisdictions/${code}`)
};

export default api;
