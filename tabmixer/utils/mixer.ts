// Contrato compartilhado entre o popup e o content script.

/** Volume master e mudo geral, persistidos em storage.local. */
export type MasterState = { volume: number; muted: boolean }; // volume 0–100

/** Estado de um canal (aba), como o content script reporta. */
export type ChannelState = { volume: number; muted: boolean; paused: boolean }; // volume 0–100

export type Message =
  | { type: "GET_STATE" }
  | { type: "SET_VOLUME"; value: number } // 0 a 100
  | { type: "SET_MUTED"; value: boolean }
  | { type: "SET_PAUSED"; value: boolean };

export const MASTER_KEY = "master";
/** Abas pausadas pelo "Pausar tudo" — só elas voltam com "Retomar". */
export const PAUSED_BY_ALL_KEY = "pausedByAll";

/** Abas que viram canais: páginas de vídeo do YouTube. */
export const URL_PATTERNS = ["*://*.youtube.com/watch*", "*://*.youtube.com/shorts/*"];

/** Content script → background: o navegador entregou um comando de mídia (fone, teclado, SO) a esta aba.
 *  O background alterna pelo estado de todas as abas; `action` é o que o navegador pediu à aba. */
export type MediaKeyMessage = { type: "MEDIA_KEY"; action: "play" | "pause" };

/** Chrome: evento do script no mundo da página para a ponte que fala com o background. */
export const MEDIA_KEY_EVENT = "undertone:media-key";
