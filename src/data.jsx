export const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/1kVC51dSFgoc_7V9ERyOLNlIzJnlm_JjrHcHgpCPTqCw/export?format=csv"; 

export const CASES_CSV_URL = "https://docs.google.com/spreadsheets/d/12IrAFWs8rO2Tu3Rrei2MhTGMWGAMV0PWIakYK9aJmnM/export?format=csv";

export const CATALOGO_CSV_URL = "https://docs.google.com/spreadsheets/d/1SEdPIwc1FuocKanHMBKVc2aPkwiftMrYYQT-O17GX2E/export?format=csv";

// Y aquí sigues teniendo tus colores, etc.

// ── PALETA DE COLORES (ESTÉTICA PROFESIONAL) ─────────────────────────────
export const COLORS = {
  // --- FONDOS Y SUPERFICIES ---
  BG:      "#FFFFFF",    // Blanco puro — base limpia y moderna
  BG2:     "#F5F0E6",    // Crema cálida — secciones secundarias
  SURFACE: "#FAF7F2",    // Crema suave — tarjetas y superficies elevadas

  // --- TINTAS / TIPOGRAFÍA ---
  INK:     "#0D1B2A",    // Azul noche oscuro — texto principal
  INK2:    "#1D3557",    // Azul marino — texto secundario
  INK3:    "#6B7C93",    // Acero azulado — textos terciarios e íconos

  // --- COLORES PRINCIPALES ---
  ACCENT:  "#F5A623",    // Ámbar naranja — color principal de marca Riders
  ACCENT2: "#1D3557",    // Azul marino — variante de acento
  BORDER:  "#E8E0D0",    // Borde cálido sutil

  RIDERS:  "#F5A623",    // Alias del naranja principal

  // --- ESTADOS UI ---
  SUCCESS:    "#2D7D4F",
  WARNING:    "#E8930F",
  INFO:       "#1D3557",

  // --- ACENTOS SECUNDARIOS ---
  MUTED_RED:  "#FFF4E0",    // Naranja ultra lavado — fondo sutil etiquetas naranja
  MUTED_TEAL: "#EAF0FF",    // Azul ultra lavado — fondo sutil etiquetas azul
  TERRA:      "#C47B0A",    // Ámbar tierra — íconos y contrastes secundarios
};

// ── GRADIENTES DE MARCA ──────────────────────────────────────────────────
// Usados por los botones primarios, textos destacados y líneas de acento.
export const GRAD = {
  brand:     "linear-gradient(135deg, #F5A623 0%, #E8930F 55%, #C47B0A 100%)",
  brandSoft: "linear-gradient(135deg, #F5A623 0%, #E8930F 100%)",
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
  { cat: "Muy pronto!", client: "Podrias ser el primero", result: "Alcanza tus metas", color: "#0D9488", link: "#" },

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