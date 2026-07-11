import React from "react";

// ── ÍCONOS SVG (trazo consistente, heredan color) ────────────────────────
const svgBase = { fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" };

export function IconBolt({ size = 22 })   { return <svg width={size} height={size} viewBox="0 0 24 24" {...svgBase} aria-hidden="true"><path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z" /></svg>; }
export function IconTarget({ size = 22 }) { return <svg width={size} height={size} viewBox="0 0 24 24" {...svgBase} aria-hidden="true"><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none" /></svg>; }
export function IconShield({ size = 22 }) { return <svg width={size} height={size} viewBox="0 0 24 24" {...svgBase} aria-hidden="true"><path d="M12 3l7 3v5c0 4.6-3 7.8-7 9-4-1.2-7-4.4-7-9V6l7-3z" /><path d="M9 12l2 2 4-4" /></svg>; }
export function IconSpark({ size = 24 })  { return <svg width={size} height={size} viewBox="0 0 24 24" {...svgBase} aria-hidden="true"><path d="M12 2l2.3 6.9L21 11l-6.7 2.1L12 20l-2.3-6.9L3 11l6.7-2.1L12 2z" /></svg>; }
export function IconMenu({ size = 26 })   { return <svg width={size} height={size} viewBox="0 0 24 24" {...svgBase} aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16" /></svg>; }
export function IconClose({ size = 26 })  { return <svg width={size} height={size} viewBox="0 0 24 24" {...svgBase} aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>; }
export function IconPlus({ size = 26 })   { return <svg width={size} height={size} viewBox="0 0 24 24" {...svgBase} aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>; }
export function IconCheck({ size = 18 })  { return <svg width={size} height={size} viewBox="0 0 24 24" {...svgBase} aria-hidden="true"><path d="M4 12.5l5 5L20 7" /></svg>; }
export function IconAlert({ size = 18 })  { return <svg width={size} height={size} viewBox="0 0 24 24" {...svgBase} aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 7.5v5.5" /><path d="M12 16.5h.01" /></svg>; }
export function IconInfo({ size = 18 })   { return <svg width={size} height={size} viewBox="0 0 24 24" {...svgBase} aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 11v5" /><path d="M12 7.5h.01" /></svg>; }
