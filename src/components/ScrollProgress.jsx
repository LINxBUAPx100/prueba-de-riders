import React, { useEffect, useRef } from "react";

// ── BARRA DE PROGRESO DE SCROLL (top) ────────────────────────────────────
export function ScrollProgress() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = null;
    const update = () => {
      raf = null;
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      el.style.width = `${max > 0 ? (h.scrollTop / max) * 100 : 0}%`;
    };
    const onScroll = () => { if (raf == null) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
  return <div ref={ref} className="scroll-progress" />;
}
