import { createBrowserRouter, Navigate } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import AuthLayout from "./layouts/AuthLayout";
import DashboardPage from "./pages/DashboardPage";
import EngagementPage from "./pages/EngagementPage";
import SettingsPage from "./pages/SettingsPage";
import MaterialityPage from "./pages/MaterialityPage";
import FullAuditFilePage from "./pages/FullAuditFilePage";
import OverviewTab from "./components/Dashboard/OverviewTab";
import ProcedureList from "./components/ProcedureTracker/ProcedureList";
import ProcedureDetail from "./components/ProcedureTracker/ProcedureDetail";
import EvidenceList from "./components/EvidenceManager/EvidenceList";
import FindingList from "./components/FindingLogger/FindingList";
import FindingDetail from "./components/FindingLogger/FindingDetail";
import ErrorBoundary from "./components/ErrorBoundary";

function RouteErrorFallback() {
  return (
    <div style={{
      padding: 60, textAlign: "center", fontFamily: "'DM Sans', sans-serif",
      color: "#B0B8C8", minHeight: "100vh", display: "flex",
      flexDirection: "column", alignItems: "center", justifyContent: "center",
      background: "#0B1120"
    }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>Page Error</div>
      <p style={{ fontSize: 13, color: "#6B7A90", marginBottom: 20 }}>
        Something went wrong loading this page.
      </p>
      <button
        onClick={() => window.location.href = "/"}
        style={{
          padding: "10px 20px", borderRadius: 8,
          background: "#00E5A0", border: "none",
          color: "#000", cursor: "pointer", fontSize: 12, fontWeight: 700
        }}
      >
        Go to Dashboard
      </button>
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    errorElement: <RouteErrorFallback />,
    children: [
      { index: true, element: <DashboardPage /> },
      {
        path: "engagements/:engId",
        element: <EngagementPage />,
        errorElement: <RouteErrorFallback />,
        children: [
          { index: true, element: <ErrorBoundary level="section"><OverviewTab /></ErrorBoundary> },
          { path: "procedures", element: <ErrorBoundary level="section"><ProcedureList /></ErrorBoundary> },
          { path: "procedures/:wpId", element: <ErrorBoundary level="section"><ProcedureDetail /></ErrorBoundary> },
          { path: "evidence", element: <ErrorBoundary level="section"><EvidenceList /></ErrorBoundary> },
          { path: "findings", element: <ErrorBoundary level="section"><FindingList /></ErrorBoundary> },
          { path: "findings/:findingId", element: <ErrorBoundary level="section"><FindingDetail /></ErrorBoundary> },
          { path: "materiality", element: <ErrorBoundary level="section"><MaterialityPage /></ErrorBoundary> },
          { path: "settings", element: <ErrorBoundary level="section"><SettingsPage /></ErrorBoundary> },
          { path: "full", element: <ErrorBoundary level="section"><FullAuditFilePage /></ErrorBoundary> },
        ]
      },
    ]
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      { index: true, element: <div style={{ textAlign: "center", color: "#B0B8C8" }}>Login coming in Phase 6</div> },
    ]
  },
  { path: "*", element: <Navigate to="/" replace /> }
]);

export default router;
