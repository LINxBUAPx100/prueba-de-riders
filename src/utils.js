// ── HELPER: normaliza texto para comparar nombres (trim + minúsculas + sin acentos)
export const normalize = (str) =>
  (str || "")
    .toString()
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
