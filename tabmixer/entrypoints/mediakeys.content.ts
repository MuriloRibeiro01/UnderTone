// entrypoints/mediakeys.content.ts
// Firefox: faz o play/pause do fone (e de outras teclas de mídia) valer para todas as abas.
//
// O navegador entrega a tecla de mídia a uma só aba, chamando o handler de "play"/"pause"
// da Media Session dela. O YouTube registra os próprios handlers e os registra de novo a
// cada mudança no player, então aqui interceptamos o setActionHandler da página: os
// pedidos de play/pause do YouTube são ignorados e os nossos ficam no lugar.
//
// A CSP do YouTube (nonce + strict-dynamic + Trusted Types) impede injetar um <script>
// na página. No Firefox, o content script altera o objeto da página por Xray
// (wrappedJSObject + exportFunction), o que não passa pela CSP.
// No Chrome, ver mediakeys-main.content.ts.

import type { MediaKeyMessage } from "@/utils/mixer";

declare function exportFunction<T extends Function>(fn: T, target: object): T;

export default defineContentScript({
  matches: ["*://*.youtube.com/*"],
  include: ["firefox"],
  runAt: "document_start",
  main() {
    const page = (window as any).wrappedJSObject;
    const proto = page?.MediaSession?.prototype;
    if (!proto) return;

    const original = proto.setActionHandler;
    proto.setActionHandler = exportFunction(function (this: MediaSession, action: string, handler: unknown) {
      if (action === "play" || action === "pause") return; // o YouTube não assume play/pause
      return original.call(this, action, handler);
    }, page);

    const forward = (action: MediaKeyMessage["action"]) => () => {
      const msg: MediaKeyMessage = { type: "MEDIA_KEY", action };
      void browser.runtime.sendMessage(msg);
    };
    // Pelo Xray, navigator.mediaSession enxerga o método nativo, não o substituto acima.
    navigator.mediaSession.setActionHandler("play", forward("play"));
    navigator.mediaSession.setActionHandler("pause", forward("pause"));
  },
});
