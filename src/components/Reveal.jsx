import React, { useState, useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

// ── REVEAL: aparece al hacer scroll (fade + translate + blur) ─────────────
// group=true → escalona los hijos directos (clase .reveal-group en index.css)
export function Reveal({ children, group = false, as: Tag = "div", style, className = "" }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-visible");
          io.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Tag ref={ref} className={`${group ? "reveal-group" : "reveal"} ${className}`.trim()} style={style}>
      {children}
    </Tag>
  );
}

// ── COUNTER: anima un número al entrar en viewport ───────────────────────
export function Counter({ value, duration = 1400, style, className }) {
  const ref = useRef(null);
  const reduced = usePrefersReducedMotion();
  const match = String(value).match(/^(\d[\d.,]*)(.*)$/);
  const suffix = match ? match[2] : "";
  const target = match ? parseFloat(match[1].replace(/,/g, "")) : null;
  const [display, setDisplay] = useState(target !== null ? `0${suffix}` : value);

  useEffect(() => {
    if (target === null) { setDisplay(value); return; }
    const finalText = `${match[1]}${suffix}`;
    if (reduced) { setDisplay(finalText); return; }
    const el = ref.current;
    if (!el) return;
    let raf, fallback, started = false;
    const finish = () => setDisplay(finalText);
    const run = () => {
      setDisplay(`0${suffix}`);
      const t0 = performance.now();
      const tick = (now) => {
        const p = Math.min(1, (now - t0) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        setDisplay(`${Math.round(target * eased)}${suffix}`);
        if (p < 1) raf = requestAnimationFrame(tick);
        else finish();
      };
      raf = requestAnimationFrame(tick);
      // Garantiza el valor final aunque rAF se pause (p. ej. pestaña en segundo plano)
      fallback = setTimeout(finish, duration + 600);
    };
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started) {
        started = true;
        if (document.hidden) finish(); else run();
        io.disconnect();
      }
    }, { threshold: 0.25 });
    io.observe(el);
    return () => { io.disconnect(); if (raf) cancelAnimationFrame(raf); if (fallback) clearTimeout(fallback); };
  }, [value, duration, reduced]); // eslint-disable-line

  return <span ref={ref} className={className} style={style}>{display}</span>;
}
