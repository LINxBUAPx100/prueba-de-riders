# RIDERS MEDIA

**Unidad de Respuesta Rápida · Puebla, MX**  
Agencia digital especializada en motion graphics, desarrollo web con React/Next.js y estrategia de contenido B2B.

---

## Paleta de Color

La identidad visual de Riders Media está construida sobre una jerarquía de color precisa: un fondo cálido y limpio, tipografía en azul noche, y naranja ámbar como acento principal.

### Fondos y Superficies

| Token    | Hex       | Uso                                          |
|----------|-----------|----------------------------------------------|
| `BG`     | `#FFFFFF` | Fondo base — secciones principales           |
| `BG2`    | `#F5F0E6` | Crema cálida — secciones secundarias y footer |
| `SURFACE`| `#FAF7F2` | Crema suave — tarjetas y superficies elevadas |

### Tipografía / Tintas

| Token  | Hex       | Uso                                           |
|--------|-----------|-----------------------------------------------|
| `INK`  | `#0D1B2A` | Azul noche oscuro — texto principal y headings |
| `INK2` | `#1D3557` | Azul marino — texto secundario y fondo paneles |
| `INK3` | `#6B7C93` | Acero azulado — texto terciario, iconos, labels |

### Acentos de Marca

| Token    | Hex       | Uso                                                  |
|----------|-----------|------------------------------------------------------|
| `ACCENT` | `#F5A623` | Naranja ámbar — color principal de marca, CTAs       |
| `TERRA`  | `#C47B0A` | Ámbar tierra — extremo oscuro del gradiente de marca |
| `BORDER` | `#E8E0D0` | Borde cálido sutil — separadores y contornos         |

### Gradiente de Marca

```
linear-gradient(135deg, #F5A623 → #E8930F → #C47B0A)
```
Usado en: botones CTA, texto destacado, línea de acento en tarjetas y bordes de sección.

### Fondos Sutiles (UI)

| Token        | Hex       | Uso                                              |
|--------------|-----------|--------------------------------------------------|
| `MUTED_RED`  | `#FFF4E0` | Naranja ultra lavado — fondo de chips y alertas  |
| `MUTED_TEAL` | `#EAF0FF` | Azul ultra lavado — fondo de chips informativos  |

### Estados UI

| Token     | Hex       | Uso            |
|-----------|-----------|----------------|
| `SUCCESS` | `#2D7D4F` | Confirmaciones |
| `WARNING` | `#E8930F` | Advertencias   |
| `INFO`    | `#1D3557` | Informativos   |

---

## Jerarquía Visual

```
[ INK #0D1B2A ]     ←  Headings y texto principal
   ↓
[ INK2 #1D3557 ]    ←  Texto de soporte, paneles oscuros
   ↓
[ INK3 #6B7C93 ]    ←  Labels, placeholders, íconos

[ BG #FFFFFF ]      ←  Base limpia
[ SURFACE #FAF7F2 ] ←  Un nivel elevado (tarjetas)
[ BG2 #F5F0E6 ]     ←  Dos niveles (secciones alternadas)

[ ACCENT #F5A623 ]  ←  Acción, énfasis, interacción
```

---

## Tecnología

| Capa       | Herramienta                       |
|------------|-----------------------------------|
| UI         | React 18 + Vite 5                 |
| Estilos    | Inline CSS + clases utilitarias   |
| Fuentes    | Barlow Condensed, DM Sans (Google Fonts) |
| Contacto   | EmailJS + WhatsApp API            |
| Datos      | Google Sheets CSV (PapaParse)     |
| Deploy     | GitHub Pages (dominio custom)     |

---

## Páginas

| Ruta       | Vista        | Descripción                                   |
|------------|--------------|-----------------------------------------------|
| `inicio`   | HomeView     | Hero con stats glassmorphism + filosofía      |
| `catalogo` | CatalogView  | Servicios y precios cargados desde Google Sheets |
| `valor`    | ValorView    | Comparativa de mercado con gráficas           |
| `casos`    | CasesView    | Casos de éxito                                |
| `agencia`  | AboutView    | Sobre la agencia                              |
| `contacto` | ContactView  | Formulario + WhatsApp + selección de servicio |

---

## Desarrollo

```bash
npm install
npm run dev        # Servidor local
npm run build      # Build de producción
npm run deploy     # Deploy a GitHub Pages
```

---

© 2026 Riders Media · Puebla, MX · riders.media
