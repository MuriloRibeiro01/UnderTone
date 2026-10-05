import { Icon } from "./Icon";
import { MasterStrip } from "./MasterStrip";
import { TrackStrip, type TrackStripProps } from "./TrackStrip";
import { pad2 } from "./format";

export interface PopupTab
  extends Omit<TrackStripProps, "index" | "onTogglePlay" | "onVolume" | "onToggleMute"> {
  id: number | string;
}

export interface PopupProps {
  tabs: PopupTab[];
  masterVolume: number;
  masterMuted?: boolean;
  emptyText?: string;
  onMasterVolume?: (value: number) => void;
  onMasterToggleMute?: () => void;
  onPauseAll?: () => void;
  onPlayAll?: () => void;
  onTogglePlay?: (id: PopupTab["id"]) => void;
  onVolume?: (id: PopupTab["id"], value: number) => void;
  onToggleMute?: (id: PopupTab["id"]) => void;
}

export function Popup({
  tabs,
  masterVolume,
  masterMuted = false,
  emptyText = "Nenhuma aba tocando áudio agora.",
  onMasterVolume,
  onMasterToggleMute,
  onPauseAll,
  onPlayAll,
  onTogglePlay,
  onVolume,
  onToggleMute,
}: PopupProps) {
  const playing = tabs.filter((t) => t.playing).length;
  return (
    <div className="li-popup">
      <MasterStrip
        volume={masterVolume}
        muted={masterMuted}
        playingCount={playing}
        totalCount={tabs.length}
        onVolume={onMasterVolume}
        onToggleMute={onMasterToggleMute}
        onPauseAll={onPauseAll}
        onPlayAll={onPlayAll}
      />
      <div className="li-section">
        <span>Canais</span>
        <span>{pad2(tabs.length)}</span>
      </div>
      {tabs.length === 0 ? (
        <div className="li-empty">
          <Icon name="stop" size={16} />
          <p>{emptyText}</p>
        </div>
      ) : (
        <div className="li-list">
          {tabs.map(({ id, ...tab }, i) => (
            <TrackStrip
              key={id}
              index={i + 1}
              {...tab}
              onTogglePlay={() => onTogglePlay?.(id)}
              onVolume={(v) => onVolume?.(id, v)}
              onToggleMute={() => onToggleMute?.(id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
