import React, { useState, useEffect, useRef } from "react";
import emailjs from '@emailjs/browser';
import { COLORS, CATALOG, CASES, PILLARS, CASES_CSV_URL, SHEET_CSV_URL, CATALOGO_CSV_URL, GRAD } from "./data";
import { useSheetData } from "./hooks/useSheetData";
import "./index.css";

const { BG, BG2, SURFACE, INK, INK2, INK3, ACCENT, AMBER2, ACCENT2, PURPLE, BORDER, RIDERS, SUCCESS, WARNING, INFO, MUTED_RED, MUTED_TEAL, TERRA } = COLORS;

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

// ── HELPER: normaliza texto para comparar nombres (trim + minúsculas + sin acentos)
const normalize = (str) =>
  (str || "")
    .toString()
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

// ── MAPPERS DE GOOGLE SHEETS (usados por useSheetData) ───────────────────
// Ticker del hero y select del formulario: nombre + precio
const mapServiceRows = (rows) => rows
  .filter(row => row["Servicio"] && row["Servicio"].trim() !== "")
  .map((row, index) => ({
    id: `sheet-item-${index}`,
    name: row["Servicio"].trim(),
    price: row["Inversión (Desde)"] ? row["Inversión (Desde)"].toString().trim() : "",
  }));

// Catálogo completo: incluye tipo de pago, descripción y destacado
const mapCatalogRows = (rows) => rows
  .filter(row => row["Servicio"] && row["Servicio"].trim() !== "")
  .map((row, index) => ({
    id: `sheet-item-${index}`,
    name:      row["Servicio"]?.trim() || "",
    tag:       row["Tipo de Pago"]?.trim() || "",
    realPrice: row["Precio real"] ? row["Precio real"].toString().trim() : "",
    price:     row["Inversión (Desde)"] ? row["Inversión (Desde)"].toString().trim() : "",
    desc:      row["Descripción"]?.trim() || "",
    highlight: row["¿hightlight?"]?.trim().toUpperCase() === "TRUE",
  }));

// Estadísticas de mercado (ValorView) — vía PapaParse
const mapStatRows = (rows) => rows
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

// Estadísticas de mercado — parseo manual si PapaParse no cargó
const mapStatCols = (cols) => {
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
};

// Casos de éxito — parseo manual por columnas
const mapCaseCols = (cols) => {
  if (cols.length < 4 || !cols[1]) return null;
  return { cat: cols[0], client: cols[1], result: cols[2], color: cols[3] || COLORS.ACCENT, link: cols[4] || "#" };
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

// ── HOOK: respeta prefers-reduced-motion ─────────────────────────────────
function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = () => setReduced(mq.matches);
    mq.addEventListener?.("change", handler);
    return () => mq.removeEventListener?.("change", handler);
  }, []);
  return reduced;
}

// ── REVEAL: aparece al hacer scroll (fade + translate + blur) ─────────────
// group=true → escalona los hijos directos (clase .reveal-group en index.css)
function Reveal({ children, group = false, as: Tag = "div", style, className = "" }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-visible");
          io.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Tag ref={ref} className={`${group ? "reveal-group" : "reveal"} ${className}`.trim()} style={style}>
      {children}
    </Tag>
  );
}

// ── COUNTER: anima un número al entrar en viewport ───────────────────────
function Counter({ value, duration = 1400, style, className }) {
  const ref = useRef(null);
  const reduced = usePrefersReducedMotion();
  const match = String(value).match(/^(\d[\d.,]*)(.*)$/);
  const suffix = match ? match[2] : "";
  const target = match ? parseFloat(match[1].replace(/,/g, "")) : null;
  const [display, setDisplay] = useState(target !== null ? `0${suffix}` : value);

  useEffect(() => {
    if (target === null) { setDisplay(value); return; }
    const finalText = `${match[1]}${suffix}`;
    if (reduced) { setDisplay(finalText); return; }
    const el = ref.current;
    if (!el) return;
    let raf, fallback, started = false;
    const finish = () => setDisplay(finalText);
    const run = () => {
      setDisplay(`0${suffix}`);
      const t0 = performance.now();
      const tick = (now) => {
        const p = Math.min(1, (now - t0) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        setDisplay(`${Math.round(target * eased)}${suffix}`);
        if (p < 1) raf = requestAnimationFrame(tick);
        else finish();
      };
      raf = requestAnimationFrame(tick);
      // Garantiza el valor final aunque rAF se pause (p. ej. pestaña en segundo plano)
      fallback = setTimeout(finish, duration + 600);
    };
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started) {
        started = true;
        if (document.hidden) finish(); else run();
        io.disconnect();
      }
    }, { threshold: 0.25 });
    io.observe(el);
    return () => { io.disconnect(); if (raf) cancelAnimationFrame(raf); if (fallback) clearTimeout(fallback); };
  }, [value, duration, reduced]); // eslint-disable-line

  return <span ref={ref} className={className} style={style}>{display}</span>;
}

// ── PARALLAX: desplaza un elemento al hacer scroll (vía CSS var --py) ──────
function useParallax(speed = 0.25) {
  const ref = useRef(null);
  const reduced = usePrefersReducedMotion();
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    let raf = null;
    const update = () => {
      raf = null;
      const rect = el.getBoundingClientRect();
      const winH = window.innerHeight || 1;
      const progress = (rect.top + rect.height / 2 - winH / 2) / winH; // ~-1..1 al cruzar el viewport
      el.style.setProperty("--py", `${(-progress * speed * 100).toFixed(1)}px`);
    };
    const onScroll = () => { if (raf == null) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [speed, reduced]);
  return ref;
}

// ── BARRA DE PROGRESO DE SCROLL (top) ────────────────────────────────────
function ScrollProgress() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = null;
    const update = () => {
      raf = null;
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      el.style.width = `${max > 0 ? (h.scrollTop / max) * 100 : 0}%`;
    };
    const onScroll = () => { if (raf == null) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
  return <div ref={ref} className="scroll-progress" />;
}

// ── IN-VIEW: true cuando el elemento entra en viewport (para animar gráficas)
function useInView(threshold = 0.2) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setInView(true); io.disconnect(); }
    }, { threshold });
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, inView];
}

// ── ÍCONOS SVG (trazo consistente, heredan color) ────────────────────────
const svgBase = { fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" };
function IconBolt({ size = 22 })   { return <svg width={size} height={size} viewBox="0 0 24 24" {...svgBase}><path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z" /></svg>; }
function IconTarget({ size = 22 }) { return <svg width={size} height={size} viewBox="0 0 24 24" {...svgBase}><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none" /></svg>; }
function IconShield({ size = 22 }) { return <svg width={size} height={size} viewBox="0 0 24 24" {...svgBase}><path d="M12 3l7 3v5c0 4.6-3 7.8-7 9-4-1.2-7-4.4-7-9V6l7-3z" /><path d="M9 12l2 2 4-4" /></svg>; }
function IconSpark({ size = 24 })  { return <svg width={size} height={size} viewBox="0 0 24 24" {...svgBase}><path d="M12 2l2.3 6.9L21 11l-6.7 2.1L12 20l-2.3-6.9L3 11l6.7-2.1L12 2z" /></svg>; }
function IconMenu({ size = 26 })   { return <svg width={size} height={size} viewBox="0 0 24 24" {...svgBase} aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16" /></svg>; }
function IconClose({ size = 26 })  { return <svg width={size} height={size} viewBox="0 0 24 24" {...svgBase} aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>; }
function IconPlus({ size = 26 })   { return <svg width={size} height={size} viewBox="0 0 24 24" {...svgBase} aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>; }
function IconCheck({ size = 18 })  { return <svg width={size} height={size} viewBox="0 0 24 24" {...svgBase} aria-hidden="true"><path d="M4 12.5l5 5L20 7" /></svg>; }
function IconAlert({ size = 18 })  { return <svg width={size} height={size} viewBox="0 0 24 24" {...svgBase} aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 7.5v5.5" /><path d="M12 16.5h.01" /></svg>; }
function IconInfo({ size = 18 })   { return <svg width={size} height={size} viewBox="0 0 24 24" {...svgBase} aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 11v5" /><path d="M12 7.5h.01" /></svg>; }

// ── COMPONENTES UI ───────────────────────────────────────────────────────
function Chip({ children, outline, accent }) {
  const isAccent = accent || !outline;
  return (
    <span className="font-display" style={{
      display: "inline-block",
      background: isAccent ? ACCENT : "transparent",
      color: isAccent ? INK : INK2,
      border: `1px solid ${ACCENT}`,
      padding: "5px 13px",
      borderRadius: "20px",
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: "0.08em",
      textTransform: "uppercase"
    }}>
      {children}
    </span>
  );
}

// Logo bicolor: `square` = color del cuadro, `mark` = color de la "R" (combinaciones aprobadas).
// Por defecto: cuadro navy + "R" ÁMBAR → logo amarillo; sobre oscuro el cuadro se funde y
// queda la flecha ámbar flotando (como el lockup del EPS).
function LogoIcon({ size = 32, square = RIDERS, mark = BG }) {
  return (
    <svg width={size} height={size} viewBox="0 0 1080 1080" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="1080" height="1080" rx="292.89" ry="292.89" fill={mark} />
      <path fill={square} d="M787.11,0h-494.22C131.13,0,0,131.13,0,292.89v494.22c0,161.76,131.13,292.89,292.89,292.89h494.22c161.76,0,292.89-131.13,292.89-292.89v-494.22C1080,131.13,948.87,0,787.11,0ZM807.56,539.99h-52.57c-40.5,0-73.34-32.84-73.34-73.34v-52.65c0-21.19-17.18-38.38-38.38-38.38h-201.35l365.64,365.64-89.03,89.02-320.18-320.17v194.27c0,34.75-14.08,66.23-36.88,89.02-22.79,22.8-54.27,36.88-89.03,36.88V249.72h405.8c71.42,0,129.32,57.89,129.32,129.31v160.96Z"/>
    </svg>
  );
}

// Sobre fondo claro el texto va en navy (el ámbar no pasa contraste WCAG sobre crema);
// el acento ámbar se conserva como guion gráfico. Sobre fondo oscuro el ámbar sí pasa.
function SectionLabel({ children, dark = false }) {
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

// ── BOTÓN UNIFICADO — jerarquía de color de marca ────────────────────────
// primary       → gradiente ámbar + texto INK + glow   (CONVERTIR / hablar)
// ghost-accent  → borde ámbar, transparente → relleno  (convertir, menor peso)
// secondary     → navy sólido / hover ámbar            (EXPLORAR / navegar)
// secondary-light → para fondos oscuros (borde claro)
// text          → enlace ámbar con flecha              (inline)
function Btn({ variant = "primary", children, onClick, type = "button", full = false, disabled = false, style = {} }) {
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
    padding: "16px 34px", borderRadius: 12, minHeight: 48,
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

function HomeView({ nav, casesList = [] }) {
  const { data: tickerData } = useSheetData(CATALOGO_CSV_URL, { mapRows: mapServiceRows, fallback: CATALOG });

  // ── Parallax refs (se desplazan al hacer scroll) ──
  const heroBlobA = useParallax(0.22);
  const heroBlobB = useParallax(-0.16);
  const filoGlow  = useParallax(0.40);
  const ctaGlow   = useParallax(0.50);

  const clients = casesList.map(c => c.client);
  const shouldAnimate = clients.length >= 3;
  const displayClients = shouldAnimate
    ? [...clients, ...clients, ...clients, ...clients]
    : clients;

  // Estilo base para los tiles del bento
  const tile = {
    background: SURFACE,
    border: `1px solid ${BORDER}`,
    borderRadius: 20,
    padding: "22px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    minHeight: 116,
    boxShadow: "0 18px 50px rgba(13,27,42,0.05)"
  };

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

        @media (max-width: 860px) {
          .hero-bento { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* ── HERO BENTO ─────────────────────────────────────────── */}
      <section className="mesh-warm mesh-warm-animated grain" style={{
        padding: "112px 6vw 150px",
        position: "relative", overflow: "hidden",
        minHeight: "100vh",
        display: "flex", flexDirection: "column", justifyContent: "center",
        borderBottom: `1px solid ${BORDER}`
      }}>
        {/* ── Parallax: blobs decorativos que se desplazan al hacer scroll ── */}
        <div ref={heroBlobA} style={{ position: "absolute", top: "-8%", right: "-6%", width: 540, height: 540, borderRadius: "50%", background: `radial-gradient(circle, ${ACCENT}22 0%, transparent 68%)`, filter: "blur(64px)", transform: "translateY(var(--py,0px))", willChange: "transform", pointerEvents: "none", zIndex: 1 }} />
        <div ref={heroBlobB} style={{ position: "absolute", bottom: "2%", left: "-10%", width: 460, height: 460, borderRadius: "50%", background: `radial-gradient(circle, ${INK2}1f 0%, transparent 66%)`, filter: "blur(72px)", transform: "translateY(var(--py,0px))", willChange: "transform", pointerEvents: "none", zIndex: 1 }} />

        <div style={{ position: "relative", zIndex: 2, maxWidth: 1400, margin: "0 auto", width: "100%" }}>
          <div className="hero-bento" style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1.55fr) minmax(0, 1fr)",
            gap: 18, alignItems: "stretch"
          }}>

            {/* TILE TITULAR */}
            <div style={{
              background: "rgba(255,255,255,0.58)",
              backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
              border: `1px solid ${BORDER}`,
              borderRadius: 28,
              padding: "clamp(28px, 4vw, 54px)",
              display: "flex", flexDirection: "column", justifyContent: "center",
              boxShadow: "0 30px 80px rgba(13,27,42,0.06)"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
                <div className="status-indicator" style={{ width: 10, height: 10, borderRadius: "50%", background: ACCENT }} />
                <span className="font-display" style={{ fontSize: 12, fontWeight: 600, color: INK3, letterSpacing: "0.15em", textTransform: "uppercase" }}>
                  Unidad de Respuesta Rápida · Puebla, MX
                </span>
              </div>

              <h1 className="font-display" style={{
                fontSize: "clamp(46px, 6.5vw, 92px)",
                color: INK, fontWeight: 800, lineHeight: 0.98,
                letterSpacing: "-0.02em", marginBottom: 22
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

              <p style={{ fontSize: "clamp(15px, 1.2vw, 18px)", color: INK2, maxWidth: 540, lineHeight: 1.7, marginBottom: 36 }}>
                En Riders Media no improvisamos. Somos una unidad estratégica especializada
                en <strong style={{ color: INK }}>motion graphics y desarrollo avanzado</strong> con
                React. Aceleramos tu crecimiento con ejecuciones quirúrgicas,
                transparencia absoluta en los costos y entregables que dominan la atención.
              </p>

              <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                <Btn variant="secondary" onClick={() => nav("catalogo")}>Ver Catálogo 2026 →</Btn>
                <Btn variant="primary" onClick={() => nav("contacto")}>Agendar Llamada</Btn>
              </div>
            </div>

            {/* COLUMNA DERECHA — emblema en desktop, tiles bento en móvil */}
            <div style={{ position: "relative", display: "flex", flexDirection: "column" }}>

              {/* ── DESKTOP: emblema de marca (oculto en móvil) ── */}
              <div className="aside-emblem" style={{
                flex: 1, position: "relative", overflow: "hidden",
                borderRadius: 28, padding: "48px 40px",
                background: "linear-gradient(160deg, #0f2336 0%, #183457 100%)",
                border: "1px solid rgba(255,255,255,0.08)",
                flexDirection: "column", alignItems: "center", justifyContent: "center",
                boxShadow: "0 30px 80px rgba(13,27,42,0.18)"
              }}>
                <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 360, height: 360, borderRadius: "50%", background: `radial-gradient(circle, ${ACCENT}33 0%, transparent 65%)`, filter: "blur(34px)", pointerEvents: "none" }} />
                <div className="emblem-ring-a" style={{ position: "absolute", top: "50%", left: "50%", width: 300, height: 300, marginTop: -150, marginLeft: -150, borderRadius: "50%", border: `1px dashed ${ACCENT}55`, pointerEvents: "none" }} />
                <div className="emblem-ring-b" style={{ position: "absolute", top: "50%", left: "50%", width: 224, height: 224, marginTop: -112, marginLeft: -112, borderRadius: "50%", border: "1px dashed rgba(255,255,255,0.14)", pointerEvents: "none" }} />
                <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                  <div className="emblem-float" style={{ filter: `drop-shadow(0 10px 30px ${ACCENT}66)` }}>
                    <LogoIcon size={104} />
                  </div>
                  <div className="font-display" style={{ marginTop: 24, fontSize: 26, fontWeight: 800, color: "#fff", letterSpacing: "0.02em" }}>RIDERS MEDIA</div>
                  <div style={{ width: 48, height: 3, background: GRAD.brandSoft, borderRadius: 2, margin: "18px 0" }} />
                  <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.55)", lineHeight: 1.9 }}>
                    Motion Graphics · Desarrollo Web<br />Estrategia de Contenido
                  </div>
                </div>
              </div>

              {/* ── MÓVIL: tiles bento (ocultos en desktop) ── */}
              <div className="aside-tiles" style={{ gridTemplateColumns: "1fr 1fr", gap: 18, gridAutoRows: "min-content" }}>

                {/* Stat 48h (ámbar) */}
                <div style={{ ...tile, background: GRAD.brandSoft, border: "none", boxShadow: `0 18px 50px ${ACCENT}33` }}>
                  <Counter className="font-num" value="48h" style={{ fontSize: "clamp(40px, 5vw, 56px)", fontWeight: 900, lineHeight: 1, color: INK }} />
                  <div style={{ fontSize: 10, fontWeight: 800, color: INK, opacity: 0.72, textTransform: "uppercase", letterSpacing: "0.12em", marginTop: 6 }}>Respuesta</div>
                </div>

                {/* Stat 100% */}
                <div style={tile}>
                  <Counter className="font-num" value="100%" style={{ fontSize: "clamp(40px, 5vw, 56px)", fontWeight: 900, lineHeight: 1, color: INK }} />
                  <div style={{ fontSize: 10, fontWeight: 800, color: INK3, textTransform: "uppercase", letterSpacing: "0.12em", marginTop: 6 }}>Transparente</div>
                </div>

                {/* Tile estado en vivo (oscuro) */}
                <div style={{
                  gridColumn: "1 / -1",
                  background: "linear-gradient(145deg, #0f2336, #183457)",
                  borderRadius: 18, padding: "18px 22px",
                  display: "flex", alignItems: "center", justifyContent: "space-between"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div className="status-indicator" style={{ width: 9, height: 9, borderRadius: "50%", background: ACCENT }} />
                    <span style={{ fontSize: 11, fontWeight: 800, color: "#fff", letterSpacing: "0.14em", textTransform: "uppercase" }}>Operando en vivo</span>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.6)" }}>
                    {new Date().toLocaleDateString('es-MX', { day: '2-digit', month: 'short' })}
                  </span>
                </div>

                {/* Tile servicios destacados */}
                <div style={{ gridColumn: "1 / -1", ...tile, minHeight: 0, padding: "22px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                    <LogoIcon size={16} />
                    <span style={{ fontSize: 10, fontWeight: 900, color: INK3, textTransform: "uppercase", letterSpacing: "0.16em" }}>Servicios destacados</span>
                  </div>
                  {tickerData.slice(0, 3).map((s, i) => (
                    <div key={i} style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "9px 0", borderBottom: i < 2 ? `1px solid ${BORDER}` : "none"
                    }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: INK }}>{s.name}</span>
                      {s.price && (
                        <span className="font-num" style={{ fontSize: 16, fontWeight: 800, color: INK }}>
                          {s.price.toString().includes('$') ? s.price : `$${s.price}`} MXN
                        </span>
                      )}
                    </div>
                  ))}
                  <div style={{ marginTop: 16 }}>
                    <Btn variant="secondary" full onClick={() => nav("catalogo")} style={{ padding: "13px", fontSize: 12, minHeight: 44 }}>
                      Ver Catálogo Completo →
                    </Btn>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* TICKER INFERIOR */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          borderTop: `1px solid ${BORDER}`, padding: "14px 0",
          background: "rgba(250,247,242,0.85)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
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

      {/* ── PROBLEMA VS SOLUCIÓN ──────────────────────────────── */}
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

            <Reveal group style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {[
                { icon: <IconBolt />,   title: "Velocidad Táctica",     desc: "Sistemas estructurados para entregar proyectos en días, no en meses." },
                { icon: <IconTarget />, title: "Foco en Conversión",    desc: "Un diseño bonito que no vende es arte. Nosotros hacemos negocios." },
                { icon: <IconShield />, title: "Transparencia Radical", desc: "Catálogo público. Sabes exactamente qué incluye y cuánto cuesta." }
              ].map((item, i) => (
                <div key={i}
                  style={{
                    display: "flex", gap: 20, background: SURFACE,
                    padding: "28px 32px", borderRadius: 16, border: `1px solid ${BORDER}`,
                    transition: "border-color 0.2s, box-shadow 0.2s, transform 0.2s"
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = ACCENT; e.currentTarget.style.boxShadow = `0 12px 32px ${ACCENT}18`; e.currentTarget.style.transform = "translateY(-3px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateY(0)"; }}
                >
                  <div style={{
                    width: 48, height: 48, flexShrink: 0, background: MUTED_RED,
                    border: `1px solid ${ACCENT}30`, borderRadius: 12,
                    display: "flex", alignItems: "center", justifyContent: "center", color: ACCENT
                  }}>{item.icon}</div>
                  <div>
                    <h4 style={{ fontSize: 17, fontWeight: 800, color: INK, marginBottom: 6 }}>{item.title}</h4>
                    <p style={{ fontSize: 14, color: INK2, lineHeight: 1.6 }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── MÉTRICAS — banda ámbar ───────────────────────────── */}
      <section style={{ padding: "38px 6vw", background: GRAD.brand, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 80% 50%, rgba(255,255,255,0.10) 0%, transparent 60%)", pointerEvents: "none" }} />
        <Reveal group style={{ position: "relative", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 32, maxWidth: 1400, margin: "0 auto" }}>
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

      {/* ── FILOSOFÍA — centro de mando (oscuro) ─────────────── */}
      <section className="mesh-dark mesh-dark-animated grain" style={{ padding: "100px 6vw", position: "relative", overflow: "hidden" }}>
        <div ref={filoGlow} style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%, -50%) translateY(var(--py,0px))", willChange: "transform",
          width: 600, height: 400, borderRadius: "50%",
          background: `radial-gradient(ellipse, ${ACCENT}14 0%, transparent 65%)`,
          filter: "blur(50px)", pointerEvents: "none"
        }} />
        <PatternBg show={PATRON.filosofia} opacity={0.025} filter={null} maskStop={null} />
        <div style={{ position: "relative", zIndex: 2, maxWidth: 1400, margin: "0 auto" }}>
          <Reveal><SectionLabel dark>Filosofía</SectionLabel></Reveal>
          <Reveal group style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24, marginTop: 40 }}>
            {PILLARS.map(p => (
              <div key={p.num} className="glass-card-dark"
                style={{ padding: 40, borderRadius: 20, transition: "border-color 0.3s, transform 0.3s, box-shadow 0.3s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = `${ACCENT}80`; e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = `0 24px 60px rgba(0,0,0,0.35), 0 0 0 1px ${ACCENT}30`; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.10)"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
              >
                <div className="font-num" style={{ fontSize: 79, fontWeight: 900, color: ACCENT, opacity: 0.88, marginBottom: 16, lineHeight: 1 }}>{p.num}</div>
                <h3 className="font-display" style={{ fontSize: 30, color: "#ffffff", marginBottom: 12, fontWeight: 700 }}>{p.title}</h3>
                <p style={{ color: "rgba(255,255,255,0.62)", lineHeight: 1.7, fontSize: 15 }}>{p.body}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ── CTA DE CIERRE (degradado en movimiento) ───────────── */}
      <section className="cta-flow" style={{
        padding: "130px 6vw",
        textAlign: "center", position: "relative", overflow: "hidden"
      }}>
        <div ref={ctaGlow} style={{
          position: "absolute", top: "-30%", left: "50%",
          transform: "translateX(-50%) translateY(var(--py,0px))", willChange: "transform",
          width: 800, height: 400, borderRadius: "50%",
          background: `radial-gradient(ellipse, ${ACCENT}10 0%, transparent 65%)`,
          filter: "blur(60px)", pointerEvents: "none"
        }} />
        <Reveal style={{ maxWidth: 720, margin: "0 auto" }}>
          <div style={{
            width: 64, height: 64, background: SURFACE, border: `2px solid ${ACCENT}`,
            borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 32px", color: ACCENT
          }}><IconSpark size={26} /></div>
          <h2 className="font-display" style={{
            fontSize: "clamp(40px, 6vw, 64px)", color: INK, fontWeight: 800,
            lineHeight: 1.02, marginBottom: 24, letterSpacing: "-0.02em"
          }}>
            ¿Listo para acelerar tu crecimiento?
          </h2>
          <p style={{ color: INK2, fontSize: 18, lineHeight: 1.6, marginBottom: 40, maxWidth: 600, marginLeft: "auto", marginRight: "auto" }}>
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

const CATALOG_ERROR_MESSAGES = {
  "fallback-papa":    "⚠️ Error: El script de PapaParse no se ha cargado en el index.html.",
  "fallback-private": "⚠️ El Google Sheet está privado. Cambia a 'Cualquier persona con el enlace'.",
  "fallback-empty":   "⚠️ El Excel conectó, pero las columnas no se llaman exactamente 'Servicio', 'Tipo de Pago', etc.",
  "fallback-network": "⚠️ Error de red al intentar descargar el Excel.",
};

function CatalogView({ nav }) {
  const { data: catalog, status } = useSheetData(CATALOGO_CSV_URL, { mapRows: mapCatalogRows, fallback: [] });
  const isLoading = status === "loading";
  const errorMsg = CATALOG_ERROR_MESSAGES[status] || "";

  const monthly  = catalog.filter(s => s.tag && s.tag.toLowerCase().includes("mensual"));
  const oneTime  = catalog.filter(s => s.tag && (s.tag.toLowerCase().includes("único") || s.tag.toLowerCase().includes("unico")));
  const perPiece = catalog.filter(s => s.tag && s.tag.toLowerCase().includes("pieza"));

  // ── tarjetas de catálogo ────────────────────────────────────
  function Section({ title, items }) {
    if (items.length === 0) return null;
    return (
      <div style={{ marginBottom: 72 }}>
        <Reveal><SectionLabel>{title}</SectionLabel></Reveal>
        <Reveal group style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 }}>
          {items.map(s => (
            <div key={s.id}
              style={{
                background: s.highlight ? `linear-gradient(145deg, ${BG2} 0%, #ece4d1 100%)` : SURFACE,
                border: `1px solid ${s.highlight ? ACCENT + "60" : BORDER}`,
                padding: "40px", borderRadius: 16,
                position: "relative", display: "flex", flexDirection: "column",
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
              {s.highlight && (
                <div style={{
                  position: "absolute", top: 16, right: 16,
                  background: ACCENT, color: INK, fontSize: 10, fontWeight: 900,
                  letterSpacing: "0.1em", textTransform: "uppercase",
                  padding: "4px 12px", borderRadius: "20px"
                }}>Popular</div>
              )}

              <div>
                <Chip outline={!s.highlight}>{s.tag}</Chip>

                <div style={{ marginTop: 24, marginBottom: 8 }}>
                  {s.realPrice && (
                    <div className="font-num" style={{ fontSize: 22, color: INK3, textDecoration: "line-through", marginBottom: -4, fontWeight: 600 }}>
                      {s.realPrice}
                    </div>
                  )}
                  <div className="font-num" style={{ fontSize: 52, fontWeight: 900, color: INK, letterSpacing: "-0.02em", lineHeight: 1.05 }}>
                    {s.price}{" "}
                    <span style={{ fontSize: 16, fontWeight: 600, color: INK3 }}>MXN</span>
                  </div>
                </div>

                <h3 style={{ fontSize: 22, color: INK, margin: "0 0 12px", fontWeight: 800 }}>{s.name}</h3>
              </div>

              <p style={{ color: INK2, fontSize: 14, minHeight: 60, marginBottom: 28, lineHeight: 1.65, flexGrow: 1 }}>{s.desc}</p>

              {/* CTA — convertir: highlight=primary, resto=ghost-accent */}
              <Btn variant={s.highlight ? "primary" : "ghost-accent"} full onClick={() => nav("contacto", s.name)}>
                Cotizar este servicio →
              </Btn>
            </div>
          ))}
        </Reveal>
      </div>
    );
  }

  // ── pantalla de carga ────────────────────────────────────────
  if (isLoading) {
    return (
      <div style={{
        padding: "120px 6vw", background: BG, minHeight: "50vh",
        display: "flex", justifyContent: "center", alignItems: "center",
        position: "relative", overflow: "hidden"
      }}>
        <style>{`
          @keyframes giantWave { 0% { opacity: 0.01; transform: scale(1); } 50% { opacity: 0.05; transform: scale(1.03); } 100% { opacity: 0.01; transform: scale(1); } }
          .giant-wave-pattern { animation: giantWave 4s ease-in-out infinite; }
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
        <PatternBg show={PATRON.catalogo_carga} animated filter="invert(1)" maskStop={null} />
        <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
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
    <div style={{ padding: "120px 6vw", background: BG, position: "relative", overflow: "hidden" }}>
      <PatternBg show={PATRON.catalogo} maskStop="60%" />
      <div style={{ position: "relative", zIndex: 1, maxWidth: 1400, margin: "0 auto" }}>

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
            <div style={{ marginTop: 28, padding: "20px 24px", background: MUTED_RED, color: INK, border: `2px solid ${ACCENT}`, borderRadius: 8, fontWeight: 700, fontSize: 14 }}>
              {errorMsg}
            </div>
          )}
        </Reveal>

        <Section title="Por pieza"          items={perPiece} />
        <Section title="Pago único"         items={oneTime}  />
        <Section title="Paquetes mensuales" items={monthly}  />

      </div>
    </div>
  );
}

function ValorView({ stats }) {
  // Colores de series con buen contraste sobre fondo oscuro
  const C_FREE   = "#9AA6B8";
  const C_AGENCY = "#4F7BC4";
  const C_RIDERS = ACCENT;
  const D_BORDER = "rgba(255,255,255,0.12)";
  const D_TRACK  = "rgba(255,255,255,0.10)";
  const D_TXT    = "#ffffff";
  const D_TXT2   = "rgba(255,255,255,0.70)";
  const D_TXT3   = "rgba(255,255,255,0.50)";

  // ── KPI card con mini barras ──────────────────────────────────
  function KPICard({ stat, highlight }) {
    const maxVal  = Math.max(stat.freelance, stat.agencias, stat.riders);
    const safeMax = maxVal === 0 ? 1 : maxVal;
    const entries = [
      { name: "Free",    val: stat.freelance, color: C_FREE   },
      { name: "Agencia", val: stat.agencias,  color: C_AGENCY },
      { name: "Riders",  val: stat.riders,    color: C_RIDERS },
    ];
    const [ref, inView] = useInView();

    return (
      <div ref={ref} className="glass-card-dark"
        style={{
          border: `1px solid ${highlight ? ACCENT + "70" : D_BORDER}`,
          borderRadius: 14, padding: "22px",
          display: "flex", flexDirection: "column", gap: 14,
          boxShadow: highlight ? `0 8px 30px ${ACCENT}26` : "none",
          transition: "border-color 0.2s, box-shadow 0.2s"
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = ACCENT; e.currentTarget.style.boxShadow = `0 10px 34px ${ACCENT}26`; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = highlight ? ACCENT + "70" : D_BORDER; e.currentTarget.style.boxShadow = highlight ? `0 8px 30px ${ACCENT}26` : "none"; }}
      >
        <div style={{ fontSize: 9, fontWeight: 900, color: D_TXT3, textTransform: "uppercase", letterSpacing: "0.15em" }}>{stat.label}</div>

        <div className="font-num" style={{ fontSize: 38, fontWeight: 900, color: ACCENT, lineHeight: 1 }}>
          {stat.riders}
          <span style={{ fontSize: 14, fontWeight: 600, color: D_TXT3, marginLeft: 3 }}>{stat.unidad}</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
          {entries.map((entry, i) => (
            <div key={entry.name} style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <span style={{ fontSize: 8, fontWeight: 800, color: entry.color === ACCENT ? ACCENT : D_TXT3, textTransform: "uppercase", letterSpacing: "0.04em", width: 40, flexShrink: 0 }}>{entry.name}</span>
              <div style={{ flex: 1, height: 5, background: D_TRACK, borderRadius: 3, overflow: "hidden" }}>
                <div style={{ height: "100%", width: inView ? `${(entry.val / safeMax) * 100}%` : "0%", background: entry.color, borderRadius: 3, transition: "width 1.1s cubic-bezier(0.4,0,0.2,1)", transitionDelay: `${i * 0.12}s`, boxShadow: entry.color === ACCENT ? `0 0 6px ${ACCENT}60` : "none" }} />
              </div>
              <span style={{ fontSize: 10, fontWeight: 800, color: entry.color === ACCENT ? ACCENT : D_TXT3, width: 30, textAlign: "right", flexShrink: 0 }}>{entry.val}{stat.unidad}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── Ring gauge: anillos concéntricos ─────────────────────────
  function RingGaugeCard({ stat }) {
    const rings = [
      { r: 50, val: stat.freelance, color: C_FREE,   label: "Freelance" },
      { r: 37, val: stat.agencias,  color: C_AGENCY, label: "Agencias"  },
      { r: 24, val: stat.riders,    color: C_RIDERS, label: "Riders"    },
    ];
    const [ref, inView] = useInView();

    return (
      <div ref={ref} className="glass-card-dark"
        style={{ border: `1px solid ${D_BORDER}`, borderRadius: 14, padding: "36px 32px", display: "flex", flexDirection: "column", alignItems: "center", transition: "box-shadow 0.25s, transform 0.25s" }}
        onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 14px 44px rgba(0,0,0,0.4)`; e.currentTarget.style.transform = "translateY(-3px)"; }}
        onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateY(0)"; }}
      >
        <h3 style={{ fontSize: 11, fontWeight: 900, color: D_TXT, textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 32, textAlign: "center" }}>{stat.label}</h3>

        <svg width="180" height="180" viewBox="0 0 120 120">
          {rings.map((ring, i) => {
            const circ = 2 * Math.PI * ring.r;
            const fill = inView ? Math.min(ring.val, 100) / 100 * circ : 0;
            return (
              <g key={ring.r}>
                <circle cx="60" cy="60" r={ring.r} fill="none" stroke={D_TRACK} strokeWidth="7" />
                <circle cx="60" cy="60" r={ring.r} fill="none" stroke={ring.color} strokeWidth="7"
                  strokeDasharray={`${fill} ${circ}`} strokeLinecap="round" transform="rotate(-90 60 60)"
                  style={{ filter: ring.color === ACCENT ? `drop-shadow(0 0 4px ${ACCENT}90)` : "none", transition: "stroke-dasharray 1.3s cubic-bezier(0.4,0,0.2,1)", transitionDelay: `${i * 0.15}s` }}
                />
              </g>
            );
          })}
          <text x="60" y="57" textAnchor="middle" fontSize="13" fontWeight="700" fill={ACCENT} fontFamily="'Oswald', sans-serif">{stat.riders}{stat.unidad}</text>
          <text x="60" y="67" textAnchor="middle" fontSize="5.5" fontWeight="600" fill={D_TXT3} fontFamily="'Oswald', sans-serif">RIDERS</text>
        </svg>

        <div style={{ display: "flex", gap: 28, marginTop: 28 }}>
          {rings.map(ring => (
            <div key={ring.label} style={{ textAlign: "center" }}>
              <div style={{ width: 10, height: 10, borderRadius: 3, background: ring.color, margin: "0 auto 8px", boxShadow: ring.color === ACCENT ? `0 0 6px ${ACCENT}80` : "none" }} />
              <div className="font-num" style={{ fontSize: 16, fontWeight: 900, color: ring.color === ACCENT ? ACCENT : D_TXT }}>{ring.val}{stat.unidad}</div>
              <div style={{ fontSize: 9, fontWeight: 700, color: D_TXT3, textTransform: "uppercase", letterSpacing: "0.04em", marginTop: 2 }}>{ring.label}</div>
            </div>
          ))}
        </div>

        <p style={{ fontSize: 13, color: D_TXT2, marginTop: 24, textAlign: "center", lineHeight: 1.6, paddingTop: 20, borderTop: `1px solid ${D_BORDER}`, width: "100%" }}>{stat.description}</p>
      </div>
    );
  }

  // ── Race bars: barras horizontales ────────────────────────────
  function RaceCard({ stat }) {
    const maxVal  = Math.max(stat.freelance, stat.agencias, stat.riders);
    const safeMax = maxVal === 0 ? 1 : maxVal;
    const bars = [
      { name: "Freelance", val: stat.freelance, color: C_FREE,   textColor: D_TXT3 },
      { name: "Agencias",  val: stat.agencias,  color: C_AGENCY, textColor: D_TXT2 },
      { name: "Riders",    val: stat.riders,    color: C_RIDERS, textColor: ACCENT },
    ];
    const [ref, inView] = useInView();

    return (
      <div ref={ref} className="glass-card-dark"
        style={{ border: `1px solid ${D_BORDER}`, borderRadius: 14, padding: "32px", display: "flex", flexDirection: "column", justifyContent: "space-between", transition: "box-shadow 0.25s, transform 0.25s" }}
        onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 14px 44px rgba(0,0,0,0.4)`; e.currentTarget.style.transform = "translateY(-3px)"; }}
        onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateY(0)"; }}
      >
        <div>
          <h3 style={{ fontSize: 11, fontWeight: 900, color: D_TXT, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 28 }}>{stat.label}</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {bars.map((bar, i) => (
              <div key={bar.name}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, alignItems: "baseline" }}>
                  <span style={{ fontSize: 10, fontWeight: 800, color: bar.textColor, textTransform: "uppercase", letterSpacing: "0.06em" }}>{bar.name}</span>
                  <span className="font-num" style={{ fontSize: 14, fontWeight: 900, color: bar.textColor }}>{bar.val}<span style={{ fontWeight: 600, fontSize: 10, marginLeft: 2 }}>{stat.unidad}</span></span>
                </div>
                <div style={{ height: 8, background: D_TRACK, borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: inView ? `${(bar.val / safeMax) * 100}%` : "0%", background: bar.color, borderRadius: 4, transition: "width 1.2s cubic-bezier(0.4,0,0.2,1)", transitionDelay: `${i * 0.12}s`, boxShadow: bar.color === ACCENT ? `0 0 10px ${ACCENT}60` : "none" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <p style={{ fontSize: 13, color: D_TXT2, marginTop: 24, lineHeight: 1.6, paddingTop: 20, borderTop: `1px solid ${D_BORDER}` }}>{stat.description}</p>
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
    const fmt = (n) => { if (isMoney) return `$${(n / 1000).toFixed(0)}k`; return `${n}${stat.unidad ? " " + stat.unidad : ""}`; };
    const bars = [
      { name: "Freelance", h: fH, val: stat.freelance, color: C_FREE,   textColor: D_TXT3 },
      { name: "Agencias",  h: aH, val: stat.agencias,  color: C_AGENCY, textColor: D_TXT2 },
      { name: "Riders",    h: rH, val: stat.riders,    color: C_RIDERS, textColor: ACCENT },
    ];
    const [ref, inView] = useInView();

    return (
      <div ref={ref} className="glass-card-dark"
        style={{ border: `1px solid ${D_BORDER}`, borderRadius: 14, padding: "32px", display: "flex", flexDirection: "column", justifyContent: "space-between", transition: "box-shadow 0.25s, transform 0.25s" }}
        onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 14px 44px rgba(0,0,0,0.4)`; e.currentTarget.style.transform = "translateY(-3px)"; }}
        onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateY(0)"; }}
      >
        <div>
          <h3 style={{ fontSize: 11, fontWeight: 900, color: D_TXT, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 28, textAlign: "center" }}>{stat.label}</h3>
          <div style={{ position: "relative" }}>
            {[25, 50, 75].map(pct => (
              <div key={pct} style={{ position: "absolute", left: 0, right: 0, bottom: `${pct * 1.6}px`, borderTop: `1px dashed ${D_BORDER}`, zIndex: 0, pointerEvents: "none" }} />
            ))}
            <div style={{ display: "flex", alignItems: "flex-end", height: "160px", gap: "12px", borderBottom: `2px solid rgba(255,255,255,0.2)`, position: "relative", zIndex: 1 }}>
              {bars.map((bar, i) => (
                <div key={bar.name} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", height: "100%" }}>
                  <div style={{ flex: 1, width: "100%", display: "flex", alignItems: "flex-end" }}>
                    <div style={{ height: inView ? `${bar.h}%` : "0%", width: "100%", background: bar.color, borderRadius: "4px 4px 0 0", boxShadow: bar.color === ACCENT ? `0 -6px 18px ${ACCENT}40` : "none", transition: "height 1.1s cubic-bezier(0.4,0,0.2,1)", transitionDelay: `${i * 0.12}s` }} />
                  </div>
                  <span className="font-num" style={{ fontSize: 12, fontWeight: 900, marginTop: 9, color: bar.textColor }}>{fmt(bar.val)}</span>
                  <span style={{ fontSize: 8, fontWeight: 700, marginTop: 3, color: bar.textColor, textTransform: "uppercase", letterSpacing: "0.04em" }}>{bar.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <p style={{ fontSize: 13, color: D_TXT2, marginTop: 20, lineHeight: 1.6, textAlign: "center", paddingTop: 16, borderTop: `1px solid ${D_BORDER}` }}>{stat.description}</p>
      </div>
    );
  }

  // ── Estado vacío / cargando ───────────────────────────────────
  if (!stats || stats.length === 0) {
    return (
      <div className="mesh-dark" style={{ padding: "120px 6vw", minHeight: "100vh" }}>
        <SectionLabel dark>Análisis de Mercado</SectionLabel>
        <p style={{ fontWeight: 700, color: "rgba(255,255,255,0.7)", marginTop: 32 }}>Cargando análisis de mercado...</p>
      </div>
    );
  }

  const ringStats = stats.filter(s => s.tipo === "anillo");
  const raceStats = stats.filter(s => s.tipo === "carrera");
  const barStats  = stats.filter(s => !s.tipo || s.tipo === "barra");

  const groupTitle = (txt) => (
    <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
      <span style={{ fontSize: 10, fontWeight: 900, color: D_TXT3, textTransform: "uppercase", letterSpacing: "0.15em", whiteSpace: "nowrap" }}>{txt}</span>
      <span style={{ flex: 1, height: 1, background: D_BORDER }} />
    </div>
  );

  return (
    <div className="mesh-dark mesh-dark-animated grain" style={{ padding: "120px 6vw", minHeight: "100vh", position: "relative", overflow: "hidden" }}>
      <PatternBg show={PATRON.valor} opacity={0.03} filter={null} maskStop={null} />
      <div style={{ position: "relative", zIndex: 2, maxWidth: 1400, margin: "0 auto" }}>

        {/* ── ENCABEZADO + LEYENDA ── */}
        <Reveal><SectionLabel dark>Análisis de Mercado</SectionLabel></Reveal>
        <Reveal style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 24, marginBottom: 48 }}>
          <h1 className="font-display" style={{ fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 800, margin: 0, color: D_TXT, lineHeight: 1.05, letterSpacing: "-0.02em" }}>
            ¿Por qué Riders es la <span style={{ color: ACCENT }}>opción lógica?</span>
          </h1>

          <div className="glass-card-dark" style={{ display: "flex", gap: 18, padding: "12px 20px", borderRadius: 8, flexShrink: 0 }}>
            {[{ color: C_FREE, label: "Freelance" }, { color: C_AGENCY, label: "Agencias" }, { color: C_RIDERS, label: "Riders" }].map(item => (
              <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <div style={{ width: 10, height: 10, borderRadius: 3, background: item.color, boxShadow: item.color === ACCENT ? `0 0 7px ${ACCENT}70` : "none" }} />
                <span style={{ fontSize: 10, fontWeight: 800, color: item.color === ACCENT ? ACCENT : D_TXT2, textTransform: "uppercase", letterSpacing: "0.08em" }}>{item.label}</span>
              </div>
            ))}
          </div>
        </Reveal>

        {/* ── KPI STRIP ── */}
        <Reveal group style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 16, marginBottom: 52 }}>
          <div style={{ background: "linear-gradient(145deg, rgba(245,163,19,0.18), rgba(24,52,87,0.45))", border: `1px solid ${ACCENT}45`, borderRadius: 14, padding: "26px 22px", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: -40, right: -40, width: 130, height: 130, borderRadius: "50%", background: `${ACCENT}22`, pointerEvents: "none" }} />
            <div style={{ fontSize: 9, fontWeight: 900, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: 14 }}>Riders Media</div>
            <div className="font-num" style={{ fontSize: 40, fontWeight: 900, color: ACCENT, lineHeight: 1 }}>La mejor<br />opción.</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", marginTop: 14, lineHeight: 1.5 }}>Datos verificados.<br />Sin letra chica.</div>
          </div>
          {stats.slice(0, 4).map((stat, i) => <KPICard key={i} stat={stat} highlight={i === 0} />)}
        </Reveal>

        {/* ── ANILLOS ── */}
        {ringStats.length > 0 && (
          <div style={{ marginBottom: 44 }}>
            <Reveal>{groupTitle("Métricas de satisfacción")}</Reveal>
            <Reveal group style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
              {ringStats.map((stat, i) => <RingGaugeCard key={i} stat={stat} />)}
            </Reveal>
          </div>
        )}

        {/* ── BARRAS VERTICALES ── */}
        {barStats.length > 0 && (
          <div style={{ marginBottom: 44 }}>
            <Reveal>{groupTitle("Comparativa de valores")}</Reveal>
            <Reveal group style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 24 }}>
              {barStats.map((stat, i) => <BarCard key={i} stat={stat} />)}
            </Reveal>
          </div>
        )}

        {/* ── CARRERA ── */}
        {raceStats.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <Reveal>{groupTitle("Índices de calidad")}</Reveal>
            <Reveal group style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
              {raceStats.map((stat, i) => <RaceCard key={i} stat={stat} />)}
            </Reveal>
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
    <div style={{ padding: "120px 6vw", background: BG, position: "relative", overflow: "hidden", minHeight: "100vh" }}>
      <PatternBg show={PATRON.casos} opacity={0.02} maskStop="80%" />
      <div style={{ position: "relative", zIndex: 1, maxWidth: "1600px", margin: "0 auto" }}>

        <Reveal style={{ marginBottom: 80, display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 32 }}>
          <div>
            <SectionLabel>Evidencia Táctica</SectionLabel>
            <h1 className="font-display" style={{ fontSize: "clamp(48px, 6vw, 72px)", fontWeight: 800, textTransform: "uppercase", color: INK, lineHeight: 0.95, margin: 0, letterSpacing: "-0.02em" }}>
              Impacto <br /><span style={{ color: ACCENT }}>Real.</span>
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
                style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", padding: "40px 32px", borderBottom: `1px solid ${BORDER}`, position: "relative", cursor: "pointer", textDecoration: "none", transition: "all 0.3s ease", borderRadius: 8, marginTop: 8 }}>
                <div style={{ position: "absolute", inset: 0, background: SURFACE, zIndex: 0, opacity: hovered === i ? 1 : 0, transition: "opacity 0.2s ease", borderRadius: 8, boxShadow: hovered === i ? `0 10px 48px ${c.color}40, 0 0 0 1.5px ${c.color}60` : "none" }} />
                <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", gap: 12, flex: "1 1 200px" }}>
                  <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: hovered === i ? c.color : INK3, transition: "color 0.3s ease" }}>{c.cat}</div>
                  <div style={{ fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 800, color: INK, letterSpacing: "-0.01em", lineHeight: 1.1 }}>{c.client}</div>
                </div>
                <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: 32, flex: "1 1 auto", justifyContent: "flex-end" }}>
                  <div className="font-num" style={{ fontSize: "clamp(40px, 6vw, 64px)", fontWeight: 900, color: hovered === i ? c.color : INK2, lineHeight: 1, letterSpacing: "-0.02em", transition: "color 0.3s ease, transform 0.3s ease, text-shadow 0.3s ease", transform: hovered === i ? "scale(1.05)" : "scale(1)", transformOrigin: "right center", textShadow: hovered === i ? `0 0 32px ${c.color}60` : "none" }}>{c.result}</div>
                  <div style={{ fontSize: 28, color: hovered === i ? c.color : BORDER, fontWeight: 300, transform: hovered === i ? "translateX(8px)" : "translateX(0)", transition: "all 0.3s ease" }}>→</div>
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
    <div style={{ padding: "120px 6vw", background: BG, position: "relative", overflow: "hidden", minHeight: "100vh" }}>
      <PatternBg show={PATRON.agencia} opacity={0.02} maskStop="80%" />
      <div style={{ position: "relative", zIndex: 1, maxWidth: "1600px", margin: "0 auto" }}>

        <Reveal style={{ maxWidth: 850, marginBottom: 100 }}>
          <SectionLabel>Sobre la Agencia</SectionLabel>
          <h1 className="font-display" style={{ fontSize: "clamp(48px, 6vw, 80px)", color: INK, fontWeight: 800, marginBottom: 40, textTransform: "uppercase", lineHeight: 0.95, letterSpacing: "-0.02em" }}>
            Unidad de<br /><span style={{ color: ACCENT }}>Respuesta Rápida.</span>
          </h1>
          <div style={{ color: INK2, fontSize: "clamp(16px, 1.5vw, 20px)", lineHeight: 1.8 }}>
            <p style={{ marginBottom: 32 }}>
              Riders Media fusiona la <strong style={{ color: INK }}>precisión técnica con la creatividad disruptiva.</strong> No somos una agencia de marketing convencional, no hacemos planes a 6 meses para cambiar el color de un botón.
            </p>
            <p style={{ marginBottom: 40 }}>
              Resolvemos el problema de la lentitud digital y la falta de transparencia en la industria. Somos eficaces en la entrega, rigurosos en el código (React) y 100% transparentes en el proceso.
            </p>
            <blockquote style={{ borderLeft: `4px solid ${ACCENT}`, paddingLeft: 32, fontStyle: "italic", color: INK, background: SURFACE, padding: "32px", borderRadius: "0 12px 12px 0", fontSize: "clamp(18px, 1.8vw, 24px)", fontWeight: 600, boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}>
              "Construimos los activos digitales más rápidos de la región. Combinamos infraestructura web de alto nivel con producción visual premium para que tu negocio domine la atención."
            </blockquote>
          </div>
        </Reveal>

        <Reveal group style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 40, borderTop: `1px solid ${BORDER}`, paddingTop: 80 }}>
          {[
            { label: "Nuestra Misión", body: "Impulsar el crecimiento de PyMEs mediante la construcción de infraestructuras web superiores y contenido visual que captura la atención en los primeros segundos de interacción." },
            { label: "Nuestro Compromiso", body: "Velocidad táctica de entrega, transparencia total en costos desde el día cero y resultados medibles orientados a conversión. Sin excusas, sin letra chica." }
          ].map((item, i) => (
            <div key={i} style={{ background: SURFACE, padding: "48px", border: `1px solid ${BORDER}`, borderRadius: 12, transition: "transform 0.3s ease, border-color 0.3s ease" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-5px)"; e.currentTarget.style.borderColor = ACCENT; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = BORDER; }}
            >
              <div style={{ fontSize: 12, fontWeight: 900, letterSpacing: "0.2em", textTransform: "uppercase", color: ACCENT, marginBottom: 24 }}>{item.label}</div>
              <p style={{ color: INK2, fontSize: 17, lineHeight: 1.7 }}>{item.body}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </div>
  );
}

function ContactView({ isMobile, initialService }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", service: "", message: "" });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const { data: servicesList } = useSheetData(CATALOGO_CSV_URL, { mapRows: mapServiceRows, fallback: CATALOG });

  useEffect(() => {
    // Resuelve el id a preseleccionar emparejando initialService (un NOMBRE) por nombre normalizado.
    if (!servicesList || servicesList.length === 0) return;
    setForm(prev => {
      let id = servicesList[0].id;
      if (initialService) {
        const match = servicesList.find(s => normalize(s.name) === normalize(initialService));
        if (match) id = match.id;
      }
      return { ...prev, service: id };
    });
  }, [servicesList, initialService]);

  const handle = (e) => {
    e.preventDefault();
    // Honeypot antispam: los bots rellenan el campo oculto; un humano nunca lo ve
    if (honeypot) return;
    setLoading(true);
    setError(false);
    const selectedService = servicesList.find(s => s.id === form.service);
    const serviceName = selectedService
      ? `${selectedService.name} (${selectedService.price.includes('$') ? selectedService.price : '$' + selectedService.price} MXN)`
      : form.service;
    const templateParams = { name: form.name, email: form.email, service_requested: serviceName, message: form.message, phone: form.phone };
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

  // Inputs sobre fondo oscuro
  const inputStyle = {
    width: "100%", background: "rgba(255,255,255,0.06)", border: "1.5px solid rgba(255,255,255,0.15)",
    padding: "14px 18px", borderRadius: 10, color: "#fff", fontSize: 15,
    outline: "none", boxSizing: "border-box", transition: "border-color 0.2s, box-shadow 0.2s", fontFamily: "inherit"
  };
  const onFocusInput = e => { e.currentTarget.style.borderColor = ACCENT; e.currentTarget.style.boxShadow = `0 0 0 3px ${ACCENT}30`; };
  const onBlurInput  = e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; e.currentTarget.style.boxShadow = "none"; };
  const labelStyle = { fontSize: 11, fontWeight: 900, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.75)", display: "block", marginBottom: 9 };

  return (
    <div className="mesh-dark mesh-dark-animated grain" style={{ padding: "120px 6vw", position: "relative", overflow: "hidden" }}>
      <PatternBg show={PATRON.contacto} opacity={0.025} filter={null} maskStop={null} />
      <style>{`
        @keyframes pulseContactDot { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:0.5; transform:scale(0.8); } }
        .contact-dot { animation: pulseContactDot 2s ease-in-out infinite; }
        .contact-form input::placeholder, .contact-form textarea::placeholder { color: rgba(255,255,255,0.38); }
      `}</style>

      <div style={{ position: "relative", zIndex: 2, maxWidth: 1100, margin: "0 auto" }}>

        <Reveal><SectionLabel dark>Contacto</SectionLabel></Reveal>
        <Reveal as="h1" className="font-display" style={{ fontSize: "clamp(48px, 6vw, 80px)", fontWeight: 800, textTransform: "uppercase", color: "#fff", lineHeight: 0.95, marginBottom: 56, letterSpacing: "-0.02em" }}>
          Hablemos <span style={{ color: ACCENT }}>Hoy.</span>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1.7fr", gap: "24px", alignItems: "start" }}>

          {/* ── Panel izquierdo ── */}
          <div style={{
            background: `linear-gradient(150deg, #183457 0%, #11293f 55%, #0a1c2e 100%)`,
            padding: "44px 36px", borderRadius: 16,
            display: "flex", flexDirection: "column", justifyContent: "space-between",
            position: "relative", overflow: "hidden",
            border: "1px solid rgba(255,255,255,0.08)",
            minHeight: isMobile ? "auto" : "580px"
          }}>
            <div style={{ position: "absolute", bottom: -70, right: -70, width: 220, height: 220, borderRadius: "50%", background: `${ACCENT}12`, pointerEvents: "none" }} />
            <div style={{ position: "absolute", top: -40, left: -40, width: 120, height: 120, borderRadius: "50%", background: `${ACCENT}08`, pointerEvents: "none" }} />

            <div style={{ position: "relative", zIndex: 1 }}>
              <div role="img" aria-label="Riders Media" style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 36 }}>
                <LogoIcon size={26} />
                <span aria-hidden="true" className="font-display" style={{ fontWeight: 700, fontSize: 17, color: "#ffffff", letterSpacing: "0.05em" }}>IDERS MEDIA</span>
              </div>

              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", padding: "8px 14px", borderRadius: 20, marginBottom: 28 }}>
                <div className="contact-dot" style={{ width: 7, height: 7, borderRadius: "50%", background: ACCENT }} />
                <span style={{ fontSize: 10, fontWeight: 800, color: "rgba(255,255,255,0.65)", letterSpacing: "0.1em", textTransform: "uppercase" }}>Respuesta en menos de 24h</span>
              </div>

              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 15, lineHeight: 1.75, marginBottom: 44 }}>
                Sin filtros, sin juntas innecesarias.<br />
                Directo al punto y a la estrategia de tu negocio.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
                {[
                  { label: "Email",    val: "contacto@riders.media", href: "mailto:contacto@riders.media" },
                  { label: "WhatsApp", val: "+52 220 225 6586",      href: "https://wa.me/522202256586?text=Quiero%20cotizar%20con%20ustedes%21" },
                  { label: "Ciudad",   val: "Puebla, MX" }
                ].map(c => (
                  <div key={c.label}>
                    <div style={{ fontSize: 10, fontWeight: 900, letterSpacing: "0.2em", textTransform: "uppercase", color: ACCENT, marginBottom: 6 }}>{c.label}</div>
                    <div style={{ fontSize: 15, color: "#ffffff", fontWeight: 600 }}>
                      {c.href
                        ? <a href={c.href} target="_blank" rel="noopener noreferrer" style={{ color: "inherit", textDecoration: "none", transition: "color 0.2s" }} onMouseEnter={e => e.currentTarget.style.color = ACCENT} onMouseLeave={e => e.currentTarget.style.color = "#ffffff"}>{c.val}</a>
                        : c.val}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ position: "relative", zIndex: 1, marginTop: 44, paddingTop: 28, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
              <div style={{ fontSize: 9, fontWeight: 800, color: "rgba(255,255,255,0.28)", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 14 }}>Síguenos</div>
              <div style={{ display: "flex", gap: 10 }}>
                {[
                  { name: "IG", color: "#E4405F", url: "https://www.instagram.com/riders_media.mk/" },
                  { name: "FB", color: "#1877F2", url: "https://www.facebook.com/profile.php?id=61579283677547" },
                  { name: "WA", color: "#25D366", url: "https://wa.me/522202256586?text=Quiero%20cotizar%20con%20ustedes%21" },
                  { name: "TL", color: "#0088cc", url: "https://t.me/Ridersmedia?text=Quiero%20cotizar%20con%20ustedes%21" },
                ].map(link => (
                  <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer"
                    style={{ width: 40, height: 40, borderRadius: 8, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none", fontSize: 11, fontWeight: 900, transition: "all 0.2s" }}
                    onMouseEnter={e => { e.currentTarget.style.background = link.color; e.currentTarget.style.borderColor = link.color; e.currentTarget.style.color = "#ffffff"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "rgba(255,255,255,0.5)"; e.currentTarget.style.transform = "translateY(0)"; }}
                  >{link.name}</a>
                ))}
              </div>
            </div>
          </div>

          {/* ── Formulario ── */}
          <form className="contact-form glass-card-dark" onSubmit={handle} style={{ padding: isMobile ? "36px 24px" : "48px 44px", borderRadius: 16, display: "flex", flexDirection: "column", gap: 22 }}>

            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 20 }}>
              <div>
                <label style={labelStyle}>Nombre</label>
                <input required style={inputStyle} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Shaiel Saucedo" autoComplete="name" onFocus={onFocusInput} onBlur={onBlurInput} />
              </div>
              <div>
                <label style={labelStyle}>Email</label>
                <input required type="email" style={inputStyle} value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="Micorreo@Gmail.com" autoComplete="email" onFocus={onFocusInput} onBlur={onBlurInput} />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Teléfono</label>
              <input required type="tel" style={inputStyle} value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+52 1 234 567 8910" autoComplete="tel" onFocus={onFocusInput} onBlur={onBlurInput} />
            </div>

            <div>
              <label style={labelStyle}>Servicio de interés</label>
              <select
                style={{
                  ...inputStyle, cursor: "pointer", appearance: "none", WebkitAppearance: "none",
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 10 10'%3E%3Cpath fill='%23AAB4C2' d='M5 7L0 2h10z'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat", backgroundPosition: "right 18px center", paddingRight: "44px"
                }}
                value={form.service}
                onChange={e => setForm({ ...form, service: e.target.value })}
                onFocus={onFocusInput} onBlur={onBlurInput}
              >
                {servicesList.map(s => {
                  const formattedPrice = s.price.toString().includes('$') ? s.price : `$${s.price}`;
                  return (
                    <option key={s.id} value={s.id} style={{ background: INK, color: "#fff" }}>
                      {s.name} — {formattedPrice} MXN
                    </option>
                  );
                })}
              </select>
            </div>

            <div>
              <label style={labelStyle}>Mensaje</label>
              <textarea required rows={4} style={{ ...inputStyle, resize: "vertical" }} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="Cuéntame sobre tu proyecto, ¿qué necesitas?" onFocus={onFocusInput} onBlur={onBlurInput} />
            </div>

            {/* Honeypot antispam: invisible para humanos, los bots lo rellenan */}
            <input
              type="text" name="empresa_sitio_web" tabIndex={-1} autoComplete="off" aria-hidden="true"
              value={honeypot} onChange={e => setHoneypot(e.target.value)}
              style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
            />

            <div style={{ display: "flex", gap: 12, alignItems: "flex-start", background: `${ACCENT}1f`, border: `1px solid ${ACCENT}45`, padding: "14px 16px", borderRadius: 8 }}>
              <span style={{ flexShrink: 0, color: ACCENT, display: "flex", marginTop: 1 }}><IconInfo /></span>
              <p style={{ color: "rgba(255,255,255,0.72)", fontSize: 12, lineHeight: 1.65, margin: 0 }}>
                Al enviar se abrirá un chat de WhatsApp con tu información prellenada para continuar la conversación directamente con el equipo.
              </p>
            </div>

            <Btn type="submit" variant="primary" full disabled={loading} style={{ cursor: loading ? "wait" : "pointer" }}>
              {loading ? "Procesando..." : "Enviar y Chatear por WhatsApp →"}
            </Btn>

            {sent && (
              <div role="alert" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, color: "#f8b42c", fontWeight: 800, textAlign: "center", padding: 12, background: "rgba(245,163,19,0.16)", border: "1px solid rgba(245,163,19,0.40)", borderRadius: 8 }}>
                <IconCheck /> Solicitud enviada correctamente.
              </div>
            )}
            {error && (
              <div role="alert" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, color: "#ff8d8f", fontWeight: 800, textAlign: "center", padding: 12, background: "rgba(255,77,79,0.14)", border: "1px solid rgba(255,141,143,0.4)", borderRadius: 8 }}>
                <IconAlert /> Hubo un error al enviar el correo, pero el chat debería abrirse.
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

  const btnSize = isMobile ? "44px" : "54px";
  const btnFont = isMobile ? "12px" : "14px";
  const position = isMobile ? "15px" : "30px";

  return (
    <div style={{ position: "fixed", bottom: position, right: position, display: "flex", flexDirection: "column-reverse", alignItems: "center", gap: "10px", zIndex: 2000 }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Cerrar redes sociales" : "Abrir redes sociales"}
        style={{
          width: btnSize, height: btnSize, borderRadius: "50%",
          background: isOpen ? INK2 : INK, color: "#fff", border: "none",
          cursor: "pointer", fontSize: "24px",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: `0 8px 22px ${INK}55`, zIndex: 2001,
          transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
          transform: isOpen ? "rotate(135deg)" : "rotate(0deg)"
        }}
      >
        <IconPlus />
      </button>

      {socialLinks.map((link, index) => (
        <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer" aria-label={link.name}
          style={{
            width: btnSize, height: btnSize, borderRadius: "50%", background: link.color, color: "#fff",
            display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none",
            fontWeight: 900, fontSize: btnFont, boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
            opacity: isOpen ? 1 : 0, visibility: isOpen ? "visible" : "hidden", pointerEvents: isOpen ? "auto" : "none",
            transform: isOpen ? "translateY(0) scale(1)" : `translateY(${(index + 1) * 15}px) scale(0.5)`,
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
  const [preselectedService, setPreselectedService] = useState(null);

  const { data: marketStats } = useSheetData(SHEET_CSV_URL, { mapRows: mapStatRows, mapCols: mapStatCols, fallback: [] });
  const { data: casesList }   = useSheetData(CASES_CSV_URL, { mapCols: mapCaseCols, fallback: CASES || [] });

  const isMobile = useIsMobile();
  const [menuOpen, setMenuOpen] = useState(false);

  const nav = (p, serviceName = null) => {
    setPage(p);
    setPreselectedService(serviceName);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const PAGES = [
    { id: "inicio", label: "Inicio" },
    { id: "catalogo", label: "Catálogo" },
    { id: "valor", label: "Comparativa" },
    { id: "casos", label: "Casos" },
    { id: "agencia", label: "Agencia" },
    { id: "contacto", label: "Contacto" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: BG, color: INK, fontFamily: "'Sentient', Georgia, serif" }}>

      <ScrollProgress />

      {PATRON.global && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", backgroundImage: "url('/patron.svg')", backgroundRepeat: "repeat", backgroundSize: "150px", opacity: 0.04, pointerEvents: "none", zIndex: 9999 }} />
      )}

      <SocialFloat isMobile={isMobile} />

      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000, background: `rgba(255,255,255,0.85)`, backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderBottom: `1px solid ${BORDER}`, height: "80px", display: "flex", alignItems: "center", padding: "0 5vw", justifyContent: "space-between" }}>
        {/* El isotipo es la "R": visualmente el lockup se lee RIDERS MEDIA */}
        <button onClick={() => nav("inicio")} aria-label="Riders Media — Ir al inicio" style={{ background: "none", border: "none", padding: 0, cursor: "pointer", display: "flex", alignItems: "center", gap: 3.5 }}>
          <LogoIcon size={32} />
          <span aria-hidden="true" className="font-display" style={{ fontWeight: 700, fontSize: "22px", letterSpacing: "0.03em", color: INK2 }}>IDERS MEDIA</span>
        </button>

        {!isMobile ? (
          <>
            <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
              {PAGES.map(p => (
                <button key={p.id} onClick={() => nav(p.id)} style={{ background: "none", border: "none", cursor: "pointer", color: page === p.id ? ACCENT : INK2, fontSize: "12px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", padding: "8px 0", borderBottom: page === p.id ? `2px solid ${ACCENT}` : "2px solid transparent", transition: "all 0.2s" }}>
                  {p.label}
                </button>
              ))}
            </div>
            <Btn variant="primary" onClick={() => nav("contacto")} style={{ padding: "11px 26px", fontSize: 12, minHeight: 44 }}>Cotizar</Btn>
          </>
        ) : (
          <button onClick={() => setMenuOpen(!menuOpen)} aria-label="Menú" aria-expanded={menuOpen} style={{ background: "none", border: "none", color: INK, cursor: "pointer", display: "flex", alignItems: "center", padding: 8 }}>
            {menuOpen ? <IconClose /> : <IconMenu />}
          </button>
        )}
      </nav>

      {isMobile && menuOpen && (
        <div className="mobile-menu" style={{ position: "fixed", top: "80px", left: 0, right: 0, background: BG, borderBottom: `1px solid ${BORDER}`, zIndex: 999, display: "flex", flexDirection: "column", padding: "20px 5vw", boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}>
           {PAGES.map(p => (
             <button key={p.id} onClick={() => nav(p.id)} style={{ background: "none", border: "none", color: page === p.id ? ACCENT : INK, fontSize: "16px", fontWeight: 800, textTransform: "uppercase", textAlign: "left", padding: "15px 0", borderBottom: `1px solid ${BORDER}` }}>
               {p.label}
             </button>
           ))}
           <div style={{ marginTop: 15 }}>
             <Btn variant="primary" full onClick={() => nav("contacto")}>Cotizar</Btn>
           </div>
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

      <footer style={{ padding: "20px 5vw", borderTop: `3px solid transparent`, borderImage: `linear-gradient(90deg, ${ACCENT}, ${AMBER2}, ${INK2}) 1`, background: `linear-gradient(180deg, ${BG2} 0%, #e3dac7 100%)` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 24 }}>
          <div role="img" aria-label="Riders Media" style={{ display: "flex", alignItems: "center", gap: 3 }}>
             <LogoIcon size={24} />
             <span aria-hidden="true" className="font-display" style={{ fontWeight: 700, color: INK2, letterSpacing: "0.05em", fontSize: 18 }}>IDERS MEDIA</span>
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
