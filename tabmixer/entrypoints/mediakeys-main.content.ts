// entrypoints/mediakeys-main.content.ts
// Chrome: faz o play/pause do fone (e de outras teclas de mídia) valer para todas as abas.
// Mesma estratégia do mediakeys.content.ts (Firefox): interceptar o setActionHandler da
// página para que os handlers de play/pause do YouTube não substituam os nossos.
//
// Roda no mundo da página (world: "MAIN"), que no Chrome não passa pela CSP do YouTube
// quando declarado no manifest. Aqui não existe browser.runtime, então o comando segue
// por evento até o mediakeys-bridge.content.ts.

import { MEDIA_KEY_EVENT } from "@/utils/mixer";

export default defineContentScript({
  matches: ["*://*.youtube.com/*"],
  include: ["chrome"],
  world: "MAIN",
  runAt: "document_start",
  main() {
    const proto = MediaSession.prototype;
    const original = proto.setActionHandler;

    proto.setActionHandler = function (action, handler) {
      if (action === "play" || action === "pause") return; // o YouTube não assume play/pause
      return original.call(this, action, handler);
    };

    const forward = (action: "play" | "pause") => () =>
      window.dispatchEvent(new CustomEvent(MEDIA_KEY_EVENT, { detail: action }));
    original.call(navigator.mediaSession, "play", forward("play"));
    original.call(navigator.mediaSession, "pause", forward("pause"));
  },
});
