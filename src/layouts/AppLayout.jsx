import { Outlet, NavLink, useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { DARK_COLORS as C, LIGHT_COLORS as CL } from "../components/Shared/utils/constants";

export default function AppLayout() {
  const { engId } = useParams();
  const navigate = useNavigate();
  const [sbOpen, setSbOpen] = useState(true);
  const [theme, setTheme] = useState(() => localStorage.getItem("ae-theme") || "dark");
  const CC = theme === "light" ? CL : C;
  const sw = sbOpen ? 268 : 52;

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("ae-theme", next);
  };

  // Keyboard shortcut: Ctrl+K for search, etc.
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        // Focus search if present
        const searchInput = document.querySelector("[data-wp-search]");
        if (searchInput) searchInput.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const navItems = [
    { to: "/", icon: "🏠", label: "Engagements" },
    ...(engId ? [
      { to: `/engagements/${engId}`, icon: "📊", label: "Dashboard", end: true },
      { to: `/engagements/${engId}/procedures`, icon: "📋", label: "Procedures" },
      { to: `/engagements/${engId}/evidence`, icon: "📎", label: "Evidence" },
      { to: `/engagements/${engId}/findings`, icon: "⚠️", label: "Findings" },
      { to: `/engagements/${engId}/materiality`, icon: "📐", label: "Materiality" },
      { to: `/engagements/${engId}/settings`, icon: "⚙️", label: "Settings" },
    ] : []),
  ];

  return (
    <div style={{ minHeight: "100vh", background: CC.bg, fontFamily: "'DM Sans', sans-serif", color: CC.tx, display: "flex" }}>
      <aside
        role="navigation"
        aria-label="Main navigation"
        style={{
          width: sw,
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          background: CC.sb,
          borderRight: "1px solid " + CC.brd,
          overflowY: "auto",
          overflowX: "hidden",
          transition: "width 0.3s ease",
          zIndex: 100,
          display: "flex",
          flexDirection: "column"
        }}
      >
        <div
          style={{
            padding: sbOpen ? "16px 18px" : "16px 10px",
            borderBottom: "1px solid " + CC.brd,
            display: "flex",
            alignItems: "center",
            gap: 10,
            cursor: "pointer",
            flexShrink: 0
          }}
          onClick={() => setSbOpen(!sbOpen)}
        >
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: "#1E3A5F",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 700, color: "#fff", flexShrink: 0
          }}>AE</div>
          {sbOpen && (
            <div style={{ overflow: "hidden", whiteSpace: "nowrap", flex: 1 }}>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 600 }}>
                Audit<span style={{ color: CC.acc }}>Engine</span>
              </div>
              <div style={{ fontSize: 9, color: CC.fnt, letterSpacing: "0.18em", textTransform: "uppercase" }}>AURA</div>
            </div>
          )}
          {sbOpen && (
            <button
              onClick={(e) => { e.stopPropagation(); toggleTheme(); }}
              title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
              style={{
                width: 28, height: 28, borderRadius: 6,
                background: "rgba(255,255,255,0.08)",
                border: "1px solid " + CC.brd,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 14, cursor: "pointer", color: CC.dim, flexShrink: 0
              }}
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </button>
          )}
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              style={({ isActive }) => ({
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: sbOpen ? "10px 18px" : "10px 12px",
                cursor: "pointer",
                border: "none",
                textDecoration: "none",
                textAlign: "left",
                background: isActive ? "linear-gradient(90deg," + CC.acc + "22,transparent)" : "transparent",
                borderLeft: isActive ? "3px solid " + CC.acc : "3px solid transparent",
                color: isActive ? CC.tx : CC.dim,
                fontSize: 12,
                fontWeight: isActive ? 600 : 400
              })}
            >
              <span style={{ fontSize: sbOpen ? 14 : 18 }}>{item.icon}</span>
              {sbOpen && <span>{item.label}</span>}
            </NavLink>
          ))}

          {engId && sbOpen && (
            <div style={{ padding: "12px 18px", borderTop: "1px solid " + CC.brd, marginTop: 8 }}>
              <NavLink
                to={`/engagements/${engId}/full`}
                style={({ isActive }) => ({
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 12px",
                  borderRadius: 8,
                  textDecoration: "none",
                  background: isActive ? CC.acc + "22" : "rgba(255,255,255,0.04)",
                  border: "1px solid " + (isActive ? CC.acc + "44" : CC.brd),
                  color: isActive ? CC.acc : CC.dim,
                  fontSize: 11,
                  fontWeight: 600
                })}
              >
                <span>📂</span>
                <span>Full Audit File</span>
              </NavLink>
            </div>
          )}
        </div>

        {sbOpen && (
          <div style={{ padding: "12px 18px", borderTop: "1px solid " + CC.brd, fontSize: 9, color: CC.fnt, flexShrink: 0 }}>
            <div>AuditEngine v10 AURA</div>
            <div style={{ marginTop: 4, fontSize: 8, color: "rgba(255,255,255,0.2)" }}>Indus Nexus Limited</div>
          </div>
        )}
      </aside>

      <main
        role="main"
        aria-label="Main content"
        style={{ marginLeft: sw, flex: 1, minHeight: "100vh", transition: "margin 0.3s ease" }}
      >
        <Outlet context={{ theme, CC, toggleTheme }} />
      </main>
    </div>
  );
}
