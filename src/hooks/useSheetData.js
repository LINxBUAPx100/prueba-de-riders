import { useEffect, useState } from "react";

// ── HOOK COMPARTIDO: descarga un CSV público de Google Sheets ────────────
// Centraliza el fetch + guardas + parseo que antes estaba duplicado en
// App (stats y casos), HomeView (ticker), CatalogView y ContactView.
//
// opts:
//   mapRows(rows)  → mapea las filas parseadas por PapaParse (header: true)
//   mapCols(cols)  → mapea una línea dividida por comas (parseo manual,
//                    no requiere PapaParse); devuelve null para descartarla
//   fallback       → dato inicial y valor al que se vuelve si algo falla
//
// status: "loading" | "ok" | "fallback-url" | "fallback-papa"
//         | "fallback-private" | "fallback-empty" | "fallback-network"
export function useSheetData(url, { mapRows, mapCols, fallback = null } = {}) {
  const [data, setData] = useState(fallback);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    if (!url || url.includes("sharing")) { setStatus("fallback-url"); return; }
    if (!window.Papa && !mapCols) { setData(fallback); setStatus("fallback-papa"); return; }

    let active = true;
    const fail = (code) => { if (active) { setData(fallback); setStatus(code); } };

    fetch(`${url}&t=${Date.now()}`)
      .then(res => res.text())
      .then(csvText => {
        if (!active) return;
        // Un Sheet privado devuelve HTML de login en vez de CSV
        if (csvText.trim().startsWith("<")) { fail("fallback-private"); return; }

        let rows = [];
        if (window.Papa && mapRows) {
          const results = window.Papa.parse(csvText, {
            header: true,
            skipEmptyLines: true,
            transformHeader: h => h.trim(),
          });
          rows = (mapRows(results.data) || []).filter(Boolean);
        } else if (mapCols) {
          rows = csvText
            .split("\n")
            .slice(1)
            .map(line => mapCols(line.replace(/\r/g, "").split(",")))
            .filter(Boolean);
        }

        if (rows.length === 0) { fail("fallback-empty"); return; }
        setData(rows);
        setStatus("ok");
      })
      .catch(() => fail("fallback-network"));

    return () => { active = false; };
    // mapRows/mapCols/fallback se definen a nivel de módulo: solo la URL dispara refetch
  }, [url]); // eslint-disable-line react-hooks/exhaustive-deps

  return { data, status };
}
