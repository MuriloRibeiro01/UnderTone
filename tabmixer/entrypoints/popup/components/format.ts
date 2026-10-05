export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export function clamp(v: number): number {
  const n = Number(v);
  return Number.isNaN(n) ? 0 : Math.max(0, Math.min(100, Math.round(n)));
}

/** Três dígitos com zero à esquerda: 90 → "090". */
export function pad3(v: number): string {
  return String(clamp(v)).padStart(3, "0");
}

/** Dois dígitos com zero à esquerda: 3 → "03". */
export function pad2(v: number): string {
  return pad3(v).slice(1);
}
