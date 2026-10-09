// entrypoints/popup/App.tsx
import { useCallback, useEffect, useRef, useState } from "react";
import { Popup, type PopupTab } from "./components/Popup";
import {
  MASTER_KEY,
  PAUSED_BY_ALL_KEY,
  URL_PATTERNS,
  type ChannelState,
  type MasterState,
  type Message,
} from "@/utils/mixer";

type ChannelTab = PopupTab & { id: number; volume: number; muted: boolean };

function getVideoId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.pathname.startsWith("/shorts/")) return u.pathname.split("/")[2] ?? null;
    return u.searchParams.get("v");
  } catch {
    return null;
  }
}

function getSource(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

async function send(tabId: number, message: Message): Promise<ChannelState | null> {
  try {
    return await browser.tabs.sendMessage(tabId, message);
  } catch {
    return null; // content script ausente (aba aberta antes da extensão, por exemplo)
  }
}

export default function App() {
  const [tabs, setTabs] = useState<ChannelTab[]>([]);
  const [master, setMaster] = useState<MasterState>({ volume: 100, muted: false });
  // Ordem de chegada das abas: o número do canal é a posição e não muda a cada atualização.
  const order = useRef<number[]>([]);

  const refresh = useCallback(async () => {
    const found = await browser.tabs.query({ url: URL_PATTERNS });
    const fresh = await Promise.all(
      found
        .filter((t) => t.id !== undefined)
        .map(async (t): Promise<ChannelTab | null> => {
          const state = await send(t.id!, { type: "GET_STATE" });
          if (!state) return null; // aba sem player (ou ainda carregando): não é um canal
          const videoId = t.url ? getVideoId(t.url) : null;
          return {
            id: t.id!,
            title: (t.title ?? "YouTube").replace(/ - YouTube$/, ""),
            source: t.url ? getSource(t.url) : "",
            thumbnail: videoId
              ? `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`
              : t.favIconUrl,
            playing: !state.paused,
            volume: state.volume,
            muted: state.muted,
          };
        })
    );
    const channels = fresh.filter((c): c is ChannelTab => c !== null);

    const ids = channels.map((c) => c.id);
    order.current = [
      ...order.current.filter((id) => ids.includes(id)),
      ...ids.filter((id) => !order.current.includes(id)),
    ];
    channels.sort((a, b) => order.current.indexOf(a.id) - order.current.indexOf(b.id));

    // Preserva o volume local para o fader não "pular" enquanto você arrasta.
    setTabs((prev) =>
      channels.map((c) => {
        const old = prev.find((p) => p.id === c.id);
        return old ? { ...c, volume: old.volume } : c;
      })
    );
  }, []);

  useEffect(() => {
    void browser.storage.local.get(MASTER_KEY).then((res) => {
      if (res[MASTER_KEY]) setMaster(res[MASTER_KEY] as MasterState);
    });
    void refresh();
    const timer = setInterval(refresh, 1000);
    return () => clearInterval(timer);
  }, [refresh]);

  const patch = (id: number, p: Partial<ChannelTab>) =>
    setTabs((prev) => prev.map((t) => (t.id === id ? { ...t, ...p } : t)));

  const updateMaster = (p: Partial<MasterState>) => {
    const next = { ...master, ...p };
    setMaster(next);
    void browser.storage.local.set({ [MASTER_KEY]: next });
  };

  const setPlaying = (id: number, playing: boolean) => {
    patch(id, { playing });
    void send(id, { type: "SET_PAUSED", value: !playing });
  };

  const pauseAll = () => {
    const paused = tabs.filter((t) => t.playing).map((t) => t.id);
    paused.forEach((id) => setPlaying(id, false));
    void browser.storage.local.set({ [PAUSED_BY_ALL_KEY]: paused });
  };

  // "Retomar" dá play só nas abas pausadas pelo "Pausar tudo"; sem esse registro, em todas.
  const playAll = async () => {
    const res = await browser.storage.local.get(PAUSED_BY_ALL_KEY);
    const remembered = (res[PAUSED_BY_ALL_KEY] as number[] | undefined) ?? [];
    const targets = tabs.filter((t) => remembered.includes(t.id));
    (targets.length > 0 ? targets : tabs).forEach((t) => setPlaying(t.id, true));
    void browser.storage.local.remove(PAUSED_BY_ALL_KEY);
  };

  const byId = (id: PopupTab["id"]) => tabs.find((t) => t.id === id);

  return (
    <Popup
      tabs={tabs}
      masterVolume={master.volume}
      masterMuted={master.muted}
      onMasterVolume={(volume) => updateMaster({ volume })}
      onMasterToggleMute={() => updateMaster({ muted: !master.muted })}
      onPauseAll={pauseAll}
      onPlayAll={() => void playAll()}
      onTogglePlay={(id) => {
        const t = byId(id);
        if (t) setPlaying(t.id, !t.playing);
      }}
      onVolume={(id, volume) => {
        patch(id as number, { volume });
        void send(id as number, { type: "SET_VOLUME", value: volume });
      }}
      onToggleMute={(id) => {
        const t = byId(id);
        if (!t) return;
        patch(t.id, { muted: !t.muted });
        void send(t.id, { type: "SET_MUTED", value: !t.muted });
      }}
    />
  );
}
