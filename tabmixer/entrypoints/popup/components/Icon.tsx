import type { JSX } from "react";

export type IconName = "play" | "pause" | "stop" | "volume" | "muted";

const VOL = <path d="M1 4.5H3.5L6.5 2V10L3.5 7.5H1Z" />;

const ICONS: Record<IconName, JSX.Element> = {
  play: <path d="M3 2L10 6L3 10Z" />,
  pause: (
    <>
      <rect x="2.5" y="2" width="2.5" height="8" />
      <rect x="7" y="2" width="2.5" height="8" />
    </>
  ),
  stop: <rect x="2.5" y="2.5" width="7" height="7" />,
  volume: (
    <>
      {VOL}
      <rect x="8" y="4.5" width="1.25" height="3" />
      <rect x="10" y="3" width="1.25" height="6" />
    </>
  ),
  muted: (
    <>
      {VOL}
      <path d="M8 4L11 8M11 4L8 8" fill="none" stroke="currentColor" strokeWidth="1.4" />
    </>
  ),
};

export function Icon({ name, size = 12 }: { name: IconName; size?: number }) {
  return (
    <svg
      className="li-icon"
      width={size}
      height={size}
      viewBox="0 0 12 12"
      fill="currentColor"
      aria-hidden="true"
    >
      {ICONS[name]}
    </svg>
  );
}
