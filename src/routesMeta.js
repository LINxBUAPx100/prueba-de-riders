// ── METADATA POR RUTA ────────────────────────────────────────────────────
// Única fuente de verdad para: el nav/footer (label), el router (path),
// el <title>/<meta> dinámico del cliente y el HTML estático por ruta que
// genera scripts/postbuild.mjs en cada build.
export const ROUTES_META = [
  {
    path: "/",
    id: "inicio",
    label: "Inicio",
    title: "Riders.Media | Agencia Digital Puebla — Motion Graphics y Desarrollo Web",
    description: "Agencia digital en Puebla: motion graphics, desarrollo web con React y campañas digitales. Transparencia total en costos y entregas sin excusas.",
  },
  {
    path: "/catalogo",
    id: "catalogo",
    label: "Catálogo",
    title: "Catálogo y Precios 2026 | Riders.Media",
    description: "Catálogo público de servicios con precios transparentes: motion graphics, desarrollo web, campañas y gestión de contenido. Sin letra chica.",
  },
  {
    path: "/comparativa",
    id: "valor",
    label: "Comparativa",
    title: "Comparativa de Mercado | Riders.Media",
    description: "Freelance vs. agencia tradicional vs. Riders: tiempos de entrega, costos y transparencia comparados frente a nuestro catálogo público.",
  },
  {
    path: "/casos",
    id: "casos",
    label: "Casos",
    title: "Casos de Éxito | Riders.Media",
    description: "Resultados reales de marcas que confiaron en Riders Media: crecimiento medible, no métricas de vanidad.",
  },
  {
    path: "/agencia",
    id: "agencia",
    label: "Agencia",
    title: "Sobre la Agencia | Riders.Media",
    description: "Unidad de respuesta rápida en Puebla: precisión técnica, creatividad disruptiva y transparencia total en el proceso.",
  },
  {
    path: "/contacto",
    id: "contacto",
    label: "Contacto",
    title: "Contacto y Cotización | Riders.Media",
    description: "Cotiza tu proyecto hoy: respuesta en menos de 24h por WhatsApp o correo. Directo al punto, sin juntas innecesarias.",
  },
];
