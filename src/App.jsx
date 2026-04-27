import React, { useState, useEffect } from "react";
import emailjs from '@emailjs/browser';
// Aquí importamos todo de un solo jalón, sin duplicados
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

// ── VISTAS ───────────────────────────────────────────────────────────────

function HomeView({ nav }) {
  const [playVideo, setPlayVideo] = useState(false);

  return (
    <div style={{ background: BG }}>
      {/* 1. HERO EXPANDIDO Y ESPACIADO */}
      <section style={{ padding: "100px 8vw 160px", position: "relative", overflow: "hidden", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "60px", minHeight: "100vh" }}>
        
        <div style={{ flex: "1 1 300px", position: "relative", zIndex: 2 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: ACCENT, boxShadow: `0 0 14px ${ACCENT}` }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: INK2, letterSpacing: "0.1em", textTransform: "uppercase" }}>UNIDAD DE RESPUESTA RÁPIDA · PUEBLA, MX</span>
          </div>
          
          <h1 style={{ fontSize: "clamp(52px, 8vw, 110px)", color: INK, fontWeight: 900, lineHeight: 0.9, marginBottom: 32, fontFamily: "'Barlow Condensed', sans-serif", textTransform: "uppercase" }}>
            Creatividad <br /><span style={{ color: ACCENT }}>Eficaz</span> Para <br />Tu Negocio.
          </h1>
          
          <p style={{ fontSize: "clamp(18px, 1.5vw, 22px)", color: INK2, maxWidth: 520, lineHeight: 1.6, marginBottom: 48 }}>
            No somos una agencia convencional. Somos un equipo táctico para PyMEs que necesitan <strong>velocidad, claridad y resultados medibles</strong> sin presupuestos inflados.
          </p>
          
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 80 }}>
            <button onClick={() => nav("catalogo")} style={{ background: INK, color: "#fff", border: "none", padding: "20px 45px", fontWeight: 700, borderRadius: "4px", cursor: "pointer", fontSize: 14, letterSpacing: "0.05em", transition: "transform 0.2s" }} onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"} onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
              Ver Catálogo 2026 →
            </button>
            <button onClick={() => nav("contacto")} style={{ background: "transparent", color: INK, border: `2px solid ${INK}`, padding: "20px 45px", fontWeight: 700, borderRadius: "4px", cursor: "pointer", fontSize: 14, letterSpacing: "0.05em", transition: "background 0.2s" }} onMouseEnter={e => {e.currentTarget.style.background = INK; e.currentTarget.style.color = "#fff"}} onMouseLeave={e => {e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = INK}}>
              Agendar Llamada
            </button>
          </div>
        </div>

        {/* ── ELEMENTO VISUAL HERO ── */}
        <div style={{ flex: "1 1 400px", minHeight: "400px", background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: "8px", position: "relative", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
          {!playVideo ? (
            <>
              <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(${BORDER} 1px, transparent 1px), linear-gradient(90deg, ${BORDER} 1px, transparent 1px)`, backgroundSize: "40px 40px", opacity: 0.5 }} />
              <div style={{ textAlign: "center", zIndex: 2 }}>
                <div 
                  onClick={() => setPlayVideo(true)} 
                  style={{ width: 80, height: 80, borderRadius: "50%", background: ACCENT, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: 24, cursor: "pointer", boxShadow: `0 10px 30px ${ACCENT}40`, transition: "transform 0.2s" }} 
                  onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"} 
                  onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                >
                  ▶
                </div>
                <span style={{ fontSize: 14, fontWeight: 800, color: INK, letterSpacing: "0.1em", textTransform: "uppercase" }}>Ver Showreel</span>
              </div>
            </>
          ) : (
    <iframe 
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
      src="https://player.vimeo.com/video/201106279?autoplay=1&title=0&byline=0&portrait=0" 
      allow="autoplay; fullscreen; picture-in-picture" 
      allowFullScreen
      title="Showreel Riders.Media"
    ></iframe>
  )}
</div>

        {/* TICKER INFERIOR (LISTÓN ANIMADO) */}
        <style>{`
          @keyframes ticker {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}</style>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, borderTop: `1px solid ${BORDER}`, padding: "15px 0", background: SURFACE, zIndex: 3, overflow: "hidden" }}>
           <div className="ticker-wrapper" style={{ display: "flex", width: "max-content", gap: 50, animation: "ticker 60s linear infinite" }}>
              {CATALOG.concat(CATALOG).map((s, i) => (
                <span key={i} style={{ color: i % 2 === 0 ? ACCENT : INK3, fontWeight: 800, fontSize: 14, textTransform: "uppercase", letterSpacing: "0.1em", whiteSpace: "nowrap" }}>
                  {s.name} •
                </span>
              ))}
           </div>
        </div>
      </section>

      {/* 2. PROBLEMA VS SOLUCIÓN */}
      <section style={{ padding: "120px 8vw", background: BG }}>
        <SectionLabel>El Estándar Riders</SectionLabel>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 80, marginTop: 40 }}>
          <div>
            <h2 style={{ fontSize: "clamp(36px, 5vw, 52px)", color: INK, fontWeight: 900, lineHeight: 1, marginBottom: 24, fontFamily: "'Barlow Condensed', sans-serif", textTransform: "uppercase" }}>
              La industria digital es <span style={{ color: INK3 }}>lenta y confusa.</span>
            </h2>
            <p style={{ color: INK2, fontSize: 18, lineHeight: 1.7, marginBottom: 32 }}>
              Las agencias tradicionales te atrapan en juntas interminables, contratos ocultos y meses de espera para lanzar una campaña básica. Tu negocio necesita moverse al ritmo del mercado.
            </p>
            <button onClick={() => nav("valor")} style={{ background: "none", border: `none`, color: ACCENT, fontWeight: 800, cursor: "pointer", fontSize: 14, letterSpacing: "0.05em", textTransform: "uppercase", padding: 0 }}>
              Conoce cómo trabajamos →
            </button>
          </div>
          
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {[
              { icon: "M", title: "Velocidad Táctica", desc: "Sistemas estructurados para entregar proyectos en días, no en meses." },
              { icon: "Á", title: "Foco en Conversión", desc: "Un diseño bonito que no vende es arte. Nosotros hacemos negocios." },
              { icon: "S", title: "Transparencia Radical", desc: "Catálogo público. Sabes exactamente qué incluye y cuánto cuesta." }
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 24, background: SURFACE, padding: "32px", borderRadius: "8px", border: `1px solid ${BORDER}` }}>
                <div style={{ fontSize: 32 }}>{item.icon}</div>
                <div>
                  <h4 style={{ fontSize: 18, fontWeight: 800, color: INK, marginBottom: 8 }}>{item.title}</h4>
                  <p style={{ fontSize: 15, color: INK2, lineHeight: 1.6 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. MÉTRICAS DE IMPACTO */}
      <section style={{ padding: "40px 8vw", background: INK, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 32, borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>
          {[
            { val: "48h", lab: "Tiempo de Respuesta" },
            { val: "100%", lab: "Transparencia de Costos" },
            { val: CATALOG.length, lab: "Servicios Activos" },
            { val: "B2B", lab: "Enfoque Principal" }
          ].map((m, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{ fontSize: "clamp(40px, 5vw, 56px)", fontWeight: 900, color: BG, fontFamily: "'Barlow Condensed', sans-serif" }}>{m.val}</div>
              <div style={{ fontSize: "12px", fontWeight: 700, color: SURFACE, textTransform: "uppercase", marginTop: 4, letterSpacing: "0.1em" }}>{m.lab}</div>
            </div>
          ))}
      </section>

     {/* 4. FILOSOFÍA */}
      <section style={{ padding: "120px 8vw", background: SURFACE }}>
        <SectionLabel>Filosofía</SectionLabel>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 32, marginTop: 40 }}>
          {PILLARS.map(p => (
            <div key={p.num} style={{ background: BG, padding: "40px", border: `1px solid ${BORDER}`, borderRadius: "8px", transition: "all 0.3s" }}
                 onMouseEnter={e => { e.currentTarget.style.borderColor = ACCENT; e.currentTarget.style.transform = "translateY(-4px)" }}
                 onMouseLeave={e => { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.transform = "translateY(0)" }}>
              
              <div style={{ fontSize: 72, fontWeight: 900, color: p.numColor || BORDER, marginBottom: 16, fontFamily: "'Barlow Condensed', sans-serif", opacity: 0.6 }}>
                {p.num}
              </div>
              <h3 style={{ fontSize: 24, color: p.titleColor || INK, marginBottom: 12, fontWeight: 800, textTransform: "uppercase" }}>
                {p.title}
              </h3>
              <p style={{ color: p.bodyColor || INK2, lineHeight: 1.7 }}>
                {p.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. CTA DE CIERRE */}
      <section style={{ padding: "140px 8vw", background: BG, borderBottom: `1px solid ${BORDER}`, textAlign: "center" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <div style={{ width: 64, height: 64, background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, margin: "0 auto 32px", color: ACCENT }}>
            V
          </div>
          <h2 style={{ fontSize: "clamp(42px, 6vw, 64px)", color: INK, fontWeight: 900, lineHeight: 1, marginBottom: 24, fontFamily: "'Barlow Condensed', sans-serif", textTransform: "uppercase" }}>
            ¿Listo para acelerar tu crecimiento?
          </h2>
          <p style={{ color: INK2, fontSize: 18, lineHeight: 1.6, marginBottom: 48 }}>
            Deja de perder tiempo y dinero con soluciones genéricas. Habla directamente con nosotros y pongamos a trabajar tu marca.
          </p>
          <button onClick={() => nav("contacto")} style={{ background: ACCENT, color: "#fff", border: "none", padding: "20px 50px", fontWeight: 800, borderRadius: "4px", cursor: "pointer", fontSize: 15, letterSpacing: "0.08em", textTransform: "uppercase", boxShadow: `0 10px 20px ${ACCENT}30`, transition: "transform 0.2s" }} onMouseEnter={e => e.currentTarget.style.transform = "translateY(-4px)"} onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
            Cotizar Mi Proyecto
          </button>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section style={{ padding: "15px 8vw", background: MUTED_TEAL, borderBottom: `1px solid ${BG}`, textAlign: "center" }}>
        <p style={{ fontSize: 15, fontWeight: 800, color: INK2, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 15 }}>-Marcas que confían en nosotros-</p>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "clamp(20px, 6vw, 100px)", opacity: 0.5, filter: "grayscale(100%)" }}>
          {["Garra Grafica", "Anzus y Thurizas", "Tortas la wera"].map((brand, i) => (
            <span key={i} style={{ fontSize: "clamp(18px, 3vw, 24px)", fontWeight: 900, fontFamily: "'Barlow Condensed', sans-serif", color: INK }}>{brand}</span>
          ))}
        </div>
      </section>
    </div>
  );
}

function CatalogView({ nav }) {
  const [catalog, setCatalog] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    // 1. Verificamos si PapaParse existe. Si no, te avisamos en pantalla.
    if (!window.Papa) {
      setErrorMsg("⚠️ Error: El script de PapaParse no se ha cargado en el index.html.");
      setIsLoading(false);
      return;
    }

    // 2. Usamos fetch para asegurar que el caché no nos juegue chueco
    fetch(`${CATALOGO_CSV_URL}&t=${Date.now()}`)
      .then(res => res.text())
      .then(csvText => {
        // 3. Verificamos si Google nos manda la página de iniciar sesión
        if (csvText.trim().startsWith('<')) {
          setErrorMsg("⚠️ El Google Sheet está privado. Cambia a 'Cualquier persona con el enlace'.");
          setIsLoading(false);
          return;
        }

        // 4. Analizamos el texto con PapaParse
        window.Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          transformHeader: h => h.trim(), // 🪄 MAGIA: Borra espacios invisibles en los títulos de tu Excel
          complete: (results) => {
            const fetchedData = results.data
              .filter(row => row["Servicio"] && row["Servicio"].trim() !== "") 
              .map((row, index) => ({
                id: `sheet-item-${index}`,
                name: row["Servicio"]?.trim() || "",
                tag: row["Tipo de Pago"]?.trim() || "",
                price: row["Inversión (Desde)"] ? row["Inversión (Desde)"].toString().trim() : "",
                desc: row["Descripción"]?.trim() || "",
                highlight: row["¿hightlight?"]?.trim().toUpperCase() === "TRUE" 
              }));

            // Si se leyó el excel pero el arreglo está vacío, los nombres de las columnas están mal.
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

  const monthly = catalog.filter(s => s.tag && s.tag.toLowerCase().includes("mensual"));
  const oneTime = catalog.filter(s => s.tag && (s.tag.toLowerCase().includes("único") || s.tag.toLowerCase().includes("unico"))); 
  const perPiece = catalog.filter(s => s.tag && s.tag.toLowerCase().includes("pieza"));

  function Section({ title, items }) {
    if (items.length === 0) return null;
    return (
      <div style={{ marginBottom: 64 }}>
        <SectionLabel>{title}</SectionLabel>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 }}>
          {items.map(s => (
            <div key={s.id} style={{ 
              background: s.highlight ? BG2 : "transparent", 
              border: `1px solid ${s.highlight ? ACCENT : BORDER}`, 
              padding: "40px", 
              borderRadius: "8px",
              position: "relative",
              transition: "transform 0.2s, border-color 0.2s"
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; if (!s.highlight) e.currentTarget.style.borderColor = ACCENT; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; if (!s.highlight) e.currentTarget.style.borderColor = BORDER; }}>
              {s.highlight && <div style={{ position: "absolute", top: 16, right: 16, background: ACCENT, color: "#fff", fontSize: 10, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", padding: "4px 10px", borderRadius: "20px" }}>Popular</div>}
              <Chip outline={!s.highlight}>{s.tag}</Chip>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 48, fontWeight: 900, color: INK, marginTop: 24, marginBottom: 8, letterSpacing: "-0.02em" }}>
                {s.price} <span style={{ fontSize: 16, fontWeight: 600, color: INK3 }}>MXN</span>
              </div>
              <h3 style={{ fontSize: 22, color: INK, margin: "0 0 12px", fontWeight: 800 }}>{s.name}</h3>
              <p style={{ color: INK2, fontSize: 14, minHeight: 60, marginBottom: 24, lineHeight: 1.6 }}>{s.desc}</p>
              <button onClick={() => nav("contacto")} style={{ width: "100%", padding: "14px", background: s.highlight ? INK : "transparent", color: s.highlight ? "#fff" : INK, border: `2px solid ${INK}`, borderRadius: "4px", fontWeight: 700, cursor: "pointer", transition: "all 0.2s" }}>
                Cotizar este servicio →
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div style={{ padding: "120px 8vw", background: BG, minHeight: "50vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <h2 style={{ color: INK, fontFamily: "'Barlow Condensed', sans-serif" }}>Cargando catálogo...</h2>
      </div>
    );
  }

  return (
    <div style={{ padding: "120px 8vw", background: BG }}>
      <div style={{ maxWidth: 700, marginBottom: 80 }}>
        <Chip accent>Tarifas Transparentes</Chip>
        <h1 style={{ fontSize: "clamp(48px, 7vw, 64px)", color: INK, marginTop: 24, marginBottom: 24, fontWeight: 900, fontFamily: "'Barlow Condensed', sans-serif", textTransform: "uppercase" }}>Servicios & Precios</h1>
        <p style={{ color: INK2, fontSize: 18, lineHeight: 1.7 }}>Sin letra chica. Sin sorpresas. Todos los precios son desde — cotizamos según tu proyecto.</p>
        
        {/* REPORTE DE ERRORES EN PANTALLA */}
        {errorMsg && (
          <div style={{ marginTop: 24, padding: "20px", background: MUTED_RED, color: INK, border: `2px solid ${ACCENT}`, borderRadius: "8px", fontWeight: 800 }}>
            {errorMsg}
          </div>
        )}
      </div>

      <Section title="Por pieza" items={perPiece} />
      <Section title="Pago único" items={oneTime} />
      <Section title="Paquetes mensuales" items={monthly} />
    </div>
  );
}

function ValorView({ stats }) {
  return (
    <div style={{ padding: "120px 8vw", background: COLORS.BG, minHeight: "100vh" }}>
      <SectionLabel>Análisis de Mercado</SectionLabel>
      <h1 style={{ fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 900, marginBottom: 80, fontFamily: "'Barlow Condensed'", textTransform: "uppercase" }}>
        ¿POR QUÉ RIDERS ES LA <span style={{ color: COLORS.ACCENT }}>OPCIÓN LÓGICA?</span>
      </h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "40px" }}>
        {stats && stats.length > 0 ? stats.map((stat, i) => {
          const maxVal = Math.max(stat.freelance, stat.agencias, stat.riders);
          const safeMax = maxVal === 0 ? 1 : maxVal;
          const fHeight = Math.max((stat.freelance / safeMax) * 100, 5);
          const aHeight = Math.max((stat.agencias / safeMax) * 100, 5);
          const rHeight = Math.max((stat.riders / safeMax) * 100, 5);
          const isMoney = maxVal > 100;
          const formatNumber = (num) => isMoney ? `$${num.toLocaleString()}` : `${num}%`;

          return (
            <div key={i} style={{ background: COLORS.SURFACE, padding: "40px", borderRadius: "12px", border: `1px solid ${COLORS.BORDER}`, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <h3 style={{ fontSize: "18px", fontWeight: 800, marginBottom: "40px", textAlign: "center", textTransform: "uppercase" }}>{stat.label}</h3>
                <div style={{ display: "flex", alignItems: "flex-end", height: "200px", gap: "10px", borderBottom: `1px solid ${COLORS.BORDER}`, paddingBottom: "15px" }}>
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", height: "100%" }}>
                    <div style={{ flex: 1, width: "100%", display: "flex", alignItems: "flex-end" }}>
                      <div style={{ height: `${fHeight}%`, width: "100%", background: COLORS.INK3, borderRadius: "4px 4px 0 0", transition: "height 1s cubic-bezier(0.4, 0, 0.2, 1)" }} />
                    </div>
                    <span style={{ fontSize: "12px", fontWeight: 800, marginTop: "10px", color: COLORS.INK }}>{formatNumber(stat.freelance)}</span>
                    <span style={{ fontSize: "10px", fontWeight: 700, marginTop: "4px", color: COLORS.INK2 }}>FREELANCE</span>
                  </div>
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", height: "100%" }}>
                    <div style={{ flex: 1, width: "100%", display: "flex", alignItems: "flex-end" }}>
                      <div style={{ height: `${aHeight}%`, width: "100%", background: COLORS.INK2, borderRadius: "4px 4px 0 0", transition: "height 1s cubic-bezier(0.4, 0, 0.2, 1)" }} />
                    </div>
                    <span style={{ fontSize: "12px", fontWeight: 800, marginTop: "10px", color: COLORS.INK }}>{formatNumber(stat.agencias)}</span>
                    <span style={{ fontSize: "10px", fontWeight: 700, marginTop: "4px", color: COLORS.INK2 }}>AGENCIAS</span>
                  </div>
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", height: "100%" }}>
                    <div style={{ flex: 1, width: "100%", display: "flex", alignItems: "flex-end" }}>
                      <div style={{ height: `${rHeight}%`, width: "100%", background: COLORS.ACCENT, borderRadius: "4px 4px 0 0", boxShadow: `0 -5px 15px ${COLORS.ACCENT}33`, transition: "height 1s cubic-bezier(0.4, 0, 0.2, 1)" }} />
                    </div>
                    <span style={{ fontSize: "14px", fontWeight: 900, marginTop: "10px", color: COLORS.ACCENT }}>{formatNumber(stat.riders)}</span>
                    <span style={{ fontSize: "11px", fontWeight: 900, marginTop: "4px", color: COLORS.ACCENT }}>RIDERS</span>
                  </div>
                </div>
              </div>
              <p style={{ fontSize: "13px", color: COLORS.INK2, marginTop: "25px", lineHeight: "1.6", textAlign: "center" }}>{stat.description}</p>
            </div>
          );
        }) : <p style={{ fontWeight: 700, color: COLORS.INK2 }}>Cargando análisis de mercado...</p>}
      </div>
    </div>
  );
}

function CasesView({ casesData }) {
  const [hovered, setHovered] = useState(null);
  const safeCases = casesData && casesData.length > 0 ? casesData : [];
  return (
    <div style={{ padding: "120px 8vw", background: BG }}>
      <div style={{ marginBottom: 64, display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 32 }}>
        <div>
          <SectionLabel>Evidencia</SectionLabel>
          <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "clamp(48px, 6vw, 64px)", fontWeight: 900, textTransform: "uppercase", color: INK, lineHeight: 1, margin: 0 }}>Impacto <span style={{ color: ACCENT }}>Real.</span></h1>
        </div>
        <p style={{ fontSize: "16px", color: INK2, lineHeight: 1.6, maxWidth: 480, margin: 0, paddingBottom: 8 }}>No vendemos humo ni métricas de vanidad. Diseñamos sistemas que se traducen directamente en crecimiento medible.</p>
      </div>
      <div style={{ borderTop: `2px solid ${INK}` }}>
        {safeCases.map((c, i) => (
          <a key={i} href={c.link || "#"} target="_blank" rel="noopener noreferrer" onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}
            style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", padding: "32px 0", borderBottom: `1px solid ${BORDER}`, position: "relative", cursor: "pointer", textDecoration: "none", transition: "all 0.3s ease" }}>
            <div style={{ position: "absolute", inset: 0, background: SURFACE, zIndex: 0, opacity: hovered === i ? 1 : 0, transition: "opacity 0.2s ease", left: "-2vw", right: "-2vw", borderRadius: "8px" }} />
            <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.15em", textTransform: "uppercase", color: hovered === i ? c.color : INK3, transition: "color 0.3s ease" }}>{c.cat}</div>
              <div style={{ fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 800, color: INK, letterSpacing: "-0.01em" }}>{c.client}</div>
            </div>
            <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: 24 }}>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 900, color: hovered === i ? c.color : INK, lineHeight: 1, letterSpacing: "-0.02em", transition: "color 0.3s ease" }}>{c.result}</div>
              <div style={{ fontSize: 24, color: hovered === i ? c.color : BORDER, fontWeight: 400, transform: hovered === i ? "translateX(4px)" : "translateX(0)", transition: "all 0.3s ease" }}>→</div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

function AboutView() {
  return (
    <div style={{ padding: "120px 8vw", background: BG }}>
      <div style={{ maxWidth: 800, marginBottom: 80 }}>
        <SectionLabel>Sobre la Agencia</SectionLabel>
        <h1 style={{ fontSize: "clamp(48px, 6vw, 64px)", color: INK, fontWeight: 900, marginBottom: 40, fontFamily: "'Barlow Condensed', sans-serif", textTransform: "uppercase" }}>Unidad de<br />Respuesta Rápida.</h1>
        <div style={{ color: INK2, fontSize: 18, lineHeight: 1.8 }}>
          <p style={{ marginBottom: 24 }}>Riders Media fusiona la <strong style={{ color: INK }}>precisión técnica con la creatividad disruptiva.</strong> No somos una agencia de marketing convencional.</p>
          <p style={{ marginBottom: 24 }}>Resolvemos el problema de la lentitud digital y la falta de transparencia en la industria. Somos eficaces en la entrega y 100% transparentes en el proceso.</p>
          <blockquote style={{ borderLeft: `4px solid ${ACCENT}`, paddingLeft: 24, fontStyle: "italic", color: INK, background: SURFACE, padding: "24px", borderRadius: "0 8px 8px 0" }}>"Construimos los activos digitales más rápidos de la región. Combinamos programación web con producción audiovisual premium para que tu negocio sea recordado."</blockquote>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 40, borderTop: `1px solid ${BORDER}`, paddingTop: 80 }}>
         {[{ label: "Misión", body: "Impulsar el crecimiento de PyMEs mediante la construcción de infraestructuras web superiores y contenido visual que captura la atención en segundos." }, { label: "Compromiso", body: "Velocidad de entrega, transparencia total en costos y resultados que puedes medir. Sin excusas, sin letra chica." }].map((item, i) => (
            <div key={i} style={{ background: SURFACE, padding: "40px", border: `1px solid ${BORDER}`, borderRadius: "8px" }}>
              <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: ACCENT, marginBottom: 16 }}>{item.label}</div>
              <p style={{ color: INK2, fontSize: 16, lineHeight: 1.7 }}>{item.body}</p>
            </div>
         ))}
      </div>
    </div>
  );
}

function ContactView({ isMobile }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", service: "content", message: "" });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const handle = (e) => {
    e.preventDefault(); setLoading(true); setError(false);
    const selectedService = CATALOG.find(s => s.id === form.service);
    const serviceName = selectedService ? `${selectedService.name} (${selectedService.price})` : form.service;
    const templateParams = { name: form.name, email: form.email, service_requested: serviceName, message: form.message, phone: form.phone };
    emailjs.send("service_ko9wm6r", "template_p02dor7", templateParams, "1b2HC5hu9s5FV_mHd")
    .then(() => { setLoading(false); setSent(true); setForm({ name: "", email: "", phone: "", service: "content", message: "" }); setTimeout(() => setSent(false), 6000); }, () => { setLoading(false); setError(true); });
  };

  const inputStyle = { width: "100%", background: BG, border: `1px solid ${BORDER}`, padding: "16px", borderRadius: "4px", color: INK, fontSize: 15, outline: "none", boxSizing: "border-box", transition: "border-color 0.2s", fontFamily: "inherit" };
  const labelStyle = { fontSize: 12, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: INK2, display: "block", marginBottom: 8 };

  return (
    <div style={{ padding: "120px 8vw", background: BG }}>
      {/* AQUÍ ESTÁ EL AJUSTE RESPONSIVE DE COLUMNAS DE CONTACTO */}
      <div style={{ maxWidth: 1000, margin: "0 auto", display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1.5fr", gap: 0, border: `1px solid ${BORDER}`, borderRadius: "8px", overflow: "hidden" }}>
        
        <div style={{ background: BG2, padding: "60px 40px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
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
          
          <div style={{ marginTop: 60, padding: 24, background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: "4px" }}>
            <p style={{ fontSize: 13, color: INK2, lineHeight: 1.6, fontStyle: "italic", margin: 0 }}>Respondemos en menos de 24 horas. Sin filtros, directo a la estrategia.</p>
          </div>
        </div>

        <form onSubmit={handle} style={{ padding: "60px 40px", display: "flex", flexDirection: "column", gap: 24, background: SURFACE }}>
          {/* AJUSTE RESPONSIVE DENTRO DEL FORMULARIO */}
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
          <div>
            <label style={labelStyle}>Servicio</label>
            <select style={inputStyle} value={form.service} onChange={e => setForm({ ...form, service: e.target.value })}>
              {CATALOG.map(s => <option key={s.id} value={s.id}>{s.name} — {s.price} MXN</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Mensaje</label>
            <textarea required rows={5} style={inputStyle} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
          </div>
          <button type="submit" disabled={loading} style={{ background: loading ? INK3 : INK, color: "#fff", border: "none", padding: "18px", borderRadius: "4px", fontWeight: 800, cursor: loading ? "wait" : "pointer" }}>
            {loading ? "Enviando..." : "Enviar Solicitud →"}
          </button>
          {sent && <div style={{ color: ACCENT, fontWeight: 700 }}>✓ Mensaje recibido.</div>}
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
      {/* BOTÓN DISPARADOR */}
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

      {/* BOTONES DE REDES SOCIALES */}
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
  
  // Estados para el Responsive
  const isMobile = useIsMobile();
  const [menuOpen, setMenuOpen] = useState(false);
  
  const nav = (p) => { 
    setPage(p); 
    setMenuOpen(false); // Cierra el menú al navegar
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
          <div style={{ width: 32, height: 32, background: RIDERS, borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 900 }}>R</div>
          <span style={{ fontWeight: 900, fontSize: "20px", letterSpacing: "0.01em" }}>IDERS MEDIA</span>
        </div>
        
        {/* NAVEGACIÓN RESPONSIVE */}
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

      {/* MENÚ DESPLEGABLE MÓVIL */}
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
        {page === "inicio" && <HomeView nav={nav} />}
        {page === "catalogo" && <CatalogView nav={nav} />}
        {page === "valor" && <ValorView stats={marketStats} />}
        {page === "casos" && <CasesView casesData={casesList} />}
        {page === "agencia" && <AboutView />}
        {page === "contacto" && <ContactView isMobile={isMobile} />}
      </main>

      <footer style={{ padding: "20px 5vw", borderTop: `1px solid ${BORDER}`, background: BG2 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
             <div style={{ width: 24, height: 24, background: RIDERS, borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 900, fontSize: 12 }}>R</div>
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