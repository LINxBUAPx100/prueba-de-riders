import React from "react";
import { COLORS, RADIUS } from "../data";
import { LOGO_R_PATH } from "./LogoIcon";

const { INK, INK2, ACCENT, BORDER } = COLORS;

// ── CHIP ─────────────────────────────────────────────────────────────────
// Sobre fondo claro el texto outline va en navy: el ámbar como texto sobre
// crema no pasa contraste WCAG (el borde ámbar sí, es gráfico).
export function Chip({ children, outline, accent }) {
  const isAccent = accent || !outline;
  return (
    <span className="font-display" style={{
      display: "inline-block",
      background: isAccent ? ACCENT : "transparent",
      color: isAccent ? INK : INK2,
      border: `1px solid ${ACCENT}`,
      padding: "5px 13px",
      borderRadius: RADIUS.pill,
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: "0.08em",
      textTransform: "uppercase"
    }}>
      {children}
    </span>
  );
}

// ── ETIQUETA DE SECCIÓN ──────────────────────────────────────────────────
// Texto navy sobre claro / ámbar sobre oscuro; el guion ámbar es el acento gráfico.
export function SectionLabel({ children, dark = false }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
      <span aria-hidden="true" style={{ width: 22, height: 3, background: ACCENT, borderRadius: 2, flexShrink: 0 }} />
      <span className="font-display" style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: dark ? ACCENT : INK2 }}>
        {children}
      </span>
      <span style={{ flex: 1, height: 1, background: dark ? "rgba(255,255,255,0.14)" : BORDER }} />
    </div>
  );
}

// ── PATRÓN DE MARCA (textura estática — solo en una sección oscura) ─────
export function PatternBg({ show = true, opacity = 0.03 }) {
  if (!show) return null;
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute", inset: 0,
        backgroundImage: "url('/patron.svg')",
        backgroundRepeat: "repeat",
        backgroundSize: "1200px",
        backgroundPosition: "top center",
        opacity,
        pointerEvents: "none",
        zIndex: 0
      }}
    />
  );
}

// ── MARCA DE AGUA: la "R" del logo, gigante y sutil (hero) ───────────────
// Única forma decorativa de la página; sustituye blobs, mesh y glass.
export function BrandWatermark({ color = ACCENT, opacity = 0.07 }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="240 240 700 700"
      style={{
        position: "absolute", right: "-14%", top: "50%",
        transform: "translateY(-50%)", height: "125%",
        opacity, pointerEvents: "none", zIndex: 0
      }}
    >
      <path fill={color} d={LOGO_R_PATH} />
    </svg>
  );
}
