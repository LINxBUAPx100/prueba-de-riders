import React, { useState } from "react";
import { COLORS } from "../data";
import { IconPlus } from "./icons";

const { INK, INK2 } = COLORS;

// ── BOTÓN FLOTANTE DE REDES SOCIALES ─────────────────────────────────────
export function SocialFloat({ isMobile }) {
  const [isOpen, setIsOpen] = useState(false);

  const socialLinks = [
    { name: "TL", label: "Telegram",  color: "#0088cc", url: "https://t.me/Ridersmedia?text=Quiero%20cotizar%20con%20ustedes%21" },
    { name: "FB", label: "Facebook",  color: "#1877F2", url: "https://www.facebook.com/profile.php?id=61579283677547" },
    { name: "IG", label: "Instagram", color: "#E4405F", url: "https://www.instagram.com/riders_media.mk/" },
    { name: "WA", label: "WhatsApp",  color: "#25D366", url: "https://wa.me/522202256586?text=Quiero%20cotizar%20con%20ustedes%21" },
  ];

  const btnSize = isMobile ? "44px" : "54px";
  const btnFont = isMobile ? "12px" : "14px";
  const position = isMobile ? "15px" : "30px";

  return (
    <div style={{ position: "fixed", bottom: position, right: position, display: "flex", flexDirection: "column-reverse", alignItems: "center", gap: "10px", zIndex: 2000 }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Cerrar redes sociales" : "Abrir redes sociales"}
        aria-expanded={isOpen}
        style={{
          width: btnSize, height: btnSize, borderRadius: "50%",
          background: isOpen ? INK2 : INK, color: "#fff", border: "none",
          cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: `0 8px 22px ${INK}55`, zIndex: 2001,
          transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
          transform: isOpen ? "rotate(135deg)" : "rotate(0deg)"
        }}
      >
        <IconPlus />
      </button>

      {socialLinks.map((link, index) => (
        <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer" aria-label={link.label}
          style={{
            width: btnSize, height: btnSize, borderRadius: "50%", background: link.color, color: "#fff",
            display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none",
            fontWeight: 900, fontSize: btnFont, boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
            opacity: isOpen ? 1 : 0, visibility: isOpen ? "visible" : "hidden", pointerEvents: isOpen ? "auto" : "none",
            transform: isOpen ? "translateY(0) scale(1)" : `translateY(${(index + 1) * 15}px) scale(0.5)`,
            transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
            transitionDelay: isOpen ? `${index * 0.05}s` : "0s",
          }}
          onMouseEnter={e => e.currentTarget.style.filter = "brightness(1.1)"}
          onMouseLeave={e => e.currentTarget.style.filter = "brightness(1)"}
        >
          {link.name}
        </a>
      ))}
    </div>
  );
}
