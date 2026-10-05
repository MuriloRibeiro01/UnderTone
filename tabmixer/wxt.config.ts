import { defineConfig } from "wxt";

// https://wxt.dev/api/config.html
export default defineConfig({
  modules: ["@wxt-dev/module-react"],
  manifest: {
    name: "TabMixer",
    description: "Controle volume e pause de várias abas do YouTube em um só lugar.",
    // Necessário pra ler URL/título das abas e injetar o content script.
    host_permissions: ["*://*.youtube.com/*"],
    // Volume master e "Pausar tudo" persistem entre aberturas do popup.
    permissions: ["storage"],
    browser_specific_settings: {
      gecko: { id: "tabmixer@example.com" },
    },
  },
});