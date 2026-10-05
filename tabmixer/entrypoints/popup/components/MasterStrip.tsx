import { Fader } from "./Fader";
import { Readout } from "./Readout";
import { TransportButton } from "./TransportButton";
import { pad2 } from "./format";

export interface MasterStripProps {
  volume: number;
  muted?: boolean;
  playingCount: number;
  totalCount: number;
  onVolume?: (value: number) => void;
  onToggleMute?: () => void;
  onPauseAll?: () => void;
  onPlayAll?: () => void;
}

export function MasterStrip({
  volume,
  muted = false,
  playingCount,
  totalCount,
  onVolume,
  onToggleMute,
  onPauseAll,
  onPlayAll,
}: MasterStripProps) {
  return (
    <header className="li-master">
      <div className="li-master-top">
        <span className="li-wordmark">
          <i aria-hidden="true" />
          LockIn
        </span>
        <span className="li-count">
          {pad2(playingCount)}/{pad2(totalCount)} tocando
        </span>
        {playingCount > 0 ? (
          <TransportButton variant="primary" icon="pause" label="Pausar todas as abas" onClick={onPauseAll}>
            Pausar tudo
          </TransportButton>
        ) : (
          <TransportButton icon="play" label="Retomar todas as abas" onClick={onPlayAll} disabled={totalCount === 0}>
            Retomar
          </TransportButton>
        )}
      </div>
      <div className="li-master-row">
        <span className="li-label">Master</span>
        <TransportButton
          icon={muted ? "muted" : "volume"}
          variant="ghost"
          active={muted}
          label={muted ? "Ativar som geral" : "Silenciar tudo"}
          onClick={onToggleMute}
        />
        <Fader size="lg" value={volume} muted={muted} label="Volume master" onChange={onVolume} />
        <Readout value={volume} muted={muted} />
      </div>
    </header>
  );
}
