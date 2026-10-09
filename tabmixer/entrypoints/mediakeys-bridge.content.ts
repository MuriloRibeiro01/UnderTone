// entrypoints/mediakeys-bridge.content.ts
// Chrome: leva a tecla de mídia do mediakeys-main.content.ts (mundo da página) ao background.
// O evento passa pela página, então um script do YouTube também poderia dispará-lo;
// no pior caso isso pausa ou retoma as abas, o que não expõe nada.

import { MEDIA_KEY_EVENT, type MediaKeyMessage } from "@/utils/mixer";

export default defineContentScript({
  matches: ["*://*.youtube.com/*"],
  include: ["chrome"],
  runAt: "document_start",
  main() {
    window.addEventListener(MEDIA_KEY_EVENT, (e) => {
      const action = (e as CustomEvent).detail;
      if (action !== "play" && action !== "pause") return;
      const msg: MediaKeyMessage = { type: "MEDIA_KEY", action };
      void browser.runtime.sendMessage(msg);
    });
  },
});
