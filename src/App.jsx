import React, { useState, useEffect, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { COLORS, CASES, CASES_CSV_URL, SHEET_CSV_URL } from "./data";
import { ROUTES_META } from "./routesMeta";
import { useSheetData } from "./hooks/useSheetData";
import { useIsMobile } from "./hooks/useIsMobile";
import { mapStatRows, mapStatCols, mapCaseCols } from "./sheetMappers";
import { LogoIcon } from "./components/LogoIcon";
import { Btn } from "./components/Btn";
import { ScrollProgress } from "./components/ScrollProgress";
import { SocialFloat } from "./components/SocialFloat";
import { IconMenu, IconClose } from "./components/icons";
import "./index.css";

// Cada vista se carga solo cuando su ruta se visita (code-splitting)
const HomeView    = lazy(() => import("./views/HomeView"));
const CatalogView = lazy(() => import("./views/CatalogView"));
const ValorView   = lazy(() => import("./views/ValorView"));
const CasesView   = lazy(() => import("./views/CasesView"));
const AboutView   = lazy(() => import("./views/AboutView"));
const ContactView = lazy(() => import("./views/ContactView"));

const { BG, BG2, INK, INK2, INK3, ACCENT, AMBER2, BORDER } = COLORS;

const idToPath = Object.fromEntries(ROUTES_META.map(r => [r.id, r.path]));

// ── Spinner de carga entre rutas ─────────────────────────────────────────
function RouteLoading() {
  return (
    <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div aria-label="Cargando" style={{ width: 48, height: 48, borderRadius: "50%", border: `3px solid ${BORDER}`, borderTopColor: ACCENT, animation: "spin 0.9s linear infinite" }} />
    </div>
  );
}

// ── Contacto: lee el servicio preseleccionado del estado de navegación ──
function ContactRoute({ isMobile }) {
  const location = useLocation();
  return <ContactView isMobile={isMobile} initialService={location.state?.service || null} />;
}

// ── SHELL: nav, footer, rutas ────────────────────────────────────────────
function Shell() {
  const navigate = useNavigate();
  const location = useLocation();

  const { data: marketStats } = useSheetData(SHEET_CSV_URL, { mapRows: mapStatRows, mapCols: mapStatCols, fallback: [] });
  const { data: casesList }   = useSheetData(CASES_CSV_URL, { mapCols: mapCaseCols, fallback: CASES || [] });

  const isMobile = useIsMobile();
  const [menuOpen, setMenuOpen] = useState(false);

  // Las vistas navegan por id ("contacto", "catalogo"...) igual que antes;
  // el servicio preseleccionado viaja en el estado de la ruta.
  const nav = (id, serviceName = null) => {
    setMenuOpen(false);
    navigate(idToPath[id] || "/", serviceName ? { state: { service: serviceName } } : undefined);
  };

  // Scroll al inicio + title/meta por ruta en cada navegación
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const meta = ROUTES_META.find(r => r.path === location.pathname) || ROUTES_META[0];
    document.title = meta.title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", meta.description);
  }, [location.pathname]);

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: BG, color: INK, fontFamily: "'Sentient', Georgia, serif" }}>

      <ScrollProgress />
      <SocialFloat isMobile={isMobile} />

      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000, background: "rgba(242,239,230,0.96)", borderBottom: `1px solid ${BORDER}`, height: "80px", display: "flex", alignItems: "center", padding: "0 5vw", justifyContent: "space-between" }}>
        {/* El isotipo es la "R": visualmente el lockup se lee RIDERS MEDIA */}
        <button onClick={() => nav("inicio")} aria-label="Riders Media — Ir al inicio" style={{ background: "none", border: "none", padding: 0, cursor: "pointer", display: "flex", alignItems: "center", gap: 3.5 }}>
          <LogoIcon size={32} />
          <span aria-hidden="true" className="font-display" style={{ fontWeight: 700, fontSize: "22px", letterSpacing: "0.03em", color: INK2 }}>IDERS MEDIA</span>
        </button>

        {!isMobile ? (
          <>
            <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
              {ROUTES_META.map(p => {
                const active = location.pathname === p.path;
                return (
                  <button key={p.id} onClick={() => nav(p.id)} aria-current={active ? "page" : undefined} style={{ background: "none", border: "none", cursor: "pointer", color: active ? INK : INK2, fontSize: "12px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", padding: "8px 0", borderBottom: active ? `2px solid ${ACCENT}` : "2px solid transparent", transition: "all 0.2s" }}>
                    {p.label}
                  </button>
                );
              })}
            </div>
            <Btn variant="primary" onClick={() => nav("contacto")} style={{ padding: "11px 26px", fontSize: 12, minHeight: 44 }}>Cotizar</Btn>
          </>
        ) : (
          <button onClick={() => setMenuOpen(!menuOpen)} aria-label="Menú" aria-expanded={menuOpen} style={{ background: "none", border: "none", color: INK, cursor: "pointer", display: "flex", alignItems: "center", padding: 8 }}>
            {menuOpen ? <IconClose /> : <IconMenu />}
          </button>
        )}
      </nav>

      {isMobile && menuOpen && (
        <div className="mobile-menu" style={{ position: "fixed", top: "80px", left: 0, right: 0, background: BG, borderBottom: `1px solid ${BORDER}`, zIndex: 999, display: "flex", flexDirection: "column", padding: "20px 5vw", boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}>
           {ROUTES_META.map(p => {
             const active = location.pathname === p.path;
             return (
               <button key={p.id} onClick={() => nav(p.id)} aria-current={active ? "page" : undefined} style={{ background: "none", border: "none", color: INK, fontSize: "16px", fontWeight: 800, textTransform: "uppercase", textAlign: "left", padding: "15px 0", paddingLeft: active ? 12 : 0, borderLeft: active ? `3px solid ${ACCENT}` : "none", borderBottom: `1px solid ${BORDER}` }}>
                 {p.label}
               </button>
             );
           })}
           <div style={{ marginTop: 15 }}>
             <Btn variant="primary" full onClick={() => nav("contacto")}>Cotizar</Btn>
           </div>
        </div>
      )}

      <main style={{ flex: 1, paddingTop: "80px" }}>
        <Suspense fallback={<RouteLoading />}>
          <Routes>
            <Route path="/" element={<HomeView nav={nav} casesList={casesList} />} />
            <Route path="/catalogo" element={<CatalogView nav={nav} />} />
            <Route path="/comparativa" element={<ValorView stats={marketStats} />} />
            <Route path="/casos" element={<CasesView casesData={casesList} />} />
            <Route path="/agencia" element={<AboutView />} />
            <Route path="/contacto" element={<ContactRoute isMobile={isMobile} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>

      <footer style={{ padding: "20px 5vw", borderTop: `3px solid transparent`, borderImage: `linear-gradient(90deg, ${ACCENT}, ${AMBER2}, ${INK2}) 1`, background: BG2 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 24 }}>
          <div role="img" aria-label="Riders Media" style={{ display: "flex", alignItems: "center", gap: 3 }}>
             <LogoIcon size={24} />
             <span aria-hidden="true" className="font-display" style={{ fontWeight: 700, color: INK2, letterSpacing: "0.05em", fontSize: 18 }}>IDERS MEDIA</span>
          </div>

          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            {ROUTES_META.map(p => (
              <button key={p.id} onClick={() => nav(p.id)} style={{ background: "none", border: "none", color: INK2, fontSize: 12, fontWeight: 700, textTransform: "uppercase", cursor: "pointer" }}>
                {p.label}
              </button>
            ))}
          </div>

          <span style={{ color: INK3, fontSize: 13, fontWeight: 600 }}>© {new Date().getFullYear()} Puebla, MX.</span>
        </div>
      </footer>
    </div>
  );
}

// ── APP RAÍZ ─────────────────────────────────────────────────────────────
export default function App() {
  return (
    <BrowserRouter>
      <Shell />
    </BrowserRouter>
  );
}
