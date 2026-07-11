import { COLORS } from "./data";

// ── MAPPERS DE GOOGLE SHEETS (usados por useSheetData) ───────────────────

// Ticker del hero y select del formulario: nombre + precio
export const mapServiceRows = (rows) => rows
  .filter(row => row["Servicio"] && row["Servicio"].trim() !== "")
  .map((row, index) => ({
    id: `sheet-item-${index}`,
    name: row["Servicio"].trim(),
    price: row["Inversión (Desde)"] ? row["Inversión (Desde)"].toString().trim() : "",
  }));

// Catálogo completo: incluye tipo de pago, descripción y destacado
export const mapCatalogRows = (rows) => rows
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
export const mapStatRows = (rows) => rows
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
export const mapStatCols = (cols) => {
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
export const mapCaseCols = (cols) => {
  if (cols.length < 4 || !cols[1]) return null;
  return { cat: cols[0], client: cols[1], result: cols[2], color: cols[3] || COLORS.ACCENT, link: cols[4] || "#" };
};
