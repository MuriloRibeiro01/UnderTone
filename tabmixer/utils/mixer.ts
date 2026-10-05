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
