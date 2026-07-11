import React, { useState } from "react";
import { COLORS, CASES, CASES_CSV_URL, SHEET_CSV_URL, GRAD } from "./data";
import { useSheetData } from "./hooks/useSheetData";
import { useIsMobile } from "./hooks/useIsMobile";
import { mapStatRows, mapStatCols, mapCaseCols } from "./sheetMappers";
import { LogoIcon } from "./components/LogoIcon";
import { Btn } from "./components/Btn";
import { ScrollProgress } from "./components/ScrollProgress";
import { SocialFloat } from "./components/SocialFloat";
import { IconMenu, IconClose } from "./components/icons";
import HomeView from "./views/HomeView";
import CatalogView from "./views/CatalogView";
import ValorView from "./views/ValorView";
import CasesView from "./views/CasesView";
import AboutView from "./views/AboutView";
import ContactView from "./views/ContactView";
import "./index.css";

const { BG, BG2, INK, INK2, INK3, ACCENT, AMBER2, BORDER } = COLORS;

// ── APP RAÍZ — shell: nav, footer y enrutado por estado ──────────────────
export default function App() {
  const [page, setPage] = useState("inicio");
  const [preselectedService, setPreselectedService] = useState(null);

  const { data: marketStats } = useSheetData(SHEET_CSV_URL, { mapRows: mapStatRows, mapCols: mapStatCols, fallback: [] });
  const { data: casesList }   = useSheetData(CASES_CSV_URL, { mapCols: mapCaseCols, fallback: CASES || [] });

  const isMobile = useIsMobile();
  const [menuOpen, setMenuOpen] = useState(false);

  const nav = (p, serviceName = null) => {
    setPage(p);
    setPreselectedService(serviceName);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const PAGES = [
    { id: "inicio", label: "Inicio" },
    { id: "catalogo", label: "Catálogo" },
    { id: "valor", label: "Comparativa" },
    { id: "casos", label: "Casos" },
    { id: "agencia", label: "Agencia" },
    { id: "contacto", label: "Contacto" },
  ];

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
              {PAGES.map(p => (
                <button key={p.id} onClick={() => nav(p.id)} aria-current={page === p.id ? "page" : undefined} style={{ background: "none", border: "none", cursor: "pointer", color: page === p.id ? INK : INK2, fontSize: "12px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", padding: "8px 0", borderBottom: page === p.id ? `2px solid ${ACCENT}` : "2px solid transparent", transition: "all 0.2s" }}>
                  {p.label}
                </button>
              ))}
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
           {PAGES.map(p => (
             <button key={p.id} onClick={() => nav(p.id)} aria-current={page === p.id ? "page" : undefined} style={{ background: "none", border: "none", color: INK, fontSize: "16px", fontWeight: 800, textTransform: "uppercase", textAlign: "left", padding: "15px 0", paddingLeft: page === p.id ? 12 : 0, borderLeft: page === p.id ? `3px solid ${ACCENT}` : "none", borderBottom: `1px solid ${BORDER}` }}>
               {p.label}
             </button>
           ))}
           <div style={{ marginTop: 15 }}>
             <Btn variant="primary" full onClick={() => nav("contacto")}>Cotizar</Btn>
           </div>
        </div>
      )}

      <main style={{ flex: 1, paddingTop: "80px" }}>
        {page === "inicio" && <HomeView nav={nav} casesList={casesList} />}
        {page === "catalogo" && <CatalogView nav={nav} />}
        {page === "valor" && <ValorView stats={marketStats} />}
        {page === "casos" && <CasesView casesData={casesList} />}
        {page === "agencia" && <AboutView />}
        {page === "contacto" && <ContactView isMobile={isMobile} initialService={preselectedService} />}
      </main>

      <footer style={{ padding: "20px 5vw", borderTop: `3px solid transparent`, borderImage: `linear-gradient(90deg, ${ACCENT}, ${AMBER2}, ${INK2}) 1`, background: BG2 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 24 }}>
          <div role="img" aria-label="Riders Media" style={{ display: "flex", alignItems: "center", gap: 3 }}>
             <LogoIcon size={24} />
             <span aria-hidden="true" className="font-display" style={{ fontWeight: 700, color: INK2, letterSpacing: "0.05em", fontSize: 18 }}>IDERS MEDIA</span>
          </div>

          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            {PAGES.map(p => (
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
