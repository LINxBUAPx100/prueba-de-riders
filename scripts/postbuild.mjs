// ── POSTBUILD: HTML estático por ruta para GitHub Pages ──────────────────
// GitHub Pages solo sirve archivos: sin esto, /catalogo devolvería 404.
// Por cada ruta se copia dist/index.html a dist/<ruta>/index.html con su
// <title>, meta description, canonical y Open Graph propios → cada URL
// responde 200 con metadatos correctos para buscadores y redes.
// Además se genera dist/404.html (fallback SPA para rutas desconocidas).
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { ROUTES_META } from "../src/routesMeta.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dist = join(__dirname, "..", "dist");
const ORIGIN = "https://riders.media";

const base = readFileSync(join(dist, "index.html"), "utf8");
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const replaceOrThrow = (html, regex, replacement, name, path) => {
  if (!regex.test(html)) throw new Error(`postbuild: no se encontró ${name} en index.html (ruta ${path})`);
  return html.replace(regex, replacement);
};

for (const r of ROUTES_META) {
  const url = `${ORIGIN}${r.path === "/" ? "/" : r.path}`;
  let html = base;
  html = replaceOrThrow(html, /<title>[\s\S]*?<\/title>/, `<title>${esc(r.title)}</title>`, "<title>", r.path);
  html = replaceOrThrow(html, /(<meta name="description" content=")[^"]*(")/, `$1${esc(r.description)}$2`, "meta description", r.path);
  html = replaceOrThrow(html, /(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`, "canonical", r.path);
  html = replaceOrThrow(html, /(<meta property="og:url" content=")[^"]*(")/, `$1${url}$2`, "og:url", r.path);
  html = replaceOrThrow(html, /(<meta property="og:title" content=")[^"]*(")/, `$1${esc(r.title)}$2`, "og:title", r.path);
  html = replaceOrThrow(html, /(<meta property="og:description" content=")[^"]*(")/, `$1${esc(r.description)}$2`, "og:description", r.path);
  html = replaceOrThrow(html, /(<meta name="twitter:title" content=")[^"]*(")/, `$1${esc(r.title)}$2`, "twitter:title", r.path);
  html = replaceOrThrow(html, /(<meta name="twitter:description" content=")[^"]*(")/, `$1${esc(r.description)}$2`, "twitter:description", r.path);

  if (r.path === "/") {
    writeFileSync(join(dist, "index.html"), html);
  } else {
    const dir = join(dist, r.path.slice(1));
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, "index.html"), html);
  }
}

// Fallback SPA: rutas no listadas caen aquí (GitHub Pages lo sirve con 404,
// pero el usuario ve la app y el router redirige a "/")
writeFileSync(join(dist, "404.html"), base);

console.log(`postbuild: ${ROUTES_META.length} rutas generadas + 404.html`);
