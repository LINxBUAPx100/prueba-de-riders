import React, { useState } from "react";
import { COLORS, GRAD, RADIUS } from "../data";

const { INK, INK2, INK3, ACCENT } = COLORS;

// ── BOTÓN UNIFICADO — jerarquía de color de marca ────────────────────────
// primary       → gradiente ámbar + texto INK + glow   (CONVERTIR / hablar)
// ghost-accent  → borde ámbar, transparente → relleno  (convertir, menor peso)
// secondary     → navy sólido / hover ámbar            (EXPLORAR / navegar)
// secondary-light → para fondos oscuros (borde claro)
// text          → enlace navy con subrayado ámbar      (inline; el ámbar como
//                  texto sobre crema no pasa contraste, por eso navy + acento)
export function Btn({ variant = "primary", children, onClick, type = "button", full = false, disabled = false, style = {} }) {
  const [h, setH] = useState(false);

  if (variant === "text") {
    return (
      <button
        type={type} onClick={onClick} disabled={disabled}
        onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
        style={{
          background: "none", border: "none", padding: 0,
          cursor: disabled ? "not-allowed" : "pointer",
          color: INK2, fontWeight: 800, fontSize: 13,
          boxShadow: `inset 0 -2px 0 ${ACCENT}`,
          letterSpacing: "0.06em", textTransform: "uppercase",
          fontFamily: "'Oswald', sans-serif",
          display: "inline-flex", alignItems: "center", gap: 6,
          transform: h ? "translateX(3px)" : "none",
          transition: "transform 0.2s ease",
          ...style
        }}
      >
        {children}
      </button>
    );
  }

  const base = {
    display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
    fontFamily: "'Oswald', sans-serif", fontWeight: 800, fontSize: 13,
    letterSpacing: "0.06em", textTransform: "uppercase",
    padding: "16px 34px", borderRadius: RADIUS.control, minHeight: 48,
    border: "2px solid transparent",
    width: full ? "100%" : "auto",
    cursor: disabled ? "not-allowed" : "pointer",
    transition: "transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease, color 0.2s ease, border-color 0.2s ease",
    ...style
  };

  let v = {};
  if (variant === "primary") {
    v = {
      background: GRAD.brandSoft, color: INK,
      boxShadow: h ? `0 14px 40px ${ACCENT}55` : `0 8px 24px ${ACCENT}38`,
      transform: h ? "translateY(-2px)" : "none"
    };
  } else if (variant === "ghost-accent") {
    v = {
      background: h ? GRAD.brandSoft : "transparent", color: INK,
      borderColor: h ? "transparent" : ACCENT,
      boxShadow: h ? `0 10px 28px ${ACCENT}40` : "none",
      transform: h ? "translateY(-1px)" : "none"
    };
  } else if (variant === "secondary") {
    v = {
      background: h ? ACCENT : INK2, color: h ? INK : "#fff",
      borderColor: h ? ACCENT : INK2,
      boxShadow: h ? `0 12px 30px ${INK2}33` : "none",
      transform: h ? "translateY(-2px)" : "none"
    };
  } else if (variant === "secondary-light") {
    v = {
      background: h ? "#fff" : "transparent", color: h ? INK : "#fff",
      borderColor: h ? "#fff" : "rgba(255,255,255,0.45)",
      transform: h ? "translateY(-2px)" : "none"
    };
  }

  if (disabled) v = { background: INK3, color: "#fff", boxShadow: "none", transform: "none", borderColor: "transparent" };

  return (
    <button
      type={type} onClick={onClick} disabled={disabled}
      className="rm-btn"
      onMouseEnter={() => !disabled && setH(true)} onMouseLeave={() => !disabled && setH(false)}
      style={{ ...base, ...v }}
    >
      {children}
    </button>
  );
}
