import React, { useState } from "react";
import { COLORS, RADIUS } from "../data";
import { Reveal } from "../components/Reveal";
import { SectionLabel } from "../components/ui";

const { BG, SURFACE, INK, INK2, INK3, ACCENT, BORDER } = COLORS;

// ── CASOS DE ÉXITO — filas editoriales (sin tarjetas) ────────────────────
export default function CasesView({ casesData }) {
  const [hovered, setHovered] = useState(null);
  const safeCases = casesData && casesData.length > 0 ? casesData : [];

  return (
    <div style={{ padding: "120px 6vw", background: BG, minHeight: "100vh" }}>
      <div style={{ maxWidth: "1600px", margin: "0 auto" }}>

        <Reveal style={{ marginBottom: 80, display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 32 }}>
          <div>
            <SectionLabel>Evidencia Táctica</SectionLabel>
            <h1 className="font-display" style={{ fontSize: "clamp(48px, 6vw, 72px)", fontWeight: 800, textTransform: "uppercase", color: INK, lineHeight: 0.95, margin: 0, letterSpacing: "-0.02em" }}>
              Impacto <br /><span className="accent-underline">Real.</span>
            </h1>
          </div>
          <p style={{ fontSize: 17, color: INK2, lineHeight: 1.7, maxWidth: 480, margin: 0, paddingBottom: 8 }}>
            No vendemos humo ni métricas de vanidad. Diseñamos sistemas y activos visuales que se traducen directamente en crecimiento medible para tu negocio.
          </p>
        </Reveal>

        <div style={{ borderTop: `2px solid ${BORDER}` }}>
          {safeCases.length === 0 ? (
            <div style={{ padding: "60px 0", textAlign: "center", color: INK3, fontWeight: 700, fontSize: 18 }}>Cargando evidencia...</div>
          ) : (
            safeCases.map((c, i) => (
              <a key={i} href={c.link || "#"} target="_blank" rel="noopener noreferrer"
                onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}
                style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", padding: "40px 32px", borderBottom: `1px solid ${BORDER}`, position: "relative", cursor: "pointer", textDecoration: "none", transition: "all 0.3s ease", borderRadius: RADIUS.control, marginTop: 8 }}>
                <div style={{ position: "absolute", inset: 0, background: SURFACE, zIndex: 0, opacity: hovered === i ? 1 : 0, transition: "opacity 0.2s ease", borderRadius: RADIUS.control, boxShadow: hovered === i ? `0 10px 48px ${c.color}40, 0 0 0 1.5px ${c.color}60` : "none" }} />
                <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", gap: 12, flex: "1 1 200px" }}>
                  <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: hovered === i ? c.color : INK3, transition: "color 0.3s ease" }}>{c.cat}</div>
                  <div style={{ fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 800, color: INK, letterSpacing: "-0.01em", lineHeight: 1.1 }}>{c.client}</div>
                </div>
                <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: 32, flex: "1 1 auto", justifyContent: "flex-end" }}>
                  <div className="font-num" style={{ fontSize: "clamp(40px, 6vw, 64px)", fontWeight: 900, color: hovered === i ? c.color : INK2, lineHeight: 1, letterSpacing: "-0.02em", transition: "color 0.3s ease, transform 0.3s ease", transform: hovered === i ? "scale(1.05)" : "scale(1)", transformOrigin: "right center" }}>{c.result}</div>
                  <div aria-hidden="true" style={{ fontSize: 28, color: hovered === i ? c.color : BORDER, fontWeight: 300, transform: hovered === i ? "translateX(8px)" : "translateX(0)", transition: "all 0.3s ease" }}>→</div>
                </div>
              </a>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
