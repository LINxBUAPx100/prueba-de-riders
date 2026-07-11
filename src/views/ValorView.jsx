import React from "react";
import { COLORS, RADIUS, NAVY_BG } from "../data";
import { useInView } from "../hooks/useInView";
import { Reveal } from "../components/Reveal";
import { SectionLabel } from "../components/ui";

const { ACCENT } = COLORS;

// Colores de series con buen contraste sobre fondo oscuro
const C_FREE   = "#9AA6B8";
const C_AGENCY = "#4F7BC4";
const C_RIDERS = ACCENT;
const D_BORDER = "rgba(255,255,255,0.12)";
const D_TRACK  = "rgba(255,255,255,0.10)";
const D_TXT    = "#ffffff";
const D_TXT2   = "rgba(255,255,255,0.70)";
const D_TXT3   = "rgba(255,255,255,0.55)";

// ── BLOQUE DE ESTADÍSTICA — una sola familia de gráfica ──────────────────
// Barras horizontales comparativas para TODOS los datos (antes había 4
// estilos de tarjeta distintos compitiendo: KPI, anillos, barras, carrera).
// Sin tarjeta: bloques sobre fondo continuo separados por reglas.
function StatBlock({ stat }) {
  const maxVal  = Math.max(stat.freelance, stat.agencias, stat.riders);
  const safeMax = maxVal === 0 ? 1 : maxVal;
  const isMoney = maxVal > 1000;
  const fmt = (n) => isMoney ? `$${(n / 1000).toFixed(0)}k` : `${n}${stat.unidad || ""}`;
  const bars = [
    { name: "Freelance", val: stat.freelance, color: C_FREE,   textColor: D_TXT3 },
    { name: "Agencias",  val: stat.agencias,  color: C_AGENCY, textColor: D_TXT2 },
    { name: "Riders",    val: stat.riders,    color: C_RIDERS, textColor: ACCENT },
  ];
  const [ref, inView] = useInView();

  return (
    <div ref={ref} style={{ padding: "34px 0", borderBottom: `1px solid ${D_BORDER}` }}>
      <h3 style={{ fontSize: 12, fontWeight: 900, color: D_TXT, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 24 }}>{stat.label}</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {bars.map((bar, i) => (
          <div key={bar.name}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, alignItems: "baseline" }}>
              <span style={{ fontSize: 10, fontWeight: 800, color: bar.textColor, textTransform: "uppercase", letterSpacing: "0.06em" }}>{bar.name}</span>
              <span className="font-num" style={{ fontSize: 14, fontWeight: 900, color: bar.textColor }}>{fmt(bar.val)}</span>
            </div>
            <div style={{ height: 8, background: D_TRACK, borderRadius: 4, overflow: "hidden" }}>
              <div style={{
                height: "100%",
                width: inView ? `${(bar.val / safeMax) * 100}%` : "0%",
                background: bar.color, borderRadius: 4,
                transition: "width 1.2s cubic-bezier(0.4,0,0.2,1)",
                transitionDelay: `${i * 0.12}s`
              }} />
            </div>
          </div>
        ))}
      </div>
      {stat.description && (
        <p style={{ fontSize: 13.5, color: D_TXT2, marginTop: 20, lineHeight: 1.6 }}>{stat.description}</p>
      )}
    </div>
  );
}

// ── VISTA COMPARATIVA DE MERCADO ─────────────────────────────────────────
export default function ValorView({ stats }) {
  if (!stats || stats.length === 0) {
    return (
      <div style={{ padding: "120px 6vw", minHeight: "100vh", background: NAVY_BG }}>
        <div style={{ maxWidth: 1400, margin: "0 auto" }}>
          <SectionLabel dark>Análisis de Mercado</SectionLabel>
          <p style={{ fontWeight: 700, color: D_TXT2, marginTop: 32 }}>Cargando análisis de mercado...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "120px 6vw", minHeight: "100vh", background: NAVY_BG }}>
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>

        {/* ── ENCABEZADO + LEYENDA ── */}
        <Reveal><SectionLabel dark>Análisis de Mercado</SectionLabel></Reveal>
        <Reveal style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 24, marginBottom: 40 }}>
          <h1 className="font-display" style={{ fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 800, margin: 0, color: D_TXT, lineHeight: 1.05, letterSpacing: "-0.02em" }}>
            ¿Por qué Riders es la <span style={{ color: ACCENT }}>opción lógica?</span>
          </h1>

          <div style={{ display: "flex", gap: 18, padding: "12px 20px", borderRadius: RADIUS.control, border: `1px solid ${D_BORDER}`, flexShrink: 0 }}>
            {[{ color: C_FREE, label: "Freelance" }, { color: C_AGENCY, label: "Agencias" }, { color: C_RIDERS, label: "Riders" }].map(item => (
              <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <div aria-hidden="true" style={{ width: 10, height: 10, borderRadius: 3, background: item.color }} />
                <span style={{ fontSize: 10, fontWeight: 800, color: item.color === ACCENT ? ACCENT : D_TXT2, textTransform: "uppercase", letterSpacing: "0.08em" }}>{item.label}</span>
              </div>
            ))}
          </div>
        </Reveal>

        {/* ── COMPARATIVA — sección continua, una gráfica por dato ── */}
        <Reveal group style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", columnGap: 72, borderTop: `1px solid ${D_BORDER}` }}>
          {stats.map((stat, i) => <StatBlock key={i} stat={stat} />)}
        </Reveal>

        <p style={{ fontSize: 12.5, color: D_TXT3, marginTop: 32, maxWidth: 640, lineHeight: 1.6 }}>
          Comparativa basada en tarifas y tiempos típicos observados en el mercado local
          (freelancers y agencias tradicionales de la región) frente a nuestro catálogo público.
        </p>

      </div>
    </div>
  );
}
