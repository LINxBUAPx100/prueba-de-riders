import React from "react";
import { COLORS, GRAD, CATALOG, PILLARS, CATALOGO_CSV_URL, NAVY_BG } from "../data";
import { useSheetData } from "../hooks/useSheetData";
import { mapServiceRows } from "../sheetMappers";
import { Reveal, Counter } from "../components/Reveal";
import { Btn } from "../components/Btn";
import { SectionLabel, PatternBg, BrandWatermark } from "../components/ui";
import { IconBolt, IconTarget, IconShield, IconSpark } from "../components/icons";

const { BG, INK, INK2, INK3, ACCENT, BORDER } = COLORS;

// ── PÁGINA DE INICIO — composición editorial (Dirección B) ───────────────
// Una sola composición por sección: sin tiles bento, sin glassmorphism,
// sin mesh gradients animados. La única forma decorativa es la "R" de marca.
export default function HomeView({ nav, casesList = [] }) {
  const { data: tickerData } = useSheetData(CATALOGO_CSV_URL, { mapRows: mapServiceRows, fallback: CATALOG });

  const clients = casesList.map(c => c.client);
  const shouldAnimate = clients.length >= 3;
  const displayClients = shouldAnimate
    ? [...clients, ...clients, ...clients, ...clients]
    : clients;

  return (
    <div style={{ background: BG }}>

      <style>{`
        @keyframes pulseLight {
          0%   { opacity: 1;   transform: scale(1);    box-shadow: 0 0 14px ${ACCENT}; }
          50%  { opacity: 0.5; transform: scale(0.85); box-shadow: 0 0 4px  ${ACCENT}; }
          100% { opacity: 1;   transform: scale(1);    box-shadow: 0 0 14px ${ACCENT}; }
        }
        .status-indicator { animation: pulseLight 2s ease-in-out infinite; }

        @keyframes scrollTicker {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .ticker-track { display: flex; width: max-content; will-change: transform; }

        .social-proof-track { display: flex; width: max-content; }
        @keyframes scrollSocialProof { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .social-proof-animated { animation: scrollSocialProof 40s linear infinite; }
        .social-proof-track:not(.social-proof-animated) span:last-child { padding-right: 0 !important; }

        /* Filosofía: divisores verticales en desktop, horizontales en móvil */
        .pillar-row { display: grid; grid-template-columns: repeat(3, 1fr); }
        .pillar-item { padding: 12px 40px; border-left: 1px solid rgba(255,255,255,0.14); }
        .pillar-item:first-child { border-left: none; padding-left: 0; }
        @media (max-width: 860px) {
          .pillar-row { grid-template-columns: 1fr; }
          .pillar-item { border-left: none !important; border-top: 1px solid rgba(255,255,255,0.14); padding: 28px 0; }
          .pillar-item:first-child { border-top: none; padding-top: 0; }
        }
      `}</style>

      {/* ── HERO EDITORIAL ─────────────────────────────────────── */}
      <section style={{
        padding: "96px 6vw 150px",
        position: "relative", overflow: "hidden",
        minHeight: "88vh",
        display: "flex", flexDirection: "column", justifyContent: "center",
        borderBottom: `1px solid ${BORDER}`
      }}>
        <BrandWatermark />

        <div style={{ position: "relative", zIndex: 2, maxWidth: 1400, margin: "0 auto", width: "100%" }}>
          <div style={{ maxWidth: 780 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
              <div className="status-indicator" style={{ width: 10, height: 10, borderRadius: "50%", background: ACCENT }} />
              <span className="font-display" style={{ fontSize: 12, fontWeight: 600, color: INK3, letterSpacing: "0.15em", textTransform: "uppercase" }}>
                Unidad de Respuesta Rápida · Puebla, MX
              </span>
            </div>

            <h1 className="font-display" style={{
              fontSize: "clamp(52px, 8vw, 112px)",
              color: INK, fontWeight: 800, lineHeight: 0.96,
              letterSpacing: "-0.02em", marginBottom: 26
            }}>
              De la idea<br />a la <span className="accent-underline">realidad.</span>
            </h1>

            <p style={{
              fontSize: "clamp(12px, 1vw, 14px)", color: INK3, maxWidth: 520,
              lineHeight: 1.5, marginBottom: 18, fontWeight: 700,
              textTransform: "uppercase", letterSpacing: "0.08em"
            }}>
              Dirección visual premium e infraestructura web de alto rendimiento.
            </p>

            <p style={{ fontSize: "clamp(15px, 1.2vw, 18px)", color: INK2, maxWidth: 560, lineHeight: 1.7, marginBottom: 36 }}>
              En Riders Media no improvisamos. Somos una unidad estratégica especializada
              en <strong style={{ color: INK }}>motion graphics y desarrollo avanzado</strong> con
              React. Aceleramos tu crecimiento con ejecuciones quirúrgicas,
              transparencia absoluta en los costos y entregables que dominan la atención.
            </p>

            <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 44 }}>
              <Btn variant="primary" onClick={() => nav("contacto")}>Agendar Llamada</Btn>
              <Btn variant="secondary" onClick={() => nav("catalogo")}>Ver Catálogo 2026 →</Btn>
            </div>

            {/* Línea de prueba: hechos verificables, no adornos */}
            <div style={{ display: "flex", gap: 28, flexWrap: "wrap" }}>
              {["Respuesta en 48h", "Precios públicos", "Enfoque B2B"].map(t => (
                <span key={t} className="font-display" style={{ display: "inline-flex", alignItems: "center", gap: 9, fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: INK2 }}>
                  <span aria-hidden="true" style={{ width: 14, height: 3, background: ACCENT, borderRadius: 2 }} /> {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* TICKER INFERIOR (única animación continua del hero) */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          borderTop: `1px solid ${BORDER}`, padding: "14px 0",
          background: BG,
          zIndex: 3, overflow: "hidden"
        }}>
          <div className="ticker-track" style={{ animation: `scrollTicker ${Math.max(50, tickerData.length * 5)}s linear infinite` }}>
            {[...tickerData, ...tickerData].map((s, i) => (
              <span key={i} style={{
                color: i % 2 === 0 ? INK2 : INK3, fontWeight: 800, fontSize: 13,
                textTransform: "uppercase", letterSpacing: "0.12em",
                whiteSpace: "nowrap", paddingRight: "48px"
              }}>
                {s.name} •
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── EL ESTÁNDAR RIDERS — lista editorial, sin tarjetas ── */}
      <section style={{ padding: "120px 6vw", background: BG }}>
        <div style={{ maxWidth: 1400, margin: "0 auto" }}>
          <Reveal><SectionLabel>El Estándar Riders</SectionLabel></Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 64, marginTop: 40 }}>
            <Reveal>
              <div>
                <h2 className="font-display" style={{
                  fontSize: "clamp(34px, 5vw, 52px)", color: INK, fontWeight: 800,
                  lineHeight: 1.05, marginBottom: 24, letterSpacing: "-0.01em"
                }}>
                  La industria digital es <span style={{ color: INK3 }}>lenta y confusa.</span>
                </h2>
                <p style={{ color: INK2, fontSize: 17, lineHeight: 1.7, marginBottom: 32 }}>
                  Las agencias tradicionales te atrapan en juntas interminables, contratos ocultos
                  y meses de espera para lanzar una campaña básica. Tu negocio necesita moverse
                  al ritmo del mercado.
                </p>
                <Btn variant="text" onClick={() => nav("valor")}>Conoce cómo trabajamos →</Btn>
              </div>
            </Reveal>

            <Reveal group>
              {[
                { icon: <IconBolt />,   title: "Velocidad Táctica",     desc: "Sistemas estructurados para entregar proyectos en días, no en meses." },
                { icon: <IconTarget />, title: "Foco en Conversión",    desc: "Un diseño bonito que no vende es arte. Nosotros hacemos negocios." },
                { icon: <IconShield />, title: "Transparencia Radical", desc: "Catálogo público. Sabes exactamente qué incluye y cuánto cuesta." }
              ].map((item, i) => (
                <div key={i} style={{
                  display: "flex", gap: 22, alignItems: "flex-start",
                  padding: "28px 0",
                  borderTop: i === 0 ? `1px solid ${BORDER}` : "none",
                  borderBottom: `1px solid ${BORDER}`
                }}>
                  <div aria-hidden="true" style={{ flexShrink: 0, color: ACCENT, marginTop: 2 }}>{item.icon}</div>
                  <div>
                    <h3 style={{ fontSize: 17, fontWeight: 800, color: INK, marginBottom: 6 }}>{item.title}</h3>
                    <p style={{ fontSize: 15, color: INK2, lineHeight: 1.65 }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── MÉTRICAS — banda ámbar ───────────────────────────── */}
      <section style={{ padding: "38px 6vw", background: GRAD.brand }}>
        <Reveal group style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 32, maxWidth: 1400, margin: "0 auto" }}>
          {[
            { val: "48h",              lab: "Tiempo de Respuesta" },
            { val: "100%",             lab: "Transparencia de Costos" },
            { val: tickerData.length,  lab: "Servicios Activos" },
            { val: "B2B",              lab: "Enfoque Principal" }
          ].map((m, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <Counter className="font-num" value={m.val} style={{ fontSize: "clamp(40px, 5vw, 64px)", fontWeight: 900, color: INK, lineHeight: 1, display: "block" }} />
              <div style={{ fontSize: 11, fontWeight: 800, color: INK2, textTransform: "uppercase", marginTop: 8, letterSpacing: "0.12em" }}>{m.lab}</div>
            </div>
          ))}
        </Reveal>
      </section>

      {/* ── FILOSOFÍA — franja navy continua con divisores ────── */}
      <section style={{ padding: "100px 6vw", background: NAVY_BG, position: "relative", overflow: "hidden" }}>
        <PatternBg opacity={0.025} />
        <div style={{ position: "relative", zIndex: 2, maxWidth: 1400, margin: "0 auto" }}>
          <Reveal><SectionLabel dark>Filosofía</SectionLabel></Reveal>
          <Reveal group className="pillar-row" style={{ marginTop: 48 }}>
            {PILLARS.map(p => (
              <div key={p.num} className="pillar-item">
                <div className="font-num" style={{ fontSize: 64, fontWeight: 900, color: ACCENT, marginBottom: 16, lineHeight: 1 }}>{p.num}</div>
                <h3 className="font-display" style={{ fontSize: 30, color: "#ffffff", marginBottom: 12, fontWeight: 700 }}>{p.title}</h3>
                <p style={{ color: "rgba(255,255,255,0.65)", lineHeight: 1.7, fontSize: 15, maxWidth: 340 }}>{p.body}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ── CTA DE CIERRE — navy sólido, un solo glow estático ── */}
      <section style={{
        padding: "130px 6vw",
        textAlign: "center", position: "relative", overflow: "hidden",
        background: "linear-gradient(160deg, #0f2336 0%, #183457 100%)"
      }}>
        <div aria-hidden="true" style={{
          position: "absolute", top: "-25%", left: "50%",
          transform: "translateX(-50%)",
          width: 720, height: 380, borderRadius: "50%",
          background: `radial-gradient(ellipse, ${ACCENT}1e 0%, transparent 65%)`,
          filter: "blur(60px)", pointerEvents: "none"
        }} />
        <Reveal style={{ position: "relative", maxWidth: 720, margin: "0 auto" }}>
          <div style={{
            width: 64, height: 64, border: `2px solid ${ACCENT}`,
            borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 32px", color: ACCENT
          }}><IconSpark size={26} /></div>
          <h2 className="font-display" style={{
            fontSize: "clamp(40px, 6vw, 64px)", color: "#ffffff", fontWeight: 800,
            lineHeight: 1.02, marginBottom: 24, letterSpacing: "-0.02em"
          }}>
            ¿Listo para acelerar tu crecimiento?
          </h2>
          <p style={{ color: "rgba(255,255,255,0.68)", fontSize: 18, lineHeight: 1.6, marginBottom: 40, maxWidth: 600, marginLeft: "auto", marginRight: "auto" }}>
            Deja de perder tiempo y dinero con soluciones genéricas. Habla directamente
            con nosotros y pongamos a trabajar tu marca.
          </p>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Btn variant="primary" onClick={() => nav("contacto")} style={{ padding: "20px 52px", fontSize: 14 }}>
              Cotizar Mi Proyecto
            </Btn>
          </div>
        </Reveal>
      </section>

      {/* ── SOCIAL PROOF ──────────────────────────────────────── */}
      <section style={{ padding: "20px 0 30px", background: INK2, borderTop: `3px solid ${ACCENT}`, textAlign: "center", overflow: "hidden" }}>
        <p style={{ fontSize: 11, fontWeight: 800, color: "rgba(255,255,255,0.38)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 16 }}>
          — Marcas que confían en nosotros —
        </p>
        {clients.length === 0 ? (
          <div className="font-num" style={{ fontSize: "clamp(18px, 3vw, 24px)", fontWeight: 900, color: "rgba(255,255,255,0.25)" }}>
            Podrías ser el primero
          </div>
        ) : (
          <div style={{ display: "flex", justifyContent: shouldAnimate ? "flex-start" : "center" }}>
            <div className={`social-proof-track ${shouldAnimate ? "social-proof-animated" : ""}`}>
              {displayClients.map((clientName, i) => (
                <span key={i} className="font-num" style={{
                  fontSize: "clamp(18px, 3vw, 24px)", fontWeight: 900,
                  color: "rgba(255,255,255,0.32)", whiteSpace: "nowrap",
                  paddingRight: "clamp(40px, 8vw, 100px)"
                }}>
                  {clientName}
                </span>
              ))}
            </div>
          </div>
        )}
      </section>

    </div>
  );
}
