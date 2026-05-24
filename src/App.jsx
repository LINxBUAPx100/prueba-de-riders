import React, { useState, useEffect } from "react";
import emailjs from '@emailjs/browser';
import { COLORS, CATALOG, CASES, PILLARS, CASES_CSV_URL, SHEET_CSV_URL, CATALOGO_CSV_URL,} from "./data";
import "./index.css";

const { BG, BG2, SURFACE, INK, INK2, INK3, ACCENT, ACCENT2, BORDER, RIDERS, SUCCESS, WARNING, INFO, MUTED_RED, MUTED_TEAL, TERRA } = COLORS;

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

function HomeView({ nav, casesList = [] }) {
  const [playVideo, setPlayVideo] = useState(false);
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
          animation: scrollTicker 40s linear infinite;
        }
        .ticker-track:hover { animation-play-state: paused; }

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

          {/* H1 — nuevo copy */}
          <h1 style={{
            fontSize: "clamp(52px, 8vw, 110px)",
            color: INK, fontWeight: 900, lineHeight: 0.9,
            marginBottom: 22,
            fontFamily: "'Barlow Condensed', sans-serif",
            textTransform: "uppercase"
          }}>
            De la Idea<br />a la <span style={{ color: ACCENT }}>Realidad.</span>
          </h1>

          {/* Subtítulo — nuevo copy */}
          <p style={{
            fontSize: "clamp(12px, 1vw, 14px)",
            color: INK3, maxWidth: 500,
            lineHeight: 1.5, marginBottom: 20,
            fontWeight: 700, textTransform: "uppercase",
            letterSpacing: "0.08em"
          }}>
            Dirección visual premium e infraestructura web de alto rendimiento.
          </p>

          {/* Párrafo — nuevo copy */}
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

        {/* VIDEO / SHOWREEL */}
        <div style={{
          flex: "1 1 400px", width: "100%", aspectRatio: "16 / 9",
          background: SURFACE,
          border: `1px solid ${BORDER}`,
          borderRadius: "12px",
          position: "relative",
          display: "flex", alignItems: "center", justifyContent: "center",
          overflow: "hidden",
          boxShadow: `0 24px 64px rgba(0,0,0,0.07)`
        }}>
          {!playVideo ? (
            <>
              <div style={{
                position: "absolute", inset: 0,
                backgroundImage: `linear-gradient(${BORDER} 1px, transparent 1px), linear-gradient(90deg, ${BORDER} 1px, transparent 1px)`,
                backgroundSize: "40px 40px",
                opacity: 0.7
              }} />
              <div style={{ textAlign: "center", zIndex: 2 }}>
                <div
                  onClick={() => setPlayVideo(true)}
                  style={{
                    width: 80, height: 80, borderRadius: "50%",
                    background: ACCENT, color: INK,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    margin: "0 auto 16px", fontSize: 22, cursor: "pointer",
                    boxShadow: `0 12px 32px ${ACCENT}60`,
                    transition: "transform 0.2s, box-shadow 0.2s"
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = "scale(1.08)";
                    e.currentTarget.style.boxShadow = `0 18px 48px ${ACCENT}80`;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.boxShadow = `0 12px 32px ${ACCENT}60`;
                  }}
                >
                  ▶
                </div>
                <span style={{
                  fontSize: 12, fontWeight: 800, color: INK2,
                  letterSpacing: "0.15em", textTransform: "uppercase"
                }}>Ver Showreel</span>
              </div>
            </>
          ) : (
            <iframe
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
              src="https://player.vimeo.com/video/201106279?autoplay=1&loop=1&autopause=0&title=0&byline=0&portrait=0"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              title="Showreel Riders.Media"
            />
          )}
        </div>

        {/* TICKER INFERIOR */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          borderTop: `1px solid ${BORDER}`,
          padding: "14px 0",
          background: SURFACE,
          zIndex: 3, overflow: "hidden"
        }}>
          <div className="ticker-track">
            {[...tickerData, ...tickerData, ...tickerData, ...tickerData].map((s, i) => (
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

      {/* ── MÉTRICAS — fondo naranja ──────────────────────────── */}
      <section style={{
        padding: "64px 8vw",
        background: ACCENT,
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
        gap: 32
      }}>
        {[
          { val: "48h",          lab: "Tiempo de Respuesta"  },
          { val: "100%",         lab: "Transparencia de Costos" },
          { val: CATALOG.length, lab: "Servicios Activos"    },
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

      {/* ── FILOSOFÍA — fondo oscuro ──────────────────────────── */}
      <section style={{
        padding: "120px 8vw",
        background: INK,
        position: "relative", overflow: "hidden"
      }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "url('/patron.svg')",
          backgroundRepeat: "repeat", backgroundSize: "1200px",
          opacity: 0.04, pointerEvents: "none", zIndex: 0
        }} />

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
                  background: "rgba(255,255,255,0.04)",
                  padding: "40px",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "8px",
                  transition: "border-color 0.3s, transform 0.3s"
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = ACCENT;
                  e.currentTarget.style.transform = "translateY(-4px)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div style={{
                  fontSize: 72, fontWeight: 900,
                  color: ACCENT, opacity: 0.75,
                  marginBottom: 16,
                  fontFamily: "'Barlow Condensed', sans-serif",
                  lineHeight: 1
                }}>{p.num}</div>
                <h3 style={{
                  fontSize: 22, color: "#ffffff",
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
        background: BG2,
        textAlign: "center"
      }}>
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
              background: ACCENT, color: INK,
              border: "none", padding: "20px 52px",
              fontWeight: 800, borderRadius: "4px",
              cursor: "pointer", fontSize: 14,
              letterSpacing: "0.08em", textTransform: "uppercase",
              boxShadow: `0 8px 24px ${ACCENT}40`,
              transition: "all 0.25s"
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = INK;
              e.currentTarget.style.color = "#fff";
              e.currentTarget.style.transform = "translateY(-3px)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = ACCENT;
              e.currentTarget.style.color = INK;
              e.currentTarget.style.transform = "translateY(0)";
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
                background: s.highlight ? BG2 : SURFACE,
                border: `1px solid ${s.highlight ? ACCENT : BORDER}`,
                padding: "40px",
                borderRadius: "8px",
                position: "relative",
                display: "flex",
                flexDirection: "column",
                boxShadow: s.highlight
                  ? `0 8px 32px ${ACCENT}22`
                  : "0 4px 16px rgba(0,0,0,0.04)",
                transition: "transform 0.2s, border-color 0.2s, box-shadow 0.2s"
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = s.highlight
                  ? `0 16px 48px ${ACCENT}30`
                  : `0 12px 36px rgba(0,0,0,0.09)`;
                if (!s.highlight) e.currentTarget.style.borderColor = ACCENT;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = s.highlight
                  ? `0 8px 32px ${ACCENT}22`
                  : "0 4px 16px rgba(0,0,0,0.04)";
                if (!s.highlight) e.currentTarget.style.borderColor = BORDER;
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
                onClick={() => nav("contacto")}
                style={{
                  width: "100%", padding: "14px",
                  background: s.highlight ? INK : "transparent",
                  color:      s.highlight ? "#fff" : INK,
                  border: `2px solid ${s.highlight ? INK : ACCENT}`,
                  borderRadius: "4px",
                  fontWeight: 800, cursor: "pointer",
                  fontSize: 13, letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  transition: "all 0.2s"
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = ACCENT;
                  e.currentTarget.style.borderColor = ACCENT;
                  e.currentTarget.style.color = INK;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = s.highlight ? INK : "transparent";
                  e.currentTarget.style.borderColor = s.highlight ? INK : ACCENT;
                  e.currentTarget.style.color = s.highlight ? "#fff" : INK;
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

        <div className="giant-wave-pattern" style={{
          position: "absolute",
          top: "-10%", left: "-10%",
          width: "120%", height: "120%",
          backgroundImage: "url('/patron.svg')",
          backgroundRepeat: "repeat",
          backgroundSize: "1200px",
          backgroundPosition: "center",
          filter: "invert(1)",
          pointerEvents: "none", zIndex: 0
        }} />

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
      {/* Patrón de fondo sutil */}
      <div style={{
        position: "absolute", top: 0, left: 0,
        width: "120%", height: "120%",
        backgroundImage: "url('/patron.svg')",
        backgroundRepeat: "repeat", backgroundSize: "1200px",
        backgroundPosition: "top center",
        opacity: 0.025, filter: "invert(1)",
        maskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 60%)",
        WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 60%)",
        pointerEvents: "none", zIndex: 0
      }} />

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
            <span style={{ color: ACCENT }}>Precios.</span>
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
  const PATRON_URL = '/patron.svg';

  return (
    <div style={{
      padding: "120px 8vw",
      background: BG,
      minHeight: "100vh",
      position: "relative",
      overflow: "hidden"
    }}>
      {/* Patrón de fondo */}
      <div style={{
        position: "absolute", top: 0, left: 0,
        width: "100%", height: "100%",
        backgroundImage: `url(${PATRON_URL})`,
        backgroundRepeat: "repeat", backgroundSize: "1200px",
        backgroundPosition: "top center",
        opacity: 0.025, filter: "invert(1)",
        maskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 70%)",
        WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 70%)",
        pointerEvents: "none", zIndex: 0
      }} />

      <div style={{ position: "relative", zIndex: 1 }}>

        {/* Encabezado de sección */}
        <SectionLabel>Análisis de Mercado</SectionLabel>
        <h1 style={{
          fontSize: "clamp(32px, 5vw, 52px)",
          fontWeight: 900, marginBottom: 64,
          fontFamily: "'Barlow Condensed', sans-serif",
          textTransform: "uppercase",
          color: INK, lineHeight: 1.05
        }}>
          ¿Por qué Riders es la{" "}
          <span style={{ color: ACCENT }}>opción lógica?</span>
        </h1>

        {/* Leyenda global */}
        <div style={{
          display: "flex", gap: 24, marginBottom: 40,
          padding: "16px 24px",
          background: SURFACE,
          border: `1px solid ${BORDER}`,
          borderRadius: "8px",
          width: "fit-content"
        }}>
          {[
            { color: BORDER,  label: "Freelance" },
            { color: INK2,    label: "Agencias"  },
            { color: ACCENT,  label: "Riders"    }
          ].map(item => (
            <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{
                width: 12, height: 12, borderRadius: "3px",
                background: item.color,
                boxShadow: item.color === ACCENT ? `0 0 8px ${ACCENT}60` : "none"
              }} />
              <span style={{
                fontSize: 11, fontWeight: 800,
                color: item.color === ACCENT ? ACCENT : INK2,
                textTransform: "uppercase", letterSpacing: "0.08em"
              }}>{item.label}</span>
            </div>
          ))}
        </div>

        {/* Grid de gráficas */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "28px"
        }}>
          {stats && stats.length > 0 ? stats.map((stat, i) => {
            const maxVal  = Math.max(stat.freelance, stat.agencias, stat.riders);
            const safeMax = maxVal === 0 ? 1 : maxVal;
            const fHeight = Math.max((stat.freelance / safeMax) * 100, 4);
            const aHeight = Math.max((stat.agencias  / safeMax) * 100, 4);
            const rHeight = Math.max((stat.riders    / safeMax) * 100, 4);
            const isMoney = maxVal > 100;
            const fmt = (n) => isMoney ? `$${n.toLocaleString()}` : `${n}%`;

            return (
              <div key={i}
                style={{
                  background: SURFACE,
                  padding: "32px",
                  borderRadius: "12px",
                  border: `1px solid ${BORDER}`,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  transition: "box-shadow 0.25s, transform 0.25s"
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.boxShadow = `0 12px 40px rgba(0,0,0,0.09)`;
                  e.currentTarget.style.transform  = "translateY(-3px)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.transform  = "translateY(0)";
                }}
              >
                {/* Título */}
                <h3 style={{
                  fontSize: "12px", fontWeight: 900,
                  marginBottom: "32px",
                  textAlign: "center",
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  color: INK
                }}>{stat.label}</h3>

                {/* Área de gráfica */}
                <div style={{ position: "relative" }}>

                  {/* Líneas de cuadrícula horizontales */}
                  {[25, 50, 75].map(pct => (
                    <div key={pct} style={{
                      position: "absolute",
                      left: 0, right: 0,
                      bottom: `${pct * 2}px`,
                      borderTop: `1px dashed ${BORDER}`,
                      zIndex: 0, pointerEvents: "none"
                    }} />
                  ))}

                  {/* Barras */}
                  <div style={{
                    display: "flex",
                    alignItems: "flex-end",
                    height: "200px",
                    gap: "10px",
                    borderBottom: `2px solid ${BORDER}`,
                    position: "relative",
                    zIndex: 1
                  }}>

                    {/* Freelance */}
                    <div style={{
                      flex: 1, display: "flex",
                      flexDirection: "column",
                      alignItems: "center", height: "100%"
                    }}>
                      <div style={{ flex: 1, width: "100%", display: "flex", alignItems: "flex-end" }}>
                        <div style={{
                          height: `${fHeight}%`, width: "100%",
                          background: BORDER,
                          borderRadius: "4px 4px 0 0",
                          transition: "height 1s cubic-bezier(0.4, 0, 0.2, 1)"
                        }} />
                      </div>
                      <span style={{
                        fontSize: "11px", fontWeight: 800,
                        marginTop: "10px", color: INK
                      }}>{fmt(stat.freelance)}</span>
                      <span style={{
                        fontSize: "9px", fontWeight: 700,
                        marginTop: "4px", color: INK3,
                        letterSpacing: "0.05em", textTransform: "uppercase"
                      }}>Freelance</span>
                    </div>

                    {/* Agencias */}
                    <div style={{
                      flex: 1, display: "flex",
                      flexDirection: "column",
                      alignItems: "center", height: "100%"
                    }}>
                      <div style={{ flex: 1, width: "100%", display: "flex", alignItems: "flex-end" }}>
                        <div style={{
                          height: `${aHeight}%`, width: "100%",
                          background: INK2,
                          borderRadius: "4px 4px 0 0",
                          transition: "height 1s cubic-bezier(0.4, 0, 0.2, 1)"
                        }} />
                      </div>
                      <span style={{
                        fontSize: "11px", fontWeight: 800,
                        marginTop: "10px", color: INK
                      }}>{fmt(stat.agencias)}</span>
                      <span style={{
                        fontSize: "9px", fontWeight: 700,
                        marginTop: "4px", color: INK3,
                        letterSpacing: "0.05em", textTransform: "uppercase"
                      }}>Agencias</span>
                    </div>

                    {/* Riders — destacado en naranja */}
                    <div style={{
                      flex: 1, display: "flex",
                      flexDirection: "column",
                      alignItems: "center", height: "100%"
                    }}>
                      <div style={{ flex: 1, width: "100%", display: "flex", alignItems: "flex-end" }}>
                        <div style={{
                          height: `${rHeight}%`, width: "100%",
                          background: ACCENT,
                          borderRadius: "4px 4px 0 0",
                          boxShadow: `0 -8px 24px ${ACCENT}55`,
                          transition: "height 1s cubic-bezier(0.4, 0, 0.2, 1)"
                        }} />
                      </div>
                      <span style={{
                        fontSize: "14px", fontWeight: 900,
                        marginTop: "10px", color: ACCENT
                      }}>{fmt(stat.riders)}</span>
                      <span style={{
                        fontSize: "9px", fontWeight: 900,
                        marginTop: "4px", color: ACCENT,
                        letterSpacing: "0.05em", textTransform: "uppercase"
                      }}>Riders</span>
                    </div>

                  </div>
                </div>

                {/* Descripción de la métrica */}
                <p style={{
                  fontSize: "13px", color: INK2,
                  marginTop: "24px", lineHeight: "1.65",
                  textAlign: "center",
                  paddingTop: "20px",
                  borderTop: `1px solid ${BORDER}`
                }}>{stat.description}</p>
              </div>
            );
          }) : (
            <p style={{ fontWeight: 700, color: INK2 }}>
              Cargando análisis de mercado...
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function CasesView({ casesData }) {
  const [hovered, setHovered] = useState(null);
  const safeCases = casesData && casesData.length > 0 ? casesData : [];
  
  return (
    <div style={{ padding: "120px 8vw", background: BG, position: "relative", overflow: "hidden", minHeight: "100vh" }}>
      
      {/* Patrón de fondo sutil */}
      <div style={{
        position: "absolute",
        top: 0, left: 0,
        width: "100%", height: "100%",
        backgroundImage: "url('/patron.svg')",
        backgroundRepeat: "repeat",
        backgroundSize: "1200px", 
        backgroundPosition: "top center",
        opacity: 0.02, 
        filter: "invert(1)", 
        maskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 80%)",
        WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 80%)",
        pointerEvents: "none", 
        zIndex: 0,
      }} />

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
                  boxShadow: hovered === i ? `0 10px 30px rgba(0,0,0,0.15)` : "none"
                }} />
                
                {/* Categoría y Cliente */}
                <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", gap: 12, flex: "1 1 200px" }}>
                  <div style={{ 
                    fontSize: 11, 
                    fontWeight: 800, 
                    letterSpacing: "0.2em", 
                    textTransform: "uppercase", 
                    color: hovered === i ? ACCENT : INK3, 
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
                    color: hovered === i ? ACCENT : INK2, 
                    lineHeight: 1, 
                    letterSpacing: "-0.02em", 
                    transition: "color 0.3s ease, transform 0.3s ease",
                    transform: hovered === i ? "scale(1.05)" : "scale(1)",
                    transformOrigin: "right center"
                  }}>
                    {c.result}
                  </div>
                  <div style={{ 
                    fontSize: 28, 
                    color: hovered === i ? ACCENT : BORDER, 
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
      
      {/* Patrón de fondo */}
      <div style={{
        position: "absolute",
        top: 0, left: 0,
        width: "100%", height: "100%",
        backgroundImage: "url('/patron.svg')",
        backgroundRepeat: "repeat",
        backgroundSize: "1200px", 
        backgroundPosition: "top center",
        opacity: 0.02, 
        filter: "invert(1)", 
        maskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 80%)",
        WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 80%)",
        pointerEvents: "none", 
        zIndex: 0,
      }} />

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


function ContactView({ isMobile }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", service: "", message: "" });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Estado para guardar la lista dinámica desde Excel
  const [servicesList, setServicesList] = useState([]);

  // useEffect para leer el Google Sheet de catálogo
  useEffect(() => {
    // Si no detecta PapaParse o el URL, usa CATALOG de data.js como respaldo de seguridad
    if (!window.Papa || !CATALOGO_CSV_URL) {
      setServicesList(CATALOG);
      if (CATALOG.length > 0) setForm(prev => ({ ...prev, service: CATALOG[0].id }));
      return;
    }

    fetch(`${CATALOGO_CSV_URL}&t=${Date.now()}`)
      .then(res => res.text())
      .then(csvText => {
        if (csvText.trim().startsWith('<')) {
          setServicesList(CATALOG);
          if (CATALOG.length > 0) setForm(prev => ({ ...prev, service: CATALOG[0].id }));
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
                name: row["Servicio"]?.trim() || "",
                price: row["Inversión (Desde)"] ? row["Inversión (Desde)"].toString().trim() : "",
              }));

            if (fetchedData.length > 0) {
              setServicesList(fetchedData);
              // Auto-seleccionamos el primer servicio de la lista de Excel
              setForm(prev => ({ ...prev, service: fetchedData[0].id }));
            } else {
              setServicesList(CATALOG);
              if (CATALOG.length > 0) setForm(prev => ({ ...prev, service: CATALOG[0].id }));
            }
          }
        });
      })
      .catch(err => {
        console.error("Error cargando Excel para el formulario:", err);
        setServicesList(CATALOG); // Si hay fallo de red, muestra los estáticos
        if (CATALOG.length > 0) setForm(prev => ({ ...prev, service: CATALOG[0].id }));
      });
  }, []);

  const handle = (e) => {
    e.preventDefault(); 
    setLoading(true); 
    setError(false);
    
    // Buscamos el servicio seleccionado en nuestra lista dinámica del Excel
    const selectedService = servicesList.find(s => s.id === form.service);
    
    // Formateamos el nombre con el precio para WhatsApp y Correo
    const serviceName = selectedService 
      ? `${selectedService.name} (${selectedService.price.includes('$') ? selectedService.price : '$' + selectedService.price} MXN)` 
      : form.service;
    
    const templateParams = { 
      name: form.name, 
      email: form.email, 
      service_requested: serviceName, 
      message: form.message, 
      phone: form.phone 
    };

    emailjs.send("service_ko9wm6r", "template_p02dor7", templateParams, "1b2HC5hu9s5FV_mHd")
    .then(() => { 
      setLoading(false); 
      setSent(true); 
      // Al reiniciar, volvemos a apuntar al primer elemento del Excel
      setForm({ name: "", email: "", phone: "", service: servicesList.length > 0 ? servicesList[0].id : "", message: "" }); 
      setTimeout(() => setSent(false), 6000); 
    }, () => { 
      setLoading(false); 
      setError(true); 
    });

    const waNumber = "522202256586";
    const waMessage = `¡Hola! Me interesa solicitar una cotización.\n\n*Mis datos:*\n 👋🏼 Nombre: ${form.name}\n 📬 Email: ${form.email}\n 🤳🏼 Teléfono: ${form.phone}\n 📦 Servicio: ${serviceName}\n\n*Mi mensaje:*\n${form.message}`;
    const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(waMessage)}`;
    
    window.open(waUrl, "_blank");
  };

  const inputStyle = { width: "100%", background: BG, border: `1px solid ${BORDER}`, padding: "16px", borderRadius: "4px", color: INK, fontSize: 15, outline: "none", boxSizing: "border-box", transition: "border-color 0.2s", fontFamily: "inherit" };
  const labelStyle = { fontSize: 12, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: INK2, display: "block", marginBottom: 8 };

  return (
    <div style={{ padding: "120px 8vw", background: BG }}>
      <div style={{ maxWidth: 1000, margin: "0 auto", display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1.5fr", gap: 0, border: `1px solid ${BORDER}`, borderRadius: "8px", overflow: "hidden" }}>
        <div style={{ background: BG2, padding: "60px 40px", display: "flex", flexDirection: "column", justifyContent: "space-between", position: "relative", overflow: "hidden" }}>
          
          <div style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "url('/patron.svg')",
            backgroundRepeat: "repeat",
            backgroundSize: "300px",
            opacity: 0.04, 
            filter: "invert(1)", 
            pointerEvents: "none",
            zIndex: 0
          }} />

          <div style={{ position: "relative", zIndex: 1 }}>
            <h1 style={{ fontSize: "clamp(36px, 4vw, 48px)", fontWeight: 900, color: INK, marginBottom: 40, fontFamily: "'Barlow Condensed', sans-serif", textTransform: "uppercase", lineHeight: 1 }}>Hablemos<br /><span style={{ color: ACCENT }}>Hoy.</span></h1>
            <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
              {[
                { label: "Email", val: "contacto@riders.media" }, 
                { label: "WhatsApp", color: "#25D366", valColor: INK, val: "+52 220 225 6586", href: "https://wa.me/522202256586?text=Quiero%20cotizar%20con%20ustedes%21" }, 
                { label: "Ciudad", val: "Puebla, MX" }
              ].map(c => (
                <div key={c.label}>
                  <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.15em", textTransform: "uppercase", color: c.color || ACCENT, marginBottom: 6 }}>
                    {c.label}
                  </div>
                  <div style={{ fontSize: 16, color: c.valColor || INK, fontWeight: 600 }}>
                    {c.href ? <a href={c.href} target="_blank" rel="noopener noreferrer" style={{ color: "inherit", textDecoration: "none" }}>{c.val}</a> : c.val}
                  </div>
                </div>
               ))}
            </div>
          </div>
          
          <div style={{ marginTop: 60, padding: 24, background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: "4px", position: "relative", zIndex: 1 }}>
            <p style={{ fontSize: 13, color: INK2, lineHeight: 1.6, fontStyle: "italic", margin: 0 }}>Respondemos en menos de 24 horas. Sin filtros, directo a la estrategia.</p>
          </div>
        </div>

        <form onSubmit={handle} style={{ padding: "60px 40px", display: "flex", flexDirection: "column", gap: 24, background: SURFACE }}>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 20 }}>
            <div>
              <label style={labelStyle}>Nombre</label>
              <input required style={inputStyle} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label style={labelStyle}>Email</label>
              <input required type="email" style={inputStyle} value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>
          </div>
          <div>
            <label style={labelStyle}>Teléfono</label>
            <input required type="tel" style={inputStyle} value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
          </div>
          
          {/* AQUÍ ESTÁ EL SELECT ENLAZADO AL EXCEL */}
          <div>
            <label style={labelStyle}>Servicio</label>
            <select style={inputStyle} value={form.service} onChange={e => setForm({ ...form, service: e.target.value })}>
              {servicesList.map(s => {
                // Asegura el formato visual con el signo de dólar ($)
                const formattedPrice = s.price.toString().includes('$') ? s.price : `$${s.price}`;
                return (
                  <option key={s.id} value={s.id}>
                    {s.name} — {formattedPrice} MXN
                  </option>
                );
              })}
            </select>
          </div>

          <div>
            <label style={labelStyle}>Mensaje</label>
            <textarea required rows={5} style={inputStyle} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
          </div>
          <button type="submit" disabled={loading} style={{ background: loading ? INK3 : INK, color: "#fff", border: "none", padding: "18px", borderRadius: "4px", fontWeight: 800, cursor: loading ? "wait" : "pointer" }}>
            {loading ? "Procesando..." : "Enviar y Chatear por WhatsApp →"}
          </button>
          
          {sent && <div style={{ color: "#25D366", fontWeight: 700 }}>✓ Solicitud enviada correctamente.</div>}
          {error && <div style={{ color: "red", fontWeight: 700 }}>❌ Hubo un error al enviar el correo, pero el chat debería abrirse.</div>}
        </form>
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
  
  const isMobile = useIsMobile();
  const [menuOpen, setMenuOpen] = useState(false);
  
  const nav = (p) => { 
    setPage(p); 
    setMenuOpen(false); 
    window.scrollTo({ top: 0, behavior: "smooth" }); 
  };

  useEffect(() => {
    if (!SHEET_CSV_URL || SHEET_CSV_URL === "" || SHEET_CSV_URL.includes("sharing")) return;
    fetch(`${SHEET_CSV_URL}&t=${Date.now()}`)
      .then(res => res.text())
      .then(csvText => {
        if (csvText.trim().startsWith('<')) return;
        const rows = csvText.split('\n').slice(1); 
        const parsed = rows.map(row => {
          const cols = row.replace(/\r/g, '').split(','); 
          if (cols.length >= 4) {
             const freelanceVal = parseFloat(cols[1]); 
             if (isNaN(freelanceVal)) return null;
             return { label: cols[0], freelance: freelanceVal || 0, agencias: parseFloat(cols[2]) || 0, riders: parseFloat(cols[3]) || 0, description: cols.slice(4).join(',') };
          }
          return null;
        }).filter(item => item && item.label);
        if(parsed.length > 0) setMarketStats(parsed);
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
      
      <SocialFloat isMobile={isMobile} />

      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000, background: `${BG}ee`, backdropFilter: "blur(12px)", borderBottom: `1px solid ${BORDER}`, height: "80px", display: "flex", alignItems: "center", padding: "0 5vw", justifyContent: "space-between" }}>
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
            <button onClick={() => nav("contacto")} style={{ background: INK, color: "#fff", border: "none", padding: "12px 28px", borderRadius: "4px", fontWeight: 800, cursor: "pointer", textTransform: "uppercase", fontSize: 12, letterSpacing: "0.05em" }}>
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
        {page === "contacto" && <ContactView isMobile={isMobile} />}
      </main>

      <footer style={{ padding: "20px 5vw", borderTop: `1px solid ${BORDER}`, background: BG2 }}>
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