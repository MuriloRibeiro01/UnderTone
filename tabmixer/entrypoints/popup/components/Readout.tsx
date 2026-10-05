import { pad3 } from "./format";

export interface ReadoutProps {
  value: number;
  muted?: boolean;
}

export function Readout({ value, muted = false }: ReadoutProps) {
  if (muted) return <output className="li-readout is-muted">OFF</output>;
  return (
    <output className="li-readout">
      {pad3(value)}
      <span className="li-readout-unit">%</span>
    </output>
  );
}
