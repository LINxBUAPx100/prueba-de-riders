import { useState, useEffect } from "react";

// ── HOOK RESPONSIVE (DETECTOR DE CELULARES) ──────────────────────────────
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 800);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 800);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return isMobile;
}
