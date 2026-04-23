//la magia de las celdas y el excel jajaja

export const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/1kVC51dSFgoc_7V9ERyOLNlIzJnlm_JjrHcHgpCPTqCw/export?format=csv"; 

// PEGA AQUÍ TU SEGUNDO LINK DE GOOGLE SHEETS PARA LOS CASOS
export const CASES_CSV_URL = "https://docs.google.com/spreadsheets/d/12IrAFWs8rO2Tu3Rrei2MhTGMWGAMV0PWIakYK9aJmnM/export?format=csv";

// ── PALETA DE COLORES (ESTÉTICA PROFESIONAL) ─────────────────────────────
export const COLORS = {
  // --- FONDOS Y SUPERFICIES ---
  BG:       "#F4F6F8",   // Gris azulado ultra claro (El fondo general limpio de la imagen)
  BG2:      "#DBDDDF",   // Gris claro/acero (Directo del moodboard. Útil para secciones secundarias)
  SURFACE:  "#FFFFFF",   // Blanco puro (Para que los mockups y tarjetas destaquen limpiamente)

  // --- TINTAS / TIPOGRAFÍA ---
  INK:      "#273545",   // Azul marino oscuro (Directo del moodboard. Reemplaza al negro para un texto más suave y elegante)
  INK2:     "#5A6B7C",   // Azul marino desaturado (Texto secundario para jerarquía visual)
  INK3:     "#92AABE",   // Azul acero suave (Directo del moodboard. Para textos terciarios, placeholders o iconos)

  // --- COLORES PRINCIPALES ---
  ACCENT:   "#3D5C71",   // Azul pizarra (Directo del moodboard. Tu color principal para botones e identidad gráfica)
  ACCENT2:  "#273545",   // Azul marino oscuro (Ideal para el hover del azul pizarra)
  BORDER:   "#DBDDDF",   // Gris claro/acero (Directo del moodboard. Bordes estructurados y limpios)
  RIDERS:   "#A66C46",   // Cobre / Tierra (Directo del moodboard. El único acento cálido que corta la frialdad de los azules)

  // --- ESTADOS UI (Ajustados para no romper la estética orgánica) ---
  SUCCESS:  "#4E7A5E",   // Verde bosque desaturado (Mantiene el tono sobrio y maduro)
  WARNING:  "#C68C53",   // Ocre suave (Derivado del cobre principal para mantener armonía)
  INFO:     "#92AABE",   // Azul acero suave (Reutilizamos el tono de la paleta para coherencia)

  // --- ACENTOS SECUNDARIOS ---
  MUTED_RED:  "#F4EBE6", // Cobre ultra lavado (Fondo sutil para etiquetas que lleven texto en color RIDERS)
  MUTED_TEAL: "#E6ECF0", // Azul pizarra ultra lavado (Fondo sutil para etiquetas que lleven texto en color ACCENT)
  TERRA:      "#8B5A39", // Cobre oscuro (Para contrastes o iconos secundarios de la familia tierra)
};


// ── CATÁLOGO DE SERVICIOS ────────────────────────────────────────────────
export const CATALOG = [
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
  { cat: "Video", client: "MotoShop GDL", result: "+340% Reproducciones", color: "#0D9488", link: "#" },
  { cat: "Ads", client: "Tacos El Rancho", result: "3x Ventas en 30 días", color: "#0F766E", link: "#" },
  { cat: "Web", client: "Clínica Vita", result: "80+ Leads / mes", color: "#57534E", link: "#" },
  { cat: "Branding", client: "Ropa Urbana MX", result: "Identidad en 5 días", color: "#DC2626", link: "#" },
];


// ── PILARES FILOSÓFICOS ──────────────────────────────────────────────────
export const PILLARS = [
  { 
    num: "01", 
    title: "Velocidad", 
    body: "Entregamos sin excusas. Los proyectos tienen fechas y las cumplimos.",
    numColor: COLORS.RIDERS,   // < Controlador el color del "01"
    titleColor: COLORS.ACCENT, // < Controlador el color de "Velocidad"
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