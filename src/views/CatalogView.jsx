import React from "react";
import { COLORS, RADIUS, SHADOW, CATALOGO_CSV_URL } from "../data";
import { useSheetData } from "../hooks/useSheetData";
import { useIsMobile } from "../hooks/useIsMobile";
import { mapCatalogRows } from "../sheetMappers";
import { Reveal } from "../components/Reveal";
import { Btn } from "../components/Btn";
import { Chip, SectionLabel } from "../components/ui";

const { BG, BG2, SURFACE, INK, INK2, INK3, ACCENT, BORDER, MUTED_RED } = COLORS;

const CATALOG_ERROR_MESSAGES = {
  "fallback-papa":    "⚠️ Error: El script de PapaParse no se ha cargado en el index.html.",
  "fallback-private": "⚠️ El Google Sheet está privado. Cambia a 'Cualquier persona con el enlace'.",
  "fallback-empty":   "⚠️ El Excel conectó, pero las columnas no se llaman exactamente 'Servicio', 'Tipo de Pago', etc.",
  "fallback-network": "⚠️ Error de red al intentar descargar el Excel.",
};

// ── Precio con tachado opcional ──────────────────────────────────────────
function PriceBlock({ realPrice, price, big = true }) {
  return (
    <div>
      {realPrice && (
        <div className="font-num" style={{ fontSize: big ? 22 : 18, color: INK3, textDecoration: "line-through", marginBottom: -4, fontWeight: 600 }}>
          {realPrice}
        </div>
      )}
      <div className="font-num" style={{ fontSize: big ? 52 : 40, fontWeight: 900, color: INK, letterSpacing: "-0.02em", lineHeight: 1.05 }}>
        {price}{" "}
        <span style={{ fontSize: 16, fontWeight: 600, color: INK3 }}>MXN</span>
      </div>
    </div>
  );
}

// ── Tarjeta individual de servicio ───────────────────────────────────────
function ServiceCard({ s, nav }) {
  return (
    <div
      style={{
        background: s.highlight ? BG2 : SURFACE,
        border: `1px solid ${s.highlight ? ACCENT + "60" : BORDER}`,
        padding: "40px", borderRadius: RADIUS.control,
        position: "relative", display: "flex", flexDirection: "column",
        boxShadow: SHADOW.lift,
        transition: "transform 0.25s, border-color 0.25s, box-shadow 0.25s"
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = SHADOW.liftHover;
        e.currentTarget.style.borderColor = ACCENT;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = SHADOW.lift;
        e.currentTarget.style.borderColor = s.highlight ? `${ACCENT}60` : BORDER;
      }}
    >
      {s.highlight && (
        <div style={{
          position: "absolute", top: 16, right: 16,
          background: ACCENT, color: INK, fontSize: 10, fontWeight: 900,
          letterSpacing: "0.1em", textTransform: "uppercase",
          padding: "4px 12px", borderRadius: RADIUS.pill
        }}>Popular</div>
      )}

      <div>
        <Chip outline={!s.highlight}>{s.tag}</Chip>
        <div style={{ marginTop: 24, marginBottom: 8 }}>
          <PriceBlock realPrice={s.realPrice} price={s.price} />
        </div>
        <h3 style={{ fontSize: 22, color: INK, margin: "0 0 12px", fontWeight: 800 }}>{s.name}</h3>
      </div>

      <p style={{ color: INK2, fontSize: 14, minHeight: 60, marginBottom: 28, lineHeight: 1.65, flexGrow: 1 }}>{s.desc}</p>

      <Btn variant={s.highlight ? "primary" : "ghost-accent"} full onClick={() => nav("contacto", s.name)}>
        Cotizar este servicio →
      </Btn>
    </div>
  );
}

// ── Tabla comparativa: paquetes mensuales lado a lado (desktop) ──────────
// Comparar planes similares columna a columna reduce la carga de decidir;
// en móvil se degradan a tarjetas apiladas.
function MonthlyTable({ items, nav }) {
  return (
    <div style={{ overflowX: "auto", border: `1px solid ${BORDER}`, borderRadius: RADIUS.control, background: SURFACE, boxShadow: SHADOW.lift }}>
      <table style={{ width: "100%", borderCollapse: "collapse", minWidth: items.length * 280 }}>
        <caption style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }}>
          Comparativa de paquetes mensuales
        </caption>
        <thead>
          <tr>
            {items.map((s, i) => (
              <th key={s.id} scope="col" style={{
                padding: "32px 28px 4px", textAlign: "left", verticalAlign: "top",
                borderLeft: i > 0 ? `1px solid ${BORDER}` : "none",
                background: s.highlight ? MUTED_RED : "transparent"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, minHeight: 24 }}>
                  <Chip outline={!s.highlight}>{s.tag}</Chip>
                  {s.highlight && (
                    <span style={{ background: ACCENT, color: INK, fontSize: 10, fontWeight: 900, letterSpacing: "0.1em", textTransform: "uppercase", padding: "4px 12px", borderRadius: RADIUS.pill }}>Popular</span>
                  )}
                </div>
                <div style={{ fontSize: 22, color: INK, fontWeight: 800 }}>{s.name}</div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {items.map((s, i) => (
              <td key={s.id} style={{ padding: "16px 28px 8px", verticalAlign: "top", borderLeft: i > 0 ? `1px solid ${BORDER}` : "none", background: s.highlight ? MUTED_RED : "transparent" }}>
                <PriceBlock realPrice={s.realPrice} price={s.price} big={false} />
              </td>
            ))}
          </tr>
          <tr>
            {items.map((s, i) => (
              <td key={s.id} style={{ padding: "8px 28px 20px", verticalAlign: "top", borderLeft: i > 0 ? `1px solid ${BORDER}` : "none", background: s.highlight ? MUTED_RED : "transparent" }}>
                <p style={{ color: INK2, fontSize: 14, lineHeight: 1.65, margin: 0 }}>{s.desc}</p>
              </td>
            ))}
          </tr>
          <tr>
            {items.map((s, i) => (
              <td key={s.id} style={{ padding: "8px 28px 32px", verticalAlign: "bottom", borderLeft: i > 0 ? `1px solid ${BORDER}` : "none", background: s.highlight ? MUTED_RED : "transparent" }}>
                <Btn variant={s.highlight ? "primary" : "ghost-accent"} full onClick={() => nav("contacto", s.name)}>
                  Cotizar →
                </Btn>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

// ── VISTA DE CATÁLOGO ────────────────────────────────────────────────────
export default function CatalogView({ nav }) {
  const { data: catalog, status } = useSheetData(CATALOGO_CSV_URL, { mapRows: mapCatalogRows, fallback: [] });
  const isMobile = useIsMobile();
  const isLoading = status === "loading";
  const errorMsg = CATALOG_ERROR_MESSAGES[status] || "";

  const monthly  = catalog.filter(s => s.tag && s.tag.toLowerCase().includes("mensual"));
  const oneTime  = catalog.filter(s => s.tag && (s.tag.toLowerCase().includes("único") || s.tag.toLowerCase().includes("unico")));
  const perPiece = catalog.filter(s => s.tag && s.tag.toLowerCase().includes("pieza"));

  function Section({ title, items, compare = false }) {
    if (items.length === 0) return null;
    // Los paquetes mensuales (2-4 planes) se comparan mejor en tabla; en móvil, tarjetas.
    const asTable = compare && !isMobile && items.length >= 2 && items.length <= 4;
    return (
      <div style={{ marginBottom: 72 }}>
        <Reveal><SectionLabel>{title}</SectionLabel></Reveal>
        {asTable ? (
          <Reveal><MonthlyTable items={items} nav={nav} /></Reveal>
        ) : (
          <Reveal group style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 }}>
            {items.map(s => <ServiceCard key={s.id} s={s} nav={nav} />)}
          </Reveal>
        )}
      </div>
    );
  }

  // ── pantalla de carga ────────────────────────────────────────
  if (isLoading) {
    return (
      <div style={{
        padding: "120px 6vw", background: BG, minHeight: "50vh",
        display: "flex", justifyContent: "center", alignItems: "center"
      }}>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: 56, height: 56, borderRadius: "50%",
            border: `3px solid ${BORDER}`, borderTopColor: ACCENT,
            margin: "0 auto 24px", animation: "spin 0.9s linear infinite"
          }} />
          <h2 className="font-num" style={{ color: INK, fontSize: "clamp(20px, 3vw, 28px)", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 900 }}>
            Cargando catálogo...
          </h2>
        </div>
      </div>
    );
  }

  // ── vista principal ──────────────────────────────────────────
  return (
    <div style={{ padding: "120px 6vw", background: BG }}>
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>

        <Reveal style={{ maxWidth: 700, marginBottom: 80 }}>
          <Chip accent>Tarifas Transparentes</Chip>
          <h1 className="font-display" style={{
            fontSize: "clamp(48px, 7vw, 72px)", color: INK, marginTop: 24, marginBottom: 20,
            fontWeight: 800, textTransform: "uppercase", lineHeight: 0.95, letterSpacing: "-0.02em"
          }}>
            Servicios &<br />
            <span className="accent-underline">Precios.</span>
          </h1>
          <p style={{ color: INK2, fontSize: 18, lineHeight: 1.7 }}>
            Sin letra chica. Sin sorpresas. Todos los precios son desde —
            cotizamos según tu proyecto.
          </p>
          {errorMsg && (
            <div style={{ marginTop: 28, padding: "20px 24px", background: MUTED_RED, color: INK, border: `2px solid ${ACCENT}`, borderRadius: RADIUS.control, fontWeight: 700, fontSize: 14 }}>
              {errorMsg}
            </div>
          )}
        </Reveal>

        <Section title="Por pieza"          items={perPiece} />
        <Section title="Pago único"         items={oneTime}  />
        <Section title="Paquetes mensuales" items={monthly} compare />

      </div>
    </div>
  );
}
