import React from "react";
import { COLORS } from "../data";

// Path de la "R" con flecha (glifo del isotipo, sin el cuadro).
// Reutilizado por LogoIcon y por BrandWatermark.
export const LOGO_R_PATH = "M807.56,539.99h-52.57c-40.5,0-73.34-32.84-73.34-73.34v-52.65c0-21.19-17.18-38.38-38.38-38.38h-201.35l365.64,365.64-89.03,89.02-320.18-320.17v194.27c0,34.75-14.08,66.23-36.88,89.02-22.79,22.8-54.27,36.88-89.03,36.88V249.72h405.8c71.42,0,129.32,57.89,129.32,129.31v160.96Z";

// Logo bicolor: `square` = color del cuadro, `mark` = color de la "R" (combinaciones aprobadas).
// Por defecto: cuadro ámbar + "R" cream (lockup oficial). El isotipo ES la "R":
// junto al texto "IDERS MEDIA" se lee visualmente RIDERS MEDIA.
export function LogoIcon({ size = 32, square = COLORS.RIDERS, mark = COLORS.BG }) {
  return (
    <svg width={size} height={size} viewBox="0 0 1080 1080" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="0" y="0" width="1080" height="1080" rx="292.89" ry="292.89" fill={mark} />
      <path fill={square} d={`M787.11,0h-494.22C131.13,0,0,131.13,0,292.89v494.22c0,161.76,131.13,292.89,292.89,292.89h494.22c161.76,0,292.89-131.13,292.89-292.89v-494.22C1080,131.13,948.87,0,787.11,0Z${LOGO_R_PATH}`} />
    </svg>
  );
}
