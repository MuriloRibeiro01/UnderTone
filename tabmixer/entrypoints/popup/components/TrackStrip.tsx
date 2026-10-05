import { ActivityMeter } from "./ActivityMeter";
import { Fader } from "./Fader";
import { Readout } from "./Readout";
import { TransportButton } from "./TransportButton";
import { cx, pad2 } from "./format";

export interface TrackStripProps {
  /** Número do canal (1, 2, 3…), mostrado como 01. */
  index?: number;
  title: string;
  /** Domínio da aba, ex. "youtube.com". */
  source?: string;
  /** URL da miniatura (thumbnail do vídeo ou favicon grande). */
  thumbnail?: string;
  playing: boolean;
  volume: number;
  muted?: boolean;
  onTogglePlay?: () => void;
  onVolume?: (value: number) => void;
  onToggleMute?: () => void;
}

function initials(src?: string): string {
  const parts = String(src ?? "").split(".").filter(Boolean);
  const name = (parts.length > 1 ? parts[parts.length - 2] : parts[0]) || "·";
  return name.charAt(0).toUpperCase();
}

export function TrackStrip({
  index,
  title,
  source,
  thumbnail,
  playing,
  volume,
  muted = false,
  onTogglePlay,
  onVolume,
  onToggleMute,
}: TrackStripProps) {
  return (
    <div className={cx("li-strip", playing ? "is-playing" : "is-paused")}>
      <div className="li-thumb">
        {thumbnail ? (
          <img src={thumbnail} alt="" />
        ) : (
          <span className="li-thumb-fallback">{initials(source)}</span>
        )}
        {index != null && <span className="li-thumb-ch">{pad2(index)}</span>}
      </div>
      <div className="li-strip-main">
        <div className="li-strip-head">
          <ActivityMeter playing={playing && !muted} />
          <span className="li-strip-title" title={title}>
            {title}
          </span>
        </div>
        {source && <div className="li-strip-src">{source}</div>}
        <div className="li-strip-ctrl">
          <TransportButton
            icon={playing ? "pause" : "play"}
            label={playing ? "Pausar" : "Tocar"}
            onClick={onTogglePlay}
          />
          <Fader
            value={volume}
            muted={muted}
            label={`Volume de ${title || "aba"}`}
            onChange={onVolume}
          />
          <Readout value={volume} muted={muted} />
          <TransportButton
            icon={muted ? "muted" : "volume"}
            size="sm"
            variant="ghost"
            active={muted}
            label={muted ? "Ativar som" : "Silenciar"}
            onClick={onToggleMute}
          />
        </div>
      </div>
    </div>
  );
}
