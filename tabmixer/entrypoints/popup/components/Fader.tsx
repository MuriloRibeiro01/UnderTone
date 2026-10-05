import type { CSSProperties } from "react";
import { clamp, cx } from "./format";

export interface FaderProps {
  /** 0–100 */
  value: number;
  onChange?: (value: number) => void;
  size?: "md" | "lg";
  muted?: boolean;
  disabled?: boolean;
  label?: string;
}

export function Fader({ value, onChange, size = "md", muted = false, disabled = false, label = "Volume" }: FaderProps) {
  const v = clamp(value);
  return (
    <div
      className={cx("li-fader", size === "lg" && "li-fader-lg", muted && "is-muted")}
      style={{ "--val": `${v}%` } as CSSProperties}
    >
      <div className="li-fader-track" aria-hidden="true">
        <div className="li-fader-fill" />
      </div>
      <input
        type="range"
        min={0}
        max={100}
        step={1}
        value={v}
        aria-label={label}
        aria-valuetext={muted ? "mudo" : `${v}%`}
        disabled={disabled}
        onChange={(e) => onChange?.(Number(e.target.value))}
      />
    </div>
  );
}
