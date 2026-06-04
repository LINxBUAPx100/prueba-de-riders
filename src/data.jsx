export const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/1kVC51dSFgoc_7V9ERyOLNlIzJnlm_JjrHcHgpCPTqCw/export?format=csv"; 

export const CASES_CSV_URL = "https://docs.google.com/spreadsheets/d/12IrAFWs8rO2Tu3Rrei2MhTGMWGAMV0PWIakYK9aJmnM/export?format=csv";

export const CATALOGO_CSV_URL = "https://docs.google.com/spreadsheets/d/1SEdPIwc1FuocKanHMBKVc2aPkwiftMrYYQT-O17GX2E/export?format=csv";

// Y aquí sigues teniendo tus colores, etc.

// ── PALETA DE COLORES (MARCA RIDERS — SIN VERDE) ─────────────────────────
// Paleta oficial: cream, negro cálido, dos ámbares principales, azul marino y
// púrpura de apoyo. El verde NO forma parte de la identidad.
export const COLORS = {
  // --- FONDOS Y SUPERFICIES ---
  BG:      "#f2efe6",    // Cream — fondo base de marca
  BG2:     "#e9e2d3",    // Cream más cálido — secciones alternas y footer
  SURFACE: "#f8f5ee",    // Cream claro — tarjetas y superficies elevadas

  // --- TINTAS / TIPOGRAFÍA ---
  INK:     "#191b18",    // Negro cálido — texto principal y subtextos
  INK2:    "#183457",    // Azul marino — texto secundario y superficies oscuras
  INK3:    "#5f7387",    // Acero azulado — textos terciarios, labels e íconos

  // --- COLORES PRINCIPALES ---
  ACCENT:  "#f5a313",    // Ámbar — color principal de marca
  AMBER2:  "#f8b42c",    // Ámbar claro — segundo amarillo principal (gradientes)
  ACCENT2: "#183457",    // Azul marino — segundo color principal
  PURPLE:  "#580640",    // Púrpura — color de apoyo / contraste
  BORDER:  "#e3dac7",    // Borde cálido sutil sobre cream

  RIDERS:  "#f5a313",    // Alias del ámbar principal

  // --- ESTADOS UI (sin verde) ---
  SUCCESS:    "#183457",    // Confirmaciones — azul marino de marca
  WARNING:    "#f5a313",    // Advertencias — ámbar
  INFO:       "#183457",    // Informativos — azul marino

  // --- ACENTOS SECUNDARIOS ---
  MUTED_RED:  "#faecc9",    // Ámbar ultra lavado — fondo sutil de chips/alertas
  MUTED_TEAL: "#e4ecf5",    // Azul ultra lavado — fondo sutil de chips info
  TERRA:      "#d98709",    // Ámbar tierra — extremo oscuro del gradiente
};

// ── GRADIENTES DE MARCA ──────────────────────────────────────────────────
// Usados por los botones primarios, textos destacados y líneas de acento.
export const GRAD = {
  brand:     "linear-gradient(135deg, #f8b42c 0%, #f5a313 55%, #d98709 100%)",
  brandSoft: "linear-gradient(135deg, #f8b42c 0%, #f5a313 100%)",
  blue:      "linear-gradient(135deg, #2c5e9e 0%, #183457 100%)",
};

// ── CATÁLOGO DE SERVICIOS ────────────────────────────────────────────────
export const CATALOG = [
  
  { id: "Aseso", tag: "Por pieza", price: "500", name: "Asesoria", desc: "Asesoría especializada para tu proyecto.", highlight: false },
  { id: "Logo", tag: "Por pieza", price: "$650", name: "Diseñamos tu logo", desc: "Diseño profesional de logotipo para tu marca.", highlight: true },
  { id: "reel", tag: "Por pieza", price: "$800", name: "Edición Reel / TikTok", desc: "Edición dinámica con Motion Graphics sobre material del cliente.", highlight: false },
  { id: "gmb", tag: "Pago único", price: "$2,500", name: "Turbo Google Business", desc: "Optimización de ficha en Maps para aparecer en búsquedas locales.", highlight: false },
  { id: "flash", tag: "Mensual", price: "$3,500", name: "Gestión Campañas Flash", desc: "Configuración y monitoreo de Ads para ventas rápidas (+ inversión).", highlight: false },
  { id: "smkit", tag: "Pago único", price: "$3,500", name: "Social Media Kit", desc: "Set de 5 plantillas editables e identidad básica para redes.", highlight: false },
  { id: "landing", tag: "Pago único", price: "$4,500", name: "Landing Page Express", desc: "Página de aterrizaje de una sección para captura de leads.", highlight: false },
  { id: "branding-pack", tag: "Pago único", price: "$5,000", name: "Motion Branding Pack", desc: "Animación de logotipo y elementos visuales para videos.", highlight: false },
  { id: "content", tag: "Mensual", price: "$6,000", name: "Content Rider (Básico)", desc: "4 videos editados por mes + gestión de 1 red social.", highlight: true },
  { id: "growth", tag: "Mensual", price: "$10,000", name: "Growth Engine", desc: "Estrategia combinada: Ads + Contenido + SEO Local básico.", highlight: true },
];

// ── CASOS DE ÉXITO ───────────────────────────────────────────────────────
export const CASES = [
  { cat: "Muy pronto!", client: "Podrias ser el primero", result: "Alcanza tus metas", color: "#183457", link: "#" },

];


// ── PILARES FILOSÓFICOS ──────────────────────────────────────────────────
export const PILLARS = [
  { 
    num: "01", 
    title: "Velocidad", 
    body: "Entregamos sin excusas. Los proyectos tienen fechas y las cumplimos.",
    numColor: COLORS.RIDERS,   // < Controlador el color del "01"
    titleColor: COLORS.INK, // < Controlador el color de "Velocidad"
    bodyColor: COLORS.INK2     // < Controlador el texto pequeño
  },
  { 
    num: "02", 
    title: "Transparencia", 
    body: "Ves exactamente en qué se gasta tu dinero. Sin letra chica.",
    numColor: COLORS.RIDERS,     
    titleColor: COLORS.INK,
    bodyColor: COLORS.INK2
  },
  { 
    num: "03", 
    title: "Impacto Visual", 
    body: "Producción que para el scroll. No contenido que se ignora.",
    numColor: COLORS.RIDERS,   
    titleColor: COLORS.INK,
    bodyColor: COLORS.INK2
  },
];