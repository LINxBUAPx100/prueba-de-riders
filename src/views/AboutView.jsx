import React from "react";
import { COLORS } from "../data";
import { Reveal } from "../components/Reveal";
import { SectionLabel } from "../components/ui";

const { BG, INK, INK2, ACCENT, BORDER } = COLORS;

// ── SOBRE LA AGENCIA — composición editorial (sin tarjetas) ──────────────
export default function AboutView() {
  return (
    <div style={{ padding: "120px 6vw", background: BG, minHeight: "100vh" }}>
      <div style={{ maxWidth: "1600px", margin: "0 auto" }}>

        <Reveal style={{ maxWidth: 850, marginBottom: 100 }}>
          <SectionLabel>Sobre la Agencia</SectionLabel>
          <h1 className="font-display" style={{ fontSize: "clamp(48px, 6vw, 80px)", color: INK, fontWeight: 800, marginBottom: 40, textTransform: "uppercase", lineHeight: 0.95, letterSpacing: "-0.02em" }}>
            Unidad de<br /><span className="accent-underline">Respuesta Rápida.</span>
          </h1>
          <div style={{ color: INK2, fontSize: "clamp(16px, 1.5vw, 20px)", lineHeight: 1.8 }}>
            <p style={{ marginBottom: 32 }}>
              Riders Media fusiona la <strong style={{ color: INK }}>precisión técnica con la creatividad disruptiva.</strong> No somos una agencia de marketing convencional, no hacemos planes a 6 meses para cambiar el color de un botón.
            </p>
            <p style={{ marginBottom: 48 }}>
              Resolvemos el problema de la lentitud digital y la falta de transparencia en la industria. Somos eficaces en la entrega, rigurosos en el código (React) y 100% transparentes en el proceso.
            </p>
            <blockquote style={{
              borderLeft: `4px solid ${ACCENT}`, margin: 0,
              padding: "8px 0 8px 36px", fontStyle: "italic", color: INK,
              fontSize: "clamp(20px, 2vw, 28px)", fontWeight: 600, lineHeight: 1.5
            }}>
              "Construimos los activos digitales más rápidos de la región. Combinamos infraestructura web de alto nivel con producción visual premium para que tu negocio domine la atención."
            </blockquote>
          </div>
        </Reveal>

        {/* Misión y compromiso: columnas de texto sobre fondo continuo */}
        <Reveal group style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 64, borderTop: `1px solid ${BORDER}`, paddingTop: 72 }}>
          {[
            { label: "Nuestra Misión", body: "Impulsar el crecimiento de PyMEs mediante la construcción de infraestructuras web superiores y contenido visual que captura la atención en los primeros segundos de interacción." },
            { label: "Nuestro Compromiso", body: "Velocidad táctica de entrega, transparencia total en costos desde el día cero y resultados medibles orientados a conversión. Sin excusas, sin letra chica." }
          ].map((item, i) => (
            <div key={i}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                <span aria-hidden="true" style={{ width: 22, height: 3, background: ACCENT, borderRadius: 2 }} />
                <span className="font-display" style={{ fontSize: 12, fontWeight: 900, letterSpacing: "0.2em", textTransform: "uppercase", color: INK2 }}>{item.label}</span>
              </div>
              <p style={{ color: INK2, fontSize: 17, lineHeight: 1.75, maxWidth: "58ch" }}>{item.body}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </div>
  );
}
