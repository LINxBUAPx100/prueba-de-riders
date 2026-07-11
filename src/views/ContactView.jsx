import React, { useState, useEffect } from "react";
import emailjs from "@emailjs/browser";
import { COLORS, RADIUS, CATALOG, CATALOGO_CSV_URL, NAVY_BG } from "../data";
import { useSheetData } from "../hooks/useSheetData";
import { mapServiceRows } from "../sheetMappers";
import { normalize } from "../utils";
import { Reveal } from "../components/Reveal";
import { Btn } from "../components/Btn";
import { SectionLabel } from "../components/ui";
import { LogoIcon } from "../components/LogoIcon";
import { IconCheck, IconAlert, IconInfo } from "../components/icons";

const { INK, ACCENT } = COLORS;

// ── CONTACTO — panel de datos + formulario sobre navy sólido ────────────
export default function ContactView({ isMobile, initialService }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", service: "", message: "" });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const { data: servicesList } = useSheetData(CATALOGO_CSV_URL, { mapRows: mapServiceRows, fallback: CATALOG });

  useEffect(() => {
    // Resuelve el id a preseleccionar emparejando initialService (un NOMBRE) por nombre normalizado.
    if (!servicesList || servicesList.length === 0) return;
    setForm(prev => {
      let id = servicesList[0].id;
      if (initialService) {
        const match = servicesList.find(s => normalize(s.name) === normalize(initialService));
        if (match) id = match.id;
      }
      return { ...prev, service: id };
    });
  }, [servicesList, initialService]);

  const handle = (e) => {
    e.preventDefault();
    // Honeypot antispam: los bots rellenan el campo oculto; un humano nunca lo ve
    if (honeypot) return;
    setLoading(true);
    setError(false);
    const selectedService = servicesList.find(s => s.id === form.service);
    const serviceName = selectedService
      ? `${selectedService.name} (${selectedService.price.includes('$') ? selectedService.price : '$' + selectedService.price} MXN)`
      : form.service;
    const templateParams = { name: form.name, email: form.email, service_requested: serviceName, message: form.message, phone: form.phone };
    emailjs.send("service_ko9wm6r", "template_p02dor7", templateParams, "1b2HC5hu9s5FV_mHd")
      .then(() => {
        setLoading(false); setSent(true);
        setForm({ name: "", email: "", phone: "", service: servicesList.length > 0 ? servicesList[0].id : "", message: "" });
        setTimeout(() => setSent(false), 6000);
      }, () => { setLoading(false); setError(true); });

    const waNumber = "522202256586";
    const waMessage = `¡Hola! Me interesa solicitar una cotización.\n\n*Mis datos:*\n 👋🏼 Nombre: ${form.name}\n 📬 Email: ${form.email}\n 🤳🏼 Teléfono: ${form.phone}\n 📦 Servicio: ${serviceName}\n\n*Mi mensaje:*\n${form.message}`;
    window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(waMessage)}`, "_blank");
  };

  // Inputs sobre fondo oscuro
  const inputStyle = {
    width: "100%", background: "rgba(255,255,255,0.06)", border: "1.5px solid rgba(255,255,255,0.15)",
    padding: "14px 18px", borderRadius: RADIUS.control, color: "#fff", fontSize: 15,
    outline: "none", boxSizing: "border-box", transition: "border-color 0.2s, box-shadow 0.2s", fontFamily: "inherit"
  };
  const onFocusInput = e => { e.currentTarget.style.borderColor = ACCENT; e.currentTarget.style.boxShadow = `0 0 0 3px ${ACCENT}30`; };
  const onBlurInput  = e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; e.currentTarget.style.boxShadow = "none"; };
  const labelStyle = { fontSize: 11, fontWeight: 900, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.75)", display: "block", marginBottom: 9 };

  return (
    <div style={{ padding: "120px 6vw", background: NAVY_BG }}>
      <style>{`
        @keyframes pulseContactDot { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:0.5; transform:scale(0.8); } }
        .contact-dot { animation: pulseContactDot 2s ease-in-out infinite; }
        .contact-form input::placeholder, .contact-form textarea::placeholder { color: rgba(255,255,255,0.38); }
      `}</style>

      <div style={{ maxWidth: 1100, margin: "0 auto" }}>

        <Reveal><SectionLabel dark>Contacto</SectionLabel></Reveal>
        <Reveal as="h1" className="font-display" style={{ fontSize: "clamp(48px, 6vw, 80px)", fontWeight: 800, textTransform: "uppercase", color: "#fff", lineHeight: 0.95, marginBottom: 56, letterSpacing: "-0.02em" }}>
          Hablemos <span style={{ color: ACCENT }}>Hoy.</span>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1.7fr", gap: "24px", alignItems: "start" }}>

          {/* ── Panel izquierdo ── */}
          <div style={{
            background: `linear-gradient(150deg, #183457 0%, #11293f 55%, #0a1c2e 100%)`,
            padding: "44px 36px", borderRadius: RADIUS.control,
            display: "flex", flexDirection: "column", justifyContent: "space-between",
            position: "relative", overflow: "hidden",
            border: "1px solid rgba(255,255,255,0.08)",
            minHeight: isMobile ? "auto" : "580px"
          }}>
            <div aria-hidden="true" style={{ position: "absolute", bottom: -70, right: -70, width: 220, height: 220, borderRadius: "50%", background: `${ACCENT}12`, pointerEvents: "none" }} />

            <div style={{ position: "relative", zIndex: 1 }}>
              <div role="img" aria-label="Riders Media" style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 36 }}>
                <LogoIcon size={26} />
                <span aria-hidden="true" className="font-display" style={{ fontWeight: 700, fontSize: 17, color: "#ffffff", letterSpacing: "0.05em" }}>IDERS MEDIA</span>
              </div>

              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", padding: "8px 14px", borderRadius: RADIUS.pill, marginBottom: 28 }}>
                <div className="contact-dot" style={{ width: 7, height: 7, borderRadius: "50%", background: ACCENT }} />
                <span style={{ fontSize: 10, fontWeight: 800, color: "rgba(255,255,255,0.65)", letterSpacing: "0.1em", textTransform: "uppercase" }}>Respuesta en menos de 24h</span>
              </div>

              <p style={{ color: "rgba(255,255,255,0.66)", fontSize: 15, lineHeight: 1.75, marginBottom: 44 }}>
                Sin filtros, sin juntas innecesarias.<br />
                Directo al punto y a la estrategia de tu negocio.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
                {[
                  { label: "Email",    val: "contacto@riders.media", href: "mailto:contacto@riders.media" },
                  { label: "WhatsApp", val: "+52 220 225 6586",      href: "https://wa.me/522202256586?text=Quiero%20cotizar%20con%20ustedes%21" },
                  { label: "Ciudad",   val: "Puebla, MX" }
                ].map(c => (
                  <div key={c.label}>
                    <div style={{ fontSize: 10, fontWeight: 900, letterSpacing: "0.2em", textTransform: "uppercase", color: ACCENT, marginBottom: 6 }}>{c.label}</div>
                    <div style={{ fontSize: 15, color: "#ffffff", fontWeight: 600 }}>
                      {c.href
                        ? <a href={c.href} target="_blank" rel="noopener noreferrer" style={{ color: "inherit", textDecoration: "none", transition: "color 0.2s" }} onMouseEnter={e => e.currentTarget.style.color = ACCENT} onMouseLeave={e => e.currentTarget.style.color = "#ffffff"}>{c.val}</a>
                        : c.val}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ position: "relative", zIndex: 1, marginTop: 44, paddingTop: 28, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
              <div style={{ fontSize: 9, fontWeight: 800, color: "rgba(255,255,255,0.58)", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 14 }}>Síguenos</div>
              <div style={{ display: "flex", gap: 10 }}>
                {[
                  { name: "IG", label: "Instagram", color: "#E4405F", url: "https://www.instagram.com/riders_media.mk/" },
                  { name: "FB", label: "Facebook",  color: "#1877F2", url: "https://www.facebook.com/profile.php?id=61579283677547" },
                  { name: "WA", label: "WhatsApp",  color: "#25D366", url: "https://wa.me/522202256586?text=Quiero%20cotizar%20con%20ustedes%21" },
                  { name: "TL", label: "Telegram",  color: "#0088cc", url: "https://t.me/Ridersmedia?text=Quiero%20cotizar%20con%20ustedes%21" },
                ].map(link => (
                  <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer" aria-label={link.label}
                    style={{ width: 40, height: 40, borderRadius: RADIUS.control, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none", fontSize: 11, fontWeight: 900, transition: "all 0.2s" }}
                    onMouseEnter={e => { e.currentTarget.style.background = link.color; e.currentTarget.style.borderColor = link.color; e.currentTarget.style.color = "#ffffff"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "rgba(255,255,255,0.5)"; e.currentTarget.style.transform = "translateY(0)"; }}
                  >{link.name}</a>
                ))}
              </div>
            </div>
          </div>

          {/* ── Formulario (panel navy sólido, sin glassmorphism) ── */}
          <form className="contact-form" onSubmit={handle} style={{
            padding: isMobile ? "36px 24px" : "48px 44px",
            borderRadius: RADIUS.control,
            background: "#11293f",
            border: "1px solid rgba(255,255,255,0.10)",
            display: "flex", flexDirection: "column", gap: 22,
            position: "relative"
          }}>

            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 20 }}>
              <div>
                <label style={labelStyle}>Nombre</label>
                <input required style={inputStyle} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Shaiel Saucedo" autoComplete="name" onFocus={onFocusInput} onBlur={onBlurInput} />
              </div>
              <div>
                <label style={labelStyle}>Email</label>
                <input required type="email" style={inputStyle} value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="Micorreo@Gmail.com" autoComplete="email" onFocus={onFocusInput} onBlur={onBlurInput} />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Teléfono</label>
              <input required type="tel" style={inputStyle} value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+52 1 234 567 8910" autoComplete="tel" onFocus={onFocusInput} onBlur={onBlurInput} />
            </div>

            <div>
              <label style={labelStyle}>Servicio de interés</label>
              <select
                style={{
                  ...inputStyle, cursor: "pointer", appearance: "none", WebkitAppearance: "none",
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 10 10'%3E%3Cpath fill='%23AAB4C2' d='M5 7L0 2h10z'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat", backgroundPosition: "right 18px center", paddingRight: "44px"
                }}
                value={form.service}
                onChange={e => setForm({ ...form, service: e.target.value })}
                onFocus={onFocusInput} onBlur={onBlurInput}
              >
                {servicesList.map(s => {
                  const formattedPrice = s.price.toString().includes('$') ? s.price : `$${s.price}`;
                  return (
                    <option key={s.id} value={s.id} style={{ background: INK, color: "#fff" }}>
                      {s.name} — {formattedPrice} MXN
                    </option>
                  );
                })}
              </select>
            </div>

            <div>
              <label style={labelStyle}>Mensaje</label>
              <textarea required rows={4} style={{ ...inputStyle, resize: "vertical" }} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="Cuéntame sobre tu proyecto, ¿qué necesitas?" onFocus={onFocusInput} onBlur={onBlurInput} />
            </div>

            {/* Honeypot antispam: invisible para humanos, los bots lo rellenan */}
            <input
              type="text" name="empresa_sitio_web" tabIndex={-1} autoComplete="off" aria-hidden="true"
              value={honeypot} onChange={e => setHoneypot(e.target.value)}
              style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
            />

            <div style={{ display: "flex", gap: 12, alignItems: "flex-start", background: `${ACCENT}1f`, border: `1px solid ${ACCENT}45`, padding: "14px 16px", borderRadius: RADIUS.control }}>
              <span style={{ flexShrink: 0, color: ACCENT, display: "flex", marginTop: 1 }}><IconInfo /></span>
              <p style={{ color: "rgba(255,255,255,0.72)", fontSize: 12, lineHeight: 1.65, margin: 0 }}>
                Al enviar se abrirá un chat de WhatsApp con tu información prellenada para continuar la conversación directamente con el equipo.
              </p>
            </div>

            <Btn type="submit" variant="primary" full disabled={loading} style={{ cursor: loading ? "wait" : "pointer" }}>
              {loading ? "Procesando..." : "Enviar y Chatear por WhatsApp →"}
            </Btn>

            {sent && (
              <div role="alert" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, color: "#f8b42c", fontWeight: 800, textAlign: "center", padding: 12, background: "rgba(245,163,19,0.16)", border: "1px solid rgba(245,163,19,0.40)", borderRadius: RADIUS.control }}>
                <IconCheck /> Solicitud enviada correctamente.
              </div>
            )}
            {error && (
              <div role="alert" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, color: "#ff8d8f", fontWeight: 800, textAlign: "center", padding: 12, background: "rgba(255,77,79,0.14)", border: "1px solid rgba(255,141,143,0.4)", borderRadius: RADIUS.control }}>
                <IconAlert /> Hubo un error al enviar el correo, pero el chat debería abrirse.
              </div>
            )}
          </form>

        </div>
      </div>
    </div>
  );
}
