// entrypoints/background.ts
// Recebe as teclas de mídia (toque do fone, teclado, controles do SO) que o navegador
// entregou a uma aba e as transforma em "Pausar tudo" / "Retomar" em todas as abas.

import {
  PAUSED_BY_ALL_KEY,
  URL_PATTERNS,
  type ChannelState,
  type MediaKeyMessage,
  type Message,
} from "@/utils/mixer";

async function send(tabId: number, message: Message): Promise<ChannelState | null> {
  try {
    return await browser.tabs.sendMessage(tabId, message);
  } catch {
    return null; // aba sem content script
  }
}

async function channelIds(): Promise<number[]> {
  const tabs = await browser.tabs.query({ url: URL_PATTERNS });
  return tabs.map((t) => t.id).filter((id): id is number => id !== undefined);
}

async function playingIds(ids: number[]): Promise<number[]> {
  const states = await Promise.all(ids.map((id) => send(id, { type: "GET_STATE" })));
  return ids.filter((_, i) => states[i] && !states[i]!.paused);
}

async function pauseAll(playing: number[]) {
  await Promise.all(playing.map((id) => send(id, { type: "SET_PAUSED", value: true })));
  await browser.storage.local.set({ [PAUSED_BY_ALL_KEY]: playing });
}

// Mesma regra do botão "Retomar": só as abas pausadas pelo "Pausar tudo"; sem registro, todas.
async function playAll(ids: number[]) {
  const res = await browser.storage.local.get(PAUSED_BY_ALL_KEY);
  const remembered = ((res[PAUSED_BY_ALL_KEY] as number[] | undefined) ?? []).filter((id) => ids.includes(id));
  const targets = remembered.length > 0 ? remembered : ids;
  await Promise.all(targets.map((id) => send(id, { type: "SET_PAUSED", value: false })));
  await browser.storage.local.remove(PAUSED_BY_ALL_KEY);
}

// O navegador manda "play" ou "pause" conforme o estado da aba que recebeu a tecla, que pode
// estar pausada enquanto outra toca. Por isso a decisão usa o estado de todas as abas:
// se alguma toca, pausa tudo; se nenhuma toca, retoma.
async function toggleAll() {
  const ids = await channelIds();
  const playing = await playingIds(ids);
  await (playing.length > 0 ? pauseAll(playing) : playAll(ids));
}

export default defineBackground(() => {
  browser.runtime.onMessage.addListener((msg: MediaKeyMessage) => {
    if (msg?.type !== "MEDIA_KEY") return;
    void toggleAll();
  });
});
