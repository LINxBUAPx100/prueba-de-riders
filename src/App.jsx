import { useState } from "react";
import emailjs from '@emailjs/browser';
import { COLORS, CATALOG, CASES, PILLARS } from "./data";
import "./index.css";

const { ACCENT, ACCENT_DIM, ACCENT_GLOW, ACCENT_BORDER, MUTED, BG, SURFACE, BORDER } = COLORS;

// ── COMPONENTES UI REUTILIZABLES ───────────────────────────────────────────

function Chip({ children, accent }) {
  return (
    <span style={{ 
      display: "inline-block", 
      background: accent ? ACCENT : ACCENT_GLOW, 
      color: accent ? "#000" : ACCENT, 
      border: accent ? "none" : `1px solid ${ACCENT_BORDER}`, 
      padding: "3px 10px", 
      borderRadius: 4, 
      fontSize: 11, 
      fontWeight: 700, 
      letterSpacing: "0.08em", 
      textTransform: "uppercase" 
    }}>
      {children}
    </span>
  );
}

function SectionLabel({ children }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
      <span style={{ display: "inline-block", width: 28, height: 1, background: ACCENT }} />
      <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: ACCENT }}>
        {children}
      </span>
    </div>
  );
}

// (PÁGINAS) 

function HomeView({ nav }) {
  return (
    <div>
      <section style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", padding: "120px 5vw 80px", position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(${ACCENT}04 1px, transparent 1px), linear-gradient(90deg, ${ACCENT}04 1px, transparent 1px)`, backgroundSize: "60px 60px", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "10%", right: "-5%", width: 600, height: 600, borderRadius: "50%", background: ACCENT, filter: "blur(180px)", opacity: 0.07, pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "5%", left: "-10%", width: 400, height: 400, borderRadius: "50%", background: "#818CF8", filter: "blur(160px)", opacity: 0.06, pointerEvents: "none" }} />
        
        <div style={{ position: "relative", maxWidth: 900 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 32 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: ACCENT, boxShadow: `0 0 14px ${ACCENT}`, animation: "pulse 2s infinite" }} />
            <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: ACCENT }}>Agencia de Soluciones Digitales · Puebla, MX</span>
          </div>
          
          <h1 style={{ fontSize: "clamp(52px,9vw,110px)", fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, lineHeight: 0.9, letterSpacing: "-0.02em", textTransform: "uppercase", marginBottom: 32 }}>
            RIDERS<br />
            <span style={{ WebkitTextStroke: `2px ${ACCENT}`, color: "transparent" }}>MEDIA</span>
          </h1>
          
          <p style={{ fontSize: "clamp(16px,2vw,20px)", color: MUTED, maxWidth: 560, lineHeight: 1.65, marginBottom: 48 }}>
            No somos una agencia convencional. Somos una <em style={{ color: "#fff", fontStyle: "normal", fontWeight: 600 }}>unidad de respuesta rápida</em> para PyMEs que necesitan velocidad, claridad y resultados medibles.
          </p>
          
          <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
            <button onClick={() => nav("catalogo")} style={{ background: ACCENT, color: "#000", border: "none", padding: "16px 36px", fontWeight: 800, fontSize: 13, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", clipPath: "polygon(0 0,calc(100% - 12px) 0,100% 12px,100% 100%,12px 100%,0 calc(100% - 12px))" }}>
              Ver Catálogo 2026 →
            </button>
            <button onClick={() => nav("contacto")} style={{ background: "transparent", color: "#fff", border: "1px solid rgba(255,255,255,0.15)", padding: "16px 36px", fontWeight: 700, fontSize: 13, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer" }}>
              Contactar
            </button>
          </div>
        </div>

        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, borderTop: `1px solid ${BORDER}`, height: 40, display: "flex", alignItems: "center" }}>
          <div style={{ display: "flex", gap: 48, animation: "ticker 22s linear infinite", whiteSpace: "nowrap" }}>
            {["Edición de Video", "Motion Graphics", "Google Ads", "Landing Pages", "Social Media", "SEO Local", "Branding en Movimiento"].map((t, i) => (
              <span key={i} style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: i % 3 === 0 ? ACCENT : MUTED }}>{t} ·</span>
            ))}
          </div>
        </div>
      </section>

      <section style={{ borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}`, padding: "48px 5vw", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 32 }}>
        {[{ val: "48h", label: "Entrega promedio" }, { val: "100%", label: "Transparencia total" }, { val: "8", label: "Servicios en catálogo" }, { val: "PyMEs", label: "Nuestro enfoque" }].map((s, i) => (
          <div key={i}>
            <div style={{ fontSize: "clamp(36px,5vw,52px)", fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, color: i % 2 === 0 ? ACCENT : "#fff", lineHeight: 1 }}>{s.val}</div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: MUTED, marginTop: 6 }}>{s.label}</div>
          </div>
        ))}
      </section>

      <section style={{ padding: "96px 5vw" }}>
        <SectionLabel>Filosofía</SectionLabel>
        <h2 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: "clamp(36px,5vw,56px)", fontWeight: 800, textTransform: "uppercase", lineHeight: 1, marginBottom: 56 }}>
          Eficacia y Transparencia<br /><span style={{ color: ACCENT }}>en Movimiento.</span>
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 2 }}>
          {PILLARS.map(p => (
            <div key={p.num} style={{ background: SURFACE, border: `1px solid ${BORDER}`, padding: "40px 32px", transition: "all 0.3s" }}
              onMouseEnter={e => { e.currentTarget.style.background = ACCENT_GLOW; e.currentTarget.style.borderColor = ACCENT_BORDER; }}
              onMouseLeave={e => { e.currentTarget.style.background = SURFACE; e.currentTarget.style.borderColor = BORDER; }}>
              <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 72, fontWeight: 800, color: "rgba(6,182,212,0.08)", lineHeight: 1, marginBottom: 16 }}>{p.num}</div>
              <h3 style={{ fontSize: 18, fontWeight: 800, letterSpacing: "0.05em", textTransform: "uppercase", color: "#fff", marginBottom: 10 }}>{p.title}</h3>
              <p style={{ color: MUTED, fontSize: 14, lineHeight: 1.7 }}>{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: "0 5vw 96px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 40, flexWrap: "wrap", gap: 16 }}>
          <div>
            <SectionLabel>Resultados</SectionLabel>
            <h2 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: "clamp(32px,4vw,48px)", fontWeight: 800, textTransform: "uppercase" }}>Casos Reales</h2>
          </div>
          <button onClick={() => nav("casos")} style={{ background: "none", border: "1px solid rgba(255,255,255,0.12)", color: "#fff", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "10px 20px", cursor: "pointer" }}>Ver todos →</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 2 }}>
          {CASES.map((c, i) => (
            <div key={i} style={{ background: SURFACE, border: `1px solid ${BORDER}`, padding: "36px 28px", position: "relative", transition: "transform 0.3s" }}
              onMouseEnter={e => e.currentTarget.style.transform = "translateY(-4px)"}
              onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
              <div style={{ position: "absolute", top: 0, left: 0, height: 2, width: "100%", background: c.color }} />
              <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.15em", textTransform: "uppercase", color: c.color, marginBottom: 12 }}>{c.cat}</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 8 }}>{c.client}</div>
              <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 28, fontWeight: 800, color: "#fff", lineHeight: 1.1 }}>{c.result}</div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ background: `linear-gradient(135deg, ${ACCENT_DIM}, #0E7490)`, padding: "72px 5vw", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 24 }}>
        <div>
          <h2 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: "clamp(32px,4vw,52px)", fontWeight: 800, color: "#fff", textTransform: "uppercase", lineHeight: 1 }}>¿Tu contenido se ve igual al<br />de todos los demás?</h2>
          <p style={{ color: "rgba(255,255,255,0.65)", marginTop: 12, fontSize: 15, fontWeight: 600 }}>Estás perdiendo dinero. Hablemos hoy.</p>
        </div>
        <button onClick={() => nav("contacto")} style={{ background: "#fff", color: ACCENT_DIM, border: "none", padding: "18px 40px", fontWeight: 800, fontSize: 13, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", clipPath: "polygon(0 0,calc(100% - 12px) 0,100% 12px,100% 100%,12px 100%,0 calc(100% - 12px))" }}>Contactar Ahora →</button>
      </section>
    </div>
  );
}

function CatalogView({ nav }) {
  const monthly = CATALOG.filter(s => s.tag === "Mensual");
  const oneTime = CATALOG.filter(s => s.tag === "Pago único");
  const perPiece = CATALOG.filter(s => s.tag === "Por pieza");

  function Section({ title, items }) {
    return (
      <div style={{ marginBottom: 64 }}>
        <SectionLabel>{title}</SectionLabel>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 2 }}>
          {items.map(s => (
            <div key={s.id} style={{ background: s.highlight ? ACCENT_GLOW : SURFACE, border: `1px solid ${s.highlight ? ACCENT_BORDER : BORDER}`, padding: "32px 28px", position: "relative", transition: "transform 0.2s,border-color 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; if (!s.highlight) e.currentTarget.style.borderColor = ACCENT_BORDER; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; if (!s.highlight) e.currentTarget.style.borderColor = BORDER; }}>
              {s.highlight && <div style={{ position: "absolute", top: 12, right: 12, background: ACCENT, color: "#000", fontSize: 9, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", padding: "3px 8px" }}>Popular</div>}
              <Chip>{s.tag}</Chip>
              <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 52, fontWeight: 800, color: "#fff", lineHeight: 1, marginTop: 16, letterSpacing: "-0.02em" }}>{s.price}<span style={{ fontSize: 16, fontWeight: 600, color: MUTED }}> MXN</span></div>
              <h3 style={{ fontSize: 17, fontWeight: 800, color: "#fff", marginTop: 16, marginBottom: 8 }}>{s.name}</h3>
              <p style={{ fontSize: 13, color: MUTED, lineHeight: 1.6 }}>{s.desc}</p>
              <button onClick={() => nav("contacto")} style={{ marginTop: 24, background: "none", border: `1px solid ${ACCENT_BORDER}`, color: ACCENT, fontSize: 11, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", padding: "9px 18px", cursor: "pointer", width: "100%", transition: "all 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.background = ACCENT; e.currentTarget.style.color = "#000"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = ACCENT; }}>
                Cotizar este servicio →
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "80px 5vw 96px" }}>
      <div style={{ maxWidth: 640, marginBottom: 72 }}>
        <Chip accent>Catálogo 2026</Chip>
        <h1 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: "clamp(48px,7vw,80px)", fontWeight: 800, textTransform: "uppercase", lineHeight: 0.95, marginTop: 20, marginBottom: 20 }}>
          Servicios &<br /><span style={{ color: ACCENT }}>Precios</span>
        </h1>
        <p style={{ color: MUTED, fontSize: 15, lineHeight: 1.7 }}>Sin letra chica. Sin sorpresas. Todos los precios son desde — cotizamos según tu proyecto. Inversión en publicidad no incluida en paquetes de Ads.</p>
      </div>
      <Section title="Por pieza" items={perPiece} />
      <Section title="Pago único" items={oneTime} />
      <Section title="Paquetes mensuales" items={monthly} />
    </div>
  );
}

function CasesView() {
  return (
    <div style={{ padding: "80px 5vw 96px" }}>
      <SectionLabel>Resultados</SectionLabel>
      <h1 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: "clamp(48px,7vw,80px)", fontWeight: 800, textTransform: "uppercase", lineHeight: 0.95, marginBottom: 64 }}>
        Casos de<br /><span style={{ color: ACCENT }}>Éxito</span>
      </h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 2 }}>
        {CASES.map((c, i) => (
          <div key={i} style={{ background: SURFACE, border: `1px solid ${BORDER}`, padding: "48px 32px", position: "relative" }}>
            <div style={{ position: "absolute", top: 0, left: 0, height: 3, width: "100%", background: c.color }} />
            <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.15em", textTransform: "uppercase", color: c.color, marginBottom: 16 }}>{c.cat}</div>
            <div style={{ fontSize: 17, fontWeight: 700, color: "#fff", marginBottom: 16 }}>{c.client}</div>
            <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 38, fontWeight: 800, color: "#fff", lineHeight: 1 }}>{c.result}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AboutView() {
  return (
    <div style={{ padding: "80px 5vw 96px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 64, alignItems: "start", marginBottom: 96 }}>
        <div>
          <SectionLabel>Quiénes somos</SectionLabel>
          <h1 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: "clamp(48px,6vw,72px)", fontWeight: 800, textTransform: "uppercase", lineHeight: 0.95, marginBottom: 32 }}>
            Unidad de<br />Respuesta<br /><span style={{ color: ACCENT }}>Rápida.</span>
          </h1>
          <div style={{ color: MUTED, fontSize: 15, lineHeight: 1.8, display: "flex", flexDirection: "column", gap: 20 }}>
            <p>Riders Media fusiona la <strong style={{ color: "#fff" }}>precisión técnica con la creatividad disruptiva.</strong> No somos una agencia de marketing convencional.</p>
            <p>Resolvemos el problema de la lentitud digital y la falta de transparencia en la industria. Somos eficaces en la entrega y 100% transparentes en el proceso.</p>
            <blockquote style={{ borderLeft: `3px solid ${ACCENT}`, paddingLeft: 20, color: "#fff", fontStyle: "italic", fontWeight: 500, fontSize: 15, lineHeight: 1.65, margin: "8px 0" }}>
              "Construimos los activos digitales más rápidos de la región. Combinamos programación web con producción audiovisual premium para que tu negocio sea recordado."
            </blockquote>
          </div>
        </div>
        <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, padding: 48, display: "flex", flexDirection: "column", gap: 40 }}>
          {[{ label: "Misión", body: "Impulsar el crecimiento de PyMEs mediante la construcción de infraestructuras web superiores y contenido visual que captura la atención en segundos." }, { label: "Compromiso", body: "Velocidad de entrega, transparencia total en costos y resultados que puedes medir. Sin excusas, sin letra chica." }].map((item, i) => (
            <div key={i} style={i > 0 ? { borderTop: `1px solid ${BORDER}`, paddingTop: 40 } : {}}>
              <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: ACCENT, marginBottom: 12 }}>{item.label}</div>
              <p style={{ color: MUTED, fontSize: 14, lineHeight: 1.7 }}>{item.body}</p>
            </div>
          ))}
        </div>
      </div>
      <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: 80 }}>
        <h2 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: "clamp(32px,4vw,48px)", fontWeight: 800, textTransform: "uppercase", marginBottom: 48, textAlign: "center" }}>
          Nuestros <span style={{ color: ACCENT }}>Pilares</span>
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 2 }}>
          {PILLARS.map(p => (
            <div key={p.num} style={{ background: SURFACE, border: `1px solid ${BORDER}`, padding: "40px 32px" }}>
              <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 80, fontWeight: 800, color: "rgba(6,182,212,0.06)", lineHeight: 1 }}>{p.num}</div>
              <h3 style={{ fontSize: 17, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.04em", color: "#fff", marginBottom: 10 }}>{p.title}</h3>
              <p style={{ color: MUTED, fontSize: 13, lineHeight: 1.7 }}>{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ContactView() {
  const [form, setForm] = useState({ name: "", email: "", service: "content", message: "" });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(false); // Para manejar errores
  const [loading, setLoading] = useState(false);

  const handle = (e) => {
    e.preventDefault(); 
    setLoading(true);
    setError(false);

    // Buscamos el nombre real del servicio para que el correo sea legible
    const selectedService = CATALOG.find(s => s.id === form.service);
    const serviceName = selectedService ? `${selectedService.name} (${selectedService.price})` : form.service;

    // Estos parámetros deben coincidir con las {{variables}} de tu template en EmailJS
    const templateParams = {
      name: form.name,
      email: form.email,
      service_requested: serviceName,
      message: form.message,
    };

  emailjs
      .send(
      "service_p0f63m9", 
      "template_8228t39", 
      templateParams,
      "L636Sbe9_FAnZ6G9l"
    )
    .then(
      () => {
        console.log("¡MENSAJE ENVIADO CON ÉXITO!");
        setLoading(false);
        setSent(true);
        setForm({ name: "", email: "", service: "content", message: "" });
        setTimeout(() => setSent(false), 6000);
      },
      (error) => {
        console.log("ERROR AL ENVIAR:", error.text);
        setLoading(false);
        setError(true);
      }
    );
  };

  const inputStyle = { width: "100%", background: "rgba(6,182,212,0.04)", border: "1px solid " + BORDER, color: "#fff", padding: "14px 16px", fontSize: 14, fontFamily: "inherit", outline: "none", boxSizing: "border-box", transition: "border-color 0.2s" };
  const labelStyle = { fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: MUTED, display: "block", marginBottom: 8 };

  return (
    <div style={{ padding: "80px 5vw 96px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 2, maxWidth: 960, margin: "0 auto", border: "1px solid " + BORDER }}>
        <div style={{ background: ACCENT_GLOW, borderRight: "1px solid " + BORDER, padding: "48px 36px" }}>
          <h1 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 52, fontWeight: 800, textTransform: "uppercase", lineHeight: 0.95, marginBottom: 40 }}>Hablemos<br /><span style={{ color: ACCENT }}>Hoy.</span></h1>
          <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            {[{ label: "Email", val: "hola@ridersmedia.mx" }, { label: "WhatsApp", val: "+52 220 225 6586" }, { label: "Ciudad", val: "Puebla, MX" }].map(c => (
              <div key={c.label}>
                <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.15em", textTransform: "uppercase", color: ACCENT, marginBottom: 4 }}>{c.label}</div>
                <div style={{ fontSize: 14, color: "#fff", fontWeight: 500 }}>{c.val}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 48, padding: 20, background: SURFACE, border: "1px solid " + BORDER }}>
            <p style={{ fontSize: 12, color: MUTED, lineHeight: 1.7, fontStyle: "italic" }}>Respondemos en menos de 24 horas. Sin filtros, directo al estratega.</p>
          </div>
        </div>
        <form onSubmit={handle} style={{ padding: "48px 40px", display: "flex", flexDirection: "column", gap: 20, background: SURFACE }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div><label style={labelStyle}>Nombre</label><input required style={inputStyle} value={form.name} placeholder="Tu nombre" onChange={e => setForm({ ...form, name: e.target.value })} onFocus={e => e.target.style.borderColor = ACCENT} onBlur={e => e.target.style.borderColor = BORDER} /></div>
            <div><label style={labelStyle}>Email</label><input required type="email" style={inputStyle} value={form.email} placeholder="tu@email.com" onChange={e => setForm({ ...form, email: e.target.value })} onFocus={e => e.target.style.borderColor = ACCENT} onBlur={e => e.target.style.borderColor = BORDER} /></div>
          </div>
          <div>
            <label style={labelStyle}>Servicio</label>
            <select style={{ ...inputStyle, appearance: "none" }} value={form.service} onChange={e => setForm({ ...form, service: e.target.value })} onFocus={e => e.target.style.borderColor = ACCENT} onBlur={e => e.target.style.borderColor = BORDER}>
              {CATALOG.map(s => <option key={s.id} value={s.id} style={{ background: BG }}>{s.name} — {s.price} MXN</option>)}
            </select>
          </div>
          <div><label style={labelStyle}>Tu reto principal</label><textarea required rows={5} style={{ ...inputStyle, resize: "vertical" }} value={form.message} placeholder="Cuéntanos en qué estás trabajando..." onChange={e => setForm({ ...form, message: e.target.value })} onFocus={e => e.target.style.borderColor = ACCENT} onBlur={e => e.target.style.borderColor = BORDER} /></div>
          
          {error && <div style={{ color: "#EF4444", fontSize: 13, fontWeight: 600 }}>Hubo un error al enviar. Por favor intenta de nuevo.</div>}
          
          <button type="submit" disabled={loading} style={{ background: loading ? "rgba(6,182,212,0.4)" : ACCENT, color: "#000", border: "none", padding: 18, fontWeight: 800, fontSize: 13, letterSpacing: "0.12em", textTransform: "uppercase", cursor: loading ? "wait" : "pointer", fontFamily: "inherit", clipPath: "polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,10px 100%,0 calc(100% - 10px))" }}>
            {loading ? "Enviando..." : "Enviar Solicitud →"}
          </button>
          {sent && <div style={{ padding: "16px 20px", background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.25)", color: "#34D399", fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", gap: 10 }}>✓ Mensaje recibido. Te contactamos pronto.</div>}
        </form>
      </div>
    </div>
  );
}

// ── APP RAÍZ ───────────────────────────────────────────────────────────────

export default function App() {
  const [page, setPage] = useState("inicio");

  const nav = (p) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const PAGES = [
    { id: "inicio", label: "Inicio" },
    { id: "catalogo", label: "Catálogo" },
    { id: "casos", label: "Casos" },
    { id: "agencia", label: "Agencia" },
    { id: "contacto", label: "Contacto" },
  ];

  return (
    <>
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: "rgba(7,11,16,0.92)", backdropFilter: "blur(16px)", borderBottom: `1px solid ${BORDER}`, height: 64, display: "flex", alignItems: "center", padding: "0 5vw", justifyContent: "space-between" }}>
        <button onClick={() => nav("inicio")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 22, color: "#fff", letterSpacing: "0.04em", textTransform: "uppercase" }}>
          <span style={{ background: ACCENT, color: "#000", padding: "2px 8px", clipPath: "polygon(0 0,calc(100% - 6px) 0,100% 6px,100% 100%,6px 100%,0 calc(100% - 6px))", fontSize: 14, fontWeight: 900 }}>R</span>
          IDERS MEDIA
        </button>
        <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
          {PAGES.map(p => (
            <button key={p.id} onClick={() => nav(p.id)} style={{ background: "none", border: "none", cursor: "pointer", color: page === p.id ? ACCENT : MUTED, fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", padding: "4px 0", borderBottom: page === p.id ? `2px solid ${ACCENT}` : "2px solid transparent", transition: "color 0.2s" }}>
              {p.label}
            </button>
          ))}
        </div>
        <button onClick={() => nav("contacto")} style={{ background: ACCENT, color: "#000", border: "none", padding: "9px 20px", fontWeight: 800, fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", cursor: "pointer", clipPath: "polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,8px 100%,0 calc(100% - 8px))" }}>
          Cotizar
        </button>
      </nav>

      <main style={{ paddingTop: 64 }}>
        {page === "inicio" && <HomeView nav={nav} />}
        {page === "catalogo" && <CatalogView nav={nav} />}
        {page === "casos" && <CasesView />}
        {page === "agencia" && <AboutView />}
        {page === "contacto" && <ContactView />}
      </main>

      <footer style={{ borderTop: `1px solid ${BORDER}`, padding: "48px 5vw", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 24 }}>
        <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 18, letterSpacing: "0.04em", textTransform: "uppercase" }}>
          <span style={{ background: ACCENT, color: "#000", padding: "1px 6px", fontSize: 12, fontWeight: 900, marginRight: 4, clipPath: "polygon(0 0,calc(100% - 4px) 0,100% 4px,100% 100%,4px 100%,0 calc(100% - 4px))" }}>R</span>
          IDERS MEDIA
        </div>
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
          {PAGES.map(p => (
            <button key={p.id} onClick={() => nav(p.id)} style={{ background: "none", border: "none", color: MUTED, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer" }}
              onMouseEnter={e => e.target.style.color = ACCENT} onMouseLeave={e => e.target.style.color = MUTED}>
              {p.label}
            </button>
          ))}
        </div>
        <div style={{ fontSize: 11, color: MUTED }}>© {new Date().getFullYear()} Riders Media. Puebla, MX.</div>
      </footer>
    </>
  );
}