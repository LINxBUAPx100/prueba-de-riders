import React, { useState, useEffect } from "react";
import emailjs from '@emailjs/browser';
import { COLORS, CATALOG, CASES, PILLARS, CASES_CSV_URL, SHEET_CSV_URL, CATALOGO_CSV_URL,} from "./data";
import "./index.css";

const { BG, BG2, SURFACE, INK, INK2, INK3, ACCENT, ACCENT2, BORDER, RIDERS, SUCCESS, WARNING, INFO, MUTED_RED, MUTED_TEAL, TERRA } = COLORS;

// ── PATRÓN DE FONDO: cambia a false para ocultar por sección ─────────────
const PATRON = {
  global:         false, // Overlay fijo sobre TODA la página (evita duplicados con secciones)
  filosofia:      true,  // HomeView — sección filosofía (fondo oscuro)
  catalogo_carga: true,  // CatalogView — pantalla de carga animada
  catalogo:       true,  // CatalogView — vista principal
  valor:          true,  // ValorView — análisis de mercado
  casos:          true,  // CasesView — casos de éxito
  agencia:        false, // AboutView — sobre la agencia
  contacto:       false, // ContactView — página de contacto
};


// ── HOOK RESPONSIVE (DETECTOR DE CELULARES) ──────────────────────────────
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 800);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 800);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return isMobile;
}

// ── COMPONENTES UI ───────────────────────────────────────────────────────
function Chip({ children, outline, accent }) {
  const isAccent = accent || !outline;
  return (
    <span style={{ 
      display: "inline-block", 
      background: isAccent ? ACCENT : "transparent", 
      color: isAccent ? "#fff" : ACCENT, 
      border: `1px solid ${ACCENT}`, 
      padding: "4px 12px", 
      borderRadius: "20px", 
      fontSize: 10, 
      fontWeight: 700, 
      letterSpacing: "0.05em", 
      textTransform: "uppercase" 
    }}>
      {children}
    </span>
  );
}

function LogoIcon({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 1080 1080" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill="#F5A623" d="M787.11,0h-494.22C131.13,0,0,131.13,0,292.89v494.22c0,161.76,131.13,292.89,292.89,292.89h494.22c161.76,0,292.89-131.13,292.89-292.89v-494.22C1080,131.13,948.87,0,787.11,0ZM807.56,539.99h-52.57c-40.5,0-73.34-32.84-73.34-73.34v-52.65c0-21.19-17.18-38.38-38.38-38.38h-201.35l365.64,365.64-89.03,89.02-320.18-320.17v194.27c0,34.75-14.08,66.23-36.88,89.02-22.79,22.8-54.27,36.88-89.03,36.88V249.72h405.8c71.42,0,129.32,57.89,129.32,129.31v160.96Z"/>
    </svg>
  );
}

function SectionLabel({ children }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
      <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: "0.15em", textTransform: "uppercase", color: ACCENT }}>
        {children}
      </span>
      <span style={{ flex: 1, height: 1, background: BORDER }} />
    </div>
  );
}

function PatternBg({ show, opacity = 0.025, filter = "invert(1)", maskStop = "70%", animated = false }) {
  if (!show) return null;
  return (
    <div
      className={animated ? "giant-wave-pattern" : undefined}
      style={{
        position: "absolute",
        top: animated ? "-10%" : 0,
        left: animated ? "-10%" : 0,
        width: animated ? "120%" : "100%",
        height: animated ? "120%" : "100%",
        backgroundImage: "url('/patron.svg')",
        backgroundRepeat: "repeat",
        backgroundSize: "1200px",
        backgroundPosition: animated ? "center" : "top center",
        opacity,
        ...(filter ? { filter } : {}),
        ...(maskStop ? {
          maskImage: `linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) ${maskStop})`,
          WebkitMaskImage: `linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) ${maskStop})`,
        } : {}),
        pointerEvents: "none",
        zIndex: 0
      }}
    />
  );
}

function HomeView({ nav, casesList = [] }) {
  const [tickerData, setTickerData] = useState(CATALOG);

  useEffect(() => {
    if (!window.Papa || !CATALOGO_CSV_URL) return;
    fetch(`${CATALOGO_CSV_URL}&t=${Date.now()}`)
      .then(res => res.text())
      .then(csvText => {
        if (csvText.trim().startsWith('<')) return;
        window.Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          transformHeader: h => h.trim(),
          complete: (results) => {
            const sheetServices = results.data
              .filter(row => row["Servicio"] && row["Servicio"].trim() !== "")
              .map(row => ({ name: row["Servicio"].trim() }));
            if (sheetServices.length > 0) setTickerData(sheetServices);
          }
        });
      }).catch(err => console.error("Error cargando listón:", err));
  }, []);

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
        .ticker-track {
          display: flex;
          width: max-content;
          will-change: transform;
        }

        @keyframes scrollSocialProof {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .social-proof-track { display: flex; width: max-content; }
        .social-proof-animated { animation: scrollSocialProof 40s linear infinite; }
        .social-proof-track:not(.social-proof-animated) span:last-child { padding-right: 0 !important; }
      `}</style>

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section style={{
        padding: "100px 8vw 160px",
        position: "relative", overflow: "hidden",
        display: "flex", flexWrap: "wrap",
        alignItems: "center", gap: "60px",
        minHeight: "100vh",
        background: BG,
        borderBottom: `1px solid ${BORDER}`
      }}>

        {/* Mesh gradient orbs */}
        <div className="float-orb-a" style={{
          position: "absolute", top: "-20%", right: "-8%",
          width: "700px", height: "700px", borderRadius: "50%",
          background: `radial-gradient(circle, ${ACCENT}1a 0%, transparent 68%)`,
          filter: "blur(72px)", pointerEvents: "none", zIndex: 0
        }} />
        <div className="float-orb-b" style={{
          position: "absolute", bottom: "8%", left: "-18%",
          width: "600px", height: "600px", borderRadius: "50%",
          background: `radial-gradient(circle, ${INK2}14 0%, transparent 68%)`,
          filter: "blur(96px)", pointerEvents: "none", zIndex: 0
        }} />
        <div style={{
          position: "absolute", top: "40%", left: "40%",
          width: "400px", height: "400px", borderRadius: "50%",
          background: `radial-gradient(circle, ${ACCENT}0a 0%, transparent 70%)`,
          filter: "blur(60px)", pointerEvents: "none", zIndex: 0
        }} />

        <div style={{ flex: "1 1 300px", position: "relative", zIndex: 2 }}>

          {/* Badge estado */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
            <div className="status-indicator" style={{
              width: 10, height: 10, borderRadius: "50%", background: ACCENT
            }} />
            <span style={{
              fontSize: 11, fontWeight: 700, color: INK3,
              letterSpacing: "0.15em", textTransform: "uppercase"
            }}>
              UNIDAD DE RESPUESTA RÁPIDA · PUEBLA, MX
            </span>
          </div>

          {/* H1 con gradient text */}
          <h1 style={{
            fontSize: "clamp(52px, 8vw, 110px)",
            color: INK, fontWeight: 900, lineHeight: 0.9,
            marginBottom: 22,
            fontFamily: "'Barlow Condensed', sans-serif",
            textTransform: "uppercase"
          }}>
            De la Idea<br />a la <span className="gradient-text">Realidad.</span>
          </h1>

          {/* Subtítulo */}
          <p style={{
            fontSize: "clamp(12px, 1vw, 14px)",
            color: INK3, maxWidth: 500,
            lineHeight: 1.5, marginBottom: 20,
            fontWeight: 700, textTransform: "uppercase",
            letterSpacing: "0.08em"
          }}>
            Dirección visual premium e infraestructura web de alto rendimiento.
          </p>

          {/* Párrafo */}
          <p style={{
            fontSize: "clamp(16px, 1.3vw, 18px)",
            color: INK2, maxWidth: 520,
            lineHeight: 1.7, marginBottom: 48
          }}>
            En Riders Media no improvisamos. Somos una unidad estratégica especializada
            en <strong style={{ color: INK }}>motion graphics y desarrollo avanzado</strong> con
            React y Next.js. Aceleramos tu crecimiento con ejecuciones quirúrgicas,
            transparencia absoluta en los costos y entregables que dominan la atención.
          </p>

          {/* CTAs */}
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 80 }}>
            <button
              onClick={() => nav("catalogo")}
              style={{
                background: INK, color: "#fff",
                border: `2px solid ${INK}`,
                padding: "18px 40px", fontWeight: 800,
                borderRadius: "4px", cursor: "pointer",
                fontSize: 13, letterSpacing: "0.08em",
                textTransform: "uppercase", transition: "all 0.25s"
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = ACCENT;
                e.currentTarget.style.borderColor = ACCENT;
                e.currentTarget.style.color = INK;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = INK;
                e.currentTarget.style.borderColor = INK;
                e.currentTarget.style.color = "#fff";
              }}
            >
              Ver Catálogo 2026 →
            </button>
            <button
              onClick={() => nav("contacto")}
              style={{
                background: "transparent", color: INK,
                border: `2px solid ${ACCENT}`,
                padding: "18px 40px", fontWeight: 800,
                borderRadius: "4px", cursor: "pointer",
                fontSize: 13, letterSpacing: "0.08em",
                textTransform: "uppercase", transition: "all 0.25s"
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = ACCENT;
                e.currentTarget.style.color = INK;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = INK;
              }}
            >
              Agendar Llamada
            </button>
          </div>
        </div>

        {/* Floating stats card (reemplaza el showreel) */}
        <div className="glass-card" style={{
          flex: "1 1 380px",
          borderRadius: "24px",
          padding: "40px",
          boxShadow: `0 32px 80px rgba(0,0,0,0.07), inset 0 1px 0 rgba(255,255,255,0.7)`,
          position: "relative",
          zIndex: 2,
          overflow: "hidden"
        }}>
          {/* Gradient accent line */}
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: "3px",
            background: `linear-gradient(90deg, ${ACCENT} 0%, #E8930F 50%, ${INK2} 100%)`
          }} />

          {/* Brand badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: MUTED_RED, border: `1px solid ${ACCENT}35`,
            borderRadius: "20px", padding: "7px 14px", marginBottom: 28
          }}>
            <LogoIcon size={16} />
            <span style={{ fontSize: 10, fontWeight: 900, color: ACCENT, letterSpacing: "0.12em", textTransform: "uppercase" }}>
              Riders Media
            </span>
          </div>

          {/* Metrics grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 28 }}>
            {[
              { val: "48h",   lab: "Respuesta",    accent: true  },
              { val: "100%",  lab: "Transparente", accent: false },
              { val: `${tickerData.length}+`, lab: "Servicios", accent: false },
              { val: "B2B",   lab: "Enfocado",     accent: false }
            ].map((m, i) => (
              <div key={i} style={{
                background: m.accent
                  ? `linear-gradient(135deg, ${ACCENT}20, ${ACCENT}08)`
                  : `${SURFACE}cc`,
                border: `1px solid ${m.accent ? ACCENT + "35" : BORDER}`,
                borderRadius: "14px",
                padding: "18px 16px",
                textAlign: "center"
              }}>
                <div style={{
                  fontSize: "clamp(26px, 3vw, 34px)",
                  fontWeight: 900, lineHeight: 1,
                  color: m.accent ? ACCENT : INK,
                  fontFamily: "'Barlow Condensed', sans-serif"
                }}>{m.val}</div>
                <div style={{
                  fontSize: 9, fontWeight: 800, color: INK3,
                  textTransform: "uppercase", letterSpacing: "0.1em", marginTop: 5
                }}>{m.lab}</div>
              </div>
            ))}
          </div>

          {/* Services preview */}
          <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: 20 }}>
            <div style={{
              fontSize: 9, fontWeight: 900, color: INK3,
              textTransform: "uppercase", letterSpacing: "0.18em", marginBottom: 14
            }}>
              Servicios Destacados
            </div>
            {tickerData.slice(0, 3).map((s, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "10px 0",
                borderBottom: i < 2 ? `1px solid ${BORDER}` : "none"
              }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: INK }}>{s.name}</span>
                {s.price && (
                  <span style={{
                    fontSize: 12, fontWeight: 800,
                    background: `linear-gradient(135deg, ${ACCENT}, #E8930F)`,
                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                    backgroundClip: "text"
                  }}>
                    {s.price.toString().includes('$') ? s.price : `$${s.price}`} MXN
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Ver catálogo link */}
          <button
            onClick={() => nav("catalogo")}
            style={{
              marginTop: 20, width: "100%",
              padding: "12px",
              background: `linear-gradient(135deg, ${ACCENT} 0%, #E8930F 100%)`,
              color: INK,
              border: "none", borderRadius: "12px",
              fontWeight: 900, cursor: "pointer",
              fontSize: 12, letterSpacing: "0.08em",
              textTransform: "uppercase",
              boxShadow: `0 8px 24px ${ACCENT}30`,
              transition: "all 0.25s"
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = `0 14px 36px ${ACCENT}45`;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = `0 8px 24px ${ACCENT}30`;
            }}
          >
            Ver Catálogo Completo →
          </button>
        </div>

        {/* TICKER INFERIOR */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          borderTop: `1px solid ${BORDER}`,
          padding: "14px 0",
          background: SURFACE,
          zIndex: 3, overflow: "hidden"
        }}>
          <div
            className="ticker-track"
            style={{ animation: `scrollTicker ${Math.max(50, tickerData.length * 5)}s linear infinite` }}
          >
            {[...tickerData, ...tickerData].map((s, i) => (
              <span key={i} style={{
                color: i % 2 === 0 ? ACCENT : INK3,
                fontWeight: 800, fontSize: 13,
                textTransform: "uppercase", letterSpacing: "0.12em",
                whiteSpace: "nowrap", paddingRight: "48px"
              }}>
                {s.name} •
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROBLEMA VS SOLUCIÓN ──────────────────────────────── */}
      <section style={{ padding: "120px 8vw", background: BG }}>
        <SectionLabel>El Estándar Riders</SectionLabel>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: 80, marginTop: 40
        }}>
          <div>
            <h2 style={{
              fontSize: "clamp(36px, 5vw, 52px)",
              color: INK, fontWeight: 900, lineHeight: 1.05,
              marginBottom: 24,
              fontFamily: "'Barlow Condensed', sans-serif",
              textTransform: "uppercase"
            }}>
              La industria digital es{" "}
              <span style={{ color: INK3 }}>lenta y confusa.</span>
            </h2>
            <p style={{ color: INK2, fontSize: 17, lineHeight: 1.7, marginBottom: 32 }}>
              Las agencias tradicionales te atrapan en juntas interminables, contratos ocultos
              y meses de espera para lanzar una campaña básica. Tu negocio necesita moverse
              al ritmo del mercado.
            </p>
            <button
              onClick={() => nav("valor")}
              style={{
                background: "none", border: "none",
                color: ACCENT, fontWeight: 800, cursor: "pointer",
                fontSize: 13, letterSpacing: "0.08em",
                textTransform: "uppercase", padding: 0
              }}
            >
              Conoce cómo trabajamos →
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {[
              { icon: "M", title: "Velocidad Táctica",     desc: "Sistemas estructurados para entregar proyectos en días, no en meses." },
              { icon: "Á", title: "Foco en Conversión",    desc: "Un diseño bonito que no vende es arte. Nosotros hacemos negocios." },
              { icon: "S", title: "Transparencia Radical", desc: "Catálogo público. Sabes exactamente qué incluye y cuánto cuesta." }
            ].map((item, i) => (
              <div key={i}
                style={{
                  display: "flex", gap: 20,
                  background: SURFACE,
                  padding: "28px 32px",
                  borderRadius: "8px",
                  border: `1px solid ${BORDER}`,
                  transition: "border-color 0.2s, box-shadow 0.2s"
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = ACCENT;
                  e.currentTarget.style.boxShadow = `0 4px 24px ${ACCENT}18`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = BORDER;
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div style={{
                  fontSize: 22, fontWeight: 900,
                  width: 44, height: 44, flexShrink: 0,
                  background: MUTED_RED,
                  border: `1px solid ${ACCENT}30`,
                  borderRadius: "8px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: ACCENT, fontFamily: "'Barlow Condensed', sans-serif"
                }}>{item.icon}</div>
                <div>
                  <h4 style={{ fontSize: 17, fontWeight: 800, color: INK, marginBottom: 6 }}>{item.title}</h4>
                  <p style={{ fontSize: 14, color: INK2, lineHeight: 1.6 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MÉTRICAS — fondo degradado ───────────────────────── */}
      <section style={{
        padding: "35px 8vw",
        background: `linear-gradient(135deg, ${ACCENT} 0%, #E8930F 55%, #D4770A 100%)`,
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
        gap: 32,
        position: "relative",
        overflow: "hidden"
      }}>
        <div style={{
          position: "absolute", inset: 0,
          background: `radial-gradient(ellipse at 80% 50%, rgba(255,255,255,0.08) 0%, transparent 60%)`,
          pointerEvents: "none"
        }} />
        {[
          { val: "48h",          lab: "Tiempo de Respuesta"  },
          { val: "100%",         lab: "Transparencia de Costos" },
          { val: tickerData.length, lab: "Servicios Activos"    },
          { val: "B2B",          lab: "Enfoque Principal"    }
        ].map((m, i) => (
          <div key={i} style={{ textAlign: "center" }}>
            <div style={{
              fontSize: "clamp(40px, 5vw, 64px)",
              fontWeight: 900, color: INK,
              fontFamily: "'Barlow Condensed', sans-serif",
              lineHeight: 1
            }}>{m.val}</div>
            <div style={{
              fontSize: "11px", fontWeight: 800,
              color: INK2,
              textTransform: "uppercase", marginTop: 8,
              letterSpacing: "0.12em"
            }}>{m.lab}</div>
          </div>
        ))}
      </section>

      {/* ── FILOSOFÍA — fondo oscuro con degradado ───────────── */}
      <section style={{
        padding: "68px 8vw",
        background: `linear-gradient(145deg, ${INK} 0%, #152333 45%, ${INK2}ee 100%)`,
        position: "relative", overflow: "hidden"
      }}>
        {/* Glow central naranja */}
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          width: "600px", height: "400px", borderRadius: "50%",
          background: `radial-gradient(ellipse, ${ACCENT}0d 0%, transparent 65%)`,
          filter: "blur(40px)", pointerEvents: "none"
        }} />
        <PatternBg show={PATRON.filosofia} opacity={0.025} filter={null} maskStop={null} />

        <div style={{ position: "relative", zIndex: 1 }}>
          <SectionLabel>Filosofía</SectionLabel>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 24, marginTop: 40
          }}>
            {PILLARS.map(p => (
              <div key={p.num}
                style={{
                  background: "rgba(255,255,255,0.05)",
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                  padding: "40px",
                  border: "1px solid rgba(255,255,255,0.09)",
                  borderRadius: "16px",
                  transition: "border-color 0.3s, transform 0.3s, box-shadow 0.3s"
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = `${ACCENT}80`;
                  e.currentTarget.style.transform = "translateY(-6px)";
                  e.currentTarget.style.boxShadow = `0 20px 50px rgba(0,0,0,0.3), 0 0 0 1px ${ACCENT}30`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div style={{
                  fontSize: 79, fontWeight: 900,
                  color: ACCENT, opacity: 0.75,
                  marginBottom: 16,
                  fontFamily: "'Barlow Condensed', sans-serif",
                  lineHeight: 1
                }}>{p.num}</div>
                <h3 style={{
                  fontSize: 32, color: "#ffffff",
                  marginBottom: 12, fontWeight: 800, textTransform: "uppercase"
                }}>{p.title}</h3>
                <p style={{ color: "rgba(255,255,255,0.58)", lineHeight: 1.7, fontSize: 15 }}>
                  {p.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA DE CIERRE ─────────────────────────────────────── */}
      <section style={{
        padding: "140px 8vw",
        background: `linear-gradient(180deg, ${BG2} 0%, #EDE8DC 100%)`,
        textAlign: "center",
        position: "relative",
        overflow: "hidden"
      }}>
        <div style={{
          position: "absolute", top: "-30%", left: "50%",
          transform: "translateX(-50%)",
          width: "800px", height: "400px", borderRadius: "50%",
          background: `radial-gradient(ellipse, ${ACCENT}0e 0%, transparent 65%)`,
          filter: "blur(60px)", pointerEvents: "none"
        }} />
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <div style={{
            width: 64, height: 64,
            background: SURFACE,
            border: `2px solid ${ACCENT}`,
            borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 22, margin: "0 auto 32px", color: ACCENT
          }}>▶</div>
          <h2 style={{
            fontSize: "clamp(42px, 6vw, 64px)",
            color: INK, fontWeight: 900, lineHeight: 1,
            marginBottom: 24,
            fontFamily: "'Barlow Condensed', sans-serif",
            textTransform: "uppercase"
          }}>
            ¿Listo para acelerar tu crecimiento?
          </h2>
          <p style={{ color: INK2, fontSize: 18, lineHeight: 1.6, marginBottom: 48 }}>
            Deja de perder tiempo y dinero con soluciones genéricas. Habla directamente
            con nosotros y pongamos a trabajar tu marca.
          </p>
          <button
            onClick={() => nav("contacto")}
            style={{
              background: `linear-gradient(135deg, ${ACCENT} 0%, #E8930F 100%)`,
              color: INK,
              border: "none", padding: "20px 52px",
              fontWeight: 800, borderRadius: "8px",
              cursor: "pointer", fontSize: 14,
              letterSpacing: "0.08em", textTransform: "uppercase",
              boxShadow: `0 8px 28px ${ACCENT}45`,
              transition: "all 0.25s"
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = INK;
              e.currentTarget.style.color = "#fff";
              e.currentTarget.style.transform = "translateY(-3px)";
              e.currentTarget.style.boxShadow = `0 14px 40px ${INK}30`;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = `linear-gradient(135deg, ${ACCENT} 0%, #E8930F 100%)`;
              e.currentTarget.style.color = INK;
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = `0 8px 28px ${ACCENT}45`;
            }}
          >
            Cotizar Mi Proyecto
          </button>
        </div>
      </section>

      {/* ── SOCIAL PROOF ──────────────────────────────────────── */}
      <section style={{
        padding: "20px 0 30px",
        background: INK2,
        borderTop: `3px solid ${ACCENT}`,
        textAlign: "center",
        overflow: "hidden"
      }}>
        <p style={{
          fontSize: 11, fontWeight: 800,
          color: "rgba(255,255,255,0.38)",
          letterSpacing: "0.2em", textTransform: "uppercase",
          marginBottom: 16
        }}>
          — Marcas que confían en nosotros —
        </p>

        {clients.length === 0 ? (
          <div style={{
            fontSize: "clamp(18px, 3vw, 24px)",
            fontWeight: 900,
            fontFamily: "'Barlow Condensed', sans-serif",
            color: "rgba(255,255,255,0.25)"
          }}>
            Podrías ser el primero
          </div>
        ) : (
          <div style={{
            display: "flex",
            justifyContent: shouldAnimate ? "flex-start" : "center"
          }}>
            <div className={`social-proof-track ${shouldAnimate ? "social-proof-animated" : ""}`}>
              {displayClients.map((clientName, i) => (
                <span key={i} style={{
                  fontSize: "clamp(18px, 3vw, 24px)",
                  fontWeight: 900,
                  fontFamily: "'Barlow Condensed', sans-serif",
                  color: "rgba(255,255,255,0.32)",
                  whiteSpace: "nowrap",
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

function CatalogView({ nav }) {
  const [catalog, setCatalog] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!window.Papa) {
      setErrorMsg("⚠️ Error: El script de PapaParse no se ha cargado en el index.html.");
      setIsLoading(false);
      return;
    }

    fetch(`${CATALOGO_CSV_URL}&t=${Date.now()}`)
      .then(res => res.text())
      .then(csvText => {
        if (csvText.trim().startsWith('<')) {
          setErrorMsg("⚠️ El Google Sheet está privado. Cambia a 'Cualquier persona con el enlace'.");
          setIsLoading(false);
          return;
        }
        window.Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          transformHeader: h => h.trim(),
          complete: (results) => {
            const fetchedData = results.data
              .filter(row => row["Servicio"] && row["Servicio"].trim() !== "")
              .map((row, index) => ({
                id: `sheet-item-${index}`,
                name:      row["Servicio"]?.trim() || "",
                tag:       row["Tipo de Pago"]?.trim() || "",
                realPrice: row["Precio real"] ? row["Precio real"].toString().trim() : "",
                price:     row["Inversión (Desde)"] ? row["Inversión (Desde)"].toString().trim() : "",
                desc:      row["Descripción"]?.trim() || "",
                highlight: row["¿hightlight?"]?.trim().toUpperCase() === "TRUE"
              }));

            if (fetchedData.length === 0) {
              setErrorMsg("⚠️ El Excel conectó, pero las columnas no se llaman exactamente 'Servicio', 'Tipo de Pago', etc.");
            }
            setCatalog(fetchedData);
            setIsLoading(false);
          }
        });
      })
      .catch(err => {
        console.error(err);
        setErrorMsg("⚠️ Error de red al intentar descargar el Excel.");
        setIsLoading(false);
      });
  }, []);

  const monthly  = catalog.filter(s => s.tag && s.tag.toLowerCase().includes("mensual"));
  const oneTime  = catalog.filter(s => s.tag && (s.tag.toLowerCase().includes("único") || s.tag.toLowerCase().includes("unico")));
  const perPiece = catalog.filter(s => s.tag && s.tag.toLowerCase().includes("pieza"));

  // ── tarjetas de catálogo ────────────────────────────────────
  function Section({ title, items }) {
    if (items.length === 0) return null;
    return (
      <div style={{ marginBottom: 72 }}>
        <SectionLabel>{title}</SectionLabel>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: 24
        }}>
          {items.map(s => (
            <div key={s.id}
              style={{
                background: s.highlight
                  ? `linear-gradient(145deg, ${BG2} 0%, #EDE8DC 100%)`
                  : SURFACE,
                border: `1px solid ${s.highlight ? ACCENT + "60" : BORDER}`,
                padding: "40px",
                borderRadius: "16px",
                position: "relative",
                display: "flex",
                flexDirection: "column",
                boxShadow: s.highlight
                  ? `0 8px 40px ${ACCENT}20, inset 0 1px 0 rgba(255,255,255,0.5)`
                  : "0 4px 16px rgba(0,0,0,0.04)",
                transition: "transform 0.25s, border-color 0.25s, box-shadow 0.25s"
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-6px)";
                e.currentTarget.style.boxShadow = s.highlight
                  ? `0 20px 60px ${ACCENT}28, inset 0 1px 0 rgba(255,255,255,0.5)`
                  : `0 16px 48px rgba(0,0,0,0.10)`;
                e.currentTarget.style.borderColor = s.highlight ? ACCENT : `${ACCENT}60`;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = s.highlight
                  ? `0 8px 40px ${ACCENT}20, inset 0 1px 0 rgba(255,255,255,0.5)`
                  : "0 4px 16px rgba(0,0,0,0.04)";
                e.currentTarget.style.borderColor = s.highlight ? `${ACCENT}60` : BORDER;
              }}
            >
              {/* Badge popular */}
              {s.highlight && (
                <div style={{
                  position: "absolute", top: 16, right: 16,
                  background: ACCENT, color: INK,
                  fontSize: 10, fontWeight: 900,
                  letterSpacing: "0.1em", textTransform: "uppercase",
                  padding: "4px 12px", borderRadius: "20px"
                }}>Popular</div>
              )}

              <div>
                <Chip outline={!s.highlight}>{s.tag}</Chip>

                {/* Precio */}
                <div style={{ marginTop: 24, marginBottom: 8 }}>
                  {s.realPrice && (
                    <div style={{
                      fontFamily: "'Barlow Condensed', sans-serif",
                      fontSize: 22, color: INK3,
                      textDecoration: "line-through",
                      marginBottom: -4, fontWeight: 600
                    }}>
                      {s.realPrice}
                    </div>
                  )}
                  <div style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontSize: 52, fontWeight: 900,
                    color: INK, letterSpacing: "-0.02em", lineHeight: 1.05
                  }}>
                    {s.price}{" "}
                    <span style={{ fontSize: 16, fontWeight: 600, color: INK3 }}>MXN</span>
                  </div>
                </div>

                <h3 style={{
                  fontSize: 22, color: INK,
                  margin: "0 0 12px", fontWeight: 800
                }}>{s.name}</h3>
              </div>

              <p style={{
                color: INK2, fontSize: 14,
                minHeight: 60, marginBottom: 28,
                lineHeight: 1.65, flexGrow: 1
              }}>{s.desc}</p>

              {/* CTA de tarjeta */}
              <button
                onClick={() => nav("contacto", s.id)}
                style={{
                  width: "100%", padding: "14px",
                  background: s.highlight
                    ? `linear-gradient(135deg, ${ACCENT} 0%, #E8930F 100%)`
                    : "transparent",
                  color: s.highlight ? INK : INK,
                  border: `2px solid ${s.highlight ? "transparent" : ACCENT}`,
                  borderRadius: "8px",
                  fontWeight: 800, cursor: "pointer",
                  fontSize: 13, letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  boxShadow: s.highlight ? `0 6px 20px ${ACCENT}30` : "none",
                  transition: "all 0.2s"
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = `linear-gradient(135deg, ${ACCENT} 0%, #E8930F 100%)`;
                  e.currentTarget.style.borderColor = "transparent";
                  e.currentTarget.style.color = INK;
                  e.currentTarget.style.boxShadow = `0 10px 28px ${ACCENT}40`;
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = s.highlight
                    ? `linear-gradient(135deg, ${ACCENT} 0%, #E8930F 100%)`
                    : "transparent";
                  e.currentTarget.style.borderColor = s.highlight ? "transparent" : ACCENT;
                  e.currentTarget.style.color = INK;
                  e.currentTarget.style.boxShadow = s.highlight ? `0 6px 20px ${ACCENT}30` : "none";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                Cotizar este servicio →
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── pantalla de carga ────────────────────────────────────────
  if (isLoading) {
    return (
      <div style={{
        padding: "120px 8vw", background: BG,
        minHeight: "50vh",
        display: "flex", justifyContent: "center", alignItems: "center",
        position: "relative", overflow: "hidden"
      }}>
        <style>{`
          @keyframes giantWave {
            0%   { opacity: 0.01; transform: scale(1); }
            50%  { opacity: 0.05; transform: scale(1.03); }
            100% { opacity: 0.01; transform: scale(1); }
          }
          .giant-wave-pattern { animation: giantWave 4s ease-in-out infinite; }
        `}</style>

        <PatternBg show={PATRON.catalogo_carga} animated filter="invert(1)" maskStop={null} />

        {/* Indicador de carga con el naranja de marca */}
        <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
          <div style={{
            width: 56, height: 56, borderRadius: "50%",
            border: `3px solid ${BORDER}`,
            borderTopColor: ACCENT,
            margin: "0 auto 24px",
            animation: "spin 0.9s linear infinite"
          }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <h2 style={{
            color: INK,
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: "clamp(20px, 3vw, 28px)",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            fontWeight: 900
          }}>
            Cargando catálogo...
          </h2>
        </div>
      </div>
    );
  }

  // ── vista principal ──────────────────────────────────────────
  return (
    <div style={{
      padding: "120px 8vw",
      background: BG,
      position: "relative", overflow: "hidden"
    }}>
      <PatternBg show={PATRON.catalogo} maskStop="60%" />

      <div style={{ position: "relative", zIndex: 1 }}>

        {/* Header de sección */}
        <div style={{ maxWidth: 700, marginBottom: 80 }}>
          <Chip accent>Tarifas Transparentes</Chip>
          <h1 style={{
            fontSize: "clamp(48px, 7vw, 72px)",
            color: INK,
            marginTop: 24, marginBottom: 20,
            fontWeight: 900,
            fontFamily: "'Barlow Condensed', sans-serif",
            textTransform: "uppercase",
            lineHeight: 0.95
          }}>
            Servicios &<br />
            <span className="gradient-text">Precios.</span>
          </h1>
          <p style={{ color: INK2, fontSize: 18, lineHeight: 1.7 }}>
            Sin letra chica. Sin sorpresas. Todos los precios son desde —
            cotizamos según tu proyecto.
          </p>

          {errorMsg && (
            <div style={{
              marginTop: 28,
              padding: "20px 24px",
              background: MUTED_RED,
              color: INK,
              border: `2px solid ${ACCENT}`,
              borderRadius: "8px",
              fontWeight: 700, fontSize: 14
            }}>
              {errorMsg}
            </div>
          )}
        </div>

        <Section title="Por pieza"          items={perPiece} />
        <Section title="Pago único"         items={oneTime}  />
        <Section title="Paquetes mensuales" items={monthly}  />

      </div>
    </div>
  );
}

function ValorView({ stats }) {

  // ── KPI card con mini barras ──────────────────────────────────
  function KPICard({ stat, highlight }) {
    const maxVal  = Math.max(stat.freelance, stat.agencias, stat.riders);
    const safeMax = maxVal === 0 ? 1 : maxVal;
    const entries = [
      { name: "Free",    val: stat.freelance, color: "#C8C0B4" },
      { name: "Agencia", val: stat.agencias,  color: INK2      },
      { name: "Riders",  val: stat.riders,    color: ACCENT    },
    ];

    return (
      <div
        style={{
          background: SURFACE,
          border: `1px solid ${highlight ? ACCENT : BORDER}`,
          borderRadius: "12px", padding: "22px",
          display: "flex", flexDirection: "column", gap: 14,
          boxShadow: highlight ? `0 4px 20px ${ACCENT}20` : "none",
          transition: "border-color 0.2s, box-shadow 0.2s"
        }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = ACCENT;
          e.currentTarget.style.boxShadow = `0 8px 28px ${ACCENT}20`;
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = highlight ? ACCENT : BORDER;
          e.currentTarget.style.boxShadow   = highlight ? `0 4px 20px ${ACCENT}20` : "none";
        }}
      >
        <div style={{
          fontSize: 9, fontWeight: 900, color: INK3,
          textTransform: "uppercase", letterSpacing: "0.15em"
        }}>{stat.label}</div>

        <div style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontSize: 38, fontWeight: 900, color: ACCENT, lineHeight: 1
        }}>
          {stat.riders}
          <span style={{ fontSize: 14, fontWeight: 600, color: INK3, marginLeft: 3 }}>
            {stat.unidad}
          </span>
        </div>

        {/* Mini barras comparativas — eliminan el espacio vacío */}
        <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
          {entries.map(entry => (
            <div key={entry.name} style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <span style={{
                fontSize: 8, fontWeight: 800,
                color: entry.color === ACCENT ? ACCENT : INK3,
                textTransform: "uppercase", letterSpacing: "0.04em",
                width: 40, flexShrink: 0
              }}>{entry.name}</span>
              <div style={{ flex: 1, height: 5, background: BORDER, borderRadius: 3, overflow: "hidden" }}>
                <div style={{
                  height: "100%",
                  width: `${(entry.val / safeMax) * 100}%`,
                  background: entry.color,
                  borderRadius: 3,
                  boxShadow: entry.color === ACCENT ? `0 0 6px ${ACCENT}40` : "none"
                }} />
              </div>
              <span style={{
                fontSize: 10, fontWeight: 800,
                color: entry.color === ACCENT ? ACCENT : INK3,
                width: 30, textAlign: "right", flexShrink: 0
              }}>{entry.val}{stat.unidad}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── Ring gauge: anillos concéntricos ─────────────────────────
  function RingGaugeCard({ stat }) {
    const rings = [
      { r: 50, val: stat.freelance, color: "#C8C0B4", label: "Freelance" },
      { r: 37, val: stat.agencias,  color: INK2,      label: "Agencias"  },
      { r: 24, val: stat.riders,    color: ACCENT,    label: "Riders"    },
    ];

    return (
      <div
        style={{
          background: SURFACE, border: `1px solid ${BORDER}`,
          borderRadius: "12px", padding: "36px 32px",
          display: "flex", flexDirection: "column", alignItems: "center",
          transition: "box-shadow 0.25s, transform 0.25s"
        }}
        onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 12px 40px rgba(0,0,0,0.09)`; e.currentTarget.style.transform = "translateY(-3px)"; }}
        onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateY(0)"; }}
      >
        <h3 style={{
          fontSize: 11, fontWeight: 900, color: INK,
          textTransform: "uppercase", letterSpacing: "0.15em",
          marginBottom: 32, textAlign: "center"
        }}>{stat.label}</h3>

        <svg width="180" height="180" viewBox="0 0 120 120">
          {rings.map(ring => {
            const circ = 2 * Math.PI * ring.r;
            const fill = Math.min(ring.val, 100) / 100 * circ;
            return (
              <g key={ring.r}>
                <circle cx="60" cy="60" r={ring.r} fill="none" stroke={BORDER} strokeWidth="7" />
                <circle
                  cx="60" cy="60" r={ring.r}
                  fill="none" stroke={ring.color} strokeWidth="7"
                  strokeDasharray={`${fill} ${circ}`}
                  strokeLinecap="round"
                  transform="rotate(-90 60 60)"
                  style={{
                    filter: ring.color === ACCENT ? `drop-shadow(0 0 4px ${ACCENT}80)` : "none",
                    transition: "stroke-dasharray 1.2s cubic-bezier(0.4,0,0.2,1)"
                  }}
                />
              </g>
            );
          })}
          {/* NÚMEROS PEQUEÑOS en el centro */}
          <text x="60" y="57" textAnchor="middle"
            fontSize="13" fontWeight="900" fill={ACCENT}
            fontFamily="'Barlow Condensed', sans-serif">
            {stat.riders}{stat.unidad}
          </text>
          <text x="60" y="67" textAnchor="middle"
            fontSize="5.5" fontWeight="800" fill={INK3}
            fontFamily="system-ui, sans-serif">
            RIDERS
          </text>
        </svg>

        {/* Leyenda */}
        <div style={{ display: "flex", gap: 28, marginTop: 28 }}>
          {rings.map(ring => (
            <div key={ring.label} style={{ textAlign: "center" }}>
              <div style={{
                width: 10, height: 10, borderRadius: "3px",
                background: ring.color, margin: "0 auto 8px",
                boxShadow: ring.color === ACCENT ? `0 0 6px ${ACCENT}60` : "none"
              }} />
              <div style={{
                fontSize: 16, fontWeight: 900,
                color: ring.color === ACCENT ? ACCENT : INK,
                fontFamily: "'Barlow Condensed', sans-serif"
              }}>{ring.val}{stat.unidad}</div>
              <div style={{
                fontSize: 9, fontWeight: 700, color: INK3,
                textTransform: "uppercase", letterSpacing: "0.04em", marginTop: 2
              }}>{ring.label}</div>
            </div>
          ))}
        </div>

        <p style={{
          fontSize: 13, color: INK2, marginTop: 24,
          textAlign: "center", lineHeight: 1.6,
          paddingTop: 20, borderTop: `1px solid ${BORDER}`, width: "100%"
        }}>{stat.description}</p>
      </div>
    );
  }

  // ── Race bars: barras horizontales ────────────────────────────
  function RaceCard({ stat }) {
    const maxVal  = Math.max(stat.freelance, stat.agencias, stat.riders);
    const safeMax = maxVal === 0 ? 1 : maxVal;
    const bars = [
      { name: "Freelance", val: stat.freelance, color: "#C8C0B4", textColor: INK3  },
      { name: "Agencias",  val: stat.agencias,  color: INK2,      textColor: INK2  },
      { name: "Riders",    val: stat.riders,    color: ACCENT,    textColor: ACCENT },
    ];

    return (
      <div
        style={{
          background: SURFACE, border: `1px solid ${BORDER}`,
          borderRadius: "12px", padding: "32px",
          display: "flex", flexDirection: "column", justifyContent: "space-between",
          transition: "box-shadow 0.25s, transform 0.25s"
        }}
        onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 12px 40px rgba(0,0,0,0.09)`; e.currentTarget.style.transform = "translateY(-3px)"; }}
        onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateY(0)"; }}
      >
        <div>
          <h3 style={{
            fontSize: 11, fontWeight: 900, color: INK,
            textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 28
          }}>{stat.label}</h3>

          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {bars.map(bar => (
              <div key={bar.name}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, alignItems: "baseline" }}>
                  <span style={{
                    fontSize: 10, fontWeight: 800, color: bar.textColor,
                    textTransform: "uppercase", letterSpacing: "0.06em"
                  }}>{bar.name}</span>
                  <span style={{ fontSize: 14, fontWeight: 900, color: bar.textColor }}>
                    {bar.val}
                    <span style={{ fontWeight: 600, fontSize: 10, marginLeft: 2 }}>{stat.unidad}</span>
                  </span>
                </div>
                <div style={{ height: 8, background: BORDER, borderRadius: "4px", overflow: "hidden" }}>
                  <div style={{
                    height: "100%",
                    width: `${(bar.val / safeMax) * 100}%`,
                    background: bar.color,
                    borderRadius: "4px",
                    transition: "width 1.2s cubic-bezier(0.4,0,0.2,1)",
                    boxShadow: bar.color === ACCENT ? `0 0 10px ${ACCENT}50` : "none"
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <p style={{
          fontSize: 13, color: INK2, marginTop: 24,
          lineHeight: 1.6, paddingTop: 20,
          borderTop: `1px solid ${BORDER}`
        }}>{stat.description}</p>
      </div>
    );
  }

  // ── Bar chart: barras verticales ──────────────────────────────
  function BarCard({ stat }) {
    const maxVal  = Math.max(stat.freelance, stat.agencias, stat.riders);
    const safeMax = maxVal === 0 ? 1 : maxVal;
    const fH = Math.max((stat.freelance / safeMax) * 100, 4);
    const aH = Math.max((stat.agencias  / safeMax) * 100, 4);
    const rH = Math.max((stat.riders    / safeMax) * 100, 4);
    const isMoney = maxVal > 1000;
    const fmt = (n) => {
      if (isMoney) return `$${(n / 1000).toFixed(0)}k`;
      return `${n}${stat.unidad ? " " + stat.unidad : ""}`;
    };
    const bars = [
      { name: "Freelance", h: fH, val: stat.freelance, color: "#C8C0B4", textColor: INK3  },
      { name: "Agencias",  h: aH, val: stat.agencias,  color: INK2,      textColor: INK2  },
      { name: "Riders",    h: rH, val: stat.riders,    color: ACCENT,    textColor: ACCENT },
    ];

    return (
      <div
        style={{
          background: SURFACE, border: `1px solid ${BORDER}`,
          borderRadius: "12px", padding: "32px",
          display: "flex", flexDirection: "column", justifyContent: "space-between",
          transition: "box-shadow 0.25s, transform 0.25s"
        }}
        onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 12px 40px rgba(0,0,0,0.09)`; e.currentTarget.style.transform = "translateY(-3px)"; }}
        onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateY(0)"; }}
      >
        <div>
          <h3 style={{
            fontSize: 11, fontWeight: 900, color: INK,
            textTransform: "uppercase", letterSpacing: "0.12em",
            marginBottom: 28, textAlign: "center"
          }}>{stat.label}</h3>

          <div style={{ position: "relative" }}>
            {[25, 50, 75].map(pct => (
              <div key={pct} style={{
                position: "absolute", left: 0, right: 0,
                bottom: `${pct * 1.6}px`,
                borderTop: `1px dashed ${BORDER}`,
                zIndex: 0, pointerEvents: "none"
              }} />
            ))}
            <div style={{
              display: "flex", alignItems: "flex-end",
              height: "160px", gap: "12px",
              borderBottom: `2px solid ${BORDER}`,
              position: "relative", zIndex: 1
            }}>
              {bars.map(bar => (
                <div key={bar.name} style={{
                  flex: 1, display: "flex", flexDirection: "column",
                  alignItems: "center", height: "100%"
                }}>
                  <div style={{ flex: 1, width: "100%", display: "flex", alignItems: "flex-end" }}>
                    <div style={{
                      height: `${bar.h}%`, width: "100%",
                      background: bar.color,
                      borderRadius: "4px 4px 0 0",
                      boxShadow: bar.color === ACCENT ? `0 -6px 18px ${ACCENT}30` : "none",
                      transition: "height 1.1s cubic-bezier(0.4,0,0.2,1)"
                    }} />
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 900, marginTop: 9, color: bar.textColor }}>
                    {fmt(bar.val)}
                  </span>
                  <span style={{
                    fontSize: 8, fontWeight: 700, marginTop: 3,
                    color: bar.textColor, textTransform: "uppercase", letterSpacing: "0.04em"
                  }}>{bar.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <p style={{
          fontSize: 13, color: INK2, marginTop: 20,
          lineHeight: 1.6, textAlign: "center",
          paddingTop: 16, borderTop: `1px solid ${BORDER}`
        }}>{stat.description}</p>
      </div>
    );
  }

  // ── Estado vacío / cargando ───────────────────────────────────
  if (!stats || stats.length === 0) {
    return (
      <div style={{ padding: "120px 8vw", background: BG, minHeight: "100vh" }}>
        <SectionLabel>Análisis de Mercado</SectionLabel>
        <p style={{ fontWeight: 700, color: INK2, marginTop: 32 }}>Cargando análisis de mercado...</p>
      </div>
    );
  }

  const ringStats = stats.filter(s => s.tipo === "anillo");
  const raceStats = stats.filter(s => s.tipo === "carrera");
  const barStats  = stats.filter(s => !s.tipo || s.tipo === "barra");

  return (
    <div style={{
      padding: "120px 8vw",
      background: BG,
      minHeight: "100vh",
      position: "relative", overflow: "hidden"
    }}>
      <PatternBg show={PATRON.valor} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1400, margin: "0 auto" }}>

        {/* ── ENCABEZADO + LEYENDA ── */}
        <SectionLabel>Análisis de Mercado</SectionLabel>
        <div style={{
          display: "flex", alignItems: "flex-end",
          justifyContent: "space-between",
          flexWrap: "wrap", gap: 24, marginBottom: 48
        }}>
          <h1 style={{
            fontSize: "clamp(32px, 5vw, 52px)",
            fontWeight: 900, margin: 0,
            fontFamily: "'Barlow Condensed', sans-serif",
            textTransform: "uppercase",
            color: INK, lineHeight: 1.05
          }}>
            ¿Por qué Riders es la{" "}
            <span style={{ color: ACCENT }}>opción lógica?</span>
          </h1>

          <div style={{
            display: "flex", gap: 18,
            padding: "12px 20px",
            background: SURFACE, border: `1px solid ${BORDER}`,
            borderRadius: "8px", flexShrink: 0
          }}>
            {[
              { color: "#C8C0B4", label: "Freelance" },
              { color: INK2,      label: "Agencias"  },
              { color: ACCENT,    label: "Riders"    },
            ].map(item => (
              <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <div style={{
                  width: 10, height: 10, borderRadius: "3px",
                  background: item.color,
                  boxShadow: item.color === ACCENT ? `0 0 7px ${ACCENT}60` : "none"
                }} />
                <span style={{
                  fontSize: 10, fontWeight: 800,
                  color: item.color === ACCENT ? ACCENT : INK2,
                  textTransform: "uppercase", letterSpacing: "0.08em"
                }}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── KPI STRIP con mini barras ── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
          gap: 16, marginBottom: 52
        }}>
          {/* Hero oscuro */}
          <div style={{
            background: BG2, borderRadius: "12px",
            padding: "26px 22px",
            position: "relative", overflow: "hidden"
          }}>
            <div style={{
              position: "absolute", top: -40, right: -40,
              width: 130, height: 130, borderRadius: "50%",
              background: `${ACCENT}15`, pointerEvents: "none"
            }} />
            <div style={{
              fontSize: 9, fontWeight: 900,
              color: "rgba(255,255,255,0.3)",
              textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: 14
            }}>Riders Media</div>
            <div style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: 40, fontWeight: 900,
              color: ACCENT, lineHeight: 1
            }}>La mejor<br />opción.</div>
            <div style={{
              fontSize: 11, color: "rgba(255,255,255,0.35)",
              marginTop: 14, lineHeight: 1.5
            }}>Datos verificados.<br />Sin letra chica.</div>
          </div>

          {stats.slice(0, 4).map((stat, i) => (
            <KPICard key={i} stat={stat} highlight={i === 0} />
          ))}
        </div>

        {/* ── ANILLOS ── */}
        {ringStats.length > 0 && (
          <div style={{ marginBottom: 44 }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 14, marginBottom: 24
            }}>
              <span style={{
                fontSize: 10, fontWeight: 900, color: INK3,
                textTransform: "uppercase", letterSpacing: "0.15em", whiteSpace: "nowrap"
              }}>Métricas de satisfacción</span>
              <span style={{ flex: 1, height: 1, background: BORDER }} />
            </div>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: 24
            }}>
              {ringStats.map((stat, i) => <RingGaugeCard key={i} stat={stat} />)}
            </div>
          </div>
        )}

        {/* ── BARRAS VERTICALES ── */}
        {barStats.length > 0 && (
          <div style={{ marginBottom: 44 }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 14, marginBottom: 24
            }}>
              <span style={{
                fontSize: 10, fontWeight: 900, color: INK3,
                textTransform: "uppercase", letterSpacing: "0.15em", whiteSpace: "nowrap"
              }}>Comparativa de valores</span>
              <span style={{ flex: 1, height: 1, background: BORDER }} />
            </div>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: 24
            }}>
              {barStats.map((stat, i) => <BarCard key={i} stat={stat} />)}
            </div>
          </div>
        )}

        {/* ── CARRERA / RACE BARS ── */}
        {raceStats.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 14, marginBottom: 24
            }}>
              <span style={{
                fontSize: 10, fontWeight: 900, color: INK3,
                textTransform: "uppercase", letterSpacing: "0.15em", whiteSpace: "nowrap"
              }}>Índices de calidad</span>
              <span style={{ flex: 1, height: 1, background: BORDER }} />
            </div>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: 24
            }}>
              {raceStats.map((stat, i) => <RaceCard key={i} stat={stat} />)}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

function CasesView({ casesData }) {
  const [hovered, setHovered] = useState(null);
  const safeCases = casesData && casesData.length > 0 ? casesData : [];
  
  return (
    <div style={{ padding: "120px 8vw", background: BG, position: "relative", overflow: "hidden", minHeight: "100vh" }}>
      
      <PatternBg show={PATRON.casos} opacity={0.02} maskStop="80%" />

      <div style={{ position: "relative", zIndex: 1, maxWidth: "1600px", margin: "0 auto" }}>
        
        {/* Header de la sección */}
        <div style={{ marginBottom: 80, display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 32 }}>
          <div>
            <SectionLabel>Evidencia Táctica</SectionLabel>
            <h1 style={{ 
              fontFamily: "'Barlow Condensed', sans-serif", 
              fontSize: "clamp(48px, 6vw, 72px)", 
              fontWeight: 900, 
              textTransform: "uppercase", 
              color: INK, 
              lineHeight: 0.95, 
              margin: 0,
              letterSpacing: "-0.02em"
            }}>
              Impacto <br/><span style={{ color: ACCENT }}>Real.</span>
            </h1>
          </div>
          <p style={{ 
            fontSize: "17px", 
            color: INK2, 
            lineHeight: 1.7, 
            maxWidth: 480, 
            margin: 0, 
            paddingBottom: 8 
          }}>
            No vendemos humo ni métricas de vanidad. Diseñamos sistemas y activos visuales que se traducen directamente en crecimiento medible para tu negocio.
          </p>
        </div>
        
        {/* Tabla de Casos */}
        <div style={{ borderTop: `2px solid ${BORDER}` }}>
          {safeCases.length === 0 ? (
             <div style={{ padding: "60px 0", textAlign: "center", color: INK3, fontWeight: 700, fontSize: "18px" }}>
               Cargando evidencia...
             </div>
          ) : (
            safeCases.map((c, i) => (
              <a key={i} href={c.link || "#"} target="_blank" rel="noopener noreferrer" 
                onMouseEnter={() => setHovered(i)} 
                onMouseLeave={() => setHovered(null)}
                style={{ 
                  display: "flex", 
                  flexWrap: "wrap", 
                  alignItems: "center", 
                  justifyContent: "space-between", 
                  padding: "40px 32px", 
                  borderBottom: `1px solid ${BORDER}`, 
                  position: "relative", 
                  cursor: "pointer", 
                  textDecoration: "none", 
                  transition: "all 0.3s ease",
                  borderRadius: "8px",
                  marginTop: "8px"
                }}>
                
                {/* Fondo Hover */}
                <div style={{
                  position: "absolute",
                  inset: 0,
                  background: SURFACE,
                  zIndex: 0,
                  opacity: hovered === i ? 1 : 0,
                  transition: "opacity 0.2s ease",
                  borderRadius: "8px",
                  boxShadow: hovered === i ? `0 10px 48px ${c.color}40, 0 0 0 1.5px ${c.color}60` : "none"
                }} />

                {/* Categoría y Cliente */}
                <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", gap: 12, flex: "1 1 200px" }}>
                  <div style={{
                    fontSize: 11,
                    fontWeight: 800,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: hovered === i ? c.color : INK3,
                    transition: "color 0.3s ease"
                  }}>
                    {c.cat}
                  </div>
                  <div style={{
                    fontSize: "clamp(24px, 3vw, 36px)",
                    fontWeight: 800,
                    color: INK,
                    letterSpacing: "-0.01em",
                    lineHeight: 1.1
                  }}>
                    {c.client}
                  </div>
                </div>

                {/* Resultado y Flecha */}
                <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: 32, flex: "1 1 auto", justifyContent: "flex-end" }}>
                  <div style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontSize: "clamp(40px, 6vw, 64px)",
                    fontWeight: 900,
                    color: hovered === i ? c.color : INK2,
                    lineHeight: 1,
                    letterSpacing: "-0.02em",
                    transition: "color 0.3s ease, transform 0.3s ease, text-shadow 0.3s ease",
                    transform: hovered === i ? "scale(1.05)" : "scale(1)",
                    transformOrigin: "right center",
                    textShadow: hovered === i ? `0 0 32px ${c.color}60` : "none"
                  }}>
                    {c.result}
                  </div>
                  <div style={{
                    fontSize: 28,
                    color: hovered === i ? c.color : BORDER,
                    fontWeight: 300,
                    transform: hovered === i ? "translateX(8px)" : "translateX(0)",
                    transition: "all 0.3s ease"
                  }}>
                    →
                  </div>
                </div>
              </a>
            ))
          )}
        </div>

      </div>
    </div>
  );
}

function AboutView() {
  return (
    <div style={{ padding: "120px 8vw", background: BG, position: "relative", overflow: "hidden", minHeight: "100vh" }}>
      
      <PatternBg show={PATRON.agencia} opacity={0.02} maskStop="80%" />

      <div style={{ position: "relative", zIndex: 1, maxWidth: "1600px", margin: "0 auto" }}>
        
        {/* Textos Principales */}
        <div style={{ maxWidth: 850, marginBottom: 100 }}>
          <SectionLabel>Sobre la Agencia</SectionLabel>
          <h1 style={{ 
            fontSize: "clamp(48px, 6vw, 80px)", 
            color: INK, 
            fontWeight: 900, 
            marginBottom: 40, 
            fontFamily: "'Barlow Condensed', sans-serif", 
            textTransform: "uppercase",
            lineHeight: 0.95,
            letterSpacing: "-0.02em"
          }}>
            Unidad de<br /><span style={{ color: ACCENT }}>Respuesta Rápida.</span>
          </h1>
          <div style={{ color: INK2, fontSize: "clamp(16px, 1.5vw, 20px)", lineHeight: 1.8 }}>
            <p style={{ marginBottom: 32 }}>
              Riders Media fusiona la <strong style={{ color: INK }}>precisión técnica con la creatividad disruptiva.</strong> No somos una agencia de marketing convencional, no hacemos planes a 6 meses para cambiar el color de un botón.
            </p>
            <p style={{ marginBottom: 40 }}>
              Resolvemos el problema de la lentitud digital y la falta de transparencia en la industria. Somos eficaces en la entrega, rigurosos en el código (React/Next.js) y 100% transparentes en el proceso.
            </p>
            <blockquote style={{ 
              borderLeft: `4px solid ${ACCENT}`, 
              paddingLeft: 32, 
              fontStyle: "italic", 
              color: INK, 
              background: SURFACE, 
              padding: "32px", 
              borderRadius: "0 12px 12px 0",
              fontSize: "clamp(18px, 1.8vw, 24px)",
              fontWeight: 600,
              boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
            }}>
              "Construimos los activos digitales más rápidos de la región. Combinamos infraestructura web de alto nivel con producción visual premium para que tu negocio domine la atención."
            </blockquote>
          </div>
        </div>
        
        {/* Pilares de la Agencia */}
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", 
          gap: 40, 
          borderTop: `1px solid ${BORDER}`, 
          paddingTop: 80 
        }}>
           {[
             { label: "Nuestra Misión", body: "Impulsar el crecimiento de PyMEs mediante la construcción de infraestructuras web superiores y contenido visual que captura la atención en los primeros segundos de interacción." }, 
             { label: "Nuestro Compromiso", body: "Velocidad táctica de entrega, transparencia total en costos desde el día cero y resultados medibles orientados a conversión. Sin excusas, sin letra chica." }
           ].map((item, i) => (
              <div key={i} style={{ 
                background: SURFACE, 
                padding: "48px", 
                border: `1px solid ${BORDER}`, 
                borderRadius: "12px",
                transition: "transform 0.3s ease, border-color 0.3s ease",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.borderColor = ACCENT;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor = BORDER;
              }}
              >
                <div style={{ 
                  fontSize: 12, 
                  fontWeight: 900, 
                  letterSpacing: "0.2em", 
                  textTransform: "uppercase", 
                  color: ACCENT, 
                  marginBottom: 24 
                }}>
                  {item.label}
                </div>
                <p style={{ color: INK2, fontSize: 17, lineHeight: 1.7 }}>
                  {item.body}
                </p>
              </div>
           ))}
        </div>
      </div>
    </div>
  );
}


function ContactView({ isMobile, initialService }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", service: initialService || "", message: "" });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [servicesList, setServicesList] = useState([]);

  useEffect(() => {
    if (!window.Papa || !CATALOGO_CSV_URL) {
      setServicesList(CATALOG);
      const defaultService = initialService || (CATALOG.length > 0 ? CATALOG[0].id : "");
      setForm(prev => ({ ...prev, service: defaultService }));
      return;
    }
    fetch(`${CATALOGO_CSV_URL}&t=${Date.now()}`)
      .then(res => res.text())
      .then(csvText => {
        if (csvText.trim().startsWith('<')) {
          setServicesList(CATALOG);
          const defaultService = initialService || (CATALOG.length > 0 ? CATALOG[0].id : "");
          setForm(prev => ({ ...prev, service: defaultService }));
          return;
        }
        window.Papa.parse(csvText, {
          header: true, skipEmptyLines: true,
          transformHeader: h => h.trim(),
          complete: (results) => {
            const fetchedData = results.data
              .filter(row => row["Servicio"] && row["Servicio"].trim() !== "")
              .map((row, index) => ({
                id: `sheet-item-${index}`,
                name: row["Servicio"]?.trim() || "",
                price: row["Inversión (Desde)"] ? row["Inversión (Desde)"].toString().trim() : "",
              }));
            if (fetchedData.length > 0) {
              setServicesList(fetchedData);
              const defaultService = initialService || fetchedData[0].id;
              setForm(prev => ({ ...prev, service: defaultService }));
            } else {
              setServicesList(CATALOG);
              const defaultService = initialService || (CATALOG.length > 0 ? CATALOG[0].id : "");
              setForm(prev => ({ ...prev, service: defaultService }));
            }
          }
        });
      })
      .catch(() => {
        setServicesList(CATALOG);
        const defaultService = initialService || (CATALOG.length > 0 ? CATALOG[0].id : "");
        setForm(prev => ({ ...prev, service: defaultService }));
      });
  }, [initialService]);

  const handle = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    const selectedService = servicesList.find(s => s.id === form.service);
    const serviceName = selectedService
      ? `${selectedService.name} (${selectedService.price.includes('$') ? selectedService.price : '$' + selectedService.price} MXN)`
      : form.service;
    const templateParams = {
      name: form.name, email: form.email,
      service_requested: serviceName,
      message: form.message, phone: form.phone
    };
    emailjs.send("service_ko9wm6r", "template_p02dor7", templateParams, "1b2HC5hu9s5FV_mHd")
      .then(() => {
        setLoading(false); setSent(true);
        setForm({ name: "", email: "", phone: "", service: servicesList.length > 0 ? servicesList[0].id : "", message: "" });
        setTimeout(() => setSent(false), 6000);
      }, () => { setLoading(false); setError(true); });

    const waNumber = "522202256586";
    const waMessage = `¡Hola! Me interesa solicitar una cotización.\n\n*Mis datos:*\n 👋🏼 Nombre: ${form.name}\n 📬 Email: ${form.email}\n 🤳🏼 Teléfono: ${form.phone}\n 📦 Servicio: ${serviceName}\n\n*Mi mensaje:*\n${form.message}`;
    window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(waMessage)}`, "_blank");
  };

  // ── Inputs con borde visible sobre fondo claro ───────────────
  const inputStyle = {
    width: "100%",
    background: BG,
    border: `1.5px solid ${BORDER}`,
    padding: "14px 18px",
    borderRadius: "8px",
    color: INK,
    fontSize: 15,
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s, box-shadow 0.2s",
    fontFamily: "inherit"
  };
  const onFocusInput = e => {
    e.currentTarget.style.borderColor = ACCENT;
    e.currentTarget.style.boxShadow  = `0 0 0 3px ${ACCENT}20`;
  };
  const onBlurInput = e => {
    e.currentTarget.style.borderColor = BORDER;
    e.currentTarget.style.boxShadow   = "none";
  };
  const labelStyle = {
    fontSize: 11, fontWeight: 900,
    letterSpacing: "0.15em", textTransform: "uppercase",
    color: INK2, display: "block", marginBottom: 9
  };

  return (
    <div style={{ padding: "120px 8vw", background: BG, position: "relative", overflow: "hidden" }}>

      <PatternBg show={PATRON.contacto} opacity={0.02} maskStop="80%" />

      <style>{`
        @keyframes pulseContactDot {
          0%,100% { opacity:1; transform:scale(1); }
          50% { opacity:0.5; transform:scale(0.8); }
        }
        .contact-dot { animation: pulseContactDot 2s ease-in-out infinite; }
      `}</style>

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1100, margin: "0 auto" }}>

        {/* Encabezado */}
        <SectionLabel>Contacto</SectionLabel>
        <h1 style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontSize: "clamp(48px, 6vw, 80px)",
          fontWeight: 900, textTransform: "uppercase",
          color: INK, lineHeight: 0.95,
          marginBottom: 56, letterSpacing: "-0.02em"
        }}>
          Hablemos <span style={{ color: ACCENT }}>Hoy.</span>
        </h1>

        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1.7fr",
          gap: "24px", alignItems: "start"
        }}>

          {/* ── Panel izquierdo — degradado oscuro ──────────── */}
          <div style={{
            background: `linear-gradient(150deg, ${INK2} 0%, ${INK} 55%, #0A1520 100%)`,
            padding: "44px 36px",
            borderRadius: "16px",
            display: "flex", flexDirection: "column",
            justifyContent: "space-between",
            position: "relative", overflow: "hidden",
            minHeight: isMobile ? "auto" : "580px"
          }}>
            {/* Círculo decorativo */}
            <div style={{
              position: "absolute", bottom: -70, right: -70,
              width: 220, height: 220, borderRadius: "50%",
              background: `${ACCENT}12`, pointerEvents: "none"
            }} />
            <div style={{
              position: "absolute", top: -40, left: -40,
              width: 120, height: 120, borderRadius: "50%",
              background: `${ACCENT}08`, pointerEvents: "none"
            }} />

            <div style={{ position: "relative", zIndex: 1 }}>

              {/* Logo */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 36 }}>
                <LogoIcon size={26} />
                <span style={{ fontWeight: 900, fontSize: 15, color: "#ffffff", letterSpacing: "0.05em" }}>
                  IDERS MEDIA
                </span>
              </div>

              {/* Badge de disponibilidad */}
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                padding: "8px 14px", borderRadius: "20px", marginBottom: 28
              }}>
                <div className="contact-dot" style={{
                  width: 7, height: 7, borderRadius: "50%", background: ACCENT
                }} />
                <span style={{
                  fontSize: 10, fontWeight: 800,
                  color: "rgba(255,255,255,0.65)",
                  letterSpacing: "0.1em", textTransform: "uppercase"
                }}>Respuesta en menos de 24h</span>
              </div>

              <p style={{
                color: "rgba(255,255,255,0.5)", fontSize: 15,
                lineHeight: 1.75, marginBottom: 44
              }}>
                Sin filtros, sin juntas innecesarias.<br />
                Directo al punto y a la estrategia de tu negocio.
              </p>

              {/* Datos de contacto */}
              <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
                {[
                  { label: "Email",     val: "contacto@riders.media",  href: "mailto:contacto@riders.media" },
                  { label: "WhatsApp",  val: "+52 220 225 6586",        href: "https://wa.me/522202256586?text=Quiero%20cotizar%20con%20ustedes%21" },
                  { label: "Ciudad",    val: "Puebla, MX" }
                ].map(c => (
                  <div key={c.label}>
                    <div style={{
                      fontSize: 10, fontWeight: 900,
                      letterSpacing: "0.2em", textTransform: "uppercase",
                      color: ACCENT, marginBottom: 6
                    }}>{c.label}</div>
                    <div style={{ fontSize: 15, color: "#ffffff", fontWeight: 600 }}>
                      {c.href
                        ? <a href={c.href} target="_blank" rel="noopener noreferrer"
                            style={{ color: "inherit", textDecoration: "none", transition: "color 0.2s" }}
                            onMouseEnter={e => e.currentTarget.style.color = ACCENT}
                            onMouseLeave={e => e.currentTarget.style.color = "#ffffff"}
                          >{c.val}</a>
                        : c.val}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Social links */}
            <div style={{
              position: "relative", zIndex: 1,
              marginTop: 44, paddingTop: 28,
              borderTop: "1px solid rgba(255,255,255,0.08)"
            }}>
              <div style={{
                fontSize: 9, fontWeight: 800,
                color: "rgba(255,255,255,0.28)",
                textTransform: "uppercase", letterSpacing: "0.15em",
                marginBottom: 14
              }}>Síguenos</div>
              <div style={{ display: "flex", gap: 10 }}>
                {[
                  { name: "IG", color: "#E4405F", url: "https://www.instagram.com/riders_media.mk/" },
                  { name: "FB", color: "#1877F2", url: "https://www.facebook.com/profile.php?id=61579283677547" },
                  { name: "WA", color: "#25D366", url: "https://wa.me/522202256586?text=Quiero%20cotizar%20con%20ustedes%21" },
                  { name: "TL", color: "#0088cc", url: "https://t.me/Ridersmedia?text=Quiero%20cotizar%20con%20ustedes%21" },
                ].map(link => (
                  <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer"
                    style={{
                      width: 40, height: 40, borderRadius: "8px",
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      color: "rgba(255,255,255,0.5)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      textDecoration: "none", fontSize: 11, fontWeight: 900,
                      transition: "all 0.2s"
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background   = link.color;
                      e.currentTarget.style.borderColor  = link.color;
                      e.currentTarget.style.color        = "#ffffff";
                      e.currentTarget.style.transform    = "translateY(-2px)";
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background   = "rgba(255,255,255,0.06)";
                      e.currentTarget.style.borderColor  = "rgba(255,255,255,0.08)";
                      e.currentTarget.style.color        = "rgba(255,255,255,0.5)";
                      e.currentTarget.style.transform    = "translateY(0)";
                    }}
                  >{link.name}</a>
                ))}
              </div>
            </div>
          </div>

          {/* ── Formulario ──────────────────────────────────── */}
          <form onSubmit={handle} style={{
            background: SURFACE,
            padding: isMobile ? "36px 24px" : "48px 44px",
            borderRadius: "16px",
            border: `1px solid ${BORDER}`,
            display: "flex", flexDirection: "column", gap: 22,
            boxShadow: "0 8px 40px rgba(0,0,0,0.04)"
          }}>

            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 20 }}>
              <div>
                <label style={labelStyle}>Nombre</label>
                <input required style={inputStyle} value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="Shaiel Saucedo"
                  onFocus={onFocusInput} onBlur={onBlurInput} />
              </div>
              <div>
                <label style={labelStyle}>Email</label>
                <input required type="email" style={inputStyle} value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="Micorreo@Gmail.com"
                  onFocus={onFocusInput} onBlur={onBlurInput} />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Teléfono</label>
              <input required type="tel" style={inputStyle} value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
                placeholder="+52 1 234 567 8910"
                onFocus={onFocusInput} onBlur={onBlurInput} />
            </div>

            <div>
              <label style={labelStyle}>Servicio de interés</label>
              <select
                style={{
                  ...inputStyle, cursor: "pointer",
                  appearance: "none", WebkitAppearance: "none",
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 10 10'%3E%3Cpath fill='%236B7C93' d='M5 7L0 2h10z'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 18px center",
                  paddingRight: "44px"
                }}
                value={form.service}
                onChange={e => setForm({ ...form, service: e.target.value })}
                onFocus={onFocusInput} onBlur={onBlurInput}
              >
                {servicesList.map(s => {
                  const formattedPrice = s.price.toString().includes('$') ? s.price : `$${s.price}`;
                  return (
                    <option key={s.id} value={s.id} style={{ background: BG, color: INK }}>
                      {s.name} — {formattedPrice} MXN
                    </option>
                  );
                })}
              </select>
            </div>

            <div>
              <label style={labelStyle}>Mensaje</label>
              <textarea required rows={4}
                style={{ ...inputStyle, resize: "vertical" }}
                value={form.message}
                onChange={e => setForm({ ...form, message: e.target.value })}
                placeholder="Cuéntame sobre tu proyecto, ¿qué necesitas?"
                onFocus={onFocusInput} onBlur={onBlurInput}
              />
            </div>

            {/* Nota informativa — nuevo */}
            <div style={{
              display: "flex", gap: 12, alignItems: "flex-start",
              background: MUTED_RED,
              border: `1px solid ${ACCENT}25`,
              padding: "14px 16px", borderRadius: "8px"
            }}>
              <span style={{ fontSize: 16, flexShrink: 0 }}>💬</span>
              <p style={{ color: INK2, fontSize: 12, lineHeight: 1.65, margin: 0 }}>
                Al enviar se abrirá un chat de WhatsApp con tu información prellenada para continuar la conversación directamente con el equipo.
              </p>
            </div>

            <button type="submit" disabled={loading}
              style={{
                background: loading ? INK3 : `linear-gradient(135deg, ${ACCENT} 0%, #E8930F 100%)`,
                color: loading ? "#fff" : INK,
                border: "none", padding: "18px",
                borderRadius: "10px", fontWeight: 900,
                cursor: loading ? "wait" : "pointer",
                textTransform: "uppercase",
                letterSpacing: "0.1em", fontSize: 14,
                boxShadow: loading ? "none" : `0 8px 28px ${ACCENT}40`,
                transition: "all 0.25s"
              }}
              onMouseEnter={e => {
                if (!loading) {
                  e.currentTarget.style.transform  = "translateY(-2px)";
                  e.currentTarget.style.boxShadow  = `0 14px 40px ${ACCENT}55`;
                }
              }}
              onMouseLeave={e => {
                if (!loading) {
                  e.currentTarget.style.transform  = "translateY(0)";
                  e.currentTarget.style.boxShadow  = `0 8px 28px ${ACCENT}40`;
                }
              }}
            >
              {loading ? "Procesando..." : "Enviar y Chatear por WhatsApp →"}
            </button>

            {sent && (
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                color: SUCCESS, fontWeight: 800, textAlign: "center",
                padding: "12px", background: `${SUCCESS}12`,
                border: `1px solid ${SUCCESS}30`, borderRadius: "8px"
              }}>
                ✓ Solicitud enviada correctamente.
              </div>
            )}
            {error && (
              <div style={{
                color: "#ff4d4f", fontWeight: 800, textAlign: "center",
                padding: "12px", background: "#ff4d4f12",
                border: "1px solid #ff4d4f30", borderRadius: "8px"
              }}>
                ❌ Hubo un error al enviar el correo, pero el chat debería abrirse.
              </div>
            )}
          </form>

        </div>
      </div>
    </div>
  );
}

function SocialFloat({ isMobile }) {
  const [isOpen, setIsOpen] = useState(false);

  const socialLinks = [
    { name: "TL", color: "#0088cc", url: "https://t.me/Ridersmedia?text=Quiero%20cotizar%20con%20ustedes%21" },
    { name: "FB", color: "#1877F2", url: "https://www.facebook.com/profile.php?id=61579283677547" },
    { name: "IG", color: "#E4405F", url: "https://www.instagram.com/riders_media.mk/" },
    { name: "WA", color: "#25D366", url: "https://wa.me/522202256586?text=Quiero%20cotizar%20con%20ustedes%21" },
  ];

  const btnSize = isMobile ? "40px" : "50px";
  const btnFont = isMobile ? "12px" : "14px";
  const position = isMobile ? "15px" : "30px";

  return (
    <div 
      style={{ 
        position: "fixed", 
        bottom: position, 
        right: position, 
        display: "flex", 
        flexDirection: "column-reverse", 
        alignItems: "center",
        gap: "10px", 
        zIndex: 2000 
      }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: btnSize,
          height: btnSize,
          borderRadius: "50%",
          background: isOpen ? "#333" : "#000",
          color: "#fff",
          border: "none",
          cursor: "pointer",
          fontSize: "24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          zIndex: 2001,
          transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
          transform: isOpen ? "rotate(135deg)" : "rotate(0deg)",
          outline: "none"
        }}
      >
        +
      </button>

      {socialLinks.map((link, index) => (
        <a 
          key={link.name} 
          href={link.url} 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ 
            width: btnSize, 
            height: btnSize, 
            borderRadius: "50%", 
            background: link.color, 
            color: "#fff", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            textDecoration: "none", 
            fontWeight: "900", 
            fontSize: btnFont, 
            boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
            opacity: isOpen ? 1 : 0,
            visibility: isOpen ? "visible" : "hidden",
            pointerEvents: isOpen ? "auto" : "none",
            transform: isOpen 
              ? "translateY(0) scale(1)" 
              : `translateY(${(index + 1) * 15}px) scale(0.5)`,
            transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
            transitionDelay: isOpen ? `${index * 0.05}s` : "0s",
          }}
          onMouseEnter={e => e.currentTarget.style.filter = "brightness(1.1)"}
          onMouseLeave={e => e.currentTarget.style.filter = "brightness(1)"}
        >
          {link.name}
        </a>
      ))}
    </div>
  );
}

// ── APP RAÍZ ───────────────────────────────────────────────────────────

export default function App() {
  const [page, setPage] = useState("inicio");
  const [marketStats, setMarketStats] = useState([]);
  const [casesList, setCasesList] = useState(CASES || []);
  const [preselectedService, setPreselectedService] = useState(null);

  const isMobile = useIsMobile();
  const [menuOpen, setMenuOpen] = useState(false);

  const nav = (p, serviceId = null) => {
    setPage(p);
    setPreselectedService(serviceId);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

 useEffect(() => {
  if (!SHEET_CSV_URL || SHEET_CSV_URL === "" || SHEET_CSV_URL.includes("sharing")) return;
  fetch(`${SHEET_CSV_URL}&t=${Date.now()}`)
    .then(res => res.text())
    .then(csvText => {
      if (csvText.trim().startsWith('<')) return;

      if (window.Papa) {
        window.Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          transformHeader: h => h.trim(),
          complete: (results) => {
            const parsed = results.data
              .map(row => ({
                label:       row["Etiqueta"]?.trim()   || "",
                freelance:   parseFloat(row["Freelance"]) || 0,
                agencias:    parseFloat(row["Agencias"])  || 0,
                riders:      parseFloat(row["Riders"])    || 0,
                description: row["Descripcion"]?.trim()  || "",
                tipo:       (row["Tipo"]?.trim()          || "barra").toLowerCase(),
                unidad:      row["Unidad"]?.trim()        || "",
                mejor:      (row["Mejor"]?.trim()         || "mayor").toLowerCase(),
              }))
              .filter(item => item.label && !isNaN(item.freelance));
            if (parsed.length > 0) setMarketStats(parsed);
          }
        });
      } else {
        // Fallback manual (sin PapaParse)
        const rows = csvText.split('\n').slice(1);
        const parsed = rows.map(row => {
          const cols = row.replace(/\r/g, '').split(',');
          if (cols.length < 4) return null;
          const freelanceVal = parseFloat(cols[1]);
          if (isNaN(freelanceVal)) return null;
          return {
            label:       cols[0]?.trim() || "",
            freelance:   freelanceVal    || 0,
            agencias:    parseFloat(cols[2]) || 0,
            riders:      parseFloat(cols[3]) || 0,
            description: cols[4]?.trim() || "",
            tipo:        cols[5]?.trim().toLowerCase() || "barra",
            unidad:      cols[6]?.trim() || "",
            mejor:       cols[7]?.trim().toLowerCase() || "mayor",
          };
        }).filter(item => item && item.label);
        if (parsed.length > 0) setMarketStats(parsed);
      }
    }).catch(err => console.error(err));
}, []);

  useEffect(() => {
    if (!CASES_CSV_URL || CASES_CSV_URL === "" || CASES_CSV_URL.includes("sharing")) return;
    fetch(`${CASES_CSV_URL}&t=${Date.now()}`)
      .then(res => res.text())
      .then(csvText => {
        if (csvText.trim().startsWith('<')) return;
        const rows = csvText.split('\n').slice(1); 
        const parsed = rows.map(row => {
          const cols = row.replace(/\r/g, '').split(','); 
          if (cols.length >= 4) {
             return { cat: cols[0], client: cols[1], result: cols[2], color: cols[3] || ACCENT, link: cols[4] || "#" };
          }
          return null;
        }).filter(item => item && item.client);
        if(parsed.length > 0) setCasesList(parsed);
      }).catch(err => console.error(err));
  }, []);

  const PAGES = [
    { id: "inicio", label: "Inicio" },
    { id: "catalogo", label: "Catálogo" },
    { id: "valor", label: "Accesibilidad" },
    { id: "casos", label: "Casos" },
    { id: "agencia", label: "Agencia" },
    { id: "contacto", label: "Contacto" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: BG, color: INK, fontFamily: "system-ui, sans-serif" }}>

      {PATRON.global && (
        <div style={{
          position: "fixed", top: 0, left: 0,
          width: "100vw", height: "100vh",
          backgroundImage: "url('/patron.svg')",
          backgroundRepeat: "repeat", backgroundSize: "150px",
          opacity: 0.04, pointerEvents: "none", zIndex: 9999
        }} />
      )}

      <SocialFloat isMobile={isMobile} />

      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000, background: `rgba(255,255,255,0.85)`, backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderBottom: `1px solid ${BORDER}`, height: "80px", display: "flex", alignItems: "center", padding: "0 5vw", justifyContent: "space-between" }}>
        <div onClick={() => nav("inicio")} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 3.5 }}>
          <LogoIcon size={32} />
          <span style={{ fontWeight: 900, fontSize: "20px", letterSpacing: "0.01em" }}>IDERS MEDIA</span>
        </div>

        {!isMobile ? (
          <>
            <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
              {PAGES.map(p => (
                <button key={p.id} onClick={() => nav(p.id)} style={{ background: "none", border: "none", cursor: "pointer", color: page === p.id ? ACCENT : INK2, fontSize: "12px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", padding: "8px 0", borderBottom: page === p.id ? `2px solid ${ACCENT}` : "2px solid transparent", transition: "all 0.2s" }}>
                  {p.label}
                </button>
              ))}
            </div>
            <button
              onClick={() => nav("contacto")}
              style={{ background: `linear-gradient(135deg, ${ACCENT} 0%, #E8930F 100%)`, color: INK, border: "none", padding: "12px 28px", borderRadius: "8px", fontWeight: 800, cursor: "pointer", textTransform: "uppercase", fontSize: 12, letterSpacing: "0.05em", boxShadow: `0 4px 16px ${ACCENT}30`, transition: "all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = `0 8px 24px ${ACCENT}45`; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = `0 4px 16px ${ACCENT}30`; }}
            >
              Cotizar
            </button>
          </>
        ) : (
          <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: "none", border: "none", fontSize: "28px", color: INK, cursor: "pointer" }}>
            {menuOpen ? "✕" : "☰"}
          </button>
        )}
      </nav>

      {isMobile && menuOpen && (
        <div style={{ position: "fixed", top: "80px", left: 0, right: 0, background: BG, borderBottom: `1px solid ${BORDER}`, zIndex: 999, display: "flex", flexDirection: "column", padding: "20px 5vw", boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}>
           {PAGES.map(p => (
             <button key={p.id} onClick={() => nav(p.id)} style={{ background: "none", border: "none", color: page === p.id ? ACCENT : INK, fontSize: "16px", fontWeight: 800, textTransform: "uppercase", textAlign: "left", padding: "15px 0", borderBottom: `1px solid ${BORDER}` }}>
               {p.label}
             </button>
           ))}
           <button onClick={() => nav("contacto")} style={{ background: INK, color: "#fff", border: "none", padding: "15px", borderRadius: "4px", fontWeight: 800, width: "100%", marginTop: "15px", textTransform: "uppercase" }}>
             Cotizar
           </button>
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

      <footer style={{ padding: "20px 5vw", borderTop: `3px solid transparent`, borderImage: `linear-gradient(90deg, ${ACCENT}, #E8930F, ${INK2}) 1`, background: `linear-gradient(180deg, ${BG2} 0%, #ECE7DC 100%)` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
             <LogoIcon size={24} />
             <span style={{ fontWeight: 900, color: INK, letterSpacing: "0.05em" }}>IDERS MEDIA</span>
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